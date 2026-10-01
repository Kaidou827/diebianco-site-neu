/**
 * lib/jobs.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Geteilte Konfiguration der Bewerbungs-Landingpages:
 *  - Stellen (azubi | friseur), Labels, Slugs
 *  - Formular-Optionen (Frontend + E-Mail-Rendering nutzen dieselbe Quelle)
 *  - zod-Schema für /api/bewerbung
 *  - Antworten → lesbare Label-Paare für die Benachrichtigungs-Mail
 *
 * Framework-frei (nur zod). Kein HubSpot, kein Mail, kein Next.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { z } from "zod"

export type Stelle = "azubi" | "friseur"

export const STELLE_LABEL: Record<Stelle, string> = {
  azubi: "Ausbildung Friseur/in (m/w/d)",
  friseur: "Friseur/in (m/w/d)",
}

export const STELLE_SLUG: Record<Stelle, string> = {
  azubi: "ausbildung-friseur-krefeld",
  friseur: "friseur-krefeld",
}

const SLUG_ZU_STELLE: Record<string, Stelle> = {
  "ausbildung-friseur-krefeld": "azubi",
  "friseur-krefeld": "friseur",
}

export function stelleAusSlug(slug: string): Stelle | null {
  return SLUG_ZU_STELLE[slug] ?? null
}

export function istStelle(wert: string): wert is Stelle {
  return wert === "azubi" || wert === "friseur"
}

export interface JobOption {
  value: string
  label: string
}

export interface JobFeld {
  key: string
  frage: string
  typ: "radio" | "checkbox" | "textarea" | "text"
  optionen?: JobOption[]
}

// ── Azubi ────────────────────────────────────────────────────────────────────
export const AZUBI_WO_STEHST: JobOption[] = [
  { value: "schule_2027", label: "Noch in der Schule – Abschluss 2027" },
  { value: "schule_fertig", label: "Schule fertig" },
  { value: "gewechselt", label: "Ausbildung gewechselt oder abgebrochen" },
  { value: "anderes", label: "Etwas anderes" },
]
export const AZUBI_ERFAHRUNG: JobOption[] = [
  { value: "praktikum", label: "Praktikum im Salon gemacht" },
  { value: "keine_lust", label: "Noch keine, aber richtig Lust drauf" },
  { value: "arbeite_schon", label: "Ich arbeite schon im Friseurbereich" },
]
export const AZUBI_START: JobOption[] = [
  { value: "asap", label: "So bald wie möglich" },
  { value: "sommer_2027", label: "Ausbildungsstart Sommer 2027" },
  { value: "flexibel", label: "Bin flexibel" },
]

// ── Friseur/in ───────────────────────────────────────────────────────────────
export const FRISEUR_ABSCHLUSS: JobOption[] = [
  { value: "gesell", label: "Gesell/in" },
  { value: "meister", label: "Meister/in" },
  { value: "laeuft_noch", label: "Ausbildung läuft noch, fertig bis …" },
]
export const FRISEUR_ERFAHRUNG_JAHRE: JobOption[] = [
  { value: "unter_2", label: "Unter 2 Jahre" },
  { value: "2_5", label: "2–5 Jahre" },
  { value: "ueber_5", label: "Über 5 Jahre" },
]
export const FRISEUR_SCHWERPUNKTE: JobOption[] = [
  { value: "balayage", label: "Balayage" },
  { value: "straehnen", label: "Strähnentechniken (Foilyage, Babylights, …)" },
  { value: "coloration", label: "Coloration / Ansatz" },
  { value: "grey_blending", label: "Grey Blending" },
  { value: "keratin", label: "Keratin / Glättung" },
  { value: "schnitt", label: "Schnitt & Styling" },
]
export const FRISEUR_ARBEITSZEIT: JobOption[] = [
  { value: "vollzeit", label: "Vollzeit" },
  { value: "teilzeit", label: "Teilzeit" },
  { value: "flexibel", label: "Flexibel" },
]
export const FRISEUR_START: JobOption[] = [
  { value: "sofort", label: "Sofort" },
  { value: "kuendigung", label: "Nach meiner Kündigungsfrist (1–3 Monate)" },
  { value: "spaeter", label: "Später" },
]

export const KONTAKTWUNSCH: JobOption[] = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "anruf", label: "Anruf" },
]

/** Felder je Stelle in Reihenfolge – Quelle für das E-Mail-Rendering. */
const AZUBI_FELDER: JobFeld[] = [
  { key: "wo_stehst_du", frage: "Wo stehst du gerade?", typ: "radio", optionen: AZUBI_WO_STEHST },
  { key: "erfahrung", frage: "Erfahrung", typ: "radio", optionen: AZUBI_ERFAHRUNG },
  { key: "start", frage: "Gewünschter Start", typ: "radio", optionen: AZUBI_START },
  { key: "motivation", frage: "Motivation", typ: "textarea" },
]
const FRISEUR_FELDER: JobFeld[] = [
  { key: "abschluss", frage: "Abschluss", typ: "radio", optionen: FRISEUR_ABSCHLUSS },
  { key: "abschluss_fertig_bis", frage: "Ausbildung fertig bis", typ: "text" },
  { key: "erfahrung_jahre", frage: "Berufserfahrung", typ: "radio", optionen: FRISEUR_ERFAHRUNG_JAHRE },
  { key: "schwerpunkte", frage: "Schwerpunkte", typ: "checkbox", optionen: FRISEUR_SCHWERPUNKTE },
  { key: "arbeitszeit", frage: "Arbeitszeit", typ: "radio", optionen: FRISEUR_ARBEITSZEIT },
  { key: "start", frage: "Gewünschter Start", typ: "radio", optionen: FRISEUR_START },
  { key: "instagram_portfolio", frage: "Instagram / Portfolio", typ: "text" },
]

