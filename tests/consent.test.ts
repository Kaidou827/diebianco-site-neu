import { test } from "node:test"
import assert from "node:assert/strict"
import {
  parseEinwilligung,
  einwilligungCookie,
  consentModeWerte,
  CONSENT_VERSION,
  type Einwilligung,
} from "../lib/consent"

const beispiel: Einwilligung = { statistik: true, marketing: false, zeit: "2026-11-18T12:00:00.000Z", version: CONSENT_VERSION }

test("Cookie schreiben und wieder lesen ergibt dieselbe Auswahl", () => {
  const cookie = einwilligungCookie(beispiel, true).split(";")[0]
  assert.deepEqual(parseEinwilligung(`foo=1; ${cookie}; bar=2`), beispiel)
})

test("Cookie hat Laufzeit, Pfad, SameSite und Secure nur bei https", () => {
  assert.match(einwilligungCookie(beispiel, true), /Max-Age=31536000; Path=\/; SameSite=Lax; Secure$/)
  assert.doesNotMatch(einwilligungCookie(beispiel, false), /Secure/)
})

test("ohne, mit kaputtem oder altem Cookie → keine Einwilligung", () => {
  assert.equal(parseEinwilligung(""), null)
  assert.equal(parseEinwilligung("db_consent=%7Bkaputt"), null)
  const alt = encodeURIComponent(JSON.stringify({ ...beispiel, version: CONSENT_VERSION - 1 }))
  assert.equal(parseEinwilligung(`db_consent=${alt}`), null)
})

test("nur echte true-Werte zählen als Zustimmung", () => {
  const roh = encodeURIComponent(JSON.stringify({ statistik: "ja", marketing: 1, version: CONSENT_VERSION }))
  const e = parseEinwilligung(`db_consent=${roh}`)
  assert.equal(e?.statistik, false)
  assert.equal(e?.marketing, false)
})

test("Consent Mode v2: Marketing steuert ad_*, Statistik analytics_storage", () => {
  assert.deepEqual(consentModeWerte({ statistik: false, marketing: true }), {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "denied",
  })
  assert.deepEqual(consentModeWerte({ statistik: true, marketing: false }), {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "granted",
  })
})
