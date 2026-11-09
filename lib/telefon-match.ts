/**
 * lib/telefon-match.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Reine Helfer für den ZWEITEN Upsert-Schlüssel „Telefonnummer".
 *
 * Hintergrund: Der Formular-Upsert matcht bestehende Kontakte bislang nur über
 * die E-Mail. Meldet sich dieselbe Person erneut mit einer ANDEREN E-Mail
 * (andere Adresse, Tippfehler, Zweit-Account), entsteht eine Dublette.
 * Als Rückfalllinie suchen wir deshalb zusätzlich über die Telefonnummer.
 *
 * BEWUSST ohne HubSpot-/Netz-Import, damit die Logik (Such-Filter bauen,
 * Treffer auswählen) ohne Mock testbar ist. Der eigentliche HTTP-Aufruf liegt
 * in lib/hubspot.ts (sucheKontaktIdPerTelefon).
 * ─────────────────────────────────────────────────────────────────────────
 */

export interface HsFilter {
  propertyName: string
  operator: string
  value: string
}
export interface HsFilterGroup {
  filters: HsFilter[]
}

/**
 * HubSpot-Such-filterGroups (ODER zwischen den Gruppen) für eine Telefonnummer.
 * Erwartet eine bereits normalisierte E.164-Nummer (z. B. „+491743091973").
 *
 *  - phone  EQ  <E.164>                           (Formular-Kontakte: exakt so gespeichert)
 *  - mobilephone  EQ  <E.164>
 *  - hs_searchable_calculated_phone_number  EQ  <Ziffern>  (HubSpot-normalisiertes Feld,
 *       fängt abweichende Formate ab; schlägt es fehl, greifen die beiden oberen)
 *
 * Leere/ohne Ziffern → [] (Aufrufer überspringt die Suche dann).
 */
export function telefonFilterGroups(phoneE164: string): HsFilterGroup[] {
  const nummer = (phoneE164 || "").trim()
  const ziffern = nummer.replace(/\D/g, "")
  if (!ziffern) return []
  const groups: HsFilterGroup[] = [
    { filters: [{ propertyName: "phone", operator: "EQ", value: nummer }] },
    { filters: [{ propertyName: "mobilephone", operator: "EQ", value: nummer }] },
    { filters: [{ propertyName: "hs_searchable_calculated_phone_number", operator: "EQ", value: ziffern }] },
  ]
  return groups
}

export interface TelefonTreffer {
  id: string
  /** createdate in ms (null = unbekannt). */
  createdateMs: number | null
  /** Hat der Kontakt bereits einen lead_status_intern? */
  hatStatus: boolean
}

/**
 * Aus mehreren Telefon-Treffern den „kanonischen" Kontakt wählen:
 *   1. Kontakte MIT Status vor Rumpf-Kontakten (dort hängt die Historie/Aufgabe).
 *   2. innerhalb davon der älteste (kleinstes createdate) – der ursprüngliche
 *      Datensatz, in den die Zweit-Anfrage zusammengeführt wird.
 * Kein Treffer → null.
 */
export function waehleKontaktId(treffer: TelefonTreffer[]): string | null {
  if (!treffer.length) return null
  const sortiert = [...treffer].sort((a, b) => {
    if (a.hatStatus !== b.hatStatus) return a.hatStatus ? -1 : 1
    const ca = a.createdateMs ?? Number.POSITIVE_INFINITY
    const cb = b.createdateMs ?? Number.POSITIVE_INFINITY
    return ca - cb
  })
  return sortiert[0].id
}
