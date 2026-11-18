import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { initializeApp as initializeAdminApp, cert, getApps as getAdminApps, applicationDefault } from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";
import { createHash, createHmac, timingSafeEqual } from "crypto";
import { resolveMx, resolveTxt } from "dns/promises";
import { dentroJanelaComercial, limiteDiarioAtingido } from "./src/lib/prospeccaoPolicy";
import { GoogleGenAI } from "@google/genai";
import { 
  gerarLaudoCausaRaizOffline, 
  construirPromptSistemaCausaRaiz, 
  construirPromptUsuarioCausaRaiz, 
  DadosEntradaCausaRaiz 
} from "./src/lib/motorLaudoCausaRaiz";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: false, limit: "2kb" }));

const MASTER_EMAILS = new Set([
  "vitorleonardocl@gmail.com",
  "vlengenhariamec@gmail.com",
  "atendimento@vlengenhariamecanica.com.br",
]);

function getProspeccaoAdminApp() {
  if (getAdminApps().length) return getAdminApps()[0];
  const rawCredentials = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (rawCredentials) {
    const credentials = JSON.parse(rawCredentials);
    return initializeAdminApp({ credential: cert(credentials) });
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return initializeAdminApp({ credential: applicationDefault() });
  }
  return null;
}

function getProspeccaoDb() {
  const adminApp = getProspeccaoAdminApp();
  if (!adminApp) return null;
  const databaseId = process.env.FIRESTORE_DATABASE_ID || process.env.VITE_FIRESTORE_DATABASE_ID;
  return databaseId ? getAdminFirestore(adminApp, databaseId) : getAdminFirestore(adminApp);
}

function sha256(value: string) {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function unsubscribeSecret() {
  return process.env.PROSPECCAO_UNSUBSCRIBE_SECRET || "";
}

function signUnsubscribePayload(payload: Record<string, unknown>) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", unsubscribeSecret()).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function verifyUnsubscribeToken(token: string): Record<string, any> | null {
  const [body, signature] = token.split(".");
  if (!body || !signature || !unsubscribeSecret()) return null;
  const expected = createHmac("sha256", unsubscribeSecret()).update(body).digest();
  let actual: Buffer;
  try {
    actual = Buffer.from(signature, "base64url");
  } catch {
    return null;
  }
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

async function verifyProspeccaoMaster(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const db = getProspeccaoDb();
    if (!db) return res.status(503).json({ error: "Firebase Admin não configurado no servidor." });
    const authorization = String(req.headers.authorization || "");
    const match = authorization.match(/^Bearer\s+(.+)$/i);
    if (!match) return res.status(401).json({ error: "Sessão necessária." });
    const decoded = await getAdminAuth(getProspeccaoAdminApp()!).verifyIdToken(match[1]);
    const email = String(decoded.email || "").toLowerCase();
    let isMaster = MASTER_EMAILS.has(email) || decoded.role === "master" || decoded.master === true;
    if (!isMaster) {
      const user = await db.collection("usuarios").doc(decoded.uid).get();
      isMaster = user.exists && user.data()?.role === "master" && user.data()?.ativo !== false;
    }
    if (!isMaster) return res.status(403).json({ error: "Acesso restrito ao MASTER." });
    (req as any).prospeccaoUser = { uid: decoded.uid, email };
    (req as any).prospeccaoDb = db;
    return next();
  } catch (error: any) {
    console.error("[Prospecção] Falha ao validar sessão:", error?.message);
    return res.status(401).json({ error: "Sessão inválida ou expirada." });
  }
}

const unsubscribeRateLimit = new Map<string, { count: number; resetAt: number }>();
function limitPublicUnsubscribe(req: express.Request, res: express.Response, next: express.NextFunction) {
  const key = String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown").split(",")[0].trim();
  const now = Date.now();
  const state = unsubscribeRateLimit.get(key);
  if (!state || state.resetAt <= now) {
    unsubscribeRateLimit.set(key, { count: 1, resetAt: now + 60_000 });
    return next();
  }
  if (state.count >= 20) return res.status(429).send("Muitas solicitações. Tente novamente em alguns minutos.");
  state.count += 1;
  return next();
}

const DATA_FILE = path.join(process.cwd(), "data", "app_storage.json");

const FICTITIOUS_IDS = {
  clientes: new Set(["cli-01", "cli-02", "cli-03"]),
  ativos: new Set(["atv-01", "atv-02", "atv-03", "atv-pgx7098"]),
  orcamentos: new Set(["orc-01", "orc-02", "orc-03", "orc-2026-002", "orc-adf-pgx7098", "orc-1789155592909"]),
  laudos: new Set(["lau-2025-045", "lau-2026-003", "lau-2026-001"]),
  checklistsCampo: new Set(["chk-01", "chk-02"]),
  agenda: new Set(["ag-01", "ag-02"]),
  usuarios: new Set(["usr-colab-1", "usr-cli-1"]),
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
  idField: "id" | "uid" = "id"
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
      const existing = map.get(id);
      if (!existing) {
        map.set(id, item);
      } else {
        const tExisting = getItemTimestamp(existing);
        const tIncoming = getItemTimestamp(item);
        // Prefer incoming if newer or equal (allows deliberate edits even without updatedAt bump)
        map.set(id, tIncoming >= tExisting ? { ...existing, ...item } : existing);
      }
    }
  }

  return Array.from(map.values());
}

// Persistent App Data endpoints (guarantees data persistence across sessions, origins and browser reloads)
app.get("/api/app-data", (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      const data = JSON.parse(content);
      const cliRem = new Set<string>(data.clientesRemovidosIds || []);
      const atvRem = new Set<string>(data.ativosRemovidosIds || []);
      const orcRem = new Set<string>(data.orcamentosRemovidosIds || []);
      const lauRem = new Set<string>(data.laudosRemovidosIds || []);
      const chkRem = new Set<string>(data.checklistsRemovidosIds || []);
      const agRem = new Set<string>(data.agendaRemovidosIds || []);
      const usrRem = new Set<string>(data.usuariosRemovidosIds || []);

      if (Array.isArray(data.clientes)) {
        data.clientes = data.clientes.filter((c: any) => !cliRem.has(c.id) && !FICTITIOUS_IDS.clientes.has(c.id));
      }
      if (Array.isArray(data.ativos)) {
        data.ativos = data.ativos.filter((a: any) => !atvRem.has(a.id) && !FICTITIOUS_IDS.ativos.has(a.id));
      }
      if (Array.isArray(data.orcamentos)) {
        data.orcamentos = data.orcamentos.filter((o: any) => !orcRem.has(o.id) && !FICTITIOUS_IDS.orcamentos.has(o.id));
      }
      if (Array.isArray(data.laudos)) {
        data.laudos = data.laudos.filter((l: any) => !lauRem.has(l.id) && !FICTITIOUS_IDS.laudos.has(l.id));
      }
      if (Array.isArray(data.checklistsCampo)) {
        data.checklistsCampo = data.checklistsCampo.filter((ck: any) => !chkRem.has(ck.id) && !FICTITIOUS_IDS.checklistsCampo.has(ck.id));
      }
      if (Array.isArray(data.agenda)) {
        data.agenda = data.agenda.filter((ag: any) => !agRem.has(ag.id) && !FICTITIOUS_IDS.agenda.has(ag.id));
      }
      if (Array.isArray(data.usuarios)) {
        data.usuarios = data.usuarios.filter((u: any) => !usrRem.has(u.uid) && !FICTITIOUS_IDS.usuarios.has(u.uid));
      }
      return res.json(data);
    }
  } catch (err) {
    console.warn("Aviso ao ler app_storage.json:", err);
  }
  return res.json({});
});

app.post("/api/app-data", (req, res) => {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const currentData = fs.existsSync(DATA_FILE) ? JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) : {};

    const combineRemoved = (key: string) =>
      Array.from(new Set<string>([...(currentData[key] || []), ...(req.body[key] || [])]));

    const clientesRemovidosIds = combineRemoved("clientesRemovidosIds");
    const ativosRemovidosIds = combineRemoved("ativosRemovidosIds");
    const orcamentosRemovidosIds = combineRemoved("orcamentosRemovidosIds");
    const laudosRemovidosIds = combineRemoved("laudosRemovidosIds");
    const checklistsRemovidosIds = combineRemoved("checklistsRemovidosIds");
    const agendaRemovidosIds = combineRemoved("agendaRemovidosIds");
    const usuariosRemovidosIds = combineRemoved("usuariosRemovidosIds");

    const merged: Record<string, any> = {
      ...currentData,
      ...req.body,
      clientesRemovidosIds,
      ativosRemovidosIds,
      orcamentosRemovidosIds,
      laudosRemovidosIds,
      checklistsRemovidosIds,
      agendaRemovidosIds,
      usuariosRemovidosIds,
      updatedAt: new Date().toISOString(),
    };

    merged.clientes = mergeCollectionSafely(
      currentData.clientes,
      req.body.clientes,
      new Set(clientesRemovidosIds),
      FICTITIOUS_IDS.clientes
    );
    merged.ativos = mergeCollectionSafely(
      currentData.ativos,
      req.body.ativos,
      new Set(ativosRemovidosIds),
      FICTITIOUS_IDS.ativos
    );
    merged.orcamentos = mergeCollectionSafely(
      currentData.orcamentos,
      req.body.orcamentos,
      new Set(orcamentosRemovidosIds),
      FICTITIOUS_IDS.orcamentos
    );
    merged.laudos = mergeCollectionSafely(
      currentData.laudos,
      req.body.laudos,
      new Set(laudosRemovidosIds),
      FICTITIOUS_IDS.laudos
    );
    merged.checklistsCampo = mergeCollectionSafely(
      currentData.checklistsCampo,
      req.body.checklistsCampo,
      new Set(checklistsRemovidosIds),
      FICTITIOUS_IDS.checklistsCampo
    );
    merged.agenda = mergeCollectionSafely(
      currentData.agenda,
      req.body.agenda,
      new Set(agendaRemovidosIds),
      FICTITIOUS_IDS.agenda
    );
    merged.usuarios = mergeCollectionSafely(
      currentData.usuarios,
      req.body.usuarios,
      new Set(usuariosRemovidosIds),
      FICTITIOUS_IDS.usuarios,
      "uid"
    );

    const laudosRemovidosSet = new Set(laudosRemovidosIds);
    const baseTrabalhos = Array.isArray(req.body.trabalhosPublicados)
      ? req.body.trabalhosPublicados
      : (Array.isArray(currentData.trabalhosPublicados) ? currentData.trabalhosPublicados : []);
    merged.trabalhosPublicados = baseTrabalhos.filter(
      (t: any) => !laudosRemovidosSet.has(t?.laudoId || t?.id)
    );

    fs.writeFileSync(DATA_FILE, JSON.stringify(merged, null, 2), "utf-8");
    return res.json({ success: true, savedAt: merged.updatedAt });
  } catch (err: any) {
    console.error("Erro ao salvar app_storage.json:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.delete("/api/orcamentos/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (!fs.existsSync(DATA_FILE)) {
      return res.json({ success: true });
    }
    const currentData = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    const orcamentosRemovidosIds = Array.from(new Set([
      ...(currentData.orcamentosRemovidosIds || []),
      id
    ]));
    const orcRemovidos = new Set(orcamentosRemovidosIds);
    const orcamentos = Array.isArray(currentData.orcamentos)
      ? currentData.orcamentos.filter((o: any) => !orcRemovidos.has(o.id))
      : [];

    const updated = {
      ...currentData,
      orcamentos,
      orcamentosRemovidosIds,
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2), "utf-8");
    return res.json({ success: true, removedId: id });
  } catch (err: any) {
    console.error("Erro ao deletar orçamento em app_storage.json:", err);
    return res.status(500).json({ error: err.message });
  }
});

const LAUDOS_PDF_DIR = path.join(process.cwd(), "data", "uploads", "laudos");

function sanitizeSafeId(raw: string): string {
  return String(raw || "").replace(/[^a-zA-Z0-9_-]/g, "");
}

function readAppStorageSafe(): Record<string, any> {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) || {};
    }
  } catch (err) {
    console.warn("Erro ao ler app_storage.json:", err);
  }
  return {};
}

function writeAppStorageSafe(data: Record<string, any>) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

app.get("/api/trabalhos-publicados", (req, res) => {
  try {
    const data = readAppStorageSafe();
    const laudosRemSet = new Set<string>(data.laudosRemovidosIds || []);
    const lista = Array.isArray(data.trabalhosPublicados)
      ? data.trabalhosPublicados.filter((t: any) => t && !laudosRemSet.has(t.laudoId || t.id))
      : [];
    return res.json({ trabalhos: lista });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/trabalhos-publicados", (req, res) => {
  try {
    const data = readAppStorageSafe();
    const atual: any[] = Array.isArray(data.trabalhosPublicados) ? data.trabalhosPublicados : [];
    const { trabalho, trabalhos, removerId } = req.body || {};
    let proximaLista = [...atual];

    if (Array.isArray(trabalhos)) {
      proximaLista = trabalhos.filter((t: any) => t && t.id);
    } else if (removerId) {
      proximaLista = proximaLista.filter((t: any) => t.id !== removerId && t.laudoId !== removerId);
    } else if (trabalho && trabalho.id) {
      proximaLista = [
        trabalho,
        ...proximaLista.filter((t: any) => t.id !== trabalho.id && t.laudoId !== trabalho.id),
      ];
    } else {
      return res.status(400).json({ error: "Envie 'trabalho', 'trabalhos' ou 'removerId'." });
    }

    const updated = {
      ...data,
      trabalhosPublicados: proximaLista,
      updatedAt: new Date().toISOString(),
    };
    writeAppStorageSafe(updated);
    return res.json({ success: true, trabalhos: proximaLista });
  } catch (err: any) {
    console.error("Erro ao salvar trabalhos publicados:", err);
    return res.status(500).json({ error: err.message });
  }
});

const TRABALHOS_IMG_DIR = path.join(process.cwd(), "data", "uploads", "trabalhos");

app.post("/api/trabalhos-publicados/imagem", (req, res) => {
  try {
    const { dataUrl, nomeArquivo, trabalhoId } = req.body || {};
    if (!dataUrl || typeof dataUrl !== "string") {
      return res.status(400).json({ error: "Imagem não enviada." });
    }
    const match = dataUrl.match(/^data:image\/(png|jpeg|jpg|webp|gif);base64,(.+)$/i);
    if (!match) {
      return res.status(400).json({ error: "Formato de imagem inválido. Utilize JPG, PNG ou WebP." });
    }
    const extRaw = match[1].toLowerCase();
    const ext = extRaw === "jpeg" ? "jpg" : extRaw;
    const buffer = Buffer.from(match[2], "base64");
    if (!buffer.length || buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ error: "A imagem deve ter no máximo 10 MB." });
    }
    if (!fs.existsSync(TRABALHOS_IMG_DIR)) {
      fs.mkdirSync(TRABALHOS_IMG_DIR, { recursive: true });
    }
    const safeId = sanitizeSafeId(trabalhoId || `trab-${Date.now()}`) || `trab-${Date.now()}`;
    const filename = `${safeId}-${Date.now()}.${ext}`;
    fs.writeFileSync(path.join(TRABALHOS_IMG_DIR, filename), buffer);
    return res.json({
      success: true,
      url: `/api/trabalhos-publicados/imagem/${filename}`,
      nomeArquivo: String(nomeArquivo || filename),
    });
  } catch (err: any) {
    console.error("Erro ao salvar imagem de trabalho publicado:", err);
    return res.status(500).json({ error: err.message || "Falha ao salvar imagem." });
  }
});

