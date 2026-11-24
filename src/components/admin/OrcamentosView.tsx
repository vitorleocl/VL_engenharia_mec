import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FileSpreadsheet, 
  Plus, 
  DollarSign, 
  Eye, 
  CheckCircle2, 
  X, 
  Printer, 
  ArrowRight,
  Clock,
  Send,
  Building,
  Trash2,
  Edit,
  Search,
  Sparkles,
  Layers,
  FileText,
  SlidersHorizontal,
  Check,
  Receipt
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Orcamento, OrcamentoOpcaoValor, OrcamentoOpcaoValorItem } from '../../types';
import { PropostaViewerModal } from './PropostaViewerModal';
import { FaturarOrcamentoModal } from './FaturarOrcamentoModal';
import { parseDataLocalSegura, obterYmLocal, formatarDataBrSegura } from '../../lib/dateUtils';
import { 
  gerarSecoesPadraoOrcamento, 
  gerarSecoesPadraoOrcamentoV2, 
  DADOS_VL_PADRAO, 
  calcularValidadeAte,
  obterTituloLaudoProposta,
  FASES_METODOLOGIA_PADRAO
} from '../../lib/orcamentoTemplatePadrao';
import {
  A_COMBINAR_COM_CLIENTE,
  FORMAS_PAGAMENTO,
  OPCOES_TEXTO_OPERACIONAL,
  TEXTO_OPERACIONAL_PADRAO,
  TITULO_METODOLOGIA_PADRAO,
  obterFormaPagamento,
  type FormaPagamentoId,
} from '../../lib/textosPadraoVL';
import { ComboboxSelect, type ComboboxOption } from './ComboboxSelect';

