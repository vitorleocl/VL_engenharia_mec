import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle,
  MinusCircle, 
  Camera, 
  Plus, 
  Trash2, 
  MapPin, 
  Building2, 
  Cpu, 
  FileText, 
  UserCheck, 
  Check, 
  Sparkles,
  RefreshCw,
  Navigation,
  Gauge,
  ListFilter,
  CheckSquare,
  ArrowRight,
  Layers,
  Clock,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ChecklistCampo, 
  ChecklistCampoItem, 
  ChecklistCampoItemStatus, 
  TipoLaudoDef, 
  PerigoApreciacaoRiscoNR12,
  ChecklistCriticidade,
  EvidenciaFoto,
  LaudoSecao
} from '../../types';
import { RubricaSignatureCanvas } from './RubricaSignatureCanvas';
import { ChecklistItemRenderer } from './ChecklistItemRenderer';
import { TabelaApreciacaoRiscoNR12 } from './TabelaApreciacaoRiscoNR12';

interface ChecklistCampoFormModalProps {
  checklistParaEditar?: ChecklistCampo | null;
  onClose: () => void;
  onSaved: (id: string) => void;
}

// B4: MODELOS DE CHECKLIST PRÉ-CONFIGURADOS POR TIPO DE SERVIÇO
export const MODELOS_CHECKLIST_SERVICO = [
  {
    id: 'nr11',
    nome: 'Inspeção Mecânica & Içamento / NR-11',
    subtitulo: 'Pontes rolantes, talhas, guindastes, caminhões munck e olhais',
    norma: 'NR-11 / ABNT NBR 8400 / NBR 14768',
    itens: [
      { id: 'nr11-1', descricao: 'Plaqueta de identificação do fabricante, número de série e capacidade máxima de carga (SWL/CMT) legíveis', criterioReferencia: 'NR-11 / NBR 8400' },
      { id: 'nr11-2', descricao: 'Estrutura metálica do sobrechassi, grampos U e ausência de deformações plásticas ou trincas em soldas', criterioReferencia: 'NBR 14768' },
      { id: 'nr11-3', descricao: 'Cilindros hidráulicos de elevação e extensão com válvulas de retenção de segurança pilotadas e sem vazamentos', criterioReferencia: 'NR-11.1.3' },
      { id: 'nr11-4', descricao: 'Mangueiras hidráulicas de alta pressão íntegras, sem fissuras, ressecamento ou estufamento sob pressão', criterioReferencia: 'SAE 100R2AT' },
      { id: 'nr11-5', descricao: 'Sapatas estabilizadoras hidráulicas com travas mecânicas de segurança operacionais em ambos os lados', criterioReferencia: 'NBR 14768' },
      { id: 'nr11-6', descricao: 'Gancho forjado com trava de segurança por mola em perfeito funcionamento e desgaste dimensional < 10%', criterioReferencia: 'DIN 15401' },
      { id: 'nr11-7', descricao: 'Cabo de aço de elevação: ausência de arames rompidos, nós, dobras (gaiola de passarinho) ou corrosão severa', criterioReferencia: 'ISO 4309' },
      { id: 'nr11-8', descricao: 'Dispositivos de parada de emergência, fim de curso e limitador de momento de carga (LMI) operacionais', criterioReferencia: 'NR-11 / NR-12' },
    ]
  },
  {
    id: 'nr12',
    nome: 'Segurança de Máquinas & Equipamentos / NR-12',
    subtitulo: 'Prensas, esteiras, tornos, centros de usinagem e linhas industriais',
    norma: 'NR-12 / ABNT NBR ISO 12100 / NBR 13849',
    itens: [
      { id: 'nr12-1', descricao: 'Plaqueta de identificação indelével com razão social, CNPJ, modelo, número de série e ano de fabricação', criterioReferencia: 'NR-12.11' },
      { id: 'nr12-2', descricao: 'Proteções fixas enclausurando totalmente as zonas de perigo mecânico, devidamente parafusadas', criterioReferencia: 'NR-12.38' },
      { id: 'nr12-3', descricao: 'Proteções móveis dotadas de chaves de intertravamento de segurança de ruptura positiva monitoradas', criterioReferencia: 'NR-12.41' },
      { id: 'nr12-4', descricao: 'Botões de parada de emergência do tipo cogumelo com retenção mecânica, desarmando o comando de força', criterioReferencia: 'NR-12.56' },
      { id: 'nr12-5', descricao: 'Dispositivo de seccionamento principal com bloqueio por cadeado para manutenção (LOTO)', criterioReferencia: 'NR-12.113' },
      { id: 'nr12-6', descricao: 'Sinalização visual de segurança, advertências de riscos residuais e diagramas unifilares legíveis', criterioReferencia: 'NR-12.116' },
      { id: 'nr12-7', descricao: 'Aterramento elétrico de carcaça e equipotencialização das massas metálicas com laudo de continuidade', criterioReferencia: 'NR-10 / NR-12.14' },
      { id: 'nr12-8', descricao: 'Manual de operação em língua portuguesa disponível no local de operação da máquina', criterioReferencia: 'NR-12.125' }
    ]
  },
  {
    id: 'nr13',
    nome: 'Vasos de Pressão, Caldeiras & Tubulações / NR-13',
    subtitulo: 'Compressores de ar, pulmões, caldeiras, autoclaves e permutadores',
    norma: 'NR-13 / ASME Seção VIII Div. 1',
    itens: [
      { id: 'nr13-1', descricao: 'Prontuário técnico do vaso de pressão devidamente reconstituído e atualizado com registro de inspeções', criterioReferencia: 'NR-13.5.1.4' },
      { id: 'nr13-2', descricao: 'Placa de identificação indelével contendo fabricante, nº de série, PMTA, pressão de teste e categoria', criterioReferencia: 'NR-13.5.1.3' },
      { id: 'nr13-3', descricao: 'Válvula de segurança (PSV) com certificado de calibração válido, lacre inviolável e tubulação de alívio segura', criterioReferencia: 'NR-13.5.1.2' },
      { id: 'nr13-4', descricao: 'Manômetro com escala adequada à PMTA, ponteiro desimpedido e certificado de calibração RBC', criterioReferencia: 'NR-13.5.1.2' },
      { id: 'nr13-5', descricao: 'Dreno de condensado inferior operacional e purgador automático em funcionamento regular', criterioReferencia: 'NR-13.5.1.2' },
      { id: 'nr13-6', descricao: 'Ensaio visual e medição de espessura de costado e tampos por ultrassom (calculando taxa de corrosão)', criterioReferencia: 'ASME Sec. VIII' },
      { id: 'nr13-7', descricao: 'Inspeção interna (se aplicável) ou teste hidrostático / estanqueidade com emissão de gráfico pressiométrico', criterioReferencia: 'NR-13.5.4' }
    ]
  },
  {
    id: 'pmoc',
    nome: 'Climatização & Refrigeração / PMOC',
    subtitulo: 'Chillers, centrais de ar condicionado, VRF, dutos e fancoils',
    norma: 'Lei Federal 13.589/2018 / Portaria MS 3.523 / Resolução ANVISA RE 09',
    itens: [
      { id: 'pmoc-1', descricao: 'Filtros de ar: estado de conservação, ausência de saturação por poeira, rasgos ou desencaixes', criterioReferencia: 'Portaria 3.523' },
      { id: 'pmoc-2', descricao: 'Bandeja de condensado limpa, isenta de acúmulo de lodo biológico, água estagnada e com dreno livre', criterioReferencia: 'ANVISA RE 09' },
      { id: 'pmoc-3', descricao: 'Serpentinas de troca térmica limpas, sem oxidação severa e com aletas desamassadas', criterioReferencia: 'PMOC Técnico' },
      { id: 'pmoc-4', descricao: 'Moto-ventiladores, polias e correias de transmissão devidamente alinhados, tensionados e sem folgas', criterioReferencia: 'Boas Práticas' },
      { id: 'pmoc-5', descricao: 'Ausência de vazamentos de fluido refrigerante (R-410A / R-134a) e isolamento térmico das tubulações íntegro', criterioReferencia: 'ASHRAE / NBR' },
      { id: 'pmoc-6', descricao: 'Renovação de ar externo (G1/F5) e tomada de ar externo desprovida de fontes poluidoras próximas', criterioReferencia: 'ANVISA RE 09' }
    ]
  },
  {
    id: 'fft',
    nome: 'Análise Preditiva de Vibração Espectral (FFT)',
    subtitulo: 'Moto-bombas, redutores, compressores e ventiladores industriais',
    norma: 'ABNT NBR ISO 10816-3 / ISO 20816-1 / ISO 13373',
    itens: [
      { id: 'fft-1', descricao: 'Mancal Dianteiro Motor: Velocidade de vibração global RMS (mm/s) e aceleração de pico (g)', criterioReferencia: 'ISO 10816-3' },
      { id: 'fft-2', descricao: 'Mancal Traseiro Motor: Análise de desbalanceamento mecânico na frequência de rotação 1X', criterioReferencia: 'ISO 10816-3' },
      { id: 'fft-3', descricao: 'Mancal Dianteiro Bomba/Carga: Verificação de folgas estruturais e desalinhamento 2X/3X', criterioReferencia: 'ISO 20816-1' },
      { id: 'fft-4', descricao: 'Acoplamento Flexível: Inspeção de integridade dos elastômeros, parafusos e alinhamento a laser', criterioReferencia: 'Boas Práticas' },
      { id: 'fft-5', descricao: 'Fixação e Base de Concreto: Ausência de soltura de chumbadores e trincas na base metálica', criterioReferencia: 'ISO 10816-3' },
      { id: 'fft-6', descricao: 'Temperatura operacional dos mancais monitorada por termografia dentro dos limites de classe térmica', criterioReferencia: 'ISO 18434' }
    ]
  }
];

