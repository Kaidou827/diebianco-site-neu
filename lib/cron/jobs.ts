/**
 * lib/cron/jobs.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Die eigentlichen Cron-Jobs (I/O). Jeder Job:
 *   - lädt per HubSpot-Search NUR die relevanten Kontakte (nie alle),
 *   - entscheidet mit der reinen Logik aus lib/cron/logik.ts,
 *   - sendet Mails über den geteilten Nodemailer-Transport (lib/mailer.ts),
 *   - schreibt Flags/Status als Unix-ms zurück,
 *   - respektiert dryRun (nur loggen, nichts senden/schreiben)
 *   - liefert eine Zählung: geprüft / gesendet / übersprungen / Fehler.
 * ─────────────────────────────────────────────────────────────────────────
 */

import {
  aktualisiereKontakt,
  erstelleAufgabe,
  kontaktDeepLink,
  sucheKontakteAlle,
  type KontaktZeile,
} from "@/lib/hubspot"
import {
  behandlungLabel,
  berlinHeuteUmMs,
  berlinMonat,
  berlinWochentag,
  zeitraumLabel,
} from "@/lib/lead-logic"
import {
  naechsteNichtErreichtStufe,
  parseHubspotMs,
  parseZahl,
  sollReaktivieren,
  sollReviewMail,
  sortiereDigest,
  tageSeit,
  terminAktionen,
} from "@/lib/cron/logik"
import {
  digestMail,
  nichtErreichtMail,
  reaktivierungMail,
  reviewMail,
  terminBestaetigungMail,
  terminErinnerungMail,
  type DigestMailZeile,
} from "@/lib/email-texts"
import { sendeMail, MAIL_REPLYTO } from "@/lib/mailer"
import { salonEmail } from "@/lib/site-info"
import { erstelleAbmeldeToken } from "@/lib/abmelde-token"

const OWNER_ID = process.env.HUBSPOT_DEFAULT_OWNER_ID || "81184186"
const SITE = process.env.SITE_URL || "https://www.diebianco.de"
const MEETINGS_LINK = process.env.MEETINGS_LINK_RUECKRUF || ""
const REVIEW_AKTIV = process.env.REVIEW_MAIL_ENABLED === "true"
const GOOGLE_REVIEW_URL = process.env.GOOGLE_REVIEW_URL || ""
// Terminbestätigung/-erinnerung (Job 3a/3b): standardmäßig AUS, da StudioLution
// die Termin-Erinnerung rund um den Termin selbst verschickt. Status-Aufgabe (3c)
// und Bewertungsbitte (3d) laufen davon unabhängig.
const TERMIN_MAILS_AKTIV = process.env.TERMIN_MAILS_ENABLED === "true"

export interface JobOptionen {
  dryRun: boolean
  now?: Date
}

export interface JobErgebnis {
  job: string
  geprueft: number
  gesendet: number
  uebersprungen: number
  fehler: number
  dry: boolean
  hinweis?: string
}

function leer(job: string, dry: boolean, hinweis?: string): JobErgebnis {
  return { job, geprueft: 0, gesendet: 0, uebersprungen: 0, fehler: 0, dry, hinweis }
}

function kuerze(s: string, n: number): string {
  const t = (s || "").trim()
  return t.length > n ? t.slice(0, n - 1).trimEnd() + "…" : t
}

function abmeldeUrl(id: string): string | undefined {
  const t = erstelleAbmeldeToken(id)
  return t ? `${SITE}/api/abmelden?t=${encodeURIComponent(t)}` : undefined
}

function prop(z: KontaktZeile, name: string): string {
  return z.properties[name] ?? ""
}

