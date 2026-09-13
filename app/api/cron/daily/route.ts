import { NextResponse } from "next/server"
import { cronAutorisiert, istDryRun } from "@/lib/cron/auth"
import { runAlle } from "@/lib/cron/jobs"

/**
 * GET /api/cron/daily
 * Orchestrator: ruft alle Teiljobs in fester Reihenfolge auf (Hobby-Plan:
 * ein täglicher Cron um 07:30 UTC). Jeder Teiljob prüft selbst Wochentag/
 * Zeitfenster. ?dry=1 = Dry-Run.
 */
export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(request: Request): Promise<Response> {
  if (!cronAutorisiert(request)) return NextResponse.json({ ok: false, message: "Nicht autorisiert." }, { status: 401 })
  const dryRun = istDryRun(request)
  const ergebnisse = await runAlle({ dryRun })
  return NextResponse.json({ ok: true, dry: dryRun, ergebnisse })
}
