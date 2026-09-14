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
import { behandlungLabel, behandlungsDauer, zeitraumLabel } from "@/lib/lead-logic"

const SITE = process.env.SITE_URL || "https://www.diebianco.de"
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${salonAdresse.strasse} ${salonAdresse.ort}`,
)}`

// ab-Preis-Block in der Eingangsbestätigung abschaltbar (Default: an).
const PREISE_ANZEIGEN = process.env.MAIL_PREISE_ANZEIGEN !== "false"

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
    ...(PREISE_ANZEIGEN
      ? ["", "Zur Orientierung (ab-Preise):", ...PREIS_ZEILEN.map((z) => `– ${z}`)]
      : []),
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
    "Du musst jetzt nichts weiter tun – Teresa meldet sich persönlich bei dir.",
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

  ${PREISE_ANZEIGEN ? `<p style="margin:20px 0 6px;font-weight:700">Zur Orientierung (ab-Preise)</p>
  <ul style="margin:0 0 16px;padding-left:20px">
    ${PREIS_ZEILEN.map((z) => `<li>${esc(z)}</li>`).join("")}
  </ul>` : ""}

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

  <p style="margin:0 0 16px">Du musst jetzt nichts weiter tun – Teresa meldet sich persönlich bei dir.</p>

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

// ─────────────────────────────────────────────────────────────────────────
// Cron-Mails (zeitgesteuert). Du-Ansprache, kein Rabatt, kein Verkaufsdruck.
// Kunden-Mails tragen einen Abmeldelink im Footer.
// ─────────────────────────────────────────────────────────────────────────

const ADRESSE = `${salonAdresse.strasse}, ${salonAdresse.ort}`

function huelle(innen: string): string {
  return `<div style="font-family:Arial,Helvetica,sans-serif;color:#2C2C2C;max-width:560px;line-height:1.6">${innen}</div>`
}

function footerText(abmeldeUrl?: string): string {
  const z = [
    "",
    `DIE BIANCO · ${ADRESSE} · ${salonTelefon} · ${salonEmail}`,
    `Impressum: ${SITE}/impressum · Datenschutz: ${SITE}/datenschutz`,
  ]
  if (abmeldeUrl) z.push(`Keine E-Mails mehr: ${abmeldeUrl}`)
  return z.join("\n")
}

function footerHtml(abmeldeUrl?: string): string {
  return `
  <hr style="border:none;border-top:1px solid #E7DFD0;margin:16px 0">
  <p style="margin:0;color:#8a7d6a;font-size:12px">
    DIE BIANCO · ${esc(ADRESSE)} · <a href="${esc(salonTelefonHref)}" style="color:#8a7d6a">${esc(salonTelefon)}</a> · <a href="mailto:${esc(salonEmail)}" style="color:#8a7d6a">${esc(salonEmail)}</a><br>
    <a href="${esc(SITE)}/impressum" style="color:#8a7d6a">Impressum</a> · <a href="${esc(SITE)}/datenschutz" style="color:#8a7d6a">Datenschutz</a>${abmeldeUrl ? ` · <a href="${esc(abmeldeUrl)}" style="color:#8a7d6a">Keine E-Mails mehr</a>` : ""}
  </p>`
}

function terminFormat(ms: number): string {
  const d = new Date(ms)
  const datum = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin", weekday: "long", day: "numeric", month: "long", year: "numeric",
  }).format(d)
  const zeit = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit",
  }).format(d)
  return `${datum} um ${zeit} Uhr`
}

// ── 1) Digest (intern an den Salon, kein Abmeldelink) ───────────────────────
export interface DigestMailZeile {
  vorname: string
  behandlung: string
  zeitraum: string
  telefon: string
  tage: number
  nachricht: string
  deepLink: string
}

