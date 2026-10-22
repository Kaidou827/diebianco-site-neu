"use client"

import { useEffect, useRef } from "react"

/**
 * Conversion-Tracking der Bewerbungs-Danke-Seite.
 * - dataLayer.push({event:'bewerbung_danke', stelle}) für GTM – sofort, unabhängig vom Consent.
 * - Meta-Pixel Standard-Event „SubmitApplication" (content_category, content_name, eventID).
 *
 * Robust gegen Race Condition: window.fbq existiert erst, wenn Cookiebot den Pixel
 * nach Marketing-Consent freigegeben + geladen hat. Deshalb:
 *   1) Sofortversuch beim Mount.
 *   2) Falls fbq noch fehlt: bis 10 s alle 250 ms erneut versuchen.
 *   3) Zusätzlich auf das Consent-Event „CookiebotOnAccept" hören.
 * Das Event wird über einen useRef-Guard GENAU EINMAL gefeuert; alle Timer/Listener
 * werden im Cleanup aufgeräumt.
 */

type Fbq = (...args: unknown[]) => void
type TrackingWindow = { dataLayer?: unknown[]; fbq?: Fbq }

const RETRY_INTERVAL_MS = 250
const MAX_WARTEZEIT_MS = 10_000

/**
 * Baut die fbq-Argumente für das SubmitApplication-Event (pure, testbar).
 * eventID = Grundlage für spätere Conversions-API-Dedup (crypto.randomUUID, mit Fallback).
 */
export function submitApplicationArgs(
  stelle: string,
): [string, string, Record<string, string>, { eventID: string }] {
  const eventID =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `db-${Date.now()}-${Math.random().toString(16).slice(2)}`
  return ["track", "SubmitApplication", { content_category: "bewerbung", content_name: stelle }, { eventID }]
}

export default function DankeTracking({ stelle }: { stelle: string }) {
  const gefeuert = useRef(false)

  useEffect(() => {
    const w = window as unknown as TrackingWindow
    // dataLayer-Event sofort (unabhängig von Consent/fbq).
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push({ event: "bewerbung_danke", stelle })

    let intervalId: ReturnType<typeof setInterval> | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    // Funktionsdeklarationen → gehoistet, Reihenfolge unkritisch.
    function aufraeumen() {
      if (intervalId !== undefined) clearInterval(intervalId)
      if (timeoutId !== undefined) clearTimeout(timeoutId)
      window.removeEventListener("CookiebotOnAccept", onConsent)
    }

    function onConsent() {
      feuern()
    }

    /** Feuert das Pixel-Event, sobald fbq da ist – genau einmal. Gibt true zurück, wenn (bereits) gefeuert. */
    function feuern(): boolean {
      if (gefeuert.current) return true
      const fbq = (window as unknown as TrackingWindow).fbq
      if (typeof fbq !== "function") return false
      gefeuert.current = true
      fbq(...submitApplicationArgs(stelle))
      aufraeumen()
      return true
    }

    // 1) Sofortversuch. Wenn fbq noch fehlt: 2) pollen + 3) auf Consent hören.
    if (!feuern()) {
      intervalId = setInterval(feuern, RETRY_INTERVAL_MS)
      timeoutId = setTimeout(aufraeumen, MAX_WARTEZEIT_MS)
      window.addEventListener("CookiebotOnAccept", onConsent)
    }

    return aufraeumen
  }, [stelle])

  return null
}
