"use client"

/**
 * components/AnfrageFormular.tsx
 * ─────────────────────────────────────────────────────────────────────────
 * Wiederverwendbares Anfrage-Formular (Briefing Abschnitt 2), schema-getrieben
 * aus lib/hubspot/schema.ts.
 *
 *   variante="standard"  Behandlung -> schlanker Kontakt (Name, Handy, opt. Mail,
 *                        Wunschzeitraum) => Welle 1, fertig
 *   variante="deep"      zusätzlich Phase B (je Antwort ein PATCH => Welle 2)
 *
 *   theme="creme"        Creme/Taupe (kein Gold)
 *   theme="dunkel"       dunkler Kasten + Gold-Buttons
 *   theme="hell"         helle Karte + Gold-Akzent (Ad-Landingpage /kontakt)
 *
 *   chrome=false         ohne eigenen Kartenrahmen (zum Einbetten)
 *   dankeUrl             nach Abschluss dorthin weiterleiten (Conversion-Tag)
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
  theme?: "creme" | "dunkel" | "hell"
  chrome?: boolean
  dankeUrl?: string
  /** Behandlung vorauswählen (z. B. "Grey Blending") → Schritt 1 wird übersprungen. */
  vorauswahlBehandlung?: string
}

// Foto-Upload ist noch nicht an die HubSpot Files API angebunden (Roadmap-Schritt).
// Bis dahin wird der Foto-Schritt aus Phase B ausgeblendet, statt einen
// nicht-funktionierenden Datei-Upload zu zeigen.
const FOTO_UPLOAD_AKTIV = false

interface AntwortZeile {
  frageKurz: string
  wertLabel: string
}

const BEHANDLUNG_FELD = FORMULAR_FELDER.find((f) => f.hubspotName === "wunsch_behandlung")!
const ZEITRAUM_FELD = FORMULAR_FELDER.find((f) => f.hubspotName === "wunschzeitraum")
const FARB_WERTE = new Set(FARB_BEHANDLUNGEN.map(optionWert))
const WHATSAPP_JA = optionWert("Ja, gerne")
const UNSICHER = optionWert("Weiß ich noch nicht")

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

