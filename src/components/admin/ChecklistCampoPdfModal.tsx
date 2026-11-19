import React, { useMemo, useRef, useState } from 'react';
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
  FileText,
  Loader2,
  Camera,
  ClipboardCheck,
} from 'lucide-react';
import { ChecklistCampo, ChecklistCampoItem } from '../../types';
import { DADOS_VL_PADRAO } from '../../lib/orcamentoTemplatePadrao';
import { useData } from '../../context/DataContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

interface ChecklistCampoPdfModalProps {
  checklist: ChecklistCampo;
  onClose: () => void;
}

interface FotoChecklistPdf {
  url: string;
  legenda: string;
  numeroItem: string;
  descricaoItem: string;
  indice: number;
}

function obterFotosDoItem(item: ChecklistCampoItem): Omit<FotoChecklistPdf, 'numeroItem' | 'descricaoItem' | 'indice'>[] {
  if (item.fotos?.length) {
    return item.fotos.map((foto, indice) => ({
      url: foto.url,
      legenda: foto.legenda || foto.titulo || `Foto ${indice + 1}`,
    }));
  }
  if (item.fotosVinculadas?.length) {
    return item.fotosVinculadas.map((foto, indice) => ({
      url: foto.url,
      legenda: foto.descricao || `Foto ${foto.numeroFoto || indice + 1}`,
    }));
  }
  if (item.fotosUrls?.length) {
    return item.fotosUrls.map((url, indice) => ({ url, legenda: `Foto ${indice + 1}` }));
  }
  return item.fotoUrl ? [{ url: item.fotoUrl, legenda: item.fotoNome || 'Evidência fotográfica' }] : [];
}

