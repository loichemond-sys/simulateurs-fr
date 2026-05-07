import { describe, it, expect } from "vitest"
import { num, str, bool, links, estimerBrutDepuisNet } from "@/lib/cross-links"

describe("Parseurs de querystring", () => {
  it("num() lit un nombre valide", () => {
    expect(num({ brut: "3000" }, "brut", 0)).toBe(3000)
  })

  it("num() retourne le défaut si absent ou invalide", () => {
    expect(num({}, "brut", 2500)).toBe(2500)
    expect(num({ brut: "abc" }, "brut", 2500)).toBe(2500)
    expect(num({ brut: undefined }, "brut", 2500)).toBe(2500)
  })

  it("num() supporte les décimaux", () => {
    expect(num({ pas: "11.5" }, "pas", 0)).toBe(11.5)
  })

  it("bool() reconnaît '1' et 'true'", () => {
    expect(bool({ acre: "1" }, "acre", false)).toBe(true)
    expect(bool({ acre: "true" }, "acre", false)).toBe(true)
    expect(bool({ acre: "TRUE" }, "acre", false)).toBe(true)
    expect(bool({ acre: "0" }, "acre", true)).toBe(false)
    expect(bool({}, "acre", true)).toBe(true)
  })

  it("str() valide la valeur contre une whitelist", () => {
    const allowed = ["a", "b", "c"] as const
    expect(str({ x: "b" }, "x", allowed, "a")).toBe("b")
    expect(str({ x: "z" }, "x", allowed, "a")).toBe("a")
    expect(str({}, "x", allowed, "a")).toBe("a")
  })
})

describe("Construction des liens", () => {
  it("links.salaire() ne génère pas de querystring vide", () => {
    expect(links.salaire()).toBe("/simulateur/salaire-brut-net")
  })

  it("links.salaire({brut: 3000}) inclut le paramètre", () => {
    expect(links.salaire({ brut: 3000 })).toBe("/simulateur/salaire-brut-net?brut=3000")
  })

  it("Combinaison de paramètres", () => {
    const url = links.salaire({ brut: 3000, statut: "cadre", pas: 11 })
    expect(url).toContain("brut=3000")
    expect(url).toContain("statut=cadre")
    expect(url).toContain("pas=11")
  })

  it("Booléens à false sont omis", () => {
    expect(links.freelance({ tjm: 500, acre: false })).toBe("/simulateur/tjm-freelance?tjm=500")
  })

  it("Booléens à true sont sérialisés en '1'", () => {
    const url = links.freelance({ tjm: 500, acre: true })
    expect(url).toContain("acre=1")
  })

  it("Valeurs undefined sont omises", () => {
    expect(links.impot({ revenu: undefined })).toBe("/simulateur/impot-revenu")
  })
})

describe("Conversion freelance → CDI", () => {
  it("Estime un brut cohérent depuis un net mensuel non-cadre", () => {
    // Net 2350 → brut ~3013 (test inverse de notre cas standard)
    const brut = estimerBrutDepuisNet(2350)
    expect(brut).toBeGreaterThan(2900)
    expect(brut).toBeLessThan(3100)
  })

  it("Renvoie un entier arrondi", () => {
    const brut = estimerBrutDepuisNet(2350)
    expect(Number.isInteger(brut)).toBe(true)
  })
})
