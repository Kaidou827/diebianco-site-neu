import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Impressum – Die Bianco",
  description: "Rechtliche Angaben zum Friseursalon Die Bianco gemäß § 5 TMG.",
}

export default function ImpressumPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-12 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8 bg-white/80 rounded-lg shadow-lg mb-8 max-w-4xl">
        {/* Added max-w-4xl here */}
        <h1 className="text-4xl font-bold mb-8 text-center text-[#333]">Impressum</h1>
        {/* Firmeninformationen */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-[#333]">Firmeninformationen</h2>
          <div className="text-gray-700 leading-relaxed">
            <p className="mb-2 break-words">
              {/* Added break-words here */}
              <strong>Die Bianco</strong>
              <br />
              Siedlung Egelsberg 1<br />
              47802 Krefeld
            </p>
            <p className="mt-4 break-words">
              {/* Added break-words here */}
              <strong>Vertreten durch:</strong>
              <br />
              [Vor- und Nachnamen der vertretungsberechtigten Personen]
            </p>
          </div>
        </div>
        {/* Kontakt */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-[#333]">Kontakt</h2>
          <div className="text-gray-700 leading-relaxed">
            <p className="break-words">
              {/* Added break-words here */}
              <strong>Telefon:</strong> +49 174 3091973
              <br />
              <strong>E-Mail:</strong> salon@diebianco.de
            </p>
          </div>
        </div>
        {/* Umsatzsteuer-ID */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-[#333]">Umsatzsteuer-ID</h2>
          <div className="text-gray-700 leading-relaxed">
            <p className="break-words">
              {/* Added break-words here */}
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
              <br />
              <strong>DE999999999</strong>
            </p>
          </div>
        </div>
        {/* Berufsbezeichnung */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-[#333]">Berufsbezeichnung und berufsrechtliche Regelungen</h2>
          <div className="text-gray-700 leading-relaxed">
            <p className="break-words">
              {/* Added break-words here */}
              <strong>Berufsbezeichnung:</strong>
              <br />
              Frisörin
            </p>
          </div>
        </div>
        {/* Verbraucherstreitbeilegung */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-[#333] break-words">
            Verbraucherstreitbeilegung / Universalschlichtungsstelle
          </h2>
          <div className="text-gray-700 leading-relaxed">
            <p className="break-words">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
