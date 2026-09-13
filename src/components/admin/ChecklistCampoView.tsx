import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardCheck, 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Building2, 
  Cpu, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  MinusCircle, 
  MapPin, 
  Eye, 
  Edit3, 
  Trash2, 
  Share2, 
  ArrowRight, 
  Sliders, 
  Check, 
  UserCheck, 
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ChecklistCampo } from '../../types';
import { ChecklistCampoFormModal } from './ChecklistCampoFormModal';
import { ChecklistCampoPdfModal } from './ChecklistCampoPdfModal';
import { ChecklistPermissoesModal } from './ChecklistPermissoesModal';

export const ChecklistCampoView: React.FC = () => {
  const { checklistsCampo, clientes, removerChecklistCampo, criarLaudoPorTaxonomia, adicionarOrcamento } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const isMaster = currentUser?.role === 'master';
  const isCliente = currentUser?.role === 'cliente';

  // Modais
  const [modalFormAberto, setModalFormAberto] = useState(false);
  const [checklistEditando, setChecklistEditando] = useState<ChecklistCampo | null>(null);
  const [checklistVisualizandoPdf, setChecklistVisualizandoPdf] = useState<ChecklistCampo | null>(null);
  const [modalPermissoesAberto, setModalPermissoesAberto] = useState(false);

  // Filtros
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'rascunho' | 'finalizado'>('todos');
  const [filtroCliente, setFiltroCliente] = useState<string>('todos');

  // Filtragem se usuário for cliente
  const checklistsVisiveis = checklistsCampo.filter(chk => {
    if (isCliente) {
      // Cliente só vê os seus próprios e que foram disponibilizados
      return chk.clienteId === (currentUser as any)?.clienteIdVinculado && chk.disponibilizadoParaCliente;
    }
    return true;
  });

  const filtrados = checklistsVisiveis.filter(chk => {
    const texto = `${chk.numero} ${chk.clienteNome} ${chk.ativoIdentificacao} ${chk.tipoLaudoNome} ${chk.responsavelNome}`.toLowerCase();
    const bateBusca = texto.includes(busca.toLowerCase());
    const bateStatus = filtroStatus === 'todos' || chk.status === filtroStatus;
    const bateCliente = filtroCliente === 'todos' || chk.clienteId === filtroCliente;
    return bateBusca && bateStatus && bateCliente;
  });

  // Métricas
  const total = checklistsVisiveis.length;
  const finalizados = checklistsVisiveis.filter(c => c.status === 'finalizado').length;
  const rascunhos = checklistsVisiveis.filter(c => c.status === 'rascunho').length;
  const disponibilizados = checklistsVisiveis.filter(c => c.disponibilizadoParaCliente).length;

  const handleCriarLaudo = (chk: ChecklistCampo) => {
    if (chk.vinculadoALaudoId) {
      navigate(`/admin/laudos/${chk.vinculadoALaudoId}`);
      return;
    }

    try {
      const laudoId = criarLaudoPorTaxonomia({
        tipoLaudoId: chk.tipoLaudoId,
        clienteId: chk.clienteId,
        ativoId: chk.ativoId,
        dataInspecao: chk.dataPreenchimento.slice(0, 10),
        modoPreenchimento: 'em_branco'
      });
      navigate(`/admin/laudos/${laudoId}?checklistOrigem=${chk.id}`);
    } catch (err) {
      console.error(err);
      navigate('/admin/laudos');
    }
  };

  const handleCriarOrcamento = (chk: ChecklistCampo) => {
    if (chk.vinculadoAOrcamentoId) {
      navigate(`/admin/orcamentos/${chk.vinculadoAOrcamentoId}/editar`);
      return;
    }

    const valorEstimado = 3500;
    const novoOrcId = adicionarOrcamento({
      clienteId: chk.clienteId,
      clienteNome: chk.clienteNome,
      clienteCnpj: chk.clienteCnpj,
      ativoId: chk.ativoId,
      ativoIdentificacao: chk.ativoIdentificacao,
      servico: chk.tipoLaudoNome || chk.tipoLaudoId,
      descricaoEscopo: `Proposta Técnico-Comercial de Adequação Técnica com base nas constatações in loco do Checklist de Campo ${chk.numero}.`,
      valorTotal: valorEstimado,
      status: 'em_elaboracao',
      checklistCampoOrigemId: chk.id,
      validadeDias: 15,
      condicoesPagamento: '30% de entrada e 70% na emissão do Laudo conclusivo com ART.',
      prazoExecucaoDias: 10,
    });

    navigate(`/admin/orcamentos/${novoOrcId}/editar`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Principal da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Checklists de Campo
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  In Loco
                </span>
              </h1>
              <p className="text-xs text-slate-500">
                Preenchimento preliminar rápido durante a visita técnica com fotos, rubrica e GPS
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {isMaster && (
            <button
              onClick={() => setModalPermissoesAberto(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-300 shadow-2xs"
            >
              <Sliders className="w-4 h-4 text-purple-600" />
              Habilitar Tipos
            </button>
          )}

          {!isCliente && (
            <button
              onClick={() => {
                setChecklistEditando(null);
                setModalFormAberto(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs hover:shadow-sm scale-100 hover:scale-101"
            >
              <Plus className="w-4 h-4" />
              Novo Checklist de Campo
            </button>
          )}
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Total de Checklists
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{total}</span>
            <span className="text-xs text-slate-400 font-medium">In Loco</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Finalizados & Assinados
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700">{finalizados}</span>
            <span className="text-xs text-emerald-600 font-medium">Com Rubrica</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-xs">
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Em Rascunho
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-700">{rascunhos}</span>
            <span className="text-xs text-amber-600 font-medium">Aguardando</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-xs">
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider block flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            Portal do Cliente
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-blue-700">{disponibilizados}</span>
            <span className="text-xs text-blue-600 font-medium">Liberados</span>
          </div>
        </div>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por número, cliente, ativo ou norma..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto">
          {/* Filtro Status */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold text-slate-600">
            <button
              onClick={() => setFiltroStatus('todos')}
              className={`px-3 py-1 rounded-md transition-all ${filtroStatus === 'todos' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltroStatus('finalizado')}
              className={`px-3 py-1 rounded-md transition-all ${filtroStatus === 'finalizado' ? 'bg-emerald-600 text-white shadow-2xs font-bold' : 'hover:text-slate-900'}`}
            >
              Finalizados
            </button>
            <button
              onClick={() => setFiltroStatus('rascunho')}
              className={`px-3 py-1 rounded-md transition-all ${filtroStatus === 'rascunho' ? 'bg-amber-500 text-white shadow-2xs font-bold' : 'hover:text-slate-900'}`}
            >
              Rascunhos
            </button>
          </div>

          {/* Filtro Cliente */}
          {!isCliente && (
            <select
              value={filtroCliente}
              onChange={(e) => setFiltroCliente(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos os Clientes</option>
              {clientes.map(cli => (
                <option key={cli.id} value={cli.id}>{cli.razaoSocial}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Grid de Checklists */}
      {filtrados.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center">
          <ClipboardCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">Nenhum checklist de campo encontrado</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {busca || filtroStatus !== 'todos' || filtroCliente !== 'todos'
              ? 'Tente ajustar os filtros de busca para encontrar o registro desejado.'
              : 'Clique no botão acima para iniciar um novo preenchimento preliminar in loco.'}
          </p>
          {!isCliente && (
            <button
              onClick={() => {
                setChecklistEditando(null);
                setModalFormAberto(true);
              }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Checklist de Campo
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtrados.map(chk => {
            const todosItens = [...(chk.itens || []), ...(chk.itensExtras || [])];
            const confs = todosItens.filter(i => i.status === 'conforme').length;
            const naoConfs = todosItens.filter(i => i.status === 'nao_conforme').length;
            const nas = todosItens.filter(i => i.status === 'nao_aplicavel').length;

            return (
              <div
                key={chk.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Topo do Card */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {chk.numero}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            chk.status === 'finalizado'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {chk.status === 'finalizado' ? 'Finalizado' : 'Rascunho'}
                        </span>
                        {chk.disponibilizadoParaCliente && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                            <Eye className="w-3 h-3" /> Cliente
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 mt-2 leading-snug">
                        {chk.tipoLaudoNome || chk.tipoLaudoId}
                      </h3>
                    </div>

                    <div className="text-right text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 justify-end">
                        <Calendar className="w-3 h-3" />
                        {new Date(chk.dataPreenchimento).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  {/* Informações de Cliente e Ativo */}
                  <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs text-slate-700 mb-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-900 truncate">
                        {chk.clienteNome || 'Cliente não definido'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-600 truncate">
                        {chk.ativoIdentificacao || 'Ativo não informado'}
                      </span>
                    </div>
                    {chk.geolocalizacao && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                        <span className="truncate">
                          {chk.geolocalizacao.enderecoAproximado || `Lat ${chk.geolocalizacao.lat.toFixed(4)}, Lng ${chk.geolocalizacao.lng.toFixed(4)}`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Placares de Conformidade In Loco */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                      <span className="block font-black text-sm text-emerald-700">{confs}</span>
                      <span className="text-[10px] text-emerald-800 font-semibold">Conformes</span>
                    </div>
                    <div className="p-2 rounded-lg bg-rose-50 border border-rose-100">
                      <span className="block font-black text-sm text-rose-700">{naoConfs}</span>
                      <span className="text-[10px] text-rose-800 font-semibold">Não Conf.</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">
                      <span className="block font-black text-sm text-slate-700">{nas}</span>
                      <span className="text-[10px] text-slate-600 font-semibold">N/A</span>
                    </div>
                  </div>
                </div>

                {/* Ações do Card */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setChecklistVisualizandoPdf(chk)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                    >
                      <Download className="w-3.5 h-3.5" />
                      PDF / Assinatura
                    </button>

                    {!isCliente && (
                      <button
                        onClick={() => {
                          setChecklistEditando(chk);
                          setModalFormAberto(true);
                        }}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Editar Checklist"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}

                    {!isCliente && (
                      <button
                        onClick={() => {
                          if (confirm(`Tem certeza que deseja excluir o checklist ${chk.numero}?`)) {
                            removerChecklistCampo(chk.id);
                          }
                        }}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Excluir Checklist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Ações de Desdobramento: Laudo ou Orçamento */}
                  {!isCliente && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCriarOrcamento(chk)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                        title="Gerar Orçamento Comercial a partir deste checklist"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Orçamento</span>
                      </button>

                      <button
                        onClick={() => handleCriarLaudo(chk)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-950 rounded-lg transition-colors shadow-2xs"
                        title="Gerar Laudo Técnico Completo com base nas constatações deste checklist"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-200" />
                        <span>Gerar Laudo</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modais */}
      {modalFormAberto && (
        <ChecklistCampoFormModal
          checklistParaEditar={checklistEditando}
          onClose={() => {
            setModalFormAberto(false);
            setChecklistEditando(null);
          }}
          onSaved={(id) => {
            setModalFormAberto(false);
            setChecklistEditando(null);
          }}
        />
      )}

      {checklistVisualizandoPdf && (
        <ChecklistCampoPdfModal
          checklist={checklistVisualizandoPdf}
          onClose={() => setChecklistVisualizandoPdf(null)}
        />
      )}

      {modalPermissoesAberto && (
        <ChecklistPermissoesModal
          onClose={() => setModalPermissoesAberto(false)}
        />
      )}
    </div>
  );
};
