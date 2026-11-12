import { auth } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

const QUOTA_BLOCK_STORAGE_KEY = 'vl_firestore_write_quota_until';
const QUOTA_COOLDOWN_MS = 15 * 60 * 1000; // 15 min cooldown after hitting daily quota
let writeQuotaBlockedUntilMemory = 0;

export function isQuotaExceededError(error: unknown): boolean {
  const errMessage = error instanceof Error ? error.message : String(error ?? '');
  const errCode = typeof error === 'object' && error !== null && 'code' in error ? String((error as { code?: unknown }).code) : '';
  return (
    errCode === 'resource-exhausted' ||
    errMessage.includes('resource-exhausted') ||
    errMessage.includes('Quota limit exceeded') ||
    errMessage.includes('Quota exceeded')
  );
}

export function markFirestoreWriteQuotaBlocked(): void {
  const until = Date.now() + QUOTA_COOLDOWN_MS;
  writeQuotaBlockedUntilMemory = until;
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(QUOTA_BLOCK_STORAGE_KEY, String(until));
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(QUOTA_BLOCK_STORAGE_KEY, String(until));
    }
  } catch {
    // Ignore storage errors
  }
}

export function isFirestoreWriteQuotaBlocked(): boolean {
  const now = Date.now();
  if (writeQuotaBlockedUntilMemory > now) {
    return true;
  }
  try {
    const raw =
      (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(QUOTA_BLOCK_STORAGE_KEY)) ||
      (typeof localStorage !== 'undefined' && localStorage.getItem(QUOTA_BLOCK_STORAGE_KEY));
    if (raw) {
      const parsed = Number(raw);
      if (Number.isFinite(parsed) && parsed > now) {
        writeQuotaBlockedUntilMemory = parsed;
        return true;
      }
      // Expired cooldown
      if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(QUOTA_BLOCK_STORAGE_KEY);
      if (typeof localStorage !== 'undefined') localStorage.removeItem(QUOTA_BLOCK_STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
  return false;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMessage = error instanceof Error ? error.message : String(error);
  const isQuotaExceeded = isQuotaExceededError(error);

  if (isQuotaExceeded) {
    markFirestoreWriteQuotaBlocked();
  }

  const errInfo: FirestoreErrorInfo = {
    error: errMessage,
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };

  if (isQuotaExceeded) {
    console.warn('[Firestore Cota Diária Excedida - Modo Local Ativo]', `Operação: ${operationType} em ${path}`);
    return errInfo;
  }

  console.error('[Firestore Error]', JSON.stringify(errInfo));
  return errInfo;
}
