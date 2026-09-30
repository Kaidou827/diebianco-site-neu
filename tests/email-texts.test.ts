import { test } from "node:test"
import assert from "node:assert/strict"
import { eingangsbestaetigung, nichtErreichtMail, reaktivierungMail, preisKlausel } from "../lib/email-texts"

const KLAUSEL = "Alle genannten Preise sind ab-Preise und dienen der Orientierung"

test("Preis-Klausel in allen vier Kundinnen-Mails (Text + HTML)", () => {
  const mails = [
    eingangsbestaetigung({ firstname: "Demet", behandlung: "balayage", wunschzeitraum: "vormittags", whatsappOk: "ja_gerne" }),
    nichtErreichtMail({ firstname: "Demet", telefon: "+491743091973", wunschzeitraum: "vormittags", stufe: 1 }),
    nichtErreichtMail({ firstname: "Demet", telefon: "+491743091973", wunschzeitraum: "vormittags", stufe: 2 }),
    reaktivierungMail({ firstname: "Demet", farbSaison: true }),
  ]
  for (const m of mails) {
    assert.equal(m.text.includes(KLAUSEL), true, `Text-Klausel fehlt in: ${m.subject}`)
    assert.equal(m.html.includes(KLAUSEL), true, `HTML-Klausel fehlt in: ${m.subject}`)
  }
})

test("Eingangsbestätigung: ab-Preise-Überschrift, jede Preiszeile enthält 'ab', WhatsApp-Link", () => {
  const m = eingangsbestaetigung({ firstname: "Demet", behandlung: "balayage", wunschzeitraum: "samstag", whatsappOk: "ja_gerne" })
  assert.equal(m.text.includes("Zur Orientierung – unsere ab-Preise"), true)
  assert.equal(m.text.includes("Alle Angaben sind ab-Preise."), true)

  // Jede Preiszeile (enthält €) muss „ab" enthalten.
  const preiszeilen = m.text.split("\n").filter((l) => l.includes("€"))
  assert.equal(preiszeilen.length >= 5, true, `zu wenige Preiszeilen: ${preiszeilen.length}`)
  for (const z of preiszeilen) assert.equal(z.includes("ab"), true, `Preiszeile ohne 'ab': ${z}`)

  // WhatsApp-Hinweis
  assert.equal(m.text.includes("https://wa.me/491743091973"), true)
  assert.equal(m.html.includes("Schreib uns auf WhatsApp"), true)
})

test("preisKlausel liefert Text und HTML", () => {
  const k = preisKlausel()
  assert.equal(k.text.includes(KLAUSEL), true)
  assert.equal(k.html.includes(KLAUSEL), true)
})
