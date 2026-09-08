import { ModuloLaudoCatalogo, Cliente, Ativo, Orcamento, AgendaVistoria, Laudo, LaudoTemplate } from '../types';

export const MODULOS_LAUDO_CATALOGO: ModuloLaudoCatalogo[] = [
  {
    id: 'incendio-ppci-avcb',
    nome: 'Orquestrador de Laudos de Incêndio (PPCI / AVCB / CLCB)',
    status: 'NOVO',
    descricao: 'Levantamento Pré-Projeto PPCI, Vistoria para AVCB e Licença CLCB com aplicação automática das IT/NT estaduais',
    botao: 'Gerar Laudo com IA',
    escopo: 'PPCI • AVCB • CLCB',
    iconName: 'Flame',
  },
  {
    id: 'nr-12',
    nome: 'Laudo NR-12',
    status: 'Ativo',
    descricao: 'Segurança física, apreciação de riscos (HRN), categorização NBR 14153, não conformidades e plano de ação estruturado',
    botao: 'Iniciar Auditoria',
    escopo: '12 Requisitos',
    iconName: 'ShieldAlert',
  },
  {
    id: 'nr-13',
    nome: 'Laudo NR-13',
    status: 'Ativo',
    descricao: 'Vasos de pressão, caldeiras, tubulações e tanques; enquadramento de categoria por cálculo P×V, checklist de integridade e ensaios de campo',
    botao: 'Iniciar Auditoria',
    escopo: '10 Requisitos',
    iconName: 'Gauge',
  },
  {
    id: 'maquinas-pesadas',
    nome: 'Máquinas Pesadas',
    status: 'Ativo',
    descricao: 'Equipamentos móveis de grande porte (escavadeiras, retroescavadeiras, carregadeiras) sob NR-12, NR-11 e NR-18, incluindo ROPS/FOPS e HRN',
    botao: 'Iniciar Auditoria',
    escopo: '18 Requisitos',
    iconName: 'Tractor',
  },
  {
    id: 'caminhao-munck',
    nome: 'Caminhão Munck',
    status: 'Ativo',
    descricao: 'Laudos e integridade operacional para caminhões com guindaste articulado veicular, incluindo chassi, estabilizadores e acessórios de içamento',
    botao: 'Iniciar Auditoria',
    escopo: '15 Seções',
    iconName: 'Truck',
  },
  {
    id: 'guindaste-telescopico',
    nome: 'Guindaste Telescópico',
    status: 'Ativo',
    descricao: 'Conformidade de segurança para guindastes de lança telescópica/autopropelidos, com sistema de segurança operacional (LMI)',
    botao: 'Iniciar Auditoria',
    escopo: '15 Seções',
    iconName: 'Cable',
  },
  {
    id: 'inspecao-veicular',
    nome: 'Inspeção Veicular',
    status: 'Ativo',
    descricao: 'Carros, utilitários e frotas; 20 itens obrigatórios do CONTRAN, cálculo HRN e plano corretivo',
    botao: 'Iniciar Inspeção',
    escopo: '20 Requisitos',
    iconName: 'Car',
  },
  {
    id: 'frota-escolar',
    nome: 'Frota Escolar',
    status: 'Ativo',
    descricao: 'Veículos escolares sob CTB (Art. 136/138) e ABNT NBR 17075:2022, checklist de 17 blocos',
    botao: 'Iniciar Inspeção',
    escopo: '17 Blocos / NBR',
    iconName: 'Bus',
  },
  {
    id: 'reclassificacao-monta',
    nome: 'Reclassificação de Monta Veicular',
    status: 'Ativo',
    descricao: 'Reclassificação técnica de monta de veículos sinistrados sob Resolução CONTRAN nº 810/2020',
    botao: 'Iniciar Auditoria',
    escopo: '9 Blocos / CONTRAN',
    iconName: 'FileCheck2',
  },
  {
    id: 'sinistro-veicular-ia',
    nome: 'Avaliação de Sinistro Veicular',
    status: 'NOVO IA',
    descricao: 'Perícia de colisões/danos mecânicos e estruturais, checklist de 31 itens, enquadramento de monta legal, álbum fotográfico por categorias e IA de análise de danos',
    botao: 'Iniciar Perícia',
    escopo: '31 Requisitos',
    iconName: 'Sparkles',
  },
  {
    id: 'playground',
    nome: 'Laudo de Playground',
    status: 'Ativo',
    descricao: 'Segurança em áreas de recreação sob ABNT NBR 16071 (partes 1–7), checklist, análise de perigo, prioridades e ART',
    botao: 'Iniciar Auditoria',
    escopo: '18 Requisitos',
    iconName: 'Smile',
  },
  {
    id: 'pmoc',
    nome: 'Plano de PMOC',
    status: 'Ativo',
    descricao: 'Lei 13.589/2018; inventário físico, cronograma mensal, checklist técnico-sanitário de 18 itens, formulários prontos',
    botao: 'Iniciar Auditoria',
    escopo: '18 Requisitos',
    iconName: 'Fan',
  },
  {
    id: 'art-manutencao',
    nome: 'ART de Manutenção',
    status: 'Ativo',
    descricao: 'Memorial descritivo, checklist pré-ART e relatório técnico para manutenção de máquinas e climatização',
    botao: 'Iniciar Emissão',
    escopo: 'Completo',
    iconName: 'Award',
  },
  {
    id: 'consultoria-pcm',
    nome: 'Consultoria PCM',
    status: 'Ativo',
    descricao: 'Diagnóstico de maturidade ISO 55001, cronograma PMP de 52 semanas, matriz FMEA e painel de indicadores (MTBF, MTTR, backlog)',
    botao: 'Iniciar Consultoria',
    escopo: 'Completo',
    iconName: 'BarChart3',
  },
];

