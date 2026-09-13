/**
 * lib/mailer.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Gemeinsamer Nodemailer-Transport + Versand-Helfer für die Anfrage-Route
 * UND die Cron-Jobs. Absender „DIE BIANCO <termine@diebianco.de>",
 * Reply-To salon@diebianco.de. Kein Versand, wenn SMTP unvollständig ist.
 * ─────────────────────────────────────────────────────────────────────────
 */

import nodemailer from "nodemailer"
import type { EmailInhalt } from "@/lib/email-texts"

export const MAIL_EMPFAENGER = process.env.MAIL_TO
  ? process.env.MAIL_TO.split(/[;,]/).map((s) => s.trim()).filter(Boolean)
  : ["salon@diebianco.de", "scharam.saleh@gmail.com"]
export const MAIL_ABSENDER = process.env.MAIL_FROM || process.env.SMTP_USER || "termine@diebianco.de"
export const MAIL_ABSENDER_NAME = process.env.MAIL_FROM_NAME || "DIE BIANCO"
export const MAIL_FROM_FULL = `${MAIL_ABSENDER_NAME} <${MAIL_ABSENDER}>`
export const MAIL_REPLYTO = process.env.MAIL_REPLYTO || "salon@diebianco.de"

export function baueTransporter() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host || !port || Number.isNaN(port) || !user || !pass) {
    console.warn("SMTP unvollständig — E-Mail übersprungen.")
    return null
  }
  const secure = process.env.SMTP_SECURE === "true" || port === 465
  return nodemailer.createTransport({ host, port, secure, auth: { user, pass } })
}

/** Eine Mail senden. Gibt false zurück, wenn SMTP fehlt (kein Versand). */
export async function sendeMail(opts: {
  to: string | string[]
  replyTo?: string
  inhalt: EmailInhalt
}): Promise<boolean> {
  const transporter = baueTransporter()
  if (!transporter) return false
  await transporter.sendMail({
    from: MAIL_FROM_FULL,
    to: opts.to,
    replyTo: opts.replyTo,
    subject: opts.inhalt.subject,
    text: opts.inhalt.text,
    html: opts.inhalt.html,
  })
  return true
}
