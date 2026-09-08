import { HRNResult, HRNValues } from '../types';

export const HRN_LO_OPTIONS = [
  { value: 0.033, label: 'Quase Impossível (0.033)' },
  { value: 1, label: 'Altamente Improvável (1)' },
  { value: 2, label: 'Improvável (2)' },
  { value: 5, label: 'Possível (5)' },
  { value: 8, label: 'Provável (8)' },
  { value: 10, label: 'Muito Provável (10)' },
  { value: 15, label: 'Certo / Iminente (15)' },
];

export const HRN_FE_OPTIONS = [
  { value: 0.1, label: 'Anual (0.1)' },
  { value: 0.2, label: 'Mensal (0.2)' },
  { value: 1, label: 'Semanal (1)' },
  { value: 2.5, label: 'Diário (2.5)' },
  { value: 4, label: 'Várias vezes por dia / Por hora (4)' },
  { value: 5, label: 'Constante / Contínuo (5)' },
];

export const HRN_DPH_OPTIONS = [
  { value: 0.1, label: 'Arranhão / Hematoma superficial (0.1)' },
  { value: 0.5, label: 'Laceração leve / Corte sem sutura (0.5)' },
  { value: 1, label: 'Fratura simples / Queimadura leve (1)' },
  { value: 2, label: 'Fratura complexa / Perda de falange (2)' },
  { value: 4, label: 'Amputação de mão/pé ou perda visual (4)' },
  { value: 8, label: 'Invalidez permanente / Amputação múltipla (8)' },
  { value: 15, label: 'Fatalidade / Morte (15)' },
];

export const HRN_NP_OPTIONS = [
  { value: 1, label: '1 a 2 pessoas (1)' },
  { value: 2, label: '3 a 7 pessoas (2)' },
  { value: 4, label: '8 a 15 pessoas (4)' },
  { value: 8, label: '16 a 50 pessoas (8)' },
  { value: 12, label: 'Mais de 50 pessoas (12)' },
];

export function calculateHRN(values?: HRNValues): HRNResult {
  if (!values) {
    return {
      score: 0,
      nivel: 'Insignificante',
      cor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      recomendacao: 'Risco desprezível. Manter boas práticas operacionais.',
    };
  }

  const { lo, fe, dph, np } = values;
  const score = Math.round(lo * fe * dph * np * 100) / 100;

  if (score <= 1) {
    return {
      score,
      nivel: 'Insignificante',
      cor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      recomendacao: 'Risco aceitável. Manter manutenções preventivas.',
    };
  } else if (score <= 5) {
    return {
      score,
      nivel: 'Baixo',
      cor: 'bg-green-100 text-green-800 border-green-300',
      recomendacao: 'Atenção rotineira. Medidas preventivas padrão da NR-12.',
    };
  } else if (score <= 50) {
    return {
      score,
      nivel: 'Médio',
      cor: 'bg-amber-100 text-amber-800 border-amber-300',
      recomendacao: 'Necessária intervenção técnica planejada no plano de ação.',
    };
  } else if (score <= 500) {
    return {
      score,
      nivel: 'Alto',
      cor: 'bg-orange-100 text-orange-800 border-orange-300',
      recomendacao: 'Intervenção prioritária em curto prazo. Instalação de intertravamentos.',
    };
  } else if (score <= 1500) {
    return {
      score,
      nivel: 'Muito Alto',
      cor: 'bg-red-100 text-red-800 border-red-300',
      recomendacao: 'Risco iminente. Interromper operação até proteção física categoria 4.',
    };
  } else {
    return {
      score,
      nivel: 'Crítico',
      cor: 'bg-purple-100 text-purple-900 border-purple-400 font-bold',
      recomendacao: 'RISCO CRÍTICO / GRAVE E IMINENTE. Bloqueio mecânico imediato (LOTO).',
    };
  }
}
