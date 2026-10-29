import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export const DashboardView: React.FC = () => {
  const { 
    laudos, 
    clientes, 
    ativos, 
    orcamentos 
  } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Métricas
  const emElaboracao = laudos.filter(l => l.status === 'em_andamento' || l.status === 'rascunho').length;
  const comArt = laudos.filter(l => l.status === 'finalizado').length;
  const clientesAtivos = clientes.length;
  const equipamentosTotal = ativos.length;
  const orcamentosAbertos = orcamentos.filter(o => o.status === 'enviado' || o.status === 'rascunho').length;

  // Saudação dinâmica por período e primeiro nome
  const hora = new Date().getHours();
  const saudacaoPeriodo = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
  const primeiroNome = currentUser?.nome ? currentUser.nome.trim().split(' ')[0] : 'Vitor';

  // Laudos recentes ordenados por atualização ou criação
  const laudosRecentes = [...laudos]
    .sort((a, b) => new Date(b.atualizadoEm || b.criadoEm).getTime() - new Date(a.atualizadoEm || a.criadoEm).getTime())
    .slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'finalizado':
        return (
          <span className="inline-block py-0.5 px-3 rounded-full text-[0.8rem] font-medium border border-current text-[var(--adm-ok,#34d399)] whitespace-nowrap">
            ART emitida
          </span>
        );
      case 'em_andamento':
        return (
          <span className="inline-block py-0.5 px-3 rounded-full text-[0.8rem] font-medium border border-current text-[var(--adm-blue-soft,#6ea1ff)] whitespace-nowrap">
            Em elaboração
          </span>
        );
      default:
        return (
          <span className="inline-block py-0.5 px-3 rounded-full text-[0.8rem] font-medium border border-current text-[var(--adm-warn,#fbbf24)] whitespace-nowrap">
            Aguardando
          </span>
        );
    }
  };

  // Lista de equipamentos com vencimento em 30 dias (suporta exibição individual ou em lista)
  const equipamentosVencendo = [
    {
      nome: 'Munck 12 t',
      obra: 'Obra Boa Viagem',
      dataVencimento: '12/11'
    }
  ];

  return (
    <div className="space-y-7 max-w-[1200px]">
      
      {/* 1. Barra de Boas-vindas e Ação Principal */}
      <section className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-[1.85rem] sm:text-[2rem] font-semibold tracking-[-0.015em] text-[var(--adm-text,#f4f7fc)] leading-tight">
            {saudacaoPeriodo}, {primeiroNome}
          </h1>
          <p className="text-[var(--adm-mut,#a9b8cf)] text-[0.95rem] mt-1 font-normal leading-relaxed">
            Você tem 2 vistorias agendadas hoje e {orcamentosAbertos} {orcamentosAbertos === 1 ? 'orçamento aguardando' : 'orçamentos aguardando'} resposta.
          </p>
        </div>

        <div>
          <Link
            to="/admin/laudos?novo=1"
            className="h-[46px] px-5 rounded-lg bg-[var(--adm-blue,#2160db)] hover:brightness-110 text-white text-[0.88rem] font-medium inline-flex items-center gap-2 transition-all shadow-xs focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#6ea1ff]"
          >
            <Plus className="w-[18px] h-[18px]" />
            <span>Novo laudo</span>
          </Link>
        </div>
      </section>

      {/* 2. Faixa de KPIs (Cartões como Links com foco e hover) */}
      <section 
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border border-[var(--adm-line,rgba(159,176,200,0.16))] rounded-[14px] bg-[var(--adm-card,#0f2038)] overflow-hidden" 
        aria-label="Resumo"
      >
        <Link 
          to="/admin/laudos?status=Em"
          className="p-5 sm:p-6 border-b sm:border-b-0 border-r border-[var(--adm-line,rgba(159,176,200,0.16))] hover:bg-[rgba(110,161,255,0.07)] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#6ea1ff] focus-visible:outline-offset-[-2px] block no-underline text-inherit"
          title="Ver laudos em elaboração"
        >
          <b className="block text-[2rem] font-semibold leading-[1.1] text-[var(--adm-text,#f4f7fc)]">
            {emElaboracao}
          </b>
          <span className="text-[var(--adm-mut,#a9b8cf)] text-[0.9rem] mt-1 block">
            Em elaboração
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
            Com ART
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
          title="Ver orçamentos abertos"
        >
          <b className="block text-[2rem] font-semibold leading-[1.1] text-[var(--adm-text,#f4f7fc)]">
            {orcamentosAbertos}
          </b>
          <span className="text-[var(--adm-mut,#a9b8cf)] text-[0.9rem] mt-1 block">
            Orçamentos abertos
          </span>
        </Link>
      </section>

      {/* 3. Grid Principal em 2 Colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-7 items-start">
        
        {/* Coluna Esquerda: Laudos recentes (ajuste dinâmico de altura sem espaço vazio) */}
        <section className="bg-[var(--adm-card,#0f2038)] border border-[var(--adm-line,rgba(159,176,200,0.16))] rounded-[14px] p-6 sm:p-7 min-w-0">
          <div className="flex items-baseline justify-between mb-4.5">
            <h2 className="text-[1.2rem] font-semibold text-[var(--adm-text,#f4f7fc)]">
              Laudos recentes
            </h2>
            <Link 
              to="/admin/laudos" 
              className="text-[0.85rem] font-medium text-[var(--adm-blue-soft,#6ea1ff)] hover:underline"
            >
              Ver todos
            </Link>
          </div>

          {laudosRecentes.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <p className="text-[var(--adm-mut,#a9b8cf)] text-[0.92rem]">
                Nenhum laudo ainda.
              </p>
              <Link
                to="/admin/laudos?novo=1"
                className="h-10 px-4 rounded-lg bg-[var(--adm-blue,#2160db)] text-white text-[0.85rem] font-medium inline-flex items-center gap-1.5 hover:brightness-110 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Criar primeiro laudo</span>
              </Link>
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--adm-line,rgba(159,176,200,0.16))]">
                  {laudosRecentes.map((laudo) => {
                    const cliente = clientes.find(c => c.id === laudo.clienteId);
                    const dataFormatada = new Date(laudo.criadoEm || Date.now()).toLocaleDateString('pt-BR');

                    return (
                      <tr 
                        key={laudo.id} 
                        onClick={() => navigate(`/admin/laudos/${laudo.id}`)}
                        className="hover:bg-[rgba(110,161,255,0.06)] transition-colors cursor-pointer"
                      >
                        <td className="py-4 px-3 align-top">
                          <b className="block font-semibold text-[var(--adm-text,#f4f7fc)]">
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
                          {cliente?.nomeFantasia || cliente?.razaoSocial || laudo.clienteNome || 'Cliente'}
                        </td>
                        <td className="py-4 px-3 align-top text-[var(--adm-mut,#a9b8cf)] whitespace-nowrap">
                          {dataFormatada}
                        </td>
                        <td className="py-4 px-3 align-top">
                          {getStatusBadge(laudo.status)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Coluna Direita: Agenda de hoje & Vencem em 30 dias */}
        <div className="flex flex-col gap-7">
          
          {/* Agenda de hoje */}
          <section className="bg-[var(--adm-card,#0f2038)] border border-[var(--adm-line,rgba(159,176,200,0.16))] rounded-[14px] p-6 sm:p-7">
            <h2 className="text-[1.2rem] font-semibold text-[var(--adm-text,#f4f7fc)] mb-4.5">
              Agenda de hoje
            </h2>
            
            <ul className="space-y-4 text-[0.92rem]">
              <li className="grid grid-cols-[64px_1fr] gap-3 items-start">
                <time className="font-semibold text-[var(--adm-blue-soft,#6ea1ff)]">
                  09:00
                </time>
                <div>
                  <b className="font-medium text-[var(--adm-text,#f4f7fc)] block">
                    Vistoria de Munck 12 t
                  </b>
                  <small className="block text-[var(--adm-mut,#a9b8cf)] text-[0.82rem] mt-0.5">
                    Jaboatão · Obra Marina
                  </small>
                </div>
              </li>

              <li className="grid grid-cols-[64px_1fr] gap-3 items-start">
                <time className="font-semibold text-[var(--adm-blue-soft,#6ea1ff)]">
                  14:30
                </time>
                <div>
                  <b className="font-medium text-[var(--adm-text,#f4f7fc)] block">
                    Playground condominial
                  </b>
                  <small className="block text-[var(--adm-mut,#a9b8cf)] text-[0.82rem] mt-0.5">
                    Piedade · Cond. Mar Azul
                  </small>
                </div>
              </li>
            </ul>
          </section>

          {/* Vencem em 30 dias (com faixa âmbar de 3px na borda esquerda) */}
          <section className="bg-[var(--adm-card,#0f2038)] border border-[var(--adm-line,rgba(159,176,200,0.16))] border-l-[3px] border-l-[var(--adm-warn,#fbbf24)] rounded-[14px] p-6 sm:p-7">
            <h2 className="text-[1.2rem] font-semibold text-[var(--adm-text,#f4f7fc)] flex items-center gap-2.5">
              <AlertTriangle className="w-[18px] h-[18px] text-[var(--adm-warn,#fbbf24)] flex-none" />
              <span>Vencem em 30 dias</span>
            </h2>

            {equipamentosVencendo.length > 1 ? (
              <ul className="my-3 space-y-2.5 text-[0.92rem]">
                {equipamentosVencendo.map((eq, i) => (
                  <li key={i} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-[var(--adm-text,#f4f7fc)]">
                    <span className="font-medium">
                      {eq.nome} <span className="text-[var(--adm-mut,#a9b8cf)] font-normal">· {eq.obra}</span>
                    </span>
                    <span className="text-xs text-[var(--adm-warn,#fbbf24)] font-medium whitespace-nowrap">
                      Vence em {eq.dataVencimento}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="my-2.5 text-[var(--adm-mut,#a9b8cf)] leading-[1.7] text-[0.92rem]">
                {equipamentosVencendo[0]?.nome} da {equipamentosVencendo[0]?.obra} vence em {equipamentosVencendo[0]?.dataVencimento}. Renove a inspeção periódica com emissão de ART.
              </p>
            )}

            <Link
              to="/admin/ativos"
              className="mt-4 h-10 px-3.5 rounded-lg border border-[var(--adm-line,rgba(159,176,200,0.16))] bg-transparent text-[var(--adm-text,#f4f7fc)] text-[0.88rem] font-medium inline-flex items-center gap-2 hover:border-[#6ea1ff] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#6ea1ff]"
            >
              <span>Ver equipamentos</span>
              <ArrowRight className="w-4 h-4 opacity-75" />
            </Link>
          </section>

        </div>

      </div>

    </div>
  );
};
