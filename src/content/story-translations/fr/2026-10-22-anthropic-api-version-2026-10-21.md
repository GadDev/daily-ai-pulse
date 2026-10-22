---
storyId: "2026-10-22-anthropic-api-version-2026-10-21"
locale: fr
sourceRef: "bf78362b0dc8620a6e6bcfd2d5867cc66c71828f"
sourceSha256: "95b1198ce34ab599c689aff6507315a3a0008eecd6f913459c6f57109da6fa56"
status: reviewed
reviewedBy: "Codex (model review)"
reviewedAt: "2026-10-22T07:08:17Z"
title: "La nouvelle version de l'API d'Anthropic transforme une mise à niveau du SDK en migration de protocole"
description: "La version 2026-10-21 de l'API Claude supprime des paramètres d'échantillonnage, modifie les formes de messages acceptées et accompagne de nouvelles versions majeures des SDK, avec leurs propres ruptures d'authentification et de boucles d'agents."
imageAlt: "Un pont adaptateur physique en cours de reconstruction entre deux interfaces mécaniques précises"
corrections: []
---

Anthropic a publié la version `2026-10-21` de l'API Claude le 21 octobre, en même temps que de nouvelles versions majeures de ses SDK clients officiels et de la CLI `ant`, qui envoient cette nouvelle version par défaut.

Ce couplage est important. Une application peut adopter le nouveau contrat d'échange en mettant à niveau un SDK vers sa nouvelle version majeure, puis rencontrer dans le même déploiement à la fois les ruptures au niveau de l'API et des changements distincts dans la bibliothèque cliente.

## Ce qui a changé dans l'API

La rupture la plus immédiate dans l'API Messages est la suppression de trois paramètres d'échantillonnage. Une requête utilisant `temperature`, `top_p` ou `top_k` renvoie désormais une erreur HTTP 400, même si le paramètre est réglé sur sa valeur par défaut. Anthropic indique qu'il n'existe aucun remplacement pour les valeurs d'échantillonnage autres que celles par défaut : il faut supprimer ces champs ou conserver la requête concernée sur la version `2023-06-01` de l'API.

La nouvelle version impose aussi des règles plus strictes quant à l'emplacement des blocs de contenu. Un bloc `document` placé directement dans un message `assistant` renvoie une erreur HTTP 400, tandis que les documents envoyés dans des messages `user` restent pris en charge. Un tableau `citations` non vide dans un bloc `text` d'un message `user` est également rejeté. Les citations présentes dans des réponses antérieures de l'assistant peuvent toujours être renvoyées, et les paramètres qui activent les citations sur les documents et les résultats de recherche restent valides.

Les clients Admin et Claude Enterprise Analytics comportent eux aussi des migrations de réponses. Parmi les champs renommés, `roles` devient `role_ids` pour les groupes RBAC, le champ `workspace_id` d'une clé API est remplacé par un objet structuré `scope`, et des champs d'analyse tels que `actor.email` et `summaries` deviennent respectivement `actor.email_address` et `data`.

## La version majeure du SDK ajoute ses propres ruptures

Les premières versions qui utilisent par défaut l'API `2026-10-21` sont les SDK Python 2.0.0, TypeScript 1.0.0, C# 13.0.0, Go 2.0.0, Java 3.0.0, PHP 1.0.0 et Ruby 2.0.0, ainsi que la CLI `ant` 2.0.0. Les versions courantes d'Anthropic ont déjà dépassé ces premières versions compatibles : épingler uniquement « latest » ne décrit donc pas la frontière de migration.

Plusieurs changements sont indépendants de la version de l'API :

- les SDK et la CLI envoient une clé API sous la forme `Authorization: Bearer <key>` plutôt que dans `X-Api-Key`, ce qui peut perturber les proxys ou passerelles qui inspectent l'ancien en-tête ;
- un client ne conserve désormais qu'un seul identifiant, avec un ordre de priorité explicite lorsque les identifiants proviennent de variables d'environnement, d'une identité de charge de travail ou de profils locaux ;
- en Python, `MessageParam` et son équivalent bêta deviennent des unions propres à chaque rôle, plutôt qu'un type unique instanciable ;
- la compaction côté client est supprimée des exécuteurs d'outils TypeScript et Ruby au profit de la gestion du contexte côté serveur ;
- les interfaces historiques de Text Completions disparaissent des SDK TypeScript, Go, Java et Ruby, ainsi que de la CLI ; et
- les licences des SDK et de la CLI passent de MIT à Apache 2.0.

La CLI `ant` supprime également les options qui plaçaient directement des clés API ou des jetons d'authentification dans la ligne de commande. Anthropic oriente les utilisateurs vers les variables d'environnement, l'entrée standard ou la connexion interactive, afin d'éviter que les identifiants apparaissent dans l'historique du shell et la liste des processus.

## Pourquoi c'est important

Il ne s'agit pas d'une mise à jour de dépendance que la seule compilation suffit à valider. La construction des requêtes, l'analyse des réponses, le comportement des proxys, la sélection des identifiants, la compaction du contexte et l'automatisation en ligne de commande peuvent tous changer, même lorsque le modèle et la logique applicative restent identiques.

Le guide de migration recommande explicitement de publier la mise à niveau du SDK avec les correctifs exigés par le nouveau contrat d'API, puis de tester le tout avec la version `2026-10-21` avant le déploiement. Amazon Bedrock ajoute une autre limite : Anthropic indique que la nouvelle version de l'API n'y est disponible que pour Claude 4.7 et les modèles ultérieurs.

## Limites des preuves

La date de publication, les règles de compatibilité, les premières versions majeures des SDK et les changements incompatibles proviennent des notes de version et de la documentation de migration d'Anthropic. Ces documents définissent l'interface prise en charge par le fournisseur, mais cet article ne prétend pas avoir réalisé de test de compatibilité indépendant et ne déduit aucun gain de performances, de fiabilité ou de sécurité de cette mise à niveau.

## À retenir pour les ingénieurs

Traitez la mise à niveau comme une migration de protocole :

- recherchez `temperature`, `top_p` et `top_k` dans les constructeurs de requêtes et les charges utiles de traitement par lots ;
- testez les blocs de documents et de citations en fonction du rôle du message, y compris lors de la relecture de l'historique d'une conversation ;
- ajoutez des tests de contrat pour les champs Admin et Analytics renommés au lieu de compter sur une désérialisation permissive ;
- vérifiez si les passerelles, les objets simulés, le traçage et les utilitaires d'identifiants supposent la présence de `X-Api-Key` ;
- testez l'ordre de priorité des identifiants lorsque plusieurs sources d'environnement ou de profil peuvent être présentes ;
- remplacez la compaction côté client des exécuteurs d'outils par le flux documenté côté serveur avant de mettre à niveau les SDK concernés ;
- inventoriez les usages historiques de Text Completions et les scripts `ant` qui transmettent des identifiants au moyen d'options ; et
- déployez ensemble la version majeure du SDK et le changement de version de l'API, afin qu'un retour arrière restaure les deux côtés du contrat.

La dépendance importante n'est plus seulement la version du paquet. C'est la version du paquet, plus la version de l'API qu'il envoie en votre nom.
