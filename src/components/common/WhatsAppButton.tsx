import React, { useState, useEffect, useRef } from 'react';

const OPCOES_SERVICO = [
  { nome: 'Adequação NR-12 e projetos', norma: 'NR-12' },
  { nome: 'Laudo de munck ou guindaste', norma: 'NR-11' },
  { nome: 'Laudo de máquinas pesadas', norma: 'NR-11' },
  { nome: 'PMOC e projetos de HVAC-R', norma: 'Lei 13.589' },
  { nome: 'Outro orçamento rápido', norma: '' },
];

export const WhatsAppButton: React.FC = () => {
  const VITOR_PHOTO_DEFAULT = 'https://www.vlengenhariamecanica.com.br/assets/image-Ca17hHDt.png';
  const [isOpen, setIsOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>(VITOR_PHOTO_DEFAULT);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstOptionRef = useRef<HTMLAnchorElement>(null);

  // Sync photo with localStorage['vl-p'] if available, else use official URL
  useEffect(() => {
    try {
      const saved = localStorage.getItem('vl-p');
      if (saved) setPhotoUrl(saved);
      else setPhotoUrl(VITOR_PHOTO_DEFAULT);
    } catch {
      setPhotoUrl(VITOR_PHOTO_DEFAULT);
    }
  }, []);

  // Keyboard navigation & Esc key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      firstOptionRef.current?.focus();
    }
  }, [isOpen]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const closePanel = () => {
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        ref={buttonRef}
        type="button"
        id="wf"
        className="wa-fab"
        aria-expanded={isOpen}
        aria-controls="wp"
        aria-label={isOpen ? 'Fechar atendimento por WhatsApp' : 'Abrir atendimento por WhatsApp'}
        onClick={toggleOpen}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-[30px] h-[30px]">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm5.3 14c-.2.6-1.3 1.2-1.8 1.2-.5.1-1.1.1-3.6-.9-3-1.3-4.9-4.3-5-4.5-.1-.2-1.2-1.6-1.2-3s.8-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l2 .9c.3.1.5.2.5.3.1.2.1.8-.1 1.4z" />
        </svg>
      </button>

      {/* Popover Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          id="wp"
          className="wpn"
          data-open=""
          role="dialog"
          aria-label="Atendimento por WhatsApp"
        >
          {/* Header Card */}
          <div className="bg-[var(--navy)] text-white p-3.5 flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full bg-[var(--blue)] bg-cover bg-center flex items-center justify-center font-bold text-white flex-none overflow-hidden border border-white/20"
              style={photoUrl ? { backgroundImage: `url(${photoUrl})` } : undefined}
            >
              {!photoUrl && 'V'}
            </div>
            <div>
              <b className="font-[family-name:var(--d)] text-[16.5px] block font-bold leading-tight">
                Eng. Vitor Leonardo
              </b>
              <small className="text-[#B5C5DA] text-[13px] block">
                CREA-PE 1822299490 · responde no mesmo dia útil
              </small>
            </div>
            <button
              type="button"
              onClick={closePanel}
              className="ml-auto bg-transparent border-0 text-white text-[24px] leading-none cursor-pointer p-1 hover:opacity-80"
              aria-label="Fechar janela de atendimento"
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-[var(--card)]">
            <div className="bg-[var(--paper)] border border-[var(--line)] rounded-[4px_12px_12px_12px] p-3 mb-3.5 text-[15.5px] leading-snug text-[var(--ink)]">
              Olá! Qual serviço você quer orçar? Escolha uma opção e eu já abro a conversa com o assunto preenchido.
            </div>

            {/* List of 5 Options */}
            <div className="space-y-0 border-t-2 border-[var(--ink)]">
              {OPCOES_SERVICO.map((item, index) => (
                <a
                  key={index}
                  ref={index === 0 ? firstOptionRef : undefined}
                  href={`https://wa.me/5581984442592?text=${encodeURIComponent('Olá, quero orçar: ' + item.nome)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2.5 py-2.5 px-3 border-b border-[var(--line)] text-decoration-none font-semibold text-[15px] text-[var(--ink)] hover:bg-[var(--paper)] transition-colors focus:bg-[var(--paper)] focus:outline-none"
                >
                  <span>{item.nome}</span>
                  {item.norma && (
                    <span className="text-[var(--muted)] text-[13px] font-normal whitespace-nowrap">
                      {item.norma}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-2.5 py-3 px-4 border-t border-[var(--line)] text-[13.5px] text-[var(--muted)] bg-[var(--paper)]">
            <span>Atendimento em todo PE, com ART</span>
            <a
              href="https://wa.me/5581984442592?text=Ol%C3%A1%2C%20quero%20um%20or%C3%A7amento."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tech wa sm text-[13px] py-1.5 px-2.5"
            >
              Abrir WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  );
};
