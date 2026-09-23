"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ChevronDown, Palette, Scissors, Sparkles, Feather, ShoppingBag, Eye } from "lucide-react"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dropdownContainerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()

  // Function to handle opening the dropdown
  const openDropdown = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsDropdownOpen(true)
  }

  // Function to handle closing the dropdown with delay
  const closeDropdown = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false)
    }, 400) // 800ms delay before closing
  }

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Services data for the dropdown with icons
  const services = [
    { name: "Farbtypologie", href: "/dienstleistungen/farbtypologie", icon: <Palette className="w-5 h-5" /> },
    { name: "Schnitttechniken", href: "/dienstleistungen/schnitttechniken", icon: <Scissors className="w-5 h-5" /> },
    {
      name: "Blond-Spezialisten",
      href: "/dienstleistungen/blond-spezialisten",
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      name: "Grey Blending",
      href: "/dienstleistungen/grey-blending",
      icon: <Sparkles className="w-5 h-5" />,
    },
    { name: "Keratinbehandlung", href: "/dienstleistungen/keratinbehandlung", icon: <Feather className="w-5 h-5" /> },
    { name: "Stilberatung", href: "/dienstleistungen/stilberatung", icon: <ShoppingBag className="w-5 h-5" /> },
    { name: "Hautdiagnostik", href: "/dienstleistungen/hautdiagnostik", icon: <Eye className="w-5 h-5" /> },
  ]

  return (
    <>
      {/* Navigation Bar */}
      <header className="py-4 border-b border-[#2C2C2C]/10 bg-[#2C2C2C] sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center" aria-label="DIE BIANCO - Zur Startseite">
                <Image
                  src="/element-2.png"
                  alt="DIE BIANCO"
                  width={220}
                  height={80}
                  className="h-16 w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="/kontakt"
                className="px-3 py-2 text-sm font-medium transition-colors text-white hover:text-white/80"
              >
                Kontakt
              </Link>
              <Link
                href="/ueber-uns"
                className="px-3 py-2 text-sm font-medium transition-colors text-white hover:text-white/80"
              >
                Über uns
              </Link>
              <Link
                href="/behandlungen-preise"
                className="px-3 py-2 text-sm font-medium transition-colors text-white hover:text-white/80"
              >
                Behandlungen & Preise
              </Link>
              <Link
                href="/gemeinsam-erleben"
                className="px-3 py-2 text-sm font-medium transition-colors text-white hover:text-white/80"
              >
                Empfehlung
              </Link>
              <Link
                href="/Blog"
                className="px-3 py-2 text-sm font-medium transition-colors text-white hover:text-white/80"
              >
                Blog
              </Link>

              {/* Leistungen Dropdown - Desktop */}
              <div
                ref={dropdownContainerRef}
                className="relative"
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
              >
                {/* Dropdown Button */}
                <button
                  className="px-3 py-2 text-sm font-medium transition-colors text-white hover:text-white/80 flex items-center focus:outline-none"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  Leistungen{" "}
                  <ChevronDown
                    className={`ml-1 h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown Menu */}
                <div
                  ref={dropdownRef}
                  className={`absolute left-0 w-64 origin-top-left rounded-md shadow-lg transform transition-all duration-200 ease-in-out ${isDropdownOpen
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}
                  style={{ marginTop: "0.5rem" }}
                >
                  {/* Invisible bridge to prevent gap between button and dropdown */}
                  <div className="h-3 -mt-3 w-full absolute"></div>

                  <div className="py-2 bg-[#2C2C2C] rounded-lg border border-white/10 backdrop-blur-lg overflow-hidden">
                    <div className="px-3 py-2 border-b border-white/10">
                      <div className="text-[#D4C6A6] text-xs font-medium uppercase tracking-wider">
                        Unsere Leistungen
                      </div>
                    </div>
                    <div className="py-2">
                      {services.map((service) => (
                        <Link
                          key={service.href}
                          href={service.href}
                          className="flex items-center px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors group"
                        >
                          <span className="mr-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-[#D4C6A6] group-hover:bg-[#D4C6A6]/20 transition-colors">
                            {service.icon}
                          </span>
                          <span className="group-hover:text-[#D4C6A6] transition-colors">{service.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-px h-6 bg-white/20 mx-2"></div>
              <Link
                href="/kontakt"
                className="ml-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4C6A6]/50 focus:ring-offset-2 shadow-lg"
              >
                Jetzt Termin vereinbaren
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Menü schließen" : "Menü öffnen"}
            >
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Completely Redesigned Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#2C2C2C]/95 fixed inset-0 z-40 flex flex-col overflow-y-auto backdrop-blur-sm">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <Image
                src="/element-2.png"
                alt="DIE BIANCO SALON"
                width={180}
                height={60}
                className="h-8 w-auto object-contain"
              />
              <button
                className="flex items-center justify-center w-10 h-10 text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Links */}
            <nav className="flex flex-col p-4">
              <Link
                href="/"
                className="flex items-center h-14 px-4 text-white hover:bg-white/10 rounded-lg mb-1 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg">Home</span>
              </Link>
              <Link
                href="/kontakt"
                className="flex items-center h-14 px-4 text-white hover:bg-white/10 rounded-lg mb-1 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg">Kontakt</span>
              </Link>
              <Link
                href="/ueber-uns"
                className="flex items-center h-14 px-4 text-white hover:bg-white/10 rounded-lg mb-1 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg">Über uns</span>
              </Link>
              <Link
                href="/behandlungen-preise"
                className="flex items-center h-14 px-4 text-white hover:bg-white/10 rounded-lg mb-1 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg">Behandlungen & Preise</span>
              </Link>
              <Link
                href="/gemeinsam-erleben"
                className="flex items-center h-14 px-4 text-white hover:bg-white/10 rounded-lg mb-1 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg">Empfehlung</span>
              </Link>
              <Link
                href="/Blog"
                className="flex items-center h-14 px-4 text-white hover:bg-white/10 rounded-lg mb-1 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg">Blog</span>
              </Link>

              {/* Leistungen Accordion */}
              <div className="mb-1">
                <button
                  className="flex items-center justify-between w-full h-14 px-4 text-white hover:bg-white/10 rounded-lg transition-colors"
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                >
                  <span className="text-lg">Leistungen</span>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Services List */}
                {isServicesOpen && (
                  <div className="mt-1 pl-4">
                    {services.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        className="flex items-center h-14 px-4 text-white hover:bg-white/10 rounded-lg mb-1 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="w-10 h-10 flex items-center justify-center rounded-full bg-[#D4C6A6]/20 text-[#D4C6A6] mr-3">
                          {service.icon}
                        </span>
                        <span className="text-base">{service.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Call to Action Button */}
              <Link
                href="/kontakt"
                className="flex items-center justify-center h-14 mt-4 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4C6A6]/50 focus:ring-offset-2 shadow-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="relative z-10 text-base font-medium">Jetzt Termin vereinbaren</span>
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
