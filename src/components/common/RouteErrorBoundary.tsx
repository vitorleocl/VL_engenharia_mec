import React from 'react';

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
}

interface RouteErrorBoundaryState {
  error: Error | null;
}

export class RouteErrorBoundary extends React.Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  state: RouteErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): RouteErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[Rota administrativa] Erro de renderização:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <section role="alert" className="m-4 rounded-xl border border-rose-500/40 bg-rose-500/10 p-5 text-[var(--adm-text)]">
          <h2 className="font-bold">Não foi possível abrir esta tela</h2>
          <p className="mt-2 text-sm text-[var(--adm-mut)]">
            O erro foi registrado no console do navegador. Recarregue a página; se persistir, envie esta mensagem ao suporte.
          </p>
          <pre className="mt-3 overflow-auto whitespace-pre-wrap rounded-lg bg-black/20 p-3 text-xs text-rose-300">
            {this.state.error.message || 'Erro de renderização sem mensagem.'}
          </pre>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 min-h-10 rounded-lg bg-[var(--adm-blue,#2160db)] px-4 text-sm font-semibold text-white"
          >
            Recarregar tela
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}
