/**
 * lib/hubspot/schema.ts
 * ─────────────────────────────────────────────────────────────────────────
 * EINZIGE QUELLE DER WAHRHEIT für die Anfrage-Formular-Properties.
 *
 * Aus dieser Datei speisen sich drei Ziele (siehe Briefing, Abschnitt 1):
 *   1) scripts/sync-properties.ts   -> legt die Properties in HubSpot an
 *   2) components/AnfrageFormular    -> generiert die Formularfelder        (später)
 *   3) app/api/anfrage/route.ts      -> validiert und mappt die Eingaben     (später)
 *
 * Ändert sich eine Behandlungsoption, wird NUR hier eine Zeile angepasst und
 * das Sync-Skript erneut ausgeführt. Danach sind Formular, Backend und
 * HubSpot wieder deckungsgleich.
 * ─────────────────────────────────────────────────────────────────────────
 */

/** Welle 1 = verbindlicher Teil (Lead gesichert), Welle 2 = freiwillige Vertiefung. */
export type Welle = 1 | 2

/** Felder, die erst durch Workflow 1 in HubSpot gesetzt werden, sind mit "workflow" markiert. */
export type Herkunft = Welle | "workflow"

export interface FeldDefinition {
  /** Interner Schlüssel im Frontend. */
  id: string
  /** Interner Name in HubSpot (snake_case, stabil, wird NIE geändert). */
  hubspotName: string
  /** Label in HubSpot (im CRM sichtbar). */
  label: string
  /** Fragetext im Formular. Leer bei reinen Workflow-Feldern. */
  frage: string
  /** Optionaler Hilfetext unter der Frage. */
  hinweis?: string
  /** Darstellungstyp im Formular / in HubSpot. */
  fieldType: "select" | "radio" | "textarea" | "file" | "text"
  /** HubSpot-Datentyp. */
  type: "enumeration" | "string"
  /** Auswahloptionen (nur bei enumeration). Reihenfolge = Anzeigereihenfolge. */
  optionen?: string[]
  /** Wann das Feld befüllt wird. */
  welle: Herkunft
  /** Nur einblenden, wenn eine Farb-Behandlung gewählt wurde. */
  nurBeiFarbe?: boolean
  /** Pflichtfeld im Formular. */
  pflicht?: boolean
  /** Darstellungsbreite (1 = volle Breite, 2 = halbe Breite). */
  spalten?: 1 | 2
}

/** Eigene Property-Gruppe, in der alle Felder gebündelt werden. */
export const PROPERTY_GRUPPE = {
  name: "anfrage_formular",
  label: "Anfrage-Formular",
} as const

/**
 * Behandlungen, die einen Farbwunsch bedeuten und damit die Farb-Zweige
 * (Haarlänge, Farb-Vorgeschichte, Fotos) einblenden.
 * Referenziert die Optionswerte von `wunsch_behandlung`.
 */
export const FARB_BEHANDLUNGEN = [
  "Strähnen / Blondierung",
  "Balayage",
  "Grey Blending",
  "Farbe / Ansatz",
] as const

/**
 * Alle zu erstellenden Contact-Properties.
 * firstname / lastname / phone / email sind HubSpot-Standardfelder und
 * werden hier BEWUSST NICHT aufgeführt (nicht neu anlegen).
 */
