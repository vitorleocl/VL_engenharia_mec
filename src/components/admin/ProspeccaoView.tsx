import React, { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Sparkles, Loader2, Plus, Trash2, MessageCircle, Mail, Copy, Check, Upload, X, Pencil, Phone, AtSign, MapPin } from 'lucide-react';
import { db, auth } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';

type Status = 'novo' | 'contatado' | 'respondeu' | 'orcamento' | 'fechado' | 'perdido';
interface Lead {
  id: string;
  empresa: string;
  contato?: string;
  segmento?: string;
  cidade?: string;
  telefone?: string;
  email?: string;
  servico?: string;
  notas?: string;
  status: Status;
  etapa: number; // próxima etapa de mensagem (1..3); 4 = sequência concluída
  ultimoContatoEm?: string;
  historico?: { em: string; canal: string; etapa: number; remetente: string }[];
  criadoEm: string;
}
interface Config {
  remetenteVitorNome: string; remetenteVitorCargo: string;
  remetenteEduardaNome: string; remetenteEduardaCargo: string;
  remetentePadrao: 'vitor' | 'eduarda';
  diasFollowUp: number;
}
const CFG_PADRAO: Config = {
  remetenteVitorNome: 'Vitor', remetenteVitorCargo: 'Engenheiro Mecânico, VL Engenharia',
  remetenteEduardaNome: 'Eduarda Soares', remetenteEduardaCargo: 'Administrativo, VL Engenharia',
  remetentePadrao: 'vitor', diasFollowUp: 3,
};
const STATUS: { id: Status; label: string }[] = [
  { id: 'novo', label: 'Novo' }, { id: 'contatado', label: 'Contatado' }, { id: 'respondeu', label: 'Respondeu' },
  { id: 'orcamento', label: 'Orçamento' }, { id: 'fechado', label: 'Fechado' }, { id: 'perdido', label: 'Perdido' },
];
const SERVICOS = ['Laudo NR-12', 'Inspeção NR-13 (vasos/caldeiras)', 'Equipamentos de elevação (munck/ponte)', 'HVAC / PMOC', 'Projeto HVAC em Revit (BIM)', 'Laudo de falha mecânica (causa raiz)', 'Laudo veicular / frota', 'Simulação FEA', 'Manutenção e relatórios técnicos'];

const COR: Record<Status, string> = {
  novo: '#1E5BD8', contatado: '#C2610C', respondeu: '#0E7490', orcamento: '#6D4AC9', fechado: '#16A34A', perdido: '#8393A8',
};
const inp = 'w-full px-3 py-2.5 rounded-lg bg-[var(--card)] border border-[var(--line)] text-[14px] text-[var(--ink)] placeholder:text-[var(--muted)]/70 focus-visible:outline-2 focus-visible:outline-[var(--blue)] focus-visible:border-[var(--blue)]';
const rotulo = 'block text-[13px] font-semibold text-[var(--ink)] space-y-1.5';
const btnBase = 'inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-[14px] font-semibold cursor-pointer transition-colors disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-[var(--blue)]';
const btnPri = `${btnBase} bg-[var(--blue)] text-[var(--onblue)] hover:brightness-110`;
const btnSec = `${btnBase} border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--blue)]`;
const foneWa = (t?: string) => {
  const d = (t || '').replace(/\D/g, '');
  if (!d) return '';
  return d.length <= 11 ? '55' + d : d;
};
const diasDesde = (iso?: string) => (iso ? (Date.now() - new Date(iso).getTime()) / 86400000 : Infinity);
const textoUltimo = (iso?: string) => {
  if (!iso) return 'ainda não contatado';
  const d = Math.floor(diasDesde(iso));
  return d <= 0 ? 'contatado hoje' : d === 1 ? 'contatado ontem' : `contatado há ${d} dias`;
};

