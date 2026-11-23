import Image from "next/image"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import Navigation from "@/components/Navigation"
import SiteFooter from "@/components/SiteFooter"
import AnfrageFormular from "@/components/AnfrageFormular"
import TeresaVideo from "@/components/TeresaVideo"
import AnrufCta from "@/components/kontakt/AnrufCta"
import KontaktStickyBar from "@/components/kontakt/KontaktStickyBar"
import AnrufPopup from "@/components/kontakt/AnrufPopup"
import {
  salonTelefon,
  salonTelefonHref,
  salonEmail,
  salonAdresse,
  oeffnungszeitenKompakt,
} from "@/lib/site-info"

function Sterne() {
  return (
    <span className="inline-flex text-[#E4A93C]" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-4 w-4 fill-current">
          <path d="M10 1.6l2.47 5.006 5.526.803-4 3.9.944 5.503L10 14.2l-4.94 2.612.944-5.503-4-3.9 5.526-.803L10 1.6z" />
        </svg>
      ))}
    </span>
  )
}

const testimonials = [
  {
    name: "Katja E.",
    text: "Absolute Spitzenklasse – ein Salon, den ich von Herzen weiterempfehle. Ich habe ohne Zweifel den schönsten Haarschnitt meines Lebens erhalten.",
  },
  {
    name: "N. Hales",
    text: "Wer einmal dort war, wird nie wieder zu einem anderen Salon gehen. Absolute Profis, das ganze Team.",
  },
  {
    name: "Sophia K.",
    text: "Meinen Friseur des Vertrauens hab ich gefunden! Man fühlt sich super wohl und verbringt dort gerne seine Zeit.",
  },
]

const vorherNachher = [
  { vorher: "/ergebnisse/look01-vorher.webp", nachher: "/ergebnisse/look01-nachher.webp" },
  { vorher: "/ergebnisse/blond-2-vorher.jpg", nachher: "/ergebnisse/blond-2-nachher.jpg" },
]

const galerie = [
  { src: "/ergebnisse/look07-balayage-nachher.webp", alt: "Warmes Balayage auf brünettem Haar" },
  { src: "/ergebnisse/look02-blond-nachher.webp", alt: "Weicher Blondverlauf mit Wellen" },
  { src: "/ergebnisse/blond-1-nachher.jpg", alt: "Helles, kühles Blond" },
  { src: "/ergebnisse/balayage-2-nachher.jpg", alt: "Goldenes Balayage im Bob" },
]

const ablauf = [
  {
    titel: "Farbberatung",
    text: "Wir schauen uns Hautton, Ausgangsfarbe und deinen Wunsch-Look an und legen gemeinsam fest, wie hell und wie weich der Verlauf werden soll.",
  },
  {
    titel: "Freihand-Technik",
    text: "Balayage wird von Hand gemalt. So entsteht ein natürlicher Verlauf ohne harte Ansätze, der weich herauswächst.",
  },
  {
    titel: "Glossing & Pflege",
    text: "Zum Schluss stimmen wir Ton und Glanz ab. Du bekommst eine Pflegeroutine für zu Hause, damit dein Blond lange frisch bleibt.",
  },
]

const faq = [
  {
    frage: "Wie oft muss ich nachfärben?",
    antwort:
      "Balayage wächst weich heraus, ohne sichtbaren Ansatz. Deshalb reichen meist größere Abstände als bei klassischen Strähnen.",
  },
  {
    frage: "Was kostet Balayage?",
    antwort:
      "Der Preis hängt von Haarlänge, Ausgangsfarbe und Ziel ab. Du bekommst vorab eine persönliche Einschätzung.",
  },
  {
    frage: "Geht Balayage auch bei dunklem Haar?",
    antwort:
      "Ja. Bei dunklem Haar arbeiten wir oft mit warmen Karamell- und Honigtönen und hellen schonend auf, damit dein Haar gesund bleibt.",
  },
  {
    frage: "Was ist der Unterschied zu Strähnen oder Babylights?",
    antwort:
      "Strähnen werden in Folie gearbeitet und starten am Ansatz. Balayage wird frei gemalt und läuft weich aus. Babylights sind sehr feine Strähnen für einen besonders natürlichen Effekt. In der Beratung finden wir heraus, was zu dir passt.",
  },
]

