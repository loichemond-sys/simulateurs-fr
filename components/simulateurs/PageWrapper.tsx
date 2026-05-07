import { ReactNode } from "react"
import Link from "next/link"
import { FAQ, FAQItem, FAQJsonLd } from "@/components/seo/FAQ"
import { Article } from "@/components/seo/Article"
import { Breadcrumb, BreadcrumbItem, BreadcrumbJsonLd } from "@/components/seo/Breadcrumb"
import { WebApplicationJsonLd } from "@/components/seo/WebApplicationJsonLd"

interface PageWrapperProps {
  numero: string
  eyebrow: string
  titre: string
  motCle: string
  description: string
  simulator: ReactNode
  faqItems: FAQItem[]
  articleEyebrow: string
  articleTitle: string
  articleMotCle: string
  articleContent: ReactNode
  sources?: string
  // SEO
  slug: string
  appName: string
  appDescription: string
}

const SITE_URL = "https://simulateurs.fr"

export function PageWrapper({
  numero,
  eyebrow,
  titre,
  motCle,
  description,
  simulator,
  faqItems,
  articleEyebrow,
  articleTitle,
  articleMotCle,
  articleContent,
  sources,
  slug,
  appName,
  appDescription,
}: PageWrapperProps) {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Accueil", href: "/" },
    { label: "Simulateurs", href: "/" },
    { label: eyebrow },
  ]

  const [titleBefore, titleAfter] = titre.split(motCle)

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <FAQJsonLd items={faqItems} />
      <WebApplicationJsonLd
        name={appName}
        description={appDescription}
        url={`${SITE_URL}/simulateur/${slug}`}
      />

      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <section className="px-6 pt-8 pb-12 lg:pt-16 lg:pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline gap-4 mb-8">
            <span className="font-display italic text-bronze text-base">{numero}</span>
            <span className="text-xs uppercase tracking-wide text-ink-400">— {eyebrow}</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-medium tracking-tighter leading-[0.95] mb-6 max-w-4xl">
            {titleBefore}
            <span className="text-forest italic">{motCle}</span>
            {titleAfter}
          </h1>
          <p className="text-lg text-ink-500 font-light leading-relaxed max-w-2xl">
            {description}
          </p>
        </div>
      </section>

      {/* Simulator */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">{simulator}</div>
      </section>

      {/* Article */}
      <Article eyebrow={articleEyebrow} title={articleTitle} motCle={articleMotCle}>
        {articleContent}
      </Article>

      {/* FAQ */}
      <FAQ items={faqItems} title="Vos questions, nos réponses" />

      {/* Disclaimer + sources */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto border-t border-ivory-300 pt-10">
          <p className="text-xs uppercase tracking-wide text-ink-400 mb-3">— Sources</p>
          <p className="text-sm text-ink-500 font-light leading-relaxed max-w-3xl">
            {sources || "URSSAF, Unédic, service-public.fr, DGFiP."} Mis à jour en 2025.
            Ce simulateur est indicatif. Les résultats peuvent varier selon votre convention collective
            et ne remplacent pas un conseil juridique ou fiscal.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 mt-8 text-sm text-ink-500 hover:text-ink transition-colors">
            <span>←</span>
            <span>Voir tous les simulateurs</span>
          </Link>
        </div>
      </section>
    </>
  )
}
