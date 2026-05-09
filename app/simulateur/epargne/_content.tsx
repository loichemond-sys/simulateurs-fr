export const FAQ_EPARGNE = [
  {
    question: "Quelle est la différence entre le Livret A et le LEP ?",
    answer:
      "Le Livret A (2,4 % net) est accessible à tous, plafonné à 22 950 €. Le LEP (3,5 % net) offre un meilleur taux mais est réservé aux personnes dont les revenus ne dépassent pas 21 393 € par an (sur 1 part fiscale). Si vous y êtes éligible, le LEP est toujours plus intéressant que le Livret A.",
  },
  {
    question: "Qu'est-ce que la capitalisation des intérêts ?",
    answer:
      "La capitalisation signifie que les intérêts générés s'ajoutent au capital et produisent à leur tour des intérêts. Sur le long terme, cet effet boule de neige peut être spectaculaire : un placement à 8 % double en 9 ans. Plus la durée est longue, plus la capitalisation amplifie la différence entre les produits.",
  },
  {
    question: "Comment fonctionne la fiscalité du PEA ?",
    answer:
      "Le Plan d'Épargne en Actions est exonéré d'impôt sur le revenu après 5 ans de détention. Seuls les prélèvements sociaux de 17,2 % s'appliquent lors des retraits. Avant 5 ans, les gains sont soumis au PFU de 30 %. Le plafond des versements est de 150 000 €.",
  },
  {
    question: "L'assurance-vie est-elle vraiment intéressante ?",
    answer:
      "Le fonds en euros d'une assurance-vie garantit le capital et offre environ 2,5 à 3,5 % brut en 2025. L'avantage principal est la fiscalité : après 8 ans, un abattement annuel de 4 600 € (9 200 € pour un couple) exonère une partie des gains, et le taux d'IR est réduit à 7,5 %. Elle est idéale pour un horizon de 8 à 20 ans.",
  },
  {
    question: "Combien dois-je épargner par mois ?",
    answer:
      "La règle classique est d'épargner entre 10 % et 20 % de ses revenus. Avant tout placement long terme, constituez une épargne de précaution de 3 à 6 mois de salaire sur un Livret A. Ensuite, vous pouvez envisager des placements plus rémunérateurs selon votre horizon et votre tolérance au risque.",
  },
  {
    question: "Le PEA est-il risqué ?",
    answer:
      "Oui, le PEA investi en ETF monde (actions) peut perdre de la valeur à court terme. Sur un horizon long (10 à 20 ans), les indices boursiers mondiaux ont historiquement délivré ~8 % annuels. Le risque se dilue avec le temps, mais une perte en capital reste possible. Ce produit n'est adapté qu'aux épargnants ayant un horizon d'au moins 8 à 10 ans.",
  },
]

function ArticleStrong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-ink">{children}</strong>
}

export function ContentEpargne() {
  return (
    <div className="space-y-6 text-sm text-ink-500 font-light leading-relaxed">
      <p>
        Épargner, c&apos;est arbitrer entre{" "}
        <ArticleStrong>sécurité</ArticleStrong>,{" "}
        <ArticleStrong>liquidité</ArticleStrong> et{" "}
        <ArticleStrong>rendement</ArticleStrong>. Ces trois critères sont rarement
        réunis en même temps. La clé est d&apos;adapter le produit à l&apos;horizon de temps
        et à votre tolérance au risque.
      </p>

      <h3 className="font-display text-lg font-medium text-ink">La hiérarchie des enveloppes</h3>
      <p>
        La bonne stratégie commence par une{" "}
        <ArticleStrong>épargne de précaution</ArticleStrong> (3 à 6 mois de dépenses)
        sur Livret A ou LEP. Une fois ce filet de sécurité constitué, les versements
        supplémentaires peuvent aller vers des enveloppes fiscales avantageuses :{" "}
        <ArticleStrong>PEA</ArticleStrong> (actions, long terme),{" "}
        <ArticleStrong>assurance-vie</ArticleStrong> (capital garanti ou UC), voire
        PER (retraite).
      </p>

      <h3 className="font-display text-lg font-medium text-ink">La magie des intérêts composés</h3>
      <p>
        Albert Einstein aurait dit que les intérêts composés sont la{" "}
        <ArticleStrong>huitième merveille du monde</ArticleStrong>. Avec un rendement
        de 8 %, votre capital double en 9 ans (règle des 72). Sur 20 ans, 200 €/mois
        placés à 8 % donnent plus de 118 000 €, dont plus de 70 000 € d&apos;intérêts — pour
        seulement 48 000 € versés. C&apos;est l&apos;effet boule de neige.
      </p>

      <h3 className="font-display text-lg font-medium text-ink">Inflation : le rendement réel</h3>
      <p>
        Un livret à 2,4 % avec une inflation à 2,2 % ne rapporte que 0,2 % en termes
        réels. Pour{" "}
        <ArticleStrong>préserver et faire fructifier votre pouvoir d&apos;achat</ArticleStrong>,
        il faut dépasser l&apos;inflation. Sur longue période, seuls les actifs risqués
        (actions) y parviennent systématiquement.
      </p>

      <h3 className="font-display text-lg font-medium text-ink">Ce que ce simulateur ne prend pas en compte</h3>
      <p>
        Les simulations du PEA supposent un rendement historique constant de 8%/an,
        ce qui masque une{" "}
        <ArticleStrong>forte volatilité annuelle</ArticleStrong> (−30 % certaines
        années). Les taux des livrets réglementés peuvent changer deux fois par an. Les
        frais de gestion de l&apos;assurance-vie varient selon les contrats. Ce simulateur
        ne prend pas en compte le PER (Plan d&apos;Épargne Retraite), les SCPI, ni l&apos;immobilier.
      </p>
    </div>
  )
}
