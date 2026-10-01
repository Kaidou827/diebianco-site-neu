"use client"

/**
 * components/BewerbungFormular.tsx
 * ─────────────────────────────────────────────────────────────────────────
 * Bewerbungs-Stepper (3 Schritte) für die Jobs-Landingpages. Muster aus
 * AnfrageFormular übernommen: useState-Stepper, große Tap-Karten, Honeypot,
 * First-Touch-Attribution (sessionStorage), dataLayer-Events, Danke-Redirect.
 * Pflichtfelder nur in Schritt 3. Kein externes Widget – Post an /api/bewerbung.
 * ─────────────────────────────────────────────────────────────────────────
 */

import type React from "react"
import { useEffect, useState } from "react"
import {
  AZUBI_WO_STEHST, AZUBI_ERFAHRUNG, AZUBI_START,
  FRISEUR_ABSCHLUSS, FRISEUR_ERFAHRUNG_JAHRE, FRISEUR_SCHWERPUNKTE, FRISEUR_ARBEITSZEIT, FRISEUR_START,
  KONTAKTWUNSCH, type JobOption, type Stelle,
} from "@/lib/jobs"
import { waBewerbungLink } from "@/lib/whatsapp"

const ATTR_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "fbclid", "gclid"] as const
const ATTR_STORE = "db_jobs_attribution"

function leseAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {}
  let gespeichert: Record<string, string> = {}
  try {
    gespeichert = JSON.parse(sessionStorage.getItem(ATTR_STORE) || "{}") as Record<string, string>
  } catch {}
  const params = new URLSearchParams(window.location.search)
  const out: Record<string, string> = {}
  for (const k of ATTR_KEYS) {
    const v = gespeichert[k] || params.get(k) || ""
    if (v) out[k] = v
  }
  return out
}

function dl(event: string, extra: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return
  const w = window as unknown as { dataLayer?: unknown[] }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event, ...extra })
}

type Antworten = Record<string, string | string[]>

