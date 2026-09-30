/**
 * lib/cron/logik.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Reine, framework-freie Auswahl-/Zähler-/Sortierlogik der Cron-Jobs.
 * Nimmt bereits geparste Primitivwerte entgegen → als Unit-Tests mit
 * gemockten HubSpot-Zeilen prüfbar. Kein I/O, kein HubSpot, kein Mail.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const MS_STUNDE = 60 * 60 * 1000
export const MS_TAG = 24 * MS_STUNDE

/** HubSpot-Datetime-Property (Epoch-ms oder ISO) → ms, sonst null. */
export function parseHubspotMs(wert: string | null | undefined): number | null {
  if (!wert) return null
  const zahl = Number(wert)
  if (Number.isFinite(zahl) && zahl > 0) return zahl
  const datum = Date.parse(wert)
  return Number.isNaN(datum) ? null : datum
}

/** HubSpot-Zahl-Property → number (leer/ungültig → 0). */
export function parseZahl(wert: string | null | undefined): number {
  const n = Number(wert)
  return Number.isFinite(n) ? n : 0
}

/** Ganze Tage zwischen zwei Zeitpunkten (abgerundet, nie negativ). */
export function tageSeit(ms: number | null, nowMs: number): number {
  if (ms == null) return 0
  return Math.max(0, Math.floor((nowMs - ms) / MS_TAG))
}

// ── Digest ──────────────────────────────────────────────────────────────────
const PRIO_RANG: Record<string, number> = { hoch: 0, mittel: 1, niedrig: 2 }

export function prioRang(prioritaet: string | null | undefined): number {
  return PRIO_RANG[String(prioritaet ?? "")] ?? 3
}

export interface DigestZeile {
  id: string
  prioritaet: string | null | undefined
  createdateMs: number | null
}

/** Digest-Sortierung: Priorität hoch→mittel→niedrig, dann createdate aufsteigend. */
export function sortiereDigest<T extends DigestZeile>(zeilen: T[]): T[] {
  return [...zeilen].sort((a, b) => {
    const r = prioRang(a.prioritaet) - prioRang(b.prioritaet)
    if (r !== 0) return r
    return (a.createdateMs ?? 0) - (b.createdateMs ?? 0)
  })
}

// ── Nicht erreicht (Stufen-Zähler) ──────────────────────────────────────────
export interface NichtErreichtEingabe {
  status: string
  /** Anker = `nicht_erreicht_seit` (wird beim ersten Antreffen gestempelt). */
  ankerMs: number | null
  counter: number
  nowMs: number
  hasEmail: boolean
}

/**
 * Nächste fällige Nicht-erreicht-Stufe (gerechnet ab `nicht_erreicht_seit`):
 *   1  → erste Mail (Status nicht_erreicht, ≥48 h seit Anker, Zähler 0)
 *   2  → zweite Mail (Zähler 1, ≥5 Tage seit Anker)
 *   null → nichts zu tun (auch wenn der Anker noch fehlt → erst stempeln)
 */
export function naechsteNichtErreichtStufe(e: NichtErreichtEingabe): 1 | 2 | null {
  if (e.status !== "nicht_erreicht" || !e.hasEmail || e.ankerMs == null) return null
  const seit = e.nowMs - e.ankerMs
  if (e.counter <= 0) return seit >= 48 * MS_STUNDE ? 1 : null
  if (e.counter === 1) return seit >= 5 * MS_TAG ? 2 : null
  return null
}

// ── Termine: Status-Aufgabe nach dem Termin ─────────────────────────────────
export interface StatusAufgabeEingabe {
  status: string
  terminMs: number | null
  aufgabeGesendet: boolean
  nowMs: number
}

/**
 * Status-Aufgabe fällig? 2 Tage nach `termin_datum`, Status noch
 * `termin_vereinbart`, Aufgabe noch nicht angelegt.
 * (Terminbestätigung/-erinnerung verschickt Teresa selbst per WhatsApp.)
 */
export function terminStatusAufgabeFaellig(e: StatusAufgabeEingabe): boolean {
  return (
    e.status === "termin_vereinbart" &&
    e.terminMs != null &&
    !e.aufgabeGesendet &&
    e.nowMs - e.terminMs >= 2 * MS_TAG
  )
}

// ── Reaktivierung ────────────────────────────────────────────────────────────
const REAKT_STATUS = new Set(["neu", "nicht_erreicht", "kontaktiert"])

export interface ReaktivierungEingabe {
  einwilligung: boolean
  status: string
  createdateMs: number | null
  reaktivierungGesendet: boolean
  nowMs: number
}

export function sollReaktivieren(e: ReaktivierungEingabe): boolean {
  return (
    e.einwilligung &&
    REAKT_STATUS.has(e.status) &&
    !e.reaktivierungGesendet &&
    e.createdateMs != null &&
    e.nowMs - e.createdateMs >= 30 * MS_TAG
  )
}

// ── Archivierung (kein_interesse ≥ 90 Tage) ──────────────────────────────────
export interface ArchivEingabe {
  status: string
  /** letzte Änderung = `hs_lastmodifieddate`. */
  lastmodMs: number | null
  nowMs: number
}

/** Auf `archiv` setzen: Status `kein_interesse` und letzte Änderung ≥ 90 Tage her. */
export function sollArchivieren(e: ArchivEingabe): boolean {
  return e.status === "kein_interesse" && e.lastmodMs != null && e.nowMs - e.lastmodMs >= 90 * MS_TAG
}
