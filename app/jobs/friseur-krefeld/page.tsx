import type { Metadata } from "next"
import StellenSeite from "@/components/jobs/StellenSeite"
import { STELLEN_INHALT, OG_IMG } from "@/lib/jobs-content"

const SITE = process.env.SITE_URL || "https://www.diebianco.de"
const inhalt = STELLEN_INHALT.friseur

export const metadata: Metadata = {
  title: inhalt.title,
  description: inhalt.description,
  alternates: { canonical: `${SITE}/jobs/friseur-krefeld` },
  openGraph: {
    title: inhalt.title,
    description: inhalt.description,
    images: [`${SITE}${OG_IMG}`],
    type: "website",
    locale: "de_DE",
  },
}

export default function Page() {
  return <StellenSeite stelle="friseur" />
}
