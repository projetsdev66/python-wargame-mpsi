# Python Wargame MPSI

Application web en français pour apprendre Python avec des défis progressifs. Le site est dans `artifacts/python-wargame/`; son guide de développement et d’ajout de niveaux se trouve dans `artifacts/python-wargame/README.md`.

## Démarrer et vérifier

```sh
pnpm install --frozen-lockfile
pnpm --filter @workspace/python-wargame run dev
pnpm --filter @workspace/python-wargame run typecheck
pnpm --filter @workspace/python-wargame run build
```

Le déploiement Vercel est configuré depuis la racine du dépôt avec `vercel.json`. L’application est statique et ne demande ni compte ni base de données.
