import { CONSTANTES_2025 } from "@/lib/constantes"

export type MotifRupture = "licenciement" | "rupture-conventionnelle" | "fin-cdd"

export interface ResultatChomage {
  eligible: boolean
  raisonNonEligible?: string
  sjr: number
  areJournaliere: number
  areMensuelle: number
  dureeIndemnisationMois: number
  totalEstime: number
  delaiCarenceJours: number
  degressivite: boolean
  formule1: number
  formule2: number
}

/**
 * Calcule l'ARE selon les règles Unédic 2025.
 * @param salaireBrut salaire mensuel brut moyen
 * @param dureeEmploiMois durée d'emploi en mois (sur les 24/36 derniers mois)
 * @param age âge du demandeur
 * @param motif motif de la rupture
 */
export function calculerARE(
  salaireBrut: number,
  dureeEmploiMois: number,
  age: number,
  motif: MotifRupture
): ResultatChomage {
  // Éligibilité : 6 mois minimum (130 jours) sur les 24 derniers mois, ou 36 si 53+
  const dureeMin = 6
  if (dureeEmploiMois < dureeMin) {
    return {
      eligible: false,
      raisonNonEligible: `Il faut au moins ${dureeMin} mois d'affiliation sur les ${age >= 53 ? 36 : 24} derniers mois.`,
      sjr: 0,
      areJournaliere: 0,
      areMensuelle: 0,
      dureeIndemnisationMois: 0,
      totalEstime: 0,
      delaiCarenceJours: 7,
      degressivite: false,
      formule1: 0,
      formule2: 0,
    }
  }

  // SJR : approximation simplifiée
  // Salaire de référence sur 12 mois ÷ jours travaillés (approx. 30,42 × ratio)
  const sjr = (salaireBrut / 30.42) * 0.9145

  // Formule 1 : partie fixe + 40% du SJR
  const formule1 = CONSTANTES_2025.ARE_PARTIE_FIXE + sjr * CONSTANTES_2025.ARE_TAUX_PROPORTIONNEL

  // Formule 2 : 57% du SJR
  const formule2 = sjr * CONSTANTES_2025.ARE_TAUX_SJR

  // ARE journalière = MAX, plafonné à 75% du SJR, plancher 28,86€
  let areJournaliere = Math.max(formule1, formule2, CONSTANTES_2025.ARE_PLANCHER_JOURNALIER)
  areJournaliere = Math.min(areJournaliere, sjr * CONSTANTES_2025.ARE_TAUX_MAX_SJR)

  const areMensuelle = areJournaliere * 30.42

  // Durée maximale selon l'âge
  const dureeMax = age < 53 ? 24 : age < 55 ? 30 : 36
  const dureeIndemnisationMois = Math.min(dureeEmploiMois, dureeMax)

  // Dégressivité (>= 57% × SJR × 30 et salaire de référence > 4537€/mois)
  const degressivite = salaireBrut > CONSTANTES_2025.ARE_DEGRESSIVITE_SEUIL_SALAIRE && age < 55

  // Total estimé (sans tenir compte de la dégressivité pour la simplicité)
  let totalEstime = areMensuelle * dureeIndemnisationMois
  if (degressivite && dureeIndemnisationMois > 6) {
    const moisAvant = 6
    const moisApres = dureeIndemnisationMois - 6
    totalEstime =
      areMensuelle * moisAvant +
      areMensuelle * (1 - CONSTANTES_2025.ARE_DEGRESSIVITE_TAUX) * moisApres
  }

  // Délai de carence : 7 jours systématiques
  // + délai d'attente selon indemnités (simplifié : 0 par défaut)
  let delaiCarenceJours = 7
  if (motif === "rupture-conventionnelle") {
    delaiCarenceJours = 7 // peut s'allonger selon indemnité supra-légale
  }

  return {
    eligible: true,
    sjr,
    areJournaliere,
    areMensuelle,
    dureeIndemnisationMois,
    totalEstime,
    delaiCarenceJours,
    degressivite,
    formule1,
    formule2,
  }
}
