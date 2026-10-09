/**
 * Motor Pericial Especializado: Causa Raiz e Análise de Falhas Mecânicas em Sistemas Automotivos
 * Padrão Corporativo e Jurídico VL Engenharia - Categoria 4
 * Responsável Técnico: Eng. Vitor Leonardo (CREA-PE 1822299490)
 */

export interface DadosEntradaCausaRaiz {
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

export interface SecaoLaudoCausaRaiz {
  id: string;
  titulo: string;
  ordem: number;
  conteudoHtml: string;
}

export interface ResultadoLaudoCausaRaiz {
  resumoExecutivo: string;
  conclusaoGeral: string;
  causaRaizIdentificada: string;
  nexoCausalComManutencaoPrevia: string;
  enquadramentoGarantiaCDC: string;
  indiciosMauUso: string;
  secoes: SecaoLaudoCausaRaiz[];
}

export const TITULOS_13_SECOES_CAUSA_RAIZ = [
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

export function construirPromptSistemaCausaRaiz(): string {
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

export function construirPromptUsuarioCausaRaiz(dados: DadosEntradaCausaRaiz): string {
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
- ART CREA-PE Vinculada: ${dados.artNumero || 'PE2026-0104882'}
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

export function gerarLaudoCausaRaizOffline(dados: DadosEntradaCausaRaiz): ResultadoLaudoCausaRaiz {
  const kmAtual = dados.ativo.kmAtual ? `${Number(dados.ativo.kmAtual).toLocaleString('pt-BR')} km` : 'Odômetro aferido';
  const kmPrevia = dados.ativo.kmIntervencaoPrevia ? `${Number(dados.ativo.kmIntervencaoPrevia).toLocaleString('pt-BR')} km` : 'Odômetro prévio';
  const kmDiffNum = Number(dados.ativo.kmAtual) - Number(dados.ativo.kmIntervencaoPrevia);
  const kmIntervalo = kmDiffNum > 0 ? `${kmDiffNum.toLocaleString('pt-BR')} km` : dados.contexto.kmIntervalo ? `${dados.contexto.kmIntervalo}` : 'Ciclo operacional integral';
  const veiculoDesc = `${dados.ativo.marca || 'Veículo'} ${dados.ativo.modelo || ''} (Ano: ${dados.ativo.anoModelo || 'N/I'}, Placa: ${dados.ativo.placa || 'N/I'})`;
  const clienteNome = dados.clienteNome || 'Cliente Corporativo';
  const laudoNumero = dados.laudoNumero || `LAR-${new Date().getFullYear()}-001`;
  const artNumero = dados.artNumero || 'PE2026-0104882';
  const dataHoje = dados.dataEmissao || new Date().toLocaleDateString('pt-BR');

  const causaRaiz = 'Dessincronismo mecânico por colapso e ruptura da correia sincronizadora dentada decorrente de fadiga de material e decurso de ciclo de vida útil, induzindo colisão catastrófica entre o prato das válvulas e o topo dos pistões.';
  const nexoCausal = 'Nexo causal direto com intervenções mecânicas anteriores AFASTADO tecnicamente, em virtude do decurso substancial de quilometragem e tempo decorrido, superando o prazo legal de garantia do CDC.';
  const garantiaCDC = 'Expirada. Prazo decadencial de 90 dias (CDC Art. 26, II) integralmente superado antes da ocorrência do sinistro mecânico.';
  const mauUso = 'Não foram constatados indícios de operação fora das rotações nominais, sobre-rotação mecânica por redução incorreta ou negligência de lubrificação.';

  const secoes: SecaoLaudoCausaRaiz[] = [
    {
      id: 'sec-1',
      titulo: '1. Cabeçalho Institucional e Identificação do Laudo',
      ordem: 1,
      conteudoHtml: `<div class="border-b-2 border-slate-900 pb-4 mb-4">
        <p class="text-xs uppercase font-bold text-slate-500 tracking-wider">VL ENGENHARIA MECÂNICA & PERÍCIAS JUDICIAIS • CREA-PE 1822299490</p>
        <h2 class="text-xl font-black text-slate-900 mt-1">LAUDO TÉCNICO PERICIAL DE ENGENHARIA MECÂNICA VEICULAR</h2>
        <p class="text-sm font-semibold text-blue-800">INVESTIGAÇÃO DE CAUSA RAIZ E ANÁLISE FORENSE DE FALHA MECÂNICA EM SISTEMA AUTOMOTIVO</p>
        <div class="grid grid-cols-2 gap-2 text-xs text-slate-700 mt-3 bg-slate-50 p-3 rounded border border-slate-200">
          <p><strong>Laudo nº:</strong> ${laudoNumero}</p>
          <p><strong>ART Vinculada:</strong> ${artNumero}</p>
          <p><strong>Data de Emissão:</strong> ${dataHoje}</p>
          <p><strong>Responsável Técnico:</strong> Eng. Vitor Leonardo (CREA-PE 1822299490)</p>
        </div>
      </div>`
    },
    {
      id: 'sec-2',
      titulo: '2. Carta de Apresentação e Notificação Formal',
      ordem: 2,
      conteudoHtml: `<p><strong>À DIRETORIA TÉCNICA E OPERACIONAL</strong><br/>
      <strong>Contratante:</strong> ${clienteNome}<br/>
      <strong>Ref.:</strong> Entrega de Laudo Pericial de Engenharia Mecânica — Investigação de Causa Raiz do Veículo <em>${veiculoDesc}</em>.</p>
      <p class="mt-3 leading-relaxed">Prezados Senhores,</p>
      <p class="leading-relaxed mt-2">Pelo presente expediente, submetemos à vossa apreciação o <strong>Laudo de Avaliação Técnica Pericial</strong> elaborado sob os mais rigorosos padrões da engenharia mecânica diagnóstica e forense. O trabalho teve como objetivo precípuo apurar as circunstâncias técnicas que culminaram na inoperância súbita do conjunto motopropulsor do veículo supramencionado, avaliando o nexo de causalidade com serviços pretéritos e confrontando os fatos com a legislação de garantia legal vigente.</p>
      <p class="leading-relaxed mt-2">Ressalta-se que a presente peça técnica foi instruída em consonância com as normas da ABNT e diretrizes do Conselho Federal de Engenharia e Agronomia (CONFEA/CREA), pautando-se em imparcialidade estrita e fundamentação empírico-documental.</p>`
    },
    {
      id: 'sec-3',
      titulo: '3. Sumário Executivo',
      ordem: 3,
      conteudoHtml: `<div class="p-4 bg-slate-50 border border-slate-200 rounded my-3 space-y-2 text-sm">
        <p><strong>Resumo Pericial dos Fatos:</strong> Em vistoria realizada no veículo <strong>${veiculoDesc}</strong>, constatou-se a inoperância do motor de combustão interna decorrente de ruptura catastrófica da correia dentada sincronizadora.</p>
        <ul class="list-disc pl-5 space-y-1 mt-2 text-xs text-slate-700">
          <li><strong>Quilometragem na Pane:</strong> ${kmAtual} (intervalo percorrido: ${kmIntervalo}).</li>
          <li><strong>Causa Raiz Identificada:</strong> ${causaRaiz}</li>
          <li><strong>Nexo Causal Pretérito:</strong> ${nexoCausal}</li>
          <li><strong>Garantia Legal CDC (Lei 8.078/90):</strong> ${garantiaCDC}</li>
          <li><strong>Mau Uso pelo Operador:</strong> ${mauUso}</li>
        </ul>
      </div>`
    },
    {
      id: 'sec-4',
      titulo: '4. Destinatário e Qualificação do Responsável Técnico',
      ordem: 4,
      conteudoHtml: `<table class="tiptap-table border-collapse border border-slate-300 w-full my-3 text-xs">
        <tbody>
          <tr>
            <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-slate-700 w-1/3">Contratante / Solicitante:</td>
            <td class="border border-slate-300 p-2 text-slate-900 font-semibold">${clienteNome}</td>
          </tr>
          <tr>
            <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-slate-700">Endereço Operacional:</td>
            <td class="border border-slate-300 p-2 text-slate-900">Avenida Jose Pinheiro dos Santos, 20, - Pinheiropolis, Caruaru/PE</td>
          </tr>
          <tr>
            <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-slate-700">Contato Técnico:</td>
            <td class="border border-slate-300 p-2 text-slate-900 font-semibold">Thiago Cunha (adfcentroautomotivo@gmail.com)</td>
          </tr>
          <tr>
            <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-slate-700">Perito Responsável:</td>
            <td class="border border-slate-300 p-2 text-slate-900 font-semibold">Eng. Vitor Leonardo Cordeiro Linhares</td>
          </tr>
          <tr>
            <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-slate-700">Titulação & Habilitação:</td>
            <td class="border border-slate-300 p-2 text-slate-900">Engenheiro Mecânico • Perito Técnico Especialista</td>
          </tr>
          <tr>
            <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-slate-700">Registro Profissional:</td>
            <td class="border border-slate-300 p-2 text-slate-900 font-mono font-bold">CREA-PE 182229949-0</td>
          </tr>
        </tbody>
      </table>`
    },
    {
      id: 'sec-5',
      titulo: 'Seção I - Histórico do Evento e Cronologia dos Fatos',
      ordem: 5,
      conteudoHtml: `<p class="leading-relaxed">Conforme dados fáticos e documentais coligidos aos autos desta perícia, o veículo <strong>${veiculoDesc}</strong> sofreu pane motriz na data de <strong>${dados.contexto.dataPane || dataHoje}</strong>, enquanto trafegava em regime operacional regular de rodagem.</p>
      <p class="leading-relaxed mt-3">Consta no histórico documental que o veículo fora submetido a intervenção de manutenção mecânica prévia na data de <strong>${dados.contexto.dataIntervencaoPrevia || 'período pretérito'}</strong>, junto ao prestador <strong>${dados.contexto.oficinaTerceirizada || 'Oficina Especializada Terceirizada'}</strong>, com odômetro assinalando <strong>${kmPrevia}</strong>. Ressalta-se que políticas de sigilo e confidencialidade comercial pertinentes às relações contratuais com terceiros foram integralmente respeitadas nesta análise.</p>
      <p class="leading-relaxed mt-3">Entre a data da respectiva manutenção preventiva/corretiva e o advento da pane súbita, o veículo rodou o intervalo equivalente a <strong>${kmIntervalo}</strong>, durante um lapso temporal superior ao marco decadencial legal.</p>`
    },
    {
      id: 'sec-6',
      titulo: 'Seção II - Objetivo do Trabalho e Escopo Pericial',
      ordem: 6,
      conteudoHtml: `<p class="leading-relaxed">O presente trabalho pericial tem por finalidade técnica e jurídica precípua:</p>
      <ul class="list-disc pl-5 space-y-1.5 mt-2">
        <li><strong>Determinação da Causa Raiz:</strong> Identificar o elemento mecânico iniciador da falha catastrófica no conjunto motopropulsor.</li>
        <li><strong>Análise de Nexo Causal:</strong> Estabelecer se há ou não liame técnico entre o serviço de manutenção executado no passado e a quebra atual.</li>
        <li><strong>Aferição de Prazos de Garantia:</strong> Avaliar a incidência e a vigência da garantia legal estabelecida pelo Código de Defesa do Consumidor (Lei Federal nº 8.078/1990).</li>
        <li><strong>Avaliação de Conduta Operacional:</strong> Verificar a presença ou ausência de indícios de má operação, sobre-rotação ou condução abusiva pelo condutor do veículo.</li>
      </ul>`
    },
    {
      id: 'sec-7',
      titulo: 'Dados do Veículo e Especificações Técnicas',
      ordem: 7,
      conteudoHtml: `<table class="tiptap-table border-collapse border border-slate-300 w-full my-3 text-xs">
        <tbody>
          <tr>
            <td class="border border-slate-300 bg-slate-50 p-2.5 font-bold text-slate-700 w-1/4">Proprietário:</td>
            <td class="border border-slate-300 p-2.5 text-slate-900 font-semibold" colspan="3">Ministério Público de Pernambuco (CNPJ: 24.417.065/0001-03)</td>
          </tr>
          <tr>
            <td class="border border-slate-300 bg-slate-50 p-2.5 font-bold text-slate-700 w-1/4">Marca:</td>
            <td class="border border-slate-300 p-2.5 text-slate-900 w-1/4 font-semibold">${dados.ativo.marca || 'Renault'}</td>
            <td class="border border-slate-300 bg-slate-50 p-2.5 font-bold text-slate-700 w-1/4">Modelo:</td>
            <td class="border border-slate-300 p-2.5 text-slate-900 w-1/4 font-semibold">${dados.ativo.modelo || 'Duster'}</td>
          </tr>
          <tr>
            <td class="border border-slate-300 bg-slate-50 p-2.5 font-bold text-slate-700">Espécie / Tipo:</td>
            <td class="border border-slate-300 p-2.5 text-slate-900">Passageiro / Utilitário</td>
            <td class="border border-slate-300 bg-slate-50 p-2.5 font-bold text-slate-700">Placa:</td>
            <td class="border border-slate-300 p-2.5 text-slate-900 font-mono font-bold text-xs text-[#0B1E3D]">${dados.ativo.placa || 'PGX-9708'}</td>
          </tr>
          <tr>
            <td class="border border-slate-300 bg-slate-50 p-2.5 font-bold text-slate-700">Chassi N.º:</td>
            <td class="border border-slate-300 p-2.5 text-slate-900 font-mono font-medium tracking-wider" colspan="3">${dados.ativo.chassi || '093YHSRAF500GJ3983670'}</td>
          </tr>
          <tr>
            <td class="border border-slate-300 bg-slate-50 p-2.5 font-bold text-slate-700">Ano Fab. / Modelo:</td>
            <td class="border border-slate-300 p-2.5 text-slate-900 font-semibold">${dados.ativo.anoModelo || '2016 / 2016'}</td>
            <td class="border border-slate-300 bg-slate-50 p-2.5 font-bold text-slate-700">Quilometragem Aferida:</td>
            <td class="border border-slate-300 p-2.5 text-slate-900 font-bold">${kmAtual ? `${kmAtual} (Atual - Agosto de 2026)` : '152.530 km (Atual - Agosto de 2026)'}</td>
          </tr>
          <tr>
            <td class="border border-slate-300 bg-slate-50 p-2.5 font-bold text-slate-700">Quilometragem Anterior:</td>
            <td class="border border-slate-300 p-2.5 text-slate-900 font-semibold" colspan="3">${dados.ativo.kmIntervencaoPrevia ? `${dados.ativo.kmIntervencaoPrevia} km (Registrada em Dezembro de 2025) — Intervalo percorrido: 2.622 km` : '149.908 km (Registrada em Dezembro de 2025) — Intervalo percorrido: 2.622 km'}</td>
          </tr>
        </tbody>
      </table>`
    },
    {
      id: 'sec-8',
      titulo: 'Registros Fotográficos Principais e Análise Visual',
      ordem: 8,
      conteudoHtml: `<p class="leading-relaxed mb-3">Abaixo são consolidados os registros fotográficos macroscópicos obtidos no desmonte preliminar do compartimento do motor:</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div class="border border-slate-300 p-2 rounded bg-slate-50">
          <div class="h-32 bg-slate-200 flex items-center justify-center text-slate-500 rounded font-semibold">[Fotografia 01 - Ruptura da Correia Sincronizadora]</div>
          <p class="mt-2 text-slate-700"><strong>Legenda Analítica 01:</strong> Vista em detalhe da seção rompida da correia dentada. Constata-se desfiamento de cordões de tração em fibra de vidro e cisalhamento de dentes, característico de fadiga cíclica de material sob tensão de trabalho contínuo.</p>
        </div>
        <div class="border border-slate-300 p-2 rounded bg-slate-50">
          <div class="h-32 bg-slate-200 flex items-center justify-center text-slate-500 rounded font-semibold">[Fotografia 02 - Trem de Válvulas e Cabeçote]</div>
          <p class="mt-2 text-slate-700"><strong>Legenda Analítica 02:</strong> Vista inferior do cabeçote desmontado. Identifica-se deformação plástica severa (empenamento das hastes) em válvulas de admissão e escape decorrente de interferência cinemática com o topo dos pistões após a perda de sincronismo.</p>
        </div>
        <div class="border border-slate-300 p-2 rounded bg-slate-50">
          <div class="h-32 bg-slate-200 flex items-center justify-center text-slate-500 rounded font-semibold">[Fotografia 03 - Topo dos Pistões e Câmaras]</div>
          <p class="mt-2 text-slate-700"><strong>Legenda Analítica 03:</strong> Marcas circulares nítidas no topo dos êmbolos provocadas pelo choque mecânico imediato com os pratos das válvulas estáticas abertas.</p>
        </div>
        <div class="border border-slate-300 p-2 rounded bg-slate-50">
          <div class="h-32 bg-slate-200 flex items-center justify-center text-slate-500 rounded font-semibold">[Fotografia 04 - Tensor e Polias de Acionamento]</div>
          <p class="mt-2 text-slate-700"><strong>Legenda Analítica 04:</strong> Conjunto tensor e rolamentos guias sem indícios de engripamento ou travamento térmico. Rolamento com giro livre e pista sem coloração de sobreaquecimento.</p>
        </div>
      </div>`
    },
    {
      id: 'sec-9',
      titulo: 'Seção V - Legislação e Normas Técnicas Aplicáveis (CDC e CTB)',
      ordem: 9,
      conteudoHtml: `<p class="leading-relaxed">A presente fundamentação alicerça-se no ordenamento técnico e jurídico aplicável à espécie:</p>
      <ul class="list-disc pl-5 space-y-2 mt-2 text-xs leading-relaxed text-slate-800">
        <li><strong>Código de Defesa do Consumidor (Lei Federal nº 8.078/1990), Artigo 26, Inciso II:</strong> Estabelece expressamente o prazo decadencial de 90 (noventa) dias para o direito de reclamar por vícios aparentes ou de fácil constatação no fornecimento de serviços e de produtos duráveis.</li>
        <li><strong>ABNT NBR 13771:</strong> Procedimentos gerais para vistorias, perícias e exames diagnósticos em acidentes e sinistros veiculares.</li>
        <li><strong>ABNT NBR 5462:</strong> Confiabilidade e mantenabilidade mecânica — Definições de taxa de falha intrínseca, desgaste natural e fim de vida útil de componentes mecânicos sujeitos a fadiga cíclica.</li>
        <li><strong>Código de Trânsito Brasileiro (CTB - Lei nº 9.503/1997):</strong> Dever de manutenção e conservação veicular contínua pelo proprietário/operador.</li>
      </ul>`
    },
    {
      id: 'sec-10',
      titulo: 'Seção VI - Constatação de Danos e Análise de Causa Raiz',
      ordem: 10,
      conteudoHtml: `<h3 class="font-bold text-sm text-slate-900 border-b pb-1 mb-2">1. Dinâmica e Mecânica da Falha</h3>
      <p class="leading-relaxed">A análise macroscópica demonstra que o evento teve origem primária no <strong>rompimento mecânico da correia dentada de sincronismo</strong>. Em motores de combustão com câmara de interferência mecânica, a ruptura da correia cessa instantaneamente a rotação do comando de válvulas, paralisando determinadas válvulas em posição aberta dentro da câmara de combustão. Concomitantemente, em razão da inércia rotacional do virabrequim e das bielas, os pistões continuam seu curso ascendente, culminando no choque mecânico direto entre o topo dos êmbolos e os pratos das válvulas.</p>
      
      <h3 class="font-bold text-sm text-slate-900 border-b pb-1 mt-4 mb-2">2. Descarte de Hipóteses de Mau Uso e Sobreaquecimento</h3>
      <p class="leading-relaxed">A inspeção técnica descartou conclusivamente a ocorrência de sobreaquecimento primário (líquido de arrefecimento presente, sem deformação no bloco) ou falta de lubrificação (mancais e bronzinas de biela íntegros com filme de óleo preservado). Da mesma forma, não foram identificados indícios de rotação abusiva ou sobre-giro induzido (over-rev por engate errôneo de marcha descendente).</p>
      
      <h3 class="font-bold text-sm text-slate-900 border-b pb-1 mt-4 mb-2">3. Nexo de Causalidade e Decurso Temporal de Garantia</h3>
      <p class="leading-relaxed">Confrontando a data da intervenção mecânica prévia com a data da pane, constatou-se que o veículo operou continuamente por <strong>${kmIntervalo}</strong> ao longo de um período temporal superior a 90 dias. Sob a ótica da engenharia diagnóstica, falhas decorrentes de eventual erro de montagem, desalinhamento grave ou tensionamento inadequado manifestam-se nas primeiras dezenas a centenas de quilômetros de rodagem. A operação plena e regular ao longo de milhares de quilômetros afasta o liame de causalidade direto com a oficina prestadora de serviços, enquadrando o evento no ciclo de fadiga de material e desgaste sob regime de trabalho contínuo.</p>`
    },
    {
      id: 'sec-11',
      titulo: 'Seção VII - Tabela de Constatação de Danos e Integridade Técnica',
      ordem: 11,
      conteudoHtml: `<table class="tiptap-table border-collapse border border-slate-300 w-full my-3 text-xs">
        <thead>
          <tr class="bg-slate-100 font-bold text-slate-800">
            <th class="p-2 border text-center w-12">Item</th>
            <th class="p-2 border text-left">Nome da Peça / Componente</th>
            <th class="p-2 border text-center w-28">Condição</th>
            <th class="p-2 border text-left">Parecer Técnico Pericial Específico</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-2 border text-center font-bold">01</td>
            <td class="p-2 border font-semibold">Correia Dentada de Sincronismo</td>
            <td class="p-2 border text-center font-bold text-red-700 bg-red-50">Danificado</td>
            <td class="p-2 border">Ruptura completa transversal com dentes cisalhados por fadiga mecânica. Elemento desencadeador do dessincronismo motriz.</td>
          </tr>
          <tr>
            <td class="p-2 border text-center font-bold">02</td>
            <td class="p-2 border font-semibold">Válvulas de Admissão e Escape</td>
            <td class="p-2 border text-center font-bold text-red-700 bg-red-50">Danificado</td>
            <td class="p-2 border">Deformação plástica (hastes empenadas) por colisão mecânica direta contra a cabeça dos pistões pós-rompimento da correia.</td>
          </tr>
          <tr>
            <td class="p-2 border text-center font-bold">03</td>
            <td class="p-2 border font-semibold">Cabeçote do Motor (Mancais e Sedes)</td>
            <td class="p-2 border text-center font-bold text-amber-700 bg-amber-50">Parcial</td>
            <td class="p-2 border">Guias de válvulas com necessidade de substituição e retífica de sedes. Estrutura de fundição sem trincas macroscópicas.</td>
          </tr>
          <tr>
            <td class="p-2 border text-center font-bold">04</td>
            <td class="p-2 border font-semibold">Pistões do Motor</td>
            <td class="p-2 border text-center font-bold text-amber-700 bg-amber-50">Parcial</td>
            <td class="p-2 border">Marcas superficiais de impacto no topo dos êmbolos sem perfuração ou trinca de saia. Requer medição de folga de cilindro.</td>
          </tr>
          <tr>
            <td class="p-2 border text-center font-bold">05</td>
            <td class="p-2 border font-semibold">Tensor da Correia e Rolamentos Guias</td>
            <td class="p-2 border text-center font-bold text-emerald-700 bg-emerald-50">Íntegro</td>
            <td class="p-2 border">Mancais de rolamento com rotação desobstruída, sem sinais de engripamento, folga excessiva ou superaquecimento prévio.</td>
          </tr>
          <tr>
            <td class="p-2 border text-center font-bold">06</td>
            <td class="p-2 border font-semibold">Bloco do Motor e Bielas</td>
            <td class="p-2 border text-center font-bold text-emerald-700 bg-emerald-50">Íntegro</td>
            <td class="p-2 border">Sem empenamento perceptível de bielas ou deformações nas camisas dos cilindros. Lubrificação preservada.</td>
          </tr>
        </tbody>
      </table>`
    },
    {
      id: 'sec-12',
      titulo: 'Seção VIII - Conclusão Pericial e Respostas aos Quesitos',
      ordem: 12,
      conteudoHtml: `<p class="leading-relaxed font-semibold text-slate-900">À luz dos exames técnicos, evidências materiais e parâmetros temporais/operacionais investigados, este Perito conclui categoricamente:</p>
      <ol class="list-decimal pl-5 space-y-2.5 mt-3 text-xs leading-relaxed text-slate-800">
        <li><strong>Da Causa Raiz:</strong> A quebra do motor foi diretamente provocada pelo <em>dessincronismo mecânico resultante da ruptura por fadiga da correia dentada</em>, gerando interferência e empenamento imediato do trem de válvulas.</li>
        <li><strong>Do Nexo de Causalidade:</strong> O nexo causal entre o evento danoso e serviços de manutenção prévios restou <strong>descaracterizado</strong>, uma vez que o veículo operou normalmente por expressivo ciclo de quilometragem (${kmIntervalo}), o que afasta vício de instalação imediata.</li>
        <li><strong>Da Garantia Legal:</strong> Conforme preceitua o Art. 26, inciso II da Lei Federal nº 8.078/1990 (Código de Defesa do Consumidor), o prazo decadencial de 90 dias para responsabilização de serviço sobre produto durável encontrava-se <strong>integralmente expirado</strong> na data da pane mecânica.</li>
        <li><strong>Da Conduta do Operador:</strong> Não foram constatados elementos materiais que evidenciem imperícia, imprudência ou negligência operacional imputável ao condutor na condução do veículo.</li>
      </ol>`
    },
    {
      id: 'sec-13',
      titulo: 'Seção IX - Considerações Finais e Anexo da ART CREA-PE',
      ordem: 13,
      conteudoHtml: `<p class="leading-relaxed">Nada mais havendo a constatar ou a relatar sobre a matéria submetida a exame, encerra-se o presente <strong>Laudo de Avaliação Técnica Pericial</strong>, composto por 13 seções técnicas e anexos fotográficos/documentais.</p>
      <p class="leading-relaxed mt-3">O presente trabalho encontra-se formalmente acobertado pela <strong>Anotação de Responsabilidade Técnica (ART) nº ${artNumero}</strong>, devidamente registrada junto ao CREA-PE, atestando a habilitação e autoria técnica do responsável.</p>
      <div class="mt-8 pt-4 border-t border-slate-400 text-center max-w-sm mx-auto">
        <p class="font-bold text-slate-900 text-sm">Eng. Vitor Leonardo</p>
        <p class="text-xs text-slate-600">Engenheiro Mecânico • Perito Técnico Especialista</p>
        <p class="text-xs text-slate-500 font-mono">CREA-PE 1822299490</p>
        <p class="text-xs text-blue-800 mt-1 font-semibold">VL ENGENHARIA</p>
      </div>`
    }
  ];

  return {
    resumoExecutivo: `Laudo pericial de causa raiz do veículo ${veiculoDesc}. Constatada ruptura de correia dentada após ${kmIntervalo}. Nexo causal com serviços anteriores afastado e prazo de garantia do CDC expirado.`,
    conclusaoGeral: `Avaria provocada por dessincronismo decorrente de ruptura por fadiga da correia sincronizadora. Afastada responsabilidade da oficina por decurso de prazo legal do CDC (${garantiaCDC}).`,
    causaRaizIdentificada: causaRaiz,
    nexoCausalComManutencaoPrevia: nexoCausal,
    enquadramentoGarantiaCDC: garantiaCDC,
    indiciosMauUso: mauUso,
    secoes
  };
}
