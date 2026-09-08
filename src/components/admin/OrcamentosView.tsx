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
  Building
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Orcamento } from '../../types';
import { useNavigate } from 'react-router-dom';

export const OrcamentosView: React.FC = () => {
  const { 
    orcamentos, 
    clientes, 
    ativos, 
    adicionarOrcamento, 
    atualizarStatusOrcamento, 
    gerarLaudoFromOrcamento, 
    removerOrcamento 
  } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [orcamentoImprimindo, setOrcamentoImprimindo] = useState<Orcamento | null>(null);

  // Form State
  const [clienteId, setClienteId] = useState(clientes[0]?.id || '');
  const [servico, setServico] = useState('Adequação à NR-12');
  const [descricaoEscopo, setDescricaoEscopo] = useState('');
  const [ativoId, setAtivoId] = useState('');
  const [valor, setValor] = useState(3500);
  const [prazoDias, setPrazoDias] = useState(7);
  const [condicoesPagamento, setCondicoesPagamento] = useState('50% na aprovação e 50% após emissão da ART CREA-PE.');

  const isColaborador = currentUser?.role === 'master' || currentUser?.role === 'colaborador';

  const abrirNovo = () => {
    setClienteId(clientes[0]?.id || '');
    setServico('Adequação à NR-12');
    setDescricaoEscopo('');
    setAtivoId('');
    setValor(3500);
    setPrazoDias(7);
    setCondicoesPagamento('50% na aprovação e 50% após emissão da ART CREA-PE.');
    setModalNovoAberto(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cliente = clientes.find(c => c.id === clienteId);
    const ativo = ativos.find(a => a.id === ativoId);

    adicionarOrcamento({
      clienteId,
      clienteNome: cliente?.razaoSocial,
      servico,
      descricaoEscopo,
      ativoId: ativoId || undefined,
      ativoIdentificacao: ativo?.identificacao || undefined,
      valor: Number(valor),
      prazoDias: Number(prazoDias),
      condicoesPagamento,
      status: 'rascunho',
    });

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
                    {orc.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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
              
              {/* Status Change Selector */}
              {isColaborador && (
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Alterar status:</span>
                  <select
                    value={orc.status}
                    onChange={(e) => atualizarStatusOrcamento(orc.id, e.target.value as any)}
                    className="px-2 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700 font-semibold"
                  >
                    <option value="rascunho">Rascunho</option>
                    <option value="enviado">Enviado</option>
                    <option value="aprovado">Aprovado</option>
                    <option value="recusado">Recusado</option>
                  </select>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOrcamentoImprimindo(orc)}
                  className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Visualizar / Imprimir</span>
                </button>

                {/* Convert to Report Button (Requested explicitly in Section 5) */}
                {orc.status === 'aprovado' && !orc.laudoGeradoId && isColaborador && (
                  <button
                    onClick={() => handleGerarLaudo(orc)}
                    className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    title="Gera o laudo pré-preenchido com cliente e ativo"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Gerar Laudo</span>
                  </button>
                )}

                {orc.laudoGeradoId && (
                  <button
                    onClick={() => navigate(`/admin/laudos/${orc.laudoGeradoId}`)}
                    className="flex-1 py-2 rounded-lg bg-blue-50 text-[#1565D8] font-bold text-xs flex items-center justify-center gap-1.5 border border-blue-200 cursor-pointer"
                  >
                    <span>Ver Laudo Gerado</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* PRINT PREVIEW MODAL */}
      {orcamentoImprimindo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto space-y-6">
            
            {/* Header with Logo and Info */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="VL" className="h-10 w-auto object-contain" />
                <div>
                  <h3 className="font-extrabold text-[#0B1E3D] text-base">VL ENGENHARIA MECÂNICA</h3>
                  <p className="text-xs text-slate-500 font-mono">CREA-PE 1822299490 • Recife / PE</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#1565D8] uppercase">Proposta Comercial</span>
                <p className="text-xs text-slate-500 font-mono">#{orcamentoImprimindo.id.slice(-6).toUpperCase()}</p>
              </div>
            </div>

            {/* Document Body */}
            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block font-bold text-[10px]">CLIENTE:</span>
                  <span className="font-bold text-[#0B1E3D] text-sm">{orcamentoImprimindo.clienteNome}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold text-[10px]">SERVIÇO PROPOSTO:</span>
                  <span className="font-bold text-[#1565D8]">{orcamentoImprimindo.servico}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase text-[11px] mb-1">1. Objeto e Escopo Técnico</h4>
                <p className="p-3 rounded-lg border border-slate-200 bg-white leading-relaxed">
                  {orcamentoImprimindo.descricaoEscopo || 'Execução de vistoria técnica in loco, ensaios não-destrutivos, apreciação de riscos quantitativa HRN e emissão formal de Laudo Técnico Conclusivo com Anotação de Responsabilidade Técnica (ART) junto ao CREA-PE.'}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase text-[11px] mb-1">2. Prazo de Execução</h4>
                <p className="p-3 rounded-lg border border-slate-200 bg-white">
                  O prazo estimado para entrega do laudo técnico e protocolo da ART é de <strong>{orcamentoImprimindo.prazoDias} dias úteis</strong> após a realização da vistoria de campo.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase text-[11px] mb-1">3. Investimento e Condições de Faturamento</h4>
                <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-200 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 text-[10px] block font-bold">VALOR LÍQUIDO DOS SERVIÇOS:</span>
                    <span className="text-2xl font-black text-[#0B1E3D]">
                      {orcamentoImprimindo.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  <div className="text-right max-w-xs text-[11px] text-slate-600">
                    <span className="font-bold block">Condição de Pagamento:</span>
                    <span>{orcamentoImprimindo.condicoesPagamento}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <div>
                  <p className="font-bold text-slate-700">Vitor Leonardo</p>
                  <p>Engenheiro Mecânico • CREA-PE 1822299490</p>
                  <p>vitorleonardocl@gmail.com • (81) 98444-2592</p>
                </div>
                <div className="text-right">
                  <p className="italic">Proposta válida por 15 dias corridos.</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setOrcamentoImprimindo(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-lg bg-[#1565D8] hover:bg-[#0b4fb8] text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir / Gerar PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CREATE NEW PROPOSAL MODAL */}
      {modalNovoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-lg font-bold text-[#0B1E3D]">
                Criar Nova Proposta Comercial
              </h3>
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
                  <option value="Laudo para Máquinas Pesadas">Laudo para Máquinas Pesadas</option>
                  <option value="Inspeções em Caminhões Munck e Guindastes">Inspeções em Caminhões Munck e Guindastes</option>
                  <option value="Inspeção Veicular e Reclassificação de Monta">Inspeção Veicular e Reclassificação de Monta</option>
                  <option value="Laudos para Playgrounds (ABNT NBR 16071)">Laudos para Playgrounds (ABNT NBR 16071)</option>
                  <option value="Plano de Manutenção, Operação e Controle (PMOC)">Plano de Manutenção, Operação e Controle (PMOC)</option>
                  <option value="ART para Serviços de Manutenção">ART para Serviços de Manutenção</option>
                  <option value="Consultoria em Gestão da Manutenção (PCM)">Consultoria em Gestão da Manutenção (PCM)</option>
                  <option value="Orquestrador de Laudos de Incêndio (PPCI / AVCB)">Orquestrador de Laudos de Incêndio (PPCI / AVCB)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição do Escopo e Entregáveis</label>
                <textarea
                  rows={3}
                  value={descricaoEscopo}
                  onChange={(e) => setDescricaoEscopo(e.target.value)}
                  placeholder="Detalhes dos ensaios, quantidade de máquinas inspecionadas, ensaios por líquido penetrante, etc."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <label className="block font-bold text-slate-700 mb-1">Prazo de Entrega (Dias Úteis) *</label>
                  <input
                    type="number"
                    required
                    value={prazoDias}
                    onChange={(e) => setPrazoDias(Number(e.target.value))}
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
                  placeholder="Ex: 50% entrada e 50% na emissão da ART"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800"
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
                  className="px-5 py-2 rounded-lg bg-[#1565D8] hover:bg-[#0b4fb8] text-white font-bold shadow-md"
                >
                  Salvar Orçamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
