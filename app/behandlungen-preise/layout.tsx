import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Behandlungen & Preise | DIE BIANCO | Friseur Krefeld',
  description: 'Finden Sie eine Übersicht unserer exklusiven Behandlungen und Preise bei DIE BIANCO in Krefeld. Transparente Kosten für erstklassige Friseurdienstleistungen.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  'name': 'Friseurdienstleistungen und Preise bei DIE BIANCO',
  'itemListElement': [
    {
      '@type': 'Offer',
      'itemOffered': {
        '@type': 'Service',
        'name': 'Waschen, Schneiden, Föhnen',
      },
      'priceSpecification': {
        '@type': 'PriceSpecification',
        'price': '95.00',
        'priceCurrency': 'EUR',
      },
    },
    {
      '@type': 'Offer',
      'itemOffered': {
        '@type': 'Service',
        'name': 'Balayage / Foliensträhnen',
      },
      'priceSpecification': {
        '@type': 'PriceSpecification',
        'price': '250.00',
        'priceCurrency': 'EUR',
      },
    },
    // Add other services here
  ],
};

export default function BehandlungenPreiseLayout({ children }: { children: React.ReactNode }) {
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
