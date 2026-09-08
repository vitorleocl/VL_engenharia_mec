import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  Cpu, 
  FileSpreadsheet, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  Plus, 
  Phone,
  Mail,
  ShieldCheck,
  Flame,
  ExternalLink
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { MODULOS_LAUDO_CATALOGO } from '../../data/initialData';

export const DashboardView: React.FC = () => {
  const { 
    laudos, 
    clientes, 
    ativos, 
    orcamentos, 
    agenda, 
    contatos, 
    usoIA, 
    marcarContatoRespondido,
    adicionarOrcamento 
  } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const isColaborador = currentUser?.role === 'master' || currentUser?.role === 'colaborador';

  // Metrics
  const laudosEmAndamento = laudos.filter(l => l.status === 'em_andamento' || l.status === 'rascunho').length;
  const laudosFinalizados = laudos.filter(l => l.status === 'finalizado').length;
  const orcamentosAbertos = orcamentos.filter(o => o.status === 'enviado' || o.status === 'rascunho').length;
  const vistoriasProximas = agenda.filter(a => a.status === 'agendada');
  const percIA = Math.round((usoIA.totalChamadas / usoIA.limiteMensal) * 100);

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0B1E3D] to-[#1565D8] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-blue-200">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
            <span>Sistema Integrado VL Engenharia • CREA-PE 1822299490</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Olá, {currentUser?.nome || 'Engenheiro'}!
          </h2>
          <p className="text-sm text-blue-100 leading-relaxed">
            Painel operacional para gestão de vistorias técnicas, emissão de laudos de segurança (NR-12, NR-13, munck, guindastes), cálculo quantitativo de riscos (HRN) e orçamentos em campo com sincronização offline.
          </p>
          
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/admin/laudos"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-[#0B1E3D] hover:bg-slate-100 font-bold text-xs shadow-md transition-all active:scale-98"
            >
              <Plus className="w-4 h-4 text-[#1565D8]" />
              <span>Novo Laudo de Inspeção</span>
            </Link>

            {isColaborador && (
              <Link
                to="/admin/orcamentos"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-white" />
                <span>Emitir Proposta Comercial</span>
              </Link>
            )}
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none"></div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Em Andamento</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-[#0B1E3D]">{laudosEmAndamento}</p>
          <p className="text-[10px] text-slate-500">Laudos em elaboração</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Laudos Emitidos</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-[#0B1E3D]">{laudosFinalizados}</p>
          <p className="text-[10px] text-slate-500">Com ART registrada</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Clientes Ativos</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-[#0B1E3D]">{clientes.length}</p>
          <p className="text-[10px] text-slate-500">Empresas cadastradas</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Ativos e Frotas</span>
            <Cpu className="w-4 h-4 text-slate-700" />
          </div>
          <p className="text-2xl font-black text-[#0B1E3D]">{ativos.length}</p>
          <p className="text-[10px] text-slate-500">Máquinas monitoradas</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Orçamentos</span>
            <FileSpreadsheet className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-[#0B1E3D]">{orcamentosAbertos}</p>
          <p className="text-[10px] text-slate-500">Aguardando aprovação</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Cota Gemini IA</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-[#0B1E3D]">{usoIA.totalChamadas} <span className="text-xs font-normal text-slate-400">/ {usoIA.limiteMensal}</span></p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-600 h-full rounded-full" style={{ width: `${percIA}%` }} />
          </div>
        </div>

      </div>

      {/* Grid: Recent Laudos & Upcoming Inspections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Recent Reports Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-[#0B1E3D]">
                Laudos Técnicos Recentes
              </h3>
              <p className="text-xs text-slate-500">
                Acompanhamento de relatórios em campo e ARTs vinculadas
              </p>
            </div>
            <Link
              to="/admin/laudos"
              className="text-xs font-bold text-[#1565D8] hover:text-[#0b4fb8] flex items-center gap-1"
            >
              <span>Ver todos ({laudos.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Número / Tipo</th>
                  <th className="py-2.5 px-3">Cliente</th>
                  <th className="py-2.5 px-3">Data</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Risco HRN</th>
                  <th className="py-2.5 px-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {laudos.slice(0, 5).map((laudo) => (
                  <tr key={laudo.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold font-mono text-[#0B1E3D] block">
                        {laudo.numero}
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        {laudo.tipo}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">
                      {laudo.clienteNome}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {laudo.dataInspecao}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        laudo.status === 'finalizado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {laudo.status === 'finalizado' ? 'Finalizado (ART)' : 'Rascunho / Campo'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {laudo.hrnCalculoGeral ? (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${laudo.hrnCalculoGeral.cor}`}>
                          {laudo.hrnCalculoGeral.nivel} ({laudo.hrnCalculoGeral.score})
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => navigate(`/admin/laudos/${laudo.id}`)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-[#1565D8] hover:text-white text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        Abrir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Upcoming Inspection Visits */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-[#0B1E3D] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1565D8]" />
                <span>Próximas Vistorias</span>
              </h3>
              <Link to="/admin/agenda" className="text-xs text-[#1565D8] font-bold">
                Agenda
              </Link>
            </div>

            {vistoriasProximas.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Nenhuma vistoria agendada para os próximos dias.
              </p>
            ) : (
              <div className="space-y-3">
                {vistoriasProximas.map((v) => (
                  <div
                    key={v.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0B1E3D]">{v.clienteNome}</span>
                      <span className="text-[10px] font-mono text-blue-600 font-bold">
                        {v.dataHora.replace('T', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Ativo: <strong className="text-slate-800">{v.ativoIdentificacao || 'A definir'}</strong>
                    </p>
                    {v.observacoes && (
                      <p className="text-[11px] text-slate-500 italic">
                        "{v.observacoes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Contact Leads from Website */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-[#0B1E3D] flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-600" />
                <span>Contatos do Site ({contatos.length})</span>
              </h3>
            </div>

            {contatos.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Nenhuma mensagem recebida recentemente pelo site.
              </p>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {contatos.map((c) => (
                  <div
                    key={c.id}
                    className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                      c.respondido 
                        ? 'bg-slate-50/50 border-slate-200 opacity-60' 
                        : 'bg-blue-50/50 border-blue-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{c.nome}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(c.criadoEm).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-slate-600 font-semibold text-[11px]">
                      Interesse: <span className="text-[#1565D8]">{c.servicoInteresse}</span>
                    </p>
                    <p className="text-slate-700 text-[11px] leading-snug line-clamp-2">
                      "{c.mensagem}"
                    </p>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                      <a
                        href={`https://wa.me/55${c.telefone.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(c.nome)}%2C%20aqui%20%C3%A9%20o%20Eng.%20Vitor%20da%20VL%20Engenharia%20a%20respeito%20da%20sua%20solicita%C3%A7%C3%A3o%20de%20or%C3%A7amento.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Chamar no WhatsApp</span>
                      </a>
                      {!c.respondido && (
                        <button
                          onClick={() => marcarContatoRespondido(c.id)}
                          className="text-[10px] text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                        >
                          Marcar respondido
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
