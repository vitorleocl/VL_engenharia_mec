import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  FileText,
  ClipboardCheck,
  Eye,
  ArrowUpRight,
  Link2,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Orcamento, Laudo, ChecklistCampo } from '../../types';
import { PropostaViewerModal } from './PropostaViewerModal';

function obterDataRefOrcamento(o: Orcamento): Date {
  const raw = o.faturadoEm || o.emitidaEm || o.criadoEm;
  const d = raw ? new Date(raw) : new Date();
  return isNaN(d.getTime()) ? new Date() : d;
}

function obterYm(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function formatarMesCurto(ym: string): string {
  const [ano, mes] = ym.split('-').map(Number);
  const d = new Date(ano, (mes || 1) - 1, 1);
  const m = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
  return `${m.charAt(0).toUpperCase() + m.slice(1)}/${String(ano).slice(-2)}`;
}

function formatarMesLongo(ym: string): string {
  const [ano, mes] = ym.split('-').map(Number);
  const d = new Date(ano, (mes || 1) - 1, 1);
  const label = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor || 0);
}

export const FaturamentoView: React.FC = () => {
  const {
    orcamentos,
    clientes,
    laudos,
    checklistsCampo,
    atualizarStatusOrcamento,
    associarOrcamentoAoLaudo,
  } = useData();
  const navigate = useNavigate();

  const [filtroAno, setFiltroAno] = useState<string>('');
  const [filtroMes, setFiltroMes] = useState<string>('');
  const [filtroClienteId, setFiltroClienteId] = useState<string>('');
  const [mesSelecionadoGrafico, setMesSelecionadoGrafico] = useState<string | null>(null);
  const [propostaVisualizando, setPropostaVisualizando] = useState<Orcamento | null>(null);
  const [laudoParaVincular, setLaudoParaVincular] = useState<Record<string, string>>({});

  // Todos os orçamentos faturados e aprovados
  const todosFaturados = useMemo(
    () =>
      orcamentos
        .filter((o) => o.status === 'faturado')
        .sort((a, b) => obterDataRefOrcamento(b).getTime() - obterDataRefOrcamento(a).getTime()),
    [orcamentos]
  );

  const todosAprovados = useMemo(
    () =>
      orcamentos
        .filter((o) => o.status === 'aprovado')
        .sort((a, b) => obterDataRefOrcamento(b).getTime() - obterDataRefOrcamento(a).getTime()),
    [orcamentos]
  );

  // Opções de filtro (Anos & Clientes)
  const anosDisponiveis = useMemo(() => {
    const anos = new Set<string>();
    todosFaturados.forEach((o) => anos.add(String(obterDataRefOrcamento(o).getFullYear())));
    if (anos.size === 0) anos.add(String(new Date().getFullYear()));
    return Array.from(anos).sort((a, b) => b.localeCompare(a));
  }, [todosFaturados]);

  const clientesFiltro = useMemo(() => {
    const mapa = new Map<string, string>();
    clientes.forEach((c) => mapa.set(c.id, c.nomeFantasia || c.razaoSocial));
    [...todosFaturados, ...todosAprovados].forEach((o) => {
      if (o.clienteId && !mapa.has(o.clienteId) && o.clienteNome) {
        mapa.set(o.clienteId, o.clienteNome);
      }
    });
    return Array.from(mapa.entries()).sort((a, b) => a[1].localeCompare(b[1], 'pt-BR'));
  }, [clientes, todosFaturados, todosAprovados]);

  // Faturados filtrados (ano, mês, cliente)
  const faturadosFiltrados = useMemo(() => {
    return todosFaturados.filter((o) => {
      const d = obterDataRefOrcamento(o);
      const ym = obterYm(d);
      if (filtroAno && String(d.getFullYear()) !== filtroAno) return false;
      if (filtroMes && ym !== filtroMes) return false;
      if (filtroClienteId && o.clienteId !== filtroClienteId) return false;
      return true;
    });
  }, [todosFaturados, filtroAno, filtroMes, filtroClienteId]);

  const aprovadosFiltrados = useMemo(() => {
    return todosAprovados.filter((o) => {
      if (filtroClienteId && o.clienteId !== filtroClienteId) return false;
      return true;
    });
  }, [todosAprovados, filtroClienteId]);

  // Helper para buscar serviços realizados vinculados (Laudos + Checklists)
  const obterServicosVinculados = (orc: Orcamento): {
    laudosVinculados: Laudo[];
    checklistsVinculados: ChecklistCampo[];
  } => {
    const laudosVinculados = laudos.filter(
      (l) =>
        l.orcamentoOrigemId === orc.id ||
        (orc.codigoProposta && l.orcamentoNumero === orc.codigoProposta) ||
        l.id === orc.laudoGeradoId
    );
    const checklistsVinculados = checklistsCampo.filter(
      (c) => c.vinculadoAOrcamentoId === orc.id
    );
    return { laudosVinculados, checklistsVinculados };
  };

  // KPIs
  const totalFaturado = useMemo(
    () => faturadosFiltrados.reduce((acc, o) => acc + (Number(o.valor) || 0), 0),
    [faturadosFiltrados]
  );

  const ticketMedio = useMemo(
    () => (faturadosFiltrados.length > 0 ? totalFaturado / faturadosFiltrados.length : 0),
    [totalFaturado, faturadosFiltrados.length]
  );

  const totalAprovadoAFaturar = useMemo(
    () => aprovadosFiltrados.reduce((acc, o) => acc + (Number(o.valor) || 0), 0),
    [aprovadosFiltrados]
  );

  const totalServicosVinculados = useMemo(() => {
    const laudosIds = new Set<string>();
    const chksIds = new Set<string>();
    faturadosFiltrados.forEach((o) => {
      const { laudosVinculados, checklistsVinculados } = obterServicosVinculados(o);
      laudosVinculados.forEach((l) => laudosIds.add(l.id));
      checklistsVinculados.forEach((c) => chksIds.add(c.id));
    });
    return {
      total: laudosIds.size + chksIds.size,
      laudosCount: laudosIds.size,
      checklistsCount: chksIds.size,
    };
  }, [faturadosFiltrados, laudos, checklistsCampo]);

  // Série Mensal para o Dashboard de Evolução (considera últimos 6 meses ou meses presentes nos dados)
  const serieMensal = useMemo(() => {
    const baseFaturados = todosFaturados.filter((o) => {
      const d = obterDataRefOrcamento(o);
      if (filtroAno && String(d.getFullYear()) !== filtroAno) return false;
      if (filtroClienteId && o.clienteId !== filtroClienteId) return false;
      return true;
    });

    const mapa = new Map<
      string,
      {
        ym: string;
        valorFaturado: number;
        qtdFaturados: number;
        qtdServicosVinculados: number;
        qtdLaudosConcluidosMes: number;
      }
    >();

    // Garantir janela de pelo menos 6 meses até o mês mais recente (ou mês atual)
    const refMaisRecente =
      baseFaturados.length > 0
        ? obterDataRefOrcamento(baseFaturados[0])
        : new Date();
    const anoBase = filtroAno ? Number(filtroAno) : refMaisRecente.getFullYear();
    const mesBase = filtroAno
      ? Number(filtroAno) === new Date().getFullYear()
        ? new Date().getMonth()
        : 11
      : refMaisRecente.getMonth();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(anoBase, mesBase - i, 1);
      const ym = obterYm(d);
      mapa.set(ym, {
        ym,
        valorFaturado: 0,
        qtdFaturados: 0,
        qtdServicosVinculados: 0,
        qtdLaudosConcluidosMes: 0,
      });
    }

    baseFaturados.forEach((o) => {
      const ym = obterYm(obterDataRefOrcamento(o));
      const atual = mapa.get(ym) || {
        ym,
        valorFaturado: 0,
        qtdFaturados: 0,
        qtdServicosVinculados: 0,
        qtdLaudosConcluidosMes: 0,
      };
      const { laudosVinculados, checklistsVinculados } = obterServicosVinculados(o);
      atual.valorFaturado += Number(o.valor) || 0;
      atual.qtdFaturados += 1;
      atual.qtdServicosVinculados += laudosVinculados.length + checklistsVinculados.length;
      mapa.set(ym, atual);
    });

    // Serviços realizados no mês (laudos finalizados + checklists finalizados do filtro de cliente)
    laudos.forEach((l) => {
      if (filtroClienteId && l.clienteId !== filtroClienteId) return;
      const d = new Date(l.atualizadoEm || l.criadoEm);
      if (isNaN(d.getTime())) return;
      const ym = obterYm(d);
      if (mapa.has(ym) && (l.status === 'finalizado' || l.orcamentoOrigemId)) {
        const entry = mapa.get(ym)!;
        entry.qtdLaudosConcluidosMes += 1;
      }
    });

    return Array.from(mapa.values()).sort((a, b) => a.ym.localeCompare(b.ym));
  }, [todosFaturados, filtroAno, filtroClienteId, laudos, checklistsCampo]);

  const maxValorMensal = useMemo(
    () => Math.max(...serieMensal.map((m) => m.valorFaturado), 1),
    [serieMensal]
  );

  // Variação vs mês anterior
  const comparativoMeses = useMemo(() => {
    const comFaturamento = serieMensal.filter((m) => m.valorFaturado > 0);
    if (comFaturamento.length < 2) return null;
    const atual = comFaturamento[comFaturamento.length - 1];
    const anterior = comFaturamento[comFaturamento.length - 2];
    const diff = atual.valorFaturado - anterior.valorFaturado;
    const pct = anterior.valorFaturado > 0 ? (diff / anterior.valorFaturado) * 100 : 0;
    return { atual, anterior, diff, pct };
  }, [serieMensal]);

  // Ranking por Cliente
  const rankingClientes = useMemo(() => {
    const porCli = new Map<
      string,
      { id: string; nome: string; valor: number; qtd: number; servicos: number }
    >();
    faturadosFiltrados.forEach((o) => {
      const cli = clientes.find((c) => c.id === o.clienteId);
      const nome = cli?.nomeFantasia || cli?.razaoSocial || o.clienteNome || 'Cliente';
      const key = o.clienteId || nome;
      const { laudosVinculados, checklistsVinculados } = obterServicosVinculados(o);
      const atual = porCli.get(key) || { id: key, nome, valor: 0, qtd: 0, servicos: 0 };
      atual.valor += Number(o.valor) || 0;
      atual.qtd += 1;
      atual.servicos += laudosVinculados.length + checklistsVinculados.length;
      porCli.set(key, atual);
    });
    return Array.from(porCli.values()).sort((a, b) => b.valor - a.valor);
  }, [faturadosFiltrados, clientes, laudos, checklistsCampo]);

  // Agrupamento da Linha do Tempo por Mês
  const timelinePorMes = useMemo(() => {
    const grupos = new Map<
      string,
      {
        ym: string;
        label: string;
        totalMes: number;
        itens: Orcamento[];
      }
    >();

    faturadosFiltrados.forEach((o) => {
      const ym = obterYm(obterDataRefOrcamento(o));
      const atual = grupos.get(ym) || {
        ym,
        label: formatarMesLongo(ym),
        totalMes: 0,
        itens: [],
      };
      atual.totalMes += Number(o.valor) || 0;
      atual.itens.push(o);
      grupos.set(ym, atual);
    });

    return Array.from(grupos.values()).sort((a, b) => b.ym.localeCompare(a.ym));
  }, [faturadosFiltrados]);

  const mesDestaqueInfo = useMemo(() => {
    const targetYm = mesSelecionadoGrafico || filtroMes;
    if (!targetYm) return null;
    return serieMensal.find((m) => m.ym === targetYm) || null;
  }, [mesSelecionadoGrafico, filtroMes, serieMensal]);

  const handleVincularLaudo = (orcamentoId: string) => {
    const laudoId = laudoParaVincular[orcamentoId];
    if (!laudoId) return;
    associarOrcamentoAoLaudo(orcamentoId, laudoId);
    setLaudoParaVincular((prev) => ({ ...prev, [orcamentoId]: '' }));
  };

  return (
    <div className="space-y-7 max-w-[1240px]">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight text-[var(--adm-text,#f4f7fc)]">
            Faturamento
          </h1>
          <p className="text-[var(--adm-mut,#a9b8cf)] text-[14.5px] sm:text-[15.5px] mt-0.5">
            Evolução mensal das propostas faturadas e vínculo com os serviços técnicos executados.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filtroAno}
            onChange={(e) => {
              setFiltroAno(e.target.value);
              setFiltroMes('');
            }}
            aria-label="Filtrar por ano"
            className="py-2 px-3 text-xs font-semibold rounded-lg border border-[var(--adm-line,rgba(159,176,200,0.16))] bg-[var(--adm-card,#0f2038)] text-[var(--adm-text,#f4f7fc)] cursor-pointer"
          >
            <option value="">Todos os anos</option>
            {anosDisponiveis.map((ano) => (
              <option key={ano} value={ano}>
                {ano}
              </option>
            ))}
          </select>

          <select
            value={filtroClienteId}
            onChange={(e) => setFiltroClienteId(e.target.value)}
            aria-label="Filtrar por cliente"
            className="py-2 px-3 text-xs font-semibold rounded-lg border border-[var(--adm-line,rgba(159,176,200,0.16))] bg-[var(--adm-card,#0f2038)] text-[var(--adm-text,#f4f7fc)] cursor-pointer max-w-[220px]"
          >
            <option value="">Todos os clientes</option>
            {clientesFiltro.map(([id, nome]) => (
              <option key={id} value={id}>
                {nome}
              </option>
            ))}
          </select>

          {(filtroAno || filtroMes || filtroClienteId) && (
            <button
              type="button"
              onClick={() => {
                setFiltroAno('');
                setFiltroMes('');
                setFiltroClienteId('');
                setMesSelecionadoGrafico(null);
              }}
              className="py-2 px-3 text-xs font-semibold rounded-lg border border-[var(--adm-line,rgba(159,176,200,0.16))] text-[var(--adm-mut,#a9b8cf)] hover:text-[var(--adm-text,#f4f7fc)] cursor-pointer"
            >
              Limpar filtros
            </button>
          )}

          <Link
            to="/admin/orcamentos"
            className="h-9 px-3.5 rounded-lg bg-[var(--adm-blue,#2160db)] hover:brightness-110 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition"
          >
            <span>Ver orçamentos</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Faixa de KPIs */}
      <section
        className="grid grid-cols-2 lg:grid-cols-4 border border-[var(--adm-line,rgba(159,176,200,0.16))] rounded-[14px] bg-[var(--adm-card,#0f2038)] overflow-hidden"
        aria-label="Indicadores de faturamento"
      >
        <div className="p-5 sm:p-6 border-b lg:border-b-0 border-r border-[var(--adm-line,rgba(159,176,200,0.16))]">
          <span className="text-xs font-medium text-[var(--adm-mut,#a9b8cf)] block">
            Total faturado
          </span>
          <b className="block text-[1.55rem] sm:text-[1.85rem] font-semibold leading-tight text-[var(--adm-text,#f4f7fc)] mt-1 font-mono tabular-nums">
            {formatarMoeda(totalFaturado)}
          </b>
          <span className="text-xs text-[var(--adm-mut,#a9b8cf)] mt-1 block">
            {faturadosFiltrados.length}{' '}
            {faturadosFiltrados.length === 1 ? 'proposta faturada' : 'propostas faturadas'}
          </span>
        </div>

        <div className="p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-[var(--adm-line,rgba(159,176,200,0.16))]">
          <span className="text-xs font-medium text-[var(--adm-mut,#a9b8cf)] block">
            Ticket médio
          </span>
          <b className="block text-[1.55rem] sm:text-[1.85rem] font-semibold leading-tight text-[var(--adm-text,#f4f7fc)] mt-1 font-mono tabular-nums">
            {formatarMoeda(ticketMedio)}
          </b>
          <span className="text-xs text-[var(--adm-mut,#a9b8cf)] mt-1 block">
            {comparativoMeses ? (
              <>
                {comparativoMeses.diff >= 0 ? '+' : ''}
                {comparativoMeses.pct.toFixed(0)}% vs mês anterior
              </>
            ) : (
              'Média por proposta faturada'
            )}
          </span>
        </div>

        <div className="p-5 sm:p-6 border-r border-[var(--adm-line,rgba(159,176,200,0.16))]">
          <span className="text-xs font-medium text-[var(--adm-mut,#a9b8cf)] block">
            Aprovados a faturar
          </span>
          <b className="block text-[1.55rem] sm:text-[1.85rem] font-semibold leading-tight text-[var(--adm-text,#f4f7fc)] mt-1 font-mono tabular-nums">
            {formatarMoeda(totalAprovadoAFaturar)}
          </b>
          <span className="text-xs text-[var(--adm-mut,#a9b8cf)] mt-1 block">
            {aprovadosFiltrados.length}{' '}
            {aprovadosFiltrados.length === 1 ? 'proposta aguardando faturamento' : 'propostas aguardando faturamento'}
          </span>
        </div>

        <div className="p-5 sm:p-6">
          <span className="text-xs font-medium text-[var(--adm-mut,#a9b8cf)] block">
            Serviços realizados vinculados
          </span>
          <b className="block text-[1.55rem] sm:text-[1.85rem] font-semibold leading-tight text-[var(--adm-text,#f4f7fc)] mt-1 font-mono tabular-nums">
            {totalServicosVinculados.total}
          </b>
          <span className="text-xs text-[var(--adm-mut,#a9b8cf)] mt-1 block">
            {totalServicosVinculados.laudosCount} laudos · {totalServicosVinculados.checklistsCount} vistorias
          </span>
        </div>
      </section>

      {/* Dashboard de Evolução Mensal + Distribuição por Cliente */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 items-start">
        {/* Gráfico de Evolução ao Longo dos Meses */}
        <section className="bg-[var(--adm-card,#0f2038)] border border-[var(--adm-line,rgba(159,176,200,0.16))] rounded-[14px] p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--adm-line,rgba(159,176,200,0.16))]">
            <div>
              <h2 className="text-[1.1rem] font-semibold text-[var(--adm-text,#f4f7fc)] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--adm-blue-soft,#6ea1ff)]" />
                <span>Evolução mensal de faturamento</span>
              </h2>
              <p className="text-xs text-[var(--adm-mut,#a9b8cf)] mt-0.5">
                Clique em um mês para filtrar a linha do tempo abaixo.
              </p>
            </div>
            {filtroMes && (
              <button
                type="button"
                onClick={() => {
                  setFiltroMes('');
                  setMesSelecionadoGrafico(null);
                }}
                className="text-xs font-semibold text-[var(--adm-blue-soft,#6ea1ff)] hover:underline cursor-pointer self-start sm:self-auto"
              >
                Exibir todos os meses
              </button>
            )}
          </div>

          {/* Barras comparativas por mês */}
          <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-[210px] pt-6">
            {serieMensal.map((mes) => {
              const alturaPct =
                mes.valorFaturado > 0
                  ? Math.max(10, Math.round((mes.valorFaturado / maxValorMensal) * 100))
                  : 4;
              const ativo = filtroMes === mes.ym;
              const hoverAtivo = mesSelecionadoGrafico === mes.ym;

              return (
                <button
                  key={mes.ym}
                  type="button"
                  onClick={() => {
                    const proximo = ativo ? '' : mes.ym;
                    setFiltroMes(proximo);
                    setMesSelecionadoGrafico(proximo || null);
                  }}
                  onMouseEnter={() => setMesSelecionadoGrafico(mes.ym)}
                  onMouseLeave={() => setMesSelecionadoGrafico(null)}
                  className="flex flex-col items-center justify-end h-full group cursor-pointer focus:outline-none"
                  title={`${formatarMesLongo(mes.ym)}: ${formatarMoeda(mes.valorFaturado)}`}
                >
                  <span className="text-[10.5px] font-mono tabular-nums text-[var(--adm-mut,#a9b8cf)] mb-1.5 truncate max-w-full">
                    {mes.valorFaturado > 0
                      ? mes.valorFaturado >= 1000
                        ? `R$${(mes.valorFaturado / 1000).toFixed(1).replace('.', ',')}k`
                        : `R$${Math.round(mes.valorFaturado)}`
                      : '—'}
                  </span>

                  <div className="w-full max-w-[44px] flex-1 flex items-end justify-center">
                    <div
                      style={{ height: `${alturaPct}%` }}
                      className={`w-full rounded-t-md transition-all duration-200 ${
                        ativo
                          ? 'bg-[var(--adm-blue,#2160db)] ring-2 ring-[var(--adm-blue-soft,#6ea1ff)]'
                          : mes.valorFaturado > 0
                          ? hoverAtivo
                            ? 'bg-[var(--adm-blue-soft,#6ea1ff)]'
                            : 'bg-[var(--adm-blue,#2160db)]/80 group-hover:bg-[var(--adm-blue-soft,#6ea1ff)]'
                          : 'bg-[var(--adm-line,rgba(159,176,200,0.16))]'
                      }`}
                    />
                  </div>

                  <span
                    className={`mt-2 text-[11px] font-medium ${
                      ativo
                        ? 'text-[var(--adm-blue-soft,#6ea1ff)] font-bold'
                        : 'text-[var(--adm-mut,#a9b8cf)]'
                    }`}
                  >
                    {formatarMesCurto(mes.ym)}
                  </span>

                  <span className="text-[10px] font-mono text-[var(--adm-mut,#a9b8cf)]/80 tabular-nums">
                    {mes.qtdFaturados} fat · {mes.qtdServicosVinculados + mes.qtdLaudosConcluidosMes} srv
                  </span>
                </button>
              );
            })}
          </div>

          {/* Faixa de detalhe do mês focado */}
          {mesDestaqueInfo && (
            <div className="pt-3 border-t border-[var(--adm-line,rgba(159,176,200,0.16))] flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-[var(--adm-text,#f4f7fc)]">
                {formatarMesLongo(mesDestaqueInfo.ym)}
              </span>
              <div className="flex items-center gap-4 font-mono tabular-nums text-[var(--adm-mut,#a9b8cf)]">
                <span>
                  Faturado:{' '}
                  <strong className="text-[var(--adm-text,#f4f7fc)]">
                    {formatarMoeda(mesDestaqueInfo.valorFaturado)}
                  </strong>
                </span>
                <span>{mesDestaqueInfo.qtdFaturados} propostas</span>
                <span>{mesDestaqueInfo.qtdServicosVinculados} serviços vinculados</span>
              </div>
            </div>
          )}
        </section>

        {/* Breakdown por Cliente */}
        <section className="bg-[var(--adm-card,#0f2038)] border border-[var(--adm-line,rgba(159,176,200,0.16))] rounded-[14px] p-5 sm:p-6 space-y-4">
          <div className="pb-3 border-b border-[var(--adm-line,rgba(159,176,200,0.16))]">
            <h2 className="text-[1.1rem] font-semibold text-[var(--adm-text,#f4f7fc)]">
              Faturamento por cliente
            </h2>
            <p className="text-xs text-[var(--adm-mut,#a9b8cf)] mt-0.5">
              Participação na receita faturada do período.
            </p>
          </div>

          {rankingClientes.length === 0 ? (
            <p className="text-xs text-[var(--adm-mut,#a9b8cf)] py-8 text-center">
              Nenhuma proposta com status Faturado neste filtro.
            </p>
          ) : (
            <div className="space-y-3.5">
              {rankingClientes.map((cli) => {
                const pct = totalFaturado > 0 ? Math.round((cli.valor / totalFaturado) * 100) : 0;
                return (
                  <div key={cli.id} className="space-y-1.5">
                    <div className="flex items-baseline justify-between gap-2 text-xs">
                      <span className="font-semibold text-[var(--adm-text,#f4f7fc)] truncate">
                        {cli.nome}
                      </span>
                      <span className="font-mono font-semibold text-[var(--adm-text,#f4f7fc)] tabular-nums shrink-0">
                        {formatarMoeda(cli.valor)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[var(--adm-line,rgba(159,176,200,0.16))] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[var(--adm-blue,#2160db)]"
                        style={{ width: `${Math.max(4, pct)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[var(--adm-mut,#a9b8cf)]">
                      <span>
                        {cli.qtd} {cli.qtd === 1 ? 'proposta' : 'propostas'} · {cli.servicos}{' '}
                        {cli.servicos === 1 ? 'serviço vinculado' : 'serviços vinculados'}
                      </span>
                      <span className="font-mono tabular-nums">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Linha do Tempo de Faturamento & Serviços Realizados */}
      <section className="bg-[var(--adm-card,#0f2038)] border border-[var(--adm-line,rgba(159,176,200,0.16))] rounded-[14px] p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--adm-line,rgba(159,176,200,0.16))]">
          <div>
            <h2 className="text-[1.15rem] font-semibold text-[var(--adm-text,#f4f7fc)] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--adm-blue-soft,#6ea1ff)]" />
              <span>Linha do tempo · Orçamentos faturados e serviços realizados</span>
            </h2>
            <p className="text-xs text-[var(--adm-mut,#a9b8cf)] mt-0.5">
              Histórico cronológico com acesso direto aos laudos e checklists vinculados.
            </p>
          </div>
          <span className="text-xs font-mono text-[var(--adm-mut,#a9b8cf)] tabular-nums">
            {faturadosFiltrados.length}{' '}
            {faturadosFiltrados.length === 1 ? 'registro' : 'registros'}
          </span>
        </div>

        {timelinePorMes.length === 0 ? (
          <div className="py-10 text-center space-y-3">
            <p className="text-sm text-[var(--adm-mut,#a9b8cf)]">
              Nenhum orçamento marcado como <strong>Faturado</strong> ainda.
            </p>
            <p className="text-xs text-[var(--adm-mut,#a9b8cf)] max-w-md mx-auto">
              Altere o status de uma proposta na aba <strong>Orçamentos</strong> para <strong>Faturado</strong> ou fature uma proposta aprovada na lista abaixo.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {timelinePorMes.map((grupo) => (
              <div key={grupo.ym} className="space-y-4">
                {/* Cabeçalho do Mês na Linha do Tempo */}
                <div className="flex flex-wrap items-baseline justify-between gap-2 pb-2 border-b border-[var(--adm-line,rgba(159,176,200,0.16))]">
                  <h3 className="text-sm font-semibold text-[var(--adm-text,#f4f7fc)]">
                    {grupo.label}
                  </h3>
                  <div className="flex items-center gap-3 text-xs font-mono tabular-nums text-[var(--adm-mut,#a9b8cf)]">
                    <span>{grupo.itens.length} faturado{grupo.itens.length > 1 ? 's' : ''}</span>
                    <span>·</span>
                    <strong className="text-[var(--adm-text,#f4f7fc)]">
                      {formatarMoeda(grupo.totalMes)}
                    </strong>
                  </div>
                </div>

                {/* Lista vertical com linha conectora limpa */}
                <div className="relative pl-5 sm:pl-6 space-y-5 before:content-[''] before:absolute before:left-[6px] before:top-2 before:bottom-2 before:w-px before:bg-[var(--adm-line,rgba(159,176,200,0.22))]">
                  {grupo.itens.map((orc) => {
                    const cli = clientes.find((c) => c.id === orc.clienteId);
                    const nomeCliente = cli?.nomeFantasia || cli?.razaoSocial || orc.clienteNome || 'Cliente';
                    const dataRef = obterDataRefOrcamento(orc).toLocaleDateString('pt-BR');
                    const { laudosVinculados, checklistsVinculados } = obterServicosVinculados(orc);

                    // Laudos disponíveis do mesmo cliente (ou gerais) ainda não vinculados a este orçamento
                    const laudosElegiveis = laudos.filter(
                      (l) => !laudosVinculados.some((v) => v.id === l.id)
                    );

                    return (
                      <div key={orc.id} className="relative">
                        {/* Marcador cronológico */}
                        <span
                          aria-hidden="true"
                          className="absolute -left-[22px] sm:-left-[26px] top-1.5 w-3 h-3 rounded-full border-2 border-[var(--adm-blue-soft,#6ea1ff)] bg-[var(--adm-card,#0f2038)]"
                        />

                        <div className="border border-[var(--adm-line,rgba(159,176,200,0.16))] rounded-xl p-4 sm:p-5 bg-[var(--adm-bg,#0b1a30)]/45 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="space-y-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--adm-mut,#a9b8cf)]">
                                <span className="font-mono font-semibold text-[var(--adm-blue-soft,#6ea1ff)]">
                                  {orc.codigoProposta || orc.id}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span className="font-mono tabular-nums">{dataRef}</span>
                                <span aria-hidden="true">·</span>
                                <span>{nomeCliente}</span>
                              </div>
                              <h4 className="text-[15.5px] font-semibold text-[var(--adm-text,#f4f7fc)] leading-snug">
                                {orc.servico}
                              </h4>
                            </div>

                            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                              <span className="text-base sm:text-lg font-bold font-mono tabular-nums text-[var(--adm-ok,#34d399)]">
                                {formatarMoeda(orc.valor)}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setPropostaVisualizando(orc)}
                                  className="text-xs font-medium text-[var(--adm-blue-soft,#6ea1ff)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Proposta</span>
                                </button>
                                <span className="text-[var(--adm-mut,#a9b8cf)]">·</span>
                                <button
                                  type="button"
                                  onClick={() => atualizarStatusOrcamento(orc.id, 'aprovado')}
                                  className="text-xs text-[var(--adm-mut,#a9b8cf)] hover:text-[var(--adm-text,#f4f7fc)] cursor-pointer"
                                  title="Retornar status para Aprovado"
                                >
                                  Reabrir
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Serviços Realizados Vinculados */}
                          <div className="pt-3 border-t border-[var(--adm-line,rgba(159,176,200,0.16))] space-y-2.5">
                            <span className="text-xs font-medium text-[var(--adm-mut,#a9b8cf)] block">
                              Serviços técnicos realizados vinculados
                            </span>

                            {laudosVinculados.length === 0 && checklistsVinculados.length === 0 ? (
                              <p className="text-xs text-[var(--adm-mut,#a9b8cf)]/80">
                                Nenhum laudo ou vistoria vinculado ainda a este orçamento.
                              </p>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                {laudosVinculados.map((l) => (
                                  <button
                                    key={l.id}
                                    type="button"
                                    onClick={() => navigate(`/admin/laudos/${l.id}`)}
                                    className="text-left p-2.5 rounded-lg border border-[var(--adm-line,rgba(159,176,200,0.16))] hover:border-[var(--adm-blue-soft,#6ea1ff)] bg-[var(--adm-card,#0f2038)] transition flex items-center justify-between gap-2 cursor-pointer"
                                  >
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--adm-text,#f4f7fc)]">
                                        <FileText className="w-3.5 h-3.5 text-[var(--adm-blue-soft,#6ea1ff)] shrink-0" />
                                        <span className="font-mono">{l.numero}</span>
                                        <span className="text-[var(--adm-mut,#a9b8cf)] font-normal">
                                          · {l.status === 'finalizado' ? 'ART emitida' : 'Em elaboração'}
                                        </span>
                                      </div>
                                      <span className="text-[11px] text-[var(--adm-mut,#a9b8cf)] block truncate mt-0.5">
                                        {l.tipo}
                                      </span>
                                    </div>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-[var(--adm-mut,#a9b8cf)] shrink-0" />
                                  </button>
                                ))}

                                {checklistsVinculados.map((chk) => (
                                  <button
                                    key={chk.id}
                                    type="button"
                                    onClick={() => navigate('/admin/checklists-campo')}
                                    className="text-left p-2.5 rounded-lg border border-[var(--adm-line,rgba(159,176,200,0.16))] hover:border-[var(--adm-blue-soft,#6ea1ff)] bg-[var(--adm-card,#0f2038)] transition flex items-center justify-between gap-2 cursor-pointer"
                                  >
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--adm-text,#f4f7fc)]">
                                        <ClipboardCheck className="w-3.5 h-3.5 text-[var(--adm-ok,#34d399)] shrink-0" />
                                        <span className="font-mono">{chk.numero}</span>
                                        <span className="text-[var(--adm-mut,#a9b8cf)] font-normal">
                                          · {chk.status === 'finalizado' ? 'Concluída' : 'Em andamento'}
                                        </span>
                                      </div>
                                      <span className="text-[11px] text-[var(--adm-mut,#a9b8cf)] block truncate mt-0.5">
                                        {chk.tipoLaudoNome || chk.categoriaLaudo}
                                      </span>
                                    </div>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-[var(--adm-mut,#a9b8cf)] shrink-0" />
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Vincular laudo existente ao orçamento faturado */}
                            {laudosElegiveis.length > 0 && (
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                <select
                                  value={laudoParaVincular[orc.id] || ''}
                                  onChange={(e) =>
                                    setLaudoParaVincular((prev) => ({
                                      ...prev,
                                      [orc.id]: e.target.value,
                                    }))
                                  }
                                  className="text-xs py-1.5 px-2.5 rounded-lg border border-[var(--adm-line,rgba(159,176,200,0.16))] bg-[var(--adm-card,#0f2038)] text-[var(--adm-text,#f4f7fc)] max-w-xs"
                                >
                                  <option value="">Vincular laudo realizado...</option>
                                  {laudosElegiveis.map((l) => (
                                    <option key={l.id} value={l.id}>
                                      {l.numero} · {l.clienteNome || 'Cliente'} — {l.tipo}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  disabled={!laudoParaVincular[orc.id]}
                                  onClick={() => handleVincularLaudo(orc.id)}
                                  className="text-xs font-semibold py-1.5 px-3 rounded-lg border border-[var(--adm-line,rgba(159,176,200,0.16))] hover:border-[var(--adm-blue-soft,#6ea1ff)] text-[var(--adm-text,#f4f7fc)] disabled:opacity-45 inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Link2 className="w-3.5 h-3.5" />
                                  <span>Vincular</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Propostas Aprovadas Prontas para Faturar */}
      {aprovadosFiltrados.length > 0 && (
        <section className="bg-[var(--adm-card,#0f2038)] border border-[var(--adm-line,rgba(159,176,200,0.16))] rounded-[14px] p-5 sm:p-7 space-y-4">
          <div className="pb-3 border-b border-[var(--adm-line,rgba(159,176,200,0.16))] flex items-baseline justify-between gap-2">
            <div>
              <h2 className="text-[1.1rem] font-semibold text-[var(--adm-text,#f4f7fc)]">
                Propostas aprovadas aguardando faturamento
              </h2>
              <p className="text-xs text-[var(--adm-mut,#a9b8cf)] mt-0.5">
                Marque como Faturado após a conclusão ou emissão financeira.
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-[var(--adm-mut,#a9b8cf)]">
              {formatarMoeda(totalAprovadoAFaturar)}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-[var(--adm-line,rgba(159,176,200,0.16))] text-[var(--adm-mut,#a9b8cf)] text-xs">
                  <th className="py-2 px-3 font-medium">Proposta</th>
                  <th className="py-2 px-3 font-medium">Cliente</th>
                  <th className="py-2 px-3 font-medium">Serviço</th>
                  <th className="py-2 px-3 font-medium">Vinculados</th>
                  <th className="py-2 px-3 font-medium text-right">Valor</th>
                  <th className="py-2 px-3 font-medium text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--adm-line,rgba(159,176,200,0.16))]">
                {aprovadosFiltrados.map((orc) => {
                  const cli = clientes.find((c) => c.id === orc.clienteId);
                  const { laudosVinculados, checklistsVinculados } = obterServicosVinculados(orc);
                  const qtdVinc = laudosVinculados.length + checklistsVinculados.length;

                  return (
                    <tr key={orc.id} className="hover:bg-[rgba(110,161,255,0.05)]">
                      <td className="py-3 px-3 font-mono font-semibold text-[var(--adm-text,#f4f7fc)]">
                        {orc.codigoProposta || orc.id}
                      </td>
                      <td className="py-3 px-3 text-[var(--adm-text,#f4f7fc)]">
                        {cli?.nomeFantasia || cli?.razaoSocial || orc.clienteNome || 'Cliente'}
                      </td>
                      <td className="py-3 px-3 text-[var(--adm-mut,#a9b8cf)] max-w-[260px] truncate">
                        {orc.servico}
                      </td>
                      <td className="py-3 px-3 text-[var(--adm-mut,#a9b8cf)] font-mono tabular-nums">
                        {qtdVinc} {qtdVinc === 1 ? 'serviço' : 'serviços'}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-[var(--adm-text,#f4f7fc)] tabular-nums">
                        {formatarMoeda(orc.valor)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => atualizarStatusOrcamento(orc.id, 'faturado')}
                          className="py-1.5 px-3 rounded-lg bg-[var(--adm-blue,#2160db)] hover:brightness-110 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Faturar</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Modal de Visualização da Proposta */}
      {propostaVisualizando && (
        <PropostaViewerModal
          isOpen={true}
          orcamento={propostaVisualizando}
          onClose={() => setPropostaVisualizando(null)}
          onEditarProposta={(orc) => {
            setPropostaVisualizando(null);
            navigate(`/admin/orcamentos/${orc.id}`);
          }}
          onStatusChange={(id, status) => {
            atualizarStatusOrcamento(id, status);
            setPropostaVisualizando((prev) => (prev ? { ...prev, status } : null));
          }}
        />
      )}
    </div>
  );
};
