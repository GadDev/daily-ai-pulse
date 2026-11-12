---
storyId: 2026-11-10-microsoft-lazarus-agent-backdoor
locale: fr
sourceRef: 32d35b025be38f8a21b5e268f9f81fd985434dda
sourceSha256: 35a072f29472505892338201def303a67e222740cdd7fc2d37ef62138d8d338c
status: reviewed
reviewedBy: Codex (model self-review)
reviewedAt: '2026-11-12T09:17:27.274Z'
title: Dix neurones dormants peuvent dissimuler une porte dérobée dans un agent d’IA
description: Les travaux Lazarus de Microsoft montrent comment de minuscules modifications des poids peuvent pousser un modèle utilisant des outils à exécuter la charge d’un attaquant alors que les évaluations ordinaires restent sans alerte.
imageAlt: Une rangée calme de cellules sombres du modèle, dont quelques cellules en terre cuite forment un chemin déclencheur caché vers une frontière d’outil
corrections: []
---

Un modèle peut réussir le test parce que la porte dérobée attend demain.

Les chercheurs de Microsoft appellent cette technique Lazarus. Ils indiquent qu’un attaquant disposant d’un accès en écriture à un checkpoint de modèle peut reprogrammer moins de dix neurones dormants, sans nouvel entraînement, afin qu’un déclencheur caché force le modèle à produire une séquence arbitraire de tokens. Placez ce modèle dans un agent ayant accès à un terminal, et la séquence peut devenir une commande.

Le plus inquiétant n’est pas seulement que le comportement soit malveillant. C’est que le modèle se comporte normalement jusqu’à l’arrivée du déclencheur.

## Ce qui a changé

Les travaux transforment des neurones rarement actifs en détecteurs de déclencheurs. Un petit classificateur reconnaît une condition choisie, par exemple le passage à une date en 2027. Lorsque la condition apparaît, les neurones reprogrammés injectent des tokens sélectionnés dans le flux résiduel. Plusieurs neurones peuvent être enchaînés pour former une charge qu’un agent utilisant des outils exécute avec les autorisations dont il dispose.

Microsoft affirme que la modification ne requiert que des ressources de calcul de niveau inférence. Elle ne nécessite ni les données ni le matériel utilisés pour entraîner le modèle. Le checkpoint peut encore réussir les évaluations comportementales standard, car les neurones manipulés restent silencieux en dehors de la condition de déclenchement.

Il s’agit d’une attaque contre l’intégrité des poids, et non d’une preuve que les modèles déployés sont déjà remplis de portes dérobées Lazarus. Elle nécessite un accès en écriture à l’artefact du modèle ou à la chaîne qui le produit. Le passage de revue borné n’a trouvé aucune reproduction indépendante, et l’article de Microsoft constitue à la fois la divulgation principale et une partie de l’argumentaire de l’entreprise en faveur de contrôles de provenance plus solides.

Le modèle de menace reste néanmoins concret : un compte compromis, une chaîne de build, un système de stockage ou une personne de confiance malveillante peut modifier un checkpoint après l’entraînement et avant le déploiement.

## Pourquoi les agents aggravent le risque

Un chatbot qui produit une phrase suspecte pose problème. Un agent qui transforme cette phrase en commande shell constitue une frontière de sécurité.

L’accès aux outils convertit la sortie du modèle en action. Plus l’agent reçoit d’autorité, plus un déclencheur caché prend de la valeur. Une charge peut télécharger du code, lire des secrets ou modifier une infrastructure alors que le reste du modèle continue de paraître utile.

C’est pourquoi des résultats propres aux benchmarks ne suffisent pas. Les tests comportementaux échantillonnent des sorties. Lazarus vise l’intégrité de l’artefact qui les produit. Si le déclencheur est rare ou environnemental, une suite de tests peut ne jamais l’activer.

La leçon rappelle la sécurité de la chaîne d’approvisionnement logicielle : savoir ce qu’un programme a fait en préproduction ne prouve pas que le binaire en production est celui que vous avez examiné.

## Les défenses sont familières — et incomplètes

Microsoft recommande de comparer les poids avec ceux d’un modèle de base déclaré, de rechercher les modifications anormales, de signer les artefacts et de conserver une provenance inviolable. L’entreprise affirme que les agents de pointe peuvent aider à inspecter les modifications suspectes et qu’elle étudie l’analyse des poids comme signal supplémentaire lors de l’intégration de modèles à poids ouverts.

Ces contrôles comptent, mais aucun n’est magique.

Une signature prouve qui a signé un artefact, pas que le signataire n’a pas été compromis. L’analyse différentielle nécessite une référence digne de confiance. La détection d’anomalies peut manquer une modification subtile ou signaler une modification légitime. Les fiches de modèle ne décrivent la provenance que si la chaîne de distribution la préserve.

L’environnement d’exécution a toujours besoin de ses propres contrôles :

- épingler les artefacts de modèle par empreinte cryptographique ;
- séparer le stockage des modèles des identifiants de déploiement ;
- limiter les autorisations des agents au strict minimum ;
- exiger une approbation pour les commandes lourdes de conséquences ;
- surveiller les appels d’outils et les accès réseau sortants ;
- consigner l’artefact exact du modèle qui a produit une action ;
- tester les déclencheurs environnementaux, pas seulement ceux présents dans les prompts ;
- considérer les audits de modèles comme des éléments de preuve, pas comme des garanties.

Surtout, ne laissez pas le modèle décider si sa propre action mérite un examen.

## Ce que les équipes devraient tester

Commencez par le chemin qui va du téléchargement du checkpoint au processus en cours d’exécution. Un artefact peut-il changer sans invalider une empreinte ? Le système de service peut-il charger une variante non approuvée ? Les adaptateurs, copies quantifiées et formats convertis sont-ils rattachés à la source examinée ?

Testez ensuite la frontière de l’agent. Si un modèle produit une commande qui télécharge et exécute du code, l’exécution se fait-elle automatiquement ? Quelle identité l’effectue ? À quels réseaux et secrets cette identité a-t-elle accès ? La commande peut-elle passer d’un environnement isolé (sandbox) à la production ?

La réponse ne devrait pas dépendre du bon comportement du modèle. Une conception robuste suppose que la sortie du modèle peut être hostile.

## L’avis de Pulse

La sécurité de l’IA redécouvre sans cesse une vieille vérité : un code n’est pas sûr parce qu’il a souri pendant la démonstration.

Lazarus est mémorable parce que la modification est minuscule et que le déclencheur peut être banal. Mais la leçon durable est plus large. Les poids des modèles sont des artefacts exécutables de la chaîne d’approvisionnement, et les autorisations des agents amplifient toute corruption qu’ils contiennent.

Le secteur débat depuis des années du risque des poids ouverts. Cette attaque est moins idéologique. N’importe quel checkpoint peut être modifié si quelqu’un peut y écrire. La question est de savoir si votre déploiement peut prouver ce qu’il a chargé — et survivre lorsque cette preuve échoue.
