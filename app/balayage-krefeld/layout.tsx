import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Balayage Friseur Krefeld | DIE BIANCO Salon",
  description:
    "Balayage und Babylights in Krefeld-Egelsberg: weiche, handgemalte Blondverläufe, abgestimmt auf deinen Hautton. Teresa berät dich persönlich. Jetzt unverbindlich anfragen.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function BalayageLandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
