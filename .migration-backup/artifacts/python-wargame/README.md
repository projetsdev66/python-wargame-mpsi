# Python Wargame MPSI

Parcours web de pratique Python, en français, destiné aux élèves de MPSI. L’application propose 13 niveaux progressifs : affichage, variables, entrées et conversions, conditions, boucles, fonctions, listes, chaînes, dictionnaires et tuples.

## Développement

Depuis la racine du workspace :

```sh
pnpm --filter @workspace/python-wargame run dev
pnpm --filter @workspace/python-wargame run typecheck
pnpm --filter @workspace/python-wargame run build
```

Le site est statique. Il ne demande ni compte, ni base de données, ni secret d’application.

## Fonctionnement

- Le code Python est exécuté par Pyodide dans un Web Worker du navigateur.
- Un délai maximal arrête les boucles qui ne terminent pas.
- Les brouillons, la progression et les indices consultés sont enregistrés dans le stockage local du navigateur.
- Les sauvegardes peuvent être exportées et importées au format JSON.
- L’exécution Python nécessite une connexion au CDN Pyodide lors du premier chargement.

Les tests non affichés dans l’interface sont distribués avec l’application cliente : ils ne sont pas présentés à l’élève, mais une personne qui inspecte les fichiers du site peut les retrouver. Les rendre réellement secrets nécessite une validation côté serveur.

## Ajouter un niveau

1. Créer un fichier dans `src/data/levels/` et y exporter un objet `LearningLevel`.
2. Ajouter ce niveau à `src/data/levels/index.ts` à sa position dans le parcours.
3. Définir les notions, l’exercice, le code de départ, les tests visibles et non affichés, les indices et la correction commentée.
4. Utiliser un identifiant unique, augmenter `order`, puis vérifier avec `pnpm --filter @workspace/python-wargame run typecheck` et tester le parcours dans le navigateur.

Les tests disponibles vérifient la sortie standard, des variables ou la valeur renvoyée par une fonction. Les entrées fournies à `input()` sont saisies une valeur par ligne.

## Périmètre

Seuls les fondamentaux sont disponibles actuellement. Algorithmique, calcul scientifique et défis MPSI sont affichés comme étapes futures, sans exercices actifs. Certaines notions envisagées — complexité, intégration numérique, méthode de Newton et méthode d’Euler — ne figurent pas dans le cours joint et demandent des supports MPSI complémentaires avant rédaction.

## Source pédagogique

Les notes de théorie sont des reformulations de notions sélectionnées dans *Cours de Python*, Patrick Fuchs et Pierre Poulain, Université Paris Cité. Le document source indique la licence Creative Commons Attribution – Partage dans les mêmes conditions 3.0 France (CC BY-SA 3.0 FR). Cette application n’est pas une reproduction intégrale du cours.
