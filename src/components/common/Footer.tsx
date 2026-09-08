import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone, MapPin, Shield, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B1E3D] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg inline-block">
                <img
                  src="/logo.svg"
                  alt="VL Engenharia"
                  className="h-10 w-auto"
                />
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Atuação técnica especializada orientada à segurança legal, conformidade normativa, 
              inspeções mecânicas com ART e alta confiabilidade de ativos em Pernambuco e região.
            </p>
            <div className="pt-1 text-xs text-slate-400 font-mono">
              CREA-PE: <span className="text-white font-bold">1822299490</span>
            </div>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Serviços de Engenharia
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="#servicos" className="hover:text-white transition-colors">Adequação à NR-12</a></li>
              <li><a href="#servicos" className="hover:text-white transition-colors">Laudos para Máquinas Pesadas</a></li>
              <li><a href="#servicos" className="hover:text-white transition-colors">Caminhões Munck e Guindastes</a></li>
              <li><a href="#servicos" className="hover:text-white transition-colors">Inspeção Veicular e Sinistro</a></li>
              <li><a href="#servicos" className="hover:text-white transition-colors">Laudos de Playground (NBR 16071)</a></li>
              <li><a href="#servicos" className="hover:text-white transition-colors">PMOC e ART de Manutenção</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Canais Oficiais
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#1565D8] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-slate-500">Plantão Técnico & WhatsApp</span>
                  <a
                    href="https://wa.me/5581984442592"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-300 font-semibold transition-colors"
                  >
                    (81) 98444-2592
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#1565D8] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-slate-500">E-mail Profissional</span>
                  <a
                    href="mailto:vitorleonardocl@gmail.com"
                    className="text-white hover:text-blue-300 transition-colors"
                  >
                    vitorleonardocl@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Instagram className="w-4 h-4 text-[#1565D8] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-slate-500">Instagram</span>
                  <a
                    href="https://www.instagram.com/vlengenharia.mec"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-300 transition-colors"
                  >
                    @vlengenharia.mec
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#1565D8] shrink-0 mt-0.5" />
                <span className="text-xs text-slate-400 leading-snug">
                  Recife, Região Metropolitana (RMR) e todo interior de Pernambuco.
                </span>
              </li>
            </ul>
          </div>

          {/* Plantão & Agilidade */}
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Atendimento em até 24h
            </span>
            <h5 className="text-white font-bold text-sm">Emergências Regulatórias</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fiscalizações do Ministério do Trabalho, exigências de seguradoras ou auditorias urgentes com emissão ágil de ART.
            </p>
            <a
              href="https://wa.me/5581984442592?text=Preciso%20de%20atendimento%20de%20urg%C3%AAncia%20para%20fiscaliza%C3%A7%C3%A3o%2Flaudo."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full text-center py-2 px-3 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
            >
              Acionar Engenheiro de Plantão
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} VL Engenharia Mecânica. Todos os direitos reservados.
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/privacidade"
              className="hover:text-white transition-colors underline underline-offset-4"
            >
              Política de Privacidade & LGPD
            </Link>

            {/* Discreet restricted access link as requested in spec */}
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-300 transition-colors"
              title="Área Administrativa do Responsável Técnico"
            >
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Acesso Restrito</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
