import React, { useState } from 'react';
import { useAuth, MASTER_EMAIL } from '../../context/AuthContext';
import { 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight,
  Send, 
  CheckCircle2, 
  Lock, 
  Loader2, 
  LogOut, 
  ShieldCheck, 
  UserCheck 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const LoginView: React.FC = () => {
  const { 
    currentUser, 
    loading, 
    unauthorizedAttempt, 
    authError,
    loginWithGoogle, 
    loginAsMasterDirect,
    solicitarAcesso,
    logout,
    clearUnauthorized,
    clearAuthError
  } = useAuth();
  
  const [solicitacaoEnviada, setSolicitacaoEnviada] = useState(false);
  const [motivoSolicitacao, setMotivoSolicitacao] = useState('');
  const [enviandoSolicitacao, setEnviandoSolicitacao] = useState(false);

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
    setSolicitacaoEnviada(false);
    clearAuthError();
    try {
      await loginAsMasterDirect();
    } catch (err) {
      console.error('Erro ao acessar como Master:', err);
    }
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

  // Se já houver um usuário autenticado, exibe o cartão da sessão ativa com opção de prosseguir ou trocar de conta
  if (currentUser) {
    return (
      <div className="relative min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
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
              Sessão Ativa no Sistema
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Você já está autenticado na plataforma da VL Engenharia.
            </p>
          </div>

          <div className="mt-8 bg-slate-800 py-8 px-6 sm:px-10 rounded-2xl border border-slate-700 shadow-2xl space-y-6">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Usuário Conectado</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-sm font-bold text-white">{currentUser.nome}</p>
              <p className="text-xs text-slate-400 font-mono">{currentUser.email}</p>
              {currentUser.crea && (
                <p className="text-[11px] text-emerald-400 font-semibold">CREA-PE: {currentUser.crea}</p>
              )}
            </div>

            <div className="space-y-3">
              <Link
                to="/admin"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1565D8] hover:bg-blue-600 text-white font-bold text-sm shadow-lg transition-all active:scale-98"
              >
                <span>Acessar Painel Administrativo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={async () => {
                  await logout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-600 hover:border-red-500 text-slate-300 hover:text-red-300 hover:bg-red-950/20 text-xs font-semibold transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Desconectar / Entrar com Outra Conta</span>
              </button>
            </div>

            <div className="pt-2 text-center border-t border-slate-700/60">
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
  }

  return (
    <div className="relative min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* TELA DE CARREGAMENTO ESTÉTICA VL ENGENHARIA AO LOGAR */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md px-4 transition-all">
          <div className="relative flex flex-col items-center max-w-sm w-full text-center">
            {/* Efeito de halo suave */}
            <div className="absolute -top-14 w-60 h-60 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

            {/* Cartão da Logo Oficial com borda brilhante */}
            <div className="relative mb-6">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-blue-600 via-sky-400 to-indigo-500 opacity-75 blur-md animate-pulse"></div>
              <div className="relative bg-white p-5 rounded-2xl shadow-2xl border border-white/20">
                <img
                  src="/logo.png"
                  alt="VL Engenharia"
                  className="h-16 w-auto object-contain drop-shadow-sm"
                />
              </div>
            </div>

            {/* Nome da Empresa */}
            <h3 className="text-xl font-black text-white tracking-wider uppercase mb-1">
              VL ENGENHARIA
            </h3>
            <p className="text-xs font-semibold text-blue-400 tracking-wide mb-6">
              Área Técnica e Administrativa
            </p>

            {/* Barra de Progresso e Indicador de Autenticação */}
            <div className="w-full max-w-xs space-y-3">
              <div className="relative w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-500 rounded-full animate-pulse"></div>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-300">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                <span>Autenticando sessão com o Google...</span>
              </div>
            </div>
          </div>
        </div>
      )}

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
          
          {/* Alerta de erro de autenticação */}
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
                O acesso à plataforma é restrito ao e-mail master (<strong>{MASTER_EMAIL}</strong>) e aos colaboradores previamente homologados pelo responsável técnico.
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

          {/* Opções de Autenticação */}
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

            {/* Acesso Direto Master para o Responsável Técnico */}
            <div className="pt-2">
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-700"></div>
                <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Responsável Técnico
                </span>
                <div className="flex-grow border-t border-slate-700"></div>
              </div>

              <button
                type="button"
                onClick={handleLoginMaster}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-xs shadow-md transition-all active:scale-98 disabled:opacity-50 cursor-pointer border border-blue-500/30"
                title="Acesso Imediato com perfil de Administrador Master (Eng. Vitor Leonardo - CREA-PE 1822299490)"
              >
                <ShieldCheck className="w-4 h-4 text-sky-300" />
                <span>Entrar como Eng. Vitor Leonardo (Master)</span>
              </button>
            </div>
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
