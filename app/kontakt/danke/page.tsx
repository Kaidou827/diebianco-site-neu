import Link from "next/link"
import SiteFooter from "@/components/SiteFooter"

export default async function KontaktDankePage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string }>
}) {
  const params = await searchParams
  const cleanName = params.name?.trim()
  const headingText = cleanName && cleanName.length > 0 ? `Danke ${cleanName}` : "Danke"

  return (
    <>
      <main className="min-h-screen bg-[#b4b1aa] text-white flex items-center justify-center px-4">
        <section className="w-full max-w-2xl bg-black/20 backdrop-blur-sm border border-white/10 rounded-md p-8 md:p-12 text-center">
          <h1 className="font-serif text-3xl md:text-4xl mb-4">
            {headingText} <span className="text-[#D4C6A6]">- Anfrage erhalten</span>
          </h1>
          <p className="text-white/80 mb-8">
            Teresa meldet sich innerhalb von 24 Stunden persönlich bei dir.
          </p>
          <p className="text-white/80 mb-8">
            Rückfragen? Ruf uns direkt an:{" "}
            <a href="tel:+491743091973" className="text-[#D4C6A6] hover:text-white transition-colors">
              +49 174 3091973
            </a>
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] transition-all duration-300"
          >
            Zur Startseite
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
