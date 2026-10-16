# Bewerbungs-Strecke – Stand 2026-10-16

> Interner Bericht, reine Code-Fakten (jede Aussage mit `Datei:Zeile`). Basis: `main` @ `166ac43`.
> Wo etwas über ENV entschieden wird, ist die Variable genannt – der **Wert** muss in **Vercel** geprüft werden.
> Für eine Marketing-Session ohne Repo-Zugriff: Abschnitt „Kurzantwort" oben genügt.

## Kurzantwort (Wo landet eine Bewerbung? Wer bekommt sie? Was steht in der Mail? Was wird gemessen?)

- **Wo/Wer:** Jede Bewerbung geht als **E-Mail** an **`businessdiebianco@gmail.com`** (TO) **mit CC an `scharam.saleh@gmail.com`** (`app/api/bewerbung/route.ts:25,29`, `:99-100`). Beide Adressen sind Defaults **fest im Code**, via ENV `BEWERBUNG_MAIL_TO` / `BEWERBUNG_MAIL_CC` überschreibbar. **Kein HubSpot/CRM** (`route.ts:19`).
- **Absender/Transport:** `DIE BIANCO <termine@diebianco.de>` über STRATO-SMTP (`lib/mailer.ts:16-18,21-31`, ENV `SMTP_HOST/PORT/USER/PASS/SECURE`). **Reply-To = E-Mail des Bewerbers** (`route.ts:101`).
- **Was steht drin:** Betreff `✂️ Neue Bewerbung – <Stelle> – <Name>` (`email-texts.ts:529`); Inhalt: Stelle, Name, Telefon, Kontaktwunsch (fett), E-Mail, alle Formular-Antworten, Button „Auf WhatsApp antworten" + „Anrufen", **Quelle-Zeile inkl. `utm_content` (= Meta-Anzeigenname)**, Eingangszeit, 6-Monats-Löschhinweis (`email-texts.ts:484-529`, Quelle gebaut in `route.ts:68-70`).
- **Bewerber-Mail:** „… meldet sich innerhalb von **2 Werktagen** …", nur wenn eine E-Mail angegeben wurde (`email-texts.ts:541-564`, `route.ts:115`).
- **Was wird gemessen:** Auf `/jobs/danke` Meta-Pixel **`SubmitApplication`** (`content_name`=Stelle) + dataLayer `bewerbung_danke` (`DankeTracking.tsx:16-27`); im Formular dataLayer `bewerbung_step_1/2/3` + `bewerbung_success` (`BewerbungFormular.tsx:66,89,90,140`). **Achtung Race Condition** – siehe §5 (wird in Branch `fix/danke-tracking-retry` behoben).

---

## 1. Seiten / Routen

| Route | Datei | Rendering¹ | Meta-Title | in sitemap.ts | noindex | JobPosting-JSON-LD |
|---|---|---|---|---|---|---|
| `/jobs` | `app/jobs/page.tsx` | **dynamisch** (liest `searchParams`) | „Jobs bei DIE BIANCO – Friseur/in & Ausbildung in Krefeld (m/w/d)" (`:12`) | ✅ (`sitemap.ts:13`) | nein | nein |
| `/jobs/ausbildung-friseur-krefeld` | `app/jobs/ausbildung-friseur-krefeld/page.tsx` | statisch | `STELLEN_INHALT.azubi.title` (`:9`) | ✅ (`sitemap.ts:14`) | nein | **ja** (via StellenSeite) |
| `/jobs/friseur-krefeld` | `app/jobs/friseur-krefeld/page.tsx` | statisch | `STELLEN_INHALT.friseur.title` (`:9`) | ✅ (`sitemap.ts:15`) | nein | **ja** |
| `/jobs/danke` | `app/jobs/danke/page.tsx` | **dynamisch** (liest `?stelle`) | „Danke für deine Bewerbung – DIE BIANCO" (`:10`) | **nein** | **ja** `robots:{index:false,follow:false}` (`:11`) | nein |

¹ Rendering-Typ aus dem Build (`ƒ`/`○`).

**Redirect:** `/jobs?stelle=azubi` → `/jobs/ausbildung-friseur-krefeld`, `/jobs?stelle=friseur` → `/jobs/friseur-krefeld` (`app/jobs/page.tsx:43-45`, serverseitiger `redirect()`).

**Canonical + OG-Bild** je Stellenseite gesetzt (`friseur-krefeld/page.tsx:11,15`, `ausbildung…/page.tsx:11,15`), OG-Bild = `OG_IMG = "/Sektionbild.jpg"` (`lib/jobs-content.ts:15`).

