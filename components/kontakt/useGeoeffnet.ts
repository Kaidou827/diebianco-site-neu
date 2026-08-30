"use client"

import { useEffect, useState } from "react"
import { istGeoeffnet } from "@/lib/site-info"

/**
 * Öffnungs-Status (Europe/Berlin), clientseitig ermittelt.
 * Rückgabe: null = noch nicht bekannt (vor Mount / SSR), true/false danach.
 * Aktualisiert sich jede Minute, damit der Status über die Öffnungsgrenze kippt.
 */
export function useGeoeffnet(): boolean | null {
  const [offen, setOffen] = useState<boolean | null>(null)
  useEffect(() => {
    setOffen(istGeoeffnet())
    const id = setInterval(() => setOffen(istGeoeffnet()), 60_000)
    return () => clearInterval(id)
  }, [])
  return offen
}
