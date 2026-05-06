import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Keratinbehandlung in Krefeld | DIE BIANCO | Glattes Haar',
  description: 'Erleben Sie seidig glattes Haar mit einer professionellen Keratinbehandlung bei DIE BIANCO in Krefeld. Langanhaltende Ergebnisse für gesundes Haar.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  'serviceType': 'Keratinbehandlung',
  'provider': {
    '@type': 'HairSalon',
    'name': 'Teresa Bianco'
  },
  'name': 'Professionelle Keratinbehandlung',
  'description': 'Erleben Sie seidig glattes Haar mit einer professionellen Keratinbehandlung bei DIE BIANCO in Krefeld. Langanhaltende Ergebnisse für gesundes Haar.'
}

export default function KeratinbehandlungLayout({ children }: { children: React.ReactNode }) {
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
