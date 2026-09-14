import { type NextRequest, NextResponse } from "next/server"
import { FELDER } from "@/lib/hubspot/schema"
import {
  behandlungLabel,
  faelligkeitTimestamp,
  leadQualitaet,
  leadWertProxy,
  normalisiereTelefonE164,
  prioritaetFuerBehandlung,
  zeitraumLabel,
} from "@/lib/lead-logic"
import {
  aktualisiereKontakt,
  erstelleAufgabe,
  erstelleKontakt,
  hubspotKonfiguriert,
  kontaktDeepLink,
  leseKontakt,
  sucheKontaktId,
} from "@/lib/hubspot"
import { eingangsbestaetigung, salonBenachrichtigung } from "@/lib/email-texts"
import { sendeMail, MAIL_EMPFAENGER, MAIL_REPLYTO } from "@/lib/mailer"

/**
 * POST /api/anfrage
 * ─────────────────────────────────────────────────────────────────────────
 * Backend der zweiphasigen Terminanfrage. HubSpot Starter hat keine Workflows,
 * deshalb passiert die Lead-Aufbereitung vollständig hier:
 *
 *   Welle 1  Kontakt per E-Mail upserten, alle Infos strukturiert setzen,
 *            Rückruf-Aufgabe für Teresa anlegen, Eingangsbestätigung an die
 *            Kundin senden + Salon benachrichtigen.
 *   Welle 2  (nur Deep-Variante) je Antwort ein PATCH auf die bestehende
 *            Kontakt-ID – wer abbricht, hinterlässt trotzdem alles bis dahin.
 *
 * Alle HubSpot-Zugriffe laufen über lib/hubspot.ts. Portal 146440145.
 * ─────────────────────────────────────────────────────────────────────────
 */

// Owner (Teresa) – als ENV überschreibbar, Default lt. Vorgabe.
const OWNER_ID = process.env.HUBSPOT_DEFAULT_OWNER_ID || "81184186"

// Idempotenz-Fenster: identische Anfrage innerhalb dieser Zeit → keine zweite
// Aufgabe/Mail (Serverless-tauglich, da am Kontakt hinterlegt statt In-Memory).
const IDEMPOTENZ_MS = 5 * 60 * 1000

/** Nur diese Property-Namen dürfen aus Welle 2 (Formular) geschrieben werden. */
const ERLAUBTE_FELDER = new Set(FELDER.filter((f) => f.welle !== "workflow").map((f) => f.hubspotName))

// ── Cloudflare Turnstile ────────────────────────────────────────────────────
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

/** Datetime-Property (HubSpot: epoch-ms oder ISO) → ms, sonst null. */
function parseHubspotDatetime(wert: string | null | undefined): number | null {
  if (!wert) return null
  const alsZahl = Number(wert)
  if (Number.isFinite(alsZahl) && alsZahl > 0) return alsZahl
  const alsDatum = Date.parse(wert)
  return Number.isNaN(alsDatum) ? null : alsDatum
}

