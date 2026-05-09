import { Metadata } from "next"
import { SimulateurRetraite } from "@/components/simulateurs/SimulateurRetraite"
import { PageWrapper } from "@/components/simulateurs/PageWrapper"
import { FAQ_RETRAITE, ContentRetraite } from "./_content"
import { num, RawParams } from "@/lib/cross-links"

export const metadata: Metadata = {
  title: "Simulateur retraite 2025 — Trimestres, pension et âge optimal réforme 2023",
  description:
    "Calculez votre âge optimal de départ, le nombre de trimestres requis et votre pension estimée. Réforme 2023 prise en compte, barème officiel régime général.",
  keywords: [
    "simulateur retraite",
    "trimestres retraite",
    "réforme retraite 2023",
    "âge légal retraite",
    "pension retraite calcul",
    "taux plein",
    "décote surcote",
    "retraite 64 ans",
  ],
  alternates: { canonical: "/simulateur/retraite" },
  openGraph: {
    title: "Simulateur retraite 2025 — Réforme Borne",
    description: "Trimestres, pension et âge optimal selon la réforme de 2023.",
    type: "website",
    locale: "fr_FR",
  },
}

export default async function Page({ searchParams }: { searchParams: Promise<RawParams> }) {
  const sp = await searchParams
  const initial = {
    naissance: num(sp, "naissance", 1975),
    debut: num(sp, "debut", 1997),
    salaire: num(sp, "salaire", 35000),
  }

  return (
    <PageWrapper
      slug="retraite"
      appName="Simulateur Retraite 2025"
      appDescription="Trimestres, pension estimée et âge optimal selon la réforme 2023"
      numero="06"
      eyebrow="Retraite"
      titre="Calculez votre pension et votre âge optimal"
      motCle="retraite"
      description="Réforme 2023 intégrée : âge légal 62–64 ans selon votre génération, 172 trimestres requis, décote/surcote. Trouvez l'âge où partir sans pénalité."
      sources="Art. L161-17-3 CSS, loi n°2023-270 du 14 avril 2023, décrets retraite CNAV 2025."
      simulator={<SimulateurRetraite initial={initial} />}
      faqItems={FAQ_RETRAITE}
      articleEyebrow="Comprendre"
      articleTitle="La retraite française, sans le jargon"
      articleMotCle="sans le jargon"
      articleContent={<ContentRetraite />}
    />
  )
}
