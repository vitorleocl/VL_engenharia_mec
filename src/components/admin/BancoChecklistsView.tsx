import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  MinusCircle, 
  ShieldAlert, 
  Ruler, 
  FileText, 
  Camera, 
  Sparkles, 
  Flame, 
  Truck, 
  Car, 
  Wind, 
  Smile, 
  Hammer, 
  Anchor, 
  Boxes, 
  SearchCheck, 
  Zap, 
  Accessibility, 
  ChevronRight, 
  ChevronDown, 
  ClipboardList, 
  Check, 
  Layers, 
  Clock, 
  Download,
  AlertOctagon,
  HelpCircle,
  Eye,
  Info
} from 'lucide-react';
import { 
  BANCO_MESTRE_12_CATEGORIAS, 
  obterEstatisticasBancoMestre, 
  calcularConclusaoAutomatica,
  buscarItensNoBancoMestre 
} from '../../data/bancoChecklists';
import { 
  CategoriaMestreDef, 
  SubcategoriaMestreDef, 
  TipoLaudoMestreDef, 
  ItemInspecaoMestre, 
  ResultadoInspecaoMestre,
  CriticidadeInspecao,
  TipoEvidenciaMestre
} from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export const BancoChecklistsView: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Estados de navegação e seleção
  const [categoriaAtivaId, setCategoriaAtivaId] = useState<string>(BANCO_MESTRE_12_CATEGORIAS[0].id);
  const [subcategoriaAtivaId, setSubcategoriaAtivaId] = useState<string>('');
  const [tipoLaudoAtivoId, setTipoLaudoAtivoId] = useState<string>('');
  const [tipoAtivoFiltro, setTipoAtivoFiltro] = useState<string>('todos');

  // Filtros de busca
  const [termoBusca, setTermoBusca] = useState<string>('');
  const [filtroCriticidade, setFiltroCriticidade] = useState<string>('todas');
  const [filtroTipoAvaliacao, setFiltroTipoAvaliacao] = useState<string>('todos');

  // Modal de Detalhes do Item
  const [itemSelecionado, setItemSelecionado] = useState<ItemInspecaoMestre | null>(null);

  // Estado local para simulação em tempo real dos itens de inspeção
  const [simulacaoItens, setSimulacaoItens] = useState<Record<string, ItemInspecaoMestre>>({});

  // Categoria atual
  const categoriaAtiva = useMemo(() => {
    return BANCO_MESTRE_12_CATEGORIAS.find(c => c.id === categoriaAtivaId) || BANCO_MESTRE_12_CATEGORIAS[0];
  }, [categoriaAtivaId]);

  // Subcategoria atual
  const subcategoriaAtiva = useMemo(() => {
    if (subcategoriaAtivaId) {
      return categoriaAtiva.subcategorias.find(s => s.id === subcategoriaAtivaId) || categoriaAtiva.subcategorias[0];
    }
    return categoriaAtiva.subcategorias[0];
  }, [categoriaAtiva, subcategoriaAtivaId]);

  // Tipo de Laudo atual
  const tipoLaudoAtivo = useMemo(() => {
    if (tipoLaudoAtivoId) {
      return subcategoriaAtiva.tiposLaudo.find(tl => tl.id === tipoLaudoAtivoId) || subcategoriaAtiva.tiposLaudo[0];
    }
    return subcategoriaAtiva.tiposLaudo[0];
  }, [subcategoriaAtiva, tipoLaudoAtivoId]);

  // Estatísticas globais do banco
  const statsGlobais = useMemo(() => obterEstatisticasBancoMestre(), []);

  // Lista consolidada de itens para a visualização atual
  const itensAtuais = useMemo(() => {
    if (!tipoLaudoAtivo) return [];

    let itens = tipoLaudoAtivo.itens.map(orig => {
      return simulacaoItens[orig.codigo] ? { ...orig, ...simulacaoItens[orig.codigo] } : orig;
    });

    if (filtroCriticidade !== 'todas') {
      itens = itens.filter(it => (it.detalhesNC?.criticidade || it.criticidadePadrao) === filtroCriticidade);
    }

    if (filtroTipoAvaliacao === 'medicao') {
      itens = itens.filter(it => it.resultado === 'MEDICAO' || it.campoMedicao);
    } else if (filtroTipoAvaliacao === 'visual') {
      itens = itens.filter(it => it.resultado !== 'MEDICAO' && !it.campoMedicao);
    }

    if (termoBusca.trim().length > 0) {
      const q = termoBusca.toLowerCase().trim();
      itens = itens.filter(it => 
        it.codigo.toLowerCase().includes(q) ||
        it.descricao.toLowerCase().includes(q) ||
        it.criterioInspecao.toLowerCase().includes(q) ||
        it.referenciaNormativa.norma.toLowerCase().includes(q) ||
        (it.grupoInspecao && it.grupoInspecao.toLowerCase().includes(q))
      );
    }

    return itens;
  }, [tipoLaudoAtivo, simulacaoItens, filtroCriticidade, filtroTipoAvaliacao, termoBusca]);

  // Cálculo da Conclusão Automática e Regra de Segurança para a seleção atual
  const conclusaoAtual = useMemo(() => {
    return calcularConclusaoAutomatica(itensAtuais);
  }, [itensAtuais]);

  // Atualizar resultado de um item na simulação
  const handleAtualizarResultado = (codigo: string, novoResultado: ResultadoInspecaoMestre) => {
    const itemOrig = tipoLaudoAtivo?.itens.find(i => i.codigo === codigo);
    if (!itemOrig) return;

    const base = simulacaoItens[codigo] || { ...itemOrig };
    const atualizado: ItemInspecaoMestre = {
      ...base,
      resultado: novoResultado
    };

    // Se marcado como Não Conforme, inicializar detalhes de NC caso não existam
    if (novoResultado === 'NAO_CONFORME' && !atualizado.detalhesNC) {
      atualizado.detalhesNC = {
        descricaoNC: `Não conformidade identificada em ${atualizado.descricao}`,
        evidencia: atualizado.evidenciaDocumental || 'Inspeção visual',
        criticidade: atualizado.criticidadePadrao || 'Media',
        riscoAssociado: atualizado.criticidadePadrao === 'Critica' 
          ? 'Risco grave e iminente de acidente estrutural ou operacional.' 
          : 'Comprometimento funcional ou durabilidade reduzida.',
        recomendacao: atualizado.recomendacaoPadrao || 'Proceder com correção técnica e adequação conforme norma aplicável.',
        prazoRecomendado: atualizado.criticidadePadrao === 'Critica' ? 'Imediato (24 horas)' : '15 dias úteis',
        referenciaNormativa: atualizado.referenciaNormativa
      };
    }

    setSimulacaoItens(prev => ({
      ...prev,
      [codigo]: atualizado
    }));
  };

  // Atualizar campo de medição
  const handleAtualizarMedicao = (codigo: string, valor: number | string) => {
    const itemOrig = tipoLaudoAtivo?.itens.find(i => i.codigo === codigo);
    if (!itemOrig) return;

    const base = simulacaoItens[codigo] || { ...itemOrig };
    const campoMedicao = { ...(base.campoMedicao || {}), valorEncontrado: valor };

    setSimulacaoItens(prev => ({
      ...prev,
      [codigo]: {
        ...base,
        campoMedicao
      }
    }));
  };

  // Atualizar criticidade da NC
  const handleAtualizarCriticidadeNC = (codigo: string, novaCriticidade: CriticidadeInspecao) => {
    const base = simulacaoItens[codigo];
    if (!base || !base.detalhesNC) return;

    setSimulacaoItens(prev => ({
      ...prev,
      [codigo]: {
        ...base,
        detalhesNC: {
          ...base.detalhesNC!,
          criticidade: novaCriticidade,
          prazoRecomendado: novaCriticidade === 'Critica' ? 'Imediato (24 horas)' : '15 dias'
        }
      }
    }));
  };

  // Ícone da categoria
  const renderIconeCategoria = (nomeIcone: string, className: string = "w-5 h-5") => {
    switch (nomeIcone) {
      case 'Flame': return <Flame className={className} />;
      case 'ShieldAlert': return <ShieldAlert className={className} />;
      case 'Truck': return <Truck className={className} />;
      case 'Car': return <Car className={className} />;
      case 'Wind': return <Wind className={className} />;
      case 'Smile': return <Smile className={className} />;
      case 'Hammer': return <Hammer className={className} />;
      case 'Anchor': return <Anchor className={className} />;
      case 'Boxes': return <Boxes className={className} />;
      case 'SearchCheck': return <SearchCheck className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Accessibility': return <Accessibility className={className} />;
      default: return <ClipboardList className={className} />;
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 space-y-6 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <Layers className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Banco de Checklists Técnicos
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Taxonomia Mestre Parametrizada em 12 Categorias Normativas de Engenharia Mecânica
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => navigate('/admin/checklists-campo')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0B1E3D] hover:bg-[#1565D8] text-white font-medium text-sm transition-all shadow-sm cursor-pointer"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Preenchimento em Campo</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Ficha</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#0B1528] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Categorias</div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{statsGlobais.totalCategorias}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Normativas vigentes</div>
        </div>
        <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#0B1528] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Subcategorias</div>
          <div className="text-2xl font-black text-slate-800 dark:text-slate-200 mt-1">{statsGlobais.totalSubcategorias}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Grupos técnicos</div>
        </div>
        <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#0B1528] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tipos de Laudo</div>
          <div className="text-2xl font-black text-slate-800 dark:text-slate-200 mt-1">{statsGlobais.totalTiposLaudo}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Modelos estruturados</div>
        </div>
        <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#0B1528] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tipos de Ativos</div>
          <div className="text-2xl font-black text-slate-800 dark:text-slate-200 mt-1">{statsGlobais.totalTiposAtivos}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Equipamentos cobertos</div>
        </div>
        <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#0B1528] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Itens Críticos</div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{statsGlobais.totalItensCriticos}</div>
          <div className="text-[11px] text-rose-500 dark:text-rose-400/80 mt-0.5">Com gatilho de bloqueio</div>
        </div>
        <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#0B1528] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Com Medição</div>
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-1">{statsGlobais.totalItensMedicao}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Calibração e tolerância</div>
        </div>
      </div>

      {/* Regra Normativa de Segurança Banner */}
      <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${isDark ? 'bg-amber-950/20 border-amber-800/40 text-amber-200' : 'bg-amber-50/80 border-amber-200 text-amber-900'}`}>
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs md:text-sm leading-relaxed">
          <span className="font-bold">Regra de Ouro da Conclusão Técnica e de Segurança: </span>
          O percentual quantitativo de conformidade não substitui a análise de risco qualitativa. 
          <span className="font-semibold underline ml-1">Uma única não conformidade crítica</span> exige recomendação de interdição, não liberação ou correção imediata do equipamento/edificação, independentemente do percentual geral atingido.
        </div>
      </div>

      {/* Navegação por Categorias (Tabs Horizontais Deslizáveis) */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Selecione a Categoria Mestre (1 a 12)
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {BANCO_MESTRE_12_CATEGORIAS.map((cat) => {
            const isSelected = cat.id === categoriaAtivaId;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setCategoriaAtivaId(cat.id);
                  setSubcategoriaAtivaId(cat.subcategorias[0]?.id || '');
                  setTipoLaudoAtivoId(cat.subcategorias[0]?.tiposLaudo[0]?.id || '');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : isDark 
                      ? 'bg-[#0B1528] border-slate-800 text-slate-300 hover:bg-slate-800' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {cat.numero}
                </span>
                {renderIconeCategoria(cat.icone, "w-4 h-4")}
                <span>{cat.nome}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Hierarquia + Itens de Inspeção */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Coluna Esquerda: Subcategorias & Tipos de Laudo (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#0B1528] border-slate-800' : 'bg-white border-slate-200 shadow-sm'} space-y-4`}>
            
            {/* Header da Categoria Selecionada */}
            <div className="border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                  CAT {categoriaAtiva.numero}
                </span>
                <h2 className="font-bold text-base text-slate-900 dark:text-slate-100">
                  {categoriaAtiva.nome}
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {categoriaAtiva.descricao}
              </p>
            </div>

            {/* Lista de Subcategorias */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Subcategorias ({categoriaAtiva.subcategorias.length})
              </label>
              <div className="space-y-1.5">
                {categoriaAtiva.subcategorias.map((sub) => {
                  const isSelected = sub.id === subcategoriaAtiva.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setSubcategoriaAtivaId(sub.id);
                        setTipoLaudoAtivoId(sub.tiposLaudo[0]?.id || '');
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 text-blue-900 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{sub.codigo}</span>
                        <span>{sub.nome}</span>
                      </div>
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono">
                        {sub.tiposLaudo.length} laudos
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tipos de Ativo (quando existirem na subcategoria) */}
            {subcategoriaAtiva.tiposAtivos && subcategoriaAtiva.tiposAtivos.length > 0 && (
              <div className="space-y-2 border-t pt-3 border-slate-200 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-blue-500" />
                  Tipos de Ativos Cobertos ({subcategoriaAtiva.tiposAtivos.length})
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {subcategoriaAtiva.tiposAtivos.map((ativo, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 rounded-full text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {ativo}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tipos de Laudo */}
            <div className="space-y-2 border-t pt-3 border-slate-200 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Modelos de Laudo Disponíveis
              </label>
              <div className="space-y-2">
                {subcategoriaAtiva.tiposLaudo.map((tl) => {
                  const isSelected = tl.id === tipoLaudoAtivo.id;
                  return (
                    <div
                      key={tl.id}
                      onClick={() => setTipoLaudoAtivoId(tl.id)}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 dark:border-blue-600 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                          {tl.codigo}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          {tl.itens.length} itens
                        </span>
                      </div>
                      <h4 className="font-semibold text-xs mt-1.5 text-slate-900 dark:text-slate-100">
                        {tl.nome}
                      </h4>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{tl.normasRef}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Coluna Direita: Itens de Inspeção e Simulador de Conclusão (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Header do Tipo de Laudo Ativo + Filtros */}
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#0B1528] border-slate-800' : 'bg-white border-slate-200 shadow-sm'} space-y-3`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400">
                  {subcategoriaAtiva.codigo} • {tipoLaudoAtivo.codigo}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {tipoLaudoAtivo.nome}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                <span>Normas: {tipoLaudoAtivo.normasRef}</span>
              </div>
            </div>

            {/* Barra de Filtros e Busca */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar por código, critério ou norma..."
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder-slate-500' 
                      : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400'
                  }`}
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={filtroCriticidade}
                  onChange={(e) => setFiltroCriticidade(e.target.value)}
                  className={`w-full px-2.5 py-1.5 text-xs rounded-lg border ${
                    isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-700'
                  }`}
                >
                  <option value="todas">Criticidade (Todas)</option>
                  <option value="Critica">Apenas Críticas</option>
                  <option value="Alta">Apenas Altas</option>
                  <option value="Media">Apenas Médias</option>
                  <option value="Baixa">Apenas Baixas</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={filtroTipoAvaliacao}
                  onChange={(e) => setFiltroTipoAvaliacao(e.target.value)}
                  className={`w-full px-2.5 py-1.5 text-xs rounded-lg border ${
                    isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-700'
                  }`}
                >
                  <option value="todos">Tipo (Todos)</option>
                  <option value="medicao">Com Medição</option>
                  <option value="visual">Visual / Funcional</option>
                </select>
              </div>
            </div>
          </div>

          {/* PAINEL DE CONCLUSÃO AUTOMÁTICA EM TEMPO REAL */}
          <div className={`p-4 rounded-xl border ${
            conclusaoAtual.parecerSeguranca === 'INTERDICAO_IMEDIATA'
              ? isDark ? 'bg-rose-950/30 border-rose-800 text-rose-100' : 'bg-rose-50 border-rose-300 text-rose-900'
              : conclusaoAtual.parecerSeguranca === 'LIBERADO_COM_RESTRICOES'
                ? isDark ? 'bg-amber-950/30 border-amber-800 text-amber-100' : 'bg-amber-50 border-amber-300 text-amber-900'
                : isDark ? 'bg-emerald-950/30 border-emerald-800 text-emerald-100' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-current/10">
              <div className="flex items-center gap-2.5">
                {conclusaoAtual.parecerSeguranca === 'INTERDICAO_IMEDIATA' ? (
                  <AlertOctagon className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                ) : conclusaoAtual.parecerSeguranca === 'LIBERADO_COM_RESTRICOES' ? (
                  <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                )}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider opacity-80">
                    Conclusão Automática & Análise de Risco
                  </div>
                  <div className="text-base font-black">
                    {conclusaoAtual.parecerSeguranca === 'INTERDICAO_IMEDIATA' && 'RECOMENDAÇÃO DE INTERDIÇÃO / NÃO LIBERAÇÃO'}
                    {conclusaoAtual.parecerSeguranca === 'LIBERADO_COM_RESTRICOES' && 'LIBERADO COM RESTRIÇÕES (PLANO DE AÇÃO)'}
                    {conclusaoAtual.parecerSeguranca === 'LIBERADO' && 'LIBERADO PARA OPERAÇÃO'}
                  </div>
                </div>
              </div>

              {/* Indicador de Percentual */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-xs font-medium opacity-80">Conformidade</div>
                  <div className="text-xl font-extrabold">{conclusaoAtual.percentualConformidade}%</div>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-current/20 flex items-center justify-center font-bold text-xs">
                  {conclusaoAtual.totalConforme}/{conclusaoAtual.totalItensAvaliados}
                </div>
              </div>
            </div>

            {/* Justificativa e Regra */}
            <p className="text-xs mt-2.5 leading-relaxed font-medium">
              {conclusaoAtual.justificativaRegraSeguranca}
            </p>

            {/* Resumo de Contadores */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3 text-xs pt-2 border-t border-current/10">
              <div>
                <span className="opacity-75">Conformes:</span> <span className="font-bold">{conclusaoAtual.totalConforme}</span>
              </div>
              <div>
                <span className="opacity-75">Não Conformes:</span> <span className="font-bold">{conclusaoAtual.totalNaoConforme}</span>
              </div>
              <div>
                <span className="opacity-75">NCs Críticas:</span> <span className="font-bold text-rose-600 dark:text-rose-400">{conclusaoAtual.ncCriticas}</span>
              </div>
              <div>
                <span className="opacity-75">NCs Altas:</span> <span className="font-bold">{conclusaoAtual.ncAltas}</span>
              </div>
              <div>
                <span className="opacity-75">Reinspeção:</span> <span className="font-bold">{conclusaoAtual.necessidadeReinspecao ? 'Obrigatória' : 'Não'}</span>
              </div>
            </div>

            {/* Itens Impeditivos Listados (se houver) */}
            {conclusaoAtual.itensImpeditivos.length > 0 && (
              <div className="mt-3 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-rose-700 dark:text-rose-300">
                  <AlertTriangle className="w-4 h-4" />
                  Itens Impeditivos que Exigem Correção Imediata ({conclusaoAtual.itensImpeditivos.length}):
                </div>
                {conclusaoAtual.itensImpeditivos.map((imp, i) => (
                  <div key={i} className="pl-5 relative">
                    <span className="absolute left-1 top-1 w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    <span className="font-mono font-bold">{imp.codigo}:</span> {imp.descricao} — <span className="italic">{imp.recomendacao}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LISTA DE ITENS DE INSPEÇÃO */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
              <span>Itens de Verificação Normativa ({itensAtuais.length})</span>
              <span>Interaja para Simular Campo</span>
            </div>

            {itensAtuais.length === 0 ? (
              <div className={`p-8 text-center rounded-xl border ${isDark ? 'bg-[#0B1528] border-slate-800' : 'bg-white border-slate-200'}`}>
                <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Nenhum item encontrado para os filtros selecionados.
                </p>
              </div>
            ) : (
              itensAtuais.map((item) => {
                const isNC = item.resultado === 'NAO_CONFORME';
                const isCritica = (item.detalhesNC?.criticidade || item.criticidadePadrao) === 'Critica';

                return (
                  <div
                    key={item.codigo}
                    className={`p-4 rounded-xl border transition-all ${
                      isNC 
                        ? isCritica 
                          ? 'border-rose-400 bg-rose-50/20 dark:bg-rose-950/10 dark:border-rose-800' 
                          : 'border-amber-400 bg-amber-50/20 dark:bg-amber-950/10 dark:border-amber-800'
                        : isDark ? 'bg-[#0B1528] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    {/* Linha Superior: Código, Grupo e Status Selector */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {item.codigo}
                        </span>
                        {item.grupoInspecao && (
                          <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-medium">
                            {item.grupoInspecao}
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          isCritica 
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300' 
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          Criticidade {item.detalhesNC?.criticidade || item.criticidadePadrao || 'Média'}
                        </span>
                      </div>

                      {/* Seletor de Resultado (Conforme / Não Conforme / N/A / Não Evidenciado) */}
                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg">
                        <button
                          onClick={() => handleAtualizarResultado(item.codigo, 'CONFORME')}
                          className={`px-2 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                            item.resultado === 'CONFORME'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                          }`}
                        >
                          Conforme
                        </button>
                        <button
                          onClick={() => handleAtualizarResultado(item.codigo, 'NAO_CONFORME')}
                          className={`px-2 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                            item.resultado === 'NAO_CONFORME'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                          }`}
                        >
                          Não Conforme
                        </button>
                        <button
                          onClick={() => handleAtualizarResultado(item.codigo, 'NA')}
                          className={`px-2 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                            item.resultado === 'NA'
                              ? 'bg-slate-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                          }`}
                        >
                          N/A
                        </button>
                      </div>
                    </div>

                    {/* Descrição e Critério Técnico */}
                    <div className="space-y-1">
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                        {item.descricao}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Critério de Inspeção: </span>
                        {item.criterioInspecao}
                      </p>
                    </div>

                    {/* Referência Normativa & Evidência Documental */}
                    <div className="flex flex-wrap items-center gap-3 mt-2.5 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1 font-mono">
                        <FileText className="w-3.5 h-3.5 text-blue-500" />
                        <span>{item.referenciaNormativa.norma}</span>
                        {item.referenciaNormativa.itemRequisito && (
                          <span className="text-slate-400">({item.referenciaNormativa.itemRequisito})</span>
                        )}
                      </div>
                      {item.evidenciaDocumental && (
                        <div className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-amber-500" />
                          <span>Evidência: {item.evidenciaDocumental}</span>
                        </div>
                      )}
                    </div>

                    {/* Painel de Medição (quando aplicável) */}
                    {item.campoMedicao && (
                      <div className="mt-3 p-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                            <Ruler className="w-3.5 h-3.5" />
                            Parâmetros de Medição Técnica
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            Instrumento: {item.campoMedicao.instrumentoUtilizado || 'Calibrado RBC'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Mínimo:</span>{' '}
                            <span className="font-mono font-bold">
                              {item.campoMedicao.valorMinimo !== undefined ? `${item.campoMedicao.valorMinimo} ${item.campoMedicao.unidade}` : '—'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Máximo:</span>{' '}
                            <span className="font-mono font-bold">
                              {item.campoMedicao.valorMaximo !== undefined ? `${item.campoMedicao.valorMaximo} ${item.campoMedicao.unidade}` : '—'}
                            </span>
                          </div>
                          <div className="col-span-2 flex items-center gap-2">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Valor Medido:</span>
                            <input
                              type="number"
                              step="any"
                              value={item.campoMedicao.valorEncontrado ?? ''}
                              onChange={(e) => handleAtualizarMedicao(item.codigo, e.target.value)}
                              placeholder={`Em ${item.campoMedicao.unidade}`}
                              className={`w-28 px-2 py-1 rounded text-xs border font-mono font-bold ${
                                isDark ? 'bg-slate-900 border-slate-700 text-cyan-300' : 'bg-white border-slate-300 text-blue-900'
                              }`}
                            />
                            <span className="font-mono text-slate-500">{item.campoMedicao.unidade}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PROTOCOLO AUTOMÁTICO DE NÃO CONFORMIDADE */}
                    {isNC && item.detalhesNC && (
                      <div className="mt-3 p-3 rounded-lg border border-rose-300 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 text-xs space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-rose-600" />
                            Gatilho de Não Conformidade Técnico-Normativa
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">Criticidade:</span>
                            <select
                              value={item.detalhesNC.criticidade}
                              onChange={(e) => handleAtualizarCriticidadeNC(item.codigo, e.target.value as CriticidadeInspecao)}
                              className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                                item.detalhesNC.criticidade === 'Critica'
                                  ? 'bg-rose-600 text-white border-rose-700'
                                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                              }`}
                            >
                              <option value="Critica">Crítica (Interdição)</option>
                              <option value="Alta">Alta</option>
                              <option value="Media">Média</option>
                              <option value="Baixa">Baixa</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <span className="font-semibold text-rose-900 dark:text-rose-200">Risco Associado:</span>
                            <p className="text-slate-700 dark:text-slate-300 mt-0.5">{item.detalhesNC.riscoAssociado}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-rose-900 dark:text-rose-200">Prazo Recomendado:</span>
                            <p className="font-bold text-rose-700 dark:text-rose-400 mt-0.5">{item.detalhesNC.prazoRecomendado}</p>
                          </div>
                        </div>

                        <div>
                          <span className="font-semibold text-rose-900 dark:text-rose-200">Recomendação Técnica Consolidada:</span>
                          <p className="text-slate-700 dark:text-slate-300 mt-0.5">{item.detalhesNC.recomendacao}</p>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-rose-200 dark:border-rose-900/40 text-[11px]">
                          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                            <Camera className="w-3.5 h-3.5 text-rose-500" />
                            Registro Fotográfico Obrigatório Vinculado à NC
                          </span>
                          <span className="font-mono text-rose-700 dark:text-rose-300 font-medium">
                            Ref: {item.referenciaNormativa.norma}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Botão de Ver Ficha Completa */}
                    <div className="mt-2.5 flex justify-end">
                      <button
                        onClick={() => setItemSelecionado(item)}
                        className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Ficha Técnica Completa do Requisito</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>

      {/* MODAL DE FICHA TÉCNICA DETALHADA DO ITEM */}
      {itemSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-2xl rounded-2xl border p-6 max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl ${
            isDark ? 'bg-[#0B1528] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-start justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                  {itemSelecionado.codigo}
                </span>
                <h3 className="text-lg font-bold mt-1">{itemSelecionado.descricao}</h3>
              </div>
              <button
                onClick={() => setItemSelecionado(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div>
                <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Critério de Aceitação:</span>
                <p className="mt-1 text-sm text-slate-800 dark:text-slate-200 font-medium">{itemSelecionado.criterioInspecao}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="font-bold text-slate-500 dark:text-slate-400">Norma Regulamentadora:</span>
                  <div className="font-semibold text-blue-600 dark:text-blue-400 mt-0.5">{itemSelecionado.referenciaNormativa.norma}</div>
                  <div className="text-slate-500 mt-0.5">{itemSelecionado.referenciaNormativa.itemRequisito || 'Geral'}</div>
                </div>
                <div>
                  <span className="font-bold text-slate-500 dark:text-slate-400">Evidência Requerida:</span>
                  <div className="font-semibold mt-0.5">{itemSelecionado.evidenciaDocumental || 'Inspeção Visual'}</div>
                  <div className="text-slate-500 mt-0.5">Criticidade: {itemSelecionado.criticidadePadrao || 'Média'}</div>
                </div>
              </div>

              {itemSelecionado.campoMedicao && (
                <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                  <span className="font-bold text-blue-900 dark:text-blue-300">Medição Técnica e Calibração:</span>
                  <div className="grid grid-cols-3 gap-2 mt-2 font-mono">
                    <div>Mín: {itemSelecionado.campoMedicao.valorMinimo ?? '—'} {itemSelecionado.campoMedicao.unidade}</div>
                    <div>Máx: {itemSelecionado.campoMedicao.valorMaximo ?? '—'} {itemSelecionado.campoMedicao.unidade}</div>
                    <div>Tolerância: {itemSelecionado.campoMedicao.tolerancia ?? 'Normativa'}</div>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900">
                <span className="font-bold text-rose-900 dark:text-rose-300">Gatilho de Não Conformidade e Ação Corretiva:</span>
                <p className="mt-1 text-slate-700 dark:text-slate-300">
                  {itemSelecionado.recomendacaoPadrao || 'Correção imediata e reteste de conformidade com emissão de RNC.'}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setItemSelecionado(null)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-xs hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Fechar Ficha Técnica
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
