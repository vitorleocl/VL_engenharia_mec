import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
}

interface ComboboxSelectProps {
  value: string;
  options: ComboboxOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  ariaLabel?: string;
  className?: string;
}

/** Remove acentos para que "nr12" encontre "NR-12" e "comunicacao" encontre "Comunicação". */
function normalizar(texto: string): string {
  return texto
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Select pesquisável: o usuário digite e as opções filtradas aparecem.
 * Navegação por teclado (↑/↓/Enter/Esc) e seleção por clique.
 */
export const ComboboxSelect: React.FC<ComboboxSelectProps> = ({
  value,
  options,
  onChange,
  placeholder = 'Digite para buscar...',
  emptyMessage = 'Nenhuma opção encontrada.',
  ariaLabel,
  className = '',
}) => {
  const [aberto, setAberto] = useState(false);
  const [termo, setTermo] = useState('');
  const [indiceAtivo, setIndiceAtivo] = useState(0);
  const raizRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listaId = useId();

  const selecionada = options.find(opcao => opcao.value === value);

  const filtradas = useMemo(() => {
    const busca = normalizar(termo.trim());
    if (!busca) return options;
    return options.filter(opcao =>
      normalizar(`${opcao.label} ${opcao.description || ''}`).includes(busca)
    );
  }, [options, termo]);

  useEffect(() => {
    setIndiceAtivo(0);
  }, [termo]);

  useEffect(() => {
    if (!aberto) return;
    const aoClicarFora = (evento: MouseEvent) => {
      if (raizRef.current && !raizRef.current.contains(evento.target as Node)) {
        setAberto(false);
        setTermo('');
      }
    };
    document.addEventListener('mousedown', aoClicarFora);
    return () => document.removeEventListener('mousedown', aoClicarFora);
  }, [aberto]);

  const abrir = () => {
    setTermo(selecionada?.label || '');
    setIndiceAtivo(0);
    setAberto(true);
    // Seleciona o texto atual para que digitar substitua a busca, não acumule.
    window.requestAnimationFrame(() => inputRef.current?.select());
  };

  const selecionar = (opcao: ComboboxOption) => {
    onChange(opcao.value);
    setAberto(false);
    setTermo('');
  };

  const aoTeclar = (evento: React.KeyboardEvent<HTMLInputElement>) => {
    if (evento.key === 'ArrowDown') {
      evento.preventDefault();
      setAberto(true);
      setIndiceAtivo(indice => Math.min(indice + 1, Math.max(filtradas.length - 1, 0)));
    } else if (evento.key === 'ArrowUp') {
      evento.preventDefault();
      setIndiceAtivo(indice => Math.max(indice - 1, 0));
    } else if (evento.key === 'Enter') {
      evento.preventDefault();
      if (aberto && filtradas[indiceAtivo]) selecionar(filtradas[indiceAtivo]);
    } else if (evento.key === 'Escape') {
      setAberto(false);
      setTermo('');
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={raizRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)]" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-label={ariaLabel}
          aria-expanded={aberto}
          aria-controls={listaId}
          aria-autocomplete="list"
          autoComplete="off"
          value={aberto ? termo : selecionada?.label || ''}
          placeholder={placeholder}
          onFocus={abrir}
          onChange={(evento) => {
            setTermo(evento.target.value);
            setAberto(true);
          }}
          onKeyDown={aoTeclar}
          className="w-full py-2.5 pl-8 pr-8 text-sm border border-[var(--line)] rounded-xl bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[#1565D8]"
        />
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
      </div>

      {aberto && (
        <ul
          id={listaId}
          role="listbox"
          className="absolute left-0 right-0 z-40 mt-1 max-h-60 overflow-y-auto rounded-xl border border-[var(--line)] bg-[var(--card)] p-1 shadow-2xl"
        >
          {filtradas.length === 0 && (
            <li className="px-3 py-2.5 text-xs text-[var(--muted)]">{emptyMessage}</li>
          )}
          {filtradas.map((opcao, indice) => (
            <li key={opcao.value} role="option" aria-selected={opcao.value === value}>
              <button
                type="button"
                onMouseDown={(evento) => evento.preventDefault()}
                onClick={() => selecionar(opcao)}
                onMouseEnter={() => setIndiceAtivo(indice)}
                className={`flex w-full items-start justify-between gap-2 rounded-lg px-3 py-2 text-left transition-colors ${
                  indice === indiceAtivo ? 'bg-[var(--paper)]' : 'hover:bg-[var(--paper)]'
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-[var(--ink)]">{opcao.label}</span>
                  {opcao.description && (
                    <span className="block truncate text-xs text-[var(--muted)]">{opcao.description}</span>
                  )}
                </span>
                {opcao.value === value && (
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1565D8]" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
