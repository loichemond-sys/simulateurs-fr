import { describe, it, expect } from "vitest"
import {
  getTrimestreRequis,
  getAgeLegalAns,
  formatAgeLegal,
  calculerRetraite,
} from "@/lib/calculateurs/retraite"

describe("Trimestres requis par génération", () => {
  it("1967+ → 172 trimestres", () => {
    expect(getTrimestreRequis(1967)).toBe(172)
    expect(getTrimestreRequis(1975)).toBe(172)
    expect(getTrimestreRequis(1990)).toBe(172)
  })

  it("1961-1963 → 168 trimestres", () => {
    expect(getTrimestreRequis(1961)).toBe(168)
    expect(getTrimestreRequis(1963)).toBe(168)
  })

  it("1964-1966 → progression", () => {
    expect(getTrimestreRequis(1964)).toBe(169)
    expect(getTrimestreRequis(1965)).toBe(170)
    expect(getTrimestreRequis(1966)).toBe(171)
  })

  it("avant 1961 → 160-167", () => {
    expect(getTrimestreRequis(1951)).toBe(160)
    expect(getTrimestreRequis(1959)).toBe(167)
  })
})

describe("Âge légal réforme 2023", () => {
  it("né avant 1961 → 62 ans", () => {
    expect(getAgeLegalAns(1955)).toBe(62)
    expect(getAgeLegalAns(1960)).toBe(62)
  })

  it("né 1961 → 62 ans 3 mois", () => {
    expect(getAgeLegalAns(1961)).toBeCloseTo(62.25)
  })

  it("né 1964 → 63 ans", () => {
    expect(getAgeLegalAns(1964)).toBe(63)
  })

  it("né 1968+ → 64 ans", () => {
    expect(getAgeLegalAns(1968)).toBe(64)
    expect(getAgeLegalAns(1985)).toBe(64)
  })
})

describe("Formatage de l'âge légal", () => {
  it("62 ans pile", () => {
    expect(formatAgeLegal(62)).toBe("62 ans")
  })

  it("62 ans 3 mois", () => {
    expect(formatAgeLegal(62.25)).toBe("62 ans 3 mois")
  })

  it("63 ans 9 mois", () => {
    expect(formatAgeLegal(63.75)).toBe("63 ans 9 mois")
  })
})

describe("Calcul de pension — cas de base", () => {
  // Né 1975, carrière 1997 (22 ans), salaire 35 000 €
  // Requis : 172 trimestres = 43 ans
  // À 64 ans (2039) : (2039-1997)*4 = 168 trim → manque 4 → décote 5%
  // À 65 ans (2040) : 172 trim → taux plein
  // À 66 ans (2041) : 176 trim → surcote 5%

  const r = calculerRetraite(1975, 1997, 35000)

  it("trimestres requis = 172", () => {
    expect(r.trimestresRequis).toBe(172)
  })

  it("âge légal = 64 ans", () => {
    expect(r.ageLegalAns).toBe(64)
  })

  it("âge taux plein = 65 ans", () => {
    expect(r.ageTauxPlein).toBe(65)
  })

  it("scenario à 64 ans : décote présente", () => {
    const s = r.scenarios.find((s) => s.age === 64)!
    expect(s.tauxPlein).toBe(false)
    expect(s.decote).toBeGreaterThan(0)
  })

  it("scenario à 65 ans : taux plein, prorata = 1", () => {
    const s = r.scenarios.find((s) => s.age === 65)!
    expect(s.tauxPlein).toBe(true)
    expect(s.prorata).toBe(1)
    expect(s.decote).toBe(0)
  })

  it("scenario à 66 ans : surcote présente", () => {
    const s = r.scenarios.find((s) => s.age === 66)!
    expect(s.surcote).toBeGreaterThan(0)
    expect(s.pensionNetteMensuelle).toBeGreaterThan(
      r.scenarios.find((s) => s.age === 65)!.pensionNetteMensuelle
    )
  })

  it("pension à taux plein est positive et raisonnable", () => {
    const s = r.scenarioOptimal
    expect(s.pensionNetteMensuelle).toBeGreaterThan(500)
    expect(s.pensionNetteMensuelle).toBeLessThan(3000)
  })
})

describe("Calcul de pension — carrière courte avec décote", () => {
  // Né 1970, carrière début 2005 (35 ans), salaire 40 000 €
  // À 64 ans (2034) : (2034-2005)*4 = 116 trim sur 172 → prorata 0,674
  // + décote (manque 56 trim mais plafond à 25) → décote 31,25%
  const r = calculerRetraite(1970, 2005, 40000)

  it("décote plafonnée à 25 trimestres max", () => {
    const s = r.scenarios.find((s) => s.age === 64)!
    expect(s.decote).toBeLessThanOrEqual(0.3125)
  })

  it("pension à 67 ans (taux plein auto) < taux plein classique", () => {
    const s67 = r.scenario67
    expect(s67.tauxPlein).toBe(true)
    // prorata < 1 car carrière courte
    expect(s67.prorata).toBeLessThan(1)
  })
})

describe("SAM plafonné au PASS", () => {
  const rHaut = calculerRetraite(1975, 1997, 200000)
  const rPlafond = calculerRetraite(1975, 1997, 48060)

  it("pension identique pour 200 000 € et 48 060 € (PASS)", () => {
    expect(rHaut.scenarioOptimal.pensionBruteMensuelle).toBeCloseTo(
      rPlafond.scenarioOptimal.pensionBruteMensuelle, 0
    )
  })
})
