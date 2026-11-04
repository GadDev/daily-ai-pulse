---
storyId: 2026-10-29-github-connected-copilot-cloud
locale: fr
sourceRef: 848b2085f11a1c18dbc67cae3ca2ebadc435a12c
sourceSha256: aa5a7c18499d4e61a4853087d690f2d952bb36d21942db94970a93eef8711b2c
status: reviewed
reviewedBy: Codex (model self-review)
reviewedAt: '2026-11-04T07:40:18Z'
title: GitHub rend les sessions Copilot dans le cloud transférables entre ses outils
description: L’expérience Copilot connectée dans le cloud de GitHub permet de reprendre une session d’agent de programmation gérée depuis plusieurs interfaces prises en charge. Les équipes ont désormais besoin d’une politique unique pour l’état de session, l’accès aux dépôts et le calcul.
imageAlt: Un jeton de travail en terre cuite traverse trois espaces de travail en pierre reliés autour d’une chambre isolée en métal sombre
corrections: []
---

GitHub a rendu son expérience Copilot connectée dans le cloud généralement disponible avec les offres payantes. Une session d’agent de programmation peut commencer sur une interface prise en charge et être reprise depuis une autre, tandis que le travail s’exécute dans un bac à sable cloud géré par GitHub.

GitHub cite notamment le web, le mobile, la CLI, l’application Copilot, VS Code, Slack et Teams parmi les interfaces connectées. L’entreprise associe également l’expérience à une allocation partagée, exprimée en dollars, pour le calcul GitHub Actions. Le changement de produit dépasse donc l’ajout d’une interface : l’état de session, l’autorité sur les dépôts et la comptabilisation du calcul traversent désormais des outils que les équipes pouvaient auparavant gouverner séparément.

## La portabilité modifie la frontière de confiance

Une session pouvant être reprise est utile lorsqu’un développeur commence une tâche loin de son éditeur et en examine le résultat plus tard. Elle crée aussi un objet persistant qui a besoin d’un propriétaire, d’un périmètre de dépôt et d’une durée de vie explicite.

Avant d’activer largement l’expérience, les équipes devraient déterminer :

- quels dépôts et quelles organisations une session peut atteindre ;
- quels identifiants, outils MCP ou services externes sont disponibles ;
- où les artefacts et journaux de session sont conservés ;
- comment un développeur peut inspecter, arrêter ou révoquer une session reprise ;
- quel budget finance l’utilisation du modèle et des runners.

GitHub décrit le bac à sable comme isolé et géré. Aucune validation indépendante de la sécurité ou de la facturation n’était disponible dans la fenêtre de recherche de cette édition : ces propriétés doivent donc être considérées comme un comportement documenté du produit, et non comme le résultat d’un audit.

## Une session nécessite une politique unique

Des règles propres à chaque interface peuvent devenir trompeuses si le même travail se poursuit ailleurs. Un démarrage sur mobile, un suivi dans Slack et une revue dans VS Code peuvent tous désigner une même tâche cloud sous-jacente. La politique doit suivre la session, plutôt que dépendre de l’interface depuis laquelle est arrivée la dernière instruction.

Commencez par un dépôt à faible risque et une tâche assortie de contrôles objectifs. Enregistrez la révision initiale, les permissions, la politique réseau et les résultats attendus. Reprenez la session depuis une autre interface, puis confirmez que les mêmes limites et la même piste d’audit restent visibles. Testez la révocation aussi délibérément que la reprise.

Le coût doit lui aussi faire partie du pilote. Le calcul partagé peut simplifier les droits, mais masquer le workflow qui a consommé le budget. Attribuez l’utilisation du modèle et des runners à un dépôt, une équipe et une tâche avant de considérer l’allocation comme une capacité gratuite.

## À retenir

La fonctionnalité utile est la continuité. Sa conséquence d’ingénierie est également la continuité : l’autorité, l’état et le coût ne s’arrêtent plus à la frontière d’un éditeur ou d’une fenêtre de discussion.

Traitez l’expérience connectée comme une surface d’exécution distribuée. Donnez à une session portable une politique portable, un propriétaire visible et une voie de révocation avant que la commodité ne devienne une persistance non suivie.