export default function BalayageKrefeld() {
  return (
    <div className="bg-[#b4b1aa] text-white min-h-screen pb-24 md:pb-0">
      <Navigation />

      <main className="container mx-auto px-4 md:px-6">
        {/* HERO */}
        <section className="pt-10 md:pt-16 pb-6 text-center max-w-2xl mx-auto">
          <h1 className="font-serif text-3xl md:text-5xl tracking-tight leading-tight">
            Balayage <span className="text-[#D4C6A6]">in Krefeld</span>
          </h1>
          <p className="mt-3 text-lg text-white/85">
            Weiche, handgemalte Blondverläufe – abgestimmt auf deinen Hautton. Unverbindlich anfragen, Teresa berät dich persönlich.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-[#2C2C2C] shadow-sm">
            <Sterne />
            5,0 · 51 Google-Bewertungen
          </p>
        </section>

        {/* FORMULAR (Deep, Balayage vorausgewählt) */}
        <section id="kontakt-formular" className="scroll-mt-24 pb-14">
          <div className="mx-auto max-w-2xl rounded-2xl bg-[#F5F1E8] p-6 md:p-8 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)] ring-1 ring-black/5">
            <h2 className="font-serif text-2xl text-[#2C2C2C]">Balayage-Termin anfragen</h2>
            <p className="mt-1 mb-5 text-[#5b5346]">Ein paar kurze Fragen – so kann Teresa deinen Look direkt einschätzen.</p>
            <AnfrageFormular
              variante="deep"
              theme="hell"
              chrome={false}
              vorauswahlBehandlung="Balayage"
              dankeUrl="/kontakt/danke"
            />
            <div className="mt-5 border-t border-black/10 pt-4">
              <AnrufCta />
            </div>
          </div>
        </section>

        {/* VORHER / NACHHER */}
        <section className="pb-14 max-w-5xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl mb-6 text-center">Balayage- & Blond-Ergebnisse</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vorherNachher.map((paar, idx) => (
              <div key={idx} className="rounded-xl bg-white p-3 shadow-md">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="relative h-56 rounded-lg overflow-hidden">
                      <Image src={paar.vorher} alt="Vorher" fill className="object-cover" />
                    </div>
                    <p className="mt-2 text-center text-sm font-medium text-[#8a6420]">Vorher</p>
                  </div>
                  <div>
                    <div className="relative h-56 rounded-lg overflow-hidden">
                      <Image src={paar.nachher} alt="Nachher" fill className="object-cover" />
                    </div>
                    <p className="mt-2 text-center text-sm font-medium text-[#8a6420]">Nachher</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* GALERIE */}
        <section className="pb-14 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {galerie.map((bild) => (
              <div key={bild.src} className="relative h-56 md:h-72 rounded-xl overflow-hidden shadow-md">
                <Image src={bild.src} alt={bild.alt} fill className="object-cover" sizes="(min-width: 768px) 25vw, 50vw" />
              </div>
            ))}
          </div>
        </section>

        {/* VIDEO */}
        <section className="pb-14 max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl mb-2">Lern mich kennen</h2>
          <p className="text-white/80 mb-6">Ein kurzer Einblick, wie Teresa arbeitet und was dich erwartet.</p>
          <TeresaVideo />
        </section>

        {/* ABLAUF */}
        <section className="pb-14 max-w-5xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl mb-6 text-center">So läuft dein Balayage-Termin</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ablauf.map((schritt, idx) => (
              <div key={schritt.titel} className="rounded-xl border border-white/10 bg-black/20 p-5">
                <p className="text-[#D4C6A6] font-serif text-2xl">{idx + 1}</p>
                <h3 className="font-semibold mt-1 mb-1">{schritt.titel}</h3>
                <p className="text-white/85 text-sm leading-relaxed">{schritt.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="pb-14 max-w-5xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl mb-6 text-center">Das sagen Kundinnen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-xl bg-white p-5 text-center shadow-md">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sterne />
                </div>
                <p className="text-[#2C2C2C] text-sm leading-relaxed">&quot;{t.text}&quot;</p>
                <p className="mt-3 text-sm font-semibold text-[#2C2C2C]">{t.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-14 max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl mb-6 text-center">Häufige Fragen</h2>
          <div className="space-y-4">
            {faq.map((f) => (
              <div key={f.frage} className="rounded-xl border border-white/10 bg-black/20 p-5">
                <h3 className="text-[#D4C6A6] font-semibold mb-1">{f.frage}</h3>
                <p className="text-white/85 text-sm leading-relaxed">{f.antwort}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a
              href="#kontakt-formular"
              className="inline-flex justify-center items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              Balayage-Termin anfragen
            </a>
          </div>
        </section>

        {/* KONTAKTINFO */}
        <section className="pb-10 max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl mb-6 text-center">Kontakt & Öffnungszeiten</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-black/20">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-serif text-lg">Adresse</h3>
                <p className="text-white/85">
                  {salonAdresse.strasse}
                  <br />
                  {salonAdresse.ort}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-black/20">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-serif text-lg">Telefon</h3>
                <a href={salonTelefonHref} className="text-white/85 hover:text-white transition-colors">
                  {salonTelefon}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-black/20">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-serif text-lg">E-Mail</h3>
                <a href={`mailto:${salonEmail}`} className="text-white/85 hover:text-white transition-colors">
                  {salonEmail}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-black/20">
                <Clock className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-serif text-lg">Öffnungszeiten</h3>
                <div className="text-white/85 space-y-0.5">
                  {oeffnungszeitenKompakt.map((z) => (
                    <p key={z}>{z}</p>
                  ))}
                  <p className="text-sm italic mt-1 text-white/70">Termine nach Vereinbarung</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KARTE */}
        <section className="pb-16 max-w-5xl mx-auto">
          <div className="h-[300px] md:h-[420px] w-full overflow-hidden rounded-xl border border-white/10 shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2492.2544250563367!2d6.564700!3d51.364700!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b8a5c3d3a59bfb%3A0x27760c42a68b0214!2sSiedlung%20Egelsberg%201%2C%2047802%20Krefeld!5e0!3m2!1sde!2sde!4v1653389089123!5m2!1sde!2sde"
              width="100%"
              height="100%"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="DIE BIANCO Salon Standort"
              aria-label="Karte zum Standort des DIE BIANCO Salons"
            ></iframe>
          </div>
        </section>
      </main>

      <SiteFooter />
      <KontaktStickyBar />
      <AnrufPopup />
    </div>
  )
}
