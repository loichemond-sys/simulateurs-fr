import { CONSTANTES_2025 } from "@/lib/constantes"

export type SituationFamiliale = "celibataire" | "marie" | "divorce-veuf"

export interface ResultatImpot {
  revenuNetImposable: number
  abattementFraisPro: number
  revenuImposable: number
  parts: number
  quotientFamilial: number
  impotBrut: number
  decote: number
  impotNet: number
  tauxMoyen: number
  tauxMarginal: number
  mensualitePAS: number
  detailsTranches: { min: number; max: number; taux: number; montantTranche: number }[]
}

/**
 * Calcule le nombre de parts fiscales selon la situation et les enfants.
 * 1ʳᵉ et 2ᵉ : 0,5 part chacun
 * À partir du 3ᵉ : 1 part chacun
 * Parent isolé : 0,5 part supplémentaire
 */
export function calculerParts(situation: SituationFamiliale, nbEnfants: number, parentIsole: boolean = false): number {
  let parts = situation === "marie" ? 2 : 1

  // Enfants
  if (nbEnfants <= 2) {
    parts += nbEnfants * 0.5
  } else {
    parts += 1 + (nbEnfants - 2) * 1
  }

  // Parent isolé : 0.5 part supplémentaire
  if (parentIsole && situation !== "marie" && nbEnfants > 0) {
    parts += 0.5
  }

  return parts
}

/**
 * Calcule l'impôt sur le revenu 2026 (revenus 2025).
 * @param revenuNetSalarie revenu net imposable
 * @param parts nombre de parts du foyer fiscal
 * @param appliquerFraisPro applique l'abattement 10% frais pro (par défaut true).
 *        À mettre à false pour les revenus BNC/BIC déjà abattus (microentreprise).
 */
export function calculerIR(
  revenuNetSalarie: number,
  parts: number,
  appliquerFraisPro: boolean = true
): ResultatImpot {
  // 1. Abattement 10% frais pro (min 509€, max 14 555€ par personne)
  // Uniquement pour les salaires et pensions
  const abattementFraisPro = appliquerFraisPro
    ? Math.min(
        Math.max(revenuNetSalarie * CONSTANTES_2025.ABATTEMENT_FRAIS_PRO_TAUX, CONSTANTES_2025.ABATTEMENT_FRAIS_PRO_MIN),
        CONSTANTES_2025.ABATTEMENT_FRAIS_PRO_MAX
      )
    : 0
  const revenuImposable = Math.max(0, revenuNetSalarie - abattementFraisPro)

  // 2. Quotient familial
  const quotientFamilial = revenuImposable / parts

  // 3. Calcul de l'impôt par part
  let impotParPart = 0
  const detailsTranches: ResultatImpot["detailsTranches"] = []
  let tauxMarginal = 0

  for (const tranche of CONSTANTES_2025.TRANCHES_IR) {
    if (quotientFamilial > tranche.min) {
      const baseTranche = Math.min(quotientFamilial, tranche.max) - tranche.min
      const montantTranche = baseTranche * tranche.taux
      impotParPart += montantTranche
      detailsTranches.push({
        min: tranche.min,
        max: tranche.max,
        taux: tranche.taux,
        montantTranche: montantTranche * parts,
      })
      if (tranche.taux > 0) tauxMarginal = tranche.taux
    }
  }

  // 4. Impôt brut total
  const impotBrut = impotParPart * parts

  // 5. Décote (si impôt brut < seuil)
  const seuilDecote = parts === 1
    ? CONSTANTES_2025.DECOTE_SEUIL_CELIBATAIRE
    : CONSTANTES_2025.DECOTE_SEUIL_COUPLE
  const baseDecote = parts === 1
    ? CONSTANTES_2025.DECOTE_BASE_CELIBATAIRE
    : CONSTANTES_2025.DECOTE_BASE_COUPLE

  const decote = impotBrut < seuilDecote && impotBrut > 0
    ? Math.max(0, baseDecote - CONSTANTES_2025.DECOTE_TAUX * impotBrut)
    : 0

  const impotNet = Math.max(0, impotBrut - decote)
  const tauxMoyen = revenuNetSalarie > 0 ? (impotNet / revenuNetSalarie) * 100 : 0
  const mensualitePAS = impotNet / 12

  return {
    revenuNetImposable: revenuNetSalarie,
    abattementFraisPro,
    revenuImposable,
    parts,
    quotientFamilial,
    impotBrut,
    decote,
    impotNet,
    tauxMoyen: +tauxMoyen.toFixed(2),
    tauxMarginal: tauxMarginal * 100,
    mensualitePAS,
    detailsTranches,
  }
}
