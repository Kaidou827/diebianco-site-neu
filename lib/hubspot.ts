/**
 * lib/hubspot.ts
 * ─────────────────────────────────────────────────────────────────────────
 * EINZIGE Stelle mit HubSpot-CRM-Zugriffen (fetch, kein SDK).
 * Portal 146440145 (EU). Auth über HUBSPOT_PRIVATE_APP_TOKEN.
 *
 * Kapselt: Kontakt suchen / lesen / anlegen / aktualisieren und
 * Rückruf-Aufgaben anlegen (Association Task→Contact, Typ 204).
 * ─────────────────────────────────────────────────────────────────────────
 */

const API_BASE = process.env.HUBSPOT_API_BASE || "https://api.hubapi.com"
const TOKEN = process.env.HUBSPOT_PRIVATE_APP_TOKEN || ""

/** Portal-ID für Deep-Links in den Team-Mails. */
export const HUBSPOT_PORTAL_ID = "146440145"

/** HubSpot-definierter Association-Typ Task → Contact. */
export const ASSOC_TASK_ZU_CONTACT = 204

/** Ist der HubSpot-Zugriff konfiguriert (Token vorhanden)? */
export function hubspotKonfiguriert(): boolean {
  return TOKEN.length > 0
}

/** Deep-Link zum Kontakt-Datensatz (EU-Cluster). */
export function kontaktDeepLink(id: string): string {
  return `https://app-eu1.hubspot.com/contacts/${HUBSPOT_PORTAL_ID}/record/0-1/${id}`
}

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

/** Kontakt-ID per E-Mail finden (Upsert-Schlüssel). null = nicht vorhanden. */
export async function sucheKontaktId(email: string): Promise<string | null> {
  const res = await hsFetch("/crm/v3/objects/contacts/search", {
    method: "POST",
    body: JSON.stringify({
      filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: email }] }],
      properties: ["email"],
      limit: 1,
    }),
  })
  if (!res.ok) throw new Error(`Kontaktsuche fehlgeschlagen: ${res.status} ${await res.text()}`)
  const json = (await res.json()) as { results?: Array<{ id: string }> }
  return json.results?.[0]?.id ?? null
}

export interface KontaktZeile {
  id: string
  properties: Record<string, string | null>
}

export interface SucheOptionen {
  filterGroups: unknown[]
  properties: string[]
  sorts?: unknown[]
  limit?: number
  after?: string
}

/** Eine Seite der Kontakt-Suche (Search API mit Filtern). */
export async function sucheKontakte(
  opt: SucheOptionen,
): Promise<{ results: KontaktZeile[]; after?: string; total: number }> {
  const res = await hsFetch("/crm/v3/objects/contacts/search", {
    method: "POST",
    body: JSON.stringify({
      filterGroups: opt.filterGroups,
      properties: opt.properties,
      sorts: opt.sorts,
      limit: opt.limit ?? 100,
      after: opt.after,
    }),
  })
  if (!res.ok) throw new Error(`Kontaktsuche fehlgeschlagen: ${res.status} ${await res.text()}`)
  const json = (await res.json()) as {
    results?: KontaktZeile[]
    total?: number
    paging?: { next?: { after?: string } }
  }
  return { results: json.results ?? [], after: json.paging?.next?.after, total: json.total ?? 0 }
}

/**
 * Alle Treffer der Suche paginiert einsammeln (mit Seiten-Obergrenze als
 * Sicherheitsnetz, damit nie „alle Kontakte" unkontrolliert geladen werden).
 */
export async function sucheKontakteAlle(opt: SucheOptionen, maxSeiten = 25): Promise<KontaktZeile[]> {
  const alle: KontaktZeile[] = []
  let after = opt.after
  for (let i = 0; i < maxSeiten; i++) {
    const seite = await sucheKontakte({ ...opt, after })
    alle.push(...seite.results)
    if (!seite.after) break
    after = seite.after
  }
  return alle
}

/** Ausgewählte Properties eines Kontakts lesen (für Idempotenz-Check). */
export async function leseKontakt(id: string, properties: string[]): Promise<Record<string, string | null>> {
  const query = properties.length ? `?properties=${properties.join(",")}` : ""
  const res = await hsFetch(`/crm/v3/objects/contacts/${id}${query}`, { method: "GET" })
  if (!res.ok) throw new Error(`Kontakt lesen fehlgeschlagen: ${res.status} ${await res.text()}`)
  const json = (await res.json()) as { properties?: Record<string, string | null> }
  return json.properties ?? {}
}

/** Neuen Kontakt anlegen → gibt die Kontakt-ID zurück. */
export async function erstelleKontakt(properties: Record<string, string>): Promise<string> {
  const res = await hsFetch("/crm/v3/objects/contacts", {
    method: "POST",
    body: JSON.stringify({ properties }),
  })
  if (!res.ok) throw new Error(`Kontakt anlegen fehlgeschlagen: ${res.status} ${await res.text()}`)
  const json = (await res.json()) as { id: string }
  return json.id
}

/** Bestehenden Kontakt aktualisieren. */
export async function aktualisiereKontakt(id: string, properties: Record<string, string>): Promise<void> {
  const res = await hsFetch(`/crm/v3/objects/contacts/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ properties }),
  })
  if (!res.ok) throw new Error(`Kontakt aktualisieren fehlgeschlagen: ${res.status} ${await res.text()}`)
}

export interface AufgabeEingabe {
  contactId: string
  subject: string
  body: string
  /** Fällig-Zeitpunkt als Epoch-ms. */
  timestampMs: number
  priority: "HIGH" | "MEDIUM" | "LOW"
  ownerId: string
  type?: string
}

export interface AufgabeErgebnis {
  ok: boolean
  id?: string
  status?: number
  fehler?: string
}

/**
 * Rückruf-Aufgabe anlegen und direkt mit dem Kontakt verknüpfen.
 * Wirft NIE — Fehler (z. B. 403 fehlender crm.objects.tasks-Scope) werden als
 * Ergebnis zurückgegeben, damit der restliche Ablauf (Mails) weiterläuft.
 */
export async function erstelleAufgabe(a: AufgabeEingabe): Promise<AufgabeErgebnis> {
  try {
    const res = await hsFetch("/crm/v3/objects/tasks", {
      method: "POST",
      body: JSON.stringify({
        properties: {
          hs_task_subject: a.subject,
          hs_task_body: a.body,
          hs_task_status: "NOT_STARTED",
          hs_task_type: a.type || "CALL",
          hs_task_priority: a.priority,
          hs_timestamp: String(a.timestampMs),
          hubspot_owner_id: a.ownerId,
        },
        associations: [
          {
            to: { id: a.contactId },
            types: [
              {
                associationCategory: "HUBSPOT_DEFINED",
                associationTypeId: ASSOC_TASK_ZU_CONTACT,
              },
            ],
          },
        ],
      }),
    })
    if (!res.ok) {
      const text = await res.text()
      return { ok: false, status: res.status, fehler: text.slice(0, 300) }
    }
    const json = (await res.json()) as { id?: string }
    return { ok: true, id: json.id }
  } catch (err) {
    return { ok: false, fehler: err instanceof Error ? err.message : String(err) }
  }
}
