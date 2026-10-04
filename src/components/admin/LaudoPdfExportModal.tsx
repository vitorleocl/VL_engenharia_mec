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
        <div className="flex-1 flex flex-col justify-between h-full min-h-0 w-full text-slate-900">
          {/* Top Header */}
          <div className="border-b-2 border-[#0B1E3D] pb-3 flex items-center justify-between shrink-0">
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

          {/* Title Box e Corpo Central */}
          <div className="flex-1 min-h-0 flex flex-col justify-center space-y-3.5 py-2.5 my-auto">
            <div className="text-center space-y-1.5">
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
                    className="w-full h-52 object-cover"
                    crossOrigin="anonymous"
                  />
                  <div className="bg-[#0B1E3D] text-white text-[10px] py-1.5 px-3 font-semibold text-center italic">
                    {laudo.capaFotoLegenda || 'Fotografia técnica do equipamento em avaliação pericial'}
                  </div>
                </div>
              ) : (
                <div className="p-7 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/80 text-center space-y-2">
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
                  <strong className="text-emerald-700 font-mono text-xs">{laudo.artNumero && laudo.artNumero !== 'Vinculada ao Laudo' && laudo.artNumero !== 'Registrada junto ao CREA-PE' ? laudo.artNumero : 'PE20261621255'}</strong>
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

          {/* Footer Capa - Sempre na extremidade inferior da página (no rodapé oficial) */}
          <div className="shrink-0 mt-auto border-t-2 border-[#0B1E3D] pt-3 text-[10.5px] text-slate-600 flex items-center justify-between w-full">
            <div>
              <strong className="text-slate-900 font-bold">ENG. VITOR LEONARDO CORDEIRO LINHARES</strong>
              <span> • CREA-PE 182229949-0</span>
            </div>
            <div className="text-slate-700 font-medium">
              ART CREA-PE: <strong className="text-slate-900 font-mono font-bold">{laudo.artNumero && laudo.artNumero !== 'Vinculada ao Laudo' && laudo.artNumero !== 'Registrada junto ao CREA-PE' ? laudo.artNumero : 'PE20261621255'}</strong>
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

      // 2. Dados do Veículo: Remodela a tabela fielmente conforme o print oficial, sem renavam e com TODAS as informações visíveis
      if (
        t.includes('dados do veículo') || 
        t.includes('dados do veiculo') || 
        sec.id === 'sec-7' ||
        (t.includes('veículo') && t.includes('especifica')) ||
        (t.includes('veiculo') && t.includes('especifica')) ||
        t.includes('dados do ativo')
      ) {
        const proprietario = laudo.clienteNome || 'Ministério Público de Pernambuco (CNPJ: 24.417.065/0001-03)';
        const marca = ativo?.fabricante || 'Renault';
        const modelo = ativo?.modelo || 'Duster Dynamique 1.6 16V Hi-Flex';
        const especie = 'Passageiro / Utilitário';
        const placa = ativo?.placa || 'PGX-9708';
        const chassi = ativo?.chassi || '093YHSRAF500GJ3983670';
        const anoModelo = ativo?.ano ? `${ativo.ano} / ${ativo.ano}` : '2016 / 2016';
        const combustivel = 'Bicombustível (Flex) • Motor 1.6 16V';
        const cor = 'Prata / Oficial';
        const categoria = 'Oficial / Administração Pública';
        const municipio = 'Caruaru / PE';
        const situacao = 'Regular • Em Conformidade';
        const kmAferida = '152.530 km (Constatada na Vistoria Pericial - Agosto de 2026)';
        const kmAnterior = '149.908 km (Registrada na Manutenção Preventiva - Dezembro de 2025)';
        const intervalo = '2.622 km decorridos entre a intervenção prévia no motor e a ocorrência da pane atual';

        // Preserva eventuais parágrafos adicionais ou notas de rodapé da seção que o usuário redigiu
        const textoExtra = html
          .replace(/<table[\s\S]*?<\/table>/gi, '')
          .replace(/<p[^>]*>\s*SEÇÃO III[^<]*<\/p>/gi, '')
          .replace(/<p[^>]*>\s*DADOS DO VEÍCULO[^<]*<\/p>/gi, '')
          .replace(/<div class="border-b-2[\s\S]*?<\/div>/gi, '')
          .trim();

        return `<div class="space-y-3">
  <div class="border-b-2 border-slate-300 pb-1.5 flex items-center justify-between">
    <p class="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider font-mono">SEÇÃO III - DADOS DO VEÍCULO E ESPECIFICAÇÕES TÉCNICAS</p>
    <span class="text-[9.5px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">Veículo Oficial Periciado</span>
  </div>

  <table class="tiptap-table border-collapse border border-slate-300 w-full my-2 text-[11.5px] leading-snug">
    <tbody>
      <tr>
        <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-slate-700 w-1/4">Proprietário / Frotista:</td>
        <td class="border border-slate-300 p-2 text-slate-900 font-semibold" colspan="3">${proprietario}</td>
      </tr>
      <tr>
        <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-slate-700 w-1/4">Marca / Fabricante:</td>
        <td class="border border-slate-300 p-2 text-slate-900 w-1/4 font-semibold">${marca}</td>
        <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-slate-700 w-1/4">Modelo / Versão:</td>
        <td class="border border-slate-300 p-2 text-slate-900 w-1/4 font-semibold">${modelo}</td>
      </tr>
      <tr>
        <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-slate-700">Espécie / Tipo:</td>
        <td class="border border-slate-300 p-2 text-slate-900">${especie}</td>
        <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-slate-700">Placa de Identificação:</td>
        <td class="border border-slate-300 p-2 text-slate-900 font-bold font-mono text-xs text-[#0B1E3D]">${placa}</td>
      </tr>
      <tr>
        <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-slate-700">Número do Chassi (VIN):</td>
        <td class="border border-slate-300 p-2 text-slate-900 font-mono font-medium tracking-wider" colspan="3">${chassi}</td>
      </tr>
      <tr>
        <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-slate-700">Ano Fab. / Modelo:</td>
        <td class="border border-slate-300 p-2 text-slate-900 font-semibold">${anoModelo}</td>
        <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-slate-700">Combustível / Motorização:</td>
        <td class="border border-slate-300 p-2 text-slate-900 font-medium">${combustivel}</td>
      </tr>
      <tr>
        <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-slate-700">Cor Predominante:</td>
        <td class="border border-slate-300 p-2 text-slate-900">${cor}</td>
        <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-slate-700">Categoria / Uso:</td>
        <td class="border border-slate-300 p-2 text-slate-900">${categoria}</td>
      </tr>
      <tr>
        <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-slate-700">Município / UF:</td>
        <td class="border border-slate-300 p-2 text-slate-900">${municipio}</td>
        <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-slate-700">Situação Cadastral:</td>
        <td class="border border-slate-300 p-2 text-slate-900 text-emerald-800 font-semibold">${situacao}</td>
      </tr>
      <tr>
        <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-slate-700">Quilometragem Aferida:</td>
        <td class="border border-slate-300 p-2 text-slate-900 font-bold" colspan="3">${kmAferida}</td>
      </tr>
      <tr>
        <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-slate-700">Quilometragem Anterior:</td>
        <td class="border border-slate-300 p-2 text-slate-900 font-semibold" colspan="3">${kmAnterior}</td>
      </tr>
      <tr>
        <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-slate-700">Intervalo Percorrido:</td>
        <td class="border border-slate-300 p-2 text-slate-900 font-bold text-[#1565D8]" colspan="3">${intervalo}</td>
      </tr>
    </tbody>
  </table>
  ${textoExtra ? `<div class="mt-2 text-slate-700 text-[13px] leading-relaxed space-y-1">${textoExtra}</div>` : ''}
</div>`;
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

    // Helpers para identificar seções que demandam quebra de página (multi-página dinâmica)
    const isSecaoCausaRaiz = (s: LaudoSecao) => {
      const t = s.titulo.toLowerCase();
      return (
        (t.includes('constata') && t.includes('danos')) || 
        (t.includes('causa') && t.includes('raiz') && !t.includes('tabela')) ||
        s.id === 'sec-10'
      );
    };

    const isSecaoFotosPrincipais = (s: LaudoSecao) => {
      const t = s.titulo.toLowerCase();
      return (t.includes('registro') && t.includes('fotogr')) || s.id === 'sec-8';
    };

    const getNumeroPaginasSecao = (s: LaudoSecao): number => {
      if (isSecaoCausaRaiz(s)) return 2;
      if (isSecaoFotosPrincipais(s)) return 2;
      return 1;
    };

    // Mapeamento dinâmico de páginas (Capa é pág 1, seções técnicas iniciam na pág 2)
    let runningPageNum = 2;
    const pageMap: Record<string, number> = {};

    secoesFiltradas.forEach(s => {
      pageMap[s.id] = runningPageNum;
      runningPageNum += getNumeroPaginasSecao(s);
    });

    const conclusaoPageIndex = secaoConclusao ? pageMap[secaoConclusao.id] : runningPageNum++;
    const temArtAnexo = Boolean(artImagemVisual || (laudo.artTipoArquivo === 'imagem' && laudo.artArquivoUrl) || laudo.artArquivoUrl);
    const artPageIndex = temArtAnexo ? runningPageNum++ : 0;
    const totalEstimado = runningPageNum - 1;

    // Itens dinâmicos para o Sumário Executivo com numeração exata de cada página
    const itensSumario: { numero: number; titulo: string; paginaTexto: string }[] = [];
    let itemCounter = 1;

    secoesFiltradas.forEach(s => {
      const isConclusao = s.id === secaoConclusao?.id;
      const numPags = getNumeroPaginasSecao(s);
      const startP = pageMap[s.id] || 0;
      const pagTexto = numPags > 1 
        ? `Págs. ${String(startP).padStart(2, '0')}-${String(startP + numPags - 1).padStart(2, '0')}`
        : `Pág. ${String(startP).padStart(2, '0')}`;

      itensSumario.push({
        numero: itemCounter++,
        titulo: isConclusao ? 'Conclusão Técnica Pericial & Assinatura' : s.titulo,
        paginaTexto: pagTexto,
      });
    });

    if (!secaoConclusao) {
      itensSumario.push({
        numero: itemCounter++,
        titulo: 'Conclusão Técnica & Assinatura',
        paginaTexto: `Pág. ${String(conclusaoPageIndex).padStart(2, '0')}`,
      });
    }

    if (temArtAnexo) {
      itensSumario.push({
        numero: itemCounter++,
        titulo: 'Anexo Oficial da ART CREA-PE',
        paginaTexto: `Pág. ${String(artPageIndex).padStart(2, '0')}`,
      });
    }

    // Geração das páginas das seções técnicas (com quebras dinâmicas)
    secoesFiltradas.forEach((secao, idx) => {
      const startPage = pageMap[secao.id];
      const tLower = secao.titulo.toLowerCase();
      const isSumario = tLower.includes('sumário') || tLower.includes('sumario');
      const isConclusao = secao.id === secaoConclusao?.id;

      // =======================================================================
      // CASO 1: SEÇÃO DE REGISTROS FOTOGRÁFICOS PRINCIPAIS (DIVIDIDA EM 2 PÁGINAS COM IMAGENS AMPLIADAS)
      // =======================================================================
      if (isSecaoFotosPrincipais(secao)) {
        // PÁGINA 1 DE FOTOS: Cabeçote Desmontado e Correia Dentada Rompida (Grandes & Nitidas)
        list.push({
          id: `secao-${secao.id}-p1`,
          numero: startPage,
          tipo: 'secao',
          titulo: secao.titulo,
          subtitulo: 'Parte 1: Evidências Macroscópicas do Conjunto Propulsor',
          render: () => (
            <div className="flex-1 flex flex-col justify-between h-full min-h-0 w-full text-slate-900">
              <div className="flex-1 flex flex-col">
                {/* Standard Header */}
                <div className="border-b-2 border-[#0B1E3D] pb-3 mb-3 flex items-start justify-between">
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
                    <p>Página {startPage} de {totalEstimado}</p>
                  </div>
                </div>

                {/* Section Header */}
                <div className="mb-3 pb-2 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#1565D8] uppercase tracking-wider font-mono">
                      ITEM {idx + 1}
                    </span>
                    <h2 className="text-base font-black text-[#0B1E3D]">
                      {secao.titulo}
                    </h2>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[9.5px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Parte 1 de 2 • Evidências do Motor
                  </span>
                </div>

                {/* Fotos 1 e 2 Ampliadas em Alta Resolução */}
                <div className="space-y-3.5 my-auto">
                  {/* Figura 1: Cabeçote Desmontado */}
                  <div className="p-3 border border-slate-300 rounded-xl bg-slate-50/80 shadow-2xs">
                    <div className="h-44 sm:h-48 w-full bg-slate-900 rounded-lg flex flex-col items-center justify-center p-3 text-center border border-slate-700 overflow-hidden relative">
                      <div className="w-12 h-12 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center mb-1.5 border border-blue-500/40">
                        <Camera className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono font-bold text-white tracking-wide">
                        [FIGURA 01 — CABEÇOTE DO MOTOR DESMONTADO EM BANCADA PERICIAL]
                      </span>
                      <p className="text-[10px] text-slate-300 mt-1 max-w-md">
                        Inspeção visual direta evidenciando choque mecânico e avarias severas nas sedes e guias de válvulas.
                      </p>
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 text-slate-300 text-[9px] font-mono border border-white/10">
                        Inspeção In Loco
                      </div>
                    </div>
                    <div className="mt-2 text-slate-800">
                      <h4 className="text-[11.5px] font-black text-[#0B1E3D] uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-600"></span>
                        Figura 01 — Vista Superior do Cabeçote do Motor Renault Duster (Hi-Flex 1.6 16V)
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5 text-justify">
                        Vista do conjunto do cabeçote desmontado em bancada nas dependências da ADF Caruaru. O exame pericial atesta a ocorrência de interferência mecânica direta ("atropelamento de válvulas") provocada pela perda instantânea do sincronismo com o virabrequim, gerando empenamento de hastes e danos nas sedes que inviabilizam o funcionamento do propulsor.
                      </p>
                    </div>
                  </div>

                  {/* Figura 2: Correia Dentada Rompida */}
                  <div className="p-3 border border-slate-300 rounded-xl bg-slate-50/80 shadow-2xs">
                    <div className="h-44 sm:h-48 w-full bg-slate-900 rounded-lg flex flex-col items-center justify-center p-3 text-center border border-slate-700 overflow-hidden relative">
                      <div className="w-12 h-12 rounded-full bg-amber-600/30 text-amber-400 flex items-center justify-center mb-1.5 border border-amber-500/40">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono font-bold text-white tracking-wide">
                        [FIGURA 02 — DETALHE MACROSCÓPICO DA CORREIA DENTADA ROMPIDA]
                      </span>
                      <p className="text-[10px] text-slate-300 mt-1 max-w-md">
                        Evidência da descontinuidade estrutural e desfibramento total dos cordonéis de tração por fadiga mecânica cíclica.
                      </p>
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono border border-amber-500/30">
                        Causa Raiz Primária
                      </div>
                    </div>
                    <div className="mt-2 text-slate-800">
                      <h4 className="text-[11.5px] font-black text-[#0B1E3D] uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                        Figura 02 — Macrofotografia da Correia de Sincronismo Danificada
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5 text-justify">
                        Registro macroscópico da zona de ruptura da correia dentada, demonstrando estilhaçamento por fadiga mecânica e perda de resistência tênsil do composto polimérico elastomérico. O exame constata a ausência de marcas de fricção lateral com guias ou travamento do tensionador, confirmando o esgotamento da vida útil do componente após o transcurso da garantia legal.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Standard Footer */}
              <div className="mt-auto shrink-0 border-t border-slate-300 pt-3 text-[9px] text-slate-500 flex items-center justify-between w-full">
                <span>VL Engenharia Mecânica • CREA-PE 182229949-0</span>
                <span className="font-mono">Página {startPage}</span>
              </div>
            </div>
          ),
        });

        // PÁGINA 2 DE FOTOS: Odômetro Ampliado e Confronto Instrumental Oficial
        list.push({
          id: `secao-${secao.id}-p2`,
          numero: startPage + 1,
          tipo: 'secao',
          titulo: `${secao.titulo} (Continuação)`,
          subtitulo: 'Parte 2: Rastreabilidade Instrumental e Odômetro',
          render: () => (
            <div className="flex-1 flex flex-col justify-between h-full min-h-0 w-full text-slate-900">
              <div className="flex-1 flex flex-col">
                {/* Standard Header */}
                <div className="border-b-2 border-[#0B1E3D] pb-3 mb-3 flex items-start justify-between">
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
                    <p>Página {startPage + 1} de {totalEstimado}</p>
                  </div>
                </div>

                {/* Section Header */}
                <div className="mb-3 pb-2 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#1565D8] uppercase tracking-wider font-mono">
                      ITEM {idx + 1} (CONTINUAÇÃO)
                    </span>
                    <h2 className="text-base font-black text-[#0B1E3D]">
                      {secao.titulo}
                    </h2>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[9.5px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Parte 2 de 2 • Rastreabilidade Instrumental
                  </span>
                </div>

                {/* Figura 3 Ampliada: Odômetro do Veículo e Quadro de Aferição */}
                <div className="space-y-3.5 my-auto">
                  <div className="p-3.5 border border-slate-300 rounded-xl bg-slate-50/80 shadow-2xs">
                    <div className="h-52 sm:h-56 w-full bg-slate-900 rounded-lg flex flex-col items-center justify-center p-4 text-center border border-slate-700 overflow-hidden relative">
                      <div className="w-14 h-14 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center mb-2 border border-emerald-500/40">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <span className="text-sm font-mono font-black text-emerald-400 tracking-wider">
                        [ODÔMETRO AFERIDO: 152.530 km]
                      </span>
                      <p className="text-xs text-slate-300 mt-1 max-w-md">
                        Painel de instrumentos do Renault Duster PGX-9708 registrado na entrada da oficina pericial.
                      </p>
                      <div className="absolute top-2 right-2 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                        Comprovação Material
                      </div>
                    </div>
                    <div className="mt-2 text-slate-800">
                      <h4 className="text-[12px] font-black text-[#0B1E3D] uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        Figura 03 — Painel de Instrumentos e Odômetro Digital do Veículo Oficial
                      </h4>
                      <p className="text-[11.5px] text-slate-600 leading-relaxed mt-0.5 text-justify">
                        Registro visual direto do odômetro do veículo no momento da vistoria pericial realizada em agosto de 2026, comprovando fidedignamente a marcação de 152.530 km. Este dado material confronta-se com a quilometragem de 149.908 km anotada na manutenção preventiva de dezembro de 2025, certificando o percurso exíguo de apenas 2.622 km entre as intervenções.
                      </p>
                    </div>
                  </div>

                  {/* Quadro Analítico Instrumental e Confronto Temporal */}
                  <div className="p-3.5 rounded-xl border border-slate-300 bg-white space-y-2">
                    <h4 className="text-xs font-black text-[#0B1E3D] uppercase tracking-wider font-mono border-b border-slate-200 pb-1.5">
                      Quadro Pericial de Confronto Métrico & Temporal (CDC Art. 26)
                    </h4>
                    <table className="w-full text-[11.5px] border-collapse border border-slate-300">
                      <tbody>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 font-bold text-slate-700 bg-slate-50 w-1/2 border-r border-slate-200">Quilometragem na Manutenção Prévia (Dez/2025):</td>
                          <td className="p-2 text-slate-900 font-mono font-semibold">149.908 km</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 font-bold text-slate-700 bg-slate-50 border-r border-slate-200">Quilometragem Constatada na Pane (Ago/2026):</td>
                          <td className="p-2 text-slate-900 font-mono font-bold text-emerald-800">152.530 km</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 font-bold text-slate-700 bg-slate-50 border-r border-slate-200">Delta Quilométrico Percorrido:</td>
                          <td className="p-2 text-[#1565D8] font-mono font-black">2.622 km (Uso Operacional Reduzido)</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 font-bold text-slate-700 bg-slate-50 border-r border-slate-200">Transcurso Temporal Efetivo:</td>
                          <td className="p-2 text-slate-900 font-semibold">&gt; 8 Meses decorridos (aprox. 245 dias)</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold text-slate-700 bg-slate-50 border-r border-slate-200">Enquadramento Legal da Garantia (CDC):</td>
                          <td className="p-2 text-amber-800 font-bold bg-amber-50/50">Prazo legal de 90 dias esgotado temporalmente</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Fotos Adicionais do Perito se existentes */}
                  {secao.fotos && secao.fotos.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold text-[#0B1E3D] uppercase tracking-wider block mb-2">
                        Evidências Anexadas Complementares ({secao.fotos.length})
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {secao.fotos.slice(0, 2).map((foto) => (
                          <div key={foto.id} className="rounded-lg overflow-hidden border border-slate-200 bg-white">
                            <img src={foto.url} alt="Foto complementar" className="h-28 w-full object-cover" crossOrigin="anonymous" />
                            <p className="p-1 text-[9.5px] text-slate-600 italic truncate">{foto.descricao || 'Registro pericial'}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Standard Footer */}
              <div className="mt-auto shrink-0 border-t border-slate-300 pt-3 text-[9px] text-slate-500 flex items-center justify-between w-full">
                <span>VL Engenharia Mecânica • CREA-PE 182229949-0</span>
                <span className="font-mono">Página {startPage + 1}</span>
              </div>
            </div>
          ),
        });
        return;
      }

      // =======================================================================
      // CASO 2: SEÇÃO DE CONSTATAÇÃO DE DANOS E ANÁLISE DE CAUSA RAIZ (DIVIDIDA EM 2 PÁGINAS COM TEXTO TAMANHO 10PT)
      // =======================================================================
      if (isSecaoCausaRaiz(secao)) {
        // PÁGINA 1: Dinâmica da Pane Mecânica & Diagnóstico dos Componentes
        list.push({
          id: `secao-${secao.id}-p1`,
          numero: startPage,
          tipo: 'secao',
          titulo: secao.titulo,
          subtitulo: 'Parte 1: Dinâmica da Pane & Diagnóstico Pericial',
          render: () => (
            <div className="flex-1 flex flex-col justify-between h-full min-h-0 w-full text-slate-900">
              <div className="flex-1 flex flex-col">
                {/* Standard Header */}
                <div className="border-b-2 border-[#0B1E3D] pb-3 mb-3 flex items-start justify-between">
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
                    <p>Página {startPage} de {totalEstimado}</p>
                  </div>
                </div>

                {/* Section Header */}
                <div className="mb-3 pb-2 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#1565D8] uppercase tracking-wider font-mono">
                      ITEM {idx + 1}
                    </span>
                    <h2 className="text-base font-black text-[#0B1E3D]">
                      {secao.titulo}
                    </h2>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[9.5px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Parte 1 de 2 • Mecânica da Falha
                  </span>
                </div>

                {/* Conteúdo Técnico com Texto Tamanho 10pt (13.5px) Confortável e Legível */}
                <div className="space-y-3.5 my-auto text-[13.5px] leading-relaxed text-slate-800 text-justify">
                  <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1.5">
                    <h4 className="text-xs font-black text-[#0B1E3D] uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#1565D8]"></span>
                      1. Dinâmica da Falha Mecânica no Conjunto Propulsor
                    </h4>
                    <p>
                      A inspeção técnica pautada nas evidências físicas comprova que a pane mecânica do veículo oficial foi deflagrada pela <strong>ruptura total da correia dentada do sistema de distribuição</strong>. O rompimento abrupto do componente causou a perda imediata da sincronização cinemática entre o eixo virabrequim e o comando de válvulas no cabeçote.
                    </p>
                    <p>
                      Em razão desse dessincronismo, as válvulas de admissão e escape permaneceram em posição aberta durante o movimento ascendente dos êmbolos, gerando o severo choque de interferência física contra a coroa dos pistões (fenômeno conhecido pericialmente como <em>"atropelamento de válvulas"</em>). Tal colisão provocou o empenamento generalizado das válvulas, avarias nas sedes e guias do cabeçote, tornando mandatória a execução de novos serviços especializados de retífica e substituição dos componentes móveis internos.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-300 bg-white space-y-1.5 shadow-2xs">
                    <h4 className="text-xs font-black text-[#0B1E3D] uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                      2. Exame Macroscópico da Correia e Fadiga por Tração Cíclica
                    </h4>
                    <p>
                      Adicionalmente, a análise pericial macroscópica conduzida nas extremidades da correia dentada rompida revelou o aspecto morfológico típico de <strong>fadiga mecânica progressiva com estilhaçamento por tração cíclica em ponto de torção</strong>. As fibras de cordonéis internos apresentaram desfibramento uniforme com estiramento desordenado, sem evidências de marcas de atrito lateral crônico causadas por desalinhamento de polias ou travamento do tensionador.
                    </p>
                    <p>
                      A ausência de estrias longitudinais de fricção lateral corrobora que as polias e o rolamento tensor operavam em alinhamento geométrico satisfatório, apontando para a falha primária da própria correia decorrente da combinação entre regime de tensão operacional e degradação elastomérica.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                    <h4 className="text-xs font-black text-[#0B1E3D] uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                      3. Comportamento e Vida Útil dos Polímeros Elastoméricos
                    </h4>
                    <p>
                      Cumpre registrar que, embora a intervenção preventiva realizada em dezembro de 2025 tenha sido ampla — abrangendo retífica de cabeçote, troca de junta, bomba d'água, correia dentada, tensor e filtros —, a durabilidade de artefatos elastoméricos é governada por ciclos térmicos contínuos e intempéries climáticas. Tais fatores promovem o envelhecimento e a perda de elasticidade do polímero ao longo do tempo, independentemente de o veículo percorrer baixa quilometragem, sendo disciplinados legalmente pelo prazo decadencial da garantia.
                    </p>
                  </div>
                </div>
              </div>

              {/* Standard Footer */}
              <div className="mt-auto shrink-0 border-t border-slate-300 pt-3 text-[9px] text-slate-500 flex items-center justify-between w-full">
                <span>VL Engenharia Mecânica • CREA-PE 182229949-0</span>
                <span className="font-mono">Página {startPage}</span>
              </div>
            </div>
          ),
        });

        // PÁGINA 2: Análise Temporal de Garantia (CDC Art. 26) & Nexo Causal
        list.push({
          id: `secao-${secao.id}-p2`,
          numero: startPage + 1,
          tipo: 'secao',
          titulo: `${secao.titulo} (Continuação)`,
          subtitulo: 'Parte 2: Análise Temporal de Garantia (CDC) & Nexo Causal',
          render: () => (
            <div className="flex-1 flex flex-col justify-between h-full min-h-0 w-full text-slate-900">
              <div className="flex-1 flex flex-col">
                {/* Standard Header */}
                <div className="border-b-2 border-[#0B1E3D] pb-3 mb-3 flex items-start justify-between">
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
                    <p>Página {startPage + 1} de {totalEstimado}</p>
                  </div>
                </div>

                {/* Section Header */}
                <div className="mb-3 pb-2 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#1565D8] uppercase tracking-wider font-mono">
                      ITEM {idx + 1} (CONTINUAÇÃO)
                    </span>
                    <h2 className="text-base font-black text-[#0B1E3D]">
                      {secao.titulo}
                    </h2>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[9.5px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                    Parte 2 de 2 • Análise Jurídico-Normativa & Nexo Causal
                  </span>
                </div>

                {/* Conteúdo da Continuação com Texto 10pt (13.5px) */}
                <div className="space-y-3.5 my-auto text-[13.5px] leading-relaxed text-slate-800 text-justify">
                  {/* Destaque Amarelo Oficial da Análise Temporal e Garantia CDC */}
                  <div className="p-4 bg-amber-50/90 border-2 border-amber-400 rounded-xl space-y-2 shadow-2xs">
                    <div className="flex items-center gap-2 border-b border-amber-300/80 pb-1.5">
                      <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                      <h4 className="font-black text-amber-950 text-xs sm:text-sm uppercase tracking-wider font-mono">
                        Análise Temporal e Jurídica de Garantia (CDC Art. 26, Inciso II)
                      </h4>
                    </div>
                    <p className="text-amber-950 font-medium">
                      Sob a ótica da análise temporal e do arcabouço normativo do <strong>Código de Defesa do Consumidor (Lei n.º 8.078/1990)</strong>, constata-se documentalmente que a intervenção prévia no motor foi finalizada em <strong>dezembro de 2025</strong>, enquanto a manifestação da quebra ocorreu em <strong>agosto de 2026</strong>.
                    </p>
                    <p className="text-amber-950">
                      Destaca-se enfaticamente que, a despeito de o veículo ter percorrido uma quilometragem bastante exígua no intervalo (<strong>apenas 2.622 km</strong>), o decurso temporal superior a <strong>8 (oito) meses</strong> excede largamente o prazo legal e decadencial de <strong>90 (noventa) dias</strong> estipulado no art. 26, inciso II do CDC para reclamação de vícios em serviços e produtos duráveis.
                    </p>
                    <div className="p-2.5 bg-amber-100/80 rounded-lg text-[12.5px] font-bold text-amber-900 border border-amber-300">
                      Conclusão Temporal: O evento danoso encontra-se juridicamente e temporalmente fora do prazo de garantia legal da manutenção anterior realizada pela oficina terceirizada.
                    </div>
                  </div>

                  {/* Nexo Causal e Ausência de Mau Uso */}
                  <div className="p-3.5 rounded-xl border border-slate-300 bg-white space-y-1.5 shadow-2xs">
                    <h4 className="text-xs font-black text-[#0B1E3D] uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      4. Apuração de Nexo Causal e Isenção de Mau Uso pelo Condutor
                    </h4>
                    <p>
                      O exame técnico pericial dos pistões, velas e componentes do bloco descarta peremptoriamente quaisquer indícios materiais de negligência operacional, sobregiro mecânico intencional, calço hidráulico por submersão ou operação contínua sem fluido lubrificante ou arrefecimento por parte do motorista oficial do Ministério Público de Pernambuco.
                    </p>
                    <p>
                      Trata-se categoricamente de um evento fortuito decorrente da descontinuidade mecânica da correia de sincronismo sob regime rotineiro de operação, deflagrado após a expiração formal da janela temporal de responsabilidade civil da oficina fornecedora anterior.
                    </p>
                  </div>

                  {/* Síntese Pericial de Fechamento da Seção */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-[12.5px] text-slate-700 leading-normal">
                    <strong className="text-[#0B1E3D] block text-xs font-mono uppercase mb-1">
                      Síntese da Investigação Causal:
                    </strong>
                    Causa Raiz Primária: Ruptura da correia dentada por fadiga mecânica • Danos Consequentes: Atropelamento e empenamento de válvulas no cabeçote • Enquadramento: Fora de garantia temporal • Ação Recomendada: Execução de nova retífica completa com substituição do kit de sincronismo e tensor homologados.
                  </div>
                </div>
              </div>

              {/* Standard Footer */}
              <div className="mt-auto shrink-0 border-t border-slate-300 pt-3 text-[9px] text-slate-500 flex items-center justify-between w-full">
                <span>VL Engenharia Mecânica • CREA-PE 182229949-0</span>
                <span className="font-mono">Página {startPage + 1}</span>
              </div>
            </div>
          ),
        });
        return;
      }

      // =======================================================================
      // CASO 3: SEÇÕES PADRÃO (SUMÁRIO, APRESENTAÇÃO, DADOS DO VEÍCULO, TABELA, CONCLUSÃO)
      // =======================================================================
      list.push({
        id: `secao-${secao.id}`,
        numero: startPage,
        tipo: isConclusao ? 'conclusao' : isSumario ? 'sumario' : 'secao',
        titulo: secao.titulo,
        subtitulo: isConclusao ? 'Parecer Conclusivo & Assinatura' : `Seção Técnica ${idx + 1}`,
        render: () => (
          <div className="flex-1 flex flex-col justify-between h-full min-h-0 w-full text-slate-900">
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
                  <p>Página {startPage} de {totalEstimado}</p>
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
                          <span className="font-semibold text-slate-800 truncate text-[12.5px]">
                            {item.titulo}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          <div className="w-12 sm:w-24 border-b border-dotted border-slate-300"></div>
                          <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-mono text-[11px] font-bold border border-slate-200">
                            {item.paginaTexto}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Diretrizes Normativas e Metodologia */}
                  <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/50 text-[11.5px] text-slate-700 space-y-1">
                    <strong className="text-[#0B1E3D] block text-xs">Observações da Estrutura Pericial:</strong>
                    <p className="leading-relaxed">
                      A numeração de páginas segue rigorosamente a ordem sequencial das diligências, constatações materiais e fundamentação normativa do laudo, assegurando conformidade com as diretrizes do CONFEA/CREA e do Código de Defesa do Consumidor.
                    </p>
                  </div>
                </div>
              ) : (
                /* Rich Text HTML Content com sanitização e texto tamanho 10pt (13.5px) */
                secao.conteudoHtml && (
                  <div 
                    className="prose prose-sm max-w-none text-slate-800 text-[13.5px] leading-relaxed mb-3"
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
                      className="prose prose-sm max-w-none text-slate-700 text-[12.5px] leading-relaxed mb-3 border-t border-slate-200 pt-2"
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
              {secao.fotos && secao.fotos.length > 0 && !isSecaoFotosPrincipais(secao) && (
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
                  <table className="w-full text-left text-[11px] border-collapse border border-slate-300">
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
              <span className="font-mono">Página {startPage}</span>
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
                className="printable-document bg-white text-slate-900 p-8 sm:p-10 shadow-xl border border-slate-300 flex flex-col justify-between relative overflow-hidden mx-auto"
                style={{ 
                  width: '210mm',
                  height: '297mm',
                  minHeight: '297mm',
                  maxHeight: '297mm',
                  boxSizing: 'border-box',
                  fontFamily: 'system-ui, -apple-system, sans-serif' 
                }}
              >
                <EngineeringWatermark opacity="opacity-[0.045]" />
                <div className="relative z-10 flex-1 flex flex-col justify-between h-full min-h-0 w-full">
                  {paginaRenderizar.render()}
                </div>
              </div>
            ) : (
              // Continuous multi-page view
              paginasLaudo.map((pag) => (
                <div 
                  key={`preview-${pag.id}`}
                  className="printable-document bg-white text-slate-900 p-8 sm:p-10 shadow-xl border border-slate-300 flex flex-col justify-between page-break-after-always relative mb-6 overflow-hidden mx-auto"
                  style={{ 
                    width: '210mm',
                    height: '297mm',
                    minHeight: '297mm',
                    maxHeight: '297mm',
                    boxSizing: 'border-box',
                    fontFamily: 'system-ui, -apple-system, sans-serif' 
                  }}
                >
                  <EngineeringWatermark opacity="opacity-[0.045]" />
                  <div className="relative z-10 flex-1 flex flex-col justify-between h-full min-h-0 w-full">
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
              <div className="relative z-10 flex-1 flex flex-col justify-between h-full min-h-0 w-full">
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
