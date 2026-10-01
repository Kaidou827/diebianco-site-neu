import { test } from "node:test"
import assert from "node:assert/strict"
import {
  bewerbungSchema,
  bewerbungAntwortenLesbar,
  stelleAusSlug,
  istStelle,
  STELLE_LABEL,
} from "../lib/jobs"
import { waBewerbungLink, waBewerbungAntwortLink } from "../lib/whatsapp"
import { bewerbungBenachrichtigung, bewerbungEingangsbestaetigung } from "../lib/email-texts"
import { jobPostingData } from "../components/jobs/JobPostingJsonLd"

// ── Schema / Validierung ─────────────────────────────────────────────────────
test("bewerbungSchema: Minimalfall (nur Schritt-3-Pflichtfelder) ist gültig", () => {
  const r = bewerbungSchema.safeParse({ stelle: "azubi", vorname: "Mia", telefon: "01234567", datenschutz: true })
  assert.equal(r.success, true)
  if (r.success) {
    assert.equal(r.data.kontaktwunsch, "whatsapp") // Default
    assert.deepEqual(r.data.antworten, {})
    assert.equal(r.data.email, "")
  }
})

test("bewerbungSchema: fehlende Pflichtfelder / Honeypot blocken", () => {
  assert.equal(bewerbungSchema.safeParse({ stelle: "azubi", telefon: "01234567", datenschutz: true }).success, false)
  assert.equal(bewerbungSchema.safeParse({ stelle: "azubi", vorname: "Mia", datenschutz: true }).success, false)
  assert.equal(bewerbungSchema.safeParse({ stelle: "azubi", vorname: "Mia", telefon: "01234567" }).success, false)
  assert.equal(bewerbungSchema.safeParse({ stelle: "azubi", vorname: "Mia", telefon: "01234567", datenschutz: false }).success, false)
  assert.equal(
    bewerbungSchema.safeParse({ stelle: "azubi", vorname: "Mia", telefon: "01234567", datenschutz: true, honeypot: "bot" }).success,
    false,
  )
})

test("bewerbungSchema: ungültige E-Mail fällt durch, leere ist ok", () => {
  assert.equal(bewerbungSchema.safeParse({ stelle: "friseur", vorname: "Mia", telefon: "01234567", datenschutz: true, email: "kaputt" }).success, false)
  assert.equal(bewerbungSchema.safeParse({ stelle: "friseur", vorname: "Mia", telefon: "01234567", datenschutz: true, email: "" }).success, true)
})

// ── Antworten → lesbare Labels ───────────────────────────────────────────────
test("bewerbungAntwortenLesbar: azubi (radio + textarea)", () => {
  const zeilen = bewerbungAntwortenLesbar("azubi", {
    wo_stehst_du: "schule_fertig",
    erfahrung: "praktikum",
    start: "asap",
    motivation: "Weil ich Farbe liebe.",
  })
  assert.deepEqual(zeilen, [
    ["Wo stehst du gerade?", "Schule fertig"],
    ["Erfahrung", "Praktikum im Salon gemacht"],
    ["Gewünschter Start", "So bald wie möglich"],
    ["Motivation", "Weil ich Farbe liebe."],
  ])
})

test("bewerbungAntwortenLesbar: friseur (checkbox join, leere Felder weg)", () => {
  const zeilen = bewerbungAntwortenLesbar("friseur", {
    abschluss: "gesell",
    schwerpunkte: ["balayage", "coloration"],
    arbeitszeit: "vollzeit",
    start: "sofort",
    instagram_portfolio: "",
  })
  const map = Object.fromEntries(zeilen)
  assert.equal(map["Abschluss"], "Gesell/in")
  assert.equal(map["Schwerpunkte"], "Balayage, Coloration / Ansatz")
  assert.equal(map["Arbeitszeit"], "Vollzeit")
  assert.equal("Instagram / Portfolio" in map, false) // leer → weggelassen
})

// ── Slug / Stelle ────────────────────────────────────────────────────────────
test("stelleAusSlug / istStelle", () => {
  assert.equal(stelleAusSlug("ausbildung-friseur-krefeld"), "azubi")
  assert.equal(stelleAusSlug("friseur-krefeld"), "friseur")
  assert.equal(stelleAusSlug("unbekannt"), null)
  assert.equal(istStelle("azubi"), true)
  assert.equal(istStelle("x"), false)
})

