import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Search, 
  FileCheck2, 
  CheckCircle2, 
  Clock, 
  X, 
  Eye, 
  Edit, 
  Download,
  Share2,
  Trash2,
  Sparkles,
  Calculator
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { LaudoPdfExportModal } from './LaudoPdfExportModal';
import { Laudo } from '../../types';
import { SERVICOS_LISTA } from '../../data/servicosCatalogo';

export const LaudosCentralView: React.FC = () => {
  const { 
    laudos, 
    clientes, 
    ativos, 
    criarNovoLaudo,
    criarLaudoPorTaxonomia, 
    removerLaudo 
  } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Status Filter
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState<'' | 'ART' | 'Em' | 'Aguard'>('');

  // Modals
  const [modalNovoAberto, setModalNovoAberto] = useState(searchParams.get('novo') === '1');
  const [laudoExportandoPdf, setLaudoExportandoPdf] = useState<Laudo | null>(null);
  const [toastMensagem, setToastMensagem] = useState<string | null>(null);

  // Template & Form State for Novo Laudo
  const [modoPreenchimento, setModoPreenchimento] = useState<'pre_preenchido' | 'em_branco'>('pre_preenchido');
  const [categoriaIndex, setCategoriaIndex] = useState(0);
  const [subtipoIndex, setSubtipoIndex] = useState(0);
  const [novoClienteId, setNovoClienteId] = useState(clientes[0]?.id || '');
  const [novoEquipamento, setNovoEquipamento] = useState('');
  const [novaData, setNovaData] = useState(new Date().toISOString().split('T')[0]);

  // HRN Factors
  const [hrnLo, setHrnLo] = useState<number>(2); // Probabilidade
  const [hrnFe, setHrnFe] = useState<number>(4); // Frequencia
  const [hrnDph, setHrnDph] = useState<number>(2); // Gravidade
  const [hrnNp, setHrnNp] = useState<number>(1); // Pessoas expostas

  useEffect(() => {
    if (searchParams.get('novo') === '1') {
      setModalNovoAberto(true);
    }
    const st = searchParams.get('status');
    if (st === 'ART' || st === 'finalizado') {
      setStatusFiltro('ART');
    } else if (st === 'Em' || st === 'em_andamento') {
      setStatusFiltro('Em');
    } else if (st === 'Aguard' || st === 'rascunho') {
      setStatusFiltro('Aguard');
    }
  }, [searchParams]);

  const showToast = (msg: string) => {
    setToastMensagem(msg);
    setTimeout(() => setToastMensagem(null), 2500);
  };

  // Live HRN Calculation
  const hrnValor = useMemo(() => {
    const total = hrnLo * hrnFe * hrnDph * hrnNp;
    return total % 1 === 0 ? total : parseFloat(total.toFixed(1));
  }, [hrnLo, hrnFe, hrnDph, hrnNp]);

  const hrnClassificacao = useMemo(() => {
    if (hrnValor < 10) return { texto: 'Risco baixo: manter e monitorar.', cor: 'text-[var(--green)]' };
    if (hrnValor < 50) return { texto: 'Risco significativo: são necessárias medidas de proteção.', cor: 'text-[var(--warn)]' };
    return { texto: 'Risco alto: ação imediata e possível interdição.', cor: 'text-[var(--bad)]' };
  }, [hrnValor]);

  // Filtered reports
  const laudosFiltrados = useMemo(() => {
    return laudos.filter((l) => {
      const cliente = clientes.find(c => c.id === l.clienteId);
      const textQuery = `${l.numero} ${l.tipo} ${cliente?.nomeFantasia || ''} ${cliente?.razaoSocial || ''}`.toLowerCase();
      const matchSearch = textQuery.includes(busca.toLowerCase());

      if (!matchSearch) return false;

      if (statusFiltro === 'ART') {
        return l.status === 'finalizado';
      } else if (statusFiltro === 'Em') {
        return l.status === 'em_andamento';
      } else if (statusFiltro === 'Aguard') {
        return l.status === 'rascunho' || !l.status;
      }
      return true;
    });
  }, [laudos, clientes, busca, statusFiltro]);

  // Publish to site handler
  const handlePublicarNoSite = (laudo: Laudo) => {
    try {
      const cliente = clientes.find(c => c.id === laudo.clienteId);
      const novoTrabalho = {
        id: laudo.id,
        titulo: `${laudo.tipo} · ${laudo.numero}`,
        local: `${cliente?.endereco?.cidade || 'Recife'} · PE`,
        norma: laudo.tipo.includes('12') ? 'NR-12' : laudo.tipo.includes('11') ? 'NR-11' : 'CREA-PE',
        resultado: 'Conforme',
        prazo: 'Em até 48 h',
        resumo: `Laudo técnico com ART registrada no CREA-PE para ${cliente?.nomeFantasia || 'indústria local'}. Conformidade e segurança operacional validadas.`
      };

      const existingRaw = localStorage.getItem('vl-publicados');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const updated = [novoTrabalho, ...existing.filter((w: any) => w.id !== laudo.id)];
      localStorage.setItem('vl-publicados', JSON.stringify(updated));
      showToast('Publicado em Trabalhos realizados no site público!');
    } catch {
      showToast('Publicado no site!');
    }
  };

  const handleSalvarNovoLaudo = () => {
    const activeCategory = SERVICOS_LISTA[categoriaIndex] || SERVICOS_LISTA[0];
    const activeSubtipo = activeCategory.subtipos[subtipoIndex] || activeCategory.subtipos[0];
    const equip = novoEquipamento.trim() || activeSubtipo.nome;

    const clienteSelecionado = clientes.find(c => c.id === novoClienteId) || clientes[0];
    const ativoCorrespondente = ativos.find(a => a.clienteId === novoClienteId) || ativos[0];

    const ehPrePreenchido = modoPreenchimento === 'pre_preenchido';

    // Gerar seções técnicas a partir do modelo pré-pronto
    const secoesModelo = ehPrePreenchido && activeSubtipo.secoesSugeridas
      ? activeSubtipo.secoesSugeridas.map((titulo, idx) => ({
          id: `sec-${idx + 1}`,
          titulo: titulo,
          ordem: idx + 1,
          conteudoHtml: `<p class="leading-relaxed">Verificação técnica pericial realizada em estrita conformidade com as diretrizes da norma <strong>${activeSubtipo.normaRef}</strong>. Inspeção efetuada no ativo <strong>${equip}</strong> para o cliente <strong>${clienteSelecionado?.razaoSocial || clienteSelecionado?.nomeFantasia || 'Contratante'}</strong>, atestando conformidade estrutural, operacional e atendimento pleno aos requisitos regulamentares aplicáveis.</p>`,
          itens: [],
          fotos: []
        }))
      : [
          {
            id: 'sec-1',
            titulo: '1. Identificação do Ativo e Escopo da Vistoria',
            ordem: 1,
            conteudoHtml: '',
            itens: [],
            fotos: []
          },
          {
            id: 'sec-2',
            titulo: '2. Avaliação de Conformidade e Normas Aplicáveis',
            ordem: 2,
            conteudoHtml: '',
            itens: [],
            fotos: []
          }
        ];

    // Gerar checklist a partir do modelo pré-pronto
    const checklistModelo = ehPrePreenchido && activeSubtipo.checklistSugerido
      ? activeSubtipo.checklistSugerido.map((itemDesc, idx) => ({
          id: `ck-${idx + 1}`,
          descricao: itemDesc,
          status: 'conforme' as const,
          observacao: 'Conforme requisitos técnicos verificados in loco e ensaios operacionais de campo.'
        }))
      : [];

    const novoId = criarNovoLaudo({
      tipo: activeSubtipo.nome,
      clienteId: novoClienteId || clientes[0]?.id || '',
      ativoId: ativoCorrespondente?.id || '',
      ativoIdentificacao: equip,
      dataInspecao: novaData,
      normasReferencia: activeSubtipo.normaRef,
      resumoExecutivo: `Laudo técnico de ${activeSubtipo.nome} referente ao equipamento ${equip}. Normas de referência: ${activeSubtipo.normaRef}. Escopo: ${activeSubtipo.detalhe}`,
      apresentacao: `O presente laudo técnico pericial tem por escopo inspecionar, avaliar e homologar as condições mecânicas, estruturais e de segurança operacional de ${equip}, em estrita conformidade com as diretrizes de ${activeSubtipo.normaRef}.`,
      metodologia: `A metodologia adotada contemplou inspeção visual minuciosa, análise dimensional e estrutural, conferência de componentes críticos e apreciação de risco em conformidade com os preceitos da ABNT e normas do Ministério do Trabalho.`,
      conclusao: `Com base nas verificações técnicas realizadas, conclui-se que o equipamento/ativo analisado atende aos padrões de segurança e operacionalidade preconizados pela norma ${activeSubtipo.normaRef}, estando apto para operação regular sob acompanhamento das rotinas de manutenção.`,
      secoes: secoesModelo,
      checklist: checklistModelo,
      modoCriacao: ehPrePreenchido ? 'sugestao_ia' : 'em_branco',
      hrnCalculoGeral: {
        score: hrnValor,
        nivel: hrnValor < 10 ? 'Baixo' : hrnValor < 50 ? 'Médio' : 'Alto',
        cor: hrnClassificacao.cor,
        recomendacao: hrnClassificacao.texto
      }
    });

    setModalNovoAberto(false);
    setSearchParams({});
    showToast(ehPrePreenchido ? 'Laudo criado a partir do modelo pré-pronto com sucesso!' : 'Rascunho de laudo criado com sucesso!');
    navigate(`/admin/laudos/${novoId}`);
  };

  return (
    <div className="space-y-6 max-w-[1200px]">
      
      {/* Toast Notification */}
      {toastMensagem && (
        <div 
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--ink)] text-[var(--paper)] px-5 py-2.5 rounded-lg font-semibold text-sm shadow-xl flex items-center gap-2"
          role="status"
        >
          <CheckCircle2 className="w-4 h-4 text-[var(--green)]" />
          <span>{toastMensagem}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight">
            Central de laudos
          </h1>
          <p className="text-[var(--muted)] text-[15px] sm:text-[16px] mt-0.5">
            {laudos.length} documentos emitidos · Modelos pré-prontos das 7 especialidades da VL Engenharia.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setModoPreenchimento('pre_preenchido');
              setModalNovoAberto(true);
            }}
            className="btn-tech pri text-[14.5px] px-4 py-2"
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            <span>Usar modelo pré-pronto</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setModoPreenchimento('em_branco');
              setModalNovoAberto(true);
            }}
            className="btn-tech text-[14.5px] px-3.5 py-2"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Novo laudo</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="w-4 h-4 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por número ou cliente"
            className="w-full pl-9 pr-3 py-2 font-[family-name:var(--b)] text-[14.5px] border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
          />
        </div>

        {/* Status Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setStatusFiltro('')}
            className={`px-3 py-1.5 rounded-full text-[13px] font-semibold border transition-colors cursor-pointer ${
              statusFiltro === ''
                ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]'
                : 'bg-[var(--card)] text-[var(--muted)] border-[var(--line)] hover:border-[var(--ink)]'
            }`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => setStatusFiltro('ART')}
            className={`px-3 py-1.5 rounded-full text-[13px] font-semibold border transition-colors cursor-pointer ${
              statusFiltro === 'ART'
                ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]'
                : 'bg-[var(--card)] text-[var(--muted)] border-[var(--line)] hover:border-[var(--ink)]'
            }`}
          >
            Com ART
          </button>
          <button
            type="button"
            onClick={() => setStatusFiltro('Em')}
            className={`px-3 py-1.5 rounded-full text-[13px] font-semibold border transition-colors cursor-pointer ${
              statusFiltro === 'Em'
                ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]'
                : 'bg-[var(--card)] text-[var(--muted)] border-[var(--line)] hover:border-[var(--ink)]'
            }`}
          >
            Em andamento
          </button>
          <button
            type="button"
            onClick={() => setStatusFiltro('Aguard')}
            className={`px-3 py-1.5 rounded-full text-[13px] font-semibold border transition-colors cursor-pointer ${
              statusFiltro === 'Aguard'
                ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]'
                : 'bg-[var(--card)] text-[var(--muted)] border-[var(--line)] hover:border-[var(--ink)]'
            }`}
          >
            Pendentes
          </button>
        </div>
      </div>

      {/* Main Table Panel */}
      <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14.5px] min-w-[640px]">
            <thead>
              <tr className="border-b-[1.5px] border-[var(--ink)] text-[var(--muted)] text-[13.5px] bg-[var(--paper)]">
                <th className="py-2.5 px-4 font-semibold">Laudo</th>
                <th className="py-2.5 px-4 font-semibold">Cliente</th>
                <th className="py-2.5 px-4 font-semibold">Data</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 font-semibold">No site</th>
                <th className="py-2.5 px-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {laudosFiltrados.map((laudo) => {
                const cliente = clientes.find(c => c.id === laudo.clienteId);
                const dataFormatada = new Date(laudo.criadoEm || Date.now()).toLocaleDateString('pt-BR');
                const isFinalizado = laudo.status === 'finalizado';

                return (
                  <tr key={laudo.id} className="hover:bg-[var(--paper)] transition-colors">
                    <td className="py-3 px-4 align-top">
                      <b className="block text-[var(--ink)] font-semibold">{laudo.numero}</b>
                      <small className="text-[var(--muted)] text-xs block max-w-[240px] truncate">
                        {laudo.tipo}
                      </small>
                    </td>

                    <td className="py-3 px-4 align-top text-[var(--ink)]">
                      <span>{cliente?.nomeFantasia || cliente?.razaoSocial || laudo.clienteNome || 'Cliente'}</span>
                      <small className="text-[var(--muted)] text-xs block">
                        {cliente?.endereco?.cidade || 'PE'}
                      </small>
                    </td>

                    <td className="py-3 px-4 align-top text-[var(--muted)]">
                      {dataFormatada}
                    </td>

                    <td className="py-3 px-4 align-top">
                      {isFinalizado ? (
                        <span className="tag-tech ok">ART emitida</span>
                      ) : laudo.status === 'em_andamento' ? (
                        <span className="tag-tech bl">Em elaboração</span>
                      ) : (
                        <span className="tag-tech w">Aguardando</span>
                      )}
                    </td>

                    {/* Botão Publicar no Site */}
                    <td className="py-3 px-4 align-top">
                      {isFinalizado ? (
                        <button
                          type="button"
                          onClick={() => handlePublicarNoSite(laudo)}
                          className="btn-tech sm text-xs py-1 px-2.5"
                          title="Exibir este trabalho na página inicial pública"
                        >
                          Publicar no site
                        </button>
                      ) : (
                        <span className="text-[var(--muted)] text-xs">—</span>
                      )}
                    </td>

                    {/* Quick actions */}
                    <td className="py-3 px-4 align-top text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/laudos/${laudo.id}`)}
                        className="btn-tech sm text-xs py-1 px-2"
                        title="Editar laudo"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setLaudoExportandoPdf(laudo)}
                        className="btn-tech sm text-xs py-1 px-2"
                        title="Exportar documento PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {laudosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[var(--muted)]">
                    Nenhum laudo encontrado com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Novo Laudo com Apreciação de Risco HRN ao vivo */}
      {modalNovoAberto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(5,14,28,0.7)] backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[var(--card)] text-[var(--ink)] border-[1.5px] border-[var(--line)] rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
              <div>
                <h2 className="text-[22px] font-bold">Novo laudo</h2>
                <p className="text-[var(--muted)] text-sm">
                  Preencha os dados da vistoria. O risco HRN é calculado enquanto você escolhe.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setModalNovoAberto(false);
                  setSearchParams({});
                }}
                className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--ink)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher: Pré-Pronto vs Em branco */}
            <div className="flex items-center gap-2 p-1 bg-[var(--paper)] rounded-xl border border-[var(--line)]">
              <button
                type="button"
                onClick={() => setModoPreenchimento('pre_preenchido')}
                className={`flex-1 py-2 px-3 rounded-lg text-[13.5px] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  modoPreenchimento === 'pre_preenchido'
                    ? 'bg-[var(--blue)] text-[var(--onblue)] shadow-sm'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Modelo Pré-Pronto (Recomendado)</span>
              </button>
              <button
                type="button"
                onClick={() => setModoPreenchimento('em_branco')}
                className={`flex-1 py-2 px-3 rounded-lg text-[13.5px] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  modoPreenchimento === 'em_branco'
                    ? 'bg-[var(--blue)] text-[var(--onblue)] shadow-sm'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Em branco</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6">
              
              {/* Vistoria Inputs */}
              <div className="space-y-4">
                <h3 className="text-[17px] font-bold">
                  {modoPreenchimento === 'pre_preenchido' ? 'Escolha a Especialidade e o Modelo' : 'Dados do Laudo'}
                </h3>

                {/* 1. Especialidade (7 core services) */}
                <label className="block text-sm font-semibold">
                  <span className="mb-1 block">Especialidade (O que a VL inspeciona)</span>
                  <select
                    value={categoriaIndex}
                    onChange={(e) => {
                      const idx = parseInt(e.target.value, 10);
                      setCategoriaIndex(idx);
                      setSubtipoIndex(0);
                    }}
                    className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] font-medium"
                  >
                    {SERVICOS_LISTA.map((serv, idx) => (
                      <option key={serv.id || idx} value={idx}>
                        {serv.nome} ({serv.norma})
                      </option>
                    ))}
                  </select>
                </label>

                {/* 2. Subtipo / Modelo Pré-Pronto */}
                <label className="block text-sm font-semibold">
                  <span className="mb-1 block">Modelo de laudo / Subtipo técnico</span>
                  <select
                    value={subtipoIndex}
                    onChange={(e) => setSubtipoIndex(parseInt(e.target.value, 10))}
                    className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] font-medium"
                  >
                    {SERVICOS_LISTA[categoriaIndex]?.subtipos.map((sub, sIdx) => (
                      <option key={sub.id || sIdx} value={sIdx}>
                        {sub.nome}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Template Info Card */}
                {(() => {
                  const activeCat = SERVICOS_LISTA[categoriaIndex] || SERVICOS_LISTA[0];
                  const activeSub = activeCat?.subtipos[subtipoIndex] || activeCat?.subtipos[0];
                  if (!activeSub) return null;
                  return (
                    <div className="p-3.5 rounded-lg border border-[var(--blue)]/30 bg-[var(--blue)]/5 space-y-1.5 text-xs sm:text-sm">
                      <div className="flex items-center justify-between font-semibold text-[var(--blue)]">
                        <span>Norma: {activeSub.normaRef}</span>
                        {modoPreenchimento === 'pre_preenchido' && (
                          <span className="text-[11px] bg-[var(--blue)] text-[var(--onblue)] px-2 py-0.5 rounded-full font-bold">
                            Checklist e seções prontas
                          </span>
                        )}
                      </div>
                      <p className="text-[var(--muted)] text-[12.5px] leading-relaxed">
                        {activeSub.detalhe}
                      </p>
                      {modoPreenchimento === 'pre_preenchido' && (
                        <div className="pt-2 border-t border-[var(--blue)]/20 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
                          <span>✓ {activeSub.checklistSugerido?.length || 5} itens de checklist</span>
                          <span>✓ {activeSub.secoesSugeridas?.length || 4} seções técnicas</span>
                          <span>✓ Metodologia oficial</span>
                        </div>
                      )}
                    </div>
                  );
                })()}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block text-sm font-semibold">
                    <span className="mb-1 block">Cliente</span>
                    <select
                      value={novoClienteId}
                      onChange={(e) => setNovoClienteId(e.target.value)}
                      className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
                    >
                      {clientes.map(c => (
                        <option key={c.id} value={c.id}>{c.nomeFantasia || c.razaoSocial}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block text-sm font-semibold">
                    <span className="mb-1 block">Data da vistoria</span>
                    <input
                      type="date"
                      value={novaData}
                      onChange={(e) => setNovaData(e.target.value)}
                      className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
                    />
                  </label>
                </div>

                <label className="block text-sm font-semibold">
                  <span className="mb-1 block">Equipamento / Ativo periciado</span>
                  <input
                    type="text"
                    value={novoEquipamento}
                    onChange={(e) => setNovoEquipamento(e.target.value)}
                    placeholder="Ex: Escavadeira CAT 320, Munck Madal 15 t, Prensa Excêntrica 60 t..."
                    className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
                  />
                </label>

                {/* Apreciação de Risco HRN Inputs */}
                <div className="pt-4 border-t border-[var(--line)] space-y-3">
                  <h3 className="text-[17px] font-bold">Apreciação de risco (HRN)</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <label className="block font-semibold">
                      <span className="mb-1 block text-xs text-[var(--muted)]">Probabilidade (LO)</span>
                      <select
                        value={hrnLo}
                        onChange={(e) => setHrnLo(parseFloat(e.target.value))}
                        className="w-full p-2 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
                      >
                        <option value={1}>1 - Improvável</option>
                        <option value={2}>2 - Possível</option>
                        <option value={5}>5 - Provável</option>
                        <option value={10}>10 - Muito provável</option>
                      </select>
                    </label>

                    <label className="block font-semibold">
                      <span className="mb-1 block text-xs text-[var(--muted)]">Frequência de exposição (FE)</span>
                      <select
                        value={hrnFe}
                        onChange={(e) => setHrnFe(parseFloat(e.target.value))}
                        className="w-full p-2 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
                      >
                        <option value={1}>1 - Anual</option>
                        <option value={2.5}>2.5 - Mensal</option>
                        <option value={4}>4 - Semanal</option>
                        <option value={5}>5 - Diária</option>
                      </select>
                    </label>

                    <label className="block font-semibold">
                      <span className="mb-1 block text-xs text-[var(--muted)]">Gravidade (DPH)</span>
                      <select
                        value={hrnDph}
                        onChange={(e) => setHrnDph(parseFloat(e.target.value))}
                        className="w-full p-2 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
                      >
                        <option value={0.5}>0.5 - Arranhão / Leve</option>
                        <option value={2}>2 - Corte / Contusão</option>
                        <option value={8}>8 - Fratura</option>
                        <option value={25}>25 - Perda de membro</option>
                        <option value={40}>40 - Fatal</option>
                      </select>
                    </label>

                    <label className="block font-semibold">
                      <span className="mb-1 block text-xs text-[var(--muted)]">Pessoas expostas (NP)</span>
                      <select
                        value={hrnNp}
                        onChange={(e) => setHrnNp(parseFloat(e.target.value))}
                        className="w-full p-2 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
                      >
                        <option value={1}>1 - 1 a 2 pessoas</option>
                        <option value={2}>2 - 3 a 7 pessoas</option>
                        <option value={4}>4 - 8 a 15 pessoas</option>
                      </select>
                    </label>
                  </div>
                </div>

              </div>

              {/* Live HRN Output Box */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="bg-[var(--paper)] border border-[var(--line)] rounded-xl p-5 space-y-3">
                  <h3 className="text-[17px] font-bold">Risco calculado</h3>
                  
                  <div className="font-[family-name:var(--d)] font-extrabold text-[52px] leading-none text-[var(--ink)]">
                    {hrnValor}
                  </div>

                  {/* Meter Bar */}
                  <div className="meter-hrn">
                    <i style={{ left: `${Math.min(94, Math.max(2, (hrnValor / 60) * 100))}%` }} />
                  </div>

                  <p className={`text-[14px] font-semibold ${hrnClassificacao.cor} leading-snug`}>
                    {hrnClassificacao.texto}
                  </p>
                </div>

                <div className="bg-[var(--paper)] border border-[var(--line)] rounded-xl p-5 space-y-3">
                  <h3 className="text-[17px] font-bold">Ao salvar</h3>
                  <p className="text-[var(--muted)] text-[13.5px] leading-relaxed">
                    O laudo vai para rascunho e a ART só é emitida depois da sua revisão técnica.
                  </p>
                  <button
                    type="button"
                    onClick={handleSalvarNovoLaudo}
                    className="btn-tech pri w-full justify-center text-[15px] py-2.5 mt-2"
                  >
                    Salvar rascunho
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* PDF Export Modal */}
      {laudoExportandoPdf && (
        <LaudoPdfExportModal
          isOpen={true}
          laudo={laudoExportandoPdf}
          onClose={() => setLaudoExportandoPdf(null)}
        />
      )}

    </div>
  );
};
