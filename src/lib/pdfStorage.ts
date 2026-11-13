import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from './firebase';

const DB_NAME = 'vl_engenharia_pdfs';
const STORE_NAME = 'laudos_assinados';

function openPdfDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB indisponível neste navegador.'));
      return;
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('Falha ao abrir IndexedDB.'));
  });
}

export async function salvarPdfIndexedDb(laudoId: string, file: Blob): Promise<string> {
  const db = await openPdfDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(file, laudoId);
    tx.oncomplete = () => {
      db.close();
      resolve(`idb://${laudoId}`);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error || new Error('Erro ao salvar PDF no navegador.'));
    };
  });
}

export async function lerPdfIndexedDb(laudoId: string): Promise<Blob | null> {
  try {
    const db = await openPdfDb();
    return await new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(laudoId);
      req.onsuccess = () => {
        db.close();
        resolve((req.result as Blob) || null);
      };
      req.onerror = () => {
        db.close();
        resolve(null);
      };
    });
  } catch {
    return null;
  }
}

export async function removerPdfIndexedDb(laudoId: string): Promise<void> {
  try {
    const db = await openPdfDb();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(laudoId);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        resolve();
      };
    });
  } catch {
    // ignore
  }
}

export async function tentarUploadFirebaseStorage(
  laudoId: string,
  file: File
): Promise<string | null> {
  try {
    if (!storage || !auth?.currentUser) return null;
    const safeName = file.name.replace(/[^\w.\-() ]+/g, '_').slice(0, 120);
    const storageRef = ref(storage, `laudos/${laudoId}/${Date.now()}-${safeName}`);
    await uploadBytes(storageRef, file, { contentType: 'application/pdf' });
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (err) {
    console.warn('Upload via Firebase Storage indisponível, usando fallback local:', err);
    return null;
  }
}

export async function resolverUrlPdfVisualizacao(url: string, laudoId: string): Promise<{
  src: string;
  isBlobUrl: boolean;
}> {
  if (url.startsWith('idb://')) {
    const id = url.slice('idb://'.length) || laudoId;
    const blob = await lerPdfIndexedDb(id);
    if (!blob) {
      throw new Error('Arquivo PDF local não encontrado neste navegador.');
    }
    return { src: URL.createObjectURL(blob), isBlobUrl: true };
  }
  return { src: url, isBlobUrl: false };
}