// ── Job 1: Digest ───────────────────────────────────────────────────────────
export async function runDigest(opts: JobOptionen): Promise<JobErgebnis> {
  const now = opts.now ?? new Date()
  if (berlinWochentag(now) === 7) return leer("digest", opts.dryRun, "Sonntag – übersprungen")

  const zeilen = await sucheKontakteAlle({
    filterGroups: [
      { filters: [{ propertyName: "lead_status_intern", operator: "IN", values: ["neu", "nicht_erreicht"] }] },
    ],
    properties: [
      "firstname", "wunsch_behandlung", "wunschzeitraum", "phone",
      "nachricht_anfrage", "prioritaet", "createdate", "lead_status_intern",
    ],
  })

  const sortiert = sortiereDigest(
    zeilen.map((z) => ({ id: z.id, prioritaet: prop(z, "prioritaet"), createdateMs: parseHubspotMs(prop(z, "createdate")), zeile: z })),
  )

  if (sortiert.length === 0) {
    console.log("[digest] geprüft=0 – keine offenen Leads, keine Mail")
    return leer("digest", opts.dryRun)
  }

  const mailZeilen: DigestMailZeile[] = sortiert.map(({ zeile, createdateMs }) => ({
    vorname: prop(zeile, "firstname") || "—",
    behandlung: behandlungLabel(prop(zeile, "wunsch_behandlung")),
    zeitraum: zeitraumLabel(prop(zeile, "wunschzeitraum")),
    telefon: prop(zeile, "phone") || "—",
    tage: tageSeit(createdateMs, now.getTime()),
    nachricht: kuerze(prop(zeile, "nachricht_anfrage"), 80),
    deepLink: kontaktDeepLink(zeile.id),
  }))

  const datum = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin", weekday: "short", day: "2-digit", month: "2-digit", year: "numeric",
  }).format(now)

  let gesendet = 0
  const fehlerAnzahl = { n: 0 }
  if (!opts.dryRun) {
    try {
      const ok = await sendeMail({ to: salonEmail, inhalt: digestMail({ datum, zeilen: mailZeilen }) })
      gesendet = ok ? 1 : 0
    } catch (err) {
      console.error("[digest] Mailversand fehlgeschlagen:", err)
      fehlerAnzahl.n++
    }
  }
  console.log(`[digest] geprüft=${mailZeilen.length} gesendet=${gesendet} dry=${opts.dryRun}`)
  return { job: "digest", geprueft: mailZeilen.length, gesendet, uebersprungen: 0, fehler: fehlerAnzahl.n, dry: opts.dryRun }
}

