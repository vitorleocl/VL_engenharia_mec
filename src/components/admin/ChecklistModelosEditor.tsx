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
  ChevronDown,
  Pencil,
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
  const [itemEmEdicaoId, setItemEmEdicaoId] = useState<string | null>(null);

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
    setItemEmEdicaoId(novoItem.id);
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

        <div className="hidden sm:flex items-center gap-2 flex-wrap">
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

      {/* Seletor de modelos horizontal com alvo confortável no celular */}
      <div className="flex flex-nowrap gap-2 overflow-x-auto -mx-1 px-1 pb-1">
        {modelosLocais.map(mod => {
          const ativo = mod.id === modeloAtivo.id;
          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => {
                setModeloAtivoId(mod.id);
                setItemEmEdicaoId(null);
              }}
              aria-pressed={ativo}
              aria-label={`${mod.nome}, ${mod.itens.length} critérios`}
              className={`min-h-11 px-3.5 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
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

      {/* Resumo e edição simplificada do modelo */}
      <div className="bg-[var(--adm-card)] border border-[var(--adm-line)] rounded-2xl p-3.5 sm:p-5 space-y-4">
        <div className="rounded-xl bg-[var(--adm-bg)] border border-[var(--adm-line)] p-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] text-[var(--adm-mut)] font-mono">{modeloAtivo.id.toUpperCase()}</p>
              <p className="text-base font-bold text-[var(--adm-text)] mt-0.5">{modeloAtivo.nome}</p>
              <p className="text-xs text-[var(--adm-mut)] mt-1 flex items-start gap-1.5">
                <BookOpen className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{modeloAtivo.norma}</span>
              </p>
            </div>
            <span className="shrink-0 px-2.5 py-1 rounded-lg bg-[var(--adm-card)] border border-[var(--adm-line)] text-xs font-mono font-bold text-[var(--adm-blue-soft)]">
              {modeloAtivo.itens.length} critérios
            </span>
          </div>
          <label className="block mt-3 text-[11px] font-semibold text-[var(--adm-mut)]">
            Nome do modelo
            <input
              type="text"
              value={modeloAtivo.nome}
              onChange={(e) => atualizarModeloAtivo({ nome: e.target.value })}
              className="mt-1 w-full min-h-11 px-3 rounded-xl bg-[var(--adm-card)] border border-[var(--adm-line)] text-sm font-semibold text-[var(--adm-text)] focus:outline-none focus:border-[var(--adm-blue-soft)]"
            />
          </label>
        </div>

        <label className="block text-[11px] font-semibold text-[var(--adm-mut)]">
          Norma de referência
          <input
            type="text"
            value={modeloAtivo.norma}
            onChange={(e) => atualizarModeloAtivo({ norma: e.target.value })}
            className="mt-1 w-full min-h-11 px-3 rounded-xl bg-[var(--adm-bg)] border border-[var(--adm-line)] text-sm text-[var(--adm-text)] focus:outline-none focus:border-[var(--adm-blue-soft)]"
          />
        </label>

        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-bold text-[var(--adm-text)] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[var(--adm-blue-soft)]" />
              Critérios <span className="text-[var(--adm-mut)] font-mono">({modeloAtivo.itens.length})</span>
            </span>
            <span className="hidden sm:inline text-[11px] text-[var(--adm-mut)]">Use as setas para ordenar</span>
          </div>

          <div className="space-y-2.5">
            {modeloAtivo.itens.map((item, idx) => {
              const editando = itemEmEdicaoId === item.id;
              return (
                <article key={item.id} className="rounded-xl bg-[var(--adm-bg)] border border-[var(--adm-line)] p-3.5">
                  <div className="flex items-start gap-2.5">
                    <span className="shrink-0 min-w-9 h-8 px-1.5 rounded-lg bg-[var(--adm-card)] border border-[var(--adm-line)] font-mono text-xs font-bold text-[var(--adm-text)] flex items-center justify-center">
                      {item.numero}
                    </span>
                    <p className="flex-1 min-w-0 text-sm font-medium leading-snug text-[var(--adm-text)]">{item.texto}</p>
                    <div className="flex shrink-0 -mr-1 -mt-1">
                      <button
                        type="button"
                        onClick={() => moverItem(idx, -1)}
                        disabled={idx === 0}
                        aria-label={`Mover critério ${item.numero} para cima`}
                        className="min-w-10 min-h-10 flex items-center justify-center rounded-lg text-[var(--adm-mut)] hover:text-[var(--adm-text)] disabled:opacity-30"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moverItem(idx, 1)}
                        disabled={idx === modeloAtivo.itens.length - 1}
                        aria-label={`Mover critério ${item.numero} para baixo`}
                        className="min-w-10 min-h-10 flex items-center justify-center rounded-lg text-[var(--adm-mut)] hover:text-[var(--adm-text)] disabled:opacity-30"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {!editando && (
                    <details className="group mt-1.5">
                      <summary className="list-none cursor-pointer min-h-9 flex items-center gap-1 text-xs text-[var(--adm-mut)]">
                        <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                        Detalhes (norma e seção do laudo)
                      </summary>
                      <div className="mt-1 rounded-lg bg-[var(--adm-card)] border border-[var(--adm-line)] p-2.5 text-xs space-y-1.5">
                        <p><span className="text-[var(--adm-mut)]">Norma:</span> <span className="font-mono">{item.norma}</span></p>
                        <p><span className="text-[var(--adm-mut)]">Seção do laudo:</span> {item.secaoLaudo}</p>
                      </div>
                    </details>
                  )}

                  {editando && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <label className="text-[11px] font-semibold text-[var(--adm-mut)]">
                        Número
                        <input type="text" value={item.numero} onChange={(e) => atualizarItem(item.id, { numero: e.target.value })} className="mt-1 w-full min-h-11 px-3 rounded-lg bg-[var(--adm-card)] border border-[var(--adm-line)] text-sm font-mono text-[var(--adm-text)]" />
                      </label>
                      <label className="sm:col-span-2 text-[11px] font-semibold text-[var(--adm-mut)]">
                        Texto do critério
                        <textarea rows={3} value={item.texto} onChange={(e) => atualizarItem(item.id, { texto: e.target.value })} className="mt-1 w-full min-h-20 px-3 py-2.5 rounded-lg bg-[var(--adm-card)] border border-[var(--adm-line)] text-sm text-[var(--adm-text)] resize-y" />
                      </label>
                      <label className="text-[11px] font-semibold text-[var(--adm-mut)]">
                        Norma
                        <input type="text" value={item.norma} onChange={(e) => atualizarItem(item.id, { norma: e.target.value })} className="mt-1 w-full min-h-11 px-3 rounded-lg bg-[var(--adm-card)] border border-[var(--adm-line)] text-sm text-[var(--adm-text)]" />
                      </label>
                      <label className="text-[11px] font-semibold text-[var(--adm-mut)]">
                        Seção do laudo
                        <input type="text" value={item.secaoLaudo} onChange={(e) => atualizarItem(item.id, { secaoLaudo: e.target.value })} className="mt-1 w-full min-h-11 px-3 rounded-lg bg-[var(--adm-card)] border border-[var(--adm-line)] text-sm text-[var(--adm-text)]" />
                      </label>
                    </div>
                  )}

                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setItemEmEdicaoId(editando ? null : item.id)}
                      className="min-h-10 px-3 rounded-lg border border-[var(--adm-line)] text-[var(--adm-text)] text-xs font-semibold inline-flex items-center gap-1.5"
                    >
                      <Pencil className="w-3.5 h-3.5" />{editando ? 'Concluir edição' : 'Editar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Remover o critério ${item.numero}?`)) removerItem(item.id);
                      }}
                      className="min-h-10 px-3 rounded-lg border border-[var(--adm-line)] text-rose-500 text-xs font-semibold inline-flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />Remover
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <button
            type="button"
            onClick={adicionarItem}
            className="w-full min-h-12 rounded-xl border border-dashed border-[var(--adm-line)] bg-[var(--adm-bg)] text-[var(--adm-text)] text-sm font-bold inline-flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 text-[var(--adm-blue-soft)]" />
            Adicionar critério
          </button>
        </div>
      </div>

      <details className="sm:hidden rounded-xl border border-[var(--adm-line)] bg-[var(--adm-card)] p-3.5">
        <summary className="min-h-11 cursor-pointer list-none flex items-center justify-between gap-2 text-sm font-semibold text-[var(--adm-text)]">
          <span className="inline-flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-[var(--adm-mut)]" />
            Restaurar modelos padrão
          </span>
          <span className="text-xs text-[var(--adm-mut)]">Todos os modelos</span>
        </summary>
        <div className="pt-2 space-y-2">
          <p className="text-xs text-[var(--adm-mut)]">
            Substitui os critérios personalizados dos modelos pelas configurações padrão.
          </p>
          <button
            type="button"
            onClick={handleRestaurar}
            className="w-full min-h-11 rounded-lg border border-rose-500/40 text-rose-500 text-sm font-semibold"
          >
            Restaurar padrões
          </button>
        </div>
      </details>

      <div className="sticky bottom-0 z-20 -mx-3.5 sm:-mx-5 px-3.5 sm:px-5 py-3 bg-[var(--adm-card)]/95 backdrop-blur border-t border-[var(--adm-line)] sm:hidden">
        <button
          type="button"
          onClick={handleSalvar}
          className="w-full min-h-12 rounded-xl bg-[var(--adm-blue,#2160db)] text-white text-sm font-bold inline-flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />Salvar modelos
        </button>
      </div>
    </div>
  );
};