export function digestMail(d: { datum: string; zeilen: DigestMailZeile[] }): EmailInhalt {
  const text = [
    `Heute zu kontaktieren – ${d.datum}`,
    "",
    ...d.zeilen.map(
      (z, i) =>
        `${i + 1}. ${z.vorname} · ${z.behandlung}${z.zeitraum ? " · " + z.zeitraum : ""} · ${z.telefon} · seit ${z.tage} Tg.` +
        (z.nachricht ? `\n   „${z.nachricht}"` : "") +
        `\n   ${z.deepLink}`,
    ),
  ].join("\n")

  const rows = d.zeilen
    .map(
      (z) => `
      <tr>
        <td style="padding:8px 10px;border-bottom:1px solid #eee">${esc(z.vorname)}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #eee">${esc(z.behandlung)}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #eee">${esc(z.zeitraum) || "—"}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #eee"><a href="tel:${esc(z.telefon.replace(/[^\d+]/g, ""))}" style="color:#B8863D">${esc(z.telefon)}</a></td>
        <td style="padding:8px 10px;border-bottom:1px solid #eee;text-align:right">${z.tage}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #eee">${esc(z.nachricht) || "—"}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #eee"><a href="${esc(z.deepLink)}" style="color:#B8863D">öffnen</a></td>
      </tr>`,
    )
    .join("")

  const html = huelle(`
    <h2 style="margin:0 0 12px">Heute zu kontaktieren – ${esc(d.datum)}</h2>
    <p style="margin:0 0 14px;color:#8a7d6a">${d.zeilen.length} offene ${d.zeilen.length === 1 ? "Anfrage" : "Anfragen"}, sortiert nach Priorität.</p>
    <div style="overflow-x:auto"><table style="border-collapse:collapse;width:100%;font-size:14px">
      <thead><tr style="text-align:left;color:#8a7d6a">
        <th style="padding:8px 10px">Vorname</th><th style="padding:8px 10px">Behandlung</th><th style="padding:8px 10px">Zeitraum</th><th style="padding:8px 10px">Telefon</th><th style="padding:8px 10px">Tage</th><th style="padding:8px 10px">Nachricht</th><th style="padding:8px 10px">HubSpot</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`)

  return { subject: `Heute zu kontaktieren – ${d.datum} (${d.zeilen.length})`, text, html }
}

// ── 2) Nicht erreicht (Kundin, transaktional) ───────────────────────────────
export interface NichtErreichtMailDaten {
  firstname: string
  telefon: string
  wunschzeitraum: string
  stufe: 1 | 2
  meetingsLink?: string
  abmeldeUrl?: string
}

