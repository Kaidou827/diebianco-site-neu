"use client"

import { useEffect, useState } from "react"
import {
  CONSENT_EVENT,
  CONSENT_OEFFNEN_EVENT,
  leseEinwilligung,
  speichereEinwilligung,
} from "@/lib/consent"
import { ladeFreigegebeneDienste } from "@/lib/consent-dienste"

/**
 * Eigener Cookie-Banner (ersetzt Cookiebot).
 * - Ohne gespeicherte Auswahl: Banner unten, „Alle akzeptieren“ und
 *   „Nur notwendige“ gleichwertig, dazu „Einstellungen“ mit Kategorien.
 * - Mit gespeicherter Auswahl: Dienste laden und `db:consent` melden.
 * - Über `db:consent-oeffnen` (Link „Cookie-Einstellungen“) erneut öffnen.
 */
export default function CookieBanner() {
  const [offen, setOffen] = useState(false)
  const [details, setDetails] = useState(false)
  const [statistik, setStatistik] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const e = leseEinwilligung()
    if (e) {
      setStatistik(e.statistik)
      setMarketing(e.marketing)
      ladeFreigegebeneDienste(e)
      window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: e }))
    } else {
      setOffen(true)
    }
    function oeffnen() {
      const akt = leseEinwilligung()
      setStatistik(akt?.statistik ?? false)
      setMarketing(akt?.marketing ?? false)
      setDetails(true)
      setOffen(true)
    }
    window.addEventListener(CONSENT_OEFFNEN_EVENT, oeffnen)
    return () => window.removeEventListener(CONSENT_OEFFNEN_EVENT, oeffnen)
  }, [])

  function waehle(s: boolean, m: boolean) {
    setOffen(false)
    setDetails(false)
    speichereEinwilligung(s, m)
  }

  if (!offen) return null

  const knopf =
    "w-full sm:w-auto px-5 py-3 text-sm font-medium tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4C6A6]"

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="db-cookie-titel"
      aria-describedby="db-cookie-text"
      className="fixed inset-x-0 bottom-0 z-[2147483000] p-3 sm:p-6"
    >
      <div className="mx-auto max-w-3xl bg-[#2C2C2C] text-white shadow-2xl border border-[#D4C6A6]/30 p-5 sm:p-7 max-h-[85vh] overflow-y-auto">
        <h2 id="db-cookie-titel" className="font-serif text-xl text-[#D4C6A6] mb-3">
          Cookies &amp; Datenschutz
        </h2>
        <p id="db-cookie-text" className="text-sm leading-relaxed text-white/80">
          Wir verwenden technisch notwendige Cookies, damit diese Website funktioniert. Mit Ihrer Einwilligung nutzen
          wir zusätzlich Dienste für Statistik (Google Analytics über den Google Tag Manager) und Marketing (Google
          Ads, Meta-Pixel, HubSpot), um zu verstehen, wie unsere Website genutzt wird, und um unsere Werbung zu messen.
          Dabei können Daten auch in die USA übertragen werden. Ihre Auswahl können Sie jederzeit über
          „Cookie-Einstellungen“ am Seitenende ändern oder widerrufen. Mehr in unserer{" "}
          <a href="/datenschutz" className="underline hover:text-[#D4C6A6]">
            Datenschutzerklärung
          </a>
          .
        </p>

        {details && (
          <div className="mt-5 space-y-3 text-sm">
            <Kategorie
              titel="Notwendig"
              text="Für den Betrieb der Website erforderlich, z. B. das Speichern dieser Auswahl. Immer aktiv."
              an
              gesperrt
            />
            <Kategorie
              titel="Statistik"
              text="Google Analytics (über den Google Tag Manager): anonyme Auswertung, welche Seiten wie genutzt werden. Anbieter: Google Ireland Ltd."
              an={statistik}
              onChange={setStatistik}
            />
            <Kategorie
              titel="Marketing"
              text="Google Ads (Conversion-Messung), Meta-Pixel (Facebook/Instagram), HubSpot (Zuordnung von Anfragen). Anbieter: Google Ireland Ltd., Meta Platforms Ireland Ltd., HubSpot Inc."
              an={marketing}
              onChange={setMarketing}
            />
          </div>
        )}

        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => waehle(true, true)}
            className={`${knopf} bg-[#D4C6A6] text-[#2C2C2C] hover:bg-[#e2d7bd]`}
          >
            Alle akzeptieren
          </button>
          <button
            type="button"
            onClick={() => waehle(false, false)}
            className={`${knopf} bg-[#D4C6A6] text-[#2C2C2C] hover:bg-[#e2d7bd]`}
          >
            Nur notwendige
          </button>
          {details ? (
            <button
              type="button"
              onClick={() => waehle(statistik, marketing)}
              className={`${knopf} border border-[#D4C6A6] text-[#D4C6A6] hover:bg-[#D4C6A6]/10`}
            >
              Auswahl speichern
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setDetails(true)}
              className={`${knopf} border border-[#D4C6A6] text-[#D4C6A6] hover:bg-[#D4C6A6]/10`}
            >
              Einstellungen
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Kategorie({
  titel,
  text,
  an,
  gesperrt,
  onChange,
}: {
  titel: string
  text: string
  an: boolean
  gesperrt?: boolean
  onChange?: (v: boolean) => void
}) {
  return (
    <label className="flex items-start gap-3 border border-white/10 p-3 cursor-pointer">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 accent-[#D4C6A6]"
        checked={an}
        disabled={gesperrt}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span>
        <span className="block font-medium text-white">{titel}</span>
        <span className="block text-white/70">{text}</span>
      </span>
    </label>
  )
}
