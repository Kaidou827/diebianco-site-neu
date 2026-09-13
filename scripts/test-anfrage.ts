/**
 * scripts/test-anfrage.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Schickt EINE Testanfrage (Welle 1) gegen die lokal laufende API.
 * Voraussetzung: `pnpm dev` läuft und .env.local ist gesetzt
 * (HUBSPOT_PRIVATE_APP_TOKEN + SMTP_*), damit Kontakt/Aufgabe/Mails entstehen.
 *
 * Nutzung:  pnpm test:anfrage            (Default http://localhost:3000)
 *           BASE_URL=… pnpm test:anfrage
 *
 * Es wird bewusst eine eindeutige Wegwerf-Adresse verwendet:
 *   test+<timestamp>@foundryone.de
 * ─────────────────────────────────────────────────────────────────────────
 */

const BASE = process.env.BASE_URL || "http://localhost:3000"
const email = `test+${Date.now()}@foundryone.de`

const payload = {
  welle: 1,
  variante: "standard",
  firstname: "TEST",
  lastname: "Foundryone",
  phone: "0174 3091973",
  email,
  wunsch_behandlung: "balayage",
  wunschzeitraum: "vormittags",
  whatsapp_ok: "ja_gerne",
  nachricht: "Automatische Testanfrage – bitte ignorieren.",
  einwilligung_marketing: true,
  quelle_seite: "/kontakt",
}

async function main() {
  console.log(`→ POST ${BASE}/api/anfrage  (${email})`)
  const res = await fetch(`${BASE}/api/anfrage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const json = await res.json().catch(() => ({}))
  console.log(`← HTTP ${res.status}`)
  console.log(JSON.stringify(json, null, 2))
  if (!res.ok || !(json as { ok?: boolean }).ok) process.exit(1)
  const cid = (json as { contactId?: string }).contactId
  if (cid) {
    console.log(`\nKontakt: https://app-eu1.hubspot.com/contacts/146440145/record/0-1/${cid}`)
  }
}

main().catch((err) => {
  console.error("Testanfrage fehlgeschlagen:", err)
  process.exit(1)
})
