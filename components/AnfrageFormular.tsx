"use client"

/**
 * components/AnfrageFormular.tsx
 * ─────────────────────────────────────────────────────────────────────────
 * Wiederverwendbares Anfrage-Formular (Briefing Abschnitt 2), schema-getrieben
 * aus lib/hubspot/schema.ts.
 *
 *   variante="standard"  Behandlung -> Kontakt (+ Nachricht) => Welle 1, fertig
 *   variante="deep"      zusätzlich Phase B (je Antwort ein PATCH => Welle 2)
 *
 *   theme="creme"        Creme/Taupe (Briefing-Standard, kein Gold)
 *   theme="dunkel"       dunkler Kasten + Gold-Buttons (bestehender Seitenstil)
 *
 *   chrome=false         ohne eigenen Kartenrahmen (zum Einbetten in eine Seite)
 *
 * Vollständig gekapselt unter `.db-formular`.
 * ─────────────────────────────────────────────────────────────────────────
 */

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import Script from "next/script"
import { FORMULAR_FELDER, FARB_BEHANDLUNGEN, optionWert, type FeldDefinition } from "@/lib/hubspot/schema"

type Phase = "behandlung" | "kontakt" | "b" | "fertig"

interface AnfrageFormularProps {
  variante?: "standard" | "deep"
  theme?: "creme" | "dunkel"
  chrome?: boolean
  /** Wenn gesetzt: nach Abschluss dorthin weiterleiten (Danke-Seite lädt →
   *  Google-Ads-Conversion-Tag feuert). Ohne: inline "fertig"-Screen. */
  dankeUrl?: string
}

interface AntwortZeile {
  frageKurz: string
  wertLabel: string
}

const BEHANDLUNG_FELD = FORMULAR_FELDER.find((f) => f.hubspotName === "wunsch_behandlung")!
const FARB_WERTE = new Set(FARB_BEHANDLUNGEN.map(optionWert))
const WHATSAPP_JA = optionWert("Ja, gerne")

const KURZ: Record<string, string> = {
  wunsch_behandlung: "Behandlung",
  haarlaenge: "Haarlänge",
  farb_vorgeschichte: "Farbe 12 Mon.",
  foto_haare: "Fotos",
  erreichbarkeit: "Erreichbar",
  whatsapp_ok: "WhatsApp",
  dringlichkeit: "Zeitrahmen",
  anmerkung_kundin: "Anmerkung",
}

