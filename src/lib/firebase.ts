import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  getFirestore, 
  Firestore
} from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'vl-engenharia.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'vl-engenharia-app',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'vl-engenharia-app.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '520053391223',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:520053391223:web:vlengenharia',
};

export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID
);

let app: any;
let db: Firestore | null = null;
let auth: Auth | null = null;
const googleProvider = new GoogleAuthProvider();

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  
  if (isFirebaseConfigured) {
    try {
      db = initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      });
    } catch {
      db = getFirestore(app);
    }
    auth = getAuth(app);
  }
} catch (e) {
  console.warn('Firebase initialized in local/offline fallback mode:', e);
}

export { app, db, auth, googleProvider };
