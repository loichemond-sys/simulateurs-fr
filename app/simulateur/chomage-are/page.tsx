import { Metadata } from "next"
import { ChomageARE } from "@/components/simulateurs/ChomageARE"
import { PageWrapper } from "@/components/simulateurs/PageWrapper"
import { FAQ_CHOMAGE, ContentChomage } from "./_content"
import { num, str, RawParams } from "@/lib/cross-links"

export const metadata: Metadata = {
  title: "Simulateur chômage ARE 2025 — Calculez vos droits France Travail",
  description:
    "Estimez vos allocations chômage ARE en 30 secondes. Calcul du SJR, durée d'indemnisation, montant mensuel. Règles Unédic 2025.",
  keywords: [
    "simulateur chômage",
    "ARE",
    "France Travail",
    "Pôle Emploi",
    "SJR",
    "indemnisation chômage 2025",
    "rupture conventionnelle chômage",
  ],
  alternates: { canonical: "/simulateur/chomage-are" },
  openGraph: {
    title: "Simulateur chômage ARE 2025",
    description: "Estimez vos droits au chômage selon les règles Unédic 2025.",
    type: "website",
    locale: "fr_FR",
  },
}

export default async function Page({ searchParams }: { searchParams: Promise<RawParams> }) {
  const sp = await searchParams
  const initial = {
    salaire: num(sp, "salaire", 2500),
    duree: num(sp, "duree", 18),
    age: num(sp, "age", 35),
    motif: str(sp, "motif", ["licenciement", "rupture-conventionnelle", "fin-cdd"] as const, "licenciement"),
  }

  return (
    <PageWrapper
      slug="chomage-are"
      appName="Simulateur Chômage ARE 2025"
      appDescription="Calcul de l'allocation chômage selon les règles Unédic 2025"
      numero="02"
      eyebrow="Droits au chômage (ARE)"
      titre="Estimez vos droits chômage"
      motCle="droits chômage"
      description="Les règles Unédic appliquées à votre situation : montant journalier, durée d'indemnisation, dégressivité. Tout y est."
      sources="Règlement Unédic du 26 juillet 2019 et avenants 2025, France Travail."
      simulator={<ChomageARE initial={initial} />}
      faqItems={FAQ_CHOMAGE}
      articleEyebrow="Comprendre"
      articleTitle="L'ARE expliquée simplement"
      articleMotCle="ARE"
      articleContent={<ContentChomage />}
    />
  )
}
