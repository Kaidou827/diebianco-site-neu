import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Saisonale Schnitttechniken | DIE BIANCO | Ihr Friseur Krefeld',
  description: 'Entdecken Sie unsere saisonalen Schnitttechniken bei DIE BIANCO in Krefeld. Perfekte Haarschnitte, die Ihre Persönlichkeit unterstreichen.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  'serviceType': 'Haarschnitt',
  'provider': {
    '@type': 'HairSalon',
    'name': 'Teresa Bianco'
  },
  'name': 'Saisonale Schnitttechniken',
  'description': 'Unsere saisonalen Schnitttechniken orientieren sich an aktuellen Looks, deinem Typ und der Zeitqualität. Von „Luna“-Looks im Winter bis zu „Sun“-Styles im Sommer – jeder Schnitt erzählt deine Geschichte.'
}

export default function SchnitttechnikenLayout({ children }: { children: React.ReactNode }) {
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
