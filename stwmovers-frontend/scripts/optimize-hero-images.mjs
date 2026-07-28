/**
 * One-shot (re-runnable) conversion of hero masters to WebP for production use.
 * Sources stay in _original/ or assets/; outputs go under public/.
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

async function convert({ input, output, maxWidth }) {
  const inputPath = path.join(root, input)
  const outputPath = path.join(root, output)

  if (!fs.existsSync(inputPath)) {
    console.warn(`skip (missing): ${input}`)
    return
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })

  let pipeline = sharp(inputPath)
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
