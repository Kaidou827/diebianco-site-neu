# Kontakt-Strecke – Stand 2026-10-21 (Teil A)

> Read-only-Inventur. Jede Aussage mit `Datei:Zeile`. Basis: `main` @ `166ac43`.

## 1. Kontaktformular(e)

- **Eine Komponente** erzeugt alle Anfragen: `components/AnfrageFormular.tsx` (gekapselt unter `.db-formular`). Varianten `standard`/`deep`, Themes `creme/dunkel/hell`, Props `vorauswahlBehandlung`, `dankeUrl` (`:31-38,100-106`).
- **Direkt auf `/kontakt`:** `app/kontakt/page.tsx` rendert das Formular (zusätzlich hardcodierte Trust-Elemente, s. Teil 0).
- **Service-Landingpages** betten es über `components/TerminSektion.tsx` ein: `<AnfrageFormular vorauswahlBehandlung={behandlung} dankeUrl="/kontakt/danke" />` (`TerminSektion.tsx:26-31`). Nutzer: `app/dienstleistungen/*`, `app/grey-blending-krefeld`, `app/grey-blending-beratung` u. a.

**Felder & Validierung**
- **Pflicht (Welle 1):** `firstname`, `lastname`, `phone`, `email` – Client-Check `AnfrageFormular.tsx:244`, Telefon ≥ 9 Ziffern `:248`; Server-Check `app/api/anfrage/route.ts:94`.
- **Behandlung** (`wunsch_behandlung`): faktisch Pflicht über das Phasen-Gate – ohne `vorauswahlBehandlung` startet Phase `behandlung`, Weiter erst nach Auswahl (`:113,229-234`).
- **Optional:** `wunschzeitraum`, `whatsapp_ok`, `nachricht`, `einwilligung_marketing` (Checkbox, `:121,277`).
- **Phase B (nur `deep`, je Antwort PATCH/Welle 2):** `haarlaenge`, `farb_vorgeschichte`, `erreichbarkeit`, `dringlichkeit`, `anmerkung_kundin` (Kurzlabels `:77-86`; Feldquelle `lib/hubspot/schema.ts` → `FORMULAR_FELDER`). Foto-Upload per Flag **aus** (`FOTO_UPLOAD_AKTIV = false`, `:43`).
- **Anti-Spam:** Honeypot `input[name="website"]` (`:239`) + Cloudflare Turnstile (`:240-241,252-254`; ENV `NEXT_PUBLIC_TURNSTILE_SITE_KEY`/`TURNSTILE_SECRET_KEY`).

**API & HubSpot-Properties** – `POST /api/anfrage`:
- Welle 1 setzt (`route.ts:122-153`): `firstname, lastname, phone, email, hubspot_owner_id, prioritaet, lead_qualitaet, lead_wert_proxy, quelle_seite, wunsch_behandlung, wunschzeitraum, whatsapp_ok, nachricht_anfrage`, optional `einwilligung_marketing(+_zeitpunkt)`, Attribution `gclid, utm_source, utm_medium, utm_campaign`.
- Upsert per E-Mail + Idempotenz 5 min (`:46,160-172`); Rückruf-Aufgabe (`:206-215`); Salon-Mail + Eingangsbestätigung (`:222-257`).
- Welle 2 schreibt nur Properties aus `ERLAUBTE_FELDER` (`:49,274`).

## 2. Attribution

- **Erfasste Keys** (`AnfrageFormular.tsx:58`): `gclid, gbraid, wbraid, utm_source, utm_medium, utm_campaign, utm_term`. **NICHT dabei: `utm_content`, `fbclid`, `document.referrer`.**
- **Wann/Wo gespeichert:** First-Touch in `sessionStorage["db_attribution"]`, gesetzt in einem `useEffect` **beim Mount des Formulars** (`:188-205`) – liest `window.location.search`, überschreibt vorhandene Werte nicht. **Lebensdauer: Session/Tab** (sessionStorage).
- **Beim Absenden** gelesen via `leseAttribution()` (sessionStorage ∪ aktuelle URL, `:62-75,261`) und als `tracking` mitgeschickt (`:279`). Die API übernimmt daraus nur `gclid/utm_source/utm_medium/utm_campaign` als Property (`route.ts:138-141`); `gbraid/wbraid/utm_term` nur Log (`:142-148`).
- **Warum UTM bei vielen Kontakten leer ist:** Die Erfassung passiert **nur auf Seiten mit dem Formular** (kein globaler First-Touch im Layout). Landet jemand mit `?utm_*` auf einer Seite **ohne** Formular (Startseite, Blog, Service-Übersicht) und navigiert dann per Client-Navigation zum Formular, sind die Parameter aus der URL verschwunden und wurden nie gespeichert → `leseAttribution()` liefert leer. Zusätzlich gehen `utm_content`/`fbclid` grundsätzlich verloren (nicht in `ATTRIB_KEYS`).

## 3. Tracking bei erfolgreicher Anfrage

- **Keine** `dataLayer`-, `gtag`- oder `fbq`-Events im Erfolgsfall (`AnfrageFormular.tsx` enthält keine solchen Aufrufe). Der Abschluss ist nur eine Weiterleitung auf `dankeUrl` (`:219-227`, meist `/kontakt/danke`) bzw. Phase „fertig".
- Damit ist nichts consent-gated, weil **kein** Event existiert.
- **`gtag('consent','default', …)` existiert nirgends** → Consent Mode v2 nicht implementiert (Repo-weit geprüft).
- Marketing-Tags (GTM/gtag/Pixel) laden global nur über `app/layout.tsx` (Cookiebot-gated, Production), unabhängig vom Formular.

## 4. lead_wert_proxy – Wertetabelle & Abgleich mit PR #15

Quelle der Wahrheit: `lib/lead-logic.ts:73-82` (`LEAD_WERT`), Default 60 (`leadWertProxy`, `:120-121`). Verwendet in `route.ts:118,129` → Property `lead_wert_proxy`.

| Behandlung (Key) | lead_wert (Code) | PR #15-Preis | Abgleich |
|---|---|---|---|
| `schnitt_styling` | 60 | Damenschnitt 95 € | **abweichend** (B3: 95) |
| `farbe_ansatz` | 80 | Ansatz ab 80 € | ✓ |
| `straehnen_blondierung` | 150 | Strähnen ab 150 € | ✓ |
| `balayage` | **300** | Balayage **ab 390 €** | **abweichend** (→ 390) |
| `grey_blending` | 390 | Grey Blending ab 390 € | ✓ |
| `keratin` | 300 | Keratin ab 300 € | ✓ |
| `beratungsgespraech` | 60 | (Erstberatung 95 €) | **abweichend** (B3: 95) |
| `weiss_ich_noch_nicht` | 60 | — | **abweichend** (B3: 95) |

> Hinweis: Die Prompt-Behauptung „Grey Blending 150 €" trifft **nicht** zu – 150 ist `straehnen_blondierung`, Grey Blending steht korrekt auf 390.

---
*Reiner Lesebericht. Keine Code-Dateien außer den beiden Doku-Dateien geändert.*
