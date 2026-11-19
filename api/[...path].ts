import type { IncomingMessage, ServerResponse } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Handler da API usado pela Vercel.
 *
 * Usa apenas módulos nativos do Node: o bundle de função da Vercel não inclui as
 * dependências do package.json, então importar Express (ou server.ts) fazia TODA
 * rota /api cair com FUNCTION_INVOCATION_FAILED — e isso quebrava a troca de
 * checklists entre desktop e celular.
 */

const DATA_FILE = process.env.VERCEL
  ? path.join('/tmp', 'app_storage.json')
  : path.join(process.cwd(), 'data', 'app_storage.json');

const FICTITIOUS_IDS = {
  clientes: new Set(['cli-01', 'cli-02', 'cli-03']),
  ativos: new Set(['atv-01', 'atv-02', 'atv-03', 'atv-pgx7098']),
  orcamentos: new Set(['orc-01', 'orc-02', 'orc-03', 'orc-2026-002', 'orc-adf-pgx7098', 'orc-1789155592909']),
  laudos: new Set(['lau-2025-045', 'lau-2026-003', 'lau-2026-001']),
  checklistsCampo: new Set(['chk-01', 'chk-02']),
  agenda: new Set(['ag-01', 'ag-02']),
  usuarios: new Set(['usr-colab-1', 'usr-cli-1']),
};

function getItemTimestamp(item: any): number {
  const raw = item?.atualizadoEm || item?.criadoEm || 0;
  const t = new Date(raw).getTime();
  return Number.isFinite(t) ? t : 0;
}

function mergeCollectionSafely(
  currentList: any[],
  incomingList: any[] | undefined,
  removedSet: Set<string>,
  fictitiousSet: Set<string>,
  idField: 'id' | 'uid' = 'id'
): any[] {
  const map = new Map<string, any>();
  if (Array.isArray(currentList)) {
    for (const item of currentList) {
      const id = item?.[idField];
      if (!id || removedSet.has(id) || fictitiousSet.has(id)) continue;
      map.set(id, item);
    }
  }
  if (Array.isArray(incomingList)) {
    for (const item of incomingList) {
      const id = item?.[idField];
      if (!id || removedSet.has(id) || fictitiousSet.has(id)) continue;
      const atual = map.get(id);
      if (!atual) {
        map.set(id, item);
      } else {
        map.set(id, getItemTimestamp(item) >= getItemTimestamp(atual)
          ? { ...atual, ...item }
          : atual);
      }
    }
  }
  return Array.from(map.values());
}

function lerArmazenamento(): Record<string, any> {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) || {};
    }
  } catch (erro) {
    // Na Vercel o filesystem é efêmero; o Firestore continua sendo a fonte confiável.
    console.warn('[API] Falha ao ler armazenamento local:', erro);
  }
  return {};
}

function salvarArmazenamento(dados: Record<string, any>): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(dados, null, 2), 'utf-8');
}

function responder(res: ServerResponse, status: number, dados: unknown): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(dados));
}

