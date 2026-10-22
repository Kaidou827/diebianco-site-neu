/**
 * scripts/kundenabgleich.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Wiederholbarer (monatlicher) Abgleich: Welcher Kanal bringt zahlende
 * Kundinnen? Liest NUR Export-Dateien (StudioLution-Kasse + HubSpot-Kontakte)
 * und schreibt CSVs nach daten/ausgabe/ (gitignored). KEIN Schreiben nach HubSpot.
 *
 * Aufruf:  pnpm kundenabgleich -- --kasse <datei> --hubspot <datei>
 *          (Dateien .csv nativ; .xlsx nur, wenn optional das Paket "xlsx" installiert ist)
 *
 * Erwartete Spalten (werden per Alias/Teilstring erkannt – robust gegen Umbenennung):
 *   Kasse (StudioLution „Analyse"): Dimension 1 = Tag, Dimension 2 = Kundin,
 *                                   Dimension 3 = Leistung, Umsatz
 *   HubSpot (Export .xlsx/.csv):   Vorname, Nachname, E-Mail, Erstellungsdatum,
 *                                  „Ursprüngliche Traffic-Quelle"
 *
 * Abgleich-Regeln (siehe Prompt 10, B5):
 *   - Namen normalisieren (ä→ae, ö→oe, ü→ue, ß→ss, Kleinschreibung).
 *   - Sicherer Treffer: Vor- UND Nachname passen (reihenfolge-unabhängig).
 *   - Unsicher (→ pruefen.csv): Nachname passt, Vorname steckt in der E-Mail.
 *   - Bewerbungen ausschließen (Spalte, die „bewerbung"/".bw-form" enthält).
 *   - Nur Umsatz ab dem Erstellungsdatum der Anfrage zählen.
 * Kernlogik ist rein + exportiert (Unit-Tests ohne Datei-IO).
 * ─────────────────────────────────────────────────────────────────────────
 */

// ── Normalisierung & Namen ──────────────────────────────────────────────────
export function normalisiere(s: string): string {
  return (s || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/\s+/g, " ")
}

/** Kundinnen-Name der Kasse in normalisierte Tokens zerlegen (reihenfolge-unabhängig). */
export function nameTokens(voll: string): string[] {
  const s = (voll || "").replace(/,/g, " ")
  return normalisiere(s)
    .split(" ")
    .filter((t) => t.length > 0)
}

// ── Zahlen & Datum (deutsche Exportformate) ─────────────────────────────────
/** "1.234,56" | "1234,56" | "1234.56" | "89,00 €" → number (NaN bei leer/ungültig). */
export function parseBetrag(roh: string): number {
  if (roh == null) return NaN
  let s = String(roh).replace(/[^\d.,-]/g, "").trim()
  if (!s) return NaN
  const komma = s.lastIndexOf(",")
  const punkt = s.lastIndexOf(".")
  if (komma > -1 && komma > punkt) {
    s = s.replace(/\./g, "").replace(",", ".") // deutsch: . = Tausender, , = Dezimal
  } else {
    s = s.replace(/,/g, "") // englisch: , = Tausender
  }
  const n = Number(s)
  return Number.isFinite(n) ? n : NaN
}

/** "21.10.2026" | "2026-10-21" | "21.10.2026 14:30" → Date (null bei ungültig). */
export function parseDatum(roh: string): Date | null {
  const s = String(roh || "").trim()
  if (!s) return null
  const de = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{2,4})/)
  if (de) {
    const [, d, m, y] = de
    const jahr = y.length === 2 ? 2000 + Number(y) : Number(y)
    return new Date(jahr, Number(m) - 1, Number(d))
  }
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]))
  const d = new Date(s)
  return Number.isNaN(d.getTime()) ? null : d
}

