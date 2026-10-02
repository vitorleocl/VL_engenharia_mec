import React, { useState } from 'react';
import { useAuth, MASTER_EMAIL } from '../../context/AuthContext';
import { Shield, AlertCircle, ArrowLeft, Send, CheckCircle2, Lock, KeyRound } from 'lucide-react';
import { Link, useNavigate, Navigate } from 'react-router-dom';

export const LoginView: React.FC = () => {
  const { 
    currentUser, 
    loading, 
    unauthorizedAttempt, 
    authError,
    loginWithGoogle, 
    loginAsMasterDirect,
    solicitarAcesso,
    clearUnauthorized,
    clearAuthError
  } = useAuth();
  
  const [solicitacaoEnviada, setSolicitacaoEnviada] = useState(false);
  const [motivoSolicitacao, setMotivoSolicitacao] = useState('');
  const [enviandoSolicitacao, setEnviandoSolicitacao] = useState(false);

  // Redireciona para o painel administrativo se já estiver autenticado
  if (currentUser) {
    return <Navigate to="/admin" replace />;
  }

  const handleLoginGoogle = async () => {
    setSolicitacaoEnviada(false);
    clearAuthError();
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error('Erro ao autenticar com Google:', err);
    }
  };

  const handleLoginMaster = async () => {
    clearAuthError();
    clearUnauthorized();
    await loginAsMasterDirect();
  };

  const handleEnviarSolicitacao = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviandoSolicitacao(true);
    const ok = await solicitarAcesso(motivoSolicitacao.trim());
    setEnviandoSolicitacao(false);
    if (ok) {
      setSolicitacaoEnviada(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        <div className="text-center">
          <Link to="/" className="inline-block p-3 bg-white rounded-2xl shadow-xl mb-4 hover:scale-105 transition-transform">
            <img
              src="/logo.png"
              alt="VL Engenharia"
              className="h-12 w-auto mx-auto object-contain"
            />
          </Link>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Área Técnica e Administrativa
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Acesso restrito com Conta Google autorizada.
          </p>
        </div>

        <div className="mt-8 bg-slate-800 py-8 px-6 sm:px-10 rounded-2xl border border-slate-700 shadow-2xl space-y-6">
          
          {/* Alerta de erro de autenticação (ex: pop-up bloqueado pelo navegador) */}
          {authError && (
            <div className="p-4 rounded-xl bg-amber-950/80 border border-amber-600 text-amber-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Aviso de Conexão</span>
              </div>
              <p className="leading-relaxed">{authError}</p>
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={clearAuthError}
                  className="text-[11px] text-amber-400 underline font-semibold cursor-pointer"
                >
                  Fechar aviso
                </button>
                <button
                  onClick={handleLoginMaster}
                  className="text-[11px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 px-2 py-1 rounded font-bold transition-colors cursor-pointer"
                >
                  Entrar como Master
                </button>
              </div>
            </div>
          )}

          {/* Notificação de tentativa de acesso não autorizada */}
          {unauthorizedAttempt && (
            <div className="p-4 rounded-xl bg-red-950/90 border border-red-700 text-red-200 text-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-red-400">
                <Lock className="w-4 h-4 text-red-400 shrink-0" />
                <span>Acesso Bloqueado • Liberação Pendente</span>
              </div>
              <p className="leading-relaxed">
                A Conta Google <strong className="text-white underline">{unauthorizedAttempt}</strong> não está na lista de usuários autorizados da VL Engenharia.
              </p>
              <p className="text-[11px] text-red-300">
                O acesso à plataforma é restrito ao e-mail master (<strong>{MASTER_EMAIL}</strong>) e aos colaboradores ou clientes previamente homologados pelo responsável técnico.
              </p>

              {!solicitacaoEnviada ? (
                <form onSubmit={handleEnviarSolicitacao} className="pt-2 border-t border-red-900/60 space-y-2">
                  <label className="block text-[11px] font-semibold text-red-200">
                    Solicitar autorização de acesso ao Eng. Vitor Leonardo:
                  </label>
                  <input
                    type="text"
                    value={motivoSolicitacao}
                    onChange={(e) => setMotivoSolicitacao(e.target.value)}
                    placeholder="Seu nome, empresa ou cargo (ex: Inspetor João)"
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-red-800 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:ring-1 focus:ring-red-500"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={enviandoSolicitacao}
                      className="flex-1 py-2 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{enviandoSolicitacao ? 'Enviando...' : 'Enviar Pedido ao Master'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={clearUnauthorized}
                      className="py-2 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs cursor-pointer"
                    >
                      Voltar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-3 rounded bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Pedido de Acesso Enviado!</span>
                  </div>
                  <p className="text-[11px]">
                    Sua solicitação foi enviada ao Engenheiro Vitor Leonardo ({MASTER_EMAIL}). Assim que ele liberar na gestão de usuários, você poderá entrar com esta mesma conta.
                  </p>
                  <button
                    onClick={clearUnauthorized}
                    className="mt-2 text-[11px] underline font-semibold text-emerald-400 cursor-pointer block"
                  >
                    Tentar com outra conta
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Botão Oficial: Login com Conta Google */}
          <div className="space-y-3">
            <button
              onClick={handleLoginGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-slate-600 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm shadow-md transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{loading ? 'Abrindo autenticação...' : 'Entrar com Conta Google'}</span>
            </button>

            {/* Divisor */}
            <div className="relative flex py-2 items-center">
              <div className="grow border-t border-slate-700"></div>
              <span className="shrink mx-3 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                Acesso do Engenheiro Titular
              </span>
              <div className="grow border-t border-slate-700"></div>
            </div>

            {/* Acesso Master Imediato para Vitor Leonardo */}
            <button
              onClick={handleLoginMaster}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs shadow-lg transition-all active:scale-98 cursor-pointer border border-blue-500/30"
            >
              <KeyRound className="w-4 h-4 text-blue-200 shrink-0" />
              <div className="text-left">
                <span className="block leading-tight">Acesso Master ({MASTER_EMAIL})</span>
                <span className="block text-[10px] text-blue-200 font-normal">Entrar direto com perfil de Responsável Técnico</span>
              </div>
            </button>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-300">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Segurança e Governança</span>
            </div>
            <p>
              Somente a conta <strong>{MASTER_EMAIL}</strong> possui permissão de administrador master. Qualquer outra conta que tentar entrar ficará retida até aprovação expressa.
            </p>
          </div>

          <div className="pt-1 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar para o site institucional</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
