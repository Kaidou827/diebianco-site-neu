import { test } from "node:test"
import assert from "node:assert/strict"
import {
  naechsteNichtErreichtStufe,
  parseHubspotMs,
  parseZahl,
  sollReaktivieren,
  sollReviewMail,
  sortiereDigest,
  tageSeit,
  terminAktionen,
} from "../lib/cron/logik"
import { berlinHeuteUmMs, berlinMonat, berlinWochentag, istErinnerungsfenster } from "../lib/lead-logic"

const H = 60 * 60 * 1000
const D = 24 * H
const NOW = Date.parse("2026-09-14T12:00:00Z") // Montag

// ── Parser ────────────────────────────────────────────────────────────────
test("parseHubspotMs / parseZahl / tageSeit", () => {
  assert.equal(parseHubspotMs("1700000000000"), 1700000000000)
  assert.equal(parseHubspotMs("2026-09-14T12:00:00Z"), NOW)
  assert.equal(parseHubspotMs(""), null)
  assert.equal(parseHubspotMs(null), null)
  assert.equal(parseZahl(""), 0)
  assert.equal(parseZahl("2"), 2)
  assert.equal(tageSeit(NOW - 3 * D, NOW), 3)
  assert.equal(tageSeit(null, NOW), 0)
})

// ── Erinnerungsfenster 20–32 h (inkl. Sommer-/Winterzeit-Umstellung) ────────
test("Erinnerungsfenster 20–32 h", () => {
  assert.equal(istErinnerungsfenster(NOW + 24 * H, NOW), true)
  assert.equal(istErinnerungsfenster(NOW + 20 * H, NOW), true)
  assert.equal(istErinnerungsfenster(NOW + 32 * H, NOW), true)
  assert.equal(istErinnerungsfenster(NOW + 18 * H, NOW), false)
  assert.equal(istErinnerungsfenster(NOW + 34 * H, NOW), false)
})

test("Erinnerungsfenster: Sommerzeit-Start (Wanduhr 24 h = real 23 h) → im Fenster", () => {
  // 28.03.2026 10:00 Berlin (CET) → 29.03.2026 10:00 Berlin (CEST): real 23 h
  const now = Date.parse("2026-03-28T09:00:00Z")
  const termin = Date.parse("2026-03-29T08:00:00Z")
  assert.equal(istErinnerungsfenster(termin, now), true)
})

test("Erinnerungsfenster: Winterzeit-Start (Wanduhr 24 h = real 25 h) → im Fenster", () => {
  // 24.10.2026 10:00 Berlin (CEST) → 25.10.2026 10:00 Berlin (CET): real 25 h
  const now = Date.parse("2026-10-24T08:00:00Z")
  const termin = Date.parse("2026-10-25T09:00:00Z")
  assert.equal(istErinnerungsfenster(termin, now), true)
})

// ── Nicht-erreicht Zähler-Logik ─────────────────────────────────────────────
test("naechsteNichtErreichtStufe: Stufen & Sperren", () => {
  const basis = { status: "nicht_erreicht", nowMs: NOW, hasEmail: true }
  // Stufe 1: ≥48 h, Zähler 0
  assert.equal(naechsteNichtErreichtStufe({ ...basis, ankerMs: NOW - 50 * H, counter: 0 }), 1)
  // <48 h → nichts
  assert.equal(naechsteNichtErreichtStufe({ ...basis, ankerMs: NOW - 40 * H, counter: 0 }), null)
  // Stufe 2: Zähler 1, ≥5 Tage
  assert.equal(naechsteNichtErreichtStufe({ ...basis, ankerMs: NOW - 6 * D, counter: 1 }), 2)
  // Zähler 1, <5 Tage → nichts
  assert.equal(naechsteNichtErreichtStufe({ ...basis, ankerMs: NOW - 4 * D, counter: 1 }), null)
  // Zähler 2 → nichts mehr
  assert.equal(naechsteNichtErreichtStufe({ ...basis, ankerMs: NOW - 30 * D, counter: 2 }), null)
  // ohne E-Mail → nichts
  assert.equal(naechsteNichtErreichtStufe({ ...basis, hasEmail: false, ankerMs: NOW - 50 * H, counter: 0 }), null)
  // falscher Status → nichts
  assert.equal(naechsteNichtErreichtStufe({ ...basis, status: "neu", ankerMs: NOW - 50 * H, counter: 0 }), null)
})

