"use client"

import { useMemo, useRef, useState } from "react"
import { calculerPoints, type PointEpargne } from "@/lib/calculateurs/epargne"
import { formatEuros } from "@/lib/format"
import { Field, SliderInput, PeriodeToggle } from "./ui/Field"
import { NextSteps } from "./ui/NextSteps"
import { links } from "@/lib/cross-links"

// ─── Constantes graphe ─────────────────────────────────────────────────────
const VBW = 640
const VBH = 224
const PL = 54   // padding left (labels Y)
const PR = 12   // padding right
const PT = 12   // padding top
const PB = 32   // padding bottom (labels X)
const CW = VBW - PL - PR   // 574
const CH = VBH - PT - PB   // 180

// Couleurs (valeurs hex de globals.css)
const C_FOREST = "#1F4D3A"
const C_INK    = "#1A1815"
const C_BRONZE = "#A47148"
const C_GRID   = "#E8E2D5"
const C_LABEL  = "#7A7468"

// ─── Helpers ───────────────────────────────────────────────────────────────
function niceMax(v: number): number {
  if (v <= 0) return 1000
  const mag = Math.pow(10, Math.floor(Math.log10(v)))
  return Math.ceil((v * 1.05) / mag) * mag
}

function gridTicks(max: number, count = 4): number[] {
  const step = max / count
  return Array.from({ length: count + 1 }, (_, i) => i * step)
}

function fmtK(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1000) return `${Math.round(v / 1000)}k`
  return String(Math.round(v))
}

