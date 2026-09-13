import { test } from "node:test"
import assert from "node:assert/strict"
import {
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
    schnitt_styling: 60,
    farbe_ansatz: 80,
    straehnen_blondierung: 100,
    balayage: 150,
    grey_blending: 150,
    keratin: 200,
    beratungsgespraech: 60,
    weiss_ich_noch_nicht: 60,
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
