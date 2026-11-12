import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  RotateCcw,
  CheckCircle2,
  Sliders,
  BookOpen,
  Layers,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ChecklistModeloItemDef, ChecklistModeloServico } from '../../types';

interface ChecklistModelosEditorProps {
  onSaved?: () => void;
}

export const ChecklistModelosEditor: React.FC<ChecklistModelosEditorProps> = ({ onSaved }) => {
  const { checklistModelos, atualizarChecklistModelos, resetarChecklistModelos } = useData();

  const [modelosLocais, setModelosLocais] = useState<ChecklistModeloServico[]>(checklistModelos);
  const [modeloAtivoId, setModeloAtivoId] = useState<string>(checklistModelos[0]?.id || 'nr11');
  const [salvoMsg, setSalvoMsg] = useState<string | null>(null);

  useEffect(() => {
    setModelosLocais(checklistModelos);
  }, [checklistModelos]);

  const modeloAtivo = modelosLocais.find(m => m.id === modeloAtivoId) || modelosLocais[0];

  const atualizarModeloAtivo = (patch: Partial<ChecklistModeloServico>) => {
    if (!modeloAtivo) return;
    setModelosLocais(prev =>
      prev.map(m => (m.id === modeloAtivo.id ? { ...m, ...patch } : m))
    );
  };

  const atualizarItem = (itemId: string, patch: Partial<ChecklistModeloItemDef>) => {
    if (!modeloAtivo) return;
    atualizarModeloAtivo({
      itens: modeloAtivo.itens.map(it => (it.id === itemId ? { ...it, ...patch } : it)),
    });
  };

  const adicionarItem = () => {
    if (!modeloAtivo) return;
    const proxIndex = modeloAtivo.itens.length + 1;
    const novoItem: ChecklistModeloItemDef = {
      id: `${modeloAtivo.id}-${Date.now()}`,
      numero: `${proxIndex}.1`,
      texto: 'Novo critério de verificação técnica in loco',
      norma: modeloAtivo.norma.split('/')[0]?.trim() || 'ABNT NBR',
      secaoLaudo: modeloAtivo.secoesLaudoPadrao?.[0] || 'Verificações Técnicas em Campo',
    };
    atualizarModeloAtivo({ itens: [...modeloAtivo.itens, novoItem] });
  };

  const removerItem = (itemId: string) => {
    if (!modeloAtivo) return;
    atualizarModeloAtivo({
      itens: modeloAtivo.itens.filter(it => it.id !== itemId),
    });
  };

  const moverItem = (idx: number, dir: -1 | 1) => {
    if (!modeloAtivo) return;
    const novoIdx = idx + dir;
    if (novoIdx < 0 || novoIdx >= modeloAtivo.itens.length) return;
    const copia = [...modeloAtivo.itens];
    const [removido] = copia.splice(idx, 1);
    copia.splice(novoIdx, 0, removido);
    atualizarModeloAtivo({ itens: copia });
  };

  const handleSalvar = () => {
    atualizarChecklistModelos(modelosLocais);
    setSalvoMsg('Modelos salvos nas Configurações e aplicados às novas vistorias.');
    setTimeout(() => setSalvoMsg(null), 3500);
    if (onSaved) onSaved();
  };

  const handleRestaurar = () => {
    if (window.confirm('Restaurar todos os modelos de checklist (NR-11, NR-12, NR-13, PMOC, Vibração FFT) para os textos padrão?')) {
      resetarChecklistModelos();
      setSalvoMsg('Modelos padrão restaurados.');
      setTimeout(() => setSalvoMsg(null), 3500);
    }
  };

  if (!modeloAtivo) return null;

  return (
    <div className="space-y-5">
      {/* Cabeçalho e Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-[var(--adm-text)] flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[var(--adm-blue-soft)]" />
            <span>Modelos de Checklist por Tipo de Serviço</span>
          </h3>
          <p className="text-xs text-[var(--adm-mut)] mt-0.5">
            Configure número, texto, norma de referência e o item/seção do laudo ao qual cada critério pertence.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleRestaurar}
            className="px-3 py-2 rounded-xl border border-[var(--adm-line)] text-[var(--adm-mut)] hover:text-[var(--adm-text)] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar padrão</span>
          </button>

          <button
            type="button"
            onClick={handleSalvar}
            className="px-4 py-2 rounded-xl bg-[var(--adm-blue,#2160db)] hover:brightness-110 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salvar modelos</span>
          </button>
        </div>
      </div>

      {salvoMsg && (
        <div className="px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-500 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{salvoMsg}</span>
        </div>
      )}

      {/* Abas dos Tipos de Serviço */}
      <div className="flex flex-wrap gap-2">
        {modelosLocais.map(mod => {
          const ativo = mod.id === modeloAtivo.id;
          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => setModeloAtivoId(mod.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                ativo
                  ? 'bg-[var(--adm-blue,#2160db)] text-white border-[var(--adm-blue,#2160db)] shadow-xs'
                  : 'bg-[var(--adm-card)] text-[var(--adm-text)] border-[var(--adm-line)] hover:border-[var(--adm-blue-soft)]'
              }`}
            >
              <span className="uppercase">{mod.id}</span>
              <span className="ml-1.5 opacity-80 font-normal">({mod.itens.length})</span>
            </button>
          );
        })}
      </div>

      {/* Dados Gerais do Modelo Selecionado */}
      <div className="bg-[var(--adm-card)] border border-[var(--adm-line)] rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-[11px] font-bold text-[var(--adm-mut)] mb-1">
              Nome do Modelo / Tipo de Serviço
            </label>
            <input
              type="text"
              value={modeloAtivo.nome}
              onChange={(e) => atualizarModeloAtivo({ nome: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[var(--adm-bg)] border border-[var(--adm-line)] text-xs font-semibold text-[var(--adm-text)] focus:outline-none focus:border-[var(--adm-blue-soft)]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[var(--adm-mut)] mb-1 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              Normas de Referência do Serviço
            </label>
            <input
              type="text"
              value={modeloAtivo.norma}
              onChange={(e) => atualizarModeloAtivo({ norma: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[var(--adm-bg)] border border-[var(--adm-line)] text-xs font-semibold text-[var(--adm-text)] focus:outline-none focus:border-[var(--adm-blue-soft)]"
            />
          </div>
        </div>

        {/* Lista Editável de Itens */}
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--adm-text)] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[var(--adm-blue-soft)]" />
              Itens do Checklist ({modeloAtivo.itens.length})
            </span>
            <button
              type="button"
              onClick={adicionarItem}
              className="px-3 py-1.5 rounded-lg bg-[var(--adm-bg)] border border-[var(--adm-line)] hover:border-[var(--adm-blue-soft)] text-[var(--adm-text)] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[var(--adm-blue-soft)]" />
              <span>Adicionar item</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {modeloAtivo.itens.map((item, idx) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-[var(--adm-bg)] border border-[var(--adm-line)] grid grid-cols-1 md:grid-cols-[80px_1fr_180px_210px_84px] gap-2.5 items-start"
              >
                <div>
                  <label className="block text-[10px] font-bold text-[var(--adm-mut)] mb-1">Nº</label>
                  <input
                    type="text"
                    value={item.numero}
                    onChange={(e) => atualizarItem(item.id, { numero: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--adm-card)] border border-[var(--adm-line)] text-xs font-mono font-bold text-[var(--adm-text)]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[var(--adm-mut)] mb-1">Texto do Critério</label>
                  <textarea
                    rows={2}
                    value={item.texto}
                    onChange={(e) => atualizarItem(item.id, { texto: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--adm-card)] border border-[var(--adm-line)] text-xs text-[var(--adm-text)] resize-y"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[var(--adm-mut)] mb-1">Norma de Referência</label>
                  <input
                    type="text"
                    value={item.norma}
                    onChange={(e) => atualizarItem(item.id, { norma: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--adm-card)] border border-[var(--adm-line)] text-xs text-[var(--adm-text)]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[var(--adm-mut)] mb-1">Item / Seção do Laudo</label>
                  <input
                    type="text"
                    value={item.secaoLaudo}
                    onChange={(e) => atualizarItem(item.id, { secaoLaudo: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--adm-card)] border border-[var(--adm-line)] text-xs text-[var(--adm-text)]"
                  />
                </div>

                <div className="flex items-center justify-end gap-1 pt-5">
                  <button
                    type="button"
                    onClick={() => moverItem(idx, -1)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg border border-[var(--adm-line)] text-[var(--adm-mut)] hover:text-[var(--adm-text)] disabled:opacity-30 cursor-pointer"
                    title="Mover para cima"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moverItem(idx, 1)}
                    disabled={idx === modeloAtivo.itens.length - 1}
                    className="p-1.5 rounded-lg border border-[var(--adm-line)] text-[var(--adm-mut)] hover:text-[var(--adm-text)] disabled:opacity-30 cursor-pointer"
                    title="Mover para baixo"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removerItem(item.id)}
                    className="p-1.5 rounded-lg border border-[var(--adm-line)] text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                    title="Remover item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
