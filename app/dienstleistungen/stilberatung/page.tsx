"use client"

import Image from "next/image"
import Link from "next/link"
import Navigation from "@/components/Navigation"
import { Shirt, Palette, Sparkles, Scissors, Heart, Users } from "lucide-react"

export default function StilberatungPage() {
  return (
    <div className="bg-[#b4b1aa] text-white">
      {/* Standardized Navigation Component */}
      <Navigation />

      {/* Hero Section - Matched exactly with farbtypologie page */}
      <section className="pt-20 pb-16 md:pt-24 md:pb-20 relative">
        {/* Subtle background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent opacity-50"></div>
        <div className="absolute left-0 right-0 top-0 h-px bg-white/10"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6 text-center">
                STIL<span className="text-[#D4C6A6]">BERATUNG</span>
              </h1>

              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-12 bg-white/20"></div>
                <p className="text-lg text-white/80 font-light">Persönliche Stilfindung</p>
                <div className="h-px w-12 bg-white/20"></div>
              </div>

              <p className="text-xl md:text-2xl text-white mb-4 text-center font-light">Authentisch wie du.</p>

              <p className="text-base md:text-lg text-white/70 mb-10 max-w-2xl mx-auto text-center leading-relaxed">
                Unsere Stilberatung hilft dir, deinen persönlichen Stil zu finden und zu entwickeln – perfekt abgestimmt
                auf deine Persönlichkeit, deinen Körpertyp und deinen Lebensstil.
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

      {/* Main Content - Completely rebuilt */}
      <section id="mehr-erfahren" className="py-16 md:py-24 bg-[#b4b1aa]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-8 text-center">
              Entdecken Sie Ihren <span className="text-[#D4C6A6]">persönlichen Stil</span>
            </h2>
            <p className="text-white/80 text-lg mb-12 text-center">
              Unsere Stilberatung geht weit über Modetrends hinaus. Wir helfen Ihnen, einen authentischen Stil zu
              entwickeln, der Ihre Persönlichkeit unterstreicht und zu Ihrem Lebensstil passt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              <Image src="/Stilberatung.jpg" alt="Professionelle Stilberatung" fill className="object-cover" />
              <div className="absolute inset-0"></div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="font-serif text-2xl text-white mb-6">Unser Stilberatungs-Prozess</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-[#D4C6A6]/20 flex items-center justify-center text-[#D4C6A6]">
                    1
                  </div>
                  <div>
                    <h4 className="text-white text-lg mb-2">Persönlichkeitsanalyse</h4>
                    <p className="text-white/70">
                      Wir lernen Sie kennen – Ihre Vorlieben, Ihren Lebensstil und Ihre Ziele, um ein ganzheitliches
                      Stilkonzept zu entwickeln.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-[#D4C6A6]/20 flex items-center justify-center text-[#D4C6A6]">
                    2
                  </div>
                  <div>
                    <h4 className="text-white text-lg mb-2">Figuranalyse</h4>
                    <p className="text-white/70">
                      Wir analysieren Ihren Körpertyp, um Schnitte und Silhouetten zu identifizieren, die Ihre Vorzüge
                      optimal betonen.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-[#D4C6A6]/20 flex items-center justify-center text-[#D4C6A6]">
                    3
                  </div>
                  <div>
                    <h4 className="text-white text-lg mb-2">Stilkonzept</h4>
                    <p className="text-white/70">
                      Gemeinsam entwickeln wir ein individuelles Stilkonzept, das zu Ihrem Alltag passt und Ihre
                      Persönlichkeit unterstreicht.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Style Categories - New Section */}
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-10 text-center">
              Unsere <span className="text-[#D4C6A6]">Stilrichtungen</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Business Style */}
              <div className="bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10">
                <div className="relative h-64">
                  <Image src="/business.jpg" alt="Business Style" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <h3 className="text-xl font-serif text-white mb-2">Business Style</h3>
                    <p className="text-white/80 text-sm">Professionelle Eleganz für den Arbeitsalltag</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-white/70 text-sm">
                    Elegante und professionelle Outfits, die Kompetenz ausstrahlen und gleichzeitig Ihre Persönlichkeit
                    zum Ausdruck bringen.
                  </p>
                </div>
              </div>

              {/* Casual Chic */}
              <div className="bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10">
                <div className="relative h-64">
                  <Image src="/casual-chic.jpg" alt="Casual Chic" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <h3 className="text-xl font-serif text-white mb-2">Casual Chic</h3>
                    <p className="text-white/80 text-sm">Stilvolle Alltagsmode mit Eleganz</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-white/70 text-sm">
                    Lässige, aber durchdachte Looks für den Alltag, die Komfort mit Stil verbinden und Ihre natürliche
                    Ausstrahlung unterstreichen.
                  </p>
                </div>
              </div>

              {/* Straßenkleidung / Street Style */}
              <div className="bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10">
                <div className="relative h-64">
                  <Image src="/street.jpg" alt="Streetwear" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <h3 className="text-xl font-serif text-white mb-2">Streetwear</h3>
                    <p className="text-white/80 text-sm">Urbane Trends mit persönlicher Note</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-white/70 text-sm">
                    Moderne, urbane Looks, die aktuelle Trends aufgreifen und mit Ihrer individuellen Persönlichkeit
                    verschmelzen.
                  </p>
                </div>
              </div>

              {/* Abendgarderobe */}
              <div className="bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10">
                <div className="relative h-64">
                  <Image src="/crop-2.jpg" alt="Abendgarderobe" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <h3 className="text-xl font-serif text-white mb-2">Abendgarderobe</h3>
                    <p className="text-white/80 text-sm">Eleganz für besondere Anlässe</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-white/70 text-sm">
                    Stilvolle Outfits für besondere Anlässe, die Ihre Vorzüge betonen und einen bleibenden Eindruck
                    hinterlassen.
                  </p>
                </div>
              </div>

              {/* Minimalistischer Stil */}
              <div className="bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10">
                <div className="relative h-64">
                  <Image src="/minimalistic.jpg" alt="Trendsetter" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <h3 className="text-xl font-serif text-white mb-2">Trendsetter</h3>
                    <p className="text-white/80 text-sm">Zeitlose Eleganz durch Reduktion</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-white/70 text-sm">
                    Klare Linien, hochwertige Basics und durchdachte Kombinationen für einen zeitlosen, eleganten Look.
                  </p>
                </div>
              </div>

              {/* Bohemian Style */}
              <div className="bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10">
                <div className="relative h-64">
                  <Image src="/crop-1.jpg" alt="Bohemian Style" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <h3 className="text-xl font-serif text-white mb-2">Bohemian Style</h3>
                    <p className="text-white/80 text-sm">Freigeistige Ausdrucksform</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-white/70 text-sm">
                    Kreative, freigeistige Looks mit Layering, Mustern und natürlichen Materialien für einen
                    individuellen Ausdruck.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-[#b4b1aa]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">
              Die Vorteile einer professionellen Stilberatung
            </h2>
            <p className="text-white/80 text-lg">
              Eine persönliche Stilberatung bietet Ihnen zahlreiche Vorteile, die weit über die Kleiderwahl hinausgehen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="w-12 h-12 rounded-full bg-[#D4C6A6]/20 flex items-center justify-center mb-4">
                <Shirt className="w-6 h-6 text-[#D4C6A6]" />
              </div>
              <h3 className="text-xl text-white mb-4">Zeitersparnis</h3>
              <p className="text-white/80">
                Nie wieder ratlos vor dem Kleiderschrank stehen. Mit einem klaren Stilkonzept treffen Sie schneller die
                richtigen Entscheidungen.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="w-12 h-12 rounded-full bg-[#D4C6A6]/20 flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-[#D4C6A6]" />
              </div>
              <h3 className="text-xl text-white mb-4">Authentischer Ausdruck</h3>
              <p className="text-white/80">
                Ihr Stil wird zum authentischen Ausdruck Ihrer Persönlichkeit – Sie fühlen sich wohl und selbstbewusst
                in Ihrer Kleidung.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="w-12 h-12 rounded-full bg-[#D4C6A6]/20 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-[#D4C6A6]" />
              </div>
              <h3 className="text-xl text-white mb-4">Mehr Selbstbewusstsein</h3>
              <p className="text-white/80">
                Mit einem stimmigen Stil strahlen Sie Selbstsicherheit aus und hinterlassen einen bleibenden Eindruck.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="w-12 h-12 rounded-full bg-[#D4C6A6]/20 flex items-center justify-center mb-4">
                <Scissors className="w-6 h-6 text-[#D4C6A6]" />
              </div>
              <h3 className="text-xl text-white mb-4">Nachhaltiger Kleiderschrank</h3>
              <p className="text-white/80">
                Investieren Sie gezielt in Kleidungsstücke, die zu Ihnen passen und langfristig Freude bereiten.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="w-12 h-12 rounded-full bg-[#D4C6A6]/20 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-[#D4C6A6]" />
              </div>
              <h3 className="text-xl text-white mb-4">Harmonisches Gesamtbild</h3>
              <p className="text-white/80">
                Ihr Stil, Ihre Haarfarbe und Ihr Schnitt ergänzen sich perfekt zu einem harmonischen Gesamtbild.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="w-12 h-12 rounded-full bg-[#D4C6A6]/20 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-[#D4C6A6]" />
              </div>
              <h3 className="text-xl text-white mb-4">Individuelle Beratung</h3>
              <p className="text-white/80">
                Profitieren Sie von unserer Expertise und erhalten Sie maßgeschneiderte Empfehlungen für Ihren
                persönlichen Stil.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Matched with farbtypologie page */}
      <section className="py-16 md:py-24 bg-[#b4b1aa]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-black/20 backdrop-blur-sm rounded-xl p-8 md:p-12 border border-white/20">
            <div className="text-center">
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">
                Bereit für Ihre persönliche Stilberatung?
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Vereinbaren Sie jetzt einen Termin und entdecken Sie Ihren authentischen Stil.
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

      {/* Footer - Exact same as farbtypologie page */}
      <footer className="bg-[#2C2C2C] text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4C6A6]/30 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#D4C6A6]/3 -skew-x-12 transform origin-top-right opacity-30"></div>

        {/* Main Area */}
        <div className="container px-4 md:px-6 py-16 md:py-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Logo and Description */}
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

            {/* Contact */}
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

            {/* Opening Hours */}
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
                    Mi - Sa: 09:00 - 17:15 Uhr
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

          {/* Divider */}
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
                <a href="/kontakt" className="text-white/50 text-sm hover:text-[#D4C6A6] transition-colors">
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