export const ChecklistCampoPdfModal: React.FC<ChecklistCampoPdfModalProps> = ({
  checklist,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement | null>(null);
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [avisoEmail, setAvisoEmail] = useState('');
  const { ativos, clientes, laudos } = useData();
  const ativo = useMemo(() => ativos.find((item) => item.id === checklist.ativoId), [ativos, checklist.ativoId]);
  const cliente = useMemo(() => clientes.find((item) => item.id === checklist.clienteId), [clientes, checklist.clienteId]);
  const laudoVinculado = useMemo(
    () => laudos.find((item) => item.id === checklist.vinculadoALaudoId || item.checklistCampoOrigemId === checklist.id),
    [laudos, checklist.vinculadoALaudoId, checklist.id],
  );

  const totalItens = (checklist.itens?.length || 0) + (checklist.itensExtras?.length || 0);
  const todosItens = [...(checklist.itens || []), ...(checklist.itensExtras || [])];
  const fotosChecklist: FotoChecklistPdf[] = todosItens.flatMap((item, indiceItem) =>
    obterFotosDoItem(item).map((foto, indiceFoto) => ({
      ...foto,
      numeroItem: item.numero || String(indiceItem + 1),
      descricaoItem: item.descricao,
      indice: indiceFoto + 1,
    })),
  );
  const conformes = todosItens.filter(i => i.status === 'conforme').length;
  const naoConformes = todosItens.filter(i => i.status === 'nao_conforme').length;
  const naoAplicaveis = todosItens.filter(i => i.status === 'nao_aplicavel').length;
  const pendentes = todosItens.filter((item) => !item.status || item.status === 'pendente').length;
  const fotosTotais = fotosChecklist.length;
  const dataVistoria = new Date(checklist.dataPreenchimento || checklist.criadoEm);
  const dataBr = dataVistoria.toLocaleDateString('pt-BR');
  const horaBr = dataVistoria.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const ativoDetalhes = [
    ativo?.tipo || checklist.tipoAtivo,
    ativo?.fabricante,
    ativo?.modelo,
    ativo?.anoFabricacao || ativo?.ano,
    ativo?.proprietario && `Proprietário: ${ativo.proprietario}`,
  ].filter(Boolean).join(' · ');
  const ativoIdentificacao = ativo?.identificacao || checklist.ativoIdentificacao || 'Ativo não informado';
  const capacidadeAtivo = ativo?.capacidade;
  const identificadoresAtivo = [
    ativo?.placa && `Placa: ${ativo.placa}`,
    ativo?.chassi && `Chassi: ${ativo.chassi}`,
    ativo?.renavam && `RENAVAM: ${ativo.renavam}`,
    ativo?.numeroSerie && `Série: ${ativo.numeroSerie}`,
    ativo?.horimetroOuKm !== undefined && `Horímetro/KM: ${ativo.horimetroOuKm}`,
    capacidadeAtivo && `Capacidade: ${capacidadeAtivo}`,
  ].filter(Boolean) as string[];
  const ncResumo = todosItens
    .filter((item) => item.status === 'nao_conforme')
    .slice(0, 5)
    .map((item) => `• ${item.numero || ''} ${item.descricao}${item.observacao ? ` — ${item.observacao}` : ''}`.trim());

  const gerarPdfBlob = async () => {
    if (!printRef.current) return;
    const element = printRef.current;
    let quebrasDeLinhaTabela: number[] = [];
    let alturaConteudoClonado = 0;
    await Promise.all(Array.from(element.querySelectorAll('img')).map((image) => {
      if (image.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        image.onload = () => resolve();
        image.onerror = () => resolve();
        window.setTimeout(resolve, 10_000);
      });
    }));
    const canvas = await html2canvas(element, {
      scale: 1.35,
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: Math.max(element.scrollWidth, 794),
      onclone: (documentClone) => {
        documentClone.querySelectorAll<HTMLElement>('[data-pdf-hide]').forEach((node) => {
          node.style.display = 'none';
        });
        const conteudo = documentClone.querySelector<HTMLElement>('[data-pdf-document]');
        if (!conteudo) return;
        conteudo.style.width = '794px';
        conteudo.style.maxWidth = '794px';
        conteudo.style.padding = '34px';
        conteudo.style.border = '0';
        conteudo.style.borderRadius = '0';
        conteudo.style.boxShadow = 'none';
        const topoConteudo = conteudo.getBoundingClientRect().top;
        quebrasDeLinhaTabela = Array.from(conteudo.querySelectorAll('tbody tr, [data-pdf-break-before], [data-pdf-break-after]'))
          .flatMap((bloco) => {
            const caixa = bloco.getBoundingClientRect();
            const inicio = caixa.top - topoConteudo;
            const fim = caixa.bottom - topoConteudo;
            return bloco.matches('tr') || bloco.hasAttribute('data-pdf-break-before')
              ? [inicio, fim]
              : [fim];
          })
          .filter((posicao) => posicao > 0);
        alturaConteudoClonado = conteudo.getBoundingClientRect().height;
      },
    });

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const contentTop = 12;
    const footerSpace = 14;
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = pageHeight - contentTop - footerSpace;
    const sliceHeight = Math.floor((contentHeight * canvas.width) / contentWidth);
    const escalaVertical = alturaConteudoClonado > 0
      ? canvas.height / alturaConteudoClonado
      : canvas.width / Math.max(element.scrollWidth, 794);
    let y = 0;
    let page = 0;

    while (y < canvas.height) {
      let currentHeight = Math.min(sliceHeight, canvas.height - y);
      if (y + currentHeight < canvas.height) {
        const limitesDeLinha = quebrasDeLinhaTabela
          .map((posicao) => Math.round(posicao * escalaVertical))
          .filter((posicao) => posicao > y + 24 && posicao <= y + sliceHeight);
        if (limitesDeLinha.length > 0) {
          currentHeight = Math.max(...limitesDeLinha) - y;
        }
      }
      if (currentHeight <= 0) throw new Error('Não foi possível separar os itens entre as páginas do PDF.');
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = currentHeight;
      const context = pageCanvas.getContext('2d');
      if (!context) throw new Error('Não foi possível preparar a página do PDF.');
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      context.drawImage(canvas, 0, y, canvas.width, currentHeight, 0, 0, canvas.width, currentHeight);

      if (page > 0) pdf.addPage();
      const heightMm = (currentHeight * contentWidth) / canvas.width;
      pdf.addImage(pageCanvas.toDataURL('image/jpeg', 0.92), 'JPEG', margin, contentTop, contentWidth, heightMm);
      if (page > 0) {
        pdf.setFontSize(8);
        pdf.setTextColor(71, 85, 105);
        pdf.text(`Checklist de Campo ${checklist.numero} · continuação`, margin, 8);
      }
      pdf.setDrawColor(220, 226, 234);
      pdf.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);
      pdf.setFontSize(7);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`VL Engenharia · Checklist ${checklist.numero}`, margin, pageHeight - 5);
      pdf.text(`Página ${page + 1}`, pageWidth - margin, pageHeight - 5, { align: 'right' });
      y += currentHeight;
      page += 1;
    }

    pdf.setProperties({
      title: `Checklist de Campo ${checklist.numero}`,
      subject: checklist.tipoLaudoNome || 'Checklist de inspeção',
      author: 'VL Engenharia',
      creator: 'Sistema VL Engenharia',
    });
    return pdf.output('blob');
  };

  const handleDownloadPdf = async () => {
    setGerandoPdf(true);
    try {
      const blob = await gerarPdfBlob();
      if (!blob) throw new Error('A prévia do checklist ainda não está pronta.');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Checklist_Campo_${checklist.numero}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      const detalhe = error instanceof Error ? error.message : String(error);
      console.error('Detalhe da falha ao gerar PDF:', detalhe);
      window.alert(`Não foi possível gerar o PDF. ${detalhe || 'Confira a conexão e tente novamente.'}`);
    } finally {
      setGerandoPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const texto = `Olá! Segue o resumo da vistoria técnica realizada pela *VL Engenharia*.

📋 *CHECKLIST DE CAMPO · ${checklist.numero}*
━━━━━━━━━━━━━━━━━━━━
*Serviço:* ${checklist.tipoLaudoNome || checklist.categoriaLaudo || checklist.tipoLaudoId}
*Cliente:* ${checklist.clienteNome || cliente?.razaoSocial || cliente?.nomeFantasia || 'Não informado'}
*Ativo:* ${ativoIdentificacao}${ativoDetalhes ? `\n*Identificação:* ${ativoDetalhes}` : ''}
*Data:* ${dataBr} às ${horaBr}
*Local:* ${checklist.geolocalizacao?.enderecoAproximado || 'Conforme registro da vistoria'}
*Responsável técnico:* ${checklist.responsavelNome || 'Não informado'}${checklist.responsavelCrea ? ` · ${checklist.responsavelCrea}` : ''}

📊 *RESULTADO DA INSPEÇÃO*
✅ Conforme: ${conformes}
⚠️ Não conforme: ${naoConformes}
➖ Não aplicável: ${naoAplicaveis}
⏳ Pendente: ${pendentes}
📷 Evidências fotográficas: ${fotosTotais}
${ncResumo.length ? `\n⚠️ *PONTOS DE ATENÇÃO*\n${ncResumo.join('\n')}${naoConformes > ncResumo.length ? `\n• E mais ${naoConformes - ncResumo.length} apontamento(s)` : ''}` : ''}

${checklist.status === 'finalizado' ? 'Vistoria finalizada e rubricada pelo responsável técnico.' : 'Documento em andamento; os resultados ainda podem ser atualizados.'}

Este resumo não substitui o laudo técnico completo. Em caso de dúvida, fale com nossa equipe.`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  const handleShareEmail = async () => {
    setAvisoEmail('');
    setGerandoPdf(true);
    try {
      const blob = await gerarPdfBlob();
      if (!blob) throw new Error('A prévia do checklist ainda não está pronta.');
      const file = new File([blob], `Checklist_Campo_${checklist.numero}.pdf`, { type: 'application/pdf' });
      const texto = `Prezados,

Encaminhamos, em anexo, o Checklist de Campo ${checklist.numero}, referente à vistoria técnica realizada pela VL Engenharia.

SERVIÇO
${checklist.tipoLaudoNome || checklist.categoriaLaudo || checklist.tipoLaudoId}

IDENTIFICAÇÃO
Cliente: ${checklist.clienteNome || cliente?.razaoSocial || cliente?.nomeFantasia || 'Não informado'}
Ativo: ${ativoIdentificacao}${ativoDetalhes ? `\nDados do ativo: ${ativoDetalhes}` : ''}
Data da vistoria: ${dataBr} às ${horaBr}
Responsável técnico: ${checklist.responsavelNome || 'Não informado'}${checklist.responsavelCrea ? ` · ${checklist.responsavelCrea}` : ''}

RESULTADO
Itens verificados: ${totalItens}
Conformes: ${conformes} | Não conformes: ${naoConformes} | Não aplicáveis: ${naoAplicaveis} | Pendentes: ${pendentes}
${ncResumo.length ? `\nPRINCIPAIS NÃO CONFORMIDADES\n${ncResumo.map((linha) => linha.replace(/^• /, '• ')).join('\n')}` : ''}

O documento anexo contém o registro detalhado dos itens, observações, evidências disponíveis e rubrica do responsável técnico.

Atenciosamente,
VL Engenharia · Inspeções e Laudos Técnicos
atendimento@vlengenhariamecanica.com.br · (81) 98843-0965`;

      let compartilhado = false;
      try {
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `Checklist de Campo ${checklist.numero} · VL Engenharia`,
            text: texto,
          });
          compartilhado = true;
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        console.info('Compartilhamento de arquivo indisponível; usando e-mail como alternativa.', error);
      }
      if (compartilhado) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
      const subject = encodeURIComponent(`Checklist de Campo ${checklist.numero} | VL Engenharia`);
      const emailDestino = cliente?.contatos?.find((contato) => contato.email?.trim())?.email || '';
      window.location.href = `mailto:${encodeURIComponent(emailDestino)}?subject=${subject}&body=${encodeURIComponent(`${texto}\n\nO PDF foi baixado para este dispositivo. Anexe o arquivo Checklist_Campo_${checklist.numero}.pdf antes de enviar.`)}`;
      setAvisoEmail('O PDF foi baixado. Seu aplicativo de e-mail não aceita anexos pelo navegador; anexe o arquivo antes de enviar.');
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      console.error('Erro ao preparar e-mail com checklist:', error);
      const detalhe = error instanceof Error ? error.message : String(error);
      setAvisoEmail(`Não foi possível preparar o PDF para compartilhar${detalhe ? `: ${detalhe}` : '.'} Baixe o arquivo e anexe-o manualmente.`);
    } finally {
      setGerandoPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[94vh] flex flex-col overflow-hidden my-auto border border-slate-200">
        {/* Header do Modal */}
        <div className="flex flex-col gap-3 px-4 py-3 border-b border-slate-200 bg-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-blue-700" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-900 truncate">
                Checklist de Campo: {checklist.numero}
              </h2>
              <p className="text-xs text-slate-500 truncate">
                {checklist.tipoLaudoNome || checklist.categoriaLaudo} · {ativoIdentificacao}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-200"
              title="Compartilhar via WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              WhatsApp
            </button>
            <button
              type="button"
              onClick={handleShareEmail}
              disabled={gerandoPdf}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200 disabled:opacity-60"
              title="Preparar e compartilhar o PDF assinado por e-mail"
            >
              <Send className="w-3.5 h-3.5" />
              E-mail + PDF
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl transition-colors border border-slate-300"
              title="Imprimir"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={gerandoPdf}
              className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 rounded-xl transition-colors shadow-xs"
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
              type="button"
              onClick={onClose}
              className="shrink-0 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Fechar prévia"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo do Documento (Área que vira PDF) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-100">
          {avisoEmail && (
            <div role="status" className="max-w-[800px] mx-auto mb-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
              {avisoEmail}
            </div>
          )}
          <div
            ref={printRef}
            data-pdf-document
            className="mx-auto bg-white text-slate-900 w-full max-w-[800px] p-5 sm:p-8 shadow-sm print:shadow-none print:p-0 print:m-0"
          >
            {/* Topo Oficial */}
            <div className="border-b border-slate-300 pb-4 mb-5 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <img
                    src="/vl-logo-horizontal.svg"
                    alt="VL Engenharia"
                    crossOrigin="anonymous"
                    className="h-12 w-auto max-w-[245px] object-contain object-left"
                  />
                </div>
                <p className="text-[10px] text-slate-600 mt-2">
                  Engenharia mecânica · inspeções e laudos técnicos
                </p>
                <p className="text-[9px] text-slate-500">
                  CREA-PE {DADOS_VL_PADRAO.crea} • CNPJ {DADOS_VL_PADRAO.cnpj} • {DADOS_VL_PADRAO.sede}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-sm font-semibold text-slate-900">{checklist.numero}</p>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Vistoria: {dataBr} às {horaBr}
                </p>
                <div className="mt-1">
                  <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                    checklist.status === 'finalizado' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {checklist.status === 'finalizado' ? 'Finalizado e rubricado' : 'Em andamento'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quadro de Identificação */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5 text-xs">
              <div>
                <span className="text-[9px] text-slate-500 block mb-1">Cliente e serviço</span>
                <div className="border-t border-slate-200 pt-2">
                  <p className="font-semibold text-slate-900 text-sm">{checklist.clienteNome || cliente?.razaoSocial || cliente?.nomeFantasia || 'Cliente não informado'}</p>
                  {(checklist.clienteCnpj || cliente?.cnpj) && <p className="text-slate-600 mt-0.5">CNPJ: {checklist.clienteCnpj || cliente?.cnpj}</p>}
                  <p className="text-slate-700 mt-2">{checklist.tipoLaudoNome || checklist.categoriaLaudo || checklist.tipoLaudoId}</p>
                </div>
              </div>

              <div>
                <span className="text-[9px] text-slate-500 block mb-1">Ativo inspecionado</span>
                <div className="border-t border-slate-200 pt-2">
                  <p className="font-semibold text-slate-900 text-sm">{ativoIdentificacao}</p>
                  {ativoDetalhes && <p className="text-slate-600 mt-0.5">{ativoDetalhes}</p>}
                  {identificadoresAtivo.length > 0 && <p className="text-slate-600 mt-1.5">{identificadoresAtivo.join(' · ')}</p>}
                  {checklist.responsavelNome && (
                    <p className="text-slate-600 mt-2">
                      Responsável: <strong className="text-slate-800">{checklist.responsavelNome}</strong>
                      {checklist.responsavelCrea ? ` · ${checklist.responsavelCrea}` : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {(checklist.geolocalizacao || checklist.vinculadoAOrcamentoId || laudoVinculado?.artNumero) && (
              <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2 border-y border-slate-200 py-2.5 text-[10px] text-slate-600">
                {checklist.geolocalizacao && (
                  <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-700" />
                    {checklist.geolocalizacao.enderecoAproximado || `Lat ${checklist.geolocalizacao.lat.toFixed(5)}, Lng ${checklist.geolocalizacao.lng.toFixed(5)}`}
                  </span>
                )}
                {checklist.vinculadoAOrcamentoId && <span>Orçamento vinculado: {checklist.vinculadoAOrcamentoId}</span>}
                {laudoVinculado?.artNumero && <span>ART vinculada: {laudoVinculado.artNumero}</span>}
              </div>
            )}
            {/* Placar de Indicadores */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2 text-left">
              <div className="border-t-2 border-emerald-600 pt-2">
                <span className="block text-xl font-semibold text-slate-900">{conformes}</span>
                <span className="text-[10px] text-slate-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Conforme
                </span>
              </div>
              <div className="border-t-2 border-rose-600 pt-2">
                <span className="block text-xl font-semibold text-slate-900">{naoConformes}</span>
                <span className="text-[10px] text-slate-600 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-700" /> Não conforme
                </span>
              </div>
              <div className="border-t-2 border-slate-400 pt-2">
                <span className="block text-xl font-semibold text-slate-900">{naoAplicaveis}</span>
                <span className="text-[10px] text-slate-600 flex items-center gap-1">
                  <MinusCircle className="w-3 h-3 text-slate-600" /> Não aplicável
                </span>
              </div>
              <div className="border-t-2 border-amber-500 pt-2">
                <span className="block text-xl font-semibold text-slate-900">{pendentes}</span>
                <span className="text-[10px] text-slate-600">Pendente</span>
              </div>
            </div>
            <div className="mb-5 flex items-center justify-between gap-2 text-[10px] text-slate-500">
              <span>{totalItens} itens no checklist</span>
              <span className="inline-flex items-center gap-1"><Camera className="w-3 h-3" />{fotosTotais} evidências fotográficas</span>
            </div>

            {/* Tabela de Verificação Técnica */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-2 border-b border-slate-300 pb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-600" />
                Itens da vistoria ({totalItens})
              </h3>

              <table className="w-full text-[10px] text-left border-collapse">
                <thead className="text-slate-600 font-semibold border-b border-slate-300">
                  <tr>
                    <th className="py-2 px-2 w-10 text-left">Nº</th>
                    <th className="py-2 px-2">Item verificado</th>
                    <th className="py-2 px-2 w-24 text-left">Resultado</th>
                    <th className="py-2 px-2">Observações e evidências</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {todosItens.map((item, idx) => {
                    const fotos = obterFotosDoItem(item);
                    const valorMedido = item.medicao?.valorEncontrado ?? item.valorResposta;
                    const unidadeMedida = item.medicao?.unidade || (item.unidade && item.unidade !== 'texto' ? item.unidade : '');

                    return (
                    <tr key={`${item.id || 'row'}-${idx}`} className="align-top">
                      <td className="py-2.5 px-2 text-slate-500 font-mono">
                        {item.numero || idx + 1}
                      </td>
                      <td className="py-2.5 px-2 text-slate-800 leading-snug">
                        {item.secaoLaudo && <p className="mb-1 text-[9px] font-medium text-slate-500">{item.secaoLaudo}</p>}
                        <p className="font-medium">{item.descricao}</p>
                        {(item.criterioConformidade || item.criterioInspecao) && (
                          <p className="mt-1 text-[9px] leading-snug text-slate-500">
                            Critério: {item.criterioConformidade || item.criterioInspecao}
                          </p>
                        )}
                        {(valorMedido !== undefined && valorMedido !== '' || item.criterioReferencia) && (
                          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px]">
                            {valorMedido !== undefined && valorMedido !== '' && (
                              <span className="text-slate-700 font-semibold">
                                Medição: {valorMedido} {unidadeMedida}
                              </span>
                            )}
                            {item.criterioReferencia && (
                              <span className="text-slate-500">
                                Ref.: {item.criterioReferencia}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-2">
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
                            ? 'Não conforme'
                            : item.status === 'nao_aplicavel'
                            ? 'N/A'
                            : item.status === 'nao_evidenciado'
                            ? 'Não evidenciado'
                            : item.status === 'medicao'
                            ? 'Medição'
                            : 'Pendente'}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-slate-600 leading-snug">
                        <p className={!item.observacao && (item.status === 'nao_conforme' || item.status === 'nao_aplicavel') ? 'font-semibold text-amber-800' : ''}>
                          {item.observacao || (item.status === 'nao_conforme' || item.status === 'nao_aplicavel' ? 'Observação não registrada' : '—')}
                        </p>
                        {item.acaoRecomendada && item.status === 'nao_conforme' && (
                          <p className="mt-1 text-[10.5px] text-rose-800">
                            <strong>Ação:</strong> {item.acaoRecomendada}
                          </p>
                        )}
                        {fotos.length > 0 && (
                          <div className="mt-1 text-[9px] text-slate-500">
                            {fotos.length} foto{fotos.length === 1 ? '' : 's'} no registro fotográfico
                          </div>
                        )}
                      </td>
                    </tr>
                  );})}
                </tbody>
              </table>
            </div>

            {fotosChecklist.length > 0 && (
              <section className="mt-7" aria-label="Registro fotográfico">
                <div className="mb-3 flex items-end justify-between border-b border-slate-300 pb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Registro fotográfico</h3>
                    <p className="mt-0.5 text-[10px] text-slate-500">
                      {fotosChecklist.length} evidência{fotosChecklist.length === 1 ? '' : 's'} vinculada{fotosChecklist.length === 1 ? '' : 's'} aos itens da vistoria
                    </p>
                  </div>
                  <Camera className="h-4 w-4 text-slate-500" />
                </div>
                <div className="space-y-4">
                  {fotosChecklist.map((foto, indice) => (
                    <figure
                      key={`${foto.numeroItem}-${foto.indice}-${indice}`}
                      data-pdf-break-before
                      data-pdf-break-after
                      className="overflow-hidden border-b border-slate-200 pb-4"
                    >
                      <figcaption className="mb-2 flex items-baseline justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold text-slate-800">
                            Item {foto.numeroItem} · {foto.descricaoItem}
                          </p>
                          <p className="mt-0.5 text-[9px] text-slate-500">
                            Evidência {indice + 1} de {fotosChecklist.length}
                          </p>
                        </div>
                        <span className="shrink-0 text-[9px] text-slate-500">{foto.legenda}</span>
                      </figcaption>
                      <div className="flex min-h-[250px] w-full items-center justify-center bg-slate-50">
                        <img
                          src={foto.url}
                          alt={`Evidência fotográfica do item ${foto.numeroItem}: ${foto.legenda}`}
                          crossOrigin="anonymous"
                          loading="eager"
                          className="block max-h-[380px] w-full object-contain"
                        />
                      </div>
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {/* Rubrica e Assinatura Técnica */}
            <div data-pdf-break-before data-pdf-break-after className="mt-8 pt-5 border-t border-slate-300 flex justify-between items-end">
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
