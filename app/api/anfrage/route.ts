import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { FELDER, optionWert } from "@/lib/hubspot/schema"

/**
 * POST /api/anfrage
 * ─────────────────────────────────────────────────────────────────────────
 * Backend für das zweiphasige Anfrage-Formular (Briefing Abschnitt 2).
 *
 *   Welle 1 (verbindlich): legt den Kontakt an/aktualisiert ihn per E-Mail
 *                          und gibt die HubSpot-Kontakt-ID zurück.
 *   Welle 2 (freiwillig):  schreibt jede Antwort EINZELN per PATCH auf die
 *                          bestehende Kontakt-ID — wer abbricht, hinterlässt
 *                          trotzdem alles bis zu diesem Punkt.
 *
 * Schreibt ausschließlich die im Schema (lib/hubspot/schema.ts) definierten
 * Properties (Allowlist) → keine Fremdfelder. Portal 146440145.
 * ─────────────────────────────────────────────────────────────────────────
 */

const API_BASE = process.env.HUBSPOT_API_BASE || "https://api.hubapi.com"
const TOKEN = process.env.HUBSPOT_PRIVATE_APP_TOKEN || ""

/** Nur diese Property-Namen dürfen aus dem Formular geschrieben werden. */
const ERLAUBTE_FELDER = new Set(
  FELDER.filter((f) => f.welle !== "workflow").map((f) => f.hubspotName),
)

// ── E-Mail-Benachrichtigung an den Salon ─────────────────────────────────────
// Empfänger: über MAIL_TO überschreibbar; Default = Salon + Scharam (kein techotastic mehr).
// Absender:  MAIL_FROM, sonst der authentifizierte SMTP-Account (beste Zustellbarkeit),
//            sonst salon@diebianco.de.
const MAIL_EMPFAENGER = process.env.MAIL_TO
  ? process.env.MAIL_TO.split(/[;,]/).map((s) => s.trim()).filter(Boolean)
  : ["salon@diebianco.de", "scharam.saleh@gmail.com"]
const MAIL_ABSENDER = process.env.MAIL_FROM || process.env.SMTP_USER || "salon@diebianco.de"

/** Slug -> Anzeige-Label der Wunsch-Behandlung (für lesbare Mails). */
const BEHANDLUNG_LABELS: Record<string, string> = Object.fromEntries(
  (FELDER.find((f) => f.hubspotName === "wunsch_behandlung")?.optionen ?? []).map((l) => [optionWert(l), l]),
)

async function sendeBenachrichtigung(d: {
  firstname: string
  lastname: string
  phone: string
  email: string
  wunsch: string
  anmerkung: string
}): Promise<void> {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const secure = process.env.SMTP_SECURE === "true" || port === 465
  if (!host || !port || Number.isNaN(port) || !user || !pass) {
    console.warn("SMTP unvollständig — Benachrichtigung übersprungen.")
    return
  }
  const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } })
  const text = [
    "Neue Terminanfrage über die Website",
    "",
    `Name: ${`${d.firstname} ${d.lastname}`.trim()}`,
    `Telefon: ${d.phone}`,
    `E-Mail: ${d.email}`,
    `Wunsch-Behandlung: ${d.wunsch || "-"}`,
    d.anmerkung ? `Nachricht: ${d.anmerkung}` : "",
    "",
    "Der vollständige Kontakt liegt in HubSpot.",
  ]
    .filter(Boolean)
    .join("\n")

  await transporter.sendMail({
    from: MAIL_ABSENDER,
    to: MAIL_EMPFAENGER,
    replyTo: d.email,
    subject: `Neue Anfrage: ${d.firstname} – ${d.wunsch || "Termin"}`,
    text,
  })
}

// ── HTTP-Helfer ────────────────────────────────────────────────────────────
async function hsFetch(pfad: string, init?: RequestInit): Promise<Response> {
  return fetch(`${API_BASE}${pfad}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  })
}

// ── Cloudflare Turnstile prüfen (wie bestehende Route) ──────────────────────
async function turnstileGueltig(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    console.warn("TURNSTILE_SECRET_KEY fehlt; überspringe CAPTCHA-Prüfung.")
    return true
  }
  const body = new URLSearchParams({ secret, response: token })
  if (ip) body.append("remoteip", ip)
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  })
  const json = (await res.json()) as { success?: boolean }
  return Boolean(json.success)
}

// ── Kontakt per E-Mail finden ───────────────────────────────────────────────
async function findeKontaktId(email: string): Promise<string | null> {
  const res = await hsFetch("/crm/v3/objects/contacts/search", {
    method: "POST",
    body: JSON.stringify({
      filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: email }] }],
      properties: ["email"],
      limit: 1,
    }),
  })
  if (!res.ok) {
    throw new Error(`Kontaktsuche fehlgeschlagen: ${res.status} ${await res.text()}`)
  }
  const json = (await res.json()) as { results?: Array<{ id: string }> }
  return json.results?.[0]?.id ?? null
}

async function legeKontaktAn(properties: Record<string, string>): Promise<string> {
  const res = await hsFetch("/crm/v3/objects/contacts", {
    method: "POST",
    body: JSON.stringify({ properties }),
  })
  if (!res.ok) {
    throw new Error(`Kontakt anlegen fehlgeschlagen: ${res.status} ${await res.text()}`)
  }
  const json = (await res.json()) as { id: string }
  return json.id
}

async function aktualisiereKontakt(id: string, properties: Record<string, string>): Promise<void> {
  const res = await hsFetch(`/crm/v3/objects/contacts/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ properties }),
  })
  if (!res.ok) {
    throw new Error(`Kontakt aktualisieren fehlgeschlagen: ${res.status} ${await res.text()}`)
  }
}

