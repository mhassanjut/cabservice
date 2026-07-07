import { removeBackground } from '@imgly/background-removal-node'
import { execFileSync } from 'node:child_process'
import { mkdirSync, readdirSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import sharp from 'sharp'

const destDir = join(process.cwd(), 'public', 'img', 'vehicles')
const rawDir = join(destDir, '_raw')
const curl = process.platform === 'win32' ? 'curl.exe' : 'curl'

/** Real photographs — studio/clean shots work best with ML matting. */
const vehicleImageSources = [
  {
    dest: 'mercedes-vito-van.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/2019_Mercedes-Benz_Vito_Tourer_SELECT_119_BlueTec_2.1.jpg/1280px-2019_Mercedes-Benz_Vito_Tourer_SELECT_119_BlueTec_2.1.jpg',
    backendName: 'Mercedes Vito Van',
    verifiedModel: 'Mercedes-Benz Vito Tourer W447',
    author: 'Vauxford',
    commonsUrl: 'https://commons.wikimedia.org/wiki/File:2019_Mercedes-Benz_Vito_Tourer_SELECT_119_BlueTec_2.1.jpg',
  },
  {
    dest: 'mercedes-v-class.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Mercedes-Benz_V-Class_%28W447%29_at_IAA_2019_IMG_0680.jpg/1280px-Mercedes-Benz_V-Class_%28W447%29_at_IAA_2019_IMG_0680.jpg',
    backendName: 'Mercedes V Class',
    verifiedModel: 'Mercedes-Benz V-Class W447',
    author: 'Alexander Migl',
    commonsUrl: 'https://commons.wikimedia.org/wiki/File:Mercedes-Benz_V-Class_(W447)_at_IAA_2019_IMG_0680.jpg',
  },
  {
    dest: 'mercedes-van-8-passenger.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Mercedes-Benz_Sprinter_Tourer_VS30_Black_%281%29.jpg/1280px-Mercedes-Benz_Sprinter_Tourer_VS30_Black_%281%29.jpg',
    backendName: 'Mercedes Van',
    verifiedModel: 'Mercedes-Benz Sprinter Tourer VS30',
    author: 'Damian B Oh',
    commonsUrl: 'https://commons.wikimedia.org/wiki/File:Mercedes-Benz_Sprinter_Tourer_VS30_Black_(1).jpg',
  },
  {
    dest: 'mercedes-e-class.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/2016_Mercedes-Benz_E220d_AMG_Line_Premium%2B_2.0_Front.jpg/1280px-2016_Mercedes-Benz_E220d_AMG_Line_Premium%2B_2.0_Front.jpg',
    backendName: 'Mercedes E Class',
    verifiedModel: 'Mercedes-Benz E-Class W213',
    author: 'Vauxford',
    commonsUrl: 'https://commons.wikimedia.org/wiki/File:2016_Mercedes-Benz_E220d_AMG_Line_Premium%2B_2.0_Front.jpg',
  },
  {
    dest: 'mercedes-s-class.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/2019_Mercedes-Benz_S350d_L_AMG_Line_Executive_3.0_Front.jpg/1280px-2019_Mercedes-Benz_S350d_L_AMG_Line_Executive_3.0_Front.jpg',
    backendName: 'Mercedes S Class',
    verifiedModel: 'Mercedes-Benz S-Class W222',
    author: 'Vauxford',
    commonsUrl: 'https://commons.wikimedia.org/wiki/File:2019_Mercedes-Benz_S350d_L_AMG_Line_Executive_3.0_Front.jpg',
  },
  {
    dest: 'tesla-model-s.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/2017_Tesla_Model_S_75D_Front.jpg/1280px-2017_Tesla_Model_S_75D_Front.jpg',
    backendName: 'Tesla Model S',
    verifiedModel: 'Tesla Model S',
    author: 'Vauxford',
    commonsUrl: 'https://commons.wikimedia.org/wiki/File:2017_Tesla_Model_S_75D_Front.jpg',
  },
  {
    dest: 'hyundai-ioniq.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Hyundai_Ioniq_Electric_%28front%29.jpg/1280px-Hyundai_Ioniq_Electric_%28front%29.jpg',
    backendName: 'Hyundai Ionic',
    verifiedModel: 'Hyundai Ioniq Electric',
    author: 'M 93',
    commonsUrl: 'https://commons.wikimedia.org/wiki/File:Hyundai_Ioniq_Electric_(front).jpg',
  },
  {
    dest: 'toyota-corolla-familiar.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Toyota_Corolla_Touring_Sports_Hybrid_%28E210%29_IMG_2661.jpg/1280px-Toyota_Corolla_Touring_Sports_Hybrid_%28E210%29_IMG_2661.jpg',
    backendName: 'Toyota Corolla Familiar',
    verifiedModel: 'Toyota Corolla Touring Sports estate',
    author: 'Alexander Migl',
    commonsUrl: 'https://commons.wikimedia.org/wiki/File:Toyota_Corolla_Touring_Sports_Hybrid_(E210)_IMG_2661.jpg',
  },
]

function sleep(ms) {
  execFileSync(
    process.platform === 'win32' ? 'powershell' : 'sleep',
    process.platform === 'win32' ? ['-Command', `Start-Sleep -Milliseconds ${ms}`] : [`${Math.ceil(ms / 1000)}`],
    { stdio: 'pipe' },
  )
}

function download(url, destPath) {
  execFileSync(curl, ['-L', '-A', 'STWMoversFleetSync/1.0', '-o', destPath, url], { stdio: 'pipe' })
  const size = statSync(destPath).size
  if (size < 5000) throw new Error(`Too small (${size}b): ${url}`)
}

function downloadWithRetry(url, destPath) {
  let lastErr
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      download(url, destPath)
      return
    } catch (err) {
      lastErr = err
      if (attempt < 2) sleep(1500)
    }
  }
  throw lastErr
}