// ── Welle 1: Kontakt anlegen/aktualisieren + Aufgabe + Mails ─────────────────
async function handleWelle1(body: Record<string, unknown>, ip: string): Promise<NextResponse> {
  const firstname = String(body.firstname || "").trim()
  const lastname = String(body.lastname || "").trim()
  const phoneRoh = String(body.phone || "").trim()
  const email = String(body.email || "").trim()
  const extra = (body.extra || {}) as Record<string, unknown>

  const wunschBehandlung = String(body.wunsch_behandlung || "").trim()
  const wunschzeitraum = String(body.wunschzeitraum ?? extra.wunschzeitraum ?? "").trim()
  const whatsappOk = String(body.whatsapp_ok || "").trim()
  const nachricht = String(body.nachricht ?? extra.anmerkung_kundin ?? "").trim()
  const quelleSeite = String(body.quelle_seite || "").trim() || "/kontakt"
  const einwilligungMarketing = Boolean(body.einwilligung_marketing)
  const tracking = (body.tracking || {}) as Record<string, unknown>

  if (!firstname || !lastname || !phoneRoh || !email) {
    return NextResponse.json(
      { ok: false, message: "Vor- und Nachname, Telefon und E-Mail sind erforderlich." },
      { status: 400 },
    )
  }

  // Anti-Spam
  if (body.spamProtectionRequired) {
    if (String(body.honeypot || "").trim().length > 0) {
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

  const jetzt = new Date()
  const phoneE164 = normalisiereTelefonE164(phoneRoh)
  const prioritaet = prioritaetFuerBehandlung(wunschBehandlung)
  const leadWert = leadWertProxy(wunschBehandlung)
  const qualitaet = leadQualitaet(prioritaet, wunschzeitraum)

  // ── Properties (server-kontrolliert) ──
  const properties: Record<string, string> = {
    firstname,
    phone: phoneE164 || phoneRoh,
    email,
    hubspot_owner_id: OWNER_ID,
    prioritaet,
    lead_qualitaet: qualitaet,
    lead_wert_proxy: String(leadWert),
    quelle_seite: quelleSeite,
  }
  if (lastname) properties.lastname = lastname
  if (wunschBehandlung) properties.wunsch_behandlung = wunschBehandlung
  if (wunschzeitraum) properties.wunschzeitraum = wunschzeitraum
  if (whatsappOk) properties.whatsapp_ok = whatsappOk
  if (nachricht) properties.nachricht_anfrage = nachricht
  // Kampagnen-Attribution → gleichnamige Properties.
  for (const key of ["gclid", "utm_source", "utm_medium", "utm_campaign"] as const) {
    const v = String(tracking[key] ?? body[key] ?? "").trim()
    if (v) properties[key] = v
  }
  // gbraid/wbraid/utm_term bewusst NICHT als Property – nur ins Log.
  const nurLog: Record<string, string> = {}
  for (const key of ["gbraid", "wbraid", "utm_term"] as const) {
    const v = String(tracking[key] ?? body[key] ?? "").trim()
    if (v) nurLog[key] = v
  }
  if (Object.keys(nurLog).length) console.log("Attribution (nur Log, keine Property):", nurLog)
  // Marketing-Einwilligung nur SETZEN, nie automatisch widerrufen.
  if (einwilligungMarketing) {
    properties.einwilligung_marketing = "true"
    properties.einwilligung_zeitpunkt = String(jetzt.getTime())
  }

  // ── Upsert + Idempotenz ──
  let contactId: string | null = null
  let istDuplikat = false
  try {
    if (!hubspotKonfiguriert()) throw new Error("HUBSPOT_PRIVATE_APP_TOKEN fehlt.")
    const vorhandeneId = await sucheKontaktId(email)
    if (vorhandeneId) {
      const alt = await leseKontakt(vorhandeneId, ["eingangsbestaetigung_gesendet", "lead_status_intern"])
      const letzte = parseHubspotDatetime(alt.eingangsbestaetigung_gesendet)
      if (letzte && jetzt.getTime() - letzte < IDEMPOTENZ_MS) istDuplikat = true
      // Bestehenden internen Status niemals überschreiben.
      if (!alt.lead_status_intern) properties.lead_status_intern = "neu"
      await aktualisiereKontakt(vorhandeneId, properties)
      contactId = vorhandeneId
    } else {
      properties.lead_status_intern = "neu"
      contactId = await erstelleKontakt(properties)
    }
  } catch (err) {
    // HubSpot-Fehler dürfen den Lead nicht verschlucken → Salon-Mail folgt unten.
    console.error("Welle 1: HubSpot-Upsert fehlgeschlagen:", err)
  }

  // Bei erkanntem Duplikat: keine zweite Aufgabe, keine zweite Mail.
  if (istDuplikat) {
    console.warn(`Welle 1: Duplikat für ${email} innerhalb ${IDEMPOTENZ_MS / 1000}s – Aufgabe/Mail übersprungen.`)
    return NextResponse.json({ ok: true, contactId: contactId ?? undefined, duplicate: true })
  }

  // ── Rückruf-Aufgabe (nur wenn Kontakt existiert) ──
  if (contactId) {
    const behandlung = behandlungLabel(wunschBehandlung)
    const zeitraum = zeitraumLabel(wunschzeitraum) || "kein Zeitraum angegeben"
    const wa = whatsappOk === "ja_gerne" ? "Ja" : whatsappOk === "lieber_anrufen" ? "Nein" : "—"
    const eingangStr = new Intl.DateTimeFormat("de-DE", {
      timeZone: "Europe/Berlin", dateStyle: "short", timeStyle: "short",
    }).format(jetzt)
    const prioMap: Record<string, "HIGH" | "MEDIUM" | "LOW"> = { hoch: "HIGH", mittel: "MEDIUM", niedrig: "LOW" }
    const faellig = faelligkeitTimestamp(jetzt)

    const aufgabe = await erstelleAufgabe({
      contactId,
      subject: `Rückruf: ${firstname} – ${behandlung} – Wunsch: ${zeitraum}`,
      body: [
        `Telefon: ${phoneE164 || phoneRoh}`,
        `WhatsApp: ${wa}`,
        `Nachricht: ${nachricht || "—"}`,
        `Priorität: ${prioritaet}`,
        `Eingang: ${eingangStr}`,
      ].join("\n"),
      timestampMs: faellig,
      // Erinnerung zur Fälligkeit → Teresa bekommt einen Push.
      reminderMs: faellig,
      priority: prioMap[prioritaet] || "MEDIUM",
      ownerId: OWNER_ID,
    })
    if (!aufgabe.ok) {
      console.error(`Welle 1: Aufgabe nicht angelegt (Status ${aufgabe.status ?? "?"}): ${aufgabe.fehler ?? ""}`)
    }
  }

  // ── Salon-Benachrichtigung (best effort) ──
  try {
    await sendeMail({
      to: MAIL_EMPFAENGER,
      replyTo: email || undefined,
      inhalt: salonBenachrichtigung({
        firstname, lastname, phoneE164: phoneE164 || phoneRoh, email,
        behandlung: wunschBehandlung, wunschzeitraum, nachricht,
        prioritaet, leadQualitaet: qualitaet, leadWert, whatsappOk,
        eingang: new Intl.DateTimeFormat("de-DE", {
          timeZone: "Europe/Berlin", dateStyle: "short", timeStyle: "short",
        }).format(jetzt),
        deepLink: contactId ? kontaktDeepLink(contactId) : "(Kontakt konnte nicht in HubSpot gespeichert werden)",
      }),
    })
  } catch (mailErr) {
    console.error("Salon-Benachrichtigung fehlgeschlagen:", mailErr)
  }

  // ── Eingangsbestätigung an die Kundin (best effort) ──
  try {
    await sendeMail({
      to: email,
      replyTo: MAIL_REPLYTO,
      inhalt: eingangsbestaetigung({ firstname, behandlung: wunschBehandlung, wunschzeitraum, whatsappOk }),
    })
    // Erst nach erfolgreichem Versand markieren (steuert die Idempotenz).
    if (contactId) {
      try {
        await aktualisiereKontakt(contactId, { eingangsbestaetigung_gesendet: String(Date.now()) })
      } catch (patchErr) {
        console.error("Konnte eingangsbestaetigung_gesendet nicht setzen:", patchErr)
      }
    }
  } catch (mailErr) {
    console.error("Eingangsbestätigung fehlgeschlagen:", mailErr)
  }

  // Erfolg auch dann, wenn HubSpot ausfiel (Lead ist per Salon-Mail gesichert)
  // oder die Kundinnen-Mail scheiterte.
  return NextResponse.json({ ok: true, contactId: contactId ?? undefined })
}

// ── Welle 2: einzelne Antwort auf bestehende Kontakt-ID schreiben ───────────
async function handleWelle2(body: Record<string, unknown>): Promise<NextResponse> {
  const contactId = String(body.contactId || "").trim()
  const updates = (body.updates || {}) as Record<string, unknown>
  if (!contactId) {
    return NextResponse.json({ ok: false, message: "contactId fehlt." }, { status: 400 })
  }

  const properties: Record<string, string> = {}
  for (const [name, value] of Object.entries(updates)) {
    if (ERLAUBTE_FELDER.has(name) && value != null && String(value).length > 0) {
      properties[name] = String(value)
    }
  }
  if (Object.keys(properties).length === 0) {
    return NextResponse.json({ ok: false, message: "Keine gültigen Felder zum Speichern." }, { status: 400 })
  }
  if (!hubspotKonfiguriert()) {
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
    const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim()
    const welle = Number(body.welle)
    if (welle === 1) return await handleWelle1(body, ip)
    if (welle === 2) return await handleWelle2(body)
    return NextResponse.json({ ok: false, message: "Ungültige oder fehlende Welle." }, { status: 400 })
  } catch (err) {
    console.error("Serverfehler /api/anfrage:", err)
    return NextResponse.json({ ok: false, message: "Server-Fehler beim Verarbeiten der Anfrage." }, { status: 500 })
  }
}
