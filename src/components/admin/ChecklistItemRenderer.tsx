import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  MinusCircle,
  Camera,
  X,
  Gauge,
  AlertCircle,
  ShieldAlert,
  Sparkles,
  Layers,
} from 'lucide-react';
import {
  ChecklistCampoItem,
  ChecklistCampoItemStatus,
  TipoRespostaChecklist,
  ChecklistCriticidade,
} from '../../types';
import { redimensionarImagemArquivo } from '../../lib/imageUtils';

interface ChecklistItemRendererProps {
  item: ChecklistCampoItem;
  index: number;
  isExtra?: boolean;
  onStatusChange: (status: ChecklistCampoItemStatus) => void;
  onValorChange: (valor: string | number | null) => void;
  onObservacaoChange: (obs: string) => void;
  onCriticidadeChange?: (criticidade: ChecklistCriticidade) => void;
  onAcaoRecomendadaChange?: (acao: string) => void;
  onMedicaoChange?: (medicao: { valor?: string | number; unidade?: string; referencia?: string }) => void;
  onFotoUpload: (file: File | string, legenda?: string) => void;
  onRemoverFoto: (fotoIdOuIndex?: string | number) => void;
  onAtualizarLegendaFoto?: (fotoIdOuIndex: string | number, novaLegenda: string) => void;
  onRemoverItem?: () => void;
}

