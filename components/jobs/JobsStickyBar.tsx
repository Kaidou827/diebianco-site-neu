"use client"

import { useEffect, useState } from "react"

/**
 * Mobile Sticky-Bar „Jetzt bewerben" – scrollt zu #bewerben und blendet sich
 * aus, sobald das Formular im Viewport ist. Nur auf Mobile (md:hidden).
 */
export default function JobsStickyBar() {
  const [zeigen, setZeigen] = useState(false)

  useEffect(() => {
    const form = document.getElementById("bewerben")
    if (!form) {
      setZeigen(true)
      return
    }
    const io = new IntersectionObserver(([e]) => setZeigen(!e.isIntersecting), { threshold: 0.12 })
    io.observe(form)
    return () => io.disconnect()
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[70] md:hidden transition-transform duration-300 ${
        zeigen ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto max-w-xl p-3">
        <a
          href="#bewerben"
          className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#C6A15B] to-[#B8863D] px-6 py-4 text-base font-bold text-white shadow-xl"
        >
          Jetzt bewerben
        </a>
      </div>
    </div>
  )
}
