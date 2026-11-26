/* VerseFinder 3.0: Bible reader, study notes and offline app support. */
(() => {
  const $ = selector => document.querySelector(selector);
  const books = typeof BIBLE_BOOKS !== "undefined" ? BIBLE_BOOKS : [];
  const notes = (() => { try { return JSON.parse(localStorage.getItem("vf_notes") || "{}"); } catch { return {}; } })();
  let currentBook = "Genesis", currentChapter = 1, currentVerses = [], currentMaxChapter = 50;
  const section = document.createElement("section");
  section.className = "view";
  section.id = "view-reader";
  section.innerHTML = `
    <div class="page-intro"><div class="eyebrow">READ & REFLECT</div><h1>Read the Bible.</h1><p>Explore the King James Version, chapter by chapter. Downloaded chapters remain available on this device.</p></div>
    <div class="reader-toolbar">
      <label>Book <select id="readerBook" aria-label="Choose Bible book"></select></label>
      <label>Chapter <select id="readerChapter" aria-label="Choose chapter"></select></label>
      <button class="action-button" id="readerPrevious" type="button">← Previous</button>
      <button class="action-button" id="readerNext" type="button">Next →</button>
    </div>
    <div class="reader-status" id="readerStatus" role="status">Choose a book and chapter to begin.</div>
    <article class="reader-page"><h2 id="readerHeading">Genesis 1</h2><div id="readerVerses" class="reader-verses"></div></article>
    <div class="language-note"><strong>Chichewa Bible</strong><p>Buku Lopatulika is protected text. VerseFinder will only add its full text after permission and a suitable digital licence are confirmed.</p><a href="https://chichewa.bible/" target="_blank" rel="noopener noreferrer">Visit the Bible Society of Malawi's Chichewa Bible resource ↗</a></div>
  `;
  const main = document.querySelector("main.main");
  const footer = main && main.querySelector("footer");
  if (main && footer) main.insertBefore(section, footer);
  const nav = document.createElement("button");
  nav.className = "nav-item";
  nav.dataset.view = "reader";
  nav.innerHTML = '▤ <span>Read Bible</span>';
  const navHome = document.querySelector('.nav-item[data-view="home"]');
  if (navHome) navHome.parentNode.insertBefore(nav, navHome.nextSibling);
  nav.addEventListener("click", () => { navigate("reader"); if (!currentVerses.length) loadChapter(); });
  const bookSelect = $("#readerBook"), chapterSelect = $("#readerChapter");
  if (!bookSelect || !chapterSelect || !books.length) return;
  bookSelect.innerHTML = books.map(book => `<option value="${escapeText(book)}">${escapeText(book)}</option>`).join("");
  bookSelect.value = currentBook;
  bookSelect.addEventListener("change", () => { currentBook = bookSelect.value; currentChapter = 1; updateChapters(); loadChapter(); });
  chapterSelect.addEventListener("change", () => { currentChapter = Number(chapterSelect.value); loadChapter(); });
  $("#readerPrevious").addEventListener("click", () => moveChapter(-1));
  $("#readerNext").addEventListener("click", () => moveChapter(1));
  function updateChapters() {
    const cached = window.vfBookMeta && window.vfBookMeta[currentBook];
    const count = cached || 50;
    chapterSelect.innerHTML = Array.from({length:count}, (_, i) => `<option value="${i+1}">${i+1}</option>`).join("");
    chapterSelect.value = String(currentChapter);
  }
  function escapeText(value) {
    return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  }
  async function loadChapter() {
    const status = $("#readerStatus"), output = $("#readerVerses");
    status.textContent = "Loading " + currentBook + " " + currentChapter + "…";
    output.innerHTML = "";
    try {
      const rows = await window.fetchKjvBook(currentBook);
      const selected = rows.filter(row => {
        const match = row.ref.match(/\s(\d+):\d+/);
        return match && Number(match[1]) === currentChapter;
      });
      if (!selected.length) throw new Error("This chapter could not be found in the downloaded book.");
      currentVerses = selected;
      const maxChapter = Math.max(...rows.map(row => Number((row.ref.match(/\s(\d+):/ || [])[1] || 1)));
      if (chapterSelect.options.length !== currentMaxChapter) {
        chapterSelect.innerHTML = Array.from({length:currentMaxChapter}, (_, i) => `<option value="${i+1}">${i+1}</option>`).join("");
      }
      $("#readerHeading").textContent = currentBook + " " + currentChapter;
      output.innerHTML = selected.map(row => {
        const number = Number((row.ref.match(/:(\d+)/) || [])[1]);
        const key = row.ref;
        const marked = Boolean(notes[key] && notes[key].highlighted);
        return `<p class="reader-verse ${marked ? "is-highlighted" : ""}"><sup>${number}</sup> ${escapeText(row.text)} <button type="button" class="verse-note-button" data-note="${escapeText(key)}" aria-label="Add a note to ${escapeText(key)}">✎</button></p>`;
      }).join("");
      status.textContent = selected.length + " verses · KJV · Saved on this device for offline reading";
      chapterSelect.value = String(currentChapter);
    } catch (error) {
      status.textContent = error.message + " Connect to the internet once, then try again.";
    }
  }
  async function moveChapter(direction) {
    const next = currentChapter + direction;
    if (next >= 1 && next <= currentMaxChapter) {
      currentChapter = next;
      chapterSelect.value = String(next);
      await loadChapter();
      return;
    }
    const targetIndex = books.indexOf(currentBook) + (direction < 0 ? -1 : 1);
    if (targetIndex < 0 || targetIndex >= books.length) {
      $("#readerStatus").textContent = direction < 0 ? "You are at the beginning of the Bible." : "You have reached the end of the Bible.";
      return;
    }
    const targetBook = books[targetIndex];
    $("#readerStatus").textContent = "Loading " + targetBook + "…";
    try {
      const rows = await window.fetchKjvBook(targetBook);
      const targetMax = Math.max(...rows.map(row => Number((row.ref.match(/\\s(\\d+):/) || [])[1] || 1)));
      currentBook = targetBook;
      currentMaxChapter = targetMax;
      currentChapter = direction < 0 ? targetMax : 1;
      bookSelect.value = currentBook;
      chapterSelect.innerHTML = Array.from({length:targetMax}, (_, i) => `<option value="${i+1}">${i+1}</option>`).join("");
      chapterSelect.value = String(currentChapter);
      await loadChapter();
    } catch (error) { $("#readerStatus").textContent = "Could not open " + targetBook + ". Connect to the internet and try again."; }
  }
  document.addEventListener("click", event => {
    const button = event.target.closest("[data-note]");
    if (!button) return;
    const reference = button.dataset.note;
    const existing = notes[reference] || {};
    const note = prompt("Add a personal note for " + reference + ":", existing.note || "");
    if (note === null) return;
    const highlighted = confirm("Highlight this verse?");
    notes[reference] = { note, highlighted };
    try { localStorage.setItem("vf_notes", JSON.stringify(notes)); } catch { alert("Your browser storage is full. Export or remove some saved items."); }
    loadChapter();
  });
  updateChapters();
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(error => console.warn("Offline support could not be enabled:", error)));
  }
})();