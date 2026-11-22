import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Check,
  ImagePlus,
  Layers,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Ativo, CategoriaAtivoDef } from '../../types';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../lib/firebase';

const CATEGORIA_LEGADO = '__legado__';

/** Gera um mapa de renomes (valor antigo -> valor novo) comparando duas árvores. */
function obterRenomesCategorias(
  originais: CategoriaAtivoDef[],
  novas: CategoriaAtivoDef[]
): Map<string, string> {
  const mapa = new Map<string, string>();
  const porId = new Map(novas.map(cat => [cat.id, cat]));

  originais.forEach(original => {
    const nova = porId.get(original.id);
    if (!nova) return;
    if (original.nome !== nova.nome) mapa.set(original.nome, nova.nome);
    original.subcategorias.forEach((sub, indice) => {
      const novaSub = nova.subcategorias[indice];
      if (novaSub && novaSub !== sub) mapa.set(sub, novaSub);
    });
  });

  return mapa;
}

export const AtivosView: React.FC = () => {
  const {
    ativos,
    clientes,
    categoriasAtivos,
    categoriasAtivosArvore,
    atualizarCategoriasAtivosArvore,
    adicionarAtivo,
    atualizarAtivo,
    removerAtivo,
  } = useData();

  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [ativoEditando, setAtivoEditando] = useState<Ativo | null>(null);
  const [confirmandoExclusaoId, setConfirmandoExclusaoId] = useState<string | null>(null);

  // Form fields
  const [clienteId, setClienteId] = useState(clientes[0]?.id || '');
  const [categoriaId, setCategoriaId] = useState('');
  const [subcategoria, setSubcategoria] = useState('');
  const [tipo, setTipo] = useState('');
  const [identificacao, setIdentificacao] = useState('');
  const [fabricante, setFabricante] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState<string>(String(new Date().getFullYear()));
  const [placa, setPlaca] = useState('');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [chassi, setChassi] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [fotoArquivo, setFotoArquivo] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState('');
  const [erroFormulario, setErroFormulario] = useState('');

  // Category manager
  const [gerenciadorAberto, setGerenciadorAberto] = useState(false);
  const [rascunhoCategorias, setRascunhoCategorias] = useState<CategoriaAtivoDef[]>([]);
  const [novasSubcategorias, setNovasSubcategorias] = useState<Record<string, string>>({});
  const [removendoCategoriaId, setRemovendoCategoriaId] = useState<string | null>(null);

  const ativosFiltrados = ativos.filter((a) =>
    `${a.identificacao || ''} ${a.tipo || ''} ${a.subcategoria || ''} ${a.fabricante || ''} ${a.modelo || ''} ${a.placa || ''} ${a.localizacao || ''} ${a.clienteNome || ''}`
      .toLowerCase()
      .includes(busca.toLowerCase())
  );

  const primeiraCategoriaId = categoriasAtivosArvore[0]?.id || '';

  const resolverCategoriaInicial = (ativo?: Ativo | null): string => {
    if (ativo?.categoriaId && categoriasAtivosArvore.some(c => c.id === ativo.categoriaId)) {
      return ativo.categoriaId;
    }
    const texto = ativo?.tipo || '';
    const encontrada = categoriasAtivosArvore.find(
      c => c.nome === texto || c.subcategorias.includes(texto)
    );
    return encontrada?.id || (texto ? CATEGORIA_LEGADO : primeiraCategoriaId);
  };

  const abrirNovo = () => {
    setAtivoEditando(null);
    setClienteId(clientes[0]?.id || '');
    const catId = primeiraCategoriaId;
    setCategoriaId(catId);
    setSubcategoria('');
    setTipo(categoriasAtivosArvore.find(c => c.id === catId)?.nome || 'Outro ativo');
    setIdentificacao('');
    setFabricante('');
    setModelo('');
    setAno(String(new Date().getFullYear()));
    setPlaca('');
    setNumeroSerie('');
    setChassi('');
    setCapacidade('');
    setLocalizacao('Recife - PE');
    setFotoArquivo(null);
    setFotoPreview('');
    setErroFormulario('');
    setModalAberto(true);
  };

  const abrirEdicao = (ativo: Ativo) => {
    setAtivoEditando(ativo);
    setClienteId(ativo.clienteId || clientes[0]?.id || '');
    const catId = resolverCategoriaInicial(ativo);
    const categoria = categoriasAtivosArvore.find(c => c.id === catId);
    setCategoriaId(catId);
    setSubcategoria(
      ativo.subcategoria ||
        (categoria?.subcategorias.includes(ativo.tipo || '') ? ativo.tipo || '' : '')
    );
    setTipo(ativo.tipo || categoria?.nome || 'Outro ativo');
    setIdentificacao(ativo.identificacao || '');
    setFabricante(ativo.fabricante || ativo.marca || '');
    setModelo(ativo.modelo || '');
    setAno(ativo.ano ? String(ativo.ano) : String(ativo.anoFabricacao || new Date().getFullYear()));
    setPlaca(ativo.placa || '');
    setNumeroSerie(ativo.numeroSerie || '');
    setChassi(ativo.chassi || '');
    setCapacidade(ativo.capacidade || '');
    setLocalizacao(ativo.localizacao || '');
    setFotoArquivo(null);
    setFotoPreview(ativo.fotoUrl || '');
    setErroFormulario('');
    setModalAberto(true);
  };

  const handleCategoriaChange = (id: string) => {
    setCategoriaId(id);
    setSubcategoria('');
    const categoria = categoriasAtivosArvore.find(c => c.id === id);
    if (categoria) setTipo(categoria.nome);
  };

  const handleSubcategoriaChange = (valor: string) => {
    setSubcategoria(valor);
    if (valor) setTipo(valor);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identificacao.trim()) return;
    setErroFormulario('');

    const anoParsed = ano.trim()
      ? /^\d{4}$/.test(ano.trim())
        ? Number(ano.trim())
        : ano.trim()
      : new Date().getFullYear();

    let fotoUrl = fotoPreview;
    if (fotoArquivo) {
      try {
        const fotoRef = ref(storage, `ativos/${ativoEditando?.id || `novo-${Date.now()}`}/${Date.now()}-${fotoArquivo.name.replace(/[^\w.-]/g, '_')}`);
        await uploadBytes(fotoRef, fotoArquivo, { contentType: fotoArquivo.type });
        fotoUrl = await getDownloadURL(fotoRef);
      } catch (error) {
        console.error('Falha ao enviar foto do ativo:', error);
        setErroFormulario('Não foi possível enviar a foto. Verifique sua conexão e tente novamente.');
        return;
      }
    }

    const categoria = categoriasAtivosArvore.find(c => c.id === categoriaId);
    const tipoFinal = subcategoria || categoria?.nome || tipo.trim() || 'Outro ativo';

    const payload = {
      clienteId,
      tipo: tipoFinal,
      categoriaId: categoriaId === CATEGORIA_LEGADO ? '' : categoriaId,
      subcategoria: subcategoria || '',
      identificacao: identificacao.trim(),
      fabricante: fabricante.trim(),
      modelo: modelo.trim(),
      ano: anoParsed,
      placa: placa.trim(),
      numeroSerie: numeroSerie.trim() || (ativoEditando?.numeroSerie || `SN-${Math.floor(1000 + Math.random() * 9000)}`),
      chassi: chassi.trim(),
      capacidade: capacidade.trim(),
      localizacao: localizacao.trim(),
      fotoUrl: fotoUrl || '',
    };

    if (ativoEditando) {
      atualizarAtivo(ativoEditando.id, payload);
    } else {
      adicionarAtivo(payload);
    }

    setModalAberto(false);
  };

  const categoriaSelecionada = categoriasAtivosArvore.find(c => c.id === categoriaId);
  const subcategorias = categoriaSelecionada?.subcategorias || [];

  // ----- Category manager -----
  const abrirGerenciador = () => {
    setRascunhoCategorias(categoriasAtivosArvore.map(cat => ({
      id: cat.id,
      nome: cat.nome,
      subcategorias: [...(cat.subcategorias || [])],
    })));
    setNovasSubcategorias({});
    setRemovendoCategoriaId(null);
    setGerenciadorAberto(true);
  };

  const minimizarCategoria = (cat: CategoriaAtivoDef): CategoriaAtivoDef => ({
    id: String(cat.id || `cat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`),
    nome: String(cat.nome || '').trim(),
    subcategorias: Array.isArray(cat.subcategorias)
      ? Array.from(new Set(cat.subcategorias.map(s => String(s).trim()).filter(Boolean)))
      : [],
  });

  const salvarGerenciador = () => {
    const finais = rascunhoCategorias.map(minimizarCategoria).filter(c => c.nome || c.subcategorias.length);
    if (finais.length === 0) {
      window.alert('Mantenha ao menos uma categoria de ativo.');
      return;
    }

    const renomes = obterRenomesCategorias(categoriasAtivosArvore, finais);
    atualizarCategoriasAtivosArvore(finais);

    // Propaga renomes para os ativos já cadastrados, mantendo tipo/subcategoria alinhados.
    ativos.forEach(ativo => {
      const novoTipo = (ativo.tipo && renomes.get(ativo.tipo)) || ativo.tipo;
      const novaSubcategoria = (ativo.subcategoria && renomes.get(ativo.subcategoria)) || ativo.subcategoria;
      const categoriaAindaExiste = finais.some(c => c.id === ativo.categoriaId);
      const novaCategoriaId = categoriaAindaExiste ? ativo.categoriaId : '';
      if (
        novoTipo !== ativo.tipo ||
        novaSubcategoria !== ativo.subcategoria ||
        novaCategoriaId !== (ativo.categoriaId || '')
      ) {
        atualizarAtivo(ativo.id, {
          tipo: novoTipo,
          subcategoria: novaSubcategoria || '',
          categoriaId: novaCategoriaId,
        });
      }
    });

    setGerenciadorAberto(false);
  };

  const atualizarCategoriaNoRascunho = (id: string, transformar: (cat: CategoriaAtivoDef) => CategoriaAtivoDef) => {
    setRascunhoCategorias(prev => prev.map(cat => cat.id === id ? transformar(cat) : cat));
  };

  const adicionarNovaCategoria = () => {
    const nova: CategoriaAtivoDef = {
      id: `cat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      nome: 'Nova categoria',
      subcategorias: [],
    };
    setRascunhoCategorias(prev => [...prev, nova]);
  };

  const removerCategoriaDoRascunho = (id: string) => {
    setRascunhoCategorias(prev => prev.filter(cat => cat.id !== id));
    setRemovendoCategoriaId(null);
  };

  const adicionarSubcategoriaNoRascunho = (categoriaId: string) => {
    const valor = (novasSubcategorias[categoriaId] || '').trim();
    if (!valor) return;
    atualizarCategoriaNoRascunho(categoriaId, cat => ({
      ...cat,
      subcategorias: Array.from(new Set([...cat.subcategorias, valor])),
    }));
    setNovasSubcategorias(prev => ({ ...prev, [categoriaId]: '' }));
  };

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight">
            Ativos
          </h1>
          <p className="text-[var(--muted)] text-[15px] sm:text-[16px] mt-0.5">
            Inventário técnico de máquinas, veículos e ativos vinculados aos clientes.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={abrirNovo}
            className="btn-tech pri text-[14.5px] px-4 py-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Novo ativo</span>
          </button>
        </div>
      </div>

      {/* Technical Inventory Table */}
      <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-[17px] font-bold">Inventário técnico detalhado</h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar máquina, placa ou TAG..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px] min-w-[680px]">
            <thead>
              <tr className="border-b border-[var(--line)] text-[var(--muted)] text-xs bg-[var(--paper)]">
                <th className="py-2.5 px-4 font-semibold">Identificação</th>
                <th className="py-2.5 px-4 font-semibold">Cliente</th>
                <th className="py-2.5 px-4 font-semibold">Categoria / Subcategoria</th>
                <th className="py-2.5 px-4 font-semibold">Capacidade</th>
                <th className="py-2.5 px-4 font-semibold">Localização</th>
                <th className="py-2.5 px-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {ativosFiltrados.map((ativo) => {
                const cliente = clientes.find((c) => c.id === ativo.clienteId);
                const subtitulo = [ativo.fabricante, ativo.modelo, ativo.ano]
                  .filter(Boolean)
                  .join(' · ');
                const confirmando = confirmandoExclusaoId === ativo.id;

                return (
                  <tr key={ativo.id} className="hover:bg-[var(--paper)] transition-colors">
                    <td className="py-3 px-4 align-top">
                      {ativo.fotoUrl && <img src={ativo.fotoUrl} alt={`Foto de ${ativo.identificacao}`} className="mb-2 h-12 w-16 rounded-md border border-[var(--line)] object-cover" />}
                      <span className="font-semibold text-[var(--ink)] block">
                        {ativo.identificacao}
                      </span>
                      {subtitulo && (
                        <small className="text-xs text-[var(--muted)] block mt-0.5">
                          {subtitulo}
                        </small>
                      )}
                    </td>
                    <td className="py-3 px-4 align-top text-[var(--muted)]">
                      {cliente?.nomeFantasia || cliente?.razaoSocial || ativo.clienteNome || 'Cliente'}
                    </td>
                    <td className="py-3 px-4 align-top text-[var(--muted)]">
                      <span className="font-semibold">{ativo.tipo}</span>
                      {ativo.subcategoria && ativo.subcategoria !== ativo.tipo && (
                        <small className="block text-xs">{ativo.subcategoria}</small>
                      )}
                    </td>
                    <td className="py-3 px-4 align-top text-[var(--muted)]">
                      {ativo.capacidade || '—'}
                    </td>
                    <td className="py-3 px-4 align-top text-[var(--muted)]">
                      {ativo.localizacao || 'PE'}
                    </td>
                    <td className="py-3 px-4 align-top text-right whitespace-nowrap space-x-1.5">
                      <button
                        type="button"
                        onClick={() => abrirEdicao(ativo)}
                        className="btn-tech sm text-xs py-1 px-2.5 inline-flex items-center gap-1 cursor-pointer"
                        title="Editar ativo"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      {confirmando ? (
                        <span className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              removerAtivo(ativo.id);
                              setConfirmandoExclusaoId(null);
                            }}
                            className="text-xs py-1 px-2 rounded-md bg-rose-600 text-white font-semibold inline-flex items-center gap-1 cursor-pointer"
                            title="Confirmar exclusão"
                          >
                            <Check className="w-3 h-3" />
                            <span>Confirmar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmandoExclusaoId(null)}
                            className="text-xs py-1 px-2 rounded-md border border-[var(--line)] text-[var(--muted)] cursor-pointer"
                            title="Cancelar"
                          >
                            Cancelar
                          </button>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmandoExclusaoId(ativo.id)}
                          className="p-1.5 rounded-lg text-[var(--muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors inline-flex items-center cursor-pointer"
                          title="Excluir ativo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {ativosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[var(--muted)]">
                    Nenhum ativo encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Cadastro/Edição */}
      {modalAberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[rgba(5,14,28,0.75)] backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[var(--card)] text-[var(--ink)] border-[1.5px] border-[var(--line)] rounded-2xl w-full max-w-xl p-5 sm:p-6 space-y-4 shadow-2xl my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <h2 className="text-[20px] font-bold">
                {ativoEditando ? 'Editar ativo' : 'Novo ativo'}
              </h2>
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvar} className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
              <label className="block text-xs font-bold text-[var(--ink)]">
                <span className="mb-1 block">Cliente vinculado *</span>
                <select
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                >
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nomeFantasia || c.razaoSocial}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-xs font-bold text-[var(--ink)]">
                <span className="mb-1 block">Identificação / TAG / Nome *</span>
                <input
                  type="text"
                  value={identificacao}
                  onChange={(e) => setIdentificacao(e.target.value)}
                  required
                  placeholder="Ex: Munck 12 t - Obra Marina ou PGX-9708"
                  className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block text-xs font-bold text-[var(--ink)]">
                  <span className="mb-1 block">Categoria *</span>
                  <select
                    value={categoriaId}
                    onChange={(e) => handleCategoriaChange(e.target.value)}
                    className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                  >
                    {categoriaId === CATEGORIA_LEGADO && (
                      <option value={CATEGORIA_LEGADO}>{tipo || 'Categoria antiga'}</option>
                    )}
                    {categoriasAtivosArvore.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nome}</option>
                    ))}
                  </select>
                </label>

                <label className="block text-xs font-bold text-[var(--ink)]">
                  <span className="mb-1 block">Subcategoria</span>
                  {subcategorias.length > 0 ? (
                    <select
                      value={subcategoria}
                      onChange={(e) => handleSubcategoriaChange(e.target.value)}
                      className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                    >
                      <option value="">Selecione a subcategoria</option>
                      {subcategorias.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={subcategoria}
                      onChange={(e) => handleSubcategoriaChange(e.target.value)}
                      placeholder="Ex.: Caminhão-pipa"
                      className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                    />
                  )}
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block text-xs font-bold text-[var(--ink)]">
                  <span className="mb-1 block">Capacidade</span>
                  <input
                    type="text"
                    value={capacidade}
                    onChange={(e) => setCapacidade(e.target.value)}
                    placeholder="Ex: 12 toneladas / 200T"
                    className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                  />
                </label>
                <div className="flex items-end">
                  <p className="text-xs text-[var(--muted)] pb-2">
                    A classificação acima é usada em orçamentos, checklists e laudos.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="block text-xs font-bold text-[var(--ink)]">
                  <span className="mb-1 block">Fabricante / Marca</span>
                  <input
                    type="text"
                    value={fabricante}
                    onChange={(e) => setFabricante(e.target.value)}
                    placeholder="Ex: MADAL / Renault"
                    className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                  />
                </label>

                <label className="block text-xs font-bold text-[var(--ink)]">
                  <span className="mb-1 block">Modelo</span>
                  <input
                    type="text"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    placeholder="Ex: MD 12500 / Duster"
                    className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                  />
                </label>

                <label className="block text-xs font-bold text-[var(--ink)]">
                  <span className="mb-1 block">Ano</span>
                  <input
                    type="text"
                    value={ano}
                    onChange={(e) => setAno(e.target.value)}
                    placeholder="Ex: 2022"
                    className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="block text-xs font-bold text-[var(--ink)]">
                  <span className="mb-1 block">Placa (se aplicável)</span>
                  <input
                    type="text"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value)}
                    placeholder="Ex: PGX-9708"
                    className="w-full p-2.5 text-sm uppercase border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                  />
                </label>

                <label className="block text-xs font-bold text-[var(--ink)]">
                  <span className="mb-1 block">Nº de Série</span>
                  <input
                    type="text"
                    value={numeroSerie}
                    onChange={(e) => setNumeroSerie(e.target.value)}
                    placeholder="Ex: SN-8492"
                    className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                  />
                </label>

                <label className="block text-xs font-bold text-[var(--ink)]">
                  <span className="mb-1 block">Chassi (opcional)</span>
                  <input
                    type="text"
                    value={chassi}
                    onChange={(e) => setChassi(e.target.value)}
                    placeholder="Nº Chassi"
                    className="w-full p-2.5 text-sm uppercase border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                  />
                </label>
              </div>

              <label className="block text-xs font-bold text-[var(--ink)]">
                <span className="mb-1 block">Localização / Obra</span>
                <input
                  type="text"
                  value={localizacao}
                  onChange={(e) => setLocalizacao(e.target.value)}
                  placeholder="Ex: Jaboatão dos Guararapes - PE"
                  className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                />
              </label>

              <div className="space-y-2">
                <span className="block text-xs font-bold text-[var(--ink)]">Foto do ativo <span className="font-normal text-[var(--muted)]">(opcional)</span></span>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[var(--line)] bg-[var(--paper)] p-3 text-sm text-[var(--muted)] hover:border-[var(--blue)]">
                  {fotoPreview
                    ? <img src={fotoPreview} alt="Pré-visualização do ativo" className="h-16 w-20 rounded-md object-cover" />
                    : <span className="flex h-16 w-20 items-center justify-center rounded-md bg-[var(--card)]"><ImagePlus className="h-6 w-6" /></span>}
                  <span>Escolher foto (JPG, PNG ou WebP; até 5 MB)</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                        setErroFormulario('Selecione uma imagem JPG, PNG ou WebP.');
                        event.target.value = '';
                        return;
                      }
                      if (file.size > 5 * 1024 * 1024) {
                        setErroFormulario('A foto deve ter no máximo 5 MB.');
                        event.target.value = '';
                        return;
                      }
                      setErroFormulario('');
                      setFotoArquivo(file);
                      setFotoPreview(URL.createObjectURL(file));
                    }}
                  />
                </label>
                {fotoPreview && (
                  <button type="button" onClick={() => { setFotoArquivo(null); setFotoPreview(''); }} className="text-xs font-semibold text-rose-500 hover:underline">
                    Remover foto
                  </button>
                )}
              </div>

              {erroFormulario && <p role="alert" className="rounded-lg bg-rose-500/10 p-2.5 text-xs font-medium text-rose-600">{erroFormulario}</p>}

              <div className="pt-3 flex justify-end gap-2 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="btn-tech text-sm cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-tech pri text-sm px-5 font-bold cursor-pointer"
                >
                  {ativoEditando ? 'Salvar alterações' : 'Salvar ativo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categorias e subcategorias */}
      <section className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-4 sm:p-5">
        <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[var(--ink)]">Categorias e subcategorias de ativos</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {categoriasAtivosArvore.length} categorias · {categoriasAtivos.length} opções disponíveis. Edite, renomeie ou exclua qualquer item — inclusive os padrões.
            </p>
          </div>
          <button type="button" onClick={abrirGerenciador} className="btn-tech pri min-h-11 cursor-pointer">
            <Layers className="mr-1.5 h-4 w-4" />
            Gerenciar categorias
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {categoriasAtivosArvore.map(cat => (
            <span key={cat.id} className="inline-flex flex-col rounded-lg border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-xs">
              <span className="font-bold text-[var(--ink)]">{cat.nome}</span>
              <span className="mt-0.5 text-[var(--muted)]">
                {cat.subcategorias.length > 0 ? cat.subcategorias.join(' · ') : 'sem subcategorias'}
              </span>
            </span>
          ))}
        </div>
      </section>

      {/* Modal Gerenciador de Categorias */}
      {gerenciadorAberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[rgba(5,14,28,0.75)] backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[var(--card)] text-[var(--ink)] border-[1.5px] border-[var(--line)] rounded-2xl w-full max-w-3xl p-5 sm:p-6 space-y-4 shadow-2xl my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h2 className="text-[20px] font-bold">Gerenciar categorias de ativos</h2>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Renomeie ou exclua categorias e subcategorias. As alterações também atualizam os ativos já cadastrados.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setGerenciadorAberto(false)}
                className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
              {rascunhoCategorias.map(cat => {
                const emUso = ativos.some(a =>
                  a.categoriaId === cat.id ||
                  a.tipo === cat.nome ||
                  a.subcategoria === cat.nome ||
                  cat.subcategorias.some(sub => a.tipo === sub || a.subcategoria === sub)
                );

                return (
                  <div key={cat.id} className="rounded-xl border border-[var(--line)] bg-[var(--paper)] p-3 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                      <label className="flex-1 text-xs font-bold">
                        <span className="mb-1 block text-[var(--muted)]">Nome da categoria</span>
                        <input
                          type="text"
                          value={cat.nome}
                          onChange={(e) => atualizarCategoriaNoRascunho(cat.id, anterior => ({ ...anterior, nome: e.target.value }))}
                          className="w-full p-2 text-sm border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                        />
                      </label>
                      {removendoCategoriaId === cat.id ? (
                        <div className="flex items-center gap-1.5 sm:mt-5">
                          <button
                            type="button"
                            onClick={() => removerCategoriaDoRascunho(cat.id)}
                            className="text-xs py-2 px-2.5 rounded-md bg-rose-600 text-white font-semibold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3 h-3" /> Confirmar
                          </button>
                          <button
                            type="button"
                            onClick={() => setRemovendoCategoriaId(null)}
                            className="text-xs py-2 px-2.5 rounded-md border border-[var(--line)] text-[var(--muted)] cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setRemovendoCategoriaId(cat.id)}
                          className="mt-4 sm:mt-5 p-2 rounded-lg text-[var(--muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title={emUso ? 'Categoria em uso — os ativos manterão o texto atual' : 'Excluir categoria'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {emUso && removendoCategoriaId === cat.id && (
                      <p className="text-xs text-amber-600">
                        Esta categoria está vinculada a ativos. Ao confirmar, os ativos manterão o texto atual, mas a categoria desaparecerá das opções.
                      </p>
                    )}

                    <div className="pl-1">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--muted)] mb-1.5">Subcategorias</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {cat.subcategorias.map((sub, indice) => (
                          <span key={`${cat.id}-${indice}`} className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--card)] px-2 py-1 text-xs">
                            <input
                              type="text"
                              value={sub}
                              onChange={(e) => atualizarCategoriaNoRascunho(cat.id, anterior => ({
                                ...anterior,
                                subcategorias: anterior.subcategorias.map((s, i) => i === indice ? e.target.value : s),
                              }))}
                              className="w-32 bg-transparent text-[var(--ink)] focus:outline-none"
                              aria-label={`Editar subcategoria ${sub}`}
                            />
                            <button
                              type="button"
                              onClick={() => atualizarCategoriaNoRascunho(cat.id, anterior => ({
                                ...anterior,
                                subcategorias: anterior.subcategorias.filter((_, i) => i !== indice),
                              }))}
                              className="rounded-full p-0.5 text-[var(--muted)] hover:text-rose-500 cursor-pointer"
                              aria-label={`Remover subcategoria ${sub}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                        {cat.subcategorias.length === 0 && (
                          <span className="text-xs text-[var(--muted)]">Nenhuma subcategoria cadastrada.</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={novasSubcategorias[cat.id] || ''}
                          onChange={(e) => setNovasSubcategorias(prev => ({ ...prev, [cat.id]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              adicionarSubcategoriaNoRascunho(cat.id);
                            }
                          }}
                          placeholder="Nova subcategoria (Ex.: Caminhão-pipa)"
                          aria-label={`Nova subcategoria de ${cat.nome}`}
                          className="flex-1 p-2 text-xs border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                        />
                        <button
                          type="button"
                          onClick={() => adicionarSubcategoriaNoRascunho(cat.id)}
                          className="btn-tech sm text-xs px-3 cursor-pointer inline-flex items-center"
                        >
                          <Plus className="w-3.5 h-3.5" /> Adicionar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              <button type="button" onClick={adicionarNovaCategoria} className="btn-tech text-sm cursor-pointer">
                <Plus className="w-4 h-4 mr-1.5" /> Nova categoria
              </button>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-[var(--line)]">
              <button type="button" onClick={() => setGerenciadorAberto(false)} className="btn-tech text-sm cursor-pointer">
                Cancelar
              </button>
              <button type="button" onClick={salvarGerenciador} className="btn-tech pri text-sm px-5 font-bold cursor-pointer">
                Salvar categorias
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