// ── WhatsApp-Links ───────────────────────────────────────────────────────────
test("waBewerbungLink: Salonnummer + korrekter Text je Stelle", () => {
  const a = waBewerbungLink("azubi")
  assert.equal(a.startsWith("https://wa.me/491743091973?text="), true)
  assert.equal(decodeURIComponent(a.split("text=")[1]).includes("für die Ausbildung bei DIE BIANCO"), true)
  const f = waBewerbungLink("friseur")
  assert.equal(decodeURIComponent(f.split("text=")[1]).includes("für die Stelle als Friseur/in"), true)
})

test("waBewerbungAntwortLink: Kundennummer + leer ohne gültige Nummer", () => {
  const l = waBewerbungAntwortLink({ vorname: "Mia", stelleLabel: STELLE_LABEL.friseur, phoneE164: "+491711234567" })
  assert.equal(l.startsWith("https://wa.me/491711234567?text="), true)
  assert.equal(decodeURIComponent(l.split("text=")[1]).includes("Danke für deine Bewerbung als"), true)
  assert.equal(waBewerbungAntwortLink({ vorname: "Mia", stelleLabel: "x", phoneE164: "" }), "")
})

// ── Mail-Rendering beide Stellen ─────────────────────────────────────────────
function salonMailDaten(stelle: "azubi" | "friseur") {
  return {
    stelleLabel: STELLE_LABEL[stelle],
    vorname: "Mia",
    nachname: "Muster",
    telefonAnzeige: "+491711234567",
    telHref: "tel:+491711234567",
    email: "mia@example.de",
    kontaktwunschLabel: "WhatsApp",
    antworten: bewerbungAntwortenLesbar(stelle, stelle === "azubi" ? { wo_stehst_du: "schule_fertig" } : { abschluss: "meister" }),
    waAntwortLink: "https://wa.me/491711234567?text=hallo",
    quelle: "/jobs · utm: meta/paid/azubi · fbclid: ja",
    eingang: "01.10.26, 10:00",
  }
}

test("bewerbungBenachrichtigung: Betreff + Kerninhalte (beide Stellen)", () => {
  for (const stelle of ["azubi", "friseur"] as const) {
    const m = bewerbungBenachrichtigung(salonMailDaten(stelle))
    assert.equal(m.subject.includes("Neue Bewerbung"), true)
    assert.equal(m.subject.includes(STELLE_LABEL[stelle]), true)
    assert.equal(m.subject.includes("Mia Muster"), true)
    assert.equal(m.html.includes("tel:+491711234567"), true)
    assert.equal(m.html.includes("Auf WhatsApp antworten"), true)
    assert.equal(m.text.includes("6 Monate"), true)
  }
})

test("bewerbungEingangsbestaetigung: Kerninhalte", () => {
  const m = bewerbungEingangsbestaetigung({
    vorname: "Mia",
    stelleLabel: STELLE_LABEL.friseur,
    kontaktwegLabel: "WhatsApp",
    waSalonLink: waBewerbungLink("friseur"),
    bewerbungMail: "businessdiebianco@gmail.com",
  })
  assert.equal(m.subject, "Deine Bewerbung bei DIE BIANCO ist angekommen")
  assert.equal(m.text.includes("2 Werktagen"), true)
  assert.equal(m.text.includes("businessdiebianco@gmail.com"), true)
  assert.equal(m.html.includes(STELLE_LABEL.friseur), true)
})

// ── JobPosting-JSON-LD ───────────────────────────────────────────────────────
test("jobPostingData: valide, keine baseSalary ohne Angabe", () => {
  const data = jobPostingData({
    title: STELLE_LABEL.friseur,
    description: "Test",
    employmentType: ["FULL_TIME", "PART_TIME"],
    url: "https://www.diebianco.de/jobs/friseur-krefeld",
  }) as Record<string, any>
  assert.equal(data["@type"], "JobPosting")
  assert.equal(data.hiringOrganization.name, "DIE BIANCO")
  assert.equal(data.jobLocation.address.addressLocality, "Krefeld")
  assert.equal(data.jobLocation.address.streetAddress, "Siedlung Egelsberg 1")
  assert.equal("baseSalary" in data, false)
  // datePosted / validThrough sind ISO-Daten (YYYY-MM-DD)
  assert.match(String(data.datePosted), /^\d{4}-\d{2}-\d{2}$/)
})

test("jobPostingData: baseSalary erscheint, wenn übergeben", () => {
  const data = jobPostingData({
    title: "x", description: "y", employmentType: ["FULL_TIME"],
    url: "https://www.diebianco.de/jobs/friseur-krefeld",
    baseSalary: { value: 2600, unitText: "MONTH" },
  }) as Record<string, any>
  assert.equal(data.baseSalary.value.value, 2600)
  assert.equal(data.baseSalary.currency, "EUR")
})
