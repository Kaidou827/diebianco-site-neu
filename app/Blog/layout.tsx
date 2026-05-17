
import type React from "react"
import Navigation from "@/components/Navigation"

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[rgba(180,177,170,1)] text-white">
      <Navigation />
      <main className="min-h-screen bg-[rgba(180,177,170,1)] text-white">{children}</main>
    </div>
  )
}