// NR-12 12 Core Requirements for Wizard
export const NR12_REQUISITOS_PADRAO = [
  { id: 'nr12-1', requisito: '12.1 Arranjo físico e instalações (espaço de circulação, pisos nivelados e livres)', normaRef: 'NR-12.2' },
  { id: 'nr12-2', requisito: '12.2 Instalações elétricas e aterramento de proteção de carcaças', normaRef: 'NR-12.3 / NR-10' },
  { id: 'nr12-3', requisito: '12.3 Dispositivos de partida, acionamento e parada (impedimento de partida involuntária)', normaRef: 'NR-12.4' },
  { id: 'nr12-4', requisito: '12.4 Sistemas de segurança e enclausuramento de zonas de perigo (proteções fixas e móveis)', normaRef: 'NR-12.5' },
  { id: 'nr12-5', requisito: '12.5 Dispositivos de intertravamento associados a relés de segurança (Categoria 3 ou 4)', normaRef: 'NBR 14153' },
  { id: 'nr12-6', requisito: '12.6 Dispositivos de parada de emergência (botões tipo cogumelo com trava mecânica)', normaRef: 'NR-12.6' },
  { id: 'nr12-7', requisito: '12.7 Meios de acesso permanentes (escadas, passarelas, corrimãos e guarda-corpos)', normaRef: 'NR-12.7' },
  { id: 'nr12-8', requisito: '12.8 Componentes pressurizados (mangueiras hidráulicas, pneumáticas e válvulas de alívio)', normaRef: 'NR-12.8' },
  { id: 'nr12-9', requisito: '12.9 Transportadores de materiais e correias (cabos de emergência ao longo do trecho)', normaRef: 'NR-12.9' },
  { id: 'nr12-10', requisito: '12.10 Aspectos ergonômicos na operação e manutenção mecânica', normaRef: 'NR-17 / NR-12.10' },
  { id: 'nr12-11', requisito: '12.11 Sinalização e avisos de segurança (placas de advertência e bloqueio LOTO)', normaRef: 'NR-12.11 / NR-26' },
  { id: 'nr12-12', requisito: '12.12 Manuais, procedimentos de trabalho e capacitação dos operadores', normaRef: 'NR-12.12 / 12.16' },
];

