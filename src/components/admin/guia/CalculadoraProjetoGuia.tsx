import React, { useEffect, useMemo, useState } from 'react';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { AlertCircle, Check, Clipboard, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import {
  EntradasGuia,
  EXEMPLOS_CALCULADORAS,
  ResultadoGuia,
  calcularGuia,
} from '../../../lib/calculadorasGuia';
import { GuiaModeloServico, GuiaServicoId, ProjetoGuia, ProjetoGuiaCalculo } from '../../../types';
import { db } from '../../../lib/firebase';
import { CHAVE_GUIA_INSERCAO_PENDENTE, GuiaDestinoEditor, GuiaInsercaoPendente } from '../../../lib/guiaInsercaoEditor';

interface CalculadoraProjetoGuiaProps {
  servico: GuiaServicoId;
  modelo: GuiaModeloServico;
  projeto?: ProjetoGuia;
}

interface CampoNumero {
  chave: string;
  rotulo: string;
  unidade: string;
  passo?: string;
}

const CAMPOS: Record<GuiaServicoId, CampoNumero[]> = {
  hvac: [
    { chave: 'area', rotulo: 'Área', unidade: 'm²' },
    { chave: 'peDireito', rotulo: 'Pé-direito', unidade: 'm', passo: '0.1' },
    { chave: 'pessoas', rotulo: 'Pessoas', unidade: 'pessoas' },
    { chave: 'wSensivelPessoa', rotulo: 'Calor sensível por pessoa', unidade: 'W/pessoa' },
    { chave: 'wLatentePessoa', rotulo: 'Calor latente por pessoa', unidade: 'W/pessoa' },
    { chave: 'equipamentosW', rotulo: 'Equipamentos', unidade: 'W' },
    { chave: 'iluminacaoWm2', rotulo: 'Iluminação', unidade: 'W/m²' },
    { chave: 'areaVidro', rotulo: 'Área de vidro', unidade: 'm²' },
    { chave: 'fatorSolar', rotulo: 'Fator solar', unidade: 'FS', passo: '0.01' },
    { chave: 'uVidro', rotulo: 'Transmitância do vidro', unidade: 'W/m²K' },
    { chave: 'radiacaoSolar', rotulo: 'Radiação solar', unidade: 'W/m²' },
    { chave: 'temperaturaExterna', rotulo: 'Temperatura externa', unidade: '°C', passo: '0.1' },
    { chave: 'urExterna', rotulo: 'Umidade externa', unidade: '%', passo: '1' },
    { chave: 'temperaturaInterna', rotulo: 'Temperatura interna', unidade: '°C', passo: '0.1' },
    { chave: 'urInterna', rotulo: 'Umidade interna', unidade: '%', passo: '1' },
    { chave: 'areaParede', rotulo: 'Área de parede', unidade: 'm²' },
    { chave: 'uParede', rotulo: 'U da parede', unidade: 'W/m²K' },
    { chave: 'deltaTParede', rotulo: 'ΔT equivalente da parede', unidade: 'K' },
    { chave: 'areaCobertura', rotulo: 'Área de cobertura', unidade: 'm²' },
    { chave: 'uCobertura', rotulo: 'U da cobertura', unidade: 'W/m²K' },
    { chave: 'deltaTCobertura', rotulo: 'ΔT equivalente da cobertura', unidade: 'K' },
    { chave: 'arExternoPessoaLs', rotulo: 'Ar externo por pessoa', unidade: 'L/s·pessoa', passo: '0.1' },
    { chave: 'arExternoAreaLsM2', rotulo: 'Ar externo por área', unidade: 'L/s·m²', passo: '0.1' },
    { chave: 'deltaTInsuflacao', rotulo: 'ΔT de insuflação', unidade: 'K' },
    { chave: 'margemPercentual', rotulo: 'Margem', unidade: '%' },
    { chave: 'quantidadeDifusores', rotulo: 'Número de difusores', unidade: 'un' },
  ],
  ppci: [
    { chave: 'area', rotulo: 'Área', unidade: 'm²' },
    { chave: 'densidadeM2Pessoa', rotulo: 'Área por pessoa', unidade: 'm²/pessoa', passo: '0.1' },
    { chave: 'capacidadePassagem', rotulo: 'Capacidade C', unidade: 'pessoas/un' },
    { chave: 'numeroHidrantes', rotulo: 'Hidrantes simultâneos', unidade: 'un' },
    { chave: 'vazaoHidranteLMin', rotulo: 'Vazão por hidrante', unidade: 'L/min' },
    { chave: 'autonomiaMin', rotulo: 'Autonomia', unidade: 'min' },
    { chave: 'diametroInternoMm', rotulo: 'Diâmetro interno', unidade: 'mm', passo: '0.1' },
    { chave: 'coeficienteHazenWilliams', rotulo: 'Coeficiente de Hazen-Williams', unidade: 'C' },
    { chave: 'comprimentoEquivalenteM', rotulo: 'Comprimento equivalente', unidade: 'm' },
    { chave: 'desNivelM', rotulo: 'Desnível', unidade: 'm' },
    { chave: 'pressaoResidualMca', rotulo: 'Pressão residual', unidade: 'mca' },
    { chave: 'massaCombustivelKg', rotulo: 'Massa de combustível', unidade: 'kg' },
    { chave: 'poderCalorificoMjKg', rotulo: 'Poder calorífico', unidade: 'MJ/kg' },
  ],
  nr12: [
    { chave: 'tempoParadaMs', rotulo: 'Tempo de parada da máquina', unidade: 'ms' },
    { chave: 'tempoRespostaMs', rotulo: 'Tempo de resposta do dispositivo', unidade: 'ms' },
    { chave: 'capacidadeDeteccaoMm', rotulo: 'Capacidade de detecção d', unidade: 'mm' },
  ],
  nr13: [
    { chave: 'pressaoProjetoMpa', rotulo: 'Pressão de projeto P', unidade: 'MPa', passo: '0.01' },
    { chave: 'raioInternoMm', rotulo: 'Raio interno R', unidade: 'mm' },
    { chave: 'diametroInternoMm', rotulo: 'Diâmetro interno D', unidade: 'mm' },
    { chave: 'tensaoAdmissivelMpa', rotulo: 'Tensão admissível S', unidade: 'MPa' },
    { chave: 'eficienciaJunta', rotulo: 'Eficiência de junta E', unidade: '0–1', passo: '0.01' },
    { chave: 'sobreEspessuraCorrosaoMm', rotulo: 'Sobrespessura de corrosão', unidade: 'mm', passo: '0.1' },
    { chave: 'espessuraMedidaMm', rotulo: 'Espessura medida', unidade: 'mm', passo: '0.01' },
    { chave: 'espessuraNominalMm', rotulo: 'Espessura nominal', unidade: 'mm', passo: '0.01' },
    { chave: 'taxaCorrosaoMmAno', rotulo: 'Taxa de corrosão', unidade: 'mm/ano', passo: '0.01' },
    { chave: 'volumeM3', rotulo: 'Volume', unidade: 'm³', passo: '0.1' },
    { chave: 'razaoTensoesTeste', rotulo: 'Razão de tensões para teste', unidade: '—', passo: '0.01' },
  ],
};

const ROTULOS_RESULTADO: Record<string, string> = {
  pessoasSensivelW: 'Pessoas — sensível',
  pessoasLatenteW: 'Pessoas — latente',
  iluminacaoW: 'Iluminação',
  equipamentosW: 'Equipamentos',
  vidroRadiacaoW: 'Vidro — radiação solar',
  vidroConducaoW: 'Vidro — condução',
  paredeECoberturaW: 'Paredes e cobertura',
  vazaoArExternoM3h: 'Vazão de ar externo',
  arExternoSensivelW: 'Ar externo — sensível',
  arExternoLatenteW: 'Ar externo — latente',
  cargaSensivelSalaW: 'Carga sensível total da sala',
  cargaLatenteSalaW: 'Carga latente total da sala',
  cargaTotalComMargemW: 'Carga total com margem',
  cargaTotalComMargemKw: 'Carga total com margem',
  capacidadeBtuh: 'Capacidade estimada',
  capacidadeTr: 'Capacidade em TR',
  vazaoInsuflacaoM3h: 'Vazão de insuflação',
  vazaoPorDifusorM3h: 'Vazão por difusor',
  difusoresExemplo: 'Quantidade de difusores',
  capacidadeComercialBtuh: 'Capacidade comercial sugerida',
  populacao: 'População estimada',
  unidadesPassagemExatas: 'Unidades de passagem calculadas',
  unidadesPassagem: 'Unidades de passagem adotadas',
  larguraCalculadaM: 'Largura calculada',
  larguraAdotadaM: 'Largura adotada indicativa',
  vazaoLMin: 'Vazão de projeto',
  vazaoM3h: 'Vazão de projeto',
  volumeReservaM3: 'Reserva técnica de incêndio',
  velocidadeMs: 'Velocidade no tubo',
  perdaUnitáriaMPorM: 'Perda unitária J',
  perdaTrechoMca: 'Perda no trecho',
  alturaManometricaMca: 'Altura manométrica',
  cargaIncendioEspecificaMjM2: 'Carga de incêndio específica (combustível informado)',
  tempoTotalS: 'Tempo total',
  compensacaoCmm: 'Compensação C',
  constanteKmmS: 'Constante K',
  distanciaSegurancaMm: 'Distância de segurança S',
  distanciaComMinimo500Mm: 'Distância após mínimo de 500 mm citado',
  espessuraMinimaCascoMm: 'Espessura mínima do casco',
  espessuraMinimaTampoMm: 'Espessura mínima do tampo 2:1',
  espessuraProjetoComCorrosaoMm: 'Espessura de projeto com corrosão',
  espessuraNominalAdotadaMm: 'Espessura nominal informada/adotada',
  pmtaRecalculadaMpa: 'PMTA recalculada',
  vidaRemanescenteAnos: 'Vida remanescente indicativa',
  produtoPressaoVolume: 'Produto P × V',
  grupoPotencialRisco: 'Grupo de potencial de risco',
  categoriaNr13: 'Categoria (tabela editável)',
  testeHidrostatico1_3xPressaoProjetoMpa: 'Teste indicativo: 1,3 × pressão de projeto',
  testeHidrostatico1_3xPmtaMpa: 'Teste indicativo: 1,3 × PMTA recalculada',
  setpointValvulaSegurancaMpa: 'Ajuste indicativo da válvula de segurança',
};

function formatarResultado(chave: string, valor: string | number): string {
  if (typeof valor === 'string') return valor;
  if (!Number.isFinite(valor)) return 'Não calculado';
  const casas = Number.isInteger(valor) ? 0 : 2;
  const formatado = valor.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });
  const unidade = chave.toLowerCase().includes('btuh') ? ' BTU/h'
    : chave.toLowerCase().includes('kw') ? ' kW'
    : chave.toLowerCase().includes('tr') ? ' TR'
    : chave.toLowerCase().includes('m3h') ? ' m³/h'
    : chave.toLowerCase().includes('mca') ? ' mca'
    : chave.toLowerCase().includes('m3') ? ' m³'
    : chave.toLowerCase().includes('mm') ? ' mm'
    : chave.toLowerCase().includes('mpa') ? ' MPa'
    : chave.toLowerCase().includes('w') && !chave.toLowerCase().includes('passagem') ? ' W'
    : '';
  return `${formatado}${unidade}`;
}

