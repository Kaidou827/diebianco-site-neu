"use client"

import { useState, useRef, type FormEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit, Clock, Eye, Github, Linkedin, Mail, Rss, Twitter } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const POSTS = [
  {
    slug: "brautfrisur-krefeld",
    title: "Brautfrisur Krefeld: Dein perfektes Styling für den großen Tag",
    description: "Der Hochzeitstag ist einer der wichtigsten Momente im Leben. Alles muss stimmen – besonders Haare und Make-up. Eine gewöhnliche Frisur reicht hier nicht aus",
    category: "DieBianco",
    date: "27 Februar 2026",
    image: "/imagesblog/Salondiebiancospiegel.webp",
  },
  {
    slug: "haarverlaengerung-krefeld",
    title: "Haarverlängerung Krefeld – Dein Traum von langem, vollem Haar",
    description: "Extensions vom Experten: Erfahre alles über Haarverlängerung in Krefeld, Methoden, Pflege und Beratung bei Die Bianco.",
    category: "DieBianco",
    date: "9. März 2026",
    image: "/imagesblog/haarverlaengerung-vorher-nachher-krefeld.webp",
  },
  {
    slug: "blond-spezialist-krefeld",
    title: "Blond Spezialist Krefeld: Der Weg zum perfekten Blondton",
    description: "Blonde Haare gehören zu den beliebtesten Haarfarben. Erfahre, wie du beim Friseur in Krefeld den perfekten Blondton ohne Gelbstich bekommst.",
    category: "DieBianco",
    date: "17 März 2026",
    image: "/imagesblog/blond-spezialist-krefeld-balayage.webp",
  },


]