export const CLIENTES_INICIAIS: Cliente[] = [
  {
    id: 'cli-01',
    razaoSocial: 'Construtora & Engenharia Suape S.A.',
    nomeFantasia: 'Suape Engenharia',
    cpfCnpj: '12.345.678/0001-90',
    contatos: [
      { nome: 'Carlos Eduardo', cargo: 'Gerente de Manutenção', telefone: '(81) 99123-4567', email: 'carlos@suapeeng.com.br' }
    ],
    endereco: {
      logradouro: 'Av. Portuária',
      numero: '1200',
      bairro: 'Porto de Suape',
      cidade: 'Ipojuca',
      estado: 'PE',
      cep: '55590-000',
    },
    criadoEm: '2026-01-15T10:00:00Z',
  },
  {
    id: 'cli-02',
    razaoSocial: 'Logística Nordeste Transportes Ltda.',
    nomeFantasia: 'Nordeste Cargas',
    cpfCnpj: '98.765.432/0001-11',
    contatos: [
      { nome: 'Mariana Albuquerque', cargo: 'Coordenadora de Frota', telefone: '(81) 98777-1122', email: 'mariana@nordestecargas.com.br' }
    ],
    endereco: {
      logradouro: 'Rodovia BR-101 Sul',
      numero: 'Km 78',
      bairro: 'Prazeres',
      cidade: 'Jaboatão dos Guararapes',
      estado: 'PE',
      cep: '54335-000',
    },
    criadoEm: '2026-02-01T14:30:00Z',
  },
  {
    id: 'cli-03',
    razaoSocial: 'Indústria Metalmecânica do Agreste Ltda.',
    nomeFantasia: 'Metal Agreste',
    cpfCnpj: '44.555.666/0001-22',
    contatos: [
      { nome: 'Roberto Simões', cargo: 'Diretor Industrial', telefone: '(81) 99654-8899', email: 'roberto@metalagreste.ind.br' }
    ],
    endereco: {
      logradouro: 'Distrito Industrial I',
      numero: '450',
      bairro: 'Kennedy',
      cidade: 'Caruaru',
      estado: 'PE',
      cep: '55030-000',
    },
    criadoEm: '2026-03-10T08:00:00Z',
  },
];

export const ATIVOS_INICIAIS: Ativo[] = [
  {
    id: 'atv-01',
    clienteId: 'cli-01',
    clienteNome: 'Construtora & Engenharia Suape S.A.',
    tipo: 'Caminhão Munck',
    identificacao: 'MNK-8821 / Placa PE-REC-4921',
    fabricante: 'Madal Palfinger / VW Constellation 24.280',
    modelo: 'MD 45007 Performance',
    ano: 2021,
    numeroSerie: 'MP-892110-BR',
    capacidade: '45.000 kgm / 12 toneladas',
    localizacao: 'Canteiro Obra Eólica PE-060',
    historico: [
      {
        laudoId: 'lau-2025-045',
        numeroLaudo: 'LAR-2025-045',
        data: '2025-08-15',
        tipo: 'Caminhão Munck',
        status: 'finalizado',
        resultado: 'Aprovado com Restrições',
        hrnNivel: 'Médio',
        totalNaoConformidades: 3,
      },
      {
        laudoId: 'lau-2026-003',
        numeroLaudo: 'LAR-2026-003',
        data: '2026-02-20',
        tipo: 'Caminhão Munck',
        status: 'finalizado',
        resultado: 'Aprovado',
        hrnNivel: 'Baixo',
        totalNaoConformidades: 0,
      }
    ],
    criadoEm: '2025-08-10T09:00:00Z',
  },
  {
    id: 'atv-02',
    clienteId: 'cli-03',
    clienteNome: 'Indústria Metalmecânica do Agreste Ltda.',
    tipo: 'Prensa Excêntrica Mecânica',
    identificacao: 'PRS-04 (Linha de Estamparia)',
    fabricante: 'Gutmann Prensas',
    modelo: 'PE-150 Ton',
    ano: 2018,
    numeroSerie: 'GTM-7712-18',
    capacidade: '150 Toneladas Métricas',
    localizacao: 'Galpão Principal - Setor de Corte e Dobra',
    historico: [
      {
        laudoId: 'lau-2026-012',
        numeroLaudo: 'LAR-2026-012',
        data: '2026-03-01',
        tipo: 'Laudo NR-12',
        status: 'finalizado',
        resultado: 'Aprovado',
        hrnNivel: 'Baixo',
        totalNaoConformidades: 0,
      }
    ],
    criadoEm: '2026-02-28T11:00:00Z',
  },
  {
    id: 'atv-03',
    clienteId: 'cli-02',
    clienteNome: 'Logística Nordeste Transportes Ltda.',
    tipo: 'Guindaste Telescópico Autopropelido',
    identificacao: 'GND-02 / Placa RMR-9902',
    fabricante: 'Liebherr',
    modelo: 'LTM 1070-4.2',
    ano: 2020,
    numeroSerie: 'LHB-902194-DE',
    capacidade: '70 Toneladas',
    localizacao: 'Pátio Central Jaboatão',
    historico: [],
    criadoEm: '2026-03-05T15:20:00Z',
  }
];

