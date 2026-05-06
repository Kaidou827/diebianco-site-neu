import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import "../globals.css"

export const metadata: Metadata = {
  title: "DIE BIANCO MENTORING - Premium Salon Mentoring",
  description: "Dein Mentoring für höhere Preise und nachhaltigen Erfolg in der Beauty-Branche",
  generator: "v0.dev",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body>
        {/* Cookiebot Cookie Banner - Must load first */}
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="7e6107a2-00b0-4c25-8ffd-482c67cefdad"
          data-blockingmode="auto"
          type="text/javascript"
          strategy="beforeInteractive"
        />

        {/* Cookie Declaration Script */}
        

        {children}


        {/* HubSpot Tracking Code - Will be blocked by Cookiebot until consent */}
        <Script
          id="hs-script-loader"
          src="//js-eu1.hs-scripts.com/146440145.js"
          strategy="afterInteractive"
          data-cookieconsent="marketing"
        />

        {/* Google Analytics - Will be blocked by Cookiebot until consent */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QCX1VZEM0H"
          strategy="afterInteractive"
          data-cookieconsent="statistics"
        />
        <Script id="google-analytics" strategy="afterInteractive" data-cookieconsent="statistics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QCX1VZEM0H');
          `}
        </Script>
      </body>
    </html>
  )
}
