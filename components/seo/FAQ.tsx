"use client"

import { useState } from "react"

export interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  items: FAQItem[]
  title?: string
}

export function FAQ({ items, title = "Questions fréquentes" }: FAQProps) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs uppercase tracking-wide text-ink-400 mb-4">— Questions fréquentes</p>
        <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-12 max-w-3xl">
          {title}
        </h2>

        <div className="divide-y divide-ivory-300 border-t border-b border-ivory-300">
          {items.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full py-6 flex items-baseline justify-between gap-6 text-left group"
                aria-expanded={open === i}
              >
                <span className="font-display text-lg md:text-xl font-medium tracking-tight text-ink group-hover:text-forest transition-colors">
                  {item.question}
                </span>
                <span className={`text-2xl text-ink-400 transition-transform duration-300 flex-shrink-0 ${open === i ? "rotate-45" : ""}`}>
                  +
                </span>
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${
                  open === i ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-base text-ink-500 font-light leading-relaxed max-w-3xl">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FAQJsonLd({ items }: { items: FAQItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
