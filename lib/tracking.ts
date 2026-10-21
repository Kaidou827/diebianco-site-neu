/**
 * lib/tracking.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Client-seitige Tracking-Helfer (framework-frei, nur window).
 * - pushDataLayer: GTM-dataLayer-Event
 * - neueEventId: eventID für Pixel↔CAPI-Dedup
 * - feuereMetaEventMitRetry: Pixel-Event robust gegen fehlendes/verspätetes fbq
 *   (Cookiebot/Consent) – sofort, sonst bis 10 s alle 250 ms + bei
 *   "CookiebotOnAccept", genau EINMAL. Gleiche Logik wie components/jobs/DankeTracking.
 * Alle Funktionen sind no-ops ohne window (SSR-sicher).
 * ─────────────────────────────────────────────────────────────────────────
 */

type Fbq = (...args: unknown[]) => void
type TrackingWindow = { dataLayer?: unknown[]; fbq?: Fbq }

const RETRY_INTERVAL_MS = 250
const MAX_WARTEZEIT_MS = 10_000

/** GTM-dataLayer-Event pushen (no-op ohne window). */
export function pushDataLayer(event: string, extra: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return
  const w = window as unknown as TrackingWindow
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event, ...extra })
}

/** eventID (crypto.randomUUID mit Fallback) als Grundlage für CAPI-Dedup. */
export function neueEventId(): string {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `db-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

/**
 * Feuert ein Meta-Pixel-Standard-Event robust und genau einmal.
 * Gibt eine Cleanup-Funktion zurück (Timer/Listener aufräumen).
 */
export function feuereMetaEventMitRetry(
  name: string,
  params: Record<string, unknown>,
  eventID: string,
): () => void {
  if (typeof window === "undefined") return () => {}
  let gefeuert = false
  let intervalId: ReturnType<typeof setInterval> | undefined
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  function aufraeumen() {
    if (intervalId !== undefined) clearInterval(intervalId)
    if (timeoutId !== undefined) clearTimeout(timeoutId)
    window.removeEventListener("CookiebotOnAccept", onConsent)
  }
  function onConsent() {
    feuern()
  }
  function feuern(): boolean {
    if (gefeuert) return true
    const fbq = (window as unknown as TrackingWindow).fbq
    if (typeof fbq !== "function") return false
    gefeuert = true
    fbq("track", name, params, { eventID })
    aufraeumen()
    return true
  }

  if (!feuern()) {
    intervalId = setInterval(feuern, RETRY_INTERVAL_MS)
    timeoutId = setTimeout(aufraeumen, MAX_WARTEZEIT_MS)
    window.addEventListener("CookiebotOnAccept", onConsent)
  }
  return aufraeumen
}
