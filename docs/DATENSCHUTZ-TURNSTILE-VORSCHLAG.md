# Datenschutz-Textvorschlag: Cloudflare Turnstile

**Status: ENTWURF – nicht live.** Vor Veröffentlichung von Teresa (und idealerweise
rechtlich) freigeben lassen. Erst danach als Abschnitt in
[app/datenschutz/page.tsx](../app/datenschutz/page.tsx) unter Kapitel
„4. Plugins und Tools" (neben Google Maps) einfügen.

**Kontext:** Die Datenschutzerklärung erwähnt Cloudflare Turnstile bislang nicht.
Turnstile wird erst aktiv, wenn beide ENV-Keys in Vercel gesetzt sind (siehe
„Turnstile aktivieren" in [AUTOMATION.md](AUTOMATION.md)). Der Abschnitt sollte
**zeitgleich mit der Aktivierung** live gehen.

> Hinweis: Dies ist ein fachlicher Formulierungsvorschlag, keine Rechtsberatung.
> Angaben in `[eckigen Klammern]` müssen vor Freigabe geprüft/ergänzt werden
> (insb. Rechtsgrundlage je nach Consent-Einbindung und AV-Vertrag).

---

## Cloudflare Turnstile

Wir nutzen auf unseren Formularen (z. B. Kontakt- und Terminanfrage) den Dienst
Cloudflare Turnstile. Anbieter ist die Cloudflare, Inc., 101 Townsend St., San
Francisco, CA 94107, USA (nachfolgend „Cloudflare").

Turnstile dient dazu, zu überprüfen, ob die Dateneingabe auf unseren Formularen
durch einen Menschen oder durch ein automatisiertes Programm (Bot) erfolgt. So
schützen wir unsere Formulare vor Spam und missbräuchlicher automatisierter
Nutzung. Hierzu analysiert Turnstile das Verhalten der Websitebesucher anhand
verschiedener Merkmale. Diese Analyse beginnt automatisch, sobald der Besucher
ein mit Turnstile geschütztes Formular aufruft bzw. absendet. Zur Analyse wertet
Turnstile verschiedene Informationen aus (z. B. IP-Adresse, Verweildauer auf der
Website, vom Besucher getätigte Mausbewegungen oder Anfragen sowie Angaben des
Browsers und des Betriebssystems). Die während der Analyse erfassten Daten werden
an Cloudflare übermittelt.

Die Speicherung und Analyse erfolgt auf Grundlage von
[Art. 6 Abs. 1 lit. f DSGVO]. Der Websitebetreiber hat ein berechtigtes Interesse
daran, seine Formulare vor missbräuchlichen automatisierten Zugriffen und vor
Spam zu schützen. Sofern eine entsprechende Einwilligung abgefragt wurde (z. B.
über das Cookie-Banner), erfolgt die Verarbeitung ausschließlich auf Grundlage
von Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG, soweit die Einwilligung die
Speicherung von Cookies oder den Zugriff auf Informationen im Endgerät des
Nutzers umfasst. Die Einwilligung ist jederzeit widerrufbar.

Die Datenübertragung in die USA wird auf das EU-US Data Privacy Framework (DPF)
gestützt; Cloudflare ist unter dem DPF zertifiziert.
[AV-Vertrag: Wir haben mit Cloudflare einen Vertrag zur Auftragsverarbeitung
geschlossen.]

Weitere Informationen zu Cloudflare Turnstile finden Sie in der Datenschutz­erklärung
von Cloudflare unter: https://www.cloudflare.com/privacypolicy/

---

## Einbau-Hinweis (technisch, nicht Teil des Rechtstextes)

Als `<h3>` im bestehenden `<section>` „4. Plugins und Tools" in
`app/datenschutz/page.tsx` ergänzen – gleiche Klassen wie die vorhandenen
Abschnitte (`text-xl font-semibold mb-3 text-[#333]` für die Überschrift,
Absätze analog zu „Google Maps"). URLs als `<a>` mit denselben Link-Styles wie im
Rest der Seite.
