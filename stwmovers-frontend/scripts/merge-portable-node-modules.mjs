/**
 * Copies portable/node_modules/* into ./node_modules (recursive, overwrite).
 * Use when registry installs fail or omit packages: populate portable/node_modules
 * from a working machine or backup (same layout as npm's node_modules).
 */
import { cpSync, existsSync, readdirSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const srcRoot = join(root, "portable", "node_modules");
const destRoot = join(root, "node_modules");

if (!existsSync(srcRoot)) {
  process.exit(0);
}

if (!existsSync(destRoot)) {
  mkdirSync(destRoot, { recursive: true });
}

let merged = 0;
for (const ent of readdirSync(srcRoot, { withFileTypes: true })) {
  const from = join(srcRoot, ent.name);
  const to = join(destRoot, ent.name);
  cpSync(from, to, { recursive: true, force: true });
  merged += 1;
}

if (merged > 0) {
  console.info(`[merge-portable] Merged ${merged} top-level package(s) from portable/node_modules.`);
}