function lerCorpo(req: IncomingMessage): Promise<Record<string, any>> {
  return new Promise((resolve) => {
    const partes: Buffer[] = [];
    req.on('data', (parte: Buffer) => partes.push(Buffer.from(parte)));
    req.on('end', () => {
      try {
        const texto = Buffer.concat(partes).toString('utf-8');
        resolve(texto ? JSON.parse(texto) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

async function obterAppDados(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const data = lerArmazenamento();
  const rem = (chave: string) => new Set<string>(data[chave] || []);
  const cliRem = rem('clientesRemovidosIds');
  const atvRem = rem('ativosRemovidosIds');
  const orcRem = rem('orcamentosRemovidosIds');
  const lauRem = rem('laudosRemovidosIds');
  const chkRem = rem('checklistsRemovidosIds');
  const agRem = rem('agendaRemovidosIds');
  const usrRem = rem('usuariosRemovidosIds');

  const filtrar = (chave: string, removidos: Set<string>, ficticios: Set<string>, campo: 'id' | 'uid' = 'id') => {
    if (Array.isArray(data[chave])) {
      data[chave] = data[chave].filter(
        (item: any) => !removidos.has(item?.[campo]) && !ficticios.has(item?.[campo])
      );
    }
  };
  filtrar('clientes', cliRem, FICTITIOUS_IDS.clientes);
  filtrar('ativos', atvRem, FICTITIOUS_IDS.ativos);
  filtrar('orcamentos', orcRem, FICTITIOUS_IDS.orcamentos);
  filtrar('laudos', lauRem, FICTITIOUS_IDS.laudos);
  filtrar('checklistsCampo', chkRem, FICTITIOUS_IDS.checklistsCampo);
  filtrar('agenda', agRem, FICTITIOUS_IDS.agenda);
  filtrar('usuarios', usrRem, FICTITIOUS_IDS.usuarios, 'uid');

  responder(res, 200, data);
}

async function salvarAppDados(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const corpo = await lerCorpo(req);
  const atual = lerArmazenamento();
  const combinado = (chave: string) => Array.from(new Set<string>([
    ...(Array.isArray(atual[chave]) ? atual[chave] : []),
    ...(Array.isArray(corpo[chave]) ? corpo[chave] : []),
  ]));

  const removidos: Record<string, string[]> = {};
  for (const chave of [
    'clientesRemovidosIds', 'ativosRemovidosIds', 'orcamentosRemovidosIds',
    'laudosRemovidosIds', 'checklistsRemovidosIds', 'agendaRemovidosIds', 'usuariosRemovidosIds',
  ]) {
    removidos[chave] = combinado(chave);
  }

  const merged: Record<string, any> = {
    ...atual,
    ...corpo,
    ...removidos,
    updatedAt: new Date().toISOString(),
  };
  merged.clientes = mergeCollectionSafely(atual.clientes, corpo.clientes, new Set(removidos.clientesRemovidosIds), FICTITIOUS_IDS.clientes);
  merged.ativos = mergeCollectionSafely(atual.ativos, corpo.ativos, new Set(removidos.ativosRemovidosIds), FICTITIOUS_IDS.ativos);
  merged.orcamentos = mergeCollectionSafely(atual.orcamentos, corpo.orcamentos, new Set(removidos.orcamentosRemovidosIds), FICTITIOUS_IDS.orcamentos);
  merged.laudos = mergeCollectionSafely(atual.laudos, corpo.laudos, new Set(removidos.laudosRemovidosIds), FICTITIOUS_IDS.laudos);
  merged.checklistsCampo = mergeCollectionSafely(
    atual.checklistsCampo, corpo.checklistsCampo,
    new Set(removidos.checklistsRemovidosIds), FICTITIOUS_IDS.checklistsCampo
  );
  merged.agenda = mergeCollectionSafely(atual.agenda, corpo.agenda, new Set(removidos.agendaRemovidosIds), FICTITIOUS_IDS.agenda);
  merged.usuarios = mergeCollectionSafely(atual.usuarios, corpo.usuarios, new Set(removidos.usuariosRemovidosIds), FICTITIOUS_IDS.usuarios, 'uid');

  salvarArmazenamento(merged);
  responder(res, 200, { success: true, savedAt: merged.updatedAt });
}

async function proxyImagem(req: IncomingMessage, res: ServerResponse, url: URL): Promise<void> {
  const alvo = String(url.searchParams.get('url') || '');
  if (!/^https:\/\/(firebasestorage\.googleapis\.com|storage\.googleapis\.com)\//i.test(alvo)) {
    responder(res, 400, { error: 'URL de imagem não permitida.' });
    return;
  }
  try {
    const resposta = await fetch(alvo);
    if (!resposta.ok) {
      responder(res, 502, { error: 'Não foi possível obter a imagem.' });
      return;
    }
    const contentType = resposta.headers.get('content-type') || 'image/jpeg';
    if (!contentType.startsWith('image/')) {
      responder(res, 415, { error: 'Conteúdo não é uma imagem.' });
      return;
    }
    const buffer = Buffer.from(await resposta.arrayBuffer());
    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.end(buffer);
  } catch {
    responder(res, 502, { error: 'Falha ao carregar a imagem.' });
  }
}

export default async function handler(request: IncomingMessage, response: ServerResponse): Promise<void> {
  const url = new URL(String(request.url || '/'), 'http://localhost');
  const caminho = url.pathname;
  const metodo = String(request.method || 'GET').toUpperCase();

  try {
    if (caminho === '/api/health' || caminho === '/health') {
      responder(response, 200, { status: 'ok', company: 'VL Engenharia', timestamp: new Date().toISOString() });
      return;
    }
    if (caminho === '/api/app-data' && metodo === 'GET') {
      await obterAppDados(request, response);
      return;
    }
    if (caminho === '/api/app-data' && metodo === 'POST') {
      await salvarAppDados(request, response);
      return;
    }
    if (caminho === '/api/proxy-image' && metodo === 'GET') {
      await proxyImagem(request, response, url);
      return;
    }
    responder(response, 404, { error: 'Rota não encontrada.' });
  } catch (erro: any) {
    console.error('[API] Falha ao processar requisição:', erro);
    responder(response, 500, { error: erro?.message || 'Erro interno.' });
  }
}
