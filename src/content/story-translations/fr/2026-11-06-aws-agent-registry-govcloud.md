---
storyId: 2026-11-06-aws-agent-registry-govcloud
locale: fr
sourceRef: 526687b56048c0013c4a8aa4b72a369b41a7e441
sourceSha256: 36bef4162e2d7c141750dd6f4ab035a8c1f606c17756d77817554afc3bff8897
status: reviewed
reviewedBy: Codex (model self-review)
reviewedAt: '2026-11-08T08:05:30Z'
title: AWS apporte son catalogue d’agents gouverné à GovCloud US-West
description: Agent Registry est désormais disponible de manière générale dans AWS GovCloud US-West, offrant aux équipes du secteur public un catalogue interrogeable et un processus d’approbation pour les agents, outils, compétences et serveurs MCP.
imageAlt: Un tiroir de catalogue sécurisé en terre cuite organise des agents, des outils et des serveurs MCP derrière une porte d’approbation sombre et une piste d’audit
corrections: []
---

AWS a rendu Agent Registry disponible de manière générale dans AWS GovCloud US-West. Le service Bedrock AgentCore fournit aux organisations un catalogue central pour les agents, les outils, les compétences d’agents, les serveurs MCP et les ressources personnalisées.

Ce lancement régional est important pour les équipes du secteur public qui ont besoin de contrôles de découverte et d’approbation au sein de GovCloud. AWS documente une recherche hybride, la navigation dans le catalogue, des processus d’approbation, un point de terminaison MCP natif et des journaux d’audit CloudTrail.

Cette édition n’a pas testé le service. La disponibilité et les contrôles documentés sont des faits de première main ; l’annonce ne prouve pas qu’un registre suffit à empêcher l’utilisation non autorisée d’outils.

## La découverte devient une surface sous responsabilité

Les programmes d’agents commencent souvent par des dépôts, des feuilles de calcul ou des listes propres à chaque équipe recensant les outils disponibles. Cela fonctionne jusqu’à ce que plusieurs agents publient des capacités qui se chevauchent, avec des propriétaires et des modèles d’autorisation différents.

Un registre peut rendre l’inventaire interrogeable par les personnes comme par les agents. Il peut également séparer la publication de l’approbation : une ressource existe, mais elle ne devient découvrable qu’après acceptation par un processus autorisé.

Cette distinction est utile pour les serveurs MCP et les compétences. Le nom descriptif d’un outil ne constitue pas une revue de sécurité. Le registre devrait conserver, avec la description visible par l’agent, le propriétaire, la version, les utilisateurs visés, les classes de données, les exigences d’autorisation et un état de retrait.

## Une piste d’audit n’est pas une frontière d’autorisation

Les journaux CloudTrail aident à reconstituer qui a publié, approuvé ou modifié une ressource. Le point de terminaison MCP natif offre aux agents un moyen standard de rechercher dans le catalogue.

Aucune de ces fonctions ne limite automatiquement ce qu’un outil découvert peut faire. Les identifiants d’exécution, les frontières réseau, la délégation de l’utilisateur et la politique propre à l’outil déterminent toujours si une action est autorisée.

Traitez la découverte et l’exécution comme deux plans de contrôle distincts. Le registre peut répondre à la question « Qu’est-ce qui est approuvé et où se trouve-t-il ? ». La couche d’exécution doit encore répondre à « Cet agent, agissant pour cet utilisateur, peut-il appeler maintenant cette opération avec ces arguments ? ».

## Commencez par un catalogue restreint

Avant d’importer tous les outils internes, définissez une fiche minimale :

- propriétaire responsable et contact d’assistance ;
- type de ressource et version immuable ;
- utilisateurs, agents et environnements autorisés ;
- identifiants requis et classifications des données ;
- schéma des entrées et sorties ;
- effets secondaires connus et réversibilité ;
- preuve d’approbation et date d’expiration ;
- parcours de dépréciation et de réponse aux incidents.

Testez la qualité de la recherche avec des noms ambigus et des capacités qui se chevauchent. Un agent qui récupère le mauvais outil approuvé peut tout de même effectuer la mauvaise action.

Utilisez CloudTrail pour déclencher des alertes sur les événements de publication, d’approbation, d’autorisation et de suppression. Échantillonnez périodiquement les entrées du catalogue et comparez-les aux points de terminaison déployés afin que les descriptions ne dérivent pas du comportement réel.

## À retenir

La disponibilité régionale offre aux équipes GovCloud un endroit pratique pour organiser les ressources d’agents, mais il ne faut pas confondre catalogue et confinement.

Le modèle durable consiste à relier une découverte gouvernée à une autorisation d’exécution et à des preuves indépendantes. Agent Registry peut fournir l’inventaire et la piste d’approbation ; les équipes restent responsables des identifiants, des contrôles de politique et des conséquences derrière chaque outil répertorié.
