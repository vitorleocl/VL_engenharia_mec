import {
  ChecklistCriticidade,
  ChecklistModeloItemDef,
  ChecklistModeloServico,
  TipoRespostaChecklist,
} from '../types';

export const CHECKLIST_CSV_HEADERS = [
  'modelo_id',
  'modelo_nome',
  'modelo_subtitulo',
  'norma_modelo',
  'numero',
  'criterio',
  'norma_item',
  'secao_laudo',
  'tipo_resposta',
  'unidade',
  'metodo_verificacao',
  'criticidade',
  'impeditivo',
  'foto_obrigatoria',
  'foto_obrigatoria_se_nao_conforme',
] as const;

type LinhaImportacao = Record<(typeof CHECKLIST_CSV_HEADERS)[number], string>;

export interface ResultadoImportacaoChecklist {
  modelos: ChecklistModeloServico[];
  erros: string[];
}

const TIPOS_RESPOSTA: TipoRespostaChecklist[] = [
  'conformidade', 'medida', 'informacao', 'sim_nao', 'multipla_escolha',
  'data', 'C_NC_NA', 'VALOR', 'SELECAO', 'FOTO',
];
const METODOS = ['visual', 'dimensional', 'end', 'funcional', 'documental', 'instrumental'] as const;
const CRITICIDADES: ChecklistCriticidade[] = ['critica', 'alta', 'media', 'baixa', 'observacao'];

function lerCsv(texto: string): string[][] {
  const primeiraLinha = texto.replace(/^\uFEFF/, '').split(/\r?\n/, 1)[0] || '';
  const delimitador = (primeiraLinha.match(/;/g) || []).length > (primeiraLinha.match(/,/g) || []).length ? ';' : ',';
  const linhas: string[][] = [];
  let linha: string[] = [];
  let campo = '';
  let entreAspas = false;
  const fonte = texto.replace(/^\uFEFF/, '');

  for (let i = 0; i < fonte.length; i += 1) {
    const caractere = fonte[i];
    if (caractere === '"') {
      if (entreAspas && fonte[i + 1] === '"') {
        campo += '"';
        i += 1;
      } else {
        entreAspas = !entreAspas;
      }
    } else if (caractere === delimitador && !entreAspas) {
      linha.push(campo.trim());
      campo = '';
    } else if ((caractere === '\n' || caractere === '\r') && !entreAspas) {
      if (caractere === '\r' && fonte[i + 1] === '\n') i += 1;
      linha.push(campo.trim());
      if (linha.some((valor) => valor !== '')) linhas.push(linha);
      linha = [];
      campo = '';
    } else {
      campo += caractere;
    }
  }
  linha.push(campo.trim());
  if (linha.some((valor) => valor !== '')) linhas.push(linha);
  return linhas;
}

function interpretarBooleano(valor: string): boolean | null {
  const normalizado = valor.trim().toLocaleLowerCase('pt-BR');
  if (!normalizado) return false;
  if (['sim', 's', 'true', '1', 'obrigatorio', 'obrigatório'].includes(normalizado)) return true;
  if (['nao', 'não', 'n', 'false', '0'].includes(normalizado)) return false;
  return null;
}

function esc(campo: string): string {
  return `"${campo.replace(/"/g, '""')}"`;
}

