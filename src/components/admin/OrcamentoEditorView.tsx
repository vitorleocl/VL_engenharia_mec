import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Eye, 
  EyeOff,
  Printer, 
  Download, 
  History, 
  RotateCcw, 
  AlertCircle, 
  FileText, 
  ChevronRight, 
  Layers, 
  Table as TableIcon, 
  HelpCircle, 
  ShieldCheck, 
  Check, 
  Building,
  Info,
  ExternalLink,
  ChevronLeft,
  Loader2,
  FileSpreadsheet,
  Users,
  Plus,
  Calculator
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Orcamento, OrcamentoSecao, OrcamentoHistorico, OrcamentoItemCalculo } from '../../types';
import { TipTapEditor } from './TipTapEditor';
import { PropostaViewerModal } from './PropostaViewerModal';
import { redimensionarImagemArquivo } from '../../lib/imageUtils';
import { 
  CHAVE_PIX_FORMATADA_PADRAO, 
  TITULAR_PIX_PADRAO, 
  QR_CODE_PIX_PADRAO_BASE64 
} from '../../lib/pixUtils';
import { 
  SECOES_PROPOSTA_DEFINICAO, 
  gerarSecoesPadraoOrcamento, 
  gerarSecoesPadraoOrcamentoV2,
  converterOrcamentoLegadoParaV2,
  converterPaginasParaSecoes,
  HTML_CARDS_CATALOGO_SERVICOS,
  obterTituloLaudoProposta,
  gerarCardClienteHtml,
  gerarHtmlEtapa2Metodologia,
  gerarHtmlEtapa3Investimento,
  gerarHtmlContatoAgradecimento,
  DADOS_VL_PADRAO,
  calcularValidadeAte
} from '../../lib/orcamentoTemplatePadrao';

