import { CONSTANTES_2025 } from "@/lib/constantes"
import { calculerIR } from "./impot"

export type StatutFreelance = "auto-entrepreneur" | "eurl" | "sasu" | "portage"
export type SecteurAE = "services" | "commerce" | "artisan"

export interface ResultatStatut {
  statut: StatutFreelance
  caHTAnnuel: number
  caHTMensuel: number
  cotisations: number
  fraisGestion: number
  impot: number
  netMensuel: number
  netAnnuel: number
  ratioNetCA: number // % du CA qui finit en net
  protectionSociale: "Faible" | "Bonne" | "Très bonne" | "Excellente"
  details: string
}

function abattementAE(secteur: SecteurAE): number {
  if (secteur === "commerce") return CONSTANTES_2025.AE_ABATTEMENT_COMMERCE
  return CONSTANTES_2025.AE_ABATTEMENT_SERVICES
}

function tauxCotisationsAE(secteur: SecteurAE, acre: boolean = false): number {
  if (acre) {
    if (secteur === "commerce") return CONSTANTES_2025.ACRE_TAUX_COMMERCE
    if (secteur === "artisan") return CONSTANTES_2025.ACRE_TAUX_ARTISAN
    return CONSTANTES_2025.ACRE_TAUX_SERVICES
  }
  if (secteur === "commerce") return CONSTANTES_2025.AE_TAUX_COMMERCE
  if (secteur === "artisan") return CONSTANTES_2025.AE_TAUX_ARTISAN
  return CONSTANTES_2025.AE_TAUX_SERVICES
}

export function calculerAutoEntrepreneur(
  caHTMensuel: number,
  secteur: SecteurAE = "services",
  parts: number = 1,
  acre: boolean = false
): ResultatStatut {
  const caHTAnnuel = caHTMensuel * 12
  const taux = tauxCotisationsAE(secteur, acre)
  const cotisations = caHTAnnuel * taux

  const abat = abattementAE(secteur)
  const revenusImposables = caHTAnnuel * (1 - abat)

  // Microentreprise : abattement déjà appliqué, ne pas réappliquer le 10% frais pro
  const ir = calculerIR(revenusImposables, parts, false).impotNet

  const netAnnuel = caHTAnnuel - cotisations - ir
  const netMensuel = netAnnuel / 12

  return {
    statut: "auto-entrepreneur",
    caHTAnnuel,
    caHTMensuel,
    cotisations,
    fraisGestion: 0,
    impot: ir,
    netMensuel,
    netAnnuel,
    ratioNetCA: caHTAnnuel > 0 ? netAnnuel / caHTAnnuel : 0,
    protectionSociale: "Faible",
    details: acre
      ? `ACRE : cotisations ${(taux * 100).toFixed(1)}% (50% de réduction) + IR avec abattement ${(abat * 100).toFixed(0)}%`
      : `Cotisations ${(taux * 100).toFixed(1)}% + IR avec abattement ${(abat * 100).toFixed(0)}%`,
  }
}

/**
 * Stratégie de rémunération en société :
 * - "salaire" : 100% en rémunération du dirigeant
 * - "mixte" : 50% rémunération + 50% dividendes (après IS)
 * - "dividendes" : minimum légal en rémunération + max en dividendes
 * Choix fiscalité dividendes : PFU 30% (flat tax) ou barème IR.
 */
export type StrategieRemu = "salaire" | "mixte" | "dividendes"
export type FiscaliteDividendes = "pfu" | "bareme"

function calculerIS(benefice: number): number {
  // IS 2025 : 15% jusqu'à 42 500 €, 25% au-delà
  if (benefice <= 0) return 0
  const tranche1 = Math.min(benefice, CONSTANTES_2025.IS_PLAFOND_REDUIT)
  const tranche2 = Math.max(0, benefice - CONSTANTES_2025.IS_PLAFOND_REDUIT)
  return tranche1 * CONSTANTES_2025.IS_TAUX_REDUIT + tranche2 * CONSTANTES_2025.IS_TAUX_NORMAL
}

