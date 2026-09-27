import React, { useRef, useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  ChevronLeft, 
  ChevronRight, 
  FileSpreadsheet, 
  CheckCircle2, 
  Building2, 
  Phone, 
  Mail, 
  FileCheck2, 
  ShieldCheck, 
  Sparkles,
  Layers,
  ArrowRight,
  Loader2,
  Edit3,
  SlidersHorizontal,
  CheckSquare,
  Square,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { Orcamento, PropostaPagina } from '../../types';
import { useData } from '../../context/DataContext';
import { EngineeringWatermark } from '../common/EngineeringWatermark';
import { 
  HTML_CARDS_CATALOGO_SERVICOS,
  gerarSecoesPadraoOrcamento,
  obterTituloLaudoProposta,
  gerarCardClienteHtml,
  gerarHtmlEtapa2Metodologia,
  gerarHtmlEtapa3Investimento,
  gerarHtmlContatoAgradecimento
} from '../../lib/orcamentoTemplatePadrao';

interface PropostaViewerModalProps {
  orcamento: Orcamento;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (id: string, novoStatus: Orcamento['status']) => void;
  onGerarLaudo?: (orc: Orcamento) => void;
  onEditarProposta?: (orc: Orcamento) => void;
}

function gerarPaginasPadrao(orcamento: Orcamento): PropostaPagina[] {
  const secoes = gerarSecoesPadraoOrcamento(orcamento);
  return secoes.map(s => ({
    id: s.id,
    numero: s.numero,
    titulo: s.titulo,
    subtitulo: s.subtitulo,
    conteudoHtml: s.conteudoHtml,
    ocultarNoPdf: s.ocultarNoPdf,
  }));
}

export const PropostaViewerModal: React.FC<PropostaViewerModalProps> = ({
  orcamento,
  isOpen,
  onClose,
  onStatusChange,
  onGerarLaudo,
  onEditarProposta,
}) => {
  const { atualizarOrcamento } = useData();
  const documentRef = useRef<HTMLDivElement>(null);
  const printContainerRef = useRef<HTMLDivElement>(null);
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const [modoVisualizacao, setModoVisualizacao] = useState<'pagina' | 'continua'>('pagina');
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [painelSelecaoAberto, setPainelSelecaoAberto] = useState(false);

  // Initialize hidden sections from orcamento
  const [secoesOcultasIds, setSecoesOcultasIds] = useState<string[]>(() => {
    if (orcamento.secoesOcultasPdf && Array.isArray(orcamento.secoesOcultasPdf)) {
      return orcamento.secoesOcultasPdf;
    }
    if (orcamento.secoes && orcamento.secoes.length > 0) {
      return orcamento.secoes.filter(s => s.ocultarNoPdf).map(s => s.id);
    }
    return [];
  });

  useEffect(() => {
    if (orcamento.secoesOcultasPdf && Array.isArray(orcamento.secoesOcultasPdf)) {
      setSecoesOcultasIds(orcamento.secoesOcultasPdf);
    } else if (orcamento.secoes) {
      setSecoesOcultasIds(orcamento.secoes.filter(s => s.ocultarNoPdf).map(s => s.id));
    }
  }, [orcamento.id, orcamento.secoesOcultasPdf]);

  // All available candidate sections
  const todasSecoes = useMemo(() => {
    if (orcamento.secoes && orcamento.secoes.length > 0) {
      return orcamento.secoes;
    }
    return gerarSecoesPadraoOrcamento(orcamento);
  }, [orcamento]);

  const secoesOcultasCount = secoesOcultasIds.length;

  // Toggle visibility of a specific section in PDF and preview
  const handleToggleSecao = (secaoId: string) => {
    const estaOculta = secoesOcultasIds.includes(secaoId);
    const novaLista = estaOculta
      ? secoesOcultasIds.filter(id => id !== secaoId)
      : [...secoesOcultasIds, secaoId];

    setSecoesOcultasIds(novaLista);

    // Save to orcamento so it stays permanent
    if (orcamento.secoes && orcamento.secoes.length > 0) {
      const novasSecoes = orcamento.secoes.map(s => ({
        ...s,
        ocultarNoPdf: novaLista.includes(s.id),
      }));
      atualizarOrcamento(orcamento.id, {
        secoes: novasSecoes,
        secoesOcultasPdf: novaLista,
      });
    } else {
      atualizarOrcamento(orcamento.id, {
        secoesOcultasPdf: novaLista,
      });
    }
  };

  const handleSelecionarTodas = () => {
    setSecoesOcultasIds([]);
    if (orcamento.secoes && orcamento.secoes.length > 0) {
      const novasSecoes = orcamento.secoes.map(s => ({ ...s, ocultarNoPdf: false }));
      atualizarOrcamento(orcamento.id, { secoes: novasSecoes, secoesOcultasPdf: [] });
    } else {
      atualizarOrcamento(orcamento.id, { secoesOcultasPdf: [] });
    }
  };

  const handleDesmarcarTodas = () => {
    // Hide everything except capa
    const listaOcultar = todasSecoes.filter(s => s.id !== 'capa' && s.numero !== 1).map(s => s.id);
    setSecoesOcultasIds(listaOcultar);
    if (orcamento.secoes && orcamento.secoes.length > 0) {
      const novasSecoes = orcamento.secoes.map(s => ({
        ...s,
        ocultarNoPdf: listaOcultar.includes(s.id),
      }));
      atualizarOrcamento(orcamento.id, { secoes: novasSecoes, secoesOcultasPdf: listaOcultar });
    } else {
      atualizarOrcamento(orcamento.id, { secoesOcultasPdf: listaOcultar });
    }
    setPaginaAtual(1);
  };

  const handleModoEssencial = () => {
    // Essential Proposal: Capa, Escopo Técnico (Etapa 1), Metodologia (Etapa 2), Investimento (Etapa 3 com PIX) e Contato
    // Hides prefixed institutional pages that client does not need in a concise proposal
    const idsEssenciais = ['capa', 'etapa1', 'etapa2', 'etapa3', 'contato'];
    const ocultar = todasSecoes
      .filter(s => !idsEssenciais.includes(s.id) && !s.titulo?.toLowerCase().includes('etapa') && !s.titulo?.toLowerCase().includes('capa') && !s.titulo?.toLowerCase().includes('contato'))
      .map(s => s.id);

    setSecoesOcultasIds(ocultar);
    if (orcamento.secoes && orcamento.secoes.length > 0) {
      const novasSecoes = orcamento.secoes.map(s => ({
        ...s,
        ocultarNoPdf: ocultar.includes(s.id),
      }));
      atualizarOrcamento(orcamento.id, { secoes: novasSecoes, secoesOcultasPdf: ocultar });
    } else {
      atualizarOrcamento(orcamento.id, { secoesOcultasPdf: ocultar });
    }
    setPaginaAtual(1);
  };

  // Compute pages strictly respecting user edits and excluded pages
  const paginas: PropostaPagina[] = useMemo(() => {
    const secoesVisiveis = todasSecoes.filter(
      s => !secoesOcultasIds.includes(s.id) && !s.ocultarNoPdf
    );
    const secoesParaExibir = secoesVisiveis.length > 0 ? secoesVisiveis : [todasSecoes[0]];

    const clienteNome = orcamento.clienteNome || 'Cliente Contratante';
    const cnpj = orcamento.cnpjCliente || 'Consulte o contrato';
    const representante = orcamento.representanteNome || 'Diretoria / Coordenação Técnica';
    const localidade = orcamento.localidadeServico || 'Recife e Região Metropolitana - PE';
    const codigo = orcamento.codigoProposta || orcamento.id;
    const validade = orcamento.validadeDias || 15;
    const prazo = orcamento.prazoEntrega || `${orcamento.prazoDias || 7} dias úteis`;
    const tituloLaudoDinamico = obterTituloLaudoProposta(orcamento);

    return secoesParaExibir.map((s, idx) => {
      let conteudo = s.conteudoHtml || '';

      // PAGE 1: Capa e Identificação do Cliente
      const isCapa = s.id === 'capa' || s.numero === 1 || (s.titulo && s.titulo.toUpperCase().includes('CAPA'));
      if (isCapa) {
        if (!conteudo || (!conteudo.includes('DADOS DO CLIENTE CONTRATANTE') && !conteudo.includes('PROPOSTA TÉCNICA COMERCIAL'))) {
          conteudo = gerarCardClienteHtml({
            clienteNome,
            cnpj,
            representante,
            localidade,
            codigo,
            validade,
            prazo
          });
        }

        if (orcamento.imagemCapaUrl && !conteudo.includes(orcamento.imagemCapaUrl)) {
          const fotoHtml = `
            <div class="mb-4 rounded-xl overflow-hidden border border-slate-200 shadow-sm max-h-60 bg-slate-50 text-center flex flex-col items-center justify-center">
              <img src="${orcamento.imagemCapaUrl}" alt="Ativo / Local da Proposta" class="w-full max-h-52 object-cover" />
              ${orcamento.imagemCapaLegenda ? `<p class="text-[10px] text-slate-500 font-mono py-1 px-3 bg-slate-100 w-full text-center border-t border-slate-200">${orcamento.imagemCapaLegenda}</p>` : ''}
            </div>
          `;
          conteudo = `${fotoHtml}${conteudo}`;
        }

        return {
          id: s.id,
          numero: idx + 1,
          titulo: 'PROPOSTA TÉCNICA COMERCIAL // ORÇAMENTO DE ENGENHARIA',
          subtitulo: tituloLaudoDinamico,
          conteudoHtml: conteudo,
        };
      }

      // FOR ALL OTHER SECTIONS: PRESERVE EXACT CONTENT!
      // Clean obsolete digital signature badges if present in Etapa 3
      const isEtapa3 = s.id === 'etapa3' || s.numero === 12 || (s.titulo && s.titulo.toLowerCase().includes('etapa 3'));
      if (isEtapa3 && conteudo) {
        conteudo = conteudo
          .replace(/<span[^>]*>[^<]*Assinado Digitalmente pelo Emissor[^<]*<\/span>/gi, '')
          .replace(/<span[^>]*>[^<]*\[Aceite Eletrônico \/ Assinatura Digital\][^<]*<\/span>/gi, '')
          .replace(/✓ Assinado Digitalmente pelo Emissor/g, '')
          .replace(/\[Aceite Eletrônico \/ Assinatura Digital\]/g, '');
      }

      // Upgrade Agradecimento & Contato if still using old format
      const isContato = s.id === 'contato' || s.numero === 13 || (s.titulo && s.titulo.toLowerCase().includes('contato'));
      if (isContato && (!conteudo || conteudo.includes('🤝') || !conteudo.includes('HEADER HERO EXECUTIVO'))) {
        conteudo = gerarHtmlContatoAgradecimento();
      }

      return {
        id: s.id,
        numero: idx + 1,
        titulo: s.titulo,
        subtitulo: s.subtitulo,
        conteudoHtml: conteudo,
      };
    });
  }, [todasSecoes, secoesOcultasIds, orcamento]);

  const totalPaginas = paginas.length;

  useEffect(() => {
    if (paginaAtual > totalPaginas && totalPaginas > 0) {
      setPaginaAtual(totalPaginas);
    }
  }, [totalPaginas, paginaAtual]);

  if (!isOpen) return null;

  const paginaRenderizar = paginas.find(p => p.numero === paginaAtual) || paginas[0];

  const handlePrintNative = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setGerandoPdf(true);

    try {
      const pageElements = printContainerRef.current?.querySelectorAll<HTMLElement>('.proposta-pdf-page');
      if (!pageElements || pageElements.length === 0) {
        throw new Error('Páginas de impressão não encontradas.');
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const total = pageElements.length;
      for (let i = 0; i < total; i++) {
        if (i > 0) {
          pdf.addPage('a4', 'p');
        }

        const pageEl = pageElements[i];
        const canvas = await html2canvas(pageEl, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 794,
          onclone: (clonedDoc) => {
            clonedDoc.documentElement.classList.remove('dark');
            clonedDoc.body.classList.remove('dark');
          },
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }

      const nomeArquivo = `Proposta_${orcamento.codigoProposta || orcamento.id}_${(orcamento.clienteNome || 'Cliente').replace(/\s+/g, '_')}.pdf`;
      pdf.save(nomeArquivo);
    } catch (err) {
      console.error('Erro ao gerar PDF da proposta:', err);
      alert('Ocorreu um erro ao compilar o PDF multi-página. Abrindo impressão nativa do navegador.');
      window.print();
    } finally {
      setGerandoPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden">
        
        {/* Top Header Controls */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#1565D8]/20 border border-[#1565D8]/30">
              <FileSpreadsheet className="w-5 h-5 text-[#1565D8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base leading-tight">
                  Proposta Oficial • {orcamento.codigoProposta || orcamento.id}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                  {totalPaginas} {totalPaginas === 1 ? 'Página no PDF' : 'Páginas no PDF'}
                </span>
                {secoesOcultasCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {secoesOcultasCount} seção(ões) oculta(s)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {orcamento.clienteNome} • {orcamento.servico}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Page Selection Button for PDF */}
            <button
              onClick={() => setPainelSelecaoAberto(prev => !prev)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                painelSelecaoAberto 
                  ? 'bg-amber-400 text-slate-900 border-amber-300 shadow-sm'
                  : secoesOcultasCount > 0
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:text-white hover:bg-slate-700'
              }`}
              title="Selecionar quais páginas incluir ou ocultar da versão do PDF final"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span>Páginas no PDF ({totalPaginas}/{todasSecoes.length})</span>
              {secoesOcultasCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-400 text-slate-900">
                  {secoesOcultasCount} oculta(s)
                </span>
              )}
            </button>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setModoVisualizacao('pagina')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  modoVisualizacao === 'pagina' ? 'bg-[#1565D8] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Página a Página
              </button>
              <button
                onClick={() => setModoVisualizacao('continua')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  modoVisualizacao === 'continua' ? 'bg-[#1565D8] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Visualização Contínua
              </button>
            </div>

            {/* Editar Proposta button */}
            {onEditarProposta && (
              <button
                onClick={() => onEditarProposta(orcamento)}
                className="p-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 border border-amber-500 cursor-pointer"
                title="Editar seções e capa no editor rico"
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden md:inline">Editar Seções</span>
              </button>
            )}

            {/* Print button */}
            <button
              onClick={handlePrintNative}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              title="Imprimir (Ctrl+P)"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden md:inline">Imprimir</span>
            </button>

            {/* PDF Download Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={gerandoPdf}
              className="px-3.5 py-2 rounded-lg bg-[#1565D8] hover:bg-[#1565D8]/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {gerandoPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gerando PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Baixar PDF</span>
                </>
              )}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer ml-1"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Secondary Sub-Bar: Page Navigator & Quick Status */}
        <div className="px-4 sm:px-6 py-2 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs shrink-0">
          {modoVisualizacao === 'pagina' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPaginaAtual(prev => Math.max(1, prev - 1))}
                disabled={paginaAtual <= 1}
                className="p-1 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                title="Página Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-bold text-slate-700 dark:text-slate-300">
                Página <span className="text-[#1565D8] font-mono font-black">{paginaAtual}</span> de {totalPaginas}
              </span>

              <button
                onClick={() => setPaginaAtual(prev => Math.min(totalPaginas, prev + 1))}
                disabled={paginaAtual >= totalPaginas}
                className="p-1 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                title="Próxima Página"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <select
                value={paginaAtual}
                onChange={(e) => setPaginaAtual(Number(e.target.value))}
                className="ml-2 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 font-semibold max-w-[200px] sm:max-w-none truncate"
              >
                {paginas.map(p => (
                  <option key={p.numero} value={p.numero}>
                    Pág {p.numero}: {p.titulo}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setPainelSelecaoAberto(true)}
                className="ml-3 px-2 py-0.5 rounded text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-900/30 hover:bg-amber-200 border border-amber-300 dark:border-amber-700/50 flex items-center gap-1 cursor-pointer transition-colors"
                title="Configurar quais páginas entram no PDF"
              >
                <SlidersHorizontal className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>Ocultar/Exibir Páginas</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">
                Exibindo todas as {totalPaginas} páginas sequenciais no padrão de engenharia mecânica.
              </span>
              <button
                type="button"
                onClick={() => setPainelSelecaoAberto(true)}
                className="px-2 py-0.5 rounded text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-900/30 hover:bg-amber-200 border border-amber-300 dark:border-amber-700/50 flex items-center gap-1 cursor-pointer transition-colors"
                title="Configurar quais páginas entram no PDF"
              >
                <SlidersHorizontal className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>Gerenciar Páginas</span>
              </button>
            </div>
          )}

          {/* Quick status change */}
          {onStatusChange && (
            <div className="flex items-center gap-2">
              <span className="text-slate-500 hidden sm:inline">Status:</span>
              <button
                onClick={() => onStatusChange(orcamento.id, 'enviado')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                  orcamento.status === 'enviado' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Enviada
              </button>
              <button
                onClick={() => onStatusChange(orcamento.id, 'aprovado')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                  orcamento.status === 'aprovado' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Aprovada
              </button>
              {orcamento.status === 'aprovado' && onGerarLaudo && (
                <button
                  onClick={() => onGerarLaudo(orcamento)}
                  className="px-2.5 py-0.5 rounded bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs cursor-pointer ml-1"
                >
                  <ArrowRight className="w-3 h-3" />
                  <span>Gerar Laudo</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Document Scroll Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-200 dark:bg-slate-900 flex justify-center">
          <div ref={documentRef} className="w-full max-w-[210mm] space-y-6">
            
            {modoVisualizacao === 'pagina' ? (
              // Single page render with mechanical engineering background watermark
              <div className="printable-document bg-white text-slate-900 min-h-[297mm] p-8 sm:p-12 shadow-xl border border-slate-300 flex flex-col justify-between relative overflow-hidden">
                
                {/* Engineering Watermark with gears, machines, and blueprints */}
                <EngineeringWatermark opacity="opacity-[0.045]" />

                {/* Official Page Header */}
                <header className="relative z-10 border-b-2 border-[#0B1E3D] pb-4 mb-6 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="VL" className="h-10 w-auto object-contain" />
                    <div>
                      <h4 className="text-base font-black text-[#0B1E3D] leading-tight">VL ENGENHARIA MECÂNICA</h4>
                      <p className="text-[10px] text-[#1565D8] font-bold uppercase tracking-wider">
                        Proposta Técnico-Comercial • CREA-PE 182229949-0
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-slate-600 font-mono">
                    <p>Ref: <strong>{orcamento.codigoProposta || orcamento.id}</strong></p>
                    <p>Página {paginaRenderizar?.numero || 1} de {totalPaginas}</p>
                  </div>
                </header>

                {/* Page Content Body */}
                <div className="relative z-10 flex-1">
                  <div className="mb-5">
                    {paginaRenderizar?.numero === 1 ? (
                      <div className="space-y-2">
                        <h1 className="text-xl sm:text-2xl font-black text-[#0B1E3D] tracking-tight leading-snug">
                          PROPOSTA TÉCNICA COMERCIAL // ORÇAMENTO DE ENGENHARIA
                        </h1>
                        <div>
                          <span className="inline-block bg-[#0B1E3D] text-[#D4AF37] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold tracking-wider uppercase border border-[#D4AF37]/40 shadow-xs">
                            {paginaRenderizar?.subtitulo || obterTituloLaudoProposta(orcamento)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-xl font-black text-[#0B1E3D]">
                          {paginaRenderizar?.titulo}
                        </h2>
                        {paginaRenderizar?.subtitulo && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            {paginaRenderizar.subtitulo}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div 
                    className="prose prose-sm max-w-none text-slate-800 text-xs leading-relaxed space-y-3"
                    dangerouslySetInnerHTML={{ __html: paginaRenderizar?.conteudoHtml || '<p>Conteúdo da proposta técnica.</p>' }}
                  />
                </div>

                {/* Official Page Footer */}
                <footer className="relative z-10 border-t border-slate-300 pt-3 mt-8 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                  <span>VL Engenharia Mecânica • CREA-PE 182229949-0 • E-mail: vlengenhariamec@gmail.com</span>
                  <span>Recife - PE • (81) 98444-2592</span>
                </footer>
              </div>
            ) : (
              // Continuous 13-page view with mechanical engineering background watermark
              paginas.map((pag) => (
                <div 
                  key={pag.numero}
                  className="printable-document bg-white text-slate-900 min-h-[297mm] p-8 sm:p-12 shadow-xl border border-slate-300 flex flex-col justify-between page-break-after-always relative mb-6 overflow-hidden"
                >
                  {/* Engineering Watermark with gears, machines, and blueprints */}
                  <EngineeringWatermark opacity="opacity-[0.045]" />

                  <header className="relative z-10 border-b-2 border-[#0B1E3D] pb-4 mb-6 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img src="/logo.png" alt="VL" className="h-10 w-auto object-contain" />
                      <div>
                        <h4 className="text-base font-black text-[#0B1E3D] leading-tight">VL ENGENHARIA MECÂNICA</h4>
                        <p className="text-[10px] text-[#1565D8] font-bold uppercase tracking-wider">
                          Proposta Técnico-Comercial • CREA-PE 182229949-0
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-slate-600 font-mono">
                      <p>Ref: <strong>{orcamento.codigoProposta || orcamento.id}</strong></p>
                      <p>Página {pag.numero} de {totalPaginas}</p>
                    </div>
                  </header>

                  <div className="relative z-10 flex-1">
                    <div className="mb-5">
                      {pag.numero === 1 ? (
                        <div className="space-y-2">
                          <h1 className="text-xl sm:text-2xl font-black text-[#0B1E3D] tracking-tight leading-snug">
                            PROPOSTA TÉCNICA COMERCIAL // ORÇAMENTO DE ENGENHARIA
                          </h1>
                          <div>
                            <span className="inline-block bg-[#0B1E3D] text-[#D4AF37] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold tracking-wider uppercase border border-[#D4AF37]/40 shadow-xs">
                              {pag.subtitulo || obterTituloLaudoProposta(orcamento)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h2 className="text-xl font-black text-[#0B1E3D]">
                            {pag.titulo}
                          </h2>
                          {pag.subtitulo && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              {pag.subtitulo}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div 
                      className="prose prose-sm max-w-none text-slate-800 text-xs leading-relaxed space-y-3"
                      dangerouslySetInnerHTML={{ __html: pag.conteudoHtml }}
                    />
                  </div>

                  <footer className="relative z-10 border-t border-slate-300 pt-3 mt-8 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                    <span>VL Engenharia Mecânica • CREA-PE 182229949-0 • E-mail: vlengenhariamec@gmail.com</span>
                    <span>Recife - PE • (81) 98444-2592</span>
                  </footer>
                </div>
              ))
            )}

          </div>
        </div>

        {/* Hidden Dedicated Print Container: renders all pages with strict A4 dimensions for PDF export */}
        <div 
          ref={printContainerRef}
          className="fixed left-[-9999px] top-0 pointer-events-none"
          style={{ width: '794px' }}
          aria-hidden="true"
        >
          {paginas.map((pag) => (
            <div 
              key={`print-page-${pag.numero}`}
              className="proposta-pdf-page bg-white text-slate-900 min-h-[1123px] max-h-[1123px] w-[794px] p-10 flex flex-col justify-between relative overflow-hidden"
              style={{ boxSizing: 'border-box' }}
            >
              <EngineeringWatermark opacity="opacity-[0.045]" />

              <header className="relative z-10 border-b-2 border-[#0B1E3D] pb-4 mb-6 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="VL" className="h-10 w-auto object-contain" />
                  <div>
                    <h4 className="text-base font-black text-[#0B1E3D] leading-tight">VL ENGENHARIA MECÂNICA</h4>
                    <p className="text-[10px] text-[#1565D8] font-bold uppercase tracking-wider">
                      Proposta Técnico-Comercial • CREA-PE 182229949-0
                    </p>
                  </div>
                </div>
                <div className="text-right text-[10px] text-slate-600 font-mono">
                  <p>Ref: <strong>{orcamento.codigoProposta || orcamento.id}</strong></p>
                  <p>Página {pag.numero} de {totalPaginas}</p>
                </div>
              </header>

              <div className="relative z-10 flex-1">
                <div className="mb-5">
                  {pag.numero === 1 ? (
                    <div className="space-y-2">
                      <h1 className="text-xl sm:text-2xl font-black text-[#0B1E3D] tracking-tight leading-snug">
                        PROPOSTA TÉCNICA COMERCIAL // ORÇAMENTO DE ENGENHARIA
                      </h1>
                      <div>
                        <span className="inline-block bg-[#0B1E3D] text-[#D4AF37] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold tracking-wider uppercase border border-[#D4AF37]/40 shadow-xs">
                          {pag.subtitulo || obterTituloLaudoProposta(orcamento)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-xl font-black text-[#0B1E3D]">
                        {pag.titulo}
                      </h2>
                      {pag.subtitulo && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {pag.subtitulo}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div 
                  className="prose prose-sm max-w-none text-slate-800 text-xs leading-relaxed space-y-3"
                  dangerouslySetInnerHTML={{ __html: pag.conteudoHtml }}
                />
              </div>

              <footer className="relative z-10 border-t border-slate-300 pt-3 mt-8 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                <span>VL Engenharia Mecânica • CREA-PE 182229949-0 • E-mail: vlengenhariamec@gmail.com</span>
                <span>Recife - PE • (81) 98444-2592</span>
              </footer>
            </div>
          ))}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-[#0B1324] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Proposta comercial válida por {orcamento.validadeDias || 15} dias. Todos os direitos reservados.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            Fechar
          </button>
        </div>

        {/* Slide-Over Drawer for Page Selection */}
        {painelSelecaoAberto && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
              
              {/* Drawer Header */}
              <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm leading-tight text-white">
                      Selecionar Páginas do PDF
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Escolha quais seções incluir ou ocultar da versão final.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPainelSelecaoAberto(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Preset Action Buttons */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-2 text-xs shrink-0">
                <button
                  type="button"
                  onClick={handleModoEssencial}
                  className="px-2.5 py-1.5 rounded-lg bg-[#1565D8] hover:bg-[#0b4fb8] text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
                  title="Mantém apenas Capa, Metodologia, Investimento e Contato (oculta páginas prefixadas)"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Proposta Essencial</span>
                </button>

                <button
                  type="button"
                  onClick={handleSelecionarTodas}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Todas as 13 Páginas</span>
                </button>

                <button
                  type="button"
                  onClick={handleDesmarcarTodas}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Apenas Capa</span>
                </button>
              </div>

              {/* Summary Indicator */}
              <div className="px-4 py-2.5 bg-blue-50 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/40 flex items-center justify-between text-xs text-blue-900 dark:text-blue-300 shrink-0">
                <span>Páginas ativas no PDF final:</span>
                <strong className="font-mono font-black text-sm text-[#1565D8] dark:text-blue-400">
                  {totalPaginas} de {todasSecoes.length} páginas
                </strong>
              </div>

              {/* Section Checkbox List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {todasSecoes.map((secao) => {
                  const isOculta = secoesOcultasIds.includes(secao.id) || Boolean(secao.ocultarNoPdf);
                  const isAtiva = !isOculta;

                  return (
                    <div
                      key={secao.id}
                      onClick={() => handleToggleSecao(secao.id)}
                      className={`p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                        isAtiva
                          ? 'bg-white dark:bg-slate-800 border-[#1565D8]/50 shadow-xs hover:border-[#1565D8]'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-90'
                      }`}
                    >
                      <div className="pt-0.5 shrink-0">
                        <input
                          type="checkbox"
                          checked={isAtiva}
                          onChange={() => handleToggleSecao(secao.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 text-[#1565D8] rounded border-slate-300 focus:ring-[#1565D8] cursor-pointer"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-black ${
                            isAtiva ? 'bg-[#0B1E3D] text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {secao.numero}
                          </span>
                          <p className={`text-xs font-bold leading-snug truncate ${isAtiva ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                            {secao.titulo}
                          </p>
                        </div>
                        {secao.subtitulo && (
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {secao.subtitulo}
                          </p>
                        )}
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            isAtiva 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {isAtiva ? '✓ No PDF' : '✕ Oculta'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
                <span className="text-[11px] text-slate-500">
                  Alterações salvas na proposta.
                </span>
                <button
                  type="button"
                  onClick={() => setPainelSelecaoAberto(false)}
                  className="px-4 py-2 rounded-xl bg-[#1565D8] hover:bg-[#0b4fb8] text-white font-bold text-xs shadow-sm cursor-pointer transition-colors"
                >
                  Concluir Seleção
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
