import { FAQItem } from "@/components/seo/FAQ"
import { ArticleSection, ArticleAside, ArticleP, ArticleStrong, ArticleCite } from "@/components/seo/Article"

export const FAQ_FREELANCE: FAQItem[] = [
  {
    question: "Quel TJM pour gagner 3 000 € net par mois en freelance ?",
    answer:
      "Sur 15 jours facturés par mois (~180 jours/an), un auto-entrepreneur services doit facturer environ 320-350 € HT/jour pour atteindre 3 000 € net. En SASU avec dividendes, le TJM minimum monte à 450-500 €. En portage salarial, il faut viser 480 €/jour. Ces montants supposent un TMI de 11% et tiennent compte des cotisations et de l'impôt.",
  },
  {
    question: "Auto-entrepreneur ou SASU : quel statut choisir en 2025 ?",
    answer:
      "L'auto-entrepreneur est optimal jusqu'à 50 000 € de CA annuel : simplicité administrative, cotisations forfaitaires (21,2% en services), pas de comptabilité. Au-delà, la SASU devient plus avantageuse fiscalement (optimisation salaire/dividendes, IS à 15%) et offre une protection sociale supérieure. Le seuil de bascule dépend de vos charges réelles et de votre projet à long terme.",
  },
  {
    question: "Combien de jours par mois un freelance facture-t-il vraiment ?",
    answer:
      "En moyenne 15 jours par mois sur l'année, soit 180 jours facturés sur 220 jours ouvrés. La différence : congés (5 semaines, soit 25 jours), formation et veille (10 jours), prospection commerciale (15 jours), administratif et comptabilité (10 jours). Un freelance qui facture 18-20 jours/mois est en surrégime.",
  },
  {
    question: "Le portage salarial vaut-il vraiment ses 8% de frais ?",
    answer:
      "Pour des missions courtes ou en démarrage d'activité, oui : pas de structure à créer, salaire net immédiat, droits chômage à la fin de chaque mission, mutuelle, prévoyance, retraite cadre. Pour une activité stable de 3+ ans avec un CA supérieur à 80 K€, créer sa SASU ou EURL devient rentable. Le portage est aussi imposé pour certaines missions chez de grands comptes.",
  },
  {
    question: "Quels plafonds pour rester en auto-entrepreneur en 2025 ?",
    answer:
      "Les plafonds 2025 sont de 77 700 € HT pour les prestations de services (BIC ou BNC) et 188 700 € HT pour la vente de marchandises. Le dépassement entraîne le passage automatique au régime réel sur deux années consécutives. Attention aussi à la franchise de TVA : seuil de 36 800 € pour les services en 2024, en cours de baisse à 25 000 € prévue.",
  },
  {
    question: "Comment se calcule l'impôt en auto-entrepreneur ?",
    answer:
      "Deux options : (1) le régime classique avec abattement forfaitaire (34% en services BNC, 50% en commerce, 71% en BIC), le revenu après abattement étant intégré au barème de l'IR ; (2) le versement libératoire à 1,7-2,2% selon l'activité, payé en même temps que les cotisations URSSAF. Le versement libératoire n'est intéressant que si vous êtes imposable à un TMI supérieur à 11%.",
  },
  {
    question: "Dividendes ou salaire : que privilégier en SASU ?",
    answer:
      "Le salaire offre une meilleure protection sociale (retraite, chômage, maladie) mais coûte cher en charges (~70% de charges totales). Les dividendes sont taxés à 30% (PFU) sans charges sociales mais ne donnent aucun droit. La stratégie classique : un salaire suffisant pour valider 4 trimestres de retraite (~7 200 €/an de brut), le reste en dividendes. À ajuster selon l'âge et la situation familiale.",
  },
]

