/**
 * scripts/sync-properties.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Legt die im Schema (lib/hubspot/schema.ts) definierten Contact-Properties
 * in HubSpot an bzw. aktualisiert sie. IDEMPOTENT:
 *   1) liest alle vorhandenen Properties
 *   2) legt nur an, was fehlt
 *   3) aktualisiert nur, was abweicht
 *   4) löscht NIE vorhandene Werte oder Optionen
 *
 * Führendes Portal: 146440145 (EU-Region). Der Private-App-Token stammt aus
 * genau diesem Portal und wird über die Umgebungsvariable geladen — NIE ins
 * Repo committen.
 *
 * Aufruf:
 *   npm run sync:hubspot -- --dry-run     # zeigt nur, was passieren würde
 *   npm run sync:hubspot                  # führt Änderungen aus
 *
 * Umgebungsvariablen:
 *   HUBSPOT_PRIVATE_APP_TOKEN   (Pflicht zum Ausführen)
 *   HUBSPOT_API_BASE            (optional, Default: https://api.hubapi.com)
 *
 * Benötigte Scopes des Tokens:
 *   crm.schemas.contacts.read / crm.schemas.contacts.write
 * ─────────────────────────────────────────────────────────────────────────
 */

import {
  FELDER,
  PROPERTY_GRUPPE,
  optionWert,
  type FeldDefinition,
} from "../lib/hubspot/schema.ts"

const API_BASE = process.env.HUBSPOT_API_BASE || "https://api.hubapi.com"
const TOKEN = process.env.HUBSPOT_PRIVATE_APP_TOKEN || ""
const DRY_RUN = process.argv.includes("--dry-run")

/** Farben für lesbare Konsolenausgabe (ohne Abhängigkeit). */
const c = {
  gruen: (s: string) => `\x1b[32m${s}\x1b[0m`,
  gelb: (s: string) => `\x1b[33m${s}\x1b[0m`,
  grau: (s: string) => `\x1b[90m${s}\x1b[0m`,
  rot: (s: string) => `\x1b[31m${s}\x1b[0m`,
  fett: (s: string) => `\x1b[1m${s}\x1b[0m`,
}

// ── HubSpot-Typen (nur was wir brauchen) ───────────────────────────────────
interface HubspotOption {
  label: string
  value: string
  displayOrder?: number
  hidden?: boolean
}
interface HubspotProperty {
  name: string
  label: string
  type: string
  fieldType: string
  groupName?: string
  options?: HubspotOption[]
}

// ── Schema -> HubSpot-Payload ──────────────────────────────────────────────
function baueOptionen(feld: FeldDefinition): HubspotOption[] | undefined {
  if (feld.type !== "enumeration" || !feld.optionen) return undefined
  return feld.optionen.map((label, i) => ({
    label,
    value: optionWert(label),
    displayOrder: i,
  }))
}

function bauePayload(feld: FeldDefinition): HubspotProperty {
  const payload: HubspotProperty = {
    name: feld.hubspotName,
    label: feld.label,
    type: feld.type,
    fieldType: feld.fieldType,
    groupName: PROPERTY_GRUPPE.name,
  }
  const optionen = baueOptionen(feld)
  if (optionen) payload.options = optionen
  return payload
}

/** Prüft, ob eine vorhandene Property vom Soll abweicht (nur additive Felder). */
function weichtAb(soll: HubspotProperty, ist: HubspotProperty): string[] {
  const gruende: string[] = []
  if (soll.label !== ist.label) gruende.push("Label")
  if (soll.fieldType !== ist.fieldType) gruende.push("fieldType")
  if (soll.groupName && soll.groupName !== ist.groupName) gruende.push("Gruppe")

  if (soll.options) {
    const istWerte = new Map((ist.options || []).map((o) => [o.value, o]))
    // Fehlende oder umbenannte Optionen -> Update nötig. Vorhandene NIE entfernen.
    for (const o of soll.options) {
      const vorhanden = istWerte.get(o.value)
      if (!vorhanden) gruende.push(`Option fehlt: "${o.label}"`)
      else if (vorhanden.label !== o.label) gruende.push(`Option-Label: "${o.label}"`)
    }
  }
  return gruende
}

