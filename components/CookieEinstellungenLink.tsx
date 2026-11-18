"use client"

import { oeffneCookieEinstellungen } from "@/lib/consent"

/** Link „Cookie-Einstellungen“: öffnet den eigenen Banner erneut (Widerruf/Änderung). */
export default function CookieEinstellungenLink({ className }: { className?: string }) {
  return (
    <button type="button" onClick={oeffneCookieEinstellungen} className={className}>
      Cookie-Einstellungen
    </button>
  )
}
