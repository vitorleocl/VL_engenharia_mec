/**
 * Paginação automática do corpo do laudo (A4).
 * Recebe as seções do laudo, monta "unidades" (títulos, parágrafos, listas, tabelas, fotos),
 * mede cada uma no navegador e distribui em páginas sem cortar conteúdo.
 */
import type { LaudoSecao } from '../types';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Destaca pendências "[VERIFICAR: ...]" deixadas pela IA. */
export const destacarPendencias = (html: string) =>
  html.replace(/\[VERIFICAR[^\]]*\]/g, (m) => `<span class="todo-highlight">${m}</span>`);

const temTexto = (html?: string) => (html || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().length > 0;

const SECOES_FORA = ['capa', 'art_assinatura', 'checklist'];

interface Unidade { html: string; colar?: boolean; altura?: number; tabela?: { cab: string; linhas: string[]; atrib: string } }

function unidadesDaSecao(sec: LaudoSecao, indice: number): Unidade[] {
  const un: Unidade[] = [];
  const titulo = esc(sec.titulo || `Seção ${indice}`);
  const num = /^\s*\d+[.)]/.test(sec.titulo || '') ? '' : `<span class="lp-num">${indice}</span>`;
  un.push({ html: `<div class="lp-sec-h">${num}<h3>${titulo.replace(/^\s*\d+[.)]\s*/, '')}</h3></div>`, colar: true });

  const doc = new DOMParser().parseFromString(`<body>${destacarPendencias(sec.conteudoHtml || '')}</body>`, 'text/html');
  const filhos = Array.from(doc.body.childNodes);
  for (const no of filhos) {
    if (no.nodeType === 3) {
      const t = (no.textContent || '').trim();
      if (t) un.push({ html: `<p>${esc(t)}</p>` });
      continue;
    }
    if (no.nodeType !== 1) continue;
    const el = no as HTMLElement;
    const tag = el.tagName.toLowerCase();
    if (tag === 'table') {
      const cab = el.querySelector('thead') ? (el.querySelector('thead') as HTMLElement).outerHTML : '';
      const linhas = Array.from(el.querySelectorAll('tbody tr, :scope > tr')).map((r) => (r as HTMLElement).outerHTML);
      const atrib = el.getAttribute('class') ? ` class="${el.getAttribute('class')}"` : '';
      un.push({ html: el.outerHTML, tabela: { cab, linhas, atrib } });
    } else if ((tag === 'ul' || tag === 'ol') && el.children.length > 8) {
      const itens = Array.from(el.children).map((c) => (c as HTMLElement).outerHTML);
      for (let i = 0; i < itens.length; i += 6) un.push({ html: `<${tag}>${itens.slice(i, i + 6).join('')}</${tag}>` });
    } else {
      un.push({ html: el.outerHTML });
    }
  }
  if (sec.criterioReferencia) un.push({ html: `<div class="lp-ref"><b>Critério de referência:</b> ${esc(sec.criterioReferencia)}</div>` });
  const fotos = (sec.fotos || []).filter((f) => f?.url);
  for (let i = 0; i < fotos.length; i += 2) {
    const par = fotos.slice(i, i + 2).map((f, k) =>
      `<figure><div class="lp-foto"><img src="${esc(f.url)}" alt="Foto ${i + k + 1}" crossorigin="anonymous"/></div><figcaption><b>Foto ${i + k + 1}.</b> ${esc(f.legenda || '')}</figcaption></figure>`).join('');
    un.push({ html: `<div class="lp-fotos">${par}</div>` });
  }
  return un;
}

/** Fotos têm altura fixa (CSS), então a medida independe do carregamento da imagem. */
export function paginarSecoes(secoes: LaudoSecao[], alturaUtilPx: number, medir: (html: string) => number): string[][] {
  const validas = secoes.filter((s) => !s.ocultaNoPdf && !SECOES_FORA.includes(String(s.tipo || '')) && (temTexto(s.conteudoHtml) || (s.fotos || []).length > 0));
  const paginas: string[][] = [];
  let atual: string[] = [];
  let usado = 0;
  const nova = () => { if (atual.length) paginas.push(atual); atual = []; usado = 0; };

  const colocar = (html: string, h: number) => {
    if (usado + h > alturaUtilPx && atual.length) nova();
    atual.push(html); usado += h;
  };

  let n = 0;
  for (const sec of validas) {
    n += 1;
    const unid = unidadesDaSecao(sec, n);
    for (let i = 0; i < unid.length; i++) {
      const u = unid[i];
      let h = medir(u.html);
      if (u.colar && unid[i + 1]) {
        // título nunca fica sozinho no fim da página: cola no próximo bloco
        const prox = unid[i + 1];
        const hp = Math.min(medir(prox.html), 110);
        if (usado + h + hp > alturaUtilPx && atual.length) nova();
      }
      if (u.tabela && h > alturaUtilPx * 0.9) {
        const { cab, linhas, atrib } = u.tabela;
        const hCab = medir(`<table${atrib} style="margin:0">${cab}</table>`);
        let grupo: string[] = [];
        let hg = hCab;
        const fecha = () => { if (grupo.length) { colocar(`<table${atrib}>${cab}<tbody>${grupo.join('')}</tbody></table>`, hg); grupo = []; hg = hCab; nova(); } };
        for (const l of linhas) {
          const hl = medir(`<table${atrib} style="margin:0"><tbody>${l}</tbody></table>`);
          if (hg + hl + 20 > alturaUtilPx - usado && grupo.length) { colocar(`<table${atrib}>${cab}<tbody>${grupo.join('')}</tbody></table>`, hg); grupo = []; hg = hCab; nova(); }
          grupo.push(l); hg += hl;
        }
        if (grupo.length) colocar(`<table${atrib}>${cab}<tbody>${grupo.join('')}</tbody></table>`, hg);
        continue;
      }
      colocar(u.html, h);
    }
  }
  nova();
  return paginas.length ? paginas : [[]];
}
