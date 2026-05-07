import { Metadata } from "next"
import { TJMFreelance } from "@/components/simulateurs/TJMFreelance"
import { PageWrapper } from "@/components/simulateurs/PageWrapper"
import { FAQ_FREELANCE, ContentFreelance } from "./_content"
import { num, str, bool, RawParams } from "@/lib/cross-links"

export const metadata: Metadata = {
  title: "Simulateur TJM freelance 2025 — Salaire net auto-entrepreneur EURL SASU",
  description:
    "Convertissez votre TJM en salaire net mensuel selon votre statut. Comparaison auto-entrepreneur, EURL, SASU et portage salarial.",
  keywords: [
    "TJM",
    "freelance",
    "auto-entrepreneur",
    "EURL",
    "SASU",
    "portage salarial",
    "TJM minimum",
    "calcul revenu freelance",
  ],
  alternates: { canonical: "/simulateur/tjm-freelance" },
  openGraph: {
    title: "Simulateur TJM Freelance 2025",
    description: "Comparez auto-entrepreneur, EURL, SASU et portage salarial.",
    type: "website",
    locale: "fr_FR",
  },
}

export default async function Page({ searchParams }: { searchParams: Promise<RawParams> }) {
  const sp = await searchParams
  const initial = {
    tjm: num(sp, "tjm", 500),
    jours: num(sp, "jours", 15),
    secteur: str(sp, "secteur", ["services", "commerce", "artisan"] as const, "services"),
    acre: bool(sp, "acre", false),
    strategie: str(sp, "strategie", ["salaire", "mixte", "dividendes"] as const, "salaire"),
  }

  return (
    <PageWrapper
      slug="tjm-freelance"
      appName="Simulateur TJM Freelance 2025"
      appDescription="Comparaison des 4 statuts freelance et calcul du revenu net"
      numero="04"
      eyebrow="TJM freelance"
      titre="Convertissez votre TJM en revenu net"
      motCle="TJM"
      description="Quatre statuts comparés en parallèle : auto-entrepreneur, EURL, SASU, portage salarial. Trouvez aussi le TJM minimum nécessaire pour atteindre votre objectif."
      sources="URSSAF, code général des impôts, données 2025 sur les frais de portage médian."
      simulator={<TJMFreelance initial={initial} />}
      faqItems={FAQ_FREELANCE}
      articleEyebrow="Comprendre"
      articleTitle="Choisir son statut freelance"
      articleMotCle="statut"
      articleContent={<ContentFreelance />}
    />
  )
}
