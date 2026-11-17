export type GuiaDestinoEditor = 'laudo' | 'orcamento';

export interface GuiaLinhaTabelaPendente {
  rotulo: string;
  valor: string;
}

export interface GuiaInsercaoPendente {
  destino: GuiaDestinoEditor;
  documentoId: string;
  secaoId: string;
  servico: string;
  origem: string;
  criadoEm: string;
  linhas: GuiaLinhaTabelaPendente[];
}

export const CHAVE_GUIA_INSERCAO_PENDENTE = 'vl-guia-insercao-editor';

export function escaparHtmlGuia(valor: string): string {
  return valor
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function criarHtmlTabelaGuia(insercao: GuiaInsercaoPendente): string {
  const linhas = insercao.linhas.map((linha) =>
    `<tr><td>${escaparHtmlGuia(linha.rotulo)}</td><td>${escaparHtmlGuia(linha.valor)}</td></tr>`
  ).join('');
  return [
    '<div class="guia-tecnico-calculo">',
    `<p><strong>Cálculo indicativo — ${escaparHtmlGuia(insercao.servico.toUpperCase())}</strong></p>`,
    `<p><em>Exemplo ilustrativo / resultado calculado em ${escaparHtmlGuia(new Date(insercao.criadoEm).toLocaleString('pt-BR'))}.</em></p>`,
    `<p><small>Origem: ${escaparHtmlGuia(insercao.origem)}.</small></p>`,
    '<table class="tiptap-table border-collapse border border-slate-300 w-full my-3"><thead><tr><th class="border border-slate-300 bg-slate-100 p-2 text-left">Parâmetro</th><th class="border border-slate-300 bg-slate-100 p-2 text-left">Resultado</th></tr></thead>',
    `<tbody>${linhas}</tbody></table>`,
    '<p><em>Cálculo indicativo. Confirme na norma vigente antes de emitir documento assinado.</em></p>',
    '</div>',
  ].join('');
}

export function lerGuiaInsercaoPendente(): GuiaInsercaoPendente | null {
  try {
    const conteudo = sessionStorage.getItem(CHAVE_GUIA_INSERCAO_PENDENTE);
    return conteudo ? JSON.parse(conteudo) as GuiaInsercaoPendente : null;
  } catch {
    return null;
  }
}

export function limparGuiaInsercaoPendente(): void {
  sessionStorage.removeItem(CHAVE_GUIA_INSERCAO_PENDENTE);
}
