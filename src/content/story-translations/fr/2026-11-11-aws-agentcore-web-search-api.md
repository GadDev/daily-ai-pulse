---
storyId: 2026-11-11-aws-agentcore-web-search-api
locale: fr
sourceSha256: c614085e30606350b73d6ece15e4994e88b355569b7488b11e63a35425c20c8a
status: reviewed
reviewedBy: 'ChatGPT (model self-review)'
reviewedAt: '2026-11-16T11:30:00Z'
title: "AWS supprime la passerelle pour les recherches Web simples dans AgentCore"
description: "Une API signée fournit des résultats Web récents et sourcés sans créer de passerelle AgentCore, en laissant les politiques de recherche et les défenses contre les injections à l’application."
imageAlt: "Une requête de recherche terracotta signée traverse une frontière compacte et ramène quelques documents clairs avec leurs sources"
corrections: []
---

AWS vient de simplifier l’architecture de la recherche Web pour les applications AgentCore.

La nouvelle Web Search API renvoie des résultats récents, accompagnés de leurs sources, grâce à un seul appel d’API signé. Les développeurs peuvent l’utiliser depuis les SDK AWS, la CLI AWS ou le SDK Python AgentCore. Ils n’ont plus à créer une passerelle AgentCore, à configurer une cible de recherche Web puis à l’appeler depuis un client MCP lorsque leur application a simplement besoin de résultats de recherche.

L’infrastructure supprimée est bien réelle. Les politiques qu’elle centralisait le sont aussi.

## Ce qui change

AgentCore proposait déjà la recherche Web au moyen de Gateway, ce qui reste utile lorsqu’une équipe plateforme veut fournir un outil commun et des règles partagées à plusieurs agents. L’API directe ouvre une seconde voie pour une récupération d’informations contrôlée par chaque application.

Selon AWS, `langchain-aws` 1.9.3 et le SDK Python AgentCore 1.26.0 la prennent en charge. Les réponses comportent des résultats cités et des dates interprétées : l’API peut donc alimenter les boucles d’agents et les pipelines de données sans framework supplémentaire.

La disponibilité et les possibilités d’intégration sont établies par AWS. Cette recherche n’a pas testé indépendamment la qualité des résultats, la latence, le comportement selon les régions ni les modes de défaillance.

## Plus simple ne signifie pas sans gouvernance

Une passerelle centralise les contrôles parce que plusieurs applications traversent la même frontière. Une API directe déplace ces décisions dans chaque client.

C’est parfois le bon compromis pour un petit service. Mais dix équipes peuvent aussi se retrouver avec dix politiques de recherche, de conservation des données et de protection contre les injections légèrement différentes.

Les applications doivent encore définir :

- quelles identités peuvent effectuer des recherches et à quel débit ;
- quelles requêtes ou quels domaines sont restreints ;
- comment préserver les citations et les dates de récupération ;
- comment séparer les textes non fiables des instructions ;
- si le contenu récupéré peut influencer des appels d’outils ;
- comment gérer les résultats vides, périmés ou contradictoires ;
- quoi journaliser sans conserver inutilement les requêtes sensibles.

Les identifiants AWS authentifient l’appelant. Ils ne rendent pas la page Web obtenue digne de confiance.

## La recherche est une frontière d’entrée

Les agents utilisent les résultats Web comme contexte, mais ce contexte peut contenir des instructions dirigées contre eux. Une page produit peut demander au modèle d’ignorer sa tâche. Un document empoisonné peut exiger des secrets ou un nouvel appel d’outil.

Traitez chaque résultat comme une donnée. Supprimez le contenu actif, conservez les frontières entre sources et exigez une autorisation déterministe avant qu’un texte récupéré puisse déclencher une action. Une citation aide à examiner une affirmation ; ce n’est pas un label de sécurité.

Pour les workflows sensibles, séparez récupération et exécution. Un composant collecte et normalise les preuves, un autre évalue les affirmations. Une couche de politique — et non la page retrouvée — décide des outils disponibles.

## Ce que les équipes devraient essayer

Comparez l’API directe et la voie Gateway sur un workflow existant. Mesurez le coût de mise en place, la latence, la couverture des résultats, l’utilité des citations et les contrôles opérationnels.

Provoquez ensuite des échecs : domaines bloqués, réponses vides, délais dépassés, dates contradictoires, injections de prompts et sources dont la page change ultérieurement. Décidez si l’application peut gérer ces cas de manière cohérente.

## L’avis de Pulse

L’API directe est une simplification raisonnable. Tous les appels de recherche n’exigent pas une cérémonie d’infrastructure.

Mais retirer une passerelle du schéma ne supprime pas la frontière. Cela la déplace dans le code applicatif, où elle est plus facile à créer et plus facile à oublier.
