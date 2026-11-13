import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
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
  TipoLaudoDef,
  ChecklistCampo,
  ChecklistModeloServico,
  SolicitacaoAcesso,
  UserRole
} from '../types';
import { CHECKLIST_MODELOS_PADRAO } from '../lib/checklistModelosPadrao';
import { montarDadosLaudoDeChecklist } from '../lib/checklistToLaudo';
import {
  OfflineSyncConflict,
  countPendingSyncItems,
  enqueueSync,
  getConflicts,
  getPendingQueue,
  recordConflict,
  removeDraftOffline,
  removeFromQueue,
  resolveConflictInStore,
} from '../lib/offlineChecklistStore';
import { 
  TEMPLATES_INICIAIS,
  NR12_REQUISITOS_PADRAO
} from '../data/initialData';
import { CATEGORIAS_LAUDOS_TAXONOMIA } from '../data/taxonomiaLaudos';
import { gerarMinutaTecnicaSecao } from '../lib/geradorMinutasLaudo';
import { gerarLaudoCausaRaizOffline } from '../lib/motorLaudoCausaRaiz';
import { db, auth } from '../lib/firebase';
import { 
  doc, 
  setDoc, 
  deleteDoc, 
  collection, 
  getDoc,
  getDocs, 
  onSnapshot, 
  getDocFromServer,
  deleteField
} from 'firebase/firestore';
import { getHojeLocalYmd } from '../lib/dateUtils';
import { 
  handleFirestoreError, 
  isFirestoreWriteQuotaBlocked, 
  isQuotaExceededError, 
  markFirestoreWriteQuotaBlocked, 
  OperationType 
} from '../lib/firestoreUtils';
import { useAuth } from './AuthContext';
import { 
  HTML_CARDS_CATALOGO_SERVICOS,
  obterTituloLaudoProposta,
  gerarCardClienteHtml,
  gerarHtmlEtapa2Metodologia,
  gerarHtmlEtapa3Investimento,
  gerarHtmlContatoAgradecimento,
  gerarSecoesPadraoOrcamento
} from '../lib/orcamentoTemplatePadrao';

interface DataContextType {
  clientes: Cliente[];
  ativos: Ativo[];
  orcamentos: Orcamento[];
  agenda: AgendaVistoria[];
  laudos: Laudo[];
  templates: LaudoTemplate[];
  logsAuditoria: LogAuditoria[];
  auditLogs: LogAuditoria[];
  contatos: ContatoFormulario[];
  usuarios: Usuario[];
  solicitacoesAcesso: SolicitacaoAcesso[];
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
  atualizarStatusOrcamento: (
    id: string,
    status: Orcamento['status'],
    extras?: FaturamentoDadosExtras
  ) => void;
  gerarLaudoFromOrcamento: (orcamentoId: string, ativoIdEscolhido?: string) => string;
  associarOrcamentoAoLaudo: (orcamentoId: string, laudoId: string | null) => void;
  removerOrcamento: (id: string) => void;

  // Agenda Actions
  adicionarVistoria: (vistoria: Omit<AgendaVistoria, 'id' | 'criadoEm'>) => string;
  atualizarStatusVistoria: (id: string, status: AgendaVistoria['status']) => void;
  removerVistoria: (id: string) => void;

  // Taxonomia & Laudos Actions
  atualizarCategoriasLaudo: (novas: CategoriaLaudoDef[]) => void;
  gerarNumeroLaudo: (prefixo?: string) => string;
  criarNovoLaudo: (dados: Partial<Laudo> & { tipo: string; clienteId: string; ativoId: string }) => string;
  criarLaudoPorTaxonomia: (params: { tipoLaudoId: string; clienteId: string; ativoId: string; artNumero?: string; dataInspecao?: string; modoPreenchimento?: 'em_branco' | 'sugestao_ia' }) => string;
  atualizarLaudo: (id: string, dados: Partial<Laudo>) => void;
  finalizarLaudo: (id: string, artNumero: string, assinaturaUrl?: string) => void;
  removerLaudo: (id: string) => void;

  // Templates Actions
  salvarTemplate: (template: Omit<LaudoTemplate, 'id' | 'criadoEm'>) => void;
  removerTemplate: (id: string) => void;

  // Usuários Actions
  atualizarUsuario: (uid: string, dados: Partial<Usuario>) => void;
  removerUsuario: (uid: string) => void;
  atualizarPapelUsuario: (uid: string, novoRole: Usuario['role'], clienteId?: string) => void;
  adicionarUsuarioConvidado: (usuario: Omit<Usuario, 'uid' | 'criadoEm'>) => void;
  aprovarSolicitacaoAcesso: (id: string, role: UserRole, cargo?: string) => Promise<void>;
  recusarSolicitacaoAcesso: (id: string) => Promise<void>;
  forcarSincronizacaoNuvem: () => Promise<void>;

  // Contato Formulario Público
  enviarContatoPublico: (contato: Omit<ContatoFormulario, 'id' | 'criadoEm' | 'respondido'>) => Promise<void>;
  marcarContatoRespondido: (id: string) => void;

  // IA Tracking
  registrarUsoIA: (tipoOuQtd?: string | number, quantidade?: number) => void;
  atualizarLimiteIA: (novoLimite: number) => void;

  // Checklist de Campo & Modelos Editáveis Actions
  checklistsCampo: ChecklistCampo[];
  checklistModelos: ChecklistModeloServico[];
  atualizarChecklistModelos: (modelos: ChecklistModeloServico[]) => void;
  resetarChecklistModelos: () => void;
  adicionarChecklistCampo: (dados: Omit<ChecklistCampo, 'id' | 'numero' | 'criadoEm' | 'atualizadoEm'>) => string;
  atualizarChecklistCampo: (id: string, dados: Partial<ChecklistCampo>) => void;
  removerChecklistCampo: (id: string) => void;
  finalizarChecklistCampo: (id: string, rubricaUrl?: string) => void;
  gerarOuAtualizarLaudoDeChecklist: (checklistInput: ChecklistCampo) => { laudoId: string; atualizado: boolean };
  alternarPermitePreenchimentoPreliminar: (tipoId: string, permite: boolean) => void;

  // Offline Sync Status & Conflict Resolution
  pendingSyncCount: number;
  syncConflicts: OfflineSyncConflict[];
  sincronizandoOffline: boolean;
  sincronizarChecklistsOffline: () => Promise<void>;
  resolverConflitoChecklist: (conflictId: string, escolha: 'local' | 'remoto' | 'ambos') => Promise<void>;
  atualizarContagemSync: () => Promise<void>;
}

export interface FaturamentoDadosExtras {
  faturadoEm?: string;
  dataInicioServico?: string | null;
  dataEntregaServico?: string | null;
  comprovantePagamentoUrl?: string | null;
  comprovantePagamentoNome?: string | null;
  comprovantePagamentoTipo?: 'imagem' | 'pdf' | null;
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

const FICTITIOUS_IDS = {
  clientes: new Set(['cli-01', 'cli-02', 'cli-03']),
  ativos: new Set(['atv-01', 'atv-02', 'atv-03', 'atv-pgx7098']),
  orcamentos: new Set(['orc-01', 'orc-02', 'orc-03', 'orc-2026-002', 'orc-adf-pgx7098', 'orc-1789155592909']),
  laudos: new Set(['lau-2025-045', 'lau-2026-003', 'lau-2026-001']),
  checklistsCampo: new Set(['chk-01', 'chk-02']),
  agenda: new Set(['ag-01', 'ag-02']),
  usuarios: new Set(['usr-colab-1', 'usr-cli-1']),
  logs: new Set(['log-01']),
  contatos: new Set(['cnt-01']),
};

function getTimestampMs(item: any): number {
  const raw = item?.atualizadoEm || item?.criadoEm || 0;
  const t = new Date(raw).getTime();
  return Number.isFinite(t) ? t : 0;
}

function addTombstone(storageKey: string, id: string): string[] {
  const current: string[] = loadStorage(storageKey, []);
  const next = Array.from(new Set([...current, id]));
  saveStorage(storageKey, next);
  return next;
}

function mesclarColecaoPorId<T extends Record<string, any>>(
  locais: T[],
  remotos: T[],
  removidosSet: Set<string>,
  fictitiousSet: Set<string>,
  idField: 'id' | 'uid' = 'id',
  preferRemoteOnTie = false
): T[] {
  const map = new Map<string, T>();

  if (Array.isArray(locais)) {
    for (const item of locais) {
      const id = item?.[idField];
      if (!id || removidosSet.has(id) || fictitiousSet.has(id)) continue;
      map.set(id, item);
    }
  }

  if (Array.isArray(remotos)) {
    for (const remote of remotos) {
      const id = remote?.[idField];
      if (!id || removidosSet.has(id) || fictitiousSet.has(id)) continue;
      const local = map.get(id);
      if (!local) {
        map.set(id, remote);
      } else {
        const tLocal = getTimestampMs(local);
        const tRemote = getTimestampMs(remote);
        const remoteWins = preferRemoteOnTie ? tRemote >= tLocal : tRemote > tLocal;
        map.set(id, remoteWins ? ({ ...local, ...remote } as T) : ({ ...remote, ...local } as T));
      }
    }
  }

  return Array.from(map.values());
}

function normalizarChecklistsCampo(lista: ChecklistCampo[]): ChecklistCampo[] {
  if (!Array.isArray(lista)) return [];
  const porId = new Map<string, ChecklistCampo>();

  lista.forEach((chk, idx) => {
    if (!chk || typeof chk !== 'object') return;
    const idLimpo = chk.id && String(chk.id).trim() ? String(chk.id) : `chk-legacy-${idx}`;

    const normalizarItens = (arr: any[] | undefined, prefixo: string) => {
      if (!Array.isArray(arr)) return [];
      const vistos = new Set<string>();
      return arr.map((it, itIdx) => {
        let itemId = it?.id && String(it.id).trim() ? String(it.id) : `${prefixo}-${idLimpo}-${itIdx + 1}`;
        if (vistos.has(itemId)) {
          itemId = `${itemId}-${itIdx + 1}`;
        }
        vistos.add(itemId);
        return { ...it, id: itemId };
      });
    };

    const itensNorm = normalizarItens(chk.itens, 'it');
    const extrasNorm = normalizarItens(chk.itensExtras, 'extra');
    const candidato: ChecklistCampo = {
      ...chk,
      id: idLimpo,
      itens: itensNorm,
      itensExtras: extrasNorm,
    };

    const existente = porId.get(idLimpo);
    if (!existente) {
      porId.set(idLimpo, candidato);
    } else {
      const tExist = new Date(existente.atualizadoEm || existente.criadoEm || 0).getTime();
      const tCand = new Date(candidato.atualizadoEm || candidato.criadoEm || 0).getTime();
      if (tCand >= tExist) {
        porId.set(idLimpo, candidato);
      }
    }
  });

  return Array.from(porId.values());
}

function normalizarNumeroLaudoPadrao(numero?: string): string {
  if (!numero) return '';
  const match = numero.trim().match(/^LAU-(\d{4})\/(\d+)$/i);
  if (match) return `LAR-${match[1]}-${match[2]}`;
  return numero.replace(/^LAU-(\d{4})-(\d+)$/i, 'LAR-$1-$2');
}

function normalizarLaudoPadrao(l: Laudo, clientesLista: Cliente[]): Laudo {
  let atualizado = l;
  const numNorm = normalizarNumeroLaudoPadrao(l.numero);
  const mudouNumero = Boolean(numNorm && numNorm !== l.numero);

  const nomeTrim = (l.clienteNome || '').trim();
  const nomeGenerico = !nomeTrim || /^cliente(\s+contratante|\s+corporativo)?$/i.test(nomeTrim);
  const clienteRef = l.clienteId ? clientesLista.find(c => c.id === l.clienteId) : undefined;
  const ativoIdCorrigido = l.ativoId === 'atv-pgx7098' ? 'atv-1790444362907' : l.ativoId;
  const mudouAtivo = ativoIdCorrigido !== l.ativoId;

  if (mudouNumero || nomeGenerico || mudouAtivo) {
    const secoesAtualizadas = mudouNumero && Array.isArray(l.secoes)
      ? l.secoes.map(sec =>
          sec.conteudoHtml && sec.conteudoHtml.includes('LAU-2026/002')
            ? { ...sec, conteudoHtml: sec.conteudoHtml.replace(/LAU-2026\/002/g, 'LAR-2026-002') }
            : sec
        )
      : l.secoes;

    atualizado = {
      ...l,
      numero: numNorm || l.numero,
      ativoId: ativoIdCorrigido,
      clienteId: clienteRef?.id || l.clienteId,
      clienteNome: nomeGenerico
        ? (clienteRef?.nomeFantasia || clienteRef?.razaoSocial || l.clienteNome)
        : l.clienteNome,
      secoes: secoesAtualizadas,
    };
  }
  return atualizado;
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, firebaseUser, isOnline } = useAuth();

  const [clientes, setClientes] = useState<Cliente[]>(() => {
    const removidosSet = new Set<string>(loadStorage('vl_clientes_removidos_ids', []));
    const loaded: Cliente[] = loadStorage('vl_clientes', []);
    const limpos = (Array.isArray(loaded) ? loaded : []).filter(
      c => c?.id && !removidosSet.has(c.id) && !FICTITIOUS_IDS.clientes.has(c.id)
    );
    if (limpos.length !== loaded.length) {
      saveStorage('vl_clientes', limpos);
    }
    return limpos;
  });

  const [ativos, setAtivos] = useState<Ativo[]>(() => {
    const removidosSet = new Set<string>(loadStorage('vl_ativos_removidos_ids', []));
    const loaded: Ativo[] = loadStorage('vl_ativos', []);
    const limpos = (Array.isArray(loaded) ? loaded : []).filter(
      a => a?.id && !removidosSet.has(a.id) && !FICTITIOUS_IDS.ativos.has(a.id)
    );
    if (limpos.length !== loaded.length) {
      saveStorage('vl_ativos', limpos);
    }
    return limpos;
  });

