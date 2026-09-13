import React, { useState } from 'react';
import { 
  X, 
  ClipboardCheck, 
  CheckCircle2, 
  AlertTriangle, 
  MinusCircle, 
  Calendar, 
  ArrowRight, 
  Building2, 
  Cpu, 
  Check,
  Search
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ChecklistCampo } from '../../types';

interface ImportarChecklistCampoModalProps {
  clienteId?: string;
  ativoId?: string;
  contexto: 'laudo' | 'orcamento';
  onClose: () => void;
  onImportar: (checklist: ChecklistCampo) => void;
}

export const ImportarChecklistCampoModal: React.FC<ImportarChecklistCampoModalProps> = ({
  clienteId,
  ativoId,
  contexto,
  onClose,
  onImportar,
}) => {
  const { checklistsCampo } = useData();
  const [busca, setBusca] = useState('');
  const [checklistSelecionado, setChecklistSelecionado] = useState<ChecklistCampo | null>(null);

  // Filtrar checklists relevantes (priorizando os do mesmo cliente/ativo se fornecidos)
  const checklistsDisponiveis = checklistsCampo.filter(chk => {
    const texto = `${chk.numero} ${chk.clienteNome} ${chk.ativoIdentificacao} ${chk.tipoLaudoNome}`.toLowerCase();
    return texto.includes(busca.toLowerCase());
  }).sort((a, b) => {
    // Dá prioridade para o mesmo ativo e cliente
    if (ativoId && a.ativoId === ativoId && b.ativoId !== ativoId) return -1;
    if (ativoId && b.ativoId === ativoId && a.ativoId !== ativoId) return 1;
    if (clienteId && a.clienteId === clienteId && b.clienteId !== clienteId) return -1;
    if (clienteId && b.clienteId === clienteId && a.clienteId !== clienteId) return 1;
    return new Date(b.dataPreenchimento).getTime() - new Date(a.dataPreenchimento).getTime();
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto border border-slate-200">
        {/* Topo do Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Importar Dados de Checklist de Campo In Loco
              </h2>
              <p className="text-xs text-slate-500">
                {contexto === 'laudo'
                  ? 'Transfira observações, fotos e status levantados in loco diretamente para as seções do laudo'
                  : 'Incorpore as não conformidades levantadas em campo diretamente no escopo do orçamento comercial'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Busca */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por número do checklist, cliente ou equipamento..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Lista e Preview */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {checklistsDisponiveis.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              Nenhum checklist de campo cadastrado para os critérios pesquisados.
            </div>
          ) : (
            checklistsDisponiveis.map(chk => {
              const isMesmoAtivo = ativoId && chk.ativoId === ativoId;
              const isMesmoCliente = clienteId && chk.clienteId === clienteId;
              const selecionado = checklistSelecionado?.id === chk.id;
              const todosItens = [...(chk.itens || []), ...(chk.itensExtras || [])];
              const confs = todosItens.filter(i => i.status === 'conforme').length;
              const naoConfs = todosItens.filter(i => i.status === 'nao_conforme').length;

              return (
                <div
                  key={chk.id}
                  onClick={() => setChecklistSelecionado(chk)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selecionado
                      ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-900 bg-blue-100/60 px-2 py-0.5 rounded">
                        {chk.numero}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          chk.status === 'finalizado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {chk.status === 'finalizado' ? 'Finalizado' : 'Rascunho'}
                      </span>
                      {isMesmoAtivo && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                          Mesmo Ativo
                        </span>
                      )}
                      {isMesmoCliente && !isMesmoAtivo && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                          Mesmo Cliente
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(chk.dataPreenchimento).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 mb-1">
                    {chk.tipoLaudoNome || chk.tipoLaudoId}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-2">
                    <p className="flex items-center gap-1 truncate">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {chk.clienteNome}
                    </p>
                    <p className="flex items-center gap-1 truncate">
                      <Cpu className="w-3.5 h-3.5 text-slate-400" />
                      {chk.ativoIdentificacao}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs pt-2 border-t border-slate-100">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3 h-3" /> {confs} Conformes
                    </span>
                    <span className="text-rose-700 font-semibold flex items-center gap-1 text-[11px]">
                      <AlertTriangle className="w-3 h-3" /> {naoConfs} Não Conformes
                    </span>
                    <span className="text-slate-500 text-[11px] ml-auto">
                      Resp: {chk.responsavelNome || 'Eng. Vitor Leonardo'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {checklistSelecionado ? (
              <span>
                Checklist selecionado: <strong className="text-blue-900">{checklistSelecionado.numero}</strong>
              </span>
            ) : (
              <span>Selecione um checklist da lista acima</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-300"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={!checklistSelecionado}
              onClick={() => checklistSelecionado && onImportar(checklistSelecionado)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 rounded-lg transition-colors shadow-xs"
            >
              <ArrowRight className="w-4 h-4" />
              Importar para o {contexto === 'laudo' ? 'Laudo' : 'Orçamento'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