export const ChecklistItemRenderer: React.FC<ChecklistItemRendererProps> = ({
  item,
  index,
  isExtra = false,
  onStatusChange,
  onValorChange,
  onObservacaoChange,
  onCriticidadeChange,
  onAcaoRecomendadaChange,
  onMedicaoChange,
  onFotoUpload,
  onRemoverFoto,
  onAtualizarLegendaFoto,
  onRemoverItem,
}) => {
  const [legendaTemporaria, setLegendaTemporaria] = useState('');
  const [mostrarMedicaoOpcional, setMostrarMedicaoOpcional] = useState(
    Boolean(
      (item.medicao?.valorEncontrado !== undefined && item.medicao?.valorEncontrado !== '') ||
        item.tipoResposta === 'medida' ||
        item.tipoResposta === 'VALOR'
    )
  );
  const [comprimindoFoto, setComprimindoFoto] = useState(false);

  const tipo: TipoRespostaChecklist = item.tipoResposta || 'conformidade';
  const isMedida = tipo === 'medida' || tipo === 'VALOR';

  const valorAtual =
    item.valor !== undefined && item.valor !== null ? item.valor : item.valorResposta || '';

  const statusAtual = item.status;
  const isNaoConforme = statusAtual === 'nao_conforme';
  const isConforme = statusAtual === 'conforme';
  const isNaoAplicavel = statusAtual === 'nao_aplicavel';
  const isPendente = !statusAtual || statusAtual === 'pendente';

  const obsVazia = !item.observacao || item.observacao.trim() === '';
  const obsPendenteNC = isNaoConforme && obsVazia;

  const fotosLista: { id: string; url: string; legenda?: string }[] =
    item.fotos && item.fotos.length > 0
      ? item.fotos.map((f) => ({ id: f.id, url: f.url, legenda: f.legenda || f.titulo }))
      : item.fotosVinculadas && item.fotosVinculadas.length > 0
      ? item.fotosVinculadas.map((f) => ({ id: f.id, url: f.url, legenda: f.descricao }))
      : item.fotosUrls && item.fotosUrls.length > 0
      ? item.fotosUrls.map((url, i) => ({ id: `foto-${i}`, url, legenda: `Foto ${i + 1}` }))
      : item.fotoUrl
      ? [{ id: 'foto-0', url: item.fotoUrl, legenda: item.fotoNome || 'Foto da vistoria' }]
      : [];

  const temFoto = fotosLista.length > 0;
  const temFotoObrigatoria = Boolean(item.fotoObrigatoria || item.obrigatorioFoto);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setComprimindoFoto(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          // B6: Compressão client-side: máx 1600 px no lado maior, JPEG qualidade 80%
          const fotoComprimida = await redimensionarImagemArquivo(file, 1600, 1600, 0.8);
          onFotoUpload(
            fotoComprimida,
            legendaTemporaria.trim() || `Item ${item.numero || index + 1} — Evidência`
          );
        } catch (err) {
          console.warn('Erro ao comprimir imagem, enviando arquivo original:', err);
          onFotoUpload(file, legendaTemporaria.trim());
        }
      }
      setLegendaTemporaria('');
    } finally {
      setComprimindoFoto(false);
      e.target.value = '';
    }
  };

  const sugerirAcaoPadrao = () => {
    if (!onAcaoRecomendadaChange) return;
    const ref = item.criterioReferencia ? ` conforme ${item.criterioReferencia}` : '';
    onAcaoRecomendadaChange(
      `Corrigir/adequar "${item.descricao.slice(0, 70)}${item.descricao.length > 70 ? '...' : ''}"${ref} e enviar evidência para validação técnica.`
    );
  };

  return (
    <div
      id={`chk-item-${item.id}`}
      className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
        obsPendenteNC
          ? 'bg-rose-500/10 border-rose-500/80 ring-2 ring-rose-500/25'
          : isNaoConforme
          ? 'bg-rose-500/5 border-rose-500/50'
          : isConforme
          ? 'bg-emerald-500/5 border-emerald-500/45'
          : isNaoAplicavel
          ? 'bg-[var(--adm-bg)] border-[var(--adm-line)] opacity-90'
          : 'bg-[var(--adm-card)] border-[var(--adm-line)]'
      }`}
    >
      {/* Cabeçalho do Item */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <span
            className={`min-w-[34px] h-8 px-1.5 rounded-xl font-mono text-xs flex items-center justify-center font-extrabold shrink-0 mt-0.5 border ${
              isExtra
                ? 'bg-purple-500/15 text-purple-400 border-purple-500/40'
                : isConforme
                ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/40'
                : isNaoConforme
                ? 'bg-rose-500/15 text-rose-500 border-rose-500/40'
                : 'bg-[var(--adm-bg)] text-[var(--adm-text)] border-[var(--adm-line)]'
            }`}
          >
            {isExtra ? `E${index + 1}` : item.numero || index + 1}
          </span>

          <div className="flex-1 min-w-0">
            {/* Badges de Norma, Seção do Laudo e Status */}
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              {item.criterioReferencia && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-[var(--adm-blue,#2160db)]/15 text-[var(--adm-blue-soft,#6ea1ff)] border border-[var(--adm-blue,#2160db)]/30">
                  Norma: <strong>{item.criterioReferencia}</strong>
                </span>
              )}

              {item.secaoLaudo && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-[var(--adm-bg)] text-[var(--adm-mut)] border border-[var(--adm-line)]">
                  <Layers className="w-3 h-3 opacity-75" />
                  Laudo: {item.secaoLaudo}
                </span>
              )}

              {isPendente && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/35">
                  <AlertCircle className="w-3 h-3" />
                  Sem resposta
                </span>
              )}

              {temFotoObrigatoria && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-bold border ${
                    temFoto
                      ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/35'
                      : 'bg-amber-500/15 text-amber-500 border-amber-500/35'
                  }`}
                >
                  <Camera className="w-3 h-3" />
                  {temFoto ? 'Foto Anexada' : 'Foto Obrigatória'}
                </span>
              )}

              {isExtra && onRemoverItem && (
                <button
                  type="button"
                  onClick={onRemoverItem}
                  className="text-rose-500 hover:text-rose-400 text-[11px] font-bold ml-auto flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Excluir
                </button>
              )}
            </div>

            <p className="text-sm font-semibold text-[var(--adm-text)] leading-snug">
              {item.descricao}
            </p>
          </div>
        </div>

        {/* B1: 3 BOTÕES GRANDES DE STATUS (ALTURA >= 48px, ÍCONE + TEXTO, SEM ESTADO INICIAL MARCADO) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
          <button
            type="button"
            onClick={() => onStatusChange('conforme')}
            aria-pressed={isConforme}
            className={`min-h-[48px] py-2.5 px-2.5 sm:px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isConforme
                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/60'
                : 'bg-[var(--adm-bg)] hover:border-emerald-500/60 text-[var(--adm-text)] border border-[var(--adm-line)]'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${isConforme ? 'text-white' : 'text-emerald-500'}`} />
            <span>Conforme</span>
          </button>

          <button
            type="button"
            onClick={() => onStatusChange('nao_conforme')}
            aria-pressed={isNaoConforme}
            className={`min-h-[48px] py-2.5 px-2.5 sm:px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isNaoConforme
                ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400/60'
                : 'bg-[var(--adm-bg)] hover:border-rose-500/60 text-[var(--adm-text)] border border-[var(--adm-line)]'
            }`}
          >
            <AlertTriangle className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${isNaoConforme ? 'text-white' : 'text-rose-500'}`} />
            <span>Não conforme</span>
          </button>

          <button
            type="button"
            onClick={() => onStatusChange('nao_aplicavel')}
            aria-pressed={isNaoAplicavel}
            className={`min-h-[48px] py-2.5 px-2.5 sm:px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isNaoAplicavel
                ? 'bg-slate-600 text-white shadow-sm ring-2 ring-slate-400/60'
                : 'bg-[var(--adm-bg)] hover:border-slate-400 text-[var(--adm-text)] border border-[var(--adm-line)]'
            }`}
          >
            <MinusCircle className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${isNaoAplicavel ? 'text-white' : 'text-[var(--adm-mut)]'}`} />
            <span>N.A.</span>
          </button>
        </div>
      </div>

      {/* B2: BLOCO QUANDO NÃO CONFORME (RISCO + AÇÃO RECOMENDADA SUGERIDA) */}
      {isNaoConforme && (
        <div className="mt-3.5 p-3.5 rounded-xl border border-rose-500/40 bg-rose-500/10 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Risco & Ação Corretiva</span>
            </span>
            {onAcaoRecomendadaChange && !(item.acaoRecomendada || item.naoConformidade?.recomendacao) && (
              <button
                type="button"
                onClick={sugerirAcaoPadrao}
                className="text-[11px] font-bold text-[var(--adm-blue-soft,#6ea1ff)] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                Sugerir ação padrão
              </button>
            )}
          </div>

          {/* Classificação de Risco */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-[var(--adm-mut)] block">
              Classificação de Risco:
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'baixa', label: 'Baixo', corOn: 'bg-emerald-600 text-white border-emerald-500' },
                { id: 'media', label: 'Médio', corOn: 'bg-amber-600 text-white border-amber-500' },
                { id: 'alta', label: 'Alto', corOn: 'bg-orange-600 text-white border-orange-500' },
                { id: 'critica', label: 'Crítico', corOn: 'bg-rose-700 text-white border-rose-500' },
              ].map((crit) => {
                const ativo = (item.criticidade || item.naoConformidade?.criticidade || 'media') === crit.id;
                return (
                  <button
                    key={crit.id}
                    type="button"
                    onClick={() => onCriticidadeChange && onCriticidadeChange(crit.id as ChecklistCriticidade)}
                    className={`min-h-[38px] py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      ativo
                        ? crit.corOn
                        : 'bg-[var(--adm-card)] border-[var(--adm-line)] text-[var(--adm-text)] hover:border-rose-400/60'
                    }`}
                  >
                    {crit.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ação Recomendada Sugerida */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[var(--adm-mut)] block">
              Ação recomendada sugerida:
            </label>
            <input
              type="text"
              value={item.acaoRecomendada || item.naoConformidade?.recomendacao || ''}
              onChange={(e) => onAcaoRecomendadaChange && onAcaoRecomendadaChange(e.target.value)}
              placeholder="Ex: Substituir trava de segurança do gancho e realizar ensaio de carga..."
              className="w-full px-3 py-2 rounded-xl border border-[var(--adm-line)] bg-[var(--adm-card)] text-xs text-[var(--adm-text)] placeholder:text-[var(--adm-mut)] focus:outline-none focus:border-rose-400"
            />
          </div>
        </div>
      )}

      {/* B2: MEDIÇÃO OPCIONAL (VALOR + UNIDADE + REFERÊNCIA) */}
      {(mostrarMedicaoOpcional || isMedida) && (
        <div className="mt-3.5 p-3 rounded-xl border border-[var(--adm-blue,#2160db)]/35 bg-[var(--adm-blue,#2160db)]/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--adm-text)]">
            <span className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-[var(--adm-blue-soft,#6ea1ff)]" />
              Medição em Campo
            </span>
            {!isMedida && (
              <button
                type="button"
                onClick={() => setMostrarMedicaoOpcional(false)}
                className="text-[11px] text-[var(--adm-mut)] hover:text-[var(--adm-text)] cursor-pointer"
              >
                Ocultar
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="text-[10.5px] font-semibold text-[var(--adm-mut)] block mb-1">Valor medido:</label>
              <input
                type="text"
                inputMode="decimal"
                value={
                  item.medicao?.valorEncontrado !== undefined
                    ? item.medicao.valorEncontrado
                    : valorAtual
                }
                onChange={(e) => {
                  const val = e.target.value;
                  onValorChange(val);
                  if (onMedicaoChange) {
                    onMedicaoChange({
                      valor: val,
                      unidade: item.medicao?.unidade || item.unidade || '',
                      referencia: item.medicao?.tolerancia || item.criterioReferencia || '',
                    });
                  }
                }}
                placeholder="Ex: 2,4"
                className="w-full px-2.5 py-2 rounded-lg border border-[var(--adm-line)] bg-[var(--adm-card)] text-xs font-mono font-bold text-[var(--adm-text)] focus:outline-none focus:border-[var(--adm-blue-soft)]"
              />
            </div>

            <div>
              <label className="text-[10.5px] font-semibold text-[var(--adm-mut)] block mb-1">Unidade:</label>
              <input
                type="text"
                value={item.medicao?.unidade || item.unidade || ''}
                onChange={(e) => {
                  if (onMedicaoChange) {
                    onMedicaoChange({
                      valor: item.medicao?.valorEncontrado ?? valorAtual,
                      unidade: e.target.value,
                      referencia: item.medicao?.tolerancia || item.criterioReferencia || '',
                    });
                  }
                }}
                placeholder="Ex: mm, bar, mm/s"
                className="w-full px-2.5 py-2 rounded-lg border border-[var(--adm-line)] bg-[var(--adm-card)] text-xs font-mono text-[var(--adm-text)] focus:outline-none focus:border-[var(--adm-blue-soft)]"
              />
            </div>

            <div>
              <label className="text-[10.5px] font-semibold text-[var(--adm-mut)] block mb-1">Valor de referência:</label>
              <input
                type="text"
                value={item.medicao?.tolerancia || item.criterioReferencia || ''}
                onChange={(e) => {
                  if (onMedicaoChange) {
                    onMedicaoChange({
                      valor: item.medicao?.valorEncontrado ?? valorAtual,
                      unidade: item.medicao?.unidade || item.unidade || '',
                      referencia: e.target.value,
                    });
                  }
                }}
                placeholder="Ex: ≤ 4,5 mm/s"
                className="w-full px-2.5 py-2 rounded-lg border border-[var(--adm-line)] bg-[var(--adm-card)] text-xs text-[var(--adm-text)] focus:outline-none focus:border-[var(--adm-blue-soft)]"
              />
            </div>
          </div>
        </div>
      )}

      {/* B2: OBSERVAÇÃO TÉCNICA (OBRIGATÓRIA QUANDO NÃO CONFORME) */}
      <div className="mt-3.5 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-[var(--adm-text)] flex items-center gap-1.5">
            <span>Observação</span>
            {isNaoConforme && (
              <span className="text-rose-500 font-bold text-[11px]">* Obrigatória (Não conforme)</span>
            )}
          </label>
          {!mostrarMedicaoOpcional && !isMedida && (
            <button
              type="button"
              onClick={() => setMostrarMedicaoOpcional(true)}
              className="text-[11px] text-[var(--adm-blue-soft,#6ea1ff)] hover:underline font-semibold cursor-pointer"
            >
              + Medição
            </button>
          )}
        </div>

        <input
          type="text"
          placeholder={
            isNaoConforme
              ? 'Descreva a não conformidade constatada em campo (obrigatório)...'
              : 'Observação técnica ou condição operacional (opcional)...'
          }
          value={item.observacao || ''}
          onChange={(e) => onObservacaoChange(e.target.value)}
          className={`w-full text-xs rounded-xl px-3 py-2.5 text-[var(--adm-text)] placeholder:text-[var(--adm-mut)] focus:outline-none ${
            obsPendenteNC
              ? 'bg-rose-500/10 border-2 border-rose-500'
              : 'bg-[var(--adm-bg)] border border-[var(--adm-line)] focus:border-[var(--adm-blue-soft)]'
          }`}
        />

        {obsPendenteNC && (
          <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>Preencha a observação deste item Não conforme para concluir a vistoria.</span>
          </p>
        )}
      </div>

      {/* B2: MÚLTIPLAS FOTOS COM CÂMERA DO CELULAR E LEGENDA CURTA */}
      <div className="mt-3.5 pt-3 border-t border-[var(--adm-line)] space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-semibold text-[var(--adm-mut)] flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-[var(--adm-blue-soft,#6ea1ff)]" />
            <span>Fotos do item ({fotosLista.length})</span>
          </span>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={legendaTemporaria}
              onChange={(e) => setLegendaTemporaria(e.target.value)}
              placeholder="Legenda curta (opcional)..."
              className="px-2.5 py-2 text-xs rounded-xl border border-[var(--adm-line)] bg-[var(--adm-bg)] text-[var(--adm-text)] placeholder:text-[var(--adm-mut)] sm:w-48 focus:outline-none focus:border-[var(--adm-blue-soft)]"
            />

            <label className="min-h-[42px] px-3.5 py-2 rounded-xl bg-[var(--adm-blue,#2160db)] hover:brightness-110 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition">
              <Camera className="w-4 h-4" />
              <span>{comprimindoFoto ? 'Comprimindo...' : 'Foto / Câmera'}</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={handleFileChange}
                className="hidden"
                disabled={comprimindoFoto}
              />
            </label>
          </div>
        </div>

        {fotosLista.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {fotosLista.map((foto, fIdx) => (
              <div
                key={foto.id ? `${foto.id}-${fIdx}` : `foto-${fIdx}`}
                className="p-2 bg-[var(--adm-bg)] rounded-xl border border-[var(--adm-line)] flex items-start gap-2.5"
              >
                <img
                  src={foto.url}
                  alt={foto.legenda || `Foto ${fIdx + 1}`}
                  className="w-14 h-14 object-cover rounded-lg border border-[var(--adm-line)] shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <input
                    type="text"
                    value={foto.legenda || ''}
                    onChange={(e) =>
                      onAtualizarLegendaFoto && onAtualizarLegendaFoto(foto.id || fIdx, e.target.value)
                    }
                    placeholder="Legenda da foto..."
                    className="w-full text-[11px] font-medium bg-[var(--adm-card)] border border-[var(--adm-line)] rounded-lg px-2 py-1 text-[var(--adm-text)] focus:outline-none focus:border-[var(--adm-blue-soft)]"
                  />
                  <span className="block text-[10px] text-[var(--adm-mut)] font-mono">
                    Foto #{fIdx + 1}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoverFoto(foto.id || fIdx)}
                  className="p-1.5 rounded-lg text-[var(--adm-mut)] hover:text-rose-500 cursor-pointer"
                  title="Remover foto"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