// ── Job 2: Nicht erreicht ────────────────────────────────────────────────────
export async function runNichtErreicht(opts: JobOptionen): Promise<JobErgebnis> {
  const now = opts.now ?? new Date()
  const erg = leer("nicht-erreicht", opts.dryRun)

  // Reset-Pass: Kontakte mit gesetztem Anker, deren Status weg von nicht_erreicht
  // gewechselt ist → Anker leeren + Zähler auf 0 (ein späteres erneutes
  // „nicht erreicht" beginnt damit neu zu zählen).
  const zurueckzusetzen = await sucheKontakteAlle({
    filterGroups: [
      {
        filters: [
          { propertyName: "nicht_erreicht_seit", operator: "HAS_PROPERTY" },
          { propertyName: "lead_status_intern", operator: "NEQ", value: "nicht_erreicht" },
        ],
      },
    ],
    properties: ["lead_status_intern", "nicht_erreicht_seit"],
  })
  for (const z of zurueckzusetzen) {
    erg.geprueft++
    if (opts.dryRun) { erg.uebersprungen++; continue }
    try {
      await aktualisiereKontakt(z.id, { nicht_erreicht_seit: "", nicht_erreicht_mails_gesendet: "0" })
      erg.uebersprungen++
    } catch (err) {
      console.error(`[nicht-erreicht/reset] Kontakt ${z.id} fehlgeschlagen:`, err)
      erg.fehler++
    }
  }

  // Haupt-Pass: aktuell nicht erreichte Kontakte (mit E-Mail).
  const zeilen = await sucheKontakteAlle({
    filterGroups: [
      {
        filters: [
          { propertyName: "lead_status_intern", operator: "EQ", value: "nicht_erreicht" },
          { propertyName: "email", operator: "HAS_PROPERTY" },
        ],
      },
    ],
    properties: [
      "firstname", "phone", "email", "wunschzeitraum",
      "nicht_erreicht_mails_gesendet", "nicht_erreicht_seit", "lead_status_intern",
    ],
  })

  for (const z of zeilen) {
    erg.geprueft++
    const email = prop(z, "email")
    const ankerMs = parseHubspotMs(prop(z, "nicht_erreicht_seit"))

    // Noch kein Anker → jetzt stempeln; diese Runde nichts senden (48 h / 5 Tage
    // rechnen ab diesem Stempel).
    if (ankerMs == null) {
      if (!opts.dryRun) {
        try {
          await aktualisiereKontakt(z.id, { nicht_erreicht_seit: String(now.getTime()) })
        } catch (err) {
          console.error(`[nicht-erreicht/stempel] Kontakt ${z.id} fehlgeschlagen:`, err)
          erg.fehler++
          continue
        }
      }
      erg.uebersprungen++
      continue
    }

    const stufe = naechsteNichtErreichtStufe({
      status: prop(z, "lead_status_intern"),
      ankerMs,
      counter: parseZahl(prop(z, "nicht_erreicht_mails_gesendet")),
      nowMs: now.getTime(),
      hasEmail: Boolean(email),
    })
    if (!stufe) { erg.uebersprungen++; continue }
    if (opts.dryRun) { erg.gesendet++; continue }
    try {
      await sendeMail({
        to: email,
        replyTo: MAIL_REPLYTO,
        inhalt: nichtErreichtMail({
          firstname: prop(z, "firstname"),
          telefon: prop(z, "phone"),
          wunschzeitraum: prop(z, "wunschzeitraum"),
          stufe,
          meetingsLink: MEETINGS_LINK || undefined,
          abmeldeUrl: abmeldeUrl(z.id),
        }),
      })
      await aktualisiereKontakt(z.id, { nicht_erreicht_mails_gesendet: String(stufe) })
      erg.gesendet++
    } catch (err) {
      console.error(`[nicht-erreicht] Kontakt ${z.id} fehlgeschlagen:`, err)
      erg.fehler++
    }
  }
  console.log(`[nicht-erreicht] geprüft=${erg.geprueft} gesendet=${erg.gesendet} übersprungen=${erg.uebersprungen} fehler=${erg.fehler} dry=${opts.dryRun}`)
  return erg
}

