---
storyId: 2026-10-03-claude-code-2-1-288-permission-hardening
locale: fr
sourceRef: 54e6d9aa63d0a6ff5796b9fff29f059db27998ee
sourceSha256: a628172ecddecc20930528018f4eb57eb052300ba09975f787f65c97815cb2bb
status: draft
title: "Claude Code 2.1.288 corrige les failles d’autorisation de type fail open liées aux suppressions via le shell et aux hooks"
description: "Anthropic a renforcé les contrôles d’autorisation de Claude Code : une suppression dangereuse exécutée via bash ou sh demande désormais une approbation, tandis que les échecs des hooks d’autorisation bloquent les appels d’outil au lieu d’ignorer silencieusement l’application des règles d’autorisation."
imageAlt: "Une barrière mécanique abstraite imposant une limite d’exécution renforcée autour du trajet contraint d’un câble"
corrections: []
---

Claude Code 2.1.288 renforce deux chemins de vérification des autorisations sur lesquels une défaillance de l’application des règles pouvait auparavant laisser l’exécution se poursuivre.

Selon Anthropic, cette version demande désormais une approbation avant l’exécution d’une commande `rm` dangereuse intégrée à `bash -c` ou `sh -c`, lorsque le mode `bypassPermissions` ou une règle d’autorisation du shell applicable l’aurait autrement laissée s’exécuter sans demande d’approbation.

Cette version modifie également la manière dont Claude Code traite les échecs des hooks `PreToolUse` et `PermissionRequest`. Si la recherche des hooks correspondant à l’appel échoue ou si les données d’entrée de l’outil ne peuvent pas être sérialisées pour le hook, l’appel d’outil est désormais bloqué au lieu de se poursuivre après que le hook a été ignoré.

## Ce qui a changé

Le correctif concernant le shell est important, car les systèmes d’autorisation ne peuvent pas examiner uniquement la commande externe.

Une invocation du shell telle que `bash -c`, autorisée par une règle, peut tout de même contenir une opération destructive dans la chaîne de commande. Claude Code 2.1.288 applique les règles d’autorisation à ce cas de suppression exécutée via le shell, au lieu de considérer que l’autorisation du shell qui l’encapsule suffit.

La modification des hooks répond à un autre mode de défaillance. Les hooks d’autorisation se trouvent sur le chemin d’exécution où les équipes peuvent appliquer des règles ou une logique d’approbation supplémentaires. Si l’infrastructure des hooks elle-même ne parvient pas à trouver une correspondance pour une invocation ou à la traiter, poursuivre l’exécution peut transformer une erreur d’application des règles d’autorisation en autorisation implicite.

Le nouveau comportement rend ces échecs bloquants.

## Pourquoi c’est important

La sécurité des agents de programmation dépend de ce qui se passe à la limite d’exécution, et pas seulement de ce que le modèle avait l’intention de faire.

Les commandes encapsulées dans un shell, les règles d’autorisation personnalisées, les modes de contournement et les hooks d’autorisation sont autant de points où une configuration apparemment restrictive peut se comporter différemment à l’exécution. Un contrôle de sécurité est considérablement affaibli si des données d’entrée mal formées ou une erreur interne d’application des règles d’autorisation permettent à l’opération protégée de se poursuivre.

Le principe d’ingénierie plus général est de **bloquer l’exécution lorsque l’autorisation ne peut pas être évaluée de manière fiable**.

Cela ne signifie pas que la sécurité du système d’autorisation de Claude Code est désormais démontrée dans son ensemble. Il s’agit de correctifs ciblés pour des lacunes documentées dans l’application des règles d’autorisation sur des chemins d’exécution précis.

## À retenir pour les ingénieurs

Les équipes qui utilisent Claude Code avec `bypassPermissions`, des règles permissives pour le shell ou des hooks d’autorisation personnalisés devraient mettre à jour leur installation et tester le chemin réel d’application des règles d’autorisation, au lieu de se fier uniquement à la configuration de ces règles.

Parmi les cas utiles à tester pour détecter des régressions :

- des commandes destructives imbriquées dans `bash -c` ou `sh -c`
- des commandes du shell correspondant à des règles d’autorisation existantes
- des hooks d’autorisation recevant des données d’entrée d’outil inattendues ou impossibles à sérialiser
- des échecs lors de la recherche des hooks `PreToolUse` ou `PermissionRequest` applicables
- une exécution sans supervision où l’échec d’un contrôle ne doit jamais devenir une approbation implicite

Considérez `bypassPermissions` comme un mode destiné à fonctionner dans un environnement isolé plutôt que comme une politique normale pour un poste de travail. Si un agent est délibérément autorisé à fonctionner avec moins d’approbations interactives, l’environnement qui l’entoure devrait assurer son confinement.

## Limites des éléments de preuve

Les notes de version de Claude Code 2.1.288 publiées par Anthropic constituent la source primaire attestant le changement de comportement.

Des articles indépendants corroborent le problème de la commande `rm` encapsulée et les configurations d’autorisation concernées. Pour cet article, Daily AI Pulse n’a pas reproduit indépendamment la défaillance initiale ni exécuté un exploit de régression sur la version corrigée.

L’affirmation se limite donc ici au renforcement des autorisations documenté pour la version 2.1.288, sans constituer une évaluation plus large du modèle de sécurité global de Claude Code.
