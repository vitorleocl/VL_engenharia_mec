import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Search, 
  Sparkles, 
  ShieldAlert, 
  Gauge, 
  Tractor, 
  Truck, 
  Cable, 
  Car, 
  Bus, 
  FileCheck2, 
  Smile, 
  Fan, 
  Award, 
  BarChart3, 
  Flame, 
  Printer, 
  Edit, 
  Trash2, 
  Filter, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  X,
  Download,
  ChevronDown,
  ChevronUp,
  FolderTree,
  BookOpen,
  CheckSquare,
  Building,
  Wrench,
  HardHat,
  ShieldCheck,
  Layers,
  Calendar
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { LaudoPdfExportModal } from './LaudoPdfExportModal';
import { 
  CategoriaLaudoTaxonomia, 
  SubcategoriaLaudoTaxonomia, 
  TipoLaudoTaxonomia, 
  Laudo 
} from '../../types';

// Map icon strings to Lucide components
const ICON_MAP: Record<string, React.ElementType> = {
  Flame,
  ShieldAlert,
  Gauge,
  Tractor,
  Truck,
  Cable,
  Car,
  Bus,
  FileCheck2,
  Sparkles,
  Smile,
  Fan,
  Award,
  BarChart3,
  Building,
  Wrench,
  HardHat,
  ShieldCheck,
};

