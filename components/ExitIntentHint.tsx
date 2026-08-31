"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import { usePathname } from "next/navigation"

const DISMISS_KEY = "diebianco-exit-intent-dismissed"

export default function ExitIntentHint() {
  const [visible, setVisible] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === "undefined") return
    // Landingpages mit eigenem, zeitgesteuertem Anruf-Popup → globales hier aus.
    if (["/kontakt", "/grey-blending-krefeld", "/grey-blending-beratung"].includes(pathname)) return

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches
    if (!isDesktop) return

    if (window.sessionStorage.getItem(DISMISS_KEY) === "1") return
    setEnabled(true)
  }, [pathname])

  useEffect(() => {
    if (!enabled) return

    const onMouseLeave = (event: MouseEvent) => {
      if (event.clientY <= 10) {
        setVisible(true)
      }
    }

    document.addEventListener("mouseleave", onMouseLeave)
    return () => document.removeEventListener("mouseleave", onMouseLeave)
  }, [enabled])

  if (!visible) return null

  const dismiss = () => {
    setVisible(false)
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(DISMISS_KEY, "1")
    }
  }

  return (
    <div className="fixed top-4 left-1/2 z-[75] w-[min(92vw,760px)] -translate-x-1/2 rounded-md border border-white/15 bg-[#2C2C2C]/95 p-4 text-white shadow-2xl backdrop-blur-sm">
      <button
        type="button"
        onClick={dismiss}
        aria-label="Hinweis schließen"
        className="absolute right-2 top-2 rounded p-1 text-white/70 transition-colors hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
      <p className="pr-8 text-sm md:text-base">
        Noch unentschlossen? Ruf uns einfach an - wir beraten dich persönlich.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <a
          href="tel:+491743091973"
          className="inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          +49 174 3091973
        </a>
        <Link
          href="/kontakt#kontakt-formular"
          className="inline-flex items-center rounded-full bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] px-4 py-2 text-sm font-semibold text-white transition-all hover:from-[#B8A082] hover:to-[#D4C6A6]"
        >
          Zum Formular
        </Link>
      </div>
    </div>
  )
}
