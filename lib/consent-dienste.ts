/**
 * lib/consent-dienste.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Lädt Tracking-Dienste ERST nach Einwilligung (ersetzt das Auto-Blocking von
 * Cookiebot). Nur aktiv, wenn das Root-Layout im Production-Build das Flag
 * `window.__dbTracking = true` gesetzt hat (keine Tags lokal/in Previews).
 *
 *  - statistik ODER marketing → Google Tag Manager (Tags darin richten sich
 *    nach Consent Mode v2, der vorher aktualisiert wird).
 *  - marketing → Google-Ads-Tag (gtag.js), Meta-Pixel, HubSpot-Tracking.
 * Jeder Dienst wird höchstens einmal eingefügt.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const GTM_ID = "GTM-KGB529BZ"
export const GOOGLE_ADS_ID = "AW-17270753092"
export const META_PIXEL_ID = "1556322352741442"
export const HUBSPOT_SRC = "https://js-eu1.hs-scripts.com/146440145.js"

type Auswahl = { statistik: boolean; marketing: boolean }
type DienstWindow = { __dbTracking?: boolean; dataLayer?: unknown[] }

function istAktiv(): boolean {
  return typeof window !== "undefined" && (window as unknown as DienstWindow).__dbTracking === true
}

function skriptEinfuegen(id: string, opts: { src?: string; inline?: string }): void {
  if (document.getElementById(id)) return
  const s = document.createElement("script")
  s.id = id
  if (opts.src) {
    s.src = opts.src
    s.async = true
  }
  if (opts.inline) s.text = opts.inline
  document.head.appendChild(s)
}

function ladeGtm(): void {
  const w = window as unknown as DienstWindow
  w.dataLayer = w.dataLayer || []
  if (document.getElementById("gtm-head")) return
  w.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" })
  skriptEinfuegen("gtm-head", { src: `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}` })
}

function ladeGoogleAds(): void {
  if (document.getElementById("gtag-js")) return
  skriptEinfuegen("gtag-js", { src: `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}` })
  skriptEinfuegen("gtag-config", {
    inline: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GOOGLE_ADS_ID}');`,
  })
}

function ladeMetaPixel(): void {
  // Inline-Snippet läuft beim Einfügen synchron → window.fbq existiert sofort danach.
  skriptEinfuegen("meta-pixel", {
    inline:
      "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?" +
      "n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;" +
      "n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];" +
      "s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');" +
      `fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`,
  })
}

function ladeHubspot(): void {
  skriptEinfuegen("hs-script-loader", { src: HUBSPOT_SRC })
}

/** Lädt alles, was die Auswahl erlaubt (idempotent). */
export function ladeFreigegebeneDienste(auswahl: Auswahl): void {
  if (!istAktiv()) return
  if (auswahl.marketing) {
    ladeMetaPixel()
    ladeGoogleAds()
    ladeHubspot()
  }
  if (auswahl.statistik || auswahl.marketing) ladeGtm()
}
