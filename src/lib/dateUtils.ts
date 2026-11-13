/**
 * Utilitários de data seguros contra deslocamento de fuso horário (UTC vs horário local).
 * Evita que strings 'YYYY-MM-DD' sejam interpretadas como meia-noite UTC e caiam no dia/mês anterior no Brasil.
 */

export function getHojeLocalYmd(): string {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export function toDateInputValue(raw?: string | null): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  const matchYmd = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (matchYmd) {
    return trimmed;
  }
  const d = new Date(trimmed);
  if (isNaN(d.getTime())) return '';
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export function parseDataLocalSegura(raw?: string | null): Date {
  if (!raw) return new Date();
  const trimmed = raw.trim();
  const matchYmd = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (matchYmd) {
    const [, y, m, d] = matchYmd;
    return new Date(Number(y), Number(m) - 1, Number(d), 12, 0, 0);
  }
  const parsed = new Date(trimmed);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function obterYmLocal(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function formatarDataBrSegura(raw?: string | null): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  const matchYmd = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (matchYmd) {
    const [, y, m, d] = matchYmd;
    return `${d}/${m}/${y}`;
  }
  const parsed = new Date(trimmed);
  if (isNaN(parsed.getTime())) return '';
  return parsed.toLocaleDateString('pt-BR');
}

export function formatarMesLongoDeYm(ymOrYmd: string): string {
  const match = ymOrYmd.trim().match(/^(\d{4})-(\d{2})/);
  if (!match) return '';
  const ano = Number(match[1]);
  const mes = Number(match[2]);
  const d = new Date(ano, (mes || 1) - 1, 1, 12, 0, 0);
  const label = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}
