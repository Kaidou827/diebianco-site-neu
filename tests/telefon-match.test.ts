import { test } from "node:test"
import assert from "node:assert/strict"
import { telefonFilterGroups, waehleKontaktId, type TelefonTreffer } from "../lib/telefon-match"

// ── telefonFilterGroups ─────────────────────────────────────────────────────
test("telefonFilterGroups: leere/ziffernlose Nummer → []", () => {
  assert.deepEqual(telefonFilterGroups(""), [])
  assert.deepEqual(telefonFilterGroups("   "), [])
  assert.deepEqual(telefonFilterGroups("abc-def"), [])
})

test("telefonFilterGroups: E.164 → drei ODER-Gruppen (phone, mobilephone, searchable)", () => {
  const g = telefonFilterGroups("+491743091973")
  assert.equal(g.length, 3)
  assert.deepEqual(g[0].filters[0], { propertyName: "phone", operator: "EQ", value: "+491743091973" })
  assert.deepEqual(g[1].filters[0], { propertyName: "mobilephone", operator: "EQ", value: "+491743091973" })
  // searchable-Feld nur mit reinen Ziffern (ohne „+").
  assert.deepEqual(g[2].filters[0], {
    propertyName: "hs_searchable_calculated_phone_number",
    operator: "EQ",
    value: "491743091973",
  })
})

test("telefonFilterGroups: trimmt und ignoriert Formatierung in den Ziffern", () => {
  const g = telefonFilterGroups("  +49 174 3091973 ")
  assert.equal(g[0].filters[0].value, "+49 174 3091973".length ? "+49 174 3091973" : "")
  // Nummer wird nur getrimmt (phone/mobilephone exakt), Ziffern für searchable extrahiert.
  assert.equal(g[0].filters[0].value, "+49 174 3091973")
  assert.equal(g[2].filters[0].value, "491743091973")
})

// ── waehleKontaktId ─────────────────────────────────────────────────────────
test("waehleKontaktId: kein Treffer → null", () => {
  assert.equal(waehleKontaktId([]), null)
})

test("waehleKontaktId: ein Treffer → dessen ID", () => {
  const t: TelefonTreffer[] = [{ id: "A", createdateMs: 1000, hatStatus: false }]
  assert.equal(waehleKontaktId(t), "A")
})

test("waehleKontaktId: Kontakt MIT Status schlägt Rumpf-Kontakt – auch wenn älter", () => {
  const t: TelefonTreffer[] = [
    { id: "RUMPF_ALT", createdateMs: 1000, hatStatus: false },
    { id: "MIT_STATUS", createdateMs: 5000, hatStatus: true },
  ]
  assert.equal(waehleKontaktId(t), "MIT_STATUS")
})

test("waehleKontaktId: bei gleichem Status gewinnt der älteste (kleinstes createdate)", () => {
  const t: TelefonTreffer[] = [
    { id: "NEUER", createdateMs: 5000, hatStatus: true },
    { id: "AELTER", createdateMs: 2000, hatStatus: true },
    { id: "AM_AELTESTEN", createdateMs: 1000, hatStatus: true },
  ]
  assert.equal(waehleKontaktId(t), "AM_AELTESTEN")
})

test("waehleKontaktId: unbekanntes createdate (null) zählt als neueste → verliert gegen datiertes", () => {
  const t: TelefonTreffer[] = [
    { id: "OHNE_DATUM", createdateMs: null, hatStatus: true },
    { id: "MIT_DATUM", createdateMs: 9999, hatStatus: true },
  ]
  assert.equal(waehleKontaktId(t), "MIT_DATUM")
})
