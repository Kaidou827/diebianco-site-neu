import AnfrageFormular from "@/components/AnfrageFormular"
import AnrufCta from "@/components/kontakt/AnrufCta"

/**
 * Wiederverwendbare Termin-Anfrage-Sektion für die Dienstleistungs-Seiten.
 * Bettet das Standard-Formular mit vorausgewählter Behandlung ein (heller Card,
 * Conversion-Ziel) + zeitgesteuerten Anruf-Hinweis. id="kontakt-formular",
 * damit "Termin anfragen"-Buttons sanft dorthin scrollen können.
 */
export default function TerminSektion({
  behandlung,
  titel = "Termin anfragen",
  text = "Unverbindlich in unter einer Minute – Teresa meldet sich persönlich.",
}: {
  behandlung: string
  titel?: string
  text?: string
}) {
  return (
    <section id="kontakt-formular" className="scroll-mt-24 bg-[#b4b1aa] py-14 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl rounded-2xl bg-[#F5F1E8] p-6 md:p-8 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)] ring-1 ring-black/5">
          <h2 className="font-serif text-2xl text-[#2C2C2C]">{titel}</h2>
          <p className="mt-1 mb-5 text-[#5b5346]">{text}</p>
          <AnfrageFormular
            variante="standard"
            theme="hell"
            chrome={false}
            vorauswahlBehandlung={behandlung}
            dankeUrl="/kontakt/danke"
          />
          <div className="mt-5 border-t border-black/10 pt-4">
            <AnrufCta />
          </div>
        </div>
      </div>
    </section>
  )
}
