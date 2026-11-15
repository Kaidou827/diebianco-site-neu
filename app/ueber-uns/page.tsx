import Image from "next/image"
import Link from "next/link"
import Navigation from "@/components/Navigation"
import { Palette, Scissors, Award, Gem, Star, Coffee, Feather, Users, Heart, Sparkles } from "lucide-react"
import type { Metadata } from "next"
import SiteFooter from "@/components/SiteFooter"

const description =
  "Lernen Sie Teresa Bianco und ihr Team kennen. Erfahren Sie mehr über die Philosophie, die unseren Salon in Krefeld auszeichnet – Expertise und Leidenschaft."

export const metadata: Metadata = {
  title: "Über Teresa Bianco | Team & Philosophie des Salons in Krefeld",
  description: description,
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  mainEntity: {
    "@type": "HairSalon",
    name: "Teresa Bianco",
  },
}

export default function UeberUns() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="bg-[#b4b1aa] text-white min-h-screen">
        <Navigation />

        {/* Hero Section - Team Introduction */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

          <div className="container px-4 md:px-6 relative z-10 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
                Expertise, Leidenschaft, <span className="text-[#D4C6A6]">Stil</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto">
                Unser erfahrenes Team vereint jahrzehntelange Expertise mit kreativer Innovation und persönlicher
                Betreuung auf höchstem Niveau.
              </p>
            </div>
          </div>
        </section>

        {/* Teresa Bianco Main Section - Redesigned with Visual Elements */}
        <section className="py-20 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

          {/* Background Accents */}
          <div className="absolute top-20 right-0 w-96 h-96 bg-[#D4C6A6]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>

          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Image Column */}
              <div>
                <div className="relative">
                  {/* Golden Accent Frame */}
                  <div className="absolute -inset-3 md:-inset-5 bg-gradient-to-br from-[#D4C6A6]/20 via-transparent to-[#D4C6A6]/10 rounded-lg blur-sm opacity-70"></div>

                  {/* Main Image */}
                  <div className="relative overflow-hidden rounded-lg shadow-[0_20px_70px_-15px_rgba(0,0,0,0.25)]">
                    <div className="aspect-[3/4] relative">
                      <Image
                        src="/teresa-bianco-portrait.jpg"
                        alt="Teresa Bianco - Saloninhaberin"
                        fill
                        className="object-cover object-center"
                      />

                      {/* Subtle Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>

                      {/* Elegant Corner Elements */}
                      <div className="absolute top-0 left-0 w-16 h-16">
                        <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-[#D4C6A6]/40"></div>
                      </div>
                      <div className="absolute bottom-0 right-0 w-16 h-16">
                        <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-[#D4C6A6]/40"></div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Accent */}
                  <div className="absolute -bottom-3 -left-3 w-20 h-20 border border-[#D4C6A6]/20 rounded-lg z-[-1]"></div>
                </div>
              </div>

              {/* Content Column - Visual Design */}
              <div className="space-y-8">
                {/* Name and Title */}
                <div className="text-center lg:text-left">
                  <h2 className="font-serif text-4xl md:text-5xl tracking-tight mb-3">Teresa Bianco</h2>
                  <p className="text-[#D4C6A6] text-xl font-serif italic mb-8">
                    Saloninhaberin – Vision, Herzblut und Stil
                  </p>

                  {/* Visual Stats */}
                  <div className="flex flex-wrap gap-6 justify-center lg:justify-start mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-[#D4C6A6]/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-serif text-[#D4C6A6]">27+</span>
                      </div>
                      <span className="text-sm text-white/70">
                        Jahre
                        <br />
                        Erfahrung
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-[#D4C6A6]/20 rounded-full flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-[#D4C6A6]" />
                      </div>
                      <span className="text-sm text-white/70">
                        Innovative
                        <br />
                        Technik
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-[#D4C6A6]/20 rounded-full flex items-center justify-center">
                        <Heart className="w-8 h-8 text-[#D4C6A6]" />
                      </div>
                      <span className="text-sm text-white/70">
                        100%
                        <br />
                        Leidenschaft
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quote - Prominent Visual Element */}
                <div className="relative">
                  <div className="absolute -top-4 -left-4 text-6xl text-[#D4C6A6]/20 font-serif">&quot;</div>
                  <div className="bg-black/20 backdrop-blur-sm rounded-lg p-8 border border-white/10 relative z-10">
                    <p className="text-lg md:text-xl text-white/90 leading-relaxed italic text-center">
                      Mein Handwerk ist meine Sprache – ich sehe die Persönlichkeit eines Menschen.
                    </p>
                  </div>
                  <div className="absolute -bottom-4 -right-4 text-6xl text-[#D4C6A6]/20 font-serif rotate-180">
                    &quot;
                  </div>
                </div>

                {/* Visual Feature Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center group hover:bg-black/30 transition-all duration-300">
                    <div className="w-14 h-14 bg-[#D4C6A6]/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Scissors className="w-7 h-7 text-[#D4C6A6]" />
                    </div>
                    <h4 className="font-serif text-lg mb-1">Schnitttechnik</h4>
                    <p className="text-xs text-white/70">Horizontal, Vertikal, Diagonal</p>
                  </div>

                  <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center group hover:bg-black/30 transition-all duration-300">
                    <div className="w-14 h-14 bg-[#D4C6A6]/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Palette className="w-7 h-7 text-[#D4C6A6]" />
                    </div>
                    <h4 className="font-serif text-lg mb-1">Italienische Wurzeln</h4>
                    <p className="text-xs text-white/70">Leidenschaft & Präzision</p>
                  </div>

                  <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center group hover:bg-black/30 transition-all duration-300">
                    <div className="w-14 h-14 bg-[#D4C6A6]/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Award className="w-7 h-7 text-[#D4C6A6]" />
                    </div>
                    <h4 className="font-serif text-lg mb-1">Meisterausbildung</h4>
                    <p className="text-xs text-white/70">Mailand & Deutschland</p>
                  </div>

                  <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center group hover:bg-black/30 transition-all duration-300">
                    <div className="w-14 h-14 bg-[#D4C6A6]/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Gem className="w-7 h-7 text-[#D4C6A6]" />
                    </div>
                    <h4 className="font-serif text-lg mb-1">DIE BIANCO</h4>
                    <p className="text-xs text-white/70">Exklusiver Salon</p>
                  </div>
                </div>

                {/* Signature */}
                <div className="text-center lg:text-right">
                  <div className="inline-block">
                    <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#D4C6A6] to-transparent mb-2"></div>
                    <p className="text-[#D4C6A6] font-serif italic text-sm">Teresa Bianco</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Teresa's Journey Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6">
                Der Weg zur <span className="text-[#D4C6A6]">Meisterschaft</span>
              </h2>
              <p className="text-lg max-w-2xl mx-auto text-white/80">
                Die erfahrene Friseurmeisterin blickt auf eine beeindruckende Karriere zurück – ihre Wurzeln reichen von
                der renommierten Intercoiffeur Junge-Michaelis Akademie bis in die Modemetropole Mailand.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 max-w-5xl mx-auto">
              {/* Early Career */}
              <div className="bg-black/20 backdrop-blur-sm rounded-md overflow-hidden shadow-lg border border-white/10 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                <div className="p-8">
                  <div className="flex items-baseline justify-between mb-6">
                    <h3 className="font-serif text-2xl">Die Anfänge</h3>
                    <span className="text-[#D4C6A6] text-sm"></span>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex items-start gap-4">
                      <Award className="w-5 h-5 text-[#D4C6A6] flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-white/80">
                          Ausbildung an der renommierten Intercoiffeur Junge-Michaelis Akademie
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Scissors className="w-5 h-5 text-[#D4C6A6] flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-white/80">Weiterbildung in der Modemetropole Mailand</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Star className="w-5 h-5 text-[#D4C6A6] flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-white/80">
                          Entwicklung einer einzigartigen Mischung aus italienischer Leidenschaft und deutscher
                          Präzision
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Feather className="w-5 h-5 text-[#D4C6A6] flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-white/80">Entdeckung eines feinen Gespürs für Ästhetik und Individualität</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-8 pb-8 pt-2">
                  <div className="border-t border-white/10 pt-6">
                    <p className="text-white/70 italic text-center">
                      &quot;Die Grundlage für Exzellenz ist kontinuierliches Lernen&quot;
                    </p>
                  </div>
                </div>
              </div>

              {/* Salon Establishment */}
              <div className="bg-black/20 backdrop-blur-sm rounded-md overflow-hidden shadow-lg border border-white/10 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                <div className="p-8">
                  <div className="flex items-baseline justify-between mb-6">
                    <h3 className="font-serif text-2xl">Die Innovation</h3>
                    <span className="text-[#D4C6A6] text-sm"></span>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex items-start gap-4">
                      <Gem className="w-5 h-5 text-[#D4C6A6] flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-white/80">
                          Gründung von DIE BIANCO – ein Salon, der ihre Vision von Handwerk, Qualität und persönlicher
                          Betreuung verkörpert
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Scissors className="w-5 h-5 text-[#D4C6A6] flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-white/80">Entwicklung einer innovativen Schnitttechnik</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Palette className="w-5 h-5 text-[#D4C6A6] flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-white/80">
                          Etablierung einer eigenen Handschrift: intuitiv, hochwertig und stilvoll
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Users className="w-5 h-5 text-[#D4C6A6] flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-white/80">
                          Aufbau eines exklusiven, privaten Rahmens für individuelle Betreuung
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Coffee className="w-5 h-5 text-[#D4C6A6] flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-white/80">
                          Schaffung eines Erlebnisses aus Vertrauen, Nähe und Gesprächen auf Augenhöhe
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-8 pb-8 pt-2">
                  <div className="border-t border-white/10 pt-6">
                    <p className="text-white/70 italic text-center">
                      &quot;Meine Schnitttechnik folgt keinem Trend, sondern dem Charakter&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section - Redesigned with traditional layout */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6">
                  Unser <span className="text-[#D4C6A6]">Team</span>
                </h2>
                <p className="text-lg max-w-2xl mx-auto text-white/80">
                  Lernen Sie unser engagiertes Team kennen, das mit Leidenschaft und Können Ihre individuellen Wünsche
                  erfüllt.
                </p>
              </div>

              {/* Friseurmeister - Traditional Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-20 max-w-3xl mx-auto">
                {/* Sunny */}
                <div className="bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-white/10 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src="/images/team-member-3.jpeg"
                      alt="Sunny - Friseurmeisterin"
                      fill
                      className="object-cover object-[center_25%]"
                    />
                    <div className="absolute top-4 left-4 w-12 h-12">
                      <div className="absolute top-0 left-0 w-full h-full border-t-2 border-l-2 border-[#D4C6A6]/40"></div>
                    </div>
                    <div className="absolute bottom-4 right-4 w-12 h-12">
                      <div className="absolute bottom-0 right-0 w-full h-full border-b-2 border-r-2 border-[#D4C6A6]/40"></div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-2xl text-white mb-1">Sunny</h3>
                    <p className="text-[#D4C6A6] text-sm mb-4">Friseurmeisterin</p>
                    <div className="w-12 h-px bg-[#D4C6A6]/50 mb-4"></div>
                    <p className="text-white/80 leading-relaxed">
                      Leidenschaftliche Expertin für kreative Blondtöne und exzellente Kurzhaarschnitte. Beeindruckt
                      durch ihre einzigartige Geschwindigkeit und Präzision.
                    </p>
                    <div className="flex gap-3 mt-4">
                      <span className="inline-block px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-xs text-white/80">
                        Blondtöne
                      </span>
                      <span className="inline-block px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-xs text-white/80">
                        Kurzhaarschnitte
                      </span>
                    </div>
                  </div>
                </div>

                {/* Marketing Team - Traditional Cards */}

                {/* Maik */}
                <div className="bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-white/10 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src="/images/team-member-2.jpeg"
                      alt="Maik - Creative Partner"
                      fill
                      className="object-cover object-[center_10%]"
                    />
                    <div className="absolute top-4 left-4 w-12 h-12">
                      <div className="absolute top-0 left-0 w-full h-full border-t-2 border-l-2 border-[#D4C6A6]/40"></div>
                    </div>
                    <div className="absolute bottom-4 right-4 w-12 h-12">
                      <div className="absolute bottom-0 right-0 w-full h-full border-b-2 border-r-2 border-[#D4C6A6]/40"></div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-2xl text-white mb-1">Maik</h3>
                    <p className="text-[#D4C6A6] text-sm mb-4">Creative Partner</p>
                    <div className="w-12 h-px bg-[#D4C6A6]/50 mb-4"></div>
                    <p className="text-white/80 leading-relaxed">
                      Kreativer Partner mit umfassendem Know-how in Mode und Styling. Vertritt namhafte Luxusmarken und
                      bringt internationales Modewissen ein.
                    </p>
                    <div className="flex gap-3 mt-4">
                      <span className="inline-block px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-xs text-white/80">
                        Luxusmode
                      </span>
                      <span className="inline-block px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-xs text-white/80">
                        Farbberatung
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Updated to focus on the team */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

          {/* Decorative circles */}
          <div className="absolute top-20 right-10 w-64 h-64 bg-[#D4C6A6]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

          <div className="container px-4 md:px-6 relative z-10 mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6">
                Erleben Sie unser <span className="text-[#D4C6A6]">Team</span> in Aktion
              </h2>
              <p className="text-lg md:text-xl mb-12 text-white/80 max-w-2xl mx-auto">
                Vereinbaren Sie einen persönlichen Termin und entdecken Sie, wie unser erfahrenes Team Ihre
                individuellen Wünsche und Vorstellungen perfekt umsetzt.
              </p>

              <div className="flex justify-center">
                <Link
                  href="/kontakt"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4C6A6]/50 focus:ring-offset-2 shadow-lg"
                >
                  Jetzt Termin vereinbaren
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <SiteFooter />
      </div>
    </>
  )
}
