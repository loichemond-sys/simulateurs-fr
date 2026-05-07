"use client"

import { useMemo, useState } from "react"
import { comparerStatuts, tjmMinimum, SecteurAE, StatutFreelance, StrategieRemu, FiscaliteDividendes } from "@/lib/calculateurs/freelance"
import { formatEuros, formatPercent } from "@/lib/format"
import { Field, SliderInput, SegmentedControl } from "./ui/Field"
import { NextSteps } from "./ui/NextSteps"
import { links, estimerBrutDepuisNet } from "@/lib/cross-links"

const STATUT_LABELS: Record<StatutFreelance, string> = {
  "auto-entrepreneur": "Auto-entrepreneur",
  "eurl": "EURL",
  "sasu": "SASU",
  "portage": "Portage salarial",
}

export interface TJMFreelanceProps {
  initial?: {
    tjm?: number
    jours?: number
    secteur?: SecteurAE
    acre?: boolean
    strategie?: StrategieRemu
  }
}

export function TJMFreelance({ initial }: TJMFreelanceProps = {}) {
  const [tjm, setTjm] = useState(initial?.tjm ?? 500)
  const [jours, setJours] = useState(initial?.jours ?? 15)
  const [secteur, setSecteur] = useState<SecteurAE>(initial?.secteur ?? "services")
  const [objectif, setObjectif] = useState(3000)
  const [acre, setAcre] = useState(initial?.acre ?? false)
  const [strategie, setStrategie] = useState<StrategieRemu>(initial?.strategie ?? "salaire")
  const [fiscaliteDiv, setFiscaliteDiv] = useState<FiscaliteDividendes>("pfu")

  const resultats = useMemo(
    () => comparerStatuts({
      tjm, joursParMois: jours, statut: "auto-entrepreneur", secteur,
      acre, strategie, fiscaliteDividendes: fiscaliteDiv,
    }),
    [tjm, jours, secteur, acre, strategie, fiscaliteDiv]
  )

  const tjmMin = useMemo(
    () => tjmMinimum(objectif, jours, "auto-entrepreneur", secteur),
    [objectif, jours, secteur]
  )

  const ca = tjm * jours
  const meilleur = [...resultats].sort((a, b) => b.netMensuel - a.netMensuel)[0]

  return (
    <div className="space-y-12">
      <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="card p-7 space-y-7">
            <Field label="TJM (Taux journalier moyen)">
              <SliderInput value={tjm} onChange={setTjm} min={150} max={2000} step={10} />
            </Field>

            <Field label="Jours facturés par mois" hint="En réalité, un freelance facture ~15j/mois (congés, prospection, formation)">
              <SliderInput value={jours} onChange={setJours} min={1} max={22} step={1} unit="j" />
            </Field>

            <Field label="Secteur (auto-entrepreneur)">
              <SegmentedControl
                value={secteur}
                onChange={setSecteur}
                options={[
                  { value: "services", label: "Services" },
                  { value: "commerce", label: "Commerce" },
                  { value: "artisan", label: "Artisan" },
                ]}
              />
            </Field>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acre}
                onChange={(e) => setAcre(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-forest flex-shrink-0"
              />
              <span className="text-sm text-ink-500 font-light leading-relaxed">
                <strong className="text-ink font-medium">ACRE</strong> — exonération de 50% des cotisations pendant la 1ʳᵉ année (auto-entrepreneur uniquement)
              </span>
            </label>

            <Field label="Stratégie de rémunération (EURL / SASU)" hint="Le mix salaire / dividendes change la fiscalité">
              <SegmentedControl
                value={strategie}
                onChange={setStrategie}
                options={[
                  { value: "salaire", label: "100% rému" },
                  { value: "mixte", label: "50/50" },
                  { value: "dividendes", label: "Max div." },
                ]}
              />
            </Field>

            {strategie !== "salaire" && (
              <Field label="Fiscalité des dividendes">
                <SegmentedControl
                  value={fiscaliteDiv}
                  onChange={setFiscaliteDiv}
                  options={[
                    { value: "pfu", label: "PFU 30%" },
                    { value: "bareme", label: "Barème IR" },
                  ]}
                />
              </Field>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="card p-8 lg:p-10">
            <p className="text-xs uppercase tracking-wide text-ink-400 mb-3">— Chiffre d&apos;affaires mensuel</p>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="font-display text-5xl lg:text-6xl font-medium tracking-tighter text-ink">
                {formatEuros(ca)}
              </span>
              <span className="text-sm text-ink-400 font-light">HT / mois</span>
            </div>

            <div className="pt-6 border-t border-ivory-300">
              <p className="text-xs uppercase tracking-wide text-ink-400 mb-2">— Meilleur statut pour vous</p>
              <p className="font-display text-2xl font-medium text-forest italic">
                {STATUT_LABELS[meilleur.statut]}
              </p>
              <p className="text-sm text-ink-500 mt-2 font-light">
                Net estimé : <strong className="text-ink">{formatEuros(meilleur.netMensuel)}/mois</strong> ({formatPercent(meilleur.ratioNetCA * 100)} du CA)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparatif des 4 statuts */}
      <div>
        <p className="text-xs uppercase tracking-wide text-ink-400 mb-5 font-medium">— Comparaison des 4 statuts</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {resultats.map((s, i) => (
            <div
              key={s.statut}
              className={`card p-6 ${s.statut === meilleur.statut ? "border-forest bg-forest/5" : ""}`}
            >
              <p className="text-bronze italic font-display text-sm mb-3">0{i + 1}</p>
              <p className="font-display text-lg font-medium tracking-tight mb-4">
                {STATUT_LABELS[s.statut]}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-400 font-light">Charges</span>
                  <span className="tabular-nums">{formatEuros(s.cotisations / 12)}</span>
                </div>
                {s.fraisGestion > 0 && (
                  <div className="flex justify-between">
                    <span className="text-ink-400 font-light">Frais gestion</span>
                    <span className="tabular-nums">{formatEuros(s.fraisGestion / 12)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-ink-400 font-light">Impôt</span>
                  <span className="tabular-nums">{formatEuros(s.impot / 12)}</span>
                </div>
                <div className="pt-3 mt-3 border-t border-ivory-300">
                  <p className="text-xs text-ink-400 mb-1">Net mensuel</p>
                  <p className="font-display text-2xl font-medium text-forest tabular-nums">
                    {formatEuros(s.netMensuel)}
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-xs text-ink-400">Protection :</span>
                  <span className="text-xs font-medium">{s.protectionSociale}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TJM minimum */}
      <div className="card p-8 bg-ink text-ivory border-ink">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-xs uppercase tracking-wide text-ivory/60 mb-3">— Calculer mon TJM minimum</p>
            <p className="font-display text-2xl font-medium mb-4">
              Pour vivre confortablement, quel TJM viser ?
            </p>
            <div>
              <label className="block text-xs uppercase tracking-wide text-ivory/60 mb-2">
                Objectif net mensuel
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="100"
                  value={objectif}
                  onChange={(e) => setObjectif(Number(e.target.value) || 0)}
                  className="w-40 rounded-xl border border-ivory/20 bg-transparent text-ivory px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-ivory/30"
                />
                <span className="text-sm text-ivory/60">€</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-ivory/60 mb-3">— TJM minimum recommandé</p>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-6xl font-medium tracking-tighter">
                {formatEuros(tjmMin)}
              </span>
              <span className="text-sm text-ivory/60">/ jour</span>
            </div>
            <p className="text-sm text-ivory/70 font-light mt-3">
              En auto-entrepreneur, sur {jours} jours facturés par mois, pour atteindre {formatEuros(objectif)} net.
            </p>
          </div>
        </div>
      </div>

      <NextSteps
        items={[
          {
            eyebrow: "Comparer",
            href: links.salaire({ brut: estimerBrutDepuisNet(meilleur.netMensuel) }),
            title: `À combien équivaut un CDI à ${formatEuros(meilleur.netMensuel)} net ?`,
            description: `Pour toucher autant en CDI, il faut un brut d'environ ${formatEuros(estimerBrutDepuisNet(meilleur.netMensuel))}/mois. Voir le détail des cotisations.`,
          },
          {
            eyebrow: "Étape suivante",
            href: links.impot({ revenu: Math.round(meilleur.netAnnuel) }),
            title: "Mon impôt sur ce revenu freelance",
            description: `Sur ${formatEuros(meilleur.netAnnuel)} net annuel, calculez votre IR avec quotient familial.`,
          },
        ]}
      />
    </div>
  )
}
