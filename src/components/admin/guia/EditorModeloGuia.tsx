import React, { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { ArrowDown, ArrowUp, Check, Plus, Save, Trash2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { GuiaModeloServico } from '../../../types';
import { db } from '../../../lib/firebase';

interface EditorModeloGuiaProps {
  modelo: GuiaModeloServico;
  onClose: () => void;
}

export const EditorModeloGuia: React.FC<EditorModeloGuiaProps> = ({ modelo, onClose }) => {
  const { currentUser } = useAuth();
  const [rascunho, setRascunho] = useState(modelo);
  const [novoGrupo, setNovoGrupo] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  useEffect(() => setRascunho(modelo), [modelo]);

  const atualizarItem = (grupoIndex: number, itemIndex: number, texto: string) => {
    setRascunho((anterior) => ({
      ...anterior,
      grupos: anterior.grupos.map((grupo, index) => index !== grupoIndex ? grupo : ({
        ...grupo,
        itens: grupo.itens.map((item, itemIdx) => itemIdx === itemIndex ? { ...item, texto } : item),
      })),
    }));
  };

  const moverItem = (grupoIndex: number, itemIndex: number, deslocamento: -1 | 1) => {
    setRascunho((anterior) => ({
      ...anterior,
      grupos: anterior.grupos.map((grupo, index) => {
        if (index !== grupoIndex) return grupo;
        const proximo = itemIndex + deslocamento;
        if (proximo < 0 || proximo >= grupo.itens.length) return grupo;
        const itens = [...grupo.itens];
        [itens[itemIndex], itens[proximo]] = [itens[proximo], itens[itemIndex]];
        return { ...grupo, itens: itens.map((item, ordem) => ({ ...item, ordem: ordem + 1 })) };
      }),
    }));
  };

  const adicionarItem = (grupoIndex: number) => {
    setRascunho((anterior) => ({
      ...anterior,
      grupos: anterior.grupos.map((grupo, index) => index !== grupoIndex ? grupo : ({
        ...grupo,
        itens: [...grupo.itens, {
          id: `${modelo.servico}-item-${Date.now()}`,
          texto: 'Novo item de checklist',
          ordem: grupo.itens.length + 1,
        }],
      })),
    }));
  };

  const removerItem = (grupoIndex: number, itemIndex: number) => {
    setRascunho((anterior) => ({
      ...anterior,
      grupos: anterior.grupos.map((grupo, index) => index !== grupoIndex ? grupo : ({
        ...grupo,
        itens: grupo.itens.filter((_, itemIdx) => itemIdx !== itemIndex).map((item, ordem) => ({ ...item, ordem: ordem + 1 })),
      })),
    }));
  };

  const adicionarGrupo = () => {
    const titulo = novoGrupo.trim();
    if (!titulo || rascunho.grupos.some((grupo) => grupo.titulo.toLowerCase() === titulo.toLowerCase())) return;
    setRascunho((anterior) => ({ ...anterior, grupos: [...anterior.grupos, { titulo, itens: [] }] }));
    setNovoGrupo('');
  };

  const salvar = async () => {
    if (currentUser?.role !== 'master') return;
    setSalvando(true);
    setMensagem(null);
    const atualizado = {
      ...rascunho,
      atualizadoEm: new Date().toISOString(),
      atualizadoPor: currentUser.email,
    };
    try {
      await setDoc(doc(db, 'guia_modelos', modelo.servico), atualizado);
      setMensagem('Modelo atualizado. A mudança vale para novos projetos; projetos existentes mantêm o checklist original.');
    } catch (error) {
      console.warn('[Guia Técnico] Falha ao salvar modelo:', error);
      setMensagem('Não foi possível salvar o modelo. Confira a conexão e as regras do Firestore.');
    } finally {
      setSalvando(false);
    }
  };

  if (currentUser?.role !== 'master') return null;

  return (
    <section className="rounded-2xl border border-blue-500/35 bg-[var(--adm-card)] p-4 sm:p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[var(--adm-text)]">Editar checklist-modelo · {modelo.servico.toUpperCase()}</h3>
          <p className="text-xs text-[var(--adm-mut)] mt-1">As edições não modificam projetos já criados.</p>
        </div>
        <button type="button" onClick={onClose} className="min-h-10 px-3 rounded-lg border border-[var(--adm-line)] text-xs text-[var(--adm-text)]">Fechar</button>
      </div>
      <label className="block text-xs font-semibold text-[var(--adm-mut)]">
        Apresentação do serviço
        <textarea value={rascunho.apresentacao} onChange={(event) => setRascunho((anterior) => ({ ...anterior, apresentacao: event.target.value }))} rows={2} className="mt-1 w-full rounded-lg bg-[var(--adm-bg)] border border-[var(--adm-line)] p-3 text-sm text-[var(--adm-text)]" />
      </label>
      <label className="block text-xs font-semibold text-[var(--adm-mut)]">
        Normas (separadas por vírgula)
        <input value={rascunho.normas.join(', ')} onChange={(event) => setRascunho((anterior) => ({ ...anterior, normas: event.target.value.split(',').map((norma) => norma.trim()).filter(Boolean) }))} className="mt-1 w-full min-h-10 px-3 rounded-lg bg-[var(--adm-bg)] border border-[var(--adm-line)] text-sm text-[var(--adm-text)]" />
      </label>
      {rascunho.grupos.map((grupo, grupoIndex) => (
        <fieldset key={`${grupo.titulo}-${grupoIndex}`} className="rounded-xl border border-[var(--adm-line)] p-3 space-y-2">
          <legend className="px-1 text-sm font-bold text-[var(--adm-text)]">{grupo.titulo}</legend>
          {grupo.itens.map((item, itemIndex) => (
            <div key={item.id} className="flex items-center gap-1.5">
              <input value={item.texto} onChange={(event) => atualizarItem(grupoIndex, itemIndex, event.target.value)} aria-label={`Texto do item ${itemIndex + 1} de ${grupo.titulo}`} className="flex-1 min-w-0 min-h-10 px-3 rounded-lg bg-[var(--adm-bg)] border border-[var(--adm-line)] text-xs text-[var(--adm-text)]" />
              <button type="button" onClick={() => moverItem(grupoIndex, itemIndex, -1)} disabled={itemIndex === 0} aria-label="Mover item para cima" className="w-9 h-9 rounded-lg border border-[var(--adm-line)] disabled:opacity-40"><ArrowUp className="w-4 h-4 mx-auto" /></button>
              <button type="button" onClick={() => moverItem(grupoIndex, itemIndex, 1)} disabled={itemIndex === grupo.itens.length - 1} aria-label="Mover item para baixo" className="w-9 h-9 rounded-lg border border-[var(--adm-line)] disabled:opacity-40"><ArrowDown className="w-4 h-4 mx-auto" /></button>
              <button type="button" onClick={() => removerItem(grupoIndex, itemIndex)} aria-label="Remover item" className="w-9 h-9 rounded-lg border border-rose-500/35 text-rose-400"><Trash2 className="w-4 h-4 mx-auto" /></button>
            </div>
          ))}
          <button type="button" onClick={() => adicionarItem(grupoIndex)} className="min-h-9 px-2.5 rounded-lg border border-dashed border-[var(--adm-line)] text-xs text-[var(--adm-text)] inline-flex items-center gap-1"><Plus className="w-3.5 h-3.5" />Adicionar item</button>
        </fieldset>
      ))}
      <div className="flex flex-col sm:flex-row gap-2">
        <input value={novoGrupo} onChange={(event) => setNovoGrupo(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && adicionarGrupo()} placeholder="Nome do novo grupo" className="flex-1 min-h-10 px-3 rounded-lg bg-[var(--adm-bg)] border border-[var(--adm-line)] text-sm text-[var(--adm-text)]" />
        <button type="button" onClick={adicionarGrupo} className="min-h-10 px-3 rounded-lg border border-[var(--adm-line)] text-xs font-semibold text-[var(--adm-text)] inline-flex items-center justify-center gap-1"><Plus className="w-4 h-4" />Adicionar grupo</button>
        <button type="button" onClick={() => void salvar()} disabled={salvando} className="min-h-10 px-3 rounded-lg bg-[var(--adm-blue,#2160db)] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 disabled:opacity-60"><Save className="w-4 h-4" />{salvando ? 'Salvando…' : 'Salvar modelo'}</button>
      </div>
      {mensagem && <p role="status" className="text-xs text-[var(--adm-mut)] inline-flex items-start gap-1.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" />{mensagem}</p>}
    </section>
  );
};
