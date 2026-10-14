---
storyId: "2026-10-14-adk-overnight-agent-workflow"
locale: "fr"
sourceRef: "c42d58b54e39eb1177ba0b0cb3e834d505195e26"
sourceSha256: "945e3a64707d82615ba9f87c4fb4bee4322a8f70a7b1d52c1a7e8425c5268ee3"
status: "reviewed"
title: "L’exécution nocturne d’ADK par Google montre pourquoi il faut encore élaguer le travail produit par les agents de programmation"
description: "Une exécution d’Argon de 11 heures a utilisé les compétences du dépôt, un objectif persistant, les tests complets et des benchmarks de contrôle pour livrer deux améliorations de performance, après le rejet de quatre autres par les mainteneurs."
imageAlt: "Un long établi où de nombreuses pièces produites par un agent sont réduites à deux composants achevés"
corrections: []
reviewedBy: "Codex (model review)"
reviewedAt: "2026-10-14T14:43:51.063Z"
---

Des ingénieurs de Google Cloud ont publié un compte rendu particulièrement facile à examiner d'une exécution sans surveillance d'un agent de programmation sur `google/adk-python` : environ 205 000 lignes de Python, près de 800 fichiers source et 16 892 tests unitaires. Le résultat utile n'est pas que Gemini 4 Argon ait travaillé pendant 11 heures. C'est le workflow qui a transformé six propositions de l'agent en deux modifications livrées, tout en écartant de la branche principale quatre idées plausibles mais risquées ou peu utiles.

La première exécution, de deux heures, n'avait reçu qu'un prompt centré sur le résultat attendu. Elle a trouvé de véritables goulets d'étranglement, mais a aussi modifié un schéma JSON public, manqué des cas limites d'événements simulés, exécuté seulement 216 tests proches du code modifié et omis les données de benchmark dans sa proposition de pull request. Une partie du code a été conservée, mais l'exécution n'a pas répondu aux attentes des mainteneurs.

## Les instructions du dépôt ont changé la qualité de l'exécution

Pour la deuxième tentative, l'équipe a placé les conventions des mainteneurs dans `.agents/skills`. Un court `SKILL.md` renvoyait vers des fichiers de référence ciblés, notamment des règles de visibilité des modules privés et des contrôles d'import différé, afin que l'agent puisse charger la politique pertinente sans placer chaque règle dans chaque fenêtre de contexte.

L'équipe a également utilisé le mode `/goal` d'Antigravity pour conserver le résultat attendu et les contraintes lors des compactages de contexte. Le prompt exigeait de ne modifier ni les requêtes au modèle ni l'API publique, d'ajouter des tests de non-régression et des chiffres avant/après, de produire une seule pull request non fusionnée et d'obtenir un résultat que les mainteneurs approuveraient.

Pendant les 11 heures d'exécution, l'agent a lu 12 fichiers de consignes, établi des mesures de référence pour le démarrage du package, une conversation de 200 étapes, une charge de transfert entre 20 sous-agents et un workflow de 12 nœuds, puis répété ces charges 30 fois. Il a aussi exécuté l'ensemble des 16 892 tests et détecté un bug dans son propre cache multi-agent peu avant de s'arrêter.

Ce schéma est plus solide que « laisser l'agent tourner plus longtemps ». L'objectif persistant indiquait à l'environnement d'exécution quand le travail était terminé ; les compétences du dépôt enseignaient les conventions locales ; les benchmarks mesuraient le résultat demandé ; et la suite complète vérifiait le comportement d'intégration.

## Les quatre optimisations rejetées constituent la preuve importante

L'exécution a proposé six optimisations réparties sur 32 fichiers. Les mainteneurs en ont conservé deux : filtrer l'historique de session en mémoire avant de le copier, et différer les imports lourds tout en préservant les attributs publics remplaçables par patch. Le résultat fusionné a modifié 22 fichiers et ajouté 17 fonctions de test.

Les quatre autres ont été rejetées après revue :

- un cache multi-agent améliorait un benchmark synthétique de 17 %, mais pouvait renvoyer des données périmées si Python réutilisait une adresse mémoire ;
- un raccourci de télémétrie dépendait d'un attribut privé d'OpenTelemetry ;
- une réécriture de l'historique de conversation augmentait la complexité sans améliorer un benchmark indépendant tenu à l'écart de l'optimisation ;
- un index des événements du workflow ajoutait de l'état pour un gain limité à des tests de rejeu synthétiques.

C'est la leçon la plus claire du compte rendu : un agent peut explorer largement, mais un mainteneur doit retirer les modifications dont la correction, la stabilité des dépendances ou le bénéfice réel sont insuffisants.

## Les chiffres livrés ont un périmètre précis

Google rapporte une réduction d'environ 40 % du surcoût de préparation d'`InMemorySessionService` après 50 et 150 tours, un `import google.adk` à froid 21 % plus rapide et, pour une exécution de 158 tours limitée au framework, une baisse de 65,6 à 56,1 secondes. L'équipe indique qu'un benchmark de contrôle indépendant avait été écrit avant les exécutions et caché à Argon.

Ces améliorations ne s'appliquent pas à tous les déploiements d'ADK. Les stockages de session en base de données externe, SQLite, sur la plateforme Gemini, Firestore et Redis n'empruntent pas le même chemin de copie profonde. Et si l'import du package est devenu plus rapide, le délai entre le lancement d'un nouveau processus et la première requête au modèle est resté pratiquement inchangé, car les modules différés se chargent au premier tour.

## Un schéma opérationnel réutilisable

Pour un travail sérieux sans surveillance sur un dépôt :

1. Exprimer le résultat souhaité et les invariants, plutôt qu'un correctif supposé.
2. Placer les règles d'architecture et de revue dans des instructions de dépôt accessibles et versionnées.
3. Exiger une seule branche ou pull request révisable et interdire sa fusion.
4. Définir les mesures de référence, les tests de non-régression et les contrôles tenus à l'écart de l'optimisation avant l'exécution.
5. Exécuter la suite complète, et pas seulement les tests proches des fichiers modifiés.
6. Examiner les idées rejetées et les erreurs évitées de justesse, et pas seulement le diff final.

## Limites des preuves disponibles

Il s'agit d'une étude de cas de première main menée par Google sur son propre modèle, son environnement d'exécution et son dépôt. Le commit fusionné permet d'inspecter séparément le diff livré et la note de benchmark, mais le journal de la session de 11 heures et la comparaison entre les deux exécutions restent décrits par le fournisseur. Le résultat démontre un workflow contrôlé ; il n'établit pas un taux de réussite général des agents de programmation sans surveillance.
