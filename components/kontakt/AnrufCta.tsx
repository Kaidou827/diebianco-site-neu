"use client"

import { Phone } from "lucide-react"
import { salonTelefon, salonTelefonHref } from "@/lib/site-info"
import { useGeoeffnet } from "./useGeoeffnet"

function zumFormular() {
  document.getElementById("kontakt-formular")?.scrollIntoView({ behavior: "smooth", block: "start" })
}

/**
 * Dezenter Anruf-Hinweis UNTER dem Formular (Punkt 4a/4b).
 * Innerhalb der Öffnungszeiten: grüner Punkt + "Jetzt erreichbar" + tel:-Link.
 * Außerhalb: kein prominenter tel:-Link, Verweis aufs Formular.
 */
export default function AnrufCta() {
  const offen = useGeoeffnet()

  // Vor Mount neutral (kein Status), um Hydration-Sprünge zu vermeiden.
  if (offen === null) {
    return (
      <a
        href={salonTelefonHref}
        className="inline-flex min-h-[44px] items-center gap-2 text-sm text-[#5b5346] hover:text-[#2C2C2C] transition-colors"
      >
        <Phone className="h-4 w-4 text-[#B8863D]" />
        Lieber anrufen? {salonTelefon}
      </a>
    )
  }

  if (offen) {
    return (
      <a
        href={salonTelefonHref}
        className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-[#2C2C2C] hover:text-black transition-colors"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-600" />
        </span>
        <Phone className="h-4 w-4 text-[#B8863D]" />
        Jetzt erreichbar – anrufen: {salonTelefon}
      </a>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#5b5346]">
      <span className="inline-flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#b0a892]" />
        Gerade geschlossen – wir rufen dich zurück.
      </span>
      <button
        type="button"
        onClick={zumFormular}
        className="min-h-[44px] font-medium text-[#B8863D] underline underline-offset-2 hover:text-[#8a6420]"
      >
        Zum Formular
      </button>
    </div>
  )
}
