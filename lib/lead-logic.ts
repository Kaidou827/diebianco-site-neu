/**
 * lib/lead-logic.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Reine, framework-freie Ableitungen für die Lead-Automatisierung.
 * BEWUSST ohne Next/React/HubSpot-Import, damit dieselbe Logik von
 *   - app/api/anfrage/route.ts   (Backend, setzt die HubSpot-Properties)
 *   - components/AnfrageFormular  (Frontend, später für Anzeige)
 *   - tests/*                     (Unit-Tests)
 * genutzt werden kann.
 *
 * Die HubSpot-internen Optionswerte sind hier die Quelle der Wahrheit
 * (müssen exakt den Property-Optionen im Portal 146440145 entsprechen).
 * ─────────────────────────────────────────────────────────────────────────
 */

// ── Behandlungen ────────────────────────────────────────────────────────────
export type Behandlung =
  | "schnitt_styling"
  | "straehnen_blondierung"
  | "balayage"
  | "grey_blending"
  | "farbe_ansatz"
  | "keratin"
  | "beratungsgespraech"
  | "weiss_ich_noch_nicht"

export type Prioritaet = "hoch" | "mittel" | "niedrig"
export type LeadQualitaet = "heiss" | "warm" | "kalt"

/**
 * Lead-Status intern. Union bewusst erweiterbar vorgesehen:
 * "erschienen" | "nicht_erschienen" | "archiv" kommen später dazu.
 */
export type LeadStatusIntern =
  | "neu"
  | "kontaktiert"
  | "nicht_erreicht"
  | "termin_vereinbart"
  | "kein_interesse"
  | "erschienen"
  | "nicht_erschienen"
  | "archiv"

/** Deutsche Anzeige-Labels der Behandlungen (Mails, Aufgaben). */
export const BEHANDLUNG_LABEL: Record<Behandlung, string> = {
  schnitt_styling: "Schnitt & Styling",
  straehnen_blondierung: "Strähnen / Blondierung",
  balayage: "Balayage",
  grey_blending: "Grey Blending",
  farbe_ansatz: "Farbe / Ansatz",
  keratin: "Keratin",
  beratungsgespraech: "Beratungsgespräch",
  weiss_ich_noch_nicht: "Weiß ich noch nicht",
}

/** Deutsche Anzeige-Labels der Wunschzeiträume. */
export const ZEITRAUM_LABEL: Record<string, string> = {
  vormittags: "Vormittags",
  nachmittags: "Nachmittags",
  samstag: "Samstag",
  egal: "Egal",
}

const PRIORITAET_HOCH = new Set<Behandlung>([
  "grey_blending",
  "balayage",
  "keratin",
  "straehnen_blondierung",
])
const PRIORITAET_MITTEL = new Set<Behandlung>(["farbe_ansatz", "beratungsgespraech"])

const LEAD_WERT: Record<Behandlung, number> = {
  schnitt_styling: 60,
  farbe_ansatz: 80,
  straehnen_blondierung: 100,
  balayage: 150,
  grey_blending: 150,
  keratin: 200,
  beratungsgespraech: 60,
  weiss_ich_noch_nicht: 60,
}

function istBehandlung(wert: string): wert is Behandlung {
  return wert in BEHANDLUNG_LABEL
}

/** Lesbares Behandlungs-Label; unbekannte Werte werden unverändert zurückgegeben. */
export function behandlungLabel(wert: string): string {
  return istBehandlung(wert) ? BEHANDLUNG_LABEL[wert] : wert || "—"
}

/** Lesbares Zeitraum-Label; leer → "". */
export function zeitraumLabel(wert: string): string {
  return wert ? ZEITRAUM_LABEL[wert] ?? wert : ""
}

/** WhatsApp-Wunsch als "Ja" / "Nein" für Aufgabe & Mail (leer → ""). */
export function whatsappLabel(wert: string): string {
  if (wert === "ja_gerne") return "Ja"
  if (wert === "lieber_anrufen") return "Nein"
  return ""
}

/**
 * Priorität aus der Wunsch-Behandlung.
 *  hoch  = Grey Blending, Balayage, Keratin, Strähnen/Blondierung
 *  mittel = Farbe/Ansatz, Beratungsgespräch
 *  niedrig = Schnitt & Styling, Weiß ich noch nicht (Default für Unbekanntes)
 */
export function prioritaetFuerBehandlung(wert: string): Prioritaet {
  if (istBehandlung(wert)) {
    if (PRIORITAET_HOCH.has(wert)) return "hoch"
    if (PRIORITAET_MITTEL.has(wert)) return "mittel"
  }
  return "niedrig"
}

/** Grober Umsatz-Proxy in Euro aus der Wunsch-Behandlung (Default 60). */
export function leadWertProxy(wert: string): number {
  return istBehandlung(wert) ? LEAD_WERT[wert] : 60
}

