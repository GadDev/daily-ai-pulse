---
storyId: 2026-11-10-google-edge-gallery-speech
locale: fr
sourceRef: 9d30198100501d198faec262dc87925339e46ff8
sourceSha256: 7709373b9dc6c28ce0a68472d87b23738a639536ca2b8e104588c4a47644a7f7
status: reviewed
reviewedBy: Codex (model self-review)
reviewedAt: '2026-11-11T08:25:14Z'
title: Google place une boucle vocale complète sur l’appareil
description: AI Edge Gallery associe désormais reconnaissance et synthèse vocales hors ligne à des petits modèles de langage locaux, via des voies Android et open weight multiplateformes.
imageAlt: Un chemin sonore compact en terre cuite boucle dans une forme sombre d’appareil local sans franchir la limite environnante
corrections: []
---

Les assistants vocaux font généralement disparaître le réseau du modèle mental de l’utilisateur. La dernière mise à jour d’AI Edge Gallery de Google tente de faire également disparaître le réseau du système.

Le projet comprend désormais la reconnaissance automatique de la parole et la synthèse vocale sur l’appareil, conçues pour fonctionner aux côtés de petits modèles de langage locaux comme Gemini Nano et Gemma 4. Google propose une voie Android avec ML Kit et une voie multiplateforme avec MediaPipe Tasks et des bundles de modèles LiteRT.

Le résultat est une boucle locale complète : écouter, raisonner et parler sans envoyer l’audio brut à un service distant.

## Ce qui a changé

Sur Android, Google affirme que ses modèles vocaux système prennent en charge la transcription multilingue dans plus de 100 langues à une vitesse dix fois supérieure au temps réel. Un modèle vocal fondé sur la diffusion commencerait à produire du son en environ 100 millisecondes et pourrait synthétiser de l’audio à 24 kHz jusqu’à cinquante fois plus vite que le temps réel. Comme les modèles sont intégrés au système d’exploitation, Google indique qu’ils n’ajoutent aucun octet au paquet de l’application.

Pour les autres plateformes, la version comprend des bundles LiteRT-LM optimisés pour des modèles comme Parakeet-TDT 0.6B, PocketTTS 100M, Kokoro-82M et Phonon 31M. L’implémentation de référence montre une transcription en streaming, une synthèse par phrase et la coordination avec la génération d’un modèle de langage local.

Ces chiffres de vitesse et de précision sont de première main et dépendent de l’appareil. « Sur l’appareil » ne signifie pas des performances identiques pour toutes les mémoires, puces, températures ou langues.

## Pourquoi des modèles séparés peuvent encore gagner

Un modèle multimodal peut parfois accepter directement l’audio. Google présente délibérément une chaîne : un petit système de reconnaissance produit du texte, un modèle de langage local raisonne dessus et un synthétiseur vocal produit la réponse.

Cette conception modulaire a des avantages. Chaque composant peut être remplacé, profilé et optimisé indépendamment. La parole peut être diffusée avant la fin du travail d’un modèle plus grand. Une équipe peut choisir différents packs linguistiques ou différentes voix sans réentraîner le modèle de raisonnement. L’audio sensible peut rester local même si une autre partie de l’application utilise occasionnellement un service distant.

Le coût réside dans la coordination. Les développeurs doivent gérer les transcriptions partielles, les interruptions, les limites de phrases et la concurrence pour la mémoire et le calcul. Une chaîne locale peut sembler plus lente que son benchmark si le système de reconnaissance, le modèle de langage et le synthétiseur se disputent le même accélérateur.

## La démonstration révèle les détails utiles

La démonstration d’apprentissage des langues de Google combine caméra, parole locale et petit modèle de langage pour expliquer des panneaux ou des objets sans connectivité. Une sortie structurée sépare les expressions en langue étrangère afin que la couche vocale puisse changer de prononciation. L’exemple AI Chat supprime la syntaxe Markdown, ignore le code et les tableaux, puis planifie la synthèse phrase par phrase.

Ce ne sont pas des capacités de modèle spectaculaires. Ce sont les détails d’ingénierie qui décident si une interface vocale est utilisable.

L’exécution hors ligne modifie également la frontière de confidentialité. Garder l’audio local réduit l’exposition réseau, mais les applications ont toujours besoin de contrôles clairs pour les transcriptions stockées, les modèles téléchargés, l’accès au microphone et les statistiques. Un modèle local peut divulguer du texte sensible dans les journaux aussi facilement qu’un modèle distant.

## Ce qu’il faut tester avant de livrer

Utilisez les appareils cibles, pas une approximation sur ordinateur.

- Mesurez le délai avant la première transcription partielle, la transcription finale et la première réponse audible.
- Testez les pièces bruyantes, l’alternance de langues, les accents et les noms rares.
- Surveillez le pic de mémoire, la température soutenue et la consommation de batterie.
- Interrompez le locuteur pendant la synthèse.
- Vérifiez ce qui se passe lorsqu’un pack linguistique manque ou est corrompu.
- Conservez un indicateur clair de l’activité du microphone et du stockage local.
- Comparez les modèles système et les bundles open weight sur le même ensemble audio.

Pour les applications multiplateformes, considérez le téléchargement et la mise à jour des modèles comme une partie du produit. Même un bundle compact exige gestion de version, contrôles d’intégrité et stockage.

## L’avis de Pulse

La version importante n’est pas un autre chatbot parlant. C’est un ensemble pratique de composants permettant de construire la voix sans faire du cloud un participant obligatoire à chaque phrase.

Cela peut améliorer la latence, la résilience et la confidentialité. Cela transfère aussi la responsabilité à l’équipe applicative. Une fois la parole exécutée localement, on ne peut plus accuser le réseau de chaque délai — et « hors ligne » devient une affirmation que les ingénieurs doivent prouver sur l’ensemble du chemin de données.
