/**
 * Windows Application Control (Smart App Control / WDAC) can block unsigned
 * oxc native .node binaries. Nuxt falls back to WASI bindings when native load
 * fails, but npm skips wasm32 packages on x64 unless installed with --force.
 *
 * Native win32-x64-msvc bindings are declared in package.json; this script only
 * installs wasm32 fallbacks when those native packages are absent.
 */
import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const version = '0.140.0'
const nativePackages = [
  '@oxc-transform/binding-win32-x64-msvc',
  '@oxc-parser/binding-win32-x64-msvc',
  '@oxc-minify/binding-win32-x64-msvc',
]
const wasiPackages = [
  '@oxc-transform/binding-wasm32-wasi',
  '@oxc-parser/binding-wasm32-wasi',
  '@oxc-minify/binding-wasm32-wasi',
]

if (process.platform !== 'win32') {
  process.exit(0)
}

const nativePresent = nativePackages.every((name) =>
  existsSync(join(root, 'node_modules', name, 'package.json')),
)

if (nativePresent) {
  process.exit(0)
}

const missing = wasiPackages.filter((name) =>
  !existsSync(join(root, 'node_modules', name, 'package.json')),
)

if (missing.length === 0) {
  process.exit(0)
}

const specs = missing.map((name) => `${name}@${version}`).join(' ')
execSync(`npm install --no-save --force ${specs}`, { cwd: root, stdio: 'inherit' })
