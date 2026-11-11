---
storyId: 2026-10-29-android-studio-rabbit-2-byoa
locale: fr
sourceRef: 848b2085f11a1c18dbc67cae3ca2ebadc435a12c
sourceSha256: d06e94cf48bd4a889f7f19f1caa74286cbd0b3b20281e0b7b10f12274691ab2a
status: reviewed
reviewedBy: Codex (model self-review)
reviewedAt: '2026-11-04T07:40:18Z'
title: Android Studio stabilise pour la production les agents de programmation externes
description: Android Studio Rabbit 2 stabilise la prise en charge de Bring Your Own Agent via ACP, avec des outils propres à Android, des skills et une revue par IA. Le choix du fournisseur ne supprime pas les décisions de permissions et de coût.
imageAlt: Plusieurs clés d’agents interchangeables en métal s’alignent sur un même rail d’outils Android Studio en terre cuite
corrections: []
---

Google a publié Android Studio Rabbit 2 en version stable avec la prise en charge de Bring Your Own Agent. Selon l’entreprise, plus de 40 agents de programmation compatibles avec Agent Client Protocol peuvent utiliser des outils propres à Android dans l’IDE, en plus de la sélection d’agent, de la gestion des skills et d’AI Change Review.

La différence importante est la stabilité. Daily AI Pulse avait couvert la préversion de BYOA en septembre. Rabbit 2 transforme cette préversion en une surface de publication destinée à la production et étend le workflow qui l’entoure. Cela n’établit pas que tous les agents compatibles se comportent avec la même qualité ou la même sécurité.

## Un protocole commun sépare l’IDE du fournisseur

Agent Client Protocol donne à l’IDE et à un agent de programmation externe un moyen commun d’échanger du contexte et des actions. Une équipe Android peut ainsi conserver l’émulateur, la compilation, Logcat et les outils conscients du projet, tout en choisissant un fournisseur d’agents adapté à ses comptes ou politiques existants.

La compatibilité avec le protocole n’est qu’une couche. L’authentification, la facturation des modèles, le traitement des données et l’autorité sur le dépôt peuvent encore varier selon le fournisseur. Une connexion ACP techniquement fonctionnelle peut exposer davantage de fichiers, de commandes ou d’accès réseau que prévu par l’équipe.

## Piloter une tâche complète

Choisissez une petite modification Android assortie d’une condition d’acceptation claire — par exemple corriger un bug de cycle de vie pour lequel un test échoue déjà. Enregistrez l’agent, le modèle, la version de l’IDE et les permissions. Vérifiez ensuite s’il peut :

- trouver le module pertinent sans lire des dépôts sans rapport ;
- utiliser les outils de compilation et d’émulation à travers la frontière prévue ;
- interpréter Logcat sans copier de données sensibles dans les prompts ou les journaux ;
- produire un diff révisable plutôt qu’appliquer un nettoyage sans rapport ;
- expliquer quels contrôles ont réellement été exécutés.

AI Change Review peut ajouter une autre surface d’inspection, mais ne devrait pas être l’unique porte de revue de son propre travail. Conservez des tests déterministes et une revue humaine indépendante. Si une skill encapsule des instructions de projet, versionnez-la comme du code et inspectez séparément ses modifications et celles de l’application.

Aucune comparaison de sécurité ou d’interopérabilité entre agents n’était disponible dans la fenêtre de recherche. L’affirmation de Google sur la large prise en charge d’ACP établit la surface d’intégration annoncée, et non une qualité équivalente entre fournisseurs.

## À retenir

La stabilité de BYOA fait d’Android Studio un hôte plus flexible pour les agents de programmation. Elle ne rend pas ces agents interchangeables.

Traitez ACP comme une frontière d’intégration. Standardisez les preuves de tâche et les outils de l’IDE d’un côté, puis évaluez les permissions, les identifiants, le coût et la qualité des résultats de chaque fournisseur de l’autre. La décision de production porte sur l’ensemble du workflow configuré, pas sur la poignée de main du protocole.
