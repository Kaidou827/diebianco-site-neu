"use client"

import Image from "next/image"
import Link from "next/link"
import Navigation from "@/components/Navigation"

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
                  href="/kontakt"
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
                href="/kontakt"
                className="inline-flex justify-center items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4C6A6]/50 focus:ring-offset-2 shadow-lg"
              >
                Jetzt Termin vereinbaren
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2C2C2C] text-white relative overflow-hidden">
        {/* Dekorative Elemente */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4C6A6]/30 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#D4C6A6]/3 -skew-x-12 transform origin-top-right opacity-30"></div>

        {/* Hauptbereich */}
        <div className="container px-4 md:px-6 py-16 md:py-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Logo und Beschreibung */}
            <div className="md:col-span-4">
              <div className="h-20 mb-6">
                <Image
                  src="/Die_Bianco_Logo.png"
                  alt="DIE BIANCO"
                  width={240}
                  height={72}
                  className="h-full w-auto object-contain"
                />
              </div>
              <div className="w-12 h-px bg-gradient-to-r from-[#D4C6A6] to-transparent mt-2"></div>
              <p className="text-white/70 leading-relaxed mb-6">
                Ihr exklusiver Rückzugsort für authentische Schönheit und ungestörte Momente der Pflege und Entspannung.
              </p>
            </div>

            {/* Kontakt */}
            <div className="md:col-span-3 md:col-start-6">
              <h3 className="font-serif text-lg mb-4 text-[#D4C6A6]">Kontakt</h3>
              <address className="not-italic text-white/70 space-y-3">
                <p className="flex items-start">
                  <svg
                    className="w-5 h-5 mr-3 text-[#D4C6A6] flex-shrink-0 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>
                    Siedlung Egelsberg 1
                    <br />
                    47802 Krefeld
                  </span>
                </p>
                <p className="flex items-start">
                  <svg
                    className="w-5 h-5 mr-3 text-[#D4C6A6] flex-shrink-0 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>+49 174 3091973</span>
                </p>
                <p className="flex items-start">
                  <svg
                    className="w-5 h-5 mr-3 text-[#D4C6A6] flex-shrink-0 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span>salon@diebianco.de</span>
                </p>
              </address>
            </div>

            {/* Öffnungszeiten */}
            <div className="md:col-span-3 md:col-start-10">
              <h3 className="font-serif text-lg mb-4 text-[#D4C6A6]">Öffnungszeiten</h3>
              <div className="text-white/70 space-y-3">
                <p className="flex items-start">
                  <svg
                    className="w-5 h-5 mr-3 text-[#D4C6A6] flex-shrink-0 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>
                    Mi - Fr: 09:00 - 17:15 Uhr
                    <br />
                    Sa: 07:00 - 14:00 Uhr
                    <br />
                    Mo, Di, So: Geschlossen
                  </span>
                </p>
                <p className="flex items-start">
                  <svg
                    className="w-5 h-5 mr-3 text-[#D4C6A6] flex-shrink-0 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>Termine nach Vereinbarung</span>
                </p>
              </div>
            </div>
          </div>

          {/* Trennlinie */}
          <div className="border-t border-white/10 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/50 text-sm">© {new Date().getFullYear()} DIE BIANCO. Alle Rechte vorbehalten.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="/impressum" className="text-white/50 text-sm hover:text-[#D4C6A6] transition-colors">
                  Impressum
                </a>
                <a href="/datenschutz" className="text-white/50 text-sm hover:text-[#D4C6A6] transition-colors">
                  Datenschutz
                </a>
                <a href="#" className="text-white/50 text-sm hover:text-[#D4C6A6] transition-colors">
                  AGB
                </a>
                <a href="/mentoring" className="text-white/50 text-sm hover:text-[#D4C6A6] transition-colors">
                  Mentoring
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
