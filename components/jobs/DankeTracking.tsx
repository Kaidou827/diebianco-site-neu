"use client"

import { useEffect } from "react"

/**
 * Conversion-Tracking der Bewerbungs-Danke-Seite.
 * - dataLayer.push({event:'bewerbung_danke', stelle}) für GTM
 * - Meta-Pixel Standard-Event „Lead" (nur wenn fbq existiert → Consent vorliegt)
 * Nutzt den bestehenden Pixel-Init aus app/layout.tsx, ändert nichts an der Lade-Logik.
 */
export default function DankeTracking({ stelle }: { stelle: string }) {
  useEffect(() => {
    const w = window as unknown as { dataLayer?: unknown[]; fbq?: (...args: unknown[]) => void }
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push({ event: "bewerbung_danke", stelle })
    if (typeof w.fbq === "function") {
      w.fbq("track", "Lead", { content_name: stelle, content_category: "bewerbung" })
    }
  }, [stelle])
  return null
}
