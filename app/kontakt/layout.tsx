import type React from "react"
import Script from "next/script"

export default function RootLayout({
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
