import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileSpreadsheet, 
  Plus, 
  DollarSign, 
  Eye, 
  CheckCircle2, 
  X, 
  Printer, 
  ArrowRight,
  Clock,
  Send,
  Building,
  Trash2,
  Edit,
  Search,
  Sparkles,
  Layers,
  FileText,
  SlidersHorizontal,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Orcamento } from '../../types';
import { PropostaViewerModal } from './PropostaViewerModal';
import { SERVICOS_LISTA, ServicoItem, SubtipoServico } from '../../data/servicosCatalogo';
import { 
  gerarSecoesPadraoOrcamento, 
  gerarSecoesPadraoOrcamentoV2, 
  DADOS_VL_PADRAO, 
  calcularValidadeAte 
} from '../../lib/orcamentoTemplatePadrao';

export const OrcamentosView: React.FC = () => {
  const { 
    orcamentos, 
    clientes, 
    adicionarOrcamento, 
    atualizarStatusOrcamento,
    removerOrcamento 
  } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [propostaModalOrcamento, setPropostaModalOrcamento] = useState<Orcamento | null>(null);
  const [orcamentoParaExcluir, setOrcamentoParaExcluir] = useState<Orcamento | null>(null);
  const [busca, setBusca] = useState('');

  const [clienteId, setClienteId] = useState(clientes[0]?.id || '');
  const [cnpjCliente, setCnpjCliente] = useState('');
  const [representanteNome, setRepresentanteNome] = useState('');
  const [localidadeServico, setLocalidadeServico] = useState('');
  const [servicoCategoriaId, setServicoCategoriaId] = useState<string>('nr12-projetos');
  const [subtipoSelecionadoId, setSubtipoSelecionadoId] = useState<string>('');
  const [servicoTitulo, setServicoTitulo] = useState('Adequação à NR-12 e projetos mecânicos');
  const [normasTecnicas, setNormasTecnicas] = useState('NR-12 · NBR ISO 12100');
  const [descricaoEscopo, setDescricaoEscopo] = useState('Apreciação de risco, projeto de proteções mecânicas, enclausuramento e documentação técnica oficial.');
  const [prazoDias, setPrazoDias] = useState<number>(7);
  const [validadeDias, setValidadeDias] = useState<number>(15);
  const [valorTotal, setValorTotal] = useState('3500');
  const [condicoesPagamento, setCondicoesPagamento] = useState('50% na aprovação da proposta e 50% após emissão do laudo técnico pericial e registro da ART junto ao CREA-PE.');

  // Preenchimento automático ao selecionar cliente
  useEffect(() => {
    const c = clientes.find(cli => cli.id === clienteId);
    if (c) {
      setCnpjCliente(c.cpfCnpj || c.cnpj || '');
      setRepresentanteNome(c.contatos?.[0]?.nome || 'Diretoria / Coordenação Técnica');
      setLocalidadeServico(c.endereco?.cidade ? `${c.endereco.cidade}/${c.endereco.estado || 'PE'}` : 'Recife e Região Metropolitana - PE');
    }
  }, [clienteId, clientes]);

  // Handle service category change from catalog
  const handleSelectCategoria = (catId: string) => {
    setServicoCategoriaId(catId);
    if (catId === 'personalizado') {
      setSubtipoSelecionadoId('');
      setServicoTitulo('');
      setNormasTecnicas('Resoluções CONFEA/CREA e Normas ABNT aplicáveis');
      setDescricaoEscopo('');
      setValorTotal('2500');
      return;
    }

    const item = SERVICOS_LISTA.find(s => s.id === catId);
    if (item) {
      setServicoTitulo(item.nome);
      setNormasTecnicas(item.norma);
      setDescricaoEscopo(item.descricao);

      // Pre-select first subtipo if available
      if (item.subtipos && item.subtipos.length > 0) {
        const primeiroSub = item.subtipos[0];
        setSubtipoSelecionadoId(primeiroSub.id || '');
        setServicoTitulo(`${item.nome} • ${primeiroSub.nome}`);
        setNormasTecnicas(`${item.norma} · ${primeiroSub.normaRef}`);
        setDescricaoEscopo(primeiroSub.detalhe);
      }
    }
  };

  const handleSelectSubtipo = (subId: string) => {
    setSubtipoSelecionadoId(subId);
    const item = SERVICOS_LISTA.find(s => s.id === servicoCategoriaId);
    if (!item) return;

    const sub = item.subtipos.find(s => s.id === subId);
    if (sub) {
      setServicoTitulo(`${item.nome} • ${sub.nome}`);
      setNormasTecnicas(`${item.norma} · ${sub.normaRef}`);
      setDescricaoEscopo(sub.detalhe);
    }
  };

  const criarPropostaDados = () => {
    const cliente = clientes.find(c => c.id === clienteId);
    const valorNum = parseFloat(valorTotal) || 2500;
    const ano = new Date().getFullYear();
    const codigoProposta = `PROP-${ano}/${String(orcamentos.length + 1).padStart(3, '0')}`;
    const emitidaEm = new Date().toISOString().split('T')[0];
    const validaAte = calcularValidadeAte(emitidaEm, validadeDias);
    const metade = valorNum / 2;

    const orcamentoRascunho: Omit<Orcamento, 'id' | 'criadoEm'> = {
      clienteId,
      clienteNome: cliente?.nomeFantasia || cliente?.razaoSocial || 'Cliente Contratante',
      cnpjCliente: cnpjCliente.trim() || cliente?.cpfCnpj || cliente?.cnpj || '',
      representanteNome: representanteNome.trim() || cliente?.contatos?.[0]?.nome || 'Diretoria / Coordenação Técnica',
      localidadeServico: localidadeServico.trim() || (cliente?.endereco?.cidade ? `${cliente.endereco.cidade}/${cliente.endereco.estado || 'PE'}` : 'Recife e Região Metropolitana - PE'),
      emailCliente: cliente?.contatos?.[0]?.email || 'comercial@cliente.com.br',
      telefoneCliente: cliente?.contatos?.[0]?.telefone || '(81) 98444-2592',
      codigoProposta,
      revisao: '00',
      emitidaEm,
      validaAte,
      layoutVersao: 'v2',
      modoExportacaoPdf: 'completa',
      servico: servicoTitulo.trim() || 'Serviços Especializados de Engenharia Mecânica',
      descricaoEscopo: descricaoEscopo.trim() || 'Vistoria técnica in loco, ensaios não destrutivos e emissão de laudo pericial com ART CREA-PE.',
      status: 'rascunho',
      valor: valorNum,
      valorFormatado: valorNum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      prazoDias,
      prazoEntrega: `${prazoDias} dias úteis`,
      validadeDias,
      condicoesPagamento: condicoesPagamento || '50% na aprovação e 50% após emissão do laudo e ART.',
      normasTecnicas: normasTecnicas || 'ABNT NBR, NR-11, NR-12, NR-13 conforme aplicável',
      incluiNotaFiscal: true,
      chavePix: DADOS_VL_PADRAO.pixChave,
      contratadaCnpj: DADOS_VL_PADRAO.cnpj,
      contratadaNome: DADOS_VL_PADRAO.razaoSocial,
      contratadaResponsavel: DADOS_VL_PADRAO.responsavel,
      contratadaCrea: DADOS_VL_PADRAO.crea,
      contratadaTelefone: DADOS_VL_PADRAO.telefone,
      contratadaEmail: DADOS_VL_PADRAO.email,
      contratadaEndereco: DADOS_VL_PADRAO.endereco,
      contratadaCidade: DADOS_VL_PADRAO.cidade,
      contratadaPixChave: DADOS_VL_PADRAO.pixChave,
      contratadaPixTitular: DADOS_VL_PADRAO.pixTitular,
      contratadaPixCidade: DADOS_VL_PADRAO.pixCidade,
      itensCalculo: [
        {
          id: 'item-1',
          descricao: servicoTitulo.trim() || 'Serviços Especializados de Engenharia Mecânica',
          quantidade: 1,
          valorUnitario: valorNum,
          valorTotal: valorNum,
        }
      ],
      parcelas: [
        { parcela: '1ª', quando: 'Na aprovação da proposta comercial', percentual: 50, valor: metade },
        { parcela: '2ª', quando: 'Após emissão do laudo técnico pericial e registro da ART no CREA-PE', percentual: 50, valor: metade }
      ],
      cronograma: [
        { marco: 'Alinhamento & Análise de Documentação Técnica', prazo: 'D+1', responsavel: 'VL & Contratante' },
        { marco: 'Inspeção Técnica In Loco e Ensaios Não Destrutivos', prazo: 'D+3 a D+4', responsavel: 'Eng. Vitor Leonardo' },
        { marco: 'Análise de Conformidade e Memoriais de Cálculo', prazo: 'D+5', responsavel: 'Corpo Técnico VL' },
        { marco: 'Emissão de Laudo Preliminar para Validação', prazo: 'D+6', responsavel: 'Engenheiro Mecânico' },
        { marco: 'Protocolo da ART CREA-PE & Entrega Oficial do Laudo', prazo: `D+${prazoDias}`, responsavel: 'VL Engenharia' }
      ]
    };

    // Gera as 6 seções do Modelo Base Aprovado (v2)
    orcamentoRascunho.secoes = gerarSecoesPadraoOrcamentoV2(orcamentoRascunho as Orcamento, { cliente });

    const idCriado = adicionarOrcamento(orcamentoRascunho);
    return { id: idCriado, ...orcamentoRascunho, criadoEm: new Date().toISOString() } as Orcamento;
  };

  const handleCriarEVisualizarPdf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!servicoTitulo.trim()) return;
    const orcamentoCriado = criarPropostaDados();
    setModalNovoAberto(false);
    setPropostaModalOrcamento(orcamentoCriado);
  };

  const handleCriarEAbrirEditor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!servicoTitulo.trim()) return;
    const orcamentoCriado = criarPropostaDados();
    setModalNovoAberto(false);
    navigate(`/admin/orcamentos/${orcamentoCriado.id}`);
  };

  const handleCriarPropostaApenas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!servicoTitulo.trim()) return;
    criarPropostaDados();
    setModalNovoAberto(false);
  };

  // Filter orcamentos by search query
  const orcamentosFiltrados = useMemo(() => {
    if (!busca.trim()) return orcamentos;
    const b = busca.toLowerCase();
    return orcamentos.filter(o => 
      (o.servico && o.servico.toLowerCase().includes(b)) ||
      (o.codigoProposta && o.codigoProposta.toLowerCase().includes(b)) ||
      (o.clienteNome && o.clienteNome.toLowerCase().includes(b)) ||
      (o.descricaoEscopo && o.descricaoEscopo.toLowerCase().includes(b))
    );
  }, [orcamentos, busca]);

  // Categorize orcamentos into 4 columns: Novos, Enviados, Aprovados, Recusados
  const colNovos = orcamentosFiltrados.filter(o => o.status === 'rascunho' || !o.status);
  const colEnviados = orcamentosFiltrados.filter(o => o.status === 'enviado');
  const colAprovados = orcamentosFiltrados.filter(o => o.status === 'aprovado');
  const colRecusados = orcamentosFiltrados.filter(o => o.status === 'recusado');

  const renderOrcamentoCard = (orcamento: Orcamento) => {
    const cliente = clientes.find(c => c.id === orcamento.clienteId);
    const valorFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orcamento.valor || 0);

    return (
      <div 
        key={orcamento.id}
        className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-3.5 space-y-2.5 shadow-xs hover:border-[var(--blue)] transition-colors cursor-pointer group"
        onClick={() => setPropostaModalOrcamento(orcamento)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span className="inline-block px-2 py-0.5 rounded text-[10.5px] font-mono font-bold bg-[#1565D8]/10 text-[#1565D8] border border-[#1565D8]/20 mb-1">
              {orcamento.codigoProposta || orcamento.id}
            </span>
            <b className="font-[family-name:var(--d)] font-bold text-[14.5px] text-[var(--ink)] block leading-snug">
              {orcamento.servico || 'Proposta Técnica'}
            </b>
          </div>
        </div>

        <div className="text-[12.5px] text-[var(--muted)] flex items-center justify-between">
          <span className="truncate">{cliente?.nomeFantasia || cliente?.razaoSocial || orcamento.clienteNome || 'Cliente'}</span>
          {orcamento.normasTecnicas && (
            <span className="text-[10px] font-mono text-[var(--muted)] truncate max-w-[110px]" title={orcamento.normasTecnicas}>
              {orcamento.normasTecnicas.split('·')[0].trim()}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-1.5 border-t border-[var(--line)] text-[13.5px]">
          <span className="font-black font-[family-name:var(--d)] text-[var(--blue)]">
            {valorFormatado}
          </span>
          <span className="text-[11px] text-[var(--muted)] font-mono">
            {new Date(orcamento.criadoEm || Date.now()).toLocaleDateString('pt-BR')}
          </span>
        </div>

        {/* Quick actions row */}
        <div className="pt-1.5 flex items-center justify-between gap-1.5" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPropostaModalOrcamento(orcamento)}
              className="p-1.5 rounded-lg text-[#1565D8] hover:bg-[#1565D8]/10 transition-colors"
              title="Visualizar e Baixar Proposta em PDF (13 Páginas)"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => navigate(`/admin/orcamentos/${orcamento.id}`)}
              className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50 transition-colors"
              title="Editar todas as 13 seções no editor rico"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setOrcamentoParaExcluir(orcamento)}
              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50/30 transition-colors cursor-pointer"
              title="Excluir este orçamento definitivamente"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <select
            value={orcamento.status || 'rascunho'}
            onChange={(e) => atualizarStatusOrcamento(orcamento.id, e.target.value as any)}
            className="text-[11px] py-1 px-2 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] font-semibold"
          >
            <option value="rascunho">Novo / Rascunho</option>
            <option value="enviado">Enviado</option>
            <option value="aprovado">Aprovado</option>
            <option value="recusado">Recusado</option>
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-[1240px]">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight">
              Orçamentos & Propostas Comerciais
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1565D8]/10 text-[#1565D8] border border-[#1565D8]/20">
              13 Páginas A4 • PDF Oficial
            </span>
          </div>
          <p className="text-[var(--muted)] text-[14.5px] sm:text-[15.5px] mt-0.5">
            Do primeiro contato comercial à aprovação, pagamento via PIX e emissão da ART CREA-PE.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setModalNovoAberto(true)}
            className="btn-tech pri text-[14px] px-4 py-2 shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nova proposta comercial</span>
          </button>
        </div>
      </div>

      {/* System Highlights Banner */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-[var(--line)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-[var(--muted)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1565D8]/10 text-[#1565D8] flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-[var(--ink)] block text-[13px]">
              Geração Completa de Propostas em 13 Páginas Padronizadas
            </strong>
            <span>
              Inclui Capa com dados do cliente, Catálogo de laudos, Metodologia em 5 fases, Tabela de investimento, QR Code PIX e Contrato.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="inline-flex items-center gap-1 font-mono text-[var(--ink)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1565D8]" />
            CREA-PE 182229949-0
          </span>
          <span className="text-[var(--line)]">|</span>
          <span className="font-semibold text-[#1565D8]">
            {orcamentos.length} propostas cadastradas
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por proposta, cliente ou serviço..."
            className="w-full pl-9 pr-3 py-2 text-[14px] border border-[var(--line)] rounded-xl bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)] shadow-2xs"
          />
        </div>
        {busca && (
          <button
            type="button"
            onClick={() => setBusca('')}
            className="text-xs text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
          >
            Limpar busca
          </button>
        )}
      </div>

      {/* 4-column Kanban Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        
        {/* Coluna 1: Novos */}
        <div className="bg-[var(--paper)] border border-[var(--line)] rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-[var(--line)]">
            <h3 className="font-[family-name:var(--d)] font-bold text-[15px] text-[var(--ink)]">
              Novos
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--card)] border border-[var(--line)] text-[var(--muted)]">
              {colNovos.length}
            </span>
          </div>

          <div className="space-y-2.5 min-h-[140px]">
            {colNovos.map(renderOrcamentoCard)}
            {colNovos.length === 0 && (
              <p className="text-[var(--muted)] text-xs text-center py-8">Nenhum orçamento novo.</p>
            )}
          </div>
        </div>

        {/* Coluna 2: Enviados */}
        <div className="bg-[var(--paper)] border border-[var(--line)] rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-[var(--line)]">
            <h3 className="font-[family-name:var(--d)] font-bold text-[15px] text-[var(--ink)]">
              Enviados
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--card)] border border-[var(--line)] text-[var(--muted)]">
              {colEnviados.length}
            </span>
          </div>

          <div className="space-y-2.5 min-h-[140px]">
            {colEnviados.map(renderOrcamentoCard)}
            {colEnviados.length === 0 && (
              <p className="text-[var(--muted)] text-xs text-center py-8">Nenhuma proposta enviada.</p>
            )}
          </div>
        </div>

        {/* Coluna 3: Aprovados */}
        <div className="bg-[var(--paper)] border border-[var(--line)] rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-[var(--line)]">
            <h3 className="font-[family-name:var(--d)] font-bold text-[15px] text-emerald-600 dark:text-emerald-400">
              Aprovados
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--card)] border border-[var(--line)] text-emerald-600 dark:text-emerald-400 font-bold">
              {colAprovados.length}
            </span>
          </div>

          <div className="space-y-2.5 min-h-[140px]">
            {colAprovados.map(renderOrcamentoCard)}
            {colAprovados.length === 0 && (
              <p className="text-[var(--muted)] text-xs text-center py-8">Nenhum orçamento aprovado ainda.</p>
            )}
          </div>
        </div>

        {/* Coluna 4: Recusados */}
        <div className="bg-[var(--paper)] border border-[var(--line)] rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-[var(--line)]">
            <h3 className="font-[family-name:var(--d)] font-bold text-[15px] text-[var(--muted)]">
              Recusados
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--card)] border border-[var(--line)] text-[var(--muted)]">
              {colRecusados.length}
            </span>
          </div>

          <div className="space-y-2.5 min-h-[140px]">
            {colRecusados.map(renderOrcamentoCard)}
            {colRecusados.length === 0 && (
              <p className="text-[var(--muted)] text-xs text-center py-8">Nada por aqui.</p>
            )}
          </div>
        </div>

      </div>

      {/* Modal Nova Proposta Comercial Rica (Completa com 13 Seções) */}
      {modalNovoAberto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[rgba(5,14,28,0.75)] backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[var(--card)] text-[var(--ink)] border-[1.5px] border-[var(--line)] rounded-2xl w-full max-w-2xl p-6 space-y-5 shadow-2xl my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[var(--line)]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#1565D8]/10 text-[#1565D8] border border-[#1565D8]/20">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-[19px] font-bold text-[var(--ink)]">
                    Gerador de Proposta Técnico-Comercial
                  </h2>
                  <p className="text-xs text-[var(--muted)]">
                    Emissão oficial padronizada em 13 páginas A4 com cálculo automático e ART CREA-PE
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalNovoAberto(false)}
                className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCriarEVisualizarPdf} className="space-y-4">
              
              {/* Row 1: Cliente & Categoria de Serviço */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <label className="block text-xs font-bold text-[var(--ink)]">
                  <span className="mb-1 block">Cliente Contratante</span>
                  <select
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                    className="w-full p-2.5 text-sm border border-[var(--line)] rounded-xl bg-[var(--paper)] text-[var(--ink)]"
                  >
                    {clientes.map(c => (
                      <option key={c.id} value={c.id}>{c.nomeFantasia || c.razaoSocial}</option>
                    ))}
                  </select>
                </label>

                <label className="block text-xs font-bold text-[var(--ink)]">
                  <span className="mb-1 block">Catálogo Oficial de Serviços</span>
                  <select
                    value={servicoCategoriaId}
                    onChange={(e) => handleSelectCategoria(e.target.value)}
                    className="w-full p-2.5 text-sm border border-[var(--line)] rounded-xl bg-[var(--paper)] text-[var(--ink)]"
                  >
                    {SERVICOS_LISTA.map(s => (
                      <option key={s.id} value={s.id}>{s.nome} ({s.norma})</option>
                    ))}
                    <option value="personalizado">Outro serviço (Personalizado)</option>
                  </select>
                </label>
              </div>

              {/* Bloco Automático: CNPJ/CPF e Principal Contato vinculados ao Cliente */}
              <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-[var(--blue)] flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5" />
                    <span>Dados do Contratante (Preenchimento Automático)</span>
                  </span>
                  <span className="text-[11px] text-[var(--muted)]">Vinculado ao cadastro do cliente</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block text-xs font-semibold text-[var(--ink)]">
                    <span className="mb-1 block text-[11px] text-[var(--muted)]">CNPJ / CPF na Proposta</span>
                    <input
                      type="text"
                      value={cnpjCliente}
                      onChange={(e) => setCnpjCliente(e.target.value)}
                      placeholder="Preenchido automaticamente do cliente..."
                      className="w-full p-2 text-xs font-mono font-bold border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                    />
                  </label>

                  <label className="block text-xs font-semibold text-[var(--ink)]">
                    <span className="mb-1 block text-[11px] text-[var(--muted)]">Principal Contato / Representante</span>
                    <input
                      type="text"
                      value={representanteNome}
                      onChange={(e) => setRepresentanteNome(e.target.value)}
                      placeholder="Nome do responsável técnico ou contratante..."
                      className="w-full p-2 text-xs border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                    />
                  </label>
                </div>
              </div>

              {/* Subtipo do Serviço Selecionado (se houver) */}
              {servicoCategoriaId !== 'personalizado' && (() => {
                const item = SERVICOS_LISTA.find(s => s.id === servicoCategoriaId);
                if (!item || !item.subtipos || item.subtipos.length === 0) return null;
                return (
                  <label className="block text-xs font-bold text-[var(--ink)]">
                    <span className="mb-1 block">Especificação do Subtipo / Laudo</span>
                    <select
                      value={subtipoSelecionadoId}
                      onChange={(e) => handleSelectSubtipo(e.target.value)}
                      className="w-full p-2.5 text-xs sm:text-sm border border-[var(--line)] rounded-xl bg-[var(--paper)] text-[var(--ink)]"
                    >
                      {item.subtipos.map(st => (
                        <option key={st.id || st.nome} value={st.id || st.nome}>
                          {st.nome} — {st.normaRef}
                        </option>
                      ))}
                    </select>
                  </label>
                );
              })()}

              {/* Título do Serviço / Objeto */}
              <label className="block text-xs font-bold text-[var(--ink)]">
                <span className="mb-1 block">Título da Proposta Técnica</span>
                <input
                  type="text"
                  value={servicoTitulo}
                  onChange={(e) => setServicoTitulo(e.target.value)}
                  required
                  placeholder="Ex: Laudo Técnico de Conformidade NR-12 · Prensa Mecânica"
                  className="w-full p-2.5 text-sm border border-[var(--line)] rounded-xl bg-[var(--paper)] text-[var(--ink)]"
                />
              </label>

              {/* Normas Técnicas & Escopo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <label className="block text-xs font-bold text-[var(--ink)]">
                  <span className="mb-1 block">Normas Técnicas Aplicáveis</span>
                  <input
                    type="text"
                    value={normasTecnicas}
                    onChange={(e) => setNormasTecnicas(e.target.value)}
                    required
                    placeholder="Ex: NR-12, ABNT NBR ISO 12100, NBR ISO 13849"
                    className="w-full p-2.5 text-sm border border-[var(--line)] rounded-xl bg-[var(--paper)] text-[var(--ink)]"
                  />
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-xs font-bold text-[var(--ink)]">
                    <span className="mb-1 block">Prazo de entrega</span>
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="1"
                        value={prazoDias}
                        onChange={(e) => setPrazoDias(parseInt(e.target.value) || 7)}
                        className="w-full p-2.5 text-sm border border-[var(--line)] rounded-l-xl bg-[var(--paper)] text-[var(--ink)]"
                      />
                      <span className="px-2.5 py-2.5 border border-l-0 border-[var(--line)] bg-[var(--card)] text-xs text-[var(--muted)] rounded-r-xl">
                        dias
                      </span>
                    </div>
                  </label>

                  <label className="block text-xs font-bold text-[var(--ink)]">
                    <span className="mb-1 block">Validade</span>
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="1"
                        value={validadeDias}
                        onChange={(e) => setValidadeDias(parseInt(e.target.value) || 15)}
                        className="w-full p-2.5 text-sm border border-[var(--line)] rounded-l-xl bg-[var(--paper)] text-[var(--ink)]"
                      />
                      <span className="px-2.5 py-2.5 border border-l-0 border-[var(--line)] bg-[var(--card)] text-xs text-[var(--muted)] rounded-r-xl">
                        dias
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Descrição do Escopo */}
              <label className="block text-xs font-bold text-[var(--ink)]">
                <span className="mb-1 block">Resumo do Escopo das Atividades</span>
                <textarea
                  rows={2}
                  value={descricaoEscopo}
                  onChange={(e) => setDescricaoEscopo(e.target.value)}
                  className="w-full p-2.5 text-xs sm:text-sm border border-[var(--line)] rounded-xl bg-[var(--paper)] text-[var(--ink)] resize-none"
                  placeholder="Detalhamento das fases técnicas da vistoria..."
                />
              </label>

              {/* Valor & Condições de Pagamento */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <label className="block text-xs font-bold text-[var(--ink)]">
                  <span className="mb-1 block">Investimento Total (R$)</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--muted)]">
                      R$
                    </span>
                    <input
                      type="number"
                      step="50"
                      value={valorTotal}
                      onChange={(e) => setValorTotal(e.target.value)}
                      required
                      placeholder="3500"
                      className="w-full pl-9 pr-3 py-2.5 text-sm font-bold border border-[var(--line)] rounded-xl bg-[var(--paper)] text-[var(--ink)]"
                    />
                  </div>
                </label>

                <label className="block text-xs font-bold text-[var(--ink)] sm:col-span-2">
                  <span className="mb-1 block">Condições de Pagamento & PIX</span>
                  <input
                    type="text"
                    value={condicoesPagamento}
                    onChange={(e) => setCondicoesPagamento(e.target.value)}
                    className="w-full p-2.5 text-xs border border-[var(--line)] rounded-xl bg-[var(--paper)] text-[var(--ink)]"
                  />
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalNovoAberto(false)}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
                >
                  Cancelar
                </button>

                <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCriarEAbrirEditor}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl border border-[var(--line)] bg-[var(--card)] hover:bg-[var(--line)]/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="Salvar e editar cada uma das 13 seções no editor rico"
                  >
                    <Edit className="w-3.5 h-3.5 text-[#1565D8]" />
                    <span>Editar 13 Seções</span>
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0B1E3D] hover:bg-[#1565D8] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    title="Gera o orçamento e abre diretamente o visualizador e exportador de PDF"
                  >
                    <Eye className="w-4 h-4 text-[#D4AF37]" />
                    <span>Gerar e Ver PDF Completo</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmação de Exclusão de Orçamento */}
      {orcamentoParaExcluir && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(5,14,28,0.7)] backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[var(--card)] text-[var(--ink)] border-[1.5px] border-[var(--line)] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-[18px] font-bold text-[var(--ink)]">Excluir Orçamento</h2>
                  <p className="text-xs text-[var(--muted)]">Confirmação de exclusão</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOrcamentoParaExcluir(null)}
                className="p-1 rounded text-[var(--muted)] hover:text-[var(--ink)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <p className="text-[var(--ink)]">
                Tem certeza de que deseja excluir permanentemente este orçamento?
              </p>

              <div className="p-3 rounded-lg bg-[var(--paper)] border border-[var(--line)] space-y-1 text-xs">
                <div><strong>Código:</strong> <span className="font-mono">{orcamentoParaExcluir.codigoProposta || orcamentoParaExcluir.id}</span></div>
                <div><strong>Serviço:</strong> {orcamentoParaExcluir.servico}</div>
                <div><strong>Cliente:</strong> {clientes.find(c => c.id === orcamentoParaExcluir.clienteId)?.nomeFantasia || orcamentoParaExcluir.clienteNome || 'Cliente'}</div>
                <div><strong>Valor:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orcamentoParaExcluir.valor || 0)}</div>
                <div><strong>Status:</strong> {orcamentoParaExcluir.status || 'rascunho'}</div>
              </div>

              <p className="text-xs text-rose-500 font-medium">
                Esta ação removerá este orçamento do banco de dados e do painel técnico permanentemente.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={() => setOrcamentoParaExcluir(null)}
                className="btn-tech text-sm px-4 py-2"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  removerOrcamento(orcamentoParaExcluir.id);
                  setOrcamentoParaExcluir(null);
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-colors cursor-pointer shadow-xs"
              >
                Sim, excluir orçamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proposta Viewer Modal (Multi-page PDF export & preview) */}
      {propostaModalOrcamento && (
        <PropostaViewerModal
          isOpen={true}
          orcamento={propostaModalOrcamento}
          onClose={() => setPropostaModalOrcamento(null)}
          onEditarProposta={(orc) => {
            setPropostaModalOrcamento(null);
            navigate(`/admin/orcamentos/${orc.id}`);
          }}
        />
      )}

    </div>
  );
};
