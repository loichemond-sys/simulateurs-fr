export interface PointEpargne {
  t: number          // année (0 = aujourd'hui)
  capital: number
  totalVerse: number
  interets: number
}

export function calculerPoints(
  capitalInitial: number,
  versementMensuel: number,
  tauxAnnuel: number,
  dureeAns: number
): PointEpargne[] {
  const r = tauxAnnuel / 1200 // taux mensuel
  return Array.from({ length: dureeAns + 1 }, (_, i) => {
    const n = i * 12
    const cap =
      r === 0
        ? capitalInitial + versementMensuel * n
        : capitalInitial * Math.pow(1 + r, n) +
          (versementMensuel * (Math.pow(1 + r, n) - 1)) / r
    const verse = capitalInitial + versementMensuel * n
    return { t: i, capital: cap, totalVerse: verse, interets: cap - verse }
  })
}
