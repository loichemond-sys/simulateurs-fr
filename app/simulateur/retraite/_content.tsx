export const FAQ_RETRAITE = [
  {
    question: "Quel est l'âge légal de départ à la retraite après la réforme 2023 ?",
    answer:
      "La réforme de 2023 (loi Borne) relève progressivement l'âge légal de 62 à 64 ans. Si vous êtes né avant le 1er septembre 1961, rien ne change : vous pouvez partir à 62 ans. Pour les générations 1961 à 1967, l'âge augmente par tranches de 3 mois par génération. À partir de 1968, l'âge légal est fixé à 64 ans.",
  },
  {
    question: "Combien de trimestres faut-il pour une retraite à taux plein ?",
    answer:
      "Le nombre de trimestres requis dépend de votre année de naissance. Il passe de 167 trimestres (nés entre 1958 et 1960) à 172 trimestres — soit 43 ans — pour les personnes nées à partir de 1967. Quoi qu'il arrive, à 67 ans vous bénéficiez du taux plein automatique, même si votre durée de carrière est insuffisante.",
  },
  {
    question: "Qu'est-ce que la décote et comment l'éviter ?",
    answer:
      "Si vous partez à la retraite avant d'avoir validé suffisamment de trimestres et avant 67 ans, votre pension est réduite de 1,25 % par trimestre manquant, dans la limite de 25 trimestres (soit −31,25 % maximum). Cette décote est permanente et définitive. Pour l'éviter : attendez d'avoir vos trimestres requis, ou attendez 67 ans pour le taux plein automatique.",
  },
  {
    question: "Qu'est-ce que la surcote ?",
    answer:
      "La surcote récompense le fait de travailler au-delà des conditions du taux plein. Elle est de +1,25 % par trimestre supplémentaire travaillé après avoir rempli toutes les conditions (trimestres requis + âge légal). Elle s'ajoute définitivement à votre taux et peut sensiblement augmenter votre pension.",
  },
  {
    question: "Comment est calculée la pension de retraite du régime général ?",
    answer:
      "La formule est : Pension brute annuelle = SAM × Taux × (Trimestres validés / Trimestres requis). Le SAM est la moyenne des 25 meilleures années de salaires (indexés), plafonné au PASS (48 060 € en 2025). Le taux est de 50 % pour une carrière complète. La fraction de carrière (proratisation) représente la part des trimestres acquis par rapport aux trimestres requis.",
  },
  {
    question: "Peut-on partir à la retraite avant l'âge légal ?",
    answer:
      "Oui, dans certains cas : la retraite anticipée pour carrière longue permet de partir dès 58 ans si vous avez commencé à travailler très jeune. Les travailleurs handicapés (50 % ou plus) et ceux atteints d'incapacité permanente peuvent également partir plus tôt. Ces cas spécifiques ne sont pas inclus dans ce simulateur général.",
  },
  {
    question: "La pension de retraite est-elle imposable ?",
    answer:
      "Oui. La pension brute est soumise à la CSG (8,3 %), la CRDS (0,5 %) et la CASA (0,3 %), soit environ 9,1 % de prélèvements sociaux. La pension nette est ensuite imposable à l'impôt sur le revenu selon le barème progressif, avec un abattement de 10 % (plafonné). Ce simulateur affiche des pensions nettes de prélèvements sociaux mais avant IR.",
  },
]

function ArticleStrong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-ink">{children}</strong>
}

export function ContentRetraite() {
  return (
    <div className="space-y-6 text-sm text-ink-500 font-light leading-relaxed">
      <p>
        La retraite française repose sur un système par{" "}
        <ArticleStrong>répartition</ArticleStrong> : les actifs cotisent pour financer les pensions
        des retraités actuels. En contrepartie, ils accumulent des droits pour leur propre
        future pension.
      </p>

      <h3 className="font-display text-lg font-medium text-ink">La réforme de 2023, en clair</h3>
      <p>
        La loi du 14 avril 2023 (dite réforme Borne) reporte l&apos;âge légal de 62 à{" "}
        <ArticleStrong>64 ans</ArticleStrong> pour les générations nées à partir de 1968.
        La montée en charge est progressive : +3 mois par an à partir des personnes nées
        à compter du 1er septembre 1961.
      </p>
      <p>
        La durée de cotisation requise pour le taux plein augmente également jusqu&apos;à{" "}
        <ArticleStrong>172 trimestres (43 ans)</ArticleStrong> pour les nés en 1967 et après.
        L&apos;âge du taux plein automatique reste fixé à{" "}
        <ArticleStrong>67 ans</ArticleStrong>, sans modification.
      </p>

      <h3 className="font-display text-lg font-medium text-ink">Le calcul en trois paramètres</h3>
      <p>
        Votre pension dépend de trois variables :{" "}
        <ArticleStrong>le SAM</ArticleStrong> (salaire annuel moyen de vos 25 meilleures
        années, plafonné au PASS),{" "}
        <ArticleStrong>le taux</ArticleStrong> (50 % à taux plein, réduit par la décote ou
        majoré par la surcote), et{" "}
        <ArticleStrong>la proratisation</ArticleStrong> (rapport entre vos trimestres
        validés et les trimestres requis).
      </p>

      <h3 className="font-display text-lg font-medium text-ink">Décote vs surcote : l&apos;arbitrage clé</h3>
      <p>
        Partir trop tôt coûte cher : la{" "}
        <ArticleStrong>décote de 1,25 % par trimestre manquant</ArticleStrong>{" "}
        est permanente. Sur 20 ans de retraite, perdre 6 % de pension représente des
        dizaines de milliers d&apos;euros. À l&apos;inverse, travailler au-delà du taux plein
        rapporte une{" "}
        <ArticleStrong>surcote de 1,25 % par trimestre supplémentaire</ArticleStrong>.
        L&apos;âge optimal est celui où vous partez sans décote, le plus tôt possible.
      </p>

      <h3 className="font-display text-lg font-medium text-ink">Ce que ce simulateur ne couvre pas</h3>
      <p>
        Ce simulateur se concentre sur le{" "}
        <ArticleStrong>régime général (Sécurité sociale)</ArticleStrong>. Il ne prend pas
        en compte la retraite complémentaire Agirc-Arrco (qui représente généralement
        30 à 40 % de la pension totale), les régimes spéciaux, la retraite anticipée
        pour carrière longue, ni les droits à la retraite pour les professions libérales,
        artisans ou fonctionnaires.
      </p>
    </div>
  )
}
