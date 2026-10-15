---
storyId: "2026-10-15-openai-gpt-4-api-deprecations"
locale: "fr"
sourceRef: "b408d87dda99f9eb4956be9ef227152fcc0ab25e"
sourceSha256: "359fd8d27e951f6f3c529021db95bca41a22a16c5c0404a2df7edc34641e0711"
status: "reviewed"
title: "OpenAI donne 90 jours pour migrer quatre familles d’API GPT-4"
description: "Les snapshots GPT-4o, GPT-4o mini, GPT-4.1 et GPT-4.1 mini, y compris leurs ajustements fins, quitteront l’API le 14 janvier 2027."
imageAlt: "Quatre anciens récipients de modèles approchent d’une même porte de migration"
corrections: []
reviewedBy: "Codex (model review)"
reviewedAt: "2026-10-15T06:54:38.000Z"
---

OpenAI donne 90 jours aux développeurs pour déplacer le trafic de production hors de quatre familles d'API GPT-4. L'entreprise indique que les snapshots concernés seront supprimés le 14 janvier 2027 :

- `gpt-4o-2024-08-06` et `gpt-4o-2024-11-20`
- `gpt-4o-mini-2024-07-18`
- `gpt-4.1-2025-04-14`
- `gpt-4.1-mini-2025-04-14`

OpenAI recommande `gpt-6-luna` pour chaque snapshot répertorié. Les versions issues d'un ajustement fin (fine-tuning) suivent le même calendrier d'arrêt que leur modèle de base.

Cette dernière phrase transforme un changement d'alias de modèle en un programme de migration plus large. Un déploiement ajusté finement ne se résume pas à un nom de modèle : les données d'entraînement, les seuils d'évaluation, les attentes relatives aux sorties structurées, le comportement des outils, la latence, l'usage des tokens et la logique de repli peuvent tous avoir été calibrés autour du modèle de base retiré.

## Le remplacement est un point de départ, pas un résultat de validation

La page de dépréciation fournit une cible de remplacement et une échéance. Elle n'établit pas que `gpt-6-luna` est interchangeable sur le plan comportemental avec chaque snapshot ou ajustement fin concerné.

Les équipes devraient donc considérer la recommandation comme le début d'une comparaison contrôlée. Il faut rejouer des entrées de production représentatives, des appels d'outil, des sorties contraintes par un schéma, des cas de refus et des requêtes à contexte long avec la configuration de remplacement exacte. La qualité, la latence, la consommation de tokens et le coût doivent être mesurés séparément ; un score global satisfaisant peut masquer des régressions sur un chemin étroit mais critique pour l'exploitation.

Pour les modèles ajustés finement, il faut d'abord inventorier les identifiants déployés qui héritent des snapshots concernés. Il faut ensuite déterminer si le remplacement nécessite de migrer les prompts, de produire un nouvel ajustement fin ou de modifier le routage côté application. Il ne faut pas supposer qu'un changement de modèle de base préservera le comportement appris.

## Une échéance de 90 jours change l'ordre du déploiement

La date d'arrêt du 14 janvier favorise un plan qui commence par l'inventaire :

1. Rechercher les identifiants de modèles épinglés dans les services, les tâches en arrière-plan, les harnesses d'évaluation, la configuration d'infrastructure et la gestion des secrets ou variables d'environnement.
2. Recenser les descendants ajustés finement et leurs responsables.
3. Capturer un jeu d'évaluation représentatif de la production avant de modifier les prompts ou le routage.
4. Comparer le remplacement recommandé avec les mêmes limites et autorisations d'outils.
5. Déployer derrière une répartition explicite du trafic, avec des critères de retour arrière.
6. Supprimer l'ancien chemin avant la date d'arrêt au lieu de compter sur une bascule le dernier jour.

Cet avis rappelle aussi que l'épinglage d'un snapshot échange les changements silencieux de comportement contre un travail explicite de cycle de vie. La solution la plus sûre n'est pas d'éviter les versions épinglées, mais d'associer à chaque dépendance épinglée un responsable, une suite d'évaluation et une procédure de retrait.

## Limites des preuves disponibles

Les identifiants des modèles concernés, le remplacement recommandé, le périmètre des ajustements fins, la date de l'avis et la date d'arrêt proviennent de la documentation de dépréciation d'OpenAI. Lors de cette préparation, nous n'avons pas testé indépendamment la parité du remplacement, le coût de la migration ni le comportement des ajustements fins.
