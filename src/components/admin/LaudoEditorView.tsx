import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Printer, 
  Camera, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  ClipboardCheck,
  ChevronRight, 
  FileText,
  Clock,
  Check,
  AlertCircle,
  Download,
  ArrowUp,
  ArrowDown,
  Edit3,
  Eye,
  EyeOff,
  History,
  RotateCcw,
  Loader2,
  Layers,
  X,
  Image as ImageIcon,
  UploadCloud,
  FileCheck,
  ExternalLink,
  ZoomIn,
  FileSpreadsheet,
  Search,
  ShieldAlert,
  Scale,
  MoreHorizontal,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { calculateHRN, HRN_LO_OPTIONS, HRN_FE_OPTIONS, HRN_DPH_OPTIONS, HRN_NP_OPTIONS } from '../../utils/hrn';
import { Laudo, LaudoSecao, LaudoRevisao, HRNValues, ChecklistCampo } from '../../types';
import { TipTapEditor } from './TipTapEditor';
import { LaudoPdfExportModal } from './LaudoPdfExportModal';
import { ImportarChecklistCampoModal } from './ImportarChecklistCampoModal';
import { gerarMinutaTecnicaSecao } from '../../lib/geradorMinutasLaudo';
import { converterPdfParaImagem } from '../../lib/pdfToImage';
import { redimensionarImagemArquivo } from '../../lib/imageUtils';
import { VerificacaoEmissaoModal } from './VerificacaoEmissaoModal';
import { LaudoDocSheets } from './LaudoDocSheets';

const PRESET_SECTIONS = [
  { 
    titulo: '1. Apresentação & Objetivo do Laudo', 
    tipo: 'apresentacao', 
    isObrigatoria: true,
    conteudoHtml: `<p>O presente <strong>Laudo Técnico Pericial de Engenharia Mecânica</strong> tem por objetivo avaliar as condições de integridade estrutural, segurança operacional e conformidade legal do equipamento especificado, observando os preceitos do <strong>CREA-PE</strong> e as Normas Regulamentadoras federais aplicáveis.</p><p>As vistorias e análises foram executadas de acordo com as boas práticas de engenharia diagnóstica e legislação vigente.</p>` 
  },
  { 
    titulo: '2. Diretrizes Normativas & Metodologia', 
    tipo: 'diretrizes', 
    isObrigatoria: true,
    conteudoHtml: `<p>Os trabalhos técnicos foram fundamentados nas seguintes referências:</p><ul><li><strong>ABNT NBR ISO 12100:</strong> Segurança de Máquinas — Princípios Gerais de Projeto — Apreciação e Redução de Riscos;</li><li><strong>Normas Regulamentadoras (NR-11, NR-12, NR-13)</strong> do Ministério do Trabalho e Emprego;</li><li>Resoluções normativas do Sistema CONFEA/CREA.</li></ul><p>A metodologia incluiu inspeção visual detalhada, verificação de dispositivos de segurança, ensaios funcionais e medições dimensionais.</p>` 
  },
  { 
    titulo: '3. Inspeção e Corpo Técnico Pericial', 
    tipo: 'corpo_tecnico', 
    isObrigatoria: true,
    conteudoHtml: `<p>A inspeção pericial <em>in loco</em> constatou as seguintes características e estado de conservação mecânica:</p><table class="tiptap-table border-collapse border border-slate-300 w-full my-3"><thead><tr><th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Componente Avaliado</th><th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Condição Física</th><th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Parecer Técnico</th></tr></thead><tbody><tr><td class="border border-slate-300 p-2 text-xs">Estrutura e Chassi Principal</td><td class="border border-slate-300 p-2 text-xs">Sem trincas ou deformações</td><td class="border border-slate-300 p-2 text-xs">Aprovado</td></tr><tr><td class="border border-slate-300 p-2 text-xs">Sistemas de Acionamento e Freios</td><td class="border border-slate-300 p-2 text-xs">Operação regular em regime</td><td class="border border-slate-300 p-2 text-xs">Conforme</td></tr><tr><td class="border border-slate-300 p-2 text-xs">Proteções Fixas e Móveis</td><td class="border border-slate-300 p-2 text-xs">Instaladas com intertravamento</td><td class="border border-slate-300 p-2 text-xs">Atende NR-12</td></tr></tbody></table>` 
  },
  { 
    titulo: '4. Matriz de Auditoria & Não Conformidades', 
    tipo: 'checklist', 
    isObrigatoria: false,
    conteudoHtml: `<p>Matriz de requisitos normativos verificados no equipamento durante a auditoria técnica:</p><table class="tiptap-table border-collapse border border-slate-300 w-full my-3"><thead><tr><th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Requisito Normativo</th><th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Status</th><th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Ação Recomendada</th></tr></thead><tbody><tr><td class="border border-slate-300 p-2 text-xs">Botão de Parada de Emergência categoria 4</td><td class="border border-slate-300 p-2 text-xs"><span style="color:#16A34A;font-weight:bold;">Conforme</span></td><td class="border border-slate-300 p-2 text-xs">Manter testes periódicos de atuação.</td></tr><tr><td class="border border-slate-300 p-2 text-xs">Sinalização de segurança e advertência</td><td class="border border-slate-300 p-2 text-xs"><span style="color:#16A34A;font-weight:bold;">Conforme</span></td><td class="border border-slate-300 p-2 text-xs">Placas legíveis e em conformidade.</td></tr><tr><td class="border border-slate-300 p-2 text-xs">Manual de operação e procedimentos</td><td class="border border-slate-300 p-2 text-xs"><span style="color:#D97706;font-weight:bold;">Atenção</span></td><td class="border border-slate-300 p-2 text-xs">Disponibilizar cópia em português no posto de trabalho.</td></tr></tbody></table>` 
  },
  { 
    titulo: '5. Apreciação de Riscos & Recomendações', 
    tipo: 'recomendacoes', 
    isObrigatoria: false,
    conteudoHtml: `<p>Com base na análise quantitativa de risco e vistoria física, determinam-se as seguintes <strong>recomendações prioritárias de engenharia</strong>:</p><ol><li>Realizar manutenção preventiva periódica conforme plano recomendado pelo fabricante;</li><li>Manter atualizado o registro de inspeções no livro de ordens ou prontuário técnico do equipamento;</li><li>Garantir treinamento formal e reciclagem anual dos operadores habilitados;</li><li>Inspecionar mensalmente os elementos de desgaste e sistemas de travamento mecânico.</li></ol>` 
  },
  { 
    titulo: '6. Conclusão Pericial & Encerramento', 
    tipo: 'conclusao', 
    isObrigatoria: true,
    conteudoHtml: `<p>Com base nos ensaios técnicos realizados, nas medições de campo e na verificação das salvaguardas mecânicas, o Engenheiro Mecânico Responsável <strong>ATESTO que o equipamento atende aos parâmetros técnicos e normativos de segurança operacional vigentes</strong>, estando <strong>APTO para operação regular</strong>, desde que respeitadas as condições estabelecidas nas recomendações deste laudo pericial.</p><p>O presente documento possui validade jurídica plena, respaldado pela respectiva <strong>Anotação de Responsabilidade Técnica (ART)</strong> registrada junto ao CREA-PE.</p>` 
  },
];

