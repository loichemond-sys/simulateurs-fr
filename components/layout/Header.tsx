"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const NAV_ITEMS = [
  { href: "/simulateur/salaire-brut-net", label: "Salaire" },
  { href: "/simulateur/chomage-are", label: "Chômage" },
  { href: "/simulateur/licenciement-rupture", label: "Licenciement" },
  { href: "/simulateur/tjm-freelance", label: "Freelance" },
  { href: "/simulateur/impot-revenu", label: "Impôts" },
  { href: "/simulateur/retraite", label: "Retraite" },
  { href: "/simulateur/epargne", label: "Épargne" },
]

export function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="border-b border-ivory-300 bg-ivory/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-full bg-forest flex items-center justify-center">
            <span className="text-ivory font-display text-sm italic">s</span>
          </div>
          <span className="font-display text-lg font-medium tracking-tight">
            simulateurs<span className="text-forest italic">.fr</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-5 text-sm text-ink-500">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors hover:text-ink ${
                pathname === item.href ? "text-ink font-medium" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile burger */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden flex flex-col gap-1.5 p-2 -mr-2"
          aria-label="Menu"
        >
          <span className={`block w-5 h-px bg-ink transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-px bg-ink transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-px bg-ink transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-ivory-300 bg-ivory">
          <nav className="max-w-6xl mx-auto px-6 py-4 grid grid-cols-2 gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm transition-colors ${
                  pathname === item.href
                    ? "bg-forest/5 text-forest font-medium"
                    : "text-ink-500 hover:bg-ivory-200 hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
