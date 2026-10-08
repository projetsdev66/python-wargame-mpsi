# PyWargame MPSI — plan de mise à niveau

## Direction éditoriale

- **Mouvement** : atelier éditorial et carnet de laboratoire, plutôt qu’interface de jeu criarde.
- **Principes** : progression lisible, contraste sobre, repères typographiques précis, feedback immédiat.
- **Palette** : vert profond pour l’action et la réussite, ambre pour les indices et les accents, papier chaud pour réduire la fatigue de lecture.
- **Mise en page** : rail de progression persistant à gauche, contenu de leçon à droite, bordures et filets comme repères de cahier.
- **Signatures** : marque `Py` en bloc, gouttière de numéros de ligne, barre verticale ambre sur la leçon active.
- **Interaction** : l’état actif est signalé par couleur, bordure et texte ; les éléments verrouillés restent compréhensibles au clavier.
- **Typographie** : Space Grotesk pour les titres, DM Sans pour le texte, DM Mono pour le code et les métadonnées.

## Structure

- `src/data/levels/` : contenu théorique, exercices, tests et corrections.
- `src/components/` : coque éditoriale, navigation, théorie et espace de code.
- `src/lib/` et `src/workers/` : persistance locale et exécution Pyodide côté navigateur.
- `public/` : favicon, manifeste de routes et ressources statiques.

## Déploiement

Le dépôt reste la source de vérité. `vercel.json` configure l’installation pnpm, la commande de build et la réécriture SPA des pages `/niveau/:id`. Vercel doit être relié à la branche `main` pour reconstruire automatiquement après chaque push.
