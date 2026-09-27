import React, { useRef, useState, useMemo } from 'react';
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
  Edit3
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { Orcamento, PropostaPagina } from '../../types';
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
  const documentRef = useRef<HTMLDivElement>(null);
  const printContainerRef = useRef<HTMLDivElement>(null);
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const [modoVisualizacao, setModoVisualizacao] = useState<'pagina' | 'continua'>('pagina');
  const [gerandoPdf, setGerandoPdf] = useState(false);

  const secoesOcultasCount = useMemo(() => {
    if (orcamento.secoes && orcamento.secoes.length > 0) {
      return orcamento.secoes.filter(s => s.ocultarNoPdf || orcamento.secoesOcultasPdf?.includes(s.id)).length;
    }
    return 0;
  }, [orcamento]);

  // Compute pages: prioritize editable secoes, then paginasProposta, or generate standard 13 pages
  const paginas: PropostaPagina[] = useMemo(() => {
    let originais: PropostaPagina[] | null = null;

    if (orcamento.secoes && orcamento.secoes.length > 0) {
      const secoesVisiveis = orcamento.secoes.filter(
        s => !s.ocultarNoPdf && !orcamento.secoesOcultasPdf?.includes(s.id)
      );
      const secoesParaExibir = secoesVisiveis.length > 0 ? secoesVisiveis : [orcamento.secoes[0]];
      originais = secoesParaExibir.map((s, idx) => ({
        numero: idx + 1,
        titulo: s.titulo,
        subtitulo: s.subtitulo,
        conteudoHtml: s.conteudoHtml,
      }));
    } else if (orcamento.paginasProposta && orcamento.paginasProposta.length > 0) {
      const paginasVisiveis = orcamento.paginasProposta.filter(
        p => !p.ocultarNoPdf && !orcamento.secoesOcultasPdf?.includes(`secao-${p.numero}`)
      );
      const paginasParaExibir = paginasVisiveis.length > 0 ? paginasVisiveis : [orcamento.paginasProposta[0]];
      originais = paginasParaExibir.map((p, idx) => ({
        ...p,
        numero: idx + 1,
      }));
    } else if (orcamento.paginas && orcamento.paginas.length > 0) {
      const paginasVisiveis = orcamento.paginas.filter(
        p => !p.ocultarNoPdf && !orcamento.secoesOcultasPdf?.includes(`secao-${p.numero}`)
      );
      const paginasParaExibir = paginasVisiveis.length > 0 ? paginasVisiveis : [orcamento.paginas[0]];
      originais = paginasParaExibir.map((p, idx) => ({
        ...p,
        numero: idx + 1,
      }));
    }

    const listaBase = originais || gerarPaginasPadrao(orcamento);

    const clienteNome = orcamento.clienteNome || 'Cliente Contratante';
    const cnpj = orcamento.cnpjCliente || 'Consulte o contrato';
    const representante = orcamento.representanteNome || 'Diretoria / Coordenação Técnica';
    const localidade = orcamento.localidadeServico || 'Recife e Região Metropolitana - PE';
    const codigo = orcamento.codigoProposta || orcamento.id;
    const validade = orcamento.validadeDias || 15;
    const prazo = orcamento.prazoEntrega || `${orcamento.prazoDias || 7} dias úteis`;
    const valor = orcamento.valorFormatado || (orcamento.valor ? orcamento.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 3.500,00');
    const condicoes = orcamento.condicoesPagamento || '50% de entrada na aprovação e 50% após emissão do laudo final e ART.';
    const normas = orcamento.normasTecnicas || 'ABNT NBR, NR-11, NR-12, NR-13 conforme aplicável';
    const tituloLaudoDinamico = obterTituloLaudoProposta(orcamento);

    return listaBase.map(p => {
      // PAGE 1: Capa e Identificação do Cliente
      if (p.numero === 1 || p.titulo?.toUpperCase().includes('CAPA')) {
        let conteudo = p.conteudoHtml;
        // If content still uses legacy table/un-carded structure, upgrade to executive client card
        if (!conteudo || !conteudo.includes('DADOS DO CLIENTE CONTRATANTE') || conteudo.includes('PROPOSTA TÉCNICA COMERCIAL // ORÇAMENTO DE ENGENHARIA')) {
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

        // Render cover photo if provided and not already included
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
          ...p,
          numero: 1,
          titulo: 'PROPOSTA TÉCNICA COMERCIAL // ORÇAMENTO DE ENGENHARIA',
          subtitulo: tituloLaudoDinamico,
          conteudoHtml: conteudo,
        };
      }

      // Ensure Page 2 has the photo and credentials if it was missing
      if (p.numero === 2 && !p.conteudoHtml.includes('vitor-leonardo.png')) {
        return {
          ...p,
          titulo: "APRESENTAÇÃO INSTITUCIONAL E CREDENCIAIS TÉCNICAS",
          conteudoHtml: `<div class="space-y-4">
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 rounded-xl border border-slate-200 bg-slate-50/80">
              <div class="shrink-0 text-center">
                <img src="/vitor-leonardo.png" alt="Eng. Vitor Leonardo Cordeiro Linhares" class="w-32 h-38 object-cover rounded-lg shadow-sm border-2 border-[#1565D8] mx-auto bg-slate-200" />
                <span class="inline-block mt-2 px-2.5 py-0.5 rounded bg-[#0B1E3D] text-white text-[10px] font-bold tracking-wider uppercase font-mono">CREA-PE 182229949-0</span>
              </div>
              <div class="space-y-2 text-left">
                <h3 class="text-base font-black text-[#0B1E3D]">Eng. Vitor Leonardo Cordeiro Linhares</h3>
                <p class="text-xs font-bold text-[#1565D8] tracking-wide uppercase">Engenheiro Mecânico Responsável Técnico & Perito Especialista</p>
                <p class="text-slate-700 text-xs leading-relaxed">
                  Graduado em Engenharia Mecânica com registro ativo no Conselho Regional de Engenharia e Agronomia de Pernambuco (CREA-PE). Especialista em engenharia diagnóstica, laudos periciais mecânicos, adequação a Normas Regulamentadoras (NR-11, NR-12, NR-13), projetos de climatização (PMOC), prevenção contra incêndio e ensaios não destrutivos.
                </p>
                <div class="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600 font-medium">
                  <div class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>Emissão Oficial de ART</div>
                  <div class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>Engenharia Diagnóstica</div>
                  <div class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>Conformidade ABNT / NRs</div>
                  <div class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>Respaldo Jurídico-Pericial</div>
                </div>
              </div>
            </div>
            ${p.conteudoHtml}
          </div>`
        };
      }

      // Ensure Page 6 / Catálogo has the 6 stylized engineering cards
      const isCatalogoPage = 
        p.numero === 6 ||
        (p.titulo && (p.titulo.toUpperCase().includes('RESUMO DE NOSSOS SERVIÇOS') || p.titulo.toUpperCase().includes('CATÁLOGO GERAL'))) ||
        (p.subtitulo && (p.subtitulo.toUpperCase().includes('CATÁLOGO') || p.subtitulo.toUpperCase().includes('ADEQUAÇÕES INDUSTRIAIS'))) ||
        (orcamento.id === 'orc-1790444416499' && (p.numero === 6 || (p.titulo && p.titulo.toUpperCase().includes('SERVIÇOS'))));

      if (isCatalogoPage) {
        const needsUpgrade = !p.conteudoHtml ||
          p.conteudoHtml.includes('PLAYGROUNDS:') ||
          p.conteudoHtml.includes('ADEQUAÇÃO NR-12:') ||
          !p.conteudoHtml.includes('grid-template-columns') ||
          !p.conteudoHtml.includes('NR-12 • MÁQUINAS INDUSTRIAIS');

        if (needsUpgrade) {
          return {
            ...p,
            titulo: 'RESUMO DE NOSSOS SERVIÇOS DE ENGENHARIA',
            subtitulo: 'CATÁLOGO DE LAUDOS E ADEQUAÇÕES INDUSTRIAIS',
            conteudoHtml: HTML_CARDS_CATALOGO_SERVICOS,
          };
        }
      }

      // Ensure Etapa 2 (Metodologia) has the 5-fase stylized cards
      const isEtapa2Page = p.numero === 10 || 
        (p.titulo && (p.titulo.toUpperCase().includes('ETAPA 2') || p.titulo.toUpperCase().includes('METODOLOGIA')));
      if (isEtapa2Page) {
        const needsUpgrade = !p.conteudoHtml || !p.conteudoHtml.includes('FASE 01') || !p.conteudoHtml.includes('Metodologia de Engenharia em 5 Fases');
        if (needsUpgrade) {
          return {
            ...p,
            titulo: 'Etapa 2 - Escopo Técnico das Atividades (Metodologia)',
            subtitulo: 'FASES, CHECKLISTS E ENSAIOS EM 5 ETAPAS',
            conteudoHtml: gerarHtmlEtapa2Metodologia(normas),
          };
        }
      }

      // Ensure Etapa 3 (Investimento) has the modern cards
      const isEtapa3Page = p.numero === 12 || 
        (p.titulo && (p.titulo.toUpperCase().includes('ETAPA 3') || p.titulo.toUpperCase().includes('INVESTIMENTO') || p.titulo.toUpperCase().includes('PAGAMENTO')));
      if (isEtapa3Page) {
        const needsUpgrade = !p.conteudoHtml || !p.conteudoHtml.includes('INVESTIMENTO COMERCIAL LÍQUIDO');
        if (needsUpgrade) {
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
            }),
          };
        }
      }

      // Ensure Agradecimento & Contato has the 4 official contact cards
      const isContatoPage = p.numero === 13 || 
        (p.titulo && (p.titulo.toUpperCase().includes('AGRADECIMENTO') || p.titulo.toUpperCase().includes('CONTATO')));
      if (isContatoPage) {
        const needsUpgrade = !p.conteudoHtml || !p.conteudoHtml.includes('Agradecimento & Parceria') || p.conteudoHtml.includes('vitorleonardocl@gmail.com');
        if (needsUpgrade) {
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
  }, [orcamento]);

  if (!isOpen) return null;

  const totalPaginas = paginas.length;
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
            </div>
          ) : (
            <div className="text-xs text-slate-500 font-semibold">
              Exibindo todas as {totalPaginas} páginas sequenciais no padrão de engenharia mecânica.
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

      </div>
    </div>
  );
};
