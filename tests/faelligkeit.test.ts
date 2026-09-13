import { test } from "node:test"
import assert from "node:assert/strict"
import { faelligkeitTimestamp } from "../lib/lead-logic"

/** Berlin-Komponenten eines Epoch-ms-Werts (Wochentag + Stunde + Minute). */
function berlin(ms: number): { wd: string; h: number; m: number } {
  const p = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Berlin",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(ms))
  const g = (t: string) => p.find((x) => x.type === t)?.value ?? ""
  let h = Number(g("hour"))
  if (h === 24) h = 0
  return { wd: g("weekday"), h, m: Number(g("minute")) }
}

// Referenzdaten 2026: Mo 05.01, Fr 09.01, Sa 10.01, So 11.01, Mo 12.01, Mi 08.07 (Sommerzeit)

test("Mo–Fr vor 15:00 → heute 17:00", () => {
  // Montag 05.01.2026 10:00 Berlin (= 09:00 UTC, Winter/CET)
  const r = berlin(faelligkeitTimestamp(new Date("2026-01-05T09:00:00Z")))
  assert.equal(r.wd, "Mon")
  assert.equal(r.h, 17)
  assert.equal(r.m, 0)
})

test("Mo–Fr ab 15:00 → nächster Werktag 09:00", () => {
  // Montag 05.01.2026 16:00 Berlin → Dienstag 09:00
  const r = berlin(faelligkeitTimestamp(new Date("2026-01-05T15:00:00Z")))
  assert.equal(r.wd, "Tue")
  assert.equal(r.h, 9)
})

test("Freitag ab 15:00 → Samstag 09:00 (Samstag zählt als Werktag)", () => {
  // Freitag 09.01.2026 16:00 Berlin → Samstag 09:00
  const r = berlin(faelligkeitTimestamp(new Date("2026-01-09T15:00:00Z")))
  assert.equal(r.wd, "Sat")
  assert.equal(r.h, 9)
})

test("Samstag → Montag 09:00 (Sonntag wird übersprungen)", () => {
  // Samstag 10.01.2026 09:00 Berlin → Montag 09:00
  const r = berlin(faelligkeitTimestamp(new Date("2026-01-10T08:00:00Z")))
  assert.equal(r.wd, "Mon")
  assert.equal(r.h, 9)
})

test("Sonntag → Montag 09:00", () => {
  // Sonntag 11.01.2026 12:00 Berlin → Montag 09:00
  const r = berlin(faelligkeitTimestamp(new Date("2026-01-11T11:00:00Z")))
  assert.equal(r.wd, "Mon")
  assert.equal(r.h, 9)
})

test("Sommerzeit (CEST, +2): Mi vor 15:00 → heute 17:00", () => {
  // Mittwoch 08.07.2026 10:00 Berlin (= 08:00 UTC, Sommer/CEST)
  const r = berlin(faelligkeitTimestamp(new Date("2026-07-08T08:00:00Z")))
  assert.equal(r.wd, "Wed")
  assert.equal(r.h, 17)
})

test("Grenzfall 14:59 Freitag → heute 17:00", () => {
  // Freitag 09.01.2026 14:00 Berlin (= 13:00 UTC) → heute 17:00
  const r = berlin(faelligkeitTimestamp(new Date("2026-01-09T13:00:00Z")))
  assert.equal(r.wd, "Fri")
  assert.equal(r.h, 17)
})
