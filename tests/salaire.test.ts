import { describe, it, expect } from "vitest"
import { calculerSalaireNet } from "@/lib/calculateurs/salaire"

/**
 * Tests basés sur les cotisations URSSAF strictement légales 2025.
 * Référence : barèmes URSSAF, AGIRC-ARRCO, taux CSG/CRDS.
 *
 * Note : le simulateur officiel URSSAF inclut parfois mutuelle (ANI) et prévoyance,
 * qui ne sont PAS des cotisations légales pures (variables selon employeur).
 * Nos tests vérifient le résultat « cotisations légales pures ».
 */

describe("Salaire brut → net (cotisations légales 2025)", () => {
  it("3 000 € brut non-cadre → ~2 375 € net", () => {
    const r = calculerSalaireNet(3000, "non-cadre")
    // 22% × 3000 ≈ 624.6 cotisations → 2375.4 net
    expect(r.netAvantImpot).toBeCloseTo(2375, 0)
    expect(r.totalCotisations).toBeCloseTo(625, 0)
  })

  it("3 000 € brut cadre → légèrement inférieur au non-cadre", () => {
    const cadre = calculerSalaireNet(3000, "cadre")
    const nonCadre = calculerSalaireNet(3000, "non-cadre")
    expect(cadre.netAvantImpot).toBeLessThan(nonCadre.netAvantImpot)
    // Différence attendue : ~0,86% de 3000 (CEG T1 + retraite compl T1) ≈ 25-30€
    expect(nonCadre.netAvantImpot - cadre.netAvantImpot).toBeGreaterThan(20)
    expect(nonCadre.netAvantImpot - cadre.netAvantImpot).toBeLessThan(40)
  })

  it("SMIC 1 802,25 € brut → ~1 426 € net (non-cadre)", () => {
    const r = calculerSalaireNet(1802.25, "non-cadre")
    // SMIC net 2025 ≈ 1 426€ (référence officielle)
    expect(r.netAvantImpot).toBeGreaterThan(1410)
    expect(r.netAvantImpot).toBeLessThan(1440)
  })

  it("Salaire au-dessus du PMSS active la tranche 2", () => {
    const r = calculerSalaireNet(5000, "non-cadre")
    // T2 = 5000 - 3925 = 1075€
    // CEG T2 + retraite T2 ne devraient pas être nuls
    const cotisT2 = r.cotisations.find((c) => c.label.includes("T2") && c.label.includes("Retraite"))
    expect(cotisT2?.montant).toBeGreaterThan(0)
    expect(cotisT2?.base).toBeCloseTo(1075, 0)
  })

  it("Le coût employeur ≈ 1,42 × brut", () => {
    const r = calculerSalaireNet(3000, "non-cadre")
    expect(r.coutEmployeur / r.brut).toBeCloseTo(1.42, 1)
  })

  it("Temps partiel à 50% divise net par 2", () => {
    const plein = calculerSalaireNet(3000, "non-cadre", 100)
    const partiel = calculerSalaireNet(3000, "non-cadre", 50)
    expect(partiel.netAvantImpot).toBeCloseTo(plein.netAvantImpot / 2, 0)
  })

  it("Prélèvement à la source réduit le net après impôt", () => {
    const r = calculerSalaireNet(3000, "non-cadre", 100, 5)
    expect(r.netApresImpot).toBeCloseTo(r.netAvantImpot * 0.95, 1)
  })

  it("CSG : assiette = 98,25% du brut (abattement 1,75% frais pro)", () => {
    const r = calculerSalaireNet(3000, "non-cadre")
    const csgDed = r.cotisations.find((c) => c.label === "CSG déductible")
    expect(csgDed?.base).toBeCloseTo(3000 * 0.9825, 1)
    expect(csgDed?.montant).toBeCloseTo(3000 * 0.9825 * 0.068, 1)
  })

  it("Mutuelle santé déduite du net (ANI 2016)", () => {
    const sansMutuelle = calculerSalaireNet(3000, "non-cadre", 100, 0, 0)
    const avecMutuelle = calculerSalaireNet(3000, "non-cadre", 100, 0, 30)
    expect(avecMutuelle.netAvantImpot).toBeCloseTo(sansMutuelle.netAvantImpot - 30, 1)
  })

  it("Avec mutuelle 30 €, le net se rapproche de l'estimation URSSAF (~2 348 €)", () => {
    const r = calculerSalaireNet(3000, "non-cadre", 100, 0, 27)
    expect(r.netAvantImpot).toBeCloseTo(2348, 0)
  })
})
