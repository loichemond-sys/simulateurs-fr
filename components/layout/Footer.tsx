import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-ivory-300 mt-32">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-forest flex items-center justify-center">
                <span className="text-ivory font-display text-sm italic">s</span>
              </div>
              <span className="font-display text-lg font-medium tracking-tight">
                simulateurs<span className="text-forest italic">.fr</span>
              </span>
            </div>
            <p className="text-sm text-ink-500 max-w-md leading-relaxed font-light">
              Comprenez votre salaire, vos droits et vos impôts en quelques secondes.
              Calculs basés sur les barèmes officiels 2025 (URSSAF, Unédic, DGFiP).
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-ink-400 mb-4">— Simulateurs</p>
            <ul className="space-y-3 text-sm">
              <li><Link href="/simulateur/salaire-brut-net" className="text-ink-500 hover:text-ink transition-colors">Salaire brut → net</Link></li>
              <li><Link href="/simulateur/chomage-are" className="text-ink-500 hover:text-ink transition-colors">Droits chômage (ARE)</Link></li>
              <li><Link href="/simulateur/licenciement-rupture" className="text-ink-500 hover:text-ink transition-colors">Indemnités licenciement</Link></li>
              <li><Link href="/simulateur/tjm-freelance" className="text-ink-500 hover:text-ink transition-colors">TJM freelance</Link></li>
              <li><Link href="/simulateur/impot-revenu" className="text-ink-500 hover:text-ink transition-colors">Impôt sur le revenu</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-ink-400 mb-4">— Sources</p>
            <ul className="space-y-3 text-sm text-ink-500">
              <li>URSSAF</li>
              <li>Unédic</li>
              <li>service-public.fr</li>
              <li>DGFiP</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-ivory-300 text-xs text-ink-400 leading-relaxed">
          Ces calculs sont indicatifs et ne remplacent pas un conseil juridique ou fiscal.
          Les résultats peuvent varier selon votre convention collective.
          Mis à jour en 2025.
        </div>
      </div>
    </footer>
  )
}
