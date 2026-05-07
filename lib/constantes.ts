export const CONSTANTES_2025 = {
  // Sécurité sociale
  PMSS_MENSUEL: 3_925,
  PMSS_ANNUEL: 47_100,
  PASS: 48_060,

  // Salaires
  SMIC_BRUT_MENSUEL: 1_802.25,
  SMIC_HORAIRE: 11.88,

  // Chômage
  ARE_PLANCHER_JOURNALIER: 28.86,
  ARE_PARTIE_FIXE: 12.95,
  ARE_TAUX_PROPORTIONNEL: 0.40,
  ARE_TAUX_SJR: 0.57,
  ARE_TAUX_MAX_SJR: 0.75,
  ARE_DEGRESSIVITE_SEUIL_SALAIRE: 4_537,
  ARE_DEGRESSIVITE_TAUX: 0.30,
  ARE_DEGRESSIVITE_DELAI_MOIS: 6,

  // Licenciement
  INDEMNITE_TRANCHE1_COEFF: 1 / 4,
  INDEMNITE_TRANCHE2_COEFF: 1 / 3,
  ANCIENNETE_MIN_MOIS: 8,

  // Impôt sur le revenu 2026 (revenus 2025)
  TRANCHES_IR: [
    { min: 0, max: 11_600, taux: 0 },
    { min: 11_600, max: 29_579, taux: 0.11 },
    { min: 29_579, max: 84_577, taux: 0.30 },
    { min: 84_577, max: 181_917, taux: 0.41 },
    { min: 181_917, max: Infinity, taux: 0.45 },
  ],
  ABATTEMENT_FRAIS_PRO_TAUX: 0.10,
  ABATTEMENT_FRAIS_PRO_MIN: 509,
  ABATTEMENT_FRAIS_PRO_MAX: 14_555,
  DECOTE_SEUIL_CELIBATAIRE: 1_982,
  DECOTE_SEUIL_COUPLE: 3_277,
  DECOTE_BASE_CELIBATAIRE: 897,
  DECOTE_BASE_COUPLE: 1_483,
  DECOTE_TAUX: 0.4525,

  // Freelance — Auto-entrepreneur 2025
  AE_TAUX_SERVICES: 0.212,
  AE_TAUX_COMMERCE: 0.123,
  AE_TAUX_ARTISAN: 0.212,

  // ACRE : exonération de 50% des cotisations pendant les 4 premiers trimestres civils
  // Source : Décret n°2019-1215 du 21 nov. 2019, art. L131-6-4 CSS
  ACRE_TAUX_REDUCTION: 0.5,
  ACRE_DUREE_TRIMESTRES: 4,
  ACRE_TAUX_SERVICES: 0.106, // 21,2% × 50%
  ACRE_TAUX_COMMERCE: 0.0615, // 12,3% × 50%
  ACRE_TAUX_ARTISAN: 0.106,
  AE_PLAFOND_CA_SERVICES: 77_700,
  AE_PLAFOND_CA_COMMERCE: 188_700,
  AE_ABATTEMENT_SERVICES: 0.34,
  AE_ABATTEMENT_COMMERCE: 0.50,
  AE_ABATTEMENT_ARTISAN: 0.34,

  // EURL / SASU / Portage (estimations)
  EURL_TAUX_CHARGES_TNS: 0.45,
  SASU_TAUX_CHARGES: 0.65, // patronales + salariales sur brut
  SASU_RATIO_BRUT_NET: 0.55, // approximatif
  PORTAGE_FRAIS_GESTION: 0.085, // 8.5% médian
  PORTAGE_TAUX_CHARGES: 0.48, // sur le salaire brut après frais

  // IS
  IS_TAUX_REDUIT: 0.15,
  IS_PLAFOND_REDUIT: 42_500,
  IS_TAUX_NORMAL: 0.25,

  // PFU (flat tax)
  PFU: 0.30,

  // CSG/CRDS
  CSG_DEDUCTIBLE: 0.068,
  CSG_NON_DEDUCTIBLE_CRDS: 0.029,
  CSG_ASSIETTE: 0.9825, // 98,25% du brut
} as const

// Cotisations salariales NON-CADRE
export const COTISATIONS_NON_CADRE = {
  vieillesse_plafonnee: { taux: 0.069, plafond: 1, label: "Retraite Sécurité sociale (plafonnée)" },
  vieillesse_deplafonnee: { taux: 0.004, plafond: null, label: "Retraite Sécurité sociale (déplafonnée)" },
  retraite_compl_t1: { taux: 0.0315, plafond: 1, tranche: "T1", label: "Retraite complémentaire (T1)" },
  retraite_compl_t2: { taux: 0.0864, plafond: 8, tranche: "T2", label: "Retraite complémentaire (T2)" },
  ceg_t1: { taux: 0.0086, plafond: 1, tranche: "T1", label: "Contribution équilibre général (T1)" },
  ceg_t2: { taux: 0.0108, plafond: 8, tranche: "T2", label: "Contribution équilibre général (T2)" },
} as const

// Cotisations salariales CADRE
export const COTISATIONS_CADRE = {
  vieillesse_plafonnee: { taux: 0.069, plafond: 1, label: "Retraite Sécurité sociale (plafonnée)" },
  vieillesse_deplafonnee: { taux: 0.004, plafond: null, label: "Retraite Sécurité sociale (déplafonnée)" },
  retraite_compl_t1: { taux: 0.0401, plafond: 1, tranche: "T1", label: "Retraite complémentaire (T1)" },
  retraite_compl_t2: { taux: 0.0972, plafond: 8, tranche: "T2", label: "Retraite complémentaire (T2)" },
  ceg_t1: { taux: 0.0108, plafond: 1, tranche: "T1", label: "Contribution équilibre général (T1)" },
  ceg_t2: { taux: 0.0136, plafond: 8, tranche: "T2", label: "Contribution équilibre général (T2)" },
  cet: { taux: 0.0014, plafond: 8, tranche: "T2", label: "Contribution équilibre technique (CET)" },
} as const
