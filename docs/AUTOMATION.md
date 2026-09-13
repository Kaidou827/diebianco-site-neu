# Lead-Automatisierung (HubSpot Starter, ohne Workflows)

Jede Terminanfrage nimmt Teresa Arbeit ab: der Kontakt wird strukturiert in
HubSpot angelegt, eine fällige **Rückruf-Aufgabe** erstellt und die Kundin
bekommt sofort eine **Eingangsbestätigung**. Weil HubSpot Starter keine
Workflows kann, passiert die komplette Aufbereitung im Code.

Portal **146440145** (EU) · Deep-Link-Muster
`https://app-eu1.hubspot.com/contacts/146440145/record/0-1/{id}`

---

## Ablauf: Formular → API → HubSpot → Aufgabe → Mails

```
Formular (components/AnfrageFormular.tsx)
   │  POST { welle:1, firstname, phone, email, wunsch_behandlung,
   │         wunschzeitraum, whatsapp_ok, nachricht,
   │         einwilligung_marketing, quelle_seite }
   ▼
/api/anfrage  (app/api/anfrage/route.ts)
   │  1) Validierung (Vorname, Telefon, E-Mail) + Anti-Spam
   │  2) Ableitungen (lib/lead-logic.ts):
   │        Telefon → E.164, Priorität, Lead-Wert, Lead-Qualität
   │  3) Upsert Kontakt per E-Mail (lib/hubspot.ts)
   │        – bestehender Status wird NIE überschrieben
   │        – Idempotenz: eingangsbestaetigung_gesendet < 5 Min → Stopp
   │  4) Rückruf-Aufgabe anlegen (Association Task→Contact, Typ 204)
   │  5) Salon-Benachrichtigung + Eingangsbestätigung (lib/email-texts.ts)
   │        – nach Versand: eingangsbestaetigung_gesendet = jetzt
   ▼
Kundin wird auf /kontakt/danke weitergeleitet (Conversion)
```

Deep-Variante (Grey-Blending-Seiten): nach Welle 1 folgen freiwillige
Detailfragen als **Welle 2** – je Antwort ein PATCH auf die Kontakt-ID.

---

## Property-Mapping (Welle 1)

| HubSpot-Property | Quelle | Beispiel |
|---|---|---|
| `firstname`, `lastname`, `email` | Formular | — |
| `phone` | Formular, **E.164-normalisiert** | `+491743091973` |
| `wunsch_behandlung` | Formular (Slug) | `balayage` |
| `wunschzeitraum` | Formular (Slug) | `vormittags` |
| `whatsapp_ok` | Formular-Radio | `ja_gerne` / `lieber_anrufen` |
| `nachricht_anfrage` | Formular (Freitext) | „Wollte fragen …" |
| `prioritaet` | **abgeleitet** aus Behandlung | `hoch` |
| `lead_qualitaet` | **abgeleitet** aus Priorität + Zeitraum | `heiss` |
| `lead_wert_proxy` | **abgeleitet** aus Behandlung (Zahl €) | `150` |
| `lead_status_intern` | `neu` – **nur bei neuem/leerem Status** | `neu` |
| `hubspot_owner_id` | fest (Teresa) | `81184186` |
| `quelle_seite` | Pfad der Anfrage | `/kontakt` |
| `gclid`, `utm_source`, `utm_medium`, `utm_campaign` | Frontend (First-Touch, sessionStorage) | `cj0…` / `google` |
| `einwilligung_marketing` | Checkbox (nur `true` gesetzt) | `true` |
| `einwilligung_zeitpunkt` | Zeitpunkt der Checkbox (Unix-ms) | `1757…` |
| `eingangsbestaetigung_gesendet` | nach Mail-Versand (Unix-ms) | `1757…` |

