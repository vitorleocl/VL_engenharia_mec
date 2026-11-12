import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Save,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Plus,
  Building2,
  FileText,
  Check,
  Navigation,
  Layers,
  Clock,
  ShieldCheck,
  ArrowRight,
  Wifi,
  WifiOff,
  HardDrive,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  ChecklistCampo,
  ChecklistCampoItem,
  ChecklistCampoItemStatus,
  ChecklistCriticidade,
  EvidenciaFoto,
  ChecklistModeloServico,
} from '../../types';
import { RubricaSignatureCanvas } from './RubricaSignatureCanvas';
import { ChecklistItemRenderer } from './ChecklistItemRenderer';
import { CHECKLIST_MODELOS_PADRAO } from '../../lib/checklistModelosPadrao';
import {
  saveDraftOffline,
  getDraftOffline,
  removeDraftOffline,
} from '../../lib/offlineChecklistStore';

export const MODELOS_CHECKLIST_SERVICO = CHECKLIST_MODELOS_PADRAO;

interface ChecklistCampoFormModalProps {
  checklistParaEditar?: ChecklistCampo | null;
  onClose: () => void;
  onSaved: (id: string) => void;
}

function inferirModeloIdPorChecklist(
  chk: ChecklistCampo | null | undefined,
  modelos: ChecklistModeloServico[]
): string {
  if (!chk) return modelos[0]?.id || 'nr11';
  if (chk.modeloId && modelos.some((m) => m.id === chk.modeloId)) return chk.modeloId;
  const ref = `${chk.tipoLaudoId || ''} ${chk.tipoLaudoNome || ''} ${chk.categoriaLaudo || ''}`.toLowerCase();
  if (ref.includes('nr12') || ref.includes('nr-12') || ref.includes('máquina') || ref.includes('prensa')) return 'nr12';
  if (ref.includes('nr13') || ref.includes('nr-13') || ref.includes('vaso') || ref.includes('caldeira')) return 'nr13';
  if (ref.includes('pmoc') || ref.includes('clima') || ref.includes('refrig')) return 'pmoc';
  if (ref.includes('fft') || ref.includes('vibra')) return 'fft';
  if (ref.includes('nr11') || ref.includes('nr-11') || ref.includes('munck') || ref.includes('guindaste')) return 'nr11';
  return modelos[0]?.id || 'nr11';
}

function construirItensDeModelo(modelo: ChecklistModeloServico | undefined): ChecklistCampoItem[] {
  if (!modelo) return [];
  return modelo.itens.map((it, idx) => ({
    id: `it-${it.id || idx + 1}`,
    numero: it.numero || `${idx + 1}`,
    descricao: it.texto,
    criterioReferencia: it.norma,
    secaoLaudo: it.secaoLaudo,
    status: 'pendente' as ChecklistCampoItemStatus,
    observacao: '',
    tipoResposta: it.tipoResposta || 'conformidade',
    unidade: it.unidade,
  }));
}

