"use client"

import { motion } from "framer-motion"
import Navigation from "@/components/Navigation"
import Image from "next/image"

export default function BehandlungenPreise() {
  return (
    <div className="min-h-screen bg-[#b4b1aa]">
      <Navigation />

      {/* Simple Hero Section */}
      <section className="relative py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2C2C2C] via-[#3C3C3C] to-[#2C2C2C]" />

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#D4C6A6]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#b4b1aa]/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
              Behandlungen & Preise
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Price List Section */}
      <section className="py-16 md:py-20 bg-[#b4b1aa]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8 lg:p-12">
            {/* CUT & FINISH */}
            <div className="mb-12">
              <h2 className="font-serif text-xl md:text-2xl lg:text-3xl text-[#2C2C2C] mb-4 md:mb-6 pb-2 border-b border-gray-200">
                CUT & FINISH
              </h2>
              <div className="space-y-3 md:space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Damen – Master Stylist</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 80,00 €</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Care – Cut</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 95,00 €</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Waschen / Föhnen (ohne Schnitt)</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 35,00 €</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Herren – Master Stylist</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 46,00 €</p>
                </div>
              </div>
            </div>

            {/* COLORATION */}
            <div className="mb-12">
              <h2 className="font-serif text-xl md:text-2xl lg:text-3xl text-[#2C2C2C] mb-4 md:mb-6 pb-2 border-b border-gray-200">
                COLORATION
              </h2>
              <div className="space-y-3 md:space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Ansatzfarbe Master Stylist</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 65,00 €</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Komplett Master Stylist</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 80,00 €</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Tönung</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 65,00 €</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Shades</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 45,00 €</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Balayage Komplett</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 180,00 €</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Strähnen</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 100,00 €</p>
                </div>
                <div className="mt-3 md:mt-4">
                  <p className="text-gray-800 text-sm md:text-base mb-2">Freihandtechniken:</p>
                  <div className="pl-3 md:pl-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                      <p className="text-gray-800 text-sm md:text-base">Natural</p>
                      <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 45,00 €</p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                      <p className="text-gray-800 text-sm md:text-base">Medium</p>
                      <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 55,00 €</p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                      <p className="text-gray-800 text-sm md:text-base">Full</p>
                      <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 65,00 €</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TREATMENTS */}
            <div className="mb-12">
              <h2 className="font-serif text-xl md:text-2xl lg:text-3xl text-[#2C2C2C] mb-4 md:mb-6 pb-2 border-b border-gray-200">
                TREATMENTS (PFLEGE)
              </h2>
              <div className="space-y-3 md:space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Treatment</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 20,00 €</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Treatment Boost Service</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">10,00 €</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Rescue System</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 35,00 €</p>
                </div>
              </div>
            </div>

            {/* SCALP THERAPY */}
            <div className="mb-12">
              <h2 className="font-serif text-xl md:text-2xl lg:text-3xl text-[#2C2C2C] mb-4 md:mb-6 pb-2 border-b border-gray-200">
                SCALP THERAPY (KOPFHAUT THERAPIE)
              </h2>
              <div className="space-y-3 md:space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Sensitiv Therapy inkl. Kopfhautpeeling</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 35,00 €</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Calm Therapy inkl. Kopfhautpeeling</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 35,00 €</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Rehydrating Therapy inkl. Kopfhautpeeling</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 35,00 €</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Vital Therapy inkl. Kopfhautpeeling</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 35,00 €</p>
                </div>
              </div>
            </div>

            {/* KERATIN SYSTEM */}
            <div className="mb-12">
              <h2 className="font-serif text-xl md:text-2xl lg:text-3xl text-[#2C2C2C] mb-4 md:mb-6 pb-2 border-b border-gray-200">
                KERATIN SYSTEM
              </h2>
              <div className="space-y-3 md:space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Keratin Behandlung</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 300,00 €</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Keratin Push</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 150,00 €</p>
                </div>
              </div>
            </div>

            {/* UMFORMUNG */}
            <div className="mb-12">
              <h2 className="font-serif text-xl md:text-2xl lg:text-3xl text-[#2C2C2C] mb-4 md:mb-6 pb-2 border-b border-gray-200">
                UMFORMUNG
              </h2>
              <div className="space-y-3 md:space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Headline</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 65,00 €</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Natural Curls</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 295,00 €</p>
                </div>
              </div>
            </div>

            {/* BERATUNG */}
            <div className="mb-12">
              <h2 className="font-serif text-xl md:text-2xl lg:text-3xl text-[#2C2C2C] mb-4 md:mb-6 pb-2 border-b border-gray-200">
                BERATUNG
              </h2>
              <div className="space-y-3 md:space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">
                    Farbstypologie (inkl. 1,5 Std. Beratung und pers. Pass)
                  </p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">200,00 €</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">
                    KI gestützte Erstberatung (kostenlos bei Inanspruchnahme einer Dienstleistung)
                  </p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">95,00 €</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">
                    KI gestützte Folgeberatung (im Service inbegriffen)
                  </p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">30,00 €</p>
                </div>
              </div>
            </div>

            {/* MAKE UP */}
            <div>
              <h2 className="font-serif text-xl md:text-2xl lg:text-3xl text-[#2C2C2C] mb-4 md:mb-6 pb-2 border-b border-gray-200">
                MAKE UP
              </h2>
              <div className="space-y-3 md:space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Touch Over (Make-Up-Finish)</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 80€</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#b4b1aa]">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">Bereit für Ihren Termin?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Vereinbaren Sie noch heute Ihren persönlichen Termin und lassen Sie sich von unserem Team verwöhnen.
          </p>
          <a
            href="/kontakt"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4C6A6]/50 focus:ring-offset-2 shadow-lg"
          >
            Jetzt Termin vereinbaren
          </a>
        </div>
      </section>

      {/* Footer - Copied from homepage */}
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
                <a href="/datenschuz" className="text-white/50 text-sm hover:text-[#D4C6A6] transition-colors">
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
