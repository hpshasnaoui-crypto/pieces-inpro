import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const root = dirname(fileURLToPath(import.meta.url))

// Le site est publie sur https://<user>.github.io/pieces-inpro/, donc les
// assets doivent etre prefixes. En dev on reste a la racine.
const BASE = '/pieces-inpro/'

// Plugin de DEV uniquement (apply: 'serve') : recoit les vignettes generees
// par gen-posters.html et les ecrit dans public/posters/. Voir POSTERS.md.
function posterWriter() {
  return {
    name: 'poster-writer',
    apply: 'serve',
    configureServer(server) {
      // .glb reencodes par gen-optimise.html, textures plafonnees.
      // Sortie dans un dossier a part pour ne pas ecraser les originaux
      // avant verification.
      server.middlewares.use('/__glb', async (req, res, next) => {
        if (req.method !== 'POST') return next()

        const name = (req.url || '').replace(/^\//, '')
        if (!/^[a-z0-9_-]+$/i.test(name)) {
          res.statusCode = 400
          return res.end('nom invalide')
        }

        const chunks = []
        for await (const chunk of req) chunks.push(chunk)

        const dir = resolve(root, 'models-opt')
        mkdirSync(dir, { recursive: true })
        writeFileSync(resolve(dir, name + '.glb'), Buffer.concat(chunks))

        res.statusCode = 200
        res.end('ok')
      })

      // Meme principe pour les .usdz generes par gen-usdz.html (AR iPhone).
      server.middlewares.use('/__usdz', async (req, res, next) => {
        if (req.method !== 'POST') return next()

        const name = (req.url || '').replace(/^\//, '')
        if (!/^[a-z0-9_-]+$/i.test(name)) {
          res.statusCode = 400
          return res.end('nom invalide')
        }

        const chunks = []
        for await (const chunk of req) chunks.push(chunk)

        const dir = resolve(root, 'public/models')
        mkdirSync(dir, { recursive: true })
        writeFileSync(resolve(dir, name + '.usdz'), Buffer.concat(chunks))

        res.statusCode = 200
        res.end('ok')
      })
      server.middlewares.use('/__poster', async (req, res, next) => {
        if (req.method !== 'POST') return next()

        const name = (req.url || '').replace(/^\//, '')
        if (!/^[a-z0-9_-]+$/i.test(name)) {
          res.statusCode = 400
          return res.end('nom invalide')
        }

        const chunks = []
        for await (const chunk of req) chunks.push(chunk)

        const dir = resolve(root, 'public/posters')
        mkdirSync(dir, { recursive: true })
        writeFileSync(resolve(dir, `${name}.webp`), Buffer.concat(chunks))

        res.statusCode = 200
        res.end('ok')
      })
    },
  }
}

// GitHub Pages ne sait pas reecrire les URLs vers index.html. Sans ca, ouvrir
// ou rafraichir /piece/<slug> renvoie une 404. Servir une copie d'index.html
// en 404.html laisse React Router prendre la main : l'URL reste intacte,
// seul le code HTTP change.
function spaFallback() {
  return {
    name: 'spa-fallback-404',
    apply: 'build',
    closeBundle() {
      const out = resolve(root, 'dist')
      copyFileSync(resolve(out, 'index.html'), resolve(out, '404.html'))
    },
  }
}

// `vite`                -> http://localhost:5173 (desktop)
// `vite --mode mobile`  -> https://<ip-du-pc>:5173 (requis pour l'AR sur telephone)
export default defineConfig(({ command, mode }) => {
  const mobile = mode === 'mobile'

  return {
    base: command === 'build' ? BASE : '/',
    plugins: [
      react(),
      posterWriter(),
      spaFallback(),
      ...(mobile ? [basicSsl()] : []),
    ],
    server: mobile ? { host: true, port: 5173 } : undefined,
  }
})
