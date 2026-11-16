---
storyId: 2026-11-11-deepmind-alphagenome-2
locale: fr
sourceSha256: 55dc3625ba3eea6082ccf79d5880158520a3b85de143a43e899a17ad8f2b78a6
status: reviewed
reviewedBy: 'ChatGPT (model self-review)'
reviewedAt: '2026-11-16T11:23:02.461Z'
title: "AlphaGenome 2 passe des tissus aux différents types de cellules"
description: "Le successeur de DeepMind prédit les effets de variations de l’ADN selon les types et états cellulaires, avec une API de recherche et des résultats encore à confirmer indépendamment."
imageAlt: "Un ensemble stratifié de cellules claires révèle une variation d’ADN terracotta à une résolution progressivement plus fine"
corrections: []
---

Une moyenne calculée sur un tissu peut masquer la cellule qui compte.

AlphaGenome 2, de Google DeepMind, s’attaque à ce problème. AlphaGenome prédisait les effets des modifications de l’ADN sur l’activité moléculaire dans des tissus entiers. Son successeur descend à l’échelle des types et états cellulaires, où une même variation génétique peut se comporter différemment dans une cellule immunitaire, cardiaque ou liée à une maladie.

DeepMind indique avoir entraîné le modèle sur plus de 100 millions de profils cellulaires individuels provenant de 68 tissus. Selon l’entreprise, AlphaGenome 2 identifie presque deux fois plus de variants qui modifient l’expression des gènes que son précédent modèle de référence. Les chercheurs non commerciaux peuvent utiliser l’API AlphaGenome ; l’accès commercial est en préversion privée.

## Ce qui change

La modification des données et de l’architecture est un changement d’échelle d’observation.

Les grands atlas cellulaires enregistrent quels gènes sont actifs dans des millions de cellules. Ce sont de précieuses cartes d’observation, mais ils ne prédisent pas automatiquement l’effet d’une nouvelle variation de l’ADN sur un type de cellule donné. AlphaGenome 2 exploite ces atlas comme données d’entraînement pour établir des prédictions.

DeepMind affirme pouvoir généraliser à des états cellulaires et pathologiques absents de l’entraînement. C’est la véritable promesse. Un système qui interpole entre des types déjà connus est utile ; s’il transfère fidèlement ses prédictions vers des états biologiques inédits, il pourrait changer la sélection des expériences de recherche.

L’annonce renvoie vers un article scientifique et fournit une API : le travail peut donc être examiné. Les gains publiés restent toutefois ceux du fournisseur. La recherche documentaire bornée n’a pas révélé de reproduction indépendante des nouveaux résultats cellulaires.

## Prédiction n’est pas explication

Un bon score ne signifie pas que le modèle a découvert pourquoi un variant provoque une maladie.

Les modèles d’effets de variants apprennent des relations statistiques entre séquences et activités moléculaires mesurées. Ils peuvent classer des hypothèses et orienter les chercheurs vers certaines cellules. Ils peuvent également hériter des biais des méthodes de mesure, des tissus étudiés et des populations représentées dans l’entraînement.

Le raccourci dangereux consiste à transformer une sortie du modèle en certitude biologique. Un effet régulateur prédit n’est ni un diagnostic, ni un mécanisme causal, ni une preuve de l’efficacité d’un traitement.

Les chercheurs devraient se demander :

- Quels types et états cellulaires figuraient dans l’entraînement et l’évaluation ?
- Comment les donneurs, séquences et régions génomiques proches ont-ils été séparés ?
- Les performances tiennent-elles sur les cellules rares et les populations sous-représentées ?
- Les scores de confiance sont-ils calibrés pour la tâche de priorisation visée ?
- Combien de prédictions fortes sont confirmées au laboratoire ?
- Que manque-t-il lorsque l’expression dépend de l’environnement ou du développement ?

## L’interface entre atlas et expérience est le vrai sujet d’ingénierie

AlphaGenome 2 transforme une immense ressource d’observation en couche de prédiction interrogeable. Il peut ainsi réduire l’espace de recherche avant des expériences coûteuses.

Le bon workflow n’est pas « demander la réponse au modèle ». C’est plutôt :

1. définir un type cellulaire pertinent et une question réfutable ;
2. produire des prédictions en conservant les versions du modèle et des données ;
3. les comparer à des témoins connus et à d’autres méthodes ;
4. choisir des expériences capables de départager des explications concurrentes ;
5. réintégrer dans le dossier de preuves les hypothèses validées et infirmées.

Les versions comptent. Atlas, annotations et modèles évoluent. Un résultat scientifique doit conserver assez de provenance pour être reproduit.

## Ce que les équipes devraient examiner

Commencez par le découpage des données dans l’article, pas par son meilleur score. Cherchez les fuites entre profils cellulaires apparentés, régions génomiques et donneurs. Examinez les performances par type cellulaire et pas seulement la moyenne.

Testez ensuite la calibration dans un domaine restreint où vous disposez de preuves expérimentales. Un bon modèle de priorisation doit savoir exprimer son incertitude. Si chaque variant déclenche une explication convaincante, l’API risque d’augmenter la charge de travail au lieu de la réduire.

## L’avis de Pulse

AlphaGenome 2 représente un progrès pertinent parce que la biologie ne se déroule pas à la résolution moyenne d’un tissu.

Mais des sorties plus fines peuvent produire une confiance excessive, elle aussi plus détaillée. La valeur du modèle dépendra du travail moins spectaculaire qui suit la prédiction : provenance, calibration, conception expérimentale et réplication.

Utilisez-le pour poser de meilleures questions, sans confondre cela avec le fait d’y avoir répondu.
