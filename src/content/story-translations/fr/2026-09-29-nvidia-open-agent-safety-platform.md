---
storyId: 2026-09-29-nvidia-open-agent-safety-platform
locale: fr
sourceRef: 071370ad953151dc9a8daa2fb667c5d826e108ca
sourceSha256: 3d1e24d47fc58e380e4cfbc861041d85ef77706f50344343e1f1a06d59b0cc23
status: reviewed
reviewedBy: "Codex (model review)"
reviewedAt: "2026-10-14T12:53:52.027Z"
title: "NVIDIA déplace les contrôles de sécurité des agents hors de l’agent avec OpenShell et Sentry"
description: "OpenShell place les autorisations des agents dans une frontière d’exécution externe, tandis que Sentry ajoute un dispositif matériel optionnel, hors bande, pour une surveillance et une application continues des règles."
imageAlt: "Une sphère ivoire dans une chambre gris anthracite, avec une sentinelle distincte couleur terre cuite derrière elle"
corrections: []
---

L’Open Agent Safety Platform de NVIDIA avance une proposition architecturale utile : dès qu’un agent peut écrire du code, ouvrir des shells, appeler des services, utiliser des identifiants d’accès ou déléguer à des sous-agents, les contrôles de sécurité les plus importants ne devraient pas résider dans la charge de travail qu’ils contrôlent.

La plateforme annoncée le 28 septembre combine deux couches. **OpenShell** est un environnement d’exécution open source qui fait fonctionner les charges de travail des agents dans des environnements isolés (sandboxes), avec des règles appliquées de l’extérieur. **NVIDIA Sentry** est une architecture de référence optionnelle qui déplace une autre couche de surveillance et d’application des règles sur des DPU BlueField-4, hors de l’hôte sur lequel l’agent s’exécute.

Le résultat est moins intéressant comme lancement d’un produit que comme réalisation concrète d’un schéma plus large de sécurité des agents : traiter l’agent comme une charge de travail non fiable, faire appliquer les règles d’autorisation hors du harness et conserver un plan de contrôle distinct capable de l’observer et de l’arrêter.

## Ce qu’OpenShell change

OpenShell 0.1.0 sépare la charge de travail des composants qui décident de ce qu’elle peut faire.

L’architecture comporte trois éléments principaux :

- une **Gateway** qui gère le cycle de vie des sandboxes et les règles pour plusieurs charges de travail ;
- un **Supervisor** associé à chaque sandbox, qui évalue les activités sortantes au regard des règles ;
- le **Sandbox** lui-même, dans lequel s’exécutent l’agent, le code généré, les outils locaux et les processus enfants.

NVIDIA indique que le sandbox utilise les contrôles du noyau du système d’exploitation pour restreindre l’accès aux fichiers, les processus et l’élévation de privilèges. Le trafic réseau passe par le supervisor au lieu de donner à la charge de travail une connectivité sans restriction.

Cette distinction compte, car les règles peuvent être plus précises qu’une liste d’hôtes autorisés. OpenShell peut inspecter les échanges HTTP, GraphQL et MCP configurés et distinguer les opérations de lecture des écritures. Une règle peut donc permettre à un agent de lire depuis un service tout en refusant une mutation sur le même point de terminaison.

Les règles sont écrites en YAML et compilées en OPA/Rego pour être évaluées. OpenShell consigne aussi les décisions dans une piste d’audit au format Open Cybersecurity Schema Framework, afin que les actions refusées puissent être examinées ensuite au lieu de disparaître dans des journaux d’agent opaques.

## Les identifiants d’accès restent hors de la charge de travail

OpenShell sépare également l’autorisation de la possession du secret.

Un agent peut obtenir l’accès à un fournisseur approuvé sans recevoir le véritable identifiant d’accès dans son sandbox. La charge de travail utilise une valeur de substitution, tandis que le supervisor valide la requête et ne remplace cette valeur par le véritable secret que pour une destination autorisée.

Les équipes disposent ainsi de deux contrôles indépendants :

1. les autorisations portées par l’identifiant d’accès sous-jacent ;
2. les règles plus restrictives qui régissent la manière dont l’agent peut l’utiliser.

Un jeton GitHub doté de droits d’écriture, par exemple, ne signifie pas automatiquement que l’agent en cours d’exécution a besoin d’un accès en écriture sans restriction pour chaque requête. L’environnement d’exécution peut imposer une règle plus stricte sans modifier le jeton lui-même.

Pour les agents de programmation et les systèmes qui utilisent beaucoup MCP, ce modèle est plus utile que de s’en remettre à des instructions de prompt telles que "do not modify production" ou "ask before writing." Ces instructions restent utiles, mais elles ne constituent pas une frontière de sécurité.

## L’élargissement des autorisations devient un processus

Les agents qui travaillent longtemps découvrent souvent qu’un accès leur manque une fois la tâche commencée. Le conseiller de règles d’OpenShell peut permettre à un agent de proposer une modification au périmètre étroit lorsqu’une action est refusée.