export function nichtErreichtMail(d: NichtErreichtMailDaten): EmailInhalt {
  const vorname = d.firstname || "du"
  const zeitraum = zeitraumLabel(d.wunschzeitraum)
  const rueckruf = d.meetingsLink
    ? `Du kannst dir hier auch direkt einen Rückruf aussuchen: ${d.meetingsLink}`
    : ""
  const rueckrufHtml = d.meetingsLink
    ? `<p style="margin:0 0 12px"><a href="${esc(d.meetingsLink)}" style="color:#B8863D">Rückruf-Termin aussuchen</a></p>`
    : ""

  if (d.stufe === 2) {
    const text = [
      `Hallo ${vorname},`,
      "",
      "wir würden dich gerne noch erreichen. Melde dich einfach, wenn dein Wunsch noch aktuell ist –",
      `du erreichst uns unter ${salonTelefon}.`,
      ...(zeitraum ? ["", `Dein Wunschzeitraum: ${zeitraum}.`] : []),
      ...(rueckruf ? ["", rueckruf] : []),
      "",
      "Liebe Grüße",
      "Dein Team von DIE BIANCO",
      footerText(d.abmeldeUrl),
    ].join("\n")
    const html = huelle(`
      <p style="font-size:18px;margin:0 0 12px">Hallo ${esc(vorname)},</p>
      <p style="margin:0 0 12px">wir würden dich gerne noch erreichen. Melde dich einfach, wenn dein Wunsch noch aktuell ist – du erreichst uns unter <a href="${esc(salonTelefonHref)}" style="color:#B8863D">${esc(salonTelefon)}</a>.</p>
      ${zeitraum ? `<p style="margin:0 0 12px">Dein Wunschzeitraum: <strong>${esc(zeitraum)}</strong>.</p>` : ""}
      ${rueckrufHtml}
      <p style="margin:0 0 4px">Liebe Grüße</p>
      <p style="margin:0 0 8px;font-weight:600">Dein Team von DIE BIANCO</p>
      ${footerHtml(d.abmeldeUrl)}`)
    return { subject: "Kurze Erinnerung – wir sind für dich da", text, html }
  }

  const text = [
    `Hallo ${vorname},`,
    "",
    "Teresa hat versucht, dich telefonisch zu erreichen – leider ohne Erfolg.",
    `Ruf uns gerne zurück unter ${salonTelefon}, dann finden wir gemeinsam einen Termin.`,
    ...(zeitraum ? ["", `Dein Wunschzeitraum: ${zeitraum}.`] : []),
    ...(rueckruf ? ["", rueckruf] : []),
    "",
    "Bis bald & liebe Grüße",
    "Dein Team von DIE BIANCO",
    footerText(d.abmeldeUrl),
  ].join("\n")
  const html = huelle(`
    <p style="font-size:18px;margin:0 0 12px">Hallo ${esc(vorname)},</p>
    <p style="margin:0 0 12px">Teresa hat versucht, dich telefonisch zu erreichen – leider ohne Erfolg.</p>
    <p style="margin:0 0 12px">Ruf uns gerne zurück unter <a href="${esc(salonTelefonHref)}" style="color:#B8863D">${esc(salonTelefon)}</a>, dann finden wir gemeinsam einen Termin.</p>
    ${zeitraum ? `<p style="margin:0 0 12px">Dein Wunschzeitraum: <strong>${esc(zeitraum)}</strong>.</p>` : ""}
    ${rueckrufHtml}
    <p style="margin:0 0 4px">Bis bald &amp; liebe Grüße</p>
    <p style="margin:0 0 8px;font-weight:600">Dein Team von DIE BIANCO</p>
    ${footerHtml(d.abmeldeUrl)}`)
  return { subject: "Wir haben versucht, dich zu erreichen", text, html }
}

// ── 3a) Terminbestätigung (Kundin) ──────────────────────────────────────────
export interface TerminMailDaten {
  firstname: string
  behandlung: string
  terminMs: number
  abmeldeUrl?: string
}

export function terminBestaetigungMail(d: TerminMailDaten): EmailInhalt {
  const vorname = d.firstname || "du"
  const wann = terminFormat(d.terminMs)
  const dauer = behandlungsDauer(d.behandlung)
  const behandlung = behandlungLabel(d.behandlung)

  const text = [
    `Hallo ${vorname},`,
    "",
    `dein Termin bei DIE BIANCO ist bestätigt:`,
    `${wann}`,
    d.behandlung && d.behandlung !== "weiss_ich_noch_nicht" ? `Behandlung: ${behandlung}` : "",
    dauer ? `Plane bitte ${dauer} ein.` : "",
    "",
    `Adresse: ${ADRESSE}`,
    `Karte: ${MAPS_URL}`,
    "",
    "Bitte sag uns mindestens 24 Stunden vorher Bescheid, falls du den Termin nicht wahrnehmen kannst.",
    "",
    "Wir freuen uns auf dich!",
    "Dein Team von DIE BIANCO",
    footerText(d.abmeldeUrl),
  ]
    .filter((l) => l !== "")
    .join("\n")

  const html = huelle(`
    <p style="font-size:18px;margin:0 0 12px">Hallo ${esc(vorname)},</p>
    <p style="margin:0 0 8px">dein Termin bei DIE BIANCO ist bestätigt:</p>
    <p style="margin:0 0 12px;background:#F5F1E8;border-radius:10px;padding:12px 16px;font-size:17px"><strong>${esc(wann)}</strong>${d.behandlung && d.behandlung !== "weiss_ich_noch_nicht" ? `<br>${esc(behandlung)}` : ""}${dauer ? `<br><span style="color:#8a7d6a">Bitte plane ${esc(dauer)} ein.</span>` : ""}</p>
    <p style="margin:0 0 12px">Adresse: <a href="${esc(MAPS_URL)}" style="color:#B8863D">${esc(ADRESSE)}</a></p>
    <p style="margin:0 0 12px">Bitte sag uns <strong>mindestens 24 Stunden vorher</strong> Bescheid, falls du den Termin nicht wahrnehmen kannst.</p>
    <p style="margin:0 0 4px">Wir freuen uns auf dich!</p>
    <p style="margin:0 0 8px;font-weight:600">Dein Team von DIE BIANCO</p>
    ${footerHtml(d.abmeldeUrl)}`)
  return { subject: "Dein Termin bei DIE BIANCO ist bestätigt", text, html }
}

