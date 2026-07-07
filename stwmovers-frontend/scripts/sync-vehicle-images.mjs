import { copyFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'

/** Copy verified vehicle SVGs from Downloads into Nuxt public static assets. */
const srcDir = String.raw`C:\Users\mhassan.nasir\Downloads\stwmovers images`
const destDir = join(process.cwd(), 'public', 'img', 'vehicles')

const mapping = {
  'mercedes-vito-van.svg': 'Mercedes Vito van.svg',
  'mercedes-v-class.svg': 'Mercedes V class 2.svg',
  'mercedes-van-8-passenger.svg': 'Mercedes 8-passenger van.svg',
  'mercedes-e-class.svg': 'Classic Mercedes E-Class.svg',
  'mercedes-s-class.svg': 'Mercedes S-Class.svg',
  'tesla-model-s.svg': 'Tesla Model S.svg',
  'hyundai-ioniq.svg': 'Hyundai Ionic.svg',
  'toyota-corolla-familiar.svg': 'Toyota Corolla.svg',
}

mkdirSync(destDir, { recursive: true })

for (const legacy of ['van.svg', 'comfort.svg', 'eco.svg']) {
  try {
    unlinkSync(join(destDir, legacy))
    console.log(`removed legacy ${legacy}`)
  } catch {
    /* ignore */
  }
}

for (const [destName, sourceName] of Object.entries(mapping)) {
  const sourcePath = join(srcDir, sourceName)
  const destPath = join(destDir, destName)
  copyFileSync(sourcePath, destPath)
  console.log(`${sourceName} -> public/img/vehicles/${destName}`)
}

const destFiles = readdirSync(destDir).sort()
console.log('\nDeployed assets:', destFiles.join(', '))
