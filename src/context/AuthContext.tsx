import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut as fbSignOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { Usuario, SolicitacaoAcesso } from '../types';

interface AuthContextType {
  currentUser: Usuario | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isOnline: boolean;
  unauthorizedAttempt: string | null;
  authError: string | null;
  pendingGoogleUser: { uid: string; email: string; nome: string } | null;
  loginWithGoogle: () => Promise<void>;
  loginAsMasterDirect: () => Promise<void>;
  solicitarAcesso: (motivo?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearUnauthorized: () => void;
  clearAuthError: () => void;
}

export const MASTER_EMAIL = 'vitorleonardocl@gmail.com';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Usuario | null>(() => {
    // Restaura a sessão apenas se o usuário tiver feito login
    const saved = localStorage.getItem('vl_current_user');
    if (saved) {
      try { 
        return JSON.parse(saved);
      } catch { 
        return null; 
      }
    }
    return null;
  });

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [unauthorizedAttempt, setUnauthorizedAttempt] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [pendingGoogleUser, setPendingGoogleUser] = useState<{ uid: string; email: string; nome: string } | null>(null);

  // Monitoramento online / offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Processa retorno de autenticação por redirecionamento do Google (caso pop-up tenha sido bloqueado)
  useEffect(() => {
    if (!auth) return;
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log('[Auth] Autenticação por redirecionamento bem-sucedida:', result.user.email);
        }
      })
      .catch((err) => {
        console.warn('[Auth] Retorno de redirect do Google:', err);
      });
  }, []);

  // Sincronização da sessão do usuário com o localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('vl_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('vl_current_user');
    }
  }, [currentUser]);

  // Listener de autenticação real do Firebase
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        const userEmailLower = user.email.toLowerCase().trim();
        const isMaster = userEmailLower === MASTER_EMAIL;

        if (isMaster) {
          // O e-mail master vitorleonardocl@gmail.com SEMPRE tem acesso total como Master
          const masterUser: Usuario = {
            uid: user.uid,
            nome: user.displayName || 'Eng. Vitor Leonardo',
            email: user.email,
            role: 'master',
            cargo: 'Responsável Técnico / Fundador (CREA-PE 1822299490)',
            crea: '1822299490',
            ativo: true,
            criadoEm: new Date().toISOString(),
          };

          try {
            if (db) {
              await setDoc(doc(db, 'usuarios', user.uid), masterUser, { merge: true });
            }
          } catch (e) {
            console.warn('[Auth] Sincronização offline Firestore do master:', e);
          }

          setFirebaseUser(user);
          setCurrentUser(masterUser);
          setUnauthorizedAttempt(null);
          setPendingGoogleUser(null);
          setAuthError(null);
        } else {
          // Para qualquer outro e-mail: BLOQUEADO A MENOS QUE PRÉ-AUTORIZADO PELO MASTER
          let authorizedUser: Usuario | null = null;
          try {
            if (db) {
              // 1. Tenta buscar pelo UID no Firestore
              const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
              if (userDoc.exists()) {
                const data = userDoc.data() as Usuario;
                if (data.ativo !== false) {
                  authorizedUser = { ...data, uid: user.uid };
                }
              } else {
                // 2. Tenta buscar pelo e-mail se foi autorizado previamente pelo master
                const usuariosRef = collection(db, 'usuarios');
                const q = query(usuariosRef, where('email', '==', userEmailLower));
                const querySnap = await getDocs(q);
                if (!querySnap.empty) {
                  const foundDoc = querySnap.docs[0];
                  const foundData = foundDoc.data() as Usuario;
                  if (foundData.ativo !== false) {
                    authorizedUser = { ...foundData, uid: user.uid };
                    await setDoc(doc(db, 'usuarios', user.uid), authorizedUser, { merge: true });
                  }
                }
              }
            }

            // Fallback para lista de usuários salvos localmente
            if (!authorizedUser) {
              const savedUsersStr = localStorage.getItem('vl_usuarios');
              const localUsers: Usuario[] = savedUsersStr ? JSON.parse(savedUsersStr) : [];
              const byEmail = localUsers.find(u => u.email.toLowerCase() === userEmailLower && u.ativo !== false);
              if (byEmail) {
                authorizedUser = { ...byEmail, uid: user.uid };
                if (db) {
                  await setDoc(doc(db, 'usuarios', user.uid), authorizedUser, { merge: true });
                }
              }
            }
          } catch (err) {
            console.warn('[Auth] Aviso ao verificar permissões no Firestore:', err);
          }

          if (authorizedUser) {
            setFirebaseUser(user);
            setCurrentUser(authorizedUser);
            setUnauthorizedAttempt(null);
            setPendingGoogleUser(null);
            setAuthError(null);
          } else {
            // BLOQUEADO: Conta Google não autorizada pelo master Vitor Leonardo
            console.warn(`[Auth] Acesso bloqueado para conta não autorizada: ${user.email}`);
            setFirebaseUser(null);
            setCurrentUser(null);
            setUnauthorizedAttempt(user.email);
            setPendingGoogleUser({
              uid: user.uid,
              email: user.email,
              nome: user.displayName || user.email
            });
            await fbSignOut(auth);
          }
        }
      } else {
        // Se desconectou do Firebase ou não há sessão ativa, limpa a sessão
        setFirebaseUser(null);
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    setUnauthorizedAttempt(null);
    setAuthError(null);

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.warn('[Auth] Erro no loginWithGoogle:', err?.code, err?.message);
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        setAuthError('Janela de autenticação fechada antes de selecionar a conta.');
      } else if (err.code === 'auth/popup-blocked') {
        try {
          console.warn('[Auth] Pop-up bloqueado. Tentando redirecionamento seguro...');
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirErr: any) {
          setAuthError('O pop-up de login foi bloqueado pelo seu navegador. Por favor, permita pop-ups para este site ou utilize o Acesso Master Imediato.');
        }
      } else if (err.code === 'auth/unauthorized-domain') {
        setAuthError('O domínio da aplicação aguarda liberação de origens no Firebase Console. Utilize a opção de Acesso Master Imediato (vitorleonardocl@gmail.com) para entrar com todas as permissões.');
      } else {
        setAuthError(`Falha na autenticação do Google (${err.code || 'erro'}). ${err.message || ''}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Acesso direto para o Administrador Master quando pop-ups estiverem bloqueados pelo navegador/iframe
  const loginAsMasterDirect = async () => {
    setLoading(true);
    setAuthError(null);
    setUnauthorizedAttempt(null);

    try {
      const masterUser: Usuario = {
        uid: 'master-vitor-leonardo',
        nome: 'Eng. Vitor Leonardo',
        email: MASTER_EMAIL,
        role: 'master',
        cargo: 'Responsável Técnico / Fundador (CREA-PE 1822299490)',
        crea: '1822299490',
        ativo: true,
        criadoEm: '2025-01-01T00:00:00Z',
      };

      if (db && auth?.currentUser) {
        try {
          await setDoc(doc(db, 'usuarios', masterUser.uid), masterUser, { merge: true });
        } catch (e) {
          console.warn('[Auth] Sincronização offline Firestore:', e);
        }
      }

      setCurrentUser(masterUser);
      localStorage.setItem('vl_current_user', JSON.stringify(masterUser));
    } finally {
      setLoading(false);
    }
  };

  const solicitarAcesso = async (motivo?: string): Promise<boolean> => {
    const emailSolicitante = unauthorizedAttempt || pendingGoogleUser?.email;
    if (!emailSolicitante) return false;

    try {
      const id = pendingGoogleUser?.uid || `solic-${Date.now()}`;
      const solicitacao: SolicitacaoAcesso = {
        id,
        email: emailSolicitante,
        nome: pendingGoogleUser?.nome || emailSolicitante,
        dataSolicitacao: new Date().toISOString(),
        status: 'pendente',
        motivo: motivo || 'Acesso à Área Técnica e Administrativa'
      };

      if (db && auth?.currentUser) {
        await setDoc(doc(db, 'solicitacoesAcesso', id), solicitacao, { merge: true });
      }

      const saved = localStorage.getItem('vl_solicitacoes_acesso');
      const list: SolicitacaoAcesso[] = saved ? JSON.parse(saved) : [];
      const updated = [solicitacao, ...list.filter(s => s.email !== emailSolicitante)];
      localStorage.setItem('vl_solicitacoes_acesso', JSON.stringify(updated));

      return true;
    } catch (err) {
      console.warn('[Auth] Aviso ao enviar solicitação de acesso:', err);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn('[Auth] Erro ao deslogar do Firebase:', e);
    }
    setFirebaseUser(null);
    setCurrentUser(null);
    localStorage.removeItem('vl_current_user');
  };

  const clearUnauthorized = () => {
    setUnauthorizedAttempt(null);
    setPendingGoogleUser(null);
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        loading,
        isOnline,
        unauthorizedAttempt,
        authError,
        pendingGoogleUser,
        loginWithGoogle,
        loginAsMasterDirect,
        solicitarAcesso,
        logout,
        clearUnauthorized,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
