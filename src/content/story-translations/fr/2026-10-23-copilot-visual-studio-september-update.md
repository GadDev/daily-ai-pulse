---
storyId: 2026-10-23-copilot-visual-studio-september-update
locale: fr
sourceRef: 7ab3fb9d55b14106761e85963cfacbae49341ecb
sourceSha256: 48e5fd4b7cc13bb267379c7f47c42e29f7f02c22d8c8ddc8c1c3fde5663f9602
status: reviewed
reviewedBy: Codex (model self-review)
reviewedAt: '2026-10-23T15:25:22.610123Z'
title: Visual Studio déplace BYOM vers le nouvel environnement d’exécution des agents de Copilot
description: La mise à jour de septembre de Copilot dans Visual Studio 2026 ajoute l’exploration des pull requests,
  déplace BYOM vers un nouvel environnement d’agents fondé sur le SDK et relie les corrections d’audit NuGet à un
  processus d’agent utilisant MCP.
imageAlt: Un raccord de précision interchangeable à côté d’un boîtier de forme nouvelle
corrections: []
---

Le récapitulatif Visual Studio publié par GitHub le 22 octobre contient un détail de migration à vérifier avant une mise à jour de l’IDE : Bring Your Own Model (BYOM) reste en aperçu, mais nécessite désormais Agent (Preview), fondé sur le SDK Copilot. Les modèles Ollama configurés auparavant doivent être ajoutés à nouveau.

## L’environnement d’exécution fait partie de la configuration

Les anciens modes Ask et Agent ne proposent plus BYOM. Le récapitulatif décrit également l’exploration de pull requests via un agent Git et un correcteur de vulnérabilités NuGet utilisant des outils MCP. La distinction utile sépare le choix d’un modèle de l’activation des outils qu’un agent peut appeler.

## Pourquoi prévoir un contrôle de déploiement

Pour une équipe, une connexion fonctionnelle à un modèle n’est que le début d’une configuration d’agent approuvée. L’accès aux outils, le contexte du dépôt et les autorisations de modification des dépendances peuvent nécessiter des décisions distinctes.

Le déploiement que nous suggérons commence par un petit projet de référence. Consignez la voie d’accès au modèle et les outils activés, mettez à jour un poste, puis répétez les mêmes tâches et examinez les modifications produites. Conservez un exemple de correction de dépendance comprenant une vérification pertinente du build ou de la compatibilité ; accepter une proposition de paquet ne prouve pas que l’application reste correcte.

Documentez la configuration approuvée en précisant le mode d’exécution autant que le fournisseur. Il devient ainsi plus facile de distinguer une connexion à recréer d’une politique qui doit rester en vigueur.

## Limites des éléments disponibles

Il s’agit de la description du produit par GitHub, et non d’un test pratique de compatibilité réalisé par Pulse. Le comportement de l’aperçu peut changer, et la date de publication du récapitulatif en octobre ne prouve pas que chaque fonctionnalité mentionnée a été livrée pour la première fois ce jour-là.

## À retenir pour les ingénieurs

Traitez le passage au nouvel environnement d’exécution comme une migration explicite de configuration. Vérifiez ensemble BYOM, l’accès MCP et les autorisations sur le dépôt avant d’élargir le déploiement.
