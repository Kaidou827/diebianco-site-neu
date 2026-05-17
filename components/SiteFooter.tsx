import Image from "next/image"

export default function SiteFooter() {
  return (
    <footer className="bg-[#2C2C2C] text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4C6A6]/30 to-transparent" />
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#D4C6A6]/3 -skew-x-12 transform origin-top-right opacity-30" />

      <div className="container mx-auto px-4 md:px-6 py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
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
            <div className="w-12 h-px bg-gradient-to-r from-[#D4C6A6] to-transparent mt-2" />
            <p className="text-white/70 leading-relaxed mb-6">
              Ihr exklusiver Rueckzugsort fuer authentische Schoenheit und ungestoerte Momente der Pflege und Entspannung.
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-6">
            <h3 className="font-serif text-lg mb-4 text-[#D4C6A6]">Kontakt</h3>
            <address className="not-italic text-white/70 space-y-3">
              <p>Siedlung Egelsberg 1, 47802 Krefeld</p>
              <p>
                <a href="tel:+491743091973" className="hover:text-white transition-colors">
                  +49 174 3091973
                </a>
              </p>
              <p>
                <a href="mailto:salon@diebianco.de" className="hover:text-white transition-colors">
                  salon@diebianco.de
                </a>
              </p>
            </address>
          </div>

          <div className="md:col-span-3 md:col-start-10">
            <h3 className="font-serif text-lg mb-4 text-[#D4C6A6]">Oeffnungszeiten</h3>
            <div className="text-white/70 space-y-2">
              <p>Mi - Fr: 09:00 - 17:15 Uhr</p>
              <p>Sa: 07:00 - 14:00 Uhr</p>
              <p>Mo, Di, So: Geschlossen</p>
              <p className="text-sm italic">Termine nach Vereinbarung</p>
            </div>
          </div>
        </div>

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
              <a href="/mentoring" className="text-white/50 text-sm hover:text-[#D4C6A6] transition-colors">
                Mentoring
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
