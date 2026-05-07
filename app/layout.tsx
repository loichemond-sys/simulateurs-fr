import type { Metadata } from "next"
import { Fraunces, Outfit } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Simulateurs financiers 2025 — Salaire, chômage, impôts, freelance",
  description:
    "Calculez votre salaire net, vos droits au chômage, vos indemnités, votre TJM freelance et vos impôts. Barèmes officiels 2025. Gratuit, sans inscription.",
  keywords: [
    "simulateur salaire brut net",
    "simulateur chômage",
    "simulateur licenciement",
    "simulateur TJM freelance",
    "simulateur impôt revenu",
  ],
  authors: [{ name: "simulateurs.fr" }],
  openGraph: {
    title: "Simulateurs financiers 2025",
    description:
      "Comprenez votre salaire, vos droits et vos impôts en 30 secondes.",
    locale: "fr_FR",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-ivory text-ink">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
