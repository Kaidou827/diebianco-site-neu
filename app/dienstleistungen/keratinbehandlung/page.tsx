"use client"

import Image from "next/image"
import Link from "next/link"
import Navigation from "@/components/Navigation"
import SiteFooter from "@/components/SiteFooter"
import TerminSektion from "@/components/TerminSektion"

export default function KeratinbehandlungPage() {
  return (
    <div className="bg-[#b4b1aa] text-white">
      {/* Standardized Navigation Component */}
      <Navigation />

      {/* Hero Section - Improved layout and padding */}
      <section className="pt-20 pb-16 md:pt-24 md:pb-20 relative">
        {/* Subtle background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent opacity-50"></div>
        <div className="absolute left-0 right-0 top-0 h-px bg-white/10"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6 text-center">
                KERATIN<span className="text-[#D4C6A6]">BEHANDLUNG</span>
              </h1>

              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-12 bg-white/20"></div>
                <p className="text-lg text-white/80 font-light">Seidigkeit, die bleibt</p>
                <div className="h-px w-12 bg-white/20"></div>
              </div>

              <p className="text-xl md:text-2xl text-white mb-4 text-center font-light">Dein Haar in Bestform.</p>

              <p className="text-base md:text-lg text-white/70 mb-10 max-w-2xl mx-auto text-center leading-relaxed">
                Unsere professionelle Keratinbehandlung glättet, pflegt und stärkt dein Haar tiefenwirksam. Für
                geschmeidiges, glänzendes Haar mit langanhaltendem Anti-Frizz-Effekt.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="#kontakt-formular"
                  className="inline-flex justify-center items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4C6A6]/50 focus:ring-offset-2 shadow-lg"
                >
                  Jetzt Termin vereinbaren
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section id="mehr-erfahren" className="py-16 md:py-24 bg-[#b4b1aa]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-8 text-center">
              Für Haar, das <span className="text-[#D4C6A6]">begeistert</span> und überzeugt
            </h2>
            <p className="text-white/80 text-lg mb-12 text-center">
              Bei DIE BIANCO verstehen wir, dass gesundes, gepflegtes Haar mehr als nur schön aussieht – es gibt dir
              Selbstvertrauen und unterstreicht deine natürliche Ausstrahlung.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              <Image
                src="/Keratinbehandlung.jpg"
                alt="Professionelle Keratinbehandlung"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0"></div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="font-serif text-2xl text-white mb-6">Unser Keratin-Prozess</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-[#D4C6A6]/20 flex items-center justify-center text-[#D4C6A6]">
                    1
                  </div>
                  <div>
                    <h4 className="text-white text-lg mb-2">Diagnose</h4>
                    <p className="text-white/70">
                      Wir analysieren deinen Haartyp, die Struktur und den Zustand, um die optimale Keratinbehandlung
                      für dich zu bestimmen.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-[#D4C6A6]/20 flex items-center justify-center text-[#D4C6A6]">
                    2
                  </div>
                  <div>
                    <h4 className="text-white text-lg mb-2">Behandlung</h4>
                    <p className="text-white/70">
                      Mit hochwertigen Produkten führen wir die Keratinbehandlung durch, die dein Haar von innen heraus
                      stärkt und glättet.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-[#D4C6A6]/20 flex items-center justify-center text-[#D4C6A6]">
                    3
                  </div>
                  <div>
                    <h4 className="text-white text-lg mb-2">Pflegeroutine</h4>
                    <p className="text-white/70">
                      Wir beraten dich zur optimalen Haarpflege für zu Hause, damit du lange Freude an deinem seidigen,
                      glatten Haar hast.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-[#a09a93]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">Die Vorteile unserer Keratinbehandlung</h2>
            <p className="text-white/80 text-lg">
              Eine professionelle Keratinbehandlung bietet dir zahlreiche Vorteile, die weit über einen gewöhnlichen
              Salonbesuch hinausgehen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-xl text-[#D4C6A6] mb-4">Seidig glattes Haar</h3>
              <p className="text-white/80">
                Die Keratinbehandlung glättet widerspenstiges Haar und reduziert Frizz deutlich – für einen
                langanhaltenden Glättungseffekt.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-xl text-[#D4C6A6] mb-4">Intensiver Glanz</h3>
              <p className="text-white/80">
                Dein Haar erhält einen beeindruckenden, natürlichen Glanz, der die Haarfarbe lebendiger und brillanter
                erscheinen lässt.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-xl text-[#D4C6A6] mb-4">Strukturverbesserung</h3>
              <p className="text-white/80">
                Die Behandlung repariert geschädigtes Haar von innen heraus und stärkt die Haarstruktur für mehr
                Widerstandsfähigkeit.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-xl text-[#D4C6A6] mb-4">Zeitersparnis</h3>
              <p className="text-white/80">
                Dein tägliches Styling wird deutlich einfacher und schneller – für mehr Zeit am Morgen und perfektes
                Haar den ganzen Tag.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ergebnisse Vorher/Nachher */}
      <section className="py-16 bg-[#b4b1aa]">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="font-serif text-3xl md:text-4xl text-[#D4C6A6] mb-8 text-center">Ergebnisse</h2>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-md border border-white/10 bg-black/15 p-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="relative h-56 rounded-md overflow-hidden">
                    <Image src="/ergebnisse/keratin-1-vorher.jpg" alt="Keratin Vorher" fill className="object-cover" />
                  </div>
                  <p className="mt-2 text-center text-sm text-[#D4C6A6]">Vorher</p>
                </div>
                <div>
                  <div className="relative h-56 rounded-md overflow-hidden">
                    <Image src="/ergebnisse/keratin-1-nachher.jpg" alt="Keratin Nachher" fill className="object-cover" />
                  </div>
                  <p className="mt-2 text-center text-sm text-[#D4C6A6]">Nachher</p>
                </div>
              </div>
            </div>
            <div className="rounded-md border border-white/10 bg-black/15 p-4">
              <div className="relative h-56 rounded-md overflow-hidden">
                <Image src="/ergebnisse/keratin-2-nachher.jpg" alt="Keratin Ergebnis" fill className="object-cover" />
              </div>
              <p className="mt-2 text-center text-sm text-[#D4C6A6]">Keratin-Ergebnis</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#b4b1aa]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-black/20 backdrop-blur-sm rounded-xl p-8 md:p-12 border border-white/20">
            <div className="text-center">
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">Bereit für seidig glattes Haar?</h2>
              <p className="text-white/80 text-lg mb-8">
                Vereinbare jetzt einen Termin und entdecke, wie unsere Keratinbehandlung dein Haar verwandeln kann.
              </p>
              <Link
                href="#kontakt-formular"
                className="inline-flex justify-center items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4C6A6]/50 focus:ring-offset-2 shadow-lg"
              >
                Jetzt Termin vereinbaren
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TerminSektion behandlung="Keratin" titel="Keratin-Termin anfragen" />

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
