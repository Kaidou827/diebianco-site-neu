import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Impressum - Die Bianco",
  description: "Rechtliche Angaben zum Friseursalon Die Bianco gemäß § 5 TMG.",
}

export default function ImpressumLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
