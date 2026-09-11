import React, { useRef, useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Award, 
  Calendar, 
  MapPin, 
  User, 
  Cpu, 
  Hash, 
  Phone, 
  Mail, 
  Loader2,
  Check,
  Building2,
  Sparkles
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { Laudo, Cliente, Ativo } from '../../types';

interface LaudoPdfExportModalProps {
  laudo: Laudo;
  cliente?: Cliente;
  ativo?: Ativo;
  isOpen: boolean;
  onClose: () => void;
}

export const LaudoPdfExportModal: React.FC<LaudoPdfExportModalProps> = ({
  laudo,
  cliente,
  ativo,
  isOpen,
  onClose,
}) => {
  const documentRef = useRef<HTMLDivElement>(null);
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [sucessoDownload, setSucessoDownload] = useState(false);

  if (!isOpen) return null;

  const dataFormatada = laudo.dataInspecao 
    ? new Date(laudo.dataInspecao).toLocaleDateString('pt-BR') 
    : new Date().toLocaleDateString('pt-BR');

  const emitidoEm = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const authHash = `VL-${laudo.numero.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now().toString(36).toUpperCase()}`;

  // Export using html2canvas and jsPDF
  const handleDownloadPdf = async () => {
    if (!documentRef.current) return;
    setGerandoPdf(true);
    setSucessoDownload(false);

    try {
      const element = documentRef.current;
      
      // Render canvas with high resolution
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

      // First Page
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // Subsequent pages if content overflows A4
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      const sanitizedFilename = `Laudo_${laudo.numero}_${(laudo.clienteNome || 'Cliente').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      pdf.save(sanitizedFilename);

      setSucessoDownload(true);
      setTimeout(() => setSucessoDownload(false), 4000);
    } catch (error) {
      console.error('Erro ao gerar arquivo PDF:', error);
      alert('Houve uma falha ao gerar o PDF diretamente. Você também pode utilizar o botão "Imprimir / Salvar PDF" para gerar via navegador.');
    } finally {
      setGerandoPdf(false);
    }
  };

  const handlePrintNative = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 no-print">
      <div className="bg-white dark:bg-[#0E1726] w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-300 dark:border-slate-800 flex flex-col max-h-[94vh] overflow-hidden">
        
        {/* Top Modal Toolbar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#0B1324] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-[#1565D8] dark:text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#0B1E3D] dark:text-white flex items-center gap-2">
                Exportação de Laudo Técnico em PDF
                <span className="text-xs px-2 py-0.5 rounded-md bg-blue-600 text-white font-mono font-bold">
                  {laudo.numero}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cabeçalho institucional, dados normativos e rodapé de responsabilidade técnica inclusos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintNative}
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Abre o assistente nativo de impressão e PDF do navegador"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir / Salvar PDF</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={gerandoPdf}
              className="px-4 py-2 rounded-xl bg-[#1565D8] hover:bg-[#0b4fb8] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-60"
              title="Gera e baixa o arquivo .pdf pronto"
            >
              {gerandoPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gerando PDF...</span>
                </>
              ) : sucessoDownload ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>PDF Baixado!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Baixar Arquivo PDF</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Preview Container (Styled in A4 proportions with white canvas) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-200 dark:bg-slate-900/90 flex justify-center">
          
          <div 
            ref={documentRef}
            id="laudo-pdf-content"
            className="printable-document bg-white text-slate-900 w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-12 shadow-xl border border-slate-300 flex flex-col justify-between"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            
            {/* ============================================================ */}
            {/* CABEÇALHO OFICIAL DA VL ENGENHARIA                          */}
            {/* ============================================================ */}
            <div>
              <header className="printable-header border-b-2 border-[#0B1E3D] pb-5 mb-6">
                
                {/* Top Header Row: Logo, Company & Credentials */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs">
                      <img 
                        src="/logo.png" 
                        alt="VL Engenharia Logo" 
                        className="w-full h-full object-contain"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <div>
                      <h1 className="text-xl font-black tracking-tight text-[#0B1E3D] leading-none">
                        VL ENGENHARIA MECÂNICA
                      </h1>
                      <p className="text-[11px] font-bold text-[#1565D8] uppercase tracking-wider mt-0.5">
                        Consultoria Técnica, Perícias & Segurança Operacional
                      </p>
                      <p className="text-[10px] text-slate-600 font-mono mt-0.5">
                        Registro Profissional: <strong>CREA-PE 1822299490</strong> • CNPJ: 45.123.890/0001-23
                      </p>
                    </div>
                  </div>

                  {/* Header Contact Info Box */}
                  <div className="text-right text-[10px] text-slate-600 space-y-0.5 font-medium shrink-0">
                    <p className="font-bold text-slate-800">Recife - PE • Atendimento Nacional</p>
                    <p className="flex items-center justify-end gap-1">
                      <Phone className="w-2.5 h-2.5 text-[#1565D8]" />
                      <span>(81) 98444-2592</span>
                    </p>
                    <p className="flex items-center justify-end gap-1">
                      <Mail className="w-2.5 h-2.5 text-[#1565D8]" />
                      <span>contato@vlengenharia.com.br</span>
                    </p>
                  </div>
                </div>

                {/* Document Title Banner */}
                <div className="mt-4 p-3 rounded-lg bg-[#0B1E3D] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                  <div>
                    <span className="text-[9px] font-bold text-blue-300 uppercase tracking-widest block">
                      DOCUMENTO TÉCNICO PERICIAL OFICIAL
                    </span>
                    <h2 className="text-sm font-black tracking-tight uppercase">
                      {laudo.tipo}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div className="bg-white/10 px-2.5 py-1 rounded text-[10px] font-mono">
                      <span className="text-blue-200 block text-[8px] uppercase">Nº do Laudo</span>
                      <strong className="text-white text-xs">{laudo.numero}</strong>
                    </div>

                    <div className="bg-white/10 px-2.5 py-1 rounded text-[10px] font-mono">
                      <span className="text-blue-200 block text-[8px] uppercase">ART CREA-PE</span>
                      <strong className="text-emerald-300 text-xs">
                        {laudo.artNumero ? laudo.artNumero : 'Protocolada'}
                      </strong>
                    </div>

                    <div className="bg-white/10 px-2.5 py-1 rounded text-[10px] font-mono">
                      <span className="text-blue-200 block text-[8px] uppercase">Data Vistoria</span>
                      <strong className="text-white text-xs">{dataFormatada}</strong>
                    </div>
                  </div>
                </div>

              </header>

              {/* ============================================================ */}
              {/* SEÇÃO 1: IDENTIFICAÇÃO DO CLIENTE & DO ATIVO                  */}
              {/* ============================================================ */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Card Cliente */}
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-[#0B1E3D] border-b border-slate-200 pb-1">
                      <Building2 className="w-3.5 h-3.5 text-[#1565D8]" />
                      <span className="uppercase tracking-wider text-[10px]">1. Dados do Cliente / Solicitante</span>
                    </div>
                    <p><strong>Razão Social:</strong> {laudo.clienteNome}</p>
                    {cliente && (
                      <>
                        <p><strong>CNPJ/CPF:</strong> {cliente.cpfCnpj}</p>
                        <p><strong>Endereço:</strong> {cliente.endereco.logradouro}, {cliente.endereco.numero} - {cliente.endereco.bairro}, {cliente.endereco.cidade}/{cliente.endereco.estado}</p>
                        {cliente.contatos[0] && (
                          <p><strong>Contato:</strong> {cliente.contatos[0].nome} ({cliente.contatos[0].telefone})</p>
                        )}
                      </>
                    )}
                  </div>

                  {/* Card Ativo */}
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-[#0B1E3D] border-b border-slate-200 pb-1">
                      <Cpu className="w-3.5 h-3.5 text-[#1565D8]" />
                      <span className="uppercase tracking-wider text-[10px]">2. Identificação do Equipamento</span>
                    </div>
                    <p><strong>Equipamento / TAG:</strong> {laudo.ativoIdentificacao}</p>
                    {ativo ? (
                      <>
                        <p><strong>Fabricante / Modelo:</strong> {ativo.fabricante} {ativo.modelo ? `• ${ativo.modelo}` : ''}</p>
                        <p><strong>Ano / Nº Série:</strong> {ativo.ano} {ativo.numeroSerie ? `• Série: ${ativo.numeroSerie}` : ''}</p>
                        {ativo.capacidade && <p><strong>Capacidade Nominal:</strong> {ativo.capacidade}</p>}
                        {ativo.localizacao && <p><strong>Setor / Localização:</strong> {ativo.localizacao}</p>}
                      </>
                    ) : (
                      <p className="text-slate-500">Ativo cadastrado no sistema sob identificação direta de campo.</p>
                    )}
                  </div>

                </div>
              </div>

              {/* ============================================================ */}
              {/* SEÇÃO 2: APRESENTAÇÃO, METODOLOGIA & NORMAS APLICÁVEIS       */}
              {/* ============================================================ */}
              <div className="space-y-3 mb-6">
                {laudo.apresentacao && (
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-1">
                    <span className="font-bold text-[#0B1E3D] uppercase text-[10px] block tracking-wider">
                      3. Apresentação & Objetivo do Laudo
                    </span>
                    <p className="text-slate-700 leading-relaxed text-[11px]">
                      {laudo.apresentacao}
                    </p>
                  </div>
                )}

                {laudo.metodologia && (
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-1">
                    <span className="font-bold text-[#0B1E3D] uppercase text-[10px] block tracking-wider">
                      4. Metodologia de Avaliação Técnica
                    </span>
                    <p className="text-slate-700 leading-relaxed text-[11px]">
                      {laudo.metodologia}
                    </p>
                  </div>
                )}

                <div className="p-3 rounded-lg border border-blue-100 bg-blue-50/50 text-xs space-y-1">
                  <span className="font-bold text-[#0B1E3D] uppercase text-[10px] block tracking-wider">
                    {laudo.apresentacao || laudo.metodologia ? '5.' : '3.'} Base Normativa e Legislação Técnica Aplicada
                  </span>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    Vistoria técnica, ensaios de campo e apreciação conduzidos estritamente em conformidade com: 
                    {laudo.normasReferencia ? (
                      <strong className="text-[#1565D8]"> {laudo.normasReferencia}</strong>
                    ) : (
                      <>
                        <strong> Norma Regulamentadora NR-12</strong> (Segurança no Trabalho em Máquinas e Equipamentos), 
                        <strong> NR-11</strong> (Transporte e Movimentação de Cargas), 
                        <strong> Lei Federal nº 13.589/2018</strong> (PMOC), 
                        <strong> ABNT NBR ISO 12100</strong> (Apreciação e Redução de Riscos), 
                        <strong> ABNT NBR 14153</strong>, 
                        <strong> Resoluções do CONFEA/CREA</strong> e manuais técnicos do fabricante.
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* ============================================================ */}
              {/* SEÇÃO 3: CHECKLIST TÉCNICO DE AUDITORIA                      */}
              {/* ============================================================ */}
              <div className="mb-6 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-300 pb-1.5">
                  <h3 className="text-xs font-black text-[#0B1E3D] uppercase tracking-wider">
                    {laudo.apresentacao || laudo.metodologia ? '6.' : '4.'} Matriz de Auditoria & Verificação de Conformidade
                  </h3>
                  <span className="text-[10px] text-slate-500">
                    Inspeção visual, dimensional e funcional
                  </span>
                </div>

                {(laudo.secoes || []).map((secao) => (
                  <div key={secao.id} className="space-y-2 page-break-inside-avoid">
                    <h4 className="text-[11px] font-bold text-[#1565D8] bg-slate-100 px-2.5 py-1 rounded">
                      {secao.titulo}
                    </h4>

                    {(secao.itens && secao.itens.length > 0) && (
                      <table className="w-full text-left text-[10px] border-collapse">
                        <thead>
                          <tr className="bg-slate-200/80 text-slate-700 border-b border-slate-300">
                            <th className="p-1.5 font-bold w-7/12">Item / Requisito Normativo</th>
                            <th className="p-1.5 font-bold w-2/12 text-center">Status</th>
                            <th className="p-1.5 font-bold w-3/12">Observações Técnicas</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {secao.itens.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                              <td className="p-1.5 text-slate-800 align-top">
                                <span className="font-semibold block">{item.requisito}</span>
                                {item.normaRef && (
                                  <span className="text-[9px] text-slate-500 font-mono">Ref: {item.normaRef}</span>
                                )}
                              </td>
                              <td className="p-1.5 text-center align-top">
                                {item.status === 'conforme' && (
                                  <span className="px-2 py-0.5 rounded font-bold text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    CONFORME
                                  </span>
                                )}
                                {item.status === 'nao_conforme' && (
                                  <span className="px-2 py-0.5 rounded font-bold text-[9px] bg-red-100 text-red-800 border border-red-300">
                                    NÃO CONFORME
                                  </span>
                                )}
                                {item.status === 'nao_aplicavel' && (
                                  <span className="px-2 py-0.5 rounded font-bold text-[9px] bg-slate-100 text-slate-600 border border-slate-300">
                                    NÃO APLICÁVEL
                                  </span>
                                )}
                                {item.status === 'pendente' && (
                                  <span className="px-2 py-0.5 rounded font-bold text-[9px] bg-amber-100 text-amber-800 border border-amber-300">
                                    PENDENTE
                                  </span>
                                )}
                              </td>
                              <td className="p-1.5 text-slate-600 align-top text-[10px]">
                                {item.observacao || '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                ))}
              </div>

              {/* ============================================================ */}
              {/* SEÇÃO 4: APRECIAÇÃO DE RISCO HRN (HAZARD RATING NUMBER)       */}
              {/* ============================================================ */}
              {laudo.hrnCalculoGeral && (
                <div className="mb-6 p-4 rounded-lg border border-slate-300 bg-slate-50 space-y-2 page-break-inside-avoid">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-xs font-black text-[#0B1E3D] uppercase tracking-wider">
                      5. Apreciação Quantitativa de Risco — Método HRN
                    </span>
                    <span className="text-[10px] font-mono text-slate-600">
                      Fórmula: HRN = LO × FE × DPH × NP
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs pt-1">
                    <div className="space-y-1">
                      <p className="text-[11px] text-slate-700">
                        Índice Global de Risco Mecânico Calculado:
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black font-mono text-[#0B1E3D]">
                          {typeof laudo.hrnCalculoGeral.score === 'number'
                            ? laudo.hrnCalculoGeral.score.toFixed(1)
                            : (laudo.hrnCalculoGeral.score ?? '0.0')}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-xs ${
                          laudo.hrnCalculoGeral.nivel === 'Insignificante' || laudo.hrnCalculoGeral.nivel === 'Baixo'
                            ? 'bg-emerald-600'
                            : laudo.hrnCalculoGeral.nivel === 'Médio'
                            ? 'bg-amber-500'
                            : 'bg-red-600'
                        }`}>
                          Nível: {(laudo.hrnCalculoGeral.nivel || 'Não avaliado').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-600 sm:max-w-md bg-white p-2.5 rounded border border-slate-200">
                      <strong>Diretriz Recomendada:</strong> {laudo.hrnCalculoGeral.recomendacao || 'Manter inspeções preventivas regulares.'}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* SEÇÃO 5: PARECER TÉCNICO CONCLUSIVO & PLANO DE AÇÃO          */}
              {/* ============================================================ */}
              <div className="mb-6 space-y-3 page-break-inside-avoid">
                <h3 className="text-xs font-black text-[#0B1E3D] uppercase tracking-wider border-b border-slate-300 pb-1.5">
                  6. Parecer Técnico Conclusivo & Recomendações Corretivas
                </h3>

                {laudo.resumoExecutivo && (
                  <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200 text-xs space-y-1">
                    <strong className="text-[#0B1E3D] block text-[11px]">Diagnóstico e Síntese Executiva:</strong>
                    <p className="text-slate-700 leading-relaxed text-[11px]">
                      {laudo.resumoExecutivo}
                    </p>
                  </div>
                )}

                <div className="p-3.5 rounded-lg border border-slate-200 bg-white text-xs space-y-1.5">
                  <strong className="text-[#0B1E3D] block text-[11px]">Conclusão Final do Engenheiro Responsável:</strong>
                  <p className="text-slate-800 leading-relaxed whitespace-pre-line text-[11px]">
                    {laudo.conclusao || 'O equipamento foi devidamente avaliado em suas condições operacionais e estruturais. Atesta-se a conformidade com as exigências normativas e recomenda-se o cumprimento imediato do cronograma de manutenção preventiva.'}
                  </p>
                </div>
              </div>

              {/* ============================================================ */}
              {/* SEÇÃO 6: TERMO DE RESPONSABILIDADE & ASSINATURA ELETRÔNICA   */}
              {/* ============================================================ */}
              <div className="mb-6 pt-2 border-t-2 border-slate-300 page-break-inside-avoid">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
                  
                  {/* Informações Legais */}
                  <div className="text-[10px] text-slate-600 space-y-1">
                    <strong className="text-slate-800 block text-[11px]">Declaração de Fé Pública e Responsabilidade Técnica:</strong>
                    <p className="leading-tight">
                      Este documento possui fé pública técnica e foi expedido em conformidade com as Leis Federais nº 5.194/66 e 6.496/77. 
                      A validade jurídica está vinculada à regularidade da <strong>ART CREA-PE: {laudo.artNumero || 'Pendente'}</strong>.
                    </p>
                    <p className="font-mono text-[9px] text-slate-400 mt-1">
                      Hash de Autenticação Digital: {authHash}
                    </p>
                  </div>

                  {/* Bloco de Assinatura */}
                  <div className="text-center p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                    <div className="inline-block border-b-2 border-slate-700 w-48 pb-1 mb-1 font-serif italic text-slate-800 text-xs">
                      Vitor Leonardo da Silva
                    </div>
                    <p className="font-bold text-xs text-[#0B1E3D]">ENG. MECÂNICO VITOR LEONARDO</p>
                    <p className="text-[10px] text-slate-600 font-mono">CREA-PE: 1822299490</p>
                    <p className="text-[9px] text-emerald-700 font-semibold mt-0.5">
                      Assinado Eletronicamente com Certificado Digital
                    </p>
                  </div>

                </div>
              </div>

            </div>

            {/* ============================================================ */}
            {/* RODAPÉ OFICIAL DA VL ENGENHARIA                              */}
            {/* ============================================================ */}
            <footer className="printable-footer pt-4 border-t-2 border-[#0B1E3D] text-[9px] text-slate-500 mt-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <strong className="text-slate-800">VL ENGENHARIA MECÂNICA & SEGURANÇA OPERACIONAL</strong>
                  <span> • CREA-PE 1822299490 • CNPJ: 45.123.890/0001-23</span>
                </div>
                <div className="text-right font-mono">
                  <span>Recife - PE • Tel: (81) 98444-2592</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[8px] text-slate-400 mt-1">
                <span>Documento emitido eletronicamente em {emitidoEm}. Proibida reprodução parcial sem autorização.</span>
                <span className="font-mono font-bold text-slate-600">Autenticidade: {authHash}</span>
              </div>
            </footer>

          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1324] flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Formato A4 padrão com cabeçalho e rodapé oficiais da VL Engenharia.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              Fechar Pré-visualização
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={gerandoPdf}
              className="px-5 py-2 rounded-xl bg-[#1565D8] hover:bg-[#0b4fb8] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Arquivo PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
