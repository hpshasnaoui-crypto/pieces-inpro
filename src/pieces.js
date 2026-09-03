// Registre des pieces : 5 modeles x 4 profiles x 2 packs = 40 pieces.
// Source des modeles : 'glb files 02-09/'. Source des packs : 'pack meuble de bain.xlsx'.
//
// Pour ajouter une piece :
//   1. deposer le .glb dans public/models/ (nom de fichier = slug)
//   2. ajouter une entree ci-dessous
//   3. generer sa vignette : ouvrir /gen-posters.html?i=0 (voir POSTERS.md)
// La page /piece/<slug> est creee automatiquement.

export const MODELES = ["aura","ayra","luma","nexa","nova"]

// Composition de chaque pack, par profile (relevee dans le fichier Excel).
export const COMPOSITION_PACKS = {
  'noir': {
    1: { marbre: 'blanc', verre: 'noir', mdf: 'cemento' },
    2: { marbre: 'jaune', verre: 'bronze', mdf: 'blanc' },
  },
  'iconica': {
    1: { marbre: 'blanc', verre: 'noir', mdf: 'blanc' },
    2: { marbre: 'jaune', verre: 'bronze', mdf: 'blanc' },
  },
  'anodise bronze': {
    1: { marbre: 'blanc', verre: 'noir', mdf: 'blanc' },
    2: { marbre: 'blanc', verre: 'bronze', mdf: 'blanc' },
  },
  'anodise champagne': {
    1: { marbre: 'blanc', verre: 'noir', mdf: 'blanc' },
    2: { marbre: 'jaune', verre: 'bronze', mdf: 'blanc' },
  },
}

//  = le nom du fichier .glb d'origine etait incomplet, le
// profile et le pack ont ete deduits de la grille 4 profiles x 2 packs.
// A confirmer : nexa-noir-jauneglb, nova-anbr, nova-noir, nova-jaune.
const definitions = [
  { slug: "aura-anbr-noir", model: "aura", profil: "anodise bronze", pack: 1 },
  { slug: "aura-anbr-bronze", model: "aura", profil: "anodise bronze", pack: 2 },
  { slug: "aura-anch-blanc", model: "aura", profil: "anodise champagne", pack: 1 },
  { slug: "aura-anch-jaune", model: "aura", profil: "anodise champagne", pack: 2 },
  { slug: "aura-iconica-blanc", model: "aura", profil: "iconica", pack: 1 },
  { slug: "aura-iconica-jaune", model: "aura", profil: "iconica", pack: 2 },
  { slug: "aura-noir-blanc", model: "aura", profil: "noir", pack: 1 },
  { slug: "aura-noir-jaune", model: "aura", profil: "noir", pack: 2 },
  { slug: "ayra-anbr-noir", model: "ayra", profil: "anodise bronze", pack: 1 },
  { slug: "ayra-anbr-bronze", model: "ayra", profil: "anodise bronze", pack: 2 },
  { slug: "ayra-anch-noir", model: "ayra", profil: "anodise champagne", pack: 1 },
  { slug: "ayra-anch-bronze", model: "ayra", profil: "anodise champagne", pack: 2 },
  { slug: "ayra-iconica-noir", model: "ayra", profil: "iconica", pack: 1 },
  { slug: "ayra-iconica-bronze", model: "ayra", profil: "iconica", pack: 2 },
  { slug: "ayra-noir-noir", model: "ayra", profil: "noir", pack: 1 },
  { slug: "ayra-noir-bronze", model: "ayra", profil: "noir", pack: 2 },
  { slug: "luma-anbr-noir", model: "luma", profil: "anodise bronze", pack: 1 },
  { slug: "luma-anbr-bronze", model: "luma", profil: "anodise bronze", pack: 2 },
  { slug: "luma-anch-noir", model: "luma", profil: "anodise champagne", pack: 1 },
  { slug: "luma-anch-bronze", model: "luma", profil: "anodise champagne", pack: 2 },
  { slug: "luma-iconica-noir", model: "luma", profil: "iconica", pack: 1 },
  { slug: "luma-iconica-bronze", model: "luma", profil: "iconica", pack: 2 },
  { slug: "luma-noir-noir", model: "luma", profil: "noir", pack: 1 },
  { slug: "luma-noir-bronze", model: "luma", profil: "noir", pack: 2 },
  { slug: "nexa-anbr-noir", model: "nexa", profil: "anodise bronze", pack: 1 },
  { slug: "nexa-anbr-bronze", model: "nexa", profil: "anodise bronze", pack: 2 },
  { slug: "nexa-anch-blanc", model: "nexa", profil: "anodise champagne", pack: 1 },
  { slug: "nexa-anch-jaune", model: "nexa", profil: "anodise champagne", pack: 2 },
  { slug: "nexa-iconica-blanc", model: "nexa", profil: "iconica", pack: 1 },
  { slug: "nexa-iconica-jaune", model: "nexa", profil: "iconica", pack: 2 },
  { slug: "nexa-noir-blanc", model: "nexa", profil: "noir", pack: 1 },
  { slug: "nexa-noir-jauneglb", model: "nexa", profil: "noir", pack: 2, deduit: true },
  { slug: "nova-anbr-noir", model: "nova", profil: "anodise bronze", pack: 1 },
  { slug: "nova-anbr", model: "nova", profil: "anodise bronze", pack: 2, deduit: true },
  { slug: "nova-anch-blanc", model: "nova", profil: "anodise champagne", pack: 1 },
  { slug: "nova-anch-jaune", model: "nova", profil: "anodise champagne", pack: 2 },
  { slug: "nova-icon-blanc", model: "nova", profil: "iconica", pack: 1 },
  { slug: "nova-icon-jaune", model: "nova", profil: "iconica", pack: 2 },
  { slug: "nova-noir", model: "nova", profil: "noir", pack: 1, deduit: true },
  { slug: "nova-jaune", model: "nova", profil: "noir", pack: 2, deduit: true },
]

export const pieces = definitions.map((d) => ({
  ...d,
  name: `${d.profil} - pack ${d.pack}`,
  src: `${import.meta.env.BASE_URL}models/${d.slug}.glb`,
  poster: `${import.meta.env.BASE_URL}posters/${d.slug}.webp`,
  // Chemin d'un .usdz, requis pour l'AR sur iPhone (Quick Look ne lit pas
  // le .glb). Laisser null tant que le fichier n'existe pas.
  iosSrc: null,
  alt: `${d.model} ${d.profil} pack ${d.pack} en 3D`,
}))

export function findPiece(slug) {
  return pieces.find((piece) => piece.slug === slug)
}

export function piecesParModele(modele) {
  return pieces.filter((piece) => piece.model === modele)
}
