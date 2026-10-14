---
storyId: "2026-10-14-ml-drift-edge-inference"
locale: "fr"
sourceRef: "c42d58b54e39eb1177ba0b0cb3e834d505195e26"
sourceSha256: "172d5d77ae2959c21075bd47000d3ea8db32c5b02921ed3e50e0df7be3b415a8"
status: "reviewed"
title: "ML Drift remplace le chemin du délégué GPU de TFLite par un cœur d’inférence multiplateforme"
description: "Google a ouvert le code du moteur GPU de LiteRT déjà utilisé dans Chrome, Photos, Meet, YouTube, Adobe et Snap, tout en arrêtant les nouvelles fonctionnalités de l’ancien délégué."
imageAlt: "Un moteur d’inférence en couches s’adapte à plusieurs surfaces matérielles distinctes"
corrections: []
reviewedBy: "Codex (model review)"
reviewedAt: "2026-10-14T14:43:51.063Z"
---

Google a publié sous licence Apache 2.0 le code source de ML Drift, le moteur de calcul GPU intégré à LiteRT. Cette publication compte parce qu'il ne s'agit pas d'un environnement d'exécution destiné à la recherche, encore en quête d'une première charge de travail : Google affirme que ML Drift fonctionne déjà sur des millions d'appareils dans Chrome, YouTube Shorts, Photos et Meet, avec des déploiements chez Adobe et Snap. Dans le même temps, l'entreprise indique que le délégué GPU historique de TensorFlow Lite ne recevra plus de nouvelles fonctionnalités.

Cette combinaison modifie l'équation de migration pour l'IA embarquée sur les appareils. Les équipes peuvent désormais évaluer l'implémentation, alors que l'évolution de la prise en charge GPU de LiteRT repose sur le nouveau moteur.

## La virtualisation des tenseurs remplace la gestion des shaders propre à chaque backend

L'ancien délégué imposait aux implémentations de shaders d'encoder la correspondance entre les tenseurs logiques et les textures et buffers physiques pour chaque backend. ML Drift insère une couche de virtualisation des tenseurs : des modèles dynamiques de shaders résolvent les coordonnées lors de l'initialisation du compilateur, ce qui permet à une représentation logique unique de cibler OpenGL ES, OpenCL, Metal et WebGPU.

Le moteur ajoute aussi une interface bas niveau d'enregistrement d'opérateurs personnalisés et une prise en charge native des tenseurs 5D. Google fournit un `SKILL.md` destiné à aider les agents de programmation à écrire, enregistrer et vérifier des shaders personnalisés. C'est une commodité utile, mais les noyaux personnalisés restent du code système : ils nécessitent une couverture des appareils, des vérifications numériques, des solutions de repli et un profilage sur le parc matériel réel.

Pour les modèles génératifs locaux, ML Drift traite le préremplissage et le décodage comme des charges différentes. Google indique changer les noyaux et les dispositions mémoire selon la phase, en utilisant une disposition du cache KV alignée sur la convolution et une quantification des activations au sein du noyau pendant le décodage pour réduire les transferts mémoire. Le même chemin WebGPU peut passer par Dawn sous Windows et Linux, tandis que Metal reste le backend natif de macOS.

## Les preuves de production sont larges, mais rapportées par le fournisseur

Google annonce jusqu'à 12 % de surcoût mémoire en moins dans ses comparaisons avec Gemma. L'entreprise indique que YouTube Shorts a réduit la latence moyenne par image jusqu'à 40 %, que Google Photos a gagné jusqu'à deux secondes sur certains pipelines, que les fonctionnalités de retouche mobile d'Adobe se sont améliorées jusqu'à 30 % et que Snap a constaté une latence inférieure de 30 % pour certains effets.

Ces chiffres portent sur des applications, appareils, modèles et références de comparaison différents. Il ne faut ni en faire la moyenne ni les traiter comme une accélération universelle. Le signal le plus fort est l'étendue de l'adoption : un seul moteur sert à la vision classique, aux API de modèles de langage dans le navigateur et aux charges génératives sur plusieurs familles de GPU.

## La migration nécessite toujours une matrice de compatibilité

Google décrit ML Drift comme rétrocompatible avec les modèles LiteRT existants, mais sa propre annonce distingue les chemins mobiles disponibles en version générale des préversions pour ordinateur et précise que la distribution via Play Services reste à venir. Un plan de migration devrait donc consigner le format de distribution exact de l'environnement d'exécution, le backend, la couverture des opérateurs, le comportement de repli et l'ensemble minimal d'appareils, plutôt que de s'appuyer sur l'affirmation générale de compatibilité.

Les équipes d'ingénierie devraient :

- évaluer des appareils représentatifs plutôt qu'un seul téléphone haut de gamme ou poste de travail ;
- comparer la latence de bout en bout, le pic de mémoire, le comportement thermique et l'impact sur la batterie, et pas seulement le débit des noyaux ;
- tester séparément le préremplissage et le décodage pour les modèles autorégressifs ;
- valider chaque opérateur personnalisé par rapport à une implémentation de référence et à un chemin de repli ;
- figer la version de l'environnement d'exécution open source et le réviser comme toute dépendance native critique pour les performances ;
- considérer le gel des fonctionnalités de l'ancien délégué comme un signal pour la feuille de route, et non comme un avis de suppression urgente.

## Limites des preuves disponibles

L'architecture, l'orientation de migration, les affirmations de déploiement et les chiffres de performance sont publiés par Google. Le dépôt permet d'inspecter l'implémentation, mais lors de cette préparation nous n'avons ni reproduit les benchmarks ni vérifié les déploiements des partenaires sur du matériel indépendant.
