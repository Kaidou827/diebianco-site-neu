"use client"

import Image from "next/image"
import Link from "next/link"
import Navigation from "@/components/Navigation"
import { ArrowRight } from "lucide-react"
import SiteFooter from "@/components/SiteFooter"
import TerminSektion from "@/components/TerminSektion"

export default function BlondSpezialistenPage() {
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
                BLOND-<span className="text-[#D4C6A6]">SPEZIALISTEN</span>
              </h1>

              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-12 bg-white/20"></div>
                <p className="text-lg text-white/80 font-light">Blond mit Charakter</p>
                <div className="h-px w-12 bg-white/20"></div>
              </div>

              <p className="text-xl md:text-2xl text-white mb-4 text-center font-light">Wow, ohne Kompromisse.</p>

              <p className="text-base md:text-lg text-white/70 mb-10 max-w-2xl mx-auto text-center leading-relaxed">
                Wir sind Experten für alle Blondnuancen – von kühlem Platin bis warmem Honig. Mit viel
                Fingerspitzengefühl und Expertise schaffen wir deinen perfekten Blondton – typgerecht, strahlend, mit
                Wow-Effekt.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="#kontakt-formular"
                  className="inline-flex justify-center items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4C6A6]/50 focus:ring-offset-2 shadow-lg"
                >
                  Jetzt Termin vereinbaren
                </Link>
                <button
                  onClick={() => {
                    document.getElementById("mehr-erfahren")?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="inline-flex justify-center items-center px-6 py-3 bg-transparent text-white font-medium border border-white/20 rounded-full hover:bg-white/10 hover:scale-[1.02] transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 group relative overflow-hidden"
                >
                  <div className="shine-effect bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                  <div className="shine-effect-move"></div>
                  <span className="relative z-10">Mehr erfahren</span>
                </button>
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
              Für ein Blond, das <span className="text-[#D4C6A6]">begeistert</span>
            </h2>
            <p className="text-white/80 text-lg mb-12 text-center">
              Bei DIE BIANCO verstehen wir die Kunst des perfekten Blonds. Jede Nuance wird individuell auf deinen Typ
              abgestimmt – für ein Ergebnis, das natürlich strahlt und lange hält.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              <Image src="/Blondierung.jpg" alt="Professionelle Blondierung" fill className="object-cover" />
              <div className="absolute inset-0"></div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="font-serif text-2xl text-white mb-6">Unsere Blond-Expertise</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-[#D4C6A6]/20 flex items-center justify-center text-[#D4C6A6]">
                    1
                  </div>
                  <div>
                    <h4 className="text-white text-lg mb-2">Individuelle Beratung</h4>
                    <p className="text-white/70">
                      Wir analysieren deinen Hautton und Stil, um die perfekte Blondnuance zu finden – von eisigem
                      Platin bis zu warmem Karamell.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-[#D4C6A6]/20 flex items-center justify-center text-[#D4C6A6]">
                    2
                  </div>
                  <div>
                    <h4 className="text-white text-lg mb-2">Schonende Technik</h4>
                    <p className="text-white/70">
                      Mit modernsten Techniken und hochwertigen Produkten erreichen wir dein Traumblond, während wir die
                      Haargesundheit bewahren.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-[#D4C6A6]/20 flex items-center justify-center text-[#D4C6A6]">
                    3
                  </div>
                  <div>
                    <h4 className="text-white text-lg mb-2">Langanhaltender Glanz</h4>
                    <p className="text-white/70">
                      Durch spezielle Pflegebehandlungen und individuelle Tipps bleibt dein Blond lange strahlend und
                      gesund.
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
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">
              Die Vorteile unserer Blond-Spezialisierung
            </h2>
            <p className="text-white/80 text-lg">
              Als Blond-Experten bieten wir dir mehr als nur eine Haarfarbe – wir kreieren deinen persönlichen
              Signature-Look.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-xl text-[#D4C6A6] mb-4">Perfekte Nuancierung</h3>
              <p className="text-white/80">
                Von kühlem Aschblond bis zu warmem Goldblond – wir finden die Nuance, die perfekt zu deinem Teint und
                Stil passt.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-xl text-[#D4C6A6] mb-4">Gesundes Haar</h3>
              <p className="text-white/80">
                Durch schonende Techniken und hochwertige Produkte bleibt dein Haar trotz Blondierung gesund und
                glänzend.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-xl text-[#D4C6A6] mb-4">Natürliche Ergebnisse</h3>
              <p className="text-white/80">
                Mit verschiedenen Techniken wie Balayage oder Foiling kreieren wir natürlich wirkende, mehrdimensionale
                Blondtöne.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-xl text-[#D4C6A6] mb-4">Individuelle Pflege</h3>
              <p className="text-white/80">
                Du erhältst eine auf dein Blond abgestimmte Pflegeroutine, damit deine Farbe lange strahlend bleibt.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#b4b1aa]">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl text-[#D4C6A6] mb-10 text-center">Unsere Ergebnisse</h2>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-md border border-white/10 bg-black/15 p-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="relative h-52 rounded-md overflow-hidden">
                    <Image src="/ergebnisse/blond-2-vorher.jpg" alt="Blond Vorher" fill className="object-cover" />
                  </div>
                  <p className="mt-2 text-center text-sm text-[#D4C6A6]">Vorher</p>
                </div>
                <div>
                  <div className="relative h-52 rounded-md overflow-hidden">
                    <Image src="/ergebnisse/blond-2-nachher.jpg" alt="Blond Nachher" fill className="object-cover" />
                  </div>
                  <p className="mt-2 text-center text-sm text-[#D4C6A6]">Nachher</p>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-white/10 bg-black/15 p-4">
              <div className="relative h-52 rounded-md overflow-hidden">
                <Image src="/ergebnisse/blond-1-nachher.jpg" alt="Blond Ergebnis" fill className="object-cover" />
              </div>
              <p className="mt-2 text-center text-sm text-[#D4C6A6]">Blond-Ergebnis</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-4 md:pb-8 bg-[#b4b1aa]">
        <div className="container mx-auto px-4">
          <p className="text-center text-white/80">
            Auch interessant:{" "}
            <Link href="/dienstleistungen/grey-blending" className="text-[#D4C6A6] hover:text-white transition-colors">
              Grey Blending
            </Link>
          </p>
        </div>
      </section>


      {/* Footer */}
      <TerminSektion behandlung="Strähnen / Blondierung" titel="Blond-Termin anfragen" />

      <SiteFooter />
    </div>
  )
}
