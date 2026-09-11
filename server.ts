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
      FOTOS_DESCRICAO_OU_PATHS = "Levantamento fotográfico preliminar do parque fabril"
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

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
          titulo: "CAPA E IDENTIFICAÇÃO DO CLIENTE",
          subtitulo: "LAUDOS, VISTORIAS & RESPONSABILIDADE TÉCNICA",
          conteudoHtml: `<div class="space-y-4">
            <h2 class="text-2xl font-black text-[#0B1E3D]">PROPOSTA TÉCNICA COMERCIAL // ORÇAMENTO DE ENGENHARIA</h2>
            <p class="text-sm font-semibold text-[#D4AF37]">LAUDOS, VISTORIAS & RESPONSABILIDADE TÉCNICA</p>
            <p class="text-slate-700 text-sm leading-relaxed">Prestação de serviços de Engenharia Mecânica de conformidade, mapeamento de risco técnico e emissão de ART oficial para regularização jurídica e operacional.</p>
            <div class="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-4 text-sm space-y-1">
              <p><strong>Razão Social:</strong> ${NOME_CLIENTE_RAZAO_SOCIAL}</p>
              <p><strong>CNPJ:</strong> ${CNPJ_CLIENTE}</p>
              <p><strong>Representante / Contato:</strong> ${REPRESENTANTE_NOME}</p>
              <p><strong>Proposta nº:</strong> ${PROP_CODIGO} | <strong>Data:</strong> ${DATA_EMISSAO} | <strong>Validade:</strong> ${VALIDADE_DIAS} dias</p>
              <p><strong>Localidade:</strong> ${LOCALIDADE_SERVICO}</p>
              <p><strong>Responsável Técnico:</strong> Eng. Mecânico Vitor Leonardo Cordeiro Linhares (CREA-PE: 182229949-0)</p>
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
          titulo: "RESUMO DE NOSSOS SERVIÇOS (CATÁLOGO GERAL)",
          conteudoHtml: `<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div class="p-3 bg-slate-50 rounded border border-slate-200">
              <strong class="text-[#0B1E3D] block text-sm mb-1">ADEQUAÇÃO NR-12:</strong>
              <p class="text-slate-600">Análise de risco de máquinas industriais, inventários de risco, projeto conceitual de proteções metálicas e emissão de ART.</p>
            </div>
            <div class="p-3 bg-slate-50 rounded border border-slate-200">
              <strong class="text-[#0B1E3D] block text-sm mb-1">PLAYGROUNDS:</strong>
              <p class="text-slate-600">Avaliação e laudo de brinquedos infantis sob normas ABNT NBR 16071, atestando conformidade estrutural e segurança em parques.</p>
            </div>
            <div class="p-3 bg-slate-50 rounded border border-slate-200">
              <strong class="text-[#0B1E3D] block text-sm mb-1">PROJETOS MECÂNICOS 3D:</strong>
              <p class="text-slate-600">Modelagem matemática tridimensional CAD, cálculo estrutural FEA por elementos finitos e detalhamento de fabricação técnica.</p>
            </div>
            <div class="p-3 bg-slate-50 rounded border border-slate-200">
              <strong class="text-[#0B1E3D] block text-sm mb-1">VEÍCULOS & MÁQUINAS:</strong>
              <p class="text-slate-600">Laudo técnico estrutural de caminhões munck, guindastes de grande porte, ônibus de transporte escolar e perícia de sinistro.</p>
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
                    <p><strong>E-mail:</strong> vitorleonardocl@gmail.com</p>
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
          conteudoHtml: `<div class="overflow-x-auto">
            <table class="w-full text-xs text-left border-collapse border border-slate-300">
              <thead>
                <tr class="bg-[#0B1E3D] text-white">
                  <th class="p-2 border border-slate-300 w-16">ITEM</th>
                  <th class="p-2 border border-slate-300 w-44">FASE / ATIVIDADE</th>
                  <th class="p-2 border border-slate-300">DESCRIÇÃO TÉCNICA OPERACIONAL</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                <tr>
                  <td class="p-2 font-bold text-center border border-slate-300">Item 01</td>
                  <td class="p-2 font-semibold border border-slate-300">Inspeção In Loco</td>
                  <td class="p-2 border border-slate-300">Vistoria presencial minuciosa do ativo para mapeamento visual de não-conformidades de segurança e coleta de dados físicos.</td>
                </tr>
                <tr class="bg-slate-50">
                  <td class="p-2 font-bold text-center border border-slate-300">Item 02</td>
                  <td class="p-2 font-semibold border border-slate-300">Checklists Normativos</td>
                  <td class="p-2 border border-slate-300">Aplicação de checklists técnicos customizados baseados nas resoluções ABNT, NRs ou diretrizes federais de referência (${NORMAS_TECNICAS}).</td>
                </tr>
                <tr>
                  <td class="p-2 font-bold text-center border border-slate-300">Item 03</td>
                  <td class="p-2 font-semibold border border-slate-300">Testes Operacionais</td>
                  <td class="p-2 border border-slate-300">Verificação das condições estruturais físicas da categoria do equipamento, incluindo ensaios estáticos/dinâmicos cabíveis.</td>
                </tr>
                <tr class="bg-slate-50">
                  <td class="p-2 font-bold text-center border border-slate-300">Item 04</td>
                  <td class="p-2 font-semibold border border-slate-300">Emissão de Relatório</td>
                  <td class="p-2 border border-slate-300">Elaboração de laudo fotográfico conclusivo apontando falhas e plano de ação corretivo detalhado para readequação física.</td>
                </tr>
                <tr>
                  <td class="p-2 font-bold text-center border border-slate-300">Item 05</td>
                  <td class="p-2 font-semibold border border-slate-300">ART CREA-PE</td>
                  <td class="p-2 border border-slate-300">Anotação de Responsabilidade Técnica emitida eletronicamente junto ao conselho regional de engenharia, conferindo plena validade legal.</td>
                </tr>
              </tbody>
            </table>
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
          conteudoHtml: `<div class="space-y-4 text-xs">
            <div class="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <p><strong>Prazo para Entrega dos Laudos:</strong> ${PRAZO_ENTREGA}</p>
              <p><strong>Formas e Termos de Pagamento:</strong> ${CONDICOES_PAGAMENTO}</p>
              <div class="p-3 bg-white border border-[#D4AF37] rounded-md mt-2 flex items-center justify-between">
                <span class="font-bold text-sm text-[#0B1E3D]">INVESTIMENTO COMERCIAL LÍQUIDO:</span>
                <span class="font-black text-xl text-[#0B1E3D]">${VALOR_INVESTIMENTO}</span>
              </div>
              <p class="text-[11px] text-emerald-800 font-medium">
                ✓ Inclusos Emissão de Nota Fiscal de Serviços (NFS-e), taxas de CREA-PE (ART) e deslocamentos operacionais. A.R.T. Inclusa | CREA-PE Ativo.
              </p>
            </div>
            <p class="text-[11px] text-slate-500 italic">
              Cláusula de Validade: Proposta válida por ${VALIDADE_DIAS} dias a contar da data de emissão. Este orçamento de engenharia não constitui vínculo financeiro definitivo sem aceite digital formal.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div class="p-3 border rounded text-center bg-white">
                <p class="font-bold text-slate-800">Eng. Vitor Leonardo C. Linhares</p>
                <p class="text-slate-500 text-[10px]">Responsável Técnico CREA-PE 182229949-0</p>
                <div class="mt-2 text-[10px] text-emerald-600 font-semibold">Assinado Digitalmente pelo Emissor</div>
              </div>
              <div class="p-3 border rounded text-center bg-white border-dashed">
                <p class="font-bold text-slate-800">${REPRESENTANTE_NOME}</p>
                <p class="text-slate-500 text-[10px]">${NOME_CLIENTE_RAZAO_SOCIAL}</p>
                <div class="mt-2 text-[10px] text-amber-600 font-semibold">[Aguardando Assinatura Eletrônica / Aceite Digital]</div>
              </div>
            </div>
          </div>`
        },
        {
          numero: 13,
          titulo: "AGRADECIMENTO & CONTATO",
          conteudoHtml: `<div class="space-y-4 text-xs text-center py-4">
            <p class="text-slate-700 text-sm max-w-lg mx-auto leading-relaxed">
              A <strong>VL Engenharia Mecânica</strong> agradece pela oportunidade de apresentar esta Proposta Técnico-Comercial. Ficamos à total disposição para sanar quaisquer dúvidas técnicas ou comerciais e iniciar os trabalhos com excelência.
            </p>
            <div class="bg-slate-50 p-4 rounded-lg border border-slate-200 inline-block text-left max-w-md w-full space-y-1.5 text-xs text-slate-700">
              <p class="font-bold text-[#0B1E3D] text-sm">VL Engenharia Mecânica & Consultoria Pericial</p>
              <p>Recife / Paulista - Pernambuco, Brasil</p>
              <p><strong>Telefone / WhatsApp:</strong> (81) 98444-2592</p>
              <p><strong>E-mail:</strong> vitorleonardocl@gmail.com</p>
              <p><strong>Instagram:</strong> @vlengenharia</p>
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
