import React, { useState, useEffect, useRef } from 'react';
import {
  FileUp,
  FileCheck2,
  X,
  Upload,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Loader2,
  Download,
  ExternalLink
} from 'lucide-react';
import { Cliente, Ativo, Laudo } from '../../types';
import { SERVICOS_LISTA } from '../../data/servicosCatalogo';

import {
  salvarPdfIndexedDb,
  removerPdfIndexedDb,
  tentarUploadFirebaseStorage,
} from '../../lib/pdfStorage';

interface AnexarLaudoAssinadoModalProps {
  isOpen: boolean;
  laudoExistente?: Laudo | null;
  clientes: Cliente[];
  ativos: Ativo[];
  gerarNumeroLaudo: (prefixo?: string) => string;
  onClose: () => void;
  onCriarComPdf: (dados: Partial<Laudo> & { tipo: string; clienteId: string; ativoId: string }) => string;
  onAtualizarLaudoPdf: (id: string, dados: Partial<Record<keyof Laudo, any>>) => void;
  onSuccessToast: (msg: string) => void;
}

const CHUNK_SIZE_BYTES = 700 * 1024; // ~700 KB binário -> ~933 KB em base64 (seguro contra limites de proxy)

const formatBytes = (bytes?: number) => {
  if (!bytes || bytes <= 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

function blobParaBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const res = typeof reader.result === 'string' ? reader.result : '';
      const idx = res.indexOf('base64,');
      resolve(idx >= 0 ? res.slice(idx + 7) : res);
    };
    reader.onerror = () => reject(new Error('Falha ao ler trecho do arquivo PDF.'));
    reader.readAsDataURL(blob);
  });
}

