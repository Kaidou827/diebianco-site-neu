/**
 * lib/rueckruf-aufgaben.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Reine Hilfslogik rund um offene Rückruf-Aufgaben eines Kontakts
 * (Filter + Hinweistext + HTTP-Fehler-Klassifikation). Kein I/O, kein HubSpot
 * → direkt als Unit-Test prüfbar. Der eigentliche CRM-Abruf liegt in
 * `lib/hubspot.ts` (offeneRueckrufAufgaben) und nutzt diese Helfer.
 * ─────────────────────────────────────────────────────────────────────────
 */

/** Rückruf-Aufgaben tragen diesen Marker im Betreff (auch „Wieder da: Rückruf: …"). */
const RUECKRUF_MARKER = "Rückruf:"

/** Rohdaten einer HubSpot-Task (bereits geparst). */
export interface RohTask {
  id: string
  /** hs_task_status (z. B. NOT_STARTED, IN_PROGRESS, WAITING, COMPLETED). */
  status: string
  /** hs_task_subject. */
  subject: string
  /** hs_createdate in ms (null = unbekannt → wird aussortiert). */
  erstelltMs: number | null
}

export interface OffeneAufgabe {
  id: string
  erstelltMs: number
}

/** HubSpot-Datetime (Epoch-ms oder ISO) → ms, sonst null. */
export function parseTaskDatumMs(wert: string | null | undefined): number | null {
  if (!wert) return null
  const zahl = Number(wert)
  if (Number.isFinite(zahl) && zahl > 0) return zahl
  const datum = Date.parse(wert)
  return Number.isNaN(datum) ? null : datum
}

/**
 * Offene Rückruf-Aufgaben: Status ≠ COMPLETED, Betreff enthält „Rückruf:",
 * gültiges Erstelldatum. Sortiert ÄLTESTE zuerst.
 */
export function filtereOffeneRueckruf(tasks: RohTask[]): OffeneAufgabe[] {
  return tasks
    .filter((t) => t.status !== "COMPLETED" && t.subject.includes(RUECKRUF_MARKER) && t.erstelltMs != null)
    .map((t) => ({ id: t.id, erstelltMs: t.erstelltMs as number }))
    .sort((a, b) => a.erstelltMs - b.erstelltMs)
}

/**
 * Salon-Hinweis für offene Rückruf-Aufgaben. Datum = älteste offene Aufgabe;
 * bei mehreren „… vom {Datum} und {n} weitere". null, wenn keine offen ist.
 */
export function rueckrufHinweisText(aufgaben: OffeneAufgabe[]): string | null {
  if (aufgaben.length === 0) return null
  const datum = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(aufgaben[0].erstelltMs))
  const weitere = aufgaben.length - 1
  const rest = weitere > 0 ? ` und ${weitere} weitere` : ""
  return `Hinweis: offene Rückruf-Aufgabe vom ${datum}${rest} noch vorhanden – bitte schließen.`
}

/** HTTP-Status → fehlender Scope (crm.objects.tasks.read am Token)? */
export function istScopeFehler(status: number | undefined): boolean {
  return status === 403
}
