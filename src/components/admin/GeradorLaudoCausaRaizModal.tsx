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
  ChevronRight,
  ChevronLeft,
  Upload,
  Camera,
  Layers,
  Award,
  BookOpen,
  HelpCircle,
  Eye,
  CheckSquare
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  DadosEntradaCausaRaiz, 
  gerarLaudoCausaRaizOffline, 
  ResultadoLaudoCausaRaiz 
} from '../../lib/motorLaudoCausaRaiz';
import { Laudo, LaudoSecao, EvidenciaFoto, MatrizNexoCausal, NexoCausalClassificacao } from '../../types';

interface GeradorLaudoCausaRaizModalProps {
  isOpen: boolean;
  onClose: () => void;
  laudoExistenteId?: string;
  onLaudoAtualizado?: (laudoAtualizado: Partial<Laudo>) => void;
  onFinalizacaoSucesso?: (laudoFinalizado: Laudo) => void;
}

export interface ComponenteDanoItem {
  item: string;
  nome: string;
  condicao: 'Íntegro' | 'Danificado' | 'Parcial';
  parecer: string;
}

export const GeradorLaudoCausaRaizModal: React.FC<GeradorLaudoCausaRaizModalProps> = ({
  isOpen,
  onClose,
  laudoExistenteId,
  onLaudoAtualizado,
  onFinalizacaoSucesso
}) => {
  const { clientes, ativos, laudos, atualizarLaudo, registrarUsoIA } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const laudoAtual = useMemo(() => {
    return laudoExistenteId ? laudos.find(l => l.id === laudoExistenteId) : null;
  }, [laudoExistenteId, laudos]);

  // Wizard 9 Etapas no padrão do módulo NR-12
  const [etapaAtual, setEtapaAtual] = useState<number>(1);
  const [gerandoIA, setGerandoIA] = useState(false);
  const [analiseIaFeita, setAnaliseIaFeita] = useState(false);

  // ETAPA 1: Dados do Ativo e Contratante
  const [clienteId, setClienteId] = useState(clientes[0]?.id || '');
  const [ativoId, setAtivoId] = useState(laudoAtual?.ativoId || '');
  const [marca, setMarca] = useState('Volkswagen');
  const [modelo, setModelo] = useState('Gol 1.0 MPI Flex');
  const [anoModelo, setAnoModelo] = useState('2021/2022');
  const [placa, setPlaca] = useState('PGX-7098');
  const [renavam, setRenavam] = useState('01248920192');
  const [chassi, setChassi] = useState('9BWCA05U0NT001824');
  const [kmAtual, setKmAtual] = useState<number | string>(82450);
  const [kmIntervencaoPrevia, setKmIntervencaoPrevia] = useState<number | string>(59800);

  // ETAPA 2: Histórico do Evento (cronologia, manutenções, datas)
  const [dataPane, setDataPane] = useState(new Date().toISOString().slice(0, 10));
  const [dataIntervencaoPrevia, setDataIntervencaoPrevia] = useState('2025-11-10');
  const [historicoManutencao, setHistoricoManutencao] = useState(
    'Substituição preventiva do conjunto de correias e tensores do motor em oficina mecânica terceirizada credenciada da frota.'
  );
  const [oficinaTerceirizada, setOficinaTerceirizada] = useState('Auto Mecânica Terceirizada Frota Ltda');
  const [restricaoConfidencialidade, setRestricaoConfidencialidade] = useState(true);

  // ETAPA 3: Objetivo do Trabalho e Metodologia Pericial (checklist de escopo)
  const [determinarCausaRaiz, setDeterminarCausaRaiz] = useState(true);
  const [analisarNexoCausal, setAnalisarNexoCausal] = useState(true);
  const [verificarGarantiaCDC, setVerificarGarantiaCDC] = useState(true);
  const [avaliarMauUso, setAvaliarMauUso] = useState(true);
  const [metodologiaTexto, setMetodologiaTexto] = useState(
    'Investigação pericial baseada no rigor do método científico e da engenharia forense: anamnese cronológica, auditoria de ordens de serviço anteriores, confrontação de odômetros (km na intervenção vs. km na pane), inspeção macroscópica de superfícies de fratura de componentes (correia sincronizadora, tensionadores, válvulas, pistões), verificação de conformidade com os prazos de garantia legal (Art. 26 do CDC) e aplicação de matriz de causa raiz para exclusão fundamentada de hipóteses concorrentes.'
  );

  // ETAPA 4: Registros Fotográficos e Evidências (upload com legenda analítica)
  const [descricaoAvarias, setDescricaoAvarias] = useState(
    'Ruptura mecânica catastrófica da correia dentada com perda total do sincronismo cinemático entre virabrequim e comando de válvulas, acarretando colisão direta do prato das válvulas de admissão e escape contra o topo dos pistões dos cilindros 1 e 4.'
  );
  const [fotosEvidencias, setFotosEvidencias] = useState<EvidenciaFoto[]>([
    {
      id: 'foto-1',
      url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
      titulo: 'Ruptura da Correia Sincronizadora',
      legenda: 'Seção transversal rompida com desfiamento de cordões de tração em fibra de vidro e cisalhamento de dentes por fadiga cíclica de material.',
      dataHora: new Date().toISOString()
    },
    {
      id: 'foto-2',
      url: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=600&q=80',
      titulo: 'Trem de Válvulas e Cabeçote Desmontado',
      legenda: 'Vista inferior do cabeçote com deformação plástica severa (hastes empenadas) decorrente da interferência cinemática direta contra os pistões.',
      dataHora: new Date().toISOString()
    },
    {
      id: 'foto-3',
      url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
      titulo: 'Topo dos Pistões e Câmaras de Combustão',
      legenda: 'Marcas circulares nítidas no topo dos êmbolos 1 e 4 provocadas pelo choque mecânico imediato com os pratos das válvulas estáticas abertas.',
      dataHora: new Date().toISOString()
    },
    {
      id: 'foto-4',
      url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
      titulo: 'Tensor da Correia e Rolamentos Guias',
      legenda: 'Conjunto tensor e rolamentos guias sem indícios de engripamento ou travamento térmico. Rotação desobstruída e pistas sem marcas de sobreaquecimento.',
      dataHora: new Date().toISOString()
    }
  ]);

  // ETAPA 5: Constatação de Danos (tabela item a item: componente / condição / parecer)
  const [tabelaDanos, setTabelaDanos] = useState<ComponenteDanoItem[]>([
    {
      item: '01',
      nome: 'Correia Dentada de Sincronismo',
      condicao: 'Danificado',
      parecer: 'Ruptura completa transversal com dentes cisalhados por fadiga mecânica. Elemento desencadeador do dessincronismo motriz.'
    },
    {
      item: '02',
      nome: 'Válvulas de Admissão e Escape',
      condicao: 'Danificado',
      parecer: 'Deformação plástica (hastes empenadas) por colisão mecânica direta contra a cabeça dos pistões pós-rompimento da correia.'
    },
    {
      item: '03',
      nome: 'Cabeçote do Motor (Mancais e Sedes)',
      condicao: 'Parcial',
      parecer: 'Guias de válvulas com necessidade de substituição e retífica de sedes. Estrutura de fundição sem trincas macroscópicas.'
    },
    {
      item: '04',
      nome: 'Pistões do Motor',
      condicao: 'Parcial',
      parecer: 'Marcas superficiais de impacto no topo dos êmbolos sem perfuração ou trinca de saia. Requer medição de folga de cilindro.'
    },
    {
      item: '05',
      nome: 'Tensor da Correia e Rolamentos Guias',
      condicao: 'Íntegro',
      parecer: 'Mancais de rolamento com rotação desobstruída, sem sinais de engripamento, folga excessiva ou superaquecimento prévio.'
    },
    {
      item: '06',
      nome: 'Bloco do Motor e Bielas',
      condicao: 'Íntegro',
      parecer: 'Sem empenamento perceptível de bielas ou deformações nas camisas dos cilindros. Lubrificação preservada.'
    }
  ]);

  // ETAPA 6: Análise de Causa Raiz assistida por IA + Matriz de Nexo Causal
  const [causaRaizTexto, setCausaRaizTexto] = useState(
    'Dessincronismo mecânico por colapso e ruptura da correia sincronizadora dentada decorrente de fadiga de material e decurso de ciclo de vida útil operacional, induzindo colisão catastrófica entre o prato das válvulas e o topo dos pistões.'
  );
  const [descarteMauUsoTexto, setDescarteMauUsoTexto] = useState(
    'A inspeção técnica descartou conclusivamente a ocorrência de sobreaquecimento primário (líquido de arrefecimento presente, sem deformação no bloco) ou falta de lubrificação (mancais e bronzinas de biela íntegros com filme de óleo preservado). Não foram identificados indícios de sobre-rotação mecânica induzida (over-rev).'
  );
  const [classificacaoNexoManual, setClassificacaoNexoManual] = useState<NexoCausalClassificacao | null>(null);

  // ETAPA 7: Enquadramento Legal e Normativo
  const [enquadramentoCdcTexto, setEnquadramentoCdcTexto] = useState(
    'Conforme preceitua o Art. 26, inciso II da Lei Federal nº 8.078/1990 (Código de Defesa do Consumidor), o prazo decadencial de 90 (noventa) dias para reclamação por vícios aparentes ou de fácil constatação em serviços e produtos duráveis encontrava-se integralmente expirado no momento da pane mecânica.'
  );
  const [normasReferencia, setNormasReferencia] = useState(
    'Código de Defesa do Consumidor (Lei nº 8.078/1990 - Art. 18, 20 e 26), Código de Trânsito Brasileiro (CTB), ABNT NBR 13771 (Perícias e Vistorias em Sinistros Veiculares), ABNT NBR 5462 (Confiabilidade e Mantenabilidade)'
  );

  // ETAPA 8: Conclusão e Parecer Final
  const [conclusaoTexto, setConclusaoTexto] = useState(
    'A quebra do motor foi provocada pelo dessincronismo mecânico resultante da ruptura por fadiga da correia dentada. O nexo de causalidade com a manutenção mecânica prévia resta AFASTADO tecnicamente em virtude do decurso substancial de quilometragem e tempo decorrido, superando o prazo de garantia legal de 90 dias do CDC (Art. 26, II). Descartado mau uso pelo condutor.'
  );
  const [quesitosRespostas, setQuesitosRespostas] = useState(
    '1. A avaria decorreu de vício de montagem ou de ciclo de vida útil? R: Decorreu de fadiga cíclica de material e decurso de ciclo de vida útil, sem liame com falha imediata de torque na oficina.\n2. Há responsabilidade da oficina prestadora? R: Não, ante o decurso de prazo legal decadencial do CDC e quilometragem rodada.\n3. Há indícios de má operação? R: Não foram constatados indícios de condução abusiva ou sobre-rotação.'
  );

  // ETAPA 9: Revisão, Capa, Sumário e ART
  const [laudoNumero, setLaudoNumero] = useState(
    laudoAtual?.numero || `LAR-${new Date().getFullYear()}-${String(Math.floor(1 + Math.random() * 999)).padStart(3, '0')}`
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

  const garantiaExpirada = diasIntervaloCalc > 90;

  // Matriz de Nexo Causal Automática com Semáforo
  const matrizNexoCausal: MatrizNexoCausal = useMemo(() => {
    let classificacao: NexoCausalClassificacao = 'descartado';
    let rotulo = 'Nexo Causal Descartado';
    let cor = 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
    let justificativa = `O veículo operou por ${kmIntervaloCalc.toLocaleString('pt-BR')} km ao longo de ${diasIntervaloCalc} dias, superando o prazo decadencial de 90 dias do CDC (Art. 26, II). A integridade do serviço prévio operou satisfatoriamente ao longo de milhares de quilômetros, afastando vício de montagem imediato.`;

    if (classificacaoNexoManual) {
      classificacao = classificacaoNexoManual;
    } else if (kmIntervaloCalc <= 1500 && diasIntervaloCalc <= 90) {
      classificacao = 'confirmado';
    } else if (kmIntervaloCalc <= 5000 && diasIntervaloCalc <= 90) {
      classificacao = 'indeterminado';
    }

    if (classificacao === 'confirmado') {
      rotulo = 'Nexo Causal Confirmado (Falha Imediata)';
      cor = 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800';
      justificativa = `Falha ocorrida em regime precoce (${kmIntervaloCalc.toLocaleString('pt-BR')} km / ${diasIntervaloCalc} dias), dentro da vigência do CDC, com indícios materiais de defeito de montagem ou componente prematuro.`;
    } else if (classificacao === 'indeterminado') {
      rotulo = 'Nexo Causal Indeterminado (Concorrente)';
      cor = 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      justificativa = `Presença de fatores técnicos concorrentes. Recomenda-se exame metalográfico complementar de fratura e checagem de parâmetros de injeção na ECU.`;
    }

    return {
      classificacao,
      rotulo,
      cor,
      justificativa,
      intervaloKm: kmIntervaloCalc,
      intervaloDias: diasIntervaloCalc,
      garantiaExpirada
    };
  }, [classificacaoNexoManual, kmIntervaloCalc, diasIntervaloCalc, garantiaExpirada]);

  // Carregar Caso Prático de Exemplo (Frota Corporativa)
  const carregarCasoPratico = () => {
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
      'Ruptura mecânica catastrófica da correia dentada com perda total do sincronismo cinemático entre virabrequim e comando de válvulas, acarretando colisão direta do prato das válvulas de admissão e escape contra o topo dos pistões dos cilindros 1 e 4.'
    );
    setClassificacaoNexoManual('descartado');
  };

  // Analisar com IA na Etapa 6
  const handleAnalisarComIA = async () => {
    setGerandoIA(true);
    registrarUsoIA('Análise Assistida por IA - Causa Raiz', 1);

    const clienteObj = clientes.find(c => c.id === clienteId);
    const dadosEntrada: DadosEntradaCausaRaiz = {
      ativo: { marca, modelo, anoModelo, placa, renavam, chassi, kmAtual, kmIntervencaoPrevia },
      contexto: { dataPane, dataIntervencaoPrevia, historicoManutencao, oficinaTerceirizada, restricaoConfidencialidade, kmIntervalo: kmIntervaloCalc },
      evidencias: {
        descricaoAvarias,
        componentesAvariados: tabelaDanos.filter(d => d.condicao !== 'Íntegro').map(d => d.nome)
      },
      escopo: { determinarCausaRaiz, analisarNexoCausal, verificarGarantiaCDC, avaliarMauUso },
      clienteNome: clienteObj?.razaoSocial,
      clienteCnpj: clienteObj?.cnpj,
      laudoNumero,
      artNumero,
      dataEmissao: dataPane
    };

    try {
      let resultado: ResultadoLaudoCausaRaiz | null = null;
      try {
        const res = await fetch('/api/ai/gerar-laudo-causa-raiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dadosEntrada)
        });
        if (res.ok) {
          const json = await res.json();
          if (json.causaRaizIdentificada) {
            resultado = json;
          }
        }
      } catch (errApi) {
        console.warn('API indisponível, aplicando motor offline:', errApi);
      }

      if (!resultado) {
        resultado = gerarLaudoCausaRaizOffline(dadosEntrada);
      }

      setCausaRaizTexto(resultado.causaRaizIdentificada);
      setConclusaoTexto(resultado.conclusaoGeral);
      setDescarteMauUsoTexto(resultado.indiciosMauUso);
      setEnquadramentoCdcTexto(resultado.enquadramentoGarantiaCDC);
      setAnaliseIaFeita(true);
    } catch (err: any) {
      console.error('Erro na análise por IA:', err);
    } finally {
      setGerandoIA(false);
    }
  };

  // Finalização do Laudo no Wizard
  const handleFinalizarWizard = () => {
    const clienteObj = clientes.find(c => c.id === clienteId);
    const ativoObj = ativos.find(a => a.id === ativoId);

    // Constrói as 13 seções no formato do Laudo
    const dadosEntrada: DadosEntradaCausaRaiz = {
      ativo: { marca, modelo, anoModelo, placa, renavam, chassi, kmAtual, kmIntervencaoPrevia },
      contexto: { dataPane, dataIntervencaoPrevia, historicoManutencao, oficinaTerceirizada, restricaoConfidencialidade, kmIntervalo: kmIntervaloCalc },
      evidencias: {
        descricaoAvarias: causaRaizTexto,
        componentesAvariados: tabelaDanos.map(d => d.nome)
      },
      escopo: { determinarCausaRaiz, analisarNexoCausal, verificarGarantiaCDC, avaliarMauUso },
      clienteNome: clienteObj?.razaoSocial,
      clienteCnpj: clienteObj?.cnpj,
      laudoNumero,
      artNumero,
      dataEmissao: dataPane
    };

    const resultado = gerarLaudoCausaRaizOffline(dadosEntrada);

    const novasSecoes: LaudoSecao[] = resultado.secoes.map((s, idx) => ({
      id: `sec-${idx + 1}`,
      titulo: s.titulo,
      ordem: s.ordem || idx + 1,
      tipo: idx === 0 ? 'capa' : idx === 1 ? 'apresentacao' : idx === 12 ? 'art_assinatura' : 'corpo_tecnico',
      conteudoHtml: s.conteudoHtml,
      itens: [],
      fotos: fotosEvidencias
    }));

    const novoId = laudoExistenteId || `lau-${Date.now()}`;
    const laudoConstruido: Laudo = {
      id: novoId,
      numero: laudoNumero,
      tipo: 'Perícia de Causa Raiz e Falhas Mecânicas',
      tipoLaudoId: 'laudo-pericia-causa-raiz-automotiva',
      categoriaId: 'cat-4',
      subcategoriaId: 'sub-4-2',
      clienteId: clienteId || clientes[0]?.id || '',
      clienteNome: clienteObj?.razaoSocial || 'Cliente Corporativo',
      clienteCnpj: clienteObj?.cnpj || '',
      ativoId: ativoId || '',
      ativoIdentificacao: `${marca} ${modelo} (${placa})`,
      status: 'finalizado',
      artNumero,
      dataInspecao: dataPane,
      responsavelNome: 'Eng. Vitor Leonardo Cordeiro Linhares',
      responsavelCrea: 'CREA-PE 182229949-0',
      normasReferencia,
      apresentacao: 'Laudo de avaliação técnica pericial de nível corporativo e jurídico para determinação de causa raiz de avarias mecânicas em frotas automotivas.',
      metodologia: metodologiaTexto,
      resumoExecutivo: resultado.resumoExecutivo,
      conclusao: conclusaoTexto,
      matrizNexoCausal,
      secoes: novasSecoes,
      anexosFotos: fotosEvidencias,
      assinaturaDigital: {
        responsavelNome: 'Eng. Vitor Leonardo Cordeiro Linhares',
        responsavelCrea: 'CREA-PE 182229949-0',
        dataHora: new Date().toISOString(),
        hashAutenticidade: `AUT-VL-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
      },
      usoIA: { chamadas: 1 },
      iniciadoComIA: true,
      modoCriacao: 'sugestao_ia',
      criadoEm: laudoAtual?.criadoEm || new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    };

    if (laudoExistenteId) {
      atualizarLaudo(laudoExistenteId, laudoConstruido);
      if (onLaudoAtualizado) onLaudoAtualizado(laudoConstruido);
    } else {
      const laudosNovos = [laudoConstruido, ...laudos];
      localStorage.setItem('vl_laudos', JSON.stringify(laudosNovos));
      fetch('/api/app-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ laudos: laudosNovos })
      }).catch(console.warn);
    }

    if (onFinalizacaoSucesso) {
      onFinalizacaoSucesso(laudoConstruido);
    } else {
      onClose();
      navigate(`/admin/laudos/${novoId}`);
    }
  };

  const ETAPAS_TITULOS = [
    '1. Dados do Ativo',
    '2. Histórico & Pane',
    '3. Escopo & Metodologia',
    '4. Fotos & Evidências',
    '5. Tabela de Danos',
    '6. Análise Causa Raiz (IA)',
    '7. Normas & CDC',
    '8. Parecer Conclusivo',
    '9. Revisão & ART'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[94vh] overflow-hidden my-auto">
        
        {/* Header do Wizard */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600/30 border border-blue-400/30 text-blue-400">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  NOVO IA • Categoria 4
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">LAR-{new Date().getFullYear()}</span>
              </div>
              <h3 className="text-lg font-black tracking-tight text-white mt-0.5">
                Perícia de Causa Raiz e Falhas Mecânicas Automotivas
              </h3>
              <p className="text-xs text-slate-300">
                Fluxo pericial estruturado em 9 etapas com Matriz de Nexo Causal e análise assistida por IA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={carregarCasoPratico}
              type="button"
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Preenche todas as etapas com caso real de rompimento de correia dentada"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Caso Prático de Frota</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de Progresso do Wizard (9 Etapas) */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Etapa {etapaAtual} de 9: <span className="text-blue-600 dark:text-blue-400">{ETAPAS_TITULOS[etapaAtual - 1]}</span>
            </span>
            <span className="font-mono text-slate-400 text-[11px] font-semibold">
              {Math.round((etapaAtual / 9) * 100)}% Concluído
            </span>
          </div>

          {/* Stepper Dots / Bars */}
          <div className="grid grid-cols-9 gap-1.5">
            {ETAPAS_TITULOS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setEtapaAtual(idx + 1)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  etapaAtual === idx + 1
                    ? 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.7)]'
                    : etapaAtual > idx + 1
                    ? 'bg-emerald-500'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
                title={`Ir para etapa ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Corpo do Wizard */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-100">
          
          {/* ========================================================================= */}
          {/* ETAPA 1: DADOS DO ATIVO E CONTRATANTE */}
          {/* ========================================================================= */}
          {etapaAtual === 1 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 flex items-start gap-3">
                <Car className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h4 className="font-bold text-blue-950 dark:text-blue-200">Identificação Cadastral do Veículo</h4>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    Dados do documento oficial (CRLV) e confrontação de odômetros no ato da pane vs. última intervenção prévia.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Cliente / Contratante
                  </label>
                  <select
                    value={clienteId}
                    onChange={e => setClienteId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
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
                    Ativo Cadastrado (Opcional)
                  </label>
                  <select
                    value={ativoId}
                    onChange={e => setAtivoId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="">-- Preencher manualmente abaixo --</option>
                    {ativos.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.identificacao} {a.placa ? `(${a.placa})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Marca do Veículo
                  </label>
                  <input
                    type="text"
                    value={marca}
                    onChange={e => setMarca(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
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
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
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
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
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
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold uppercase"
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
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Número do Chassi (VIN)
                  </label>
                  <input
                    type="text"
                    value={chassi}
                    onChange={e => setChassi(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono uppercase"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Confrontação de Odômetros (km na Pane vs. km na Última Revisão)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Quilometragem na Pane
                    </label>
                    <input
                      type="number"
                      value={kmAtual}
                      onChange={e => setKmAtual(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Quilometragem na Última Revisão
                    </label>
                    <input
                      type="number"
                      value={kmIntervencaoPrevia}
                      onChange={e => setKmIntervencaoPrevia(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Intervalo Rodado
                    </label>
                    <div className="px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold text-xs font-mono">
                      {kmIntervaloCalc.toLocaleString('pt-BR')} km rodados
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ETAPA 2: HISTÓRICO DO EVENTO */}
          {/* ========================================================================= */}
          {etapaAtual === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Data da Quebra / Pane em Campo
                  </label>
                  <input
                    type="date"
                    value={dataPane}
                    onChange={e => setDataPane(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Data da Última Intervenção Prévia
                  </label>
                  <input
                    type="date"
                    value={dataIntervencaoPrevia}
                    onChange={e => setDataIntervencaoPrevia(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
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
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Histórico Detalhado do Serviço Pretérito
                </label>
                <textarea
                  rows={4}
                  value={historicoManutencao}
                  onChange={e => setHistoricoManutencao(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="chk-confidencialidade-2"
                  checked={restricaoConfidencialidade}
                  onChange={e => setRestricaoConfidencialidade(e.target.checked)}
                  className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="chk-confidencialidade-2" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <strong>Cláusula de Confidencialidade Comercial Ativa:</strong> Resguardar dados orçamentários internos e notas fiscais de fornecedores terceiros para proteger a relação contratual e a governança corporativa da frota.
                </label>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ETAPA 3: OBJETIVO E METODOLOGIA PERICIAL */}
          {/* ========================================================================= */}
          {etapaAtual === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-amber-600" />
                  <span>Checklist de Escopo Mandatório</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={determinarCausaRaiz}
                      onChange={e => setDeterminarCausaRaiz(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span><strong>Determinar Causa Raiz:</strong> Investigação do elemento iniciador da falha mecânica catastrófica.</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={analisarNexoCausal}
                      onChange={e => setAnalisarNexoCausal(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span><strong>Analisar Nexo Causal:</strong> Verificar correlação ou descaracterização frente ao serviço pretérito.</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={verificarGarantiaCDC}
                      onChange={e => setVerificarGarantiaCDC(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span><strong>Verificar Prazos de Garantia (CDC):</strong> Aferir o decurso do prazo legal de 90 dias do Art. 26, II da Lei 8.078/90.</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={avaliarMauUso}
                      onChange={e => setAvaliarMauUso(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span><strong>Descarte de Mau Uso:</strong> Avaliar conduta do motorista, rotação excessiva (over-rev) e lubrificação.</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Metodologia Pericial Aplicada
                </label>
                <textarea
                  rows={4}
                  value={metodologiaTexto}
                  onChange={e => setMetodologiaTexto(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ETAPA 4: REGISTROS FOTOGRÁFICOS E EVIDÊNCIAS */}
          {/* ========================================================================= */}
          {etapaAtual === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Descrição Inicial das Avarias Técnicas Encontradas
                </label>
                <textarea
                  rows={3}
                  value={descricaoAvarias}
                  onChange={e => setDescricaoAvarias(e.target.value)}
                  placeholder="Descreva visual e tecnicamente as avarias detectadas nos componentes..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 leading-relaxed text-slate-800 dark:text-slate-100"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Ex.: Ruptura da correia sincronizadora dentada, empenamento de válvulas por interferência cinética mecânica, marcas de impacto no topo dos pistões.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Registros Fotográficos Principais com Legendas Analíticas
                  </h4>
                  <p className="text-xs text-slate-500">
                    Reaproveitando o componente padrão de upload de evidências por seção com legenda analítica.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fotosEvidencias.map((foto, idx) => (
                  <div key={foto.id} className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 space-y-2">
                    <div className="relative h-40 bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden group">
                      <img
                        src={foto.url}
                        alt={foto.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                        Foto 0{idx + 1}
                      </div>
                    </div>

                    <input
                      type="text"
                      value={foto.titulo}
                      onChange={e => {
                        const val = e.target.value;
                        setFotosEvidencias(prev => prev.map(f => f.id === foto.id ? { ...f, titulo: val } : f));
                      }}
                      placeholder="Título da Foto"
                      className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    />

                    <textarea
                      rows={2}
                      value={foto.legenda}
                      onChange={e => {
                        const val = e.target.value;
                        setFotosEvidencias(prev => prev.map(f => f.id === foto.id ? { ...f, legenda: val } : f));
                      }}
                      placeholder="Legenda analítica técnica da foto..."
                      className="w-full px-2.5 py-1.5 text-[11px] rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ETAPA 5: CONSTATAÇÃO DE DANOS (TABELA ITEM A ITEM) */}
          {/* ========================================================================= */}
          {etapaAtual === 5 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Tabela de Constatação de Danos e Integridade Técnica (Seção VII)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Inspeção componente a componente com condição e parecer técnico pericial específico.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3 w-12 text-center">Item</th>
                      <th className="p-3 w-64">Peça / Componente</th>
                      <th className="p-3 w-36 text-center">Condição</th>
                      <th className="p-3">Parecer Técnico Pericial</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {tabelaDanos.map((d, index) => (
                      <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-3 text-center font-bold font-mono text-slate-400">
                          {d.item}
                        </td>
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">
                          {d.nome}
                        </td>
                        <td className="p-3 text-center">
                          <select
                            value={d.condicao}
                            onChange={e => {
                              const novaCond = e.target.value as ComponenteDanoItem['condicao'];
                              setTabelaDanos(prev => prev.map((item, i) => i === index ? { ...item, condicao: novaCond } : item));
                            }}
                            className={`px-2 py-1 rounded-md text-[11px] font-bold border ${
                              d.condicao === 'Danificado'
                                ? 'bg-red-50 text-red-700 border-red-300'
                                : d.condicao === 'Parcial'
                                ? 'bg-amber-50 text-amber-700 border-amber-300'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            }`}
                          >
                            <option value="Danificado">Danificado</option>
                            <option value="Parcial">Parcial</option>
                            <option value="Íntegro">Íntegro</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={d.parecer}
                            onChange={e => {
                              const val = e.target.value;
                              setTabelaDanos(prev => prev.map((item, i) => i === index ? { ...item, parecer: val } : item));
                            }}
                            className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ETAPA 6: ANÁLISE DE CAUSA RAIZ (IA) & MATRIZ DE NEXO CAUSAL */}
          {/* ========================================================================= */}
          {etapaAtual === 6 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Box de Análise com IA */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900/10 via-blue-900/10 to-indigo-900/10 border border-purple-200 dark:border-purple-800/60 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-purple-600 text-white">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-purple-950 dark:text-purple-200">
                        Análise de Causa Raiz Assistida por IA (Gemini)
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Processa a mecânica da falha, confronta os odômetros e sugere a causa provável como rascunho editável.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAnalisarComIA}
                    disabled={gerandoIA}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {gerandoIA ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processando IA...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Analisar com IA</span>
                      </>
                    )}
                  </button>
                </div>

                {analiseIaFeita && (
                  <div className="p-2.5 rounded-xl bg-purple-100/70 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-purple-900 dark:text-purple-300 text-[11px] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Sugestão pericial gerada com sucesso pela IA. Revise e edite os campos abaixo livremente.</span>
                  </div>
                )}
              </div>

              {/* MATRIZ DE NEXO CAUSAL COM SEMÁFORO PRÓPRIO */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Indicador Específico do Módulo
                      </span>
                    </div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                      Matriz de Nexo Causal & Enquadramento Semafórico
                    </h4>
                  </div>

                  {/* Semáforo Atual */}
                  <div className={`px-4 py-1.5 rounded-full border text-xs font-black flex items-center gap-2 ${matrizNexoCausal.cor}`}>
                    <span className="w-2.5 h-2.5 rounded-full bg-current animate-pulse" />
                    <span>{matrizNexoCausal.rotulo}</span>
                  </div>
                </div>

                {/* Seletores manuais de semáforo */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setClassificacaoNexoManual('descartado')}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      matrizNexoCausal.classificacao === 'descartado'
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-xs">
                      <span>Nexo Descartado</span>
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-[10px] text-slate-500">Garantia expirada (&gt; 90 dias) e quilometragem alta</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setClassificacaoNexoManual('indeterminado')}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      matrizNexoCausal.classificacao === 'indeterminado'
                        ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-xs">
                      <span>Nexo Indeterminado</span>
                      <span className="w-3 h-3 rounded-full bg-amber-500" />
                    </div>
                    <span className="text-[10px] text-slate-500">Fatores concorrentes ou exames pendentes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setClassificacaoNexoManual('confirmado')}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      matrizNexoCausal.classificacao === 'confirmado'
                        ? 'bg-red-50 dark:bg-red-950/50 border-red-500 text-red-900 dark:text-red-200 ring-2 ring-red-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-xs">
                      <span>Nexo Confirmado</span>
                      <span className="w-3 h-3 rounded-full bg-red-500" />
                    </div>
                    <span className="text-[10px] text-slate-500">Dentro da garantia (≤ 90 dias) e falha de montagem</span>
                  </button>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl text-xs text-slate-700 dark:text-slate-300">
                  <strong>Justificativa Técnica:</strong> {matrizNexoCausal.justificativa}
                </div>
              </div>

              {/* Campo Editável de Causa Raiz */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Parecer Técnico sobre a Causa Raiz da Falha
                </label>
                <textarea
                  rows={3}
                  value={causaRaizTexto}
                  onChange={e => setCausaRaizTexto(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 leading-relaxed font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Descarte de Hipóteses Concorrentes (Mau Uso e Sobreaquecimento)
                </label>
                <textarea
                  rows={3}
                  value={descarteMauUsoTexto}
                  onChange={e => setDescarteMauUsoTexto(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ETAPA 7: ENQUADRAMENTO LEGAL E NORMATIVO */}
          {/* ========================================================================= */}
          {etapaAtual === 7 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h4 className="font-bold text-blue-950 dark:text-blue-200">
                    Fundamentação Legal no CDC e Normas Técnicas
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    Enquadramento formal no Art. 26 do Código de Defesa do Consumidor e normas ABNT aplicáveis.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Normas Técnicas de Referência
                </label>
                <input
                  type="text"
                  value={normasReferencia}
                  onChange={e => setNormasReferencia(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Enquadramento Formal quanto aos Prazos de Garantia do CDC
                </label>
                <textarea
                  rows={5}
                  value={enquadramentoCdcTexto}
                  onChange={e => setEnquadramentoCdcTexto(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 leading-relaxed font-mono"
                />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ETAPA 8: CONCLUSÃO E PARECER FINAL */}
          {/* ========================================================================= */}
          {etapaAtual === 8 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Conclusão Técnica Pericial Conclusiva (Seção VIII)
                </label>
                <textarea
                  rows={5}
                  value={conclusaoTexto}
                  onChange={e => setConclusaoTexto(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 leading-relaxed font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Respostas Formais aos Quesitos do Contratante
                </label>
                <textarea
                  rows={4}
                  value={quesitosRespostas}
                  onChange={e => setQuesitosRespostas(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ETAPA 9: REVISÃO, CAPA, SUMÁRIO E ART */}
          {/* ========================================================================= */}
          {etapaAtual === 9 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                <Award className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h4 className="font-bold text-emerald-950 dark:text-emerald-200">
                    Homologação Oficial e Vinculação de ART
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    Geração do laudo no padrão sequencial <strong>{laudoNumero}</strong>, sumário executivo automático e chancela CREA-PE 182229949-0.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Numeração Sequencial Padrão
                  </label>
                  <input
                    type="text"
                    value={laudoNumero}
                    onChange={e => setLaudoNumero(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-blue-600 dark:text-blue-400"
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
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Resumo Consolidado do Laudo */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <div className="flex items-center justify-between border-b pb-2 dark:border-slate-700">
                  <span className="text-slate-500">Ativo / Veículo:</span>
                  <span className="font-bold">{marca} {modelo} ({placa})</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2 dark:border-slate-700">
                  <span className="text-slate-500">Matriz de Nexo Causal:</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${matrizNexoCausal.cor}`}>
                    {matrizNexoCausal.rotulo}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b pb-2 dark:border-slate-700">
                  <span className="text-slate-500">Quilometragem no Intervalo:</span>
                  <span className="font-mono font-bold">{kmIntervaloCalc.toLocaleString('pt-BR')} km ({diasIntervaloCalc} dias)</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-500">Responsável Técnico:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Eng. Vitor Leonardo (CREA-PE 182229949-0)</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Rodapé do Wizard com Navegação Entre Etapas */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between gap-3">
          
          <div>
            {etapaAtual > 1 && (
              <button
                type="button"
                onClick={() => setEtapaAtual(prev => prev - 1)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            {etapaAtual < 9 ? (
              <button
                type="button"
                onClick={() => setEtapaAtual(prev => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Avançar para Etapa {etapaAtual + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalizarWizard}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Award className="w-4 h-4 text-emerald-200" />
                <span>Finalizar Laudo com ART CREA-PE</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
