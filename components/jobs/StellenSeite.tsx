import Image from "next/image"
import Link from "next/link"
import { Check } from "lucide-react"
import Navigation from "@/components/Navigation"
import SiteFooter from "@/components/SiteFooter"
import BewerbungFormular from "@/components/BewerbungFormular"
import JobsStickyBar from "@/components/jobs/JobsStickyBar"
import JobPostingJsonLd from "@/components/jobs/JobPostingJsonLd"
import { STELLE_LABEL, STELLE_SLUG, type Stelle } from "@/lib/jobs"
import { STELLEN_INHALT, UEBER_TEXT, HERO_IMG, UEBER_IMG } from "@/lib/jobs-content"
import { waBewerbungLink } from "@/lib/whatsapp"

const SITE = process.env.SITE_URL || "https://www.diebianco.de"

function gehaltAnzeige(stelle: Stelle): string {
  const raw = stelle === "azubi" ? process.env.JOBS_GEHALT_AZUBI_JAHR1 : process.env.JOBS_GEHALT_FRISEUR_MIN
  return raw ? ` (${raw})` : ""
}

function baseSalary(stelle: Stelle): { value: number; unitText: "MONTH" | "YEAR" } | undefined {
  const raw = stelle === "azubi" ? process.env.JOBS_GEHALT_AZUBI_JAHR1 : process.env.JOBS_GEHALT_FRISEUR_MIN
  if (!raw) return undefined
  const v = Number(String(raw).replace(/[^\d]/g, ""))
  return v > 0 ? { value: v, unitText: "MONTH" } : undefined
}

export default function StellenSeite({ stelle }: { stelle: Stelle }) {
  const inhalt = STELLEN_INHALT[stelle]
  const erwartet = inhalt.erwartet.map((l) => l.replace(" [GEHALT]", gehaltAnzeige(stelle)))
  const waLink = waBewerbungLink(stelle)
  const url = `${SITE}/jobs/${STELLE_SLUG[stelle]}`

  const schritte = [
    "Formular ausfüllen – dauert wirklich nur 2 Minuten, kein Lebenslauf nötig.",
    "Teresa meldet sich persönlich per WhatsApp oder Telefon – innerhalb von 2 Werktagen.",
    stelle === "azubi"
      ? "Kennenlernen im Salon – gern auch mit einem Probetag, damit du siehst, wie wir arbeiten."
      : "Kennenlernen im Salon – wir schauen gemeinsam, ob es menschlich und fachlich passt.",
  ]

  return (
    <>
      <JobPostingJsonLd
        title={STELLE_LABEL[stelle]}
        description={inhalt.description}
        employmentType={inhalt.employmentType}
        baseSalary={baseSalary(stelle)}
        url={url}
      />
      <Navigation />

      <main className="bg-white text-[#2C2C2C]">
        {/* 1) HERO */}
        <section className="relative min-h-[62vh] w-full">
          <Image src={HERO_IMG} alt="DIE BIANCO – Friseursalon in Krefeld" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/25" />
          <div className="relative z-10 mx-auto flex min-h-[62vh] max-w-2xl flex-col justify-end px-5 pb-8 pt-24 text-white">
            <div className="mb-3 flex flex-wrap gap-2">
              {inhalt.badges.map((b) => (
                <span key={b} className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                  {b}
                </span>
              ))}
            </div>
            <h1 className="font-serif text-3xl leading-tight md:text-4xl">{inhalt.h1}</h1>
            <p className="mt-3 max-w-xl text-white/90">{inhalt.subline}</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#bewerben"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#C6A15B] to-[#B8863D] px-6 py-4 text-base font-bold text-white shadow-xl"
              >
                Jetzt bewerben – 2 Minuten
              </a>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-center text-sm font-semibold text-white/90 underline underline-offset-4">
                Lieber per WhatsApp bewerben
              </a>
            </div>
          </div>
        </section>

        {/* 2) FORMULAR */}
        <section className="bg-[#F5F1E8] px-4 py-10">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-5 text-center font-serif text-2xl">In 2 Minuten bewerben</h2>
            <BewerbungFormular stelle={stelle} />
          </div>
        </section>

        {/* 3) DAS ERWARTET DICH */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-6 font-serif text-2xl md:text-3xl">Das erwartet dich</h2>
            <ul className="space-y-4">
              {erwartet.map((t) => (
                <li key={t} className="flex gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#B8863D]" aria-hidden="true" />
                  <span className="text-[#3a3a3a]">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4) DAS BRINGST DU MIT */}
        <section className="bg-[#F5F1E8] px-4 py-12">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-6 font-serif text-2xl md:text-3xl">Das bringst du mit</h2>
            <ul className="space-y-4">
              {inhalt.bringst.map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#B8863D]" aria-hidden="true" />
                  <span className="text-[#3a3a3a]">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 5) ÜBER DIE BIANCO */}
        <section className="px-4 py-12">
          <div className="mx-auto grid max-w-2xl gap-6 md:grid-cols-[160px_1fr] md:items-center">
            <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full md:mx-0">
              <Image src={UEBER_IMG} alt="Teresa Bianco" fill sizes="160px" className="object-cover" />
            </div>
            <div>
              <h2 className="mb-3 font-serif text-2xl md:text-3xl">Über DIE BIANCO</h2>
              <p className="text-[#3a3a3a]">{UEBER_TEXT}</p>
            </div>
          </div>
        </section>

        {/* 6) SO LÄUFT DEINE BEWERBUNG */}
        <section className="bg-[#F5F1E8] px-4 py-12">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-6 font-serif text-2xl md:text-3xl">So läuft deine Bewerbung</h2>
            <ol className="space-y-5">
              {schritte.map((t, i) => (
                <li key={t} className="flex gap-4">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#B8863D] font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-[#3a3a3a]">{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 7) ZWEITER CTA */}
        <section className="px-4 py-12 text-center">
          <div className="mx-auto max-w-xl">
            <h2 className="mb-3 font-serif text-2xl md:text-3xl">Klingt nach dir?</h2>
            <p className="mb-6 text-[#3a3a3a]">{inhalt.cta}</p>
            <div className="flex flex-col items-center gap-3">
              <a
                href="#bewerben"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#C6A15B] to-[#B8863D] px-8 py-4 text-base font-bold text-white shadow-xl"
              >
                Jetzt bewerben
              </a>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#B8863D] underline underline-offset-4">
                Oder direkt per WhatsApp schreiben
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <JobsStickyBar />
      {/* Platz für die Sticky-Bar auf Mobile */}
      <div className="h-20 md:hidden" aria-hidden="true" />
    </>
  )
}
