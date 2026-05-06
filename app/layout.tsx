import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
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
        {/* Only load tracking scripts on production domains, not on preview domains */}
        {process.env.NODE_ENV === "production" && (
          <>
            {/* Cookiebot - DSGVO-konformer Cookie Consent - MUSS ZUERST GELADEN WERDEN */}
            <Script
              id="Cookiebot"
              src="https://consent.cookiebot.com/uc.js"
              data-cbid="7e6107a2-00b0-4c25-8ffd-482c67cefdad"
              data-blockingmode="auto"
              type="text/javascript"
              strategy="beforeInteractive"
            />

            {/* Google Tag Manager - blockiert durch Cookiebot bis Marketing-Zustimmung */}
            <Script
              id="gtm-head"
              strategy="beforeInteractive"
              data-cookieconsent="marketing"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','GTM-KGB529BZ');
                `,
              }}
            />

            {/* Google Tag (gtag.js) - blockiert durch Cookiebot bis Marketing-Zustimmung */}
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=AW-17270753092"
              strategy="afterInteractive"
              data-cookieconsent="marketing"
            />
            <Script
              id="gtag-config"
              strategy="afterInteractive"
              data-cookieconsent="marketing"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'AW-17270753092');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={`${inter.className} m-0 p-0 min-h-screen bg-[rgb(180,177,170)] font-sans antialiased`}>
        {/* Google Tag Manager (noscript) - Only in production */}
        {process.env.NODE_ENV === "production" && (
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-KGB529BZ"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {/* End Google Tag Manager (noscript) */}
<meta name="google-site-verification" content="t0BF1OoHWoyvYxz3cXtyV0-n227wC3d2Lc9KTcBh6ak" />
        {/* Main Content */}
        {children}

        {/* HubSpot Tracking - blockiert durch Cookiebot bis Marketing-Zustimmung - Only in production */}
        {process.env.NODE_ENV === "production" && (
          <Script
            id="hs-script-loader"
            src="//js-eu1.hs-scripts.com/146440145.js"
            strategy="afterInteractive"
            data-cookieconsent="marketing"
            async
            defer
          />
        )}
      </body>
    </html>
  )
}
