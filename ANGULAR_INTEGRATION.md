# Angular integration plan — UPFOREX Horizon

Do not replace the entire Angular project or global `src/index.html` with this standalone preview. Use a separate branch and keep the current production app operational.

## Header and footer

The supplied project has `src/app/layouts/navbar/navbar.component.html`, `.ts`, and `.scss`. The standalone preview recreates its actual menu groups, source logo, 11 language options, register/sign-in destinations and dropdown routes. For integration keep the actual Angular navbar component and its RouterLinks, translated labels, language service, mobile menu and authentication URLs. The prototype header is not a substitute for these services.

Reuse the approved black footer appearance from the prototype's `footer.css` and `<footer class="premium-footer">` markup. Map links to the existing app router and existing social-menu/disclaimer components; do not remove the legal copy or 24 navigation links. Preserve all legally required risk wording and restricted-region notices after verifying the approved current version. Keep one review section only, using the existing review source.

## Home page only

Locate the active `home.component.html`, stylesheet and TypeScript in the current checkout and confirm the route resolves to that component. Transfer the content of `<main>` and its scoped styles to that component. Scope styles to a home wrapper so other pages and the original navbar are not altered. Copy only required image/vector assets into the Angular asset directory. The standalone preview uses a system font fallback; reuse the project's existing Montserrat setup instead of adding a new font download.

Convert direct DOM and global JS logic into Angular component methods, using `AfterViewInit` with browser-platform guards for `window`, `document`, `matchMedia`, `IntersectionObserver`, `ResizeObserver` and animations. Clean up listeners, observers, timers and requestAnimationFrame handles in `OnDestroy`. Do not run browser-only animations on SSR. Render real text, links, and all main sections in the server HTML. Avoid injecting the entire standalone document or duplicating the navbar/footer inside `<router-outlet>`.

## Live data and SEO

- The chart and ticker currently display deterministic illustrative data. Replace with the approved licensed market data provider if live quotes are required. Never present simulated data as live quotes.
- Connect the blog section to the existing `WebBlogService` or current approved blog source, preserving titles, slugs, publication dates and localization. Static snapshot entries are included only for client review.
- Reuse the existing translation architecture, update all new strings and approved coverage, ensure genuine SSR translations, self-canonical and reciprocal hreflang only where supported. Preserve normalized routes, titles, metadata, sitemap, robots, current SEO policies and existing forms.
- The standalone preview intentionally has `noindex,nofollow`. Do NOT copy that tag to production. Keep the app's existing SEO service and production indexability.
- Check all product, registration, platform-download, social, legal and partnership links and accessibility.
- Reconfirm license details, disclaimers and approved financial statements before release.

## Release gates

Run local tests and production SSR build with the current project commands, verify SEO and SSR translation coverage, desktop/mobile interactions, production performance (LCP, CLS, INP), and external URLs. Compare original footer links with `FOOTER_SOURCE_MAP.json`. Review on a staging URL before pushing the approved branch via the existing Git/Jenkins process. No deployment or server changes were made by this prototype.


## Premiere-specific integration notes

- Load `premiere.css` after the scoped base styles and footer rules.
- Reuse the existing Angular header component and its navigation model. Add desktop pointer-enter/leave disclosure and retain native keyboard and touch access. Remove desktop chevrons only; mobile disclosures can keep indicators. Do not replace router links with static absolute URLs.
- Copy `bull-hero.webp` (1774 × 887) and `bull-hero-mobile.webp` (1020 × 887) into the existing assets pipeline; use the responsive picture source from the prototype. Keep the hero image separate from actual translated text.
- Port browser-only effects through Angular lifecycle hooks, guard with isPlatformBrowser, and destroy listeners/observers on component teardown. Do not introduce a blocking splash, or hide SSR page content from crawlers.
- Reuse the existing review data and approved Trustpilot integration. Preserve the original footer, legal copy, existing SEO metadata, canonical/hreflang, language selection and routing.
- The current chart remains illustrative. Use the existing live-data integration if needed; do not present demo prices as real.


## Text reveal enhancement

Port `text-reveal.css` and the logic in `text-reveal.js` into the homepage component, initializing only in the browser after rendering and cleaning up observers, event listeners and active Web Animations in component destruction. Preserve original SSR heading markup and translations. Initialize only when IntersectionObserver, CSS clip-path and Web Animations are supported. Avoid applying hidden styles on the server. Ensure the original motion control and reduced-motion preference remain connected.
