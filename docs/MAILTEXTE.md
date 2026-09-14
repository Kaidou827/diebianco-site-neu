# Kundinnen-Mailtexte – DIE BIANCO

Zur Freigabe durch die Inhaberin. Alle Texte stammen aus `lib/email-texts.ts`.
Werte in `{geschweiften Klammern}` werden automatisch eingesetzt. Zeilen mit
_(nur wenn …)_ erscheinen nur unter der genannten Bedingung.

Absender aller Mails: **DIE BIANCO \<termine@diebianco.de\>** · Antwort an **salon@diebianco.de**.
Jede Mail endet mit dem **Fußzeilen-Block** (siehe ganz unten) inkl. Abmeldelink.

Status der zeitgesteuerten Mails:
- Eingangsbestätigung: **aktiv** (sofort nach der Anfrage).
- Nicht-erreicht 1 & 2: **aktiv**.
- Terminbestätigung & -erinnerung: **derzeit AUS** (StudioLution übernimmt das; per `TERMIN_MAILS_ENABLED` aktivierbar).
- Reaktivierung: **aktiv** (nur mit Marketing-Einwilligung).
- Bewertungsbitte: **derzeit AUS** (per `REVIEW_MAIL_ENABLED` aktivierbar).

---

## 1) Eingangsbestätigung
*Sofort nach dem Absenden des Formulars.*

**Betreff:** Deine Anfrage bei DIE BIANCO – Teresa meldet sich persönlich

```
Hallo {Vorname},

vielen Dank – deine Anfrage für {Behandlung} ist bei uns angekommen.
   (ohne gewählte Behandlung: „vielen Dank – deine Anfrage ist bei uns angekommen.")
Teresa meldet sich innerhalb von 24 Stunden (Mo–Sa) persönlich bei dir – per Telefon oder WhatsApp.
   (ohne WhatsApp-Wunsch: „… persönlich bei dir – telefonisch.")

Dein Wunschzeitraum: {Zeitraum}.        (nur wenn ein Zeitraum gewählt wurde)
   (bei „Samstag" zusätzlich: „Samstags öffnen wir schon um 7 Uhr.")

Zur Orientierung (ab-Preise):            (nur wenn MAIL_PREISE_ANZEIGEN = true)
– Damenschnitt ab 80 €
– Ansatzfarbe ab 65 €
– Strähnen ab 100 €
– Balayage ab 180 €
– Keratin ab 300 €
– Grey Blending nach persönlicher Einschätzung

So findest du uns:
Siedlung Egelsberg 1, 47802 Krefeld
Karte: {Google-Maps-Link}
Mo–Fr 9–17 Uhr · Sa 7–14 Uhr · nur mit Termin
Telefon: +49 174 3091973

Unsere Ergebnisse: {Website}/ergebnisse
Behandlungen & Preise: {Website}/behandlungen-preise

Du musst jetzt nichts weiter tun – Teresa meldet sich persönlich bei dir.

Bis bald & liebe Grüße
Dein Team von DIE BIANCO
```

---

## 2) „Wir haben versucht, dich zu erreichen" (Nicht erreicht – 1. Mail)
*Frühestens 48 h, nachdem der Status auf „nicht erreicht" gesetzt wurde.*

**Betreff:** Wir haben versucht, dich zu erreichen

```
Hallo {Vorname},

Teresa hat versucht, dich telefonisch zu erreichen – leider ohne Erfolg.
Ruf uns gerne zurück unter +49 174 3091973, dann finden wir gemeinsam einen Termin.

Dein Wunschzeitraum: {Zeitraum}.        (nur wenn ein Zeitraum hinterlegt ist)

Du kannst dir hier auch direkt einen Rückruf aussuchen: {Rückruf-Link}
   (nur wenn ein Rückruf-Link hinterlegt ist)

Bis bald & liebe Grüße
Dein Team von DIE BIANCO
```

---

## 3) „Kurze Erinnerung" (Nicht erreicht – 2. Mail)
*5 Tage nach der 1. Mail, danach keine weitere.*

