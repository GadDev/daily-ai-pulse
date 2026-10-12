---
# Traduction de l'anglais — brouillon en attente de relecture humaine.
storyId: "2026-10-04-claude-code-2-1-289-policy-precedence"
locale: fr
sourceRef: "7669c0c31be06bece4669f34018f0931b0cbf14e"
sourceSha256: "887c8f274590e116e7039213ce858987438b2e3deea3da30b3e20e7855793676"
status: draft
title: "Claude Code 2.1.289 corrige d’autres failles dans les règles de refus et la gestion des liens symboliques"
description: "La version publiée le 4 octobre, heure de Luxembourg, corrige l’ordre de priorité des règles, les contrôles de lecture via des liens symboliques et le traitement des préfixes des commandes shell, en complément du renforcement du 3 octobre."
imageAlt: "Une barrière mécanique couleur terre cuite fermement installée à la jonction de plusieurs passages gris anthracite"
corrections: []
---

*Édition de rattrapage préparée le 6 octobre, à partir d’éléments datés au plus tard du 4 octobre 2026 à 23:59, heure de Luxembourg. Les pages sources ont été consultées a posteriori ; aucun instantané des sources pris à la fin de la journée du 4 octobre n’est disponible.*

[Claude Code 2.1.289](https://github.com/anthropics/claude-code/releases/tag/v2.1.289) a été publié le **3 octobre à 23:07:17 UTC**, soit le **4 octobre à 01:07:17 au Luxembourg**. Cette publication entre donc dans la journée locale couverte par cette édition.

Les notes d’Anthropic décrivent trois correctifs supplémentaires concernant les autorisations. Les règles `deny`/`ask` imbriquées d’une configuration administrée s’appliquent désormais même lorsqu’un mod installé par l’utilisateur autorise une commande shell composée. Les règles `deny` de `Read` s’appliquent aux chemins sélectionnés dans l’IDE ou mentionnés, lorsqu’ils sont accessibles via des liens symboliques. Enfin, les règles Bash `deny`/`ask` couvrent les commandes précédées de préfixes d’environnement après expansion ou de simples affectations de variables, en mode d’autorisation automatique de l’environnement isolé (sandbox).

Ces correctifs sont distincts de ceux de la [mise à jour du 3 octobre](/stories/2026-10-03-claude-code-2-1-288-permission-hardening/), qui portait sur l’autorisation des wrappers shell et la gestion des erreurs de hooks. La différence porte cette fois sur l’ordre de priorité des règles et sur les différentes manières de représenter une ressource ou une commande.

Pour les déploiements administrés, appliquez la mise à jour et testez ces cas précis avec des règles locales représentatives. Consignez à la fois l’action tentée et la décision d’autorisation ; le succès d’une commande courante ne démontre pas qu’une règle `deny` reste appliquée après une réécriture.

Ces correctifs sont annoncés par les responsables du projet. Nous n’avons pas reproduit d’exploitation de ces failles ni établi de manière indépendante que les règles d’autorisation sont appliquées dans tous les cas. Les versions ultérieures et les constats les concernant sont exclus de cette édition historique.
