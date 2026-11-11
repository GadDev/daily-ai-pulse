---
storyId: 2026-11-06-openai-biobasicsbench
locale: fr
sourceRef: cd1a6a43f604b312c1301ed438da6d06960603ac
sourceSha256: 55599f0836dcb5c9c2d76ae835c73f57ccebf97619125479f51b1882be26e035
status: reviewed
reviewedBy: Codex (model self-review)
reviewedAt: '2026-11-08T08:59:25Z'
title: BioBasicsBench teste si les agents savent interpréter des données expérimentales brutes et imparfaites
description: OpenAI et Ligo ont présenté un benchmark de 100 tâches construit à partir de gels, d’images microscopiques, d’exports d’instruments et de comptes rendus de protocoles bruts, avec des exemples explicites d’échecs de modèles.
imageAlt: Un établi de laboratoire en terre cuite porte des images de gels, des vues microscopiques et des relevés d’instruments sous une lentille d’inspection précise en métal sombre
corrections: []
---

Les benchmarks scientifiques utilisent souvent des figures soignées et sélectionnées pour publication. Le travail de laboratoire est plus désordonné : les contrôles échouent, les images sont ambiguës, les notes se contredisent et la bonne réponse peut être que les éléments disponibles ne permettent aucune conclusion.

OpenAI et l’entreprise de conception d’enzymes Ligo ont présenté BioBasicsBench pour mesurer ce travail. Ses 100 tâches utilisent des matériaux expérimentaux bruts, notamment des gels, des boîtes de colonies, des piles d’images microscopiques, des exports d’instruments, des fichiers de séquençage et des vidéos de protocoles.

OpenAI rapporte que GPT-6 Astra, avec un niveau de raisonnement xhigh, a obtenu 66,7 % du crédit disponible, contre 43,8 % pour GPT-5.6 Sol. Ce sont des résultats de première main. Plus important encore, la publication présente des échecs concrets qui montrent pourquoi un score plus élevé n’équivaut pas à un jugement de laboratoire fiable.

## Le benchmark conserve les données difficiles à interpréter

Les tâches couvrent les méthodes protéiques, l’imagerie et la cytométrie, la quantification et les essais, les méthodes sur les acides nucléiques et le clonage moléculaire. Une tâche peut combiner plusieurs types de données et de compétences au lieu de réduire le problème à une question à choix multiples bien définie.

Des scientifiques ont créé des tâches à partir de leurs propres expériences et associé chacune à une grille de notation rédigée par un expert. Chaque tâche a fait l’objet d’un examen interne par un autre scientifique de Ligo, d’un examen externe par un scientifique de laboratoire titulaire d’un doctorat, puis d’un examen interne final.

L’évaluation a testé 37 combinaisons de modèles et de niveaux de raisonnement. Chacune des 100 tâches a été exécutée cinq fois, soit 18 500 résultats. Les scores accordent un crédit partiel selon les éléments de la grille, ce qui permet de distinguer une conclusion correcte d’une analyse partiellement correcte.

Cette conception est utile, car un agent peut remarquer un détail important tout en prenant la mauvaise décision.

## Les exemples d’échec comptent davantage qu’un classement

Dans une tâche de PCR sur colonies, Astra a correctement regroupé les bandes visuellement, mais a associé la mauvaise interprétation biologique aux groupes. Il a sélectionné les mauvaises colonies parce qu’une hypothèse familière a pris le pas sur les contrôles expérimentaux.

Dans un exemple de microscopie, le modèle a remarqué que le contraste des vacuoles variait avec la mise au point, puis a écarté les exemples plus clairs et généralisé que les vacuoles étaient plus sombres que les cellules environnantes.

Dans une tâche de comptage de colonies, ses marques ont fusionné des voisines proches, manqué des colonies visibles et compté de l’agar vide. Le total net était supérieur d’environ 12 %, ce qui gonflerait une estimation ultérieure de l’efficacité de transformation dans la même proportion si les autres variables restaient constantes.

Ce ne sont pas des échecs exotiques. Ce sont des façons ordinaires de se tromper en science : une observation correcte ne contrôle pas la conclusion, une hypothèse l’emporte sur les données, ou une mesure apparemment simple dérive.

## Utilisez-le comme modèle d’évaluation

Une équipe qui déploie une assistance en laboratoire devrait reprendre cette structure, même si elle ne peut pas utiliser directement le benchmark.

Créez des tâches à partir de données internes brutes, pas seulement à partir d’expériences réussies. Incluez des contrôles négatifs, des essais ratés, des notes incomplètes et des exemples où l’action correcte consiste à s’arrêter ou à demander davantage de données. Rendez visible la conséquence en aval : quel échantillon serait purifié, quel essai serait répété et quelle conclusion serait consignée.

Évaluez séparément les obligations intermédiaires :

- identifier le contrôle pertinent ;
- distinguer l’observation de l’interprétation ;
- signaler l’incertitude et les éléments contradictoires ;
- rejeter une conclusion non étayée ;
- préserver les unités et l’identité des échantillons ;
- recommander une étape suivante réversible.

Effectuez des essais répétés. Une seule réponse correcte n’établit pas la fiabilité lorsque le même modèle peut produire une conclusion différente à la tentative suivante.

## À retenir

BioBasicsBench rapproche l’évaluation des agents scientifiques des données que les scientifiques manipulent réellement. L’amélioration de score rapportée est notable, mais les cas d’échec constituent l’apport le plus durable.

Un assistant capable de décrire un gel ou une image microscopique n’est pas nécessairement prêt à décider ce que cela signifie. Le critère de déploiement devrait être un raisonnement qui tient compte des contrôles, une incertitude bien calibrée et un traitement reproductible de données imparfaites, et non une moyenne unique sur un benchmark.
