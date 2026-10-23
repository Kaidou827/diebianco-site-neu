import { test } from "node:test"
import assert from "node:assert/strict"
import {
  filtereOffeneRueckruf,
  istScopeFehler,
  parseTaskDatumMs,
  rueckrufHinweisText,
  type RohTask,
} from "../lib/rueckruf-aufgaben"

// 2026-09-14 12:00 UTC = 14.09.2026 (Berlin, CEST); 2026-09-10 = 10.09.2026
const T14 = Date.parse("2026-09-14T12:00:00Z")
const T10 = Date.parse("2026-09-10T08:00:00Z")
const T12 = Date.parse("2026-09-12T08:00:00Z")

const task = (p: Partial<RohTask>): RohTask => ({
  id: "1",
  status: "NOT_STARTED",
  subject: "Rückruf: Lisa – Balayage",
  erstelltMs: T14,
  ...p,
})

// ── Filter ───────────────────────────────────────────────────────────────────
test("keine Aufgabe → kein Hinweis", () => {
  const offen = filtereOffeneRueckruf([])
  assert.deepEqual(offen, [])
  assert.equal(rueckrufHinweisText(offen), null)
})

test("eine offene Rückruf-Aufgabe → Hinweis mit Datum", () => {
  const offen = filtereOffeneRueckruf([task({ erstelltMs: T14 })])
  assert.equal(offen.length, 1)
  assert.equal(rueckrufHinweisText(offen), "Hinweis: offene Rückruf-Aufgabe vom 14.09.2026 noch vorhanden – bitte schließen.")
})

test("erledigte Aufgabe (COMPLETED) wird ignoriert", () => {
  const offen = filtereOffeneRueckruf([task({ status: "COMPLETED" })])
  assert.deepEqual(offen, [])
  assert.equal(rueckrufHinweisText(offen), null)
})

test("Nicht-Rückruf-Betreff wird ignoriert", () => {
  const offen = filtereOffeneRueckruf([task({ subject: "Nachfassen: Review-Bitte" })])
  assert.deepEqual(offen, [])
})

test("mehrere offene → älteste zuerst + „und n weitere\"", () => {
  const offen = filtereOffeneRueckruf([
    task({ id: "a", erstelltMs: T14 }),
    task({ id: "b", erstelltMs: T10 }), // älteste
    task({ id: "c", erstelltMs: T12 }),
  ])
  assert.deepEqual(offen.map((o) => o.id), ["b", "c", "a"]) // nach Erstelldatum aufsteigend
  assert.equal(rueckrufHinweisText(offen), "Hinweis: offene Rückruf-Aufgabe vom 10.09.2026 und 2 weitere noch vorhanden – bitte schließen.")
})

test("Wieder-da-Präfix zählt als Rückruf, Task ohne Datum fällt raus", () => {
  const offen = filtereOffeneRueckruf([
    task({ id: "w", subject: "Wieder da: Rückruf: Vera – Glossing", erstelltMs: T12 }),
    task({ id: "x", erstelltMs: null }),
  ])
  assert.deepEqual(offen.map((o) => o.id), ["w"])
})

// ── Scope-/Fehler-Klassifikation (403-Fallback) ──────────────────────────────
test("istScopeFehler: nur 403 gilt als fehlender tasks.read-Scope", () => {
  assert.equal(istScopeFehler(403), true)
  assert.equal(istScopeFehler(401), false)
  assert.equal(istScopeFehler(500), false)
  assert.equal(istScopeFehler(undefined), false)
})

// ── Datums-Parser ─────────────────────────────────────────────────────────────
test("parseTaskDatumMs: ISO und Epoch-ms", () => {
  assert.equal(parseTaskDatumMs("2026-09-14T12:00:00Z"), T14)
  assert.equal(parseTaskDatumMs(String(T14)), T14)
  assert.equal(parseTaskDatumMs(""), null)
  assert.equal(parseTaskDatumMs(null), null)
})
