import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const files = ["app.js", "v3.js", "sw.js"];
for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  assert.equal(result.status, 0, `${file} syntax check failed: ${result.stderr}`);
}
const [html, manifestText, serviceWorker, reader, readme, app] = await Promise.all([
  readFile("index.html", "utf8"),
  readFile("manifest.webmanifest", "utf8"),
  readFile("sw.js", "utf8"),
  readFile("v3.js", "utf8"),
  readFile("README.md", "utf8")
]);
const manifest = JSON.parse(manifestText);
assert.match(html, /rel="manifest"/, "manifest must be linked");
assert.match(html, /src="v3\.js"/, "reader script must be loaded");
assert.doesNotMatch(html, /\\\\n/, "HTML must not contain escaped line-break text");
assert.equal(manifest.name, "VerseFinder 3.0");
assert.equal(manifest.display, "standalone");
assert.match(serviceWorker, /addAll\(APP_SHELL\)/, "offline shell must be cached");
assert.match(serviceWorker, /addEventListener\("fetch"/, "offline fetch handler must exist");
assert.match(reader, /fetchKjvBook/, "reader must load real KJV book data");
assert.match(reader, /vf_notes/, "reader notes must be stored locally");\nassert.match(app, /Continue in hope/, "30-day reading plan must be included");\nassert.match(manifestText, /icon\\.svg/, "install icon must be configured");
assert.match(readme, /Chichewa Bible[\s\S]*permission/i, "copyright boundary must be documented");
console.log("VerseFinder 3.0 smoke tests passed.");
