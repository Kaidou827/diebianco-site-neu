"use client"

import type React from "react"
import Image from "next/image"
import Script from "next/script"
import Navigation from "@/components/Navigation"
import { Mail, MapPin, Phone, Clock, CheckCircle } from "lucide-react"
import { useState } from "react"
import SiteFooter from "@/components/SiteFooter"

export default function GreyBlendingBeratungPage() {
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""
  const isTurnstileEnabled = turnstileSiteKey.length > 0

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
    const honeypotValue = (form.querySelector('input[name="website"]') as HTMLInputElement | null)?.value || ""
    const turnstileToken =
      (form.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement | null)?.value || ""
    setIsSubmitting(true)
    setSubmitMessage("Sende...")

    try {
      if (!formData.firstname || !formData.email || !formData.phone) {
        setSubmitMessage("Name, E-Mail und Telefon sind erforderlich.")
        setIsSubmitting(false)
        return
      }

      if (isTurnstileEnabled && !turnstileToken) {
        setSubmitMessage("Bitte CAPTCHA-Validierung abschliessen.")
        setIsSubmitting(false)
        return
      }

      let hutk = ""
      try {
        const hubspotCookie = document.cookie.split("; ").find((row) => row.startsWith("hubspotutk="))
        if (hubspotCookie) {
          hutk = hubspotCookie.split("=")[1]
        }
      } catch (error) {
        console.log("Could not get HubSpot cookie:", error)
      }

      const payload = {
        firstname: formData.firstname,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        pageUri: window.location.href,
        pageName: document.title,
        hutk: hutk || undefined,
        wunschleistung: "Grey Blending",
        honeypot: honeypotValue,
        turnstileToken: isTurnstileEnabled ? turnstileToken : undefined,
        spamProtectionRequired: isTurnstileEnabled,
      }

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
      }

      setSubmitMessage(json.message || "Fehler beim Senden der Nachricht.")
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitMessage("Fehler beim Senden der Nachricht.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-[#b4b1aa] text-white min-h-screen">
      {isTurnstileEnabled && (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      )}
      <Navigation />

      <section className="py-16 md:py-20 bg-[#b4b1aa] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="font-serif text-3xl md:text-5xl tracking-tight mb-6 leading-tight">
              Deine persönliche <span className="text-[rgb(212,198,166)]">Grey-Blending-Beratung</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
              Vereinbare jetzt deinen Termin - Teresa berät dich persönlich und unverbindlich.
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-10 text-center">
            <p className="inline-flex items-center justify-center rounded-full bg-white/70 px-5 py-2 text-sm md:text-base text-[#2C2C2C]">
              <span className="text-[#D4C6A6] mr-2">⭐⭐⭐⭐⭐</span>
              5,0 von 5 Sternen bei Google
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-10">
            <div className="grid grid-cols-1 gap-6 justify-items-center">
              <div className="w-full max-w-[480px] rounded-md border border-white/10 bg-black/15 p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="relative h-52 rounded-md overflow-hidden">
                      <Image src="/ergebnisse/look01-vorher.webp" alt="Grey Blending Vorher" fill className="object-cover" />
                    </div>
                    <p className="mt-2 text-center text-sm text-[#D4C6A6]">Vorher</p>
                  </div>
                  <div>
                    <div className="relative h-52 rounded-md overflow-hidden">
                      <Image src="/ergebnisse/look01-nachher.webp" alt="Grey Blending Nachher" fill className="object-cover" />
                    </div>
                    <p className="mt-2 text-center text-sm text-[#D4C6A6]">Nachher</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
              <div className="w-full rounded-md border border-white/10 bg-black/20 p-5 text-center">
                <p className="text-[#D4C6A6] text-sm mb-2">Kundin aus Krefeld · ★★★★★</p>
                <p className="text-white/90 text-sm leading-relaxed">
                  &quot;Ich wollte mein Grau nicht mehr verstecken - jetzt sieht es modern, weich und absolut stimmig
                  aus. Ich fühle mich wieder wie ich selbst.&quot;
                </p>
              </div>
              <div className="w-full rounded-md border border-white/10 bg-black/20 p-5 text-center">
                <p className="text-[#D4C6A6] text-sm mb-2">Stammkundin · ★★★★★</p>
                <p className="text-white/90 text-sm leading-relaxed">
                  &quot;Das Ergebnis ist natürlich, elegant und super pflegeleicht. Genau die Beratung, die ich mir
                  gewünscht habe.&quot;
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            <div
              id="kontakt-formular"
              className="lg:col-span-3 backdrop-blur-md bg-black/20 rounded-md p-8 md:p-10 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.1)] border border-white/10"
            >
              <div className="mb-6 rounded-md border border-white/10 bg-black/25 p-4">
                <p className="text-sm text-white/80 mb-3">Du erreichst uns Mo–Fr von 09:00 bis 17:00 Uhr und Sa von 07:00 bis 14:00 Uhr.</p>
                <a
                  href="tel:+491743091973"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] transition-all duration-300"
                >
                  Lieber anrufen? +49 174 3091973
                </a>
              </div>
              <h3 className="font-serif text-2xl mb-2 text-white">Termin anfragen - wir melden uns innerhalb von 24 Stunden.</h3>
              <p className="text-white/80 mb-8">Einfach Formular ausfüllen, Teresa meldet sich persönlich bei dir.</p>

              <form onSubmit={onSubmit} className="space-y-6">
                <input type="hidden" name="wunschleistung" value="Grey Blending" />
                <div aria-hidden="true" className="absolute -left-[10000px] top-auto w-px h-px overflow-hidden">
                  <label htmlFor="website-beratung">Website</label>
                  <input id="website-beratung" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>

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

                {isTurnstileEnabled && (
                  <div
                    className="cf-turnstile"
                    data-sitekey={turnstileSiteKey}
                    data-theme="light"
                    data-size="flexible"
                  />
                )}

                <div className="rounded-md border border-white/10 bg-black/25 p-4">
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

            <div className="lg:col-span-2">
              <h2 className="font-serif text-2xl md:text-3xl tracking-tight mb-6 text-white">Kontaktinformationen</h2>

              <div className="space-y-6">
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

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 rounded-md">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg mb-1 text-white">Öffnungszeiten</h3>
                    <div className="text-white/80 space-y-1">
                      <p>Mo - Fr: 09:00 - 17:00 Uhr</p>
                      <p>Sa: 07:00 - 14:00 Uhr</p>
                      <p>So: Geschlossen</p>
                      <p className="text-sm italic mt-2">Termine nach Vereinbarung</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto mt-14">
            <div className="rounded-md border border-white/10 bg-black/20 p-6 md:p-8">
              <h2 className="font-serif text-2xl text-white text-center mb-6">Häufige Fragen</h2>
              <div className="space-y-5">
                <div>
                  <h3 className="text-[#D4C6A6] font-semibold mb-1">Wie lange dauert ein Grey-Blending-Termin?</h3>
                  <p className="text-white/85 text-sm">Je nach Ausgangslage meist zwischen 2 und 4 Stunden inklusive Beratung und Finish.</p>
                </div>
                <div>
                  <h3 className="text-[#D4C6A6] font-semibold mb-1">Wie oft muss ich nachfärben?</h3>
                  <p className="text-white/85 text-sm">Viele Kundinnen kommen in größeren Intervallen, da der Übergang bewusst weich und natürlich aufgebaut wird.</p>
                </div>
                <div>
                  <h3 className="text-[#D4C6A6] font-semibold mb-1">Was kostet Grey Blending?</h3>
                  <p className="text-white/85 text-sm">Der Preis hängt von Haarlänge, Ausgangston und Ziel ab. Du bekommst vorab eine persönliche Einschätzung.</p>
                </div>
                <div>
                  <h3 className="text-[#D4C6A6] font-semibold mb-1">Für wen ist Grey Blending geeignet?</h3>
                  <p className="text-white/85 text-sm">Ideal für alle, die graues Haar elegant integrieren und einen modernen, pflegeleichten Look möchten.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      <SiteFooter />
    </div>
  )
}
