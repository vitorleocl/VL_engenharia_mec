import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import { Usuario, UserRole } from '../types';

interface AuthContextType {
  currentUser: Usuario | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isOnline: boolean;
  unauthorizedAttempt: string | null;
  loginWithGoogle: () => Promise<void>;
  loginDemo: (role?: UserRole, email?: string, name?: string) => void;
  logout: () => Promise<void>;
  clearUnauthorized: () => void;
}

const MASTER_EMAIL = import.meta.env.VITE_MASTER_EMAIL || 'vitorleonardocl@gmail.com';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Usuario | null>(() => {
    const saved = localStorage.getItem('vl_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    // Default preloaded master session for seamless dev experience
    return {
      uid: 'master-vitor',
      nome: 'Eng. Vitor Leonardo',
      email: MASTER_EMAIL,
      role: 'master',
      cargo: 'Responsável Técnico / Fundador (CREA-PE 1822299490)',
      criadoEm: '2025-01-01T00:00:00Z',
    };
  });

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [unauthorizedAttempt, setUnauthorizedAttempt] = useState<string | null>(null);

  // Online / Offline listener
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

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('vl_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('vl_current_user');
    }
  }, [currentUser]);

  // Firebase auth state change
  useEffect(() => {
    if (!auth || !isFirebaseConfigured) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user && user.email) {
        // Check authorization
        if (user.email.toLowerCase() === MASTER_EMAIL.toLowerCase()) {
          const masterUser: Usuario = {
            uid: user.uid,
            nome: user.displayName || 'Vitor Leonardo',
            email: user.email,
            role: 'master',
            cargo: 'Engenheiro Mecânico (CREA-PE 1822299490)',
            criadoEm: new Date().toISOString(),
          };
          setCurrentUser(masterUser);
          setUnauthorizedAttempt(null);
        } else {
          // Check if authorized in registered users list
          const savedUsersStr = localStorage.getItem('vl_usuarios');
          const savedUsers: Usuario[] = savedUsersStr ? JSON.parse(savedUsersStr) : [];
          const found = savedUsers.find(u => u.email.toLowerCase() === user.email?.toLowerCase());

          if (found) {
            setCurrentUser(found);
            setUnauthorizedAttempt(null);
          } else {
            // Unauthorized
            await fbSignOut(auth);
            setCurrentUser(null);
            setUnauthorizedAttempt(user.email);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    setUnauthorizedAttempt(null);

    if (auth && isFirebaseConfigured) {
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (err: any) {
        console.error('Erro no Google Sign-In do Firebase:', err);
        // Fallback to interactive demo login if Firebase keys are placeholder
        loginDemo('master');
      } finally {
        setLoading(false);
      }
    } else {
      // Demo sign-in simulation with Vitor Leonardo Master
      loginDemo('master');
      setLoading(false);
    }
  };

  const loginDemo = (role: UserRole = 'master', email = MASTER_EMAIL, name = 'Eng. Vitor Leonardo') => {
    const user: Usuario = {
      uid: role === 'master' ? 'master-vitor' : `user-${Date.now()}`,
      nome: name,
      email: email,
      role: role,
      cargo: role === 'master' 
        ? 'Responsável Técnico (CREA-PE 1822299490)' 
        : role === 'colaborador' 
        ? 'Inspetor Técnico de Campo' 
        : 'Cliente Corporativo',
      criadoEm: new Date().toISOString(),
    };
    setCurrentUser(user);
    setUnauthorizedAttempt(null);
  };

  const logout = async () => {
    if (auth && isFirebaseConfigured) {
      try {
        await fbSignOut(auth);
      } catch (e) {
        console.error(e);
      }
    }
    setCurrentUser(null);
  };

  const clearUnauthorized = () => {
    setUnauthorizedAttempt(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        loading,
        isOnline,
        unauthorizedAttempt,
        loginWithGoogle,
        loginDemo,
        logout,
        clearUnauthorized,
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
