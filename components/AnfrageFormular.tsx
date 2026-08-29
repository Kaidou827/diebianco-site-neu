"use client"

/**
 * components/AnfrageFormular.tsx
 * ─────────────────────────────────────────────────────────────────────────
 * Zweiphasiges Anfrage-Formular (Briefing Abschnitt 2). Schema-getrieben aus
 * lib/hubspot/schema.ts.
 *
 *   Phase A (verbindlich): Behandlung -> Kontakt  => Welle 1 (Lead gesichert)
 *   Phase B (freiwillig):  je Antwort ein PATCH    => Welle 2
 *
 * Vollständig gekapselt unter `.db-formular` — kein globaler Reset, keine
 * Farbvariablen an :root, keine Schriftzuweisung nach außen.
 * Design: Creme / Sand / Taupe / Charcoal. KEIN Gold (Markenentscheidung).
 * ─────────────────────────────────────────────────────────────────────────
 */

import type React from "react"
import { useMemo, useRef, useState } from "react"
import Script from "next/script"
import { FORMULAR_FELDER, FARB_BEHANDLUNGEN, optionWert, type FeldDefinition } from "@/lib/hubspot/schema"

type Phase = "behandlung" | "kontakt" | "b" | "fertig"

interface AntwortZeile {
  frageKurz: string
  wertLabel: string
}

const BEHANDLUNG_FELD = FORMULAR_FELDER.find((f) => f.hubspotName === "wunsch_behandlung")!
const FARB_WERTE = new Set(FARB_BEHANDLUNGEN.map(optionWert))
const WHATSAPP_JA = optionWert("Ja, gerne")

/** Kurzform der Frage für den Antwort-Stapel. */
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

