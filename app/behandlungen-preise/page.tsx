"use client"

import { motion } from "framer-motion"
import Navigation from "@/components/Navigation"
import Image from "next/image"
import SiteFooter from "@/components/SiteFooter"

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
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 45,00 €</p>
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
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 300,00 €</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Strähnen</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 150,00 €</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Grey Blending</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">ab 390,00 €</p>
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
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Bonding</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">45,00 €</p>
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
            <div className="mb-12">
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

            {/* AUGENBRAUEN & WIMPERN */}
            <div>
              <h2 className="font-serif text-xl md:text-2xl lg:text-3xl text-[#2C2C2C] mb-4 md:mb-6 pb-2 border-b border-gray-200">
                AUGENBRAUEN & WIMPERN
              </h2>
              <div className="space-y-3 md:space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Augenbrauen färben</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">20,00 €</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Augenbrauen in Form zupfen</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">20,00 €</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-800 text-sm md:text-base">Wimpern färben</p>
                  <p className="text-[#2C2C2C] font-medium mt-1 sm:mt-0">25,00 €</p>
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
      <SiteFooter />
    </div>
  )
}
