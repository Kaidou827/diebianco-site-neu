import Image from "next/image"
import Link from "next/link"
import Navigation from "@/components/Navigation"
import { Palette, Scissors, Award, Gem, Star, Coffee, Feather, Users, Heart, Sparkles } from "lucide-react"
import type { Metadata } from "next"

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20 justify-center">
                {/* Thomas */}
                <div className="bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-white/10 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src="/images/team-member-1.jpeg"
                      alt="Thomas - Friseurmeister"
                      fill
                      className="object-cover object-[center_15%]"
                    />
                    <div className="absolute top-4 left-4 w-12 h-12">
                      <div className="absolute top-0 left-0 w-full h-full border-t-2 border-l-2 border-[#D4C6A6]/40"></div>
                    </div>
                    <div className="absolute bottom-4 right-4 w-12 h-12">
                      <div className="absolute bottom-0 right-0 w-full h-full border-b-2 border-r-2 border-[#D4C6A6]/40"></div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-2xl text-white mb-1">Thomas</h3>
                    <p className="text-[#D4C6A6] text-sm mb-4">Friseurmeister</p>
                    <div className="w-12 h-px bg-[#D4C6A6]/50 mb-4"></div>
                    <p className="text-white/80 leading-relaxed">
                      Bekannt für seine ehrliche Beratung und kreative Farbexpertise. Seine unverwechselbaren
                      Handtechniken sind sein Markenzeichen – individuell und exklusiv.
                    </p>
                    <div className="flex gap-3 mt-4">
                      <span className="inline-block px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-xs text-white/80">
                        Farbkolorist
                      </span>
                      <span className="inline-block px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-xs text-white/80">
                        Freihandtechniken
                      </span>
                    </div>
                  </div>
                </div>

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
                  Ihr exklusiver Rückzugsort für authentische Schönheit und ungestörte Momente der Pflege und
                  Entspannung.
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
                <p className="text-white/50 text-sm">
                  © {new Date().getFullYear()} DIE BIANCO. Alle Rechte vorbehalten.
                </p>
                <div className="flex gap-6 mt-4 md:mt-0">
                  <a href="/impressum
" className="text-white/50 text-sm hover:text-[#D4C6A6] transition-colors">
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
    </>
  )
}
