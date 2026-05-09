"use client"

import { useMemo, useState } from "react"
import { calculerEpargne, type ResultatProduit } from "@/lib/calculateurs/epargne"
import { formatEuros } from "@/lib/format"
import { Field, SliderInput, PeriodeToggle } from "./ui/Field"
import { NextSteps } from "./ui/NextSteps"
import { links } from "@/lib/cross-links"

const RISQUE_LABEL: Record<string, string> = {
  aucun: "Sans risque",
  faible: "Risque faible",
  élevé: "Risque marché",
}

const LIQUIDITE_LABEL: Record<string, string> = {
  immédiate: "Disponible immédiatement",
  "moyen-terme": "Optimal à moyen terme",
  "long-terme": "Optimal à long terme (5+ ans)",
}

export interface SimulateurEpargneProps {
  initial?: { capital?: number; versement?: number; duree?: number }
}

export function SimulateurEpargne({ initial }: SimulateurEpargneProps = {}) {
  const [capital, setCapital] = useState(initial?.capital ?? 5000)
  const [versement, setVersement] = useState(initial?.versement ?? 200)
  const [duree, setDuree] = useState(initial?.duree ?? 10)
  const [periodicite, setPeriodicite] = useState<"mensuel" | "annuel">("mensuel")
  const [produitActif, setProduitActif] = useState<string | null>(null)

  const r = useMemo(() => calculerEpargne(capital, versement, duree), [capital, versement, duree])

  const totalVerse = capital + versement * 12 * duree
  const meilleur = r.resultats[0]
  const produitDetailActif = produitActif
    ? r.resultats.find((res) => res.produit.id === produitActif) ?? null
    : null

  const maxCapital = meilleur.capitalFinal

  return (
    <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
      {/* Inputs */}
      <div className="lg:col-span-2 space-y-8">
        <div className="card p-7 space-y-7">
          <Field label="Épargne de départ">
            <SliderInput value={capital} onChange={setCapital} min={0} max={50000} step={500} />
          </Field>

          <Field label="Versement régulier">
            <div className="flex justify-end mb-2">
              <PeriodeToggle value={periodicite} onChange={setPeriodicite} />
            </div>
            <SliderInput
              value={periodicite === "annuel" ? versement * 12 : versement}
              onChange={(v) =>
                setVersement(periodicite === "annuel" ? Math.round(v / 12) : v)
              }
              min={0}
              max={periodicite === "annuel" ? 24000 : 2000}
              step={periodicite === "annuel" ? 600 : 50}
            />
          </Field>

          <Field label="Durée de l'épargne" hint={`Jusqu'en ${new Date().getFullYear() + duree}`}>
            <SliderInput value={duree} onChange={setDuree} min={1} max={30} step={1} unit="ans" />
          </Field>
        </div>

        {/* Résumé de l'effort */}
        <div className="card p-6 space-y-3">
          <p className="text-xs uppercase tracking-wide text-ink-400">— Votre effort d&apos;épargne</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-ink-400 font-light mb-1">Capital initial</p>
              <p className="font-display text-xl font-medium">{formatEuros(capital)}</p>
            </div>
            <div>
              <p className="text-ink-400 font-light mb-1">Versements {duree} ans</p>
              <p className="font-display text-xl font-medium">{formatEuros(versement * 12 * duree)}</p>
            </div>
          </div>
          <div className="pt-3 border-t border-ivory-300">
            <p className="text-ink-400 font-light text-xs mb-1">Total épargné</p>
            <p className="font-display text-2xl font-medium">{formatEuros(totalVerse)}</p>
          </div>
        </div>
      </div>

      {/* Résultats */}
      <div className="lg:col-span-3 space-y-6">
        {/* Meilleur résultat */}
        <div className="card p-8 lg:p-10">
          <p className="text-xs uppercase tracking-wide text-ink-400 mb-3">
            — Meilleur potentiel en {duree} ans ({meilleur.produit.nom})
          </p>
          <div className="flex items-baseline gap-4 mb-2">
            <span className="font-display text-6xl lg:text-7xl font-medium tracking-tighter text-forest">
              {formatEuros(meilleur.capitalFinal)}
            </span>
          </div>
          <p className="font-display text-xl text-ink-500 italic mt-2">
            dont{" "}
            <span className="text-forest font-medium not-italic">
              {formatEuros(meilleur.interetsGeneres)}
            </span>{" "}
            d&apos;intérêts et gains générés
          </p>

          {/* Barre de composition */}
          <div className="mt-6">
            <div className="h-3 rounded-full overflow-hidden flex bg-ivory-200">
              <div
                className="bg-ink/30 h-full"
                style={{ width: `${(capital / meilleur.capitalFinal) * 100}%` }}
              />
              <div
                className="bg-ink/15 h-full"
                style={{ width: `${((totalVerse - capital) / meilleur.capitalFinal) * 100}%` }}
              />
              <div
                className="bg-forest h-full"
                style={{ width: `${(meilleur.interetsGeneres / meilleur.capitalFinal) * 100}%` }}
              />
            </div>
            <div className="flex gap-4 mt-2 text-xs text-ink-400 font-light flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-ink/30 shrink-0" />
                Capital initial {formatEuros(capital)}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-ink/15 shrink-0" />
                Versements {formatEuros(totalVerse - capital)}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-forest shrink-0" />
                Gains {formatEuros(meilleur.interetsGeneres)}
              </span>
            </div>
          </div>
        </div>

        {/* Comparaison des produits */}
        <div className="card p-7">
          <p className="text-xs uppercase tracking-wide text-ink-400 mb-5">
            — Comparer les produits d&apos;épargne français
          </p>
          <div className="space-y-2">
            {r.resultats.map((res, i) => {
              const isFirst = i === 0
              const isActive = produitActif === res.produit.id
              const barWidth = maxCapital > 0 ? (res.capitalFinal / maxCapital) * 100 : 0
              const gainVsTotal = res.capitalFinal - totalVerse

              return (
                <div key={res.produit.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setProduitActif(isActive ? null : res.produit.id)
                    }
                    className={`w-full text-left rounded-xl p-4 transition-all ${
                      isActive
                        ? "bg-forest/5 border border-forest/30"
                        : isFirst
                        ? "bg-ivory-100 border border-ivory-200 hover:border-ivory-300"
                        : "bg-ivory-50 border border-transparent hover:bg-ivory-100"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2 gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`font-display text-base font-medium truncate ${
                            isActive ? "text-forest" : "text-ink"
                          }`}
                        >
                          {res.produit.nom}
                        </span>
                        {isFirst && (
                          <span className="shrink-0 text-xs bg-forest text-ivory px-2 py-0.5 rounded-full font-medium">
                            meilleur
                          </span>
                        )}
                        {res.plafondAtteint && (
                          <span className="shrink-0 text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full font-medium">
                            plafond
                          </span>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`font-display text-xl font-medium tabular-nums ${
                            isActive ? "text-forest" : "text-ink"
                          }`}
                        >
                          {formatEuros(res.capitalFinal)}
                        </span>
                      </div>
                    </div>

                    <div className="h-1.5 bg-ivory-200 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full ${isActive ? "bg-forest" : "bg-ink/25"}`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-xs text-ink-400 font-light">
                      <span>{res.produit.tauxAfficheLabel}</span>
                      <span className={gainVsTotal >= 0 ? "text-forest" : "text-ink-400"}>
                        {gainVsTotal >= 0 ? "+" : ""}
                        {formatEuros(gainVsTotal)} de gains
                      </span>
                    </div>
                  </button>

                  {/* Détail dépliable */}
                  {isActive && (
                    <div className="mx-1 px-5 py-4 bg-forest/5 rounded-b-xl border border-t-0 border-forest/20 text-sm space-y-2">
                      <p className="text-ink-500 font-light">
                        <span className="font-medium text-ink">Fiscalité — </span>
                        {res.produit.fiscalite}
                      </p>
                      <p className="text-ink-500 font-light">
                        <span className="font-medium text-ink">Liquidité — </span>
                        {LIQUIDITE_LABEL[res.produit.liquidite]}
                      </p>
                      <p className="text-ink-500 font-light">
                        <span className="font-medium text-ink">Risque — </span>
                        {RISQUE_LABEL[res.produit.risque]}
                        {res.produit.risque === "élevé" && (
                          <span className="text-warning">
                            {" "}· Le capital n&apos;est pas garanti
                          </span>
                        )}
                      </p>
                      {res.produit.eligible && (
                        <p className="text-ink-500 font-light">
                          <span className="font-medium text-ink">Éligibilité — </span>
                          {res.produit.eligible}
                        </p>
                      )}
                      {res.plafondAtteint && res.produit.plafondVersements && (
                        <p className="text-warning font-light">
                          Le plafond de {formatEuros(res.produit.plafondVersements)} est atteint —
                          les versements s&apos;arrêtent automatiquement.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <p className="mt-4 text-xs text-ink-400 font-light leading-relaxed">
            Les taux sont indicatifs (mai 2026). Le PEA affiche un rendement moyen historique
            du MSCI World (~8%/an sur 20 ans), non garanti. Cliquez sur un produit pour les détails.
          </p>
        </div>

        {/* Croissance sur le temps — tableau points clés */}
        {duree >= 5 && (
          <div className="card p-7">
            <p className="text-xs uppercase tracking-wide text-ink-400 mb-5">
              — Évolution du capital (Livret A vs PEA)
            </p>
            <div className="space-y-3">
              {(() => {
                const livretA = r.resultats.find((res) => res.produit.id === "livret-a")
                const pea = r.resultats.find((res) => res.produit.id === "pea")
                const anneesCles = [
                  Math.floor(duree * 0.25),
                  Math.floor(duree * 0.5),
                  Math.floor(duree * 0.75),
                  duree,
                ]
                  .filter((a) => a > 0)
                  .filter((v, i, arr) => arr.indexOf(v) === i)

                return anneesCles.map((annee) => {
                  const lA = livretA?.historique.find((h) => h.annee === annee)
                  const pA = pea?.historique.find((h) => h.annee === annee)
                  const vA = capital + versement * 12 * annee
                  return (
                    <div key={annee} className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-ink-400 font-light">dans {annee} an{annee > 1 ? "s" : ""}</span>
                      <div>
                        <p className="text-xs text-ink-400 font-light mb-0.5">Livret A</p>
                        <p className="font-medium tabular-nums">{formatEuros(lA?.capital ?? 0)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-ink-400 font-light mb-0.5">PEA ETF</p>
                        <p className="font-medium tabular-nums text-forest">{formatEuros(pA?.capital ?? 0)}</p>
                      </div>
                    </div>
                  )
                })
              })()}
            </div>
          </div>
        )}

        <NextSteps
          items={[
            {
              eyebrow: "Préparer ma retraite",
              href: links.retraite({}),
              title: "Estimer ma pension de retraite",
              description:
                "Calculez l'âge optimal pour partir sans décote et le montant de votre pension.",
            },
            {
              eyebrow: "Mon impôt sur les gains",
              href: links.impot({ revenu: Math.round(meilleur.capitalFinal * 0.05 * 10) }),
              title: "Calculer l'impôt sur mes revenus du capital",
              description: `Les gains d'épargne sont imposables. Estimez l'impact fiscal sur votre situation.`,
            },
          ]}
        />
      </div>
    </div>
  )
}
