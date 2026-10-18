---
storyId: "2026-10-17-reflection-beam-open-weights"
locale: fr
sourceRef: "4a6523be785cd53be3332cc734613db39e2eeb50"
sourceSha256: "f5bf64a420bb39c78100de3c103ef83649673596973e863e907818b47394dcea"
status: reviewed
reviewedBy: "Codex (model review)"
reviewedAt: "2026-10-17T06:25:41Z"
title: "Beam passe de la promesse à des poids ouverts de 501 milliards de paramètres téléchargeables"
description: "Reflection a publié les checkpoints BF16, FP8 et NVFP4 de Beam, sa fiche de modèle, son environnement d'agents et ses intégrations de service, transformant une présentation d'octobre en option de déploiement inspectable."
imageAlt: "Un vaste treillis en couches révèle un petit chemin de travail éclairé tandis que toute la structure reste physiquement présente"
corrections: []
---

Reflection AI a publié les checkpoints de Beam ajustés pour suivre des instructions aux formats BF16, FP8 et NVFP4, sous licence Apache 2.0. Cette publication remplit la condition la plus importante associée à l'annonce du modèle le 5 octobre : les ingénieurs peuvent désormais télécharger les poids, examiner la fiche du modèle, exécuter les modes de service publiés et tester le modèle en dehors d'une préversion du fournisseur.

Beam est un modèle textuel sparse de type mixture-of-experts, avec 501,3 milliards de paramètres au total et 23,4 milliards actifs par token. Reflection le positionne pour le code, le raisonnement, les longs contextes et les agents utilisant des outils. La publication comprend une spécification de fenêtre de contexte d'un million de tokens, un environnement dédié en Rust, un modèle de brouillon pour le décodage spéculatif et des intégrations documentées avec Transformers, vLLM et SGLang.

## Les paramètres actifs ne correspondent pas à la taille du déploiement

La valeur `23B active` décrit la quantité d'experts participant au calcul d'un token. Elle ne rend pas le modèle équivalent à un checkpoint de 23 milliards de paramètres. Tous les experts doivent encore être stockés et rester accessibles au routeur.

Le guide d'ingénierie de Hugging Face estime la taille du checkpoint BF16 à environ un téraoctet. Son mode NVFP4 réduit sensiblement les poids stockés, mais vise le matériel Blackwell ; FP8 est l'alternative documentée pour les générations antérieures d'accélérateurs. Le service de longs contextes ajoute un budget distinct pour le cache KV, qui augmente avec la longueur des séquences et la concurrence.

Pour planifier la capacité, distinguez trois valeurs :

- la mémoire totale occupée par les poids résidents ;
- le calcul actif pour chaque token généré ;
- le cache par séquence et la marge nécessaire à l'exécution.

## Les artefacts constituent une preuve plus solide que le titre du benchmark

La fiche du modèle publie des résultats sur des évaluations d'ingénierie logicielle, de terminal, de raisonnement, de recherche et d'utilisation d'outils. Ces tableaux constituent des points de départ utiles, pas une validation indépendante. Reflection a fourni les principaux résultats, et les choix de protocole — environnement d'évaluation, échantillonnage, accès aux outils, version des tâches et effort de raisonnement — peuvent modifier sensiblement les résultats des benchmarks d'agents.

La publication est néanmoins plus inspectable que l'affirmation d'une API fermée. Les équipes peuvent épingler un checkpoint, conserver les traces, exécuter leur propre environnement d'évaluation et comparer les formats numériques. Hugging Face a également publié des expériences limitées sur certaines tâches ainsi que des indications exécutables pour le service et le post-entraînement. Cela améliore la reproductibilité sans transformer le tableau de benchmarks du fournisseur en preuve indépendante.

## À retenir pour les ingénieurs

Commencez par une charge représentative sur un dépôt ou un terminal et par un évaluateur fixe. Épinglez la révision du checkpoint, l'implémentation de service, le modèle de prompt, le réglage de raisonnement et l'environnement d'outils. Ne comparez BF16, FP8 et NVFP4 que là où le chemin matériel est réellement pris en charge, et consignez ensemble la qualité, la latence, le débit, la mémoire et le coût par tâche.

Le changement matériel n'est pas que Beam dispose d'un tableau de benchmarks ambitieux. Il tient au fait que le modèle est désormais un artefact que votre équipe peut inspecter, déployer et réfuter.

## Limites des preuves

La publication de Reflection, le dépôt téléchargeable du modèle, sa fiche, sa licence et le guide d'ingénierie de Hugging Face établissent la disponibilité, l'architecture, les formats et les modes de déploiement documentés. Les affirmations de supériorité en qualité et d'efficacité en tokens restent des déclarations du fournisseur ; aucune reproduction indépendante avec un protocole identique n'était disponible pendant cette recherche.
