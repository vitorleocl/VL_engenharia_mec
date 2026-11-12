import { ChecklistCampo } from '../types';

const DB_NAME = 'vl_field_offline_db';
const DB_VERSION = 1;

const STORE_DRAFTS = 'drafts';
const STORE_QUEUE = 'syncQueue';
const STORE_CONFLICTS = 'conflicts';

export interface OfflineChecklistDraft {
  id: string; // checklist id or 'new' or temp id
  payload: ChecklistCampo;
  baseUpdatedAt?: string;
  localUpdatedAt: string;
  dirty: boolean;
  dirtyFieldsCount: number;
}

export interface OfflineSyncQueueItem {
  id: string;
  checklistId: string;
  action: 'create' | 'update' | 'finalize';
  payload: ChecklistCampo;
  baseUpdatedAt?: string;
  enqueuedAt: string;
  attempts: number;
  lastError?: string;
}

export interface OfflineSyncConflict {
  id: string;
  checklistId: string;
  numero: string;
  detectedAt: string;
  localVersion: ChecklistCampo;
  remoteVersion: ChecklistCampo;
  resolved: boolean;
}

function openOfflineDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB indisponível neste navegador.'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_DRAFTS)) {
        db.createObjectStore(STORE_DRAFTS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_QUEUE)) {
        db.createObjectStore(STORE_QUEUE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_CONFLICTS)) {
        db.createObjectStore(STORE_CONFLICTS, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('Falha ao abrir IndexedDB.'));
  });
}

async function idbGetAll<T>(storeName: string): Promise<T[]> {
  try {
    const db = await openOfflineDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result || []) as T[]);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`[OfflineDB] Fallback getAll(${storeName}):`, err);
    return [];
  }
}

async function idbGet<T>(storeName: string, key: string): Promise<T | null> {
  try {
    const db = await openOfflineDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve((req.result as T) || null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

async function idbPut<T>(storeName: string, value: T): Promise<void> {
  try {
    const db = await openOfflineDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(value);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`[OfflineDB] Erro put(${storeName}):`, err);
  }
}

async function idbDelete(storeName: string, key: string): Promise<void> {
  try {
    const db = await openOfflineDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`[OfflineDB] Erro delete(${storeName}, ${key}):`, err);
  }
}

// =====================================
// API Pública de Persistência Offline B6
// =====================================

export async function saveDraftOffline(draft: OfflineChecklistDraft): Promise<void> {
  await idbPut(STORE_DRAFTS, draft);
}

export async function getDraftOffline(id: string): Promise<OfflineChecklistDraft | null> {
  return idbGet<OfflineChecklistDraft>(STORE_DRAFTS, id);
}

export async function getAllDraftsOffline(): Promise<OfflineChecklistDraft[]> {
  return idbGetAll<OfflineChecklistDraft>(STORE_DRAFTS);
}

export async function removeDraftOffline(id: string): Promise<void> {
  await idbDelete(STORE_DRAFTS, id);
}

export async function enqueueSync(item: Omit<OfflineSyncQueueItem, 'attempts'> & { attempts?: number }): Promise<void> {
  // Coalesce por checklistId para manter a fila enxuta e preservando a última versão local
  const existingQueue = await idbGetAll<OfflineSyncQueueItem>(STORE_QUEUE);
  const previousForSameChecklist = existingQueue.find(q => q.checklistId === item.checklistId);

  const entry: OfflineSyncQueueItem = {
    ...item,
    id: previousForSameChecklist ? previousForSameChecklist.id : item.id,
    action: previousForSameChecklist?.action === 'create' && item.action !== 'create'
      ? 'create'
      : item.action,
    baseUpdatedAt: previousForSameChecklist?.baseUpdatedAt || item.baseUpdatedAt,
    attempts: item.attempts ?? 0,
  };
  await idbPut(STORE_QUEUE, entry);
}

export async function getPendingQueue(): Promise<OfflineSyncQueueItem[]> {
  return idbGetAll<OfflineSyncQueueItem>(STORE_QUEUE);
}

export async function removeFromQueue(id: string): Promise<void> {
  await idbDelete(STORE_QUEUE, id);
}

export async function recordConflict(conflict: OfflineSyncConflict): Promise<void> {
  await idbPut(STORE_CONFLICTS, conflict);
}

export async function getConflicts(): Promise<OfflineSyncConflict[]> {
  const all = await idbGetAll<OfflineSyncConflict>(STORE_CONFLICTS);
  return all.filter(c => !c.resolved);
}

export async function resolveConflictInStore(id: string): Promise<void> {
  await idbDelete(STORE_CONFLICTS, id);
}

/**
 * Conta o total de itens pendentes de sincronização (fila + rascunhos locais sujos ainda não enviados)
 */
export async function countPendingSyncItems(): Promise<number> {
  const [queue, drafts] = await Promise.all([getPendingQueue(), getAllDraftsOffline()]);
  const dirtyDraftIds = new Set(drafts.filter(d => d.dirty).map(d => d.id));
  queue.forEach(q => dirtyDraftIds.add(q.checklistId));
  return dirtyDraftIds.size;
}
