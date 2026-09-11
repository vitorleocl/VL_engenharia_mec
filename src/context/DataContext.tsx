import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Cliente, 
  Ativo, 
  Orcamento, 
  AgendaVistoria, 
  Laudo, 
  LaudoTemplate, 
  LogAuditoria, 
  ContatoFormulario, 
  Usuario,
  UsoIAMetricas,
  CategoriaLaudoDef,
  TipoLaudoDef
} from '../types';
import { 
  CLIENTES_INICIAIS, 
  ATIVOS_INICIAIS, 
  ORCAMENTOS_INICIAIS, 
  AGENDA_INICIAL, 
  LAUDOS_INICIAIS, 
  TEMPLATES_INICIAIS,
  NR12_REQUISITOS_PADRAO
} from '../data/initialData';
import { CATEGORIAS_LAUDOS_TAXONOMIA } from '../data/taxonomiaLaudos';
import { useAuth } from './AuthContext';

interface DataContextType {
  clientes: Cliente[];
  ativos: Ativo[];
  orcamentos: Orcamento[];
  agenda: AgendaVistoria[];
  laudos: Laudo[];
  templates: LaudoTemplate[];
  logsAuditoria: LogAuditoria[];
  contatos: ContatoFormulario[];
  usuarios: Usuario[];
  usoIA: UsoIAMetricas;
  categoriasLaudo: CategoriaLaudoDef[];
  
  // Clientes Actions
  adicionarCliente: (cliente: Omit<Cliente, 'id' | 'criadoEm'>) => string;
  atualizarCliente: (id: string, dados: Partial<Cliente>) => void;
  removerCliente: (id: string) => void;

  // Ativos Actions
  adicionarAtivo: (ativo: Omit<Ativo, 'id' | 'criadoEm' | 'historico'>) => string;
  atualizarAtivo: (id: string, dados: Partial<Ativo>) => void;
  removerAtivo: (id: string) => void;

  // Orçamentos Actions
  adicionarOrcamento: (orcamento: Omit<Orcamento, 'id' | 'criadoEm'>) => string;
  atualizarOrcamento: (id: string, dados: Partial<Orcamento>) => void;
  atualizarStatusOrcamento: (id: string, status: Orcamento['status']) => void;
  gerarLaudoFromOrcamento: (orcamentoId: string, ativoIdEscolhido?: string) => string;
  removerOrcamento: (id: string) => void;

  // Agenda Actions
  adicionarVistoria: (vistoria: Omit<AgendaVistoria, 'id' | 'criadoEm'>) => string;
  atualizarStatusVistoria: (id: string, status: AgendaVistoria['status']) => void;
  removerVistoria: (id: string) => void;

  // Taxonomia & Laudos Actions
  atualizarCategoriasLaudo: (novas: CategoriaLaudoDef[]) => void;
  gerarNumeroLaudo: (prefixo?: string) => string;
  criarNovoLaudo: (dados: Partial<Laudo> & { tipo: string; clienteId: string; ativoId: string }) => string;
  criarLaudoPorTaxonomia: (params: { tipoLaudoId: string; clienteId: string; ativoId: string; artNumero?: string; dataInspecao?: string }) => string;
  atualizarLaudo: (id: string, dados: Partial<Laudo>) => void;
  finalizarLaudo: (id: string, artNumero: string, assinaturaUrl?: string) => void;
  removerLaudo: (id: string) => void;

  // Templates Actions
  salvarTemplate: (template: Omit<LaudoTemplate, 'id' | 'criadoEm'>) => void;
  removerTemplate: (id: string) => void;

  // Usuários Actions
  atualizarPapelUsuario: (uid: string, novoRole: Usuario['role'], clienteId?: string) => void;
  adicionarUsuarioConvidado: (usuario: Omit<Usuario, 'uid' | 'criadoEm'>) => void;

  // Contato Formulario Público
  enviarContatoPublico: (contato: Omit<ContatoFormulario, 'id' | 'criadoEm' | 'respondido'>) => Promise<void>;
  marcarContatoRespondido: (id: string) => void;