Le détail essentiel est que l’agent n’approuve pas sa propre demande par défaut. La modification proposée reste en attente d’une revue humaine, et une règle réseau approuvée peut être chargée dans le sandbox en cours d’exécution sans redémarrer la tâche.

La séquence peut être examinée : l’agent tente une action, les règles la bloquent, le refus est consigné et l’agent propose un accès plus limité. Un humain décide ensuite d’approuver la modification ou de maintenir le refus.

L’approbation elle-même mérite autant d’attention que les règles initiales. Une demande devrait préciser la destination, l’opération, la raison et la durée de l’accès proposé. Une explication générée par l’agent est un élément à examiner, pas une instruction d’accorder l’autorisation. Sinon, une frontière d’exécution étroite peut progressivement se transformer en de larges pouvoirs au fil des approbations.

Pour les équipes qui expérimentent des agents autonomes de programmation ou d’exploitation, c’est un mode d’échec bien plus sain que de donner d’emblée de larges pouvoirs à l’agent simplement pour éviter les interruptions.

## Sentry ajoute un domaine de confiance distinct

L’architecture de référence de NVIDIA va plus loin avec Sentry sur les DPU BlueField-4.

L’entreprise présente BlueField comme un domaine de confiance hors bande : la surveillance et l’application des règles sont isolées de l’hôte et restent donc hors de portée directe de la charge de travail de l’agent. NVIDIA indique que Sentry peut corréler l’activité de l’agent, les décisions d’autorisation, l’utilisation des outils et l’accès aux données, puis appliquer les règles ou mettre un agent en quarantaine lorsqu’il franchit sa frontière.

NVIDIA annonce une mise en quarantaine à l’échelle de la milliseconde, mais cela reste une affirmation du fournisseur dans cet article ; nous n’avons pas trouvé de reproduction indépendante des garanties de sécurité de la plateforme lors de cette collecte.

La couche matérielle est optionnelle. OpenShell est open source et NVIDIA indique qu’il peut fonctionner au-delà de ses propres plateformes de calcul. La leçon architecturale plus générale ne dépend donc pas de l’adoption de BlueField : **séparer la charge de travail de l’autorité qui applique ses règles, puis tester si cette séparation tient dans le système déployé.** Une séparation physique ajoute une frontière ; elle ne démontre pas, à elle seule, que chaque action pertinente est observée ou que chaque décision d’autorisation est correcte.

## Définir ce que couvre réellement la frontière

Pour une équipe d’ingénierie, l’étape utile suivante consiste à traduire l’architecture en une liste de propriétés testables. Quels fichiers la charge de travail peut-elle lire ? Quels processus peut-elle démarrer ? Quelles destinations peut-elle atteindre ? Quelles opérations peut-elle effectuer sur les services avec les identifiants d’accès disponibles via le supervisor ?

Il faut répondre à ces questions pour la configuration déployée, sans déduire les réponses de l’annonce de la plateforme. L’inspection qui distingue lecture et écriture dépend du protocole pris en charge et des règles qui l’interprètent. Une connexion autorisée n’est pas automatiquement une opération autorisée, et une règle pour un service configuré dit peu de chose sur un autre point de terminaison.

La séparation des identifiants d’accès exige elle aussi une affirmation précise. Garder un secret hors du sandbox réduit les possibilités pour la charge de travail de copier le secret lui-même. Cela ne rend pas sûre toute requête effectuée avec cet identifiant. Si les règles externes autorisent une opération destructrice, l’identifiant peut toujours exercer ce pouvoir. Les équipes devraient donc examiner ensemble le compte de service sous-jacent et les règles de l’environnement d’exécution.

La même distinction s’applique aux données. Une lecture légitime peut renvoyer des informations sensibles, et une destination par ailleurs autorisée peut devenir un endroit où ces informations sont envoyées. L’isolation et les autorisations au niveau des opérations ne déterminent pas si un résultat particulier convient à un public particulier. Le traitement des données, la revue des modifications lourdes de conséquences et les critères d’acceptation de la tâche doivent toujours avoir des responsables explicites.

C’est la limite de l’argument architectural : déplacer l’application des règles hors de l’agent donne à l’équipe un point de contrôle plus solide pour les mettre en œuvre. Cela ne fournit pas les bonnes règles et ne démontre pas que les intentions de l’agent sont bienveillantes.

## Un pilote pratique avant d’accorder de vrais pouvoirs

Commencez avec un dépôt jetable et un service de test contenant des données synthétiques. Confiez à l’agent une tâche utile, mais délimitée, comme lire une issue et préparer un patch. Limitez l’identifiant d’accès à cet environnement de test et décidez à l’avance quelles opérations devraient réussir, échouer ou nécessiter une approbation.

Utilisez une petite matrice de tests qui exerce la frontière indépendamment de la volonté du modèle de respecter les instructions :