export const ORCAMENTOS_INICIAIS: Orcamento[] = [
  {
    id: 'orc-01',
    clienteId: 'cli-01',
    clienteNome: 'Construtora & Engenharia Suape S.A.',
    servico: 'Inspeções em Caminhões Munck e Guindastes',
    descricaoEscopo: 'Inspeção semestral de integridade física, teste de estanqueidade hidráulica, verificação de trincas estruturais com líquido penetrante e emissão de Laudo com ART CREA-PE.',
    ativoId: 'atv-01',
    ativoIdentificacao: 'MNK-8821 / Placa PE-REC-4921',
    valor: 4800,
    prazoDias: 5,
    condicoesPagamento: '50% entrada e 50% após emissão da ART.',
    status: 'aprovado',
    laudoGeradoId: 'lau-2026-003',
    criadoEm: '2026-02-10T14:00:00Z',
  },
  {
    id: 'orc-02',
    clienteId: 'cli-03',
    clienteNome: 'Indústria Metalmecânica do Agreste Ltda.',
    servico: 'Adequação à NR-12',
    descricaoEscopo: 'Apreciação Completa de Riscos HRN em 4 prensas excêntricas, memorial de cálculo de distâncias de segurança (ABNT NBR ISO 13855) e ART.',
    ativoId: 'atv-02',
    ativoIdentificacao: 'PRS-04 (Linha de Estamparia)',
    valor: 12500,
    prazoDias: 15,
    condicoesPagamento: 'Faturado 30 dias após protocolo do laudo.',
    status: 'aprovado',
    laudoGeradoId: 'lau-2026-012',
    criadoEm: '2026-02-25T09:30:00Z',
  },
  {
    id: 'orc-03',
    clienteId: 'cli-02',
    clienteNome: 'Logística Nordeste Transportes Ltda.',
    servico: 'Inspeções em Caminhões Munck e Guindastes',
    descricaoEscopo: 'Certificação anual do guindaste telescópico autopropelido Liebherr 70T com ensaio de carga e calibração de indicador de momento de carga (LMI).',
    ativoId: 'atv-03',
    ativoIdentificacao: 'GND-02 / Placa RMR-9902',
    valor: 7200,
    prazoDias: 7,
    condicoesPagamento: 'À vista com 5% de desconto ou 3x boleto bancário.',
    status: 'enviado',
    criadoEm: '2026-03-06T16:00:00Z',
  }
];

export const AGENDA_INICIAL: AgendaVistoria[] = [
  {
    id: 'ag-01',
    clienteId: 'cli-02',
    clienteNome: 'Logística Nordeste Transportes Ltda.',
    ativoId: 'atv-03',
    ativoIdentificacao: 'GND-02 / Placa RMR-9902',
    dataHora: '2026-09-12T09:00',
    responsavelUid: 'master-vitor',
    responsavelNome: 'Eng. Vitor Leonardo (CREA-PE 1822299490)',
    status: 'agendada',
    observacoes: 'Levar kit de ensaio não-destrutivo por líquido penetrante e dinamômetro de tração calibrado.',
    criadoEm: '2026-09-01T10:00:00Z',
  },
  {
    id: 'ag-02',
    clienteId: 'cli-01',
    clienteNome: 'Construtora & Engenharia Suape S.A.',
    ativoId: 'atv-01',
    ativoIdentificacao: 'MNK-8821 / Placa PE-REC-4921',
    dataHora: '2026-09-18T14:30',
    responsavelUid: 'master-vitor',
    responsavelNome: 'Eng. Vitor Leonardo (CREA-PE 1822299490)',
    status: 'agendada',
    observacoes: 'Auditoria de acompanhamento pós-reparo de cilindro hidráulico.',
    criadoEm: '2026-09-02T11:20:00Z',
  }
];

