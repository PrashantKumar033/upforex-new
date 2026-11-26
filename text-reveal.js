/** UPFOREX: viewport-triggered, line-by-line title reveals.
 *  Native IntersectionObserver + Web Animations; no text duplication or libraries.
 *  The existing hero entrance and all hover effects remain independent.
 */
(() => {
  'use strict';
  const root = document.getElementById('uf-home');
  if (!root || !('IntersectionObserver' in window) ||
      typeof Element.prototype.animate !== 'function' ||
      !window.CSS || !CSS.supports('clip-path', 'inset(0)')) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || root.classList.contains('motion-paused')) return;

  const selectors = [
    'main h2:not(#reviews-heading)',
    'main .market-card h3', 'main .account-card h3', 'main .blog-card h3',
    'main section:not(#hero) .kicker',
    'main .section-heading p', 'main .section-intro > p',
    'main .platform-content > p', 'main .resource-top > p',
    'main .client-review-intro > p', 'main .partner-copy > p',
    'main .cta-panel > p',
    '.premium-footer .footer-link-group h3',
    '.premium-footer .footer-reg-copy h3'
  ];
  const targets = [...root.querySelectorAll(selectors.join(','))];
  if (!targets.length) return;
  const active = new Map();
  let observer, stopped = false;
  const easing = 'cubic-bezier(.16,1,.3,1)';
  const isPaused = () => reduced.matches || root.classList.contains('motion-paused');

  // A mask reveals successive *rendered* lines without inserting spans, forcing
  // new wrapping, or altering the original heading/inline emphasis semantics.
  function titleFrames(el) {
    const css = getComputedStyle(el);
    const font = parseFloat(css.fontSize) || 24;
    const line = parseFloat(css.lineHeight) || font * 1.15;
    const height = Math.max(1, el.offsetHeight);
    const lines = Math.max(1, Math.min(8, Math.round(height / line)));
    const pad = font * .24;
    const clip = bottom => `inset(${-pad}px ${-pad}px ${bottom}px ${-pad}px)`;
    const frames = [{offset: 0, opacity: 0, clipPath: clip(height), transform: 'translate3d(-10px,18px,0)', easing}];
    // The first line opens, then the following lines are progressively uncovered.
    // A small dwell between lines makes the stagger visible even on fast screens.
    for (let i = 1; i <= lines; i++) {
      const end = .25 + .75 * i / lines;
      const bottom = i === lines ? -pad : height * (1 - i / lines) - font * .035;
      frames.push({offset: end, opacity: 1, clipPath: clip(bottom), transform: `translate3d(${-3 * (1-i/lines)}px,${5 * (1-i/lines)}px,0)`, easing});
      if (i < lines) frames.push({offset: Math.min(end + .035, 1), opacity: 1, clipPath: clip(bottom), transform: `translate3d(${-3 * (1-i/lines)}px,${5 * (1-i/lines)}px,0)`, easing});
    }
    return {frames, duration: 650 + Math.min(4, lines - 1) * 120};
  }
  function finish(el) {
    const animation = active.get(el);
    if (animation) { animation.onfinish = null; animation.cancel(); active.delete(el); }
    el.dataset.scrollText = 'done';
    observer?.unobserve(el);
  }
  function play(el) {
    if (el.dataset.scrollText !== 'pending') return;
    if (stopped || isPaused() || !el.isConnected) { finish(el); return; }
    observer.unobserve(el);
    const title = /^H[23]$/.test(el.tagName);
    const kicker = el.classList.contains('kicker');
    const spec = title ? titleFrames(el) : {
      frames: [
        {opacity: 0, transform: `translate3d(${kicker ? -9 : 0}px,${kicker ? 0 : 12}px,0)`},
        {opacity: 1, transform: 'translate3d(0,0,0)'}
      ], duration: kicker ? 460 : 590
    };
    // Slightly stagger the section labels, headings, and supporting copy.
    const delay = title ? (el.tagName === 'H2' ? 95 : 55) : kicker ? 0 : 190;
    try {
      const animation = el.animate(spec.frames, {duration: spec.duration, delay, easing: title ? 'linear' : easing, fill: 'both'});
      active.set(el, animation);
      el.dataset.scrollText = 'running';
      animation.onfinish = () => finish(el);
    } catch (_) { finish(el); }
  }
  function finishAll() {
    if (stopped) return;
    stopped = true;
    observer?.disconnect();
    targets.forEach(finish);
    root.classList.remove('text-reveal-enabled');
    controlObserver.disconnect();
    reduced.removeEventListener?.('change', onMotionChange);
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('resize', onResize);
  }
  function onMotionChange() { if (isPaused()) finishAll(); }
  function onVisibility() {
    // Do not leave text hidden if a visitor switches away during the reveal.
    if (document.hidden) [...active.keys()].forEach(finish);
  }
  function onResize() {
    // Complete in-flight masks if the viewport changes, so changed line breaks
    // never cause clipped text. Pending elements calculate fresh dimensions.
    [...active.keys()].forEach(finish);
  }
  const controlObserver = new MutationObserver(onMotionChange);
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) play(entry.target); });
  }, {threshold: .12, rootMargin: '0px 0px -4% 0px'});
  // Only hide after successfully creating the observer. Without JS or observer
  // support the original, fully readable HTML remains the default.
  targets.forEach(el => { el.dataset.scrollText = 'pending'; observer.observe(el); });
  root.classList.add('text-reveal-enabled');
  controlObserver.observe(root, {attributes: true, attributeFilter: ['class']});
  reduced.addEventListener?.('change', onMotionChange);
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('resize', onResize, {passive: true});
})();
