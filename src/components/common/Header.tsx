import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, Shield, ArrowRight } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (anchorId: string) => {
    setMobileMenuOpen(false);
    if (window.location.pathname !== '/') {
      navigate('/' + anchorId);
      return;
    }
    const element = document.querySelector(anchorId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center group focus:outline-none" aria-label="VL Engenharia">
          <img
            src="/logo.png"
            alt="VL Engenharia"
            className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-transform group-hover:scale-102"
            onError={(e) => {
              // Fallback to logo.svg if needed
              e.currentTarget.src = '/logo.svg';
            }}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
          <button
            onClick={() => handleNavClick('#inicio')}
            className="hover:text-[#1565D8] transition-colors cursor-pointer"
          >
            Início
          </button>
          <button
            onClick={() => handleNavClick('#sobre')}
            className="hover:text-[#1565D8] transition-colors cursor-pointer"
          >
            Sobre
          </button>
          <button
            onClick={() => handleNavClick('#servicos')}
            className="hover:text-[#1565D8] transition-colors cursor-pointer"
          >
            Serviços
          </button>
          <button
            onClick={() => handleNavClick('#contato')}
            className="hover:text-[#1565D8] transition-colors cursor-pointer"
          >
            Contato
          </button>
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://wa.me/5581984442592?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20um%20or%C3%A7amento%20com%20a%20VL%20Engenharia."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1565D8] hover:bg-[#0d47a1] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-98"
          >
            <Phone className="w-4 h-4" />
            <span>Solicitar Orçamento</span>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href="https://wa.me/5581984442592?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20um%20or%C3%A7amento%20com%20a%20VL%20Engenharia."
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-emerald-600 bg-emerald-50 rounded-lg"
            title="WhatsApp Plantão"
          >
            <Phone className="w-5 h-5" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-[#1565D8] rounded-lg hover:bg-slate-50 focus:outline-none"
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top duration-200">
          <button
            onClick={() => handleNavClick('#inicio')}
            className="block w-full text-left py-2.5 px-3 rounded-md text-base font-semibold text-slate-800 hover:bg-slate-50 hover:text-[#1565D8]"
          >
            Início
          </button>
          <button
            onClick={() => handleNavClick('#sobre')}
            className="block w-full text-left py-2.5 px-3 rounded-md text-base font-semibold text-slate-800 hover:bg-slate-50 hover:text-[#1565D8]"
          >
            Sobre Mim
          </button>
          <button
            onClick={() => handleNavClick('#servicos')}
            className="block w-full text-left py-2.5 px-3 rounded-md text-base font-semibold text-slate-800 hover:bg-slate-50 hover:text-[#1565D8]"
          >
            Nossos Serviços
          </button>
          <button
            onClick={() => handleNavClick('#contato')}
            className="block w-full text-left py-2.5 px-3 rounded-md text-base font-semibold text-slate-800 hover:bg-slate-50 hover:text-[#1565D8]"
          >
            Contato
          </button>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <a
              href="https://wa.me/5581984442592?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20um%20or%C3%A7amento%20com%20a%20VL%20Engenharia."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-3 rounded-lg bg-[#1565D8] text-white font-bold text-sm shadow-md"
            >
              Falar no WhatsApp (81) 98444-2592
            </a>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg border border-slate-200 text-slate-600 font-semibold text-xs flex items-center justify-center gap-1 hover:bg-slate-50"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Acesso ao Painel Restrito</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
