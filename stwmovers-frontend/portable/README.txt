Portable Node modules (offline / flaky registry)
================================================

1) Full tree copy (simplest)
   Copy a working node_modules subtree into:
     portable/node_modules/<package-name>/
   Same names as npm uses (including scoped folders like @foo).

   Then run:
     npm run install:portable
   This runs npm install, then overlays portable/node_modules on top.

2) Tarballs from a machine that has network
     npm run vendor:pack
   Produces portable/packages/*.tgz. Install a specific package with:
     npm install ./portable/packages/name-version.tgz

3) Existing backup folder
   If you already have a backup (e.g. node_modules__bak__...), copy the
   missing package directories into portable/node_modules and run:
     npm run merge-portable
