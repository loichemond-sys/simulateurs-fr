import { FAQItem } from "@/components/seo/FAQ"
import { ArticleSection, ArticleAside, ArticleP, ArticleStrong, ArticleCite } from "@/components/seo/Article"

export const FAQ_IMPOT: FAQItem[] = [
  {
    question: "Quel est le barème de l'impôt sur le revenu 2025 ?",
    answer:
      "Le barème 2026 (revenus 2025) compte cinq tranches : 0% jusqu'à 11 600 €, 11% de 11 601 € à 29 579 €, 30% de 29 580 € à 84 577 €, 41% de 84 578 € à 181 917 €, et 45% au-delà. Ces tranches s'appliquent au quotient familial (revenu imposable divisé par le nombre de parts), pas au revenu brut.",
  },
  {
    question: "Quelle différence entre TMI et taux moyen d'imposition ?",
    answer:
      "Le TMI (Tranche Marginale d'Imposition) est le taux qui s'applique à votre dernier euro gagné, donc à la tranche la plus haute que vous atteignez. Le taux moyen est la part totale de votre revenu effectivement payée en impôt. Pour un célibataire à 35 000 € net, le TMI est de 30% mais le taux moyen autour de 7%. Cette confusion est la principale source de méprise sur l'impôt français.",
  },
  {
    question: "Comment fonctionne le quotient familial ?",
    answer:
      "Le quotient familial divise votre revenu imposable par votre nombre de parts pour appliquer le barème. Une personne seule = 1 part, un couple marié = 2 parts, +0,5 part par enfant pour les deux premiers, +1 part à partir du troisième. Exemple : un couple avec 3 enfants a 5 parts, son revenu est divisé par 5 pour calculer l'impôt par part, qui est ensuite multiplié par 5.",
  },
  {
    question: "Qu'est-ce que la décote et qui en bénéficie ?",
    answer:
      "La décote réduit l'impôt des foyers modestes dont l'impôt brut est inférieur à 1 982 € (célibataire) ou 3 277 € (couple). Le calcul : décote = 897 € − 0,4525 × impôt brut (célibataire). Concrètement, un célibataire devient imposable à partir d'environ 17 500 € de revenu net annuel, contre 32 000 € pour un couple.",
  },
  {
    question: "L'abattement de 10% sur les salaires : automatique ?",
    answer:
      "Oui. L'administration fiscale applique automatiquement un abattement de 10% sur vos salaires (et pensions) pour tenir compte des frais professionnels, avec un minimum de 509 € et un plafond de 14 555 € en 2025. Vous pouvez opter pour la déduction des frais réels si vos dépenses professionnelles dépassent ce montant — utile pour les longs trajets domicile-travail ou les frais de formation conséquents.",
  },
  {
    question: "Comment est calculé mon taux de prélèvement à la source ?",
    answer:
      "La DGFiP calcule chaque année votre taux de PAS à partir de votre dernière déclaration : impôt total ÷ revenus imposables. Ce taux est ensuite appliqué chaque mois sur votre salaire. Vous pouvez demander un taux personnalisé, neutre (taux par défaut sans information sur votre couple), ou individualisé (différent pour chaque conjoint). Le taux est révisé en septembre après réception de l'avis d'imposition.",
  },
  {
    question: "Faut-il déclarer ses revenus de freelance avec ses salaires ?",
    answer:
      "Oui, tous vos revenus sont déclarés dans la même déclaration 2042. Les salaires en case « traitements et salaires », les bénéfices d'auto-entrepreneur en BIC ou BNC selon l'activité, les dividendes en revenus de capitaux mobiliers (avec choix entre PFU 30% et barème). L'impôt est calculé globalement sur l'ensemble du foyer fiscal, ce qui peut faire grimper le TMI si plusieurs sources de revenus s'additionnent.",
  },
]

