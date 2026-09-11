import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Search, 
  Sparkles, 
  ShieldAlert, 
  Gauge, 
  Tractor, 
  Truck, 
  Cable, 
  Car, 
  Bus, 
  FileCheck2, 
  Smile, 
  Fan, 
  Award, 
  BarChart3, 
  Flame, 
  Printer, 
  Edit, 
  Trash2, 
  Filter, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  X,
  Download
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { MODULOS_LAUDO_CATALOGO, NR12_REQUISITOS_PADRAO } from '../../data/initialData';
import { ModuloLaudoCatalogo, Laudo } from '../../types';
import { LaudoPdfExportModal } from './LaudoPdfExportModal';

// Map icon strings to Lucide components
const ICON_MAP: Record<string, React.ElementType> = {
  Flame,
  ShieldAlert,
  Gauge,
  Tractor,
  Truck,
  Cable,
  Car,
  Bus,
  FileCheck2,
  Sparkles,
  Smile,
  Fan,
  Award,
  BarChart3,
};

export const LaudosCentralView: React.FC = () => {
  const { laudos, clientes, ativos, criarNovoLaudo, removerLaudo } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [modalCriarAberto, setModalCriarAberto] = useState(false);
  const [moduloSelecionado, setModuloSelecionado] = useState<ModuloLaudoCatalogo | null>(null);
  const [laudoPdfExportar, setLaudoPdfExportar] = useState<Laudo | null>(null);

  // Form states for new report modal
  const [clienteId, setClienteId] = useState(clientes[0]?.id || '');
  const [ativoId, setAtivoId] = useState('');

  const isColaborador = currentUser?.role === 'master' || currentUser?.role === 'colaborador';

  const iniciarModulo = (mod: ModuloLaudoCatalogo) => {
    setModuloSelecionado(mod);
    setClienteId(clientes[0]?.id || '');
    setAtivoId('');
    setModalCriarAberto(true);
  };

  const handleCriarConfirmado = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduloSelecionado || !clienteId) return;

    // Create sections based on module
    const secoesIniciais = moduloSelecionado.id === 'nr-12' 
      ? NR12_REQUISITOS_PADRAO.map((req, idx) => ({
          id: `sec-${idx + 1}`,
          titulo: req.requisito,
          ordem: idx + 1,
          itens: [
            {
              id: req.id,
              requisito: req.requisito,
              normaRef: req.normaRef,
              status: 'conforme' as const,
              observacao: 'Em conformidade preliminar observada.',
            }
          ],
          fotos: [],
        }))
      : [
          {
            id: 'sec-1',
            titulo: '1. Identificação Técnica e Integridade Estrutural',
            ordem: 1,
            itens: [
              {
                id: 'it-1',
                requisito: 'Verificação visual de soldas, longarinas e ausência de deformações plásticas',
                status: 'conforme' as const,
              }
            ],
            fotos: []
          },
          {
            id: 'sec-2',
            titulo: '2. Ensaios de Campo e Dispositivos de Proteção',
            ordem: 2,
            itens: [
              {
                id: 'it-2',
                requisito: 'Teste sob pressão / carga de trabalho recomendada pelo fabricante',
                status: 'conforme' as const,
              }
            ],
            fotos: []
          }
        ];

    const novoId = criarNovoLaudo({
      tipo: moduloSelecionado.nome,
      clienteId,
      ativoId: ativoId || (ativos.find(a => a.clienteId === clienteId)?.id || ''),
      secoes: secoesIniciais,
    });

    setModalCriarAberto(false);
    navigate(`/admin/laudos/${novoId}`);
  };

  const laudosFiltrados = laudos.filter(l => {
    const matchBusca = 
      l.numero.toLowerCase().includes(busca.toLowerCase()) ||
      l.tipo.toLowerCase().includes(busca.toLowerCase()) ||
      (l.clienteNome && l.clienteNome.toLowerCase().includes(busca.toLowerCase())) ||
      (l.ativoIdentificacao && l.ativoIdentificacao.toLowerCase().includes(busca.toLowerCase()));
    const matchStatus = filtroStatus === 'todos' || l.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1565D8] text-xs font-bold uppercase tracking-wider mb-2">
          <FileText className="w-4 h-4" />
          <span>Suíte de Laudos de Engenharia Mecânica</span>
        </div>
        <h2 className="text-2xl font-black text-[#0B1E3D] tracking-tight">
          Central de Laudos e Auditorias Técnicas
        </h2>
        <p className="text-xs text-slate-500 max-w-3xl mt-1">
          Catálogo completo com os 14 módulos normativos especializados da VL Engenharia. Cada módulo integra fluxo passo a passo, cálculo quantitativo de riscos HRN, evidências fotográficas e parecer assistido por IA.
        </p>
      </div>

      {/* SECTION 6: CATALOG OF 14 SPECIALIZED MODULES */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-extrabold text-[#0B1E3D] uppercase tracking-wider">
            Catálogo de Módulos Oficiais (14 Módulos)
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {MODULOS_LAUDO_CATALOGO.length} Módulos Disponíveis
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MODULOS_LAUDO_CATALOGO.map((mod) => {
            const IconComp = ICON_MAP[mod.iconName] || FileText;
            const isNovo = mod.status.includes('NOVO');

            return (
              <div
                key={mod.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-[#1565D8]/40 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1565D8] flex items-center justify-center group-hover:bg-[#1565D8] group-hover:text-white transition-colors">
                      <IconComp className="w-5 h-5" />
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                      isNovo
                        ? 'bg-purple-100 text-purple-800 border border-purple-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {mod.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#0B1E3D] leading-snug group-hover:text-[#1565D8] transition-colors">
                      {mod.nome}
                    </h4>
                    <span className="inline-block text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded mt-1.5">
                      {mod.escopo}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {mod.descricao}
                  </p>
                </div>

                {isColaborador && (
                  <button
                    onClick={() => iniciarModulo(mod)}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#0B1E3D] hover:bg-[#1565D8] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
                  >
                    <span>{mod.botao}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTIVE & PAST REPORTS LIST */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-[#0B1E3D]">
              Laudos Cadastrados no Sistema ({laudos.length})
            </h3>
            <p className="text-xs text-slate-500">
              Relatórios em elaboração em campo, auditorias finalizadas e ARTs protocoladas
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por número, cliente ou ativo..."
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#1565D8]"
              />
            </div>

            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700"
            >
              <option value="todos">Todos os Status</option>
              <option value="rascunho">Rascunho / Campo</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="finalizado">Finalizado (ART)</option>
            </select>
          </div>
        </div>

        {laudosFiltrados.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
            <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600">Nenhum laudo encontrado com esses critérios.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Número Oficial</th>
                  <th className="py-3 px-3">Módulo / Serviço</th>
                  <th className="py-3 px-3">Cliente</th>
                  <th className="py-3 px-3">Equipamento Auditado</th>
                  <th className="py-3 px-3">Data</th>
                  <th className="py-3 px-3">Risco HRN</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {laudosFiltrados.map((laudo) => (
                  <tr key={laudo.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold font-mono text-[#0B1E3D] block">
                        {laudo.numero}
                      </span>
                      {laudo.artNumero && (
                        <span className="text-[10px] text-[#1565D8] font-mono">
                          ART: {laudo.artNumero}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">
                      {laudo.tipo}
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      {laudo.clienteNome}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {laudo.ativoIdentificacao || '—'}
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      {laudo.dataInspecao}
                    </td>
                    <td className="py-3 px-3">
                      {laudo.hrnCalculoGeral ? (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${laudo.hrnCalculoGeral.cor}`}>
                          {laudo.hrnCalculoGeral.nivel} ({laudo.hrnCalculoGeral.score})
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Não avaliado</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        laudo.status === 'finalizado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {laudo.status === 'finalizado' ? 'Finalizado' : 'Em Campo'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setLaudoPdfExportar(laudo)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs cursor-pointer"
                          title="Exportar laudo para PDF com cabeçalho e rodapé da VL Engenharia"
                        >
                          <Download className="w-3 h-3" />
                          <span>PDF</span>
                        </button>
                        <button
                          onClick={() => navigate(`/admin/laudos/${laudo.id}`)}
                          className="px-3 py-1 rounded-lg bg-[#1565D8] hover:bg-[#0b4fb8] text-white font-bold text-[11px] shadow-xs cursor-pointer"
                        >
                          Abrir Editor
                        </button>
                        {isColaborador && (
                          <button
                            onClick={() => {
                              if (confirm(`Excluir o laudo ${laudo.numero}?`)) removerLaudo(laudo.id);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-red-600"
                            title="Remover"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL INICIAR NOVO LAUDO */}
      {modalCriarAberto && moduloSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-[10px] font-bold text-[#1565D8] uppercase tracking-wider">
                  Novo Laudo Técnico
                </span>
                <h3 className="text-lg font-bold text-[#0B1E3D]">
                  {moduloSelecionado.nome}
                </h3>
              </div>
              <button onClick={() => setModalCriarAberto(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCriarConfirmado} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cliente Solicitante *</label>
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
                <label className="block font-bold text-slate-700 mb-1">Equipamento / Ativo Auditado *</label>
                <select
                  value={ativoId}
                  onChange={(e) => setAtivoId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800"
                >
                  <option value="">Selecione o equipamento...</option>
                  {ativos.filter(a => a.clienteId === clienteId).map(a => (
                    <option key={a.id} value={a.id}>{a.identificacao} ({a.tipo})</option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-slate-600 text-[11px] leading-relaxed">
                Este módulo aplicará o checklist técnico de <strong>{moduloSelecionado.escopo}</strong>, permitindo o preenchimento de evidências in loco, fotos com anotações e cálculo quantitativo HRN.
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalCriarAberto(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#1565D8] hover:bg-[#0b4fb8] text-white font-bold shadow-md"
                >
                  Iniciar Auditoria de Campo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Exportação PDF com Cabeçalho e Rodapé Oficial */}
      {laudoPdfExportar && (
        <LaudoPdfExportModal
          laudo={laudoPdfExportar}
          cliente={clientes.find(c => c.id === laudoPdfExportar.clienteId || c.razaoSocial === laudoPdfExportar.clienteNome)}
          ativo={ativos.find(a => a.id === laudoPdfExportar.ativoId || a.identificacao === laudoPdfExportar.ativoIdentificacao)}
          isOpen={Boolean(laudoPdfExportar)}
          onClose={() => setLaudoPdfExportar(null)}
        />
      )}

    </div>
  );
};
