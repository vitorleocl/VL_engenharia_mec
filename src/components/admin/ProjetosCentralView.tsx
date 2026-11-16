import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Building2, Download, FileArchive, FileText, Loader2, Plus,
  RefreshCw, Save, Settings2, Snowflake, Trash2, Upload, Wind,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  baixarArquivoHvac, calcularProjetoHvac, carregarCidadesHvac, gerarPacoteHvac,
  gerarAnaliseHvac, importarAmbientesDxf, type HvacFileName,
} from '../../lib/hvacApi';
import { ProjetoEngenharia, TipoProjetoEngenharia } from '../../types';
import { DADOS_VL_PADRAO } from '../../lib/orcamentoTemplatePadrao';

const TIPOS_PROJETO: { id: TipoProjetoEngenharia; titulo: string; descricao: string }[] = [
  { id: 'hvac-r', titulo: 'Projetos de Climatização e Refrigeração (HVAC-R)', descricao: 'Carga térmica, equipamentos, dutos, planta DXF, modelo IFC e memorial.' },
  { id: 'ppci', titulo: 'Projetos de Combate a Incêndio (PPCI)', descricao: 'Cadastro e acompanhamento de projetos de segurança contra incêndio.' },
  { id: 'mecanico', titulo: 'Projetos Mecânicos', descricao: 'Cadastro e acompanhamento de projetos mecânicos 2D/3D e memoriais.' },
];

const roomDefault = (id = 'R1') => ({
  id, name: '', use: 'escritorio', level: 0, x: 0, y: 0, w: 5, l: 4,
  height_m: 2.7, occupants: 2, lighting_w_m2: 10, equipment_w: 0,
  roof_exposed: false, roof_u: 2, facades: [], dxf_is_rectangle: true,
});

const payloadDefault = () => ({
  name: '', client: '', address: '',
  climate: { city: 'paulista', tbs: undefined as number | undefined, tbu: undefined as number | undefined, altitude_m: undefined as number | undefined },
  setpoint_c: 24, rh_pct: 50, system: 'split',
  rooms: [roomDefault()],
  ahu: { x: 0, y: 0 }, floor_height_m: 3.2,
  responsible: { name: '', crea: '', art: '' },
  options: { safety_factor: 1.1, supply_delta_t: 10, friction_pa_m: 1, max_duct_height_m: 0.3, max_velocity_ms: 6, diffuser_max_m3h: 350, diversity_ahu: 0.9, scale: 50 },
});

function removerIndefinidos(value: any): any {
  if (Array.isArray(value)) return value.map(removerIndefinidos);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, removerIndefinidos(item)])
    );
  }
  return value;
}

function tipoProjetoLabel(tipo: TipoProjetoEngenharia) {
  return TIPOS_PROJETO.find((item) => item.id === tipo)?.titulo || tipo;
}

