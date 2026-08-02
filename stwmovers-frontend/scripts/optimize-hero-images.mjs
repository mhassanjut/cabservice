/**
 * One-shot (re-runnable) conversion of large masters to WebP for production use.
 * Sources stay in _original/, assets/, or alongside; outputs go under public/.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/** @type {Array<{ input: string; output: string; maxWidth?: number }>} */
const jobs = [
  {
    input: 'public/img/home/_original/hero-1.png',
    output: 'public/img/home/hero-1.webp',
    maxWidth: 1440,
  },
  {
    input: 'public/img/home/_original/hero-2.png',
    output: 'public/img/home/hero-2.webp',
    maxWidth: 1440,
  },
  {
    input: 'public/img/home/_original/hero-3.png',
    output: 'public/img/home/hero-3.webp',
    maxWidth: 1440,
  },
  {
    input: 'public/img/home/_original/corporate-banner.jpg',
    output: 'public/img/home/corporate-banner.webp',
    maxWidth: 1600,
  },
  {
    input: 'assets/images/tour-page/hero-image.png',
    output: 'public/img/tours/hero.webp',
    maxWidth: 1600,
  },
]

const vehicleNames = [
  'mercedes-vito-van',
  'mercedes-v-class',
  'mercedes-van-8-passenger',
  'mercedes-e-class',
  'mercedes-s-class',
  'tesla-model-s',
  'hyundai-ioniq',
  'toyota-corolla-familiar',
]

for (const name of vehicleNames) {
  jobs.push({
    input: `public/img/vehicles/${name}.png`,
    output: `public/img/vehicles/${name}.webp`,
    maxWidth: 1200,
  })
}

/** Homepage fleet carousel — rasterize large SVG masters to WebP (keep SVG under _original/). */
const fleetSectionSvgs = [
  ['Mercedes E Class 2.svg', 'mercedes-e-class.webp'],
  ['Mercedes S Class 2.svg', 'mercedes-s-class.webp'],
  ['Mercedes V Class 2.svg', 'mercedes-v-class.webp'],
  ['Mercedes Vito Van 2.svg', 'mercedes-vito-van.webp'],
  ['Mercedes Van 2.svg', 'mercedes-van.webp'],
  ['Tesla Model S 2.svg', 'tesla-model-s.webp'],
  ['Hyundai Ioniq 2.svg', 'hyundai-ioniq.webp'],
  ['Toyota Corolla Familiar 2.svg', 'toyota-corolla-familiar.webp'],
  ['BYD SEAL 2.svg', 'byd-seal.webp'],
]

for (const [svgName, webpName] of fleetSectionSvgs) {
  jobs.push({
    input: `public/img/home/fleet-section/_original/${svgName}`,
    output: `public/img/home/fleet-section/${webpName}`,
    maxWidth: 900,
  })
}

async function convert({ input, output, maxWidth }) {
  const inputPath = path.join(root, input)
  const outputPath = path.join(root, output)

  if (!fs.existsSync(inputPath)) {
    console.warn(`skip (missing): ${input}`)
    return
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })

  const isSvg = path.extname(inputPath).toLowerCase() === '.svg'
  let pipeline = sharp(inputPath, isSvg ? { density: 144 } : undefined)
  const meta = await pipeline.metadata()

  if (maxWidth && meta.width && meta.width > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true })
  }

  await pipeline
    .webp({ quality: 80, effort: 4 })
    .toFile(outputPath)

  const outStat = fs.statSync(outputPath)
  const inStat = fs.statSync(inputPath)
  console.log(
    `${output}: ${Math.round(inStat.size / 1024)}KB → ${Math.round(outStat.size / 1024)}KB`,
  )
}

for (const job of jobs) {
  await convert(job)
}

console.log('Done.')