// ─── SVG Chart ─────────────────────────────────────────────────────────────
function Chart({
  points,
  hoveredIdx,
  onHover,
  onLeave,
  dureeAns,
}: {
  points: PointEpargne[]
  hoveredIdx: number | null
  onHover: (i: number) => void
  onLeave: () => void
  dureeAns: number
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const maxCap = niceMax(points[points.length - 1]?.capital ?? 0)
  const ticks = gridTicks(maxCap)

  const xOf = (t: number) => PL + (t / dureeAns) * CW
  const yOf = (v: number) => PT + CH - (v / maxCap) * CH
  const baseline = PT + CH

  // Build polyline point strings
  const capPts = points.map((p) => `${xOf(p.t).toFixed(1)},${yOf(p.capital).toFixed(1)}`).join(" ")
  const versePts = points.map((p) => `${xOf(p.t).toFixed(1)},${yOf(p.totalVerse).toFixed(1)}`).join(" ")

  // Area polygons
  const verseArea =
    `${xOf(0).toFixed(1)},${baseline} ` +
    versePts +
    ` ${xOf(dureeAns).toFixed(1)},${baseline}`

  const interetsArea =
    capPts +
    ` ${xOf(dureeAns).toFixed(1)},${yOf(points[points.length - 1].totalVerse).toFixed(1)} ` +
    points
      .slice()
      .reverse()
      .map((p) => `${xOf(p.t).toFixed(1)},${yOf(p.totalVerse).toFixed(1)}`)
      .join(" ")

  // Hover interaction
  const handleMove = (clientX: number) => {
    const svg = svgRef.current
    if (!svg) return
    try {
      const pt = svg.createSVGPoint()
      pt.x = clientX
      pt.y = 0
      const sp = pt.matrixTransform(svg.getScreenCTM()!.inverse())
      const frac = (sp.x - PL) / CW
      const idx = Math.max(0, Math.min(points.length - 1, Math.round(frac * (points.length - 1))))
      onHover(idx)
    } catch { /* ignore */ }
  }

  const hp = hoveredIdx !== null ? points[hoveredIdx] : null
  const hx = hp ? xOf(hp.t) : 0
  const hCapY = hp ? yOf(hp.capital) : 0
  const hVerseY = hp ? yOf(hp.totalVerse) : 0

  // Tooltip position: flip left when near right edge
  const tooltipFlip = hoveredIdx !== null && hoveredIdx > points.length * 0.6
  const tooltipX = tooltipFlip ? hx - 164 : hx + 14
  const tooltipY = 16

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VBW} ${VBH}`}
      className="w-full select-none"
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseLeave={onLeave}
      onTouchMove={(e) => {
        e.preventDefault()
        handleMove(e.touches[0].clientX)
      }}
    >
      {/* Grid lines + Y labels */}
      {ticks.map((v) => (
        <g key={v}>
          <line
            x1={PL} y1={yOf(v)} x2={PL + CW} y2={yOf(v)}
            stroke={C_GRID} strokeWidth={v === 0 ? 1.5 : 1}
          />
          <text
            x={PL - 6} y={yOf(v)} textAnchor="end" dominantBaseline="middle"
            fontSize={10} fill={C_LABEL}
          >
            {fmtK(v)}
          </text>
        </g>
      ))}

      {/* Versements area */}
      <polygon points={verseArea} fill={C_INK} fillOpacity={0.07} />

      {/* Intérêts area */}
      <polygon points={interetsArea} fill={C_FOREST} fillOpacity={0.2} />

      {/* Versements line */}
      <polyline points={versePts} fill="none" stroke={C_INK} strokeWidth={1.5} strokeOpacity={0.25} />

      {/* Capital line */}
      <polyline points={capPts} fill="none" stroke={C_FOREST} strokeWidth={2} />

      {/* X axis labels */}
      <text x={PL} y={VBH - 6} textAnchor="start" fontSize={10} fill={C_LABEL}>
        Aujourd&apos;hui
      </text>
      {dureeAns >= 4 && (
        <text x={PL + CW / 2} y={VBH - 6} textAnchor="middle" fontSize={10} fill={C_LABEL}>
          {Math.round(dureeAns / 2)} ans
        </text>
      )}
      <text x={PL + CW} y={VBH - 6} textAnchor="end" fontSize={10} fill={C_LABEL}>
        {dureeAns} ans
      </text>

      {/* Hover overlay */}
      {hp && (
        <>
          {/* Vertical guide */}
          <line
            x1={hx} y1={PT} x2={hx} y2={PT + CH}
            stroke={C_INK} strokeWidth={1} strokeOpacity={0.3}
            strokeDasharray="4 3"
          />
          {/* Dot on capital */}
          <circle cx={hx} cy={hCapY} r={4.5} fill={C_FOREST} stroke="white" strokeWidth={1.5} />
          {/* Dot on versements */}
          <circle cx={hx} cy={hVerseY} r={3} fill={C_INK} fillOpacity={0.35} stroke="white" strokeWidth={1} />

          {/* Tooltip box */}
          <rect
            x={tooltipX} y={tooltipY}
            width={152} height={74}
            rx={8}
            fill={C_INK} fillOpacity={0.9}
          />
          <text x={tooltipX + 12} y={tooltipY + 17} fontSize={10} fill={C_LABEL}>
            {hp.t === 0 ? "Aujourd'hui" : `Dans ${hp.t} an${hp.t > 1 ? "s" : ""}`}
          </text>
          <text x={tooltipX + 12} y={tooltipY + 35} fontSize={13} fill="white" fontWeight={500}>
            {formatEuros(hp.capital)}
          </text>
          <text x={tooltipX + 12} y={tooltipY + 52} fontSize={10} fill={C_FOREST}>
            +{formatEuros(hp.interets)} gains
          </text>
          <text x={tooltipX + 12} y={tooltipY + 67} fontSize={10} fill="white" fillOpacity={0.45}>
            {formatEuros(hp.totalVerse)} versés
          </text>
        </>
      )}
    </svg>
  )
}

// ─── Component principal ───────────────────────────────────────────────────
export interface SimulateurEpargneProps {
  initial?: { capital?: number; versement?: number; duree?: number; taux?: number }
}

export function SimulateurEpargne({ initial }: SimulateurEpargneProps = {}) {
  const [capital, setCapital] = useState(initial?.capital ?? 5000)
  const [versement, setVersement] = useState(initial?.versement ?? 200)
  const [duree, setDuree] = useState(initial?.duree ?? 15)
  const [taux, setTaux] = useState(initial?.taux ?? 5)
  const [periodicite, setPeriodicite] = useState<"mensuel" | "annuel">("mensuel")
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const points = useMemo(
    () => calculerPoints(capital, versement, taux, duree),
    [capital, versement, taux, duree]
  )

  const final = points[points.length - 1]
  const displayPt = hoveredIdx !== null ? points[hoveredIdx] : final
  const totalVerse = capital + versement * 12 * duree
  const ANNEE = new Date().getFullYear()

  return (
    <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
      {/* ── Inputs ── */}
      <div className="lg:col-span-2 space-y-8">
        <div className="card p-7 space-y-7">
          <Field label="Capital initial">
            <SliderInput value={capital} onChange={setCapital} min={0} max={100000} step={500} />
          </Field>

          <Field label="Versement régulier">
            <div className="flex justify-end mb-2">
              <PeriodeToggle value={periodicite} onChange={setPeriodicite} />
            </div>
            <SliderInput
              value={periodicite === "annuel" ? versement * 12 : versement}
              onChange={(v) => setVersement(periodicite === "annuel" ? Math.round(v / 12) : v)}
              min={0}
              max={periodicite === "annuel" ? 24000 : 2000}
              step={periodicite === "annuel" ? 600 : 50}
            />
          </Field>

          <Field label="Durée" hint={`Jusqu'en ${ANNEE + duree}`}>
            <SliderInput value={duree} onChange={setDuree} min={1} max={30} step={1} unit="ans" />
          </Field>

          <Field
            label="Taux d'intérêt annuel"
            hint={`Livret A 2,4 % · LEP 3,5 % · PEA ~8 % (historique)`}
          >
            <SliderInput value={taux} onChange={setTaux} min={0.5} max={15} step={0.25} unit="%" />
          </Field>
        </div>
      </div>

      {/* ── Résultats ── */}
      <div className="lg:col-span-3 space-y-6">
        {/* Capital final */}
        <div className="card p-8 lg:p-10">
          <p className="text-xs uppercase tracking-wide text-ink-400 mb-3">— Capital final</p>
          <div className="flex items-baseline gap-4 mb-2">
            <span className="font-display text-6xl lg:text-7xl font-medium tracking-tighter text-forest">
              {formatEuros(final.capital)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-6 mt-5 pt-5 border-t border-ivory-300">
            <div>
              <p className="text-xs text-ink-400 font-light mb-1 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-ink/20 shrink-0" />
                Versements
              </p>
              <p className="font-display text-2xl font-medium tabular-nums">{formatEuros(totalVerse)}</p>
            </div>
            <div>
              <p className="text-xs text-ink-400 font-light mb-1 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-forest shrink-0" style={{ opacity: 0.7 }} />
                Intérêts générés
              </p>
              <p className="font-display text-2xl font-medium tabular-nums text-forest">
                {formatEuros(final.interets)}
              </p>
            </div>
          </div>
        </div>

        {/* Graphe */}
        <div className="card p-6">
          {/* Données du point survolé */}
          <div className="flex items-baseline justify-between mb-5 gap-4">
            <div>
              <p className="text-xs text-ink-400 font-light mb-1">
                {displayPt.t === 0
                  ? "Aujourd'hui"
                  : `Dans ${displayPt.t} an${displayPt.t > 1 ? "s" : ""} · ${ANNEE + displayPt.t}`}
              </p>
              <p className="font-display text-2xl font-medium tabular-nums">
                {formatEuros(displayPt.capital)}
              </p>
            </div>
            <div className="flex gap-6 text-sm shrink-0">
              <div className="text-right">
                <p className="text-xs text-ink-400 font-light mb-0.5">Versé</p>
                <p className="tabular-nums font-medium">{formatEuros(displayPt.totalVerse)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-forest/70 font-light mb-0.5">Gains</p>
                <p className="tabular-nums font-medium text-forest">+{formatEuros(displayPt.interets)}</p>
              </div>
            </div>
          </div>

          <Chart
            points={points}
            hoveredIdx={hoveredIdx}
            onHover={setHoveredIdx}
            onLeave={() => setHoveredIdx(null)}
            dureeAns={duree}
          />
        </div>

        {/* Phrase résumé */}
        <div className="rounded-xl bg-ivory-200 px-6 py-5">
          <p className="text-sm text-ink-500 font-light leading-relaxed text-center">
            Avec un capital initial de{" "}
            <strong className="text-ink font-semibold">{formatEuros(capital)}</strong> et en versant{" "}
            <strong className="text-ink font-semibold">{formatEuros(versement)}/mois</strong> pendant{" "}
            <strong className="text-ink font-semibold">{duree} ans</strong> à{" "}
            <strong className="text-ink font-semibold">{taux} %</strong>, vous obtenez{" "}
            <strong className="text-forest font-semibold">{formatEuros(final.capital)}</strong> — dont{" "}
            <strong className="text-forest font-semibold">{formatEuros(final.interets)}</strong> de gains.
          </p>
        </div>

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
              href: links.impot({ revenu: Math.round(capital * 0.03 * 12) }),
              title: "Calculer mon impôt sur le revenu",
              description: `Les gains d'épargne sont soumis à la fiscalité. Estimez l'impact sur votre situation.`,
            },
          ]}
        />
      </div>
    </div>
  )
}
