---
storyId: 2026-11-06-kakao-kanana-2-v-decide
locale: fr
sourceRef: 47525962ca9b09ca0e4cee47d2e0916261a77f23
sourceSha256: 42cd7f87f838e95ee7a3689a7e1ad07e454b5a834de10151c8d34967bfa3f894
status: reviewed
reviewedBy: Codex (model self-review)
reviewedAt: '2026-11-07T08:25:01Z'
title: Kakao publie un petit modèle multimodal pour les décisions d’agents
description: Kanana-2-v-decide renvoie des probabilités pour des choix, des questions oui/non et des scores ordonnés au lieu de générer du texte, offrant une nouvelle option ouverte pour les étapes répétées de routage et de classification.
imageAlt: Plusieurs fragments de texte et d’image entrent dans un instrument de décision compact en pierre, qui les répartit en choix pondérés de couleur terre cuite
corrections: []
---

Kakao a publié les poids et la fiche modèle de Kanana-2-v-decide, un petit modèle multimodal conçu pour prendre des décisions bornées plutôt que rédiger une réponse.

À partir de texte, de JSON, d’un historique de conversation et, éventuellement, d’images, le modèle répond à des questions typées. Il peut choisir parmi des options, répondre oui ou non, ou attribuer un score ordonné. Sa sortie comprend une probabilité pour chaque réponse autorisée. Cette interface diffère d’un prompt adressé à un modèle de langage généraliste pour lui demander d’expliquer son raisonnement, avant d’analyser cette explication.

La publication est vérifiable. Les comparaisons de vitesse et de benchmarks de Kakao n’ont pas été reproduites indépendamment dans cette édition et doivent rester présentées comme des résultats du fournisseur.

## Un modèle de décision n’est pas un chatbot plus petit

Kanana-2-v-decide encode l’état d’entrée et chaque réponse candidate, compare leurs plongements puis applique un softmax pour produire une distribution sur les réponses. Il ne génère pas de texte libre.

Cette contrainte peut être utile au sein d’un agent. De nombreuses étapes ne sont pas des tâches de rédaction : choisir un outil, affecter une file, évaluer une urgence, décider si une condition est satisfaite ou classer une image. Un modèle génératif peut effectuer ces tâches, mais son interface ouverte ajoute de l’analyse de sortie, de la latence et des risques de dérive du format.

Kakao indique que le modèle accepte jusqu’à dix images et 20 480 tokens. La fiche modèle expose des questions de type choix, binaire et notation, et le même état peut être évalué par plusieurs questions. La réutilisation des plongements de réponses peut réduire les calculs répétés lorsque les options restent fixes.

## Où pourrait-il trouver sa place ?

Le modèle est surtout intéressant comme composant d’une politique plus vaste, et non comme autorité autonome. Une application pourrait l’utiliser pour classer des outils candidats, router une demande d’assistance, catégoriser une image produit ou attribuer un score de risque. Le système environnant décide toujours quel seuil est acceptable et quoi faire lorsque la confiance est faible.

Cette séparation est importante. Une distribution de probabilités n’est pas une garantie calibrée. Avant de l’employer pour une branche lourde de conséquences, mesurez son calibrage sur des données représentatives, définissez le comportement d’abstention et comparez-le à une base simple de règles.

Pour le routage, testez au moins quatre points :

- la stabilité de la bonne option face aux reformulations ;
- la correspondance entre probabilités et taux d’erreur observés ;
- les différences de comportement entre combinaisons image-texte et texte seul ;
- la possibilité de récupérer sans danger après une mauvaise décision.

Kakao annonce un temps de réponse moyen d’environ 0,04 seconde sur un H200 et un net avantage de vitesse sur GPT-6 Luna. L’entreprise revendique également les meilleurs résultats dans son évaluation coréenne et dans les comparaisons publiques du Decision Index. Ces chiffres constituent des hypothèses utiles à reproduire, pas des conclusions automatiquement transférables à un autre GPU, une autre taille de lot, un autre mélange de langues ou une autre distribution de tâches.

## Vérifier la licence et la base de comparaison

Les poids utilisent la licence ouverte Kanana de Kakao, que l’entreprise décrit comme autorisant la recherche et l’usage commercial. Les équipes doivent néanmoins examiner les conditions réelles pour leur mode de déploiement et de redistribution.

La base d’ingénierie ne doit pas être uniquement un modèle de pointe. Comparez avec un moteur de règles, un classifieur classique et la méthode par plongements la plus simple capable de résoudre la tâche. Un modèle de décision mérite sa place lorsqu’il améliore le compromis qualité-latence-coût sans affaiblir l’observabilité ni le contrôle.

Conservez dans les journaux d’évaluation la réponse choisie, la distribution complète, la version du modèle, l’ensemble des candidats et le résultat en aval. Si seul le choix final est gardé, l’équipe perd les informations nécessaires pour diagnostiquer les échecs de seuil et de calibrage.

## À retenir

Kanana-2-v-decide est intéressant parce qu’il resserre le contrat. Il produit des choix et des probabilités plutôt que du texte libre.

Cela peut accélérer les décisions répétées d’un agent et faciliter leur validation, à condition que l’application garde la maîtrise de la politique autour du modèle. Considérez cette publication comme un composant ouvert à évaluer sur vos propres routes, et non comme un remplacement de l’autorisation, des règles métier ou du jugement humain.
