import { test } from "node:test"
import assert from "node:assert/strict"
import { berechneWiederkehr } from "../lib/wiederkehr"
import { FELDER } from "../lib/hubspot/schema"

const NOW = 1_800_000_000_000
const MIN = 60_000
const TAG = 24 * 60 * MIN
const IDEM = 5 * MIN
const basis = { terminDatumMs: null as number | null, jetztMs: NOW, idempotenzMs: IDEM }

test("neuer Kontakt: neu, nicht wiederkehrend, Anzahl 1, kein Reset-Block", () => {
  const r = berechneWiederkehr({ ...basis, existiert: false, altStatus: "", letzteBestaetigungMs: null, anzahlAlt: 0 })
  assert.equal(r.istDuplikat, false)
  assert.equal(r.wiederkehrend, false)
  assert.equal(r.anzahlAnfragen, 1)
  assert.equal(r.properties.lead_status_intern, "neu")
  assert.equal(r.properties.anzahl_anfragen, "1")
  assert.equal(r.properties.letzte_anfrage_am, String(NOW))
  assert.equal("vorheriger_status" in r.properties, false)
})

test("Rumpf-Kontakt (bestehend, kein Status, keine Bestätigung): NICHT wiederkehrend", () => {
  const r = berechneWiederkehr({ ...basis, existiert: true, altStatus: "", letzteBestaetigungMs: null, anzahlAlt: 0 })
  assert.equal(r.istDuplikat, false)
  assert.equal(r.wiederkehrend, false)
  assert.equal(r.properties.lead_status_intern, "neu")
  assert.equal(r.properties.anzahl_anfragen, "1")
  assert.equal(r.offeneAufgabeMoeglich, false)
})

test("bestehend ohne Status, Bestätigung > 5 Min: wiederkehrend (über alte Bestätigung)", () => {
  const r = berechneWiederkehr({ ...basis, existiert: true, altStatus: "", letzteBestaetigungMs: NOW - 10 * MIN, anzahlAlt: 1 })
  assert.equal(r.wiederkehrend, true)
  assert.equal(r.anzahlAnfragen, 2)
})

test("bestehend mit kein_interesse: wiederkehrend, Status zurück auf neu, Reset-Felder", () => {
  const r = berechneWiederkehr({ ...basis, existiert: true, altStatus: "kein_interesse", letzteBestaetigungMs: NOW - 40 * MIN, anzahlAlt: 2 })
  assert.equal(r.wiederkehrend, true)
  assert.equal(r.vorherigerStatus, "kein_interesse")
  assert.equal(r.anzahlAnfragen, 3)
  assert.equal(r.properties.lead_status_intern, "neu")
  assert.equal(r.properties.vorheriger_status, "kein_interesse")
  assert.equal(r.properties.nicht_erreicht_mails_gesendet, "0")
  assert.equal(r.properties.nicht_erreicht_seit, "")
  assert.equal(r.properties.termin_status_aufgabe_gesendet, "")
  assert.equal(r.properties.kein_interesse_seit, "") // Archiv-Anker zurückgesetzt
  assert.equal(r.offeneAufgabeMoeglich, false) // kein_interesse ist kein Rückruf-Status
})

test("bestehend termin_vereinbart + Termin in Zukunft: Reset, termin_datum unangetastet", () => {
  const future = NOW + 3 * TAG
  const r = berechneWiederkehr({ ...basis, existiert: true, altStatus: "termin_vereinbart", letzteBestaetigungMs: NOW - 2 * TAG, anzahlAlt: 1, terminDatumMs: future })
  assert.equal(r.wiederkehrend, true)
  assert.equal(r.terminInZukunft, true)
  assert.equal(r.terminDatumMs, future)
  assert.equal(r.properties.lead_status_intern, "neu")
  assert.equal("termin_datum" in r.properties, false)
})

test("Doppelabsendung < 5 Min: Duplikat, KEIN Status-Reset", () => {
  const r = berechneWiederkehr({ ...basis, existiert: true, altStatus: "neu", letzteBestaetigungMs: NOW - 1 * MIN, anzahlAlt: 1 })
  assert.equal(r.istDuplikat, true)
  assert.equal(r.wiederkehrend, false)
  assert.deepEqual(r.properties, {})
})

test("Welle 2 kann Status/Wiederkehr-Felder NICHT schreiben (welle=workflow)", () => {
  const welle2Schreibbar = new Set(FELDER.filter((f) => f.welle !== "workflow").map((f) => f.hubspotName))
  for (const name of ["lead_status_intern", "letzte_anfrage_am", "vorheriger_status", "anzahl_anfragen"]) {
    assert.equal(welle2Schreibbar.has(name), false, name)
  }
})
