---
storyId: "2026-10-15-hydrafusion-stage-aware-review"
locale: "fr"
sourceRef: "b408d87dda99f9eb4956be9ef227152fcc0ab25e"
sourceSha256: "14c8aa0e79a27213261cb3aa171b7c77bdbb47bd9c59ee3d15e6d9a5b8063de5"
status: "reviewed"
title: "HydraFusion consacre désormais davantage de raisonnement à la revue qu’au brouillon"
description: "La préversion de recherche de GitHub ajoute un effort de raisonnement propre à chaque étape, des critiques parallèles ancrées dans l’espace de travail, une réparation conditionnelle et une option Max."
imageAlt: "Un canal de rédaction modeste alimente une chambre d’inspection parallèle plus profonde"
corrections: []
reviewedBy: "Codex (model review)"
reviewedAt: "2026-10-15T06:54:38.000Z"
---

GitHub a mis à jour HydraFusion afin que l'effort de raisonnement ne soit plus seulement une propriété du modèle chargé d'une tâche. La préversion de recherche attribue désormais l'effort selon l'étape du workflow : un effort moyen pour les premiers brouillons et un effort élevé pour la revue.

La même version modifie la nature de cette revue. Le workflow Critique de HydraFusion s'appuie maintenant davantage sur des outils pour inspecter l'espace de travail réel, au lieu de dépendre principalement de résumés textuels, et il peut exécuter plusieurs modèles critiques en parallèle. Son workflow Cascade peut ajouter un juge qui inspecte la première tentative et ne demande une réparation que si elle est nécessaire.

Ensemble, ces changements déplacent l'unité d'optimisation : il ne s'agit plus seulement de savoir quel modèle doit répondre, mais où le workflow doit consacrer du raisonnement, de l'inspection et de la réparation.

## La revue devient une phase d'exécution à part entière

Un résumé textuel constitue une frontière avec perte pour la revue de code. Il peut omettre un fichier inchangé qui établit un invariant, un artefact généré ou un échec de test absent du récit de l'agent. Donner aux critiques des outils pour inspecter l'espace de travail réduit cet écart : le réviseur peut ancrer son jugement dans l'état du dépôt plutôt que dans le compte rendu du modèle chargé du brouillon.

Les critiques parallèles ajoutent de la diversité, mais pas automatiquement de la justesse. Plusieurs modèles peuvent répéter la même hypothèse erronée ou examiner les mêmes preuves incomplètes. La leçon de conception durable consiste à donner à la revue un périmètre défini indépendamment : fichiers modifiés, contrats proches, tests pertinents, artefacts générés et critères d'acceptation explicites.

La réparation conditionnelle modifie aussi le profil de coût. Un juge peut éviter un second passage coûteux lorsque le premier résultat est suffisant, mais seulement si son jugement est assez fiable pour la tâche. Les équipes qui évaluent ce schéma devraient mesurer les acceptations erronées et les réparations inutiles, et pas seulement la réussite finale de la tâche.

## HydraFusion Max rend la politique visible

GitHub a également présenté HydraFusion Max. Cette option utilise la même architecture et les mêmes techniques de workflow, mais applique un effort de raisonnement plus élevé lorsque la profondeur et l'exhaustivité comptent le plus. GitHub présente l'option standard comme un équilibre entre vitesse, coût et performance, tandis que Max vise les tâches exigeantes.

Les deux variantes puisent dans un ensemble qui comprend Claude Opus 5.5, GPT-6 Astra, GPT-6.1 Sol et GPT-6 Luna. Elles restent en préversion de recherche dans Visual Studio Code, l'application GitHub Copilot et Copilot CLI. L'accès est disponible avec les offres Pro, Pro+, Business et Enterprise lorsque les fonctions expérimentales ou en préversion sont activées, sous réserve des politiques de modèles de l'organisation.

Pour les équipes d'ingénierie, « Max » ne devrait pas devenir un réglage universel par défaut. Il convient de le réserver aux catégories de tâches où une revue plus approfondie peut modifier le résultat : refactorisations importantes, migrations, changements sensibles à la sécurité ou pannes ambiguës. Les modifications courantes peuvent rester sur un chemin moins coûteux, et les deux variantes doivent être comparées au moyen de tests d'acceptation propres au dépôt et de la consommation totale de tokens.

## Ce que les équipes devraient évaluer

- Les critiques inspectent-ils les fichiers et artefacts qui définissent réellement la justesse ?
- La critique parallèle découvre-t-elle des défauts indépendants ou duplique-t-elle simplement les commentaires ?
- À quelle fréquence le juge de Cascade accepte-t-il un brouillon fautif ou demande-t-il une réparation inutile ?
- Quels sont la qualité, la latence et l'usage des tokens par étape, et pas seulement pour la session complète ?
- Les politiques de modèles de l'organisation produisent-elles l'ensemble attendu dans chaque client ?
- Un test ou un critère de politique déterministe reste-t-il l'autorité lorsque les réviseurs modèles ne sont pas d'accord ?

## Limites des preuves disponibles

GitHub documente l'ensemble de modèles, l'effort propre à chaque étape, les workflows Cascade et Critique révisés, l'option Max, les clients et offres pris en charge ainsi que le statut de préversion. Aucun benchmark indépendant de ces changements d'octobre n'était disponible lors de cette préparation, et GitHub ne publie pas de mesures de précision par tâche, de latence ou d'économie de tokens dans son journal des modifications.
