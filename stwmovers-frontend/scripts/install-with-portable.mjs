/**
 * Runs npm install, then merges portable/node_modules on top.
 * If npm fails but required tooling resolves after merge, exits 0.
 */
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { join } from "node:path";
import { existsSync } from "node:fs";

const root = process.cwd();
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

function mergePortable() {
  const r = spawnSync(process.execPath, ["scripts/merge-portable-node-modules.mjs"], {
    cwd: root,
    stdio: "inherit",
    shell: false,
  });
  return r.status ?? 1;
}

function canResolveCoreDeps() {
  try {
    const require = createRequire(join(root, "package.json"));
    require.resolve("nuxt/package.json", { paths: [root] });
    require.resolve("vue/package.json", { paths: [root] });
    return true;
  } catch {
    return false;
  }
}

const install = spawnSync(npm, ["install", ...process.argv.slice(2)], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
  shell: false,
});

const installStatus = install.status ?? 1;
const mergeStatus = mergePortable();
if (mergeStatus !== 0) {
  process.exit(mergeStatus);
}

if (installStatus !== 0 && existsSync(join(root, "portable", "node_modules"))) {
  if (canResolveCoreDeps()) {
    console.info(
      "[install-with-portable] npm install reported errors, but Nuxt/Vue resolve after portable merge. Continuing with exit 0.",
    );
    process.exit(0);
  }
}

process.exit(installStatus);
