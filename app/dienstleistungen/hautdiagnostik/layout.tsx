import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Professionelle Hautdiagnostik in Krefeld | DIE BIANCO',
  description: 'Erhalten Sie eine professionelle Hautdiagnostik bei DIE BIANCO in Krefeld. Wir analysieren Ihre Haut und Kopfhaut für eine optimale Pflege.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  'serviceType': 'Hautdiagnostik',
  'provider': {
    '@type': 'HairSalon',
    'name': 'Teresa Bianco'
  },
  'name': 'Professionelle Hautdiagnostik',
  'description': 'Erhalten Sie eine professionelle Hautdiagnostik bei DIE BIANCO in Krefeld. Wir analysieren Ihre Haut und Kopfhaut für eine optimale Pflege.'
}

export default function HautdiagnostikLayout({ children }: { children: React.ReactNode }) {
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
