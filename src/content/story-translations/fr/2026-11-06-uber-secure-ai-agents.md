---
storyId: 2026-11-06-uber-secure-ai-agents
locale: fr
sourceRef: 47525962ca9b09ca0e4cee47d2e0916261a77f23
sourceSha256: 241ae532cf1c37ecbec751681c38e51878f4330766fb380410b998c68187902e
status: reviewed
reviewedBy: Codex (model self-review)
reviewedAt: '2026-11-07T08:25:01Z'
title: Uber traite le comportement des agents comme une surface de politique de sécurité
description: Uber a publié une architecture de sécurité en production pour les agents d’IA, qui ajoute contrats comportementaux, contrôle sémantique, provenance et assurance continue aux contrôles traditionnels d’identité et d’autorisation.
imageAlt: Un parcours en terre cuite protégé traverse trois postes de contrôle en métal sombre représentant le provisionnement des agents, le contrôle à l’exécution et l’assurance continue
corrections: []
---

L’identité et l’autorisation répondent à une question : un utilisateur ou un service peut-il accéder à une ressource ? Elles ne permettent pas de savoir si l’action proposée par un agent d’IA correspond toujours à la demande de l’utilisateur après plusieurs tours mêlant documents non fiables, résultats d’outils et décisions intermédiaires.

L’équipe de sécurité d’Uber a maintenant publié l’architecture qu’elle utilise pour combler cette lacune. Le système associe validation lors du provisionnement, contrôle comportemental à l’exécution et assurance continue. Son choix central consiste à traiter la personnalité de l’agent, ses intentions autorisées, ses contraintes et ses dépendances comme un contrat comportemental qui l’accompagne en production.

Il s’agit d’un retour d’expérience d’ingénierie de première main, et non d’une étude indépendante d’efficacité. Uber décrit l’architecture, les compromis et les enseignements du déploiement, mais ne publie pas de taux universel de contournement et ne démontre pas que les contrôles sémantiques arrêtent toutes les nouvelles attaques. La valeur réside dans le modèle d’exploitation : la sécurité devient un cycle de vie doté de points de contrôle inspectables, et non une consigne demandant au modèle de bien se comporter.

## L’autorisation est nécessaire, mais incomplète

Un moteur de politique classique peut vérifier qu’un utilisateur est autorisé à appeler une API et que l’agent possède des identifiants valides. Chaque requête peut être autorisée individuellement alors que la séquence globale reste incorrecte. Une injection indirecte de prompt peut orienter un agent légitime vers une action que l’utilisateur n’a jamais voulue.

Uber ajoute une autre décision : cette action doit-elle avoir lieu compte tenu de la fonction de l’agent, de la demande de l’utilisateur, de la session en cours et de tout ce que l’agent a déjà fait ?

Cette distinction importe parce que les agents ne se limitent pas à exécuter des branches prédéfinies. Ils interprètent du contenu, choisissent des outils et construisent des plans à partir d’éléments potentiellement hostiles. Un contrôle d’autorisation protège la frontière d’une ressource. Un contrôle comportemental tente de protéger le sens de la tâche.

La conception d’Uber ne remplace pas le contrôle d’accès. Elle superpose un contrôle sémantique à l’identité, à l’autorisation et à la sécurité applicative traditionnelle. C’est la bonne direction : un classifieur fondé sur un modèle ne doit pas devenir l’unique rempart entre une instruction manipulée et un outil privilégié.

## Trois couches portent la politique

Lors du provisionnement, un registre d’IA consigne le propriétaire, la personnalité, les intentions autorisées, les contraintes, les dépendances et le niveau de risque. Le système Argus d’Uber analyse le code source, les prompts, les configurations, les points de terminaison et les chemins d’outils afin de déduire des intentions structurées et de comparer le comportement déclaré aux capacités réelles.

La même inspection s’étend aux outils tiers et aux serveurs MCP. Analyses statique et dynamique, contrôles de dépendances, signaux de réputation et inspection sémantique des descriptions d’outils servent à rechercher vulnérabilités, empoisonnement d’outils et injections indirectes de prompt. Le principe important dépasse les composants d’Uber : la chaîne d’approvisionnement de l’agent fait partie de son autorité.

À l’exécution, le registre joue le rôle de point d’administration de la politique. AI Guard évalue les interactions et les actions proposées au regard du contrat, puis des points d’ancrage d’exécution appliquent la décision avant que l’action ne parte. Cette séparation entre administration, décision et contrôle rappelle celle des systèmes d’autorisation, mais la politique inclut ici la finalité et le contexte, pas seulement les rôles et les ressources.

