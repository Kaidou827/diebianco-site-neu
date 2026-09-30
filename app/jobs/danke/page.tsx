import type { Metadata } from "next"
import Link from "next/link"
import Navigation from "@/components/Navigation"
import SiteFooter from "@/components/SiteFooter"
import DankeTracking from "@/components/jobs/DankeTracking"
import { istStelle } from "@/lib/jobs"
import { waBewerbungLink } from "@/lib/whatsapp"

export const metadata: Metadata = {
  title: "Danke für deine Bewerbung – DIE BIANCO",
  robots: { index: false, follow: false },
}

export default async function JobsDankePage({
  searchParams,
}: {
  searchParams: Promise<{ stelle?: string }>
}) {
  const { stelle } = await searchParams
  const bekannt = stelle && istStelle(stelle) ? stelle : ""
  const waLink = waBewerbungLink(bekannt || "friseur")

  return (
    <>
      <Navigation />
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F5F1E8] px-4 py-16 pt-28 text-[#2C2C2C]">
        <section className="w-full max-w-xl rounded-2xl border border-[#E4DCC9] bg-white p-8 text-center md:p-12">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#B8863D] text-2xl text-white">
            ✓
          </div>
          <h1 className="font-serif text-3xl md:text-4xl">Danke, deine Bewerbung ist da!</h1>
          <p className="mt-4 text-[#3a3a3a]">
            Teresa schaut sich deine Angaben persönlich an und meldet sich innerhalb von 2 Werktagen bei dir. Du willst
            schon mal mehr zeigen? Schick Fotos deiner Arbeiten oder deinen Lebenslauf per WhatsApp oder an{" "}
            <a href="mailto:businessdiebianco@gmail.com" className="text-[#B8863D] underline underline-offset-2">
              businessdiebianco@gmail.com
            </a>
            .
          </p>
          <div className="mt-7 flex flex-col items-center gap-3">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-7 py-3.5 text-base font-bold text-white shadow-lg"
            >
              Fotos/Lebenslauf per WhatsApp schicken
            </a>
            <Link href="/" className="text-sm font-semibold text-[#B8863D] underline underline-offset-4">
              Zurück zur Startseite
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
      <DankeTracking stelle={bekannt || "unbekannt"} />
    </>
  )
}