function Sterne({ className = "" }: { className?: string }) {
  return (
    <span className={`db-sterne ${className}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 20 20">
          <path d="M10 1.6l2.47 5.006 5.526.803-4 3.9.944 5.503L10 14.2l-4.94 2.612.944-5.503-4-3.9 5.526-.803L10 1.6z" />
        </svg>
      ))}
    </span>
  )
}

export default function AnfrageFormular({
  variante = "deep",
  theme = "creme",
  chrome = true,
  dankeUrl,
  vorauswahlBehandlung,
}: AnfrageFormularProps) {
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""
  const isTurnstileEnabled = turnstileSiteKey.length > 0
  const istDeep = variante === "deep"
  const vorauswahlWert = vorauswahlBehandlung ? optionWert(vorauswahlBehandlung) : ""
  const vorausgewaehlt = Boolean(vorauswahlWert)

  const [phase, setPhase] = useState<Phase>(vorausgewaehlt ? "kontakt" : "behandlung")
  const [bIndex, setBIndex] = useState(0)
  const [contactId, setContactId] = useState("")
  const [zeitBeleg, setZeitBeleg] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fehler, setFehler] = useState("")
  const [stapelOffen, setStapelOffen] = useState(false)
  const [sichtbar, setSichtbar] = useState(false)

  const [daten, setDaten] = useState<Record<string, string>>({
    wunsch_behandlung: vorauswahlWert,
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    wunschzeitraum: "",
  })
  const [stapel, setStapel] = useState<AntwortZeile[]>([])

  const wurzelRef = useRef<HTMLElement | null>(null)
  const frageRef = useRef<HTMLDivElement | null>(null)
  const istFarbe = FARB_WERTE.has(daten.wunsch_behandlung)

  const phaseBFelder = useMemo<FeldDefinition[]>(
    () =>
      istDeep
        ? FORMULAR_FELDER.filter(
            (f) =>
              f.welle === 2 &&
              (!f.nurBeiFarbe || istFarbe) &&
              (FOTO_UPLOAD_AKTIV || f.fieldType !== "file"),
          )
        : [],
    [istFarbe, istDeep],
  )

  const kontaktSchritt = vorausgewaehlt ? 1 : 2
  const gesamtSchritte = kontaktSchritt + phaseBFelder.length
  const aktuellerSchritt =
    phase === "behandlung"
      ? 1
      : phase === "kontakt"
        ? kontaktSchritt
        : phase === "b"
          ? kontaktSchritt + 1 + bIndex
          : gesamtSchritte + 1

  // Deep: Fortschritt erst NACH dem Kontakt-Schritt zeigen (davor wirkt "X/7"
  // abschreckend; der Lead ist ohnehin erst mit Welle 1 gesichert).
  const zeigeFortschritt = variante === "standard" || phase === "b" || phase === "fertig"

  const gewaehlteBehandlung = BEHANDLUNG_FELD.optionen!.find((l) => optionWert(l) === daten.wunsch_behandlung) || ""

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

  const sanftInSicht = () => {
    requestAnimationFrame(() => {
      const el = frageRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const drin = r.top >= 0 && r.bottom <= (window.innerHeight || document.documentElement.clientHeight)
      if (!drin) el.scrollIntoView({ block: "nearest", behavior: "smooth" })
    })
  }

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
    if (!daten.firstname.trim() || !daten.phone.trim() || !daten.email.trim()) {
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
      const extra: Record<string, string> = {}
      if (variante === "standard" && daten.wunschzeitraum) extra.wunschzeitraum = daten.wunschzeitraum

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
          extra: Object.keys(extra).length ? extra : undefined,
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

  const themeClass = theme === "dunkel" ? " db-dunkel" : theme === "hell" ? " db-hell" : ""

  return (
    <section
      ref={wurzelRef}
      className={`db-formular${themeClass}${sichtbar ? " db-sichtbar" : ""}`}
      aria-label="Terminanfrage"
    >
      {isTurnstileEnabled && (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      )}

      <div className={`db-karte${chrome ? "" : " db-bare"}`}>
        {/* Kopf: Fortschritt + Rating */}
        <div className="db-kopf">
          <div className="db-kopf-zeile">
            <span className="db-eyebrow">
              {istDeep ? "✦ Unverbindlich · Antwort in 24h" : "✦ In unter 1 Minute · unverbindlich"}
            </span>
            <span className="db-rating">
              <Sterne />
              <strong>5,0</strong> · 37 bei Google
            </span>
          </div>
          {zeigeFortschritt && (
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
              <span className="db-schritt-label">
                {phase === "fertig"
                  ? "Geschafft! 🎉"
                  : istDeep && phase === "b"
                    ? "Freiwillig – nur noch kurze Fragen"
                    : `Schritt ${Math.min(aktuellerSchritt, gesamtSchritte)}/${gesamtSchritte}`}
              </span>
            </div>
          )}
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
                {BEHANDLUNG_FELD.optionen!.map((label) => {
                  const wert = optionWert(label)
                  const aktiv = daten.wunsch_behandlung === wert
                  const ghost = wert === UNSICHER
                  return (
                    <button
                      key={label}
                      type="button"
                      className={`db-option${aktiv ? " db-aktiv" : ""}${ghost ? " db-ghost" : ""}`}
                      onClick={() => waehleBehandlung(label)}
                    >
                      <span>{label}</span>
                      <span className="db-icon" aria-hidden="true">{aktiv ? "✓" : "›"}</span>
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )}

          {phase === "kontakt" && (
            <form onSubmit={sendeWelle1} className="db-kontakt">
              <div aria-hidden="true" className="db-honeypot">
                <label htmlFor="db-website">Website</label>
                <input id="db-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              {gewaehlteBehandlung && !vorausgewaehlt && (
                <div className="db-gewaehlt">
                  <span><strong>{gewaehlteBehandlung}</strong> ausgewählt</span>
                  <button type="button" className="db-aendern" onClick={() => setPhase("behandlung")}>
                    ändern
                  </button>
                </div>
              )}

              <p className="db-legende">Wohin dürfen wir uns melden?</p>
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
              {variante === "deep" && (
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
              )}
              <label className="db-label">
                Handynummer *
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

              {variante === "standard" && ZEITRAUM_FELD?.optionen && (
                <div className="db-label">
                  <span>Wann passt es dir? <span className="db-optional">(optional)</span></span>
                  <div className="db-chips">
                    {ZEITRAUM_FELD.optionen.map((label) => {
                      const wert = optionWert(label)
                      const aktiv = daten.wunschzeitraum === wert
                      return (
                        <button
                          key={label}
                          type="button"
                          className={`db-chip${aktiv ? " db-chip-aktiv" : ""}`}
                          onClick={() => set("wunschzeitraum", aktiv ? "" : wert)}
                        >
                          {label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {isTurnstileEnabled && (
                <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-theme={theme === "dunkel" ? "dark" : "light"} data-size="flexible" />
              )}

              <button type="submit" className="db-cta" disabled={isSubmitting}>
                {isSubmitting ? "Sende…" : variante === "standard" ? "Wunschtermin unverbindlich anfragen" : "Anfrage absenden →"}
              </button>
              <p className="db-microcopy">Antwort innerhalb von 24h – meist schneller.</p>

              {variante === "standard" && (
                <div className="db-vertrauen">
                  <p className="db-vertrauen-zitat">„Ich melde mich persönlich bei dir – versprochen."</p>
                  <p className="db-vertrauen-name">– Teresa Bianco</p>
                  <ul className="db-vertrauen-liste">
                    <li>✓ Persönliche Beratung</li>
                    <li>✓ Antwort innerhalb von 24h</li>
                    <li>✓ Keine Verpflichtung</li>
                  </ul>
                </div>
              )}
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
            <span className="db-icon" aria-hidden="true">›</span>
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
  --db-taupe: #8a7d6a;
  --db-charcoal: #2C2C2C;
  --db-akzent: var(--db-taupe);
  --db-weiss: #ffffff;
  --db-radius: 14px;
  --db-cta-bg: var(--db-akzent);
  --db-cta-text: #ffffff;
  color: var(--db-charcoal);
  font-size: 16px;
  line-height: 1.5;
  max-width: 640px;
  margin: 0 auto;
}
.db-sichtbar .db-karte { animation: db-entrance .5s ease; }
@keyframes db-entrance { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
.db-formular.db-dunkel {
  --db-creme: rgba(0,0,0,0.2);
  --db-sand: rgba(255,255,255,0.14);
  --db-taupe: rgba(255,255,255,0.72);
  --db-charcoal: #ffffff;
  --db-akzent: #D4C6A6;
  --db-weiss: rgba(0,0,0,0.2);
  --db-cta-bg: linear-gradient(to right, #D4C6A6, #B8A082);
  --db-cta-text: #ffffff;
}
/* Helles Ad-Landing-Theme: helle Karte, Gold-Akzent, dunkler Text */
.db-formular.db-hell {
  --db-creme: #ffffff;
  --db-sand: #E4DCC9;
  --db-taupe: #5b5346;
  --db-charcoal: #2C2C2C;
  --db-akzent: #B8863D;
  --db-weiss: #FBF8F1;
  --db-cta-bg: linear-gradient(to right, #C6A15B, #B8863D);
  --db-cta-text: #ffffff;
}
.db-formular * { box-sizing: border-box; }
.db-karte { background: var(--db-creme); border: 1px solid var(--db-sand); border-radius: var(--db-radius); padding: 24px; }
.db-karte.db-bare { background: transparent; border: none; border-radius: 0; padding: 0; }
.db-kopf { display: flex; flex-direction: column; gap: 12px; margin-bottom: 18px; }
.db-kopf-zeile { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; }
.db-eyebrow { font-size: 12px; letter-spacing: .05em; text-transform: uppercase; color: var(--db-akzent); border: 1px solid var(--db-sand); border-radius: 999px; padding: 4px 12px; }
.db-rating { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--db-taupe); }
.db-rating strong { color: var(--db-charcoal); }
.db-sterne { display: inline-flex; gap: 1px; color: #E4A93C; }
.db-sterne svg { width: 15px; height: 15px; fill: currentColor; }
.db-fortschritt { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.db-kreis { width: 26px; height: 26px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; border: 2px solid var(--db-sand); color: var(--db-taupe); background: transparent; }
.db-kreis.db-erledigt { background: var(--db-akzent); border-color: var(--db-akzent); color: var(--db-cta-text); }
.db-kreis.db-jetzt { border-color: var(--db-akzent); color: var(--db-charcoal); box-shadow: 0 0 0 3px color-mix(in srgb, var(--db-akzent) 25%, transparent); }
.db-schritt-label { font-size: 13px; color: var(--db-taupe); margin-left: 4px; }
.db-band { background: var(--db-sand); color: var(--db-charcoal); border-radius: 999px; padding: 8px 16px; font-size: 14px; margin-bottom: 16px; }
.db-stapel { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
.db-zeile { display: flex; justify-content: space-between; gap: 12px; background: var(--db-weiss); border: 1px solid var(--db-sand); border-radius: 8px; padding: 8px 12px; font-size: 14px; animation: db-rein .25s ease; }
@keyframes db-rein { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
.db-zeile-frage { color: var(--db-taupe); }
.db-zeile-wert { font-weight: 600; text-align: right; }
.db-mehr { background: none; border: none; color: var(--db-taupe); font-size: 13px; text-decoration: underline; cursor: pointer; padding: 4px 0; text-align: left; min-height: 44px; }
.db-zusage { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; border-top: 1px dashed var(--db-taupe); padding-top: 12px; margin-bottom: 16px; font-style: italic; color: var(--db-charcoal); }
.db-zeit { font-size: 12px; color: var(--db-taupe); font-style: normal; }
.db-frage { min-height: 380px; }
@media (min-width: 640px) { .db-frage { min-height: 320px; } }
.db-fieldset { border: none; padding: 0; margin: 0; }
.db-legende { font-size: 20px; font-weight: 600; margin: 0 0 14px; padding: 0; color: var(--db-charcoal); }
.db-hinweis { font-size: 13px; color: var(--db-taupe); margin: 0 0 12px; }
.db-optionen { display: grid; grid-template-columns: 1fr; gap: 10px; }
.db-grid-2 { grid-template-columns: 1fr 1fr; }
@media (max-width: 460px) { .db-grid-2 { grid-template-columns: 1fr; } }
.db-option { display: flex; align-items: center; justify-content: space-between; gap: 10px; min-height: 52px; background: var(--db-weiss); border: 1.5px solid var(--db-sand); border-radius: 12px; padding: 14px 16px; font-size: 16px; font-weight: 500; text-align: left; cursor: pointer; transition: border-color .15s, background .15s, transform .1s, color .15s; color: var(--db-charcoal); width: 100%; }
.db-option:hover { border-color: var(--db-akzent); transform: translateY(-1px); }
.db-option.db-aktiv { border-color: var(--db-akzent); background: var(--db-akzent); color: var(--db-cta-text); }
.db-option.db-ghost { background: transparent; color: var(--db-taupe); font-weight: 400; }
.db-option.db-ghost:hover { border-color: var(--db-akzent); color: var(--db-charcoal); }
.db-icon { color: var(--db-akzent); font-size: 20px; line-height: 1; flex-shrink: 0; }
.db-option.db-aktiv .db-icon { color: var(--db-cta-text); }
.db-gewaehlt { display: flex; align-items: center; justify-content: space-between; gap: 8px; background: var(--db-weiss); border: 1px solid var(--db-sand); border-radius: 10px; padding: 10px 14px; font-size: 14px; }
.db-aendern { background: none; border: none; color: var(--db-akzent); text-decoration: underline; cursor: pointer; font-size: 14px; min-height: 44px; }
.db-kontakt { display: flex; flex-direction: column; gap: 14px; }
.db-label { display: flex; flex-direction: column; gap: 6px; font-size: 14px; font-weight: 500; color: var(--db-charcoal); }
.db-optional { color: var(--db-taupe); font-weight: 400; }
.db-input, .db-textarea { font-size: 16px; min-height: 48px; padding: 12px 14px; border: 1.5px solid var(--db-sand); border-radius: 10px; background: var(--db-weiss); color: var(--db-charcoal); width: 100%; }
.db-textarea { resize: vertical; min-height: 96px; }
.db-input::placeholder, .db-textarea::placeholder { color: var(--db-taupe); }
.db-input:focus, .db-textarea:focus, .db-option:focus-visible, .db-cta:focus-visible, .db-skip:focus-visible, .db-chip:focus-visible { outline: 2px solid var(--db-akzent); outline-offset: 2px; }
.db-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.db-chip { min-height: 44px; padding: 8px 16px; border-radius: 999px; border: 1.5px solid var(--db-sand); background: var(--db-weiss); color: var(--db-charcoal); font-size: 14px; font-weight: 500; cursor: pointer; transition: all .15s; }
.db-chip:hover { border-color: var(--db-akzent); }
.db-chip-aktiv { background: var(--db-akzent); border-color: var(--db-akzent); color: var(--db-cta-text); }
.db-cta { background: var(--db-cta-bg); color: var(--db-cta-text); border: none; border-radius: 999px; min-height: 52px; padding: 14px 20px; font-size: 16px; font-weight: 700; cursor: pointer; transition: filter .15s, transform .1s; box-shadow: 0 8px 20px -8px rgba(0,0,0,.35); }
.db-cta:hover { filter: brightness(1.03); transform: translateY(-1px); }
.db-cta:disabled { opacity: .6; cursor: default; transform: none; }
.db-microcopy { font-size: 13px; color: var(--db-taupe); text-align: center; margin: 0; }
.db-skip { background: none; border: none; color: var(--db-taupe); cursor: pointer; font-size: 14px; text-decoration: underline; min-height: 44px; }
.db-aktionen { display: flex; align-items: center; gap: 16px; margin-top: 14px; }
.db-vertrauen { margin-top: 6px; border-top: 1px solid var(--db-sand); padding-top: 14px; }
.db-vertrauen-zitat { font-style: italic; color: var(--db-charcoal); margin: 0; }
.db-vertrauen-name { color: var(--db-akzent); font-size: 14px; margin: 2px 0 10px; }
.db-vertrauen-liste { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; font-size: 14px; color: var(--db-taupe); }
.db-fehler { margin-top: 14px; padding: 10px 14px; border-radius: 10px; background: rgba(179,38,30,0.1); color: #b3261e; font-size: 14px; border: 1px solid rgba(179,38,30,0.25); }
.db-fertig { text-align: center; padding: 16px 0; }
.db-fertig-haken { width: 56px; height: 56px; border-radius: 999px; margin: 0 auto 14px; display: flex; align-items: center; justify-content: center; font-size: 28px; background: var(--db-akzent); color: var(--db-cta-text); animation: db-pop .3s ease; }
@keyframes db-pop { 0% { transform: scale(0.6); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
.db-fertig-titel { font-size: 22px; font-weight: 600; margin: 0 0 8px; color: var(--db-charcoal); }
.db-fertig-text { color: var(--db-charcoal); margin: 0; }
.db-honeypot { position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden; }
@media (prefers-reduced-motion: reduce) {
  .db-option, .db-cta, .db-kreis, .db-zeile, .db-fertig-haken, .db-chip, .db-sichtbar .db-karte { transition: none; animation: none; }
}
`
