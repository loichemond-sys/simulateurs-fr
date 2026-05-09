"use client"

import { useMemo, useState } from "react"
import { calculerIndemnite, calculerCarenceARE, TypeRupture } from "@/lib/calculateurs/licenciement"
import { formatEuros } from "@/lib/format"
import { Field, SliderInput, PeriodeToggle } from "./ui/Field"
import { NextSteps } from "./ui/NextSteps"
import { links } from "@/lib/cross-links"

export interface LicenciementRuptureProps {
  initial?: {
    type?: TypeRupture
    salaire?: number
    annees?: number
    mois?: number
  }
}

export function LicenciementRupture({ initial }: LicenciementRuptureProps = {}) {
  const [type, setType] = useState<TypeRupture>(initial?.type ?? "licenciement-personnel")
  const [salaire, setSalaire] = useState(initial?.salaire ?? 2800)
  const [periodicite, setPeriodicite] = useState<"mensuel" | "annuel">("mensuel")
  const [annees, setAnnees] = useState(initial?.annees ?? 5)
  const [mois, setMois] = useState(initial?.mois ?? 0)
  const [montantNegocie, setMontantNegocie] = useState(0)

  const r = useMemo(() => calculerIndemnite(type, salaire, salaire, annees, mois), [type, salaire, annees, mois])

  const supraLegal = Math.max(0, montantNegocie - r.indemniteLegale)
  const carenceSupp = calculerCarenceARE(supraLegal)

  return (
    <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
      <div className="lg:col-span-2 space-y-8">
        <div className="card p-7 space-y-7">
          <Field label="Type de rupture">
            <div className="flex flex-col gap-2">
              {[
                { value: "licenciement-personnel", label: "Licenciement personnel" },
                { value: "licenciement-economique", label: "Licenciement économique" },
                { value: "rupture-conventionnelle", label: "Rupture conventionnelle" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setType(opt.value as TypeRupture)}
                  className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                    type === opt.value
                      ? "border-forest bg-forest/5 text-forest font-medium"
                      : "border-ivory-300 text-ink-500 hover:border-ink-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Salaire de référence" hint={periodicite === "annuel" ? `soit ${salaire.toLocaleString("fr-FR")} €/mois — moyenne brute des 12 derniers mois` : "Moyenne brute des 12 derniers mois"}>
            <div className="flex justify-end mb-2">
              <PeriodeToggle value={periodicite} onChange={setPeriodicite} />
            </div>
            <SliderInput
              value={periodicite === "annuel" ? salaire * 12 : salaire}
              onChange={(v) => setSalaire(periodicite === "annuel" ? Math.round(v / 12) : v)}
              min={periodicite === "annuel" ? 16800 : 1400}
              max={periodicite === "annuel" ? 180000 : 15000}
              step={periodicite === "annuel" ? 600 : 50}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Ancienneté (années)">
              <SliderInput value={annees} onChange={setAnnees} min={0} max={45} step={1} unit="ans" />
            </Field>
            <Field label="Mois supplémentaires">
              <SliderInput value={mois} onChange={setMois} min={0} max={11} step={1} unit="mois" />
            </Field>
          </div>

          <Field label="Montant négocié (optionnel)" hint="Pour comparer avec l'indemnité légale minimale">
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="100"
                min="0"
                value={montantNegocie}
                onChange={(e) => setMontantNegocie(Number(e.target.value) || 0)}
                className="flex-1 rounded-xl border border-ivory-300 bg-white px-4 py-3 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest"
              />
              <span className="text-sm text-ink-400 font-light">€</span>
            </div>
          </Field>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-6">
        {!r.eligible ? (
          <div className="card p-10 text-center">
            <p className="font-display text-3xl font-medium tracking-tight text-warning mb-3">
              Ancienneté insuffisante
            </p>
            <p className="text-ink-500 font-light max-w-md mx-auto">{r.raisonNonEligible}</p>
          </div>
        ) : (
          <>
            <div className="card p-8 lg:p-10">
              <p className="text-xs uppercase tracking-wide text-ink-400 mb-3">— Indemnité légale minimale</p>
              <div className="flex items-baseline gap-4 mb-2">
                <span className="font-display text-6xl lg:text-7xl font-medium tracking-tighter text-forest">
                  {formatEuros(r.indemniteLegale)}
                </span>
              </div>
              <p className="font-display text-xl text-ink-500 italic mt-2">
                pour {r.ancienneteAnnees.toFixed(1)}{" "}ans d&apos;ancienneté
              </p>
              <p className="text-sm text-ink-500 mt-6 font-light leading-relaxed max-w-md">
                Cette indemnité est exonérée d&apos;impôt et de cotisations sociales (dans la limite légale).
                Votre convention collective peut prévoir un montant supérieur — vérifiez auprès de votre RH.
              </p>
            </div>

            <div className="card p-7">
              <p className="text-xs uppercase tracking-wide text-ink-400 mb-5">— Détail du calcul</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-500 font-light">Jusqu&apos;à 10 ans : 1/4 mois × {Math.min(r.ancienneteAnnees, 10).toFixed(1)} ans × {formatEuros(r.salaireReference)}</span>
                  <span className="font-medium tabular-nums">{formatEuros(r.details.tranche1)}</span>
                </div>
                {r.details.tranche2 > 0 && (
                  <div className="flex justify-between">
                    <span className="text-ink-500 font-light">Au-delà de 10 ans : 1/3 mois × {(r.ancienneteAnnees - 10).toFixed(1)} ans × {formatEuros(r.salaireReference)}</span>
                    <span className="font-medium tabular-nums">{formatEuros(r.details.tranche2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-ivory-300">
                  <span className="font-medium">Total</span>
                  <span className="font-display text-lg font-medium tabular-nums">{formatEuros(r.indemniteLegale)}</span>
                </div>
              </div>
            </div>

            {montantNegocie > 0 && (
              <div className="card p-7">
                <p className="text-xs uppercase tracking-wide text-ink-400 mb-5">— Comparaison avec votre négociation</p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink-500 font-light">Indemnité légale</span>
                    <span className="tabular-nums">{formatEuros(r.indemniteLegale)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-500 font-light">Montant négocié</span>
                    <span className="tabular-nums">{formatEuros(montantNegocie)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-ivory-300">
                    <span className="font-medium">Part supra-légale</span>
                    <span className={`font-display text-lg font-medium tabular-nums ${supraLegal > 0 ? "text-success" : "text-danger"}`}>
                      {supraLegal > 0 ? "+" : ""}{formatEuros(supraLegal)}
                    </span>
                  </div>
                </div>
                {carenceSupp > 0 && (
                  <p className="mt-4 text-xs text-ink-400 font-light leading-relaxed">
                    Cette part supra-légale entraînera un délai de carence de <strong className="text-ink">{carenceSupp} jours</strong> avant le début de votre indemnisation chômage.
                  </p>
                )}
              </div>
            )}

            <div className="rounded-xl border border-ivory-300 bg-ivory-50 p-5">
              <p className="text-xs uppercase tracking-wide text-ink-400 mb-2">— Bon à savoir</p>
              <p className="text-sm text-ink-500 font-light leading-relaxed">
                Le plafond d&apos;exonération de cotisations sociales est de {formatEuros(r.exonerationCotisations)} (2 PASS).
                Au-delà, les indemnités sont soumises à cotisations.
              </p>
            </div>

            <NextSteps
              items={[
                {
                  eyebrow: "Étape suivante",
                  href: links.chomage({
                    salaire: Math.round(salaire),
                    duree: Math.min(Math.round(annees * 12 + mois), 36),
                    age: 35,
                    motif: type === "rupture-conventionnelle" ? "rupture-conventionnelle" : "licenciement",
                  }),
                  title: "Mes droits chômage après cette rupture",
                  description: `Avec ${formatEuros(salaire)} brut et ${r.ancienneteAnnees.toFixed(1)} ans d'ancienneté, estimez votre ARE et la durée d'indemnisation.`,
                },
                {
                  eyebrow: "Mon salaire actuel",
                  href: links.salaire({ brut: Math.round(salaire) }),
                  title: "Décoder mon salaire actuel",
                  description: "Comprenez précisément ce que vous touchez aujourd'hui en net avant le départ.",
                },
              ]}
            />
          </>
        )}
      </div>
    </div>
  )
}
