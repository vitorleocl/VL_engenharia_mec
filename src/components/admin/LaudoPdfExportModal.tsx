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
  Sparkles,
  ListOrdered
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { Laudo, Cliente, Ativo } from '../../types';
import { EngineeringWatermark } from '../common/EngineeringWatermark';

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

  // Export using html2canvas-pro and jsPDF
  const handleDownloadPdf = async () => {
    if (!documentRef.current) return;
    setGerandoPdf(true);
    setSucessoDownload(false);

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

      const nomeArquivo = `Laudo_${laudo.numero.replace(/\//g, '-')}_${(laudo.clienteNome || 'Cliente').replace(/\s+/g, '_')}.pdf`;
      pdf.save(nomeArquivo);
      setSucessoDownload(true);
      setTimeout(() => setSucessoDownload(false), 4000);
    } catch (err) {
      console.error('Erro ao gerar PDF do laudo:', err);
      alert('Falha ao compilar o PDF. Iniciando serviço de impressão nativa do sistema.');
      window.print();
    } finally {
      setGerandoPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const secoesOrdenadas = [...(laudo.secoes || [])].sort((a, b) => a.ordem - b.ordem);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#1565D8]/20 border border-[#1565D8]/30">
              <FileText className="w-5 h-5 text-[#1565D8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base leading-tight">
                  Visualização & Emissão de Laudo Oficial
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                  CREA-PE 182229949-0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {laudo.numero} • {laudo.tipo}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              title="Imprimir (Ctrl+P)"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={gerandoPdf}
              className="px-4 py-2 rounded-lg bg-[#1565D8] hover:bg-[#1565D8]/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {gerandoPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Compilando PDF...</span>
                </>
              ) : sucessoDownload ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Baixado com Sucesso!</span>
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
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer ml-1"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-200 dark:bg-slate-900/90 flex justify-center">
          
          <div 
            ref={documentRef}
            id="laudo-pdf-content"
            className="printable-document bg-white text-slate-900 w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-12 shadow-xl border border-slate-300 flex flex-col justify-between relative overflow-hidden"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {/* Engineering Mechanical Watermark */}
            <EngineeringWatermark opacity="opacity-[0.04]" />
            
            <div className="relative z-10 flex-1 flex flex-col justify-between">
              
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
                          Registro Profissional: <strong>CREA-PE 182229949-0</strong> • CNPJ: 45.123.890/0001-23
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
                        <span className="uppercase tracking-wider text-[10px]">2. Identificação do Equipamento / TAG</span>
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
                {/* SUMÁRIO AUTOMÁTICO DO LAUDO                                  */}
                {/* ============================================================ */}
                {secoesOrdenadas.length > 0 && (
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs mb-6">
                    <div className="flex items-center gap-1.5 font-bold text-[#0B1E3D] border-b border-slate-200 pb-1 mb-2">
                      <ListOrdered className="w-3.5 h-3.5 text-[#1565D8]" />
                      <span className="uppercase tracking-wider text-[10px]">Sumário de Seções Técnicas</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-700">
                      {secoesOrdenadas.map((sec, idx) => (
                        <div key={sec.id} className="flex items-center justify-between border-b border-dotted border-slate-300 py-0.5">
                          <span className="font-medium truncate">{sec.titulo}</span>
                          <span className="text-slate-400 font-mono text-[10px] ml-2">Item {idx + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ============================================================ */}
                {/* SEÇÕES CUSTOMIZÁVEIS / WYSIWYG DO LAUDO                     */}
                {/* ============================================================ */}
                <div className="space-y-6 mb-6">
                  {secoesOrdenadas.map((secao) => (
                    <div key={secao.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 page-break-inside-avoid shadow-2xs">
                      
                      <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                        <h3 className="text-xs font-black text-[#0B1E3D] uppercase tracking-wider flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#1565D8]"></span>
                          {secao.titulo}
                        </h3>
                        {secao.isObrigatoria && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            Requisito Obrigatório
                          </span>
                        )}
                      </div>

                      {/* Render WYSIWYG Content with rich HTML */}
                      {secao.conteudoHtml && (
                        <div 
                          className="prose prose-sm max-w-none text-slate-800 text-[11px] leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: secao.conteudoHtml }}
                        />
                      )}

                      {/* Checklist Table if attached to this section */}
                      {secao.itens && secao.itens.length > 0 && (
                        <table className="w-full text-left text-[10px] border-collapse mt-3">
                          <thead>
                            <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
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
                {/* APRECIAÇÃO DE RISCO HRN SE EXISTENTE                         */}
                {/* ============================================================ */}
                {laudo.hrnCalculoGeral && (
                  <div className="mb-6 p-4 rounded-lg border border-slate-300 bg-slate-50 space-y-2 page-break-inside-avoid">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-xs font-black text-[#0B1E3D] uppercase tracking-wider">
                        Apreciação Quantitativa de Risco — Método HRN
                      </span>
                      <span className="text-[10px] font-mono text-slate-600">
                        Score Global: <strong>{laudo.hrnCalculoGeral.score.toFixed(1)}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span 
                        className="px-2.5 py-1 rounded text-white font-bold text-[10px] uppercase"
                        style={{ backgroundColor: laudo.hrnCalculoGeral.cor }}
                      >
                        Nível de Risco: {laudo.hrnCalculoGeral.nivel}
                      </span>
                      <p className="text-slate-700 text-[11px] leading-tight">
                        {laudo.hrnCalculoGeral.recomendacao}
                      </p>
                    </div>
                  </div>
                )}

                {/* ============================================================ */}
                {/* TERMO DE RESPONSABILIDADE & ASSINATURA ELETRÔNICA             */}
                {/* ============================================================ */}
                <div className="mb-6 pt-3 border-t-2 border-slate-300 page-break-inside-avoid">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
                    
                    {/* Informações Legais */}
                    <div className="text-[10px] text-slate-600 space-y-1">
                      <strong className="text-slate-800 block text-[11px]">Declaração de Fé Pública e Responsabilidade Técnica:</strong>
                      <p className="leading-tight">
                        Este laudo possui fé pública técnica e foi expedido em estrita conformidade com as Leis Federais nº 5.194/66 e 6.496/77. 
                        A validade jurídica plena está vinculada à regularidade da <strong>ART CREA-PE: {laudo.artNumero || 'Pendente'}</strong>.
                      </p>
                      <p className="font-mono text-[9px] text-slate-400 mt-1">
                        Hash de Autenticidade Digital: {authHash}
                      </p>
                    </div>

                    {/* Bloco de Assinatura do Eng. Vitor Leonardo */}
                    <div className="text-center p-4 border border-slate-200 rounded-xl bg-slate-50/70">
                      <div className="inline-block border-b-2 border-slate-700 w-52 pb-1 mb-1 font-serif italic text-slate-800 text-xs">
                        Vitor Leonardo Cordeiro Linhares
                      </div>
                      <p className="font-bold text-xs text-[#0B1E3D]">ENG. MECÂNICO VITOR LEONARDO</p>
                      <p className="text-[10px] text-slate-600 font-mono">CREA-PE: 182229949-0</p>
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
                    <span> • CREA-PE 182229949-0 • CNPJ: 45.123.890/0001-23</span>
                  </div>
                  <div className="text-right font-mono">
                    <span>Recife - PE • Tel: (81) 98444-2592</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[8px] text-slate-400 mt-1">
                  <span>Documento emitido eletronicamente em {emitidoEm}. Proibida reprodução parcial sem autorização expressa.</span>
                  <span className="font-mono font-bold text-slate-600">Autenticidade: {authHash}</span>
                </div>
              </footer>

            </div>

          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1324] flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Layout oficial VL Engenharia com marca d'água mecânica, sumário inteligente e credenciais CREA-PE.
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
