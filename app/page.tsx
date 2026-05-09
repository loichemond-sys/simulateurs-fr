import Link from "next/link"

const SIMULATEURS = [
  {
    numero: "01",
    titre: "Salaire brut → net",
    accroche: "Décodez votre fiche de paie",
    description:
      "Calcul exact des cotisations URSSAF 2025, cadre ou non-cadre. Coût total employeur, retraite, CSG.",
    href: "/simulateur/salaire-brut-net",
  },
  {
    numero: "02",
    titre: "Droits au chômage",
    accroche: "Estimez votre ARE",
    description:
      "Allocation mensuelle, durée d'indemnisation, dégressivité. Règles Unédic à jour.",
    href: "/simulateur/chomage-are",
  },
  {
    numero: "03",
    titre: "Indemnités licenciement",
    accroche: "Connaissez vos droits",
    description:
      "Calcul de l'indemnité légale et comparaison avec votre négociation. Code du travail Art. R1234-2.",
    href: "/simulateur/licenciement-rupture",
  },
  {
    numero: "04",
    titre: "TJM freelance",
    accroche: "Auto-entrepreneur, EURL, SASU, portage",
    description:
      "Comparez les 4 statuts. Trouvez le TJM minimum pour atteindre votre objectif de revenu.",
    href: "/simulateur/tjm-freelance",
  },
  {
    numero: "05",
    titre: "Impôt sur le revenu",
    accroche: "Barème 2026, revenus 2025",
    description:
      "Quotient familial, décote, TMI, taux moyen. Visualisation graphique de vos revenus nets.",
    href: "/simulateur/impot-revenu",
  },
  {
    numero: "06",
    titre: "Retraite",
    accroche: "Réforme 2023, trimestres, pension",
    description:
      "Âge légal (62–64 ans), trimestres requis, décote/surcote, pension estimée. Trouvez votre âge optimal.",
    href: "/simulateur/retraite",
  },
  {
    numero: "07",
    titre: "Épargne",
    accroche: "Livret A, LEP, PEA, assurance-vie",
    description:
      "Simulez l'effet des intérêts composés. Comparez tous les produits d'épargne français sur 1 à 30 ans.",
    href: "/simulateur/epargne",
  },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 pt-20 pb-28 lg:pt-32 lg:pb-40">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-wide text-ink-400 mb-8">— Simulateurs officiels 2025</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter leading-[0.95] mb-10 max-w-4xl">
            Comprenez enfin votre <span className="text-forest italic">salaire</span>,
            <br />
            vos droits et vos impôts.
          </h1>
          <p className="text-lg md:text-xl text-ink-500 font-light leading-relaxed max-w-2xl">
            Cinq simulateurs précis, basés sur les barèmes URSSAF, Unédic et DGFiP 2025.
            Sans inscription. Sans publicité. Résultats instantanés.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <Link
              href="/simulateur/salaire-brut-net"
              className="inline-flex items-center justify-center rounded-full bg-ink text-ivory px-7 py-4 font-body text-sm font-medium transition-colors duration-200 hover:bg-forest"
            >
              Calculer mon salaire net
            </Link>
            <Link
              href="#simulateurs"
              className="inline-flex items-center justify-center rounded-full border border-ink-200 text-ink px-7 py-4 font-body text-sm font-medium transition-all duration-200 hover:bg-ink hover:text-ivory hover:border-ink"
            >
              Voir les 7 simulateurs
            </Link>
          </div>
        </div>
      </section>

      {/* Grille simulateurs */}
      <section id="simulateurs" className="px-6 pb-28">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 max-w-2xl">
            <p className="text-xs uppercase tracking-wide text-ink-400 mb-4">— Le parcours</p>
            <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight leading-tight">
              De la <span className="italic text-forest">paie</span>{" "}à la retraite,
              en passant par le freelance, le chômage et les impôts.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SIMULATEURS.map((s, i) => (
              <Link
                key={s.numero}
                href={s.href}
                className={`group relative card p-8 hover:shadow-soft-md transition-all duration-300 ease-out ${
                  i === 0 ? "lg:col-span-2 lg:row-span-1" : ""
                }`}
              >
                <p className="text-bronze italic font-display text-base mb-6">{s.numero}</p>
                <h3 className="font-display text-2xl md:text-3xl font-medium tracking-tight mb-2 group-hover:text-forest transition-colors">
                  {s.titre}
                </h3>
                <p className="font-display text-base italic text-ink-500 mb-4">{s.accroche}</p>
                <p className="text-sm text-ink-500 font-light leading-relaxed">{s.description}</p>
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-ink group-hover:text-forest transition-colors">
                  <span>Ouvrir le simulateur</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Méthodologie */}
      <section className="px-6 pb-28">
        <div className="max-w-5xl mx-auto">
          <div className="border-t border-ivory-300 pt-16 grid md:grid-cols-3 gap-12">
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-400 mb-4">— Méthodologie</p>
              <h3 className="font-display text-2xl font-medium tracking-tight mb-3">
                Sources <span className="italic text-forest">officielles</span>
              </h3>
              <p className="text-sm text-ink-500 font-light leading-relaxed">
                URSSAF, Unédic, service-public.fr, DGFiP. Barèmes 2025 et loi de finances 2026.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-400 mb-4">— Confidentialité</p>
              <h3 className="font-display text-2xl font-medium tracking-tight mb-3">
                Tout reste <span className="italic text-forest">chez vous</span>
              </h3>
              <p className="text-sm text-ink-500 font-light leading-relaxed">
                Calculs effectués dans votre navigateur. Aucune donnée envoyée, aucun compte requis.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-400 mb-4">— Mise à jour</p>
              <h3 className="font-display text-2xl font-medium tracking-tight mb-3">
                Barèmes <span className="italic text-forest">2025</span>
              </h3>
              <p className="text-sm text-ink-500 font-light leading-relaxed">
                PMSS, SMIC, tranches IR, plafonds Unédic — toutes les valeurs sont à jour.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