export default function AnfrageFormular() {
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""
  const isTurnstileEnabled = turnstileSiteKey.length > 0

  const [phase, setPhase] = useState<Phase>("behandlung")
  const [bIndex, setBIndex] = useState(0)
  const [contactId, setContactId] = useState("")
  const [zeitBeleg, setZeitBeleg] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fehler, setFehler] = useState("")
  const [stapelOffen, setStapelOffen] = useState(false)

  const [daten, setDaten] = useState<Record<string, string>>({
    wunsch_behandlung: "",
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
  })
  const [stapel, setStapel] = useState<AntwortZeile[]>([])

  const frageRef = useRef<HTMLDivElement | null>(null)

  const istFarbe = FARB_WERTE.has(daten.wunsch_behandlung)

  // Phase-B-Schritte schema-getrieben; Farb-Zweige nur bei Farbwunsch.
  const phaseBFelder = useMemo<FeldDefinition[]>(
    () => FORMULAR_FELDER.filter((f) => f.welle === 2 && (!f.nurBeiFarbe || istFarbe)),
    [istFarbe],
  )

  const set = (name: string, value: string) => setDaten((d) => ({ ...d, [name]: value }))

  /** Aktive Karte in Sicht bringen — aber NIE an den Seitenanfang springen. */
  const sanftInSicht = () => {
    requestAnimationFrame(() => {
      const el = frageRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const sichtbar = r.top >= 0 && r.bottom <= (window.innerHeight || document.documentElement.clientHeight)
      if (!sichtbar) el.scrollIntoView({ block: "nearest", behavior: "smooth" })
    })
  }

  // ── Phase A · Schritt 1: Behandlung wählen ────────────────────────────────
  const waehleBehandlung = (label: string) => {
    set("wunsch_behandlung", optionWert(label))
    setFehler("")
    setPhase("kontakt")
    sanftInSicht()
  }

  // ── Phase A · Schritt 2: Kontakt absenden => Welle 1 ──────────────────────
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
      const jetzt = new Date()
      setZeitBeleg(jetzt.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }))
      setPhase(phaseBFelder.length > 0 ? "b" : "fertig")
      setBIndex(0)
      sanftInSicht()
    } catch (err) {
      console.error(err)
      setFehler("Fehler beim Senden. Bitte erneut versuchen.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Phase B: eine Antwort speichern (optimistisch) => Welle 2 ─────────────
  const beantworte = (feld: FeldDefinition, wert: string, wertLabel: string) => {
    set(feld.hubspotName, wert)
    setStapel((s) => [...s, { frageKurz: KURZ[feld.hubspotName] || feld.label, wertLabel }])

    // PATCH im Hintergrund — Abbruch hinterlässt trotzdem alles bis hier.
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
      setPhase("fertig")
      sanftInSicht()
    }
  }

  const ueberspringe = (feld: FeldDefinition) => beantworte(feld, "", "übersprungen")

  // ── Zusage-Zeile (Briefing) ───────────────────────────────────────────────
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
    <section className="db-formular" aria-label="Terminanfrage">
      {isTurnstileEnabled && (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      )}

      <div className="db-karte">
        {/* Bestätigungsband nach Welle 1 */}
        {(phase === "b" || phase === "fertig") && (
          <div className="db-band" role="status">
            ✓ Deine Anfrage ist bei uns — {contactId ? "gesichert" : ""}
          </div>
        )}

        {/* Antwort-Stapel (max. 3 sichtbar) */}
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

        {/* Trennmarke mit Zusage */}
        {(phase === "b" || phase === "fertig") && (
          <div className="db-zusage">
            <span>{zusage}</span>
            {zeitBeleg && <span className="db-zeit">{zeitBeleg}</span>}
          </div>
        )}

        {/* Aktiver Fragebereich (reservierte Mindesthöhe gegen Springen) */}
        <div className="db-frage" ref={frageRef}>
          {/* Phase A · Schritt 1 */}
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
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {/* Phase A · Schritt 2: Kontakt */}
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

              {isTurnstileEnabled && (
                <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-theme="light" data-size="flexible" />
              )}

              <button type="submit" className="db-cta" disabled={isSubmitting}>
                {isSubmitting ? "Sende…" : "Anfrage absenden"}
              </button>
              <p className="db-hinweis">Unverbindlich · Teresa meldet sich persönlich.</p>
            </form>
          )}

          {/* Phase B: aktuelle Frage */}
          {phase === "b" && phaseBFelder[bIndex] && (
            <FeldFrage
              feld={phaseBFelder[bIndex]}
              onWaehle={(wert, label) => beantworte(phaseBFelder[bIndex], wert, label)}
              onUeberspringen={() => ueberspringe(phaseBFelder[bIndex])}
            />
          )}

          {/* Fertig */}
          {phase === "fertig" && (
            <div className="db-fertig">
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

// ── Einzelne Phase-B-Frage ──────────────────────────────────────────────────
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

  // select / radio -> Options-Buttons
  return (
    <fieldset className="db-fieldset">
      <legend className="db-legende">{feld.frage}</legend>
      {feld.hinweis && <p className="db-hinweis">{feld.hinweis}</p>}
      <div className={`db-optionen ${feld.optionen && feld.optionen.length > 3 ? "db-grid-2" : ""}`}>
        {feld.optionen!.map((label) => (
          <button key={label} type="button" className="db-option" onClick={() => onWaehle(optionWert(label), label)}>
            {label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

// ── Gekapselte Styles (alles unter .db-formular) ────────────────────────────
const stil = `
.db-formular {
  --db-creme: #F5F1E8;
  --db-sand: #E7DFD0;
  --db-taupe: #A89A86;
  --db-charcoal: #2C2C2C;
  --db-akzent: var(--db-taupe);
  --db-weiss: #ffffff;
  --db-radius: 12px;
  color: var(--db-charcoal);
  font-size: 16px;
  line-height: 1.5;
  max-width: 640px;
  margin: 0 auto;
}
.db-formular * { box-sizing: border-box; }
.db-karte {
  background: var(--db-creme);
  border: 1px solid var(--db-sand);
  border-radius: var(--db-radius);
  padding: 24px;
}
.db-band {
  background: var(--db-sand);
  color: var(--db-charcoal);
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 14px;
  margin-bottom: 16px;
}
.db-stapel { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
.db-zeile {
  display: flex; justify-content: space-between; gap: 12px;
  background: var(--db-weiss); border: 1px solid var(--db-sand);
  border-radius: 8px; padding: 8px 12px; font-size: 14px;
}
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
.db-legende { font-size: 20px; font-weight: 600; margin: 0 0 12px; padding: 0; }
.db-hinweis { font-size: 13px; color: var(--db-taupe); margin: 0 0 12px; }
.db-optionen { display: grid; grid-template-columns: 1fr; gap: 10px; }
.db-grid-2 { grid-template-columns: 1fr 1fr; }
@media (max-width: 420px) { .db-grid-2 { grid-template-columns: 1fr; } }
.db-option {
  background: var(--db-weiss); border: 1px solid var(--db-sand);
  border-radius: 10px; padding: 14px 16px; font-size: 16px; text-align: left;
  cursor: pointer; transition: border-color .15s, background .15s;
  color: var(--db-charcoal);
}
.db-option:hover { border-color: var(--db-akzent); }
.db-option.db-aktiv { border-color: var(--db-akzent); background: var(--db-sand); }
.db-kontakt { display: flex; flex-direction: column; gap: 14px; }
.db-label { display: flex; flex-direction: column; gap: 6px; font-size: 14px; color: var(--db-charcoal); }
.db-input, .db-textarea {
  font-size: 16px; padding: 12px 14px; border: 1px solid var(--db-sand);
  border-radius: 10px; background: var(--db-weiss); color: var(--db-charcoal); width: 100%;
}
.db-textarea { resize: vertical; }
.db-input:focus, .db-textarea:focus, .db-option:focus-visible, .db-cta:focus-visible, .db-skip:focus-visible {
  outline: 2px solid var(--db-akzent); outline-offset: 2px;
}
.db-cta {
  background: var(--db-akzent); color: var(--db-weiss); border: none;
  border-radius: 999px; padding: 14px 20px; font-size: 16px; font-weight: 600;
  cursor: pointer; transition: filter .15s;
}
.db-cta:hover { filter: brightness(0.95); }
.db-cta:disabled { opacity: .6; cursor: default; }
.db-skip { background: none; border: none; color: var(--db-taupe); cursor: pointer; font-size: 14px; text-decoration: underline; }
.db-aktionen { display: flex; align-items: center; gap: 16px; margin-top: 14px; }
.db-hinweis { font-size: 13px; color: var(--db-taupe); }
.db-fehler {
  margin-top: 14px; padding: 10px 14px; border-radius: 10px;
  background: #fdecea; color: #b3261e; font-size: 14px; border: 1px solid #f5c6c2;
}
.db-fertig { text-align: center; padding: 24px 0; }
.db-fertig-titel { font-size: 22px; font-weight: 600; margin: 0 0 8px; }
.db-fertig-text { color: var(--db-charcoal); margin: 0; }
.db-honeypot { position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden; }
@media (prefers-reduced-motion: reduce) {
  .db-option, .db-cta { transition: none; }
}
`