app.get("/api/trabalhos-publicados/imagem/:filename", (req, res) => {
  try {
    const safeName = path.basename(String(req.params.filename || "")).replace(/[^a-zA-Z0-9_.-]/g, "");
    if (!safeName) {
      return res.status(400).json({ error: "Nome de arquivo inválido." });
    }
    const filePath = path.join(TRABALHOS_IMG_DIR, safeName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Imagem não encontrada." });
    }
    return res.sendFile(filePath);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

const handleUploadPdfAssinado = (req: express.Request, res: express.Response) => {
  try {
    const rawId = req.params.id || req.body?.laudoId || req.query?.id || "";
    const safeId = sanitizeSafeId(String(rawId));
    if (!safeId) {
      return res.status(400).json({ error: "Identificador do laudo inválido." });
    }

    if (!fs.existsSync(LAUDOS_PDF_DIR)) {
      fs.mkdirSync(LAUDOS_PDF_DIR, { recursive: true });
    }

    const { dataUrl, nomeArquivo, chunkData, chunkIndex, totalChunks, uploadId } = req.body || {};
    const safeFileName = String(nomeArquivo || `${safeId}-assinado.pdf`)
      .replace(/[^\w.\-() ]+/g, "_")
      .slice(0, 140);

    // Modo em partes (chunked) — evita limites de payload de proxy/servidor
    if (chunkData !== undefined && chunkIndex !== undefined && totalChunks !== undefined) {
      const idx = Number(chunkIndex);
      const total = Number(totalChunks);
      if (!Number.isInteger(idx) || !Number.isInteger(total) || idx < 0 || total <= 0 || idx >= total) {
        return res.status(400).json({ error: "Parâmetros de envio em partes inválidos." });
      }
      const safeUploadId = sanitizeSafeId(uploadId || "default") || "default";
      const partPath = path.join(LAUDOS_PDF_DIR, `${safeId}.${safeUploadId}.part`);
      const cleanB64 = String(chunkData).replace(/^data:[^;]+;base64,/, "");
      const chunkBuf = Buffer.from(cleanB64, "base64");

      if (idx === 0) {
        fs.writeFileSync(partPath, chunkBuf);
      } else {
        if (!fs.existsSync(partPath)) {
          return res.status(400).json({ error: "Sessão de upload interrompida. Tente enviar novamente." });
        }
        fs.appendFileSync(partPath, chunkBuf);
      }

      const stats = fs.statSync(partPath);
      if (stats.size > 30 * 1024 * 1024) {
        fs.unlinkSync(partPath);
        return res.status(413).json({ error: "O arquivo PDF excede o limite de 30 MB." });
      }

      if (idx < total - 1) {
        return res.json({ success: true, partial: true, chunkIndex: idx, bytesRecebidos: stats.size });
      }

      const finalBuffer = fs.readFileSync(partPath);
      const headerSample = finalBuffer.subarray(0, 1024).toString("latin1");
      if (!finalBuffer.length || !headerSample.includes("%PDF")) {
        fs.unlinkSync(partPath);
        return res.status(400).json({ error: "O arquivo enviado não possui cabeçalho PDF válido." });
      }

      const finalPath = path.join(LAUDOS_PDF_DIR, `${safeId}.pdf`);
      fs.renameSync(partPath, finalPath);

      return res.json({
        success: true,
        url: `/api/laudos/${safeId}/pdf-assinado`,
        nomeArquivo: safeFileName,
        tamanhoBytes: finalBuffer.length,
      });
    }

    // Modo envio único (compatibilidade)
    if (!dataUrl || typeof dataUrl !== "string") {
      return res.status(400).json({ error: "Arquivo PDF não enviado." });
    }

    const base64Match = dataUrl.match(/^data:[^;]+;base64,(.+)$/);
    const base64Body = base64Match ? base64Match[1] : dataUrl;
    const buffer = Buffer.from(base64Body, "base64");

    if (!buffer.length) {
      return res.status(400).json({ error: "Arquivo PDF vazio ou inválido." });
    }
    if (buffer.length > 30 * 1024 * 1024) {
      return res.status(413).json({ error: "O arquivo PDF excede o limite de 30 MB." });
    }
    if (!buffer.subarray(0, 1024).toString("latin1").includes("%PDF")) {
      return res.status(400).json({ error: "O arquivo enviado não possui cabeçalho PDF válido." });
    }

    const filePath = path.join(LAUDOS_PDF_DIR, `${safeId}.pdf`);
    fs.writeFileSync(filePath, buffer);

    return res.json({
      success: true,
      url: `/api/laudos/${safeId}/pdf-assinado`,
      nomeArquivo: safeFileName,
      tamanhoBytes: buffer.length,
    });
  } catch (err: any) {
    console.error("Erro ao salvar PDF assinado do laudo:", err);
    return res.status(500).json({ error: err.message || "Falha ao salvar PDF assinado." });
  }
};

const handleGetPdfAssinado = (req: express.Request, res: express.Response) => {
  try {
    const rawId = req.params.id || req.query?.id || "";
    const safeId = sanitizeSafeId(String(rawId));
    if (!safeId) {
      return res.status(400).json({ error: "Identificador inválido." });
    }
    const filePath = path.join(LAUDOS_PDF_DIR, `${safeId}.pdf`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "PDF assinado não encontrado." });
    }
    const download = req.query.download === "1";
    const fileName = String(req.query.nome || `laudo-${safeId}-assinado.pdf`).replace(/[^\w.\-() ]+/g, "_");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `${download ? "attachment" : "inline"}; filename="${fileName}"`);
    return res.sendFile(filePath);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

const handleDeletePdfAssinado = (req: express.Request, res: express.Response) => {
  try {
    const rawId = req.params.id || req.query?.id || req.body?.laudoId || "";
    const safeId = sanitizeSafeId(String(rawId));
    if (!safeId) {
      return res.status(400).json({ error: "Identificador inválido." });
    }
    const filePath = path.join(LAUDOS_PDF_DIR, `${safeId}.pdf`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

app.post("/api/laudo-pdf-assinado", handleUploadPdfAssinado);
app.get("/api/laudo-pdf-assinado", handleGetPdfAssinado);
app.delete("/api/laudo-pdf-assinado", handleDeletePdfAssinado);

app.post("/api/laudos/:id/pdf-assinado", handleUploadPdfAssinado);
app.get("/api/laudos/:id/pdf-assinado", handleGetPdfAssinado);
app.delete("/api/laudos/:id/pdf-assinado", handleDeletePdfAssinado);

// In-memory / server state fallback for AI usage
let monthlyAICalls = 0;
let currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
const MONTHLY_LIMIT = parseInt(process.env.GEMINI_MONTHLY_LIMIT || "500", 10);

function getMonthlyAICalls(): number {
  const monthNow = new Date().toISOString().slice(0, 7);
  if (monthNow !== currentMonth) {
    currentMonth = monthNow;
    monthlyAICalls = 0;
  }
  return monthlyAICalls;
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", company: "VL Engenharia", timestamp: new Date().toISOString() });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", company: "VL Engenharia", timestamp: new Date().toISOString() });
});

app.get("/api/prospeccao/status", verifyProspeccaoMaster, async (req, res) => {
  const email = String(process.env.ZOHO_FROM_EMAIL || "");
  const domain = email.split("@")[1] || "";
  const result: any = {
    apiDisponivel: true,
    providers: {
      cnpj: Boolean(process.env.PROSPECCAO_CNPJ_API_URL),
      places: Boolean(process.env.GOOGLE_PLACES_API_KEY),
    },
    smtp: { configurado: Boolean(process.env.ZOHO_SMTP_HOST && process.env.ZOHO_SMTP_USER && process.env.ZOHO_SMTP_PASS) },
    email: { spf: false, dkim: false, dmarc: false },
  };
  if (domain) {
    try {
      const txtRecords = await resolveTxt(domain);
      result.email.spf = txtRecords.flat().some((record) => record.toLowerCase().startsWith("v=spf1"));
    } catch { /* DNS ausente ou indisponível. */ }
    try {
      const dmarcRecords = await resolveTxt(`_dmarc.${domain}`);
      result.email.dmarc = dmarcRecords.flat().some((record) => record.toLowerCase().startsWith("v=dmarc1"));
    } catch { /* DNS ausente ou indisponível. */ }
    try {
      const selectors = (process.env.PROSPECCAO_DKIM_SELECTORS || "zoho,zoho._domainkey").split(",").map((item) => item.trim()).filter(Boolean);
      for (const selector of selectors) {
        const host = selector.includes("._domainkey") ? selector : `${selector}._domainkey`;
        try {
          const records = await resolveTxt(`${host}.${domain}`);
          if (records.flat().length) { result.email.dkim = true; break; }
        } catch { /* Tentar próximo seletor. */ }
      }
    } catch { /* Sem seletor. */ }
  }
  res.json(result);
});

app.post("/api/prospeccao/token-descadastro", verifyProspeccaoMaster, (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const phone = String(req.body?.telefoneE164 || "").trim();
  if (!email && !phone) return res.status(400).json({ error: "O lead precisa ter e-mail ou telefone para gerar o link." });
  if (!unsubscribeSecret()) return res.status(503).json({ error: "Configure PROSPECCAO_UNSUBSCRIBE_SECRET no servidor." });
  const token = signUnsubscribePayload({
    emailHash: email ? sha256(email) : "",
    telefoneHash: phone ? sha256(phone) : "",
    exp: Date.now() + 180 * 24 * 60 * 60 * 1000,
  });
  return res.json({ token });
});

app.get("/api/prospeccao/descadastrar", limitPublicUnsubscribe, async (req, res) => {
  const token = String(req.query.token || "");
  const payload = verifyUnsubscribeToken(token);
  if (!payload) return res.status(400).send("Link de descadastro inválido ou expirado.");
  try {
    const db = getProspeccaoDb();
    if (!db) return res.status(503).send("O serviço está temporariamente indisponível. Tente novamente.");
    const now = new Date().toISOString();
    const batch = db.batch();
    for (const [tipo, hash] of [["email", payload.emailHash], ["telefone", payload.telefoneHash]] as const) {
      if (!hash || !/^[a-f0-9]{64}$/.test(hash)) continue;
      const ref = db.collection("supressao").doc(`${tipo}-${hash}`);
      batch.set(ref, {
        id: `${tipo}-${hash}`,
        tipo,
        chaveHash: hash,
        motivo: "Pedido de descadastro pelo link da mensagem",
        origem: "descadastro",
        criadoEm: now,
      }, { merge: true });
    }
    await batch.commit();
    return res.status(200).type("html").send("<!doctype html><html lang=\"pt-BR\"><meta charset=\"utf-8\"><title>Descadastro confirmado</title><body style=\"font:16px Arial,sans-serif;max-width:640px;margin:12vh auto;padding:24px;color:#172033\"><h1>Descadastro confirmado</h1><p>O contato foi incluído na lista de supressão da VL Engenharia. Não enviaremos novas mensagens de prospecção para este endereço ou número.</p></body></html>");
  } catch (error) {
    console.error("[Prospecção] Falha no descadastro:", error);
    return res.status(500).send("Não foi possível concluir o descadastro neste momento.");
  }
});

app.post("/api/prospeccao/descadastrar", limitPublicUnsubscribe, async (req, res) => {
  const token = String(req.query.token || req.body?.token || "");
  const payload = verifyUnsubscribeToken(token);
  if (!payload) return res.status(400).send("Link de descadastro inválido ou expirado.");
  try {
    const db = getProspeccaoDb();
    if (!db) return res.status(503).send("O serviço está temporariamente indisponível.");
    const batch = db.batch();
    const now = new Date().toISOString();
    for (const [tipo, hash] of [["email", payload.emailHash], ["telefone", payload.telefoneHash]] as const) {
      if (!hash || !/^[a-f0-9]{64}$/.test(hash)) continue;
      const ref = db.collection("supressao").doc(`${tipo}-${hash}`);
      batch.set(ref, {
        id: `${tipo}-${hash}`,
        tipo,
        chaveHash: hash,
        motivo: "Pedido de descadastro one-click",
        origem: "descadastro",
        criadoEm: now,
      }, { merge: true });
    }
    await batch.commit();
    return res.status(204).end();
  } catch (error) {
    console.error("[Prospecção] Falha no descadastro one-click:", error);
    return res.status(500).send("Não foi possível concluir o descadastro neste momento.");
  }
});

app.post("/api/prospeccao/buscar", verifyProspeccaoMaster, async (req, res) => {
  const { fonte, municipio, uf, cnae, servicoId, termos } = req.body || {};
  const db = (req as any).prospeccaoDb;
  if (typeof municipio !== "string" || municipio.trim().length < 2 || municipio.length > 100) {
    return res.status(400).json({ error: "Informe um município válido." });
  }
  if (String(uf || "PE").toUpperCase() !== "PE") return res.status(400).json({ error: "Por enquanto, a busca está restrita a Pernambuco." });
  if (cnae && String(cnae).replace(/\D/g, "").length !== 7) return res.status(400).json({ error: "CNAE inválido: informe os 7 dígitos da subclasse." });
  if (fonte === "cnpj") {
    const endpoint = process.env.PROSPECCAO_CNPJ_API_URL;
    if (!endpoint) return res.status(503).json({ error: "Fonte CNPJ não configurada. Importe a base pública por CSV ou configure PROSPECCAO_CNPJ_API_URL para um provedor compatível." });
    try {
      const url = new URL(endpoint);
      url.searchParams.set("uf", "PE");
      url.searchParams.set("municipio", municipio.trim());
      const configSnapshot = await db.collection("config_prospeccao").doc("principal").get();
      const service = (configSnapshot.data()?.servicos || []).find((item: any) => item.id === servicoId);
      const serviceCnaes = (service?.segmentos_alvo || [])
        .flatMap((segment: any) => segment.cnaes || [])
        .map((item: any) => String(item.codigo || "").replace(/\D/g, ""))
        .filter((code: string) => code.length === 7);
      const selectedCnaes = cnae ? [String(cnae).replace(/\D/g, "")] : serviceCnaes;
      if (selectedCnaes.length) url.searchParams.set("cnaes", selectedCnaes.join(","));
      if (Array.isArray(termos) && termos.length) {
        url.searchParams.set("termos", termos.map((item: unknown) => String(item).slice(0, 80)).slice(0, 8).join(","));
      }
      url.searchParams.set("situacao", "ativa");
      url.searchParams.set("limit", "50");
      const response = await fetch(url, {
        headers: { Accept: "application/json", ...(process.env.PROSPECCAO_CNPJ_API_KEY ? { Authorization: `Bearer ${process.env.PROSPECCAO_CNPJ_API_KEY}` } : {}) },
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok) return res.status(502).json({ error: `A fonte CNPJ retornou HTTP ${response.status}.` });
      const payload: any = await response.json();
      const records = Array.isArray(payload) ? payload : payload.leads || payload.data || payload.estabelecimentos || [];
      const leads = records.slice(0, 200).filter((item: any) => {
        const status = String(item.situacao || item.situacao_cadastral || item.status || "").trim().toLowerCase();
        return ["ativa", "active", "2", "02"].includes(status);
      }).slice(0, 50).map((item: any) => ({
        razaoSocial: item.razaoSocial || item.razao_social || item.nome || item.company_name || "",
        nomeFantasia: item.nomeFantasia || item.nome_fantasia || item.fantasia || "",
        cnpj: item.cnpj || item.cnpj_completo || "",
        cnae: item.cnae || item.cnae_fiscal || item.cnae_principal || "",
        cnaesSecundarios: item.cnaesSecundarios || item.cnaes_secundarios || [],
        segmento: item.segmento || item.descricao_cnae || "",
        porte: item.porte || "",
        municipio: item.municipio || item.city || municipio,
        uf: item.uf || "PE",
        email: item.email || "",
        telefone: item.telefone || item.phone || "",
        site: item.site || item.website || "",
        fonte: "Base pública CNPJ via API configurada",
      })).filter((item: any) => item.razaoSocial);
      return res.json({ leads, fonte: "Base pública CNPJ via API configurada" });
    } catch (error: any) {
      return res.status(502).json({ error: error?.name === "TimeoutError" ? "Tempo limite da fonte CNPJ excedido." : "Não foi possível consultar a fonte CNPJ." });
    }
  }
  if (fonte === "places") {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) return res.status(503).json({ error: "Google Places não configurado. Cadastre GOOGLE_PLACES_API_KEY no servidor." });
    const termsList = Array.isArray(termos) ? termos.map((value: unknown) => String(value).slice(0, 80)).slice(0, 5) : [];
    const queryText = `${termsList.join(" ")} ${municipio} Pernambuco`.trim();
    try {
      const url = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
      url.searchParams.set("query", queryText);
      url.searchParams.set("region", "br");
      url.searchParams.set("key", apiKey);
      const response = await fetch(url, { signal: AbortSignal.timeout(12_000) });
      const payload: any = await response.json();
      if (!response.ok || !["OK", "ZERO_RESULTS"].includes(payload.status)) {
        return res.status(502).json({ error: `Google Places indisponível (${payload.status || response.status}).` });
      }
      const places = (payload.results || []).slice(0, 20);
      const leads = await Promise.all(places.map(async (place: any) => {
        let phone = "";
        let site = "";
        if (place.place_id) {
          const detailsUrl = new URL("https://maps.googleapis.com/maps/api/place/details/json");
          detailsUrl.searchParams.set("place_id", place.place_id);
          detailsUrl.searchParams.set("fields", "name,formatted_phone_number,website,formatted_address,business_status");
          detailsUrl.searchParams.set("key", apiKey);
          const detailResponse = await fetch(detailsUrl, { signal: AbortSignal.timeout(8_000) });
          if (detailResponse.ok) {
            const detail = await detailResponse.json() as any;
            phone = detail.result?.formatted_phone_number || "";
            site = detail.result?.website || "";
          }
        }
        return {
          razaoSocial: place.name || "",
          nomeFantasia: place.name || "",
          municipio,
          uf: "PE",
          telefone: phone,
          site,
          segmento: place.types?.join(", ") || "",
          fonte: "Google Places API",
        };
      }));
      return res.json({ leads: leads.filter((item: any) => item.razaoSocial), fonte: "Google Places API" });
    } catch {
      return res.status(502).json({ error: "Não foi possível consultar o Google Places." });
    }
  }
  return res.status(400).json({ error: "Fonte de busca não reconhecida." });
});

app.post("/api/prospeccao/gerar-mensagem", verifyProspeccaoMaster, async (req, res) => {
  const { lead, service, channel, draft } = req.body || {};
  if (!lead || !service || !["email", "whatsapp"].includes(channel) || typeof draft !== "string" || draft.length > 6000) {
    return res.status(400).json({ error: "Dados de mensagem inválidos." });
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "Geração com Gemini não configurada; revise o modelo manualmente." });
  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = [
      "Reescreva a mensagem comercial B2B abaixo em português brasileiro, curta, profissional, consultiva e respeitosa.",
      "Não crie fatos, multas, prazos, obrigações específicas, garantias nem promessas de resultado. Preserve rigorosamente os nomes das normas fornecidas.",
      "Mantenha identificação do remetente, um único CTA e a instrução/link de descadastro existente. Não acrescente informação pessoal.",
      `Canal: ${channel}. Empresa: ${String(lead.nome || "").slice(0, 150)}. Cidade: ${String(lead.cidade || "").slice(0, 80)}. Segmento: ${String(lead.segmento || "").slice(0, 100)}.`,
      `Serviço: ${String(service.nome || "").slice(0, 150)}. Normas válidas: ${(Array.isArray(service.normas) ? service.normas : []).join(", ")}.`,
      `Contexto: ${String(service.dor || "").slice(0, 600)} ${String(service.argumento || "").slice(0, 600)} CTA: ${String(service.cta || "").slice(0, 250)}.`,
      `Rascunho para variar:\n${draft}`,
      "Retorne apenas o texto final, sem aspas, sem explicações.",
    ].join("\n");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { temperature: 0.35, maxOutputTokens: 700 },
    });
    const text = String(response.text || "").trim();
    if (!text) return res.status(502).json({ error: "O modelo não retornou uma variação." });
    return res.json({ text, provider: "gemini" });
  } catch (error: any) {
    console.error("[Prospecção] Gemini:", error?.message);
    return res.status(502).json({ error: "Falha ao gerar mensagem; o modelo original continua disponível para revisão." });
  }
});

