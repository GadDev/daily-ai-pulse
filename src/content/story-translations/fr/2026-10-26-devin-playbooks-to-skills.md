---
storyId: 2026-10-26-devin-playbooks-to-skills
locale: fr
sourceRef: b3965dbeecdb01c933771f62ec1fe474b028e7a2
sourceSha256: a5c1b4b104c66c6b28e0c72f930de82f4c4c9512c4adde8e8c7d2daaa1d42ac2
status: reviewed
reviewedBy: Codex (model self-review)
reviewedAt: '2026-10-26T07:21:33Z'
title: Devin remplace les Playbooks par des Skills
description: Devin migre les procédures réutilisables de ses agents vers les Skills, tout en conservant les instructions des Playbooks et en documentant la compatibilité des API, mentions et macros.
imageAlt: Une pile de fiches d’instructions traverse un cadre en laiton et ressort sous forme de modules organisés
corrections: []
---

Devin remplace les Playbooks par des Skills comme format d’instructions réutilisables. Les nouveaux comptes créés à partir du 24 octobre disposent d’emblée des Skills, sans Playbooks, tandis que les comptes existants sont migrés l’un après l’autre.

Pour les équipes qui ont déjà encodé des procédures reproductibles dans Devin, il s’agit moins d’une réécriture que d’un changement de l’objet durable à maintenir. La migration vise à conserver les instructions et à préserver le fonctionnement des modes d’invocation établis, mais ces promesses de compatibilité doivent tout de même être testées avec les automatisations propres à chaque équipe.

## Ce qui change pendant la migration

Selon Devin, un Playbook existant devient un Skill avec les mêmes instructions. Après la migration d’un compte, les pages Playbooks passent en lecture seule et renvoient vers les Skills correspondants.

L’objet sur lequel opère l’API Playbooks change lui aussi : les requêtes envoyées par cette API lisent et écrivent des Skills. Devin indique que les automatisations existantes, les mentions `@playbook` et les macros `!playbook` continuent de fonctionner.

Cette couche de compatibilité est importante, car les équipes peuvent avoir intégré des identifiants de Playbooks dans des scripts, des supports d’intégration et des prompts d’agents. Elle crée aussi un décalage temporaire de vocabulaire : une intégration peut continuer à utiliser une interface conçue pour les Playbooks alors que l’objet réutilisable sous-jacent est désormais un Skill.

## Pourquoi les Skills deviennent la source de référence

Les Skills sont des workflows réutilisables exprimés au moyen d’instructions `SKILL.md`. Ils peuvent regrouper les consignes procédurales d’une tâche, et le modèle de plugins de Devin permet de distribuer des Skills avec d’autres extensions.

Le changement pratique concerne la responsabilité de maintenance. Les équipes devraient cesser de créer de nouvelles procédures réutilisables sous forme de Playbooks et les maintenir plutôt comme des Skills. Les Playbooks existants peuvent rester visibles à titre de référence après la migration, mais des pages en lecture seule ne sont pas l’endroit approprié pour les modifications futures.

Un fichier d’instructions rattaché à un dépôt facilite également la revue. Les modifications peuvent être comparées, testées sur des tâches représentatives et versionnées avec le code ou le processus opérationnel qu’elles prennent en charge.

## Liste de contrôle pour la migration

Avant la migration d’un compte, établissez un inventaire des interfaces qui dépendent des Playbooks :

- les Playbooks qui décrivent des procédures de production ou de mise en production ;
- les scripts qui appellent l’API Playbooks ;
- les prompts ou runbooks qui utilisent des mentions `@playbook` ;
- les raccourcis qui invoquent des macros `!playbook` ;
- la documentation qui indique où modifier les instructions réutilisables.

Après la migration, vérifiez que chaque élément renvoie vers le Skill attendu et qu’une modification effectuée par l’API documentée change bien l’objet prévu. Exécutez au moins une tâche représentative pour chaque procédure à fort impact, au lieu de considérer qu’une conversion réussie garantit un comportement équivalent.

Pour les nouvelles procédures, créez directement un Skill et explicitez ses prérequis, ses entrées, ses conditions d’arrêt et ses résultats attendus. Si la procédure appartient à un ensemble d’outils plus large, évaluez si un plugin constitue une unité de distribution plus claire.

## Limites des éléments disponibles

La date de déploiement, le comportement de conversion et les affirmations de rétrocompatibilité proviennent de la propre documentation de Devin. Pulse n’a trouvé aucun audit indépendant de la migration et n’a pas reproduit tous les parcours d’API, de mentions et de macros pendant la fenêtre de recherche définie.

Considérez le comportement documenté comme le contrat de migration, et non comme la preuve que chaque intégration propre à un compte fonctionnera sans modification. Le déploiement compte par compte signifie également que deux équipes peuvent temporairement voir des interfaces différentes.

## À retenir pour les ingénieurs

Faites dès maintenant des Skills la source de référence maintenue. Inventoriez chaque dépendance aux Playbooks, conservez une correspondance entre les anciens noms et les nouveaux Skills, puis exécutez des tests de compatibilité après la migration de chaque compte. Ne conservez les anciennes API et les anciennes macros que lorsqu’elles réduisent le risque lié à la transition ; mettez à jour la documentation destinée aux utilisateurs afin qu’elle enseigne le nouveau modèle d’objet.