/** ML matting: remove backdrop, composite car cutout onto pure white. */
async function replaceCarBackdropWithWhite(rawPath, outputPath) {
  const relInput = relative(process.cwd(), rawPath).replace(/\\/g, '/')

  const blob = await removeBackground(relInput, {
    model: 'medium',
    output: { format: 'image/png', type: 'foreground' },
  })

  const cutout = Buffer.from(await blob.arrayBuffer())
  const meta = await sharp(cutout).metadata()
  if (!meta.width || !meta.height) throw new Error('Invalid cutout dimensions')

  await sharp({
    create: {
      width: meta.width,
      height: meta.height,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([{ input: cutout }])
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(outputPath)
}

mkdirSync(destDir, { recursive: true })
mkdirSync(rawDir, { recursive: true })

for (const old of readdirSync(destDir)) {
  if (/\.(jpg|jpeg|webp|png)$/i.test(old) && !old.startsWith('_')) {
    unlinkSync(join(destDir, old))
  }
}

const deployed = []

for (const item of vehicleImageSources) {
  const rawPath = join(rawDir, item.dest)
  const destPath = join(destDir, item.dest)
  try {
    downloadWithRetry(item.url, rawPath)
    await replaceCarBackdropWithWhite(rawPath, destPath)
    deployed.push({ ...item, imagePath: `/img/vehicles/${item.dest}` })
    console.log(`OK ${item.dest} — ${item.verifiedModel}`)
  } catch (err) {
    console.error(`FAIL ${item.dest}: ${err.message}`)
  }
}

if (deployed.length < 8) throw new Error(`Only ${deployed.length}/8 images processed`)

writeFileSync(
  join(destDir, 'ATTRIBUTION.md'),
  `# Fleet vehicle images\n\nReal photographs from Wikimedia Commons (CC BY-SA 4.0). Background removed with ML matting; car placed on white.\n\n| File | Backend | Verified model | Photographer |\n|------|---------|----------------|--------------|\n${deployed.map((d) => `| ${d.dest} | ${d.backendName} | ${d.verifiedModel} | [${d.author}](${d.commonsUrl}) |`).join('\n')}\n`,
)

console.log('\nAll 8 fleet photos processed — car cutout on white backdrop.')