export const ChecklistCampoFormModal: React.FC<ChecklistCampoFormModalProps> = ({
  checklistParaEditar,
  onClose,
  onSaved,
}) => {
  const navigate = useNavigate();
  const {
    clientes,
    ativos,
    orcamentos,
    laudos,
    checklistModelos,
    adicionarChecklistCampo,
    atualizarChecklistCampo,
    gerarOuAtualizarLaudoDeChecklist,
    pendingSyncCount,
    atualizarContagemSync,
  } = useData();
  const { currentUser, isOnline } = useAuth();

  const modelosAtivos = checklistModelos.length > 0 ? checklistModelos : CHECKLIST_MODELOS_PADRAO;
  const draftKeyRef = useRef<string>(checklistParaEditar?.id || `draft-new-${Date.now()}`);

  const [vinculadoAOrcamentoId, setVinculadoAOrcamentoId] = useState<string>(
    checklistParaEditar?.vinculadoAOrcamentoId || ''
  );
  const [clienteId, setClienteId] = useState<string>(checklistParaEditar?.clienteId || '');
  const [ativoId, setAtivoId] = useState<string>(checklistParaEditar?.ativoId || '');
  const [tipoServicoSelecionado, setTipoServicoSelecionado] = useState<string>(() =>
    inferirModeloIdPorChecklist(checklistParaEditar, modelosAtivos)
  );
  const [tipoLaudoId, setTipoLaudoId] = useState<string>(
    checklistParaEditar?.tipoLaudoId || `laudo-${inferirModeloIdPorChecklist(checklistParaEditar, modelosAtivos)}`
  );

  const [itens, setItens] = useState<ChecklistCampoItem[]>(() => {
    if (checklistParaEditar?.itens && checklistParaEditar.itens.length > 0) {
      return checklistParaEditar.itens;
    }
    const modeloInicial = modelosAtivos[0];
    return construirItensDeModelo(modeloInicial);
  });

  const [itensExtras, setItensExtras] = useState<ChecklistCampoItem[]>(
    checklistParaEditar?.itensExtras || []
  );
  const [rubricaUrl, setRubricaUrl] = useState<string | undefined>(checklistParaEditar?.rubricaUrl);
  const [responsavelNome, setResponsavelNome] = useState<string>(
    checklistParaEditar?.responsavelNome || currentUser?.nome || 'Eng. Vitor Leonardo Cordeiro Linhares'
  );
  const [responsavelCrea, setResponsavelCrea] = useState<string>(
    checklistParaEditar?.responsavelCrea || (currentUser as any)?.crea || 'CREA-PE 182229949-0'
  );
  const [dataPreenchimento, setDataPreenchimento] = useState<string>(
    checklistParaEditar?.dataPreenchimento || new Date().toISOString()
  );
  const [geolocalizacao, setGeolocalizacao] = useState<{
    lat: number;
    lng: number;
    precisao?: number;
    enderecoAproximado?: string;
  } | null>(checklistParaEditar?.geolocalizacao || null);

  const [capturandoGps, setCapturandoGps] = useState(false);
  const [novoItemDescricao, setNovoItemDescricao] = useState('');
  const [erroValidacao, setErroValidacao] = useState<string | null>(null);
  const [statusSalvoLocal, setStatusSalvoLocal] = useState<string>('IndexedDB ativo');
  const [draftRestaurado, setDraftRestaurado] = useState(false);
  const hidratadoDraftRef = useRef(false);

  // Restaurar rascunho offline mais recente do IndexedDB caso exista
  useEffect(() => {
    let ativoBool = true;
    const key = checklistParaEditar?.id;
    if (!key) {
      hidratadoDraftRef.current = true;
      return;
    }
    getDraftOffline(key).then((draft) => {
      if (!ativoBool || !draft || !draft.dirty) {
        hidratadoDraftRef.current = true;
        return;
      }
      const remoteTime = new Date(checklistParaEditar.atualizadoEm || checklistParaEditar.criadoEm || 0).getTime();
      const draftTime = new Date(draft.localUpdatedAt).getTime();
      if (draftTime > remoteTime && draft.payload) {
        setVinculadoAOrcamentoId(draft.payload.vinculadoAOrcamentoId || '');
        setClienteId(draft.payload.clienteId || '');
        setAtivoId(draft.payload.ativoId || '');
        if (draft.payload.modeloId) setTipoServicoSelecionado(draft.payload.modeloId);
        if (draft.payload.tipoLaudoId) setTipoLaudoId(draft.payload.tipoLaudoId);
        if (draft.payload.itens?.length) setItens(draft.payload.itens);
        if (draft.payload.itensExtras) setItensExtras(draft.payload.itensExtras);
        if (draft.payload.rubricaUrl) setRubricaUrl(draft.payload.rubricaUrl);
        if (draft.payload.geolocalizacao !== undefined) setGeolocalizacao(draft.payload.geolocalizacao);
        setDraftRestaurado(true);
      }
      hidratadoDraftRef.current = true;
    });
    return () => {
      ativoBool = false;
    };
  }, [checklistParaEditar]);

  // Ordenar orçamentos priorizando os Aprovados e Faturados (B3)
  const orcamentosOrdenados = useMemo(() => {
    return [...orcamentos].sort((a, b) => {
      const aAprov = a.status === 'aprovado' || a.status === 'faturado' ? 0 : 1;
      const bAprov = b.status === 'aprovado' || b.status === 'faturado' ? 0 : 1;
      if (aAprov !== bAprov) return aAprov - bAprov;
      return new Date(b.criadoEm || 0).getTime() - new Date(a.criadoEm || 0).getTime();
    });
  }, [orcamentos]);

  const orcamentoVinculado = useMemo(
    () => orcamentos.find((o) => o.id === vinculadoAOrcamentoId),
    [orcamentos, vinculadoAOrcamentoId]
  );

  const clienteSelecionado = useMemo(
    () => clientes.find((c) => c.id === clienteId),
    [clientes, clienteId]
  );

  const ativosDoCliente = useMemo(
    () => ativos.filter((a) => a.clienteId === clienteId),
    [ativos, clienteId]
  );

  const ativoSelecionado = useMemo(
    () => ativos.find((a) => a.id === ativoId),
    [ativos, ativoId]
  );

  const laudoJaVinculado = useMemo(() => {
    if (!checklistParaEditar) return undefined;
    return laudos.find(
      (l) => l.id === checklistParaEditar.vinculadoALaudoId || l.checklistCampoOrigemId === checklistParaEditar.id
    );
  }, [laudos, checklistParaEditar]);

  const modeloAtivo = useMemo(
    () => modelosAtivos.find((m) => m.id === tipoServicoSelecionado) || modelosAtivos[0],
    [modelosAtivos, tipoServicoSelecionado]
  );

  // Trocar modelo de serviço
  const handleTrocarModeloServico = (modeloId: string) => {
    setTipoServicoSelecionado(modeloId);
    const mod = modelosAtivos.find((m) => m.id === modeloId);
    if (!mod) return;
    setTipoLaudoId(`laudo-${modeloId}`);
    setItens(construirItensDeModelo(mod));
  };

  // B3: Seleção de orçamento aprovado preenche cliente, equipamento e modelo
  const handleSelecionarOrcamento = (orcId: string) => {
    setVinculadoAOrcamentoId(orcId);
    if (!orcId) return;

    const orc = orcamentos.find((o) => o.id === orcId);
    if (!orc) return;

    if (orc.clienteId) {
      setClienteId(orc.clienteId);
      const ativosCli = ativos.filter((a) => a.clienteId === orc.clienteId);
      if (orc.ativoId) {
        setAtivoId(orc.ativoId);
      } else if (ativosCli.length === 1) {
        setAtivoId(ativosCli[0].id);
      } else {
        setAtivoId('');
      }
    }

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
  };

  // Handlers dos itens
  const handleItemStatusChange = (id: string, status: ChecklistCampoItemStatus, isExtra = false) => {
    const updater = (list: ChecklistCampoItem[]) => list.map((it) => (it.id === id ? { ...it, status } : it));
    if (isExtra) setItensExtras(updater);
    else setItens(updater);
  };

  const handleItemValorChange = (id: string, valor: string | number | null, isExtra = false) => {
    const valorResposta = valor !== null && valor !== undefined ? String(valor) : '';
    const updater = (list: ChecklistCampoItem[]) =>
      list.map((it) => (it.id === id ? { ...it, valor, valorResposta } : it));
    if (isExtra) setItensExtras(updater);
    else setItens(updater);
  };

  const handleItemObsChange = (id: string, observacao: string, isExtra = false) => {
    const updater = (list: ChecklistCampoItem[]) =>
      list.map((it) => (it.id === id ? { ...it, observacao } : it));
    if (isExtra) setItensExtras(updater);
    else setItens(updater);
  };

  const handleItemCriticidadeChange = (
    id: string,
    criticidade: ChecklistCriticidade,
    isExtra = false
  ) => {
    const updater = (list: ChecklistCampoItem[]) =>
      list.map((it) =>
        it.id === id
          ? {
              ...it,
              criticidade,
              naoConformidade: { ...(it.naoConformidade || {}), criticidade },
            }
          : it
      );
    if (isExtra) setItensExtras(updater);
    else setItens(updater);
  };

  const handleItemAcaoRecomendadaChange = (id: string, acao: string, isExtra = false) => {
    const updater = (list: ChecklistCampoItem[]) =>
      list.map((it) =>
        it.id === id
          ? {
              ...it,
              acaoRecomendada: acao,
              naoConformidade: { ...(it.naoConformidade || {}), recomendacao: acao },
            }
          : it
      );
    if (isExtra) setItensExtras(updater);
    else setItens(updater);
  };

  const handleItemMedicaoChange = (
    id: string,
    medicao: { valor?: string | number; unidade?: string; referencia?: string },
    isExtra = false
  ) => {
    const updater = (list: ChecklistCampoItem[]) =>
      list.map((it) =>
        it.id === id
          ? {
              ...it,
              medicao: {
                ...(it.medicao || {}),
                valorEncontrado: medicao.valor,
                unidade: medicao.unidade,
                tolerancia: medicao.referencia,
              },
            }
          : it
      );
    if (isExtra) setItensExtras(updater);
    else setItens(updater);
  };

  const handleItemFotoUpload = (
    id: string,
    fileOrBase64: File | string,
    legenda?: string,
    isExtra = false
  ) => {
    const processarUrl = (url: string, nomeArquivo: string) => {
      const novaFoto: EvidenciaFoto = {
        id: `foto-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        url,
        legenda: legenda || 'Evidência fotográfica',
        titulo: legenda || 'Evidência fotográfica',
        timestamp: new Date().toISOString(),
      };

      const updater = (list: ChecklistCampoItem[]) =>
        list.map((it) => {
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

  const handleRemoverFoto = (
    itemId: string,
    fotoIdOuIndex?: string | number,
    isExtra = false
  ) => {
    const updater = (list: ChecklistCampoItem[]) =>
      list.map((it) => {
        if (it.id !== itemId) return it;
        const novasFotos = (it.fotos || []).filter(
          (f, idx) => f.id !== fotoIdOuIndex && idx !== fotoIdOuIndex
        );
        return {
          ...it,
          fotos: novasFotos,
          fotosUrls: novasFotos.map((f) => f.url),
          fotoUrl: novasFotos[0]?.url || undefined,
          fotoNome: novasFotos.length > 0 ? it.fotoNome || 'foto.jpg' : undefined,
        };
      });

    if (isExtra) setItensExtras(updater);
    else setItens(updater);
  };

  const handleAtualizarLegendaFoto = (
    itemId: string,
    fotoIdOuIndex: string | number,
    novaLegenda: string,
    isExtra = false
  ) => {
    const updater = (list: ChecklistCampoItem[]) =>
      list.map((it) => {
        if (it.id !== itemId) return it;
        const novasFotos = (it.fotos || []).map((f, idx) =>
          f.id === fotoIdOuIndex || idx === fotoIdOuIndex
            ? { ...f, legenda: novaLegenda, titulo: novaLegenda }
            : f
        );
        return { ...it, fotos: novasFotos };
      });

    if (isExtra) setItensExtras(updater);
    else setItens(updater);
  };

  const handleAdicionarItemExtra = () => {
    if (!novoItemDescricao.trim()) return;
    const novo: ChecklistCampoItem = {
      id: `chk-extra-${Date.now()}`,
      numero: `E${itensExtras.length + 1}`,
      descricao: novoItemDescricao.trim(),
      secaoLaudo: 'Observações Complementares de Campo',
      status: 'pendente',
      observacao: '',
    };
    setItensExtras((prev) => [...prev, novo]);
    setNovoItemDescricao('');
  };

  const handleRemoverItemExtra = (id: string) => {
    setItensExtras((prev) => prev.filter((it) => it.id !== id));
  };

  const handleCapturarGps = () => {
    if (!navigator.geolocation) {
      setErroValidacao('Geolocalização não suportada neste dispositivo.');
      return;
    }
    setCapturandoGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeolocalizacao({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          precisao: Math.round(pos.coords.accuracy),
          enderecoAproximado: `GPS: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)} (±${Math.round(pos.coords.accuracy)}m)`,
        });
        setCapturandoGps(false);
      },
      () => {
        setCapturandoGps(false);
        setErroValidacao('Não foi possível obter a localização GPS. Verifique as permissões.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // B5: Progresso & Bloqueios
  const todosItens = useMemo(() => [...itens, ...itensExtras], [itens, itensExtras]);
  const totalItensCount = todosItens.length;
  const respondidosCount = todosItens.filter((i) => i.status && i.status !== 'pendente').length;
  const conformesCount = todosItens.filter((i) => i.status === 'conforme').length;
  const naoConformesCount = todosItens.filter((i) => i.status === 'nao_conforme').length;
  const naCount = todosItens.filter((i) => i.status === 'nao_aplicavel').length;
  const pendentesCount = todosItens.filter((i) => !i.status || i.status === 'pendente').length;
  const percentualConclusao =
    totalItensCount > 0 ? Math.round((respondidosCount / totalItensCount) * 100) : 0;

  const ncsSemObservacao = useMemo(
    () =>
      todosItens.filter(
        (i) => i.status === 'nao_conforme' && (!i.observacao || i.observacao.trim() === '')
      ),
    [todosItens]
  );

  const podeConcluirVistoria =
    totalItensCount > 0 && pendentesCount === 0 && ncsSemObservacao.length === 0;

  // B6: Persistência Offline em IndexedDB a cada toque
  useEffect(() => {
    if (!hidratadoDraftRef.current) return;
    if (itens.length === 0) return;

    const agora = new Date().toISOString();
    const draftPayload: ChecklistCampo = {
      id: draftKeyRef.current,
      numero: checklistParaEditar?.numero || 'RASCUNHO',
      clienteId,
      clienteNome: clienteSelecionado?.razaoSocial || clienteSelecionado?.nomeFantasia || '',
      clienteCnpj: clienteSelecionado?.cpfCnpj || clienteSelecionado?.cnpj || '',
      ativoId,
      ativoIdentificacao: ativoSelecionado?.identificacao || '',
      categoriaLaudo: tipoServicoSelecionado.toUpperCase(),
      modeloId: tipoServicoSelecionado,
      tipoLaudoId,
      tipoLaudoNome: modeloAtivo?.nome || 'Checklist de Vistoria',
      itens,
      itensExtras,
      rubricaUrl,
      responsavelUid: currentUser?.uid || 'master-vitor',
      responsavelNome,
      responsavelCrea,
      dataPreenchimento,
      geolocalizacao,
      disponibilizadoParaCliente: checklistParaEditar?.disponibilizadoParaCliente ?? false,
      status: checklistParaEditar?.status || 'rascunho',
      vinculadoALaudoId: checklistParaEditar?.vinculadoALaudoId || null,
      vinculadoAOrcamentoId: vinculadoAOrcamentoId || null,
      criadoEm: checklistParaEditar?.criadoEm || agora,
      atualizadoEm: agora,
    };

    saveDraftOffline({
      id: draftKeyRef.current,
      payload: draftPayload,
      baseUpdatedAt: checklistParaEditar?.atualizadoEm,
      localUpdatedAt: agora,
      dirty: true,
      dirtyFieldsCount: respondidosCount,
    }).then(() => {
      const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setStatusSalvoLocal(`Salvo no aparelho às ${hora}`);
      atualizarContagemSync();
    });
  }, [
    clienteId,
    ativoId,
    vinculadoAOrcamentoId,
    tipoServicoSelecionado,
    tipoLaudoId,
    itens,
    itensExtras,
    rubricaUrl,
    responsavelNome,
    responsavelCrea,
    dataPreenchimento,
    geolocalizacao,
  ]);

  const construirPayloadChecklist = (
    statusDesejado: 'rascunho' | 'finalizado'
  ): Omit<ChecklistCampo, 'id' | 'numero' | 'criadoEm' | 'atualizadoEm'> => ({
    clienteId,
    clienteNome: clienteSelecionado?.razaoSocial || clienteSelecionado?.nomeFantasia || 'Cliente',
    clienteCnpj: clienteSelecionado?.cnpj || clienteSelecionado?.cpfCnpj || '',
    ativoId,
    ativoIdentificacao: ativoSelecionado
      ? `${ativoSelecionado.identificacao} (${ativoSelecionado.tipo})`
      : 'Ativo',
    categoriaLaudo: tipoServicoSelecionado.toUpperCase(),
    modeloId: tipoServicoSelecionado,
    tipoLaudoId,
    tipoLaudoNome: modeloAtivo?.nome || 'Checklist de Vistoria',
    itens,
    itensExtras,
    rubricaUrl,
    rubricaTimestamp: rubricaUrl
      ? checklistParaEditar?.rubricaTimestamp || new Date().toISOString()
      : undefined,
    responsavelUid: currentUser?.uid || 'master-vitor',
    responsavelNome,
    responsavelCrea,
    dataPreenchimento,
    concluidaEm: statusDesejado === 'finalizado' ? new Date().toISOString() : checklistParaEditar?.concluidaEm,
    geolocalizacao,
    disponibilizadoParaCliente: checklistParaEditar?.disponibilizadoParaCliente ?? false,
    status: statusDesejado,
    vinculadoALaudoId: checklistParaEditar?.vinculadoALaudoId || null,
    vinculadoAOrcamentoId: vinculadoAOrcamentoId || null,
  });

  const executarSalvarVistoria = (
    statusDesejado: 'rascunho' | 'finalizado'
  ): { id: string; registro: ChecklistCampo } | null => {
    setErroValidacao(null);

    if (!clienteId) {
      setErroValidacao('Selecione o Cliente contratante (obrigatório).');
      return null;
    }
    if (!ativoId) {
      setErroValidacao('Selecione o Equipamento / TAG inspecionado (obrigatório).');
      return null;
    }

    if (statusDesejado === 'finalizado') {
      if (pendentesCount > 0) {
        setErroValidacao(
          `Ainda há ${pendentesCount} item(ns) sem resposta. Marque Conforme, Não conforme ou N.A. em todos os itens.`
        );
        return null;
      }
      if (ncsSemObservacao.length > 0) {
        setErroValidacao(
          `Existem ${ncsSemObservacao.length} item(ns) Não conforme(s) sem observação. A descrição é obrigatória.`
        );
        return null;
      }
    }

    const payload = construirPayloadChecklist(statusDesejado);
    const agora = new Date().toISOString();
    let chkIdSalvo = '';
    let numeroSalvo = checklistParaEditar?.numero || 'CHK';

    if (checklistParaEditar) {
      atualizarChecklistCampo(checklistParaEditar.id, payload);
      chkIdSalvo = checklistParaEditar.id;
    } else {
      chkIdSalvo = adicionarChecklistCampo(payload);
    }

    removeDraftOffline(draftKeyRef.current).then(() => atualizarContagemSync());

    const registroCompleto: ChecklistCampo = {
      ...payload,
      id: chkIdSalvo,
      numero: numeroSalvo,
      criadoEm: checklistParaEditar?.criadoEm || agora,
      atualizadoEm: agora,
    };

    return { id: chkIdSalvo, registro: registroCompleto };
  };

  const handleSalvar = (statusDesejado: 'rascunho' | 'finalizado') => {
    const res = executarSalvarVistoria(statusDesejado);
    if (res) {
      onSaved(res.id);
    }
  };

  // B7: Gerar ou atualizar Laudo sem duplicar
  const handleGerarLaudoAPartirDestaVistoria = () => {
    const res = executarSalvarVistoria('finalizado');
    if (!res) return;

    const { laudoId } = gerarOuAtualizarLaudoDeChecklist(res.registro);
    onSaved(res.id);
    navigate(`/admin/laudos/${laudoId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-2 sm:p-5 overflow-y-auto">
      <div className="bg-[var(--adm-card)] text-[var(--adm-text)] rounded-2xl shadow-2xl max-w-5xl w-full max-h-[96vh] flex flex-col overflow-hidden my-auto border border-[var(--adm-line)]">
        {/* Topo do Modal */}
        <div className="px-4 sm:px-6 py-4 border-b border-[var(--adm-line)] bg-[var(--adm-top)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--adm-blue,#2160db)] text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-bold tracking-tight text-[var(--adm-text)]">
                    {checklistParaEditar
                      ? `Vistoria ${checklistParaEditar.numero}`
                      : 'Nova Vistoria de Campo'}
                  </h2>

                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      isOnline
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500'
                        : 'border-amber-500/40 bg-amber-500/10 text-amber-500'
                    }`}
                  >
                    {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                    <span>
                      {isOnline
                        ? pendingSyncCount > 0
                          ? `${pendingSyncCount} pendente(s)`
                          : 'Online'
                        : 'Offline (salva no aparelho)'}
                    </span>
                  </span>
                </div>
                <p className="text-[11px] text-[var(--adm-mut)] flex items-center gap-1.5 mt-0.5">
                  <HardDrive className="w-3 h-3 shrink-0" />
                  <span>{statusSalvoLocal}</span>
                  {draftRestaurado && (
                    <span className="text-amber-500 font-semibold">· Rascunho offline restaurado</span>
                  )}
                </p>
              </div>
            </div>

            {/* B5: Progresso "n de N verificados" */}
            <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
              <div className="text-right">
                <span className="block text-xs font-bold text-[var(--adm-text)] font-mono">
                  {respondidosCount} de {totalItensCount} verificados ({percentualConclusao}%)
                </span>
                <span className="text-[11px] text-[var(--adm-mut)]">
                  {pendentesCount > 0 ? `${pendentesCount} pendente(s)` : 'Todos respondidos'}
                </span>
              </div>
              <div className="w-24 sm:w-28 h-2 bg-[var(--adm-bg)] rounded-full overflow-hidden shrink-0 border border-[var(--adm-line)]">
                <div
                  className={`h-full transition-all duration-300 ${
                    percentualConclusao === 100 ? 'bg-emerald-500' : 'bg-[var(--adm-blue,#2160db)]'
                  }`}
                  style={{ width: `${percentualConclusao}%` }}
                />
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-[var(--adm-mut)] hover:text-[var(--adm-text)] rounded-xl hover:bg-[var(--adm-bg)] transition-colors cursor-pointer"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Erro de validação */}
        {erroValidacao && (
          <div className="px-5 py-3 bg-rose-500/15 border-b border-rose-500/40 flex items-center gap-2 text-xs font-bold text-rose-500">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{erroValidacao}</span>
          </div>
        )}

        {/* Corpo com scroll */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[var(--adm-bg)]">
          {/* 1. Vínculos (B3: Orçamento aprovado, Cliente, Equipamento, Data/Hora, GPS) */}
          <div className="bg-[var(--adm-card)] p-4 sm:p-5 rounded-2xl border border-[var(--adm-line)] space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--adm-line)] pb-2.5">
              <h3 className="text-xs font-bold text-[var(--adm-text)] uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[var(--adm-blue-soft,#6ea1ff)]" />
                <span>1. Orçamento, Equipamento & Local</span>
              </h3>
              <span className="text-[10.5px] font-mono text-[var(--adm-mut)]">VÍNCULOS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Orçamento (B3: seleção priorizando aprovados) */}
              <div className="md:col-span-3 p-3.5 rounded-xl bg-[var(--adm-bg)] border border-[var(--adm-line)] space-y-1.5">
                <label className="text-xs font-bold text-[var(--adm-text)] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[var(--adm-blue-soft,#6ea1ff)]" />
                  <span>Orçamento vinculado</span>
                </label>
                <select
                  value={vinculadoAOrcamentoId}
                  onChange={(e) => handleSelecionarOrcamento(e.target.value)}
                  className="w-full text-xs font-semibold bg-[var(--adm-card)] border border-[var(--adm-line)] rounded-xl px-3 py-2.5 text-[var(--adm-text)] focus:outline-none focus:border-[var(--adm-blue-soft)] cursor-pointer"
                >
                  <option value="">-- Selecione o orçamento (prioridade aprovados) --</option>
                  {orcamentosOrdenados.map((orc, idx) => (
                    <option key={orc.id ? `${orc.id}-${idx}` : `orc-${idx}`} value={orc.id}>
                      [{orc.status === 'faturado' ? 'FATURADO' : orc.status === 'aprovado' ? 'APROVADO' : (orc.status || 'RASCUNHO').toUpperCase()}] {orc.codigoProposta || orc.id} · {orc.clienteNome || 'Cliente'} — {orc.servico}
                    </option>
                  ))}
                </select>
                {orcamentoVinculado && (
                  <p className="text-[11px] text-emerald-500 font-medium">
                    Vinculado: <strong>{orcamentoVinculado.codigoProposta || orcamentoVinculado.id}</strong> · {orcamentoVinculado.servico}
                  </p>
                )}
              </div>

              {/* Cliente */}
              <div>
                <label className="block text-xs font-semibold text-[var(--adm-mut)] mb-1">
                  Cliente <span className="text-rose-500">*</span>
                </label>
                <select
                  value={clienteId}
                  onChange={(e) => {
                    setClienteId(e.target.value);
                    setAtivoId('');
                  }}
                  className="w-full text-xs font-semibold bg-[var(--adm-bg)] border border-[var(--adm-line)] rounded-xl px-3 py-2.5 text-[var(--adm-text)] focus:outline-none focus:border-[var(--adm-blue-soft)]"
                >
                  <option value="">-- Selecione o cliente --</option>
                  {clientes.map((cli, idx) => (
                    <option key={cli.id ? `${cli.id}-${idx}` : `cli-${idx}`} value={cli.id}>
                      {cli.razaoSocial}
                    </option>
                  ))}
                </select>
                {clienteSelecionado && (
                  <p className="mt-1.5 text-[11px] text-[var(--adm-mut)]">
                    CNPJ: {clienteSelecionado.cpfCnpj || clienteSelecionado.cnpj || '—'}
                  </p>
                )}
              </div>

              {/* Equipamento / TAG */}
              <div>
                <label className="block text-xs font-semibold text-[var(--adm-mut)] mb-1">
                  Equipamento / TAG <span className="text-rose-500">*</span>
                </label>
                <select
                  value={ativoId}
                  onChange={(e) => setAtivoId(e.target.value)}
                  disabled={!clienteId}
                  className="w-full text-xs font-semibold bg-[var(--adm-bg)] border border-[var(--adm-line)] rounded-xl px-3 py-2.5 text-[var(--adm-text)] focus:outline-none focus:border-[var(--adm-blue-soft)] disabled:opacity-50"
                >
                  <option value="">-- Selecione o equipamento --</option>
                  {ativosDoCliente.map((atv, idx) => (
                    <option key={atv.id ? `${atv.id}-${idx}` : `atv-${idx}`} value={atv.id}>
                      {atv.identificacao} · {atv.tipo}
                    </option>
                  ))}
                </select>
                {ativoSelecionado && (
                  <p className="mt-1.5 text-[11px] text-[var(--adm-mut)]">
                    {ativoSelecionado.fabricante} {ativoSelecionado.modelo ? `· ${ativoSelecionado.modelo}` : ''}
                  </p>
                )}
              </div>

              {/* Data/Hora automática + GPS opcional */}
              <div>
                <label className="block text-xs font-semibold text-[var(--adm-mut)] mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Data e hora da vistoria</span>
                </label>
                <input
                  type="datetime-local"
                  value={dataPreenchimento ? dataPreenchimento.slice(0, 16) : ''}
                  onChange={(e) => {
                    if (e.target.value) setDataPreenchimento(new Date(e.target.value).toISOString());
                  }}
                  className="w-full text-xs font-semibold bg-[var(--adm-bg)] border border-[var(--adm-line)] rounded-xl px-3 py-2.5 text-[var(--adm-text)] focus:outline-none focus:border-[var(--adm-blue-soft)]"
                />
                <div className="mt-2 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleCapturarGps}
                    disabled={capturandoGps}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[var(--adm-blue-soft,#6ea1ff)] bg-[var(--adm-bg)] border border-[var(--adm-line)] hover:border-[var(--adm-blue-soft)] px-2.5 py-1.5 rounded-lg cursor-pointer"
                  >
                    <Navigation className={`w-3.5 h-3.5 ${capturandoGps ? 'animate-spin' : ''}`} />
                    <span>
                      {geolocalizacao
                        ? 'GPS registrado'
                        : capturandoGps
                        ? 'Obtendo GPS...'
                        : 'Geolocalização (opcional)'}
                    </span>
                  </button>
                  {geolocalizacao?.precisao && (
                    <span className="text-[10.5px] font-mono text-emerald-500">
                      ±{geolocalizacao.precisao}m
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Modelo por Tipo de Serviço & Itens */}
          <div className="bg-[var(--adm-card)] p-4 sm:p-5 rounded-2xl border border-[var(--adm-line)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--adm-line)] pb-3">
              <div>
                <h3 className="text-xs font-bold text-[var(--adm-text)] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[var(--adm-blue-soft,#6ea1ff)]" />
                  <span>2. Modelo de Inspeção & Critérios</span>
                </h3>
                <p className="text-[11px] text-[var(--adm-mut)] mt-0.5">
                  Critérios configuráveis por tipo de serviço (sem pré-marcação inicial).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {modelosAtivos.map((mod, idx) => (
                  <button
                    key={mod.id ? `${mod.id}-${idx}` : `mod-${idx}`}
                    type="button"
                    onClick={() => handleTrocarModeloServico(mod.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      tipoServicoSelecionado === mod.id
                        ? 'bg-[var(--adm-blue,#2160db)] text-white border-[var(--adm-blue,#2160db)]'
                        : 'bg-[var(--adm-bg)] text-[var(--adm-text)] border-[var(--adm-line)] hover:border-[var(--adm-blue-soft)]'
                    }`}
                  >
                    {mod.id.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Resumo do modelo ativo */}
            <div className="p-3.5 rounded-xl bg-[var(--adm-bg)] border border-[var(--adm-line)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <strong className="text-xs font-bold text-[var(--adm-text)] block">
                  {modeloAtivo?.nome}
                </strong>
                <span className="text-[11px] text-[var(--adm-mut)]">
                  Normas: {modeloAtivo?.norma}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold shrink-0">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                  {conformesCount} C
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-rose-500/15 text-rose-500 border border-rose-500/30">
                  {naoConformesCount} NC
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-[var(--adm-card)] text-[var(--adm-mut)] border border-[var(--adm-line)]">
                  {naCount} N.A.
                </span>
              </div>
            </div>

            {/* Itens */}
            <div className="space-y-3.5">
              {itens.map((item, idx) => (
                <ChecklistItemRenderer
                  key={item.id ? `${item.id}-${idx}` : `item-${idx}`}
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
                  onAtualizarLegendaFoto={(fotoId, legenda) =>
                    handleAtualizarLegendaFoto(item.id, fotoId, legenda)
                  }
                />
              ))}
            </div>

            {/* Itens Extras */}
            {itensExtras.length > 0 && (
              <div className="pt-3 border-t border-[var(--adm-line)] space-y-3.5">
                <h4 className="text-xs font-bold text-[var(--adm-text)] uppercase tracking-wider">
                  Itens Adicionais de Campo ({itensExtras.length})
                </h4>
                {itensExtras.map((item, idx) => (
                  <ChecklistItemRenderer
                    key={item.id ? `${item.id}-${idx}` : `extra-${idx}`}
                    item={item}
                    index={idx}
                    isExtra
                    onStatusChange={(st) => handleItemStatusChange(item.id, st, true)}
                    onValorChange={(v) => handleItemValorChange(item.id, v, true)}
                    onObservacaoChange={(obs) => handleItemObsChange(item.id, obs, true)}
                    onCriticidadeChange={(crit) => handleItemCriticidadeChange(item.id, crit, true)}
                    onAcaoRecomendadaChange={(acao) =>
                      handleItemAcaoRecomendadaChange(item.id, acao, true)
                    }
                    onMedicaoChange={(med) => handleItemMedicaoChange(item.id, med, true)}
                    onFotoUpload={(file, legenda) =>
                      handleItemFotoUpload(item.id, file, legenda, true)
                    }
                    onRemoverFoto={(fotoId) => handleRemoverFoto(item.id, fotoId, true)}
                    onAtualizarLegendaFoto={(fotoId, legenda) =>
                      handleAtualizarLegendaFoto(item.id, fotoId, legenda, true)
                    }
                    onRemoverItem={() => handleRemoverItemExtra(item.id)}
                  />
                ))}
              </div>
            )}

            {/* Adicionar item avulso */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Adicionar item avulso constatado em campo..."
                value={novoItemDescricao}
                onChange={(e) => setNovoItemDescricao(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdicionarItemExtra()}
                className="flex-1 text-xs bg-[var(--adm-bg)] border border-[var(--adm-line)] rounded-xl px-3 py-2.5 text-[var(--adm-text)] placeholder:text-[var(--adm-mut)] focus:outline-none focus:border-[var(--adm-blue-soft)]"
              />
              <button
                type="button"
                onClick={handleAdicionarItemExtra}
                className="min-h-[42px] px-4 py-2 bg-[var(--adm-bg)] border border-[var(--adm-line)] hover:border-[var(--adm-blue-soft)] text-[var(--adm-text)] font-bold text-xs rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 text-[var(--adm-blue-soft,#6ea1ff)]" />
                <span>Adicionar item</span>
              </button>
            </div>
          </div>

          {/* 3. Responsável Técnico & Rubrica */}
          <div className="bg-[var(--adm-card)] p-4 sm:p-5 rounded-2xl border border-[var(--adm-line)] space-y-3">
            <h4 className="text-xs font-bold text-[var(--adm-text)] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>3. Responsável Técnico & Rubrica Digital</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[var(--adm-mut)] block mb-1">
                  Responsável técnico
                </label>
                <input
                  type="text"
                  value={responsavelNome}
                  onChange={(e) => setResponsavelNome(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-[var(--adm-line)] bg-[var(--adm-bg)] text-[var(--adm-text)]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[var(--adm-mut)] block mb-1">
                  CREA / Registro
                </label>
                <input
                  type="text"
                  value={responsavelCrea}
                  onChange={(e) => setResponsavelCrea(e.target.value)}
                  className="w-full text-xs font-mono font-bold px-3 py-2 rounded-xl border border-[var(--adm-line)] bg-[var(--adm-bg)] text-[var(--adm-text)]"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl p-2 border border-[var(--adm-line)]">
              <RubricaSignatureCanvas
                initialSignature={rubricaUrl}
                onSave={(url) => setRubricaUrl(url)}
              />
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="px-4 sm:px-6 py-4 border-t border-[var(--adm-line)] bg-[var(--adm-card)] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="text-xs">
            {podeConcluirVistoria ? (
              <span className="text-emerald-500 font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4 shrink-0" />
                Todos os itens verificados. Pronta para concluir e gerar o laudo.
              </span>
            ) : (
              <span className="text-amber-500 font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {pendentesCount > 0
                  ? `${pendentesCount} item(ns) sem resposta — responda todos para concluir.`
                  : `${ncsSemObservacao.length} item(ns) Não conforme(s) sem observação obrigatória.`}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2.5 text-xs font-semibold text-[var(--adm-mut)] hover:text-[var(--adm-text)] rounded-xl border border-[var(--adm-line)] cursor-pointer"
            >
              Fechar
            </button>

            <button
              type="button"
              onClick={() => handleSalvar('rascunho')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-[var(--adm-text)] bg-[var(--adm-bg)] hover:border-[var(--adm-blue-soft)] rounded-xl border border-[var(--adm-line)] cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar rascunho</span>
            </button>

            <button
              type="button"
              onClick={() => handleSalvar('finalizado')}
              disabled={!podeConcluirVistoria}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl border transition ${
                podeConcluirVistoria
                  ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 cursor-pointer'
                  : 'border-[var(--adm-line)] bg-[var(--adm-bg)] text-[var(--adm-mut)] opacity-50 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Concluir vistoria</span>
            </button>

            <button
              type="button"
              onClick={handleGerarLaudoAPartirDestaVistoria}
              disabled={!podeConcluirVistoria}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl transition ${
                podeConcluirVistoria
                  ? 'bg-[var(--adm-blue,#2160db)] hover:brightness-110 text-white cursor-pointer'
                  : 'bg-[var(--adm-bg)] text-[var(--adm-mut)] border border-[var(--adm-line)] opacity-50 cursor-not-allowed'
              }`}
            >
              <span>
                {laudoJaVinculado
                  ? `Atualizar laudo (${laudoJaVinculado.numero})`
                  : 'Gerar laudo a partir desta vistoria'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