export const ChecklistCampoFormModal: React.FC<ChecklistCampoFormModalProps> = ({
  checklistParaEditar,
  onClose,
  onSaved,
}) => {
  const navigate = useNavigate();
  const { clientes, ativos, orcamentos, categoriasLaudo, adicionarChecklistCampo, atualizarChecklistCampo, criarNovoLaudo } = useData();
  const { currentUser } = useAuth();

  // B3: Vínculo Obrigatório com Orçamento e Equipamento
  const [vinculadoAOrcamentoId, setVinculadoAOrcamentoId] = useState<string>(
    checklistParaEditar?.vinculadoAOrcamentoId || ''
  );
  const [clienteId, setClienteId] = useState<string>(checklistParaEditar?.clienteId || '');
  const [ativoId, setAtivoId] = useState<string>(checklistParaEditar?.ativoId || '');
  const [tipoServicoSelecionado, setTipoServicoSelecionado] = useState<string>(() => {
    if (checklistParaEditar?.tipoLaudoId) {
      if (checklistParaEditar.tipoLaudoId.includes('nr11') || checklistParaEditar.tipoLaudoId.includes('munck')) return 'nr11';
      if (checklistParaEditar.tipoLaudoId.includes('nr12') || checklistParaEditar.tipoLaudoId.includes('maquina')) return 'nr12';
      if (checklistParaEditar.tipoLaudoId.includes('nr13') || checklistParaEditar.tipoLaudoId.includes('vaso')) return 'nr13';
      if (checklistParaEditar.tipoLaudoId.includes('pmoc') || checklistParaEditar.tipoLaudoId.includes('clima')) return 'pmoc';
      if (checklistParaEditar.tipoLaudoId.includes('fft') || checklistParaEditar.tipoLaudoId.includes('vibra')) return 'fft';
    }
    return 'nr11';
  });

  const [tipoLaudoId, setTipoLaudoId] = useState<string>(checklistParaEditar?.tipoLaudoId || 'laudo-nr11-munck');

  // Itens de Verificação
  const [itens, setItens] = useState<ChecklistCampoItem[]>(() => {
    if (checklistParaEditar?.itens && checklistParaEditar.itens.length > 0) {
      return checklistParaEditar.itens;
    }
    // Preenche com o modelo padrão inicial sem pré-seleção (status: 'pendente')
    const modelo = MODELOS_CHECKLIST_SERVICO[0];
    return modelo.itens.map((it, idx) => ({
      id: `it-${it.id || idx + 1}`,
      descricao: it.descricao,
      criterioReferencia: it.criterioReferencia,
      status: 'pendente' as ChecklistCampoItemStatus,
      observacao: '',
      tipoResposta: 'conformidade',
    }));
  });

  const [itensExtras, setItensExtras] = useState<ChecklistCampoItem[]>(checklistParaEditar?.itensExtras || []);
  const [perigosNR12, setPerigosNR12] = useState<PerigoApreciacaoRiscoNR12[]>(checklistParaEditar?.perigosApreciacaoRisco || []);

  // Rubrica & Responsável
  const [rubricaUrl, setRubricaUrl] = useState<string | undefined>(checklistParaEditar?.rubricaUrl);
  const [responsavelNome, setResponsavelNome] = useState<string>(
    checklistParaEditar?.responsavelNome || currentUser?.nome || 'Eng. Vitor Leonardo Cordeiro Linhares'
  );
  const [responsavelCrea, setResponsavelCrea] = useState<string>(
    checklistParaEditar?.responsavelCrea || (currentUser as any)?.crea || 'CREA-PE 182229949-0'
  );

  // Data e Hora de Início
  const [dataPreenchimento, setDataPreenchimento] = useState<string>(
    checklistParaEditar?.dataPreenchimento || new Date().toISOString()
  );

  // Geolocalização
  const [geolocalizacao, setGeolocalizacao] = useState<{
    lat: number;
    lng: number;
    precisao?: number;
    enderecoAproximado?: string;
  } | null>(checklistParaEditar?.geolocalizacao || null);
  const [capturandoGps, setCapturandoGps] = useState(false);

  const [disponibilizadoParaCliente, setDisponibilizadoParaCliente] = useState<boolean>(
    checklistParaEditar?.disponibilizadoParaCliente ?? false
  );
  const [novoItemDescricao, setNovoItemDescricao] = useState('');
  const [erroValidacao, setErroValidacao] = useState<string | null>(null);

  // Informações derivadas
  const orcamentoVinculado = useMemo(() => {
    return orcamentos.find(o => o.id === vinculadoAOrcamentoId);
  }, [orcamentos, vinculadoAOrcamentoId]);

  const clienteSelecionado = useMemo(() => {
    return clientes.find(c => c.id === clienteId);
  }, [clientes, clienteId]);

  const ativosDoCliente = useMemo(() => {
    return ativos.filter(a => a.clienteId === clienteId);
  }, [ativos, clienteId]);

  const ativoSelecionado = useMemo(() => {
    return ativos.find(a => a.id === ativoId);
  }, [ativos, ativoId]);

  // Sincronizar dados quando o Orçamento Aprovado é selecionado
  const handleSelecionarOrcamento = (orcId: string) => {
    setVinculadoAOrcamentoId(orcId);
    if (!orcId) return;

    const orc = orcamentos.find(o => o.id === orcId);
    if (orc) {
      if (orc.clienteId) setClienteId(orc.clienteId);
      if (orc.ativoId) setAtivoId(orc.ativoId);

      // Auto-selecionar o serviço baseado no escopo do orçamento
      const servicoLower = (orc.servico || '').toLowerCase();
      if (servicoLower.includes('vibra') || servicoLower.includes('fft')) {
        handleTrocarModeloServico('fft');
      } else if (servicoLower.includes('nr-12') || servicoLower.includes('prensa') || servicoLower.includes('máquina')) {
        handleTrocarModeloServico('nr12');
      } else if (servicoLower.includes('nr-13') || servicoLower.includes('caldeira') || servicoLower.includes('vaso')) {
        handleTrocarModeloServico('nr13');
      } else if (servicoLower.includes('pmoc') || servicoLower.includes('ar condicionado') || servicoLower.includes('clima')) {
        handleTrocarModeloServico('pmoc');
      } else if (servicoLower.includes('nr-11') || servicoLower.includes('munck') || servicoLower.includes('guindaste') || servicoLower.includes('içamento')) {
        handleTrocarModeloServico('nr11');
      }
    }
  };

  // Troca de Modelo de Serviço de Inspeção (NR-11, NR-12, NR-13, PMOC, FFT)
  const handleTrocarModeloServico = (modeloId: string) => {
    setTipoServicoSelecionado(modeloId);
    const mod = MODELOS_CHECKLIST_SERVICO.find(m => m.id === modeloId);
    if (!mod) return;

    setTipoLaudoId(`laudo-${modeloId}`);
    // Gera itens do novo modelo sem pré-seleção (obriga inspeção real in loco)
    const novosItens: ChecklistCampoItem[] = mod.itens.map((it, idx) => ({
      id: `it-${it.id || idx + 1}`,
      descricao: it.descricao,
      criterioReferencia: it.criterioReferencia,
      status: 'pendente',
      observacao: '',
      tipoResposta: 'conformidade',
    }));
    setItens(novosItens);
  };

  // Handlers para o ChecklistItemRenderer
  const handleItemStatusChange = (id: string, status: ChecklistCampoItemStatus, isExtra: boolean = false) => {
    const updater = (list: ChecklistCampoItem[]) => list.map(it => it.id === id ? { ...it, status } : it);
    if (isExtra) setItensExtras(updater);
    else setItens(updater);
  };

  const handleItemValorChange = (id: string, valor: string | number | null, isExtra: boolean = false) => {
    const valorResposta = valor !== null && valor !== undefined ? String(valor) : '';
    const updater = (list: ChecklistCampoItem[]) => list.map(it => it.id === id ? { ...it, valor, valorResposta } : it);
    if (isExtra) setItensExtras(updater);
    else setItens(updater);
  };

  const handleItemObsChange = (id: string, observacao: string, isExtra: boolean = false) => {
    const updater = (list: ChecklistCampoItem[]) => list.map(it => it.id === id ? { ...it, observacao } : it);
    if (isExtra) setItensExtras(updater);
    else setItens(updater);
  };

  const handleItemCriticidadeChange = (id: string, criticidade: ChecklistCriticidade, isExtra: boolean = false) => {
    const updater = (list: ChecklistCampoItem[]) => list.map(it => it.id === id ? { 
      ...it, 
      criticidade,
      naoConformidade: { ...(it.naoConformidade || {}), criticidade }
    } : it);
    if (isExtra) setItensExtras(updater);
    else setItens(updater);
  };

  const handleItemAcaoRecomendadaChange = (id: string, acao: string, isExtra: boolean = false) => {
    const updater = (list: ChecklistCampoItem[]) => list.map(it => it.id === id ? { 
      ...it, 
      acaoRecomendada: acao,
      naoConformidade: { ...(it.naoConformidade || {}), recomendacao: acao }
    } : it);
    if (isExtra) setItensExtras(updater);
    else setItens(updater);
  };

  const handleItemMedicaoChange = (id: string, medicao: { valor?: string | number; unidade?: string; referencia?: string }, isExtra: boolean = false) => {
    const updater = (list: ChecklistCampoItem[]) => list.map(it => it.id === id ? {
      ...it,
      medicao: {
        ...(it.medicao || {}),
        valorEncontrado: medicao.valor,
        unidade: medicao.unidade,
        tolerancia: medicao.referencia,
      }
    } : it);
    if (isExtra) setItensExtras(updater);
    else setItens(updater);
  };

  const handleItemFotoUpload = (id: string, fileOrBase64: File | string, legenda?: string, isExtra: boolean = false) => {
    const processarUrl = (url: string, nomeArquivo: string) => {
      const novaFoto: EvidenciaFoto = {
        id: `foto-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        url,
        legenda: legenda || `Evidência fotográfica`,
        titulo: legenda || `Registro`,
        timestamp: new Date().toISOString()
      };

      const updater = (list: ChecklistCampoItem[]) => list.map(it => {
        if (it.id !== id) return it;
        const fotosAtuais = it.fotos || [];
        return {
          ...it,
          fotoUrl: url,
          fotoNome: nomeArquivo,
          fotos: [...fotosAtuais, novaFoto],
          fotosUrls: [...(it.fotosUrls || []), url],
        };
      });

      if (isExtra) setItensExtras(updater);
      else setItens(updater);
    };

    if (typeof fileOrBase64 === 'string') {
      processarUrl(fileOrBase64, 'foto-inspecao.jpg');
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        processarUrl(reader.result as string, fileOrBase64.name);
      };
      reader.readAsDataURL(fileOrBase64);
    }
  };

  const handleRemoverFoto = (itemId: string, fotoIdOuIndex?: string | number, isExtra: boolean = false) => {
    const updater = (list: ChecklistCampoItem[]) => list.map(it => {
      if (it.id !== itemId) return it;
      const novasFotos = (it.fotos || []).filter((f, idx) => f.id !== fotoIdOuIndex && idx !== fotoIdOuIndex);
      return {
        ...it,
        fotos: novasFotos,
        fotosUrls: novasFotos.map(f => f.url),
        fotoUrl: novasFotos[0]?.url || undefined,
        fotoNome: novasFotos.length > 0 ? (it.fotoNome || 'foto.jpg') : undefined
      };
    });

    if (isExtra) setItensExtras(updater);
    else setItens(updater);
  };

  const handleAtualizarLegendaFoto = (itemId: string, fotoIdOuIndex: string | number, novaLegenda: string, isExtra: boolean = false) => {
    const updater = (list: ChecklistCampoItem[]) => list.map(it => {
      if (it.id !== itemId) return it;
      const novasFotos = (it.fotos || []).map((f, idx) => {
        if (f.id === fotoIdOuIndex || idx === fotoIdOuIndex) {
          return { ...f, legenda: novaLegenda, titulo: novaLegenda };
        }
        return f;
      });
      return { ...it, fotos: novasFotos };
    });

    if (isExtra) setItensExtras(updater);
    else setItens(updater);
  };

  const handleAdicionarItemExtra = () => {
    if (!novoItemDescricao.trim()) return;
    const novo: ChecklistCampoItem = {
      id: `chk-extra-${Date.now()}`,
      descricao: novoItemDescricao.trim(),
      status: 'pendente',
      observacao: '',
    };
    setItensExtras(prev => [...prev, novo]);
    setNovoItemDescricao('');
  };

  const handleRemoverItemExtra = (id: string) => {
    setItensExtras(prev => prev.filter(it => it.id !== id));
  };

  // Geolocalização
  const handleCapturarGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada neste navegador/dispositivo.');
      return;
    }
    setCapturandoGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeolocalizacao({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          precisao: Math.round(pos.coords.accuracy),
          enderecoAproximado: `Coordenadas: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`
        });
        setCapturandoGps(false);
      },
      (err) => {
        console.warn('Erro GPS:', err);
        setCapturandoGps(false);
        alert('Não foi possível obter a localização. Permita o acesso ao GPS no dispositivo.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // B5: Indicadores de Progresso & Validações de Bloqueio
  const todosItens = useMemo(() => [...itens, ...itensExtras], [itens, itensExtras]);
  const totalItensCount = todosItens.length;
  const respondidosCount = todosItens.filter(i => i.status && i.status !== 'pendente').length;
  const conformesCount = todosItens.filter(i => i.status === 'conforme').length;
  const naoConformesCount = todosItens.filter(i => i.status === 'nao_conforme').length;
  const naCount = todosItens.filter(i => i.status === 'nao_aplicavel').length;
  const pendentesCount = todosItens.filter(i => !i.status || i.status === 'pendente').length;
  const percentualConclusao = totalItensCount > 0 ? Math.round((respondidosCount / totalItensCount) * 100) : 0;

  // Itens Não Conformes sem observação (bloqueiam a conclusão)
  const ncsSemObservacao = useMemo(() => {
    return todosItens.filter(i => i.status === 'nao_conforme' && (!i.observacao || i.observacao.trim() === ''));
  }, [todosItens]);

  const podeConcluirVistoria = totalItensCount > 0 && pendentesCount === 0 && ncsSemObservacao.length === 0;

  // B6: Persistência Offline Automática em LocalStorage
  useEffect(() => {
    if (itens.length > 0) {
      const chaveDraft = `vl_checklist_draft_${checklistParaEditar?.id || 'temp'}`;
      try {
        localStorage.setItem(chaveDraft, JSON.stringify({
          clienteId,
          ativoId,
          vinculadoAOrcamentoId,
          tipoServicoSelecionado,
          itens,
          itensExtras,
          dataPreenchimento,
          atualizadoEm: new Date().toISOString()
        }));
      } catch (e) {
        console.warn('Falha ao persistir draft offline:', e);
      }
    }
  }, [clienteId, ativoId, vinculadoAOrcamentoId, tipoServicoSelecionado, itens, itensExtras, dataPreenchimento, checklistParaEditar]);

  // Função interna para salvar
  const executarSalvarVistoria = (statusDesejado: 'rascunho' | 'finalizado'): string | null => {
    setErroValidacao(null);

    if (!clienteId) {
      setErroValidacao('Selecione o Cliente (obrigatório).');
      return null;
    }
    if (!ativoId) {
      setErroValidacao('Selecione o Ativo / Equipamento inspecionado (obrigatório).');
      return null;
    }

    if (statusDesejado === 'finalizado') {
      if (pendentesCount > 0) {
        setErroValidacao(`A vistoria possui ${pendentesCount} item(ns) pendente(s) de inspeção. Marque Conforme, Não Conforme ou N.A. em todos os itens.`);
        return null;
      }
      if (ncsSemObservacao.length > 0) {
        setErroValidacao(`Existem ${ncsSemObservacao.length} item(ns) Não Conforme(s) sem observação técnica. A justificativa in loco é obrigatória.`);
        return null;
      }
    }

    const payload = {
      clienteId,
      clienteNome: clienteSelecionado?.razaoSocial || clienteSelecionado?.nomeFantasia || 'Cliente',
      clienteCnpj: clienteSelecionado?.cnpj || clienteSelecionado?.cpfCnpj || '',
      ativoId,
      ativoIdentificacao: ativoSelecionado ? `${ativoSelecionado.identificacao} (${ativoSelecionado.tipo})` : 'Ativo',
      categoriaLaudo: tipoServicoSelecionado.toUpperCase(),
      tipoLaudoId,
      tipoLaudoNome: MODELOS_CHECKLIST_SERVICO.find(m => m.id === tipoServicoSelecionado)?.nome || 'Checklist de Vistoria',
      itens,
      itensExtras,
      perigosApreciacaoRisco: tipoServicoSelecionado === 'nr12' ? perigosNR12 : undefined,
      rubricaUrl,
      rubricaTimestamp: rubricaUrl ? (checklistParaEditar?.rubricaTimestamp || new Date().toISOString()) : undefined,
      responsavelUid: currentUser?.uid || 'usr-master',
      responsavelNome,
      responsavelCrea,
      dataPreenchimento,
      geolocalizacao,
      disponibilizadoParaCliente,
      status: statusDesejado,
      vinculadoALaudoId: checklistParaEditar?.vinculadoALaudoId || null,
      vinculadoAOrcamentoId: vinculadoAOrcamentoId || null,
    };

    let chkIdSalvo = '';
    if (checklistParaEditar) {
      atualizarChecklistCampo(checklistParaEditar.id, payload);
      chkIdSalvo = checklistParaEditar.id;
    } else {
      chkIdSalvo = adicionarChecklistCampo(payload);
    }

    return chkIdSalvo;
  };

  const handleSalvar = (statusDesejado: 'rascunho' | 'finalizado') => {
    const chkId = executarSalvarVistoria(statusDesejado);
    if (chkId) {
      onSaved(chkId);
    }
  };

  // B7: "Gerar laudo a partir desta vistoria" (Criação de Laudo Rascunho com dados integrados)
  const handleGerarLaudoAPartirDestaVistoria = () => {
    const chkId = executarSalvarVistoria('finalizado');
    if (!chkId) return;

    // Calcular parecer prévio
    const ncs = todosItens.filter(i => i.status === 'nao_conforme');
    let parecerSugerido: 'liberado' | 'liberado_restricoes' | 'nao_liberado' = 'liberado';
    if (ncs.length > 0) {
      const temCriticaOuAlta = ncs.some(i => i.criticidade === 'critica' || i.criticidade === 'alta');
      parecerSugerido = temCriticaOuAlta ? 'nao_liberado' : 'liberado_restricoes';
    }

    // Gerar seções integradas do laudo a partir do checklist
    const modeloServico = MODELOS_CHECKLIST_SERVICO.find(m => m.id === tipoServicoSelecionado);
    const secoesLaudo: LaudoSecao[] = [
      {
        id: `sec-apresentacao-${Date.now()}`,
        titulo: '1. Apresentação & Objetivo da Perícia',
        ordem: 1,
        isObrigatoria: true,
        conteudoHtml: `<p>O presente <strong>Laudo Técnico Pericial de Engenharia Mecânica</strong> tem por objetivo atestar as condições de operacionalidade, integridade estrutural e conformidade legal do ativo <strong>${ativoSelecionado?.identificacao || 'Equipamento'}</strong> (${ativoSelecionado?.tipo || 'Industrial'}), operado pela empresa contratante <strong>${clienteSelecionado?.razaoSocial || 'Cliente'}</strong>.</p><p>A avaliação pericial foi executada com fundamento na norma <strong>${modeloServico?.norma || 'Normas Regulamentadoras'}</strong> e diretrizes do Sistema CONFEA/CREA.</p>`,
      },
      {
        id: `sec-cadastro-${Date.now()}`,
        titulo: '2. Dados Cadastrais do Ativo & Metodologia',
        ordem: 2,
        isObrigatoria: true,
        conteudoHtml: `<p>A vistoria técnica <em>in loco</em> foi realizada em <strong>${new Date(dataPreenchimento).toLocaleDateString('pt-BR')}</strong> nas dependências da contratante.</p><table class="tiptap-table border-collapse border border-slate-300 w-full my-3"><tbody><tr><td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-800">Equipamento / TAG:</td><td class="border border-slate-300 p-2 text-xs font-mono font-bold">${ativoSelecionado?.identificacao || 'N/D'}</td><td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-800">Fabricante:</td><td class="border border-slate-300 p-2 text-xs">${ativoSelecionado?.fabricante || 'N/D'}</td></tr><tr><td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-800">Modelo / Série:</td><td class="border border-slate-300 p-2 text-xs">${ativoSelecionado?.modelo || '—'} / ${ativoSelecionado?.numeroSerie || '—'}</td><td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-800">Capacidade Nominal:</td><td class="border border-slate-300 p-2 text-xs">${ativoSelecionado?.capacidade || 'N/D'}</td></tr></tbody></table>`,
      },
      {
        id: `sec-checklist-${Date.now()}`,
        titulo: '3. Auditoria Técnica e Matriz de Conformidade',
        ordem: 3,
        isObrigatoria: true,
        itens: todosItens.map(it => ({
          id: it.id,
          requisito: it.descricao,
          normaRef: it.criterioReferencia,
          status: it.status as any,
          gravidade: it.criticidade as any,
          observacao: it.observacao,
          fotos: it.fotos
        })),
        conteudoHtml: `<p>Resultados da verificação técnica estruturada por requisitos:</p><ul><li>Total de itens auditados: <strong>${totalItensCount}</strong></li><li>Itens Conformes: <strong>${conformesCount}</strong></li><li>Não Conformidades detectadas: <strong>${naoConformesCount}</strong></li><li>Não Aplicáveis: <strong>${naCount}</strong></li></ul>`,
      },
      {
        id: `sec-nc-${Date.now()}`,
        titulo: '4. Apontamento de Não Conformidades e Recomendações',
        ordem: 4,
        isObrigatoria: false,
        conteudoHtml: ncs.length > 0 
          ? `<p>Foram identificadas as seguintes inconformidades durante a inspeção física:</p><ol>${ncs.map((nc, idx) => `<li><strong>[NC-0${idx + 1} - Risco ${nc.criticidade?.toUpperCase() || 'MÉDIO'}]:</strong> ${nc.descricao}.<br/><em>Constatação in loco:</em> ${nc.observacao || 'Constatada avaria física.'}<br/><strong>Ação Recomendada:</strong> ${nc.acaoRecomendada || 'Corrigir e adequar à norma vigente.'}</li>`).join('')}</ol>`
          : `<p><strong>✓ Nenhuma não conformidade impeditiva foi detectada</strong> durante a vistoria pericial. Todos os itens inspecionados encontram-se em conformidade com as diretrizes normativas vigentes.</p>`,
      },
      {
        id: `sec-conclusao-${Date.now()}`,
        titulo: '5. Parecer Pericial Conclusivo & Validade',
        ordem: 5,
        isObrigatoria: true,
        conteudoHtml: `<p>Diante dos exames visuais, instrumentados e verificações de campo realizadas pelo Engenheiro Mecânico Responsável Técnico, emite-se o seguinte <strong>PARECER CONCLUSIVO</strong>:</p><p style="font-size: 15px; font-weight: bold; color: ${parecerSugerido === 'liberado' ? '#16A34A' : parecerSugerido === 'liberado_restricoes' ? '#D97706' : '#DC2626'}; text-transform: uppercase;">▶ ${parecerSugerido === 'liberado' ? 'EQUIPAMENTO LIBERADO / APTO PARA OPERAÇÃO' : parecerSugerido === 'liberado_restricoes' ? 'LIBERADO COM RESTRIÇÕES (CUMPRIR PLANO DE AÇÃO)' : 'INTERDITADO / NÃO LIBERADO ATÉ CORREÇÃO'}</p><p>O presente laudo técnico pericial tem validade jurídica vinculada à respectiva Anotação de Responsabilidade Técnica (ART) junto ao CREA-PE.</p>`,
      }
    ];

    const novoLaudoId = criarNovoLaudo({
      tipo: modeloServico?.nome || 'Laudo Técnico Pericial de Engenharia Mecânica',
      clienteId,
      clienteNome: clienteSelecionado?.razaoSocial || 'Cliente Contratante',
      clienteCnpj: clienteSelecionado?.cpfCnpj || clienteSelecionado?.cnpj || '',
      ativoId,
      ativoIdentificacao: ativoSelecionado ? `${ativoSelecionado.identificacao} (${ativoSelecionado.tipo})` : 'Ativo',
      orcamentoOrigemId: vinculadoAOrcamentoId || undefined,
      orcamentoNumero: orcamentoVinculado?.codigoProposta || undefined,
      checklistCampoOrigemId: chkId,
      dataInspecao: dataPreenchimento.slice(0, 10),
      normasReferencia: modeloServico?.norma || 'Normas Regulamentadoras MTE / ABNT NBR',
      resumoExecutivo: `Vistoria técnica pericial em ${ativoSelecionado?.identificacao || 'ativo'} realizada em ${new Date(dataPreenchimento).toLocaleDateString('pt-BR')}. Parecer: ${parecerSugerido.toUpperCase()}.`,
      secoes: secoesLaudo,
      status: 'rascunho',
      artNumero: '',
    });

    onSaved(chkId);
    navigate(`/admin/laudos/${novoLaudoId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[96vh] flex flex-col overflow-hidden my-auto border border-slate-300">
        
        {/* Topo do Modal com Progresso em Tempo Real */}
        <div className="px-6 py-4 border-b border-slate-200 bg-[#0B1E3D] text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0 font-bold">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                    {checklistParaEditar ? `Vistoria ${checklistParaEditar.numero}` : 'Checklist de Campo (Vistoria Técnica)'}
                  </h2>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/40">
                    Touch & Mobile Otimizado
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Inspeção estruturada in loco conectada ao Orçamento e geradora do Laudo Técnico.
                </p>
              </div>
            </div>

            {/* B5: Contador e Progresso em Tempo Real */}
            <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
              <div className="text-right">
                <span className="block text-xs font-black text-[#D4AF37] font-mono">
                  {respondidosCount} de {totalItensCount} VERIFICADOS ({percentualConclusao}%)
                </span>
                <span className="text-[10px] text-slate-300">
                  {pendentesCount > 0 ? `⚠ ${pendentesCount} pendente(s)` : '✓ Todos inspecionados'}
                </span>
              </div>
              <div className="w-20 sm:w-28 h-2.5 bg-slate-700 rounded-full overflow-hidden shrink-0 border border-slate-600">
                <div 
                  className={`h-full transition-all duration-300 ${percentualConclusao === 100 ? 'bg-emerald-400' : 'bg-blue-400'}`}
                  style={{ width: `${percentualConclusao}%` }}
                />
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title="Fechar formulário"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mensagem de Erro de Validação se houver */}
        {erroValidacao && (
          <div className="px-6 py-3 bg-rose-50 border-b border-rose-300 flex items-center gap-2 text-xs font-bold text-rose-900 animate-pulse">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{erroValidacao}</span>
          </div>
        )}

        {/* Corpo do Formulário com Scroll */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-slate-50/60">
          
          {/* PASSO 1: B3 CABEÇALHO DA VISTORIA (ORÇAMENTO, EQUIPAMENTO, DATA & GPS) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-black text-[#0B1E3D] uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#1565D8]" />
                <span>1. Cadeia de Rastreabilidade (Orçamento Aprovado & Equipamento)</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-400 font-mono">DADOS DE ENTRADA</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              
              {/* B3: Dropdown de Orçamento Aprovado Vinculado */}
              <div className="md:col-span-3 bg-blue-50/60 p-3.5 rounded-xl border border-blue-200 space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="text-xs font-black text-[#0B1E3D] uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Orçamento Aprovado Vinculado (Fonte Única da Demanda)</span>
                  </label>
                  <span className="text-[10px] font-bold text-blue-800 bg-white px-2 py-0.5 rounded border border-blue-300">
                    Integração Automática
                  </span>
                </div>
                <select
                  value={vinculadoAOrcamentoId}
                  onChange={(e) => handleSelecionarOrcamento(e.target.value)}
                  className="w-full text-xs font-bold bg-white border border-blue-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="">-- Selecione o Orçamento Aprovado --</option>
                  {orcamentos.map(orc => (
                    <option key={orc.id} value={orc.id}>
                      {orc.codigoProposta || orc.id} • {orc.clienteNome || 'Cliente'} — {orc.servico} ({orc.valorFormatado || `R$ ${orc.valor}`})
                    </option>
                  ))}
                </select>
                {orcamentoVinculado && (
                  <p className="text-[11px] text-blue-900 font-medium">
                    ✓ Escopo carregado: <strong>{orcamentoVinculado.servico}</strong> • Prazo: <strong>{orcamentoVinculado.prazoEntrega || `${orcamentoVinculado.prazoDias || 7} dias`}</strong>
                  </p>
                )}
              </div>

              {/* Cliente */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cliente Contratante <span className="text-rose-500">*</span>
                </label>
                <select
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Selecione o Cliente --</option>
                  {clientes.map(cli => (
                    <option key={cli.id} value={cli.id}>
                      {cli.razaoSocial} ({cli.endereco?.cidade || 'PE'})
                    </option>
                  ))}
                </select>

                {clienteSelecionado && (
                  <div className="mt-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200 text-[10.5px] text-slate-600 space-y-0.5">
                    <p><strong>CNPJ:</strong> {clienteSelecionado.cnpj || clienteSelecionado.cpfCnpj || 'Consulte o contrato'}</p>
                    <p><strong>Contato:</strong> {clienteSelecionado.contatos?.[0]?.nome || 'Diretoria Técnica'}</p>
                  </div>
                )}
              </div>

              {/* B3: Dropdown de Equipamento */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Equipamento / TAG Inspecionado <span className="text-rose-500">*</span>
                </label>
                <select
                  value={ativoId}
                  onChange={(e) => setAtivoId(e.target.value)}
                  disabled={!clienteId}
                  className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value="">-- Selecione o Equipamento --</option>
                  {ativosDoCliente.map(atv => (
                    <option key={atv.id} value={atv.id}>
                      {atv.identificacao} • {atv.tipo} ({atv.fabricante || 'Fabricante'})
                    </option>
                  ))}
                </select>

                {ativoSelecionado && (
                  <div className="mt-1.5 p-2 bg-emerald-50/70 rounded-lg border border-emerald-200 text-[10.5px] text-slate-700 space-y-0.5">
                    <p><strong>TAG:</strong> {ativoSelecionado.identificacao} • <strong>Fabr:</strong> {ativoSelecionado.fabricante || 'N/D'}</p>
                    <p><strong>Série:</strong> {ativoSelecionado.numeroSerie || ativoSelecionado.chassi || '—'} • <strong>Capacidade:</strong> {ativoSelecionado.capacidade || 'N/D'}</p>
                  </div>
                )}
              </div>

              {/* Data e Hora de Início da Vistoria */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Data e Hora de Início:</span>
                </label>
                <input
                  type="datetime-local"
                  value={dataPreenchimento ? dataPreenchimento.slice(0, 16) : ''}
                  onChange={(e) => setDataPreenchimento(new Date(e.target.value).toISOString())}
                  className="w-full text-xs font-bold bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="mt-1.5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleCapturarGps}
                    disabled={capturandoGps}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md border border-blue-200 transition-colors cursor-pointer"
                  >
                    <Navigation className={`w-3.5 h-3.5 ${capturandoGps ? 'animate-spin' : ''}`} />
                    <span>{geolocalizacao ? '✓ GPS Capturado' : capturandoGps ? 'Obtendo GPS...' : 'Capturar GPS'}</span>
                  </button>
                  {geolocalizacao && (
                    <span className="text-[10px] font-mono text-emerald-700 font-bold">
                      ±{geolocalizacao.precisao}m
                    </span>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* PASSO 2: B4 MODELOS DE CHECKLIST POR TIPO DE SERVIÇO */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="text-xs font-black text-[#0B1E3D] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#1565D8]" />
                  <span>2. Modelo de Checklist por Tipo de Serviço</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Selecione o checklist normativo apropriado para carregar os critérios de inspeção.
                </p>
              </div>

              {/* Seletor Rápido de Serviços */}
              <div className="flex flex-wrap items-center gap-1.5">
                {MODELOS_CHECKLIST_SERVICO.map(mod => (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => handleTrocarModeloServico(mod.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      tipoServicoSelecionado === mod.id
                        ? 'bg-[#0B1E3D] text-[#D4AF37] border-[#0B1E3D] shadow-2xs font-black scale-102'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    {mod.id.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Banner com o modelo ativo */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <strong className="text-xs font-bold text-slate-900">
                  {MODELOS_CHECKLIST_SERVICO.find(m => m.id === tipoServicoSelecionado)?.nome}
                </strong>
                <p className="text-[11px] text-slate-600">
                  Normas: <strong>{MODELOS_CHECKLIST_SERVICO.find(m => m.id === tipoServicoSelecionado)?.norma}</strong>
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {conformesCount} C
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                  {naoConformesCount} NC
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  {naCount} NA
                </span>
              </div>
            </div>

            {/* Lista dos Itens do Checklist com Renderizador Touch-Friendly */}
            <div className="space-y-3.5">
              {itens.map((item, idx) => (
                <ChecklistItemRenderer
                  key={item.id}
                  item={item}
                  index={idx}
                  onStatusChange={(st) => handleItemStatusChange(item.id, st)}
                  onValorChange={(v) => handleItemValorChange(item.id, v)}
                  onObservacaoChange={(obs) => handleItemObsChange(item.id, obs)}
                  onCriticidadeChange={(crit) => handleItemCriticidadeChange(item.id, crit)}
                  onAcaoRecomendadaChange={(acao) => handleItemAcaoRecomendadaChange(item.id, acao)}
                  onMedicaoChange={(med) => handleItemMedicaoChange(item.id, med)}
                  onFotoUpload={(file, legenda) => handleItemFotoUpload(item.id, file, legenda)}
                  onRemoverFoto={(fotoId) => handleRemoverFoto(item.id, fotoId)}
                  onAtualizarLegendaFoto={(fotoId, legenda) => handleAtualizarLegendaFoto(item.id, fotoId, legenda)}
                />
              ))}
            </div>

            {/* Itens Extras adicionados pelo perito em campo */}
            {itensExtras.length > 0 && (
              <div className="pt-4 border-t border-slate-200 space-y-3.5">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Itens Adicionais Levantados em Campo ({itensExtras.length})
                </h4>

                {itensExtras.map((item, idx) => (
                  <ChecklistItemRenderer
                    key={item.id}
                    item={item}
                    index={idx}
                    isExtra={true}
                    onStatusChange={(st) => handleItemStatusChange(item.id, st, true)}
                    onValorChange={(v) => handleItemValorChange(item.id, v, true)}
                    onObservacaoChange={(obs) => handleItemObsChange(item.id, obs, true)}
                    onCriticidadeChange={(crit) => handleItemCriticidadeChange(item.id, crit, true)}
                    onAcaoRecomendadaChange={(acao) => handleItemAcaoRecomendadaChange(item.id, acao, true)}
                    onMedicaoChange={(med) => handleItemMedicaoChange(item.id, med, true)}
                    onFotoUpload={(file, legenda) => handleItemFotoUpload(item.id, file, legenda, true)}
                    onRemoverFoto={(fotoId) => handleRemoverFoto(item.id, fotoId, true)}
                    onAtualizarLegendaFoto={(fotoId, legenda) => handleAtualizarLegendaFoto(item.id, fotoId, legenda, true)}
                    onRemoverItem={() => handleRemoverItemExtra(item.id)}
                  />
                ))}
              </div>
            )}

            {/* B4: Botão para Adicionar Item Avulso durante a vistoria */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Adicionar item técnico avulso observado durante a vistoria..."
                value={novoItemDescricao}
                onChange={(e) => setNovoItemDescricao(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdicionarItemExtra()}
                className="flex-1 text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAdicionarItemExtra}
                className="px-3.5 py-2 bg-[#0B1E3D] hover:bg-[#1565D8] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Item</span>
              </button>
            </div>
          </div>

          {/* PASSO 3: RUBRICA TÉCNICA TOUCH */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-black text-[#0B1E3D] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>3. Responsável Técnico & Rubrica Digital in loco</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block">Responsável Técnico:</label>
                <input
                  type="text"
                  value={responsavelNome}
                  onChange={(e) => setResponsavelNome(e.target.value)}
                  className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block">Registro CREA-PE:</label>
                <input
                  type="text"
                  value={responsavelCrea}
                  onChange={(e) => setResponsavelCrea(e.target.value)}
                  className="w-full text-xs font-mono font-bold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>

            <RubricaSignatureCanvas
              initialSignature={rubricaUrl}
              onSave={(url) => setRubricaUrl(url)}
            />
          </div>

        </div>

        {/* Rodapé do Modal com Ações */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs">
            {podeConcluirVistoria ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-600" /> Vistoria completa e pronta para gerar o laudo!
              </span>
            ) : (
              <span className="text-amber-800 font-semibold flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                {pendentesCount > 0 ? `${pendentesCount} item(ns) pendente(s)` : `${ncsSemObservacao.length} NC(s) sem observação`}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors border border-slate-300 cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={() => handleSalvar('rascunho')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-300 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-slate-600" />
              <span>Salvar Rascunho</span>
            </button>

            {/* B7: BOTÃO "GERAR LAUDO A PARTIR DESTA VISTORIA" */}
            <button
              type="button"
              onClick={handleGerarLaudoAPartirDestaVistoria}
              disabled={!podeConcluirVistoria}
              className={`inline-flex items-center gap-1.5 px-5 py-2 text-xs font-black rounded-xl transition-all shadow-xs cursor-pointer ${
                podeConcluirVistoria
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                  : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
              }`}
              title={podeConcluirVistoria ? 'Conclui a vistoria e gera o laudo técnico preenchido sem duplicidade' : 'Inspecione todos os itens e preencha as observações das NCs para gerar o laudo'}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Gerar Laudo a partir desta Vistoria</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
