import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Search, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Trash2,
  Filter
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { AgendaVistoria } from '../../types';

export const AgendaView: React.FC = () => {
  const { agenda, clientes, ativos, adicionarVistoria, atualizarStatusVistoria, removerVistoria } = useData();
  const { currentUser } = useAuth();

  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [modalNovoAberto, setModalNovoAberto] = useState(false);

  // Form State
  const [clienteId, setClienteId] = useState(clientes[0]?.id || '');
  const [ativoId, setAtivoId] = useState('');
  const [dataHora, setDataHora] = useState(() => {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    amanha.setHours(9, 0, 0, 0);
    return amanha.toISOString().slice(0, 16);
  });
  const [observacoes, setObservacoes] = useState('');

  const isColaborador = currentUser?.role === 'master' || currentUser?.role === 'colaborador';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cliente = clientes.find(c => c.id === clienteId);
    const ativo = ativos.find(a => a.id === ativoId);

    adicionarVistoria({
      clienteId,
      clienteNome: cliente?.razaoSocial,
      ativoId: ativoId || undefined,
      ativoIdentificacao: ativo?.identificacao || undefined,
      dataHora,
      responsavelUid: currentUser?.uid || 'master-vitor',
      responsavelNome: currentUser?.nome || 'Eng. Vitor Leonardo',
      status: 'agendada',
      observacoes,
    });

    setModalNovoAberto(false);
  };

  const filtradas = agenda.filter(v => filtroStatus === 'todos' || v.status === filtroStatus);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0B1E3D] flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-[#1565D8]" />
            <span>Agenda de Vistorias e Auditorias de Campo</span>
          </h2>
          <p className="text-xs text-slate-500">
            Organize os compromissos técnicos in loco em indústrias, galpões e canteiros em Pernambuco.
          </p>
        </div>

        {isColaborador && (
          <button
            onClick={() => setModalNovoAberto(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1565D8] hover:bg-[#0b4fb8] text-white font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agendar Nova Vistoria</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['todos', 'agendada', 'em_andamento', 'concluida', 'remarcada'].map((st) => (
          <button
            key={st}
            onClick={() => setFiltroStatus(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer shrink-0 ${
              filtroStatus === st
                ? 'bg-[#0B1E3D] text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Visits List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtradas.map((vis) => (
          <div
            key={vis.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-mono font-bold text-[#1565D8] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{vis.dataHora.replace('T', ' às ')}</span>
                  </span>
                  <h3 className="text-base font-extrabold text-[#0B1E3D] mt-1">
                    {vis.clienteNome}
                  </h3>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  vis.status === 'concluida'
                    ? 'bg-emerald-100 text-emerald-800'
                    : vis.status === 'em_andamento'
                    ? 'bg-blue-100 text-blue-800'
                    : vis.status === 'remarcada'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {vis.status.replace('_', ' ')}
                </span>
              </div>

              {vis.ativoIdentificacao && (
                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-bold">EQUIPAMENTO AUDITADO:</span>
                  <strong className="text-slate-800">{vis.ativoIdentificacao}</strong>
                </div>
              )}

              {vis.observacoes && (
                <p className="text-xs text-slate-600 italic bg-white p-2 rounded border border-slate-100">
                  "{vis.observacoes}"
                </p>
              )}

              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Responsável: <strong>{vis.responsavelNome}</strong></span>
              </div>
            </div>

            {/* Actions */}
            {isColaborador && (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <select
                  value={vis.status}
                  onChange={(e) => atualizarStatusVistoria(vis.id, e.target.value as any)}
                  className="px-2 py-1 rounded bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  <option value="agendada">Agendada</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="concluida">Concluída</option>
                  <option value="remarcada">Remarcada</option>
                </select>

                <button
                  onClick={() => {
                    if (confirm('Remover agendamento?')) removerVistoria(vis.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MODAL NOVO AGENDAMENTO */}
      {modalNovoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-lg font-bold text-[#0B1E3D]">Agendar Vistoria Técnica</h3>
              <button onClick={() => setModalNovoAberto(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
                <label className="block font-bold text-slate-700 mb-1">Ativo / Equipamento (Opcional)</label>
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

              <div>
                <label className="block font-bold text-slate-700 mb-1">Data e Hora da Vistoria *</label>
                <input
                  type="datetime-local"
                  required
                  value={dataHora}
                  onChange={(e) => setDataHora(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Observações Técnicas / EPIs Necessários</label>
                <textarea
                  rows={3}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Ex: Levar paquímetro calibrado, kit de líquido penetrante, colete reflexivo..."
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
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
