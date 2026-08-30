import Image from "next/image"
import { Mail, MapPin, Phone, Clock, CheckCircle } from "lucide-react"
import Navigation from "@/components/Navigation"
import SiteFooter from "@/components/SiteFooter"
import AnfrageFormular from "@/components/AnfrageFormular"

export default function Kontakt() {
  return (
    <div className="bg-[#b4b1aa] text-white min-h-screen">
      {/* Standardized Navigation Component */}
      <Navigation />

      {/* Contact Form Section - Now at the top */}
      <section className="py-16 md:py-20 bg-[#b4b1aa] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="font-serif text-3xl md:text-5xl tracking-tight mb-6 leading-tight">
              Kontaktieren Sie <span className="text-[rgb(212,198,166)]">uns</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
              Vereinbaren Sie Ihren persönlichen Termin und erleben Sie exklusive Schönheitspflege in privater
              Atmosphäre.
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-10 text-center">
            <p className="inline-flex items-center justify-center rounded-full bg-white/70 px-5 py-2 text-sm md:text-base text-[#2C2C2C]">
              <span className="text-[#D4C6A6] mr-2">⭐⭐⭐⭐⭐</span>
              5,0 von 5 Sternen bei Google
            </p>
          </div>

          <div className="max-w-5xl mx-auto mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
              <div className="w-full max-w-[480px] rounded-md border border-white/10 bg-black/15 p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="relative h-52 rounded-md overflow-hidden">
                      <Image src="/kunde-1-vorher.jpg" alt="Kunde 1 Vorher" fill className="object-cover" />
                    </div>
                    <p className="mt-2 text-center text-sm text-[#D4C6A6]">Vorher</p>
                  </div>
                  <div>
                    <div className="relative h-52 rounded-md overflow-hidden">
                      <Image src="/kunde-1-nachher.jpg" alt="Kunde 1 Nachher" fill className="object-cover" />
                    </div>
                    <p className="mt-2 text-center text-sm text-[#D4C6A6]">Nachher</p>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-[480px] rounded-md border border-white/10 bg-black/15 p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="relative h-52 rounded-md overflow-hidden">
                      <Image src="/kunde-2-vorher.jpg" alt="Kunde 2 Vorher" fill className="object-cover" />
                    </div>
                    <p className="mt-2 text-center text-sm text-[#D4C6A6]">Vorher</p>
                  </div>
                  <div>
                    <div className="relative h-52 rounded-md overflow-hidden">
                      <Image src="/kunde-2-nachher.jpg" alt="Kunde 2 Nachher" fill className="object-cover" />
                    </div>
                    <p className="mt-2 text-center text-sm text-[#D4C6A6]">Nachher</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
              <div className="w-full max-w-sm rounded-md border border-white/10 bg-black/20 p-5 text-center">
                <p className="text-[#D4C6A6] text-sm mb-2">Katja E. · ★★★★★</p>
                <p className="text-white/90 text-sm leading-relaxed">
                  &quot;Absolute Spitzenklasse - ein Salon, den ich von Herzen weiterempfehle. Ich habe ohne Zweifel den
                  schönsten Haarschnitt meines Lebens erhalten.&quot;
                </p>
              </div>
              <div className="w-full max-w-sm rounded-md border border-white/10 bg-black/20 p-5 text-center">
                <p className="text-[#D4C6A6] text-sm mb-2">N. Hales · ★★★★★</p>
                <p className="text-white/90 text-sm leading-relaxed">
                  &quot;Wer einmal dort war, wird nie wieder zu einem anderen Salon gehen. Absolute Profis das ganze Team.&quot;
                </p>
              </div>
              <div className="w-full max-w-sm rounded-md border border-white/10 bg-black/20 p-5 text-center">
                <p className="text-[#D4C6A6] text-sm mb-2">Sophia K. · ★★★★★</p>
                <p className="text-white/90 text-sm leading-relaxed">
                  &quot;Meinen Friseur des Vertrauens hab ich gefunden! Man fühlt sich super wohl und verbringt dort gerne
                  seine Zeit.&quot;
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Contact Form - Now with black/20 blur effect */}
            <div
              id="kontakt-formular"
              className="lg:col-span-3 backdrop-blur-md bg-black/20 rounded-md p-8 md:p-10 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.1)] border border-white/10"
            >
              <div className="mb-6 rounded-md border border-white/10 bg-black/25 p-4">
                <p className="text-sm text-white/80 mb-3">Du erreichst uns Mi-Fr von 09:00 bis 17:15 Uhr und Sa von 07:00 bis 14:00 Uhr.</p>
                <a
                  href="tel:+491743091973"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] transition-all duration-300"
                >
                  Lieber anrufen? +49 174 3091973
                </a>
              </div>
              <h3 className="font-serif text-2xl mb-2 text-white">Termin anfragen - wir melden uns innerhalb von 24 Stunden.</h3>
              <p className="text-white/80 mb-8">Einfach Formular ausfüllen, Teresa meldet sich persönlich bei dir.</p>
              <AnfrageFormular variante="standard" theme="dunkel" chrome={false} dankeUrl="/kontakt/danke" />

              <div className="mt-6 rounded-md border border-white/10 bg-black/25 p-4">
                <p className="italic text-white/90">&quot;Ich melde mich persönlich bei dir - versprochen.&quot;</p>
                <p className="mt-1 text-sm text-[#D4C6A6]">- Teresa Bianco</p>
                <ul className="mt-4 space-y-2 text-sm text-white/85">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#D4C6A6]" />
                    Persönliche Beratung
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#D4C6A6]" />
                    Antwort innerhalb von 24h
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#D4C6A6]" />
                    Keine Verpflichtung
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Info - Now spans 2 columns */}
            <div className="lg:col-span-2">
              <h2 className="font-serif text-2xl md:text-3xl tracking-tight mb-6 text-white">Kontaktinformationen</h2>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 rounded-md">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg mb-1 text-white">Adresse</h3>
                    <p className="text-white/80">
                      Siedlung Egelsberg 1<br />
                      47802 Krefeld
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 rounded-md">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg mb-1 text-white">Telefon</h3>
                    <p className="text-white/80">
                      <a href="tel:+491743091973" className="hover:text-white transition-colors">
                        +49 174 3091973
                      </a>
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 rounded-md">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg mb-1 text-white">E-Mail</h3>
                    <p className="text-white/80">
                      <a href="mailto:salon@diebianco.de" className="hover:text-white transition-colors">
                        salon@diebianco.de
                      </a>
                    </p>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 rounded-md">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg mb-1 text-white">Öffnungszeiten</h3>
                    <div className="text-white/80 space-y-1">
                      <p>Mi - Fr: 09:00 - 17:15 Uhr</p>
                      <p>Sa: 07:00 - 14:00 Uhr</p>
                      <p>Mo, Di, So: Geschlossen</p>
                      <p className="text-sm italic mt-2">Termine nach Vereinbarung</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-[#b4b1aa] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

        <div className="container px-4 md:px-6">
          <h2 className="font-serif text-2xl md:text-3xl tracking-tight mb-8 text-center text-white">Unser Standort</h2>
          <div className="w-full h-[400px] bg-black/20 backdrop-blur-sm rounded-md overflow-hidden shadow-md border border-white/10">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2492.2544250563367!2d6.564700!3d51.364700!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b8a5c3d3a59bfb%3A0x27760c42a68b0214!2sSiedlung%20Egelsberg%201%2C%2047802%20Krefeld!5e0!3m2!1sde!2sde!4v1653389089123!5m2!1sde!2sde"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="DIE BIANCO Salon Standort"
              aria-label="Karte zum Standort des DIE BIANCO Salons"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Footer - Same as other pages */}
      <SiteFooter />
    </div>
  )
}
