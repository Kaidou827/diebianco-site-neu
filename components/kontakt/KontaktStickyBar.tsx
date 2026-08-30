"use client"

import { Phone } from "lucide-react"
import { salonTelefon, salonTelefonHref } from "@/lib/site-info"
import { useGeoeffnet } from "./useGeoeffnet"

function zumFormular() {
  document.getElementById("kontakt-formular")?.scrollIntoView({ behavior: "smooth", block: "start" })
}

/**
 * Sticky Bottom-Bar (nur Mobil, Punkt 2e).
 * EIN primärer CTA "Termin anfragen" (scrollt sanft zum Formular).
 * Telefon nur als sekundärer Icon-Button — zeitgesteuert (Punkt 4b):
 * geöffnet → tel:-Link (grüner Punkt), geschlossen → ausgeblendet.
 */
export default function KontaktStickyBar() {
  const offen = useGeoeffnet()

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-black/10 bg-[#F5F1E8]/95 px-4 py-3 backdrop-blur-sm shadow-[0_-6px_20px_-8px_rgba(0,0,0,0.25)] md:hidden">
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <button
          type="button"
          onClick={zumFormular}
          className="flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-gradient-to-r from-[#C6A15B] to-[#B8863D] px-5 text-base font-semibold text-white shadow-md active:scale-[0.99]"
        >
          Termin anfragen
        </button>

        {offen && (
          <a
            href={salonTelefonHref}
            aria-label={`Jetzt anrufen: ${salonTelefon}`}
            className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-[#B8863D]/40 bg-white text-[#B8863D]"
          >
            <Phone className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-600" />
          </a>
        )}
      </div>
    </div>
  )
}
