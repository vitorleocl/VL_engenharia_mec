import React, { useRef, useState, useMemo, useEffect } from 'react';
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
  ListOrdered,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Camera,
  Layers,
  Paperclip,
  CheckSquare
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { Laudo, LaudoSecao, Cliente, Ativo } from '../../types';
import { EngineeringWatermark } from '../common/EngineeringWatermark';
import { converterPdfParaImagem } from '../../lib/pdfToImage';

interface LaudoPdfExportModalProps {
  laudo: Laudo;
  cliente?: Cliente;
  ativo?: Ativo;
  isOpen: boolean;
  onClose: () => void;
  onAtualizarSecoes?: (secoes: LaudoSecao[]) => void;
}

interface PaginaLaudoDef {
  id: string;
  numero: number;
  tipo: 'capa' | 'cadastro' | 'secao' | 'conclusao' | 'art' | 'sumario';
  titulo: string;
  subtitulo?: string;
  render: () => React.ReactNode;
}

export const LaudoPdfExportModal: React.FC<LaudoPdfExportModalProps> = ({
  laudo,
  cliente,
  ativo,
  isOpen,
  onClose,
  onAtualizarSecoes,
}) => {
  const printContainerRef = useRef<HTMLDivElement>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [modoVisualizacao, setModoVisualizacao] = useState<'pagina' | 'continua'>('pagina');
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [sucessoDownload, setSucessoDownload] = useState(false);
  const [menuSecoesAberto, setMenuSecoesAberto] = useState(false);

  // Local state for hidden sections in PDF
  const [secoesOcultadasLocal, setSecoesOcultadasLocal] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    (laudo.secoes || []).forEach(s => {
      if (s.ocultaNoPdf) map[s.id] = true;
    });
    return map;
  });

  const handleToggleSecaoNoModal = (secId: string) => {
    setSecoesOcultadasLocal(prev => {
      const next = { ...prev, [secId]: !prev[secId] };
      if (onAtualizarSecoes && laudo.secoes) {
        const atualizadas = laudo.secoes.map(s => ({
          ...s,
          ocultaNoPdf: Boolean(next[s.id]),
        }));
        onAtualizarSecoes(atualizadas);
      }
      return next;
    });
  };

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

  const [artImagemVisual, setArtImagemVisual] = useState<string | null>(null);
  const [renderizandoPdfArt, setRenderizandoPdfArt] = useState(false);

  // Carrega ou converte o arquivo da ART para exibição como imagem real
  useEffect(() => {
    if (!laudo.artArquivoUrl) {
      setArtImagemVisual(null);
      return;
    }

    // Se já for uma imagem (data:image ou URL de imagem)
    if (
      laudo.artTipoArquivo === 'imagem' || 
      laudo.artArquivoUrl.startsWith('data:image/') ||
      laudo.artArquivoUrl.match(/\.(jpeg|jpg|png|webp|gif)(\?.*)?$/i)
    ) {
      setArtImagemVisual(laudo.artArquivoUrl);
      return;
    }

    // Se for PDF, converte para imagem via pdfjs-dist
    let ativoBool = true;
    setRenderizandoPdfArt(true);
    converterPdfParaImagem(laudo.artArquivoUrl)
      .then((imgDataUrl) => {
        if (ativoBool) setArtImagemVisual(imgDataUrl);
      })
      .catch((err) => {
        console.error('Falha ao renderizar PDF da ART:', err);
      })
      .finally(() => {
        if (ativoBool) setRenderizandoPdfArt(false);
      });

    return () => {
      ativoBool = false;
    };
  }, [laudo.artArquivoUrl, laudo.artTipoArquivo]);

  // Filtra apenas seções visíveis (permite ao perito ocultar seções sem excluí-las)
  const secoesVisiveis = useMemo(() => {
    return [...(laudo.secoes || [])]
      .filter(s => !secoesOcultadasLocal[s.id])
      .sort((a, b) => a.ordem - b.ordem);
  }, [laudo.secoes, secoesOcultadasLocal]);

  // =========================================================================
  // BUILD DISCRETE A4 PAGES FOR THE LAUDO
  // This guarantees zero cutting/clipping when compiling to PDF
  // =========================================================================
  const paginasLaudo: PaginaLaudoDef[] = useMemo(() => {
    const list: PaginaLaudoDef[] = [];
    let pageNum = 1;

    // -------------------------------------------------------------------------
    // PAGE 1: CAPA OFICIAL DO LAUDO
    // -------------------------------------------------------------------------
    list.push({
      id: 'capa',
      numero: pageNum++,
      tipo: 'capa',
      titulo: 'Capa Oficial do Laudo',
      subtitulo: 'Identificação & Credenciamento CREA-PE',
      render: () => (
        <div className="h-full flex flex-col justify-between text-slate-900">
          {/* Top Header */}
          <div className="border-b-2 border-[#0B1E3D] pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs">
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
                <p className="text-[11px] font-bold text-[#1565D8] uppercase tracking-wider mt-1">
                  Consultoria Técnica, Perícias & Segurança Operacional
                </p>
                <p className="text-[10px] text-slate-600 font-mono mt-0.5">
                  Registro Profissional: <strong>CREA-PE 182229949-0</strong> • E-mail: vlengenhariamec@gmail.com
                </p>
              </div>
            </div>
          </div>

          {/* Title Box */}
          <div className="my-auto space-y-4 py-2">
            <div className="text-center space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#0B1E3D] text-white">
                DOCUMENTO TÉCNICO PERICIAL OFICIAL
              </span>
              <h2 className="text-2xl font-black text-[#0B1E3D] tracking-tight uppercase leading-tight">
                LAUDO TÉCNICO PERICIAL DE ENGENHARIA
              </h2>
              <p className="text-sm font-bold text-[#1565D8] uppercase tracking-wide">
                {laudo.tipo}
              </p>
            </div>

            {/* FOTO DA CAPA OU ILUSTRAÇÃO TÉCNICA */}
            <div className="w-full max-w-lg mx-auto">
              {laudo.capaFotoUrl ? (
                <div className="rounded-xl overflow-hidden border-2 border-[#1565D8] shadow-md bg-slate-900 text-center">
                  <img 
                    src={laudo.capaFotoUrl} 
                    alt="Foto de Capa do Equipamento" 
                    className="w-full h-56 object-cover"
                    crossOrigin="anonymous"
                  />
                  <div className="bg-[#0B1E3D] text-white text-[10px] py-1.5 px-3 font-semibold text-center italic">
                    {laudo.capaFotoLegenda || 'Fotografia técnica do equipamento em avaliação pericial'}
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/80 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-[#1565D8] flex items-center justify-center mx-auto">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                    {laudo.ativoIdentificacao || 'Equipamento Mecânico Inspecionado'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Inspeção pericial diagnóstica de conformidade normativa e segurança operacional.
                  </p>
                </div>
              )}
            </div>

            {/* Metadata Quadro de Identificação */}
            <div className="w-full max-w-lg mx-auto bg-slate-50 rounded-xl border border-slate-200 p-3.5 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Nº do Laudo:</span>
                  <strong className="text-slate-900 font-mono text-xs">{laudo.numero}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">ART CREA-PE:</span>
                  <strong className="text-emerald-700 font-mono text-xs">{laudo.artNumero || 'Protocolada'}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Cliente / Solicitante:</span>
                  <strong className="text-slate-800 truncate block text-[11px]">{laudo.clienteNome}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Data da Vistoria:</span>
                  <strong className="text-slate-800 font-mono text-[11px]">{dataFormatada}</strong>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Equipamento / TAG:</span>
                <strong className="text-[#1565D8] font-bold block text-[11px]">{laudo.ativoIdentificacao}</strong>
              </div>
            </div>
          </div>

          {/* Footer Capa */}
          <div className="mt-auto shrink-0 border-t-2 border-[#0B1E3D] pt-3 text-[9px] text-slate-500 flex items-center justify-between w-full">
            <div>
              <strong className="text-slate-800">ENG. VITOR LEONARDO CORDEIRO LINHARES</strong>
              <span> • CREA-PE 182229949-0</span>
            </div>
            <div className="text-slate-600 font-medium">
              ART CREA-PE: <strong className="text-slate-800 font-mono">{laudo.artNumero || 'Vinculada ao Laudo'}</strong>
            </div>
          </div>
        </div>
      ),
    });

    // =========================================================================
    // SEÇÕES TÉCNICAS DO LAUDO (COM NUMERAÇÃO DINÂMICA E SEM DUPLICIDADE)
    // =========================================================================
    const normalizarHtmlSecao = (sec: LaudoSecao): string => {
      let html = sec.conteudoHtml || '';
      const t = sec.titulo.toLowerCase();

      // 1. Destinatário e Qualificação: Garante endereço operacional e contato técnico solicitados
      if (t.includes('destinatário') || t.includes('destinatario') || t.includes('qualificação') || t.includes('qualificacao')) {
        if (!html.includes('Avenida Jose Pinheiro dos Santos') && !html.includes('Pinheiropolis')) {
          const rowsInfo = `
    <tr>
      <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-700">Endereço Operacional:</td>
      <td class="border border-slate-300 p-2 text-xs text-slate-900">Avenida Jose Pinheiro dos Santos, 20, - Pinheiropolis, Caruaru/PE</td>
    </tr>
    <tr>
      <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-700">Contato Técnico:</td>
      <td class="border border-slate-300 p-2 text-xs text-slate-900 font-semibold">Thiago Cunha (adfcentroautomotivo@gmail.com)</td>
    </tr>`;
          if (html.includes('Contratante') || html.includes('contratante')) {
            html = html.replace(/(<tr[^>]*>[\s\S]*?Contratante[\s\S]*?<\/tr>)/i, `$1${rowsInfo}`);
          } else if (html.includes('<tbody>')) {
            html = html.replace('<tbody>', `<tbody>${rowsInfo}`);
          }
        }
      }

      // 2. Dados do Veículo: remove completamente a informação do renavam
      if (t.includes('dados do veículo') || t.includes('dados do veiculo') || t.includes('veículo') || t.includes('veiculo')) {
        html = html.replace(/<tr[^>]*>[\s\S]*?renavam[\s\S]*?<\/tr>/gi, '');
        html = html.replace(/<td[^>]*>[\s\S]*?renavam[\s\S]*?<\/td>/gi, '');
      }

      return html;
    };

    // Identifica se existe seção de conclusão entre as seções visíveis
    const secaoConclusao = secoesVisiveis.find(s => {
      const t = s.titulo.toLowerCase();
      return t.includes('conclusão') || t.includes('conclusao');
    });

    const secaoConsideracoes = secoesVisiveis.find(s => {
      const t = s.titulo.toLowerCase();
      return t.includes('considerações finais') || t.includes('consideracoes finais');
    });

    // Filtra seções que não devem gerar páginas duplicadas/isoladas
    const secoesFiltradas = secoesVisiveis.filter(s => {
      const t = s.titulo.toLowerCase();
      // Não duplica placeholder de texto da ART quando há o anexo visual oficial
      if (t.includes('art e responsabilidade') || (t.includes('anexo da art') && (laudo.artArquivoUrl || artImagemVisual))) {
        return false;
      }
      // Se houver considerações finais e conclusão, incorpora nas considerações da conclusão para não gerar página de 2 linhas
      if (secaoConsideracoes && s.id === secaoConsideracoes.id && secaoConclusao) {
        return false;
      }
      return true;
    });

    // Mapeamento dinâmico de páginas (Capa é pág 1, seções iniciam na pág 2)
    const pageMap: Record<string, number> = {};
    secoesFiltradas.forEach(s => {
      pageMap[s.id] = pageNum++;
    });

    const conclusaoPageIndex = secaoConclusao ? pageMap[secaoConclusao.id] : pageNum++;
    const temArtAnexo = Boolean(artImagemVisual || (laudo.artTipoArquivo === 'imagem' && laudo.artArquivoUrl) || laudo.artArquivoUrl);
    const artPageIndex = temArtAnexo ? pageNum++ : 0;
    const totalEstimado = pageNum - 1;

    // Itens dinâmicos para o Sumário Executivo com numeração exata de cada página
    const itensSumario: { numero: number; titulo: string; pagina: number }[] = [];
    let itemCounter = 1;

    secoesFiltradas.forEach(s => {
      const isConclusao = s.id === secaoConclusao?.id;
      itensSumario.push({
        numero: itemCounter++,
        titulo: isConclusao ? 'Conclusão Técnica Pericial & Assinatura' : s.titulo,
        pagina: pageMap[s.id] || 0,
      });
    });

    if (!secaoConclusao) {
      itensSumario.push({
        numero: itemCounter++,
        titulo: 'Conclusão Técnica & Assinatura',
        pagina: conclusaoPageIndex,
      });
    }

    if (temArtAnexo) {
      itensSumario.push({
        numero: itemCounter++,
        titulo: 'Anexo Oficial da ART CREA-PE',
        pagina: artPageIndex,
      });
    }

    // Geração das páginas das seções técnicas
    secoesFiltradas.forEach((secao, idx) => {
      const pageIndex = pageMap[secao.id];
      const tLower = secao.titulo.toLowerCase();
      const isSumario = tLower.includes('sumário') || tLower.includes('sumario');
      const isConclusao = secao.id === secaoConclusao?.id;

      list.push({
        id: `secao-${secao.id}`,
        numero: pageIndex,
        tipo: isConclusao ? 'conclusao' : isSumario ? 'sumario' : 'secao',
        titulo: secao.titulo,
        subtitulo: isConclusao ? 'Parecer Conclusivo & Assinatura' : `Seção Técnica ${idx + 1}`,
        render: () => (
          <div className="flex-1 flex flex-col justify-between h-full min-h-full w-full text-slate-900">
            <div className="flex-1 flex flex-col">
              {/* Standard Header */}
              <div className="border-b-2 border-[#0B1E3D] pb-3 mb-4 flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <img src="/logo.png" alt="VL" className="h-9 w-auto object-contain" crossOrigin="anonymous" />
                  <div>
                    <h3 className="text-sm font-black text-[#0B1E3D]">VL ENGENHARIA MECÂNICA</h3>
                    <p className="text-[9px] text-[#1565D8] font-bold uppercase tracking-wider">
                      {laudo.tipo} • Laudo Nº {laudo.numero}
                    </p>
                  </div>
                </div>
                <div className="text-right text-[9px] text-slate-500 font-mono">
                  <p>ART CREA-PE: <strong>{laudo.artNumero || 'Homologada'}</strong></p>
                  <p>Página {pageIndex} de {totalEstimado}</p>
                </div>
              </div>

              {/* Section Header */}
              <div className="mb-4 pb-2 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#1565D8] uppercase tracking-wider font-mono">
                    ITEM {idx + 1}
                  </span>
                  <h2 className="text-base font-black text-[#0B1E3D]">
                    {isConclusao ? 'Conclusão Técnica Pericial & Assinatura' : secao.titulo}
                  </h2>
                </div>
                {secao.isObrigatoria && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Requisito Normativo
                  </span>
                )}
                {isConclusao && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Parecer Pericial Homologado
                  </span>
                )}
              </div>

              {/* RENDERIZAÇÃO ESPECIAL 1: SUMÁRIO EXECUTIVO VISUALMENTE APRIMORADO COM PÁGINAS EXATAS */}
              {isSumario ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-[#0B1E3D] text-white flex items-center justify-between shadow-xs">
                    <div>
                      <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest block font-mono">
                        ESTRUTURA ANALÍTICA DO LAUDO
                      </span>
                      <h3 className="text-sm font-black tracking-tight text-white uppercase mt-0.5">
                        Sumário Executivo & Relação de Seções
                      </h3>
                    </div>
                    <div className="text-right text-[10px] text-slate-300 font-mono">
                      <span className="px-2.5 py-1 rounded bg-white/10 text-white font-bold border border-white/20">
                        Total de {totalEstimado} páginas
                      </span>
                    </div>
                  </div>

                  {/* Lista de seções com paginação precisa e design técnico */}
                  <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs divide-y divide-slate-100">
                    {itensSumario.map((item) => (
                      <div 
                        key={item.numero}
                        className="flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 transition-colors text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-6 h-6 rounded-md bg-blue-50 text-[#1565D8] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 border border-blue-100">
                            {String(item.numero).padStart(2, '0')}
                          </span>
                          <span className="font-semibold text-slate-800 truncate">
                            {item.titulo}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          <div className="w-12 sm:w-24 border-b border-dotted border-slate-300"></div>
                          <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-mono text-[10.5px] font-bold border border-slate-200">
                            Pág. {String(item.pagina).padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Diretrizes Normativas e Metodologia */}
                  <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/50 text-[10.5px] text-slate-700 space-y-1">
                    <strong className="text-[#0B1E3D] block text-xs">Observações da Estrutura Pericial:</strong>
                    <p className="leading-relaxed">
                      A numeração de páginas segue rigorosamente a ordem sequencial das diligências, constatações materiais e fundamentação normativa do laudo, assegurando conformidade com as diretrizes do CONFEA/CREA e do Código de Defesa do Consumidor.
                    </p>
                  </div>
                </div>
              ) : (
                /* Rich Text HTML Content com sanitização e injeção de dados corretos */
                secao.conteudoHtml && (
                  <div 
                    className="prose prose-sm max-w-none text-slate-800 text-[11px] leading-relaxed mb-3"
                    dangerouslySetInnerHTML={{ __html: normalizarHtmlSecao(secao) }}
                  />
                )
              )}

              {/* RENDERIZAÇÃO ESPECIAL 2: CONCLUSÃO TÉCNICA E ASSINATURA EM UMA ÚNICA PÁGINA */}
              {isConclusao && (
                <>
                  {/* Se houver considerações finais adicionais, anexa neste mesmo bloco */}
                  {secaoConsideracoes && (
                    <div 
                      className="prose prose-sm max-w-none text-slate-700 text-[10.5px] leading-relaxed mb-3 border-t border-slate-200 pt-2"
                      dangerouslySetInnerHTML={{ __html: normalizarHtmlSecao(secaoConsideracoes) }}
                    />
                  )}

                  {/* Bloco Oficial de Assinatura Profissional - Espaço limpo e sem poluição para assinar posteriormente */}
                  <div className="pt-3 mt-auto">
                    <div className="p-4 border border-slate-300 rounded-2xl bg-white shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-3.5">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#1565D8] shrink-0 bg-slate-100 shadow-sm">
                          <img 
                            src="/vitor-leonardo.png" 
                            alt="Eng. Vitor Leonardo" 
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous"
                          />
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-[#0B1E3D] leading-tight">
                            VITOR LEONARDO CORDEIRO LINHARES
                          </h4>
                          <p className="text-[11px] font-bold text-[#1565D8] uppercase tracking-wide">
                            Engenheiro Mecânico • Perito Técnico Responsável
                          </p>
                          <p className="text-[10px] font-mono text-slate-600 mt-0.5">
                            Registro Profissional: <strong>CREA-PE 182229949-0</strong>
                          </p>
                          <p className="text-[9.5px] text-slate-500 mt-0.5">
                            ART Vinculada: <strong>{laudo.artNumero || 'Registrada junto ao CREA-PE'}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Linha de Assinatura com espaço limpo para assinar posteriormente (física ou Gov.br) */}
                      <div className="w-full md:w-80 flex flex-col items-center justify-end text-center pt-2">
                        <div className="w-full min-h-[60px] flex items-center justify-center">
                          {/* Espaço em branco reservado para assinatura manual ou aposição de certificado digital */}
                        </div>
                        <div className="w-full border-b border-slate-700 mb-2"></div>
                        <span className="text-[11px] font-bold text-slate-900 tracking-wide">
                          VITOR LEONARDO CORDEIRO LINHARES
                        </span>
                        <span className="text-[9.5px] font-mono text-slate-600">
                          Engenheiro Mecânico • CREA-PE 182229949-0
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Evidências Fotográficas da Seção */}
              {secao.fotos && secao.fotos.length > 0 && (
                <div className="my-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-[11px] font-bold text-[#0B1E3D] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#1565D8]" />
                    <span>Registro Fotográfico da Seção ({secao.fotos.length})</span>
                  </h4>
                  <div className={`grid gap-3 ${
                    secao.fotos.length === 1 
                      ? 'grid-cols-1 max-w-md mx-auto' 
                      : secao.fotos.length === 2 
                      ? 'grid-cols-2' 
                      : 'grid-cols-2 sm:grid-cols-3'
                  }`}>
                    {secao.fotos.map((foto) => (
                      <div key={foto.id} className="rounded-lg overflow-hidden border border-slate-200 bg-white shadow-2xs flex flex-col">
                        <div className="h-44 sm:h-48 w-full bg-slate-100 flex items-center justify-center p-1.5 overflow-hidden">
                          <img 
                            src={foto.url} 
                            alt={foto.descricao || 'Evidência'} 
                            className="max-h-full max-w-full object-contain"
                            crossOrigin="anonymous"
                          />
                        </div>
                        <p className="p-1.5 text-[10px] text-slate-600 italic leading-tight border-t border-slate-100 bg-white">
                          {foto.descricao || 'Foto pericial registrada'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Checklist Table if present */}
              {secao.itens && secao.itens.length > 0 && (
                <div className="mt-3">
                  <table className="w-full text-left text-[10px] border-collapse border border-slate-300">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
                        <th className="p-1.5 font-bold w-7/12">Item / Requisito Normativo</th>
                        <th className="p-1.5 font-bold w-2/12 text-center">Status</th>
                        <th className="p-1.5 font-bold w-3/12">Observações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {secao.itens.map((item) => (
                        <tr key={item.id}>
                          <td className="p-1.5 text-slate-800 align-top">
                            <span className="font-semibold block">{item.requisito}</span>
                            {item.normaRef && (
                              <span className="text-[9px] text-slate-500 font-mono">Ref: {item.normaRef}</span>
                            )}
                          </td>
                          <td className="p-1.5 text-center align-top">
                            {item.status === 'conforme' && (
                              <span className="px-1.5 py-0.5 rounded font-bold text-[8px] bg-emerald-100 text-emerald-800">
                                CONFORME
                              </span>
                            )}
                            {item.status === 'nao_conforme' && (
                              <span className="px-1.5 py-0.5 rounded font-bold text-[8px] bg-red-100 text-red-800">
                                NÃO CONFORME
                              </span>
                            )}
                            {item.status === 'nao_aplicavel' && (
                              <span className="px-1.5 py-0.5 rounded font-bold text-[8px] bg-slate-100 text-slate-600">
                                NÃO APLICÁVEL
                              </span>
                            )}
                            {item.status === 'pendente' && (
                              <span className="px-1.5 py-0.5 rounded font-bold text-[8px] bg-amber-100 text-amber-800">
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
                </div>
              )}
            </div>

            {/* Standard Footer - Sempre fixado na parte inferior da página */}
            <div className="mt-auto shrink-0 border-t border-slate-300 pt-3 text-[9px] text-slate-500 flex items-center justify-between w-full">
              <span>VL Engenharia Mecânica • CREA-PE 182229949-0</span>
              <span className="font-mono">Página {pageIndex}</span>
            </div>
          </div>
        ),
      });
    });

    // Se nenhuma seção de conclusão existia nas seções, adiciona a página padrão de Conclusão & Assinatura
    if (!secaoConclusao) {
      list.push({
        id: 'conclusao',
        numero: conclusaoPageIndex,
        tipo: 'conclusao',
        titulo: 'Conclusão Técnica & Assinatura',
        subtitulo: 'Parecer Conclusivo & Responsabilidade Técnica',
        render: () => (
          <div className="flex-1 flex flex-col justify-between h-full min-h-full w-full text-slate-900">
            <div className="flex-1 flex flex-col">
              {/* Standard Header */}
              <div className="border-b-2 border-[#0B1E3D] pb-3 mb-4 flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <img src="/logo.png" alt="VL" className="h-9 w-auto object-contain" crossOrigin="anonymous" />
                  <div>
                    <h3 className="text-sm font-black text-[#0B1E3D]">VL ENGENHARIA MECÂNICA</h3>
                    <p className="text-[9px] text-[#1565D8] font-bold uppercase tracking-wider">
                      {laudo.tipo} • Laudo Nº {laudo.numero}
                    </p>
                  </div>
                </div>
                <div className="text-right text-[9px] text-slate-500 font-mono">
                  <p>ART CREA-PE: <strong>{laudo.artNumero || 'Homologada'}</strong></p>
                  <p>Página {conclusaoPageIndex} de {totalEstimado}</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="pb-2 border-b border-slate-200">
                  <span className="text-[10px] font-bold text-[#1565D8] uppercase tracking-wider font-mono">
                    PARECER CONCLUSIVO
                  </span>
                  <h2 className="text-base font-black text-[#0B1E3D]">
                    Conclusão Técnica Pericial & Recomendações
                  </h2>
                </div>

                {/* Parecer Conclusivo */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-[11px] text-slate-800 leading-relaxed">
                  <strong className="text-[#0B1E3D] block text-xs">Parecer Técnico do Perito Responsável:</strong>
                  <p>
                    Com base nas inspeções visuais, verificações dimensionais e análises de conformidade realizadas no equipamento <strong>{laudo.ativoIdentificacao}</strong>, atesta-se que as condições operacionais foram diagnosticadas e confrontadas com as normas técnicas da ABNT e Normas Regulamentadoras vigentes.
                  </p>
                  <p>
                    As não conformidades porventura apontadas no corpo deste laudo demandam cumprimento rigoroso dos planos de ação e cronogramas recomendados pela equipe técnica para garantia da integridade física e segurança operacional dos trabalhadores.
                  </p>
                </div>

                {/* Apreciação HRN se existente */}
                {laudo.hrnCalculoGeral && (
                  <div className="p-3.5 rounded-xl border border-slate-300 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                      <span className="text-xs font-black text-[#0B1E3D] uppercase tracking-wider">
                        Apreciação Quantitativa de Risco (Método HRN)
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-700">
                        Score Global: {laudo.hrnCalculoGeral.score.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span 
                        className="px-2.5 py-1 rounded text-white font-bold text-[10px] uppercase shrink-0"
                        style={{ backgroundColor: laudo.hrnCalculoGeral.cor }}
                      >
                        Risco: {laudo.hrnCalculoGeral.nivel}
                      </span>
                      <p className="text-[11px] text-slate-600 leading-tight">
                        {laudo.hrnCalculoGeral.recomendacao}
                      </p>
                    </div>
                  </div>
                )}

                {/* Bloco Oficial de Assinatura Profissional - Espaço limpo para assinar posteriormente */}
                <div className="pt-3 mt-auto">
                  <div className="p-4 border border-slate-300 rounded-2xl bg-white shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3.5">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#1565D8] shrink-0 bg-slate-100 shadow-sm">
                        <img 
                          src="/vitor-leonardo.png" 
                          alt="Eng. Vitor Leonardo" 
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-[#0B1E3D] leading-tight">
                          VITOR LEONARDO CORDEIRO LINHARES
                        </h4>
                        <p className="text-[11px] font-bold text-[#1565D8] uppercase tracking-wide">
                          Engenheiro Mecânico • Perito Técnico Responsável
                        </p>
                        <p className="text-[10px] font-mono text-slate-600 mt-0.5">
                          Registro Profissional: <strong>CREA-PE 182229949-0</strong>
                        </p>
                        <p className="text-[9.5px] text-slate-500 mt-0.5">
                          ART Vinculada: <strong>{laudo.artNumero || 'Registrada junto ao CREA-PE'}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Linha de Assinatura com espaço limpo para assinar posteriormente */}
                    <div className="w-full md:w-80 flex flex-col items-center justify-end text-center pt-2">
                      <div className="w-full min-h-[60px] flex items-center justify-center">
                        {/* Espaço limpo em branco para assinatura posterior */}
                      </div>
                      <div className="w-full border-b border-slate-700 mb-2"></div>
                      <span className="text-[11px] font-bold text-slate-900 tracking-wide">
                        VITOR LEONARDO CORDEIRO LINHARES
                      </span>
                      <span className="text-[9.5px] font-mono text-slate-600">
                        Engenheiro Mecânico • CREA-PE 182229949-0
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Standard Footer - Sempre fixado na parte inferior da página */}
            <div className="mt-auto shrink-0 border-t border-slate-300 pt-3 text-[9px] text-slate-500 flex items-center justify-between w-full">
              <span>VL Engenharia Mecânica • CREA-PE 182229949-0</span>
              <span className="font-mono">Página {conclusaoPageIndex}</span>
            </div>
          </div>
        ),
      });
    }

    // -------------------------------------------------------------------------
    // ANEXO OFICIAL DA ART CREA-PE
    // Dedicated page for ART attachment (PDF or Image)
    // -------------------------------------------------------------------------
    if (temArtAnexo && artPageIndex > 0) {
      list.push({
        id: 'art',
        numero: artPageIndex,
        tipo: 'art',
        titulo: 'Anexo Oficial da ART CREA-PE',
        subtitulo: 'Anotação de Responsabilidade Técnica Homologada',
        render: () => (
          <div className="flex-1 flex flex-col justify-between h-full min-h-full w-full text-slate-900">
            <div className="flex-1">
              {/* Standard Header */}
              <div className="border-b-2 border-[#0B1E3D] pb-3 mb-4 flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <img src="/logo.png" alt="VL" className="h-9 w-auto object-contain" crossOrigin="anonymous" />
                  <div>
                    <h3 className="text-sm font-black text-[#0B1E3D]">VL ENGENHARIA MECÂNICA</h3>
                    <p className="text-[9px] text-[#1565D8] font-bold uppercase tracking-wider">
                      {laudo.tipo} • Laudo Nº {laudo.numero}
                    </p>
                  </div>
                </div>
                <div className="text-right text-[9px] text-slate-500 font-mono">
                  <p>ART CREA-PE: <strong>{laudo.artNumero || 'Homologada'}</strong></p>
                  <p>Página {artPageIndex} de {totalEstimado}</p>
                </div>
              </div>

              {/* ART Header Banner */}
              <div className="mb-4 pb-2 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider font-mono">
                    ANEXO OBRIGATÓRIO
                  </span>
                  <h2 className="text-base font-black text-[#0B1E3D]">
                    Anotação de Responsabilidade Técnica (ART — CREA-PE)
                  </h2>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ART Registrada CREA-PE
                </span>
              </div>

              {/* ART Content: Exibe a imagem real do documento da ART em tamanho integral na página */}
              {artImagemVisual || (laudo.artTipoArquivo === 'imagem' && laudo.artArquivoUrl) ? (
                <div className="w-full flex-1 flex flex-col items-center justify-center">
                  <div className="w-full h-full flex-1 rounded-xl overflow-hidden border border-slate-300 shadow-xs bg-white flex items-center justify-center p-2 min-h-[640px]">
                    <img 
                      src={artImagemVisual || laudo.artArquivoUrl} 
                      alt="Guia da ART CREA-PE" 
                      className="max-w-full max-h-[720px] object-contain mx-auto rounded shadow-xs"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <p className="text-center text-[9.5px] text-slate-500 italic mt-1.5">
                    Reprodução integral do documento de ART emitido junto ao CREA-PE vinculado a este laudo pericial.
                  </p>
                </div>
              ) : renderizandoPdfArt ? (
                <div className="p-12 rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 text-center space-y-3 my-12">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800">Renderizando Documento Oficial da ART...</h4>
                  <p className="text-xs text-slate-500">Convertendo o arquivo PDF para imagem em alta resolução para compilação no laudo.</p>
                </div>
              ) : laudo.artArquivoUrl ? (
                <div className="w-full flex-1 flex flex-col items-center justify-center">
                  <div className="w-full h-full flex-1 rounded-xl overflow-hidden border border-slate-300 shadow-xs bg-white flex items-center justify-center p-2 min-h-[640px]">
                    <img 
                      src={laudo.artArquivoUrl} 
                      alt="Guia da ART CREA-PE" 
                      className="max-w-full max-h-[720px] object-contain mx-auto rounded shadow-xs"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <p className="text-center text-[9.5px] text-slate-500 italic mt-1.5">
                    Reprodução integral do documento de ART emitido junto ao CREA-PE vinculado a este laudo pericial.
                  </p>
                </div>
              ) : (
                <div className="p-8 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-center space-y-4 my-6">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#1565D8] flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-800">
                      Anotação de Responsabilidade Técnica Vinculada
                    </h3>
                    <p className="text-xs text-slate-500">
                      Nº da ART CREA-PE: <strong className="text-slate-800 font-mono">{laudo.artNumero || 'Em homologação junto ao CREA-PE'}</strong>
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 max-w-md mx-auto text-[11px] text-slate-600 leading-relaxed">
                    Para anexar o comprovante em PDF ou imagem da ART, utilize a área de anexo na tela de edição do laudo.
                  </div>
                </div>
              )}
            </div>

            {/* Standard Footer - Sempre fixado na parte inferior da página */}
            <div className="mt-auto shrink-0 border-t border-slate-300 pt-3 text-[9px] text-slate-500 flex items-center justify-between w-full">
              <span>VL Engenharia Mecânica • CREA-PE 182229949-0</span>
              <span className="font-mono">Página {artPageIndex} (Final)</span>
            </div>
          </div>
        ),
      });
    }

    return list;
  }, [laudo, cliente, ativo, dataFormatada, emitidoEm, secoesVisiveis, artImagemVisual, renderizandoPdfArt]);

  const totalPaginas = paginasLaudo.length;
  const paginaRenderizar = paginasLaudo.find(p => p.numero === paginaAtual) || paginasLaudo[0];

  // =========================================================================
  // EXPORT DISCRETE MULTI-PAGE PDF
  // Iterates each .laudo-pdf-page element without clipping or cutting
  // =========================================================================
  const handleDownloadPdf = async () => {
    setGerandoPdf(true);
    setSucessoDownload(false);

    try {
      const pageElements = printContainerRef.current?.querySelectorAll<HTMLElement>('.laudo-pdf-page');
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

      const nomeArquivo = `Laudo_${laudo.numero.replace(/\//g, '-')}_${(laudo.clienteNome || 'Cliente').replace(/\s+/g, '_')}.pdf`;
      pdf.save(nomeArquivo);
      setSucessoDownload(true);
      setTimeout(() => setSucessoDownload(false), 4000);
    } catch (err) {
      console.error('Erro ao gerar PDF do laudo:', err);
      alert('Ocorreu um erro ao compilar o PDF multi-página. Abrindo impressão nativa do navegador.');
      window.print();
    } finally {
      setGerandoPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
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
                  {totalPaginas} Páginas A4
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {laudo.numero} • {laudo.tipo}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Gerenciar Seções Visíveis no PDF */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuSecoesAberto(!menuSecoesAberto)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                  menuSecoesAberto 
                    ? 'bg-[#1565D8] text-white border-[#1565D8]' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
                title="Decidir quais seções aparecem na versão do PDF"
              >
                <Layers className="w-4 h-4 text-blue-400" />
                <span className="hidden md:inline">Seções do PDF</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-900 text-slate-300">
                  {secoesVisiveis.length}/{laudo.secoes?.length || 0}
                </span>
              </button>

              {menuSecoesAberto && (
                <div className="absolute right-0 top-full mt-2 w-84 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-3 z-50 text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-[#1565D8]" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Seções Incluídas no PDF
                      </span>
                    </div>
                    <button 
                      onClick={() => setMenuSecoesAberto(false)} 
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 leading-tight">
                    Marque ou desmarque para decidir o que vai para o PDF. A contagem de páginas e o sumário ajustam automaticamente.
                  </p>
                  <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
                    {(laudo.secoes || []).map((sec, idx) => {
                      const isVisivel = !secoesOcultadasLocal[sec.id];
                      return (
                        <label 
                          key={sec.id}
                          className={`flex items-start gap-2.5 p-2 rounded-xl border transition-colors cursor-pointer text-xs ${
                            isVisivel 
                              ? 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800' 
                              : 'bg-amber-50/50 dark:bg-amber-950/20 border-dashed border-amber-200 dark:border-amber-900/40 text-slate-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isVisivel}
                            onChange={() => handleToggleSecaoNoModal(sec.id)}
                            className="mt-0.5 rounded text-[#1565D8] focus:ring-[#1565D8]"
                          />
                          <div className="min-w-0 flex-1">
                            <p className={`font-semibold text-xs leading-snug truncate ${!isVisivel ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                              {idx + 1}. {sec.titulo}
                            </p>
                            <span className="text-[10px] text-slate-500">
                              {isVisivel ? 'Incluído no PDF' : 'Oculto do PDF'}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

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
                Sequência Completa
              </button>
            </div>

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
                  <span>Compilando {totalPaginas} Páginas...</span>
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

        {/* Sub-bar: Page Navigator */}
        <div className="px-6 py-2 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
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
                className="ml-2 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 font-semibold max-w-[220px] sm:max-w-none truncate"
              >
                {paginasLaudo.map(p => (
                  <option key={p.id} value={p.numero}>
                    Pág {p.numero}: {p.titulo}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="text-xs text-slate-500 font-semibold">
              Exibindo todas as {totalPaginas} páginas sequenciais no padrão de engenharia diagnóstica CREA-PE.
            </div>
          )}

          <div className="text-slate-400 text-[11px] hidden sm:block">
            Formato A4 • Sem cortes • Imagens & ART em alta resolução
          </div>
        </div>

        {/* Document Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-200 dark:bg-slate-900/90 flex justify-center">
          <div className="w-full max-w-[210mm] space-y-6">
            
            {modoVisualizacao === 'pagina' ? (
              // Single page render with mechanical watermark
              <div 
                className="printable-document bg-white text-slate-900 min-h-[297mm] p-8 sm:p-12 shadow-xl border border-slate-300 flex flex-col justify-between relative overflow-hidden"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                <EngineeringWatermark opacity="opacity-[0.045]" />
                <div className="relative z-10 flex-1 flex flex-col justify-between h-full min-h-full w-full">
                  {paginaRenderizar.render()}
                </div>
              </div>
            ) : (
              // Continuous multi-page view
              paginasLaudo.map((pag) => (
                <div 
                  key={`preview-${pag.id}`}
                  className="printable-document bg-white text-slate-900 min-h-[297mm] p-8 sm:p-12 shadow-xl border border-slate-300 flex flex-col justify-between page-break-after-always relative mb-6 overflow-hidden"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  <EngineeringWatermark opacity="opacity-[0.045]" />
                  <div className="relative z-10 flex-1 flex flex-col justify-between h-full min-h-full w-full">
                    {pag.render()}
                  </div>
                </div>
              ))
            )}

          </div>
        </div>

        {/* ========================================================================= */}
        {/* HIDDEN OFF-SCREEN PRINT CONTAINER FOR ROBUST MULTI-PAGE PDF GENERATION   */}
        {/* ========================================================================= */}
        <div 
          ref={printContainerRef}
          className="fixed left-[-9999px] top-0 pointer-events-none"
          style={{ width: '794px' }}
          aria-hidden="true"
        >
          {paginasLaudo.map((pag) => (
            <div 
              key={`print-laudo-${pag.id}`}
              className="laudo-pdf-page bg-white text-slate-900 min-h-[1123px] h-[1123px] max-h-[1123px] w-[794px] p-10 flex flex-col justify-between relative overflow-hidden"
              style={{ boxSizing: 'border-box' }}
            >
              <EngineeringWatermark opacity="opacity-[0.045]" />
              <div className="relative z-10 flex-1 flex flex-col justify-between h-full min-h-full w-full">
                {pag.render()}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1324] flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Layout oficial VL Engenharia com marca d'água técnica, foto de capa e anexo da ART CREA-PE.
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
              <span>Baixar Arquivo PDF ({totalPaginas} Páginas)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