**Betreff:** Kurze Erinnerung – wir sind für dich da

```
Hallo {Vorname},

wir würden dich gerne noch erreichen. Melde dich einfach, wenn dein Wunsch noch aktuell ist –
du erreichst uns unter +49 174 3091973.

Dein Wunschzeitraum: {Zeitraum}.        (nur wenn ein Zeitraum hinterlegt ist)

Du kannst dir hier auch direkt einen Rückruf aussuchen: {Rückruf-Link}
   (nur wenn ein Rückruf-Link hinterlegt ist)

Liebe Grüße
Dein Team von DIE BIANCO
```

---

## 4) Terminbestätigung  _(derzeit AUS)_
*Wenn ein Termin vereinbart ist und noch keine Bestätigung verschickt wurde.*

**Betreff:** Dein Termin bei DIE BIANCO ist bestätigt

```
Hallo {Vorname},

dein Termin bei DIE BIANCO ist bestätigt:
{Wochentag, Datum um Uhrzeit} Uhr
Behandlung: {Behandlung}                 (nur wenn Behandlung bekannt)
Plane bitte {Dauer} ein.                 (nur wenn Dauer bekannt)

Adresse: Siedlung Egelsberg 1, 47802 Krefeld
Karte: {Google-Maps-Link}

Bitte sag uns mindestens 24 Stunden vorher Bescheid, falls du den Termin nicht wahrnehmen kannst.

Wir freuen uns auf dich!
Dein Team von DIE BIANCO
```

Dauer je Behandlung: Schnitt ca. 1–1,5 h · Farbe/Ansatz ca. 2–3 h ·
Strähnen/Blondierung ca. 2–4 h · Balayage ca. 3–5 h · Grey Blending ca. 3–5 h ·
Keratin ca. 2–3 h · Beratung ca. 30 Min.

---

## 5) Terminerinnerung  _(derzeit AUS)_
*20–32 Stunden vor dem Termin.*

**Betreff:** Erinnerung an deinen Termin bei DIE BIANCO

```
Hallo {Vorname},

kleine Erinnerung an deinen Termin bei DIE BIANCO:
{Wochentag, Datum um Uhrzeit} Uhr

Adresse: Siedlung Egelsberg 1, 47802 Krefeld
Karte: {Google-Maps-Link}

Falls es doch nicht passt, sag uns bitte mindestens 24 Stunden vorher Bescheid.

Bis gleich & liebe Grüße
Dein Team von DIE BIANCO
```

---

## 6) Reaktivierung
*Einmalig, wenn eine Anfrage mit Marketing-Einwilligung ≥ 30 Tage offen ist.*

**Betreff:** Dein Wunschtermin ist noch offen

```
Hallo {Vorname},

dein Wunschtermin bei DIE BIANCO ist noch offen – wir würden dich gerne verwöhnen.
Gerade im Herbst ist die perfekte Zeit für einen frischen Farb-Look.
   (nur von September bis November)
Melde dich einfach, wenn es passt: +49 174 3091973.

Liebe Grüße
Dein Team von DIE BIANCO
```

---

## 7) Bewertungsbitte  _(derzeit AUS)_
*Nach dem Termin (Status „erschienen"), nur mit Marketing-Einwilligung.*

**Betreff:** Wie gefällt dir dein Ergebnis?

```
Hallo {Vorname},

wir hoffen, du fühlst dich mit deinem neuen Look rundum wohl!
Wenn du magst, freuen wir uns riesig über eine kurze Bewertung – das hilft anderen sehr:
{Google-Bewertungs-Link}

Danke dir & liebe Grüße
Dein Team von DIE BIANCO
```

---

## Fußzeile (unter jeder Mail 2–7)

```
DIE BIANCO · Siedlung Egelsberg 1, 47802 Krefeld · +49 174 3091973 · salon@diebianco.de
Impressum · Datenschutz · Keine E-Mails mehr {Abmeldelink}
```

Die Eingangsbestätigung (1) nutzt dieselben Kontaktdaten, endet aber mit
Impressum/Datenschutz ohne Abmeldelink (transaktional).
