# French technical glossary — M0 draft

Use these house terms for reader-facing prose. Preserve literal identifiers,
commands, product/company names, code and bibliographic source labels.
These are editorial choices for the pilot, not universal translations.

| English concept | French wording | Usage |
| --- | --- | --- |
| deployment | déploiement | Preserve named deployment products |
| inference | inférence | Distinguish from training |
| training | entraînement | Preserve the method and stated results |
| context window | fenêtre de contexte | Keep token counts unchanged |
| tool call | appel d'outil | Preserve literal tool/API names |
| sandbox | environnement isolé (sandbox) | Use both on first mention; do not imply complete isolation |
| prompt | prompt | Explain as model instructions when helpful; preserve literal prompt text |
| evaluation / eval | évaluation | Preserve benchmark and metric names |
| reasoning | raisonnement | Preserve caveats about what was actually measured |
| fine-tuning | ajustement fin (fine-tuning) | Use both on first occurrence |
| symlink | lien symbolique | Keep literal paths and commands unchanged |
| permission enforcement | application des règles d'autorisation | Do not imply guarantees absent from English |

For the pilot, refer to a literal `deny` rule as une règle `deny` and explain
it as a refusal rule when needed. Refer to a literal `ask` rule as une règle
`ask`, requiring approval, rather than translating its identifier. Preserve
`Read`, Bash, IDE, version strings, UTC and command syntax.

Translate policy precedence contextually as priorité des règles or ordre de
priorité des règles. Do not introduce a universal precedence order absent from
the article. For sandbox auto-allow, explain the mechanism in French while
preserving any literal setting/identifier used in the source.

“Token” requires context: distinguish model text tokens from access tokens.
Keep an established technical English term when a forced French substitute
would obscure meaning. Flag unresolved terminology and propose a glossary
addition for the editor; do not silently change house terms for one article.

Use neutral French, natural sentence order and concise paragraphs. Preserve
meaning before stylistic polish. French punctuation and number formatting may
change prose presentation, never numeric values, code or technical versions.
