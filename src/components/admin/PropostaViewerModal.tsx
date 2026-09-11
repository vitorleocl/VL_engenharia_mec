import React, { useRef, useState } from 'react';
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
  Loader2
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { Orcamento, PropostaPagina } from '../../types';

interface PropostaViewerModalProps {
  orcamento: Orcamento;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (id: string, novoStatus: Orcamento['status']) => void;
  onGerarLaudo?: (orc: Orcamento) => void;
}

export const PropostaViewerModal: React.FC<PropostaViewerModalProps> = ({
  orcamento,
  isOpen,
  onClose,
  onStatusChange,
  onGerarLaudo,
}) => {
  const documentRef = useRef<HTMLDivElement>(null);
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const [modoVisualizacao, setModoVisualizacao] = useState<'pagina' | 'continua'>('pagina');
  const [gerandoPdf, setGerandoPdf] = useState(false);

  if (!isOpen) return null;

  const paginas: PropostaPagina[] = orcamento.paginasProposta && orcamento.paginasProposta.length > 0
    ? orcamento.paginasProposta
    : [];

  const totalPaginas = paginas.length || 13;

  const handlePrintNative = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!documentRef.current) return;
    setGerandoPdf(true);

    try {
      const element = documentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        onclone: (clonedDoc) => {
          clonedDoc.documentElement.classList.remove('dark');
          clonedDoc.body.classList.remove('dark');
        },
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = 297;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      pdf.save(`Proposta_Comercial_VL_${orcamento.id}.pdf`);
    } catch (err) {
      console.error('Erro ao gerar PDF da proposta:', err);
      alert('Não foi possível gerar o arquivo PDF diretamente. Você pode usar a opção "Imprimir / Salvar PDF" para gerar.');
    } finally {
      setGerandoPdf(false);
    }
  };

  const paginaRenderizar = paginas.find(p => p.numero === paginaAtual) || paginas[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#060D1A] rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl border border-slate-300 dark:border-slate-800 overflow-hidden">
        
        {/* Top Header Controls */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-[#0B1324] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-[#0B1E3D] dark:text-white">
                  Proposta Técnico-Comercial (13 Páginas)
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-mono font-bold">
                  {orcamento.id}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  orcamento.status === 'aprovado'
                    ? 'bg-emerald-100 text-emerald-800'
                    : orcamento.status === 'enviado'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {orcamento.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cliente: <strong>{orcamento.clienteNome}</strong> • Valor: <strong>R$ {orcamento.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300">
              <button
                onClick={() => setModoVisualizacao('pagina')}
                className={`px-2.5 py-1 rounded-md transition-all ${modoVisualizacao === 'pagina' ? 'bg-white dark:bg-slate-700 shadow-xs text-[#1565D8] font-bold' : ''}`}
              >
                Página Individual
              </button>
              <button
                onClick={() => setModoVisualizacao('continua')}
                className={`px-2.5 py-1 rounded-md transition-all ${modoVisualizacao === 'continua' ? 'bg-white dark:bg-slate-700 shadow-xs text-[#1565D8] font-bold' : ''}`}
              >
                Contínua (13 Págs)
              </button>
            </div>

            <button
              onClick={handlePrintNative}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Abre a impressão do navegador para gerar PDF de todas as páginas"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Imprimir / Salvar PDF</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={gerandoPdf}
              className="px-3.5 py-1.5 rounded-lg bg-[#1565D8] hover:bg-[#0b4fb8] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-60"
            >
              {gerandoPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Gerando...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Baixar PDF</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status bar and Page Navigation bar */}
        <div className="px-6 py-2.5 bg-slate-100 dark:bg-[#070E1A] border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
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
                className="ml-2 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 font-semibold"
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
              Exibindo todas as {totalPaginas} páginas sequenciais no formato oficial.
            </div>
          )}

          {/* Quick status change */}
          {onStatusChange && (
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Alterar Status:</span>
              <button
                onClick={() => onStatusChange(orcamento.id, 'enviado')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                  orcamento.status === 'enviado' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Marcar Enviada
              </button>
              <button
                onClick={() => onStatusChange(orcamento.id, 'aprovado')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                  orcamento.status === 'aprovado' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Aprovada pelo Cliente
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
              // Single page render
              <div className="printable-document bg-white text-slate-900 min-h-[297mm] p-8 sm:p-12 shadow-xl border border-slate-300 flex flex-col justify-between relative">
                {/* Official Page Header */}
                <header className="border-b-2 border-[#0B1E3D] pb-4 mb-6 flex items-start justify-between">
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
                    <p>Ref: <strong>{orcamento.id}</strong></p>
                    <p>Página {paginaRenderizar?.numero || 1} de {totalPaginas}</p>
                  </div>
                </header>

                {/* Page Content Body */}
                <div className="flex-1">
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-[#1565D8] uppercase tracking-wider font-mono">
                      PÁGINA {paginaRenderizar?.numero}
                    </span>
                    <h2 className="text-xl font-black text-[#0B1E3D]">
                      {paginaRenderizar?.titulo}
                    </h2>
                    {paginaRenderizar?.subtitulo && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {paginaRenderizar.subtitulo}
                      </p>
                    )}
                  </div>

                  <div 
                    className="prose prose-sm max-w-none text-slate-800 text-xs leading-relaxed space-y-3"
                    dangerouslySetInnerHTML={{ __html: paginaRenderizar?.conteudoHtml || '<p>Conteúdo da proposta técnica.</p>' }}
                  />
                </div>

                {/* Official Page Footer */}
                <footer className="border-t border-slate-300 pt-3 mt-8 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                  <span>VL Engenharia Mecânica • CNPJ: 45.123.890/0001-23 • CREA-PE 182229949-0</span>
                  <span>Recife - PE • (81) 98444-2592</span>
                </footer>
              </div>
            ) : (
              // Continuous 13-page view
              paginas.map((pag) => (
                <div 
                  key={pag.numero}
                  className="printable-document bg-white text-slate-900 min-h-[297mm] p-8 sm:p-12 shadow-xl border border-slate-300 flex flex-col justify-between page-break-after-always relative mb-6"
                >
                  <header className="border-b-2 border-[#0B1E3D] pb-4 mb-6 flex items-start justify-between">
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
                      <p>Ref: <strong>{orcamento.id}</strong></p>
                      <p>Página {pag.numero} de {totalPaginas}</p>
                    </div>
                  </header>

                  <div className="flex-1">
                    <div className="mb-4">
                      <span className="text-[10px] font-bold text-[#1565D8] uppercase tracking-wider font-mono">
                        PÁGINA {pag.numero}
                      </span>
                      <h2 className="text-xl font-black text-[#0B1E3D]">
                        {pag.titulo}
                      </h2>
                      {pag.subtitulo && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {pag.subtitulo}
                        </p>
                      )}
                    </div>

                    <div 
                      className="prose prose-sm max-w-none text-slate-800 text-xs leading-relaxed space-y-3"
                      dangerouslySetInnerHTML={{ __html: pag.conteudoHtml }}
                    />
                  </div>

                  <footer className="border-t border-slate-300 pt-3 mt-8 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                    <span>VL Engenharia Mecânica • CNPJ: 45.123.890/0001-23 • CREA-PE 182229949-0</span>
                    <span>Recife - PE • (81) 98444-2592</span>
                  </footer>
                </div>
              ))
            )}

          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-[#0B1324] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Proposta comercial válida por {orcamento.validadeDias || 15} dias. Todos os direitos reservados.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
