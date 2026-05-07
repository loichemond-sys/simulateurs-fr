"use client"

import { useMemo, useState } from "react"
import { calculerARE, MotifRupture } from "@/lib/calculateurs/chomage"
import { formatEuros } from "@/lib/format"
import { Field, SliderInput } from "./ui/Field"
import { NextSteps } from "./ui/NextSteps"
import { links } from "@/lib/cross-links"

export interface ChomageAREProps {
  initial?: {
    salaire?: number
    duree?: number
    age?: number
    motif?: MotifRupture
  }
}

export function ChomageARE({ initial }: ChomageAREProps = {}) {
  const [salaire, setSalaire] = useState(initial?.salaire ?? 2500)
  const [duree, setDuree] = useState(initial?.duree ?? 18)
  const [age, setAge] = useState(initial?.age ?? 35)
  const [motif, setMotif] = useState<MotifRupture>(initial?.motif ?? "licenciement")

  const r = useMemo(() => calculerARE(salaire, duree, age, motif), [salaire, duree, age, motif])

  return (
    <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
      <div className="lg:col-span-2 space-y-8">
        <div className="card p-7 space-y-7">
          <Field label="Salaire brut mensuel moyen" hint="Sur les 12 derniers mois">
            <SliderInput value={salaire} onChange={setSalaire} min={1400} max={12000} step={50} />
          </Field>

          <Field label="Durée d'emploi" hint={`${duree} mois travaillés sur les 24 derniers mois`}>
            <SliderInput value={duree} onChange={setDuree} min={0} max={36} step={1} unit="mois" />
          </Field>

          <Field label="Âge">
            <SliderInput value={age} onChange={setAge} min={18} max={67} step={1} unit="ans" />
          </Field>

          <Field label="Motif de rupture">
            <div className="flex flex-col gap-2">
              {[
                { value: "licenciement", label: "Licenciement" },
                { value: "rupture-conventionnelle", label: "Rupture conventionnelle" },
                { value: "fin-cdd", label: "Fin de CDD" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMotif(opt.value as MotifRupture)}
                  className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                    motif === opt.value
                      ? "border-forest bg-forest/5 text-forest font-medium"
                      : "border-ivory-300 text-ink-500 hover:border-ink-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Field>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-6">
        {!r.eligible ? (
          <div className="card p-10 text-center">
            <p className="font-display text-3xl font-medium tracking-tight text-warning mb-3">
              Pas encore éligible
            </p>
            <p className="text-ink-500 font-light max-w-md mx-auto">{r.raisonNonEligible}</p>
          </div>
        ) : (
          <>
            <div className="card p-8 lg:p-10">
              <p className="text-xs uppercase tracking-wide text-ink-400 mb-3">— Allocation mensuelle estimée</p>
              <div className="flex items-baseline gap-4 mb-2">
                <span className="font-display text-6xl lg:text-7xl font-medium tracking-tighter text-forest">
                  {formatEuros(r.areMensuelle)}
                </span>
                <span className="text-sm text-ink-400 font-light">/ mois</span>
              </div>
              <p className="font-display text-xl text-ink-500 italic mt-2">
                pendant {r.dureeIndemnisationMois} mois maximum
              </p>
              <p className="text-sm text-ink-500 mt-6 font-light leading-relaxed max-w-md">
                Avec un salaire de {formatEuros(salaire)}/mois et {duree}{" "}mois d&apos;ancienneté,
                vous toucherez environ {formatEuros(r.areMensuelle)}/mois pendant {r.dureeIndemnisationMois}{" "}mois.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="card p-6">
                <p className="text-xs uppercase tracking-wide text-ink-400 mb-2">— Total estimé</p>
                <p className="font-display text-2xl font-medium tabular-nums">{formatEuros(r.totalEstime)}</p>
                <p className="text-xs text-ink-400 mt-1 font-light">sur toute la durée</p>
              </div>
              <div className="card p-6">
                <p className="text-xs uppercase tracking-wide text-ink-400 mb-2">— Délai de carence</p>
                <p className="font-display text-2xl font-medium tabular-nums">{r.delaiCarenceJours} j</p>
                <p className="text-xs text-ink-400 mt-1 font-light">avant 1ʳᵉ indemnisation</p>
              </div>
            </div>

            <div className="card p-7">
              <p className="text-xs uppercase tracking-wide text-ink-400 mb-5">— Détail du calcul</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-500 font-light">Salaire journalier de référence (SJR)</span>
                  <span className="font-medium tabular-nums">{formatEuros(r.sjr, 2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500 font-light">Formule 1 : 12,95 € + 40% du SJR</span>
                  <span className="tabular-nums">{formatEuros(r.formule1, 2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500 font-light">Formule 2 : 57% du SJR</span>
                  <span className="tabular-nums">{formatEuros(r.formule2, 2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-ivory-300">
                  <span className="font-medium">ARE journalière retenue</span>
                  <span className="font-display text-lg font-medium tabular-nums">{formatEuros(r.areJournaliere, 2)}</span>
                </div>
              </div>
            </div>

            {r.degressivite && (
              <div className="rounded-xl border border-warning/20 bg-warning-bg p-5">
                <p className="text-sm font-medium text-warning mb-1">Dégressivité possible</p>
                <p className="text-xs text-ink-500 font-light leading-relaxed">
                  Votre salaire dépasse 4 537 €/mois et vous avez moins de 55 ans :
                  votre allocation pourra être réduite de 30% à partir du 7ᵉ mois.
                </p>
              </div>
            )}

            <NextSteps
              items={[
                {
                  eyebrow: "Étape suivante",
                  href: links.impot({ revenu: Math.round(r.areMensuelle * 12) }),
                  title: "L'ARE est imposable : combien d'impôt ?",
                  description: `Sur ${formatEuros(r.areMensuelle * 12)} d'allocation annuelle, estimez l'impôt prélevé chaque mois.`,
                },
                {
                  eyebrow: "Comparer",
                  href: links.salaire({ brut: Math.round(salaire) }),
                  title: "Mon salaire net actuel",
                  description: "Voir le détail de votre salaire net actuel pour mesurer la baisse anticipée.",
                },
              ]}
            />
          </>
        )}
      </div>
    </div>
  )
}
