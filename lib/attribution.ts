/**
 * lib/attribution.ts
 * ─────────────────────────────────────────────────────────────────────────
 * First-Touch-Attribution für das Anfrage-Formular.
 *
 * Datenschutz-/Robustheits-Konzept:
 *  - Beim ersten Seitenaufruf werden utm_*, gclid/gbraid/wbraid, fbclid,
 *    Landingpage und document.referrer ZUERST NUR IM ARBEITSSPEICHER gehalten
 *    (Modul-Variable). Das übersteht die Client-Navigation in Next.js (Root-
 *    Layout bleibt gemountet), OHNE etwas auf dem Gerät zu speichern.
 *  - In sessionStorage wird NUR nach Cookiebot-Marketing-Zustimmung gespiegelt
 *    (persistIfConsent / bei Erfassung, falls Consent schon vorliegt).
 *  - First-Touch: vorhandene Werte werden nie überschrieben.
 * Reine Client-Logik (window), SSR-sicher (no-ops ohne window).
 * ─────────────────────────────────────────────────────────────────────────
 */

const URL_KEYS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
  "gclid", "gbraid", "wbraid", "fbclid",
] as const

/** Alle ausgegebenen Felder (URL-Parameter + abgeleitete). */
export const ATTRIBUTION_FELDER = [...URL_KEYS, "landingpage", "referrer"] as const

const STORAGE_KEY = "db_attribution"

// In-Memory First-Touch (überlebt Client-Navigation, nicht den Full-Reload).
let speicher: Record<string, string> | null = null

function marketingConsent(): boolean {
  try {
    const cb = (window as unknown as { Cookiebot?: { consent?: { marketing?: boolean } } }).Cookiebot
    return Boolean(cb?.consent?.marketing)
  } catch {
    return false
  }
}

function ausSessionStorage(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}") as Record<string, string>
  } catch {
    return {}
  }
}

function ausUrl(): Record<string, string> {
  const params = new URLSearchParams(window.location.search)
  const out: Record<string, string> = {}
  for (const k of URL_KEYS) {
    const v = params.get(k)
    if (v) out[k] = v
  }
  return out
}

function persistiere(): void {
  if (speicher && marketingConsent()) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(speicher))
    } catch {}
  }
}

/** Beim ersten Seitenaufruf aufrufen (global + als Fallback beim Formular-Mount). */
export function erfasseFirstTouch(): void {
  if (typeof window === "undefined") return
  if (!speicher) speicher = { ...ausSessionStorage() } // evtl. aus früherer Session-Zustimmung
  const url = ausUrl()
  for (const k of URL_KEYS) {
    if (url[k] && !speicher[k]) speicher[k] = url[k]
  }
  if (!speicher.landingpage) speicher.landingpage = window.location.pathname + window.location.search
  if (speicher.referrer === undefined) speicher.referrer = document.referrer || ""
  persistiere()
}

/** Bei Cookiebot-Zustimmung aufrufen → im Speicher Gehaltenes jetzt spiegeln. */
export function persistIfConsent(): void {
  if (typeof window === "undefined") return
  persistiere()
}

/** Attribution zum Mitschicken lesen: Speicher ∪ sessionStorage ∪ aktuelle URL. */
export function leseAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {}
  const gespeichert = ausSessionStorage()
  const url = ausUrl()
  const mem = speicher || {}
  const out: Record<string, string> = {}
  for (const k of ATTRIBUTION_FELDER) {
    const v = mem[k] || gespeichert[k] || url[k as keyof typeof url] || ""
    if (v) out[k] = v
  }
  return out
}