export const FELDER: FeldDefinition[] = [
  // ── Welle 1 ────────────────────────────────────────────────────────────
  {
    id: "wunschBehandlung",
    hubspotName: "wunsch_behandlung",
    label: "Wunsch-Behandlung",
    frage: "Worum geht es bei deinem Wunschtermin?",
    fieldType: "select",
    type: "enumeration",
    optionen: [
      "Schnitt & Styling",
      "Strähnen / Blondierung",
      "Balayage",
      "Grey Blending",
      "Farbe / Ansatz",
      "Keratin",
      "Beratungsgespräch",
      "Weiß ich noch nicht",
    ],
    welle: 1,
    pflicht: true,
    spalten: 1,
  },
  {
    id: "wunschzeitraum",
    hubspotName: "wunschzeitraum",
    label: "Wunsch-Zeitraum",
    frage: "Wann passt es dir am besten?",
    fieldType: "radio",
    type: "enumeration",
    optionen: ["Vormittags", "Nachmittags", "Samstag", "Egal"],
    welle: 1,
    spalten: 1,
  },

  // ── Welle 2 · nur bei Farbwunsch ───────────────────────────────────────
  {
    id: "haarlaenge",
    hubspotName: "haarlaenge",
    label: "Haarlänge",
    frage: "Wie lang sind deine Haare aktuell?",
    fieldType: "select",
    type: "enumeration",
    optionen: ["Kurz", "Kinnlang", "Schulterlang", "Lang"],
    welle: 2,
    nurBeiFarbe: true,
    spalten: 2,
  },
  {
    id: "farbVorgeschichte",
    hubspotName: "farb_vorgeschichte",
    label: "Farbe letzte 12 Monate",
    frage: "Wurden deine Haare in den letzten 12 Monaten gefärbt?",
    fieldType: "select",
    type: "enumeration",
    optionen: ["Ja, im Salon", "Ja, zuhause selbst", "Nein", "Weiß ich nicht mehr"],
    welle: 2,
    nurBeiFarbe: true,
    spalten: 1,
  },
  {
    id: "fotoHaare",
    hubspotName: "foto_haare",
    label: "Fotos",
    frage: "Magst du uns 1–4 Fotos deiner Haare schicken?",
    hinweis: "Hilft Teresa, deinen Wunsch besser einzuschätzen. Freiwillig.",
    fieldType: "file",
    type: "string",
    welle: 2,
    nurBeiFarbe: true,
    spalten: 1,
  },

  // ── Welle 2 · immer ────────────────────────────────────────────────────
  {
    id: "erreichbarkeit",
    hubspotName: "erreichbarkeit",
    label: "Beste Erreichbarkeit",
    frage: "Wann bist du am besten erreichbar?",
    fieldType: "select",
    type: "enumeration",
    optionen: ["Vormittags", "Nachmittags", "Abends", "Egal"],
    welle: 2,
    spalten: 2,
  },
  {
    id: "whatsappOk",
    hubspotName: "whatsapp_ok",
    label: "WhatsApp erlaubt",
    frage: "Dürfen wir dir per WhatsApp schreiben?",
    fieldType: "radio",
    type: "enumeration",
    optionen: ["Ja, gerne", "Lieber anrufen"],
    welle: 2,
    spalten: 2,
  },
  {
    id: "dringlichkeit",
    hubspotName: "dringlichkeit",
    label: "Zeitrahmen",
    frage: "Wie schnell möchtest du einen Termin?",
    fieldType: "select",
    type: "enumeration",
    optionen: ["So schnell wie möglich", "In 2–4 Wochen", "Ich bin flexibel"],
    welle: 2,
    spalten: 1,
  },
  {
    id: "anmerkungKundin",
    hubspotName: "anmerkung_kundin",
    label: "Anmerkung",
    frage: "Möchtest du uns noch etwas mitgeben?",
    fieldType: "textarea",
    type: "string",
    welle: 2,
    spalten: 1,
  },

  // ── Automatisch vom Backend gesetzt (kein Formularfeld) ────────────────
  {
    id: "prioritaet",
    hubspotName: "prioritaet",
    label: "Priorität",
    frage: "",
    fieldType: "select",
    type: "enumeration",
    optionen: ["Hoch", "Mittel", "Niedrig"],
    welle: "workflow",
  },
  {
    id: "leadQualitaet",
    hubspotName: "lead_qualitaet",
    label: "Lead-Qualität",
    frage: "",
    fieldType: "select",
    type: "enumeration",
    optionen: ["Heiß", "Warm", "Kalt"],
    welle: "workflow",
  },
  {
    id: "leadStatusIntern",
    hubspotName: "lead_status_intern",
    label: "Lead-Status (intern)",
    frage: "",
    fieldType: "select",
    type: "enumeration",
    optionen: ["Neu", "Kontaktiert", "Nicht erreicht", "Termin vereinbart", "Kein Interesse"],
    welle: "workflow",
  },
]

/**
 * Erzeugt aus einem Options-Label einen stabilen internen HubSpot-Wert.
 * Deterministisch, damit Formular, Backend und Sync-Skript exakt denselben
 * Wert verwenden. Beispiel: "Strähnen / Blondierung" -> "straehnen_blondierung".
 */
export function optionWert(label: string): string {
  return label
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

/** Felder, die tatsächlich im Formular erscheinen (ohne reine Workflow-Felder). */
export const FORMULAR_FELDER = FELDER.filter((f) => f.welle !== "workflow")

/** Feld per HubSpot-Name finden. */
export function feldByHubspotName(name: string): FeldDefinition | undefined {
  return FELDER.find((f) => f.hubspotName === name)
}