export const OrcamentosView: React.FC = () => {
  const { 
    orcamentos, 
    clientes, 
    adicionarOrcamento, 
    atualizarOrcamento,
    atualizarStatusOrcamento,
    removerOrcamento,
    servicosCatalogo,
  } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [modalNovoAberto, setModalNovoAberto] = useState(searchParams.get('novo') === '1');

  useEffect(() => {
    if (searchParams.get('novo') === '1') {
      setModalNovoAberto(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);
  const [propostaModalOrcamento, setPropostaModalOrcamento] = useState<Orcamento | null>(null);
  const [orcamentoParaExcluir, setOrcamentoParaExcluir] = useState<Orcamento | null>(null);
  const [orcamentoParaFaturar, setOrcamentoParaFaturar] = useState<Orcamento | null>(null);
  const [editandoTituloId, setEditandoTituloId] = useState<string | null>(null);
  const [tituloEditado, setTituloEditado] = useState('');
  const [busca, setBusca] = useState('');
  const [filtroMes, setFiltroMes] = useState('');
  const [filtroClienteId, setFiltroClienteId] = useState('');
  const [cardsAnimados, setCardsAnimados] = useState<Set<string>>(() => new Set());
  const animacoesTimeoutRef = useRef<Map<string, number>>(new Map());
  // Evita que o preenchimento automático dos dados do cliente sobrescreva os
  // valores salvos no orçamento quando o gerador é aberto para edição.
  const preservarDadosEdicaoRef = useRef(false);

  const [clienteId, setClienteId] = useState(clientes[0]?.id || '');
  const [cnpjCliente, setCnpjCliente] = useState('');
  const [representanteNome, setRepresentanteNome] = useState('');
  const [localidadeServico, setLocalidadeServico] = useState('');
  const [servicoCategoriaId, setServicoCategoriaId] = useState<string>('nr12-projetos');
  const [subtipoSelecionadoId, setSubtipoSelecionadoId] = useState<string>('');
  const [servicoTitulo, setServicoTitulo] = useState('Adequação à NR-12 e projetos mecânicos');
  const [normasTecnicas, setNormasTecnicas] = useState('NR-12 · NBR ISO 12100');
  const [descricaoEscopo, setDescricaoEscopo] = useState('Apreciação de risco, projeto de proteções mecânicas, enclausuramento e documentação técnica oficial.');
  const [prazoDias, setPrazoDias] = useState<number>(7);
  const [validadeDias, setValidadeDias] = useState<number>(15);
  const [valorTotal, setValorTotal] = useState('3500');
  const [condicoesPagamento, setCondicoesPagamento] = useState<string>(obterFormaPagamento('50_50').condicoes);

  // Campos do Gerador de Proposta (padronizados em textosPadraoVL)
  const [orcamentoEditando, setOrcamentoEditando] = useState<Orcamento | null>(null);
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamentoId>('50_50');
  const [metodologiaEmEtapas, setMetodologiaEmEtapas] = useState(true);
  const [ativosInspecionados, setAtivosInspecionados] = useState<string>(TEXTO_OPERACIONAL_PADRAO.ativosInspecionados);
  const [horasTecnicas, setHorasTecnicas] = useState<string>(TEXTO_OPERACIONAL_PADRAO.horasTecnicas);
  const [mobilizacao, setMobilizacao] = useState<string>(TEXTO_OPERACIONAL_PADRAO.mobilizacao);
  const [incluiNotaFiscal, setIncluiNotaFiscal] = useState(true);
  const [modoPrecificacao, setModoPrecificacao] = useState<'simples' | 'opcoes'>('simples');
  const [opcoesValores, setOpcoesValores] = useState<OrcamentoOpcaoValor[]>([]);

  // Listas grandes do gerador — pesquisáveis via ComboboxSelect.
  const opcoesClientes: ComboboxOption[] = useMemo(
    () => clientes.map(c => ({
      value: c.id,
      label: c.nomeFantasia || c.razaoSocial || 'Cliente sem nome',
      description: c.cpfCnpj || c.cnpj || undefined,
    })),
    [clientes]
  );

  const opcoesServicos: ComboboxOption[] = useMemo(() => [
    ...servicosCatalogo.map(s => ({
      value: s.id,
      label: s.nome,
      description: s.norma,
    })),
    {
      value: 'personalizado',
      label: 'Outro serviço (Personalizado)',
      description: 'Título, normas e escopo digitados manualmente',
    },
  ], [servicosCatalogo]);

  const animarCardOrcamento = (id: string) => {
    const timeoutAnterior = animacoesTimeoutRef.current.get(id);
    if (timeoutAnterior) window.clearTimeout(timeoutAnterior);
    setCardsAnimados((prev) => new Set(prev).add(id));
    const timeout = window.setTimeout(() => {
      setCardsAnimados((prev) => {
        const proximo = new Set(prev);
        proximo.delete(id);
        return proximo;
      });
      animacoesTimeoutRef.current.delete(id);
    }, 850);
    animacoesTimeoutRef.current.set(id, timeout);
  };

  useEffect(() => () => {
    animacoesTimeoutRef.current.forEach((timeout) => window.clearTimeout(timeout));
    animacoesTimeoutRef.current.clear();
  }, []);

  const alterarStatusComAnimacao = (id: string, novoStatus: Orcamento['status']) => {
    atualizarStatusOrcamento(id, novoStatus);
    animarCardOrcamento(id);
  };

  // Preenchimento automático ao selecionar cliente
  useEffect(() => {
    if (preservarDadosEdicaoRef.current) {
      preservarDadosEdicaoRef.current = false;
      return;
    }
    const c = clientes.find(cli => cli.id === clienteId);
    if (c) {
      setCnpjCliente(c.cpfCnpj || c.cnpj || '');
      setRepresentanteNome(c.contatos?.[0]?.nome || 'Diretoria / Coordenação Técnica');
      setLocalidadeServico(c.endereco?.cidade ? `${c.endereco.cidade}/${c.endereco.estado || 'PE'}` : 'Recife e Região Metropolitana - PE');
    }
  }, [clienteId, clientes]);

  // Handle service category change from catalog
  const handleSelectCategoria = (catId: string) => {
    setServicoCategoriaId(catId);
    if (catId === 'personalizado') {
      setSubtipoSelecionadoId('');
      setServicoTitulo('');
      setNormasTecnicas('Resoluções CONFEA/CREA e Normas ABNT aplicáveis');
      setDescricaoEscopo('');
      setValorTotal('2500');
      return;
    }

    const item = servicosCatalogo.find(s => s.id === catId);
    if (item) {
      setServicoTitulo(item.nome);
      setNormasTecnicas(item.norma);
      setDescricaoEscopo(item.descricao);

      // Pre-select first subtipo if available
      if (item.subtipos && item.subtipos.length > 0) {
        const primeiroSub = item.subtipos[0];
        setSubtipoSelecionadoId(primeiroSub.id || '');
        setServicoTitulo(`${item.nome} • ${primeiroSub.nome}`);
        setNormasTecnicas(`${item.norma} · ${primeiroSub.normaRef}`);
        setDescricaoEscopo(primeiroSub.detalhe);
      }
    }
  };

  const handleSelectSubtipo = (subId: string) => {
    setSubtipoSelecionadoId(subId);
    const item = servicosCatalogo.find(s => s.id === servicoCategoriaId);
    if (!item) return;

    const sub = item.subtipos.find(s => s.id === subId);
    if (sub) {
      setServicoTitulo(`${item.nome} • ${sub.nome}`);
      setNormasTecnicas(`${item.norma} · ${sub.normaRef}`);
      setDescricaoEscopo(sub.detalhe);
    }
  };

  const aplicarFormaPagamento = (id: FormaPagamentoId) => {
    setFormaPagamento(id);
    setCondicoesPagamento(obterFormaPagamento(id).condicoes);
  };

  const criarOpcaoValorPadrao = (idx: number): OrcamentoOpcaoValor => ({
    id: `opcao-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 7)}`,
    nome: `Opção ${idx + 1}`,
    descricao: '',
    itens: [
      {
        id: `opcao-item-${Date.now()}-${idx}-1`,
        descricao: 'Com 1 ART única para o lote',
        valor: 0,
      },
      {
        id: `opcao-item-${Date.now()}-${idx}-2`,
        descricao: 'Com 1 ART individual por veículo',
        valor: 0,
      },
    ],
  });

  const criarItemOpcaoValorPadrao = (opIdx: number, itemIdx: number): OrcamentoOpcaoValorItem => ({
    id: `opcao-item-${Date.now()}-${opIdx}-${itemIdx}-${Math.random().toString(36).slice(2, 7)}`,
    descricao: 'Nova configuração',
    valor: 0,
  });

  const obterMenorValorOpcoes = (opcoes: OrcamentoOpcaoValor[]): number => {
    const valores = opcoes.flatMap((op) => (op.itens || []).map((it) => Number(it.valor) || 0)).filter((v) => v > 0);
    return valores.length > 0 ? Math.min(...valores) : 0;
  };

  useEffect(() => {
    if (modoPrecificacao !== 'opcoes') return;
    const menor = obterMenorValorOpcoes(opcoesValores);
    if (menor > 0) setValorTotal(String(menor));
  }, [modoPrecificacao, opcoesValores]);

  const abrirGeradorNovo = () => {
    setOrcamentoEditando(null);
    setClienteId(clientes[0]?.id || '');
    setCnpjCliente('');
    setRepresentanteNome('');
    setLocalidadeServico('');
    setServicoCategoriaId('nr12-projetos');
    setSubtipoSelecionadoId('');
    setServicoTitulo('Adequação à NR-12 e projetos mecânicos');
    setNormasTecnicas('NR-12 · NBR ISO 12100');
    setDescricaoEscopo('Apreciação de risco, projeto de proteções mecânicas, enclausuramento e documentação técnica oficial.');
    setPrazoDias(7);
    setValidadeDias(15);
    setValorTotal('3500');
    aplicarFormaPagamento('50_50');
    setMetodologiaEmEtapas(true);
    setAtivosInspecionados(TEXTO_OPERACIONAL_PADRAO.ativosInspecionados);
    setHorasTecnicas(TEXTO_OPERACIONAL_PADRAO.horasTecnicas);
    setMobilizacao(TEXTO_OPERACIONAL_PADRAO.mobilizacao);
    setIncluiNotaFiscal(true);
    setModoPrecificacao('simples');
    setOpcoesValores([]);
    setModalNovoAberto(true);
  };

  const abrirGeradorExistente = (orcamento: Orcamento) => {
    preservarDadosEdicaoRef.current = true;
    setOrcamentoEditando(orcamento);
    setClienteId(orcamento.clienteId || clientes[0]?.id || '');
    setCnpjCliente(orcamento.cnpjCliente || '');
    setRepresentanteNome(orcamento.representanteNome || '');
    setLocalidadeServico(orcamento.localidadeServico || '');
    setServicoCategoriaId('personalizado');
    setSubtipoSelecionadoId('');
    setServicoTitulo(orcamento.servico || '');
    setNormasTecnicas(orcamento.normasTecnicas || '');
    setDescricaoEscopo(orcamento.descricaoEscopo || '');
    setPrazoDias(orcamento.prazoDias || 7);
    setValidadeDias(orcamento.validadeDias || 15);
    setValorTotal(String(orcamento.valor || 2500));
    const forma: FormaPagamentoId = orcamento.formaPagamento === '100_apos_laudo_art'
      ? '100_apos_laudo_art'
      : '50_50';
    setFormaPagamento(forma);
    setCondicoesPagamento(orcamento.condicoesPagamento || obterFormaPagamento(forma).condicoes);
    setMetodologiaEmEtapas(orcamento.metodologiaEmEtapas !== false);
    setAtivosInspecionados(orcamento.qtdEquipamentos || TEXTO_OPERACIONAL_PADRAO.ativosInspecionados);
    setHorasTecnicas(orcamento.horasEngenharia || TEXTO_OPERACIONAL_PADRAO.horasTecnicas);
    setMobilizacao(orcamento.mobilizacao || TEXTO_OPERACIONAL_PADRAO.mobilizacao);
    setIncluiNotaFiscal(orcamento.incluiNotaFiscal !== false);
    setModoPrecificacao(orcamento.modoPrecificacao === 'opcoes' ? 'opcoes' : 'simples');
    setOpcoesValores(Array.isArray(orcamento.opcoesValores) ? orcamento.opcoesValores.map((op, opIdx) => ({
      id: op.id || `opcao-${opIdx + 1}`,
      nome: op.nome || `Opção ${opIdx + 1}`,
      descricao: op.descricao || '',
      itens: (op.itens || []).map((it, itIdx) => ({
        id: it.id || `opcao-${opIdx + 1}-item-${itIdx + 1}`,
        descricao: it.descricao || '',
        valor: Number(it.valor) || 0,
        valorFormatado: it.valorFormatado,
      })),
    })) : []);
    setModalNovoAberto(true);
  };

  /** Monta o orçamento a partir dos campos do gerador (texto vem de textosPadraoVL). */
  const montarDadosProposta = (): Omit<Orcamento, 'id' | 'criadoEm'> => {
    const cliente = clientes.find(c => c.id === clienteId);
    const valorNumInformado = parseFloat(valorTotal) || 0;
    const opcoesSanitizadas = modoPrecificacao === 'opcoes'
      ? opcoesValores
          .map((op, opIdx) => ({
            id: op.id || `opcao-${opIdx + 1}`,
            nome: (op.nome || '').trim() || `Opção ${opIdx + 1}`,
            descricao: (op.descricao || '').trim() || undefined,
            itens: (op.itens || [])
              .map((it, itIdx) => ({
                id: it.id || `opcao-${opIdx + 1}-item-${itIdx + 1}`,
                descricao: (it.descricao || '').trim() || `Configuração ${itIdx + 1}`,
                valor: Number(it.valor) || 0,
              }))
              .filter((it) => it.descricao || it.valor > 0),
          }))
          .filter((op) => op.nome || op.descricao || op.itens.length > 0)
      : [];
    const menorOpcao = obterMenorValorOpcoes(opcoesSanitizadas);
    const valorNum = modoPrecificacao === 'opcoes'
      ? (menorOpcao > 0 ? menorOpcao : valorNumInformado)
      : (valorNumInformado || 2500);
    const ano = new Date().getFullYear();
    const codigoProposta = orcamentoEditando?.codigoProposta || `PROP-${ano}/${String(orcamentos.length + 1).padStart(3, '0')}`;
    const emitidaEm = orcamentoEditando?.emitidaEm || new Date().toISOString().split('T')[0];
    const validaAte = calcularValidadeAte(emitidaEm, validadeDias);
    const forma = obterFormaPagamento(formaPagamento);
    const parcelas = forma.parcelas.map((p) => ({
      parcela: p.parcela,
      quando: p.quando,
      percentual: p.percentual,
      valor: (valorNum * p.percentual) / 100,
    }));

    const orcamentoRascunho: Omit<Orcamento, 'id' | 'criadoEm'> = {
      clienteId,
      clienteNome: cliente?.nomeFantasia || cliente?.razaoSocial || orcamentoEditando?.clienteNome || 'Cliente Contratante',
      cnpjCliente: cnpjCliente.trim() || cliente?.cpfCnpj || cliente?.cnpj || '',
      representanteNome: representanteNome.trim() || cliente?.contatos?.[0]?.nome || 'Diretoria / Coordenação Técnica',
      localidadeServico: localidadeServico.trim() || (cliente?.endereco?.cidade ? `${cliente.endereco.cidade}/${cliente.endereco.estado || 'PE'}` : 'Recife e Região Metropolitana - PE'),
      emailCliente: cliente?.contatos?.[0]?.email || 'comercial@cliente.com.br',
      telefoneCliente: cliente?.contatos?.[0]?.telefone || '(81) 98444-2592',
      codigoProposta,
      revisao: orcamentoEditando
        ? String((parseInt(orcamentoEditando.revisao || '00', 10) || 0) + 1).padStart(2, '0')
        : '00',
      emitidaEm,
      validaAte,
      layoutVersao: 'v2',
      modoExportacaoPdf: 'executiva',
      servico: servicoTitulo.trim() || 'Serviços Especializados de Engenharia Mecânica',
      descricaoEscopo: descricaoEscopo.trim() || 'Vistoria técnica in loco, ensaios não destrutivos e emissão de laudo pericial com ART CREA-PE.',
      status: orcamentoEditando?.status || 'rascunho',
      valor: valorNum,
      valorFormatado: valorNum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      prazoDias,
      prazoEntrega: `${prazoDias} dias úteis`,
      validadeDias,
      condicoesPagamento: condicoesPagamento.trim() || forma.condicoes,
      formaPagamento,
      metodologiaEmEtapas,
      normasTecnicas: normasTecnicas || 'ABNT NBR, NR-11, NR-12, NR-13 conforme aplicável',
      incluiNotaFiscal,
      qtdEquipamentos: ativosInspecionados.trim() || TEXTO_OPERACIONAL_PADRAO.ativosInspecionados,
      horasEngenharia: horasTecnicas.trim() || TEXTO_OPERACIONAL_PADRAO.horasTecnicas,
      mobilizacao: mobilizacao.trim() || TEXTO_OPERACIONAL_PADRAO.mobilizacao,
      chavePix: DADOS_VL_PADRAO.pixChave,
      contratadaCnpj: DADOS_VL_PADRAO.cnpj,
      contratadaNome: DADOS_VL_PADRAO.razaoSocial,
      contratadaResponsavel: DADOS_VL_PADRAO.responsavel,
      contratadaCrea: DADOS_VL_PADRAO.crea,
      contratadaTelefone: DADOS_VL_PADRAO.telefone,
      contratadaEmail: DADOS_VL_PADRAO.email,
      contratadaEndereco: DADOS_VL_PADRAO.endereco,
      contratadaCidade: DADOS_VL_PADRAO.cidade,
      contratadaPixChave: DADOS_VL_PADRAO.pixChave,
      contratadaPixTitular: DADOS_VL_PADRAO.pixTitular,
      contratadaPixCidade: DADOS_VL_PADRAO.pixCidade,
      itensCalculo: modoPrecificacao === 'opcoes'
        ? (orcamentoEditando?.itensCalculo || [])
        : ((orcamentoEditando?.itensCalculo && orcamentoEditando.itensCalculo.length > 0)
          ? orcamentoEditando.itensCalculo
          : [
              {
                id: 'item-1',
                descricao: servicoTitulo.trim() || 'Serviços Especializados de Engenharia Mecânica',
                quantidade: 1,
                valorUnitario: valorNum,
                valorTotal: valorNum,
              }
            ]),
      modoPrecificacao,
      opcoesValores: modoPrecificacao === 'opcoes' ? opcoesSanitizadas : undefined,
      parcelas,
      cronograma: [
        { marco: 'Alinhamento & Análise de Documentação Técnica', prazo: 'D+1', responsavel: 'VL & Contratante' },
        { marco: 'Inspeção Técnica In Loco e Ensaios Não Destrutivos', prazo: 'D+3 a D+4', responsavel: 'Eng. Vitor Leonardo' },
        { marco: 'Análise de Conformidade e Memoriais de Cálculo', prazo: 'D+5', responsavel: 'Corpo Técnico VL' },
        { marco: 'Emissão de Laudo Preliminar para Validação', prazo: 'D+6', responsavel: 'Engenheiro Mecânico' },
        { marco: 'Protocolo da ART CREA-PE & Entrega Oficial do Laudo', prazo: `D+${prazoDias}`, responsavel: 'VL Engenharia' }
      ],
      ...(metodologiaEmEtapas ? {
        tituloMetodologia: TITULO_METODOLOGIA_PADRAO,
        metodologiaFases: FASES_METODOLOGIA_PADRAO.map(fase => ({ ...fase })),
      } : {}),
      ...(orcamentoEditando?.ativoId ? { ativoId: orcamentoEditando.ativoId } : {}),
      ...(orcamentoEditando?.ativoIdentificacao ? { ativoIdentificacao: orcamentoEditando.ativoIdentificacao } : {}),
    };

    // Regera as seções a partir da fonte padronizada, refletindo forma de
    // pagamento, metodologia, textos operacionais e NFS-e escolhidos aqui.
    orcamentoRascunho.secoes = gerarSecoesPadraoOrcamentoV2(orcamentoRascunho as Orcamento, { cliente });

    return orcamentoRascunho;
  };

  const salvarProposta = (): Orcamento => {
    const dados = montarDadosProposta();
    if (orcamentoEditando) {
      atualizarOrcamento(orcamentoEditando.id, {
        ...dados,
        atualizadoEm: new Date().toISOString(),
      });
      animarCardOrcamento(orcamentoEditando.id);
      return { ...orcamentoEditando, ...dados } as Orcamento;
    }
    const idCriado = adicionarOrcamento(dados);
    animarCardOrcamento(idCriado);
    return { id: idCriado, ...dados, criadoEm: new Date().toISOString() } as Orcamento;
  };

  const handleCriarEVisualizarPdf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!servicoTitulo.trim()) return;
    const salvo = salvarProposta();
    setModalNovoAberto(false);
    setPropostaModalOrcamento(salvo);
  };

  const handleCriarEAbrirEditor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!servicoTitulo.trim()) return;
    const salvo = salvarProposta();
    setModalNovoAberto(false);
    navigate(`/admin/orcamentos/${salvo.id}`);
  };

  const handleCriarPropostaApenas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!servicoTitulo.trim()) return;
    salvarProposta();
    setModalNovoAberto(false);
  };

  // Meses disponíveis nos orçamentos (YYYY-MM)
  const mesesDisponiveis = useMemo(() => {
    const mapMeses = new Map<string, string>();
    orcamentos.forEach((o) => {
      const ref = o.status === 'faturado' && o.faturadoEm ? o.faturadoEm : (o.emitidaEm || o.criadoEm);
      if (!ref) return;
      const d = parseDataLocalSegura(ref);
      const ym = obterYmLocal(d);
      if (!mapMeses.has(ym)) {
        const label = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        mapMeses.set(ym, label.charAt(0).toUpperCase() + label.slice(1));
      }
    });
    return Array.from(mapMeses.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [orcamentos]);

  // Clientes para filtro
  const clientesFiltro = useMemo(() => {
    const mapa = new Map<string, string>();
    clientes.forEach((c) => {
      mapa.set(c.id, c.nomeFantasia || c.razaoSocial);
    });
    orcamentos.forEach((o) => {
      if (o.clienteId && !mapa.has(o.clienteId) && o.clienteNome) {
        mapa.set(o.clienteId, o.clienteNome);
      }
    });
    return Array.from(mapa.entries()).sort((a, b) => a[1].localeCompare(b[1], 'pt-BR'));
  }, [clientes, orcamentos]);

  // Filter orcamentos by search query, month, and client
  const orcamentosFiltrados = useMemo(() => {
    const b = busca.trim().toLowerCase();
    return orcamentos.filter((o) => {
      if (filtroClienteId && o.clienteId !== filtroClienteId) {
        return false;
      }
      if (filtroMes) {
        const ref = o.status === 'faturado' && o.faturadoEm ? o.faturadoEm : (o.emitidaEm || o.criadoEm);
        const ym = ref ? obterYmLocal(parseDataLocalSegura(ref)) : '';
        if (ym !== filtroMes) return false;
      }
      if (b) {
        return (
          (o.servico && o.servico.toLowerCase().includes(b)) ||
          (o.codigoProposta && o.codigoProposta.toLowerCase().includes(b)) ||
          (o.clienteNome && o.clienteNome.toLowerCase().includes(b)) ||
          (o.descricaoEscopo && o.descricaoEscopo.toLowerCase().includes(b))
        );
      }
      return true;
    });
  }, [orcamentos, busca, filtroMes, filtroClienteId]);

  // Categorize orcamentos into 5 columns: Novos, Enviados, Aprovados, Recusados, Faturado
  const colNovos = orcamentosFiltrados.filter(o => o.status === 'rascunho' || !o.status);
  const colEnviados = orcamentosFiltrados.filter(o => o.status === 'enviado');
  const colAprovados = orcamentosFiltrados.filter(o => o.status === 'aprovado');
  const colRecusados = orcamentosFiltrados.filter(o => o.status === 'recusado');
  const colFaturados = orcamentosFiltrados.filter(o => o.status === 'faturado');

  const handleIniciarEdicaoTitulo = (orcamento: Orcamento, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditandoTituloId(orcamento.id);
    setTituloEditado(orcamento.servico || '');
  };

  const handleSalvarTitulo = (orcamento: Orcamento, e?: React.MouseEvent | React.FormEvent) => {
    if (e) e.stopPropagation();
    const novoTitulo = tituloEditado.trim();
    if (!novoTitulo) {
      setEditandoTituloId(null);
      return;
    }

    const tituloAnterior = orcamento.servico || '';
    const novoSubtituloCapa = obterTituloLaudoProposta({ ...orcamento, servico: novoTitulo });
    const novasSecoes = orcamento.secoes?.map((s) =>
      s.id === 'capa' || s.numero === 1 ? { ...s, subtitulo: novoSubtituloCapa } : s
    );

    const novosItens =
      orcamento.itensCalculo &&
      orcamento.itensCalculo.length === 1 &&
      (!orcamento.itensCalculo[0].descricao || orcamento.itensCalculo[0].descricao === tituloAnterior)
        ? [{ ...orcamento.itensCalculo[0], descricao: novoTitulo }]
        : orcamento.itensCalculo;

    atualizarOrcamento(orcamento.id, {
      servico: novoTitulo,
      ...(novasSecoes ? { secoes: novasSecoes } : {}),
      ...(novosItens ? { itensCalculo: novosItens } : {}),
    });

    setEditandoTituloId(null);
  };

  const renderOrcamentoCard = (orcamento: Orcamento) => {
    const cliente = clientes.find(c => c.id === orcamento.clienteId);
    const valorFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orcamento.valor || 0);
    const estaEditandoTitulo = editandoTituloId === orcamento.id;

    return (
      <div 
        key={orcamento.id}
        className={`bg-[var(--card)] border border-[var(--line)] rounded-xl p-3.5 space-y-2.5 shadow-xs hover:border-[var(--blue)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-sm motion-reduce:transition-none cursor-pointer group min-w-0 overflow-hidden ${
          cardsAnimados.has(orcamento.id)
            ? 'animate-in fade-in slide-in-from-bottom-2 duration-500 ring-2 ring-[#1565D8]/30'
            : ''
        }`}
        onClick={() => {
          if (!estaEditandoTitulo) {
            setPropostaModalOrcamento(orcamento);
          }
        }}
      >
        <div className="flex items-start justify-between gap-2 min-w-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1.5 mb-1">
              <span className="inline-block px-2 py-0.5 rounded text-[10.5px] font-mono font-bold bg-[#1565D8]/10 text-[#1565D8] border border-[#1565D8]/20">
                {orcamento.codigoProposta || orcamento.id}
              </span>
              {!estaEditandoTitulo && (
                <button
                  type="button"
                  onClick={(e) => handleIniciarEdicaoTitulo(orcamento, e)}
                  className="p-1 rounded-md text-[var(--muted)] hover:text-[#1565D8] hover:bg-[#1565D8]/10 transition-colors cursor-pointer shrink-0"
                  title="Editar título deste orçamento"
                >
                  <Edit className="w-3 h-3" />
                </button>
              )}
            </div>

            {estaEditandoTitulo ? (
              <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={tituloEditado}
                  onChange={(e) => setTituloEditado(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSalvarTitulo(orcamento);
                    } else if (e.key === 'Escape') {
                      setEditandoTituloId(null);
                    }
                  }}
                  autoFocus
                  placeholder="Título do orçamento..."
                  className="w-full px-2 py-1 text-[13px] font-semibold border border-[#1565D8] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none"
                />
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditandoTituloId(null);
                    }}
                    className="px-2 py-0.5 rounded text-[11px] font-semibold text-[var(--muted)] hover:bg-[var(--line)]/40 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleSalvarTitulo(orcamento, e)}
                    className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#1565D8] text-white hover:bg-[#0b4fb8] flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    <span>Salvar</span>
                  </button>
                </div>
              </div>
            ) : (
              <b className="font-[family-name:var(--d)] font-bold text-[14px] text-[var(--ink)] block leading-snug break-words">
                {orcamento.servico || 'Proposta Técnica'}
              </b>
            )}
          </div>
        </div>

        <div className="text-[12.5px] text-[var(--muted)] flex items-center justify-between gap-2 min-w-0">
          <span className="truncate">{cliente?.nomeFantasia || cliente?.razaoSocial || orcamento.clienteNome || 'Cliente'}</span>
          {orcamento.normasTecnicas && (
            <span className="text-[10px] font-mono text-[var(--muted)] truncate max-w-[95px] shrink-0" title={orcamento.normasTecnicas}>
              {orcamento.normasTecnicas.split('·')[0].trim()}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-1.5 border-t border-[var(--line)] text-[13.5px] gap-2">
          <span className="font-black font-[family-name:var(--d)] text-[var(--blue)] tabular-nums">
            {valorFormatado}
          </span>
          <span className="text-[11px] text-[var(--muted)] font-mono tabular-nums">
            {formatarDataBrSegura(
              orcamento.status === 'faturado' && orcamento.faturadoEm
                ? orcamento.faturadoEm
                : (orcamento.emitidaEm || orcamento.criadoEm)
            )}
          </span>
        </div>

        {orcamento.status === 'faturado' && (orcamento.dataInicioServico || orcamento.dataEntregaServico || orcamento.comprovantePagamentoUrl) && (
          <div className="flex flex-wrap items-center justify-between gap-1 text-[10.5px] text-[var(--muted)]">
            {(orcamento.dataInicioServico || orcamento.dataEntregaServico) && (
              <span className="font-mono">
                {orcamento.dataInicioServico ? formatarDataBrSegura(orcamento.dataInicioServico) : '—'} → {orcamento.dataEntregaServico ? formatarDataBrSegura(orcamento.dataEntregaServico) : '—'}
              </span>
            )}
            {orcamento.comprovantePagamentoUrl && (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Receipt className="w-3 h-3" />
                <span>Comprovante</span>
              </span>
            )}
          </div>
        )}

        {/* Quick actions + Contained status selector */}
        <div className="pt-1.5 space-y-2" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between gap-1">
            <button
              type="button"
              onClick={() => setPropostaModalOrcamento(orcamento)}
              className="p-1.5 rounded-lg text-[#1565D8] hover:bg-[#1565D8]/10 transition-colors cursor-pointer"
              title="Visualizar Proposta e Baixar PDF A4"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => navigate(`/admin/orcamentos/${orcamento.id}/imprimir`)}
              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
              title="Abrir Visualização A4 / Exportar PDF"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => abrirGeradorExistente(orcamento)}
              className="p-1.5 rounded-lg text-[#1565D8] hover:bg-[#1565D8]/10 transition-colors cursor-pointer"
              title="Abrir Gerador de Proposta para editar este orçamento"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => navigate(`/admin/orcamentos/${orcamento.id}`)}
              className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50 transition-colors cursor-pointer"
              title="Editar proposta no editor rico"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setOrcamentoParaExcluir(orcamento)}
              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50/30 transition-colors cursor-pointer"
              title="Excluir este orçamento definitivamente"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <select
            value={orcamento.status || 'rascunho'}
            onChange={(e) => {
              const novoStatus = e.target.value as Orcamento['status'];
              if (novoStatus === 'faturado' && orcamento.status !== 'faturado') {
                setOrcamentoParaFaturar(orcamento);
                return;
              }
              alterarStatusComAnimacao(orcamento.id, novoStatus);
            }}
            className="w-full min-w-0 max-w-full text-[11.5px] py-1.5 px-2 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] font-semibold cursor-pointer focus:outline-none focus:border-[var(--blue)] transition-colors duration-300 motion-reduce:transition-none"
          >
            <option value="rascunho">Novo / Rascunho</option>
            <option value="enviado">Enviado</option>
            <option value="aprovado">Aprovado</option>
            <option value="recusado">Recusado</option>
            <option value="faturado">Faturado</option>
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-[1240px]">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight">
            Orçamentos & Propostas Comerciais
          </h1>
          <p className="text-[var(--muted)] text-[14.5px] sm:text-[15.5px] mt-0.5">
            Histórico de aprovações e emissões de orçamentos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={abrirGeradorNovo}
            className="btn-tech pri text-[14px] px-4 py-2 shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nova proposta comercial</span>
          </button>
        </div>
      </div>

      {/* Search & Filters (Mês, Cliente) */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="w-4 h-4 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por proposta, cliente ou serviço..."
            className="w-full pl-9 pr-3 py-2 text-[14px] border border-[var(--line)] rounded-xl bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)] shadow-2xs"
          />
        </div>

        <select
          value={filtroMes}
          onChange={(e) => setFiltroMes(e.target.value)}
          aria-label="Filtrar por mês"
          className="py-2 px-3 text-[13.5px] border border-[var(--line)] rounded-xl bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)] cursor-pointer"
        >
          <option value="">Todos os meses</option>
          {mesesDisponiveis.map(([ym, label]) => (
            <option key={ym} value={ym}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={filtroClienteId}
          onChange={(e) => setFiltroClienteId(e.target.value)}
          aria-label="Filtrar por cliente"
          className="py-2 px-3 text-[13.5px] border border-[var(--line)] rounded-xl bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)] cursor-pointer max-w-[240px]"
        >
          <option value="">Todos os clientes</option>
          {clientesFiltro.map(([id, nome]) => (
            <option key={id} value={id}>
              {nome}
            </option>
          ))}
        </select>

        {(busca || filtroMes || filtroClienteId) && (
          <button
            type="button"
            onClick={() => {
              setBusca('');
              setFiltroMes('');
              setFiltroClienteId('');
            }}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--card)] cursor-pointer"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* 5-column Kanban Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-start">
        
        {/* Coluna 1: Novos */}
        <div className="bg-[var(--paper)] border border-[var(--line)] rounded-xl p-3.5 space-y-3 min-w-0">
          <div className="flex items-center justify-between pb-1 border-b border-[var(--line)]">
            <h3 className="font-[family-name:var(--d)] font-bold text-[15px] text-[var(--ink)]">
              Novos
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--card)] border border-[var(--line)] text-[var(--muted)] tabular-nums">
              {colNovos.length}
            </span>
          </div>

          <div className="space-y-2.5 min-h-[140px]">
            {colNovos.map(renderOrcamentoCard)}
            {colNovos.length === 0 && (
              <p className="text-[var(--muted)] text-xs text-center py-8">Nenhum orçamento novo.</p>
            )}
          </div>
        </div>

        {/* Coluna 2: Enviados */}
        <div className="bg-[var(--paper)] border border-[var(--line)] rounded-xl p-3.5 space-y-3 min-w-0">
          <div className="flex items-center justify-between pb-1 border-b border-[var(--line)]">
            <h3 className="font-[family-name:var(--d)] font-bold text-[15px] text-[var(--ink)]">
              Enviados
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--card)] border border-[var(--line)] text-[var(--muted)] tabular-nums">
              {colEnviados.length}
            </span>
          </div>

          <div className="space-y-2.5 min-h-[140px]">
            {colEnviados.map(renderOrcamentoCard)}
            {colEnviados.length === 0 && (
              <p className="text-[var(--muted)] text-xs text-center py-8">Nenhuma proposta enviada.</p>
            )}
          </div>
        </div>

        {/* Coluna 3: Aprovados */}
        <div className="bg-[var(--paper)] border border-[var(--line)] rounded-xl p-3.5 space-y-3 min-w-0">
          <div className="flex items-center justify-between pb-1 border-b border-[var(--line)]">
            <h3 className="font-[family-name:var(--d)] font-bold text-[15px] text-emerald-600 dark:text-emerald-400">
              Aprovados
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--card)] border border-[var(--line)] text-emerald-600 dark:text-emerald-400 font-bold tabular-nums">
              {colAprovados.length}
            </span>
          </div>

          <div className="space-y-2.5 min-h-[140px]">
            {colAprovados.map(renderOrcamentoCard)}
            {colAprovados.length === 0 && (
              <p className="text-[var(--muted)] text-xs text-center py-8">Nenhum orçamento aprovado ainda.</p>
            )}
          </div>
        </div>

        {/* Coluna 4: Recusados */}
        <div className="bg-[var(--paper)] border border-[var(--line)] rounded-xl p-3.5 space-y-3 min-w-0">
          <div className="flex items-center justify-between pb-1 border-b border-[var(--line)]">
            <h3 className="font-[family-name:var(--d)] font-bold text-[15px] text-[var(--muted)]">
              Recusados
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--card)] border border-[var(--line)] text-[var(--muted)] tabular-nums">
              {colRecusados.length}
            </span>
          </div>

          <div className="space-y-2.5 min-h-[140px]">
            {colRecusados.map(renderOrcamentoCard)}
            {colRecusados.length === 0 && (
              <p className="text-[var(--muted)] text-xs text-center py-8">Nada por aqui.</p>
            )}
          </div>
        </div>

        {/* Coluna 5: Faturado */}
        <div className="bg-[var(--paper)] border border-[var(--line)] rounded-xl p-3.5 space-y-3 min-w-0">
          <div className="flex items-center justify-between pb-1 border-b border-[var(--line)]">
            <h3 className="font-[family-name:var(--d)] font-bold text-[15px] text-sky-600 dark:text-sky-400">
              Faturado
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--card)] border border-[var(--line)] text-sky-600 dark:text-sky-400 font-bold tabular-nums">
              {colFaturados.length}
            </span>
          </div>

          <div className="space-y-2.5 min-h-[140px]">
            {colFaturados.map(renderOrcamentoCard)}
            {colFaturados.length === 0 && (
              <p className="text-[var(--muted)] text-xs text-center py-8">Nenhum orçamento faturado ainda.</p>
            )}
          </div>
        </div>

      </div>

      {/* Modal Nova Proposta Comercial Rica (Completa com 13 Seções) */}
      {modalNovoAberto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[rgba(5,14,28,0.75)] backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[var(--card)] text-[var(--ink)] border-[1.5px] border-[var(--line)] rounded-2xl w-full max-w-2xl p-6 space-y-5 shadow-2xl my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[var(--line)]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#1565D8]/10 text-[#1565D8] border border-[#1565D8]/20">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-[19px] font-bold text-[var(--ink)]">
                    Gerador de Proposta Técnico-Comercial
                    {orcamentoEditando && (
                      <span className="ml-2 text-xs font-semibold text-[#1565D8]">
                        · Editando {orcamentoEditando.codigoProposta || orcamentoEditando.id}
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-[var(--muted)]">
                    Preencha forma de pagamento, metodologia, informações operacionais e NFS-e. A proposta é gerada a partir de um texto único padronizado.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalNovoAberto(false)}
                className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCriarEVisualizarPdf} className="space-y-4">
              
              {/* Row 1: Cliente & Categoria de Serviço */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <label className="block text-xs font-bold text-[var(--ink)]">
                  <span className="mb-1 block">Cliente Contratante</span>
                  <ComboboxSelect
                    value={clienteId}
                    options={opcoesClientes}
                    onChange={setClienteId}
                    placeholder="Digite para buscar o cliente..."
                    emptyMessage="Nenhum cliente encontrado."
                    ariaLabel="Cliente Contratante"
                  />
                </label>

                <label className="block text-xs font-bold text-[var(--ink)]">
                  <span className="mb-1 block">Catálogo Oficial de Serviços</span>
                  <ComboboxSelect
                    value={servicoCategoriaId}
                    options={opcoesServicos}
                    onChange={handleSelectCategoria}
                    placeholder="Digite para buscar o serviço..."
                    emptyMessage="Nenhum serviço encontrado."
                    ariaLabel="Catálogo Oficial de Serviços"
                  />
                </label>
              </div>

              {/* Bloco Automático: CNPJ/CPF e Principal Contato vinculados ao Cliente */}
              <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-[var(--blue)] flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5" />
                    <span>Dados do Contratante (Preenchimento Automático)</span>
                  </span>
                  <span className="text-[11px] text-[var(--muted)]">Vinculado ao cadastro do cliente</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block text-xs font-semibold text-[var(--ink)]">
                    <span className="mb-1 block text-[11px] text-[var(--muted)]">CNPJ / CPF na Proposta</span>
                    <input
                      type="text"
                      value={cnpjCliente}
                      onChange={(e) => setCnpjCliente(e.target.value)}
                      placeholder="Preenchido automaticamente do cliente..."
                      className="w-full p-2 text-xs font-mono font-bold border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                    />
                  </label>

                  <label className="block text-xs font-semibold text-[var(--ink)]">
                    <span className="mb-1 block text-[11px] text-[var(--muted)]">Principal Contato / Representante</span>
                    <input
                      type="text"
                      value={representanteNome}
                      onChange={(e) => setRepresentanteNome(e.target.value)}
                      placeholder="Nome do responsável técnico ou contratante..."
                      className="w-full p-2 text-xs border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                    />
                  </label>
                </div>
              </div>

              {/* Subtipo do Serviço Selecionado (se houver) */}
              {servicoCategoriaId !== 'personalizado' && (() => {
                const item = servicosCatalogo.find(s => s.id === servicoCategoriaId);
                if (!item || !item.subtipos || item.subtipos.length === 0) return null;
                const opcoesSubtipos: ComboboxOption[] = item.subtipos.map(st => ({
                  value: st.id || st.nome,
                  label: st.nome,
                  description: st.normaRef,
                }));
                return (
                  <label className="block text-xs font-bold text-[var(--ink)]">
                    <span className="mb-1 block">Especificação do Subtipo / Laudo</span>
                    <ComboboxSelect
                      value={subtipoSelecionadoId}
                      options={opcoesSubtipos}
                      onChange={handleSelectSubtipo}
                      placeholder="Digite para buscar a especificação..."
                      emptyMessage="Nenhuma especificação encontrada."
                      ariaLabel="Especificação do Subtipo / Laudo"
                    />
                  </label>
                );
              })()}

              {/* Título do Serviço / Objeto */}
              <label className="block text-xs font-bold text-[var(--ink)]">
                <span className="mb-1 block">Título da Proposta Técnica</span>
                <input
                  type="text"
                  value={servicoTitulo}
                  onChange={(e) => setServicoTitulo(e.target.value)}
                  required
                  placeholder="Ex: Laudo Técnico de Conformidade NR-12 · Prensa Mecânica"
                  className="w-full p-2.5 text-sm border border-[var(--line)] rounded-xl bg-[var(--paper)] text-[var(--ink)]"
                />
              </label>

              {/* Normas Técnicas & Escopo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <label className="block text-xs font-bold text-[var(--ink)]">
                  <span className="mb-1 block">Normas Técnicas Aplicáveis</span>
                  <input
                    type="text"
                    value={normasTecnicas}
                    onChange={(e) => setNormasTecnicas(e.target.value)}
                    required
                    placeholder="Ex: NR-12, ABNT NBR ISO 12100, NBR ISO 13849"
                    className="w-full p-2.5 text-sm border border-[var(--line)] rounded-xl bg-[var(--paper)] text-[var(--ink)]"
                  />
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-xs font-bold text-[var(--ink)]">
                    <span className="mb-1 block">Prazo de entrega</span>
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="1"
                        value={prazoDias}
                        onChange={(e) => setPrazoDias(parseInt(e.target.value) || 7)}
                        className="w-full p-2.5 text-sm border border-[var(--line)] rounded-l-xl bg-[var(--paper)] text-[var(--ink)]"
                      />
                      <span className="px-2.5 py-2.5 border border-l-0 border-[var(--line)] bg-[var(--card)] text-xs text-[var(--muted)] rounded-r-xl">
                        dias
                      </span>
                    </div>
                  </label>

                  <label className="block text-xs font-bold text-[var(--ink)]">
                    <span className="mb-1 block">Validade</span>
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="1"
                        value={validadeDias}
                        onChange={(e) => setValidadeDias(parseInt(e.target.value) || 15)}
                        className="w-full p-2.5 text-sm border border-[var(--line)] rounded-l-xl bg-[var(--paper)] text-[var(--ink)]"
                      />
                      <span className="px-2.5 py-2.5 border border-l-0 border-[var(--line)] bg-[var(--card)] text-xs text-[var(--muted)] rounded-r-xl">
                        dias
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Descrição do Escopo */}
              <label className="block text-xs font-bold text-[var(--ink)]">
                <span className="mb-1 block">Resumo do Escopo das Atividades</span>
                <textarea
                  rows={2}
                  value={descricaoEscopo}
                  onChange={(e) => setDescricaoEscopo(e.target.value)}
                  className="w-full p-2.5 text-xs sm:text-sm border border-[var(--line)] rounded-xl bg-[var(--paper)] text-[var(--ink)] resize-none"
                  placeholder="Detalhamento das fases técnicas da vistoria..."
                />
              </label>

              {/* Valor & Condições de Pagamento */}
              <div className="space-y-3.5">
                <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)] space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold uppercase tracking-wider text-[var(--blue)] text-xs">Modelo de Precificação</span>
                    <div className="flex items-center gap-1 bg-[var(--card)] border border-[var(--line)] rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => setModoPrecificacao('simples')}
                        className={`px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${modoPrecificacao === 'simples' ? 'bg-[#1565D8] text-white' : 'text-[var(--muted)] hover:text-[var(--ink)]'}`}
                      >
                        Valor único
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setModoPrecificacao('opcoes');
                          setOpcoesValores((prev) => prev.length > 0 ? prev : [criarOpcaoValorPadrao(0), criarOpcaoValorPadrao(1)]);
                        }}
                        className={`px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${modoPrecificacao === 'opcoes' ? 'bg-[#1565D8] text-white' : 'text-[var(--muted)] hover:text-[var(--ink)]'}`}
                      >
                        Cenários / opções
                      </button>
                    </div>
                  </div>

                  {modoPrecificacao === 'simples' ? (
                    <label className="block text-xs font-bold text-[var(--ink)]">
                      <span className="mb-1 block">Investimento Total (R$)</span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--muted)]">R$</span>
                        <input
                          type="number"
                          step="50"
                          value={valorTotal}
                          onChange={(e) => setValorTotal(e.target.value)}
                          required
                          placeholder="3500"
                          className="w-full pl-9 pr-3 py-2.5 text-sm font-bold border border-[var(--line)] rounded-xl bg-[var(--card)] text-[var(--ink)]"
                        />
                      </div>
                    </label>
                  ) : (
                    <div className="space-y-2.5">
                      <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                        Cadastre cenários comerciais (ex.: inspeção concentrada / fracionada) e, dentro de cada cenário, as configurações de valor (ex.: 1 ART por lote / ART individual por veículo).
                      </p>
                      {opcoesValores.map((opcao, opIdx) => (
                        <div key={opcao.id} className="rounded-xl border border-[var(--line)] bg-[var(--card)] overflow-hidden">
                          <div className="px-3 py-2 border-b border-[var(--line)] bg-[var(--paper)] flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#0B1E3D] text-white text-[10px] font-bold shrink-0">{opIdx + 1}</span>
                            <input
                              type="text"
                              value={opcao.nome}
                              onChange={(e) => setOpcoesValores((prev) => prev.map((op) => op.id === opcao.id ? { ...op, nome: e.target.value } : op))}
                              placeholder={`Opção ${opIdx + 1}`}
                              className="flex-1 min-w-0 p-1.5 text-xs font-bold border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)]"
                            />
                            <button
                              type="button"
                              onClick={() => setOpcoesValores((prev) => prev.filter((op) => op.id !== opcao.id))}
                              className="p-1.5 rounded-md text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                              title="Remover cenário"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="p-2.5 space-y-2">
                            <input
                              type="text"
                              value={opcao.descricao || ''}
                              onChange={(e) => setOpcoesValores((prev) => prev.map((op) => op.id === opcao.id ? { ...op, descricao: e.target.value } : op))}
                              placeholder="Descrição do cenário (opcional)"
                              className="w-full p-1.5 text-[11px] border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
                            />
                            <div className="space-y-1.5">
                              {(opcao.itens || []).map((item, itemIdx) => (
                                <div key={item.id} className="grid grid-cols-[1fr_130px_auto] gap-1.5 items-center">
                                  <input
                                    type="text"
                                    value={item.descricao}
                                    onChange={(e) => setOpcoesValores((prev) => prev.map((op) => op.id === opcao.id ? {
                                      ...op,
                                      itens: op.itens.map((it) => it.id === item.id ? { ...it, descricao: e.target.value } : it),
                                    } : op))}
                                    placeholder="Ex.: Com 1 ART única para o lote"
                                    className="w-full p-1.5 text-[11px] border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
                                  />
                                  <div className="relative">
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[var(--muted)]">R$</span>
                                    <input
                                      type="number"
                                      step="50"
                                      min="0"
                                      value={item.valor || ''}
                                      onChange={(e) => setOpcoesValores((prev) => prev.map((op) => op.id === opcao.id ? {
                                        ...op,
                                        itens: op.itens.map((it) => it.id === item.id ? { ...it, valor: parseFloat(e.target.value) || 0 } : it),
                                      } : op))}
                                      placeholder="0"
                                      className="w-full pl-7 pr-2 py-1.5 text-[11px] font-mono font-bold border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setOpcoesValores((prev) => prev.map((op) => op.id === opcao.id ? { ...op, itens: op.itens.filter((it) => it.id !== item.id) } : op))}
                                    className="p-1.5 rounded-md text-[var(--muted)] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                                    title="Remover configuração"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() => setOpcoesValores((prev) => prev.map((op) => op.id === opcao.id ? { ...op, itens: [...(op.itens || []), criarItemOpcaoValorPadrao(opIdx, (op.itens || []).length)] } : op))}
                              className="text-[11px] font-bold text-[#1565D8] hover:underline cursor-pointer"
                            >
                              + Adicionar configuração
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setOpcoesValores((prev) => [...prev, criarOpcaoValorPadrao(prev.length)])}
                          className="px-3 py-1.5 rounded-lg border border-dashed border-[#1565D8]/40 text-[#1565D8] text-[11px] font-bold hover:bg-[#1565D8]/5 cursor-pointer"
                        >
                          + Adicionar cenário
                        </button>
                        <div className="text-[11px] text-[var(--muted)]">
                          Valor de referência: <strong className="text-[var(--ink)] font-mono">{(obterMenorValorOpcoes(opcoesValores) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <label className="block text-xs font-bold text-[var(--ink)]">
                    <span className="mb-1 block">Forma de Pagamento</span>
                    <select
                      value={formaPagamento}
                      onChange={(e) => aplicarFormaPagamento(e.target.value as FormaPagamentoId)}
                      className="w-full p-2.5 text-xs border border-[var(--line)] rounded-xl bg-[var(--paper)] text-[var(--ink)]"
                    >
                      {FORMAS_PAGAMENTO.map(opcao => (
                        <option key={opcao.id} value={opcao.id}>{opcao.label}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block text-xs font-bold text-[var(--ink)]">
                    <span className="mb-1 block">{modoPrecificacao === 'opcoes' ? 'Valor referência (menor opção)' : 'Resumo'}</span>
                    <div className="w-full p-2.5 text-xs border border-[var(--line)] rounded-xl bg-[var(--paper)] text-[var(--ink)] font-mono font-bold">
                      {(modoPrecificacao === 'opcoes' ? (obterMenorValorOpcoes(opcoesValores) || parseFloat(valorTotal) || 0) : (parseFloat(valorTotal) || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                  </label>

                  <label className="block text-xs font-bold text-[var(--ink)] sm:col-span-2">
                    <span className="mb-1 block">Condições de Pagamento & PIX</span>
                    <input
                      type="text"
                      value={condicoesPagamento}
                      onChange={(e) => setCondicoesPagamento(e.target.value)}
                      className="w-full p-2.5 text-xs border border-[var(--line)] rounded-xl bg-[var(--paper)] text-[var(--ink)]"
                    />
                  </label>
                </div>
              </div>

              {/* Metodologia, Informações Operacionais e NFS-e */}
              <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)] space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold uppercase tracking-wider text-[var(--blue)] text-xs">
                    Metodologia & Informações Técnicas Operacionais
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAtivosInspecionados(A_COMBINAR_COM_CLIENTE);
                      setHorasTecnicas(A_COMBINAR_COM_CLIENTE);
                      setMobilizacao(A_COMBINAR_COM_CLIENTE);
                    }}
                    className="text-[11px] font-semibold text-[#1565D8] hover:underline cursor-pointer"
                  >
                    Usar “{A_COMBINAR_COM_CLIENTE}” nos três campos
                  </button>
                </div>

                <label className="flex items-start gap-2.5 text-xs font-semibold text-[var(--ink)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={metodologiaEmEtapas}
                    onChange={(e) => setMetodologiaEmEtapas(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-[#1565D8]"
                  />
                  <span>
                    Metodologia de engenharia em etapas
                    <span className="block font-normal text-[var(--muted)]">
                      Selecionada por padrão · 5 fases com inspeção, checklists normativos, ensaios, análise de risco e laudo com ART.
                    </span>
                  </span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="block text-xs font-bold text-[var(--ink)]">
                    <span className="mb-1 block">Ativos inspecionados</span>
                    <input
                      type="text"
                      list="opcoes-texto-operacional"
                      value={ativosInspecionados}
                      onChange={(e) => setAtivosInspecionados(e.target.value)}
                      placeholder={TEXTO_OPERACIONAL_PADRAO.ativosInspecionados}
                      className="w-full p-2 text-xs border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)]"
                    />
                  </label>
                  <label className="block text-xs font-bold text-[var(--ink)]">
                    <span className="mb-1 block">Horas técnicas</span>
                    <input
                      type="text"
                      list="opcoes-texto-operacional"
                      value={horasTecnicas}
                      onChange={(e) => setHorasTecnicas(e.target.value)}
                      placeholder={TEXTO_OPERACIONAL_PADRAO.horasTecnicas}
                      className="w-full p-2 text-xs border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)]"
                    />
                  </label>
                  <label className="block text-xs font-bold text-[var(--ink)]">
                    <span className="mb-1 block">Mobilização</span>
                    <input
                      type="text"
                      list="opcoes-texto-operacional"
                      value={mobilizacao}
                      onChange={(e) => setMobilizacao(e.target.value)}
                      placeholder={TEXTO_OPERACIONAL_PADRAO.mobilizacao}
                      className="w-full p-2 text-xs border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)]"
                    />
                  </label>
                </div>
                <datalist id="opcoes-texto-operacional">
                  {OPCOES_TEXTO_OPERACIONAL.map(opcao => (
                    <option key={opcao} value={opcao} />
                  ))}
                </datalist>

                <label className="block text-xs font-bold text-[var(--ink)]">
                  <span className="mb-1 block">Nota Fiscal (NFS-e)</span>
                  <select
                    value={incluiNotaFiscal ? 'com' : 'sem'}
                    onChange={(e) => setIncluiNotaFiscal(e.target.value === 'com')}
                    className="w-full p-2.5 text-xs border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)]"
                  >
                    <option value="com">Com Nota Fiscal (NFS-e)</option>
                    <option value="sem">Sem Nota Fiscal (NFS-e)</option>
                  </select>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalNovoAberto(false)}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
                >
                  Cancelar
                </button>

                <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCriarPropostaApenas}
                    className="w-full sm:w-auto px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--card)] hover:bg-[var(--line)]/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="Salva a proposta sem abrir o visualizador"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{orcamentoEditando ? 'Salvar alterações' : 'Salvar apenas'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCriarEAbrirEditor}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl border border-[var(--line)] bg-[var(--card)] hover:bg-[var(--line)]/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="Salvar e editar as seções no editor rico"
                  >
                    <Edit className="w-3.5 h-3.5 text-[#1565D8]" />
                    <span>Editar seções</span>
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0B1E3D] hover:bg-[#1565D8] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    title="Gera a proposta e abre diretamente o visualizador e exportador de PDF"
                  >
                    <Eye className="w-4 h-4 text-[#D4AF37]" />
                    <span>{orcamentoEditando ? 'Salvar e Ver PDF' : 'Gerar e Ver PDF'}</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmação de Exclusão de Orçamento */}
      {orcamentoParaExcluir && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(5,14,28,0.7)] backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[var(--card)] text-[var(--ink)] border-[1.5px] border-[var(--line)] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-[18px] font-bold text-[var(--ink)]">Excluir Orçamento</h2>
                  <p className="text-xs text-[var(--muted)]">Confirmação de exclusão</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOrcamentoParaExcluir(null)}
                className="p-1 rounded text-[var(--muted)] hover:text-[var(--ink)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <p className="text-[var(--ink)]">
                Tem certeza de que deseja excluir permanentemente este orçamento?
              </p>

              <div className="p-3 rounded-lg bg-[var(--paper)] border border-[var(--line)] space-y-1 text-xs">
                <div><strong>Código:</strong> <span className="font-mono">{orcamentoParaExcluir.codigoProposta || orcamentoParaExcluir.id}</span></div>
                <div><strong>Serviço:</strong> {orcamentoParaExcluir.servico}</div>
                <div><strong>Cliente:</strong> {clientes.find(c => c.id === orcamentoParaExcluir.clienteId)?.nomeFantasia || orcamentoParaExcluir.clienteNome || 'Cliente'}</div>
                <div><strong>Valor:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orcamentoParaExcluir.valor || 0)}</div>
                <div><strong>Status:</strong> {orcamentoParaExcluir.status || 'rascunho'}</div>
              </div>

              <p className="text-xs text-rose-500 font-medium">
                Esta ação removerá este orçamento do banco de dados e do painel técnico permanentemente.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={() => setOrcamentoParaExcluir(null)}
                className="btn-tech text-sm px-4 py-2"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  removerOrcamento(orcamentoParaExcluir.id);
                  setOrcamentoParaExcluir(null);
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-colors cursor-pointer shadow-xs"
              >
                Sim, excluir orçamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proposta Viewer Modal (Multi-page PDF export & preview) */}
      {propostaModalOrcamento && (
        <PropostaViewerModal
          isOpen={true}
          orcamento={orcamentos.find(o => o.id === propostaModalOrcamento.id) || propostaModalOrcamento}
          onClose={() => setPropostaModalOrcamento(null)}
          onStatusChange={(id, novoStatus) => {
            if (novoStatus === 'faturado') {
              const alvo = orcamentos.find(o => o.id === id) || propostaModalOrcamento;
              if (alvo && alvo.status !== 'faturado') {
                setOrcamentoParaFaturar(alvo);
                return;
              }
            }
            alterarStatusComAnimacao(id, novoStatus);
          }}
          onEditarProposta={(orc) => {
            setPropostaModalOrcamento(null);
            navigate(`/admin/orcamentos/${orc.id}`);
          }}
        />
      )}

      {/* Modal de Registro de Faturamento (Data + Início/Entrega + Comprovante Opcional) */}
      {orcamentoParaFaturar && (
        <FaturarOrcamentoModal
          orcamento={orcamentoParaFaturar}
          onClose={() => setOrcamentoParaFaturar(null)}
          onConfirm={(dados) => {
            atualizarStatusOrcamento(orcamentoParaFaturar.id, 'faturado', dados);
            animarCardOrcamento(orcamentoParaFaturar.id);
            setOrcamentoParaFaturar(null);
          }}
        />
      )}

    </div>
  );
};
