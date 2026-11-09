/**
 * Gerador e Normalizador de Dados do Novo Layout de Proposta A4
 * Conformidade estrita com o protótipo aprovado (6 folhas A4)
 */

import { Orcamento, Cliente, OrcamentoParcela, OrcamentoCronogramaItem, OrcamentoAtivoItem, OrcamentoItemCalculo } from '../types';
import { generatePixPayload, generatePixSvgQr, validatePixPayload } from './pixEmv';

export interface NormalizedProposta {
  codigo: string;
  revisao: string;
  emitidaEm: string;
  emitidaEmIso: string;
  validadeDias: number;
  validaAte: string;
  validaAteIso: string;
  estaVencida: boolean;
  modo: 'executiva' | 'completa';
  totalFolhas: number;
  servico: string;
  escopoResumo: string;
  normasRef: string;
  prazoTexto: string;
  condicoesPagamentoTexto: string;
  incluiNf: boolean;
  
  // Contratada (VL Engenharia)
  contratada: {
    razaoSocial: string;
    cnpj: string;
    responsavel: string;
    crea: string;
    sede: string;
    email: string;
    telefone: string;
    whatsappUrl: string;
  };

  // Contratante (Cliente unificado)
  contratante: {
    razaoSocial: string;
    cnpjCpf: string;
    representante: string;
    cargo: string;
    localidade: string;
    email: string;
    telefone: string;
  };

  // Ativos (Fonte única)
  ativos: OrcamentoAtivoItem[];
  totalAtivosQtd: number;
  ativosResumoTexto: string;

  // Memorial de Cálculo
  itensCalculo: OrcamentoItemCalculo[];
  subtotalCalculado: number;
  valorTotal: number;
  somaBateComTotal: boolean;

  // Parcelamento
  parcelas: OrcamentoParcela[];
  somaParcelasBate: boolean;
  valorPrimeiraParcela: number;

  // Itens inclusos e excluídos
  incluso: string[];
  foraDoEscopo: string[];

  // Cronograma
  cronograma: OrcamentoCronogramaItem[];

  // PIX
  pix: {
    chave: string;
    tipoChave: string;
    titular: string;
    cidade: string;
    valor: number;
    payloadCopiaECola: string;
    svgQrCode: string;
    crcValido: boolean;
  };

  // Metodologia em 5 fases
  fasesMetodologia: Array<{
    numero: string;
    titulo: string;
    tag: string;
    descricao: string;
    entregavel: string;
  }>;
}

/**
 * Converte data ISO ou string genérica para formato DD/MM/AAAA
 */
export function formatarDataBr(dataStr?: string): string {
  if (!dataStr) {
    const hoje = new Date();
    return hoje.toLocaleDateString('pt-BR');
  }
  if (dataStr.includes('/')) return dataStr;
  try {
    const [ano, mes, dia] = dataStr.split('T')[0].split('-');
    if (ano && mes && dia) {
      return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
    }
  } catch {
    // fallback
  }
  return dataStr;
}

/**
 * Soma dias a uma data no formato DD/MM/AAAA ou YYYY-MM-DD
 */
export function somarDias(dataStr: string, dias: number): string {
  try {
    let d = new Date();
    if (dataStr.includes('/')) {
      const [dia, mes, ano] = dataStr.split('/');
      d = new Date(Number(ano), Number(mes) - 1, Number(dia));
    } else if (dataStr.includes('-')) {
      const [ano, mes, dia] = dataStr.split('T')[0].split('-');
      d = new Date(Number(ano), Number(mes) - 1, Number(dia));
    }
    d.setDate(d.getDate() + dias);
    return d.toLocaleDateString('pt-BR');
  } catch {
    return dataStr;
  }
}

/**
 * Normaliza os dados do orçamento e cliente para gerar a proposta em alta fidelidade
 */
