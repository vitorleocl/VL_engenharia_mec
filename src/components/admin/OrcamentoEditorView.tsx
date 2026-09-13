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
  FileSpreadsheet
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Orcamento, OrcamentoSecao, OrcamentoHistorico } from '../../types';
import { TipTapEditor } from './TipTapEditor';
import { PropostaViewerModal } from './PropostaViewerModal';
import { redimensionarImagemArquivo } from '../../lib/imageUtils';
import { 
  SECOES_PROPOSTA_DEFINICAO, 
  gerarSecoesPadraoOrcamento, 
  converterPaginasParaSecoes 
} from '../../lib/orcamentoTemplatePadrao';

export const OrcamentoEditorView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orcamentos, clientes, ativos, atualizarOrcamento } = useData();
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

  // File Inputs
  const capaFileInputRef = useRef<HTMLInputElement>(null);
  const secaoFotoInputRef = useRef<HTMLInputElement>(null);
  const autoSaveTimerRef = useRef<any>(null);

  // Initialize orcamentoState with editable 13 sections
  useEffect(() => {
    if (!orcamentoOriginal) return;

    // If orcamento already has rich secoes, use them
    if (orcamentoOriginal.secoes && orcamentoOriginal.secoes.length > 0) {
      setOrcamentoState(orcamentoOriginal);
      return;
    }

    // If it has paginasProposta, convert them to editable secoes
    if (orcamentoOriginal.paginasProposta && orcamentoOriginal.paginasProposta.length > 0) {
      const secoesConvertidas = converterPaginasParaSecoes(orcamentoOriginal.paginasProposta);
      const inicializado: Orcamento = {
        ...orcamentoOriginal,
        secoes: secoesConvertidas,
      };
      setOrcamentoState(inicializado);
      // Persist the initialized editable sections copy
      atualizarOrcamento(orcamentoOriginal.id, { secoes: secoesConvertidas });
      return;
    }

    // Otherwise, generate the standard 13-section editable copy
    const secoesPadrao = gerarSecoesPadraoOrcamento(orcamentoOriginal, { cliente, ativo });
    const inicializado: Orcamento = {
      ...orcamentoOriginal,
      secoes: secoesPadrao,
    };
    setOrcamentoState(inicializado);
    atualizarOrcamento(orcamentoOriginal.id, { secoes: secoesPadrao });
  }, [orcamentoOriginal, cliente, ativo]);

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

  // Debounced Auto-Save
  const agendarAutoSave = useCallback((novoOrcamento: Orcamento, resumoAlteracao = 'Edição de conteúdo') => {
    setOrcamentoState(novoOrcamento);
    setStatusSalvo('alterado');

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
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
        imagemCapaUrl: novoOrcamento.imagemCapaUrl,
        imagemCapaLegenda: novoOrcamento.imagemCapaLegenda,
        secoes: novoOrcamento.secoes,
        paginasProposta: paginasSincronizadas,
        historico: historicoAtualizado,
      });

      setStatusSalvo('salvo');
      const now = new Date();
      setHorarioUltimoSalvo(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1200);
  }, [atualizarOrcamento, currentUser]);

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

  // Reset section to default template
  const handleRestaurarSecaoPadrao = () => {
    if (!orcamentoState?.secoes || !secaoAtiva) return;

    if (!window.confirm(`Tem certeza que deseja restaurar a ${secaoAtiva.titulo} para o texto original do modelo padrão? As edições personalizadas desta seção serão substituídas pelo padrão da VL Engenharia.`)) {
      return;
    }

    const secoesPadrao = gerarSecoesPadraoOrcamento(orcamentoState, { cliente, ativo });
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
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
              orcamentoState.status === 'aprovado'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : orcamentoState.status === 'enviado'
                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                : orcamentoState.status === 'recusado'
                ? 'bg-red-100 text-red-800 border border-red-300'
                : 'bg-slate-100 text-slate-700 border border-slate-300'
            }`}>
              {orcamentoState.status}
            </span>
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
        </div>

        {/* Status indicator & Right Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
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

          {/* View / Export PDF Button */}
          <button
            onClick={() => setModalPdfAberto(true)}
            className="px-4 py-2 rounded-xl bg-[#0B1E3D] hover:bg-[#1565D8] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#D4AF37]" />
            <span>Exportar / Imprimir PDF</span>
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
        <span className="hidden lg:inline text-[11px] font-mono text-blue-700">13 Páginas Individuais</span>
      </div>

      {/* Main Workspace: Left Sidebar (13 Sections) + Right Editor Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Sidebar: 13 Pages Navigator (4 cols on lg) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 sticky top-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-[#0B1E3D] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#1565D8]" />
                <span>Seções da Proposta (13 Págs)</span>
              </h3>
              <p className="text-[11px] text-slate-500">Selecione para editar o texto e tabelas</p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {orcamentoState.secoes?.length || 13} seções
            </span>
          </div>

          {/* Sections List */}
          <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
            {orcamentoState.secoes?.map((secao) => {
              const isActive = secao.id === secaoAtivaId;
              const hasCover = secao.id === 'capa' && Boolean(orcamentoState.imagemCapaUrl);

              return (
                <button
                  key={secao.id}
                  onClick={() => setSecaoAtivaId(secao.id)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start justify-between gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-blue-50/80 border-[#1565D8] shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className={`w-6 h-6 rounded-lg font-mono text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5 ${
                      isActive ? 'bg-[#1565D8] text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {secao.numero}
                    </span>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${isActive ? 'text-[#0B1E3D]' : 'text-slate-800'}`}>
                        {secao.titulo}
                      </p>
                      {secao.subtitulo && (
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {secao.subtitulo}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Badges / indicators */}
                  <div className="shrink-0 flex items-center gap-1 mt-1">
                    {hasCover && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" title="Foto de capa anexada" />
                    )}
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-[#1565D8]' : 'text-slate-300'}`} />
                  </div>
                </button>
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
              <div className="flex items-center gap-2">
                
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
                <strong>Proteção do Molde Original:</strong> O modelo padrão de 13 páginas e as diretrizes institucionais do Eng. Vitor Leonardo (CREA-PE: 182229949-0) são imutáveis e servem como matriz de origem para novos orçamentos.
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
