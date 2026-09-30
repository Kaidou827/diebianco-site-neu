/**
 * lib/whatsapp.ts
 * ─────────────────────────────────────────────────────────────────────────
 * wa.me-Links mit URL-encodiertem Vorlagetext. Kein Tracking-Parameter.
 * Reine Funktionen (framework-frei), damit das Encoding testbar ist.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { salonTelefonHref } from "@/lib/site-info"

/** Salon-WhatsApp-Nummer im wa.me-Format (E.164 ohne „+"), z. B. 491743091973. */
export const SALON_WA_NUMMER = salonTelefonHref.replace(/\D/g, "")

/** Basis-Link: wa.me/<Nummer>?text=<encoded>. */
export function waLink(nummerDigits: string, text: string): string {
  return `https://wa.me/${nummerDigits}?text=${encodeURIComponent(text)}`
}

/**
 * Eingangsbestätigung: Die Kundin schreibt den Salon an.
 * behandlungLabel = deutsches Label; ohne Behandlung entfällt der Behandlungs-Teil.
 */
export function waSalonFrageLink(behandlungLabel?: string): string {
  const text = behandlungLabel
    ? `Hallo Teresa, ich habe gerade eine Anfrage für ${behandlungLabel} geschickt und hätte eine Frage.`
    : "Hallo Teresa, ich habe gerade eine Anfrage geschickt und hätte eine Frage."
  return waLink(SALON_WA_NUMMER, text)
}

/**
 * Rückruf-Aufgabe: Teresa schreibt der Kundin (Terminbestätigung als Entwurf).
 * [Datum], [Uhrzeit], [Dauer] bleiben als Platzhalter stehen und werden von
 * Teresa im WhatsApp-Entwurf ersetzt. Leerer String, wenn keine gültige
 * (E.164-)Telefonnummer vorliegt.
 */
export function waTerminBestaetigungLink(opts: {
  vorname: string
  behandlungLabel: string
  phoneE164: string
}): string {
  const digits = (opts.phoneE164 || "").replace(/\D/g, "")
  if (!(opts.phoneE164 || "").startsWith("+") || digits.length < 8) return ""
  const vorname = opts.vorname || "..."
  const behandlung = opts.behandlungLabel && opts.behandlungLabel !== "—" ? opts.behandlungLabel : "deine Behandlung"
  const text =
    `Hallo ${vorname}, hier ist Teresa von DIE BIANCO. Dein Termin für ${behandlung}: ` +
    `[Datum] um [Uhrzeit], Siedlung Egelsberg 1, 47802 Krefeld. ` +
    `Bitte plane ca. [Dauer] ein. Falls etwas dazwischenkommt, sag mir bitte mindestens ` +
    `24 Stunden vorher Bescheid. Bis bald!`
  return waLink(digits, text)
}