// ── Termin-Aktionen ──────────────────────────────────────────────────────────
test("terminAktionen: Bestätigung / Erinnerung / Status-Aufgabe", () => {
  const morgen = terminAktionen({
    status: "termin_vereinbart", terminMs: NOW + 24 * H,
    bestaetigungGesendet: false, erinnerungGesendet: false, nowMs: NOW,
  })
  assert.deepEqual(morgen, { bestaetigen: true, erinnern: true, aufgabe: false })

  const bestaetigt = terminAktionen({
    status: "termin_vereinbart", terminMs: NOW + 24 * H,
    bestaetigungGesendet: true, erinnerungGesendet: true, nowMs: NOW,
  })
  assert.deepEqual(bestaetigt, { bestaetigen: false, erinnern: false, aufgabe: false })

  const vorbei = terminAktionen({
    status: "termin_vereinbart", terminMs: NOW - 3 * D,
    bestaetigungGesendet: true, erinnerungGesendet: true, nowMs: NOW,
  })
  assert.equal(vorbei.aufgabe, true)

  const fremd = terminAktionen({
    status: "erschienen", terminMs: NOW + 24 * H,
    bestaetigungGesendet: false, erinnerungGesendet: false, nowMs: NOW,
  })
  assert.deepEqual(fremd, { bestaetigen: false, erinnern: false, aufgabe: false })
})

// ── Bewertungsbitte ──────────────────────────────────────────────────────────
test("sollReviewMail", () => {
  const b = { status: "erschienen", reviewGesendet: false, einwilligung: true, nowMs: NOW }
  assert.equal(sollReviewMail({ ...b, terminMs: NOW - 3 * D }), true)
  assert.equal(sollReviewMail({ ...b, terminMs: NOW - 1 * D }), false)
  assert.equal(sollReviewMail({ ...b, terminMs: NOW - 3 * D, einwilligung: false }), false)
  assert.equal(sollReviewMail({ ...b, terminMs: NOW - 3 * D, reviewGesendet: true }), false)
})

// ── Reaktivierung ────────────────────────────────────────────────────────────
test("sollReaktivieren", () => {
  const b = { einwilligung: true, status: "neu", reaktivierungGesendet: false, nowMs: NOW }
  assert.equal(sollReaktivieren({ ...b, createdateMs: NOW - 31 * D }), true)
  assert.equal(sollReaktivieren({ ...b, createdateMs: NOW - 20 * D }), false)
  assert.equal(sollReaktivieren({ ...b, createdateMs: NOW - 31 * D, reaktivierungGesendet: true }), false)
  assert.equal(sollReaktivieren({ ...b, createdateMs: NOW - 31 * D, einwilligung: false }), false)
  assert.equal(sollReaktivieren({ ...b, createdateMs: NOW - 31 * D, status: "archiv" }), false)
})

// ── Digest-Sortierung ────────────────────────────────────────────────────────
test("sortiereDigest: Priorität, dann createdate", () => {
  const rows = [
    { id: "a", prioritaet: "niedrig", createdateMs: NOW - 1 * D },
    { id: "b", prioritaet: "hoch", createdateMs: NOW - 1 * D },
    { id: "c", prioritaet: "hoch", createdateMs: NOW - 5 * D },
    { id: "d", prioritaet: "mittel", createdateMs: NOW - 2 * D },
  ]
  assert.deepEqual(sortiereDigest(rows).map((r) => r.id), ["c", "b", "d", "a"])
})

// ── Auswahlfilter mit gemockter HubSpot-Zeile ───────────────────────────────
test("gemockte HubSpot-Zeile → Stufe 1", () => {
  const zeile = {
    id: "42",
    properties: {
      lead_status_intern: "nicht_erreicht",
      nicht_erreicht_seit: String(NOW - 3 * D),
      nicht_erreicht_mails_gesendet: "",
      email: "kundin@example.de",
    },
  }
  const stufe = naechsteNichtErreichtStufe({
    status: zeile.properties.lead_status_intern,
    ankerMs: parseHubspotMs(zeile.properties.nicht_erreicht_seit),
    counter: parseZahl(zeile.properties.nicht_erreicht_mails_gesendet),
    nowMs: NOW,
    hasEmail: Boolean(zeile.properties.email),
  })
  assert.equal(stufe, 1)
})

test("kein Anker (nicht_erreicht_seit leer) → null (erst stempeln)", () => {
  const stufe = naechsteNichtErreichtStufe({
    status: "nicht_erreicht", ankerMs: null, counter: 0, nowMs: NOW, hasEmail: true,
  })
  assert.equal(stufe, null)
})

// ── Berlin-Zeit-Helfer ──────────────────────────────────────────────────────
test("berlinWochentag / berlinMonat / berlinHeuteUmMs", () => {
  assert.equal(berlinWochentag(new Date("2026-01-10T08:00:00Z")), 6) // Samstag
  assert.equal(berlinWochentag(new Date("2026-01-11T08:00:00Z")), 7) // Sonntag
  assert.equal(berlinMonat(new Date("2026-09-14T08:00:00Z")), 9)
  // heute 17:00 Berlin für einen Sommertag = 15:00 UTC (CEST +2)
  const ms = berlinHeuteUmMs(17, 0, new Date("2026-07-08T06:00:00Z"))
  assert.equal(new Date(ms).toISOString(), "2026-07-08T15:00:00.000Z")
})