async function getProspecConfig(db: FirebaseFirestore.Firestore) {
  const snapshot = await db.collection("config_prospeccao").doc("principal").get();
  return {
    dryRun: true,
    limiteDiarioEmail: 20,
    janelaInicio: "08:00",
    janelaFim: "17:00",
    intervaloMinimoSegundos: 60,
    intervaloMaximoSegundos: 180,
    assinatura: "VL Engenharia Mecânica · CREA-PE 182229949-0",
    ...(snapshot.data() || {}),
  };
}

async function suppressionExists(db: FirebaseFirestore.Firestore, email: string, phone: string) {
  const refs = [
    email ? db.collection("supressao").doc(`email-${sha256(email)}`).get() : Promise.resolve(null),
    phone ? db.collection("supressao").doc(`telefone-${sha256(phone)}`).get() : Promise.resolve(null),
  ];
  const snapshots = await Promise.all(refs);
  return snapshots.some((snapshot: any) => snapshot?.exists);
}

async function countSendsToday(db: FirebaseFirestore.Firestore) {
  const formatter = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Recife", year: "numeric", month: "2-digit", day: "2-digit" });
  const today = formatter.format(new Date());
  const start = `${today}T00:00:00-03:00`;
  const snapshot = await db.collection("envios").where("criadoEm", ">=", start).get();
  return snapshot.docs.map((item) => item.data());
}

app.post("/api/prospeccao/test-email", verifyProspeccaoMaster, async (req, res) => {
  const db = (req as any).prospeccaoDb as FirebaseFirestore.Firestore;
  const user = (req as any).prospeccaoUser;
  const config = await getProspecConfig(db);
  if (config.dryRun !== false) return res.json({ status: "simulado", message: "Dry-run ativo." });
  if (!process.env.ZOHO_SMTP_HOST || !process.env.ZOHO_SMTP_USER || !process.env.ZOHO_SMTP_PASS) {
    return res.status(503).json({ error: "SMTP Zoho não configurado no servidor." });
  }
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.ZOHO_SMTP_HOST,
      port: Number(process.env.ZOHO_SMTP_PORT || 465),
      secure: Number(process.env.ZOHO_SMTP_PORT || 465) === 465,
      auth: { user: process.env.ZOHO_SMTP_USER, pass: process.env.ZOHO_SMTP_PASS },
      connectionTimeout: 10_000,
      socketTimeout: 15_000,
    });
    await transporter.verify();
    await transporter.sendMail({
      from: { name: process.env.ZOHO_FROM_NAME || "VL Engenharia", address: process.env.ZOHO_FROM_EMAIL || process.env.ZOHO_SMTP_USER },
      to: user.email,
      subject: "Teste de conexão — Prospecção VL Engenharia",
      text: "Teste de conexão Zoho realizado pelo painel MASTER.",
    });
    return res.json({ status: "enviado" });
  } catch (error: any) {
    return res.status(502).json({ error: `Falha ao testar SMTP Zoho: ${error?.message || "erro desconhecido"}` });
  }
});

app.post("/api/prospeccao/enviar-email", verifyProspeccaoMaster, async (req, res) => {
  const db = (req as any).prospeccaoDb as FirebaseFirestore.Firestore;
  const body = req.body || {};
  const email = String(body.email || "").trim().toLowerCase();
  const phone = String(body.telefoneE164 || "").trim();
  const subject = String(body.subject || "").trim();
  const text = String(body.text || "").trim();
  const unsubscribeUrl = String(body.unsubscribeUrl || "");
  const personalDomains = new Set(["gmail.com", "googlemail.com", "yahoo.com", "yahoo.com.br", "outlook.com", "hotmail.com", "hotmail.com.br", "live.com", "icloud.com", "uol.com.br", "bol.com.br", "proton.me", "protonmail.com"]);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email) || personalDomains.has(email.split("@")[1]) || !subject || subject.length > 180 || !text || text.length > 6000) {
    return res.status(400).json({ error: "Informe e-mail corporativo válido, assunto e mensagem revisada." });
  }
  if (!/^https?:\/\/[^/]+\/(?:api\/prospeccao\/)?descadastrar\?token=/.test(unsubscribeUrl)) {
    return res.status(400).json({ error: "Link de descadastro obrigatório e inválido." });
  }
  const config = await getProspecConfig(db);
  if (await suppressionExists(db, email, phone)) return res.status(409).json({ error: "Contato consta na lista de supressão." });
  const sends = await countSendsToday(db);
  const dailyLimit = Math.min(30, Math.max(1, Number(config.limiteDiarioEmail || 20)));
  if (limiteDiarioAtingido(sends as Array<{ canal: string; status: string }>, "email", dailyLimit)) {
    return res.status(429).json({ error: `Limite diário de e-mail atingido (${dailyLimit}).` });
  }
  if (!dentroJanelaComercial(new Date(), config)) return res.status(403).json({ error: "Envio permitido somente de segunda a sexta, dentro da janela configurada em America/Recife." });
  const minInterval = Math.min(180, Math.max(60, Number(config.intervaloMinimoSegundos || 60)));
  const maxInterval = Math.min(180, Math.max(minInterval, Number(config.intervaloMaximoSegundos || 180)));
  const lastSent = sends.filter((item) => item.canal === "email" && item.status === "enviado")
    .sort((a, b) => String(b.enviadoEm || b.criadoEm).localeCompare(String(a.enviadoEm || a.criadoEm)))[0];
  if (lastSent) {
    const seconds = (Date.now() - new Date(lastSent.enviadoEm || lastSent.criadoEm).getTime()) / 1000;
    const requiredInterval = Math.max(minInterval, Number(lastSent.proximoIntervaloSegundos || minInterval));
    if (seconds < requiredInterval) return res.status(429).json({ error: `Aguarde ${Math.ceil(requiredInterval - seconds)} segundos antes do próximo envio.` });
  }
  const proximoIntervaloSegundos = Math.floor(minInterval + Math.random() * (maxInterval - minInterval + 1));
  const envioId = `envio-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date().toISOString();
  if (config.dryRun !== false) {
    await db.collection("envios").doc(envioId).set({
      id: envioId, leadId: String(body.leadId || ""), canal: "email", status: "simulado",
      emailHash: sha256(email), assunto: subject, mensagem: text, criadoEm: now,
    });
    return res.json({ status: "simulado", envioId });
  }
  if (!process.env.ZOHO_SMTP_HOST || !process.env.ZOHO_SMTP_USER || !process.env.ZOHO_SMTP_PASS || !process.env.ZOHO_FROM_EMAIL) {
    return res.status(503).json({ error: "SMTP Zoho não configurado no servidor." });
  }
  try {
    const domain = process.env.ZOHO_FROM_EMAIL.split("@")[1] || "";
    try {
      const mx = await resolveMx(email.split("@")[1]);
      if (!mx.length) return res.status(400).json({ error: "O domínio do destinatário não possui registro MX." });
    } catch {
      return res.status(400).json({ error: "Não foi possível validar o domínio do e-mail (MX ausente ou DNS indisponível)." });
    }
    const withUnsubscribe = text.includes(unsubscribeUrl)
      ? text
      : `${text}\n\nDescadastro: ${unsubscribeUrl}`;
    const finalText = /vlengenhariamecanica\.com\.br/i.test(withUnsubscribe)
      ? withUnsubscribe
      : `${withUnsubscribe}\n\nVL Engenharia Mecânica · Vitor Leonardo Cordeiro Linhares · CREA-PE 182229949-0\nhttps://www.vlengenhariamecanica.com.br/ · (81) 98444-2592`;
    const transporter = nodemailer.createTransport({
      host: process.env.ZOHO_SMTP_HOST,
      port: Number(process.env.ZOHO_SMTP_PORT || 465),
      secure: Number(process.env.ZOHO_SMTP_PORT || 465) === 465,
      auth: { user: process.env.ZOHO_SMTP_USER, pass: process.env.ZOHO_SMTP_PASS },
      connectionTimeout: 10_000,
      socketTimeout: 15_000,
    });
    const result = await transporter.sendMail({
      from: { name: process.env.ZOHO_FROM_NAME || "VL Engenharia Mecânica", address: process.env.ZOHO_FROM_EMAIL },
      to: email,
      subject,
      text: finalText,
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });
    await db.collection("envios").doc(envioId).set({
      id: envioId, leadId: String(body.leadId || ""), canal: "email", status: "enviado",
      emailHash: sha256(email), assunto: subject, mensagem: finalText.replace(unsubscribeUrl, "[link de descadastro]"),
      criadoEm: now, enviadoEm: new Date().toISOString(), messageId: result.messageId,
      remetenteDominio: domain, proximoIntervaloSegundos,
    });
    return res.json({ status: "enviado", envioId });
  } catch (error: any) {
    await db.collection("envios").doc(envioId).set({
      id: envioId, leadId: String(body.leadId || ""), canal: "email", status: "falhou",
      emailHash: sha256(email), assunto: subject, mensagem: text, criadoEm: now,
      erro: String(error?.message || "Falha SMTP").slice(0, 500),
    });
    return res.status(502).json({ error: "Falha no envio Zoho. O resultado foi registrado para auditoria." });
  }
});