export const LAUDOS_INICIAIS: Laudo[] = [
  {
    id: 'lau-2025-045',
    numero: 'LAR-2025-045',
    tipo: 'Caminhão Munck',
    clienteId: 'cli-01',
    clienteNome: 'Construtora & Engenharia Suape S.A.',
    ativoId: 'atv-01',
    ativoIdentificacao: 'MNK-8821 / Placa PE-REC-4921',
    status: 'finalizado',
    artNumero: 'PE2025-0812903',
    dataInspecao: '2025-08-15',
    responsavelNome: 'Vitor Leonardo',
    responsavelCrea: 'CREA-PE 1822299490',
    resumoExecutivo: 'Inspeção periódica semestral realizada no pátio Suape. Foram constatadas pequenas avarias em mangueiras hidráulicas do braço articulado e ausência de plaqueta de capacidade na ponta da lança.',
    conclusao: 'Equipamento aprovado com restrições. Prazos estabelecidos no plano de ação para substituição preventiva das mangueiras antes do içamento de cargas críticas.',
    secoes: [
      {
        id: 'sec-1',
        titulo: 'Chassi e Fixação na Longarina',
        ordem: 1,
        parecerTecnico: 'Fixação por grampos U em perfeito estado de torqueamento. Ausência de deformações plásticas nas longarinas.',
        itens: [
          { id: 'it-1', requisito: 'Parafusos e grampos de fixação do guindaste ao sobrechassi', status: 'conforme' },
          { id: 'it-2', requisito: 'Ausência de trincas na estrutura de solda do chassi', status: 'conforme' }
        ],
        fotos: []
      },
      {
        id: 'sec-2',
        titulo: 'Sistema Hidráulico e Cilindros',
        ordem: 2,
        parecerTecnico: 'Identificado início de ressecamento e leve gotejamento na conexão do cilindro de elevação principal.',
        itens: [
          { 
            id: 'it-3', 
            requisito: 'Estanqueidade e integridade de mangueiras hidráulicas de alta pressão', 
            status: 'nao_conforme',
            gravidade: 'media',
            observacao: 'Gotejamento na luva de engate do terceiro braço hidráulico.',
            hrn: { lo: 5, fe: 2.5, dph: 1, np: 1 },
            hrnScore: 12.5,
            hrnNivel: 'Médio'
          }
        ],
        fotos: []
      }
    ],
    hrnCalculoGeral: {
      score: 12.5,
      nivel: 'Médio',
      cor: 'bg-amber-100 text-amber-800 border-amber-300',
      recomendacao: 'Necessária intervenção técnica planejada no plano de ação.'
    },
    usoIA: { chamadas: 2 },
    criadoEm: '2025-08-15T10:00:00Z',
    atualizadoEm: '2025-08-16T16:00:00Z',
  },
  {
    id: 'lau-2026-003',
    numero: 'LAR-2026-003',
    tipo: 'Caminhão Munck',
    clienteId: 'cli-01',
    clienteNome: 'Construtora & Engenharia Suape S.A.',
    ativoId: 'atv-01',
    ativoIdentificacao: 'MNK-8821 / Placa PE-REC-4921',
    status: 'finalizado',
    artNumero: 'PE2026-0104882',
    dataInspecao: '2026-02-20',
    responsavelNome: 'Vitor Leonardo',
    responsavelCrea: 'CREA-PE 1822299490',
    resumoExecutivo: 'Inspeção de conformidade e verificação de itens corretivos recomendados no laudo LAR-2025-045. Todas as mangueiras foram substituídas por mangueiras certificadas SAE 100R2AT e instalada nova tabela de carga.',
    conclusao: 'Equipamento considerado 100% APTO E CONFORME para operações de içamento e transporte conforme NR-11, NR-12 e NBR 14768.',
    secoes: [
      {
        id: 'sec-1',
        titulo: 'Chassi e Fixação na Longarina',
        ordem: 1,
        parecerTecnico: 'Inspeção visual e dimensional confirmam conformidade estrutural plena.',
        itens: [
          { id: 'it-1', requisito: 'Parafusos e grampos de fixação do guindaste ao sobrechassi', status: 'conforme' },
          { id: 'it-2', requisito: 'Ausência de trincas na estrutura de solda do chassi', status: 'conforme' }
        ],
        fotos: []
      },
      {
        id: 'sec-2',
        titulo: 'Sistema Hidráulico e Cilindros',
        ordem: 2,
        parecerTecnico: 'Mangueiras novas instaladas, sem qualquer vazamento sob pressão de trabalho de 280 bar.',
        itens: [
          { 
            id: 'it-3', 
            requisito: 'Estanqueidade e integridade de mangueiras hidráulicas de alta pressão', 
            status: 'conforme',
            observacao: 'Substituição comprovada por nota de manutenção e inspeção visual em carga.'
          }
        ],
        fotos: []
      }
    ],
    hrnCalculoGeral: {
      score: 0.8,
      nivel: 'Insignificante',
      cor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      recomendacao: 'Risco aceitável. Manter manutenções preventivas.'
    },
    usoIA: { chamadas: 1 },
    criadoEm: '2026-02-20T08:00:00Z',
    atualizadoEm: '2026-02-20T18:00:00Z',
  }
];

