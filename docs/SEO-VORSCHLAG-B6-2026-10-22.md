# B6 – SEO / Landingpages: Vorschlag (kein Code)

> Reiner Vorschlag zu Prompt 10 B6. **Keine** Code-Änderung – Umsetzung in einem
> eigenen PR nach Freigabe. Belege mit `Datei:Zeile` bzw. Live-Prüfung (21.–22.10.).

## 0. Live-Prüfungen (Stand 22.10., curl auf www.diebianco.de)

- **`/Blog/balayage-krefeld` Live-`<title>` = „Teresa Bianco: Exklusiver Friseur in Krefeld | Stilberatung & Haarkunst"** – also der **generische Startseiten-Title**. Das ist **KEIN** Google-Rewrite, sondern wird so **ausgeliefert**, obwohl `app/Blog/[slug]/page.tsx:766` `title: post.title` setzt (für „balayage-krefeld" wäre das „Balayage Krefeld: Der ultimative Guide …", `:161`). → Die `generateMetadata` des `[slug]`-Routes greift für diese URL nicht (vermutlich Konflikt mit `app/Blog/page.tsx` oder fehlendes `generateMetadata`). **Code-Thema, im B6-PR prüfen.**
- **`/kontakt` Live-`<title>` = generischer Startseiten-Title** (bestätigt – `app/kontakt/page.tsx` exportiert kein `metadata`, erbt `app/layout.tsx:16`).

## 1. Eigene Titles & Descriptions je indexierter Seite

Problem: `/kontakt` und `/Blog/balayage-krefeld` tragen live den Startseiten-Title.
Vorschlag (Muster „<Leistung> in Krefeld | DIE BIANCO"):
- `/kontakt` → eigenes `metadata` (z. B. „Termin anfragen – Friseur in Krefeld | DIE BIANCO" + eigene Description).
- `/Blog/balayage-krefeld` → Ursache beheben, dass `post.title` wirklich greift.
- **To-do:** alle indexierten Routen auf eigene Title/Description prüfen (Liste siehe `docs/ARCHITEKTUR-STAND-2026-10-21.md` §Seiten). dienstleistungen/* und grey-blending-* haben bereits eigene Titles.

## 2. `/grey-blending-krefeld` stärken

- **sitemap:** bereits enthalten (`app/sitemap.ts:18`) – kein Handlungsbedarf.
- **Verlinkung:** von Startseite + „Leistungen"-Menü auf `/grey-blending-krefeld` verlinken (heute zeigt das Menü auf `/dienstleistungen/grey-blending`). Interne Links auf die Ziel-Landingpage bündeln.
- **Inhalt:** Richtwert „ab 390 €" + Preisklausel (`lib/preistexte.ts`, nach B4-Muster); **FAQ-Block** mit FAQPage-JSON-LD, Fragen (die Google bei „grey blending krefeld" selbst zeigt):
  1. Was kostet Grey Blending? 2. Wie lange dauert es? 3. Für wen eignet es sich? 4. Wie oft nachfärben?
- **Dubletten-Konflikt (wichtig):** Es existieren **drei** Grey-Blending-Seiten:
  `/grey-blending-krefeld` (`sitemap:18`), `/grey-blending-beratung` (`:17`), `/dienstleistungen/grey-blending` (`:26`) – plus Blog. Sie konkurrieren um dasselbe Keyword.
  **Vorschlag (nicht eigenmächtig):** eine als Haupt-Landingpage festlegen (`/grey-blending-krefeld`), die anderen per `canonical` darauf zeigen lassen oder 301 umleiten. Entscheidung + Wortlaut bei Teresa/Scharam.

## 3. Balayage

- Es gibt den Blogartikel `/Blog/balayage-krefeld`. **Vorschlag:** prüfen, ob eine eigene Leistungsseite `/balayage-krefeld` sinnvoll ist (nach Grey-Blending-Muster: Ergebnisbilder, Bewertungen, Richtwert „ab 390 €", FAQ, Formular mit `?behandlung=balayage`). Dann Blogartikel → Leistungsseite verlinken, **nicht** beide auf dasselbe Keyword optimieren. **Erst Vorschlag, Umsetzung nach OK.**
- Wettbewerb rankt mit eigenen Balayage-Seiten (les-coiffeurs, thesoho, ef-instyle); SHEARER zeigt Preise offen → Preistransparenz (Richtwert) ist ein realistischer Hebel.

## 4. Bewertungsangabe (fest im Code)

- „5,0 · 37 Google-Bewertungen" steht **hardcodiert** in `app/kontakt/page.tsx:67` **und** `components/AnfrageFormular.tsx:389`. Google-Profil: **4,9 bei 44**.
- **Vorschlag:** Zahl an **einer** Stelle pflegbar machen – eine Config-/ENV-Konstante (z. B. `lib/site-info.ts`: `googleRating`, `googleReviews`) – oder ohne Zahl. Nicht an zwei Stellen fest lassen. Wert/Anzeige entscheidet Teresa.

## 5. Nur melden – Teresa entscheidet (nicht ändern)

- **„Antwort in unter 1 Minute":** `components/AnfrageFormular.tsx:360` – `{istDeep ? "✦ Unverbindlich · Antwort in naher Zukunft" : "✦ In unter 1 Minute · unverbindlich"}`. Die `standard`-Variante zeigt „In unter 1 Minute". Widerspricht der Entscheidung vom 08.10. („keine Antwortzeit-Versprechen"). **Nicht geändert** – Teresa entscheidet.
- **Leerer Abschnitt „Lern mich kennen":** `app/kontakt/page.tsx:85` (`<h2>Lern mich kennen</h2>`, Video-Bereich). **Vorschlag:** ausblenden, solange ohne Inhalt. Entscheidung bei Teresa.

## 6. LocalBusiness/HairSalon-JSON-LD prüfen

- `HairSalon`-JSON-LD vorhanden u. a. in `app/ueber-uns/page.tsx:20` und allen `app/dienstleistungen/*/layout.tsx:13`. **Vorschlag:** Name, Adresse (**Siedlung Egelsberg 1, 47802 Krefeld**), Telefon und Öffnungszeiten (`lib/site-info.ts` → `openingHours`) gegen das **Google-Profil** abgleichen und konsistent halten; ein vollständiges `HairSalon`/`LocalBusiness`-Snippet auf Startseite + `/kontakt` mit `aggregateRating` (konsistent zu Punkt 4) ergänzen.

---

## Priorisierung (Vorschlag für den B6-PR)
1. `/kontakt`- und `/Blog/balayage-krefeld`-Title fixen (schnell, hohe Wirkung).
2. Grey-Blending-Dubletten entscheiden (canonical/301) + interne Verlinkung.
3. Bewertungszahl zentralisieren/korrigieren; „Lern mich kennen" ausblenden.
4. FAQ+FAQPage-JSON-LD auf `/grey-blending-krefeld`; dann Balayage-Leistungsseite.
5. LocalBusiness-JSON-LD vervollständigen/abgleichen.

Alle Punkte mit Kundentext/Zahlen (Bewertung, „unter 1 Minute", FAQ-Wortlaut) erst nach Teresas Freigabe live.