> Datum/Zeit-Properties werden als **Unix-Millisekunden** gesendet.
> `einwilligung_marketing` wird **nie automatisch auf false** gesetzt (kein
> versehentlicher Widerruf bei Folgeanfragen).
>
> **Attribution (First-Touch):** Das Formular liest `gclid, gbraid, wbraid,
> utm_source, utm_medium, utm_campaign, utm_term` beim Mount aus der URL und
> puffert sie in `sessionStorage["db_attribution"]` (vorhandene Werte werden
> nicht überschrieben). Beim Absenden werden sie mitgeschickt. Als Property
> gespeichert werden nur `gclid` und `utm_source/-medium/-campaign`;
> `gbraid`, `wbraid`, `utm_term` landen nur im Server-Log.

### Ableitungen (lib/lead-logic.ts)

**Priorität** — `hoch`: Grey Blending, Balayage, Keratin, Strähnen/Blondierung ·
`mittel`: Farbe/Ansatz, Beratungsgespräch · `niedrig`: Schnitt & Styling, Weiß ich noch nicht.

**Lead-Wert (€, grob)** — Schnitt 60 · Farbe/Ansatz 80 · Strähnen 100 ·
Balayage 150 · Grey Blending 150 · Keratin 200 · Beratung 60 · Unklar 60.

**Lead-Qualität** — `heiss`, wenn Priorität `hoch` **und** ein Wunschzeitraum
≠ „egal" gesetzt ist; sonst `warm`. `kalt` wird **nur manuell** im CRM vergeben.

**Fälligkeit der Aufgabe** (immer Europe/Berlin, da das Portal auf US/Eastern steht):
- Mo–Fr, Eingang **vor 15:00** → **heute 17:00**
- Sa, Eingang **vor 12:00** → **heute 13:00**
- sonst (Sa ab 12:00, So, Mo–Fr ab 15:00) → **nächster Werktag 09:00**
  (ab morgen; Sonntag wird übersprungen, Samstag zählt als Werktag → Fr 16:00 ⇒ Sa 09:00)

---

## Was Teresa im Kontakt sieht

- **Kontakt-Datensatz** mit Name, Telefon (anruf-fertig als +49…), E-Mail,
  Wunsch-Behandlung, Wunschzeitraum, WhatsApp-Wunsch, Nachricht,
  Priorität, Lead-Qualität, Lead-Wert, Quelle-Seite – und dem Owner „Teresa".
- **Eine offene Aufgabe** „Rückruf: {Vorname} – {Behandlung} – Wunsch: {Zeitraum}"
  mit Telefon/WhatsApp/Nachricht/Priorität/Eingang im Text, Typ **Anruf**,
  Priorität passend zur Lead-Priorität, fällig gemäß Regel oben.
- **Team-Mail** (an `MAIL_TO`) mit denselben Infos + Deep-Link zum Kontakt.

