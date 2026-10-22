# Vorschlag: Archiv-Clock entkoppeln von hs_lastmodifieddate

> Nur Analyse + Vorschlag (kein Umbau). Stand 2026-10-23.

## Problem

Der Archiv-Cron setzt `kein_interesse`-Kontakte auf `archiv`, wenn
`hs_lastmodifieddate ≥ 90 Tage` (`lib/cron/logik.ts` → `sollArchivieren`,
Bedingung `status==="kein_interesse" && lastmodMs ≥ 90 Tage`).

`hs_lastmodifieddate` ändert sich bei **jeder** Property-Änderung – auch wenn
Teresa nur eine Notiz ergänzt, ein beliebiges Feld anfasst, oder wenn ein
Backfill/Cron schreibt. Damit wird die „90 Tage kein Interesse"-Uhr bei jeder
unbeteiligten Bearbeitung zurückgesetzt → solche Kontakte werden faktisch **nie**
archiviert. (Genau deshalb läuft das Backfill-Skript standardmäßig nur über
aktive Status und lässt `kein_interesse` aus.)

## Vorschlag (empfohlen): eigener Anker `kein_interesse_seit`

Analog zum bereits existierenden Muster `nicht_erreicht_seit` (wird in
`lib/cron/jobs.ts` beim ersten Antreffen von `nicht_erreicht` gestempelt und
beim Statuswechsel wieder geleert):

1. Neue Property `kein_interesse_seit` (datetime).
2. Ein Cron (z. B. der tägliche/Archiv-Lauf) **stempelt** `kein_interesse_seit =
   jetzt`, sobald er einen Kontakt mit `lead_status_intern="kein_interesse"`
   **ohne** Anker sieht. Vorhandener Anker wird nie überschrieben.
3. `sollArchivieren` prüft dann `kein_interesse_seit ≥ 90 Tage` statt
   `hs_lastmodifieddate`.
4. **Reset:** verlässt der Status `kein_interesse` (z. B. durch eine erneute
   Anfrage → Status `neu`), wird `kein_interesse_seit` geleert – passend zur
   bestehenden Wiederkehr-Logik (`lib/wiederkehr.ts`), die bereits
   `nicht_erreicht_seit` leert.

**Warum Cron-gestempelt statt „bei Statuswechsel setzen":** `kein_interesse`
wird meist **manuell** von Teresa im CRM gesetzt. HubSpot Starter hat **keine
Workflows**, es gibt also keinen automatischen Trigger beim manuellen
Statuswechsel. Der Cron-Anker funktioniert ohne Workflow (wie `nicht_erreicht_seit`
schon heute). Verzögerung: max. 1 Tag bis zum ersten Stempeln – unkritisch bei
einer 90-Tage-Frist.

Vorteil: Die Archiv-Uhr ist **immun** gegen unbeteiligte Bearbeitungen; Notizen/
Feldänderungen durch Teresa verschieben nichts mehr.

## Alternative (nicht empfohlen): generisches `status_geaendert_am`

Ein Feld, das bei **jedem** Statuswechsel gesetzt wird. Nachteil: Bei manuellen
Statuswechseln im CRM ohne Workflow nicht automatisch befüllbar → genau der
kritische `kein_interesse`-Fall bliebe ungestempelt. Nur praktikabel mit
HubSpot-Workflows (nicht im Starter-Plan) oder demselben Cron-Stempel-Mechanismus
wie oben – dann ist der spezifische Anker (Variante A) einfacher und zielgenauer.

## Übergang / Risiko

- Bestandskontakte mit `kein_interesse` ohne Anker: beim ersten Cron-Lauf wird
  `kein_interesse_seit = jetzt` gesetzt → ihre 90 Tage starten ab dann (einmaliger
  Versatz, bewusst in Kauf zu nehmen; ein optionaler Backfill könnte stattdessen
  `hs_lastmodifieddate` als Startwert nehmen – entscheidet ihr).
- Umfang: 1 neue Property + kleine Ergänzung in `jobs.ts` (Stempel + Reset) +
  eine Zeile in `sollArchivieren` + `lib/wiederkehr.ts` (Anker leeren).

→ **Kein Umbau jetzt.** Bei OK setze ich das als eigenen, getesteten PR um.
