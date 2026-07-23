/**
 * One-off (re-runnable) optimizer for homepage imagery.
 *
 * Many files under public/img/home were exported as PNG data but saved with a
 * `.jpg` extension, so photographic banners weighed 1.5–3.7 MB each. This script
 * resizes them to realistic display dimensions and re-encodes them in a format
 * matching their extension (so all existing references keep working, and
 * @nuxt/image / IPX can still generate WebP/AVIF on top).
 *
 * Originals are backed up to public/img/home/_original/ on first run.
 *
 * Usage: node scripts/optimize-home-images.mjs
 */
import sharp from 'sharp'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const HOME_DIR = path.resolve('public/img/home')
const BACKUP_DIR = path.join(HOME_DIR, '_original')

// Max render width per image group (undefined = don't resize, just re-encode).
function maxWidthFor(name) {
  if (name.startsWith('corporate-banner')) return 1600
  if (name.startsWith('hero')) return 1440
  if (name.startsWith('location-')) return 1200
  if (name.startsWith('journey-')) return 500
  if (name.startsWith('experience-')) return 760
  if (name.startsWith('cta-banner')) return 1000
  return undefined
}

// Skip small assets (icons, tiny accents) that aren't worth touching.
const MIN_BYTES = 120 * 1024

async function ensureBackup(srcPath, name) {
  const backupPath = path.join(BACKUP_DIR, name)
  try {
    await fs.access(backupPath)
  } catch {
    await fs.copyFile(srcPath, backupPath)
  }
}

async function run() {
  await fs.mkdir(BACKUP_DIR, { recursive: true })
  const entries = await fs.readdir(HOME_DIR, { withFileTypes: true })

  let before = 0
  let after = 0

  for (const entry of entries) {
    if (!entry.isFile()) continue
    const name = entry.name
    if (!/\.(jpe?g|png)$/i.test(name)) continue

    const srcPath = path.join(HOME_DIR, name)
    const stat = await fs.stat(srcPath)
    if (stat.size < MIN_BYTES) continue

    await ensureBackup(srcPath, name)
    const backupPath = path.join(BACKUP_DIR, name)

    const ext = path.extname(name).toLowerCase()
    const maxWidth = maxWidthFor(name)

    let pipeline = sharp(backupPath).rotate()
    const meta = await pipeline.metadata()
    if (maxWidth && meta.width && meta.width > maxWidth) {
      pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true })
    }

    if (ext === '.png') {
      // Hero art is photographic PNG; palette quantization keeps it small while
      // IPX still serves true-color WebP to modern browsers.
      pipeline = pipeline.png({ compressionLevel: 9, palette: true, quality: 82, effort: 8 })
    } else {
      pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true })
    }

    const buf = await pipeline.toBuffer()
    await fs.writeFile(srcPath, buf)

    before += stat.size
    after += buf.length
    console.log(
      `${name.padEnd(34)} ${(stat.size / 1024).toFixed(0).padStart(6)} KB -> ${(buf.length / 1024).toFixed(0).padStart(5)} KB`,
    )
  }

  console.log('\nTotal: %d KB -> %d KB (saved %d KB)',
    Math.round(before / 1024), Math.round(after / 1024), Math.round((before - after) / 1024))
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