function fiscaliserDividendes(
  dividendesBruts: number,
  fiscalite: FiscaliteDividendes,
  parts: number,
  autresRevenus: number
): { netDividendes: number; impotDividendes: number } {
  if (dividendesBruts <= 0) return { netDividendes: 0, impotDividendes: 0 }
  if (fiscalite === "pfu") {
    // Flat tax 30% (12,8% IR + 17,2% PS)
    const impot = dividendesBruts * CONSTANTES_2025.PFU
    return { netDividendes: dividendesBruts - impot, impotDividendes: impot }
  }
  // Barème : abattement 40% + intégration au barème + 17,2% prélèvements sociaux
  const ps = dividendesBruts * 0.172
  const dividendesAprèsAbattement = dividendesBruts * 0.6 // 40% d'abattement
  // CSG déductible 6,8%
  const csgDeductible = dividendesBruts * 0.068
  const baseImposable = autresRevenus + dividendesAprèsAbattement - csgDeductible
  const irSansDividendes = calculerIR(autresRevenus, parts).impotNet
  const irAvecDividendes = calculerIR(baseImposable, parts).impotNet
  const irMarginal = Math.max(0, irAvecDividendes - irSansDividendes)
  const impot = irMarginal + ps
  return { netDividendes: dividendesBruts - impot, impotDividendes: impot }
}

export function calculerEURL(
  caHTMensuel: number,
  parts: number = 1,
  strategie: StrategieRemu = "salaire",
  fiscaliteDiv: FiscaliteDividendes = "pfu"
): ResultatStatut {
  const caHTAnnuel = caHTMensuel * 12
  const margeOperationnelle = caHTAnnuel * 0.85 // dépenses / frais ~15%

  let ratioRemu: number
  if (strategie === "salaire") ratioRemu = 1
  else if (strategie === "mixte") ratioRemu = 0.5
  else ratioRemu = 0.2 // minimum recommandé pour valider 4 trimestres retraite

  // Coût total de la rémunération côté entreprise = net + cotisations TNS
  // Cotisations TNS = net × 45% → coût total = net × 1.45
  const coutTotalRemu = margeOperationnelle * ratioRemu
  const remunerationNette = coutTotalRemu / (1 + CONSTANTES_2025.EURL_TAUX_CHARGES_TNS)
  const cotisationsTNS = coutTotalRemu - remunerationNette

  const ir = calculerIR(remunerationNette, parts).impotNet

  // Bénéfice après rémunération (le coût total est déductible) → IS
  const beneficeAvantIS = margeOperationnelle - coutTotalRemu
  const is = calculerIS(Math.max(0, beneficeAvantIS))
  const dividendesBruts = Math.max(0, beneficeAvantIS - is)
  const { netDividendes, impotDividendes } = fiscaliserDividendes(
    dividendesBruts,
    fiscaliteDiv,
    parts,
    remunerationNette
  )

  const netAnnuel = remunerationNette - ir + netDividendes
  const netMensuel = netAnnuel / 12

  const labelsStrat = {
    salaire: "100% rémunération",
    mixte: "50% rému + 50% dividendes",
    dividendes: "Min rému + max dividendes",
  }
  const labelsFisc = { pfu: "PFU 30%", bareme: "barème IR" }

  return {
    statut: "eurl",
    caHTAnnuel,
    caHTMensuel,
    cotisations: cotisationsTNS,
    fraisGestion: caHTAnnuel * 0.15,
    impot: ir + is + impotDividendes,
    netMensuel,
    netAnnuel,
    ratioNetCA: caHTAnnuel > 0 ? netAnnuel / caHTAnnuel : 0,
    protectionSociale: "Bonne",
    details:
      strategie === "salaire"
        ? "Charges TNS ~45% du revenu net + IR au barème"
        : `${labelsStrat[strategie]} (${labelsFisc[fiscaliteDiv]} sur dividendes)`,
  }
}

