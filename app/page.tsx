"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import Navigation from "@/components/Navigation"
import { Phone } from "lucide-react"
function ScrollAnimatedSection() {
  const [visibleCards, setVisibleCards] = useState([])
  const cardRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = Number.parseInt(entry.target.getAttribute("data-index"))
            setVisibleCards((prev) => {
              if (!prev.includes(cardIndex)) {
                return [...prev, cardIndex].sort()
              }
              return prev
            })
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px",
      },
    )

    const currentCardRefs = cardRefs.current
    currentCardRefs.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      currentCardRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [])

  // Daten für die drei USPs
  const uspData = [
    {
      icon: (
        <svg
          className="w-12 h-12"
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
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      ),
      title: "Typ- & Farbberatung auf Haute-Couture-Niveau",
      description:
        'Ihre Persönlichkeit in Farbe, Form und Stil übersetzt – für einen Look, der nicht „gemacht", sondern authentisch wirkt.',
    },
    {
      icon: (
        <svg
          className="w-12 h-12"
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
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
      ),
      title: "Spezialisiert auf die Königsdisziplin: Blond",
      description:
        "Kein Gelb. Kein Kompromiss. Sondern genau der Ton, den Sie sich immer gewünscht haben – typgerecht, weich, elegant.",
    },
    {
      icon: (
        <svg
          className="w-12 h-12"
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
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      ),
      title: "Behandlungen, die wie ein Kurzurlaub wirken",
      description:
        "Ob Keratin-Glättung, Hautdiagnostik Pflege – jede Anwendung ist ein Statement für Ihre Selbstachtung.",
    }, // Added missing closing brace
  ]

  return (
    <section className="py-24 md:py-32 bg-[#b4b1aa] relative overflow-hidden">
      {/* Dekorative Elemente */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4C6A6]/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4C6A6]/30 to-transparent"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6 text-white">
            Das <span className="text-[#D4C6A6]">DIE BIANCO</span> Versprechen
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-white/80">
            Scrollen Sie, um unsere Werte zu entdecken – Details, die den Unterschied machen.
          </p>
        </div>

        {/* USP-Karten mit Scroll-Animation */}
        <div className="max-w-3xl mx-auto space-y-12">
          {uspData.map((usp, index) => (
            <div
              key={index}
              ref={(el) => (cardRefs.current[index] = el)}
              data-index={index}
              className={`transform transition-all duration-1000 ${visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                }`}
            >
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20 transition-all duration-300 hover:bg-white/15">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="flex-shrink-0 w-20 h-20 rounded-full bg-[#D4C6A6]/20 flex items-center justify-center text-white">
                    {usp.icon}
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl md:text-3xl mb-4 text-white">{usp.title}</h3>
                    <p className="text-white/80 leading-relaxed text-lg">{usp.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll-Hinweis (nur wenn noch nicht alle Karten sichtbar sind) */}
        {visibleCards.length < uspData.length && (
          <div className="text-center mt-16 text-white/70 text-sm animate-pulse">
            <p>Scrollen Sie für mehr</p>
            <svg
              className="w-6 h-6 mx-auto mt-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        )}
      </div>
    </section>
  )
}

export default function Home() {
  const scrollToLeistungen = () => {
    const leistungenSection = document.getElementById("leistungen-section")
    if (leistungenSection) {
      leistungenSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="bg-[#b4b1aa] text-white">
      {/* Standardized Navigation Component */}
      <Navigation />

      {/* Hero Section - Completely redesigned */}
      <section className="pt-24 pb-16 md:pt-28 md:pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left Content */}
            <div className="max-w-xl">
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-6">
                Mehr als nur ein <span className="text-[#D4C6A6] italic">Haarschnitt:</span> Dein Verwöhn-Erlebnis.
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
                Du suchst mehr als nur einen Friseur? Bei DIE BIANCO erwartet dich ein persönliches Schönheitsritual,
                das deine Persönlichkeit versteht und sichtbar macht.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/kontakt"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4C6A6]/50 focus:ring-offset-2 shadow-lg"
                >
                  <div className="shine-effect bg-gradient-to-br from-transparent via-[#D4C6A6]/20 to-transparent"></div>
                  <div className="shine-effect-move"></div>
                  <span className="relative z-10">Jetzt Termin vereinbaren</span>
                </Link>
                <button
                  onClick={scrollToLeistungen}
                  className="inline-flex justify-center items-center px-6 py-3 bg-transparent text-white font-medium border border-white/20 rounded-full hover:bg-white/10 hover:scale-[1.02] transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 group relative overflow-hidden"
                >
                  <div className="shine-effect bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                  <div className="shine-effect-move"></div>
                  <span className="relative z-10">Leistungen entdecken</span>
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                {/* Clean Wistia Video Player */}
                <script src="https://fast.wistia.com/player.js" async></script>
                <script src="https://fast.wistia.com/embed/bfj901af1d.js" async type="module"></script>
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
        wistia-player[media-id='bfj901af1d']:not(:defined) { 
          background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/bfj901af1d/swatch'); 
          display: block; 
          filter: blur(5px); 
          padding-top: 56.25%; 
        }
      `,
                  }}
                />
                <wistia-player
                  media-id="bfj901af1d"
                  aspect="1.7777777777777777"
                  className="w-full rounded-lg"
                ></wistia-player>
              </div>

              {/* Subtle decorative element */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-[#111111]/10 rounded-lg -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Partner Section */}
      <section className="py-16 md:py-20 bg-[#a09a93] relative overflow-hidden">
        {/* Elegant decorative elements */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

        {/* Subtle light effect */}
        <div className="absolute top-0 left-1/4 w-1/2 h-full bg-white/5 blur-3xl"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-serif text-xl md:text-2xl text-white mb-2">Unsere Partner</h2>
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#D4C6A6] to-transparent mx-auto"></div>
          </div>

          <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-sm rounded-2xl p-10 md:p-12">
            <div className="flex flex-wrap justify-center gap-12 md:gap-20 items-center">
              <div className="h-12 relative grayscale hover:grayscale-0 transition-all duration-500 flex items-center justify-center transform hover:scale-105">
                <Image
                  src="/la-biosthetique-logo.webp"
                  alt="La Biosthétique Paris"
                  width={120}
                  height={48}
                  className="h-12 w-auto object-contain brightness-[1.15]"
                />
              </div>
              <div className="h-12 relative grayscale hover:grayscale-0 transition-all duration-500 flex items-center justify-center transform hover:scale-105">
                <Image
                  src="/redken-logo.png"
                  alt="REDKEN 5TH AVENUE NYC"
                  width={140}
                  height={48}
                  className="h-12 w-auto object-contain brightness-[1.15]"
                />
              </div>
              {/* Corrected the closing tag for section and removed the stray Image tag */}

            </div>
          </div>
        </div>
      </section>

      {/* Redesigned Service Section with Visual Improvements */}
      <section id="leistungen-section" className="py-24 md:py-32 bg-[#b4b1aa] relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4C6A6]/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4C6A6]/30 to-transparent"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6 text-white">
              Exklusive <span className="text-white">Service-Highlights</span>
            </h2>
          </div>

          {/* Service Cards - Redesigned with Icons and Less Text */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: FARBTYPOLOGIE */}
            <Link
              href="/dienstleistungen/farbtypologie"
              className="group block"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="relative h-full bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 transition-all duration-300 hover:bg-white/15">
                <div className="aspect-[4/3] relative">
                  <Image src="/Farbtypologie1.jpg" alt="Farbtypologie" fill className="object-cover" />
                  <div className="absolute inset-0 "></div>
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="13.5" cy="6.5" r="2.5"></circle>
                      <circle cx="19" cy="13" r="2.5"></circle>
                      <circle cx="6" cy="12" r="2.5"></circle>
                      <circle cx="10" cy="20" r="2.5"></circle>
                    </svg>
                  </div>
                  <h3 className="font-serif text-xl mb-2 text-white uppercase tracking-wider">Farbtypologie</h3>
                  <p className="text-white/90 font-medium mb-6">Typgerechte Farbberatung – einzigartig wie Sie.</p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center text-[#D4C6A6] font-medium group-hover:text-white transition-colors">
                      Erfahre mehr
                      <svg
                        className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Card 2: SCHNITTTECHNIKEN */}
            <Link
              href="/dienstleistungen/schnitttechniken"
              className="group block"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="relative h-full bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 transition-all duration-300 hover:bg-white/15">
                <div className="aspect-[4/3] relative">
                  <Image src="/Schnitttechniken.jpg" alt="Schnitttechniken" fill className="object-cover" />
                  <div className="absolute inset-0"></div>
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                      <line x1="16" y1="8" x2="2" y2="22"></line>
                      <line x1="17.5" y1="15" x2="9" y2="15"></line>
                    </svg>
                  </div>
                  <h3 className="font-serif text-xl mb-2 text-white uppercase tracking-wider">Schnitttechniken</h3>
                  <p className="text-white/90 font-medium mb-6">
                    Präzision trifft Persönlichkeit – Ihr Schnitt im Rhythmus der Jahreszeiten.
                  </p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center text-[#D4C6A6] font-medium group-hover:text-white transition-colors">
                      Erfahre mehr
                      <svg
                        className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Card 3: BLOND-SPEZIALISTEN */}
            <Link
              href="/dienstleistungen/blond-spezialisten"
              className="group block"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="relative h-full bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 transition-all duration-300 hover:bg-white/15">
                <div className="aspect-[4/3] relative">
                  <Image src="/Blondierung.jpg" alt="Blond-Spezialisten" fill className="object-cover" />
                  <div className="absolute inset-0 "></div>
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path>
                    </svg>
                  </div>
                  <h3 className="font-serif text-xl mb-2 text-white uppercase tracking-wider">Blond-Spezialisten</h3>
                  <p className="text-white/90 font-medium mb-6">Blond mit Charakter – wow, ohne Kompromisse.</p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center text-[#D4C6A6] font-medium group-hover:text-white transition-colors">
                      Erfahre mehr
                      <svg
                        className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Card 4: KERATINBEHANDLUNG */}
            <Link
              href="/dienstleistungen/keratinbehandlung"
              className="group block"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="relative h-full bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 transition-all duration-300 hover:bg-white/15">
                <div className="aspect-[4/3] relative">
                  <Image src="/Keratinbehandlung.jpg" alt="Keratinbehandlung" fill className="object-cover" />
                  <div className="absolute inset-0 "></div>
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M8 3v3a2 2 0 0 1-2 2H3"></path>
                      <path d="M21 8h-3a2 2 0 0 1-2-2V3"></path>
                      <path d="M3 16h3a2 2 0 0 1 2 2v3"></path>
                      <path d="M16 21v-3a2 2 0 0 1 2-2h3"></path>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                  </div>
                  <h3 className="font-serif text-xl mb-2 text-white uppercase tracking-wider">Keratinbehandlung</h3>
                  <p className="text-white/90 font-medium mb-6">Seidigkeit, die bleibt – Ihr Haar in Bestform.</p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center text-[#D4C6A6] font-medium group-hover:text-white transition-colors">
                      Erfahre mehr
                      <svg
                        className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Card 5: STILBERATUNG */}
            <Link
              href="/dienstleistungen/stilberatung"
              className="group block"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="relative h-full bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 transition-all duration-300 hover:bg-white/15">
                <div className="aspect-[4/3] relative">
                  <Image src="/Stilberatung.jpg" alt="Stilberatung" fill className="object-cover" />
                  <div className="absolute inset-0"></div>
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0-1.34-2.23z"></path>
                    </svg>
                  </div>
                  <h3 className="font-serif text-xl mb-2 text-white uppercase tracking-wider">Stilberatung</h3>
                  <p className="text-white/90 font-medium mb-6">
                    Ihr authentischer Ausdruck – perfekt in Szene gesetzt.
                  </p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center text-[#D4C6A6] font-medium group-hover:text-white transition-colors">
                      Erfahre mehr
                      <svg
                        className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Card 6: HAUTDIAGNOSTIK */}
            <Link
              href="/dienstleistungen/hautdiagnostik"
              className="group block"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="relative h-full bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 transition-all duration-300 hover:bg-white/15">
                <div className="aspect-[4/3] relative">
                  <Image src="/Hautdiagnostik.jpg" alt="Hautdiagnostik" fill className="object-cover" />
                  <div className="absolute inset-0"></div>
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </div>
                  <h3 className="font-serif text-xl mb-2 text-white uppercase tracking-wider">Hautdiagnostik</h3>
                  <p className="text-white/90 font-medium mb-6">Pflege beginnt mit Wissen – Ihre Haut im Fokus.</p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center text-[#D4C6A6] font-medium group-hover:text-white transition-colors">
                      Erfahre mehr
                      <svg
                        className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-16">
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4C6A6]/50 focus:ring-offset-2 shadow-lg"
            >
              <div className="shine-effect bg-gradient-to-br from-transparent via-[#D4C6A6]/20 to-transparent"></div>
              <div className="shine-effect-move"></div>
              <span className="relative z-10">Jetzt Termin vereinbaren</span>
            </Link>
          </div>
        </div>
      </section>

      {/* NEWSHA ONLINE SHOP Section */}

      <section className="hidden">
        <section className="py-24 md:py-32 bg-[#b4b1aa] relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4C6A6]/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4C6A6]/30 to-transparent"></div>

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 md:p-12 border border-white/10 overflow-hidden relative">
                {/* Background decorative elements */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#D4C6A6]/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
                  {/* NEWSHA Logo */}
                  <div className="md:w-1/3 flex justify-center">
                    <div className="w-40 h-40 bg-white/10 rounded-full flex items-center justify-center p-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 176.3 22.1"
                        className="w-full h-auto"
                        fill="white"
                      >
                        <polygon points="23.9 21.7 19.6 21.7 3.5 4.4 3.5 21.7 0 21.7 0 .6 4.4 .6 20.4 17.9 20.4 .6 23.9 .6 23.9 21.7" />
                        <polygon points="53.1 21.7 31 21.7 31 .6 52.3 .6 52.3 3.8 34.5 3.8 34.5 9.2 46.9 9.2 46.9 12.3 34.5 12.3 34.5 18.6 53.1 18.6 53.1 21.7" />
                        <polygon points="89.5 .6 82.6 21.7 78.1 21.7 72.9 4.1 67.6 21.7 63.1 21.7 56.1 .6 60.1 .6 65.4 18.2 70.7 .6 75.1 .6 80.3 18.3 85.6 .6 89.5 .6" />
                        <path d="M112.4,5.6c-3.1-1.6-6.3-2.4-9.6-2.4s-3.8.2-5,.7c-1.1.5-1.7,1.2-1.7,2.1s.6,1.6,1.8,2.1c.9.3,2.3.6,4.3.6,2.9.2,4.8.4,5.8.4,2.6.4,4.6,1,5.8,2,1.3.9,1.9,2.3,1.9,4s-1,4-2.9,5.1c-2,1.2-4.8,1.8-8.5,1.8-5.3,0-9.6-1.2-12.5-3.6l1.9-2.6c3.3,2,6.8,3.1,10.7,3.1s4.4-.4,5.8-1c1.3-.6,2-1.6,2-2.7s-.9-2.2-2.6-2.6c-.9-.2-3.3-.5-7.2-.7-3.5-.2-5.9-.7-7.3-1.3-1.6-.9-2.5-2.1-2.5-4.1s.9-3.6,2.8-4.7c1.9-1.1,4.5-1.7,7.8-1.7s8.3,1,11.4,3.1l-2.2,2.4Z" />
                        <polygon points="145.2 21.7 141.7 21.7 141.7 12.3 124.9 12.3 124.9 21.7 121.4 21.7 121.4 .6 124.9 .6 124.9 9.2 141.7 9.2 141.7 .6 145.2 .6 145.2 21.7" />
                        <path d="M162.9,3.6l5.3,10.2h-10.8l5.5-10.2ZM160.7.6l-11.2,21.1h3.9l2.4-4.7h14.2l2.4,4.7h3.9L165.2.6h-4.5Z" />
                      </svg>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:w-2/3 text-center md:text-left">
                    <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-4 text-white">
                      NEWSHA <span className="text-[#D4C6A6]">ONLINE SHOP</span>
                    </h2>
                    <p className="text-lg text-white/80 mb-8">Sichere dir deine NEWSHA Produktfavoriten für Zuhause.</p>
                    <a
                      href="https://www.newsha.de/shoppartner/27442"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4C6A6]/50 focus:ring-offset-2 shadow-lg"
                    >
                      <div className="shine-effect bg-gradient-to-br from-transparent via-[#D4C6A6]/20 to-transparent"></div>
                      <div className="shine-effect-move"></div>
                      <span className="relative z-10">Jetzt Termin vereinbaren</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>


      {/* Neu gestaltete "Das DIE BIANCO Versprechen" Sektion mit Scroll-Animation */}
      <ScrollAnimatedSection />

      {/* Einladung zum Erleben - Überarbeiteter Call-to-action */}
      <section className="py-24 md:py-32 bg-[#b4b1aa] relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4C6A6]/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4C6A6]/30 to-transparent"></div>

        {/* Decorative circles */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#D4C6A6]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Content wrapper with decorative border */}
            <div className="relative p-1 rounded-2xl bg-gradient-to-br from-white/20 via-[#D4C6A6]/20 to-white/10">
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 md:p-12 border border-white/10">
                <div className="text-center">
                  <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6 text-white">
                    Für alle, die verstanden haben: Ihr Äußeres ist Ihre{" "}
                    <span className="text-[#D4C6A6]">Frequenz</span>
                  </h2>
                  <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                    Wenn Sie sich wieder mit Ihrer wahren Ausstrahlung verbinden möchten, wenn Sie genug haben von
                    Beliebigkeit und Einheitslooks, wenn Sie ein Umfeld suchen, das Ihre Schönheit mit Feingefühl
                    behandelt – dann ist jetzt der richtige Moment.
                  </p>

                  {/* Contact options with enhanced styling */}
                  <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mb-12">
                    <a
                      href="tel:+491743091973"
                      className="flex items-center group hover:scale-[1.02] transition-all duration-300"
                    >
                      <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-[#D4C6A6]/30 transition-colors duration-300">
                        <svg
                          className="w-6 h-6 text-[#D4C6A6]"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </div>
                      <div className="text-left">
                        <span className="block text-sm text-white/70">Telefonisch erreichen</span>
                        <span className="text-xl font-medium text-white group-hover:text-[#D4C6A6] transition-colors">
                          +49 174 3091973
                        </span>
                      </div>
                    </a>

                    <div className="hidden md:block w-px h-12 bg-white/20"></div>

                    <a
                      href="mailto:salon@diebianco.de"
                      className="flex items-center group hover:scale-[1.02] transition-all duration-300"
                    >
                      <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-[#D4C6A6]/30 transition-colors duration-300">
                        <svg
                          className="w-6 h-6 text-[#D4C6A6]"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </div>
                      <div className="text-left">
                        <span className="block text-sm text-white/70">Per E-Mail</span>
                        <span className="text-xl font-medium text-white group-hover:text-[#D4C6A6] transition-colors">
                          salon@diebianco.de
                        </span>
                      </div>
                    </a>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href="/kontakt"
                    className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4C6A6]/50 focus:ring-offset-2 shadow-lg"
                  >
                    <div className="shine-effect bg-gradient-to-br from-transparent via-[#D4C6A6]/20 to-transparent"></div>
                    <div className="shine-effect-move"></div>
                    <span className="relative z-10">Jetzt Termin vereinbaren</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Die Visionärin: Teresa Bianco - Neu gestaltet mit visuellen Elementen */}
      <section className="py-24 md:py-32 bg-[#b4b1aa] relative overflow-hidden">
        {/* Dekorative Elemente */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4C6A6]/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4C6A6]/30 to-transparent"></div>
        <div className="absolute top-0 left-0 w-1/3 h-full bg-[#D4C6A6]/5 skew-x-12 transform origin-top-left"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6 text-white drop-shadow-sm">
              Die <span className="text-[#D4C6A6]">Visionärin</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content - now on the left with equal width */}
            <div className="space-y-8 bg-black/10 backdrop-blur-sm p-8 rounded-xl border border-white/10 shadow-lg">
              <h3 className="font-serif text-2xl text-center lg:text-left text-white">Teresa Bianco</h3>

              {/* Quote - simplified */}
              <div className="relative pl-6 border-l-2 border-[#D4C6A6]">
                <p className="italic font-serif text-xl text-white/90 drop-shadow-sm">
                  Mein Handwerk ist mehr als ein Beruf – es ist meine Sprache. Ich höre hin und sehe, was oft im
                  Verborgenen liegt: die Persönlichkeit eines Menschen.
                </p>
              </div>

              {/* Key points with icons */}
              <div className="grid grid-cols-1 gap-8 mt-8">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg border border-white/10">
                  <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg
                      className="w-6 h-6 text-[#D4C6A6]"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 2l3 7H3l3-7Z" />
                      <path d="M18 2l3 7h-6l3-7Z" />
                      <path d="M3 9v12a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V9" />
                      <path d="M15 9v12a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V9" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-white font-medium">Meisterhafte Schnitttechnik</h4>
                    <p className="text-sm text-white/80">Präzise Haarschnitte seit 1998</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg border border-white/10">
                  <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg
                      className="w-6 h-6 text-[#D4C6A6]"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-white font-medium">Internationale Erfahrung</h4>
                    <p className="text-sm text-white/80">Von der Junge-Michaelis Akademie aus Mailand</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg border border-white/10">
                  <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg
                      className="w-6 h-6 text-[#D4C6A6]"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-white font-medium">27 Jahre Expertise</h4>
                    <p className="text-sm text-white/80">Italienische Leidenschaft, deutsche Präzision</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/ueber-uns"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4C6A6]/50 focus:ring-offset-2 shadow-lg"
                >
                  <div className="shine-effect bg-gradient-to-br from-transparent via-[#D4C6A6]/10 to-transparent"></div>
                  <div className="shine-effect-move"></div>
                  <span className="relative z-10">Jetzt Termin vereinbaren</span>
                </Link>
              </div>
            </div>

            {/* Portrait - now with equal width */}
            <div>
              <div className="relative">
                {/* Goldener Akzentrahmen */}
                <div className="absolute -inset-3 bg-gradient-to-br from-[#D4C6A6]/20 via-transparent to-[#D4C6A6]/10 rounded-lg blur-sm opacity-70"></div>

                {/* Portrait - rectangular */}
                <div className="relative rounded-lg overflow-hidden shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)]">
                  <div className="aspect-[3/4] relative">
                    <Image
                      src="/teresa-bianco-portrait.jpg"
                      alt="Teresa Bianco"
                      fill
                      className="object-cover object-center"
                    />

                    {/* Elegante Eckelemente */}
                    <div className="absolute top-0 left-0 w-16 h-16">
                      <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-[#D4C6A6]/40"></div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-16 h-16">
                      <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-[#D4C6A6]/40"></div>
                    </div>
                  </div>
                </div>

                {/* Dekorativer Akzent */}
                <div className="absolute -bottom-3 -right-3 w-20 h-20 border border-[#D4C6A6]/20 rounded-lg z-[-1]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Empfehlung - Referral CTA Section */}
      <section className="py-24 md:py-32 bg-[#b4b1aa] relative overflow-hidden">
        {/* Dekorative Elemente */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4C6A6]/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4C6A6]/30 to-transparent"></div>

        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-[#D4C6A6]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#766A5E]/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto bg-black/10 backdrop-blur-sm p-8 md:p-12 rounded-xl border border-white/10 shadow-lg">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6 text-white drop-shadow-sm">
                Für wen ist <span className="text-[#D4C6A6]">DIE BIANCO</span> gemacht?
              </h2>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                Für Menschen, die Qualität nicht diskutieren – sondern leben. Für alle, die ihren Typ nicht verändern,
                sondern finden möchten.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/5 p-6 rounded-lg border border-white/10 text-center hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02]">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg
                    className="w-8 h-8 text-[#D4C6A6]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="font-serif text-xl mb-2 text-white">Gemeinsame Momente</h3>
                <p className="text-sm text-white/80">Erleben Sie Wellness zu zweit in privater Atmosphäre</p>
              </div>

              <div className="bg-white/5 p-6 rounded-lg border border-white/10 text-center hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02]">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg
                    className="w-8 h-8 text-[#D4C6A6]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                </div>
                <h3 className="font-serif text-xl mb-2 text-white">Exklusive Upgrades</h3>
                <p className="text-sm text-white/80">Besondere Behandlungen für Sie und Ihre Begleitung</p>
              </div>

              <div className="bg-white/5 p-6 rounded-lg border border-white/10 text-center hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02]">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg
                    className="w-8 h-8 text-[#D4C6A6]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </div>
                <h3 className="font-serif text-xl mb-2 text-white">Persönliche Einladung</h3>
                <p className="text-sm text-white/80">Diskret und wertschätzend – ganz nach Ihrem Stil</p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                href="/gemeinsam-erleben"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4C6A6]/50 focus:ring-offset-2 shadow-lg"
              >
                <div className="shine-effect bg-gradient-to-br from-transparent via-[#D4C6A6]/20 to-transparent"></div>
                <div className="shine-effect-move"></div>
                <span className="relative z-10">Jetzt Termin vereinbaren</span>
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
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-20 relative z-10">
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
                <a
                  href="/impressum
"
                  className="text-white/50 text-sm hover:text-[#D4C6A6] transition-colors"
                >
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
