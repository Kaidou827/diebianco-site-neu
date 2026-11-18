import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import GlobalFloatingCtas from "@/components/GlobalFloatingCtas"
import ExitIntentHint from "@/components/ExitIntentHint"
import KlickTracking from "@/components/KlickTracking"
import AttributionTracker from "@/components/AttributionTracker"
import CookieBanner from "@/components/CookieBanner"
import { CONSENT_VERSION } from "@/lib/consent"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Teresa Bianco: Exklusiver Friseur in Krefeld | Stilberatung & Haarkunst",
  description:
    "Erleben Sie exklusive Haarkunst bei Teresa Bianco in Krefeld. Persönliche Stilberatung, meisterhafte Schnitte und einzigartige Farberlebnisse in unserem Premium-Salon.",
  keywords: "Friseur Krefeld, Stilberatung, Haarschnitt, Farbtypologie, Teresa Bianco, Premium Salon",
  authors: [{ name: "Teresa Bianco" }],
  creator: "Teresa Bianco",
  publisher: "Teresa Bianco Salon",
  robots: "index, follow",
  other: {
    "facebook-domain-verification": "cmnskalp2s9y2gvkie66ty6iznl9mw",
  },
  openGraph: {
    title: "Teresa Bianco: Exklusiver Friseur in Krefeld",
    description:
      "Erleben Sie exklusive Haarkunst bei Teresa Bianco in Krefeld. Persönliche Stilberatung, meisterhafte Schnitte und einzigartige Farberlebnisse.",
    type: "website",
    locale: "de_DE",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className={inter.variable}>
      <head>
        {/* Tracking nur im Production-Build. Consent Mode v2: Default „denied“ VOR allen Tags.
            Eigene Einwilligung (Cookie db_consent, siehe lib/consent.ts) ersetzt Cookiebot:
            liegt schon eine Auswahl vor, wird Consent Mode hier sofort aktualisiert.
            Die Dienste selbst (GTM, Google Ads, Meta-Pixel, HubSpot) lädt erst
            components/CookieBanner.tsx nach Einwilligung (lib/consent-dienste.ts). */}
        {process.env.NODE_ENV === "production" && (
          <Script
            id="consent-default"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                window.__dbTracking = true;
                gtag('consent','default',{
                  ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',
                  analytics_storage:'denied',wait_for_update:500
                });
                try {
                  var m = document.cookie.match(/(?:^|; )db_consent=([^;]*)/);
                  if (m) {
                    var c = JSON.parse(decodeURIComponent(m[1]));
                    if (c && c.version === ${CONSENT_VERSION}) {
                      var g = c.marketing === true ? 'granted' : 'denied';
                      gtag('consent','update',{
                        ad_storage:g,ad_user_data:g,ad_personalization:g,
                        analytics_storage:c.statistik === true ? 'granted' : 'denied'
                      });
                    }
                  }
                } catch (e) {}
              `,
            }}
          />
        )}
      </head>
      <body className={`${inter.className} m-0 p-0 min-h-screen bg-[rgb(180,177,170)] font-sans antialiased`}>
<meta name="google-site-verification" content="t0BF1OoHWoyvYxz3cXtyV0-n227wC3d2Lc9KTcBh6ak" />
        {/* Main Content */}
        {children}
        <GlobalFloatingCtas />
        <ExitIntentHint />
        <KlickTracking />
        <AttributionTracker />

        <CookieBanner />
      </body>
    </html>
  )
}
