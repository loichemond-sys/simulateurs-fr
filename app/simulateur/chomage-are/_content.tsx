import { FAQItem } from "@/components/seo/FAQ"
import { ArticleSection, ArticleAside, ArticleP, ArticleStrong, ArticleCite } from "@/components/seo/Article"

export const FAQ_CHOMAGE: FAQItem[] = [
  {
    question: "Combien de temps faut-il avoir travaillé pour toucher le chômage ?",
    answer:
      "Depuis 2024, il faut justifier d'au moins 6 mois (130 jours) d'affiliation sur les 24 derniers mois pour ouvrir des droits à l'ARE. Pour les 53 ans et plus, la période de référence passe à 36 mois. Cette condition s'applique aussi bien aux licenciements qu'aux ruptures conventionnelles.",
  },
  {
    question: "Comment se calcule le montant de l'ARE en 2025 ?",
    answer:
      "Pôle emploi (devenu France Travail) calcule deux formules et retient la plus favorable : (1) 12,95 € + 40,4% du salaire journalier de référence (SJR), ou (2) 57% du SJR. L'allocation journalière est plafonnée à 75% du SJR et ne peut être inférieure à 28,86 €/jour. L'allocation mensuelle est ensuite calculée sur 30,42 jours.",
  },
  {
    question: "Touche-t-on le chômage après une rupture conventionnelle ?",
    answer:
      "Oui. La rupture conventionnelle ouvre les mêmes droits qu'un licenciement. Vous percevrez l'ARE après un délai de carence de 7 jours, auquel peut s'ajouter un délai d'attente correspondant aux indemnités supra-légales reçues (divisées par 92,5, plafonné à 150 jours). C'est une voie de sortie privilégiée par les salariés.",
  },
  {
    question: "Combien de temps puis-je toucher l'ARE ?",
    answer:
      "La règle est « un jour cotisé = un jour indemnisé », plafonnée selon votre âge : 24 mois maximum pour les moins de 53 ans, 30 mois entre 53 et 54 ans, 36 mois à partir de 55 ans. Si vous avez travaillé 18 mois, vous serez indemnisé 18 mois (dans la limite de votre plafond d'âge).",
  },
  {
    question: "Qu'est-ce que la dégressivité du chômage ?",
    answer:
      "Depuis 2019, les allocataires de moins de 55 ans dont le salaire de référence dépassait 4 537 €/mois subissent une réduction de 30% de leur ARE après 6 mois d'indemnisation. L'allocation ne peut toutefois descendre en-dessous de 91,02 €/jour. Cette mesure ne s'applique pas aux 55 ans et plus.",
  },
  {
    question: "Démission et chômage : est-ce vraiment incompatible ?",
    answer:
      "En principe oui, mais il existe des exceptions reconnues : démission pour suivre un conjoint, démission pour reprendre un emploi auquel l'employeur met fin pendant la période d'essai, démission légitime pour reconversion professionnelle (avec projet validé). En cas de démission « libre », vous pouvez demander un réexamen de votre situation auprès de l'IPR (instance paritaire régionale) après 121 jours.",
  },
  {
    question: "Le délai de carence avant le premier versement",
    answer:
      "Tous les demandeurs subissent un délai d'attente de 7 jours systématique. S'ajoutent ensuite un différé d'indemnisation lié aux congés payés non pris (montant ÷ SJR) et un différé spécifique pour les indemnités supra-légales (montant ÷ 92,5, plafonné à 150 jours). Au total, le premier versement peut intervenir 1 à 6 mois après la fin du contrat.",
  },
]

