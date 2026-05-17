import type React from "react"
import type { Metadata } from "next"
import "../globals.css"
import Navigation from "@/components/Navigation"
import SiteFooter from "@/components/SiteFooter"

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
    <>
      <Navigation />
      {children}
      <SiteFooter />
    </>
  )
}
