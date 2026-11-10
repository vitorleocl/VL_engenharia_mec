import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Printer, 
  ArrowLeft, 
  Download, 
  CheckCircle2, 
  FileText, 
  Layers, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Building,
  AlertTriangle
} from 'lucide-react';
import QRCode from 'qrcode';
import { useData } from '../../context/DataContext';
import { Orcamento } from '../../types';
import { 
  DADOS_VL_PADRAO, 
  formatarDataBrasileira, 
  calcularValidadeAte, 
  obterDescricaoAtivosUnificada,
  obterTituloLaudoProposta
} from '../../lib/orcamentoTemplatePadrao';
import { gerarPixCopiaECola } from '../../lib/pixEmv';
import { VlLogoVector } from './PropostaViewerModal';

export const PropostaPrintView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { orcamentos, clientes, ativos } = useData();

  const orcamento = useMemo(() => {
    return orcamentos.find(o => o.id === id);
  }, [orcamentos, id]);

  const cliente = useMemo(() => {
    return clientes.find(c => c.id === orcamento?.clienteId);
  }, [clientes, orcamento]);

  const ativo = useMemo(() => {
    return ativos.find(a => a.id === orcamento?.ativoId);
  }, [ativos, orcamento]);

  // Export Mode: 'executiva' (4 pages) default or 'completa' (6 pages)
  const initialMode = (searchParams.get('modo') as 'executiva' | 'completa') || orcamento?.modoExportacaoPdf || 'executiva';
  const [modo, setModo] = useState<'executiva' | 'completa'>(initialMode);
  const [qrCodeSvg, setQrCodeSvg] = useState<string>('');
  const [pixPayload, setPixPayload] = useState<string>('');
  const [copiadoPix, setCopiadoPix] = useState(false);

  // Formatted data & single source of truth
  const codigo = orcamento?.codigoProposta || orcamento?.id || 'PROP-2026/001';
  const revisao = orcamento?.revisao || '00';
  const emitidaEm = orcamento?.emitidaEm || formatarDataBrasileira(orcamento?.criadoEm);
  const validadeDias = orcamento?.validadeDias || 15;
  const validaAte = orcamento?.validaAte || calcularValidadeAte(emitidaEm, validadeDias);

  const clienteNome = orcamento?.clienteNome || cliente?.nomeFantasia || cliente?.razaoSocial || 'Cliente Contratante';
  const cnpjCliente = orcamento?.cnpjCliente || cliente?.cpfCnpj || cliente?.cnpj || 'A preencher';
  const primeiroContato = cliente?.contatos?.[0];
  const representanteNome = orcamento?.representanteNome || primeiroContato?.nome || 'Diretoria / Coordenação Técnica';
  const localidadeServico = orcamento?.localidadeServico || (cliente?.endereco?.cidade ? `${cliente.endereco.cidade}, ${cliente.endereco.estado || 'PE'}` : 'Recife / Região Metropolitana, PE');
  const emailCliente = orcamento?.emailCliente || primeiroContato?.email || 'comercial@cliente.com.br';
  const telefoneCliente = orcamento?.telefoneCliente || primeiroContato?.telefone || '(81) 98444-2592';

  const servicoTitulo = orcamento?.servico || 'Laudo de Análise e Conformidade de Engenharia Mecânica';
  const tituloLaudoDestaque = orcamento ? obterTituloLaudoProposta(orcamento) : 'LAUDO TÉCNICO DE ENGENHARIA';
  const ativosDescricao = orcamento ? obterDescricaoAtivosUnificada(orcamento, { ativo }) : '01 Ativo Principal';
  const prazoEntrega = orcamento?.prazoEntrega || `${orcamento?.prazoDias || 7} dias úteis`;
  const valorTotalNum = orcamento?.valor || 2280;
  const valorTotalFormatado = orcamento?.valorFormatado || valorTotalNum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const condicoesPagamento = orcamento?.condicoesPagamento || '50% na aprovação e 50% após emissão do laudo e ART.';
  const normasTecnicas = orcamento?.normasTecnicas || 'ABNT NBR, NR-10, NR-11, NR-12 e NR-13 conforme aplicável';
  const descricaoEscopo = orcamento?.descricaoEscopo || 'Prestação de serviços especializados em Engenharia Mecânica, diagnóstico de integridade estrutural, verificação de conformidade com as Normas Regulamentadoras federais (ABNT / Ministério do Trabalho) e emissão de Anotação de Responsabilidade Técnica (ART) oficial junto ao CREA-PE.';

  // Memorial calculation
  const itensCalculo = useMemo(() => {
    if (orcamento?.itensCalculo && orcamento.itensCalculo.length > 0) {
      return orcamento.itensCalculo;
    }
    return [
      {
        id: 'item-1',
        descricao: servicoTitulo,
        quantidade: 1,
        valorUnitario: valorTotalNum,
        valorTotal: valorTotalNum,
      }
    ];
  }, [orcamento, servicoTitulo, valorTotalNum]);

  // Installments (50% / 50%)
  const parcelas = useMemo(() => {
    if (orcamento?.parcelas && orcamento.parcelas.length > 0) {
      return orcamento.parcelas;
    }
    const metade = valorTotalNum / 2;
    return [
      { parcela: '1ª', quando: 'Na aprovação da proposta', percentual: 50, valor: metade },
      { parcela: '2ª', quando: 'Após a emissão do laudo técnico pericial e o registro da ART junto ao CREA-PE', percentual: 50, valor: metade }
    ];
  }, [orcamento, valorTotalNum]);

  // Generate PIX EMV String and SVG QR Code
  useEffect(() => {
    const chavePix = orcamento?.chavePix || DADOS_VL_PADRAO.pixChave;
    const titular = DADOS_VL_PADRAO.pixTitular;
    const cidade = DADOS_VL_PADRAO.pixCidade;
    const primeiraParcelaValor = parcelas[0]?.valor || (valorTotalNum / 2);

    const pixCode = gerarPixCopiaECola({
      chavePix,
      valor: primeiraParcelaValor,
      titular,
      cidade,
      identificador: codigo.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20) || 'PROP2026',
    });

    setPixPayload(pixCode);

    QRCode.toString(pixCode, {
      type: 'svg',
      margin: 4,
      color: {
        dark: '#15264B',
        light: '#FFFFFF'
      }
    })
      .then(svg => setQrCodeSvg(svg))
      .catch(err => console.error('Erro ao gerar QR Code SVG:', err));
  }, [orcamento, parcelas, valorTotalNum, codigo]);

  // Set document title for clean native browser PDF download filename
  useEffect(() => {
    const clienteClean = clienteNome.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 25);
    const codigoClean = codigo.replace('/', '-');
    document.title = `Proposta_${codigoClean}_${clienteClean}_Rev${revisao}`;
  }, [clienteNome, codigo, revisao]);

  // Handle auto-print if requested via URL
  useEffect(() => {
    if (searchParams.get('auto') === '1') {
      document.fonts?.ready?.then(() => {
        setTimeout(() => {
          window.print();
        }, 600);
      });
    }
  }, [searchParams]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopiarPix = () => {
    if (!pixPayload) return;
    navigator.clipboard.writeText(pixPayload);
    setCopiadoPix(true);
    setTimeout(() => setCopiadoPix(false), 3000);
  };

  if (!orcamento) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-100 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-600 mb-3" />
        <h2 className="text-xl font-bold text-slate-800">Orçamento não encontrado</h2>
        <p className="text-slate-600 text-sm mt-1 mb-4">O código ou identificador informado não existe no sistema.</p>
        <Link to="/admin/orcamentos" className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition">
          Voltar para lista de orçamentos
        </Link>
      </div>
    );
  }

  const totalFolhas = modo === 'executiva' ? 4 : 6;

  return (
    <div className="proposta-print-wrapper bg-slate-200 min-h-screen text-slate-900">
      {/* Top Bar for Screen Preview (Hidden during @media print) */}
      <header className="no-print sticky top-0 z-50 bg-[#0B1E3D] text-white px-4 py-3 shadow-lg flex flex-wrap items-center justify-between gap-3 border-b border-blue-900/50">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(`/admin/orcamentos/${orcamento.id}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Editor
          </button>
          <div className="hidden sm:block">
            <span className="text-xs text-blue-200 block">Proposta Técnica Comercial</span>
            <strong className="text-sm text-white font-mono">{codigo} • {clienteNome}</strong>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Export Mode Toggle */}
          <div className="flex items-center bg-blue-950/80 p-0.5 rounded-lg border border-blue-800/80 text-xs">
            <button
              onClick={() => {
                setModo('completa');
                setSearchParams({ modo: 'completa' });
              }}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                modo === 'completa' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              Completa (6 folhas)
            </button>
            <button
              onClick={() => {
                setModo('executiva');
                setSearchParams({ modo: 'executiva' });
              }}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                modo === 'executiva' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              Executiva (4 folhas)
            </button>
          </div>

          {/* Native Print / Save to PDF Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-lg shadow-md transition transform active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Salvar em PDF</span>
          </button>
        </div>
      </header>

      {/* Embedded High-Fidelity CSS exactly matching the approved prototype */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&display=swap');

        :root {
          --ink: #0B1E3D;
          --blue: #1565D8;
          --amber: #D4AF37;
          --text: #1F2937;
          --muted: #4B5563;
          --rule: #D1D5DB;
          --tint: #F3F4F6;
          --tint2: #F8FAFC;
          --sans: 'Barlow Semi Condensed', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          --serif: 'Source Serif 4', Georgia, Cambria, 'Times New Roman', serif;
          --w1: .3pt;
          --w2: .7pt;
          --w3: 1.4pt;
        }

        .proposta-container {
          padding: 24px 0 60px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }

        .sheet {
          width: 210mm;
          min-height: 297mm;
          max-height: 297mm;
          height: 297mm;
          background: #fff;
          box-sizing: border-box;
          position: relative;
          color: var(--text);
          font-family: var(--serif);
          font-size: 9.2pt;
          line-height: 1.45;
          page-break-after: always;
          break-after: page;
          box-shadow: 0 4px 20px rgba(0,0,0,0.12);
        }

        /* Cover layout */
        .sheet.cover {
          padding: 8.5mm 14mm 6mm;
          display: flex;
          flex-direction: column;
        }

        /* Inner sheets layout */
        .sheet:not(.cover) {
          padding: 0 14mm 6mm;
          display: flex;
          flex-direction: column;
        }

        .sheet:not(.cover) .body {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding-top: 2.5mm;
        }

        /* Running Header (Pages 2-6) */
        .rh {
          height: 12.5mm;
          border-bottom: var(--w2) solid var(--ink);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1.5mm;
          margin-bottom: 2mm;
          overflow: visible;
        }
        .rh img { height: 7mm; width: auto; object-fit: contain; }
        .rh .where {
          font: 500 8pt var(--sans);
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: .06em;
        }
        .rh .where b { color: var(--ink); font-weight: 700; margin-right: 4mm; }

        /* Legend Bar above footer */
        .lg {
          display: grid;
          grid-template-columns: 2fr 1fr .6fr 1fr 1fr .8fr;
          gap: 0 3mm;
          border-top: var(--w1) solid var(--rule);
          padding: 1.4mm 0 1.2mm;
          font: 500 7pt/1.2 var(--sans);
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: .05em;
          margin-top: auto;
        }
        .lg .k { color: #9CA3AF; display: block; font-size: 6.2pt; }
        .lg .v { color: var(--ink); font-weight: 600; display: block; }

        /* Running Footer */
        .ft {
          border-top: var(--w2) solid var(--ink);
          padding-top: 1.4mm;
          display: flex;
          justify-content: space-between;
          font: 500 7.5pt/1.2 var(--sans);
          color: var(--muted);
        }
        .ft span { display: inline-flex; gap: 4mm; }
        .ft a { color: var(--blue); text-decoration: none; }

        /* Cover Specific Sections */
        .cover .ch {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: var(--w3) solid var(--ink);
          padding-bottom: 2.6mm;
          overflow: visible;
        }
        .cover .ch img { height: 9.5mm; width: auto; }
        .cover .ch .meta {
          text-align: right;
          font: 500 8pt/1.3 var(--sans);
          color: var(--muted);
        }
        .cover .ch .meta b { color: var(--ink); font-weight: 700; }

        .cover .top { padding: 4mm 0 2.8mm; border-bottom: var(--w1) solid var(--rule); }
        .cover h1 {
          font: 700 20pt/1.1 var(--sans);
          color: var(--ink);
          letter-spacing: -.01em;
          margin: 0;
        }
        .cover .sub {
          font: 600 10.2pt/1.3 var(--sans);
          color: var(--blue);
          margin-top: 1mm;
          text-transform: uppercase;
          letter-spacing: .04em;
        }
        .cover .lead {
          font: 400 9pt/1.42 var(--serif);
          color: var(--muted);
          margin-top: 1.8mm;
        }

        .cover .mid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6mm;
          padding: 3mm 0 3mm;
          border-bottom: var(--w1) solid var(--rule);
        }
        .cover h3 {
          font: 700 8pt/1 var(--sans);
          color: var(--ink);
          text-transform: uppercase;
          letter-spacing: .08em;
          margin-bottom: 2mm;
        }

        .cover .idx { list-style: none; padding: 0; margin: 0; }
        .cover .idx li {
          display: grid;
          grid-template-columns: 14mm 1fr auto;
          gap: 2mm;
          padding: 1.4mm 0;
          border-top: var(--w1) solid var(--rule);
          align-items: baseline;
          font-family: var(--sans);
        }
        .cover .idx li:first-child { border-top: none; }
        .cover .idx .e { font: 700 8pt var(--sans); color: var(--ink); text-transform: uppercase; }
        .cover .idx .t { font: 600 8.8pt var(--sans); color: var(--ink); display: block; }
        .cover .idx .d { font: 400 7.4pt/1.25 var(--serif); color: var(--muted); display: block; }
        .cover .idx .p { font: 700 8pt var(--sans); color: var(--blue); }
        .cover .idx a { text-decoration: none; color: inherit; }

        .cover .approve ol { list-style: none; padding: 0; margin: 0; }
        .cover .approve li {
          display: grid;
          grid-template-columns: 6mm 1fr;
          gap: 2.5mm;
          padding: 1.5mm 0;
          align-items: flex-start;
          border-top: var(--w1) solid var(--rule);
        }
        .cover .approve li:first-child { border-top: none; }
        .cover .approve .n {
          width: 5.5mm;
          height: 5.5mm;
          background: var(--ink);
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font: 700 7.5pt var(--sans);
        }
        .cover .approve p { font-size: 8.4pt; line-height: 1.35; margin: 0; }
        .cover .approve b { font-family: var(--sans); font-weight: 700; color: var(--ink); }

        /* Cover Table Grid */
        .cover .tb {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 0;
          border: var(--w2) solid var(--ink);
          margin-top: 3mm;
          margin-bottom: auto;
        }
        .cover .tb>div {
          padding: 1.8mm 2.4mm;
          border-right: var(--w1) solid var(--rule);
          border-bottom: var(--w1) solid var(--rule);
          font-family: var(--sans);
        }
        .cover .tb .c12 { grid-column: span 12; }
        .cover .tb .c8  { grid-column: span 8; }
        .cover .tb .c6  { grid-column: span 6; }
        .cover .tb .c5  { grid-column: span 5; }
        .cover .tb .c4  { grid-column: span 4; }
        .cover .tb .c3  { grid-column: span 3; }
        .cover .tb .c2  { grid-column: span 2; }
        .cover .tb>div:last-child, .cover .tb .c5.price { border-right: none; }

        .cover .tb .k {
          display: block;
          font: 600 6.6pt/1 var(--sans);
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: .06em;
          margin-bottom: .6mm;
        }
        .cover .tb .v {
          display: block;
          font: 600 9.2pt/1.2 var(--sans);
          color: var(--ink);
        }
        .cover .tb .v.sm { font-size: 8.2pt; }
        .cover .tb .v.sm2 { font-size: 8.2pt; line-height: 1.25; }
        .cover .tb .big {
          display: block;
          font: 700 14pt/1.05 var(--sans);
          color: var(--ink);
          letter-spacing: -.01em;
        }
        .cover .tb .cap {
          display: block;
          font: 400 6.8pt/1.2 var(--serif);
          color: var(--muted);
          margin-top: .4mm;
        }
        .cover .tb .price { background: var(--tint); }
        .cover .tb .price .n {
          font: 700 17pt/1 var(--sans);
          color: var(--blue);
          display: block;
          letter-spacing: -.02em;
        }
        .cover .tb .price .dim {
          display: flex;
          align-items: center;
          gap: 1.5mm;
          margin: .6mm 0 .2mm;
        }
        .cover .tb .price .dim svg { width: 5px; height: 5px; fill: var(--amber); }
        .cover .tb .price .dim i { flex: 1; height: var(--w1); background: var(--amber); }

        /* Section Headings */
        h2 {
          font: 700 14.5pt/1.1 var(--sans);
          color: var(--ink);
          letter-spacing: -.01em;
          margin: 0 0 2mm 0;
          padding-bottom: 1.2mm;
          border-bottom: var(--w2) solid var(--ink);
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .blk {
          border: var(--w1) solid var(--rule);
          background: #fff;
          padding: 2.4mm 3mm;
          margin-bottom: 2mm;
        }
        .blk.tight { padding: 2mm 2.8mm; margin-bottom: 2mm; }
        .blk h3 {
          font: 700 8pt/1 var(--sans);
          color: var(--ink);
          text-transform: uppercase;
          letter-spacing: .08em;
          margin: 0 0 1.6mm 0;
          border-bottom: var(--w1) solid var(--rule);
          padding-bottom: .8mm;
        }

        .cols2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; }

        /* Key-Value Tables */
        table.kv { width: 100%; border-collapse: collapse; font-family: var(--sans); font-size: 8.3pt; }
        table.kv th {
          text-align: left;
          width: 32mm;
          color: var(--muted);
          font-weight: 500;
          padding: .8mm 0;
          border-bottom: var(--w1) solid var(--tint);
          vertical-align: top;
        }
        table.kv td {
          padding: .8mm 0;
          color: var(--ink);
          font-weight: 600;
          border-bottom: var(--w1) solid var(--tint);
        }
        table.kv td.t { font-family: var(--serif); font-weight: 400; font-size: 8.5pt; color: var(--text); line-height: 1.35; }
        table.kv.wide th { width: 36mm; }
        table.kv a { color: var(--blue); text-decoration: none; }

        .obj {
          margin-top: 1.4mm;
          padding: 1.2mm 2mm;
          background: var(--tint);
          font: 500 8pt/1.3 var(--sans);
          color: var(--ink);
        }
        .obj span { color: var(--muted); }

        /* Checklist OK / NO */
        .chk { list-style: none; padding: 0; margin: 0; font-size: 8.4pt; }
        .chk li {
          display: grid;
          grid-template-columns: 4mm 1fr;
          gap: 1.8mm;
          padding: .9mm 0;
          border-bottom: var(--w1) solid var(--tint);
          align-items: baseline;
        }
        .chk li:last-child { border-bottom: none; }
        .chk.ok svg { color: var(--blue); }
        .chk.no svg { color: #9CA3AF; }

        /* Metodologia 5 Fases */
        .band {
          background: var(--ink);
          color: #fff;
          padding: 1.8mm 3mm;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-family: var(--sans);
        }
        .band b { font-weight: 700; font-size: 9.6pt; }
        .band span { font-weight: 400; font-size: 8pt; color: #BFCBE8; margin-left: 2mm; }
        .band em { font-style: normal; font-weight: 600; font-size: 7.6pt; color: var(--amber); text-transform: uppercase; letter-spacing: .06em; }

        .ph {
          display: grid;
          grid-template-columns: 11mm 1fr;
          gap: 2.6mm;
          border: var(--w1) solid var(--rule);
          border-top: none;
          padding: 1.8mm 2.6mm;
          background: #fff;
        }
        .ph:nth-child(even) { background: var(--tint2); }
        .ph .no {
          font: 700 15pt/1 var(--sans);
          color: var(--blue);
          border-right: var(--w1) solid var(--rule);
          padding-right: 2mm;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .ph .no small { font: 500 6pt/1 var(--sans); color: var(--muted); text-transform: uppercase; }
        .ph .hd { display: flex; justify-content: space-between; align-items: baseline; }
        .ph h4 { font: 600 9.4pt/1.2 var(--sans); color: var(--ink); margin: 0; }
        .ph .tag { font: 500 7pt var(--sans); color: var(--muted); text-transform: uppercase; }
        .ph p { font-size: 8.4pt; line-height: 1.35; margin: .8mm 0; color: var(--text); }
        .ph .dl { display: flex; align-items: center; gap: 1.5mm; font-size: 7.9pt; color: var(--muted); }
        .ph .dl svg { width: 3.2mm; height: 3.2mm; color: var(--blue); shrink: 0; }
        .ph .dl b { font-family: var(--sans); color: var(--ink); }

        /* Stage 3 Memorial & Installments */
        table.memo { width: 100%; border-collapse: collapse; font-family: var(--sans); font-size: 8.5pt; }
        table.memo th {
          background: var(--tint);
          color: var(--ink);
          font-weight: 700;
          text-transform: uppercase;
          font-size: 7.2pt;
          letter-spacing: .06em;
          padding: 1.4mm 2mm;
          border-bottom: var(--w2) solid var(--ink);
        }
        table.memo td {
          padding: 1.6mm 2mm;
          border-bottom: var(--w1) solid var(--rule);
          vertical-align: middle;
        }
        table.memo td.r, table.memo th.r { text-align: right; }
        table.memo tfoot td {
          background: var(--tint2);
          border-top: var(--w2) solid var(--ink);
          border-bottom: none;
          padding: 2mm;
        }
        table.memo .tot { font-size: 13pt; font-weight: 700; color: var(--blue); }
        table.memo .lab { font-weight: 700; color: var(--ink); text-transform: uppercase; font-size: 8.5pt; }
        table.memo .lab span { display: block; font-weight: 400; font-size: 7pt; color: var(--muted); text-transform: none; margin-top: .4mm; }

        .cond { display: grid; grid-template-columns: 1fr 1.6fr 1fr; gap: 3mm; padding-bottom: 1.6mm; }
        .cond .k { font: 600 6.8pt/1 var(--sans); color: var(--muted); text-transform: uppercase; display: block; }
        .cond b { font: 600 9.4pt/1.2 var(--sans); color: var(--ink); display: block; margin: .6mm 0; }
        .cond p { font-size: 7.8pt; line-height: 1.3; color: var(--muted); margin: 0; }

        table.inst { width: 100%; border-collapse: collapse; font-family: var(--sans); font-size: 8.3pt; margin-top: 1.4mm; }
        table.inst th {
          background: var(--tint);
          color: var(--ink);
          font-weight: 600;
          font-size: 6.8pt;
          text-transform: uppercase;
          padding: 1mm 1.8mm;
          text-align: left;
        }
        table.inst td { padding: 1.2mm 1.8mm; border-bottom: var(--w1) solid var(--tint); }
        table.inst td.r, table.inst th.r { text-align: right; font-weight: 700; }
        table.inst td.t { font-family: var(--serif); }

        /* Timeline */
        .tl { position: relative; padding: 1.8mm 0; }
        .tl .rail { position: absolute; left: 0; right: 0; top: 3.4mm; height: var(--w2); background: var(--ink); z-index: 1; }
        .tl ol {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 2mm;
          position: relative;
          z-index: 2;
        }
        .tl li { font-family: var(--sans); }
        .tl li i {
          width: 3.4mm;
          height: 3.4mm;
          background: #fff;
          border: var(--w2) solid var(--blue);
          border-radius: 50%;
          display: block;
          margin-bottom: 1.4mm;
        }
        .tl li:first-child i { background: var(--blue); }
        .tl li b { display: block; font: 700 8.2pt/1.1 var(--sans); color: var(--ink); }
        .tl li span { display: block; font: 400 7.2pt/1.25 var(--serif); color: var(--muted); margin-top: .4mm; }

        /* PIX block */
        .pix { display: grid; grid-template-columns: 26mm 1fr; gap: 3.4mm; align-items: center; }
        .pix .qr {
          width: 26mm;
          height: 26mm;
          border: var(--w1) solid var(--rule);
          padding: 1mm;
          background: #fff;
        }
        .pix .qr svg { width: 100%; height: 100%; display: block; }
        .pix h4 { font: 700 8.8pt/1.1 var(--sans); color: var(--ink); margin: 0 0 1mm 0; }
        .pix .kv2 { font: 500 8pt/1.35 var(--sans); color: var(--muted); }
        .pix .kv2 b { color: var(--ink); font-weight: 600; }
        .pix .code {
          margin-top: 1.2mm;
          background: #fff;
          border: var(--w1) solid var(--rule);
          padding: 1mm 1.6mm;
          font: 500 6.5pt/1.3 monospace;
          color: var(--muted);
          word-break: break-all;
          user-select: all;
        }

        /* Signatures block */
        .sign { display: grid; grid-template-columns: 1fr 1fr; gap: 8mm; margin-top: 2mm; }
        .sign .line { height: 10mm; border-bottom: var(--w2) solid var(--ink); }
        .sign b { display: block; font: 600 9.8pt/1.2 var(--sans); color: var(--ink); margin-top: 1.2mm; }
        .sign .n { display: block; font: 500 8.6pt/1.3 var(--sans); color: var(--blue); }
        .sign .m { display: block; font: 400 7.9pt/1.35 var(--serif); color: var(--muted); }
        .sign .dt { margin-top: 1.4mm; font: 500 7.8pt var(--sans); color: var(--muted); }

        /* Institutional Annex (Pages 5-6) */
        .bio { display: grid; grid-template-columns: 32mm 1fr; gap: 4.5mm; align-items: start; }
        .bio img { width: 32mm; height: 39mm; object-fit: cover; display: block; border-bottom: var(--w3) solid var(--ink); border-radius: 4px; }
        .bio h4 { font: 700 14pt/1.1 var(--sans); margin: 0; color: var(--ink); }
        .bio .role { font: 600 9pt/1.25 var(--sans); color: var(--blue); margin-top: .6mm; }
        .bio p { margin-top: 1.4mm; font-size: 8.6pt; line-height: 1.4; }
        .bio .chk { display: grid; grid-template-columns: 1fr 1fr; gap: 0 4mm; margin-top: 1mm; }

        .quote {
          border-left: var(--w3) solid var(--amber);
          padding: .4mm 0 .4mm 4mm;
          font: italic 400 9.8pt/1.45 var(--serif);
          color: var(--ink);
          margin: 1.5mm 0;
        }

        .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0 6mm; }
        .it { padding: 1.8mm 0; border-bottom: var(--w1) solid var(--rule); }
        .it h4 { margin: 0 0 .4mm 0; font: 600 9pt/1.2 var(--sans); color: var(--ink); }
        .it p { font-size: 8.4pt; line-height: 1.35; margin: 0; color: var(--muted); }

        .pb { display: grid; grid-template-columns: 40mm 1fr; gap: 0 4mm; padding: 1.8mm 0; border-bottom: var(--w1) solid var(--rule); }
        .pb h4 { font: 600 9.2pt/1.2 var(--sans); margin: 0; color: var(--ink); }
        .pb p { font-size: 8.4pt; line-height: 1.35; margin: 0; color: var(--muted); }

        .sv3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0 4.5mm; }
        .sv { padding: 1.8mm 0; border-bottom: var(--w1) solid var(--rule); }
        .sv .cd { font: 700 13pt/1 var(--sans); color: var(--blue); }
        .sv h4 { font: 600 9pt/1.2 var(--sans); margin-top: .6mm; margin-bottom: 0; color: var(--ink); }
        .sv .tg { font: 500 7.4pt/1.2 var(--sans); color: var(--muted); margin: .2mm 0 .6mm; }
        .sv p { font-size: 8pt; line-height: 1.35; margin: 0; color: var(--text); }

        .thanks { background: var(--ink); color: #fff; padding: 2.8mm 4mm; margin-top: 2mm; }
        .thanks .th { display: flex; justify-content: space-between; align-items: baseline; gap: 4mm; }
        .thanks b { font: 600 10.8pt/1.2 var(--sans); color: #fff; }
        .thanks .tg { font: 500 8pt var(--sans); color: #BFCBE8; white-space: nowrap; }
        .thanks p { margin-top: 1mm; font-size: 8.6pt; line-height: 1.42; color: #E7ECF7; }

        .ct { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 0 3.5mm; }
        .ct>div { padding: 1.8mm 0; border-bottom: var(--w1) solid var(--rule); }
        .ct .k { display: block; font: 600 6.8pt/1 var(--sans); color: var(--muted); text-transform: uppercase; margin-bottom: .6mm; }
        .ct b { display: block; font: 600 9.2pt/1.2 var(--sans); color: var(--ink); }
        .ct .sub { display: block; font: 500 7.8pt/1.3 var(--sans); color: var(--blue); margin-top: .3mm; }
        .ct p { font: 400 7.6pt/1.32 var(--serif); color: var(--muted); margin-top: .6mm; margin-bottom: 0; }
        .ct a { color: inherit; text-decoration: none; }

        .gr { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0 4.5mm; border-top: var(--w2) solid var(--ink); padding-top: 1.6mm; margin-top: 2mm; }
        .gr b { display: block; font: 600 9pt/1.2 var(--sans); color: var(--ink); }
        .gr span { font: 400 7.8pt/1.32 var(--serif); color: var(--muted); }

        /* Print Specific Behavior */
        @media print {
          @page {
            size: 210mm 297mm;
            margin: 0;
          }
          body, html {
            background: #fff !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .proposta-print-wrapper {
            background: #fff !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .proposta-container {
            padding: 0 !important;
            margin: 0 !important;
            gap: 0 !important;
          }
          .sheet {
            box-shadow: none !important;
            margin: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            max-height: 297mm !important;
            page-break-after: always !important;
            break-after: page !important;
          }
          .sheet:last-of-type {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
        }
      `}</style>

      {/* Main Pages Container */}
      <div className="proposta-container">
        
        {/* ============================ FOLHA 1: CAPA ============================ */}
        <section className="sheet cover" id="p1">
          <div className="ch">
            <VlLogoVector className="h-9 w-auto" style={{ width: '165px', height: '32px' }} />
            <div className="meta">
              <div>Proposta <b>{codigo}</b>, revisão {revisao}</div>
              <div>Emitida em <b>{emitidaEm}</b></div>
            </div>
          </div>

          <div className="top">
            <h1>{servicoTitulo}</h1>
            <p className="sub">Proposta técnico-comercial e orçamento de engenharia para {clienteNome}</p>
            <p className="lead">{descricaoEscopo}</p>
          </div>

          <div className="mid">
            <div>
              <h3>Nesta proposta</h3>
              <ol className="idx">
                <li>
                  <span className="e">Etapa 1</span>
                  <a href="#p2">
                    <span className="t">Relação dos serviços</span>
                    <span className="d">Partes, normas técnicas associadas, escopo preliminar, levantamento fotográfico e o que está incluído.</span>
                  </a>
                  <span className="p">p. 2</span>
                </li>
                <li>
                  <span className="e">Etapa 2</span>
                  <a href="#p3">
                    <span className="t">Escopo técnico das atividades</span>
                    <span className="d">Metodologia em 5 fases sequenciais, checklists normativos, ensaios instrumentados e condições de acesso.</span>
                  </a>
                  <span className="p">p. 3</span>
                </li>
                <li>
                  <span className="e">Etapa 3</span>
                  <a href="#p4">
                    <span className="t">Prazo, pagamento e investimento</span>
                    <span className="d">Cronograma executivo, pagamento em 2 parcelas, PIX, homologação com ART e aceite.</span>
                  </a>
                  <span className="p">p. 4</span>
                </li>
                {modo === 'completa' && (
                  <li>
                    <span className="e">Anexo</span>
                    <a href="#p5">
                      <span className="t">Sobre a VL Engenharia</span>
                      <span className="d">Responsável técnico, princípios, soluções, serviços e contatos.</span>
                    </a>
                    <span className="p">p. 5–6</span>
                  </li>
                )}
              </ol>
            </div>
            <div className="approve">
              <h3>Como aprovar</h3>
              <ol>
                <li>
                  <span className="n">1</span>
                  <p><b>Confirme o aceite.</b> Responda “de acordo” por e-mail ou WhatsApp, ou assine na página 4.</p>
                </li>
                <li>
                  <span className="n">2</span>
                  <p><b>Pague a 1ª parcela (50%).</b> PIX com QR Code e “copia e cola” na página 4.</p>
                </li>
                <li>
                  <span className="n">3</span>
                  <p><b>Agendamos a vistoria.</b> Mobilização em até 48 h úteis; laudo com ART em {prazoEntrega} após a vistoria.</p>
                </li>
              </ol>
            </div>
          </div>

          <div className="tb">
            <div className="c8">
              <span className="k">Contratante</span>
              <span className="v">{clienteNome}</span>
            </div>
            <div className="c4">
              <span className="k">CNPJ / CPF</span>
              <span className="v">{cnpjCliente}</span>
            </div>

            <div className="c4">
              <span className="k">Representante / contato</span>
              <span className="v">{representanteNome}</span>
            </div>
            <div className="c4">
              <span className="k">Localidade / unidade</span>
              <span className="v">{localidadeServico}</span>
            </div>
            <div className="c2">
              <span className="k">Código</span>
              <span className="v font-mono">{codigo}</span>
            </div>
            <div className="c2">
              <span className="k">Validade até</span>
              <span className="v font-mono">{validaAte}</span>
            </div>

            <div className="c6">
              <span className="k">Serviço</span>
              <span className="v">{servicoTitulo}</span>
            </div>
            <div className="c3">
              <span className="k">Ativos</span>
              <span className="v">{ativosDescricao}</span>
            </div>
            <div className="c3">
              <span className="k">Responsável técnico</span>
              <span className="v sm2">{DADOS_VL_PADRAO.responsavelTecnico}<br />CREA-PE {DADOS_VL_PADRAO.crea}</span>
            </div>

            <div className="c3">
              <span className="k">Prazo de conclusão</span>
              <span className="big">{prazoEntrega}</span>
              <span className="cap">a partir da vistoria in loco</span>
            </div>
            <div className="c4">
              <span className="k">Pagamento</span>
              <span className="big">50% + 50%</span>
              <span className="cap">na aprovação e após laudo e ART</span>
            </div>
            <div className="c5 price">
              <span className="k">Investimento total</span>
              <span className="n">{valorTotalFormatado}</span>
              <div className="dim">
                <svg viewBox="0 0 8 8"><path d="M0 4L7 .8V7.2Z"/></svg>
                <i></i>
                <svg viewBox="0 0 8 8"><path d="M8 4L1 .8V7.2Z"/></svg>
              </div>
              <span className="cap">
                {orcamento.incluiNotaFiscal !== false ? 'NFS-e e taxa de ART inclusas' : 'Recibo de autônomo e ART inclusa'}
              </span>
            </div>
          </div>

          <div className="ft">
            <span>{DADOS_VL_PADRAO.razaoSocial}<em style={{ fontStyle: 'normal' }}>{DADOS_VL_PADRAO.sede}</em></span>
            <span>
              <a href={`https://wa.me/${DADOS_VL_PADRAO.telefoneLink}`}>{DADOS_VL_PADRAO.telefone}</a>
              <a href={`mailto:${DADOS_VL_PADRAO.email}`}>{DADOS_VL_PADRAO.email}</a>
            </span>
          </div>
        </section>

        {/* ============================ FOLHA 2: ETAPA 1 ============================ */}
        <section className="sheet" id="p2">
          <div className="rh">
            <VlLogoVector className="h-7 w-auto" style={{ width: '135px', height: '26px' }} />
            <div className="where"><b>Etapa 1 de 3</b> Relação dos serviços e levantamento fotográfico</div>
          </div>
          <div className="body">
            <h2>Partes, serviço e normas de referência</h2>

            <div className="blk tight">
              <h3>Identificação das partes</h3>
              <div className="cols2">
                <div>
                  <h4 className="font-bold text-xs text-[#0B1E3D] mb-1">Contratada</h4>
                  <table className="kv">
                    <tbody>
                      <tr><th>Razão social</th><td>{DADOS_VL_PADRAO.razaoSocial}</td></tr>
                      <tr><th>CNPJ</th><td>{DADOS_VL_PADRAO.cnpj}</td></tr>
                      <tr><th>Responsável técnico</th><td>{DADOS_VL_PADRAO.responsavelTecnico}</td></tr>
                      <tr><th>CREA-PE</th><td>{DADOS_VL_PADRAO.crea}</td></tr>
                      <tr><th>Sede operacional</th><td>{DADOS_VL_PADRAO.sede}</td></tr>
                      <tr><th>E-mail</th><td><a href={`mailto:${DADOS_VL_PADRAO.email}`}>{DADOS_VL_PADRAO.email}</a></td></tr>
                      <tr><th>Telefone / WhatsApp</th><td><a href={`https://wa.me/${DADOS_VL_PADRAO.telefoneLink}`}>{DADOS_VL_PADRAO.telefone}</a></td></tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#0B1E3D] mb-1">Contratante</h4>
                  <table className="kv">
                    <tbody>
                      <tr><th>Razão social</th><td>{clienteNome}</td></tr>
                      <tr><th>CNPJ / CPF</th><td>{cnpjCliente}</td></tr>
                      <tr><th>Representante</th><td>{representanteNome}</td></tr>
                      <tr><th>Localidade</th><td>{localidadeServico}</td></tr>
                      <tr><th>E-mail</th><td><a href={`mailto:${emailCliente}`}>{emailCliente}</a></td></tr>
                      <tr><th>Telefone</th><td>{telefoneCliente}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="obj">
                <span>Objeto da proposta:</span> {servicoTitulo} &nbsp;|&nbsp; <span>Ativo principal:</span> {ativosDescricao} &nbsp;|&nbsp; <span>Ref.:</span> {codigo}
              </div>
            </div>

            <div className="blk tight">
              <h3>Serviço contratado e ativos</h3>
              <table className="kv wide">
                <tbody>
                  <tr><th>Serviço contratado</th><td>{servicoTitulo}</td></tr>
                  <tr><th>Ativo avaliado</th><td>{ativosDescricao}</td></tr>
                  <tr><th>Medições e análise</th><td className="t">Inspeção técnica in loco, ensaios funcionais e não destrutivos cabíveis, mapeamento fotográfico de campo e análise de conformidade mecânica segundo resoluções vigentes.</td></tr>
                  <tr><th>Levantamento fotográfico</th><td className="t">As evidências fotográficas coletadas em campo durante a inspeção visual são integradas, em alta resolução, ao laudo definitivo.</td></tr>
                </tbody>
              </table>
            </div>

            <div className="blk tight">
              <h3>Normas de referência</h3>
              <table className="kv wide">
                <tbody>
                  <tr><th>Normas Técnicas</th><td>{normasTecnicas}</td></tr>
                  <tr><th>CREA-PE / CONFEA</th><td>Lei Federal 5.194/1966 e Resolução 1.025/2009 (ART)</td></tr>
                  <tr><th>Segurança do Trabalho</th><td>NRs regulamentadoras vigentes aplicáveis ao segmento operacional</td></tr>
                </tbody>
              </table>
            </div>

            <div className="blk tight cols2">
              <div>
                <h3>Está incluído</h3>
                <ul className="chk ok">
                  {(orcamento.incluso && orcamento.incluso.length > 0) ? (
                    orcamento.incluso.map((inc, i) => (
                      <li key={i}>
                        <svg viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>
                        <span>{inc}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li><svg viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>Laudo técnico pericial de conformidade mecânica completo</li>
                      <li><svg viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>Deslocamento e vistoria in loco</li>
                      <li><svg viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>Laudo conclusivo em PDF com assinatura eletrônica e certificado digital</li>
                      <li><svg viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>ART registrada no CREA-PE, taxa inclusa</li>
                      <li><svg viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>{orcamento.incluiNotaFiscal !== false ? 'Nota fiscal de serviços (NFS-e)' : 'Recibo de prestação autônoma de serviços'}</li>
                    </>
                  )}
                </ul>
              </div>
              <div>
                <h3>Fora do escopo</h3>
                <ul className="chk no">
                  {(orcamento.foraDoEscopo && orcamento.foraDoEscopo.length > 0) ? (
                    orcamento.foraDoEscopo.map((f, i) => (
                      <li key={i}>
                        <svg viewBox="0 0 12 12"><path d="M2.6 2.6l6.8 6.8M9.4 2.6L2.6 9.4" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>
                        <span>{f}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li><svg viewBox="0 0 12 12"><path d="M2.6 2.6l6.8 6.8M9.4 2.6L2.6 9.4" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>Reparos, troca de peças e intervenções corretivas nos equipamentos</li>
                      <li><svg viewBox="0 0 12 12"><path d="M2.6 2.6l6.8 6.8M9.4 2.6L2.6 9.4" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>Paradas, bloqueios e estruturas de acesso (andaimes, escadas), a cargo do contratante</li>
                      <li><svg viewBox="0 0 12 12"><path d="M2.6 2.6l6.8 6.8M9.4 2.6L2.6 9.4" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>Novas medições após as correções, sob nova proposta</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="lg">
            <div><span className="k">Contratante</span><span className="v">{clienteNome}</span></div>
            <div><span className="k">Proposta</span><span className="v">{codigo}</span></div>
            <div><span className="k">Rev.</span><span className="v">{revisao}</span></div>
            <div><span className="k">Emissão</span><span className="v">{emitidaEm}</span></div>
            <div><span className="k">Válida até</span><span className="v">{validaAte}</span></div>
            <div><span className="k">Folha</span><span className="v">2 / {totalFolhas}</span></div>
          </div>
          <div className="ft">
            <span>{DADOS_VL_PADRAO.razaoSocial}<em style={{ fontStyle: 'normal' }}>{DADOS_VL_PADRAO.sede}</em></span>
            <span>
              <a href={`https://wa.me/${DADOS_VL_PADRAO.telefoneLink}`}>{DADOS_VL_PADRAO.telefone}</a>
              <a href={`mailto:${DADOS_VL_PADRAO.email}`}>{DADOS_VL_PADRAO.email}</a>
            </span>
          </div>
        </section>

        {/* ============================ FOLHA 3: ETAPA 2 ============================ */}
        <section className="sheet" id="p3">
          <div className="rh">
            <VlLogoVector className="h-7 w-auto" style={{ width: '135px', height: '26px' }} />
            <div className="where"><b>Etapa 2 de 3</b> Escopo técnico das atividades (metodologia)</div>
          </div>
          <div className="body">
            <h2>Metodologia de engenharia em 5 fases</h2>
            <div className="band">
              <div>
                <b>Cinco fases sequenciais, da vistoria à ART</b>
                <span>Inspeção in loco, checklists normativos, instrumentação, laudo e homologação técnica.</span>
              </div>
              <em>Engenharia diagnóstica</em>
            </div>

            <div style={{ marginTop: '2mm' }}>
              <div className="ph">
                <div className="no"><small>Fase</small>01</div>
                <div>
                  <div className="hd"><h4>Inspeção visual in loco e diagnóstico preliminar</h4><span className="tag">Vistoria de campo</span></div>
                  <p>Vistoria presencial minuciosa do ativo para mapeamento visual de não-conformidades de segurança, desgastes mecânicos, corrosão, fixações e análise física do ambiente operacional.</p>
                  <div className="dl"><svg viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg><span><b>Entregável:</b> levantamento fotográfico em alta resolução e registro de evidências fáticas.</span></div>
                </div>
              </div>

              <div className="ph">
                <div className="no"><small>Fase</small>02</div>
                <div>
                  <div className="hd"><h4>Aplicação de checklists normativos técnicos</h4><span className="tag">Conformidade legal</span></div>
                  <p>Auditoria item por item das exigências regulamentadoras vigentes ({normasTecnicas}), analisando integridade mecânica, proteções físicas, fixações e diretrizes de segurança aplicáveis.</p>
                  <div className="dl"><svg viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg><span><b>Entregável:</b> relatório de conformidade item a item conforme normas ABNT e NRs federais.</span></div>
                </div>
              </div>

              <div className="ph">
                <div className="no"><small>Fase</small>03</div>
                <div>
                  <div className="hd"><h4>Ensaios físicos, medições e testes funcionais</h4><span className="tag">Instrumentado</span></div>
                  <p>Ensaios não destrutivos cabíveis, testes funcionais de operação e segurança, medições técnicas instrumentadas com equipamentos calibrados e rastreáveis RBC/Inmetro.</p>
                  <div className="dl"><svg viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg><span><b>Entregável:</b> planilha de grandezas medidas com instrumentos calibrados e rastreáveis RBC/Inmetro.</span></div>
                </div>
              </div>

              <div className="ph">
                <div className="no"><small>Fase</small>04</div>
                <div>
                  <div className="hd"><h4>Dossiê técnico, matriz de risco e parecer conclusivo</h4><span className="tag">Engenharia diagnóstica</span></div>
                  <p>Elaboração de laudo pericial detalhado contendo memorial técnico descritivo, classificação de risco, plano de ação corretivo claro e conclusões periciais fundamentadas.</p>
                  <div className="dl"><svg viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg><span><b>Entregável:</b> laudo pericial conclusivo digital em PDF com assinatura eletrônica e certificado digital.</span></div>
                </div>
              </div>

              <div className="ph">
                <div className="no"><small>Fase</small>05</div>
                <div>
                  <div className="hd"><h4>Emissão e registro oficial da ART CREA-PE</h4><span className="tag">Homologação legal</span></div>
                  <p>Anotação de Responsabilidade Técnica emitida eletronicamente junto ao CREA-PE, conferindo fé pública, respaldo institucional e plena validade jurídica perante fiscalizações e órgãos reguladores.</p>
                  <div className="dl"><svg viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg><span><b>Entregável:</b> ART oficial registrada e quitada perante o CREA-PE, com número e link de autenticidade.</span></div>
                </div>
              </div>
            </div>

            <div className="blk tight" style={{ marginTop: '2.5mm' }}>
              <h3>Informações técnicas operacionais e diretrizes</h3>
              <table className="kv wide">
                <tbody>
                  <tr><th>Ativos inspecionados</th><td>{ativosDescricao}</td></tr>
                  <tr><th>Horas de engenharia</th><td>{orcamento.horasEngenharia || '16 horas técnicas estimadas (vistoria, análise de dados e redação pericial)'}</td></tr>
                  <tr><th>Mobilização</th><td>{orcamento.mobilizacao || 'Imediata em até 48 horas úteis após a aprovação da proposta'}</td></tr>
                  <tr><th>Condições de acesso</th><td className="t">Disponibilização de acesso desimpedido aos equipamentos, acompanhamento de responsável operacional e fornecimento de manuais/prontuários preexistentes.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg">
            <div><span className="k">Contratante</span><span className="v">{clienteNome}</span></div>
            <div><span className="k">Proposta</span><span className="v">{codigo}</span></div>
            <div><span className="k">Rev.</span><span className="v">{revisao}</span></div>
            <div><span className="k">Emissão</span><span className="v">{emitidaEm}</span></div>
            <div><span className="k">Válida até</span><span className="v">{validaAte}</span></div>
            <div><span className="k">Folha</span><span className="v">3 / {totalFolhas}</span></div>
          </div>
          <div className="ft">
            <span>{DADOS_VL_PADRAO.razaoSocial}<em style={{ fontStyle: 'normal' }}>{DADOS_VL_PADRAO.sede}</em></span>
            <span>
              <a href={`https://wa.me/${DADOS_VL_PADRAO.telefoneLink}`}>{DADOS_VL_PADRAO.telefone}</a>
              <a href={`mailto:${DADOS_VL_PADRAO.email}`}>{DADOS_VL_PADRAO.email}</a>
            </span>
          </div>
        </section>

        {/* ============================ FOLHA 4: ETAPA 3 ============================ */}
        <section className="sheet" id="p4">
          <div className="rh">
            <VlLogoVector className="h-7 w-auto" style={{ width: '135px', height: '26px' }} />
            <div className="where"><b>Etapa 3 de 3</b> Prazo, pagamento e investimento comercial</div>
          </div>
          <div className="body">
            <h2>Prazo, pagamento e investimento</h2>

            <div className="blk tight">
              <table className="memo">
                <thead>
                  <tr>
                    <th style={{ width: '11mm' }}>Item</th>
                    <th>Memorial de cálculo: descrição do ativo / serviço técnico</th>
                    <th className="r" style={{ width: '14mm' }}>Qtd.</th>
                    <th className="r" style={{ width: '26mm' }}>Unitário</th>
                    <th className="r" style={{ width: '28mm' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {itensCalculo.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td>{String(idx + 1).padStart(2, '0')}</td>
                      <td>{item.descricao}</td>
                      <td className="r">{item.quantidade}</td>
                      <td className="r">{(item.valorUnitario || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      <td className="r"><b>{(item.valorTotal || ((item.valorUnitario || 0) * (item.quantidade || 1))).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2} className="lab">
                      Investimento total líquido
                      <span>{orcamento.incluiNotaFiscal !== false ? 'Com emissão de nota fiscal (NFS-e) e taxa de ART inclusas.' : 'Com Recibo de prestação autônoma e taxa de ART inclusa.'} Deslocamento e laudo completo incluídos.</span>
                    </td>
                    <td colSpan={3} className="r tot">{valorTotalFormatado}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="blk tight">
              <div className="cond">
                <div>
                  <span className="k">Prazo de execução</span>
                  <b>{prazoEntrega}</b>
                  <p>Contados a partir da vistoria in loco.</p>
                </div>
                <div>
                  <span className="k">Condições de pagamento</span>
                  <b>50% na aprovação, 50% na entrega</b>
                  <p>Os 50% finais após a emissão do laudo técnico pericial e o registro da ART junto ao CREA-PE. PIX, transferência ou boleto.</p>
                </div>
                <div>
                  <span className="k">Validade da proposta</span>
                  <b>{validadeDias} dias corridos</b>
                  <p>Até {validaAte}. Garantia de valores e disponibilidade de agenda.</p>
                </div>
              </div>
              <table className="inst">
                <thead>
                  <tr>
                    <th style={{ width: '16mm' }}>Parcela</th>
                    <th>Quando</th>
                    <th className="r" style={{ width: '12mm' }}>%</th>
                    <th className="r" style={{ width: '28mm' }}>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {parcelas.map((parc, i) => (
                    <tr key={i}>
                      <td>{parc.parcela}</td>
                      <td className="t">{parc.quando}</td>
                      <td className="r">{parc.percentual}%</td>
                      <td className="r">{(parc.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="blk tight">
              <h3>Cronograma executivo</h3>
              <div className="tl">
                <div className="rail"></div>
                <ol>
                  <li><i></i><b>Dia 0</b><span>Aprovação e pagamento da 1ª parcela</span></li>
                  <li><i></i><b>Até 48 h úteis</b><span>Mobilização e agendamento da vistoria</span></li>
                  <li><i></i><b>Vistoria in loco</b><span>Inspeção, medições e ensaios</span></li>
                  <li><i></i><b>Até {prazoEntrega}</b><span>Laudo conclusivo e ART registrada, contados da vistoria</span></li>
                  <li><i></i><b>Entrega</b><span>Pagamento da 2ª parcela</span></li>
                </ol>
              </div>
            </div>

            <div className="blk tight">
              <div className="pix">
                <div className="qr" dangerouslySetInnerHTML={{ __html: qrCodeSvg }} />
                <div>
                  <h4>PIX Oficial para Pagamento da 1ª Parcela (50%)</h4>
                  <div className="kv2">
                    <div>Chave PIX (CPF): <b>102.870.934-09</b> &nbsp;|&nbsp; Titular: <b>{DADOS_VL_PADRAO.pixTitular}</b></div>
                    <div>Instituição: <b>Banco Cora SCD (403)</b> &nbsp;|&nbsp; Valor da 1ª Parcela: <b>{(parcelas[0]?.valor || (valorTotalNum / 2)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b></div>
                  </div>
                  <div className="code" title="Clique para copiar o código Pix Copia e Cola" onClick={handleCopiarPix}>
                    {pixPayload || '00020126330014br.gov.bcb.pix0111102870934095204000053039865802BR5925VITOR LEONARDO CORDEIRO L6006RECIFE62070503***63043BD0'}
                  </div>
                  {copiadoPix && (
                    <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Código Pix Copia e Cola copiado com sucesso!</span>
                  )}
                </div>
              </div>
            </div>

            <div className="blk tight">
              <h3>Aceite da proposta e assinaturas</h3>
              <div className="sign">
                <div>
                  <div className="line"></div>
                  <b>{DADOS_VL_PADRAO.responsavelTecnico}</b>
                  <span className="n">{DADOS_VL_PADRAO.razaoSocial}</span>
                  <span className="m">Engenheiro Mecânico Responsável Técnico • CREA-PE {DADOS_VL_PADRAO.crea}</span>
                  <span className="dt">Data de emissão: {emitidaEm}</span>
                </div>
                <div>
                  <div className="line"></div>
                  <b>{representanteNome}</b>
                  <span className="n">{clienteNome}</span>
                  <span className="m">CNPJ/CPF: {cnpjCliente}</span>
                  <span className="dt">Data de aprovação: _____ / _____ / _________</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg">
            <div><span className="k">Contratante</span><span className="v">{clienteNome}</span></div>
            <div><span className="k">Proposta</span><span className="v">{codigo}</span></div>
            <div><span className="k">Rev.</span><span className="v">{revisao}</span></div>
            <div><span className="k">Emissão</span><span className="v">{emitidaEm}</span></div>
            <div><span className="k">Válida até</span><span className="v">{validaAte}</span></div>
            <div><span className="k">Folha</span><span className="v">4 / {totalFolhas}</span></div>
          </div>
          <div className="ft">
            <span>{DADOS_VL_PADRAO.razaoSocial}<em style={{ fontStyle: 'normal' }}>{DADOS_VL_PADRAO.sede}</em></span>
            <span>
              <a href={`https://wa.me/${DADOS_VL_PADRAO.telefoneLink}`}>{DADOS_VL_PADRAO.telefone}</a>
              <a href={`mailto:${DADOS_VL_PADRAO.email}`}>{DADOS_VL_PADRAO.email}</a>
            </span>
          </div>
        </section>

        {/* ============================ FOLHAS 5 & 6: ANEXO INSTITUCIONAL ============================ */}
        {modo === 'completa' && (
          <>
            {/* FOLHA 5 */}
            <section className="sheet" id="p5">
              <div className="rh">
                <VlLogoVector className="h-7 w-auto" style={{ width: '135px', height: '26px' }} />
                <div className="where"><b>Anexo institucional</b> Sobre a VL Engenharia • Parte 1</div>
              </div>
              <div className="body">
                <h2>Sobre a VL Engenharia Mecânica</h2>

                <div className="bio">
                  <img src="/vitor-leonardo.png" alt="Eng. Vitor Leonardo" />
                  <div>
                    <h4>{DADOS_VL_PADRAO.responsavelTecnico}</h4>
                    <div className="role">Engenheiro Mecânico Responsável Técnico • CREA-PE {DADOS_VL_PADRAO.crea}</div>
                    <p>Graduado em Engenharia Mecânica com registro regular ativo no Conselho Regional de Engenharia e Agronomia de Pernambuco (CREA-PE). Especialista em engenharia diagnóstica, laudos periciais mecânicos, adequação a Normas Regulamentadoras federais (NR-11, NR-12, NR-13), projetos de climatização (PMOC), prevenção contra incêndio e ensaios não destrutivos.</p>
                    <ul className="chk ok">
                      <li><svg viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>Emissão Oficial de ART com fé pública</li>
                      <li><svg viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>Conformidade irrestrita ABNT / NRs</li>
                      <li><svg viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>Engenharia diagnóstica preventiva</li>
                      <li><svg viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>Respaldo jurídico-pericial conclusivo</li>
                    </ul>
                  </div>
                </div>

                <div className="quote">
                  “Contribuir para um ambiente operacional mais seguro, eficiente e juridicamente protegido, combinando rigor técnico pericial com agilidade e ética profissional inegociável.”
                </div>

                <div className="blk tight">
                  <h3>Nossos princípios inegociáveis</h3>
                  <div className="g2">
                    <div className="it">
                      <h4>1. Rigor normativo absoluto</h4>
                      <p>Nossos laudos são elaborados com base estrita nas normas ABNT, ISO e NRs federais vigentes, garantindo blindagem pericial contra autuações e sinistros.</p>
                    </div>
                    <div className="it">
                      <h4>2. Agilidade com compromisso</h4>
                      <p>Respeitamos cronogramas de forma inegociável. Entregamos vistorias e pareceres periciais no prazo para que suas operações nunca fiquem paralisadas.</p>
                    </div>
                    <div className="it">
                      <h4>3. Clareza e praticidade</h4>
                      <p>Transformamos termos técnicos complexos em planos de ação claros, indicando exatamente o que fazer, como fazer e as prioridades de intervenção.</p>
                    </div>
                    <div className="it">
                      <h4>4. Parceria e suporte contínuo</h4>
                      <p>Acompanhamos a implementação das adequações, oferecendo suporte consultivo pós-emissão de laudo para garantir sua tranquilidade técnica contínua.</p>
                    </div>
                  </div>
                </div>

                <div className="blk tight">
                  <h3>O que entregamos em cada projeto</h3>
                  <div className="g2">
                    <div className="it">
                      <h4>Segurança operacional com ART</h4>
                      <p>Atestamos a segurança física de seus colaboradores e instalações, eliminando riscos de interdições de pátio e acidentes de trabalho graves.</p>
                    </div>
                    <div className="it">
                      <h4>Economia inteligente e assertiva</h4>
                      <p>Adequações desenhadas com melhor relação custo-benefício, evitando trocas desnecessárias de maquinário e gastos desordenados.</p>
                    </div>
                    <div className="it">
                      <h4>Conformidade legal e trabalhista</h4>
                      <p>Documentação pericial robusta para apresentação imediata ao Ministério do Trabalho, Corpo de Bombeiros, seguradoras e auditorias ISO.</p>
                    </div>
                    <div className="it">
                      <h4>Valorização patrimonial do ativo</h4>
                      <p>Manutenção da vida útil de seus equipamentos, conservando o valor contábil dos ativos e garantindo histórico de manutenção rastreável.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg">
                <div><span className="k">Contratante</span><span className="v">{clienteNome}</span></div>
                <div><span className="k">Proposta</span><span className="v">{codigo}</span></div>
                <div><span className="k">Rev.</span><span className="v">{revisao}</span></div>
                <div><span className="k">Emissão</span><span className="v">{emitidaEm}</span></div>
                <div><span className="k">Válida até</span><span className="v">{validaAte}</span></div>
                <div><span className="k">Folha</span><span className="v">5 / 6</span></div>
              </div>
              <div className="ft">
                <span>{DADOS_VL_PADRAO.razaoSocial}<em style={{ fontStyle: 'normal' }}>{DADOS_VL_PADRAO.sede}</em></span>
                <span>
                  <a href={`https://wa.me/${DADOS_VL_PADRAO.telefoneLink}`}>{DADOS_VL_PADRAO.telefone}</a>
                  <a href={`mailto:${DADOS_VL_PADRAO.email}`}>{DADOS_VL_PADRAO.email}</a>
                </span>
              </div>
            </section>

            {/* FOLHA 6 */}
            <section className="sheet" id="p6">
              <div className="rh">
                <VlLogoVector className="h-7 w-auto" style={{ width: '135px', height: '26px' }} />
                <div className="where"><b>Anexo institucional</b> Soluções de engenharia e atendimento</div>
              </div>
              <div className="body">
                <h2>Problemas que ajudamos a resolver</h2>
                <div className="blk tight">
                  <div className="pb">
                    <h4>Multas e autuações</h4>
                    <p>Adequação preventiva completa para evitar sanções severas do Ministério do Trabalho, Vigilância Sanitária e CBMPE.</p>
                  </div>
                  <div className="pb">
                    <h4>Riscos de acidentes</h4>
                    <p>Inspeção visual e ensaios não destrutivos instrumentados para neutralizar riscos mecânicos antes que gerem sinistros.</p>
                  </div>
                  <div className="pb">
                    <h4>Interdição e paradas</h4>
                    <p>Elaboração de planos corretivos para reativação imediata de linhas e equipamentos embargados ou reprovados.</p>
                  </div>
                  <div className="pb">
                    <h4>Incerteza e retrabalho</h4>
                    <p>Projetos assertivos de engenharia mecânica para reformas e adequações que solucionam na primeira intervenção técnica.</p>
                  </div>
                </div>

                <div className="blk tight">
                  <h3>Resumo de nossos serviços de engenharia</h3>
                  <div className="sv3">
                    <div className="sv">
                      <div className="cd">12</div>
                      <h4>NR-12 • MÁQUINAS INDUSTRIAIS</h4>
                      <div className="tg">Apreciação de Risco & Laudo</div>
                      <p>Apreciação de riscos (HRN/SIL), inventário técnico, laudos periciais de conformidade mecânica de prensas, tornos e esteiras.</p>
                    </div>
                    <div className="sv">
                      <div className="cd">11</div>
                      <h4>NR-11 • CARGAS E ELEVAÇÃO</h4>
                      <div className="tg">Movimentação & Ensaios</div>
                      <p>Inspeção e laudos de pontes rolantes, guindastes, muncks, empilhadeiras, ensaios não destrutivos (END) e testes de carga.</p>
                    </div>
                    <div className="sv">
                      <div className="cd">13</div>
                      <h4>NR-13 • VASOS & CALDEIRAS</h4>
                      <div className="tg">Pressão & Prontuários</div>
                      <p>Inspeção de compressores e vasos sob pressão, teste hidrostático, medição de espessura por ultrassom e calibração de PSV.</p>
                    </div>
                    <div className="sv">
                      <div className="cd">AC</div>
                      <h4>PMOC • CLIMATIZAÇÃO</h4>
                      <div className="tg">Lei 13.589/2018 & ANVISA</div>
                      <p>Plano de Manutenção Operação e Controle para qualidade do ar interior, eficiência e total conformidade sanitária.</p>
                    </div>
                    <div className="sv">
                      <div className="cd">PJ</div>
                      <h4>PERÍCIAS & ASSISTÊNCIA</h4>
                      <div className="tg">Engenharia Diagnóstica Legal</div>
                      <p>Investigação pericial de acidentes mecânicos, vistorias cautelares de vizinhança industrial, quesitos e laudos judiciais.</p>
                    </div>
                    <div className="sv">
                      <div className="cd">ART</div>
                      <h4>PROJETOS & ADEQUAÇÕES</h4>
                      <div className="tg">Soluções Mecânicas Integradas</div>
                      <p>Dimensionamento de proteções físicas, cálculo de estruturas metálicas, dispositivos mecânicos de segurança e linhas de vida.</p>
                    </div>
                  </div>
                </div>

                <div className="thanks">
                  <div className="th">
                    <b>Agradecemos a confiança em nossa engenharia</b>
                    <span className="tg">Eng. Vitor Leonardo Cordeiro Linhares • CREA-PE {DADOS_VL_PADRAO.crea}</span>
                  </div>
                  <p>Estamos à disposição para esclarecer qualquer dúvida sobre esta proposta técnico-comercial. Nosso compromisso é entregar excelência técnica, agilidade e total conformidade regulatória para sua empresa.</p>
                </div>

                <div className="blk tight">
                  <h3>Canais de atendimento direto</h3>
                  <div className="ct">
                    <div>
                      <span className="k">WhatsApp / Plantão</span>
                      <b>(81) 98444-2592</b>
                      <span className="sub">Atendimento imediato</span>
                      <p>Para dúvidas técnicas e agendamento de vistorias.</p>
                    </div>
                    <div>
                      <span className="k">Telefone Direto</span>
                      <b>(81) 98444-2592</b>
                      <span className="sub">Eng. Vitor Leonardo</span>
                      <p>Ligação direta com o responsável técnico.</p>
                    </div>
                    <div>
                      <span className="k">E-mail Comercial</span>
                      <b>atendimento@</b>
                      <span className="sub">vlengenhariamecanica.com.br</span>
                      <p>Envio de documentações e faturamento.</p>
                    </div>
                    <div>
                      <span className="k">Atendimento Presencial</span>
                      <b>Recife e Região</b>
                      <span className="sub">Pernambuco</span>
                      <p>Vistoria técnica presencial in loco em todo o estado.</p>
                    </div>
                  </div>
                </div>

                <div className="gr">
                  <div>
                    <b>ART REGISTRADA</b>
                    <span>Emissão e homologação oficial perante o CREA-PE</span>
                  </div>
                  <div>
                    <b>NORMAS ABNT & NRs</b>
                    <span>Conformidade irrestrita com NR-11, NR-12, NR-13 e NBRs</span>
                  </div>
                  <div>
                    <b>SIGILO & LGPD</b>
                    <span>Custódia segura e sigilo de dados industriais</span>
                  </div>
                </div>
              </div>

              <div className="lg">
                <div><span className="k">Contratante</span><span className="v">{clienteNome}</span></div>
                <div><span className="k">Proposta</span><span className="v">{codigo}</span></div>
                <div><span className="k">Rev.</span><span className="v">{revisao}</span></div>
                <div><span className="k">Emissão</span><span className="v">{emitidaEm}</span></div>
                <div><span className="k">Válida até</span><span className="v">{validaAte}</span></div>
                <div><span className="k">Folha</span><span className="v">6 / 6</span></div>
              </div>
              <div className="ft">
                <span>{DADOS_VL_PADRAO.razaoSocial}<em style={{ fontStyle: 'normal' }}>{DADOS_VL_PADRAO.sede}</em></span>
                <span>
                  <a href={`https://wa.me/${DADOS_VL_PADRAO.telefoneLink}`}>{DADOS_VL_PADRAO.telefone}</a>
                  <a href={`mailto:${DADOS_VL_PADRAO.email}`}>{DADOS_VL_PADRAO.email}</a>
                </span>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};
