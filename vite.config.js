const { copyFileSync } = require("node:fs");
const { resolve } = require("node:path");

// Keep these as classic scripts because app.js and v3.js share browser globals.
// Vite leaves classic script tags external, so copy them into dist explicitly.
module.exports = {
  plugins: [
    {
      name: "copy-versefinder-classic-scripts",
      closeBundle() {
        const root = process.cwd();
        const output = resolve(root, "dist");
        for (const file of ["app.js", "v3.js", "sw.js"]) {
          copyFileSync(resolve(root, file), resolve(output, file));
        }
      }
    }
  ]
};
