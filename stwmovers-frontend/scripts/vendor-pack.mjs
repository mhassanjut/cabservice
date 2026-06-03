/**
 * On a machine with network: packs direct dependencies into portable/packages/*.tgz
 * for offline use: npm install ./portable/packages/<name>.tgz (or merge full trees).
 */
import { readFileSync, mkdirSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const root = process.cwd();
const pkgPath = join(root, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const outDir = join(root, "portable", "packages");
mkdirSync(outDir, { recursive: true });

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const names = new Set([
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.devDependencies ?? {}),
]);

for (const name of names) {
  const spec = (pkg.dependencies ?? {})[name] ?? (pkg.devDependencies ?? {})[name];
  const arg = spec && !spec.startsWith("file:") && !spec.startsWith("link:")
    ? `${name}@${spec}`
    : name;
  const r = spawnSync(npm, ["pack", arg, `--pack-destination=${outDir}`], {
    cwd: root,
    stdio: "inherit",
    shell: false,
  });
  if ((r.status ?? 1) !== 0) {
    console.error(`[vendor-pack] Failed to pack: ${name}`);
    process.exit(r.status ?? 1);
  }
}

console.info(`[vendor-pack] Tarballs written to ${outDir}`);
