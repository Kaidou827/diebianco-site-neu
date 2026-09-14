import { test } from "node:test"
import assert from "node:assert/strict"
import { aufgabeProperties } from "../lib/hubspot"

const basis = {
  contactId: "42",
  subject: "Rückruf: Demet – Balayage – Wunsch: Vormittags",
  body: "Telefon: +49…",
  timestampMs: 1_800_000_000_000,
  priority: "HIGH" as const,
  ownerId: "81184186",
}

test("hs_task_reminders = Fälligkeit, wenn reminderMs gesetzt", () => {
  const p = aufgabeProperties({ ...basis, reminderMs: basis.timestampMs })
  assert.equal(p.hs_task_reminders, String(basis.timestampMs))
  assert.equal(p.hs_timestamp, String(basis.timestampMs))
  assert.equal(p.hs_task_type, "CALL")
  assert.equal(p.hs_task_priority, "HIGH")
  assert.equal(p.hubspot_owner_id, "81184186")
})

test("ohne reminderMs kein hs_task_reminders", () => {
  const p = aufgabeProperties(basis)
  assert.equal("hs_task_reminders" in p, false)
})
