import { FAQItem } from "@/components/seo/FAQ"
import { ArticleSection, ArticleAside, ArticleP, ArticleStrong, ArticleCite } from "@/components/seo/Article"

export const FAQ_SALAIRE: FAQItem[] = [
  {
    question: "Comment passer du salaire brut au net en 2025 ?",
    answer:
      "Le passage brut au net consiste à retirer du salaire brut les cotisations salariales (retraite Sécurité sociale, retraite complémentaire AGIRC-ARRCO, CSG et CRDS). En 2025, ces cotisations représentent environ 22% du brut pour un non-cadre et 25% pour un cadre. Sur 3 000 € brut non-cadre, le net avant impôt est d'environ 2 350-2 400 €.",
  },
  {
    question: "Quelle différence entre cadre et non-cadre sur la fiche de paie ?",
    answer:
      "Un cadre cotise davantage à la retraite complémentaire (4,01% en T1 contre 3,15% pour un non-cadre) et paie en plus la CET (Contribution d'équilibre technique, 0,14% sur la T2) et une CEG plus élevée. À salaire brut égal, un cadre touche donc environ 30 à 80 € de moins par mois qu'un non-cadre, mais valide les mêmes droits à la retraite.",
  },
  {
    question: "Quelle est la différence entre net avant impôt et net après impôt ?",
    answer:
      "Le net avant impôt est ce que vous touchez après cotisations sociales mais avant l'impôt sur le revenu. Le net après impôt correspond à la somme effectivement versée sur votre compte, après le prélèvement à la source. Le taux du PAS est calculé chaque année par la DGFiP en fonction de votre déclaration de revenus.",
  },
  {
    question: "Que sont la CSG et la CRDS sur ma fiche de paie ?",
    answer:
      "La CSG (Contribution sociale généralisée) finance la Sécurité sociale et la CRDS (Contribution au remboursement de la dette sociale) rembourse la dette de la Sécu. Ensemble, elles s'élèvent à 9,7% sur 98,25% du brut (abattement forfaitaire de 1,75% pour frais professionnels). Une partie de la CSG (6,8%) est déductible du revenu imposable.",
  },
  {
    question: "Combien coûte mon salaire à mon employeur ?",
    answer:
      "Au-delà du brut versé, l'employeur paie les cotisations patronales (assurance maladie, allocations familiales, retraite, chômage, AT/MP, formation, etc.). Le coût total employeur est en moyenne 1,42 fois le salaire brut. Pour un brut de 3 000 €, l'employeur dépense environ 4 260 € par mois.",
  },
  {
    question: "Le SMIC 2025 brut et net mensuel",
    answer:
      "Au 1ᵉʳ janvier 2025, le SMIC brut horaire est de 11,88 € (35 heures/semaine), soit 1 802,25 € brut mensuel. Le SMIC net avant impôt s'établit autour de 1 426 € pour un salarié non-cadre à temps plein. Le SMIC est revalorisé automatiquement selon l'inflation et peut être réévalué en cours d'année.",
  },
  {
    question: "Pourquoi mon net est-il différent de la formule brut × 0,77 ?",
    answer:
      "La règle des 23% est une moyenne, mais le taux réel dépend de plusieurs facteurs : statut cadre/non-cadre, salaire au-dessus du PMSS (3 925 €/mois en 2025) qui modifie les tranches de cotisations, mutuelle d'entreprise obligatoire, frais de transport, et participation/intéressement. Un salaire élevé verra ses cotisations T2 augmenter proportionnellement.",
  },
]

