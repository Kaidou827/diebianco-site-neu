import { test } from "node:test"
import assert from "node:assert/strict"
import { SALON_WA_NUMMER, waLink, waSalonFrageLink, waTerminBestaetigungLink } from "../lib/whatsapp"

test("SALON_WA_NUMMER = E.164 ohne +", () => {
  assert.equal(SALON_WA_NUMMER, "491743091973")
})

test("waLink: genau ein Parameter (?text=), kein Tracking-Parameter", () => {
  const link = waLink("491743091973", "Frage & Antwort")
  const query = link.slice(link.indexOf("?"))
  assert.equal(query.startsWith("?text="), true)
  assert.equal(query.includes("&"), false) // & im Text wird zu %26 encodiert → keine zweiten Parameter
  assert.equal(decodeURIComponent(query.replace("?text=", "")), "Frage & Antwort")
})

test("waSalonFrageLink: mit und ohne Behandlung", () => {
  const mit = waSalonFrageLink("Balayage")
  assert.equal(mit.startsWith("https://wa.me/491743091973?text="), true)
  assert.equal(
    decodeURIComponent(mit.split("text=")[1]),
    "Hallo Teresa, ich habe gerade eine Anfrage für Balayage geschickt und hätte eine Frage.",
  )
  const ohne = waSalonFrageLink()
  assert.equal(
    decodeURIComponent(ohne.split("text=")[1]),
    "Hallo Teresa, ich habe gerade eine Anfrage geschickt und hätte eine Frage.",
  )
})

test("waTerminBestaetigungLink: Kundennummer + Platzhalter; leer ohne gültige Nummer", () => {
  const link = waTerminBestaetigungLink({ vorname: "Demet", behandlungLabel: "Balayage", phoneE164: "+491711234567" })
  assert.equal(link.startsWith("https://wa.me/491711234567?text="), true)
  const text = decodeURIComponent(link.split("text=")[1])
  assert.equal(text.includes("Hallo Demet, hier ist Teresa von DIE BIANCO."), true)
  assert.equal(text.includes("Dein Termin für Balayage:"), true)
  assert.equal(text.includes("[Datum] um [Uhrzeit]"), true)
  assert.equal(text.includes("Bitte plane ca. [Dauer] ein."), true)
  assert.equal(text.includes("Siedlung Egelsberg 1, 47802 Krefeld"), true)
  // Ohne gültige (E.164-)Nummer → leerer String
  assert.equal(waTerminBestaetigungLink({ vorname: "X", behandlungLabel: "Y", phoneE164: "" }), "")
  assert.equal(waTerminBestaetigungLink({ vorname: "X", behandlungLabel: "Y", phoneE164: "0171123" }), "")
})
