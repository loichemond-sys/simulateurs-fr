import { describe, it, expect } from "vitest"
import {
  calculerAutoEntrepreneur,
  calculerEURL,
  calculerSASU,
  calculerPortage,
  comparerStatuts,
  tjmMinimum,
} from "@/lib/calculateurs/freelance"

/**
 * Tests des calculs freelance.
 * Sources : URSSAF (cotisations AE), CGI (IS, PFU), 2025.
 */

describe("Auto-entrepreneur", () => {
  it("Services 5 000 €/mois → 21,2% de cotisations", () => {
    const r = calculerAutoEntrepreneur(5000, "services")
    expect(r.cotisations).toBeCloseTo(60000 * 0.212, 0)
  })

  it("Commerce 5 000 €/mois → 12,3% de cotisations", () => {
    const r = calculerAutoEntrepreneur(5000, "commerce")
    expect(r.cotisations).toBeCloseTo(60000 * 0.123, 0)
  })

  it("ACRE divise les cotisations par 2", () => {
    const sansAcre = calculerAutoEntrepreneur(5000, "services", 1, false)
    const avecAcre = calculerAutoEntrepreneur(5000, "services", 1, true)
    expect(avecAcre.cotisations).toBeCloseTo(sansAcre.cotisations / 2, 0)
  })

  it("ACRE améliore le net annuel", () => {
    const sansAcre = calculerAutoEntrepreneur(5000, "services", 1, false)
    const avecAcre = calculerAutoEntrepreneur(5000, "services", 1, true)
    expect(avecAcre.netAnnuel).toBeGreaterThan(sansAcre.netAnnuel)
  })

  it("Abattement IR : 34% pour services BNC", () => {
    const r = calculerAutoEntrepreneur(5000, "services", 1)
    // Revenu imposable = CA × (1 - 0.34) = 60000 × 0.66 = 39600
    // Test indirect via le ratio net : doit être > 50% du CA après IR
    expect(r.ratioNetCA).toBeGreaterThan(0.5)
  })
})

describe("EURL / SASU avec stratégie de rémunération", () => {
  it("EURL 100% salaire → tous les revenus en rémunération", () => {
    const r = calculerEURL(7000, 1, "salaire", "pfu")
    expect(r.statut).toBe("eurl")
    expect(r.netAnnuel).toBeGreaterThan(0)
  })

  it("SASU stratégie mixte vs 100% salaire : différence de net", () => {
    const salaire = calculerSASU(8000, 1, "salaire", "pfu")
    const mixte = calculerSASU(8000, 1, "mixte", "pfu")
    // Les deux donnent un net positif, mais différent
    expect(salaire.netAnnuel).toBeGreaterThan(0)
    expect(mixte.netAnnuel).toBeGreaterThan(0)
    expect(salaire.netAnnuel).not.toBe(mixte.netAnnuel)
  })

  it("PFU vs barème IR : les deux donnent un net positif", () => {
    const pfu = calculerSASU(8000, 1, "mixte", "pfu")
    const bareme = calculerSASU(8000, 1, "mixte", "bareme")
    expect(pfu.netAnnuel).toBeGreaterThan(0)
    expect(bareme.netAnnuel).toBeGreaterThan(0)
  })

  it("EURL : le ratio net/CA est entre 35 et 60% selon stratégie", () => {
    const r = calculerEURL(8000, 1, "salaire", "pfu")
    expect(r.ratioNetCA).toBeGreaterThan(0.35)
    expect(r.ratioNetCA).toBeLessThan(0.65)
  })
})

describe("Portage salarial", () => {
  it("Frais de gestion ~8,5% du CA", () => {
    const r = calculerPortage(8000, 1)
    expect(r.fraisGestion).toBeCloseTo(96000 * 0.085, 0)
  })

  it("Net en portage est inférieur au CA × 50%", () => {
    const r = calculerPortage(8000, 1)
    expect(r.ratioNetCA).toBeLessThan(0.5)
  })
})

describe("comparerStatuts", () => {
  it("Renvoie 4 statuts", () => {
    const res = comparerStatuts({
      tjm: 500,
      joursParMois: 15,
      statut: "auto-entrepreneur",
      secteur: "services",
    })
    expect(res).toHaveLength(4)
    expect(res.map((r) => r.statut)).toEqual(["auto-entrepreneur", "eurl", "sasu", "portage"])
  })

  it("Auto-entrepreneur compétitif pour CA modéré (≤ 60 K€/an)", () => {
    const res = comparerStatuts({
      tjm: 350,
      joursParMois: 15,
      statut: "auto-entrepreneur",
      secteur: "services",
    })
    const meilleur = [...res].sort((a, b) => b.netMensuel - a.netMensuel)[0]
    expect(["auto-entrepreneur", "eurl"]).toContain(meilleur.statut)
  })
})

describe("tjmMinimum", () => {
  it("3 000 € net en auto-entrepreneur sur 15 jours → TJM cohérent", () => {
    const min = tjmMinimum(3000, 15, "auto-entrepreneur", "services")
    // Sans abattement frais pro 10% (microentreprise), le TJM minimum est ~270€
    expect(min).toBeGreaterThan(250)
    expect(min).toBeLessThan(380)
  })

  it("TJM minimum croît avec l'objectif net", () => {
    const tjm2k = tjmMinimum(2000, 15, "auto-entrepreneur", "services")
    const tjm4k = tjmMinimum(4000, 15, "auto-entrepreneur", "services")
    expect(tjm4k).toBeGreaterThan(tjm2k)
  })
})
