import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

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
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", company: "VL Engenharia", timestamp: new Date().toISOString() });
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

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
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

startServer();
