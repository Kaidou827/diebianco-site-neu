import { test } from "node:test"
import assert from "node:assert/strict"
import {
  normalisiere, nameTokens, parseBetrag, parseDatum, monat, parseCsv, spalte,
  mapKanal, kasseAusTabelle, kontakteAusTabelle, abgleichen,
  type KasseZeile, type HubspotKontakt,
} from "../scripts/kundenabgleich"

// ── Normalisierung / Namen ───────────────────────────────────────────────────
test("normalisiere: Umlaute + ß + Kleinschreibung", () => {
  assert.equal(normalisiere("Müller"), "mueller")
  assert.equal(normalisiere("Weiß"), "weiss")
  assert.equal(normalisiere("  Anna   Lena "), "anna lena")
})
test("nameTokens: Komma- und Leerzeichen-Formate, reihenfolge-unabhängig", () => {
  assert.deepEqual(nameTokens("Sommer, Mara").sort(), ["mara", "sommer"])
  assert.deepEqual(nameTokens("Mara Sommer").sort(), ["mara", "sommer"])
})

// ── Zahlen / Datum ───────────────────────────────────────────────────────────
test("parseBetrag: deutsches und englisches Format", () => {
  assert.equal(parseBetrag("1.234,56"), 1234.56)
  assert.equal(parseBetrag("89,00 €"), 89)
  assert.equal(parseBetrag("1234.56"), 1234.56)
  assert.ok(Number.isNaN(parseBetrag("")))
})
test("parseDatum: de + iso", () => {
  assert.equal(monat(parseDatum("21.10.2026")!), "2026-10")
  assert.equal(monat(parseDatum("2026-06-01")!), "2026-06")
  assert.equal(parseDatum("quatsch"), null)
})

// ── CSV / Spalten ────────────────────────────────────────────────────────────
test("parseCsv: Auto-Delimiter + Quotes", () => {
  const z = parseCsv('a;b;c\n1;"x;y";3\n')
  assert.deepEqual(z, [["a", "b", "c"], ["1", "x;y", "3"]])
})
test("spalte: Alias/Teilstring", () => {
  const h = ["Dimension 1", "Dimension 2", "Umsatz"]
  assert.equal(spalte(h, "tag", "dimension 1"), 0)
  assert.equal(spalte(h, "umsatz"), 2)
  assert.equal(spalte(h, "gibtsnicht"), -1)
})

// ── Kanal ────────────────────────────────────────────────────────────────────
test("mapKanal", () => {
  assert.equal(mapKanal("Bezahlte Social Media"), "Meta")
  assert.equal(mapKanal("Facebook Lead Ads"), "Meta")
  assert.equal(mapKanal("Bezahlte Suche"), "Google-Anzeigen")
  assert.equal(mapKanal("Organische Suche"), "Organische Suche")
  assert.equal(mapKanal("Direkter Traffic"), "Direkter Traffic")
})

// ── Tabelle → Modelle ────────────────────────────────────────────────────────
test("kasseAusTabelle / kontakteAusTabelle: Spaltenerkennung", () => {
  const kasse = kasseAusTabelle(parseCsv("Dimension 1;Dimension 2;Dimension 3;Umsatz\n01.07.2026;Sommer, Mara;Balayage;390,00\n"))
  assert.equal(kasse.length, 1)
  assert.equal(kasse[0].umsatz, 390)
  assert.equal(kasse[0].kundin, "Sommer, Mara")
  const k = kontakteAusTabelle(parseCsv("Vorname;Nachname;E-Mail;Erstellungsdatum;Ursprüngliche Traffic-Quelle;Formular\nMara;Sommer;mara@x.de;10.06.2026;Bezahlte Social Media;Kontakt\n"))
  assert.equal(k[0].kanal, "Meta")
  assert.equal(k[0].bewerbung, false)
})

// ── Kernabgleich ─────────────────────────────────────────────────────────────
function kontakt(p: Partial<HubspotKontakt>): HubspotKontakt {
  return { vorname: "", nachname: "", email: "", erstellt: null, kanal: "Unbekannt", bewerbung: false, ...p }
}
function zeile(tag: string, kundin: string, umsatz: number): KasseZeile {
  return { tag: parseDatum(tag), kundin, leistung: "x", umsatz }
}

test("abgleichen: sicherer Treffer, Umsatz erst ab Anfragedatum, Besuche je Tag", () => {
  const kontakte = [
    kontakt({ vorname: "Mara", nachname: "Sommer", email: "mara.sommer@x.de", erstellt: parseDatum("10.06.2026"), kanal: "Meta" }),
  ]
  const kasse = [
    zeile("01.05.2026", "Sommer, Mara", 50), // vor Anfrage → NICHT zählen
    zeile("01.07.2026", "Sommer, Mara", 390),
    zeile("15.07.2026", "Mara Sommer", 80), // andere Reihenfolge
  ]
  const e = abgleichen(kasse, kontakte)
  assert.equal(e.summe.kundinnen, 1)
  assert.equal(e.summe.umsatz, 470) // 390 + 80, nicht 520
  const meta = e.kanalUmsatz.find((k) => k.kanal === "Meta")!
  assert.equal(meta.kundinnen, 1)
  assert.equal(meta.besuche, 2)
  assert.equal(meta.umsatz, 470)
  assert.equal(meta.anfragen, 1)
})

test("abgleichen: unsicherer Treffer (Nachname + Vorname in E-Mail) → pruefen, nicht gezählt", () => {
  const kontakte = [kontakt({ vorname: "Lia", nachname: "Berg", email: "liaberg@x.de", erstellt: parseDatum("15.06.2026"), kanal: "Google-Anzeigen" })]
  const kasse = [zeile("01.08.2026", "Berg, Linn", 95)] // Nachname passt, Vorname nicht; „lia" steckt in E-Mail
  const e = abgleichen(kasse, kontakte)
  assert.equal(e.summe.kundinnen, 0)
  assert.equal(e.pruefen.length, 1)
  assert.equal(e.pruefen[0].nachname, "Berg")
})

test("abgleichen: Bewerbungen werden ausgeschlossen", () => {
  const kontakte = [kontakt({ vorname: "Tom", nachname: "Klein", email: "tom@x.de", erstellt: parseDatum("01.06.2026"), kanal: "Meta", bewerbung: true })]
  const kasse = [zeile("01.07.2026", "Klein, Tom", 200)]
  const e = abgleichen(kasse, kontakte)
  assert.equal(e.summe.kundinnen, 0)
  assert.equal(e.kanalUmsatz.length, 0)
})
