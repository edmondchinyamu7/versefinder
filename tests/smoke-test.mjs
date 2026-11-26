import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

for (const file of ["app.js", "v3.js", "study.js", "platform.js", "sw.js", "tests/smoke-test.mjs"]) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  assert.equal(result.status, 0, `${file} syntax check failed: ${result.stderr}`);
}
const [html, manifestText, serviceWorker, reader, readme, app, styles, study, platform] = await Promise.all([
  readFile("index.html", "utf8"),
  readFile("manifest.webmanifest", "utf8"),
  readFile("sw.js", "utf8"),
  readFile("v3.js", "utf8"),
  readFile("README.md", "utf8"),
  readFile("app.js", "utf8"),
  readFile("styles.css", "utf8"),
  readFile("study.js", "utf8"),
  readFile("platform.js", "utf8")
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
assert.ok(serviceWorker.includes('"./study.js"'), "study tools must be included in the offline app shell");
assert.ok(html.includes('src="study.js"'), "personal study tools must be loaded");
assert.ok(html.includes('src="platform.js"'), "platform enhancements must be loaded");
const allViewsSelector = String.fromCharCode(36, 36, 40, 34, 46, 118, 105, 101, 119, 34, 41) + ".forEach";
const singleViewSelector = String.fromCharCode(36, 40, 34, 46, 118, 105, 101, 119, 34, 41) + ".forEach";
const navigationSource = app.slice(app.indexOf("function navigate"), app.indexOf("window.navigate"));
assert.ok(navigationSource.includes(allViewsSelector), "navigation must use the all-elements selector for every view");
assert.ok(!navigationSource.replace(allViewsSelector, "").includes(singleViewSelector), "navigation must not call forEach on the single-element selector");
assert.ok(html.includes('class="skip-link"'), "keyboard users must have a skip link");
assert.ok(html.includes('id="installApp"'), "install prompt control must exist");
assert.ok(styles.includes("@media(prefers-reduced-motion:reduce)"), "reduced-motion preferences must be respected");
assert.ok(platform.includes("beforeinstallprompt"), "PWA install prompt must be supported");
assert.ok(platform.includes("serviceWorker"), "service-worker updates must be handled");
assert.ok(study.includes("vf_collections"), "custom verse collections must be stored locally");
assert.ok(study.includes("VerseFinder study backup"), "personal study backup export and restore must be supported");
assert.ok(study.includes("exportStudyData") && study.includes("importStudyData"), "backup controls must be wired");
assert.ok(app.includes("data-edit-journal"), "journal entries must support editing");
assert.ok(app.includes("data-collection-verse"), "verse cards must offer collection saving");
assert.ok(reader.includes("readerDownloadBook"), "reader must offer a book download for offline use");
assert.ok(reader.includes("fetchKjvBook"), "reader must load real KJV book data");
assert.ok(app.includes('const BIBLE_BOOK_FILE_IDS=["Gen","Exod"'), "KJV loader must map English book names to OSIS filenames");
assert.ok(app.includes('data.englishName||data.name||name'), "KJV parser must display the full English book name");
assert.ok(app.includes('encodeURIComponent(fileId)+".json"'), "KJV loader must request the mapped book file");

assert.ok(reader.includes("vf_notes"), "reader notes must be stored locally");
assert.ok(reader.includes("async function moveChapter(direction)"), "reader must support cross-book navigation");
assert.ok(reader.includes("readerVerseNumber"), "reader must provide direct verse navigation");
assert.ok(reader.includes("window.vfOpenReference"), "reader must open a verse reference directly");
assert.ok(app.includes('data-open-ref="${escapeHtml(v.ref)}"'), "verse search cards must link into the reader");
assert.ok(app.includes("window.vfOpenReference(reference)"), "search results must open the selected reference in the reader");
assert.ok(reader.includes("scrollIntoView"), "direct verse navigation must bring the selected verse into view");
assert.ok(styles.includes(".reader-jump-label"), "reader verse navigation must have dedicated responsive styles");
assert.ok(app.includes("Continue in hope"), "30-day reading plan must be included");
assert.ok(readme.includes("permission is required"), "copyright boundary must be documented");
console.log("VerseFinder 3.0 smoke tests passed.");
