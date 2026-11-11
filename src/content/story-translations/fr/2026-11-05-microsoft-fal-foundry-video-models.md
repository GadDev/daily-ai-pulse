---
storyId: 2026-11-05-microsoft-fal-foundry-video-models
locale: fr
sourceRef: cd1a6a43f604b312c1301ed438da6d06960603ac
sourceSha256: 70d56259220d2531074f29b57458e434975a0cd1959f87d160bfe680c8906ff8
status: reviewed
reviewedBy: Codex (model self-review)
reviewedAt: '2026-11-08T08:59:25Z'
title: Microsoft Foundry ajoute en préversion publique cinq modèles vidéo servis par fal
description: Les modèles vidéo Kling, LTX et MiniMax arrivent dans Microsoft Foundry avec des options de génération de texte vers vidéo et d’image vers vidéo, des tarifs publiés et des contraintes d’hébergement propres à chaque modèle.
imageAlt: Cinq images de film éclairées traversent un routeur de modèles en terre cuite pour rejoindre une même console sombre de production vidéo d’entreprise
corrections: []
---

Microsoft et fal déploient cinq modèles de génération vidéo dans Microsoft Foundry en préversion publique : Kling v3 Pro, LTX-2.5 Fast, LTX-2.5 Pro, MiniMax H3 Max et MiniMax H3 Max Turbo.

Les modèles prennent en charge différentes combinaisons de génération de texte vers vidéo et d’image vers vidéo. Microsoft les présente comme un portefeuille plutôt que comme un choix unique par défaut, avec différents compromis en matière de vitesse, de qualité, d’audio, de résolution et de prix.

Il s’agit d’une annonce de première main. La disponibilité, les noms des modèles, l’hébergement et les prix affichés sont documentés ; la qualité des sorties et les performances n’ont pas été comparées de manière indépendante dans cette édition.

## Un catalogue, plusieurs compromis

Kling v3 Pro prend en charge l’audio natif et les éléments personnalisés. Microsoft affirme que Foundry est le premier fournisseur à proposer un point de terminaison Kling 3 hébergé aux États-Unis.

LTX-2.5 Fast vise les brouillons et aperçus rapides, tandis que LTX-2.5 Pro cible des sorties de meilleure fidélité. Les deux prennent en charge l’audio synchronisé. MiniMax H3 Max et Turbo sont des variantes post-entraînées par fal, axées sur le respect du prompt, l’esthétique et les performances d’inférence.

Le changement utile est opérationnel. Une équipe peut évaluer plusieurs familles de modèles vidéo via la plateforme Foundry au sens large, au lieu de construire pour chacune une intégration, un processus de gouvernance et une relation de facturation distincts.

Cela ne rend pas les modèles interchangeables. Les entrées, la préservation des références, le comportement audio, l’hébergement régional et les conditions de traitement des données varient encore.

## Les tarifs rendent le choix de production visible

Microsoft publie des prix à la seconde qui varient selon le modèle et la résolution. MiniMax H3 Max Turbo commence à 0,025 $ par seconde en 480p et atteint 0,08 $ en 1080p. LTX-2.5 Fast va de 0,09 $ en 720p à 0,30 $ en 4K. Kling v3 Pro est affiché à 0,1232 $ par seconde sans audio, 0,1848 $ avec audio et 0,2156 $ avec audio et contrôle vocal.

Ces chiffres rendent plausible l’utilisation d’un routeur de modèles, mais le prix affiché n’est qu’un composant. Les générations échouées, les nouvelles tentatives, la modération, le stockage, le temps de revue et la postproduction peuvent dominer le coût d’un clip utilisable.

## Évaluez le flux de travail, pas la démonstration

Utilisez une suite fixe de prompts et d’images de référence sur les différents modèles. Mesurez :

- le respect du prompt et des instructions de caméra ;
- la cohérence de l’identité et du produit d’une image à l’autre ;
- la synchronisation audio et les paroles indésirables ;
- le délai jusqu’au premier brouillon utilisable ;
- le taux de nouvelles tentatives et le temps de correction humaine ;
- le coût total par seconde acceptée ;
- le comportement dans les régions et résolutions requises.

Tenez compte du statut de préversion dans le plan de déploiement. Épinglez les identifiants des modèles et enregistrez l’offre exacte utilisée pour chaque ressource, car une entrée du catalogue peut changer indépendamment de l’application qui l’appelle.

Examinez les conditions de traitement et de stockage des données de chaque modèle. Un point de terminaison hébergé aux États-Unis peut aider à planifier la résidence des données, mais l’emplacement seul ne répond pas aux questions de rétention, d’utilisation pour l’entraînement ou de contrôle d’accès.

## À retenir

Cette publication transforme la génération vidéo d’entreprise en un problème de sélection dans un portefeuille. C’est plus sain que de considérer qu’un seul modèle est universellement le meilleur.

Foundry peut simplifier l’accès et la gouvernance, mais les équipes ont toujours besoin de leur propre jeu de critères d’acceptation. Le modèle gagnant est celui qui produit des séquences approuvées au coût total de flux de travail le plus bas, dans le respect des contraintes de données et de région requises — pas celui dont la vidéo de lancement est la plus impressionnante.