Die Kundin erhält parallel die **Eingangsbestätigung** (Absender
„DIE BIANCO <termine@diebianco.de>", Reply-To salon@diebianco.de).

---

## Robustheit

- **HubSpot-Ausfall** → die Salon-Mail geht trotzdem raus (Lead nicht verloren),
  Fehler wird geloggt, die Antwort bleibt Erfolg (Conversion greift).
- **Kundinnen-Mail-Fehler** → Anfrage gilt trotzdem als Erfolg.
- **Aufgaben-Fehler** (z. B. fehlender Scope) → blockiert Mails/Antwort nicht.
- **Idempotenz** → identische E-Mail innerhalb 5 Min erzeugt keine zweite
  Aufgabe/Mail (geprüft am Kontakt, nicht In-Memory → Serverless-tauglich).

---

## Benötigte Scopes / verifizierter Stand (2026-09-13)

| Fähigkeit | Scope | Status |
|---|---|---|
| Kontakte lesen/schreiben | `crm.objects.contacts.read/write` | ✅ vorhanden |
| Aufgaben anlegen | `crm.objects.tasks.write` | ✅ vorhanden (getestet: create 201 / delete 204) |
| Owner zuweisen | (Teil von contacts.write) | ✅ funktioniert (81184186 verifiziert) |
| Owner **auflisten** | `crm.objects.owners.read` | ⚠️ **fehlt** (403) |

> `crm.objects.owners.read` ist **nicht nötig** für die Zuweisung – nur, falls wir
> später Owner im Code auflisten/rotieren wollen. Dann in der Private App
> ergänzen: HubSpot → Einstellungen → Integrationen → Private Apps → Scopes.
> Sollte der Task-Call künftig doch 403 liefern, denselben Weg für
> `crm.objects.tasks.write` gehen.

---

## ENV-Variablen

Siehe `.env.example`. Kurzüberblick:

- **HubSpot:** `HUBSPOT_PRIVATE_APP_TOKEN` (Pflicht), optional `HUBSPOT_API_BASE`,
  `HUBSPOT_DEFAULT_OWNER_ID` (Default 81184186).
- **SMTP:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`.
- **Mail:** `MAIL_FROM`, `MAIL_FROM_NAME`, `MAIL_TO`, `MAIL_REPLYTO`,
  `MAIL_PREISE_ANZEIGEN` (Default `true`; `false` blendet die ab-Preise in der
  Eingangsbestätigung aus).
- **Links:** `SITE_URL` (Default https://www.diebianco.de).
- **Spam (optional):** `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`
  (Turnstile rendert/prüft nur, wenn gesetzt – sonst bleibt das Formular nutzbar).

---

## Turnstile aktivieren

Der Spam-Schutz (Cloudflare Turnstile) ist **bedingt**: Das Widget rendert und
wird serverseitig geprüft **nur, wenn beide ENV-Variablen gesetzt sind** – sonst
bleibt das Formular voll funktionsfähig (ohne CAPTCHA). Zum Aktivieren beide
Variablen in Vercel hinterlegen (Prod + Preview) und neu deployen:

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — Site-Key (Client, rendert das Widget)
- `TURNSTILE_SECRET_KEY` — Secret-Key (Server, prüft den Token)

Beide Keys stammen aus dem Cloudflare-Turnstile-Dashboard (eine Site für die
Domain diebianco.de anlegen). Fehlt nur einer der beiden, bleibt der Schutz aus.

## Zeitgesteuerte Jobs (Vercel Cron)

Ohne HubSpot-Workflows übernimmt **Vercel Cron** die zeitgesteuerten Aufgaben.
Cron-Zeiten sind **UTC**; die Berlin-Zeit (Sommer/Winter) wird **im Code** geprüft
(jeder Job entscheidet selbst über Wochentag/Zeitfenster). Alle Zeit-Properties
werden als **Unix-Millisekunden** geschrieben.

### Jobs & Zielzeiten

| Job | Route | Ziel (Berlin) | UTC (CEST/CET) | Auswahl |
|---|---|---|---|---|
| Digest | `/api/cron/digest` | Mo–Sa 08:30 | 06:30 / 07:30 | `lead_status_intern ∈ {neu, nicht_erreicht}`, sortiert Priorität→createdate |
| Nicht erreicht | `/api/cron/nicht-erreicht` | tägl. 10:00 | 08:00 / 09:00 | `nicht_erreicht`, ≥48 h seit `hs_lastmodifieddate`, Zähler-Stufen 1→2 |
| Termine | `/api/cron/termine` | tägl. 09:00 (+16:00) | 07:00 (+14:00) / 08:00 (+15:00) | `termin_vereinbart` + `termin_datum`; Bestätigung/Erinnerung/Status-Aufgabe; optional Bewertung |
| Reaktivierung | `/api/cron/reaktivierung` | Mo 09:30 | 07:30 / 08:30 | `einwilligung_marketing`, alt ≥30 Tage, offener Status |

> **Winterzeit:** UTC-Crons verschieben sich nicht – im Winter laufen die Jobs
> eine Stunde früher (Berlin). Das ist unkritisch, weil die Jobs Wochentag/
> Fenster selbst prüfen (kein exakter Uhrzeit-Gate).

### Betriebsmodell

- **Hobby-Plan (max. 2 Crons, nur täglich):** `vercel.json` definiert **einen**
  Orchestrator `/api/cron/daily` um **07:30 UTC**, der alle Teiljobs in fester
  Reihenfolge aufruft (Digest → Nicht erreicht → Termine → Reaktivierung).
  Die Einzelrouten existieren und sind einzeln aufrufbar.
  *Grenze:* Der zweite Termin-Lauf (16:00) ist auf Hobby nicht möglich →
  Erinnerungen für Abend-Termine können knapp werden (siehe 20–32-h-Fenster).
- **Pro-Plan (Einzel-Crons):** `vercel.json` auf die Einzelrouten umstellen:

  ```json
  {
    "crons": [
      { "path": "/api/cron/digest",         "schedule": "30 6 * * 1-6" },
      { "path": "/api/cron/nicht-erreicht", "schedule": "0 8 * * *" },
      { "path": "/api/cron/termine",        "schedule": "0 7 * * *" },
      { "path": "/api/cron/termine",        "schedule": "0 14 * * *" },
      { "path": "/api/cron/reaktivierung",  "schedule": "30 7 * * 1" }
    ]
  }
  ```

### Absicherung & Dry-Run

- Alle Cron-Routen prüfen `Authorization: Bearer ${CRON_SECRET}` (Vercel setzt
  den Header bei Cron-Aufrufen automatisch). Ohne gesetztes `CRON_SECRET` bleibt
  die Route offen (nur Dev).
- `?dry=1` = **Dry-Run**: nur zählen/loggen, nichts senden, nichts schreiben.
- Jeder Job loggt und liefert: **geprüft / gesendet / übersprungen / Fehler**.
- Lokal testen:
  `curl -H "Authorization: Bearer $CRON_SECRET" "http://localhost:3000/api/cron/daily?dry=1"`

### Zusätzliche Properties (heute angelegt)

- `review_mail_gesendet` (datetime) – Idempotenz der Bewertungsbitte.
- `termin_status_aufgabe_gesendet` (datetime) – verhindert tägliche Doppel-Aufgaben
  beim „Status setzen"-Nudge.
- `nicht_erreicht_seit` wurde **nicht** angelegt – als Signal dient
  `hs_lastmodifieddate` (Caveat: wird durch jede Änderung zurückgesetzt; für den
  Nachfass-Rhythmus ausreichend, da Teresas Statuswechsel die Uhr neu stellt).

### Einwilligung & Abmeldung

- **Transaktional** (kein Opt-in nötig): Terminbestätigung, -erinnerung,
  Nicht-erreicht-Mails.
- **Marketing** (nur bei `einwilligung_marketing = true`): Reaktivierung, Bewertungsbitte.
- Jede Kunden-Mail trägt einen **Abmeldelink** `/api/abmelden?t={Token}`
  (HMAC aus Kontakt-ID + `ABMELDE_SECRET`). Der Link setzt `einwilligung_marketing`
  auf `false` und zeigt eine schlichte Bestätigungsseite. Ohne `ABMELDE_SECRET`
  entfällt der Link.

### Cron-ENV-Variablen

| Variable | Zweck |
|---|---|
| `CRON_SECRET` | Bearer-Token zum Schutz der Cron-Routen (Vercel sendet ihn automatisch) |
| `ABMELDE_SECRET` | HMAC-Secret für Abmelde-Tokens |
| `MEETINGS_LINK_RUECKRUF` | optionaler Rückruf-Buchungslink (Nicht-erreicht-Mail); leer → Satz entfällt |
| `REVIEW_MAIL_ENABLED` | `true` aktiviert die Bewertungsbitte |
| `GOOGLE_REVIEW_URL` | Ziel der Bewertungsbitte |

## Testen

- **Unit-Tests:** `pnpm test` (Ableitungen, Fälligkeit inkl. Wochenende/Zeitzone, E.164,
  Cron-Zeitfenster/Zähler/Auswahlfilter).
- **Integration lokal:** `pnpm dev`, dann `pnpm test:anfrage` – schickt eine
  Anfrage `TEST Foundryone` / `test+<timestamp>@foundryone.de` gegen die lokale
  API (erzeugt echten Kontakt + Aufgabe + Mails). Test-Kontakte danach in
  HubSpot löschen.
