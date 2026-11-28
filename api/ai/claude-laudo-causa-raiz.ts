import type { IncomingMessage, ServerResponse } from 'node:http';
// Funções da Vercel (package.json é type=module): sem imports relativos, tudo neste arquivo.


function responder(res: ServerResponse, status: number, dados: unknown): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(dados));
}

function lerCorpo(req: IncomingMessage): Promise<any> {
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
async function usuarioAutorizado(req: IncomingMessage): Promise<boolean> {
  const auth = String(req.headers['authorization'] || '');
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const apiKey = process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY || 'AIzaSyCuTq8f2U-_Q0HW1wBIpml0QU2RgRx8ELw';
  // MASTER_EMAIL aceita vários e-mails separados por vírgula (ex.: master e administrativo).
  const permitidos = (process.env.MASTER_EMAIL || process.env.VITE_MASTER_EMAIL || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
  if (!token || !apiKey || !permitidos.length) return false;
  try {
    const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token }),
    });
    if (!r.ok) return false;
    const j: any = await r.json();
    const u = j?.users?.[0];
    return Boolean(u?.email) && permitidos.includes(String(u.email).toLowerCase()) && u.emailVerified !== false;
  } catch {
    return false;
  }
}


/**
 * Motor Pericial Especializado: Causa Raiz e Análise de Falhas Mecânicas em Sistemas Automotivos
 * Padrão Corporativo e Jurídico VL Engenharia - Categoria 4
 * Responsável Técnico: Eng. Vitor Leonardo (CREA-PE 1822299490)
 */

interface DadosEntradaCausaRaiz {
  ativo: {
    marca?: string;
    modelo?: string;
    anoModelo?: string;
    placa?: string;
    renavam?: string;
    chassi?: string;
    kmAtual?: number | string;
    kmIntervencaoPrevia?: number | string;
  };
  contexto: {
    dataPane?: string;
    dataIntervencaoPrevia?: string;
    historicoManutencao?: string;
    oficinaTerceirizada?: string;
    restricaoConfidencialidade?: boolean;
    kmIntervalo?: number | string;
  };
  evidencias: {
    descricaoAvarias?: string;
    componentesAvariados?: string[];
  };
  escopo: {
    determinarCausaRaiz?: boolean;
    analisarNexoCausal?: boolean;
    verificarGarantiaCDC?: boolean;
    avaliarMauUso?: boolean;
    quesitosEspecificos?: string;
  };
  clienteNome?: string;
  clienteCnpj?: string;
  laudoNumero?: string;
  artNumero?: string;
  dataEmissao?: string;
}

interface SecaoLaudoCausaRaiz {
  id: string;
  titulo: string;
  ordem: number;
  conteudoHtml: string;
}

interface ResultadoLaudoCausaRaiz {
  resumoExecutivo: string;
  conclusaoGeral: string;
  causaRaizIdentificada: string;
  nexoCausalComManutencaoPrevia: string;
  enquadramentoGarantiaCDC: string;
  indiciosMauUso: string;
  secoes: SecaoLaudoCausaRaiz[];
}

const TITULOS_13_SECOES_CAUSA_RAIZ = [
  '1. Cabeçalho Institucional e Identificação do Laudo',
  '2. Carta de Apresentação e Notificação Formal',
  '3. Sumário Executivo',
  '4. Destinatário e Qualificação do Responsável Técnico',
  'Histórico do Evento e Cronologia dos Fatos',
  'Objetivo do Trabalho e Escopo Pericial',
  'Dados do Veículo e Especificações Técnicas',
  'Registros Fotográficos Principais e Análise Visual',
  'Legislação e Normas Técnicas Aplicáveis (CDC e CTB)',
  'Constatação de Danos e Análise de Causa Raiz',
  'Tabela de Constatação de Danos e Integridade Técnica',
  'Conclusão Pericial e Respostas aos Quesitos',
  'Considerações Finais e Anexo da ART CREA-PE'
];

