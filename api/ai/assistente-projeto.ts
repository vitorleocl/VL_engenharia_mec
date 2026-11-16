import type { Request, Response } from 'express';
import { app } from '../../server';

// Explicit Vercel function route for the engineering project copilot.
export default function handler(request: Request, response: Response) {
  return app(request, response);
}
