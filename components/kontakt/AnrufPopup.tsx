"use client"

import { useEffect, useState } from "react"
import { Phone, X } from "lucide-react"
import { salonTelefon, salonTelefonHref, istGeoeffnet } from "@/lib/site-info"

const SESSION_KEY = "diebianco-anruf-popup"

function zumFormular() {
  document.getElementById("kontakt-formular")?.scrollIntoView({ behavior: "smooth", block: "start" })
}

/**
 * Anruf-Popup (Punkt 4c): NUR innerhalb der Öffnungszeiten, frühestens nach
 * 20 Sek. ODER bei Exit-Intent (Desktop), max. 1x pro Session.
 */
export default function AnrufPopup() {
  const [sichtbar, setSichtbar] = useState(false)

  useEffect(() => {
    if (!istGeoeffnet()) return
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") return
    } catch {
      /* Storage nicht verfügbar → trotzdem einmal zeigen */
    }

    let gezeigt = false
    const zeige = () => {
      if (gezeigt) return
      gezeigt = true
      setSichtbar(true)
      try {
        sessionStorage.setItem(SESSION_KEY, "1")
      } catch {
        /* ignorieren */
      }
      cleanup()
    }

    const timer = window.setTimeout(zeige, 20_000)
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 10) zeige()
    }
    const istDesktop = window.matchMedia("(min-width: 1024px)").matches
    if (istDesktop) document.addEventListener("mouseleave", onLeave)

    function cleanup() {
      window.clearTimeout(timer)
      document.removeEventListener("mouseleave", onLeave)
    }
    return cleanup
  }, [])

  if (!sichtbar) return null

  const schliessen = () => setSichtbar(false)

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-md rounded-xl bg-[#F5F1E8] p-6 text-[#2C2C2C] shadow-2xl">
        <button
          type="button"
          onClick={schliessen}
          aria-label="Schließen"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-[#5b5346] hover:bg-black/5"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-green-700">
          <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
          Jetzt persönlich erreichbar
        </div>
        <h3 className="font-serif text-2xl">Lieber direkt sprechen?</h3>
        <p className="mt-2 text-[#5b5346]">Ruf uns an – Teresa und ihr Team beraten dich gerne persönlich.</p>
        <div className="mt-5 flex flex-col gap-3">
          <a
            href={salonTelefonHref}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#C6A15B] to-[#B8863D] px-6 font-semibold text-white shadow-md"
          >
            <Phone className="h-5 w-5" />
            {salonTelefon}
          </a>
          <button
            type="button"
            onClick={() => {
              schliessen()
              zumFormular()
            }}
            className="min-h-[44px] text-sm font-medium text-[#B8863D] underline underline-offset-2"
          >
            Lieber online anfragen
          </button>
        </div>
      </div>
    </div>
  )
}