export function baixarModeloChecklistCsv(): void {
  const exemplo = [
    'exemplo-nr12',
    'Modelo de exemplo - NR-12',
    'Apague esta linha antes de importar',
    'NR-12 / ABNT NBR 12100',
    '1.1',
    'Verificar se as proteções móveis estão íntegras e intertravadas',
    'NR-12',
    'Proteções e dispositivos de segurança',
    'conformidade',
    '',
    'visual',
    'alta',
    'não',
    'sim',
    'sim',
  ];
  const conteudo = [CHECKLIST_CSV_HEADERS, exemplo]
    .map((linha) => linha.map((valor) => esc(valor)).join(';'))
    .join('\r\n');
  const blob = new Blob([`\uFEFF${conteudo}\r\n`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'modelo-importacao-checklists.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export function analisarImportacaoChecklistCsv(
  conteudo: string,
  modelosAtuais: ChecklistModeloServico[],
): ResultadoImportacaoChecklist {
  const linhas = lerCsv(conteudo);
  if (linhas.length < 2) {
    return { modelos: [], erros: ['O CSV precisa conter o cabeçalho e ao menos uma linha de critério.'] };
  }

  const cabecalhos = linhas[0].map((valor) => valor.trim().toLocaleLowerCase('pt-BR'));
  const indices = CHECKLIST_CSV_HEADERS.map((cabecalho) => cabecalhos.indexOf(cabecalho));
  const erros: string[] = [];
  const ausentes = CHECKLIST_CSV_HEADERS.filter((_, i) => indices[i] < 0);
  if (ausentes.length) {
    return { modelos: [], erros: [`Colunas obrigatórias ausentes: ${ausentes.join(', ')}.`] };
  }

  const modelosMap = new Map<string, ChecklistModeloServico>();
  const metadados = new Map<string, string>();
  const numerosPorModelo = new Map<string, Set<string>>();

  linhas.slice(1).forEach((colunas, index) => {
    const numeroLinha = index + 2;
    const linha = Object.fromEntries(
      CHECKLIST_CSV_HEADERS.map((header, i) => [header, colunas[indices[i]] || '']),
    ) as LinhaImportacao;
    const id = linha.modelo_id.trim().toLocaleLowerCase('pt-BR');
    const nome = linha.modelo_nome.trim();
    const normaModelo = linha.norma_modelo.trim();
    const numero = linha.numero.trim();
    const criterio = linha.criterio.trim();

    if (!/^[a-z0-9][a-z0-9_-]*$/.test(id)) erros.push(`Linha ${numeroLinha}: modelo_id deve usar apenas letras minúsculas, números, hífen ou sublinhado.`);
    if (!nome) erros.push(`Linha ${numeroLinha}: modelo_nome é obrigatório.`);
    if (!normaModelo) erros.push(`Linha ${numeroLinha}: norma_modelo é obrigatória.`);
    if (!numero) erros.push(`Linha ${numeroLinha}: numero é obrigatório.`);
    if (!criterio) erros.push(`Linha ${numeroLinha}: criterio é obrigatório.`);
    if (!linha.norma_item.trim()) erros.push(`Linha ${numeroLinha}: norma_item é obrigatória.`);
    if (!linha.secao_laudo.trim()) erros.push(`Linha ${numeroLinha}: secao_laudo é obrigatória.`);

    const tipoResposta = linha.tipo_resposta.trim() as TipoRespostaChecklist;
    const metodo = linha.metodo_verificacao.trim() as (typeof METODOS)[number];
    const criticidade = linha.criticidade.trim() as ChecklistCriticidade;
    if (tipoResposta && !TIPOS_RESPOSTA.includes(tipoResposta)) erros.push(`Linha ${numeroLinha}: tipo_resposta inválido (${tipoResposta}).`);
    if (metodo && !METODOS.includes(metodo)) erros.push(`Linha ${numeroLinha}: metodo_verificacao inválido (${metodo}).`);
    if (criticidade && !CRITICIDADES.includes(criticidade)) erros.push(`Linha ${numeroLinha}: criticidade inválida (${criticidade}).`);

    const impeditivo = interpretarBooleano(linha.impeditivo);
    const fotoObrigatoria = interpretarBooleano(linha.foto_obrigatoria);
    const fotoSeNaoConforme = interpretarBooleano(linha.foto_obrigatoria_se_nao_conforme);
    if (impeditivo === null) erros.push(`Linha ${numeroLinha}: impeditivo deve ser sim ou não.`);
    if (fotoObrigatoria === null) erros.push(`Linha ${numeroLinha}: foto_obrigatoria deve ser sim ou não.`);
    if (fotoSeNaoConforme === null) erros.push(`Linha ${numeroLinha}: foto_obrigatoria_se_nao_conforme deve ser sim ou não.`);

    if (!id) return;
    const assinatura = JSON.stringify([nome, linha.modelo_subtitulo.trim(), normaModelo]);
    const anterior = metadados.get(id);
    if (anterior && anterior !== assinatura) erros.push(`Linha ${numeroLinha}: nome, subtítulo ou norma do modelo "${id}" diverge das outras linhas desse modelo.`);
    metadados.set(id, assinatura);

    const usados = numerosPorModelo.get(id) || new Set<string>();
    if (usados.has(numero)) erros.push(`Linha ${numeroLinha}: o número "${numero}" está duplicado no modelo "${id}".`);
    usados.add(numero);
    numerosPorModelo.set(id, usados);

    const atual = modelosMap.get(id) || modelosAtuais.find((modelo) => modelo.id === id);
    const item: ChecklistModeloItemDef = {
      id: `${id}-csv-${numero.replace(/[^a-zA-Z0-9_-]/g, '-')}`,
      numero,
      texto: criterio,
      norma: linha.norma_item.trim(),
      secaoLaudo: linha.secao_laudo.trim(),
      ...(tipoResposta ? { tipoResposta } : {}),
      ...(linha.unidade.trim() ? { unidade: linha.unidade.trim() } : {}),
      ...(metodo ? { metodoVerificacao: metodo } : {}),
      ...(criticidade ? { criticidade } : {}),
      impeditivo: impeditivo || false,
      fotoObrigatoria: fotoObrigatoria || false,
      exigeFotoSeNaoConforme: fotoSeNaoConforme || false,
    };
    modelosMap.set(id, {
      id,
      nome: nome || atual?.nome || id,
      subtitulo: linha.modelo_subtitulo.trim() || undefined,
      norma: normaModelo || atual?.norma || '',
      secoesLaudoPadrao: [...new Set([...(atual?.secoesLaudoPadrao || []), linha.secao_laudo.trim()].filter(Boolean))],
      itens: [...(modelosMap.get(id)?.itens || []), item],
    });
  });

  return { modelos: [...modelosMap.values()], erros };
}