app.get("/api/cnpj/:cnpj", async (req, res) => {
  const digits = String(req.params.cnpj || "").replace(/\D/g, "");
  if (digits.length !== 14) {
    return res.status(400).json({ error: "CNPJ inválido. Informe 14 dígitos numéricos." });
  }
  try {
    const upstream = await fetch(`https://publica.cnpj.ws/cnpj/${digits}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "VL-Engenharia-App/1.0",
      },
    });
    const text = await upstream.text();
    let payload: any = {};
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { raw: text };
    }
    if (!upstream.ok) {
      return res.status(upstream.status).json(payload);
    }
    return res.json(payload);
  } catch (err: any) {
    return res.status(502).json({ error: err?.message || "Falha ao consultar CNPJ." });
  }
});

// AI Usage status
app.get("/api/ai/usage", (req, res) => {
  const calls = getMonthlyAICalls();
  res.json({
    currentMonth,
    used: calls,
    limit: MONTHLY_LIMIT,
    remaining: Math.max(0, MONTHLY_LIMIT - calls),
    exceeded: calls >= MONTHLY_LIMIT,
  });
});

// Gemini Technical Diagnostic Endpoint
app.post("/api/ai/analyze-inspection", async (req, res) => {
  try {
    const calls = getMonthlyAICalls();
    if (calls >= MONTHLY_LIMIT) {
      return res.status(429).json({
        error: "Limite mensal de chamadas de IA atingido (" + MONTHLY_LIMIT + " chamadas). Entre em contato com o suporte ou aumente a cota no painel.",
        used: calls,
        limit: MONTHLY_LIMIT,
      });
    }

    const { 
      moduleType, 
      sectionTitle, 
      itemTitle, 
      observations, 
      currentHRN, 
      assetData,
      tipoLaudo,
      equipamento,
      normasRef,
      naoConformidades,
      scoreHRN
    } = req.body;

    const moduloEfetivo = tipoLaudo || moduleType || "Inspeção Mecânica Geral";
    const equipamentoEfetivo = equipamento || assetData?.tipo || assetData?.identificacao || "Equipamento Industrial";
    const obsEfetivas = (naoConformidades && Array.isArray(naoConformidades) ? naoConformidades.join("; ") : "") || observations || "Análise preliminar de conformidade.";
    const scoreEfetivo = scoreHRN || currentHRN?.score || 10;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Return structured professional fallback when key is not configured
      monthlyAICalls++;
      return res.json({
        parecerTecnico: `Com base nas diretrizes normativas da ABNT e Ministério do Trabalho (${normasRef || "NR-12 / NR-11 / NR-13"}), o ativo ${equipamentoEfetivo} apresenta pontos que requerem atenção de segurança operacional e plano de manutenção preventiva. Constatou-se a necessidade de salvaguardas mecânicas e bloqueio de fontes de energia (LOTO).`,
        riscosIdentificados: [
          `Esmagamento e prensagem de extremidades nas transmissões de força desprovidas de proteção mecânica.`,
          `Ruptura ou fadiga de componentes sob pressão/esforço cíclico sem prontuário técnico atualizado.`
        ],
        recomendacoesGerais: `Executar plano de ação corretivo em até 30 dias úteis, instalando proteções fixas e móveis com intertravamento de segurança Categoria 4, complementado com treinamento formal dos operadores e emissão de ART CREA-PE.`,
        nivelRiscoSugerido: scoreEfetivo > 50 ? "Alto" : scoreEfetivo > 10 ? "Médio" : "Baixo",
        mock: true,
      });
    }

    const ai = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const systemPrompt = `Você é um engenheiro mecânico especialista em segurança do trabalho, laudos periciais e apreciação de riscos industriais (CREA, NR-12, NR-13, CONTRAN, ABNT NBR 16071, PMOC Lei 13.589/2018).
Seu papel é auxiliar o Engenheiro Mecânico Vitor Leonardo (CREA-PE 1822299490) na análise técnica preliminar para laudo pericial.
Responda SEMPRE em JSON rigoroso com a seguinte estrutura:
{
  "parecerTecnico": "Texto formal e técnico para constar no laudo",
  "riscosIdentificados": ["item 1", "item 2"],
  "recomendacoesGerais": "Texto explicativo consolidado com as ações corretivas",
  "recomendacoesPlanoAcao": ["medida 1", "medida 2", "medida 3"],
  "nivelRiscoSugerido": "Baixo" | "Médio" | "Alto" | "Muito Alto" | "Crítico",
  "sugestaoHRN": {
    "nivel": "Baixo" | "Médio" | "Alto" | "Muito Alto" | "Crítico",
    "justificativa": "breve justificativa"
  }
}`;

    const userPrompt = `Analise a seguinte inspeção técnica:
Módulo: ${moduloEfetivo}
Equipamento/Ativo: ${equipamentoEfetivo}
Observações e Constatações de Campo: "${obsEfetivas}"
Score HRN Preliminar: ${scoreEfetivo}

Gere a análise técnica em formato JSON estruturado com parecerTecnico, riscosIdentificados (ou naoConformidadesProvaveis), recomendacoesGerais (ou recomendacoesPlanoAcao) e nivelRiscoSugerido.`;

    const modelsToTry = ["gemini-3.8-flash", "gemini-3.6-flash", "gemini-flash-latest"];
    let response: any = null;
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: [
            { role: "user", parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }
          ],
          config: {
            responseMimeType: "application/json",
          },
        });
        if (response?.text) {
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Tentativa com modelo ${modelName} falhou:`, err?.message || err);
      }
    }

    if (!response && lastError) {
      throw lastError;
    }

    monthlyAICalls++;
    const text = response?.text || "{}";
    let parsed: any = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { 
        parecerTecnico: text, 
        riscosIdentificados: [], 
        recomendacoesGerais: "Manter manutenção preventiva e auditorias periódicas.",
        recomendacoesPlanoAcao: [] 
      };
    }

    // Standardize field names if model used alternate names
    if (!parsed.riscosIdentificados && parsed.naoConformidadesProvaveis) {
      parsed.riscosIdentificados = parsed.naoConformidadesProvaveis;
    }
    if (!parsed.recomendacoesGerais && Array.isArray(parsed.recomendacoesPlanoAcao)) {
      parsed.recomendacoesGerais = parsed.recomendacoesPlanoAcao.join('. ');
    }
    if (!parsed.nivelRiscoSugerido && parsed.sugestaoHRN?.nivel) {
      parsed.nivelRiscoSugerido = parsed.sugestaoHRN.nivel;
    }

    return res.json({
      ...parsed,
      mock: false,
      currentUsage: monthlyAICalls,
      limit: MONTHLY_LIMIT,
    });
  } catch (err: any) {
    console.error("Erro no processamento da IA:", err);
    return res.status(500).json({
      error: "Falha na comunicação com o serviço de IA: " + (err?.message || "Erro desconhecido"),
    });
  }
});

// Endpoint para Redação Técnica e Expansão Pericial de Seções de Laudo
app.post("/api/ai/redigir-secao-laudo", async (req, res) => {
  try {
    const { 
      tituloSecao, 
      tipoLaudo, 
      normasRef, 
      clienteNome, 
      ativoIdentificacao, 
      promptUsuario,
      conteudoAtual
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback sem chave: retorna resposta enriquecida e estruturada
      return res.json({
        conteudoHtml: `<div class="p-3 bg-blue-50/70 border-l-4 border-blue-600 rounded-r my-2 space-y-1">
          <p><strong>Fundamentação Pericial (${tituloSecao || 'Inspeção Técnica'}):</strong></p>
          <p>Com amparo nas diretrizes de ${normasRef || 'ABNT NBR e Normas Regulamentadoras vigentes'}, procedeu-se à averiguação do ativo <em>${ativoIdentificacao || 'especificado'}</em>. Conclui-se pelo atendimento aos padrões de segurança mecânica e estabilidade operacional.</p>
        </div>`,
        mock: true
      });
    }

    const ai = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const promptSystem = `Você é um Engenheiro Mecânico Perito e Consultor Técnico Especialista (CREA-PE 182229949-0).
Sua tarefa é redigir ou expandir tecnicamente o conteúdo de uma SEÇÃO ESPECÍFICA de um laudo pericial de engenharia mecânica.
Diretrizes mandatórias:
1. Retorne texto em HTML limpo, usando tags como <p>, <ul>, <li>, <strong>, <em> e, se conveniente para clareza técnica, tabelas estruturadas (<table class="tiptap-table border-collapse border border-slate-300 w-full my-3">).
2. Não use marcadores de markdown como \`\`\`html ou blocos de código; retorne estritamente o HTML interno pronto para o editor de texto rico.
3. Use vocabulário pericial formal, fundamentado nas normas ABNT e NRs cabíveis, com termos de engenharia diagnóstica (tensões, salvaguardas, integridade mecânica, ensaios).
4. O tom deve ser pericial conclusivo e assertivo.`;

    const promptInput = `Redija o conteúdo técnico para a seguinte seção:
- Título da Seção: "${tituloSecao}"
- Tipo de Laudo: "${tipoLaudo || 'Laudo Técnico Pericial de Engenharia Mecânica'}"
- Normas de Referência: "${normasRef || 'ABNT NBR e Normas Regulamentadoras vigentes'}"
- Ativo/Equipamento Periciado: "${ativoIdentificacao || 'Equipamento periciado'}"
- Cliente/Empresa: "${clienteNome || 'Contratante'}"
${conteudoAtual ? `- Conteúdo Técnico já existente na seção para expandir/aprimorar:\n"""${conteudoAtual}"""` : ''}
${promptUsuario ? `- Instrução Específica do Engenheiro:\n"""${promptUsuario}"""` : ''}

Elabore a redação pericial completa, técnica e aprofundada para esta seção.`;

    const modelsToTry = ["gemini-3.8-flash", "gemini-3.6-flash", "gemini-flash-latest"];
    let htmlGerado = "";

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [{ role: "user", parts: [{ text: promptSystem + "\n\n" + promptInput }] }],
          config: {
            temperature: 0.3
          }
        });
        if (response?.text) {
          htmlGerado = response.text.trim();
          // Remove potential ```html wrapping
          htmlGerado = htmlGerado.replace(/^```html\s*/i, '').replace(/\s*```$/i, '');
          break;
        }
      } catch (err: any) {
        console.warn(`Tentativa com modelo ${model} falhou:`, err?.message || err);
      }
    }

    if (!htmlGerado) {
      throw new Error("Não foi possível gerar redação pelo serviço de IA.");
    }

    monthlyAICalls++;
    return res.json({
      conteudoHtml: htmlGerado,
      mock: false,
      currentUsage: monthlyAICalls,
      limit: MONTHLY_LIMIT
    });
  } catch (err: any) {
    console.error("Erro na redação de seção por IA:", err);
    return res.status(500).json({
      error: "Falha na geração de redação: " + (err?.message || "Erro desconhecido")
    });
  }
});

