import { type NextRequest, NextResponse } from "next/server"

/**
 * POST /api/hubspot
 * Receives form data from the client and forwards it to HubSpot Forms REST API.
 * Returns { ok: boolean; message: string } as JSON in **every** case.
 */
export async function POST(request: NextRequest) {
  try {
    const {
      firstname,
      email,
      phone,
      message,
      pageUri,
      pageName,
      hutk,
    }: {
      firstname?: string
      email?: string
      phone?: string
      message?: string
      pageUri?: string
      pageName?: string
      hutk?: string
    } = await request.json()

    // ------------------------------------------------------------------
    // 1 ) Validate required fields
    // ------------------------------------------------------------------
    if (!firstname || !email || !phone) {
      return NextResponse.json({ ok: false, message: "Name, E-Mail und Telefon sind erforderlich." }, { status: 400 })
    }

    // ------------------------------------------------------------------
    // 2 ) Build HubSpot payload
    // ------------------------------------------------------------------
    const portalId = "146440145"
    const formId = "d2c03704-72cc-4dea-ae8a-8b22f90b1193"
    const hubspotUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`

    // only include non-empty context keys (HubSpot rejects empty strings)
    const context: Record<string, string> = {}
    if (hutk) context.hutk = hutk
    if (pageUri) context.pageUri = pageUri
    if (pageName) context.pageName = pageName

    // try to derive the visitor’s IP from the proxy header
    const forwardedFor = request.headers.get("x-forwarded-for") ?? ""
    const ip = forwardedFor.split(",")[0].trim()
    if (ip) context.ipAddress = ip

    const hubspotPayload = {
      fields: [
        { name: "firstname", value: firstname },
        { name: "email", value: email },
        { name: "phone", value: phone },
        { name: "message", value: message ?? "" },
      ],
      context,
    }

    // ------------------------------------------------------------------
    // 3 ) Send to HubSpot
    // ------------------------------------------------------------------
    // Keep a short timeout so upstream hiccups do not stall form completion UX.
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 12000)

    let hsRes: Response
    try {
      hsRes = await fetch(hubspotUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hubspotPayload),
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeoutId)
    }

    if (hsRes.ok) {
      return NextResponse.json({ ok: true, message: "Erfolgreich gesendet!" })
    }

    // HubSpot returned an error – forward reason for easier debugging
    const text = await hsRes.text()
    console.error("HubSpot API Error:", hsRes.status, text)
    return NextResponse.json(
      {
        ok: false,
        message: "Fehler beim Senden an HubSpot.",
        hubspotStatus: hsRes.status,
      },
      { status: 502 },
    )
  } catch (err: unknown) {
    console.error("Server Error:", err)
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json(
        {
          ok: false,
          message: "Zeitueberschreitung bei HubSpot. Bitte erneut versuchen.",
        },
        { status: 504 },
      )
    }
    return NextResponse.json(
      {
        ok: false,
        message: "Server-Fehler beim Verarbeiten der Anfrage.",
      },
      { status: 500 },
    )
  }
}
