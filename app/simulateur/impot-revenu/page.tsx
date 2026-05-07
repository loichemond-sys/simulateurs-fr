import { Metadata } from "next"
import { ImpotRevenu } from "@/components/simulateurs/ImpotRevenu"
import { PageWrapper } from "@/components/simulateurs/PageWrapper"
import { FAQ_IMPOT, ContentImpot } from "./_content"
import { num, str, RawParams } from "@/lib/cross-links"

export const metadata: Metadata = {
  title: "Simulateur impôt sur le revenu 2025 — Calcul avec barème officiel",
  description:
    "Calculez votre impôt sur le revenu avec le barème 2026 (revenus 2025). Taux moyen, TMI, décote, quotient familial. Barème DGFiP officiel.",
  keywords: [
    "impôt sur le revenu",
    "TMI 2025",
    "barème IR 2026",
    "quotient familial",
    "décote",
    "prélèvement à la source",
    "calcul impôt",
  ],
  alternates: { canonical: "/simulateur/impot-revenu" },
  openGraph: {
    title: "Simulateur impôt sur le revenu 2025",
    description: "Barème 2026 (revenus 2025), quotient familial, décote, TMI.",
    type: "website",
    locale: "fr_FR",
  },
}

export default async function Page({ searchParams }: { searchParams: Promise<RawParams> }) {
  const sp = await searchParams
  const initial = {
    revenu: num(sp, "revenu", 35000),
    situation: str(sp, "situation", ["celibataire", "marie", "divorce-veuf"] as const, "celibataire"),
    enfants: num(sp, "enfants", 0),
  }

  return (
    <PageWrapper
      slug="impot-revenu"
      appName="Simulateur Impôt sur le Revenu 2025"
      appDescription="Calcul de l'impôt avec barème 2026 et quotient familial"
      numero="05"
      eyebrow="Impôt sur le revenu"
      titre="Calculez votre impôt en clair"
      motCle="impôt"
      description="Le barème 2026 appliqué à vos revenus 2025. Quotient familial, décote, taux moyen et TMI. Visualisation graphique de votre revenu net."
      sources="Loi de finances 2026, article 197 du Code général des impôts (CGI), DGFiP."
      simulator={<ImpotRevenu initial={initial} />}
      faqItems={FAQ_IMPOT}
      articleEyebrow="Comprendre"
      articleTitle="L'impôt sur le revenu, sans le jargon"
      articleMotCle="sans le jargon"
      articleContent={<ContentImpot />}
    />
  )
}
