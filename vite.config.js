import { defineConfig } from "vite";
import { copyFileSync } from "node:fs";
import { resolve } from "node:path";

// app.js and v3.js intentionally remain classic scripts because they share
// browser-global functions and data. Vite leaves classic script tags external,
// so copy those files into the production output directory explicitly.
export default defineConfig({
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
});
