import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Bot, Building2, CheckCircle2, ClipboardList, FileText, Plus,
  Search, Send, Save, Trash2, Wind,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { enviarMensagemAssistenteProjeto } from '../../lib/projectAssistantApi';
import {
  AmbienteProjetoHvac,
  ItemChecklistProjeto,
  MensagemAssistenteProjeto,
  ProjetoEngenharia,
  StatusItemProjeto,
  StatusProjetoEngenharia,
  TipoProjetoEngenharia,
} from '../../types';

const TIPOS_PROJETO: { id: TipoProjetoEngenharia; titulo: string; curto: string }[] = [
  { id: 'hvac-r', titulo: 'Climatização e Refrigeração (HVAC-R)', curto: 'HVAC-R' },
  { id: 'ppci', titulo: 'Combate a Incêndio (PPCI)', curto: 'PPCI' },
  { id: 'mecanico', titulo: 'Projetos Mecânicos', curto: 'Mecânico' },
];

const CHECKLIST_HVAC: { id: string; titulo: string; descricao: string }[] = [
  { id: 'briefing', titulo: 'Briefing e necessidades do cliente', descricao: 'Uso dos ambientes, horários, conforto e necessidades especiais.' },
  { id: 'plantas', titulo: 'Plantas arquitetônicas', descricao: 'Plantas atualizadas com cotas, cortes e indicação dos pavimentos.' },
  { id: 'levantamento', titulo: 'Levantamento do local', descricao: 'Conferir medidas, pé-direito, fachadas, cobertura e interferências.' },
  { id: 'ocupacao', titulo: 'Dados de ocupação e equipamentos', descricao: 'Pessoas, iluminação, equipamentos e horários de funcionamento.' },
  { id: 'premissas', titulo: 'Premissas de projeto', descricao: 'Sistema, condições internas e externas e critérios a validar.' },
  { id: 'cargas', titulo: 'Cálculo de cargas térmicas', descricao: 'Etapa futura: registrar e revisar o cálculo técnico.' },
  { id: 'equipamentos', titulo: 'Seleção de equipamentos', descricao: 'Etapa futura: definir equipamentos após validar os cálculos.' },
  { id: 'desenhos', titulo: 'Desenhos e compatibilização', descricao: 'Etapa futura: preparar e revisar desenhos do projeto.' },
  { id: 'memorial', titulo: 'Memorial e revisão técnica', descricao: 'Consolidar documentos e revisar com o responsável técnico.' },
];

const checklistInicial = (): Record<string, ItemChecklistProjeto> =>
  Object.fromEntries(CHECKLIST_HVAC.map(({ id }) => [id, { status: 'pendente', observacoes: '' }]));

const ambienteVazio = (numero: number): AmbienteProjetoHvac => ({
  id: `amb-${Date.now()}-${numero}`,
  nome: `Ambiente ${numero}`,
  pavimento: '',
  areaM2: null,
  peDireitoM: null,
  ocupantes: null,
  observacoes: '',
});

const STATUS_LABEL: Record<StatusProjetoEngenharia, string> = {
  em_elaboracao: 'Em elaboração',
  em_revisao: 'Em revisão',
  concluido: 'Concluído',
};

function tituloTipo(tipo: TipoProjetoEngenharia) {
  return TIPOS_PROJETO.find((item) => item.id === tipo)?.titulo || tipo;
}

function normalizarChecklist(
  checklist?: Record<string, ItemChecklistProjeto>
): Record<string, ItemChecklistProjeto> {
  const defaults = checklistInicial();
  for (const [id, item] of Object.entries(checklist || {})) {
    if (defaults[id]) defaults[id] = { ...defaults[id], ...item };
  }
  return defaults;
}

function Campo({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  min,
  step,
}: {
  label: string;
  value: string | number | null | undefined;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  min?: string;
  step?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-[var(--muted)]">{label}</span>
      <input
        type={type}
        value={value ?? ''}
        placeholder={placeholder}
        min={min}
        step={step}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--blue)] focus:outline-none"
      />
    </label>
  );
}