export const LaudoEditorView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { laudos, clientes, ativos, orcamentos, associarOrcamentoAoLaudo, categoriasLaudo, atualizarLaudo, finalizarLaudo, removerLaudo, registrarUsoIA, checklistsCampo } = useData();
  const { currentUser } = useAuth();

  const laudoOriginal = laudos.find(l => l.id === id);

  // Local mutable state
  const [laudoState, setLaudoState] = useState<Laudo | null>(() => {
    if (!laudoOriginal) return null;
    // If secoes is empty, prepopulate with preset sections
    if (!laudoOriginal.secoes || laudoOriginal.secoes.length === 0) {
      const secoesIniciais: LaudoSecao[] = PRESET_SECTIONS.map((p, idx) => ({
        id: `sec-${Date.now()}-${idx}`,
        titulo: p.titulo,
        ordem: idx + 1,
        tipo: p.tipo,
        isObrigatoria: p.isObrigatoria,
        conteudoHtml: p.conteudoHtml,
        itens: [],
        fotos: []
      }));
      return { ...laudoOriginal, secoes: secoesIniciais };
    }
    return laudoOriginal;
  });

  // Active section selected in editor
  const [secaoAtivaId, setSecaoAtivaId] = useState<string>('');

  // Auto-save state
  const [statusSalvamento, setStatusSalvamento] = useState<'salvo' | 'salvando' | 'pendente'>('salvo');
  const [ultimoSalvoHora, setUltimoSalvoHora] = useState<string>(new Date().toLocaleTimeString('pt-BR'));
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Modals
  const [modalPdfAberto, setModalPdfAberto] = useState(false);
  const [modalRevisoesAberto, setModalRevisoesAberto] = useState(false);
  const [modalNovaSecaoAberto, setModalNovaSecaoAberto] = useState(false);
  const [modalIaAberto, setModalIaAberto] = useState(false);
  const [modalFinalizarAberto, setModalFinalizarAberto] = useState(false);
  const [modalExcluirLaudoAberto, setModalExcluirLaudoAberto] = useState(false);
  const [modalImportarChecklistAberto, setModalImportarChecklistAberto] = useState(false);
  const [modalAssociarOrcamentoAberto, setModalAssociarOrcamentoAberto] = useState(false);
  const [modalVerificacaoAberto, setModalVerificacaoAberto] = useState(false);
  const [modalConverterLayoutAberto, setModalConverterLayoutAberto] = useState(false);
  const [modoExibicao, setModoExibicao] = useState<'editor' | 'folhas'>('editor');
  const [abaEstruturada, setAbaEstruturada] = useState<'geral' | 'parecer' | 'ncs' | 'normas_instrumentos'>('geral');
  const [menuAcoesAberto, setMenuAcoesAberto] = useState(false);
  const [buscaOrcamentoModal, setBuscaOrcamentoModal] = useState('');
  const [filtroApenasMesmoCliente, setFiltroApenasMesmoCliente] = useState(true);

  // Form inputs for modals
  const [novaSecaoTitulo, setNovaSecaoTitulo] = useState('');
  const [novaSecaoPreset, setNovaSecaoPreset] = useState('custom');
  const [novaNotaRevisao, setNovaNotaRevisao] = useState('');
  const [promptIa, setPromptIa] = useState('Melhorar redação técnica conforme ABNT e NRs');
  const [carregandoIa, setCarregandoIa] = useState(false);
  const [artNumeroInput, setArtNumeroInput] = useState(laudoOriginal?.artNumero || '');
  const [termoAceito, setTermoAceito] = useState(false);
  const [erroClienteValidacao, setErroClienteValidacao] = useState<string | null>(null);

  // Editing section title inline
  const [editandoSecaoId, setEditandoSecaoId] = useState<string | null>(null);
  const [tituloEditando, setTituloEditando] = useState('');

  // Image upload and ART attachment state
  const capaFileInputRef = useRef<HTMLInputElement>(null);
  const secaoFotoInputRef = useRef<HTMLInputElement>(null);
  const artFileInputRef = useRef<HTMLInputElement>(null);
  const [legendaNovaFotoSecao, setLegendaNovaFotoSecao] = useState('');
  const [modalVisualizarImagemUrl, setModalVisualizarImagemUrl] = useState<{ url: string; titulo?: string } | null>(null);
  const [modalVisualizarArtAberto, setModalVisualizarArtAberto] = useState(false);
  const [artImagemVisual, setArtImagemVisual] = useState<string | null>(null);
  const [carregandoArtImagem, setCarregandoArtImagem] = useState(false);
  const [secaoParaRemoverConfirm, setSecaoParaRemoverConfirm] = useState<LaudoSecao | null>(null);

  // Carrega ou converte a ART para exibição como imagem direta na página
  useEffect(() => {
    if (!laudoState?.artArquivoUrl) {
      setArtImagemVisual(null);
      return;
    }

    if (
      laudoState.artTipoArquivo === 'imagem' ||
      laudoState.artArquivoUrl.startsWith('data:image/') ||
      laudoState.artArquivoUrl.match(/\.(jpeg|jpg|png|webp|gif)(\?.*)?$/i)
    ) {
      setArtImagemVisual(laudoState.artArquivoUrl);
      return;
    }

    let ativoBool = true;
    setCarregandoArtImagem(true);
    converterPdfParaImagem(laudoState.artArquivoUrl)
      .then((imgData) => {
        if (ativoBool) setArtImagemVisual(imgData);
      })
      .catch((err) => {
        console.error('Falha ao renderizar PDF da ART para imagem:', err);
      })
      .finally(() => {
        if (ativoBool) setCarregandoArtImagem(false);
      });

    return () => {
      ativoBool = false;
    };
  }, [laudoState?.artArquivoUrl, laudoState?.artTipoArquivo]);

  // Synchronize initial active section
  useEffect(() => {
    if (laudoState?.secoes && laudoState.secoes.length > 0 && !secaoAtivaId) {
      setSecaoAtivaId(laudoState.secoes[0].id);
    }
  }, [laudoState, secaoAtivaId]);

  const laudoStateRef = useRef(laudoState);
  useEffect(() => {
    laudoStateRef.current = laudoState;
  }, [laudoState]);

  // Clean timer and flush pending saves on unmount / reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (autoSaveTimerRef.current && laudoStateRef.current) {
        clearTimeout(autoSaveTimerRef.current);
        executarSalvar(laudoStateRef.current);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (autoSaveTimerRef.current && laudoStateRef.current) {
        clearTimeout(autoSaveTimerRef.current);
        executarSalvar(laudoStateRef.current);
      }
    };
  }, []);

  if (!laudoState) {
    return (
      <div className="p-8 text-center space-y-4 max-w-md mx-auto">
        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Laudo não encontrado</h2>
        <p className="text-xs text-slate-500">O laudo solicitado pode ter sido removido ou não existe.</p>
        <button
          onClick={() => navigate('/admin/laudos')}
          className="px-4 py-2 rounded-xl bg-[#1565D8] hover:bg-[#0b4fb8] text-white text-xs font-bold transition-colors cursor-pointer"
        >
          Voltar para Central de Laudos
        </button>
      </div>
    );
  }

  const cliente = clientes.find(c => c.id === laudoState.clienteId);
  const ativo = ativos.find(a => a.id === laudoState.ativoId);

  // Find 3-level taxonomy details
  const taxonomyDetails = useMemo(() => {
    let catNome = 'Engenharia Mecânica Especializada';
    let subNome = 'Vistorias & Diagnósticos';
    let tipoNome = laudoState.tipo;

    if (laudoState.categoriaId) {
      const c = categoriasLaudo.find(cat => cat.id === laudoState.categoriaId);
      if (c) {
        catNome = `${c.numero ? `${c.numero}. ` : ''}${c.nome}`;
        if (laudoState.subcategoriaId) {
          const s = c.subcategorias.find(sub => sub.id === laudoState.subcategoriaId);
          if (s) {
            subNome = s.nome;
            if (laudoState.tipoLaudoId) {
              const t = s.tipos.find(tp => tp.id === laudoState.tipoLaudoId);
              if (t) tipoNome = t.nome;
            }
          }
        }
      }
    }
    return { catNome, subNome, tipoNome };
  }, [laudoState, categoriasLaudo]);

  // Execute Persistence Save (debounced or explicit)
  const executarSalvar = (estadoParaSalvar: Laudo, descricaoRevisao?: string) => {
    setStatusSalvamento('salvando');

    const agora = new Date().toISOString();
    let revisoesAtualizadas = estadoParaSalvar.revisoes || [];

    if (descricaoRevisao) {
      const novaRevisao: LaudoRevisao = {
        id: `rev-${Date.now()}`,
        dataHora: agora,
        usuarioUid: currentUser?.uid || 'admin',
        usuarioNome: currentUser?.nome || 'Eng. Vitor Leonardo',
        descricao: descricaoRevisao
      };
      revisoesAtualizadas = [novaRevisao, ...revisoesAtualizadas];
    }

    const laudoFinal = {
      ...estadoParaSalvar,
      revisoes: revisoesAtualizadas,
      atualizadoEm: agora,
    };

    atualizarLaudo(laudoFinal.id, laudoFinal);

    setTimeout(() => {
      setStatusSalvamento('salvo');
      setUltimoSalvoHora(new Date().toLocaleTimeString('pt-BR'));
    }, 400);
  };

  // Schedule auto-save when user makes edits
  const agendarAutoSave = (novoEstado: Laudo) => {
    setLaudoState(novoEstado);
    setStatusSalvamento('pendente');

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      executarSalvar(novoEstado);
    }, 400);
  };

  const isClienteRealVinculado = (estado: Laudo | null): boolean => {
    if (!estado) return false;
    const nome = (estado.clienteNome || '').trim();
    const temNomeReal = Boolean(nome) && !/^cliente(\s+contratante|\s+corporativo)?$/i.test(nome);
    const temClienteCadastro = Boolean(estado.clienteId && clientes.some(c => c.id === estado.clienteId));
    return temNomeReal && temClienteCadastro;
  };

  // Immediate save on user demand
  const handleSalvarManual = () => {
    if (!isClienteRealVinculado(laudoState)) {
      setErroClienteValidacao('Selecione um cliente real cadastrado na aba "Ficha & Vistoria" antes de salvar o laudo.');
      setAbaEstruturada('geral');
      return;
    }
    setErroClienteValidacao(null);
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    executarSalvar(laudoState, 'Salvo manualmente pelo engenheiro');
  };

  // Get currently active section object
  const secaoAtiva = laudoState.secoes.find(s => s.id === secaoAtivaId) || laudoState.secoes[0];

  // Update HTML/JSON content for active section
  const handleContentChange = (html: string, json: any) => {
    if (!secaoAtiva) return;
    const secoesAtualizadas = laudoState.secoes.map(s => {
      if (s.id === secaoAtiva.id) {
        return { ...s, conteudoHtml: html, conteudoJson: json };
      }
      return s;
    });

    agendarAutoSave({
      ...laudoState,
      secoes: secoesAtualizadas,
    });
  };

  // Move Section Up in order
  const handleMoverSecaoCima = (index: number) => {
    if (index <= 0) return;
    const novasSecoes = [...laudoState.secoes];
    const item = novasSecoes[index];
    novasSecoes[index] = novasSecoes[index - 1];
    novasSecoes[index - 1] = item;
    
    // Reindex order
    novasSecoes.forEach((s, idx) => { s.ordem = idx + 1; });

    agendarAutoSave({
      ...laudoState,
      secoes: novasSecoes,
    });
  };

  // Move Section Down in order
  const handleMoverSecaoBaixo = (index: number) => {
    if (index >= laudoState.secoes.length - 1) return;
    const novasSecoes = [...laudoState.secoes];
    const item = novasSecoes[index];
    novasSecoes[index] = novasSecoes[index + 1];
    novasSecoes[index + 1] = item;
    
    novasSecoes.forEach((s, idx) => { s.ordem = idx + 1; });

    agendarAutoSave({
      ...laudoState,
      secoes: novasSecoes,
    });
  };

  // Toggle Hide / Show section in PDF export
  const handleToggleOcultarSecao = (secaoId: string) => {
    if (!laudoState) return;
    const novasSecoes = laudoState.secoes.map(s => {
      if (s.id === secaoId) {
        return { ...s, ocultaNoPdf: !s.ocultaNoPdf };
      }
      return s;
    });
    agendarAutoSave({
      ...laudoState,
      secoes: novasSecoes,
    });
  };

  // Open confirmation modal to delete section
  const handleRemoverSecao = (idParaRemover: string) => {
    if (!laudoState) return;
    const secao = laudoState.secoes.find(s => s.id === idParaRemover);
    if (!secao) return;
    setSecaoParaRemoverConfirm(secao);
  };

  // Confirmed delete section
  const handleConfirmarRemoverSecao = () => {
    if (!laudoState || !secaoParaRemoverConfirm) return;
    const idParaRemover = secaoParaRemoverConfirm.id;
    const novasSecoes = laudoState.secoes.filter(s => s.id !== idParaRemover);
    novasSecoes.forEach((s, idx) => { s.ordem = idx + 1; });

    if (secaoAtivaId === idParaRemover && novasSecoes.length > 0) {
      setSecaoAtivaId(novasSecoes[0].id);
    }

    setSecaoParaRemoverConfirm(null);
    agendarAutoSave({
      ...laudoState,
      secoes: novasSecoes,
    });
  };

  // Add new section
  const handleConfirmarNovaSecao = () => {
    if (!novaSecaoTitulo.trim()) return;

    let conteudoBase = '<p>Conteúdo técnico da nova seção.</p>';
    if (novaSecaoPreset !== 'custom') {
      const preset = PRESET_SECTIONS.find(p => p.tipo === novaSecaoPreset);
      if (preset) conteudoBase = preset.conteudoHtml;
    }

    const novaSec: LaudoSecao = {
      id: `sec-${Date.now()}`,
      titulo: novaSecaoTitulo.trim(),
      ordem: laudoState.secoes.length + 1,
      tipo: novaSecaoPreset,
      isObrigatoria: false,
      conteudoHtml: conteudoBase,
      itens: [],
      fotos: []
    };

    const novasSecoes = [...laudoState.secoes, novaSec];
    setSecaoAtivaId(novaSec.id);
    setModalNovaSecaoAberto(false);
    setNovaSecaoTitulo('');
    setNovaSecaoPreset('custom');

    agendarAutoSave({
      ...laudoState,
      secoes: novasSecoes,
    });
  };

  // Save renamed section title
  const handleSalvarTituloSecao = (secaoId: string) => {
    if (!tituloEditando.trim()) {
      setEditandoSecaoId(null);
      return;
    }

    const novasSecoes = laudoState.secoes.map(s => {
      if (s.id === secaoId) {
        return { ...s, titulo: tituloEditando.trim() };
      }
      return s;
    });

    setEditandoSecaoId(null);
    agendarAutoSave({
      ...laudoState,
      secoes: novasSecoes,
    });
  };

  // Add manual revision milestone
  const handleAdicionarNotaRevisao = () => {
    if (!novaNotaRevisao.trim()) return;
    executarSalvar(laudoState, novaNotaRevisao.trim());
    setNovaNotaRevisao('');
  };

  // Assistente IA Redação Técnica
  const handleAplicarIa = async () => {
    if (!secaoAtiva) return;
    setCarregandoIa(true);
    registrarUsoIA('Assistente Técnico IA', 1);

    try {
      const res = await fetch('/api/ai/redigir-secao-laudo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tituloSecao: secaoAtiva.titulo,
          tipoLaudo: taxonomyDetails.tipoNome,
          normasRef: laudoState.normasReferencia,
          clienteNome: cliente?.razaoSocial,
          ativoIdentificacao: ativo?.identificacao,
          promptUsuario: promptIa,
          conteudoAtual: secaoAtiva.conteudoHtml || ''
        })
      });

      let htmlGerado = '';
      if (res.ok) {
        const data = await res.json();
        htmlGerado = data.conteudoHtml || '';
      }

      // Se por algum motivo o backend não responder ou retornar vazio, usamos o motor pericial autônomo offline
      if (!htmlGerado) {
        htmlGerado = gerarMinutaTecnicaSecao(
          secaoAtiva.titulo,
          { nome: taxonomyDetails.tipoNome, normasRef: laudoState.normasReferencia },
          { 
            clienteNome: cliente?.razaoSocial, 
            ativoIdentificacao: ativo?.identificacao,
            promptUsuario: promptIa
          }
        );
      }

      const conteudoAnterior = secaoAtiva.conteudoHtml ? secaoAtiva.conteudoHtml.trim() : '';
      const novoConteudo = conteudoAnterior && conteudoAnterior !== '<p></p>'
        ? `${conteudoAnterior}<div class="my-3">${htmlGerado}</div>`
        : htmlGerado;

      const novasSecoes = laudoState.secoes.map(s => {
        if (s.id === secaoAtiva.id) {
          return { ...s, conteudoHtml: novoConteudo };
        }
        return s;
      });

      agendarAutoSave({
        ...laudoState,
        secoes: novasSecoes,
      });
    } catch (err) {
      console.warn('Falha na requisição da IA, aplicando motor técnico autônomo:', err);
      // Fallback pericial robusto garantido
      const htmlFallback = gerarMinutaTecnicaSecao(
        secaoAtiva.titulo,
        { nome: taxonomyDetails.tipoNome, normasRef: laudoState.normasReferencia },
        { 
          clienteNome: cliente?.razaoSocial, 
          ativoIdentificacao: ativo?.identificacao,
          promptUsuario: promptIa
        }
      );

      const conteudoAnterior = secaoAtiva.conteudoHtml ? secaoAtiva.conteudoHtml.trim() : '';
      const novoConteudo = conteudoAnterior && conteudoAnterior !== '<p></p>'
        ? `${conteudoAnterior}<div class="my-3">${htmlFallback}</div>`
        : htmlFallback;

      const novasSecoes = laudoState.secoes.map(s => {
        if (s.id === secaoAtiva.id) {
          return { ...s, conteudoHtml: novoConteudo };
        }
        return s;
      });

      agendarAutoSave({
        ...laudoState,
        secoes: novasSecoes,
      });
    } finally {
      setCarregandoIa(false);
      setModalIaAberto(false);
    }
  };

  // Calcular parecer pericial automaticamente a partir das Não Conformidades (NC)
  const calcularParecerPorNCs = (): 'liberado' | 'liberado_restricoes' | 'nao_liberado' => {
    const ncs = laudoState?.naoConformidadesEstruturadas || [];
    if (ncs.length === 0) return 'liberado';
    const temGrave = ncs.some(nc => nc.classificacaoRisco === 'critico' || nc.classificacaoRisco === 'alto');
    if (temGrave) return 'nao_liberado';
    return 'liberado_restricoes';
  };

  const handleSugerirParecerAutomatico = () => {
    if (!laudoState) return;
    const sugestao = calcularParecerPorNCs();
    let justificativa = '';
    if (sugestao === 'liberado') {
      justificativa = 'Ativo atende integralmente aos requisitos normativos e de segurança avaliados, sem registro de não conformidades impeditivas.';
    } else if (sugestao === 'liberado_restricoes') {
      justificativa = 'Ativo liberado para operação regular sob cumprimento do plano de ação corretiva das não conformidades leves/médias identificadas.';
    } else {
      justificativa = 'Operação suspensa / não liberada em virtude de não conformidades de risco crítico ou alto que comprometem a segurança imediata.';
    }

    const novo = {
      ...laudoState,
      parecer: sugestao,
      justificativaParecer: laudoState.justificativaParecer || justificativa
    };
    setLaudoState(novo);
    executarSalvar(novo, `Parecer pericial recalculado automaticamente para "${sugestao}"`);
  };

  // Conversão segura para o novo layout de 6 folhas A4 sem perda de dados
  const handleConverterParaNovoLayout = () => {
    if (!laudoState) return;
    const novo: Laudo = {
      ...laudoState,
      layoutVersao: 'novo-2026',
      revisao: laudoState.revisao || '00',
      metodo: laudoState.metodo || 'Apreciação de Riscos (NBR ISO 12100), ensaios funcionais e análise visual metrológica',
      normasLista: (laudoState.normasLista && laudoState.normasLista.length > 0)
        ? laudoState.normasLista
        : [
            'ABNT NBR ISO 12100:2013 — Segurança de máquinas',
            'NR-11 — Transporte, movimentação, armazenagem e manuseio de materiais',
            'NR-12 — Segurança no trabalho em máquinas e equipamentos'
          ],
      instrumentos: (laudoState.instrumentos && laudoState.instrumentos.length > 0)
        ? laudoState.instrumentos
        : [
            {
              id: 'inst-1',
              nome: 'Paquímetro Digital Mitutoyo 150mm',
              tag: 'PAQ-01',
              certificadoNumero: 'CAL-2026-0891',
              calibracaoValidade: '15/12/2026'
            }
          ],
      premissasLimitacoes: laudoState.premissasLimitacoes || 'Avaliação restrita às partes acessíveis no momento da inspeção visual e dinâmica. Não foram realizados ensaios destrutivos.',
      proximaInspecaoData: laudoState.proximaInspecaoData || '30/10/2027',
      justificativaParecer: laudoState.justificativaParecer || 'Ativo aprovado com restrições e plano de ação corretiva programado.',
      parecer: laudoState.parecer || 'liberado_restricoes'
    };
    setLaudoState(novo);
    executarSalvar(novo, 'Laudo convertido com sucesso para o Novo Layout A4 de 6 folhas');
    setModalConverterLayoutAberto(false);
  };

  // Finalização e emissão oficial com ART e congelamento de revisão
  const handleConfirmarEmissaoOficial = () => {
    if (!laudoState) return;
    if (!isClienteRealVinculado(laudoState)) {
      setErroClienteValidacao('Selecione um cliente real cadastrado na aba "Ficha & Vistoria" antes de emitir oficialmente o laudo.');
      setAbaEstruturada('geral');
      setModalFinalizarAberto(false);
      setModalVerificacaoAberto(false);
      return;
    }
    setErroClienteValidacao(null);
    const artNum = laudoState.artNumero || artNumeroInput.trim() || 'PE20261621255';
    const codigoVerif = laudoState.codigoVerificacao || `${laudoState.numero || 'LAR-2026-001'}-7K4Q`;
    const hash = laudoState.hashPdf || 'd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5';
    const hojeStr = new Date().toLocaleDateString('pt-BR');

    finalizarLaudo(laudoState.id, artNum);

    const novoEstado: Laudo = {
      ...laudoState,
      status: 'finalizado',
      artNumero: artNum,
      revisaoCongelada: true,
      emitidoEm: laudoState.emitidoEm || hojeStr,
      codigoVerificacao: codigoVerif,
      hashPdf: hash
    };

    setLaudoState(novoEstado);
    executarSalvar(novoEstado, `Laudo pericial emitido oficialmente com ART ${artNum}`);
    setModalFinalizarAberto(false);
    setModalVerificacaoAberto(false);
  };

  // Abrir nova revisão técnica preservando a anterior
  const handleCriarNovaRevisao = () => {
    if (!laudoState) return;
    const revAtualNum = parseInt(laudoState.revisao || '00', 10) || 0;
    const novaRevStr = String(revAtualNum + 1).padStart(2, '0');

    const historicoAtual = laudoState.revisoes || [];
    const novaNota: LaudoRevisao = {
      id: `rev-${Date.now()}`,
      dataHora: new Date().toISOString(),
      usuarioUid: currentUser?.uid || 'admin',
      usuarioNome: laudoState.responsavelNome || 'Eng. Vitor Leonardo',
      descricao: `Congelamento da Revisão ${laudoState.revisao || '00'} homologada com ART ${laudoState.artNumero || 'registrada'}.`
    };

    const novo: Laudo = {
      ...laudoState,
      revisao: novaRevStr,
      revisaoCongelada: false,
      status: 'em_revisao',
      revisoes: [...historicoAtual, novaNota]
    };

    setLaudoState(novo);
    executarSalvar(novo, `Nova revisão técnica aberta: Rev ${novaRevStr}`);
  };

  // Finalize Laudo (legado e modal rápido)
  const handleConfirmarFinalizacao = () => {
    if (!artNumeroInput.trim() || !termoAceito) {
      alert('Por favor, informe o número da ART CREA-PE e declare concordância com os termos de responsabilidade técnica.');
      return;
    }
    handleConfirmarEmissaoOficial();
  };

  // Cover Photo Handlers
  const handleCapaFotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await redimensionarImagemArquivo(file, 1200, 800, 0.85);
      const novoEstado = {
        ...laudoState,
        capaFotoUrl: base64,
        capaFotoLegenda: laudoState.capaFotoLegenda && 
                         laudoState.capaFotoLegenda !== 'Equipamento em Avaliação Pericial' &&
                         laudoState.capaFotoLegenda !== 'Fotografia técnica do equipamento em avaliação pericial'
                         ? laudoState.capaFotoLegenda : undefined,
      };
      setLaudoState(novoEstado);
      executarSalvar(novoEstado, 'Foto de capa atualizada');
    } catch (err) {
      console.warn('Erro ao redimensionar foto de capa:', err);
    }
    e.target.value = '';
  };

  const handleRemoverCapaFoto = () => {
    const novoEstado = {
      ...laudoState,
      capaFotoUrl: undefined,
      capaFotoLegenda: undefined,
    };
    setLaudoState(novoEstado);
    executarSalvar(novoEstado, 'Foto de capa removida');
  };

  const handleCapaLegendaChange = (legenda: string) => {
    agendarAutoSave({
      ...laudoState,
      capaFotoLegenda: legenda,
    });
  };

  // Section Photo & Evidences Handlers
  const handleFotoSecaoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !secaoAtiva) return;

    try {
      const base64 = await redimensionarImagemArquivo(file, 1200, 900, 0.82);
      const novaFoto = {
        id: `foto-${Date.now()}`,
        url: base64,
        descricao: legendaNovaFotoSecao.trim() || `Evidência Fotográfica - ${secaoAtiva.titulo}`,
        dataHora: new Date().toISOString(),
        autorUid: currentUser?.uid,
      };

      const fotosSecao = secaoAtiva.fotos || [];
      const novasSecoes = laudoState.secoes.map(s => {
        if (s.id === secaoAtiva.id) {
          return { ...s, fotos: [...fotosSecao, novaFoto] };
        }
        return s;
      });

      setLegendaNovaFotoSecao('');
      const novoEstado = {
        ...laudoState,
        secoes: novasSecoes,
      };
      setLaudoState(novoEstado);
      executarSalvar(novoEstado, `Foto anexada à seção: ${secaoAtiva.titulo}`);
    } catch (err) {
      console.warn('Erro ao redimensionar foto da seção:', err);
    }
    e.target.value = '';
  };

  const handleInserirFotoNoTexto = (fotoUrl: string, legenda?: string) => {
    if (!secaoAtiva) return;
    const blocoHtml = `<div class="my-4 text-center"><img src="${fotoUrl}" alt="${legenda || 'Evidência Técnica'}" style="max-width:100%; max-height:420px; object-fit:contain; border-radius:8px; border:1px solid #cbd5e1; margin:0 auto; display:block;" />${legenda ? `<p style="font-size:11px; color:#64748b; font-style:italic; margin-top:6px; font-weight:600;">${legenda}</p>` : ''}</div><p></p>`;
    const novoConteudo = (secaoAtiva.conteudoHtml || '') + blocoHtml;
    const novasSecoes = laudoState.secoes.map(s => {
      if (s.id === secaoAtiva.id) {
        return { ...s, conteudoHtml: novoConteudo, conteudoJson: undefined };
      }
      return s;
    });
    const novoEstado = {
      ...laudoState,
      secoes: novasSecoes,
    };
    setLaudoState(novoEstado);
    executarSalvar(novoEstado, `Evidência inserida no corpo da seção: ${secaoAtiva.titulo}`);
  };

  const handleRemoverFotoSecao = (fotoId: string) => {
    if (!secaoAtiva) return;
    const novasSecoes = laudoState.secoes.map(s => {
      if (s.id === secaoAtiva.id) {
        return { ...s, fotos: (s.fotos || []).filter(f => f.id !== fotoId) };
      }
      return s;
    });
    agendarAutoSave({
      ...laudoState,
      secoes: novasSecoes,
    });
  };

  // ART Attachment Handlers (PDF or Image)
  const handleArtArquivoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const isPdf = file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf');
      const novoEstado: Laudo = {
        ...laudoState,
        artArquivoUrl: base64,
        artNomeArquivo: file.name,
        artTipoArquivo: isPdf ? 'pdf' : 'imagem',
        artDataHomologacao: laudoState.artDataHomologacao || new Date().toISOString(),
      };
      agendarAutoSave(novoEstado);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoverArt = () => {
    agendarAutoSave({
      ...laudoState,
      artArquivoUrl: undefined,
      artNomeArquivo: undefined,
      artTipoArquivo: undefined,
    });
  };

  const handleImportarChecklist = (chk: ChecklistCampo) => {
    if (!laudoState) return;

    const todosItens = [...(chk.itens || []), ...(chk.itensExtras || [])];
    const naoConformes = todosItens.filter(i => i.status === 'nao_conforme');
    const conformes = todosItens.filter(i => i.status === 'conforme');

    const tabelaHtml = `
      <div style="margin: 16px 0; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; background-color: #f8fafc;">
        <h4 style="font-weight: bold; color: #1e3a8a; margin-bottom: 6px; font-size: 14px;">
          Evidências In Loco — Checklist de Campo ${chk.numero}
        </h4>
        <p style="font-size: 12px; color: #475569; margin-bottom: 10px;">
          Inspeção realizada em <strong>${new Date(chk.dataPreenchimento).toLocaleDateString('pt-BR')}</strong> por <strong>${chk.responsavelNome || 'Eng. Vitor Leonardo'}</strong> (${chk.responsavelCrea || 'CREA-PE'}). Resumo: <strong>${conformes.length}</strong> itens conformes, <strong style="color: #dc2626;">${naoConformes.length}</strong> não conformidades constatadas in loco.
        </p>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="background-color: #e2e8f0; border-bottom: 2px solid #cbd5e1; text-align: left;">
              <th style="padding: 6px 8px; width: 40px; text-align: center;">Item</th>
              <th style="padding: 6px 8px;">Requisito Normativo Avaliado</th>
              <th style="padding: 6px 8px; width: 110px; text-align: center;">Status</th>
              <th style="padding: 6px 8px;">Observações In Loco</th>
            </tr>
          </thead>
          <tbody>
            ${todosItens.map((it, idx) => `
              <tr style="border-bottom: 1px solid #e2e8f0; background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <td style="padding: 6px 8px; font-weight: bold; text-align: center;">${idx + 1}</td>
                <td style="padding: 6px 8px;">
                  <div>${it.descricao}</div>
                  ${it.valorResposta ? `<div style="font-size: 11px; color: #0369a1; font-weight: bold; margin-top: 2px;">Apurado: ${it.valorResposta} ${it.unidade && it.unidade !== 'texto' ? it.unidade : ''} ${it.criterioReferencia ? `(Ref: ${it.criterioReferencia})` : ''}</div>` : (it.criterioReferencia ? `<div style="font-size: 11px; color: #64748b; margin-top: 2px;">Ref: ${it.criterioReferencia}</div>` : '')}
                </td>
                <td style="padding: 6px 8px; text-align: center;">
                  <span style="display: inline-block; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px; color: ${it.status === 'conforme' ? '#166534' : it.status === 'nao_conforme' ? '#991b1b' : '#475569'}; background-color: ${it.status === 'conforme' ? '#dcfce7' : it.status === 'nao_conforme' ? '#fee2e2' : '#f1f5f9'};">
                    ${it.status === 'conforme' ? 'CONFORME' : it.status === 'nao_conforme' ? 'NÃO CONFORME' : 'N/A'}
                  </span>
                </td>
                <td style="padding: 6px 8px; color: #334155;">${it.observacao || 'Sem anotações complementares.'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    const novasFotos = todosItens
      .filter(it => it.fotoUrl)
      .map((it, idx) => ({
        id: `foto-chk-${Date.now()}-${idx}`,
        url: it.fotoUrl!,
        legenda: `Evidência de Campo (${chk.numero}): ${it.descricao}${it.observacao ? ` - ${it.observacao}` : ''}`,
        dataRegistro: chk.dataPreenchimento
      }));

    let secaoAlvoId = secaoAtivaId;
    const secaoConstatacoes = laudoState.secoes.find(s => 
      s.tipo === 'constatacoes' || 
      s.tipo === 'inspecao_visual' || 
      s.titulo.toLowerCase().includes('inspeção') || 
      s.titulo.toLowerCase().includes('vistoria') ||
      s.titulo.toLowerCase().includes('corpo técnico')
    );
    if (secaoConstatacoes) {
      secaoAlvoId = secaoConstatacoes.id;
    }

    const novasSecoes = laudoState.secoes.map(sec => {
      if (sec.id === secaoAlvoId) {
        return {
          ...sec,
          conteudoHtml: (sec.conteudoHtml || '') + tabelaHtml,
          fotos: [...(sec.fotos || []), ...novasFotos]
        };
      }
      return sec;
    });

    const laudoAtualizado: Laudo = {
      ...laudoState,
      secoes: novasSecoes,
    };

    setLaudoState(laudoAtualizado);
    setSecaoAtivaId(secaoAlvoId);
    executarSalvar(laudoAtualizado, `Importação de dados do Checklist ${chk.numero}`);
    setModalImportarChecklistAberto(false);
  };

  // URL param checklistOrigem effect
  const checklistOrigemId = searchParams.get('checklistOrigem');
  useEffect(() => {
    if (checklistOrigemId && checklistsCampo && checklistsCampo.length > 0 && laudoState) {
      const chk = checklistsCampo.find(c => c.id === checklistOrigemId);
      if (chk) {
        const jaConsta = laudoState.secoes.some(s => s.conteudoHtml?.includes(chk.numero));
        if (!jaConsta) {
          handleImportarChecklist(chk);
        }
      }
    }
  }, [checklistOrigemId, checklistsCampo, laudoState?.id]);

  return (
    <div className="space-y-4 pb-12">
      
      {/* ========================================================================= */}
      {/* TOP HEADER: TAXONOMIA, METADADOS & AUTO-SAVE INDICATOR                    */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#0B1324] rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="px-4 sm:px-5 py-4 space-y-3">

          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <Link
              to="/admin/laudos"
              className="text-slate-500 hover:text-[#1565D8] font-medium flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Central de Laudos</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
            <span className="text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
              {taxonomyDetails.catNome}
            </span>
            <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
            <span className="text-slate-500 dark:text-slate-400 truncate max-w-[240px]">
              {taxonomyDetails.subNome}
            </span>
          </div>

          {/* Título, estado e ações */}
          <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-3">

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-[#0B1E3D] dark:text-white tracking-tight">
                  {laudoState.numero}
                </h1>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide ${
                  laudoState.status === 'finalizado'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : laudoState.status === 'em_revisao'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {laudoState.status.toUpperCase().replace('_', ' ')}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 truncate">
                {laudoState.tipo}
                <span className="text-slate-400 dark:text-slate-500"> · ART {laudoState.artNumero || 'pendente'}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 shrink-0">

              {/* Indicador de salvamento */}
              <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mr-0.5">
                {statusSalvamento === 'salvando' ? (
                  <>
                    <Loader2 className="w-3 h-3 text-amber-500 animate-spin" />
                    <span className="text-amber-600 dark:text-amber-400">Salvando...</span>
                  </>
                ) : statusSalvamento === 'pendente' ? (
                  <>
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Alterações pendentes</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>Salvo às {ultimoSalvoHora}</span>
                  </>
                )}
              </span>

              <button
                onClick={handleSalvarManual}
                disabled={statusSalvamento === 'salvando'}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-60 text-white text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer"
                title="Salvar alterações agora (Ctrl+S)"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar</span>
              </button>

              {/* Alternador de modo */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px]">
                <button
                  onClick={() => setModoExibicao('editor')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
                    modoExibicao === 'editor'
                      ? 'bg-white dark:bg-slate-700 text-[#0B1E3D] dark:text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Editor
                </button>
                <button
                  onClick={() => setModoExibicao('folhas')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
                    modoExibicao === 'folhas'
                      ? 'bg-white dark:bg-slate-700 text-[#0B1E3D] dark:text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Folhas A4
                </button>
              </div>

              <button
                onClick={() => navigate(`/admin/laudos/${laudoState.id}/imprimir`)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer"
                title="Gerar PDF vetorial do laudo"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>PDF</span>
              </button>

              {laudoState.status === 'finalizado' ? (
                <>
                  <Link
                    to={`/verificar/${laudoState.codigoVerificacao || `${laudoState.numero}-7K4Q`}`}
                    target="_blank"
                    className="px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[11px] font-semibold flex items-center gap-1.5"
                    title="Verificar registro no portal público de autenticidade"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Verificação Pública</span>
                  </Link>
                  <button
                    onClick={handleCriarNovaRevisao}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer"
                    title="Abrir nova revisão técnica do documento"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Nova Revisão</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setModalVerificacaoAberto(true)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer"
                  title="Conferir pendências e homologar laudo com ART"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Finalizar com ART</span>
                </button>
              )}

              {/* Menu de ações secundárias */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuAcoesAberto(v => !v)}
                  aria-expanded={menuAcoesAberto}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
                  title="Mais ações do laudo"
                >
                  <MoreHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline">Mais</span>
                </button>

                {menuAcoesAberto && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setMenuAcoesAberto(false)} />
                    <div className="absolute right-0 mt-1 z-40 w-60 bg-white dark:bg-[#0B1324] border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg overflow-hidden">
                      <div className="py-1 text-[11.5px]">

                        <button
                          onClick={() => { setMenuAcoesAberto(false); setModalRevisoesAberto(true); }}
                          className="w-full px-3 py-2 flex items-center gap-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          <History className="w-3.5 h-3.5 text-slate-400" />
                          <span className="flex-1">Histórico de revisões</span>
                          <span className="font-mono text-slate-400">{laudoState.revisoes?.length || 0}</span>
                        </button>

                        <button
                          onClick={() => { setMenuAcoesAberto(false); setModalAssociarOrcamentoAberto(true); }}
                          className="w-full px-3 py-2 flex items-center gap-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          <FileSpreadsheet className={`w-3.5 h-3.5 ${laudoState.orcamentoOrigemId ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                          <span className="flex-1 truncate">
                            {laudoState.orcamentoNumero
                              ? `Orçamento ${laudoState.orcamentoNumero}`
                              : laudoState.orcamentoOrigemId ? 'Orçamento vinculado' : 'Associar orçamento'}
                          </span>
                        </button>

                        <button
                          onClick={() => { setMenuAcoesAberto(false); setModalImportarChecklistAberto(true); }}
                          className="w-full px-3 py-2 flex items-center gap-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          <ClipboardCheck className="w-3.5 h-3.5 text-[#1565D8]" />
                          <span>Importar checklist de campo</span>
                        </button>

                        <button
                          onClick={() => { setMenuAcoesAberto(false); setModalIaAberto(true); }}
                          className="w-full px-3 py-2 flex items-center gap-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                          <span>Redação assistida por IA</span>
                        </button>

                        <button
                          onClick={() => { setMenuAcoesAberto(false); setModalVerificacaoAberto(true); }}
                          className="w-full px-3 py-2 flex items-center gap-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                          <span>Verificar pendências de emissão</span>
                        </button>
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-800 py-1">
                        <button
                          onClick={() => { setMenuAcoesAberto(false); setModalExcluirLaudoAberto(true); }}
                          className="w-full px-3 py-2 flex items-center gap-2 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer text-[11.5px]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Excluir laudo</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Faixa de dados do laudo */}
        <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-slate-100 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-800 overflow-hidden rounded-b-xl">
          <div className="bg-white dark:bg-[#0B1324] px-4 sm:px-5 py-2.5 min-w-0">
            <dt className="text-[9.5px] uppercase tracking-wider font-semibold text-slate-400">Cliente</dt>
            <dd className="mt-0.5 text-[11.5px] font-semibold text-slate-800 dark:text-slate-100 truncate">
              {laudoState.clienteNome}
            </dd>
            <dd className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
              {laudoState.clienteCnpj || cliente?.cpfCnpj || cliente?.cnpj || 'CNPJ não informado'}
              {(laudoState.clienteContato || cliente?.contatos?.[0]?.nome)
                ? ` · ${laudoState.clienteContato || cliente?.contatos?.[0]?.nome}`
                : ''}
            </dd>
          </div>

          <div className="bg-white dark:bg-[#0B1324] px-4 sm:px-5 py-2.5 min-w-0">
            <dt className="text-[9.5px] uppercase tracking-wider font-semibold text-slate-400">Ativo periciado</dt>
            <dd className="mt-0.5 text-[11.5px] font-semibold text-slate-800 dark:text-slate-100 truncate">
              {laudoState.ativoIdentificacao || 'Não informado'}
            </dd>
            <dd className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {`${laudoState.ativoFabricante || ''} ${laudoState.ativoModelo || ''}`.trim() || ativo?.tipo || '—'}
            </dd>
          </div>

          <div className="bg-white dark:bg-[#0B1324] px-4 sm:px-5 py-2.5 min-w-0">
            <dt className="text-[9.5px] uppercase tracking-wider font-semibold text-slate-400">Orçamento</dt>
            <dd className="mt-0.5 text-[11.5px] font-semibold text-slate-800 dark:text-slate-100 truncate">
              {laudoState.orcamentoNumero || (laudoState.orcamentoOrigemId ? 'Vinculado' : 'Não associado')}
            </dd>
            <dd>
              <button
                onClick={() => setModalAssociarOrcamentoAberto(true)}
                className="text-[10px] text-[#1565D8] dark:text-blue-400 font-semibold hover:underline cursor-pointer"
              >
                {laudoState.orcamentoOrigemId ? 'Gerenciar vínculo' : 'Associar orçamento'}
              </button>
            </dd>
          </div>

          <div className="bg-white dark:bg-[#0B1324] px-4 sm:px-5 py-2.5 min-w-0">
            <dt className="text-[9.5px] uppercase tracking-wider font-semibold text-slate-400">Responsável técnico</dt>
            <dd className="mt-0.5 text-[11.5px] font-semibold text-slate-800 dark:text-slate-100 truncate">
              {laudoState.responsavelNome}
            </dd>
            <dd className="text-[10px] text-slate-500 dark:text-slate-400">Engenharia mecânica</dd>
          </div>

          <div className="bg-white dark:bg-[#0B1324] px-4 sm:px-5 py-2.5 min-w-0">
            <dt className="text-[9.5px] uppercase tracking-wider font-semibold text-slate-400">Registro profissional</dt>
            <dd className="mt-0.5 text-[11.5px] font-mono font-semibold text-slate-800 dark:text-slate-100 truncate">
              {laudoState.responsavelCrea}
            </dd>
            <dd className="text-[10px] text-slate-500 dark:text-slate-400">Conselho profissional</dd>
          </div>
        </dl>

      </div>

      {/* ========================================================================= */}
      {/* FLUXO DE EMISSÃO: Rascunho -> Em revisão -> ART anexada -> Emitido       */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#0B1324] px-4 sm:px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Fluxo de emissão pericial
          </span>
          {laudoState.status === 'finalizado' ? (
            <span className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Homologado e emitido com ART
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              Minuta técnica em elaboração
            </span>
          )}
        </div>

        <ol className="mt-2.5 flex flex-col sm:flex-row sm:items-center gap-y-1.5 text-[11px]">
          <li className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
              laudoState.status === 'rascunho' || !laudoState.status || laudoState.status === 'em_andamento'
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-blue-600/10 border-blue-600 text-blue-700 dark:text-blue-400'
            }`}>1</span>
            <span className={`font-semibold ${
              laudoState.status === 'rascunho' || !laudoState.status || laudoState.status === 'em_andamento'
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-slate-400'
            }`}>Rascunho</span>
          </li>

          <span className="hidden sm:block flex-1 h-px bg-slate-200 dark:bg-slate-700 mx-3" />

          <li className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
              laudoState.status === 'finalizado'
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : laudoState.status === 'em_revisao'
                ? 'bg-amber-500 border-amber-500 text-white'
                : 'border-slate-300 dark:border-slate-700 text-slate-400'
            }`}>2</span>
            <span className={`font-semibold ${
              laudoState.status === 'finalizado'
                ? 'text-emerald-700 dark:text-emerald-400'
                : laudoState.status === 'em_revisao'
                ? 'text-amber-700 dark:text-amber-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}>Revisão</span>
          </li>

          <span className="hidden sm:block flex-1 h-px bg-slate-200 dark:bg-slate-700 mx-3" />

          <li className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
              laudoState.artNumero && laudoState.artArquivoUrl
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-slate-300 dark:border-slate-700 text-slate-400'
            }`}>3</span>
            <span className={`font-semibold ${
              laudoState.artNumero && laudoState.artArquivoUrl
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-slate-400'
            }`}>ART anexada</span>
            <span className="text-[10px] font-mono text-slate-400 hidden md:inline">
              {laudoState.artNumero || 'pendente'}
            </span>
          </li>

          <span className="hidden sm:block flex-1 h-px bg-slate-200 dark:bg-slate-700 mx-3" />

          <li className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
              laudoState.status === 'finalizado'
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-slate-300 dark:border-slate-700 text-slate-400'
            }`}>4</span>
            <span className={`font-semibold ${
              laudoState.status === 'finalizado'
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}>Emitido</span>
            <span className="text-[10px] font-mono text-slate-400 hidden md:inline truncate max-w-[140px]">
              {laudoState.codigoVerificacao || '—'}
            </span>
          </li>
        </ol>
      </div>

      {/* Banner de Conversão de Layout (Orçamentos e Laudos antigos) */}
      {laudoState.layoutVersao !== 'novo-2026' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2.5 rounded-lg border border-blue-200 dark:border-blue-800/70 bg-blue-50/70 dark:bg-blue-950/25">
          <p className="text-[11.5px] text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-[#1565D8] shrink-0" />
            <span>
              Este laudo usa o modelo anterior. O novo modelo A4 (6 folhas vetoriais) organiza partes, normas, instrumentos, parecer e ART.
            </span>
          </p>
          <button
            onClick={() => setModalConverterLayoutAberto(true)}
            className="text-[11px] font-semibold text-[#1565D8] hover:underline underline-offset-2 shrink-0 text-left cursor-pointer"
          >
            Converter para o novo layout
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAINEL DE DADOS ESTRUTURADOS (PARTE C: PARECER, NCS, INSTRUMENTOS, NORMAS) */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#0B1324] px-4 sm:px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="font-semibold text-[13px] text-[#0B1E3D] dark:text-white">
            Campos estruturados de engenharia
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Fonte única dos dados técnicos das folhas normatizadas e das verificações da ART.
          </p>
        </div>

        {/* Abas */}
        <div role="tablist" className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 border-b border-slate-200 dark:border-slate-800 text-[11.5px]">
          <button
            type="button"
            role="tab"
            aria-selected={abaEstruturada === 'geral'}
            onClick={() => setAbaEstruturada('geral')}
            className={`-mb-px pb-2 border-b-2 font-semibold transition cursor-pointer ${
              abaEstruturada === 'geral'
                ? 'border-[#1565D8] text-[#1565D8] dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Ficha & vistoria
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={abaEstruturada === 'parecer'}
            onClick={() => setAbaEstruturada('parecer')}
            className={`-mb-px pb-2 border-b-2 font-semibold transition cursor-pointer ${
              abaEstruturada === 'parecer'
                ? 'border-[#1565D8] text-[#1565D8] dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Parecer técnico
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={abaEstruturada === 'ncs'}
            onClick={() => setAbaEstruturada('ncs')}
            className={`-mb-px pb-2 border-b-2 font-semibold transition cursor-pointer ${
              abaEstruturada === 'ncs'
                ? 'border-[#1565D8] text-[#1565D8] dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Não conformidades
            <span className="ml-1 font-mono text-[10px] text-slate-400">
              {laudoState.naoConformidadesEstruturadas?.length || 0}
            </span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={abaEstruturada === 'normas_instrumentos'}
            onClick={() => setAbaEstruturada('normas_instrumentos')}
            className={`-mb-px pb-2 border-b-2 font-semibold transition cursor-pointer ${
              abaEstruturada === 'normas_instrumentos'
                ? 'border-[#1565D8] text-[#1565D8] dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Normas & instrumentos
          </button>
        </div>

        <div className="pt-3.5">

        {/* Conteúdo da Aba 1: Ficha & Vistoria */}
        {abaEstruturada === 'geral' && (
          <div className="space-y-3">
            {erroClienteValidacao && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{erroClienteValidacao}</span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Cliente contratante *</label>
                <select
                  value={laudoState.clienteId || ''}
                  onChange={(e) => {
                    const novoId = e.target.value;
                    const cli = clientes.find(c => c.id === novoId);
                    if (!cli) {
                      agendarAutoSave({ ...laudoState, clienteId: '', clienteNome: '' });
                      return;
                    }
                    setErroClienteValidacao(null);
                    const prim = cli.contatos?.[0];
                    const endStr = cli.endereco?.cidade
                      ? `${cli.endereco.logradouro ? cli.endereco.logradouro + ', ' : ''}${cli.endereco.numero ? cli.endereco.numero + ' - ' : ''}${cli.endereco.bairro ? cli.endereco.bairro + ' - ' : ''}${cli.endereco.cidade}/${cli.endereco.estado || 'PE'}`.trim()
                      : laudoState.clienteEndereco;
                    agendarAutoSave({
                      ...laudoState,
                      clienteId: cli.id,
                      clienteNome: cli.nomeFantasia || cli.razaoSocial,
                      clienteCnpj: cli.cpfCnpj || cli.cnpj || '',
                      clienteContato: prim?.nome || laudoState.clienteContato || '',
                      clienteContatoCargo: prim?.cargo || laudoState.clienteContatoCargo || '',
                      clienteContatoTelefone: prim?.telefone || laudoState.clienteContatoTelefone || '',
                      clienteContatoEmail: prim?.email || laudoState.clienteContatoEmail || '',
                      clienteEndereco: endStr || '',
                    });
                  }}
                  className={`w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border text-slate-800 dark:text-slate-200 font-semibold ${
                    erroClienteValidacao ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <option value="">Selecione um cliente cadastrado...</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.nomeFantasia || c.razaoSocial}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Local da vistoria</label>
                <input
                  type="text"
                  value={laudoState.localVistoria || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    agendarAutoSave({ ...laudoState, localVistoria: val });
                  }}
                  placeholder="Ex: Recife, PE — Unidade Operacional"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Acompanhante</label>
                <input
                  type="text"
                  value={laudoState.acompanhanteVistoria || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    agendarAutoSave({ ...laudoState, acompanhanteVistoria: val });
                  }}
                  placeholder="Ex: Carlos Eduardo (Coord. Manutenção)"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Fabricante / modelo</label>
                <input
                  type="text"
                  value={`${laudoState.ativoFabricante || ''} ${laudoState.ativoModelo || ''}`.trim()}
                  onChange={(e) => {
                    const val = e.target.value;
                    agendarAutoSave({ ...laudoState, ativoFabricante: val });
                  }}
                  placeholder="Ex: Renault / Randon Munck"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Capacidade / série</label>
                <input
                  type="text"
                  value={`${laudoState.ativoCapacidade || ''} • Série ${laudoState.ativoNumeroSerie || ''}`.trim()}
                  onChange={(e) => {
                    const val = e.target.value;
                    agendarAutoSave({ ...laudoState, ativoCapacidade: val });
                  }}
                  placeholder="Ex: 12t • Série RD-2021-998"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo da Aba 2: Parecer Técnico & Justificativa */}
        {abaEstruturada === 'parecer' && (
          <div className="space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <label className="font-bold text-slate-700 dark:text-slate-300">Conclusão Pericial:</label>
                <select
                  value={laudoState.parecer || 'liberado_restricoes'}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    agendarAutoSave({ ...laudoState, parecer: val });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-slate-800 dark:text-white"
                >
                  <option value="liberado">Liberado para Operação</option>
                  <option value="liberado_restricoes">Liberado com Restrições</option>
                  <option value="nao_liberado">Não Liberado / Interditado</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleSugerirParecerAutomatico}
                className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-[#1565D8] dark:text-blue-300 font-bold flex items-center gap-1.5 border border-blue-200 dark:border-blue-800 cursor-pointer"
                title="Recalcula a conclusão técnica recomendada a partir da gravidade das Não Conformidades registradas"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Calcular Parecer por Gravidade de NCs</span>
              </button>
            </div>

            <div>
              <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">
                Justificativa técnica do parecer
              </label>
              <textarea
                value={laudoState.justificativaParecer || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  agendarAutoSave({ ...laudoState, justificativaParecer: val });
                }}
                rows={2}
                placeholder="Descreva o embasamento pericial para a conclusão adotada..."
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Próxima inspeção</label>
                <input
                  type="text"
                  value={laudoState.proximaInspecaoData || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    agendarAutoSave({ ...laudoState, proximaInspecaoData: val });
                  }}
                  placeholder="Ex: 30/10/2027 (Periodicidade Anual)"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Premissas e limitações</label>
                <input
                  type="text"
                  value={laudoState.premissasLimitacoes || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    agendarAutoSave({ ...laudoState, premissasLimitacoes: val });
                  }}
                  placeholder="Ex: Restrito a ensaios não destrutivos e inspeção visual..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo da Aba 3: Não Conformidades Estruturadas (NC) */}
        {abaEstruturada === 'ncs' && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold">
                Registro de Não Conformidades com Grau de Risco e Ação Corretiva:
              </span>
              <button
                type="button"
                onClick={() => {
                  const lista = laudoState.naoConformidadesEstruturadas || [];
                  const novoIdx = lista.length + 1;
                  const novaNC = {
                    id: `nc-${Date.now()}`,
                    codigo: `NC-${String(novoIdx).padStart(2, '0')}`,
                    titulo: `Não Conformidade ${novoIdx}`,
                    item: `Requisito ${novoIdx}`,
                    itemRef: `Item ${novoIdx}`,
                    descricao: 'Ausência de proteção ou elemento em desconformidade com a norma.',
                    risco: 'medio' as const,
                    classificacaoRisco: 'medio' as const,
                    acaoRecomendada: 'Instalar ou adequar conforme recomendação técnica.',
                    prazo: '30 dias',
                    prazoAdequacao: '30 dias',
                    responsavel: 'Equipe de Manutenção'
                  };
                  agendarAutoSave({
                    ...laudoState,
                    naoConformidadesEstruturadas: [...lista, novaNC]
                  });
                }}
                className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-[#1565D8] font-bold rounded-lg flex items-center gap-1 border border-blue-200 dark:border-blue-800 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Não Conformidade</span>
              </button>
            </div>

            {(!laudoState.naoConformidadesEstruturadas || laudoState.naoConformidadesEstruturadas.length === 0) ? (
              <div className="px-4 py-3 rounded-lg bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-semibold text-[12px]">Nenhuma não conformidade registrada</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">O equipamento pode ser classificado como totalmente liberado.</p>
                </div>
              </div>
            ) : (
              <div>
                {laudoState.naoConformidadesEstruturadas.map((nc, idx) => {
                  const codigo = nc.codigo || nc.id;
                  const risco = nc.classificacaoRisco || nc.risco || 'medio';
                  const prazo = nc.prazoAdequacao || nc.prazo || '30 dias';
                  const descricao = nc.descricao || nc.titulo;

                  return (
                    <div key={nc.id || idx} className="py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0 flex flex-col md:flex-row md:items-start justify-between gap-2">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <strong className="font-mono text-rose-600 dark:text-rose-400 font-bold">{codigo}</strong>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            risco === 'critico' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                            risco === 'alto' ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300' :
                            risco === 'medio' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          }`}>
                            Risco {risco.toUpperCase()}
                          </span>
                          <span className="text-slate-400">• Prazo: <b>{prazo}</b></span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 font-medium">{descricao}</p>
                        <p className="text-slate-500 text-[11px]">Ação: {nc.acaoRecomendada}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const filtradas = laudoState.naoConformidadesEstruturadas!.filter((_, i) => i !== idx);
                          agendarAutoSave({
                            ...laudoState,
                            naoConformidadesEstruturadas: filtradas
                          });
                        }}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg cursor-pointer"
                        title="Excluir NC"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Conteúdo da Aba 4: Normas & Instrumentos */}
        {abaEstruturada === 'normas_instrumentos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Normas */}
            <div className="space-y-2">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">
                Normas Técnicas de Referência (com Edição expressa):
              </span>
              <div className="space-y-1.5">
                {(laudoState.normasLista || []).map((norma, idx) => {
                  const normaTexto = typeof norma === 'string' 
                    ? norma 
                    : `${norma.norma} — ${norma.titulo}${norma.edicao ? ` (${norma.edicao})` : ''}`;

                  return (
                    <div key={idx} className="flex items-center gap-2 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                      <span className="flex-1 font-medium text-slate-800 dark:text-slate-200">{normaTexto}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const lista = laudoState.normasLista!.filter((_, i) => i !== idx);
                          agendarAutoSave({ ...laudoState, normasLista: lista });
                        }}
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instrumentos */}
            <div className="space-y-2">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">
                Instrumentos Metrológicos Utilizados (Rastreabilidade RBC):
              </span>
              <div className="space-y-1.5">
                {(laudoState.instrumentos || []).map((inst, idx) => {
                  const cert = inst.certificadoNumero || inst.certificado || 'RBC';
                  const venc = inst.calibracaoValidade || inst.validadeCalibracao || 'Válida';

                  return (
                    <div key={inst.id || idx} className="py-2 border-b border-slate-100 dark:border-slate-800 last:border-0 flex items-center justify-between">
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200 block">{inst.nome}</strong>
                        <span className="text-[11px] text-slate-500 font-mono">
                          Cert.: {cert} • Venc.: {venc}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const lista = laudoState.instrumentos!.filter((_, i) => i !== idx);
                          agendarAutoSave({ ...laudoState, instrumentos: lista });
                        }}
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        </div>
      </div>

      {/* Visualização de Folhas A4 Claras em Tempo Real se selecionado */}
      {modoExibicao === 'folhas' && (
        <div className="p-4 sm:p-6 bg-slate-300 dark:bg-slate-900 rounded-2xl flex flex-col items-center gap-4">
          <div className="w-full flex items-center justify-between px-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Visualização Fiel do Documento A4 (6 Folhas Vetoriais)
            </span>
            <button
              onClick={() => navigate(`/admin/laudos/${laudoState.id}/imprimir`)}
              className="px-3.5 py-1.5 bg-[#1565D8] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-blue-700 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar PDF</span>
            </button>
          </div>
          <LaudoDocSheets
            laudo={laudoState}
            cliente={cliente}
            ativo={ativo}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* AVISO FIXO: LAUDO INICIADO COM SUGESTÕES DE IA                           */}
      {/* ========================================================================= */}
      {laudoState.iniciadoComIA && (
        <div className="flex items-start gap-2.5 px-4 py-2.5 rounded-lg border border-amber-200 dark:border-amber-800/70 bg-amber-50/70 dark:bg-amber-950/25">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-[11.5px] leading-relaxed">
            <span className="font-semibold text-amber-900 dark:text-amber-200">
              Preenchimento assistido por IA (rascunho preliminar).
            </span>{' '}
            <span className="text-amber-900/90 dark:text-amber-200/80">
              Revise e valide todas as informações antes da emissão final. O conteúdo sugerido não substitui a vistoria técnica presencial.
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CARD DE FOTO DA CAPA DO LAUDO (EQUIPAMENTO / INSTALAÇÃO)                  */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#0B1324] px-4 sm:px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <input 
          type="file" 
          ref={capaFileInputRef} 
          onChange={handleCapaFotoUpload} 
          accept="image/*" 
          className="hidden" 
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-[13px] text-[#0B1E3D] dark:text-white flex flex-wrap items-center gap-2">
              <Camera className="w-3.5 h-3.5 text-[#1565D8]" />
              Foto de capa do laudo
              {laudoState.capaFotoUrl ? (
                <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  Configurada
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  Opcional
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Impressa em destaque na 1ª página (capa oficial) do PDF.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => capaFileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5 text-[#1565D8]" />
              <span>{laudoState.capaFotoUrl ? 'Substituir foto' : 'Enviar foto'}</span>
            </button>
            {laudoState.capaFotoUrl && (
              <button
                type="button"
                onClick={handleRemoverCapaFoto}
                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 cursor-pointer"
                title="Remover foto da capa"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {laudoState.capaFotoUrl ? (
          <div className="pt-3.5 flex flex-col sm:flex-row items-start gap-4">
            <div 
              className="relative group cursor-pointer shrink-0 rounded-lg overflow-hidden border border-[#1565D8]/40 w-full sm:w-56 h-36 bg-slate-900 flex items-center justify-center"
              onClick={() => setModalVisualizarImagemUrl({ url: laudoState.capaFotoUrl!, titulo: laudoState.capaFotoLegenda || 'Foto da Capa do Laudo' })}
            >
              <img 
                src={laudoState.capaFotoUrl} 
                alt="Capa do Laudo" 
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-semibold gap-1">
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Ampliar</span>
              </div>
            </div>

            <div className="flex-1 space-y-2 text-xs w-full">
              <label className="block text-[10.5px] font-semibold text-slate-500">
                Legenda da fotografia de capa
              </label>
              <input
                type="text"
                value={laudoState.capaFotoLegenda || ''}
                onChange={(e) => handleCapaLegendaChange(e.target.value)}
                placeholder="Ex: Foto frontal do equipamento auditado em suas instalações operacionais"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
        ) : (
          <div 
            onClick={() => capaFileInputRef.current?.click()}
            className="mt-3 px-4 py-3 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-700 text-center cursor-pointer transition-colors"
          >
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Nenhuma foto vinculada. Clique para carregar uma imagem do equipamento (PNG, JPG, WEBP).
            </p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MAIN WORKSPACE: SECTIONS SIDEBAR + WYSIWYG DOCUMENT EDITOR                */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Sections List & Management (4 cols on lg) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0B1324] rounded-xl border border-slate-200 dark:border-slate-800">
          
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-[13px] text-[#0B1E3D] dark:text-white">
              Estrutura do laudo
              <span className="ml-1.5 font-mono text-[10px] text-slate-400">
                {laudoState.secoes.length}
              </span>
            </h3>

            <button
              onClick={() => {
                setNovaSecaoTitulo('');
                setModalNovaSecaoAberto(true);
              }}
              className="px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-[#1565D8] dark:text-blue-400 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
              title="Adicionar nova seção"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova seção</span>
            </button>
          </div>

          {/* Sections List */}
          <div className="max-h-[600px] overflow-y-auto">
            {laudoState.secoes.map((secao, idx) => {
              const isAtiva = secao.id === secaoAtiva?.id;

              return (
                <div
                  key={secao.id}
                  className={`relative group flex items-center gap-2 pl-3.5 pr-1.5 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors ${
                    isAtiva
                      ? 'bg-blue-50/70 dark:bg-blue-950/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-900/50'
                  }`}
                >
                  {isAtiva && (
                    <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#1565D8]" />
                  )}
                  {/* Title or Inline Edit */}
                  <div 
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => setSecaoAtivaId(secao.id)}
                  >
                    {editandoSecaoId === secao.id ? (
                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <input
                          type="text"
                          value={tituloEditando}
                          onChange={e => setTituloEditando(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleSalvarTituloSecao(secao.id);
                            if (e.key === 'Escape') setEditandoSecaoId(null);
                          }}
                          autoFocus
                          className="w-full px-2 py-0.5 text-xs rounded border border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                        <button
                          onClick={() => handleSalvarTituloSecao(secao.id)}
                          className="p-1 rounded bg-blue-600 text-white cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <span
                          title={secao.titulo}
                          className={`text-[11.5px] font-medium truncate block ${
                          isAtiva ? 'text-[#1565D8] dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'
                        } ${secao.ocultaNoPdf ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                          {secao.titulo}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[9px] font-mono text-slate-400">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          {secao.ocultaNoPdf && (
                            <span className="text-[9px] font-semibold text-amber-600 dark:text-amber-400">
                              oculta no PDF
                            </span>
                          )}
                          {secao.isObrigatoria && (
                            <span className="text-[9px] text-slate-400">
                              obrigatória
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions for this section: Hide/Show in PDF, Reorder, Rename, Delete */}
                  <div className="flex items-center gap-0.5 shrink-0 transition-opacity opacity-70 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleOcultarSecao(secao.id);
                      }}
                      className={`p-1 rounded transition-colors cursor-pointer ${
                        secao.ocultaNoPdf
                          ? 'text-amber-500 hover:text-amber-700 bg-amber-50 dark:bg-amber-950/40'
                          : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
                      }`}
                      title={secao.ocultaNoPdf ? "Seção OCULTA do PDF (Clique para incluir no PDF)" : "Seção VISÍVEL no PDF (Clique para ocultar)"}
                    >
                      {secao.ocultaNoPdf ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleMoverSecaoCima(idx)}
                      disabled={idx === 0}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-20 cursor-pointer"
                      title="Mover para Cima"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoverSecaoBaixo(idx)}
                      disabled={idx === laudoState.secoes.length - 1}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-20 cursor-pointer"
                      title="Mover para Baixo"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setEditandoSecaoId(secao.id);
                        setTituloEditando(secao.titulo);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                      title="Renomear Título da Seção"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleRemoverSecao(secao.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                      title="Excluir Seção"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 text-[10.5px] text-slate-400">
            Clique para editar. Use as setas para reordenar.
          </p>

        </div>

        {/* Right Column: Active Section WYSIWYG Editor (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-3">
          
          {secaoAtiva ? (
            <div className="bg-white dark:bg-[#0B1324] rounded-xl border border-slate-200 dark:border-slate-800">
              
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 sm:px-5 py-3 border-b border-slate-100 dark:border-slate-800">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9.5px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                      Seção {secaoAtiva.ordem}
                    </span>
                    {secaoAtiva.isObrigatoria && (
                      <span className="text-[9.5px] font-semibold text-amber-600 dark:text-amber-400">
                        obrigatória por norma
                      </span>
                    )}
                  </div>
                  <h2 className="text-[15px] font-semibold text-[#0B1E3D] dark:text-white truncate">
                    {secaoAtiva.titulo}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleOcultarSecao(secaoAtiva.id)}
                    className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
                      secaoAtiva.ocultaNoPdf
                        ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                        : 'text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title={secaoAtiva.ocultaNoPdf ? 'Seção oculta no PDF — clique para incluir' : 'Seção visível no PDF — clique para ocultar'}
                  >
                    {secaoAtiva.ocultaNoPdf ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => {
                      setEditandoSecaoId(secaoAtiva.id);
                      setTituloEditando(secaoAtiva.titulo);
                    }}
                    className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    title="Renomear título da seção"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <span className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

                  <button
                    type="button"
                    onClick={() => {
                      if (!secaoAtiva) return;
                      const minuta = gerarMinutaTecnicaSecao(
                        secaoAtiva.titulo,
                        { nome: taxonomyDetails.tipoNome, normasRef: laudoState.normasReferencia },
                        { clienteNome: cliente?.razaoSocial, ativoIdentificacao: ativo?.identificacao }
                      );
                      const novasSecoes = laudoState.secoes.map(s => {
                        if (s.id === secaoAtiva.id) {
                          return { ...s, conteudoHtml: minuta };
                        }
                        return s;
                      });
                      agendarAutoSave({
                        ...laudoState,
                        secoes: novasSecoes,
                      });
                    }}
                    title="Preencher com minuta técnica padrão de engenharia para esta seção"
                    className="px-2 py-1 rounded-md text-[#1565D8] dark:text-blue-400 text-[11px] font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Minuta</span>
                  </button>
                  <button
                    onClick={() => setModalIaAberto(true)}
                    className="px-2 py-1 rounded-md text-purple-700 dark:text-purple-300 text-[11px] font-semibold hover:bg-purple-50 dark:hover:bg-purple-950/40 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>IA</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSecaoParaRemoverConfirm(secaoAtiva)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                    title="Excluir esta seção do laudo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="px-4 sm:px-5 py-4 space-y-4">

              {/* Banner if section is hidden from PDF */}
              {secaoAtiva.ocultaNoPdf && (
                <div className="px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-3 text-[11px] text-amber-900 dark:text-amber-200">
                  <div className="flex items-center gap-2">
                    <EyeOff className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>
                      Seção <strong>oculta no PDF</strong>. O conteúdo permanece salvo e editável, mas não sai na versão impressa.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleOcultarSecao(secaoAtiva.id)}
                    className="px-2 py-0.5 rounded bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-semibold shrink-0 cursor-pointer"
                  >
                    Tornar visível
                  </button>
                </div>
              )}

              {/* TipTap Rich Text Editor for this section */}
              <div>
                <TipTapEditor
                  key={secaoAtiva.id}
                  contentHtml={secaoAtiva.conteudoHtml || ''}
                  contentJson={secaoAtiva.conteudoJson}
                  onChange={handleContentChange}
                  placeholder={`Redija o conteúdo técnico para ${secaoAtiva.titulo}...`}
                />
              </div>

              {/* Evidências Fotográficas & Fotos desta Seção */}
              <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                <input
                  type="file"
                  ref={secaoFotoInputRef}
                  onChange={handleFotoSecaoUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                    Evidências fotográficas
                    <span className="font-mono text-[10px] text-slate-400">
                      {secaoAtiva.fotos?.length || 0}
                    </span>
                  </h4>
                  <span className="text-[10.5px] text-slate-400">
                    Legende a foto e insira no texto com um clique
                  </span>
                </div>

                {/* Upload Form for Section Photo */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={legendaNovaFotoSecao}
                    onChange={(e) => setLegendaNovaFotoSecao(e.target.value)}
                    placeholder="Legenda da foto (Ex: Foto 1: Desgaste abrasivo no dente da engrenagem)"
                    className="flex-1 px-3 py-1.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-800 dark:text-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => secaoFotoInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </button>
                </div>

                {/* Photos Grid for this Section */}
                {secaoAtiva.fotos && secaoAtiva.fotos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                    {secaoAtiva.fotos.map((foto) => (
                      <div 
                        key={foto.id}
                        className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5 flex flex-col justify-between overflow-hidden"
                      >
                        <div 
                          className="relative group overflow-hidden h-36 bg-slate-50 dark:bg-slate-800/80 cursor-pointer flex items-center justify-center p-1"
                          onClick={() => setModalVisualizarImagemUrl({ url: foto.url, titulo: foto.descricao })}
                        >
                          <img 
                            src={foto.url} 
                            alt={foto.descricao || 'Evidência'} 
                            className="max-w-full max-h-full object-contain"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-semibold gap-1">
                            <ZoomIn className="w-3.5 h-3.5" />
                            <span>Ampliar</span>
                          </div>
                        </div>

                        <p className="px-2 text-[10.5px] text-slate-600 dark:text-slate-300 line-clamp-2">
                          {foto.descricao || 'Evidência sem legenda'}
                        </p>

                        <div className="flex items-center gap-1 px-2 pb-1.5">
                          <button
                            type="button"
                            onClick={() => handleInserirFotoNoTexto(foto.url, foto.descricao)}
                            className="flex-1 py-0.5 px-1.5 rounded text-[#1565D8] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-[10.5px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                            title="Inserir esta foto no corpo de texto do laudo"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Inserir no texto</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoverFotoSecao(foto.id)}
                            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                            title="Excluir Evidência"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10.5px] text-slate-400">
                    Nenhuma foto cadastrada nesta seção.
                  </p>
                )}
              </div>

              </div>

            </div>
          ) : (
            <div className="bg-white dark:bg-[#0B1324] px-6 py-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <p className="text-slate-500 text-xs">Nenhuma seção selecionada para edição.</p>
            </div>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* SEÇÃO OFICIAL DE ANEXO DA ART (CREA-PE)                                   */}
      {/* Suporta upload de arquivo em PDF ou Imagem                               */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#0B1324] rounded-xl border border-slate-200 dark:border-slate-800">
        <input
          type="file"
          ref={artFileInputRef}
          onChange={handleArtArquivoUpload}
          accept="image/*,application/pdf"
          className="hidden"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-slate-100 dark:border-slate-800">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-[13px] text-[#0B1E3D] dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Anexo da ART
                <span className="font-normal text-slate-400">· CREA-PE</span>
              </h3>
              {laudoState.artArquivoUrl ? (
                <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  Anexada
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                  Obrigatória para finalizar
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Arquivo oficial emitido pelo CREA-PE, em PDF ou imagem.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => artFileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{laudoState.artArquivoUrl ? 'Substituir arquivo' : 'Anexar ART'}</span>
            </button>
            {laudoState.artArquivoUrl && (
              <button
                type="button"
                onClick={handleRemoverArt}
                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                title="Remover anexo da ART"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="px-4 sm:px-5 py-4">
        {laudoState.artArquivoUrl ? (
          <div className="space-y-3">
            {/* Metadados e ações da ART */}
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">
                    Nº da ART CREA-PE
                  </label>
                  <input
                    type="text"
                    value={laudoState.artNumero || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setArtNumeroInput(val);
                      agendarAutoSave({ ...laudoState, artNumero: val });
                    }}
                    placeholder="Ex: PE20261822299"
                    className="w-48 px-3 py-1.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs font-semibold text-[#0B1E3D] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">
                    Data de registro
                  </label>
                  <input
                    type="date"
                    value={laudoState.artDataHomologacao ? laudoState.artDataHomologacao.split('T')[0] : ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      agendarAutoSave({ ...laudoState, artDataHomologacao: val });
                    }}
                    className="px-3 py-1.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const urlVisual = artImagemVisual || laudoState.artArquivoUrl!;
                    setModalVisualizarImagemUrl({
                      url: urlVisual,
                      titulo: `Documento da ART CREA-PE: ${laudoState.artNumero || 'Oficial'}`
                    });
                  }}
                  className="px-2.5 py-1.5 rounded-md text-[#1565D8] dark:text-blue-400 text-[11px] font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center gap-1 cursor-pointer"
                  title="Ampliar ART em tela cheia"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Ampliar</span>
                </button>
                <a
                  href={laudoState.artArquivoUrl}
                  download={laudoState.artNomeArquivo || 'ART_CREA_PE.pdf'}
                  className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  title="Baixar arquivo original da ART"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Visualização da ART */}
            <div className="w-full bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
              {carregandoArtImagem ? (
                <div className="py-10 flex flex-col items-center gap-2 text-slate-500">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                  <span className="text-[11px] font-medium">Renderizando documento da ART...</span>
                </div>
              ) : artImagemVisual ? (
                <div className="relative group max-w-xl w-full flex flex-col items-center">
                  <div 
                    onClick={() => setModalVisualizarImagemUrl({
                      url: artImagemVisual,
                      titulo: `Anotação de Responsabilidade Técnica (ART — CREA-PE) Nº ${laudoState.artNumero || 'Oficial'}`
                    })}
                    className="cursor-pointer bg-white rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden relative p-1"
                    title="Clique para ampliar em tela cheia"
                  >
                    <img 
                      src={artImagemVisual} 
                      alt="Documento Oficial da ART CREA-PE" 
                      className="max-h-[420px] w-auto max-w-full object-contain mx-auto rounded"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded">
                      <span className="px-3 py-1.5 rounded-md bg-white/95 text-slate-900 text-[11px] font-semibold flex items-center gap-1.5 shadow">
                        <ZoomIn className="w-3.5 h-3.5 text-[#1565D8]" />
                        Ampliar em tela cheia
                      </span>
                    </div>
                  </div>
                </div>
              ) : laudoState.artArquivoUrl ? (
                <div className="relative group max-w-xl w-full flex flex-col items-center">
                  <div 
                    onClick={() => setModalVisualizarImagemUrl({
                      url: laudoState.artArquivoUrl!,
                      titulo: `ART CREA-PE: ${laudoState.artNumero || 'Oficial'}`
                    })}
                    className="cursor-pointer bg-white rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden p-1"
                  >
                    <img 
                      src={laudoState.artArquivoUrl} 
                      alt="Documento Oficial da ART CREA-PE" 
                      className="max-h-[420px] w-auto max-w-full object-contain mx-auto rounded"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div
            onClick={() => artFileInputRef.current?.click()}
            className="px-4 py-4 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-700 text-center cursor-pointer transition-colors"
          >
            <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              Clique para anexar o arquivo da ART (PDF ou imagem)
            </p>
            <p className="text-[10.5px] text-slate-400 mt-0.5">
              Arquivo baixado do portal do CREA-PE ou foto legível da guia de ART.
            </p>
          </div>
        )}
        </div>
      </div>

      {/* MODAL: VISUALIZAR IMAGEM EM ALTA RESOLUÇÃO */}
      {modalVisualizarImagemUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 dark:text-white truncate">
                {modalVisualizarImagemUrl.titulo || 'Visualização de Imagem'}
              </span>
              <button
                onClick={() => setModalVisualizarImagemUrl(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-slate-950">
              <img
                src={modalVisualizarImagemUrl.url}
                alt="Visualização"
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VISUALIZAR ART (PDF EMBED) */}
      {modalVisualizarArtAberto && laudoState.artArquivoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-600" />
                <span className="font-bold text-xs text-slate-800 dark:text-white">
                  Documento Anexo da ART: {laudoState.artNomeArquivo || 'ART CREA-PE'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={laudoState.artArquivoUrl}
                  download={laudoState.artNomeArquivo || 'ART_CREA_PE.pdf'}
                  className="px-3 py-1 rounded-lg bg-blue-50 text-[#1565D8] text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar Arquivo</span>
                </a>
                <button
                  onClick={() => setModalVisualizarArtAberto(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-2">
              <iframe
                src={laudoState.artArquivoUrl}
                title="ART PDF Preview"
                className="w-full h-full rounded-lg border border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADICIONAR NOVA SEÇÃO                                              */}
      {/* ========================================================================= */}
      {modalNovaSecaoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#1565D8]" />
                <h3 className="font-bold text-base text-[#0B1E3D] dark:text-white">
                  Adicionar Nova Seção ao Laudo
                </h3>
              </div>
              <button 
                onClick={() => setModalNovaSecaoAberto(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Modelo Pré-formatado ou Personalizado:
                </label>
                <select
                  value={novaSecaoPreset}
                  onChange={(e) => {
                    setNovaSecaoPreset(e.target.value);
                    if (e.target.value !== 'custom') {
                      const preset = PRESET_SECTIONS.find(p => p.tipo === e.target.value);
                      if (preset) setNovaSecaoTitulo(preset.titulo);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                >
                  <option value="custom">-- Seção Personalizada em Branco --</option>
                  {PRESET_SECTIONS.map(p => (
                    <option key={p.tipo} value={p.tipo}>
                      {p.titulo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Título da Seção:
                </label>
                <input
                  type="text"
                  value={novaSecaoTitulo}
                  onChange={(e) => setNovaSecaoTitulo(e.target.value)}
                  placeholder="Ex: 4. Ensaio de Carga e Medições de Deflexão"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setModalNovaSecaoAberto(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarNovaSecao}
                disabled={!novaSecaoTitulo.trim()}
                className="px-4 py-2 rounded-xl bg-[#1565D8] hover:bg-[#0b4fb8] text-white text-xs font-bold disabled:opacity-50 cursor-pointer"
              >
                Adicionar Seção
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: HISTÓRICO DE REVISÕES                                             */}
      {/* ========================================================================= */}
      {modalRevisoesAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#1565D8]" />
                <h3 className="font-bold text-base text-[#0B1E3D] dark:text-white">
                  Histórico de Revisões & Auditoria Técnica
                </h3>
              </div>
              <button 
                onClick={() => setModalRevisoesAberto(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of Revisions */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
              {(!laudoState.revisoes || laudoState.revisoes.length === 0) ? (
                <div className="text-center py-6 text-slate-400 space-y-1">
                  <Clock className="w-8 h-8 mx-auto text-slate-300" />
                  <p>Nenhum marco de revisão registrado formalmente.</p>
                  <p className="text-[11px]">As alterações são salvas automaticamente em tempo real.</p>
                </div>
              ) : (
                laudoState.revisoes.map((rev) => (
                  <div 
                    key={rev.id} 
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <strong className="text-slate-900 dark:text-white font-semibold">
                        {rev.usuarioNome}
                      </strong>
                      <span className="text-slate-400 font-mono text-[10px]">
                        {new Date(rev.dataHora).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      {rev.descricao}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Add Revision Milestone */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 shrink-0">
              <label className="font-bold text-slate-700 dark:text-slate-300 block text-xs">
                Registrar Marco Formal de Revisão:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={novaNotaRevisao}
                  onChange={(e) => setNovaNotaRevisao(e.target.value)}
                  placeholder="Ex: Revisão pós-inspeção presencial com cliente"
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                />
                <button
                  onClick={handleAdicionarNotaRevisao}
                  disabled={!novaNotaRevisao.trim()}
                  className="px-4 py-2 rounded-xl bg-[#1565D8] hover:bg-[#0b4fb8] text-white text-xs font-bold disabled:opacity-50 cursor-pointer"
                >
                  Registrar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ASSISTENTE IA DE REDAÇÃO TÉCNICA                                  */}
      {/* ========================================================================= */}
      {modalIaAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-base text-[#0B1E3D] dark:text-white">
                  Assistente IA de Redação Pericial
                </h3>
              </div>
              <button 
                onClick={() => setModalIaAberto(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                Selecione uma diretriz para que a inteligência artificial formule ou expanda o texto técnico na seção ativa: <strong className="text-purple-600 font-semibold">{secaoAtiva?.titulo}</strong>.
              </p>

              <div className="space-y-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  Instrução Técnica Pericial:
                </label>
                <textarea
                  rows={3}
                  value={promptIa}
                  onChange={(e) => setPromptIa(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setPromptIa('Melhorar redação técnica conforme ABNT e NRs')}
                  className="px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200 hover:bg-purple-100 cursor-pointer"
                >
                  Conformidade ABNT / NRs
                </button>
                <button
                  type="button"
                  onClick={() => setPromptIa('Formular parecer conclusivo pericial fundamentado')}
                  className="px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200 hover:bg-purple-100 cursor-pointer"
                >
                  Conclusão Pericial
                </button>
                <button
                  type="button"
                  onClick={() => setPromptIa('Apreciação de risco quantitativa preliminar')}
                  className="px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200 hover:bg-purple-100 cursor-pointer"
                >
                  Apreciação de Risco
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setModalIaAberto(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleAplicarIa}
                disabled={carregandoIa}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {carregandoIa ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processando Redação...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Inserir na Seção</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: FINALIZAR LAUDO COM ART                                            */}
      {/* ========================================================================= */}
      {modalFinalizarAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-[#0B1E3D] dark:text-white">
                  Homologar Laudo & Registrar ART CREA-PE
                </h3>
              </div>
              <button 
                onClick={() => setModalFinalizarAberto(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                A finalização confere <strong>fé pública</strong> técnica ao documento pericial e bloqueia alterações acidentais de conteúdo.
              </p>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Número da Anotação de Responsabilidade Técnica (ART):
                </label>
                <input
                  type="text"
                  value={artNumeroInput}
                  onChange={(e) => setArtNumeroInput(e.target.value)}
                  placeholder="Ex: PE20261822299"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="concordo-art"
                    checked={termoAceito}
                    onChange={(e) => setTermoAceito(e.target.checked)}
                    className="mt-0.5 rounded text-[#1565D8]"
                  />
                  <label htmlFor="concordo-art" className="text-[11px] text-slate-700 dark:text-slate-300 leading-tight">
                    Declaro, sob as penas da lei e em observância ao Código de Ética Profissional do Sistema CONFEA/CREA, que a vistoria foi realizada conforme as normas técnicas vigentes e com registro de ART válido.
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setModalFinalizarAberto(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarFinalizacao}
                disabled={!artNumeroInput.trim() || !termoAceito}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Homologar e Finalizar</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EXPORTAR PDF OFICIAL VL ENGENHARIA                                 */}
      {/* ========================================================================= */}
      {modalPdfAberto && (
        <LaudoPdfExportModal
          laudo={laudoState}
          cliente={cliente}
          ativo={ativo}
          isOpen={modalPdfAberto}
          onClose={() => setModalPdfAberto(false)}
          onAtualizarSecoes={(novasSecoes) => {
            agendarAutoSave({
              ...laudoState,
              secoes: novasSecoes,
            });
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL: CONFIRMAÇÃO DE EXCLUSÃO DE SEÇÃO                                   */}
      {/* ========================================================================= */}
      {secaoParaRemoverConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 bg-red-100 dark:bg-red-950/50 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Excluir Seção do Laudo?
                </h3>
                <p className="text-xs text-slate-500">
                  Esta ação removerá a seção e o seu conteúdo deste documento.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <p className="font-bold text-slate-800 dark:text-slate-200">
                "{secaoParaRemoverConfirm.titulo}"
              </p>
              {secaoParaRemoverConfirm.isObrigatoria && (
                <p className="text-amber-600 dark:text-amber-400 mt-1 font-semibold">
                  ⚠️ Esta seção é categorizada como recomendada por norma técnica.
                </p>
              )}
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Dica: Se você deseja apenas que ela não saia na impressão do PDF sem perder o conteúdo digitado, utilize o botão <strong>"Ocultar do PDF"</strong>.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSecaoParaRemoverConfirm(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmarRemoverSecao}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-sm"
              >
                Sim, Excluir Seção
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: IMPORTAR CHECKLIST DE CAMPO                                        */}
      {/* ========================================================================= */}
      {modalImportarChecklistAberto && (
        <ImportarChecklistCampoModal
          contexto="laudo"
          clienteId={laudoState.clienteId}
          ativoId={laudoState.ativoId}
          onClose={() => setModalImportarChecklistAberto(false)}
          onImportar={handleImportarChecklist}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL: ASSOCIAR / GERENCIAR ORÇAMENTO COMERCIAL VINCULADO                 */}
      {/* ========================================================================= */}
      {modalAssociarOrcamentoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 max-h-[90vh] flex flex-col space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Associar Orçamento ao Laudo {laudoState.numero}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Vincule a proposta comercial técnica finalizada para rastreabilidade financeira e contratual.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalAssociarOrcamentoAberto(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Currently Associated Proposal */}
            {laudoState.orcamentoOrigemId ? (
              (() => {
                const orcAtual = orcamentos.find(o => o.id === laudoState.orcamentoOrigemId);
                return (
                  <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Orçamento Atualmente Vinculado</span>
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                        {orcAtual?.status || 'Aprovado'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Código da Proposta:</span>
                        <strong className="text-slate-900 dark:text-white font-mono text-sm">
                          {orcAtual?.codigoProposta || laudoState.orcamentoNumero || orcAtual?.id}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Serviço / Objeto:</span>
                        <span className="text-slate-700 dark:text-slate-300 font-semibold truncate block">
                          {orcAtual?.servico || 'Perícia Técnica Mecânica'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Cliente:</span>
                        <span className="text-slate-700 dark:text-slate-300">
                          {orcAtual?.clienteNome || laudoState.clienteNome}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Investimento:</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold font-mono">
                          {orcAtual?.valorFormatado || (orcAtual?.valor ? `R$ ${orcAtual.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 3.500,00')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60">
                      <button
                        type="button"
                        onClick={() => navigate('/admin/orcamentos')}
                        className="text-xs text-[#1565D8] dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Ver no Módulo de Orçamentos</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Deseja desassociar este orçamento do laudo?')) {
                            associarOrcamentoAoLaudo(laudoState.orcamentoOrigemId!, null);
                            const updated = {
                              ...laudoState,
                              orcamentoOrigemId: undefined,
                              orcamentoNumero: undefined,
                            };
                            agendarAutoSave(updated);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold cursor-pointer"
                      >
                        Desvincular Orçamento
                      </button>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>Nenhum orçamento está vinculado a este laudo no momento. Selecione uma das propostas abaixo para vincular.</span>
              </div>
            )}

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={buscaOrcamentoModal}
                  onChange={(e) => setBuscaOrcamentoModal(e.target.value)}
                  placeholder="Buscar por código, serviço ou cliente..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={() => setFiltroApenasMesmoCliente(!filtroApenasMesmoCliente)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  filtroApenasMesmoCliente 
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-[#1565D8] dark:text-blue-300' 
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <span>{filtroApenasMesmoCliente ? 'Mesmo Cliente' : 'Todos Clientes'}</span>
              </button>
            </div>

            {/* List of Proposals */}
            <div className="flex-1 overflow-y-auto space-y-2 max-h-60 pr-1">
              {(() => {
                const termo = buscaOrcamentoModal.trim().toLowerCase();
                const listaFiltrada = orcamentos.filter(o => {
                  if (filtroApenasMesmoCliente && o.clienteId !== laudoState.clienteId) return false;
                  if (!termo) return true;
                  return (
                    (o.codigoProposta && o.codigoProposta.toLowerCase().includes(termo)) ||
                    o.id.toLowerCase().includes(termo) ||
                    o.servico.toLowerCase().includes(termo) ||
                    (o.clienteNome && o.clienteNome.toLowerCase().includes(termo))
                  );
                });

                if (listaFiltrada.length === 0) {
                  return (
                    <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                      <p>Nenhuma proposta comercial encontrada com os filtros atuais.</p>
                      {filtroApenasMesmoCliente && (
                        <button
                          type="button"
                          onClick={() => setFiltroApenasMesmoCliente(false)}
                          className="text-xs text-[#1565D8] dark:text-blue-400 underline font-semibold"
                        >
                          Exibir propostas de todos os clientes
                        </button>
                      )}
                    </div>
                  );
                }

                return listaFiltrada.map(orc => {
                  const isJaVinculadoAOutro = orc.laudoGeradoId && orc.laudoGeradoId !== laudoState.id;
                  const isVinculadoAEste = orc.id === laudoState.orcamentoOrigemId || orc.laudoGeradoId === laudoState.id;

                  return (
                    <div
                      key={orc.id}
                      className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isVinculadoAEste
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700'
                          : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                            {orc.codigoProposta || orc.id}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            orc.status === 'aprovado'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                          }`}>
                            {orc.status}
                          </span>
                          {isVinculadoAEste && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-600 text-white">
                              VINCULADO
                            </span>
                          )}
                          {isJaVinculadoAOutro && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                              Vinculado a outro laudo
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {orc.servico}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                          <span>{orc.clienteNome}</span>
                          <span>•</span>
                          <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                            {orc.valorFormatado || `R$ ${orc.valor.toLocaleString('pt-BR')}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isVinculadoAEste ? (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Check className="w-4 h-4" />
                            <span>Vinculado</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              associarOrcamentoAoLaudo(orc.id, laudoState.id);
                              const updated = {
                                ...laudoState,
                                orcamentoOrigemId: orc.id,
                                orcamentoNumero: orc.codigoProposta || orc.id,
                              };
                              agendarAutoSave(updated);
                              setModalAssociarOrcamentoAberto(false);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#1565D8] hover:bg-[#0b4fb8] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                          >
                            Vincular a Este Laudo
                          </button>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setModalAssociarOrcamentoAberto(false);
                  navigate('/admin/orcamentos');
                }}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline font-semibold"
              >
                Ir para Todas as Propostas
              </button>

              <button
                type="button"
                onClick={() => setModalAssociarOrcamentoAberto(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer shadow-xs"
              >
                Concluir
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal: Confirmação de Exclusão Definitiva do Laudo */}
      {modalExcluirLaudoAberto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Excluir Laudo Definitivamente</h3>
                  <p className="text-xs text-slate-500">Ação irreversível</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalExcluirLaudoAberto(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <p className="text-slate-700 dark:text-slate-300">
                Tem certeza de que deseja excluir permanentemente o laudo <strong className="font-mono text-slate-900 dark:text-white">{laudoState.numero}</strong>?
              </p>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <div><strong>Tipo:</strong> {laudoState.tipo}</div>
                <div><strong>Cliente:</strong> {laudoState.clienteNome}</div>
                <div><strong>Ativo:</strong> {laudoState.ativoIdentificacao}</div>
                <div><strong>Status atual:</strong> {laudoState.status === 'finalizado' ? 'ART emitida / Preenchido e Concluído' : laudoState.status === 'em_andamento' ? 'Em elaboração' : 'Rascunho'}</div>
                {laudoState.artNumero && <div><strong>ART:</strong> <span className="font-mono">{laudoState.artNumero}</span></div>}
              </div>

              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                Esta ação removerá este laudo permanentemente do banco de dados e do histórico técnico.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setModalExcluirLaudoAberto(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  removerLaudo(laudoState.id);
                  setModalExcluirLaudoAberto(false);
                  navigate('/admin/laudos');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer shadow-xs"
              >
                Sim, excluir laudo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmação de Conversão de Layout */}
      {modalConverterLayoutAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#1565D8]">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Converter para o Novo Layout</h3>
                  <p className="text-xs text-slate-500">Modelo A4 de 6 Folhas Vetoriais</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalConverterLayoutAberto(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <p>
                Deseja converter o laudo <b>{laudoState.numero}</b> para o novo layout aprovado?
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-500">
                <li>Preserva todas as seções e anotações técnicas existentes.</li>
                <li>Habilita a exportação em PDF vetorial em 1 clique (&lt;500 KB).</li>
                <li>Estrutura o parecer pericial, normas com edição e instrumentos calibrados.</li>
              </ul>
            </div>

            <div className="pt-2 flex justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setModalConverterLayoutAberto(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConverterParaNovoLayout}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1565D8] hover:bg-[#0b4fb8] text-white shadow-xs cursor-pointer"
              >
                Confirmar Conversão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Verificação Prévia de Emissão (Parte E) */}
      <VerificacaoEmissaoModal
        isOpen={modalVerificacaoAberto}
        onClose={() => setModalVerificacaoAberto(false)}
        laudo={laudoState}
        cliente={cliente}
        ativo={ativo}
        onFocarCampo={(campo) => {
          if (campo === 'partes' || campo === 'ativo') {
            setAbaEstruturada('geral');
          } else if (campo === 'parecer') {
            setAbaEstruturada('parecer');
          } else if (campo === 'ncs') {
            setAbaEstruturada('ncs');
          } else if (campo === 'normas' || campo === 'instrumentos') {
            setAbaEstruturada('normas_instrumentos');
          } else if (campo === 'art') {
            window.scrollTo({ top: 400, behavior: 'smooth' });
          }
        }}
        onConfirmarEmissao={handleConfirmarEmissaoOficial}
      />

    </div>
  );
};