export const TEMPLATES_INICIAIS: LaudoTemplate[] = [
  {
    id: 'tpl-nr12-padrao',
    tipoBase: 'nr-12',
    nome: 'Modelo Oficial NR-12 — Apreciação Completa de Riscos',
    criadoPorUid: 'master-vitor',
    criadoEm: '2026-01-10T10:00:00Z',
    secoes: [
      {
        id: 'tpl-sec-1',
        titulo: '1. Arranjo Físico e Instalações Industriais',
        ordem: 1,
        itens: [
          { id: 't-it-1', requisito: 'Espaçamento mínimo entre máquinas e circulação segura', status: 'conforme' },
          { id: 't-it-2', requisito: 'Piso limpo, nivelado e sem substâncias escorregadias', status: 'conforme' }
        ],
        fotos: []
      },
      {
        id: 'tpl-sec-2',
        titulo: '2. Sistemas de Proteção e Intertravamento',
        ordem: 2,
        itens: [
          { id: 't-it-3', requisito: 'Proteções fixas aparafusadas que impedem acesso à zona de perigo', status: 'conforme' },
          { id: 't-it-4', requisito: 'Chaves de intertravamento de segurança com ruptura positiva e relé categoria 4', status: 'conforme' },
          { id: 't-it-5', requisito: 'Botão de parada de emergência tipo cogumelo monitorado', status: 'conforme' }
        ],
        fotos: []
      },
      {
        id: 'tpl-sec-3',
        titulo: '3. Procedimentos Operacionais e Sinalização',
        ordem: 3,
        itens: [
          { id: 't-it-6', requisito: 'Sinalização clara de advertência em idioma nacional', status: 'conforme' },
          { id: 't-it-7', requisito: 'Procedimento de bloqueio de energia perigosa (LOTO)', status: 'conforme' }
        ],
        fotos: []
      }
    ]
  },
  {
    id: 'tpl-munck-padrao',
    tipoBase: 'caminhao-munck',
    nome: 'Checklist de Campo para Caminhão Munck (15 Seções)',
    criadoPorUid: 'master-vitor',
    criadoEm: '2026-01-12T11:00:00Z',
    secoes: [
      {
        id: 'm-sec-1',
        titulo: 'Chassi, Sobrechassi e Grampos de Fixação',
        ordem: 1,
        itens: [
          { id: 'm-1', requisito: 'Aperto e estado físico dos tirantes/grampos de fixação', status: 'conforme' },
          { id: 'm-2', requisito: 'Alinhamento estrutural e ausência de fissuras na solda', status: 'conforme' }
        ],
        fotos: []
      },
      {
        id: 'm-sec-2',
        titulo: 'Sapatas Estabilizadoras e Cilindros',
        ordem: 2,
        itens: [
          { id: 'm-3', requisito: 'Válvulas de retenção pilotadas nos cilindros de apoio', status: 'conforme' },
          { id: 'm-4', requisito: 'Pratos de apoio das sapatas em bom estado mecânico', status: 'conforme' }
        ],
        fotos: []
      },
      {
        id: 'm-sec-3',
        titulo: 'Lanças Hidráulicas, Manuais e Gancho',
        ordem: 3,
        itens: [
          { id: 'm-5', requisito: 'Folga entre sapatas de desgaste das lanças telescópicas', status: 'conforme' },
          { id: 'm-6', requisito: 'Gancho com trava de segurança operante e marcação de capacidade', status: 'conforme' }
        ],
        fotos: []
      }
    ]
  }
];