export function ContentFreelance() {
  return (
    <>
      <ArticleSection numero="01" titre="Quatre statuts, quatre logiques">
        <ArticleP>
          Le freelance français a essentiellement quatre voies. L&apos;<ArticleStrong>auto-entreprise</ArticleStrong>{" "}
          est le statut d&apos;entrée : zéro frais de création, comptabilité ultra-simple, cotisations
          forfaitaires sur le CA. Mais aussi : protection sociale faible, pas de chômage, et un
          plafond de CA qui force à basculer ailleurs.
        </ArticleP>
        <ArticleP>
          L&apos;<ArticleStrong>EURL</ArticleStrong>{" "}et la <ArticleStrong>SASU</ArticleStrong>{" "}sont
          deux sociétés unipersonnelles aux logiques fiscales très différentes : l&apos;EURL place le
          gérant en TNS (Travailleur Non Salarié, ~45% de charges sur le revenu net), la SASU en
          assimilé-salarié (~65-70% de charges sur le brut, mais protection sociale complète).
          Le <ArticleStrong>portage salarial</ArticleStrong>, enfin, vous rend salarié d&apos;une
          société tierce qui prend 8 à 10% de frais et vous reverse un salaire net.
        </ArticleP>
      </ArticleSection>

      <ArticleSection numero="02" titre="Le seuil de bascule auto-entrepreneur → société">
        <ArticleP>
          En dessous de <ArticleStrong>50 000 € de chiffre d&apos;affaires annuel</ArticleStrong>,
          l&apos;auto-entreprise reste presque toujours le bon choix : simplicité administrative,
          aucun frais comptable, et un ratio net/CA souvent meilleur que les autres statuts à
          ce niveau de revenus.
        </ArticleP>
        <ArticleP>
          Entre 50 000 € et 77 700 € (plafond services), le calcul devient sensible. Si vous avez
          peu de charges déductibles (consultant, développeur, designer), l&apos;auto-entreprise
          reste compétitive. Si vous avez des frais réels significatifs (matériel, sous-traitance,
          locaux), passer en société devient rentable car les charges deviennent déductibles du
          résultat imposable.
        </ArticleP>
        <ArticleAside>
          Au-dessus de 77 700 €, le passage est obligatoire après deux ans de dépassement. Anticipez
          la transition six mois en amont : choix juridique, expert-comptable, ouverture de compte
          professionnel, transfert des contrats clients.
        </ArticleAside>
      </ArticleSection>

      <ArticleSection numero="03" titre="La mécanique du TJM : ce que personne ne dit">
        <ArticleP>
          Un TJM de 500 € ne signifie pas 500 € × 22 jours = 11 000 € en banque. La réalité :{" "}
          <ArticleStrong>180 jours facturables par an</ArticleStrong>, soit 15 jours par mois en
          moyenne. Les 40 autres jours ouvrés sont absorbés par les congés (25j), la formation et
          la veille (10j), la prospection commerciale (15j), l&apos;administratif (10j) — soit
          60 jours par an de travail non facturé mais essentiel à l&apos;activité.
        </ArticleP>
        <ArticleP>
          À cela s&apos;ajoute le <ArticleCite>risque d&apos;intermission</ArticleCite>{" "}: un freelance
          expérimenté connaît typiquement un trou de 1 à 2 mois entre deux missions longues.
          Un TJM réaliste doit donc intégrer cette marge de sécurité — on parle souvent de
          1,4 à 1,5 fois le coût d&apos;un salarié équivalent.
        </ArticleP>
      </ArticleSection>

      <ArticleSection numero="04" titre="Comparer un freelance à un CDI : la bonne formule">
        <ArticleP>
          Pour qu&apos;un freelance gagne autant qu&apos;un CDI à 3 000 € net, son TJM minimum doit
          se situer autour de <ArticleStrong>320 à 350 € HT/jour en auto-entrepreneur</ArticleStrong>
          {" "}(services), 450-500 € en SASU, et 480 € en portage. Mais cette comparaison est incomplète :
          le CDI offre des congés payés, une mutuelle, des indemnités chômage, une retraite plus
          robuste, et un treizième mois ou des primes.
        </ArticleP>
        <ArticleP>
          Pour atteindre la <ArticleStrong>parité réelle</ArticleStrong>{" "}(incluant ces avantages),
          on estime généralement qu&apos;un freelance doit viser un net mensuel 30 à 50% supérieur
          à son équivalent salarié. Un freelance à 3 500 € net est dans une situation comparable
          à un CDI à 2 700 €. Au-delà, le statut devient financièrement intéressant en plus
          d&apos;offrir flexibilité et autonomie.
        </ArticleP>
      </ArticleSection>
    </>
  )
}
