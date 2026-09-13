import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  Award, 
  Lock, 
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
  History,
  RotateCcw,
  Loader2,
  FolderTree,
  Building2,
  Cpu,
  Layers,
  FileCheck2,
  HelpCircle,
  X,
  Image as ImageIcon,
  UploadCloud,
  Paperclip,
  FileCheck,
  ExternalLink,
  ZoomIn
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { calculateHRN, HRN_LO_OPTIONS, HRN_FE_OPTIONS, HRN_DPH_OPTIONS, HRN_NP_OPTIONS } from '../../utils/hrn';
import { Laudo, LaudoSecao, LaudoRevisao, HRNValues, ChecklistCampo } from '../../types';
import { TipTapEditor } from './TipTapEditor';
import { LaudoPdfExportModal } from './LaudoPdfExportModal';
import { ImportarChecklistCampoModal } from './ImportarChecklistCampoModal';
import { gerarMinutaTecnicaSecao } from '../../lib/geradorMinutasLaudo';

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
  const navigate = useNavigate();
  const { laudos, clientes, ativos, categoriasLaudo, atualizarLaudo, finalizarLaudo, registrarUsoIA } = useData();
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
  const [modalImportarChecklistAberto, setModalImportarChecklistAberto] = useState(false);

  // Form inputs for modals
  const [novaSecaoTitulo, setNovaSecaoTitulo] = useState('');
  const [novaSecaoPreset, setNovaSecaoPreset] = useState('custom');
  const [novaNotaRevisao, setNovaNotaRevisao] = useState('');
  const [promptIa, setPromptIa] = useState('Melhorar redação técnica conforme ABNT e NRs');
  const [carregandoIa, setCarregandoIa] = useState(false);
  const [artNumeroInput, setArtNumeroInput] = useState(laudoOriginal?.artNumero || '');
  const [termoAceito, setTermoAceito] = useState(false);

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

  // Synchronize initial active section
  useEffect(() => {
    if (laudoState?.secoes && laudoState.secoes.length > 0 && !secaoAtivaId) {
      setSecaoAtivaId(laudoState.secoes[0].id);
    }
  }, [laudoState, secaoAtivaId]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
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
    }, 1200);
  };

  // Immediate save on user demand
  const handleSalvarManual = () => {
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

  // Delete section
  const handleRemoverSecao = (idParaRemover: string) => {
    const secao = laudoState.secoes.find(s => s.id === idParaRemover);
    if (!secao) return;

    if (secao.isObrigatoria) {
      const confirma = window.confirm(`A seção "${secao.titulo}" é marcada como obrigatória por norma técnica. Deseja realmente removê-la deste laudo?`);
      if (!confirma) return;
    } else {
      const confirma = window.confirm(`Remover a seção "${secao.titulo}"?`);
      if (!confirma) return;
    }

    const novasSecoes = laudoState.secoes.filter(s => s.id !== idParaRemover);
    novasSecoes.forEach((s, idx) => { s.ordem = idx + 1; });

    if (secaoAtivaId === idParaRemover && novasSecoes.length > 0) {
      setSecaoAtivaId(novasSecoes[0].id);
    }

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

  // Finalize Laudo
  const handleConfirmarFinalizacao = () => {
    if (!artNumeroInput.trim() || !termoAceito) {
      alert('Por favor, informe o número da ART CREA-PE e declare concordância com os termos de responsabilidade técnica.');
      return;
    }

    finalizarLaudo(laudoState.id, artNumeroInput.trim());
    setLaudoState(prev => prev ? {
      ...prev,
      status: 'finalizado',
      artNumero: artNumeroInput.trim()
    } : null);

    setModalFinalizarAberto(false);
    alert('Laudo pericial finalizado com sucesso e ART CREA-PE vinculada com fé pública!');
  };

  // Cover Photo Handlers
  const handleCapaFotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        agendarAutoSave({
          ...laudoState,
          capaFotoUrl: base64,
          capaFotoLegenda: laudoState.capaFotoLegenda || 'Equipamento em Avaliação Pericial',
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoverCapaFoto = () => {
    agendarAutoSave({
      ...laudoState,
      capaFotoUrl: undefined,
      capaFotoLegenda: undefined,
    });
  };

  const handleCapaLegendaChange = (legenda: string) => {
    agendarAutoSave({
      ...laudoState,
      capaFotoLegenda: legenda,
    });
  };

  // Section Photo & Evidences Handlers
  const handleFotoSecaoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !secaoAtiva) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
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
        agendarAutoSave({
          ...laudoState,
          secoes: novasSecoes,
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleInserirFotoNoTexto = (fotoUrl: string, legenda?: string) => {
    if (!secaoAtiva) return;
    const blocoHtml = `<div class="my-4 text-center"><img src="${fotoUrl}" alt="${legenda || 'Evidência Técnica'}" style="max-width:100%; max-height:420px; object-fit:contain; border-radius:8px; border:1px solid #cbd5e1; margin:0 auto; display:block;" /><p style="font-size:11px; color:#64748b; font-style:italic; margin-top:6px; font-weight:600;">${legenda || 'Evidência fotográfica pericial'}</p></div><p></p>`;
    const novoConteudo = (secaoAtiva.conteudoHtml || '') + blocoHtml;
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

  return (
    <div className="space-y-4 pb-12">
      
      {/* ========================================================================= */}
      {/* TOP HEADER: TAXONOMIA, METADADOS & AUTO-SAVE INDICATOR                    */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#0B1324] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        
        {/* Row 1: Back, Breadcrumb & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Link 
                to="/admin/laudos"
                className="text-slate-500 hover:text-blue-600 font-semibold flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Central de Laudos</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-[#1565D8] dark:text-blue-400">
                {taxonomyDetails.catNome}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                {taxonomyDetails.subNome}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-black text-[#0B1E3D] dark:text-white tracking-tight">
                {laudoState.numero} • {laudoState.tipo}
              </h1>

              {/* Status Badge */}
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                laudoState.status === 'finalizado'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-300'
                  : laudoState.status === 'em_revisao'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-300'
              }`}>
                {laudoState.status.toUpperCase().replace('_', ' ')}
              </span>

              {/* ART Badge */}
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                ART: {laudoState.artNumero || 'Pendente de Emissão'}
              </span>
            </div>
          </div>

          {/* Top Control Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Auto-Save Indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium">
              {statusSalvamento === 'salvando' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">Salvando rascunho...</span>
                </>
              ) : statusSalvamento === 'pendente' ? (
                <>
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500">Alterações pendentes</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-300">Salvo às {ultimoSalvoHora}</span>
                </>
              )}
            </div>

            {/* Save Manual Button */}
            <button
              onClick={handleSalvarManual}
              disabled={statusSalvamento === 'salvando'}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700 cursor-pointer shadow-xs"
              title="Salvar alterações agora (Ctrl+S)"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Agora</span>
            </button>

            {/* Revision History */}
            <button
              onClick={() => setModalRevisoesAberto(true)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer shadow-xs"
            >
              <History className="w-3.5 h-3.5 text-[#1565D8]" />
              <span>Revisões ({laudoState.revisoes?.length || 0})</span>
            </button>

            {/* Assistente IA */}
            <button
              onClick={() => setModalIaAberto(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center gap-1.5 border border-purple-200 dark:border-purple-800 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Redação IA</span>
            </button>

            {/* Exportar PDF */}
            <button
              onClick={() => setModalPdfAberto(true)}
              className="px-4 py-2 rounded-xl bg-[#1565D8] hover:bg-[#0b4fb8] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Exportar PDF</span>
            </button>

            {/* Finalize Button if not finished */}
            {laudoState.status !== 'finalizado' && (
              <button
                onClick={() => setModalFinalizarAberto(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Finalizar com ART</span>
              </button>
            )}

          </div>
        </div>

        {/* Row 2: Client & Asset Quick Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#1565D8] shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 block text-[10px]">Cliente:</span>
              <strong className="text-slate-900 dark:text-white font-semibold truncate block">
                {laudoState.clienteNome}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#1565D8] shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 block text-[10px]">Ativo / Identificação:</span>
              <strong className="text-slate-900 dark:text-white font-semibold truncate block">
                {laudoState.ativoIdentificacao}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-[#1565D8] shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px]">Responsável Técnico:</span>
              <strong className="text-slate-900 dark:text-white font-semibold block">
                {laudoState.responsavelNome}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#1565D8] shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px]">Registro Profissional:</span>
              <strong className="text-slate-900 dark:text-white font-mono block">
                {laudoState.responsavelCrea}
              </strong>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* AVISO FIXO: LAUDO INICIADO COM SUGESTÕES DE IA                           */}
      {/* ========================================================================= */}
      {laudoState.iniciadoComIA && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/80 shadow-xs flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-extrabold text-amber-950 dark:text-amber-200 flex items-center gap-1.5 text-sm">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Preenchimento Assistido por IA
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                Rascunho Preliminar
              </span>
            </div>
            <p className="text-amber-900/90 dark:text-amber-200/90 leading-relaxed font-medium">
              Este laudo foi iniciado com sugestões geradas por IA. Revise e valide todas as informações antes da emissão final. O conteúdo sugerido não substitui a vistoria técnica presencial.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CARD DE FOTO DA CAPA DO LAUDO (EQUIPAMENTO / INSTALAÇÃO)                  */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#0B1324] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <input 
          type="file" 
          ref={capaFileInputRef} 
          onChange={handleCapaFotoUpload} 
          accept="image/*" 
          className="hidden" 
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#1565D8]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0B1E3D] dark:text-white flex items-center gap-2">
                Foto Oficial da Capa do Laudo
                {laudoState.capaFotoUrl ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                    Foto Configurada
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                    Opcional / Recomendado
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-500">
                Esta fotografia do equipamento ou instalação será impressa em destaque na 1ª página (capa oficial) do laudo técnico em PDF.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => capaFileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-[#1565D8] dark:text-blue-400 text-xs font-bold flex items-center gap-1.5 border border-blue-200 dark:border-blue-800 shadow-xs cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{laudoState.capaFotoUrl ? 'Substituir Foto da Capa' : 'Enviar Foto do Computador / Celular'}</span>
            </button>
            {laudoState.capaFotoUrl && (
              <button
                type="button"
                onClick={handleRemoverCapaFoto}
                className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 border border-transparent hover:border-red-200 cursor-pointer"
                title="Remover Foto da Capa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {laudoState.capaFotoUrl ? (
          <div className="pt-4 flex flex-col sm:flex-row items-start gap-4">
            <div 
              className="relative group cursor-pointer shrink-0 rounded-xl overflow-hidden border-2 border-[#1565D8]/40 shadow-sm w-full sm:w-64 h-40 bg-slate-900 flex items-center justify-center"
              onClick={() => setModalVisualizarImagemUrl({ url: laudoState.capaFotoUrl!, titulo: laudoState.capaFotoLegenda || 'Foto da Capa do Laudo' })}
            >
              <img 
                src={laudoState.capaFotoUrl} 
                alt="Capa do Laudo" 
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                <ZoomIn className="w-4 h-4" />
                <span>Ampliar Imagem</span>
              </div>
            </div>

            <div className="flex-1 space-y-2 text-xs w-full">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                Legenda Técnica da Fotografia de Capa:
              </label>
              <input
                type="text"
                value={laudoState.capaFotoLegenda || ''}
                onChange={(e) => handleCapaLegendaChange(e.target.value)}
                placeholder="Ex: Foto frontal do equipamento auditado em suas instalações operacionais"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
              />
              <p className="text-[11px] text-slate-500">
                A foto da capa confere alto padrão estético de engenharia diagnóstica e autenticidade ao laudo pericial oficial.
              </p>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => capaFileInputRef.current?.click()}
            className="mt-3 p-6 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400 bg-slate-50/50 dark:bg-slate-900/30 text-center cursor-pointer transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#1565D8] flex items-center justify-center mx-auto mb-2">
              <Camera className="w-6 h-6" />
            </div>
            <p className="font-bold text-xs text-slate-700 dark:text-slate-200">
              Nenhuma foto de capa vinculada a este laudo
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Clique aqui ou use o botão acima para carregar a imagem do equipamento inspecionado (PNG, JPG, WEBP).
            </p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MAIN WORKSPACE: SECTIONS SIDEBAR + WYSIWYG DOCUMENT EDITOR                */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Sections List & Management (4 cols on lg) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0B1324] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#1565D8]" />
              <h3 className="font-bold text-sm text-[#0B1E3D] dark:text-white">
                Estrutura do Laudo ({laudoState.secoes.length} Seções)
              </h3>
            </div>

            <button
              onClick={() => {
                setNovaSecaoTitulo('');
                setModalNovaSecaoAberto(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 text-[#1565D8] dark:text-blue-400 text-xs font-bold flex items-center gap-1 border border-blue-200 dark:border-blue-800 cursor-pointer"
              title="Adicionar nova seção"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova Seção</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500">
            Clique para editar. Reordene com as setas ou renomeie as seções livremente.
          </p>

          {/* Sections List */}
          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
            {laudoState.secoes.map((secao, idx) => {
              const isAtiva = secao.id === secaoAtiva?.id;

              return (
                <div
                  key={secao.id}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 group ${
                    isAtiva
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 shadow-xs'
                      : 'bg-slate-50/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
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
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            #{idx + 1}
                          </span>
                          <span className={`text-xs font-bold truncate block ${
                            isAtiva ? 'text-[#1565D8] dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'
                          }`}>
                            {secao.titulo}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          {secao.isObrigatoria ? (
                            <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                              • Obrigatória
                            </span>
                          ) : (
                            <span className="text-[9px] font-medium text-slate-400">
                              • Customizada
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions for this section: Reorder, Rename, Delete */}
                  <div className="flex items-center gap-0.5 shrink-0">
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

          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">💡 Dica do Perito:</p>
            <p>Você pode inserir tabelas de checklist, medições e fotos diretamente no corpo de qualquer seção usando a barra de ferramentas do editor.</p>
          </div>

        </div>

        {/* Right Column: Active Section WYSIWYG Editor (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-3">
          
          {secaoAtiva ? (
            <div className="bg-white dark:bg-[#0B1324] p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1565D8]/10 text-[#1565D8]">
                      Seção #{secaoAtiva.ordem}
                    </span>
                    {secaoAtiva.isObrigatoria && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Obrigatória por Norma
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-black text-[#0B1E3D] dark:text-white">
                    {secaoAtiva.titulo}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditandoSecaoId(secaoAtiva.id);
                      setTituloEditando(secaoAtiva.titulo);
                    }}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Editar Título</span>
                  </button>
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
                    className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-semibold hover:bg-blue-100 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Minuta Padrão</span>
                  </button>
                  <button
                    onClick={() => setModalIaAberto(true)}
                    className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs font-semibold hover:bg-purple-100 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Expandir com IA</span>
                  </button>
                </div>
              </div>

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
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <input
                  type="file"
                  ref={secaoFotoInputRef}
                  onChange={handleFotoSecaoUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Evidências Fotográficas desta Seção ({secaoAtiva.fotos?.length || 0})
                    </h4>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Insira fotos com legenda técnica e adicione-as ao texto com um clique
                  </span>
                </div>

                {/* Upload Form for Section Photo */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <input
                    type="text"
                    value={legendaNovaFotoSecao}
                    onChange={(e) => setLegendaNovaFotoSecao(e.target.value)}
                    placeholder="Legenda da foto (Ex: Foto 1: Desgaste abrasivo no dente da engrenagem)"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => secaoFotoInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload Foto</span>
                  </button>
                </div>

                {/* Photos Grid for this Section */}
                {secaoAtiva.fotos && secaoAtiva.fotos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                    {secaoAtiva.fotos.map((foto) => (
                      <div 
                        key={foto.id}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2 flex flex-col justify-between"
                      >
                        <div 
                          className="relative group rounded-lg overflow-hidden h-32 bg-slate-100 dark:bg-slate-800 cursor-pointer border border-slate-200 dark:border-slate-700"
                          onClick={() => setModalVisualizarImagemUrl({ url: foto.url, titulo: foto.descricao })}
                        >
                          <img 
                            src={foto.url} 
                            alt={foto.descricao || 'Evidência'} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold gap-1">
                            <ZoomIn className="w-3.5 h-3.5" />
                            <span>Ver Foto</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium line-clamp-2">
                          {foto.descricao || 'Evidência sem legenda'}
                        </p>

                        <div className="flex items-center gap-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => handleInserirFotoNoTexto(foto.url, foto.descricao)}
                            className="flex-1 py-1 px-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 text-[#1565D8] dark:text-blue-300 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                            title="Inserir esta foto no corpo de texto do laudo"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Inserir no Texto</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoverFotoSecao(foto.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                            title="Excluir Evidência"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">
                    Nenhuma foto adicional cadastrada nesta seção. Use o formulário acima ou a barra de ferramentas do editor para adicionar fotos.
                  </p>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-white dark:bg-[#0B1324] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <p className="text-slate-500 text-xs">Nenhuma seção selecionada para edição.</p>
            </div>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* SEÇÃO OFICIAL DE ANEXO DA ART (CREA-PE)                                   */}
      {/* Suporta upload de arquivo em PDF ou Imagem                               */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#0B1324] p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <input
          type="file"
          ref={artFileInputRef}
          onChange={handleArtArquivoUpload}
          accept="image/*,application/pdf"
          className="hidden"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-[#0B1E3D] dark:text-white">
                  Anexo Oficial da ART (Anotação de Responsabilidade Técnica — CREA-PE)
                </h3>
                {laudoState.artArquivoUrl ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    ART Anexada
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                    Obrigatório para Finalização
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Anexe o arquivo oficial emitido pelo CREA-PE. O sistema aceita comprovantes tanto em formato <strong>PDF</strong> quanto em <strong>Imagem (PNG/JPG)</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => artFileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{laudoState.artArquivoUrl ? 'Substituir Arquivo da ART' : 'Anexar ART (PDF ou Imagem)'}</span>
            </button>
            {laudoState.artArquivoUrl && (
              <button
                type="button"
                onClick={handleRemoverArt}
                className="p-2 rounded-xl hover:bg-red-50 text-red-600 border border-transparent hover:border-red-200 cursor-pointer"
                title="Remover Anexo da ART"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {laudoState.artArquivoUrl ? (
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* File details and visual representation */}
              <div className="md:col-span-4 flex items-center gap-3">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                  laudoState.artTipoArquivo === 'pdf'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border border-red-200'
                    : 'bg-blue-100 text-[#1565D8] dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200'
                }`}>
                  {laudoState.artTipoArquivo === 'pdf' ? (
                    <div className="text-center">
                      <FileText className="w-6 h-6 mx-auto mb-0.5" />
                      <span className="text-[9px] uppercase font-black">PDF</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="w-6 h-6 mx-auto mb-0.5" />
                      <span className="text-[9px] uppercase font-black">IMG</span>
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase font-mono tracking-wider ${
                      laudoState.artTipoArquivo === 'pdf'
                        ? 'bg-red-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}>
                      {laudoState.artTipoArquivo === 'pdf' ? 'Documento PDF Oficial' : 'Imagem Técnica da ART'}
                    </span>
                  </div>
                  <strong className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block mt-1">
                    {laudoState.artNomeArquivo || 'art-oficial-crea.pdf'}
                  </strong>
                  <span className="text-[10px] text-slate-500 block">
                    Homologado em: {laudoState.artDataHomologacao ? new Date(laudoState.artDataHomologacao).toLocaleDateString('pt-BR') : 'Data atual'}
                  </span>
                </div>
              </div>

              {/* Number and Date Fields */}
              <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Nº da ART CREA-PE:
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
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold text-[#0B1E3D] dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Data de Registro:
                  </label>
                  <input
                    type="date"
                    value={laudoState.artDataHomologacao ? laudoState.artDataHomologacao.split('T')[0] : ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      agendarAutoSave({ ...laudoState, artDataHomologacao: val });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              {/* Actions & Preview Button */}
              <div className="md:col-span-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (laudoState.artTipoArquivo === 'imagem') {
                      setModalVisualizarImagemUrl({ url: laudoState.artArquivoUrl!, titulo: `ART CREA-PE: ${laudoState.artNumero || 'Documento Oficial'}` });
                    } else {
                      setModalVisualizarArtAberto(true);
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 shadow-xs cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#1565D8]" />
                  <span>Visualizar ART</span>
                </button>
                <a
                  href={laudoState.artArquivoUrl}
                  download={laudoState.artNomeArquivo || 'ART_CREA_PE.pdf'}
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 cursor-pointer"
                  title="Baixar Arquivo da ART"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>

            </div>

            {/* If ART is an image, show small thumbnail */}
            {laudoState.artTipoArquivo === 'imagem' && (
              <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800/60 flex items-center gap-3">
                <img
                  src={laudoState.artArquivoUrl}
                  alt="Miniatura da ART"
                  className="w-20 h-14 object-cover rounded-lg border border-slate-300 dark:border-slate-700 shadow-xs cursor-pointer hover:opacity-90"
                  onClick={() => setModalVisualizarImagemUrl({ url: laudoState.artArquivoUrl!, titulo: `ART CREA-PE: ${laudoState.artNumero || 'Oficial'}` })}
                />
                <span className="text-[11px] text-slate-600 dark:text-slate-400">
                  Esta imagem da ART será impressa em página de anexo em tamanho integral na exportação em PDF do laudo técnico.
                </span>
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={() => artFileInputRef.current?.click()}
            className="p-6 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-emerald-500 bg-slate-50/50 dark:bg-slate-900/30 text-center cursor-pointer transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto mb-2 border border-emerald-200 dark:border-emerald-800">
              <Paperclip className="w-6 h-6" />
            </div>
            <p className="font-bold text-xs text-slate-700 dark:text-slate-200">
              Clique aqui para anexar o arquivo da ART (PDF ou Imagem)
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Selecione o arquivo baixado do portal do CREA-PE ou tire uma foto legível da guia de Anotação de Responsabilidade Técnica.
            </p>
          </div>
        )}
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
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
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
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
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
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1"
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
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
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
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
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
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200"
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
        />
      )}

    </div>
  );
};
