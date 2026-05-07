"use client"

import Link from "next/link"
import { useState } from "react"

export interface NextStepLink {
  href: string
  eyebrow: string
  title: string
  description: string
}

interface NextStepsProps {
  items: NextStepLink[]
  shareLabel?: string
}

export function NextSteps({ items, shareLabel = "Partager cette simulation" }: NextStepsProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // ignore
    }
  }

  return (
    <div className="mt-12 pt-12 border-t border-ivory-300">
      <div className="flex items-baseline justify-between gap-4 mb-8 flex-wrap">
        <p className="text-xs uppercase tracking-wide text-ink-400">— Aller plus loin</p>
        <button
          onClick={handleShare}
          className="text-sm text-ink-500 hover:text-forest transition-colors flex items-center gap-2"
        >
          <span className="inline-block w-4 h-4">
            {copied ? (
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 8l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="5" y="5" width="9" height="9" rx="1.5" />
                <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" />
              </svg>
            )}
          </span>
          {copied ? "Lien copié" : shareLabel}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="card p-6 group hover:shadow-soft-md transition-all duration-300 ease-out"
          >
            <p className="text-xs uppercase tracking-wide text-ink-400 mb-3">— {item.eyebrow}</p>
            <h3 className="font-display text-xl font-medium tracking-tight mb-2 group-hover:text-forest transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-ink-500 font-light leading-relaxed mb-3">
              {item.description}
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-ink group-hover:text-forest transition-colors">
              <span>Ouvrir le simulateur</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
