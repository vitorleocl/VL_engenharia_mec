import React, { useRef, useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Share2, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  MinusCircle, 
  MapPin, 
  Calendar, 
  Building2, 
  Cpu, 
  FileText,
  Loader2
} from 'lucide-react';
import { ChecklistCampo } from '../../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ChecklistCampoPdfModalProps {
  checklist: ChecklistCampo;
  onClose: () => void;
}

export const ChecklistCampoPdfModal: React.FC<ChecklistCampoPdfModalProps> = ({
  checklist,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement | null>(null);
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [compartilhadoWhats, setCompartilhadoWhats] = useState(false);

  const totalItens = (checklist.itens?.length || 0) + (checklist.itensExtras?.length || 0);
  const todosItens = [...(checklist.itens || []), ...(checklist.itensExtras || [])];
  const conformes = todosItens.filter(i => i.status === 'conforme').length;
  const naoConformes = todosItens.filter(i => i.status === 'nao_conforme').length;
  const naoAplicaveis = todosItens.filter(i => i.status === 'nao_aplicavel').length;

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setGerandoPdf(true);
    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Checklist_Campo_${checklist.numero}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Não foi possível gerar o PDF automaticamente. Você pode usar a opção de Imprimir.');
    } finally {
      setGerandoPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const texto = `*VL ENGENHARIA — CHECKLIST DE CAMPO PRELIMINAR*
📋 *Registro:* ${checklist.numero}
🏢 *Cliente:* ${checklist.clienteNome || 'Cliente'}
⚙️ *Ativo:* ${checklist.ativoIdentificacao || 'Ativo'}
📑 *Tipo:* ${checklist.tipoLaudoNome || checklist.tipoLaudoId}
📅 *Data:* ${new Date(checklist.dataPreenchimento).toLocaleDateString('pt-BR')}
📊 *Resumo Técnico:*
✅ Conformes: ${conformes}
⚠️ Não Conformes: ${naoConformes}
⚪ Não Aplicáveis: ${naoAplicaveis}
✍️ *Responsável:* ${checklist.responsavelNome || 'Eng. Vitor Leonardo'} (${checklist.responsavelCrea || 'CREA-PE'})

_Checklist preliminar preenchido e assinado in loco. Relatório técnico completo em elaboração._`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
    setCompartilhadoWhats(true);
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Checklist de Campo Preliminar - ${checklist.numero} - VL Engenharia`);
    const body = encodeURIComponent(`Prezados,

Segue o resumo do Checklist de Campo realizado in loco pela equipe da VL Engenharia:

• Número: ${checklist.numero}
• Cliente: ${checklist.clienteNome || 'Cliente'}
• Ativo / Equipamento: ${checklist.ativoIdentificacao || 'Ativo'}
• Categoria / Norma: ${checklist.tipoLaudoNome || checklist.tipoLaudoId}
• Data da Visita: ${new Date(checklist.dataPreenchimento).toLocaleDateString('pt-BR')}
• Conformes: ${conformes} | Não Conformes: ${naoConformes} | Não Aplicáveis: ${naoAplicaveis}
• Responsável Técnico: ${checklist.responsavelNome || 'Eng. Vitor Leonardo'} (${checklist.responsavelCrea || 'CREA-PE'})

Atenciosamente,
VL Engenharia e Perícias Técnicas
contato@vlengenharia.com.br
(81) 98843-0965`);

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto border border-slate-200">
        {/* Header do Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              VL
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Checklist de Campo: {checklist.numero}
              </h2>
              <p className="text-xs text-slate-500">
                Documento técnico preliminar in loco com rubrica
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
              title="Compartilhar via WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              WhatsApp
            </button>
            <button
              onClick={handleShareEmail}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
              title="Compartilhar via E-mail"
            >
              <Send className="w-3.5 h-3.5" />
              E-mail
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg transition-colors border border-slate-300"
              title="Imprimir"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={gerandoPdf}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors shadow-xs"
            >
              {gerandoPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  Baixar PDF
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo do Documento (Área que vira PDF) */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100 flex justify-center">
          <div
            ref={printRef}
            className="bg-white text-slate-900 w-full max-w-[800px] p-8 rounded-lg shadow-sm border border-slate-300 print:border-none print:shadow-none print:p-0 print:m-0"
            style={{ minHeight: '1120px' }}
          >
            {/* Topo Oficial */}
            <div className="border-b-2 border-blue-900 pb-4 mb-6 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-blue-950 font-serif">
                    VL ENGENHARIA
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold tracking-wider uppercase">
                    Checklist In Loco
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Engenharia Mecânica, Segurança do Trabalho e Perícias Técnicas
                </p>
                <p className="text-[11px] text-slate-500">
                  CREA-PE 1822299490 • CNPJ 12.345.678/0001-00 • Recife / PE
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono font-bold text-blue-950 bg-blue-50 px-3 py-1.5 rounded border border-blue-200 inline-block">
                  REGISTRO: {checklist.numero}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Data: {new Date(checklist.dataPreenchimento).toLocaleDateString('pt-BR')} às{' '}
                  {new Date(checklist.dataPreenchimento).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <div className="mt-1">
                  <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                    checklist.status === 'finalizado' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {checklist.status === 'finalizado' ? 'Finalizado & Assinado' : 'Rascunho de Campo'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quadro de Identificação */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Dados do Cliente
                </span>
                <p className="font-bold text-slate-900 text-sm">{checklist.clienteNome || 'Cliente Não Informado'}</p>
                {checklist.clienteCnpj && (
                  <p className="text-slate-600">CNPJ: {checklist.clienteCnpj}</p>
                )}
                <p className="text-slate-500 mt-1">
                  Tipo de Laudo: <strong className="text-blue-900">{checklist.tipoLaudoNome || checklist.tipoLaudoId}</strong>
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Ativo / Equipamento Inspecionado
                </span>
                <p className="font-bold text-slate-900 text-sm">{checklist.ativoIdentificacao || 'Ativo Não Informado'}</p>
                {checklist.geolocalizacao && (
                  <p className="text-slate-600 flex items-center gap-1 mt-1 text-[11px]">
                    <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                    <span>
                      {checklist.geolocalizacao.enderecoAproximado || 
                        `Lat: ${checklist.geolocalizacao.lat.toFixed(4)}, Lng: ${checklist.geolocalizacao.lng.toFixed(4)}`}
                    </span>
                  </p>
                )}
                <p className="text-slate-500 mt-1">
                  Responsável: <strong className="text-slate-800">{checklist.responsavelNome || 'Eng. Vitor Leonardo'}</strong> ({checklist.responsavelCrea || 'CREA-PE'})
                </p>
              </div>
            </div>

            {/* Placar de Indicadores */}
            <div className="grid grid-cols-3 gap-3 mb-6 text-center">
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="block text-2xl font-black text-emerald-700">{conformes}</span>
                <span className="text-xs font-semibold text-emerald-800 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Conformes
                </span>
              </div>
              <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
                <span className="block text-2xl font-black text-rose-700">{naoConformes}</span>
                <span className="text-xs font-semibold text-rose-800 flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Não Conformes
                </span>
              </div>
              <div className="p-3 bg-slate-100 rounded-lg border border-slate-300">
                <span className="block text-2xl font-black text-slate-700">{naoAplicaveis}</span>
                <span className="text-xs font-semibold text-slate-800 flex items-center justify-center gap-1">
                  <MinusCircle className="w-3.5 h-3.5" /> Não Aplicáveis
                </span>
              </div>
            </div>

            {/* Tabela de Verificação Técnica */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-700" />
                Itens Verificados In Loco ({totalItens})
              </h3>

              <table className="w-full text-xs text-left border border-slate-200 rounded overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3 w-10 text-center">#</th>
                    <th className="py-2 px-3">Requisito / Ponto de Inspeção</th>
                    <th className="py-2 px-3 w-28 text-center">Status</th>
                    <th className="py-2 px-3">Observações / Evidências</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {todosItens.map((item, idx) => (
                    <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                      <td className="py-2.5 px-3 text-center text-slate-500 font-mono text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800 leading-snug">
                        <p>{item.descricao}</p>
                        {(item.valorResposta || item.criterioReferencia) && (
                          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px]">
                            {item.valorResposta && (
                              <span className="bg-sky-50 text-sky-800 border border-sky-200 px-1.5 py-0.5 rounded font-bold">
                                Apurado: {item.valorResposta} {item.unidade && item.unidade !== 'texto' ? item.unidade : ''}
                              </span>
                            )}
                            {item.criterioReferencia && (
                              <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                Ref.: {item.criterioReferencia}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                            item.status === 'conforme'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : item.status === 'nao_conforme'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-slate-200 text-slate-700 border border-slate-300'
                          }`}
                        >
                          {item.status === 'conforme'
                            ? 'Conforme'
                            : item.status === 'nao_conforme'
                            ? 'Não Conf.'
                            : 'N/A'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 leading-snug">
                        <p>{item.observacao || '—'}</p>
                        {item.fotoUrl && (
                          <div className="mt-1.5 flex items-center gap-2">
                            <img
                              src={item.fotoUrl}
                              alt="Evidência in loco"
                              className="w-16 h-12 object-cover rounded border border-slate-300"
                            />
                            <span className="text-[10px] text-slate-500 italic">Evidência anexada</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Rubrica e Assinatura Técnica */}
            <div className="mt-8 pt-6 border-t border-slate-300 flex justify-between items-end">
              <div className="text-[11px] text-slate-500 max-w-sm">
                <p className="font-semibold text-slate-700">Nota Legal de Campo:</p>
                <p>
                  Este documento consiste no levantamento preliminar e registro das condições visuais e funcionais observadas no momento da inspeção presencial. Serve de substrato técnico para a elaboração do Laudo Pericial conclusivo.
                </p>
                {checklist.disponibilizadoParaCliente && (
                  <p className="text-emerald-700 font-bold mt-1">
                    ✓ Disponibilizado para visualização do cliente no Portal VL Engenharia.
                  </p>
                )}
              </div>

              <div className="text-center">
                {checklist.rubricaUrl ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={checklist.rubricaUrl}
                      alt="Rubrica Técnica"
                      className="h-14 max-w-[200px] object-contain mb-1"
                    />
                    <div className="w-48 border-t border-slate-800 pt-1">
                      <p className="font-bold text-xs text-slate-900">{checklist.responsavelNome || 'Eng. Vitor Leonardo'}</p>
                      <p className="text-[10px] text-slate-600">{checklist.responsavelCrea || 'CREA-PE 1822299490'}</p>
                      <p className="text-[9px] text-slate-400">
                        Assinado in loco em{' '}
                        {new Date(checklist.rubricaTimestamp || checklist.dataPreenchimento).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="w-48 border-t border-slate-400 pt-2 text-center text-xs text-slate-400">
                    Aguardando assinatura
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer do Modal */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white flex justify-between items-center text-xs text-slate-500">
          <div>
            Checklist {checklist.numero} • Registrado no sistema VL Engenharia
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
