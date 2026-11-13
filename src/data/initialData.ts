import { ModuloLaudoCatalogo, Cliente, Ativo, Orcamento, AgendaVistoria, Laudo, LaudoTemplate, ChecklistCampo } from '../types';
import { LAUDO_FALHA_MECANICA_DEF } from './laudoFalhaMecanicaDef';
import { LAUDO_DUSTER_COMPLETO } from './laudoDusterCompleto';

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
    id: 'falha-mecanica-causa-raiz',
    nome: 'Falha Mecânica e Causa Raiz',
    status: 'NOVO',
    descricao: 'Perícia técnica veicular de falha mecânica, apuração de causa raiz (RCA / 5 Porquês / Ishikawa / FMEA), nexo causal e classificação de danos em 35 tópicos',
    botao: 'Iniciar Perícia',
    escopo: '35 Tópicos / RCA',
    iconName: 'Car',
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

export const CLIENTES_INICIAIS: Cliente[] = [];

export const ATIVOS_INICIAIS: Ativo[] = [];

export const ORCAMENTOS_INICIAIS: Orcamento[] = [];

export const AGENDA_INICIAL: AgendaVistoria[] = [];

export const LAUDOS_INICIAIS: Laudo[] = [];

export const TEMPLATES_INICIAIS: LaudoTemplate[] = [
  {
    id: 'tpl-falha-mecanica-causa-raiz',
    tipoBase: 'laudo-falha-mecanica-causa-raiz',
    nome: 'Modelo Oficial — Perícia de Falha Mecânica e Causa Raiz (14 Tópicos)',
    criadoPorUid: 'master-vitor',
    criadoEm: '2026-10-01T10:00:00Z',
    secoes: (LAUDO_FALHA_MECANICA_DEF.secoesPadrao || []).map(s => ({
      id: s.id,
      titulo: s.titulo,
      ordem: s.ordem,
      conteudoHtml: s.conteudoHtml,
      itens: [],
      fotos: []
    }))
  },
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

export const CHECKLISTS_CAMPO_INICIAIS: ChecklistCampo[] = [];


