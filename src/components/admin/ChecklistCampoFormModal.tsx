import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
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
  CheckSquare
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ChecklistCampo, ChecklistCampoItem, ChecklistCampoItemStatus, CategoriaLaudoDef, TipoLaudoDef, PerigoApreciacaoRiscoNR12 } from '../../types';
import { RubricaSignatureCanvas } from './RubricaSignatureCanvas';
import { ChecklistItemRenderer } from './ChecklistItemRenderer';
import { TabelaApreciacaoRiscoNR12 } from './TabelaApreciacaoRiscoNR12';

interface ChecklistCampoFormModalProps {
  checklistParaEditar?: ChecklistCampo | null;
  onClose: () => void;
  onSaved: (id: string) => void;
}

export const ChecklistCampoFormModal: React.FC<ChecklistCampoFormModalProps> = ({
  checklistParaEditar,
  onClose,
  onSaved,
}) => {
  const { clientes, ativos, categoriasLaudo, adicionarChecklistCampo, atualizarChecklistCampo } = useData();
  const { currentUser } = useAuth();

  // Entidades Selecionadas
  const [clienteId, setClienteId] = useState<string>(checklistParaEditar?.clienteId || '');
  const [ativoId, setAtivoId] = useState<string>(checklistParaEditar?.ativoId || '');
  const [tipoLaudoId, setTipoLaudoId] = useState<string>(checklistParaEditar?.tipoLaudoId || '');

  // Itens de Verificação
  const [itens, setItens] = useState<ChecklistCampoItem[]>(checklistParaEditar?.itens || []);
  const [itensExtras, setItensExtras] = useState<ChecklistCampoItem[]>(checklistParaEditar?.itensExtras || []);
  const [perigosNR12, setPerigosNR12] = useState<PerigoApreciacaoRiscoNR12[]>(checklistParaEditar?.perigosApreciacaoRisco || []);

  // Rubrica & Responsável
  const [rubricaUrl, setRubricaUrl] = useState<string | undefined>(checklistParaEditar?.rubricaUrl);
  const [responsavelNome, setResponsavelNome] = useState<string>(
    checklistParaEditar?.responsavelNome || currentUser?.nome || 'Eng. Vitor Leonardo'
  );
  const [responsavelCrea, setResponsavelCrea] = useState<string>(
    checklistParaEditar?.responsavelCrea || (currentUser as any)?.crea || 'CREA-PE 1822299490'
  );

  // Geolocalização
  const [geolocalizacao, setGeolocalizacao] = useState<{
    lat: number;
    lng: number;
    precisao?: number;
    enderecoAproximado?: string;
  } | null>(checklistParaEditar?.geolocalizacao || null);
  const [capturandoGps, setCapturandoGps] = useState(false);

  // Outros estados
  const [disponibilizadoParaCliente, setDisponibilizadoParaCliente] = useState<boolean>(
    checklistParaEditar?.disponibilizadoParaCliente ?? false
  );
  const [novoItemDescricao, setNovoItemDescricao] = useState('');
  const [erroValidacao, setErroValidacao] = useState<string | null>(null);

  // Lista de tipos de laudos habilitados para preenchimento preliminar
  const tiposHabilitados: { id: string; nome: string; categoriaId: string; categoriaNome: string; def: TipoLaudoDef }[] = [];
  categoriasLaudo.forEach(cat => {
    cat.subcategorias?.forEach(sub => {
      sub.tipos?.forEach(tipo => {
        if (tipo.permitePreenchimentoPreliminar !== false) {
          tiposHabilitados.push({
            id: tipo.id,
            nome: tipo.nome,
            categoriaId: cat.id,
            categoriaNome: cat.nome,
            def: tipo
          });
        }
      });
    });
  });

  // Ativos pertencentes ao cliente selecionado
  const ativosDoCliente = ativos.filter(a => a.clienteId === clienteId);
  const clienteSelecionado = clientes.find(c => c.id === clienteId);
  const ativoSelecionado = ativos.find(a => a.id === ativoId);
  const tipoSelecionadoObj = tiposHabilitados.find(t => t.id === tipoLaudoId);

  // Auto-selecionar primeiro ativo caso o cliente mude
  useEffect(() => {
    if (clienteId && !checklistParaEditar) {
      const ativosCli = ativos.filter(a => a.clienteId === clienteId);
      if (ativosCli.length > 0 && (!ativoId || !ativosCli.some(a => a.id === ativoId))) {
        setAtivoId(ativosCli[0].id);
      }
    }
  }, [clienteId, ativos]);

  // Carregar itens pré-definidos do tipo de laudo se estiver criando novo ou se itens estiverem vazios
  useEffect(() => {
    if (!checklistParaEditar && tipoLaudoId && itens.length === 0) {
      const achado = tiposHabilitados.find(t => t.id === tipoLaudoId);
      if (achado?.def) {
        const itensCarregados: ChecklistCampoItem[] = [];
        const listaBase = achado.def.checklistInicial || achado.def.checklistPadrao || [];

        listaBase.forEach((item, idx) => {
          const descricao = typeof item === 'string' 
            ? item 
            : ((item as any).campo || (item as any).descricao || (item as any).item || '');
          const isObj = typeof item === 'object';
          itensCarregados.push({
            id: `chk-it-${idx + 1}`,
            descricao,
            status: isObj && (item as any).status ? (item as any).status : 'conforme',
            observacao: isObj && (item as any).observacao ? (item as any).observacao : '',
            campo: isObj ? (item as any).campo : undefined,
            tipoResposta: isObj ? ((item as any).tipoResposta || 'conformidade') : 'conformidade',
            unidade: isObj ? (item as any).unidade : undefined,
            opcoes: isObj ? (item as any).opcoes : undefined,
            valorMinimo: isObj ? (item as any).valorMinimo : undefined,
            valorMaximo: isObj ? (item as any).valorMaximo : undefined,
            fotoObrigatoria: isObj ? Boolean((item as any).fotoObrigatoria || (item as any).obrigatorioFoto) : undefined,
            criterioReferencia: isObj ? (item as any).criterioReferencia : undefined,
            obrigatorioFoto: isObj ? Boolean((item as any).fotoObrigatoria || (item as any).obrigatorioFoto) : undefined,
            exigeFotoSeNaoConforme: isObj ? (item as any).exigeFotoSeNaoConforme : undefined,
            valor: isObj ? ((item as any).valor ?? (item as any).valorResposta ?? '') : '',
            valorResposta: isObj ? String((item as any).valor ?? (item as any).valorResposta ?? '') : '',
          });
        });

        if (itensCarregados.length > 0) {
          setItens(itensCarregados);
        }
      }
    }
  }, [tipoLaudoId, checklistParaEditar]);

  const handleTrocarTipo = (novoTipoId: string) => {
    setTipoLaudoId(novoTipoId);
    const achado = tiposHabilitados.find(t => t.id === novoTipoId);
    if (achado?.def) {
      const itensCarregados: ChecklistCampoItem[] = [];
      const listaBase = achado.def.checklistInicial || achado.def.checklistPadrao || [];
      listaBase.forEach((item, idx) => {
        const descricao = typeof item === 'string' 
          ? item 
          : ((item as any).campo || (item as any).descricao || (item as any).item || '');
        const isObj = typeof item === 'object';
        itensCarregados.push({
          id: `chk-it-${idx + 1}`,
          descricao,
          status: isObj && (item as any).status ? (item as any).status : 'conforme',
          observacao: isObj && (item as any).observacao ? (item as any).observacao : '',
          campo: isObj ? (item as any).campo : undefined,
          tipoResposta: isObj ? ((item as any).tipoResposta || 'conformidade') : 'conformidade',
          unidade: isObj ? (item as any).unidade : undefined,
          opcoes: isObj ? (item as any).opcoes : undefined,
          valorMinimo: isObj ? (item as any).valorMinimo : undefined,
          valorMaximo: isObj ? (item as any).valorMaximo : undefined,
          fotoObrigatoria: isObj ? Boolean((item as any).fotoObrigatoria || (item as any).obrigatorioFoto) : undefined,
          criterioReferencia: isObj ? (item as any).criterioReferencia : undefined,
          obrigatorioFoto: isObj ? Boolean((item as any).fotoObrigatoria || (item as any).obrigatorioFoto) : undefined,
          exigeFotoSeNaoConforme: isObj ? (item as any).exigeFotoSeNaoConforme : undefined,
          valor: isObj ? ((item as any).valor ?? (item as any).valorResposta ?? '') : '',
          valorResposta: isObj ? String((item as any).valor ?? (item as any).valorResposta ?? '') : '',
        });
      });
      setItens(itensCarregados);
    }
  };

  const handleItemStatusChange = (id: string, status: ChecklistCampoItemStatus, isExtra: boolean = false) => {
    if (isExtra) {
      setItensExtras(prev => prev.map(it => it.id === id ? { ...it, status } : it));
    } else {
      setItens(prev => prev.map(it => it.id === id ? { ...it, status } : it));
    }
  };

  const handleItemValorChange = (id: string, valor: string | number | null, isExtra: boolean = false) => {
    const valorResposta = valor !== null && valor !== undefined ? String(valor) : '';
    if (isExtra) {
      setItensExtras(prev => prev.map(it => it.id === id ? { ...it, valor, valorResposta } : it));
    } else {
      setItens(prev => prev.map(it => it.id === id ? { ...it, valor, valorResposta } : it));
    }
  };

  const handleItemValorRespostaChange = (id: string, valorResposta: string, isExtra: boolean = false) => {
    if (isExtra) {
      setItensExtras(prev => prev.map(it => it.id === id ? { ...it, valorResposta, valor: valorResposta } : it));
    } else {
      setItens(prev => prev.map(it => it.id === id ? { ...it, valorResposta, valor: valorResposta } : it));
    }
  };

  const handleItemObsChange = (id: string, observacao: string, isExtra: boolean = false) => {
    if (isExtra) {
      setItensExtras(prev => prev.map(it => it.id === id ? { ...it, observacao } : it));
    } else {
      setItens(prev => prev.map(it => it.id === id ? { ...it, observacao } : it));
    }
  };

  const handleItemFotoUpload = (id: string, file: File, isExtra: boolean = false) => {
    const reader = new FileReader();
    reader.onload = () => {
      const fotoUrl = reader.result as string;
      if (isExtra) {
        setItensExtras(prev => prev.map(it => it.id === id ? { ...it, fotoUrl, fotoNome: file.name } : it));
      } else {
        setItens(prev => prev.map(it => it.id === id ? { ...it, fotoUrl, fotoNome: file.name } : it));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoverFoto = (id: string, isExtra: boolean = false) => {
    if (isExtra) {
      setItensExtras(prev => prev.map(it => it.id === id ? { ...it, fotoUrl: undefined, fotoNome: undefined } : it));
    } else {
      setItens(prev => prev.map(it => it.id === id ? { ...it, fotoUrl: undefined, fotoNome: undefined } : it));
    }
  };

  const handleAdicionarItemExtra = () => {
    if (!novoItemDescricao.trim()) return;
    const novo: ChecklistCampoItem = {
      id: `chk-extra-${Date.now()}`,
      descricao: novoItemDescricao.trim(),
      status: 'conforme',
      observacao: '',
    };
    setItensExtras(prev => [...prev, novo]);
    setNovoItemDescricao('');
  };

  const handleRemoverItemExtra = (id: string) => {
    setItensExtras(prev => prev.filter(it => it.id !== id));
  };

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

  const handleSalvar = (statusDesejado: 'rascunho' | 'finalizado') => {
    setErroValidacao(null);

    // Validações Obrigatórias
    if (!clienteId) {
      setErroValidacao('Selecione o Cliente (obrigatório).');
      return;
    }
    if (!ativoId) {
      setErroValidacao('Selecione o Ativo / Equipamento inspecionado (obrigatório).');
      return;
    }
    if (!tipoLaudoId) {
      setErroValidacao('Selecione o Tipo de Laudo correspondente (obrigatório).');
      return;
    }

    if (statusDesejado === 'finalizado' && !rubricaUrl) {
      setErroValidacao('Para finalizar o checklist in loco, é obrigatório assinar a rubrica técnica no quadro abaixo.');
      return;
    }

    // Validação de foto obrigatória nos itens do checklist
    for (const it of itens) {
      const isFotoObrigatoria = Boolean(it.fotoObrigatoria || it.obrigatorioFoto);
      const temFoto = Boolean(it.fotoUrl || (it.fotosUrls && it.fotosUrls.length > 0));
      if (isFotoObrigatoria && !temFoto) {
        setErroValidacao(`O item "${it.descricao}" exige registro fotográfico obrigatório antes de salvar o checklist.`);
        return;
      }
    }

    const tipoObj = tiposHabilitados.find(t => t.id === tipoLaudoId);

    // Validação de foto obrigatória nos perigos identificados da NR-12 / HRN
    if (tipoLaudoId === 'laudo-nr12-hrn' || (tipoObj?.def as any)?.temHrn || (tipoObj?.def as any)?.hrn) {
      for (let i = 0; i < perigosNR12.length; i++) {
        const p = perigosNR12[i];
        const temFoto = Boolean(p.fotoUrl || (p.fotosUrls && p.fotosUrls.length > 0));
        if (!temFoto) {
          setErroValidacao(`O Ponto de Perigo #${i + 1} ("${p.pontoOperacao || 'Zona sem descrição'}") exige foto comprobatória obrigatória do risco.`);
          return;
        }
      }
    }

    const payload = {
      clienteId,
      clienteNome: clienteSelecionado?.razaoSocial || clienteSelecionado?.nomeFantasia || 'Cliente',
      clienteCnpj: clienteSelecionado?.cnpj || clienteSelecionado?.cpfCnpj || '',
      ativoId,
      ativoIdentificacao: ativoSelecionado ? `${ativoSelecionado.identificacao} (${ativoSelecionado.tipo})` : 'Ativo',
      categoriaLaudo: tipoObj?.categoriaId || 'cat-1',
      tipoLaudoId,
      tipoLaudoNome: tipoObj?.nome || tipoLaudoId,
      itens,
      itensExtras,
      perigosApreciacaoRisco: (tipoLaudoId === 'laudo-nr12-hrn' || (tipoObj?.def as any)?.temHrn || (tipoObj?.def as any)?.hrn) ? perigosNR12 : undefined,
      rubricaUrl,
      rubricaTimestamp: rubricaUrl ? (checklistParaEditar?.rubricaTimestamp || new Date().toISOString()) : undefined,
      responsavelUid: currentUser?.uid || 'usr-master',
      responsavelNome,
      responsavelCrea,
      dataPreenchimento: checklistParaEditar?.dataPreenchimento || new Date().toISOString(),
      geolocalizacao,
      disponibilizadoParaCliente,
      status: statusDesejado,
      vinculadoALaudoId: checklistParaEditar?.vinculadoALaudoId || null,
      vinculadoAOrcamentoId: checklistParaEditar?.vinculadoAOrcamentoId || null,
    };

    if (checklistParaEditar) {
      atualizarChecklistCampo(checklistParaEditar.id, payload);
      onSaved(checklistParaEditar.id);
    } else {
      const novoId = adicionarChecklistCampo(payload);
      onSaved(novoId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] flex flex-col overflow-hidden my-auto border border-slate-200">
        {/* Topo do Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                {checklistParaEditar ? `Editar Checklist ${checklistParaEditar.numero}` : 'Novo Checklist de Campo In Loco'}
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Tablet & Mobile Otimizado
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Preenchimento rápido durante a visita técnica com fotos e rubrica
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mensagem de Erro de Validação se houver */}
        {erroValidacao && (
          <div className="px-6 py-3 bg-rose-50 border-b border-rose-200 flex items-center gap-2 text-xs font-semibold text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{erroValidacao}</span>
          </div>
        )}

        {/* Corpo do Formulário com Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          
          {/* PASSO 1: SELEÇÃO DE CLIENTE, ATIVO E TIPO DE LAUDO */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                1. Identificação Obrigatória (Cliente & Ativo Inspecionado)
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Etapa 1 de 3</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Cliente */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cliente <span className="text-rose-500">*</span>
                </label>
                <select
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Selecione o Cliente --</option>
                  {clientes.map(cli => (
                    <option key={cli.id} value={cli.id}>
                      {cli.razaoSocial} ({cli.endereco?.cidade || 'PE'})
                    </option>
                  ))}
                </select>

                {clienteSelecionado && (
                  <div className="mt-2 p-2 bg-blue-50/60 rounded-md border border-blue-100 text-[11px] text-slate-600 space-y-0.5">
                    <p><strong>CNPJ:</strong> {clienteSelecionado.cnpj || clienteSelecionado.cpfCnpj || 'Não cadastrado'}</p>
                    <p><strong>Contato:</strong> {clienteSelecionado.contatos?.[0]?.nome || 'Responsável'}</p>
                  </div>
                )}
              </div>

              {/* Ativo do Cliente */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ativo / Equipamento <span className="text-rose-500">*</span>
                </label>
                <select
                  value={ativoId}
                  onChange={(e) => setAtivoId(e.target.value)}
                  disabled={!clienteId}
                  className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value="">-- Selecione o Ativo --</option>
                  {ativosDoCliente.map(atv => (
                    <option key={atv.id} value={atv.id}>
                      {atv.identificacao} - {atv.tipo}
                    </option>
                  ))}
                </select>

                {ativoSelecionado ? (
                  <div className="mt-2 p-2 bg-emerald-50/60 rounded-md border border-emerald-100 text-[11px] text-slate-600 space-y-0.5">
                    <p><strong>Fabricante:</strong> {ativoSelecionado.fabricante || 'N/D'}</p>
                    <p><strong>Modelo/Ano:</strong> {ativoSelecionado.modelo || '—'} / {ativoSelecionado.ano || '—'}</p>
                  </div>
                ) : clienteId && ativosDoCliente.length === 0 ? (
                  <p className="mt-1 text-[11px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                    Nenhum ativo vinculado a este cliente. Cadastre ativos no menu <strong>Ativos</strong> antes da inspeção.
                  </p>
                ) : null}
              </div>

              {/* Tipo de Laudo */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipo de Laudo <span className="text-rose-500">*</span>
                </label>
                <select
                  value={tipoLaudoId}
                  onChange={(e) => handleTrocarTipo(e.target.value)}
                  className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Selecione o Tipo de Laudo --</option>
                  {tiposHabilitados.map(tipo => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nome}
                    </option>
                  ))}
                </select>

                {tipoSelecionadoObj && (
                  <div className="mt-2 p-2 bg-purple-50/60 rounded-md border border-purple-100 text-[11px] text-slate-600">
                    <p><strong>Categoria:</strong> {tipoSelecionadoObj.categoriaNome}</p>
                    <p className="text-purple-800 font-medium mt-0.5">
                      ✓ Checklist preliminar habilitado
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PASSO 2: CHECKLIST ITEM A ITEM COM STATUS, OBS E FOTO */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  2. Itens de Inspeção Técnica In Loco ({itens.length + itensExtras.length} itens)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Marque com toque rápido: Conforme, Não Conforme ou Não Aplicável
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {itens.filter(i => i.status === 'conforme').length + itensExtras.filter(i => i.status === 'conforme').length} Conf.
                </span>
                <span className="flex items-center gap-1 text-rose-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  {itens.filter(i => i.status === 'nao_conforme').length + itensExtras.filter(i => i.status === 'nao_conforme').length} Não Conf.
                </span>
              </div>
            </div>

            {/* Lista dos Itens Pré-definidos */}
            <div className="space-y-3">
              {itens.map((item, idx) => (
                <ChecklistItemRenderer
                  key={item.id}
                  item={item}
                  index={idx}
                  onStatusChange={(st) => handleItemStatusChange(item.id, st)}
                  onValorChange={(v) => handleItemValorChange(item.id, v)}
                  onObservacaoChange={(obs) => handleItemObsChange(item.id, obs)}
                  onFotoUpload={(file) => handleItemFotoUpload(item.id, file)}
                  onRemoverFoto={() => handleRemoverFoto(item.id)}
                />
              ))}
            </div>

            {/* Apreciação de Risco HRN para Laudo NR-12 */}
            {(tipoLaudoId === 'laudo-nr12-hrn' || (tipoSelecionadoObj?.def as any)?.temHrn || (tipoSelecionadoObj?.def as any)?.hrn) && (
              <div className="pt-2">
                <TabelaApreciacaoRiscoNR12
                  perigos={perigosNR12}
                  onChange={setPerigosNR12}
                />
              </div>
            )}

            {/* Itens Extras adicionados pelo técnico */}
            {itensExtras.length > 0 && (
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
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
                    onFotoUpload={(file) => handleItemFotoUpload(item.id, file, true)}
                    onRemoverFoto={() => handleRemoverFoto(item.id, true)}
                    onRemoverItem={() => handleRemoverItemExtra(item.id)}
                  />
                ))}
              </div>
            )}

            {/* Adicionar Novo Item Extra */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Adicionar item técnico extra observado in loco..."
                value={novoItemDescricao}
                onChange={(e) => setNovoItemDescricao(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdicionarItemExtra()}
                className="flex-1 text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAdicionarItemExtra}
                className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-lg border border-blue-200 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar Item
              </button>
            </div>
          </div>

          {/* PASSO 3: GEOLOCALIZAÇÃO & RESPONSÁVEL TÉCNICO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Geolocalização */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-500" />
                  Geolocalização da Visita Técnica
                </label>
                <button
                  type="button"
                  onClick={handleCapturarGps}
                  disabled={capturandoGps}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors"
                >
                  <Navigation className={`w-3.5 h-3.5 ${capturandoGps ? 'animate-spin' : ''}`} />
                  {capturandoGps ? 'Capturando GPS...' : 'Capturar GPS'}
                </button>
              </div>

              {geolocalizacao ? (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                  <p className="font-mono text-slate-800 font-semibold">
                    Lat: {geolocalizacao.lat.toFixed(6)} | Lng: {geolocalizacao.lng.toFixed(6)}
                  </p>
                  {geolocalizacao.precisao && (
                    <p className="text-[11px] text-slate-500">
                      Precisão do GPS: ±{geolocalizacao.precisao} metros
                    </p>
                  )}
                  <p className="text-[11px] text-emerald-700 font-medium">
                    ✓ Posição geográfica registrada in loco
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-lg border border-dashed border-slate-200">
                  Clique em "Capturar GPS" para registrar as coordenadas do local da inspeção.
                </p>
              )}
            </div>

            {/* Responsável Técnico */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-600" />
                Responsável Técnico In Loco
              </label>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Nome do Perito / Técnico</label>
                  <input
                    type="text"
                    value={responsavelNome}
                    onChange={(e) => setResponsavelNome(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Registro CREA / CFT</label>
                  <input
                    type="text"
                    value={responsavelCrea}
                    onChange={(e) => setResponsavelCrea(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="disponibilizarCli"
                  checked={disponibilizadoParaCliente}
                  onChange={(e) => setDisponibilizadoParaCliente(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="disponibilizarCli" className="text-xs text-slate-700 cursor-pointer select-none">
                  Disponibilizar PDF do checklist preliminar no Portal do Cliente
                </label>
              </div>
            </div>
          </div>

          {/* PASSO 4: RUBRICA TÉCNICA TOUCH / MOUSE */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <RubricaSignatureCanvas
              initialSignature={rubricaUrl}
              onSave={(url) => setRubricaUrl(url)}
            />
          </div>

        </div>

        {/* Rodapé do Modal com Ações */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {rubricaUrl ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> Rubrica capturada com sucesso
              </span>
            ) : (
              <span>Rubrica pendente para finalização</span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-300"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={() => handleSalvar('rascunho')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300"
            >
              <Save className="w-3.5 h-3.5 text-slate-600" />
              Salvar Rascunho
            </button>

            <button
              type="button"
              onClick={() => handleSalvar('finalizado')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              Finalizar Checklist In Loco
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
