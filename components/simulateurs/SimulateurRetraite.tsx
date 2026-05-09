"use client"

import { useMemo, useState } from "react"
import {
  calculerRetraite,
  formatAgeLegal,
  getAgeLegalAns,
  getTrimestreRequis,
} from "@/lib/calculateurs/retraite"
import { formatEuros, formatPercent } from "@/lib/format"
import { Field, SliderInput, PeriodeToggle } from "./ui/Field"
import { NextSteps } from "./ui/NextSteps"
import { links } from "@/lib/cross-links"

export interface SimulateurRetraiteProps {
  initial?: {
    naissance?: number
    debut?: number
    salaire?: number
  }
}

export function SimulateurRetraite({ initial }: SimulateurRetraiteProps = {}) {
  const ANNEE_ACTUELLE = new Date().getFullYear()
  const defaultNaissance = initial?.naissance ?? 1975

  const [anneeNaissance, setAnneeNaissance] = useState(defaultNaissance)
  const [anneeDebutCarriere, setAnneeDebutCarriere] = useState(
    initial?.debut ?? defaultNaissance + 22
  )
  const [salaireAnnuel, setSalaireAnnuel] = useState(initial?.salaire ?? 35000)
  const [periodicite, setPeriodicite] = useState<"mensuel" | "annuel">("annuel")

  const r = useMemo(
    () => calculerRetraite(anneeNaissance, anneeDebutCarriere, salaireAnnuel),
    [anneeNaissance, anneeDebutCarriere, salaireAnnuel]
  )

  const ageActuel = ANNEE_ACTUELLE - anneeNaissance
  const anneesCarriere = Math.max(0, ANNEE_ACTUELLE - Math.max(anneeDebutCarriere, anneeNaissance + 16))
  const maxPension = Math.max(...r.scenarios.map((s) => s.pensionNetteMensuelle))

  const handleNaissanceChange = (v: number) => {
    setAnneeNaissance(v)
    if (anneeDebutCarriere < v + 16) setAnneeDebutCarriere(v + 22)
  }

  return (
    <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
      {/* Inputs */}
      <div className="lg:col-span-2 space-y-8">
        <div className="card p-7 space-y-7">
          <Field
            label="Année de naissance"
            hint={`${ageActuel} ans en ${ANNEE_ACTUELLE} · ${r.trimestresActuels} trimestres validés`}
          >
            <SliderInput
              value={anneeNaissance}
              onChange={handleNaissanceChange}
              min={1950}
              max={2000}
              step={1}
              unit=""
            />
          </Field>

          <Field
            label="Début de carrière"
            hint={`${anneesCarriere} ans de carrière à ce jour`}
          >
            <SliderInput
              value={anneeDebutCarriere}
              onChange={setAnneeDebutCarriere}
              min={anneeNaissance + 16}
              max={anneeNaissance + 35}
              step={1}
              unit=""
            />
          </Field>

          <Field
            label="Salaire annuel moyen estimé"
            hint={
              periodicite === "mensuel"
                ? `soit ${salaireAnnuel.toLocaleString("fr-FR")} €/an — moyenne des 25 meilleures années, plafonnée au PASS`
                : "Moyenne des 25 meilleures années, plafonnée au PASS (48 060 €)"
            }
          >
            <div className="flex justify-end mb-2">
              <PeriodeToggle value={periodicite} onChange={setPeriodicite} />
            </div>
            <SliderInput
              value={periodicite === "mensuel" ? Math.round(salaireAnnuel / 12) : salaireAnnuel}
              onChange={(v) => setSalaireAnnuel(periodicite === "mensuel" ? Math.round(v * 12) : v)}
              min={periodicite === "mensuel" ? 1300 : 15000}
              max={periodicite === "mensuel" ? 4005 : 48060}
              step={periodicite === "mensuel" ? 50 : 500}
            />
          </Field>
        </div>

        {/* Résumé légal */}
        <div className="card p-6 space-y-4">
          <p className="text-xs uppercase tracking-wide text-ink-400">— Votre situation légale</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-ink-400 font-light mb-1">Âge légal</p>
              <p className="font-display text-xl font-medium">{r.ageLegalFormate}</p>
            </div>
            <div>
              <p className="text-xs text-ink-400 font-light mb-1">Taux plein</p>
              <p className="font-display text-xl font-medium">
                {r.ageTauxPlein ? `${r.ageTauxPlein} ans` : "67 ans"}
              </p>
            </div>
            <div>
              <p className="text-xs text-ink-400 font-light mb-1">Trimestres requis</p>
              <p className="font-display text-xl font-medium">{r.trimestresRequis}</p>
            </div>
            <div>
              <p className="text-xs text-ink-400 font-light mb-1">Trimestres actuels</p>
              <p className="font-display text-xl font-medium">{r.trimestresActuels}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Résultats */}
      <div className="lg:col-span-3 space-y-6">
        {/* Pension optimale */}
        <div className="card p-8 lg:p-10">
          <p className="text-xs uppercase tracking-wide text-ink-400 mb-3">
            — Pension estimée à {r.scenarioOptimal.age} ans (âge optimal)
          </p>
          <div className="flex items-baseline gap-4 mb-2">
            <span className="font-display text-6xl lg:text-7xl font-medium tracking-tighter text-forest">
              {formatEuros(r.scenarioOptimal.pensionNetteMensuelle)}
            </span>
            <span className="text-sm text-ink-400 font-light">/ mois net</span>
          </div>
          <p className="font-display text-xl text-ink-500 italic mt-2">
            soit {formatEuros(r.scenarioOptimal.pensionBruteMensuelle)} brut · taux {formatPercent(r.scenarioOptimal.taux * 100, 1)}
          </p>
          <p className="text-sm text-ink-500 mt-6 font-light leading-relaxed max-w-md">
            Avec {r.scenarioOptimal.trimestresValides} trimestres validés sur {r.trimestresRequis} requis,
            vous partez sans décote en {r.scenarioOptimal.anneeDepart}.
            {r.scenarioOptimal.surcote > 0 && ` La surcote de ${formatPercent(r.scenarioOptimal.surcote * 100, 2)} s'ajoute au taux plein.`}
          </p>
        </div>

        {/* Comparaison par âge */}
        <div className="card p-7">
          <p className="text-xs uppercase tracking-wide text-ink-400 mb-5">— Comparaison par âge de départ</p>
          <div className="space-y-3">
            {r.scenarios.map((s) => {
              const isOptimal = s.age === r.scenarioOptimal.age
              const isLegal = s.age === r.scenarioAgeLegal.age && s.age !== r.scenarioOptimal.age
              const barWidth = maxPension > 0 ? (s.pensionNetteMensuelle / maxPension) * 100 : 0

              return (
                <div
                  key={s.age}
                  className={`rounded-xl p-4 transition-all ${
                    isOptimal
                      ? "bg-forest/5 border border-forest/20"
                      : "bg-ivory-100 border border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`font-display text-lg font-medium ${isOptimal ? "text-forest" : "text-ink"}`}>
                        {s.age} ans
                      </span>
                      {isOptimal && (
                        <span className="text-xs bg-forest text-ivory px-2 py-0.5 rounded-full font-medium">
                          optimal
                        </span>
                      )}
                      {isLegal && (
                        <span className="text-xs bg-ivory-300 text-ink-500 px-2 py-0.5 rounded-full font-medium">
                          âge légal
                        </span>
                      )}
                      {s.age === 67 && s.age !== r.scenarioOptimal.age && (
                        <span className="text-xs bg-ivory-300 text-ink-500 px-2 py-0.5 rounded-full font-medium">
                          taux plein auto
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`font-display text-xl font-medium tabular-nums ${isOptimal ? "text-forest" : "text-ink"}`}>
                        {formatEuros(s.pensionNetteMensuelle)}
                      </span>
                      <span className="text-xs text-ink-400 ml-1 font-light">/mois</span>
                    </div>
                  </div>

                  {/* Barre proportionnelle */}
                  <div className="h-1.5 bg-ivory-200 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all ${isOptimal ? "bg-forest" : "bg-ink-200"}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-ink-400 font-light">
                    <span>{s.trimestresValides} trim. validés · {s.anneeDepart}</span>
                    <span>
                      {s.tauxPlein ? (
                        s.surcote > 0
                          ? <span className="text-forest">+{formatPercent(s.surcote * 100, 2)} surcote</span>
                          : <span className="text-forest">taux plein 50%</span>
                      ) : (
                        <span className="text-warning">−{formatPercent(s.decote * 100, 2)} décote</span>
                      )}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Gain d'attente */}
        {r.scenarioAgeLegal.age < r.scenarioOptimal.age && (
          <div className="rounded-xl border border-ivory-300 bg-ivory-50 p-6">
            <p className="text-xs uppercase tracking-wide text-ink-400 mb-3">— Si vous partez à l&apos;âge légal</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-ink-400 font-light mb-1">Pension à {r.scenarioAgeLegal.age} ans</p>
                <p className="font-display text-xl font-medium">{formatEuros(r.scenarioAgeLegal.pensionNetteMensuelle)}/mois</p>
                {r.scenarioAgeLegal.decote > 0 && (
                  <p className="text-xs text-warning mt-1">
                    Décote permanente : −{formatPercent(r.scenarioAgeLegal.decote * 100, 2)}
                  </p>
                )}
              </div>
              <div>
                <p className="text-ink-400 font-light mb-1">Gain en attendant {r.scenarioOptimal.age} ans</p>
                <p className="font-display text-xl font-medium text-forest">
                  +{formatEuros(r.scenarioOptimal.pensionNetteMensuelle - r.scenarioAgeLegal.pensionNetteMensuelle)}/mois
                </p>
                <p className="text-xs text-ink-400 mt-1 font-light">à vie, sans rattrapage possible</p>
              </div>
            </div>
          </div>
        )}

        <NextSteps
          items={[
            {
              eyebrow: "Mon salaire aujourd'hui",
              href: links.salaire({ brut: Math.round(salaireAnnuel / 12 / 0.78) }),
              title: "Décoder ma fiche de paie",
              description: `Voir le détail de vos cotisations, dont celles qui construisent votre retraite.`,
            },
            {
              eyebrow: "Ma pension sera imposée",
              href: links.impot({ revenu: Math.round(r.scenarioOptimal.pensionBruteMensuelle * 12) }),
              title: "Calculer l'impôt sur ma pension",
              description: `Avec ${formatEuros(r.scenarioOptimal.pensionBruteMensuelle * 12)}/an de pension, estimez votre impôt et votre TMI.`,
            },
          ]}
        />
      </div>
    </div>
  )
}
