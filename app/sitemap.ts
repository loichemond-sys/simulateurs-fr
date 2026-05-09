import type { MetadataRoute } from "next"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://simulateurs.fr"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const routes = [
    "",
    "/simulateur/salaire-brut-net",
    "/simulateur/chomage-are",
    "/simulateur/licenciement-rupture",
    "/simulateur/tjm-freelance",
    "/simulateur/impot-revenu",
    "/simulateur/retraite",
    "/simulateur/epargne",
  ]

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.9,
  }))
}
