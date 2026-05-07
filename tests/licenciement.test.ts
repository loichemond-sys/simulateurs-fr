import { describe, it, expect } from "vitest"
import { calculerIndemnite, calculerCarenceARE } from "@/lib/calculateurs/licenciement"

/**
 * Tests basés sur l'article R1234-2 du Code du travail.
 * Formule : 1/4 mois par an jusqu'à 10 ans, 1/3 mois au-delà.
 */

describe("Indemnité de licenciement (Code du travail R1234-2)", () => {
  it("Inéligible avant 8 mois d'ancienneté", () => {
    const r = calculerIndemnite("licenciement-personnel", 3000, 3000, 0, 6)
    expect(r.eligible).toBe(false)
  })

  it("3 000 € × 5 ans = 3 750 € (1/4 × 5 × 3000)", () => {
    const r = calculerIndemnite("licenciement-personnel", 3000, 3000, 5, 0)
    expect(r.indemniteLegale).toBeCloseTo(3750, 0)
  })

  it("3 000 € × 12 ans = 9 500 € (1/4 × 10 + 1/3 × 2)", () => {
    const r = calculerIndemnite("licenciement-personnel", 3000, 3000, 12, 0)
    // Tranche 1 : 10 × 3000/4 = 7500
    // Tranche 2 : 2 × 3000/3 = 2000
    // Total : 9500
    expect(r.indemniteLegale).toBeCloseTo(9500, 0)
  })

  it("2 500 € × 8 ans = 5 000 €", () => {
    const r = calculerIndemnite("licenciement-personnel", 2500, 2500, 8, 0)
    // 8 × 2500/4 = 5000
    expect(r.indemniteLegale).toBeCloseTo(5000, 0)
  })

  it("Mois supplémentaires comptent dans le calcul", () => {
    const r = calculerIndemnite("licenciement-personnel", 3000, 3000, 5, 6)
    // 5,5 ans × 3000/4 = 4125
    expect(r.indemniteLegale).toBeCloseTo(4125, 0)
  })

  it("Salaire de référence = max(moyenne 12 mois, moyenne 3 mois)", () => {
    const r = calculerIndemnite("licenciement-personnel", 2800, 3200, 5, 0)
    expect(r.salaireReference).toBe(3200)
  })

  it("Indemnité rupture conventionnelle = légale (pas inférieure)", () => {
    const r = calculerIndemnite("rupture-conventionnelle", 3000, 3000, 5, 0)
    expect(r.indemniteRupture).toBeCloseTo(3750, 0)
  })

  it("Plafond exonération cotisations = 2 PASS (96 120 €)", () => {
    const r = calculerIndemnite("licenciement-personnel", 3000, 3000, 5, 0)
    expect(r.exonerationCotisations).toBe(96120)
  })
})

describe("Délai de carence ARE supra-légal", () => {
  it("Pas de carence si pas de supra-légal", () => {
    expect(calculerCarenceARE(0)).toBe(0)
  })

  it("10 000 € supra-légal → ~108 jours de carence", () => {
    expect(calculerCarenceARE(10000)).toBe(108) // 10000 / 92.5 = 108.1
  })

  it("Carence plafonnée à 150 jours", () => {
    expect(calculerCarenceARE(50000)).toBe(150)
  })
})
