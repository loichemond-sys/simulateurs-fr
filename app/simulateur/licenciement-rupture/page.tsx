import { Metadata } from "next"
import { LicenciementRupture } from "@/components/simulateurs/LicenciementRupture"
import { PageWrapper } from "@/components/simulateurs/PageWrapper"
import { FAQ_LICENCIEMENT, ContentLicenciement } from "./_content"
import { num, str, RawParams } from "@/lib/cross-links"

export const metadata: Metadata = {
  title: "Calculateur indemnités licenciement et rupture conventionnelle 2025",
  description:
    "Calculez vos indemnités légales de licenciement ou rupture conventionnelle. Formule officielle Code du travail, résultat instantané.",
  keywords: [
    "indemnité licenciement",
    "rupture conventionnelle",
    "indemnité légale",
    "calcul indemnité 2025",
    "Code du travail R1234-2",
  ],
  alternates: { canonical: "/simulateur/licenciement-rupture" },
  openGraph: {
    title: "Indemnités licenciement & rupture conventionnelle 2025",
    description: "Calcul officiel de l'indemnité légale selon le Code du travail.",
    type: "website",
    locale: "fr_FR",
  },
}

export default async function Page({ searchParams }: { searchParams: Promise<RawParams> }) {
  const sp = await searchParams
  const initial = {
    type: str(sp, "type", ["licenciement-personnel", "licenciement-economique", "rupture-conventionnelle"] as const, "licenciement-personnel"),
    salaire: num(sp, "salaire", 2800),
    annees: num(sp, "annees", 5),
    mois: num(sp, "mois", 0),
  }

  return (
    <PageWrapper
      slug="licenciement-rupture"
      appName="Simulateur Indemnités de rupture 2025"
      appDescription="Calcul de l'indemnité légale de licenciement et rupture conventionnelle"
      numero="03"
      eyebrow="Licenciement & rupture"
      titre="Calculez vos indemnités de rupture"
      motCle="indemnités"
      description="L'indemnité légale minimale, calculée selon le Code du travail (Art. R1234-2). Comparez avec votre montant négocié."
      sources="Articles L1234-9 et R1234-2 du Code du travail."
      simulator={<LicenciementRupture initial={initial} />}
      faqItems={FAQ_LICENCIEMENT}
      articleEyebrow="Comprendre"
      articleTitle="Vos droits à la rupture, en clair"
      articleMotCle="droits"
      articleContent={<ContentLicenciement />}
    />
  )
}
