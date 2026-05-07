import { describe, it, expect } from "vitest"
import { calculerIR, calculerParts } from "@/lib/calculateurs/impot"

/**
 * Tests basés sur le barème 2026 (revenus 2025).
 * Tranches : 0% / 11% / 30% / 41% / 45%.
 * Référence : Loi de finances 2026, article 197 CGI, simulateur DGFiP.
 */

describe("Quotient familial", () => {
  it("Célibataire = 1 part", () => {
    expect(calculerParts("celibataire", 0)).toBe(1)
  })

  it("Couple marié sans enfant = 2 parts", () => {
    expect(calculerParts("marie", 0)).toBe(2)
  })

  it("Couple + 1 enfant = 2,5 parts", () => {
    expect(calculerParts("marie", 1)).toBe(2.5)
  })

  it("Couple + 2 enfants = 3 parts", () => {
    expect(calculerParts("marie", 2)).toBe(3)
  })

  it("Couple + 3 enfants = 4 parts (3ᵉ enfant compte 1 part)", () => {
    expect(calculerParts("marie", 3)).toBe(4)
  })

  it("Parent isolé avec 1 enfant : +0,5 part", () => {
    expect(calculerParts("celibataire", 1, true)).toBe(2)
  })
})

describe("Impôt sur le revenu (barème 2026)", () => {
  it("Revenu < seuil imposable → 0 €", () => {
    const r = calculerIR(15000, 1)
    expect(r.impotNet).toBe(0)
  })

  it("Célibataire 35 000 € → ~2 554 € d'impôt", () => {
    const r = calculerIR(35000, 1)
    // Abattement 10% : 35000 - 3500 = 31500
    // Tranche 11% : 11% × (29579 - 11600) = 1977.69
    // Tranche 30% : 30% × (31500 - 29579) = 576.30
    // Total : ~2554
    expect(r.impotNet).toBeCloseTo(2554, 0)
    expect(r.tauxMarginal).toBe(30)
  })

  it("Célibataire 50 000 € → tranche marginale 30%", () => {
    const r = calculerIR(50000, 1)
    expect(r.tauxMarginal).toBe(30)
    expect(r.impotNet).toBeGreaterThan(5000)
    expect(r.impotNet).toBeLessThan(8000)
  })

  it("Célibataire 100 000 € → tranche marginale 41%", () => {
    const r = calculerIR(100000, 1)
    expect(r.tauxMarginal).toBe(41)
  })

  it("Couple 50 000 € avec 2 enfants → impôt très faible", () => {
    const r = calculerIR(50000, 3) // 3 parts
    expect(r.impotNet).toBeLessThan(1000)
  })

  it("Décote applicable sur les bas revenus", () => {
    const r = calculerIR(20000, 1)
    // 20000 - 2000 = 18000 / 1 part = 18000
    // Imposable à 11% sur (18000 - 11600) = 704
    // Décote car 704 < 1982
    expect(r.decote).toBeGreaterThan(0)
  })

  it("Pas de décote pour des revenus élevés", () => {
    const r = calculerIR(50000, 1)
    expect(r.decote).toBe(0)
  })

  it("Abattement 10% plafonné à 14 555 €", () => {
    const r = calculerIR(200000, 1)
    expect(r.abattementFraisPro).toBe(14555)
  })

  it("Abattement 10% au minimum 509 €", () => {
    const r = calculerIR(3000, 1)
    expect(r.abattementFraisPro).toBe(509)
  })

  it("Mensualité PAS = impôt annuel / 12", () => {
    const r = calculerIR(35000, 1)
    expect(r.mensualitePAS).toBeCloseTo(r.impotNet / 12, 1)
  })
})
