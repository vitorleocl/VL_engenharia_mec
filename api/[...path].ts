import type { Request, Response } from 'express';

// Handler diagnóstico temporário: identifica qual módulo falha ao ser carregado
// dentro da função serverless da Vercel.
export default async function handler(_request: Request, response: Response) {
  const modulos = [
    'express',
    'dotenv',
    '@google/genai',
    '../src/lib/motorLaudoCausaRaiz',
    '../server',
  ];
  const resultados: Record<string, string> = {};
  for (const modulo of modulos) {
    try {
      const carregado: any = await import(modulo);
      resultados[modulo] = 'OK ' + Object.keys(carregado || {}).slice(0, 6).join(',');
    } catch (erro: any) {
      resultados[modulo] = 'FALHOU: ' + (erro?.message || String(erro));
    }
  }
  return response.status(200).json(resultados);
}
