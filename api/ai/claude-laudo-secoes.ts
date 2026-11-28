import type { IncomingMessage, ServerResponse } from 'node:http';
import { responder, lerCorpo, usuarioAutorizado } from './_comum';

/**
 * POST /api/ai/claude-laudo-secoes
 * Redige várias seções de QUALQUER tipo de laudo (usa o contexto do próprio laudo).
 * Entrada: { contexto, secoes: [{id, titulo, conteudoAtual}], titulosTodas: string[], observacoes }
 * Saída:   { secoes: [{ id, conteudoHtml }] }
 */
function extrairJson(t: string): any | null {
  const l = t.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  try { return JSON.parse(l); } catch {
    const a = l.indexOf('{'), b = l.lastIndexOf('}');
    if (a >= 0 && b > a) { try { return JSON.parse(l.slice(a, b + 1)); } catch { /* */ } }
    return null;
  }
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (String(req.method).toUpperCase() !== 'POST') return responder(res, 405, { error: 'Use POST.' });
  if (!(await usuarioAutorizado(req))) return responder(res, 401, { error: 'Não autorizado.' });
  const chave = process.env.ANTHROPIC_API_KEY;
  if (!chave) return responder(res, 503, { error: 'ANTHROPIC_API_KEY não configurada no servidor.' });

  const b = await lerCorpo(req);
  const secoes = Array.isArray(b.secoes) ? b.secoes.slice(0, 6) : [];
  if (!secoes.length || !b.contexto) return responder(res, 400, { error: 'Dados incompletos.' });

  const system = `Você é um Engenheiro Mecânico Perito (CREA-PE) que redige laudos técnicos da VL Engenharia (inspeções, NR-12, NR-13, vasos de pressão, caldeiras, HVAC/PMOC, veículos, perícias, máquinas, elevação de cargas etc.).
Você recebe o contexto de um laudo e algumas de suas seções. Redija o conteúdo de cada seção pedida.
Regras:
1. Cada conteudoHtml é HTML limpo (<p>, <ul>, <li>, <strong>, <em>, <table class="tiptap-table border-collapse border border-slate-300 w-full my-3"> com <tr>/<td>), sem markdown nem blocos de código.
2. Tom formal, técnico, impessoal; cite apenas normas coerentes com o tipo de laudo informado.
3. Use SOMENTE os fatos do contexto (cliente, ativo, datas, checklist, não conformidades, observações do engenheiro). NÃO invente medições, números de série, datas, nomes, resultados de ensaio ou fotos.
4. Quando faltar um dado necessário, escreva "[VERIFICAR: dado que falta]".
5. Seções de fotos: apenas legendas-modelo com "[FOTO: ...]". Seções de assinatura/ART: texto de encerramento sem inventar número de ART.
6. Se uma seção já tem conteúdo, melhore e complete sem contradizê-lo.
7. Responda SOMENTE com JSON: {"secoes":[{"id":"...","conteudoHtml":"..."}]} com um item para cada seção pedida, na mesma ordem.`;

  const user = `CONTEXTO DO LAUDO:
${JSON.stringify(b.contexto).slice(0, 14000)}

ESTRUTURA COMPLETA DO LAUDO (títulos): ${JSON.stringify(b.titulosTodas || []).slice(0, 2000)}

OBSERVAÇÕES DO ENGENHEIRO:
${String(b.observacoes || '(nenhuma)').slice(0, 4000)}

SEÇÕES A REDIGIR:
${JSON.stringify(secoes.map((s: any) => ({ id: s.id, titulo: s.titulo, conteudoAtual: String(s.conteudoAtual || '').slice(0, 3000) })))}`;

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': chave, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5',
        max_tokens: 8000,
        temperature: 0.2,
        system,
        messages: [{ role: 'user', content: user }],
      }),
    });
    const j: any = await r.json();
    if (!r.ok) return responder(res, 502, { error: j?.error?.message || 'Falha na API da Anthropic.' });
    const texto = (j?.content || []).filter((c: any) => c.type === 'text').map((c: any) => c.text).join('');
    const out = extrairJson(texto);
    if (!out?.secoes || !Array.isArray(out.secoes)) return responder(res, 502, { error: 'Resposta da IA fora do formato. Tente novamente.' });
    const ids = new Set(secoes.map((s: any) => s.id));
    const validas = out.secoes.filter((s: any) => s && ids.has(s.id) && typeof s.conteudoHtml === 'string' && s.conteudoHtml.trim());
    return responder(res, 200, { secoes: validas, source: 'claude' });
  } catch (e: any) {
    return responder(res, 500, { error: e?.message || 'Erro interno.' });
  }
}
