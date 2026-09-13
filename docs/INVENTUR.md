# INVENTUR – diebianco-site-neu

Reine Bestandsaufnahme (Stand der Analyse). **Kein Refactoring, keine Änderungen** an bestehendem Code. Grundlage für die Klärung offener Fragen vor weiteren Änderungen.

---

## 1 · Framework, Router, Rendering

| Punkt | Befund |
|---|---|
| Framework | **Next.js** `^15.2.6` (Build lief zuletzt mit 15.5.20), **React** `^19.2.3` |
| Router | **App Router** (`app/`-Verzeichnis; kein `pages/`) |
| Root-Layout | **`app/layout.tsx`** |
| Sprache/Styling | Tailwind CSS, `lang="de"`, Body-BG `rgb(180,177,170)` |
| `/kontakt` | **`app/kontakt/page.tsx`** – Server-Component (kein `"use client"`), **statisch vorgerendert** (○). Bindet Client-Components ein (AnfrageFormular, AnrufCta, KontaktStickyBar, AnrufPopup). |
| `/grey-blending-krefeld` | **`app/grey-blending-krefeld/page.tsx`** – Server-Component, **statisch** (○). Gleiche Struktur wie /kontakt, Formular als `variante="deep"`. |
| `/kontakt/danke` | Server-Component, **dynamisch** (ƒ) – liest `searchParams` (`Promise<{ name?: string }>`, Next-15-Async-API) für den Vornamen. |

Jede dieser Seiten hat zusätzlich ein eigenes `layout.tsx` (Metadata + HubSpot-Tracking-Script), z. B. `app/kontakt/layout.tsx`, `app/grey-blending-krefeld/layout.tsx`.

---

## 2 · API-Endpunkt `/api/anfrage`

**Datei:** `app/api/anfrage/route.ts` (POST-Handler, App-Router Route Handler).

### Payload
Unterscheidung über Feld **`welle`** (1 oder 2).

**Welle 1** (Kontakt anlegen/aktualisieren):
`welle`, `variante` ("standard" | "deep"), `firstname`, `lastname`, `phone`, `email`, `wunsch_behandlung`, `extra` (Objekt: `anmerkung_kundin`, `wunschzeitraum`), `honeypot`, `turnstileToken`, `spamProtectionRequired`.

**Welle 2** (einzelne Antwort nachschreiben):
`welle`, `contactId`, `updates` (Objekt `{ <hubspotName>: wert }`, z. B. `haarlaenge`, `farb_vorgeschichte`, `erreichbarkeit`, `whatsapp_ok`, `dringlichkeit`).

### HubSpot-Anbindung
- **Kein SDK – direkte `fetch`-Calls** gegen `https://api.hubapi.com` (Basis über `HUBSPOT_API_BASE` überschreibbar).
- Suche: `POST /crm/v3/objects/contacts/search` (Filter `email = …`, Upsert-Logik).
- Anlegen: `POST /crm/v3/objects/contacts`.
- Aktualisieren: `PATCH /crm/v3/objects/contacts/{id}`.
- **Auth:** Bearer-Token aus **`HUBSPOT_PRIVATE_APP_TOKEN`** (HubSpot Service-Schlüssel `pat-eu1-…`, Portal **146440145**, EU).
- **Property-Namen** (Schema in `lib/hubspot/schema.ts`, Allowlist `ERLAUBTE_FELDER` = alle außer `welle: "workflow"`):
  Standard: `firstname`, `lastname`, `phone`, `email`.
  Formular: `wunsch_behandlung`, `wunschzeitraum`, `anmerkung_kundin`, `haarlaenge`, `farb_vorgeschichte`, `foto_haare` (derzeit im Formular ausgeblendet), `erreichbarkeit`, `whatsapp_ok`, `dringlichkeit`.
  **Serverseitig gesetzt** (nicht aus dem Formular): `lead_status_intern` (=Neu), `prioritaet` (Baseline Mittel; in Welle 2 aus `dringlichkeit` → Hoch/Mittel/Niedrig), `lead_qualitaet` (Baseline Warm; Welle 2 → Heiß/Warm/Kalt).