export function ContentSalaire() {
  return (
    <>
      <ArticleSection numero="01" titre="Comprendre votre fiche de paie">
        <ArticleP>
          Une fiche de paie française liste plus de 15 lignes de cotisations différentes —
          c&apos;est l&apos;une des plus complexes au monde. Mais derrière cette complexité,
          le calcul suit une logique précise : <ArticleStrong>quatre grandes familles de cotisations</ArticleStrong>{" "}
          financent quatre risques différents.
        </ArticleP>
        <ArticleP>
          La <ArticleStrong>retraite</ArticleStrong>{" "}(de base et complémentaire) prélève environ 11% du brut,
          la <ArticleStrong>CSG-CRDS</ArticleStrong>{" "}qui finance la Sécurité sociale en prélève 9,7%, et
          quelques cotisations marginales (CEG, CET pour les cadres) le solde. L&apos;assurance maladie
          et le chômage sont, depuis 2018, intégralement à la charge de l&apos;employeur côté salarié.
        </ArticleP>
      </ArticleSection>

      <ArticleSection numero="02" titre="Le PMSS : la frontière qui change tout">
        <ArticleP>
          Le <ArticleCite>Plafond Mensuel de la Sécurité Sociale</ArticleCite>{" "}(PMSS) vaut{" "}
          <ArticleStrong>3 925 € en 2025</ArticleStrong>. C&apos;est la frontière entre la tranche 1
          (T1, jusqu&apos;à 1 PMSS) et la tranche 2 (T2, de 1 à 8 PMSS) pour la retraite complémentaire.
        </ArticleP>
        <ArticleP>
          Les taux T1 et T2 sont différents : 3,15% vs 8,64% pour un non-cadre, 4,01% vs 9,72% pour un cadre.
          Concrètement, un salarié à 5 000 € brut paie 3,15% sur les 3 925 premiers euros, puis 8,64% sur
          les 1 075 € au-dessus. C&apos;est pour cela qu&apos;on ne peut pas simplement multiplier
          le brut par un taux unique.
        </ArticleP>
        <ArticleAside>
          Le PMSS est revalorisé chaque 1ᵉʳ janvier en fonction de l&apos;évolution moyenne des salaires.
          En 2024 il était à 3 864 €, en 2025 à 3 925 €. Cette indexation explique pourquoi
          beaucoup de simulateurs en ligne deviennent vite obsolètes.
        </ArticleAside>
      </ArticleSection>

      <ArticleSection numero="03" titre="Cadre ou non-cadre : ce qui change vraiment">
        <ArticleP>
          La distinction cadre / non-cadre, héritée de la convention collective AGIRC de 1947,
          a été <ArticleStrong>fusionnée en 2019</ArticleStrong>{" "}avec le régime ARRCO. Mais elle
          subsiste pour quelques cotisations : taux de retraite complémentaire majorés, CET
          (Contribution d&apos;équilibre technique de 0,14%), prévoyance souvent plus complète.
        </ArticleP>
        <ArticleP>
          À salaire brut équivalent, un cadre touche entre 30 et 80 € de moins par mois qu&apos;un non-cadre —
          la différence finance des droits supplémentaires en matière de prévoyance et une retraite légèrement
          plus avantageuse à la sortie. C&apos;est un calcul à long terme.
        </ArticleP>
      </ArticleSection>

      <ArticleSection numero="04" titre="Le coût employeur, l'autre moitié de votre salaire">
        <ArticleP>
          Les <ArticleStrong>charges patronales</ArticleStrong>{" "}représentent environ 42% du salaire brut
          en moyenne. Pour un brut de 3 000 €, l&apos;employeur paie en réalité 4 260 € par mois — soit
          environ <ArticleStrong>1 260 € de cotisations supplémentaires</ArticleStrong>{" "}qui ne figurent
          pas sur la fiche de paie côté salarié.
        </ArticleP>
        <ArticleP>
          Ces charges financent l&apos;assurance maladie patronale, la branche famille (allocations),
          la branche retraite, l&apos;assurance chômage (4,05%), les accidents du travail (variable selon
          le secteur), la formation professionnelle et le versement transport pour les entreprises de plus
          de 11 salariés en zone urbaine. C&apos;est une donnée importante pour comprendre votre valeur
          réelle pour l&apos;entreprise.
        </ArticleP>
      </ArticleSection>
    </>
  )
}
