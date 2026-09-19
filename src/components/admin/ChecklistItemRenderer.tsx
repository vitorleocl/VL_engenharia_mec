import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  MinusCircle, 
  Camera, 
  X, 
  Gauge, 
  ListFilter, 
  Calendar, 
  FileText, 
  Check, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { ChecklistCampoItem, ChecklistCampoItemStatus, TipoRespostaChecklist } from '../../types';

interface ChecklistItemRendererProps {
  item: ChecklistCampoItem;
  index: number;
  isExtra?: boolean;
  onStatusChange: (status: ChecklistCampoItemStatus) => void;
  onValorChange: (valor: string | number | null) => void;
  onObservacaoChange: (obs: string) => void;
  onFotoUpload: (file: File) => void;
  onRemoverFoto: () => void;
  onRemoverItem?: () => void;
}

export const ChecklistItemRenderer: React.FC<ChecklistItemRendererProps> = ({
  item,
  index,
  isExtra = false,
  onStatusChange,
  onValorChange,
  onObservacaoChange,
  onFotoUpload,
  onRemoverFoto,
  onRemoverItem,
}) => {
  // Normalizar tipo de resposta
  const tipo: TipoRespostaChecklist = item.tipoResposta || (item.campo ? 'conformidade' : 'conformidade');
  
  const isConformidade = tipo === 'conformidade' || tipo === 'C_NC_NA';
  const isMedida = tipo === 'medida' || tipo === 'VALOR';
  const isInformacao = tipo === 'informacao';
  const isSimNao = tipo === 'sim_nao';
  const isMultiplaEscolha = tipo === 'multipla_escolha' || tipo === 'SELECAO';
  const isData = tipo === 'data';

  // Obter valor atual
  const valorAtual = item.valor !== undefined && item.valor !== null ? item.valor : (item.valorResposta || '');

  // Validação de faixa para tipo 'medida'
  const numValor = typeof valorAtual === 'number' ? valorAtual : (valorAtual !== '' ? Number(valorAtual) : NaN);
  const foraDaFaixa = !isNaN(numValor) && (
    (item.valorMinimo !== undefined && numValor < item.valorMinimo) ||
    (item.valorMaximo !== undefined && numValor > item.valorMaximo)
  );

  // Verificação de foto obrigatória
  const temFotoObrigatoria = Boolean(item.fotoObrigatoria || item.obrigatorioFoto);
  const temFoto = Boolean(item.fotoUrl || (item.fotosUrls && item.fotosUrls.length > 0));
  const fotoPendente = temFotoObrigatoria && !temFoto;
  const fotoPendenteSeNC = Boolean(item.exigeFotoSeNaoConforme && item.status === 'nao_conforme' && !temFoto);

  return (
    <div
      id={`chk-item-${item.id}`}
      className={`p-4 rounded-xl border transition-all ${
        fotoPendente
          ? 'bg-amber-50/40 border-amber-300 ring-1 ring-amber-200'
          : item.status === 'nao_conforme'
          ? 'bg-rose-50/40 border-rose-200 shadow-xs'
          : foraDaFaixa
          ? 'bg-orange-50/40 border-orange-300'
          : item.status === 'conforme'
          ? 'bg-white border-slate-200 hover:border-slate-300'
          : 'bg-slate-50/70 border-slate-200'
      }`}
    >
      {/* Cabeçalho do Item */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2.5">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <span className={`w-6 h-6 rounded-full font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5 ${
            isExtra ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
          }`}>
            {isExtra ? `E${index + 1}` : index + 1}
          </span>

          <div className="flex-1 min-w-0">
            {/* Badges de Tipo e Metadados */}
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              {isConformidade && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  <Check className="w-3 h-3 text-slate-500" />
                  Conformidade (C / NC / NA)
                </span>
              )}

              {isMedida && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                  <Gauge className="w-3 h-3 text-sky-600" />
                  Medição ({item.unidade || 'valor numérico'})
                  {(item.valorMinimo !== undefined || item.valorMaximo !== undefined) && (
                    <span className="text-[9px] text-sky-700 opacity-90">
                      [faixa: {item.valorMinimo ?? '-∞'} a {item.valorMaximo ?? '+∞'} {item.unidade || ''}]
                    </span>
                  )}
                </span>
              )}

              {isInformacao && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                  <FileText className="w-3 h-3 text-indigo-600" />
                  Dado Informativo / Texto
                </span>
              )}

              {isSimNao && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                  <HelpCircle className="w-3 h-3 text-teal-600" />
                  Confirmação (Sim / Não)
                </span>
              )}

              {isMultiplaEscolha && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                  <ListFilter className="w-3 h-3 text-purple-600" />
                  Múltipla Escolha
                </span>
              )}

              {isData && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                  <Calendar className="w-3 h-3 text-blue-600" />
                  Registro de Data
                </span>
              )}

              {item.criterioReferencia && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
                  Critério: <strong>{item.criterioReferencia}</strong>
                </span>
              )}

              {temFotoObrigatoria && (
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                  temFoto ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                }`}>
                  <Camera className="w-3 h-3 text-amber-700" />
                  {temFoto ? 'Foto Anexada ✓' : 'Foto Obrigatória *'}
                </span>
              )}

              {isExtra && onRemoverItem && (
                <button
                  type="button"
                  onClick={onRemoverItem}
                  className="text-rose-600 hover:text-rose-800 text-[10px] font-semibold ml-auto flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Excluir
                </button>
              )}
            </div>

            {/* Descrição do Item */}
            <p className="text-xs font-semibold text-slate-800 leading-relaxed">
              {item.descricao}
            </p>
          </div>
        </div>

        {/* Status de Aprovação Rápida (para conformidade ou verificação geral) */}
        {isConformidade && (
          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => onStatusChange('conforme')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                item.status === 'conforme'
                  ? 'bg-emerald-600 text-white shadow-xs scale-102 ring-1 ring-emerald-400'
                  : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Conforme
            </button>

            <button
              type="button"
              onClick={() => onStatusChange('nao_conforme')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                item.status === 'nao_conforme'
                  ? 'bg-rose-600 text-white shadow-xs scale-102 ring-2 ring-rose-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Não Conforme
            </button>

            <button
              type="button"
              onClick={() => onStatusChange('nao_aplicavel')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                item.status === 'nao_aplicavel'
                  ? 'bg-slate-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              <MinusCircle className="w-3.5 h-3.5" />
              N/A
            </button>
          </div>
        )}
      </div>

      {/* RENDERIZAÇÃO ESPECÍFICA DO TIPO DE RESPOSTA */}

      {/* 1. TIPO MEDIDA */}
      {isMedida && (
        <div className={`mt-2 mb-2 p-3 rounded-lg border transition-all ${
          foraDaFaixa 
            ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-200' 
            : 'bg-sky-50/70 border-sky-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
              <Gauge className={`w-4 h-4 ${foraDaFaixa ? 'text-rose-600' : 'text-sky-600'}`} />
              <span>Valor Medido em Campo:</span>
            </div>

            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <input
                  type="number"
                  step="any"
                  placeholder="Ex.: 0.00"
                  value={valorAtual}
                  onChange={(e) => {
                    const v = e.target.value;
                    onValorChange(v === '' ? '' : Number(v));
                  }}
                  className={`w-full text-xs font-bold bg-white border rounded-lg px-3 py-1.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 pr-16 ${
                    foraDaFaixa
                      ? 'border-rose-500 focus:ring-rose-500 ring-1 ring-rose-400 text-rose-900'
                      : 'border-sky-300 focus:ring-sky-500'
                  }`}
                />
                {item.unidade && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded border border-sky-200">
                    {item.unidade}
                  </span>
                )}
              </div>

              {(item.valorMinimo !== undefined || item.valorMaximo !== undefined) && (
                <span className="text-[11px] text-slate-600 bg-white/90 px-2 py-1 rounded border border-slate-200 whitespace-nowrap">
                  Faixa: <strong>{item.valorMinimo ?? '-'} a {item.valorMaximo ?? '-'} {item.unidade || ''}</strong>
                </span>
              )}
            </div>
          </div>

          {/* Alerta Visual de Fora da Faixa */}
          {foraDaFaixa && (
            <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-white px-2.5 py-1.5 rounded-md border border-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                ATENÇÃO: Valor medido ({valorAtual} {item.unidade || ''}) está fora da faixa de segurança permitida 
                ({item.valorMinimo ?? '-∞'} a {item.valorMaximo ?? '+∞'} {item.unidade || ''}).
              </span>
            </div>
          )}
        </div>
      )}

      {/* 2. TIPO INFORMACAO (Texto Descritivo) */}
      {isInformacao && (
        <div className="mt-2 mb-2 p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-200 flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-950 shrink-0">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Dado Observado em Campo:</span>
          </div>
          <input
            type="text"
            placeholder="Digite a informação técnica coletada..."
            value={typeof valorAtual === 'string' ? valorAtual : (valorAtual !== null ? String(valorAtual) : '')}
            onChange={(e) => onValorChange(e.target.value)}
            className="w-full text-xs font-medium bg-white border border-indigo-300 rounded-lg px-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1"
          />
        </div>
      )}

      {/* 3. TIPO SIM / NAO (Toggle Switch) */}
      {isSimNao && (
        <div className="mt-2 mb-2 p-2.5 bg-teal-50/60 rounded-lg border border-teal-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-950">
            <HelpCircle className="w-4 h-4 text-teal-600" />
            <span>Confirmação:</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onValorChange('Sim')}
              className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                valorAtual === 'Sim'
                  ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                  : 'bg-white text-teal-900 border-teal-300 hover:bg-teal-100/70'
              }`}
            >
              Sim
            </button>
            <button
              type="button"
              onClick={() => onValorChange('Não')}
              className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                valorAtual === 'Não'
                  ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                  : 'bg-white text-rose-900 border-rose-300 hover:bg-rose-50'
              }`}
            >
              Não
            </button>
          </div>
        </div>
      )}

      {/* 4. TIPO MULTIPLA ESCOLHA */}
      {isMultiplaEscolha && item.opcoes && item.opcoes.length > 0 && (
        <div className="mt-2 mb-2 p-2.5 bg-purple-50/60 rounded-lg border border-purple-200 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-purple-950">
            <div className="flex items-center gap-1.5">
              <ListFilter className="w-4 h-4 text-purple-600" />
              <span>Selecione a opção:</span>
            </div>
            {valorAtual && (
              <span className="text-[11px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded border border-purple-200">
                Selecionado: {String(valorAtual)}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {item.opcoes.map((opcao) => {
              const isSelected = String(valorAtual) === opcao;
              return (
                <button
                  key={opcao}
                  type="button"
                  onClick={() => onValorChange(isSelected ? '' : opcao)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium border transition-all ${
                    isSelected
                      ? 'bg-purple-700 text-white border-purple-700 shadow-xs font-bold scale-102'
                      : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-100/80'
                  }`}
                >
                  {opcao}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. TIPO DATA */}
      {isData && (
        <div className="mt-2 mb-2 p-2.5 bg-blue-50/60 rounded-lg border border-blue-200 flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-950 shrink-0">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Data Registrada:</span>
          </div>
          <input
            type="date"
            value={typeof valorAtual === 'string' ? valorAtual : ''}
            onChange={(e) => onValorChange(e.target.value)}
            className="text-xs font-medium bg-white border border-blue-300 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-xs"
          />
        </div>
      )}

      {/* Alerta se Foto Obrigatória Pendente */}
      {fotoPendente && (
        <div className="mt-2 mb-1 flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-100 px-3 py-2 rounded-lg border border-amber-300">
          <Camera className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Este item requer registro fotográfico obrigatório antes de salvar o checklist.</span>
        </div>
      )}

      {/* Alerta se Não Conforme e exige foto */}
      {fotoPendenteSeNC && (
        <div className="mt-1 mb-2 flex items-center gap-1.5 text-[11px] text-amber-800 font-medium bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-300">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Norma técnica exige registro fotográfico para comprovar esta não conformidade.</span>
        </div>
      )}

      {/* Linha Inferior: Campo de Observação e Upload de Foto */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 mt-2">
        <div className="sm:col-span-2">
          <input
            type="text"
            placeholder="Observação técnica in loco (opcional)..."
            value={item.observacao || ''}
            onChange={(e) => onObservacaoChange(e.target.value)}
            className="w-full text-xs bg-slate-50/70 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {temFoto ? (
            <div className="flex items-center gap-2 bg-blue-50 px-2 py-1 rounded border border-blue-200 w-full">
              <img
                src={item.fotoUrl || item.fotosUrls?.[0]}
                alt="Preview"
                className="w-7 h-7 object-cover rounded"
              />
              <span className="text-[10px] text-blue-800 font-medium truncate flex-1">
                {item.fotoNome || 'Foto.jpg'}
              </span>
              <button
                type="button"
                onClick={onRemoverFoto}
                className="text-rose-600 hover:text-rose-800 p-0.5 ml-auto"
                title="Remover foto"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <label className={`cursor-pointer inline-flex items-center justify-center gap-1 px-3 py-1.5 text-[11px] font-bold rounded border transition-colors w-full ${
              temFotoObrigatoria || fotoPendenteSeNC
                ? 'bg-amber-100 text-amber-900 border-amber-400 hover:bg-amber-200'
                : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200'
            }`}>
              <Camera className="w-3.5 h-3.5 text-slate-600" />
              <span>Anexar Foto {temFotoObrigatoria ? '*' : ''}</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onFotoUpload(file);
                }}
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
};
