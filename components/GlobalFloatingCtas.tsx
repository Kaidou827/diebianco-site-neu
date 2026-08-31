"use client"

import Link from "next/link"
import { Phone } from "lucide-react"
import { usePathname } from "next/navigation"

export default function GlobalFloatingCtas() {
  const pathname = usePathname()
  // Landingpages mit eigener Sticky-Bar (KontaktStickyBar) → globale hier ausblenden.
  const eigeneCtaSeiten = ["/kontakt", "/grey-blending-krefeld", "/grey-blending-beratung"]
  if (eigeneCtaSeiten.includes(pathname)) return null

  return (
    <div className="fixed inset-x-0 bottom-4 z-[70] pointer-events-none px-4">
      <div className="mx-auto flex w-full max-w-7xl items-end justify-between gap-3">
        <a
          href="tel:+491743091973"
          aria-label="Jetzt anrufen: +49 174 3091973"
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#2C2C2C]/95 px-4 py-3 text-sm font-semibold text-white shadow-xl backdrop-blur-sm transition-all hover:scale-[1.02] hover:bg-[#3A3A3A]"
        >
          <Phone className="h-4 w-4 text-[#D4C6A6]" />
          <span className="hidden sm:inline">Jetzt anrufen: +49 174 3091973</span>
          <span className="sm:hidden">Jetzt anrufen</span>
        </a>

        <Link
          href="/kontakt#kontakt-formular"
          aria-label="Termin anfragen"
          className="pointer-events-auto inline-flex items-center rounded-full bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] px-5 py-3 text-sm font-semibold text-white shadow-xl transition-all hover:scale-[1.02] hover:from-[#B8A082] hover:to-[#D4C6A6]"
        >
          Termin anfragen
        </Link>
      </div>
    </div>
  )
}
