import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, CheckCircle2 } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '5581984442592',
  defaultMessage = 'Olá, Eng. Vitor Leonardo! Gostaria de solicitar um orçamento para serviços de engenharia mecânica da VL Engenharia.'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);

  // Auto-prompt after 4 seconds to subtly catch attention without being intrusive
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  const buildWhatsAppUrl = (customText?: string) => {
    const message = customText || defaultMessage;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  const quickTopics = [
    { label: 'Adequação NR-12 & Projetos', text: 'Olá, Eng. Vitor Leonardo! Gostaria de um orçamento para Adequação à NR-12 e Projetos Mecânicos na minha empresa.' },
    { label: 'Laudo de Munck / Guindaste', text: 'Olá, Eng. Vitor! Preciso de orçamento para Laudo Técnico e Inspeção de Caminhão Munck / Guindaste com ART.' },
    { label: 'Laudo de Máquinas Pesadas', text: 'Olá, Eng. Vitor! Gostaria de orçamento para Laudo de Máquinas e Equipamentos Pesados (Linha Amarela).' },
    { label: 'PMOC / Climatização', text: 'Olá, Eng. Vitor! Preciso de um orçamento para implantação e laudo de PMOC para sistemas de ar-condicionado.' },
    { label: 'Outro Orçamento Rápido', text: 'Olá, Eng. Vitor Leonardo! Gostaria de solicitar uma avaliação e orçamento técnico personalizado.' },
  ];

  return (
    <aside
      id="whatsapp-fixed-container"
      aria-label="Atendimento via WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 pointer-events-auto"
    >
      {/* Expanded Quick Contact Card */}
      {isOpen && (
        <div
          id="whatsapp-chat-preview"
          className="w-80 sm:w-88 rounded-2xl bg-white shadow-2xl border border-slate-200/90 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 transition-all text-slate-800"
        >
          {/* Header Card */}
          <div className="bg-[#0B1E3D] text-white p-4 relative">
            <button
              id="whatsapp-preview-close"
              onClick={() => {
                setIsOpen(false);
                setShowNotificationBadge(false);
              }}
              className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Fechar janela de contato"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#1565D8] flex items-center justify-center font-bold text-white text-sm shadow-md border border-white/20">
                  VL
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] border-2 border-[#0B1E3D]"></span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5 leading-none">
                  Eng. Vitor Leonardo
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-200 font-mono">
                    CREA-PE
                  </span>
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse"></span>
                  Online agora • Resposta rápida
                </p>
              </div>
            </div>
          </div>

          {/* Body Message */}
          <div className="p-4 bg-slate-50 space-y-3">
            <div className="bg-white p-3 rounded-xl rounded-tl-xs shadow-xs border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
              <p className="font-medium text-slate-900 mb-1">
                Olá! Seja bem-vindo à VL Engenharia. 👋
              </p>
              <p>
                Qual serviço técnico você deseja cotar hoje? Clique em uma das opções abaixo ou inicie a conversa direta:
              </p>
            </div>

            {/* Quick Topic Chips */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">
                Escolha seu serviço:
              </p>
              <div className="flex flex-col gap-1.5">
                {quickTopics.map((topic, index) => (
                  <a
                    key={index}
                    id={`whatsapp-topic-${index}`}
                    href={buildWhatsAppUrl(topic.text)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-xs text-slate-700 hover:text-emerald-800 transition-all font-medium group text-left"
                  >
                    <span>{topic.label}</span>
                    <Send className="w-3 h-3 text-slate-400 group-hover:text-[#25D366] transition-transform group-hover:translate-x-0.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Direct CTA */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Atendimento em todo PE com ART</span>
            </div>
            <a
              id="whatsapp-card-direct-send"
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba5c] text-white text-xs font-bold shadow-sm transition-colors"
            >
              <span>Abrir WhatsApp</span>
              <Send className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div className="relative flex items-center group">
        
        {/* Floating Tooltip Label on hover */}
        {!isOpen && (
          <span className="hidden sm:inline-block absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-slate-900/90 backdrop-blur-xs text-white text-xs font-semibold shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Solicitar Orçamento no WhatsApp
            <span className="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-slate-900/90"></span>
          </span>
        )}

        {/* Pulse Radar Wave */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-35 animate-ping pointer-events-none"></span>

        {/* Primary Action Button */}
        <a
          id="btn-whatsapp-flutuante"
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            // If the preview wasn't open on desktop, allow clicking or toggling
            if (!isOpen && window.innerWidth >= 640) {
              // Open card preview if first interaction, but link still operates on second or direct
            }
          }}
          aria-label="Solicitar orçamento via WhatsApp com Eng. Vitor Leonardo"
          className="relative flex items-center justify-center w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#25D366] hover:bg-[#20ba5c] text-white shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-hidden focus:ring-4 focus:ring-emerald-300"
        >
          <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-white/20 stroke-white stroke-[2.2]" />

          {/* Unread Alert Dot */}
          {showNotificationBadge && !isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[9px] font-bold text-white items-center justify-center border-2 border-white">
                1
              </span>
            </span>
          )}
        </a>

        {/* Toggle Preview Button (small badge on button for mobile/desktop toggle) */}
        <button
          id="btn-whatsapp-toggle-preview"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
            setShowNotificationBadge(false);
          }}
          aria-label={isOpen ? "Fechar balão de mensagens" : "Opções rápidas de orçamento"}
          className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-slate-900 border-2 border-white text-white flex items-center justify-center text-[10px] hover:bg-slate-800 transition-colors shadow-sm"
          title={isOpen ? "Minimizar" : "Opções rápidas"}
        >
          {isOpen ? <X className="w-3 h-3" /> : <span className="font-bold">?</span>}
        </button>
      </div>
    </aside>
  );
};
