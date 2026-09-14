import { pruefeAbmeldeToken } from "@/lib/abmelde-token"
import { aktualisiereKontakt, hubspotKonfiguriert } from "@/lib/hubspot"
import { abmeldeBestaetigungSeite } from "@/lib/email-texts"

/**
 * GET /api/abmelden?t={token}
 * Setzt einwilligung_marketing = false für die im signierten Token enthaltene
 * Kontakt-ID und zeigt eine schlichte Bestätigungsseite.
 */
export const dynamic = "force-dynamic"

export async function GET(request: Request): Promise<Response> {
  const token = new URL(request.url).searchParams.get("t") || ""
  const id = pruefeAbmeldeToken(token)
  let ok = false
  if (id && hubspotKonfiguriert()) {
    try {
      await aktualisiereKontakt(id, { einwilligung_marketing: "false" })
      ok = true
    } catch (err) {
      console.error("[abmelden] fehlgeschlagen:", err)
    }
  }
  return new Response(abmeldeBestaetigungSeite(ok), {
    status: ok ? 200 : 400,
    headers: { "content-type": "text/html; charset=utf-8" },
  })
}
