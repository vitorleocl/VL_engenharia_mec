import type { IncomingMessage, ServerResponse } from 'node:http';
import { responder, lerCorpo, usuarioAutorizado } from './_comum';

/**
 * POST /api/ai/claude-prospeccao
 * Escreve a mensagem de prospecção (WhatsApp ou e-mail) para um lead.
 * Entrada: { lead, canal: 'whatsapp'|'email', etapa: 1|2|3, remetente: {nome, cargo}, servico?, observacao? }
 * Saída:   { assunto?, mensagem }
 */
const SERVICOS = `Serviços da VL Engenharia (Engenharia Mecânica, Paulista-PE):
- Laudos e inspeções técnicas de máquinas e equipamentos; adequação à NR-12 (segurança em máquinas), apreciação de risco
- Inspeção de vasos de pressão, caldeiras e tubulações (NR-13), equipamentos de elevação de cargas (guindastes/munck, pontes rolantes)
- Climatização: projetos HVAC-R, PMOC, carga térmica; modelagem BIM em Revit
- Perícias e laudos de falha mecânica (causa raiz), laudos veiculares e de frota, transporte escolar
- Simulação dinâmica por elementos finitos (FEA) para projetos mecânicos
- Manutenção preventiva e relatórios técnicos, com ART registrada no CREA-PE`;

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
  if (!b.lead?.empresa && !b.lead?.nome) return responder(res, 400, { error: 'Lead sem nome/empresa.' });
  const canal = b.canal === 'email' ? 'email' : 'whatsapp';
  const etapa = [1, 2, 3].includes(Number(b.etapa)) ? Number(b.etapa) : 1;
  const rem = b.remetente || {};

  const system = `Você escreve mensagens de prospecção em português do Brasil para a VL Engenharia.
${SERVICOS}

Regras:
- Tom humano, cordial e direto; sem exageros, sem promessas de preço ou prazo, sem inventar fatos sobre a empresa do lead (use só o que foi informado).
- Escolha o serviço mais relevante para o segmento do lead (ou o serviço indicado) e fale de um benefício concreto (segurança, conformidade, evitar parada, laudo com ART).
- WhatsApp: no máximo 600 caracteres, sem assunto, sem markdown, no máximo 1 emoji. E-mail: assunto curto (até 70 caracteres) e corpo de 90 a 150 palavras, com linha final oferecendo parar de receber contatos ("Se preferir não receber mais mensagens, é só responder avisando").
- Etapa 1 = primeiro contato. Etapa 2 = follow-up leve, lembrando o contato anterior sem cobrar. Etapa 3 = última mensagem, educada, deixando a porta aberta.
- Assine com o nome e o cargo do remetente informado, em nome da VL Engenharia. Nunca assine como outra pessoa.
- Responda SOMENTE com JSON: {"assunto":"... (vazio no WhatsApp)","mensagem":"..."}`;

  const user = `Lead: ${JSON.stringify(b.lead).slice(0, 2000)}
Canal: ${canal}
Etapa: ${etapa}
Serviço em foco: ${b.servico || '(escolha o mais adequado ao segmento)'}
Remetente: ${rem.nome || 'Vitor'}${rem.cargo ? ', ' + rem.cargo : ''}
Observação do remetente: ${String(b.observacao || '').slice(0, 800) || '(nenhuma)'}`;

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': chave, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5',
        max_tokens: 1200,
        temperature: 0.6,
        system,
        messages: [{ role: 'user', content: user }],
      }),
    });
    const j: any = await r.json();
    if (!r.ok) return responder(res, 502, { error: j?.error?.message || 'Falha na API da Anthropic.' });
    const texto = (j?.content || []).filter((c: any) => c.type === 'text').map((c: any) => c.text).join('');
    const out = extrairJson(texto);
    if (!out?.mensagem) return responder(res, 502, { error: 'Resposta da IA fora do formato. Tente novamente.' });
    return responder(res, 200, { assunto: String(out.assunto || ''), mensagem: String(out.mensagem), source: 'claude' });
  } catch (e: any) {
    return responder(res, 500, { error: e?.message || 'Erro interno.' });
  }
}
