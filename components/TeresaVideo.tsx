import React from "react"
import Script from "next/script"

/**
 * Vorstellungsvideo von Teresa (Wistia, Media-ID bfj901af1d) — dieselbe Quelle
 * wie auf der Startseite, hier als wiederverwendbare Komponente (nicht dupliziert).
 * Wistia zeigt zuerst das Poster (Swatch) + Play-Button, kein Ton-Autoplay.
 * Scripts lazy geladen, damit die Ladezeit der Landingpage nicht leidet.
 */
export default function TeresaVideo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative rounded-lg overflow-hidden shadow-xl ${className}`}>
      <Script src="https://fast.wistia.com/player.js" strategy="lazyOnload" />
      <Script src="https://fast.wistia.com/embed/bfj901af1d.js" strategy="lazyOnload" type="module" />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        wistia-player[media-id='bfj901af1d']:not(:defined) {
          background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/bfj901af1d/swatch');
          display: block;
          filter: blur(5px);
          padding-top: 56.25%;
        }
      `,
        }}
      />
      {React.createElement("wistia-player", {
        "media-id": "bfj901af1d",
        aspect: "1.7777777777777777",
        style: { width: "100%", display: "block" },
      })}
    </div>
  )
}
