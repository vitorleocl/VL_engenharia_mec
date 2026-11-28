import type { IncomingMessage, ServerResponse } from 'node:http';
import firebaseConfig from '../../firebase-applet-config.json';

// Arquivos com _ no início não viram rotas na Vercel.
export function responder(res: ServerResponse, status: number, dados: unknown): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(dados));
}

export function lerCorpo(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    const partes: Buffer[] = [];
    req.on('data', (p: Buffer) => partes.push(Buffer.from(p)));
    req.on('end', () => {
      try {
        const t = Buffer.concat(partes).toString('utf-8');
        resolve(t ? JSON.parse(t) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

/** Confere o token de login do Firebase e se o e-mail é o autorizado. */
export async function usuarioAutorizado(req: IncomingMessage): Promise<boolean> {
  const auth = String(req.headers['authorization'] || '');
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const apiKey = (firebaseConfig as any).apiKey || process.env.VITE_FIREBASE_API_KEY;
  const master = (process.env.MASTER_EMAIL || process.env.VITE_MASTER_EMAIL || '').trim().toLowerCase();
  if (!token || !apiKey || !master) return false;
  try {
    const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token }),
    });
    if (!r.ok) return false;
    const j: any = await r.json();
    const u = j?.users?.[0];
    return Boolean(u?.email) && String(u.email).toLowerCase() === master && u.emailVerified !== false;
  } catch {
    return false;
  }
}