export function felderFuer(stelle: Stelle): JobFeld[] {
  return stelle === "azubi" ? AZUBI_FELDER : FRISEUR_FELDER
}

function labelFuer(optionen: JobOption[] | undefined, value: string): string {
  return optionen?.find((o) => o.value === value)?.label ?? value
}

export type Antworten = Record<string, string | string[]>

/**
 * Antworten (Schritt 1/2) in lesbare [Frage, Antwort]-Paare übersetzen –
 * nur ausgefüllte Felder. Für die Benachrichtigungs-Mail.
 */
export function bewerbungAntwortenLesbar(stelle: Stelle, antworten: Antworten): Array<[string, string]> {
  const zeilen: Array<[string, string]> = []
  for (const feld of felderFuer(stelle)) {
    const wert = antworten[feld.key]
    if (wert == null || (Array.isArray(wert) && wert.length === 0) || wert === "") continue
    if (feld.typ === "checkbox" && Array.isArray(wert)) {
      zeilen.push([feld.frage, wert.map((v) => labelFuer(feld.optionen, v)).join(", ")])
    } else if (Array.isArray(wert)) {
      zeilen.push([feld.frage, wert.join(", ")])
    } else if (feld.typ === "radio") {
      zeilen.push([feld.frage, labelFuer(feld.optionen, wert)])
    } else {
      zeilen.push([feld.frage, wert])
    }
  }
  return zeilen
}

// ── zod-Schema (Backend-Validierung) ────────────────────────────────────────
const antwortWert = z.union([z.string(), z.array(z.string())])

export const bewerbungSchema = z.object({
  stelle: z.enum(["azubi", "friseur"]),
  // Pflicht (Schritt 3)
  vorname: z.string().trim().min(1, "Bitte deinen Vornamen angeben."),
  nachname: z.string().trim().optional().default(""),
  telefon: z.string().trim().min(6, "Bitte eine gültige Telefonnummer angeben."),
  email: z.union([z.string().trim().email("Bitte eine gültige E-Mail angeben."), z.literal("")]).optional().default(""),
  kontaktwunsch: z.enum(["whatsapp", "anruf"]).default("whatsapp"),
  datenschutz: z.boolean().refine((v) => v === true, "Bitte die Datenschutzhinweise bestätigen."),
  // Anti-Spam
  honeypot: z.string().max(0).optional().default(""),
  // Schritt 1/2 (locker)
  antworten: z.record(z.string(), antwortWert).optional().default({}),
  // Attribution
  quelle_seite: z.string().optional().default(""),
  utm_source: z.string().optional().default(""),
  utm_medium: z.string().optional().default(""),
  utm_campaign: z.string().optional().default(""),
  utm_content: z.string().optional().default(""),
  fbclid: z.string().optional().default(""),
  gclid: z.string().optional().default(""),
})

export type BewerbungEingabe = z.infer<typeof bewerbungSchema>
