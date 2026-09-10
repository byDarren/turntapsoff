/* turnthetapsoff.com — local copy: progressive enhancement for the review fixes.
   No framework. Everything degrades to plain HTML/CSS if this file fails to load. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------------------
     FIX 6 — materialise the sticky header once the hero has scrolled away
     (Apple "scroll edge effect": chrome only becomes a material where it
     actually overlaps content).
     ---------------------------------------------------------------------- */
  var header = document.querySelector('[data-tto-header]');
  var hero = document.getElementById('top');
  if (header && hero && 'IntersectionObserver' in window) {
    var heroWatcher = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) header.removeAttribute('data-scrolled');
        else header.setAttribute('data-scrolled', '');
      });
    }, { rootMargin: '-64px 0px 0px 0px', threshold: 0 });
    heroWatcher.observe(hero);
  }

  /* ----------------------------------------------------------------------
     FIX 4 — count the stat numbers up when they enter the viewport.
     Skipped entirely under prefers-reduced-motion: the final value is
     already in the HTML, so nothing to do.
     ---------------------------------------------------------------------- */
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-countup]'));
  if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
    var runCount = function (el) {
      var target = parseInt(el.getAttribute('data-countup'), 10);
      if (isNaN(target)) return;
      var duration = 900;
      var start = null;
      el.textContent = '0';
      var tick = function (ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        // easeOutExpo — fast out, soft settle (no overshoot; §4 default)
        var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        el.textContent = Math.round(eased * target).toString();
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toString();
      };
      requestAnimationFrame(tick);
    };
    var countWatcher = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCount(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countWatcher.observe(el); });
  }

  /* ----------------------------------------------------------------------
     FIX 6 — wayfinding: after an in-page jump, move focus to the target
     section so keyboard / screen-reader users land where sighted users do.
     (Smooth scrolling itself is handled by CSS, gated on reduced motion.)
     ---------------------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href').slice(1);
    var target = id ? document.getElementById(id) : null;
    if (!target) return;
    // let the browser do the scroll; just hand off focus once it settles
    window.setTimeout(function () {
      target.focus({ preventScroll: true });
    }, reduceMotion ? 0 : 500);
  });
})();