export function ContentImpot() {
  return (
    <>
      <ArticleSection numero="01" titre="Le malentendu fondamental sur le TMI">
        <ArticleP>
          La <ArticleCite>Tranche Marginale d&apos;Imposition</ArticleCite>{" "}est sans doute le concept
          fiscal le plus mal compris en France. Beaucoup pensent qu&apos;être « à 30% » signifie
          que 30% de leur revenu part en impôt — alors que ce taux ne s&apos;applique qu&apos;à la
          partie du revenu qui dépasse 29 579 €.
        </ArticleP>
        <ArticleP>
          En pratique, un célibataire gagnant 35 000 € net imposable paie environ 2 555 € d&apos;impôt,
          soit un <ArticleStrong>taux moyen d&apos;à peine 7,3%</ArticleStrong>. Le TMI à 30% est juste
          le taux qui frappe les 5 421 derniers euros (35 000 − 29 579), soit 1 626 € sur les 2 555 €
          d&apos;impôt total. Le reste vient de la tranche à 11%.
        </ArticleP>
      </ArticleSection>

      <ArticleSection numero="02" titre="Le quotient familial : la spécificité française">
        <ArticleP>
          La France est l&apos;un des rares pays au monde à pratiquer le{" "}
          <ArticleStrong>quotient familial</ArticleStrong>. Le revenu imposable est divisé par
          un nombre de parts (1 pour un célibataire, 2 pour un couple, +0,5 par enfant), le barème
          s&apos;applique au revenu par part, puis l&apos;impôt est multiplié à nouveau par le nombre
          de parts.
        </ArticleP>
        <ArticleP>
          Cette mécanique <ArticleCite>diluant le revenu</ArticleCite>{" "}avantage massivement les couples
          aux revenus inégaux et les familles. À revenu équivalent, un couple avec deux enfants paie
          significativement moins qu&apos;un célibataire — l&apos;avantage fiscal du quotient est
          toutefois <ArticleStrong>plafonné à 1 791 € par demi-part</ArticleStrong>{" "}en 2025, pour
          éviter que les ménages très aisés captent un avantage disproportionné.
        </ArticleP>
        <ArticleAside>
          Pour les parents isolés (situation de divorce, veuvage, ou célibataire avec enfant), une
          demi-part supplémentaire est accordée au titre de la « majoration parent isolé »,
          uniquement si vous vivez réellement seul avec l&apos;enfant.
        </ArticleAside>
      </ArticleSection>

      <ArticleSection numero="03" titre="La décote : l'effet de seuil oublié">
        <ArticleP>
          La <ArticleStrong>décote</ArticleStrong>{" "}est un mécanisme correcteur qui réduit l&apos;impôt
          des contribuables proches du seuil d&apos;imposition. Sans elle, on basculerait brutalement
          de 0 € à plusieurs centaines d&apos;euros d&apos;impôt en franchissant le seuil. Avec elle,
          la transition se fait progressivement.
        </ArticleP>
        <ArticleP>
          Concrètement, en 2025, un célibataire commence à payer de l&apos;impôt à partir d&apos;environ
          17 500 € de revenu net imposable annuel — bien au-delà du seuil théorique de 11 600 € grâce
          à l&apos;abattement de 10% et à la décote. Pour un couple, le seuil est aux alentours de
          32 000 €.
        </ArticleP>
      </ArticleSection>

      <ArticleSection numero="04" titre="Le prélèvement à la source : ce qu'il faut surveiller">
        <ArticleP>
          Le PAS (depuis 2019) prélève chaque mois directement sur le salaire ou la pension le montant
          d&apos;impôt dû. Le <ArticleStrong>taux est calculé par la DGFiP</ArticleStrong>{" "}à partir de
          votre dernière déclaration et appliqué automatiquement à votre employeur ou caisse de retraite.
        </ArticleP>
        <ArticleP>
          Trois options sont possibles : taux personnalisé (par défaut), taux neutre (votre employeur
          ne connaît pas votre situation familiale), ou taux individualisé (chaque conjoint a son propre
          taux). Pensez à signaler tout <ArticleCite>changement de situation</ArticleCite>{" "}(mariage,
          naissance, divorce, perte d&apos;emploi) sur impots.gouv.fr — le taux est ajusté en quelques
          semaines pour éviter une régularisation lourde l&apos;année suivante.
        </ArticleP>
      </ArticleSection>
    </>
  )
}
