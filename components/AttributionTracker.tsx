"use client"

import { useEffect } from "react"
import { erfasseFirstTouch, persistIfConsent } from "@/lib/attribution"

/**
 * Global im Root-Layout: erfasst den First-Touch (utm_*, gclid, fbclid,
 * Landingpage, Referrer) beim ersten Seitenaufruf im Arbeitsspeicher – auch
 * auf Seiten OHNE Formular. So gehen die Parameter nicht verloren, wenn vor dem
 * Formular eine zweite Seite aufgerufen wird. sessionStorage erst nach Consent
 * (erneut bei CookiebotOnAccept gespiegelt).
 */
export default function AttributionTracker() {
  useEffect(() => {
    erfasseFirstTouch()
    window.addEventListener("CookiebotOnAccept", persistIfConsent)
    return () => window.removeEventListener("CookiebotOnAccept", persistIfConsent)
  }, [])
  return null
}
