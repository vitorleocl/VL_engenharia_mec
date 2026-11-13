import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, ClipboardCheck, FileSpreadsheet } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

type FiltroStatusDashboard = 'todos' | 'art_emitida' | 'em_elaboracao' | 'aguardando_art';

export const DashboardView: React.FC = () => {
  const { 
    laudos, 
    clientes, 
    ativos, 
    orcamentos 
  } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [filtroStatus, setFiltroStatus] = useState<FiltroStatusDashboard>('todos');

  // Métricas reais
  const comArt = useMemo(() => laudos.filter(l => l.status === 'finalizado').length, [laudos]);
  const emElaboracao = useMemo(() => laudos.filter(l => l.status === 'em_andamento').length, [laudos]);
  const aguardandoArt = useMemo(
    () => laudos.filter(l => l.status === 'rascunho' || l.status === 'em_revisao' || !l.status).length,
    [laudos]
  );
  const emAbertoTotal = emElaboracao + aguardandoArt;

  const clientesAtivos = clientes.length;
  const equipamentosTotal = ativos.length;
  const orcamentosAbertos = orcamentos.filter(o => o.status === 'enviado' || o.status === 'rascunho').length;

  // Saudação dinâmica por hora local e primeiro nome
  const hora = new Date().getHours();
  const saudacaoPeriodo = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
  const primeiroNome = currentUser?.nome ? currentUser.nome.trim().split(' ')[0] : 'Vitor';

  // Laudos ordenados e filtrados pelo chip selecionado
  const laudosOrdenados = useMemo(() => {
    return [...laudos].sort(
      (a, b) => new Date(b.atualizadoEm || b.criadoEm).getTime() - new Date(a.atualizadoEm || a.criadoEm).getTime()
    );
  }, [laudos]);

  const laudosRecentesFiltrados = useMemo(() => {
    const filtrados = laudosOrdenados.filter(l => {
      if (filtroStatus === 'art_emitida') return l.status === 'finalizado';
      if (filtroStatus === 'em_elaboracao') return l.status === 'em_andamento';
      if (filtroStatus === 'aguardando_art') return l.status === 'rascunho' || l.status === 'em_revisao' || !l.status;
      return true;
    });
    return filtrados.slice(0, 6);
  }, [laudosOrdenados, filtroStatus]);

  // Percentuais para barra segmentada do fluxo de laudos
  const totalLaudos = laudos.length;
  const pctElaboracao = totalLaudos > 0 ? Math.round((emElaboracao / totalLaudos) * 100) : 0;
  const pctAguardando = totalLaudos > 0 ? Math.round((aguardandoArt / totalLaudos) * 100) : 0;
  const pctComArt = totalLaudos > 0 ? Math.max(0, 100 - pctElaboracao - pctAguardando) : 0;

  const getStatusBadge = (status?: string) => {
    if (status === 'finalizado') {
      return (
        <span className="inline-flex items-center gap-2 py-0.5 px-3 rounded-full text-[0.8rem] font-medium border border-current text-[var(--adm-ok,#34d399)] whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-current shrink-0" aria-hidden="true" />
          <span>ART emitida</span>
        </span>
      );
    }
    if (status === 'em_andamento') {
      return (
        <span className="inline-flex items-center gap-2 py-0.5 px-3 rounded-full text-[0.8rem] font-medium border border-current text-[var(--adm-blue-soft,#6ea1ff)] whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-current shrink-0" aria-hidden="true" />
          <span>Em elaboração</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-2 py-0.5 px-3 rounded-full text-[0.8rem] font-medium border border-current text-[var(--adm-warn,#fbbf24)] whitespace-nowrap">
        <span className="w-2 h-2 rounded-full bg-current shrink-0" aria-hidden="true" />
        <span>Aguardando ART</span>
      </span>
    );
  };

  return (
    <div className="space-y-7 max-w-[1200px]">
      
      {/* 1. Barra de Boas-vindas e Ações Principais */}
      <section className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <h1 className="text-[1.85rem] sm:text-[2rem] font-semibold tracking-[-0.015em] text-[var(--adm-text,#f4f7fc)] leading-tight">
            {saudacaoPeriodo}, {primeiroNome}
          </h1>
          <p className="text-[var(--adm-mut,#a9b8cf)] text-[0.95rem] mt-1 font-normal leading-relaxed">
            Você tem {emAbertoTotal} {emAbertoTotal === 1 ? 'laudo pendente de conclusão' : 'laudos pendentes de conclusão'} e {orcamentosAbertos} {orcamentosAbertos === 1 ? 'orçamento em aberto' : 'orçamentos em aberto'} (de {orcamentos.length} no total).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/checklists-campo?novo=1"
            className="h-[44px] px-4 rounded-lg border border-[var(--adm-line,rgba(159,176,200,0.16))] bg-[var(--adm-card,#0f2038)] hover:border-[#6ea1ff] text-[var(--adm-text,#f4f7fc)] text-[0.85rem] font-medium inline-flex items-center gap-2 transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#6ea1ff]"
          >
            <ClipboardCheck className="w-4 h-4 text-[var(--adm-blue-soft,#6ea1ff)]" />
            <span>Novo checklist</span>
          </Link>

          <Link
            to="/admin/orcamentos?novo=1"
            className="h-[44px] px-4 rounded-lg border border-[var(--adm-line,rgba(159,176,200,0.16))] bg-[var(--adm-card,#0f2038)] hover:border-[#6ea1ff] text-[var(--adm-text,#f4f7fc)] text-[0.85rem] font-medium inline-flex items-center gap-2 transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#6ea1ff]"
          >
            <FileSpreadsheet className="w-4 h-4 text-[var(--adm-blue-soft,#6ea1ff)]" />
            <span>Novo orçamento</span>
          </Link>

          <Link
            to="/admin/laudos?novo=1"
            className="h-[44px] px-5 rounded-lg bg-[var(--adm-blue,#2160db)] hover:brightness-110 text-white text-[0.88rem] font-medium inline-flex items-center gap-2 transition-all shadow-xs focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#6ea1ff]"
          >
            <Plus className="w-[18px] h-[18px]" />
            <span>Novo laudo</span>
          </Link>
        </div>
      </section>

      {/* 2. Faixa de KPIs */}
      <section 
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border border-[var(--adm-line,rgba(159,176,200,0.16))] rounded-[14px] bg-[var(--adm-card,#0f2038)] overflow-hidden" 
        aria-label="Resumo"
      >
        <Link 
          to="/admin/laudos?status=Em"
          className="p-5 sm:p-6 border-b sm:border-b-0 border-r border-[var(--adm-line,rgba(159,176,200,0.16))] hover:bg-[rgba(110,161,255,0.07)] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#6ea1ff] focus-visible:outline-offset-[-2px] block no-underline text-inherit"
          title="Ver laudos em elaboração ou revisão"
        >
          <b className="block text-[2rem] font-semibold leading-[1.1] text-[var(--adm-text,#f4f7fc)]">
            {emAbertoTotal}
          </b>
          <span className="text-[var(--adm-mut,#a9b8cf)] text-[0.9rem] mt-1 block">
            Em aberto / revisão
          </span>
        </Link>

        <Link 
          to="/admin/laudos?status=ART"
          className="p-5 sm:p-6 border-b sm:border-b-0 sm:border-r border-[var(--adm-line,rgba(159,176,200,0.16))] hover:bg-[rgba(110,161,255,0.07)] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#6ea1ff] focus-visible:outline-offset-[-2px] block no-underline text-inherit"
          title="Ver laudos finalizados com ART"
        >
          <b className="block text-[2rem] font-semibold leading-[1.1] text-[var(--adm-text,#f4f7fc)]">
            {comArt}
          </b>
          <span className="text-[var(--adm-mut,#a9b8cf)] text-[0.9rem] mt-1 block">
            Com ART emitida
          </span>
        </Link>

        <Link 
          to="/admin/clientes"
          className="p-5 sm:p-6 border-b lg:border-b-0 border-r border-[var(--adm-line,rgba(159,176,200,0.16))] hover:bg-[rgba(110,161,255,0.07)] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#6ea1ff] focus-visible:outline-offset-[-2px] block no-underline text-inherit"
          title="Ver clientes cadastrados"
        >
          <b className="block text-[2rem] font-semibold leading-[1.1] text-[var(--adm-text,#f4f7fc)]">
            {clientesAtivos}
          </b>
          <span className="text-[var(--adm-mut,#a9b8cf)] text-[0.9rem] mt-1 block">
            Clientes ativos
          </span>
        </Link>

        <Link 
          to="/admin/ativos"
          className="p-5 sm:p-6 border-r border-[var(--adm-line,rgba(159,176,200,0.16))] hover:bg-[rgba(110,161,255,0.07)] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#6ea1ff] focus-visible:outline-offset-[-2px] block no-underline text-inherit"
          title="Ver inventário de equipamentos"
        >
          <b className="block text-[2rem] font-semibold leading-[1.1] text-[var(--adm-text,#f4f7fc)]">
            {equipamentosTotal}
          </b>
          <span className="text-[var(--adm-mut,#a9b8cf)] text-[0.9rem] mt-1 block">
            Equipamentos
          </span>
        </Link>

        <Link 
          to="/admin/orcamentos"
          className="p-5 sm:p-6 hover:bg-[rgba(110,161,255,0.07)] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#6ea1ff] focus-visible:outline-offset-[-2px] block no-underline text-inherit col-span-2 sm:col-span-1"
          title={`${orcamentosAbertos} aguardando aprovação de ${orcamentos.length} orçamentos cadastrados`}
        >
          <b className="block text-[2rem] font-semibold leading-[1.1] text-[var(--adm-text,#f4f7fc)]">
            {orcamentosAbertos}
          </b>
          <span className="text-[var(--adm-mut,#a9b8cf)] text-[0.9rem] mt-1 block">
            Orçamentos em aberto
          </span>
          <small className="block text-[0.75rem] text-[var(--adm-mut,#a9b8cf)] opacity-80 mt-0.5">
            de {orcamentos.length} no total
          </small>
        </Link>
      </section>

      {/* 3. Fluxo dos laudos (Barra segmentada usando só dados reais da tela) */}
      <section className="bg-[var(--adm-card,#0f2038)] border border-[var(--adm-line,rgba(159,176,200,0.16))] rounded-[14px] p-5 sm:p-6 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-[1.05rem] font-semibold text-[var(--adm-text,#f4f7fc)]">
              Fluxo dos laudos
            </h2>
            <span className="text-[0.82rem] text-[var(--adm-mut,#a9b8cf)]">
              Em elaboração {emElaboracao} · Aguardando ART {aguardandoArt} · Com ART {comArt}
            </span>
          </div>
          <Link
            to="/admin/orcamentos"
            className="text-[0.82rem] font-medium text-[var(--adm-mut,#a9b8cf)] hover:text-[var(--adm-blue-soft,#6ea1ff)] transition-colors"
          >
            Orçamentos em aberto: <strong className="text-[var(--adm-text,#f4f7fc)]">{orcamentosAbertos}</strong> de {orcamentos.length}
          </Link>
        </div>

        {/* Barra segmentada proporcional */}
        <div
          className="h-3 w-full rounded-full bg-[rgba(159,176,200,0.12)] overflow-hidden flex gap-0.5"
          role="img"
          aria-label={`Distribuição de ${totalLaudos} laudos: ${emElaboracao} em elaboração, ${aguardandoArt} aguardando ART, ${comArt} com ART emitida`}
        >
          {emElaboracao > 0 && (
            <div
              data-flow=""
              style={{ width: `${pctElaboracao}%` }}
              className="h-full bg-[var(--adm-blue-soft,#6ea1ff)] transition-all"
              title={`Em elaboração: ${emElaboracao}`}
            />
          )}
          {aguardandoArt > 0 && (
            <div
              data-flow=""
              style={{ width: `${pctAguardando}%` }}
              className="h-full bg-[var(--adm-warn,#fbbf24)] transition-all"
              title={`Aguardando ART: ${aguardandoArt}`}
            />
          )}
          {comArt > 0 && (
            <div
              data-flow=""
              style={{ width: `${pctComArt}%` }}
              className="h-full bg-[var(--adm-ok,#34d399)] transition-all"
              title={`ART emitida: ${comArt}`}
            />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[0.8rem] text-[var(--adm-mut,#a9b8cf)]">
          <span className="inline-flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--adm-blue-soft,#6ea1ff)]" aria-hidden="true" />
            <span>Em elaboração ({emElaboracao})</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--adm-warn,#fbbf24)]" aria-hidden="true" />
            <span>Aguardando ART ({aguardandoArt})</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--adm-ok,#34d399)]" aria-hidden="true" />
            <span>ART emitida ({comArt})</span>
          </span>
        </div>
      </section>

      {/* 4. Laudos Recentes com Filtros Rápidos e Linha Clicável */}
      <section className="bg-[var(--adm-card,#0f2038)] border border-[var(--adm-line,rgba(159,176,200,0.16))] rounded-[14px] p-6 sm:p-7 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-[1.2rem] font-semibold text-[var(--adm-text,#f4f7fc)]">
              Laudos recentes
            </h2>

            <div className="flex items-center gap-2 flex-wrap">
              {(
                [
                  { id: 'todos', label: 'Todos', count: laudos.length },
                  { id: 'art_emitida', label: 'ART emitida', count: comArt },
                  { id: 'em_elaboracao', label: 'Em elaboração', count: emElaboracao },
                  { id: 'aguardando_art', label: 'Aguardando ART', count: aguardandoArt },
                ] as const
              ).map((tab) => {
                const ativo = filtroStatus === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFiltroStatus(tab.id)}
                    className={`px-3 py-1.5 rounded-full text-[0.78rem] font-medium border transition-colors cursor-pointer ${
                      ativo
                        ? 'bg-[var(--adm-blue,#2160db)] text-white border-[var(--adm-blue,#2160db)]'
                        : 'bg-transparent text-[var(--adm-mut,#a9b8cf)] border-[var(--adm-line,rgba(159,176,200,0.16))] hover:border-[var(--adm-blue-soft,#6ea1ff)] hover:text-[var(--adm-text,#f4f7fc)]'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                );
              })}

              <Link 
                to="/admin/laudos" 
                className="text-[0.85rem] font-medium text-[var(--adm-blue-soft,#6ea1ff)] hover:underline ml-1"
              >
                Ver todos
              </Link>
            </div>
          </div>

          {laudos.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <p className="text-[var(--adm-mut,#a9b8cf)] text-[0.92rem]">
                Nenhum laudo cadastrado ainda. Crie o primeiro laudo a partir de um checklist concluído ou modelo pré-pronto.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <Link
                  to="/admin/checklists-campo?novo=1"
                  className="h-10 px-4 rounded-lg border border-[var(--adm-line,rgba(159,176,200,0.16))] text-[var(--adm-text,#f4f7fc)] text-[0.85rem] font-medium inline-flex items-center gap-1.5 hover:border-[#6ea1ff] transition-colors"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  <span>Abrir checklist de campo</span>
                </Link>
                <Link
                  to="/admin/laudos?novo=1"
                  className="h-10 px-4 rounded-lg bg-[var(--adm-blue,#2160db)] text-white text-[0.85rem] font-medium inline-flex items-center gap-1.5 hover:brightness-110 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Criar primeiro laudo</span>
                </Link>
              </div>
            </div>
          ) : laudosRecentesFiltrados.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <p className="text-[var(--adm-mut,#a9b8cf)] text-[0.9rem]">
                Nenhum laudo encontrado neste status.
              </p>
              <button
                type="button"
                onClick={() => setFiltroStatus('todos')}
                className="text-[0.82rem] font-medium text-[var(--adm-blue-soft,#6ea1ff)] hover:underline cursor-pointer"
              >
                Mostrar todos os laudos
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[0.92rem]">
                <thead>
                  <tr className="border-b border-[var(--adm-line,rgba(159,176,200,0.16))] text-[var(--adm-mut,#a9b8cf)] text-[0.84rem]">
                    <th className="py-2.5 px-3 text-left font-medium">Laudo</th>
                    <th className="py-2.5 px-3 text-left font-medium">Cliente</th>
                    <th className="py-2.5 px-3 text-left font-medium">Data</th>
                    <th className="py-2.5 px-3 text-left font-medium">Status</th>
                    <th className="py-2.5 px-2 text-right font-medium w-8" aria-label="Abrir"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--adm-line,rgba(159,176,200,0.16))]">
                  {laudosRecentesFiltrados.map((laudo) => {
                    const cliente = clientes.find(c => c.id === laudo.clienteId);
                    const nomeClienteSeguro =
                      cliente?.nomeFantasia ||
                      cliente?.razaoSocial ||
                      (laudo.clienteNome && !/^cliente$/i.test(laudo.clienteNome.trim())
                        ? laudo.clienteNome
                        : 'Cliente não vinculado');
                    const dataFormatada = new Date(laudo.criadoEm || Date.now()).toLocaleDateString('pt-BR');

                    return (
                      <tr 
                        key={laudo.id} 
                        onClick={() => navigate(`/admin/laudos/${laudo.id}`)}
                        className="group hover:bg-[rgba(110,161,255,0.06)] transition-colors cursor-pointer"
                      >
                        <td className="py-4 px-3 align-top">
                          <b className="block font-semibold text-[var(--adm-text,#f4f7fc)] group-hover:text-[var(--adm-blue-soft,#6ea1ff)] transition-colors">
                            {laudo.numero}
                          </b>
                          <small 
                            className="block text-[var(--adm-mut,#a9b8cf)] text-[0.8rem] mt-0.5 leading-snug"
                            title={laudo.tipo}
                          >
                            {laudo.tipo}
                          </small>
                        </td>
                        <td className="py-4 px-3 align-top text-[var(--adm-text,#f4f7fc)]">
                          {nomeClienteSeguro}
                        </td>
                        <td className="py-4 px-3 align-top text-[var(--adm-mut,#a9b8cf)] whitespace-nowrap">
                          {dataFormatada}
                        </td>
                        <td className="py-4 px-3 align-top">
                          {getStatusBadge(laudo.status)}
                        </td>
                        <td className="py-4 px-2 align-middle text-right">
                          <ArrowRight
                            className="w-4 h-4 text-[var(--adm-mut,#a9b8cf)] opacity-35 group-hover:opacity-100 group-hover:translate-x-1 group-hover:text-[var(--adm-blue-soft,#6ea1ff)] transition-all inline-block"
                            aria-hidden="true"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

    </div>
  );
};
