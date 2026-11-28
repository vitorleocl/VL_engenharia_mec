import React, { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Sparkles, Loader2, Plus, Trash2, MessageCircle, Mail, Copy, Check, Upload, Settings, X } from 'lucide-react';
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

const inp = 'w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100';
const btn = 'px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50';
const foneWa = (t?: string) => {
  const d = (t || '').replace(/\D/g, '');
  if (!d) return '';
  return d.length <= 11 ? '55' + d : d;
};
const diasDesde = (iso?: string) => (iso ? (Date.now() - new Date(iso).getTime()) / 86400000 : Infinity);

export const ProspeccaoView: React.FC = () => {
  const { currentUser } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [cfg, setCfg] = useState<Config>(CFG_PADRAO);
  const [aba, setAba] = useState<'fila' | 'leads' | 'config'>('fila');
  const [filtro, setFiltro] = useState<Status | 'todos'>('todos');
  const [novo, setNovo] = useState<Partial<Lead>>({});
  const [mostrarNovo, setMostrarNovo] = useState(false);
  const [importar, setImportar] = useState('');
  const [mostrarImportar, setMostrarImportar] = useState(false);
  const [ativo, setAtivo] = useState<Lead | null>(null);
  const [erroDb, setErroDb] = useState('');

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
    const id = `l-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
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

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-600" /> Prospecção</h1>
          <p className="text-xs text-slate-500">Agente de IA da VL: escreve a mensagem, você revisa e envia pelo WhatsApp ou e-mail.</p>
        </div>
        <div className="flex gap-2">
          <button className={`${btn} border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200`} onClick={() => setMostrarImportar(true)}><Upload className="w-3.5 h-3.5" /> Importar lista</button>
          <button className={`${btn} bg-blue-600 text-white`} onClick={() => { setNovo({}); setMostrarNovo(true); }}><Plus className="w-3.5 h-3.5" /> Novo lead</button>
        </div>
      </div>

      {erroDb && <p className="text-xs text-red-600">Erro no banco: {erroDb}. Se for "permissions", publique as regras do Firestore (firestore.rules) com a coleção prospeccao.</p>}

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {STATUS.map(s => (
          <div key={s.id} className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 text-center">
            <div className="text-lg font-black text-slate-900 dark:text-white">{contagem(s.id)}</div>
            <div className="text-[10px] text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700">
        {([['fila', `Fila de hoje (${fila.length})`], ['leads', `Todos os leads (${leads.length})`], ['config', 'Configurações']] as const).map(([id, nome]) => (
          <button key={id} onClick={() => setAba(id)} className={`px-3 py-2 text-xs font-bold cursor-pointer border-b-2 ${aba === id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}>{nome}</button>
        ))}
      </div>

      {aba === 'config' ? (
        <div className="grid md:grid-cols-2 gap-3 max-w-3xl">
          {([
            ['remetenteVitorNome', 'Vitor: nome na assinatura'], ['remetenteVitorCargo', 'Vitor: cargo'],
            ['remetenteEduardaNome', 'Eduarda: nome na assinatura'], ['remetenteEduardaCargo', 'Eduarda: cargo'],
          ] as const).map(([k, rotulo]) => (
            <label key={k} className="text-xs font-bold text-slate-700 dark:text-slate-300 space-y-1 block">{rotulo}
              <input className={inp} value={cfg[k]} onChange={e => setCfg({ ...cfg, [k]: e.target.value })} /></label>
          ))}
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 space-y-1 block">Remetente padrão
            <select className={inp} value={cfg.remetentePadrao} onChange={e => setCfg({ ...cfg, remetentePadrao: e.target.value as any })}>
              <option value="vitor">Vitor (Engenheiro)</option><option value="eduarda">Eduarda Soares (Administrativo)</option></select></label>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 space-y-1 block">Dias até o follow-up
            <input type="number" min={1} className={inp} value={cfg.diasFollowUp} onChange={e => setCfg({ ...cfg, diasFollowUp: Number(e.target.value) || 3 })} /></label>
          <div className="md:col-span-2">
            <button className={`${btn} bg-blue-600 text-white`} onClick={() => setDoc(doc(db, 'prospeccao', '_config'), cfg, { merge: true })}><Check className="w-3.5 h-3.5" /> Salvar configurações</button>
          </div>
        </div>
      ) : (
        <>
          {aba === 'leads' && (
            <div className="flex flex-wrap gap-1">
              {(['todos', ...STATUS.map(s => s.id)] as const).map(f => (
                <button key={f} onClick={() => setFiltro(f as any)} className={`px-2 py-1 rounded-md text-[11px] font-bold cursor-pointer ${filtro === f ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>{f === 'todos' ? 'Todos' : STATUS.find(s => s.id === f)?.label}</button>
              ))}
            </div>
          )}
          {visiveis.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">{aba === 'fila' ? 'Nada na fila agora. Cadastre leads ou aguarde o prazo do follow-up.' : 'Nenhum lead aqui ainda.'}</p>
          ) : (
            <div className="space-y-2">
              {visiveis.map(l => (
                <div key={l.id} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{l.empresa}</div>
                    <div className="text-[11px] text-slate-500">{[l.contato, l.segmento, l.cidade].filter(Boolean).join(' · ') || 'sem detalhes'}</div>
                    <div className="text-[11px] text-slate-500">{[l.telefone, l.email].filter(Boolean).join(' · ')}</div>
                  </div>
                  <select className="px-2 py-1 rounded-md text-[11px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100" value={l.status}
                    onChange={e => salvarLead({ ...l, status: e.target.value as Status })}>
                    {STATUS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                  <span className="text-[10px] text-slate-500">{l.etapa > 3 ? 'sequência concluída' : `próxima: etapa ${l.etapa}`}</span>
                  <button className={`${btn} bg-purple-600 text-white`} onClick={() => setAtivo(l)}><Sparkles className="w-3.5 h-3.5" /> Escrever mensagem</button>
                  <button title="Excluir" className="p-2 text-slate-400 hover:text-red-600 cursor-pointer" onClick={() => { if (window.confirm(`Excluir ${l.empresa}?`)) deleteDoc(doc(db, 'prospeccao', l.id)); }}><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {mostrarNovo && (
        <Modal titulo="Novo lead" onClose={() => setMostrarNovo(false)}>
          <div className="grid grid-cols-2 gap-2">
            {([['empresa', 'Empresa *'], ['contato', 'Contato'], ['telefone', 'Telefone / WhatsApp'], ['email', 'E-mail'], ['segmento', 'Segmento (ex.: indústria de alimentos)'], ['cidade', 'Cidade']] as const).map(([k, r]) => (
              <input key={k} className={inp} placeholder={r} value={(novo as any)[k] || ''} onChange={e => setNovo({ ...novo, [k]: e.target.value })} />
            ))}
            <select className={`${inp} col-span-2`} value={novo.servico || ''} onChange={e => setNovo({ ...novo, servico: e.target.value })}>
              <option value="">Serviço em foco (a IA escolhe se vazio)</option>{SERVICOS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <button className={`${btn} bg-blue-600 text-white mt-3`} onClick={async () => { await adicionar(novo); setMostrarNovo(false); }}>Salvar lead</button>
        </Modal>
      )}

      {mostrarImportar && (
        <Modal titulo="Importar lista" onClose={() => setMostrarImportar(false)}>
          <p className="text-xs text-slate-500 mb-2">Uma linha por lead, separado por ponto e vírgula: <code>empresa;contato;telefone;email;segmento;cidade</code></p>
          <textarea rows={8} className={inp} value={importar} onChange={e => setImportar(e.target.value)} placeholder="Metalúrgica Exemplo;Carlos;81999990000;compras@exemplo.com;metalurgia;Recife" />
          <button className={`${btn} bg-blue-600 text-white mt-3`} onClick={importarLote}>Importar</button>
        </Modal>
      )}

      {ativo && <MensagemModal lead={ativo} cfg={cfg} onClose={() => setAtivo(null)} onEnviado={salvarLead} usuario={currentUser?.email} />}
    </div>
  );
};

const Modal: React.FC<{ titulo: string; onClose: () => void; children: React.ReactNode }> = ({ titulo, onClose, children }) => (
  <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4">
    <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-black text-slate-900 dark:text-white">{titulo}</h3>
        <button onClick={onClose} className="text-slate-400 p-1 cursor-pointer"><X className="w-5 h-5" /></button>
      </div>
      {children}
    </div>
  </div>
);

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
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j?.error || `Falha (${r.status})`);
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

  const abrir = async () => {
    if (!texto.trim()) return;
    const url = canal === 'whatsapp'
      ? `https://wa.me/${foneWa(lead.telefone)}?text=${encodeURIComponent(texto)}`
      : `mailto:${lead.email || ''}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(texto)}`;
    window.open(url, '_blank', 'noopener');
    if (window.confirm('Você enviou a mensagem? Clique em OK para registrar o envio e avançar a etapa.')) {
      await marcarEnviado(); onClose();
    }
  };

  const semDestino = canal === 'whatsapp' ? !foneWa(lead.telefone) : !lead.email;

  return (
    <Modal titulo={`Mensagem para ${lead.empresa}`} onClose={onClose}>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Canal
          <select className={inp} value={canal} onChange={e => setCanal(e.target.value as any)}><option value="whatsapp">WhatsApp</option><option value="email">E-mail</option></select></label>
        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Etapa
          <select className={inp} value={etapa} onChange={e => setEtapa(Number(e.target.value))}><option value={1}>1 · Primeiro contato</option><option value={2}>2 · Follow-up</option><option value={3}>3 · Última mensagem</option></select></label>
        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Enviado por
          <select className={inp} value={rem} onChange={e => setRem(e.target.value as any)}><option value="vitor">{cfg.remetenteVitorNome} (Engenheiro)</option><option value="eduarda">{cfg.remetenteEduardaNome} (Administrativo)</option></select></label>
        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Serviço
          <select className={inp} value={servico} onChange={e => setServico(e.target.value)}><option value="">IA escolhe</option>{SERVICOS.map(s => <option key={s}>{s}</option>)}</select></label>
      </div>
      <input className={inp} placeholder="Observação para a IA (opcional): ex. conheci a empresa na feira X" value={obs} onChange={e => setObs(e.target.value)} />
      <button className={`${btn} bg-purple-600 text-white mt-2`} onClick={gerar} disabled={carregando}>
        {carregando ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Gerando...</> : <><Sparkles className="w-3.5 h-3.5" /> {texto ? 'Gerar outra versão' : 'Gerar com Claude'}</>}
      </button>
      {erro && <p className="text-xs text-red-600 mt-2">{erro}</p>}
      {(texto || assunto) && (
        <div className="mt-3 space-y-2">
          {canal === 'email' && <input className={inp} value={assunto} onChange={e => setAssunto(e.target.value)} placeholder="Assunto" />}
          <textarea rows={9} className={inp} value={texto} onChange={e => setTexto(e.target.value)} />
          {semDestino && <p className="text-xs text-amber-600">Este lead não tem {canal === 'whatsapp' ? 'telefone' : 'e-mail'} cadastrado. Edite o lead para enviar.</p>}
          <div className="flex flex-wrap gap-2">
            <button className={`${btn} bg-emerald-600 text-white`} disabled={semDestino} onClick={abrir}>
              {canal === 'whatsapp' ? <MessageCircle className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />} Abrir {canal === 'whatsapp' ? 'WhatsApp' : 'e-mail'}
            </button>
            <button className={`${btn} border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200`} onClick={() => { navigator.clipboard?.writeText((assunto ? assunto + '\n\n' : '') + texto); setCopiado(true); setTimeout(() => setCopiado(false), 1500); }}>
              {copiado ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copiar
            </button>
            <button className={`${btn} border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200`} onClick={async () => { await marcarEnviado(); onClose(); }}>Marcar como enviado</button>
          </div>
        </div>
      )}
    </Modal>
  );
};
