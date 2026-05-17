"use client"

import type React from "react"

import Image from "next/image"
import { Mail, MapPin, Phone, Clock, CheckCircle } from "lucide-react"
import Navigation from "@/components/Navigation"
import { useState } from "react"

export default function Kontakt() {
  const [formData, setFormData] = useState({
    firstname: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    setIsSubmitting(true)
    setSubmitMessage("Sende...")

    try {
      // Validate required fields
      if (!formData.firstname || !formData.email || !formData.phone) {
        setSubmitMessage("Name, E-Mail und Telefon sind erforderlich.")
        setIsSubmitting(false)
        return
      }

      // Get HubSpot tracking cookie if available
      let hutk = ""
      try {
        const hubspotCookie = document.cookie.split("; ").find((row) => row.startsWith("hubspotutk="))
        if (hubspotCookie) {
          hutk = hubspotCookie.split("=")[1]
        }
      } catch (e) {
        console.log("Could not get HubSpot cookie:", e)
      }

      const payload = {
        firstname: formData.firstname,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        pageUri: window.location.href,
        pageName: document.title,
        hutk: hutk || undefined,
      }

      // Submit to HubSpot API
      const response = await fetch("/api/hubspot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      let json: { ok: boolean; message: string }
      if (response.headers.get("content-type")?.includes("application/json")) {
        json = await response.json()
      } else {
        const txt = await response.text()
        throw new Error(`Unerwartete Antwort: ${txt}`)
      }

      if (json.ok) {
        const encodedName = encodeURIComponent(formData.firstname.trim())
        setFormData({
          firstname: "",
          email: "",
          phone: "",
          message: "",
        })
        form.reset()
        window.location.assign(`/kontakt/danke?name=${encodedName}`)
        return
      } else {
        console.error("Form submission failed:", json)
        setSubmitMessage(json.message || "Fehler beim Senden der Nachricht.")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitMessage("Fehler beim Senden der Nachricht.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-[#b4b1aa] text-white min-h-screen">
      {/* Standardized Navigation Component */}
      <Navigation />

      {/* Contact Form Section - Now at the top */}
      <section className="py-16 md:py-20 bg-[#b4b1aa] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="font-serif text-3xl md:text-5xl tracking-tight mb-6 leading-tight">
              Kontaktieren Sie <span className="text-[rgb(212,198,166)]">uns</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
              Vereinbaren Sie Ihren persönlichen Termin und erleben Sie exklusive Schönheitspflege in privater
              Atmosphäre.
            </p>
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
              <p className="text-white/80 mb-8">Einfach Formular ausfuellen, Teresa meldet sich persoenlich bei dir.</p>
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstname" className="block text-sm font-medium text-white/80 mb-2">
                      Name *
                    </label>
                    <input
                      id="firstname"
                      name="firstname"
                      type="text"
                      value={formData.firstname}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-md border border-white/10 bg-black/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all placeholder-white/50"
                      placeholder="Ihr Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                      E-Mail *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-md border border-white/10 bg-black/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all placeholder-white/50"
                      placeholder="Ihre E-Mail"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-2">
                    Telefon *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-md border border-white/10 bg-black/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all placeholder-white/50"
                    placeholder="+49 …"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
                    Nachricht
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-md border border-white/10 bg-black/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all resize-none placeholder-white/50"
                    placeholder="Ihre Nachricht an uns"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4C6A6]/50 focus:ring-offset-2 shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? "Sende..." : "Nachricht senden"}
                </button>

                <div className="rounded-md border border-white/10 bg-black/25 p-4">
                  <p className="italic text-white/90">&quot;Ich melde mich persoenlich bei dir - versprochen.&quot;</p>
                  <p className="mt-1 text-sm text-[#D4C6A6]">- Teresa Bianco</p>
                  <ul className="mt-4 space-y-2 text-sm text-white/85">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-[#D4C6A6]" />
                      Persoenliche Beratung
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
              </form>
              {submitMessage && (
                <div
                  className={`mt-4 p-3 rounded-md text-center ${
                    submitMessage.includes("Danke")
                      ? "bg-green-500/20 text-green-300 border border-green-500/30"
                      : "bg-red-500/20 text-red-300 border border-red-500/30"
                  }`}
                >
                  {submitMessage}
                </div>
              )}
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
      <footer className="bg-[#2C2C2C] text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[rgb(212,198,166)]/30 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[rgb(212,198,166)]/3 -skew-x-12 transform origin-top-right opacity-30"></div>

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
              <div className="w-12 h-px bg-gradient-to-r from-[rgb(212,198,166)] to-transparent mt-2"></div>
              <p className="text-white/70 leading-relaxed mb-6">
                Ihr exklusiver Rückzugsort für authentische Schönheit und ungestörte Momente der Pflege und Entspannung.
              </p>
            </div>

            {/* Contact */}
            <div className="md:col-span-3 md:col-start-6">
              <h3 className="font-serif text-lg mb-4 text-[rgb(212,198,166)]">Kontakt</h3>
              <address className="not-italic text-white/70 space-y-3">
                <p className="flex items-start">
                  <svg
                    className="w-5 h-5 mr-3 text-[rgb(212,198,166)] flex-shrink-0 mt-0.5"
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
                    className="w-5 h-5 mr-3 text-[rgb(212,198,166)] flex-shrink-0 mt-0.5"
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
                    className="w-5 h-5 mr-3 text-[rgb(212,198,166)] flex-shrink-0 mt-0.5"
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
              <h3 className="font-serif text-lg mb-4 text-[rgb(212,198,166)]">Öffnungszeiten</h3>
              <div className="text-white/70 space-y-3">
                <p className="flex items-start">
                  <svg
                    className="w-5 h-5 mr-3 text-[rgb(212,198,166)] flex-shrink-0 mt-0.5"
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
                    className="w-5 h-5 mr-3 text-[rgb(212,198,166)] flex-shrink-0 mt-0.5"
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
              <p className="text-white/50 text-sm">© {new Date().getFullYear()} DIE BIANCO. Alle Rechte vorbehalten.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="/impressum" className="text-white/50 text-sm hover:text-[rgb(212,198,166)] transition-colors">
                  Impressum
                </a>
                <a href="/datenschutz" className="text-white/50 text-sm hover:text-[rgb(212,198,166)] transition-colors">
                  Datenschutz
                </a>
                <a href="#" className="text-white/50 text-sm hover:text-[rgb(212,198,166)] transition-colors">
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
