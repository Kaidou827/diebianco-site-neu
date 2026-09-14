import { NextResponse } from "next/server"
import { cronAutorisiert, istDryRun } from "@/lib/cron/auth"
import { runReaktivierung } from "@/lib/cron/jobs"

/** GET /api/cron/reaktivierung – Reaktivierungsmail (Mo) an alte Leads mit Einwilligung. ?dry=1 = Dry-Run. */
export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(request: Request): Promise<Response> {
  if (!cronAutorisiert(request)) return NextResponse.json({ ok: false, message: "Nicht autorisiert." }, { status: 401 })
  const ergebnis = await runReaktivierung({ dryRun: istDryRun(request) })
  return NextResponse.json({ ok: true, ergebnis })
}
