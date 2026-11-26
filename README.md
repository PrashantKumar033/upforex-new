# UPFOREX Horizon Premiere — cinematic homepage preview

A standalone HTML/CSS/JavaScript recreation of the approved light/dark concept, with a sky-and-green-bull hero, the original UPFOREX menu structure, and the previously approved black footer.

## Run

1. Extract the ZIP completely, keeping `assets/` alongside the code files.
2. Open `UPFOREX_HORIZON_PREMIERE/index.html` in Chrome or Edge.
3. Move the mouse over the hero artwork, market cards, accounts, platform devices, tools, articles, review cards, buttons and footer regulatory cards. Use the floating Pause motion control to disable decorative motion.

No npm, paid API, tracking scripts, CDN or external library is needed. If local file browsing is disabled on your computer, serve the folder with a local static server, e.g. VS Code Live Server, and open its local URL. All assets and page code are local. External links open the existing UPFOREX pages or portal.

## Files

- `index.html`: complete page and original navigation destinations.
- `styles.css`: independent responsive visual system, directional scroll entry, parallax, light sweeps and hover animations.
- `footer.css`: approved previous black footer styling (unchanged).
- `premiere.css`: arrowless desktop dropdown presentation, high-resolution hero, staged entrance and emerald review lounge.
- `app.js`: menu handling, motion control, event-driven pointer effects, deterministic illustrative OHLC chart, review carousel.
- `assets/`: compressed imagery and vector assets.
- `FOOTER_SOURCE_MAP.json`: exact existing footer navigation and source mapping.
- `BLOG_SNAPSHOT.json`: existing article snapshot, not a live feed.
- `TEST_RESULTS.json`: current browser smoke-test results.
- `ANGULAR_INTEGRATION.md`: production integration guidance.

## Design and content decisions

The hero artwork is newly generated, dedicated 1774 × 887 artwork (previous crop: 406 × 254). A separate 1020 × 887 crop is served on mobile. Optimized WebP files are included locally; the artwork is not a live 3D model. CSS/JS create an approximately two-second cinematic entrance and pointer-responsive parallax without a blocking splash screen. Desktop dropdowns open on mouse hover with no chevrons, while native keyboard and mobile disclosure behavior is retained. The review lounge uses a richer mint/emerald palette with the same review snapshot and carousel. All original anchor destinations and black footer markup are retained. Text, controls, candles and cards are real HTML/SVG. The layout uses the actual brand logo and source menu groups and links extracted from the supplied Angular project; the header is a native HTML recreation, not the actual Angular component running in this prototype. The approved black footer markup is reused, retaining the 24 footer navigation links, four social links, both regulatory cards and full legal wording. Existing review snapshots are presented in a light review section to avoid duplication.

Financial information in the chart and ticker is explicitly illustrative. No invented account prices, return promises, fresh ratings or reviews are added. The three article titles, dates and links come from the previously verified 26 November 2026 snapshot; artwork is illustrative. Verify all approved financial/marketing copy, reviews, legal text and external links before production release.

## Verification

Chromium smoke tests at 1730, 1440, 1024, 768, 390 and 360 CSS pixels: zero JavaScript page errors, missing image assets or horizontal overflow. Tested desktop hover opening/switching/closing, moving into the dropdown, keyboard Enter/Escape, native mobile menus, pointer-follow hero, review tilt/reset, 24 market/timeframe combinations, review navigation and reduced-motion preference. Tests use the same source and assets loaded into an offline browser document. All 153 original static anchor references and the footer markup/CSS match the previous version. Production browser performance, live external destinations and Angular integration remain unverified.

The preview is marked `noindex,nofollow` intentionally. It is for local/client review, not direct production deployment.


## Viewport text reveal update

Open `index.html` in Chrome or Edge and scroll. The original Premiere hero entrance remains unchanged. All ten principal section headings, selected card headings, section labels, supporting descriptions, and footer headings (47 elements) now reveal on first viewport entry. Headings use a graduated line mask and smooth lift; no heading text, breaks or emphasis markup is modified. The effect plays once per page load, honors reduced motion and the existing Pause motion control, and defaults to readable content when its optional enhancement is unavailable. Dynamic chart and review updates retain the existing animation system.

Added `text-reveal.css` and `text-reveal.js`; the only change to `index.html` is loading these files. The prior `TEST_RESULTS.json` is the Premiere baseline; current targeted regression evidence is in `TEXT_REVEAL_TEST_RESULTS.json`. The tests used an offline Chromium document with the source and assets inlined, not a production Angular deployment.