**JobPosting-JSON-LD** (`components/jobs/JobPostingJsonLd.tsx:18-62`, eingebunden in `StellenSeite.tsx:43-49`):
- Felder: `title`, `description`, `datePosted` (= Build-Datum, `:28`), `validThrough` (= +90 Tage, `:20,29`), `employmentType`, `hiringOrganization` („DIE BIANCO", `:31-35`), `jobLocation` (Siedlung Egelsberg 1, 47802 Krefeld, `:36-45`), `directApply:true` (`:46`), `url`.
- `employmentType`: azubi = `["FULL_TIME"]`, friseur = `["FULL_TIME","PART_TIME"]` (`lib/jobs-content.ts:55,81`). Hinweis: schema.org kennt kein „Ausbildung" → Azubi läuft als FULL_TIME (`JobPostingJsonLd.tsx:5-7`).
- **`baseSalary` nur, wenn ENV gesetzt** (`StellenSeite.tsx:20-25,47`): `JOBS_GEHALT_AZUBI_JAHR1` bzw. `JOBS_GEHALT_FRISEUR_MIN`. **Werte in Vercel prüfen** – sonst kein Gehalt im JSON-LD und Platzhalter `[GEHALT]` entfällt im Text (`StellenSeite.tsx:15-18,29`).

## 2. Formular (`components/BewerbungFormular.tsx`)

3-Schritt-Stepper (`useState`, `:51`). Felder je Stelle aus `lib/jobs.ts`.
- **Schritt 1/2:** Klick-Karten (radio/checkbox) je Stelle – azubi: `wo_stehst_du`, `erfahrung`, `start`, `motivation`; friseur: `abschluss` (+`abschluss_fertig_bis`), `erfahrung_jahre`, `schwerpunkte`, `arbeitszeit`, `start`, `instagram_portfolio` (`lib/jobs.ts:107-121`). Alle **optional**.
- **Schritt 3 (Pflichtfelder):** **Vorname** (required, `:276`), **Telefon** (required, `:285`), **Datenschutz-Checkbox** (`:308-309`). Optional: Nachname (`:280`), E-Mail (`:289`), Kontaktwunsch WhatsApp/Anruf (Default „whatsapp", `:57,301-304`).
- **Client-Validierung vor dem Absenden:** Vorname nicht leer, Telefon ≥ 6 Ziffern, Datenschutz gesetzt (`:103-110`).
- **Honeypot:** verstecktes Feld `name="website"` (`:193`, CSS off-screen `:380`), wird mitgeschickt (`:100,128`) und serverseitig abgelehnt (§3).
- **Attribution (First-Touch):** `utm_source/medium/campaign/content`, `fbclid`, `gclid` (`:22`) → in **sessionStorage** unter Key `db_jobs_attribution` (`:23,70-76`). Nur gesetzt, wenn noch nicht vorhanden (First-Touch). **Lebensdauer: Session/Tab** (sessionStorage; übersteht keinen neuen Tab/Browser-Neustart).
- **POST an `/api/bewerbung`** (`:117-133`) mit: `stelle, vorname, nachname, telefon, email, kontaktwunsch, datenschutz, honeypot, antworten`, `quelle_seite` (= `location.pathname`, `:130`) + alle Attributionswerte (`leseAttribution()`, `:116`).
- **Nach Erfolg** (`:140-141`): dataLayer `bewerbung_success` → dann **`window.location.assign('/jobs/danke?stelle=<stelle>')`** (= **Full-Reload**). dataLayer-Events vorher: `bewerbung_step_1` beim Mount (`:66`), `bewerbung_step_2/3` bei Weiter (`:89,90`).
- **Fehlerfall:** Fehlermeldung inline + WhatsApp-Fallback-Link (`:135-144`).

## 3. Backend (`app/api/bewerbung/route.ts`)

- **Validierung:** `bewerbungSchema.safeParse` (zod, `:47`). Schema (`lib/jobs.ts:158-179`): `vorname` min 1, `telefon` min 6, `email` optional/gültig/"" , `kontaktwunsch` enum (Default „whatsapp"), **`datenschutz` muss `true` sein** (`:166`), **`honeypot` max. 0 Zeichen** (`:168`), `antworten` record, Attributionsfelder optional (`:172-178`).
- **Rate-Limit/Spamschutz:** **Kein** Rate-Limit/Throttle im Code – nur Honeypot (via Schema) + Pflicht-Datenschutz.
- **SMTP:** `baueTransporter()` (`lib/mailer.ts:21-31`) aus ENV `SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE`. Absender `MAIL_FROM_FULL` = „DIE BIANCO <termine@diebianco.de>" (Default; ENV `MAIL_FROM_NAME`/`MAIL_FROM`, `mailer.ts:16-18`). **Werte in Vercel prüfen.**
- **Empfänger Salon-Mail** (`:97-105`): **TO** = `BEWERBUNG_MAIL_TO` (Default `businessdiebianco@gmail.com`, `:25`), **CC** = `BEWERBUNG_MAIL_CC` (Default **`scharam.saleh@gmail.com`**, `:29`), **kein BCC**. **Reply-To = Bewerber-E-Mail** (`:101`).
- **Bewerber-Bestätigung** (`:115-135`): nur **wenn `d.email` vorhanden**. Reply-To = `BEWERBUNG_MAIL_ADRESSE` (= erste TO-Adresse, `:33,127`). Wird aktuell **synchron `await`-et** (`:124`).
- **Fehlerfälle:** JSON-Parsefehler → 400 (`:44`); Validierung fehlgeschlagen → 400 mit erster zod-Meldung (`:50`); SMTP nicht konfiguriert → 500 + WhatsApp-Fallback (`:88-92`); **Salon-Mail-Versand schlägt fehl → 500** + WhatsApp-Fallback (`:106-111`); Bestätigungsmail-Fehler → nur `console.error`, kein Abbruch (`:132-134`). Erfolg → `{ ok: true }` (`:137`). Logging via `console.error` (`:88,107,133`).
- **HubSpot:** **bestätigt entfernt** (PR #11, Commit `0adb2dd`). Keine HubSpot-Aufrufe/Imports mehr (`route.ts:19`).

> ⚠️ **Abweichung zum erwarteten Stand:** Die „schnelleres Absenden"-Optimierung (Bestätigungsmail via `next/server` `after()`, Commit `977b0ea`) liegt **nur auf Branch `fix/bewerbung-ohne-hubspot`** und ist **NICHT in `main`** (`git merge-base --is-ancestor 977b0ea main` → false). Produktion sendet die Bestätigungsmail also weiterhin **blockierend**. → separat nach-mergen.

## 4. Mails (`lib/email-texts.ts`)

**Salon-Mail** `bewerbungBenachrichtigung` (`:484-529`):
- Betreff: `✂️ Neue Bewerbung – <stelleLabel> – <Name>` (`:529`).
- Inhalt (fett): Stelle, Name, Telefon, Kontaktwunsch (`:486-491`); dann E-Mail + alle Antworten (`:492-495`); WhatsApp-/Anrufen-Button (`:521-524`); **Quelle** (`:506,525`); Eingang (`:507,526`); 6-Monats-Hinweis (`:509,527`).
- **Quelle-String** (gebaut in `route.ts:68-70`): `<quelle_seite> · utm: <utm_source>/<utm_medium>/<utm_campaign>/<utm_content> · fbclid: ja|nein`.
  - ✅ **`utm_content` (= `{{ad.name}}`) kommt 1:1 in der Mail an** – als 4. Segment hinter der Campaign (nur vorhanden, wenn gesetzt).
  - ⚠️ **`gclid` wird NICHT im Mailtext ausgegeben** (nur `utm_*` + `fbclid` ja/nein). `gclid` wird zwar erfasst/übertragen, taucht in der Mail aber nicht auf.

**Bewerber-Mail** `bewerbungEingangsbestaetigung` (`:541-564`):
- Betreff: „Deine Bewerbung bei DIE BIANCO ist angekommen" (`:564`).
- Inhalt: „… meldet sich innerhalb von **2 Werktagen** per <WhatsApp|Telefon> …" (`:547,558`) + Hinweis, Lebenslauf/Fotos an `businessdiebianco@gmail.com` oder WhatsApp zu schicken (`:549,559`). Keine Preis-/Werbe-Inhalte.

## 5. Tracking auf `/jobs/danke` (`components/jobs/DankeTracking.tsx`)

- dataLayer **`bewerbung_danke`** `{ event, stelle }` wird **immer** sofort gepusht (`:15-16`).
- Meta-Pixel **`SubmitApplication`** mit `{ content_category:"bewerbung", content_name:<stelle> }` + 4. Argument `{ eventID }` (`:22-27`). `eventID` = `crypto.randomUUID()` mit Fallback (`:18-21`) – client-seitige UUID, als Grundlage für spätere CAPI-Dedup.
- **Consent-Gating:** Der Pixel wird in `app/layout.tsx` nur mit Cookiebot-Marketing-Consent und `NODE_ENV==="production"` geladen. `DankeTracking` prüft `typeof w.fbq === "function"` (`:17`).
- 🐞 **Race Condition:** Das `useEffect` läuft **einmalig** beim Mount. Ist `window.fbq` zu dem Zeitpunkt **noch nicht** vorhanden (Cookiebot/Pixel noch nicht entsperrt/geladen), wird das `SubmitApplication`-Event **still verworfen** und **nicht nachgeholt** → verlorene Conversion. (Live-Test 16.10.: 1 von 3 Danke-Aufrufen ohne Event.) → **behoben in Branch `fix/danke-tracking-retry`** (Retry + `CookiebotOnAccept`-Listener, siehe Teil B).
- `content_name`-Werte exakt: `"azubi"` / `"friseur"` / `"unbekannt"` (Fallback bei fehlendem/ungültigem `?stelle`; `app/jobs/danke/page.tsx:19-20,56`).

## 6. WhatsApp-Links auf den Stellenseiten (`lib/whatsapp.ts`)

- **Nummer:** `SALON_WA_NUMMER` = `491743091973` (aus `salonTelefonHref`, `:12`).
- **Bewerber → Salon** `waBewerbungLink(stelle)` (`:56-62`), vorausgefüllter Text je Stelle:
  - azubi: „Hallo Teresa, ich interessiere mich für die Ausbildung bei DIE BIANCO. Mein Name ist"
  - friseur: „Hallo Teresa, ich interessiere mich für die Stelle als Friseur/in bei DIE BIANCO. Mein Name ist"
- **Kein Tracking-Parameter** in den wa.me-Links (`waLink`, `:15-17`) – reiner `?text=`.
- Eingebunden im Hero, 2. CTA (`StellenSeite.tsx:30,74,161`) und als Fehler-Fallback im Formular (`BewerbungFormular.tsx:144`).
- `waBewerbungAntwortLink` (Teresa → Bewerber, in der Salon-Mail) nur bei gültiger E.164-Nummer, sonst leer (`whatsapp.ts:68-76`).

## 7. Offene Risiken

1. **`after()`-Speed-Fix nicht in `main`** – Bestätigungsmail blockiert weiterhin die Antwort (siehe §3). Separat nach-mergen.
2. **Danke-Tracking Race Condition** (§5) – Conversions gehen verloren, wenn `fbq` beim Mount fehlt. Fix in `fix/danke-tracking-retry` (Teil B).
3. **CC `scharam.saleh@gmail.com` fest als Default im Code** (`route.ts:29`) – persönliche Adresse; falls das nicht dauerhaft gewünscht ist, über ENV `BEWERBUNG_MAIL_CC` steuern/entfernen.
4. **ENV-Werte in Vercel ungeprüft:** `SMTP_*` (sonst 500 + WhatsApp-Fallback), `BEWERBUNG_MAIL_TO/CC`, `JOBS_GEHALT_AZUBI_JAHR1` / `JOBS_GEHALT_FRISEUR_MIN` (ohne → kein Gehalt/`[GEHALT]` entfällt). **Bitte in Vercel verifizieren.**
5. **Bilder:** `HERO_IMG`/`OG_IMG` = `/Sektionbild.jpg` (existiert, aber **~17 MB** – Performance/LCP-Risiko), `UEBER_IMG` = `/teresa-bianco-portrait.jpg` (≈576 KB). Prüfen, ob `/Sektionbild.jpg` das gewünschte Job-Motiv ist und optimieren.
6. **Consent/In-App:** Pixel nur mit Marketing-Consent; In-App-Browser (Meta/IG) ohne Consent feuern nicht → Untererfassung (keine UA-Sonderbehandlung im Code).
7. **`gclid` nicht in der Salon-Mail** sichtbar (§4) – nur `utm_*`/`fbclid`. Falls Google-Ads-Zuordnung per Mail gewünscht, ergänzen.
8. **Preview-Deploys tracken mit** (`NODE_ENV==="production"` greift auch auf Vercel-Preview) – Test-Bewerbungen können in Conversions auftauchen.

---
*Reiner Lesebericht. Keine Code-Dateien außer diesem Bericht geändert.*
