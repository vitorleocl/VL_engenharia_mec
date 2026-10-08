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
  SolicitacaoAcesso,
  UserRole
} from '../types';
import { 
  CLIENTES_INICIAIS, 
  ATIVOS_INICIAIS, 
  ORCAMENTOS_INICIAIS, 
  AGENDA_INICIAL, 
  LAUDOS_INICIAIS, 
  TEMPLATES_INICIAIS,
  CHECKLISTS_CAMPO_INICIAIS,
  NR12_REQUISITOS_PADRAO
} from '../data/initialData';
import { CATEGORIAS_LAUDOS_TAXONOMIA } from '../data/taxonomiaLaudos';
import { gerarMinutaTecnicaSecao } from '../lib/geradorMinutasLaudo';
import { gerarLaudoCausaRaizOffline } from '../lib/motorLaudoCausaRaiz';
import { 
  sincronizarFirestoreNR12eNR13, 
  sincronizarFirestoreVeicular,
  sincronizarFirestoreIncendio,
  sincronizarFirestoreMaquinasPesadas,
  sincronizarFirestorePlayground,
  sincronizarFirestoreEstruturasMetalicas,
  sincronizarFirestoreElevacaoIndustrial,
  sincronizarFirestoreTubulacoesProcesso,
  sincronizarFirestorePericiasAvaliacaoBens,
  sincronizarFirestoreGeradoresAcessibilidadeRuido,
  sincronizarFirestoreClimatizacao
} from '../lib/firestoreTaxonomia';
import { db, auth } from '../lib/firebase';
import { 
  doc, 
  setDoc, 
  deleteDoc, 
  collection, 
  getDocs, 
  onSnapshot, 
  getDocFromServer 
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
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

  // Checklist de Campo Actions
  checklistsCampo: ChecklistCampo[];
  adicionarChecklistCampo: (dados: Omit<ChecklistCampo, 'id' | 'numero' | 'criadoEm' | 'atualizadoEm'>) => string;
  atualizarChecklistCampo: (id: string, dados: Partial<ChecklistCampo>) => void;
  removerChecklistCampo: (id: string) => void;
  finalizarChecklistCampo: (id: string, rubricaUrl?: string) => void;
  alternarPermitePreenchimentoPreliminar: (tipoId: string, permite: boolean) => void;
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
  const { currentUser, firebaseUser } = useAuth();

  const [clientes, setClientes] = useState<Cliente[]>(() => {
    let loaded = loadStorage('vl_clientes', CLIENTES_INICIAIS);
    // Remove resquício de teste artificial apenas se presente
    loaded = loaded.map(c => {
      if (c.razaoSocial.includes('ADF Comércio e Serviços')) {
        return {
          ...c,
          id: 'cli-adf',
          razaoSocial: 'ADF',
          nomeFantasia: 'ADF',
        };
      }
      return c;
    });
    const temAdf = loaded.some((c: Cliente) => c.id === 'cli-adf');
    if (!temAdf) {
      const cliAdf = CLIENTES_INICIAIS.find(c => c.id === 'cli-adf');
      if (cliAdf) {
        const atualizados = [cliAdf, ...loaded];
        saveStorage('vl_clientes', atualizados);
        return atualizados;
      }
    }
    return loaded;
  });

  const [ativos, setAtivos] = useState<Ativo[]>(() => {
    let loaded = loadStorage('vl_ativos', ATIVOS_INICIAIS);
    loaded = loaded.map(a => {
      if (a.clienteNome?.includes('ADF Comércio')) {
        return {
          ...a,
          clienteNome: 'ADF',
        };
      }
      return a;
    });
    const temPgx = loaded.some((a: Ativo) => a.id === 'atv-pgx7098');
    if (!temPgx) {
      const atvPgx = ATIVOS_INICIAIS.find(a => a.id === 'atv-pgx7098');
      if (atvPgx) {
        const atualizados = [atvPgx, ...loaded];
        saveStorage('vl_ativos', atualizados);
        return atualizados;
      }
    }
    return loaded;
  });

  const [orcamentos, setOrcamentos] = useState<Orcamento[]>(() => {
    let loaded: Orcamento[] = loadStorage('vl_orcamentos', ORCAMENTOS_INICIAIS);
    let alterouStorage = false;

    // Remover qualquer orc-adf-pgx7098 e garantir o orc-1790444416499 real
    if (loaded.some(o => o.id === 'orc-adf-pgx7098')) {
      loaded = loaded.filter(o => o.id !== 'orc-adf-pgx7098');
      alterouStorage = true;
    }

    const temOrcAdf = loaded.some((o: Orcamento) => o.id === 'orc-1790444416499');
    if (!temOrcAdf) {
      const orcAdf = ORCAMENTOS_INICIAIS.find(o => o.id === 'orc-1790444416499');
      if (orcAdf) {
        loaded.unshift(orcAdf);
        alterouStorage = true;
      }
    }

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
            // Only update if completely empty
            if (!s.conteudoHtml || s.conteudoHtml.trim() === '') {
              modificouOrc = true;
              return {
                ...s,
                titulo: 'Etapa 2 - Escopo Técnico das Atividades (Metodologia)',
                subtitulo: 'FASES, CHECKLISTS E ENSAIOS EM 5 ETAPAS',
                conteudoHtml: gerarHtmlEtapa2Metodologia(normas),
              };
            }
          }

          if (isEtapa3) {
            let htmlEtapa3 = s.conteudoHtml;
            if (!htmlEtapa3 || htmlEtapa3.trim() === '') {
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
                }),
              };
            } else if (htmlEtapa3.includes('Assinado Digitalmente') || htmlEtapa3.includes('Aceite Eletrônico')) {
              modificouOrc = true;
              htmlEtapa3 = htmlEtapa3
                .replace(/<span[^>]*>[^<]*Assinado Digitalmente pelo Emissor[^<]*<\/span>/gi, '')
                .replace(/<span[^>]*>[^<]*\[Aceite Eletrônico \/ Assinatura Digital\][^<]*<\/span>/gi, '')
                .replace(/✓ Assinado Digitalmente pelo Emissor/g, '')
                .replace(/\[Aceite Eletrônico \/ Assinatura Digital\]/g, '');
              return { ...s, conteudoHtml: htmlEtapa3 };
            }
          }

          if (isContato) {
            if (!s.conteudoHtml || s.conteudoHtml.trim() === '' || s.conteudoHtml.includes('🤝') || !s.conteudoHtml.includes('HEADER HERO EXECUTIVO') || s.conteudoHtml.includes('Recife & Polo Industrial de Suape')) {
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
                subtitulo: 'FASES, CHECKLISTS E ENSAIOS EM 5 ETAPAS',
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
            if (!p.conteudoHtml || p.conteudoHtml.trim() === '' || p.conteudoHtml.includes('Recife & Polo Industrial de Suape')) {
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
  const [agenda, setAgenda] = useState<AgendaVistoria[]>(() => loadStorage('vl_agenda', AGENDA_INICIAL));
  const [laudos, setLaudos] = useState<Laudo[]>(() => {
    const removidos: string[] = loadStorage('vl_laudos_removidos_ids', []);
    const removidosSet = new Set(removidos);
    const loaded: Laudo[] = loadStorage('vl_laudos', LAUDOS_INICIAIS);
    return loaded.filter(l => !removidosSet.has(l.id));
  });
  const [templates, setTemplates] = useState<LaudoTemplate[]>(() => loadStorage('vl_templates', TEMPLATES_INICIAIS));
  const [checklistsCampo, setChecklistsCampo] = useState<ChecklistCampo[]>(() => 
    loadStorage('vl_checklists_campo', CHECKLISTS_CAMPO_INICIAIS)
  );
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
  const defaultLogs: LogAuditoria[] = [
    {
      id: 'log-01',
      colecaoAfetada: 'laudos',
      documentoId: 'lau-2026-003',
      acao: 'finalizar',
      usuarioUid: 'master-vitor',
      usuarioNome: 'Eng. Vitor Leonardo',
      usuarioEmail: 'vlengenhariamec@gmail.com',
      timestamp: '2026-02-20T18:00:00Z',
      detalhes: 'Laudo LAR-2026-003 concluído e ART PE2026-0104882 vinculada.'
    }
  ];
  const [logsAuditoria, setLogsAuditoria] = useState<LogAuditoria[]>(() => {
    const loaded: LogAuditoria[] = loadStorage('vl_logs', defaultLogs);
    return loaded.map((l) => l.usuarioEmail === 'vitorleonardocl@gmail.com' ? { ...l, usuarioEmail: 'vlengenhariamec@gmail.com' } : l);
  });
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
  const defaultUsuarios: Usuario[] = [
    {
      uid: 'master-vitor-leonardo',
      nome: 'Eng. Vitor Leonardo',
      email: 'vitorleonardocl@gmail.com',
      role: 'master',
      cargo: 'Responsável Técnico / Fundador (CREA-PE 1822299490)',
      crea: '1822299490',
      ativo: true,
      criadoEm: '2025-01-01T00:00:00Z',
    },
    {
      uid: 'usr-colab-1',
      nome: 'Lucas Silveira',
      email: 'lucas.inspetor@vlengenharia.com',
      role: 'colaborador',
      cargo: 'Técnico em Mecânica / Inspetor',
      ativo: true,
      criadoEm: '2026-01-10T10:00:00Z',
    },
    {
      uid: 'usr-cli-1',
      nome: 'Carlos Eduardo (Suape Eng.)',
      email: 'carlos@suapeeng.com.br',
      role: 'cliente',
      clienteId: 'cli-01',
      cargo: 'Gerente de Manutenção',
      ativo: true,
      criadoEm: '2026-01-15T11:00:00Z',
    }
  ];
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => {
    const loaded: Usuario[] = loadStorage('vl_usuarios', defaultUsuarios);
    const temMaster = loaded.some(u => u.email.toLowerCase() === 'vitorleonardocl@gmail.com');
    if (!temMaster) {
      return [defaultUsuarios[0], ...loaded];
    }
    return loaded.map(u => u.email.toLowerCase() === 'vitorleonardocl@gmail.com' ? { ...u, role: 'master' as const, ativo: true } : u);
  });

  const [solicitacoesAcesso, setSolicitacoesAcesso] = useState<SolicitacaoAcesso[]>(() => {
    return loadStorage('vl_solicitacoes_acesso', []);
  });

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
  useEffect(() => saveStorage('vl_checklists_campo', checklistsCampo), [checklistsCampo]);
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

    // Test connection to Firestore
    getDocFromServer(doc(db, 'test', 'connection')).catch(error => {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.warn('Firestore offline fallback:', error);
      }
    });

    const initAndListenFirestore = async () => {
      try {
        // Se a nuvem estiver vazia, faz o seed inicial dos dados canônicos
        const clientesSnap = await getDocs(collection(db, 'clientes'));
        if (clientesSnap.empty && !cancelado) {
          console.log('[Firestore] Inicializando coleções na nuvem com dados canônicos...');
          for (const c of clientes) {
            await setDoc(doc(db, 'clientes', c.id), c, { merge: true });
          }
          for (const a of ativos) {
            await setDoc(doc(db, 'ativos', a.id), a, { merge: true });
          }
          for (const o of orcamentos) {
            await setDoc(doc(db, 'orcamentos', o.id), o, { merge: true });
          }
          for (const l of laudos) {
            await setDoc(doc(db, 'laudos', l.id), l, { merge: true });
          }
          for (const ck of checklistsCampo) {
            await setDoc(doc(db, 'checklistsCampo', ck.id), ck, { merge: true });
          }
          for (const ag of agenda) {
            await setDoc(doc(db, 'agendaVistorias', ag.id), ag, { merge: true });
          }
          for (const u of usuarios) {
            await setDoc(doc(db, 'usuarios', u.uid), u, { merge: true });
          }
          console.log('[Firestore] Dados canônicos unificados na nuvem com sucesso!');
        }
      } catch (err) {
        console.warn('[Firestore] Erro na verificação inicial:', err);
      }

      // Listeners em tempo real para sincronização instantânea entre múltiplos dispositivos
      const unsubClientes = onSnapshot(collection(db, 'clientes'), (snapshot) => {
        if (!snapshot.empty) {
          const docs = snapshot.docs.map(d => d.data() as Cliente);
          setClientes(docs);
          saveStorage('vl_clientes', docs);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'clientes');
      });

      const unsubAtivos = onSnapshot(collection(db, 'ativos'), (snapshot) => {
        if (!snapshot.empty) {
          const docs = snapshot.docs.map(d => d.data() as Ativo);
          setAtivos(docs);
          saveStorage('vl_ativos', docs);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'ativos');
      });

      const unsubOrcamentos = onSnapshot(collection(db, 'orcamentos'), (snapshot) => {
        if (!snapshot.empty) {
          const docs = snapshot.docs.map(d => d.data() as Orcamento);
          setOrcamentos(docs);
          saveStorage('vl_orcamentos', docs);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'orcamentos');
      });

      const unsubLaudos = onSnapshot(collection(db, 'laudos'), (snapshot) => {
        if (!snapshot.empty) {
          const laudosRemovidos: string[] = loadStorage('vl_laudos_removidos_ids', []);
          const removidosSet = new Set(laudosRemovidos);
          const docs = snapshot.docs.map(d => d.data() as Laudo).filter(d => !removidosSet.has(d.id));
          setLaudos(docs);
          saveStorage('vl_laudos', docs);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'laudos');
      });

      const unsubChecklists = onSnapshot(collection(db, 'checklistsCampo'), (snapshot) => {
        if (!snapshot.empty) {
          const docs = snapshot.docs.map(d => d.data() as ChecklistCampo);
          setChecklistsCampo(docs);
          saveStorage('vl_checklists_campo', docs);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'checklistsCampo');
      });

      const unsubAgenda = onSnapshot(collection(db, 'agendaVistorias'), (snapshot) => {
        if (!snapshot.empty) {
          const docs = snapshot.docs.map(d => d.data() as AgendaVistoria);
          setAgenda(docs);
          saveStorage('vl_agenda', docs);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'agendaVistorias');
      });

      const unsubUsuarios = onSnapshot(collection(db, 'usuarios'), (snapshot) => {
        if (!snapshot.empty) {
          const docs = snapshot.docs.map(d => d.data() as Usuario);
          setUsuarios(docs);
          saveStorage('vl_usuarios', docs);
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

  // Sincronização com persistência do servidor para evitar perda de dados entre URLs (ais-dev e ais-pre)
  useEffect(() => {
    fetch('/api/app-data')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!data) {
          isHydratedRef.current = true;
          return;
        }

        if (Array.isArray(data.clientes) && data.clientes.length > 0) {
          setClientes(prev => {
            const serverMap = new Map<string, Cliente>(data.clientes.map((c: Cliente) => [c.id, c]));
            const atualizados = prev.map(c => {
              const fromServer = serverMap.get(c.id);
              if (fromServer) {
                return { ...c, ...fromServer };
              }
              return c;
            });
            const prevIds = new Set(prev.map(c => c.id));
            const novos = data.clientes.filter((c: Cliente) => !prevIds.has(c.id));
            const merged = [...novos, ...atualizados];
            saveStorage('vl_clientes', merged);
            return merged;
          });
        }

        if (Array.isArray(data.ativos) && data.ativos.length > 0) {
          setAtivos(prev => {
            const serverMap = new Map<string, Ativo>(data.ativos.map((a: Ativo) => [a.id, a]));
            const atualizados = prev.map(a => {
              const fromServer = serverMap.get(a.id);
              if (fromServer) {
                return { ...a, ...fromServer };
              }
              return a;
            });
            const prevIds = new Set(prev.map(a => a.id));
            const novos = data.ativos.filter((a: Ativo) => !prevIds.has(a.id));
            const merged = [...novos, ...atualizados];
            saveStorage('vl_ativos', merged);
            return merged;
          });
        }

        if (Array.isArray(data.orcamentos) && data.orcamentos.length > 0) {
          setOrcamentos(prev => {
            const serverMap = new Map<string, Orcamento>(data.orcamentos.filter((o: Orcamento) => o.id !== 'orc-adf-pgx7098').map((o: Orcamento) => [o.id, o]));
            const limpos = prev.filter(o => o.id !== 'orc-adf-pgx7098');
            const atualizados = limpos.map(o => {
              const fromServer = serverMap.get(o.id);
              if (fromServer) {
                // Preserva edições locais do usuário (como status e campos modificados recentemente)
                return { ...fromServer, ...o };
              }
              return o;
            });
            const prevIds = new Set(limpos.map(o => o.id));
            const novos = data.orcamentos.filter((o: Orcamento) => o.id !== 'orc-adf-pgx7098' && !prevIds.has(o.id));
            const merged = [...novos, ...atualizados];
            saveStorage('vl_orcamentos', merged);
            return merged;
          });
        }

        const laudosRemovidos: string[] = loadStorage('vl_laudos_removidos_ids', []);
        const removidosSet = new Set(laudosRemovidos);

        if (Array.isArray(data.laudos) && data.laudos.length > 0) {
          setLaudos(prev => {
            const limpos = prev.filter(l => !removidosSet.has(l.id));
            const serverMap = new Map<string, Laudo>(data.laudos.filter((l: Laudo) => !removidosSet.has(l.id)).map((l: Laudo) => [l.id, l]));
            const atualizados = limpos.map(l => {
              const fromServer = serverMap.get(l.id);
              if (fromServer) {
                return { ...fromServer, ...l };
              }
              return l;
            });
            const prevIds = new Set(limpos.map(l => l.id));
            const novos = data.laudos.filter((l: Laudo) => !removidosSet.has(l.id) && !prevIds.has(l.id));
            const merged = [...novos, ...atualizados];
            saveStorage('vl_laudos', merged);
            return merged;
          });
        } else {
          setLaudos(prev => {
            const limpos = prev.filter(l => !removidosSet.has(l.id));
            saveStorage('vl_laudos', limpos);
            return limpos;
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
        body: JSON.stringify({ clientes, ativos, orcamentos, laudos, checklistsCampo, agenda, usuarios })
      }).catch(e => {
        console.warn('[Sync Servidor] Aviso ao persistir dados:', e);
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [clientes, ativos, orcamentos, laudos, checklistsCampo, agenda, usuarios]);

  // Sincronização de documentos Firestore das categorias de laudo (apenas para o master autenticado)
  useEffect(() => {
    if (!firebaseUser || !auth?.currentUser || currentUser?.role !== 'master') return;

    sincronizarFirestoreNR12eNR13().then(res => {
      if (res.sucesso) {
        console.log(`[Firestore Taxonomia NR12/NR13] ${res.mensagem}`);
      }
    }).catch(err => {
      console.warn('[Firestore Taxonomia NR12/NR13] Sincronização em segundo plano:', err);
    });

    sincronizarFirestoreVeicular().then(res => {
      if (res.sucesso) {
        console.log(`[Firestore Taxonomia Veicular] ${res.mensagem}`);
      }
    }).catch(err => {
      console.warn('[Firestore Taxonomia Veicular] Sincronização em segundo plano:', err);
    });

    sincronizarFirestoreIncendio().then(res => {
      if (res.sucesso) {
        console.log(`[Firestore Taxonomia Incêndio] ${res.mensagem}`);
      }
    }).catch(err => {
      console.warn('[Firestore Taxonomia Incêndio] Sincronização em segundo plano:', err);
    });

    sincronizarFirestoreMaquinasPesadas().then(res => {
      if (res.sucesso) {
        console.log(`[Firestore Taxonomia Máquinas Pesadas] ${res.mensagem}`);
      }
    }).catch(err => {
      console.warn('[Firestore Taxonomia Máquinas Pesadas] Sincronização em segundo plano:', err);
    });

    sincronizarFirestorePlayground().then(res => {
      if (res.sucesso) {
        console.log(`[Firestore Taxonomia Playground] ${res.mensagem}`);
      }
    }).catch(err => {
      console.warn('[Firestore Taxonomia Playground] Sincronização em segundo plano:', err);
    });

    sincronizarFirestoreEstruturasMetalicas().then(res => {
      if (res.sucesso) {
        console.log(`[Firestore Taxonomia Estruturas Metálicas] ${res.mensagem}`);
      }
    }).catch(err => {
      console.warn('[Firestore Taxonomia Estruturas Metálicas] Sincronização em segundo plano:', err);
    });

    sincronizarFirestoreElevacaoIndustrial().then(res => {
      if (res.sucesso) {
        console.log(`[Firestore Taxonomia Elevação Industrial] ${res.mensagem}`);
      }
    }).catch(err => {
      console.warn('[Firestore Taxonomia Elevação Industrial] Sincronização em segundo plano:', err);
    });

    sincronizarFirestoreTubulacoesProcesso().then(res => {
      if (res.sucesso) {
        console.log(`[Firestore Taxonomia Tubulações de Processo] ${res.mensagem}`);
      }
    }).catch(err => {
      console.warn('[Firestore Taxonomia Tubulações de Processo] Sincronização em segundo plano:', err);
    });

    sincronizarFirestorePericiasAvaliacaoBens().then(res => {
      if (res.sucesso) {
        console.log(`[Firestore Taxonomia Perícias e Avaliação de Bens] ${res.mensagem}`);
      }
    }).catch(err => {
      console.warn('[Firestore Taxonomia Perícias e Avaliação de Bens] Sincronização em segundo plano:', err);
    });

    sincronizarFirestoreGeradoresAcessibilidadeRuido().then(res => {
      if (res.sucesso) {
        console.log(`[Firestore Taxonomia Geradores e Acessibilidade/Ruído] ${res.mensagem}`);
      }
    }).catch(err => {
      console.warn('[Firestore Taxonomia Geradores e Acessibilidade/Ruído] Sincronização em segundo plano:', err);
    });

    sincronizarFirestoreClimatizacao().then(res => {
      if (res.sucesso) {
        console.log(`[Firestore Taxonomia Climatização e Manutenção] ${res.mensagem}`);
      }
    }).catch(err => {
      console.warn('[Firestore Taxonomia Climatização e Manutenção] Sincronização em segundo plano:', err);
    });
  }, [firebaseUser, currentUser?.role]);

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

    if (db && auth?.currentUser) {
      setDoc(doc(db, 'clientes', id), novo).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `clientes/${id}`);
      });
    }

    registrarLog('clientes', id, 'criar', `Cliente criado: ${novo.razaoSocial}`);
    return id;
  };

  const atualizarCliente = (id: string, dados: Partial<Cliente>) => {
    const cnpjUniforme = dados.cpfCnpj || dados.cnpj;
    const dadosTratados: Partial<Cliente> = {
      ...dados,
      ...(cnpjUniforme ? { cpfCnpj: cnpjUniforme, cnpj: cnpjUniforme } : {})
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

    if (db && auth?.currentUser) {
      setDoc(doc(db, 'clientes', id), dadosTratados, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `clientes/${id}`);
      });
    }

    // Cascata imediata para Ativos, Orçamentos e Laudos
    if (dados.razaoSocial || cnpjUniforme) {
      setAtivos(prev => {
        const atualizados = prev.map(a => a.clienteId === id ? {
          ...a,
          clienteNome: dados.razaoSocial || a.clienteNome,
        } : a);
        saveStorage('vl_ativos', atualizados);
        salvarServidorDireto({ ativos: atualizados });
        return atualizados;
      });

      setOrcamentos(prev => {
        const atualizados = prev.map(o => {
          if (o.clienteId !== id) return o;
          return {
            ...o,
            clienteNome: dados.razaoSocial || o.clienteNome,
            cnpjCliente: cnpjUniforme || o.cnpjCliente,
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
            clienteNome: dados.razaoSocial || l.clienteNome,
          };
        });
        saveStorage('vl_laudos', atualizados);
        salvarServidorDireto({ laudos: atualizados });
        return atualizados;
      });
    }

    registrarLog('clientes', id, 'editar', `Cliente atualizado: ${dados.razaoSocial || id}`);
  };

  const removerCliente = (id: string) => {
    setClientes(prev => {
      const filtrados = prev.filter(c => c.id !== id);
      saveStorage('vl_clientes', filtrados);
      salvarServidorDireto({ clientes: filtrados });
      return filtrados;
    });

    if (db && auth?.currentUser) {
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
    const novo: Ativo = {
      ...dados,
      id,
      clienteNome: cliente?.razaoSocial || dados.clienteNome,
      historico: [],
      criadoEm: new Date().toISOString(),
    };
    setAtivos(prev => {
      const lista = [novo, ...prev];
      saveStorage('vl_ativos', lista);
      salvarServidorDireto({ ativos: lista });
      return lista;
    });

    if (db && auth?.currentUser) {
      setDoc(doc(db, 'ativos', id), novo).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `ativos/${id}`);
      });
    }

    registrarLog('ativos', id, 'criar', `Ativo criado: ${novo.identificacao} (${novo.tipo})`);
    return id;
  };

  const atualizarAtivo = (id: string, dados: Partial<Ativo>) => {
    setAtivos(prev => {
      const atualizados = prev.map(a => a.id === id ? { ...a, ...dados } : a);
      saveStorage('vl_ativos', atualizados);
      salvarServidorDireto({ ativos: atualizados });
      return atualizados;
    });

    if (db && auth?.currentUser) {
      setDoc(doc(db, 'ativos', id), dados, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `ativos/${id}`);
      });
    }

    registrarLog('ativos', id, 'editar', `Ativo atualizado: ${dados.identificacao || id}`);
  };

  const removerAtivo = (id: string) => {
    setAtivos(prev => {
      const filtrados = prev.filter(a => a.id !== id);
      saveStorage('vl_ativos', filtrados);
      salvarServidorDireto({ ativos: filtrados });
      return filtrados;
    });

    if (db && auth?.currentUser) {
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
    const novo: Orcamento = {
      ...dados,
      id,
      clienteNome: cliente?.razaoSocial || dados.clienteNome,
      criadoEm: new Date().toISOString(),
    };
    setOrcamentos(prev => {
      const lista = [novo, ...prev];
      saveStorage('vl_orcamentos', lista);
      salvarServidorDireto({ orcamentos: lista });
      return lista;
    });

    if (db && auth?.currentUser) {
      setDoc(doc(db, 'orcamentos', id), novo).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `orcamentos/${id}`);
      });
    }

    registrarLog('orcamentos', id, 'criar', `Orçamento criado: R$ ${novo.valor} (${novo.servico})`);
    return id;
  };

  const atualizarOrcamento = (id: string, dados: Partial<Orcamento>) => {
    setOrcamentos(prev => {
      const atualizados = prev.map(o => o.id === id ? { ...o, ...dados } : o);
      saveStorage('vl_orcamentos', atualizados);
      salvarServidorDireto({ orcamentos: atualizados });
      return atualizados;
    });
    registrarLog('orcamentos', id, 'editar', `Orçamento/Proposta atualizada: ${dados.servico || id}`);
    if (db && auth?.currentUser) {
      setDoc(doc(db, 'orcamentos', id), dados, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `orcamentos/${id}`);
      });
    }
  };

  const atualizarStatusOrcamento = (id: string, status: Orcamento['status']) => {
    setOrcamentos(prev => {
      const atualizados = prev.map(o => o.id === id ? { ...o, status } : o);
      saveStorage('vl_orcamentos', atualizados);
      salvarServidorDireto({ orcamentos: atualizados });
      return atualizados;
    });

    if (db && auth?.currentUser) {
      setDoc(doc(db, 'orcamentos', id), { status }, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `orcamentos/${id}`);
      });
    }

    registrarLog('orcamentos', id, 'editar', `Status do orçamento alterado para: ${status}`);
  };

  const removerOrcamento = (id: string) => {
    setOrcamentos(prev => {
      const filtrados = prev.filter(o => o.id !== id);
      saveStorage('vl_orcamentos', filtrados);
      salvarServidorDireto({ orcamentos: filtrados });
      return filtrados;
    });

    if (db && auth?.currentUser) {
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
              marca: ativo?.marca || 'Volkswagen',
              modelo: ativo?.modelo || 'Gol 1.0 MPI Flex',
              anoModelo: ativo?.anoFabricacao ? `${ativo.anoFabricacao}/${ativo.anoFabricacao}` : '2021/2022',
              placa: ativo?.placa || 'PGX-7098',
              renavam: ativo?.renavam || '01248920192',
              chassi: ativo?.chassi || '9BWCA05U0NT001824',
              kmAtual: ativo?.horimetroOuKm || 82450,
              kmIntervencaoPrevia: 59800
            },
            contexto: {
              dataPane: dataInspecao,
              dataIntervencaoPrevia: '2025-11-10',
              historicoManutencao: 'Substituição preventiva do conjunto de correias e tensores do motor em oficina mecânica terceirizada credenciada',
              oficinaTerceirizada: 'Auto Mecânica Terceirizada Frota Ltda',
              restricaoConfidencialidade: true,
              kmIntervalo: 22650
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
    setLaudos(prev => {
      const atualizados = prev.map(l => l.id === id ? { ...l, ...dados, atualizadoEm: new Date().toISOString() } : l);
      saveStorage('vl_laudos', atualizados);
      fetch('/api/storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ laudos: atualizados })
      }).catch(err => console.warn('Aviso sincronizacao laudos:', err));
      return atualizados;
    });
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
    setLaudos(prev => {
      const filtrados = prev.filter(l => l.id !== id);
      saveStorage('vl_laudos', filtrados);
      salvarServidorDireto({ laudos: filtrados });
      return filtrados;
    });

    try {
      const removidos: string[] = loadStorage('vl_laudos_removidos_ids', []);
      if (!removidos.includes(id)) {
        saveStorage('vl_laudos_removidos_ids', [...removidos, id]);
      }
    } catch (e) {
      console.warn('Erro ao salvar ID de laudo removido:', e);
    }

    if (db && auth?.currentUser) {
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
    setUsuarios(prev => prev.map(u => u.uid === uid ? { ...u, ...dados } : u));
    if (db && auth?.currentUser) {
      setDoc(doc(db, 'usuarios', uid), dados, { merge: true }).catch(err => {
        console.warn('[Firestore] Erro ao atualizar usuário:', err);
      });
    }
    registrarLog('usuarios', uid, 'editar', `Dados do usuário atualizados: ${dados.nome || dados.email || uid}`);
  };

  const removerUsuario = (uid: string) => {
    const alvo = usuarios.find(u => u.uid === uid);
    setUsuarios(prev => prev.filter(u => u.uid !== uid));
    if (db && auth?.currentUser) {
      deleteDoc(doc(db, 'usuarios', uid)).catch(err => {
        console.warn('[Firestore] Erro ao remover usuário:', err);
      });
    }
    registrarLog('usuarios', uid, 'excluir', `Usuário excluído do sistema: ${alvo?.nome || alvo?.email || uid}`);
  };

  const atualizarPapelUsuario = (uid: string, novoRole: Usuario['role'], clienteId?: string) => {
    setUsuarios(prev => prev.map(u => u.uid === uid ? { ...u, role: novoRole, clienteId: clienteId || u.clienteId } : u));
    if (db && auth?.currentUser) {
      setDoc(doc(db, 'usuarios', uid), { role: novoRole, clienteId: clienteId || null }, { merge: true }).catch(err => {
        console.warn('[Firestore] Erro ao atualizar papel:', err);
      });
    }
    registrarLog('usuarios', uid, 'editar', `Permissão alterada para papel: ${novoRole}`);
  };

  const adicionarUsuarioConvidado = (dados: Omit<Usuario, 'uid' | 'criadoEm'>) => {
    const uid = `usr-${Date.now()}`;
    const novo: Usuario = { ...dados, uid, criadoEm: new Date().toISOString() };
    setUsuarios(prev => [novo, ...prev]);
    if (db && auth?.currentUser) {
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

    setUsuarios(prev => [novoUsuario, ...prev.filter(u => u.uid !== id)]);
    setSolicitacoesAcesso(prev => prev.map(s => s.id === id ? { ...s, status: 'aprovado' as const } : s));

    if (db && auth?.currentUser) {
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

    if (db && auth?.currentUser) {
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
      const [snapCli, snapAtv, snapOrc, snapLau] = await Promise.all([
        getDocs(collection(db, 'clientes')),
        getDocs(collection(db, 'ativos')),
        getDocs(collection(db, 'orcamentos')),
        getDocs(collection(db, 'laudos')),
      ]);

      if (!snapCli.empty) {
        const docs = snapCli.docs.map(d => d.data() as Cliente);
        setClientes(docs);
        saveStorage('vl_clientes', docs);
      }
      if (!snapAtv.empty) {
        const docs = snapAtv.docs.map(d => d.data() as Ativo);
        setAtivos(docs);
        saveStorage('vl_ativos', docs);
      }
      if (!snapOrc.empty) {
        const docs = snapOrc.docs.map(d => d.data() as Orcamento);
        setOrcamentos(docs);
        saveStorage('vl_orcamentos', docs);
      }
      if (!snapLau.empty) {
        const docs = snapLau.docs.map(d => d.data() as Laudo);
        setLaudos(docs);
        saveStorage('vl_laudos', docs);
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
    const id = `chk-${Date.now()}`;
    const numero = gerarNumeroChecklistCampo();
    const agora = new Date().toISOString();
    const novo: ChecklistCampo = {
      ...dados,
      id,
      numero,
      criadoEm: agora,
      atualizadoEm: agora,
    };
    setChecklistsCampo(prev => [novo, ...prev]);
    registrarLog('checklistsCampo', id, 'criar', `Checklist de Campo criado: ${numero} (${novo.tipoLaudoNome || novo.tipoLaudoId})`);

    if (db && auth?.currentUser) {
      try {
        setDoc(doc(db, 'checklistsCampo', id), novo).catch(err => {
          console.warn('Sync Firestore checklistCampo:', err);
        });
      } catch (e) {
        console.warn('Firestore write error:', e);
      }
    }
    return id;
  };

  const atualizarChecklistCampo = (id: string, dados: Partial<ChecklistCampo>) => {
    const agora = new Date().toISOString();
    setChecklistsCampo(prev => prev.map(c => c.id === id ? { ...c, ...dados, atualizadoEm: agora } : c));
    registrarLog('checklistsCampo', id, 'editar', `Checklist de Campo atualizado: ${id}`);

    if (db && auth?.currentUser) {
      try {
        setDoc(doc(db, 'checklistsCampo', id), { ...dados, atualizadoEm: agora }, { merge: true }).catch(err => {
          console.warn('Sync Firestore checklistCampo:', err);
        });
      } catch (e) {
        console.warn('Firestore write error:', e);
      }
    }
  };

  const removerChecklistCampo = (id: string) => {
    setChecklistsCampo(prev => prev.filter(c => c.id !== id));
    registrarLog('checklistsCampo', id, 'excluir', `Checklist de Campo excluído: ${id}`);
  };

  const finalizarChecklistCampo = (id: string, rubricaUrl?: string) => {
    const agora = new Date().toISOString();
    setChecklistsCampo(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'finalizado',
          rubricaUrl: rubricaUrl || c.rubricaUrl,
          rubricaTimestamp: rubricaUrl ? agora : c.rubricaTimestamp,
          atualizadoEm: agora
        };
      }
      return c;
    }));
    registrarLog('checklistsCampo', id, 'finalizar', `Checklist de Campo finalizado com assinatura de rubrica: ${id}`);
    if (db && auth?.currentUser) {
      try {
        setDoc(doc(db, 'checklistsCampo', id), {
          status: 'finalizado',
          ...(rubricaUrl ? { rubricaUrl, rubricaTimestamp: agora } : {}),
          atualizadoEm: agora
        }, { merge: true }).catch(err => console.warn('Firestore sync err:', err));
      } catch (e) {
        console.warn('Firestore err:', e);
      }
    }
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
        adicionarChecklistCampo,
        atualizarChecklistCampo,
        removerChecklistCampo,
        finalizarChecklistCampo,
        alternarPermitePreenchimentoPreliminar,
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
