---
storyId: "2026-10-14-copilot-fail-closed-policy-refresh"
locale: "fr"
sourceRef: "c42d58b54e39eb1177ba0b0cb3e834d505195e26"
sourceSha256: "86fe9f8060d6e36b91447d6532b15f9887d96d3138bbdec03bbae500b90645a8"
status: "reviewed"
title: "Copilot peut désormais refuser de démarrer lorsque la politique d’entreprise est périmée"
description: "GitHub ajoute le rafraîchissement forcé des paramètres gérés et des versions minimales des clients sandbox, faisant du caractère à jour de la politique une condition de démarrage applicable."
imageAlt: "Une porte de contrôle verrouillée refuse un agent portant un sceau de papier expiré"
corrections: []
reviewedBy: "Codex (model review)"
reviewedAt: "2026-10-14T14:43:51.063Z"
---

GitHub a ajouté une option de démarrage qui bloque l'exécution lorsque la politique ne peut être confirmée (fail closed) pour les clients Copilot gérés par l'entreprise. Lorsque `forceRemoteSettingsRefresh` vaut `true`, un client pris en charge doit récupérer la politique actuelle au lieu de satisfaire les conditions de démarrage avec son cache. S'il ne peut pas confirmer la politique, il refuse de s'exécuter.

Ce paramètre est pris en charge dans Copilot CLI, Visual Studio Code et l'application GitHub Copilot. Les administrateurs peuvent le distribuer via des paramètres gérés côté serveur, un système de gestion des appareils mobiles (MDM) ou une configuration par fichier.

C'est un changement significatif du plan de contrôle. Une règle de refus, une exigence d'environnement isolé (sandbox), une politique de télémétrie ou une restriction d'outil n'est utile que si le client l'a effectivement reçue. La nouvelle option permet à une organisation de préférer une indisponibilité temporaire à une exécution sous une politique périmée ou non confirmée.

## Le comportement initial dépend du canal de distribution

La distribution par MDM et par fichier peut exiger une politique distante à jour avant qu'un client ne se connecte pour la première fois. Une valeur gérée côté serveur ne peut pas imposer cette condition au tout premier démarrage, car le client doit recevoir cette valeur une première fois pour savoir que les démarrages futurs nécessitent un rafraîchissement.

Cette distinction doit apparaître dans les plans de déploiement. Une organisation qui exige le blocage en cas d'échec du contrôle dès la première utilisation a besoin d'un mécanisme de gestion des appareils ou des fichiers, et pas seulement d'un paramètre côté serveur.

Sans rafraîchissement forcé, Copilot continue d'utiliser le cache normal des paramètres gérés. Cela préserve un démarrage plus rapide et la résilience lors de défaillances temporaires du service. Les administrateurs choisissent donc entre deux modes de défaillance explicites : une perte temporaire de Copilot lorsque la politique ne peut pas être confirmée, ou un fonctionnement temporaire sous la dernière politique mise en cache.

## Les anciens clients utilisant le sandbox peuvent être contraints de se mettre à jour

GitHub a également ajouté l'application d'une version minimale du client à la clé gérée `sandbox`. Lorsqu'une organisation configure cette clé, les utilisateurs dont les clients Copilot sont maintenus sur des versions plus anciennes doivent les mettre à jour avant de pouvoir reprendre l'utilisation de Copilot.

La conséquence opérationnelle est importante : imposer le sandbox crée désormais une dépendance au cycle de vie des clients. Les équipes ont besoin d'un déploiement progressif, d'un inventaire des versions prises en charge, de canaux de mise à jour et d'un plan en cas d'indisponibilité. Sinon, une modification de politique de sécurité peut soudainement bloquer les développeurs.

Cette mise à jour prolonge deux articles récents sur la gouvernance de Copilot, plutôt que de les répéter. L'article du 8 octobre traitait des restrictions possibles avec le sandbox local reposant sur MXC. Celui du 13 octobre couvrait ce que les entreprises peuvent collecter dans la télémétrie des agents. Le nouveau changement porte sur la fraîcheur des règles appliquées : le client dispose-t-il d'une politique à jour et d'une implémentation suffisamment récente avant de démarrer ?

## Ce que les équipes d'ingénierie devraient faire

- Décider quels paramètres gérés justifient un démarrage bloqué en cas d'échec du contrôle et documenter le compromis sur la disponibilité.
- Utiliser la distribution par MDM ou par fichier lorsque l'exigence doit s'appliquer avant la première connexion.
- Tester les démarrages hors ligne, avec un cache expiré, pendant une indisponibilité du service et lors de la première utilisation sur chaque client pris en charge.
- Inventorier les versions de clients figées avant d'imposer le minimum pour le sandbox.
- Déployer auprès d'un groupe pilote et surveiller les échecs de démarrage séparément des échecs des tâches de l'agent.
- Conserver une procédure d'accès d'urgence contrôlée qui ne puisse pas affaiblir silencieusement la politique ordinaire.

## Limites des preuves disponibles

GitHub documente le paramètre, les canaux de distribution, le comportement du cache, les clients pris en charge et l'application de la version minimale. Lors de cette préparation, nous n'avons pas testé indépendamment le comportement en cas d'échec ni vérifié la cohérence de l'implémentation entre les trois clients.
