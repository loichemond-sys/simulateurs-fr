import { FAQItem } from "@/components/seo/FAQ"
import { ArticleSection, ArticleAside, ArticleP, ArticleStrong, ArticleCite } from "@/components/seo/Article"

export const FAQ_LICENCIEMENT: FAQItem[] = [
  {
    question: "Comment calculer son indemnité de licenciement en 2025 ?",
    answer:
      "L'indemnité légale est de 1/4 de mois de salaire par année d'ancienneté jusqu'à 10 ans, puis 1/3 de mois par année au-delà. Le salaire de référence est la moyenne la plus favorable entre les 12 ou les 3 derniers mois. Une convention collective peut prévoir un montant supérieur, jamais inférieur (Article L1234-9 du Code du travail).",
  },
  {
    question: "Quelle ancienneté minimale pour avoir droit à l'indemnité ?",
    answer:
      "Il faut au moins 8 mois ininterrompus dans l'entreprise (depuis 2017, contre 1 an auparavant). Cette règle s'applique aux licenciements pour motif personnel ou économique, ainsi qu'aux ruptures conventionnelles. Avant 8 mois, aucune indemnité légale n'est due, sauf disposition contraire de la convention collective.",
  },
  {
    question: "Indemnité de rupture conventionnelle : différence avec un licenciement ?",
    answer:
      "Le montant minimum est identique à celui d'un licenciement (formule R1234-2 du Code du travail). Mais la rupture conventionnelle offre généralement plus de marge de négociation : il est courant d'obtenir 1,5 à 3 fois l'indemnité légale, selon la situation de l'entreprise et le contexte du départ. La rupture conventionnelle ouvre les mêmes droits au chômage qu'un licenciement.",
  },
  {
    question: "Les indemnités de licenciement sont-elles imposables ?",
    answer:
      "L'indemnité légale ou conventionnelle est exonérée d'impôt sur le revenu dans la limite du montant prévu par la loi ou la convention collective. Au-delà, la part supérieure est imposable mais peut bénéficier d'un système de quotient pour atténuer la progressivité. Côté cotisations sociales, l'exonération va jusqu'à 2 PASS (96 120 € en 2025).",
  },
  {
    question: "Comment se calcule le salaire de référence ?",
    answer:
      "On prend le plus favorable entre deux moyennes : (1) la moyenne mensuelle des salaires bruts des 12 derniers mois (incluant primes et 13ᵉ mois), ou (2) la moyenne des 3 derniers mois (avec une règle anti-abus pour les primes exceptionnelles). Si l'ancienneté est inférieure à 12 mois, on calcule la moyenne sur la période réellement travaillée.",
  },
  {
    question: "Indemnité de licenciement et calcul du chômage",
    answer:
      "L'indemnité légale n'a aucun impact sur votre droit au chômage. En revanche, la partie supra-légale (au-delà du minimum légal ou conventionnel) entraîne un différé spécifique d'indemnisation : votre premier versement d'ARE sera repoussé du nombre de jours = montant supra-légal / 92,5, plafonné à 150 jours.",
  },
  {
    question: "Peut-on cumuler indemnité de rupture et indemnité de congés payés ?",
    answer:
      "Oui. L'indemnité compensatrice de congés payés (pour les jours non pris au moment du départ) est due en plus de l'indemnité de rupture. Elle est en revanche soumise à cotisations sociales et à l'impôt sur le revenu, contrairement à l'indemnité de rupture qui bénéficie d'un régime de faveur.",
  },
]

export function ContentLicenciement() {
  return (
    <>
      <ArticleSection numero="01" titre="La formule officielle, et rien d'autre">
        <ArticleP>
          L&apos;article R1234-2 du Code du travail fixe une formule très claire :{" "}
          <ArticleStrong>1/4 de mois de salaire par année d&apos;ancienneté jusqu&apos;à 10 ans</ArticleStrong>,
          puis <ArticleStrong>1/3 de mois par année au-delà</ArticleStrong>. C&apos;est le minimum légal.
          Pour un salarié de 12 ans d&apos;ancienneté à 3 000 € brut, l&apos;indemnité minimale est donc
          de (10 × 750 €) + (2 × 1 000 €) = 9 500 €.
        </ArticleP>
        <ArticleP>
          Cette formule s&apos;applique aussi bien au licenciement personnel qu&apos;au licenciement
          économique et à la rupture conventionnelle. Seule l&apos;indemnité de mise à la retraite
          d&apos;office par l&apos;employeur suit un calcul légèrement différent.
        </ArticleP>
      </ArticleSection>

      <ArticleSection numero="02" titre="Le salaire de référence : 12 mois ou 3 mois ?">
        <ArticleP>
          Le Code du travail laisse le choix au salarié entre deux modes de calcul du salaire de référence :
          la moyenne des <ArticleStrong>12 derniers mois</ArticleStrong>{" "}ou des{" "}
          <ArticleStrong>3 derniers mois</ArticleStrong>. La méthode la plus favorable est retenue
          d&apos;office, mais en pratique il faut souvent rappeler ce droit à l&apos;employeur.
        </ArticleP>
        <ArticleP>
          La moyenne sur 3 mois inclut les primes versées sur cette période, mais une règle anti-abus
          neutralise les primes ponctuelles : une prime annuelle ou semestrielle est proratisée pour
          ne compter que sur 3 mois, ce qui évite les manipulations. La moyenne sur 12 mois reste plus
          stable et inclut le 13ᵉ mois s&apos;il existe.
        </ArticleP>
      </ArticleSection>

      <ArticleSection numero="03" titre="Convention collective : presque toujours plus généreuse">
        <ArticleP>
          La quasi-totalité des conventions collectives françaises prévoient une indemnité{" "}
          <ArticleStrong>supérieure au minimum légal</ArticleStrong>. La convention SYNTEC (informatique,
          conseil) verse par exemple 1/3 de mois par année dès la première année. La métallurgie,
          la banque ou les transports ont également des barèmes plus favorables.
        </ArticleP>
        <ArticleP>
          Vérifier sa convention collective avant toute négociation est donc une étape essentielle.
          Elle figure sur votre fiche de paie (« IDCC » suivi d&apos;un numéro) et le texte intégral
          est consultable gratuitement sur Légifrance.
        </ArticleP>
        <ArticleAside>
          La rupture conventionnelle bénéficie aussi du minimum conventionnel : si votre convention
          prévoit une indemnité plus élevée, l&apos;employeur ne peut vous proposer moins. C&apos;est
          un levier de négociation souvent ignoré.
        </ArticleAside>
      </ArticleSection>

      <ArticleSection numero="04" titre="Fiscalité : le piège des indemnités supra-légales">
        <ArticleP>
          Les indemnités de rupture bénéficient d&apos;un <ArticleCite>régime de faveur</ArticleCite>{" "}:
          exonération totale d&apos;impôt sur le revenu jusqu&apos;au montant légal ou conventionnel,
          et exonération de cotisations sociales jusqu&apos;à 2 PASS (96 120 € en 2025).
        </ArticleP>
        <ArticleP>
          Au-delà, la fiscalité devient sensible. Les sommes supra-légales sont soumises à CSG/CRDS
          dès le premier euro, à cotisations sociales au-delà de 2 PASS, et à l&apos;impôt sur le revenu.
          Heureusement, il existe un <ArticleStrong>système de quotient</ArticleStrong>{" "}qui permet
          d&apos;étaler la charge fiscale et d&apos;éviter de basculer artificiellement dans une
          tranche d&apos;imposition supérieure. À demander explicitement dans votre déclaration.
        </ArticleP>
      </ArticleSection>
    </>
  )
}