/** YYYY-MM eines Datums (Kohorten-Monat). */
export function monat(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

// ── CSV ─────────────────────────────────────────────────────────────────────
/** CSV mit Auto-Delimiter (, oder ;), Quotes und \r\n. Gibt Zeilen als Arrays. */
export function parseCsv(text: string): string[][] {
  const t = text.replace(/^﻿/, "")
  const kopf = t.slice(0, t.indexOf("\n") < 0 ? t.length : t.indexOf("\n"))
  const delim = (kopf.match(/;/g)?.length || 0) > (kopf.match(/,/g)?.length || 0) ? ";" : ","
  const zeilen: string[][] = []
  let feld = ""
  let zeile: string[] = []
  let inQuote = false
  for (let i = 0; i < t.length; i++) {
    const c = t[i]
    if (inQuote) {
      if (c === '"') {
        if (t[i + 1] === '"') { feld += '"'; i++ } else inQuote = false
      } else feld += c
    } else if (c === '"') inQuote = true
    else if (c === delim) { zeile.push(feld); feld = "" }
    else if (c === "\n") { zeile.push(feld); zeilen.push(zeile); zeile = []; feld = "" }
    else if (c === "\r") { /* ignorieren */ }
    else feld += c
  }
  if (feld.length > 0 || zeile.length > 0) { zeile.push(feld); zeilen.push(zeile) }
  return zeilen.filter((z) => z.some((f) => f.trim().length > 0))
}

/** Spaltenindex per Alias/Teilstring (case-insensitiv) finden, sonst -1. */
export function spalte(header: string[], ...aliase: string[]): number {
  const h = header.map((x) => normalisiere(x))
  for (const a of aliase) {
    const na = normalisiere(a)
    const idx = h.findIndex((x) => x === na || x.includes(na))
    if (idx > -1) return idx
  }
  return -1
}

// ── Kanal-Zuordnung ─────────────────────────────────────────────────────────
export function mapKanal(trafficQuelle: string): string {
  const q = normalisiere(trafficQuelle)
  if (q.includes("bezahlte social") || q.includes("facebook lead") || q.includes("paid social")) return "Meta"
  if (q.includes("bezahlte suche") || q.includes("paid search")) return "Google-Anzeigen"
  if (q.includes("organische suche") || q.includes("organic search")) return "Organische Suche"
  if (q.includes("organische social") || q.includes("organic social")) return "Organische Social Media"
  if (q.includes("direkt")) return "Direkter Traffic"
  return trafficQuelle?.trim() || "Unbekannt"
}

// ── Datenmodelle ────────────────────────────────────────────────────────────
export interface KasseZeile {
  tag: Date | null
  kundin: string
  leistung: string
  umsatz: number
}
export interface HubspotKontakt {
  vorname: string
  nachname: string
  email: string
  erstellt: Date | null
  kanal: string
  bewerbung: boolean
}
export interface Ergebnis {
  kanalUmsatz: Array<{ kanal: string; anfragen: number; kundinnen: number; besuche: number; umsatz: number }>
  kohorten: Array<{ kanal: string; monat: string; anfragen: number; kundinnen: number; umsatz: number }>
  pruefen: Array<{ nachname: string; vorname: string; email: string; kasseKundin: string; grund: string }>
  summe: { kundinnen: number; umsatz: number }
}

// ── Kernabgleich (rein, testbar) ────────────────────────────────────────────
export function abgleichen(kasse: KasseZeile[], kontakte: HubspotKontakt[]): Ergebnis {
  const leads = kontakte.filter((k) => !k.bewerbung)

  const kanalMap = new Map<string, { anfragen: number; kundinnen: number; besuche: number; umsatz: number }>()
  const kohMap = new Map<string, { kanal: string; monat: string; anfragen: number; kundinnen: number; umsatz: number }>()
  const pruefen: Ergebnis["pruefen"] = []
  let summeUmsatz = 0
  let summeKundinnen = 0

  const kanalGet = (k: string) => {
    if (!kanalMap.has(k)) kanalMap.set(k, { anfragen: 0, kundinnen: 0, besuche: 0, umsatz: 0 })
    return kanalMap.get(k)!
  }
  const kohGet = (kanal: string, m: string) => {
    const key = `${kanal}__${m}`
    if (!kohMap.has(key)) kohMap.set(key, { kanal, monat: m, anfragen: 0, kundinnen: 0, umsatz: 0 })
    return kohMap.get(key)!
  }

  // Anfragen je Kanal/Kohorte zählen.
  for (const k of leads) {
    kanalGet(k.kanal).anfragen++
    if (k.erstellt) kohGet(k.kanal, monat(k.erstellt)).anfragen++
  }

  for (const kontakt of leads) {
    const nv = normalisiere(kontakt.vorname)
    const nn = normalisiere(kontakt.nachname)
    if (!nn) continue
    const emailLocal = normalisiere((kontakt.email || "").split("@")[0])

    // Kasse-Zeilen dieser Kundin + Umsatz ab Anfragedatum.
    let umsatz = 0
    let besuche = 0
    let unsicherGrund = ""
    const besuchsTage = new Set<string>()
    for (const z of kasse) {
      const tokens = nameTokens(z.kundin)
      const sicher = nv.length > 0 && tokens.includes(nv) && tokens.includes(nn)
      const unsicher = !sicher && tokens.includes(nn) && nv.length > 2 && emailLocal.includes(nv)
      if (!sicher && !unsicher) continue
      if (unsicher) { unsicherGrund = "nur Nachname + Vorname in E-Mail"; continue }
      // nur Umsatz ab Erstellungsdatum
      if (kontakt.erstellt && z.tag && z.tag.getTime() < kontakt.erstellt.getTime()) continue
      if (!Number.isFinite(z.umsatz)) continue
      umsatz += z.umsatz
      const tagKey = z.tag ? z.tag.toISOString().slice(0, 10) : `${z.leistung}#${besuche}`
      if (!besuchsTage.has(tagKey)) { besuchsTage.add(tagKey); besuche++ }
    }

    if (unsicherGrund && umsatz === 0) {
      const kasseKundin = kasse.find((z) => nameTokens(z.kundin).includes(nn))?.kundin || ""
      pruefen.push({ nachname: kontakt.nachname, vorname: kontakt.vorname, email: kontakt.email, kasseKundin, grund: unsicherGrund })
      continue
    }
    if (umsatz > 0) {
      const kz = kanalGet(kontakt.kanal)
      kz.kundinnen++
      kz.besuche += besuche
      kz.umsatz += umsatz
      summeUmsatz += umsatz
      summeKundinnen++
      if (kontakt.erstellt) {
        const koh = kohGet(kontakt.kanal, monat(kontakt.erstellt))
        koh.kundinnen++
        koh.umsatz += umsatz
      }
    }
  }

  const runde = (n: number) => Math.round(n * 100) / 100
  return {
    kanalUmsatz: [...kanalMap.entries()]
      .map(([kanal, v]) => ({ kanal, ...v, umsatz: runde(v.umsatz) }))
      .sort((a, b) => b.umsatz - a.umsatz),
    kohorten: [...kohMap.values()]
      .map((v) => ({ ...v, umsatz: runde(v.umsatz) }))
      .sort((a, b) => (a.kanal === b.kanal ? a.monat.localeCompare(b.monat) : a.kanal.localeCompare(b.kanal))),
    pruefen,
    summe: { kundinnen: summeKundinnen, umsatz: runde(summeUmsatz) },
  }
}

// ── Rohdaten → Modelle (rein, testbar) ──────────────────────────────────────
export function kasseAusTabelle(zeilen: string[][]): KasseZeile[] {
  if (zeilen.length < 2) return []
  const h = zeilen[0]
  const iTag = spalte(h, "dimension 1", "tag", "datum")
  const iKundin = spalte(h, "dimension 2", "kundin", "kunde", "name")
  const iLeistung = spalte(h, "dimension 3", "leistung", "dienstleistung")
  const iUmsatz = spalte(h, "umsatz", "betrag", "revenue")
  return zeilen.slice(1).map((z) => ({
    tag: parseDatum(z[iTag] ?? ""),
    kundin: z[iKundin] ?? "",
    leistung: z[iLeistung] ?? "",
    umsatz: parseBetrag(z[iUmsatz] ?? ""),
  }))
}

export function kontakteAusTabelle(zeilen: string[][]): HubspotKontakt[] {
  if (zeilen.length < 2) return []
  const h = zeilen[0]
  const iV = spalte(h, "vorname", "first name", "firstname")
  const iN = spalte(h, "nachname", "last name", "lastname")
  const iMail = spalte(h, "e-mail", "email")
  const iErstellt = spalte(h, "erstellungsdatum", "create date", "createdate", "erstellt")
  const iKanal = spalte(h, "urspruengliche traffic-quelle", "original traffic source", "traffic-quelle", "traffic source")
  const iForm = spalte(h, "formular", "form", "quelle_seite", "bewerbung")
  return zeilen.slice(1).map((z) => {
    const form = normalisiere(z[iForm] ?? "")
    return {
      vorname: z[iV] ?? "",
      nachname: z[iN] ?? "",
      email: z[iMail] ?? "",
      erstellt: parseDatum(z[iErstellt] ?? ""),
      kanal: mapKanal(z[iKanal] ?? ""),
      bewerbung: form.includes("bewerbung") || form.includes("bw-form") || form.includes("/jobs"),
    }
  })
}

// ── CSV-Ausgabe ─────────────────────────────────────────────────────────────
export function zuCsv(zeilen: Array<Record<string, string | number>>): string {
  if (zeilen.length === 0) return ""
  const spalten = Object.keys(zeilen[0])
  const esc = (v: string | number) => {
    const s = String(v)
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return [spalten.join(";"), ...zeilen.map((z) => spalten.map((s) => esc(z[s])).join(";"))].join("\n") + "\n"
}

// ── CLI / Datei-IO (nur beim direkten Aufruf) ───────────────────────────────
async function tabelleLesen(pfad: string): Promise<string[][]> {
  const { readFileSync } = await import("node:fs")
  const { extname } = await import("node:path")
  const ext = extname(pfad).toLowerCase()
  if (ext === ".xlsx" || ext === ".xls") {
    // Variabler Modul-String → TypeScript versucht nicht, "xlsx" aufzulösen (optional).
    let XLSX: { read: (b: Buffer) => { Sheets: Record<string, unknown>; SheetNames: string[] }; utils: { sheet_to_json: (s: unknown, o: unknown) => string[][] } }
    try {
      const mod = "xlsx"
      XLSX = (await import(mod)) as unknown as typeof XLSX
    } catch {
      throw new Error(
        `.xlsx benötigt das Paket "xlsx": \`pnpm add -D xlsx\` – oder Datei als CSV exportieren (${pfad}).`,
      )
    }
    const wb = XLSX.read(readFileSync(pfad))
    const sheet = wb.Sheets[wb.SheetNames[0]]
    return XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: "" })
  }
  return parseCsv(readFileSync(pfad, "utf8"))
}

