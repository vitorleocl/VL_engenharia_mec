import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Check,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Ativo } from '../../types';

const TIPOS_EQUIPAMENTO_PADRAO = [
  'Caminhão Munck',
  'Guindaste Rodoviário',
  'Prensa Hidráulica',
  'Injetora de Plástico',
  'Playground Infantil',
  'Sistema de Climatização',
  'Veículo Sinistrado',
  'Veículo Oficial / Utilitário',
  'Caldeira / Vaso de Pressão',
  'Ponte Rolante / Talha',
  'Empilhadeira',
  'Outro Equipamento',
];

export const AtivosView: React.FC = () => {
  const { ativos, clientes, adicionarAtivo, atualizarAtivo, removerAtivo } = useData();

  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [ativoEditando, setAtivoEditando] = useState<Ativo | null>(null);
  const [confirmandoExclusaoId, setConfirmandoExclusaoId] = useState<string | null>(null);

  // Form fields
  const [clienteId, setClienteId] = useState(clientes[0]?.id || '');
  const [tipo, setTipo] = useState('Caminhão Munck');
  const [identificacao, setIdentificacao] = useState('');
  const [fabricante, setFabricante] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState<string>(String(new Date().getFullYear()));
  const [placa, setPlaca] = useState('');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [chassi, setChassi] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [localizacao, setLocalizacao] = useState('');

  const ativosFiltrados = ativos.filter((a) =>
    `${a.identificacao || ''} ${a.tipo || ''} ${a.fabricante || ''} ${a.modelo || ''} ${a.placa || ''} ${a.localizacao || ''} ${a.clienteNome || ''}`
      .toLowerCase()
      .includes(busca.toLowerCase())
  );

  const abrirNovo = () => {
    setAtivoEditando(null);
    setClienteId(clientes[0]?.id || '');
    setTipo('Caminhão Munck');
    setIdentificacao('');
    setFabricante('');
    setModelo('');
    setAno(String(new Date().getFullYear()));
    setPlaca('');
    setNumeroSerie('');
    setChassi('');
    setCapacidade('');
    setLocalizacao('Recife - PE');
    setModalAberto(true);
  };

  const abrirEdicao = (ativo: Ativo) => {
    setAtivoEditando(ativo);
    setClienteId(ativo.clienteId || clientes[0]?.id || '');
    setTipo(ativo.tipo || 'Caminhão Munck');
    setIdentificacao(ativo.identificacao || '');
    setFabricante(ativo.fabricante || ativo.marca || '');
    setModelo(ativo.modelo || '');
    setAno(ativo.ano ? String(ativo.ano) : String(ativo.anoFabricacao || new Date().getFullYear()));
    setPlaca(ativo.placa || '');
    setNumeroSerie(ativo.numeroSerie || '');
    setChassi(ativo.chassi || '');
    setCapacidade(ativo.capacidade || '');
    setLocalizacao(ativo.localizacao || '');
    setModalAberto(true);
  };

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identificacao.trim()) return;

    const anoParsed = ano.trim()
      ? /^\d{4}$/.test(ano.trim())
        ? Number(ano.trim())
        : ano.trim()
      : new Date().getFullYear();

    const payload = {
      clienteId,
      tipo: tipo.trim() || 'Outro Equipamento',
      identificacao: identificacao.trim(),
      fabricante: fabricante.trim(),
      modelo: modelo.trim(),
      ano: anoParsed,
      placa: placa.trim(),
      numeroSerie: numeroSerie.trim() || (ativoEditando?.numeroSerie || `SN-${Math.floor(1000 + Math.random() * 9000)}`),
      chassi: chassi.trim(),
      capacidade: capacidade.trim(),
      localizacao: localizacao.trim(),
    };

    if (ativoEditando) {
      atualizarAtivo(ativoEditando.id, payload);
    } else {
      adicionarAtivo(payload);
    }

    setModalAberto(false);
  };

  const opcoesTipo = tipo && !TIPOS_EQUIPAMENTO_PADRAO.includes(tipo)
    ? [tipo, ...TIPOS_EQUIPAMENTO_PADRAO]
    : TIPOS_EQUIPAMENTO_PADRAO;

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight">
            Equipamentos
          </h1>
          <p className="text-[var(--muted)] text-[15px] sm:text-[16px] mt-0.5">
            Inventário técnico de máquinas, veículos e equipamentos vinculados aos clientes.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={abrirNovo}
            className="btn-tech pri text-[14.5px] px-4 py-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Novo equipamento</span>
          </button>
        </div>
      </div>

      {/* Technical Inventory Table */}
      <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-[17px] font-bold">Inventário técnico detalhado</h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar máquina, placa ou TAG..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px] min-w-[680px]">
            <thead>
              <tr className="border-b border-[var(--line)] text-[var(--muted)] text-xs bg-[var(--paper)]">
                <th className="py-2.5 px-4 font-semibold">Identificação</th>
                <th className="py-2.5 px-4 font-semibold">Cliente</th>
                <th className="py-2.5 px-4 font-semibold">Tipo</th>
                <th className="py-2.5 px-4 font-semibold">Capacidade</th>
                <th className="py-2.5 px-4 font-semibold">Localização</th>
                <th className="py-2.5 px-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {ativosFiltrados.map((ativo) => {
                const cliente = clientes.find((c) => c.id === ativo.clienteId);
                const subtitulo = [ativo.fabricante, ativo.modelo, ativo.ano]
                  .filter(Boolean)
                  .join(' · ');
                const confirmando = confirmandoExclusaoId === ativo.id;

                return (
                  <tr key={ativo.id} className="hover:bg-[var(--paper)] transition-colors">
                    <td className="py-3 px-4 align-top">
                      <span className="font-semibold text-[var(--ink)] block">
                        {ativo.identificacao}
                      </span>
                      {subtitulo && (
                        <small className="text-xs text-[var(--muted)] block mt-0.5">
                          {subtitulo}
                        </small>
                      )}
                    </td>
                    <td className="py-3 px-4 align-top text-[var(--muted)]">
                      {cliente?.nomeFantasia || cliente?.razaoSocial || ativo.clienteNome || 'Cliente'}
                    </td>
                    <td className="py-3 px-4 align-top text-[var(--muted)]">
                      {ativo.tipo}
                    </td>
                    <td className="py-3 px-4 align-top text-[var(--muted)]">
                      {ativo.capacidade || '—'}
                    </td>
                    <td className="py-3 px-4 align-top text-[var(--muted)]">
                      {ativo.localizacao || 'PE'}
                    </td>
                    <td className="py-3 px-4 align-top text-right whitespace-nowrap space-x-1.5">
                      <button
                        type="button"
                        onClick={() => abrirEdicao(ativo)}
                        className="btn-tech sm text-xs py-1 px-2.5 inline-flex items-center gap-1 cursor-pointer"
                        title="Editar equipamento"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      {confirmando ? (
                        <span className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              removerAtivo(ativo.id);
                              setConfirmandoExclusaoId(null);
                            }}
                            className="text-xs py-1 px-2 rounded-md bg-rose-600 text-white font-semibold inline-flex items-center gap-1 cursor-pointer"
                            title="Confirmar exclusão"
                          >
                            <Check className="w-3 h-3" />
                            <span>Confirmar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmandoExclusaoId(null)}
                            className="text-xs py-1 px-2 rounded-md border border-[var(--line)] text-[var(--muted)] cursor-pointer"
                            title="Cancelar"
                          >
                            Cancelar
                          </button>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmandoExclusaoId(ativo.id)}
                          className="p-1.5 rounded-lg text-[var(--muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors inline-flex items-center cursor-pointer"
                          title="Excluir equipamento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {ativosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[var(--muted)]">
                    Nenhum equipamento encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Cadastro/Edição */}
      {modalAberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[rgba(5,14,28,0.75)] backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[var(--card)] text-[var(--ink)] border-[1.5px] border-[var(--line)] rounded-2xl w-full max-w-xl p-5 sm:p-6 space-y-4 shadow-2xl my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <h2 className="text-[20px] font-bold">
                {ativoEditando ? 'Editar equipamento' : 'Novo equipamento'}
              </h2>
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvar} className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
              <label className="block text-xs font-bold text-[var(--ink)]">
                <span className="mb-1 block">Cliente vinculado *</span>
                <select
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                >
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nomeFantasia || c.razaoSocial}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-xs font-bold text-[var(--ink)]">
                <span className="mb-1 block">Identificação / TAG / Nome *</span>
                <input
                  type="text"
                  value={identificacao}
                  onChange={(e) => setIdentificacao(e.target.value)}
                  required
                  placeholder="Ex: Munck 12 t - Obra Marina ou PGX-9708"
                  className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block text-xs font-bold text-[var(--ink)]">
                  <span className="mb-1 block">Tipo de equipamento</span>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                  >
                    {opcoesTipo.map((op) => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-xs font-bold text-[var(--ink)]">
                  <span className="mb-1 block">Capacidade</span>
                  <input
                    type="text"
                    value={capacidade}
                    onChange={(e) => setCapacidade(e.target.value)}
                    placeholder="Ex: 12 toneladas / 200T"
                    className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="block text-xs font-bold text-[var(--ink)]">
                  <span className="mb-1 block">Fabricante / Marca</span>
                  <input
                    type="text"
                    value={fabricante}
                    onChange={(e) => setFabricante(e.target.value)}
                    placeholder="Ex: MADAL / Renault"
                    className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                  />
                </label>

                <label className="block text-xs font-bold text-[var(--ink)]">
                  <span className="mb-1 block">Modelo</span>
                  <input
                    type="text"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    placeholder="Ex: MD 12500 / Duster"
                    className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                  />
                </label>

                <label className="block text-xs font-bold text-[var(--ink)]">
                  <span className="mb-1 block">Ano</span>
                  <input
                    type="text"
                    value={ano}
                    onChange={(e) => setAno(e.target.value)}
                    placeholder="Ex: 2022"
                    className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="block text-xs font-bold text-[var(--ink)]">
                  <span className="mb-1 block">Placa (se aplicável)</span>
                  <input
                    type="text"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value)}
                    placeholder="Ex: PGX-9708"
                    className="w-full p-2.5 text-sm uppercase border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                  />
                </label>

                <label className="block text-xs font-bold text-[var(--ink)]">
                  <span className="mb-1 block">Nº de Série</span>
                  <input
                    type="text"
                    value={numeroSerie}
                    onChange={(e) => setNumeroSerie(e.target.value)}
                    placeholder="Ex: SN-8492"
                    className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                  />
                </label>

                <label className="block text-xs font-bold text-[var(--ink)]">
                  <span className="mb-1 block">Chassi (opcional)</span>
                  <input
                    type="text"
                    value={chassi}
                    onChange={(e) => setChassi(e.target.value)}
                    placeholder="Nº Chassi"
                    className="w-full p-2.5 text-sm uppercase border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                  />
                </label>
              </div>

              <label className="block text-xs font-bold text-[var(--ink)]">
                <span className="mb-1 block">Localização / Obra</span>
                <input
                  type="text"
                  value={localizacao}
                  onChange={(e) => setLocalizacao(e.target.value)}
                  placeholder="Ex: Jaboatão dos Guararapes - PE"
                  className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                />
              </label>

              <div className="pt-3 flex justify-end gap-2 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="btn-tech text-sm cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-tech pri text-sm px-5 font-bold cursor-pointer"
                >
                  {ativoEditando ? 'Salvar alterações' : 'Salvar equipamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
