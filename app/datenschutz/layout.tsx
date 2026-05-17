import type React from "react"
import Navigation from "@/components/Navigation"
import SiteFooter from "@/components/SiteFooter"

export default function DatenschutzLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation />
      {children}
      <SiteFooter />
    </>
  )
}
