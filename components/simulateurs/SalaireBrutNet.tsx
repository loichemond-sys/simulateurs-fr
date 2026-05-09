"use client"

import { useMemo, useState } from "react"
import { calculerSalaireNet, StatutSalarie } from "@/lib/calculateurs/salaire"
import { formatEuros, formatPercent } from "@/lib/format"
import { Field, SliderInput, SegmentedControl, PeriodeToggle } from "./ui/Field"
import { NextSteps } from "./ui/NextSteps"
import { links } from "@/lib/cross-links"

export interface SalaireBrutNetProps {
  initial?: {
    brut?: number
    statut?: StatutSalarie
    temps?: number
    pas?: number
    mutuelle?: number
  }
}

export function SalaireBrutNet({ initial }: SalaireBrutNetProps = {}) {
  const [brut, setBrut] = useState(initial?.brut ?? 3000)
  const [periodicite, setPeriodicite] = useState<"mensuel" | "annuel">("mensuel")
  const [statut, setStatut] = useState<StatutSalarie>(initial?.statut ?? "non-cadre")
  const [tempsPartiel, setTempsPartiel] = useState(initial?.temps ?? 100)
  const [tauxPAS, setTauxPAS] = useState(initial?.pas ?? 0)
  const [mutuelle, setMutuelle] = useState(initial?.mutuelle ?? 0)

  const r = useMemo(
    () => calculerSalaireNet(brut, statut, tempsPartiel, tauxPAS, mutuelle),
    [brut, statut, tempsPartiel, tauxPAS, mutuelle]
  )

  return (
    <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
      {/* Inputs */}
      <div className="lg:col-span-2 space-y-8">
        <div className="card p-7 space-y-7">
          <Field label="Salaire brut" hint={periodicite === "annuel" ? `soit ${(brut).toLocaleString("fr-FR")} €/mois` : undefined}>
            <div className="flex justify-end mb-2">
              <PeriodeToggle value={periodicite} onChange={setPeriodicite} />
            </div>
            <SliderInput
              value={periodicite === "annuel" ? brut * 12 : brut}
              onChange={(v) => setBrut(periodicite === "annuel" ? Math.round(v / 12) : v)}
              min={periodicite === "annuel" ? 16800 : 1400}
              max={periodicite === "annuel" ? 180000 : 15000}
              step={periodicite === "annuel" ? 600 : 50}
            />
          </Field>

          <Field label="Statut">
            <SegmentedControl
              value={statut}
              onChange={setStatut}
              options={[
                { value: "non-cadre", label: "Non-cadre" },
                { value: "cadre", label: "Cadre" },
              ]}
            />
          </Field>

          <Field label="Temps de travail" hint={tempsPartiel < 100 ? `${tempsPartiel}% du temps plein` : "Temps plein"}>
            <SliderInput value={tempsPartiel} onChange={setTempsPartiel} min={20} max={100} step={10} unit="%" />
          </Field>

          <Field label="Taux de prélèvement à la source" hint="Indiqué sur votre dernier avis d'imposition (optionnel)">
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.1"
                min="0"
                max="45"
                value={tauxPAS}
                onChange={(e) => setTauxPAS(Number(e.target.value) || 0)}
                className="w-24 rounded-xl border border-ivory-300 bg-white px-4 py-3 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest"
              />
              <span className="text-sm text-ink-400 font-light">%</span>
            </div>
          </Field>

          <Field label="Mutuelle santé (part salarié)" hint="Cotisation mensuelle mutuelle obligatoire (entre 15 et 60 € selon entreprise)">
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="5"
                min="0"
                max="200"
                value={mutuelle}
                onChange={(e) => setMutuelle(Number(e.target.value) || 0)}
                className="w-24 rounded-xl border border-ivory-300 bg-white px-4 py-3 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest"
              />
              <span className="text-sm text-ink-400 font-light">€/mois</span>
            </div>
          </Field>
        </div>
      </div>

      {/* Résultats */}
      <div className="lg:col-span-3 space-y-6">
        {/* Net principal */}
        <div className="card p-8 lg:p-10">
          <p className="text-xs uppercase tracking-wide text-ink-400 mb-3">— Salaire net mensuel</p>
          <div className="flex items-baseline gap-4 mb-2">
            <span className="font-display text-6xl lg:text-7xl font-medium tracking-tighter text-forest">
              {formatEuros(r.netAvantImpot)}
            </span>
            <span className="text-sm text-ink-400 font-light">avant impôt</span>
          </div>
          {tauxPAS > 0 && (
            <p className="font-display text-xl text-ink-500 italic mt-2">
              soit {formatEuros(r.netApresImpot)} après prélèvement à la source
            </p>
          )}
          <p className="text-sm text-ink-500 mt-6 font-light leading-relaxed max-w-md">
            Sur {formatEuros(r.brut)} brut, vous recevez {formatEuros(r.netAvantImpot)} net.
            Les {formatEuros(r.totalCotisations)} restants financent votre retraite, santé et chômage.
          </p>
        </div>

        {/* Détail cotisations */}
        <div className="card p-7">
          <p className="text-xs uppercase tracking-wide text-ink-400 mb-5">— Détail des cotisations salariales</p>
          <div className="space-y-2.5">
            {r.cotisations.map((c, i) => (
              <div key={i} className="flex items-baseline justify-between gap-4 text-sm">
                <span className="text-ink-500 font-light">{c.label}</span>
                <div className="flex items-baseline gap-3 flex-shrink-0">
                  <span className="text-xs text-ink-400 font-mono">{formatPercent(c.taux * 100, 2)}</span>
                  <span className="text-ink font-medium tabular-nums w-20 text-right">{formatEuros(c.montant)}</span>
                </div>
              </div>
            ))}
            <div className="pt-3 mt-3 border-t border-ivory-300 flex items-baseline justify-between text-sm">
              <span className="font-medium text-ink">Total cotisations</span>
              <span className="font-display text-lg font-medium tabular-nums text-ink">{formatEuros(r.totalCotisations)}</span>
            </div>
          </div>
        </div>

        {/* Coût employeur */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-6">
            <p className="text-xs uppercase tracking-wide text-ink-400 mb-2">— Charges patronales</p>
            <p className="font-display text-2xl font-medium tabular-nums">{formatEuros(r.chargesPatronales)}</p>
            <p className="text-xs text-ink-400 mt-1 font-light">~42% du brut (estimation)</p>
          </div>
          <div className="card p-6 bg-forest text-ivory border-forest">
            <p className="text-xs uppercase tracking-wide text-ivory/60 mb-2">— Coût total employeur</p>
            <p className="font-display text-2xl font-medium tabular-nums">{formatEuros(r.coutEmployeur)}</p>
            <p className="text-xs text-ivory/60 mt-1 font-light">par mois</p>
          </div>
        </div>

        <NextSteps
          items={[
            {
              eyebrow: "Étape suivante",
              href: links.impot({ revenu: Math.round(r.netAvantImpot * 12) }),
              title: "Calculer mon impôt sur ce revenu",
              description: `Avec ${formatEuros(r.netAvantImpot * 12)} net annuel, estimez votre IR, votre TMI et votre taux moyen.`,
            },
            {
              eyebrow: "Dans 20 ans",
              href: links.retraite({ salaire: Math.round(brut * 12) }),
              title: "Estimer ma pension de retraite",
              description: `Avec ${formatEuros(brut)} brut mensuel, trouvez votre âge optimal et votre pension estimée.`,
            },
          ]}
        />
      </div>
    </div>
  )
}