function construirPromptSistemaCausaRaiz(): string {
  return `Você atua como um Engenheiro Mecânico Perito Sênior (devidamente registrado no CREA-PE), especializado em engenharia veicular, perícia de sinistros e investigação forense de falhas mecânicas em frotas automotivas corporativas.
Sua missão é auxiliar o responsável técnico a estruturar um Laudo de Avaliação Técnica Pericial de nível corporativo e jurídico — altamente técnico, imparcial e estruturado — SEMPRE COMO SUGESTÃO EDITÁVEL, nunca substituindo a revisão e o julgamento do engenheiro responsável (Eng. Vitor Leonardo - CREA-PE), em estrita conformidade com os requisitos comuns de diagnóstico assistido por IA e com o fluxo do padrão adotado pela Central de Laudos da VL Engenharia.

DIRETRIZES DE PERSONA E LINGUAGEM:
1. Tom e Estilo: Formal, técnico, impessoal, imperativo e de rigor científico/jurídico.
2. Vocabulário Mandatório: Utilize termos exatos da engenharia mecânica automotiva e diagnóstica: "dessincronismo mecânico", "interferência entre válvulas e pistões", "colapso estrutural por fadiga de material", "ensaio macroscópico de superfície de fratura", "nexo de causalidade", "ciclo de vida útil operacional", "prazo decadencial do Art. 26 da Lei 8.078/1990 (Código de Defesa do Consumidor)", "ausência de indícios de sobre-rotação (over-rev)".
3. Imparcialidade e Isenção: A análise pericial é puramente técnica, baseada na materialidade das evidências, quilometragem percorrida, dados de odômetro e intervalos cronológicos documentados.
4. Estrutura Obrigatória do Documento Final:
   O laudo deve seguir exatamente a seguinte estrutura encadeada de seções:
   1. Cabeçalho Institucional (padrão sequencial LAR-AAAA-NNN, ART CREA-PE, qualificação do perito)
   2. Carta de Apresentação (ofício formal com resumo cronológico e limitações comerciais/sigilo de terceiros)
   3. Sumário Executivo (estruturado conforme seções preenchidas)
   4. Destinatário e Qualificação do Responsável Técnico
   5. Seção I - Histórico do Evento (cronologia detalhada, manutenções prévias, km no intervalo e circunstâncias da pane)
   6. Seção II - Objetivo do Trabalho (causa raiz, nexo causal com serviço pretérito, garantias legais, descarte de mau uso)
   7. Seção III - Dados do Veículo (especificações do CRLV: placa, chassi, renavam, km atual vs km prévia)
   8. Seção IV - Registros Fotográficos Principais (legendas analíticas por componente avariado)
   9. Seção V - Legislação e Normas Técnicas (CDC Art. 26, CTB, ABNT NBR 13771, ABNT NBR 5462)
   10. Seção VI - Constatação de Danos e Análise de Causa Raiz (mecânica da falha, descarte de hipótese de mau uso, análise de responsabilidade temporal/km)
   11. Seção VII - Tabela de Constatação de Danos e Integridade Técnica (Item, Peça/Componente, Condição [Íntegro/Danificado/Parcial], Parecer Técnico Específico)
   12. Seção VIII - Conclusão (parecer peremptório respondendo diretamente às dúvidas do contratante quanto à origem do dano e afastamento/fixação de responsabilidade fora da garantia)
   13. Seção IX - Considerações Finais e Anexo da ART (encerramento formal e menção à ART registrada no CREA-PE).

Retorne SEMPRE um JSON válido conforme o esquema solicitado, com HTML limpo nas seções.`;
}