export const ProjetosCentralView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    clientes,
    projetosEngenharia,
    adicionarProjetoEngenharia,
    atualizarProjetoEngenharia,
    removerProjetoEngenharia,
  } = useData();
  const projeto = useMemo(
    () => projetosEngenharia.find((item) => item.id === id),
    [projetosEngenharia, id]
  );

  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<'todos' | TipoProjetoEngenharia>('todos');
  const [modalNovo, setModalNovo] = useState(false);
  const [tipoNovo, setTipoNovo] = useState<TipoProjetoEngenharia>('hvac-r');
  const [clienteNovo, setClienteNovo] = useState('');
  const [nomeNovo, setNomeNovo] = useState('');
  const [enderecoNovo, setEnderecoNovo] = useState('');
  const [descricaoNova, setDescricaoNova] = useState('');
  const [form, setForm] = useState({
    nome: '',
    endereco: '',
    descricao: '',
    sistemaHvac: 'A definir',
    usoHvac: 'Conforto térmico',
    observacoesHvac: '',
    ambientesHvac: [] as AmbienteProjetoHvac[],
    checklistHvac: checklistInicial(),
  });
  const [mensagem, setMensagem] = useState('');
  const [mensagensChat, setMensagensChat] = useState<MensagemAssistenteProjeto[]>([]);
  const [textoChat, setTextoChat] = useState('');
  const [enviandoChat, setEnviandoChat] = useState(false);
  const [erroChat, setErroChat] = useState('');

  useEffect(() => {
    if (!projeto) return;
    const ambientesSalvos = projeto.ambientesHvac;
    const ambientesLegados = projeto.payloadHvac?.rooms?.map((room: any, index: number) => ({
      id: String(room.id || `amb-legado-${index + 1}`),
      nome: String(room.name || `Ambiente ${index + 1}`),
      pavimento: String(room.level ?? ''),
      areaM2: Number.isFinite(Number(room.w) * Number(room.l))
        ? Number((Number(room.w) * Number(room.l)).toFixed(2))
        : null,
      peDireitoM: Number.isFinite(Number(room.height_m)) ? Number(room.height_m) : null,
      ocupantes: Number.isFinite(Number(room.occupants)) ? Number(room.occupants) : null,
      observacoes: '',
    })) || [];

    setForm({
      nome: projeto.nome,
      endereco: projeto.endereco,
      descricao: projeto.descricao,
      sistemaHvac: projeto.sistemaHvac || 'A definir',
      usoHvac: projeto.usoHvac || 'Conforto térmico',
      observacoesHvac: projeto.observacoesHvac || '',
      ambientesHvac: ambientesSalvos || ambientesLegados,
      checklistHvac: normalizarChecklist(projeto.checklistHvac),
    });
    setMensagensChat(projeto.mensagensAssistente || []);
    setTextoChat('');
    setErroChat('');
    setMensagem('');
  }, [projeto?.id]);

  const projetosFiltrados = useMemo(
    () => projetosEngenharia
      .filter((item) => filtro === 'todos' || item.tipo === filtro)
      .filter((item) =>
        `${item.codigo} ${item.nome} ${item.clienteNome} ${item.endereco}`
          .toLocaleLowerCase('pt-BR')
          .includes(busca.toLocaleLowerCase('pt-BR'))
      ),
    [projetosEngenharia, filtro, busca]
  );

  const salvarProjeto = () => {
    if (!projeto) return;
    atualizarProjetoEngenharia(projeto.id, {
      nome: form.nome.trim() || projeto.nome,
      endereco: form.endereco.trim(),
      descricao: form.descricao.trim(),
      sistemaHvac: form.sistemaHvac,
      usoHvac: form.usoHvac,
      observacoesHvac: form.observacoesHvac,
      ambientesHvac: form.ambientesHvac,
      checklistHvac: form.checklistHvac,
    });
    setMensagem('Ficha salva.');
    window.setTimeout(() => setMensagem(''), 2500);
  };

  const criarProjeto = () => {
    const cliente = clientes.find((item) => item.id === clienteNovo);
    if (!cliente || !nomeNovo.trim()) return;
    const enderecoCliente = [cliente.endereco?.cidade, cliente.endereco?.estado]
      .filter(Boolean)
      .join('/');
    const novoId = adicionarProjetoEngenharia({
      tipo: tipoNovo,
      nome: nomeNovo.trim(),
      clienteId: cliente.id,
      clienteNome: cliente.razaoSocial || cliente.nomeFantasia || 'Cliente',
      endereco: enderecoNovo.trim() || enderecoCliente,
      descricao: descricaoNova.trim(),
      status: 'em_elaboracao',
      criadoPorUid: currentUser?.uid || '',
      ...(tipoNovo === 'hvac-r'
        ? {
            sistemaHvac: 'A definir',
            usoHvac: 'Conforto térmico',
            observacoesHvac: '',
            ambientesHvac: [],
            checklistHvac: checklistInicial(),
          }
        : {}),
    });
    setModalNovo(false);
    navigate(`/admin/projetos/${novoId}`);
  };

  const atualizarAmbiente = (ambienteId: string, dados: Partial<AmbienteProjetoHvac>) => {
    setForm((atual) => ({
      ...atual,
      ambientesHvac: atual.ambientesHvac.map((ambiente) =>
        ambiente.id === ambienteId ? { ...ambiente, ...dados } : ambiente
      ),
    }));
  };

  const atualizarChecklist = (
    itemId: string,
    dados: Partial<ItemChecklistProjeto>
  ) => {
    setForm((atual) => ({
      ...atual,
      checklistHvac: {
        ...atual.checklistHvac,
        [itemId]: { ...atual.checklistHvac[itemId], ...dados },
      },
    }));
  };

  const enviarParaAssistente = async (texto: string) => {
    if (!projeto || !texto.trim() || enviandoChat) return;
    const pergunta: MensagemAssistenteProjeto = {
      role: 'user',
      texto: texto.trim(),
      criadaEm: new Date().toISOString(),
    };
    const historico = [...mensagensChat, pergunta].slice(-24);
    const projectContext = {
      codigo: projeto.codigo,
      tipo: projeto.tipo,
      nome: form.nome,
      cliente: projeto.clienteNome,
      endereco: form.endereco,
      escopo: form.descricao,
      usoHvac: projeto.tipo === 'hvac-r' ? form.usoHvac : undefined,
      sistemaHvac: projeto.tipo === 'hvac-r' ? form.sistemaHvac : undefined,
      observacoesHvac: projeto.tipo === 'hvac-r' ? form.observacoesHvac : undefined,
      ambientesHvac: projeto.tipo === 'hvac-r' ? form.ambientesHvac : undefined,
      checklistHvac: projeto.tipo === 'hvac-r' ? form.checklistHvac : undefined,
    };

    setMensagensChat(historico);
    setTextoChat('');
    setErroChat('');
    setEnviandoChat(true);
    try {
      const resposta = await enviarMensagemAssistenteProjeto(
        historico.map(({ role, texto: text }) => ({ role, text })),
        projectContext
      );
      const conversaAtualizada = [
        ...historico,
        { role: 'model' as const, texto: resposta, criadaEm: new Date().toISOString() },
      ].slice(-24);
      setMensagensChat(conversaAtualizada);
      atualizarProjetoEngenharia(projeto.id, {
        nome: form.nome.trim() || projeto.nome,
        endereco: form.endereco.trim(),
        descricao: form.descricao.trim(),
        sistemaHvac: form.sistemaHvac,
        usoHvac: form.usoHvac,
        observacoesHvac: form.observacoesHvac,
        ambientesHvac: form.ambientesHvac,
        checklistHvac: form.checklistHvac,
        mensagensAssistente: conversaAtualizada,
      });
    } catch (error: any) {
      setErroChat(error.message || 'Não foi possível consultar o assistente.');
    } finally {
      setEnviandoChat(false);
    }
  };

  if (id && !projeto) {
    return (
      <div className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-8 text-sm">
        Projeto não encontrado ou ainda sincronizando.
      </div>
    );
  }

  if (projeto) {
    const checklist = normalizarChecklist(form.checklistHvac);
    const concluidos = CHECKLIST_HVAC.filter(
      ({ id: itemId }) => checklist[itemId]?.status === 'concluido'
    ).length;

    return (
      <div className="mx-auto max-w-[1100px] space-y-5">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/projetos"
              className="rounded-lg border border-[var(--line)] p-2 text-[var(--ink)] hover:bg-[var(--card)]"
              aria-label="Voltar aos projetos"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--blue)]">
                {projeto.codigo} · {tituloTipo(projeto.tipo)}
              </p>
              <h1 className="text-2xl font-extrabold text-[var(--ink)]">{form.nome || projeto.nome}</h1>
              <p className="text-sm text-[var(--muted)]">
                {projeto.clienteNome} · {form.endereco || 'Local da obra não informado'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={salvarProjeto}
            className="btn-tech pri inline-flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Salvar ficha
          </button>
        </header>

        {mensagem && (
          <p role="status" className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800">
            {mensagem}
          </p>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-4">
            <p className="text-xs text-[var(--muted)]">Etapa do projeto</p>
            <select
              value={projeto.status}
              onChange={(event) =>
                atualizarProjetoEngenharia(projeto.id, {
                  status: event.target.value as StatusProjetoEngenharia,
                })
              }
              className="mt-2 w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm"
            >
              {Object.entries(STATUS_LABEL).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-4">
            <p className="text-xs text-[var(--muted)]">Ambientes cadastrados</p>
            <p className="mt-1 text-2xl font-bold">{form.ambientesHvac.length}</p>
          </div>
          {projeto.tipo === 'hvac-r' && (
            <div className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-4">
              <p className="text-xs text-[var(--muted)]">Checklist concluído</p>
              <p className="mt-1 text-2xl font-bold">{concluidos}/{CHECKLIST_HVAC.length}</p>
            </div>
          )}
        </section>

        <section className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-[var(--blue)]" />
            <h2 className="text-lg font-bold">Ficha do projeto</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Campo
              label="Nome do projeto"
              value={form.nome}
              onChange={(value) => setForm((atual) => ({ ...atual, nome: value }))}
            />
            <Campo
              label="Local da obra"
              value={form.endereco}
              placeholder="Endereço, cidade e estado"
              onChange={(value) => setForm((atual) => ({ ...atual, endereco: value }))}
            />
            <div className="md:col-span-2">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-[var(--muted)]">Escopo / necessidade do cliente</span>
                <textarea
                  rows={3}
                  value={form.descricao}
                  onChange={(event) => setForm((atual) => ({ ...atual, descricao: event.target.value }))}
                  placeholder="O que o cliente precisa? Quais áreas e sistemas estão incluídos?"
                  className="w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--ink)]"
                />
              </label>
            </div>
          </div>
        </section>

        {projeto.tipo === 'hvac-r' && (
          <>
            <section className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5">
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-[var(--blue)]" />
                <h2 className="text-lg font-bold">Informações iniciais HVAC-R</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-[var(--muted)]">Uso principal</span>
                  <select
                    value={form.usoHvac}
                    onChange={(event) => setForm((atual) => ({ ...atual, usoHvac: event.target.value }))}
                    className="w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm"
                  >
                    {['Conforto térmico', 'Refrigeração comercial', 'Câmara fria', 'Processo industrial', 'Outro / a definir'].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-[var(--muted)]">Sistema pretendido</span>
                  <select
                    value={form.sistemaHvac}
                    onChange={(event) => setForm((atual) => ({ ...atual, sistemaHvac: event.target.value }))}
                    className="w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm"
                  >
                    {['A definir', 'Split', 'Multi-split', 'VRF', 'Sistema dutado / fan-coil', 'Refrigeração', 'Outro'].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <div className="md:col-span-2">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-[var(--muted)]">Observações e premissas a confirmar</span>
                    <textarea
                      rows={3}
                      value={form.observacoesHvac}
                      onChange={(event) => setForm((atual) => ({ ...atual, observacoesHvac: event.target.value }))}
                      placeholder="Ex.: horários de funcionamento, restrições de instalação, temperatura desejada..."
                      className="w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--ink)]"
                    />
                  </label>
                </div>
              </div>
            </section>

            <section className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[var(--blue)]" />
                    <h2 className="text-lg font-bold">Ambientes</h2>
                  </div>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Cadastre o levantamento inicial. Esta ficha não calcula carga térmica.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm((atual) => ({
                    ...atual,
                    ambientesHvac: [...atual.ambientesHvac, ambienteVazio(atual.ambientesHvac.length + 1)],
                  }))}
                  className="btn-tech inline-flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar ambiente
                </button>
              </div>

              {form.ambientesHvac.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[var(--line)] p-7 text-center">
                  <p className="text-sm font-semibold">Nenhum ambiente cadastrado</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">Adicione os ambientes para organizar o levantamento do projeto.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {form.ambientesHvac.map((ambiente, index) => (
                    <article key={ambiente.id} className="space-y-3 rounded-xl border border-[var(--line)] p-4">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-bold">Ambiente {index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => setForm((atual) => ({
                            ...atual,
                            ambientesHvac: atual.ambientesHvac.filter((item) => item.id !== ambiente.id),
                          }))}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remover
                        </button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <Campo
                          label="Nome"
                          value={ambiente.nome}
                          onChange={(value) => atualizarAmbiente(ambiente.id, { nome: value })}
                        />
                        <Campo
                          label="Pavimento / setor"
                          value={ambiente.pavimento}
                          onChange={(value) => atualizarAmbiente(ambiente.id, { pavimento: value })}
                        />
                        <Campo
                          label="Área aproximada (m²)"
                          type="number"
                          min="0"
                          step="0.1"
                          value={ambiente.areaM2}
                          onChange={(value) => atualizarAmbiente(ambiente.id, { areaM2: value === '' ? null : Number(value) })}
                        />
                        <Campo
                          label="Pé-direito (m)"
                          type="number"
                          min="0"
                          step="0.1"
                          value={ambiente.peDireitoM}
                          onChange={(value) => atualizarAmbiente(ambiente.id, { peDireitoM: value === '' ? null : Number(value) })}
                        />
                        <Campo
                          label="Ocupantes habituais"
                          type="number"
                          min="0"
                          step="1"
                          value={ambiente.ocupantes}
                          onChange={(value) => atualizarAmbiente(ambiente.id, { ocupantes: value === '' ? null : Number(value) })}
                        />
                        <label className="block space-y-1.5 sm:col-span-2 lg:col-span-3">
                          <span className="text-xs font-semibold text-[var(--muted)]">Observações</span>
                          <input
                            value={ambiente.observacoes}
                            onChange={(event) => atualizarAmbiente(ambiente.id, { observacoes: event.target.value })}
                            placeholder="Equipamentos, insolação, restrições ou outros dados"
                            className="w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm"
                          />
                        </label>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-[var(--blue)]" />
                <div>
                  <h2 className="text-lg font-bold">Checklist do projeto</h2>
                  <p className="text-xs text-[var(--muted)]">Marque o andamento e registre o que falta em cada etapa.</p>
                </div>
              </div>
              <div className="space-y-3">
                {CHECKLIST_HVAC.map((item) => (
                  <article key={item.id} className="grid gap-3 rounded-xl border border-[var(--line)] p-4 md:grid-cols-[1fr_180px]">
                    <div>
                      <div className="flex items-center gap-2">
                        {checklist[item.id]?.status === 'concluido'
                          ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                          : <span className="h-4 w-4 shrink-0 rounded-full border border-[var(--line)]" />}
                        <h3 className="text-sm font-semibold">{item.titulo}</h3>
                      </div>
                      <p className="ml-6 mt-1 text-xs text-[var(--muted)]">{item.descricao}</p>
                    </div>
                    <select
                      aria-label={`Status: ${item.titulo}`}
                      value={checklist[item.id]?.status || 'pendente'}
                      onChange={(event) => atualizarChecklist(item.id, { status: event.target.value as StatusItemProjeto })}
                      className="rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm"
                    >
                      <option value="pendente">Pendente</option>
                      <option value="em_andamento">Em andamento</option>
                      <option value="concluido">Concluído</option>
                    </select>
                    <input
                      value={checklist[item.id]?.observacoes || ''}
                      onChange={(event) => atualizarChecklist(item.id, { observacoes: event.target.value })}
                      placeholder="Observação ou documento pendente"
                      className="rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm md:col-span-2"
                    />
                  </article>
                ))}
              </div>
            </section>
          </>
        )}

        {projeto.tipo !== 'hvac-r' && (
          <section className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5">
            <h2 className="text-lg font-bold">Escopo e acompanhamento</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Esta primeira etapa está priorizando o fluxo HVAC-R. Os demais tipos podem ser cadastrados e acompanhados; seus assistentes específicos serão construídos depois.
            </p>
            <textarea
              rows={5}
              value={form.descricao}
              onChange={(event) => setForm((atual) => ({ ...atual, descricao: event.target.value }))}
              className="mt-4 w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm"
              placeholder="Descreva o escopo e as pendências deste projeto"
            />
          </section>
        )}

        <section className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-[var(--paper)] p-2 text-[var(--blue)]">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Assistente técnico do projeto</h2>
              <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                Conduz o trabalho por seis fases, registra premissas pendentes e aguarda sua validação antes de avançar.
                As respostas são apoio técnico e exigem revisão do responsável técnico.
              </p>
            </div>
          </div>

          {mensagensChat.length === 0 && (
            <div className="rounded-xl border border-dashed border-[var(--line)] p-4">
              <p className="text-sm font-semibold">Começar pela Fase 1 — Triagem</p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                O assistente vai montar uma tabela com o que já sabemos e perguntar apenas os dados que faltam.
              </p>
              <button
                type="button"
                disabled={enviandoChat}
                onClick={() => void enviarParaAssistente('Vamos iniciar este projeto pela Fase 1. Apresente a tabela de premissas com os dados já cadastrados e liste somente o que ainda preciso informar.')}
                className="btn-tech pri mt-3 inline-flex items-center gap-2 disabled:opacity-50"
              >
                <Bot className="h-4 w-4" />
                {enviandoChat ? 'Iniciando...' : 'Iniciar assistente'}
              </button>
            </div>
          )}

          {mensagensChat.length > 0 && (
            <div className="max-h-[520px] space-y-3 overflow-y-auto rounded-xl border border-[var(--line)] bg-[var(--paper)] p-3">
              {mensagensChat.map((item, index) => (
                <article
                  key={`${item.criadaEm}-${index}`}
                  className={`rounded-lg p-3 ${
                    item.role === 'user'
                      ? 'ml-6 bg-blue-100 text-slate-900'
                      : 'mr-6 border border-[var(--line)] bg-[var(--card)] text-[var(--ink)]'
                  }`}
                >
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wide opacity-70">
                    {item.role === 'user' ? 'Engenheiro' : 'Assistente VL Engenharia'}
                  </p>
                  <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">{item.texto}</div>
                </article>
              ))}
              {enviandoChat && (
                <p className="mr-6 rounded-lg border border-[var(--line)] bg-[var(--card)] p-3 text-xs text-[var(--muted)]">
                  Preparando resposta técnica...
                </p>
              )}
            </div>
          )}

          {erroChat && (
            <p role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">
              {erroChat}
            </p>
          )}

          <form
            className="flex flex-col gap-2 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              void enviarParaAssistente(textoChat);
            }}
          >
            <textarea
              rows={2}
              maxLength={6000}
              value={textoChat}
              onChange={(event) => setTextoChat(event.target.value)}
              placeholder="Responda às pendências da fase atual ou envie novos dados do projeto..."
              className="min-h-[72px] flex-1 resize-y rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={!textoChat.trim() || enviandoChat}
              className="btn-tech pri inline-flex items-center justify-center gap-2 self-end disabled:cursor-not-allowed disabled:opacity-50 sm:h-[72px]"
            >
              <Send className="h-4 w-4" />
              Enviar
            </button>
          </form>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
          <span className="text-xs text-[var(--muted)]">
            Criado em {new Date(projeto.criadoEm).toLocaleDateString('pt-BR')} · atualizado em {new Date(projeto.atualizadoEm).toLocaleString('pt-BR')}
          </span>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Excluir o projeto "${projeto.nome}"?`)) {
                removerProjetoEngenharia(projeto.id);
                navigate('/admin/projetos');
              }
            }}
            className="inline-flex items-center gap-2 text-xs font-semibold text-red-600"
          >
            <Trash2 className="h-4 w-4" />
            Excluir projeto
          </button>
        </footer>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">VL Engenharia</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl">Central de Laudos e Projetos</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Cadastre projetos e organize as informações e pendências de cada trabalho.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/laudos" className="btn-tech inline-flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Laudos
          </Link>
          <button
            type="button"
            onClick={() => {
              setTipoNovo('hvac-r');
              setClienteNovo(clientes[0]?.id || '');
              setNomeNovo('');
              setEnderecoNovo('');
              setDescricaoNova('');
              setModalNovo(true);
            }}
            className="btn-tech pri inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo projeto
          </button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        {TIPOS_PROJETO.map((tipo) => (
          <button
            key={tipo.id}
            type="button"
            onClick={() => {
              setTipoNovo(tipo.id);
              setClienteNovo(clientes[0]?.id || '');
              setNomeNovo('');
              setEnderecoNovo('');
              setDescricaoNova('');
              setModalNovo(true);
            }}
            className={`rounded-xl border p-4 text-left transition hover:border-[var(--blue)] ${
              tipo.id === 'hvac-r' ? 'border-sky-300 bg-sky-50/70' : 'border-[var(--line)] bg-[var(--card)]'
            }`}
          >
            <span className="flex items-center gap-2 font-bold text-[var(--ink)]">
              {tipo.id === 'hvac-r' ? <Wind className="h-4 w-4 text-sky-700" /> : <FileText className="h-4 w-4 text-[var(--blue)]" />}
              {tipo.curto}
            </span>
            <span className="mt-1 block text-xs text-[var(--muted)]">{tipo.titulo}</span>
          </button>
        ))}
      </section>

      <section aria-label="Filtrar projetos" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--card)] p-1">
          {[
            { id: 'todos' as const, label: 'Todos' },
            ...TIPOS_PROJETO.map((tipo) => ({ id: tipo.id, label: tipo.curto })),
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFiltro(item.id)}
              aria-pressed={filtro === item.id}
              className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold ${
                filtro === item.id ? 'bg-[var(--ink)] text-[var(--card)]' : 'text-[var(--muted)] hover:bg-[var(--paper)]'
              }`}
            >
              {item.label}
              <span className="ml-1.5 opacity-70">
                {item.id === 'todos'
                  ? projetosEngenharia.length
                  : projetosEngenharia.filter((itemProjeto) => itemProjeto.tipo === item.id).length}
              </span>
            </button>
          ))}
        </div>
        <label className="flex min-w-0 items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 sm:w-72">
          <Search className="h-4 w-4 shrink-0 text-[var(--muted)]" />
          <input
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar projeto ou cliente"
            className="w-full bg-transparent py-2 text-sm outline-none"
          />
        </label>
      </section>

      <section aria-label="Lista de projetos" className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--card)]">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3">
          <h2 className="text-sm font-semibold">Projetos cadastrados</h2>
          <span className="text-xs text-[var(--muted)]">{projetosFiltrados.length} encontrados</span>
        </div>
        {projetosFiltrados.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <ClipboardList className="mx-auto mb-3 h-8 w-8 text-[var(--muted)]" />
            <p className="text-sm font-semibold">Nenhum projeto encontrado</p>
            <p className="mt-1 text-xs text-[var(--muted)]">Crie um projeto para começar a organizar a ficha e as etapas.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--line)]">
            {projetosFiltrados.map((item) => (
              <article key={item.id} className="flex flex-col gap-3 px-4 py-4 hover:bg-[var(--paper)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                    <span className="font-semibold text-[var(--blue)]">{item.codigo}</span>
                    <span className="text-[var(--muted)]">·</span>
                    <span className="text-[var(--muted)]">{STATUS_LABEL[item.status]}</span>
                    <span className="rounded bg-[var(--paper)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--muted)]">{item.tipo.toUpperCase()}</span>
                  </div>
                  <h3 className="mt-1 truncate text-sm font-semibold">{item.nome}</h3>
                  <p className="mt-0.5 truncate text-xs text-[var(--muted)]">{item.clienteNome}{item.endereco && ` · ${item.endereco}`}</p>
                </div>
                <Link to={`/admin/projetos/${item.id}`} className="btn-tech pri shrink-0 text-center">
                  Abrir ficha
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      {modalNovo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl space-y-4 rounded-2xl bg-[var(--paper)] p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Novo projeto</h2>
                <p className="text-xs text-[var(--muted)]">Comece com os dados básicos; você completa a ficha depois.</p>
              </div>
              <button type="button" onClick={() => setModalNovo(false)} className="rounded-lg px-2 py-1 text-xl" aria-label="Fechar">×</button>
            </div>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold">Tipo de projeto</span>
              <select
                value={tipoNovo}
                onChange={(event) => setTipoNovo(event.target.value as TipoProjetoEngenharia)}
                className="w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm"
              >
                {TIPOS_PROJETO.map((tipo) => <option key={tipo.id} value={tipo.id}>{tipo.titulo}</option>)}
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold">Cliente *</span>
              <select
                value={clienteNovo}
                onChange={(event) => setClienteNovo(event.target.value)}
                className="w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm"
              >
                <option value="">Selecione um cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>{cliente.razaoSocial || cliente.nomeFantasia}</option>
                ))}
              </select>
            </label>
            <Campo
              label="Nome do projeto *"
              value={nomeNovo}
              placeholder="Ex.: Climatização da unidade Recife"
              onChange={setNomeNovo}
            />
            <Campo
              label="Local da obra"
              value={enderecoNovo}
              placeholder="Endereço ou local de execução"
              onChange={setEnderecoNovo}
            />
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold">Escopo inicial</span>
              <textarea
                rows={3}
                value={descricaoNova}
                onChange={(event) => setDescricaoNova(event.target.value)}
                placeholder="Descreva brevemente o que o cliente precisa"
                className="w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm"
              />
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setModalNovo(false)} className="btn-tech">Cancelar</button>
              <button
                type="button"
                disabled={!clienteNovo || !nomeNovo.trim()}
                onClick={criarProjeto}
                className="btn-tech pri disabled:cursor-not-allowed disabled:opacity-50"
              >
                Criar ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
