# Vignettes (posters)

L'accueil affiche des images WebP (`public/posters/`) et non les modeles 3D.
Sans elles, la page d'accueil devrait telecharger ~686 Mo de `.glb`.
Les vignettes servent aussi de `poster` sur les pages pieces : l'apercu
s'affiche instantanement pendant le chargement du modele.

## Regenerer toutes les vignettes

1. Demarrer le serveur de dev
2. Ouvrir <http://localhost:5173/gen-posters.html?i=0>

La page traite les pieces de `src/pieces.js` une par une, se recharge entre
chaque modele, et affiche `TERMINE 40/40` a la fin.

Pour n'en refaire qu'une seule : `?i=<index>&auto=0`.

## Pourquoi three.js et pas model-viewer

`gen-posters.html` fait le rendu avec three.js directement, en appelant
`renderer.render()` explicitement, au lieu de capturer un `<model-viewer>`.

Raison : model-viewer dessine dans une boucle `requestAnimationFrame`. Quand
l'onglet n'est pas visible (panneau replie, onglet en arriere-plan), le
navigateur suspend `requestAnimationFrame` : le canvas n'est jamais peint et
`toBlob()` renvoie une image vide de ~1,3 Ko. Un rendu explicite ne depend pas
du compositeur et fonctionne onglet masque.

Le cadrage reproduit le reglage par defaut de model-viewer (`camera-orbit`
`0deg 75deg`, distance ajustee a la sphere englobante), pour que la vignette
coincide avec la premiere image du modele sur la page piece.

## Verifier qu'aucune vignette n'est vide ou dupliquee

```bash
cd public/posters && ls -la *.webp | awk '$5 < 3000 {print "VIDE: "$9}'
```

```bash
cd public/posters && md5sum *.webp | awk '{print $1}' | sort | uniq -d
```

Aucune sortie dans les deux cas = tout va bien.

## Comment ca marche

`gen-posters.html` (racine du projet) POSTe chaque capture vers
`/__poster/<slug>`, un endpoint fourni par le plugin `posterWriter` de
`vite.config.js`. Ce plugin est en `apply: 'serve'` : il n'existe qu'en dev,
jamais dans le build. `gen-posters.html` n'est pas non plus inclus dans
`dist/` (Vite ne build que `index.html`).

## Dependance three.js

`gen-posters.html` importe `three`, qui est une dependance transitive de
`@google/model-viewer` (presente dans `node_modules`, non declaree dans
`package.json`). C'est sans risque pour la production, puisque ce fichier
n'est jamais build. Si un jour l'import echoue apres un `npm install`, il
suffit d'ajouter `three` en devDependency.
