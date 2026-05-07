import Link from "next/link"

export function Header() {
  return (
    <header className="border-b border-ivory-300 bg-ivory/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-forest flex items-center justify-center">
            <span className="text-ivory font-display text-sm italic">s</span>
          </div>
          <span className="font-display text-lg font-medium tracking-tight">
            simulateurs<span className="text-forest italic">.fr</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-ink-500">
          <Link href="/simulateur/salaire-brut-net" className="hover:text-ink transition-colors">Salaire</Link>
          <Link href="/simulateur/chomage-are" className="hover:text-ink transition-colors">Chômage</Link>
          <Link href="/simulateur/licenciement-rupture" className="hover:text-ink transition-colors">Licenciement</Link>
          <Link href="/simulateur/tjm-freelance" className="hover:text-ink transition-colors">Freelance</Link>
          <Link href="/simulateur/impot-revenu" className="hover:text-ink transition-colors">Impôts</Link>
        </nav>
      </div>
    </header>
  )
}
