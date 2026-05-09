import { Metadata } from "next"
import { SimulateurEpargne } from "@/components/simulateurs/SimulateurEpargne"
import { PageWrapper } from "@/components/simulateurs/PageWrapper"
import { FAQ_EPARGNE, ContentEpargne } from "./_content"
import { num, RawParams } from "@/lib/cross-links"

export const metadata: Metadata = {
  title: "Simulateur épargne 2025 — Livret A, LEP, PEA, assurance-vie",
  description:
    "Comparez Livret A, LEP, assurance-vie et PEA. Calculez votre capital final, les intérêts générés et l'effet des intérêts composés selon votre horizon.",
  keywords: [
    "simulateur épargne",
    "Livret A calcul",
    "LEP 2025",
    "PEA simulation",
    "assurance-vie rendement",
    "intérêts composés",
    "épargne mensuelle",
  ],
  alternates: { canonical: "/simulateur/epargne" },
  openGraph: {
    title: "Simulateur épargne 2025",
    description: "Livret A, LEP, PEA, assurance-vie — comparez et optimisez.",
    type: "website",
    locale: "fr_FR",
  },
}

export default async function Page({ searchParams }: { searchParams: Promise<RawParams> }) {
  const sp = await searchParams
  const initial = {
    capital: num(sp, "capital", 5000),
    versement: num(sp, "versement", 200),
    duree: num(sp, "duree", 10),
  }

  return (
    <PageWrapper
      slug="epargne"
      appName="Simulateur Épargne 2025"
      appDescription="Comparaison Livret A, LEP, assurance-vie et PEA"
      numero="07"
      eyebrow="Épargne"
      titre="Faites travailler votre épargne"
      motCle="épargne"
      description="Livret A, LEP, assurance-vie, PEA. Simulez l'effet des intérêts composés sur 1 à 30 ans et trouvez le produit adapté à votre horizon."
      sources="Taux Banque de France mai 2026, BOFIP assurance-vie, règlementation PEA (art. L221-30 CMF)."
      simulator={<SimulateurEpargne initial={initial} />}
      faqItems={FAQ_EPARGNE}
      articleEyebrow="Comprendre"
      articleTitle="L'épargne intelligente, sans le jargon"
      articleMotCle="intelligente"
      articleContent={<ContentEpargne />}
    />
  )
}
