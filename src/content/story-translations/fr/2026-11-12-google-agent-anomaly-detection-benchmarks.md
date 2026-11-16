---
storyId: 2026-11-12-google-agent-anomaly-detection-benchmarks
locale: fr
sourceSha256: 4804107f8707f2d5d341e22aeddb0d36652cb1dcb2e9737c8c26c995f8c9b841
status: reviewed
reviewedBy: 'ChatGPT (model self-review)'
reviewedAt: '2026-11-16T11:30:00Z'
title: "Le moniteur d’agents de Google détecte la plupart des attaques exécutées, mais manque les mémoires empoisonnées"
description: "Une évaluation de 1 774 sessions fournit des résultats sur benchmarks publics, des taux de fausses alertes et un avertissement sur la sécurité après exécution."
imageAlt: "Un anneau de surveillance sombre intercepte des traces terracotta quittant le parcours d’un agent, tandis qu’une voie mémorielle discrète passe dessous"
corrections: []
---

Les produits de sécurité arrivent souvent avec une démonstration parfaite et sans dénominateur. Google publie enfin quelques dénominateurs pour Agent Anomaly Detection.

Ce système en préversion privée lit de manière asynchrone les traces et journaux des agents pour repérer les sessions durant lesquelles un agent sort de ses limites prévues. Google l’a testé sur 1 774 sessions issues de cinq benchmarks de sécurité publics, développés hors de Google. Parmi les instructions nuisibles réellement exécutées par les agents, le moniteur en a signalé 87 %.

Ce chiffre est utile. Les échecs le sont davantage.

## Ce qui change

Lors de la présentation d’Agent Anomaly Detection en septembre, Google décrivait une surveillance extérieure à l’exécution pour Gemini Enterprise Agent Platform. Le nouveau rapport ajoute une évaluation sur AgentDojo, InjecAgent, Agent Security Bench, AgentDyn et AgentHarm.

Chaque cas a été exécuté par un agent ADK utilisant Gemini 2.5 Flash dans des applications simulées. Le code déterministe du benchmark a examiné l’état final de l’application pour établir si un préjudice avait eu lieu. Le détecteur a observé les mêmes traces et journaux sans contrôler ce verdict.

Google rapporte :

- 87 % des instructions nuisibles effectivement exécutées ont été signalées ;
- les alertes sur les sessions bénignes vont de 2 % à 16 %, selon l’usage des outils ;
- la détection s’améliore après plusieurs centaines de sessions normales servant de référence ;
- seulement 4 des 18 sessions nuisibles déclenchées par une mémoire persistante empoisonnée ont été détectées ;
- environ 6 % des sessions transmises n’ont reçu aucun résultat de détection.

L’évaluation reste celle du fournisseur : Google a choisi la configuration, exécuté le produit et publié les résultats. Néanmoins, les benchmarks publics, la vérification déterministe des conséquences et la divulgation des points faibles fournissent des preuves nettement meilleures qu’une simple annonce.

## Détecter après l’exécution, c’est réagir à un incident

Agent Anomaly Detection ne bloque pas l’appel d’outil nuisible. Il signale ce qui s’est passé après l’action.

C’est potentiellement précieux : une alerte rapide peut limiter les dégâts, préserver les preuves et révéler des attaques passées à travers les filtres préventifs. Ce n’est pas un mécanisme d’autorisation.

Si un agent peut transférer de l’argent, publier des données ou modifier la production, « nous l’avons détecté ensuite » ne suffit pas. Les actions lourdes de conséquences exigent toujours des règles avant exécution, des identifiants à privilèges minimaux et une approbation adaptée au risque.

L’architecture devrait superposer les protections :

- examiner les prompts et sorties d’outils non fiables ;
- valider les appels d’outils envisagés selon la demande et une politique explicite ;
- limiter outils et identifiants à la tâche ;
- demander confirmation pour les actions irréversibles ou externes ;
- conserver des traces complètes pour la surveillance a posteriori ;
- transmettre les alertes graves à un processus de réponse aux incidents.

## La mémoire empoisonnée : le résultat gênant

Le moniteur a eu du mal à identifier des instructions malveillantes déposées dans la mémoire à long terme.

Ce résultat est plausible. Une instruction récupérée depuis la mémoire peut ressembler au contexte normal plutôt qu’à une attaque extérieure. Si l’agent lui obéit systématiquement, son comportement de référence peut finir par normaliser la compromission.

Les équipes devraient traiter la mémoire comme une chaîne d’approvisionnement d’entrées : enregistrer qui a écrit chaque élément, conserver les sources et horodatages, séparer faits et instructions, expirer les entrées anciennes et revoir plus strictement toute mémoire persistante influençant des outils sensibles.

Un détecteur d’anomalies ne peut pas déterminer de manière fiable si l’agent s’écarte de la politique lorsque la mémoire corrompue est devenue la politique qu’il consulte.

## Ce que les équipes devraient tester

Rejouez vos propres traces avant de demander l’accès à la préversion. Les benchmarks publics sont utiles, mais les outils et comportements de production déterminent la charge des fausses alertes.

Testez les actions nuisibles directes, les injections indirectes, les petites actions suspectes, la mémoire empoisonnée, les nouveaux agents disposant de peu d’historique et les usages ordinaires d’outils sensibles. Comptez l’absence de résultat du détecteur comme un échec, pas comme une donnée manquante.

Mesurez le délai de signalement, la charge des analystes, les faux positifs par outil et surtout la part d’actions nuisibles empêchées avant exécution, par opposition à celles simplement signalées ensuite.

## L’avis de Pulse

Google mérite du crédit pour avoir publié ses points faibles. « 87 % détectés » rassure jusqu’à ce qu’on demande si le transfert de données a déjà eu lieu.

La surveillance hors bande est une couche importante. C’est aussi celle qui vous annonce que les autres frontières ont cédé.

Utilisez-la. Mais ne laissez pas un voyant de tableau de bord se faire passer pour une autorisation.
