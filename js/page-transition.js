// PAGE TRANSITIONS — the page fades out, then the next page fades in while the logo eases
// from its size on the previous page to its size on this one. The logo itself never fades.
// Loaded in <head> (not deferred) so the page can be hidden before the first paint.
(() => { // own scope, so these names can't clash with the page scripts
  const KEY = 'logo-from';
  const FADE_OUT = 200; // ms
  const FADE_IN = 300;
  const ZOOM = 500;
  const FADED = '.site-nav, main, .site-footer'; // everything but the logo

  // Arriving: if we just came from another page on the site, hide the page until it's placed
  let from = null;
  try { from = JSON.parse(sessionStorage.getItem(KEY)); } catch (e) {}
  sessionStorage.removeItem(KEY);
  const recent = from && Date.now() - from.time < 5000; // ignore leftovers from old visits
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (recent && !reduceMotion) document.documentElement.classList.add('page-enter');

  // Back/forward can restore a page mid-fade-out: show it again
  addEventListener('pageshow', (e) => {
    if (e.persisted) document.querySelectorAll(FADED).forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
  });

  document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo img');
    const faded = document.querySelectorAll(FADED);

    // Leaving: remember where the logo is, fade the page out, then go
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link || !logo || e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || link.target === '_blank') return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      const r = logo.getBoundingClientRect();
      sessionStorage.setItem(KEY, JSON.stringify({ x: r.left, y: r.top, w: r.width, time: Date.now() }));
      if (reduceMotion) return;
      e.preventDefault();
      faded.forEach((el) => el.animate({ opacity: [1, 0] }, { duration: FADE_OUT, easing: 'ease', fill: 'forwards' }));
      setTimeout(() => { location.href = url.href; }, FADE_OUT);
    });

    if (!document.documentElement.classList.contains('page-enter')) return;
    document.documentElement.classList.remove('page-enter');
    faded.forEach((el) => el.animate({ opacity: [0, 1] }, { duration: FADE_IN, easing: 'ease' }));
    if (!logo) return;

    // Start the logo at the old size/position, then ease it to where it sits on this page
    const to = logo.getBoundingClientRect();
    if (!to.width || Math.abs(from.w - to.width) < 1 && Math.abs(from.x - to.left) < 1 && Math.abs(from.y - to.top) < 1) return;
    const scale = from.w / to.width;
    logo.animate([
      { transformOrigin: '0 0', transform: `translate(${from.x - to.left}px, ${from.y - to.top}px) scale(${scale})` },
      { transformOrigin: '0 0', transform: 'none' }
    ], { duration: ZOOM, easing: 'ease' });
  });
})();
