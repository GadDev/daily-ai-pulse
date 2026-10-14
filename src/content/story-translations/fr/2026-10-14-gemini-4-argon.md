---
storyId: "2026-10-14-gemini-4-argon"
locale: "fr"
sourceRef: "c42d58b54e39eb1177ba0b0cb3e834d505195e26"
sourceSha256: "2888c7eb299a216d93c4581b8d366f9c51dd06b0d85e5853b149ff4028a67376"
status: "reviewed"
title: "Gemini 4 Argon fait de la sortie à un million de tokens un choix de production, au-delà de la démonstration"
description: "Le nouveau modèle de raisonnement de Google, disponible en version générale, propose un budget unifié de 1 048 576 tokens, un décodage long optionnel à un million de tokens, des niveaux d’inférence uniquement payants et des résultats contrastés aux benchmarks de programmation."
imageAlt: "Une vaste surface de raisonnement pliée alimente une étroite ouverture de production"
corrections: []
reviewedBy: "Codex (model review)"
reviewedAt: "2026-10-14T14:43:51.063Z"
---

Google a publié Gemini 4 Argon sous la forme d'un modèle d'API stable et disponible en version générale pour l'ingénierie logicielle complexe, les tâches agentiques, les mathématiques et les sciences. Le changement notable pour les ingénieurs ne se résume pas à une meilleure ligne dans un tableau de benchmarks : le point d'accès `gemini-4-argon` associe un budget unifié de 1 048 576 tokens en entrée et en sortie à un mode optionnel de décodage long capable de produire jusqu'à la totalité de ce budget.

La limite de sortie synchrone habituelle reste fixée à 65 536 tokens. Le décodage long doit donc être traité comme un mode de fonctionnement distinct, et non comme le comportement par défaut de chaque requête. Le modèle accepte du texte, des images, de la vidéo, de l'audio et des PDF, et produit du texte. Il prend en charge les appels de fonctions, l'exécution de code, l'ancrage dans les résultats de recherche et Maps, la recherche dans les fichiers, les sorties structurées, le contexte d'URL et l'utilisation de l'ordinateur en préversion. La Live API et la génération d'images ne sont pas prises en charge.

## L'enveloppe de contexte est aussi une enveloppe de coût

Argon est uniquement payant dans la Gemini Developer API. Jusqu'au 30 novembre 2026 inclus, l'inférence standard coûte 2 $ par million de tokens d'entrée et 10 $ par million de tokens de sortie, tokens de réflexion compris. Google indique que ces tarifs doubleront le 1er décembre. Batch et Flex coûtent la moitié des tarifs standard, tandis que Priority coûte actuellement 3,60 $ par million de tokens d'entrée et 18 $ par million de tokens de sortie, avec un doublement également prévu.

Seule la mise en cache implicite est prise en charge. La mise en cache explicite ne l'est pas. Cette distinction compte pour les agents qui parcourent régulièrement un vaste dépôt ou un long historique de session : disposer d'un million de tokens ne fournit pas, en soi, un cache persistant contrôlable, et les longues sorties peuvent représenter l'essentiel de la latence comme des dépenses.

Les équipes d'ingénierie devraient donc encadrer les tâches de décodage long par des budgets de sortie explicites, des conditions d'arrêt, des points de contrôle et une validation des artefacts. Une enveloppe plus large est utile pour les migrations, l'analyse de dépôts entiers et les artefacts durables, mais elle augmente aussi la quantité de travail incorrect qu'une exécution peut produire avant sa revue.

## De bons résultats en programmation, sans domination uniforme

La fiche du modèle de Google annonce 77,9 % sur DeepSWE v1.1 et 91,9 % sur Vibe Code Bench, devant les modèles de comparaison qui y figurent. Le même tableau indique 55,0 % sur FrontierSWE v2 et 57,4 % sur Terminal-bench 4.0, derrière au moins un concurrent répertorié dans chaque cas. Argon est également devancé par le meilleur modèle du tableau sur PostTrainBench et OSWorld-2.0.

Ces résultats sont rapportés par le fournisseur avec des dispositifs propres à chaque benchmark ; ils ne doivent pas être condensés en une affirmation unique selon laquelle Argon serait « le meilleur en programmation ». Le signal pratique est plus limité : Google a livré un modèle de pointe présentant des atouts crédibles sur plusieurs tâches de programmation agentique, mais les résultats varient sensiblement selon la tâche et le dispositif d'évaluation. Les équipes devraient tester le dépôt, les outils, les délais d'expiration et les critères de réussite exacts qu'elles comptent utiliser.

## L'argumentaire de sécurité doit faire partie de la revue de déploiement

Google indique ne pas pouvoir exclure qu'Argon atteigne des niveaux critiques de capacité concernant les risques liés à l'information biologique et les capacités cyberoffensives, ou un seuil relatif à la dissimulation et à la conscience de la situation. L'entreprise affirme avoir déployé des mesures d'atténuation et évalué le risque résiduel en dessous de ces seuils. La fiche du modèle mentionne aussi, parmi les limites connues, les hallucinations, des lenteurs ou délais d'expiration occasionnels et une limite des connaissances à mars 2026.

Pour les équipes logicielles, la politique d'accès devient ainsi un élément du choix du modèle. Les usages de cybersécurité et d'agents autonomes nécessitent des outils au périmètre défini, des cibles délimitées, une journalisation externe, un environnement isolé (sandbox) et une revue indépendante, plutôt qu'une confiance fondée sur le seul comportement du modèle.

## Ce que les équipes d'ingénierie devraient faire

- Évaluer Argon avec les mêmes outils, dépôt, budget de temps et tests d'acceptation qu'en production.
- Traiter le décodage long comme une catégorie de tâches activée explicitement, avec des plafonds de tokens et de dépenses.
- Mesurer la différence entre la sortie synchrone de 65 536 tokens et les tâches de décodage long avant de concevoir les dépendances du workflow.
- Ne pas supposer que la mise en cache implicite remplace une stratégie de contexte contrôlée par l'application.
- Placer les outils les plus risqués derrière des limites strictes d'autorisation, d'isolation et de revue.

## Limites des preuves disponibles

La disponibilité, les limites, les capacités, les prix, les résultats de benchmarks, les limitations et les évaluations de sécurité proviennent de Google et de Google DeepMind. Lors de cette préparation, nous n'avons pas reproduit indépendamment le tableau de benchmarks, le comportement du décodage long, la latence, le comportement du cache ni les mesures d'atténuation des risques.
