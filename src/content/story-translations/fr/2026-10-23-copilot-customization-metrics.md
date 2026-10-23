---
storyId: 2026-10-23-copilot-customization-metrics
locale: fr
sourceRef: 7ab3fb9d55b14106761e85963cfacbae49341ecb
sourceSha256: cb6c0e48c4f3a5676cfe2dcab2c67252ad8816edd33bec20d258606b759c632e
status: reviewed
reviewedBy: Codex (model self-review)
reviewedAt: '2026-10-23T15:25:22.610852Z'
title: Les métriques Copilot nomment désormais les skills, agents et serveurs MCP internes
description: L’API de métriques d’usage de GitHub rapporte désormais les noms configurés des skills, agents, serveurs
  MCP, commandes slash et plugins définis par les clients.
imageAlt: Des outils sculpturaux distincts rangés dans des compartiments de forme individuelle
corrections: []
---

La mise à jour des métriques publiée par GitHub le 22 octobre permet de mieux distinguer les personnalisations d’agents internes. Les rapports d’usage exposent désormais les noms configurés des skills, agents, serveurs MCP, commandes slash et plugins personnalisés, avec jusqu’à 25 entrées par liste de personnalisations au lieu de cinq.

## De meilleurs libellés, une couverture limitée

GitHub documente des limites liées aux versions des clients et à la télémétrie. Les noms apparaissent dans les journées de rapport nouvellement traitées ; les anciens rapports ne sont pas renommés rétroactivement. Il s’agit de signaux d’adoption, pas d’un système de comptabilisation exacte ni d’une mesure de la qualité du travail.

## Ce qu’une équipe plateforme peut en faire

La question utile est de savoir si une personnalisation interne atteint le public auquel elle est destinée. Une entrée nommée peut aider une équipe à décider où améliorer la documentation ou examiner un déploiement défaillant, mais le rapport seul n’explique ni pourquoi une personne a utilisé un outil, ni s’il l’a aidée.

Commencez par un inventaire des noms approuvés et des usages prévus. Comparez une date de déploiement à l’adoption ultérieure, tout en consignant les clients et les paramètres de télémétrie représentés. Une entrée absente peut justifier un contrôle de configuration plutôt que la conclusion que les développeurs ont rejeté l’outil.

Vérifiez les noms avant d’exporter des rapports. Même sans code source, un libellé interne peut révéler la structure d’un projet ou un objectif métier. Les rapports agrégés doivent avoir un public et une finalité, particulièrement lorsqu’une vue par utilisateur existe.

## Limites des éléments disponibles

Le comportement des champs et les limites de couverture proviennent de GitHub. Pulse n’a pas audité de manière indépendante l’exhaustivité de la télémétrie. Une évolution de l’adoption rapportée n’établit pas une évolution de la productivité, de la qualité ou de la performance des salariés.

## À retenir pour les ingénieurs

Utilisez les noms pour améliorer l’accompagnement et repérer les lacunes de configuration. Associez les chiffres à des retours qualitatifs volontaires et à des évaluations adaptées à la charge ; ne transformez pas un compteur d’usage en note de valeur de l’ingénierie.