export function calculerSASU(
  caHTMensuel: number,
  parts: number = 1,
  strategie: StrategieRemu = "salaire",
  fiscaliteDiv: FiscaliteDividendes = "pfu"
): ResultatStatut {
  const caHTAnnuel = caHTMensuel * 12
  const margeOperationnelle = caHTAnnuel * 0.85

  let ratioRemu: number
  if (strategie === "salaire") ratioRemu = 1
  else if (strategie === "mixte") ratioRemu = 0.5
  else ratioRemu = 0.15 // SMIC minimum pour valider trimestres assimilé-salarié

  // Coût total de la rémunération salariée = brut × 1.45 (charges patronales 45%)
  // Pour utiliser margeOperationnelle × ratioRemu en coût total :
  const coutTotalRemu = margeOperationnelle * ratioRemu
  const brutAjuste = coutTotalRemu / 1.45
  const chargesPatronales = brutAjuste * 0.45
  const chargesSalariales = brutAjuste * 0.22
  const cotisationsTotales = chargesPatronales + chargesSalariales

  const netImposable = brutAjuste - chargesSalariales
  const ir = calculerIR(netImposable, parts).impotNet

  // Bénéfice après rémunération (le coût total est déductible) → IS
  const beneficeAvantIS = margeOperationnelle - coutTotalRemu
  const is = calculerIS(Math.max(0, beneficeAvantIS))
  const dividendesBruts = Math.max(0, beneficeAvantIS - is)
  const { netDividendes, impotDividendes } = fiscaliserDividendes(
    dividendesBruts,
    fiscaliteDiv,
    parts,
    netImposable
  )

  const netAnnuel = netImposable - ir + netDividendes
  const netMensuel = netAnnuel / 12

  const labelsStrat = {
    salaire: "100% salaire",
    mixte: "50% salaire + 50% dividendes",
    dividendes: "Min salaire + max dividendes",
  }
  const labelsFisc = { pfu: "PFU 30%", bareme: "barème IR" }

  return {
    statut: "sasu",
    caHTAnnuel,
    caHTMensuel,
    cotisations: cotisationsTotales,
    fraisGestion: caHTAnnuel * 0.15,
    impot: ir + is + impotDividendes,
    netMensuel,
    netAnnuel,
    ratioNetCA: caHTAnnuel > 0 ? netAnnuel / caHTAnnuel : 0,
    protectionSociale: "Très bonne",
    details:
      strategie === "salaire"
        ? "Charges patronales + salariales ~65-67% du brut + IR"
        : `${labelsStrat[strategie]} (${labelsFisc[fiscaliteDiv]} sur dividendes)`,
  }
}

export function calculerPortage(caHTMensuel: number, parts: number = 1): ResultatStatut {
  const caHTAnnuel = caHTMensuel * 12

  const fraisGestion = caHTAnnuel * CONSTANTES_2025.PORTAGE_FRAIS_GESTION
  const apresGestion = caHTAnnuel - fraisGestion

  const brutAjuste = apresGestion / 1.45
  const chargesPatronales = brutAjuste * 0.45
  const chargesSalariales = brutAjuste * 0.22
  const cotisationsTotales = chargesPatronales + chargesSalariales

  const netImposable = brutAjuste - chargesSalariales
  const ir = calculerIR(netImposable, parts).impotNet

  const netAnnuel = netImposable - ir
  const netMensuel = netAnnuel / 12

  return {
    statut: "portage",
    caHTAnnuel,
    caHTMensuel,
    cotisations: cotisationsTotales,
    fraisGestion,
    impot: ir,
    netMensuel,
    netAnnuel,
    ratioNetCA: caHTAnnuel > 0 ? netAnnuel / caHTAnnuel : 0,
    protectionSociale: "Excellente",
    details: `Frais gestion ${(CONSTANTES_2025.PORTAGE_FRAIS_GESTION * 100).toFixed(1)}% + charges salariées + IR`,
  }
}

export interface ParametresFreelance {
  tjm: number
  joursParMois: number
  statut: StatutFreelance
  secteur: SecteurAE
  parts?: number
  acre?: boolean
  strategie?: StrategieRemu
  fiscaliteDividendes?: FiscaliteDividendes
}

/**
 * Calcule les 4 statuts en parallèle pour comparaison.
 */
export function comparerStatuts(params: ParametresFreelance): ResultatStatut[] {
  const ca = params.tjm * params.joursParMois
  const parts = params.parts ?? 1
  const strategie = params.strategie ?? "salaire"
  const fisc = params.fiscaliteDividendes ?? "pfu"
  return [
    calculerAutoEntrepreneur(ca, params.secteur, parts, params.acre ?? false),
    calculerEURL(ca, parts, strategie, fisc),
    calculerSASU(ca, parts, strategie, fisc),
    calculerPortage(ca, parts),
  ]
}

/**
 * Calcule le TJM minimum nécessaire pour atteindre un objectif net mensuel.
 */
export function tjmMinimum(
  objectifNetMensuel: number,
  joursParMois: number,
  statut: StatutFreelance,
  secteur: SecteurAE = "services"
): number {
  // Recherche dichotomique simple
  let lo = 50
  let hi = 5000
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2
    const ca = mid * joursParMois
    let resultat: ResultatStatut
    if (statut === "auto-entrepreneur") resultat = calculerAutoEntrepreneur(ca, secteur)
    else if (statut === "eurl") resultat = calculerEURL(ca)
    else if (statut === "sasu") resultat = calculerSASU(ca)
    else resultat = calculerPortage(ca)

    if (resultat.netMensuel < objectifNetMensuel) lo = mid
    else hi = mid
  }
  return Math.round(hi)
}