  // IA Tracking
  registrarUsoIA: (quantidade?: number) => void;
  atualizarLimiteIA: (novoLimite: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('Erro ao salvar no storage local:', e);
  }
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [clientes, setClientes] = useState<Cliente[]>(() => loadStorage('vl_clientes', CLIENTES_INICIAIS));
  const [ativos, setAtivos] = useState<Ativo[]>(() => loadStorage('vl_ativos', ATIVOS_INICIAIS));
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>(() => loadStorage('vl_orcamentos', ORCAMENTOS_INICIAIS));
  const [agenda, setAgenda] = useState<AgendaVistoria[]>(() => loadStorage('vl_agenda', AGENDA_INICIAL));
  const [laudos, setLaudos] = useState<Laudo[]>(() => loadStorage('vl_laudos', LAUDOS_INICIAIS));
  const [templates, setTemplates] = useState<LaudoTemplate[]>(() => loadStorage('vl_templates', TEMPLATES_INICIAIS));
  const [categoriasLaudo, setCategoriasLaudo] = useState<CategoriaLaudoDef[]>(() => loadStorage('vl_taxonomia_categorias', CATEGORIAS_LAUDOS_TAXONOMIA));
  const [logsAuditoria, setLogsAuditoria] = useState<LogAuditoria[]>(() => loadStorage('vl_logs', [
    {
      id: 'log-01',
      colecaoAfetada: 'laudos',
      documentoId: 'lau-2026-003',
      acao: 'finalizar',
      usuarioUid: 'master-vitor',
      usuarioNome: 'Eng. Vitor Leonardo',
      usuarioEmail: 'vitorleonardocl@gmail.com',
      timestamp: '2026-02-20T18:00:00Z',
      detalhes: 'Laudo LAR-2026-003 concluído e ART PE2026-0104882 vinculada.'
    }
  ]));
  const [contatos, setContatos] = useState<ContatoFormulario[]>(() => loadStorage('vl_contatos', [
    {
      id: 'cnt-01',
      nome: 'Juliana Mendes',
      email: 'juliana.mendes@agroindustria.com.br',
      telefone: '(81) 98877-3344',
      servicoInteresse: 'Adequação à NR-12',
      mensagem: 'Precisamos de orçamento urgente para laudo NR-12 em 6 esteiras transportadoras e caldeira industrial.',
      criadoEm: '2026-09-06T15:20:00Z',
      respondido: false,
    }
  ]));
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => loadStorage('vl_usuarios', [
    {
      uid: 'master-vitor',
      nome: 'Eng. Vitor Leonardo',
      email: 'vitorleonardocl@gmail.com',
      role: 'master',
      cargo: 'Responsável Técnico / Fundador (CREA-PE 1822299490)',
      criadoEm: '2025-01-01T00:00:00Z',
    },
    {
      uid: 'usr-colab-1',
      nome: 'Lucas Silveira',
      email: 'lucas.inspetor@vlengenharia.com',
      role: 'colaborador',
      cargo: 'Técnico em Mecânica / Inspetor',
      criadoEm: '2026-01-10T10:00:00Z',
    },
    {
      uid: 'usr-cli-1',
      nome: 'Carlos Eduardo (Suape Eng.)',
      email: 'carlos@suapeeng.com.br',
      role: 'cliente',
      clienteId: 'cli-01',
      cargo: 'Gerente de Manutenção',
      criadoEm: '2026-01-15T11:00:00Z',
    }
  ]));

  const [usoIA, setUsoIA] = useState<UsoIAMetricas>(() => {
    const defaultData: UsoIAMetricas = {
      totalChamadas: 18,
      limiteMensal: 500,
      mesAno: new Date().toISOString().slice(0, 7),
      mesReferencia: 'Setembro/2026',
      custoEstimadoUSD: 0.05,
    };
    const loaded = loadStorage('vl_uso_ia', defaultData);
    const chamadas = loaded?.totalChamadas ?? defaultData.totalChamadas;
    return {
      ...defaultData,
      ...loaded,
      totalChamadas: chamadas,
      limiteMensal: loaded?.limiteMensal ?? defaultData.limiteMensal,
      mesAno: loaded?.mesAno ?? defaultData.mesAno,
      mesReferencia: loaded?.mesReferencia || defaultData.mesReferencia,
      custoEstimadoUSD: typeof loaded?.custoEstimadoUSD === 'number'
        ? loaded.custoEstimadoUSD
        : Number(((chamadas || 0) * 0.0025).toFixed(4)),
    };
  });

  // Sync state to local storage
  useEffect(() => saveStorage('vl_clientes', clientes), [clientes]);
  useEffect(() => saveStorage('vl_ativos', ativos), [ativos]);
  useEffect(() => saveStorage('vl_orcamentos', orcamentos), [orcamentos]);
  useEffect(() => saveStorage('vl_agenda', agenda), [agenda]);
  useEffect(() => saveStorage('vl_laudos', laudos), [laudos]);
  useEffect(() => saveStorage('vl_templates', templates), [templates]);
  useEffect(() => saveStorage('vl_taxonomia_categorias', categoriasLaudo), [categoriasLaudo]);
  useEffect(() => saveStorage('vl_logs', logsAuditoria), [logsAuditoria]);
  useEffect(() => saveStorage('vl_contatos', contatos), [contatos]);
  useEffect(() => saveStorage('vl_usuarios', usuarios), [usuarios]);
  useEffect(() => saveStorage('vl_uso_ia', usoIA), [usoIA]);

  // Log Auditoria Helper
  const registrarLog = (colecao: string, docId: string, acao: LogAuditoria['acao'], detalhes?: string) => {
    const novoLog: LogAuditoria = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      colecaoAfetada: colecao,
      documentoId: docId,
      acao,
      usuarioUid: currentUser?.uid || 'anonimo',
      usuarioNome: currentUser?.nome || 'Sistema',
      usuarioEmail: currentUser?.email || 'sistema@vlengenharia.com',
      timestamp: new Date().toISOString(),
      detalhes,
    };
    setLogsAuditoria(prev => [novoLog, ...prev]);
  };

  // Atomic Sequence Generator (e.g. LAR-2026-001 or NR12-2026-001)
  const gerarNumeroLaudo = (prefixoPersonalizado?: string): string => {
    const anoAtual = new Date().getFullYear();
    const prefixo = prefixoPersonalizado ? `${prefixoPersonalizado}-${anoAtual}-` : `LAR-${anoAtual}-`;
    
    // Find highest sequential number this year for this prefix
    let maxNum = 0;
    laudos.forEach(l => {
      if (l.numero && l.numero.startsWith(prefixo)) {
        const parteNum = parseInt(l.numero.replace(prefixo, ''), 10);
        if (!isNaN(parteNum) && parteNum > maxNum) {
          maxNum = parteNum;
        }
      }
    });

    const proximoNum = maxNum + 1;
    return `${prefixo}${String(proximoNum).padStart(3, '0')}`;
  };

  // Atualizar Taxonomia
  const atualizarCategoriasLaudo = (novas: CategoriaLaudoDef[]) => {
    setCategoriasLaudo(novas);
    registrarLog('taxonomiaLaudos', 'categorias', 'editar', 'Estrutura taxonômica de laudos atualizada.');
  };

  // Clientes
  const adicionarCliente = (dados: Omit<Cliente, 'id' | 'criadoEm'>): string => {
    const id = `cli-${Date.now()}`;
    const novo: Cliente = { ...dados, id, criadoEm: new Date().toISOString() };
    setClientes(prev => [novo, ...prev]);
    registrarLog('clientes', id, 'criar', `Cliente criado: ${novo.razaoSocial}`);
    return id;
  };

  const atualizarCliente = (id: string, dados: Partial<Cliente>) => {
    setClientes(prev => prev.map(c => c.id === id ? { ...c, ...dados } : c));
    registrarLog('clientes', id, 'editar', `Cliente atualizado: ${dados.razaoSocial || id}`);
  };

  const removerCliente = (id: string) => {
    setClientes(prev => prev.filter(c => c.id !== id));
    registrarLog('clientes', id, 'excluir', `Cliente removido: ${id}`);
  };

  // Ativos
  const adicionarAtivo = (dados: Omit<Ativo, 'id' | 'criadoEm' | 'historico'>): string => {
    const id = `atv-${Date.now()}`;
    const cliente = clientes.find(c => c.id === dados.clienteId);
    const novo: Ativo = {
      ...dados,
      id,
      clienteNome: cliente?.razaoSocial || dados.clienteNome,
      historico: [],
      criadoEm: new Date().toISOString(),
    };
    setAtivos(prev => [novo, ...prev]);
    registrarLog('ativos', id, 'criar', `Ativo criado: ${novo.identificacao} (${novo.tipo})`);
    return id;
  };

  const atualizarAtivo = (id: string, dados: Partial<Ativo>) => {
    setAtivos(prev => prev.map(a => a.id === id ? { ...a, ...dados } : a));
    registrarLog('ativos', id, 'editar', `Ativo atualizado: ${dados.identificacao || id}`);
  };

  const removerAtivo = (id: string) => {
    setAtivos(prev => prev.filter(a => a.id !== id));
    registrarLog('ativos', id, 'excluir', `Ativo removido: ${id}`);
  };

  // Orçamentos
  const adicionarOrcamento = (dados: Omit<Orcamento, 'id' | 'criadoEm'>): string => {
    const id = `orc-${Date.now()}`;
    const cliente = clientes.find(c => c.id === dados.clienteId);
    const novo: Orcamento = {
      ...dados,
      id,
      clienteNome: cliente?.razaoSocial || dados.clienteNome,
      criadoEm: new Date().toISOString(),
    };
    setOrcamentos(prev => [novo, ...prev]);
    registrarLog('orcamentos', id, 'criar', `Orçamento criado: R$ ${novo.valor} (${novo.servico})`);
    return id;
  };

  const atualizarOrcamento = (id: string, dados: Partial<Orcamento>) => {
    setOrcamentos(prev => prev.map(o => o.id === id ? { ...o, ...dados } : o));
    registrarLog('orcamentos', id, 'editar', `Orçamento/Proposta atualizada: ${dados.servico || id}`);
  };

  const atualizarStatusOrcamento = (id: string, status: Orcamento['status']) => {
    setOrcamentos(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    registrarLog('orcamentos', id, 'editar', `Status do orçamento alterado para: ${status}`);
  };

  const removerOrcamento = (id: string) => {
    setOrcamentos(prev => prev.filter(o => o.id !== id));
    registrarLog('orcamentos', id, 'excluir', `Orçamento removido: ${id}`);
  };

  // Gerar Laudo a partir de Orçamento Aprovado
  const gerarLaudoFromOrcamento = (orcamentoId: string, ativoIdEscolhido?: string): string => {
    const orc = orcamentos.find(o => o.id === orcamentoId);
    if (!orc) throw new Error('Orçamento não encontrado');

    const ativoId = ativoIdEscolhido || orc.ativoId || (ativos.find(a => a.clienteId === orc.clienteId)?.id || '');
    const ativo = ativos.find(a => a.id === ativoId);
    const cliente = clientes.find(c => c.id === orc.clienteId);

    const numero = gerarNumeroLaudo();
    const novoLaudoId = `lau-${Date.now()}`;

    // Default template sections based on service
    const secoesPadrao = orc.servico.includes('NR-12')
      ? NR12_REQUISITOS_PADRAO.map((req, idx) => ({
          id: `sec-${idx + 1}`,
          titulo: req.requisito,
          ordem: idx + 1,
          itens: [
            {
              id: req.id,
              requisito: req.requisito,
              normaRef: req.normaRef,
              status: 'conforme' as const,
              observacao: 'Em conformidade preliminar observada.',
            }
          ],
          fotos: [],
        }))
      : [
          {
            id: 'sec-1',
            titulo: '1. Identificação e Integridade Estrutural',
            ordem: 1,
            itens: [
              {
                id: 'it-1',
                requisito: 'Verificação visual de soldas, longarinas e ausência de deformações',
                status: 'conforme' as const,
              }
            ],
            fotos: []
          },
          {
            id: 'sec-2',
            titulo: '2. Ensaio Operacional e Sistemas de Segurança',
            ordem: 2,
            itens: [
              {
                id: 'it-2',
                requisito: 'Teste sob pressão / carga de trabalho recomendada pelo fabricante',
                status: 'conforme' as const,
              }
            ],
            fotos: []
          }
        ];

    const novoLaudo: Laudo = {
      id: novoLaudoId,
      numero,
      tipo: orc.servico,
      clienteId: orc.clienteId,
      clienteNome: cliente?.razaoSocial || orc.clienteNome || 'Cliente',
      ativoId: ativo?.id || '',
      ativoIdentificacao: ativo?.identificacao || orc.ativoIdentificacao || 'Ativo a definir',
      status: 'rascunho',
      artNumero: '',
      dataInspecao: new Date().toISOString().slice(0, 10),
      responsavelNome: 'Vitor Leonardo',
      responsavelCrea: 'CREA-PE 1822299490',
      resumoExecutivo: `Laudo técnico originado a partir do Orçamento Comercial #${orc.id}. ${orc.descricaoEscopo || ''}`,
      secoes: secoesPadrao,
      usoIA: { chamadas: 0 },
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };

    setLaudos(prev => [novoLaudo, ...prev]);

    // Link budget to report
    setOrcamentos(prev => prev.map(o => o.id === orcamentoId ? { ...o, status: 'aprovado', laudoGeradoId: novoLaudoId } : o));

    registrarLog('laudos', novoLaudoId, 'criar', `Laudo ${numero} gerado a partir do orçamento ${orcamentoId}`);
    return novoLaudoId;
  };

  // Agenda
  const adicionarVistoria = (dados: Omit<AgendaVistoria, 'id' | 'criadoEm'>): string => {
    const id = `ag-${Date.now()}`;
    const novo: AgendaVistoria = { ...dados, id, criadoEm: new Date().toISOString() };
    setAgenda(prev => [novo, ...prev]);
    registrarLog('agendaVistorias', id, 'criar', `Vistoria agendada para ${dados.dataHora}`);
    return id;
  };

  const atualizarStatusVistoria = (id: string, status: AgendaVistoria['status']) => {
    setAgenda(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    registrarLog('agendaVistorias', id, 'editar', `Vistoria ${id} marcada como: ${status}`);
  };

  const removerVistoria = (id: string) => {
    setAgenda(prev => prev.filter(a => a.id !== id));
    registrarLog('agendaVistorias', id, 'excluir', `Vistoria removida: ${id}`);
  };

  // Laudos
  const criarLaudoPorTaxonomia = ({
    tipoLaudoId,
    clienteId,
    ativoId,
    artNumero = '',
    dataInspecao = new Date().toISOString().slice(0, 10)
  }: {
    tipoLaudoId: string;
    clienteId: string;
    ativoId: string;
    artNumero?: string;
    dataInspecao?: string;
  }): string => {
    let tipoEncontrado: TipoLaudoDef | undefined;
    let categoriaEncontradaId = '';
    let subcategoriaEncontradaId = '';

    for (const cat of categoriasLaudo) {
      for (const sub of cat.subcategorias) {
        const found = sub.tipos.find(t => t.id === tipoLaudoId);
        if (found) {
          tipoEncontrado = found;
          categoriaEncontradaId = cat.id;
          subcategoriaEncontradaId = sub.id;
          break;
        }
      }
      if (tipoEncontrado) break;
    }

    const cliente = clientes.find(c => c.id === clienteId);
    const ativo = ativos.find(a => a.id === ativoId);
    const prefixo = tipoEncontrado?.codigo || 'LAR';
    const numero = gerarNumeroLaudo(prefixo);
    const id = `lau-${Date.now()}`;

    const novo: Laudo = {
      id,
      numero,
      tipo: tipoEncontrado?.nome || 'Laudo Técnico Pericial',
      tipoLaudoId,
      categoriaId: categoriaEncontradaId,
      subcategoriaId: subcategoriaEncontradaId,
      clienteId,
      clienteNome: cliente?.razaoSocial || 'Cliente Corporativo',
      clienteCnpj: cliente?.cnpj || '',
      ativoId,
      ativoIdentificacao: ativo?.identificacao || 'Equipamento / Instalação Mecânica',
      status: 'rascunho',
      artNumero,
      dataInspecao,
      responsavelNome: 'Eng. Vitor Leonardo Cordeiro Linhares',
      responsavelCrea: 'CREA-PE 182229949-0',
      normasReferencia: tipoEncontrado?.normasRef || 'ABNT NBR, NR-12, NR-11, NR-13',
      apresentacao: tipoEncontrado?.apresentacaoPadrao || 'O presente laudo técnico pericial tem por escopo avaliar as condições mecânicas e de segurança do ativo.',
      metodologia: tipoEncontrado?.metodologiaPadrao || 'A metodologia adotada contemplou inspeção visual, ensaios funcionais e checagem de conformidade com as normas vigentes.',
      checklist: tipoEncontrado?.checklistPadrao ? tipoEncontrado.checklistPadrao.map(item => ({ ...item })) : [],
      tabelaNaoConformidades: [],
      conclusao: 'Com base nas avaliações e ensaios técnicos realizados, o equipamento encontra-se em conformidade com as exigências normativas aplicáveis, condicionando-se o início ou continuidade das operações à observância do plano de manutenção e eventuais ações corretivas apontadas.',
      secoes: tipoEncontrado?.secoesPadrao ? tipoEncontrado.secoesPadrao.map(s => ({
        id: s.id,
        titulo: s.titulo,
        ordem: s.ordem,
        conteudoHtml: s.conteudoHtml || '',
        itens: [],
        fotos: []
      })) : [],
      assinaturaDigital: {
        responsavelNome: 'Eng. Vitor Leonardo Cordeiro Linhares',
        responsavelCrea: 'CREA-PE 182229949-0',
        dataHora: new Date().toISOString(),
        hashAutenticidade: `AUT-VL-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
      },
      usoIA: { chamadas: 0 },
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };

    setLaudos(prev => [novo, ...prev]);
    registrarLog('laudos', id, 'criar', `Novo laudo técnico criado via taxonomia: ${numero} (${tipoEncontrado?.nome})`);
    return id;
  };

  const criarNovoLaudo = (dados: Partial<Laudo> & { tipo: string; clienteId: string; ativoId: string }): string => {
    const id = `lau-${Date.now()}`;
    const numero = dados.numero || gerarNumeroLaudo();
    const cliente = clientes.find(c => c.id === dados.clienteId);
    const ativo = ativos.find(a => a.id === dados.ativoId);

    const novo: Laudo = {
      id,
      numero,
      tipo: dados.tipo,
      clienteId: dados.clienteId,
      clienteNome: cliente?.razaoSocial || 'Cliente',
      clienteCnpj: cliente?.cnpj || '',
      ativoId: dados.ativoId,
      ativoIdentificacao: ativo?.identificacao || 'Equipamento',
      status: 'rascunho',
      artNumero: dados.artNumero || '',
      dataInspecao: dados.dataInspecao || new Date().toISOString().slice(0, 10),
      responsavelNome: 'Eng. Vitor Leonardo Cordeiro Linhares',
      responsavelCrea: 'CREA-PE 182229949-0',
      resumoExecutivo: dados.resumoExecutivo || `Inspeção e apreciação técnica de ${dados.tipo}.`,
      normasReferencia: dados.normasReferencia || 'ABNT NBR / Normas Regulamentadoras',
      apresentacao: dados.apresentacao || 'O presente laudo técnico pericial tem por finalidade aferir a conformidade estrutural e operacional do equipamento.',
      metodologia: dados.metodologia || 'A metodologia adotou inspeção in loco e verificação contra normas técnicas da ABNT e Ministério do Trabalho.',
      checklist: dados.checklist || [],
      tabelaNaoConformidades: dados.tabelaNaoConformidades || [],
      conclusao: dados.conclusao || 'O equipamento cumpre as exigências fundamentais das normas de segurança vigentes.',
      secoes: dados.secoes || [],
      usoIA: { chamadas: 0 },
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };

    setLaudos(prev => [novo, ...prev]);
    registrarLog('laudos', id, 'criar', `Novo laudo técnico criado: ${numero}`);
    return id;
  };

  const atualizarLaudo = (id: string, dados: Partial<Laudo>) => {
    setLaudos(prev => prev.map(l => l.id === id ? { ...l, ...dados, atualizadoEm: new Date().toISOString() } : l));
    registrarLog('laudos', id, 'editar', `Laudo atualizado: ${dados.numero || id}`);
  };

  const finalizarLaudo = (id: string, artNumero: string, assinaturaUrl?: string) => {
    setLaudos(prev => prev.map(l => {
      if (l.id === id) {
        const atualizado: Laudo = {
          ...l,
          status: 'finalizado',
          artNumero,
          assinaturaUrl: assinaturaUrl || l.assinaturaUrl,
          atualizadoEm: new Date().toISOString(),
        };

        // Also append to active equipment history
        if (l.ativoId) {
          setAtivos(atvList => atvList.map(a => {
            if (a.id === l.ativoId) {
              const naoConf = l.secoes.reduce((acc, sec) => 
                acc + sec.itens.filter(it => it.status === 'nao_conforme').length, 0);
              
              const historicoItem = {
                laudoId: l.id,
                numeroLaudo: l.numero,
                data: l.dataInspecao,
                tipo: l.tipo,
                status: 'finalizado' as const,
                resultado: naoConf === 0 ? 'Aprovado' as const : 'Aprovado com Restrições' as const,
                hrnNivel: l.hrnCalculoGeral?.nivel || 'Baixo',
                totalNaoConformidades: naoConf,
              };

              return {
                ...a,
                historico: [historicoItem, ...(a.historico || [])]
              };
            }
            return a;
          }));
        }

        return atualizado;
      }
      return l;
    }));

    registrarLog('laudos', id, 'finalizar', `Laudo concluído com sucesso e ART vinculada: ${artNumero}`);
  };

  const removerLaudo = (id: string) => {
    setLaudos(prev => prev.filter(l => l.id !== id));
    registrarLog('laudos', id, 'excluir', `Laudo removido: ${id}`);
  };

  // Templates
  const salvarTemplate = (dados: Omit<LaudoTemplate, 'id' | 'criadoEm'>) => {
    const id = `tpl-${Date.now()}`;
    const novo: LaudoTemplate = { ...dados, id, criadoEm: new Date().toISOString() };
    setTemplates(prev => [novo, ...prev]);
    registrarLog('templatesLaudo', id, 'criar', `Template de laudo salvo: ${novo.nome}`);
  };

  const removerTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    registrarLog('templatesLaudo', id, 'excluir', `Template removido: ${id}`);
  };

  // Usuários
  const atualizarPapelUsuario = (uid: string, novoRole: Usuario['role'], clienteId?: string) => {
    setUsuarios(prev => prev.map(u => u.uid === uid ? { ...u, role: novoRole, clienteId: clienteId || u.clienteId } : u));
    registrarLog('usuarios', uid, 'editar', `Permissão alterada para papel: ${novoRole}`);
  };

  const adicionarUsuarioConvidado = (dados: Omit<Usuario, 'uid' | 'criadoEm'>) => {
    const uid = `usr-${Date.now()}`;
    const novo: Usuario = { ...dados, uid, criadoEm: new Date().toISOString() };
    setUsuarios(prev => [novo, ...prev]);
    registrarLog('usuarios', uid, 'criar', `Novo usuário autorizado: ${novo.email} (${novo.role})`);
  };

  // Contato Público
  const enviarContatoPublico = async (dados: Omit<ContatoFormulario, 'id' | 'criadoEm' | 'respondido'>) => {
    const id = `cnt-${Date.now()}`;
    const novo: ContatoFormulario = {
      ...dados,
      id,
      criadoEm: new Date().toISOString(),
      respondido: false,
    };
    setContatos(prev => [novo, ...prev]);
    registrarLog('contatos', id, 'criar', `Novo contato público recebido de: ${dados.nome} (${dados.servicoInteresse})`);
  };

  const marcarContatoRespondido = (id: string) => {
    setContatos(prev => prev.map(c => c.id === id ? { ...c, respondido: true } : c));
  };

  // IA Tracking
  const registrarUsoIA = (quantidade = 1) => {
    setUsoIA(prev => {
      const totalChamadas = (prev?.totalChamadas || 0) + quantidade;
      return {
        ...prev,
        totalChamadas,
        custoEstimadoUSD: Number((totalChamadas * 0.0025).toFixed(4)),
      };
    });
  };

  const atualizarLimiteIA = (novoLimite: number) => {
    setUsoIA(prev => ({ ...prev, limiteMensal: novoLimite }));
  };

  return (
    <DataContext.Provider
      value={{
        clientes,
        ativos,
        orcamentos,
        agenda,
        laudos,
        templates,
        logsAuditoria,
        contatos,
        usuarios,
        usoIA,
        categoriasLaudo,
        adicionarCliente,
        atualizarCliente,
        removerCliente,
        adicionarAtivo,
        atualizarAtivo,
        removerAtivo,
        adicionarOrcamento,
        atualizarOrcamento,
        atualizarStatusOrcamento,
        gerarLaudoFromOrcamento,
        removerOrcamento,
        adicionarVistoria,
        atualizarStatusVistoria,
        removerVistoria,
        atualizarCategoriasLaudo,
        gerarNumeroLaudo,
        criarNovoLaudo,
        criarLaudoPorTaxonomia,
        atualizarLaudo,
        finalizarLaudo,
        removerLaudo,
        salvarTemplate,
        removerTemplate,
        atualizarPapelUsuario,
        adicionarUsuarioConvidado,
        enviarContatoPublico,
        marcarContatoRespondido,
        registrarUsoIA,
        atualizarLimiteIA,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
};
