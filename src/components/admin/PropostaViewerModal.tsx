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
  Check,
  Trash2,
  AlertTriangle,
  FileText,
  ExternalLink
} from 'lucide-react';
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
  gerarHtmlContatoAgradecimento,
  DADOS_VL_PADRAO,
  calcularValidadeAte
} from '../../lib/orcamentoTemplatePadrao';
import { gerarPixCopiaECola, validarPixCrc } from '../../lib/pixEmv';

interface PropostaViewerModalProps {
  orcamento: Orcamento;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (id: string, novoStatus: Orcamento['status']) => void;
  onGerarLaudo?: (orc: Orcamento) => void;
  onEditarProposta?: (orc: Orcamento) => void;
}

export const VlLogoVector: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ 
  className = "h-9 w-auto", 
  style = { width: '175px', height: '34px' } 
}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="529" 
    height="100" 
    viewBox="0 0 529 100" 
    role="img" 
    aria-label="VL Engenharia"
    className={className}
    style={style}
  >
    <g transform="translate(6 0)">
      <defs>
        <linearGradient id="vl_pv_g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B7C3D2"/>
          <stop offset="1" stopColor="#6F86A3"/>
        </linearGradient>
      </defs>
      <path d="M72.1 21.6A36 36 0 1 0 72.1 78.3" fill="none" stroke="url(#vl_pv_g)" strokeWidth="5" strokeLinecap="round"/>
      <path d="M34.6 11.9A41 41 0 0 0 35.9 88.5" fill="none" stroke="url(#vl_pv_g)" strokeWidth="9" pathLength="100" strokeDasharray="6.4 5.4"/>
      <path d="M72.5 11.0A45 45 0 0 0 42.1 5.6" fill="none" stroke="#0B2447" strokeWidth="2.6" strokeLinecap="round"/>
      <path d="M20 30H35L44 54L55 30H70L51 72H37Z" fill="#0B2447"/>
      <path d="M76 30H90L76.4 60H97L92 72H57Z" fill="#1E5BD8"/>
    </g>
    <path d="M118 8V92" stroke="#0B2447" strokeWidth="1" opacity=".5"/>
    <path d="M184.4 23.8 167.0 73.0H152.0L134.6 23.8H147.3L159.5 60.9L171.8 23.8ZM200.4 63.7H216.0V73.0H188.4V23.8H200.4Z" fill="#0B2447"/>
    <path d="M236.2 49.2V55.2H245.8V60.7H236.2V67.2H247.1V73.0H229.0V43.5H247.1V49.2ZM280.1 73.0H273.0L260.9 54.8V73.0H253.8V43.5H260.9L273.0 61.7V43.5H280.1ZM306.9 52.8Q306.1 51.3 304.6 50.5Q303.1 49.8 301.1 49.8Q297.6 49.8 295.5 52.1Q293.4 54.3 293.4 58.2Q293.4 62.2 295.6 64.5Q297.9 66.8 301.7 66.8Q304.4 66.8 306.2 65.5Q308.0 64.1 308.9 61.6H299.7V56.3H315.4V63.0Q314.6 65.7 312.7 68.0Q310.7 70.3 307.8 71.7Q304.9 73.2 301.2 73.2Q296.8 73.2 293.4 71.2Q290.0 69.3 288.0 65.9Q286.1 62.5 286.1 58.2Q286.1 53.8 288.0 50.4Q290.0 47.0 293.4 45.0Q296.8 43.1 301.1 43.1Q306.4 43.1 310.1 45.7Q313.7 48.3 314.9 52.8ZM328.5 49.2V55.2H338.2V60.7H328.5V67.2H339.4V73.0H321.4V43.5H339.4V49.2ZM372.5 73.0H365.3L353.3 54.8V73.0H346.1V43.5H353.3L365.3 61.7V43.5H372.5ZM405.2 43.5V73.0H398.0V60.8H386.8V73.0H379.7V43.5H386.8V55.0H398.0V43.5ZM430.7 67.7H419.7L417.9 73.0H410.4L421.1 43.5H429.4L440.1 73.0H432.5ZM428.9 62.2 425.2 51.4 421.6 62.2ZM460.4 73.0 454.2 61.8H452.5V73.0H445.3V43.5H457.4Q460.9 43.5 463.3 44.7Q465.8 45.9 467.0 48.0Q468.2 50.1 468.2 52.7Q468.2 55.7 466.5 58.0Q464.9 60.3 461.7 61.3L468.5 73.0ZM452.5 56.7H457.0Q458.9 56.7 459.9 55.8Q460.9 54.8 460.9 53.0Q460.9 51.4 459.9 50.4Q458.9 49.4 457.0 49.4H452.5ZM481.9 43.5V73.0H474.7V43.5ZM507.4 67.7H496.4L494.7 73.0H487.2L497.8 43.5H506.1L516.8 73.0H509.2ZM505.6 62.2 501.9 51.4 498.3 62.2Z" fill="#1E5BD8"/>
  </svg>
);

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
  const { atualizarOrcamento, removerOrcamento, clientes } = useData();
  const documentRef = useRef<HTMLDivElement>(null);
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const [modoVisualizacao, setModoVisualizacao] = useState<'pagina' | 'continua'>('pagina');
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [painelSelecaoAberto, setPainelSelecaoAberto] = useState(false);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [modoExportacao, setModoExportacao] = useState<'completa' | 'executiva'>(orcamento.modoExportacaoPdf || 'completa');
  const [modalValidacaoAberto, setModalValidacaoAberto] = useState(false);
  const [pendenciasValidacao, setPendenciasValidacao] = useState<{ tipo: 'erro' | 'aviso'; mensagem: string; detalhe?: string }[]>([]);

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

    const cliente = clientes.find(c => c.id === orcamento.clienteId);
    const primeiroContato = cliente?.contatos?.[0];
    const clienteNome = cliente?.razaoSocial || orcamento.clienteNome || 'Cliente Contratante';
    const cnpj = cliente?.cpfCnpj || cliente?.cnpj || orcamento.cnpjCliente || 'Consulte o contrato';
    const representante = (primeiroContato?.nome && primeiroContato.nome.trim()) || 
      (orcamento.representanteNome && orcamento.representanteNome.trim()) || 
      'Responsável Autorizado';
    const localidade = (cliente?.endereco?.cidade && cliente.endereco.cidade.trim()) 
      ? `${cliente.endereco.cidade}${cliente.endereco.estado ? ` - ${cliente.endereco.estado}` : ''}` 
      : (orcamento.localidadeServico || 'Recife - PE');
    const codigo = orcamento.codigoProposta || orcamento.id;
    const validade = orcamento.validadeDias || 15;
    const prazo = orcamento.prazoEntrega || `${orcamento.prazoDias || 7} dias úteis`;
    const tituloLaudoDinamico = obterTituloLaudoProposta(orcamento);

    return secoesParaExibir.map((s, idx) => {
      let conteudo = s.conteudoHtml || '';

      // PAGE 1: Capa e Identificação do Cliente
      const isCapa = s.id === 'capa' || s.numero === 1 || (s.titulo && s.titulo.toUpperCase().includes('CAPA'));
      if (isCapa) {
        conteudo = gerarCardClienteHtml({
          clienteNome,
          cnpj,
          representante,
          localidade,
          codigo,
          validade,
          prazo
        });

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

      // FOR ALL OTHER SECTIONS:
      // Etapa 2: Escopo Técnico das Atividades (Metodologia)
      const isEtapa2 = s.id === 'etapa2' || s.numero === 10 || (s.titulo && (s.titulo.toLowerCase().includes('etapa 2') || s.titulo.toLowerCase().includes('metodologia')));
      if (isEtapa2 && (!conteudo || !conteudo.includes('FASE 01'))) {
        conteudo = gerarHtmlEtapa2Metodologia(orcamento.normasTecnicas || 'ABNT NBR, NR-11, NR-12, NR-13');
      }

      // Etapa 3: Prazo, Pagamento & Investimento com Memorial de Cálculo
      const isEtapa3 = s.id === 'etapa3' || s.numero === 12 || (s.titulo && (s.titulo.toLowerCase().includes('etapa 3') || s.titulo.toLowerCase().includes('investimento')));
      if (isEtapa3) {
        if (!conteudo || !conteudo.includes('Memorial de Cálculo')) {
          conteudo = gerarHtmlEtapa3Investimento({
            valor: orcamento.valorFormatado || (orcamento.valor ? orcamento.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 4.500,00'),
            prazo,
            condicoes: orcamento.condicoesPagamento || '50% entrada e 50% após emissão da ART.',
            validade,
            clienteNome,
            representante,
            incluiNotaFiscal: orcamento.incluiNotaFiscal,
            chavePix: orcamento.chavePix,
            itensCalculo: orcamento.itensCalculo,
          });
        }

        conteudo = conteudo
          .replace(/<span[^>]*>[^<]*Assinado Digitalmente pelo Emissor[^<]*<\/span>/gi, '')
          .replace(/<span[^>]*>[^<]*\[Aceite Eletrônico \/ Assinatura Digital\][^<]*<\/span>/gi, '')
          .replace(/✓ Assinado Digitalmente pelo Emissor/g, '')
          .replace(/\[Aceite Eletrônico \/ Assinatura Digital\]/g, '')
          .replace(/<div style="text-align:\s*right;\s*flex-shrink:\s*0;">\s*<span[^>]*>[^<]*PIX IMEDIATO[^<]*<\/span>\s*<\/div>/gi, '')
          .replace(/<span[^>]*>[^<]*PIX IMEDIATO[^<]*<\/span>/gi, '')
          .replace(/<span[^>]*>[^<]*TRANSPARÊNCIA[^<]*<\/span>/gi, '')
          .replace(/Deslocamento e Relatório Colorido/g, 'Deslocamento e Laudo Completo');

        // Garante que a opção de Nota Fiscal reflita com precisão o estado do orçamento
        if (orcamento.incluiNotaFiscal === false) {
          conteudo = conteudo
            .replace(/✓ Nota Fiscal de Serviços \(NFS-e\)/g, '• Faturamento via Recibo (Sem NFS-e)')
            .replace(/Valor líquido para prestação de serviços de engenharia com emissão de Nota Fiscal \(NFS-e\) e taxa de ART inclusa\./g, 'Valor líquido para prestação de serviços técnicos de engenharia com Recibo de Prestação Autônoma e taxa de ART inclusa.');
        } else if (orcamento.incluiNotaFiscal === true) {
          conteudo = conteudo
            .replace(/• Faturamento via Recibo \(Sem NFS-e\)/g, '✓ Nota Fiscal de Serviços (NFS-e)')
            .replace(/Valor líquido para prestação de serviços técnicos de engenharia com Recibo de Prestação Autônoma e taxa de ART inclusa\./g, 'Valor líquido para prestação de serviços de engenharia com emissão de Nota Fiscal (NFS-e) e taxa de ART inclusa.');
        }

        if (representante) {
          const regexRepres = /(<div style="background:\s*#ffffff;\s*border:\s*1\.5px dashed[^>]*>[\s\S]*?<div style="border-bottom:\s*1\.5px dashed[^>]*><\/div>\s*<p[^>]*>[\s\S]*?<\/p>\s*)<p[^>]*>[\s\S]*?<\/p>(\s*<p[^>]*>De Acordo[^<]*<\/p>)/gi;
          if (regexRepres.test(conteudo)) {
            conteudo = conteudo.replace(regexRepres, `$1<p style="color: #475569; font-weight: 600; font-size: 10.5px; margin: 0 0 2px 0;">${representante}</p>$2`);
          }
        }
      }

      // Clean excessive CREA occurrences from PIX and badges across all pages
      conteudo = conteudo
        .replace(/Titular:\s*<strong>([^<]+)<\/strong>\s*•\s*CREA-PE\s*182229949-0/gi, 'Titular: <strong>$1</strong>')
        .replace(/<span[^>]*class="[^"]*font-mono"[^>]*>CREA-PE\s*182229949-0<\/span>/gi, '')
        .replace(/CREA-PE\s*HABILITADO/g, 'ENGENHARIA DIAGNÓSTICA');

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
  }, [todasSecoes, secoesOcultasIds, orcamento, clientes]);

  const totalPaginas = paginas.length;

  useEffect(() => {
    if (paginaAtual > totalPaginas && totalPaginas > 0) {
      setPaginaAtual(totalPaginas);
    }
  }, [totalPaginas, paginaAtual]);

  if (!isOpen) return null;

  const paginaRenderizar = paginas.find(p => p.numero === paginaAtual) || paginas[0];

  const verificarPendenciasProposta = () => {
    const pendencias: { tipo: 'erro' | 'aviso'; mensagem: string; detalhe?: string }[] = [];
    const cliente = clientes.find(c => c.id === orcamento.clienteId);

    // 1. Cliente: CNPJ/CPF e Representante
    const cnpj = (orcamento.cnpjCliente || cliente?.cpfCnpj || cliente?.cnpj || '').trim();
    if (!cnpj || cnpj.toLowerCase().includes('a preencher') || cnpj.toLowerCase().includes('consulte o contrato')) {
      pendencias.push({
        tipo: 'aviso',
        mensagem: 'CNPJ/CPF do Cliente não informado',
        detalhe: 'Identificar o documento formal confere validade jurídica e precisão tributária à proposta.'
      });
    }

    const primeiroContato = cliente?.contatos?.[0];
    const representante = (orcamento.representanteNome || primeiroContato?.nome || '').trim();
    if (!representante || representante.toLowerCase().includes('a preencher') || representante === 'Diretoria / Coordenação Técnica' || representante === 'Responsável Autorizado') {
      pendencias.push({
        tipo: 'aviso',
        mensagem: 'Nome do Principal Contato / Representante genérico',
        detalhe: 'Recomendamos identificar nominalmente o responsável para o aceite formal da proposta.'
      });
    }

    // 2. Validade: alerta se expirada
    const hoje = new Date().toISOString().split('T')[0];
    const dataValidade = orcamento.validaAte || calcularValidadeAte(orcamento.emitidaEm || orcamento.criadoEm, orcamento.validadeDias || 15);
    if (dataValidade) {
      let dataIso = dataValidade;
      if (dataValidade.includes('/')) {
        const parts = dataValidade.split('/');
        if (parts.length === 3) {
          dataIso = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }
      if (dataIso < hoje) {
        pendencias.push({
          tipo: 'aviso',
          mensagem: 'Proposta com data de validade vencida',
          detalhe: `A proposta venceu em ${dataValidade}. Recomenda-se atualizar a data de emissão ou o prazo de validade antes do envio.`
        });
      }
    }

    // 3. Memorial de Cálculo: conferir soma
    if (orcamento.itensCalculo && orcamento.itensCalculo.length > 0) {
      const soma = orcamento.itensCalculo.reduce((acc, it) => acc + (it.valorTotal || (it.quantidade * it.valorUnitario) || 0), 0);
      const valorTotal = orcamento.valor || 0;
      if (Math.abs(soma - valorTotal) > 0.05) {
        pendencias.push({
          tipo: 'erro',
          mensagem: 'Divergência de valores no Memorial de Cálculo',
          detalhe: `A soma dos itens (${soma.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}) difere do valor total contratado (${valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}).`
        });
      }
    }

    // 4. PIX CRC
    try {
      const chavePix = orcamento.chavePix || DADOS_VL_PADRAO.pixChave;
      const pixCode = gerarPixCopiaECola({
        chavePix,
        valor: (orcamento.valor || 2280) / 2,
        titular: DADOS_VL_PADRAO.pixTitular,
        cidade: DADOS_VL_PADRAO.pixCidade,
        identificador: (orcamento.codigoProposta || orcamento.id || 'PROP2026').replace(/[^a-zA-Z0-9]/g, '').slice(0, 20),
      });
      if (!validarPixCrc(pixCode)) {
        pendencias.push({
          tipo: 'erro',
          mensagem: 'Código PIX com checksum inválido',
          detalhe: 'O cálculo de validação do Bacen (CRC16) falhou. Verifique a chave PIX nas configurações.'
        });
      }
    } catch {
      pendencias.push({
        tipo: 'erro',
        mensagem: 'Erro ao gerar payload do PIX',
        detalhe: 'Verifique a chave PIX e os valores da proposta.'
      });
    }

    return pendencias;
  };

  const executarExportacaoPdf = (modoEscolhido: 'completa' | 'executiva' = modoExportacao) => {
    setGerandoPdf(true);
    // Salva a preferência de modo no orçamento
    atualizarOrcamento(orcamento.id, { modoExportacaoPdf: modoEscolhido });

    // Abre a rota de impressão vetorial nativa em nova janela para exportação direta
    const url = `/admin/orcamentos/${orcamento.id}/imprimir?auto=1&modo=${modoEscolhido}`;
    const win = window.open(url, '_blank');
    if (!win) {
      window.location.href = url;
    }
    setTimeout(() => {
      setGerandoPdf(false);
      setModalValidacaoAberto(false);
    }, 1000);
  };

  const handleIniciarExportacao = () => {
    const pendencias = verificarPendenciasProposta();
    if (pendencias.length > 0) {
      setPendenciasValidacao(pendencias);
      setModalValidacaoAberto(true);
    } else {
      executarExportacaoPdf();
    }
  };

  const handlePrintNative = () => {
    handleIniciarExportacao();
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

            {/* Mode Selector Toggle: Completa (6 folhas) vs Executiva (4 folhas) */}
            <div className="hidden lg:flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => {
                  setModoExportacao('completa');
                  atualizarOrcamento(orcamento.id, { modoExportacaoPdf: 'completa' });
                }}
                className={`px-2.5 py-1 rounded-md font-bold text-[11px] transition-colors cursor-pointer ${
                  modoExportacao === 'completa' 
                    ? 'bg-amber-400 text-slate-950 shadow-xs' 
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Versão Completa com 6 folhas A4 incluindo credenciais institucionais e portfólio"
              >
                Completa (6 fls)
              </button>
              <button
                type="button"
                onClick={() => {
                  setModoExportacao('executiva');
                  atualizarOrcamento(orcamento.id, { modoExportacaoPdf: 'executiva' });
                }}
                className={`px-2.5 py-1 rounded-md font-bold text-[11px] transition-colors cursor-pointer ${
                  modoExportacao === 'executiva' 
                    ? 'bg-amber-400 text-slate-950 shadow-xs' 
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Versão Executiva com 4 folhas A4 focada em escopo técnico, metodologia e investimento"
              >
                Executiva (4 fls)
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
              title="Visualizar e Imprimir Proposta Vetorial (A4)"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden md:inline">Imprimir</span>
            </button>

            {/* PDF Download Button (1-click Vector PDF) */}
            <button
              onClick={handleIniciarExportacao}
              disabled={gerandoPdf}
              className="px-3.5 py-2 rounded-lg bg-[#1565D8] hover:bg-[#1565D8]/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
              title={`Exportar PDF Vetorial de alta precisão (${modoExportacao === 'completa' ? '6 folhas' : '4 folhas'}, texto selecionável, links ativos e < 500 KB)`}
            >
              {gerandoPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Preparando...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Baixar PDF</span>
                </>
              )}
            </button>

            {/* Excluir Proposta button */}
            <button
              onClick={() => setConfirmandoExclusao(true)}
              className="p-2 rounded-lg bg-rose-900/40 hover:bg-rose-900/70 text-rose-300 text-xs font-semibold flex items-center gap-1.5 border border-rose-800/60 cursor-pointer ml-1"
              title="Excluir este orçamento definitivamente"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span className="hidden md:inline">Excluir</span>
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
                    <VlLogoVector className="shrink-0" style={{ width: '180px', height: '36px' }} />
                    <div className="border-l border-slate-300 pl-3">
                      <h4 className="text-sm font-black text-[#0B1E3D] leading-tight">VL ENGENHARIA MECÂNICA</h4>
                      <p className="text-[10px] text-[#1565D8] font-bold uppercase tracking-wider">
                        Proposta Técnico-Comercial • Engenharia Mecânica
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
                  <div className="mb-4">
                    {paginaRenderizar?.numero === 1 ? (
                      <h1 className="text-xl sm:text-2xl font-black text-[#0B1E3D] tracking-tight leading-snug">
                        PROPOSTA TÉCNICA COMERCIAL // ORÇAMENTO DE ENGENHARIA
                      </h1>
                    ) : (
                      <h2 className="text-xl font-black text-[#0B1E3D]">
                        {paginaRenderizar?.titulo}
                      </h2>
                    )}
                  </div>

                  <div 
                    className="prose prose-sm max-w-none text-slate-800 text-xs leading-relaxed space-y-3"
                    dangerouslySetInnerHTML={{ __html: paginaRenderizar?.conteudoHtml || '<p>Conteúdo da proposta técnica.</p>' }}
                  />
                </div>

                {/* Official Page Footer */}
                <footer className="relative z-10 border-t border-slate-300 pt-3 mt-8 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                  <span>VL Engenharia Mecânica • E-mail: atendimento@vlengenhariamecanica.com.br</span>
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
                      <VlLogoVector className="shrink-0" style={{ width: '180px', height: '36px' }} />
                      <div className="border-l border-slate-300 pl-3">
                        <h4 className="text-sm font-black text-[#0B1E3D] leading-tight">VL ENGENHARIA MECÂNICA</h4>
                        <p className="text-[10px] text-[#1565D8] font-bold uppercase tracking-wider">
                          Proposta Técnico-Comercial • Engenharia Mecânica
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-slate-600 font-mono">
                      <p>Ref: <strong>{orcamento.codigoProposta || orcamento.id}</strong></p>
                      <p>Página {pag.numero} de {totalPaginas}</p>
                    </div>
                  </header>

                  <div className="relative z-10 flex-1">
                    <div className="mb-4">
                      {pag.numero === 1 ? (
                        <h1 className="text-xl sm:text-2xl font-black text-[#0B1E3D] tracking-tight leading-snug">
                          PROPOSTA TÉCNICA COMERCIAL // ORÇAMENTO DE ENGENHARIA
                        </h1>
                      ) : (
                        <h2 className="text-xl font-black text-[#0B1E3D]">
                          {pag.titulo}
                        </h2>
                      )}
                    </div>

                    <div 
                      className="prose prose-sm max-w-none text-slate-800 text-xs leading-relaxed space-y-3"
                      dangerouslySetInnerHTML={{ __html: pag.conteudoHtml }}
                    />
                  </div>

                  <footer className="relative z-10 border-t border-slate-300 pt-3 mt-8 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                    <span>VL Engenharia Mecânica • E-mail: atendimento@vlengenhariamecanica.com.br</span>
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

        {/* Modal Confirmação de Exclusão do Orçamento */}
        {confirmandoExclusao && (
          <div 
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 text-left">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Excluir Orçamento</h3>
                    <p className="text-xs text-slate-500">Ação irreversível</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmandoExclusao(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <p className="text-slate-700 dark:text-slate-300">
                  Tem certeza de que deseja excluir permanentemente o orçamento <strong className="font-mono text-slate-900 dark:text-white">{orcamento.codigoProposta || orcamento.id}</strong>?
                </p>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <div><strong>Serviço:</strong> {orcamento.servico}</div>
                  <div><strong>Cliente:</strong> {clientes.find(c => c.id === orcamento.clienteId)?.nomeFantasia || orcamento.clienteNome || 'Cliente'}</div>
                  <div><strong>Valor:</strong> {(orcamento.valor ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                </div>

                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  Esta ação removerá este orçamento do banco de dados e do painel técnico.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setConfirmandoExclusao(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    removerOrcamento(orcamento.id);
                    setConfirmandoExclusao(false);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer shadow-xs"
                >
                  Sim, excluir orçamento
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Validação Pré-Exportação da Proposta (Passo 5) */}
        {modalValidacaoAberto && (
          <div 
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 text-left animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${
                    pendenciasValidacao.some(p => p.tipo === 'erro')
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-600'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                  }`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Validação Pré-Emissão da Proposta
                    </h3>
                    <p className="text-xs text-slate-500">
                      Verificação de integridade e dados contratuais
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setModalValidacaoAberto(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  O sistema verificou os dados de <strong className="text-slate-900 dark:text-white">{orcamento.codigoProposta || orcamento.id}</strong> antes da geração do PDF oficial:
                </p>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {pendenciasValidacao.map((item, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded-xl border text-xs space-y-1 ${
                        item.tipo === 'erro'
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200'
                          : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${item.tipo === 'erro' ? 'bg-rose-600' : 'bg-amber-500'}`} />
                          {item.mensagem}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-black uppercase ${
                          item.tipo === 'erro'
                            ? 'bg-rose-200 text-rose-800'
                            : 'bg-amber-200 text-amber-900'
                        }`}>
                          {item.tipo === 'erro' ? 'Correção' : 'Aviso'}
                        </span>
                      </div>
                      {item.detalhe && (
                        <p className="text-[11px] opacity-90 leading-relaxed pl-3.5">
                          {item.detalhe}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 space-y-0.5">
                  <div><strong>Modo selecionado:</strong> {modoExportacao === 'completa' ? 'Proposta Completa (6 folhas A4 com anexo institucional)' : 'Proposta Executiva (4 folhas A4 compacta)'}</div>
                  <div><strong>Formato de saída:</strong> PDF Vetorial nativo (&lt; 500 KB, texto selecionável, links ativos)</div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
                {onEditarProposta && (
                  <button
                    type="button"
                    onClick={() => {
                      setModalValidacaoAberto(false);
                      onClose();
                      onEditarProposta(orcamento);
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Corrigir no Orçamento</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => executarExportacaoPdf()}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-[#1565D8] hover:bg-[#0b4fb8] text-white transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Prosseguir com a Emissão</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
