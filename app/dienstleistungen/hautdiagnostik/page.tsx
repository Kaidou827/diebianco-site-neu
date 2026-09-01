"use client"

"use client"

"use client"

import Image from "next/image"
import Link from "next/link"
import Navigation from "@/components/Navigation"
import SiteFooter from "@/components/SiteFooter"
import TerminSektion from "@/components/TerminSektion"

export default function HautdiagnostikPage() {
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
                HAUT<span className="text-[#D4C6A6]">DIAGNOSTIK</span>
              </h1>

              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-12 bg-white/20"></div>
                <p className="text-lg text-white/80 font-light">Professionelle Hautanalyse</p>
                <div className="h-px w-12 bg-white/20"></div>
              </div>

              <p className="text-xl md:text-2xl text-white mb-4 text-center font-light">
                Pflege beginnt mit Wissen – deine Haut im Fokus.
              </p>

              <p className="text-base md:text-lg text-white/70 mb-10 max-w-2xl mx-auto text-center leading-relaxed">
                Wir analysieren professionell deinen Hauttyp und empfehlen exakt abgestimmte Pflege für gesunde, vitale
                Haut – weil jede Haut einzigartig ist.
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
              Für eine Hautpflege, die dich <span className="text-[#D4C6A6]">strahlen</span> lässt
            </h2>
            <p className="text-white/80 text-lg mb-12 text-center">
              Bei DIE BIANCO verstehen wir, dass die richtige Hautpflege mehr ist als nur ein Trend – sie ist essenziell
              für deine Gesundheit und unterstreicht deine natürliche Schönheit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              <Image src="/Hautdiagnostik.jpg" alt="Professionelle Hautdiagnostik" fill className="object-cover" />
              <div className="absolute inset-0"></div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="font-serif text-2xl text-white mb-6">Unser Hautdiagnostik-Prozess</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-[#D4C6A6]/20 flex items-center justify-center text-[#D4C6A6]">
                    1
                  </div>
                  <div>
                    <h4 className="text-white text-lg mb-2">Analyse</h4>
                    <p className="text-white/70">
                      Wir analysieren deinen Hauttyp, Feuchtigkeitsgehalt und spezifische Hautbedürfnisse, um ein
                      vollständiges Hautprofil zu erstellen.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-[#D4C6A6]/20 flex items-center justify-center text-[#D4C6A6]">
                    2
                  </div>
                  <div>
                    <h4 className="text-white text-lg mb-2">Beratung</h4>
                    <p className="text-white/70">
                      Gemeinsam besprechen wir deine Hautbedürfnisse und zeigen dir, welche Pflegeprodukte und Routinen
                      optimal für deine Haut sind.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-[#D4C6A6]/20 flex items-center justify-center text-[#D4C6A6]">
                    3
                  </div>
                  <div>
                    <h4 className="text-white text-lg mb-2">Pflegeplan</h4>
                    <p className="text-white/70">
                      Unsere Hautexperten entwickeln einen individuellen Pflegeplan mit hochwertigen Produkten für deine
                      tägliche Routine.
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
              Die Vorteile einer professionellen Hautdiagnostik
            </h2>
            <p className="text-white/80 text-lg">
              Eine professionelle Hautanalyse bietet dir zahlreiche Vorteile, die weit über einen gewöhnlichen
              Salon-Besuch hinausgehen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-xl text-[#D4C6A6] mb-4">Maßgeschneiderte Pflege</h3>
              <p className="text-white/80">
                Die richtige Hautpflege, abgestimmt auf deinen individuellen Hauttyp, verbessert das Hautbild und löst
                spezifische Hautprobleme.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-xl text-[#D4C6A6] mb-4">Langfristige Hautgesundheit</h3>
              <p className="text-white/80">
                Mit einer typgerechten Pflege investierst du in die langfristige Gesundheit deiner Haut und beugst
                vorzeitiger Hautalterung vor.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-xl text-[#D4C6A6] mb-4">Effiziente Produktauswahl</h3>
              <p className="text-white/80">
                Wir helfen dir, die wirklich wirksamen Produkte zu finden und vermeiden unnötige oder sogar schädliche
                Pflegeprodukte.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-xl text-[#D4C6A6] mb-4">Strahlendes Aussehen</h3>
              <p className="text-white/80">
                Die perfekte Hautpflege sorgt für einen ebenmäßigen Teint, reduziert Unreinheiten und lässt dich
                natürlich strahlen.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <TerminSektion behandlung="Beratungsgespräch" titel="Hautdiagnostik-Termin anfragen" />

      <SiteFooter />
    </div>
  )
}
