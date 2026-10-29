import React, { useState } from 'react';
import { 
  Cpu, 
  Plus, 
  Search, 
  Building, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Edit, 
  Trash2,
  X
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Ativo } from '../../types';

export const AtivosView: React.FC = () => {
  const { ativos, clientes, laudos, adicionarAtivo, atualizarAtivo, removerAtivo } = useData();
  const { currentUser } = useAuth();

  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [ativoEditando, setAtivoEditando] = useState<Ativo | null>(null);

  // Form fields
  const [clienteId, setClienteId] = useState(clientes[0]?.id || '');
  const [tipo, setTipo] = useState('Caminhão Munck');
  const [identificacao, setIdentificacao] = useState('');
  const [fabricante, setFabricante] = useState('');
  const [modelo, setModelo] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [localizacao, setLocalizacao] = useState('');

  const ativosFiltrados = ativos.filter(a =>
    `${a.identificacao} ${a.tipo} ${a.fabricante} ${a.modelo} ${a.localizacao}`.toLowerCase().includes(busca.toLowerCase())
  );

  const abrirNovo = () => {
    setAtivoEditando(null);
    setClienteId(clientes[0]?.id || '');
    setTipo('Caminhão Munck');
    setIdentificacao('');
    setFabricante('');
    setModelo('');
    setCapacidade('');
    setLocalizacao('Obra Recife');
    setModalAberto(true);
  };

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identificacao.trim()) return;

    if (ativoEditando) {
      atualizarAtivo(ativoEditando.id, {
        clienteId,
        tipo,
        identificacao,
        fabricante,
        modelo,
        capacidade,
        localizacao
      });
    } else {
      adicionarAtivo({
        clienteId,
        tipo,
        identificacao,
        fabricante,
        modelo,
        ano: new Date().getFullYear(),
        numeroSerie: 'SN-' + Math.floor(Math.random() * 10000),
        capacidade,
        localizacao
      });
    }

    setModalAberto(false);
  };

  // Helper to determine expiry tag
  const getAtivoStatusInfo = (ativo: Ativo, idx: number) => {
    if (idx === 0) {
      return {
        prazo: 'Vence em 12/11',
        tag: <span className="tag-tech w">Vence em 18 dias</span>
      };
    }
    if (idx === 1) {
      return {
        prazo: 'Laudo em elaboração',
        tag: <span className="tag-tech bl">Em elaboração</span>
      };
    }
    return {
      prazo: 'Perícia concluída',
      tag: <span className="tag-tech ok">Em dia</span>
    };
  };

  return (
    <div className="space-y-6 max-w-[1200px]">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight">
            Equipamentos
          </h1>
          <p className="text-[var(--muted)] text-[15px] sm:text-[16px] mt-0.5">
            Cada máquina cadastrada com a validade do último laudo e alertas preventivos.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={abrirNovo}
            className="btn-tech pri text-[14.5px] px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Novo equipamento</span>
          </button>
        </div>
      </div>

      {/* Grid of Equipment Cards with Validity Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ativosFiltrados.map((ativo, idx) => {
          const cliente = clientes.find(c => c.id === ativo.clienteId);
          const statusInfo = getAtivoStatusInfo(ativo, idx);

          return (
            <div 
              key={ativo.id}
              className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-5 space-y-2 hover:border-[var(--blue)] transition-colors"
            >
              <b className="block font-[family-name:var(--d)] font-bold text-[19px] text-[var(--ink)] leading-snug">
                {ativo.identificacao || ativo.tipo}
              </b>
              
              <p className="text-[var(--muted)] text-[14.5px] m-0">
                {cliente?.nomeFantasia || 'Cliente'} · {statusInfo.prazo}
              </p>

              <div className="pt-2">
                {statusInfo.tag}
              </div>
            </div>
          );
        })}
      </div>

      {/* Technical Inventory Table */}
      <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl overflow-hidden mt-6">
        <div className="p-4 border-b border-[var(--line)] flex items-center justify-between gap-4">
          <h2 className="text-[17px] font-bold">Inventário técnico detalhado</h2>
          <div className="relative max-w-xs">
            <Search className="w-3.5 h-3.5 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar máquina..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px] min-w-[580px]">
            <thead>
              <tr className="border-b border-[var(--line)] text-[var(--muted)] text-xs bg-[var(--paper)]">
                <th className="py-2.5 px-4 font-semibold">Identificação</th>
                <th className="py-2.5 px-4 font-semibold">Cliente</th>
                <th className="py-2.5 px-4 font-semibold">Tipo</th>
                <th className="py-2.5 px-4 font-semibold">Capacidade</th>
                <th className="py-2.5 px-4 font-semibold">Localização</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {ativosFiltrados.map((ativo) => {
                const cliente = clientes.find(c => c.id === ativo.clienteId);
                return (
                  <tr key={ativo.id} className="hover:bg-[var(--paper)]">
                    <td className="py-2.5 px-4 font-semibold text-[var(--ink)]">
                      {ativo.identificacao}
                    </td>
                    <td className="py-2.5 px-4 text-[var(--muted)]">
                      {cliente?.nomeFantasia || 'Cliente'}
                    </td>
                    <td className="py-2.5 px-4 text-[var(--muted)]">
                      {ativo.tipo}
                    </td>
                    <td className="py-2.5 px-4 text-[var(--muted)]">
                      {ativo.capacidade || '—'}
                    </td>
                    <td className="py-2.5 px-4 text-[var(--muted)]">
                      {ativo.localizacao || 'PE'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Cadastro/Edição */}
      {modalAberto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(5,14,28,0.7)] backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[var(--card)] text-[var(--ink)] border-[1.5px] border-[var(--line)] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <h2 className="text-[20px] font-bold">Novo equipamento</h2>
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="p-1 rounded text-[var(--muted)] hover:text-[var(--ink)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvar} className="space-y-3">
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
                <span className="mb-1 block">Identificação / Nome</span>
                <input
                  type="text"
                  value={identificacao}
                  onChange={(e) => setIdentificacao(e.target.value)}
                  required
                  placeholder="Ex: Munck 12 t - Obra Marina"
                  className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm font-semibold">
                  <span className="mb-1 block">Tipo de equipamento</span>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
                  >
                    <option value="Caminhão Munck">Caminhão Munck</option>
                    <option value="Guindaste Rodoviário">Guindaste Rodoviário</option>
                    <option value="Prensa Hidráulica">Prensa Hidráulica</option>
                    <option value="Injetora de Plástico">Injetora de Plástico</option>
                    <option value="Playground Infantil">Playground Infantil</option>
                    <option value="Sistema de Climatização">Sistema de Climatização</option>
                    <option value="Veículo Sinistrado">Veículo Sinistrado</option>
                  </select>
                </label>

                <label className="block text-sm font-semibold">
                  <span className="mb-1 block">Capacidade</span>
                  <input
                    type="text"
                    value={capacidade}
                    onChange={(e) => setCapacidade(e.target.value)}
                    placeholder="Ex: 12 toneladas"
                    className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
                  />
                </label>
              </div>

              <label className="block text-sm font-semibold">
                <span className="mb-1 block">Localização / Obra</span>
                <input
                  type="text"
                  value={localizacao}
                  onChange={(e) => setLocalizacao(e.target.value)}
                  placeholder="Ex: Jaboatão dos Guararapes - PE"
                  className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
                />
              </label>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="btn-tech text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-tech pri text-sm px-5"
                >
                  Salvar equipamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
