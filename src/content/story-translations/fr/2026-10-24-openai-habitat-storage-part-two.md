---
storyId: 2026-10-24-openai-habitat-storage-part-two
locale: fr
sourceRef: f0bcffa68ecad4d5c39f861704ad50c2490ff9db
sourceSha256: 0984f8a7610a90ae97e068f4be629d7b6b0429c1d7814c11fc62964491b6c271
status: reviewed
reviewedBy: Codex (model self-review)
reviewedAt: '2026-10-24T06:08:02.306Z'
title: OpenAI explique comment Habitat est revenu à une architecture mutualisée à l’échelle mondiale
description: L’équipe de stockage d’Habitat est passée de conteneurs Azure Cosmos DB partagés à des environnements isolés, puis de nouveau à une architecture mutualisée, en ajoutant au passage des mécanismes de déplacement, de limitation et de priorité des charges.
imageAlt: Un ensemble de blocs de stockage partitionnés reliés par des ponts mobiles et des voies prioritaires
corrections: []
---

La plateforme Habitat d’OpenAI fournit à ChatGPT, à l’API, à Codex et aux services internes une interface étroite vers plusieurs systèmes de stockage. Dans le second volet de sa série d’ingénierie, l’équipe explique comment sa couche Azure Cosmos DB est passée d’un conteneur partagé à des conteneurs dédiés, avant de revenir à une architecture mutualisée par défaut.

Le résultat intéressant n’est pas qu’un modèle d’isolement ou de mutualisation l’emporte partout. Ce sont les modes de défaillance qui ont imposé chaque transition.

## Quand les limites logiques rencontrent les partitions physiques

Habitat exposait initialement aux clients le choix de la clé de partition logique. Différents produits pouvaient sélectionner des clés courantes, comme l’identifiant d’un utilisateur ou d’un espace de travail, si bien que des charges sans rapport entraient en collision sous les mêmes limites logiques. Le problème plus profond venait du fait qu’Azure Cosmos DB applique les limites de ressources au niveau des partitions physiques, où plusieurs clés logiques peuvent coexister.

Cela créait des voisins bruyants : une charge de niche pouvait entrer en concurrence avec le trafic de connexion ou d’inscription parce que leurs partitions logiques se trouvaient sur la même partition physique. La croissance du stockage scindait également les partitions physiques sans augmenter automatiquement le débit total provisionné, ce qui réduisait la capacité disponible pour chaque partition même lorsque la demande restait stable.

Ces détails comptent, car des tableaux de bord organisés autour des locataires logiques peuvent masquer la frontière de ressources qui limite réellement le trafic.

## L’isolation a réduit les incidents et créé une dette de planification

Les conteneurs dédiés ont fourni aux services critiques des partitions séparées et un périmètre d’impact plus clair. Habitat a également utilisé des scripts pour ajuster le débit provisionné à mesure que le nombre de partitions évoluait.

Mais l’isolation a transféré la planification de capacité à chaque équipe produit. Une charge qui semblait faible pendant les tests internes pouvait croître de plusieurs ordres de grandeur au lancement, et certaines équipes mettaient en production sans pré-dimensionner leur conteneur. OpenAI indique que la mise à l’échelle le jour du lancement est devenue une tâche opérationnelle récurrente.

La capacité partagée avait masqué cette volatilité en mutualisant la marge disponible. La plateforme avait échangé un risque de contention contre un risque de coordination organisationnelle.

## Une architecture mutualisée avec des voies de sortie

Habitat est revenu vers des conteneurs partagés après avoir ajouté des contrôles absents de la première conception. La limitation des clés les plus sollicitées empêche celles-ci de monopoliser une partition physique. La qualité de service par niveau de requête limite les travaux en arrière-plan avant le trafic interactif. La plateforme traite aussi le déplacement des données comme un mécanisme normal plutôt que comme un sauvetage ponctuel.

OpenAI et Azure surveillent désormais ensemble la pile et testent les changements sur un compte hors production de taille comparable à la production. Le rapport décrit également une flotte de capture des changements de données répartie sur plusieurs régions, avec isolation des pannes entre flux, files de lettres mortes, lecteurs dans des régions alternatives et regroupement plus efficace des points de reprise.

Le modèle architectural est celui de la co-exploitation : à très grande échelle, une base de données gérée exige encore un savoir opérationnel partagé entre le client et le fournisseur.

## Limites des éléments disponibles

L’échelle, l’historique des incidents et l’efficacité des mesures d’atténuation proviennent du compte rendu de première main d’OpenAI. Pulse n’a mesuré indépendamment ni Habitat ni Azure Cosmos DB. La valeur du rapport réside dans la séquence concrète de compromis qu’il décrit, et non dans la preuve que la même conception convient à toutes les charges.

## À retenir pour les ingénieurs

Observez la frontière de ressources physiques sous votre abstraction de mutualisation. Rendez explicites la priorité des charges et le déplacement des locataires, répétez les changements du fournisseur à une échelle réaliste, et attribuez la responsabilité de la planification de capacité avec autant de soin que celle du stockage.