function InputField({ label, value, onChange, type = 'text', step, min, required, placeholder }: {
  label: string; value: string | number | undefined; onChange: (value: string) => void;
  type?: string; step?: string | number; min?: string | number; required?: boolean; placeholder?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-[var(--muted)]">{label}{required ? ' *' : ''}</span>
      <input
        type={type} value={value ?? ''} step={step} min={min} required={required} placeholder={placeholder}
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
    clientes, projetosEngenharia, adicionarProjetoEngenharia,
    atualizarProjetoEngenharia, removerProjetoEngenharia,
  } = useData();
  const projeto = useMemo(() => projetosEngenharia.find((item) => item.id === id), [projetosEngenharia, id]);
  const [modalNovo, setModalNovo] = useState(false);
  const [tipoNovo, setTipoNovo] = useState<TipoProjetoEngenharia>('hvac-r');
  const [clienteNovo, setClienteNovo] = useState('');
  const [nomeNovo, setNomeNovo] = useState('');
  const [enderecoNovo, setEnderecoNovo] = useState('');
  const [descricaoNova, setDescricaoNova] = useState('');
  const [filtro, setFiltro] = useState<'todos' | TipoProjetoEngenharia>('todos');
  const [payload, setPayload] = useState<any>(() => payloadDefault());
  const [cidades, setCidades] = useState<Record<string, { tbs: number; tbu: number; altitude_m: number }>>({});
  const [erro, setErro] = useState('');
  const [avisoCidade, setAvisoCidade] = useState('');
  const [carregando, setCarregando] = useState<'calcular' | 'gerar' | 'dxf' | 'analise' | ''>('');
  const [sucesso, setSucesso] = useState('');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    if (!id || !projeto || projeto.tipo !== 'hvac-r') return;
    setPayload({
      ...payloadDefault(),
      ...(projeto.payloadHvac || {}),
      responsible: {
        ...payloadDefault().responsible,
        ...(projeto.payloadHvac?.responsible || {}),
        name: currentUser?.nome || DADOS_VL_PADRAO.responsavelTecnico,
        crea: currentUser?.crea || DADOS_VL_PADRAO.crea,
      },
      rooms: projeto.payloadHvac?.rooms?.length ? projeto.payloadHvac.rooms : [roomDefault()],
    });
  }, [id, projeto?.id]);

  useEffect(() => {
    if (!id || projeto?.tipo !== 'hvac-r') return;
    carregarCidadesHvac()
      .then((response) => {
        setCidades(response.cidades || {});
        setAvisoCidade(response.aviso || '');
      })
      .catch((error) => setErro(error.message));
  }, [id, projeto?.tipo]);

  const projetosFiltrados = useMemo(() => projetosEngenharia
    .filter((item) => filtro === 'todos' || item.tipo === filtro)
    .filter((item) => `${item.codigo} ${item.nome} ${item.clienteNome} ${item.endereco}`.toLowerCase().includes(busca.toLowerCase())),
  [projetosEngenharia, filtro, busca]);

  const persistirProjeto = (extra: Partial<ProjetoEngenharia> = {}) => {
    if (!projeto) return;
    const cliente = clientes.find((item) => item.id === projeto.clienteId);
    atualizarProjetoEngenharia(projeto.id, {
      nome: payload.name || projeto.nome,
      clienteNome: cliente?.razaoSocial || cliente?.nomeFantasia || projeto.clienteNome,
      endereco: payload.address || projeto.endereco,
      payloadHvac: removerIndefinidos(payload),
      ...extra,
    });
    setSucesso('Projeto salvo.');
    setTimeout(() => setSucesso(''), 2500);
  };

  const atualizarPayload = (fn: (current: any) => any) => setPayload((current: any) => fn(current));
  const atualizarAmbiente = (index: number, patch: Record<string, any>) => atualizarPayload((current) => ({
    ...current, rooms: current.rooms.map((room: any, i: number) => i === index ? { ...room, ...patch } : room),
  }));
  const atualizarFachada = (roomIndex: number, facadeIndex: number, patch: Record<string, any>) => atualizarPayload((current) => ({
    ...current,
    rooms: current.rooms.map((room: any, ri: number) => ri === roomIndex ? {
      ...room, facades: room.facades.map((facade: any, fi: number) => fi === facadeIndex ? { ...facade, ...patch } : facade),
    } : room),
  }));

  const montarPayloadApi = () => removerIndefinidos({
    ...payload,
    name: payload.name || projeto?.nome || '',
    client: clientes.find((item) => item.id === projeto?.clienteId)?.razaoSocial || projeto?.clienteNome || '',
    address: payload.address || projeto?.endereco || '',
    responsible: {
      name: currentUser?.nome || DADOS_VL_PADRAO.responsavelTecnico,
      crea: currentUser?.crea || DADOS_VL_PADRAO.crea,
      art: payload.responsible?.art || '',
    },
    analysis_markdown: projeto?.analiseHvac || payload.analysis_markdown || '',
    rooms: payload.rooms.map(({ dxf_is_rectangle: _rect, area_real_m2: _area, ...room }: any) => room),
    ...(payload.system !== 'dutado' ? { ahu: undefined } : {}),
  });

  const executarCalculo = async () => {
    if (!projeto) return;
    setErro(''); setSucesso(''); setCarregando('calcular');
    const apiPayload = montarPayloadApi();
    try {
      const result = await calcularProjetoHvac(apiPayload);
      atualizarProjetoEngenharia(projeto.id, { payloadHvac: apiPayload, resultadoHvac: result });
      setPayload(apiPayload);
      setSucesso('Cálculo concluído. Revise os resultados e avisos antes de emitir.');
    } catch (error: any) {
      setErro(error.message || 'Falha ao calcular o pré-dimensionamento.');
    } finally {
      setCarregando('');
    }
  };

  const executarGeracao = async () => {
    if (!projeto) return;
    setErro(''); setSucesso(''); setCarregando('gerar');
    const apiPayload = montarPayloadApi();
    try {
      const generated = await gerarPacoteHvac(apiPayload);
      atualizarProjetoEngenharia(projeto.id, {
        payloadHvac: apiPayload,
        resultadoHvac: generated.result,
        jobHvacId: generated.job_id,
        jobHvacGeradoEm: new Date().toISOString(),
        status: 'em_revisao',
      });
      setPayload(apiPayload);
      setSucesso('Pacote gerado. Os arquivos ficam disponíveis por até 24 horas; os dados de entrada foram salvos para gerar novamente.');
    } catch (error: any) {
      setErro(error.message || 'Falha ao gerar os arquivos do projeto.');
    } finally {
      setCarregando('');
    }
  };

  const executarAnalise = async () => {
    if (!projeto?.resultadoHvac) return;
    setErro(''); setSucesso(''); setCarregando('analise');
    try {
      const response = await gerarAnaliseHvac(projeto.resultadoHvac);
      const payloadComAnalise = removerIndefinidos({ ...payload, analysis_markdown: response.analysis });
      setPayload(payloadComAnalise);
      atualizarProjetoEngenharia(projeto.id, { analiseHvac: response.analysis, payloadHvac: payloadComAnalise });
      setSucesso('Análise do projetista gerada. Revise o texto e gere o pacote novamente para incluí-la no memorial.');
    } catch (error: any) {
      setErro(error.message || 'Não foi possível gerar a análise técnica.');
    } finally {
      setCarregando('');
    }
  };

  const baixar = async (fileName: HvacFileName | 'pacote_hvac.zip') => {
    if (!projeto?.jobHvacId) return;
    setErro('');
    try {
      await baixarArquivoHvac(projeto.jobHvacId, fileName);
    } catch (error: any) {
      setErro(error.message || 'Arquivo indisponível. Gere novamente o pacote.');
    }
  };

  const importarDxf = async (file?: File) => {
    if (!file) return;
    setErro(''); setCarregando('dxf');
    const form = document.getElementById('hvac-dxf-form') as HTMLFormElement | null;
    const layer = String(new FormData(form || undefined).get('dxf-layer') || 'AMBIENTES');
    const unitToM = Number(new FormData(form || undefined).get('dxf-unit')) || 0.001;
    try {
      const result = await importarAmbientesDxf(file, layer, unitToM);
      const imported = (result.rooms || []).map((room: any, index: number) => ({
        ...roomDefault(room.id || `A${String(index + 1).padStart(2, '0')}`),
        ...room,
        use: 'escritorio',
        height_m: 2.7,
        facades: [],
        dxf_is_rectangle: room.is_rectangle !== false,
        area_real_m2: room.area_real_m2,
      }));
      if (!imported.length) throw new Error('Nenhum ambiente fechado foi encontrado nessa camada DXF.');
      atualizarPayload((current) => ({ ...current, rooms: imported }));
      setSucesso(result.note || `${imported.length} ambiente(s) importado(s).`);
    } catch (error: any) {
      setErro(error.message || 'Não foi possível importar os ambientes do DXF.');
    } finally {
      setCarregando('');
    }
  };

  const criarProjeto = () => {
    const cliente = clientes.find((item) => item.id === clienteNovo);
    if (!cliente || !nomeNovo.trim()) return;
    const idProjeto = adicionarProjetoEngenharia({
      tipo: tipoNovo,
      nome: nomeNovo.trim(),
      clienteId: cliente.id,
      clienteNome: cliente.razaoSocial || cliente.nomeFantasia || 'Cliente',
      endereco: enderecoNovo.trim() || `${cliente.endereco?.cidade || ''}/${cliente.endereco?.estado || ''}`.replace(/^\/|\/$/g, ''),
      descricao: descricaoNova.trim(),
      status: 'em_elaboracao',
      criadoPorUid: currentUser?.uid || '',
      ...(tipoNovo === 'hvac-r' ? { payloadHvac: removerIndefinidos({ ...payloadDefault(), name: nomeNovo.trim(), client: cliente.razaoSocial || cliente.nomeFantasia, address: enderecoNovo.trim() }) } : {}),
    });
    setModalNovo(false);
    navigate(`/admin/projetos/${idProjeto}`);
  };

  if (id && !projeto) {
    return <div className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-8 text-sm">Projeto não encontrado ou ainda sincronizando.</div>;
  }

  if (projeto) {
    const result = projeto.resultadoHvac;
    const isHvac = projeto.tipo === 'hvac-r';
    return (
      <div className="mx-auto max-w-[1200px] space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link to="/admin/projetos" className="rounded-lg border border-[var(--line)] p-2 text-[var(--ink)] hover:bg-[var(--card)]" aria-label="Voltar aos projetos"><ArrowLeft className="h-4 w-4" /></Link>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--blue)]">{projeto.codigo} · {tipoProjetoLabel(projeto.tipo)}</p>
              <h1 className="text-2xl font-extrabold text-[var(--ink)]">{projeto.nome}</h1>
              <p className="text-sm text-[var(--muted)]">{projeto.clienteNome} · {projeto.endereco || 'Endereço não informado'}</p>
            </div>
          </div>
          <button type="button" onClick={() => persistirProjeto()} className="btn-tech pri inline-flex items-center gap-2"><Save className="h-4 w-4" />Salvar projeto</button>
        </div>

        {!isHvac ? (
          <section className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5">
            <h2 className="text-lg font-bold">Cadastro do projeto</h2>
            <p className="text-sm text-[var(--muted)]">O projeto está registrado na Central. O módulo de cálculo/geração automática será disponibilizado em uma próxima etapa específica para este tipo.</p>
            <label className="block space-y-1.5"><span className="text-xs font-semibold text-[var(--muted)]">Nome do projeto *</span><input defaultValue={projeto.nome} onBlur={(event) => atualizarProjetoEngenharia(projeto.id, { nome: event.target.value })} className="w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--ink)]" /></label>
            <label className="block space-y-1.5"><span className="text-xs font-semibold text-[var(--muted)]">Endereço / local da obra</span><input defaultValue={projeto.endereco} onBlur={(event) => atualizarProjetoEngenharia(projeto.id, { endereco: event.target.value })} className="w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--ink)]" /></label>
            <label className="block space-y-1.5"><span className="text-xs font-semibold text-[var(--muted)]">Escopo / observações</span><textarea defaultValue={projeto.descricao} onBlur={(event) => atualizarProjetoEngenharia(projeto.id, { descricao: event.target.value })} rows={6} className="w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--ink)]" /></label>
            <label className="block space-y-1.5"><span className="text-xs font-semibold text-[var(--muted)]">Etapa</span><select value={projeto.status} onChange={(event) => atualizarProjetoEngenharia(projeto.id, { status: event.target.value as any })} className="rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm"><option value="em_elaboracao">Em elaboração</option><option value="em_revisao">Em revisão</option><option value="concluido">Concluído</option></select></label>
          </section>
        ) : (
          <>
            <div className="rounded-xl border-2 border-amber-500 bg-amber-50 p-4 text-sm font-semibold leading-relaxed text-amber-950">
              Pré-dimensionamento por método simplificado. Os resultados precisam ser conferidos e validados pelo responsável técnico. O DXF abre no AutoCAD (salvar como DWG) e o IFC é importado/vinculado no Revit; não é arquivo .rvt nativo.
            </div>

            <section className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5">
              <div className="flex items-center gap-2"><Settings2 className="h-4 w-4 text-[var(--blue)]" /><h2 className="text-lg font-bold">Dados gerais e premissas</h2></div>
              <div className="grid gap-4 md:grid-cols-2">
                <InputField label="Nome do projeto" value={payload.name || projeto.nome} required onChange={(value) => atualizarPayload((current) => ({ ...current, name: value }))} />
                <InputField label="Endereço / local da obra" value={payload.address || projeto.endereco} onChange={(value) => atualizarPayload((current) => ({ ...current, address: value }))} />
                <label className="block space-y-1.5"><span className="text-xs font-semibold text-[var(--muted)]">Sistema HVAC-R</span><select value={payload.system} onChange={(event) => atualizarPayload((current) => ({ ...current, system: event.target.value }))} className="w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm"><option value="split">Split</option><option value="vrf">VRF</option><option value="dutado">Dutado / fan-coil</option></select></label>
                <label className="block space-y-1.5"><span className="text-xs font-semibold text-[var(--muted)]">Cidade climática (referência aproximada)</span><select value={payload.climate.city || ''} onChange={(event) => atualizarPayload((current) => ({ ...current, climate: { ...current.climate, city: event.target.value, tbs: undefined, tbu: undefined, altitude_m: undefined } }))} className="w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm"><option value="">Informar TBS/TBU manualmente</option>{Object.keys(cidades).sort().map((city) => <option value={city} key={city}>{city}</option>)}</select><span className="text-[11px] text-[var(--muted)]">{avisoCidade}</span></label>
                {!payload.climate.city && <div className="grid grid-cols-3 gap-2"><InputField label="TBS (°C)" type="number" step="0.1" value={payload.climate.tbs} onChange={(value) => atualizarPayload((current) => ({ ...current, climate: { ...current.climate, tbs: Number(value) } }))} /><InputField label="TBU (°C)" type="number" step="0.1" value={payload.climate.tbu} onChange={(value) => atualizarPayload((current) => ({ ...current, climate: { ...current.climate, tbu: Number(value) } }))} /><InputField label="Altitude (m)" type="number" step="1" value={payload.climate.altitude_m} onChange={(value) => atualizarPayload((current) => ({ ...current, climate: { ...current.climate, altitude_m: Number(value) } }))} /></div>}
                <InputField label="Setpoint interno (°C)" type="number" step="0.1" value={payload.setpoint_c} onChange={(value) => atualizarPayload((current) => ({ ...current, setpoint_c: Number(value) }))} />
                <InputField label="Umidade relativa interna (%)" type="number" step="1" min="0" value={payload.rh_pct} onChange={(value) => atualizarPayload((current) => ({ ...current, rh_pct: Number(value) }))} />
                <InputField label="Altura entre pavimentos (m)" type="number" step="0.1" min="2.1" value={payload.floor_height_m} onChange={(value) => atualizarPayload((current) => ({ ...current, floor_height_m: Number(value) }))} />
                {payload.system === 'dutado' && <><InputField label="Casa de máquinas AHU - coordenada X (m)" type="number" step="0.1" value={payload.ahu?.x} onChange={(value) => atualizarPayload((current) => ({ ...current, ahu: { ...current.ahu, x: Number(value) } }))} /><InputField label="Casa de máquinas AHU - coordenada Y (m)" type="number" step="0.1" value={payload.ahu?.y} onChange={(value) => atualizarPayload((current) => ({ ...current, ahu: { ...current.ahu, y: Number(value) } }))} /></>}
                <InputField label="ART (se já emitida)" value={payload.responsible?.art || ''} onChange={(value) => atualizarPayload((current) => ({ ...current, responsible: { ...current.responsible, art: value } }))} />
              </div>
              <p className="text-xs text-[var(--muted)]">Responsável técnico: {currentUser?.nome || DADOS_VL_PADRAO.responsavelTecnico} · CREA {currentUser?.crea || DADOS_VL_PADRAO.crea}. Preenchidos pelo perfil/configuração da VL Engenharia.</p>
            </section>

            <section className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-[var(--blue)]" /><h2 className="text-lg font-bold">Ambientes</h2><span className="text-xs text-[var(--muted)]">{payload.rooms.length} cadastrado(s)</span></div>
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" onClick={() => atualizarPayload((current) => ({ ...current, rooms: [...current.rooms, roomDefault(`R${current.rooms.length + 1}`)] }))} className="btn-tech inline-flex items-center gap-1.5"><Plus className="h-4 w-4" />Adicionar ambiente</button>
                  <button type="button" onClick={() => atualizarPayload((current) => ({ ...current, rooms: [...current.rooms, { ...current.rooms[current.rooms.length - 1], id: `R${current.rooms.length + 1}`, name: `${current.rooms[current.rooms.length - 1]?.name || 'Ambiente'} - cópia`, facades: [...(current.rooms[current.rooms.length - 1]?.facades || []).map((f: any) => ({ ...f }))] }] }))} className="btn-tech">Duplicar último</button>
                </div>
              </div>
              <form id="hvac-dxf-form" className="flex flex-wrap items-end gap-2 rounded-xl border border-dashed border-[var(--line)] p-3" onSubmit={(event) => event.preventDefault()}>
                <label className="space-y-1 text-xs"><span className="block font-semibold">Camada DXF</span><input name="dxf-layer" defaultValue="AMBIENTES" className="rounded-lg border border-[var(--line)] bg-[var(--card)] px-2.5 py-2 text-sm" /></label>
                <label className="space-y-1 text-xs"><span className="block font-semibold">Unidade para metros</span><select name="dxf-unit" defaultValue="0.001" className="rounded-lg border border-[var(--line)] bg-[var(--card)] px-2.5 py-2 text-sm"><option value="0.001">Milímetros</option><option value="0.01">Centímetros</option><option value="1">Metros</option></select></label>
                <label className="btn-tech inline-flex cursor-pointer items-center gap-2"><Upload className="h-4 w-4" />{carregando === 'dxf' ? 'Importando...' : 'Importar DXF'}<input type="file" accept=".dxf,application/dxf" className="hidden" disabled={carregando !== ''} onChange={(event) => { void importarDxf(event.target.files?.[0]); event.currentTarget.value = ''; }} /></label>
                <span className="text-[11px] text-[var(--muted)]">Somente .DXF, até 25 MB; polilinhas fechadas na camada informada.</span>
              </form>
              <div className="space-y-4">
                {payload.rooms.map((room: any, roomIndex: number) => (
                  <article key={`${room.id}-${roomIndex}`} className={`space-y-4 rounded-xl border p-4 ${room.dxf_is_rectangle === false ? 'border-amber-500 bg-amber-50/50' : 'border-[var(--line)]'}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-bold">{room.id || `R${roomIndex + 1}`} {room.dxf_is_rectangle === false && <span className="ml-2 text-xs font-bold text-amber-800">DXF não retangular - usa retângulo envolvente; conferir dimensões</span>}</h3>
                      <div className="flex gap-2"><button type="button" onClick={() => atualizarPayload((current) => ({ ...current, rooms: current.rooms.filter((_: any, i: number) => i !== roomIndex) }))} className="inline-flex items-center gap-1 text-xs font-semibold text-red-600"><Trash2 className="h-3.5 w-3.5" />Remover</button></div>
                    </div>
                    {room.area_real_m2 !== undefined && <p className="text-xs text-amber-900">Área real indicada no DXF: {room.area_real_m2} m². O cálculo usa o retângulo envolvente ({(Number(room.w) * Number(room.l)).toFixed(2)} m²).</p>}
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <InputField label="ID" value={room.id} required onChange={(value) => atualizarAmbiente(roomIndex, { id: value })} />
                      <InputField label="Nome" value={room.name} required onChange={(value) => atualizarAmbiente(roomIndex, { name: value })} />
                      <label className="space-y-1.5"><span className="text-xs font-semibold text-[var(--muted)]">Uso do ambiente</span><select value={room.use} onChange={(event) => atualizarAmbiente(roomIndex, { use: event.target.value })} className="w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm">{[['escritorio','Escritório'],['sala_reuniao','Sala de reunião'],['sala_aula','Sala de aula'],['auditorio','Auditório'],['loja','Loja'],['consultorio','Consultório'],['restaurante','Restaurante'],['dormitorio','Dormitório'],['laboratorio','Laboratório'],['recepcao','Recepção']].map(([v,l]) => <option value={v} key={v}>{l}</option>)}</select></label>
                      <InputField label="Pavimento (nível)" type="number" step="1" value={room.level} onChange={(value) => atualizarAmbiente(roomIndex, { level: Number(value) })} />
                      <InputField label="Coordenada X (m)" type="number" step="0.1" value={room.x} onChange={(value) => atualizarAmbiente(roomIndex, { x: Number(value) })} />
                      <InputField label="Coordenada Y (m)" type="number" step="0.1" value={room.y} onChange={(value) => atualizarAmbiente(roomIndex, { y: Number(value) })} />
                      <InputField label="Largura X (m)" type="number" step="0.1" min="0.1" value={room.w} onChange={(value) => atualizarAmbiente(roomIndex, { w: Number(value) })} />
                      <InputField label="Comprimento Y (m)" type="number" step="0.1" min="0.1" value={room.l} onChange={(value) => atualizarAmbiente(roomIndex, { l: Number(value) })} />
                      <InputField label="Pé-direito (m)" type="number" step="0.1" min="0.1" value={room.height_m} onChange={(value) => atualizarAmbiente(roomIndex, { height_m: Number(value) })} />
                      <InputField label="Ocupantes" type="number" step="1" min="0" value={room.occupants} onChange={(value) => atualizarAmbiente(roomIndex, { occupants: value === '' ? undefined : Number(value) })} />
                      <InputField label="Iluminação (W/m²)" type="number" step="0.1" min="0" value={room.lighting_w_m2} onChange={(value) => atualizarAmbiente(roomIndex, { lighting_w_m2: Number(value) })} />
                      <InputField label="Equipamentos (W)" type="number" step="1" min="0" value={room.equipment_w} onChange={(value) => atualizarAmbiente(roomIndex, { equipment_w: Number(value) })} />
                    </div>
                    <label className="inline-flex items-center gap-2 text-xs font-medium"><input type="checkbox" checked={Boolean(room.roof_exposed)} onChange={(event) => atualizarAmbiente(roomIndex, { roof_exposed: event.target.checked })} />Cobertura exposta ao ambiente externo</label>
                    <div className="space-y-3 border-t border-[var(--line)] pt-3">
                      <div className="flex items-center justify-between"><h4 className="text-sm font-bold">Fachadas externas</h4><button type="button" onClick={() => atualizarPayload((current) => ({ ...current, rooms: current.rooms.map((r: any, i: number) => i === roomIndex ? { ...r, facades: [...r.facades, { orientation: 'N', length_m: 4, glazing_area_m2: 0, shading_factor: 1 }] } : r) }))} className="text-xs font-semibold text-[var(--blue)]">+ Fachada</button></div>
                      {room.facades.map((facade: any, facadeIndex: number) => <div key={facadeIndex} className="grid gap-2 rounded-lg bg-[var(--paper)] p-3 sm:grid-cols-2 lg:grid-cols-5">
                        <label className="space-y-1 text-xs"><span className="block font-semibold">Orientação</span><select value={facade.orientation} onChange={(e) => atualizarFachada(roomIndex, facadeIndex, { orientation: e.target.value })} className="w-full rounded border border-[var(--line)] bg-[var(--card)] px-2 py-2">{['N','NE','E','SE','S','SW','W','NW'].map((d) => <option key={d}>{d}</option>)}</select></label>
                        <InputField label="Comprimento (m)" type="number" step="0.1" value={facade.length_m} onChange={(v) => atualizarFachada(roomIndex, facadeIndex, { length_m: Number(v) })} />
                        <InputField label="Vidro (m²)" type="number" step="0.1" value={facade.glazing_area_m2} onChange={(v) => atualizarFachada(roomIndex, facadeIndex, { glazing_area_m2: Number(v) })} />
                        <InputField label="U parede (W/m²K)" type="number" step="0.1" value={facade.wall_u} onChange={(v) => atualizarFachada(roomIndex, facadeIndex, { wall_u: Number(v) })} />
                        <InputField label="Fator de sombreamento" type="number" step="0.05" min="0.01" value={facade.shading_factor} onChange={(v) => atualizarFachada(roomIndex, facadeIndex, { shading_factor: Number(v) })} />
                        <button type="button" onClick={() => atualizarPayload((current) => ({ ...current, rooms: current.rooms.map((r: any, i: number) => i === roomIndex ? { ...r, facades: r.facades.filter((_: any, fi: number) => fi !== facadeIndex) } : r) }))} className="text-left text-xs font-semibold text-red-600">Remover fachada</button>
                      </div>)}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5">
              <div className="flex items-center gap-2"><Settings2 className="h-4 w-4 text-[var(--blue)]" /><h2 className="text-lg font-bold">Parâmetros de pré-dimensionamento</h2></div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <InputField label="Fator de segurança" type="number" step="0.01" value={payload.options.safety_factor} onChange={(v) => atualizarPayload((c) => ({ ...c, options: { ...c.options, safety_factor: Number(v) } }))} />
                <InputField label="Delta T insuflamento (K)" type="number" step="0.5" value={payload.options.supply_delta_t} onChange={(v) => atualizarPayload((c) => ({ ...c, options: { ...c.options, supply_delta_t: Number(v) } }))} />
                <InputField label="Perda de carga (Pa/m)" type="number" step="0.1" value={payload.options.friction_pa_m} onChange={(v) => atualizarPayload((c) => ({ ...c, options: { ...c.options, friction_pa_m: Number(v) } }))} />
                <InputField label="Velocidade máxima (m/s)" type="number" step="0.1" value={payload.options.max_velocity_ms} onChange={(v) => atualizarPayload((c) => ({ ...c, options: { ...c.options, max_velocity_ms: Number(v) } }))} />
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={executarCalculo} disabled={carregando !== ''} className="btn-tech inline-flex items-center gap-2">{carregando === 'calcular' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wind className="h-4 w-4" />}Calcular pré-dimensionamento</button>
                <button type="button" onClick={executarGeracao} disabled={carregando !== ''} className="btn-tech pri inline-flex items-center gap-2">{carregando === 'gerar' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Snowflake className="h-4 w-4" />}Gerar pacote DXF + IFC + memorial</button>
                <button type="button" onClick={() => persistirProjeto()} className="btn-tech inline-flex items-center gap-2"><Save className="h-4 w-4" />Salvar dados</button>
                {result && <button type="button" onClick={executarAnalise} disabled={carregando !== ''} className="btn-tech inline-flex items-center gap-2">{carregando === 'analise' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Settings2 className="h-4 w-4" />}Gerar análise do projetista (IA)</button>}
              </div>
              {erro && <p role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">{erro}</p>}
              {sucesso && <p role="status" className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800">{sucesso}</p>}
            </section>

            {result && <section className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5">
              <h2 className="text-lg font-bold">Resultados do pré-dimensionamento</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[['Carga total', `${result.totals?.total_w ?? '-'} W`], ['Capacidade', `${result.totals?.total_tr ?? '-'} TR`], ['Área condicionada', `${result.totals?.area_m2 ?? '-'} m²`], ['Vazão de insuflamento', `${result.totals?.supply_m3h ?? '-'} m³/h`]].map(([label, value]) => <div key={label} className="rounded-xl border border-[var(--line)] p-3"><p className="text-xs text-[var(--muted)]">{label}</p><p className="text-lg font-extrabold">{value}</p></div>)}
              </div>
              <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead><tr className="border-b border-[var(--line)]"><th className="p-2">Ambiente</th><th className="p-2">Área</th><th className="p-2">Carga total</th><th className="p-2">TR</th><th className="p-2">W/m²</th><th className="p-2">Vazão m³/h</th></tr></thead><tbody>{(result.loads || []).map((load: any) => <tr key={load.room_id} className="border-b border-[var(--line)]"><td className="p-2">{load.name}</td><td className="p-2">{load.area_m2} m²</td><td className="p-2">{load.total_w} W</td><td className="p-2">{load.total_tr}</td><td className="p-2">{load.w_per_m2}</td><td className="p-2">{load.supply_m3h}</td></tr>)}</tbody></table></div>
              {result.bom?.length > 0 && <div><h3 className="mb-2 text-sm font-bold">Lista preliminar de materiais</h3><ul className="grid gap-1 text-xs sm:grid-cols-2">{result.bom.map((item: any, index: number) => <li key={index}>- {item.item}: {item.qtd} {item.un}</li>)}</ul></div>}
              {result.warnings?.length > 0 && <div className="rounded-lg border border-amber-400 bg-amber-50 p-3 text-sm text-amber-950"><strong>Avisos para revisão técnica</strong><ul className="mt-1 list-inside list-disc text-xs">{result.warnings.map((warning: string, index: number) => <li key={index}>{warning}</li>)}</ul></div>}
            </section>}

            {result && projeto.analiseHvac && <section className="space-y-2 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5">
              <h2 className="text-lg font-bold">Análise do projetista (gerada com IA — revisar)</h2>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{projeto.analiseHvac}</pre>
              <p className="text-xs text-amber-800">Texto auxiliar; deve ser revisado pelo responsável técnico antes de integrar ao memorial final.</p>
            </section>}

            {projeto.jobHvacId && <section className="space-y-3 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5">
              <h2 className="text-lg font-bold">Arquivos do projeto</h2>
              <p className="text-xs text-[var(--muted)]">Os arquivos temporários do serviço ficam disponíveis por até 24 horas. O payload e o resultado foram salvos com o projeto, permitindo gerar novamente quando expirarem.</p>
              <div className="flex flex-wrap gap-2">
                {([
                  ['planta_hvac.dxf', 'Planta DXF'],
                  ['modelo_hvac.ifc', 'Modelo IFC'],
                  ['memorial.html', 'Memorial HTML'],
                  ['memorial.md', 'Memorial Markdown'],
                  ['resultado.json', 'Resultado JSON'],
                  ['pacote_hvac.zip', 'Baixar pacote ZIP'],
                ] as [HvacFileName | 'pacote_hvac.zip', string][]).map(([file, label]) => <button type="button" key={file} onClick={() => void baixar(file)} className="btn-tech inline-flex items-center gap-1.5"><Download className="h-3.5 w-3.5" />{label}</button>)}
              </div>
              <button type="button" onClick={executarGeracao} disabled={carregando !== ''} className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--blue)]"><RefreshCw className="h-3.5 w-3.5" />Gerar arquivos novamente</button>
            </section>}

            {erro && !result && <p role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">{erro}</p>}
          </>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
          <span className="text-xs text-[var(--muted)]">Criado em {new Date(projeto.criadoEm).toLocaleDateString('pt-BR')} · Última atualização {new Date(projeto.atualizadoEm).toLocaleString('pt-BR')}</span>
          <button type="button" onClick={() => { if (window.confirm(`Excluir o projeto "${projeto.nome}"?`)) { removerProjetoEngenharia(projeto.id); navigate('/admin/projetos'); } }} className="inline-flex items-center gap-2 text-xs font-semibold text-red-600"><Trash2 className="h-4 w-4" />Excluir projeto</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-3xl font-extrabold tracking-tight text-[var(--ink)]">Central de Laudos e Projetos</h1><p className="mt-1 text-sm text-[var(--muted)]">Projetos técnicos da VL Engenharia, organizados por disciplina e cliente.</p></div>
        <div className="flex gap-2">
          <Link to="/admin/laudos" className="btn-tech inline-flex items-center gap-2"><FileText className="h-4 w-4" />Laudos</Link>
          <button type="button" onClick={() => { setTipoNovo('hvac-r'); setClienteNovo(clientes[0]?.id || ''); setNomeNovo(''); setEnderecoNovo(''); setDescricaoNova(''); setModalNovo(true); }} className="btn-tech pri inline-flex items-center gap-2"><Plus className="h-4 w-4" />Novo projeto</button>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">{TIPOS_PROJETO.map((tipo) => <button key={tipo.id} type="button" onClick={() => { setTipoNovo(tipo.id); setClienteNovo(clientes[0]?.id || ''); setNomeNovo(''); setEnderecoNovo(''); setDescricaoNova(''); setModalNovo(true); }} className={`rounded-2xl border p-4 text-left transition hover:border-[var(--blue)] ${tipo.id === 'hvac-r' ? 'border-sky-300 bg-sky-50/70' : 'border-[var(--line)] bg-[var(--card)]'}`}><div className="mb-2 flex items-center gap-2 font-bold text-[var(--ink)]">{tipo.id === 'hvac-r' ? <Wind className="h-4 w-4 text-sky-700" /> : <FileArchive className="h-4 w-4 text-[var(--blue)]" />}{tipo.titulo}</div><p className="text-xs leading-relaxed text-[var(--muted)]">{tipo.descricao}</p></button>)}</div>
      <div className="flex flex-wrap items-center gap-2">
        <input value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Buscar código, nome, cliente..." className="min-w-[220px] flex-1 rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm" />
        <select value={filtro} onChange={(event) => setFiltro(event.target.value as any)} className="rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm"><option value="todos">Todos os tipos</option>{TIPOS_PROJETO.map((tipo) => <option key={tipo.id} value={tipo.id}>{tipo.titulo}</option>)}</select>
      </div>
      {projetosFiltrados.length === 0 ? <div className="rounded-2xl border border-dashed border-[var(--line)] p-12 text-center"><FileArchive className="mx-auto mb-3 h-9 w-9 text-[var(--muted)]" /><p className="font-bold">Nenhum projeto cadastrado</p><p className="mt-1 text-sm text-[var(--muted)]">Crie um projeto HVAC-R, PPCI ou mecânico para começar.</p></div> : <div className="grid gap-3 lg:grid-cols-2">{projetosFiltrados.map((item) => <article key={item.id} className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-[11px] font-bold uppercase text-[var(--blue)]">{item.codigo} · {item.status.replace('_', ' ')}</p><h2 className="mt-1 text-lg font-bold">{item.nome}</h2><p className="text-sm text-[var(--muted)]">{item.clienteNome}</p></div><span className="rounded-full bg-[var(--paper)] px-2 py-1 text-[10px] font-semibold">{item.tipo.toUpperCase()}</span></div><p className="mt-3 line-clamp-2 text-xs text-[var(--muted)]">{item.endereco || item.descricao || tipoProjetoLabel(item.tipo)}</p><div className="mt-4 flex items-center justify-between"><span className="text-[11px] text-[var(--muted)]">Atualizado {new Date(item.atualizadoEm).toLocaleDateString('pt-BR')}</span><Link to={`/admin/projetos/${item.id}`} className="btn-tech pri inline-flex items-center gap-1.5">Abrir projeto</Link></div></article>)}</div>}

      {modalNovo && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"><div className="w-full max-w-xl space-y-4 rounded-2xl bg-[var(--paper)] p-5 shadow-2xl">
        <div className="flex items-center justify-between"><h2 className="text-xl font-bold">Novo projeto</h2><button type="button" onClick={() => setModalNovo(false)} className="text-xl">×</button></div>
        <label className="block space-y-1.5"><span className="text-xs font-semibold">Tipo de projeto</span><select value={tipoNovo} onChange={(event) => setTipoNovo(event.target.value as TipoProjetoEngenharia)} className="w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm">{TIPOS_PROJETO.map((tipo) => <option key={tipo.id} value={tipo.id}>{tipo.titulo}</option>)}</select></label>
        <label className="block space-y-1.5"><span className="text-xs font-semibold">Cliente *</span><select value={clienteNovo} onChange={(event) => setClienteNovo(event.target.value)} className="w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm"><option value="">Selecione um cliente</option>{clientes.map((cliente) => <option key={cliente.id} value={cliente.id}>{cliente.razaoSocial || cliente.nomeFantasia}</option>)}</select></label>
        <InputField label="Nome do projeto" value={nomeNovo} required onChange={setNomeNovo} placeholder="Ex.: Climatização - Unidade Recife" />
        <InputField label="Endereço / local da obra" value={enderecoNovo} onChange={setEnderecoNovo} placeholder="Endereço ou local de execução" />
        <label className="block space-y-1.5"><span className="text-xs font-semibold">Escopo / observações</span><textarea value={descricaoNova} onChange={(event) => setDescricaoNova(event.target.value)} rows={3} className="w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm" /></label>
        <div className="flex justify-end gap-2"><button type="button" onClick={() => setModalNovo(false)} className="btn-tech">Cancelar</button><button type="button" disabled={!clienteNovo || !nomeNovo.trim()} onClick={criarProjeto} className="btn-tech pri">Criar e abrir</button></div>
      </div></div>}
    </div>
  );
};
