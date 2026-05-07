import { CONSTANTES_2025 } from "@/lib/constantes"

export type TypeRupture = "licenciement-personnel" | "licenciement-economique" | "rupture-conventionnelle"

export interface ResultatLicenciement {
  eligible: boolean
  raisonNonEligible?: string
  ancienneteAnnees: number
  salaireReference: number
  indemniteLegale: number
  indemniteRupture: number // pour rupture conventionnelle = indemnité plancher = légale
  exonerationCotisations: number // plafond
  exonerationIR: number // plafond
  delaiCarenceAREJours: number
  details: { tranche1: number; tranche2: number }
}

/**
 * Calcule l'indemnité légale de licenciement / rupture selon Code du travail
 * Article R1234-2.
 */
export function calculerIndemnite(
  type: TypeRupture,
  salaireRefMoyen12: number,
  salaireRefMoyen3: number | null,
  annees: number,
  mois: number
): ResultatLicenciement {
  const ancienneteTotaleMois = annees * 12 + mois
  const ancienneteAnnees = ancienneteTotaleMois / 12

  // Ancienneté minimale : 8 mois (sauf cas particuliers)
  if (ancienneteTotaleMois < CONSTANTES_2025.ANCIENNETE_MIN_MOIS) {
    return {
      eligible: false,
      raisonNonEligible: `Pour avoir droit à l'indemnité légale, il faut au moins ${CONSTANTES_2025.ANCIENNETE_MIN_MOIS} mois d'ancienneté.`,
      ancienneteAnnees,
      salaireReference: 0,
      indemniteLegale: 0,
      indemniteRupture: 0,
      exonerationCotisations: 0,
      exonerationIR: 0,
      delaiCarenceAREJours: 0,
      details: { tranche1: 0, tranche2: 0 },
    }
  }

  // Salaire de référence = max(moyenne 12 mois, moyenne 3 mois)
  const salaireReference = salaireRefMoyen3 !== null
    ? Math.max(salaireRefMoyen12, salaireRefMoyen3)
    : salaireRefMoyen12

  // Calcul par tranches
  const ancienneteJusqua10 = Math.min(ancienneteAnnees, 10)
  const ancienneteAuDela10 = Math.max(0, ancienneteAnnees - 10)

  const tranche1 = ancienneteJusqua10 * salaireReference * CONSTANTES_2025.INDEMNITE_TRANCHE1_COEFF
  const tranche2 = ancienneteAuDela10 * salaireReference * CONSTANTES_2025.INDEMNITE_TRANCHE2_COEFF

  const indemniteLegale = tranche1 + tranche2

  // L'indemnité de rupture conventionnelle ne peut être inférieure à l'indemnité légale
  const indemniteRupture = indemniteLegale

  // Exonération cotisations sociales : limite 2 PASS
  const exonerationCotisations = 2 * CONSTANTES_2025.PASS

  // Exonération IR : dans la limite du montant légal
  const exonerationIR = indemniteLegale

  // Délai de carence ARE : indemnités supra-légales / 92.5 (plafond 150 jours)
  // Ici on calcule pour l'indemnité légale = pas de carence supplémentaire
  const delaiCarenceAREJours = 0

  return {
    eligible: true,
    ancienneteAnnees,
    salaireReference,
    indemniteLegale,
    indemniteRupture,
    exonerationCotisations,
    exonerationIR,
    delaiCarenceAREJours,
    details: { tranche1, tranche2 },
  }
}

/**
 * Calcule le délai de carence ARE en fonction d'une indemnité supra-légale.
 */
export function calculerCarenceARE(indemniteSupraLegale: number): number {
  if (indemniteSupraLegale <= 0) return 0
  const delai = indemniteSupraLegale / 92.5
  return Math.min(Math.round(delai), 150)
}
