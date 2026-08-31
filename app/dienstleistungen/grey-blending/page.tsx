"use client"

import Image from "next/image"
import Link from "next/link"
import Navigation from "@/components/Navigation"
import { ArrowRight } from "lucide-react"
import SiteFooter from "@/components/SiteFooter"
import TerminSektion from "@/components/TerminSektion"

export default function GreyBlendingPage() {
  return (
    <div className="bg-[#b4b1aa] text-white">
      {/* Standardized Navigation Component */}
      <Navigation />

      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-24 md:pb-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent opacity-50"></div>
        <div className="absolute left-0 right-0 top-0 h-px bg-white/10"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6 text-center">
                GREY <span className="text-[#D4C6A6]">BLENDING</span>
              </h1>

              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-12 bg-white/20"></div>
                <p className="text-lg text-white/80 font-light">Grau umarmen - mit Stil</p>
                <div className="h-px w-12 bg-white/20"></div>
              </div>

              <p className="text-xl md:text-2xl text-white mb-4 text-center font-light">
                Mehr als nur Grau. Ein Look der zu dir passt.
              </p>

              <p className="text-base md:text-lg text-white/70 mb-10 max-w-2xl mx-auto text-center leading-relaxed">
                Grey Blending ist die Kunst, graues Haar nicht zu verstecken - sondern es zum Signature-Look zu machen.
                Bei DIE BIANCO arbeiten wir individuell auf deinen Haartyp und deine natürliche Farbe abgestimmt.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/grey-blending-beratung"
                  className="inline-flex justify-center items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4C6A6]/50 focus:ring-offset-2 shadow-lg"
                >
                  Jetzt Beratungstermin anfragen
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
              Für ein Grau, das <span className="text-[#D4C6A6]">begeistert</span>
            </h2>
            <p className="text-white/80 text-lg mb-12 text-center">
              Bei DIE BIANCO verstehen wir Grey Blending als Kunst. Jede Nuance wird individuell auf deinen Typ
              abgestimmt - für ein Ergebnis das natürlich wirkt und langanhaltend strahlt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              <Image src="/Blondierung.jpg" alt="Grey Blending Behandlung" fill className="object-cover" />
              <div className="absolute inset-0"></div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="font-serif text-2xl text-white mb-6">Unsere Grey Blending Expertise</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-[#D4C6A6]/20 flex items-center justify-center text-[#D4C6A6]">
                    1
                  </div>
                  <div>
                    <h4 className="text-white text-lg mb-2">Individuelle Beratung</h4>
                    <p className="text-white/70">
                      Wir analysieren deine natürliche Haarfarbe und deinen Hautton um den perfekten Grey Blending
                      Look für dich zu finden.
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
                      Mit modernen Techniken und hochwertigen Produkten erzielen wir natürliche Übergänge die dein
                      Haar gesund lassen.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-[#D4C6A6]/20 flex items-center justify-center text-[#D4C6A6]">
                    3
                  </div>
                  <div>
                    <h4 className="text-white text-lg mb-2">Langanhaltender Effekt</h4>
                    <p className="text-white/70">
                      Durch gezielte Pflege und individuelle Tipps bleibt dein Grey Blending Look lange frisch und
                      gepflegt.
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
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">Die Vorteile unseres Grey Blendings</h2>
            <p className="text-white/80 text-lg">
              Grey Blending bringt natürliche Eleganz und eine moderne Ausstrahlung zusammen - individuell auf dich
              abgestimmt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-xl text-[#D4C6A6] mb-4">Natürliche Ausstrahlung</h3>
              <p className="text-white/80">
                Grau muss nicht alt wirken. Der richtige Look unterstreicht deine Persönlichkeit und lässt dich
                modern und selbstbewusst aussehen.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-xl text-[#D4C6A6] mb-4">Gesundes Haar</h3>
              <p className="text-white/80">
                Durch schonende Techniken und hochwertige Produkte bleibt dein Haar trotz Behandlung gesund und
                glänzend.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-xl text-[#D4C6A6] mb-4">Zeitloses Ergebnis</h3>
              <p className="text-white/80">
                Grey Blending ist kein Trend - es ist ein individueller Signature-Look der nie aus der Mode kommt.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-xl text-[#D4C6A6] mb-4">Individuelle Pflege</h3>
              <p className="text-white/80">
                Du erhältst eine auf dein Grey Blending abgestimmte Pflegeroutine damit deine Farbe lange strahlend
                bleibt.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#b4b1aa]">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl text-[#D4C6A6] mb-10 text-center">Unsere Ergebnisse</h2>

          <div className="max-w-6xl mx-auto space-y-6">
            <div className="rounded-md border border-white/10 bg-black/15 p-4">
              <p className="text-[#D4C6A6] text-sm mb-3">Look A · Highlight</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="relative h-60 rounded-md overflow-hidden">
                    <Image src="/ergebnisse/grey-blending-1-vorher.jpg" alt="Grey Blending Vorher" fill className="object-cover" />
                  </div>
                  <p className="mt-2 text-center text-sm text-[#D4C6A6]">Vorher</p>
                </div>
                <div>
                  <div className="relative h-60 rounded-md overflow-hidden">
                    <Image src="/ergebnisse/grey-blending-1-nachher.jpg" alt="Grey Blending Nachher" fill className="object-cover" />
                  </div>
                  <p className="mt-2 text-center text-sm text-[#D4C6A6]">Nachher</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-md border border-white/10 bg-black/15 p-4">
                <div className="relative h-60 rounded-md overflow-hidden">
                  <Image src="/ergebnisse/grey-blending-2-nachher.jpg" alt="Look B Nachher" fill className="object-cover" />
                </div>
                <p className="mt-3 text-sm text-white/90">
                  Look B: Natürliche Integration mit pflegeleichtem Ergebnis und längeren Farbintervallen.
                </p>
              </div>
              <div className="rounded-md border border-white/10 bg-black/15 p-4">
                <div className="relative h-60 rounded-md overflow-hidden">
                  <Image src="/ergebnisse/grey-blending-3-nachher.jpg" alt="Look C Nachher" fill className="object-cover" />
                </div>
                <p className="mt-3 text-sm text-white/90">
                  Look C: Nuancen-Anpassung für ein ruhigeres, dunkler abgestimmtes Grey Blending.
                </p>
              </div>
              <div className="rounded-md border border-white/10 bg-black/15 p-4">
                <div className="relative h-60 rounded-md overflow-hidden">
                  <Image src="/ergebnisse/grey-blending-4-nachher.jpg" alt="Look D Nachher" fill className="object-cover" />
                </div>
                <p className="mt-3 text-sm text-white/90">
                  Look D: Dunkles Grey Blending mit Bob und Pony als klare Komplett-Transformation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#b4b1aa]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-black/20 backdrop-blur-sm rounded-xl p-8 md:p-12 border border-white/20">
            <div className="text-center">
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">Bereit für deinen Grey Blending Look?</h2>
              <p className="text-white/80 text-lg mb-8">
                Vereinbare jetzt einen Termin und lass dich von unseren Expertinnen persönlich beraten.
              </p>
              <Link
                href="/grey-blending-beratung"
                className="inline-flex justify-center items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4C6A6]/50 focus:ring-offset-2 shadow-lg"
              >
                <span className="relative z-10 font-medium">Jetzt Termin vereinbaren</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <TerminSektion behandlung="Grey Blending" titel="Grey-Blending-Termin anfragen" />

      <SiteFooter />
    </div>
  )
}
