---
storyId: 2026-11-04-openai-images-2-6
locale: fr
sourceRef: 94ceb9bb410648444934124d807491b980a208c9
sourceSha256: d688eb6c3d4a80755a800f670baa7324cff00cb1a5f4076bb70b510619a94e7c
status: reviewed
reviewedBy: Codex (model self-review)
reviewedAt: '2026-11-06T11:01:05Z'
title: Images 2.6 dissocie la qualité visuelle de l’effort de planification
description: "Images 2.6 d’OpenAI ajoute la génération de GIF, l’annotation d’images, l’export SVG ainsi que des réglages distincts de qualité et de complexité. Le changement utile est un arbitrage de production plus explicite, tandis que les gains de vitesse et de cohérence restent déclarés par le fournisseur."
imageAlt: Un cadre d’image modulaire en pierre se divise entre une voie rapide de retouche en terre cuite et une voie de planification plus détaillée en métal sombre
corrections: []
---

OpenAI a lancé Images 2.6 à l’échelle mondiale dans ChatGPT et Codex, et rendu deux variantes disponibles par API. GPT-Image-2.6 Flare est positionné sur la vitesse ; Sunburst, sur un niveau supérieur de détail et de cohérence. Cette version ajoute aussi la génération de GIF, l’annotation d’images, l’export SVG et un réglage de complexité distinct de la qualité d’image.

Cette séparation constitue le changement d’ingénierie le plus utile. Un flux de production peut désormais exprimer deux choix différents : le niveau de fidélité visuelle souhaité et l’effort de planification que le modèle doit consacrer au respect de la scène.

OpenAI affirme qu’Images 2.6 génère des images 50 % plus vite que son prédécesseur et que Flare peut produire un résultat de faible qualité en seulement six secondes. Il s’agit de mesures du fournisseur. Aucune comparaison indépendante de la latence, de la cohérence des retouches ou de la qualité des SVG n’était disponible dans la fenêtre de couverture de cette édition.

## Ce qui a changé

L’annotation d’images, déjà disponible dans ChatGPT, est maintenant exposée dans l’API. Une équipe peut désigner la zone à modifier au lieu de s’en remettre uniquement à une description textuelle de la retouche. L’export SVG ouvre une autre voie en aval pour les sites web, les applications et les supports imprimés.

Le nouveau paramètre de complexité contrôle l’effort de planification. OpenAI recommande une faible complexité pour la plupart des retouches, et une complexité moyenne ou élevée pour les scènes comportant de nombreux éléments ou contraintes. La qualité reste le réglage du détail et de la fidélité.

Cette distinction est précieuse, car une retouche simple et une composition chargée n’échouent pas de la même façon. Accroître la qualité visuelle n’aide pas nécessairement un modèle à raisonner sur douze contraintes spatiales. Accroître l’effort de planification peut ne pas améliorer la texture ou la résolution d’un résultat par ailleurs correct.

La sortie GIF ajoute du mouvement sans nécessiter un modèle vidéo séparé. Les exemples de lancement se concentrent sur de courtes boucles, des mascottes, des réactions et des storyboards. Les équipes doivent néanmoins examiner la cohérence temporelle, les raccords de boucle, les dimensions des images et la taille de l’export, plutôt que de supposer qu’un aperçu séduisant est prêt pour la production.

## Traiter les variantes comme des voies d’acheminement

Flare et Sunburst posent un problème de routage comparable à l’emploi de plusieurs modèles de texte. La voie à plus faible latence n’est pas automatiquement celle qui produit l’actif final le moins coûteux si des retouches ratées entraînent des générations répétées ou un nettoyage manuel.

Construisez un jeu d’évaluation représentatif :

- une retouche locale rapide avec une zone marquée ;
- un produit ou un personnage qui doit rester cohérent d’une révision à l’autre ;
- une affiche soumise à des contraintes de mise en page sans texte ;
- un export SVG nécessitant des tracés propres et des groupes utilisables ;
- un court GIF doté d’une boucle fluide ;
- une scène dense comportant plusieurs contraintes indépendantes.

Pour chaque cas, consignez la variante, la qualité, la complexité, les dimensions, la latence, le nombre de nouvelles tentatives et les corrections du réviseur. Évaluez à la fois le respect des instructions et la préservation des détails qui ne devaient pas changer. Une retouche qui corrige une zone tout en déformant un logo, un visage ou la forme d’un produit n’est pas réussie.

Si l’API expose des identifiants déterministes ou des métadonnées de requête, conservez-les avec l’actif. Gardez aussi les images d’entrée, les masques ou annotations et les paramètres exacts. La sortie du modèle n’est pas en elle-même un artefact de construction reproductible, sauf si le service garantit une régénération déterministe.

## Le SVG exige une autre forme de contrôle

Un fichier SVG peut être visuellement correct et structurellement médiocre. Il peut contenir des tracés superflus, des découpages maladroits, du contenu matriciel incorporé ou des formes difficiles à modifier. Avant de considérer l’export comme un livrable pour la conception ou le développement frontend, inspectez la structure du DOM, la zone d’affichage, les dimensions, le comportement des remplissages et contours, l’usage en matière d’accessibilité et le rendu dans les navigateurs ciblés.

Pour les applications sensibles à la sécurité, traitez les SVG générés comme des entrées non fiables. Assainissez-les avant de les intégrer et ne supposez pas que « produit par le modèle » signifie qu’ils peuvent être placés directement dans une page sans risque.

## L’avis de Pulse

Images 2.6 est moins intéressant comme promesse de « meilleures images » que comme surface de contrôle plus explicite. Vitesse, fidélité et effort de planification deviennent des réglages séparés, ce qui donne aux équipes de production quelque chose de concret à mesurer.

Commencez par une faible complexité pour les retouches bien délimitées, ne l’augmentez que lorsque le respect des contraintes l’exige, et évaluez l’ensemble du flux de l’actif. La meilleure voie est celle qui produit une image, une animation ou un vecteur accepté avec le moins de nouvelles tentatives et de nettoyage — pas celle qui fournit le premier aperçu le plus vite.
