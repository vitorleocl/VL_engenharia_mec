import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Sliders,
  RefreshCw,
  AlertTriangle,
  FileText,
  Edit3,
  X,
  ClipboardCheck,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ChecklistCampoFormModal } from './ChecklistCampoFormModal';
import { ChecklistCampoPdfModal } from './ChecklistCampoPdfModal';
import { ChecklistModelosEditor } from './ChecklistModelosEditor';
import { ChecklistCampo } from '../../types';

function extrairTagCurta(identificacao?: string): string {
  if (!identificacao) return 'Ativo';
  const match = identificacao.match(/^([^(]+)/);
  return (match ? match[1] : identificacao).trim();
}

export const ChecklistCampoView: React.FC = () => {
  const {
    checklistsCampo,
    clientes,
    ativos,
    orcamentos,
    laudos,
    pendingSyncCount,
    syncConflicts,
    sincronizandoOffline,
    sincronizarChecklistsOffline,
    resolverConflitoChecklist,
    gerarOuAtualizarLaudoDeChecklist,
  } = useData();
  const { isOnline } = useAuth();
  const navigate = useNavigate();

  const [modalFormAberto, setModalFormAberto] = useState(false);
  const [checklistParaEditar, setChecklistParaEditar] = useState<ChecklistCampo | null>(null);
  const [checklistVisualizandoPdf, setChecklistVisualizandoPdf] = useState<ChecklistCampo | null>(null);
  const [modalModelosAberto, setModalModelosAberto] = useState(false);
  const [buscaTexto, setBuscaTexto] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'rascunho' | 'finalizado'>('todos');

  // Ordenar mais recentes primeiro e filtrar
  const checklistsFiltrados = useMemo(() => {
    return [...checklistsCampo]
      .sort((a, b) => {
        const ta = new Date(a.dataPreenchimento || a.criadoEm || 0).getTime();
        const tb = new Date(b.dataPreenchimento || b.criadoEm || 0).getTime();
        return tb - ta;
      })
      .filter((chk) => {
        if (filtroStatus !== 'todos' && chk.status !== filtroStatus) return false;
        if (buscaTexto.trim()) {
          const termo = buscaTexto.toLowerCase();
          const cli = clientes.find((c) => c.id === chk.clienteId);
          const atv = ativos.find((a) => a.id === chk.ativoId);
          const orc = orcamentos.find((o) => o.id === chk.vinculadoAOrcamentoId);
          return (
            (chk.numero || '').toLowerCase().includes(termo) ||
            (chk.tipoLaudoNome || chk.categoriaLaudo || '').toLowerCase().includes(termo) ||
            (cli?.razaoSocial || cli?.nomeFantasia || chk.clienteNome || '').toLowerCase().includes(termo) ||
            (atv?.identificacao || chk.ativoIdentificacao || '').toLowerCase().includes(termo) ||
            (orc?.codigoProposta || '').toLowerCase().includes(termo)
          );
        }
        return true;
      });
  }, [checklistsCampo, filtroStatus, buscaTexto, clientes, ativos, orcamentos]);

  const abrirNovoChecklist = () => {
    setChecklistParaEditar(null);
    setModalFormAberto(true);
  };

  const abrirEditarChecklist = (chk: ChecklistCampo) => {
    setChecklistParaEditar(chk);
    setModalFormAberto(true);
  };

  const handleGerarOuAbrirLaudo = (chk: ChecklistCampo) => {
    const { laudoId } = gerarOuAtualizarLaudoDeChecklist(chk);
    navigate(`/admin/laudos/${laudoId}`);
  };

  return (
    <div className="space-y-4 max-w-[920px] mx-auto">
      {/* Cabeçalho estilo mobile/painel VL Engenharia */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold tracking-tight text-[var(--adm-text)] leading-tight">
            Checklists
          </h1>
          <p className="text-[13.5px] sm:text-[14.5px] text-[var(--adm-mut)] mt-0.5">
            Vistorias de campo ligadas ao orçamento e ao laudo.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          {/* Indicador de Sincronização B6 */}
          <button
            type="button"
            onClick={() => sincronizarChecklistsOffline()}
            disabled={sincronizandoOffline}
            title={
              isOnline
                ? pendingSyncCount > 0
                  ? 'Clique para sincronizar itens pendentes'
                  : 'Todos os checklists estão sincronizados'
                : 'Sem conexão — alterações salvas localmente no IndexedDB'
            }
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
              !isOnline
                ? 'bg-[var(--adm-card)] border-amber-500/45 text-amber-500'
                : pendingSyncCount > 0
                ? 'bg-[var(--adm-card)] border-[var(--adm-blue-soft,#6ea1ff)]/50 text-[var(--adm-blue-soft,#6ea1ff)]'
                : 'bg-[var(--adm-card)] border-[var(--adm-line)] text-[var(--adm-text)]'
            }`}
          >
            {sincronizandoOffline ? (
              <RefreshCw className="w-3 h-3 animate-spin text-[var(--adm-blue-soft)]" />
            ) : (
              <span
                className={`w-2 h-2 rounded-full ${
                  !isOnline
                    ? 'bg-amber-400'
                    : pendingSyncCount > 0
                    ? 'bg-[var(--adm-blue-soft,#6ea1ff)]'
                    : 'bg-emerald-500'
                }`}
              />
            )}
            <span>
              {!isOnline
                ? pendingSyncCount > 0
                  ? `Offline · ${pendingSyncCount} pendente${pendingSyncCount > 1 ? 's' : ''}`
                  : 'Offline'
                : sincronizandoOffline
                ? 'Sincronizando...'
                : pendingSyncCount > 0
                ? `${pendingSyncCount} ite${pendingSyncCount > 1 ? 'ns' : 'm'} pendente${pendingSyncCount > 1 ? 's' : ''}`
                : 'Sincronizado'}
            </span>
          </button>

          {/* Atalho Configurações de Modelos B4 */}
          <button
            type="button"
            onClick={() => setModalModelosAberto(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--adm-card)] border border-[var(--adm-line)] text-[var(--adm-mut)] hover:text-[var(--adm-text)] hover:border-[var(--adm-blue-soft)] transition cursor-pointer"
            title="Configurar modelos de checklist por tipo de serviço"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Modelos</span>
          </button>
        </div>
      </div>

      {/* Botão Primário + Nova vistoria */}
      <button
        type="button"
        onClick={abrirNovoChecklist}
        className="w-full min-h-[46px] px-4 py-3 rounded-xl bg-[var(--adm-blue,#2160db)] hover:brightness-110 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
      >
        <Plus className="w-4 h-4" />
        <span>Nova vistoria</span>
      </button>

      {/* Avisos de Conflito Offline B6 */}
      {syncConflicts.length > 0 && (
        <div className="space-y-2.5">
          {syncConflicts.map((conf, cIdx) => (
            <div
              key={conf.id ? `${conf.id}-${cIdx}` : `conf-${cIdx}`}
              className="p-4 rounded-2xl border border-amber-500/50 bg-amber-500/10 space-y-2.5"
            >
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-[var(--adm-text)] block text-sm">
                    Conflito de sincronização detectado em {conf.numero}
                  </strong>
                  <span className="text-[var(--adm-mut)]">
                    Este checklist foi alterado offline no aparelho e também no servidor. Ambas as versões foram preservadas. Escolha como resolver:
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => resolverConflitoChecklist(conf.id, 'ambos')}
                  className="px-3 py-1.5 rounded-lg bg-[var(--adm-blue,#2160db)] text-white text-xs font-semibold cursor-pointer"
                >
                  Manter ambas (criar cópia)
                </button>
                <button
                  type="button"
                  onClick={() => resolverConflitoChecklist(conf.id, 'local')}
                  className="px-3 py-1.5 rounded-lg border border-[var(--adm-line)] bg-[var(--adm-card)] text-[var(--adm-text)] text-xs font-semibold cursor-pointer"
                >
                  Usar versão deste aparelho
                </button>
                <button
                  type="button"
                  onClick={() => resolverConflitoChecklist(conf.id, 'remoto')}
                  className="px-3 py-1.5 rounded-lg border border-[var(--adm-line)] bg-[var(--adm-card)] text-[var(--adm-mut)] text-xs font-semibold cursor-pointer"
                >
                  Usar versão da nuvem
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filtros (Todas | Em andamento | Concluídas) e Busca */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
        <div className="inline-flex items-center gap-1.5 flex-wrap">
          {(
            [
              { id: 'todos', label: 'Todas' },
              { id: 'rascunho', label: 'Em andamento' },
              { id: 'finalizado', label: 'Concluídas' },
            ] as const
          ).map((tab) => {
            const ativo = filtroStatus === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFiltroStatus(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  ativo
                    ? 'bg-[var(--adm-blue,#2160db)] text-white border-[var(--adm-blue,#2160db)]'
                    : 'bg-[var(--adm-card)] text-[var(--adm-mut)] border-[var(--adm-line)] hover:text-[var(--adm-text)]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[var(--adm-mut)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={buscaTexto}
            onChange={(e) => setBuscaTexto(e.target.value)}
            placeholder="Buscar TAG, cliente, número..."
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-[var(--adm-card)] border border-[var(--adm-line)] text-[var(--adm-text)] placeholder:text-[var(--adm-mut)] focus:outline-none focus:border-[var(--adm-blue-soft)]"
          />
        </div>
      </div>

      {/* Lista de Cartões de Vistoria (B8 + Screenshots Dark/Light) */}
      {checklistsFiltrados.length === 0 ? (
        <div className="bg-[var(--adm-card)] border border-[var(--adm-line)] rounded-2xl p-10 text-center space-y-3">
          <ClipboardCheck className="w-10 h-10 text-[var(--adm-mut)] mx-auto opacity-50" />
          <h3 className="text-sm font-bold text-[var(--adm-text)]">
            Nenhuma vistoria encontrada
          </h3>
          <p className="text-xs text-[var(--adm-mut)] max-w-sm mx-auto">
            Inicie uma nova vistoria técnica ligada a um orçamento aprovado e equipamento.
          </p>
          <button
            type="button"
            onClick={abrirNovoChecklist}
            className="px-4 py-2 rounded-xl bg-[var(--adm-blue,#2160db)] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nova vistoria</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {checklistsFiltrados.map((chk, chkIdx) => {
            const cliente = clientes.find((c) => c.id === chk.clienteId);
            const ativo = ativos.find((a) => a.id === chk.ativoId);
            const orcamento = orcamentos.find((o) => o.id === chk.vinculadoAOrcamentoId);
            const laudoVinculado = laudos.find(
              (l) => l.checklistCampoOrigemId === chk.id || l.id === chk.vinculadoALaudoId
            );

            const todosItens = [...(chk.itens || []), ...(chk.itensExtras || [])];
            const total = todosItens.length;
            const conformes = todosItens.filter((i) => i.status === 'conforme').length;
            const naoConformes = todosItens.filter((i) => i.status === 'nao_conforme').length;
            const respondidos = todosItens.filter((i) => i.status && i.status !== 'pendente').length;

            const emAndamento = chk.status !== 'finalizado';
            const tagAtivo = extrairTagCurta(ativo?.identificacao || chk.ativoIdentificacao);
            const nomeCliente =
              cliente?.razaoSocial || cliente?.nomeFantasia || chk.clienteNome || 'Cliente';
            const dataBr = new Date(
              chk.dataPreenchimento || chk.criadoEm || Date.now()
            ).toLocaleDateString('pt-BR');

            return (
              <article
                key={chk.id ? `${chk.id}-${chkIdx}` : `chk-${chkIdx}`}
                className="bg-[var(--adm-card)] border border-[var(--adm-line)] rounded-2xl p-4 sm:p-5 space-y-3 transition-colors"
              >
                {/* Linha superior: Código · ● Status */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 text-xs text-[var(--adm-mut)] flex-wrap">
                    <span className="font-mono font-semibold text-[var(--adm-text)]">
                      {chk.numero || chk.id}
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          emAndamento ? 'bg-amber-400' : 'bg-emerald-500'
                        }`}
                      />
                      <span className={emAndamento ? 'text-amber-500' : 'text-emerald-500'}>
                        {emAndamento ? 'Em andamento' : 'Concluída'}
                      </span>
                    </span>
                  </div>

                  {/* Vínculos compactos (Orçamento / Laudo) */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {orcamento && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[var(--adm-bg)] border border-[var(--adm-line)] text-[var(--adm-mut)]">
                        {orcamento.codigoProposta || orcamento.id}
                      </span>
                    )}
                    {laudoVinculado && (
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/laudos/${laudoVinculado.id}`)}
                        className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/35 text-emerald-500 hover:underline inline-flex items-center gap-1 cursor-pointer"
                        title="Abrir laudo vinculado"
                      >
                        <FileText className="w-3 h-3" />
                        <span>{laudoVinculado.numero}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => abrirEditarChecklist(chk)}
                      className="p-1.5 rounded-lg text-[var(--adm-mut)] hover:text-[var(--adm-text)] hover:bg-[var(--adm-bg)] transition cursor-pointer"
                      title="Editar / continuar vistoria"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Título e Subtítulo */}
                <div className="space-y-1">
                  <h2 className="text-[15.5px] sm:text-[17px] font-bold text-[var(--adm-text)] leading-snug">
                    {chk.tipoLaudoNome || chk.categoriaLaudo}
                  </h2>
                  <p className="text-xs sm:text-[13px] text-[var(--adm-mut)]">
                    {tagAtivo} · {nomeCliente}
                  </p>
                </div>

                {/* Barra de Progresso Segmentada por Item */}
                {total > 0 && (
                  <div
                    className="flex items-center gap-1.5 pt-0.5"
                    aria-label={`${respondidos} de ${total} itens verificados`}
                  >
                    {todosItens.map((it, itIdx) => {
                      const corSegmento =
                        it.status === 'conforme'
                          ? 'bg-emerald-500'
                          : it.status === 'nao_conforme'
                          ? 'bg-rose-500'
                          : it.status === 'nao_aplicavel'
                          ? 'bg-slate-400/55'
                          : 'bg-slate-500/25';
                      return (
                        <span
                          key={`${it.id || 'item'}-${itIdx}`}
                          className={`h-[5px] flex-1 rounded-full ${corSegmento}`}
                          title={`${it.numero ? `${it.numero} ` : ''}${it.descricao}: ${it.status}`}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Resumo numérico + Data */}
                <p className="text-xs text-[var(--adm-mut)]">
                  {emAndamento ? (
                    <>
                      {respondidos} de {total} itens · {naoConformes}{' '}
                      {naoConformes === 1 ? 'não conforme' : 'não conformes'} · {dataBr}
                    </>
                  ) : (
                    <>
                      {total} itens · {conformes} {conformes === 1 ? 'conforme' : 'conformes'} ·{' '}
                      {naoConformes} {naoConformes === 1 ? 'não conforme' : 'não conformes'} ·{' '}
                      {dataBr}
                    </>
                  )}
                </p>

                {/* Botões de Ação */}
                {emAndamento ? (
                  <button
                    type="button"
                    onClick={() => abrirEditarChecklist(chk)}
                    className="w-full min-h-[42px] py-2.5 px-4 rounded-xl bg-[var(--adm-blue,#2160db)] hover:brightness-110 text-white text-xs sm:text-sm font-semibold transition cursor-pointer"
                  >
                    Continuar
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setChecklistVisualizandoPdf(chk)}
                      className="min-h-[42px] py-2.5 px-4 rounded-xl border border-[var(--adm-line)] bg-transparent hover:border-[var(--adm-blue-soft)] text-[var(--adm-text)] text-xs sm:text-sm font-semibold transition cursor-pointer"
                    >
                      Ver
                    </button>

                    <button
                      type="button"
                      onClick={() => handleGerarOuAbrirLaudo(chk)}
                      className="min-h-[42px] py-2.5 px-4 rounded-xl border border-[var(--adm-line)] bg-transparent hover:border-[var(--adm-blue-soft)] text-[var(--adm-text)] text-xs sm:text-sm font-semibold transition cursor-pointer"
                      title={
                        laudoVinculado
                          ? `Abrir ou atualizar o laudo ${laudoVinculado.numero} sem duplicar`
                          : 'Gerar rascunho de laudo preenchido a partir desta vistoria'
                      }
                    >
                      {laudoVinculado ? 'Abrir laudo' : 'Gerar laudo'}
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Modal de Formulário da Vistoria */}
      {modalFormAberto && (
        <ChecklistCampoFormModal
          checklistParaEditar={checklistParaEditar}
          onSaved={() => {
            setModalFormAberto(false);
            setChecklistParaEditar(null);
          }}
          onClose={() => {
            setModalFormAberto(false);
            setChecklistParaEditar(null);
          }}
        />
      )}

      {/* Modal de Visualização Preliminar */}
      {checklistVisualizandoPdf && (
        <ChecklistCampoPdfModal
          checklist={checklistVisualizandoPdf}
          onClose={() => setChecklistVisualizandoPdf(null)}
        />
      )}

      {/* Modal de Configuração de Modelos de Checklist (B4) */}
      {modalModelosAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-2 sm:p-5 overflow-y-auto">
          <div className="bg-[var(--adm-bg)] text-[var(--adm-text)] border border-[var(--adm-line)] rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl my-auto">
            <div className="px-5 py-3.5 border-b border-[var(--adm-line)] bg-[var(--adm-card)] flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--adm-mut)]">
                Configurações · Modelos de Checklist
              </span>
              <button
                type="button"
                onClick={() => setModalModelosAberto(false)}
                className="p-1.5 rounded-lg text-[var(--adm-mut)] hover:text-[var(--adm-text)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <ChecklistModelosEditor />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
