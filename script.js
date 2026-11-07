/* Cocktails - animazione d'ingresso e stato dell'header.
   Vanilla JS, nessuna dipendenza.

   Regola d'oro: il contenuto e' visibile anche se questo file non parte.
   La classe .js-reveal (che nasconde le card in attesa dell'animazione) viene
   aggiunta solo quando le card possono davvero essere rivelate: c'e' sempre
   un fallback basato sullo scroll, oltre all'IntersectionObserver. */

(function () {
  "use strict";

  var docEl = document.documentElement;
  var reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  docEl.classList.remove("no-js");

  /* 1. Reveal on scroll */
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  function show(el) {
    if (el.classList.contains("is-visible")) return;
    el.style.setProperty("--delay", (items.indexOf(el) % 3) * 90 + "ms");
    el.classList.add("is-visible");
  }

  function showAll() {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  }

  function nearViewport(el) {
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight * 0.92 && r.bottom > 0;
  }

  if (reduceMotion) {
    showAll();
  } else {
    var observer = null;

    if ("IntersectionObserver" in window) {
      try {
        observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            show(entry.target);
            observer.unobserve(entry.target);
          });
        }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
        items.forEach(function (el) { observer.observe(el); });
      } catch (err) {
        observer = null;
      }
    }

    var sweepOnScroll = function () {
      items.forEach(function (el) {
        if (!el.classList.contains("is-visible") && nearViewport(el)) show(el);
      });
    };

    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      var run = function () { sweepOnScroll(); ticking = false; };
      if (window.requestAnimationFrame) window.requestAnimationFrame(run);
      else window.setTimeout(run, 60);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    docEl.classList.add("js-reveal");
    sweepOnScroll();

    window.setTimeout(showAll, 6000);
  }

  /* 2. Header: sfondo e bordo dopo i primi pixel di scroll */
  var header = document.querySelector(".site-header");
  var headerTicking = false;

  function syncHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", (window.pageYOffset || window.scrollY || 0) > 12);
    headerTicking = false;
  }

  if (header) {
    window.addEventListener("scroll", function () {
      if (headerTicking) return;
      headerTicking = true;
      if (window.requestAnimationFrame) window.requestAnimationFrame(syncHeader);
      else window.setTimeout(syncHeader, 60);
    }, { passive: true });
    syncHeader();
  }

  /* 3. Rete di sicurezza per le foto remote */
  Array.prototype.forEach.call(document.querySelectorAll(".card-media img, .maybe-thumb img"), function (img) {
    img.addEventListener("error", function () { img.classList.add("is-broken"); });
    if (img.complete && img.naturalWidth === 0) img.classList.add("is-broken");
  });
})();
