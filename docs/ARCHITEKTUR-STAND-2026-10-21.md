# Architektur-Stand 2026-10-21 (Teil 0)

> Selbst gelesener Ist-Zustand vor Umsetzung von Prompt 10. Basis: `main` @ `166ac43`.
> Enthält am Ende, **was ich am Prompt für falsch/riskant halte** (wo Code ≠ Prompt, gilt der Code).

## Anfrage-Fluss (Seite → API → HubSpot + Mail)

Zweiphasig, komplett in `app/api/anfrage/route.ts` (HubSpot Starter hat keine Workflows):

1. **Formular** `components/AnfrageFormular.tsx` (eingebettet via `components/TerminSektion.tsx` auf Service-Seiten, direkt auf `/kontakt`). Varianten `standard`/`deep`, Themes, optional `vorauswahlBehandlung`, optional `dankeUrl`.
2. **Welle 1** (`POST /api/anfrage`, `welle:1`, `route.ts:79-262`): Pflicht `firstname,lastname,phone,email` (`:94`); Anti-Spam Honeypot + Cloudflare Turnstile (nur wenn `spamProtectionRequired`, `:101-113`); Telefon → E.164 (`:116`); ableiten `prioritaet/lead_qualitaet/lead_wert_proxy` (`:117-119`); **HubSpot-Upsert** per E-Mail (`sucheKontaktId`→`aktualisiere`/`erstelle`, `:160-172`) mit Idempotenz-Fenster 5 min (`:46,162-164`); **Rückruf-Aufgabe** für Teresa (`:206-215`); **Salon-Mail** + **Eingangsbestätigung** (`:222-257`).
3. **Welle 2** (`deep`, `welle:2`, `route.ts:265-292`): je Phase-B-Antwort ein PATCH auf die Kontakt-ID; nur Properties aus `ERLAUBTE_FELDER` (`:49,274`).
4. **HubSpot-Zugriffe** über `lib/hubspot` (`route.ts:12-20`), Portal 146440145, Owner-ID ENV `HUBSPOT_DEFAULT_OWNER_ID` (Default `81184186`, `:42`).

**Gesetzte HubSpot-Properties (Welle 1, `route.ts:122-153`):** `firstname, lastname, phone, email, hubspot_owner_id, prioritaet, lead_qualitaet, lead_wert_proxy, quelle_seite, wunsch_behandlung, wunschzeitraum, whatsapp_ok, nachricht_anfrage`; Attribution nur **`gclid, utm_source, utm_medium, utm_campaign`** (`:138-141`); `gbraid/wbraid/utm_term` **nur ins Log** (`:142-148`); `einwilligung_marketing(+_zeitpunkt)` nur bei Zustimmung.
→ **`utm_content` und `fbclid` werden NICHT gespeichert.**

## Events – was feuert wo?

- **Global** `app/layout.tsx` (nur `NODE_ENV==="production"`, alle `data-cookieconsent="marketing"`): Cookiebot `uc.js` (`:46-53`), GTM `GTM-KGB529BZ` (`:56-69`), gtag/Google-Ads `AW-17270753092` + `gtag('config',…)` (`:72-89`), Meta-Pixel `init`+`PageView` (`:92-110`).
- **KEIN** `gtag('consent','default', …)` irgendwo im Repo → **Consent Mode v2 nicht vorhanden** (B1 offen, bestätigt).
- **Kontakt-Erfolg:** `AnfrageFormular.tsx` feuert bei erfolgreicher Anfrage **KEIN** `dataLayer`/`gtag`/`fbq`-Event. „Conversion" entsteht nur durch die Weiterleitung auf `dankeUrl` (`:220-222`, z. B. `/kontakt/danke`). Deckt sich mit dem Audit (77 % „Conversions" = Routen-Klicks).
- **Bewerbung-Erfolg** (separate Strecke): `components/jobs/DankeTracking.tsx` feuert `SubmitApplication` + dataLayer `bewerbung_danke` (nicht Teil dieser Strecke).

## Seiten – Title & Indexierung

- **robots:** `public/robots.txt` = `Allow: /` + Sitemap-Verweis. Sitemap `app/sitemap.ts`.
- Eigene Titles haben u. a.: alle `dienstleistungen/*` (`…/layout.tsx:4`), `/grey-blending-krefeld` (`layout.tsx:6`), `/grey-blending-beratung` (`layout.tsx:6`), `/ueber-uns`, `/behandlungen-preise`, `/ergebnisse`, `/jobs*`, Blog-Artikel (`app/Blog/[slug]/page.tsx:766` = `post.title`, spezifisch).
- **`/kontakt` hat KEIN eigenes `metadata`** (`app/kontakt/page.tsx` exportiert keines) → erbt den **Startseiten-Title** „Teresa Bianco: Exklusiver Friseur in Krefeld | Stilberatung & Haarkunst" (`app/layout.tsx:16`). ⇒ B6 bestätigt für `/kontakt`.
- **`/Blog/balayage-krefeld`:** Code setzt `title: post.title` = „Balayage Krefeld: Der ultimative Guide …" (`app/Blog/[slug]/page.tsx:161,766`) — **also spezifisch, nicht generisch.** Prompt-Beobachtung „generischer Startseiten-Title" **widerspricht dem Code** → live gegenprüfen (evtl. veraltete Momentaufnahme oder Caching).