export async function normalizePropostaData(
  orcamento: Orcamento, 
  cliente?: Cliente,
  modoOverride?: 'executiva' | 'completa'
): Promise<NormalizedProposta> {
  const modo: 'executiva' | 'completa' = modoOverride || orcamento.modoExportacaoPdf || 'completa';
  const totalFolhas = modo === 'executiva' ? 4 : 6;

  // Código e Revisão
  const codigo = orcamento.codigoProposta || `PROP-${new Date().getFullYear()}/001`;
  const revisaoRaw = orcamento.revisao !== undefined ? String(orcamento.revisao) : '00';
  const revisao = revisaoRaw.padStart(2, '0');

  // Datas e Validade
  const emitidaEmRaw = orcamento.emitidaEm || orcamento.propostaGeradaEm || orcamento.criadoEm || new Date().toISOString();
  const emitidaEm = formatarDataBr(emitidaEmRaw);
  const validadeDias = orcamento.validadeDias && orcamento.validadeDias > 0 ? orcamento.validadeDias : 15;
  const validaAte = orcamento.validaAte ? formatarDataBr(orcamento.validaAte) : somarDias(emitidaEm, validadeDias);

  // Verificação de vencimento
  let estaVencida = false;
  try {
    const [dia, mes, ano] = validaAte.split('/');
    const limite = new Date(Number(ano), Number(mes) - 1, Number(dia), 23, 59, 59);
    estaVencida = new Date() > limite;
  } catch {
    estaVencida = false;
  }

  // Contratada (VL Engenharia)
  const contratada = {
    razaoSocial: 'VL Engenharia Mecânica',
    cnpj: orcamento.contratadaCnpj || '48.243.689/0001-20',
    responsavel: 'Eng. Vitor Leonardo C. Linhares',
    crea: '182229949-0',
    sede: 'Recife / Paulista, PE',
    email: 'atendimento@vlengenhariamecanica.com.br',
    telefone: '(81) 98444-2592',
    whatsappUrl: 'https://wa.me/5581984442592',
  };

  // Contratante (Cliente) - Fonte única
  const primeiroContato = cliente?.contatos?.[0];
  const razaoSocialCliente = (
    orcamento.clienteNome || 
    cliente?.razaoSocial || 
    cliente?.nomeFantasia || 
    'Cliente Não Identificado'
  ).trim();

  const cnpjCpfCliente = (
    orcamento.cnpjCliente || 
    cliente?.cpfCnpj || 
    cliente?.cnpj || 
    'Não informado'
  ).trim();

  const representante = (
    orcamento.representanteNome || 
    primeiroContato?.nome || 
    'A/C Diretoria / Gerência de Operações'
  ).trim();

  const localidade = (
    orcamento.localidadeServico || 
    (cliente?.endereco?.cidade ? `${cliente.endereco.cidade}${cliente.endereco.estado ? ', ' + cliente.endereco.estado : ', PE'}` : 'Recife, PE')
  ).trim();

  const emailCliente = (
    orcamento.emailCliente || 
    primeiroContato?.email || 
    'Não informado'
  ).trim();

  const telefoneCliente = (
    orcamento.telefoneCliente || 
    primeiroContato?.telefone || 
    'Não informado'
  ).trim();

  const contratante = {
    razaoSocial: razaoSocialCliente,
    cnpjCpf: cnpjCpfCliente,
    representante,
    cargo: orcamento.representanteCargo || 'Representante Autorizado',
    localidade,
    email: emailCliente,
    telefone: telefoneCliente,
  };

  // Ativos - Fonte única
  let ativos: OrcamentoAtivoItem[] = [];
  if (orcamento.ativos && orcamento.ativos.length > 0) {
    ativos = orcamento.ativos;
  } else if (orcamento.ativosLista && orcamento.ativosLista.length > 0) {
    ativos = orcamento.ativosLista;
  } else if (orcamento.itensCalculo && orcamento.itensCalculo.length > 0) {
    ativos = orcamento.itensCalculo.map((item, idx) => ({
      id: item.id || `ativo-${idx}`,
      tipo: 'Equipamento / Ativo',
      identificacao: item.descricao,
      quantidade: item.quantidade || 1,
      valorUnitario: item.valorUnitario || item.valorTotal || 0,
      valorTotal: item.valorTotal || 0,
    }));
  } else {
    ativos = [{
      id: 'ativo-01',
      tipo: 'Equipamento Industrial',
      identificacao: orcamento.ativoIdentificacao || 'Ativo conforme escopo técnico',
      quantidade: 1,
      valorUnitario: orcamento.valor || 0,
      valorTotal: orcamento.valor || 0,
    }];
  }

  const totalAtivosQtd = ativos.reduce((acc, curr) => acc + (curr.quantidade || 1), 0);
  const ativosResumoTexto = orcamento.qtdEquipamentos || (
    totalAtivosQtd === 1 
      ? `01 ${ativos[0]?.identificacao || 'Ativo Principal'}` 
      : `${totalAtivosQtd} equipamentos inspecionados (${ativos.map(a => a.identificacao).join(', ').slice(0, 75)}...)`
  );

  // Memorial de Cálculo
  let itensCalculo: OrcamentoItemCalculo[] = [];
  if (orcamento.itensCalculo && orcamento.itensCalculo.length > 0) {
    itensCalculo = orcamento.itensCalculo;
  } else {
    itensCalculo = ativos.map((a, idx) => ({
      id: `item-${idx + 1}`,
      descricao: a.identificacao,
      quantidade: a.quantidade || 1,
      valorUnitario: a.valorUnitario || (orcamento.valor / (totalAtivosQtd || 1)),
      valorTotal: a.valorTotal || (orcamento.valor / (ativos.length || 1)),
    }));
  }

  const subtotalCalculado = itensCalculo.reduce((acc, item) => acc + (item.valorTotal || 0), 0);
  const valorTotal = orcamento.valor && orcamento.valor > 0 ? orcamento.valor : subtotalCalculado;
  const somaBateComTotal = Math.abs(subtotalCalculado - valorTotal) < 0.05;

  // Parcelamento
  let parcelas: OrcamentoParcela[] = [];
  if (orcamento.parcelas && orcamento.parcelas.length > 0) {
    parcelas = orcamento.parcelas;
  } else {
    const v50 = Math.round((valorTotal * 0.5) * 100) / 100;
    const vResto = Math.round((valorTotal - v50) * 100) / 100;
    parcelas = [
      { parcela: '1ª', gatilho: 'Na aprovação da proposta comercial', percentual: 50, valor: v50 },
      { parcela: '2ª', gatilho: 'Após a emissão do laudo técnico pericial e o registro da ART junto ao CREA-PE', percentual: 50, valor: vResto },
    ];
  }

  const somaParcelas = parcelas.reduce((acc, p) => acc + p.valor, 0);
  const somaParcelasBate = Math.abs(somaParcelas - valorTotal) < 0.05;
  const valorPrimeiraParcela = parcelas[0]?.valor || (valorTotal * 0.5);

  // Itens inclusos
  let incluso = orcamento.incluso && orcamento.incluso.length > 0 ? orcamento.incluso : [
    `Laudo técnico pericial com diagnóstico de conformidade técnica`,
    `Horas técnicas dedicadas de engenheiro mecânico legalmente habilitado`,
    `Deslocamento e vistoria in loco na unidade do cliente`,
    `Laudo conclusivo em PDF com assinatura eletrônica e certificado digital ICP-Brasil`,
    `ART registrada no CREA-PE, com taxas de homologação técnica inclusas`,
    `Nota fiscal de serviços eletrônica (NFS-e) emitida pela Contratada`,
  ];

  // Itens fora do escopo
  let foraDoEscopo = orcamento.foraDoEscopo && orcamento.foraDoEscopo.length > 0 ? orcamento.foraDoEscopo : [
    `Reparos, substituição de peças sobressalentes e intervenções mecânicas/civis corretivas nos ativos`,
    `Paradas de linha, bloqueios de segurança e estruturas de acesso (andaimes, plataformas), a cargo do contratante`,
    `Novas medições ou re-inspeções após intervenções corretivas, sob proposta complementar`,
  ];

  // Cronograma
  let cronograma = orcamento.cronograma && orcamento.cronograma.length > 0 ? orcamento.cronograma : [
    { marco: 'Dia 0', descricao: 'Aprovação formal e liquidação da 1ª parcela (entrada)' },
    { marco: 'Até 48 h úteis', descricao: 'Alinhamento de segurança, mobilização e agendamento da vistoria' },
    { marco: 'Vistoria in loco', descricao: 'Inspeção física, coleta de dados, medições e ensaios técnicos' },
    { marco: `Até ${orcamento.prazoDias || 7} dias úteis`, descricao: 'Emissão do Laudo conclusivo e protocolo da ART no CREA-PE' },
    { marco: 'Entrega final', descricao: 'Envio do dossiê definitivo e quitação da 2ª parcela' },
  ];

  // Configuração do PIX EMV
  const pixChave = orcamento.pixChave || orcamento.chavePix || '10287093409';
  const pixTitular = orcamento.pixTitular || 'VITOR LEONARDO CORDEIRO L';
  const pixCidade = orcamento.pixCidade || 'RECIFE';
  const pixValor = valorPrimeiraParcela;

  const pixPayloadCopiaECola = generatePixPayload({
    chave: pixChave,
    titular: pixTitular,
    cidade: pixCidade,
    valor: pixValor,
  });

  const pixValidacao = validatePixPayload(pixPayloadCopiaECola);
  const svgQrCode = await generatePixSvgQr(pixPayloadCopiaECola);

  // Metodologia em 5 fases
  const fasesMetodologia = [
    {
      numero: '01',
      titulo: 'Inspeção visual in loco e diagnóstico preliminar',
      tag: 'Vistoria de campo',
      descricao: 'Vistoria presencial minuciosa do ativo para mapeamento visual de não-conformidades de segurança, desgastes mecânicos, corrosão, fixações e análise física do ambiente operacional.',
      entregavel: 'levantamento fotográfico em alta resolução e registro de evidências fáticas.',
    },
    {
      numero: '02',
      titulo: 'Aplicação de checklists normativos técnicos',
      tag: 'Conformidade legal',
      descricao: `Auditoria item por item das exigências regulamentadoras vigentes (${orcamento.normasTecnicas || 'NR-11, NR-12, NR-13, ABNT NBR'}), analisando proteções mecânicas, distâncias de segurança, enclausuramentos e intertravamentos.`,
      entregavel: 'relatório de conformidade item a item conforme normas ABNT e NRs federais.',
    },
    {
      numero: '03',
      titulo: 'Ensaios físicos, medições e testes funcionais',
      tag: 'Instrumentado',
      descricao: 'Ensaios não destrutivos cabíveis, testes funcionais de paradas de emergência, medição de espessura por ultrassom, análise dimensional e verificação estrutural com instrumentos calibrados.',
      entregavel: 'tabela de grandezas físicas aferidas e comparação com parâmetros nominais de fábrica.',
    },
    {
      numero: '04',
      titulo: 'Emissão do laudo técnico pericial conclusivo',
      tag: 'Parecer pericial',
      descricao: 'Consolidação de parecer de engenharia diagnóstica, classificação de riscos, memória de cálculo e plano de ação corretivo detalhado com prioridades de intervenção.',
      entregavel: 'documento pericial formal assinado digitalmente, com validade jurídica perante órgãos fiscalizadores.',
    },
    {
      numero: '05',
      titulo: 'Anotação de Responsabilidade Técnica (ART)',
      tag: 'Homologação CREA',
      descricao: 'Registro formal da responsabilidade técnica do laudo perante o Conselho Regional de Engenharia e Agronomia de Pernambuco (CREA-PE), assegurando respaldo cível e criminal ao trabalho.',
      entregavel: 'certidão de registro da ART quitada, vinculada ao CNPJ do cliente e aos equipamentos.',
    },
  ];

  return {
    codigo,
    revisao,
    emitidaEm,
    emitidaEmIso: emitidaEmRaw,
    validadeDias,
    validaAte,
    validaAteIso: validaAte,
    estaVencida,
    modo,
    totalFolhas,
    servico: orcamento.servico || 'Laudo Técnico Pericial de Engenharia Mecânica',
    escopoResumo: orcamento.descricaoEscopo || 'Inspeção técnica in loco, ensaios não destrutivos e emissão de laudo pericial com ART/CREA-PE.',
    normasRef: orcamento.normasTecnicas || 'NR-11, NR-12, NR-13 e normas ABNT aplicáveis',
    prazoTexto: orcamento.prazoEntrega || `${orcamento.prazoDias || 7} dias úteis`,
    condicoesPagamentoTexto: orcamento.condicoesPagamento || '50% na aprovação e 50% após emissão do laudo e ART',
    incluiNf: orcamento.incluiNotaFiscal !== false,
    contratada,
    contratante,
    ativos,
    totalAtivosQtd,
    ativosResumoTexto,
    itensCalculo,
    subtotalCalculado,
    valorTotal,
    somaBateComTotal,
    parcelas,
    somaParcelasBate,
    valorPrimeiraParcela,
    incluso,
    foraDoEscopo,
    cronograma,
    pix: {
      chave: pixChave,
      tipoChave: orcamento.chavePixTipo || 'cpf',
      titular: pixTitular,
      cidade: pixCidade,
      valor: pixValor,
      payloadCopiaECola: pixPayloadCopiaECola,
      svgQrCode,
      crcValido: pixValidacao.valido,
    },
    fasesMetodologia,
  };
}

/**
 * Formata moeda BRL
 */
export function formatCurrencyBrl(val: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(val);
}
