import React, { useMemo, useState } from 'react';
import { Check, Layers3, Pencil, Plus, Save, Trash2, Wrench } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ServicoItem, SubtipoServico } from '../../data/servicosCatalogo';

const novoId = (prefixo: string) => `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const ServicosView: React.FC = () => {
  const { servicosCatalogo, atualizarServicosCatalogo } = useData();
  const [servicoEditandoId, setServicoEditandoId] = useState<string | null>(null);
  const [subtipoEditandoId, setSubtipoEditandoId] = useState<string | null>(null);
  const [servicoNome, setServicoNome] = useState('');
  const [servicoNorma, setServicoNorma] = useState('');
  const [servicoDescricao, setServicoDescricao] = useState('');
  const [subtipoServicoId, setSubtipoServicoId] = useState('');
  const [subtipoNome, setSubtipoNome] = useState('');
  const [subtipoNormas, setSubtipoNormas] = useState('');
  const [subtipoDetalhe, setSubtipoDetalhe] = useState('');
  const [checklistTexto, setChecklistTexto] = useState('');
  const [secoesTexto, setSecoesTexto] = useState('');
  const [mensagem, setMensagem] = useState('');

  const servicoSelecionado = useMemo(
    () => servicosCatalogo.find((servico) => servico.id === subtipoServicoId),
    [servicosCatalogo, subtipoServicoId],
  );
  const totalSubtipos = servicosCatalogo.reduce((total, servico) => total + servico.subtipos.length, 0);

  const limparServico = () => {
    setServicoEditandoId(null);
    setServicoNome('');
    setServicoNorma('');
    setServicoDescricao('');
  };

  const limparSubtipo = () => {
    setSubtipoEditandoId(null);
    setSubtipoNome('');
    setSubtipoNormas('');
    setSubtipoDetalhe('');
    setChecklistTexto('');
    setSecoesTexto('');
  };

  const salvarServico = (event: React.FormEvent) => {
    event.preventDefault();
    const nome = servicoNome.trim();
    if (!nome || !servicoNorma.trim() || !servicoDescricao.trim()) return;

    if (servicoEditandoId) {
      atualizarServicosCatalogo(servicosCatalogo.map((item) => item.id === servicoEditandoId
        ? { ...item, nome, norma: servicoNorma.trim(), descricao: servicoDescricao.trim() }
        : item));
      setMensagem('Serviço atualizado.');
    } else {
      const servico: ServicoItem = {
        id: novoId('servico'),
        nome,
        norma: servicoNorma.trim(),
        descricao: servicoDescricao.trim(),
        subtipos: [],
      };
      atualizarServicosCatalogo([...servicosCatalogo, servico]);
      setSubtipoServicoId(servico.id!);
      setMensagem('Serviço criado. Agora adicione uma especificação de subtipo/laudo.');
    }
    limparServico();
  };

  const salvarSubtipo = (event: React.FormEvent) => {
    event.preventDefault();
    if (!servicoSelecionado || !subtipoNome.trim() || !subtipoNormas.trim() || !subtipoDetalhe.trim()) return;

    const subtipo: SubtipoServico = {
      id: subtipoEditandoId || novoId('subtipo'),
      nome: subtipoNome.trim(),
      normaRef: subtipoNormas.trim(),
      detalhe: subtipoDetalhe.trim(),
      checklistSugerido: checklistTexto.split('\n').map((item) => item.trim()).filter(Boolean),
      secoesSugeridas: secoesTexto.split('\n').map((item) => item.trim()).filter(Boolean),
    };
    atualizarServicosCatalogo(servicosCatalogo.map((item) => {
      if (item.id !== subtipoServicoId) return item;
      const subtipos = subtipoEditandoId
        ? item.subtipos.map((sub) => sub.id === subtipoEditandoId ? subtipo : sub)
        : [...item.subtipos, subtipo];
      return { ...item, subtipos };
    }));
    setMensagem(subtipoEditandoId ? 'Especificação atualizada.' : 'Especificação adicionada ao catálogo.');
    limparSubtipo();
  };

  const editarServico = (servico: ServicoItem) => {
    setServicoEditandoId(servico.id || null);
    setServicoNome(servico.nome);
    setServicoNorma(servico.norma);
    setServicoDescricao(servico.descricao);
  };

  const editarSubtipo = (servico: ServicoItem, subtipo: SubtipoServico) => {
    setSubtipoServicoId(servico.id || '');
    setSubtipoEditandoId(subtipo.id || null);
    setSubtipoNome(subtipo.nome);
    setSubtipoNormas(subtipo.normaRef);
    setSubtipoDetalhe(subtipo.detalhe);
    setChecklistTexto((subtipo.checklistSugerido || []).join('\n'));
    setSecoesTexto((subtipo.secoesSugeridas || []).join('\n'));
  };

  const excluirServico = (servico: ServicoItem) => {
    if (!window.confirm(`Excluir “${servico.nome}” e todos os seus subtipos?`)) return;
    atualizarServicosCatalogo(servicosCatalogo.filter((item) => item.id !== servico.id));
    if (subtipoServicoId === servico.id) setSubtipoServicoId('');
    setMensagem('Serviço removido do catálogo.');
  };

  const excluirSubtipo = (servico: ServicoItem, subtipo: SubtipoServico) => {
    if (!window.confirm(`Excluir a especificação “${subtipo.nome}”?`)) return;
    atualizarServicosCatalogo(servicosCatalogo.map((item) => item.id === servico.id
      ? { ...item, subtipos: item.subtipos.filter((sub) => sub.id !== subtipo.id) }
      : item));
    if (subtipoEditandoId === subtipo.id) limparSubtipo();
    setMensagem('Especificação removida do catálogo.');
  };

  const inputClass = 'w-full rounded-lg border border-[var(--adm-line)] bg-[var(--adm-bg)] px-3 py-2.5 text-sm text-[var(--adm-text)] placeholder:text-[var(--adm-mut)] focus:border-[var(--adm-blue,#2160db)] focus:outline-none';
  const labelClass = 'block space-y-1.5 text-xs font-semibold text-[var(--adm-text)]';
  const buttonClass = 'inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--adm-blue,#2160db)] px-3 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--adm-blue,#2160db)]">
            <Wrench className="h-4 w-4" /> Gestão do catálogo
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--adm-text)] sm:text-3xl">Serviços</h1>
          <p className="mt-1 max-w-2xl text-sm text-[var(--adm-mut)]">
            Cadastre serviços e organize as especificações de subtipo/laudo usadas na criação de laudos e orçamentos.
          </p>
        </div>
        <div className="flex gap-4 text-sm text-[var(--adm-mut)]">
          <span><strong className="text-[var(--adm-text)]">{servicosCatalogo.length}</strong> serviços</span>
          <span><strong className="text-[var(--adm-text)]">{totalSubtipos}</strong> especificações</span>
        </div>
      </header>

      {mensagem && (
        <div role="status" className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-700 dark:text-emerald-300">
          <Check className="h-4 w-4 shrink-0" /> {mensagem}
          <button type="button" onClick={() => setMensagem('')} className="ml-auto text-xs underline">Dispensar</button>
        </div>
      )}

      <div className="grid items-start gap-5 xl:grid-cols-2">
        <form onSubmit={salvarServico} className="space-y-4 rounded-xl border border-[var(--adm-line)] bg-[var(--adm-card)] p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-[var(--adm-blue,#2160db)]" />
            <h2 className="font-semibold text-[var(--adm-text)]">{servicoEditandoId ? 'Editar serviço' : 'Novo serviço'}</h2>
          </div>
          <label className={labelClass}>Nome do serviço
            <input className={inputClass} value={servicoNome} onChange={(e) => setServicoNome(e.target.value)} placeholder="Ex.: Inspeção de equipamentos" required />
          </label>
          <label className={labelClass}>Norma(s) de referência
            <input className={inputClass} value={servicoNorma} onChange={(e) => setServicoNorma(e.target.value)} placeholder="Ex.: NR-12 · ABNT NBR ISO 12100" required />
          </label>
          <label className={labelClass}>Descrição do serviço
            <textarea className={`${inputClass} min-h-24 resize-y`} value={servicoDescricao} onChange={(e) => setServicoDescricao(e.target.value)} placeholder="Resumo do escopo geral do serviço" required />
          </label>
          <div className="flex gap-2">
            <button type="submit" className={buttonClass}><Save className="h-4 w-4" />{servicoEditandoId ? 'Salvar alterações' : 'Adicionar serviço'}</button>
            {servicoEditandoId && <button type="button" onClick={limparServico} className="rounded-lg border border-[var(--adm-line)] px-3 py-2 text-sm text-[var(--adm-mut)]">Cancelar</button>}
          </div>
        </form>

        <form onSubmit={salvarSubtipo} className="space-y-4 rounded-xl border border-[var(--adm-line)] bg-[var(--adm-card)] p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <Layers3 className="h-4 w-4 text-[var(--adm-blue,#2160db)]" />
            <h2 className="font-semibold text-[var(--adm-text)]">{subtipoEditandoId ? 'Editar especificação' : 'Novo subtipo / laudo'}</h2>
          </div>
          <label className={labelClass}>Serviço pai
            <select className={inputClass} value={subtipoServicoId} onChange={(e) => { setSubtipoServicoId(e.target.value); limparSubtipo(); }} required>
              <option value="">Selecione um serviço</option>
              {servicosCatalogo.map((servico) => <option key={servico.id} value={servico.id}>{servico.nome}</option>)}
            </select>
          </label>
          <label className={labelClass}>Nome da especificação
            <input className={inputClass} value={subtipoNome} onChange={(e) => setSubtipoNome(e.target.value)} placeholder="Ex.: Laudo de conformidade de prensa" required />
          </label>
          <label className={labelClass}>Normas específicas
            <input className={inputClass} value={subtipoNormas} onChange={(e) => setSubtipoNormas(e.target.value)} placeholder="Normas aplicáveis a este subtipo" required />
          </label>
          <label className={labelClass}>Detalhamento do escopo
            <textarea className={`${inputClass} min-h-20 resize-y`} value={subtipoDetalhe} onChange={(e) => setSubtipoDetalhe(e.target.value)} placeholder="O que será inspecionado e documentado" required />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={labelClass}>Checklist sugerido <span className="font-normal text-[var(--adm-mut)]">(um item por linha)</span>
              <textarea className={`${inputClass} min-h-24 resize-y`} value={checklistTexto} onChange={(e) => setChecklistTexto(e.target.value)} placeholder={'Proteções e dispositivos\nParada de emergência'} />
            </label>
            <label className={labelClass}>Seções sugeridas para o laudo <span className="font-normal text-[var(--adm-mut)]">(uma por linha)</span>
              <textarea className={`${inputClass} min-h-24 resize-y`} value={secoesTexto} onChange={(e) => setSecoesTexto(e.target.value)} placeholder={'Identificação e escopo\nAvaliação técnica\nConclusão'} />
            </label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className={buttonClass} disabled={!servicoSelecionado}>
              <Save className="h-4 w-4" />{subtipoEditandoId ? 'Salvar alterações' : 'Adicionar especificação'}
            </button>
            {subtipoEditandoId && <button type="button" onClick={limparSubtipo} className="rounded-lg border border-[var(--adm-line)] px-3 py-2 text-sm text-[var(--adm-mut)]">Cancelar</button>}
          </div>
        </form>
      </div>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-[var(--adm-text)]">Catálogo Oficial de Serviços</h2>
          <p className="text-sm text-[var(--adm-mut)]">Os serviços e subtipos cadastrados ficam disponíveis nos formulários de novos laudos e orçamentos.</p>
        </div>
        {servicosCatalogo.map((servico) => (
          <article key={servico.id} className="rounded-xl border border-[var(--adm-line)] bg-[var(--adm-card)] p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h3 className="font-semibold text-[var(--adm-text)]">{servico.nome}</h3>
                <p className="mt-1 text-xs font-medium text-[var(--adm-blue,#2160db)]">{servico.norma}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--adm-mut)]">{servico.descricao}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={() => editarServico(servico)} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--adm-line)] px-2.5 py-2 text-xs font-semibold text-[var(--adm-text)] hover:bg-[var(--adm-bg)]"><Pencil className="h-3.5 w-3.5" />Editar</button>
                <button type="button" onClick={() => excluirServico(servico)} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/10"><Trash2 className="h-3.5 w-3.5" />Excluir</button>
              </div>
            </div>
            <div className="mt-4 border-t border-[var(--adm-line)] pt-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--adm-mut)]">Especificações / subtipos ({servico.subtipos.length})</p>
              {servico.subtipos.length ? (
                <ul className="divide-y divide-[var(--adm-line)]">
                  {servico.subtipos.map((subtipo) => (
                    <li key={subtipo.id || subtipo.nome} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--adm-text)]">{subtipo.nome}</p>
                        <p className="mt-0.5 text-xs text-[var(--adm-mut)]">{subtipo.normaRef}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-[var(--adm-mut)]">{subtipo.detalhe}</p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button type="button" onClick={() => editarSubtipo(servico, subtipo)} className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-[var(--adm-blue,#2160db)] hover:bg-[var(--adm-bg)]"><Pencil className="h-3 w-3" />Editar</button>
                        <button type="button" onClick={() => excluirSubtipo(servico, subtipo)} className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-500/10"><Trash2 className="h-3 w-3" />Excluir</button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p className="py-2 text-sm text-[var(--adm-mut)]">Nenhuma especificação cadastrada.</p>}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};
