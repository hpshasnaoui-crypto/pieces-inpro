const fs = require('fs')
const path = require('path')

// Lit l'entete GLB, extrait le JSON, puis mesure chaque image embarquee
// en lisant directement les entetes PNG (IHDR) et JPEG (SOFn).
function dimsPNG(buf, off) {
  // signature 8 octets, puis longueur(4) + "IHDR"(4) + largeur(4) + hauteur(4)
  return { w: buf.readUInt32BE(off + 16), h: buf.readUInt32BE(off + 20), fmt: 'png' }
}

function dimsJPEG(buf, off, len) {
  let p = off + 2
  const end = off + len
  while (p < end - 9) {
    if (buf[p] !== 0xff) { p++; continue }
    const marker = buf[p + 1]
    // SOF0..SOF3, SOF5..SOF7, SOF9..SOF11, SOF13..SOF15
    if (marker >= 0xc0 && marker <= 0xcf &&
        marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { h: buf.readUInt16BE(p + 5), w: buf.readUInt16BE(p + 7), fmt: 'jpeg' }
    }
    p += 2 + buf.readUInt16BE(p + 2)
  }
  return null
}

function inspecter(file) {
  const buf = fs.readFileSync(file)
  if (buf.readUInt32LE(0) !== 0x46546c67) throw new Error('pas un GLB : ' + file)

  // chunk 0 = JSON, chunk 1 = BIN
  const jsonLen = buf.readUInt32LE(12)
  const json = JSON.parse(buf.slice(20, 20 + jsonLen).toString('utf8'))
  const binOffset = 20 + jsonLen + 8

  const images = json.images || []
  const views = json.bufferViews || []
  const out = []

  for (const img of images) {
    if (img.bufferView === undefined) continue
    const v = views[img.bufferView]
    const off = binOffset + (v.byteOffset || 0)
    let d = null
    if (buf.readUInt32BE(off) === 0x89504e47) d = dimsPNG(buf, off)
    else if (buf.readUInt16BE(off) === 0xffd8) d = dimsJPEG(buf, off, v.byteLength)
    out.push({
      w: d ? d.w : 0,
      h: d ? d.h : 0,
      fmt: d ? d.fmt : '?',
      octets: v.byteLength,
    })
  }

  // memoire GPU decodee : RGBA 4 octets/pixel, + ~33% si mipmaps
  const pixels = out.reduce((s, t) => s + t.w * t.h, 0)
  const gpuMo = (pixels * 4 * 1.33) / 1048576

  return {
    fichier: path.basename(file),
    tailleMo: buf.length / 1048576,
    textures: out.length,
    plusGrande: out.reduce((m, t) => Math.max(m, Math.max(t.w, t.h)), 0),
    gpuMo,
    detail: out,
  }
}

const dir = process.env.GLB_DIR || 'D:/inpro/public/models'
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.glb')).sort()
const cible = process.argv[2]

if (cible) {
  const r = inspecter(cible.includes('/') ? cible : path.join(dir, cible))
  console.log(r.fichier + ' — ' + r.tailleMo.toFixed(1) + ' Mo, ' + r.textures + ' textures')
  console.log('memoire GPU estimee : ' + r.gpuMo.toFixed(0) + ' Mo')
  console.log('detail :')
  for (const t of r.detail) {
    console.log('   ' + String(t.w + 'x' + t.h).padEnd(12) + t.fmt.padEnd(6)
      + (t.octets / 1048576).toFixed(2) + ' Mo')
  }
} else {
  let total = 0
  let pire = null
  console.log('fichier'.padEnd(28) + 'taille'.padEnd(10) + 'textures'.padEnd(10)
    + 'max px'.padEnd(9) + 'GPU estime')
  for (const f of files) {
    const r = inspecter(path.join(dir, f))
    total += r.gpuMo
    if (!pire || r.gpuMo > pire.gpuMo) pire = r
    console.log(r.fichier.replace('.glb', '').padEnd(28)
      + (r.tailleMo.toFixed(1) + ' Mo').padEnd(10)
      + String(r.textures).padEnd(10)
      + String(r.plusGrande).padEnd(9)
      + r.gpuMo.toFixed(0) + ' Mo')
  }
  console.log('')
  console.log('moyenne GPU : ' + (total / files.length).toFixed(0) + ' Mo par modele')
  console.log('pire cas    : ' + pire.fichier + ' a ' + pire.gpuMo.toFixed(0) + ' Mo')
}