export const LaudosCentralView: React.FC = () => {
  const { 
    laudos, 
    clientes, 
    ativos, 
    categoriasLaudo, 
    criarLaudoPorTaxonomia, 
    removerLaudo 
  } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Primary Tabs: Taxonomy Catalog vs Active Reports List
  const [abaAtiva, setAbaAtiva] = useState<'catalogo' | 'laudos'>('catalogo');

  // Search and Filters for Taxonomy Catalog
  const [buscaCatalogo, setBuscaCatalogo] = useState('');
  const [categoriaFiltroId, setCategoriaFiltroId] = useState<string>('todas');
  const [categoriasExpandidas, setCategoriasExpandidas] = useState<Record<string, boolean>>({
    'cat-incendio': true,
    'cat-nr12': true,
  });

  // Search and Filters for Reports List
  const [buscaLaudos, setBuscaLaudos] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  // Modal for creating report from taxonomy
  const [modalTaxonomiaAberto, setModalTaxonomiaAberto] = useState(false);
  const [selecaoTaxonomia, setSelecaoTaxonomia] = useState<{
    categoria: CategoriaLaudoTaxonomia;
    subcategoria: SubcategoriaLaudoTaxonomia;
    tipo: TipoLaudoTaxonomia;
  } | null>(null);

  // Form fields for new report modal
  const [clienteId, setClienteId] = useState(clientes[0]?.id || '');
  const [ativoId, setAtivoId] = useState('');
  const [dataInspecao, setDataInspecao] = useState(new Date().toISOString().slice(0, 10));
  const [artNumero, setArtNumero] = useState('');

  // PDF Export Modal state
  const [laudoPdfExportar, setLaudoPdfExportar] = useState<Laudo | null>(null);

  const isColaborador = currentUser?.role === 'master' || currentUser?.role === 'colaborador';

  // Toggle category expansion
  const toggleCategoria = (id: string) => {
    setCategoriasExpandidas(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandirTodas = () => {
    const estado: Record<string, boolean> = {};
    categoriasLaudo.forEach(c => { estado[c.id] = true; });
    setCategoriasExpandidas(estado);
  };

  const recolherTodas = () => {
    setCategoriasExpandidas({});
  };

  // Open creation modal for a specific report type
  const abrirCriacaoTaxonomia = (
    cat: CategoriaLaudoTaxonomia, 
    subcat: SubcategoriaLaudoTaxonomia, 
    tipo: TipoLaudoTaxonomia
  ) => {
    setSelecaoTaxonomia({ categoria: cat, subcategoria: subcat, tipo });
    setClienteId(clientes[0]?.id || '');
    setAtivoId('');
    setDataInspecao(new Date().toISOString().slice(0, 10));
    setArtNumero('');
    setModalTaxonomiaAberto(true);
  };

  // Handle form submission to instantiate the report
  const handleConfirmarCriacao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selecaoTaxonomia || !clienteId) return;

    try {
      const novoId = criarLaudoPorTaxonomia({
        tipoLaudoId: selecaoTaxonomia.tipo.id,
        clienteId,
        ativoId: ativoId || '',
        artNumero,
        dataInspecao,
      });

      setModalTaxonomiaAberto(false);
      navigate(`/admin/laudos/${novoId}`);
    } catch (err: any) {
      console.error('Erro ao criar laudo:', err);
      alert('Não foi possível iniciar o laudo: ' + err.message);
    }
  };

  // Filter categories and report types based on search
  const categoriasFiltradas = useMemo(() => {
    const termo = buscaCatalogo.trim().toLowerCase();

    return categoriasLaudo
      .filter(cat => {
        if (categoriaFiltroId !== 'todas' && cat.id !== categoriaFiltroId) return false;
        return true;
      })
      .map(cat => {
        if (!termo) return cat;

        // Check if category matches
        const matchCat = cat.nome.toLowerCase().includes(termo) || 
                         (cat.descricao && cat.descricao.toLowerCase().includes(termo));

        // Filter subcategories and report types
        const subcategoriasFiltradas = cat.subcategorias.map(sub => {
          const matchSub = sub.nome.toLowerCase().includes(termo);

          const tiposFiltrados = sub.tipos.filter(tipo => 
            matchCat || 
            matchSub || 
            tipo.codigo.toLowerCase().includes(termo) ||
            tipo.nome.toLowerCase().includes(termo) ||
            tipo.normasRef.toLowerCase().includes(termo) ||
            (tipo.descricaoCurta && tipo.descricaoCurta.toLowerCase().includes(termo)) ||
            (tipo.apresentacaoPadrao && tipo.apresentacaoPadrao.toLowerCase().includes(termo))
          );

          return {
            ...sub,
            tipos: tiposFiltrados,
          };
        }).filter(sub => sub.tipos.length > 0);

        return {
          ...cat,
          subcategorias: subcategoriasFiltradas,
        };
      })
      .filter(cat => cat.subcategorias.length > 0);
  }, [categoriasLaudo, buscaCatalogo, categoriaFiltroId]);

  // Filter registered reports
  const laudosFiltrados = useMemo(() => {
    return laudos.filter(l => {
      const matchBusca = 
        l.numero.toLowerCase().includes(buscaLaudos.toLowerCase()) ||
        l.tipo.toLowerCase().includes(buscaLaudos.toLowerCase()) ||
        (l.clienteNome && l.clienteNome.toLowerCase().includes(buscaLaudos.toLowerCase())) ||
        (l.ativoIdentificacao && l.ativoIdentificacao.toLowerCase().includes(buscaLaudos.toLowerCase()));
      const matchStatus = filtroStatus === 'todos' || l.status === filtroStatus;
      return matchBusca && matchStatus;
    });
  }, [laudos, buscaLaudos, filtroStatus]);

  // Count total report models in taxonomy
  const totalModelosTaxonomia = useMemo(() => {
    return categoriasLaudo.reduce((acc, cat) => {
      return acc + cat.subcategorias.reduce((subAcc, sub) => subAcc + sub.tipos.length, 0);
    }, 0);
  }, [categoriasLaudo]);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#1565D8] dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <FolderTree className="w-4 h-4" />
            <span>Engenharia Mecânica & Vistorias Especializadas</span>
          </div>
          <h2 className="text-2xl font-black text-[#0B1E3D] dark:text-white tracking-tight">
            Central de Laudos Técnicos & Taxonomia Normativa
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl mt-1">
            Editor customizável de laudos periciais e auditorias industriais estruturado pela taxonomia completa de 12 categorias de engenharia mecânica, com geração de parecer por IA e exportação em formato padrão A4 com ART CREA-PE.
          </p>
        </div>

        {/* Top Tab Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setAbaAtiva('catalogo')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              abaAtiva === 'catalogo'
                ? 'bg-white dark:bg-[#0B1E3D] text-[#1565D8] dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Catálogo Taxonômico ({categoriasLaudo.length} Cats)</span>
          </button>

          <button
            onClick={() => setAbaAtiva('laudos')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              abaAtiva === 'laudos'
                ? 'bg-white dark:bg-[#0B1E3D] text-[#1565D8] dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Laudos Registrados ({laudos.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: CATÁLOGO TAXONÔMICO (12 CATEGORIAS E TIPOS DE LAUDO) */}
      {/* ========================================================================= */}
      {abaAtiva === 'catalogo' && (
        <div className="space-y-6">
          
          {/* Controls Bar */}
          <div className="bg-white dark:bg-[#0B1324] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={buscaCatalogo}
                onChange={(e) => setBuscaCatalogo(e.target.value)}
                placeholder="Buscar por código (ex: NR12, SPDA, PMOC), norma ou nome do laudo..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1565D8]"
              />
              {buscaCatalogo && (
                <button
                  onClick={() => setBuscaCatalogo('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter by Category */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={categoriaFiltroId}
                onChange={(e) => setCategoriaFiltroId(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1565D8]"
              >
                <option value="todas">Todas as 12 Categorias</option>
                {categoriasLaudo.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.numero}. {cat.nome}
                  </option>
                ))}
              </select>

              <button
                onClick={expandirTodas}
                className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 cursor-pointer"
                title="Expandir todas as categorias"
              >
                Expandir
              </button>
              <button
                onClick={recolherTodas}
                className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 cursor-pointer"
                title="Recolher todas as categorias"
              >
                Recolher
              </button>
            </div>
          </div>

          {/* Catalog Categories Accordion Grid */}
          <div className="space-y-4">
            {categoriasFiltradas.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-[#0B1324] rounded-2xl border border-slate-200 dark:border-slate-800">
                <FolderTree className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Nenhum tipo de laudo encontrado
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Tente buscar por outro termo ou selecione "Todas as 12 Categorias".
                </p>
              </div>
            ) : (
              categoriasFiltradas.map((cat) => {
                const IconComp = ICON_MAP[cat.icone || 'ShieldCheck'] || ShieldCheck;
                const expandida = categoriasExpandidas[cat.id] ?? false;

                const totalTipos = cat.subcategorias.reduce(
                  (acc, s) => acc + s.tipos.length, 
                  0
                );

                return (
                  <div
                    key={cat.id}
                    className="bg-white dark:bg-[#0B1324] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all"
                  >
                    {/* Category Header */}
                    <div 
                      onClick={() => toggleCategoria(cat.id)}
                      className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors select-none"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#1565D8] dark:text-blue-400 flex items-center justify-center font-bold shrink-0 shadow-xs">
                          <IconComp className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              CATEGORIA {cat.numero}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {cat.subcategorias.length} subcategorias • {totalTipos} tipos de laudo
                            </span>
                          </div>
                          <h3 className="text-base font-extrabold text-[#0B1E3D] dark:text-white mt-0.5">
                            {cat.nome}
                          </h3>
                          {cat.descricao && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                              {cat.descricao}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="hidden md:inline-block text-[11px] font-bold text-slate-400">
                          {expandida ? 'Recolher' : 'Expandir'}
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                          {expandida ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Category Subcategories & Report Types */}
                    {expandida && (
                      <div className="border-t border-slate-100 dark:border-slate-800 p-4 sm:p-6 bg-slate-50/60 dark:bg-[#070D18] space-y-6">
                        {cat.subcategorias.map((subcat) => (
                          <div key={subcat.id} className="space-y-3">
                            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                              <div>
                                <h4 className="text-sm font-extrabold text-[#0B1E3D] dark:text-slate-200 flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#1565D8]"></span>
                                  <span>{subcat.nome}</span>
                                </h4>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-slate-400">
                                {subcat.tipos.length} modelo(s)
                              </span>
                            </div>

                            {/* Report Types Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                              {subcat.tipos.map((tipo) => (
                                <div
                                  key={tipo.id}
                                  className="bg-white dark:bg-[#0B1324] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-[#1565D8]/50 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                                >
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between gap-2 flex-wrap">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-blue-100 dark:bg-blue-950 text-[#1565D8] dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                                          {tipo.codigo}
                                        </span>
                                        {(tipo.hrn || tipo.temHrn) ? (
                                          <span className="px-1.5 py-0.5 rounded font-mono font-bold text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                                            HRN: SIM
                                          </span>
                                        ) : (
                                          <span className="px-1.5 py-0.5 rounded font-mono font-medium text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                            HRN: NÃO
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                                        <CheckSquare className="w-3 h-3 text-emerald-600" />
                                        <span>{tipo.checklistPadrao.length} itens</span>
                                      </span>
                                    </div>

                                    <h5 className="text-xs font-bold text-[#0B1E3D] dark:text-white leading-snug">
                                      {tipo.nome}
                                    </h5>

                                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                      {tipo.descricaoCurta || tipo.apresentacaoPadrao}
                                    </p>

                                    <div className="pt-1">
                                      <span className="text-[10px] font-mono text-slate-500 block truncate" title={tipo.normasRef}>
                                        Normas: <strong className="text-slate-700 dark:text-slate-300">{tipo.normasRef}</strong>
                                      </span>
                                    </div>
                                  </div>

                                  {isColaborador && (
                                    <button
                                      onClick={() => abrirCriacaoTaxonomia(cat, subcat, tipo)}
                                      className="w-full py-2 px-3 rounded-lg bg-[#0B1E3D] hover:bg-[#1565D8] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2 active:scale-98"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>Emitir Laudo deste Tipo</span>
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: LAUDOS REGISTRADOS E EM ELABORAÇÃO */}
      {/* ========================================================================= */}
      {abaAtiva === 'laudos' && (
        <div className="bg-white dark:bg-[#0B1324] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-extrabold text-[#0B1E3D] dark:text-white">
                Laudos Cadastrados no Sistema ({laudos.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Acompanhe o status das vistorias em campo, laudos finalizados e ARTs emitidas.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={buscaLaudos}
                  onChange={(e) => setBuscaLaudos(e.target.value)}
                  placeholder="Buscar por número, cliente ou ativo..."
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-[#1565D8]"
                />
              </div>

              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                <option value="todos">Todos os Status</option>
                <option value="rascunho">Rascunho / Campo</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="finalizado">Finalizado (ART)</option>
              </select>
            </div>
          </div>

          {laudosFiltrados.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Nenhum laudo encontrado com esses critérios.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3">Número Oficial</th>
                    <th className="py-3 px-3">Módulo / Serviço</th>
                    <th className="py-3 px-3">Cliente</th>
                    <th className="py-3 px-3">Equipamento Auditado</th>
                    <th className="py-3 px-3">Data</th>
                    <th className="py-3 px-3">Risco HRN</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {laudosFiltrados.map((laudo) => (
                    <tr key={laudo.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-bold font-mono text-[#0B1E3D] dark:text-white block">
                          {laudo.numero}
                        </span>
                        {laudo.artNumero && (
                          <span className="text-[10px] text-[#1565D8] dark:text-blue-400 font-mono">
                            ART: {laudo.artNumero}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                        {laudo.tipo}
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                        {laudo.clienteNome}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {laudo.ativoIdentificacao || '—'}
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                        {laudo.dataInspecao}
                      </td>
                      <td className="py-3 px-3">
                        {laudo.hrnCalculoGeral ? (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${laudo.hrnCalculoGeral.cor}`}>
                            {laudo.hrnCalculoGeral.nivel} ({laudo.hrnCalculoGeral.score})
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Não avaliado</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          laudo.status === 'finalizado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {laudo.status === 'finalizado' ? 'Finalizado' : 'Em Campo'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setLaudoPdfExportar(laudo)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs cursor-pointer"
                            title="Exportar laudo para PDF oficial A4 com ART CREA-PE"
                          >
                            <Download className="w-3 h-3" />
                            <span>PDF</span>
                          </button>
                          <button
                            onClick={() => navigate(`/admin/laudos/${laudo.id}`)}
                            className="px-3 py-1 rounded-lg bg-[#1565D8] hover:bg-[#0b4fb8] text-white font-bold text-[11px] shadow-xs cursor-pointer"
                          >
                            Abrir Editor
                          </button>
                          {isColaborador && (
                            <button
                              onClick={() => {
                                if (confirm(`Excluir o laudo ${laudo.numero}?`)) removerLaudo(laudo.id);
                              }}
                              className="p-1 rounded text-slate-400 hover:text-red-600 cursor-pointer"
                              title="Remover"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CRIAR NOVO LAUDO A PARTIR DA TAXONOMIA */}
      {/* ========================================================================= */}
      {modalTaxonomiaAberto && selecaoTaxonomia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0B1324] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div>
                <span className="text-[10px] font-bold text-[#1565D8] dark:text-blue-400 uppercase tracking-wider font-mono">
                  {selecaoTaxonomia.tipo.codigo} • {selecaoTaxonomia.categoria.nome}
                </span>
                <h3 className="text-lg font-bold text-[#0B1E3D] dark:text-white mt-0.5">
                  Iniciar {selecaoTaxonomia.tipo.nome}
                </h3>
              </div>
              <button 
                onClick={() => setModalTaxonomiaAberto(false)} 
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmarCriacao} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Cliente Solicitante *
                </label>
                <select
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold"
                >
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>{c.razaoSocial}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Equipamento / Ativo Auditado (Opcional)
                </label>
                <select
                  value={ativoId}
                  onChange={(e) => setAtivoId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                >
                  <option value="">Nenhum ativo específico / Cadastrar depois</option>
                  {ativos.filter(a => a.clienteId === clienteId).map(a => (
                    <option key={a.id} value={a.id}>{a.identificacao} ({a.tipo})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Data da Vistoria In Loco *
                  </label>
                  <input
                    type="date"
                    required
                    value={dataInspecao}
                    onChange={(e) => setDataInspecao(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Número da ART CREA-PE (Opcional)
                  </label>
                  <input
                    type="text"
                    value={artNumero}
                    onChange={(e) => setArtNumero(e.target.value)}
                    placeholder="Ex: PE2026123456"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed space-y-1">
                <p>
                  <strong>Estrutura pré-carregada:</strong> {selecaoTaxonomia.tipo.checklistPadrao.length} itens de checklist normativo ({selecaoTaxonomia.tipo.normasRef}).
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  O editor customizável incluirá cálculo quantitativo HRN, análise por IA e geração de documento padrão A4.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalTaxonomiaAberto(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#1565D8] hover:bg-[#0b4fb8] text-white font-bold shadow-md cursor-pointer"
                >
                  Iniciar Auditoria no Editor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE EXPORTAÇÃO PDF UNIVERSAL */}
      {/* ========================================================================= */}
      {laudoPdfExportar && (
        <LaudoPdfExportModal
          laudo={laudoPdfExportar}
          cliente={clientes.find(c => c.id === laudoPdfExportar.clienteId || c.razaoSocial === laudoPdfExportar.clienteNome)}
          ativo={ativos.find(a => a.id === laudoPdfExportar.ativoId || a.identificacao === laudoPdfExportar.ativoIdentificacao)}
          isOpen={Boolean(laudoPdfExportar)}
          onClose={() => setLaudoPdfExportar(null)}
        />
      )}

    </div>
  );
};
