/*! VL Site Motion v1 — par do vl-site-motion.css. Sem dependências.
   Não troca nem remove nós do React: só adiciona atributos data-* e dois
   elementos soltos no <body> (barra de leitura e indicador do menu). */
(function (w, d) {
  'use strict';
  if (w.__vlm) return; w.__vlm = true;
  var root = d.documentElement;
  var RM = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (RM) return;                       // quem pede menos movimento vê o site como está
  root.classList.add('vlm');

  /* ---- revelação no scroll ---- */
  var io = 'IntersectionObserver' in w ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      e.target.setAttribute('data-in', '');
      if (e.target.hasAttribute('data-count')) count(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }) : null;

  function mark(el, kind, delay) {
    if (!el || el.hasAttribute('data-vr')) return;
    el.setAttribute('data-vr', kind || 'up');
    if (delay) el.style.setProperty('--vd', delay + 'ms');
    if (io) io.observe(el); else el.setAttribute('data-in', '');
  }
  function all(sel, root_) { return Array.prototype.slice.call((root_ || d).querySelectorAll(sel)); }
  function group(sel, kind, step, max, from) {
    all(sel).forEach(function (el, i) { mark(el, kind, Math.min(i, max || 8) * step + (from || 0)); });
  }

  function scan() {
    var hasPublicPage = !!d.querySelector('header.top');
    var hasHomeSections = !!d.getElementById('trabalhos');

    // herói (somente na página inicial institucional)
    var hero = hasHomeSections ? d.querySelector('main section:not([id])') : null;
    if (hero) {
      mark(hero.querySelector('.grid > div:first-child'), 'scale', 0);
      var col = hero.querySelector('.grid > div:last-child');
      if (col) {
        mark(col.querySelector('h1'), 'title', 120);
        mark(col.querySelector('h1 + p'), 'up', 320);
        mark(col.querySelector('.flex.flex-wrap.gap-3'), 'up', 440);
        mark(col.querySelector('.flex.flex-wrap.gap-7'), 'up', 560);
      }
    }
    // trabalhos realizados
    all('#trabalhos > div:first-child > div > div').forEach(function (el, i) { mark(el, 'up', i * 90); });
    all('#trabalhos .track > .wk').slice(0, 7).forEach(function (el, i) { mark(el, 'up', i * 70); });
    // avaliações
    var big = d.querySelector('#avaliacoes .big');
    if (big && !big.hasAttribute('data-count')) { big.setAttribute('data-count', '5,0'); mark(big, 'fade', 0); }
    mark(d.querySelector('#avaliacoes .stars'), 'holder', 0);
    all('#avaliacoes .gg > div:first-child > p').forEach(function (el) { mark(el, 'up', 420); });
    group('#avaliacoes .rv > blockquote', 'up', 120, 4, 100);
    // serviços
    all('#servicos > div > div:first-child > div').forEach(function (el) { mark(el, 'up', 0); });
    var list = d.querySelector('#servicos > div > div:nth-child(2)');
    if (list) all(':scope > div', list).forEach(function (el, i) { mark(el, 'up', Math.min(i, 6) * 55); });
    // como funciona
    mark(d.querySelector('#processo h2'), 'up', 0);
    all('#processo .grid > div').forEach(function (el, i) {
      mark(el, 'up', i * 130);
      mark(el.querySelector('.rounded-full'), 'pop', i * 130 + 200);
    });
    // dúvidas
    mark(d.querySelector('#faq h2'), 'up', 0);
    all('#faq .space-y-0 > div').forEach(function (el, i) { mark(el, 'up', i * 80); });
    // contato
    mark(d.querySelector('#contato .grid > div:first-child'), 'left', 0);
    mark(d.querySelector('#contato form'), 'right', 120);
    if (hasPublicPage) mark(d.querySelector('footer'), 'fade', 0);
    // elementos soltos do <body> (apenas no site institucional público)
    ensureBars(hasPublicPage);
    spy();
  }

  /* ---- contagem do "5,0" (mexe só no texto, sem trocar o nó) ---- */
  function count(el) {
    var tn = el.firstChild; if (!tn || tn.nodeType !== 3) return;
    var final = tn.nodeValue, to = parseFloat(final.replace(',', '.')); if (isNaN(to)) return;
    var t0 = null;
    (function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / 1100), v = to * (1 - Math.pow(1 - p, 4));
      tn.nodeValue = p < 1 ? v.toFixed(1).replace('.', ',') : final;
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  /* ---- barra de leitura e indicador do menu ---- */
  var bar, ind, header, raf = 0;
  function ensureBars(active) {
    if (!active) {
      if (bar && bar.isConnected) bar.style.display = 'none';
      if (ind && ind.isConnected) ind.removeAttribute('data-on');
      header = null;
      return;
    }
    if (!bar || !bar.isConnected) { bar = d.createElement('div'); bar.className = 'vm-progress'; bar.setAttribute('aria-hidden', 'true'); d.body.appendChild(bar); }
    bar.style.display = '';
    if (!ind || !ind.isConnected) { ind = d.createElement('div'); ind.className = 'vm-ind'; ind.setAttribute('aria-hidden', 'true'); d.body.appendChild(ind); }
    header = d.querySelector('header.top');
  }
  var IDS = ['trabalhos', 'servicos', 'processo', 'faq', 'contato'];
  function spy() {
    var nav = d.querySelector('nav.main'); if (!nav || !ind) { if (ind) ind.removeAttribute('data-on'); return; }
    var btns = all('button', nav), cur = -1;
    IDS.forEach(function (id, i) {
      var s = d.getElementById(id);
      if (s && s.getBoundingClientRect().top <= 140) cur = i;
    });
    btns.forEach(function (b, i) { if (i === cur) { if (!b.hasAttribute('data-active')) b.setAttribute('data-active', ''); } else b.removeAttribute('data-active'); });
    var b = btns[cur];
    if (!b || !header || nav.offsetParent === null) { ind.removeAttribute('data-on'); return; }
    var r = b.getBoundingClientRect(), hb = header.getBoundingClientRect().bottom;
    ind.style.top = (hb - 2) + 'px';
    if (!ind.hasAttribute('data-on')) { ind.style.transition = 'none'; }
    ind.style.transform = 'translateX(' + r.left + 'px) scaleX(' + r.width + ')';
    if (!ind.hasAttribute('data-on')) { void ind.offsetWidth; ind.style.transition = ''; ind.setAttribute('data-on', ''); }
  }
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = 0;
      var y = w.scrollY || 0, h = Math.max(1, root.scrollHeight - w.innerHeight);
      if (bar) bar.style.setProperty('--p', Math.min(1, y / h).toFixed(4));
      if (header) { if (y > 8) header.setAttribute('data-stuck', ''); else header.removeAttribute('data-stuck'); }
      spy();
    });
  }
  w.addEventListener('scroll', onScroll, { passive: true });
  w.addEventListener('resize', onScroll);

  /* ---- fusão de cores na troca de tema ---- */
  d.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('button[aria-label^="Mudar para tema"], button[aria-label="Alternar tema"]');
    if (!b) return;
    root.classList.add('vm-theming');
    clearTimeout(w.__vmT); w.__vmT = setTimeout(function () { root.classList.remove('vm-theming'); }, 480);
  }, true);

  /* ---- troca de rota interna (react-router usa history.pushState) ---- */
  var last = location.pathname;
  function routeChanged() {
    if (location.pathname === last) return; last = location.pathname;
    var m = d.querySelector('main');
    if (m) {
      if (!location.hash) w.scrollTo({ top: 0, behavior: 'auto' });
      m.removeAttribute('data-enter'); void m.offsetWidth; m.setAttribute('data-enter', '');
      setTimeout(function () { m.removeAttribute('data-enter'); }, 600);
    }
    setTimeout(scan, 60);
  }
  ['pushState', 'replaceState'].forEach(function (k) {
    var o = history[k]; history[k] = function () { var r = o.apply(this, arguments); setTimeout(routeChanged, 0); return r; };
  });
  w.addEventListener('popstate', function () { setTimeout(routeChanged, 0); });

  /* ---- o React monta depois: observa e etiqueta o que for aparecendo ---- */
  var t;
  function later() { clearTimeout(t); t = setTimeout(scan, 120); }
  var host = d.getElementById('root') || d.body;
  new MutationObserver(later).observe(host, { childList: true, subtree: true });
  scan(); onScroll();
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(onScroll);
})(window, document);
