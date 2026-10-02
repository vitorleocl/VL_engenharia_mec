import React from 'react';
import { 
  CheckCircle2, 
  Printer, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  Award, 
  Download, 
  X,
  Share2,
  ExternalLink
} from 'lucide-react';
import { Laudo } from '../../types';

interface ConclusaoLaudoSucessoModalProps {
  isOpen: boolean;
  onClose: () => void;
  laudo: Laudo;
  onExportarPdf: () => void;
  onVoltarCentral: () => void;
}

export const ConclusaoLaudoSucessoModal: React.FC<ConclusaoLaudoSucessoModalProps> = ({
  isOpen,
  onClose,
  laudo,
  onExportarPdf,
  onVoltarCentral
}) => {
  if (!isOpen) return null;

  const hashAutenticidade = laudo.assinaturaDigital?.hashAutenticidade || 
    `AUT-VL-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

  const dataHomologacao = laudo.assinaturaDigital?.dataHora 
    ? new Date(laudo.assinaturaDigital.dataHora).toLocaleString('pt-BR') 
    : new Date().toLocaleString('pt-BR');

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 animate-in fade-in duration-300">
      
      {/* Background blueprint decorative elements */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #10b981 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
          backgroundSize: '36px 36px'
        }}
      />

      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 text-center overflow-hidden z-10 animate-in zoom-in-95 duration-300">
        
        {/* Glow de sucesso */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Conjunto Mecânico de Engrenagens de Engenharia & Logo */}
        <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
          
          {/* Engrenagem Superior Esquerda */}
          <div className="absolute -top-2 -left-2 flex items-center justify-center animate-[spin_10s_linear_infinite]">
            <svg className="w-20 h-20 text-emerald-500/30 drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 35 C41.7 35 35 41.7 35 50 C35 58.3 41.7 65 50 65 C58.3 65 65 58.3 65 50 C65 41.7 58.3 35 50 35 Z M50 20 L53 10 L47 10 L50 20 M50 80 L53 90 L47 90 L50 80 M80 50 L90 53 L90 47 L80 50 M20 50 L10 53 L10 47 L20 50 M71 29 L79 23 L75 19 L67 25 M29 71 L21 77 L25 81 L33 75 M71 71 L79 77 L75 81 L67 75 M29 29 L21 23 L25 19 L33 25" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Engrenagem Inferior Direita */}
          <div className="absolute -bottom-2 -right-2 flex items-center justify-center animate-[spin_7s_linear_infinite_reverse]">
            <svg className="w-24 h-24 text-blue-500/30 drop-shadow-[0_0_12px_rgba(59,130,246,0.4)]" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 38 C43.4 38 38 43.4 38 50 C38 56.6 43.4 62 50 62 C56.6 62 62 56.6 62 50 C62 43.4 56.6 38 50 38 Z M50 24 L54 14 L46 14 L50 24 M50 76 L54 86 L46 86 L50 76 M76 50 L86 54 L86 46 L76 50 M24 50 L14 54 L14 46 L24 50" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Cartão Central com Logo e Checkmark Dourado */}
          <div className="relative z-20 bg-white p-3 rounded-2xl shadow-2xl border-2 border-emerald-500/50 flex flex-col items-center justify-center">
            <img
              src="/logo.png"
              alt="VL Engenharia"
              className="h-12 w-auto object-contain drop-shadow-xs"
            />
            <div className="absolute -bottom-2.5 -right-2.5 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Mensagem e Qualificação Pericial */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Laudo Homologado com ART CREA-PE</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Conclusão e Homologação Concluídas!
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            O documento pericial foi finalizado sob fé pública e responsabilidade técnica do <strong>Eng. Vitor Leonardo</strong> (CREA-PE 182229949-0), com validade jurídica plena.
          </p>
        </div>

        {/* Resumo dos Metadados Oficiais */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-left space-y-2 mb-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
            <span className="text-slate-500">Número do Laudo:</span>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{laudo.numero}</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
            <span className="text-slate-500">ART CREA-PE Vinculada:</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{laudo.artNumero || 'PE2026-0104882'}</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
            <span className="text-slate-500">Cliente / Contratante:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[240px]">{laudo.clienteNome}</span>
          </div>

          {laudo.matrizNexoCausal && (
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
              <span className="text-slate-500">Matriz de Nexo Causal:</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${laudo.matrizNexoCausal.cor}`}>
                {laudo.matrizNexoCausal.rotulo}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-500">Hash de Autenticidade:</span>
            <span className="font-mono text-[10px] text-slate-400 truncate max-w-[220px]" title={hashAutenticidade}>
              {hashAutenticidade}
            </span>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onExportarPdf}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Visualizar / Exportar PDF</span>
          </button>

          <button
            onClick={onVoltarCentral}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Central de Laudos</span>
          </button>
        </div>

      </div>
    </div>
  );
};
