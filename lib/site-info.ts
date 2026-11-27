// Zentrale Quelle der Wahrheit für Kontakt & Öffnungszeiten.
// Footer, Kontaktinfo, Formular-Hinweis UND die Zeitsteuerung (Anruf-CTA/Popup)
// speisen sich hieraus. Keine hart codierten Zeiten mehr in den Seiten.

export const salonTelefon = "+49 174 3091973"
export const salonTelefonHref = "tel:+491743091973"
export const salonEmail = "salon@diebianco.de"
export const salonAdresse = { strasse: "Siedlung Egelsberg 1", ort: "47802 Krefeld" }

export type OpeningHourEntry = {
  day: string
  hours: string
}

// Einzeltage (z. B. für den Footer).
export const openingHours: OpeningHourEntry[] = [
  { day: "Montag", hours: "08:00–17:00" },
  { day: "Dienstag", hours: "08:00–17:00" },
  { day: "Mittwoch", hours: "08:00–17:00" },
  { day: "Donnerstag", hours: "08:00–17:00" },
  { day: "Freitag", hours: "08:00–17:00" },
  { day: "Samstag", hours: "08:00–17:00" },
  { day: "Sonntag", hours: "Geschlossen" },
]

// Kompakte, gruppierte Anzeige (Kontaktinfo, Formular-Hinweis).
export const oeffnungszeitenKompakt: string[] = [
  "Mo–Sa: 08:00–17:00 Uhr",
  "So: geschlossen",
]

// Einzeilig für E-Mails (Eingangsbestätigung).
export const oeffnungszeitenEinzeilig = "Mo–Sa 8–17 Uhr · nur mit Termin"

// Maschinen-lesbar für die Zeitsteuerung. Wochentag-Index (0 = So … 6 = Sa)
// → [Öffnen, Schließen] in "HH:MM", oder null = geschlossen.
const ZEITFENSTER: Record<number, [string, string] | null> = {
  0: null, // Sonntag
  1: ["08:00", "17:00"], // Montag
  2: ["08:00", "17:00"], // Dienstag
  3: ["08:00", "17:00"], // Mittwoch
  4: ["08:00", "17:00"], // Donnerstag
  5: ["08:00", "17:00"], // Freitag
  6: ["08:00", "17:00"], // Samstag
}

const WOCHENTAG_INDEX: Record<string, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
}

const zuMinuten = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number)
  return h * 60 + m
}

/**
 * Ist der Salon JETZT geöffnet? Immer in Zeitzone Europe/Berlin,
 * unabhängig von der Zeitzone des Besuchers. Nur clientseitig aufrufen.
 */
export function istGeoeffnet(now: Date = new Date()): boolean {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Berlin",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(now)
    const wdStr = parts.find((p) => p.type === "weekday")?.value ?? ""
    const hour = Number(parts.find((p) => p.type === "hour")?.value)
    const min = Number(parts.find((p) => p.type === "minute")?.value)
    const wd = WOCHENTAG_INDEX[wdStr]
    const fenster = wd === undefined ? null : ZEITFENSTER[wd]
    if (!fenster) return false
    const jetzt = hour * 60 + min
    return jetzt >= zuMinuten(fenster[0]) && jetzt < zuMinuten(fenster[1])
  } catch {
    return false
  }
}