### Benachrichtigungs-Mail
- **Provider: Nodemailer + SMTP** (`nodemailer ^8.0.7`). **Kein** Resend/SendGrid/Postmark.
- **SMTP:** `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` / `SMTP_USER` / `SMTP_PASS` (aktuell STRATO: `smtp.strato.de:465`, User `termine@diebianco.de`).
- **Absender:** `MAIL_FROM` || `SMTP_USER` || `salon@diebianco.de`, Anzeigename **„DIE BIANCO"** (`MAIL_FROM_NAME`).
- **Zwei Mails** (beide „best effort", blockieren die Response nicht):
  1. **Lead-Karte ans Team** (`sendeLeadKarte`) an **`MAIL_TO`** (Default `salon@diebianco.de,scharam.saleh@gmail.com`), Reply-To = E-Mail der Kundin.
  2. **Eingangsbestätigung an die Kundin** (`sendeKundenBestaetigung`), Reply-To = `MAIL_REPLYTO` (Default `salon@diebianco.de`).
- **Template:** **inline im Code** (Plain-Text in `route.ts`), **keine separate Template-Datei**.

### Redirect / dankeUrl
- **Der API-Endpunkt macht KEINEN Redirect.** Er antwortet mit `{ ok: true, contactId }`.
- Der Redirect auf **`/kontakt/danke`** passiert im **Formular-Component** (`window.location.assign(dankeUrl)`), gesteuert über den Prop `dankeUrl` (überall auf `/kontakt/danke` gesetzt). Die Danke-Seite ist das Ziel des Google-Ads-Ziel-URL-Conversion.

> Hinweis: Es existiert zusätzlich ein **älterer** Endpunkt `app/api/hubspot/route.ts` (Nodemailer + HubSpot **Forms-API**), der noch von `gemeinsam-erleben` und `mentoring` genutzt wird.

---

## 3 · Kontaktformular-Component

**Datei:** `components/AnfrageFormular.tsx` (`"use client"`). Wiederverwendbar über Props: `variante` ("standard"|"deep"), `theme` ("creme"|"dunkel"|"hell"), `chrome`, `dankeUrl`, `vorauswahlBehandlung`.

- **Zwei Phasen:** Phase A = *Behandlung wählen* → *Kontakt* (Vorname\*, Nachname [nur deep], Handynummer\*, E-Mail\*, **Nachricht** (optional, Textarea), **Wunschzeitraum**-Chips [nur standard]). Phase B (nur `deep`) = je eine Detailfrage (Haarlänge, Farb-Vorgeschichte, Erreichbarkeit, **WhatsApp**, Zeitrahmen) mit PATCH pro Antwort.
- **WhatsApp:** ist **kein Checkbox** im Kontaktschritt, sondern die **Phase-B-Frage `whatsapp_ok`** (Radio „Ja, gerne" / „Lieber anrufen", nur in der Deep-Variante). → siehe offene Fragen.
- **State:** `useState` – u. a. `daten` (Record aller Felder inkl. `nachricht`, `wunschzeitraum`), `phase`, `bIndex`, `contactId`, `isSubmitting`, `fehler`. Öffnungs-Status via `components/kontakt/useGeoeffnet.ts`.
- **Nach erfolgreichem `fetch`:**
  - Welle 1 → `contactId` merken. Deep mit Phase-B-Feldern → Phase „b". Sonst → `zumAbschluss()`: wenn `dankeUrl` gesetzt → **Redirect** `window.location.assign('/kontakt/danke?name=…')`, sonst Inline-„fertig".
  - Welle 2 → Fire-and-forget-PATCH pro Antwort (kein Blockieren), am Ende `zumAbschluss()`.
- **Spam-Schutz:** Honeypot-Feld + optional Cloudflare **Turnstile** (nur wenn `NEXT_PUBLIC_TURNSTILE_SITE_KEY` gesetzt).
- **Eingebunden über:** `/kontakt` (standard), `/grey-blending-krefeld` + `/grey-blending-beratung` (deep, `vorauswahlBehandlung="Grey Blending"`), sowie die 7 Dienstleistungs-Seiten via `components/TerminSektion.tsx` (standard, vorausgewählte Behandlung).

---

## 4 · Tracking

Alle Skripte liegen in **`app/layout.tsx`** und laden **nur in Produktion** (`process.env.NODE_ENV === "production"`).

| Tool | ID / Detail | Zeile(n) | Consent |
|---|---|---|---|
| **Cookiebot** | `consent.cookiebot.com/uc.js`, `data-cbid=7e6107a2-00b0-4c25-8ffd-482c67cefdad`, `data-blockingmode="auto"`, `beforeInteractive` (lädt zuerst) | ~46–53 | — (steuert selbst) |
| **Google Tag Manager** | **`GTM-KGB529BZ`** (Inline-Snippet + `<noscript>`-iframe) | 66, 119 | `data-cookieconsent="marketing"` |
| **Google Ads (gtag)** | **`AW-17270753092`** (`gtag.js` + `gtag('config', …)`) | 73, 86 | `data-cookieconsent="marketing"` |
| **Meta Pixel** | `fbq('init','1556322352741442')` + `fbq('track','PageView')`, `connect.facebook.net`, + `<noscript>`-img | 92–107, 133 | `data-cookieconsent="marketing"` |
| **HubSpot Tracking** | `//js-eu1.hs-scripts.com/146440145.js` | 149 | `data-cookieconsent="marketing"` |
| google-site-verification | `t0BF1OoHWoyvYxz3cXtyV0-n227wC3d2Lc9KTcBh6ak` | 139 | — |

- **`dataLayer`-Pushes:** nur im GTM-Init-Snippet (`gtm.start`) und im gtag-Init (`dataLayer.push`).
- **`gtag()`-Aufrufe:** `gtag('js', …)` und `gtag('config','AW-17270753092')`. **Kein Conversion-Event** (`gtag('event','conversion',…)`), **kein `fbq('track','Lead')`** beim Absenden – Conversion hängt allein am **Aufruf der Danke-Seite** (Ziel-URL im Ads-Konto).
- **`gtag('consent', …)` (Consent Mode v2): NICHT vorhanden.** Consent wird über **Cookiebot `data-blockingmode="auto"` + `data-cookieconsent="marketing"`** geregelt (Skripte werden bis zur Marketing-Zustimmung blockiert). Kein expliziter `gtag('consent','default'/'update')`-Aufruf im Code.

---

## 5 · Telefon-Links & WhatsApp

- **Zentrale Konstante:** `lib/site-info.ts` → `salonTelefon = "+49 174 3091973"`, `salonTelefonHref = "tel:+491743091973"`.
- **`salonTelefonHref` genutzt in:** `app/kontakt/page.tsx`, `app/grey-blending-krefeld/page.tsx`, `app/grey-blending-beratung/page.tsx`, `components/kontakt/AnrufCta.tsx`, `components/kontakt/AnrufPopup.tsx`, `components/kontakt/KontaktStickyBar.tsx`.
- **Literale `tel:`-Links** zusätzlich in: `app/page.tsx`, `app/Blog/page.tsx`, `app/kontakt/danke/page.tsx`, `app/mentoring/page.tsx`, `components/SiteFooter.tsx`, `components/GlobalFloatingCtas.tsx`, `components/ExitIntentHint.tsx`. (Alle dieselbe Nummer, aber teils hartcodiert statt über die Konstante.)
- **WhatsApp / `wa.me`:** **Keine WhatsApp-Deep-Links** im Projekt. „WhatsApp" existiert nur als HubSpot-Feld `whatsapp_ok` (Formularfrage).

---

## 6 · Sitemap & warum `/dienstleistungen` 404 liefert

- **Datei:** `app/sitemap.ts` – **manuell gepflegtes, statisches Array** (nicht aus dem Dateisystem generiert). `baseUrl = "https://www.diebianco.de"`, `lastModified = new Date()`.
- Die Sitemap listet **`/dienstleistungen`** (Zeile 21) als eigene URL.
- **Es gibt aber keine `app/dienstleistungen/page.tsx`** (Index-Seite). Unter `app/dienstleistungen/` liegen nur Unterordner mit eigenen `page.tsx` (blond-spezialisten, farbtypologie, grey-blending, hautdiagnostik, keratinbehandlung, schnitttechniken, stilberatung).
- **→ Ursache des 404:** Im App Router erzeugt ein Ordner ohne eigene `page.tsx` **keine** Route. `/dienstleistungen` existiert also nicht, steht aber (fälschlich) in der handgepflegten Sitemap. Die 7 Unterseiten funktionieren.
- Nebenbefund: Die Blog-Einträge in der Sitemap (`/Blog/den-perfekten-look` etc.) werden über die dynamische Route `app/Blog/[slug]/page.tsx` bedient (separat zu prüfen, ob alle Slugs existieren – nicht Teil dieses Auftrags).

---

## 7 · Erwartete ENV-Variablen

Kein `.env.example`, keine `vercel.json`. Aus `process.env`-Zugriffen ermittelt:

| Variable | Zweck | Public? |
|---|---|---|
| `HUBSPOT_PRIVATE_APP_TOKEN` | HubSpot Service-Schlüssel (Bearer), Portal 146440145 | nein (Secret) |
| `HUBSPOT_API_BASE` | optional, Default `https://api.hubapi.com` | nein |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` | SMTP-Server (STRATO) | nein |
| `SMTP_USER` / `SMTP_PASS` | SMTP-Login (`termine@diebianco.de`) | nein (Secret) |
| `MAIL_FROM` | Absender-Adresse (Default = SMTP_USER) | nein |
| `MAIL_FROM_NAME` | Absender-Anzeigename (Default „DIE BIANCO") | nein |
| `MAIL_TO` | Team-Empfänger der Lead-Karte (Default salon@ + scharam) | nein |
| `MAIL_REPLYTO` | Reply-To der Kundenbestätigung (Default salon@) | nein |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile (Client) – aktiviert das CAPTCHA | **ja** |
| `TURNSTILE_SECRET_KEY` | Turnstile serverseitige Prüfung | nein (Secret) |
| `NODE_ENV` | von Next/Vercel gesetzt (Tracking nur in production) | — |

Zusätzlich hartcodiert (nicht als ENV): GTM-, Google-Ads-, Meta-Pixel-, Cookiebot-, HubSpot-Tracking-IDs (in `app/layout.tsx`); HubSpot Portal/Form-ID im alten `app/api/hubspot/route.ts`.

---

## 8 · vercel.json, Crons, Datenbank/KV

- **`vercel.json`:** **nicht vorhanden** → keine Cron-Jobs, keine speziellen Build-/Header-Overrides über Vercel-Config (Header-Setup liegt in `next.config.mjs`).
- **Datenbank / KV / Redis:** **keine** Anbindung gefunden (kein `@vercel/kv`, `@vercel/postgres`, Prisma, Drizzle, Mongo, Redis). Einziger externer Datenspeicher ist **HubSpot** (über die REST-API).
- **Paketmanager:** **pnpm** (`pnpm-lock.yaml`; Vercel nutzt pnpm mit `--frozen-lockfile`). Kein `package-lock.json`.

---

## Datei → Zweck

| Datei | Zweck |
|---|---|
| `app/layout.tsx` | Root-Layout; **alle Tracking-Skripte** (Cookiebot, GTM, Google Ads, Meta Pixel, HubSpot), global Floating-CTAs + Exit-Popup |
| `app/kontakt/page.tsx` | Kontakt-/Ad-Landingpage (Standard-Formular), Server-Component, statisch |
| `app/kontakt/danke/page.tsx` | Danke-Seite (Ziel des Redirects, Conversion), dynamisch, liest `?name` |
| `app/grey-blending-krefeld/page.tsx` · `-beratung/page.tsx` | Anzeigen-Landingpages (Deep-Formular, Grey Blending vorausgewählt) |
| `app/dienstleistungen/*/page.tsx` | 7 Service-Seiten (jeweils mit `TerminSektion`) |
| `app/api/anfrage/route.ts` | **Formular-Backend:** HubSpot-Upsert (fetch) + Lead-Aufbereitung + Mails (Nodemailer/SMTP) |
| `app/api/hubspot/route.ts` | Älteres Backend (HubSpot Forms-API + Mail) für `gemeinsam-erleben`, `mentoring` |
| `app/sitemap.ts` | Statische Sitemap (manuell gepflegt) – enthält u. a. das nicht existierende `/dienstleistungen` |
| `components/AnfrageFormular.tsx` | Zweiphasiges Anfrage-Formular (Client), alle Varianten/Themes |
| `components/TerminSektion.tsx` | Wiederverwendbare Formular-Sektion für Service-Seiten (Behandlung vorausgewählt) |
| `components/kontakt/AnrufCta.tsx` · `KontaktStickyBar.tsx` · `AnrufPopup.tsx` · `useGeoeffnet.ts` | Zeitgesteuerte Telefon-CTAs / Sticky-Bar / Popup + Öffnungs-Status-Hook |
| `components/GlobalFloatingCtas.tsx` · `ExitIntentHint.tsx` | Globale Sticky-CTA + Exit-Popup (auf Landingpages ausgeblendet) |
| `components/SiteFooter.tsx` · `Navigation.tsx` | Footer (nutzt `openingHours`) + Navigation |
| `lib/hubspot/schema.ts` | **Single Source of Truth** für HubSpot-Properties (Felder, Optionen, `optionWert()`) |
| `lib/site-info.ts` | Zentrale Kontakt-/Öffnungszeiten-Config + `istGeoeffnet()` |
| `scripts/sync-properties.ts` | Idempotentes Sync-Skript (legt HubSpot-Properties an), `npm run sync:hubspot` (via tsx) |
| `next.config.mjs` | Next-Config (Header, Images, eslint/ts ignore) |

---

## Offene Fragen (vor Änderungen zu klären)

1. **WhatsApp-„Checkbox":** Der Auftrag nennt eine WhatsApp-Checkbox im Formular – die gibt es **nicht**. Aktuell ist WhatsApp die Phase-B-Radiofrage `whatsapp_ok` (nur Deep). Soll eine WhatsApp-Einwilligung als **Checkbox in den Kontaktschritt** (auch Standard)? Und braucht ihr echte **`wa.me`-Links**?
2. **Conversion-Tracking:** Es gibt **kein** `gtag('event','conversion')` und **kein** `fbq('track','Lead')` beim Absenden – Conversions hängen nur am Aufruf von `/kontakt/danke`. Ist im **Google-Ads-Konto** eine Ziel-URL-Conversion auf `/kontakt/danke` eingerichtet? Sollen wir **explizite Lead-Events** (gtag/fbq) beim Submit feuern (zuverlässiger, und für Meta empfohlen)?
3. **Consent Mode v2:** Kein `gtag('consent', …)` im Code; Consent läuft nur über Cookiebot-Auto-Blocking. Braucht Google (Ads/Enhanced Conversions) den **Consent-Mode-v2**-Signalweg zusätzlich?
4. **`/dienstleistungen` 404:** Gewünschter Fix – **Index-Seite** `app/dienstleistungen/page.tsx` anlegen (Übersicht) **oder** den Eintrag aus der Sitemap **entfernen**?
5. **Turnstile:** `NEXT_PUBLIC_TURNSTILE_SITE_KEY` scheint in Produktion **nicht gesetzt** (kein CAPTCHA live). Soll Turnstile aktiviert werden (Site-Key + `TURNSTILE_SECRET_KEY` in Vercel)?
6. **tel:-Links vereinheitlichen:** Mehrere Seiten hardcoden `tel:+491743091973` statt `lib/site-info.ts` zu nutzen. Später zentralisieren?
7. **`.env.example`:** Soll eine Vorlage (`.env.example`) angelegt werden, damit die erwarteten ENV-Variablen dokumentiert sind?
8. **Zwei Formular-Backends:** `gemeinsam-erleben` und `mentoring` laufen noch über das alte `/api/hubspot` (Forms-API, ohne Lead-Aufbereitung). Sollen die auf `/api/anfrage` migriert werden?
9. **Sitemap-Pflege:** Sitemap ist statisch/handgepflegt – soll sie künftig aus den echten Routen generiert werden (verhindert 404-Einträge wie `/dienstleistungen`)?
