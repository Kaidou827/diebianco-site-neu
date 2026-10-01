import { salonAdresse } from "@/lib/site-info"

/**
 * JobPosting-JSON-LD (Google for Jobs). baseSalary nur, wenn ENV gesetzt.
 * datePosted = Build-Zeit, validThrough = +90 Tage.
 * Hinweis: schema.org kennt keinen eigenen „Ausbildung"-employmentType –
 * für die Ausbildung wird FULL_TIME verwendet (im PR als offener Punkt notiert).
 */
export interface JobPostingProps {
  title: string
  description: string
  employmentType: string[]
  baseSalary?: { value: number; unitText: "MONTH" | "YEAR"; currency?: string }
  url: string
}

/** Reines JobPosting-Objekt (testbar, ohne JSX). */
export function jobPostingData(p: JobPostingProps): Record<string, unknown> {
  const jetzt = new Date()
  const validThrough = new Date(jetzt.getTime() + 90 * 24 * 60 * 60 * 1000)
  const { title, description, employmentType, baseSalary, url } = p

  const data: Record<string, unknown> = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title,
    description,
    datePosted: jetzt.toISOString().slice(0, 10),
    validThrough: validThrough.toISOString().slice(0, 10),
    employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: "DIE BIANCO",
      sameAs: "https://www.diebianco.de",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: salonAdresse.strasse,
        postalCode: "47802",
        addressLocality: "Krefeld",
        addressCountry: "DE",
      },
    },
    directApply: true,
    url,
  }

  if (baseSalary) {
    data.baseSalary = {
      "@type": "MonetaryAmount",
      currency: baseSalary.currency || "EUR",
      value: {
        "@type": "QuantitativeValue",
        value: baseSalary.value,
        unitText: baseSalary.unitText,
      },
    }
  }

  return data
}

export default function JobPostingJsonLd(props: JobPostingProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingData(props)) }}
    />
  )
}
