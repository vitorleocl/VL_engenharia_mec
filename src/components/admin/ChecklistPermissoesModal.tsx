import React from 'react';
import { X, ShieldCheck, Check, Info } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface ChecklistPermissoesModalProps {
  onClose: () => void;
}

export const ChecklistPermissoesModal: React.FC<ChecklistPermissoesModalProps> = ({ onClose }) => {
  const { categoriasLaudo, alternarPermitePreenchimentoPreliminar } = useData();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[88vh] flex flex-col overflow-hidden my-auto border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Habilitação de Tipos para Checklist Preliminar In Loco
              </h2>
              <p className="text-xs text-slate-500">
                Controle quais tipos de laudo admitem preenchimento preliminar rápido em campo
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

        <div className="p-4 bg-amber-50 border-b border-amber-200 text-xs text-amber-800 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            Tipos de laudo estritamente de consultoria documental (ex.: Diagnóstico PCM ou Valoração de Ativos) podem ter o checklist preliminar desativado para evitar preenchimentos indevidos em campo.
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {categoriasLaudo.map(cat => (
            <div key={cat.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                {cat.nome}
              </h3>

              <div className="space-y-2">
                {cat.subcategorias?.map(sub => (
                  <div key={sub.id} className="space-y-1.5">
                    {sub.tipos?.map(tipo => {
                      const habilitado = tipo.permitePreenchimentoPreliminar !== false;
                      return (
                        <div
                          key={tipo.id}
                          className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200 text-xs hover:border-slate-300 transition-colors"
                        >
                          <div className="flex-1 pr-3">
                            <span className="font-semibold text-slate-800 block">
                              {tipo.nome}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Código: {tipo.codigo || tipo.id} • {tipo.normasRef || 'Normas Técnicas'}
                            </span>
                          </div>

                          <label className="relative inline-flex items-center cursor-pointer shrink-0">
                            <input
                              type="checkbox"
                              checked={habilitado}
                              onChange={(e) => alternarPermitePreenchimentoPreliminar(tipo.id, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-10 h-5.5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-blue-600"></div>
                            <span className="ml-2 text-[11px] font-bold text-slate-700 min-w-[65px]">
                              {habilitado ? 'Habilitado' : 'Desativado'}
                            </span>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 border-t border-slate-200 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            Concluir Configuração
          </button>
        </div>
      </div>
    </div>
  );
};
