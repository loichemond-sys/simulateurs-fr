import { CONSTANTES_2025 } from "@/lib/constantes"

// Trimestres requis pour taux plein selon l'année de naissance
// Source : art. L161-17-3 CSS (réforme 2023) + décrets antérieurs
export function getTrimestreRequis(anneeNaissance: number): number {
  if (anneeNaissance <= 1951) return 160
  if (anneeNaissance === 1952) return 164
  if (anneeNaissance <= 1954) return 165
  if (anneeNaissance <= 1957) return 166
  if (anneeNaissance <= 1960) return 167
  if (anneeNaissance <= 1963) return 168
  if (anneeNaissance === 1964) return 169
  if (anneeNaissance === 1965) return 170
  if (anneeNaissance === 1966) return 171
  return 172 // 1967 et après
}

// Âge légal de départ en années décimales (ex : 62,25 = 62 ans 3 mois)
// Réforme 2023 : montée progressive de 62 à 64 ans
export function getAgeLegalAns(anneeNaissance: number): number {
  if (anneeNaissance < 1961) return 62
  if (anneeNaissance === 1961) return 62 + 3 / 12
  if (anneeNaissance === 1962) return 62 + 6 / 12
  if (anneeNaissance === 1963) return 62 + 9 / 12
  if (anneeNaissance === 1964) return 63
  if (anneeNaissance === 1965) return 63 + 3 / 12
  if (anneeNaissance === 1966) return 63 + 6 / 12
  if (anneeNaissance === 1967) return 63 + 9 / 12
  return 64 // 1968+
}

export function formatAgeLegal(ageLegalAns: number): string {
  const ans = Math.floor(ageLegalAns)
  const mois = Math.round((ageLegalAns - ans) * 12)
  if (mois === 0) return `${ans} ans`
  return `${ans} ans ${mois} mois`
}

export interface ScenarioRetraite {
  age: number
  anneeDepart: number
  trimestresValides: number
  trimestresManquants: number
  tauxPlein: boolean
  taux: number        // décimal : 0.5 = 50%
  surcote: number     // décimal : 0.0125 = 1,25%
  decote: number      // décimal : 0.0125 = 1,25%
  prorata: number     // 0–1
  pensionBruteMensuelle: number
  pensionNetteMensuelle: number
}

export interface ResultatRetraite {
  anneeNaissance: number
  ageLegalAns: number
  ageLegalFormate: string
  trimestresRequis: number
  ageTauxPlein: number | null  // null si jamais atteint avant 67
  trimestresActuels: number
  scenarios: ScenarioRetraite[]
  scenarioAgeLegal: ScenarioRetraite
  scenarioOptimal: ScenarioRetraite
  scenario67: ScenarioRetraite
}

export function calculerRetraite(
  anneeNaissance: number,
  anneeDebutCarriere: number,
  salaireAnnuelMoyen: number
): ResultatRetraite {
  const ANNEE_ACTUELLE = new Date().getFullYear()
  const SAM = Math.min(salaireAnnuelMoyen, CONSTANTES_2025.PASS)
  const TAUX_PLEIN = 0.5
  const COEFF_DECOTE = 0.0125   // 1,25% par trimestre manquant
  const COEFF_SURCOTE = 0.0125  // 1,25% par trimestre supplémentaire
  const AGE_TAUX_AUTO = 67
  // CSG 8,3% + CRDS 0,5% + CASA 0,3% pour retraités au taux normal
  const PRELEVEMENTS_SOCIAUX = 0.091
  const MIN_CONTRIBUTIF_MENSUEL = 848 // pension minimale brute 2025 (carrière complète)

  const trimestresRequis = getTrimestreRequis(anneeNaissance)
  const ageLegalAns = getAgeLegalAns(anneeNaissance)
  const ageLegalFormate = formatAgeLegal(ageLegalAns)
  const debutEffectif = Math.max(anneeDebutCarriere, anneeNaissance + 16)
  const trimestresActuels = Math.max(0, (ANNEE_ACTUELLE - debutEffectif) * 4)

  const calcScenario = (age: number): ScenarioRetraite => {
    const anneeDepart = anneeNaissance + age
    const trimestresValides = Math.max(0, (anneeDepart - debutEffectif) * 4)
    const trimestresManquants = Math.max(0, trimestresRequis - trimestresValides)
    const tauxPlein = trimestresValides >= trimestresRequis || age >= AGE_TAUX_AUTO

    let taux: number
    let surcote = 0
    let decote = 0

    if (tauxPlein) {
      // Surcote : trimestres au-delà du nécessaire, uniquement avant 67 ans
      if (age < AGE_TAUX_AUTO && trimestresValides > trimestresRequis) {
        surcote = (trimestresValides - trimestresRequis) * COEFF_SURCOTE
      }
      taux = TAUX_PLEIN + surcote
    } else {
      // Décote : minimum des deux mesures (favorable à l'assuré), plafonné à 25
      const manqueParTrimestres = trimestresRequis - trimestresValides
      const manqueParAge = (AGE_TAUX_AUTO - age) * 4
      const trimestresDecote = Math.min(Math.min(manqueParTrimestres, manqueParAge), 25)
      decote = trimestresDecote * COEFF_DECOTE
      taux = TAUX_PLEIN - decote
    }

    const prorata = Math.min(trimestresValides, trimestresRequis) / trimestresRequis
    const pensionBruteMensuelle = Math.max(
      (SAM * taux * prorata) / 12,
      prorata >= 1 ? MIN_CONTRIBUTIF_MENSUEL : 0
    )
    const pensionNetteMensuelle = pensionBruteMensuelle * (1 - PRELEVEMENTS_SOCIAUX)

    return {
      age,
      anneeDepart,
      trimestresValides,
      trimestresManquants,
      tauxPlein,
      taux,
      surcote,
      decote,
      prorata,
      pensionBruteMensuelle,
      pensionNetteMensuelle,
    }
  }

  const ageDebutScenarios = Math.ceil(ageLegalAns)
  const scenarios: ScenarioRetraite[] = []
  for (let age = ageDebutScenarios; age <= 70; age++) {
    scenarios.push(calcScenario(age))
  }

  const scenarioAgeLegal = calcScenario(ageDebutScenarios)
  const scenario67 = calcScenario(67)

  // Optimal = premier âge avec taux plein ET prorata = 1 (aucune pénalité)
  const optimal = scenarios.find(s => s.tauxPlein && s.prorata >= 1) ?? scenario67
  const ageTauxPlein = optimal.age < 67 ? optimal.age : null

  return {
    anneeNaissance,
    ageLegalAns,
    ageLegalFormate,
    trimestresRequis,
    ageTauxPlein,
    trimestresActuels,
    scenarios,
    scenarioAgeLegal,
    scenarioOptimal: optimal,
    scenario67,
  }
}
