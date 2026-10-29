import React, { useState } from 'react';
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
  Building
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Orcamento } from '../../types';
import { PropostaViewerModal } from './PropostaViewerModal';

export const OrcamentosView: React.FC = () => {
  const { 
    orcamentos, 
    clientes, 
    adicionarOrcamento, 
    atualizarStatusOrcamento 
  } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [propostaModalOrcamento, setPropostaModalOrcamento] = useState<Orcamento | null>(null);

  // Form states for new proposal
  const [clienteId, setClienteId] = useState(clientes[0]?.id || '');
  const [servico, setServico] = useState('');
  const [valorTotal, setValorTotal] = useState('2500');

  // Categorize orcamentos into 4 columns: Novos, Enviados, Aprovados, Recusados
  const colNovos = orcamentos.filter(o => o.status === 'rascunho' || !o.status);
  const colEnviados = orcamentos.filter(o => o.status === 'enviado');
  const colAprovados = orcamentos.filter(o => o.status === 'aprovado');
  const colRecusados = orcamentos.filter(o => o.status === 'recusado');

  const handleCriarProposta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!servico.trim()) return;

    adicionarOrcamento({
      clienteId,
      servico,
      descricaoEscopo: `Proposta técnica de vistoria e emissão de laudo para ${servico}.`,
      status: 'rascunho',
      valor: parseFloat(valorTotal) || 2000,
      condicoesPagamento: 'Validade de 15 dias. Pagamento 50% na aprovação e 50% na entrega da ART.',
      normasTecnicas: 'NR-11, NR-12 e Resoluções CONFEA/CREA'
    });

    setServico('');
    setModalNovoAberto(false);
  };

  const renderOrcamentoCard = (orcamento: Orcamento) => {
    const cliente = clientes.find(c => c.id === orcamento.clienteId);
    const valorFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orcamento.valor || 0);

    return (
      <div 
        key={orcamento.id}
        className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-3.5 space-y-2.5 shadow-xs hover:border-[var(--blue)] transition-colors cursor-pointer"
        onClick={() => setPropostaModalOrcamento(orcamento)}
      >
        <div className="flex items-start justify-between gap-2">
          <b className="font-[family-name:var(--d)] font-bold text-[15px] text-[var(--ink)] block leading-tight">
            {orcamento.servico || orcamento.codigoProposta || 'Proposta'}
          </b>
        </div>

        <div className="text-[13px] text-[var(--muted)]">
          <span>{cliente?.nomeFantasia || orcamento.clienteNome || 'Cliente'}</span>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-[var(--line)] text-[14px]">
          <span className="font-bold font-[family-name:var(--d)] text-[var(--blue)]">
            {valorFormatado}
          </span>
          <span className="text-[11.5px] text-[var(--muted)]">
            {new Date(orcamento.criadoEm || Date.now()).toLocaleDateString('pt-BR')}
          </span>
        </div>

        {/* Quick status transition dropdown */}
        <div className="pt-1 flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <select
            value={orcamento.status}
            onChange={(e) => atualizarStatusOrcamento(orcamento.id, e.target.value as any)}
            className="text-[11.5px] py-0.5 px-1.5 border border-[var(--line)] rounded bg-[var(--paper)] text-[var(--ink)]"
          >
            <option value="rascunho">Novo</option>
            <option value="enviado">Enviado</option>
            <option value="aprovado">Aprovado</option>
            <option value="recusado">Recusado</option>
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-[1200px]">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight">
            Orçamentos
          </h1>
          <p className="text-[var(--muted)] text-[15px] sm:text-[16px] mt-0.5">
            Do primeiro contato comercial à aprovação e emissão de ART.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setModalNovoAberto(true)}
            className="btn-tech pri text-[14.5px] px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Nova proposta</span>
          </button>
        </div>
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
            <h3 className="font-[family-name:var(--d)] font-bold text-[15px] text-[var(--green)]">
              Aprovados
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--card)] border border-[var(--line)] text-[var(--green)]">
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

      {/* Modal Nova Proposta */}
      {modalNovoAberto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(5,14,28,0.7)] backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[var(--card)] text-[var(--ink)] border-[1.5px] border-[var(--line)] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <h2 className="text-[20px] font-bold">Nova proposta comercial</h2>
              <button
                type="button"
                onClick={() => setModalNovoAberto(false)}
                className="p-1 rounded text-[var(--muted)] hover:text-[var(--ink)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCriarProposta} className="space-y-3.5">
              <label className="block text-sm font-semibold">
                <span className="mb-1 block">Cliente</span>
                <select
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
                >
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>{c.nomeFantasia || c.razaoSocial}</option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold">
                <span className="mb-1 block">Serviço / Objeto do orçamento</span>
                <input
                  type="text"
                  value={servico}
                  onChange={(e) => setServico(e.target.value)}
                  required
                  placeholder="Ex: Laudo Munck 12 t · Obra Boa Viagem"
                  className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
                />
              </label>

              <label className="block text-sm font-semibold">
                <span className="mb-1 block">Valor total (R$)</span>
                <input
                  type="number"
                  value={valorTotal}
                  onChange={(e) => setValorTotal(e.target.value)}
                  required
                  placeholder="2500"
                  className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
                />
              </label>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalNovoAberto(false)}
                  className="btn-tech text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-tech pri text-sm px-5"
                >
                  Criar proposta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Proposta Viewer Modal */}
      {propostaModalOrcamento && (
        <PropostaViewerModal
          isOpen={true}
          orcamento={propostaModalOrcamento}
          onClose={() => setPropostaModalOrcamento(null)}
        />
      )}

    </div>
  );
};
