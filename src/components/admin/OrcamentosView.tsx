import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Send, 
  FileText, 
  Printer, 
  X, 
  DollarSign, 
  ArrowRight,
  ShieldCheck,
  Building,
  Sparkles,
  Loader2,
  Eye,
  Trash2,
  Edit3
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Orcamento, PropostaPagina } from '../../types';
import { useNavigate } from 'react-router-dom';
import { PropostaViewerModal } from './PropostaViewerModal';
import { converterPaginasParaSecoes } from '../../lib/orcamentoTemplatePadrao';

export const OrcamentosView: React.FC = () => {
  const { 
    orcamentos, 
    clientes, 
    ativos, 
    adicionarOrcamento, 
    atualizarOrcamento,
    atualizarStatusOrcamento, 
    gerarLaudoFromOrcamento, 
    removerOrcamento,
    registrarUsoIA
  } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [propostaModalOrcamento, setPropostaModalOrcamento] = useState<Orcamento | null>(null);
  const [gerandoPropostaId, setGerandoPropostaId] = useState<string | null>(null);
  const [gerarIAAoCriar, setGerarIAAoCriar] = useState(true);
  const [salvandoNovo, setSalvandoNovo] = useState(false);

  // Form State
  const [clienteId, setClienteId] = useState(clientes[0]?.id || '');
  const [servico, setServico] = useState('Adequação à NR-12');
  const [descricaoEscopo, setDescricaoEscopo] = useState('');
  const [ativoId, setAtivoId] = useState('');
  const [valor, setValor] = useState(3500);
  const [prazoDias, setPrazoDias] = useState(7);
  const [validadeDias, setValidadeDias] = useState(15);
  const [condicoesPagamento, setCondicoesPagamento] = useState('50% na aprovação e 50% após emissão da ART CREA-PE.');

  const isColaborador = currentUser?.role === 'master' || currentUser?.role === 'colaborador';

  const abrirNovo = () => {
    setClienteId(clientes[0]?.id || '');
    setServico('Adequação à NR-12');
    setDescricaoEscopo('');
    setAtivoId('');
    setValor(3500);
    setPrazoDias(7);
    setValidadeDias(15);
    setCondicoesPagamento('50% na aprovação e 50% após emissão da ART CREA-PE.');
    setGerarIAAoCriar(true);
    setModalNovoAberto(true);
  };

  // Generate 13-page proposal using Gemini endpoint
  const gerarPropostaCompletaComIA = async (orc: Orcamento) => {
    setGerandoPropostaId(orc.id);
    try {
      const cliente = clientes.find(c => c.id === orc.clienteId);
      const ativo = ativos.find(a => a.id === orc.ativoId);

      const resp = await fetch('/api/ai/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteNome: orc.clienteNome,
          clienteCnpj: cliente?.cpfCnpj || 'Consulte o contrato',
          cidade: cliente?.endereco?.cidade ? `${cliente.endereco.cidade}/${cliente.endereco.estado}` : 'Recife/PE',
          tipoServico: orc.servico,
          descricaoEscopo: orc.descricaoEscopo || 'Vistoria, ensaios técnicos, cálculo de riscos e emissão de laudo conclusivo com ART.',
          equipamentos: orc.ativoIdentificacao || ativo?.identificacao || 'Conforme especificação do cliente',
          valor: orc.valor,
          prazoDias: orc.prazoDias,
          condicoesPagamento: orc.condicoesPagamento,
          validadeDias: orc.validadeDias || 15,
        }),
      });

      if (!resp.ok) {
        throw new Error('Falha ao comunicar com a API de geração de proposta');
      }

      const data = await resp.json();
      if (data.paginas && Array.isArray(data.paginas)) {
        const secoesConvertidas = converterPaginasParaSecoes(data.paginas);
        atualizarOrcamento(orc.id, {
          paginasProposta: data.paginas,
          secoes: secoesConvertidas,
          propostaGeradaEm: new Date().toISOString(),
          status: orc.status === 'rascunho' ? 'enviado' : orc.status,
        });
        registrarUsoIA('geracao_proposta', 1);
        
        // Update local object in modal if open
        const atualizado = {
          ...orc,
          paginasProposta: data.paginas,
          secoes: secoesConvertidas,
          propostaGeradaEm: new Date().toISOString(),
        };
        setPropostaModalOrcamento(atualizado);
      }
    } catch (err: any) {
      console.error('Erro na geração da proposta:', err);
      alert('Não foi possível gerar a proposta completa com IA: ' + err.message);
    } finally {
      setGerandoPropostaId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvandoNovo(true);
    const cliente = clientes.find(c => c.id === clienteId);
    const ativo = ativos.find(a => a.id === ativoId);

    const novoId = adicionarOrcamento({
      clienteId,
      clienteNome: cliente?.razaoSocial,
      servico,
      descricaoEscopo,
      ativoId: ativoId || undefined,
      ativoIdentificacao: ativo?.identificacao || undefined,
      valor: Number(valor),
      prazoDias: Number(prazoDias),
      validadeDias: Number(validadeDias),
      condicoesPagamento,
      status: 'rascunho',
    });

    if (gerarIAAoCriar) {
      const orcTemporario: Orcamento = {
        id: novoId,
        clienteId,
        clienteNome: cliente?.razaoSocial || 'Cliente',
        servico,
        descricaoEscopo,
        ativoId: ativoId || undefined,
        ativoIdentificacao: ativo?.identificacao || undefined,
        valor: Number(valor),
        prazoDias: Number(prazoDias),
        validadeDias: Number(validadeDias),
        condicoesPagamento,
        status: 'rascunho',
        criadoEm: new Date().toISOString(),
      };
      await gerarPropostaCompletaComIA(orcTemporario);
    }

    setSalvandoNovo(false);
    setModalNovoAberto(false);
  };

  const handleGerarLaudo = (orc: Orcamento) => {
    try {
      const laudoId = gerarLaudoFromOrcamento(orc.id, orc.ativoId);
      navigate(`/admin/laudos/${laudoId}`);
    } catch (err: any) {
      alert('Erro ao gerar laudo: ' + err.message);
    }
  };

  const filtrados = orcamentos.filter(o => {
    const matchBusca = 
      o.servico.toLowerCase().includes(busca.toLowerCase()) ||
      (o.clienteNome && o.clienteNome.toLowerCase().includes(busca.toLowerCase())) ||
      (o.descricaoEscopo && o.descricaoEscopo.toLowerCase().includes(busca.toLowerCase()));
    const matchStatus = filtroStatus === 'todos' || o.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0B1E3D] flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-[#1565D8]" />
            <span>Propostas Comerciais e Orçamentos</span>
          </h2>
          <p className="text-xs text-slate-500">
            Emita orçamentos técnicos com escopo normativo e gere laudos pré-preenchidos com um clique após a aprovação.
          </p>
        </div>

        {isColaborador && (
          <button
            onClick={abrirNovo}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1565D8] hover:bg-[#0b4fb8] text-white font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Proposta Comercial</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por cliente, serviço ou escopo..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1565D8]"
          />
        </div>

        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1565D8]"
        >
          <option value="todos">Todos os Status</option>
          <option value="rascunho">Rascunho</option>
          <option value="enviado">Enviado</option>
          <option value="aprovado">Aprovado</option>
          <option value="recusado">Recusado</option>
        </select>
      </div>

      {/* Proposals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtrados.map((orc) => (
          <div
            key={orc.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    PROPOSTA #{orc.id.slice(-6).toUpperCase()}
                  </span>
                  <h3 className="text-base font-extrabold text-[#0B1E3D] mt-0.5">
                    {orc.servico}
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold">
                    {orc.clienteNome}
                  </p>
                </div>

                {/* Status Badge */}
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  orc.status === 'aprovado'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : orc.status === 'enviado'
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : orc.status === 'recusado'
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-slate-100 text-slate-700 border border-slate-300'
                }`}>
                  {orc.status}
                </span>
              </div>

              {orc.ativoIdentificacao && (
                <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                  Ativo vinculado: <strong className="text-slate-800">{orc.ativoIdentificacao}</strong>
                </div>
              )}

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {orc.descricaoEscopo || 'Escopo conforme requisitos e normas técnicas regulamentadoras.'}
              </p>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Valor Total:</span>
                  <span className="text-base font-black text-[#0B1E3D]">
                    {(orc.valor ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Prazo de Execução:</span>
                  <span className="font-bold text-slate-700">{orc.prazoDias} dias úteis</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              
              {/* Proposal 13 pages status */}
              <div className="flex items-center justify-between">
                {orc.paginasProposta && orc.paginasProposta.length > 0 ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>13 Páginas Estruturadas</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400">Proposta básica</span>
                )}

                {/* Status Change Selector */}
                {isColaborador && (
                  <select
                    value={orc.status}
                    onChange={(e) => atualizarStatusOrcamento(orc.id, e.target.value as any)}
                    className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-[11px]"
                  >
                    <option value="rascunho">Rascunho</option>
                    <option value="enviado">Enviada</option>
                    <option value="aprovado">Aprovada</option>
                    <option value="recusado">Recusada</option>
                  </select>
                )}
              </div>

              {/* Primary View Proposal & Edit Proposal Buttons */}
              <div className="flex flex-col gap-1.5">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPropostaModalOrcamento(orc)}
                    className="py-2 px-2.5 rounded-xl bg-[#0B1E3D] hover:bg-[#1565D8] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    title="Visualizar documento pronto para impressão e exportação"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Visualizar PDF</span>
                  </button>

                  <button
                    onClick={() => navigate(`/admin/orcamentos/${orc.id}/editar`)}
                    className="py-2 px-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    title="Abrir editor rico para capa e seções"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Editar Seções</span>
                  </button>
                </div>

                {(!orc.paginasProposta || orc.paginasProposta.length === 0) && (!orc.secoes || orc.secoes.length === 0) && (
                  <button
                    onClick={() => gerarPropostaCompletaComIA(orc)}
                    disabled={gerandoPropostaId === orc.id}
                    className="w-full py-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-[#1565D8] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {gerandoPropostaId === orc.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Gerando 13 Páginas com IA...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Gerar 13 Páginas com IA</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                {/* Convert to Report Button */}
                {orc.status === 'aprovado' && !orc.laudoGeradoId && isColaborador && (
                  <button
                    onClick={() => handleGerarLaudo(orc)}
                    className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    title="Gera o laudo pré-preenchido com cliente e ativo"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Gerar Laudo</span>
                  </button>
                )}

                {orc.laudoGeradoId && (
                  <button
                    onClick={() => navigate(`/admin/laudos/${orc.laudoGeradoId}`)}
                    className="flex-1 py-1.5 rounded-lg bg-blue-50 text-[#1565D8] font-bold text-xs flex items-center justify-center gap-1.5 border border-blue-200 cursor-pointer"
                  >
                    <span>Ver Laudo Gerado</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}

                {isColaborador && (
                  <button
                    onClick={() => {
                      if (confirm(`Remover o orçamento #${orc.id}?`)) removerOrcamento(orc.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 transition-colors ml-auto"
                    title="Excluir Orçamento"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* PROPOSTA 13 PÁGINAS MODAL */}
      {propostaModalOrcamento && (
        <PropostaViewerModal
          orcamento={propostaModalOrcamento}
          isOpen={!!propostaModalOrcamento}
          onClose={() => setPropostaModalOrcamento(null)}
          onStatusChange={atualizarStatusOrcamento}
          onGerarLaudo={handleGerarLaudo}
          onEditarProposta={(orc) => {
            setPropostaModalOrcamento(null);
            navigate(`/admin/orcamentos/${orc.id}/editar`);
          }}
        />
      )}

      {/* CREATE NEW PROPOSAL MODAL */}
      {modalNovoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-[10px] font-bold text-[#1565D8] uppercase tracking-wider font-mono">
                  Gerador Técnico-Comercial
                </span>
                <h3 className="text-lg font-bold text-[#0B1E3D]">
                  Nova Proposta Comercial VL Engenharia
                </h3>
              </div>
              <button onClick={() => setModalNovoAberto(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cliente *</label>
                  <select
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 font-semibold"
                  >
                    {clientes.map(c => (
                      <option key={c.id} value={c.id}>{c.razaoSocial}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Equipamento / Ativo (Opcional)</label>
                  <select
                    value={ativoId}
                    onChange={(e) => setAtivoId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800"
                  >
                    <option value="">Nenhum ativo específico</option>
                    {ativos.filter(a => a.clienteId === clienteId).map(a => (
                      <option key={a.id} value={a.id}>{a.identificacao} ({a.tipo})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Serviço de Engenharia *</label>
                <select
                  value={servico}
                  onChange={(e) => setServico(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 font-semibold"
                >
                  <option value="Adequação à NR-12">Adequação à NR-12</option>
                  <option value="Laudo para Máquinas Pesadas">Laudo para Máquinas Pesadas (Linha Amarela)</option>
                  <option value="Inspeções em Caminhões Munck e Guindastes">Inspeções em Caminhões Munck e Guindastes (NR-11)</option>
                  <option value="Inspeção Veicular e Reclassificação de Monta">Inspeção Veicular e Reclassificação de Monta</option>
                  <option value="Laudos para Playgrounds (ABNT NBR 16071)">Laudos para Playgrounds (ABNT NBR 16071)</option>
                  <option value="Plano de Manutenção, Operação e Controle (PMOC)">Plano de Manutenção, Operação e Controle (PMOC)</option>
                  <option value="Inspeção de Vasos de Pressão e Caldeiras (NR-13)">Inspeção de Vasos de Pressão e Caldeiras (NR-13)</option>
                  <option value="Laudo de Grupos Geradores">Laudo de Grupos Geradores e Painéis de Transferência</option>
                  <option value="Estruturas Metálicas e Galpões Industriais">Estruturas Metálicas e Galpões Industriais</option>
                  <option value="Laudos de Incêndio (PPCI / AVCB / SPDA)">Laudos de Incêndio (PPCI / AVCB / SPDA)</option>
                  <option value="Perícia Judicial e Assistência Técnica Mecânica">Perícia Judicial e Assistência Técnica Mecânica</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição do Escopo e Entregáveis</label>
                <textarea
                  rows={3}
                  value={descricaoEscopo}
                  onChange={(e) => setDescricaoEscopo(e.target.value)}
                  placeholder="Detalhes dos ensaios, quantidade de máquinas inspecionadas, ensaios por líquido penetrante, emissão de ART, etc."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Valor Total (R$) *</label>
                  <input
                    type="number"
                    required
                    value={valor}
                    onChange={(e) => setValor(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prazo (Dias Úteis) *</label>
                  <input
                    type="number"
                    required
                    value={prazoDias}
                    onChange={(e) => setPrazoDias(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Validade (Dias) *</label>
                  <input
                    type="number"
                    required
                    value={validadeDias}
                    onChange={(e) => setValidadeDias(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Condições de Pagamento</label>
                <input
                  type="text"
                  value={condicoesPagamento}
                  onChange={(e) => setCondicoesPagamento(e.target.value)}
                  placeholder="Ex: 50% entrada e 50% na emissão da ART CREA-PE"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800"
                />
              </div>

              {/* AI Generation Toggle */}
              <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#1565D8]" />
                  <div>
                    <span className="font-bold text-[#0B1E3D] block text-xs">Gerador de Proposta de 13 Páginas</span>
                    <span className="text-[10px] text-slate-500">
                      Estrutura completa com capa, metodologia, cronograma, garantias e termos.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={gerarIAAoCriar}
                  onChange={(e) => setGerarIAAoCriar(e.target.checked)}
                  className="w-4 h-4 text-[#1565D8] rounded"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalNovoAberto(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvandoNovo}
                  className="px-5 py-2 rounded-lg bg-[#1565D8] hover:bg-[#0b4fb8] text-white font-bold shadow-md flex items-center gap-2 disabled:opacity-60"
                >
                  {salvandoNovo ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Gerando Proposta Completa...</span>
                    </>
                  ) : (
                    <span>Salvar e Gerar Proposta</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
