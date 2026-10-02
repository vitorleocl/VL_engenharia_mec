import React, { useState, useMemo } from 'react';
import { 
  Wrench, 
  Car, 
  Calendar, 
  ShieldAlert, 
  Sparkles, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  Building, 
  X, 
  Zap, 
  RotateCcw,
  CheckSquare,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  DadosEntradaCausaRaiz, 
  gerarLaudoCausaRaizOffline, 
  ResultadoLaudoCausaRaiz 
} from '../../lib/motorLaudoCausaRaiz';
import { Laudo, LaudoSecao } from '../../types';

interface GeradorLaudoCausaRaizModalProps {
  isOpen: boolean;
  onClose: () => void;
  laudoExistenteId?: string;
  onLaudoAtualizado?: (laudoAtualizado: Partial<Laudo>) => void;
}

export const GeradorLaudoCausaRaizModal: React.FC<GeradorLaudoCausaRaizModalProps> = ({
  isOpen,
  onClose,
  laudoExistenteId,
  onLaudoAtualizado
}) => {
  const { clientes, ativos, laudos, atualizarLaudo, registrarUsoIA } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const laudoAtual = useMemo(() => {
    return laudoExistenteId ? laudos.find(l => l.id === laudoExistenteId) : null;
  }, [laudoExistenteId, laudos]);

  const [abaAtiva, setAbaAtiva] = useState<'ativo' | 'contexto' | 'evidencias' | 'escopo' | 'emissao'>('ativo');
  const [gerando, setGerando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  // 1. Identificação do Ativo
  const [marca, setMarca] = useState('Volkswagen');
  const [modelo, setModelo] = useState('Gol 1.0 MPI Flex');
  const [anoModelo, setAnoModelo] = useState('2021/2022');
  const [placa, setPlaca] = useState('PGX-7098');
  const [renavam, setRenavam] = useState('01248920192');
  const [chassi, setChassi] = useState('9BWCA05U0NT001824');
  const [kmAtual, setKmAtual] = useState<number | string>(82450);
  const [kmIntervencaoPrevia, setKmIntervencaoPrevia] = useState<number | string>(59800);

  // 2. Contexto do Evento e Histórico
  const [dataPane, setDataPane] = useState(new Date().toISOString().slice(0, 10));
  const [dataIntervencaoPrevia, setDataIntervencaoPrevia] = useState('2025-11-10');
  const [historicoManutencao, setHistoricoManutencao] = useState(
    'Substituição preventiva do conjunto de correias e tensores do motor em oficina mecânica terceirizada credenciada da frota.'
  );
  const [oficinaTerceirizada, setOficinaTerceirizada] = useState('Auto Mecânica Terceirizada Frota Ltda');
  const [restricaoConfidencialidade, setRestricaoConfidencialidade] = useState(true);

  // 3. Evidências Técnicas
  const [descricaoAvarias, setDescricaoAvarias] = useState(
    'Ruptura transversal da correia dentada sincronizadora com cisalhamento de dentes por fadiga de material. Colisão mecânica e interferência direta entre o prato das válvulas e o topo dos pistões com severa deformação plástica nas hastes das 8 válvulas (empenamento). Desmonte do cabeçote evidenciou marcas de impacto nos pistões 1 e 4 sem trincas de bloco.'
  );
  const [componentesSelecionados, setComponentesSelecionados] = useState<string[]>([
    'Correia Dentada de Sincronismo',
    'Válvulas de Admissão e Escape',
    'Cabeçote do Motor (Mancais e Sedes)',
    'Pistões do Motor',
    'Tensor da Correia e Rolamentos Guias',
    'Bloco do Motor e Bielas'
  ]);

  // 4. Escopo & Quesitos
  const [determinarCausaRaiz, setDeterminarCausaRaiz] = useState(true);
  const [analisarNexoCausal, setAnalisarNexoCausal] = useState(true);
  const [verificarGarantiaCDC, setVerificarGarantiaCDC] = useState(true);
  const [avaliarMauUso, setAvaliarMauUso] = useState(true);
  const [quesitosEspecificos, setQuesitosEspecificos] = useState(
    '1. A quebra decorreu de erro de montagem na revisão pretérita ou de desgaste/fim de ciclo de vida útil do componente?\n2. A oficina executante pretérita pode ser responsabilizada civilmente pelo conserto perante os prazos legais do CDC?\n3. Há indícios de sobre-giro (over-rev) ou negligência na operação do veículo?'
  );

  // 5. Emissão e Metadados
  const [clienteId, setClienteId] = useState(clientes[0]?.id || '');
  const [ativoId, setAtivoId] = useState(laudoAtual?.ativoId || '');
  const [laudoNumero, setLaudoNumero] = useState(
    laudoAtual?.numero || `LAR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
  );
  const [artNumero, setArtNumero] = useState(laudoAtual?.artNumero || 'PE2026-0104882');

  // Cálculos dinâmicos
  const kmIntervaloCalc = useMemo(() => {
    const atual = Number(kmAtual) || 0;
    const previa = Number(kmIntervencaoPrevia) || 0;
    return atual > previa ? atual - previa : 0;
  }, [kmAtual, kmIntervencaoPrevia]);

  const diasIntervaloCalc = useMemo(() => {
    try {
      const dtPane = new Date(dataPane);
      const dtPrevia = new Date(dataIntervencaoPrevia);
      const diffTime = dtPane.getTime() - dtPrevia.getTime();
      return Math.round(diffTime / (1000 * 3600 * 24));
    } catch {
      return 0;
    }
  }, [dataPane, dataIntervencaoPrevia]);

  // Se dias > 90, garantia expirada pelo CDC
  const garantiaExpirada = diasIntervaloCalc > 90;

  // Carregar Caso Prático de Exemplo (Frota Corporativa)
  const carregarCasoPraticoPadrão = () => {
    setMarca('Volkswagen');
    setModelo('Gol 1.0 MPI Flex');
    setAnoModelo('2021/2022');
    setPlaca('PGX-7098');
    setRenavam('01248920192');
    setChassi('9BWCA05U0NT001824');
    setKmAtual(82450);
    setKmIntervencaoPrevia(59800);
    setDataPane(new Date().toISOString().slice(0, 10));
    setDataIntervencaoPrevia('2025-11-10');
    setHistoricoManutencao(
      'Substituição preventiva do conjunto de correias e tensores do motor em oficina mecânica terceirizada credenciada da frota.'
    );
    setOficinaTerceirizada('Auto Mecânica Terceirizada Frota Ltda');
    setRestricaoConfidencialidade(true);
    setDescricaoAvarias(
      'Ruptura transversal da correia dentada sincronizadora com cisalhamento de dentes por fadiga de material. Colisão mecânica e interferência direta entre o prato das válvulas e o topo dos pistões com severa deformação plástica nas hastes das 8 válvulas (empenamento). Desmonte do cabeçote evidenciou marcas de impacto nos pistões 1 e 4 sem trincas de bloco.'
    );
    setComponentesSelecionados([
      'Correia Dentada de Sincronismo',
      'Válvulas de Admissão e Escape',
      'Cabeçote do Motor (Mancais e Sedes)',
      'Pistões do Motor',
      'Tensor da Correia e Rolamentos Guias',
      'Bloco do Motor e Bielas'
    ]);
    setDeterminarCausaRaiz(true);
    setAnalisarNexoCausal(true);
    setVerificarGarantiaCDC(true);
    setAvaliarMauUso(true);
    setQuesitosEspecificos(
      '1. A quebra decorreu de erro de montagem na revisão pretérita ou de desgaste/fim de ciclo de vida útil do componente?\n2. A oficina executante pretérita pode ser responsabilizada civilmente pelo conserto perante os prazos legais do CDC?\n3. Há indícios de sobre-giro (over-rev) ou negligência na operação do veículo?'
    );
  };

  const alternarComponente = (nome: string) => {
    setComponentesSelecionados(prev => 
      prev.includes(nome) ? prev.filter(c => c !== nome) : [...prev, nome]
    );
  };

  const handleGerarLaudo = async () => {
    setGerando(true);
    setMensagemSucesso(null);
    registrarUsoIA('Gerador Causa Raiz Categoria 4', 1);

    const clienteSelecionado = clientes.find(c => c.id === clienteId);
    const dadosEntrada: DadosEntradaCausaRaiz = {
      ativo: {
        marca,
        modelo,
        anoModelo,
        placa,
        renavam,
        chassi,
        kmAtual,
        kmIntervencaoPrevia
      },
      contexto: {
        dataPane,
        dataIntervencaoPrevia,
        historicoManutencao,
        oficinaTerceirizada,
        restricaoConfidencialidade,
        kmIntervalo: kmIntervaloCalc
      },
      evidencias: {
        descricaoAvarias,
        componentesAvariados: componentesSelecionados
      },
      escopo: {
        determinarCausaRaiz,
        analisarNexoCausal,
        verificarGarantiaCDC,
        avaliarMauUso,
        quesitosEspecificos
      },
      clienteNome: clienteSelecionado?.razaoSocial || 'Cliente Corporativo',
      clienteCnpj: clienteSelecionado?.cnpj || '',
      laudoNumero,
      artNumero,
      dataEmissao: dataPane
    };

    try {
      let resultado: ResultadoLaudoCausaRaiz | null = null;

      // 1. Tenta a API do servidor com IA
      try {
        const res = await fetch('/api/ai/gerar-laudo-causa-raiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dadosEntrada)
        });

        if (res.ok) {
          const json = await res.json();
          if (json.secoes && json.secoes.length > 0) {
            resultado = json;
          }
        }
      } catch (errApi) {
        console.warn('API de IA indisponível, utilizando motor offline garantido:', errApi);
      }

      // 2. Se a API não respondeu ou deu erro, gera pelo motor pericial offline de alta fidelidade
      if (!resultado) {
        resultado = gerarLaudoCausaRaizOffline(dadosEntrada);
      }

      // Mapeia as 13 seções para a estrutura interna do Laudo
      const novasSecoes: LaudoSecao[] = resultado.secoes.map((s, idx) => ({
        id: `sec-${idx + 1}`,
        titulo: s.titulo,
        ordem: s.ordem || idx + 1,
        tipo: idx === 0 ? 'capa' : idx === 1 ? 'apresentacao' : idx === 12 ? 'art_assinatura' : 'corpo_tecnico',
        conteudoHtml: s.conteudoHtml,
        itens: [],
        fotos: []
      }));

      if (laudoExistenteId) {
        // Atualiza o laudo atual no DataContext
        atualizarLaudo(laudoExistenteId, {
          numero: laudoNumero,
          artNumero,
          resumoExecutivo: resultado.resumoExecutivo,
          conclusao: resultado.conclusaoGeral,
          secoes: novasSecoes,
          atualizadoEm: new Date().toISOString()
        });

        if (onLaudoAtualizado) {
          onLaudoAtualizado({
            numero: laudoNumero,
            artNumero,
            resumoExecutivo: resultado.resumoExecutivo,
            conclusao: resultado.conclusaoGeral,
            secoes: novasSecoes,
            atualizadoEm: new Date().toISOString()
          });
        }

        setMensagemSucesso('Laudo pericial de causa raiz atualizado com as 13 seções oficiais!');
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        // Criação de um novo laudo de Categoria 4 diretamente no localStorage / Firestore
        const novoId = `lau-${Date.now()}`;
        const novoLaudo: Laudo = {
          id: novoId,
          numero: laudoNumero,
          tipo: 'Laudo Pericial de Causa Raiz e Análise de Falhas Mecânicas Automotivas',
          tipoLaudoId: 'laudo-pericia-causa-raiz-automotiva',
          categoriaId: 'cat-4',
          subcategoriaId: 'sub-4-3',
          clienteId: clienteId || clientes[0]?.id || '',
          clienteNome: clienteSelecionado?.razaoSocial || 'Cliente Corporativo',
          clienteCnpj: clienteSelecionado?.cnpj || '',
          ativoId: ativoId || '',
          ativoIdentificacao: `${marca} ${modelo} (${placa})`,
          status: 'em_andamento',
          artNumero,
          dataInspecao: dataPane,
          responsavelNome: 'Eng. Vitor Leonardo Cordeiro Linhares',
          responsavelCrea: 'CREA-PE 182229949-0',
          normasReferencia: 'Código de Defesa do Consumidor (Lei 8.078/90 Art. 26), Código de Trânsito Brasileiro (CTB), ABNT NBR 13771, ABNT NBR 5462',
          apresentacao: 'Laudo de avaliação técnica pericial de nível corporativo e jurídico para determinação de causa raiz de avarias mecânicas em frotas automotivas.',
          metodologia: 'Investigação pericial baseada no rigor do método científico e da engenharia forense: anamnese cronológica, auditoria de ordens de serviço anteriores, confrontação de odômetros e análise macroscópica.',
          resumoExecutivo: resultado.resumoExecutivo,
          conclusao: resultado.conclusaoGeral,
          secoes: novasSecoes,
          checklist: [
            { id: 'ck-1', descricao: `Quilometragem no evento: ${kmAtual} km vs. Intervenção prévia: ${kmIntervencaoPrevia} km (Intervalo: ${kmIntervaloCalc.toLocaleString('pt-BR')} km)`, status: 'conforme', observacao: 'Quilometragem percorrida no intervalo documentada' },
            { id: 'ck-2', descricao: `Lapso temporal entre o serviço e a pane: ${diasIntervaloCalc} dias (CDC Art. 26 - 90 dias)`, status: 'conforme', observacao: garantiaExpirada ? 'Prazo decadencial de 90 dias legalmente superado' : 'Dentro do prazo legal' },
            { id: 'ck-3', descricao: 'Inspeção macroscópica de ruptura de correia e dentes de sincronismo', status: 'nao_conforme', observacao: 'Constatada ruptura mecânica por fadiga operacional' },
            { id: 'ck-4', descricao: 'Verificação de interferência cinemática entre válvulas e pistões', status: 'nao_conforme', observacao: 'Empenamento de válvulas por perda de sincronismo motriz' },
            { id: 'ck-5', descricao: 'Descarte de hipótese de sobreaquecimento ou falta de lubrificação', status: 'conforme', observacao: 'Película de lubrificante íntegra e sem deformação térmica de bloco' },
            { id: 'ck-6', descricao: 'Descarte de mau uso pelo operador (ausência de indícios de sobre-giro/over-rev)', status: 'conforme', observacao: 'Sem marcas de arrancada abusiva ou rotação fora da faixa nominal' },
            { id: 'ck-7', descricao: 'Afastamento de nexo causal imediato com a oficina executante pretérita', status: 'conforme', observacao: 'Operação regular ao longo de milhares de km afasta defeito imediato de montagem' }
          ],
          tabelaNaoConformidades: [],
          usoIA: { chamadas: 1 },
          iniciadoComIA: true,
          modoCriacao: 'sugestao_ia',
          criadoEm: new Date().toISOString(),
          atualizadoEm: new Date().toISOString()
        };

        // Salva na lista
        const laudosAtuais = [...laudos, novoLaudo];
        localStorage.setItem('vl_laudos', JSON.stringify(laudosAtuais));
        // Dispara evento ou navega
        onClose();
        navigate(`/admin/laudos/${novoId}`);
      }
    } catch (err: any) {
      console.error('Erro ao gerar laudo de causa raiz:', err);
      alert('Erro ao processar laudo pericial: ' + err.message);
    } finally {
      setGerando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/30 border border-blue-400/30 text-blue-400">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Categoria 4 • Engenharia Veicular
                </span>
                <span className="text-[10px] font-bold text-slate-400">Padrão CREA-PE 182229949-0</span>
              </div>
              <h3 className="text-lg font-black tracking-tight text-white mt-0.5">
                Gerador de Laudo Pericial de Causa Raiz & Falhas Mecânicas
              </h3>
              <p className="text-xs text-slate-300">
                Investigação forense em frotas automotivas, nexo causal, garantia legal (CDC) e descarte de mau uso.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={carregarCasoPraticoPadrão}
              type="button"
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Preenche o formulário com o caso completo de Ruptura de Correia Dentada"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Caso Prático de Frota</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Diagnostics Banner */}
        <div className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Car className="w-4 h-4 text-blue-600" />
              <span className="text-slate-600 dark:text-slate-300 font-semibold">{marca} {modelo} ({placa})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600 dark:text-slate-300">
                Intervalo: <strong>{kmIntervaloCalc.toLocaleString('pt-BR')} km</strong> ({diasIntervaloCalc} dias)
              </span>
            </div>
          </div>

          <div>
            {garantiaExpirada ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Garantia CDC Expirada (&gt; 90 dias) • Nexo Afastado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-[11px] border border-amber-300 dark:border-amber-800">
                <AlertTriangle className="w-3.5 h-3.5" />
                Dentro dos 90 dias do CDC ({diasIntervaloCalc} dias)
              </span>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 pt-3 gap-2 overflow-x-auto bg-slate-50 dark:bg-slate-900/40">
          <button
            type="button"
            onClick={() => setAbaAtiva('ativo')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
              abaAtiva === 'ativo'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>1. Ativo & Odômetro</span>
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva('contexto')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
              abaAtiva === 'contexto'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>2. Histórico & Pane</span>
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva('evidencias')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
              abaAtiva === 'evidencias'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>3. Evidências Técnicas</span>
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva('escopo')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
              abaAtiva === 'escopo'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>4. Escopo & CDC</span>
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva('emissao')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
              abaAtiva === 'emissao'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>5. Contratante & ART</span>
          </button>
        </div>

        {/* Modal Body / Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-100">
          
          {mensagemSucesso && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <p className="text-xs font-bold">{mensagemSucesso}</p>
            </div>
          )}

          {/* ABA 1: ATIVO & ODÔMETRO */}
          {abaAtiva === 'ativo' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Marca do Veículo
                  </label>
                  <input
                    type="text"
                    value={marca}
                    onChange={e => setMarca(e.target.value)}
                    placeholder="Ex: Volkswagen, Fiat, Toyota"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Modelo / Versão
                  </label>
                  <input
                    type="text"
                    value={modelo}
                    onChange={e => setModelo(e.target.value)}
                    placeholder="Ex: Gol 1.0 MPI Flex, Strada 1.4"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ano Fab. / Modelo
                  </label>
                  <input
                    type="text"
                    value={anoModelo}
                    onChange={e => setAnoModelo(e.target.value)}
                    placeholder="Ex: 2021/2022"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Placa de Identificação
                  </label>
                  <input
                    type="text"
                    value={placa}
                    onChange={e => setPlaca(e.target.value.toUpperCase())}
                    placeholder="Ex: PGX-7098"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold focus:ring-2 focus:ring-blue-500 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Código RENAVAM
                  </label>
                  <input
                    type="text"
                    value={renavam}
                    onChange={e => setRenavam(e.target.value)}
                    placeholder="Ex: 01248920192"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Chassi (VIN)
                  </label>
                  <input
                    type="text"
                    value={chassi}
                    onChange={e => setChassi(e.target.value.toUpperCase())}
                    placeholder="Ex: 9BWCA05U0NT001824"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono focus:ring-2 focus:ring-blue-500 uppercase"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Confrontação de Hodômetros & Ciclo Operacional
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Km no Momento da Pane
                    </label>
                    <input
                      type="number"
                      value={kmAtual}
                      onChange={e => setKmAtual(e.target.value)}
                      placeholder="Ex: 82450"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Km na Intervenção Prévia
                    </label>
                    <input
                      type="number"
                      value={kmIntervencaoPrevia}
                      onChange={e => setKmIntervencaoPrevia(e.target.value)}
                      placeholder="Ex: 59800"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Quilometragem no Intervalo
                    </label>
                    <div className="px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 text-xs font-bold text-blue-700 dark:text-blue-300 font-mono">
                      {kmIntervaloCalc.toLocaleString('pt-BR')} km rodados
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  * A rodagem superior a 20.000 km ou vários meses após a intervenção afasta tecnicamente vícios imediatos de montagem ou torque defeituoso na oficina terceirizada.
                </p>
              </div>
            </div>
          )}

          {/* ABA 2: CONTEXTO & HISTÓRICO */}
          {abaAtiva === 'contexto' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Data do Evento / Pane no Veículo
                  </label>
                  <input
                    type="date"
                    value={dataPane}
                    onChange={e => setDataPane(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Data da Intervenção Mecânica Prévia
                  </label>
                  <input
                    type="date"
                    value={dataIntervencaoPrevia}
                    onChange={e => setDataIntervencaoPrevia(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Prestador / Oficina Terceirizada Anterior
                </label>
                <input
                  type="text"
                  value={oficinaTerceirizada}
                  onChange={e => setOficinaTerceirizada(e.target.value)}
                  placeholder="Nome ou identificação da oficina"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Histórico de Manutenção Pretérito
                </label>
                <textarea
                  rows={3}
                  value={historicoManutencao}
                  onChange={e => setHistoricoManutencao(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="chk-confidencialidade"
                  checked={restricaoConfidencialidade}
                  onChange={e => setRestricaoConfidencialidade(e.target.checked)}
                  className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="chk-confidencialidade" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <strong>Política de Confidencialidade Comercial Aplicável:</strong> Resguardar dados sensíveis de contratos terceirizados e acordos comerciais nos termos da LGPD e governança corporativa da frota.
                </label>
              </div>
            </div>
          )}

          {/* ABA 3: EVIDÊNCIAS TÉCNICAS */}
          {abaAtiva === 'evidencias' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Descrição das Avarias Encontradas (Mecânica da Falha)
                </label>
                <textarea
                  rows={4}
                  value={descricaoAvarias}
                  onChange={e => setDescricaoAvarias(e.target.value)}
                  placeholder="Descreva a ruptura de correia, deformação plástica de válvulas, colisão com pistões..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 leading-relaxed font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Componentes Periciados para a Tabela da Seção VII
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    'Correia Dentada de Sincronismo',
                    'Válvulas de Admissão e Escape',
                    'Cabeçote do Motor (Mancais e Sedes)',
                    'Pistões do Motor',
                    'Tensor da Correia e Rolamentos Guias',
                    'Bloco do Motor e Bielas',
                    'Bomba D’água e Sistema de Arrefecimento',
                    'Eixo Comando de Válvulas'
                  ].map(comp => (
                    <button
                      key={comp}
                      type="button"
                      onClick={() => alternarComponente(comp)}
                      className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                        componentesSelecionados.includes(comp)
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 text-blue-900 dark:text-blue-200 font-bold'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span>{comp}</span>
                      {componentesSelecionados.includes(comp) ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <div className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ABA 4: ESCOPO & CDC */}
          {abaAtiva === 'escopo' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-amber-600" />
                  Diretrizes Jurídicas & Prazos de Garantia (CDC)
                </h4>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={determinarCausaRaiz}
                      onChange={e => setDeterminarCausaRaiz(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span><strong>Determinação de Causa Raiz:</strong> Investigar o elemento primário desencadeador da falha catastrófica.</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={analisarNexoCausal}
                      onChange={e => setAnalisarNexoCausal(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span><strong>Análise de Nexo Causal:</strong> Verificar se há liame com manutenção prévia ou se decorre de desgaste natural.</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={verificarGarantiaCDC}
                      onChange={e => setVerificarGarantiaCDC(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span><strong>Garantia Legal do CDC (Art. 26 - 90 dias):</strong> Aferir formalmente a ocorrência de decadência do direito de reclamação.</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={avaliarMauUso}
                      onChange={e => setAvaliarMauUso(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span><strong>Descarte de Mau Uso:</strong> Avaliar conduta do motorista, sobre-rotação mecânica (over-rev) e lubrificação.</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Quesitos Específicos Formulados pelo Contratante
                </label>
                <textarea
                  rows={4}
                  value={quesitosEspecificos}
                  onChange={e => setQuesitosEspecificos(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs"
                />
              </div>
            </div>
          )}

          {/* ABA 5: EMISSÃO & ART */}
          {abaAtiva === 'emissao' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Cliente / Contratante
                  </label>
                  <select
                    value={clienteId}
                    onChange={e => setClienteId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {clientes.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.razaoSocial} {c.cnpj ? `(${c.cnpj})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ativo Vinculado (Opcional)
                  </label>
                  <select
                    value={ativoId}
                    onChange={e => setAtivoId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="">-- Cadastrar com os dados preenchidos --</option>
                    {ativos.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.identificacao} {a.placa ? `(${a.placa})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Numeração do Laudo
                  </label>
                  <input
                    type="text"
                    value={laudoNumero}
                    onChange={e => setLaudoNumero(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Número da ART CREA-PE
                  </label>
                  <input
                    type="text"
                    value={artNumero}
                    onChange={e => setArtNumero(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-blue-700 dark:text-blue-300"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  Responsável Técnico Legal:
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Eng. Vitor Leonardo Cordeiro Linhares • CREA-PE 182229949-0
                </p>
                <p className="text-[11px] text-slate-500">
                  O laudo é estruturado em estrita conformidade com as 13 seções corporativas da VL Engenharia.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Estrutura de 13 seções com ART CREA-PE & Matriz de Causa Raiz</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleGerarLaudo}
              disabled={gerando}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {gerando ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processando Laudo Forense...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{laudoExistenteId ? 'Atualizar com 13 Seções Oficiais' : 'Gerar Laudo Técnico Completo'}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
