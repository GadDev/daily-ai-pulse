---
storyId: "2026-10-20-github-copilot-model-policy-api"
locale: fr
sourceRef: "f9d0331e3f0c9b9ea9851d942d27fb4785c0906b"
sourceSha256: "49e763eaaf9e2f2c48d7ecd56dbbc726fe2d0a9d9a79f2769f5e8ae7a33d65f6"
status: reviewed
reviewedBy: "Codex (model review)"
reviewedAt: "2026-10-20T10:14:28Z"
title: "GitHub expose la politique des modèles Copilot sous la forme d'un plan de contrôle REST auditable"
description: "Des points de terminaison GET et PATCH en disponibilité générale permettent aux administrateurs d'entreprise et d'organisation d'inspecter et de mettre à jour la disponibilité des modèles Copilot sur quatre périmètres de politique."
imageAlt: "Quatre plateaux de politique imbriqués sont reliés à une seule porte de contrôle réglable en terre cuite"
corrections: []
---

GitHub a rendu généralement disponibles des points de terminaison REST pour les politiques relatives aux modèles Copilot. Les propriétaires d'entreprise et les administrateurs d'organisation peuvent désormais consulter et mettre à jour la disponibilité des modèles sans dépendre exclusivement des paramètres interactifs. L'API couvre quatre périmètres : les entreprises, les équipes d'entreprise, les applications d'entreprise et les organisations.

Il s'agit d'un changement de gouvernance, et non d'une sortie de modèle. Les équipes plateforme disposent d'une vue lisible par machine de la politique configurée, des valeurs par défaut héritées, de la délégation et du caractère modifiable des paramètres, ainsi que d'un chemin pris en charge pour appliquer les changements par automatisation.

## Quatre périmètres imposent de modéliser l'héritage des politiques

Les nouveaux points de terminaison GET et PATCH ne constituent pas un simple interrupteur. La politique d'entreprise peut déléguer le contrôle aux organisations, ou aux équipes et aux applications lorsqu'une entreprise utilise ce mode de gestion. Les réponses au niveau de l'organisation comprennent la politique effective pour chaque modèle disponible, y compris celle héritée de l'entreprise ou issue de la disponibilité par défaut. Les réponses des équipes et applications d'entreprise indiquent si un modèle est modifiable ou verrouillé par une décision prise à un niveau supérieur.

Cette hiérarchie constitue la principale question d'implémentation. Une réponse de l'API peut décrire la politique enregistrée et effective sur un périmètre donné, mais GitHub avertit que ces états ne déterminent pas nécessairement si un utilisateur individuel peut accéder à un modèle. L'attribution des licences, l'éligibilité au produit, le comportement du client et d'autres contrôles restent pertinents.

Considérez ces points de terminaison comme le plan de contrôle de la politique des modèles, et non comme une source complète de vérité sur les droits d'un utilisateur.

## Les mises à jour sont structurées et soumises à des autorisations

Au niveau de l'organisation, GitHub documente une mise à jour atomique : si une modification demandée ne peut pas être appliquée, aucune des modifications de cette requête n'est enregistrée. Les identifiants de modèles doivent provenir de la réponse GET correspondante, et les politiques héritées ou autrement verrouillées ne peuvent pas être modifiées au niveau inférieur.

Les mises à jour de l'entreprise permettent l'activation et la désactivation explicites ainsi que des états de délégation adaptés au mode de politique de l'entreprise. Les points de terminaison des équipes et des applications distinguent eux aussi la configuration locale de la politique contrôlée par l'entreprise. La documentation attribue des autorisations distinctes en lecture et en écriture pour les contrôles d'IA de l'entreprise ; les tokens classiques nécessitent des périmètres d'administration de l'entreprise, tandis que les tokens à granularité fine et ceux des GitHub Apps utilisent les autorisations documentées de l'entreprise ou de l'organisation.

Pour l'automatisation, la séquence sûre consiste donc à lire, comparer, vérifier le caractère modifiable, appliquer un patch sur le plus petit périmètre visé, puis relire la politique effective obtenue. Un script de traitement en masse qui se contente d'envoyer les valeurs souhaitées peut échouer sur des modèles verrouillés ou supprimer involontairement le contexte nécessaire pour expliquer l'héritage.

## La disponibilité des modèles peut devenir une configuration examinable

L'API rend possibles plusieurs modèles opérationnels :

- exporter l'état des politiques à des fins d'audit et d'examen des changements ;
- comparer les organisations, les équipes et les applications afin de détecter les dérives ;
- appliquer une configuration de référence approuvée au moyen d'une GitHub App ;
- détecter les modèles nouvellement disponibles relevant de la disponibilité par défaut ; et
- consigner les changements de délégation avec les autres décisions de gouvernance de la plateforme.

L'avantage durable ne se limite pas à l'écriture de scripts. Il consiste à rendre le choix du modèle visible comme une configuration dotée d'une provenance, d'un responsable et d'attentes en matière de retour arrière. C'est important lorsque la disponibilité du modèle influe sur la politique de traitement des données, le coût, les capacités ou la reproductibilité des workflows d'agents.

## À retenir pour les ingénieurs

Commencez par un inventaire en lecture seule. Relevez, pour chaque périmètre, la valeur par défaut, la politique explicite, l'état hérité et le caractère modifiable. Définissez le niveau responsable de chaque décision avant d'autoriser l'accès PATCH, et utilisez une GitHub App ou un token aux autorisations strictement limitées. Dans les tests, couvrez les modèles verrouillés, les changements de délégation, les requêtes partiellement invalides et les modifications concurrentes par des administrateurs.

Ne déduisez pas l'accès de l'utilisateur final d'une seule réponse de politique. Vérifiez séparément l'expérience effective et évitez que les journaux d'automatisation contiennent des identifiants d'accès ou des métadonnées d'organisation inutiles.

## Limites des preuves

Le changelog de GitHub du 19 octobre et la documentation REST établissent la disponibilité générale, les périmètres des points de terminaison, les autorisations requises, les états de délégation et le comportement documenté des mises à jour. Les avantages opérationnels décrits ici sont les conséquences techniques de ces contrôles ; aucune étude indépendante de déploiement ni évaluation de leur qualité pour l'audit n'était disponible au cours de cette recherche.