function argWert(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : undefined
}

async function main(): Promise<void> {
  const kassePfad = argWert("kasse")
  const hubspotPfad = argWert("hubspot")
  if (!kassePfad || !hubspotPfad) {
    console.error("Aufruf: pnpm kundenabgleich -- --kasse <datei.csv|xlsx> --hubspot <datei.csv|xlsx>")
    process.exit(1)
  }
  const { writeFileSync, mkdirSync } = await import("node:fs")
  const { resolve } = await import("node:path")

  const kasse = kasseAusTabelle(await tabelleLesen(kassePfad))
  const kontakte = kontakteAusTabelle(await tabelleLesen(hubspotPfad))
  const erg = abgleichen(kasse, kontakte)

  const ausDir = resolve("daten/ausgabe")
  mkdirSync(ausDir, { recursive: true })
  writeFileSync(`${ausDir}/kanal_umsatz.csv`, zuCsv(erg.kanalUmsatz))
  writeFileSync(`${ausDir}/kohorten.csv`, zuCsv(erg.kohorten))
  writeFileSync(`${ausDir}/pruefen.csv`, zuCsv(erg.pruefen))

  console.log(`Kasse-Zeilen: ${kasse.length} · Kontakte: ${kontakte.length}`)
  console.log(`Gematcht: ${erg.summe.kundinnen} Kundinnen · Umsatz: ${erg.summe.umsatz.toFixed(2)} €`)
  console.log(`Zur Prüfung: ${erg.pruefen.length}`)
  console.log(`Ausgabe → ${ausDir}/ (kanal_umsatz.csv, kohorten.csv, pruefen.csv)`)
  for (const k of erg.kanalUmsatz) {
    console.log(`  ${k.kanal.padEnd(26)} Anfragen ${k.anfragen}  Kundinnen ${k.kundinnen}  Umsatz ${k.umsatz.toFixed(2)} €`)
  }
}

// Nur ausführen, wenn direkt gestartet (nicht beim Import in Tests).
const direkt = typeof process !== "undefined" && process.argv[1] && /kundenabgleich\.ts$/.test(process.argv[1])
if (direkt) {
  main().catch((err) => {
    console.error("Fehler:", err instanceof Error ? err.message : err)
    process.exit(1)
  })
}