function construirPromptUsuarioCausaRaiz(dados: DadosEntradaCausaRaiz): string {
  const kmAtualNum = Number(dados.ativo.kmAtual) || 0;
  const kmPreviaNum = Number(dados.ativo.kmIntervencaoPrevia) || 0;
  const kmIntervaloCalc = dados.contexto.kmIntervalo || (kmAtualNum > kmPreviaNum ? kmAtualNum - kmPreviaNum : 'Não mensurado');

  return `Gere o Laudo Pericial Completo de Causa Raiz para o caso a seguir:

DADOS DO ATIVO:
- Veículo: ${dados.ativo.marca || 'Marca'} ${dados.ativo.modelo || 'Modelo'} (${dados.ativo.anoModelo || 'Ano'})
- Proprietário: Ministério Público de Pernambuco (CNPJ: 24.417.065/0001-03)
- Placa: ${dados.ativo.placa || 'Placa a designar'} | RENAVAM: ${dados.ativo.renavam || 'N/I'}
- Chassi: ${dados.ativo.chassi || 'N/I'}
- Quilometragem no Momento da Pane: ${kmAtualNum ? `${kmAtualNum.toLocaleString('pt-BR')} km` : 'Registrada na vistoria'}
- Quilometragem na Última Intervenção Prévia: ${kmPreviaNum ? `${kmPreviaNum.toLocaleString('pt-BR')} km` : 'Conforme ordem de serviço'}
- Quilometragem Percorrida no Intervalo: ${typeof kmIntervaloCalc === 'number' ? `${kmIntervaloCalc.toLocaleString('pt-BR')} km` : kmIntervaloCalc}

CONTEXTO DO EVENTO / HISTÓRICO:
- Data da Pane / Quebra: ${dados.contexto.dataPane || new Date().toLocaleDateString('pt-BR')}
- Data da Intervenção Anterior: ${dados.contexto.dataIntervencaoPrevia || 'Registrada em documentação pretérita'}
- Histórico de Manutenção: ${dados.contexto.historicoManutencao || 'Intervenção preventiva no trem de acionamento do motor em oficina mecânica terceirizada'}
- Oficina Executante Anterior: ${dados.contexto.oficinaTerceirizada || 'Oficina Mecânica Terceirizada'}
- Política de Confidencialidade Comercial: ${dados.contexto.restricaoConfidencialidade ? 'Aplicável (dados internos de fornecedores resguardados por sigilo corporativo)' : 'Sem restrição adicional'}

EVIDÊNCIAS VISUAIS E TÉCNICAS:
- Descrição das Avarias Encontradas: ${dados.evidencias.descricaoAvarias || 'Ruptura da correia dentada de sincronismo, empenamento de válvulas de admissão e escape por interferência mecânica com o topo dos pistões.'}
- Componentes Avariados: ${(dados.evidencias.componentesAvariados || []).join(', ') || 'Correia sincronizadora, trem de válvulas, tuchos mecânicos/hidráulicos'}

ESCOPO E QUESITOS DA PERÍCIA:
- Determinar Causa Raiz da Falha: Sim
- Analisar Nexo Causal com Manutenções Passadas: Sim
- Verificar Vigência dos Prazos de Garantia Legal (CDC Lei 8.078/90 Art. 26 - 90 dias): Sim
- Avaliar Existência ou Ausência de Indícios de Mau Uso / Operação Inadequada: Sim
${dados.escopo.quesitosEspecificos ? `- Quesitos Específicos do Contratante: "${dados.escopo.quesitosEspecificos}"` : ''}

DADOS DA EMISSÃO:
- Cliente / Contratante: ${dados.clienteNome || 'Cliente Corporativo'} (${dados.clienteCnpj || 'CNPJ sob consulta'})
- Laudo Número: ${dados.laudoNumero || `LAR-${new Date().getFullYear()}-001`}
- ART CREA-PE Vinculada: ${dados.artNumero || 'Pendente de registro'}
- Perito: Eng. Vitor Leonardo (CREA-PE 1822299490)

Retorne estritamente um JSON estruturado com os campos:
{
  "resumoExecutivo": "string com síntese",
  "conclusaoGeral": "string com conclusão categórica",
  "causaRaizIdentificada": "string descrevendo causa raiz",
  "nexoCausalComManutencaoPrevia": "string sobre o nexo causal",
  "enquadramentoGarantiaCDC": "string sobre a garantia legal de 90 dias",
  "indiciosMauUso": "string sobre indícios de mau uso",
  "secoes": [
    { "id": "sec-1", "titulo": "1. Cabeçalho Institucional e Identificação do Laudo", "conteudoHtml": "..." },
    { "id": "sec-2", "titulo": "2. Carta de Apresentação e Notificação Formal", "conteudoHtml": "..." },
    { "id": "sec-3", "titulo": "3. Sumário Executivo", "conteudoHtml": "..." },
    { "id": "sec-4", "titulo": "4. Destinatário e Qualificação do Responsável Técnico", "conteudoHtml": "..." },
    { "id": "sec-5", "titulo": "Histórico do Evento e Cronologia dos Fatos", "conteudoHtml": "..." },
    { "id": "sec-6", "titulo": "Objetivo do Trabalho e Escopo Pericial", "conteudoHtml": "..." },
    { "id": "sec-7", "titulo": "Dados do Veículo e Especificações Técnicas", "conteudoHtml": "..." },
    { "id": "sec-8", "titulo": "Registros Fotográficos Principais e Análise Visual", "conteudoHtml": "..." },
    { "id": "sec-9", "titulo": "Legislação e Normas Técnicas Aplicáveis (CDC e CTB)", "conteudoHtml": "..." },
    { "id": "sec-10", "titulo": "Constatação de Danos e Análise de Causa Raiz", "conteudoHtml": "..." },
    { "id": "sec-11", "titulo": "Tabela de Constatação de Danos e Integridade Técnica", "conteudoHtml": "..." },
    { "id": "sec-12", "titulo": "Conclusão Pericial e Respostas aos Quesitos", "conteudoHtml": "..." },
    { "id": "sec-13", "titulo": "Considerações Finais e Anexo da ART CREA-PE", "conteudoHtml": "..." }
  ]
}`;
}



