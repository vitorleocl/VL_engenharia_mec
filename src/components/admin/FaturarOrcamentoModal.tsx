import React, { useState, useRef } from 'react';
import {
  X,
  Calendar,
  Upload,
  FileText,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
  Eye,
  Download,
  AlertCircle,
  Loader2,
  Receipt,
} from 'lucide-react';
import { Orcamento } from '../../types';
import { FaturamentoDadosExtras } from '../../context/DataContext';
import { redimensionarImagemArquivo } from '../../lib/imageUtils';
import {
  getHojeLocalYmd,
  toDateInputValue,
  formatarMesLongoDeYm,
  formatarDataBrSegura,
} from '../../lib/dateUtils';

interface FaturarOrcamentoModalProps {
  orcamento: Orcamento;
  modoEdicao?: boolean;
  onClose: () => void;
  onConfirm: (dados: FaturamentoDadosExtras) => void;
}

export const FaturarOrcamentoModal: React.FC<FaturarOrcamentoModalProps> = ({
  orcamento,
  modoEdicao = false,
  onClose,
  onConfirm,
}) => {
  const hoje = getHojeLocalYmd();

  const [dataFaturamento, setDataFaturamento] = useState<string>(
    toDateInputValue(orcamento.faturadoEm) || hoje
  );
  const [dataInicioServico, setDataInicioServico] = useState<string>(
    toDateInputValue(
      orcamento.dataInicioServico ||
        orcamento.aprovadoEm ||
        orcamento.emitidaEm ||
        orcamento.criadoEm
    )
  );
  const [dataEntregaServico, setDataEntregaServico] = useState<string>(
    toDateInputValue(orcamento.dataEntregaServico || orcamento.faturadoEm) || hoje
  );

  const [comprovanteUrl, setComprovanteUrl] = useState<string>(
    orcamento.comprovantePagamentoUrl || ''
  );
  const [comprovanteNome, setComprovanteNome] = useState<string>(
    orcamento.comprovantePagamentoNome || ''
  );
  const [comprovanteTipo, setComprovanteTipo] = useState<'imagem' | 'pdf'>(
    orcamento.comprovantePagamentoTipo || 'imagem'
  );

  const [processandoArquivo, setProcessandoArquivo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [previewComprovanteAberto, setPreviewComprovanteAberto] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const valorFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(orcamento.valor || 0);

  const mesDestinoLabel = dataFaturamento
    ? formatarMesLongoDeYm(dataFaturamento)
    : '';

  const handleSelecionarArquivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErro(null);

    const isPdf =
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/');

    if (!isPdf && !isImage) {
      setErro('Envie um arquivo de imagem (PNG, JPG, WEBP) ou PDF.');
      e.target.value = '';
      return;
    }

    setProcessandoArquivo(true);
    try {
      if (isImage) {
        const resizedDataUrl = await redimensionarImagemArquivo(file, 1400, 1400, 0.82);
        setComprovanteUrl(resizedDataUrl);
        setComprovanteNome(file.name);
        setComprovanteTipo('imagem');
      } else {
        if (file.size > 680 * 1024) {
          setErro(
            'O PDF excede 680 KB (limite de armazenamento por registro). Compacte o PDF ou anexe uma imagem/print do comprovante.'
          );
          return;
        }
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onerror = () => reject(new Error('Falha ao ler o PDF selecionado.'));
          reader.onload = () => resolve(String(reader.result || ''));
          reader.readAsDataURL(file);
        });
        setComprovanteUrl(dataUrl);
        setComprovanteNome(file.name);
        setComprovanteTipo('pdf');
      }
    } catch (err) {
      setErro(
        err instanceof Error
          ? err.message
          : 'Não foi possível processar o arquivo selecionado.'
      );
    } finally {
      setProcessandoArquivo(false);
      e.target.value = '';
    }
  };

  const handleRemoverComprovante = () => {
    setComprovanteUrl('');
    setComprovanteNome('');
    setErro(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!dataFaturamento) {
      setErro('Informe a data do faturamento para registrar o mês correto.');
      return;
    }

    if (
      dataInicioServico &&
      dataEntregaServico &&
      dataEntregaServico < dataInicioServico
    ) {
      setErro(
        'A data de entrega/finalização deve ser igual ou posterior à data de início do serviço.'
      );
      return;
    }

    onConfirm({
      faturadoEm: dataFaturamento,
      dataInicioServico: dataInicioServico || null,
      dataEntregaServico: dataEntregaServico || null,
      comprovantePagamentoUrl: comprovanteUrl || null,
      comprovantePagamentoNome: comprovanteUrl ? comprovanteNome || 'Comprovante' : null,
      comprovantePagamentoTipo: comprovanteUrl ? comprovanteTipo : null,
    });
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[rgba(5,14,28,0.75)] backdrop-blur-xs overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal-faturamento"
        onClick={onClose}
      >
        <div
          className="bg-[var(--card)] text-[var(--ink)] border-[1.5px] border-[var(--line)] rounded-2xl w-full max-w-lg p-5 sm:p-6 space-y-4 shadow-2xl my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cabeçalho */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--line)]">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-sky-500/12 border border-sky-500/30 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h2
                  id="titulo-modal-faturamento"
                  className="text-[18px] font-bold text-[var(--ink)]"
                >
                  {modoEdicao ? 'Editar Dados do Faturamento' : 'Registrar Faturamento'}
                </h2>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Informe a data de faturamento, o período do serviço e anexe o comprovante se desejar.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] transition-colors cursor-pointer"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Resumo do Orçamento */}
          <div className="p-3.5 rounded-xl bg-[var(--paper)] border border-[var(--line)] space-y-1">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-mono font-bold text-[var(--blue)]">
                {orcamento.codigoProposta || orcamento.id}
              </span>
              <span className="font-mono font-extrabold text-sm text-emerald-600 dark:text-emerald-400 tabular-nums">
                {valorFormatado}
              </span>
            </div>
            <div className="text-sm font-bold text-[var(--ink)] leading-snug">
              {orcamento.servico}
            </div>
            <div className="text-xs text-[var(--muted)]">
              {orcamento.clienteNome || 'Cliente'}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Data do Faturamento (define o mês na aba Faturamento) */}
            <div className="p-3.5 rounded-xl bg-[var(--paper)] border border-[var(--line)] space-y-2">
              <label className="block text-xs font-bold text-[var(--ink)]">
                <span className="flex items-center gap-1.5 mb-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[var(--blue)]" />
                  <span>Data do Faturamento *</span>
                </span>
                <input
                  type="date"
                  required
                  value={dataFaturamento}
                  onChange={(e) => setDataFaturamento(e.target.value)}
                  className="w-full p-2.5 text-sm font-mono font-semibold border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                />
              </label>
              {mesDestinoLabel && (
                <p className="text-[11.5px] text-[var(--blue)] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Será contabilizado em Faturamentos no mês de <strong>{mesDestinoLabel}</strong>
                  </span>
                </p>
              )}
            </div>

            {/* Período de execução do serviço: Início até Entrega/Finalização */}
            <div className="p-3.5 rounded-xl bg-[var(--paper)] border border-[var(--line)] space-y-2.5">
              <div className="text-xs font-bold text-[var(--ink)]">
                Período do Serviço (Início até Entrega / Finalização)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block text-xs font-semibold text-[var(--muted)]">
                  <span className="mb-1 block">Data de início</span>
                  <input
                    type="date"
                    value={dataInicioServico}
                    onChange={(e) => setDataInicioServico(e.target.value)}
                    className="w-full p-2 text-sm font-mono border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                  />
                </label>
                <label className="block text-xs font-semibold text-[var(--muted)]">
                  <span className="mb-1 block">Data de entrega / finalização</span>
                  <input
                    type="date"
                    value={dataEntregaServico}
                    onChange={(e) => setDataEntregaServico(e.target.value)}
                    className="w-full p-2 text-sm font-mono border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                  />
                </label>
              </div>
              {(dataInicioServico || dataEntregaServico) && (
                <p className="text-[11px] text-[var(--muted)]">
                  Exibição no registro:{' '}
                  <strong className="text-[var(--ink)]">
                    {dataInicioServico ? formatarDataBrSegura(dataInicioServico) : '—'} até{' '}
                    {dataEntregaServico ? formatarDataBrSegura(dataEntregaServico) : '—'}
                  </strong>
                </p>
              )}
            </div>

            {/* Comprovante de Pagamento (Opcional) */}
            <div className="p-3.5 rounded-xl bg-[var(--paper)] border border-[var(--line)] space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[var(--ink)]">
                  Comprovante de pagamento <span className="text-[var(--muted)] font-normal">(opcional)</span>
                </span>
                <span className="text-[10.5px] text-[var(--muted)]">Imagem ou PDF</span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf,.png,.jpg,.jpeg,.webp,.pdf"
                onChange={handleSelecionarArquivo}
                className="hidden"
              />

              {!comprovanteUrl ? (
                <button
                  type="button"
                  disabled={processandoArquivo}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 rounded-xl border border-dashed border-[var(--line)] hover:border-[var(--blue)] bg-[var(--card)] text-xs font-semibold text-[var(--ink)] flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
                >
                  {processandoArquivo ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[var(--blue)]" />
                      <span>Processando arquivo...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-[var(--blue)]" />
                      <span>Anexar comprovante (PIX, TED, NF ou recibo)</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="p-2.5 rounded-xl border border-emerald-500/35 bg-emerald-500/8 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {comprovanteTipo === 'imagem' ? (
                      <img
                        src={comprovanteUrl}
                        alt="Prévia do comprovante"
                        className="w-10 h-10 rounded-lg object-cover border border-[var(--line)] shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[var(--ink)] truncate">
                        {comprovanteNome || 'Comprovante anexado'}
                      </div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                        {comprovanteTipo === 'imagem' ? (
                          <ImageIcon className="w-3 h-3" />
                        ) : (
                          <FileText className="w-3 h-3" />
                        )}
                        <span>{comprovanteTipo === 'imagem' ? 'Imagem anexada' : 'PDF anexado'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewComprovanteAberto(true)}
                      className="p-1.5 rounded-lg text-[var(--blue)] hover:bg-[var(--blue)]/10 transition-colors cursor-pointer"
                      title="Visualizar comprovante"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--card)] transition-colors cursor-pointer"
                      title="Substituir comprovante"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoverComprovante}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Remover comprovante"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {erro && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/35 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{erro}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={onClose}
                className="btn-tech text-sm cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={processandoArquivo}
                className="btn-tech pri text-sm px-5 font-bold cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-60"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{modoEdicao ? 'Salvar alterações' : 'Confirmar Faturamento'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {previewComprovanteAberto && comprovanteUrl && (
        <ComprovantePagamentoModal
          url={comprovanteUrl}
          nome={comprovanteNome || 'Comprovante de Pagamento'}
          tipo={comprovanteTipo}
          onClose={() => setPreviewComprovanteAberto(false)}
        />
      )}
    </>
  );
};

