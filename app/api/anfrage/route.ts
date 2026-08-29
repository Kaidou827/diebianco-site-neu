import { type NextRequest, NextResponse } from "next/server"
import { FELDER } from "@/lib/hubspot/schema"

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

  try {
    const vorhandeneId = await findeKontaktId(email)
    const contactId = vorhandeneId
      ? (await aktualisiereKontakt(vorhandeneId, properties), vorhandeneId)
      : await legeKontaktAn(properties)
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
