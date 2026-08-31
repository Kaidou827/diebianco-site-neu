"use client"

import Image from "next/image"
import Link from "next/link"
import Navigation from "@/components/Navigation"
import SiteFooter from "@/components/SiteFooter"
import TerminSektion from "@/components/TerminSektion"

export default function SchnitttechnikenPage() {
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
                SCHNITT<span className="text-[#D4C6A6]">TECHNIKEN</span>
              </h1>

              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-12 bg-white/20"></div>
                <p className="text-lg text-white/80 font-light">Präzision trifft Persönlichkeit</p>
                <div className="h-px w-12 bg-white/20"></div>
              </div>

              <p className="text-xl md:text-2xl text-white mb-4 text-center font-light">
                Dein Schnitt im Rhythmus der Jahreszeiten.
              </p>

              <p className="text-base md:text-lg text-white/70 mb-10 max-w-2xl mx-auto text-center leading-relaxed">
                Unsere saisonalen Schnitttechniken orientieren sich an aktuellen Looks, deinem Typ und der Zeitqualität.
                Von &quot;Luna&quot;-Looks im Winter bis zu &quot;Sun&quot;-Styles im Sommer – jeder Schnitt erzählt
                deine Geschichte.
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
              Für einen Schnitt, der deine <span className="text-[#D4C6A6]">Persönlichkeit</span> unterstreicht
            </h2>
            <p className="text-white/80 text-lg mb-12 text-center">
              Bei DIE BIANCO ist jeder Haarschnitt ein individuelles Kunstwerk, das deine natürliche Schönheit und
              deinen persönlichen Stil zum Ausdruck bringt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              <Image src="/Schnitttechniken.jpg" alt="Professionelle Schnitttechnik" fill className="object-cover" />
              <div className="absolute inset-0"></div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="font-serif text-2xl text-white mb-6">Unsere saisonalen Konzepte</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-[#D4C6A6]/20 flex items-center justify-center text-[#D4C6A6]">
                    1
                  </div>
                  <div>
                    <h4 className="text-white text-lg mb-2">Luna-Looks (Winter)</h4>
                    <p className="text-white/70">
                      Elegante, präzise Schnitte mit klaren Linien und Struktur, die auch unter Mützen und Schals ihre
                      Form behalten.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-[#D4C6A6]/20 flex items-center justify-center text-[#D4C6A6]">
                    2
                  </div>
                  <div>
                    <h4 className="text-white text-lg mb-2">Blossom-Styles (Frühling)</h4>
                    <p className="text-white/70">
                      Leichte, bewegliche Schnitte mit sanften Übergängen, die Frische und Natürlichkeit ausstrahlen.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-[#D4C6A6]/20 flex items-center justify-center text-[#D4C6A6]">
                    3
                  </div>
                  <div>
                    <h4 className="text-white text-lg mb-2">Sun-Styles (Sommer)</h4>
                    <p className="text-white/70">
                      Luftige, texturierte Schnitte, die auch bei Hitze und Feuchtigkeit perfekt aussehen und leicht zu
                      stylen sind.
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
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">Die Vorteile unserer Schnitttechniken</h2>
            <p className="text-white/80 text-lg">
              Ein professioneller Haarschnitt ist die Grundlage für einen Look, der nicht nur gut aussieht, sondern auch
              im Alltag überzeugt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-xl text-[#D4C6A6] mb-4">Perfekte Passform</h3>
              <p className="text-white/80">
                Unsere Schnitte berücksichtigen deine Gesichtsform, Haarstruktur und deinen persönlichen Stil für ein
                harmonisches Gesamtbild.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-xl text-[#D4C6A6] mb-4">Leichtes Styling</h3>
              <p className="text-white/80">
                Mit der richtigen Schnitttechnik lässt sich dein Haar morgens schnell und einfach in Form bringen – für
                mehr Zeit im Alltag.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-xl text-[#D4C6A6] mb-4">Langanhaltende Form</h3>
              <p className="text-white/80">
                Durch präzise Techniken wächst dein Haar gleichmäßig nach und behält auch zwischen den Terminen seine
                schöne Form.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-xl text-[#D4C6A6] mb-4">Haargesundheit</h3>
              <p className="text-white/80">
                Unsere Schnitttechniken fördern die Gesundheit deines Haares, indem sie Spliss reduzieren und die
                natürliche Textur unterstützen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#b4b1aa]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-black/20 backdrop-blur-sm rounded-xl p-8 md:p-12 border border-white/20">
            <div className="text-center">
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">Bereit für deinen neuen Look?</h2>
              <p className="text-white/80 text-lg mb-8">
                Vereinbare jetzt einen Termin und entdecke, welcher Schnitt perfekt zu dir passt.
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

      {/* Footer */}
      <TerminSektion behandlung="Schnitt & Styling" titel="Schnitt-Termin anfragen" />

      <SiteFooter />
    </div>
  )
}