/**
 * Lead-Qualität:
 *  heiss = Priorität "hoch" UND ein Wunschzeitraum ist gesetzt und ≠ "egal"
 *  warm  = sonst
 *  kalt  = wird ausschließlich manuell im CRM vergeben (nie automatisch).
 */
export function leadQualitaet(prioritaet: Prioritaet, wunschzeitraum: string): LeadQualitaet {
  const z = (wunschzeitraum || "").trim()
  if (prioritaet === "hoch" && z && z !== "egal") return "heiss"
  return "warm"
}

/**
 * Deutsche Telefonnummer nach E.164 normalisieren.
 *   "0174 3091973"        -> "+491743091973"
 *   "+49 174 3091973"     -> "+491743091973"
 *   "0049 174 309 19 73"  -> "+491743091973"
 * Enthält der Input ein führendes "+", wird die Ländervorwahl unverändert
 * übernommen (auch nicht-deutsche Nummern). Ohne erkennbare Vorwahl wird
 * "+49" angenommen.
 */
export function normalisiereTelefonE164(raw: string): string {
  if (!raw) return ""
  const hatPlus = raw.trim().startsWith("+")
  const ziffern = raw.replace(/\D/g, "")
  if (!ziffern) return ""
  if (hatPlus) return "+" + ziffern
  if (ziffern.startsWith("00")) return "+" + ziffern.slice(2)
  if (ziffern.startsWith("0")) return "+49" + ziffern.slice(1)
  if (ziffern.startsWith("49")) return "+" + ziffern
  return "+49" + ziffern
}

// ── Fälligkeit der Rückruf-Aufgabe (immer Europe/Berlin) ────────────────────
// Das HubSpot-Portal steht auf US/Eastern → NIE die lokale Serverzeit verwenden.
// Alle Wanduhr-Zeiten werden explizit für Europe/Berlin berechnet.
const BERLIN = "Europe/Berlin"
const MS_PRO_TAG = 24 * 60 * 60 * 1000

/** Berlin-UTC-Offset (Minuten, z. B. 120 im Sommer) für einen Instant. */
function berlinOffsetMin(ms: number): number {
  const p = new Intl.DateTimeFormat("en-US", {
    timeZone: BERLIN,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).formatToParts(new Date(ms))
  const g = (t: string) => Number(p.find((x) => x.type === t)?.value)
  let hh = g("hour"); if (hh === 24) hh = 0
  const alsUtc = Date.UTC(g("year"), g("month") - 1, g("day"), hh, g("minute"), g("second"))
  return Math.round((alsUtc - ms) / 60000)
}

/** Berlin-Wanduhrzeit (Jahr/Monat/Tag Stunde:Minute) → Epoch-ms. */
function berlinZuMs(y: number, mo: number, d: number, h: number, mi: number): number {
  const grob = Date.UTC(y, mo - 1, d, h, mi, 0)
  return grob - berlinOffsetMin(grob) * 60000
}

/** Berlin-Komponenten eines Instants. dow: 1 = Montag … 7 = Sonntag. */
function berlinTeile(ms: number): { y: number; mo: number; d: number; dow: number; min: number } {
  const p = new Intl.DateTimeFormat("en-GB", {
    timeZone: BERLIN, weekday: "short",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date(ms))
  const g = (t: string) => p.find((x) => x.type === t)?.value ?? ""
  const dowMap: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }
  let hh = Number(g("hour")); if (hh === 24) hh = 0
  return {
    y: Number(g("year")), mo: Number(g("month")), d: Number(g("day")),
    dow: dowMap[g("weekday")] ?? 1, min: hh * 60 + Number(g("minute")),
  }
}

/**
 * Fälligkeit (Epoch-ms) der Rückruf-Aufgabe:
 *   - Mo–Fr, Eingang vor 15:00 (Berlin) → heute 17:00
 *   - Sa, Eingang vor 12:00 → heute 13:00
 *   - sonst (Sa ab 12:00, So, Mo–Fr ab 15:00) → nächster Werktag 09:00
 *     (ab morgen; Sonntag wird übersprungen, Samstag zählt → Fr 16:00 → Sa 09:00)
 */
export function faelligkeitTimestamp(eingang: Date = new Date()): number {
  const ms = eingang.getTime()
  const t = berlinTeile(ms)
  if (t.dow >= 1 && t.dow <= 5 && t.min < 15 * 60) {
    return berlinZuMs(t.y, t.mo, t.d, 17, 0)
  }
  if (t.dow === 6 && t.min < 12 * 60) {
    return berlinZuMs(t.y, t.mo, t.d, 13, 0)
  }
  let tagMs = ms
  for (let i = 0; i < 8; i++) {
    tagMs += MS_PRO_TAG
    const nt = berlinTeile(tagMs)
    if (nt.dow !== 7) return berlinZuMs(nt.y, nt.mo, nt.d, 9, 0)
  }
  return berlinZuMs(t.y, t.mo, t.d, 9, 0) // theoretischer Fallback
}
