import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardCheck, 
  Plus, 
  Search, 
  Camera, 
  CheckCircle2, 
  Wifi, 
  WifiOff, 
  Download, 
  Share2, 
  FileText,
  Upload,
  ArrowRight,
  Layers,
  Clock,
  AlertTriangle,
  Building,
  ExternalLink,
  ChevronRight,
  Eye,
  Check,
  Edit3
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ChecklistCampoFormModal } from './ChecklistCampoFormModal';
import { ChecklistCampoPdfModal } from './ChecklistCampoPdfModal';
import { ChecklistCampo } from '../../types';

export const ChecklistCampoView: React.FC = () => {
  const { checklistsCampo, clientes, ativos, orcamentos, laudos } = useData();
  const { currentUser, isOnline } = useAuth();
  const navigate = useNavigate();

  const [modalFormAberto, setModalFormAberto] = useState(false);
  const [checklistParaEditar, setChecklistParaEditar] = useState<ChecklistCampo | null>(null);
  const [checklistVisualizandoPdf, setChecklistVisualizandoPdf] = useState<ChecklistCampo | null>(null);
  const [buscaTexto, setBuscaTexto] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'finalizado' | 'rascunho'>('todos');

  // Filtro de checklists
  const checklistsFiltrados = checklistsCampo.filter(chk => {
    if (filtroStatus !== 'todos' && chk.status !== filtroStatus) return false;
    if (buscaTexto.trim()) {
      const termo = buscaTexto.toLowerCase();
      const cli = clientes.find(c => c.id === chk.clienteId);
      const atv = ativos.find(a => a.id === chk.ativoId);
      const matchNumero = (chk.numero || '').toLowerCase().includes(termo);
      const matchTipo = (chk.tipoLaudoNome || chk.categoriaLaudo || '').toLowerCase().includes(termo);
      const matchCli = (cli?.razaoSocial || cli?.nomeFantasia || '').toLowerCase().includes(termo);
      const matchAtv = (atv?.identificacao || '').toLowerCase().includes(termo);
      return matchNumero || matchTipo || matchCli || matchAtv;
    }
    return true;
  });

  const abrirNovoChecklist = () => {
    setChecklistParaEditar(null);
    setModalFormAberto(true);
  };

  const abrirEditarChecklist = (chk: ChecklistCampo) => {
    setChecklistParaEditar(chk);
    setModalFormAberto(true);
  };

  return (
    <div className="space-y-6 max-w-[1300px]">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B1E3D] tracking-tight">
              Checklists de Campo & Vistorias
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#1565D8] border border-blue-200">
              Tablet & Mobile Touch
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Coleta estruturada de dados técnicos in loco com fotos, medições e geração direta do Laudo Técnico.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Status de Sincronização Offline */}
          {isOnline ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-300">
              <Wifi className="w-4 h-4 text-emerald-600" />
              <span>Sincronizado (0 pendentes)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-300 animate-pulse">
              <WifiOff className="w-4 h-4 text-amber-600" />
              <span>Modo Offline Ativo</span>
            </span>
          )}

          <button
            type="button"
            onClick={abrirNovoChecklist}
            className="px-4 py-2.5 rounded-xl bg-[#0B1E3D] hover:bg-[#1565D8] text-white text-xs font-black flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>Nova Vistoria de Campo</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por TAG, cliente, proposta ou número..."
            value={buscaTexto}
            onChange={(e) => setBuscaTexto(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500">Filtrar:</span>
          {(['todos', 'finalizado', 'rascunho'] as const).map(st => (
            <button
              key={st}
              type="button"
              onClick={() => setFiltroStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filtroStatus === st
                  ? 'bg-blue-600 text-white shadow-2xs font-black'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {st === 'todos' ? 'Todos' : st === 'finalizado' ? 'Concluídos' : 'Rascunhos'}
            </button>
          ))}
        </div>
      </div>

      {/* B8: Tabela / Lista de Vistorias Realizadas por Equipamento */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-black text-[#0B1E3D] uppercase tracking-wider flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-[#1565D8]" />
              <span>Histórico de Vistorias por Equipamento & Laudos Gerados</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rastreabilidade total: Orçamento vinculado → Checklist in loco → Laudo técnico emitido.
            </p>
          </div>
          <span className="text-xs font-bold font-mono text-slate-600">
            {checklistsFiltrados.length} vistoria(s) encontrada(s)
          </span>
        </div>

        {checklistsFiltrados.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <ClipboardCheck className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">Nenhum checklist de campo encontrado</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Inicie uma nova vistoria técnica clicando no botão "Nova Vistoria de Campo" acima.
            </p>
            <button
              type="button"
              onClick={abrirNovoChecklist}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Primeiro Checklist</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {checklistsFiltrados.map((chk) => {
              const cliente = clientes.find(c => c.id === chk.clienteId);
              const ativo = ativos.find(a => a.id === chk.ativoId);
              const orcamento = orcamentos.find(o => o.id === chk.vinculadoAOrcamentoId);
              const laudoVinculado = laudos.find(l => l.checklistCampoOrigemId === chk.id || l.id === chk.vinculadoALaudoId);

              const itensTotal = (chk.itens || []).length + (chk.itensExtras || []).length;
              const itensConformes = [...(chk.itens || []), ...(chk.itensExtras || [])].filter(i => i.status === 'conforme').length;
              const itensNaoConformes = [...(chk.itens || []), ...(chk.itensExtras || [])].filter(i => i.status === 'nao_conforme').length;
              const itensNA = [...(chk.itens || []), ...(chk.itensExtras || [])].filter(i => i.status === 'nao_aplicavel').length;

              return (
                <div 
                  key={chk.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black text-[#0B1E3D] bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                        {chk.numero || chk.id}
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        {chk.tipoLaudoNome || chk.categoriaLaudo}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        chk.status === 'finalizado'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {chk.status === 'finalizado' ? '✓ Vistoria Concluída' : '⏳ Rascunho / Em Andamento'}
                      </span>
                      {chk.geolocalizacao && (
                        <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          📍 GPS Registrado
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                      <span>
                        <strong>Cliente:</strong> {cliente?.razaoSocial || chk.clienteNome || 'Cliente'}
                      </span>
                      <span>•</span>
                      <span>
                        <strong>Equipamento / TAG:</strong> <span className="font-mono font-bold text-slate-800">{ativo?.identificacao || chk.ativoIdentificacao || 'Ativo'}</span> ({ativo?.tipo || 'Industrial'})
                      </span>
                      <span>•</span>
                      <span>
                        <strong>Data:</strong> {new Date(chk.dataPreenchimento || chk.criadoEm || Date.now()).toLocaleDateString('pt-BR')}
                      </span>
                      {orcamento && (
                        <>
                          <span>•</span>
                          <span className="text-blue-700 font-semibold">
                            Orçamento: {orcamento.codigoProposta || orcamento.id}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Chips de Resultados da Inspeção */}
                    <div className="flex items-center gap-2 pt-1 text-[11px] font-bold">
                      <span className="text-slate-500">
                        {itensTotal} itens avaliados:
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {itensConformes} Conformes
                      </span>
                      {itensNaoConformes > 0 ? (
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                          ⚠ {itensNaoConformes} Não Conforme(s)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          0 NC
                        </span>
                      )}
                      {itensNA > 0 && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {itensNA} N.A.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Ações por Vistoria */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                    {/* Botão Ver PDF Preliminar */}
                    <button
                      type="button"
                      onClick={() => setChecklistVisualizandoPdf(chk)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Visualizar folha de checklist preliminar"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Ver Vistoria</span>
                    </button>

                    {/* Botão Continuar / Editar Vistoria */}
                    <button
                      type="button"
                      onClick={() => abrirEditarChecklist(chk)}
                      className="px-3 py-1.5 rounded-lg border border-blue-300 bg-blue-50/60 hover:bg-blue-100 text-blue-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Editar ou complementar vistoria técnica"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Editar</span>
                    </button>

                    {/* B7 / B8: Atalho para o Laudo Técnico Gerado */}
                    {laudoVinculado ? (
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/laudos/${laudoVinculado.id}`)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                        title="Abrir o laudo técnico gerado a partir desta vistoria"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Abrir Laudo ({laudoVinculado.numero})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => abrirEditarChecklist(chk)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#0B1E3D] hover:bg-[#1565D8] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                        title="Concluir e gerar o laudo técnico"
                      >
                        <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Gerar Laudo</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modais de Formulário e PDF */}
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

      {checklistVisualizandoPdf && (
        <ChecklistCampoPdfModal
          checklist={checklistVisualizandoPdf}
          onClose={() => setChecklistVisualizandoPdf(null)}
        />
      )}

    </div>
  );
};
