import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blond-Spezialisten in Krefeld | DIE BIANCO | Perfektes Blond',
  description: 'Unsere Blond-Spezialisten bei DIE BIANCO in Krefeld zaubern Ihr perfektes, typgerechtes Blond – ganz ohne Kompromisse und unerwünschten Gelbstich.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  'serviceType': 'Blondierung',
  'provider': {
    '@type': 'HairSalon',
    'name': 'Teresa Bianco'
  },
  'name': 'Blond-Spezialisten',
  'description': 'Unsere Blond-Spezialisten bei DIE BIANCO in Krefeld zaubern Ihr perfektes, typgerechtes Blond – ganz ohne Kompromisse und unerwünschten Gelbstich.'
}

export default function BlondSpezialistenLayout({ children }: { children: React.ReactNode }) {
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