export const OrcamentoEditorView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orcamentos, clientes, ativos, atualizarOrcamento, removerOrcamento } = useData();
  const { currentUser } = useAuth();

  // Find target quote
  const orcamentoOriginal = useMemo(() => {
    return orcamentos.find(o => o.id === id);
  }, [orcamentos, id]);

  const cliente = useMemo(() => {
    return clientes.find(c => c.id === orcamentoOriginal?.clienteId);
  }, [clientes, orcamentoOriginal]);

  const ativo = useMemo(() => {
    return ativos.find(a => a.id === orcamentoOriginal?.ativoId);
  }, [ativos, orcamentoOriginal]);

  // Working state for active quote
  const [orcamentoState, setOrcamentoState] = useState<Orcamento | null>(null);
  const [secaoAtivaId, setSecaoAtivaId] = useState<string>('capa');
  const [statusSalvo, setStatusSalvo] = useState<'salvo' | 'salvando' | 'alterado'>('salvo');
  const [horarioUltimoSalvo, setHorarioUltimoSalvo] = useState<string>('');
  
  // Modals & Drawers
  const [modalPdfAberto, setModalPdfAberto] = useState(false);
  const [drawerHistoricoAberto, setDrawerHistoricoAberto] = useState(false);
  const [modalModeloPadraoAberto, setModalModeloPadraoAberto] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);

  // File Inputs
  const capaFileInputRef = useRef<HTMLInputElement>(null);
  const secaoFotoInputRef = useRef<HTMLInputElement>(null);
  const pixQrCodeInputRef = useRef<HTMLInputElement>(null);
  const autoSaveTimerRef = useRef<any>(null);
  const carregarIdRef = useRef<string | null>(null);

  // Initialize orcamentoState with editable 13 sections
  useEffect(() => {
    if (!orcamentoOriginal) return;

    // Se já carregamos este orçamento no estado local e ele não mudou de rota/ID,
    // não sobrescrever o orcamentoState enquanto o usuário digita ou edita!
    if (carregarIdRef.current === orcamentoOriginal.id && orcamentoState) {
      return;
    }
    carregarIdRef.current = orcamentoOriginal.id;

    // Default memorial calculation items fallback
    const itensCalculoBase: OrcamentoItemCalculo[] = (orcamentoOriginal.itensCalculo && orcamentoOriginal.itensCalculo.length > 0)
      ? orcamentoOriginal.itensCalculo
      : [
          {
            id: 'item-1',
            descricao: orcamentoOriginal.servico || 'Serviços de Engenharia Mecânica & Laudo Pericial com ART CREA-PE',
            quantidade: 1,
            valorUnitario: orcamentoOriginal.valor || 0,
            valorTotal: orcamentoOriginal.valor || 0,
          }
        ];

    // If orcamento already has rich secoes, use them, ensuring Capa, Catalogo, Etapa 2, Etapa 3 and Contato are upgraded
    if (orcamentoOriginal.secoes && orcamentoOriginal.secoes.length > 0) {
      let alterou = false;
      const clienteNome = orcamentoOriginal.clienteNome || cliente?.razaoSocial || 'Cliente Corporativo';
      const cnpj = orcamentoOriginal.cnpjCliente || cliente?.cpfCnpj || 'Consulte o contrato';
      const primeiroContato = cliente?.contatos?.[0];
      const representante = orcamentoOriginal.representanteNome || primeiroContato?.nome || 'Diretoria / Coordenação Técnica';
      const localidade = orcamentoOriginal.localidadeServico || (cliente?.endereco?.cidade ? `${cliente.endereco.cidade}/${cliente.endereco.estado}` : 'Recife e Região Metropolitana - PE');
      const valor = orcamentoOriginal.valorFormatado || (orcamentoOriginal.valor ? orcamentoOriginal.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 3.500,00');
      const validade = orcamentoOriginal.validadeDias || 15;
      const prazo = orcamentoOriginal.prazoEntrega || `${orcamentoOriginal.prazoDias || 7} dias úteis`;
      const condicoes = orcamentoOriginal.condicoesPagamento || '50% de entrada na aprovação e 50% após emissão do laudo final e ART.';
      const normas = orcamentoOriginal.normasTecnicas || 'ABNT NBR, NR-11, NR-12, NR-13 conforme aplicável';
      const codigo = orcamentoOriginal.codigoProposta || orcamentoOriginal.id;
      const tituloLaudoDinamico = obterTituloLaudoProposta(orcamentoOriginal);

      const secoesAtualizadas = orcamentoOriginal.secoes.map((s) => {
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
            !s.conteudoHtml.includes('DADOS DO CLIENTE CONTRATANTE') ||
            s.conteudoHtml.includes('PROPOSTA TÉCNICA COMERCIAL // ORÇAMENTO DE ENGENHARIA') ||
            s.titulo.toLowerCase().includes('capa') ||
            s.subtitulo?.includes('RESPONSABILIDADE TÉCNICA');

          if (precisaAtualizar) {
            alterou = true;
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
          const precisaAtualizar = orcamentoOriginal.id === 'orc-1790444416499' ||
            !s.conteudoHtml ||
            s.conteudoHtml.includes('PLAYGROUNDS:') ||
            s.conteudoHtml.includes('ADEQUAÇÃO NR-12:') ||
            !s.conteudoHtml.includes('NR-12 • MÁQUINAS INDUSTRIAIS') ||
            !s.conteudoHtml.includes('grid-template-columns');

          if (precisaAtualizar) {
            alterou = true;
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
            alterou = true;
            return {
              ...s,
              titulo: 'Etapa 2 - Escopo Técnico das Atividades (Metodologia)',
              subtitulo: 'METODOLOGIA EM 5 FASES SEQUENCIAIS',
              conteudoHtml: gerarHtmlEtapa2Metodologia(normas),
            };
          }
        }

        if (isEtapa3) {
          if (!s.conteudoHtml || s.conteudoHtml.trim() === '' || !s.conteudoHtml.includes('Memorial de Cálculo')) {
            alterou = true;
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
                incluiNotaFiscal: orcamentoOriginal.incluiNotaFiscal !== false,
                chavePix: orcamentoOriginal.chavePix,
                itensCalculo: itensCalculoBase,
              }),
            };
          } else if (
            s.conteudoHtml.includes('Assinado Digitalmente') ||
            s.conteudoHtml.includes('Aceite Eletrônico') ||
            s.conteudoHtml.includes('• CREA-PE 182229949-0') ||
            s.conteudoHtml.includes('PIX IMEDIATO') ||
            s.conteudoHtml.includes('TRANSPARÊNCIA') ||
            s.conteudoHtml.includes('Relatório Colorido')
          ) {
            alterou = true;
            const limpo = s.conteudoHtml
              .replace(/<span[^>]*>[^<]*Assinado Digitalmente pelo Emissor[^<]*<\/span>/gi, '')
              .replace(/<span[^>]*>[^<]*\[Aceite Eletrônico \/ Assinatura Digital\][^<]*<\/span>/gi, '')
              .replace(/✓ Assinado Digitalmente pelo Emissor/g, '')
              .replace(/\[Aceite Eletrônico \/ Assinatura Digital\]/g, '')
              .replace(/Titular:\s*<strong>([^<]+)<\/strong>\s*•\s*CREA-PE\s*182229949-0/gi, 'Titular: <strong>$1</strong>')
              .replace(/<div style="text-align:\s*right;\s*flex-shrink:\s*0;">\s*<span[^>]*>[^<]*PIX IMEDIATO[^<]*<\/span>\s*<\/div>/gi, '')
              .replace(/<span[^>]*>[^<]*PIX IMEDIATO[^<]*<\/span>/gi, '')
              .replace(/<span[^>]*>[^<]*TRANSPARÊNCIA[^<]*<\/span>/gi, '')
              .replace(/Deslocamento e Relatório Colorido/g, 'Deslocamento e Laudo Completo');
            return { ...s, conteudoHtml: limpo };
          }
        }

        if (isContato) {
          if (!s.conteudoHtml || s.conteudoHtml.trim() === '' || s.conteudoHtml.includes('🤝') || !s.conteudoHtml.includes('HEADER HERO EXECUTIVO') || s.conteudoHtml.includes('Recife & Polo Industrial de Suape')) {
            alterou = true;
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

      const orcamentoCarregado: Orcamento = {
        ...orcamentoOriginal,
        incluiNotaFiscal: orcamentoOriginal.incluiNotaFiscal !== false,
        itensCalculo: itensCalculoBase,
        secoes: secoesAtualizadas,
      };

      setOrcamentoState(orcamentoCarregado);
      return;
    }

    // If it has paginasProposta, convert them to editable secoes
    if (orcamentoOriginal.paginasProposta && orcamentoOriginal.paginasProposta.length > 0) {
      const secoesConvertidas = converterPaginasParaSecoes(orcamentoOriginal.paginasProposta, orcamentoOriginal);
      const inicializado: Orcamento = {
        ...orcamentoOriginal,
        incluiNotaFiscal: orcamentoOriginal.incluiNotaFiscal !== false,
        itensCalculo: itensCalculoBase,
        secoes: secoesConvertidas,
      };
      setOrcamentoState(inicializado);
      return;
    }

    // Otherwise, generate the approved V2 6-sheet editable copy
    const secoesPadrao = orcamentoOriginal.layoutVersao === 'legado'
      ? gerarSecoesPadraoOrcamento(orcamentoOriginal, { cliente, ativo })
      : gerarSecoesPadraoOrcamentoV2(orcamentoOriginal, { cliente, ativo });
    const inicializado: Orcamento = {
      ...orcamentoOriginal,
      layoutVersao: orcamentoOriginal.layoutVersao || 'v2',
      incluiNotaFiscal: orcamentoOriginal.incluiNotaFiscal !== false,
      itensCalculo: itensCalculoBase,
      secoes: secoesPadrao,
    };
    setOrcamentoState(inicializado);
  }, [orcamentoOriginal?.id, cliente, ativo]);

  // Active section helper
  const secaoAtiva = useMemo(() => {
    if (!orcamentoState?.secoes) return null;
    return orcamentoState.secoes.find(s => s.id === secaoAtivaId) || orcamentoState.secoes[0];
  }, [orcamentoState, secaoAtivaId]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  // Immediate Save helper - passes the full updated budget to atualizarOrcamento
  const salvarImediato = useCallback((novoOrcamento: Orcamento, resumoAlteracao = 'Alterações salvas') => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    setOrcamentoState(novoOrcamento);
    setStatusSalvo('salvando');

    // Keep paginasProposta synchronized with secoes for backward compatibility
    const paginasSincronizadas = novoOrcamento.secoes?.map(s => ({
      numero: s.numero,
      titulo: s.titulo,
      subtitulo: s.subtitulo,
      conteudoHtml: s.conteudoHtml,
    })) || [];

    // History item
    const novoHistoricoItem: OrcamentoHistorico = {
      editadoEm: new Date().toISOString(),
      editadoPorUid: currentUser?.uid || 'master',
      editadoPorNome: currentUser?.nome || 'Eng. Vitor Leonardo',
      resumoAlteracao,
    };

    const historicoAtualizado = [
      novoHistoricoItem,
      ...(novoOrcamento.historico || []).slice(0, 19), // Keep last 20 revisions
    ];

    atualizarOrcamento(novoOrcamento.id, {
      ...novoOrcamento,
      paginasProposta: paginasSincronizadas,
      historico: historicoAtualizado,
    });

    setStatusSalvo('salvo');
    const now = new Date();
    setHorarioUltimoSalvo(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  }, [atualizarOrcamento, currentUser]);

  // Debounced Auto-Save
  const agendarAutoSave = useCallback((novoOrcamento: Orcamento, resumoAlteracao = 'Edição de conteúdo') => {
    setOrcamentoState(novoOrcamento);
    setStatusSalvo('alterado');

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      salvarImediato(novoOrcamento, resumoAlteracao);
    }, 800);
  }, [salvarImediato]);

  // Content change in active section
  const handleConteudoSecaoChange = (novoHtml: string) => {
    if (!orcamentoState?.secoes || !secaoAtiva) return;

    const novasSecoes = orcamentoState.secoes.map(s => {
      if (s.id === secaoAtiva.id) {
        return { ...s, conteudoHtml: novoHtml };
      }
      return s;
    });

    agendarAutoSave({
      ...orcamentoState,
      secoes: novasSecoes,
    }, `Edição na ${secaoAtiva.titulo}`);
  };

  // Section Title / Subtitle change
  const handleTituloSecaoChange = (novoTitulo: string, novoSubtitulo?: string) => {
    if (!orcamentoState?.secoes || !secaoAtiva) return;

    const novasSecoes = orcamentoState.secoes.map(s => {
      if (s.id === secaoAtiva.id) {
        return { ...s, titulo: novoTitulo, subtitulo: novoSubtitulo };
      }
      return s;
    });

    agendarAutoSave({
      ...orcamentoState,
      secoes: novasSecoes,
    }, `Título alterado na seção ${secaoAtiva.numero}`);
  };

  // Cover Image Upload Handler
  const handleCapaFotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !orcamentoState) return;

    try {
      setStatusSalvo('salvando');
      const resizedBase64 = await redimensionarImagemArquivo(file, 1200, 800, 0.85);

      const atualizado: Orcamento = {
        ...orcamentoState,
        imagemCapaUrl: resizedBase64,
        imagemCapaLegenda: orcamentoState.imagemCapaLegenda || 'Equipamento e Instalação em Avaliação Pericial',
      };

      agendarAutoSave(atualizado, 'Foto de capa atualizada');
    } catch (err: any) {
      console.error('Erro ao processar imagem de capa:', err);
      alert('Erro ao carregar imagem: ' + err.message);
    } finally {
      e.target.value = '';
    }
  };

  // Remove Cover Image
  const handleRemoverCapaFoto = () => {
    if (!orcamentoState) return;
    if (!window.confirm('Deseja remover a foto de capa desta proposta? O documento exibirá o espaço reservado neutro no PDF.')) {
      return;
    }

    const atualizado: Orcamento = {
      ...orcamentoState,
      imagemCapaUrl: undefined,
      imagemCapaLegenda: undefined,
    };

    agendarAutoSave(atualizado, 'Foto de capa removida');
  };

  // Quick photo insertion into current section
  const handleSecaoFotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !orcamentoState || !secaoAtiva) return;

    try {
      setStatusSalvo('salvando');
      const resizedBase64 = await redimensionarImagemArquivo(file, 1000, 750, 0.85);
      
      // Append photo card block to active section HTML
      const cardHtml = `
        <div class="my-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
          <img src="${resizedBase64}" alt="Registro de Campo" class="w-full max-h-72 object-contain mx-auto rounded-lg shadow-xs" />
          <p class="text-[11px] text-slate-500 font-mono mt-2 italic">Registro fotográfico do ativo / evidência de campo</p>
        </div>
      `;

      const conteudoAtual = secaoAtiva.conteudoHtml || '';
      const novoConteudo = `${conteudoAtual}${cardHtml}`;

      const novasSecoes = orcamentoState.secoes.map(s => {
        if (s.id === secaoAtiva.id) {
          return { ...s, conteudoHtml: novoConteudo };
        }
        return s;
      });

      agendarAutoSave({
        ...orcamentoState,
        secoes: novasSecoes,
      }, `Foto inserida na seção ${secaoAtiva.titulo}`);
    } catch (err: any) {
      alert('Falha ao inserir imagem: ' + err.message);
    } finally {
      e.target.value = '';
    }
  };

  // Atualizar dados cadastrais do cliente na Capa da Proposta
  const handleAtualizarDadosCapaCliente = (campo: 'clienteNome' | 'cnpjCliente' | 'representanteNome' | 'localidadeServico', valor: string) => {
    if (!orcamentoState) return;

    const atualizado: Orcamento = {
      ...orcamentoState,
      [campo]: valor,
    };

    const cliNome = campo === 'clienteNome' ? valor : (atualizado.clienteNome || cliente?.razaoSocial || 'Cliente Corporativo');
    const cnpjCli = campo === 'cnpjCliente' ? valor : (atualizado.cnpjCliente || cliente?.cpfCnpj || cliente?.cnpj || 'A preencher');
    const repNome = campo === 'representanteNome' ? valor : (atualizado.representanteNome || cliente?.contatos?.[0]?.nome || 'Diretoria / Coordenação Técnica');
    const loc = campo === 'localidadeServico' ? valor : (atualizado.localidadeServico || 'Recife e Região Metropolitana - PE');

    const novasSecoes = (atualizado.secoes || []).map(s => {
      if (s.id === 'capa' || s.numero === 1) {
        return {
          ...s,
          conteudoHtml: gerarCardClienteHtml({
            clienteNome: cliNome,
            cnpj: cnpjCli,
            representante: repNome,
            localidade: loc,
            codigo: atualizado.codigoProposta || atualizado.id,
            validade: atualizado.validadeDias || 15,
            prazo: atualizado.prazoEntrega || `${atualizado.prazoDias || 7} dias úteis`
          })
        };
      }
      return s;
    });

    atualizado.secoes = novasSecoes;
    agendarAutoSave(atualizado, `Dados do contratante atualizados na Capa (${campo})`);
  };

  const handleSincronizarComCadastroCliente = () => {
    if (!orcamentoState || !cliente) return;
    const cliNome = cliente.razaoSocial || cliente.nomeFantasia || orcamentoState.clienteNome || 'Cliente Corporativo';
    const cnpjCli = cliente.cpfCnpj || cliente.cnpj || orcamentoState.cnpjCliente || '';
    const repNome = cliente.contatos?.[0]?.nome || orcamentoState.representanteNome || 'Diretoria / Coordenação Técnica';
    const repCargo = cliente.contatos?.[0]?.cargo || orcamentoState.representanteCargo || '';
    const tel = cliente.contatos?.[0]?.telefone || orcamentoState.telefoneCliente || '';
    const email = cliente.contatos?.[0]?.email || orcamentoState.emailCliente || '';
    const loc = cliente.endereco?.cidade ? `${cliente.endereco.cidade}/${cliente.endereco.estado || 'PE'}` : orcamentoState.localidadeServico || 'Recife - PE';

    const atualizado: Orcamento = {
      ...orcamentoState,
      clienteNome: cliNome,
      cnpjCliente: cnpjCli,
      representanteNome: repNome,
      representanteCargo: repCargo,
      telefoneCliente: tel,
      emailCliente: email,
      localidadeServico: loc,
    };

    const novasSecoes = (atualizado.secoes || []).map(s => {
      if (s.id === 'capa' || s.numero === 1) {
        return {
          ...s,
          conteudoHtml: gerarCardClienteHtml({
            clienteNome: cliNome,
            cnpj: cnpjCli || 'A preencher',
            representante: repNome,
            localidade: loc,
            codigo: atualizado.codigoProposta || atualizado.id,
            validade: atualizado.validadeDias || 15,
            prazo: atualizado.prazoEntrega || `${atualizado.prazoDias || 7} dias úteis`
          })
        };
      }
      return s;
    });

    atualizado.secoes = novasSecoes;
    agendarAutoSave(atualizado, 'Dados sincronizados com o cadastro do cliente');
  };

  // Reset section to default template
  const handleRestaurarSecaoPadrao = () => {
    if (!orcamentoState?.secoes || !secaoAtiva) return;

    if (!window.confirm(`Tem certeza que deseja restaurar a ${secaoAtiva.titulo} para o texto original do modelo padrão? As edições personalizadas desta seção serão substituídas pelo padrão da VL Engenharia.`)) {
      return;
    }

    const secoesPadrao = orcamentoState.layoutVersao === 'v2'
      ? gerarSecoesPadraoOrcamentoV2(orcamentoState, { cliente, ativo })
      : gerarSecoesPadraoOrcamento(orcamentoState, { cliente, ativo });
    const secaoOriginal = secoesPadrao.find(s => s.id === secaoAtiva.id) || secoesPadrao[secaoAtiva.numero - 1];

    if (!secaoOriginal) return;

    const novasSecoes = orcamentoState.secoes.map(s => {
      if (s.id === secaoAtiva.id) {
        return {
          ...s,
          titulo: secaoOriginal.titulo,
          subtitulo: secaoOriginal.subtitulo,
          conteudoHtml: secaoOriginal.conteudoHtml,
        };
      }
      return s;
    });

    agendarAutoSave({
      ...orcamentoState,
      secoes: novasSecoes,
    }, `Restauração do texto padrão na seção ${secaoAtiva.numero}`);
  };

  // Convert legacy quote to approved V2 6-sheet layout
  const handleConverterParaV2 = () => {
    if (!orcamentoState) return;
    if (!window.confirm('Deseja converter este orçamento para o Novo Layout Aprovado (6 folhas A4)? Todos os dados do cliente, escopo, valores e memorial serão preservados na nova identidade visual vetorial.')) {
      return;
    }

    const convertido = converterOrcamentoLegadoParaV2(orcamentoState, { cliente, ativo });
    setOrcamentoState(convertido);
    setSecaoAtivaId('capa');
    salvarImediato(convertido, 'Proposta convertida com sucesso para o Novo Layout Aprovado (6 folhas A4)');
  };

  // Quick navigation
  const navegarSecaoRelativa = (direcao: 'ant' | 'prox') => {
    if (!orcamentoState?.secoes) return;
    const indexAtual = orcamentoState.secoes.findIndex(s => s.id === secaoAtivaId);
    if (direcao === 'ant' && indexAtual > 0) {
      setSecaoAtivaId(orcamentoState.secoes[indexAtual - 1].id);
    } else if (direcao === 'prox' && indexAtual < orcamentoState.secoes.length - 1) {
      setSecaoAtivaId(orcamentoState.secoes[indexAtual + 1].id);
    }
  };

  // Toggle visibility of a section in the exported PDF
  const handleToggleOcultarNoPdf = (secaoId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!orcamentoState?.secoes) return;

    const secaoAlvo = orcamentoState.secoes.find(s => s.id === secaoId);
    const novoOcultar = !secaoAlvo?.ocultarNoPdf;

    const novasSecoes = orcamentoState.secoes.map(s => {
      if (s.id === secaoId) {
        return { ...s, ocultarNoPdf: novoOcultar };
      }
      return s;
    });

    const secoesOcultas = novasSecoes.filter(s => s.ocultarNoPdf).map(s => s.id);

    const novoOrcamento: Orcamento = {
      ...orcamentoState,
      secoes: novasSecoes,
      secoesOcultasPdf: secoesOcultas,
    };

    setOrcamentoState(novoOrcamento);
    agendarAutoSave(novoOrcamento, `Seção "${secaoAlvo?.titulo}" ${novoOcultar ? 'oculta no PDF' : 'incluída no PDF'}`);
  };

  // Toggle Nota Fiscal (NFS-e)
  const handleToggleNotaFiscal = () => {
    if (!orcamentoState) return;
    const novoValor = !(orcamentoState.incluiNotaFiscal !== false);

    // If etapa3 exists, update section HTML with the new NFS-e text
    let novasSecoes = orcamentoState.secoes;
    if (novasSecoes) {
      novasSecoes = novasSecoes.map(s => {
        const isEtapa3 = s.id === 'etapa3' || (s.titulo && s.titulo.toLowerCase().includes('etapa 3'));
        if (isEtapa3) {
          const valorFormatado = (orcamentoState.valor ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
          const prazoFormatado = orcamentoState.prazoEntrega || `${orcamentoState.prazoDias || 7} dias úteis`;
          const condicoesFormatado = orcamentoState.condicoesPagamento || '50% de entrada e 50% após emissão do laudo final e ART.';

          return {
            ...s,
            conteudoHtml: gerarHtmlEtapa3Investimento({
              valor: valorFormatado,
              prazo: prazoFormatado,
              condicoes: condicoesFormatado,
              validade: orcamentoState.validadeDias || 15,
              clienteNome: orcamentoState.clienteNome || cliente?.razaoSocial || 'Cliente',
              representante: orcamentoState.representanteNome || 'Diretoria / Coordenação Técnica',
              incluiNotaFiscal: novoValor,
              chavePix: orcamentoState.chavePix || '10287093409',
              itensCalculo: orcamentoState.itensCalculo,
            }),
          };
        }
        return s;
      });
    }

    const atualizado: Orcamento = {
      ...orcamentoState,
      incluiNotaFiscal: novoValor,
      secoes: novasSecoes,
    };
    salvarImediato(atualizado, `Nota Fiscal alterada para: ${novoValor ? 'Inclusa (NFS-e)' : 'Não inclusa (Recibo + ART)'}`);
  };

  // Synchronize Etapa 3 with PIX QR Code and current terms
  const handleSincronizarEtapa3 = () => {
    if (!orcamentoState?.secoes) return;
    const valorFormatado = (orcamentoState.valor ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const prazoFormatado = orcamentoState.prazoEntrega || `${orcamentoState.prazoDias || 7} dias úteis`;
    const condicoesFormatado = orcamentoState.condicoesPagamento || '50% de entrada e 50% após emissão do laudo final e ART.';

    const novoHtml = gerarHtmlEtapa3Investimento({
      valor: valorFormatado,
      prazo: prazoFormatado,
      condicoes: condicoesFormatado,
      validade: orcamentoState.validadeDias || 15,
      clienteNome: orcamentoState.clienteNome || cliente?.razaoSocial || 'Cliente',
      representante: orcamentoState.representanteNome || 'Diretoria / Coordenação Técnica',
      incluiNotaFiscal: orcamentoState.incluiNotaFiscal !== false,
      chavePix: orcamentoState.chavePix || '10287093409',
      itensCalculo: orcamentoState.itensCalculo,
    });

    const novasSecoes = orcamentoState.secoes.map(s => {
      if (s.id === 'etapa3' || (s.titulo && s.titulo.toLowerCase().includes('etapa 3'))) {
        return { ...s, conteudoHtml: novoHtml };
      }
      return s;
    });

    const atualizado: Orcamento = {
      ...orcamentoState,
      secoes: novasSecoes,
    };
    salvarImediato(atualizado, 'Etapa 3 sincronizada com Memorial de Cálculo e PIX');
  };

  // Restore Etapa 2 (Metodologia) to default clean cards
  const handleRestaurarEtapa2 = () => {
    if (!orcamentoState?.secoes) return;
    const novoHtml = gerarHtmlEtapa2Metodologia(orcamentoState.normasTecnicas);
    const novasSecoes = orcamentoState.secoes.map(s => {
      if (s.id === 'etapa2' || (s.titulo && (s.titulo.toLowerCase().includes('etapa 2') || s.titulo.toLowerCase().includes('metodologia')))) {
        return { 
          ...s, 
          titulo: 'Etapa 2 - Escopo Técnico das Atividades (Metodologia)',
          conteudoHtml: novoHtml 
        };
      }
      return s;
    });
    const atualizado: Orcamento = { ...orcamentoState, secoes: novasSecoes };
    salvarImediato(atualizado, 'Metodologia (Etapa 2) restaurada para formatação padrão em 5 fases');
  };

  // Memorial de Cálculo itens
  const itensCalculo: OrcamentoItemCalculo[] = useMemo(() => {
    if (orcamentoState?.itensCalculo && orcamentoState.itensCalculo.length > 0) {
      return orcamentoState.itensCalculo;
    }
    const valorPadrao = orcamentoState?.valor || 0;
    return [
      {
        id: 'item-1',
        descricao: orcamentoState?.servico || 'Serviços de Engenharia Mecânica & Laudo Pericial com ART CREA-PE',
        quantidade: 1,
        valorUnitario: valorPadrao,
        valorTotal: valorPadrao,
      }
    ];
  }, [orcamentoState?.itensCalculo, orcamentoState?.valor, orcamentoState?.servico]);

  const handleAtualizarListaItens = (novaLista: OrcamentoItemCalculo[], salvarDireto = false) => {
    if (!orcamentoState) return;
    const novoTotal = novaLista.reduce((acc, it) => acc + (Number(it.valorTotal) || 0), 0);
    const valorFormatado = novoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const prazoFormatado = orcamentoState.prazoEntrega || `${orcamentoState.prazoDias || 7} dias úteis`;
    const condicoesFormatado = orcamentoState.condicoesPagamento || '50% de entrada e 50% após emissão do laudo final e ART.';

    const novoHtmlEtapa3 = gerarHtmlEtapa3Investimento({
      valor: valorFormatado,
      prazo: prazoFormatado,
      condicoes: condicoesFormatado,
      validade: orcamentoState.validadeDias || 15,
      clienteNome: orcamentoState.clienteNome || cliente?.razaoSocial || 'Cliente',
      representante: orcamentoState.representanteNome || 'Diretoria / Coordenação Técnica',
      incluiNotaFiscal: orcamentoState.incluiNotaFiscal !== false,
      chavePix: orcamentoState.chavePix || '10287093409',
      itensCalculo: novaLista,
    });

    const novasSecoes = (orcamentoState.secoes || []).map(s => {
      if (s.id === 'etapa3' || (s.titulo && s.titulo.toLowerCase().includes('etapa 3'))) {
        return { ...s, conteudoHtml: novoHtmlEtapa3 };
      }
      return s;
    });

    const atualizado: Orcamento = {
      ...orcamentoState,
      valor: novoTotal,
      valorFormatado,
      itensCalculo: novaLista,
      secoes: novasSecoes,
    };

    if (salvarDireto) {
      salvarImediato(atualizado, `Memorial de cálculo atualizado: ${novaLista.length} item(ns), Total: ${valorFormatado}`);
    } else {
      agendarAutoSave(atualizado, `Memorial de cálculo atualizado: ${novaLista.length} item(ns), Total: ${valorFormatado}`);
    }
  };

  const handleAdicionarItemCalculo = () => {
    const novoItem: OrcamentoItemCalculo = {
      id: `item-${Date.now()}`,
      descricao: '',
      quantidade: 1,
      valorUnitario: 0,
      valorTotal: 0,
    };
    handleAtualizarListaItens([...itensCalculo, novoItem], true);
  };

  const handleRemoverItemCalculo = (itemId: string) => {
    if (itensCalculo.length <= 1) {
      const resetado = [{
        id: 'item-1',
        descricao: orcamentoState?.servico || 'Serviços Técnicos Especializados de Engenharia',
        quantidade: 1,
        valorUnitario: 0,
        valorTotal: 0,
      }];
      handleAtualizarListaItens(resetado, true);
      return;
    }
    const novaLista = itensCalculo.filter(it => it.id !== itemId);
    handleAtualizarListaItens(novaLista, true);
  };

  const handleEditarItemCalculo = (itemId: string, campo: 'descricao' | 'quantidade' | 'valorUnitario', val: any) => {
    const novaLista = itensCalculo.map(it => {
      if (it.id === itemId) {
        const atualizado = { ...it, [campo]: val };
        const q = campo === 'quantidade' ? (Number(val) || 0) : (Number(it.quantidade) || 1);
        const u = campo === 'valorUnitario' ? (Number(val) || 0) : (Number(it.valorUnitario) || 0);
        atualizado.valorTotal = q * u;
        return atualizado;
      }
      return it;
    });
    handleAtualizarListaItens(novaLista, false);
  };

  // Upload custom QR code image for PIX
  const handleUploadPixQrCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !orcamentoState) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (!result) return;

      const novasSecoes = (orcamentoState.secoes || []).map(s => {
        const isEtapa3 = s.id === 'etapa3' || (s.titulo && s.titulo.toLowerCase().includes('etapa 3'));
        if (isEtapa3 && s.conteudoHtml) {
          const novoHtml = s.conteudoHtml.replace(
            /<img[^>]*alt="QR Code PIX[^>]*>/gi,
            `<img src="${result}" alt="QR Code PIX CPF" style="width: 76px; height: 76px; display: block; border-radius: 6px; object-fit: contain;" />`
          );
          return { ...s, conteudoHtml: novoHtml };
        }
        return s;
      });

      const atualizado: Orcamento = {
        ...orcamentoState,
        secoes: novasSecoes,
        qrCodePixUrl: result,
      };
      setOrcamentoState(atualizado);
      agendarAutoSave(atualizado, 'Imagem do QR Code do PIX atualizada com sucesso');
    };
    reader.readAsDataURL(file);
  };

  // Computed section visibility metrics
  const { totalSecoes, secoesVisiveisCount, secoesOcultasCount } = useMemo(() => {
    const total = orcamentoState?.secoes?.length || 13;
    const ocultas = orcamentoState?.secoes?.filter(s => s.ocultarNoPdf || orcamentoState.secoesOcultasPdf?.includes(s.id)).length || 0;
    return {
      totalSecoes: total,
      secoesVisiveisCount: Math.max(1, total - ocultas),
      secoesOcultasCount: ocultas,
    };
  }, [orcamentoState]);

  if (!orcamentoState) {
    return (
      <div className="p-8 text-center space-y-4 max-w-md mx-auto">
        <div className="p-3 bg-amber-100 text-amber-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Orçamento não encontrado</h2>
        <p className="text-xs text-slate-500">O orçamento solicitado pode ter sido removido ou não existe.</p>
        <Link
          to="/admin/orcamentos"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1565D8] hover:bg-[#0b4fb8] text-white text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Orçamentos</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-12">
      
      {/* Hidden File Inputs */}
      <input 
        type="file" 
        ref={capaFileInputRef} 
        onChange={handleCapaFotoUpload} 
        accept="image/*" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={secaoFotoInputRef} 
        onChange={handleSecaoFotoUpload} 
        accept="image/*" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={pixQrCodeInputRef} 
        onChange={handleUploadPixQrCode} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Top Banner & Action Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Title & Metadata */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              to="/admin/orcamentos"
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              title="Voltar para a lista"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-[#1565D8] border border-blue-200 uppercase">
              {orcamentoState.codigoProposta || orcamentoState.id}
            </span>
            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Status:</span>
              <select
                value={orcamentoState.status}
                onChange={(e) => {
                  const novoStatus = e.target.value as Orcamento['status'];
                  setOrcamentoState(prev => prev ? { ...prev, status: novoStatus } : prev);
                  atualizarOrcamento(orcamentoState.id, { status: novoStatus });
                }}
                className={`text-[11px] font-extrabold uppercase rounded px-1.5 py-0.5 border cursor-pointer ${
                  orcamentoState.status === 'aprovado'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : orcamentoState.status === 'enviado'
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : orcamentoState.status === 'recusado'
                    ? 'bg-red-100 text-red-800 border-red-300'
                    : 'bg-slate-200 text-slate-700 border-slate-300'
                }`}
              >
                <option value="rascunho">Rascunho</option>
                <option value="enviado">Enviada</option>
                <option value="aprovado">Aprovada</option>
                <option value="recusado">Recusada</option>
              </select>
            </div>
          </div>

          <h1 className="text-lg sm:text-xl font-extrabold text-[#0B1E3D] flex items-center gap-2">
            <span>Editor Rico da Proposta Técnico-Comercial</span>
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <span>Cliente: <strong className="text-slate-900">{orcamentoState.clienteNome || 'Cliente Corporativo'}</strong></span>
            <span>•</span>
            <span>Serviço: <strong className="text-slate-900">{orcamentoState.servico}</strong></span>
            <span>•</span>
            <span>Valor: <strong className="text-[#1565D8] font-mono">{(orcamentoState.valor ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></span>
          </div>

          {/* Quick Selectable Nota Fiscal & PIX Indicator */}
          <div className="flex flex-wrap items-center gap-2 pt-1.5">
            <button
              type="button"
              onClick={handleToggleNotaFiscal}
              className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                orcamentoState.incluiNotaFiscal !== false
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
              title="Clique para alternar entre proposta Com Nota Fiscal (NFS-e) ou Sem Nota Fiscal (Recibo com ART)"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>Nota Fiscal:</span>
              <span className="font-extrabold uppercase text-[10px]">
                {orcamentoState.incluiNotaFiscal !== false ? '✓ Inclusa (Com NFS-e)' : '✕ Sem NFS-e (Recibo + ART)'}
              </span>
            </button>
            
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50/80 border border-blue-200 text-xs text-[#0B1E3D]">
              <span className="font-bold text-[#1565D8]">PIX Padrão (CPF):</span>
              <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-blue-200 text-[11px] text-[#0B1E3D]">{CHAVE_PIX_FORMATADA_PADRAO}</code>
            </div>
          </div>
        </div>

        {/* Status indicator & Right Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          {/* Botão Salvar Proposta Manual Imediato */}
          <button
            type="button"
            onClick={() => orcamentoState && salvarImediato(orcamentoState, 'Salvo manualmente pelo usuário')}
            disabled={statusSalvo === 'salvando'}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            title="Salvar todas as alterações da proposta agora"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{statusSalvo === 'salvando' ? 'Salvando...' : 'Salvar Proposta'}</span>
          </button>

          {/* Autosave Status Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            {statusSalvo === 'salvando' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                <span className="text-blue-700 font-semibold">Salvando no Firestore...</span>
              </>
            ) : statusSalvo === 'alterado' ? (
              <>
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-amber-700 font-semibold">Alterações pendentes</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-slate-600 font-medium">
                  Salvo {horarioUltimoSalvo ? `às ${horarioUltimoSalvo}` : 'automaticamente'}
                </span>
              </>
            )}
          </div>

          {/* History Button */}
          <button
            onClick={() => setDrawerHistoricoAberto(true)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Ver histórico de alterações"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Histórico</span>
          </button>

          {/* Master Rule 1.1: Template reference button */}
          <button
            onClick={() => setModalModeloPadraoAberto(true)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Consultar modelo padrão institucional (intocado)"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="hidden md:inline">Modelo Base</span>
          </button>

          {/* Convert to V2 button or V2 active badge */}
          {orcamentoState.layoutVersao !== 'v2' ? (
            <button
              onClick={handleConverterParaV2}
              className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              title="Converter para o novo layout aprovado da VL Engenharia (6 folhas A4)"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Converter p/ Novo Modelo (6 fls)</span>
            </button>
          ) : (
            <span className="px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Modelo Aprovado (6 Folhas A4)</span>
              <span className="sm:hidden">6 Folhas</span>
            </span>
          )}

          {/* Direct Print / Export Route Link */}
          <Link
            to={`/admin/orcamentos/${orcamentoState.id}/imprimir?auto=1`}
            target="_blank"
            className="p-2 rounded-xl border border-blue-200 hover:bg-blue-50 text-[#1565D8] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Abrir impressão nativa direta em nova aba"
          >
            <Printer className="w-4 h-4 text-[#1565D8]" />
            <span className="hidden lg:inline">Imprimir Direto</span>
          </Link>

          {/* View / Export PDF Button */}
          <button
            onClick={() => setModalPdfAberto(true)}
            className="px-4 py-2 rounded-xl bg-[#0B1E3D] hover:bg-[#1565D8] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#D4AF37]" />
            <span>Exportar / Imprimir PDF ({secoesVisiveisCount} págs)</span>
          </button>

          {/* Excluir Orçamento */}
          <button
            onClick={() => setModalExcluirAberto(true)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 hover:border-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Excluir este orçamento definitivamente"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
            <span className="hidden sm:inline">Excluir</span>
          </button>

        </div>

      </div>

      {/* Notice of Instance Isolation (Regra Crítica 1.1) */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <p>
            <strong>Edição de Instância Isolada:</strong> As alterações feitas nesta tela aplicam-se exclusivamente a este orçamento. O modelo padrão da VL Engenharia e as credenciais fixas permanecem preservados para novos orçamentos.
          </p>
        </div>
        <span className="hidden lg:inline text-[11px] font-mono text-blue-700">
          {secoesVisiveisCount} de {totalSecoes} páginas ativas no PDF
        </span>
      </div>

      {/* Main Workspace: Left Sidebar (13 Sections) + Right Editor Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Sidebar: 13 Pages Navigator (4 cols on lg) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 sticky top-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-[#0B1E3D] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#1565D8]" />
                <span>Seções da Proposta</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                {secoesVisiveisCount} no PDF {secoesOcultasCount > 0 && <span className="text-amber-600 font-bold">• {secoesOcultasCount} oculta{secoesOcultasCount > 1 ? 's' : ''}</span>}
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {totalSecoes} seções
            </span>
          </div>

          {/* Sections List */}
          <div className="space-y-1.5 max-h-[70vh] overflow-y-auto pr-1">
            {orcamentoState.secoes?.map((secao) => {
              const isActive = secao.id === secaoAtivaId;
              const hasCover = secao.id === 'capa' && Boolean(orcamentoState.imagemCapaUrl);
              const isOculta = Boolean(secao.ocultarNoPdf || orcamentoState.secoesOcultasPdf?.includes(secao.id));

              return (
                <div
                  key={secao.id}
                  onClick={() => setSecaoAtivaId(secao.id)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start justify-between gap-2 cursor-pointer ${
                    isActive
                      ? isOculta
                        ? 'bg-amber-50/70 border-amber-400 shadow-xs ring-1 ring-amber-400/50'
                        : 'bg-blue-50/80 border-[#1565D8] shadow-xs'
                      : isOculta
                      ? 'bg-slate-50/60 hover:bg-amber-50/40 border-dashed border-amber-300/80 text-slate-600'
                      : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <span className={`w-6 h-6 rounded-lg font-mono text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5 ${
                      isActive 
                        ? isOculta ? 'bg-amber-600 text-white' : 'bg-[#1565D8] text-white' 
                        : isOculta ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {secao.numero}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className={`text-xs font-bold truncate ${isActive ? 'text-[#0B1E3D]' : 'text-slate-800'}`}>
                          {secao.titulo}
                        </p>
                        {isOculta && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            Oculta no PDF
                          </span>
                        )}
                      </div>
                      {secao.subtitulo && (
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {secao.subtitulo}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions & PDF Toggle */}
                  <div className="shrink-0 flex items-center gap-1 mt-0.5">
                    {hasCover && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" title="Foto de capa anexada" />
                    )}

                    {/* Quick Visibility Toggle Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleOcultarNoPdf(secao.id, e)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isOculta
                          ? 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-800'
                          : 'bg-slate-100/80 hover:bg-slate-200 border-slate-200 text-slate-500 hover:text-slate-800'
                      }`}
                      title={isOculta ? 'Seção oculta do PDF. Clique para incluir.' : 'Seção incluída no PDF. Clique para ocultar.'}
                    >
                      {isOculta ? (
                        <EyeOff className="w-3.5 h-3.5 text-amber-700" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </button>

                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-[#1565D8]' : 'text-slate-300'}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Pagination footer */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => navegarSecaoRelativa('ant')}
              className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-30"
              disabled={orcamentoState.secoes?.findIndex(s => s.id === secaoAtivaId) === 0}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>
            <span className="text-[11px] text-slate-400 font-mono">
              Página {secaoAtiva?.numero} de {orcamentoState.secoes?.length || 13}
            </span>
            <button
              onClick={() => navegarSecaoRelativa('prox')}
              className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-30"
              disabled={orcamentoState.secoes?.findIndex(s => s.id === secaoAtivaId) === (orcamentoState.secoes?.length || 13) - 1}
            >
              <span>Próxima</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Main Editor Section (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Section Header Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-[#0B1E3D] text-white font-mono text-sm font-black flex items-center justify-center">
                  {secaoAtiva?.numero}
                </span>
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-[#1565D8] tracking-wider">
                    SEÇÃO {secaoAtiva?.numero} DE 13 • PROPOSTA COMERCIAL
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-[#0B1E3D]">
                    {secaoAtiva?.titulo}
                  </h2>
                </div>
              </div>

              {/* Action buttons for active section */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                
                {/* PDF Visibility Toggle Button */}
                <button
                  type="button"
                  onClick={(e) => secaoAtiva && handleToggleOcultarNoPdf(secaoAtiva.id, e)}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    secaoAtiva?.ocultarNoPdf
                      ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-800'
                      : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-800'
                  }`}
                  title={
                    secaoAtiva?.ocultarNoPdf
                      ? 'Esta seção está oculta no PDF. Clique para exibi-la no documento gerado.'
                      : 'Esta seção está visível no PDF. Clique para ocultá-la do documento gerado.'
                  }
                >
                  {secaoAtiva?.ocultarNoPdf ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                      <span>Oculta no PDF</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Incluída no PDF</span>
                    </>
                  )}
                </button>

                {/* Reset to template */}
                <button
                  onClick={handleRestaurarSecaoPadrao}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Restaurar esta seção para o texto do modelo padrão"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Restaurar Padrão</span>
                </button>

                {/* Quick Add photo for section */}
                <button
                  onClick={() => secaoFotoInputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-100 text-[#1565D8] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Inserir foto adicional de levantamento fotográfico nesta seção"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Inserir Imagem</span>
                </button>

              </div>
            </div>

            {/* Warning banner when active section is hidden from PDF */}
            {secaoAtiva?.ocultarNoPdf && (
              <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-300 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start sm:items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-200 text-amber-800 shrink-0 mt-0.5 sm:mt-0">
                    <EyeOff className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-amber-950 font-extrabold text-xs">Esta seção não será impressa nem gerada no PDF</strong>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      Você pode editá-la livremente. Na exportação em PDF, ela será excluída e as demais páginas serão renumeradas automaticamente.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleToggleOcultarNoPdf(secaoAtiva.id, e)}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-2xs transition-colors self-start sm:self-auto"
                >
                  Reativar no PDF
                </button>
              </div>
            )}

            {/* SPECIAL CASE: Page 1 (Capa com Imagem de Capa do Orçamento) */}
            {secaoAtiva?.id === 'capa' && (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-[#0B1E3D] uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#1565D8]" />
                      <span>Foto de Capa da Proposta Comercial</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Foto do ativo inspecionado, fachada industrial do cliente ou foto institucional da VL Engenharia.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => capaFileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-[#1565D8] hover:bg-[#0b4fb8] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{orcamentoState.imagemCapaUrl ? 'Trocar Imagem de Capa' : 'Inserir Imagem de Capa'}</span>
                    </button>

                    {orcamentoState.imagemCapaUrl && (
                      <button
                        onClick={handleRemoverCapaFoto}
                        className="p-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors cursor-pointer"
                        title="Remover foto de capa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Cover Image Preview or Neutral Placeholder */}
                {orcamentoState.imagemCapaUrl ? (
                  <div className="space-y-2">
                    <div className="relative rounded-xl overflow-hidden border-2 border-slate-300 bg-black/5 max-h-72 flex items-center justify-center">
                      <img 
                        src={orcamentoState.imagemCapaUrl} 
                        alt="Capa da Proposta Comercial" 
                        className="w-full max-h-64 object-cover"
                      />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono font-bold">
                        Redimensionada e Otimizada
                      </span>
                    </div>

                    {/* Cover Caption */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-600 shrink-0">Legenda da Capa:</span>
                      <input
                        type="text"
                        value={orcamentoState.imagemCapaLegenda || ''}
                        onChange={(e) => {
                          const leg = e.target.value;
                          setOrcamentoState(prev => prev ? { ...prev, imagemCapaLegenda: leg } : null);
                          agendarAutoSave({
                            ...orcamentoState,
                            imagemCapaLegenda: leg,
                          }, 'Legenda da foto de capa atualizada');
                        }}
                        placeholder="Ex: Pátio fabril e máquinas objeto da avaliação técnica..."
                        className="flex-1 px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#1565D8]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-6 border-2 border-dashed border-slate-300 rounded-xl text-center bg-white space-y-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-700">
                      Nenhuma imagem de capa inserida
                    </p>
                    <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                      A proposta exibirá um espaço neutro de engenharia sem quebrar o layout no PDF. Clique no botão acima para adicionar a foto do ativo ou local.
                    </p>
                  </div>
                )}

                {/* Card de Dados do Cliente Contratante na Capa (Preenchimento Automático) */}
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-3 mt-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-blue-200/60">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#1565D8] text-white">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#0B1E3D] uppercase tracking-wider">
                          Dados do Cliente Contratante (Capa da Proposta)
                        </h4>
                        <p className="text-[11px] text-slate-600">
                          Preenchido automaticamente a partir do cadastro do cliente. Edite aqui ou sincronize a qualquer momento.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSincronizarComCadastroCliente}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-100 text-[#1565D8] border border-blue-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
                      title="Atualiza estes campos com os dados mais recentes do cadastro do cliente"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#1565D8]" />
                      <span>Sincronizar com Cadastro</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Razão Social / Nome do Cliente
                      </label>
                      <input
                        type="text"
                        value={orcamentoState.clienteNome || ''}
                        onChange={(e) => handleAtualizarDadosCapaCliente('clienteNome', e.target.value)}
                        placeholder="Ex: ADF Centro Automotivo LTDA"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#1565D8]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        CNPJ / CPF do Contratante
                      </label>
                      <input
                        type="text"
                        value={orcamentoState.cnpjCliente || ''}
                        onChange={(e) => handleAtualizarDadosCapaCliente('cnpjCliente', e.target.value)}
                        placeholder="Ex: 24.417.065/0001-03"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#1565D8]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Principal Contato / Representante
                      </label>
                      <input
                        type="text"
                        value={orcamentoState.representanteNome || ''}
                        onChange={(e) => handleAtualizarDadosCapaCliente('representanteNome', e.target.value)}
                        placeholder="Ex: Thiago Cunha"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#1565D8]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Localidade / Unidade
                      </label>
                      <input
                        type="text"
                        value={orcamentoState.localidadeServico || ''}
                        onChange={(e) => handleAtualizarDadosCapaCliente('localidadeServico', e.target.value)}
                        placeholder="Ex: Caruaru/PE ou Recife/PE"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#1565D8]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SPECIAL CASE: Etapa 2 (Escopo Técnico das Atividades - Metodologia) */}
            {(secaoAtiva?.id === 'etapa2' || secaoAtiva?.numero === 10 || (secaoAtiva?.titulo && (secaoAtiva.titulo.toLowerCase().includes('etapa 2') || secaoAtiva.titulo.toLowerCase().includes('metodologia')))) && (
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/70 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-600 text-white shrink-0">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0B1E3D] uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span>Metodologia Sequencial de Engenharia (5 Fases)</span>
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Vistoria in loco, checklists normativos, instrumentação/ensaios, laudo pericial conclusivo e homologação de ART.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRestaurarEtapa2}
                    className="px-3 py-1.5 rounded-lg bg-[#0B1E3D] hover:bg-[#1565D8] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors shrink-0"
                    title="Restaura a formatação inicial estilizada em cards para a Metodologia"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Restaurar Formatação Padrão</span>
                  </button>
                </div>
              </div>
            )}

            {/* SPECIAL CASE: Etapa 3 (Investimento, Pagamento, PIX e Nota Fiscal + Memorial de Cálculo) */}
            {(secaoAtiva?.id === 'etapa3' || secaoAtiva?.numero === 12 || (secaoAtiva?.titulo && secaoAtiva.titulo.toLowerCase().includes('etapa 3'))) && (
              <div className="space-y-4">
                {/* Memorial de Cálculo Interativo */}
                <div className="p-4 rounded-xl border border-blue-200 bg-white space-y-3 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-blue-100 text-[#1565D8]">
                        <Calculator className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#0B1E3D] uppercase tracking-wider">
                          Memorial de Cálculo da Proposta (Detalhamento por Ativo / Serviço)
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Preço unitário por ativo/serviço, quantidade e soma automática do valor total do laudo.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => orcamentoState && salvarImediato(orcamentoState, 'Memorial de cálculo salvo')}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
                        title="Salvar alterações do Memorial de Cálculo imediatamente"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Salvar Tabela</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleAdicionarItemCalculo}
                        className="px-2.5 py-1.5 rounded-lg bg-[#1565D8] hover:bg-[#0e489e] text-white text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar Linha / Ativo</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-600 bg-slate-50 text-[11px] uppercase">
                          <th className="py-2 px-2.5 font-bold w-10 text-center">#</th>
                          <th className="py-2 px-2.5 font-bold">Descrição do Ativo ou Escopo de Serviço</th>
                          <th className="py-2 px-2.5 font-bold w-24 text-center">Qtd</th>
                          <th className="py-2 px-2.5 font-bold w-36 text-right">Unitário (R$)</th>
                          <th className="py-2 px-2.5 font-bold w-36 text-right">Subtotal (R$)</th>
                          <th className="py-2 px-2.5 font-bold w-12 text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {itensCalculo.map((it, idx) => (
                          <tr key={it.id} className="hover:bg-slate-50/70">
                            <td className="py-2 px-2.5 text-center font-mono text-slate-400 font-bold">
                              {idx + 1}
                            </td>
                            <td className="py-2 px-2.5">
                              <input
                                type="text"
                                value={it.descricao}
                                onChange={(e) => handleEditarItemCalculo(it.id, 'descricao', e.target.value)}
                                onBlur={() => handleAtualizarListaItens(itensCalculo, true)}
                                placeholder="Ex: Inspeção e Laudo de Caminhão Munck placa PGX7098 com ensaio LP"
                                className="w-full px-2 py-1 rounded border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#1565D8]"
                              />
                            </td>
                            <td className="py-2 px-2.5">
                              <input
                                type="number"
                                min={1}
                                value={it.quantidade || 1}
                                onChange={(e) => handleEditarItemCalculo(it.id, 'quantidade', Math.max(1, parseInt(e.target.value, 10) || 1))}
                                onBlur={() => handleAtualizarListaItens(itensCalculo, true)}
                                className="w-full px-2 py-1 rounded border border-slate-200 text-xs font-mono text-center text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#1565D8]"
                              />
                            </td>
                            <td className="py-2 px-2.5">
                              <input
                                type="number"
                                step="any"
                                min={0}
                                value={it.valorUnitario === 0 ? '' : it.valorUnitario}
                                placeholder="0,00"
                                onChange={(e) => handleEditarItemCalculo(it.id, 'valorUnitario', e.target.value === '' ? 0 : (parseFloat(e.target.value) || 0))}
                                onBlur={() => handleAtualizarListaItens(itensCalculo, true)}
                                className="w-full px-2 py-1 rounded border border-slate-200 text-xs font-mono text-right text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#1565D8]"
                              />
                            </td>
                            <td className="py-2 px-2.5 text-right font-mono font-bold text-[#0B1E3D]">
                              {(it.valorTotal || (it.quantidade * it.valorUnitario)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </td>
                            <td className="py-2 px-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoverItemCalculo(it.id)}
                                className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                                title="Remover linha"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-blue-50/80 border-t-2 border-[#0B1E3D] font-bold">
                          <td colSpan={4} className="py-2.5 px-3 text-right text-slate-800 uppercase text-[11px]">
                            Valor Total da Proposta (Soma das Linhas):
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-sm text-[#1565D8]">
                            {(orcamentoState.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Bloco de Faturamento PIX & Nota Fiscal */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* QR Code thumbnail com preview e botão de troca */}
                      <div className="relative group bg-white p-1.5 rounded-lg border border-emerald-300 shadow-2xs shrink-0 text-center">
                        <img 
                          src={orcamentoState.qrCodePixUrl || QR_CODE_PIX_PADRAO_BASE64} 
                          alt="QR Code PIX CPF" 
                          className="w-14 h-14 block object-contain mx-auto" 
                        />
                        <span className="text-[7.5px] font-bold text-emerald-800 font-mono block mt-0.5">
                          {orcamentoState.qrCodePixUrl ? 'QR CUSTOM' : 'QR OFICIAL'}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-[#0B1E3D] uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Chave PIX & Nota Fiscal da Proposta</span>
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          Chave PIX (CPF): <strong className="font-mono text-emerald-950 font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-200">{CHAVE_PIX_FORMATADA_PADRAO}</strong>
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Titular: {TITULAR_PIX_PADRAO}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Botão para carregar/trocar imagem do QR Code do PIX */}
                      <button
                        type="button"
                        onClick={() => pixQrCodeInputRef.current?.click()}
                        className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                        title="Clique para selecionar a imagem do seu QR Code PIX (PNG/JPG)"
                      >
                        <Upload className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{orcamentoState.qrCodePixUrl ? 'Substituir Imagem QR' : 'Inserir Imagem do QR Code'}</span>
                      </button>

                      {/* Nota Fiscal Selectable Toggle */}
                      <button
                        type="button"
                        onClick={handleToggleNotaFiscal}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors ${
                          orcamentoState.incluiNotaFiscal !== false
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300'
                        }`}
                        title="Alternar entre proposta com ou sem Nota Fiscal"
                      >
                        <span>Nota Fiscal (NFS-e):</span>
                        <span className="font-extrabold">{orcamentoState.incluiNotaFiscal !== false ? '✓ Inclusa' : '✕ Desativada (Recibo + ART)'}</span>
                      </button>

                      {/* Sincronizar Bloco de Pagamento */}
                      <button
                        type="button"
                        onClick={handleSincronizarEtapa3}
                        className="px-3 py-1.5 rounded-lg bg-[#0B1E3D] hover:bg-[#1565D8] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                        title="Atualiza o conteúdo da Etapa 3 com o Memorial de Cálculo, QR Code oficial do PIX e termos de pagamento"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                        <span>Recalcular & Sincronizar Etapa 3</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rich Text Editor Component (WYSIWYG TipTap) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Conteúdo Rico da Seção:</span>
                <span className="text-[11px] text-slate-400">
                  Formatação completa, criação de tabelas, cores e imagens habilitadas
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <TipTapEditor
                  contentHtml={secaoAtiva?.conteudoHtml || ''}
                  onChange={(novoHtml) => handleConteudoSecaoChange(novoHtml)}
                  placeholder={`Edite o conteúdo técnico da ${secaoAtiva?.titulo}...`}
                />
              </div>
            </div>

          </div>

          {/* Quick Section Guide & Helper Footer */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                <strong>Dica de Produtividade:</strong> Você pode adicionar linhas e colunas em tabelas (Metodologia e Identificação das Partes) clicando nos botões de tabela da barra de ferramentas do editor.
              </span>
            </div>
            
            <button
              onClick={() => setModalPdfAberto(true)}
              className="text-[#1565D8] hover:underline font-bold shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <span>Ver prévia final no PDF</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Drawer: Revisions & History */}
      {drawerHistoricoAberto && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-[#1565D8]" />
                  <h3 className="font-extrabold text-[#0B1E3D] text-base">Histórico de Alterações</h3>
                </div>
                <button
                  onClick={() => setDrawerHistoricoAberto(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Registro de revisões automáticas para manter rastreabilidade técnica sobre quem e quando alterou a proposta.
              </p>

              <div className="space-y-2.5 max-h-[70vh] overflow-y-auto pr-1">
                {orcamentoState.historico && orcamentoState.historico.length > 0 ? (
                  orcamentoState.historico.map((h, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0B1E3D]">{h.editadoPorNome || 'Engenharia'}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(h.editadoEm).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-slate-600">{h.resumoAlteracao}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400">
                    Nenhuma revisão registrada até o momento.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => setDrawerHistoricoAberto(false)}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Fechar Histórico
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog: Reference Standard Template (Regra Crítica 1.1) */}
      {modalModeloPadraoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-[#1565D8]" />
                <div>
                  <h3 className="font-extrabold text-[#0B1E3D] text-base">Modelo Padrão de Proposta Institucional</h3>
                  <p className="text-[11px] text-slate-500">Estrutura fixa de 13 páginas da VL Engenharia Mecânica</p>
                </div>
              </div>
              <button
                onClick={() => setModalModeloPadraoAberto(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto flex-1 pr-1 text-xs text-slate-700">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
                <strong>Proteção do Molde Original:</strong> O modelo padrão de 13 páginas e as diretrizes institucionais do Eng. Vitor Leonardo são imutáveis e servem como matriz de origem para novos orçamentos.
              </div>

              <h4 className="font-bold text-slate-900 mt-2">Estrutura das 13 Páginas Padronizadas:</h4>
              <ol className="space-y-1.5 list-decimal list-inside text-slate-600 font-medium">
                {SECOES_PROPOSTA_DEFINICAO.map((def) => (
                  <li key={def.id} className="p-1.5 rounded bg-slate-50 border border-slate-100">
                    <strong className="text-[#0B1E3D]">{def.titulo}</strong>
                    {def.subtitulo && <span className="text-slate-400 block text-[10px] pl-4">{def.subtitulo}</span>}
                  </li>
                ))}
              </ol>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setModalModeloPadraoAberto(false)}
                className="px-4 py-2 rounded-xl bg-[#0B1E3D] hover:bg-[#1565D8] text-white font-bold text-xs cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmação de Exclusão do Orçamento */}
      {modalExcluirAberto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Excluir Orçamento Definitivamente</h3>
                  <p className="text-xs text-slate-500">Ação irreversível</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalExcluirAberto(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <AlertCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <p className="text-slate-700">
                Tem certeza de que deseja excluir permanentemente o orçamento <strong className="font-mono text-slate-900">{orcamentoState.codigoProposta || orcamentoState.id}</strong>?
              </p>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs text-slate-600">
                <div><strong>Serviço:</strong> {orcamentoState.servico}</div>
                <div><strong>Cliente:</strong> {orcamentoState.clienteNome || 'Cliente'}</div>
                <div><strong>Valor:</strong> {(orcamentoState.valor ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                <div><strong>Status:</strong> {orcamentoState.status}</div>
              </div>

              <p className="text-xs text-rose-600 font-medium">
                Esta ação removerá este orçamento do banco de dados e do painel técnico.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2.5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalExcluirAberto(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  removerOrcamento(orcamentoState.id);
                  setModalExcluirAberto(false);
                  navigate('/admin/orcamentos');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer shadow-xs"
              >
                Sim, excluir orçamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Integrated PDF Viewer & Export Modal */}
      {modalPdfAberto && (
        <PropostaViewerModal
          orcamento={orcamentoState}
          isOpen={modalPdfAberto}
          onClose={() => setModalPdfAberto(false)}
        />
      )}

    </div>
  );
};
