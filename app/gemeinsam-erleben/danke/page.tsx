import Link from "next/link"

export default function GemeinsamErlebenDankePage() {
  return (
    <main className="min-h-screen bg-[#b4b1aa] text-white flex items-center justify-center px-4">
      <section className="w-full max-w-2xl bg-black/20 backdrop-blur-sm border border-white/10 rounded-md p-8 md:p-12 text-center">
        <h1 className="font-serif text-3xl md:text-4xl mb-4">
          Danke fuer deine <span className="text-[#D4C6A6]">Empfehlung</span>
        </h1>
        <p className="text-white/80 mb-8">
          Wir haben deine Angaben erhalten und kuemmern uns um die weitere Kontaktaufnahme.
        </p>
        <Link
          href="/gemeinsam-erleben"
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#D4C6A6] to-[#B8A082] rounded-full hover:from-[#B8A082] hover:to-[#D4C6A6] transition-all duration-300"
        >
          Zurueck zur Aktion
        </Link>
      </section>
    </main>
  )
}