export const CalculadoraProjetoGuia: React.FC<CalculadoraProjetoGuiaProps> = ({ servico, modelo, projeto }) => {
  const { currentUser } = useAuth();
  const { laudos, orcamentos } = useData();
  const navigate = useNavigate();
  const [entradas, setEntradas] = useState<Record<string, number | string>>(
    () => ({ ...EXEMPLOS_CALCULADORAS[servico] }) as Record<string, number | string>,
  );
  const [classeFluido, setClasseFluido] = useState('D');
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [calculosSalvos, setCalculosSalvos] = useState<ProjetoGuiaCalculo[]>([]);
  const [destinoEditor, setDestinoEditor] = useState<GuiaDestinoEditor>('laudo');
  const [documentoDestinoId, setDocumentoDestinoId] = useState('');
  const [secaoDestinoId, setSecaoDestinoId] = useState('');
  const laudosDisponiveis = useMemo(() => laudos.filter((laudo) => laudo.status !== 'finalizado'), [laudos]);
  const orcamentosDisponiveis = useMemo(() => orcamentos.filter((orcamento) => orcamento.status !== 'faturado'), [orcamentos]);
  const documentoDestino = destinoEditor === 'laudo'
    ? laudosDisponiveis.find((laudo) => laudo.id === documentoDestinoId)
    : orcamentosDisponiveis.find((orcamento) => orcamento.id === documentoDestinoId);
  const secoesDestino = documentoDestino?.secoes || [];
  const calculo = useMemo<{ resultado?: ResultadoGuia; erro?: string }>(() => {
    try {
      const entradasComClasse = servico === 'nr13' ? { ...entradas, classeFluido } : entradas;
      return {
        resultado: calcularGuia(servico, entradasComClasse as unknown as EntradasGuia, modelo.tabelaCategoriasNr13 || {}),
      };
    } catch (error) {
      return { erro: error instanceof Error ? error.message : 'Não foi possível calcular com os dados informados.' };
    }
  }, [entradas, classeFluido, modelo.tabelaCategoriasNr13, servico]);

  useEffect(() => {
    if (!projeto) {
      setCalculosSalvos([]);
      return;
    }
    return onSnapshot(collection(db, 'projetos_guia', projeto.id, 'calculos'), (snapshot) => {
      setCalculosSalvos(snapshot.docs.map((documento) => ({ ...documento.data(), id: documento.id } as ProjetoGuiaCalculo))
        .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)));
    }, (error) => {
      console.warn('[Guia Técnico] Falha ao ler cálculos salvos:', error);
    });
  }, [projeto?.id]);

  const alterarEntrada = (chave: string, valor: number) => setEntradas((anterior) => ({ ...anterior, [chave]: valor }));

  const salvarCalculo = async () => {
    if (!projeto || !calculo.resultado || !currentUser) return;
    setSalvando(true);
    setMensagem(null);
    const id = `calc-${Date.now()}`;
    try {
      await setDoc(doc(db, 'projetos_guia', projeto.id, 'calculos', id), {
        tipo: servico,
        entradas: { ...entradas, ...(servico === 'nr13' ? { classeFluido } : {}) },
        resultados: calculo.resultado.resultados,
        criadoEm: new Date().toISOString(),
        criadoPor: currentUser.uid,
      });
      setMensagem('Cálculo salvo no projeto.');
    } catch (error) {
      console.warn('[Guia Técnico] Falha ao salvar cálculo:', error);
      setMensagem('Não foi possível salvar o cálculo. Confira o acesso ao Firestore.');
    } finally {
      setSalvando(false);
    }
  };

  const copiarTabela = async () => {
    if (!calculo.resultado) return;
    const linhas = Object.entries(calculo.resultado.resultados)
      .map(([chave, valor]) => `${ROTULOS_RESULTADO[chave] || chave}\t${formatarResultado(chave, valor)}`);
    try {
      await navigator.clipboard.writeText(`Resultado indicativo — ${servico.toUpperCase()}\n${linhas.join('\n')}`);
      setMensagem('Tabela de resultados copiada. Selecione uma seção no editor e cole o conteúdo.');
    } catch {
      setMensagem(linhas.join('\n'));
    }
  };

  useEffect(() => {
    const documentos = destinoEditor === 'laudo' ? laudosDisponiveis : orcamentosDisponiveis;
    if (!documentoDestinoId || !documentos.some((documento) => documento.id === documentoDestinoId)) {
      setDocumentoDestinoId(documentos[0]?.id || '');
      setSecaoDestinoId(documentos[0]?.secoes?.[0]?.id || '');
    }
  }, [destinoEditor, laudosDisponiveis, orcamentosDisponiveis, documentoDestinoId]);

  useEffect(() => {
    if (secoesDestino.length && !secoesDestino.some((secao) => secao.id === secaoDestinoId)) {
      setSecaoDestinoId(secoesDestino[0].id);
    } else if (!secoesDestino.length) {
      setSecaoDestinoId('');
    }
  }, [documentoDestinoId, secoesDestino, secaoDestinoId]);

  const inserirNoEditor = () => {
    if (!calculo.resultado || !documentoDestino || !secaoDestinoId) return;
    const pendente: GuiaInsercaoPendente = {
      destino: destinoEditor,
      documentoId: documentoDestino.id,
      secaoId: secaoDestinoId,
      servico,
      origem: projeto?.nome || `Guia técnico ${servico.toUpperCase()}`,
      criadoEm: new Date().toISOString(),
      linhas: Object.entries(calculo.resultado.resultados).map(([chave, valor]) => ({
        rotulo: ROTULOS_RESULTADO[chave] || chave,
        valor: formatarResultado(chave, valor),
      })),
    };
    sessionStorage.setItem(CHAVE_GUIA_INSERCAO_PENDENTE, JSON.stringify(pendente));
    navigate(destinoEditor === 'laudo' ? `/admin/laudos/${documentoDestino.id}` : `/admin/orcamentos/${documentoDestino.id}`);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-500/35 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-400">
        Exemplo ilustrativo. Cálculo indicativo. Confirme na norma vigente antes de emitir documento assinado.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
        {CAMPOS[servico].map((campo) => (
          <label key={campo.chave} className="block text-[11px] font-semibold text-[var(--adm-mut)]">
            {campo.rotulo} <span className="font-normal">({campo.unidade})</span>
            <input
              type="number"
              step={campo.passo || 'any'}
              value={entradas[campo.chave] ?? 0}
              onChange={(event) => alterarEntrada(campo.chave, Number(event.target.value))}
              className="mt-1 w-full min-h-10 px-3 rounded-lg bg-[var(--adm-bg)] border border-[var(--adm-line)] text-sm text-[var(--adm-text)]"
            />
          </label>
        ))}
        {servico === 'nr13' && (
          <label className="block text-[11px] font-semibold text-[var(--adm-mut)]">
            Classe do fluido
            <select value={classeFluido} onChange={(event) => setClasseFluido(event.target.value)} className="mt-1 w-full min-h-10 px-3 rounded-lg bg-[var(--adm-bg)] border border-[var(--adm-line)] text-sm text-[var(--adm-text)]">
              {['A', 'B', 'C', 'D'].map((classe) => <option key={classe} value={classe}>Classe {classe}</option>)}
            </select>
          </label>
        )}
      </div>

      {calculo.erro ? (
        <p role="alert" className="rounded-lg border border-rose-500/35 bg-rose-500/10 p-3 text-xs text-rose-400 inline-flex items-start gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{calculo.erro}</p>
      ) : calculo.resultado && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="rounded-xl border border-[var(--adm-line)] bg-[var(--adm-bg)] p-3.5">
            <h4 className="text-sm font-bold text-[var(--adm-text)]">Resultados calculados</h4>
            <dl className="mt-2 divide-y divide-[var(--adm-line)]">
              {Object.entries(calculo.resultado.resultados).map(([chave, valor]) => (
                <div key={chave} className="py-2 flex justify-between gap-3 text-xs">
                  <dt className="text-[var(--adm-mut)]">{ROTULOS_RESULTADO[chave] || chave}</dt>
                  <dd className="text-right font-semibold text-[var(--adm-text)]">{formatarResultado(chave, valor)}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-xl border border-[var(--adm-line)] bg-[var(--adm-bg)] p-3.5">
            <h4 className="text-sm font-bold text-[var(--adm-text)]">Fórmulas e passos</h4>
            <ol className="mt-2 list-decimal pl-4 space-y-2 text-xs text-[var(--adm-mut)]">
              {calculo.resultado.passos.map((passo, index) => <li key={`${index}-${passo}`}>{passo}</li>)}
            </ol>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => void copiarTabela()} disabled={!calculo.resultado} className="min-h-10 px-3 rounded-lg border border-[var(--adm-line)] text-xs font-semibold text-[var(--adm-text)] inline-flex items-center gap-1.5 disabled:opacity-50"><Clipboard className="w-4 h-4" />Copiar tabela para o laudo</button>
        <button type="button" onClick={() => void salvarCalculo()} disabled={!projeto || !calculo.resultado || salvando} className="min-h-10 px-3 rounded-lg bg-[var(--adm-blue,#2160db)] text-xs font-bold text-white inline-flex items-center gap-1.5 disabled:opacity-50"><Save className="w-4 h-4" />{salvando ? 'Salvando…' : 'Salvar cálculo no projeto'}</button>
        {!projeto && <span className="self-center text-[11px] text-[var(--adm-mut)]">Crie ou selecione um projeto para salvar o cálculo.</span>}
      </div>
      <div className="rounded-xl border border-[var(--adm-line)] bg-[var(--adm-bg)] p-3.5 space-y-2.5">
        <h4 className="text-xs font-bold text-[var(--adm-text)]">Inserir resultado em documento existente</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <label className="text-[10px] font-semibold text-[var(--adm-mut)]">
            Tipo de documento
            <select value={destinoEditor} onChange={(event) => { setDestinoEditor(event.target.value as GuiaDestinoEditor); setDocumentoDestinoId(''); }} className="mt-1 w-full min-h-10 px-2 rounded-lg bg-[var(--adm-card)] border border-[var(--adm-line)] text-xs text-[var(--adm-text)]">
              <option value="laudo">Laudo</option><option value="orcamento">Orçamento</option>
            </select>
          </label>
          <label className="text-[10px] font-semibold text-[var(--adm-mut)]">
            Documento
            <select value={documentoDestinoId} onChange={(event) => { setDocumentoDestinoId(event.target.value); setSecaoDestinoId(''); }} className="mt-1 w-full min-h-10 px-2 rounded-lg bg-[var(--adm-card)] border border-[var(--adm-line)] text-xs text-[var(--adm-text)]">
              <option value="">Selecione</option>
              {(destinoEditor === 'laudo' ? laudosDisponiveis : orcamentosDisponiveis).map((documento) => (
                <option key={documento.id} value={documento.id}>
                  {destinoEditor === 'laudo' ? `${(documento as typeof laudos[number]).numero} · ${(documento as typeof laudos[number]).clienteNome}` : `${(documento as typeof orcamentos[number]).codigoProposta || documento.id} · ${(documento as typeof orcamentos[number]).clienteNome || ''}`}
                </option>
              ))}
            </select>
          </label>
          <label className="text-[10px] font-semibold text-[var(--adm-mut)]">
            Seção para anexar ao final
            <select value={secaoDestinoId} onChange={(event) => setSecaoDestinoId(event.target.value)} disabled={!secoesDestino.length} className="mt-1 w-full min-h-10 px-2 rounded-lg bg-[var(--adm-card)] border border-[var(--adm-line)] text-xs text-[var(--adm-text)] disabled:opacity-50">
              <option value="">Selecione</option>
              {secoesDestino.map((secao) => <option key={secao.id} value={secao.id}>{secao.titulo}</option>)}
            </select>
          </label>
        </div>
        <button type="button" onClick={inserirNoEditor} disabled={!calculo.resultado || !documentoDestino || !secaoDestinoId} className="min-h-10 px-3 rounded-lg border border-blue-500/40 text-xs font-semibold text-blue-400 disabled:opacity-45">
          Inserir no editor sem substituir o conteúdo existente
        </button>
        {!secoesDestino.length && <p className="text-[10px] text-[var(--adm-mut)]">O documento selecionado ainda não possui seções editáveis.</p>}
      </div>
      {mensagem && <p role="status" className="text-xs text-[var(--adm-mut)] inline-flex items-start gap-1.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" />{mensagem}</p>}
      {projeto && calculosSalvos.length > 0 && (
        <details className="rounded-xl border border-[var(--adm-line)] bg-[var(--adm-bg)] p-3">
          <summary className="cursor-pointer text-xs font-semibold text-[var(--adm-text)]">Cálculos salvos neste projeto ({calculosSalvos.length})</summary>
          <ul className="mt-2 space-y-1 text-[11px] text-[var(--adm-mut)]">
            {calculosSalvos.map((item) => <li key={item.id}>{new Date(item.criadoEm).toLocaleString('pt-BR')} · {item.tipo.toUpperCase()}</li>)}
          </ul>
        </details>
      )}
    </div>
  );
};
