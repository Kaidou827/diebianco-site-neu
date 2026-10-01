# Kundinnen-Mailtexte – DIE BIANCO

Zur Freigabe durch die Inhaberin. Alle Texte stammen aus `lib/email-texts.ts`.
Werte in `{geschweiften Klammern}` werden automatisch eingesetzt. Zeilen mit
_(nur wenn …)_ erscheinen nur unter der genannten Bedingung.

Absender aller Mails: **DIE BIANCO \<termine@diebianco.de\>** · Antwort an **salon@diebianco.de**.
Jede Kunden-Mail endet mit dem **Fußzeilen-Block** (siehe ganz unten) inkl. Abmeldelink.

**Stand 30.09.2026:**
- Eingangsbestätigung: **aktiv** (sofort nach der Anfrage).
- Nicht-erreicht 1 & 2: **aktiv** (nach Statuswechsel auf „nicht erreicht").
- Reaktivierung: **aktiv** (nur mit Marketing-Einwilligung, nach ≥30 Tagen).
- Terminbestätigung & -erinnerung: **nicht mehr automatisch** – Teresa bestätigt Termine
  selbst per WhatsApp (Vorlage unten). Alte Texte im Abschnitt „Nicht mehr automatisch".
- Bewertungsbitte: **entfernt** (Text im Abschnitt „Nicht mehr automatisch").

---

## Standard-Klausel Preise

Steht am Ende **jeder** Kundinnen-Mail, die Preise nennt oder auf `/behandlungen-preise`
verlinkt (Eingangsbestätigung, Nicht-erreicht 1 & 2, Reaktivierung) – als eigener,
kleiner, grauer Block über der Fußzeile:

> Hinweis zu unseren Preisen: Alle genannten Preise sind ab-Preise und dienen der
> Orientierung. Der tatsächliche Preis richtet sich nach Zustand, Länge und Struktur
> deiner Haare sowie dem Aufwand der Behandlung und wird entsprechend angepasst.
> Teresa bespricht den Preis vor Beginn der Behandlung mit dir.

---

## WhatsApp-Vorlage Terminbestätigung (manuell)

Teresa bestätigt Termine selbst per WhatsApp. Der fertige Link steht in der
**Rückruf-Aufgabe** in HubSpot (Zeile „Terminbestätigung per WhatsApp: …") und öffnet
WhatsApp mit einem vorformulierten Entwurf **an die Kundin**. Vorlage:

> Hallo {Vorname}, hier ist Teresa von DIE BIANCO. Dein Termin für {Behandlung}:
> [Datum] um [Uhrzeit], Siedlung Egelsberg 1, 47802 Krefeld. Bitte plane ca. [Dauer] ein.
> Falls etwas dazwischenkommt, sag mir bitte mindestens 24 Stunden vorher Bescheid. Bis bald!

`[Datum]`, `[Uhrzeit]` und `[Dauer]` bleiben als Platzhalter stehen – Teresa ersetzt sie
im WhatsApp-Entwurf (oder formuliert frei um). Dauer-Richtwerte:
Schnitt ca. 1–1,5 h · Farbe/Ansatz ca. 2–3 h · Strähnen/Blondierung ca. 2–4 h ·
Balayage ca. 3–5 h · Grey Blending ca. 3–5 h · Keratin ca. 2–3 h · Beratung ca. 30 Min.

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

Du hast es eilig oder eine kurze Frage? Am schnellsten erreichst du uns per WhatsApp: [Schreib uns auf WhatsApp]
   (Text-Version: nackter Link https://wa.me/491743091973?text=… mit vorformuliertem Text)

Dein Wunschzeitraum: {Zeitraum}.        (nur wenn ein Zeitraum gewählt wurde)
   (bei „Samstag" zusätzlich: „Samstags öffnen wir schon um 7 Uhr.")

Zur Orientierung – unsere ab-Preise:     (nur wenn MAIL_PREISE_ANZEIGEN = true)
– Damenschnitt ab 80 €
– Ansatzfarbe ab 65 €
– Strähnen ab 150 €
– Balayage ab 300 €
– Keratin ab 300 €
– Grey Blending ab 390 €
Alle Angaben sind ab-Preise.

So findest du uns:
Siedlung Egelsberg 1, 47802 Krefeld
Karte: {Google-Maps-Link}
Mo–Fr 9–17 Uhr · Sa 7–14 Uhr · nur mit Termin
Telefon: +49 174 3091973

Behandlungen & Preise: {Website}/behandlungen-preise

Du musst jetzt nichts weiter tun – Teresa meldet sich persönlich bei dir.

Bis bald & liebe Grüße
Dein Team von DIE BIANCO

[Standard-Klausel Preise]        (siehe oben)
```

Die ab-Preise entsprechen den Kategorien auf `/behandlungen-preise`.

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

[Standard-Klausel Preise]
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

[Standard-Klausel Preise]
```

---

## 4) Reaktivierung
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

[Standard-Klausel Preise]
```

---

## Fußzeile (unter jeder Kunden-Mail 2–4)

```
DIE BIANCO · Siedlung Egelsberg 1, 47802 Krefeld · +49 174 3091973 · salon@diebianco.de
Impressum · Datenschutz · Keine E-Mails mehr {Abmeldelink}
```

Die Eingangsbestätigung (1) nutzt dieselben Kontaktdaten, endet aber mit
Impressum/Datenschutz **ohne** Abmeldelink (transaktional).

---

# Nicht mehr automatisch (Stand 30.09.2026)

Diese Texte werden **nicht mehr automatisch** verschickt (Beschluss vom 30.09.2026),
bleiben hier aber für später erhalten. Terminbestätigung/-erinnerung übernimmt Teresa
manuell per WhatsApp (Vorlage oben); die Bewertungsbitte wurde entfernt.

### (ehemals) Terminbestätigung

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

### (ehemals) Terminerinnerung

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

### (ehemals) Bewertungsbitte

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

# Bewerbungen

Aus den Jobs-Landingpages (`/jobs/…`). Getrennt vom Lead-Flow, **keine** Preis-Klausel,
**kein** Abmeldelink (Vertragsanbahnung). Absender „DIE BIANCO \<termine@diebianco.de\>".

## Benachrichtigung an den Salon
*An `BEWERBUNG_MAIL_TO` (Default businessdiebianco@gmail.com), CC `BEWERBUNG_MAIL_CC`, Reply-To = E-Mail der Bewerber/in.*

**Betreff:** ✂️ Neue Bewerbung – {Stellenlabel} – {Vorname} {Nachname}

```
Stelle: {Stellenlabel}
Name: {Vorname} {Nachname}
Telefon: {Telefon}
Kontaktwunsch: {WhatsApp | Anruf}
E-Mail: {E-Mail}            (nur wenn angegeben)
… alle Formular-Antworten als lesbare Tabelle …

[Auf WhatsApp antworten]   (nur bei gültiger Telefonnummer)   [Anrufen]

Quelle: {quelle_seite} · utm: {source}/{medium}/{campaign} · fbclid: {ja|nein}
Eingang: {Datum/Uhrzeit Europe/Berlin}

Bewerberdaten: nur für das Bewerbungsverfahren nutzen, spätestens 6 Monate nach Abschluss löschen.
```

**WhatsApp-Vorlage (Teresa → Bewerber/in), Link in der Mail:**
> Hallo {Vorname}, hier ist Teresa von DIE BIANCO. Danke für deine Bewerbung als {Stellenlabel}!
> Wann passt es dir für ein kurzes Telefonat oder ein Kennenlernen im Salon? Liebe Grüße, Teresa

## Eingangsbestätigung an die Bewerber/in
*Nur wenn eine E-Mail angegeben wurde. Reply-To businessdiebianco@gmail.com.*

**Betreff:** Deine Bewerbung bei DIE BIANCO ist angekommen

```
Hallo {Vorname},

danke für deine Bewerbung als {Stellenlabel}.
Teresa schaut sich deine Angaben persönlich an und meldet sich innerhalb von 2 Werktagen per {WhatsApp | Telefon} bei dir.

Du hast schon einen Lebenslauf oder Fotos deiner Arbeiten? Schick sie gern direkt an
businessdiebianco@gmail.com oder per WhatsApp: {wa.me-Link}

Bis bald,
dein Team von DIE BIANCO · Siedlung Egelsberg 1 · 47802 Krefeld
```