export function ContentChomage() {
  return (
    <>
      <ArticleSection numero="01" titre="L'ARE : à quoi vous avez droit, vraiment">
        <ArticleP>
          L&apos;<ArticleStrong>Allocation d&apos;Aide au Retour à l&apos;Emploi</ArticleStrong>{" "}
          (ARE) est l&apos;allocation chômage versée par France Travail. Contrairement à une idée
          répandue, elle n&apos;est pas calculée comme un pourcentage de votre dernier salaire mais
          à partir d&apos;un <ArticleCite>salaire journalier de référence</ArticleCite>{" "}qui agrège
          vos rémunérations sur les 24 derniers mois.
        </ArticleP>
        <ArticleP>
          Le SJR inclut tous vos salaires bruts (mais pas les indemnités de licenciement ou de rupture).
          Il est ensuite divisé par le nombre de jours travaillés sur la même période, puis pondéré
          par un coefficient pour tenir compte des jours non travaillés.
        </ArticleP>
      </ArticleSection>

      <ArticleSection numero="02" titre="Les deux formules de calcul, et celle qu'on retient">
        <ArticleP>
          Pôle emploi calcule simultanément <ArticleStrong>deux montants</ArticleStrong>{" "}et retient
          le plus favorable. La <ArticleCite>formule fixe</ArticleCite>{" "}ajoute 12,95 € (partie fixe)
          à 40,4% du SJR. La <ArticleCite>formule proportionnelle</ArticleCite>{" "}est de 57% du SJR. La
          première avantage les bas salaires, la seconde les salaires élevés. Le point de bascule se
          situe autour d&apos;un SJR de 78 €/jour, soit environ 2 600 € brut mensuel.
        </ArticleP>
        <ArticleP>
          L&apos;allocation est ensuite encadrée : <ArticleStrong>plancher</ArticleStrong>{" "}à 28,86 €/jour
          (soit 877 €/mois) et <ArticleStrong>plafond</ArticleStrong>{" "}à 75% du SJR. Pour un cadre dirigeant
          à 10 000 € brut, le plafond effectif sera atteint et l&apos;ARE sera limitée — c&apos;est aussi
          à ce niveau qu&apos;intervient la dégressivité.
        </ArticleP>
      </ArticleSection>

      <ArticleSection numero="03" titre="Combien de temps : la règle du 1 pour 1">
        <ArticleP>
          Depuis la réforme de 2019 puis sa modification en 2023, la durée d&apos;indemnisation
          suit le principe <ArticleStrong>« un jour travaillé = un jour indemnisé »</ArticleStrong>,
          dans la limite d&apos;un plafond fonction de l&apos;âge : 24 mois pour les moins de 53 ans,
          30 mois jusqu&apos;à 55 ans, 36 mois au-delà.
        </ArticleP>
        <ArticleP>
          Une autre subtilité : depuis 2023, la durée est <ArticleStrong>réduite de 25%</ArticleStrong>{" "}
          quand le marché du travail est jugé favorable (taux de chômage inférieur à 9% trois trimestres
          consécutifs). En pratique, c&apos;est le cas depuis 2023, ce qui ramène par exemple un droit
          de 24 mois à 18 mois pour les moins de 53 ans.
        </ArticleP>
        <ArticleAside>
          Cette « modulation contracyclique » fait débat. L&apos;Unédic publie chaque trimestre un
          arrêté qui maintient ou suspend la mesure. Notre simulateur utilise la durée non réduite,
          plus protectrice pour les estimations.
        </ArticleAside>
      </ArticleSection>

      <ArticleSection numero="04" titre="Le délai de carence : ne pas se tromper de date">
        <ArticleP>
          Le premier versement de l&apos;ARE n&apos;est pas immédiat. Trois délais s&apos;additionnent :
          un <ArticleStrong>délai d&apos;attente de 7 jours</ArticleStrong>{" "}pour tout le monde,
          un <ArticleStrong>différé congés payés</ArticleStrong>{" "}(montant ÷ SJR) pour les indemnités
          de congés payés non pris, et un <ArticleStrong>différé spécifique</ArticleStrong>{" "}(montant ÷ 92,5,
          plafonné à 150 jours) pour les indemnités supra-légales.
        </ArticleP>
        <ArticleP>
          Concrètement, après une rupture conventionnelle avec une indemnité de 10 000 € au-dessus
          du légal, le différé spécifique sera de 108 jours, auxquels s&apos;ajoutent les 7 jours
          d&apos;attente : votre première allocation tombera donc 115 jours (presque 4 mois) après
          la fin du contrat. C&apos;est un point souvent oublié dans les négociations.
        </ArticleP>
      </ArticleSection>
    </>
  )
}
