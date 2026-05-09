"use client"

import { ReactNode, useRef, useState } from "react"

interface FieldProps {
  label: string
  hint?: string
  children: ReactNode
}

export function Field({ label, hint, children }: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-ink-400 uppercase tracking-wide mb-2">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-ink-400 mt-2 font-light">{hint}</p>}
    </div>
  )
}

interface SliderInputProps {
  value: number
  onChange: (n: number) => void
  min: number
  max: number
  step?: number
  unit?: string
}

export function SliderInput({ value, onChange, min, max, step = 1, unit = "€" }: SliderInputProps) {
  const [inputStr, setInputStr] = useState(String(value))
  const prevValueRef = useRef(value)

  // Sync display when value changes from slider or external source
  if (prevValueRef.current !== value) {
    prevValueRef.current = value
    setInputStr(String(value))
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <input
          type="number"
          value={inputStr}
          onChange={(e) => {
            setInputStr(e.target.value)
            const n = parseFloat(e.target.value)
            if (!isNaN(n) && e.target.value !== "") onChange(n)
          }}
          onBlur={() => {
            const n = parseFloat(inputStr)
            if (isNaN(n) || inputStr === "") {
              setInputStr(String(value))
            } else {
              onChange(n)
            }
          }}
          onFocus={(e) => e.target.select()}
          className="font-display text-2xl font-medium tracking-tight bg-transparent border-0 outline-none text-ink w-32 focus:ring-0 p-0"
        />
        <span className="text-sm text-ink-400 font-light">{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="flex justify-between mt-2 text-xs text-ink-400 font-light">
        <span>{min.toLocaleString("fr-FR")}{unit !== "%" ? ` ${unit}` : "%"}</span>
        <span>{max.toLocaleString("fr-FR")}{unit !== "%" ? ` ${unit}` : "%"}</span>
      </div>
    </div>
  )
}

export function PeriodeToggle({
  value,
  onChange,
}: {
  value: "mensuel" | "annuel"
  onChange: (v: "mensuel" | "annuel") => void
}) {
  return (
    <div className="inline-flex rounded-lg overflow-hidden border border-ivory-300 text-xs font-medium">
      {(["mensuel", "annuel"] as const).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={`px-3 py-1.5 transition-colors ${
            value === p ? "bg-ink text-ivory" : "text-ink-400 hover:text-ink bg-white"
          }`}
        >
          {p === "mensuel" ? "/ mois" : "/ an"}
        </button>
      ))}
    </div>
  )
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
}) {
  return (
    <div className="inline-flex bg-ivory-200 rounded-full p-1 w-full">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
            value === opt.value
              ? "bg-ink text-ivory shadow-soft"
              : "text-ink-500 hover:text-ink"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
