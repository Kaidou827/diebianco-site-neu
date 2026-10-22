"use client"

import { useEffect } from "react"
import { pushDataLayer } from "@/lib/tracking"

/**
 * Globales Klick-Tracking für Telefon- und WhatsApp-Links.
 * Ein delegierter Listener auf document fängt Klicks auf <a href="tel:…"> und
 * wa.me/WhatsApp-Links und pusht dataLayer-Events (tel_click / whatsapp_click).
 * dataLayer-Push ist harmlos ohne Consent – GTM-Tags bleiben consent-gated.
 */
export default function KlickTracking() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const ziel = e.target as HTMLElement | null
      const a = ziel && typeof ziel.closest === "function" ? ziel.closest("a") : null
      if (!a) return
      const href = a.getAttribute("href") || ""
      if (href.startsWith("tel:")) {
        pushDataLayer("tel_click", { link_url: href, link_text: (a.textContent || "").trim().slice(0, 80) })
      } else if (/wa\.me|whatsapp/i.test(href)) {
        pushDataLayer("whatsapp_click", { link_url: href, link_text: (a.textContent || "").trim().slice(0, 80) })
      }
    }
    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [])

  return null
}