// Endpoint Especializado: Gerador de Laudo Técnico Pericial de Causa Raiz (Categoria 4)
app.post("/api/ai/gerar-laudo-causa-raiz", async (req, res) => {
  try {
    const dados: DadosEntradaCausaRaiz = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Motor offline pericial robusto estruturado nas 13 seções
      const laudoOffline = gerarLaudoCausaRaizOffline(dados);
      return res.json({
        ...laudoOffline,
        mock: true,
        source: "motor_pericial_offline"
      });
    }

    const ai = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const promptSystem = construirPromptSistemaCausaRaiz();
    const promptUser = construirPromptUsuarioCausaRaiz(dados);

    const modelsToTry = ["gemini-3.8-flash", "gemini-3.6-flash", "gemini-flash-latest"];
    let resultadoJson: any = null;

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [{ role: "user", parts: [{ text: promptSystem + "\n\n" + promptUser }] }],
          config: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        });
        if (response?.text) {
          const parsed = JSON.parse(response.text.trim());
          if (parsed.secoes && Array.isArray(parsed.secoes) && parsed.secoes.length > 0) {
            resultadoJson = parsed;
            // Garantir que o proprietário na tabela veicular seja o Ministério Público de Pernambuco
            resultadoJson.secoes = resultadoJson.secoes.map((s: any) => {
              if (s.conteudoHtml && /propriet[aá]rio/i.test(s.conteudoHtml) && /adf/i.test(s.conteudoHtml)) {
                s.conteudoHtml = s.conteudoHtml.replace(
                  /(<td[^>]*>Propriet[aá]rio:?<\/td>\s*<td[^>]*>)([^<]*Adf[^<]*)(<\/td>)/gi,
                  '$1Ministério Público de Pernambuco (CNPJ: 24.417.065/0001-03)$3'
                );
              }
              return s;
            });
            break;
          }
        }
      } catch (err: any) {
        console.warn(`Tentativa com modelo ${model} para Causa Raiz falhou:`, err?.message || err);
      }
    }

    if (!resultadoJson) {
      const laudoOffline = gerarLaudoCausaRaizOffline(dados);
      return res.json({
        ...laudoOffline,
        mock: true,
        source: "fallback_offline_garantido"
      });
    }

    monthlyAICalls++;
    return res.json({
      ...resultadoJson,
      mock: false,
      source: "gemini_ai",
      currentUsage: monthlyAICalls,
      limit: MONTHLY_LIMIT
    });
  } catch (err: any) {
    console.error("Erro no gerador pericial de causa raiz:", err);
    try {
      const laudoOffline = gerarLaudoCausaRaizOffline(req.body);
      return res.json({
        ...laudoOffline,
        mock: true,
        source: "fallback_error_recovery"
      });
    } catch {
      return res.status(500).json({
        error: "Falha ao gerar laudo pericial: " + (err?.message || "Erro desconhecido")
      });
    }
  }
});