L’assurance continue referme la boucle. Uber décrit le rejeu, le red teaming, la télémétrie et les tests de régression qui réinjectent le comportement observé en production dans le calibrage. C’est essentiel, car une politique comportementale est probabiliste. Elle a besoin de preuves sur les autorisations erronées comme sur les blocages indus.

## La provenance des prompts rend les longues tâches inspectables

L’une des idées les plus utiles du rapport concerne la provenance des prompts et l’enchaînement des éléments de preuve. Une action privilégiée doit pouvoir être reliée à une demande réelle de l’utilisateur, et pas seulement à la sortie immédiatement précédente du modèle.

Les agents de longue durée compliquent cette exigence. Une instruction peut être résumée, transformée et mélangée à des résultats d’outils de nombreuses fois avant qu’une action se produise. Si le système ne conserve que le dernier appel d’outil, un réviseur ne peut pas reconstituer si l’autorité s’est transmise légitimement tout au long de la chaîne.

Pour une conception interne, associez à chaque action proposée sa provenance : demande d’origine de l’utilisateur, enregistrements récupérés pertinents, version de la politique, décision intermédiaire, arguments d’outil et verdict de contrôle. Gardez la chaîne assez compacte pour être examinée et assez structurée pour être interrogée. La journalisation brute des prompts n’est pas une solution : elle peut divulguer du contenu sensible tout en restant incapable d’indiquer quelles preuves autorisaient l’action.

## Les compromis constituent le véritable enseignement de production

Uber relève quatre tensions auxquelles tout système comparable doit s’attendre.

Premièrement, un contrôle plus strict peut bloquer du travail légitime. L’équipe a utilisé le mode fantôme, le rejeu du trafic et un calibrage par agent, au lieu d’appliquer le même seuil partout. Deuxièmement, l’évaluation sémantique ajoute latence et coût d’inférence. La conception parallélise les contrôles et emploie, lorsque c’est possible, des modèles spécialisés plus petits. Troisièmement, les frictions d’intégration peuvent pousser les développeurs à contourner les contrôles. Argus pré-génère les personnalités et les intentions afin que les équipes affinent un point de départ plutôt que d’écrire chaque politique de zéro. Quatrièmement, les garde-fous génériques sont trop grossiers pour des agents aux fonctions et profils de risque différents.

Aucune de ces tensions ne disparaît avec un meilleur classifieur. Ce sont des propriétés du système qui exigent des budgets, des responsables et des chemins de retour en arrière.

## Comment appliquer ce modèle

Commencez par un agent et rédigez son contrat avant d’ajouter des outils. Nommez le propriétaire, la finalité, les intentions autorisées, les résultats interdits, les classes de données, l’inventaire des outils et le niveau de risque. Maintenez les identifiants et permissions d’outils plus étroits que la politique sémantique, afin qu’une erreur comportementale ne se transforme pas automatiquement en action catastrophique.

Placez ensuite le contrôle à des frontières explicites :

- valider et autoriser les arguments d’outil avant l’envoi ;
- refuser les outils et champs inconnus ;
- associer une provenance à chaque proposition privilégiée ;
- exécuter les outils à haut risque dans des environnements contraints ;
- journaliser la version de la politique et le verdict sans copier de secrets inutiles ;
- rejouer des sessions représentatives en mode fantôme avant d’activer le contrôle ;
- mesurer séparément les blocages indus, les autorisations erronées, la latence et le coût ;
- exiger une approbation humaine pour les actions dont les conséquences ne peuvent pas être annulées sans risque.

Testez la politique comportementale avec des séquences adversariales, pas avec des prompts isolés. Un document peut sembler inoffensif jusqu’à ce que son instruction soit combinée à un résultat d’outil ultérieur. Une politique efficace au premier tour peut échouer après une synthèse ou une délégation.

## À retenir

L’aspect le plus fort de la conception d’Uber n’est pas un nouveau garde-fou. C’est la décision de faire de la finalité de l’agent un contrat applicable et observable tout au long de son cycle de vie.

Ce contrat restera imparfait. Les contrôles sémantiques peuvent être trompés et une architecture de première main ne prouve pas une efficacité générale. Elle fournit toutefois aux équipes d’ingénierie des emplacements où inscrire l’autorité, les preuves, le calibrage et la revue. À mesure que les agents fonctionnent plus longtemps, la question n’est plus seulement « Cette identité peut-elle appeler l’outil ? », mais aussi « Pouvons-nous montrer pourquoi cette action précise appartient toujours à la tâche ? »
