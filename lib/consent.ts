/**
 * lib/consent.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Eigene Einwilligungsverwaltung (ersetzt Cookiebot).
 *
 *  - Speichert die Auswahl im First-Party-Cookie `db_consent` (12 Monate).
 *  - Kategorien: notwendig (immer), statistik, marketing.
 *  - Nach jeder Auswahl: Google Consent Mode v2 aktualisieren, freigegebene
 *    Dienste nachladen (lib/consent-dienste.ts) und das Fenster-Event
 *    `db:consent` auslösen (ersetzt `CookiebotOnAccept`).
 *  - Widerruf bereits geladener Dienste → Seite neu laden, damit nichts
 *    weiterläuft.
 * Reine Client-Logik, SSR-sicher (no-ops ohne window).
 * ─────────────────────────────────────────────────────────────────────────
 */

import { ladeFreigegebeneDienste } from "./consent-dienste"

export const CONSENT_COOKIE = "db_consent"
/** Erhöhen, wenn sich Dienste/Zwecke ändern → alle sehen den Banner erneut. */
export const CONSENT_VERSION = 1
export const CONSENT_EVENT = "db:consent"
export const CONSENT_OEFFNEN_EVENT = "db:consent-oeffnen"
const LAUFZEIT_TAGE = 365

export interface Einwilligung {
  statistik: boolean
  marketing: boolean
  /** ISO-Zeitpunkt der Auswahl (Nachweis). */
  zeit: string
  version: number
}

/** Liest die Einwilligung aus einem Cookie-String (pure, testbar). Ungültig/alt → null. */
export function parseEinwilligung(cookieString: string): Einwilligung | null {
  const eintrag = cookieString
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(CONSENT_COOKIE + "="))
  if (!eintrag) return null
  try {
    const roh = JSON.parse(decodeURIComponent(eintrag.slice(CONSENT_COOKIE.length + 1))) as Partial<Einwilligung>
    if (roh.version !== CONSENT_VERSION) return null
    return {
      statistik: roh.statistik === true,
      marketing: roh.marketing === true,
      zeit: typeof roh.zeit === "string" ? roh.zeit : "",
      version: CONSENT_VERSION,
    }
  } catch {
    return null
  }
}

/** Baut den Cookie-String für eine Einwilligung (pure, testbar). */
export function einwilligungCookie(e: Einwilligung, https: boolean): string {
  const wert = encodeURIComponent(JSON.stringify(e))
  return `${CONSENT_COOKIE}=${wert}; Max-Age=${LAUFZEIT_TAGE * 86400}; Path=/; SameSite=Lax${https ? "; Secure" : ""}`
}

/** Consent-Mode-v2-Werte zu einer Einwilligung (pure, testbar). */
export function consentModeWerte(e: Pick<Einwilligung, "statistik" | "marketing">): Record<string, "granted" | "denied"> {
  const m = e.marketing ? "granted" : "denied"
  return {
    ad_storage: m,
    ad_user_data: m,
    ad_personalization: m,
    analytics_storage: e.statistik ? "granted" : "denied",
  }
}

export function leseEinwilligung(): Einwilligung | null {
  if (typeof document === "undefined") return null
  return parseEinwilligung(document.cookie)
}

export function hatMarketingZustimmung(): boolean {
  return leseEinwilligung()?.marketing === true
}

type GtagWindow = { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void }

function gtagConsentUpdate(e: Einwilligung): void {
  const w = window as unknown as GtagWindow
  w.dataLayer = w.dataLayer || []
  if (typeof w.gtag !== "function") {
    // gtag muss ein arguments-Objekt pushen, kein Array.
    w.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer!.push(arguments)
    }
  }
  w.gtag("consent", "update", consentModeWerte(e))
}

/** Speichert die Auswahl, aktualisiert Consent Mode, lädt Dienste und meldet `db:consent`. */
export function speichereEinwilligung(statistik: boolean, marketing: boolean): Einwilligung {
  const vorher = leseEinwilligung()
  const e: Einwilligung = { statistik, marketing, zeit: new Date().toISOString(), version: CONSENT_VERSION }
  if (typeof window === "undefined") return e
  document.cookie = einwilligungCookie(e, window.location.protocol === "https:")
  gtagConsentUpdate(e)

  const widerruf = Boolean(vorher && ((vorher.marketing && !marketing) || (vorher.statistik && !statistik)))
  if (widerruf) {
    // Bereits geladene Skripte lassen sich nicht entladen → neu laden.
    window.location.reload()
    return e
  }
  ladeFreigegebeneDienste(e)
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: e }))
  return e
}

/** Öffnet den Banner erneut (Link „Cookie-Einstellungen“). */
export function oeffneCookieEinstellungen(): void {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(CONSENT_OEFFNEN_EVENT))
}
