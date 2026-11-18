import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowDownToLine, BadgeCheck, BarChart3, Building2, Check,
  ChevronRight, CircleHelp, ClipboardList, FileUp, Filter, Mail, MessageCircle,
  Pause, Play, Plus, RefreshCw, Search, Send, Settings2, ShieldCheck, Sparkles,
  Trash2, Users, X,
} from 'lucide-react';
import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import catalogoInicial from '../../../config/servicos-prospeccao.json';
import { db } from '../../lib/firebase';
import {
  deduplicarLeads, emailCorporativo, normalizarCnpj,
  normalizarEmail, normalizarTelefoneProspeccao, parseCsv, sugerirServicos,
} from '../../lib/prospeccao';
import {
  CampanhaProspeccao, ConfigProspeccao, EnvioProspeccao, LeadHistoricoContato,
  LeadProspeccao, LeadStatusProspeccao, MensagemModeloProspeccao,
  ServicoProspeccao, SupressaoProspeccao,
} from '../../types/prospeccao';
import { Cliente } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

type AbaProspecao = 'painel' | 'leads' | 'campanhas' | 'modelos' | 'configuracoes' | 'relatorio';

const STATUS_LEAD: { id: LeadStatusProspeccao; label: string }[] = [
  { id: 'novo', label: 'Novo' },
  { id: 'qualificado', label: 'Qualificado' },
  { id: 'contatado', label: 'Contatado' },
  { id: 'respondeu', label: 'Respondeu' },
  { id: 'reuniao', label: 'Reunião' },
  { id: 'proposta', label: 'Proposta' },
  { id: 'ganho', label: 'Ganho' },
  { id: 'perdido', label: 'Perdido' },
  { id: 'descartado', label: 'Descartado' },
];

const DEFAULT_CONFIG: ConfigProspeccao = {
  dryRun: true,
  limiteDiarioEmail: 20,
  limiteDiarioWhatsApp: 20,
  janelaInicio: '08:00',
  janelaFim: '17:00',
  diasSemana: [1, 2, 3, 4, 5],
  intervaloMinimoSegundos: 60,
  intervaloMaximoSegundos: 180,
  assinatura: 'Vitor Leonardo Cordeiro Linhares\nEngenheiro Mecânico · CREA-PE 182229949-0\nVL Engenharia Mecânica · vlengenhariamecanica.com.br\n(81) 98444-2592 · vitorleonardocl@gmail.com',
  cidadePadrao: 'Recife',
  providerWhatsapp: 'assistido',
};

const INPUT = 'w-full rounded-lg border border-[var(--adm-line)] bg-[var(--adm-bg)] px-3 py-2.5 text-sm text-[var(--adm-text)] placeholder:text-[var(--adm-mut)] focus:border-[var(--adm-blue,#2160db)] focus:outline-none';
const CARD = 'rounded-xl border border-[var(--adm-line)] bg-[var(--adm-card)] p-4 sm:p-5';
const BUTTON = 'inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--adm-blue,#2160db)] px-3 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50';
const SOFT_BUTTON = 'inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--adm-line)] px-3 py-2 text-xs font-semibold text-[var(--adm-text)] transition hover:bg-[var(--adm-bg)] disabled:opacity-50';

const mkId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;
const templateDefault = (service: ServicoProspeccao, canal: 'email' | 'whatsapp'): MensagemModeloProspeccao => {
  const common = `Olá, equipe da {{nome_empresa}}. Sou o Vitor, engenheiro mecânico (CREA-PE 182229949-0) da VL Engenharia, em Pernambuco. ${service.dor_do_cliente} ${service.argumento_principal} ${service.cta}`;
  return {
    id: `${service.id}:${canal}`,
    servicoId: service.id,
    canal,
    ...(canal === 'email' ? { assunto: `Engenharia mecânica e ${service.normas.join(' / ')} em {{cidade}}` } : {}),
    corpoTexto: canal === 'email'
      ? `${common}\n\nNorma de referência: {{norma}}.\n\nAtendemos Recife, Região Metropolitana e Pernambuco.\n\n{{assinatura}}\n\nSe preferir não receber novas mensagens, descadastre-se: {{descadastro_url}}`
      : `Olá, equipe de {{nome_empresa}}! Sou o Vitor, engenheiro mecânico da VL Engenharia (CREA-PE 182229949-0).\nApoiamos empresas com {{servico}} ({{norma}}) em {{cidade}}.\n{{cta}}\nVitor Leonardo · VL Engenharia\nDescadastro: {{descadastro_url}}`,
    atualizadoEm: new Date().toISOString(),
  };
};

const aplicarVariaveis = (
  template: string,
  lead: LeadProspeccao,
  service: ServicoProspeccao,
  assinatura: string,
  descadastroUrl = '{{descadastro_url}}',
) => template.replace(/\{\{\s*([a-z_]+)\s*\}\}/gi, (_match, key: string) => {
  const values: Record<string, string> = {
    nome_empresa: lead.nomeFantasia || lead.razaoSocial,
    cidade: lead.municipio || 'Pernambuco',
    servico: service.nome,
    norma: service.normas.join(', '),
    dor: service.dor_do_cliente,
    assinatura,
    descadastro_url: descadastroUrl,
  };
  return values[key] ?? `{{${key}}}`;
});

