import React, { useState } from 'react';
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
  AlertCircle,
  Plus,
  ShieldAlert,
  Edit2
} from 'lucide-react';
import { ChecklistCampoItem, ChecklistCampoItemStatus, TipoRespostaChecklist, ChecklistCriticidade, EvidenciaFoto } from '../../types';
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
    Boolean(item.medicao?.valorEncontrado || item.tipoResposta === 'medida')
  );

  // Normalizar tipo de resposta
  const tipo: TipoRespostaChecklist = item.tipoResposta || (item.campo ? 'conformidade' : 'conformidade');
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

  // Status atual
  const statusAtual = item.status;
  const isNaoConforme = statusAtual === 'nao_conforme';
  const isConforme = statusAtual === 'conforme';
  const isNaoAplicavel = statusAtual === 'nao_aplicavel';
  const isPendente = !statusAtual || statusAtual === 'pendente';

  // Verificação de observação obrigatória quando Não Conforme
  const obsVazia = !item.observacao || item.observacao.trim() === '';
  const obsPendenteNC = isNaoConforme && obsVazia;

  // Verificação de fotos
  const fotosLista: { id: string; url: string; legenda?: string }[] = 
    (item.fotos && item.fotos.length > 0)
      ? item.fotos.map(f => ({ id: f.id, url: f.url, legenda: f.legenda || f.titulo }))
      : (item.fotosVinculadas && item.fotosVinculadas.length > 0)
      ? item.fotosVinculadas.map(f => ({ id: f.id, url: f.url, legenda: f.descricao }))
      : (item.fotosUrls && item.fotosUrls.length > 0)
      ? item.fotosUrls.map((url, i) => ({ id: `foto-${i}`, url, legenda: `Foto ${i + 1}` }))
      : item.fotoUrl
      ? [{ id: 'foto-0', url: item.fotoUrl, legenda: item.fotoNome || 'Foto da vistoria' }]
      : [];

  const temFoto = fotosLista.length > 0;
  const temFotoObrigatoria = Boolean(item.fotoObrigatoria || item.obrigatorioFoto);
  const fotoPendente = temFotoObrigatoria && !temFoto;
  const fotoPendenteSeNC = Boolean(item.exigeFotoSeNaoConforme && isNaoConforme && !temFoto);

  // Manipular upload comprimido
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Compressão client-side: max 1600px, JPEG qualidade 80 conforme especificação B6
      const fotoComprimida = await redimensionarImagemArquivo(file, 1600, 1600, 0.8);
      onFotoUpload(fotoComprimida, legendaTemporaria || `Registro do item ${index + 1}`);
      setLegendaTemporaria('');
    } catch (err) {
      console.warn('Erro ao comprimir imagem, enviando arquivo original:', err);
      onFotoUpload(file, legendaTemporaria);
      setLegendaTemporaria('');
    }
  };

  return (
    <div
      id={`chk-item-${item.id}`}
      className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
        obsPendenteNC
          ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-200 shadow-sm'
          : isNaoConforme
          ? 'bg-rose-50/40 border-rose-300 shadow-xs'
          : isConforme
          ? 'bg-emerald-50/20 border-emerald-300/80'
          : isNaoAplicavel
          ? 'bg-slate-50 border-slate-300 opacity-90'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
      }`}
    >
      {/* Cabeçalho do Item */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <span className={`w-7 h-7 rounded-xl font-mono text-xs flex items-center justify-center font-black shrink-0 mt-0.5 shadow-2xs ${
            isExtra 
              ? 'bg-purple-100 text-purple-900 border border-purple-300' 
              : isConforme
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : isNaoConforme
              ? 'bg-rose-100 text-rose-900 border border-rose-300'
              : 'bg-slate-100 text-slate-800 border border-slate-300'
          }`}>
            {isExtra ? `E${index + 1}` : index + 1}
          </span>

          <div className="flex-1 min-w-0">
            {/* Badges de Tipo, Norma e Categoria */}
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              {item.criterioReferencia && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                  Norma: <strong>{item.criterioReferencia}</strong>
                </span>
              )}

              {isPendente && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  <AlertCircle className="w-3 h-3 text-amber-700" />
                  Inspeção Pendente
                </span>
              )}

              {temFotoObrigatoria && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                  temFoto ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                }`}>
                  <Camera className="w-3 h-3 text-amber-700" />
                  {temFoto ? 'Foto Anexada ✓' : 'Foto Obrigatória *'}
                </span>
              )}

              {isExtra && onRemoverItem && (
                <button
                  type="button"
                  onClick={onRemoverItem}
                  className="text-rose-600 hover:text-rose-800 text-[10px] font-bold ml-auto flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3 h-3" /> Excluir Item
                </button>
              )}
            </div>

            {/* Descrição do Requisito de Inspeção */}
            <p className="text-sm font-bold text-slate-900 leading-snug">
              {item.descricao}
            </p>
          </div>
        </div>

        {/* B1: 3 BOTÕES GRANDES DE STATUS (ALTURA >= 48px, TOUCH-FRIENDLY) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
          {/* BOTÃO CONFORME */}
          <button
            type="button"
            onClick={() => onStatusChange('conforme')}
            className={`min-h-[48px] py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isConforme
                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-500 scale-[1.01]'
                : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border-2 border-slate-300 hover:border-emerald-400'
            }`}
            title="Marcar como Conforme com as normas técnicas"
          >
            <CheckCircle2 className={`w-4 h-4 sm:w-5 sm:h-5 ${isConforme ? 'text-white' : 'text-emerald-600'}`} />
            <span>Conforme</span>
          </button>

          {/* BOTÃO NÃO CONFORME */}
          <button
            type="button"
            onClick={() => onStatusChange('nao_conforme')}
            className={`min-h-[48px] py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isNaoConforme
                ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-500 scale-[1.01]'
                : 'bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-800 border-2 border-slate-300 hover:border-rose-400'
            }`}
            title="Marcar como Não Conforme (exige justificativa técnica)"
          >
            <AlertTriangle className={`w-4 h-4 sm:w-5 sm:h-5 ${isNaoConforme ? 'text-white' : 'text-rose-600'}`} />
            <span>Não conforme</span>
          </button>

          {/* BOTÃO NÃO APLICÁVEL */}
          <button
            type="button"
            onClick={() => onStatusChange('nao_aplicavel')}
            className={`min-h-[48px] py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isNaoAplicavel
                ? 'bg-slate-700 text-white shadow-md ring-2 ring-slate-600 scale-[1.01]'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-2 border-slate-300 hover:border-slate-400'
            }`}
            title="Não aplicável para este equipamento ou configuração"
          >
            <MinusCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${isNaoAplicavel ? 'text-white' : 'text-slate-500'}`} />
            <span>N.A.</span>
          </button>
        </div>
      </div>

      {/* B2: BLOCO EXPANDIDO QUANDO NÃO CONFORME (CRITICIDADE + AÇÃO CORRETIVA) */}
      {isNaoConforme && (
        <div className="mt-3 p-3.5 rounded-xl border border-rose-300 bg-rose-50/70 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-black text-rose-950 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Classificação de Risco e Ação Corretiva do Item</span>
          </div>

          {/* Seletor de Risco / Criticidade */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 block">
              Grau de Risco / Criticidade:
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'baixa', label: 'Baixo', cor: 'bg-emerald-600 text-white border-emerald-600', corOff: 'border-slate-300 bg-white text-slate-700 hover:bg-emerald-50' },
                { id: 'media', label: 'Médio', cor: 'bg-amber-600 text-white border-amber-600', corOff: 'border-slate-300 bg-white text-slate-700 hover:bg-amber-50' },
                { id: 'alta', label: 'Alto', cor: 'bg-orange-600 text-white border-orange-600', corOff: 'border-slate-300 bg-white text-slate-700 hover:bg-orange-50' },
                { id: 'critica', label: 'Crítico', cor: 'bg-rose-700 text-white border-rose-700', corOff: 'border-slate-300 bg-white text-slate-700 hover:bg-rose-50' }
              ].map(crit => {
                const ativo = (item.criticidade || item.naoConformidade?.criticidade) === crit.id;
                return (
                  <button
                    key={crit.id}
                    type="button"
                    onClick={() => onCriticidadeChange && onCriticidadeChange(crit.id as ChecklistCriticidade)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      ativo ? `${crit.cor} font-black shadow-2xs scale-102` : crit.corOff
                    }`}
                  >
                    {crit.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ação Corretiva Recomendada */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 block">
              Ação Recomendada Sugerida / Medida Corretiva:
            </label>
            <input
              type="text"
              value={item.acaoRecomendada || item.naoConformidade?.recomendacao || ''}
              onChange={(e) => onAcaoRecomendadaChange && onAcaoRecomendadaChange(e.target.value)}
              placeholder="Ex: Instalar proteção fixa de policarbonato e chave de intertravamento com ruptura positiva..."
              className="w-full px-3 py-1.5 rounded-lg border border-rose-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>
      )}

      {/* MEDIÇÃO TÉCNICA OPCIONAL */}
      {(mostrarMedicaoOpcional || isMedida) && (
        <div className="mt-3 p-3 bg-sky-50/70 rounded-xl border border-sky-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-sky-950">
            <span className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-sky-600" />
              Medição Técnica em Campo
            </span>
            {item.unidade && <span className="font-mono text-sky-700">[{item.unidade}]</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-600 block">Valor Medido:</label>
              <input
                type="number"
                step="any"
                value={item.medicao?.valorEncontrado !== undefined ? item.medicao.valorEncontrado : (typeof valorAtual === 'number' ? valorAtual : '')}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : Number(e.target.value);
                  onValorChange(val);
                  if (onMedicaoChange) {
                    onMedicaoChange({
                      valor: val,
                      unidade: item.unidade || item.medicao?.unidade || '',
                      referencia: item.criterioReferencia || item.medicao?.tolerancia || ''
                    });
                  }
                }}
                placeholder="Ex: 2.4"
                className="w-full px-2.5 py-1.5 rounded-lg border border-sky-300 bg-white text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 block">Unidade de Medida:</label>
              <input
                type="text"
                value={item.medicao?.unidade || item.unidade || ''}
                onChange={(e) => {
                  if (onMedicaoChange) {
                    onMedicaoChange({
                      valor: item.medicao?.valorEncontrado || valorAtual,
                      unidade: e.target.value,
                      referencia: item.medicao?.tolerancia || item.criterioReferencia || ''
                    });
                  }
                }}
                placeholder="Ex: mm, bar, mm/s, °C"
                className="w-full px-2.5 py-1.5 rounded-lg border border-sky-300 bg-white text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 block">Limite / Referência Normativa:</label>
              <input
                type="text"
                value={item.medicao?.tolerancia || item.criterioReferencia || ''}
                onChange={(e) => {
                  if (onMedicaoChange) {
                    onMedicaoChange({
                      valor: item.medicao?.valorEncontrado || valorAtual,
                      unidade: item.medicao?.unidade || item.unidade || '',
                      referencia: e.target.value
                    });
                  }
                }}
                placeholder="Ex: ≤ 4.5 mm/s (ISO 10816)"
                className="w-full px-2.5 py-1.5 rounded-lg border border-sky-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* CAMPO DE OBSERVAÇÃO TÉCNICA (OBRIGATÓRIO SE NÃO CONFORME) */}
      <div className="mt-3 space-y-1">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold text-slate-800 flex items-center gap-1">
            <span>Observação Técnica in loco:</span>
            {isNaoConforme && <span className="text-rose-600 font-black">* (Obrigatória se Não Conforme)</span>}
          </label>
          {!mostrarMedicaoOpcional && !isMedida && (
            <button
              type="button"
              onClick={() => setMostrarMedicaoOpcional(true)}
              className="text-[11px] text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              + Adicionar Medição
            </button>
          )}
        </div>

        <input
          type="text"
          placeholder={
            isNaoConforme
              ? 'Descreva a não conformidade observada fisicamente (obrigatório)...'
              : 'Observação técnica, condição operacional ou nota adicional (opcional)...'
          }
          value={item.observacao || ''}
          onChange={(e) => onObservacaoChange(e.target.value)}
          className={`w-full text-xs rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
            obsPendenteNC
              ? 'bg-rose-50 border-2 border-rose-500 focus:ring-rose-500'
              : 'bg-slate-50 border border-slate-300 focus:bg-white focus:ring-blue-500'
          }`}
        />

        {obsPendenteNC && (
          <p className="text-[11px] font-bold text-rose-700 flex items-center gap-1 mt-0.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>Atenção: A conclusão da vistoria exige preenchimento da observação para itens Não Conformes.</span>
          </p>
        )}
      </div>

      {/* B2: FOTOS DO ITEM (MÚLTIPLAS FOTOS COM LEGENDA CURTA E BOTÃO DE CÂMERA) */}
      <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-blue-600" />
            <span>Evidências Fotográficas ({fotosLista.length})</span>
          </span>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={legendaTemporaria}
              onChange={(e) => setLegendaTemporaria(e.target.value)}
              placeholder="Legenda da foto (ex: Trinca no cabo)..."
              className="px-2 py-1 text-xs rounded-lg border border-slate-300 bg-white w-48 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            <label className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors">
              <Camera className="w-3.5 h-3.5" />
              <span>Tirar Foto / Anexar</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Galeria de Fotos do Item com Legenda Editável */}
        {fotosLista.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
            {fotosLista.map((foto, fIdx) => (
              <div 
                key={foto.id || fIdx} 
                className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2 group relative"
              >
                <img
                  src={foto.url}
                  alt={foto.legenda || `Foto ${fIdx + 1}`}
                  className="w-14 h-14 object-cover rounded-lg border border-slate-300 shrink-0 bg-white"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <input
                    type="text"
                    value={foto.legenda || ''}
                    onChange={(e) => onAtualizarLegendaFoto && onAtualizarLegendaFoto(foto.id || fIdx, e.target.value)}
                    placeholder="Legenda da evidência..."
                    className="w-full text-[11px] font-medium bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="block text-[9.5px] text-slate-400 font-mono">
                    Evidência #{fIdx + 1}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoverFoto(foto.id || fIdx)}
                  className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
