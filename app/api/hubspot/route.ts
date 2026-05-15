import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

/**
 * POST /api/hubspot
 * Receives form data from the client and sends it by email to the salon inbox.
 * Also forwards to HubSpot Forms REST API as a best-effort sync.
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
    // 2 ) Send to inbox email (required)
    // ------------------------------------------------------------------
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = Number(process.env.SMTP_PORT)
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const smtpSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465
    const mailFrom = process.env.MAIL_FROM || smtpUser
    const defaultRecipients = ["salon@diebianco.de", "techotastic@gmail.com", "scharam.saleh@gmail.com"]
    const configuredRecipients =
      process.env.MAIL_TO
        ?.split(/[;,]/)
        .map((value) => value.trim())
        .filter(Boolean) ?? []
    const mailTo = configuredRecipients.length > 0 ? configuredRecipients : defaultRecipients

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !mailFrom) {
      console.error("Missing SMTP env vars. Required: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM(optional).")
      return NextResponse.json(
        {
          ok: false,
          message: "E-Mail Versand ist nicht konfiguriert. Bitte Spaeter erneut versuchen.",
        },
        { status: 500 },
      )
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    const subjectPrefix = pageName ? `[${pageName}]` : "[Website Formular]"
    const textBody = [
      "Neue Formularanfrage",
      "",
      `Name: ${firstname}`,
      `E-Mail: ${email}`,
      `Telefon: ${phone}`,
      `Nachricht: ${message || "-"}`,
      "",
      `Seite: ${pageName || "-"}`,
      `URL: ${pageUri || "-"}`,
      `HubSpot Cookie (hutk): ${hutk || "-"}`,
      `Zeitpunkt: ${new Date().toISOString()}`,
    ].join("\n")

    await transporter.sendMail({
      from: mailFrom,
      to: mailTo,
      replyTo: email,
      subject: `${subjectPrefix} Neue Anfrage von ${firstname}`,
      text: textBody,
    })

    // ------------------------------------------------------------------
    // 3 ) Build HubSpot payload (best effort)
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
    // 4 ) Send to HubSpot (non-blocking for end users)
    // ------------------------------------------------------------------
    // Keep a short timeout so upstream latency does not stall form completion UX.
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

    if (!hsRes.ok) {
      // Email was already sent successfully. Keep user flow intact if HubSpot sync fails.
      const text = await hsRes.text()
      console.error("HubSpot API Error:", hsRes.status, text)
    }

    return NextResponse.json({ ok: true, message: "Erfolgreich gesendet!" })
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
        message: "Server-Fehler beim Verarbeiten der Anfrage oder beim E-Mail Versand.",
      },
      { status: 500 },
    )
  }
}
