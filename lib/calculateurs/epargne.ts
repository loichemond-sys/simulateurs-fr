// Taux en vigueur au 10 mai 2026
export interface ProduitEpargne {
  id: string
  nom: string
  description: string
  tauxAnnuelNet: number   // taux net effectif utilisé pour les calculs
  tauxAfficheLabel: string // ex : "3,5 % net" ou "8 % brut (~6,6 % net)"
  fiscalite: string
  liquidite: "immédiate" | "moyen-terme" | "long-terme"
  plafondVersements: number | null  // plafond sur les dépôts (hors intérêts)
  risque: "aucun" | "faible" | "élevé"
  eligible?: string        // condition d'éligibilité si applicable
}

export const PRODUITS: ProduitEpargne[] = [
  {
    id: "livret-a",
    nom: "Livret A",
    description: "Épargne de précaution, sans risque, disponible immédiatement",
    tauxAnnuelNet: 0.024,
    tauxAfficheLabel: "2,4 % net",
    fiscalite: "Totalement exonéré d'impôt et de prélèvements sociaux",
    liquidite: "immédiate",
    plafondVersements: 22_950,
    risque: "aucun",
  },
  {
    id: "lep",
    nom: "LEP",
    description: "Meilleur taux réglementé, sous conditions de revenus",
    tauxAnnuelNet: 0.035,
    tauxAfficheLabel: "3,5 % net",
    fiscalite: "Totalement exonéré d'impôt et de prélèvements sociaux",
    liquidite: "immédiate",
    plafondVersements: 10_000,
    risque: "aucun",
    eligible: "Revenus ≤ 21 393 €/an (1 part fiscale)",
  },
  {
    id: "assurance-vie",
    nom: "Assurance-vie fonds €",
    description: "Capital garanti, fiscalité avantageuse après 8 ans",
    tauxAnnuelNet: 0.027,  // ~3% brut - 17,2% PS - ~0,6% frais gestion = ~2,7% net
    tauxAfficheLabel: "~2,7 % net (après frais et PS)",
    fiscalite: "Prélèvements sociaux 17,2 % annuels. Après 8 ans : abattement 4 600 €/an, PFU réduit à 7,5 %",
    liquidite: "moyen-terme",
    plafondVersements: null,
    risque: "aucun",
  },
  {
    id: "pel",
    nom: "PEL (ouvert depuis 2024)",
    description: "Épargne logement, taux fixe à l'ouverture",
    tauxAnnuelNet: 0.01575,  // 2,25 % brut × (1 - 0,30 PFU)
    tauxAfficheLabel: "2,25 % brut → 1,575 % net PFU",
    fiscalite: "PFU 30 % (IR 12,8 % + PS 17,2 %) prélevé chaque année",
    liquidite: "moyen-terme",
    plafondVersements: 61_200,
    risque: "aucun",
  },
  {
    id: "pea",
    nom: "PEA — ETF monde",
    description: "Actions mondiales, rendement élevé sur le long terme, risque de perte en capital",
    tauxAnnuelNet: 0.066,  // 8 % historique × (1 - 17,2 % PS) après 5 ans
    tauxAfficheLabel: "~8 % brut (~6,6 % net après PS) — variable",
    fiscalite: "Après 5 ans : PS 17,2 % uniquement (exonéré d'IR). Avant 5 ans : PFU 30 %",
    liquidite: "long-terme",
    plafondVersements: 150_000,
    risque: "élevé",
  },
]

export interface PointHistorique {
  annee: number
  capital: number
  totalVerse: number
  interets: number
}

export interface ResultatProduit {
  produit: ProduitEpargne
  capitalFinal: number
  totalVerse: number
  interetsGeneres: number
  plafondAtteint: boolean
  historique: PointHistorique[]
}

export interface ResultatEpargne {
  capitalInitial: number
  versementMensuel: number
  dureeAns: number
  totalVerse: number
  resultats: ResultatProduit[]   // trié du meilleur au moins bon
}

function simuler(
  capitalInitial: number,
  versementMensuel: number,
  tauxAnnuelNet: number,
  dureeAns: number,
  plafondVersements: number | null
): { capitalFinal: number; totalVerse: number; plafondAtteint: boolean; historique: PointHistorique[] } {
  const rMensuel = tauxAnnuelNet / 12
  let capital = capitalInitial
  let totalVerse = capitalInitial
  let plafondAtteint = false
  const historique: PointHistorique[] = []

  for (let mois = 1; mois <= dureeAns * 12; mois++) {
    // Intérêts du mois (capitalisés mensuellement)
    capital *= 1 + rMensuel

    // Versement si plafond non atteint
    if (!plafondAtteint) {
      const versement =
        plafondVersements !== null
          ? Math.min(versementMensuel, Math.max(0, plafondVersements - totalVerse))
          : versementMensuel
      capital += versement
      totalVerse += versement
      if (plafondVersements !== null && totalVerse >= plafondVersements) {
        plafondAtteint = true
      }
    }

    if (mois % 12 === 0) {
      historique.push({
        annee: mois / 12,
        capital,
        totalVerse,
        interets: capital - totalVerse,
      })
    }
  }

  return { capitalFinal: capital, totalVerse, plafondAtteint, historique }
}

export function calculerEpargne(
  capitalInitial: number,
  versementMensuel: number,
  dureeAns: number
): ResultatEpargne {
  const resultats: ResultatProduit[] = PRODUITS.map((produit) => {
    const { capitalFinal, totalVerse, plafondAtteint, historique } = simuler(
      capitalInitial,
      versementMensuel,
      produit.tauxAnnuelNet,
      dureeAns,
      produit.plafondVersements
    )
    return {
      produit,
      capitalFinal,
      totalVerse,
      interetsGeneres: capitalFinal - totalVerse,
      plafondAtteint,
      historique,
    }
  })

  // Tri du meilleur au moins bon (capital final décroissant)
  resultats.sort((a, b) => b.capitalFinal - a.capitalFinal)

  const refResult = resultats.find((r) => r.produit.id === "livret-a")
  const totalVerse = refResult?.totalVerse ?? capitalInitial + versementMensuel * 12 * dureeAns

  return { capitalInitial, versementMensuel, dureeAns, totalVerse, resultats }
}
