import { CONSTANTES_2025, COTISATIONS_NON_CADRE, COTISATIONS_CADRE } from "@/lib/constantes"

export type StatutSalarie = "non-cadre" | "cadre"

export interface LigneCotisation {
  label: string
  taux: number
  base: number
  montant: number
}

export interface ResultatSalaire {
  brut: number
  netAvantImpot: number
  netApresImpot: number
  totalCotisations: number
  csgDeductible: number
  csgNonDeductibleCrds: number
  cotisationsRetraite: number
  cotisations: LigneCotisation[]
  coutEmployeur: number
  chargesPatronales: number
  tauxPrelevement: number
}

/**
 * Calcule le salaire net à partir du brut selon les barèmes URSSAF 2025.
 * @param brut salaire brut mensuel
 * @param statut "cadre" ou "non-cadre"
 * @param tempsPartiel pourcentage (100 = temps plein)
 * @param tauxPAS taux de prélèvement à la source en %
 * @param mutuelle part salariale mensuelle de la mutuelle obligatoire (€/mois)
 */
export function calculerSalaireNet(
  brut: number,
  statut: StatutSalarie,
  tempsPartiel: number = 100,
  tauxPAS: number = 0,
  mutuelle: number = 0
): ResultatSalaire {
  const brutEffectif = brut * (tempsPartiel / 100)
  const PMSS = CONSTANTES_2025.PMSS_MENSUEL

  // Tranches
  const T1 = Math.min(brutEffectif, PMSS)
  const T2 = Math.max(0, Math.min(brutEffectif, 8 * PMSS) - PMSS)

  const cotisationsConfig = statut === "cadre" ? COTISATIONS_CADRE : COTISATIONS_NON_CADRE

  const cotisations: LigneCotisation[] = []

  for (const [, c] of Object.entries(cotisationsConfig)) {
    let base: number
    if ("tranche" in c && c.tranche === "T1") {
      base = T1
    } else if ("tranche" in c && c.tranche === "T2") {
      base = T2
    } else if (c.plafond === 1) {
      base = T1
    } else {
      base = brutEffectif
    }
    const montant = base * c.taux
    cotisations.push({
      label: c.label,
      taux: c.taux,
      base,
      montant,
    })
  }

  // CSG / CRDS sur 98,25% du brut
  const assietteCsg = brutEffectif * CONSTANTES_2025.CSG_ASSIETTE
  const csgDeductible = assietteCsg * CONSTANTES_2025.CSG_DEDUCTIBLE
  const csgNonDeductibleCrds = assietteCsg * CONSTANTES_2025.CSG_NON_DEDUCTIBLE_CRDS

  cotisations.push({
    label: "CSG déductible",
    taux: CONSTANTES_2025.CSG_DEDUCTIBLE,
    base: assietteCsg,
    montant: csgDeductible,
  })
  cotisations.push({
    label: "CSG non déductible + CRDS",
    taux: CONSTANTES_2025.CSG_NON_DEDUCTIBLE_CRDS,
    base: assietteCsg,
    montant: csgNonDeductibleCrds,
  })

  // Mutuelle obligatoire (ANI 2016) — montant fixe en €
  if (mutuelle > 0) {
    cotisations.push({
      label: "Mutuelle santé (part salarié)",
      taux: 0,
      base: 0,
      montant: mutuelle,
    })
  }

  const totalCotisations = cotisations.reduce((s, c) => s + c.montant, 0)
  const cotisationsRetraite = cotisations
    .filter((c) => c.label.toLowerCase().includes("retraite"))
    .reduce((s, c) => s + c.montant, 0)

  const netAvantImpot = brutEffectif - totalCotisations
  const netApresImpot = netAvantImpot * (1 - tauxPAS / 100)

  // Charges patronales (estimation forfaitaire 42% du brut)
  const chargesPatronales = brutEffectif * 0.42
  const coutEmployeur = brutEffectif + chargesPatronales

  return {
    brut: brutEffectif,
    netAvantImpot,
    netApresImpot,
    totalCotisations,
    csgDeductible,
    csgNonDeductibleCrds,
    cotisationsRetraite,
    cotisations,
    coutEmployeur,
    chargesPatronales,
    tauxPrelevement: tauxPAS,
  }
}
