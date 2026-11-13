/*! VL Painel Motion v1 — par do vl-painel-motion.css. Sem dependências.
   Só adiciona atributos data-*; não troca nem remove nós do React. */
(function (w, d) {
  'use strict';
  if (w.__vlmp) return; w.__vlmp = true;
  var root = d.documentElement;
  if (w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.classList.add('vlm');

  function isPainelRoute() {
    var p = w.location.pathname || '';
    return p.indexOf('/admin') === 0 && p.indexOf('/imprimir') === -1;
  }

  var io = 'IntersectionObserver' in w ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); e.target.setAttribute('data-in', ''); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -4% 0px' }) : null;

  function mark(el, kind, delay) {
    if (!el || el.hasAttribute('data-vr')) return;
    el.setAttribute('data-vr', kind || 'up');
    if (delay) el.style.setProperty('--vd', delay + 'ms');
    if (io) io.observe(el); else el.setAttribute('data-in', '');
  }
  function all(sel, r) { return Array.prototype.slice.call((r || d).querySelectorAll(sel)); }

  function scan() {
    if (!isPainelRoute()) { header = null; return; }
    var shell = d.querySelector('.vl-painel');
    if (!shell) { header = null; return; }

    mark(shell.querySelector('header.sticky'), 'fade', 0);
    all('aside nav > a', shell).forEach(function (a, i) { mark(a, 'left', 120 + Math.min(i, 8) * 45); });
    mark(shell.querySelector('aside > div.mt-auto'), 'fade', 520);
    var main = shell.querySelector('main'); if (!main) return;
    var secs = all('section', main);
    var greet = secs[0];
    if (greet) {
      mark(greet.querySelector('h1'), 'up', 150);
      mark(greet.querySelector('h1 + p'), 'up', 240);
      mark(greet.querySelector(':scope > div:last-child') || greet.querySelector('a[href*="novo"]'), 'up', 330);
    }
    var kpi = main.querySelector('section[aria-label="Resumo"]');
    if (kpi) {
      mark(kpi, 'fade', 380);
      all(':scope > a', kpi).forEach(function (a, i) {
        mark(a, 'up', 420 + i * 70);
        mark(a.querySelector('b'), 'pop', 480 + i * 70);
      });
    }
    // cartões seguintes (fluxo, laudos recentes e o que vier nas outras telas)
    secs.forEach(function (s) {
      if (s === greet || s === kpi) return;
      mark(s, 'up', 0);
      all('tbody > tr', s).forEach(function (tr, j) { mark(tr, 'up', 160 + Math.min(j, 8) * 90); });
    });
    all('[data-flow]', main).forEach(function (b, i) { mark(b, 'bar', 250 + i * 150); });
    bars();
  }

  var header, raf = 0;
  function bars() { header = isPainelRoute() ? d.querySelector('.vl-painel header.sticky') : null; }
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = 0;
      if (!header) return;
      if ((w.scrollY || 0) > 4) header.setAttribute('data-stuck', ''); else header.removeAttribute('data-stuck');
    });
  }
  w.addEventListener('scroll', onScroll, { passive: true });

  // troca de tema: fusão de cores
  d.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('button[aria-label="Alternar tema"]'); if (!b) return;
    root.classList.add('vm-theming'); clearTimeout(w.__vmT);
    w.__vmT = setTimeout(function () { root.classList.remove('vm-theming'); }, 480);
  }, true);

  // troca de rota interna (react-router usa history.pushState)
  var last = location.pathname;
  function routeChanged() {
    if (location.pathname === last) return; last = location.pathname;
    if (!isPainelRoute()) return;
    var m = d.querySelector('.vl-painel main > div');
    if (m) {
      w.scrollTo({ top: 0, behavior: 'auto' });
      m.removeAttribute('data-enter'); void m.offsetWidth; m.setAttribute('data-enter', '');
      setTimeout(function () { m.removeAttribute('data-enter'); }, 600);
    }
    setTimeout(scan, 60);
  }
  ['pushState', 'replaceState'].forEach(function (k) {
    var o = history[k]; history[k] = function () { var r = o.apply(this, arguments); setTimeout(routeChanged, 0); return r; };
  });
  w.addEventListener('popstate', function () { setTimeout(routeChanged, 0); });

  var t; function later() { clearTimeout(t); t = setTimeout(scan, 100); }
  new MutationObserver(later).observe(d.getElementById('root') || d.body, { childList: true, subtree: true });
  scan(); onScroll();
})(window, document);
