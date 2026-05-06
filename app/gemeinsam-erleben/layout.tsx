import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gemeinsam Erleben | DIE BIANCO | Empfehlen & Belohnung erhalten',
  description: 'Teilen Sie ein exklusives Erlebnis bei DIE BIANCO. Empfehlen Sie uns weiter und sichern Sie sich und Ihren Freunden exklusive Vorteile und Rabatte.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'name': 'Gemeinsam Erleben bei DIE BIANCO',
  'description': 'Empfehlen Sie den Salon DIE BIANCO und erhalten Sie Belohnungen.',
}

export default function GemeinsamErlebenLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