// ── Job 3: Termine (Bestätigung / Erinnerung / Status-Aufgabe / Bewertung) ──
export async function runTermine(opts: JobOptionen): Promise<JobErgebnis> {
  const now = opts.now ?? new Date()
  const erg = leer("termine", opts.dryRun)

  // 3a–c: offene Termine
  const offene = await sucheKontakteAlle({
    filterGroups: [
      {
        filters: [
          { propertyName: "lead_status_intern", operator: "EQ", value: "termin_vereinbart" },
          { propertyName: "termin_datum", operator: "HAS_PROPERTY" },
        ],
      },
    ],
    properties: [
      "firstname", "email", "wunsch_behandlung", "termin_datum", "lead_status_intern",
      "termin_bestaetigung_gesendet", "termin_erinnerung_gesendet", "termin_status_aufgabe_gesendet",
    ],
  })

  for (const z of offene) {
    erg.geprueft++
    const terminMs = parseHubspotMs(prop(z, "termin_datum"))
    const akt = terminAktionen({
      status: prop(z, "lead_status_intern"),
      terminMs,
      bestaetigungGesendet: Boolean(prop(z, "termin_bestaetigung_gesendet")),
      erinnerungGesendet: Boolean(prop(z, "termin_erinnerung_gesendet")),
      nowMs: now.getTime(),
    })
    const aufgabeGesendet = Boolean(prop(z, "termin_status_aufgabe_gesendet"))
    const email = prop(z, "email")
    // Mails nur mit E-Mail-Adresse UND wenn der Schalter an ist; die Status-Aufgabe geht immer.
    const bestaetigen = akt.bestaetigen && Boolean(email) && TERMIN_MAILS_AKTIV
    const erinnern = akt.erinnern && Boolean(email) && TERMIN_MAILS_AKTIV
    if (!bestaetigen && !erinnern && !(akt.aufgabe && !aufgabeGesendet)) {
      erg.uebersprungen++
      continue
    }
    try {
      const firstname = prop(z, "firstname")
      const behandlung = prop(z, "wunsch_behandlung")
      if (bestaetigen) {
        if (!opts.dryRun) {
          await sendeMail({
            to: email,
            replyTo: MAIL_REPLYTO,
            inhalt: terminBestaetigungMail({ firstname, behandlung, terminMs: terminMs as number, abmeldeUrl: abmeldeUrl(z.id) }),
          })
          await aktualisiereKontakt(z.id, { termin_bestaetigung_gesendet: String(now.getTime()) })
        }
        erg.gesendet++
      }
      if (erinnern) {
        if (!opts.dryRun) {
          await sendeMail({
            to: email,
            replyTo: MAIL_REPLYTO,
            inhalt: terminErinnerungMail({ firstname, behandlung, terminMs: terminMs as number, abmeldeUrl: abmeldeUrl(z.id) }),
          })
          await aktualisiereKontakt(z.id, { termin_erinnerung_gesendet: String(now.getTime()) })
        }
        erg.gesendet++
      }
      if (akt.aufgabe && !aufgabeGesendet) {
        if (!opts.dryRun) {
          await erstelleAufgabe({
            contactId: z.id,
            subject: `Status setzen: erschienen / nicht erschienen – ${firstname || "Kundin"}`,
            body: `Termin liegt ≥ 2 Tage zurück und der Status ist noch „termin_vereinbart".\nBitte auf erschienen / nicht_erschienen setzen.\n${kontaktDeepLink(z.id)}`,
            timestampMs: berlinHeuteUmMs(17, 0, now),
            priority: "MEDIUM",
            ownerId: OWNER_ID,
            type: "TODO",
          })
          await aktualisiereKontakt(z.id, { termin_status_aufgabe_gesendet: String(now.getTime()) })
        }
        erg.gesendet++
      }
    } catch (err) {
      console.error(`[termine] Kontakt ${z.id} fehlgeschlagen:`, err)
      erg.fehler++
    }
  }

  // 3d: Bewertungsbitte (optional)
  if (REVIEW_AKTIV) {
    if (!GOOGLE_REVIEW_URL) {
      console.warn("[termine] REVIEW_MAIL_ENABLED=true, aber GOOGLE_REVIEW_URL fehlt – Bewertungsmails übersprungen.")
    } else {
      const erschienen = await sucheKontakteAlle({
        filterGroups: [
          {
            filters: [
              { propertyName: "lead_status_intern", operator: "EQ", value: "erschienen" },
              { propertyName: "einwilligung_marketing", operator: "EQ", value: "true" },
              { propertyName: "termin_datum", operator: "HAS_PROPERTY" },
              { propertyName: "review_mail_gesendet", operator: "NOT_HAS_PROPERTY" },
              { propertyName: "email", operator: "HAS_PROPERTY" },
            ],
          },
        ],
        properties: ["firstname", "email", "termin_datum", "review_mail_gesendet", "einwilligung_marketing", "lead_status_intern"],
      })
      for (const z of erschienen) {
        erg.geprueft++
        const ok = sollReviewMail({
          status: prop(z, "lead_status_intern"),
          terminMs: parseHubspotMs(prop(z, "termin_datum")),
          reviewGesendet: Boolean(prop(z, "review_mail_gesendet")),
          einwilligung: prop(z, "einwilligung_marketing") === "true",
          nowMs: now.getTime(),
        })
        if (!ok) { erg.uebersprungen++; continue }
        if (opts.dryRun) { erg.gesendet++; continue }
        try {
          await sendeMail({
            to: prop(z, "email"),
            replyTo: MAIL_REPLYTO,
            inhalt: reviewMail({ firstname: prop(z, "firstname"), googleReviewUrl: GOOGLE_REVIEW_URL, abmeldeUrl: abmeldeUrl(z.id) }),
          })
          await aktualisiereKontakt(z.id, { review_mail_gesendet: String(now.getTime()) })
          erg.gesendet++
        } catch (err) {
          console.error(`[termine/review] Kontakt ${z.id} fehlgeschlagen:`, err)
          erg.fehler++
        }
      }
    }
  }

  console.log(`[termine] geprüft=${erg.geprueft} gesendet=${erg.gesendet} übersprungen=${erg.uebersprungen} fehler=${erg.fehler} dry=${opts.dryRun}`)
  return erg
}