| Scénario | Résultat attendu à vérifier |
| --- | --- |
| Lire une ressource explicitement autorisée | L’opération réussit et peut être attribuée à la bonne charge de travail. |
| Tenter une écriture lorsque seules les lectures sont autorisées | Le service reste inchangé et le refus est consigné. |
| Demander une destination non approuvée | L’accès est bloqué au lieu de se rabattre silencieusement sur une autre voie. |
| Répéter une action refusée via un processus enfant | L’enfant reste soumis aux restrictions prévues. |
| Demander des règles plus permissives | La demande reste en attente jusqu’à ce qu’une personne autorisée à la revoir intervienne. |
| Arrêter la charge de travail pendant une tâche active | La poursuite du travail cesse dans le délai opérationnel choisi par l’équipe. |

Il s’agit de cas d’évaluation proposés, pas de résultats rapportés d’un test indépendant d’OpenShell. Exécutez-les avec la version exacte de l’environnement d’exécution, les règles, la configuration des outils et le déploiement que vous comptez utiliser. Un résultat positif dans une démonstration locale ne devrait pas être considéré comme une preuve pour une autre topologie de production.

Pour chaque cas, inspectez les deux côtés de la frontière. Une transcription de l’agent affirmant qu’une écriture a été refusée ne suffit pas ; vérifiez que le service de test n’a pas changé. De même, une erreur d’outil ne prouve pas que les règles prévues ont causé l’échec. La trace d’audit devrait permettre de relier la charge de travail, l’opération tentée, la décision d’autorisation et l’état résultant du service.

Conservez la version des règles avec les résultats. Si une approbation modifie les accès en cours de tâche, la personne qui examine les résultats ensuite doit savoir quelles règles régissaient chaque action. C’est particulièrement important pour déterminer si une opération inattendue était un défaut d’application des règles ou une opération qu’elles autorisaient en réalité.

## Prévoir les défaillances opérationnelles

L’application externe des règles devient un élément du chemin critique de la tâche. Un pilote devrait donc inclure un supervisor indisponible, une erreur d’évaluation des règles, un échec de récupération des identifiants d’accès et un identifiant de test révoqué. Définissez le comportement souhaité avant de le mesurer : quels échecs doivent arrêter la tâche, lesquels peuvent donner lieu à une nouvelle tentative et qui peut rétablir l’accès ?

Observez également la réaction de l’agent. Réessayer sans cesse une opération refusée peut créer du bruit, des coûts et des demandes d’approbation difficiles à suivre, même lorsque la frontière tient. Un système utilisable devrait expliquer un refus assez clairement pour que l’opérateur puisse distinguer un accès légitime manquant d’une action qui doit rester interdite.

Mesurez la qualité des tâches achevées en parallèle de la latence des règles, des opérations rejetées, des interruptions pour approbation et du temps de récupération. N’optimisez pas uniquement pour l’exécution réussie la plus rapide. Une configuration qui accomplit davantage de tâches en accordant des autorisations plus larges modifie le compromis de sécurité ; ce n’est donc pas une amélioration des performances à conditions égales.

Enfin, répétez la procédure d’arrêt avec un opérateur désigné. Un plan de contrôle distinct n’est utile que si quelqu’un peut identifier la charge de travail concernée, utiliser ce contrôle et vérifier que l’exécution a cessé. L’affirmation de NVIDIA sur la quarantaine donne aux équipes une question à examiner ; leur propre exigence opérationnelle devrait déterminer le test d’acceptation.

## Pourquoi cela compte pour les développeurs d’agents

La pile des agents commence à ressembler à l’évolution de la sécurité des navigateurs et des charges de travail cloud. Les capacités progressent plus vite que les frontières de confiance : l’isolation, les identifiants d’accès, les règles réseau, l’identité et la possibilité d’audit deviennent donc des éléments de l’environnement d’exécution, plutôt qu’un ajout tardif à l’application.

La liste pratique de vérification est simple :

- exécuter les agents puissants dans des environnements d’exécution isolés ;
- garder les secrets hors de la charge de travail de l’agent ;
- rendre l’accès réseau explicite et appliquer le principe du moindre privilège ;
- distinguer les autorisations de lecture et d’écriture lorsque les protocoles le permettent ;
- consigner les refus et les décisions d’autorisation ;
- exiger une personne externe pour approuver l’élargissement des autorisations ;
- conserver un point de contrôle capable d’arrêter le travail même si le processus de l’agent est compromis ou se comporte simplement mal.

OpenShell et Sentry restent des implémentations définies par NVIDIA, et les affirmations les plus fortes présentées ici proviennent de sources primaires plutôt que de résultats de sécurité reproduits indépendamment. Mais l’architecture mérite l’attention parce qu’elle fait passer la sécurité des agents de « le modèle devrait bien se comporter » à **une ingénierie des systèmes qui suppose que, parfois, il ne le fera pas**.