export const ProspeccaoView: React.FC = () => {
  const { currentUser } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [cfg, setCfg] = useState<Config>(CFG_PADRAO);
  const [aba, setAba] = useState<'fila' | 'leads' | 'config'>('fila');
  const [filtro, setFiltro] = useState<Status | 'todos'>('todos');
  const [form, setForm] = useState<Partial<Lead> | null>(null);
  const [importar, setImportar] = useState('');
  const [mostrarImportar, setMostrarImportar] = useState(false);
  const [ativo, setAtivo] = useState<Lead | null>(null);
  const [erroDb, setErroDb] = useState('');
  const [cfgSalva, setCfgSalva] = useState(false);

  useEffect(() => {
    const un = onSnapshot(collection(db, 'prospeccao'), (snap) => {
      const lista: Lead[] = [];
      snap.forEach((d) => {
        if (d.id === '_config') { setCfg({ ...CFG_PADRAO, ...(d.data() as Partial<Config>) }); return; }
        lista.push({ ...(d.data() as Lead), id: d.id });
      });
      lista.sort((a, b) => (b.criadoEm || '').localeCompare(a.criadoEm || ''));
      setLeads(lista);
    }, (e) => setErroDb(e.message));
    return () => un();
  }, []);

  const salvarLead = async (l: Lead) => {
    try {
      const { id, ...resto } = l;
      await setDoc(doc(db, 'prospeccao', id), JSON.parse(JSON.stringify(resto)), { merge: true });
    } catch (e: any) { setErroDb(e?.message || 'Erro ao salvar'); }
  };

  const adicionar = async (parcial: Partial<Lead>) => {
    if (!parcial.empresa?.trim()) return;
    const id = parcial.id || `l-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    await salvarLead({ status: 'novo', etapa: 1, criadoEm: new Date().toISOString(), ...parcial, empresa: parcial.empresa.trim(), id } as Lead);
  };

  const importarLote = async () => {
    // formato por linha: empresa;contato;telefone;email;segmento;cidade
    const linhas = importar.split('\n').map(l => l.trim()).filter(Boolean);
    for (const l of linhas) {
      const [empresa, contato, telefone, email, segmento, cidade] = l.split(/[;\t]/).map(x => x?.trim());
      await adicionar({ empresa, contato, telefone, email, segmento, cidade });
    }
    setImportar(''); setMostrarImportar(false);
  };

  const fila = useMemo(() => leads.filter(l =>
    ['novo', 'contatado'].includes(l.status) && l.etapa <= 3 &&
    (l.status === 'novo' || diasDesde(l.ultimoContatoEm) >= (cfg.diasFollowUp || 3))
  ), [leads, cfg.diasFollowUp]);

  const visiveis = aba === 'fila' ? fila : leads.filter(l => filtro === 'todos' || l.status === filtro);
  const contagem = (s: Status) => leads.filter(l => l.status === s).length;
  const total = Math.max(leads.length, 1);

  return (
    <div className="px-4 py-5 md:px-8 md:py-7 max-w-5xl mx-auto space-y-6 text-[var(--ink)]" style={{ fontFamily: 'var(--b)' }}>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="max-w-xl">
          <h1 className="text-[28px] leading-tight font-bold" style={{ fontFamily: 'var(--d)' }}>Prospecção</h1>
          <p className="text-[15px] text-[var(--muted)] mt-1">
            Cadastre empresas, deixe o Claude escrever a mensagem e envie pelo WhatsApp ou pelo e-mail depois de revisar.
          </p>
        </div>
        <div className="flex gap-2">
          <button className={btnSec} onClick={() => setMostrarImportar(true)}><Upload className="w-4 h-4" /> Importar lista</button>
          <button className={btnPri} onClick={() => setForm({})}><Plus className="w-4 h-4" /> Novo lead</button>
        </div>
      </header>

      {erroDb && (
        <p role="alert" className="text-[14px] rounded-lg border border-[var(--bad)]/40 bg-[var(--bad)]/10 text-[var(--bad)] px-3 py-2">
          Não foi possível acessar os leads: {erroDb}. Se a mensagem fala de permissão, publique as regras do Firestore com a coleção prospeccao.
        </p>
      )}

      {/* Funil: cada faixa é um status e filtra a lista */}
      <section aria-label="Funil de prospecção">
        <div className="flex h-2.5 rounded-full overflow-hidden bg-[var(--line)]" aria-hidden="true">
          {STATUS.map(s => (
            <div key={s.id} style={{ width: `${(contagem(s.id) / total) * 100}%`, background: COR[s.id], transition: 'width .4s ease' }} />
          ))}
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-3">
          {STATUS.map(s => {
            const sel = aba === 'leads' && filtro === s.id;
            return (
              <button key={s.id} onClick={() => { setAba('leads'); setFiltro(sel ? 'todos' : s.id); }}
                aria-pressed={sel}
                className={`text-left rounded-lg px-3 py-2 border cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[var(--blue)] ${sel ? 'bg-[var(--card)] border-[var(--ink)]' : 'bg-[var(--card)] border-[var(--line)] hover:border-[var(--muted)]'}`}>
                <span className="flex items-center gap-1.5 text-[13px] text-[var(--muted)]">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ background: COR[s.id] }} />{s.label}
                </span>
                <span className="block text-[24px] leading-none font-bold mt-1" style={{ fontFamily: 'var(--d)' }}>{contagem(s.id)}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div role="tablist" className="inline-flex p-1 rounded-lg bg-[var(--line)]/50 border border-[var(--line)]">
        {([['fila', `Para contatar hoje (${fila.length})`], ['leads', `Todos os leads (${leads.length})`], ['config', 'Configurações']] as const).map(([id, nome]) => (
          <button key={id} role="tab" aria-selected={aba === id} onClick={() => { setAba(id); if (id === 'leads') setFiltro('todos'); }}
            className={`px-3.5 py-1.5 rounded-md text-[14px] font-semibold cursor-pointer transition-colors ${aba === id ? 'bg-[var(--card)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)] hover:text-[var(--ink)]'}`}>{nome}</button>
        ))}
      </div>

      {aba === 'config' ? (
        <section className="grid md:grid-cols-2 gap-4 max-w-3xl">
          <fieldset className="md:col-span-2 grid md:grid-cols-2 gap-4 rounded-xl border border-[var(--line)] bg-[var(--card)] p-4">
            <legend className="px-1.5 text-[14px] font-semibold">Assinatura das mensagens</legend>
            {([
              ['remetenteVitorNome', 'Vitor: nome'], ['remetenteVitorCargo', 'Vitor: cargo'],
              ['remetenteEduardaNome', 'Eduarda: nome'], ['remetenteEduardaCargo', 'Eduarda: cargo'],
            ] as const).map(([k, r]) => (
              <label key={k} className={rotulo}>{r}
                <input className={inp} value={cfg[k]} onChange={e => setCfg({ ...cfg, [k]: e.target.value })} /></label>
            ))}
          </fieldset>
          <label className={rotulo}>Quem assina por padrão
            <select className={inp} value={cfg.remetentePadrao} onChange={e => setCfg({ ...cfg, remetentePadrao: e.target.value as any })}>
              <option value="vitor">Vitor, engenheiro</option><option value="eduarda">Eduarda Soares, administrativo</option></select></label>
          <label className={rotulo}>Dias até o follow-up
            <input type="number" min={1} className={inp} value={cfg.diasFollowUp} onChange={e => setCfg({ ...cfg, diasFollowUp: Number(e.target.value) || 3 })} /></label>
          <div className="md:col-span-2">
            <button className={btnPri} onClick={async () => { await setDoc(doc(db, 'prospeccao', '_config'), cfg, { merge: true }); setCfgSalva(true); setTimeout(() => setCfgSalva(false), 2000); }}>
              {cfgSalva ? <><Check className="w-4 h-4" /> Salvo</> : 'Salvar configurações'}
            </button>
          </div>
        </section>
      ) : (
        <section>
          {aba === 'leads' && filtro !== 'todos' && (
            <p className="text-[14px] text-[var(--muted)] mb-3">
              Mostrando leads com status <b className="text-[var(--ink)]">{STATUS.find(s => s.id === filtro)?.label}</b>.{' '}
              <button className="underline cursor-pointer" onClick={() => setFiltro('todos')}>Ver todos</button>
            </p>
          )}
          {visiveis.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--card)] px-6 py-10 text-center">
              <p className="text-[16px] font-semibold">{aba === 'fila' ? 'Ninguém para contatar agora' : 'Nenhum lead por aqui'}</p>
              <p className="text-[14px] text-[var(--muted)] mt-1 mb-4">
                {aba === 'fila' ? `Leads novos e follow-ups com mais de ${cfg.diasFollowUp || 3} dias aparecem nesta lista.` : 'Cadastre uma empresa ou importe uma lista para começar.'}
              </p>
              <button className={btnPri} onClick={() => setForm({})}><Plus className="w-4 h-4" /> Cadastrar lead</button>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {visiveis.map(l => (
                <li key={l.id} className="relative rounded-xl border border-[var(--line)] bg-[var(--card)] pl-5 pr-3 py-3 flex flex-wrap items-center gap-x-4 gap-y-2 overflow-hidden">
                  <span aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: COR[l.status] }} />
                  <div className="flex-1 min-w-[220px]">
                    <p className="text-[16px] font-bold leading-snug" style={{ fontFamily: 'var(--d)' }}>{l.empresa}</p>
                    <p className="text-[13.5px] text-[var(--muted)]">{[l.contato, l.segmento].filter(Boolean).join(', ') || 'Sem detalhes do contato'}</p>
                    <p className="flex flex-wrap gap-x-4 gap-y-0.5 text-[13px] text-[var(--muted)] mt-1">
                      {l.telefone && <span className="inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{l.telefone}</span>}
                      {l.email && <span className="inline-flex items-center gap-1"><AtSign className="w-3.5 h-3.5" />{l.email}</span>}
                      {l.cidade && <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{l.cidade}</span>}
                    </p>
                  </div>
                  <div className="text-[13px] text-[var(--muted)] text-right min-w-[150px]">
                    <p>{l.etapa > 3 ? 'Sequência concluída' : `Próxima: mensagem ${l.etapa} de 3`}</p>
                    <p>{textoUltimo(l.ultimoContatoEm)}</p>
                  </div>
                  <select aria-label={`Status de ${l.empresa}`} className="px-2.5 py-1.5 rounded-lg text-[13.5px] bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] font-semibold" style={{ color: COR[l.status] }} value={l.status}
                    onChange={e => salvarLead({ ...l, status: e.target.value as Status })}>
                    {STATUS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                  <button className={btnPri} onClick={() => setAtivo(l)}><Sparkles className="w-4 h-4" /> Escrever mensagem</button>
                  <button title="Editar lead" aria-label={`Editar ${l.empresa}`} className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--blue)] cursor-pointer" onClick={() => setForm(l)}><Pencil className="w-4 h-4" /></button>
                  <button title="Excluir lead" aria-label={`Excluir ${l.empresa}`} className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--bad)] cursor-pointer" onClick={() => { if (window.confirm(`Excluir ${l.empresa}?`)) deleteDoc(doc(db, 'prospeccao', l.id)); }}><Trash2 className="w-4 h-4" /></button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {form && (
        <Modal titulo={form.id ? 'Editar lead' : 'Novo lead'} onClose={() => setForm(null)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {([['empresa', 'Empresa'], ['contato', 'Nome do contato'], ['telefone', 'WhatsApp'], ['email', 'E-mail'], ['segmento', 'Segmento (ex.: indústria de alimentos)'], ['cidade', 'Cidade']] as const).map(([k, r]) => (
              <label key={k} className={rotulo}>{r}
                <input className={inp} value={(form as any)[k] || ''} onChange={e => setForm({ ...form, [k]: e.target.value })} /></label>
            ))}
            <label className={`${rotulo} sm:col-span-2`}>Serviço em foco
              <select className={inp} value={form.servico || ''} onChange={e => setForm({ ...form, servico: e.target.value })}>
                <option value="">Deixar o Claude escolher pelo segmento</option>{SERVICOS.map(s => <option key={s}>{s}</option>)}
              </select></label>
            <label className={`${rotulo} sm:col-span-2`}>Notas
              <textarea rows={2} className={inp} value={form.notas || ''} onChange={e => setForm({ ...form, notas: e.target.value })} /></label>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button className={btnSec} onClick={() => setForm(null)}>Cancelar</button>
            <button className={btnPri} disabled={!form.empresa?.trim()} onClick={async () => { await adicionar(form); setForm(null); }}>Salvar lead</button>
          </div>
        </Modal>
      )}

      {mostrarImportar && (
        <Modal titulo="Importar lista de empresas" onClose={() => setMostrarImportar(false)}>
          <p className="text-[14px] text-[var(--muted)] mb-2">Uma empresa por linha, separando os campos com ponto e vírgula, nesta ordem: empresa, contato, telefone, e-mail, segmento, cidade.</p>
          <textarea rows={8} className={inp} value={importar} onChange={e => setImportar(e.target.value)} placeholder="Metalúrgica Exemplo;Carlos;81999990000;compras@exemplo.com;metalurgia;Recife" />
          <div className="flex justify-end gap-2 mt-4">
            <button className={btnSec} onClick={() => setMostrarImportar(false)}>Cancelar</button>
            <button className={btnPri} disabled={!importar.trim()} onClick={importarLote}>Importar</button>
          </div>
        </Modal>
      )}

      {ativo && <MensagemModal lead={ativo} cfg={cfg} onClose={() => setAtivo(null)} onEnviado={salvarLead} usuario={currentUser?.email} />}
    </div>
  );
};

const Modal: React.FC<{ titulo: string; onClose: () => void; wide?: boolean; children: React.ReactNode }> = ({ titulo, onClose, wide, children }) => {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-[#071428]/60 p-0 sm:p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label={titulo}
        className={`w-full ${wide ? 'max-w-4xl' : 'max-w-xl'} max-h-[94vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-[var(--paper)] text-[var(--ink)] border border-[var(--line)] shadow-2xl`} style={{ fontFamily: 'var(--b)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--line)] bg-[var(--card)] sticky top-0">
          <h2 className="text-[18px] font-bold" style={{ fontFamily: 'var(--d)' }}>{titulo}</h2>
          <button onClick={onClose} aria-label="Fechar" className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

const MensagemModal: React.FC<{ lead: Lead; cfg: Config; onClose: () => void; onEnviado: (l: Lead) => Promise<void>; usuario?: string }> = ({ lead, cfg, onClose, onEnviado }) => {
  const [canal, setCanal] = useState<'whatsapp' | 'email'>(lead.telefone ? 'whatsapp' : 'email');
  const [etapa, setEtapa] = useState(Math.min(lead.etapa, 3));
  const [rem, setRem] = useState<'vitor' | 'eduarda'>(cfg.remetentePadrao);
  const [servico, setServico] = useState(lead.servico || '');
  const [obs, setObs] = useState('');
  const [assunto, setAssunto] = useState('');
  const [texto, setTexto] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [copiado, setCopiado] = useState(false);
  const [pergEnviou, setPergEnviou] = useState(false);

  const gerar = async () => {
    setCarregando(true); setErro('');
    try {
      const token = await auth.currentUser?.getIdToken();
      const r = await fetch('/api/ai/claude-prospeccao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          lead: { empresa: lead.empresa, contato: lead.contato, segmento: lead.segmento, cidade: lead.cidade, notas: lead.notas },
          canal, etapa, servico, observacao: obs,
          remetente: rem === 'vitor' ? { nome: cfg.remetenteVitorNome, cargo: cfg.remetenteVitorCargo } : { nome: cfg.remetenteEduardaNome, cargo: cfg.remetenteEduardaCargo },
        }),
      });
      const raw = await r.text();
      let j: any = {};
      try { j = JSON.parse(raw); } catch { /* resposta não-JSON */ }
      if (!r.ok) throw new Error(j?.error || `O servidor respondeu ${r.status}. ${raw.slice(0, 120)}`);
      setAssunto(j.assunto || ''); setTexto(j.mensagem || '');
    } catch (e: any) { setErro(e?.message || 'Erro ao gerar'); } finally { setCarregando(false); }
  };

  const marcarEnviado = async () => {
    await onEnviado({
      ...lead,
      status: lead.status === 'novo' ? 'contatado' : lead.status,
      etapa: Math.max(lead.etapa, etapa + 1),
      ultimoContatoEm: new Date().toISOString(),
      historico: [...(lead.historico || []), { em: new Date().toISOString(), canal, etapa, remetente: rem }],
    });
  };

  const abrir = () => {
    if (!texto.trim()) return;
    const url = canal === 'whatsapp'
      ? `https://wa.me/${foneWa(lead.telefone)}?text=${encodeURIComponent(texto)}`
      : `mailto:${lead.email || ''}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(texto)}`;
    window.open(url, '_blank', 'noopener');
    setPergEnviou(true);
  };

  const semDestino = canal === 'whatsapp' ? !foneWa(lead.telefone) : !lead.email;
  const nomeRem = rem === 'vitor' ? cfg.remetenteVitorNome : cfg.remetenteEduardaNome;

  return (
    <Modal wide titulo={`Mensagem para ${lead.empresa}`} onClose={onClose}>
      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-6">
        <div className="space-y-3">
          <fieldset>
            <legend className="text-[13px] font-semibold mb-1.5">Canal</legend>
            <div className="inline-flex p-1 rounded-lg bg-[var(--line)]/50 border border-[var(--line)]">
              {([['whatsapp', 'WhatsApp', MessageCircle], ['email', 'E-mail', Mail]] as const).map(([id, nome, Icone]) => (
                <button key={id} type="button" aria-pressed={canal === id} onClick={() => setCanal(id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[14px] font-semibold cursor-pointer ${canal === id ? 'bg-[var(--card)] shadow-sm' : 'text-[var(--muted)]'}`}><Icone className="w-4 h-4" />{nome}</button>
              ))}
            </div>
          </fieldset>
          <label className={rotulo}>Mensagem
            <select className={inp} value={etapa} onChange={e => setEtapa(Number(e.target.value))}>
              <option value={1}>1 de 3: primeiro contato</option><option value={2}>2 de 3: follow-up</option><option value={3}>3 de 3: última mensagem</option></select></label>
          <label className={rotulo}>Assinada por
            <select className={inp} value={rem} onChange={e => setRem(e.target.value as any)}>
              <option value="vitor">{cfg.remetenteVitorNome}, engenheiro</option><option value="eduarda">{cfg.remetenteEduardaNome}, administrativo</option></select></label>
          <label className={rotulo}>Serviço em foco
            <select className={inp} value={servico} onChange={e => setServico(e.target.value)}>
              <option value="">O Claude escolhe pelo segmento</option>{SERVICOS.map(s => <option key={s}>{s}</option>)}</select></label>
          <label className={rotulo}>Contexto para o Claude (opcional)
            <input className={inp} placeholder="Ex.: conheci a empresa na feira de Recife" value={obs} onChange={e => setObs(e.target.value)} /></label>
          <button className={`${btnPri} w-full`} onClick={gerar} disabled={carregando}>
            {carregando ? <><Loader2 className="w-4 h-4 animate-spin" /> Escrevendo...</> : <><Sparkles className="w-4 h-4" /> {texto ? 'Escrever outra versão' : 'Escrever com Claude'}</>}
          </button>
          {erro && <p role="alert" className="text-[14px] text-[var(--bad)]">{erro}</p>}
        </div>

        <div className="space-y-3">
          <p className="text-[13px] font-semibold">{canal === 'whatsapp' ? `Como ${lead.contato || lead.empresa} vai ver no WhatsApp` : 'Como vai aparecer no e-mail'}</p>
          {canal === 'whatsapp' ? (
            <div className="rounded-xl p-3 min-h-[220px]" style={{ background: '#E7DFD3' }}>
              <textarea aria-label="Texto da mensagem" rows={9} value={texto} onChange={e => setTexto(e.target.value)} placeholder="A mensagem aparece aqui. Você pode editar antes de enviar."
                className="ml-auto block w-[92%] resize-y rounded-xl rounded-tr-sm px-3 py-2 text-[14.5px] leading-snug text-[#111B21] placeholder:text-[#667781] border-0 focus-visible:outline-2 focus-visible:outline-[var(--blue)]" style={{ background: '#D9FDD3', boxShadow: '0 1px 0.5px rgba(11,20,26,.13)' }} />
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--line)] bg-[var(--card)] overflow-hidden min-h-[220px]">
              <div className="px-3 py-2 border-b border-[var(--line)] text-[13px] text-[var(--muted)]">Para: {lead.email || 'sem e-mail cadastrado'}</div>
              <input aria-label="Assunto" value={assunto} onChange={e => setAssunto(e.target.value)} placeholder="Assunto"
                className="w-full px-3 py-2 border-b border-[var(--line)] bg-transparent text-[14.5px] font-semibold text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-[var(--blue)]" />
              <textarea aria-label="Texto do e-mail" rows={9} value={texto} onChange={e => setTexto(e.target.value)} placeholder="O texto aparece aqui. Você pode editar antes de enviar."
                className="w-full px-3 py-2 bg-transparent text-[14.5px] leading-relaxed text-[var(--ink)] resize-y focus-visible:outline-2 focus-visible:outline-[var(--blue)]" />
            </div>
          )}
          {semDestino && <p className="text-[13.5px] text-[var(--warn)]">Este lead não tem {canal === 'whatsapp' ? 'WhatsApp' : 'e-mail'} cadastrado. Edite o lead para poder enviar.</p>}
          {pergEnviou ? (
            <div className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-3 flex flex-wrap items-center gap-3">
              <p className="text-[14px] flex-1 min-w-[180px]">Você enviou a mensagem de {nomeRem}?</p>
              <button className={btnPri} onClick={async () => { await marcarEnviado(); onClose(); }}>Sim, registrar envio</button>
              <button className={btnSec} onClick={() => setPergEnviou(false)}>Ainda não</button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button className={`${btnBase} text-white hover:brightness-110`} style={{ background: 'var(--green)' }} disabled={semDestino || !texto.trim()} onClick={abrir}>
                {canal === 'whatsapp' ? <MessageCircle className="w-4 h-4" /> : <Mail className="w-4 h-4" />} Abrir {canal === 'whatsapp' ? 'WhatsApp' : 'e-mail'}
              </button>
              <button className={btnSec} disabled={!texto.trim()} onClick={() => { navigator.clipboard?.writeText((assunto ? assunto + '\n\n' : '') + texto); setCopiado(true); setTimeout(() => setCopiado(false), 1500); }}>
                {copiado ? <><Check className="w-4 h-4" /> Copiado</> : <><Copy className="w-4 h-4" /> Copiar</>}
              </button>
              <button className={btnSec} disabled={!texto.trim()} onClick={async () => { await marcarEnviado(); onClose(); }}>Já enviei, registrar</button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