// Official Proposal Generator Endpoint (13 Mandatory Sections)
app.post("/api/ai/generate-proposal", async (req, res) => {
  try {
    const calls = getMonthlyAICalls();
    if (calls >= MONTHLY_LIMIT) {
      return res.status(429).json({
        error: "Limite mensal de chamadas de IA atingido (" + MONTHLY_LIMIT + " chamadas).",
        used: calls,
        limit: MONTHLY_LIMIT,
      });
    }

    const {
      PROP_CODIGO = `PROP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      DATA_EMISSAO = new Date().toLocaleDateString('pt-BR'),
      VALIDADE_DIAS = "15",
      NOME_CLIENTE_RAZAO_SOCIAL = "Cliente Corporativo S.A.",
      CNPJ_CLIENTE = "00.000.000/0001-00",
      REPRESENTANTE_NOME = "Diretoria de Operações",
      EMAIL_CLIENTE = "contato@cliente.com.br",
      TELEFONE_CLIENTE = "(81) 99999-0000",
      LOCALIDADE_SERVICO = "Recife / Jaboatão dos Guararapes - PE",
      DESCRICAO_DEMANDA = "Laudo Técnico de Inspeção Mecânica e Adequação",
      NORMAS_TECNICAS = "ABNT NBR, NR-12, NR-11, NR-13",
      QTD_EQUIPAMENTOS = "01 Ativo / Máquina Principal",
      HORAS_ENGENHARIA = "16 horas técnicas de engenharia",
      MOBILIZACAO = "Imediata / 48 horas úteis após confirmação",
      PRAZO_ENTREGA = "3 Dias Úteis após vistoria presencial",
      CONDICOES_PAGAMENTO = "50% no aceite eletrônico e 50% após emissão da ART e Laudo",
      VALOR_INVESTIMENTO = "R$ 2.450,00",
      FOTOS_DESCRICAO_OU_PATHS = "Levantamento fotográfico preliminar do parque fabril",
      INCLUI_NOTA_FISCAL = true,
      CHAVE_PIX = "10287093409"
    } = req.body;

    const comNotaFiscal = INCLUI_NOTA_FISCAL !== false;
    const QR_CODE_PIX_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALMAAACzCAYAAAC3/90AAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAD20lEQVR4nO3c0W3rMBAEUc5qUkvqSS2pJxV0V+DBB75A9vPzTjN38PFFcQo/e/78+fPjU12vX88e4P/wB7+fP/j9/MHv5w9+v/nBz/8Cvx38wZ77wQf/n3zwd/IHu+AP9twPPvj/5IO/kz/YBX+w537wwf8nH/yd/MEu+IM994MP/j/54O/kD3bBH+y5H3zw/8kHfyd/sAv+YM/94IP/Tz74O/mDXfAHe+4HH/x/8sHfyR/sgj/Ycz/44P+TD/5O/mAX/MGe+8EH/5988HfyB7vgD/bcDz74/+SDv5M/2AV/sOd+8MH/Jx/8nfzBLviDPfeDD/4/+eDv5A92wR/suR988P/JB38nf7AL/mDP/eCD/08++Dv5g13wB3vuBx/8f/LB38kf7II/2HM/+OD/kw/+Tv5gF/zBnvvBB/+ffPB38ge74A/23A8++P/kg7+TP9gFf7Dn/vD/y/f39+zB/p+/+0d//eCD/08++Dv5g13wB3vuBx/8f/LB38kf7II/2HM/+OD/kw/+Tv5gF/zBnvvBB/+ffPB38ge74A/23A8++P/kg7+TP9gFf7Dn/vDBv/yDD/4/+eDv5A92wR/suR988P/JB38nf7AL/mDP/eCD/08++Dv5g13wB3vuBx/8f/LB38kf7II/2HM/+OD/kw/+Tv5gF/zBnvvBB/+ffPB38ge74A/23A8++P/kg7+TP9gFf7Dn/vDBv/yDD/4/+eDv5A92wR/suR988P/JB38nf7AL/mDP/eCD/08++Dv5g13wB3vuBx/8f/LB38kf7II/2HM/+OD/kw/+Tv5gF/zBnvvBB/+ffPB38ge74A/23A8++P/kg7+TP9gFf7Dn/vDBv/yDD/4/+eDv5A92wR/suR988P/JB38nf7AL/mDP/eCD/08++Dv5g13wB3vuBx/8f/LB38kf7II/2HM/+OD/kw/+Tv5gF/zBnvvBB/+ffPB38ge74A/23A8++P/kg7+TP9gFf7Dn/vDBv/yDD/4/+eDv5A92wR/suR988P/JB38nf7AL/mDP/eCD/08++Dv5g13wB3vuBx/8f/LB38kf7II/2HM/+OD/kw/+Tv5gF/zBnvvBB/+ffPB38ge74A/23A8++P/kg7+TP9gFf7DnfvDB/ycffPDXwQe74I/gD/46+GAX/BH8wV8HH+yCP4I/+Ovg7/X+8fsTfPD/yQd/J3+w6/9P/h/8wV8HH+yCP4I/+Ovg//EP/p38AfwBf/D7+YP7+fPnz69nd/878Affjx/8fv7g9/MHv58/+P3mD/4Ff/D7+QP+A9yQe6tqIe9gAAAAAElFTkSuQmCC';

    const apiKey = process.env.GEMINI_API_KEY;

    const servicoUpper = String(DESCRICAO_DEMANDA || '').toUpperCase();
    let TITULO_LAUDO_PROPOSTA = 'LAUDO TÉCNICO DE CONFORMIDADE MECÂNICA';
    if (servicoUpper.includes('PMOC') || servicoUpper.includes('CLIMATIZAÇÃO') || servicoUpper.includes('AR-CONDICIONADO')) {
      TITULO_LAUDO_PROPOSTA = 'LAUDO TÉCNICO DE PMOC • PLANO DE MANUTENÇÃO, OPERAÇÃO E CONTROLE';
    } else if (servicoUpper.includes('NR-12') || servicoUpper.includes('NR12') || servicoUpper.includes('MÁQUINA') || servicoUpper.includes('PRENSA')) {
      TITULO_LAUDO_PROPOSTA = 'LAUDO TÉCNICO DE INSPEÇÃO NR-12 • SEGURANÇA EM MÁQUINAS INDUSTRIAIS';
    } else if (servicoUpper.includes('NR-13') || servicoUpper.includes('NR13') || servicoUpper.includes('CALDEIRA') || servicoUpper.includes('COMPRESSOR') || servicoUpper.includes('VASO')) {
      TITULO_LAUDO_PROPOSTA = 'LAUDO TÉCNICO DE INSPEÇÃO NR-13 • VASOS SOB PRESSÃO & CALDEIRAS';
    } else if (servicoUpper.includes('NR-11') || servicoUpper.includes('NR11') || servicoUpper.includes('PONTE ROLANTE') || servicoUpper.includes('EMPILHADEIRA') || servicoUpper.includes('IÇAMENTO')) {
      TITULO_LAUDO_PROPOSTA = 'LAUDO TÉCNICO DE INSPEÇÃO NR-11 • TRANSPORTE & MOVIMENTAÇÃO DE CARGA';
    } else if (servicoUpper.includes('PLAYGROUND') || servicoUpper.includes('PARQUE') || servicoUpper.includes('BRINQUEDO')) {
      TITULO_LAUDO_PROPOSTA = 'LAUDO TÉCNICO DE SEGURANÇA DE PLAYGROUND • ABNT NBR 16071';
    } else if (servicoUpper.includes('PERÍCIA') || servicoUpper.includes('PERICIA') || servicoUpper.includes('ASSISTÊNCIA')) {
      TITULO_LAUDO_PROPOSTA = 'LAUDO PERICIAL DE ENGENHARIA MECÂNICA DIAGNÓSTICA';
    } else if (servicoUpper.includes('ESTRUTURAL') || servicoUpper.includes('METÁLIC')) {
      TITULO_LAUDO_PROPOSTA = 'LAUDO TÉCNICO ESTRUTURAL E MEMORIAL DE CÁLCULO';
    } else if (servicoUpper.startsWith('LAUDO')) {
      TITULO_LAUDO_PROPOSTA = servicoUpper;
    }

    const fallbackProposal = {
      codigoProposta: PROP_CODIGO,
      dataEmissao: DATA_EMISSAO,
      validadeDias: parseInt(VALIDADE_DIAS, 10) || 15,
      clienteNome: NOME_CLIENTE_RAZAO_SOCIAL,
      cnpjCliente: CNPJ_CLIENTE,
      representanteNome: REPRESENTANTE_NOME,
      emailCliente: EMAIL_CLIENTE,
      telefoneCliente: TELEFONE_CLIENTE,
      localidadeServico: LOCALIDADE_SERVICO,
      descricaoDemanda: DESCRICAO_DEMANDA,
      normasTecnicas: NORMAS_TECNICAS,
      qtdEquipamentos: QTD_EQUIPAMENTOS,
      horasEngenharia: HORAS_ENGENHARIA,
      mobilizacao: MOBILIZACAO,
      prazoEntrega: PRAZO_ENTREGA,
      condicoesPagamento: CONDICOES_PAGAMENTO,
      valorInvestimento: VALOR_INVESTIMENTO,
      paginas: [
        {
          numero: 1,
          titulo: "PROPOSTA TÉCNICA COMERCIAL // ORÇAMENTO DE ENGENHARIA",
          subtitulo: TITULO_LAUDO_PROPOSTA,
          conteudoHtml: `<div class="space-y-4 text-xs">
            <p class="text-slate-700 text-xs sm:text-sm leading-relaxed">
              Prestação de serviços especializados em Engenharia Mecânica, diagnóstico de integridade estrutural, verificação de conformidade com as Normas Regulamentadoras federais (ABNT / Ministério do Trabalho) e emissão de Anotação de Responsabilidade Técnica (ART) oficial junto ao CREA-PE.
            </p>

            <div style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 1.5px solid #cbd5e1; border-radius: 14px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); overflow: hidden;" class="rounded-xl border border-slate-300 shadow-sm overflow-hidden">
              <div style="background: #0B1E3D; color: #ffffff; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #D4AF37;"></span>
                  <strong style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 800;">
                    DADOS DO CLIENTE CONTRATANTE & REFERÊNCIA
                  </strong>
                </div>
                <span style="font-size: 10px; font-family: monospace; color: #93c5fd; font-weight: 700;">
                  ${PROP_CODIGO}
                </span>
              </div>

              <div style="padding: 14px 16px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px;" class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 10px;">
                  <span style="color: #64748b; font-size: 10px; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 2px;">Razão Social / Cliente:</span>
                  <strong style="color: #0b1e3d; font-size: 12px; font-weight: 800; display: block; word-break: break-word;">${NOME_CLIENTE_RAZAO_SOCIAL}</strong>
                </div>

                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 10px;">
                  <span style="color: #64748b; font-size: 10px; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 2px;">CNPJ / CPF:</span>
                  <strong style="color: #0f172a; font-size: 12px; font-family: monospace; display: block;">${CNPJ_CLIENTE}</strong>
                </div>

                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 10px;">
                  <span style="color: #64748b; font-size: 10px; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 2px;">Representante / Contato:</span>
                  <strong style="color: #0f172a; font-size: 12px; display: block;">${REPRESENTANTE_NOME}</strong>
                </div>

                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 10px;">
                  <span style="color: #64748b; font-size: 10px; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 2px;">Localidade / Unidade:</span>
                  <strong style="color: #0f172a; font-size: 12px; display: block;">${LOCALIDADE_SERVICO}</strong>
                </div>
              </div>

              <div style="background: #f1f5f9; border-top: 1px solid #e2e8f0; padding: 10px 16px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; text-align: center; font-size: 11px;">
                <div>
                  <span style="color: #64748b; font-size: 10px; display: block;">Código da Proposta</span>
                  <strong style="color: #0b1e3d; font-family: monospace;">${PROP_CODIGO}</strong>
                </div>
                <div>
                  <span style="color: #64748b; font-size: 10px; display: block;">Validade da Proposta</span>
                  <strong style="color: #1e3a8a;">${VALIDADE_DIAS} dias corridos</strong>
                </div>
                <div>
                  <span style="color: #64748b; font-size: 10px; display: block;">Prazo de Conclusão</span>
                  <strong style="color: #047857;">${PRAZO_ENTREGA}</strong>
                </div>
              </div>
            </div>
          </div>`
        },
        {
          numero: 2,
          titulo: "APRESENTAÇÃO INSTITUCIONAL E CREDENCIAIS TÉCNICAS",
          conteudoHtml: `<div class="space-y-4">
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 rounded-xl border border-slate-200 bg-slate-50/80">
              <div class="shrink-0 text-center">
                <img src="/vitor-leonardo.png" alt="Eng. Vitor Leonardo Cordeiro Linhares" class="w-32 h-36 object-cover rounded-lg shadow-sm border border-slate-300 mx-auto" />
                <span class="inline-block mt-2 px-2 py-0.5 rounded bg-[#0B1E3D] text-white text-[10px] font-bold tracking-wider uppercase">CREA-PE 182229949-0</span>
              </div>
              <div class="space-y-2 text-left">
                <h3 class="text-base font-black text-[#0B1E3D]">Eng. Vitor Leonardo Cordeiro Linhares</h3>
                <p class="text-xs font-bold text-[#1565D8] tracking-wide uppercase">Engenheiro Mecânico • Perito Técnico & Consultor</p>
                <p class="text-slate-700 text-xs leading-relaxed">
                  Profissional com registro ativo no Conselho Regional de Engenharia e Agronomia de Pernambuco (CREA-PE). Especialista em engenharia diagnóstica, laudos periciais mecânicos, adequação a Normas Regulamentadoras (NR-11, NR-12, NR-13), projetos de climatização (PMOC), combate a incêndio e ensaios não destrutivos.
                </p>
                <div class="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600 font-medium">
                  <div class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>Emissão Oficial de ART</div>
                  <div class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>Engenharia Diagnóstica</div>
                  <div class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>Conformidade ABNT / NRs</div>
                  <div class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>Respaldo Jurídico-Pericial</div>
                </div>
              </div>
            </div>

            <blockquote class="p-3 border-l-4 border-[#0B1E3D] bg-slate-50 italic text-slate-800 text-xs font-medium">
              "Contribuir para um ambiente operacional mais seguro, eficiente e juridicamente protegido, combinando rigor técnico com agilidade e ética profissional."
            </blockquote>
            <p class="text-slate-700 text-xs leading-relaxed">
              Sob a liderança do Eng. Vitor Leonardo, aliamos sólida base técnica às mais modernas metodologias de inspeção e auditoria diagnóstica, garantindo aos nossos clientes total conformidade perante os órgãos de fiscalização (Ministério do Trabalho, CBMPE e CREA).
            </p>
          </div>`
        },
        {
          numero: 3,
          titulo: "NOSSOS PRINCÍPIOS FUNDAMENTAIS",
          conteudoHtml: `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-lg border border-slate-200 bg-white">
              <h4 class="font-bold text-[#0B1E3D] text-sm mb-1">1. CONFIANÇA NA ENTREGA</h4>
              <p class="text-xs text-slate-600 leading-relaxed">Compromisso inabalável com a precisão dos prazos acordados. Nossos laudos técnicos são entregues de forma ágil para viabilizar as metas operacionais do cliente.</p>
            </div>
            <div class="p-4 rounded-lg border border-slate-200 bg-white">
              <h4 class="font-bold text-[#0B1E3D] text-sm mb-1">2. ÉTICA NO SERVIÇO</h4>
              <p class="text-xs text-slate-600 leading-relaxed">Transparência total em nossas avaliações físicas. Fornecemos pareceres periciais justos, respaldados estritamente na verdade técnica e na legislação federal.</p>
            </div>
            <div class="p-4 rounded-lg border border-slate-200 bg-white">
              <h4 class="font-bold text-[#0B1E3D] text-sm mb-1">3. SATISFAÇÃO DO CLIENTE</h4>
              <p class="text-xs text-slate-600 leading-relaxed">Entendemos o negócio do cliente. Focamos em simplificar procedimentos complexos de adequação, transformando as exigências fiscais em melhorias operacionais reais.</p>
            </div>
            <div class="p-4 rounded-lg border border-slate-200 bg-white">
              <h4 class="font-bold text-[#0B1E3D] text-sm mb-1">4. RELACIONAMENTO DURADOURO</h4>
              <p class="text-xs text-slate-600 leading-relaxed">Mais do que um fornecedor, somos parceiros de engenharia do seu negócio. Oferecemos suporte consultivo contínuo pós-entrega de laudos e laço corporativo de longo prazo.</p>
            </div>
          </div>`
        },
        {
          numero: 4,
          titulo: "O QUE ENTREGAMOS",
          conteudoHtml: `<div class="space-y-3">
            <div class="p-3 bg-slate-50 rounded border border-slate-200">
              <strong class="text-[#0B1E3D] block text-sm">AMBIENTE MAIS SEGURO:</strong>
              <span class="text-xs text-slate-600">Garantia técnica de segurança contra acidentes operacionais, reduzindo drasticamente riscos à vida e à integridade dos funcionários.</span>
            </div>
            <div class="p-3 bg-slate-50 rounded border border-slate-200">
              <strong class="text-[#0B1E3D] block text-sm">SOLUÇÃO CUSTO X BENEFÍCIO:</strong>
              <span class="text-xs text-slate-600">Otimização de custos de adequação. Projetamos e indicamos soluções financeiramente viáveis que não prejudicam a produtividade.</span>
            </div>
            <div class="p-3 bg-slate-50 rounded border border-slate-200">
              <strong class="text-[#0B1E3D] block text-sm">RESPALDO TÉCNICO DE EXCELÊNCIA:</strong>
              <span class="text-xs text-slate-600">Emissão de Anotações de Responsabilidade Técnica (ART) registradas no CREA-PE para plena proteção jurídica perante órgãos fiscalizadores.</span>
            </div>
            <div class="p-3 bg-slate-50 rounded border border-slate-200">
              <strong class="text-[#0B1E3D] block text-sm">QUALIDADE E CONFIANÇA:</strong>
              <span class="text-xs text-slate-600">Relatórios analíticos fotográficos minuciosos, ensaios estruturais não destrutivos avançados e rastreabilidade total de dados técnicos.</span>
            </div>
          </div>`
        },
        {
          numero: 5,
          titulo: "PROBLEMAS QUE AJUDAMOS A RESOLVER",
          conteudoHtml: `<div class="space-y-2.5">
            <div class="p-3 rounded border border-slate-200 bg-white">
              <span class="font-bold text-xs text-red-700 block">1. Acidentes Operacionais:</span>
              <p class="text-xs text-slate-600">Identificação proativa de falhas de fadiga metálica ou dimensionamento antes de causar danos físicos.</p>
            </div>
            <div class="p-3 rounded border border-slate-200 bg-white">
              <span class="font-bold text-xs text-amber-700 block">2. Retrabalho no Serviço:</span>
              <p class="text-xs text-slate-600">Orientação técnica clara, eliminando a contratação de adequações incorretas e retrabalhos caros.</p>
            </div>
            <div class="p-3 rounded border border-slate-200 bg-white">
              <span class="font-bold text-xs text-blue-700 block">3. Complexidade nas Adequações:</span>
              <p class="text-xs text-slate-600">Traduzimos as exigências regulatórias das NRs (NR-12, NR-13, NR-11) e normas ABNT/CONTRAN para um plano operacional simplificado.</p>
            </div>
            <div class="p-3 rounded border border-slate-200 bg-white">
              <span class="font-bold text-xs text-purple-700 block">4. Não Conformidade com as Normas:</span>
              <p class="text-xs text-slate-600">Proteção jurídica contra multas do Ministério do Trabalho, interdições de pátio industrial ou embargos prediais.</p>
            </div>
            <div class="p-3 rounded border border-slate-200 bg-white">
              <span class="font-bold text-xs text-emerald-700 block">5. Alto Custo:</span>
              <p class="text-xs text-slate-600">Evitamos multas, paralisações, interdições civis e perdas judiciais que poderiam custar fortunas às empresas.</p>
            </div>
          </div>`
        },
        {
          numero: 6,
          titulo: "RESUMO DE NOSSOS SERVIÇOS DE ENGENHARIA",
          subtitulo: "CATÁLOGO DE LAUDOS E ADEQUAÇÕES INDUSTRIAIS",
          conteudoHtml: `<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px;" class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 1.5px solid #bfdbfe; border-radius: 12px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); position: relative;" class="p-3 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-blue-200 shadow-xs relative">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background-color: #dbeafe; color: #1d4ed8; font-weight: 800; font-size: 11px; font-family: monospace;">12</span>
                <div>
                  <strong style="color: #0b1e3d; font-size: 12px; font-weight: 900; display: block;">NR-12 • MÁQUINAS INDUSTRIAIS</strong>
                  <span style="color: #2563eb; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Apreciação de Risco & Laudo</span>
                </div>
              </div>
              <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0;">
                Apreciação de riscos (HRN/SIL), inventário técnico, laudos periciais de conformidade mecânica de prensas, tornos, esteiras e células robotizadas.
              </p>
            </div>

            <div style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 1.5px solid #fde68a; border-radius: 12px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); position: relative;" class="p-3 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-amber-200 shadow-xs relative">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background-color: #fef3c7; color: #92400e; font-weight: 800; font-size: 11px; font-family: monospace;">11</span>
                <div>
                  <strong style="color: #0b1e3d; font-size: 12px; font-weight: 900; display: block;">NR-11 • CARGAS E ELEVAÇÃO</strong>
                  <span style="color: #b45309; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Movimentação & Ensaios</span>
                </div>
              </div>
              <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0;">
                Inspeção e laudos de pontes rolantes, guindastes, empilhadeiras, pórticos, ensaios não destrutivos (END) e testes de tração em cabos e olhais.
              </p>
            </div>

            <div style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 1.5px solid #c7d2fe; border-radius: 12px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); position: relative;" class="p-3 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-indigo-200 shadow-xs relative">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background-color: #e0e7ff; color: #4338ca; font-weight: 800; font-size: 11px; font-family: monospace;">13</span>
                <div>
                  <strong style="color: #0b1e3d; font-size: 12px; font-weight: 900; display: block;">NR-13 • VASOS & CALDEIRAS</strong>
                  <span style="color: #4f46e5; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Pressão & Prontuários</span>
                </div>
              </div>
              <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0;">
                Inspeção de compressores e vasos sob pressão, teste hidrostático, medição de espessura por ultrassom, calibração de PSV e reconstituição de prontuário.
              </p>
            </div>

            <div style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 1.5px solid #a7f3d0; border-radius: 12px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); position: relative;" class="p-3 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-emerald-200 shadow-xs relative">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background-color: #d1fae5; color: #065f46; font-weight: 800; font-size: 11px; font-family: monospace;">AC</span>
                <div>
                  <strong style="color: #0b1e3d; font-size: 12px; font-weight: 900; display: block;">PMOC • CLIMATIZAÇÃO</strong>
                  <span style="color: #047857; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Lei 13.589/2018 & ANVISA</span>
                </div>
              </div>
              <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0;">
                Plano de Manutenção Operação e Controle para qualidade do ar interior, eficiência energética e total conformidade com a vigilância sanitária.
              </p>
            </div>

            <div style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 1.5px solid #fecdd3; border-radius: 12px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); position: relative;" class="p-3 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-rose-200 shadow-xs relative">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background-color: #ffe4e6; color: #be123c; font-weight: 800; font-size: 11px; font-family: monospace;">PJ</span>
                <div>
                  <strong style="color: #0b1e3d; font-size: 12px; font-weight: 900; display: block;">PERÍCIAS & ASSISTÊNCIA TÉCNICA</strong>
                  <span style="color: #e11d48; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Engenharia Diagnóstica Legal</span>
                </div>
              </div>
              <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0;">
                Investigação pericial de acidentes mecânicos, vistorias cautelares de vizinhança industrial, elaboração de quesitos e laudos judiciais conclusivos.
              </p>
            </div>

            <div style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 1.5px solid #e9d5ff; border-radius: 12px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); position: relative;" class="p-3 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-purple-200 shadow-xs relative">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background-color: #f3e8ff; color: #6b21a8; font-weight: 800; font-size: 11px; font-family: monospace;">ART</span>
                <div>
                  <strong style="color: #0b1e3d; font-size: 12px; font-weight: 900; display: block;">PROJETOS & ADEQUAÇÕES</strong>
                  <span style="color: #7e22ce; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Soluções Mecânicas Integradas</span>
                </div>
              </div>
              <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0;">
                Dimensionamento de proteções físicas, cálculo de estruturas metálicas, dispositivos mecânicos de segurança, linhas de vida e esteiras industriais com ART.
              </p>
            </div>
          </div>`
        },
        {
          numero: 7,
          titulo: "IDENTIFICAÇÃO DAS PARTES & DEMANDA",
          conteudoHtml: `<div class="overflow-x-auto">
            <table class="w-full text-xs text-left border-collapse border border-slate-300">
              <thead>
                <tr class="bg-[#0B1E3D] text-white">
                  <th class="p-2.5 border border-slate-300">INFORMAÇÕES DA PROVEDORA</th>
                  <th class="p-2.5 border border-slate-300">INFORMAÇÕES DO CLIENTE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="p-2.5 border border-slate-300 align-top space-y-1">
                    <p><strong>Razão Social:</strong> VL ENGENHARIA MECÂNICA</p>
                    <p><strong>Eng. Responsável:</strong> Vitor Leonardo C. Linhares</p>
                    <p><strong>CREA-PE:</strong> 182229949-0</p>
                    <p><strong>Sede:</strong> Recife / Paulista - PE</p>
                    <p><strong>E-mail:</strong> atendimento@vlengenhariamecanica.com.br</p>
                    <p><strong>Telefone / WhatsApp:</strong> (81) 98444-2592</p>
                  </td>
                  <td class="p-2.5 border border-slate-300 align-top space-y-1">
                    <p><strong>Razão Social:</strong> ${NOME_CLIENTE_RAZAO_SOCIAL}</p>
                    <p><strong>CNPJ/CPF:</strong> ${CNPJ_CLIENTE}</p>
                    <p><strong>Contato:</strong> ${REPRESENTANTE_NOME}</p>
                    <p><strong>E-mail:</strong> ${EMAIL_CLIENTE}</p>
                    <p><strong>Telefone:</strong> ${TELEFONE_CLIENTE}</p>
                    <p><strong>Localidade:</strong> ${LOCALIDADE_SERVICO}</p>
                  </td>
                </tr>
                <tr class="bg-slate-50 font-medium">
                  <td colspan="2" class="p-2.5 border border-slate-300">
                    <strong>DETALHES DA PROPOSTA:</strong> Proposta nº ${PROP_CODIGO} | Data: ${DATA_EMISSAO} | Demanda: ${DESCRICAO_DEMANDA}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>`
        },
        {
          numero: 8,
          titulo: "NOSSA EQUIPE & ESTRUTURA DA PROPOSTA",
          conteudoHtml: `<div class="space-y-4 text-xs leading-relaxed">
            <p class="text-slate-700">
              Nossos laudos, pareceres e vistorias são elaborados, assinados e homologados exclusivamente por Engenheiros Mecânicos habilitados com registro regular ativo no CREA-PE. Garantimos a plena responsabilidade técnica (ART) sobre cada equipamento avaliado.
            </p>
            <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 class="font-bold text-[#0B1E3D] text-sm mb-2">Estrutura da Proposta em 3 Etapas:</h4>
              <ul class="space-y-2 list-disc list-inside text-slate-700">
                <li><strong>Etapa 1: Relação/Descrição dos Serviços</strong> — Normas técnicas associadas e levantamento fotográfico detalhado.</li>
                <li><strong>Etapa 2: Escopo dos Serviços / Metodologia</strong> — Rotinas técnicas de inspeção, checklists in loco e elaboração de dossiê conclusivo.</li>
                <li><strong>Etapa 3: Prazo, Forma de Pagamento e Valores</strong> — Condições comerciais, cronograma financeiro e entrega homologada com ART.</li>
              </ul>
            </div>
          </div>`
        },
        {
          numero: 9,
          titulo: "ETAPA 1 - RELAÇÃO DOS SERVIÇOS & LEVANTAMENTO FOTOGRÁFICO",
          conteudoHtml: `<div class="space-y-4 text-xs">
            <div class="p-3 bg-slate-50 rounded border border-slate-200">
              <p><strong>Serviço Contratado:</strong> ${DESCRICAO_DEMANDA}</p>
              <p><strong>Normas Técnicas Associadas:</strong> ${NORMAS_TECNICAS}</p>
            </div>
            <div class="p-4 border-2 border-dashed border-slate-300 rounded-lg text-center bg-slate-50/50">
              <p class="font-semibold text-slate-700 mb-1">Bloco para Levantamento Fotográfico Preliminar</p>
              <p class="text-slate-500 text-[11px]">${FOTOS_DESCRICAO_OU_PATHS}</p>
              <p class="text-slate-400 text-[10px] mt-2">(Imagens de campo coletadas durante a vistoria inicial e integradas ao laudo pericial final)</p>
            </div>
          </div>`
        },
        {
          numero: 10,
          titulo: "ETAPA 2 - ESCOPO TÉCNICO DAS ATIVIDADES (METODOLOGIA)",
          subtitulo: "FASES, CHECKLISTS E ENSAIOS EM 4 ETAPAS",
          conteudoHtml: `<div class="space-y-3.5 text-xs">
            <div style="background: #0B1E3D; color: #ffffff; padding: 10px 14px; border-radius: 10px; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 6px; background: #1565D8; font-weight: 900; font-size: 11px;">M</span>
                <div>
                  <strong style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; display: block;">Metodologia de Engenharia em 5 Fases Sequenciais</strong>
                  <span style="font-size: 9px; color: #93c5fd;">Inspeção in loco, checklists normativos, instrumentação, laudo e homologação legal CREA-PE</span>
                </div>
              </div>
              <span style="background: rgba(212, 175, 55, 0.2); border: 1px solid #D4AF37; color: #fde047; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 800;">
                CREA-PE HABILITADO
              </span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 9px;">
              <div style="background: #ffffff; border: 1.5px solid #bfdbfe; border-left: 5px solid #1d4ed8; border-radius: 10px; padding: 10px 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="background: #dbeafe; color: #1e40af; font-weight: 900; font-size: 10px; padding: 2px 8px; border-radius: 4px; font-family: monospace;">FASE 01</span>
                    <strong style="color: #0b1e3d; font-size: 12px; font-weight: 800;">Inspeção Visual In Loco & Diagnóstico Preliminar</strong>
                  </div>
                  <span style="font-size: 10px; color: #1d4ed8; font-weight: 700; background: #eff6ff; padding: 2px 6px; border-radius: 4px;">Vistoria de Campo</span>
                </div>
                <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0 0 6px 0;">
                  Vistoria presencial minuciosa do ativo para mapeamento visual de não-conformidades de segurança, desgastes mecânicos, corrosão, fixações e análise física do ambiente fabril/operacional.
                </p>
                <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: #0284c7; font-weight: 600;">
                  <span>✓ Entregável:</span> <span style="color: #334155;">Levantamento fotográfico em alta resolução e registro de evidências fáticas.</span>
                </div>
              </div>

              <div style="background: #ffffff; border: 1.5px solid #fde68a; border-left: 5px solid #d97706; border-radius: 10px; padding: 10px 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="background: #fef3c7; color: #92400e; font-weight: 900; font-size: 10px; padding: 2px 8px; border-radius: 4px; font-family: monospace;">FASE 02</span>
                    <strong style="color: #0b1e3d; font-size: 12px; font-weight: 800;">Aplicação de Checklists Normativos Técnicos</strong>
                  </div>
                  <span style="font-size: 10px; color: #b45309; font-weight: 700; background: #fffbeb; padding: 2px 6px; border-radius: 4px;">Conformidade Legal</span>
                </div>
                <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0 0 6px 0;">
                  Auditoria item por item das exigências regulamentadoras vigentes (${NORMAS_TECNICAS}), analisando proteções mecânicas, distâncias de segurança (ABNT NBR ISO 13857/13855), enclausuramentos e intertravamentos elétricos.
                </p>
                <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: #b45309; font-weight: 600;">
                  <span>✓ Entregável:</span> <span style="color: #334155;">Relatório de conformidade item a item conforme normas ABNT e NRs federais.</span>
                </div>
              </div>

              <div style="background: #ffffff; border: 1.5px solid #c7d2fe; border-left: 5px solid #4f46e5; border-radius: 10px; padding: 10px 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="background: #e0e7ff; color: #4338ca; font-weight: 900; font-size: 10px; padding: 2px 8px; border-radius: 4px; font-family: monospace;">FASE 03</span>
                    <strong style="color: #0b1e3d; font-size: 12px; font-weight: 800;">Ensaios Físicos, Medições e Testes Funcionais</strong>
                  </div>
                  <span style="font-size: 10px; color: #4f46e5; font-weight: 700; background: #eef2ff; padding: 2px 6px; border-radius: 4px;">Instrumentado</span>
                </div>
                <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0 0 6px 0;">
                  Ensaios não destrutivos cabíveis (ultrassom, líquidos penetrantes), testes funcionais de paradas de emergência, medição de espessura de chapas, verificação de folgas mecânicas e calibração de salvaguardas.
                </p>
                <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: #4f46e5; font-weight: 600;">
                  <span>✓ Entregável:</span> <span style="color: #334155;">Planilha de grandezas medidas com instrumentos calibrados e rastreáveis RBC/Inmetro.</span>
                </div>
              </div>

              <div style="background: #ffffff; border: 1.5px solid #a7f3d0; border-left: 5px solid #059669; border-radius: 10px; padding: 10px 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="background: #d1fae5; color: #065f46; font-weight: 900; font-size: 10px; padding: 2px 8px; border-radius: 4px; font-family: monospace;">FASE 04</span>
                    <strong style="color: #0b1e3d; font-size: 12px; font-weight: 800;">Dossiê Técnico, Matriz de Risco & Parecer Conclusivo</strong>
                  </div>
                  <span style="font-size: 10px; color: #059669; font-weight: 700; background: #ecfdf5; padding: 2px 6px; border-radius: 4px;">Engenharia Diagnóstica</span>
                </div>
                <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0 0 6px 0;">
                  Elaboração de laudo pericial detalhado contendo análise de risco quantitativa (HRN/SIL), memorial técnico descritivo, plano de ação corretivo claro e cronograma prioritário de adequações físicas.
                </p>
                <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: #059669; font-weight: 600;">
                  <span>✓ Entregável:</span> <span style="color: #334155;">Laudo Pericial Conclusivo digital em PDF com assinatura eletrônica e certificado digital.</span>
                </div>
              </div>

              <div style="background: #ffffff; border: 1.5px solid #e9d5ff; border-left: 5px solid #7c3aed; border-radius: 10px; padding: 10px 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="background: #f3e8ff; color: #6b21a8; font-weight: 900; font-size: 10px; padding: 2px 8px; border-radius: 4px; font-family: monospace;">FASE 05</span>
                    <strong style="color: #0b1e3d; font-size: 12px; font-weight: 800;">Emissão e Registro Oficial da ART CREA-PE</strong>
                  </div>
                  <span style="font-size: 10px; color: #7c3aed; font-weight: 700; background: #faf5ff; padding: 2px 6px; border-radius: 4px;">Homologação Legal</span>
                </div>
                <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0 0 6px 0;">
                  Anotação de Responsabilidade Técnica emitida eletronicamente junto ao CREA-PE, conferindo fé pública, respaldo institucional e plena validade jurídica perante fiscalizações do Ministério do Trabalho, CBMPE e seguradoras.
                </p>
                <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: #7c3aed; font-weight: 600;">
                  <span>✓ Entregável:</span> <span style="color: #334155;">Certidão oficial de ART quitada com chave de autenticidade e QR code do CREA-PE.</span>
                </div>
              </div>
            </div>
          </div>`
        },
        {
          numero: 11,
          titulo: "INFORMAÇÕES TÉCNICAS OPERACIONAIS & DIRETRIZES",
          conteudoHtml: `<div class="space-y-4 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded border border-slate-200 font-medium">
              <div><strong>Ativos / Máquinas:</strong> ${QTD_EQUIPAMENTOS}</div>
              <div><strong>Tempo de Engenharia:</strong> ${HORAS_ENGENHARIA}</div>
              <div><strong>Mobilização:</strong> ${MOBILIZACAO}</div>
            </div>
            <div>
              <h4 class="font-bold text-[#0B1E3D] text-xs mb-2">Diretrizes e Obrigações do Cliente:</h4>
              <ul class="space-y-1.5 list-disc list-inside text-slate-700">
                <li>Acesso livre e desimpedido às máquinas/veículos e instalações objeto de vistoria técnica.</li>
                <li>Presença de operador qualificado ou técnico de manutenção para acionamento mecânico teste.</li>
                <li>Envio de documentação de histórico prévio, manuais de fabricação ou plantas caso existentes.</li>
                <li>Liberação de segurança interna do pátio operacional (EPIs especiais se exigido).</li>
              </ul>
            </div>
          </div>`
        },
        {
          numero: 12,
          titulo: "ETAPA 3 - PRAZO, PAGAMENTO & INVESTIMENTO",
          subtitulo: "INVESTIMENTO COMERCIAL E TERMOS FINANCEIROS",
          conteudoHtml: `<div class="space-y-4 text-xs">
            <div style="background: linear-gradient(135deg, #0B1E3D 0%, #1565D8 100%); color: #ffffff; border-radius: 14px; padding: 18px 20px; box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.15); position: relative; overflow: hidden;" class="text-white">
              <div style="position: absolute; right: -20px; bottom: -20px; width: 140px; height: 140px; border-radius: 50%; background: rgba(255, 255, 255, 0.05); pointer-events: none;"></div>
              <div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
                <span style="background: rgba(212, 175, 55, 0.25); border: 1.5px solid #D4AF37; color: #fef08a; padding: 3px 12px; border-radius: 20px; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 6px;">
                  INVESTIMENTO COMERCIAL LÍQUIDO
                </span>
                <div style="font-size: 32px; line-height: 1.1; font-weight: 900; font-family: monospace; letter-spacing: -0.5px; color: #ffffff; margin: 6px 0;">
                  ${VALOR_INVESTIMENTO}
                </div>
                <p style="color: #e2e8f0; font-size: 11px; max-width: 500px; margin: 0; line-height: 1.4;">
                  ${comNotaFiscal
                    ? 'Valor líquido para prestação de serviços de engenharia com emissão de Nota Fiscal (NFS-e) e taxa de ART inclusa.'
                    : 'Valor líquido para prestação de serviços técnicos de engenharia com Recibo de Prestação Autônoma e taxa de ART inclusa.'
                  }
                </p>
                <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 10px;">
                  <span style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); padding: 3px 10px; border-radius: 6px; font-size: 10px; font-weight: 700;">
                    ✓ Taxa ART CREA-PE Inclusa
                  </span>
                  <span style="background: ${comNotaFiscal ? 'rgba(34, 197, 94, 0.25)' : 'rgba(255, 255, 255, 0.15)'}; border: 1px solid ${comNotaFiscal ? '#86efac' : 'rgba(255,255,255,0.2)'}; padding: 3px 10px; border-radius: 6px; font-size: 10px; font-weight: 700; color: ${comNotaFiscal ? '#f0fdf4' : '#ffffff'};">
                    ${comNotaFiscal ? '✓ Nota Fiscal de Serviços (NFS-e)' : '• Faturamento via Recibo (Sem NFS-e)'}
                  </span>
                  <span style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); padding: 3px 10px; border-radius: 6px; font-size: 10px; font-weight: 700;">
                    ✓ Deslocamento e Laudo Completo
                  </span>
                </div>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px;">
              <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-top: 4px solid #1565D8; border-radius: 10px; padding: 10px 12px; text-align: center;">
                <span style="color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 3px;">
                  ⏱️ PRAZO DE EXECUÇÃO
                </span>
                <strong style="color: #0b1e3d; font-size: 13px; font-weight: 800; display: block; margin-bottom: 2px;">
                  ${PRAZO_ENTREGA}
                </strong>
                <span style="color: #64748b; font-size: 10px; line-height: 1.3; display: block;">
                  Contados a partir da vistoria in loco.
                </span>
              </div>

              <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-top: 4px solid #059669; border-radius: 10px; padding: 10px 12px; text-align: center;">
                <span style="color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 3px;">
                  💳 CONDIÇÕES DE PAGAMENTO
                </span>
                <strong style="color: #065f46; font-size: 12px; font-weight: 800; display: block; margin-bottom: 2px;">
                  ${CONDICOES_PAGAMENTO}
                </strong>
                <span style="color: #64748b; font-size: 10px; line-height: 1.3; display: block;">
                  PIX, transferência ou boleto bancário.
                </span>
              </div>

              <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-top: 4px solid #d97706; border-radius: 10px; padding: 10px 12px; text-align: center;">
                <span style="color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 3px;">
                  📅 VALIDADE DA PROPOSTA
                </span>
                <strong style="color: #92400e; font-size: 13px; font-weight: 800; display: block; margin-bottom: 2px;">
                  ${VALIDADE_DIAS} dias corridos
                </strong>
                <span style="color: #64748b; font-size: 10px; line-height: 1.3; display: block;">
                  Garantia de valores e disponibilidade.
                </span>
              </div>
            </div>

            <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; gap: 14px;">
              <div style="display: flex; align-items: center; gap: 14px; flex: 1;">
                <div style="background: #ffffff; padding: 4px; border: 1.5px solid #86efac; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.06); text-align: center; flex-shrink: 0;">
                  <img src="${QR_CODE_PIX_BASE64}" alt="QR Code PIX CPF" style="width: 76px; height: 76px; display: block;" />
                  <span style="font-size: 8px; color: #166534; font-weight: 800; display: block; margin-top: 2px; font-family: monospace;">QR CODE PIX</span>
                </div>
                <div style="font-size: 11px; line-height: 1.45;">
                  <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
                    <span style="background: #22c55e; color: #ffffff; width: 20px; height: 20px; border-radius: 5px; display: inline-flex; align-items: center; justify-content: center; font-weight: 900; font-size: 11px;">$</span>
                    <strong style="color: #14532d; font-size: 11px; text-transform: uppercase;">DADOS PARA PAGAMENTO VIA PIX (QR CODE & CHAVE)</strong>
                  </div>
                  <p style="margin: 2px 0; color: #166534;">
                    Chave PIX (CPF): <strong style="color: #0b1e3d; font-family: monospace; font-size: 12px; background: #dcfce7; padding: 1px 6px; border-radius: 4px; border: 1px solid #86efac;">102.870.934-09</strong>
                  </p>
                  <p style="margin: 2px 0; color: #334155; font-size: 10px;">
                    Titular: <strong>Vitor Leonardo Cordeiro Linhares</strong>
                  </p>
                  <p style="margin: 2px 0; color: #64748b; font-size: 9.5px;">
                    Aponte a câmera do aplicativo do seu banco para o QR Code acima para efetuar o pagamento imediato.
                  </p>
                </div>
              </div>

            </div>

            <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; padding-top: 8px; border-top: 1px solid #e2e8f0;">
              <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 12px; text-align: center;">
                <p style="color: #0b1e3d; font-weight: 800; font-size: 11px; margin: 0 0 2px 0;">VL ENGENHARIA MECÂNICA</p>
                <p style="color: #1565d8; font-weight: 700; font-size: 10px; margin: 0 0 2px 0;">Eng. Vitor Leonardo Cordeiro Linhares</p>
                <p style="color: #64748b; font-size: 9px; font-family: monospace; margin: 0 0 8px 0;">CREA-PE: 182229949-0 • Responsável Técnico</p>
                <span style="display: inline-block; background: #ecfdf5; border: 1px solid #a7f3d0; color: #059669; padding: 3px 10px; border-radius: 6px; font-size: 9px; font-weight: 800;">
                  ✓ Assinado Digitalmente pelo Emissor
                </span>
              </div>

              <div style="background: #ffffff; border: 1.5px dashed #cbd5e1; border-radius: 10px; padding: 12px; text-align: center;">
                <p style="color: #0b1e3d; font-weight: 800; font-size: 11px; margin: 0 0 2px 0;">${NOME_CLIENTE_RAZAO_SOCIAL}</p>
                <p style="color: #475569; font-weight: 600; font-size: 10px; margin: 0 0 2px 0;">${REPRESENTANTE_NOME}</p>
                <p style="color: #64748b; font-size: 9px; margin: 0 0 8px 0;">De Acordo / Representante Autorizado do Contratante</p>
                <span style="display: inline-block; background: #fffbeb; border: 1px solid #fde68a; color: #b45309; padding: 3px 10px; border-radius: 6px; font-size: 9px; font-weight: 800;">
                  [Aceite Eletrônico / Assinatura Digital]
                </span>
              </div>
            </div>
          </div>`
        },
        {
          numero: 13,
          titulo: "AGRADECIMENTO & CONTATO",
          subtitulo: "INFORMAÇÕES INSTITUCIONAIS E ATENDIMENTO DIRETO",
          conteudoHtml: `<div class="space-y-4 text-xs">
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 16px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.03);">
              <div style="display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; background: #0B1E3D; color: #ffffff; margin-bottom: 8px;">
                <span style="font-size: 16px;">🤝</span>
              </div>
              <h3 style="color: #0B1E3D; font-size: 14px; font-weight: 900; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                Agradecimento & Parceria Técnica de Confiança
              </h3>
              <p style="color: #475569; font-size: 11px; line-height: 1.55; max-width: 520px; margin: 0 auto;">
                A <strong>VL Engenharia Mecânica</strong> agradece a oportunidade de apresentar esta Proposta Técnico-Comercial. Colocamo-nos à inteira disposição para qualquer alinhamento técnico, esclarecimento de dúvidas e pronto início das atividades operacionais.
              </p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px;">
              <div style="background: #ffffff; border: 1.5px solid #86efac; border-left: 4px solid #16a34a; border-radius: 10px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                  <span style="background: #dcfce7; color: #15803d; font-size: 13px; width: 24px; height: 24px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center;">📞</span>
                  <div>
                    <strong style="color: #0b1e3d; font-size: 11px; display: block;">Telefone & WhatsApp Direto</strong>
                    <span style="color: #15803d; font-size: 9px; font-weight: 700; text-transform: uppercase;">Atendimento Rápido</span>
                  </div>
                </div>
                <p style="color: #15803d; font-size: 12px; font-weight: 800; font-family: monospace; margin: 4px 0 2px 0;">
                  (81) 98444-2592
                </p>
                <span style="color: #64748b; font-size: 10px;">Segunda a Sexta, das 08h às 18h. Plantão pericial.</span>
              </div>

              <div style="background: #ffffff; border: 1.5px solid #93c5fd; border-left: 4px solid #1565d8; border-radius: 10px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                  <span style="background: #dbeafe; color: #1e40af; font-size: 13px; width: 24px; height: 24px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center;">✉️</span>
                  <div>
                    <strong style="color: #0b1e3d; font-size: 11px; display: block;">E-mail Comercial Oficial</strong>
                    <span style="color: #1565d8; font-size: 9px; font-weight: 700; text-transform: uppercase;">Envio de Documentos</span>
                  </div>
                </div>
                <p style="color: #1565d8; font-size: 11px; font-weight: 800; font-family: monospace; margin: 4px 0 2px 0; word-break: break-all;">
                  atendimento@vlengenhariamecanica.com.br
                </p>
                <span style="color: #64748b; font-size: 10px;">Canal direto com o Engenheiro Mecânico Responsável.</span>
              </div>

              <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-left: 4px solid #0B1E3D; border-radius: 10px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                  <span style="background: #e2e8f0; color: #0b1e3d; font-size: 13px; width: 24px; height: 24px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center;">🏢</span>
                  <div>
                    <strong style="color: #0b1e3d; font-size: 11px; display: block;">Sede Operacional & Atendimento</strong>
                    <span style="color: #64748b; font-size: 9px; font-weight: 700; text-transform: uppercase;">Pernambuco / Nordeste</span>
                  </div>
                </div>
                <p style="color: #0B1E3D; font-size: 11px; font-weight: 700; margin: 4px 0 2px 0;">
                  Recife / Região Metropolitana - PE
                </p>
                <span style="color: #64748b; font-size: 10px;">Atendimento in loco em indústrias, polos e condomínios.</span>
              </div>

              <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-left: 4px solid #0B1E3D; border-radius: 10px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                  <span style="background: #e2e8f0; color: #0b1e3d; font-size: 13px; width: 24px; height: 24px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center;">🛡️</span>
                  <div>
                    <strong style="color: #0b1e3d; font-size: 11px; display: block;">Responsabilidade Técnica CREA-PE</strong>
                    <span style="color: #0b1e3d; font-size: 9px; font-weight: 700; text-transform: uppercase;">Registro Ativo Regular</span>
                  </div>
                </div>
                <p style="color: #0B1E3D; font-size: 12px; font-weight: 800; font-family: monospace; margin: 4px 0 2px 0;">
                  CREA-PE: 182229949-0
                </p>
                <span style="color: #64748b; font-size: 10px;">Eng. Mecânico Vitor Leonardo Cordeiro Linhares.</span>
              </div>
            </div>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px 12px; display: flex; align-items: center; justify-content: space-around; text-align: center; font-size: 10px; color: #475569;">
              <div><strong>🔒 Sigilo e Confidencialidade</strong> (LGPD)</div>
              <div>•</div>
              <div><strong>⚖️ Emissão de ART Oficial</strong> (CREA-PE)</div>
              <div>•</div>
              <div><strong>📐 Conformidade ABNT / NRs</strong></div>
            </div>
          </div>`
        }
      ]
    };

    if (!apiKey) {
      monthlyAICalls++;
      return res.json({
        ...fallbackProposal,
        mock: true,
        currentUsage: monthlyAICalls,
        limit: MONTHLY_LIMIT,
      });
    }

    const ai = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const proposalSystemPrompt = `[SISTEMA: GERADOR OFICIAL DE PROPOSTAS TÉCNICO-COMERCIAIS DA VL ENGENHARIA]

Você é um Engenheiro Mecânico Perito e Consultor Técnico Especialista. Sua função é gerar a estrutura e o conteúdo textual completo para Propostas Técnico-Comerciais de Engenharia Mecânica no padrão corporativo da VL ENGENHARIA MECÂNICA (CREA-PE: 182229949-0).

### 1. DADOS DE ENTRADA:
- Código da Proposta: ${PROP_CODIGO}
- Data de Emissão: ${DATA_EMISSAO}
- Validade Comercial: ${VALIDADE_DIAS} dias
- Cliente: ${NOME_CLIENTE_RAZAO_SOCIAL}
- CNPJ/CPF do Cliente: ${CNPJ_CLIENTE}
- Representante / Contato: ${REPRESENTANTE_NOME}
- E-mail do Cliente: ${EMAIL_CLIENTE}
- Telefone do Cliente: ${TELEFONE_CLIENTE}
- Cidade/UF de Atendimento: ${LOCALIDADE_SERVICO}
- Descrição da Demanda: ${DESCRICAO_DEMANDA}
- Normas Técnicas Aplicáveis: ${NORMAS_TECNICAS}
- Total de Equipamentos/Ativos: ${QTD_EQUIPAMENTOS}
- Tempo de Engenharia Estimado: ${HORAS_ENGENHARIA}
- Janela de Mobilização: ${MOBILIZACAO}
- Prazo de Entrega do Laudo: ${PRAZO_ENTREGA}
- Condições de Pagamento: ${CONDICOES_PAGAMENTO}
- Valor Total do Investimento: ${VALOR_INVESTIMENTO}
- Fotos Preliminares: ${FOTOS_DESCRICAO_OU_PATHS}

### 2. INFORMAÇÕES FIXAS DA VL ENGENHARIA:
- Razão Social/Fantasia: VL ENGENHARIA MECÂNICA
- Responsável Técnico: Vitor Leonardo Cordeiro Linhares
- Registro Profissional: CREA-PE 182229949-0
- Sede: Recife / Paulista - PE, Brasil
- E-mail: vitorleonardocl@gmail.com
- Telefone / WhatsApp: (81) 98444-2592

Retorne estritamente um objeto JSON com as 13 páginas contendo o texto HTML rico com estilo inline/classes Tailwind limpas para cada página seguindo a estrutura mandatória:
{
  "codigoProposta": "${PROP_CODIGO}",
  "paginas": [
    { "numero": 1, "titulo": "CAPA E IDENTIFICAÇÃO DO CLIENTE", "subtitulo": "LAUDOS, VISTORIAS & RESPONSABILIDADE TÉCNICA", "conteudoHtml": "..." },
    ... até a página 13
  ]
}`;

    const modelName = "gemini-3.8-flash";
    let textResponse = "";

    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [
          {
            role: "user",
            parts: [{ text: proposalSystemPrompt }]
          }
        ],
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        }
      });
      textResponse = response.text || "";
    } catch (primaryErr: any) {
      console.warn("Falha no modelo principal de proposta, tentando fallback gemini-3.6-flash:", primaryErr?.message);
      const fallbackResponse = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [{ role: "user", parts: [{ text: proposalSystemPrompt }] }],
        config: { responseMimeType: "application/json", temperature: 0.2 }
      });
      textResponse = fallbackResponse.text || "";
    }

    monthlyAICalls++;
    let parsed = fallbackProposal;
    try {
      const parsedAi = JSON.parse(textResponse);
      if (parsedAi.paginas && Array.isArray(parsedAi.paginas) && parsedAi.paginas.length >= 10) {
        parsed = {
          ...fallbackProposal,
          ...parsedAi,
          codigoProposta: parsedAi.codigoProposta || PROP_CODIGO,
        };
      }
    } catch {
      console.warn("JSON retornado pela IA para proposta não pôde ser parseado perfeitamente; usando estrutura base enriquecida.");
    }

    return res.json({
      ...parsed,
      mock: false,
      currentUsage: monthlyAICalls,
      limit: MONTHLY_LIMIT,
    });
  } catch (err: any) {
    console.error("Erro na geração da proposta técnico-comercial com IA:", err);
    return res.status(500).json({
      error: "Falha na geração da proposta: " + (err?.message || "Erro desconhecido"),
    });
  }
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.path.startsWith("/api/")) {
    const status = err?.status || err?.statusCode || (err?.type === "entity.too.large" ? 413 : 500);
    const msg =
      status === 413
        ? "Arquivo muito grande para envio direto."
        : err?.message || "Erro interno no servidor.";
    return res.status(status).json({ error: msg });
  }
  return next(err);
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`VL Engenharia Server ativo na porta ${PORT}`);
  });
}

// Vercel imports the Express app as a serverless function instead of opening a port.
if (!process.env.VERCEL) {
  void startServer();
}

export { app };
