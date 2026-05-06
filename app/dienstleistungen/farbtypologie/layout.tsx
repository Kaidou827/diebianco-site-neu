import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Farbtypologie & Stilberatung Krefeld | DIE BIANCO',
  description: 'Entdecken Sie Ihre idealen Farben mit unserer professionellen Farbtypologie und Stilberatung bei DIE BIANCO in Krefeld. Für einen authentischen Look.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  'serviceType': 'Farbtypologie',
  'provider': {
    '@type': 'HairSalon',
    'name': 'Teresa Bianco'
  },
  'name': 'Farbtypologie & Stilberatung',
  'description': 'Entdecken Sie Ihre idealen Farben mit unserer professionellen Farbtypologie und Stilberatung bei DIE BIANCO in Krefeld. Für einen authentischen Look.'
}

export default function FarbtypologieLayout({ children }: { children: React.ReactNode }) {
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
