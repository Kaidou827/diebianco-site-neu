"use client"

import { useEffect, useRef } from "react"
import { pushDataLayer, feuereMetaEventMitRetry, neueEventId } from "@/lib/tracking"

/**
 * Feuert nach erfolgreicher Anfrage GENAU EINMAL:
 *   - dataLayer: lead_form_success (behandlung, lead_wert, quelle_seite, utm_source, utm_campaign)
 *   - Meta-Pixel: Lead (value, currency EUR, content_name) mit Retry (bis fbq/Consent da ist)
 * Liest die Nutzlast aus einem Einmal-Schlüssel in sessionStorage, den das
 * Formular direkt vor Weiterleitung/Abschluss schreibt, und entfernt ihn sofort
 * (→ feuert nicht erneut bei Reload). Funktioniert sowohl auf /kontakt/danke
 * (nach Redirect) als auch inline in der Fertig-Phase des Formulars.
 */
const LEAD_EVENT_KEY = "db_lead_event"

interface LeadPayload {
  behandlung?: string
  lead_wert?: number
  quelle_seite?: string
  utm_source?: string
  utm_campaign?: string
}

export default function LeadErfolgTracking() {
  const erledigt = useRef(false)

  useEffect(() => {
    if (erledigt.current) return
    let payload: LeadPayload | null = null
    try {
      const raw = sessionStorage.getItem(LEAD_EVENT_KEY)
      if (raw) payload = JSON.parse(raw) as LeadPayload
    } catch {}
    if (!payload) return
    erledigt.current = true
    try {
      sessionStorage.removeItem(LEAD_EVENT_KEY)
    } catch {}

    const eventID = neueEventId()
    pushDataLayer("lead_form_success", {
      behandlung: payload.behandlung ?? "",
      lead_wert: payload.lead_wert ?? 0,
      quelle_seite: payload.quelle_seite ?? "",
      utm_source: payload.utm_source ?? "",
      utm_campaign: payload.utm_campaign ?? "",
      event_id: eventID,
    })
    const cleanup = feuereMetaEventMitRetry(
      "Lead",
      { value: payload.lead_wert ?? 0, currency: "EUR", content_name: payload.behandlung ?? "" },
      eventID,
    )
    return cleanup
  }, [])

  return null
}
