import type { IncomingMessage, ServerResponse } from 'node:http';
// Funções da Vercel (package.json é type=module): sem imports relativos, tudo neste arquivo.


function responder(res: ServerResponse, status: number, dados: unknown): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(dados));
}

function lerCorpo(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    const partes: Buffer[] = [];
    req.on('data', (p: Buffer) => partes.push(Buffer.from(p)));
    req.on('end', () => {
      try {
        const t = Buffer.concat(partes).toString('utf-8');
        resolve(t ? JSON.parse(t) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

/** Confere o token de login do Firebase e se o e-mail é o autorizado. */
async function usuarioAutorizado(req: IncomingMessage): Promise<boolean> {
  const auth = String(req.headers['authorization'] || '');
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const apiKey = process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY || 'AIzaSyCuTq8f2U-_Q0HW1wBIpml0QU2RgRx8ELw';
  // MASTER_EMAIL aceita vários e-mails separados por vírgula (ex.: master e administrativo).
  const permitidos = (process.env.MASTER_EMAIL || process.env.VITE_MASTER_EMAIL || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
  if (!token || !apiKey || !permitidos.length) return false;
  try {
    const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token }),
    });
    if (!r.ok) return false;
    const j: any = await r.json();
    const u = j?.users?.[0];
    return Boolean(u?.email) && permitidos.includes(String(u.email).toLowerCase()) && u.emailVerified !== false;
  } catch {
    return false;
  }
}



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
1. Cada conteudoHtml é HTML limpo e simples, SEM classes, SEM style e SEM <div>: use <p> para texto corrido (parágrafos de 3 a 5 linhas), <h4> para subtítulos curtos, <ul>/<ol> com <li> para listas, <strong> para termos-chave, <table><thead><tr><th>..</th></tr></thead><tbody><tr><td>..</td></tr></tbody></table> para dados comparativos ou de identificação (tabelas com no máximo 5 colunas) e <blockquote><p>..</p></blockquote> para destacar o parecer, o resultado ou um alerta importante (no máximo um por seção). Sem markdown nem blocos de código.
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
