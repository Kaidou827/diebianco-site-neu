import { Metadata } from 'next'
import { ArrowRight, Shirt, Palette, Sparkles, Scissors, Heart, Users } from "lucide-react"

export const metadata: Metadata = {
  title: 'Stilberatung in Krefeld | DIE BIANCO | Finden Sie Ihren Stil',
  description: 'Unsere Stilberatung bei DIE BIANCO in Krefeld hilft Ihnen, Ihren persönlichen Stil zu finden und zu unterstreichen. Für einen authentischen Auftritt.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  'serviceType': 'Stilberatung',
  'provider': {
    '@type': 'HairSalon',
    'name': 'Teresa Bianco'
  },
  'name': 'Persönliche Stilberatung',
  'description': 'Unsere Stilberatung bei DIE BIANCO in Krefeld hilft Ihnen, Ihren persönlichen Stil zu finden und zu unterstreichen. Für einen authentischen Auftritt.'
}

export default function StilberatungLayout({ children }: { children: React.ReactNode }) {
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