// ── Welle 1: Kontakt anlegen/aktualisieren ──────────────────────────────────
async function handleWelle1(body: Record<string, unknown>, ip: string): Promise<NextResponse> {
  const firstname = String(body.firstname || "").trim()
  const lastname = String(body.lastname || "").trim()
  const phone = String(body.phone || "").trim()
  const email = String(body.email || "").trim()
  const wunschBehandlung = String(body.wunsch_behandlung || "").trim()

  if (!firstname || !phone || !email) {
    return NextResponse.json(
      { ok: false, message: "Vorname, Telefon und E-Mail sind erforderlich." },
      { status: 400 },
    )
  }

  // Anti-Spam
  const spamProtectionRequired = Boolean(body.spamProtectionRequired)
  if (spamProtectionRequired) {
    const honeypot = String(body.honeypot || "")
    if (honeypot.trim().length > 0) {
      return NextResponse.json({ ok: false, message: "Anfrage konnte nicht validiert werden." }, { status: 400 })
    }
    const turnstileToken = String(body.turnstileToken || "")
    if (!turnstileToken) {
      return NextResponse.json({ ok: false, message: "Bitte CAPTCHA-Validierung abschliessen." }, { status: 400 })
    }
    if (!(await turnstileGueltig(turnstileToken, ip))) {
      return NextResponse.json({ ok: false, message: "CAPTCHA-Validierung fehlgeschlagen." }, { status: 400 })
    }
  }

  if (!TOKEN) {
    console.error("HUBSPOT_PRIVATE_APP_TOKEN fehlt.")
    return NextResponse.json({ ok: false, message: "Serverkonfiguration unvollständig." }, { status: 500 })
  }

  const properties: Record<string, string> = { firstname, phone, email }
  if (lastname) properties.lastname = lastname
  if (wunschBehandlung && ERLAUBTE_FELDER.has("wunsch_behandlung")) {
    properties.wunsch_behandlung = wunschBehandlung
  }

  // Optionale Zusatzfelder (z.B. anmerkung_kundin bei der Standard-Variante) —
  // nur erlaubte Schema-Felder übernehmen.
  const extra = (body.extra || {}) as Record<string, unknown>
  for (const [name, value] of Object.entries(extra)) {
    if (ERLAUBTE_FELDER.has(name) && value != null && String(value).length > 0) {
      properties[name] = String(value)
    }
  }

  try {
    const vorhandeneId = await findeKontaktId(email)
    const contactId = vorhandeneId
      ? (await aktualisiereKontakt(vorhandeneId, properties), vorhandeneId)
      : await legeKontaktAn(properties)

    // Sofort-Benachrichtigung an den Salon (best effort — Fehler blockiert die Antwort nicht).
    try {
      await sendeBenachrichtigung({
        firstname,
        lastname,
        phone,
        email,
        wunsch: BEHANDLUNG_LABELS[wunschBehandlung] || wunschBehandlung,
        anmerkung: typeof extra.anmerkung_kundin === "string" ? extra.anmerkung_kundin : "",
      })
    } catch (mailErr) {
      console.error("Benachrichtigungs-Mail fehlgeschlagen:", mailErr)
    }

    return NextResponse.json({ ok: true, contactId })
  } catch (err) {
    console.error("Welle 1 Fehler:", err)
    return NextResponse.json({ ok: false, message: "Kontakt konnte nicht gespeichert werden." }, { status: 502 })
  }
}

// ── Welle 2: Einzelne Antwort auf bestehende Kontakt-ID schreiben ───────────
async function handleWelle2(body: Record<string, unknown>): Promise<NextResponse> {
  const contactId = String(body.contactId || "").trim()
  const updates = (body.updates || {}) as Record<string, unknown>

  if (!contactId) {
    return NextResponse.json({ ok: false, message: "contactId fehlt." }, { status: 400 })
  }

  // Nur erlaubte Felder übernehmen, Werte zu String normalisieren.
  const properties: Record<string, string> = {}
  for (const [name, value] of Object.entries(updates)) {
    if (ERLAUBTE_FELDER.has(name) && value != null && String(value).length > 0) {
      properties[name] = String(value)
    }
  }

  if (Object.keys(properties).length === 0) {
    return NextResponse.json({ ok: false, message: "Keine gültigen Felder zum Speichern." }, { status: 400 })
  }

  if (!TOKEN) {
    console.error("HUBSPOT_PRIVATE_APP_TOKEN fehlt.")
    return NextResponse.json({ ok: false, message: "Serverkonfiguration unvollständig." }, { status: 500 })
  }

  try {
    await aktualisiereKontakt(contactId, properties)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Welle 2 Fehler:", err)
    return NextResponse.json({ ok: false, message: "Antwort konnte nicht gespeichert werden." }, { status: 502 })
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as Record<string, unknown>
    const forwardedFor = request.headers.get("x-forwarded-for") ?? ""
    const ip = forwardedFor.split(",")[0].trim()

    const welle = Number(body.welle)
    if (welle === 1) return await handleWelle1(body, ip)
    if (welle === 2) return await handleWelle2(body)

    return NextResponse.json({ ok: false, message: "Ungültige oder fehlende Welle." }, { status: 400 })
  } catch (err) {
    console.error("Serverfehler /api/anfrage:", err)
    return NextResponse.json({ ok: false, message: "Server-Fehler beim Verarbeiten der Anfrage." }, { status: 500 })
  }
}
