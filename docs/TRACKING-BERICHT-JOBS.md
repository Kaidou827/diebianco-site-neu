# Tracking-Bericht – Jobs-Strecke (Recruiting)

> **Lesebericht, keine Codeänderungen.** Stand: 05.10.2026.
> Kontext: Meta-Kampagnen auf `/jobs/*`. Im Events Manager kam beim Test auf
> `/jobs/danke` noch `Lead` an (statt `SubmitApplication`), URL war `https://www.diebianco.de/`
> statt `/jobs/danke`.

## TL;DR (Fazit vorweg)

1. **„Lead" kommt noch an — DEFINITIVE Ursache:** Der Fix `Lead → SubmitApplication`
   (Commit `a91f4ba`) steckt in **PR #10 (Branch `feat/jobs-submitapplication-event`)** und
   ist **nicht in `main`/Produktion** gemergt. Produktion rendert weiterhin
   `components/jobs/DankeTracking.tsx:17` mit `fbq('track','Lead', …)`. Der Fix ist in der
   **richtigen** Datei geschrieben (die `/jobs/danke` rendert), nur nicht deployed.
2. **Falsche URL (`/` statt `/jobs/danke`):** Der Danke-Redirect ist ein **Full-Reload**
   (`window.location.assign`, `BewerbungFormular.tsx:141`). Das Danke-Event feuert also auf
   einer frisch geladenen Seite und *sollte* `/jobs/danke` tragen. Der häufig vermutete
   SPA-Grund (fehlender PageView bei Client-Navigation) erklärt die Danke-URL **nicht direkt**
   — er würde nur greifen, wenn der Redirect client-seitig wäre. Wahrscheinlichste Ursache
   daher **Test-/Consent-Timing-Artefakt** (Details §6).

---

## 1. Meta Pixel

### a) Initialisierung
`app/layout.tsx:91-110` — im `RootLayout` `<head>`, nur bei `NODE_ENV === "production"`
(Bedingung `app/layout.tsx:43`), `strategy="afterInteractive"`, Consent-gated via
`data-cookieconsent="marketing"` + Cookiebot-Auto-Blocking (`app/layout.tsx:46-53`).

