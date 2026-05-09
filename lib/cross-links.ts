/**
 * Liens entre simulateurs avec passage de paramètres via querystring.
 * Permet de pré-remplir un simulateur à partir des résultats d'un autre,
 * et rend les URL partageables.
 */

export type RawParams = Record<string, string | string[] | undefined>

export function num(params: RawParams, key: string, defaultValue: number): number {
  const v = params[key]
  if (typeof v !== "string") return defaultValue
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : defaultValue
}

export function bool(params: RawParams, key: string, defaultValue: boolean): boolean {
  const v = params[key]
  if (typeof v !== "string") return defaultValue
  return v === "1" || v.toLowerCase() === "true"
}

export function str<T extends string>(
  params: RawParams,
  key: string,
  allowed: readonly T[],
  defaultValue: T
): T {
  const v = params[key]
  if (typeof v !== "string") return defaultValue
  return (allowed as readonly string[]).includes(v) ? (v as T) : defaultValue
}

function build(path: string, params: Record<string, string | number | boolean | undefined>): string {
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === "" || v === false) continue
    if (typeof v === "boolean") sp.set(k, "1")
    else sp.set(k, String(v))
  }
  const qs = sp.toString()
  return qs ? `${path}?${qs}` : path
}

export const links = {
  salaire: (params: { brut?: number; statut?: string; temps?: number; pas?: number; mutuelle?: number } = {}) =>
    build("/simulateur/salaire-brut-net", params),

  chomage: (params: { salaire?: number; duree?: number; age?: number; motif?: string } = {}) =>
    build("/simulateur/chomage-are", params),

  licenciement: (params: { salaire?: number; annees?: number; mois?: number; type?: string } = {}) =>
    build("/simulateur/licenciement-rupture", params),

  freelance: (params: { tjm?: number; jours?: number; secteur?: string; acre?: boolean; strategie?: string } = {}) =>
    build("/simulateur/tjm-freelance", params),

  impot: (params: { revenu?: number; situation?: string; enfants?: number } = {}) =>
    build("/simulateur/impot-revenu", params),

  retraite: (params: { naissance?: number; debut?: number; salaire?: number } = {}) =>
    build("/simulateur/retraite", params),

  epargne: (params: { capital?: number; versement?: number; duree?: number; taux?: number } = {}) =>
    build("/simulateur/epargne", params),
}

/**
 * Estime le brut mensuel à partir d'un net mensuel non-cadre.
 * Approximation : net = 0,78 × brut (taux de cotisations 22%).
 */
export function estimerBrutDepuisNet(netMensuel: number): number {
  return Math.round(netMensuel / 0.78)
}