interface ComprovantePagamentoModalProps {
  url: string;
  nome?: string;
  tipo?: 'imagem' | 'pdf';
  onClose: () => void;
}

export const ComprovantePagamentoModal: React.FC<ComprovantePagamentoModalProps> = ({
  url,
  nome = 'Comprovante de Pagamento',
  tipo,
  onClose,
}) => {
  const isPdf =
    tipo === 'pdf' || url.startsWith('data:application/pdf') || nome.toLowerCase().endsWith('.pdf');

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-[rgba(5,14,28,0.82)] backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-comprovante-modal"
      onClick={onClose}
    >
      <div
        className="bg-[var(--card)] text-[var(--ink)] border-[1.5px] border-[var(--line)] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-[var(--line)]">
          <div className="flex items-center gap-2 min-w-0">
            <Receipt className="w-4 h-4 text-[var(--blue)] shrink-0" />
            <h3 id="titulo-comprovante-modal" className="text-sm font-bold truncate">
              {nome}
            </h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={url}
              download={nome}
              className="btn-tech sm text-xs py-1 px-2.5 inline-flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] transition-colors cursor-pointer"
              aria-label="Fechar comprovante"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 bg-[var(--paper)] flex items-center justify-center min-h-[320px]">
          {isPdf ? (
            <iframe
              src={url}
              title={nome}
              className="w-full h-[70vh] rounded-lg border border-[var(--line)] bg-white"
            />
          ) : (
            <img
              src={url}
              alt={nome}
              className="max-w-full max-h-[72vh] rounded-lg object-contain border border-[var(--line)] shadow-sm"
            />
          )}
        </div>
      </div>
    </div>
  );
};