export default function BlogPage() {
  return (
    <div className="min-h-screen text-white bg-[rgba(180,177,170,1)]">
      {/* HERO */}
      {/* HERO */}
      <section className="pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}
            <div className="max-w-xl">

              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
                Friseur & Beauty Wissen
                <span className="block text-[#D4C6A6] italic">
                  von Die Bianco
                </span>
              </h1>

              <p className="text-lg md:text-xl text-white/75 mb-10 leading-relaxed">
                Inspiration, Styling Tipps und Expertenwissen rund um Balayage,
                Blond, moderne Schnitte und Haarpflege direkt aus unserem
                Salon in Krefeld.
              </p>

              {/* CTA ROW */}
              <div className="flex items-start gap-6">

                {/* MAIN CTA COLUMN */}
                <div className="flex flex-col items-center">

                  <Link
                    href="/kontakt"
                    className="inline-flex items-center justify-center px-7 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:scale-[1.02] transition-all duration-300 shadow-lg"
                  >
                    Jetzt Termin vereinbaren
                  </Link>

                  {/* centered text */}
                  <button
                    className="mt-4 text-sm text-white/60 hover:text-[#D4C6A6] transition-colors duration-300"
                  >
                    Leistungen entdecken
                  </button>

                </div>

                {/* CALL BUTTON */}
                <a
                  href="tel:+491743091973"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#2C2C2C] border border-white/10 rounded-full hover:bg-[#1f1f1f] transition-all duration-300"
                >

                  <svg
                    className="w-4 h-4 text-[#D4C6A6]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>

                  Anrufen

                </a>

              </div>

            </div>

            {/* RIGHT IMAGE */}
            <div className="relative">

              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-2xl">

                <Image
                  src="/images/Schereen.jpg"
                  alt="Professioneller Friseursalon Die Bianco"
                  fill
                  className="object-cover"
                  priority
                />

                {/* luxury overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

              </div>

              {/* decorative border */}
              <div className="absolute -bottom-5 -right-5 w-24 h-24 border border-[#111111]/20 rounded-lg -z-10"></div>

            </div>

          </div>
        </div>
      </section>
      {/* AKTUELLE ARTIKEL */}
      <section id="leistungen-section" className="py-24 md:py-32 bg-[#a09a93] relative overflow-hidden">
        {/* Elegant decorative elements */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-serif text-xl md:text-2xl text-white mb-2">Aktuelle Artikel</h2>
            <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#D4C6A6] to-transparent mx-auto mt-4"></div>
          </div>

          {/* Service Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {POSTS.slice(0, 3).map((post) => (
              <FeaturedCard
                key={post.slug}
                title={post.title}
                description={post.description}
                image={post.image}
                date={post.date}
                category={post.category}
                slug={post.slug}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              Vereinbaren Sie einen persönlichen Termin und entdecken Sie, wie unser erfahrenes Team Ihre individuellen Wünsche und Vorstellungen perfekt umsetzt.
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

      {/* FOOTER */}
      <footer className="border-b border-[#2C2C2C]/10 bg-[#2C2C2C] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4C6A6]/30 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#D4C6A6]/3 -skew-x-12 transform origin-top-right opacity-30"></div>

        <div className="container px-4 py-16 relative z-10 md:py-4 md:px-2.5 mx-auto">
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
              <div className="w-12 h-px bg-gradient-to-r from-[#D4C6A6] to-transparent mt-2"></div>
              <p className="text-white/70 leading-relaxed mb-6">
                Ihr exklusiver Rückzugsort für authentische Schönheit und ungestörte Momente der Pflege und Entspannung.
              </p>
            </div>

            <div className="md:col-span-3 md:col-start-6">
              <h3 className="font-serif text-lg mb-4 text-[#D4C6A6]">Kontakt</h3>
              <address className="not-italic text-white/70 space-y-3">
                <p className="flex items-start">
                  <svg
                    className="w-5 h-5 mr-3 text-[#D4C6A6] flex-shrink-0 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx={12} cy={10} r={3}></circle>
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
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
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
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
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

            <div className="md:col-span-3 md:col-start-10">
              <h3 className="font-serif text-lg mb-4 text-[#D4C6A6]">Öffnungszeiten</h3>
              <div className="text-white/70 space-y-3">
                <p className="flex items-start">
                  <svg
                    className="w-5 h-5 mr-3 text-[#D4C6A6] flex-shrink-0 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx={12} cy={12} r={10}></circle>
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
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x={3} y={4} width={18} height={18} rx={2} ry={2}></rect>
                    <line x1={16} y1={2} x2={16} y2={6}></line>
                    <line x1={8} y1={2} x2={8} y2={6}></line>
                    <line x1={3} y1={10} x2={21} y2={10}></line>
                  </svg>
                  <span>Termine nach Vereinbarung</span>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/50 text-sm">{`© ${new Date().getFullYear()} DIE BIANCO.Alle Rechte vorbehalten.`}</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="text-white/50 text-sm hover:text-[#D4C6A6] transition-colors">
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

function FeaturedCard({ title, description, image, date, category, slug = "" }) {
  return (
    <Card className="group relative h-full bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 transition-all duration-300 hover:bg-white/15 hover:-translate-y-1 hover:shadow-2xl">
      <Link
        href={`/ Blog / ${slug} / `}
        className="block h-full"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        {/* Image */}
        <div className="relative w-full aspect-[4/3]">
          <Image
            src={image || "/images/Schereen.jpg"}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col h-full">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>

          <span className="text-xs uppercase tracking-widest text-[#D4C6A6] mb-2">
            {category}
          </span>

          <h3 className="font-serif text-xl mb-3 text-[rgba(205,189,157,1)]">
            {title}
          </h3>

          <p className="text-white/80 mb-6 line-clamp-3">
            {description}
          </p>

          <div className="mt-auto flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-white/60">
              <Clock className="h-4 w-4" />
              <span>{date}</span>
            </div>

            <span className="text-[#D4C6A6] font-medium group-hover:text-white transition-colors">
              Mehr lesen →
            </span>
          </div>
        </div>
      </Link>
    </Card>
  )
}

function ArticleCard({ title, description, category, date, slug = "", image }) {
  return (
    <Link href={`/ Blog / ${slug} / `} className="group">
      <div className="space-y-3 py-0 bg-transparent">
        <div className="relative h-48 rounded-lg overflow-hidden border border-gray-800 group-hover:border-[#d4c6a6]/50 transition-colors">
          <Image src={image || "/placeholder.svg"} alt={`${title} thumbnail`} fill className="object-cover" />
        </div>
        <div className="bg-transparent">
          <div className="flex items-center gap-2 text-xs text-[#d4c6a6] mb-2">
            <BrainCircuit className="h-4 w-4" />
            <span>{category}</span>
          </div>
          <h2 className="group-hover:text-white transition-colors font-extrabold tracking-wider tabular-nums text-[rgba(194,174,143,1)] border-background border-0 text-lg">
            {title}
          </h2>
          <p className="text-white-400 text-sm mt-2 line-clamp-2 font-bold">{description}</p>
          <div className="flex items-center gap-1 mt-3 text-xs text-black">
            <Clock className="h-3 w-3" />
            <span>{date}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
