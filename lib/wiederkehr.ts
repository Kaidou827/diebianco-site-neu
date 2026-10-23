/**
 * lib/wiederkehr.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Reine Entscheidungslogik für wiederkehrende Anfragen (aus /api/anfrage
 * herausgelöst, damit sie ohne HubSpot-/HTTP-Mock testbar ist).
 *
 * Regeln (Prompt „wiederkehrende Anfrage"):
 *  - Innerhalb des Idempotenzfensters (Doppelabsendung) → Duplikat, KEIN
 *    Status-Reset (die übrigen Properties patcht die Route wie bisher).
 *  - Außerhalb: erneute Anfrage → lead_status_intern = "neu", letzte_anfrage_am,
 *    anzahl_anfragen+1, vorheriger_status, nicht_erreicht-Zähler/Anker + Termin-
 *    Status-Aufgabe zurücksetzen. termin_datum bleibt unangetastet (Route).
 *  - „wiederkehrend" nur, wenn es vorher einen Status gab ODER die letzte
 *    Eingangsbestätigung älter als das Idempotenzfenster ist. Ein frischer
 *    Rumpf-Kontakt (kein Status, keine Bestätigung) zählt NICHT.
 * ─────────────────────────────────────────────────────────────────────────
 */

export interface WiederkehrEingabe {
  /** Kontakt bereits in HubSpot vorhanden? */
  existiert: boolean
  /** bisheriger lead_status_intern ("" wenn keiner). */
  altStatus: string
  /** eingangsbestaetigung_gesendet in ms (null = nie). */
  letzteBestaetigungMs: number | null
  /** bisheriger anzahl_anfragen (0 wenn keiner). */
  anzahlAlt: number
  /** termin_datum in ms (null = keiner). */
  terminDatumMs: number | null
  jetztMs: number
  idempotenzMs: number
}

export interface WiederkehrErgebnis {
  istDuplikat: boolean
  wiederkehrend: boolean
  vorherigerStatus: string
  anzahlAnfragen: number
  terminDatumMs: number | null
  terminInZukunft: boolean
  /** In den Upsert zu mergende Properties (LEER im Duplikatfenster). */
  properties: Record<string, string>
}

export function berechneWiederkehr(e: WiederkehrEingabe): WiederkehrErgebnis {
  const terminInZukunft = e.terminDatumMs != null && e.terminDatumMs > e.jetztMs

  const istDuplikat =
    e.existiert && e.letzteBestaetigungMs != null && e.jetztMs - e.letzteBestaetigungMs < e.idempotenzMs

  if (istDuplikat) {
    return {
      istDuplikat: true,
      wiederkehrend: false,
      vorherigerStatus: e.altStatus,
      anzahlAnfragen: e.anzahlAlt,
      terminDatumMs: e.terminDatumMs,
      terminInZukunft,
      properties: {},
    }
  }

  const wiederkehrend =
    e.existiert &&
    (Boolean(e.altStatus) ||
      (e.letzteBestaetigungMs != null && e.jetztMs - e.letzteBestaetigungMs >= e.idempotenzMs))

  const anzahlAnfragen = (e.existiert ? e.anzahlAlt : 0) + 1

  const properties: Record<string, string> = {
    lead_status_intern: "neu",
    letzte_anfrage_am: String(e.jetztMs),
    anzahl_anfragen: String(anzahlAnfragen),
  }
  if (e.existiert) {
    properties.vorheriger_status = e.altStatus
    properties.nicht_erreicht_mails_gesendet = "0"
    properties.nicht_erreicht_seit = ""
    properties.termin_status_aufgabe_gesendet = ""
    properties.kein_interesse_seit = "" // Archiv-Anker zurücksetzen (Status wird „neu")
    // termin_datum wird bewusst NICHT gesetzt (bleibt erhalten).
  }

  return {
    istDuplikat: false,
    wiederkehrend,
    vorherigerStatus: e.altStatus,
    anzahlAnfragen,
    terminDatumMs: e.terminDatumMs,
    terminInZukunft,
    properties,
  }
}
