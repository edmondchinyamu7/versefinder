import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

for (const file of ["app.js", "v3.js", "sw.js", "tests/smoke-test.mjs"]) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  assert.equal(result.status, 0, `${file} syntax check failed: ${result.stderr}`);
}
const [html, manifestText, serviceWorker, reader, readme, app] = await Promise.all([
  readFile("index.html", "utf8"),
  readFile("manifest.webmanifest", "utf8"),
  readFile("sw.js", "utf8"),
  readFile("v3.js", "utf8"),
  readFile("README.md", "utf8"),
  readFile("app.js", "utf8")
]);
const manifest = JSON.parse(manifestText);
assert.ok(html.includes('rel="manifest"'), "manifest must be linked");
assert.ok(html.includes('src="v3.js"'), "reader script must be loaded");
assert.ok(!html.includes("\\n"), "HTML must not contain escaped line-break text");
assert.equal(manifest.name, "VerseFinder 3.0");
assert.equal(manifest.display, "standalone");
assert.ok(manifestText.includes("icon.svg"), "install icon must be configured");
assert.ok(serviceWorker.includes("addAll(APP_SHELL)"), "offline shell must be cached");
assert.ok(serviceWorker.includes('key.startsWith("versefinder-")'), "service worker must preserve unrelated origin caches");
assert.ok(serviceWorker.includes('addEventListener("fetch"'), "offline fetch handler must exist");
assert.ok(reader.includes("fetchKjvBook"), "reader must load real KJV book data");
assert.ok(reader.includes("vf_notes"), "reader notes must be stored locally");
assert.ok(reader.includes("async function moveChapter(direction)"), "reader must support cross-book navigation");
assert.ok(app.includes("Continue in hope"), "30-day reading plan must be included");
assert.ok(readme.includes("permission is required"), "copyright boundary must be documented");
console.log("VerseFinder 3.0 smoke tests passed.");
