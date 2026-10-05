# Recruiting-Landingpages & Kampagnen – Briefing

> Übergabe-Dokument. Zweck: Grundlage, damit eine Claude-Session mit Scharam
> **Schritt für Schritt die Werbekampagnen** (Meta/Instagram + ggf. Google) für die
> beiden Stellen aufsetzt. Stand: Oktober 2026. Code ist live auf www.diebianco.de.

---

## 1. Was wurde gebaut (Recruiting-Seite)

Eine eigene Bewerbungs-Landingpage für **zwei Stellen**:

| Stelle | URL | Zielgruppe |
|---|---|---|
| Ausbildung Friseur/in (m/w/d) | `/jobs/ausbildung-friseur-krefeld` | Azubis / Schulabgänger |
| Friseur/in (m/w/d), Schwerpunkt Farbe | `/jobs/friseur-krefeld` | gelernte Friseur/innen |
| Übersicht + Weiterleitung | `/jobs` (`?stelle=azubi` / `?stelle=friseur`) | Einstieg / Menü |
| Danke-Seite (noindex) | `/jobs/danke` | nach Absenden |

Erreichbar über **Header-Menü („Jobs")** und **Footer**. In `sitemap.xml` (außer Danke-Seite).

## 2. Plan & Gedanke dahinter

- **Mobile-first.** Der Traffic kommt v. a. aus Meta/Instagram-In-App-Browsern (Handy).
  Alles ist für kleine Screens + Daumenbedienung gebaut.
- **Niedrige Hürde statt klassischer Bewerbung.** 3-Schritt-Formular (Stepper) mit
  Klick-Optionen; **kein Lebenslauf/Upload nötig**. Pflicht sind nur Vorname, Telefon,
  Datenschutz-Haken. Idee: möglichst viele qualifizierte Erstkontakte, Feinheiten klärt
  Teresa danach persönlich per WhatsApp/Anruf.
- **Schnelle Reaktion.** Nach Absenden gehen zwei Mails raus (siehe §3) + die/der
  Bewerber/in bekommt sofort einen WhatsApp-Link zum Salon. Ziel: Kontakt binnen 2 Werktagen.
- **Zwei getrennte Fragebögen** je Stelle (Azubi vs. gelernt), damit die Antworten direkt
  einschätzbar sind (Erfahrung, Schwerpunkte, Start, Arbeitszeit …).
- **Bestehende Kontakt-/Lead-Logik blieb unangetastet** – die Jobs-Strecke läuft separat.

## 3. Wohin gehen Bewerbungen

Backend `POST /api/bewerbung` (zod-validiert, Honeypot gegen Spam) verschickt per SMTP:
- **Benachrichtigung an den Salon** → `businessdiebianco@gmail.com`
  **+ CC an `scharam.saleh@gmail.com`** (dein Überblick; fest im Code hinterlegt).
  Enthält alle Antworten + Button „Auf WhatsApp antworten" / „Anrufen".
- **Eingangsbestätigung an die/den Bewerber/in** (wenn E-Mail angegeben).

Live getestet: Absenden liefert `{ok:true}`, Mailversand funktioniert.

## 4. Tracking-Stand (WICHTIG für die Kampagnen)

**Was im Code schon feuert (Website-Seite):**
- **Meta-Pixel** (`1556322352741442`): `PageView` global; auf der Danke-Seite
  **`fbq('track','Lead', {content_category:'bewerbung', content_name:<stelle>})`**.
- **GTM** (`GTM-KGB529BZ`) + **Google-Ads-Tag** (`AW-17270753092`) sind geladen.
- **dataLayer-Events** für GTM: `bewerbung_step_1/2/3`, `bewerbung_success`, `bewerbung_danke`.
- First-Touch-Attribution (utm_*, fbclid, gclid) wird mitgespeichert & landet in der Salon-Mail.

**Was NOCH FEHLT (Werbekonten-Seite – das ist der offene Punkt):**
- ❌ **Google Ads: keine Conversion-Action** definiert/ausgelöst. Der AW-Tag lädt nur,
  es feuert kein `gtag('event','conversion', …)`. → In Google Ads eine Conversion-Action
  „Bewerbung" anlegen und entweder per Code auf `/jobs/danke` oder per GTM-Tag (Trigger =
  dataLayer-Event `bewerbung_danke`) auslösen.
