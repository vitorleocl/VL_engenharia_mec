import React from 'react';
import { 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Camera, 
  X, 
  ShieldAlert, 
  Sparkles,
  Calculator,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { PerigoApreciacaoRiscoNR12 } from '../../types';

interface TabelaApreciacaoRiscoNR12Props {
  perigos: PerigoApreciacaoRiscoNR12[];
  onChange: (perigos: PerigoApreciacaoRiscoNR12[]) => void;
}

export function calcularHrn(lo: number, fe: number, dph: number, np: number): {
  hrn: number;
  classificacao: 'Trivial' | 'Tolerável' | 'Moderado' | 'Substancial' | 'Intolerável';
  badgeClasse: string;
} {
  const nLo = Number(lo) || 0;
  const nFe = Number(fe) || 0;
  const nDph = Number(dph) || 0;
  const nNp = Number(np) || 0;
  const hrn = Math.round((nLo * nFe * nDph * nNp) * 100) / 100;

  if (hrn <= 1) {
    return { hrn, classificacao: 'Trivial', badgeClasse: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  } else if (hrn <= 5) {
    return { hrn, classificacao: 'Tolerável', badgeClasse: 'bg-lime-100 text-lime-800 border-lime-300' };
  } else if (hrn <= 10) {
    return { hrn, classificacao: 'Moderado', badgeClasse: 'bg-amber-100 text-amber-900 border-amber-300' };
  } else if (hrn <= 50) {
    return { hrn, classificacao: 'Substancial', badgeClasse: 'bg-orange-100 text-orange-900 border-orange-300' };
  } else {
    return { hrn, classificacao: 'Intolerável', badgeClasse: 'bg-rose-100 text-rose-900 border-rose-400 font-black ring-2 ring-rose-200' };
  }
}

export const TabelaApreciacaoRiscoNR12: React.FC<TabelaApreciacaoRiscoNR12Props> = ({
  perigos,
  onChange,
}) => {
  const FASES_VIDA = [
    'Operação Normal',
    'Setup',
    'Limpeza',
    'Manutenção',
    'Falha Previsível'
  ];

  const TIPOS_PERIGO = [
    'Mecânico-Esmagamento',
    'Mecânico-Corte',
    'Mecânico-Perfuração',
    'Mecânico-Arrasto',
    'Mecânico-Cisalhamento',
    'Mecânico-Impacto',
    'Elétrico',
    'Térmico',
    'Ergonômico',
    'Outro'
  ];

  const NIVEIS_CONTROLE = [
    'Eliminação',
    'Substituição',
    'Controle de Engenharia',
    'Controle Administrativo',
    'EPI'
  ];

  const handleAdicionarPerigo = () => {
    const novo: PerigoApreciacaoRiscoNR12 = {
      id: `perigo-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      pontoOperacao: '',
      faseVida: 'Operação Normal',
      tipoPerigo: 'Mecânico-Esmagamento',
      lo: 1,
      fe: 2.5,
      dph: 2,
      np: 1,
      hrn: 5,
      classificacaoRisco: 'Tolerável',
      medidaExistente: '',
      nivelControleRecomendado: 'Controle de Engenharia',
      medidaRecomendadaDetalhada: '',
      hrnResidual: 1,
      prazoImplementacao: '',
      responsavelImplementacao: '',
      fotoUrl: undefined,
    };
    onChange([...perigos, novo]);
  };

  const handleRemoverPerigo = (id: string) => {
    onChange(perigos.filter(p => p.id !== id));
  };

  const handleAtualizarPerigo = (id: string, campos: Partial<PerigoApreciacaoRiscoNR12>) => {
    onChange(perigos.map(p => {
      if (p.id !== id) return p;

      const atualizado = { ...p, ...campos };
      // Recalcular HRN caso LO, FE, DPH ou NP tenham sido alterados
      if ('lo' in campos || 'fe' in campos || 'dph' in campos || 'np' in campos) {
        const { hrn, classificacao } = calcularHrn(
          atualizado.lo,
          atualizado.fe,
          atualizado.dph,
          atualizado.np
        );
        atualizado.hrn = hrn;
        atualizado.classificacaoRisco = classificacao;
      }
      return atualizado;
    }));
  };

  const handleUploadFotoPerigo = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      handleAtualizarPerigo(id, { fotoUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            3.2 Tabela de Apreciação de Risco (HRN - Hazard Rating Number)
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Adicione dinamicamente quantas zonas ou pontos de perigo forem identificados durante a vistoria in loco.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdicionarPerigo}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Adicionar Ponto de Perigo</span>
        </button>
      </div>

      {perigos.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <ShieldAlert className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-700">
            Nenhum ponto de perigo cadastrado ainda.
          </p>
          <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto">
            Clique no botão acima para adicionar zonas de operação com risco mecânico, elétrico, térmico ou ergonômico e calcular o HRN.
          </p>
          <button
            type="button"
            onClick={handleAdicionarPerigo}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            Adicionar Primeiro Perigo
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {perigos.map((perigo, index) => {
            const { hrn, classificacao, badgeClasse } = calcularHrn(
              perigo.lo,
              perigo.fe,
              perigo.dph,
              perigo.np
            );
            const semFoto = !perigo.fotoUrl && (!perigo.fotosUrls || perigo.fotosUrls.length === 0);

            return (
              <div
                key={perigo.id}
                className={`p-4 rounded-xl border transition-all ${
                  semFoto
                    ? 'bg-amber-50/40 border-amber-300 ring-1 ring-amber-200'
                    : classificacao === 'Intolerável'
                    ? 'bg-rose-50/50 border-rose-300'
                    : classificacao === 'Substancial'
                    ? 'bg-orange-50/50 border-orange-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                {/* Linha 1: Título do Perigo e Ações */}
                <div className="flex items-center justify-between gap-3 mb-3 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-mono text-xs flex items-center justify-center font-bold">
                      P{index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      Ponto de Perigo #{index + 1}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeClasse}`}>
                      HRN {hrn} — Risco {classificacao}
                    </span>
                    {semFoto && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 animate-pulse">
                        📸 Foto Obrigatória
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoverPerigo(perigo.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                    title="Excluir este perigo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Grade de Campos Técnicos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  {/* Zona / Ponto de Operação */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Zona / Ponto de Operação <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex.: Cilindros de prensagem, esteira, cabeçote..."
                      value={perigo.pontoOperacao}
                      onChange={(e) => handleAtualizarPerigo(perigo.id, { pontoOperacao: e.target.value })}
                      className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Fase de Vida */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Fase de Vida
                    </label>
                    <select
                      value={perigo.faseVida}
                      onChange={(e) => handleAtualizarPerigo(perigo.id, { faseVida: e.target.value })}
                      className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {FASES_VIDA.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tipo de Perigo */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Tipo de Perigo
                    </label>
                    <select
                      value={perigo.tipoPerigo}
                      onChange={(e) => handleAtualizarPerigo(perigo.id, { tipoPerigo: e.target.value })}
                      className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {TIPOS_PERIGO.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sub-bloco de Cálculo de HRN: LO x FE x DPH x NP */}
                <div className="mt-3 p-3 bg-slate-50/90 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                      <Calculator className="w-3.5 h-3.5 text-blue-600" />
                      Variáveis de Risco HRN (Fórmula: HRN = LO × FE × DPH × NP)
                    </span>
                    <span className="text-[11px] font-bold text-slate-600">
                      HRN: <span className="font-mono text-blue-700 font-black text-xs">{hrn}</span> ({classificacao})
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {/* LO */}
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                        LO (Probabilidade 1–15)
                      </label>
                      <select
                        value={perigo.lo}
                        onChange={(e) => handleAtualizarPerigo(perigo.id, { lo: Number(e.target.value) })}
                        className="w-full text-[11px] font-medium bg-white border border-slate-300 rounded px-2 py-1"
                      >
                        <option value={0.03}>0.03 - Quase impossível</option>
                        <option value={0.1}>0.1 - Altamente improvável</option>
                        <option value={0.5}>0.5 - Improvável</option>
                        <option value={1}>1 - Possível</option>
                        <option value={2}>2 - Provável</option>
                        <option value={5}>5 - Quase certo</option>
                        <option value={10}>10 - Certo</option>
                        <option value={15}>15 - Inevitável</option>
                      </select>
                    </div>

                    {/* FE */}
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                        FE (Frequência 1–5)
                      </label>
                      <select
                        value={perigo.fe}
                        onChange={(e) => handleAtualizarPerigo(perigo.id, { fe: Number(e.target.value) })}
                        className="w-full text-[11px] font-medium bg-white border border-slate-300 rounded px-2 py-1"
                      >
                        <option value={0.5}>0.5 - Anual</option>
                        <option value={1}>1 - Mensal</option>
                        <option value={1.5}>1.5 - Semanal</option>
                        <option value={2.5}>2.5 - Diária</option>
                        <option value={4}>4 - Contínua / Horária</option>
                        <option value={5}>5 - Constante</option>
                      </select>
                    </div>

                    {/* DPH */}
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                        DPH (Dano 1–15)
                      </label>
                      <select
                        value={perigo.dph}
                        onChange={(e) => handleAtualizarPerigo(perigo.id, { dph: Number(e.target.value) })}
                        className="w-full text-[11px] font-medium bg-white border border-slate-300 rounded px-2 py-1"
                      >
                        <option value={0.25}>0.25 - Arranhão / leve</option>
                        <option value={0.5}>0.5 - Corte leve</option>
                        <option value={1}>1 - Fratura pequena</option>
                        <option value={2}>2 - Fratura grave / falange</option>
                        <option value={4}>4 - Perda de membro ou olho</option>
                        <option value={8}>8 - Amputações múltiplas</option>
                        <option value={15}>15 - Fatalidade</option>
                      </select>
                    </div>

                    {/* NP */}
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                        NP (Pessoas 1–8)
                      </label>
                      <select
                        value={perigo.np}
                        onChange={(e) => handleAtualizarPerigo(perigo.id, { np: Number(e.target.value) })}
                        className="w-full text-[11px] font-medium bg-white border border-slate-300 rounded px-2 py-1"
                      >
                        <option value={1}>1 - Uma pessoa</option>
                        <option value={2}>2 - Duas pessoas</option>
                        <option value={4}>4 - Três a sete pessoas</option>
                        <option value={8}>8 - Oito a doze pessoas</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Medidas de Controle e Foto Obrigatória */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Medida de Controle Existente
                    </label>
                    <input
                      type="text"
                      placeholder="Ex.: Chave fim de curso comum, proteção improvisada..."
                      value={perigo.medidaExistente}
                      onChange={(e) => handleAtualizarPerigo(perigo.id, { medidaExistente: e.target.value })}
                      className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nível de Controle Recomendado
                    </label>
                    <select
                      value={perigo.nivelControleRecomendado}
                      onChange={(e) => handleAtualizarPerigo(perigo.id, { nivelControleRecomendado: e.target.value })}
                      className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {NIVEIS_CONTROLE.map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Medida de Controle Recomendada (Detalhamento Técnico)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex.: Instalar proteção física fixa em chapa perfurada com chave de segurança mecânica de ruptura positiva..."
                      value={perigo.medidaRecomendadaDetalhada}
                      onChange={(e) => handleAtualizarPerigo(perigo.id, { medidaRecomendadaDetalhada: e.target.value })}
                      className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      HRN Residual Estimado
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="Ex.: 0.5 (Trivial)"
                      value={perigo.hrnResidual ?? ''}
                      onChange={(e) => handleAtualizarPerigo(perigo.id, { hrnResidual: e.target.value === '' ? undefined : Number(e.target.value) })}
                      className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Prazo de Implementação
                    </label>
                    <input
                      type="date"
                      value={perigo.prazoImplementacao || ''}
                      onChange={(e) => handleAtualizarPerigo(perigo.id, { prazoImplementacao: e.target.value })}
                      className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Responsável pela Implementação
                    </label>
                    <input
                      type="text"
                      placeholder="Ex.: Manutenção Mecânica / SESMT"
                      value={perigo.responsavelImplementacao || ''}
                      onChange={(e) => handleAtualizarPerigo(perigo.id, { responsavelImplementacao: e.target.value })}
                      className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Foto Obrigatória do Ponto de Perigo */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Foto do Ponto de Perigo <span className="text-rose-500">* (Obrigatória)</span>
                    </label>
                    {perigo.fotoUrl ? (
                      <div className="flex items-center gap-2 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                        <img
                          src={perigo.fotoUrl}
                          alt="Foto Perigo"
                          className="w-8 h-8 object-cover rounded"
                        />
                        <span className="text-[11px] font-bold text-emerald-800 truncate flex-1">
                          Foto Anexada ✓
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAtualizarPerigo(perigo.id, { fotoUrl: undefined })}
                          className="text-rose-600 hover:text-rose-800 p-0.5"
                          title="Remover foto"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border bg-amber-100 text-amber-900 border-amber-400 hover:bg-amber-200 transition-colors w-full">
                        <Camera className="w-4 h-4 text-amber-700" />
                        <span>Anexar Foto do Perigo *</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadFotoPerigo(perigo.id, file);
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
