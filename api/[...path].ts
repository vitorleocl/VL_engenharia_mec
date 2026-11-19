import type { Request, Response } from 'express';
import { app } from '../server';

// Vercel routes every /api/* request through the Express app.
export default function handler(request: Request, response: Response) {
  return app(request, response);
}
