import { test } from "node:test"
import assert from "node:assert/strict"
import {
  anfrageHerkunft,
  behandlungsDauer,
  leadQualitaet,
  leadWertProxy,
  normalisiereTelefonE164,
  prioritaetFuerBehandlung,
} from "../lib/lead-logic"

test("Priorität aus Behandlung", () => {
  for (const b of ["grey_blending", "balayage", "keratin", "straehnen_blondierung"]) {
    assert.equal(prioritaetFuerBehandlung(b), "hoch", b)
  }
  for (const b of ["farbe_ansatz", "beratungsgespraech"]) {
    assert.equal(prioritaetFuerBehandlung(b), "mittel", b)
  }
  for (const b of ["schnitt_styling", "weiss_ich_noch_nicht"]) {
    assert.equal(prioritaetFuerBehandlung(b), "niedrig", b)
  }
  assert.equal(prioritaetFuerBehandlung("unbekannt"), "niedrig")
})

test("Lead-Wert-Proxy aus Behandlung", () => {
  const erwartet: Record<string, number> = {
    schnitt_styling: 95,
    farbe_ansatz: 80,
    straehnen_blondierung: 150,
    balayage: 390,
    grey_blending: 390,
    keratin: 300,
    beratungsgespraech: 95,
    weiss_ich_noch_nicht: 95,
  }
  for (const [b, wert] of Object.entries(erwartet)) {
    assert.equal(leadWertProxy(b), wert, b)
  }
  assert.equal(leadWertProxy("unbekannt"), 60)
})

test("Lead-Qualität: heiss nur bei hoch + konkretem Zeitraum", () => {
  assert.equal(leadQualitaet("hoch", "vormittags"), "heiss")
  assert.equal(leadQualitaet("hoch", "samstag"), "heiss")
  assert.equal(leadQualitaet("hoch", "egal"), "warm")
  assert.equal(leadQualitaet("hoch", ""), "warm")
  assert.equal(leadQualitaet("mittel", "vormittags"), "warm")
  assert.equal(leadQualitaet("niedrig", "samstag"), "warm")
})

test("Behandlungsdauer je Behandlung", () => {
  assert.equal(behandlungsDauer("schnitt_styling"), "ca. 1–1,5 Stunden")
  assert.equal(behandlungsDauer("farbe_ansatz"), "ca. 2–3 Stunden")
  assert.equal(behandlungsDauer("straehnen_blondierung"), "ca. 2–4 Stunden")
  assert.equal(behandlungsDauer("balayage"), "ca. 3–5 Stunden")
  assert.equal(behandlungsDauer("grey_blending"), "ca. 3–5 Stunden")
  assert.equal(behandlungsDauer("keratin"), "ca. 2–3 Stunden")
  assert.equal(behandlungsDauer("beratungsgespraech"), "ca. 30 Minuten")
  assert.equal(behandlungsDauer("weiss_ich_noch_nicht"), "")
})

test("Telefon nach E.164 normalisieren", () => {
  assert.equal(normalisiereTelefonE164("0174 3091973"), "+491743091973")
  assert.equal(normalisiereTelefonE164("+49 174 3091973"), "+491743091973")
  assert.equal(normalisiereTelefonE164("0049 174 309 19 73"), "+491743091973")
  assert.equal(normalisiereTelefonE164("01743091973"), "+491743091973")
  assert.equal(normalisiereTelefonE164("49 174 3091973"), "+491743091973")
  assert.equal(normalisiereTelefonE164("+43 660 1234567"), "+436601234567")
  assert.equal(normalisiereTelefonE164(""), "")
  assert.equal(normalisiereTelefonE164("   "), "")
})

test("Herkunft: Meta-Anzeige mit utm_content wird als Anzeige ausgewiesen", () => {
  const h = anfrageHerkunft("/dienstleistungen/keratinbehandlung", {
    utm_source: "facebook",
    utm_medium: "paid",
    utm_campaign: "DieBianco_Webseitbuchung",
    utm_content: "keratin_video2",
    fbclid: "abc123",
  })
  assert.equal(h.anzeige, "keratin_video2")
  assert.equal(
    h.quelle,
    "/dienstleistungen/keratinbehandlung · utm: facebook/paid/DieBianco_Webseitbuchung/keratin_video2 · fbclid: ja",
  )
  // Klick-IDs nie im Klartext.
  assert.equal(h.quelle.includes("abc123"), false)
})

test("Herkunft: ohne Kampagnen-Daten bleibt nur die Seite", () => {
  const h = anfrageHerkunft("/kontakt", {})
  assert.equal(h.anzeige, "")
  assert.equal(h.quelle, "/kontakt · keine Kampagnen-Daten")
  assert.equal(anfrageHerkunft("", {}).quelle, "/kontakt · keine Kampagnen-Daten")
})

test("Herkunft: Google-Klick und fehlende utm-Teile", () => {
  const h = anfrageHerkunft("/kontakt", { gclid: "xyz", utm_source: "google" })
  assert.equal(h.quelle, "/kontakt · utm: google/-/- · fbclid: nein · Google-Klick: ja")
  assert.equal(h.quelle.includes("xyz"), false)
})

test("Herkunft: Steuerzeichen und Überlänge aus URL-Werten werden entschärft", () => {
  const h = anfrageHerkunft("/kontakt", { utm_content: "video1\r\nBcc: x@example.com" + "a".repeat(200) })
  assert.equal(/[\r\n]/.test(h.anzeige), false)
  assert.equal(h.anzeige.length <= 80, true)
})
