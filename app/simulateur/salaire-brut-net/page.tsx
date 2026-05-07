import { Metadata } from "next"
import { SalaireBrutNet } from "@/components/simulateurs/SalaireBrutNet"
import { PageWrapper } from "@/components/simulateurs/PageWrapper"
import { FAQ_SALAIRE, ContentSalaire } from "./_content"
import { num, str, RawParams } from "@/lib/cross-links"

export const metadata: Metadata = {
  title: "Simulateur salaire brut net 2025 — Calcul instantané URSSAF",
  description:
    "Calculez votre salaire net à partir du brut en temps réel. Cotisations détaillées, cadre et non-cadre. Barèmes URSSAF 2025 officiels. Gratuit, sans inscription.",
  keywords: [
    "simulateur salaire brut net 2025",
    "calcul salaire net",
    "convertir brut en net",
    "fiche de paie",
    "cotisations URSSAF",
    "salaire cadre net",
  ],
  alternates: { canonical: "/simulateur/salaire-brut-net" },
  openGraph: {
    title: "Simulateur salaire brut net 2025",
    description: "Calculez votre net à partir de votre brut, en temps réel. Barèmes URSSAF 2025.",
    type: "website",
    locale: "fr_FR",
  },
}

export default async function Page({ searchParams }: { searchParams: Promise<RawParams> }) {
  const sp = await searchParams
  const initial = {
    brut: num(sp, "brut", 3000),
    statut: str(sp, "statut", ["non-cadre", "cadre"] as const, "non-cadre"),
    temps: num(sp, "temps", 100),
    pas: num(sp, "pas", 0),
    mutuelle: num(sp, "mutuelle", 0),
  }

  return (
    <PageWrapper
      slug="salaire-brut-net"
      appName="Simulateur Salaire Brut Net 2025"
      appDescription="Calcul du salaire net selon les barèmes URSSAF 2025"
      numero="01"
      eyebrow="Salaire brut → net"
      titre="Décodez votre fiche de paie"
      motCle="fiche de paie"
      description="Le calcul officiel des cotisations URSSAF 2025, en temps réel. Cadre ou non-cadre, temps partiel, prélèvement à la source — tout est pris en compte."
      sources="URSSAF (circulaires 2025), Code de la Sécurité sociale, Code du travail."
      simulator={<SalaireBrutNet initial={initial} />}
      faqItems={FAQ_SALAIRE}
      articleEyebrow="Comprendre"
      articleTitle="Tout ce qu'il faut savoir pour lire sa paie"
      articleMotCle="lire sa paie"
      articleContent={<ContentSalaire />}
    />
  )
}