// ── 3b) Terminerinnerung (Kundin) ───────────────────────────────────────────
export function terminErinnerungMail(d: TerminMailDaten): EmailInhalt {
  const vorname = d.firstname || "du"
  const wann = terminFormat(d.terminMs)

  const text = [
    `Hallo ${vorname},`,
    "",
    `kleine Erinnerung an deinen Termin bei DIE BIANCO:`,
    `${wann}`,
    "",
    `Adresse: ${ADRESSE}`,
    `Karte: ${MAPS_URL}`,
    "",
    "Falls es doch nicht passt, sag uns bitte mindestens 24 Stunden vorher Bescheid.",
    "",
    "Bis gleich & liebe Grüße",
    "Dein Team von DIE BIANCO",
    footerText(d.abmeldeUrl),
  ].join("\n")

  const html = huelle(`
    <p style="font-size:18px;margin:0 0 12px">Hallo ${esc(vorname)},</p>
    <p style="margin:0 0 8px">kleine Erinnerung an deinen Termin bei DIE BIANCO:</p>
    <p style="margin:0 0 12px;background:#F5F1E8;border-radius:10px;padding:12px 16px;font-size:17px"><strong>${esc(wann)}</strong></p>
    <p style="margin:0 0 12px">Adresse: <a href="${esc(MAPS_URL)}" style="color:#B8863D">${esc(ADRESSE)}</a></p>
    <p style="margin:0 0 12px">Falls es doch nicht passt, sag uns bitte <strong>mindestens 24 Stunden vorher</strong> Bescheid.</p>
    <p style="margin:0 0 4px">Bis gleich &amp; liebe Grüße</p>
    <p style="margin:0 0 8px;font-weight:600">Dein Team von DIE BIANCO</p>
    ${footerHtml(d.abmeldeUrl)}`)
  return { subject: "Erinnerung an deinen Termin bei DIE BIANCO", text, html }
}

// ── 4) Reaktivierung (Kundin, Marketing) ────────────────────────────────────
export interface ReaktivierungMailDaten {
  firstname: string
  farbSaison: boolean
  abmeldeUrl?: string
}