export default function AnfrageFormular({
  variante = "deep",
  theme = "creme",
  chrome = true,
  dankeUrl,
}: AnfrageFormularProps) {
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""
  const isTurnstileEnabled = turnstileSiteKey.length > 0
  const istDeep = variante === "deep"

  const [phase, setPhase] = useState<Phase>("behandlung")
  const [bIndex, setBIndex] = useState(0)
  const [contactId, setContactId] = useState("")
  const [zeitBeleg, setZeitBeleg] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fehler, setFehler] = useState("")
  const [stapelOffen, setStapelOffen] = useState(false)
  const [sichtbar, setSichtbar] = useState(false)

  const [daten, setDaten] = useState<Record<string, string>>({
    wunsch_behandlung: "",
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    nachricht: "",
  })
  const [stapel, setStapel] = useState<AntwortZeile[]>([])

  const wurzelRef = useRef<HTMLElement | null>(null)
  const frageRef = useRef<HTMLDivElement | null>(null)
  const istFarbe = FARB_WERTE.has(daten.wunsch_behandlung)

  const phaseBFelder = useMemo<FeldDefinition[]>(
    () => (istDeep ? FORMULAR_FELDER.filter((f) => f.welle === 2 && (!f.nurBeiFarbe || istFarbe)) : []),
    [istFarbe, istDeep],
  )

  // Fortschritt: Behandlung(1) -> Kontakt(2) -> Phase-B-Schritte -> fertig
  const gesamtSchritte = 2 + phaseBFelder.length
  const aktuellerSchritt =
    phase === "behandlung" ? 1 : phase === "kontakt" ? 2 : phase === "b" ? 3 + bIndex : gesamtSchritte + 1

  // Einmalige Einblend-Animation, sobald das Formular in Sicht kommt (Aufmerksamkeit).
  useEffect(() => {
    const el = wurzelRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (eintraege) => {
        if (eintraege[0]?.isIntersecting) {
          setSichtbar(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const set = (name: string, value: string) => setDaten((d) => ({ ...d, [name]: value }))

  /** Aktive Karte in Sicht bringen — aber NIE an den Seitenanfang springen. */
  const sanftInSicht = () => {
    requestAnimationFrame(() => {
      const el = frageRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const drin = r.top >= 0 && r.bottom <= (window.innerHeight || document.documentElement.clientHeight)
      if (!drin) el.scrollIntoView({ block: "nearest", behavior: "smooth" })
    })
  }

  /** Abschluss: zur Danke-Seite weiterleiten (Conversion-Tag feuert) oder inline "fertig". */
  const zumAbschluss = () => {
    if (dankeUrl) {
      const name = encodeURIComponent(daten.firstname.trim())
      window.location.assign(`${dankeUrl}${dankeUrl.includes("?") ? "&" : "?"}name=${name}`)
      return
    }
    setPhase("fertig")
    sanftInSicht()
  }

  const waehleBehandlung = (label: string) => {
    set("wunsch_behandlung", optionWert(label))
    setFehler("")
    setPhase("kontakt")
    sanftInSicht()
  }

  const sendeWelle1 = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const honeypot = (form.querySelector('input[name="website"]') as HTMLInputElement | null)?.value || ""
    const turnstileToken =
      (form.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement | null)?.value || ""

    const ziffern = daten.phone.replace(/\D/g, "")
    if (!daten.firstname.trim() || !daten.email.trim() || !daten.phone.trim()) {
      setFehler("Vorname, Telefon und E-Mail sind erforderlich.")
      return
    }
    if (ziffern.length < 9) {
      setFehler("Bitte eine gültige Telefonnummer angeben.")
      return
    }
    if (isTurnstileEnabled && !turnstileToken) {
      setFehler("Bitte CAPTCHA-Validierung abschliessen.")
      return
    }

    setIsSubmitting(true)
    setFehler("")
    try {
      const extra =
        variante === "standard" && daten.nachricht.trim()
          ? { anmerkung_kundin: daten.nachricht.trim() }
          : undefined

      const res = await fetch("/api/anfrage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          welle: 1,
          firstname: daten.firstname,
          lastname: daten.lastname,
          phone: daten.phone,
          email: daten.email,
          wunsch_behandlung: daten.wunsch_behandlung,
          extra,
          honeypot,
          turnstileToken: isTurnstileEnabled ? turnstileToken : undefined,
          spamProtectionRequired: isTurnstileEnabled,
        }),
      })
      const json = (await res.json()) as { ok: boolean; contactId?: string; message?: string }
      if (!json.ok || !json.contactId) {
        setFehler(json.message || "Konnte nicht gespeichert werden.")
        return
      }
      setContactId(json.contactId)
      setZeitBeleg(new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }))
      if (phaseBFelder.length > 0) {
        setPhase("b")
        setBIndex(0)
        sanftInSicht()
      } else {
        zumAbschluss()
      }
    } catch (err) {
      console.error(err)
      setFehler("Fehler beim Senden. Bitte erneut versuchen.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const beantworte = (feld: FeldDefinition, wert: string, wertLabel: string) => {
    set(feld.hubspotName, wert)
    setStapel((s) => [...s, { frageKurz: KURZ[feld.hubspotName] || feld.label, wertLabel }])

    if (wert) {
      void fetch("/api/anfrage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ welle: 2, contactId, updates: { [feld.hubspotName]: wert } }),
      }).catch((err) => console.error("Welle 2 PATCH fehlgeschlagen:", err))
    }

    if (bIndex + 1 < phaseBFelder.length) {
      setBIndex((i) => i + 1)
      sanftInSicht()
    } else {
      zumAbschluss()
    }
  }

  const ueberspringe = (feld: FeldDefinition) => beantworte(feld, "", "übersprungen")

  const zusage = (() => {
    const err = daten.erreichbarkeit
    const zeit = err && err !== "egal" ? err : ""
    const waJa = daten.whatsapp_ok === WHATSAPP_JA
    if (err) return `Teresa ruft dich ${zeit ? zeit + " " : ""}an${waJa ? " oder schreibt dir" : ""}`
    if (waJa) return "Teresa ruft dich an oder schreibt dir"
    return "Teresa meldet sich persönlich bei dir"
  })()

  const sichtbarerStapel = stapelOffen ? stapel : stapel.slice(-3)
  const versteckt = stapel.length - sichtbarerStapel.length

  return (
    <section
      ref={wurzelRef}
      className={`db-formular${theme === "dunkel" ? " db-dunkel" : ""}${sichtbar ? " db-sichtbar" : ""}`}
      aria-label="Terminanfrage"
    >
      {isTurnstileEnabled && (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      )}

      <div className={`db-karte${chrome ? "" : " db-bare"}`}>
        {/* Kopf: Eyebrow + Fortschritts-Kreise + Schritt-Label */}
        <div className="db-kopf">
          <span className="db-eyebrow">✦ In unter 1 Minute · unverbindlich</span>
          <div className="db-fortschritt" aria-hidden="true">
            {Array.from({ length: gesamtSchritte }).map((_, i) => {
              const n = i + 1
              const cls = n < aktuellerSchritt ? "db-erledigt" : n === aktuellerSchritt ? "db-jetzt" : "db-offen"
              return (
                <span key={n} className={`db-kreis ${cls}`}>
                  {n < aktuellerSchritt ? "✓" : n}
                </span>
              )
            })}
          </div>
          <span className="db-schritt-label">
            {phase === "fertig" ? "Geschafft! 🎉" : `Schritt ${Math.min(aktuellerSchritt, gesamtSchritte)} von ${gesamtSchritte}`}
          </span>
        </div>

        {(phase === "b" || phase === "fertig") && (
          <div className="db-band" role="status">
            ✓ Deine Anfrage ist bei uns
          </div>
        )}

        {stapel.length > 0 && (
          <div className="db-stapel">
            {versteckt > 0 && (
              <button type="button" className="db-mehr" onClick={() => setStapelOffen(true)}>
                {versteckt} weitere {versteckt === 1 ? "Antwort" : "Antworten"} anzeigen
              </button>
            )}
            {sichtbarerStapel.map((z, i) => (
              <div key={i} className="db-zeile">
                <span className="db-zeile-frage">{z.frageKurz}</span>
                <span className="db-zeile-wert">{z.wertLabel}</span>
              </div>
            ))}
          </div>
        )}

        {(phase === "b" || phase === "fertig") && (
          <div className="db-zusage">
            <span>{zusage}</span>
            {zeitBeleg && <span className="db-zeit">{zeitBeleg}</span>}
          </div>
        )}

        <div className="db-frage" ref={frageRef}>
          {phase === "behandlung" && (
            <fieldset className="db-fieldset">
              <legend className="db-legende">{BEHANDLUNG_FELD.frage}</legend>
              <div className="db-optionen db-grid-2">
                {BEHANDLUNG_FELD.optionen!.map((label) => (
                  <button
                    key={label}
                    type="button"
                    className={`db-option ${daten.wunsch_behandlung === optionWert(label) ? "db-aktiv" : ""}`}
                    onClick={() => waehleBehandlung(label)}
                  >
                    <span>{label}</span>
                    <span className="db-chevron" aria-hidden="true">›</span>
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {phase === "kontakt" && (
            <form onSubmit={sendeWelle1} className="db-kontakt">
              <div aria-hidden="true" className="db-honeypot">
                <label htmlFor="db-website">Website</label>
                <input id="db-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <p className="db-legende">Wohin dürfen wir uns melden?</p>
              <div className="db-grid-2">
                <label className="db-label">
                  Vorname *
                  <input
                    className="db-input"
                    type="text"
                    required
                    autoComplete="given-name"
                    value={daten.firstname}
                    onChange={(e) => set("firstname", e.target.value)}
                  />
                </label>
                <label className="db-label">
                  Nachname
                  <input
                    className="db-input"
                    type="text"
                    autoComplete="family-name"
                    value={daten.lastname}
                    onChange={(e) => set("lastname", e.target.value)}
                  />
                </label>
              </div>
              <label className="db-label">
                Telefon *
                <input
                  className="db-input"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="+49 …"
                  value={daten.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </label>
              <label className="db-label">
                E-Mail *
                <input
                  className="db-input"
                  type="email"
                  required
                  autoComplete="email"
                  value={daten.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </label>

              {variante === "standard" && (
                <label className="db-label">
                  Nachricht
                  <textarea
                    className="db-textarea"
                    rows={4}
                    value={daten.nachricht}
                    onChange={(e) => set("nachricht", e.target.value)}
                    placeholder="Dein Anliegen (optional)"
                  />
                </label>
              )}

              {isTurnstileEnabled && (
                <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-theme={theme === "dunkel" ? "dark" : "light"} data-size="flexible" />
              )}

              <button type="submit" className="db-cta" disabled={isSubmitting}>
                {isSubmitting ? "Sende…" : "Anfrage absenden →"}
              </button>
              <p className="db-hinweis">Unverbindlich · Teresa meldet sich persönlich.</p>
            </form>
          )}

          {phase === "b" && phaseBFelder[bIndex] && (
            <FeldFrage
              feld={phaseBFelder[bIndex]}
              onWaehle={(wert, label) => beantworte(phaseBFelder[bIndex], wert, label)}
              onUeberspringen={() => ueberspringe(phaseBFelder[bIndex])}
            />
          )}

          {phase === "fertig" && (
            <div className="db-fertig">
              <div className="db-fertig-haken">✓</div>
              <p className="db-fertig-titel">Danke, {daten.firstname || "und bis gleich"} 💛</p>
              <p className="db-fertig-text">{zusage}. Du hörst zeitnah von uns.</p>
            </div>
          )}
        </div>

        {fehler && <div className="db-fehler">{fehler}</div>}
      </div>

      <style>{stil}</style>
    </section>
  )
}

function FeldFrage({
  feld,
  onWaehle,
  onUeberspringen,
}: {
  feld: FeldDefinition
  onWaehle: (wert: string, label: string) => void
  onUeberspringen: () => void
}) {
  const [text, setText] = useState("")

  if (feld.fieldType === "textarea") {
    return (
      <div className="db-fieldset">
        <p className="db-legende">{feld.frage}</p>
        {feld.hinweis && <p className="db-hinweis">{feld.hinweis}</p>}
        <textarea className="db-textarea" rows={4} value={text} onChange={(e) => setText(e.target.value)} />
        <div className="db-aktionen">
          <button type="button" className="db-cta" onClick={() => onWaehle(text.trim(), text.trim() || "—")}>
            Fertig
          </button>
          <button type="button" className="db-skip" onClick={onUeberspringen}>
            Überspringen
          </button>
        </div>
      </div>
    )
  }

  if (feld.fieldType === "file") {
    // Datei-Upload wird in Schritt 7 an die HubSpot Files API angebunden.
    return (
      <div className="db-fieldset">
        <p className="db-legende">{feld.frage}</p>
        {feld.hinweis && <p className="db-hinweis">{feld.hinweis}</p>}
        <input className="db-input" type="file" accept="image/*" multiple />
        <div className="db-aktionen">
          <button type="button" className="db-cta" onClick={() => onWaehle("", "hochgeladen")}>
            Weiter
          </button>
          <button type="button" className="db-skip" onClick={onUeberspringen}>
            Überspringen
          </button>
        </div>
      </div>
    )
  }

  return (
    <fieldset className="db-fieldset">
      <legend className="db-legende">{feld.frage}</legend>
      {feld.hinweis && <p className="db-hinweis">{feld.hinweis}</p>}
      <div className={`db-optionen ${feld.optionen && feld.optionen.length > 3 ? "db-grid-2" : ""}`}>
        {feld.optionen!.map((label) => (
          <button key={label} type="button" className="db-option" onClick={() => onWaehle(optionWert(label), label)}>
            <span>{label}</span>
            <span className="db-chevron" aria-hidden="true">›</span>
          </button>
        ))}
      </div>
    </fieldset>
  )
}

const stil = `
.db-formular {
  --db-creme: #F5F1E8;
  --db-sand: #E7DFD0;
  --db-taupe: #A89A86;
  --db-charcoal: #2C2C2C;
  --db-akzent: var(--db-taupe);
  --db-weiss: #ffffff;
  --db-radius: 12px;
  --db-cta-bg: var(--db-akzent);
  --db-cta-text: #ffffff;
  color: var(--db-charcoal);
  font-size: 16px;
  line-height: 1.5;
  max-width: 640px;
  margin: 0 auto;
}
/* Einblenden beim Reinscrollen — Standard ist SICHTBAR; Animation läuft nur zusätzlich,
   wenn per JS als sichtbar markiert. So bleibt bei JS-Ausfall nichts versteckt. */
.db-sichtbar .db-karte { animation: db-entrance .5s ease; }
@keyframes db-entrance { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
/* Dunkles Theme: dunkler Kasten + Gold-Buttons (bestehender Seitenstil) */
.db-formular.db-dunkel {
  --db-creme: rgba(0,0,0,0.2);
  --db-sand: rgba(255,255,255,0.12);
  --db-taupe: rgba(255,255,255,0.7);
  --db-charcoal: #ffffff;
  --db-akzent: #D4C6A6;
  --db-weiss: rgba(0,0,0,0.2);
  --db-cta-bg: linear-gradient(to right, #D4C6A6, #B8A082);
  --db-cta-text: #ffffff;
}
.db-formular * { box-sizing: border-box; }
.db-karte {
  background: var(--db-creme);
  border: 1px solid var(--db-sand);
  border-radius: var(--db-radius);
  padding: 24px;
}
.db-karte.db-bare { background: transparent; border: none; border-radius: 0; padding: 0; }
/* Kopf mit Fortschritt */
.db-kopf { display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px; }
.db-eyebrow {
  align-self: flex-start; font-size: 12px; letter-spacing: .05em; text-transform: uppercase;
  color: var(--db-akzent); border: 1px solid var(--db-sand); border-radius: 999px; padding: 4px 12px;
}
.db-fortschritt { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.db-kreis {
  width: 28px; height: 28px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 600; border: 2px solid var(--db-sand); color: var(--db-taupe);
  background: transparent; transition: background .2s, border-color .2s, color .2s;
}
.db-kreis.db-erledigt { background: var(--db-akzent); border-color: var(--db-akzent); color: var(--db-cta-text); }
.db-kreis.db-jetzt { border-color: var(--db-akzent); color: var(--db-charcoal); box-shadow: 0 0 0 3px color-mix(in srgb, var(--db-akzent) 25%, transparent); }
.db-schritt-label { font-size: 13px; color: var(--db-taupe); }
.db-band {
  background: var(--db-sand); color: var(--db-charcoal); border-radius: 999px;
  padding: 8px 16px; font-size: 14px; margin-bottom: 16px;
}
.db-stapel { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
.db-zeile {
  display: flex; justify-content: space-between; gap: 12px;
  background: var(--db-weiss); border: 1px solid var(--db-sand);
  border-radius: 8px; padding: 8px 12px; font-size: 14px;
  animation: db-rein .25s ease;
}
@keyframes db-rein { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
.db-zeile-frage { color: var(--db-taupe); }
.db-zeile-wert { font-weight: 600; text-align: right; }
.db-mehr {
  background: none; border: none; color: var(--db-taupe);
  font-size: 13px; text-decoration: underline; cursor: pointer; padding: 4px 0; text-align: left;
}
.db-zusage {
  display: flex; justify-content: space-between; align-items: baseline; gap: 12px;
  border-top: 1px dashed var(--db-taupe); padding-top: 12px; margin-bottom: 16px;
  font-style: italic; color: var(--db-charcoal);
}
.db-zeit { font-size: 12px; color: var(--db-taupe); font-style: normal; }
.db-frage { min-height: 400px; }
@media (min-width: 640px) { .db-frage { min-height: 340px; } }
.db-fieldset { border: none; padding: 0; margin: 0; }
.db-legende { font-size: 20px; font-weight: 600; margin: 0 0 12px; padding: 0; color: var(--db-charcoal); }
.db-hinweis { font-size: 13px; color: var(--db-taupe); margin: 0 0 12px; }
.db-optionen { display: grid; grid-template-columns: 1fr; gap: 10px; }
.db-grid-2 { grid-template-columns: 1fr 1fr; }
@media (max-width: 420px) { .db-grid-2 { grid-template-columns: 1fr; } }
.db-option {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  background: var(--db-weiss); border: 1px solid var(--db-sand);
  border-radius: 10px; padding: 14px 16px; font-size: 16px; text-align: left;
  cursor: pointer; transition: border-color .15s, background .15s, transform .1s;
  color: var(--db-charcoal); width: 100%;
}
.db-option:hover { border-color: var(--db-akzent); transform: translateY(-1px); }
.db-option.db-aktiv { border-color: var(--db-akzent); background: var(--db-sand); }
.db-chevron { color: var(--db-akzent); font-size: 20px; line-height: 1; flex-shrink: 0; }
.db-kontakt { display: flex; flex-direction: column; gap: 14px; }
.db-label { display: flex; flex-direction: column; gap: 6px; font-size: 14px; color: var(--db-charcoal); }
.db-input, .db-textarea {
  font-size: 16px; padding: 12px 14px; border: 1px solid var(--db-sand);
  border-radius: 10px; background: var(--db-weiss); color: var(--db-charcoal); width: 100%;
}
.db-textarea { resize: vertical; }
.db-input::placeholder, .db-textarea::placeholder { color: var(--db-taupe); }
.db-input:focus, .db-textarea:focus, .db-option:focus-visible, .db-cta:focus-visible, .db-skip:focus-visible {
  outline: 2px solid var(--db-akzent); outline-offset: 2px;
}
.db-cta {
  background: var(--db-cta-bg); color: var(--db-cta-text); border: none;
  border-radius: 999px; padding: 14px 20px; font-size: 16px; font-weight: 600;
  cursor: pointer; transition: filter .15s, transform .1s;
}
.db-cta:hover { filter: brightness(0.95); transform: translateY(-1px); }
.db-cta:disabled { opacity: .6; cursor: default; transform: none; }
.db-skip { background: none; border: none; color: var(--db-taupe); cursor: pointer; font-size: 14px; text-decoration: underline; }
.db-aktionen { display: flex; align-items: center; gap: 16px; margin-top: 14px; }
.db-fehler {
  margin-top: 14px; padding: 10px 14px; border-radius: 10px;
  background: rgba(179,38,30,0.12); color: #ff6b6b; font-size: 14px; border: 1px solid rgba(179,38,30,0.3);
}
.db-fertig { text-align: center; padding: 16px 0; }
.db-fertig-haken {
  width: 56px; height: 56px; border-radius: 999px; margin: 0 auto 14px;
  display: flex; align-items: center; justify-content: center; font-size: 28px;
  background: var(--db-akzent); color: var(--db-cta-text); animation: db-pop .3s ease;
}
@keyframes db-pop { 0% { transform: scale(0.6); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
.db-fertig-titel { font-size: 22px; font-weight: 600; margin: 0 0 8px; color: var(--db-charcoal); }
.db-fertig-text { color: var(--db-charcoal); margin: 0; }
.db-honeypot { position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden; }
@media (prefers-reduced-motion: reduce) {
  .db-formular, .db-option, .db-cta, .db-kreis, .db-zeile, .db-fertig-haken, .db-sichtbar .db-karte { transition: none; animation: none; }
}
`
