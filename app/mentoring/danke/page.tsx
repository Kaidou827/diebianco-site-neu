import Link from "next/link"

export default function MentoringDankePage() {
  return (
    <main className="min-h-screen bg-[rgba(44,44,44,1)] text-white flex items-center justify-center px-4">
      <section className="w-full max-w-2xl bg-black/20 backdrop-blur-sm border border-white/10 rounded-md p-8 md:p-12 text-center">
        <h1 className="text-3xl md:text-4xl mb-4">
          Danke fuer deine <span className="text-[#D4C6A6]">Anfrage</span>
        </h1>
        <p className="text-white/80 mb-8">
          Wir melden uns schnellstmoeglich bei dir, um die naechsten Schritte fuer dein Mentoring zu besprechen.
        </p>
        <Link
          href="/mentoring"
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] transition-all duration-300"
        >
          Zurueck zum Mentoring
        </Link>
      </section>
    </main>
  )
}