- ⚠️ **Meta: „Lead" feuert zwar, ist aber noch nicht als Conversion/Optimierungs-Ereignis
  eingerichtet & verifiziert.** In Events Manager prüfen (Test Events), als Conversion
  nutzen, Domain verifizieren. Optional **Conversions API** (serverseitig) für
  robustere Messung bei iOS/Consent.
- ⚠️ **Consent-Gating:** Alle Marketing-Tags laufen nur nach Cookiebot-Zustimmung
  („marketing") und nur in Production. In-App-Browser (Meta/IG) lehnen Consent oft ab →
  Pixel feuert dann nicht → Conversions werden untererfasst. Bei der Kampagnen-Messung
  einplanen (ggf. CAPI als Ausgleich).

## 5. Offene Punkte / To-dos vor „scharf schalten"

1. **Conversions einrichten** (Google Ads + Meta) – siehe §4. Höchste Priorität, sonst
   optimiert der Algorithmus blind.
2. **Gehalt** (optional): Seite zeigt Gehalt nur, wenn ENV `JOBS_GEHALT_FRISEUR_MIN` /
   `JOBS_GEHALT_AZUBI_JAHR1` in Vercel gesetzt sind (sonst Platzhalter raus). Entscheiden,
   ob Gehalt genannt wird (auch fürs JobPosting-JSON-LD / Google Jobs).
3. **Echte Fotos** auf den Stellenseiten (aktuell Platzhalter `/Sektionbild.jpg`,
   `/teresa-bianco-portrait.jpg`).
4. **Visuals ↔ Anzeigengruppen**: Bianco-Bilder aus den Downloads durchgehen und je
   Anzeigengruppe/Stelle das passende Motiv zuordnen (siehe §6).

## 6. Nächste Schritte mit dem Kampagnen-Claude

Die Session soll mit Scharam **step by step** durchgehen:

1. **Conversion-Setup zuerst** (Meta „Lead" verifizieren/als Conversion nutzen; Google-Ads-
   Conversion-Action anlegen + über GTM/Code auf `/jobs/danke` auslösen).
2. **Kampagnenstruktur** je Stelle (Azubi / Friseur) als getrennte Anzeigengruppen –
   unterschiedliche Zielgruppen, Botschaften, Budgets.
3. **Visuals durchgehen**: die Bianco-Bilder/Videos aus den Downloads sichten und je
   Anzeigengruppe das beste Motiv wählen (Azubi: jung, Team, Ausbildung/Entwicklung;
   Friseur: Können, Farbe/Balayage, Salon-Atmosphäre). → Dafür müssen die Bilder der
   Session vorliegen (hochladen oder Ordner nennen).
4. **Anzeigentexte** auf die Landingpage-Botschaft abstimmen (niedrige Hürde, „kein
   Lebenslauf nötig", schnelle Rückmeldung, Krefeld).
5. **UTM-Parameter** konsequent setzen (die Seite liest sie aus und schreibt sie in die
   Bewerbungs-Mail → saubere Quellen-Zuordnung).
6. **Launch + Messung**: nach ein paar Tagen Conversions/Kosten je Stelle prüfen,
   nachsteuern.

---

### Kurz-Kontext Technik (falls die Session im Repo arbeitet)
Next.js 15 (App Router), Vercel, **pnpm** (nie npm). Jobs-Code: `app/jobs/*`,
`app/api/bewerbung/route.ts`, `components/BewerbungFormular.tsx`, `components/jobs/*`,
`lib/jobs.ts`, `lib/jobs-content.ts`, `lib/email-texts.ts`. Mailtexte dokumentiert in
`docs/MAILTEXTE.md`.
