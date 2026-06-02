import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Grey Blending Friseur Krefeld | DIE BIANCO Salon",
  description:
    "Grey Blending Spezialist in Krefeld-Egelsberg. Natuerliche Uebergaenge, individuell auf deinen Typ abgestimmt. Jetzt Beratungstermin anfragen bei DIE BIANCO.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function GreyBlendingLandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <Script
        id="hs-script-loader"
        src="//js-eu1.hs-scripts.com/146440145.js"
        strategy="afterInteractive"
        data-cookieconsent="marketing"
      />
    </>
  )
}
