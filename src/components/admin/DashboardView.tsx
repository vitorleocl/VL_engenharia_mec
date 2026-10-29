import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  Cpu, 
  FileSpreadsheet, 
  Plus, 
  Calendar,
  AlertTriangle,
  ArrowRight
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

  // Metrics
  const emElaboracao = laudos.filter(l => l.status === 'em_andamento' || l.status === 'rascunho').length;
  const comArt = laudos.filter(l => l.status === 'finalizado').length;
  const clientesAtivos = clientes.length;
  const equipamentosTotal = ativos.length;
  const orcamentosAbertos = orcamentos.filter(o => o.status === 'enviado' || o.status === 'rascunho').length;

  // Recent reports sorted by criadoEm or atualizadoEm
  const laudosRecentes = [...laudos]
    .sort((a, b) => new Date(b.atualizadoEm || b.criadoEm).getTime() - new Date(a.atualizadoEm || a.criadoEm).getTime())
    .slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'finalizado':
        return <span className="tag-tech ok">ART emitida</span>;
      case 'em_andamento':
        return <span className="tag-tech bl">Em elaboração</span>;
      default:
        return <span className="tag-tech w">Aguardando</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px]">
      
      {/* Header bar: Short greeting with pending count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight">
            Bom dia, {currentUser?.nome?.split(' ')[0] || 'Vitor'}
          </h1>
          <p className="text-[var(--muted)] text-[15px] sm:text-[16px] mt-0.5 font-[family-name:var(--b)]">
            Você tem 2 vistorias agendadas hoje e {orcamentosAbertos} {orcamentosAbertos === 1 ? 'orçamento aguardando' : 'orçamentos aguardando'} resposta.
          </p>
        </div>

        <div>
          <Link
            to="/admin/laudos?novo=1"
            className="btn-tech pri text-[14.5px] px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Novo laudo</span>
          </Link>
        </div>
      </div>

      {/* 5 KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border-[1.5px] border-[var(--line)] rounded-xl bg-[var(--card)] overflow-hidden">
        <div className="p-4 sm:p-5 border-r border-[var(--line)] border-b lg:border-b-0">
          <b className="block font-[family-name:var(--d)] font-extrabold text-[28px] sm:text-[32px] text-[var(--ink)] leading-none">
            {emElaboracao}
          </b>
          <span className="text-[var(--muted)] text-[13.5px] sm:text-[14px] mt-1 block">
            Em elaboração
          </span>
        </div>

        <div className="p-4 sm:p-5 border-r border-[var(--line)] border-b lg:border-b-0">
          <b className="block font-[family-name:var(--d)] font-extrabold text-[28px] sm:text-[32px] text-[var(--ink)] leading-none">
            {comArt}
          </b>
          <span className="text-[var(--muted)] text-[13.5px] sm:text-[14px] mt-1 block">
            Com ART
          </span>
        </div>

        <div className="p-4 sm:p-5 border-r border-[var(--line)] border-b lg:border-b-0">
          <b className="block font-[family-name:var(--d)] font-extrabold text-[28px] sm:text-[32px] text-[var(--ink)] leading-none">
            {clientesAtivos}
          </b>
          <span className="text-[var(--muted)] text-[13.5px] sm:text-[14px] mt-1 block">
            Clientes ativos
          </span>
        </div>

        <div className="p-4 sm:p-5 border-r border-[var(--line)]">
          <b className="block font-[family-name:var(--d)] font-extrabold text-[28px] sm:text-[32px] text-[var(--ink)] leading-none">
            {equipamentosTotal}
          </b>
          <span className="text-[var(--muted)] text-[13.5px] sm:text-[14px] mt-1 block">
            Equipamentos
          </span>
        </div>

        <div className="p-4 sm:p-5 col-span-2 sm:col-span-1">
          <b className="block font-[family-name:var(--d)] font-extrabold text-[28px] sm:text-[32px] text-[var(--ink)] leading-none">
            {orcamentosAbertos}
          </b>
          <span className="text-[var(--muted)] text-[13.5px] sm:text-[14px] mt-1 block">
            Orçamentos abertos
          </span>
        </div>
      </div>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        
        {/* Left: Recent reports table */}
        <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-5 sm:p-6 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[19px] font-bold">Laudos recentes</h2>
            <Link 
              to="/admin/laudos" 
              className="text-xs font-semibold text-[var(--blue)] hover:underline"
            >
              Ver todos ({laudos.length})
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14.5px] min-w-[500px]">
              <thead>
                <tr className="border-b-[1.5px] border-[var(--ink)] text-[var(--muted)] text-[13.5px]">
                  <th className="py-2.5 px-3 font-semibold">Laudo</th>
                  <th className="py-2.5 px-3 font-semibold">Cliente</th>
                  <th className="py-2.5 px-3 font-semibold">Data</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {laudosRecentes.map((laudo) => {
                  const cliente = clientes.find(c => c.id === laudo.clienteId);
                  const dataFormatada = new Date(laudo.criadoEm || Date.now()).toLocaleDateString('pt-BR');

                  return (
                    <tr 
                      key={laudo.id} 
                      onClick={() => navigate(`/admin/laudos/${laudo.id}`)}
                      className="hover:bg-[var(--paper)] transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-3 align-top">
                        <b className="block text-[var(--ink)] font-semibold">{laudo.numero}</b>
                        <small className="text-[var(--muted)] text-xs block truncate max-w-[220px]">
                          {laudo.tipo}
                        </small>
                      </td>
                      <td className="py-3 px-3 align-top text-[var(--ink)]">
                        {cliente?.nomeFantasia || cliente?.razaoSocial || laudo.clienteNome || 'Cliente'}
                      </td>
                      <td className="py-3 px-3 align-top text-[var(--muted)]">
                        {dataFormatada}
                      </td>
                      <td className="py-3 px-3 align-top text-right">
                        {getStatusBadge(laudo.status)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Agenda de hoje & Vencem em 30 dias */}
        <div className="space-y-6">
          
          {/* Agenda de hoje */}
          <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-5 sm:p-6">
            <h2 className="text-[19px] font-bold mb-4">Agenda de hoje</h2>
            
            <ul className="space-y-3.5 text-[14.5px]">
              <li className="grid grid-cols-[54px_1fr] gap-2.5 items-start">
                <time className="font-[family-name:var(--d)] font-bold text-[15px] text-[var(--blue)]">
                  09:00
                </time>
                <div>
                  <span className="font-semibold block text-[var(--ink)]">
                    Vistoria de munck 12 t
                  </span>
                  <small className="text-[var(--muted)] text-xs block">
                    Jaboatão · Obra Marina
                  </small>
                </div>
              </li>

              <li className="grid grid-cols-[54px_1fr] gap-2.5 items-start">
                <time className="font-[family-name:var(--d)] font-bold text-[15px] text-[var(--blue)]">
                  14:30
                </time>
                <div>
                  <span className="font-semibold block text-[var(--ink)]">
                    Playground condominial
                  </span>
                  <small className="text-[var(--muted)] text-xs block">
                    Piedade · Cond. Mar Azul
                  </small>
                </div>
              </li>
            </ul>
          </div>

          {/* Vencem em 30 dias */}
          <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-[var(--warn)]" />
              <h2 className="text-[19px] font-bold">Vencem em 30 dias</h2>
            </div>
            
            <p className="text-[var(--muted)] text-[14.5px] leading-relaxed">
              Munck 12 t da Obra Boa Viagem vence em 12/11. Renove a inspeção periódica com emissão de ART.
            </p>

            <Link
              to="/admin/ativos"
              className="btn-tech sm mt-4 inline-flex items-center text-[13.5px]"
            >
              <span>Ver equipamentos</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 opacity-60" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};
