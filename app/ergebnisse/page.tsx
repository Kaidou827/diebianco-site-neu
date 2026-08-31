"use client"

import Image from "next/image"
import Link from "next/link"
import Navigation from "@/components/Navigation"
import SiteFooter from "@/components/SiteFooter"

const results = [
  { category: "Grey Blending", label: "Look A · Vorher", src: "/ergebnisse/look01-vorher.webp" },
  { category: "Grey Blending", label: "Look A · Nachher", src: "/ergebnisse/look01-nachher.webp" },
  { category: "Grey Blending", label: "Look B · Nachher", src: "/ergebnisse/look08-nachher.webp" },
  { category: "Grey Blending", label: "Look C · Nachher", src: "/ergebnisse/look09-nachher.webp" },
  { category: "Grey Blending", label: "Look D · Nachher", src: "/ergebnisse/look10-nachher.webp" },
  { category: "Blond", label: "Look Blond", src: "/ergebnisse/look02-blond-nachher.webp" },
  { category: "Balayage", label: "Look Balayage", src: "/ergebnisse/look07-balayage-nachher.webp" },
  { category: "Farbe", label: "Look Kupfer", src: "/ergebnisse/look11-kupfer-nachher.webp" },
]

const reviews = [
  "Absolute Spitzenklasse - ein Salon, den ich von Herzen weiterempfehle. Ich habe ohne Zweifel den schönsten Haarschnitt meines Lebens erhalten.",
  "Wer einmal dort war, wird nie wieder zu einem anderen Salon gehen. Absolute Profis das ganze Team.",
  "Meinen Friseur des Vertrauens hab ich gefunden! Man fühlt sich super wohl und verbringt dort gerne seine Zeit.",
  "Die Beratung war sehr klar und ehrlich. Das Ergebnis passt zu mir und ich bekomme ständig Komplimente.",
]

export default function ErgebnissePage() {
  return (
    <div className="bg-[#b4b1aa] text-white min-h-screen">
      <Navigation />

      <section className="pt-20 pb-16 md:pt-24 md:pb-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">
            Ergebnisse, die <span className="text-[#D4C6A6]">für sich sprechen</span>
          </h1>
          <p className="max-w-2xl mx-auto text-white/80 mb-8">
            Echte Kundenergebnisse aus dem Salon - von Grey Blending bis Blond, Balayage und Farbveredelungen.
          </p>
          <p className="inline-flex items-center justify-center rounded-full bg-white/70 px-5 py-2 text-sm md:text-base text-[#2C2C2C]">
            <span className="text-[#D4C6A6] mr-2">★★★★★</span>
            5,0 · 37 Google-Bewertungen
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((item) => (
              <article key={`${item.category}-${item.label}`} className="rounded-md border border-white/10 bg-black/20 p-3">
                <div className="relative h-56 rounded-md overflow-hidden">
                  <Image src={item.src} alt={item.label} fill className="object-cover" />
                </div>
                <p className="mt-3 text-xs text-[#D4C6A6] uppercase tracking-wide">{item.category}</p>
                <p className="text-sm text-white/90">{item.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-10">Kundenbewertungen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((quote, index) => (
              <article key={index} className="rounded-md border border-white/10 bg-black/20 p-6">
                <p className="text-[#D4C6A6] text-sm mb-3">★★★★★</p>
                <p className="text-white/90 text-sm leading-relaxed">&quot;{quote}&quot;</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto bg-black/20 rounded-xl border border-white/10 p-8 md:p-12 text-center">
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Bereit für deine Veränderung?</h2>
            <p className="text-white/80 mb-8">Buche jetzt deinen Termin und lass dich persönlich beraten.</p>
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] transition-all duration-300"
            >
              Jetzt Termin vereinbaren
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}
