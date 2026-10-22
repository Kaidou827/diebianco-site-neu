/**
 * scripts/backfill-letzte-anfrage.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Einmal-Skript: setzt `letzte_anfrage_am = createdate` für Kontakte ohne Wert
 * (z. B. Bestandskontakte vor diesem Feature).
 *
 * Standard-Umfang: NUR aktive Leads (lead_status_intern ∈ neu/nicht_erreicht/
 * kontaktiert). Andere Status (v. a. kein_interesse) werden bewusst ausgelassen,
 * weil jeder Write hs_lastmodifieddate neu setzt und der Archiv-Cron
 * (kein_interesse ≥ 90 Tage) genau daran hängt – ein Voll-Backfill würde das
 * Archivieren für alle um bis zu 90 Tage verschieben. Mit `--alle` auch den Rest.
 *
 * DRY-RUN ist Standard – es wird nichts geschrieben. Echter Lauf nur mit
 * `--execute`. NICHT automatisch ausführen; wird manuell mit Token gestartet.
 *
 *   pnpm backfill:letzte-anfrage                      # Dry-Run, nur aktive Status
 *   pnpm backfill:letzte-anfrage -- --alle            # Dry-Run, alle Kontakte
 *   pnpm backfill:letzte-anfrage -- --execute         # schreibt (aktive Status)
 *   pnpm backfill:letzte-anfrage -- --alle --execute  # schreibt alle
 *
 * Benötigt HUBSPOT_PRIVATE_APP_TOKEN (Portal 146440145). Token NIE committen.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { sucheKontakteAlle, aktualisiereKontakt, hubspotKonfiguriert } from "../lib/hubspot.ts"
import { parseHubspotMs } from "../lib/cron/logik.ts"

const EXECUTE = process.argv.includes("--execute")
const ALLE = process.argv.includes("--alle")

// Standard-Umfang: nur aktive Leads. Andere Status (v. a. kein_interesse) werden
// ausgelassen, weil jeder Write hs_lastmodifieddate neu setzt und der Archiv-Cron
// (kein_interesse ≥ 90 Tage) genau daran hängt.
const AKTIV_STATUS = ["neu", "nicht_erreicht", "kontaktiert"]

async function main(): Promise<void> {
  console.log("Backfill letzte_anfrage_am — Portal 146440145")
  if (!hubspotKonfiguriert()) {
    console.error("HUBSPOT_PRIVATE_APP_TOKEN fehlt — Abbruch (nichts geschrieben).")
    process.exit(1)
  }
  console.log(EXECUTE ? "Modus: --execute (es wird geschrieben)" : "Modus: DRY-RUN (keine Schreibvorgänge). Für den echten Lauf: --execute")
  console.log(
    ALLE
      ? "Umfang: --alle (ALLE Kontakte ohne letzte_anfrage_am). ACHTUNG: setzt hs_lastmodifieddate neu → verschiebt den Archiv-Cron (kein_interesse ≥ 90 Tage) um bis zu 90 Tage.\n"
      : `Umfang: nur aktive Status ${AKTIV_STATUS.join("/")} (Standard; für den Rest: --alle).\n`,
  )

  const filters: Array<Record<string, unknown>> = [
    { propertyName: "letzte_anfrage_am", operator: "NOT_HAS_PROPERTY" },
  ]
  if (!ALLE) filters.push({ propertyName: "lead_status_intern", operator: "IN", values: AKTIV_STATUS })

  const zeilen = await sucheKontakteAlle({
    filterGroups: [{ filters }],
    properties: ["createdate", "letzte_anfrage_am", "lead_status_intern"],
  })

  let gesetzt = 0
  let ohneCreatedate = 0
  for (const z of zeilen) {
    const ms = parseHubspotMs(z.properties["createdate"])
    if (ms == null) {
      ohneCreatedate++
      continue
    }
    if (EXECUTE) {
      await aktualisiereKontakt(z.id, { letzte_anfrage_am: String(ms) })
    }
    gesetzt++
  }

  console.log(`Kontakte im Umfang ohne letzte_anfrage_am: ${zeilen.length}`)
  console.log(`${EXECUTE ? "Gesetzt" : "Würde setzen"}: ${gesetzt}`)
  if (ohneCreatedate) console.log(`Ohne createdate übersprungen: ${ohneCreatedate}`)
  if (!EXECUTE) console.log("\nHinweis: DRY-RUN — es wurde nichts geschrieben. Mit --execute ausführen.")
}

main().catch((err) => {
  console.error("Fehler:", err instanceof Error ? err.message : String(err))
  process.exit(1)
})
