"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"

export default function BlogNavigation() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="border-b border-[#2C2C2C]/10 bg-[rgba(44,44,44,1)] sticky top-0 z-50 py-2">
        <div className="flex items-center justify-between mx-6 md:mx-14">
          
          {/* Logo */}
          <div className="flex items-center h-16 md:h-20">
            <Link href="/" aria-label="DIE BIANCO - Zur Startseite">
              <Image
                src="/element-2.png"
                alt="DIE BIANCO"
                width={220}
                height={80}
                className="h-[74px] w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center text-sm text-center space-x-6 mx-auto">
            <Link href="/Blog" className="text-white hover:text-[#d4c6a6] transition-colors">
              Home
            </Link>
            <Link href="/Blog/articles" className="text-white hover:text-[#d4c6a6] transition-colors">
              Artikeln
            </Link>
            <Link href="/ueber-uns" className="text-white hover:text-[#d4c6a6] transition-colors">
              Über Uns
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menü öffnen"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[rgba(44,44,44,1)] border-t border-white/10">
          <nav className="flex flex-col px-6 py-4 space-y-2 text-sm">
            <Link
              href="/Blog"
              onClick={() => setMenuOpen(false)}
              className="py-3 px-3 rounded-lg text-white hover:bg-white/10 transition"
            >
              Home
            </Link>
            <Link
              href="/Blog/articles"
              onClick={() => setMenuOpen(false)}
              className="py-3 px-3 rounded-lg text-white hover:bg-white/10 transition"
            >
              Artikeln
            </Link>
            <Link
              href="/ueber-uns"
              onClick={() => setMenuOpen(false)}
              className="py-3 px-3 rounded-lg text-white hover:bg-white/10 transition"
            >
              Über Uns
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