// ── HTTP-Helfer ────────────────────────────────────────────────────────────
async function hsFetch(pfad: string, init?: RequestInit): Promise<Response> {
  return fetch(`${API_BASE}${pfad}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  })
}

async function ladeVorhandene(): Promise<Map<string, HubspotProperty>> {
  const res = await hsFetch("/crm/v3/properties/contacts")
  if (!res.ok) {
    throw new Error(`Properties lesen fehlgeschlagen: ${res.status} ${await res.text()}`)
  }
  const json = (await res.json()) as { results: HubspotProperty[] }
  return new Map(json.results.map((p) => [p.name, p]))
}

async function stelleGruppeSicher(): Promise<void> {
  const res = await hsFetch("/crm/v3/properties/contacts/groups")
  if (!res.ok) {
    throw new Error(`Gruppen lesen fehlgeschlagen: ${res.status} ${await res.text()}`)
  }
  const json = (await res.json()) as { results: Array<{ name: string }> }
  const existiert = json.results.some((g) => g.name === PROPERTY_GRUPPE.name)
  if (existiert) {
    console.log(c.grau(`Gruppe "${PROPERTY_GRUPPE.name}" existiert bereits.`))
    return
  }
  if (DRY_RUN) {
    console.log(c.gelb(`[dry-run] Gruppe "${PROPERTY_GRUPPE.name}" würde angelegt.`))
    return
  }
  const create = await hsFetch("/crm/v3/properties/contacts/groups", {
    method: "POST",
    body: JSON.stringify({ name: PROPERTY_GRUPPE.name, label: PROPERTY_GRUPPE.label }),
  })
  if (!create.ok) {
    throw new Error(`Gruppe anlegen fehlgeschlagen: ${create.status} ${await create.text()}`)
  }
  console.log(c.gruen(`Gruppe "${PROPERTY_GRUPPE.name}" angelegt.`))
}

async function legeAn(soll: HubspotProperty): Promise<void> {
  const res = await hsFetch("/crm/v3/properties/contacts", {
    method: "POST",
    body: JSON.stringify(soll),
  })
  if (!res.ok) {
    throw new Error(`Property "${soll.name}" anlegen fehlgeschlagen: ${res.status} ${await res.text()}`)
  }
}

async function aktualisiere(soll: HubspotProperty, ist: HubspotProperty): Promise<void> {
  // Optionen additiv zusammenführen: bestehende behalten, neue anhängen.
  const body: Partial<HubspotProperty> = {
    label: soll.label,
    fieldType: soll.fieldType,
    groupName: soll.groupName,
  }
  if (soll.options) {
    const zusammen = new Map<string, HubspotOption>()
    for (const o of ist.options || []) zusammen.set(o.value, o)
    soll.options.forEach((o, i) => zusammen.set(o.value, { ...o, displayOrder: i }))
    body.options = [...zusammen.values()]
  }
  const res = await hsFetch(`/crm/v3/properties/contacts/${soll.name}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    throw new Error(`Property "${soll.name}" aktualisieren fehlgeschlagen: ${res.status} ${await res.text()}`)
  }
}

// ── Offline-Vorschau (ohne Token) ──────────────────────────────────────────
function offlineVorschau(): void {
  console.log(c.fett("\nOffline-Vorschau (kein Token gesetzt) — es wird NICHTS an HubSpot gesendet.\n"))
  console.log(`Zielgruppe: ${PROPERTY_GRUPPE.label} (${PROPERTY_GRUPPE.name})\n`)
  for (const feld of FELDER) {
    const p = bauePayload(feld)
    const opt = p.options ? `  [${p.options.map((o) => o.value).join(", ")}]` : ""
    console.log(`  • ${p.name}  ${c.grau(`(${p.type}/${p.fieldType})`)}  → ${p.label}${c.grau(opt)}`)
  }
  console.log(
    c.gelb(
      `\n${FELDER.length} Properties definiert. Zum Ausführen HUBSPOT_PRIVATE_APP_TOKEN setzen.`,
    ),
  )
}

// ── Hauptlauf ──────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  console.log(c.fett("HubSpot Property-Sync — Portal 146440145"))
  if (DRY_RUN) console.log(c.gelb("Modus: --dry-run (keine Schreibvorgänge)\n"))

  if (!TOKEN) {
    offlineVorschau()
    return
  }

  await stelleGruppeSicher()
  const vorhandene = await ladeVorhandene()

  const angelegt: string[] = []
  const geaendert: string[] = []
  const unveraendert: string[] = []

  for (const feld of FELDER) {
    const soll = bauePayload(feld)
    const ist = vorhandene.get(feld.hubspotName)

    if (!ist) {
      if (DRY_RUN) {
        console.log(c.gelb(`[dry-run] anlegen:      ${feld.hubspotName}`))
      } else {
        await legeAn(soll)
        console.log(c.gruen(`angelegt:       ${feld.hubspotName}`))
      }
      angelegt.push(feld.hubspotName)
      continue
    }

    const gruende = weichtAb(soll, ist)
    if (gruende.length === 0) {
      unveraendert.push(feld.hubspotName)
      continue
    }

    if (DRY_RUN) {
      console.log(c.gelb(`[dry-run] aktualisieren: ${feld.hubspotName}  ${c.grau(gruende.join(", "))}`))
    } else {
      await aktualisiere(soll, ist)
      console.log(c.gruen(`aktualisiert:   ${feld.hubspotName}  ${c.grau(gruende.join(", "))}`))
    }
    geaendert.push(feld.hubspotName)
  }

  console.log(c.fett("\n── Zusammenfassung ──"))
  console.log(`  Angelegt:      ${angelegt.length}  ${c.grau(angelegt.join(", "))}`)
  console.log(`  Aktualisiert:  ${geaendert.length}  ${c.grau(geaendert.join(", "))}`)
  console.log(`  Unverändert:   ${unveraendert.length}  ${c.grau(unveraendert.join(", "))}`)
  if (DRY_RUN) console.log(c.gelb("\nHinweis: --dry-run — es wurde nichts geschrieben."))
}

main().catch((err) => {
  console.error(c.rot(`\nFehler: ${err instanceof Error ? err.message : String(err)}`))
  process.exit(1)
})
