/**
 * lib/email-texts.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Alle E-Mail-Texte an EINER Stelle, damit Teresa/Team Formulierungen freigeben
 * und ändern können, ohne den Route-Code zu durchsuchen.
 *
 *   salonBenachrichtigung()  → Lead-Karte ans Team (scannbar, Anruf-fertig)
 *   eingangsbestaetigung()   → automatische Antwort an die Kundin (Du-Ansprache)
 *
 * Beide liefern { subject, text, html }. Kein Tracking-Pixel, keine externen
 * Assets. Kontakt/Öffnungszeiten kommen aus lib/site-info.ts.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { salonTelefon, salonTelefonHref, salonEmail, salonAdresse } from "@/lib/site-info"
import { behandlungLabel, zeitraumLabel } from "@/lib/lead-logic"

const SITE = process.env.SITE_URL || "https://www.diebianco.de"
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${salonAdresse.strasse} ${salonAdresse.ort}`,
)}`

/** HTML-escape für alle in Templates eingesetzten (Nutzer-)Werte. */
function esc(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export interface EmailInhalt {
  subject: string
  text: string
  html: string
}

// ── Salon-Benachrichtigung (Team) ───────────────────────────────────────────
export interface SalonDaten {
  firstname: string
  lastname: string
  phoneE164: string
  email: string
  behandlung: string
  wunschzeitraum: string
  nachricht: string
  prioritaet: string
  leadQualitaet: string
  leadWert: number
  whatsappOk: string
  eingang: string
  deepLink: string
}

const PRIO_LABEL: Record<string, string> = { hoch: "Hoch 🔴", mittel: "Mittel 🟡", niedrig: "Niedrig 🟢" }
const QUALI_LABEL: Record<string, string> = { heiss: "Heiß 🔥", warm: "Warm", kalt: "Kalt" }

export function salonBenachrichtigung(d: SalonDaten): EmailInhalt {
  const name = `${d.firstname} ${d.lastname}`.trim() || "Unbekannt"
  const behandlung = behandlungLabel(d.behandlung)
  const zeitraum = zeitraumLabel(d.wunschzeitraum)
  const wa = d.whatsappOk === "ja_gerne" ? "Ja" : d.whatsappOk === "lieber_anrufen" ? "Nein" : "—"
  const prio = PRIO_LABEL[d.prioritaet] || d.prioritaet
  const quali = QUALI_LABEL[d.leadQualitaet] || d.leadQualitaet

  const zeilen: Array<[string, string]> = [
    ["Name", name],
    ["Telefon", d.phoneE164 || "—"],
    ["E-Mail", d.email || "—"],
    ["Behandlung", behandlung],
    ["Wunschzeitraum", zeitraum || "—"],
    ["WhatsApp", wa],
    ["Priorität", prio],
    ["Lead-Qualität", quali],
    ["Lead-Wert (ca.)", `${d.leadWert} €`],
    ["Eingang", d.eingang],
  ]
  if (d.nachricht) zeilen.push(["Nachricht", d.nachricht])

  const text = [
    "🔔 Neue Anfrage – DIE BIANCO",
    "",
    ...zeilen.map(([k, v]) => `${k}: ${v}`),
    "",
    `In HubSpot öffnen: ${d.deepLink}`,
    "",
    "Eine Rückruf-Aufgabe wurde in HubSpot angelegt.",
  ].join("\n")

  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;color:#2C2C2C;max-width:560px">
  <h2 style="margin:0 0 4px">🔔 Neue Anfrage</h2>
  <p style="margin:0 0 16px;color:#8a7d6a">Priorität <strong>${esc(prio)}</strong> · Lead-Qualität <strong>${esc(quali)}</strong> · ca. <strong>${esc(String(d.leadWert))} €</strong></p>
  <table style="border-collapse:collapse;width:100%;font-size:15px">
    ${zeilen
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 12px 6px 0;color:#8a7d6a;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0;font-weight:600">${esc(v)}</td></tr>`,
      )
      .join("")}
  </table>
  <p style="margin:20px 0">
    <a href="${esc(d.deepLink)}" style="background:#B8863D;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;display:inline-block;font-weight:700">Kontakt in HubSpot öffnen →</a>
  </p>
  <p style="margin:0;color:#8a7d6a;font-size:13px">Eine Rückruf-Aufgabe wurde in HubSpot angelegt.</p>
</div>`.trim()

  const prioTag = d.prioritaet === "hoch" ? " [HOCH]" : ""
  return { subject: `Neue Anfrage: ${d.firstname || "Kundin"} – ${behandlung}${prioTag}`, text, html }
}

// ── Eingangsbestätigung (Kundin) ────────────────────────────────────────────
export interface BestaetigungDaten {
  firstname: string
  behandlung: string
  wunschzeitraum: string
  whatsappOk: string
}

const PREIS_ZEILEN = [
  "Damenschnitt ab 80 €",
  "Ansatzfarbe ab 65 €",
  "Strähnen ab 100 €",
  "Balayage ab 180 €",
  "Keratin ab 300 €",
  "Grey Blending nach persönlicher Einschätzung",
]

export function eingangsbestaetigung(d: BestaetigungDaten): EmailInhalt {
  const vorname = d.firstname || "und schön, dass du da bist"
  const hatBehandlung = d.behandlung && d.behandlung !== "weiss_ich_noch_nicht"
  const behandlung = behandlungLabel(d.behandlung)
  const zeitraum = zeitraumLabel(d.wunschzeitraum)
  const perWhatsapp = d.whatsappOk === "ja_gerne"

  const meldeSatz = perWhatsapp
    ? "Teresa meldet sich innerhalb von 24 Stunden (Mo–Sa) persönlich bei dir – per Telefon oder WhatsApp."
    : "Teresa meldet sich innerhalb von 24 Stunden (Mo–Sa) persönlich bei dir – telefonisch."

  const dankeSatz = hatBehandlung
    ? `deine Anfrage für ${behandlung} ist bei uns angekommen.`
    : "deine Anfrage ist bei uns angekommen."

  const zeitraumSatz = zeitraum
    ? `Dein Wunschzeitraum: ${zeitraum}.${d.wunschzeitraum === "samstag" ? " Samstags öffnen wir schon um 7 Uhr." : ""}`
    : ""

  const adresse = `${salonAdresse.strasse}, ${salonAdresse.ort}`

  // ── Text-Alternative ──
  const text = [
    `Hallo ${vorname},`,
    "",
    `vielen Dank – ${dankeSatz}`,
    meldeSatz,
    ...(zeitraumSatz ? ["", zeitraumSatz] : []),
    "",
    "Zur Orientierung (ab-Preise):",
    ...PREIS_ZEILEN.map((z) => `– ${z}`),
    "",
    "So findest du uns:",
    `${adresse}`,
    `Karte: ${MAPS_URL}`,
    "Mo–Fr 9–17 Uhr · Sa 7–14 Uhr · nur mit Termin",
    `Telefon: ${salonTelefon}`,
    "",
    `Unsere Ergebnisse: ${SITE}/ergebnisse`,
    `Behandlungen & Preise: ${SITE}/behandlungen-preise`,
    "",
    "Bis bald & liebe Grüße",
    "Dein Team von DIE BIANCO",
    "",
    `Impressum: ${SITE}/impressum · Datenschutz: ${SITE}/datenschutz`,
  ].join("\n")

  // ── HTML ──
  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;color:#2C2C2C;max-width:560px;line-height:1.6">
  <p style="font-size:18px;margin:0 0 12px">Hallo ${esc(vorname)},</p>
  <p style="margin:0 0 12px">vielen Dank – ${esc(dankeSatz)}</p>
  <p style="margin:0 0 12px">${esc(meldeSatz)}</p>
  ${zeitraumSatz ? `<p style="margin:0 0 12px;background:#F5F1E8;border-radius:10px;padding:12px 16px">${esc(zeitraumSatz)}</p>` : ""}

  <p style="margin:20px 0 6px;font-weight:700">Zur Orientierung (ab-Preise)</p>
  <ul style="margin:0 0 16px;padding-left:20px">
    ${PREIS_ZEILEN.map((z) => `<li>${esc(z)}</li>`).join("")}
  </ul>

  <p style="margin:20px 0 6px;font-weight:700">So findest du uns</p>
  <p style="margin:0 0 4px">
    <a href="${esc(MAPS_URL)}" style="color:#B8863D">${esc(adresse)}</a>
  </p>
  <p style="margin:0 0 4px;color:#8a7d6a">Mo–Fr 9–17 Uhr · Sa 7–14 Uhr · nur mit Termin</p>
  <p style="margin:0 0 16px">Telefon: <a href="${esc(salonTelefonHref)}" style="color:#B8863D">${esc(salonTelefon)}</a></p>

  <p style="margin:0 0 20px">
    <a href="${esc(SITE)}/ergebnisse" style="color:#B8863D;margin-right:16px">Unsere Ergebnisse ansehen</a>
    <a href="${esc(SITE)}/behandlungen-preise" style="color:#B8863D">Behandlungen &amp; Preise</a>
  </p>

  <p style="margin:0 0 4px">Bis bald &amp; liebe Grüße</p>
  <p style="margin:0 0 20px;font-weight:600">Dein Team von DIE BIANCO</p>

  <hr style="border:none;border-top:1px solid #E7DFD0;margin:16px 0">
  <p style="margin:0;color:#8a7d6a;font-size:12px">
    DIE BIANCO · ${esc(adresse)} · <a href="${esc(salonTelefonHref)}" style="color:#8a7d6a">${esc(salonTelefon)}</a> · <a href="mailto:${esc(salonEmail)}" style="color:#8a7d6a">${esc(salonEmail)}</a><br>
    <a href="${esc(SITE)}/impressum" style="color:#8a7d6a">Impressum</a> · <a href="${esc(SITE)}/datenschutz" style="color:#8a7d6a">Datenschutz</a>
  </p>
</div>`.trim()

  return {
    subject: "Deine Anfrage bei DIE BIANCO – Teresa meldet sich persönlich",
    text,
    html,
  }
}