```tsx
// app/layout.tsx:92-109
<Script id="meta-pixel" strategy="afterInteractive" data-cookieconsent="marketing"
  dangerouslySetInnerHTML={{ __html: `
    !function(f,b,e,v,n,t,s){...}(window,document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1556322352741442');
    fbq('track', 'PageView');
` }} />
```

> Hinweis: Kommentar `app/layout.tsx:42` sagt „nicht auf Preview-Domains" — die Bedingung ist
> aber `NODE_ENV === "production"`, und das ist auf Vercel-**Preview**-Builds ebenfalls `true`.
> Preview-Deploys feuern den Pixel also mit (relevant für §6, Datenhygiene).

### b) Alle `fbq('track' …)` / `trackCustom` im Repo

| Datei:Zeile | Event | Parameter | Auslöser / Route |
|---|---|---|---|
| `app/layout.tsx:107` | `PageView` | – | Jeder **Full-Load** (Consent) |
| `components/jobs/DankeTracking.tsx:17` | **`Lead`** | `{ content_name: stelle, content_category: 'bewerbung' }` | `useEffect` auf `/jobs/danke`, nur wenn `fbq` existiert — **main/Produktion** |
| *(PR #10, nicht gemergt)* | `SubmitApplication` | `{ content_category:'bewerbung', content_name: stelle }`, 4. Arg `{ eventID }` | gleiche Stelle, ersetzt `Lead` |

Kein `fbq('trackCustom', …)` im Repo.

### c) Gibt es noch `'Lead'`? — JA, in Produktion

```ts
// components/jobs/DankeTracking.tsx:17 (Stand main/Produktion)
w.fbq("track", "Lead", { content_name: stelle, content_category: "bewerbung" })
```

git-Beleg (letzte Commits auf die Datei):

```
# origin/main (= Produktion) — letzter Commit auf DankeTracking.tsx:
953915c feat(jobs): Bewerbungs-Stepper + Seiten-Bausteine   ← enthält fbq('track','Lead')

# über ALLE Branches:
a91f4ba feat(jobs): Meta-Event auf SubmitApplication + eventID (CAPI-Dedup-Basis)
953915c feat(jobs): Bewerbungs-Stepper + Seiten-Bausteine

# Wo liegt der SubmitApplication-Commit?
$ git branch -a --contains a91f4ba
  feat/jobs-submitapplication-event
  remotes/origin/feat/jobs-submitapplication-event          ← NICHT in main
```

Die geänderte Datei `components/jobs/DankeTracking.tsx` **ist** die, die auf `/jobs/danke`
gerendert wird (`app/jobs/danke/page.tsx:5` Import, `:56` `<DankeTracking … />`). Der Fix ist
also korrekt verortet — er ist nur nicht in `main` und damit nicht live.

### d) eventID
- **Produktion/main:** KEINE eventID (siehe c).
- **PR #10:** `eventID = crypto.randomUUID()` (mit Fallback `db-<ts>-<rand>`), 4. Argument von
  `fbq`. Der Wert ist eine **client-seitige Zufalls-UUID** ohne Bezug zu einer Bewerbungs-ID
  und ohne `_fbp`-Bezug → für echte Pixel↔CAPI-Dedup müsste dieselbe ID auch serverseitig
  gesendet werden (aktuell nicht der Fall).

### e) PageView bei Client-Side-Navigation (App Router)?
**NEIN.** `usePathname`/`useSearchParams` werden nur in `GlobalFloatingCtas.tsx:8`,
`ExitIntentHint.tsx:13`, `Navigation.tsx:16` genutzt — **nirgends** wird daraus ein
`fbq('track','PageView')` gefeuert. PageView feuert also nur **einmal pro Full-Load** (Layout).

**Erklärt das die falsche URL?** Nur indirekt:
- Der Danke-Redirect ist `window.location.assign` (`BewerbungFormular.tsx:141`) = **Full-Reload**.
  `/jobs/danke` lädt frisch → Pixel re-init + PageView + Lead mit `document.URL = /jobs/danke`.
  Für die **Danke-Seite** greift der fehlende SPA-PageView daher **nicht**.
- Er erklärt aber Fehl-Attribution bei **internen** Client-Navigationen: Startseite →
  „Jobs" per `<Link>` feuert **keinen** neuen PageView; der Pixel-Seitenkontext bleibt die
  Startseite. Wer so testet (von der Startseite aus klickt), hat als letzten „echten"
  PageView die **Startseite** — das ist die plausibelste Erklärung für die `/`-URL im Test.

### f) Doppelter Pixel-Load?
Im **Repo**: nein — genau ein `fbq('init')` (`app/layout.tsx:106`). **Aber:** der
GTM-Container `GTM-KGB529BZ` wird serverseitig in GTM verwaltet und könnte dort zusätzlich
einen Meta-Pixel/PageView ausspielen — **im Code nicht prüfbar**, bitte im GTM-Workspace
gegenchecken (Risiko Doppelzählung).

---

## 2. dataLayer / GTM

### a) Alle `dataLayer.push(…)`
Helper `dl()` in `BewerbungFormular.tsx:40-45`.

| Event | Payload | Datei:Zeile | Auslöser |
|---|---|---|---|
| `bewerbung_step_1` | `{ stelle }` | `BewerbungFormular.tsx:66` | Mount Schritt 1 |
| `bewerbung_step_2` | `{ stelle }` | `BewerbungFormular.tsx:89` | `gehe(2)` |
| `bewerbung_step_3` | `{ stelle }` | `BewerbungFormular.tsx:90` | `gehe(3)` |
| `bewerbung_success` | `{ stelle }` | `BewerbungFormular.tsx:140` | nach erfolgreichem POST, **vor** Redirect |
| `bewerbung_danke` | `{ stelle }` | `DankeTracking.tsx:15` | `useEffect` auf `/jobs/danke` |

(`app/layout.tsx:62-66, 83-84` = GTM-/gtag-Bootstrap, keine Business-Events.)

### b) Payload bei `bewerbung_danke`
Exakt `{ event: "bewerbung_danke", stelle }` — `stelle` = `"azubi" | "friseur" | "unbekannt"`.
**KEIN** `content_name`, **keine** IDs, **keine** UTM-Werte im dataLayer. (`content_name`
existiert nur in den `fbq`-Parametern, nicht im dataLayer.)

### c) GTM-Load
`app/layout.tsx:56-69` (`id="gtm-head"`, `strategy="beforeInteractive"`,
`data-cookieconsent="marketing"`), noscript `:116-124`. Nur `NODE_ENV === "production"`.
Container `GTM-KGB529BZ`. Consent: Marketing (Cookiebot).

---

## 3. Consent

### a) Cookiebot-Gating
`app/layout.tsx:46-53` — `uc.js`, `data-cbid="7e6107a2-…"`, `data-blockingmode="auto"`,
`strategy="beforeInteractive"`. Alle Marketing-Tags (GTM, gtag/Ads, Pixel, HubSpot) tragen
`data-cookieconsent="marketing"`. **Kein** eigener `CookiebotOnAccept`/`CookieConsent`-Listener
im Code → Nachladen bei spät erteiltem Consent übernimmt allein Cookiebots Auto-Blocking;
es gibt **kein** Custom-Re-Fire von Events.

### b) Überlebt Consent den Wechsel auf `/jobs/danke`?
**Ja** (Cookiebot-Cookie, domainweit; der Full-Reload liest ihn erneut). **Aber Timing-Risiko:**
`DankeTracking` feuert sein Event **einmalig** beim Mount. Ist `fbq` dann noch nicht entsperrt
(Cookiebot-/`afterInteractive`-Timing), greift die Guard `if (typeof w.fbq === "function")`
(`DankeTracking.tsx:16`) und das Event wird **still verworfen** und **nicht** nachgeholt →
mögliche verlorene/verspätete Conversions.

### c) In-App-Browser (Instagram/Facebook)?
**Keine** Sonderbehandlung (kein `FBAN`/`FBAV`/`Instagram`/UA-Sniffing im Code). In-App-Nutzer,
die Consent ablehnen oder das Banner nicht sehen, feuern **keinen** Pixel → Untererfassung
(gerade bei Meta-Traffic relevant).

---

## 4. Attribution

### a) Erfassung & Speicherung
`BewerbungFormular.tsx:22` `ATTR_KEYS = [utm_source, utm_medium, utm_campaign, utm_content,
fbclid, gclid]`. Speicher: **sessionStorage**, Key `"db_jobs_attribution"` (`:23`).
First-Touch beim Mount gesichert (`:65-78`, nur gesetzt, wenn Key noch leer). **Lebensdauer:
Session/Tab** — übersteht keinen neuen Tab / Browser-Neustart. Beim Absenden werden die Werte
vor dem Redirect gelesen (`leseAttribution()`, `:116`) und mit dem POST gesendet.

### b) Was landet in `POST /api/bewerbung` + Salon-Mail?
POST-Body (`BewerbungFormular.tsx:120-132`): `stelle, vorname, nachname, telefon, email,
kontaktwunsch, datenschutz, honeypot, antworten, quelle_seite` (= `location.pathname`) + alle
ATTR_KEYS. Schema nimmt sie an (`lib/jobs.ts:172-178`). **Salon-Mail** (`app/api/bewerbung/route.ts:96-98`):
Feld „quelle" = `quelle_seite · utm_source/medium/campaign(/content) · fbclid: ja|nein`.
NB: **`gclid` wird gespeichert & gesendet, aber im Mail-Text nicht ausgegeben**; `fbclid` nur
als „ja/nein".

### c) `_fbp` / `_fbc`?
**Nicht** ausgelesen und **nicht** ans Backend übergeben (grep leer). Erfasst wird nur `fbclid`
(URL-Param). Für eine spätere **Conversions API** fehlen damit `_fbp`/`_fbc` **und** eine
konsistente, server-geteilte `eventID`.

---

## 5. Danke-Seite

### a) Wie gelangt man hin?
`BewerbungFormular.tsx:141`:
```ts
dl("bewerbung_success", { stelle })
window.location.assign(`/jobs/danke?stelle=${stelle}`)   // FULL-RELOAD, Query ?stelle=
```

### b) Herkunft von `content_name`
`app/jobs/danke/page.tsx:19-20` liest `searchParams.stelle`, validiert mit `istStelle` →
`bekannt = 'azubi' | 'friseur' | ''`; `:56` `<DankeTracking stelle={bekannt || "unbekannt"} />`.
`DankeTracking` setzt diesen Wert als `content_name` (`DankeTracking.tsx:17`).

### c) Exakte `content_name`-Werte
`"azubi"` oder `"friseur"` (`lib/jobs.ts:16, 37-38`); Fallback `"unbekannt"`, wenn `?stelle`
fehlt/ungültig. **Nicht** die Labels („Ausbildung Friseur/in (m/w/d)" etc.).

---

## 6. Fazit & Fix-Vorschläge (noch NICHT umgesetzt)

### Wahrscheinlichste Ursache „Lead" (hohe Sicherheit)
**PR #10 (`Lead → SubmitApplication`, Commit `a91f4ba`) ist nicht in `main`/Produktion
gemergt.** Produktion feuert `DankeTracking.tsx:17` → `fbq('track','Lead')`. Fix ist korrekt
geschrieben, nur nicht live.

### Wahrscheinlichste Ursache falsche URL (`/` statt `/jobs/danke`) (mittlere Sicherheit)
Der Danke-Redirect ist ein **Full-Reload**, daher *sollte* das Event `/jobs/danke` tragen.
Der fehlende SPA-PageView erklärt die Danke-URL **nicht** direkt (nur relevant, wenn der
Redirect client-seitig wäre — ist er nicht). Am plausibelsten:
1. **Test-Artefakt:** intern von der Startseite geklickt → letzter echter Pixel-PageView =
   Startseite (§1e). In der realen Anzeige (direkter Full-Load auf `/jobs/friseur-krefeld`)
   tritt das nicht auf.
2. **Consent-Timing:** `fbq` auf der frischen Danke-Seite noch nicht entsperrt → Event
   verworfen/verspätet (§3b).
3. **Evtl. zweiter Pixel/PageView über den GTM-Container** (nicht im Repo sichtbar, §1f).

### Fix-Vorschläge, priorisiert
| Prio | Maßnahme |
|---|---|
| **P1** | **PR #10 mergen & deployen** (Lead→SubmitApplication + eventID). |
| **P1** | **Sauber re-testen** in Meta *Test Events*: direkt die Anzeigen-URL `/jobs/friseur-krefeld` laden (nicht intern klicken), Consent **vor** dem Absenden erteilen, dann auf `/jobs/danke` prüfen. |
| **P2** | **SPA-PageView**: Route-Change-Listener (`usePathname`/`useSearchParams`), der bei Client-Navigation `fbq('track','PageView')` feuert; optional explizit `eventSourceUrl: location.href` mitgeben → korrekte URL-Attribution. |
| **P2** | **Consent-Timing absichern**: Danke-Event bei `CookiebotOnAccept`/`fbq`-ready **nachfeuern**, statt es bei fehlendem `fbq` still zu verwerfen (sonst verlorene Conversions, v. a. In-App). |
| **P2** | **Conversion in den Werbekonten einrichten**: Google-Ads-Conversion (GTM-Trigger auf `bewerbung_danke`/`SubmitApplication`) + Meta `SubmitApplication` als Conversion verifizieren. |
| **P3** | **CAPI vorbereiten**: `_fbp`/`_fbc` clientseitig auslesen + **dieselbe** `eventID` an `/api/bewerbung` durchreichen (Dedup Pixel↔Server); Bewerbungs-ID vom Backend bis zur Danke-Seite tragen. |
| **P3** | **Doppel-Pixel/GTM prüfen**: im GTM-Container kontrollieren, ob dort zusätzlich ein Meta-Pixel/PageView läuft. |
| **P3** | **Preview-Tracking eingrenzen**: Tags zusätzlich auf Host `www.diebianco.de` beschränken (Kommentar `layout.tsx:42` ist irreführend; `NODE_ENV==="production"` greift auch auf Preview-Deploys) → verhindert, dass Test-Bewerbungen Conversions verfälschen. |

---

*Erstellt als reiner Lesebericht. Keine Code-Dateien außer diesem Bericht angelegt/geändert.*
