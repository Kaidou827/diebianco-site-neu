import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Navigation from "@/components/Navigation"
import SiteFooter from "@/components/SiteFooter"
import { OG_IMG } from "@/lib/jobs-content"

const SITE = process.env.SITE_URL || "https://www.diebianco.de"

export const metadata: Metadata = {
  title: "Jobs bei DIE BIANCO – Friseur/in & Ausbildung in Krefeld (m/w/d)",
  description:
    "Wir suchen Verstärkung für unser Friseurteam in Krefeld – Auszubildende und erfahrene Friseur/innen mit Herz für Farbe. Bewirb dich in 2 Minuten, ohne Lebenslauf.",
  alternates: { canonical: `${SITE}/jobs` },
  openGraph: {
    title: "Jobs bei DIE BIANCO – Krefeld",
    description: "Ausbildung & Friseur/in (m/w/d) mit Schwerpunkt Farbe. Bewirb dich in 2 Minuten.",
    images: [`${SITE}${OG_IMG}`],
    type: "website",
    locale: "de_DE",
  },
}

const KARTEN = [
  {
    href: "/jobs/ausbildung-friseur-krefeld",
    titel: "Ausbildung Friseur/in (m/w/d)",
    text: "Du hast Lust auf den Beruf und willst richtig gut werden? Wir fördern dich aktiv – mit Schulungen von Anfang an.",
  },
  {
    href: "/jobs/friseur-krefeld",
    titel: "Friseur/in (m/w/d) – Gesell/in oder Meister/in",
    text: "Dein Fokus ist Farbe: Balayage, Strähnentechniken, Keratin. Die Schnitte übernimmt Teresa selbst.",
  },
]

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ stelle?: string }>
}) {
  const { stelle } = await searchParams
  if (stelle === "azubi") redirect("/jobs/ausbildung-friseur-krefeld")
  if (stelle === "friseur") redirect("/jobs/friseur-krefeld")

  return (
    <>
      <Navigation />
      <main className="bg-white text-[#2C2C2C]">
        <section className="bg-[#2C2C2C] px-4 pb-12 pt-28 text-white">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-serif text-3xl md:text-4xl">Werde Teil von DIE BIANCO</h1>
            <p className="mt-4 text-white/85">
              Wir suchen Verstärkung für unser Friseurteam in Krefeld – Auszubildende und erfahrene Friseur/innen mit Herz
              für Farbe. Pünktlich, professionell, gut bezahlt.
            </p>
          </div>
        </section>

        <section className="px-4 py-12">
          <div className="mx-auto grid max-w-3xl gap-5 md:grid-cols-2">
            {KARTEN.map((k) => (
              <div key={k.href} className="flex flex-col rounded-2xl border border-[#E4DCC9] bg-[#F5F1E8] p-6">
                <h2 className="font-serif text-xl">{k.titel}</h2>
                <p className="mt-3 flex-1 text-[#3a3a3a]">{k.text}</p>
                <Link
                  href={k.href}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#C6A15B] to-[#B8863D] px-6 py-3 text-sm font-bold text-white"
                >
                  Zur Stelle <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
