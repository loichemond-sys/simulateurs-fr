import Link from "next/link"

export interface BreadcrumbItem {
  label: string
  href?: string
}

const SITE_URL = "https://simulateurs.fr"

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="px-6 pt-8">
      <div className="max-w-6xl mx-auto">
        <ol className="flex items-center gap-2 text-xs text-ink-400">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              {item.href ? (
                <Link href={item.href} className="hover:text-ink transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-ink-500">{item.label}</span>
              )}
              {i < items.length - 1 && <span className="text-ink-200">/</span>}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
