import { LeadProspeccao, LeadServicoSugerido, ServicoProspeccao } from '../types/prospeccao';

const BUSINESS_EMAIL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.com.br', 'outlook.com',
  'hotmail.com', 'hotmail.com.br', 'live.com', 'icloud.com', 'uol.com.br',
  'bol.com.br', 'proton.me', 'protonmail.com',
]);

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function normalizarEmail(email?: string | null): string {
  return String(email || '').trim().toLowerCase();
}

export function emailCorporativo(email?: string | null): boolean {
  const normalized = normalizarEmail(email);
  if (!EMAIL_REGEX.test(normalized)) return false;
  return !BUSINESS_EMAIL_DOMAINS.has(normalized.split('@').pop() || '');
}

export function normalizarCnpj(cnpj?: string | null): string {
  return String(cnpj || '').replace(/\D/g, '');
}

export function normalizarTelefoneProspeccao(telefone?: string | null): {
  e164: string | null;
  tipo: 'celular' | 'fixo' | 'desconhecido';
} {
  let digits = String(telefone || '').replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    digits = digits.slice(2);
  }
  if (digits.length !== 10 && digits.length !== 11) {
    return { e164: null, tipo: 'desconhecido' };
  }
  const ddd = Number(digits.slice(0, 2));
  if (ddd < 11 || ddd > 99) return { e164: null, tipo: 'desconhecido' };
  const subscriber = digits.slice(2);
  if (subscriber.startsWith('0')) return { e164: null, tipo: 'desconhecido' };
  const celular = digits.length === 11 && subscriber[0] === '9';
  return { e164: `+55${digits}`, tipo: celular ? 'celular' : 'fixo' };
}

function normalizarTexto(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function cnaeCorresponde(leadCnae: string, alvoCnae: string): boolean {
  const lead = leadCnae.replace(/\D/g, '');
  const alvo = alvoCnae.replace(/\D/g, '');
  if (!lead || !alvo) return false;
  return lead === alvo || (alvo.length >= 5 && lead.startsWith(alvo.slice(0, 5)));
}

export function calcularScoreServico(
  lead: Pick<LeadProspeccao, 'razaoSocial' | 'nomeFantasia' | 'cnae' | 'cnaesSecundarios' | 'segmento' | 'porte'>,
  servico: ServicoProspeccao,
): LeadServicoSugerido {
  const cnaesLead = [lead.cnae || '', ...(lead.cnaesSecundarios || [])];
  const corpus = normalizarTexto([lead.razaoSocial, lead.nomeFantasia, lead.segmento].filter(Boolean).join(' '));
  const matchCnae = servico.segmentos_alvo.some((segmento) =>
    segmento.cnaes.some((cnae) => cnaesLead.some((leadCnae) => cnaeCorresponde(leadCnae, cnae.codigo))),
  );
  const keywordsMatch = Array.from(new Set(servico.segmentos_alvo.flatMap((segmento) => segmento.palavras_chave)))
    .filter((keyword) => normalizarTexto(keyword).length > 2 && corpus.includes(normalizarTexto(keyword)));
  const porte = normalizarTexto(lead.porte || '');
  const porteBonus = /grande|medio|m[eé]dio|demais|lucro real/.test(porte) ? 10 : 0;
  const score = Math.min(100, (matchCnae ? 65 : 0) + Math.min(25, keywordsMatch.length * 12) + porteBonus);
  const motivos = [
    matchCnae ? 'CNAE compatível com segmento-alvo validado pelo IBGE/CONCLA' : '',
    keywordsMatch.length ? `atividade/descrição relacionada: ${keywordsMatch.slice(0, 3).join(', ')}` : '',
    porteBonus ? 'porte sugere operação com ativos relevantes' : '',
  ].filter(Boolean);
  return { servicoId: servico.id, score, motivo: motivos.join('; ') || 'aderência baixa; revisar manualmente' };
}

export function sugerirServicos(
  lead: Parameters<typeof calcularScoreServico>[0],
  servicos: ServicoProspeccao[],
  scoreMinimo = 1,
): LeadServicoSugerido[] {
  return servicos
    .map((servico) => calcularScoreServico(lead, servico))
    .filter((suggestion) => suggestion.score >= scoreMinimo)
    .sort((a, b) => b.score - a.score);
}

export function deduplicarLeads(leads: LeadProspeccao[]): LeadProspeccao[] {
  const result: LeadProspeccao[] = [];
  const keys = new Set<string>();
  for (const lead of leads) {
    const candidates = [
      normalizarCnpj(lead.cnpj),
      normalizarEmail(lead.email),
      lead.telefoneE164 || normalizarTelefoneProspeccao(lead.whatsapp || lead.telefone).e164 || '',
    ].filter(Boolean);
    if (candidates.some((candidate) => keys.has(candidate))) continue;
    result.push(lead);
    candidates.forEach((candidate) => keys.add(candidate));
  }
  return result;
}

export function criarMensagemProspeccao(
  template: string,
  vars: {
    nome_empresa: string;
    cidade: string;
    servico: string;
    norma: string;
    dor: string;
    assinatura: string;
  },
): string {
  return template.replace(/\{\{\s*([a-z_]+)\s*\}\}/gi, (match, key: string) => {
    const value = vars[key as keyof typeof vars];
    return value === undefined ? match : value;
  });
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  const input = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (char === '"' && quoted && input[i + 1] === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(cell.trim());
      cell = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && input[i + 1] === '\n') i += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}
