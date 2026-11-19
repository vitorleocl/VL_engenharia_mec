import type { Request, Response } from 'express';

// Handler mínimo temporário para isolar a falha de invocação na Vercel.
export default function handler(request: Request, response: Response) {
  const url = String(request.url || '');
  if (url.startsWith('/api/health') || url === '/health') {
    return response.status(200).json({ status: 'ok', company: 'VL Engenharia' });
  }
  return response.status(404).json({ error: 'Rota não encontrada.' });
}
