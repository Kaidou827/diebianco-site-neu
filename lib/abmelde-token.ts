/**
 * lib/abmelde-token.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Signierter Abmelde-Token für Marketing-Mails: HMAC-SHA256 über die
 * Kontakt-ID mit ABMELDE_SECRET. Format:  {contactId}.{base64url(sig)}
 * Ohne gesetztes Secret werden keine Tokens erzeugt (Link entfällt).
 * ─────────────────────────────────────────────────────────────────────────
 */

import crypto from "node:crypto"

const SECRET = process.env.ABMELDE_SECRET || ""

function b64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function signatur(contactId: string): string {
  return b64url(crypto.createHmac("sha256", SECRET).update(contactId).digest())
}

/** Token erzeugen; leerer String, wenn kein Secret gesetzt ist. */
export function erstelleAbmeldeToken(contactId: string): string {
  if (!SECRET || !contactId) return ""
  return `${contactId}.${signatur(contactId)}`
}

/** Token prüfen; gibt die Kontakt-ID zurück oder null bei ungültiger Signatur. */
export function pruefeAbmeldeToken(token: string): string | null {
  if (!SECRET || !token) return null
  const i = token.lastIndexOf(".")
  if (i <= 0) return null
  const id = token.slice(0, i)
  const sig = token.slice(i + 1)
  const erwartet = signatur(id)
  if (sig.length !== erwartet.length) return null
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(erwartet))) return null
  } catch {
    return null
  }
  return id
}
