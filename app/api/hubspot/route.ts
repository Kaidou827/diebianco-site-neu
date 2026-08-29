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
      wunschleistung,
      honeypot,
      turnstileToken,
      spamProtectionRequired,
    }: {
      firstname?: string
      email?: string
      phone?: string
      message?: string
      pageUri?: string
      pageName?: string
      hutk?: string
      wunschleistung?: string
      honeypot?: string
      turnstileToken?: string
      spamProtectionRequired?: boolean
    } = await request.json()

    // ------------------------------------------------------------------
    // 1 ) Validate required fields
    // ------------------------------------------------------------------
    if (!firstname || !email || !phone) {
      return NextResponse.json({ ok: false, message: "Name, E-Mail und Telefon sind erforderlich." }, { status: 400 })
    }

    // ------------------------------------------------------------------
    // 1.5 ) Anti-spam checks for protected forms
    // ------------------------------------------------------------------
    if (spamProtectionRequired) {
      if (honeypot && honeypot.trim().length > 0) {
        return NextResponse.json({ ok: false, message: "Anfrage konnte nicht validiert werden." }, { status: 400 })
      }

      if (!turnstileToken) {
        return NextResponse.json({ ok: false, message: "Bitte CAPTCHA-Validierung abschliessen." }, { status: 400 })
      }

      const turnstileSecret = process.env.TURNSTILE_SECRET_KEY
      if (!turnstileSecret) {
        console.warn("TURNSTILE_SECRET_KEY is missing; skipping CAPTCHA verification.")
      } else {
        const forwardedFor = request.headers.get("x-forwarded-for") ?? ""
        const ip = forwardedFor.split(",")[0].trim()

        const verificationBody = new URLSearchParams({
          secret: turnstileSecret,
          response: turnstileToken,
        })
        if (ip) verificationBody.append("remoteip", ip)

        const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: verificationBody.toString(),
        })

        const turnstileJson = (await turnstileRes.json()) as { success?: boolean }
        if (!turnstileJson.success) {
          return NextResponse.json({ ok: false, message: "CAPTCHA-Validierung fehlgeschlagen." }, { status: 400 })
        }
      }
    }

    // ------------------------------------------------------------------
    // 2 ) Send to inbox email (best effort)
    // ------------------------------------------------------------------
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = Number(process.env.SMTP_PORT)
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const smtpSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465
    const mailFrom = process.env.MAIL_FROM || smtpUser
    const defaultRecipients = ["salon@diebianco.de", "scharam.saleh@gmail.com"]
    const configuredRecipients =
      process.env.MAIL_TO
        ?.split(/[;,]/)
        .map((value) => value.trim())
        .filter(Boolean) ?? []
    const mailTo = configuredRecipients.length > 0 ? configuredRecipients : defaultRecipients

    const missingSmtpVars: string[] = []
    if (!smtpHost) missingSmtpVars.push("SMTP_HOST")
    if (!smtpPort || Number.isNaN(smtpPort)) missingSmtpVars.push("SMTP_PORT")
    if (!smtpUser) missingSmtpVars.push("SMTP_USER")
    if (!smtpPass) missingSmtpVars.push("SMTP_PASS")
    if (!mailFrom) missingSmtpVars.push("MAIL_FROM")
    const smtpConfigured = missingSmtpVars.length === 0

    const subjectPrefix = pageName ? `[${pageName}]` : "[Website Formular]"
    const textBody = [
      "Neue Formularanfrage",
      "",
      `Name: ${firstname}`,
      `E-Mail: ${email}`,
      `Telefon: ${phone}`,
      `Wunschleistung: ${wunschleistung || "-"}`,
      `Nachricht: ${message || "-"}`,
      "",
      `Seite: ${pageName || "-"}`,
      `URL: ${pageUri || "-"}`,
      `HubSpot Cookie (hutk): ${hutk || "-"}`,
      `Zeitpunkt: ${new Date().toISOString()}`,
    ].join("\n")

    let emailSent = false
    let emailError = ""
    if (!smtpConfigured) {
      emailError = `Missing SMTP env vars: ${missingSmtpVars.join(", ")}`
      console.error(emailError)
    } else {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        })

        await transporter.sendMail({
          from: mailFrom,
          to: mailTo,
          replyTo: email,
          subject: `${subjectPrefix} Neue Anfrage von ${firstname}`,
          text: textBody,
        })
        emailSent = true
      } catch (emailErr: unknown) {
        emailError = emailErr instanceof Error ? emailErr.message : "Unknown SMTP error"
        console.error("SMTP email send failed:", emailErr)
      }
    }

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
        { name: "wunschleistung", value: wunschleistung ?? "" },
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

    if (!emailSent) {
      const reason = emailError ? ` (${emailError})` : ""
      return NextResponse.json(
        {
          ok: false,
          message: `E-Mail Versand fehlgeschlagen. Bitte SMTP-Einstellungen in Vercel pruefen.${reason}`,
          emailSent: false,
          emailError,
        },
        { status: 502 },
      )
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
