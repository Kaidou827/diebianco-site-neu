/**
 * lib/jobs-content.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Redaktionelle Inhalte der Stellenseiten (Texte 1:1 aus dem Briefing).
 * Reine Daten – keine Logik. [GEHALT] wird in StellenSeite ersetzt
 * (nur wenn die passende ENV gesetzt ist).
 * ─────────────────────────────────────────────────────────────────────────
 */

import type { Stelle } from "@/lib/jobs"

// Bilder aus dem bestehenden Bestand (in public/). Auswahl im PR bestätigen.
export const HERO_IMG = "/Sektionbild.jpg"
export const UEBER_IMG = "/teresa-bianco-portrait.jpg"
export const OG_IMG = "/Sektionbild.jpg"

export const UEBER_TEXT =
  "DIE BIANCO ist der Salon von Teresa Bianco in Krefeld (Siedlung Egelsberg 1). Unser Schwerpunkt sind hochwertige Farbarbeiten – Balayage, moderne Strähnentechniken, Grey Blending und Keratinbehandlungen – für Kundinnen, die Qualität schätzen. Wir arbeiten professionell, pünktlich und mit Freude an schöner Arbeit – und genau so soll es sich auch im Team anfühlen."

export interface StellenInhalt {
  title: string
  description: string
  badges: string[]
  h1: string
  subline: string
  erwartet: string[]
  bringst: string[]
  cta: string
  employmentType: string[]
}

export const STELLEN_INHALT: Record<Stelle, StellenInhalt> = {
  azubi: {
    title: "Ausbildung Friseur/in (m/w/d) in Krefeld – DIE BIANCO",
    description:
      "Ausbildungsplatz Friseur/in bei DIE BIANCO in Krefeld. Wir fördern dich aktiv mit Schulungen und Weiterbildungen. Bewirb dich in 2 Minuten – ohne Lebenslauf.",
    badges: ["Krefeld", "Ausbildung", "Start nach Absprache"],
    h1: "Ausbildung zur Friseurin / zum Friseur (m/w/d) in Krefeld",
    subline:
      "Bei uns lernst du nicht nur den Beruf – du lernst ihn richtig. Motivation und Interesse am Handwerk zählen für uns mehr als Noten.",
    erwartet: [
      "Aktive Förderung: Wir schicken dich auf Schulungen und Weiterbildungen, damit du dich fachlich weiterentwickelst – nicht erst im dritten Lehrjahr.",
      "Moderne Techniken von Anfang an: Coloration, Balayage, Strähnentechniken, Keratin – du lernst, was heute gefragt ist.",
      "Gute, faire Ausbildungsvergütung [GEHALT].",
      "Ein professioneller Salon mit Kundinnen, die hochwertige Arbeit schätzen.",
      "Eine langfristige Perspektive: Wir suchen jemanden, der nach der Ausbildung bleiben und bei uns weiterwachsen will.",
    ],
    bringst: [
      "Echtes Interesse am Friseurberuf und Lust zu lernen.",
      "Pünktlichkeit und Zuverlässigkeit – das ist uns wirklich wichtig.",
      "Freundlicher, professioneller Umgang mit Kundinnen und Kunden.",
      "Ein Praktikum im Salon ist ein Plus, aber keine Voraussetzung.",
    ],
    cta: "Jetzt bewerben – 2 Minuten, ohne Lebenslauf",
    employmentType: ["FULL_TIME"],
  },
  friseur: {
    title: "Friseur/in (m/w/d) in Krefeld – Schwerpunkt Farbe – DIE BIANCO",
    description:
      "Friseur/in (Gesell/in oder Meister/in) für Coloration, Balayage & Strähnentechniken in Krefeld gesucht. Gute Bezahlung, Schulungen, kein klassisches Schneiden nötig. Bewirb dich in 2 Minuten.",
    badges: ["Krefeld", "Vollzeit oder Teilzeit", "Start nach Absprache"],
    h1: "Friseur/in (m/w/d) mit Herz für Farbe – Gesell/in oder Meister/in",
    subline:
      "Du liebst Coloration, Balayage und moderne Strähnentechniken? Dann bist du bei uns richtig. Die Schnitte übernimmt Teresa selbst – dein Fokus ist Farbe.",
    erwartet: [
      "Fokus auf das, was du am besten kannst: Coloration und Strähnentechniken. Klassisches Schneiden musst du nicht übernehmen.",
      "Gute Bezahlung [GEHALT] – Qualität wird bei uns bezahlt.",
      "Weiterentwicklung: Schulungen und Weiterbildungen zu neuen Techniken sind bei uns Standard, nicht Ausnahme.",
      "Ein professioneller Salon mit Kundinnen, die hochwertige Farbarbeit schätzen und dafür wiederkommen.",
      "Vollzeit oder Teilzeit – wir finden das Modell, das zu deinem Leben passt.",
      "Langfristige Perspektive in einem Team, das sich gemeinsam weiterentwickelt.",
    ],
    bringst: [
      "Abgeschlossene Ausbildung als Friseur/in – Gesell/in oder Meister/in, beides willkommen.",
      "Erfahrung in Coloration und modernen Strähnentechniken; Balayage, Foilyage/Babylights und Keratinbehandlungen sind für uns besonders interessant.",
      "Professioneller Umgang mit Kundinnen und Kunden, Zuverlässigkeit und Freude an hochwertiger Arbeit.",
      "Pünktlichkeit – ehrlich gesagt: das ist uns genauso wichtig wie dein Können.",
      "Lust, dich langfristig in unserem Team weiterzuentwickeln.",
    ],
    cta: "Jetzt bewerben – 2 Minuten, ohne Lebenslauf",
    employmentType: ["FULL_TIME", "PART_TIME"],
  },
}
