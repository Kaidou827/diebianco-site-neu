'use client'

import type React from "react"
import Image from "next/image"

const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetId: string) => {
  e.preventDefault()
  const elem = document.getElementById(targetId)
  elem?.scrollIntoView({
    behavior: "smooth",
  })
}

const MentoringNavigation: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#2C2C2C] backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4 md:px-6 h-24 flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="/biancocoaching.png"
            alt="DIE BIANCO MENTORING"
            width={260}
            height={90}
            className="h-16 w-auto object-contain"
          />
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#warum-mentoring" onClick={(e) => handleScroll(e, 'warum-mentoring')} className="text-sm text-white/80 hover:text-white transition-colors">Warum Mentoring?</a>
          <a href="#philosophie" onClick={(e) => handleScroll(e, 'philosophie')} className="text-sm text-white/80 hover:text-white transition-colors">Philosophie</a>
          <a href="#ablauf" onClick={(e) => handleScroll(e, 'ablauf')} className="text-sm text-white/80 hover:text-white transition-colors">Ablauf</a>
          <a href="#ueber-mich" onClick={(e) => handleScroll(e, 'ueber-mich')} className="text-sm text-white/80 hover:text-white transition-colors">Über Mich</a>
        </nav>
        <a 
          href="#kontakt"
          onClick={(e) => handleScroll(e, 'kontakt')}
          className="hidden md:inline-flex items-center justify-center px-5 py-2 bg-white text-[#2C2C2C] font-medium rounded-full hover:bg-white/90 transition-colors duration-300"
        >
          Kontakt
        </a>
      </div>
    </header>
  )
}

export default MentoringNavigation
