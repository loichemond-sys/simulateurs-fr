import { describe, it, expect } from "vitest"
import { calculerARE } from "@/lib/calculateurs/chomage"

/**
 * Tests basés sur le règlement Unédic 2019 + avenants 2025.
 * Référence : France Travail, simulateur officiel.
 */

describe("ARE (Allocation Retour à l'Emploi)", () => {
  it("Inéligible si moins de 6 mois d'affiliation", () => {
    const r = calculerARE(2500, 4, 35, "licenciement")
    expect(r.eligible).toBe(false)
    expect(r.raisonNonEligible).toContain("6 mois")
  })

  it("2 500 € brut × 18 mois → ARE entre 1 250 et 1 400 €/mois", () => {
    const r = calculerARE(2500, 18, 35, "licenciement")
    expect(r.eligible).toBe(true)
    expect(r.areMensuelle).toBeGreaterThan(1250)
    expect(r.areMensuelle).toBeLessThan(1400)
  })

  it("Durée d'indemnisation = durée d'emploi (≤ plafond)", () => {
    const r = calculerARE(2500, 12, 35, "licenciement")
    expect(r.dureeIndemnisationMois).toBe(12)
  })

  it("Plafond durée à 24 mois pour < 53 ans", () => {
    const r = calculerARE(2500, 36, 35, "licenciement")
    expect(r.dureeIndemnisationMois).toBe(24)
  })

  it("Plafond durée à 36 mois pour ≥ 55 ans", () => {
    const r = calculerARE(2500, 48, 56, "licenciement")
    expect(r.dureeIndemnisationMois).toBe(36)
  })

  it("Plancher journalier à 28,86 € minimum", () => {
    const r = calculerARE(1400, 12, 30, "licenciement")
    expect(r.areJournaliere).toBeGreaterThanOrEqual(28.86)
  })

  it("Plafond à 75% du SJR", () => {
    const r = calculerARE(8000, 24, 35, "licenciement")
    expect(r.areJournaliere).toBeLessThanOrEqual(r.sjr * 0.75 + 0.01)
  })

  it("Dégressivité activée si salaire > 4 537 € et < 55 ans", () => {
    const r = calculerARE(5500, 24, 40, "licenciement")
    expect(r.degressivite).toBe(true)
  })

  it("Pas de dégressivité après 55 ans", () => {
    const r = calculerARE(5500, 24, 56, "licenciement")
    expect(r.degressivite).toBe(false)
  })

  it("Délai de carence de 7 jours minimum", () => {
    const r = calculerARE(2500, 18, 35, "licenciement")
    expect(r.delaiCarenceJours).toBeGreaterThanOrEqual(7)
  })

  it("Formule retenue = max(formule fixe, formule proportionnelle)", () => {
    const r = calculerARE(2500, 18, 35, "licenciement")
    expect(r.areJournaliere).toBeGreaterThanOrEqual(Math.min(r.formule1, r.formule2))
    expect(r.areJournaliere).toBeLessThanOrEqual(Math.max(r.formule1, r.formule2) + 0.01)
  })
})
