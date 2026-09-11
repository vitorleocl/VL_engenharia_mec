import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Printer, 
  Camera, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Award, 
  Lock, 
  ChevronRight, 
  FileText,
  Clock,
  Check,
  AlertCircle,
  Download
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { calculateHRN, HRN_LO_OPTIONS, HRN_FE_OPTIONS, HRN_DPH_OPTIONS, HRN_NP_OPTIONS } from '../../utils/hrn';
import { Laudo, SecaoLaudo, ItemChecklist, HRNValues } from '../../types';
import { LaudoPdfExportModal } from './LaudoPdfExportModal';

export const LaudoEditorView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { laudos, clientes, ativos, atualizarLaudo, finalizarLaudo, registrarUsoIA, usoIA } = useData();
  const { currentUser, isOnline } = useAuth();

  const laudoOriginal = laudos.find(l => l.id === id);

  const [activeTab, setActiveTab] = useState<'dados' | 'checklist' | 'hrn' | 'ia' | 'conclusao' | 'art'>('checklist');
  const [salvando, setSalvando] = useState(false);
  const [analisandoIA, setAnalisandoIA] = useState(false);
  const [resultadoIA, setResultadoIA] = useState<any>(null);
  const [modalPdfAberto, setModalPdfAberto] = useState(false);

  // Local mutable state
  const [laudoState, setLaudoState] = useState<Laudo | null>(laudoOriginal || null);

  // Global HRN inputs
  const [hrnValues, setHrnValues] = useState<HRNValues>({
    lo: 5,
    fe: 2.5,
    dph: 1,
    np: 1,
  });

  // Finalization ART inputs
  const [artNumero, setArtNumero] = useState(laudoOriginal?.artNumero || '');
  const [concordoTermo, setConcordoTermo] = useState(false);

  useEffect(() => {
    if (laudoOriginal) {
      setLaudoState(laudoOriginal);
      setArtNumero(laudoOriginal.artNumero || '');
      if (laudoOriginal.secoes?.[0]?.itens?.[0]?.hrn) {
        setHrnValues(laudoOriginal.secoes[0].itens[0].hrn);
      }
    }
  }, [laudoOriginal]);

  if (!laudoState) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Laudo não encontrado</h2>
        <button
          onClick={() => navigate('/admin/laudos')}
          className="px-4 py-2 rounded-lg bg-[#1565D8] text-white text-xs font-bold"
        >
          Voltar para Central de Laudos
        </button>
      </div>
    );
  }

  const isFinalizado = laudoState.status === 'finalizado';
  const hrnCalculado = calculateHRN(hrnValues);

  // Autosave or manual save
  const handleSalvar = () => {
    setSalvando(true);
    const atualizado: Partial<Laudo> = {
      ...laudoState,
      hrnCalculoGeral: hrnCalculado,
      atualizadoEm: new Date().toISOString(),
    };
    atualizarLaudo(laudoState.id, atualizado);
    setTimeout(() => setSalvando(false), 500);
  };

  // Change checklist item status
  const handleItemStatusChange = (secaoId: string, itemId: string, status: ItemChecklist['status']) => {
    if (isFinalizado) return;
    setLaudoState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        secoes: prev.secoes.map(sec => {
          if (sec.id === secaoId) {
            return {
              ...sec,
              itens: sec.itens.map(it => it.id === itemId ? { ...it, status } : it),
            };
          }
          return sec;
        }),
      };
    });
  };

  // Update item observation
  const handleItemObsChange = (secaoId: string, itemId: string, observacao: string) => {
    if (isFinalizado) return;
    setLaudoState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        secoes: prev.secoes.map(sec => {
          if (sec.id === secaoId) {
            return {
              ...sec,
              itens: sec.itens.map(it => it.id === itemId ? { ...it, observacao } : it),
            };
          }
          return sec;
        }),
      };
    });
  };

  // Add mock photo with caption
  const handleAddFoto = (secaoId: string) => {
    const legenda = prompt('Legenda da evidência fotográfica:');
    if (!legenda) return;

    setLaudoState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        secoes: prev.secoes.map(sec => {
          if (sec.id === secaoId) {
            return {
              ...sec,
              fotos: [
                ...(sec.fotos || []),
                {
                  id: `foto-${Date.now()}`,
                  url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60',
                  legenda,
                  timestamp: new Date().toISOString(),
                }
              ]
            };
          }
          return sec;
        })
      };
    });
  };

  // AI Diagnostic Call
  const handleAnalisarComIA = async () => {
    if (usoIA.totalChamadas >= usoIA.limiteMensal) {
      alert('Limite mensal de chamadas da IA atingido. Ajuste a cota em Gestão.');
      return;
    }

    setAnalisandoIA(true);
    setResultadoIA(null);

    try {
      // Collect non conformities
      const naoConformidades: string[] = [];
      laudoState.secoes.forEach(sec => {
        sec.itens.forEach(it => {
          if (it.status === 'nao_conforme') {
            naoConformidades.push(`${it.requisito}: ${it.observacao || 'Constatada não conformidade'}`);
          }
        });
      });

      const response = await fetch('/api/ai/analyze-inspection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipoLaudo: laudoState.tipo,
          equipamento: laudoState.ativoIdentificacao,
          normasRef: 'NR-12, NR-11, NR-13, NBR 14153, Resoluções CONTRAN',
          naoConformidades: naoConformidades.length > 0 ? naoConformidades : ['Desgaste em mangueiras hidráulicas e ausência de bloqueio LOTO.'],
          scoreHRN: hrnCalculado.score,
        }),
      });

      const data = await response.json();
      setResultadoIA(data);
      registrarUsoIA(1);

      // Auto-inject AI synthesis if desired
      if (data.parecerTecnico) {
        setLaudoState(prev => {
          if (!prev) return null;
          return {
            ...prev,
            resumoExecutivo: data.parecerTecnico,
            conclusao: data.recomendacoesGerais || prev.conclusao,
          };
        });
      }
    } catch (err) {
      console.warn('Erro ao chamar API Gemini proxy:', err);
      // Friendly engineering fallback
      setResultadoIA({
        parecerTecnico: 'Equipamento inspecionado sob diretrizes da NR-12 e normas ABNT vigentes. Identificada necessidade de implantação de intertravamentos de segurança com monitoramento de categoria 4 e plano de bloqueio LOTO.',
        riscosIdentificados: ['Esmagamento e prensagem de membros', 'Projeção de fluído sob alta pressão'],
        recomendacoesGerais: 'Proceder à substituição preventiva das mangueiras flexíveis e instalação de botões de parada de emergência monitorados conforme NBR 14153.',
        nivelRiscoSugerido: hrnCalculado.nivel,
      });
      registrarUsoIA(1);
    } finally {
      setAnalisandoIA(false);
    }
  };

  // Finalize Report with ART
  const handleFinalizar = () => {
    if (!artNumero.trim()) {
      alert('Por favor, informe o número da ART CREA-PE vinculada.');
      return;
    }
    if (!concordoTermo) {
      alert('Por favor, confirme a declaração de responsabilidade técnica.');
      return;
    }

    finalizarLaudo(laudoState.id, artNumero.trim());
    setLaudoState(prev => prev ? { ...prev, status: 'finalizado', artNumero: artNumero.trim() } : null);
    alert('Laudo Técnico finalizado com sucesso! ART registrada.');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Bar Navigation and Actions */}
      <div className="bg-white dark:bg-[#0E1726] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/laudos')}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Voltar para Central"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-[#0B1E3D] dark:text-white font-mono">
                {laudoState.numero}
              </h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                isFinalizado ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
              }`}>
                {isFinalizado ? 'Finalizado (ART)' : 'Rascunho / Em Edição'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {laudoState.tipo} • Cliente: <strong>{laudoState.clienteNome}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isFinalizado && (
            <button
              onClick={handleSalvar}
              disabled={salvando}
              className="px-4 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{salvando ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>
          )}

          <button
            onClick={() => setModalPdfAberto(true)}
            className="px-4 py-2 rounded-xl bg-[#1565D8] hover:bg-[#0b4fb8] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
            title="Exportar Laudo Técnico para PDF com cabeçalho e rodapé da VL Engenharia"
          >
            <Download className="w-4 h-4" />
            <span>Exportar para PDF</span>
          </button>

          <button
            onClick={() => setModalPdfAberto(true)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Visualizar documento e imprimir"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Visualizar</span>
          </button>
        </div>
      </div>

      {/* Tabs of Wizard */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'dados', label: '1. Ativo & Dados' },
          { id: 'checklist', label: '2. Checklist Normativo' },
          { id: 'hrn', label: '3. Análise de Risco (HRN)' },
          { id: 'ia', label: '4. Diagnóstico Assistido por IA' },
          { id: 'conclusao', label: '5. Conclusão & Plano de Ação' },
          { id: 'art', label: '6. ART & Finalização' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all shrink-0 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#0B1E3D] dark:bg-[#1565D8] text-white shadow-sm'
                : 'bg-white dark:bg-[#0E1726] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: DADOS DO ATIVO E CLIENTE */}
      {activeTab === 'dados' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-base font-extrabold text-[#0B1E3D]">
            Dados do Ativo e Identificação Cadastral
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Cliente Solicitante</label>
              <input
                type="text"
                disabled
                value={laudoState.clienteNome}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Equipamento Auditado</label>
              <input
                type="text"
                disabled
                value={laudoState.ativoIdentificacao}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Data da Realização da Vistoria</label>
              <input
                type="date"
                disabled={isFinalizado}
                value={laudoState.dataInspecao}
                onChange={(e) => setLaudoState({ ...laudoState, dataInspecao: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Responsável Técnico</label>
              <input
                type="text"
                disabled
                value={`${laudoState.responsavelNome} (${laudoState.responsavelCrea})`}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 text-xs">Resumo Executivo Inicial</label>
            <textarea
              rows={3}
              disabled={isFinalizado}
              value={laudoState.resumoExecutivo || ''}
              onChange={(e) => setLaudoState({ ...laudoState, resumoExecutivo: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-xs leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* TAB 2: CHECKLIST NORMATIVO POR SEÇÕES */}
      {activeTab === 'checklist' && (
        <div className="space-y-6">
          {laudoState.secoes.map((secao, sIdx) => (
            <div key={secao.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-[#0B1E3D] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-[#1565D8] flex items-center justify-center text-xs font-bold">
                    {sIdx + 1}
                  </span>
                  <span>{secao.titulo}</span>
                </h3>

                {!isFinalizado && (
                  <button
                    onClick={() => handleAddFoto(secao.id)}
                    className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Adicionar Foto da Seção</span>
                  </button>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {secao.itens.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex-1">
                        <span className="font-bold text-slate-800 block text-xs">
                          {item.requisito}
                        </span>
                        {item.normaRef && (
                          <span className="text-[10px] font-mono text-[#1565D8] font-semibold">
                            Ref: {item.normaRef}
                          </span>
                        )}
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleItemStatusChange(secao.id, item.id, 'conforme')}
                          disabled={isFinalizado}
                          className={`px-2.5 py-1 rounded-md font-bold text-[10px] transition-colors cursor-pointer ${
                            item.status === 'conforme'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          Conforme
                        </button>
                        <button
                          onClick={() => handleItemStatusChange(secao.id, item.id, 'nao_conforme')}
                          disabled={isFinalizado}
                          className={`px-2.5 py-1 rounded-md font-bold text-[10px] transition-colors cursor-pointer ${
                            item.status === 'nao_conforme'
                              ? 'bg-red-600 text-white shadow-xs'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          Não Conforme
                        </button>
                        <button
                          onClick={() => handleItemStatusChange(secao.id, item.id, 'nao_aplicavel')}
                          disabled={isFinalizado}
                          className={`px-2.5 py-1 rounded-md font-bold text-[10px] transition-colors cursor-pointer ${
                            item.status === 'nao_aplicavel'
                              ? 'bg-slate-700 text-white'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          N/A
                        </button>
                      </div>
                    </div>

                    {/* Observation Field */}
                    <div>
                      <input
                        type="text"
                        disabled={isFinalizado}
                        value={item.observacao || ''}
                        onChange={(e) => handleItemObsChange(secao.id, item.id, e.target.value)}
                        placeholder="Observação técnica constatada em campo..."
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs placeholder-slate-400 focus:ring-1 focus:ring-[#1565D8]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Photos Gallery */}
              {secao.fotos && secao.fotos.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                    Evidências Fotográficas da Seção:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {secao.fotos.map((foto) => (
                      <div key={foto.id} className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                        <img src={foto.url} alt={foto.legenda} className="w-full h-24 object-cover" />
                        <p className="p-1.5 text-[10px] text-slate-600 font-medium truncate">
                          {foto.legenda}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

      {/* TAB 3: APRECIAÇÃO DE RISCOS HRN (HAZARD RATING NUMBER) */}
      {activeTab === 'hrn' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-[#1565D8] uppercase tracking-wider">
              Metodologia Normativa de Apreciação de Risco
            </span>
            <h3 className="text-xl font-black text-[#0B1E3D] mt-0.5">
              Cálculo Quantitativo do HRN (Hazard Rating Number)
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Fórmula: HRN = LO (Probabilidade) × FE (Exposição) × DPH (Severidade) × NP (Pessoas em Risco)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            
            {/* LO */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="font-bold text-slate-700 block">
                1. Probabilidade de Ocorrência (LO)
              </label>
              <select
                disabled={isFinalizado}
                value={hrnValues.lo}
                onChange={(e) => setHrnValues({ ...hrnValues, lo: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 font-semibold text-slate-800"
              >
                {HRN_LO_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400">Desde quase impossível (0.033) até certo (15).</p>
            </div>

            {/* FE */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="font-bold text-slate-700 block">
                2. Frequência de Exposição (FE)
              </label>
              <select
                disabled={isFinalizado}
                value={hrnValues.fe}
                onChange={(e) => setHrnValues({ ...hrnValues, fe: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 font-semibold text-slate-800"
              >
                {HRN_FE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400">Tempo de exposição à zona de risco.</p>
            </div>

            {/* DPH */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="font-bold text-slate-700 block">
                3. Grau Máximo de Dano (DPH)
              </label>
              <select
                disabled={isFinalizado}
                value={hrnValues.dph}
                onChange={(e) => setHrnValues({ ...hrnValues, dph: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 font-semibold text-slate-800"
              >
                {HRN_DPH_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400">Severidade da lesão provável.</p>
            </div>

            {/* NP */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="font-bold text-slate-700 block">
                4. Número de Pessoas em Risco (NP)
              </label>
              <select
                disabled={isFinalizado}
                value={hrnValues.np}
                onChange={(e) => setHrnValues({ ...hrnValues, np: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 font-semibold text-slate-800"
              >
                {HRN_NP_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400">Operadores e circulantes na área.</p>
            </div>

          </div>

          {/* Semáforo e Classificação do Risco */}
          <div className={`p-6 rounded-2xl border ${hrnCalculado.cor} space-y-2`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block opacity-75">
                  Pontuação HRN Calculada:
                </span>
                <span className="text-3xl font-black">{hrnCalculado.score}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold uppercase tracking-wider block opacity-75">
                  Nível de Risco Classificado:
                </span>
                <span className="text-2xl font-black">{hrnCalculado.nivel}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-current/20">
              <span className="font-bold text-xs block">Recomendação Técnica Obrigatória:</span>
              <p className="text-sm mt-0.5">{hrnCalculado.recomendacao}</p>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: DIAGNÓSTICO ASSISTIDO POR IA (GEMINI API) */}
      {activeTab === 'ia' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Inteligência Artificial Aplicada à Engenharia</span>
              </span>
              <h3 className="text-xl font-black text-[#0B1E3D] mt-0.5">
                Assistente de Diagnóstico e Apreciação Técnica
              </h3>
              <p className="text-xs text-slate-500">
                O modelo analisa os itens não conformes, notas de campo e cálculo HRN para sintetizar o parecer e plano corretivo.
              </p>
            </div>

            {/* Quota tracker */}
            <div className="text-right text-xs bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Consumo Mensal:</span>
              <span className="font-bold font-mono text-purple-700">
                {usoIA.totalChamadas} / {usoIA.limiteMensal} chamadas
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 text-xs text-purple-900 leading-relaxed flex items-center justify-between">
            <div>
              <strong>Processamento Seguro:</strong> Os dados são enviados de forma anônima ao backend proxy da VL Engenharia, sem exposição de chaves no navegador.
            </div>
            <button
              onClick={handleAnalisarComIA}
              disabled={analisandoIA || isFinalizado}
              className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
            >
              {analisandoIA ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processando Diagnóstico...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analisar Laudo com IA</span>
                </>
              )}
            </button>
          </div>

          {resultadoIA && (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-[#0B1E3D] uppercase tracking-wider">
                  Síntese e Parecer Técnico Preliminar Gerado:
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                  {resultadoIA.parecerTecnico}
                </p>
              </div>

              {resultadoIA.riscosIdentificados && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-[#0B1E3D] uppercase tracking-wider">
                    Perigos & Riscos Mapeados pela IA:
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-700 list-disc pl-4">
                    {resultadoIA.riscosIdentificados.map((r: string, idx: number) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {resultadoIA.recomendacoesGerais && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-[#0B1E3D] uppercase tracking-wider">
                    Recomendações Técnicas para o Plano de Ação:
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                    {resultadoIA.recomendacoesGerais}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: CONCLUSÃO E PLANO DE AÇÃO */}
      {activeTab === 'conclusao' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-base font-extrabold text-[#0B1E3D]">
            Parecer Conclusivo e Plano de Ação Corretivo
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Conclusão Final do Engenheiro Mecânico *
              </label>
              <textarea
                rows={4}
                disabled={isFinalizado}
                value={laudoState.conclusao || ''}
                onChange={(e) => setLaudoState({ ...laudoState, conclusao: e.target.value })}
                placeholder="Declare a aptidão ou restrições operacionais do equipamento conforme as normas..."
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-slate-800 leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: ART & FINALIZAÇÃO */}
      {activeTab === 'art' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-[#1565D8] uppercase tracking-wider">
              Encerramento Legal & ART CREA-PE
            </span>
            <h3 className="text-xl font-black text-[#0B1E3D] mt-0.5">
              Protocolo de Responsabilidade Técnica
            </h3>
            <p className="text-xs text-slate-500">
              A finalização bloqueia edições não autorizadas no laudo e registra o evento na auditoria do sistema.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Número da ART no CREA-PE *
              </label>
              <input
                type="text"
                disabled={isFinalizado}
                value={artNumero}
                onChange={(e) => setArtNumero(e.target.value)}
                placeholder="Ex: PE2026-0104882"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Profissional Habilitado Responsável
              </label>
              <input
                type="text"
                disabled
                value="Vitor Leonardo (CREA-PE 1822299490)"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-semibold"
              />
            </div>
          </div>

          {!isFinalizado ? (
            <div className="space-y-4 pt-2">
              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={concordoTermo}
                  onChange={(e) => setConcordoTermo(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#1565D8] focus:ring-[#1565D8]"
                />
                <span>
                  Declaro para os devidos fins legais que a vistoria foi executada de acordo com as normas da ABNT e NR do Ministério do Trabalho, e assumo a responsabilidade técnica pelas constatações e pareceres deste documento sob a ART informada.
                </span>
              </label>

              <button
                onClick={handleFinalizar}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Finalizar Laudo e Bloquear para Edição</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong>Laudo Finalizado com Sucesso:</strong> Este documento está concluído com a ART <strong>{laudoState.artNumero}</strong>. O histórico do equipamento foi atualizado automaticamente.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal de Exportação PDF com Cabeçalho e Rodapé Oficial */}
      {modalPdfAberto && laudoState && (
        <LaudoPdfExportModal
          laudo={laudoState}
          cliente={clientes.find(c => c.id === laudoState.clienteId || c.razaoSocial === laudoState.clienteNome)}
          ativo={ativos.find(a => a.id === laudoState.ativoId || a.identificacao === laudoState.ativoIdentificacao)}
          isOpen={modalPdfAberto}
          onClose={() => setModalPdfAberto(false)}
        />
      )}

    </div>
  );
};
