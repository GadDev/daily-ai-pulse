// Synthetic bilingual article: invented test data, never a news story or human review.
// Literal code and URLs stay identical. Local fragments follow translated headings.
export const editorialCode = `const policy = { mode: "read-only", retries: 2 };
// Keep this literal comment unchanged in every locale.
const endpoint = "https://example.com/a/very/long/path/used/to/exercise/horizontal/code/scrolling";
console.log(policy, endpoint);`;

export const editorialCommand = 'node --eval \'console.log("read-only", 2)\'';
export const editorialFragments = {
  '#verify-policy': '#vérifier-la-politique',
  '#verify-policy-1': '#vérifier-la-politique-1',
};
export const editorialCorrections = {
  en: [{ date: '2026-10-05', note: 'The example permits reads only; it does not permit writes.' }],
  fr: [
    {
      date: '2026-10-05',
      note: 'L’exemple autorise uniquement les lectures ; il n’autorise pas les écritures.',
    },
  ],
};
export const addedCorrection = {
  en: { date: '2026-10-06', note: 'The retry count was corrected from two to three.' },
  fr: {
    date: '2026-10-06',
    note: 'Le nombre de nouvelles tentatives a été corrigé de deux à trois.',
  },
};

export function editorialBody(locale: 'en' | 'fr', { updated = false } = {}) {
  const code = updated ? editorialCode.replace('retries: 2', 'retries: 3') : editorialCode;
  const command = updated ? editorialCommand.replace(', 2)', ', 3)') : editorialCommand;
  return locale === 'en'
    ? `Synthetic article for translation tests; no real product or quoted person is represented.

zzpublishedstorybodyzz: [First check](#verify-policy), [second check](#verify-policy-1), and [reference](https://example.com/reference#policy).

## Verify policy

Read-only access does not permit writes. The example uses ${updated ? 'three' : 'two'} retries.

| Operation | Expected outcome |
| --- | --- |
| Read | Allowed, if the configured policy permits it. |
| Write | Denied; the service stays unchanged. |

The fictional fixture reviewer says:

> “A successful read does not prove that writes are blocked.”

This is an invented quotation for tests, not a vendor statement or measured result.

\`\`\`js
${code}
\`\`\`

\`\`\`sh
${command}
\`\`\`

## Verify policy

The repeated heading checks duplicate anchors. Keep \`read-only\` literal. [Return to the first check](#verify-policy).
`
    : `Article synthétique pour les tests de traduction ; aucun produit réel ni aucune personne citée ne sont représentés.

MarqueurCourantUnique : zzcurrentvisiblezz ; [première vérification](#vérifier-la-politique), [seconde vérification](#vérifier-la-politique-1) et [référence](https://example.com/reference#policy).

## Vérifier la politique

L’accès en lecture seule n’autorise pas les écritures. L’exemple prévoit ${updated ? 'trois' : 'deux'} nouvelles tentatives.${updated ? ' zzreviewedupdatedzz' : ''}

| Opération | Résultat attendu |
| --- | --- |
| Lecture | Autorisée, si les règles configurées le permettent. |
| Écriture | Refusée ; le service reste inchangé. |

La personne fictive chargée de la revue de ce jeu de test déclare :

> « Une lecture réussie ne prouve pas que les écritures sont bloquées. »

Il s’agit d’une citation inventée pour les tests, pas d’une déclaration d’un fournisseur ni d’un résultat mesuré.

\`\`\`js
${code}
\`\`\`

\`\`\`sh
${command}
\`\`\`

## Vérifier la politique

Le titre répété vérifie les ancres en doublon. Conserver \`read-only\` tel quel. [Revenir à la première vérification](#vérifier-la-politique).
`;
}