async function hashString(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function phoneFrom(lead: Partial<LeadProspeccao>) {
  return normalizarTelefoneProspeccao(lead.whatsapp || lead.telefone);
}

function mailtoHref(email: string, subject: string, body: string) {
  return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const ProspeccaoView: React.FC = () => {
  const { currentUser, firebaseUser } = useAuth();
  const { adicionarCliente } = useData();
  const permitido = currentUser?.role === 'master';

  const [aba, setAba] = useState<AbaProspecao>('painel');
  const [servicos, setServicos] = useState<ServicoProspeccao[]>(catalogoInicial.servicos as ServicoProspeccao[]);
  const [leads, setLeads] = useState<LeadProspeccao[]>([]);
  const [campanhas, setCampanhas] = useState<CampanhaProspeccao[]>([]);
  const [modelos, setModelos] = useState<MensagemModeloProspeccao[]>([]);
  const [envios, setEnvios] = useState<EnvioProspeccao[]>([]);
  const [supressoes, setSupressoes] = useState<SupressaoProspeccao[]>([]);
  const [config, setConfig] = useState<ConfigProspeccao>(DEFAULT_CONFIG);
  const [capabilities, setCapabilities] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [leadSelecionadoId, setLeadSelecionadoId] = useState('');
  const [servicoId, setServicoId] = useState(servicos[0]?.id || '');
  const [canal, setCanal] = useState<'email' | 'whatsapp'>('email');
  const [mensagemEditada, setMensagemEditada] = useState('');
  const [assuntoEditado, setAssuntoEditado] = useState('');
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroServico, setFiltroServico] = useState('');
  const [scoreMinimo, setScoreMinimo] = useState(0);
  const [csvStatus, setCsvStatus] = useState('');
  const [municipioBusca, setMunicipioBusca] = useState('Recife');
  const [fonteBusca, setFonteBusca] = useState<'cnpj' | 'places'>('cnpj');
  const [buscando, setBuscando] = useState(false);
  const [resultadosBusca, setResultadosBusca] = useState<LeadProspeccao[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [leadSuppressed, setLeadSuppressed] = useState(false);
  const [suppressionChecking, setSuppressionChecking] = useState(false);
  const [notaEdicao, setNotaEdicao] = useState('');
  const [filtroModeloServico, setFiltroModeloServico] = useState(servicos[0]?.id || '');
  const [novoNomeCampanha, setNovoNomeCampanha] = useState('');
  const [campanhaCanal, setCampanhaCanal] = useState<'email' | 'whatsapp'>('email');
  const [campanhaServico, setCampanhaServico] = useState(servicos[0]?.id || '');
  const [filtroLeadTexto, setFiltroLeadTexto] = useState('');
  const [supressaoInput, setSupressaoInput] = useState('');
  const [novoCnaeCode, setNovoCnaeCode] = useState('');
  const [modeloEmailEditavel, setModeloEmailEditavel] = useState('');
  const [modeloWhatsAppEditavel, setModeloWhatsAppEditavel] = useState('');
  const csvInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!permitido || !db) {
      setLoading(false);
      return;
    }
    const fail = (fonte: string) => (error: Error & { code?: string }) => {
      const codigo = error.code ? ` (${error.code})` : '';
      console.error(`[Prospecção] Falha ao carregar ${fonte}${codigo}:`, error);
      setErro((atual) => {
        const detalhe = `${fonte}${codigo}`;
        if (atual.includes(detalhe)) return atual;
        return `${atual ? `${atual} ` : ''}Falha ao acessar ${detalhe}. Verifique o acesso MASTER e as regras publicadas do Firestore.`;
      });
      setLoading(false);
    };
    const subscriptions = [
      onSnapshot(collection(db, 'leads'), (snapshot) => setLeads(snapshot.docs.map((item) => ({ ...item.data(), id: item.id } as LeadProspeccao))), fail('leads')),
      onSnapshot(collection(db, 'campanhas'), (snapshot) => setCampanhas(snapshot.docs.map((item) => ({ ...item.data(), id: item.id } as CampanhaProspeccao))), fail('campanhas')),
      onSnapshot(collection(db, 'mensagens_modelo'), (snapshot) => setModelos(snapshot.docs.map((item) => ({ ...item.data(), id: item.id } as MensagemModeloProspeccao))), fail('mensagens_modelo')),
      onSnapshot(collection(db, 'envios'), (snapshot) => setEnvios(snapshot.docs.map((item) => ({ ...item.data(), id: item.id } as EnvioProspeccao))), fail('envios')),
      onSnapshot(collection(db, 'supressao'), (snapshot) => setSupressoes(snapshot.docs.map((item) => ({ ...item.data(), id: item.id } as SupressaoProspeccao))), fail('supressao')),
      onSnapshot(doc(db, 'config_prospeccao', 'principal'), (snapshot) => {
        const data = snapshot.data();
        if (data) {
          if (Array.isArray(data.servicos) && data.servicos.length) setServicos(data.servicos as ServicoProspeccao[]);
          setConfig({ ...DEFAULT_CONFIG, ...(data as Partial<ConfigProspeccao>) });
        } else {
          setDoc(doc(db, 'config_prospeccao', 'principal'), {
            ...DEFAULT_CONFIG,
            servicos: catalogoInicial.servicos,
            atualizadoEm: new Date().toISOString(),
          }, { merge: true }).catch(fail('config_prospeccao'));
        }
        setLoading(false);
      }, fail('config_prospeccao')),
    ];
    const token = firebaseUser?.getIdToken();
    void token?.then((idToken) => fetch('/api/prospeccao/status', {
      headers: { Authorization: `Bearer ${idToken}` },
    })).then((response) => response?.ok ? response.json() : null)
      .then((data) => { if (data) setCapabilities(data); })
      .catch(() => setCapabilities({ apiDisponivel: false }));
    return () => subscriptions.forEach((unsubscribe) => unsubscribe());
  }, [permitido, firebaseUser]);

  const serviceById = useCallback((id: string) => servicos.find((service) => service.id === id) || servicos[0], [servicos]);
  const leadSelecionado = leads.find((lead) => lead.id === leadSelecionadoId);
  const serviceSelecionado = serviceById(servicoId);
  useEffect(() => {
    const service = serviceById(filtroModeloServico);
    if (!service) return;
    const emailModel = modelos.find((item) => item.servicoId === service.id && item.canal === 'email')
      || templateDefault(service, 'email');
    const whatsappModel = modelos.find((item) => item.servicoId === service.id && item.canal === 'whatsapp')
      || templateDefault(service, 'whatsapp');
    setModeloEmailEditavel(emailModel.corpoTexto);
    setModeloWhatsAppEditavel(whatsappModel.corpoTexto);
    setAssuntoEditado(emailModel.assunto || '');
  }, [filtroModeloServico, modelos, servicos]);

  const buscaDeSupressao = useCallback(async (lead: Partial<LeadProspeccao>) => {
    const email = normalizarEmail(lead.email);
    const tel = phoneFrom(lead).e164 || '';
    const [emailHash, telHash] = await Promise.all([
      email ? hashString(email) : Promise.resolve(''),
      tel ? hashString(tel) : Promise.resolve(''),
    ]);
    return supressoes.some((item) =>
      (item.tipo === 'email' && item.chaveHash === emailHash)
      || (item.tipo === 'telefone' && item.chaveHash === telHash),
    );
  }, [supressoes]);

  useEffect(() => {
    let active = true;
    if (!leadSelecionado) {
      setLeadSuppressed(false);
      setSuppressionChecking(false);
      return;
    }
    setSuppressionChecking(true);
    void buscaDeSupressao(leadSelecionado).then((result) => {
      if (active) {
        setLeadSuppressed(result);
        setSuppressionChecking(false);
      }
    });
    return () => { active = false; };
  }, [leadSelecionado, buscaDeSupressao]);

  const atualizarLead = async (lead: LeadProspeccao, patch: Partial<LeadProspeccao>) => {
    if (!db) return;
    await setDoc(doc(db, 'leads', lead.id), {
      ...lead,
      ...patch,
      atualizadoEm: new Date().toISOString(),
    }, { merge: true });
  };

  const adicionarLead = async (lead: LeadProspeccao) => {
    if (!db) throw new Error('Firestore não está disponível.');
    const existing = deduplicarLeads([...leads, lead]);
    if (!existing.some((item) => item.id === lead.id)) return false;
    await setDoc(doc(db, 'leads', lead.id), lead, { merge: true });
    return true;
  };

  const montarLead = (data: Partial<LeadProspeccao> & Record<string, any>, source: string): LeadProspeccao => {
    const now = new Date().toISOString();
    const email = normalizarEmail(data.email);
    const phone = normalizarTelefoneProspeccao(data.whatsapp || data.telefone);
    const cnpj = normalizarCnpj(data.cnpj);
    const base = {
      razaoSocial: String(data.razaoSocial || data.nome || data.nomeFantasia || '').trim(),
      nomeFantasia: String(data.nomeFantasia || data.fantasia || '').trim(),
      cnpj,
      cnae: String(data.cnae || '').replace(/\D/g, ''),
      cnaesSecundarios: Array.isArray(data.cnaesSecundarios) ? data.cnaesSecundarios : [],
      segmento: String(data.segmento || '').trim(),
      porte: String(data.porte || '').trim(),
      municipio: String(data.municipio || data.cidade || municipioBusca).trim(),
      uf: String(data.uf || 'PE').toUpperCase(),
      email,
      telefone: String(data.telefone || ''),
      whatsapp: phone.tipo === 'celular' ? String(data.whatsapp || data.telefone || '') : '',
      telefoneE164: phone.e164 || '',
      telefoneTipo: phone.tipo,
      site: String(data.site || '').trim(),
      fonte: source,
    };
    const suggestions = sugerirServicos(base, servicos, 1);
    return {
      ...base,
      id: String(data.id || mkId('lead')),
      servicosSugeridos: suggestions,
      score: suggestions[0]?.score || 0,
      status: 'novo',
      historicoContatos: [],
      criadoEm: now,
      baseLegal: {
        fundamento: 'legitimo_interesse',
        finalidade: 'Prospecção B2B de serviços de engenharia mecânica para pessoa jurídica, com revisão humana antes de qualquer contato.',
        fonte: source,
        registradoEm: now,
      },
    };
  };

  const importarCsv = async (file: File) => {
    setErro('');
    setCsvStatus('Lendo arquivo…');
    try {
      const rows = parseCsv(await file.text());
      if (rows.length < 2) throw new Error('O CSV precisa ter cabeçalho e pelo menos uma linha de dados.');
      const normalizeKey = (key: string) => key.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const headers = rows[0].map(normalizeKey);
      const get = (row: string[], ...candidates: string[]) => {
        const index = headers.findIndex((head) => candidates.includes(head));
        return index >= 0 ? row[index] || '' : '';
      };
      const imported = rows.slice(1).map((row) => montarLead({
        razaoSocial: get(row, 'razaosocial', 'nome', 'empresa'),
        nomeFantasia: get(row, 'nomefantasia', 'fantasia'),
        cnpj: get(row, 'cnpj'),
        cnae: get(row, 'cnae', 'cnaeprincipal'),
        cnaesSecundarios: get(row, 'cnaessecundarios').split(/[;| ]/).filter(Boolean),
        email: get(row, 'email', 'emailcorporativo'),
        telefone: get(row, 'telefone', 'telefonwhatsapp', 'whatsapp', 'fone'),
        municipio: get(row, 'cidade', 'municipio'),
        uf: get(row, 'uf', 'estado') || 'PE',
        segmento: get(row, 'segmento', 'atividade'),
        porte: get(row, 'porte'),
        site: get(row, 'site', 'website'),
      }, `CSV: ${file.name}`)).filter((lead) => lead.razaoSocial);
      const combined = deduplicarLeads([...leads, ...imported]);
      const newOnes = combined.filter((lead) => !leads.some((existing) =>
        (lead.cnpj && normalizarCnpj(existing.cnpj) === lead.cnpj)
        || (lead.email && normalizarEmail(existing.email) === lead.email)
        || (lead.telefoneE164 && existing.telefoneE164 === lead.telefoneE164),
      ));
      for (const lead of newOnes) await adicionarLead(lead);
      setCsvStatus(`${newOnes.length} lead(s) importado(s); ${imported.length - newOnes.length} duplicado(s) ignorado(s).`);
    } catch (error) {
      setCsvStatus('');
      setErro(error instanceof Error ? error.message : 'Falha ao importar CSV.');
    }
  };

  const buscarFonte = async () => {
    if (!firebaseUser) return;
    setBuscando(true);
    setErro('');
    setResultadosBusca([]);
    try {
      const idToken = await firebaseUser.getIdToken();
      const response = await fetch('/api/prospeccao/buscar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({
          fonte: fonteBusca,
          municipio: municipioBusca,
          uf: 'PE',
          cnae: novoCnaeCode,
          servicoId,
          termos: serviceSelecionado?.segmentos_alvo.flatMap((segment) => segment.palavras_chave).slice(0, 8) || [],
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Falha ao consultar a fonte configurada.');
      const mapped = (payload.leads || []).map((row: Record<string, any>) => montarLead(row, payload.fonte || fonteBusca));
      setResultadosBusca(mapped);
      if (payload.info) setSucesso(payload.info);
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Falha na busca.');
    } finally {
      setBuscando(false);
    }
  };

  const adicionarResultado = async (lead: LeadProspeccao) => {
    try {
      const added = await adicionarLead(lead);
      setResultadosBusca((prev) => prev.filter((item) => item.id !== lead.id));
      setSucesso(added ? 'Lead adicionado ao CRM.' : 'Lead duplicado, não foi adicionado.');
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Falha ao salvar lead.');
    }
  };

  const adicionarTodosResultados = async () => {
    let count = 0;
    for (const lead of deduplicarLeads([...leads, ...resultadosBusca])) {
      if (resultadosBusca.some((result) => result.id === lead.id) && !leads.some((old) => old.id === lead.id)) {
        if (await adicionarLead(lead)) count += 1;
      }
    }
    setResultadosBusca([]);
    setSucesso(`${count} lead(s) adicionado(s) ao CRM.`);
  };

  const salvarModelo = async (
    serviceIdToSave = servicoId,
    channelToSave = canal,
    textToSave = mensagemEditada,
    subjectToSave = assuntoEditado,
  ) => {
    if (!db || !serviceById(serviceIdToSave)) return;
    const id = `${serviceIdToSave}:${channelToSave}`;
    const modelo: MensagemModeloProspeccao = {
      id,
      servicoId: serviceIdToSave,
      canal: channelToSave,
      assunto: channelToSave === 'email' ? subjectToSave : undefined,
      corpoTexto: textToSave,
      atualizadoEm: new Date().toISOString(),
    };
    await setDoc(doc(db, 'mensagens_modelo', id), modelo, { merge: true });
    setSucesso('Modelo salvo.');
  };

  const gerarVariacao = async () => {
    if (!firebaseUser || !leadSelecionado || !serviceSelecionado) return;
    setEnviando(true);
    setErro('');
    try {
      const idToken = await firebaseUser.getIdToken();
      const response = await fetch('/api/prospeccao/gerar-mensagem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({
          lead: { nome: leadSelecionado.nomeFantasia || leadSelecionado.razaoSocial, cidade: leadSelecionado.municipio, segmento: leadSelecionado.segmento },
          service: { nome: serviceSelecionado.nome, normas: serviceSelecionado.normas, dor: serviceSelecionado.dor_do_cliente, argumento: serviceSelecionado.argumento_principal, cta: serviceSelecionado.cta },
          channel: canal,
          draft: mensagemEditada,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Não foi possível gerar a variação.');
      setMensagemEditada(String(data.text || ''));
      setSucesso('Variação gerada para revisão. Nenhuma mensagem foi enviada.');
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Falha ao gerar variação.');
    } finally {
      setEnviando(false);
    }
  };

  const prepararMensagem = async (lead: LeadProspeccao, serviceId: string, channel: 'email' | 'whatsapp') => {
    const service = serviceById(serviceId);
    if (!service) return;
    setLeadSelecionadoId(lead.id);
    setServicoId(service.id);
    setCanal(channel);
    const model = modelos.find((item) => item.servicoId === service.id && item.canal === channel) || templateDefault(service, channel);
    setMensagemEditada(model.corpoTexto);
    setAssuntoEditado(model.assunto || '');
    setAba('leads');
    window.setTimeout(() => document.getElementById('prospeccao-preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const gerarPreview = (lead: LeadProspeccao, channel = canal) => {
    const service = serviceById(servicoId);
    if (!service) return '';
    const model = modelos.find((item) => item.servicoId === service.id && item.canal === channel) || templateDefault(service, channel);
    const raw = mensagemEditada || model.corpoTexto;
    return aplicarVariaveis(raw, lead, service, config.assinatura);
  };

  const guardarHistorico = async (
    lead: LeadProspeccao,
    channel: 'email' | 'whatsapp',
    result: LeadHistoricoContato['resultado'],
    message: string,
    sendId?: string,
  ) => {
    if (!db) return;
    const now = new Date().toISOString();
    const entry: LeadHistoricoContato = {
      id: sendId || mkId('contato'),
      canal: channel,
      data: now,
      resultado: result,
      resumo: message.slice(0, 300),
    };
    const newStatus = result === 'respondeu' ? 'respondeu' : result === 'enviado' ? 'contatado' : lead.status;
    await atualizarLead(lead, { status: newStatus, historicoContatos: [...lead.historicoContatos, entry] });
    const envio: EnvioProspeccao = {
      id: sendId || mkId('envio'),
      leadId: lead.id,
      canal: channel,
      status: result === 'enviado' ? 'enviado' : result === 'rascunho' ? 'rascunho' : 'falhou',
      ...(channel === 'email' ? { assunto: assuntoEditado } : {}),
      mensagem: message.slice(0, 10000),
      criadoEm: now,
      ...(result === 'enviado' ? { enviadoEm: now } : {}),
    };
    // O endpoint já registrou simulações e envios diretos; não sobrescrever o status de auditoria.
    if (!sendId) await setDoc(doc(db, 'envios', envio.id), envio);
  };

  const criarLinkDescadastro = async (lead: LeadProspeccao): Promise<string> => {
    if (!firebaseUser) throw new Error('Sessão MASTER indisponível.');
    const idToken = await firebaseUser.getIdToken();
    const response = await fetch('/api/prospeccao/token-descadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
      body: JSON.stringify({
        email: normalizarEmail(lead.email),
        telefoneE164: phoneFrom(lead).e164 || '',
      }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || 'Não foi possível criar link de descadastro.');
    return `${window.location.origin}/api/prospeccao/descadastrar?token=${encodeURIComponent(payload.token)}`;
  };

  const abrirRascunhoEmail = async () => {
    if (!leadSelecionado || !serviceSelecionado) return;
    const blocked = await buscaDeSupressao(leadSelecionado);
    if (blocked) {
      setErro('Este lead está na lista de supressão; contato bloqueado.');
      return;
    }
    if (!emailCorporativo(leadSelecionado.email)) {
      setErro('Informe um e-mail corporativo válido de pessoa jurídica. Endereços públicos/pessoais não podem ser contatados.');
      return;
    }
    try {
      const unsubscribeUrl = await criarLinkDescadastro(leadSelecionado);
      const body = aplicarVariaveis(mensagemEditada, leadSelecionado, serviceSelecionado, config.assinatura, unsubscribeUrl);
      const subject = aplicarVariaveis(assuntoEditado || templateDefault(serviceSelecionado, 'email').assunto || serviceSelecionado.nome, leadSelecionado, serviceSelecionado, config.assinatura);
      window.location.href = mailtoHref(leadSelecionado.email!, subject, body);
      await guardarHistorico(leadSelecionado, 'email', 'rascunho', subject + '\n\n' + body);
      setSucesso('Rascunho aberto no seu aplicativo de e-mail. Só registre o contato após o envio manual.');
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível preparar o e-mail.');
    }
  };

  const enviarEmailAprovado = async () => {
    if (!leadSelecionado || !serviceSelecionado || !firebaseUser) return;
    if (!window.confirm('Confirma o envio desta mensagem para este contato corporativo? O conteúdo foi exibido para sua revisão.')) return;
    setEnviando(true);
    setErro('');
    try {
      if (await buscaDeSupressao(leadSelecionado)) throw new Error('Contato bloqueado pela lista de supressão.');
      if (!emailCorporativo(leadSelecionado.email)) throw new Error('Somente e-mail corporativo válido de pessoa jurídica pode ser contatado.');
      const unsubscribeUrl = await criarLinkDescadastro(leadSelecionado);
      const text = aplicarVariaveis(mensagemEditada, leadSelecionado, serviceSelecionado, config.assinatura, unsubscribeUrl);
      const subject = aplicarVariaveis(assuntoEditado, leadSelecionado, serviceSelecionado, config.assinatura);
      const idToken = await firebaseUser.getIdToken();
      const response = await fetch('/api/prospeccao/enviar-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ leadId: leadSelecionado.id, email: leadSelecionado.email, telefoneE164: phoneFrom(leadSelecionado).e164, subject, text, unsubscribeUrl }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Falha no envio.');
      await guardarHistorico(leadSelecionado, 'email', data.status === 'simulado' ? 'rascunho' : 'enviado', text, data.envioId);
      setSucesso(data.status === 'simulado' ? 'Dry-run ativo: envio simulado e registrado; nada foi entregue.' : 'E-mail enviado e registrado.');
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Falha no envio de e-mail.');
    } finally {
      setEnviando(false);
    }
  };

  const prepararWhatsApp = async (lead: LeadProspeccao, serviceIdToUse = servicoId) => {
    const phone = phoneFrom(lead);
    if (!phone.e164 || phone.tipo !== 'celular') {
      setErro('Só é permitido abrir WhatsApp para um número celular brasileiro validado.');
      return;
    }
    // Abrir a janela durante o gesto do usuário; aguardar rede antes de window.open costuma ser bloqueado.
    const popup = window.open('about:blank', '_blank');
    if (!popup) {
      setErro('Permita pop-ups para abrir o WhatsApp assistido.');
      return;
    }
    popup.opener = null;
    if (await buscaDeSupressao(lead)) {
      popup.close();
      setErro('Este contato está na lista de supressão.');
      return;
    }
    setLeadSelecionadoId(lead.id);
    setCanal('whatsapp');
    const service = serviceById(serviceIdToUse);
    if (service) {
      const model = modelos.find((item) => item.servicoId === service.id && item.canal === 'whatsapp') || templateDefault(service, 'whatsapp');
      try {
        const unsubscribeUrl = await criarLinkDescadastro(lead);
        const message = aplicarVariaveis(model.corpoTexto, lead, service, config.assinatura, unsubscribeUrl);
        popup.location.href = `https://wa.me/${phone.e164.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        setMensagemEditada(model.corpoTexto);
        setAssuntoEditado('');
        setSucesso('WhatsApp abriu com texto pronto. Registre o contato somente após enviar manualmente.');
      } catch (error) {
        popup.close();
        setErro(error instanceof Error ? error.message : 'Não foi possível abrir WhatsApp.');
      }
    }
  };

  const confirmarWhatsappEnviado = async () => {
    if (!leadSelecionado) return;
    const text = gerarPreview(leadSelecionado, 'whatsapp');
    await guardarHistorico(leadSelecionado, 'whatsapp', 'enviado', text);
    setSucesso('Contato WhatsApp registrado manualmente.');
  };

  const salvarConfiguracao = async (next: ConfigProspeccao) => {
    if (!db) return;
    const safeConfig = { ...next, atualizadoEm: new Date().toISOString() };
    await setDoc(doc(db, 'config_prospeccao', 'principal'), {
      ...safeConfig,
      servicos,
    }, { merge: true });
    setConfig(safeConfig);
  };

  const salvarCatalogo = async (next: ServicoProspeccao[]) => {
    if (!db) return;
    setServicos(next);
    await setDoc(doc(db, 'config_prospeccao', 'principal'), {
      ...config,
      servicos: next,
      atualizadoEm: new Date().toISOString(),
    }, { merge: true });
    setSucesso('Catálogo atualizado no Firestore.');
  };

  const descartarLead = async (lead: LeadProspeccao) => {
    const note = window.prompt('Motivo do descarte (opcional):', 'Sem aderência ao serviço');
    if (note === null) return;
    await atualizarLead(lead, { status: 'descartado', notas: [lead.notas, `Descartado: ${note}`].filter(Boolean).join('\n') });
    setSucesso('Lead descartado; nenhuma mensagem foi enviada.');
  };

  const excluirLead = async (lead: LeadProspeccao) => {
    if (!db || !window.confirm('Remover permanentemente este lead? Os hashes de contato serão retidos para respeitar futuros pedidos de supressão.')) return;
    const email = normalizarEmail(lead.email);
    const phone = phoneFrom(lead).e164 || '';
    for (const [type, value] of [['email', email], ['telefone', phone]] as const) {
      if (!value) continue;
      const hash = await hashString(value);
      await setDoc(doc(db, 'supressao', `${type}-${hash}`), {
        id: `${type}-${hash}`,
        tipo: type,
        chaveHash: hash,
        motivo: 'Exclusão solicitada; manter bloqueio para evitar novo contato',
        origem: 'pedido_manual',
        criadoEm: new Date().toISOString(),
      });
    }
    await deleteDoc(doc(db, 'leads', lead.id));
    if (leadSelecionadoId === lead.id) setLeadSelecionadoId('');
    setSucesso('Lead removido e contatos incluídos na supressão usando somente hashes.');
  };

  const converterEmCliente = async (lead: LeadProspeccao) => {
    if (lead.status !== 'ganho') {
      setErro('Marque o lead como Ganho antes de converter em Cliente.');
      return;
    }
    const existing = leads.find((item) => item.id !== lead.id && lead.cnpj && item.cnpj === lead.cnpj);
    if (existing) {
      setErro('Já existe outro lead com o mesmo CNPJ. Resolva a duplicidade antes da conversão.');
      return;
    }
    const email = lead.email || '';
    const telefone = lead.telefone || lead.whatsapp || '';
    const cliente: Omit<Cliente, 'id' | 'criadoEm'> = {
      tipoPessoa: 'juridica',
      razaoSocial: lead.razaoSocial,
      nomeFantasia: lead.nomeFantasia || lead.razaoSocial,
      cpfCnpj: lead.cnpj || '',
      cnpj: lead.cnpj || '',
      contatos: [{ nome: 'Contato comercial', telefone, email }],
      endereco: {
        logradouro: '', numero: '', bairro: '',
        cidade: lead.municipio || '', estado: lead.uf || 'PE', cep: '',
      },
    };
    adicionarCliente(cliente);
    await atualizarLead(lead, { notas: [lead.notas, 'Convertido para Cliente cadastrado.'].filter(Boolean).join('\n') });
    setSucesso('Lead convertido em Cliente.');
  };

  const salvarCampanha = async () => {
    if (!db || !novoNomeCampanha.trim()) return;
    const selectedLeads = leads.filter((lead) => lead.status !== 'descartado' && lead.servicosSugeridos.some((item) => item.servicoId === campanhaServico));
    const campaign: CampanhaProspeccao = {
      id: mkId('campanha'),
      nome: novoNomeCampanha.trim(),
      servicoIds: [campanhaServico],
      canal: campanhaCanal,
      leadIds: selectedLeads.map((lead) => lead.id),
      status: 'rascunho',
      limiteDiario: campanhaCanal === 'email' ? config.limiteDiarioEmail : config.limiteDiarioWhatsApp,
      janelaInicio: config.janelaInicio,
      janelaFim: config.janelaFim,
      criadoEm: new Date().toISOString(),
      criadoPor: currentUser?.email || 'MASTER',
    };
    await setDoc(doc(db, 'campanhas', campaign.id), campaign);
    setNovoNomeCampanha('');
    setSucesso(`Campanha criada como rascunho, com ${campaign.leadIds.length} lead(s) sugerido(s).`);
  };

  const atualizarCampanha = async (campaign: CampanhaProspeccao, status: CampanhaProspeccao['status']) => {
    if (!db) return;
    await setDoc(doc(db, 'campanhas', campaign.id), {
      ...campaign,
      status,
      ...(status === 'aprovada' ? { aprovadoEm: new Date().toISOString() } : {}),
    }, { merge: true });
  };

  const gerarCsvRelatorio = () => {
    const rows = [
      ['data', 'campanha', 'lead_id', 'canal', 'status', 'assunto', 'erro'],
      ...envios.map((item) => [item.enviadoEm || item.criadoEm, item.campanhaId || '', item.leadId, item.canal, item.status, item.assunto || '', item.erro || '']),
    ];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
    link.download = `prospeccao-envios-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const adicionarSupressaoManual = async () => {
    if (!db || !supressaoInput.trim()) return;
    const email = normalizarEmail(supressaoInput);
    const phone = normalizarTelefoneProspeccao(supressaoInput);
    const type = email.includes('@') ? 'email' : 'telefone';
    const value = type === 'email' ? email : phone.e164 || '';
    if (!value) {
      setErro('Informe um e-mail ou telefone válido para bloquear.');
      return;
    }
    const hash = await hashString(value);
    await setDoc(doc(db, 'supressao', `${type}-${hash}`), {
      id: `${type}-${hash}`,
      tipo: type,
      chaveHash: hash,
      motivo: 'Bloqueio manual solicitado pelo MASTER',
      origem: 'pedido_manual',
      criadoEm: new Date().toISOString(),
    });
    setSupressaoInput('');
    setSucesso('Contato adicionado à lista de supressão.');
  };

  const alterarCatalogoServico = (id: string, field: 'nome' | 'normas' | 'dor_do_cliente' | 'argumento_principal' | 'cta', value: string) => {
    setServicos((prev) => prev.map((service) => service.id !== id ? service : {
      ...service,
      [field]: field === 'normas' ? value.split(',').map((item) => item.trim()).filter(Boolean) : value,
    }));
  };

  const alterarSegmentoCatalogo = (
    serviceId: string,
    segmentIndex: number,
    field: 'nome' | 'cnaes' | 'palavras_chave',
    value: string,
  ) => {
    setServicos((prev) => prev.map((service) => {
      if (service.id !== serviceId) return service;
      const segmentos = [...service.segmentos_alvo];
      const segment = segmentos[segmentIndex];
      if (!segment) return service;
      if (field === 'nome') segmentos[segmentIndex] = { ...segment, nome: value };
      if (field === 'palavras_chave') segmentos[segmentIndex] = {
        ...segment,
        palavras_chave: value.split(',').map((item) => item.trim()).filter(Boolean),
      };
      if (field === 'cnaes') {
        const known = new Map(segment.cnaes.map((item) => [item.codigo, item.descricao]));
        segmentos[segmentIndex] = {
          ...segment,
          cnaes: value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
            const separator = line.indexOf('|');
            const codigo = (separator < 0 ? line : line.slice(0, separator)).replace(/\D/g, '');
            const descricao = separator < 0 ? (known.get(codigo) || '') : line.slice(separator + 1).trim();
            return { codigo, descricao };
          }).filter((item) => item.codigo.length === 7),
        };
      }
      segmentos[segmentIndex] = {
        ...segmentos[segmentIndex],
        cnaes: segmentos[segmentIndex].cnaes.filter((item) => item.codigo.length === 7),
      };
      return { ...service, segmentos_alvo: segmentos };
    }));
  };

  const adicionarServicoCatalogo = () => {
    const nome = window.prompt('Nome do novo serviço:');
    if (!nome?.trim()) return;
    const idBase = nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    const id = `${idBase || 'servico'}_${Date.now().toString().slice(-4)}`;
    setServicos((prev) => [...prev, {
      id,
      nome: nome.trim(),
      normas: [],
      dor_do_cliente: '',
      segmentos_alvo: [{ nome: 'Novo segmento', cnaes: [], palavras_chave: [] }],
      argumento_principal: '',
      cta: '',
    }]);
    setFiltroModeloServico(id);
  };

  const salvarCatalogoEditado = () => void salvarCatalogo(servicos);

  const matchingLeads = useMemo(() => leads.filter((lead) => {
    const haystack = `${lead.razaoSocial} ${lead.nomeFantasia || ''} ${lead.cnpj || ''} ${lead.municipio || ''} ${lead.segmento || ''}`.toLowerCase();
    if (busca && !haystack.includes(busca.toLowerCase())) return false;
    if (filtroStatus && lead.status !== filtroStatus) return false;
    if (filtroServico && !lead.servicosSugeridos.some((item) => item.servicoId === filtroServico)) return false;
    return lead.score >= scoreMinimo;
  }).sort((a, b) => b.score - a.score), [leads, busca, filtroStatus, filtroServico, scoreMinimo]);
  const leadsCampanhaFiltrados = leads.filter((lead) => !filtroLeadTexto || `${lead.razaoSocial} ${lead.cnpj || ''}`.toLowerCase().includes(filtroLeadTexto.toLowerCase()));
  const today = new Date().toISOString().slice(0, 10);
  const enviosHoje = envios.filter((item) => (item.enviadoEm || item.criadoEm).slice(0, 10) === today);
  const totalRespostas = envios.filter((item) => item.status === 'enviado').length;
  const taxaResposta = totalRespostas ? Math.round((leads.filter((lead) => lead.status === 'respondeu').length / totalRespostas) * 100) : 0;
  const leadsPorStatus = STATUS_LEAD.map((status) => ({ ...status, total: leads.filter((lead) => lead.status === status.id).length }));
  const templateSelecionado = serviceById(filtroModeloServico);
  const modeloEmail = modelos.find((item) => item.servicoId === filtroModeloServico && item.canal === 'email')
    || (templateSelecionado ? templateDefault(templateSelecionado, 'email') : undefined);
  const modeloWhatsApp = modelos.find((item) => item.servicoId === filtroModeloServico && item.canal === 'whatsapp')
    || (templateSelecionado ? templateDefault(templateSelecionado, 'whatsapp') : undefined);

  useEffect(() => {
    if (!leadSelecionado) return;
    const targetServiceId = leadSelecionado.servicosSugeridos[0]?.servicoId || servicoId;
    const service = serviceById(servicoId);
    if (!service || !leadSelecionado.servicosSugeridos.some((item) => item.servicoId === service.id)) {
      setServicoId(targetServiceId);
    }
  }, [leadSelecionado, serviceById, servicoId]);

  if (!permitido) {
    return (
      <section className={`${CARD} mx-auto max-w-xl text-center`}>
        <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-rose-500" />
        <h1 className="text-xl font-bold text-[var(--adm-text)]">Acesso restrito ao MASTER</h1>
        <p className="mt-2 text-sm text-[var(--adm-mut)]">Prospecção contém dados de contato corporativos e só pode ser operada pelo usuário MASTER.</p>
        <Link to="/admin" className="mt-4 inline-flex text-sm font-semibold text-[var(--adm-blue,#2160db)]">Voltar ao painel</Link>
      </section>
    );
  }

  const tabs: { id: AbaProspecao; label: string; icon: React.ElementType }[] = [
    { id: 'painel', label: 'Painel', icon: BarChart3 },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'campanhas', label: 'Campanhas', icon: Send },
    { id: 'modelos', label: 'Modelos', icon: ClipboardList },
    { id: 'configuracoes', label: 'Configurações', icon: Settings2 },
    { id: 'relatorio', label: 'Relatórios', icon: Activity },
  ];

  const renderLeadContact = (lead: LeadProspeccao, serviceId: string) => {
    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {lead.email && (
          <button type="button" onClick={() => void prepararMensagem(lead, serviceId, 'email')} className={SOFT_BUTTON} title="Criar e revisar mensagem de e-mail">
            <Mail className="h-3.5 w-3.5" /> E-mail
          </button>
        )}
        {lead.telefoneE164 && lead.telefoneTipo === 'celular' && (
          <button type="button" onClick={() => { setServicoId(serviceId); void prepararWhatsApp(lead, serviceId); }} className={SOFT_BUTTON} title="Abrir WhatsApp com texto para envio manual">
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
          </button>
        )}
      </div>
    );
  };

  const renderLeadDetail = () => {
    if (!leadSelecionado || !serviceSelecionado) return null;
    const preview = gerarPreview(leadSelecionado);
    const isSuppressed = leadSuppressed;
    return (
      <div id="prospeccao-preview" className={`${CARD} scroll-mt-24 space-y-4 border-[var(--adm-blue,#2160db)]/40`}>
        <header className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--adm-blue,#2160db)]">Revisão humana obrigatória</p>
            <h3 className="mt-1 font-semibold text-[var(--adm-text)]">{leadSelecionado.nomeFantasia || leadSelecionado.razaoSocial}</h3>
            <p className="text-xs text-[var(--adm-mut)]">{serviceSelecionado.nome} · {canal === 'email' ? 'E-mail' : 'WhatsApp assistido'}</p>
          </div>
          <button type="button" aria-label="Fechar prévia" onClick={() => setLeadSelecionadoId('')} className="rounded-lg p-1 text-[var(--adm-mut)] hover:bg-[var(--adm-bg)]"><X className="h-4 w-4" /></button>
        </header>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-semibold text-[var(--adm-text)]">Serviço
            <select className={`${INPUT} mt-1`} value={servicoId} onChange={(e) => {
              const nextService = serviceById(e.target.value);
              setServicoId(e.target.value);
              if (nextService) {
                const model = modelos.find((item) => item.servicoId === nextService.id && item.canal === canal) || templateDefault(nextService, canal);
                setMensagemEditada(model.corpoTexto);
                setAssuntoEditado(model.assunto || '');
              }
            }}>{servicos.map((service) => <option key={service.id} value={service.id}>{service.nome}</option>)}</select>
          </label>
          <label className="text-xs font-semibold text-[var(--adm-text)]">Canal
            <select className={`${INPUT} mt-1`} value={canal} onChange={(e) => {
              const next = e.target.value as 'email' | 'whatsapp';
              setCanal(next);
              const model = modelos.find((item) => item.servicoId === servicoId && item.canal === next) || templateDefault(serviceSelecionado, next);
              setMensagemEditada(model.corpoTexto);
              setAssuntoEditado(model.assunto || '');
            }}><option value="email">E-mail · rascunho manual ou Zoho aprovado</option><option value="whatsapp">WhatsApp · assistido</option></select>
          </label>
        </div>
        {canal === 'email' && <label className="block text-xs font-semibold text-[var(--adm-text)]">Assunto
          <input className={`${INPUT} mt-1`} value={assuntoEditado} onChange={(e) => setAssuntoEditado(e.target.value)} />
        </label>}
        <label className="block text-xs font-semibold text-[var(--adm-text)]">Mensagem editável
          <textarea className={`${INPUT} mt-1 min-h-44 resize-y font-normal leading-relaxed`} value={mensagemEditada} onChange={(e) => setMensagemEditada(e.target.value)} />
        </label>
        <div className="rounded-lg border border-[var(--adm-line)] bg-[var(--adm-bg)] p-3">
          <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-[var(--adm-mut)]"><span>Prévia final</span><span>{preview.length} caracteres</span></div>
          {canal === 'email' && <p className="mb-2 text-xs text-[var(--adm-text)]"><strong>Assunto:</strong> {aplicarVariaveis(assuntoEditado, leadSelecionado, serviceSelecionado, config.assinatura)}</p>}
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-[var(--adm-text)]">{preview}</p>
        </div>
        {!emailCorporativo(leadSelecionado.email) && canal === 'email' && <p className="flex items-start gap-2 text-xs text-amber-600"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />E-mail inválido ou domínio de provedor pessoal. O contato fica bloqueado pelo controle de conformidade B2B.</p>}
        {isSuppressed && <p className="flex items-start gap-2 text-xs text-rose-600"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />Este contato está na supressão; nenhuma comunicação pode ser iniciada.</p>}
        {config.dryRun && <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">Dry-run ligado: envios diretos são simulados. Rascunhos e WhatsApp assistido ainda exigem ação manual no provedor.</p>}
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={isSuppressed || suppressionChecking} onClick={() => void salvarModelo()} className={SOFT_BUTTON}><ClipboardList className="h-3.5 w-3.5" />Salvar como modelo</button>
          {canal === 'email' ? <>
            <button type="button" disabled={!emailCorporativo(leadSelecionado.email) || isSuppressed || suppressionChecking} onClick={() => void abrirRascunhoEmail()} className={SOFT_BUTTON}><Mail className="h-3.5 w-3.5" />Preparar rascunho no e-mail</button>
            <button type="button" disabled={!emailCorporativo(leadSelecionado.email) || isSuppressed || suppressionChecking || enviando} onClick={() => void enviarEmailAprovado()} className={BUTTON}><Send className="h-3.5 w-3.5" />{enviando ? 'Processando…' : 'Enviar aprovado via Zoho'}</button>
          </> : <>
            <button type="button" disabled={isSuppressed || suppressionChecking} onClick={() => void prepararWhatsApp(leadSelecionado)} className={SOFT_BUTTON}><MessageCircle className="h-3.5 w-3.5" />Abrir wa.me</button>
            <button type="button" onClick={() => void confirmarWhatsappEnviado()} className={BUTTON}><Check className="h-3.5 w-3.5" />Marcar como enviado</button>
          </>}
          <button type="button" disabled={enviando} onClick={() => void gerarVariacao()} className={SOFT_BUTTON}><Sparkles className="h-3.5 w-3.5" />Gerar variação com Gemini</button>
        </div>
        <p className="text-[11px] text-[var(--adm-mut)]">O botão de rascunho abre o cliente de e-mail via mailto. O botão Zoho requer configuração SMTP no servidor e confirmação adicional. Nunca há disparo em lote automático.</p>
      </div>
    );
  };

  if (loading) return <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-[var(--adm-mut)]"><RefreshCw className="h-4 w-4 animate-spin" />Carregando dados de prospecção…</div>;

  return (
    <div className="mx-auto max-w-[1500px] space-y-5 pb-10">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--adm-blue,#2160db)]"><Activity className="h-4 w-4" /> CRM · B2B · LGPD</p>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--adm-text)] sm:text-3xl">Prospecção</h1>
          <p className="mt-1 text-sm text-[var(--adm-mut)]">Descoberta responsável de empresas, revisão humana e registro de contatos.</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 self-start rounded-full border px-3 py-1.5 text-xs font-semibold ${config.dryRun ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'}`}>
          <span className="h-2 w-2 rounded-full bg-current" />{config.dryRun ? 'Dry-run ativo' : 'Envio direto ativado'}
        </span>
      </header>
      <nav className="flex gap-1 overflow-x-auto rounded-xl border border-[var(--adm-line)] bg-[var(--adm-card)] p-1">
        {tabs.map((item) => {
          const Icon = item.icon;
          return <button key={item.id} type="button" onClick={() => setAba(item.id)} className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${aba === item.id ? 'bg-[var(--adm-blue,#2160db)] text-white' : 'text-[var(--adm-mut)] hover:bg-[var(--adm-bg)] hover:text-[var(--adm-text)]'}`}><Icon className="h-3.5 w-3.5" />{item.label}</button>;
        })}
      </nav>
      {erro && <div role="alert" className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-700 dark:text-rose-300"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><span className="flex-1">{erro}</span><button type="button" onClick={() => setErro('')} aria-label="Fechar erro"><X className="h-4 w-4" /></button></div>}
      {sucesso && <div role="status" className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-700 dark:text-emerald-300"><Check className="mt-0.5 h-4 w-4 shrink-0" /><span className="flex-1">{sucesso}</span><button type="button" onClick={() => setSucesso('')} aria-label="Fechar aviso"><X className="h-4 w-4" /></button></div>}

      {aba === 'painel' && <section className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {[
            ['Leads ativos', leads.filter((lead) => !['descartado', 'perdido'].includes(lead.status)).length, Users],
            ['Taxa de resposta', `${taxaResposta}%`, MessageCircle],
            ['Envios hoje', `${enviosHoje.length}/${config.limiteDiarioEmail + config.limiteDiarioWhatsApp}`, Send],
            ['Bounces', envios.filter((item) => item.status === 'bounce').length, AlertTriangle],
            ['Descadastros', supressoes.length, ShieldCheck],
          ].map(([label, value, Icon]: any) => <article key={label} className={CARD}><div className="flex items-center justify-between text-xs text-[var(--adm-mut)]"><span>{label}</span><Icon className="h-4 w-4" /></div><p className="mt-3 text-2xl font-bold tabular-nums text-[var(--adm-text)]">{value}</p></article>)}
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <section className={CARD}>
            <h2 className="font-semibold text-[var(--adm-text)]">Leads por status</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {leadsPorStatus.map((item) => <div key={item.id} className="flex items-center justify-between rounded-lg bg-[var(--adm-bg)] px-3 py-2 text-xs"><span className="text-[var(--adm-mut)]">{item.label}</span><strong className="text-[var(--adm-text)]">{item.total}</strong></div>)}
            </div>
          </section>
          <section className={CARD}>
            <h2 className="font-semibold text-[var(--adm-text)]">Controles de proteção</h2>
            <ul className="mt-3 space-y-2 text-xs text-[var(--adm-mut)]">
              <li className="flex gap-2"><BadgeCheck className="h-4 w-4 shrink-0 text-emerald-500" />Somente MASTER pode acessar o módulo.</li>
              <li className="flex gap-2"><BadgeCheck className="h-4 w-4 shrink-0 text-emerald-500" />Dry-run permanece ligado por padrão.</li>
              <li className="flex gap-2"><BadgeCheck className="h-4 w-4 shrink-0 text-emerald-500" />E-mails pessoais e supressões bloqueiam o contato.</li>
              <li className="flex gap-2"><CircleHelp className="h-4 w-4 shrink-0 text-amber-500" />Fontes conectadas: {capabilities.providers?.cnpj ? 'CNPJ' : 'CNPJ via CSV/integração não configurada'} · {capabilities.providers?.places ? 'Google Places' : 'Places não configurado'}</li>
            </ul>
          </section>
        </div>
      </section>}

      {aba === 'leads' && <section className="space-y-5">
        <section className={`${CARD} grid gap-4 lg:grid-cols-[1fr_1.25fr]`}>
          <div className="space-y-3">
            <div className="flex items-center gap-2"><Search className="h-4 w-4 text-[var(--adm-blue,#2160db)]" /><h2 className="font-semibold text-[var(--adm-text)]">Buscar empresas</h2></div>
            <p className="text-xs leading-relaxed text-[var(--adm-mut)]">CNPJ pela base aberta importada ou API contratada configurada no servidor. Google Places é opcional e não fornece e-mail cadastral.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-semibold text-[var(--adm-text)]">Serviço
                <select className={`${INPUT} mt-1`} value={servicoId} onChange={(e) => setServicoId(e.target.value)}>{servicos.map((service) => <option key={service.id} value={service.id}>{service.nome}</option>)}</select>
              </label>
              <label className="text-xs font-semibold text-[var(--adm-text)]">Fonte
                <select className={`${INPUT} mt-1`} value={fonteBusca} onChange={(e) => setFonteBusca(e.target.value as 'cnpj' | 'places')}><option value="cnpj">CNPJ (API configurada)</option><option value="places">Google Places (opcional)</option></select>
              </label>
              <label className="text-xs font-semibold text-[var(--adm-text)]">Município
                <input className={`${INPUT} mt-1`} value={municipioBusca} onChange={(e) => setMunicipioBusca(e.target.value)} placeholder="Recife" />
              </label>
              <label className="text-xs font-semibold text-[var(--adm-text)]">CNAE principal (opcional)
                <input className={`${INPUT} mt-1`} value={novoCnaeCode} onChange={(e) => setNovoCnaeCode(e.target.value.replace(/\D/g, ''))} placeholder="Ex.: 2511000" />
              </label>
            </div>
            <button type="button" onClick={() => void buscarFonte()} disabled={buscando || !municipioBusca.trim()} className={BUTTON}>{buscando ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}{buscando ? 'Consultando…' : 'Consultar fonte'}</button>
          </div>
          <div className="space-y-3 border-t border-[var(--adm-line)] pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
            <div className="flex items-center gap-2"><FileUp className="h-4 w-4 text-[var(--adm-blue,#2160db)]" /><h2 className="font-semibold text-[var(--adm-text)]">Importar CSV</h2></div>
            <p className="text-xs leading-relaxed text-[var(--adm-mut)]">Colunas aceitas: nome, CNPJ, e-mail, telefone/WhatsApp, cidade, segmento, CNAE, porte, site. Deduplicação por CNPJ/e-mail/telefone.</p>
            <input ref={csvInputRef} type="file" accept=".csv,text/csv" className="block w-full text-xs text-[var(--adm-mut)] file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--adm-bg)] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[var(--adm-text)]" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void importarCsv(file);
              e.currentTarget.value = '';
            }} />
            {csvStatus && <p role="status" className="text-xs text-emerald-600">{csvStatus}</p>}
            <a href="data:text/csv;charset=utf-8,nome%2Ccnpj%2Cemail%2Ctelefone%2Ccidade%2Csegmento%2Ccnae%2Cporte%2Csite%0A" download="modelo-importacao-prospeccao.csv" className="text-xs font-semibold text-[var(--adm-blue,#2160db)] hover:underline">Baixar CSV de exemplo</a>
          </div>
        </section>

        {!!resultadosBusca.length && <section className={`${CARD} space-y-3`}>
          <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-semibold text-[var(--adm-text)]">Resultados ({resultadosBusca.length})</h2><button type="button" className={BUTTON} onClick={() => void adicionarTodosResultados()}><Plus className="h-4 w-4" />Adicionar não duplicados</button></div>
          {resultadosBusca.map((lead) => <div key={lead.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--adm-line)] pt-3">
            <div><p className="text-sm font-semibold text-[var(--adm-text)]">{lead.nomeFantasia || lead.razaoSocial}</p><p className="text-xs text-[var(--adm-mut)]">{lead.cnpj || 'CNPJ não informado'} · {lead.municipio}, {lead.uf} · score {lead.score}</p></div>
            <button type="button" className={SOFT_BUTTON} onClick={() => void adicionarResultado(lead)}><Plus className="h-3.5 w-3.5" />Adicionar lead</button>
          </div>)}
        </section>}

        <section className={`${CARD} space-y-4`}>
          <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
            <div><h2 className="font-semibold text-[var(--adm-text)]">CRM de leads</h2><p className="text-xs text-[var(--adm-mut)]">{matchingLeads.length} resultado(s)</p></div>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <label className="relative"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[var(--adm-mut)]" /><input className={`${INPUT} pl-8`} value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Empresa, CNPJ, cidade…" /></label>
              <select className={INPUT} value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}><option value="">Todos os status</option>{STATUS_LEAD.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
              <select className={INPUT} value={filtroServico} onChange={(e) => setFiltroServico(e.target.value)}><option value="">Todos os serviços</option>{servicos.map((service) => <option key={service.id} value={service.id}>{service.nome}</option>)}</select>
              <label className="flex items-center gap-2 rounded-lg border border-[var(--adm-line)] px-3 text-xs text-[var(--adm-mut)]">Score ≥ <input type="number" min="0" max="100" value={scoreMinimo} onChange={(e) => setScoreMinimo(Number(e.target.value))} className="w-14 bg-transparent py-2 text-[var(--adm-text)] outline-none" /></label>
            </div>
          </div>
          <div className="space-y-2">
            {matchingLeads.map((lead) => (
              <article key={lead.id} className="rounded-lg border border-[var(--adm-line)] p-3 transition-colors hover:bg-[var(--adm-bg)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <button type="button" onClick={() => setLeadSelecionadoId(lead.id)} className="min-w-0 flex-1 text-left">
                    <div className="flex flex-wrap items-center gap-2"><span className="text-sm font-semibold text-[var(--adm-text)]">{lead.nomeFantasia || lead.razaoSocial}</span><span className="rounded-full bg-[var(--adm-blue,#2160db)]/10 px-2 py-0.5 text-[10px] font-bold text-[var(--adm-blue,#2160db)]">{lead.score} pts</span></div>
                    <p className="mt-1 text-xs text-[var(--adm-mut)]">{lead.cnpj || 'CNPJ pendente'} · {lead.segmento || 'Segmento não definido'} · {lead.municipio || 'Município não informado'}/{lead.uf || 'PE'}</p>
                    <p className="mt-1 text-[11px] text-[var(--adm-mut)]">{lead.fonte} · CNAE {lead.cnae || 'não informado'} · {lead.servicosSugeridos.slice(0, 2).map((suggestion) => `${serviceById(suggestion.servicoId)?.nome || suggestion.servicoId}: ${suggestion.motivo}`).join(' | ')}</p>
                  </button>
                  <div className="flex flex-wrap items-center gap-2">
                    <select aria-label={`Status de ${lead.razaoSocial}`} value={lead.status} onChange={(e) => void atualizarLead(lead, { status: e.target.value as LeadStatusProspeccao })} className="rounded-lg border border-[var(--adm-line)] bg-[var(--adm-bg)] px-2 py-2 text-xs text-[var(--adm-text)]">{STATUS_LEAD.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
                    <button type="button" className={SOFT_BUTTON} onClick={() => void descartarLead(lead)} title="Descartar"><X className="h-3.5 w-3.5" /></button>
                    <button type="button" className={SOFT_BUTTON} onClick={() => void excluirLead(lead)} title="Excluir a pedido"><Trash2 className="h-3.5 w-3.5" /></button>
                    {lead.status === 'ganho' && <button type="button" className={SOFT_BUTTON} onClick={() => void converterEmCliente(lead)}><Building2 className="h-3.5 w-3.5" />Converter</button>}
                  </div>
                </div>
                {renderLeadContact(lead, lead.servicosSugeridos[0]?.servicoId || servicoId)}
                {leadSelecionadoId === lead.id && <div className="mt-3 border-t border-[var(--adm-line)] pt-3">
                  <div className="mb-3 grid gap-2 text-xs text-[var(--adm-mut)] sm:grid-cols-2">
                    <span>E-mail: {lead.email || '—'} {lead.email && (emailCorporativo(lead.email) ? <Check className="inline h-3 w-3 text-emerald-500" /> : <AlertTriangle className="inline h-3 w-3 text-amber-500" />)}</span>
                    <span>Telefone: {lead.telefoneE164 || '—'} ({lead.telefoneTipo || 'desconhecido'})</span>
                    <span>Site: {lead.site || '—'}</span><span>Base legal: legítimo interesse · {lead.baseLegal?.fonte || lead.fonte}</span>
                  </div>
                  <label className="block text-xs font-semibold text-[var(--adm-text)]">Notas
                    <textarea className={`${INPUT} mt-1 min-h-16`} value={notaEdicao || lead.notas || ''} onChange={(e) => setNotaEdicao(e.target.value)} placeholder="Notas de prospecção (sem dados pessoais desnecessários)" />
                  </label>
                  <div className="mt-2 flex gap-2"><button type="button" className={SOFT_BUTTON} onClick={() => { void atualizarLead(lead, { notas: notaEdicao }); setNotaEdicao(''); }}>Salvar nota</button><button type="button" className={SOFT_BUTTON} onClick={() => void prepararMensagem(lead, lead.servicosSugeridos[0]?.servicoId || servicoId, 'email')}>Prévia da mensagem</button></div>
                  {!!lead.historicoContatos.length && <div className="mt-3 border-t border-[var(--adm-line)] pt-2"><p className="mb-1 text-xs font-semibold text-[var(--adm-text)]">Histórico</p><ul className="space-y-1">{[...lead.historicoContatos].reverse().map((history) => <li key={history.id} className="text-[11px] text-[var(--adm-mut)]">{new Date(history.data).toLocaleString('pt-BR')} · {history.canal} · {history.resultado} · {history.resumo.slice(0, 100)}</li>)}</ul></div>}
                </div>}
              </article>
            ))}
            {!matchingLeads.length && <p className="rounded-lg bg-[var(--adm-bg)] px-4 py-8 text-center text-sm text-[var(--adm-mut)]">Nenhum lead encontrado. Importe um CSV ou consulte uma fonte configurada.</p>}
          </div>
        </section>
        {renderLeadDetail()}
      </section>}

      {aba === 'campanhas' && <section className="space-y-5">
        <form className={`${CARD} grid gap-3 md:grid-cols-4`} onSubmit={(e) => { e.preventDefault(); void salvarCampanha(); }}>
          <label className="text-xs font-semibold text-[var(--adm-text)] md:col-span-2">Nome da campanha
            <input className={`${INPUT} mt-1`} value={novoNomeCampanha} onChange={(e) => setNovoNomeCampanha(e.target.value)} required placeholder="Ex.: Inspeção NR-12 Recife" />
          </label>
          <label className="text-xs font-semibold text-[var(--adm-text)]">Serviço
            <select className={`${INPUT} mt-1`} value={campanhaServico} onChange={(e) => setCampanhaServico(e.target.value)}>{servicos.map((service) => <option key={service.id} value={service.id}>{service.nome}</option>)}</select>
          </label>
          <label className="text-xs font-semibold text-[var(--adm-text)]">Canal
            <select className={`${INPUT} mt-1`} value={campanhaCanal} onChange={(e) => setCampanhaCanal(e.target.value as 'email' | 'whatsapp')}><option value="email">E-mail</option><option value="whatsapp">WhatsApp assistido</option></select>
          </label>
          <p className="text-xs text-[var(--adm-mut)] md:col-span-3">A campanha é criada como rascunho. A lista inclui somente leads compatíveis com o serviço e não dispara mensagens automaticamente.</p>
          <button className={BUTTON} type="submit"><Plus className="h-4 w-4" />Criar campanha rascunho</button>
        </form>
        <div className={`${CARD} space-y-3`}>
          <div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="font-semibold text-[var(--adm-text)]">Campanhas</h2><p className="text-xs text-[var(--adm-mut)]">{campanhas.length} campanha(s)</p></div><input className={`${INPUT} max-w-xs`} value={filtroLeadTexto} onChange={(e) => setFiltroLeadTexto(e.target.value)} placeholder="Filtrar empresas para campanha" /></div>
          {campanhas.map((campaign) => <article key={campaign.id} className="flex flex-col gap-3 rounded-lg border border-[var(--adm-line)] p-3 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-sm font-semibold text-[var(--adm-text)]">{campaign.nome}</p><p className="mt-1 text-xs text-[var(--adm-mut)]">{serviceById(campaign.servicoIds[0])?.nome} · {campaign.canal} · {campaign.leadIds.length} lead(s) · limite {campaign.limiteDiario}/dia · {campaign.janelaInicio}–{campaign.janelaFim}</p></div>
            <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[var(--adm-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--adm-mut)]">{campaign.status}</span>{campaign.status === 'rascunho' && <button type="button" className={SOFT_BUTTON} onClick={() => void atualizarCampanha(campaign, 'aprovada')}><BadgeCheck className="h-3.5 w-3.5" />Aprovar</button>}{campaign.status === 'aprovada' && <button type="button" className={SOFT_BUTTON} onClick={() => void atualizarCampanha(campaign, 'ativa')}><Play className="h-3.5 w-3.5" />Iniciar</button>}{campaign.status === 'ativa' && <button type="button" className={SOFT_BUTTON} onClick={() => void atualizarCampanha(campaign, 'pausada')}><Pause className="h-3.5 w-3.5" />Pausar</button>}{campaign.status === 'pausada' && <button type="button" className={SOFT_BUTTON} onClick={() => void atualizarCampanha(campaign, 'encerrada')}><X className="h-3.5 w-3.5" />Encerrar</button>}</div>
          </article>)}
          {!campanhas.length && <p className="py-6 text-center text-sm text-[var(--adm-mut)]">Nenhuma campanha criada.</p>}
        </div>
      </section>}

      {aba === 'modelos' && <section className="grid gap-5 xl:grid-cols-[300px_1fr]">
        <div className={`${CARD} space-y-3`}>
          <h2 className="font-semibold text-[var(--adm-text)]">Serviço selecionado</h2>
          <select className={INPUT} value={filtroModeloServico} onChange={(e) => setFiltroModeloServico(e.target.value)}>{servicos.map((service) => <option key={service.id} value={service.id}>{service.nome}</option>)}</select>
          <p className="text-xs text-[var(--adm-mut)]">Normas: {templateSelecionado?.normas.join(', ')}</p>
          <button type="button" className={SOFT_BUTTON} onClick={adicionarServicoCatalogo}><Plus className="h-3.5 w-3.5" />Adicionar serviço</button>
        </div>
        <div className={`${CARD} space-y-4`}>
          <h2 className="font-semibold text-[var(--adm-text)]">Modelos por serviço e canal</h2>
          {[{ title: 'E-mail', model: modeloEmail, text: modeloEmailEditavel, setText: setModeloEmailEditavel }, { title: 'WhatsApp assistido', model: modeloWhatsApp, text: modeloWhatsAppEditavel, setText: setModeloWhatsAppEditavel }].map(({ title, model, text, setText }) => model && <article key={model.canal} className="space-y-2 border-t border-[var(--adm-line)] pt-3">
            <h3 className="text-sm font-semibold text-[var(--adm-text)]">{title}</h3>
            {model.canal === 'email' && <label className="block text-xs font-semibold text-[var(--adm-text)]">Assunto
              <input className={`${INPUT} mt-1`} value={assuntoEditado || model.assunto || ''} onChange={(e) => setAssuntoEditado(e.target.value)} />
            </label>}
            <label className="block text-xs font-semibold text-[var(--adm-text)]">Corpo do modelo
              <textarea className={`${INPUT} mt-1 min-h-40 font-normal leading-relaxed`} value={text} onChange={(e) => setText(e.target.value)} />
            </label>
            <p className="text-[11px] text-[var(--adm-mut)]">Variáveis: {'{{nome_empresa}}'}, {'{{cidade}}'}, {'{{servico}}'}, {'{{norma}}'}, {'{{dor}}'}, {'{{assinatura}}'}, {'{{descadastro_url}}'}.</p>
            <button type="button" className={SOFT_BUTTON} onClick={() => void salvarModelo(
              filtroModeloServico,
              model.canal,
              text,
              model.canal === 'email' ? (assuntoEditado || model.assunto || '') : '',
            )}><Check className="h-3.5 w-3.5" />Salvar modelo de {title.toLowerCase()}</button>
          </article>)}
          <p className="rounded-lg bg-[var(--adm-bg)] p-3 text-xs leading-relaxed text-[var(--adm-mut)]">Os modelos são apresentados e editados na prévia de cada lead. A variação de texto usa Gemini (proxy servidor já existente), não Claude: frases curtas e consultivas, sem promessa de resultado, ameaça ou prazo inventado.</p>
        </div>
      </section>}

      {aba === 'configuracoes' && <section className="space-y-5">
        <section className={`${CARD} space-y-4`}>
          <div><h2 className="font-semibold text-[var(--adm-text)]">Configurações de envio</h2><p className="text-xs text-[var(--adm-mut)]">Os segredos SMTP/WhatsApp são configurados apenas no servidor.</p></div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <label className="flex items-center gap-2 rounded-lg border border-[var(--adm-line)] p-3 text-xs font-semibold text-[var(--adm-text)]"><input type="checkbox" checked={config.dryRun} onChange={(e) => setConfig((prev) => ({ ...prev, dryRun: e.target.checked }))} />Dry-run (recomendado)</label>
            <label className="text-xs font-semibold text-[var(--adm-text)]">Limite diário de e-mail<input type="number" min="1" max="30" className={`${INPUT} mt-1`} value={config.limiteDiarioEmail} onChange={(e) => setConfig((prev) => ({ ...prev, limiteDiarioEmail: Math.max(1, Number(e.target.value)) }))} /></label>
            <label className="text-xs font-semibold text-[var(--adm-text)]">Limite diário WhatsApp<input type="number" min="1" max="30" className={`${INPUT} mt-1`} value={config.limiteDiarioWhatsApp} onChange={(e) => setConfig((prev) => ({ ...prev, limiteDiarioWhatsApp: Math.max(1, Number(e.target.value)) }))} /></label>
            <label className="text-xs font-semibold text-[var(--adm-text)]">Modo WhatsApp<select className={`${INPUT} mt-1`} value={config.providerWhatsapp} onChange={(e) => setConfig((prev) => ({ ...prev, providerWhatsapp: e.target.value as ConfigProspeccao['providerWhatsapp'] }))}><option value="assistido">Assistido (padrão)</option><option value="cloud_api" disabled>Cloud API oficial (não disponível nesta etapa)</option></select></label>
            <label className="text-xs font-semibold text-[var(--adm-text)]">Janela de início<input type="time" className={`${INPUT} mt-1`} value={config.janelaInicio} onChange={(e) => setConfig((prev) => ({ ...prev, janelaInicio: e.target.value }))} /></label>
            <label className="text-xs font-semibold text-[var(--adm-text)]">Janela de fim<input type="time" className={`${INPUT} mt-1`} value={config.janelaFim} onChange={(e) => setConfig((prev) => ({ ...prev, janelaFim: e.target.value }))} /></label>
            <label className="text-xs font-semibold text-[var(--adm-text)]">Intervalo mínimo (s)<input type="number" className={`${INPUT} mt-1`} min="60" value={config.intervaloMinimoSegundos} onChange={(e) => setConfig((prev) => ({ ...prev, intervaloMinimoSegundos: Math.max(60, Number(e.target.value)) }))} /></label>
            <label className="text-xs font-semibold text-[var(--adm-text)]">Intervalo máximo (s)<input type="number" className={`${INPUT} mt-1`} min={config.intervaloMinimoSegundos} value={config.intervaloMaximoSegundos} onChange={(e) => setConfig((prev) => ({ ...prev, intervaloMaximoSegundos: Math.max(prev.intervaloMinimoSegundos, Number(e.target.value)) }))} /></label>
            <label className="text-xs font-semibold text-[var(--adm-text)] sm:col-span-2 xl:col-span-4">Assinatura padrão<textarea className={`${INPUT} mt-1 min-h-24`} value={config.assinatura} onChange={(e) => setConfig((prev) => ({ ...prev, assinatura: e.target.value }))} /></label>
          </div>
          <div className="flex flex-wrap gap-2"><button className={BUTTON} type="button" onClick={() => void salvarConfiguracao(config)}><Check className="h-4 w-4" />Salvar configurações</button><button className={SOFT_BUTTON} type="button" onClick={() => void (async () => {
            if (!firebaseUser) return;
            setEnviando(true);
            try {
              const response = await fetch('/api/prospeccao/test-email', { method: 'POST', headers: { Authorization: `Bearer ${await firebaseUser.getIdToken()}` } });
              const data = await response.json();
              if (!response.ok) throw new Error(data.error || 'Falha ao testar e-mail.');
              setSucesso(data.status === 'simulado' ? 'Teste simulado (dry-run). Desative dry-run para enviar a mensagem de teste à sua própria conta.' : 'E-mail de teste enviado à conta MASTER.');
            } catch (error) { setErro(error instanceof Error ? error.message : 'Falha no teste SMTP.'); } finally { setEnviando(false); }
          })()} disabled={enviando}><Mail className="h-3.5 w-3.5" />Testar conexão Zoho</button></div>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              ['SPF', capabilities.email?.spf],
              ['DKIM', capabilities.email?.dkim],
              ['DMARC', capabilities.email?.dmarc],
            ].map(([label, configured]: any) => <div key={label} className={`rounded-lg border px-3 py-2 text-xs ${configured ? 'border-emerald-500/30 text-emerald-600' : 'border-amber-500/30 text-amber-600'}`}>{label}: {configured ? 'registro encontrado' : 'não verificado / faltando'}</div>)}
          </div>
          {capabilities.smtp?.configurado === false && <p className="text-xs text-amber-600">Configure o SMTP do Zoho no servidor. Nenhuma credencial é armazenada no Firestore ou enviada ao navegador.</p>}
        </section>
        <section className={`${CARD} space-y-3`}>
          <div><h2 className="font-semibold text-[var(--adm-text)]">Catálogo de prospecção (CNAE + segmentos)</h2><p className="text-xs text-[var(--adm-mut)]">Os códigos vêm da API oficial de subclasses CNAE do IBGE/CONCLA e podem ser revistos ou ampliados pelo MASTER.</p></div>
          {servicos.map((service) => <details key={service.id} className="rounded-lg border border-[var(--adm-line)] p-3">
            <summary className="cursor-pointer text-sm font-semibold text-[var(--adm-text)]">{service.nome} · {service.segmentos_alvo.reduce((n, segment) => n + segment.cnaes.length, 0)} CNAE(s)</summary>
            <div className="mt-3 grid gap-3">
              <label className="text-xs font-semibold text-[var(--adm-text)]">Nome<input className={`${INPUT} mt-1`} value={service.nome} onChange={(e) => alterarCatalogoServico(service.id, 'nome', e.target.value)} /></label>
              <label className="text-xs font-semibold text-[var(--adm-text)]">Normas (separadas por vírgula)<input className={`${INPUT} mt-1`} value={service.normas.join(', ')} onChange={(e) => alterarCatalogoServico(service.id, 'normas', e.target.value)} /></label>
              <label className="text-xs font-semibold text-[var(--adm-text)]">Dor do cliente<textarea className={`${INPUT} mt-1`} value={service.dor_do_cliente} onChange={(e) => alterarCatalogoServico(service.id, 'dor_do_cliente', e.target.value)} /></label>
              <label className="text-xs font-semibold text-[var(--adm-text)]">Argumento principal<textarea className={`${INPUT} mt-1`} value={service.argumento_principal} onChange={(e) => alterarCatalogoServico(service.id, 'argumento_principal', e.target.value)} /></label>
              <label className="text-xs font-semibold text-[var(--adm-text)]">CTA<input className={`${INPUT} mt-1`} value={service.cta} onChange={(e) => alterarCatalogoServico(service.id, 'cta', e.target.value)} /></label>
              {service.segmentos_alvo.map((segment, segmentIndex) => <div key={`${service.id}-segment-${segmentIndex}`} className="space-y-2 rounded-lg border border-[var(--adm-line)] p-3">
                <label className="block text-xs font-semibold text-[var(--adm-text)]">Segmento
                  <input className={`${INPUT} mt-1`} value={segment.nome} onChange={(e) => alterarSegmentoCatalogo(service.id, segmentIndex, 'nome', e.target.value)} />
                </label>
                <label className="block text-xs font-semibold text-[var(--adm-text)]">CNAEs oficiais (um por linha: código | descrição)
                  <textarea className={`${INPUT} mt-1 min-h-24 font-mono text-[11px] font-normal`} value={segment.cnaes.map((item) => `${item.codigo} | ${item.descricao}`).join('\n')} onChange={(e) => alterarSegmentoCatalogo(service.id, segmentIndex, 'cnaes', e.target.value)} placeholder="2511000 | FABRICAÇÃO DE ESTRUTURAS METÁLICAS" />
                </label>
                <label className="block text-xs font-semibold text-[var(--adm-text)]">Palavras-chave (separadas por vírgula)
                  <textarea className={`${INPUT} mt-1 min-h-16 font-normal`} value={segment.palavras_chave.join(', ')} onChange={(e) => alterarSegmentoCatalogo(service.id, segmentIndex, 'palavras_chave', e.target.value)} />
                </label>
              </div>)}
              <button type="button" className={SOFT_BUTTON} onClick={() => setServicos((prev) => prev.map((item) => item.id === service.id ? {
                ...item,
                segmentos_alvo: [...item.segmentos_alvo, { nome: 'Novo segmento', cnaes: [], palavras_chave: [] }],
              } : item))}><Plus className="h-3.5 w-3.5" />Adicionar segmento</button>
              <button type="button" className={`${SOFT_BUTTON} text-rose-500`} onClick={() => {
                if (window.confirm(`Remover o serviço "${service.nome}" do catálogo?`)) setServicos((prev) => prev.filter((item) => item.id !== service.id));
              }}><Trash2 className="h-3.5 w-3.5" />Remover serviço</button>
            </div>
          </details>)}
          <button type="button" className={BUTTON} onClick={salvarCatalogoEditado}><Check className="h-4 w-4" />Salvar catálogo editado</button>
        </section>
        <section className={`${CARD} space-y-2`}>
          <h2 className="font-semibold text-[var(--adm-text)]">LGPD e boas práticas</h2>
          <ul className="space-y-1.5 text-xs leading-relaxed text-[var(--adm-mut)]">
            <li>• Uso restrito a contatos corporativos de pessoas jurídicas e análise de legítimo interesse; a fonte e finalidade ficam registradas.</li>
            <li>• Não importe listas compradas, endereços pessoais nem dados além do necessário. Revise o CNAE e a adequação antes de contatar.</li>
            <li>• Cada mensagem identifica a VL Engenharia, contém um único CTA e oferece descadastro. Supressões são verificadas antes do envio e guardadas como hash.</li>
            <li>• Contatos devem ser individuais e aprovados. Há uma mensagem inicial e no máximo um follow-up por campanha.</li>
            <li>• WhatsApp assistido é o padrão. Disparos automatizados por gateways não oficiais não são implementados; podem violar termos e banir a conta.</li>
            <li>• Para atender pedidos de acesso/exclusão, remova os dados do lead e preserve somente o hash necessário para não voltar a contatá-lo.</li>
          </ul>
        </section>
        <section className={`${CARD} space-y-3`}>
          <div>
            <h2 className="font-semibold text-[var(--adm-text)]">Lista de supressão</h2>
            <p className="text-xs text-[var(--adm-mut)]">{supressoes.length} bloqueio(s). Os identificadores são guardados como hash, não como e-mail ou telefone.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input className={INPUT} value={supressaoInput} onChange={(e) => setSupressaoInput(e.target.value)} placeholder="E-mail corporativo ou telefone" />
            <button type="button" className={SOFT_BUTTON} onClick={() => void adicionarSupressaoManual()}><ShieldCheck className="h-3.5 w-3.5" />Bloquear contato</button>
          </div>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {supressoes.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[var(--adm-bg)] px-3 py-2 text-xs">
              <span className="font-medium text-[var(--adm-text)]">{item.tipo} · {item.origem}</span>
              <span className="text-[var(--adm-mut)]">{item.motivo} · {new Date(item.criadoEm).toLocaleDateString('pt-BR')}</span>
            </div>)}
            {!supressoes.length && <p className="text-xs text-[var(--adm-mut)]">Nenhum contato bloqueado até agora.</p>}
          </div>
        </section>
      </section>}

      {aba === 'relatorio' && <section className={`${CARD} space-y-4`}>
        <div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="font-semibold text-[var(--adm-text)]">Relatório de envios</h2><p className="text-xs text-[var(--adm-mut)]">Registro individual, sem dados de mensagem em exportações públicas.</p></div><button className={BUTTON} type="button" onClick={gerarCsvRelatorio}><ArrowDownToLine className="h-4 w-4" />Exportar CSV</button></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-xs"><thead><tr className="border-b border-[var(--adm-line)] text-[var(--adm-mut)]"><th className="py-2 pr-3">Data</th><th className="py-2 pr-3">Empresa</th><th className="py-2 pr-3">Canal</th><th className="py-2 pr-3">Status</th><th className="py-2">Assunto/erro</th></tr></thead><tbody className="divide-y divide-[var(--adm-line)]">{[...envios].sort((a, b) => (b.criadoEm || '').localeCompare(a.criadoEm || '')).map((item) => <tr key={item.id}><td className="py-2 pr-3 text-[var(--adm-mut)]">{new Date(item.enviadoEm || item.criadoEm).toLocaleString('pt-BR')}</td><td className="py-2 pr-3 font-medium text-[var(--adm-text)]">{leads.find((lead) => lead.id === item.leadId)?.razaoSocial || 'Lead removido'}</td><td className="py-2 pr-3">{item.canal}</td><td className="py-2 pr-3">{item.status}</td><td className="py-2 text-[var(--adm-mut)]">{item.erro || item.assunto || '—'}</td></tr>)}</tbody></table>
        </div>
        {!envios.length && <p className="py-6 text-center text-sm text-[var(--adm-mut)]">Nenhum envio registrado.</p>}
      </section>}
    </div>
  );
};
