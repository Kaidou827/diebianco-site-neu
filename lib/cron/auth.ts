/**
 * lib/cron/auth.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Absicherung der Cron-Routen. Vercel sendet bei Cron-Aufrufen automatisch
 * `Authorization: Bearer ${CRON_SECRET}`, wenn CRON_SECRET gesetzt ist.
 * Ohne gesetztes Secret bleibt die Route offen (nur lokal/Dev sinnvoll).
 * ─────────────────────────────────────────────────────────────────────────
 */

export function cronAutorisiert(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    console.warn("CRON_SECRET nicht gesetzt – Cron-Route ungeschützt (nur Dev).")
    return true
  }
  return (request.headers.get("authorization") || "") === `Bearer ${secret}`
}

export function istDryRun(request: Request): boolean {
  try {
    return new URL(request.url).searchParams.get("dry") === "1"
  } catch {
    return false
  }
}
