import type { IncomingMessage, ServerResponse } from 'node:http';
import { responder, lerCorpo, usuarioAutorizado } from './_comum';

/** POST /api/ai/claude-redigir-secao — redige/expande uma seção do laudo (HTML) com o Claude. */
export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (String(req.method).toUpperCase() !== 'POST') return responder(res, 405, { error: 'Use POST.' });
  if (!(await usuarioAutorizado(req))) return responder(res, 401, { error: 'Não autorizado.' });
  const chave = process.env.ANTHROPIC_API_KEY;
  if (!chave) return responder(res, 503, { error: 'ANTHROPIC_API_KEY não configurada no servidor.' });

  const b = await lerCorpo(req);
  const system = `Você é um Engenheiro Mecânico Perito (CREA-PE) e redige seções de laudos periciais de engenharia mecânica.
Regras:
1. Retorne apenas HTML limpo (<p>, <ul>, <li>, <strong>, <em> e tabelas <table class="tiptap-table border-collapse border border-slate-300 w-full my-3">), sem markdown nem blocos de código.
2. Tom formal, técnico e impessoal, apoiado nas normas ABNT/NRs cabíveis.
3. Use somente os fatos fornecidos. Não invente medições, datas, números ou nomes. Quando faltar dado, escreva "[VERIFICAR: ...]".`;
  const user = `Redija o conteúdo da seção:
- Título: "${b.tituloSecao || ''}"
- Tipo de laudo: "${b.tipoLaudo || 'Laudo Técnico Pericial de Engenharia Mecânica'}"
- Normas: "${b.normasRef || 'ABNT NBR e Normas Regulamentadoras vigentes'}"
- Ativo: "${b.ativoIdentificacao || 'não informado'}"
- Cliente: "${b.clienteNome || 'não informado'}"
${b.conteudoAtual ? `- Conteúdo já existente (expandir/aprimorar):\n"""${b.conteudoAtual}"""` : ''}
${b.promptUsuario ? `- Instrução do engenheiro:\n"""${b.promptUsuario}"""` : ''}`;

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': chave, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5',
        max_tokens: 4000,
        temperature: 0.3,
        system,
        messages: [{ role: 'user', content: user }],
      }),
    });
    const j: any = await r.json();
    if (!r.ok) return responder(res, 502, { error: j?.error?.message || 'Falha na API da Anthropic.' });
    const html = (j?.content || []).filter((c: any) => c.type === 'text').map((c: any) => c.text).join('')
      .trim().replace(/^```html\s*/i, '').replace(/\s*```$/i, '');
    if (!html) return responder(res, 502, { error: 'Resposta vazia da IA.' });
    return responder(res, 200, { conteudoHtml: html, mock: false, source: 'claude' });
  } catch (e: any) {
    return responder(res, 500, { error: e?.message || 'Erro interno.' });
  }
}
