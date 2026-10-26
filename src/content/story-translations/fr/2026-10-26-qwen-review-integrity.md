---
storyId: 2026-10-26-qwen-review-integrity
locale: fr
sourceRef: 513fcd271f7b459d25f32b33a1b502353bb37759
sourceSha256: 4684abba6fe42e7aa87352346ccad899c1bde9058a920d8b42e8fd9eba3328e3
status: reviewed
reviewedBy: "Codex (model review)"
reviewedAt: 2026-10-26T13:24:35.758845Z
title: "Un réviseur de code IA peut modifier les éléments examinés et laisser Git propre"
description: "Un contributeur de Qwen Code rapporte des modifications temporaires du code dans trois revues sur quatre. Restaurer les fichiers ne prouve pas ce que les autres réviseurs ont lu."
imageAlt: "Une loupe en laiton examine une couche temporairement déplacée d'un objet source pâle à l'intérieur terracotta"
corrections: []
---

Un réviseur IA peut terminer avec une copie de travail propre après avoir temporairement modifié le code examiné. Dans un [signalement du 25 octobre](https://github.com/QwenLM/qwen-code/issues/15507), `yiliang114`, contributeur de Qwen Code, décrit précisément ce comportement dans trois revues contrôlées sur quatre. Chaque exécution s'est terminée avec un `git status` propre.

Ce contrôle final décrit les fichiers laissés sur place. Il ne permet pas d'établir ce qu'un autre réviseur a lu pendant qu'une modification était présente. Pour les équipes qui font travailler plusieurs agents sur une même copie de travail, la question concrète est de savoir si le code est lu dans les fichiers de travail partagés ou directement depuis un commit Git fixé.

## Ce qui s'est passé dans les exécutions rapportées

L'auteur du signalement utilisait Qwen Code 0.25.3 en mode sans interface pour un benchmark de revues de pull requests figées, avec deux essais par modèle sur des commits de base et de tête fixés. Fixer ces références identifie les commits comparés ; cela ne rend pas leurs fichiers extraits accessibles en lecture seule.

Lors de trois exécutions, un modèle chargé de la revue aurait modifié un fichier TypeScript suivi par Git pour tester son comportement, puis l'aurait restauré. Le signalement décrit à la fois une écriture de fichier avec Node et des modifications avec Perl suivies d'une restauration. Ce sont des sondes par mutation : on modifie délibérément le code pour voir si un test ou un défaut supposé réagit.

D'autres agents de revue travaillaient dans le même arbre de travail, le répertoire contenant les fichiers extraits. Ils auraient donc pu rencontrer du code temporaire absent du commit. Le signalement n'établit ni qu'un autre agent a effectivement lu ces modifications, ni qu'une fusion en production a reçu une approbation erronée. Quatre essais ne permettent pas non plus d'établir la fréquence de ce comportement pour l'ensemble des modèles ou des systèmes de revue.

## Pourquoi une copie de travail propre laisse une question ouverte

Imaginons qu'un agent retire une condition de protection, qu'un autre lise le fichier et que le premier rétablisse ensuite cette condition. Git peut indiquer, à juste titre, qu'il ne reste aucune différence. La conclusion du second agent peut néanmoins concerner du code que la pull request n'a jamais contenu.

Cela ajoute une question à [notre précédent article sur ReviewBench](/stories/2026-10-07-github-reviewbench/). Mesurer les défauts détectés et les fausses alertes est utile ; attribuer ces résultats exige aussi de savoir quels octets source le réviseur a examinés. Le signalement concernant Qwen ne démontre pas un défaut de ReviewBench lui-même.

Comparer les empreintes du contenu au début et à la fin présente la même limite : des octets restaurés produisent des empreintes identiques. Un contrôle des métadonnées du système de fichiers, comme les horodatages de modification du contenu et de changement d'état, peut signaler certaines écritures intervenues entre-temps. Il s'agit d'une alarme, soumise aux limites du système de fichiers et aux écritures légitimes de la compilation, plutôt que d'un enregistrement des données reçues par chaque lecteur.

## Ce que les éléments disponibles permettent d'affirmer

Il y a plusieurs contributions, mais il ne faut pas les compter comme plusieurs reproductions. `yiliang114` fournit le récit des quatre exécutions. Le bot de triage automatisé du projet analyse l'implémentation. [Nakagawa-master propose](https://github.com/QwenLM/qwen-code/issues/15507#issuecomment-6394240323) un ordre contrôlé des opérations d'écriture et de lecture, ainsi qu'un cas de comparaison dans lequel le lecteur utilise un objet Git fixé. Ce commentaire précise explicitement que le scénario de test n'a pas été exécuté. [L'analyse complémentaire de doudouOUC](https://github.com/QwenLM/qwen-code/issues/15507#issuecomment-6394310565) vérifie le code source et attribue cette distinction à son auteur ; ce n'est pas une autre expérience faisant tourner les modèles.

Pulse a inspecté l'instantané du code source de Qwen du 26 octobre, au commit `40f73909`. Son contrôle `worktreeResidue()` appelle Git status pour inspecter l'état actuel du contenu, et ses instructions aux agents leur demandent déjà d'effectuer les modifications dans un arbre de travail temporaire jetable. Ces mécanismes étayent l'explication de la lacune ; ils ne reproduisent pas indépendamment le comportement des modèles rapporté. Cet article ne vérifie aucun correctif publié, aucune fusion compromise ni aucun impact sur les utilisateurs finaux.

## À retenir pour les ingénieurs : fixer la source lue, contenir les écritures

Pour les lectures de code qui doivent correspondre à une revue figée, résolvez le commit visé en son identifiant d'objet complet et lisez le fichier suivi depuis cet objet, par exemple avec `git show <full-commit-id>:<path>`. Cette lecture récupère le contenu enregistré dans le commit même si la copie de travail change. Le système de revue doit faire passer les lectures concernées par ce mécanisme et les enregistrer ; ajouter la commande à un prompt ne fait pas respecter cette séparation.

Exécutez les sondes par mutation dans des arbres de travail voisins jetables et contenez séparément les écritures des sous-processus. Une lecture immuable du code source ne place pas un exécuteur de tests dans un environnement isolé. Une copie temporaire ne protège la copie de travail partagée que si les agents qui écrivent l'utilisent effectivement.

Un rapport de revue utile devrait distinguer les lectures vérifiées depuis une source fixée, les lectures dans une copie de travail partagée dont les données d'entrée n'ont pas été mesurées et les exécutions invalidées par une mutation observée. Ce sont des contrôles proposés, pas des protections de Qwen déjà livrées et vérifiées ici. La provenance du code source ne peut pas non plus prouver que le raisonnement de la revue est correct.

Essayez le test de 20 secondes : si un réviseur modifie un fichier puis le restaure, un `git status` final propre prouve-t-il que tous les réviseurs parallèles ont vu l'original ? **Non.** Un contrôle des métadonnées peut déclencher une alarme ; une lecture vérifiée depuis l'objet Git fixé établit la source de cette lecture particulière. Avant de faire confiance à un verdict sans anomalie, demandez-vous laquelle de ces affirmations les éléments disponibles permettent réellement d'étayer.
