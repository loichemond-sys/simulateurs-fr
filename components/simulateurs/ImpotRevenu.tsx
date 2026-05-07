"use client"

import { useMemo, useState } from "react"
import { calculerIR, calculerParts, SituationFamiliale } from "@/lib/calculateurs/impot"
import { formatEuros, formatPercent } from "@/lib/format"
import { Field, SliderInput } from "./ui/Field"
import { NextSteps } from "./ui/NextSteps"
import { links } from "@/lib/cross-links"

export interface ImpotRevenuProps {
  initial?: {
    revenu?: number
    situation?: SituationFamiliale
    enfants?: number
  }
}

export function ImpotRevenu({ initial }: ImpotRevenuProps = {}) {
  const [revenu, setRevenu] = useState(initial?.revenu ?? 35000)
  const [situation, setSituation] = useState<SituationFamiliale>(initial?.situation ?? "celibataire")
  const [enfants, setEnfants] = useState(initial?.enfants ?? 0)
  const [parentIsole, setParentIsole] = useState(false)

  const parts = useMemo(() => calculerParts(situation, enfants, parentIsole), [situation, enfants, parentIsole])
  const r = useMemo(() => calculerIR(revenu, parts), [revenu, parts])

  // Pour la visualisation : revenu, IR, autres cotis (estimées 22% pour un salarié)
  const cotisationsSalariales = revenu * 0.22 // estimation très simplifiée
  const netDisponible = revenu - r.impotNet

  return (
    <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
      <div className="lg:col-span-2 space-y-8">
        <div className="card p-7 space-y-7">
          <Field label="Revenu net annuel" hint="Salaires nets imposables (avant abattement de 10%)">
            <SliderInput value={revenu} onChange={setRevenu} min={10000} max={250000} step={500} />
          </Field>

          <Field label="Situation familiale">
            <div className="flex flex-col gap-2">
              {[
                { value: "celibataire", label: "Célibataire" },
                { value: "marie", label: "Marié(e) ou Pacsé(e)" },
                { value: "divorce-veuf", label: "Divorcé(e) / Veuf(ve)" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSituation(opt.value as SituationFamiliale)}
                  className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                    situation === opt.value
                      ? "border-forest bg-forest/5 text-forest font-medium"
                      : "border-ivory-300 text-ink-500 hover:border-ink-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Enfants à charge" hint="0,5 part par enfant pour les 2 premiers, puis 1 part">
            <SliderInput value={enfants} onChange={setEnfants} min={0} max={6} step={1} unit={enfants > 1 ? "enf." : "enf."} />
          </Field>

          {situation !== "marie" && enfants > 0 && (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={parentIsole}
                onChange={(e) => setParentIsole(e.target.checked)}
                className="w-4 h-4 accent-forest"
              />
              <span className="text-sm text-ink-500 font-light">
                Parent isolé (+0,5 part)
              </span>
            </label>
          )}

          <div className="rounded-xl bg-ivory-200 p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-ink-400 mb-1">Quotient familial</p>
            <p className="font-display text-2xl font-medium tabular-nums">{parts} parts</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-6">
        {/* Résultat principal */}
        <div className="card p-8 lg:p-10">
          <p className="text-xs uppercase tracking-wide text-ink-400 mb-3">— Impôt sur le revenu annuel</p>
          <div className="flex items-baseline gap-4 mb-2">
            <span className="font-display text-6xl lg:text-7xl font-medium tracking-tighter text-forest">
              {formatEuros(r.impotNet)}
            </span>
            <span className="text-sm text-ink-400 font-light">/ an</span>
          </div>
          <p className="font-display text-xl text-ink-500 italic mt-2">
            soit {formatEuros(r.mensualitePAS)} prélevés chaque mois
          </p>
          {r.decote > 0 && (
            <p className="text-sm text-success mt-3 font-light">
              Vous bénéficiez d&apos;une décote de {formatEuros(r.decote)}.
            </p>
          )}
        </div>

        {/* Taux moyen / TMI */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-6">
            <p className="text-xs uppercase tracking-wide text-ink-400 mb-2">— Taux moyen</p>
            <p className="font-display text-3xl font-medium tabular-nums">{formatPercent(r.tauxMoyen)}</p>
            <p className="text-xs text-ink-400 mt-1 font-light">de votre revenu en impôts</p>
          </div>
          <div className="card p-6 border-forest/20 bg-forest/5">
            <p className="text-xs uppercase tracking-wide text-forest/60 mb-2">— TMI</p>
            <p className="font-display text-3xl font-medium tabular-nums text-forest">{formatPercent(r.tauxMarginal, 0)}</p>
            <p className="text-xs text-forest/60 mt-1 font-light">tranche marginale d&apos;imposition</p>
          </div>
        </div>

        {/* Détail tranches */}
        <div className="card p-7">
          <p className="text-xs uppercase tracking-wide text-ink-400 mb-5">— Détail par tranche (sur quotient familial)</p>
          <div className="space-y-3">
            {r.detailsTranches.map((t, i) => (
              <div key={i} className="flex items-baseline gap-4">
                <div className="flex-1">
                  <p className="text-sm text-ink-500 font-light">
                    {t.taux === 0
                      ? `Jusqu'à ${formatEuros(t.max)}`
                      : t.max === Infinity
                      ? `Au-delà de ${formatEuros(t.min)}`
                      : `De ${formatEuros(t.min)} à ${formatEuros(t.max)}`}
                  </p>
                </div>
                <div className="w-16 text-right">
                  <span className="text-xs font-mono text-ink-400">{formatPercent(t.taux * 100, 0)}</span>
                </div>
                <div className="w-24 text-right">
                  <span className="font-medium tabular-nums">{formatEuros(t.montantTranche)}</span>
                </div>
              </div>
            ))}
            <div className="pt-3 mt-2 border-t border-ivory-300 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-ink-500 font-light">Impôt brut</span>
                <span className="tabular-nums">{formatEuros(r.impotBrut)}</span>
              </div>
              {r.decote > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-ink-500 font-light">Décote</span>
                  <span className="tabular-nums text-success">−{formatEuros(r.decote)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-ivory-300">
                <span className="font-medium">Impôt net</span>
                <span className="font-display text-lg font-medium tabular-nums">{formatEuros(r.impotNet)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visualisation */}
        <div className="card p-7">
          <p className="text-xs uppercase tracking-wide text-ink-400 mb-5">— Répartition de votre revenu net annuel</p>
          <div className="h-3 rounded-full overflow-hidden flex bg-ivory-200">
            <div
              className="bg-forest h-full"
              style={{ width: `${(netDisponible / revenu) * 100}%` }}
            />
            <div
              className="bg-bronze h-full"
              style={{ width: `${(r.impotNet / revenu) * 100}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-forest"></span>
                <span className="text-ink-500 font-light">Net après impôt</span>
              </div>
              <p className="font-display text-xl font-medium tabular-nums">{formatEuros(netDisponible)}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-bronze"></span>
                <span className="text-ink-500 font-light">Impôt</span>
              </div>
              <p className="font-display text-xl font-medium tabular-nums">{formatEuros(r.impotNet)}</p>
            </div>
          </div>
        </div>

        {/* Explication */}
        <div className="rounded-xl border border-ivory-300 bg-ivory-50 p-6">
          <p className="text-xs uppercase tracking-wide text-ink-400 mb-3">— En français simple</p>
          <p className="text-sm text-ink-500 font-light leading-relaxed">
            Votre TMI est de <strong className="text-ink">{formatPercent(r.tauxMarginal, 0)}</strong> — cela ne veut pas dire que {formatPercent(r.tauxMarginal, 0)} de votre revenu est taxé,
            mais seulement la partie au-dessus de la tranche correspondante.
            Votre <strong className="text-ink">taux moyen réel</strong> est de {formatPercent(r.tauxMoyen)} : c&apos;est la part réelle de votre revenu qui part en impôt sur le revenu.
          </p>
        </div>

        <NextSteps
          items={[
            {
              eyebrow: "À la source",
              href: links.salaire({
                brut: Math.round(revenu / 12 / 0.78),
                pas: Math.round(r.tauxMoyen * 10) / 10,
              }),
              title: "Mon salaire net après prélèvement",
              description: `Visualisez l'effet du PAS de ${formatPercent(r.tauxMoyen)} sur votre fiche de paie mensuelle.`,
            },
            {
              eyebrow: "Si je deviens freelance",
              href: links.freelance({}),
              title: "Comparer avec un revenu freelance",
              description: "Voyez à quel TJM il faut viser pour conserver votre niveau de vie en freelance.",
            },
          ]}
        />
      </div>
    </div>
  )
}
