/**
 * Fonte única e padronizada dos textos técnico-comerciais da VL Engenharia.
 *
 * Orçamentos (proposta técnico-comercial), checklists de campo e laudos devem
 * consumir daqui. Antes cada módulo repetia as mesmas frases com pequenas
 * variações, o que fazia um mesmo serviço aparecer com textos diferentes
 * dependendo de onde foi gerado.
 */

export const A_COMBINAR_COM_CLIENTE = 'A combinar com o cliente';

export const FORMA_PAGAMENTO_PADRAO = {
  id: '50_50',
  label: '50% + 50%',
  condicoes:
    '50% na aprovação da proposta comercial e 50% após a emissão do laudo técnico pericial e do registro da ART junto ao CREA-PE.',
  parcelas: [
    { parcela: '1ª', quando: 'Na aprovação da proposta comercial', percentual: 50 },
    { parcela: '2ª', quando: 'Após emissão do laudo técnico pericial e registro da ART no CREA-PE', percentual: 50 },
  ],
} as const;

export const FORMA_PAGAMENTO_APOS_LAUDO_ART = {
  id: '100_apos_laudo_art',
  label: '100% após o envio do laudo + ART',
  condicoes:
    '100% após o envio do laudo técnico pericial e da ART devidamente registrada junto ao CREA-PE.',
  parcelas: [
    { parcela: '1ª', quando: 'Após envio do laudo técnico pericial e da ART registrada no CREA-PE', percentual: 100 },
  ],
} as const;

export type FormaPagamentoId =
  | typeof FORMA_PAGAMENTO_PADRAO.id
  | typeof FORMA_PAGAMENTO_APOS_LAUDO_ART.id;

export const FORMAS_PAGAMENTO = [
  FORMA_PAGAMENTO_PADRAO,
  FORMA_PAGAMENTO_APOS_LAUDO_ART,
] as const;

export function obterFormaPagamento(id?: string | null) {
  return FORMAS_PAGAMENTO.find(opcao => opcao.id === id) || FORMA_PAGAMENTO_PADRAO;
}

/** Valores usados quando o usuário não preenche um campo operacional. */
export const TEXTO_OPERACIONAL_PADRAO = {
  ativosInspecionados: '01 Ativo Principal',
  horasTecnicas: '16 horas de engenharia',
  mobilizacao: 'Imediata / até 48h úteis',
} as const;

/** Opções rápidas oferecidas nos formulários. */
export const OPCOES_TEXTO_OPERACIONAL = [
  A_COMBINAR_COM_CLIENTE,
  '01 Ativo Principal',
  '02 Ativos Principais',
  '16 horas de engenharia',
  '24 horas de engenharia',
  'Imediata / até 48h úteis',
  'A definir em reunião técnica',
] as const;

/** Diretrizes que aparecem na proposta e no checklist/laudo. */
export const DIRETRIZES_OPERACIONAIS_PADRAO: string[] = [
  'Livre acesso às instalações e máquinas objeto do laudo no dia e horário previamente agendados;',
  'Acompanhamento por responsável técnico, encarregado de manutenção ou operador da máquina;',
  'Disponibilização de manuais de operação, prontuários anteriores ou diagramas caso existentes;',
  'Observância de protocolos de segurança do trabalho do pátio industrial (EPIs aplicáveis).',
];

export const TITULO_METODOLOGIA_PADRAO = 'Metodologia de engenharia em etapas';

/** Fases canônicas da metodologia — usadas por propostas, A4 e laudos. */
export interface FaseMetodologiaPadrao {
  id: string;
  faseNumero: number;
  tag: string;
  titulo: string;
  subtituloBadge: string;
  descricao: string;
  entregavel: string;
  ativa: boolean;
}

