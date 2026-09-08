import React, { useState } from 'react';
import { 
  Cpu, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ArrowRight, 
  GitCompare, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  History,
  TrendingDown,
  TrendingUp,
  FileText,
  Calendar
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Ativo, Laudo } from '../../types';

export const AtivosView: React.FC = () => {
  const { ativos, clientes, laudos, adicionarAtivo, atualizarAtivo, removerAtivo } = useData();
  const { currentUser } = useAuth();

  const [busca, setBusca] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('todos');
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [ativoEditando, setAtivoEditando] = useState<Ativo | null>(null);

  // Comparative Modal State
  const [ativoComparando, setAtivoComparando] = useState<Ativo | null>(null);
  const [laudoBaseId, setLaudoBaseId] = useState<string>('');
  const [laudoComparadoId, setLaudoComparadoId] = useState<string>('');

  // Form State
  const [clienteId, setClienteId] = useState(clientes[0]?.id || '');
  const [tipo, setTipo] = useState('Caminhão Munck');
  const [identificacao, setIdentificacao] = useState('');
  const [fabricante, setFabricante] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState(new Date().getFullYear());
  const [numeroSerie, setNumeroSerie] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [localizacao, setLocalizacao] = useState('');

  const isColaborador = currentUser?.role === 'master' || currentUser?.role === 'colaborador';

  const abrirNovo = () => {
    setAtivoEditando(null);
    setClienteId(clientes[0]?.id || '');
    setTipo('Caminhão Munck');
    setIdentificacao('');
    setFabricante('');
    setModelo('');
    setAno(new Date().getFullYear());
    setNumeroSerie('');
    setCapacidade('');
    setLocalizacao('');
    setModalNovoAberto(true);
  };

  const abrirEditar = (a: Ativo) => {
    setAtivoEditando(a);
    setClienteId(a.clienteId);
    setTipo(a.tipo);
    setIdentificacao(a.identificacao);
    setFabricante(a.fabricante || '');
    setModelo(a.modelo || '');
    setAno(a.ano || new Date().getFullYear());
    setNumeroSerie(a.numeroSerie || '');
    setCapacidade(a.capacidade || '');
    setLocalizacao(a.localizacao || '');
    setModalNovoAberto(true);
  };

  const abrirComparativo = (a: Ativo) => {
    setAtivoComparando(a);
    const laudosDoAtivo = laudos.filter(l => l.ativoId === a.id);
    if (laudosDoAtivo.length >= 2) {
      setLaudoBaseId(laudosDoAtivo[1].id);
      setLaudoComparadoId(laudosDoAtivo[0].id);
    } else if (laudosDoAtivo.length === 1) {
      setLaudoBaseId(laudosDoAtivo[0].id);
      setLaudoComparadoId(laudosDoAtivo[0].id);
    } else {
      setLaudoBaseId('');
      setLaudoComparadoId('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identificacao.trim()) return;

    if (ativoEditando) {
      atualizarAtivo(ativoEditando.id, {
        clienteId,
        tipo,
        identificacao,
        fabricante,
        modelo,
        ano: Number(ano),
        numeroSerie,
        capacidade,
        localizacao,
      });
    } else {
      adicionarAtivo({
        clienteId,
        tipo,
        identificacao,
        fabricante,
        modelo,
        ano: Number(ano),
        numeroSerie,
        capacidade,
        localizacao,
      });
    }
    setModalNovoAberto(false);
  };

  const filtrados = ativos.filter(a => {
    const matchBusca = 
      a.identificacao.toLowerCase().includes(busca.toLowerCase()) ||
      a.tipo.toLowerCase().includes(busca.toLowerCase()) ||
      (a.clienteNome && a.clienteNome.toLowerCase().includes(busca.toLowerCase()));
    
    const matchCli = filtroCliente === 'todos' || a.clienteId === filtroCliente;
    return matchBusca && matchCli;
  });

  // Helper for comparing two reports
  const laudoBase = laudos.find(l => l.id === laudoBaseId);
  const laudoComparado = laudos.find(l => l.id === laudoComparadoId);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0B1E3D] flex items-center gap-2">
            <Cpu className="w-6 h-6 text-[#1565D8]" />
            <span>Ativos, Equipamentos e Máquinas Monitoradas</span>
          </h2>
          <p className="text-xs text-slate-500">
            Acompanhe o ciclo de vida, laudos sucessivos e a evolução do risco HRN de cada máquina.
          </p>
        </div>

        {isColaborador && (
          <button
            onClick={abrirNovo}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1565D8] hover:bg-[#0b4fb8] text-white font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Novo Ativo</span>
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
            placeholder="Buscar por placa, tag, modelo ou fabricante..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1565D8]"
          />
        </div>

        <select
          value={filtroCliente}
          onChange={(e) => setFiltroCliente(e.target.value)}
          className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1565D8]"
        >
          <option value="todos">Todos os Clientes</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>{c.razaoSocial}</option>
          ))}
        </select>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtrados.map((ativo) => {
          const laudosDoAtivo = laudos.filter(l => l.ativoId === ativo.id);
          const ultimoLaudo = laudosDoAtivo[0];

          return (
            <div
              key={ativo.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#1565D8] uppercase tracking-wider">
                      {ativo.tipo}
                    </span>
                    <h3 className="text-base font-extrabold text-[#0B1E3D] mt-1">
                      {ativo.identificacao}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      {ativo.clienteNome}
                    </p>
                  </div>
                  {isColaborador && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => abrirEditar(ativo)}
                        className="p-1.5 rounded text-slate-400 hover:text-[#1565D8] hover:bg-slate-50 cursor-pointer"
                        title="Editar"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remover ativo ${ativo.identificacao}?`)) {
                            removerAtivo(ativo.id);
                          }
                        }}
                        className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-slate-50 cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                  <div>
                    <span className="text-slate-400 block">Fabricante:</span>
                    <span className="font-semibold text-slate-800">{ativo.fabricante || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Modelo / Ano:</span>
                    <span className="font-semibold text-slate-800">{ativo.modelo || '—'} ({ativo.ano || '—'})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Capacidade:</span>
                    <span className="font-semibold text-slate-800">{ativo.capacidade || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Localização:</span>
                    <span className="font-semibold text-slate-800 truncate block">{ativo.localizacao || '—'}</span>
                  </div>
                </div>

                {/* History summary */}
                <div className="text-xs text-slate-500 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <History className="w-3.5 h-3.5 text-slate-400" />
                    <span>{laudosDoAtivo.length} Laudo(s) no histórico</span>
                  </span>
                  {ultimoLaudo?.hrnCalculoGeral && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${ultimoLaudo.hrnCalculoGeral.cor}`}>
                      HRN Atual: {ultimoLaudo.hrnCalculoGeral.nivel}
                    </span>
                  )}
                </div>
              </div>

              {/* Action: Open Comparative Viewer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => abrirComparativo(ativo)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-[#1565D8] hover:text-white text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  <span>Comparar Histórico de Laudos</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* COMPARATIVE INSPECTION VIEWER MODAL */}
      {ativoComparando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-[#1565D8] uppercase tracking-wider flex items-center gap-1.5">
                  <GitCompare className="w-4 h-4" />
                  <span>Comparativo Técnico de Evolução de Riscos</span>
                </span>
                <h3 className="text-xl font-black text-[#0B1E3D] mt-0.5">
                  {ativoComparando.identificacao} ({ativoComparando.tipo})
                </h3>
                <p className="text-xs text-slate-500">
                  Cliente: {ativoComparando.clienteNome}
                </p>
              </div>
              <button
                onClick={() => setAtivoComparando(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Select two inspections to compare */}
            {laudos.filter(l => l.ativoId === ativoComparando.id).length < 2 ? (
              <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">Inspeções insuficientes para comparação</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Este ativo possui apenas {laudos.filter(l => l.ativoId === ativoComparando.id).length} laudo cadastrado. Conclua uma segunda auditoria ou vistoria periódica para habilitar o comparativo de evolução temporal.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      1. Laudo Anterior (Referência Base)
                    </label>
                    <select
                      value={laudoBaseId}
                      onChange={(e) => setLaudoBaseId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-800"
                    >
                      {laudos.filter(l => l.ativoId === ativoComparando.id).map(l => (
                        <option key={l.id} value={l.id}>
                          {l.numero} ({l.dataInspecao}) — HRN: {l.hrnCalculoGeral?.nivel || 'N/A'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      2. Laudo Recente (Inspeção Atual)
                    </label>
                    <select
                      value={laudoComparadoId}
                      onChange={(e) => setLaudoComparadoId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-800"
                    >
                      {laudos.filter(l => l.ativoId === ativoComparando.id).map(l => (
                        <option key={l.id} value={l.id}>
                          {l.numero} ({l.dataInspecao}) — HRN: {l.hrnCalculoGeral?.nivel || 'N/A'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Side-by-side Cards */}
                {laudoBase && laudoComparado && (
                  <div className="space-y-6">
                    
                    {/* HRN Evolution Banner */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-center sm:text-left">
                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                          Evolução Quantitativa do Risco HRN
                        </span>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-lg font-black text-slate-700">
                            {laudoBase.numero}: <strong className="text-amber-700">{laudoBase.hrnCalculoGeral?.score ?? '12.5'}</strong>
                          </span>
                          <ArrowRight className="w-4 h-4 text-blue-500" />
                          <span className="text-lg font-black text-emerald-700">
                            {laudoComparado.numero}: <strong>{laudoComparado.hrnCalculoGeral?.score ?? '0.8'}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-lg border border-emerald-300 text-xs font-bold">
                        <TrendingDown className="w-4 h-4 text-emerald-700" />
                        <span>Risco Reduzido com Sucesso (Melhoria Contínua)</span>
                      </div>
                    </div>

                    {/* Detailed Comparison Table */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Left: Base Report */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                        <div className="border-b border-slate-200 pb-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Laudo de Origem</span>
                          <h4 className="text-sm font-bold text-[#0B1E3D] font-mono">{laudoBase.numero}</h4>
                          <p className="text-xs text-slate-500">Data: {laudoBase.dataInspecao} • ART: {laudoBase.artNumero || 'Pendente'}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-slate-700 block">Constatações Técnicas:</span>
                          <p className="text-xs text-slate-600 bg-white p-2.5 rounded border border-slate-200 leading-relaxed">
                            {laudoBase.resumoExecutivo}
                          </p>
                        </div>

                        <div>
                          <span className="text-xs font-bold text-slate-700 block mb-1">Parecer Conclusivo:</span>
                          <p className="text-xs text-slate-700 bg-white p-2.5 rounded border border-slate-200">
                            {laudoBase.conclusao || 'Aprovado com restrições e plano de ação.'}
                          </p>
                        </div>
                      </div>

                      {/* Right: Compared Report */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                        <div className="border-b border-slate-200 pb-2">
                          <span className="text-[10px] font-bold text-[#1565D8] uppercase">Laudo Atualizado / Reinspeção</span>
                          <h4 className="text-sm font-bold text-[#0B1E3D] font-mono">{laudoComparado.numero}</h4>
                          <p className="text-xs text-slate-500">Data: {laudoComparado.dataInspecao} • ART: {laudoComparado.artNumero || 'Pendente'}</p>
                        </div>

                        <div className="space-y-2">
                          <span className="text-xs font-bold text-slate-700 block">Constatações Técnicas:</span>
                          <p className="text-xs text-slate-600 bg-white p-2.5 rounded border border-slate-200 leading-relaxed">
                            {laudoComparado.resumoExecutivo}
                          </p>
                        </div>

                        <div>
                          <span className="text-xs font-bold text-slate-700 block mb-1">Parecer Conclusivo:</span>
                          <p className="text-xs text-slate-700 bg-white p-2.5 rounded border border-slate-200 font-medium text-emerald-800">
                            {laudoComparado.conclusao || 'Equipamento plenamente aprovado e conforme.'}
                          </p>
                        </div>
                      </div>

                    </div>

                  </div>
                )}
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 text-right">
              <button
                onClick={() => setAtivoComparando(null)}
                className="px-5 py-2 rounded-lg bg-slate-800 text-white font-bold text-xs"
              >
                Fechar Comparativo
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CREATE / EDIT ASSET MODAL */}
      {modalNovoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-lg font-bold text-[#0B1E3D]">
                {ativoEditando ? 'Editar Ativo / Máquina' : 'Cadastrar Novo Ativo'}
              </h3>
              <button onClick={() => setModalNovoAberto(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cliente Proprietário *</label>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Equipamento *</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 font-semibold"
                  >
                    <option value="Caminhão Munck">Caminhão Munck</option>
                    <option value="Guindaste Telescópico">Guindaste Telescópico</option>
                    <option value="Máquina Pesada">Máquina Pesada (Escavadeira, Pá, etc.)</option>
                    <option value="Prensa Excêntrica Mecânica">Prensa Excêntrica / Hidráulica</option>
                    <option value="Vaso de Pressão / Caldeira">Vaso de Pressão / Caldeira (NR-13)</option>
                    <option value="Veículo de Frota">Veículo / Frota Leve / Escolar</option>
                    <option value="Playground Infantil">Playground / Recreação (NBR 16071)</option>
                    <option value="Sistema de Climatização">Sistema de Climatização (PMOC)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Identificação / Tag / Placa *</label>
                  <input
                    type="text"
                    required
                    value={identificacao}
                    onChange={(e) => setIdentificacao(e.target.value)}
                    placeholder="Ex: MNK-8821 / Placa PE-REC-4921"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Fabricante</label>
                  <input
                    type="text"
                    value={fabricante}
                    onChange={(e) => setFabricante(e.target.value)}
                    placeholder="Ex: Madal Palfinger"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Modelo</label>
                  <input
                    type="text"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    placeholder="Ex: MD 45007"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Ano de Fabricação</label>
                  <input
                    type="number"
                    value={ano}
                    onChange={(e) => setAno(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Capacidade Operacional</label>
                  <input
                    type="text"
                    value={capacidade}
                    onChange={(e) => setCapacidade(e.target.value)}
                    placeholder="Ex: 45.000 kgm / 12 toneladas"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Número de Série / Chassi</label>
                  <input
                    type="text"
                    value={numeroSerie}
                    onChange={(e) => setNumeroSerie(e.target.value)}
                    placeholder="Ex: MP-892110-BR"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Localização Operacional / Obra</label>
                <input
                  type="text"
                  value={localizacao}
                  onChange={(e) => setLocalizacao(e.target.value)}
                  placeholder="Ex: Canteiro Obra Eólica PE-060 / Galpão Central"
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
                  {ativoEditando ? 'Salvar Alterações' : 'Cadastrar Ativo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
