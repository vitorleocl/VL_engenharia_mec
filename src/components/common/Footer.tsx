import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Footer: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <footer className="border-t border-[var(--line)] py-7 text-[var(--muted)] text-[14.5px] sm:text-[15px] bg-[var(--card)]">
      <div className="max-w-[1120px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <span>© 2026 VL Engenharia Mecânica · CREA-PE 1822299490</span>
          <span className="hidden sm:inline opacity-40">•</span>
          <span>Recife, Pernambuco</span>
        </div>
        <div className="flex items-center gap-4 text-sm font-semibold">
          <Link 
            to="/privacidade" 
            className="hover:text-[var(--ink)] transition-colors"
          >
            Privacidade & LGPD
          </Link>
          <span className="opacity-40">•</span>
          <Link 
            to={currentUser ? '/admin' : '/login'} 
            className="hover:text-[var(--blue)] transition-colors text-[var(--ink)]"
          >
            Acesso restrito
          </Link>
        </div>
      </div>
    </footer>
  );
};
