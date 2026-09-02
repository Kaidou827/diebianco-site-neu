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

// ── E-Mail (Lead-Karte ans Team + Bestätigung an die Kundin) ────────────────
// Empfänger Team: über MAIL_TO überschreibbar; Default = Salon + Scharam.
// Absender:  MAIL_FROM, sonst der authentifizierte SMTP-Account, sonst salon@diebianco.de.
const MAIL_EMPFAENGER = process.env.MAIL_TO
  ? process.env.MAIL_TO.split(/[;,]/).map((s) => s.trim()).filter(Boolean)
  : ["salon@diebianco.de", "scharam.saleh@gmail.com"]
const MAIL_ABSENDER = process.env.MAIL_FROM || process.env.SMTP_USER || "salon@diebianco.de"

/** Slug -> Anzeige-Label (für lesbare Mails). */
function labelMap(hubspotName: string): Record<string, string> {
  return Object.fromEntries(
    (FELDER.find((f) => f.hubspotName === hubspotName)?.optionen ?? []).map((l) => [optionWert(l), l]),
  )
}
const BEHANDLUNG_LABELS = labelMap("wunsch_behandlung")
const ZEITRAUM_LABELS = labelMap("wunschzeitraum")

function baueTransporter() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host || !port || Number.isNaN(port) || !user || !pass) {
    console.warn("SMTP unvollständig — E-Mail übersprungen.")
    return null
  }
  const secure = process.env.SMTP_SECURE === "true" || port === 465
  return nodemailer.createTransport({ host, port, secure, auth: { user, pass } })
}

/** Aufbereitete Lead-Karte ans Team (scannbar, Anruf-fertig). */
async function sendeLeadKarte(d: {
  firstname: string
  lastname: string
  phone: string
  email: string
  wunsch: string
  wunschzeitraum: string
  anmerkung: string
  deep: boolean
}): Promise<void> {
  const transporter = baueTransporter()
  if (!transporter) return
  const name = `${d.firstname} ${d.lastname}`.trim()
  const text = [
    "🔔 Neue Anfrage – DIE BIANCO",
    "",
    `${name} · ${d.phone}`,
    `Behandlung: ${d.wunsch || "-"}`,
    d.email ? `E-Mail: ${d.email}` : "",
    d.wunschzeitraum ? `Wunschzeitraum: ${d.wunschzeitraum}` : "",
    d.anmerkung ? `Nachricht: „${d.anmerkung}"` : "",
    "",
    d.deep
      ? "Weitere Detailangaben & Priorität folgen im Kontakt in HubSpot."
      : "Status, Priorität & alle Angaben im Kontakt in HubSpot.",
  ]
    .filter(Boolean)
    .join("\n")

  await transporter.sendMail({
    from: MAIL_ABSENDER,
    to: MAIL_EMPFAENGER,
    replyTo: d.email || undefined,
    subject: `Neue Anfrage: ${d.firstname} – ${d.wunsch || "Termin"}`,
    text,
  })
}

/** Automatische Eingangsbestätigung an die Kundin. */
async function sendeKundenBestaetigung(email: string, firstname: string): Promise<void> {
  if (!email) return
  const transporter = baueTransporter()
  if (!transporter) return
  const text = [
    `Hallo ${firstname},`,
    "",
    "vielen Dank für deine Anfrage bei DIE BIANCO!",
    "Teresa meldet sich persönlich bei dir – in der Regel innerhalb von 24 Stunden.",
    "",
    "Bis bald & liebe Grüße",
    "Dein Team von DIE BIANCO",
    "Siedlung Egelsberg 1 · 47802 Krefeld · +49 174 3091973",
  ].join("\n")

  await transporter.sendMail({
    from: MAIL_ABSENDER,
    to: email,
    subject: "Deine Anfrage bei DIE BIANCO – wir melden uns",
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

  const properties: Record<string, string> = { firstname, phone }
  if (email) properties.email = email
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

  // Automatische Aufbereitung (server-seitig, nicht aus dem Formular).
  // Baseline; echte Priorität/Qualität wird in Welle 2 aus der Dringlichkeit verfeinert.
  properties.lead_status_intern = "neu"
  properties.prioritaet = "mittel"
  properties.lead_qualitaet = "warm"

  try {
    const vorhandeneId = email ? await findeKontaktId(email) : null
    const contactId = vorhandeneId
      ? (await aktualisiereKontakt(vorhandeneId, properties), vorhandeneId)
      : await legeKontaktAn(properties)

    // Best effort — Mail-Fehler blockieren die Antwort nicht.
    try {
      await sendeLeadKarte({
        firstname,
        lastname,
        phone,
        email,
        wunsch: BEHANDLUNG_LABELS[wunschBehandlung] || wunschBehandlung,
        wunschzeitraum: ZEITRAUM_LABELS[String(extra.wunschzeitraum || "")] || "",
        anmerkung: typeof extra.anmerkung_kundin === "string" ? extra.anmerkung_kundin : "",
        deep: String(body.variante || "") === "deep",
      })
    } catch (mailErr) {
      console.error("Lead-Karte-Mail fehlgeschlagen:", mailErr)
    }
    try {
      await sendeKundenBestaetigung(email, firstname)
    } catch (mailErr) {
      console.error("Kundenbestätigung fehlgeschlagen:", mailErr)
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

  // Priorität & Lead-Qualität aus der Dringlichkeit ableiten (server-seitig).
  if (properties.dringlichkeit) {
    const ableitung: Record<string, { prioritaet: string; lead_qualitaet: string }> = {
      so_schnell_wie_moeglich: { prioritaet: "hoch", lead_qualitaet: "heiss" },
      in_2_4_wochen: { prioritaet: "mittel", lead_qualitaet: "warm" },
      ich_bin_flexibel: { prioritaet: "niedrig", lead_qualitaet: "kalt" },
    }
    const a = ableitung[properties.dringlichkeit]
    if (a) {
      properties.prioritaet = a.prioritaet
      properties.lead_qualitaet = a.lead_qualitaet
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
