import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link, useNavigate, Navigate } from 'react-router-dom';

export const LoginView: React.FC = () => {
  const { 
    currentUser, 
    loading, 
    unauthorizedAttempt, 
    loginWithGoogle, 
    clearUnauthorized 
  } = useAuth();
  const navigate = useNavigate();

  // Redirect to admin panel if already logged in
  if (currentUser) {
    return <Navigate to="/admin" replace />;
  }

  const handleLoginGoogle = async () => {
    try {
      await loginWithGoogle();
      navigate('/admin', { replace: true });
    } catch (err) {
      console.error('Erro ao autenticar com Google:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        <div className="text-center">
          <Link to="/" className="inline-block p-3 bg-white rounded-2xl shadow-xl mb-4">
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
          
          {/* Unauthorized attempt notification */}
          {unauthorizedAttempt && (
            <div className="p-4 rounded-xl bg-red-950/80 border border-red-700 text-red-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-red-400">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Acesso não autorizado</span>
              </div>
              <p>
                A conta <strong>{unauthorizedAttempt}</strong> não possui permissão de acesso ao painel da VL Engenharia. Solicite liberação ao administrador Vitor Leonardo (vitorleonardocl@gmail.com).
              </p>
              <button
                onClick={clearUnauthorized}
                className="text-[11px] text-red-300 underline font-semibold cursor-pointer"
              >
                Tentar com outra conta
              </button>
            </div>
          )}

          {/* Real Google Sign-in */}
          <div>
            <button
              onClick={handleLoginGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-slate-600 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm shadow-md transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              <span>{loading ? 'Autenticando...' : 'Entrar com Conta Google'}</span>
            </button>
          </div>

          <div className="pt-2 text-center">
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