## Ist-Zustand (vor meinen Änderungen)

| Check | Ergebnis |
|---|---|
| `pnpm build` (`next build`) | ✓ grün |
| `pnpm lint` (`next lint`) | ✗ **schon rot** — `react/no-unescaped-entities` in mehreren Dateien (u. a. `AnfrageFormular.tsx:586`, Blog-Dateien), `layout.tsx:132` `<img>`-Warnung. **Vorbestehend, nicht durch diese Arbeit.** |
| `pnpm test` | 42/43 — **1 vorbestehender Fehlschlag**: `tests/email-texts.test.ts` („Preiszeile ohne 'ab': Damenschnitt 95 €", durch PR #15; Fix im offenen **PR #17**). |

## Was ich am Prompt für falsch/riskant halte (Widersprüche)

1. **B3 „Grey Blending 150 € statt ab 390 €" ist falsch.** `lib/lead-logic.ts:73-82` hat `grey_blending: 390` (korrekt) — die **150** gehört zu `straehnen_blondierung`. Tatsächliche Abweichungen vs. PR #15: `balayage: 300` (→ 390) sowie die Default-Niedrigwerte `schnitt_styling/beratungsgespraech/weiss_ich_noch_nicht = 60` (B3 will Damenschnitt 95 / Beratung 95). B3 also ausführen, aber mit **korrekter** Faktenlage.
2. **B2: `utm_content` & `fbclid` fehlen komplett.** Weder das Formular erfasst sie (`AnfrageFormular.tsx:58` `ATTRIB_KEYS` ohne `utm_content`/`fbclid`/Referrer) noch die API schreibt sie (`route.ts:138`). B2 muss beides ergänzen; `fbclid`/`landingpage` sind **neue** HubSpot-Properties (im PR auflisten, Scharam legt sie an).
3. **B2-Kernursache bestätigt:** `db_attribution` wird **nur beim Mount von `AnfrageFormular`** gesetzt (`:190-205`), es gibt **keinen globalen First-Touch**. Wer mit UTM auf einer Seite **ohne** Formular landet (Startseite, Blog) und dann weiterklickt, verliert die Parameter (Client-Nav entfernt sie aus der URL). Fix braucht eine **globale** First-Touch-Erfassung (z. B. im Layout), nicht nur im Formular.
4. **B4 „Wunsch-Behandlung wird Pflichtfeld": ist faktisch schon Pflicht.** Ohne `vorauswahlBehandlung` startet das Formular in Phase `behandlung` und kommt erst nach Auswahl weiter (`:113,229-234`). Neu wäre nur: **Richtwert-Zeile + Preisklausel** nach Auswahl und **`?behandlung=`-Query-Vorauswahl** (heute gibt es nur das Server-Prop `vorauswahlBehandlung` via `TerminSektion`, keinen Query-Parameter).
5. **B6 Konkurrenz-Seiten:** Es existieren **drei** Grey-Blending-Seiten: `/grey-blending-krefeld`, `/grey-blending-beratung`, `/dienstleistungen/grey-blending` (+ Blog). Canonical/301 nur **vorschlagen**, nicht eigenmächtig. Analog Balayage (`/Blog/balayage-krefeld` vs. mögliche neue Leistungsseite).
6. **Lint ist bereits rot.** Die Prompt-Vorgabe „jeder B-Commit mit Lint grün" ist auf diesem main nicht erfüllbar, ohne vorbestehende `no-unescaped-entities`-Fehler separat zu beheben. Ich halte meine neuen Dateien lint-sauber und melde den Alt-Stand, statt fremde Dateien im selben PR umzuschreiben.
7. **Hardcodierte Kennzahlen:** „5,0 · 37 Google-Bewertungen" steht fest in `app/kontakt/page.tsx:67` **und** `components/AnfrageFormular.tsx:364` (Google-Profil: 4,9/44). „✦ In unter 1 Minute · unverbindlich" in `AnfrageFormular.tsx:360` (widerspricht der 08.10.-Entscheidung „keine Antwortzeit-Versprechen"). „Lern mich kennen"-Abschnitt `app/kontakt/page.tsx:85`. → in B6 nur **melden/vorschlagen**, Wortlaut/Zahlen entscheidet Teresa.

## Unveränderliche Bereiche (Teil 0, Punkt 4) – bestätigt beachtet
Bewerbungsstrecke (`/jobs*`, `/api/bewerbung`, `DankeTracking`), Mailtexte/Preise (PR #4/#15, Wortlaut nur Teresa), bestehende HubSpot-Properties/Workflows (nur ergänzen), bestehende URLs (301 bei Umbenennung), Cookiebot-Gating.
