/**
 * scripts/backfill-letzte-anfrage.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Einmal-Skript: setzt `letzte_anfrage_am = createdate` für ALLE Kontakte,
 * die noch keinen Wert haben (z. B. Bestandskontakte vor diesem Feature).
 *
 * DRY-RUN ist Standard – es wird nichts geschrieben. Echter Lauf nur mit
 * `--execute`. NICHT automatisch ausführen; wird manuell mit Token gestartet.
 *
 *   pnpm backfill:letzte-anfrage                # Dry-Run (zeigt nur)
 *   pnpm backfill:letzte-anfrage -- --execute   # schreibt tatsächlich
 *
 * Benötigt HUBSPOT_PRIVATE_APP_TOKEN (Portal 146440145). Token NIE committen.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { sucheKontakteAlle, aktualisiereKontakt, hubspotKonfiguriert } from "../lib/hubspot.ts"
import { parseHubspotMs } from "../lib/cron/logik.ts"

const EXECUTE = process.argv.includes("--execute")

async function main(): Promise<void> {
  console.log("Backfill letzte_anfrage_am — Portal 146440145")
  if (!hubspotKonfiguriert()) {
    console.error("HUBSPOT_PRIVATE_APP_TOKEN fehlt — Abbruch (nichts geschrieben).")
    process.exit(1)
  }
  console.log(
    EXECUTE
      ? "Modus: --execute (es wird geschrieben)\n"
      : "Modus: DRY-RUN (keine Schreibvorgänge). Für den echten Lauf: --execute\n",
  )

  const zeilen = await sucheKontakteAlle({
    filterGroups: [{ filters: [{ propertyName: "letzte_anfrage_am", operator: "NOT_HAS_PROPERTY" }] }],
    properties: ["createdate", "letzte_anfrage_am"],
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

  console.log(`Kontakte ohne letzte_anfrage_am gefunden: ${zeilen.length}`)
  console.log(`${EXECUTE ? "Gesetzt" : "Würde setzen"}: ${gesetzt}`)
  if (ohneCreatedate) console.log(`Ohne createdate übersprungen: ${ohneCreatedate}`)
  if (!EXECUTE) console.log("\nHinweis: DRY-RUN — es wurde nichts geschrieben. Mit --execute ausführen.")
}

main().catch((err) => {
  console.error("Fehler:", err instanceof Error ? err.message : String(err))
  process.exit(1)
})
