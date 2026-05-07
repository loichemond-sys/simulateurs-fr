import { ReactNode } from "react"

interface ArticleProps {
  eyebrow: string
  title: string
  motCle: string
  children: ReactNode
}

export function Article({ eyebrow, title, motCle, children }: ArticleProps) {
  const [before, after] = title.split(motCle)
  return (
    <section className="px-6 pb-24">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs uppercase tracking-wide text-ink-400 mb-4">— {eyebrow}</p>
        <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-14">
          {before}
          <span className="text-forest italic">{motCle}</span>
          {after}
        </h2>
        <div className="prose-article font-body text-ink-500 font-light leading-relaxed text-base md:text-lg space-y-6">
          {children}
        </div>
      </div>
    </section>
  )
}

interface SectionProps {
  numero?: string
  titre: string
  children: ReactNode
}

export function ArticleSection({ numero, titre, children }: SectionProps) {
  return (
    <div className="space-y-4 pt-4">
      {numero && (
        <span className="font-display italic text-bronze text-base">{numero}</span>
      )}
      <h3 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink">
        {titre}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

export function ArticleAside({ children }: { children: ReactNode }) {
  return (
    <aside className="rounded-xl border border-ivory-300 bg-ivory-50 p-6 my-8 text-sm md:text-base">
      <p className="text-xs uppercase tracking-wide text-ink-400 mb-2">— Bon à savoir</p>
      <div className="text-ink-500 font-light leading-relaxed">{children}</div>
    </aside>
  )
}

export function ArticleP({ children }: { children: ReactNode }) {
  return <p>{children}</p>
}

export function ArticleStrong({ children }: { children: ReactNode }) {
  return <strong className="font-medium text-ink">{children}</strong>
}

export function ArticleCite({ children }: { children: ReactNode }) {
  return <em className="font-display italic text-forest">{children}</em>
}
