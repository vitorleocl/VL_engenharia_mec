import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  construirPromptSistemaCausaRaiz,
  construirPromptUsuarioCausaRaiz,
  type DadosEntradaCausaRaiz,
} from '../../src/lib/motorLaudoCausaRaiz';
import { responder, lerCorpo, usuarioAutorizado } from './_comum';

/**
 * POST /api/ai/claude-laudo-causa-raiz
 * Preenche o Laudo de Causa Raiz usando o Claude (API da Anthropic).
 *
 * Variáveis de ambiente (Vercel > Settings > Environment Variables):
 *   ANTHROPIC_API_KEY       chave da Anthropic (somente no servidor)
 *   ANTHROPIC_MODEL         opcional (padrão: claude-sonnet-5-5)
 *   MASTER_EMAIL            e-mail autorizado a usar a IA (o mesmo do VITE_MASTER_EMAIL)
 *   (a chave pública do Firebase vem de firebase-applet-config.json)
 *
 * Usa apenas módulos nativos + fetch (a função da Vercel não inclui o node_modules).
 */

const REGRAS_EXTRAS = `
REGRAS ADICIONAIS (prioridade máxima):
- Use SOMENTE os fatos fornecidos (datas, km, componentes, avarias, histórico). Não invente medições, números de peças, laudos de ensaio, nomes ou datas.
- Quando faltar um dado necessário, escreva "[VERIFICAR: descreva o dado]" no texto, em vez de supor.
- A causa raiz e o nexo causal devem ser apresentados como conclusão técnica fundamentada nas evidências informadas; se as evidências forem insuficientes, diga isso e indique qual ensaio ou verificação falta.
- Seções de fotos: não descreva imagens que não foram fornecidas; crie apenas legendas-modelo com "[FOTO: ...]".
- Responda SOMENTE com o JSON pedido, sem texto antes ou depois e sem blocos de código.`;

function extrairJson(texto: string): any | null {
  const limpo = texto.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  try {
    return JSON.parse(limpo);
  } catch {
    const a = limpo.indexOf('{');
    const b = limpo.lastIndexOf('}');
    if (a >= 0 && b > a) {
      try { return JSON.parse(limpo.slice(a, b + 1)); } catch { /* segue */ }
    }
    return null;
  }
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (String(req.method).toUpperCase() !== 'POST') {
    return responder(res, 405, { error: 'Use POST.' });
  }
  if (!(await usuarioAutorizado(req))) {
    return responder(res, 401, { error: 'Não autorizado. Entre no painel e tente novamente.' });
  }
  const chave = process.env.ANTHROPIC_API_KEY;
  if (!chave) {
    return responder(res, 503, { error: 'ANTHROPIC_API_KEY não configurada no servidor.' });
  }

  const dados: DadosEntradaCausaRaiz = await lerCorpo(req);
  if (!dados?.ativo || !dados?.evidencias) {
    return responder(res, 400, { error: 'Dados do laudo incompletos.' });
  }

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': chave,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5',
        max_tokens: 16000,
        temperature: 0.2,
        system: construirPromptSistemaCausaRaiz() + '\n' + REGRAS_EXTRAS,
        messages: [{ role: 'user', content: construirPromptUsuarioCausaRaiz(dados) }],
      }),
    });
    const corpo: any = await r.json();
    if (!r.ok) {
      return responder(res, 502, { error: corpo?.error?.message || 'Falha na API da Anthropic.' });
    }
    const texto = (corpo?.content || []).filter((b: any) => b.type === 'text').map((b: any) => b.text).join('');
    const json = extrairJson(texto);
    if (!json?.secoes || !Array.isArray(json.secoes) || !json.secoes.length) {
      return responder(res, 502, { error: 'Resposta da IA fora do formato esperado. Tente novamente.' });
    }
    return responder(res, 200, { ...json, mock: false, source: 'claude', stopReason: corpo.stop_reason });
  } catch (e: any) {
    return responder(res, 500, { error: e?.message || 'Erro interno.' });
  }
}