export function reaktivierungMail(d: ReaktivierungMailDaten): EmailInhalt {
  const vorname = d.firstname || "du"
  const saison = d.farbSaison
    ? "Gerade im Herbst ist die perfekte Zeit für einen frischen Farb-Look."
    : ""

  const text = [
    `Hallo ${vorname},`,
    "",
    "dein Wunschtermin bei DIE BIANCO ist noch offen – wir würden dich gerne verwöhnen.",
    ...(saison ? [saison] : []),
    `Melde dich einfach, wenn es passt: ${salonTelefon}.`,
    "",
    "Liebe Grüße",
    "Dein Team von DIE BIANCO",
    footerText(d.abmeldeUrl),
  ].join("\n")

  const html = huelle(`
    <p style="font-size:18px;margin:0 0 12px">Hallo ${esc(vorname)},</p>
    <p style="margin:0 0 12px">dein Wunschtermin bei DIE BIANCO ist noch offen – wir würden dich gerne verwöhnen.</p>
    ${saison ? `<p style="margin:0 0 12px">${esc(saison)}</p>` : ""}
    <p style="margin:0 0 12px">Melde dich einfach, wenn es passt: <a href="${esc(salonTelefonHref)}" style="color:#B8863D">${esc(salonTelefon)}</a>.</p>
    <p style="margin:0 0 4px">Liebe Grüße</p>
    <p style="margin:0 0 8px;font-weight:600">Dein Team von DIE BIANCO</p>
    ${footerHtml(d.abmeldeUrl)}`)
  return { subject: "Dein Wunschtermin ist noch offen", text, html }
}

// ── 3d) Bewertungsbitte (Kundin, Marketing) ─────────────────────────────────
export interface ReviewMailDaten {
  firstname: string
  googleReviewUrl: string
  abmeldeUrl?: string
}

export function reviewMail(d: ReviewMailDaten): EmailInhalt {
  const vorname = d.firstname || "du"
  const text = [
    `Hallo ${vorname},`,
    "",
    "wir hoffen, du fühlst dich mit deinem neuen Look rundum wohl!",
    "Wenn du magst, freuen wir uns riesig über eine kurze Bewertung – das hilft anderen sehr:",
    d.googleReviewUrl,
    "",
    "Danke dir & liebe Grüße",
    "Dein Team von DIE BIANCO",
    footerText(d.abmeldeUrl),
  ].join("\n")

  const html = huelle(`
    <p style="font-size:18px;margin:0 0 12px">Hallo ${esc(vorname)},</p>
    <p style="margin:0 0 12px">wir hoffen, du fühlst dich mit deinem neuen Look rundum wohl!</p>
    <p style="margin:0 0 16px">Wenn du magst, freuen wir uns riesig über eine kurze Bewertung – das hilft anderen sehr.</p>
    <p style="margin:0 0 16px"><a href="${esc(d.googleReviewUrl)}" style="background:#B8863D;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;display:inline-block;font-weight:700">Jetzt bei Google bewerten</a></p>
    <p style="margin:0 0 4px">Danke dir &amp; liebe Grüße</p>
    <p style="margin:0 0 8px;font-weight:600">Dein Team von DIE BIANCO</p>
    ${footerHtml(d.abmeldeUrl)}`)
  return { subject: "Wie gefällt dir dein Ergebnis?", text, html }
}

// ── Abmelde-Bestätigungsseite ───────────────────────────────────────────────
export function abmeldeBestaetigungSeite(ok: boolean): string {
  const titel = ok ? "Du bist abgemeldet" : "Link ungültig"
  const text = ok
    ? "Du erhältst von uns keine Marketing-E-Mails mehr. Terminbezogene Nachrichten (z. B. Bestätigungen) können weiterhin kommen."
    : "Dieser Abmeldelink ist ungültig oder abgelaufen. Melde dich gerne direkt bei uns, wenn du keine E-Mails mehr möchtest."
  return `<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titel} · DIE BIANCO</title>
<style>
  body{margin:0;font-family:Arial,Helvetica,sans-serif;background:#F5F1E8;color:#2C2C2C;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px}
  .karte{background:#fff;border:1px solid #E7DFD0;border-radius:14px;padding:32px;max-width:440px;text-align:center}
  h1{font-size:22px;margin:0 0 12px}
  p{color:#5b5346;line-height:1.6;margin:0 0 16px}
  a{color:#B8863D}
</style></head><body>
  <div class="karte">
    <h1>${titel}</h1>
    <p>${text}</p>
    <p><a href="${SITE}">Zurück zu DIE BIANCO</a></p>
  </div>
</body></html>`
}