export default function BewerbungFormular({ stelle }: { stelle: Stelle }) {
  const istAzubi = stelle === "azubi"
  const [schritt, setSchritt] = useState<1 | 2 | 3>(1)
  const [antworten, setAntworten] = useState<Antworten>({})
  const [vorname, setVorname] = useState("")
  const [nachname, setNachname] = useState("")
  const [telefon, setTelefon] = useState("")
  const [email, setEmail] = useState("")
  const [kontaktwunsch, setKontaktwunsch] = useState("whatsapp")
  const [datenschutz, setDatenschutz] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fehler, setFehler] = useState("")
  const [waFallback, setWaFallback] = useState("")
  const [feldFehler, setFeldFehler] = useState<Record<string, boolean>>({})

  // First-Touch-Attribution beim Mount sichern + Step-1-Event.
  useEffect(() => {
    dl("bewerbung_step_1", { stelle })
    if (typeof window === "undefined") return
    try {
      const params = new URLSearchParams(window.location.search)
      const g = JSON.parse(sessionStorage.getItem(ATTR_STORE) || "{}") as Record<string, string>
      let geaendert = false
      for (const k of ATTR_KEYS) {
        const v = params.get(k)
        if (v && !g[k]) { g[k] = v; geaendert = true }
      }
      if (geaendert) sessionStorage.setItem(ATTR_STORE, JSON.stringify(g))
    } catch {}
  }, [stelle])

  const setAntwort = (key: string, value: string) => setAntworten((a) => ({ ...a, [key]: value }))
  const toggleAntwort = (key: string, value: string) =>
    setAntworten((a) => {
      const arr = Array.isArray(a[key]) ? (a[key] as string[]) : []
      return { ...a, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] }
    })

  const gehe = (ziel: 1 | 2 | 3) => {
    setSchritt(ziel)
    if (ziel === 2) dl("bewerbung_step_2", { stelle })
    if (ziel === 3) dl("bewerbung_step_3", { stelle })
    if (typeof document !== "undefined") {
      const el = document.getElementById("bewerben")
      if (el) el.scrollIntoView({ block: "start", behavior: "smooth" })
    }
  }

  const absenden = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const honeypot = (form.querySelector('input[name="website"]') as HTMLInputElement | null)?.value || ""

    const fehlerNeu: Record<string, boolean> = {}
    if (!vorname.trim()) fehlerNeu.vorname = true
    if (telefon.replace(/\D/g, "").length < 6) fehlerNeu.telefon = true
    if (!datenschutz) fehlerNeu.datenschutz = true
    setFeldFehler(fehlerNeu)
    if (Object.keys(fehlerNeu).length > 0) {
      setFehler("Bitte fülle Vorname, Telefon und die Datenschutz-Zustimmung aus.")
      return
    }

    setIsSubmitting(true)
    setFehler("")
    setWaFallback("")
    try {
      const attr = leseAttribution()
      const res = await fetch("/api/bewerbung", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stelle,
          vorname,
          nachname,
          telefon,
          email,
          kontaktwunsch,
          datenschutz,
          honeypot,
          antworten,
          quelle_seite: typeof window !== "undefined" ? window.location.pathname : "",
          ...attr,
        }),
      })
      const json = (await res.json()) as { ok: boolean; message?: string; whatsapp?: string }
      if (!json.ok) {
        setFehler(json.message || "Das hat gerade nicht geklappt.")
        if (json.whatsapp) setWaFallback(json.whatsapp)
        return
      }
      dl("bewerbung_success", { stelle })
      window.location.assign(`/jobs/danke?stelle=${stelle}`)
    } catch {
      setFehler("Das hat gerade nicht geklappt – schreib uns kurz per WhatsApp.")
      setWaFallback(waBewerbungLink(stelle))
    } finally {
      setIsSubmitting(false)
    }
  }

  const RadioKarten = ({ feld, options }: { feld: string; options: JobOption[] }) => (
    <div className="bw-karten">
      {options.map((o) => {
        const aktiv = antworten[feld] === o.value
        return (
          <button key={o.value} type="button" className={`bw-karte${aktiv ? " bw-aktiv" : ""}`} onClick={() => setAntwort(feld, o.value)}>
            <span>{o.label}</span>
            <span className="bw-icon" aria-hidden="true">{aktiv ? "✓" : ""}</span>
          </button>
        )
      })}
    </div>
  )

  const CheckKarten = ({ feld, options }: { feld: string; options: JobOption[] }) => (
    <div className="bw-karten">
      {options.map((o) => {
        const arr = Array.isArray(antworten[feld]) ? (antworten[feld] as string[]) : []
        const aktiv = arr.includes(o.value)
        return (
          <button key={o.value} type="button" className={`bw-karte${aktiv ? " bw-aktiv" : ""}`} onClick={() => toggleAntwort(feld, o.value)}>
            <span>{o.label}</span>
            <span className="bw-icon" aria-hidden="true">{aktiv ? "✓" : "+"}</span>
          </button>
        )
      })}
    </div>
  )

  const abschlussLaeuft = antworten.abschluss === "laeuft_noch"

  return (
    <section id="bewerben" className="bw-wrap" aria-label="Bewerbungsformular">
      <div className="bw-karte-box">
        <div className="bw-kopf">
          <span className="bw-badge">✦ In 2 Minuten · ohne Lebenslauf</span>
          <span className="bw-progress">Schritt {schritt} von 3</span>
        </div>
        <div className="bw-balken" aria-hidden="true"><span style={{ width: `${(schritt / 3) * 100}%` }} /></div>

        <form onSubmit={absenden} className="bw-form">
          <div aria-hidden="true" className="bw-honeypot">
            <label htmlFor="bw-website">Website</label>
            <input id="bw-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          {/* ── Schritt 1 ── */}
          {schritt === 1 && (
            <>
              {istAzubi ? (
                <>
                  <p className="bw-frage">Wo stehst du gerade?</p>
                  <RadioKarten feld="wo_stehst_du" options={AZUBI_WO_STEHST} />
                  <p className="bw-frage">Hast du schon Erfahrung?</p>
                  <RadioKarten feld="erfahrung" options={AZUBI_ERFAHRUNG} />
                </>
              ) : (
                <>
                  <p className="bw-frage">Dein Abschluss</p>
                  <RadioKarten feld="abschluss" options={FRISEUR_ABSCHLUSS} />
                  {abschlussLaeuft && (
                    <label className="bw-label">
                      Fertig bis (Monat/Jahr)
                      <input
                        className="bw-input"
                        type="text"
                        inputMode="numeric"
                        placeholder="z. B. 07/2026"
                        value={(antworten.abschluss_fertig_bis as string) || ""}
                        onChange={(e) => setAntwort("abschluss_fertig_bis", e.target.value)}
                      />
                    </label>
                  )}
                  <p className="bw-frage">Berufserfahrung</p>
                  <RadioKarten feld="erfahrung_jahre" options={FRISEUR_ERFAHRUNG_JAHRE} />
                </>
              )}
              <div className="bw-nav">
                <button type="button" className="bw-cta" onClick={() => gehe(2)}>Weiter</button>
              </div>
            </>
          )}

          {/* ── Schritt 2 ── */}
          {schritt === 2 && (
            <>
              {istAzubi ? (
                <>
                  <p className="bw-frage">Wann möchtest du starten?</p>
                  <RadioKarten feld="start" options={AZUBI_START} />
                  <label className="bw-label">
                    Warum Friseur/in? <span className="bw-optional">(optional)</span>
                    <textarea
                      className="bw-textarea"
                      rows={3}
                      maxLength={300}
                      placeholder="Warum Friseur/in? Ein, zwei Sätze reichen – Teresa liest das wirklich."
                      value={(antworten.motivation as string) || ""}
                      onChange={(e) => setAntwort("motivation", e.target.value)}
                    />
                  </label>
                </>
              ) : (
                <>
                  <p className="bw-frage">Deine Schwerpunkte <span className="bw-optional">(mehrere möglich)</span></p>
                  <CheckKarten feld="schwerpunkte" options={FRISEUR_SCHWERPUNKTE} />
                  <p className="bw-frage">Arbeitszeit</p>
                  <RadioKarten feld="arbeitszeit" options={FRISEUR_ARBEITSZEIT} />
                  <p className="bw-frage">Gewünschter Start</p>
                  <RadioKarten feld="start" options={FRISEUR_START} />
                </>
              )}
              <div className="bw-nav">
                <button type="button" className="bw-zurueck" onClick={() => gehe(1)}>Zurück</button>
                <button type="button" className="bw-cta" onClick={() => gehe(3)}>Weiter</button>
              </div>
            </>
          )}

          {/* ── Schritt 3 ── */}
          {schritt === 3 && (
            <>
              <p className="bw-frage">Wie erreichen wir dich?</p>
              <div className="bw-namen">
                <label className="bw-label">
                  Vorname *
                  <input className={`bw-input${feldFehler.vorname ? " bw-fehlerfeld" : ""}`} type="text" required autoComplete="given-name" value={vorname} onChange={(e) => setVorname(e.target.value)} />
                </label>
                <label className="bw-label">
                  Nachname <span className="bw-optional">(optional)</span>
                  <input className="bw-input" type="text" autoComplete="family-name" value={nachname} onChange={(e) => setNachname(e.target.value)} />
                </label>
              </div>
              <label className="bw-label">
                Telefon *
                <input className={`bw-input${feldFehler.telefon ? " bw-fehlerfeld" : ""}`} type="tel" required autoComplete="tel" inputMode="tel" placeholder="+49 …" value={telefon} onChange={(e) => setTelefon(e.target.value)} />
              </label>
              <label className="bw-label">
                E-Mail <span className="bw-optional">(optional)</span>
                <input className="bw-input" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>

              {!istAzubi && (
                <label className="bw-label">
                  Instagram / Portfolio <span className="bw-optional">(optional)</span>
                  <input className="bw-input" type="text" placeholder="@deinname oder Link – zeig uns deine Farbarbeiten" value={(antworten.instagram_portfolio as string) || ""} onChange={(e) => setAntwort("instagram_portfolio", e.target.value)} />
                </label>
              )}

              <div className="bw-label">
                <span>Wie sollen wir uns melden?</span>
                <div className="bw-chips">
                  {KONTAKTWUNSCH.map((o) => (
                    <button key={o.value} type="button" className={`bw-chip${kontaktwunsch === o.value ? " bw-chip-aktiv" : ""}`} onClick={() => setKontaktwunsch(o.value)}>{o.label}</button>
                  ))}
                </div>
              </div>

              <label className={`bw-check${feldFehler.datenschutz ? " bw-fehlerfeld" : ""}`}>
                <input type="checkbox" checked={datenschutz} onChange={(e) => setDatenschutz(e.target.checked)} />
                <span>
                  Ich habe die <a href="/datenschutz#bewerbung" target="_blank" rel="noopener noreferrer">Datenschutzhinweise für Bewerber/innen</a> gelesen.
                  Meine Angaben werden nur für das Bewerbungsverfahren genutzt und spätestens 6 Monate nach Abschluss gelöscht.
                </span>
              </label>

              <p className="bw-hint">Kein Lebenslauf nötig. Wenn du einen hast, schick ihn Teresa später einfach per WhatsApp.</p>

              <div className="bw-nav">
                <button type="button" className="bw-zurueck" onClick={() => gehe(2)}>Zurück</button>
                <button type="submit" className="bw-cta" disabled={isSubmitting}>{isSubmitting ? "Sende…" : "Bewerbung abschicken"}</button>
              </div>
            </>
          )}

          {fehler && (
            <div className="bw-fehler">
              {fehler}
              {waFallback && (
                <> <a href={waFallback} target="_blank" rel="noopener noreferrer">Auf WhatsApp schreiben</a></>
              )}
            </div>
          )}
        </form>
      </div>

      <style>{stil}</style>
    </section>
  )
}

