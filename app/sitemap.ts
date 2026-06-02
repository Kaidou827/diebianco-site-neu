import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.diebianco.de"

  return [
    // ===== HAUPTSEITEN =====
    { url: `${baseUrl}/`, priority: 1.0 },
    { url: `${baseUrl}/behandlungen-preise`, priority: 0.9 },
    { url: `${baseUrl}/ueber-uns`, priority: 0.8 },
    { url: `${baseUrl}/gemeinsam-erleben`, priority: 0.8 },
    { url: `${baseUrl}/kontakt`, priority: 0.9 },
    { url: `${baseUrl}/grey-blending-krefeld`, priority: 0.9 },
    { url: `${baseUrl}/impressum`, priority: 0.5 },
    { url: `${baseUrl}/datenschutz`, priority: 0.5 },
    { url: `${baseUrl}/mentoring`, priority: 0.6 },

    // ===== DIENSTLEISTUNGEN =====
    { url: `${baseUrl}/dienstleistungen`, priority: 0.9 },
    { url: `${baseUrl}/dienstleistungen/blond-spezialisten`, priority: 0.8 },
    { url: `${baseUrl}/dienstleistungen/grey-blending`, priority: 0.8 },
    { url: `${baseUrl}/dienstleistungen/farbtypologie`, priority: 0.8 },
    { url: `${baseUrl}/dienstleistungen/hautdiagnostik`, priority: 0.8 },
    { url: `${baseUrl}/dienstleistungen/keratinbehandlung`, priority: 0.8 },
    { url: `${baseUrl}/dienstleistungen/schnitttechniken`, priority: 0.8 },
    { url: `${baseUrl}/dienstleistungen/stilberatung`, priority: 0.8 },

    // ===== BLOG =====
    { url: `${baseUrl}/Blog`, priority: 0.9 },
    { url: `${baseUrl}/Blog/den-perfekten-look`, priority: 0.9 },
    { url: `${baseUrl}/Blog/balayage-krefeld`, priority: 0.9 },
    { url: `${baseUrl}/Blog/brautfrisur-krefeld`, priority: 0.9 },
    { url: `${baseUrl}/Blog/haarverlaengerung-krefeld`, priority: 0.9 },
    { url: `${baseUrl}/Blog/blond-spezialist-krefeld`, priority: 0.9 },

  ].map((entry) => ({
    ...entry,
    lastModified: new Date(),
  }))
}