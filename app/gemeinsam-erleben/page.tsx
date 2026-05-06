"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import Navigation from "@/components/Navigation"

// Add this CSS for the shine effects
import "../globals.css"

const GemeinsamErleben = () => {
  const formRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    recommenderName: "",
    recommenderEmail: "",
    recommendedName: "",
    recommendedContact: "",
    reason: "",
  })

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="bg-[#b4b1aa] text-white min-h-screen">
      {/* Navigation Component */}
      <Navigation />

      {/* Hero Section with Background Image */}
      <section className="py-16 md:py-24 relative overflow-hidden bg-[#b4b1aa]">
        <div className="absolute inset-0 opacity-30">
          <Image src="/luxury-salon-friends.png" alt="Salon Experience" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#2C2C2C]/70 to-[#2C2C2C]/90"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4C6A6]/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4C6A6]/30 to-transparent"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6 text-white">
              Verwöhnerlebnis <span className="text-[#D4C6A6]">verschenken</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#D4C6A6] to-transparent mx-auto mb-8"></div>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-8">
              Hast du jemanden, der sich eine echte Auszeit verdient hat? Schenke einen besonderen Moment bei DIE BIANCO
              und werde selbst belohnt.
            </p>

            <button
              onClick={scrollToForm}
              className="inline-flex items-center justify-center px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4C6A6]/50 focus:ring-offset-2 shadow-lg"
            >
              Jetzt Termin vereinbaren
            </button>
          </div>
        </div>
      </section>

      {/* Rewards Section - NEW */}
      <section className="py-20 bg-[#b4b1aa] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4C6A6]/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4C6A6]/30 to-transparent"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl mb-6">
              Deine <span className="text-[#D4C6A6]">Belohnungen</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#D4C6A6] to-transparent mx-auto mb-6"></div>
            <p className="text-lg text-white/80">
              Je mehr Freunde du empfiehlst, desto mehr exklusive Vorteile warten auf dich
            </p>
          </div>

          {/* Rewards Tiers */}
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Tier 1 */}
            <div className="bg-black/20 backdrop-blur-sm rounded-md overflow-hidden shadow-sm border border-white/10 transform transition-transform duration-300 hover:scale-105">
              <div className="bg-[#D4C6A6]/30 p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-serif text-xl text-[#D4C6A6]">1 Empfehlung</h3>
                <div className="w-12 h-12 bg-[#D4C6A6] rounded-md flex items-center justify-center text-white font-serif text-xl">
                  1
                </div>
              </div>
              <div className="p-6 flex items-center justify-center">
                <p className="text-white/90 font-medium text-xl">5% Rabatt</p>
              </div>
            </div>

            {/* Tier 2 */}
            <div className="bg-black/20 backdrop-blur-sm rounded-md overflow-hidden shadow-sm border border-white/10 transform transition-transform duration-300 hover:scale-105">
              <div className="bg-[#D4C6A6]/30 p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-serif text-xl text-[#D4C6A6]">3 Empfehlungen</h3>
                <div className="w-12 h-12 bg-[#D4C6A6] rounded-md flex items-center justify-center text-white font-serif text-xl">
                  3
                </div>
              </div>
              <div className="p-6 flex items-center justify-center">
                <p className="text-white/90 font-medium text-xl">15% Rabatt</p>
              </div>
            </div>

            {/* Tier 3 */}
            <div className="bg-black/20 backdrop-blur-sm rounded-md overflow-hidden shadow-sm border border-white/10 transform transition-transform duration-300 hover:scale-105">
              <div className="bg-[#D4C6A6]/40 p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-serif text-xl text-[#D4C6A6]">5 Empfehlungen</h3>
                <div className="w-12 h-12 bg-[#D4C6A6] rounded-md flex items-center justify-center text-white font-serif text-xl">
                  5
                </div>
              </div>
              <div className="p-6 flex items-center justify-center">
                <p className="text-white/90 font-medium text-xl">20% Rabatt</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Feature Section */}
      <section className="py-20 bg-[#b4b1aa] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4C6A6]/30 to-transparent"></div>

        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative overflow-hidden shadow-xl rounded-md">
                <Image
                  src="/empf.jpeg"
                  alt="Salon Experience"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2C]/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[#D4C6A6] font-serif text-xl">Mehr als ein Friseurbesuch</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-3xl md:text-4xl mb-6">
                Eine <span className="text-[#D4C6A6]">Auszeit</span> für Körper, Geist und Stil
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-[#D4C6A6] to-transparent mb-6"></div>

              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-black/20 backdrop-blur-sm flex items-center justify-center mr-4 flex-shrink-0 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#D4C6A6]"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1 text-white">Persönliche Beratung</h3>
                    <p className="text-white/70">
                      Eine Typ- & Farbberatung, die den individuellen Charakter unterstreicht
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-black/20 backdrop-blur-sm flex items-center justify-center mr-4 flex-shrink-0 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#D4C6A6]"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1 text-white">Hochwertige Pflege</h3>
                    <p className="text-white/70">Exklusive Produkte für Haar & Seele von renommierten Marken</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-black/20 backdrop-blur-sm flex items-center justify-center mr-4 flex-shrink-0 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#D4C6A6]"
                    >
                      <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                      <line x1="6" y1="1" x2="6" y2="4"></line>
                      <line x1="10" y1="1" x2="10" y2="4"></line>
                      <line x1="14" y1="1" x2="14" y2="4"></line>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1 text-white">Entspanntes Ambiente</h3>
                    <p className="text-white/70">
                      Zeit zum Ankommen, Loslassen und für sich selbst in stilvoller Atmosphäre
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={scrollToForm}
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4C6A6]/50 focus:ring-offset-2 shadow-lg"
              >
                Jetzt Termin vereinbaren
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Process Section */}
      <section className="py-20 bg-[#b4b1aa] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl mb-6 text-white">
              So einfach <span className="text-[#D4C6A6]">funktioniert&apos;s</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#D4C6A6] to-transparent mx-auto"></div>
          </div>

          {/* Simple Card Layout */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="bg-black/20 backdrop-blur-sm rounded-md overflow-hidden border border-white/10">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-[#D4C6A6] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-serif text-xl">1</span>
                </div>
                <h3 className="font-serif text-xl mb-3 text-[#D4C6A6]">Empfehlung</h3>
                <p className="text-white/80">
                  Fülle das Formular aus und empfiehl uns eine Person, die sich eine besondere Auszeit verdient hat.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-black/20 backdrop-blur-sm rounded-md overflow-hidden border border-white/10">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-[#D4C6A6] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-serif text-xl">2</span>
                </div>
                <h3 className="font-serif text-xl mb-3 text-[#D4C6A6]">Kontaktaufnahme</h3>
                <p className="text-white/80">
                  Wir melden uns stilvoll und diskret bei deiner Empfehlung mit einem charmanten Willkommensgruß.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-black/20 backdrop-blur-sm rounded-md overflow-hidden border border-white/10">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-[#D4C6A6] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-serif text-xl">3</span>
                </div>
                <h3 className="font-serif text-xl mb-3 text-[#D4C6A6]">Dankeschön</h3>
                <p className="text-white/80">
                  Als kleines Dankeschön erhältst du eine exklusive Überraschung bei deinem nächsten Besuch.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={scrollToForm}
              className="inline-flex items-center justify-center px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4C6A6]/50 focus:ring-offset-2 shadow-lg"
            >
              Jetzt Termin vereinbaren
            </button>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-[#b4b1aa] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4C6A6]/30 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#D4C6A6]/3 -skew-x-12 transform origin-top-right opacity-30"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl mb-6 text-white">Was unsere Kunden sagen</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#D4C6A6] to-transparent mx-auto"></div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm border border-white/10 p-8 md:p-10 relative mb-10 rounded-md">
              <div className="absolute -top-4 -left-4 text-[#D4C6A6] text-6xl opacity-30">&quot;</div>
              <div className="absolute -bottom-4 -right-4 text-[#D4C6A6] text-6xl opacity-30">&quot;</div>

              <blockquote className="text-lg md:text-xl text-white/90 italic text-center mb-8">
                Ich habe meiner besten Freundin einen Termin bei DIE BIANCO geschenkt. Sie war begeistert von der
                persönlichen Beratung und dem entspannten Ambiente. Ein Geschenk, das wirklich von Herzen kam und mit
                Herz empfangen wurde. Als Dankeschön erhielt ich einen tollen Rabatt auf meine nächste Behandlung!
              </blockquote>

              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-black/20 backdrop-blur-sm flex items-center justify-center mr-4 rounded-md">
                  <span className="text-[#D4C6A6] font-serif text-xl">S</span>
                </div>
                <div>
                  <p className="font-medium text-[#D4C6A6]">Sarah M.</p>
                  <p className="text-white/60 text-sm">Zufriedene Kundin</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={scrollToForm}
                className="inline-flex items-center justify-center px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4C6A6]/50 focus:ring-offset-2 shadow-lg"
              >
                Jetzt Termin vereinbaren
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section with Visual Elements */}
      <section ref={formRef} className="py-20 bg-[#b4b1aa] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4C6A6]/30 to-transparent"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl mb-6 text-white">
                Wen möchtest du <span className="text-[#D4C6A6]">verwöhnen</span> lassen?
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-[#D4C6A6] to-transparent mb-6"></div>

              <p className="text-white/70 mb-8">
                Fülle das Formular aus und wir kümmern uns um den Rest. Deine Empfehlung wird diskret und stilvoll
                kontaktiert.
              </p>

              <div className="bg-black/20 backdrop-blur-sm p-6 border border-white/10 rounded-md">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-black/20 backdrop-blur-sm flex items-center justify-center mr-4 flex-shrink-0 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#D4C6A6]"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <p className="text-white/80 italic">
                    &quot;Das perfekte Geschenk für jemanden, der sich eine Auszeit verdient hat.&quot;
                  </p>
                </div>
              </div>
            </div>

            <div>
              <form
                onSubmit={handleSubmit}
                className="backdrop-blur-md bg-black/20 rounded-md p-8 md:p-10 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.1)] border border-white/10"
              >
                {/* Your Information */}
                <div className="mb-8">
                  <h4 className="font-serif text-xl mb-4 text-[#D4C6A6]">Deine Angaben</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="recommenderName" className="block text-sm font-medium text-white/80 mb-2">
                        Dein Name
                      </label>
                      <input
                        type="text"
                        id="recommenderName"
                        name="recommenderName"
                        value={formData.recommenderName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-md border border-white/10 bg-black/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all placeholder-white/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="recommenderEmail" className="block text-sm font-medium text-white/80 mb-2">
                        Deine E-Mail
                      </label>
                      <input
                        type="email"
                        id="recommenderEmail"
                        name="recommenderEmail"
                        value={formData.recommenderEmail}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-md border border-white/10 bg-black/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all placeholder-white/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Recommended Person */}
                <div className="mb-8">
                  <h4 className="font-serif text-xl mb-4 text-[#D4C6A6]">Person, die du empfehlen möchtest</h4>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="recommendedName" className="block text-sm font-medium text-white/80 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="recommendedName"
                        name="recommendedName"
                        value={formData.recommendedName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-md border border-white/10 bg-black/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all placeholder-white/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="recommendedContact" className="block text-sm font-medium text-white/80 mb-2">
                        Kontakt (E-Mail/Telefon)
                      </label>
                      <input
                        type="text"
                        id="recommendedContact"
                        name="recommendedContact"
                        value={formData.recommendedContact}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-md border border-white/10 bg-black/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all placeholder-white/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-white/80 mb-2">
                      Warum verdient diese Person eine besondere Auszeit? (optional)
                    </label>
                    <textarea
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-3 rounded-md border border-white/10 bg-black/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all resize-none placeholder-white/50"
                      placeholder="Erzähl uns kurz, warum..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4C6A6]/50 focus:ring-offset-2 shadow-lg"
                >
                  Empfehlung absenden
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - matching homepage */}
      <footer className="bg-[#2C2C2C] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4C6A6]/30 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#D4C6A6]/3 -skew-x-12 transform origin-top-right opacity-30"></div>

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
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12. 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
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
              <p className="text-white/50 text-sm">© {new Date().getFullYear()} DIE BIANCO. Alle Rechte vorbehalten.</p>
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

export default GemeinsamErleben