  const [orcamentos, setOrcamentos] = useState<Orcamento[]>(() => {
    const removidosSet = new Set<string>(loadStorage('vl_orcamentos_removidos_ids', []));
    let loaded: Orcamento[] = loadStorage('vl_orcamentos', []);
    const antesLen = Array.isArray(loaded) ? loaded.length : 0;
    loaded = (Array.isArray(loaded) ? loaded : []).filter(
      o => o?.id && !removidosSet.has(o.id) && !FICTITIOUS_IDS.orcamentos.has(o.id)
    );
    let alterouStorage = loaded.length !== antesLen;

    const migrados = loaded.map((orc: Orcamento) => {
      let orcAtualizado = { ...orc };
      let modificouOrc = false;

      // 1. Upgrade secoes if present
      if (orcAtualizado.secoes && orcAtualizado.secoes.length > 0) {
        const clienteNome = orcAtualizado.clienteNome || 'Cliente Contratante';
        const cnpj = orcAtualizado.cnpjCliente || 'Consulte o contrato';
        const representante = orcAtualizado.representanteNome || 'Diretoria / Coordenação Técnica';
        const localidade = orcAtualizado.localidadeServico || 'Recife e Região Metropolitana - PE';
        const codigo = orcAtualizado.codigoProposta || orcAtualizado.id;
        const validade = orcAtualizado.validadeDias || 15;
        const prazo = orcAtualizado.prazoEntrega || `${orcAtualizado.prazoDias || 7} dias úteis`;
        const valor = orcAtualizado.valorFormatado || (orcAtualizado.valor ? orcAtualizado.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 3.500,00');
        const condicoes = orcAtualizado.condicoesPagamento || '50% de entrada na aprovação e 50% após emissão do laudo final e ART.';
        const normas = orcAtualizado.normasTecnicas || 'ABNT NBR, NR-11, NR-12, NR-13 conforme aplicável';
        const tituloLaudoDinamico = obterTituloLaudoProposta(orcAtualizado);

        if (orcAtualizado.incluiNotaFiscal === undefined) {
          orcAtualizado.incluiNotaFiscal = true;
          modificouOrc = true;
        }
        if (!orcAtualizado.chavePix) {
          orcAtualizado.chavePix = '10287093409';
          orcAtualizado.chavePixTipo = 'cpf';
          modificouOrc = true;
        }

        const novasSecoes = orcAtualizado.secoes.map((s) => {
          const isCapa = s.id === 'capa' || s.numero === 1 || (s.titulo && s.titulo.toLowerCase().includes('capa'));
          const isCatalogo = s.id === 'catalogo' || s.numero === 6 ||
            (s.titulo && s.titulo.toLowerCase().includes('resumo de nossos serviços')) ||
            (s.subtitulo && s.subtitulo.toLowerCase().includes('catálogo de laudos'));
          const isEtapa2 = s.id === 'etapa2' || s.numero === 10 ||
            (s.titulo && (s.titulo.toLowerCase().includes('etapa 2') || s.titulo.toLowerCase().includes('metodologia')));
          const isEtapa3 = s.id === 'etapa3' || s.numero === 12 ||
            (s.titulo && (s.titulo.toLowerCase().includes('etapa 3') || s.titulo.toLowerCase().includes('investimento')));
          const isContato = s.id === 'contato' || s.numero === 13 ||
            (s.titulo && (s.titulo.toLowerCase().includes('contato') || s.titulo.toLowerCase().includes('agradecimento')));

          if (isCapa) {
            const precisaAtualizar = !s.conteudoHtml ||
              s.conteudoHtml.includes('PROPOSTA TÉCNICA COMERCIAL // ORÇAMENTO DE ENGENHARIA') && !s.conteudoHtml.includes('DADOS DO CLIENTE CONTRATANTE');

            if (precisaAtualizar) {
              modificouOrc = true;
              return {
                ...s,
                titulo: 'PROPOSTA TÉCNICA COMERCIAL // ORÇAMENTO DE ENGENHARIA',
                subtitulo: tituloLaudoDinamico,
                conteudoHtml: gerarCardClienteHtml({
                  clienteNome,
                  cnpj,
                  representante,
                  localidade,
                  codigo,
                  validade,
                  prazo
                }),
              };
            }
          }

          if (isCatalogo) {
            const precisaAtualizar = orc.id === 'orc-1790444416499' && (
              s.conteudoHtml.includes('PLAYGROUNDS:') ||
              s.conteudoHtml.includes('ADEQUAÇÃO NR-12:') ||
              !s.conteudoHtml.includes('grid-template-columns')
            );

            if (precisaAtualizar) {
              modificouOrc = true;
              return {
                ...s,
                titulo: 'Resumo de Nossos Serviços de Engenharia',
                subtitulo: 'CATÁLOGO DE LAUDOS E ADEQUAÇÕES INDUSTRIAIS',
                conteudoHtml: HTML_CARDS_CATALOGO_SERVICOS,
              };
            }
          }

          if (isEtapa2) {
            if (!s.conteudoHtml || s.conteudoHtml.trim() === '' || !s.conteudoHtml.includes('FASE 01')) {
              modificouOrc = true;
              return {
                ...s,
                titulo: 'Etapa 2 - Escopo Técnico das Atividades (Metodologia)',
                subtitulo: 'METODOLOGIA DE ENGENHARIA EM ETAPAS',
                conteudoHtml: gerarHtmlEtapa2Metodologia(normas, orc.metodologiaFases, orc.tituloMetodologia),
              };
            }
          }

          if (isEtapa3) {
            let htmlEtapa3 = s.conteudoHtml;
            if (!htmlEtapa3 || htmlEtapa3.trim() === '' || !htmlEtapa3.includes('Memorial de Cálculo')) {
              modificouOrc = true;
              return {
                ...s,
                titulo: 'Etapa 3 - Prazo, Pagamento & Investimento',
                subtitulo: 'INVESTIMENTO COMERCIAL E TERMOS FINANCEIROS',
                conteudoHtml: gerarHtmlEtapa3Investimento({
                  valor,
                  prazo,
                  condicoes,
                  validade,
                  clienteNome,
                  representante,
                  incluiNotaFiscal: orcAtualizado.incluiNotaFiscal,
                  chavePix: orcAtualizado.chavePix,
                  itensCalculo: orcAtualizado.itensCalculo,
                }),
              };
            } else if (
              htmlEtapa3.includes('Assinado Digitalmente') ||
              htmlEtapa3.includes('Aceite Eletrônico') ||
              htmlEtapa3.includes('• CREA-PE 182229949-0') ||
              htmlEtapa3.includes('PIX IMEDIATO') ||
              htmlEtapa3.includes('TRANSPARÊNCIA') ||
              htmlEtapa3.includes('Relatório Colorido')
            ) {
              modificouOrc = true;
              htmlEtapa3 = htmlEtapa3
                .replace(/<span[^>]*>[^<]*Assinado Digitalmente pelo Emissor[^<]*<\/span>/gi, '')
                .replace(/<span[^>]*>[^<]*\[Aceite Eletrônico \/ Assinatura Digital\][^<]*<\/span>/gi, '')
                .replace(/✓ Assinado Digitalmente pelo Emissor/g, '')
                .replace(/\[Aceite Eletrônico \/ Assinatura Digital\]/g, '')
                .replace(/Titular:\s*<strong>([^<]+)<\/strong>\s*•\s*CREA-PE\s*182229949-0/gi, 'Titular: <strong>$1</strong>')
                .replace(/<div style="text-align:\s*right;\s*flex-shrink:\s*0;">\s*<span[^>]*>[^<]*PIX IMEDIATO[^<]*<\/span>\s*<\/div>/gi, '')
                .replace(/<span[^>]*>[^<]*PIX IMEDIATO[^<]*<\/span>/gi, '')
                .replace(/<span[^>]*>[^<]*TRANSPARÊNCIA[^<]*<\/span>/gi, '')
                .replace(/Deslocamento e Relatório Colorido/g, 'Deslocamento e Laudo Completo');
              return { ...s, conteudoHtml: htmlEtapa3 };
            }
          }

          if (isContato) {
            if (!s.conteudoHtml || s.conteudoHtml.trim() === '' || s.conteudoHtml.includes('🤝') || !s.conteudoHtml.includes('HEADER HERO EXECUTIVO') || s.conteudoHtml.includes('Recife & Polo Industrial de Suape') || s.conteudoHtml.includes('vlengenhariamec@gmail.com')) {
              modificouOrc = true;
              return {
                ...s,
                titulo: 'Agradecimento & Contato',
                subtitulo: 'INFORMAÇÕES INSTITUCIONAIS E ATENDIMENTO DIRETO',
                conteudoHtml: gerarHtmlContatoAgradecimento(),
              };
            }
          }

          return s;
        });

        if (modificouOrc) {
          orcAtualizado.secoes = novasSecoes;
        }
      } else {
        // Inicializa as 13 seções caso o orçamento ainda não as possua
        orcAtualizado.secoes = gerarSecoesPadraoOrcamento(orcAtualizado);
        modificouOrc = true;
      }

      // 2. Upgrade paginasProposta if present
      if (orcAtualizado.paginasProposta && orcAtualizado.paginasProposta.length > 0) {
        const clienteNome = orcAtualizado.clienteNome || 'Cliente Contratante';
        const cnpj = orcAtualizado.cnpjCliente || 'Consulte o contrato';
        const representante = orcAtualizado.representanteNome || 'Diretoria / Coordenação Técnica';
        const localidade = orcAtualizado.localidadeServico || 'Recife e Região Metropolitana - PE';
        const codigo = orcAtualizado.codigoProposta || orcAtualizado.id;
        const validade = orcAtualizado.validadeDias || 15;
        const prazo = orcAtualizado.prazoEntrega || `${orcAtualizado.prazoDias || 7} dias úteis`;
        const valor = orcAtualizado.valorFormatado || (orcAtualizado.valor ? orcAtualizado.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 3.500,00');
        const condicoes = orcAtualizado.condicoesPagamento || '50% de entrada na aprovação e 50% após emissão do laudo final e ART.';
        const normas = orcAtualizado.normasTecnicas || 'ABNT NBR, NR-11, NR-12, NR-13 conforme aplicável';
        const tituloLaudoDinamico = obterTituloLaudoProposta(orcAtualizado);

        const novasPaginas = orcAtualizado.paginasProposta.map((p) => {
          const isCapa = p.numero === 1 || (p.titulo && p.titulo.toLowerCase().includes('capa'));
          const isCatalogo = p.numero === 6 ||
            (p.titulo && p.titulo.toLowerCase().includes('resumo de nossos serviços')) ||
            (p.subtitulo && p.subtitulo.toLowerCase().includes('catálogo de laudos'));
          const isEtapa2 = p.numero === 10 ||
            (p.titulo && (p.titulo.toLowerCase().includes('etapa 2') || p.titulo.toLowerCase().includes('metodologia')));
          const isEtapa3 = p.numero === 12 ||
            (p.titulo && (p.titulo.toLowerCase().includes('etapa 3') || p.titulo.toLowerCase().includes('investimento')));
          const isContato = p.numero === 13 ||
            (p.titulo && (p.titulo.toLowerCase().includes('contato') || p.titulo.toLowerCase().includes('agradecimento')));

          if (isCapa) {
            const precisaAtualizar = !p.conteudoHtml ||
              !p.conteudoHtml.includes('DADOS DO CLIENTE CONTRATANTE') ||
              p.conteudoHtml.includes('PROPOSTA TÉCNICA COMERCIAL // ORÇAMENTO DE ENGENHARIA') ||
              p.titulo.toLowerCase().includes('capa');

            if (precisaAtualizar) {
              modificouOrc = true;
              return {
                ...p,
                titulo: 'PROPOSTA TÉCNICA COMERCIAL // ORÇAMENTO DE ENGENHARIA',
                subtitulo: tituloLaudoDinamico,
                conteudoHtml: gerarCardClienteHtml({
                  clienteNome,
                  cnpj,
                  representante,
                  localidade,
                  codigo,
                  validade,
                  prazo
                }),
              };
            }
          }

          if (isCatalogo) {
            const precisaAtualizar = orc.id === 'orc-1790444416499' ||
              !p.conteudoHtml ||
              p.conteudoHtml.includes('PLAYGROUNDS:') ||
              p.conteudoHtml.includes('ADEQUAÇÃO NR-12:') ||
              !p.conteudoHtml.includes('NR-12 • MÁQUINAS INDUSTRIAIS') ||
              !p.conteudoHtml.includes('grid-template-columns');

            if (precisaAtualizar) {
              modificouOrc = true;
              return {
                ...p,
                titulo: 'RESUMO DE NOSSOS SERVIÇOS DE ENGENHARIA',
                subtitulo: 'CATÁLOGO DE LAUDOS E ADEQUAÇÕES INDUSTRIAIS',
                conteudoHtml: HTML_CARDS_CATALOGO_SERVICOS,
              };
            }
          }

          if (isEtapa2) {
            if (!p.conteudoHtml || p.conteudoHtml.trim() === '') {
              modificouOrc = true;
              return {
                ...p,
                titulo: 'Etapa 2 - Escopo Técnico das Atividades (Metodologia)',
                subtitulo: 'FASES, CHECKLISTS E ENSAIOS EM 4 ETAPAS',
                conteudoHtml: gerarHtmlEtapa2Metodologia(normas),
              };
            }
          }

          if (isEtapa3) {
            if (!p.conteudoHtml || p.conteudoHtml.trim() === '') {
              modificouOrc = true;
              return {
                ...p,
                titulo: 'Etapa 3 - Prazo, Pagamento & Investimento',
                subtitulo: 'INVESTIMENTO COMERCIAL E TERMOS FINANCEIROS',
                conteudoHtml: gerarHtmlEtapa3Investimento({
                  valor,
                  prazo,
                  condicoes,
                  validade,
                  clienteNome,
                  representante,
                  incluiNotaFiscal: orcAtualizado.incluiNotaFiscal,
                  chavePix: orcAtualizado.chavePix,
                }),
              };
            }
          }

          if (isContato) {
            if (!p.conteudoHtml || p.conteudoHtml.trim() === '' || p.conteudoHtml.includes('Recife & Polo Industrial de Suape') || p.conteudoHtml.includes('vlengenhariamec@gmail.com')) {
              modificouOrc = true;
              return {
                ...p,
                titulo: 'Agradecimento & Contato',
                subtitulo: 'INFORMAÇÕES INSTITUCIONAIS E ATENDIMENTO DIRETO',
                conteudoHtml: gerarHtmlContatoAgradecimento(),
              };
            }
          }

          return p;
        });

        if (modificouOrc) {
          orcAtualizado.paginasProposta = novasPaginas;
        }
      }

      if (modificouOrc) {
        alterouStorage = true;
      }
      return orcAtualizado;
    });

    if (alterouStorage) {
      saveStorage('vl_orcamentos', migrados);
    }
    return migrados;
  });
  const [agenda, setAgenda] = useState<AgendaVistoria[]>(() => {
    const removidosSet = new Set<string>(loadStorage('vl_agenda_removidos_ids', []));
    const loaded: AgendaVistoria[] = loadStorage('vl_agenda', []);
    const limpos = (Array.isArray(loaded) ? loaded : []).filter(
      a => a?.id && !removidosSet.has(a.id) && !FICTITIOUS_IDS.agenda.has(a.id)
    );
    if (limpos.length !== loaded.length) saveStorage('vl_agenda', limpos);
    return limpos;
  });

  const [laudos, setLaudos] = useState<Laudo[]>(() => {
    const removidosSet = new Set<string>(loadStorage('vl_laudos_removidos_ids', []));
    let loaded: Laudo[] = loadStorage('vl_laudos', []);
    const antesLen = Array.isArray(loaded) ? loaded.length : 0;
    loaded = (Array.isArray(loaded) ? loaded : []).filter(
      l => l?.id && !removidosSet.has(l.id) && !FICTITIOUS_IDS.laudos.has(l.id)
    );
    let alterouStorage = loaded.length !== antesLen;

    loaded = loaded.map((l: Laudo) => {
      const norm = normalizarLaudoPadrao(l, clientes);
      if (norm !== l) alterouStorage = true;
      return norm;
    });

    if (alterouStorage) {
      saveStorage('vl_laudos', loaded);
    }
    return loaded;
  });

  const [templates, setTemplates] = useState<LaudoTemplate[]>(() => loadStorage('vl_templates', TEMPLATES_INICIAIS));
  const [checklistsCampo, setChecklistsCampo] = useState<ChecklistCampo[]>(() => {
    const removidosSet = new Set<string>(loadStorage('vl_checklists_removidos_ids', []));
    const loaded: ChecklistCampo[] = loadStorage('vl_checklists_campo', []);
    const limpos = normalizarChecklistsCampo(loaded).filter(
      c => c?.id && !removidosSet.has(c.id) && !FICTITIOUS_IDS.checklistsCampo.has(c.id)
    );
    if (limpos.length !== loaded.length) saveStorage('vl_checklists_campo', limpos);
    return limpos;
  });
  const [checklistModelos, setChecklistModelos] = useState<ChecklistModeloServico[]>(() =>
    loadStorage('vl_checklist_modelos', CHECKLIST_MODELOS_PADRAO)
  );
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [syncConflicts, setSyncConflicts] = useState<OfflineSyncConflict[]>([]);
  const [sincronizandoOffline, setSincronizandoOffline] = useState<boolean>(false);
  const [categoriasLaudo, setCategoriasLaudo] = useState<CategoriaLaudoDef[]>(() => {
    const loaded = loadStorage('vl_taxonomia_categorias', CATEGORIAS_LAUDOS_TAXONOMIA);
    const cat1Atualizada = CATEGORIAS_LAUDOS_TAXONOMIA.find(c => c.id === 'cat-1');
    const cat2Atualizada = CATEGORIAS_LAUDOS_TAXONOMIA.find(c => c.id === 'cat-2');
    const cat3Atualizada = CATEGORIAS_LAUDOS_TAXONOMIA.find(c => c.id === 'cat-3');
    const cat4Atualizada = CATEGORIAS_LAUDOS_TAXONOMIA.find(c => c.id === 'cat-4');
    const cat6Atualizada = CATEGORIAS_LAUDOS_TAXONOMIA.find(c => c.id === 'cat-6');
    const cat7Atualizada = CATEGORIAS_LAUDOS_TAXONOMIA.find(c => c.id === 'cat-7');
    const cat8Atualizada = CATEGORIAS_LAUDOS_TAXONOMIA.find(c => c.id === 'cat-8');
    const cat9Atualizada = CATEGORIAS_LAUDOS_TAXONOMIA.find(c => c.id === 'cat-9');
    const cat10Atualizada = CATEGORIAS_LAUDOS_TAXONOMIA.find(c => c.id === 'cat-10');
    const cat11Atualizada = CATEGORIAS_LAUDOS_TAXONOMIA.find(c => c.id === 'cat-11');
    const cat12Atualizada = CATEGORIAS_LAUDOS_TAXONOMIA.find(c => c.id === 'cat-12');
    return loaded.map((cat: CategoriaLaudoDef) => {
      if (cat.id === 'cat-1' && cat1Atualizada) return cat1Atualizada;
      if (cat.id === 'cat-2' && cat2Atualizada) return cat2Atualizada;
      if (cat.id === 'cat-3' && cat3Atualizada) return cat3Atualizada;
      if (cat.id === 'cat-4' && cat4Atualizada) return cat4Atualizada;
      if (cat.id === 'cat-6' && cat6Atualizada) return cat6Atualizada;
      if (cat.id === 'cat-7' && cat7Atualizada) return cat7Atualizada;
      if (cat.id === 'cat-8' && cat8Atualizada) return cat8Atualizada;
      if (cat.id === 'cat-9' && cat9Atualizada) return cat9Atualizada;
      if (cat.id === 'cat-10' && cat10Atualizada) return cat10Atualizada;
      if (cat.id === 'cat-11' && cat11Atualizada) return cat11Atualizada;
      if (cat.id === 'cat-12' && cat12Atualizada) return cat12Atualizada;
      return cat;
    });
  });
  const [logsAuditoria, setLogsAuditoria] = useState<LogAuditoria[]>(() => {
    const loaded: LogAuditoria[] = loadStorage('vl_logs', []);
    return (Array.isArray(loaded) ? loaded : [])
      .filter(l => l?.id && !FICTITIOUS_IDS.logs.has(l.id))
      .map((l) => l.usuarioEmail === 'vitorleonardocl@gmail.com' ? { ...l, usuarioEmail: 'vlengenhariamec@gmail.com' } : l);
  });

  const [contatos, setContatos] = useState<ContatoFormulario[]>(() => {
    const loaded: ContatoFormulario[] = loadStorage('vl_contatos', []);
    return (Array.isArray(loaded) ? loaded : []).filter(c => c?.id && !FICTITIOUS_IDS.contatos.has(c.id));
  });

  const masterVitor: Usuario = {
    uid: 'master-vitor-leonardo',
    nome: 'Eng. Vitor Leonardo',
    email: 'vitorleonardocl@gmail.com',
    role: 'master',
    cargo: 'Responsável Técnico / Fundador (CREA-PE 1822299490)',
    crea: '1822299490',
    ativo: true,
    criadoEm: '2025-01-01T00:00:00Z',
  };

  const [usuarios, setUsuarios] = useState<Usuario[]>(() => {
    const removidosSet = new Set<string>(loadStorage('vl_usuarios_removidos_ids', []));
    const loaded: Usuario[] = loadStorage('vl_usuarios', [masterVitor]);
    const limpos = (Array.isArray(loaded) ? loaded : []).filter(
      u => u?.uid && !removidosSet.has(u.uid) && !FICTITIOUS_IDS.usuarios.has(u.uid)
    );
    const temMaster = limpos.some(u => u.email?.toLowerCase() === 'vitorleonardocl@gmail.com');
    const resultado = !temMaster
      ? [masterVitor, ...limpos]
      : limpos.map(u => u.email?.toLowerCase() === 'vitorleonardocl@gmail.com' ? { ...u, role: 'master' as const, ativo: true } : u);
    if (resultado.length !== loaded.length) {
      saveStorage('vl_usuarios', resultado);
    }
    return resultado;
  });

  const [solicitacoesAcesso, setSolicitacoesAcesso] = useState<SolicitacaoAcesso[]>(() => {
    return loadStorage('vl_solicitacoes_acesso', []);
  });

  const [usoIA, setUsoIA] = useState<UsoIAMetricas>(() => {
    const defaultData: UsoIAMetricas = {
      totalChamadas: 0,
      limiteMensal: 500,
      mesAno: new Date().toISOString().slice(0, 7),
      mesReferencia: 'Setembro/2026',
      custoEstimadoUSD: 0,
    };
    const loaded = loadStorage('vl_uso_ia', defaultData);
    const chamadas = loaded?.totalChamadas ?? 0;
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
  useEffect(() => saveStorage('vl_checklists_campo', checklistsCampo), [checklistsCampo]);
  useEffect(() => saveStorage('vl_checklist_modelos', checklistModelos), [checklistModelos]);
  useEffect(() => saveStorage('vl_taxonomia_categorias', categoriasLaudo), [categoriasLaudo]);
  useEffect(() => saveStorage('vl_logs', logsAuditoria), [logsAuditoria]);
  useEffect(() => saveStorage('vl_contatos', contatos), [contatos]);
  useEffect(() => saveStorage('vl_usuarios', usuarios), [usuarios]);
  useEffect(() => saveStorage('vl_solicitacoes_acesso', solicitacoesAcesso), [solicitacoesAcesso]);
  useEffect(() => saveStorage('vl_uso_ia', usoIA), [usoIA]);

  const isHydratedRef = useRef(false);

  const salvarServidorDireto = useCallback((parcial: { 
    clientes?: Cliente[]; 
    ativos?: Ativo[]; 
    orcamentos?: Orcamento[];
    laudos?: Laudo[];
    checklistsCampo?: ChecklistCampo[];
    agenda?: AgendaVistoria[];
    usuarios?: Usuario[];
    clientesRemovidosIds?: string[];
    ativosRemovidosIds?: string[];
    orcamentosRemovidosIds?: string[];
    laudosRemovidosIds?: string[];
    checklistsRemovidosIds?: string[];
    agendaRemovidosIds?: string[];
    usuariosRemovidosIds?: string[];
  }) => {
    fetch('/api/app-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parcial)
    }).catch(e => {
      console.warn('[Sync Servidor Imediato] Falha ao persistir:', e);
    });
  }, []);

  // Sincronização centralizada com o banco de dados em nuvem (Firestore)
  useEffect(() => {
    // SÓ conecta listeners e sincroniza com o Firestore se houver usuário real autenticado no Firebase Auth E autorizado
    if (!firebaseUser || !auth?.currentUser || !currentUser || !db) return;
    if (currentUser.role !== 'master' && currentUser.role !== 'colaborador') return;

    let cancelado = false;

    const initAndListenFirestore = async () => {
      // Test connection to Firestore sem gravações automáticas
      getDocFromServer(doc(db, 'test', 'connection')).catch(error => {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.warn('Firestore offline fallback:', error);
        }
      });

      if (cancelado) return;

      // Listeners em tempo real mesclando sem sobrescrever edições locais ou registros não sincronizados
      const unsubClientes = onSnapshot(collection(db, 'clientes'), (snapshot) => {
        if (!snapshot.empty) {
          const removidosSet = new Set<string>(loadStorage('vl_clientes_removidos_ids', []));
          const docs = snapshot.docs.map(d => d.data() as Cliente);
          setClientes(prev => {
            const merged = mesclarColecaoPorId(prev, docs, removidosSet, FICTITIOUS_IDS.clientes, 'id');
            saveStorage('vl_clientes', merged);
            return merged;
          });
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'clientes');
      });

      const unsubAtivos = onSnapshot(collection(db, 'ativos'), (snapshot) => {
        if (!snapshot.empty) {
          const removidosSet = new Set<string>(loadStorage('vl_ativos_removidos_ids', []));
          const docs = snapshot.docs.map(d => d.data() as Ativo);
          setAtivos(prev => {
            const merged = mesclarColecaoPorId(prev, docs, removidosSet, FICTITIOUS_IDS.ativos, 'id');
            saveStorage('vl_ativos', merged);
            return merged;
          });
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'ativos');
      });

      const unsubOrcamentos = onSnapshot(collection(db, 'orcamentos'), (snapshot) => {
        if (!snapshot.empty) {
          const removidosSet = new Set<string>(loadStorage('vl_orcamentos_removidos_ids', []));
          const docs = snapshot.docs.map(d => d.data() as Orcamento);
          setOrcamentos(prev => {
            const merged = mesclarColecaoPorId(prev, docs, removidosSet, FICTITIOUS_IDS.orcamentos, 'id');
            saveStorage('vl_orcamentos', merged);
            return merged;
          });
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'orcamentos');
      });

      const unsubLaudos = onSnapshot(collection(db, 'laudos'), (snapshot) => {
        if (!snapshot.empty) {
          const removidosSet = new Set<string>(loadStorage('vl_laudos_removidos_ids', []));
          const docs = snapshot.docs.map(d => normalizarLaudoPadrao(d.data() as Laudo, clientes));
          setLaudos(prev => {
            const merged = mesclarColecaoPorId(prev, docs, removidosSet, FICTITIOUS_IDS.laudos, 'id');
            saveStorage('vl_laudos', merged);
            return merged;
          });
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'laudos');
      });

      const unsubChecklists = onSnapshot(collection(db, 'checklistsCampo'), (snapshot) => {
        if (!snapshot.empty) {
          const removidosSet = new Set<string>(loadStorage('vl_checklists_removidos_ids', []));
          const docs = normalizarChecklistsCampo(snapshot.docs.map(d => ({ ...(d.data() as ChecklistCampo), id: d.id })));
          setChecklistsCampo(prev => {
            const merged = normalizarChecklistsCampo(
              mesclarColecaoPorId(prev, docs, removidosSet, FICTITIOUS_IDS.checklistsCampo, 'id')
            );
            saveStorage('vl_checklists_campo', merged);
            return merged;
          });
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'checklistsCampo');
      });

      const unsubAgenda = onSnapshot(collection(db, 'agendaVistorias'), (snapshot) => {
        if (!snapshot.empty) {
          const removidosSet = new Set<string>(loadStorage('vl_agenda_removidos_ids', []));
          const docs = snapshot.docs.map(d => d.data() as AgendaVistoria);
          setAgenda(prev => {
            const merged = mesclarColecaoPorId(prev, docs, removidosSet, FICTITIOUS_IDS.agenda, 'id');
            saveStorage('vl_agenda', merged);
            return merged;
          });
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'agendaVistorias');
      });

      const unsubUsuarios = onSnapshot(collection(db, 'usuarios'), (snapshot) => {
        if (!snapshot.empty) {
          const removidosSet = new Set<string>(loadStorage('vl_usuarios_removidos_ids', []));
          const docs = snapshot.docs.map(d => d.data() as Usuario);
          setUsuarios(prev => {
            const merged = mesclarColecaoPorId(prev, docs, removidosSet, FICTITIOUS_IDS.usuarios, 'uid');
            saveStorage('vl_usuarios', merged);
            return merged;
          });
        }
      }, (error) => {
        console.warn('[Firestore] Erro listener usuarios:', error);
      });

      unsubs.push(unsubClientes, unsubAtivos, unsubOrcamentos, unsubLaudos, unsubChecklists, unsubAgenda, unsubUsuarios);

      if (currentUser.role === 'master') {
        const unsubSolicitacoes = onSnapshot(collection(db, 'solicitacoesAcesso'), (snapshot) => {
          if (!snapshot.empty) {
            const docs = snapshot.docs.map(d => d.data() as SolicitacaoAcesso);
            setSolicitacoesAcesso(docs);
            saveStorage('vl_solicitacoes_acesso', docs);
          }
        }, (error) => {
          console.warn('[Firestore] Erro listener solicitacoesAcesso:', error);
        });
        unsubs.push(unsubSolicitacoes);
      }
    };

    const unsubs: (() => void)[] = [];
    initAndListenFirestore();

    return () => {
      cancelado = true;
      unsubs.forEach(unsub => unsub());
    };
  }, [firebaseUser, currentUser?.role, currentUser?.uid]);

  // Sincronização com persistência do servidor (/api/app-data)
  useEffect(() => {
    fetch('/api/app-data')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!data) {
          isHydratedRef.current = true;
          return;
        }

        const mergeRemovidos = (storageKey: string, serverIds?: unknown) => {
          const localIds: string[] = loadStorage(storageKey, []);
          const combined = Array.from(new Set([
            ...(Array.isArray(localIds) ? localIds : []),
            ...(Array.isArray(serverIds) ? serverIds : []),
          ]));
          if (combined.length > 0) saveStorage(storageKey, combined);
          return new Set<string>(combined);
        };

        const cliRem = mergeRemovidos('vl_clientes_removidos_ids', data.clientesRemovidosIds);
        const atvRem = mergeRemovidos('vl_ativos_removidos_ids', data.ativosRemovidosIds);
        const orcRem = mergeRemovidos('vl_orcamentos_removidos_ids', data.orcamentosRemovidosIds);
        const lauRem = mergeRemovidos('vl_laudos_removidos_ids', data.laudosRemovidosIds);
        const chkRem = mergeRemovidos('vl_checklists_removidos_ids', data.checklistsRemovidosIds);
        const agRem = mergeRemovidos('vl_agenda_removidos_ids', data.agendaRemovidosIds);
        const usrRem = mergeRemovidos('vl_usuarios_removidos_ids', data.usuariosRemovidosIds);

        if (Array.isArray(data.clientes)) {
          setClientes(prev => {
            const merged = mesclarColecaoPorId(prev, data.clientes, cliRem, FICTITIOUS_IDS.clientes, 'id', true);
            saveStorage('vl_clientes', merged);
            return merged;
          });
        }

        if (Array.isArray(data.ativos)) {
          setAtivos(prev => {
            const merged = mesclarColecaoPorId(prev, data.ativos, atvRem, FICTITIOUS_IDS.ativos, 'id', true);
            saveStorage('vl_ativos', merged);
            return merged;
          });
        }

        if (Array.isArray(data.orcamentos)) {
          setOrcamentos(prev => {
            const merged = mesclarColecaoPorId(prev, data.orcamentos, orcRem, FICTITIOUS_IDS.orcamentos, 'id', false);
            saveStorage('vl_orcamentos', merged);
            return merged;
          });
        }

        if (Array.isArray(data.laudos)) {
          setLaudos(prev => {
            const remotosNorm = data.laudos.map((l: Laudo) => normalizarLaudoPadrao(l, clientes));
            const locaisNorm = prev.map(l => normalizarLaudoPadrao(l, clientes));
            const merged = mesclarColecaoPorId(locaisNorm, remotosNorm, lauRem, FICTITIOUS_IDS.laudos, 'id', false);
            saveStorage('vl_laudos', merged);
            return merged;
          });
        }

        if (Array.isArray(data.checklistsCampo)) {
          setChecklistsCampo(prev => {
            const remotosNorm = normalizarChecklistsCampo(data.checklistsCampo);
            const locaisNorm = normalizarChecklistsCampo(prev);
            const merged = normalizarChecklistsCampo(
              mesclarColecaoPorId(locaisNorm, remotosNorm, chkRem, FICTITIOUS_IDS.checklistsCampo, 'id', false)
            );
            saveStorage('vl_checklists_campo', merged);
            return merged;
          });
        }

        if (Array.isArray(data.agenda)) {
          setAgenda(prev => {
            const merged = mesclarColecaoPorId(prev, data.agenda, agRem, FICTITIOUS_IDS.agenda, 'id', false);
            saveStorage('vl_agenda', merged);
            return merged;
          });
        }

        if (Array.isArray(data.usuarios)) {
          setUsuarios(prev => {
            const merged = mesclarColecaoPorId(prev, data.usuarios, usrRem, FICTITIOUS_IDS.usuarios, 'uid', true);
            saveStorage('vl_usuarios', merged);
            return merged;
          });
        }

        isHydratedRef.current = true;
      })
      .catch(err => {
        console.warn('[Sync Servidor] Carregamento em segundo plano:', err);
        isHydratedRef.current = true;
      });
  }, []);

  // Salvamento contínuo em segundo plano no servidor (debounced)
  useEffect(() => {
    if (!isHydratedRef.current) return;

    const timer = setTimeout(() => {
      fetch('/api/app-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientes,
          ativos,
          orcamentos,
          laudos,
          checklistsCampo,
          agenda,
          usuarios,
          clientesRemovidosIds: loadStorage('vl_clientes_removidos_ids', []),
          ativosRemovidosIds: loadStorage('vl_ativos_removidos_ids', []),
          orcamentosRemovidosIds: loadStorage('vl_orcamentos_removidos_ids', []),
          laudosRemovidosIds: loadStorage('vl_laudos_removidos_ids', []),
          checklistsRemovidosIds: loadStorage('vl_checklists_removidos_ids', []),
          agendaRemovidosIds: loadStorage('vl_agenda_removidos_ids', []),
          usuariosRemovidosIds: loadStorage('vl_usuarios_removidos_ids', []),
        })
      }).catch(e => {
        console.warn('[Sync Servidor] Aviso ao persistir dados:', e);
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [clientes, ativos, orcamentos, laudos, checklistsCampo, agenda, usuarios]);

  // Taxonomia de laudos é servida localmente via CATEGORIAS_LAUDOS_TAXONOMIA e localStorage,
  // evitando centenas de gravações automáticas por carregamento que esgotam a cota diária do Firestore.

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
    const cnpjUniforme = dados.cpfCnpj || dados.cnpj || '';
    const novo: Cliente = {
      ...dados,
      id,
      cpfCnpj: cnpjUniforme,
      cnpj: cnpjUniforme,
      criadoEm: new Date().toISOString()
    };
    setClientes(prev => {
      const lista = [novo, ...prev];
      saveStorage('vl_clientes', lista);
      salvarServidorDireto({ clientes: lista });
      return lista;
    });

    if (db && auth?.currentUser && !isFirestoreWriteQuotaBlocked()) {
      setDoc(doc(db, 'clientes', id), novo).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `clientes/${id}`);
      });
    }

    registrarLog('clientes', id, 'criar', `Cliente criado: ${novo.razaoSocial}`);
    return id;
  };

  const atualizarCliente = (id: string, dados: Partial<Cliente>) => {
    const agora = new Date().toISOString();
    const cnpjUniforme = dados.cpfCnpj || dados.cnpj;
    const dadosTratados: Partial<Cliente> = {
      ...dados,
      ...(cnpjUniforme ? { cpfCnpj: cnpjUniforme, cnpj: cnpjUniforme } : {}),
      atualizadoEm: agora,
    };

    setClientes(prev => {
      const atualizados = prev.map(c => {
        if (c.id !== id) return c;
        const cnpjFinal = dadosTratados.cpfCnpj || c.cpfCnpj || c.cnpj || '';
        return {
          ...c,
          ...dadosTratados,
          cpfCnpj: cnpjFinal,
          cnpj: cnpjFinal,
        };
      });
      saveStorage('vl_clientes', atualizados);
      salvarServidorDireto({ clientes: atualizados });
      return atualizados;
    });

    if (db && auth?.currentUser && !isFirestoreWriteQuotaBlocked()) {
      setDoc(doc(db, 'clientes', id), dadosTratados, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `clientes/${id}`);
      });
    }

    // Cascata imediata para Ativos, Orçamentos e Laudos
    const primContato = dados.contatos?.[0];
    const enderecoStr = dados.endereco?.cidade 
      ? `${dados.endereco.logradouro ? dados.endereco.logradouro + ', ' : ''}${dados.endereco.numero ? dados.endereco.numero + ' - ' : ''}${dados.endereco.bairro ? dados.endereco.bairro + ' - ' : ''}${dados.endereco.cidade}/${dados.endereco.estado || 'PE'}`.trim() 
      : undefined;

    setAtivos(prev => {
      const atualizados = prev.map(a => a.clienteId === id ? {
        ...a,
        clienteNome: dados.nomeFantasia || dados.razaoSocial || a.clienteNome,
        atualizadoEm: agora,
      } : a);
      saveStorage('vl_ativos', atualizados);
      salvarServidorDireto({ ativos: atualizados });
      return atualizados;
    });

    setOrcamentos(prev => {
      const atualizados = prev.map(o => {
        if (o.clienteId !== id) return o;
        const cliNome = dados.nomeFantasia || dados.razaoSocial || o.clienteNome || 'Cliente';
        const cnpjCli = cnpjUniforme || o.cnpjCliente || '';
        const repNome = primContato?.nome || o.representanteNome || 'Diretoria / Coordenação Técnica';
        const loc = dados.endereco?.cidade ? `${dados.endereco.cidade}/${dados.endereco.estado || 'PE'}` : o.localidadeServico || 'Recife - PE';

        const novasSecoes = o.secoes?.map(s => {
          if (s.id === 'capa' || s.numero === 1) {
            return {
              ...s,
              conteudoHtml: gerarCardClienteHtml({
                clienteNome: cliNome,
                cnpj: cnpjCli || 'A preencher',
                representante: repNome,
                localidade: loc,
                codigo: o.codigoProposta || o.id,
                validade: o.validadeDias || 15,
                prazo: o.prazoEntrega || `${o.prazoDias || 7} dias úteis`
              })
            };
          }
          return s;
        });

        return {
          ...o,
          clienteNome: cliNome,
          cnpjCliente: cnpjCli,
          representanteNome: repNome,
          representanteCargo: primContato?.cargo || o.representanteCargo,
          telefoneCliente: primContato?.telefone || o.telefoneCliente,
          emailCliente: primContato?.email || o.emailCliente,
          localidadeServico: loc,
          secoes: novasSecoes || o.secoes,
          atualizadoEm: agora,
        };
      });
      saveStorage('vl_orcamentos', atualizados);
      salvarServidorDireto({ orcamentos: atualizados });
      return atualizados;
    });

    setLaudos(prev => {
      const atualizados = prev.map(l => {
        if (l.clienteId !== id) return l;
        return {
          ...l,
          clienteNome: dados.razaoSocial || dados.nomeFantasia || l.clienteNome,
          clienteCnpj: cnpjUniforme || l.clienteCnpj,
          clienteContato: primContato?.nome || l.clienteContato,
          clienteContatoCargo: primContato?.cargo || l.clienteContatoCargo,
          clienteContatoTelefone: primContato?.telefone || l.clienteContatoTelefone,
          clienteContatoEmail: primContato?.email || l.clienteContatoEmail,
          clienteEndereco: enderecoStr || l.clienteEndereco,
          atualizadoEm: agora,
        };
      });
      saveStorage('vl_laudos', atualizados);
      salvarServidorDireto({ laudos: atualizados });
      return atualizados;
    });

    registrarLog('clientes', id, 'editar', `Cliente atualizado: ${dados.razaoSocial || id}`);
  };

  const removerCliente = (id: string) => {
    const novosRemovidos = addTombstone('vl_clientes_removidos_ids', id);
    setClientes(prev => {
      const filtrados = prev.filter(c => c.id !== id);
      saveStorage('vl_clientes', filtrados);
      salvarServidorDireto({ clientes: filtrados, clientesRemovidosIds: novosRemovidos });
      return filtrados;
    });

    if (db && auth?.currentUser && !isFirestoreWriteQuotaBlocked()) {
      deleteDoc(doc(db, 'clientes', id)).catch(err => {
        handleFirestoreError(err, OperationType.DELETE, `clientes/${id}`);
      });
    }

    registrarLog('clientes', id, 'excluir', `Cliente removido: ${id}`);
  };

  // Ativos
  const adicionarAtivo = (dados: Omit<Ativo, 'id' | 'criadoEm' | 'historico'>): string => {
    const id = `atv-${Date.now()}`;
    const cliente = clientes.find(c => c.id === dados.clienteId);
    const agora = new Date().toISOString();
    const novo: Ativo = {
      ...dados,
      id,
      clienteNome: cliente?.razaoSocial || dados.clienteNome,
      historico: [],
      criadoEm: agora,
      atualizadoEm: agora,
    };
    setAtivos(prev => {
      const lista = [novo, ...prev];
      saveStorage('vl_ativos', lista);
      salvarServidorDireto({ ativos: lista });
      return lista;
    });

    if (db && auth?.currentUser && !isFirestoreWriteQuotaBlocked()) {
      setDoc(doc(db, 'ativos', id), novo).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `ativos/${id}`);
      });
    }

    registrarLog('ativos', id, 'criar', `Ativo criado: ${novo.identificacao} (${novo.tipo})`);
    return id;
  };

  const atualizarAtivo = (id: string, dados: Partial<Ativo>) => {
    const agora = new Date().toISOString();
    const clienteRel = dados.clienteId ? clientes.find(c => c.id === dados.clienteId) : undefined;
    const dadosAtualizados: Partial<Ativo> = {
      ...dados,
      ...(clienteRel ? { clienteNome: clienteRel.nomeFantasia || clienteRel.razaoSocial } : {}),
      atualizadoEm: agora,
    };

    setAtivos(prev => {
      const atualizados = prev.map(a => a.id === id ? { ...a, ...dadosAtualizados } : a);
      saveStorage('vl_ativos', atualizados);
      salvarServidorDireto({ ativos: atualizados });
      return atualizados;
    });

    if (db && auth?.currentUser && !isFirestoreWriteQuotaBlocked()) {
      setDoc(doc(db, 'ativos', id), dadosAtualizados, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `ativos/${id}`);
      });
    }

    registrarLog('ativos', id, 'editar', `Ativo atualizado: ${dados.identificacao || id}`);
  };

  const removerAtivo = (id: string) => {
    const novosRemovidos = addTombstone('vl_ativos_removidos_ids', id);
    setAtivos(prev => {
      const filtrados = prev.filter(a => a.id !== id);
      saveStorage('vl_ativos', filtrados);
      salvarServidorDireto({ ativos: filtrados, ativosRemovidosIds: novosRemovidos });
      return filtrados;
    });

    if (db && auth?.currentUser && !isFirestoreWriteQuotaBlocked()) {
      deleteDoc(doc(db, 'ativos', id)).catch(err => {
        handleFirestoreError(err, OperationType.DELETE, `ativos/${id}`);
      });
    }

    registrarLog('ativos', id, 'excluir', `Ativo removido: ${id}`);
  };

  // Orçamentos
  const adicionarOrcamento = (dados: Omit<Orcamento, 'id' | 'criadoEm'>): string => {
    const id = `orc-${Date.now()}`;
    const cliente = clientes.find(c => c.id === dados.clienteId);
    const ano = new Date().getFullYear();
    const codigoProposta = dados.codigoProposta || `PROP-${ano}/${String(orcamentos.length + 1).padStart(3, '0')}`;
    const primeiroContato = cliente?.contatos?.[0];
    
    let novo: Orcamento = {
      ...dados,
      id,
      codigoProposta,
      clienteNome: dados.clienteNome || cliente?.nomeFantasia || cliente?.razaoSocial || 'Cliente Contratante',
      cnpjCliente: dados.cnpjCliente || cliente?.cpfCnpj || cliente?.cnpj || '',
      representanteNome: dados.representanteNome || primeiroContato?.nome || 'Diretoria / Coordenação Técnica',
      representanteCargo: dados.representanteCargo || primeiroContato?.cargo || '',
      telefoneCliente: dados.telefoneCliente || primeiroContato?.telefone || '(81) 98444-2592',
      emailCliente: dados.emailCliente || primeiroContato?.email || '',
      localidadeServico: dados.localidadeServico || (cliente?.endereco?.cidade ? `${cliente.endereco.cidade}/${cliente.endereco.estado || 'PE'}` : 'Recife e Região Metropolitana - PE'),
      criadoEm: new Date().toISOString(),
    };

    if (!novo.secoes || novo.secoes.length === 0) {
      novo.secoes = gerarSecoesPadraoOrcamento(novo, { cliente });
    }

    setOrcamentos(prev => {
      const lista = [novo, ...prev];
      saveStorage('vl_orcamentos', lista);
      salvarServidorDireto({ orcamentos: lista });
      return lista;
    });

    if (db && auth?.currentUser && !isFirestoreWriteQuotaBlocked()) {
      setDoc(doc(db, 'orcamentos', id), novo).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `orcamentos/${id}`);
      });
    }

    registrarLog('orcamentos', id, 'criar', `Orçamento criado: R$ ${novo.valor} (${novo.servico})`);
    return id;
  };

  const atualizarOrcamento = (id: string, dados: Partial<Orcamento>) => {
    const agora = new Date().toISOString();
    const dadosComTimestamp: Partial<Orcamento> = { ...dados, atualizadoEm: agora };

    setOrcamentos(prev => {
      const atualizados = prev.map(o => o.id === id ? { ...o, ...dadosComTimestamp } : o);
      saveStorage('vl_orcamentos', atualizados);
      salvarServidorDireto({ orcamentos: atualizados });
      return atualizados;
    });
    registrarLog('orcamentos', id, 'editar', `Orçamento/Proposta atualizada: ${dados.servico || id}`);
    if (db && auth?.currentUser && !isFirestoreWriteQuotaBlocked()) {
      const firestorePayload: Record<string, any> = {};
      Object.entries(dadosComTimestamp).forEach(([k, v]) => {
        if (v !== undefined) {
          firestorePayload[k] = v;
        }
      });
      setDoc(doc(db, 'orcamentos', id), firestorePayload, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `orcamentos/${id}`);
      });
    }
  };

  const atualizarStatusOrcamento = (
    id: string,
    status: Orcamento['status'],
    extras?: FaturamentoDadosExtras
  ) => {
    const agora = new Date().toISOString();
    const existente = orcamentos.find(o => o.id === id);
    const localPatch: Partial<Orcamento> = { status, atualizadoEm: agora };
    const firestorePatch: Record<string, any> = { status, atualizadoEm: agora };

    if (status === 'aprovado' && !existente?.aprovadoEm) {
      localPatch.aprovadoEm = agora;
      firestorePatch.aprovadoEm = agora;
    }

    if (status === 'faturado') {
      const dataFaturamento = extras?.faturadoEm?.trim() || existente?.faturadoEm || getHojeLocalYmd();
      localPatch.faturadoEm = dataFaturamento;
      firestorePatch.faturadoEm = dataFaturamento;

      const aplicarCampoOpcional = (
        chave: keyof FaturamentoDadosExtras & keyof Orcamento,
        valor: string | null | undefined
      ) => {
        if (valor === undefined) return;
        const limpo = typeof valor === 'string' ? valor.trim() : valor;
        if (limpo) {
          (localPatch as any)[chave] = limpo;
          firestorePatch[chave] = limpo;
        } else {
          (localPatch as any)[chave] = null;
          firestorePatch[chave] = deleteField();
        }
      };

      if (extras) {
        aplicarCampoOpcional('dataInicioServico', extras.dataInicioServico);
        aplicarCampoOpcional('dataEntregaServico', extras.dataEntregaServico);
        aplicarCampoOpcional('comprovantePagamentoUrl', extras.comprovantePagamentoUrl);
        aplicarCampoOpcional('comprovantePagamentoNome', extras.comprovantePagamentoNome);
        aplicarCampoOpcional('comprovantePagamentoTipo', extras.comprovantePagamentoTipo);
      }
    }

    setOrcamentos(prev => {
      const atualizados = prev.map(o => o.id === id ? { ...o, ...localPatch } : o);
      saveStorage('vl_orcamentos', atualizados);
      salvarServidorDireto({ orcamentos: atualizados });
      return atualizados;
    });

    if (db && auth?.currentUser && !isFirestoreWriteQuotaBlocked()) {
      setDoc(doc(db, 'orcamentos', id), firestorePatch, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `orcamentos/${id}`);
      });
    }

    registrarLog('orcamentos', id, 'editar', `Status do orçamento alterado para: ${status}`);
  };

  const removerOrcamento = (id: string) => {
    // 1. Armazena imediatamente nos IDs removidos
    let novosRemovidos: string[] = [];
    try {
      const removidos: string[] = loadStorage('vl_orcamentos_removidos_ids', []);
      novosRemovidos = Array.from(new Set([...removidos, id]));
      saveStorage('vl_orcamentos_removidos_ids', novosRemovidos);
    } catch (e) {
      console.warn('Erro ao salvar ID de orçamento removido:', e);
    }

    // 2. Filtra localmente e envia para persistência do servidor
    setOrcamentos(prev => {
      const filtrados = prev.filter(o => o.id !== id);
      saveStorage('vl_orcamentos', filtrados);
      salvarServidorDireto({ 
        orcamentos: filtrados,
        orcamentosRemovidosIds: novosRemovidos 
      });
      return filtrados;
    });

    // 3. Notifica servidor express para remoção atômica no arquivo de storage
    fetch(`/api/orcamentos/${id}`, { method: 'DELETE' }).catch(err => {
      console.warn('Aviso ao deletar orçamento na API express:', err);
    });

    // 4. Desvincula qualquer laudo que referencie este orçamento
    setLaudos(prev => {
      const atualizados = prev.map(l => {
        if (l.orcamentoOrigemId === id) {
          const lCopy = { ...l };
          delete lCopy.orcamentoOrigemId;
          delete lCopy.orcamentoNumero;
          return lCopy;
        }
        return l;
      });
      saveStorage('vl_laudos', atualizados);
      return atualizados;
    });

    // 5. Deleta do Firestore se disponível
    if (db && auth?.currentUser && !isFirestoreWriteQuotaBlocked()) {
      deleteDoc(doc(db, 'orcamentos', id)).catch(err => {
        handleFirestoreError(err, OperationType.DELETE, `orcamentos/${id}`);
      });
    }

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

    const enderecoFormatado = orc.localidadeServico || (cliente?.endereco?.cidade 
      ? `${cliente.endereco.logradouro ? cliente.endereco.logradouro + ', ' : ''}${cliente.endereco.numero ? cliente.endereco.numero + ' - ' : ''}${cliente.endereco.bairro ? cliente.endereco.bairro + ' - ' : ''}${cliente.endereco.cidade}/${cliente.endereco.estado || 'PE'}`.trim()
      : '');

    const novoLaudo: Laudo = {
      id: novoLaudoId,
      numero,
      tipo: orc.servico,
      clienteId: orc.clienteId,
      clienteNome: cliente?.razaoSocial || cliente?.nomeFantasia || orc.clienteNome || 'Cliente',
      clienteCnpj: orc.cnpjCliente || cliente?.cpfCnpj || cliente?.cnpj || '',
      clienteContato: orc.representanteNome || cliente?.contatos?.[0]?.nome || '',
      clienteContatoCargo: orc.representanteCargo || cliente?.contatos?.[0]?.cargo || '',
      clienteContatoTelefone: orc.telefoneCliente || cliente?.contatos?.[0]?.telefone || '',
      clienteContatoEmail: orc.emailCliente || cliente?.contatos?.[0]?.email || '',
      clienteEndereco: enderecoFormatado,
      ativoId: ativo?.id || '',
      ativoIdentificacao: ativo?.identificacao || orc.ativoIdentificacao || 'Ativo a definir',
      status: 'rascunho',
      artNumero: '',
      dataInspecao: new Date().toISOString().slice(0, 10),
      responsavelNome: 'Eng. Vitor Leonardo Cordeiro Linhares',
      responsavelCrea: 'CREA-PE 182229949-0',
      resumoExecutivo: `Laudo técnico originado a partir do Orçamento Comercial #${orc.id}. ${orc.descricaoEscopo || ''}`,
      secoes: secoesPadrao,
      usoIA: { chamadas: 0 },
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };

    setLaudos(prev => {
      const lista = [novoLaudo, ...prev];
      saveStorage('vl_laudos', lista);
      salvarServidorDireto({ laudos: lista });
      return lista;
    });

    const patchOrc = {
      status: 'aprovado' as const,
      laudoGeradoId: novoLaudoId,
      laudoGeradoNumero: numero,
      atualizadoEm: new Date().toISOString(),
    };

    // Link budget to report
    setOrcamentos(prev => {
      const lista = prev.map(o => o.id === orcamentoId ? { ...o, ...patchOrc } : o);
      saveStorage('vl_orcamentos', lista);
      salvarServidorDireto({ orcamentos: lista });
      return lista;
    });

    if (db && auth?.currentUser && !isFirestoreWriteQuotaBlocked()) {
      setDoc(doc(db, 'laudos', novoLaudoId), novoLaudo).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `laudos/${novoLaudoId}`);
      });
      setDoc(doc(db, 'orcamentos', orcamentoId), patchOrc, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `orcamentos/${orcamentoId}`);
      });
    }

    registrarLog('laudos', novoLaudoId, 'criar', `Laudo ${numero} gerado a partir do orçamento ${orcamentoId}`);
    return novoLaudoId;
  };

  // Associar ou Desassociar Orçamento ao Laudo
  const associarOrcamentoAoLaudo = (orcamentoId: string, laudoId: string | null) => {
    let proximaListaOrcamentos: Orcamento[] = [];
    let proximaListaLaudos: Laudo[] = [];
    const laudoVinculado = laudoId ? laudos.find(l => l.id === laudoId) : null;
    const orcAtual = orcamentos.find(o => o.id === orcamentoId);
    const orcNumero = orcAtual?.codigoProposta || orcAtual?.id || orcamentoId;

    // 1. Atualizar Orçamentos
    setOrcamentos(prev => {
      const atualizados = prev.map(o => {
        if (o.id === orcamentoId) {
          return { 
            ...o, 
            laudoGeradoId: laudoId || undefined,
            laudoGeradoNumero: laudoVinculado?.numero || undefined,
            status: laudoId ? (o.status === 'faturado' ? 'faturado' : 'aprovado') : o.status
          };
        }
        // Se outro orçamento apontava para este mesmo laudo, remove vínculo antigo
        if (laudoId && o.laudoGeradoId === laudoId && o.id !== orcamentoId) {
          return { ...o, laudoGeradoId: undefined, laudoGeradoNumero: undefined };
        }
        return o;
      });
      proximaListaOrcamentos = atualizados;
      saveStorage('vl_orcamentos', atualizados);
      return atualizados;
    });

    // 2. Atualizar Laudos
    setLaudos(prev => {
      const atualizados = prev.map(l => {
        if (laudoId && l.id === laudoId) {
          return {
            ...l,
            orcamentoOrigemId: orcamentoId,
            orcamentoNumero: orcNumero,
            atualizadoEm: new Date().toISOString(),
          };
        }
        if (!laudoId && l.orcamentoOrigemId === orcamentoId) {
          const lCopy = { ...l };
          delete lCopy.orcamentoOrigemId;
          delete lCopy.orcamentoNumero;
          return {
            ...lCopy,
            atualizadoEm: new Date().toISOString(),
          };
        }
        return l;
      });
      proximaListaLaudos = atualizados;
      saveStorage('vl_laudos', atualizados);
      return atualizados;
    });

    // 3. Salvar imediatamente no servidor Express (/api/app-data)
    salvarServidorDireto({
      orcamentos: proximaListaOrcamentos.length ? proximaListaOrcamentos : undefined,
      laudos: proximaListaLaudos.length ? proximaListaLaudos : undefined,
    });

    // 4. Salvar no Firestore se houver usuário conectado
    if (db && auth?.currentUser && !isFirestoreWriteQuotaBlocked()) {
      if (orcamentoId) {
        setDoc(doc(db, 'orcamentos', orcamentoId), {
          laudoGeradoId: laudoId || null,
          laudoGeradoNumero: laudoVinculado?.numero || null,
          ...(laudoId && orcAtual?.status !== 'faturado' ? { status: 'aprovado' } : {})
        }, { merge: true }).catch(err => {
          handleFirestoreError(err, OperationType.UPDATE, `orcamentos/${orcamentoId}`);
        });
      }

      if (laudoId) {
        setDoc(doc(db, 'laudos', laudoId), {
          orcamentoOrigemId: orcamentoId,
          orcamentoNumero: orcNumero,
          atualizadoEm: new Date().toISOString()
        }, { merge: true }).catch(err => {
          handleFirestoreError(err, OperationType.UPDATE, `laudos/${laudoId}`);
        });
      }
    }

    registrarLog('orcamentos', orcamentoId, 'editar', 
      laudoId ? `Orçamento ${orcNumero} associado ao laudo ${laudoVinculado?.numero || laudoId}` : `Desvinculado laudo do orçamento ${orcNumero}`
    );
  };

  // Agenda
  const adicionarVistoria = (dados: Omit<AgendaVistoria, 'id' | 'criadoEm'>): string => {
    const id = `ag-${Date.now()}`;
    const agora = new Date().toISOString();
    const novo: AgendaVistoria = { ...dados, id, criadoEm: agora };
    setAgenda(prev => {
      const lista = [novo, ...prev];
      saveStorage('vl_agenda', lista);
      salvarServidorDireto({ agenda: lista });
      return lista;
    });
    if (db && auth?.currentUser && !isFirestoreWriteQuotaBlocked()) {
      setDoc(doc(db, 'agendaVistorias', id), novo).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `agendaVistorias/${id}`);
      });
    }
    registrarLog('agendaVistorias', id, 'criar', `Vistoria agendada para ${dados.dataHora}`);
    return id;
  };

  const atualizarStatusVistoria = (id: string, status: AgendaVistoria['status']) => {
    setAgenda(prev => {
      const lista = prev.map(a => a.id === id ? { ...a, status } : a);
      saveStorage('vl_agenda', lista);
      salvarServidorDireto({ agenda: lista });
      return lista;
    });
    if (db && auth?.currentUser && !isFirestoreWriteQuotaBlocked()) {
      setDoc(doc(db, 'agendaVistorias', id), { status }, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `agendaVistorias/${id}`);
      });
    }
    registrarLog('agendaVistorias', id, 'editar', `Vistoria ${id} marcada como: ${status}`);
  };

  const removerVistoria = (id: string) => {
    const novosRemovidos = addTombstone('vl_agenda_removidos_ids', id);
    setAgenda(prev => {
      const filtrados = prev.filter(a => a.id !== id);
      saveStorage('vl_agenda', filtrados);
      salvarServidorDireto({ agenda: filtrados, agendaRemovidosIds: novosRemovidos });
      return filtrados;
    });
    if (db && auth?.currentUser && !isFirestoreWriteQuotaBlocked()) {
      deleteDoc(doc(db, 'agendaVistorias', id)).catch(err => {
        handleFirestoreError(err, OperationType.DELETE, `agendaVistorias/${id}`);
      });
    }
    registrarLog('agendaVistorias', id, 'excluir', `Vistoria removida: ${id}`);
  };

  // Laudos
  const criarLaudoPorTaxonomia = ({
    tipoLaudoId,
    clienteId,
    ativoId,
    artNumero = '',
    dataInspecao = new Date().toISOString().slice(0, 10),
    modoPreenchimento = 'em_branco',
  }: {
    tipoLaudoId: string;
    clienteId: string;
    ativoId: string;
    artNumero?: string;
    dataInspecao?: string;
    modoPreenchimento?: 'em_branco' | 'sugestao_ia';
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
    const ehModoIA = modoPreenchimento === 'sugestao_ia';

    const enderecoTaxonomia = cliente?.endereco?.cidade 
      ? `${cliente.endereco.logradouro ? cliente.endereco.logradouro + ', ' : ''}${cliente.endereco.numero ? cliente.endereco.numero + ' - ' : ''}${cliente.endereco.bairro ? cliente.endereco.bairro + ' - ' : ''}${cliente.endereco.cidade}/${cliente.endereco.estado || 'PE'}`.trim()
      : '';

    const novo: Laudo = {
      id,
      numero,
      tipo: tipoEncontrado?.nome || 'Laudo Técnico Pericial',
      tipoLaudoId,
      categoriaId: categoriaEncontradaId,
      subcategoriaId: subcategoriaEncontradaId,
      clienteId,
      clienteNome: cliente?.razaoSocial || cliente?.nomeFantasia || 'Cliente Corporativo',
      clienteCnpj: cliente?.cpfCnpj || cliente?.cnpj || '',
      clienteContato: cliente?.contatos?.[0]?.nome || '',
      clienteContatoCargo: cliente?.contatos?.[0]?.cargo || '',
      clienteContatoTelefone: cliente?.contatos?.[0]?.telefone || '',
      clienteContatoEmail: cliente?.contatos?.[0]?.email || '',
      clienteEndereco: enderecoTaxonomia,
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
      checklist: (tipoEncontrado?.checklistPadrao && tipoEncontrado.checklistPadrao.length > 0)
        ? tipoEncontrado.checklistPadrao.map(item => ({
            ...item,
            status: ehModoIA ? item.status : ('pendente' as const),
            observacao: ehModoIA ? item.observacao : ''
          }))
        : (tipoEncontrado?.checklistInicial || []).map((itemDef, idx) => {
            const descricao = typeof itemDef === 'string' 
              ? itemDef 
              : (itemDef.campo || itemDef.item || '');
            let status: 'conforme' | 'nao_conforme' | 'nao_aplicavel' | 'pendente' = 'pendente';
            let observacao = '';

            if (ehModoIA) {
              if (typeof itemDef === 'object' && itemDef.statusSugeridoIA) {
                const st = itemDef.statusSugeridoIA;
                if (st === 'Conforme') status = 'conforme';
                else if (st === 'Não Conforme') status = 'nao_conforme';
                else if (st === 'Não Aplicável') status = 'nao_aplicavel';
                else status = 'pendente';

                observacao = itemDef.observacaoSugeridaIA || (status === 'conforme' ? 'Conforme requisitos técnicos verificados' : 'Pendente de verificação em campo');
              } else {
                const precisaTestePresencial = /medi[çc][ãa]o|ensaio|teste|ultrassom|calibra[çc][ãa]o|press[ãa]o|carga|desgaste|hrn|aprecia[çc][ãa]o/i.test(descricao);
                status = precisaTestePresencial ? 'pendente' : 'conforme';
                observacao = precisaTestePresencial 
                  ? 'Pendente de verificação e medição in loco durante a vistoria' 
                  : 'Conforme verificação documental e identificação física';
              }
            } else {
              status = 'pendente';
              observacao = '';
            }

            return {
              id: `ck-${idx + 1}`,
              descricao,
              campo: typeof itemDef === 'object' ? itemDef.campo : undefined,
              tipoResposta: typeof itemDef === 'object' ? itemDef.tipoResposta : undefined,
              unidade: typeof itemDef === 'object' ? itemDef.unidade : undefined,
              opcoes: typeof itemDef === 'object' ? itemDef.opcoes : undefined,
              criterioReferencia: typeof itemDef === 'object' ? itemDef.criterioReferencia : undefined,
              obrigatorioFoto: typeof itemDef === 'object' ? itemDef.obrigatorioFoto : undefined,
              exigeFotoSeNaoConforme: typeof itemDef === 'object' ? itemDef.exigeFotoSeNaoConforme : undefined,
              status,
              observacao
            };
          }),
      tabelaNaoConformidades: [],
      conclusao: (tipoLaudoId === 'laudo-pericia-causa-raiz-automotiva' || prefixo === 'VEIC-CAUSA-RAIZ') && ehModoIA
        ? 'Avaria provocada por dessincronismo decorrente de ruptura por fadiga da correia sincronizadora. Afastada responsabilidade da oficina por decurso de prazo legal do CDC (Art. 26, II - prazo decadencial de 90 dias superado).'
        : (ehModoIA 
          ? 'Com base nas avaliações e ensaios técnicos preliminares realizados, sugere-se a verificação final dos pontos assinalados como pendentes antes da homologação conclusiva das operações.'
          : ''),
      resumoExecutivo: (tipoLaudoId === 'laudo-pericia-causa-raiz-automotiva' || prefixo === 'VEIC-CAUSA-RAIZ') && ehModoIA
        ? `Laudo pericial de causa raiz do veículo ${ativo?.identificacao || 'periciado'}. Constatada ruptura de correia dentada por fadiga de material. Nexo causal com serviços anteriores afastado por tempo e quilometragem decorridos.`
        : undefined,
      secoes: ((tipoLaudoId === 'laudo-pericia-causa-raiz-automotiva' || prefixo === 'VEIC-CAUSA-RAIZ') && ehModoIA)
        ? gerarLaudoCausaRaizOffline({
            ativo: {
              marca: ativo?.marca || '',
              modelo: ativo?.modelo || '',
              anoModelo: ativo?.anoFabricacao ? `${ativo.anoFabricacao}/${ativo.anoFabricacao}` : '',
              placa: ativo?.placa || '',
              renavam: ativo?.renavam || '',
              chassi: ativo?.chassi || '',
              kmAtual: ativo?.horimetroOuKm || 0,
              kmIntervencaoPrevia: 0
            },
            contexto: {
              dataPane: dataInspecao,
              dataIntervencaoPrevia: '',
              historicoManutencao: 'Substituição preventiva do conjunto de correias e tensores do motor em oficina mecânica terceirizada credenciada',
              oficinaTerceirizada: 'Oficina Mecânica Terceirizada',
              restricaoConfidencialidade: true,
              kmIntervalo: 0
            },
            evidencias: {
              descricaoAvarias: 'Ruptura catastrófica da correia dentada sincronizadora com cisalhamento de dentes por fadiga de material. Empenamento severo de válvulas por interferência com pistões.',
              componentesAvariados: [
                'Correia Dentada de Sincronismo',
                'Válvulas de Admissão e Escape',
                'Cabeçote do Motor (Mancais e Sedes)',
                'Pistões do Motor',
                'Tensor da Correia e Rolamentos Guias',
                'Bloco do Motor e Bielas'
              ]
            },
            escopo: {
              determinarCausaRaiz: true,
              analisarNexoCausal: true,
              verificarGarantiaCDC: true,
              avaliarMauUso: true
            },
            clienteNome: cliente?.razaoSocial,
            clienteCnpj: cliente?.cnpj,
            laudoNumero: numero,
            artNumero,
            dataEmissao: dataInspecao
          }).secoes.map((s, idx) => ({
            id: `sec-${idx + 1}`,
            titulo: s.titulo,
            ordem: s.ordem || idx + 1,
            tipo: idx === 0 ? 'capa' : idx === 1 ? 'apresentacao' : idx === 12 ? 'art_assinatura' : 'corpo_tecnico',
            conteudoHtml: s.conteudoHtml,
            itens: [],
            fotos: []
          }))
        : (tipoEncontrado?.secoesPadrao && tipoEncontrado.secoesPadrao.length > 0)
        ? tipoEncontrado.secoesPadrao.map(s => ({
            id: s.id,
            titulo: s.titulo,
            ordem: s.ordem,
            conteudoHtml: ehModoIA 
              ? (s.conteudoHtml || gerarMinutaTecnicaSecao(s.titulo, tipoEncontrado, { clienteNome: cliente?.razaoSocial, ativoIdentificacao: ativo?.identificacao }))
              : '',
            itens: [],
            fotos: []
          }))
        : (tipoEncontrado?.secoesEspecificas || []).map((sec, idx) => {
            const titulo = typeof sec === 'string' ? sec : sec.titulo;
            const conteudoSugerido = typeof sec === 'object' && sec.conteudoSugeridoIA ? sec.conteudoSugeridoIA : '';
            let conteudoHtml = '';
            if (ehModoIA) {
              if (conteudoSugerido) {
                conteudoHtml = `<p class="leading-relaxed">${conteudoSugerido.replace(/\n\n/g, '</p><p class="leading-relaxed mt-3">').replace(/\n/g, '<br/>')}</p>`;
              } else {
                conteudoHtml = gerarMinutaTecnicaSecao(titulo, tipoEncontrado, { clienteNome: cliente?.razaoSocial, ativoIdentificacao: ativo?.identificacao });
              }
            }
            return {
              id: `sec-${idx + 1}`,
              titulo,
              ordem: idx + 1,
              conteudoHtml,
              itens: [],
              fotos: []
            };
          }),
      assinaturaDigital: {
        responsavelNome: 'Eng. Vitor Leonardo Cordeiro Linhares',
        responsavelCrea: 'CREA-PE 182229949-0',
        dataHora: new Date().toISOString(),
        hashAutenticidade: `AUT-VL-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
      },
      usoIA: { chamadas: ehModoIA ? 1 : 0 },
      iniciadoComIA: ehModoIA,
      modoCriacao: modoPreenchimento,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };

    setLaudos(prev => {
      const lista = [novo, ...prev];
      saveStorage('vl_laudos', lista);
      salvarServidorDireto({ laudos: lista });
      return lista;
    });
    if (db && auth?.currentUser && !isFirestoreWriteQuotaBlocked()) {
      setDoc(doc(db, 'laudos', id), novo).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `laudos/${id}`);
      });
    }
    registrarLog('laudos', id, 'criar', `Novo laudo técnico criado via taxonomia: ${numero} (${tipoEncontrado?.nome})`);
    return id;
  };

  const criarNovoLaudo = (dados: Partial<Laudo> & { tipo: string; clienteId: string; ativoId: string }): string => {
    const id = dados.id || `lau-${Date.now()}`;
    const numero = dados.numero || gerarNumeroLaudo();
    const cliente = clientes.find(c => c.id === dados.clienteId);
    const ativo = ativos.find(a => a.id === dados.ativoId);

    const enderecoFormatado = dados.clienteEndereco || (cliente?.endereco?.cidade 
      ? `${cliente.endereco.logradouro ? cliente.endereco.logradouro + ', ' : ''}${cliente.endereco.numero ? cliente.endereco.numero + ' - ' : ''}${cliente.endereco.bairro ? cliente.endereco.bairro + ' - ' : ''}${cliente.endereco.cidade}/${cliente.endereco.estado || 'PE'}`.trim()
      : '');

    const agora = new Date().toISOString();
    const novo: Laudo = {
      ...dados,
      id,
      numero,
      tipo: dados.tipo,
      clienteId: dados.clienteId,
      clienteNome: dados.clienteNome || cliente?.razaoSocial || cliente?.nomeFantasia || 'Cliente',
      clienteCnpj: dados.clienteCnpj || cliente?.cpfCnpj || cliente?.cnpj || '',
      clienteContato: dados.clienteContato || cliente?.contatos?.[0]?.nome || '',
      clienteContatoCargo: dados.clienteContatoCargo || cliente?.contatos?.[0]?.cargo || '',
      clienteContatoTelefone: dados.clienteContatoTelefone || cliente?.contatos?.[0]?.telefone || '',
      clienteContatoEmail: dados.clienteContatoEmail || cliente?.contatos?.[0]?.email || '',
      clienteEndereco: enderecoFormatado,
      ativoId: dados.ativoId,
      ativoIdentificacao: dados.ativoIdentificacao || ativo?.identificacao || 'Equipamento',
      ativoFabricante: dados.ativoFabricante || ativo?.fabricante,
      ativoModelo: dados.ativoModelo || ativo?.modelo,
      ativoNumeroSerie: dados.ativoNumeroSerie || ativo?.numeroSerie || ativo?.chassi,
      ativoCapacidade: dados.ativoCapacidade || ativo?.capacidade,
      status: dados.status || 'rascunho',
      artNumero: dados.artNumero || '',
      dataInspecao: dados.dataInspecao || agora.slice(0, 10),
      responsavelNome: dados.responsavelNome || 'Eng. Vitor Leonardo Cordeiro Linhares',
      responsavelCrea: dados.responsavelCrea || 'CREA-PE 182229949-0',
      resumoExecutivo: dados.resumoExecutivo || `Inspeção e apreciação técnica de ${dados.tipo}.`,
      normasReferencia: dados.normasReferencia || 'ABNT NBR / Normas Regulamentadoras',
      apresentacao: dados.apresentacao || 'O presente laudo técnico pericial tem por finalidade aferir a conformidade estrutural e operacional do equipamento.',
      metodologia: dados.metodologia || 'A metodologia adotou inspeção in loco e verificação contra normas técnicas da ABNT e Ministério do Trabalho.',
      checklist: dados.checklist || [],
      tabelaNaoConformidades: dados.tabelaNaoConformidades || [],
      conclusao: dados.conclusao || 'O equipamento cumpre as exigências fundamentais das normas de segurança vigentes.',
      secoes: dados.secoes || [],
      usoIA: dados.usoIA || { chamadas: 0 },
      criadoEm: dados.criadoEm || agora,
      atualizadoEm: agora,
    };

    setLaudos(prev => {
      const lista = [novo, ...prev.filter(l => l.id !== id)];
      saveStorage('vl_laudos', lista);
      salvarServidorDireto({ laudos: lista });
      return lista;
    });
    if (db && auth?.currentUser && !isFirestoreWriteQuotaBlocked()) {
      setDoc(doc(db, 'laudos', id), novo).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `laudos/${id}`);
      });
    }
    registrarLog('laudos', id, 'criar', `Novo laudo técnico criado: ${numero}`);
    return id;
  };

  const atualizarLaudo = (id: string, dados: Partial<Laudo>) => {
    const agora = new Date().toISOString();
    const patch = { ...dados, atualizadoEm: agora };
    setLaudos(prev => {
      const atualizados = prev.map(l => l.id === id ? { ...l, ...patch } : l);
      saveStorage('vl_laudos', atualizados);
      salvarServidorDireto({ laudos: atualizados });
      return atualizados;
    });
    if (db && auth?.currentUser && !isFirestoreWriteQuotaBlocked()) {
      setDoc(doc(db, 'laudos', id), patch, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `laudos/${id}`);
      });
    }
    registrarLog('laudos', id, 'editar', `Laudo atualizado: ${dados.numero || id}`);
  };

  const finalizarLaudo = (id: string, artNumero: string, assinaturaUrl?: string) => {
    const agora = new Date().toISOString();
    let ativoParaAtualizar: { ativoId: string; historicoItem: any } | null = null;

    setLaudos(prev => {
      const atualizados = prev.map(l => {
        if (l.id === id) {
          const atualizado: Laudo = {
            ...l,
            status: 'finalizado',
            artNumero,
            assinaturaUrl: assinaturaUrl || l.assinaturaUrl,
            atualizadoEm: agora,
          };

          if (l.ativoId) {
            const naoConf = (l.secoes || []).reduce((acc, sec) =>
              acc + (sec.itens || []).filter(it => it.status === 'nao_conforme').length, 0);
            ativoParaAtualizar = {
              ativoId: l.ativoId,
              historicoItem: {
                laudoId: l.id,
                numeroLaudo: l.numero,
                data: l.dataInspecao,
                tipo: l.tipo,
                status: 'finalizado' as const,
                resultado: naoConf === 0 ? 'Aprovado' as const : 'Aprovado com Restrições' as const,
                hrnNivel: l.hrnCalculoGeral?.nivel || 'Baixo',
                totalNaoConformidades: naoConf,
              },
            };
          }

          return atualizado;
        }
        return l;
      });
      saveStorage('vl_laudos', atualizados);
      salvarServidorDireto({ laudos: atualizados });
      return atualizados;
    });

    if (ativoParaAtualizar) {
      const { ativoId: alvoId, historicoItem } = ativoParaAtualizar;
      setAtivos(atvList => {
        const atualizados = atvList.map(a => a.id === alvoId ? {
          ...a,
          historico: [historicoItem, ...(a.historico || [])],
          atualizadoEm: agora,
        } : a);
        saveStorage('vl_ativos', atualizados);
        salvarServidorDireto({ ativos: atualizados });
        return atualizados;
      });
    }

    if (db && auth?.currentUser && !isFirestoreWriteQuotaBlocked()) {
      setDoc(doc(db, 'laudos', id), {
        status: 'finalizado',
        artNumero,
        ...(assinaturaUrl ? { assinaturaUrl } : {}),
        atualizadoEm: agora,
      }, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `laudos/${id}`);
      });
    }

    registrarLog('laudos', id, 'finalizar', `Laudo concluído com sucesso e ART vinculada: ${artNumero}`);
  };

  const removerLaudo = (id: string) => {
    const novosRemovidos = addTombstone('vl_laudos_removidos_ids', id);

    setLaudos(prev => {
      const filtrados = prev.filter(l => l.id !== id);
      saveStorage('vl_laudos', filtrados);
      salvarServidorDireto({ laudos: filtrados, laudosRemovidosIds: novosRemovidos });
      return filtrados;
    });

    // Desvincula de qualquer orçamento que aponte para este laudo gerado
    setOrcamentos(prev => {
      const atualizados = prev.map(o => {
        if (o.laudoGeradoId === id) {
          return {
            ...o,
            laudoGeradoId: undefined,
            laudoGeradoNumero: undefined,
          };
        }
        return o;
      });
      saveStorage('vl_orcamentos', atualizados);
      salvarServidorDireto({ orcamentos: atualizados });
      return atualizados;
    });

    if (db && auth?.currentUser && !isFirestoreWriteQuotaBlocked()) {
      deleteDoc(doc(db, 'laudos', id)).catch(err => {
        handleFirestoreError(err, OperationType.DELETE, `laudos/${id}`);
      });
    }

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
  const atualizarUsuario = (uid: string, dados: Partial<Usuario>) => {
    setUsuarios(prev => {
      const atualizados = prev.map(u => u.uid === uid ? { ...u, ...dados } : u);
      saveStorage('vl_usuarios', atualizados);
      salvarServidorDireto({ usuarios: atualizados });
      return atualizados;
    });
    if (db && auth?.currentUser && !isFirestoreWriteQuotaBlocked()) {
      setDoc(doc(db, 'usuarios', uid), dados, { merge: true }).catch(err => {
        console.warn('[Firestore] Erro ao atualizar usuário:', err);
      });
    }
    registrarLog('usuarios', uid, 'editar', `Dados do usuário atualizados: ${dados.nome || dados.email || uid}`);
  };

  const removerUsuario = (uid: string) => {
    const alvo = usuarios.find(u => u.uid === uid);
    const novosRemovidos = addTombstone('vl_usuarios_removidos_ids', uid);
    setUsuarios(prev => {
      const filtrados = prev.filter(u => u.uid !== uid);
      saveStorage('vl_usuarios', filtrados);
      salvarServidorDireto({ usuarios: filtrados, usuariosRemovidosIds: novosRemovidos });
      return filtrados;
    });
    if (db && auth?.currentUser && !isFirestoreWriteQuotaBlocked()) {
      deleteDoc(doc(db, 'usuarios', uid)).catch(err => {
        console.warn('[Firestore] Erro ao remover usuário:', err);
      });
    }
    registrarLog('usuarios', uid, 'excluir', `Usuário excluído do sistema: ${alvo?.nome || alvo?.email || uid}`);
  };

  const atualizarPapelUsuario = (uid: string, novoRole: Usuario['role'], clienteId?: string) => {
    setUsuarios(prev => {
      const atualizados = prev.map(u => u.uid === uid ? { ...u, role: novoRole, clienteId: clienteId || u.clienteId } : u);
      saveStorage('vl_usuarios', atualizados);
      salvarServidorDireto({ usuarios: atualizados });
      return atualizados;
    });
    if (db && auth?.currentUser && !isFirestoreWriteQuotaBlocked()) {
      setDoc(doc(db, 'usuarios', uid), { role: novoRole, clienteId: clienteId || null }, { merge: true }).catch(err => {
        console.warn('[Firestore] Erro ao atualizar papel:', err);
      });
    }
    registrarLog('usuarios', uid, 'editar', `Permissão alterada para papel: ${novoRole}`);
  };

  const adicionarUsuarioConvidado = (dados: Omit<Usuario, 'uid' | 'criadoEm'>) => {
    const uid = `usr-${Date.now()}`;
    const novo: Usuario = { ...dados, uid, criadoEm: new Date().toISOString() };
    setUsuarios(prev => {
      const lista = [novo, ...prev];
      saveStorage('vl_usuarios', lista);
      salvarServidorDireto({ usuarios: lista });
      return lista;
    });
    if (db && auth?.currentUser && !isFirestoreWriteQuotaBlocked()) {
      setDoc(doc(db, 'usuarios', uid), novo, { merge: true }).catch(err => {
        console.warn('[Firestore] Erro ao gravar usuário:', err);
      });
    }
    registrarLog('usuarios', uid, 'criar', `Novo usuário autorizado: ${novo.email} (${novo.role})`);
  };

  const aprovarSolicitacaoAcesso = async (id: string, role: UserRole, cargo?: string) => {
    const solicitacao = solicitacoesAcesso.find(s => s.id === id);
    if (!solicitacao) return;

    const novoUsuario: Usuario = {
      uid: id,
      nome: solicitacao.nome || solicitacao.email,
      email: solicitacao.email,
      role,
      cargo: cargo || (role === 'colaborador' ? 'Técnico / Inspetor Autorizado' : 'Acesso Homologado'),
      ativo: true,
      aprovadoPor: 'vitorleonardocl@gmail.com',
      criadoEm: new Date().toISOString()
    };

    setUsuarios(prev => {
      const lista = [novoUsuario, ...prev.filter(u => u.uid !== id)];
      saveStorage('vl_usuarios', lista);
      salvarServidorDireto({ usuarios: lista });
      return lista;
    });
    setSolicitacoesAcesso(prev => prev.map(s => s.id === id ? { ...s, status: 'aprovado' as const } : s));

    if (db && auth?.currentUser && !isFirestoreWriteQuotaBlocked()) {
      try {
        await setDoc(doc(db, 'usuarios', id), novoUsuario, { merge: true });
        await setDoc(doc(db, 'solicitacoesAcesso', id), { status: 'aprovado' }, { merge: true });
      } catch (err) {
        console.warn('[Firestore] Erro ao aprovar solicitação:', err);
      }
    }

    registrarLog('usuarios', id, 'criar', `Acesso aprovado pelo Master para: ${solicitacao.email} (${role})`);
  };

  const recusarSolicitacaoAcesso = async (id: string) => {
    const solicitacao = solicitacoesAcesso.find(s => s.id === id);
    setSolicitacoesAcesso(prev => prev.map(s => s.id === id ? { ...s, status: 'recusado' as const } : s));

    if (db && auth?.currentUser && !isFirestoreWriteQuotaBlocked()) {
      try {
        await setDoc(doc(db, 'solicitacoesAcesso', id), { status: 'recusado' }, { merge: true });
      } catch (err) {
        console.warn('[Firestore] Erro ao recusar solicitação:', err);
      }
    }

    registrarLog('usuarios', id, 'excluir', `Solicitação de acesso recusada para: ${solicitacao?.email || id}`);
  };

  const forcarSincronizacaoNuvem = async () => {
    if (!db || !auth?.currentUser || !firebaseUser || (currentUser?.role !== 'master' && currentUser?.role !== 'colaborador')) {
      console.log('[Firestore] Sincronização em nuvem não permitida sem login de colaborador/master.');
      return;
    }
    try {
      console.log('[Firestore] Forçando sincronização completa dos dados da nuvem...');
      const [snapCli, snapAtv, snapOrc, snapLau, snapChk, snapAg] = await Promise.all([
        getDocs(collection(db, 'clientes')),
        getDocs(collection(db, 'ativos')),
        getDocs(collection(db, 'orcamentos')),
        getDocs(collection(db, 'laudos')),
        getDocs(collection(db, 'checklistsCampo')),
        getDocs(collection(db, 'agendaVistorias')),
      ]);

      if (!snapCli.empty) {
        const removidosSet = new Set<string>(loadStorage('vl_clientes_removidos_ids', []));
        const docs = snapCli.docs.map(d => d.data() as Cliente);
        setClientes(prev => {
          const merged = mesclarColecaoPorId(prev, docs, removidosSet, FICTITIOUS_IDS.clientes, 'id');
          saveStorage('vl_clientes', merged);
          return merged;
        });
      }
      if (!snapAtv.empty) {
        const removidosSet = new Set<string>(loadStorage('vl_ativos_removidos_ids', []));
        const docs = snapAtv.docs.map(d => d.data() as Ativo);
        setAtivos(prev => {
          const merged = mesclarColecaoPorId(prev, docs, removidosSet, FICTITIOUS_IDS.ativos, 'id');
          saveStorage('vl_ativos', merged);
          return merged;
        });
      }
      if (!snapOrc.empty) {
        const removidosSet = new Set<string>(loadStorage('vl_orcamentos_removidos_ids', []));
        const docs = snapOrc.docs.map(d => d.data() as Orcamento);
        setOrcamentos(prev => {
          const merged = mesclarColecaoPorId(prev, docs, removidosSet, FICTITIOUS_IDS.orcamentos, 'id');
          saveStorage('vl_orcamentos', merged);
          return merged;
        });
      }
      if (!snapLau.empty) {
        const removidosSet = new Set<string>(loadStorage('vl_laudos_removidos_ids', []));
        const docs = snapLau.docs.map(d => normalizarLaudoPadrao(d.data() as Laudo, clientes));
        setLaudos(prev => {
          const merged = mesclarColecaoPorId(prev, docs, removidosSet, FICTITIOUS_IDS.laudos, 'id');
          saveStorage('vl_laudos', merged);
          return merged;
        });
      }
      if (!snapChk.empty) {
        const removidosSet = new Set<string>(loadStorage('vl_checklists_removidos_ids', []));
        const docs = normalizarChecklistsCampo(snapChk.docs.map(d => ({ ...(d.data() as ChecklistCampo), id: d.id })));
        setChecklistsCampo(prev => {
          const merged = normalizarChecklistsCampo(
            mesclarColecaoPorId(prev, docs, removidosSet, FICTITIOUS_IDS.checklistsCampo, 'id')
          );
          saveStorage('vl_checklists_campo', merged);
          return merged;
        });
      }
      if (!snapAg.empty) {
        const removidosSet = new Set<string>(loadStorage('vl_agenda_removidos_ids', []));
        const docs = snapAg.docs.map(d => d.data() as AgendaVistoria);
        setAgenda(prev => {
          const merged = mesclarColecaoPorId(prev, docs, removidosSet, FICTITIOUS_IDS.agenda, 'id');
          saveStorage('vl_agenda', merged);
          return merged;
        });
      }
    } catch (err) {
      console.warn('[Firestore] Erro na sincronização forçada:', err);
    }
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
  const registrarUsoIA = (tipoOuQtd: string | number = 1, quantidade = 1) => {
    const qtdEfetiva = typeof tipoOuQtd === 'number' ? tipoOuQtd : quantidade;
    setUsoIA(prev => {
      const totalChamadas = (prev?.totalChamadas || 0) + qtdEfetiva;
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

  // Checklist Modelos Editáveis (Configurações B4)
  const atualizarChecklistModelos = (modelos: ChecklistModeloServico[]) => {
    const agora = new Date().toISOString();
    const comTimestamp = modelos.map(m => ({ ...m, atualizadoEm: agora }));
    setChecklistModelos(comTimestamp);
    saveStorage('vl_checklist_modelos', comTimestamp);
    registrarLog('configuracoes', 'checklistModelos', 'editar', `Modelos de checklist atualizados (${comTimestamp.length} modelos)`);
    if (db && auth?.currentUser) {
      setDoc(doc(db, 'configuracoes', 'checklistModelos'), { modelos: comTimestamp, atualizadoEm: agora }, { merge: true }).catch(err => {
        console.warn('[Firestore] Erro ao salvar checklistModelos:', err);
      });
    }
  };

  const resetarChecklistModelos = () => {
    setChecklistModelos(CHECKLIST_MODELOS_PADRAO);
    saveStorage('vl_checklist_modelos', CHECKLIST_MODELOS_PADRAO);
    registrarLog('configuracoes', 'checklistModelos', 'editar', 'Modelos de checklist restaurados para o padrão VL Engenharia');
  };

  // Offline Sync Count & Queue Runner (B6)
  const atualizarContagemSync = useCallback(async () => {
    const [count, conflictsList] = await Promise.all([
      countPendingSyncItems(),
      getConflicts(),
    ]);
    setPendingSyncCount(count);
    setSyncConflicts(conflictsList);
  }, []);

  const sincronizarChecklistsOffline = useCallback(async () => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      await atualizarContagemSync();
      return;
    }

    const queue = await getPendingQueue();
    if (queue.length === 0) {
      await atualizarContagemSync();
      return;
    }

    setSincronizandoOffline(true);
    try {
      for (const item of queue) {
        try {
          // Verifica possível conflito no Firestore quando autenticado
          let conflitoDetectado = false;
          let versaoRemotaConflitante: ChecklistCampo | null = null;

          if (db && auth?.currentUser && item.action !== 'create') {
            try {
              const snap = await getDocFromServer(doc(db, 'checklistsCampo', item.checklistId)).catch(() =>
                getDoc(doc(db, 'checklistsCampo', item.checklistId))
              );
              if (snap.exists()) {
                const remoteData = snap.data() as ChecklistCampo;
                const remoteTs = new Date(remoteData.atualizadoEm || remoteData.criadoEm || 0).getTime();
                const baseTs = item.baseUpdatedAt ? new Date(item.baseUpdatedAt).getTime() : 0;
                if (baseTs > 0 && remoteTs > baseTs && JSON.stringify(remoteData.itens) !== JSON.stringify(item.payload.itens)) {
                  conflitoDetectado = true;
                  versaoRemotaConflitante = remoteData;
                }
              }
            } catch {
              // Sem acesso remoto imediato, segue tentativa padrão
            }
          }

          if (conflitoDetectado && versaoRemotaConflitante) {
            // Preserva ambas as versões e registra aviso visível
            await recordConflict({
              id: `conf-${item.checklistId}-${Date.now()}`,
              checklistId: item.checklistId,
              numero: item.payload.numero || item.checklistId,
              detectedAt: new Date().toISOString(),
              localVersion: item.payload,
              remoteVersion: versaoRemotaConflitante,
              resolved: false,
            });
            await removeFromQueue(item.id);
            continue;
          }

          // Envia para /api/app-data e Firestore
          await fetch('/api/app-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ checklistsCampo: checklistsCampo.map(c => c.id === item.checklistId ? item.payload : c) }),
          }).catch(() => undefined);

          if (db && auth?.currentUser) {
            if (isFirestoreWriteQuotaBlocked()) {
              break;
            }
            await setDoc(doc(db, 'checklistsCampo', item.checklistId), item.payload, { merge: true });
          }

          await removeFromQueue(item.id);
          await removeDraftOffline(item.checklistId);
        } catch (err) {
          if (isQuotaExceededError(err)) {
            markFirestoreWriteQuotaBlocked();
            break;
          }
          console.warn('[OfflineSync] Falha ao sincronizar item da fila:', item.checklistId, err);
        }
      }
    } finally {
      setSincronizandoOffline(false);
      await atualizarContagemSync();
    }
  }, [atualizarContagemSync, checklistsCampo]);

  const resolverConflitoChecklist = async (conflictId: string, escolha: 'local' | 'remoto' | 'ambos') => {
    const conflito = syncConflicts.find(c => c.id === conflictId);
    if (!conflito) return;

    const agora = new Date().toISOString();
    if (escolha === 'local') {
      const atualizado = { ...conflito.localVersion, atualizadoEm: agora };
      setChecklistsCampo(prev => prev.map(c => (c.id === atualizado.id ? atualizado : c)));
      if (db && auth?.currentUser) {
        await setDoc(doc(db, 'checklistsCampo', atualizado.id), atualizado, { merge: true }).catch(() => undefined);
      }
    } else if (escolha === 'remoto') {
      setChecklistsCampo(prev => prev.map(c => (c.id === conflito.remoteVersion.id ? conflito.remoteVersion : c)));
    } else {
      // 'ambos': mantém remota no ID original e cria cópia da versão local
      const copiaId = `chk-${Date.now()}`;
      const copiaNumero = `${conflito.localVersion.numero || conflito.checklistId}-OFF`;
      const copiaLocal: ChecklistCampo = {
        ...conflito.localVersion,
        id: copiaId,
        numero: copiaNumero,
        vinculadoALaudoId: null,
        criadoEm: agora,
        atualizadoEm: agora,
      };
      setChecklistsCampo(prev => [
        copiaLocal,
        ...prev.map(c => (c.id === conflito.remoteVersion.id ? conflito.remoteVersion : c)),
      ]);
      if (db && auth?.currentUser) {
        await setDoc(doc(db, 'checklistsCampo', copiaId), copiaLocal, { merge: true }).catch(() => undefined);
      }
    }

    await resolveConflictInStore(conflictId);
    await removeDraftOffline(conflito.checklistId);
    await atualizarContagemSync();
  };

  useEffect(() => {
    atualizarContagemSync();
  }, [atualizarContagemSync]);

  useEffect(() => {
    if (isOnline) {
      sincronizarChecklistsOffline();
    } else {
      atualizarContagemSync();
    }
  }, [isOnline]);

  // Checklist de Campo Handlers
  const gerarNumeroChecklistCampo = (): string => {
    const anoAtual = new Date().getFullYear();
    const prefixo = `CHK-${anoAtual}-`;
    let maxNum = 0;
    checklistsCampo.forEach(c => {
      if (c.numero && c.numero.startsWith(prefixo)) {
        const parteNum = parseInt(c.numero.replace(prefixo, ''), 10);
        if (!isNaN(parteNum) && parteNum > maxNum) {
          maxNum = parteNum;
        }
      }
    });
    return `${prefixo}${String(maxNum + 1).padStart(3, '0')}`;
  };

  const adicionarChecklistCampo = (dados: Omit<ChecklistCampo, 'id' | 'numero' | 'criadoEm' | 'atualizadoEm'>): string => {
    const id = `chk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const numero = gerarNumeroChecklistCampo();
    const agora = new Date().toISOString();
    const novo: ChecklistCampo = {
      ...dados,
      id,
      numero,
      criadoEm: agora,
      atualizadoEm: agora,
    };
    setChecklistsCampo(prev => {
      const lista = [novo, ...prev];
      saveStorage('vl_checklists_campo', lista);
      salvarServidorDireto({ checklistsCampo: lista });
      return lista;
    });
    registrarLog('checklistsCampo', id, 'criar', `Checklist de Campo criado: ${numero} (${novo.tipoLaudoNome || novo.tipoLaudoId})`);

    const offline = typeof navigator !== 'undefined' && !navigator.onLine;
    if (offline || isFirestoreWriteQuotaBlocked()) {
      enqueueSync({
        id: `sync-${id}-${Date.now()}`,
        checklistId: id,
        action: 'create',
        payload: novo,
        enqueuedAt: agora,
      }).then(() => atualizarContagemSync());
    } else if (db && auth?.currentUser) {
      try {
        setDoc(doc(db, 'checklistsCampo', id), novo).catch(err => {
          if (isQuotaExceededError(err)) markFirestoreWriteQuotaBlocked();
          console.warn('Sync Firestore checklistCampo (enfileirando offline):', err);
          enqueueSync({
            id: `sync-${id}-${Date.now()}`,
            checklistId: id,
            action: 'create',
            payload: novo,
            enqueuedAt: agora,
          }).then(() => atualizarContagemSync());
        });
      } catch (e) {
        console.warn('Firestore write error:', e);
      }
    }
    return id;
  };

  const atualizarChecklistCampo = (id: string, dados: Partial<ChecklistCampo>) => {
    const agora = new Date().toISOString();
    const existente = checklistsCampo.find(c => c.id === id);
    const atualizado: ChecklistCampo | undefined = existente ? { ...existente, ...dados, atualizadoEm: agora } : undefined;

    setChecklistsCampo(prev => {
      const lista = prev.map(c => c.id === id ? { ...c, ...dados, atualizadoEm: agora } : c);
      saveStorage('vl_checklists_campo', lista);
      salvarServidorDireto({ checklistsCampo: lista });
      return lista;
    });
    registrarLog('checklistsCampo', id, 'editar', `Checklist de Campo atualizado: ${id}`);

    const offline = typeof navigator !== 'undefined' && !navigator.onLine;
    if ((offline || isFirestoreWriteQuotaBlocked()) && atualizado) {
      enqueueSync({
        id: `sync-${id}-${Date.now()}`,
        checklistId: id,
        action: 'update',
        payload: atualizado,
        baseUpdatedAt: existente?.atualizadoEm,
        enqueuedAt: agora,
      }).then(() => atualizarContagemSync());
    } else if (db && auth?.currentUser) {
      try {
        setDoc(doc(db, 'checklistsCampo', id), { ...dados, atualizadoEm: agora }, { merge: true }).catch(err => {
          if (isQuotaExceededError(err)) markFirestoreWriteQuotaBlocked();
          console.warn('Sync Firestore checklistCampo (enfileirando offline):', err);
          if (atualizado) {
            enqueueSync({
              id: `sync-${id}-${Date.now()}`,
              checklistId: id,
              action: 'update',
              payload: atualizado,
              baseUpdatedAt: existente?.atualizadoEm,
              enqueuedAt: agora,
            }).then(() => atualizarContagemSync());
          }
        });
      } catch (e) {
        console.warn('Firestore write error:', e);
      }
    }
  };

  const removerChecklistCampo = (id: string) => {
    const novosRemovidos = addTombstone('vl_checklists_removidos_ids', id);
    setChecklistsCampo(prev => {
      const filtrados = prev.filter(c => c.id !== id);
      saveStorage('vl_checklists_campo', filtrados);
      salvarServidorDireto({ checklistsCampo: filtrados, checklistsRemovidosIds: novosRemovidos });
      return filtrados;
    });
    if (db && auth?.currentUser && !isFirestoreWriteQuotaBlocked()) {
      deleteDoc(doc(db, 'checklistsCampo', id)).catch(err => {
        handleFirestoreError(err, OperationType.DELETE, `checklistsCampo/${id}`);
      });
    }
    registrarLog('checklistsCampo', id, 'excluir', `Checklist de Campo excluído: ${id}`);
  };

  const finalizarChecklistCampo = (id: string, rubricaUrl?: string) => {
    const agora = new Date().toISOString();
    const existente = checklistsCampo.find(c => c.id === id);
    const dadosFinais: Partial<ChecklistCampo> = {
      status: 'finalizado',
      concluidaEm: agora,
      ...(rubricaUrl ? { rubricaUrl, rubricaTimestamp: agora } : {}),
      atualizadoEm: agora,
    };

    setChecklistsCampo(prev => {
      const lista = prev.map(c => c.id === id ? { ...c, ...dadosFinais } : c);
      saveStorage('vl_checklists_campo', lista);
      salvarServidorDireto({ checklistsCampo: lista });
      return lista;
    });
    registrarLog('checklistsCampo', id, 'finalizar', `Checklist de Campo finalizado: ${id}`);

    const offline = typeof navigator !== 'undefined' && !navigator.onLine;
    if ((offline || isFirestoreWriteQuotaBlocked()) && existente) {
      enqueueSync({
        id: `sync-${id}-${Date.now()}`,
        checklistId: id,
        action: 'finalize',
        payload: { ...existente, ...dadosFinais },
        baseUpdatedAt: existente.atualizadoEm,
        enqueuedAt: agora,
      }).then(() => atualizarContagemSync());
    } else if (db && auth?.currentUser) {
      try {
        setDoc(doc(db, 'checklistsCampo', id), dadosFinais, { merge: true }).catch(err => {
          if (isQuotaExceededError(err)) markFirestoreWriteQuotaBlocked();
          console.warn('Firestore sync err (enfileirando offline):', err);
          if (existente) {
            enqueueSync({
              id: `sync-${id}-${Date.now()}`,
              checklistId: id,
              action: 'finalize',
              payload: { ...existente, ...dadosFinais },
              baseUpdatedAt: existente.atualizadoEm,
              enqueuedAt: agora,
            }).then(() => atualizarContagemSync());
          }
        });
      } catch (e) {
        console.warn('Firestore err:', e);
      }
    }
  };

  // B7: Idempotent "Gerar laudo a partir desta vistoria" (cria ou atualiza rascunho sem duplicar)
  const gerarOuAtualizarLaudoDeChecklist = (checklistInput: ChecklistCampo): { laudoId: string; atualizado: boolean } => {
    const cliente = clientes.find(c => c.id === checklistInput.clienteId);
    const ativo = ativos.find(a => a.id === checklistInput.ativoId);
    const orcamento = orcamentos.find(o => o.id === checklistInput.vinculadoAOrcamentoId);
    const modelo = checklistModelos.find(m => m.id === checklistInput.modeloId || m.id === checklistInput.tipoLaudoId.replace('laudo-', ''));

    const dadosMapeados = montarDadosLaudoDeChecklist({
      checklist: checklistInput,
      cliente,
      ativo,
      orcamento,
      modelo,
    });

    const laudoExistente = laudos.find(
      l => l.id === checklistInput.vinculadoALaudoId || l.checklistCampoOrigemId === checklistInput.id
    );

    if (laudoExistente) {
      if (laudoExistente.revisaoCongelada || laudoExistente.status === 'finalizado') {
        if (checklistInput.vinculadoALaudoId !== laudoExistente.id) {
          atualizarChecklistCampo(checklistInput.id, { vinculadoALaudoId: laudoExistente.id });
        }
        return { laudoId: laudoExistente.id, atualizado: false };
      }

      atualizarLaudo(laudoExistente.id, {
        ...dadosMapeados,
        numero: laudoExistente.numero,
        artNumero: laudoExistente.artNumero || '',
      });
      if (checklistInput.vinculadoALaudoId !== laudoExistente.id) {
        atualizarChecklistCampo(checklistInput.id, { vinculadoALaudoId: laudoExistente.id });
      }
      return { laudoId: laudoExistente.id, atualizado: true };
    }

    const novoLaudoId = criarNovoLaudo(dadosMapeados);
    atualizarChecklistCampo(checklistInput.id, { vinculadoALaudoId: novoLaudoId });
    return { laudoId: novoLaudoId, atualizado: false };
  };

  const alternarPermitePreenchimentoPreliminar = (tipoId: string, permite: boolean) => {
    setCategoriasLaudo(prev => prev.map(cat => ({
      ...cat,
      subcategorias: cat.subcategorias.map(sub => ({
        ...sub,
        tipos: sub.tipos.map(tp => tp.id === tipoId ? { ...tp, permitePreenchimentoPreliminar: permite } : tp)
      }))
    })));
    registrarLog('taxonomiaLaudos', tipoId, 'editar', `Permissão de checklist preliminar alterada para ${permite} no tipo: ${tipoId}`);
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
        auditLogs: logsAuditoria,
        contatos,
        usuarios,
        solicitacoesAcesso,
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
        associarOrcamentoAoLaudo,
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
        atualizarUsuario,
        removerUsuario,
        atualizarPapelUsuario,
        adicionarUsuarioConvidado,
        aprovarSolicitacaoAcesso,
        recusarSolicitacaoAcesso,
        forcarSincronizacaoNuvem,
        enviarContatoPublico,
        marcarContatoRespondido,
        registrarUsoIA,
        atualizarLimiteIA,
        checklistsCampo,
        checklistModelos,
        atualizarChecklistModelos,
        resetarChecklistModelos,
        adicionarChecklistCampo,
        atualizarChecklistCampo,
        removerChecklistCampo,
        finalizarChecklistCampo,
        gerarOuAtualizarLaudoDeChecklist,
        alternarPermitePreenchimentoPreliminar,
        pendingSyncCount,
        syncConflicts,
        sincronizandoOffline,
        sincronizarChecklistsOffline,
        resolverConflitoChecklist,
        atualizarContagemSync,
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
