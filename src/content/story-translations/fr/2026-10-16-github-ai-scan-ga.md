---
storyId: "2026-10-16-github-ai-scan-ga"
locale: fr
sourceRef: "85c086b4916586dd06145caa9dacf5bf09cc9e33"
sourceSha256: "61f980a21c1c36a4c0a9f5d7424864809f72e90154ddcf9fa4e68f95bf1ee9d7"
status: reviewed
reviewedBy: "Codex (model review)"
reviewedAt: "2026-10-16T06:31:47Z"
title: "AI Scan de GitHub atteint la disponibilité générale comme couche consultative aux côtés de CodeQL"
description: "AI Scan couvre désormais les changements des pull requests dans des langages et frameworks hors du périmètre de CodeQL, mais ses constats ne peuvent pas bloquer les fusions et ses limites de couverture et de coût sont explicites."
imageAlt: "Une plaque d'échantillon en couches révélant une fracture cachée à côté d'un instrument mécanique de précision"
corrections: []
---

AI Scan de GitHub pour les pull requests est désormais disponible en version générale. Il ajoute une passe de sécurité basée sur l'IA pour le code modifié dans des langages et frameworks que CodeQL ne couvre pas encore, notamment PHP, Shell/Bash, la configuration Terraform, les Dockerfiles, JSP pour Java et Blazor pour C#.

Cette nouvelle couche s'exécute lorsque l'analyse de code et le paramètre AI Scan effectif sont activés. Elle ne nécessite pas de configuration de compilation distincte, peut rechercher du contexte dans le dépôt et publie ses constats aux côtés des résultats CodeQL dans la pull request, avec un indicateur IA. La plupart des constats incluent des indications de correction et certains peuvent proposer une suggestion Copilot Autofix.

## La couverture s'étend, pas l'application des règles

AI Scan est volontairement consultatif. Ses constats ne font pas échouer le contrôle d'analyse de code et ne peuvent pas devenir des exigences de fusion au moyen des règles. Le scanner fonctionne uniquement sur les pull requests, pas sur les dépôts complets, et ignore les pull requests issues de forks ainsi que celles créées par Dependabot.

Ces limites doivent déterminer le déploiement. Un contrôle obligatoire vert ne signifie pas qu'AI Scan n'a rien trouvé, et l'activation de la fonction n'étend pas la couverture aux mises à jour de dépendances ou aux contributions externes. Les équipes ont besoin d'une politique distincte qui précise qui examine les constats IA, quelles gravités ou catégories imposent une action et comment consigner les exceptions.

GitHub avertit également que les constats IA peuvent contenir des faux positifs. La documentation cite les catégories de détection actuelles, notamment l'injection, la cryptographie faible, le contrôle d'accès, l'exposition de données, la mauvaise configuration, l'authentification, l'intégrité, la SSRF et les risques liés à la chaîne d'approvisionnement, mais ne publie aucune mesure indépendante de précision ou de rappel.

## Les paramètres et les budgets peuvent modifier silencieusement les résultats

AI Scan s'exécute sur les pull requests admissibles uniquement tant que le paramètre du dépôt et l'analyse de code sont activés et que des crédits IA Code Security sont disponibles. Un budget strict sans crédit restant empêche la production de constats jusqu'à ce que la limite change ou qu'un nouveau cycle de facturation commence.

Pour les organisations, un paramètre hérité peut activer immédiatement l'analyse dans tous les dépôts admissibles. Les administrateurs de dépôt peuvent ensuite la désactiver, mais les pull requests admissibles peuvent consommer des crédits avant cette intervention. Avant une activation large, les équipes de sécurité et de plateforme doivent aligner le paramètre d'organisation, la politique d'entreprise, le budget et le circuit de signalement.

## À retenir pour les ingénieurs

Déployez AI Scan comme un détecteur complémentaire et mesuré :

- échantillonnez ses constats par langage et par catégorie de vulnérabilité ;
- suivez les constats acceptés, rejetés et confirmés ultérieurement ;
- testez le comportement lorsque les budgets sont épuisés ;
- documentez les lacunes concernant les forks et Dependabot ;
- conservez CodeQL et les autres scanners déterministes ;
- évitez de transformer une sortie IA consultative en critère informel de fusion sans preuve issue de vos propres dépôts.

La leçon d'architecture durable est la séparation des rôles : l'analyse déterministe peut rester l'autorité là où elle existe, tandis qu'un scanner probabiliste étend la surface de recherche et rend sa provenance visible.

## Limites des preuves

Le journal des modifications et la documentation de GitHub établissent la disponibilité générale, les exemples pris en charge, les conditions d'exécution, le comportement de facturation, les catégories de constats et les limites. L'affirmation centrale sur l'efficacité reste déclarée par le fournisseur. Aucun benchmark indépendant sur la qualité ou le coût de détection du scanner en version générale n'était disponible pendant cette recherche.
