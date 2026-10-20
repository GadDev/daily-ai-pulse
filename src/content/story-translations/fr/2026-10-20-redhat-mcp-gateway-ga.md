---
storyId: "2026-10-20-redhat-mcp-gateway-ga"
locale: fr
sourceRef: "f9d0331e3f0c9b9ea9851d942d27fb4785c0906b"
sourceSha256: "e634ca8ca4cbedb2e4496560ca4b52aec520f0ad1bdf8cb5d83189c0e5760a04"
status: reviewed
reviewedBy: "Codex (model review)"
reviewedAt: "2026-10-20T10:14:28Z"
title: "La passerelle MCP de Red Hat passe en disponibilité générale avec isolation, journaux d'audit et transport sans état"
description: "Connectivity Link 1.5 fait de la passerelle MCP de Red Hat une version de production dotée d'une isolation des tenants, d'une négociation de protocole, d'une découverte progressive ainsi que de contrôles explicites de garde-fous et d'observabilité."
imageAlt: "Un passage en terre cuite protégé se divise entre des chambres séparées au sein d'une structure de passerelle en couches"
corrections: []
---

Red Hat a rendu sa passerelle Model Context Protocol disponible de manière générale dans le cadre de Connectivity Link 1.5. La version dépasse le stade de la préversion technologique et ajoute des contrôles destinés à l'exploitation de plusieurs connexions entre agents et outils sur OpenShift : isolation des passerelles et des serveurs, chemin de transport sans état, fédération des prompts et des ressources, intégration de garde-fous, journalisation d'audit et métriques du broker.

Le changement important ne tient pas simplement à l'existence d'un proxy MCP supplémentaire. Red Hat regroupe la séparation du trafic, l'autorisation, la compatibilité des protocoles et l'observabilité au sein d'une même frontière opérationnelle entre les agents et les serveurs MCP. La version intéresse donc les équipes plateforme qui doivent décider où placer la politique applicable aux outils lorsque de nombreuses applications, équipes ou tenants partagent un même environnement MCP.

## L'isolation peut être dédiée ou partagée

Red Hat documente deux modèles d'isolation. Une équipe peut disposer d'une instance de passerelle entièrement séparée, avec des composants routeur et broker distincts, ou plusieurs équipes peuvent partager l'infrastructure centrale de la passerelle tout en bénéficiant de points d'écoute et de composants en aval séparés. Le modèle partagé expose des chemins distincts pour des groupes de serveurs MCP, tout en maintenant leur trafic séparé après le routage.

Cette souplesse est utile, mais elle ne supprime pas la nécessité d'un modèle de menace. Les équipes doivent toujours définir quelles ressources partagent un domaine de défaillance, quelles déclarations d'identité sont approuvées par la passerelle, comment les routes et les enregistrements de serveurs sont examinés, et si le point d'écoute partagé convient à des charges de travail présentant des niveaux de sensibilité différents.

La passerelle fédère également les prompts et les ressources, en plus des outils. Les prompts peuvent être filtrés à l'aide de la déclaration JWT `allowed-capabilities` et délimités sur un `MCPVirtualServer`. La fédération des ressources couvre certaines opérations sur les ressources et peut appliquer des règles d'autorisation avant que les données visibles par l'agent ne soient renvoyées.

## La compatibilité des protocoles comprend désormais un chemin sans état

Connectivity Link 1.5 prend en charge la version 2026 du protocole MCP citée par Red Hat, parallèlement aux versions antérieures de 2025, sur un même point de terminaison. Les clients peuvent négocier la version, tandis qu'un chemin avec état dédié reste disponible pour les anciens comportements reposant sur des sessions.

Cette distinction compte lors de l'évaluation de la mise à l'échelle horizontale et du basculement. Un transport sans état peut faciliter la distribution du traitement des requêtes, mais toutes les fonctionnalités de la passerelle ne sont pas sans état. Red Hat précise que la découverte progressive des outils — dans laquelle un agent reçoit d'abord des métadonnées légères sur les outils, puis sélectionne un ensemble de travail — dépend de sessions et se limite au chemin du protocole avec état.

La question pratique de l'examen se pose donc fonctionnalité par fonctionnalité : quels clients et serveurs utilisent quelle version du protocole, et quels comportements de découverte, de prompt, de ressource ou de session changent lorsque le trafic passe d'un chemin à l'autre ?

## Les contrôles d'audit et les garde-fous sont explicites, sans constituer une preuve automatique

Pour les appels d'outils valides, le routeur peut produire des entrées d'audit structurées comprenant l'identité de l'appelant lorsqu'elle est disponible, les noms de l'outil et du serveur, l'état de la réponse ainsi que les identifiants de requête et de session. Le broker expose aussi des métriques Prometheus sur les tentatives de découverte, leur durée, l'inventaire des outils, les échecs de connexion et la taille des réponses.

Red Hat décrit également une intégration avec NeMo Guardrails qui vérifie les corps des requêtes et des réponses d'appels d'outils au regard de politiques configurées. Le service de garde-fous est distinct de l'authentification et de l'autorisation, et doit être installé et configuré. Cette séparation est saine : les contrôles de politique sur le contenu ne doivent pas être confondus avec le contrôle de l'identité ou des accès.

## À retenir pour les ingénieurs

Évaluez la passerelle comme un composant du plan de contrôle, et non comme un proxy transparent. Établissez une petite matrice de compatibilité couvrant les versions de protocole des clients, les routes avec et sans état, l'autorisation des prompts et des ressources, les modes de défaillance du service externe de garde-fous, la conservation des journaux d'audit, la cardinalité des métriques et l'isolation des tenants. Testez ensuite les appels rejetés et les défaillances du back-end, et pas seulement les appels d'outils réussis.

La version fournit des primitives concrètes pour centraliser les opérations MCP. Elle ne démontre pas leur efficacité sur une charge de travail indépendante, et Red Hat n'a pas publié dans son annonce de résultats comparatifs sur la latence, le débit ou la sécurité.

## Limites des preuves

La date de disponibilité, l'ensemble des fonctionnalités, les exemples de configuration et le comportement opérationnel annoncé proviennent de la publication de Red Hat du 16 octobre. Il s'agit de déclarations produit de première partie. Aucune évaluation indépendante en production de la passerelle en disponibilité générale n'a été identifiée au cours de cette recherche.