/**
 * POST /api/ai/claude-laudo-causa-raiz
 * Preenche o Laudo de Causa Raiz usando o Claude (API da Anthropic).
 *
 * Variáveis de ambiente (Vercel > Settings > Environment Variables):
 *   ANTHROPIC_API_KEY       chave da Anthropic (somente no servidor)
 *   ANTHROPIC_MODEL         opcional (padrão: claude-sonnet-5-5)
 *   MASTER_EMAIL            e-mail autorizado a usar a IA (o mesmo do VITE_MASTER_EMAIL)
 *   (a chave pública do Firebase vem de firebase-applet-config.json)
 *
 * Usa apenas módulos nativos + fetch (a função da Vercel não inclui o node_modules).
 */

const REGRAS_EXTRAS = `
REGRAS ADICIONAIS (prioridade máxima):
- Use SOMENTE os fatos fornecidos (datas, km, componentes, avarias, histórico). Não invente medições, números de peças, laudos de ensaio, nomes ou datas.
- Quando faltar um dado necessário, escreva "[VERIFICAR: descreva o dado]" no texto, em vez de supor.
- A causa raiz e o nexo causal devem ser apresentados como conclusão técnica fundamentada nas evidências informadas; se as evidências forem insuficientes, diga isso e indique qual ensaio ou verificação falta.
- Seções de fotos: não descreva imagens que não foram fornecidas; crie apenas legendas-modelo com "[FOTO: ...]".
- Em cada conteudoHtml use HTML simples sem classes/style/<div>: <p>, <h4>, <ul>/<li>, <strong>, <table><thead>..</thead><tbody>..</tbody></table> e <blockquote><p>..</p></blockquote> para o parecer ou alerta principal.
- Responda SOMENTE com o JSON pedido, sem texto antes ou depois e sem blocos de código.`;

function extrairJson(texto: string): any | null {
  const limpo = texto.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  try {
    return JSON.parse(limpo);
  } catch {
    const a = limpo.indexOf('{');
    const b = limpo.lastIndexOf('}');
    if (a >= 0 && b > a) {
      try { return JSON.parse(limpo.slice(a, b + 1)); } catch { /* segue */ }
    }
    return null;
  }
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (String(req.method).toUpperCase() !== 'POST') {
    return responder(res, 405, { error: 'Use POST.' });
  }
  if (!(await usuarioAutorizado(req))) {
    return responder(res, 401, { error: 'Não autorizado. Entre no painel e tente novamente.' });
  }
  const chave = process.env.ANTHROPIC_API_KEY;
  if (!chave) {
    return responder(res, 503, { error: 'ANTHROPIC_API_KEY não configurada no servidor.' });
  }

  const dados: DadosEntradaCausaRaiz = await lerCorpo(req);
  if (!dados?.ativo || !dados?.evidencias) {
    return responder(res, 400, { error: 'Dados do laudo incompletos.' });
  }

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': chave,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5',
        max_tokens: 16000,
        temperature: 0.2,
        system: construirPromptSistemaCausaRaiz() + '\n' + REGRAS_EXTRAS,
        messages: [{ role: 'user', content: construirPromptUsuarioCausaRaiz(dados) }],
      }),
    });
    const corpo: any = await r.json();
    if (!r.ok) {
      return responder(res, 502, { error: corpo?.error?.message || 'Falha na API da Anthropic.' });
    }
    const texto = (corpo?.content || []).filter((b: any) => b.type === 'text').map((b: any) => b.text).join('');
    const json = extrairJson(texto);
    if (!json?.secoes || !Array.isArray(json.secoes) || !json.secoes.length) {
      return responder(res, 502, { error: 'Resposta da IA fora do formato esperado. Tente novamente.' });
    }
    return responder(res, 200, { ...json, mock: false, source: 'claude', stopReason: corpo.stop_reason });
  } catch (e: any) {
    return responder(res, 500, { error: e?.message || 'Erro interno.' });
  }
}
