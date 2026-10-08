# Python Wargame MPSI

Parcours web en français pour apprendre Python par des défis progressifs liés au cours de MPSI.

## Run & Operate

- `pnpm --filter @workspace/python-wargame run dev` — démarrer le site.
- `pnpm --filter @workspace/python-wargame run typecheck` — vérifier le typage du site.
- `pnpm --filter @workspace/python-wargame run build` — construire le site statique.
- `pnpm run typecheck` — vérifier tous les packages du workspace.
- Le site Python Wargame ne nécessite ni base de données ni secret.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9.
- Frontend : React 19, Vite et TypeScript.
- Exécution Python : Pyodide dans un Web Worker dédié.
- Stockage : localStorage avec import/export JSON.
- Déploiement : build statique Vite compatible Vercel.

## Where things live

- `artifacts/python-wargame/src/data/levels/` — contenu indépendant de chaque niveau.
- `artifacts/python-wargame/src/components/` — interface du parcours, éditeur et navigation.
- `artifacts/python-wargame/src/lib/` — moteur Python côté navigateur et sauvegardes locales.
- `artifacts/python-wargame/README.md` — guide d’ajout de niveaux, limites et attribution du cours.

## Architecture decisions

- Le code Python s’exécute uniquement dans le navigateur, sans compte ni envoi de code à un serveur.
- La progression et les brouillons restent sur l’appareil de l’élève ; les fichiers JSON servent de sauvegarde transférable.
- Les niveaux 2 à 4 du parcours restent annoncés comme prévus et ne contiennent pas encore de sujets.

## Product

Le MVP comprend 13 défis sur les instructions, variables, conversions, conditions, boucles, fonctions, listes, chaînes, dictionnaires et tuples. Les niveaux se déverrouillent dans l’ordre ; chaque niveau propose des indices, une correction après réussite et des tests non affichés dans les résultats.

## User preferences

Le site et ses contenus destinés aux élèves sont en français.

## Gotchas

- Les vérifications dites « cachées » sont livrées dans le bundle navigateur : elles ne sont pas montrées dans l’interface, mais ne sont pas secrètes contre une inspection du code.
- Le worker et le délai d’exécution isolent les programmes pour l’exercice, sans constituer une frontière de sécurité pour des utilisateurs hostiles.
- La progression est locale et n’est pas synchronisée entre appareils sans export/import.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
