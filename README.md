# VerseFinder 2.0

A responsive, browser-based Bible verse discovery app.

## Included features
- Search verse text, references, and topics
- Reference lookup accepts formats such as `John 10:10`, `John 10 vs 10`, and `Jn 10:10`
- Online KJV lookup for references not in the built-in sample collection
- Browse topic collections
- Daily verse and random verse
- Save favourites
- Copy and share verses
- Prayer journal with local persistence
- Seven-day reading plan with progress tracking
- Light/dark appearance
- Responsive desktop and mobile navigation

## Run it
Open `index.html` in a modern browser. No build tools or server are required.

## Data and privacy
This starter edition uses a small built-in sample of King James Version (KJV) verses. Favourites, journal entries, reading progress, and theme preference are stored in the browser's localStorage on that device. They are not synced between devices.

## Important
This is a web app source project, not a compiled Android APK. To publish as an Android app, wrap the web app with Capacitor or build a native Android shell, then compile/sign it with Android tooling. Internet is needed for the optional Google Fonts import and online Bible reference lookups; the app otherwise runs locally.

## Full Bible search

VerseFinder can load the complete 66-book King James Version library (31,102 verses) from the open-source [Midvash Bible Data](https://github.com/midvash/bible-data) project. The KJV text is identified there as public domain. The app caches downloaded book data in IndexedDB when available, so later searches can use the locally cached library. An internet connection is needed for the first download.