const stil = `
.bw-wrap { --gold:#B8863D; --dark:#2C2C2C; --sand:#E4DCC9; --cream:#FBF8F1; --taupe:#5b5346; color:var(--dark); max-width:560px; margin:0 auto; font-size:16px; line-height:1.5; }
.bw-wrap * { box-sizing:border-box; }
.bw-karte-box { background:#ffffff; border:1px solid var(--sand); border-radius:14px; padding:20px; }
.bw-kopf { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:8px; margin-bottom:10px; }
.bw-badge { font-size:12px; letter-spacing:.04em; text-transform:uppercase; color:var(--gold); border:1px solid var(--sand); border-radius:999px; padding:4px 12px; }
.bw-progress { font-size:13px; color:var(--taupe); }
.bw-balken { height:6px; background:var(--sand); border-radius:999px; overflow:hidden; margin-bottom:18px; }
.bw-balken span { display:block; height:100%; background:linear-gradient(to right,#C6A15B,var(--gold)); transition:width .3s ease; }
.bw-form { display:flex; flex-direction:column; gap:14px; }
.bw-frage { font-size:18px; font-weight:600; margin:6px 0 2px; }
.bw-karten { display:flex; flex-direction:column; gap:10px; }
.bw-karte { display:flex; align-items:center; justify-content:space-between; gap:10px; min-height:52px; background:var(--cream); border:1.5px solid var(--sand); border-radius:12px; padding:14px 16px; font-size:16px; font-weight:500; text-align:left; cursor:pointer; transition:border-color .15s,background .15s,color .15s; width:100%; color:var(--dark); }
.bw-karte:hover { border-color:var(--gold); }
.bw-karte.bw-aktiv { border-color:var(--gold); background:var(--gold); color:#fff; }
.bw-icon { color:var(--gold); font-size:20px; line-height:1; flex-shrink:0; }
.bw-karte.bw-aktiv .bw-icon { color:#fff; }
.bw-namen { display:grid; grid-template-columns:1fr 1fr; gap:12px; align-items:end; }
.bw-namen > .bw-label { min-width:0; }
@media (max-width:520px){ .bw-namen { grid-template-columns:1fr; } }
.bw-label { display:flex; flex-direction:column; gap:6px; font-size:14px; font-weight:500; }
.bw-optional { color:var(--taupe); font-weight:400; }
.bw-input,.bw-textarea { font-size:16px; min-height:48px; padding:12px 14px; border:1.5px solid var(--sand); border-radius:10px; background:var(--cream); color:var(--dark); width:100%; }
.bw-textarea { resize:vertical; min-height:90px; }
.bw-input:focus,.bw-textarea:focus,.bw-karte:focus-visible,.bw-cta:focus-visible,.bw-chip:focus-visible { outline:2px solid var(--gold); outline-offset:2px; }
.bw-fehlerfeld, .bw-fehlerfeld .bw-input { border-color:#b3261e !important; }
.bw-chips { display:flex; flex-wrap:wrap; gap:8px; }
.bw-chip { min-height:44px; padding:8px 18px; border-radius:999px; border:1.5px solid var(--sand); background:var(--cream); color:var(--dark); font-size:14px; font-weight:500; cursor:pointer; }
.bw-chip.bw-chip-aktiv { background:var(--gold); border-color:var(--gold); color:#fff; }
.bw-check { display:flex; align-items:flex-start; gap:10px; font-size:13px; font-weight:400; color:var(--taupe); cursor:pointer; line-height:1.45; padding:4px 0; }
.bw-check input { width:20px; height:20px; margin-top:1px; flex-shrink:0; accent-color:var(--gold); }
.bw-check a { color:var(--gold); }
.bw-hint { font-size:13px; color:var(--taupe); margin:0; }
.bw-nav { display:flex; gap:12px; margin-top:6px; }
.bw-cta { flex:1; background:linear-gradient(to right,#C6A15B,var(--gold)); color:#fff; border:none; border-radius:999px; min-height:52px; padding:14px 20px; font-size:16px; font-weight:700; cursor:pointer; box-shadow:0 8px 20px -8px rgba(0,0,0,.35); }
.bw-cta:disabled { opacity:.6; cursor:default; }
.bw-zurueck { background:none; border:1.5px solid var(--sand); border-radius:999px; min-height:52px; padding:14px 20px; font-size:15px; font-weight:600; color:var(--taupe); cursor:pointer; }
.bw-fehler { margin-top:6px; padding:10px 14px; border-radius:10px; background:rgba(179,38,30,.1); color:#b3261e; font-size:14px; border:1px solid rgba(179,38,30,.25); }
.bw-fehler a { color:#b3261e; font-weight:700; }
.bw-honeypot { position:absolute; left:-10000px; width:1px; height:1px; overflow:hidden; }
`
