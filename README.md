# VerseFinder 3.0 (development)

A responsive Bible discovery and reading app, built with plain HTML, CSS and JavaScript.

## Features
- Search KJV verse text and references; browse topical collections.
- Read the KJV book by book and chapter by chapter.
- Save favourites, prayer journal entries, reading progress, verse notes and highlights locally on the device.
- Responsive layout and light/dark appearance.
- Installable web-app shell with service-worker caching for offline access to the app interface.
- Downloaded KJV books are cached in IndexedDB for subsequent offline reading.

## Run locally
Serve this folder over localhost (for example, with VS Code Live Server). Service workers require HTTPS or localhost. Opening the HTML file directly still allows the basic app to run, but offline installation will not be enabled.

## Bible data and attribution
The KJV book data is fetched from [Midvash Bible Data](https://github.com/midvash/bible-data). The dataset repository describes its KJV text as public domain and its data licensing per translation. VerseFinder caches books after a successful download. A first-time download requires internet access.

## Chichewa Bible
The Buku Lopatulika text is not bundled or copied into this project. The Bible Society of Malawi is identified as its copyright holder, and permission is required before redistributing the complete text. Until a suitable licence is obtained, the reader provides a link to the official Chichewa Bible resource. See the [Bible Society of Malawi information](https://www.biblesociety-malawi.org/) and [Chichewa.Bible](https://chichewa.bible/).

## Storage and privacy
No account or remote personal-data backend is introduced. Favourites, journal entries, progress and notes remain in browser storage on the current device and do not sync between devices. Bible book data is stored in IndexedDB where supported, with a localStorage fallback.

## Deployment
Deploy the folder as a static site on any HTTPS-capable host. For Android packaging, a separate Capacitor build and device testing are still required.
