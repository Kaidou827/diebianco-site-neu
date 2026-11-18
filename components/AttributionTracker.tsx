"use client"

import { useEffect } from "react"
import { erfasseFirstTouch, persistIfConsent } from "@/lib/attribution"
import { CONSENT_EVENT } from "@/lib/consent"

/**
 * Global im Root-Layout: erfasst den First-Touch (utm_*, gclid, fbclid,
 * Landingpage, Referrer) beim ersten Seitenaufruf im Arbeitsspeicher – auch
 * auf Seiten OHNE Formular. So gehen die Parameter nicht verloren, wenn vor dem
 * Formular eine zweite Seite aufgerufen wird. sessionStorage erst nach Consent
 * (erneut bei Einwilligung über das Event „db:consent“ gespiegelt).
 */
export default function AttributionTracker() {
  useEffect(() => {
    erfasseFirstTouch()
    window.addEventListener(CONSENT_EVENT, persistIfConsent)
    return () => window.removeEventListener(CONSENT_EVENT, persistIfConsent)
  }, [])
  return null
}