export const AnexarLaudoAssinadoModal: React.FC<AnexarLaudoAssinadoModalProps> = ({
  isOpen,
  laudoExistente,
  clientes,
  ativos,
  gerarNumeroLaudo,
  onClose,
  onCriarComPdf,
  onAtualizarLaudoPdf,
  onSuccessToast,
}) => {
  const isEditingExisting = Boolean(laudoExistente);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [clienteId, setClienteId] = useState('');
  const [ativoId, setAtivoId] = useState('');
  const [numero, setNumero] = useState('');
  const [tipo, setTipo] = useState(SERVICOS_LISTA[0]?.subtipos[0]?.nome || 'Laudo Técnico Mecânico');
  const [artNumero, setArtNumero] = useState('');
  const [dataInspecao, setDataInspecao] = useState(new Date().toISOString().split('T')[0]);
  const [marcarFinalizado, setMarcarFinalizado] = useState(true);

  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
  const [progressoEnvio, setProgressoEnvio] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setErro(null);
    setArquivoSelecionado(null);
    setProgressoEnvio(null);
    setSalvando(false);

    if (laudoExistente) {
      setClienteId(laudoExistente.clienteId || '');
      setAtivoId(laudoExistente.ativoId || '');
      setNumero(laudoExistente.numero || '');
      setTipo(laudoExistente.tipo || '');
      setArtNumero(laudoExistente.artNumero || '');
      setDataInspecao(laudoExistente.dataInspecao || new Date().toISOString().split('T')[0]);
      setMarcarFinalizado(true);
    } else {
      const primCliente = clientes[0]?.id || '';
      setClienteId(primCliente);
      const primAtivo = ativos.find(a => a.clienteId === primCliente)?.id || '';
      setAtivoId(primAtivo);
      setNumero(gerarNumeroLaudo());
      setTipo(SERVICOS_LISTA[0]?.subtipos[0]?.nome || 'Laudo Técnico Mecânico');
      setArtNumero('');
      setDataInspecao(new Date().toISOString().split('T')[0]);
      setMarcarFinalizado(true);
    }
  }, [isOpen, laudoExistente, clientes, ativos, gerarNumeroLaudo]);

  if (!isOpen) return null;

  const ativosDoCliente = ativos.filter(a => !clienteId || a.clienteId === clienteId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErro(null);

    const isPdf =
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setErro('Selecione um arquivo no formato PDF (.pdf).');
      e.target.value = '';
      return;
    }

    if (file.size === 0) {
      setErro('O arquivo PDF selecionado está vazio.');
      e.target.value = '';
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      setErro('O arquivo PDF excede o limite de 30 MB.');
      e.target.value = '';
      return;
    }

    setArquivoSelecionado(file);
  };

  const tentarEndpointEmPartes = async (endpoint: string, targetId: string, file: File) => {
    const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_SIZE_BYTES));
    const uploadId = `up-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    let respostaFinal: any = null;

    for (let idx = 0; idx < totalChunks; idx++) {
      setProgressoEnvio(
        totalChunks > 1
          ? `Enviando parte ${idx + 1} de ${totalChunks}...`
          : 'Enviando PDF...'
      );
      const start = idx * CHUNK_SIZE_BYTES;
      const end = Math.min(file.size, start + CHUNK_SIZE_BYTES);
      const slice = file.slice(start, end);
      const chunkData = await blobParaBase64(slice);

      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          laudoId: targetId,
          chunkData,
          chunkIndex: idx,
          totalChunks,
          uploadId,
          nomeArquivo: file.name,
        }),
      });

      const rawText = await resp.text();
      let json: any = {};
      try {
        json = rawText ? JSON.parse(rawText) : {};
      } catch {
        json = {};
      }

      if (!resp.ok) {
        const err: any = new Error(
          json?.error || `Erro HTTP ${resp.status} ao enviar o PDF assinado para o servidor.`
        );
        err.status = resp.status;
        throw err;
      }

      respostaFinal = json;
    }

    if (!respostaFinal?.url) {
      throw new Error('O servidor não retornou a URL do PDF salvo.');
    }

    return respostaFinal;
  };

  const enviarPdfComFallback = async (targetId: string, file: File) => {
    const endpoints = [
      '/api/laudo-pdf-assinado',
      `/api/laudos/${encodeURIComponent(targetId)}/pdf-assinado`,
    ];

    let ultimoErro: any = null;
    for (const ep of endpoints) {
      try {
        return await tentarEndpointEmPartes(ep, targetId, file);
      } catch (err: any) {
        ultimoErro = err;
        if (err?.status !== 404) {
          throw err;
        }
      }
    }

    // Se todas as rotas /api/* retornaram 404 (ex.: hospedagem estática), tenta Firebase Storage
    setProgressoEnvio('Salvando PDF na nuvem...');
    const firebaseUrl = await tentarUploadFirebaseStorage(targetId, file);
    if (firebaseUrl) {
      return {
        url: firebaseUrl,
        nomeArquivo: file.name,
        tamanhoBytes: file.size,
      };
    }

    // Último recurso garantido: armazenamento local em IndexedDB no navegador
    setProgressoEnvio('Salvando PDF localmente...');
    const idbUrl = await salvarPdfIndexedDb(targetId, file);
    if (idbUrl) {
      return {
        url: idbUrl,
        nomeArquivo: file.name,
        tamanhoBytes: file.size,
      };
    }

    throw ultimoErro || new Error('Não foi possível salvar o PDF.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!isEditingExisting) {
      const clienteSel = clientes.find(c => c.id === clienteId);
      if (!clienteSel) {
        setErro('Selecione um cliente cadastrado para vincular o laudo.');
        return;
      }
      if (!tipo.trim()) {
        setErro('Informe o título / tipo técnico do laudo.');
        return;
      }
      if (!arquivoSelecionado) {
        setErro('Anexe o arquivo PDF do laudo já finalizado e assinado.');
        return;
      }
    } else if (!arquivoSelecionado && !laudoExistente?.laudoAssinadoPdfUrl) {
      setErro('Selecione um arquivo PDF para anexar ao laudo.');
      return;
    }

    setSalvando(true);
    try {
      const targetId = laudoExistente?.id || `lau-${Date.now()}`;
      let pdfMeta: {
        laudoAssinadoPdfUrl?: string;
        laudoAssinadoPdfNome?: string;
        laudoAssinadoEm?: string;
        laudoAssinadoTamanho?: number;
      } = {};

      if (arquivoSelecionado) {
        const json = await enviarPdfComFallback(targetId, arquivoSelecionado);
        pdfMeta = {
          laudoAssinadoPdfUrl: json.url,
          laudoAssinadoPdfNome: json.nomeArquivo || arquivoSelecionado.name,
          laudoAssinadoEm: new Date().toISOString(),
          laudoAssinadoTamanho: json.tamanhoBytes || arquivoSelecionado.size,
        };
      }

      if (isEditingExisting && laudoExistente) {
        const patch: Partial<Record<keyof Laudo, any>> = {
          ...pdfMeta,
          artNumero: artNumero.trim() || laudoExistente.artNumero || '',
        };
        if (marcarFinalizado && laudoExistente.status !== 'finalizado') {
          patch.status = 'finalizado';
          patch.emitidoEm = laudoExistente.emitidoEm || new Date().toISOString();
        }
        onAtualizarLaudoPdf(laudoExistente.id, patch);
        onSuccessToast(
          arquivoSelecionado
            ? 'PDF assinado anexado e vinculado ao laudo com sucesso!'
            : 'Dados do laudo assinado atualizados!'
        );
      } else {
        const clienteSel = clientes.find(c => c.id === clienteId)!;
        const ativoSel = ativos.find(a => a.id === ativoId);
        const primContato = clienteSel.contatos?.[0];
        const endStr = clienteSel.endereco?.cidade
          ? `${clienteSel.endereco.logradouro ? clienteSel.endereco.logradouro + ', ' : ''}${
              clienteSel.endereco.numero ? clienteSel.endereco.numero + ' - ' : ''
            }${clienteSel.endereco.bairro ? clienteSel.endereco.bairro + ' - ' : ''}${
              clienteSel.endereco.cidade
            }/${clienteSel.endereco.estado || 'PE'}`.trim()
          : '';
        const agora = new Date().toISOString();

        onCriarComPdf({
          id: targetId,
          numero: numero.trim() || gerarNumeroLaudo(),
          tipo: tipo.trim(),
          clienteId: clienteSel.id,
          clienteNome: clienteSel.razaoSocial || clienteSel.nomeFantasia || 'Cliente',
          clienteCnpj: clienteSel.cpfCnpj || clienteSel.cnpj || '',
          clienteContato: primContato?.nome || '',
          clienteContatoCargo: primContato?.cargo || '',
          clienteContatoTelefone: primContato?.telefone || '',
          clienteContatoEmail: primContato?.email || '',
          clienteEndereco: endStr,
          ativoId: ativoSel?.id || '',
          ativoIdentificacao: ativoSel?.identificacao || tipo.trim(),
          ativoFabricante: ativoSel?.fabricante,
          ativoModelo: ativoSel?.modelo,
          ativoNumeroSerie: ativoSel?.numeroSerie || ativoSel?.chassi,
          ativoCapacidade: ativoSel?.capacidade,
          status: 'finalizado',
          emitidoEm: agora,
          artNumero: artNumero.trim(),
          dataInspecao: dataInspecao || agora.slice(0, 10),
          resumoExecutivo: `Laudo técnico finalizado e assinado (${tipo.trim()}) importado em PDF para ${
            clienteSel.nomeFantasia || clienteSel.razaoSocial
          }.`,
          ...pdfMeta,
        });
        onSuccessToast('Laudo finalizado e assinado (PDF) cadastrado na Central de Laudos!');
      }

      onClose();
    } catch (err: any) {
      setErro(err?.message || 'Erro ao salvar o laudo assinado em PDF.');
    } finally {
      setSalvando(false);
      setProgressoEnvio(null);
    }
  };

  const handleRemoverPdfExistente = async () => {
    if (!laudoExistente) return;
    setSalvando(true);
    setErro(null);
    try {
      await fetch(`/api/laudo-pdf-assinado?id=${encodeURIComponent(laudoExistente.id)}`, {
        method: 'DELETE',
      }).catch(() => {});
      await fetch(`/api/laudos/${encodeURIComponent(laudoExistente.id)}/pdf-assinado`, {
        method: 'DELETE',
      }).catch(() => {});
      await removerPdfIndexedDb(laudoExistente.id);

      onAtualizarLaudoPdf(laudoExistente.id, {
        laudoAssinadoPdfUrl: null,
        laudoAssinadoPdfNome: null,
        laudoAssinadoEm: null,
        laudoAssinadoTamanho: null,
      });
      onSuccessToast('PDF assinado removido deste laudo.');
      onClose();
    } catch (err: any) {
      setErro(err?.message || 'Erro ao remover o PDF anexado.');
    } finally {
      setSalvando(false);
    }
  };

  const handleDownloadExistente = async () => {
    if (!laudoExistente?.laudoAssinadoPdfUrl) return;
    const url = laudoExistente.laudoAssinadoPdfUrl;
    const fileName = laudoExistente.laudoAssinadoPdfNome || `${laudoExistente.numero}-assinado.pdf`;
    if (url.startsWith('idb://')) {
      const { resolverUrlPdfVisualizacao } = await import('../../lib/pdfStorage');
      try {
        const resolved = await resolverUrlPdfVisualizacao(url, laudoExistente.id);
        const a = document.createElement('a');
        a.href = resolved.src;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(resolved.src), 1500);
      } catch (err: any) {
        setErro(err?.message || 'Não foi possível baixar o PDF local.');
      }
      return;
    }
    const downloadUrl = url.includes('/api/')
      ? `${url}${url.includes('?') ? '&' : '?'}download=1&nome=${encodeURIComponent(fileName)}`
      : url;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(5,14,28,0.72)] backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-pdf-assinado-titulo"
      onClick={(e) => {
        if (e.target === e.currentTarget && !salvando) onClose();
      }}
    >
      <div className="bg-[var(--card)] text-[var(--ink)] border-[1.5px] border-[var(--line)] rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 sm:p-7 space-y-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--line)]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--blue)]/10 text-[var(--blue)]">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-pdf-assinado-titulo" className="text-[20px] font-bold leading-snug">
                {isEditingExisting
                  ? `Anexar PDF Assinado · ${laudoExistente?.numero}`
                  : 'Anexar Laudo Finalizado e Assinado (PDF)'}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--muted)] mt-0.5">
                {isEditingExisting
                  ? 'Envie ou substitua a versão final assinada em PDF vinculada a este laudo.'
                  : 'Registre diretamente na Central um laudo que já foi finalizado e assinado fora do editor.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={salvando}
            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isEditingExisting && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <label className="block text-sm font-semibold">
                  <span className="mb-1 block">Cliente Contratante *</span>
                  <select
                    value={clienteId}
                    onChange={(e) => {
                      const nextCid = e.target.value;
                      setClienteId(nextCid);
                      const firstAtv = ativos.find(a => a.clienteId === nextCid)?.id || '';
                      setAtivoId(firstAtv);
                    }}
                    className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] font-medium"
                    required
                  >
                    <option value="">Selecione o cliente...</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nomeFantasia || c.razaoSocial}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm font-semibold">
                  <span className="mb-1 block">Equipamento / Ativo (opcional)</span>
                  <select
                    value={ativoId}
                    onChange={(e) => setAtivoId(e.target.value)}
                    className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] font-medium"
                  >
                    <option value="">Não vincular ativo específico</option>
                    {ativosDoCliente.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.identificacao} {a.tipo ? `(${a.tipo})` : ''}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <label className="block text-sm font-semibold">
                  <span className="mb-1 block">Número do Laudo *</span>
                  <input
                    type="text"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    placeholder="Ex: VL-2026-001"
                    className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] font-mono"
                    required
                  />
                </label>

                <label className="block text-sm font-semibold">
                  <span className="mb-1 block">Data da Vistoria / Emissão</span>
                  <input
                    type="date"
                    value={dataInspecao}
                    onChange={(e) => setDataInspecao(e.target.value)}
                    className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
                  />
                </label>
              </div>

              <label className="block text-sm font-semibold">
                <span className="mb-1 block">Título / Tipo do Laudo *</span>
                <input
                  type="text"
                  list="vl-modelos-laudo-assinado"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  placeholder="Ex: Laudo Técnico NR-12 · Prensa Hidráulica"
                  className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
                  required
                />
                <datalist id="vl-modelos-laudo-assinado">
                  {SERVICOS_LISTA.flatMap((s) =>
                    s.subtipos.map((sub) => (
                      <option key={sub.id} value={sub.nome} />
                    ))
                  )}
                </datalist>
              </label>
            </>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-end">
            <label className="block text-sm font-semibold">
              <span className="mb-1 block">Número da ART (CREA-PE)</span>
              <input
                type="text"
                value={artNumero}
                onChange={(e) => setArtNumero(e.target.value)}
                placeholder="Ex: PE20260012345 (opcional)"
                className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] font-mono"
              />
            </label>

            {isEditingExisting && laudoExistente && laudoExistente.status !== 'finalizado' && (
              <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-[var(--line)] bg-[var(--paper)] cursor-pointer text-sm font-medium">
                <input
                  type="checkbox"
                  checked={marcarFinalizado}
                  onChange={(e) => setMarcarFinalizado(e.target.checked)}
                  className="w-4 h-4 accent-[var(--blue)]"
                />
                <span>Marcar laudo como finalizado (ART emitida)</span>
              </label>
            )}
          </div>

          {isEditingExisting && laudoExistente?.laudoAssinadoPdfUrl && !arquivoSelecionado && (
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileCheck2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {laudoExistente.laudoAssinadoPdfNome || 'laudo-assinado.pdf'}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    Anexado em{' '}
                    {laudoExistente.laudoAssinadoEm
                      ? new Date(laudoExistente.laudoAssinadoEm).toLocaleDateString('pt-BR')
                      : 'data registrada'}
                    {laudoExistente.laudoAssinadoTamanho
                      ? ` · ${formatBytes(laudoExistente.laudoAssinadoTamanho)}`
                      : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadExistente}
                  className="btn-tech sm text-xs py-1.5 px-2.5 inline-flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemoverPdfExistente}
                  disabled={salvando}
                  className="btn-tech sm text-xs py-1.5 px-2.5 text-rose-500 hover:text-rose-700 hover:border-rose-300 inline-flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remover PDF</span>
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <span className="block text-sm font-semibold">
              {isEditingExisting && laudoExistente?.laudoAssinadoPdfUrl
                ? 'Substituir arquivo PDF assinado'
                : 'Arquivo PDF do Laudo Finalizado e Assinado *'}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={salvando}
              className="w-full p-5 rounded-xl border-2 border-dashed border-[var(--line)] hover:border-[var(--blue)] bg-[var(--paper)] transition-colors flex flex-col items-center justify-center gap-2 text-center cursor-pointer"
            >
              <Upload className="w-6 h-6 text-[var(--blue)]" />
              {arquivoSelecionado ? (
                <>
                  <span className="text-sm font-bold text-[var(--ink)] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {arquivoSelecionado.name}
                  </span>
                  <span className="text-xs text-[var(--muted)]">
                    {formatBytes(arquivoSelecionado.size)} · Clique para escolher outro PDF
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sm font-semibold text-[var(--ink)]">
                    Clique para selecionar o PDF assinado
                  </span>
                  <span className="text-xs text-[var(--muted)]">
                    Apenas arquivos .pdf (máx. 30 MB) · Assinatura digital gov.br, ICP-Brasil ou escaneado
                  </span>
                </>
              )}
            </button>
          </div>

          {erro && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs sm:text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between gap-3 flex-wrap">
            {isEditingExisting && laudoExistente?.laudoAssinadoPdfUrl ? (
              <span className="text-xs text-[var(--muted)] inline-flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5" />
                Você também pode visualizar o PDF na tabela da Central.
              </span>
            ) : (
              <span className="text-xs text-[var(--muted)]">
                O PDF fica armazenado com segurança e disponível para download e publicação.
              </span>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={salvando}
                className="btn-tech text-sm px-4 py-2"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="btn-tech pri text-sm px-4 py-2 inline-flex items-center gap-2"
              >
                {salvando && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>
                  {salvando
                    ? (progressoEnvio || 'Enviando PDF...')
                    : isEditingExisting
                      ? 'Salvar PDF assinado'
                      : 'Salvar laudo assinado'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
