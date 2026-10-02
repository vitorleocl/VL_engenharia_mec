import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Cog, Cpu } from 'lucide-react';

interface TransicaoAreaRestritaModalProps {
  isOpen: boolean;
  onFinish?: () => void;
  destino?: string;
}

export const TransicaoAreaRestritaModal: React.FC<TransicaoAreaRestritaModalProps> = ({
  isOpen,
  onFinish,
  destino = '/admin'
}) => {
  const navigate = useNavigate();
  const [progresso, setProgresso] = useState(15);
  const [etapaTexto, setEtapaTexto] = useState('Iniciando mecanismos de segurança...');

  useEffect(() => {
    if (!isOpen) {
      setProgresso(15);
      return;
    }

    const t1 = setTimeout(() => {
      setProgresso(45);
      setEtapaTexto('Engrenando módulos periciais e governança CREA-PE...');
    }, 300);

    const t2 = setTimeout(() => {
      setProgresso(85);
      setEtapaTexto('Autenticando credenciais do Engenheiro Responsável...');
    }, 700);

    const t3 = setTimeout(() => {
      setProgresso(100);
      setEtapaTexto('Acesso autorizado! Carregando painel...');
    }, 1100);

    const t4 = setTimeout(() => {
      if (onFinish) {
        onFinish();
      } else {
        navigate(destino);
      }
    }, 1350);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isOpen, destino, navigate, onFinish]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md px-4 select-none animate-in fade-in duration-200">
      
      {/* Background blueprint grid styling */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #3b82f6 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="relative flex flex-col items-center max-w-md w-full text-center z-10">
        
        {/* Glow halo */}
        <div className="absolute -top-12 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

        {/* Conjunto Mecânico de Engrenagens Animadas */}
        <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
          
          {/* Engrenagem 1: Principal Externa (Grande - Sentido Horário) */}
          <div className="absolute inset-0 flex items-center justify-center animate-[spin_8s_linear_infinite]">
            <svg className="w-40 h-40 text-blue-500/30 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 35 C41.7 35 35 41.7 35 50 C35 58.3 41.7 65 50 65 C58.3 65 65 58.3 65 50 C65 41.7 58.3 35 50 35 Z M50 20 L53 10 L47 10 L50 20 M50 80 L53 90 L47 90 L50 80 M80 50 L90 53 L90 47 L80 50 M20 50 L10 53 L10 47 L20 50 M71 29 L79 23 L75 19 L67 25 M29 71 L21 77 L25 81 L33 75 M71 71 L79 77 L75 81 L67 75 M29 29 L21 23 L25 19 L33 25" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Engrenagem 2: Secundária Superior Direita (Média - Sentido Anti-Horário) */}
          <div className="absolute -top-2 -right-2 flex items-center justify-center animate-[spin_5s_linear_infinite_reverse]">
            <svg className="w-20 h-20 text-amber-500/40 drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 38 C43.4 38 38 43.4 38 50 C38 56.6 43.4 62 50 62 C56.6 62 62 56.6 62 50 C62 43.4 56.6 38 50 38 Z M50 24 L54 14 L46 14 L50 24 M50 76 L54 86 L46 86 L50 76 M76 50 L86 54 L86 46 L76 50 M24 50 L14 54 L14 46 L24 50" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Engrenagem 3: Terciária Inferior Esquerda (Pequena - Sentido Horário Rápido) */}
          <div className="absolute -bottom-1 -left-1 flex items-center justify-center animate-[spin_3s_linear_infinite]">
            <svg className="w-16 h-16 text-cyan-400/40 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 40 C44.5 40 40 44.5 40 50 C40 55.5 44.5 60 50 60 C55.5 60 60 55.5 60 50 C60 44.5 55.5 40 50 40 Z M50 28 L54 18 L46 18 L50 28 M50 72 L54 82 L46 82 L50 72 M72 50 L82 54 L82 46 L72 50 M28 50 L18 54 L18 46 L28 50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Cartão Central com Logo Oficial da Empresa */}
          <div className="relative z-20 bg-white p-3.5 rounded-2xl shadow-2xl border-2 border-blue-400/40 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <img
              src="/logo.png"
              alt="VL Engenharia"
              className="h-12 w-auto object-contain drop-shadow-xs"
            />
          </div>
        </div>

        {/* Título & Badges Institucionais */}
        <div className="space-y-1 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[11px] font-bold uppercase tracking-wider mb-1">
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span>Ambiente Técnico Restrito</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wider uppercase">
            VL ENGENHARIA MECÂNICA
          </h2>
          <p className="text-xs font-semibold text-slate-400">
            Perícias Judiciais & Engenharia Diagnóstica • CREA-PE 182229949-0
          </p>
        </div>

        {/* Barra de Progresso com Brilho Metálico */}
        <div className="w-full max-w-xs space-y-2.5">
          <div className="relative w-full h-2 bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-amber-400 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(56,189,248,0.7)]"
              style={{ width: `${progresso}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="truncate pr-2">{etapaTexto}</span>
            <span className="font-bold text-sky-400">{progresso}%</span>
          </div>
        </div>

      </div>
    </div>
  );
};
