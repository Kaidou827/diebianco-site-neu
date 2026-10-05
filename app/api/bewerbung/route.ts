import { type NextRequest, NextResponse } from "next/server"
import {
  bewerbungSchema,
  bewerbungAntwortenLesbar,
  STELLE_LABEL,
  KONTAKTWUNSCH,
  type Stelle,
} from "@/lib/jobs"
import { normalisiereTelefonE164 } from "@/lib/lead-logic"
import { baueTransporter, MAIL_FROM_FULL } from "@/lib/mailer"
import { bewerbungBenachrichtigung, bewerbungEingangsbestaetigung } from "@/lib/email-texts"
import { waBewerbungAntwortLink, waBewerbungLink } from "@/lib/whatsapp"

/**
 * POST /api/bewerbung
 * ─────────────────────────────────────────────────────────────────────────
 * Backend der Bewerbungs-Landingpages. Getrennt vom Lead-/Anfrage-Flow.
 * Muster wie /api/anfrage: JSON, serverseitige Validierung (zod), Honeypot,
 * Nodemailer über den geteilten Transport. Bewusst KEIN HubSpot – Bewerber
 * sind keine Kunden und landen nicht im CRM (nur Mail an den Salon + CC).
 * Kein Redirect hier – das Formular leitet auf /jobs/danke weiter.
 * ─────────────────────────────────────────────────────────────────────────
 */

const BEWERBUNG_MAIL_TO = (process.env.BEWERBUNG_MAIL_TO || "businessdiebianco@gmail.com")
  .split(/[;,]/)
  .map((s) => s.trim())
  .filter(Boolean)
const BEWERBUNG_MAIL_CC = (process.env.BEWERBUNG_MAIL_CC || "scharam.saleh@gmail.com")
  .split(/[;,]/)
  .map((s) => s.trim())
  .filter(Boolean)
const BEWERBUNG_MAIL_ADRESSE = BEWERBUNG_MAIL_TO[0] || "businessdiebianco@gmail.com"

function kontaktwunschLabel(v: string): string {
  return KONTAKTWUNSCH.find((o) => o.value === v)?.label ?? "WhatsApp"
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, message: "Ungültige Anfrage." }, { status: 400 })
  }

  const parsed = bewerbungSchema.safeParse(body)
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || "Bitte prüfe deine Eingaben."
    return NextResponse.json({ ok: false, message }, { status: 400 })
  }
  const d = parsed.data
  const stelle = d.stelle as Stelle
  const stelleLabel = STELLE_LABEL[stelle]

  // Telefon normalisieren (E.164, DE-Default). Nicht normalisierbar → Original.
  const phoneE164 = normalisiereTelefonE164(d.telefon)
  const telefonAnzeige = phoneE164 || d.telefon
  const telHref = phoneE164 ? `tel:${phoneE164}` : `tel:${d.telefon.replace(/[^\d+]/g, "")}`
  const waAntwortLink = waBewerbungAntwortLink({ vorname: d.vorname, stelleLabel, phoneE164 })

  const eingang = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date())

  const quelle =
    `${d.quelle_seite || "/jobs"} · utm: ${d.utm_source || "-"}/${d.utm_medium || "-"}/${d.utm_campaign || "-"}` +
    `${d.utm_content ? "/" + d.utm_content : ""} · fbclid: ${d.fbclid ? "ja" : "nein"}`

  const salonMail = bewerbungBenachrichtigung({
    stelleLabel,
    vorname: d.vorname,
    nachname: d.nachname,
    telefonAnzeige,
    telHref,
    email: d.email,
    kontaktwunschLabel: kontaktwunschLabel(d.kontaktwunsch),
    antworten: bewerbungAntwortenLesbar(stelle, d.antworten),
    waAntwortLink,
    quelle,
    eingang,
  })

  const transporter = baueTransporter()
  if (!transporter) {
    console.error("[bewerbung] SMTP nicht konfiguriert.")
    return NextResponse.json(
      { ok: false, message: "Das hat gerade nicht geklappt – schreib uns kurz per WhatsApp.", whatsapp: waBewerbungLink(stelle) },
      { status: 500 },
    )
  }

  // 1) Benachrichtigung an den Salon – MUSS ankommen.
  try {
    await transporter.sendMail({
      from: MAIL_FROM_FULL,
      to: BEWERBUNG_MAIL_TO,
      cc: BEWERBUNG_MAIL_CC.length ? BEWERBUNG_MAIL_CC : undefined,
      replyTo: d.email || undefined,
      subject: salonMail.subject,
      text: salonMail.text,
      html: salonMail.html,
    })
  } catch (err) {
    console.error("[bewerbung] Salon-Mail fehlgeschlagen:", err)
    return NextResponse.json(
      { ok: false, message: "Das hat gerade nicht geklappt – schreib uns kurz per WhatsApp.", whatsapp: waBewerbungLink(stelle) },
      { status: 500 },
    )
  }

  // 2) Eingangsbestätigung an die Bewerber/in (best effort, nur mit E-Mail).
  if (d.email) {
    try {
      const inhalt = bewerbungEingangsbestaetigung({
        vorname: d.vorname,
        stelleLabel,
        kontaktwegLabel: d.kontaktwunsch === "anruf" ? "Telefon" : "WhatsApp",
        waSalonLink: waBewerbungLink(stelle),
        bewerbungMail: BEWERBUNG_MAIL_ADRESSE,
      })
      await transporter.sendMail({
        from: MAIL_FROM_FULL,
        to: d.email,
        replyTo: BEWERBUNG_MAIL_ADRESSE,
        subject: inhalt.subject,
        text: inhalt.text,
        html: inhalt.html,
      })
    } catch (err) {
      console.error("[bewerbung] Bestätigungsmail fehlgeschlagen:", err)
    }
  }

  return NextResponse.json({ ok: true })
}