export const FASES_METODOLOGIA_PADRAO_TEXTO: FaseMetodologiaPadrao[] = [
  {
    id: 'fase-1',
    faseNumero: 1,
    tag: 'Fase',
    titulo: 'Inspeção visual in loco e diagnóstico preliminar',
    subtituloBadge: 'Vistoria de campo',
    descricao: 'Vistoria presencial minuciosa do ativo para mapeamento visual de não-conformidades de segurança, desgastes mecânicos, corrosão, fixações e análise física do ambiente operacional.',
    entregavel: 'Levantamento fotográfico em alta resolução e registro de evidências fáticas.',
    ativa: true,
  },
  {
    id: 'fase-2',
    faseNumero: 2,
    tag: 'Fase',
    titulo: 'Aplicação de checklists normativos técnicos',
    subtituloBadge: 'Conformidade legal',
    descricao: 'Auditoria item por item das exigências regulamentadoras vigentes ({normasTecnicas}), analisando proteções mecânicas, distâncias de segurança (ABNT NBR ISO 13857/13855), enclausuramentos e intertravamentos.',
    entregavel: 'Relatório de conformidade item a item conforme normas ABNT e NRs federais.',
    ativa: true,
  },
  {
    id: 'fase-3',
    faseNumero: 3,
    tag: 'Fase',
    titulo: 'Ensaios físicos, medições e testes funcionais',
    subtituloBadge: 'Instrumentado',
    descricao: 'Ensaios não destrutivos cabíveis (ultrassom, líquidos penetrantes), testes funcionais de paradas de emergência, medição de espessura de chapas, verificação de folgas mecânicas e integridade de soldas.',
    entregavel: 'Planilha de grandezas medidas com instrumentos calibrados e rastreáveis RBC/Inmetro.',
    ativa: true,
  },
  {
    id: 'fase-4',
    faseNumero: 4,
    tag: 'Fase',
    titulo: 'Dossiê técnico, matriz de risco e parecer conclusivo',
    subtituloBadge: 'Engenharia diagnóstica',
    descricao: 'Elaboração de laudo pericial detalhado contendo análise de risco quantitativa (HRN/SIL), memorial técnico descritivo, plano de ação corretivo claro e cronograma prioritário de adequações físicas.',
    entregavel: 'Laudo pericial conclusivo digital em PDF com assinatura eletrônica e certificado digital.',
    ativa: true,
  },
  {
    id: 'fase-5',
    faseNumero: 5,
    tag: 'Fase',
    titulo: 'Emissão e registro oficial da ART CREA-PE',
    subtituloBadge: 'Homologação legal',
    descricao: 'Anotação de Responsabilidade Técnica emitida eletronicamente junto ao CREA-PE, conferindo fé pública, respaldo institucional e plena validade jurídica perante fiscalizações do Ministério do Trabalho, CBMPE e seguradoras.',
    entregavel: 'Certidão oficial de ART quitada com chave de autenticidade e QR Code do CREA-PE.',
    ativa: true,
  },
];

export const TEXTO_METODOLOGIA_PADRAO =
  'A execução segue metodologia de engenharia em etapas: inspeção visual in loco, ' +
  'aplicação de checklists normativos, ensaios e medições, análise técnica com matriz de risco ' +
  'e, por fim, emissão do laudo com registro da ART junto ao CREA-PE.';

export const TEXTO_NFS_E_COM =
  'A emissão de Nota Fiscal de Serviço Eletrônica (NFS-e) está incluída no valor proposto, ' +
  'conforme legislação municipal vigente.';

export const TEXTO_NFS_E_SEM =
  'Os valores ora propostos não incluem emissão de Nota Fiscal de Serviço Eletrônica (NFS-e), ' +
  'que poderá ser emitida mediante acordo comercial entre as partes.';

export const TEXTO_ART =
  'O laudo técnico será emitido com Anotação de Responsabilidade Técnica (ART) registrada junto ao CREA-PE.';

/** Texto único para o cabeçalho operacional de checklists e laudos. */
export function obterResumoOperacional(dados: {
  ativosInspecionados?: string | null;
  horasTecnicas?: string | null;
  mobilizacao?: string | null;
}) {
  return [
    `Ativos inspecionados: ${dados.ativosInspecionados || TEXTO_OPERACIONAL_PADRAO.ativosInspecionados}`,
    `Horas técnicas: ${dados.horasTecnicas || TEXTO_OPERACIONAL_PADRAO.horasTecnicas}`,
    `Mobilização: ${dados.mobilizacao || TEXTO_OPERACIONAL_PADRAO.mobilizacao}`,
  ].join(' · ');
}

export function obterDiretrizesOperacionaisHtml(): string {
  return `<ul class="space-y-1.5 list-disc list-inside text-slate-700 leading-relaxed">
    ${DIRETRIZES_OPERACIONAIS_PADRAO.map(item => `<li>${item}</li>`).join('\n    ')}
  </ul>`;
}
