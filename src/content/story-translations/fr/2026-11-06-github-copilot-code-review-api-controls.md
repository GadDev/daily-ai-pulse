---
storyId: 2026-11-06-github-copilot-code-review-api-controls
locale: fr
sourceRef: 47525962ca9b09ca0e4cee47d2e0916261a77f23
sourceSha256: ffcbe11d726613105d4cf611d65afeb316f3659cffdbfc484c1deb03d18f7c6f
status: reviewed
reviewedBy: Codex (model self-review)
reviewedAt: '2026-11-07T08:25:01Z'
title: GitHub expose la politique et la provenance de la revue de code Copilot par API
description: De nouveaux contrôles REST et GraphQL permettent aux administrateurs d’automatiser la politique de revue de code Copilot, tandis que des champs d’attribution exposent l’effort et les compétences, serveurs MCP et instructions déclarés comme sources d’un commentaire.
imageAlt: Un sceau de revue de code en métal sombre est relié à des leviers de politique en terre cuite et à une chaîne visible de marqueurs de provenance pour les instructions, compétences et serveurs MCP
corrections: []
---

GitHub a ajouté des contrôles REST et GraphQL pour les paramètres de revue de code Copilot, depuis la politique de l’entreprise jusqu’aux dépôts. La plateforme expose aussi des métadonnées d’attribution capables d’identifier les revues et commentaires Copilot, d’indiquer l’effort de revue et de montrer quelles compétences, quels serveurs MCP et quelles instructions personnalisées Copilot déclare avoir utilisés pour un commentaire.

Ce changement est plus important que la mise à jour de présentation qui l’accompagne. Il fournit aux équipes de plateforme une surface programmable pour la politique de revue et une trace plus claire pour examiner la configuration d’une revue par IA.

Le journal des modifications de GitHub établit la disponibilité. Cette édition n’a pas exercé les points de terminaison de façon indépendante, et la publication ne prouve pas que la provenance déclarée constitue une preuve complète du raisonnement du modèle.

## La politique peut entrer dans l’infrastructure

Les administrateurs d’entreprise peuvent gérer l’autorisation donnée aux organisations d’utiliser la revue de code Copilot. Les administrateurs d’organisation peuvent gérer l’activation, l’effort par défaut et la configuration des exécutants dans les limites de l’entreprise. Les administrateurs de dépôt peuvent contrôler l’effort et l’utilisation d’instructions personnalisées et d’outils MCP par les revues.

Cette hiérarchie permet à une équipe d’exprimer la politique de revue comme une configuration gérée plutôt que comme une liste de contrôle dans l’interface web. Elle soulève aussi des questions familières : quelle couche possède un réglage, quel rôle peut le modifier, comment détecter la dérive et comment revenir en arrière.

La prise en charge des tokens varie selon les points de terminaison. GitHub indique que les API de paramètres d’entreprise et d’organisation ne prennent pas en charge les GitHub Apps ni les tokens d’accès personnel à granularité fine, tandis que les paramètres de dépôt les acceptent avec des permissions d’administration. L’automatisation doit être conçue autour de la frontière d’authentification réelle, et non d’une API supposée uniforme.

## L’attribution n’est pas une preuve, mais constitue un élément utile

Des champs explicites permettent d’identifier les revues et commentaires de Copilot. Les métadonnées peuvent aussi inclure le niveau d’effort ainsi que les compétences, serveurs MCP et instructions personnalisées déclarés comme sources d’un commentaire.

Cela aide à répondre à des questions opérationnelles. La revue a-t-elle été exécutée avec l’effort prévu ? Le jeu d’instructions du dépôt a-t-il été inclus ? Une intégration MCP a-t-elle influencé le commentaire ? Un pipeline d’audit peut-il distinguer les constats humains de ceux de Copilot sans analyser la prose ?

Le mot « déclarés » est important. Les métadonnées de provenance sont des éléments fournis par le système de revue. Elles ne prouvent pas indépendamment qu’une source a causé un constat ni qu’aucun autre contexte n’a compté. Conservez-les avec le commit, la version de la politique, l’identité de la requête et le commentaire produit afin que la revue ultérieure ne dépende pas de la configuration courante.

## Construire un déploiement borné

Commencez par un inventaire en lecture seule. Exportez les paramètres effectifs d’un petit ensemble de dépôts et comparez-les à la politique prévue de l’entreprise et de l’organisation. Signalez les dérives avant d’automatiser les écritures.

Testez ensuite les changements dans un dépôt jetable. Confirmez que les paramètres détenus par l’entreprise ne peuvent pas être remplacés, que les choix du dépôt se comportent comme documenté et que les fichiers exclus restent exclus. Utilisez une pull request créée par un bot, une revue arrivée à expiration et un modèle préféré indisponible pour observer les nouvelles tentatives et les solutions de repli.

Pour chaque revue, conservez :

- le SHA du commit et l’ensemble des fichiers modifiés ;
- l’effort effectif et le niveau de politique ;
- les champs d’attribution des instructions, compétences et serveurs MCP ;
- les fichiers ignorés et leurs motifs d’exclusion ;
- les constats acceptés, rejetés ou corrigés ;
- les crédits consommés et l’état terminal de la revue.

Ces enregistrements permettent à une équipe de mesurer le rendement des revues et les faux positifs sans traiter chaque commentaire de l’IA comme un défaut.

## Les changements de synthèse facilitent l’inspection

La nouvelle vue de synthèse de GitHub regroupe les fichiers qui n’ont pas été revus et relie leurs motifs d’exclusion. Les longues listes sont repliées derrière un nombre, tandis que l’effort et les retours sont déplacés vers un pied de commentaire plus compact. La publication ajoute également des motifs de retour pour les constats incorrects, trop verbeux ou trop pointilleux.

Cette présentation est utile, mais la surface API constitue le changement d’ingénierie durable. Un commentaire compact ne peut pas remplacer la liste sous-jacente des fichiers, la politique et l’enregistrement de provenance lorsqu’une revue fait partie d’un contrôle de conformité ou de publication.

## À retenir

La revue de code par IA devient plus facile à gouverner lorsque sa politique est programmable et que sa sortie porte une attribution exploitable par machine.

Ne confondez pas cela avec une certification. Le réviseur peut toujours manquer un bug ou en inventer un, et ses champs de provenance restent des métadonnées de première main. Utilisez les API pour rendre configuration et preuves inspectables, puis conservez les tests déterministes et l’autorité humaine de publication comme contrôles séparés.
