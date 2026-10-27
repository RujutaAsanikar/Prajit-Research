/* Prajit Research — motion system.
   IntersectionObserver + Web Animations API only — no external animation library.
   Exposes window.Motion = { mount, reveal, fadeIn, fadeOut, reducedMotion }. */
(() => {
  "use strict";

  const mql = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : { matches: false, addEventListener(){} };
  let reduced = mql.matches;
  mql.addEventListener("change", e => { reduced = e.matches; });

  const EASE_OUT = "cubic-bezier(.16,1,.3,1)";
  const DUR_FAST = 180, DUR_PAGE = 320;
  const STAGGER_STEP = 60, STAGGER_CAP = 8;

  let observer = null;
  function ensureObserver(){
    if (observer) return observer;
    // threshold 0 with no shrinking rootMargin: anything already on-screen at mount time (including
    // content sitting right at the fold, like a form's submit button) reveals immediately rather than
    // waiting on a scroll gesture that might never bring it further into view.
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting){ reveal(entry.target); observer.unobserve(entry.target); }
      });
    }, { threshold: 0 });
    return observer;
  }

  function countUp(el){
    const raw = el.textContent.trim();
    if (reduced || !/^\d+$/.test(raw)) return;
    const target = parseInt(raw, 10);
    const dur = 900, start = performance.now();
    (function frame(now){
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(frame); else el.textContent = raw;
    })(start);
  }

  function reveal(el){
    el.classList.add("is-revealed");
    if (el.hasAttribute("data-count")) countUp(el);
  }

  /* Scans root for [data-reveal] elements (optionally grouped under [data-reveal-group] for a
     staggered entrance) and observes them. Call once after any full innerHTML swap — safe to call
     repeatedly, each call clears the previous render's observations since those nodes are gone. */
  function mount(root){
    if (!root) return;
    const obs = ensureObserver();
    obs.disconnect();
    root.querySelectorAll("[data-reveal-group]").forEach(group => {
      const items = group.querySelectorAll("[data-reveal]");
      items.forEach((el, i) => { el.style.transitionDelay = reduced ? "0ms" : `${Math.min(i, STAGGER_CAP) * STAGGER_STEP}ms`; });
    });
    root.querySelectorAll("[data-reveal]").forEach(el => {
      if (reduced){ el.classList.add("is-revealed"); return; }
      obs.observe(el);
      // Safety net: never leave content permanently invisible over an observer edge case.
      setTimeout(() => { if (!el.classList.contains("is-revealed")) reveal(el); }, 1800);
    });
  }

  function fadeOut(el, dur = DUR_FAST){
    if (!el || reduced || !el.animate) return Promise.resolve();
    try { return el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: dur, easing: "ease" }).finished.catch(() => {}); }
    catch (_) { return Promise.resolve(); }
  }
  function fadeIn(el, dur = DUR_PAGE){
    if (!el || reduced || !el.animate) return Promise.resolve();
    try { return el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: dur, easing: EASE_OUT }).finished.catch(() => {}); }
    catch (_) { return Promise.resolve(); }
  }

  window.Motion = { mount, reveal, fadeIn, fadeOut, get reducedMotion(){ return reduced; } };
})();