// ── Job 4: Reaktivierung ─────────────────────────────────────────────────────
export async function runReaktivierung(opts: JobOptionen): Promise<JobErgebnis> {
  const now = opts.now ?? new Date()
  if (berlinWochentag(now) !== 1) return leer("reaktivierung", opts.dryRun, "Nicht Montag – übersprungen")

  const cutoff = now.getTime() - 30 * 24 * 60 * 60 * 1000
  const zeilen = await sucheKontakteAlle({
    filterGroups: [
      {
        filters: [
          { propertyName: "einwilligung_marketing", operator: "EQ", value: "true" },
          { propertyName: "lead_status_intern", operator: "IN", values: ["neu", "nicht_erreicht", "kontaktiert"] },
          { propertyName: "reaktivierung_gesendet", operator: "NOT_HAS_PROPERTY" },
          { propertyName: "createdate", operator: "LTE", value: String(cutoff) },
          { propertyName: "email", operator: "HAS_PROPERTY" },
        ],
      },
    ],
    properties: ["firstname", "email", "createdate", "lead_status_intern", "einwilligung_marketing", "reaktivierung_gesendet"],
  })

  const farbSaison = [9, 10, 11].includes(berlinMonat(now))
  const erg = leer("reaktivierung", opts.dryRun)
  for (const z of zeilen) {
    erg.geprueft++
    const ok = sollReaktivieren({
      einwilligung: prop(z, "einwilligung_marketing") === "true",
      status: prop(z, "lead_status_intern"),
      createdateMs: parseHubspotMs(prop(z, "createdate")),
      reaktivierungGesendet: Boolean(prop(z, "reaktivierung_gesendet")),
      nowMs: now.getTime(),
    })
    if (!ok) { erg.uebersprungen++; continue }
    if (opts.dryRun) { erg.gesendet++; continue }
    try {
      await sendeMail({
        to: prop(z, "email"),
        replyTo: MAIL_REPLYTO,
        inhalt: reaktivierungMail({ firstname: prop(z, "firstname"), farbSaison, abmeldeUrl: abmeldeUrl(z.id) }),
      })
      await aktualisiereKontakt(z.id, {
        reaktivierung_gesendet: String(now.getTime()),
        lead_status_intern: "archiv",
      })
      erg.gesendet++
    } catch (err) {
      console.error(`[reaktivierung] Kontakt ${z.id} fehlgeschlagen:`, err)
      erg.fehler++
    }
  }
  console.log(`[reaktivierung] geprüft=${erg.geprueft} gesendet=${erg.gesendet} übersprungen=${erg.uebersprungen} fehler=${erg.fehler} dry=${opts.dryRun}`)
  return erg
}

// ── Orchestrator ─────────────────────────────────────────────────────────────
export async function runAlle(opts: JobOptionen): Promise<JobErgebnis[]> {
  const ergebnisse: JobErgebnis[] = []
  for (const job of [runDigest, runNichtErreicht, runTermine, runReaktivierung]) {
    try {
      ergebnisse.push(await job(opts))
    } catch (err) {
      console.error("[cron/daily] Job-Fehler:", err)
      ergebnisse.push({ job: job.name, geprueft: 0, gesendet: 0, uebersprungen: 0, fehler: 1, dry: opts.dryRun, hinweis: "Job abgebrochen" })
    }
  }
  return ergebnisse
}
