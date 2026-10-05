"use client"

import { useEffect } from "react"

/**
 * Conversion-Tracking der Bewerbungs-Danke-Seite.
 * - dataLayer.push({event:'bewerbung_danke', stelle}) für GTM
 * - Meta-Pixel Standard-Event „SubmitApplication" (nur wenn fbq existiert → Consent vorliegt).
 *   Mit eventID (uuid) als Grundlage für spätere Conversions-API-Dedup.
 * Nutzt den bestehenden Pixel-Init aus app/layout.tsx, ändert nichts an der Lade-Logik.
 */
export default function DankeTracking({ stelle }: { stelle: string }) {
  useEffect(() => {
    const w = window as unknown as { dataLayer?: unknown[]; fbq?: (...args: unknown[]) => void }
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push({ event: "bewerbung_danke", stelle })
    if (typeof w.fbq === "function") {
      const eventID =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `db-${Date.now()}-${Math.random().toString(16).slice(2)}`
      w.fbq(
        "track",
        "SubmitApplication",
        { content_category: "bewerbung", content_name: stelle },
        { eventID },
      )
    }
  }, [stelle])
  return null
}
