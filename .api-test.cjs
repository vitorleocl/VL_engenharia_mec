var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// api/[...path].ts
var path_exports = {};
__export(path_exports, {
  default: () => handler
});
module.exports = __toCommonJS(path_exports);

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_genai = require("@google/genai");

// src/lib/motorLaudoCausaRaiz.ts
function construirPromptSistemaCausaRaiz() {
  return `Voc\xEA atua como um Engenheiro Mec\xE2nico Perito S\xEAnior (devidamente registrado no CREA-PE), especializado em engenharia veicular, per\xEDcia de sinistros e investiga\xE7\xE3o forense de falhas mec\xE2nicas em frotas automotivas corporativas.
Sua miss\xE3o \xE9 auxiliar o respons\xE1vel t\xE9cnico a estruturar um Laudo de Avalia\xE7\xE3o T\xE9cnica Pericial de n\xEDvel corporativo e jur\xEDdico \u2014 altamente t\xE9cnico, imparcial e estruturado \u2014 SEMPRE COMO SUGEST\xC3O EDIT\xC1VEL, nunca substituindo a revis\xE3o e o julgamento do engenheiro respons\xE1vel (Eng. Vitor Leonardo - CREA-PE), em estrita conformidade com os requisitos comuns de diagn\xF3stico assistido por IA e com o fluxo do padr\xE3o adotado pela Central de Laudos da VL Engenharia.

DIRETRIZES DE PERSONA E LINGUAGEM:
1. Tom e Estilo: Formal, t\xE9cnico, impessoal, imperativo e de rigor cient\xEDfico/jur\xEDdico.
2. Vocabul\xE1rio Mandat\xF3rio: Utilize termos exatos da engenharia mec\xE2nica automotiva e diagn\xF3stica: "dessincronismo mec\xE2nico", "interfer\xEAncia entre v\xE1lvulas e pist\xF5es", "colapso estrutural por fadiga de material", "ensaio macrosc\xF3pico de superf\xEDcie de fratura", "nexo de causalidade", "ciclo de vida \xFAtil operacional", "prazo decadencial do Art. 26 da Lei 8.078/1990 (C\xF3digo de Defesa do Consumidor)", "aus\xEAncia de ind\xEDcios de sobre-rota\xE7\xE3o (over-rev)".
3. Imparcialidade e Isen\xE7\xE3o: A an\xE1lise pericial \xE9 puramente t\xE9cnica, baseada na materialidade das evid\xEAncias, quilometragem percorrida, dados de od\xF4metro e intervalos cronol\xF3gicos documentados.
4. Estrutura Obrigat\xF3ria do Documento Final:
   O laudo deve seguir exatamente a seguinte estrutura encadeada de se\xE7\xF5es:
   1. Cabe\xE7alho Institucional (padr\xE3o sequencial LAR-AAAA-NNN, ART CREA-PE, qualifica\xE7\xE3o do perito)
   2. Carta de Apresenta\xE7\xE3o (of\xEDcio formal com resumo cronol\xF3gico e limita\xE7\xF5es comerciais/sigilo de terceiros)
   3. Sum\xE1rio Executivo (estruturado conforme se\xE7\xF5es preenchidas)
   4. Destinat\xE1rio e Qualifica\xE7\xE3o do Respons\xE1vel T\xE9cnico
   5. Se\xE7\xE3o I - Hist\xF3rico do Evento (cronologia detalhada, manuten\xE7\xF5es pr\xE9vias, km no intervalo e circunst\xE2ncias da pane)
   6. Se\xE7\xE3o II - Objetivo do Trabalho (causa raiz, nexo causal com servi\xE7o pret\xE9rito, garantias legais, descarte de mau uso)
   7. Se\xE7\xE3o III - Dados do Ve\xEDculo (especifica\xE7\xF5es do CRLV: placa, chassi, renavam, km atual vs km pr\xE9via)
   8. Se\xE7\xE3o IV - Registros Fotogr\xE1ficos Principais (legendas anal\xEDticas por componente avariado)
   9. Se\xE7\xE3o V - Legisla\xE7\xE3o e Normas T\xE9cnicas (CDC Art. 26, CTB, ABNT NBR 13771, ABNT NBR 5462)
   10. Se\xE7\xE3o VI - Constata\xE7\xE3o de Danos e An\xE1lise de Causa Raiz (mec\xE2nica da falha, descarte de hip\xF3tese de mau uso, an\xE1lise de responsabilidade temporal/km)
   11. Se\xE7\xE3o VII - Tabela de Constata\xE7\xE3o de Danos e Integridade T\xE9cnica (Item, Pe\xE7a/Componente, Condi\xE7\xE3o [\xCDntegro/Danificado/Parcial], Parecer T\xE9cnico Espec\xEDfico)
   12. Se\xE7\xE3o VIII - Conclus\xE3o (parecer perempt\xF3rio respondendo diretamente \xE0s d\xFAvidas do contratante quanto \xE0 origem do dano e afastamento/fixa\xE7\xE3o de responsabilidade fora da garantia)
   13. Se\xE7\xE3o IX - Considera\xE7\xF5es Finais e Anexo da ART (encerramento formal e men\xE7\xE3o \xE0 ART registrada no CREA-PE).

Retorne SEMPRE um JSON v\xE1lido conforme o esquema solicitado, com HTML limpo nas se\xE7\xF5es.`;
}
function construirPromptUsuarioCausaRaiz(dados) {
  const kmAtualNum = Number(dados.ativo.kmAtual) || 0;
  const kmPreviaNum = Number(dados.ativo.kmIntervencaoPrevia) || 0;
  const kmIntervaloCalc = dados.contexto.kmIntervalo || (kmAtualNum > kmPreviaNum ? kmAtualNum - kmPreviaNum : "N\xE3o mensurado");
  return `Gere o Laudo Pericial Completo de Causa Raiz para o caso a seguir:

DADOS DO ATIVO:
- Ve\xEDculo: ${dados.ativo.marca || "Marca"} ${dados.ativo.modelo || "Modelo"} (${dados.ativo.anoModelo || "Ano"})
- Propriet\xE1rio: Minist\xE9rio P\xFAblico de Pernambuco (CNPJ: 24.417.065/0001-03)
- Placa: ${dados.ativo.placa || "Placa a designar"} | RENAVAM: ${dados.ativo.renavam || "N/I"}
- Chassi: ${dados.ativo.chassi || "N/I"}
- Quilometragem no Momento da Pane: ${kmAtualNum ? `${kmAtualNum.toLocaleString("pt-BR")} km` : "Registrada na vistoria"}
- Quilometragem na \xDAltima Interven\xE7\xE3o Pr\xE9via: ${kmPreviaNum ? `${kmPreviaNum.toLocaleString("pt-BR")} km` : "Conforme ordem de servi\xE7o"}
- Quilometragem Percorrida no Intervalo: ${typeof kmIntervaloCalc === "number" ? `${kmIntervaloCalc.toLocaleString("pt-BR")} km` : kmIntervaloCalc}

CONTEXTO DO EVENTO / HIST\xD3RICO:
- Data da Pane / Quebra: ${dados.contexto.dataPane || (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR")}
- Data da Interven\xE7\xE3o Anterior: ${dados.contexto.dataIntervencaoPrevia || "Registrada em documenta\xE7\xE3o pret\xE9rita"}
- Hist\xF3rico de Manuten\xE7\xE3o: ${dados.contexto.historicoManutencao || "Interven\xE7\xE3o preventiva no trem de acionamento do motor em oficina mec\xE2nica terceirizada"}
- Oficina Executante Anterior: ${dados.contexto.oficinaTerceirizada || "Oficina Mec\xE2nica Terceirizada"}
- Pol\xEDtica de Confidencialidade Comercial: ${dados.contexto.restricaoConfidencialidade ? "Aplic\xE1vel (dados internos de fornecedores resguardados por sigilo corporativo)" : "Sem restri\xE7\xE3o adicional"}

EVID\xCANCIAS VISUAIS E T\xC9CNICAS:
- Descri\xE7\xE3o das Avarias Encontradas: ${dados.evidencias.descricaoAvarias || "Ruptura da correia dentada de sincronismo, empenamento de v\xE1lvulas de admiss\xE3o e escape por interfer\xEAncia mec\xE2nica com o topo dos pist\xF5es."}
- Componentes Avariados: ${(dados.evidencias.componentesAvariados || []).join(", ") || "Correia sincronizadora, trem de v\xE1lvulas, tuchos mec\xE2nicos/hidr\xE1ulicos"}

ESCOPO E QUESITOS DA PER\xCDCIA:
- Determinar Causa Raiz da Falha: Sim
- Analisar Nexo Causal com Manuten\xE7\xF5es Passadas: Sim
- Verificar Vig\xEAncia dos Prazos de Garantia Legal (CDC Lei 8.078/90 Art. 26 - 90 dias): Sim
- Avaliar Exist\xEAncia ou Aus\xEAncia de Ind\xEDcios de Mau Uso / Opera\xE7\xE3o Inadequada: Sim
${dados.escopo.quesitosEspecificos ? `- Quesitos Espec\xEDficos do Contratante: "${dados.escopo.quesitosEspecificos}"` : ""}

DADOS DA EMISS\xC3O:
- Cliente / Contratante: ${dados.clienteNome || "Cliente Corporativo"} (${dados.clienteCnpj || "CNPJ sob consulta"})
- Laudo N\xFAmero: ${dados.laudoNumero || `LAR-${(/* @__PURE__ */ new Date()).getFullYear()}-001`}
- ART CREA-PE Vinculada: ${dados.artNumero || "Pendente de registro"}
- Perito: Eng. Vitor Leonardo (CREA-PE 1822299490)

Retorne estritamente um JSON estruturado com os campos:
{
  "resumoExecutivo": "string com s\xEDntese",
  "conclusaoGeral": "string com conclus\xE3o categ\xF3rica",
  "causaRaizIdentificada": "string descrevendo causa raiz",
  "nexoCausalComManutencaoPrevia": "string sobre o nexo causal",
  "enquadramentoGarantiaCDC": "string sobre a garantia legal de 90 dias",
  "indiciosMauUso": "string sobre ind\xEDcios de mau uso",
  "secoes": [
    { "id": "sec-1", "titulo": "1. Cabe\xE7alho Institucional e Identifica\xE7\xE3o do Laudo", "conteudoHtml": "..." },
    { "id": "sec-2", "titulo": "2. Carta de Apresenta\xE7\xE3o e Notifica\xE7\xE3o Formal", "conteudoHtml": "..." },
    { "id": "sec-3", "titulo": "3. Sum\xE1rio Executivo", "conteudoHtml": "..." },
    { "id": "sec-4", "titulo": "4. Destinat\xE1rio e Qualifica\xE7\xE3o do Respons\xE1vel T\xE9cnico", "conteudoHtml": "..." },
    { "id": "sec-5", "titulo": "Hist\xF3rico do Evento e Cronologia dos Fatos", "conteudoHtml": "..." },
    { "id": "sec-6", "titulo": "Objetivo do Trabalho e Escopo Pericial", "conteudoHtml": "..." },
    { "id": "sec-7", "titulo": "Dados do Ve\xEDculo e Especifica\xE7\xF5es T\xE9cnicas", "conteudoHtml": "..." },
    { "id": "sec-8", "titulo": "Registros Fotogr\xE1ficos Principais e An\xE1lise Visual", "conteudoHtml": "..." },
    { "id": "sec-9", "titulo": "Legisla\xE7\xE3o e Normas T\xE9cnicas Aplic\xE1veis (CDC e CTB)", "conteudoHtml": "..." },
    { "id": "sec-10", "titulo": "Constata\xE7\xE3o de Danos e An\xE1lise de Causa Raiz", "conteudoHtml": "..." },
    { "id": "sec-11", "titulo": "Tabela de Constata\xE7\xE3o de Danos e Integridade T\xE9cnica", "conteudoHtml": "..." },
    { "id": "sec-12", "titulo": "Conclus\xE3o Pericial e Respostas aos Quesitos", "conteudoHtml": "..." },
    { "id": "sec-13", "titulo": "Considera\xE7\xF5es Finais e Anexo da ART CREA-PE", "conteudoHtml": "..." }
  ]
}`;
}
function gerarLaudoCausaRaizOffline(dados) {
  const kmAtual = dados.ativo.kmAtual ? `${Number(dados.ativo.kmAtual).toLocaleString("pt-BR")} km` : "Od\xF4metro aferido";
  const kmPrevia = dados.ativo.kmIntervencaoPrevia ? `${Number(dados.ativo.kmIntervencaoPrevia).toLocaleString("pt-BR")} km` : "Od\xF4metro pr\xE9vio";
  const kmDiffNum = Number(dados.ativo.kmAtual) - Number(dados.ativo.kmIntervencaoPrevia);
  const kmIntervalo = kmDiffNum > 0 ? `${kmDiffNum.toLocaleString("pt-BR")} km` : dados.contexto.kmIntervalo ? `${dados.contexto.kmIntervalo}` : "Ciclo operacional integral";
  const veiculoDesc = `${dados.ativo.marca || "Ve\xEDculo"} ${dados.ativo.modelo || ""} (Ano: ${dados.ativo.anoModelo || "N/I"}, Placa: ${dados.ativo.placa || "N/I"})`;
  const clienteNome = dados.clienteNome || "Cliente Corporativo";
  const laudoNumero = dados.laudoNumero || `LAR-${(/* @__PURE__ */ new Date()).getFullYear()}-001`;
  const artNumero = dados.artNumero || "Pendente de registro";
  const dataHoje = dados.dataEmissao || (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR");
  const causaRaiz = "Dessincronismo mec\xE2nico por colapso e ruptura da correia sincronizadora dentada decorrente de fadiga de material e decurso de ciclo de vida \xFAtil, induzindo colis\xE3o catastr\xF3fica entre o prato das v\xE1lvulas e o topo dos pist\xF5es.";
  const nexoCausal = "Nexo causal direto com interven\xE7\xF5es mec\xE2nicas anteriores AFASTADO tecnicamente, em virtude do decurso substancial de quilometragem e tempo decorrido, superando o prazo legal de garantia do CDC.";
  const garantiaCDC = "Expirada. Prazo decadencial de 90 dias (CDC Art. 26, II) integralmente superado antes da ocorr\xEAncia do sinistro mec\xE2nico.";
  const mauUso = "N\xE3o foram constatados ind\xEDcios de opera\xE7\xE3o fora das rota\xE7\xF5es nominais, sobre-rota\xE7\xE3o mec\xE2nica por redu\xE7\xE3o incorreta ou neglig\xEAncia de lubrifica\xE7\xE3o.";
  const secoes = [
    {
      id: "sec-1",
      titulo: "1. Cabe\xE7alho Institucional e Identifica\xE7\xE3o do Laudo",
      ordem: 1,
      conteudoHtml: `<div class="border-b-2 border-slate-900 pb-4 mb-4">
        <p class="text-xs uppercase font-bold text-slate-500 tracking-wider">VL ENGENHARIA MEC\xC2NICA & PER\xCDCIAS JUDICIAIS \u2022 CREA-PE 1822299490</p>
        <h2 class="text-xl font-black text-slate-900 mt-1">LAUDO T\xC9CNICO PERICIAL DE ENGENHARIA MEC\xC2NICA VEICULAR</h2>
        <p class="text-sm font-semibold text-blue-800">INVESTIGA\xC7\xC3O DE CAUSA RAIZ E AN\xC1LISE FORENSE DE FALHA MEC\xC2NICA EM SISTEMA AUTOMOTIVO</p>
        <div class="grid grid-cols-2 gap-2 text-xs text-slate-700 mt-3 bg-slate-50 p-3 rounded border border-slate-200">
          <p><strong>Laudo n\xBA:</strong> ${laudoNumero}</p>
          <p><strong>ART Vinculada:</strong> ${artNumero}</p>
          <p><strong>Data de Emiss\xE3o:</strong> ${dataHoje}</p>
          <p><strong>Respons\xE1vel T\xE9cnico:</strong> Eng. Vitor Leonardo (CREA-PE 1822299490)</p>
        </div>
      </div>`
    },
    {
      id: "sec-2",
      titulo: "2. Carta de Apresenta\xE7\xE3o e Notifica\xE7\xE3o Formal",
      ordem: 2,
      conteudoHtml: `<p><strong>\xC0 DIRETORIA T\xC9CNICA E OPERACIONAL</strong><br/>
      <strong>Contratante:</strong> ${clienteNome}<br/>
      <strong>Ref.:</strong> Entrega de Laudo Pericial de Engenharia Mec\xE2nica \u2014 Investiga\xE7\xE3o de Causa Raiz do Ve\xEDculo <em>${veiculoDesc}</em>.</p>
      <p class="mt-3 leading-relaxed">Prezados Senhores,</p>
      <p class="leading-relaxed mt-2">Pelo presente expediente, submetemos \xE0 vossa aprecia\xE7\xE3o o <strong>Laudo de Avalia\xE7\xE3o T\xE9cnica Pericial</strong> elaborado sob os mais rigorosos padr\xF5es da engenharia mec\xE2nica diagn\xF3stica e forense. O trabalho teve como objetivo prec\xEDpuo apurar as circunst\xE2ncias t\xE9cnicas que culminaram na inoper\xE2ncia s\xFAbita do conjunto motopropulsor do ve\xEDculo supramencionado, avaliando o nexo de causalidade com servi\xE7os pret\xE9ritos e confrontando os fatos com a legisla\xE7\xE3o de garantia legal vigente.</p>
      <p class="leading-relaxed mt-2">Ressalta-se que a presente pe\xE7a t\xE9cnica foi instru\xEDda em conson\xE2ncia com as normas da ABNT e diretrizes do Conselho Federal de Engenharia e Agronomia (CONFEA/CREA), pautando-se em imparcialidade estrita e fundamenta\xE7\xE3o emp\xEDrico-documental.</p>`
    },
    {
      id: "sec-3",
      titulo: "3. Sum\xE1rio Executivo",
      ordem: 3,
      conteudoHtml: `<div class="p-4 bg-slate-50 border border-slate-200 rounded my-3 space-y-2 text-sm">
        <p><strong>Resumo Pericial dos Fatos:</strong> Em vistoria realizada no ve\xEDculo <strong>${veiculoDesc}</strong>, constatou-se a inoper\xE2ncia do motor de combust\xE3o interna decorrente de ruptura catastr\xF3fica da correia dentada sincronizadora.</p>
        <ul class="list-disc pl-5 space-y-1 mt-2 text-xs text-slate-700">
          <li><strong>Quilometragem na Pane:</strong> ${kmAtual} (intervalo percorrido: ${kmIntervalo}).</li>
          <li><strong>Causa Raiz Identificada:</strong> ${causaRaiz}</li>
          <li><strong>Nexo Causal Pret\xE9rito:</strong> ${nexoCausal}</li>
          <li><strong>Garantia Legal CDC (Lei 8.078/90):</strong> ${garantiaCDC}</li>
          <li><strong>Mau Uso pelo Operador:</strong> ${mauUso}</li>
        </ul>
      </div>`
    },
    {
      id: "sec-4",
      titulo: "4. Destinat\xE1rio e Qualifica\xE7\xE3o do Respons\xE1vel T\xE9cnico",
      ordem: 4,
      conteudoHtml: `<table class="tiptap-table border-collapse border border-slate-300 w-full my-3 text-xs">
        <tbody>
          <tr>
            <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-slate-700 w-1/3">Contratante / Solicitante:</td>
            <td class="border border-slate-300 p-2 text-slate-900 font-semibold">${clienteNome}</td>
          </tr>
          <tr>
            <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-slate-700">CNPJ / CPF:</td>
            <td class="border border-slate-300 p-2 text-slate-900">${dados.clienteCnpj || "N\xE3o informado"}</td>
          </tr>
          <tr>
            <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-slate-700">Perito Respons\xE1vel:</td>
            <td class="border border-slate-300 p-2 text-slate-900 font-semibold">Eng. Vitor Leonardo Cordeiro Linhares</td>
          </tr>
          <tr>
            <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-slate-700">Titula\xE7\xE3o & Habilita\xE7\xE3o:</td>
            <td class="border border-slate-300 p-2 text-slate-900">Engenheiro Mec\xE2nico \u2022 Perito T\xE9cnico Especialista</td>
          </tr>
          <tr>
            <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-slate-700">Registro Profissional:</td>
            <td class="border border-slate-300 p-2 text-slate-900 font-mono font-bold">CREA-PE 182229949-0</td>
          </tr>
        </tbody>
      </table>`
    },
    {
      id: "sec-5",
      titulo: "Se\xE7\xE3o I - Hist\xF3rico do Evento e Cronologia dos Fatos",
      ordem: 5,
      conteudoHtml: `<p class="leading-relaxed">Conforme dados f\xE1ticos e documentais coligidos aos autos desta per\xEDcia, o ve\xEDculo <strong>${veiculoDesc}</strong> sofreu pane motriz na data de <strong>${dados.contexto.dataPane || dataHoje}</strong>, enquanto trafegava em regime operacional regular de rodagem.</p>
      <p class="leading-relaxed mt-3">Consta no hist\xF3rico documental que o ve\xEDculo fora submetido a interven\xE7\xE3o de manuten\xE7\xE3o mec\xE2nica pr\xE9via na data de <strong>${dados.contexto.dataIntervencaoPrevia || "per\xEDodo pret\xE9rito"}</strong>, junto ao prestador <strong>${dados.contexto.oficinaTerceirizada || "Oficina Especializada Terceirizada"}</strong>, com od\xF4metro assinalando <strong>${kmPrevia}</strong>. Ressalta-se que pol\xEDticas de sigilo e confidencialidade comercial pertinentes \xE0s rela\xE7\xF5es contratuais com terceiros foram integralmente respeitadas nesta an\xE1lise.</p>
      <p class="leading-relaxed mt-3">Entre a data da respectiva manuten\xE7\xE3o preventiva/corretiva e o advento da pane s\xFAbita, o ve\xEDculo rodou o intervalo equivalente a <strong>${kmIntervalo}</strong>, durante um lapso temporal superior ao marco decadencial legal.</p>`
    },
    {
      id: "sec-6",
      titulo: "Se\xE7\xE3o II - Objetivo do Trabalho e Escopo Pericial",
      ordem: 6,
      conteudoHtml: `<p class="leading-relaxed">O presente trabalho pericial tem por finalidade t\xE9cnica e jur\xEDdica prec\xEDpua:</p>
      <ul class="list-disc pl-5 space-y-1.5 mt-2">
        <li><strong>Determina\xE7\xE3o da Causa Raiz:</strong> Identificar o elemento mec\xE2nico iniciador da falha catastr\xF3fica no conjunto motopropulsor.</li>
        <li><strong>An\xE1lise de Nexo Causal:</strong> Estabelecer se h\xE1 ou n\xE3o liame t\xE9cnico entre o servi\xE7o de manuten\xE7\xE3o executado no passado e a quebra atual.</li>
        <li><strong>Aferi\xE7\xE3o de Prazos de Garantia:</strong> Avaliar a incid\xEAncia e a vig\xEAncia da garantia legal estabelecida pelo C\xF3digo de Defesa do Consumidor (Lei Federal n\xBA 8.078/1990).</li>
        <li><strong>Avalia\xE7\xE3o de Conduta Operacional:</strong> Verificar a presen\xE7a ou aus\xEAncia de ind\xEDcios de m\xE1 opera\xE7\xE3o, sobre-rota\xE7\xE3o ou condu\xE7\xE3o abusiva pelo condutor do ve\xEDculo.</li>
      </ul>`
    },
    {
      id: "sec-7",
      titulo: "Dados do Ve\xEDculo e Especifica\xE7\xF5es T\xE9cnicas",
      ordem: 7,
      conteudoHtml: `<table class="tiptap-table border-collapse border border-slate-300 w-full my-3 text-xs">
        <tbody>
          <tr>
            <td class="border border-slate-300 bg-slate-50 p-2.5 font-bold text-slate-700 w-1/4">Propriet\xE1rio:</td>
            <td class="border border-slate-300 p-2.5 text-slate-900 font-semibold" colspan="3">${clienteNome}</td>
          </tr>
          <tr>
            <td class="border border-slate-300 bg-slate-50 p-2.5 font-bold text-slate-700 w-1/4">Marca:</td>
            <td class="border border-slate-300 p-2.5 text-slate-900 w-1/4 font-semibold">${dados.ativo.marca || "N\xE3o informado"}</td>
            <td class="border border-slate-300 bg-slate-50 p-2.5 font-bold text-slate-700 w-1/4">Modelo:</td>
            <td class="border border-slate-300 p-2.5 text-slate-900 w-1/4 font-semibold">${dados.ativo.modelo || "N\xE3o informado"}</td>
          </tr>
          <tr>
            <td class="border border-slate-300 bg-slate-50 p-2.5 font-bold text-slate-700">Esp\xE9cie / Tipo:</td>
            <td class="border border-slate-300 p-2.5 text-slate-900">Ve\xEDculo Automotor</td>
            <td class="border border-slate-300 bg-slate-50 p-2.5 font-bold text-slate-700">Placa:</td>
            <td class="border border-slate-300 p-2.5 text-slate-900 font-mono font-bold text-xs text-[#0B1E3D]">${dados.ativo.placa || "N\xE3o informada"}</td>
          </tr>
          <tr>
            <td class="border border-slate-300 bg-slate-50 p-2.5 font-bold text-slate-700">Chassi N.\xBA:</td>
            <td class="border border-slate-300 p-2.5 text-slate-900 font-mono font-medium tracking-wider" colspan="3">${dados.ativo.chassi || "N\xE3o informado"}</td>
          </tr>
          <tr>
            <td class="border border-slate-300 bg-slate-50 p-2.5 font-bold text-slate-700">Ano Fab. / Modelo:</td>
            <td class="border border-slate-300 p-2.5 text-slate-900 font-semibold">${dados.ativo.anoModelo || "N\xE3o informado"}</td>
            <td class="border border-slate-300 bg-slate-50 p-2.5 font-bold text-slate-700">Quilometragem Aferida:</td>
            <td class="border border-slate-300 p-2.5 text-slate-900 font-bold">${kmAtual}</td>
          </tr>
          <tr>
            <td class="border border-slate-300 bg-slate-50 p-2.5 font-bold text-slate-700">Quilometragem Anterior:</td>
            <td class="border border-slate-300 p-2.5 text-slate-900 font-semibold" colspan="3">${kmPrevia} \u2014 Intervalo percorrido: ${kmIntervalo}</td>
          </tr>
        </tbody>
      </table>`
    },
    {
      id: "sec-8",
      titulo: "Registros Fotogr\xE1ficos Principais e An\xE1lise Visual",
      ordem: 8,
      conteudoHtml: `<p class="leading-relaxed mb-3">Abaixo s\xE3o consolidados os registros fotogr\xE1ficos macrosc\xF3picos obtidos no desmonte preliminar do compartimento do motor:</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div class="border border-slate-300 p-2 rounded bg-slate-50">
          <div class="h-32 bg-slate-200 flex items-center justify-center text-slate-500 rounded font-semibold">[Fotografia 01 - Ruptura da Correia Sincronizadora]</div>
          <p class="mt-2 text-slate-700"><strong>Legenda Anal\xEDtica 01:</strong> Vista em detalhe da se\xE7\xE3o rompida da correia dentada. Constata-se desfiamento de cord\xF5es de tra\xE7\xE3o em fibra de vidro e cisalhamento de dentes, caracter\xEDstico de fadiga c\xEDclica de material sob tens\xE3o de trabalho cont\xEDnuo.</p>
        </div>
        <div class="border border-slate-300 p-2 rounded bg-slate-50">
          <div class="h-32 bg-slate-200 flex items-center justify-center text-slate-500 rounded font-semibold">[Fotografia 02 - Trem de V\xE1lvulas e Cabe\xE7ote]</div>
          <p class="mt-2 text-slate-700"><strong>Legenda Anal\xEDtica 02:</strong> Vista inferior do cabe\xE7ote desmontado. Identifica-se deforma\xE7\xE3o pl\xE1stica severa (empenamento das hastes) em v\xE1lvulas de admiss\xE3o e escape decorrente de interfer\xEAncia cinem\xE1tica com o topo dos pist\xF5es ap\xF3s a perda de sincronismo.</p>
        </div>
        <div class="border border-slate-300 p-2 rounded bg-slate-50">
          <div class="h-32 bg-slate-200 flex items-center justify-center text-slate-500 rounded font-semibold">[Fotografia 03 - Topo dos Pist\xF5es e C\xE2maras]</div>
          <p class="mt-2 text-slate-700"><strong>Legenda Anal\xEDtica 03:</strong> Marcas circulares n\xEDtidas no topo dos \xEAmbolos provocadas pelo choque mec\xE2nico imediato com os pratos das v\xE1lvulas est\xE1ticas abertas.</p>
        </div>
        <div class="border border-slate-300 p-2 rounded bg-slate-50">
          <div class="h-32 bg-slate-200 flex items-center justify-center text-slate-500 rounded font-semibold">[Fotografia 04 - Tensor e Polias de Acionamento]</div>
          <p class="mt-2 text-slate-700"><strong>Legenda Anal\xEDtica 04:</strong> Conjunto tensor e rolamentos guias sem ind\xEDcios de engripamento ou travamento t\xE9rmico. Rolamento com giro livre e pista sem colora\xE7\xE3o de sobreaquecimento.</p>
        </div>
      </div>`
    },
    {
      id: "sec-9",
      titulo: "Se\xE7\xE3o V - Legisla\xE7\xE3o e Normas T\xE9cnicas Aplic\xE1veis (CDC e CTB)",
      ordem: 9,
      conteudoHtml: `<p class="leading-relaxed">A presente fundamenta\xE7\xE3o alicer\xE7a-se no ordenamento t\xE9cnico e jur\xEDdico aplic\xE1vel \xE0 esp\xE9cie:</p>
      <ul class="list-disc pl-5 space-y-2 mt-2 text-xs leading-relaxed text-slate-800">
        <li><strong>C\xF3digo de Defesa do Consumidor (Lei Federal n\xBA 8.078/1990), Artigo 26, Inciso II:</strong> Estabelece expressamente o prazo decadencial de 90 (noventa) dias para o direito de reclamar por v\xEDcios aparentes ou de f\xE1cil constata\xE7\xE3o no fornecimento de servi\xE7os e de produtos dur\xE1veis.</li>
        <li><strong>ABNT NBR 13771:</strong> Procedimentos gerais para vistorias, per\xEDcias e exames diagn\xF3sticos em acidentes e sinistros veiculares.</li>
        <li><strong>ABNT NBR 5462:</strong> Confiabilidade e mantenabilidade mec\xE2nica \u2014 Defini\xE7\xF5es de taxa de falha intr\xEDnseca, desgaste natural e fim de vida \xFAtil de componentes mec\xE2nicos sujeitos a fadiga c\xEDclica.</li>
        <li><strong>C\xF3digo de Tr\xE2nsito Brasileiro (CTB - Lei n\xBA 9.503/1997):</strong> Dever de manuten\xE7\xE3o e conserva\xE7\xE3o veicular cont\xEDnua pelo propriet\xE1rio/operador.</li>
      </ul>`
    },
    {
      id: "sec-10",
      titulo: "Se\xE7\xE3o VI - Constata\xE7\xE3o de Danos e An\xE1lise de Causa Raiz",
      ordem: 10,
      conteudoHtml: `<h3 class="font-bold text-sm text-slate-900 border-b pb-1 mb-2">1. Din\xE2mica e Mec\xE2nica da Falha</h3>
      <p class="leading-relaxed">A an\xE1lise macrosc\xF3pica demonstra que o evento teve origem prim\xE1ria no <strong>rompimento mec\xE2nico da correia dentada de sincronismo</strong>. Em motores de combust\xE3o com c\xE2mara de interfer\xEAncia mec\xE2nica, a ruptura da correia cessa instantaneamente a rota\xE7\xE3o do comando de v\xE1lvulas, paralisando determinadas v\xE1lvulas em posi\xE7\xE3o aberta dentro da c\xE2mara de combust\xE3o. Concomitantemente, em raz\xE3o da in\xE9rcia rotacional do virabrequim e das bielas, os pist\xF5es continuam seu curso ascendente, culminando no choque mec\xE2nico direto entre o topo dos \xEAmbolos e os pratos das v\xE1lvulas.</p>
      
      <h3 class="font-bold text-sm text-slate-900 border-b pb-1 mt-4 mb-2">2. Descarte de Hip\xF3teses de Mau Uso e Sobreaquecimento</h3>
      <p class="leading-relaxed">A inspe\xE7\xE3o t\xE9cnica descartou conclusivamente a ocorr\xEAncia de sobreaquecimento prim\xE1rio (l\xEDquido de arrefecimento presente, sem deforma\xE7\xE3o no bloco) ou falta de lubrifica\xE7\xE3o (mancais e bronzinas de biela \xEDntegros com filme de \xF3leo preservado). Da mesma forma, n\xE3o foram identificados ind\xEDcios de rota\xE7\xE3o abusiva ou sobre-giro induzido (over-rev por engate err\xF4neo de marcha descendente).</p>
      
      <h3 class="font-bold text-sm text-slate-900 border-b pb-1 mt-4 mb-2">3. Nexo de Causalidade e Decurso Temporal de Garantia</h3>
      <p class="leading-relaxed">Confrontando a data da interven\xE7\xE3o mec\xE2nica pr\xE9via com a data da pane, constatou-se que o ve\xEDculo operou continuamente por <strong>${kmIntervalo}</strong> ao longo de um per\xEDodo temporal superior a 90 dias. Sob a \xF3tica da engenharia diagn\xF3stica, falhas decorrentes de eventual erro de montagem, desalinhamento grave ou tensionamento inadequado manifestam-se nas primeiras dezenas a centenas de quil\xF4metros de rodagem. A opera\xE7\xE3o plena e regular ao longo de milhares de quil\xF4metros afasta o liame de causalidade direto com a oficina prestadora de servi\xE7os, enquadrando o evento no ciclo de fadiga de material e desgaste sob regime de trabalho cont\xEDnuo.</p>`
    },
    {
      id: "sec-11",
      titulo: "Se\xE7\xE3o VII - Tabela de Constata\xE7\xE3o de Danos e Integridade T\xE9cnica",
      ordem: 11,
      conteudoHtml: `<table class="tiptap-table border-collapse border border-slate-300 w-full my-3 text-xs">
        <thead>
          <tr class="bg-slate-100 font-bold text-slate-800">
            <th class="p-2 border text-center w-12">Item</th>
            <th class="p-2 border text-left">Nome da Pe\xE7a / Componente</th>
            <th class="p-2 border text-center w-28">Condi\xE7\xE3o</th>
            <th class="p-2 border text-left">Parecer T\xE9cnico Pericial Espec\xEDfico</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-2 border text-center font-bold">01</td>
            <td class="p-2 border font-semibold">Correia Dentada de Sincronismo</td>
            <td class="p-2 border text-center font-bold text-red-700 bg-red-50">Danificado</td>
            <td class="p-2 border">Ruptura completa transversal com dentes cisalhados por fadiga mec\xE2nica. Elemento desencadeador do dessincronismo motriz.</td>
          </tr>
          <tr>
            <td class="p-2 border text-center font-bold">02</td>
            <td class="p-2 border font-semibold">V\xE1lvulas de Admiss\xE3o e Escape</td>
            <td class="p-2 border text-center font-bold text-red-700 bg-red-50">Danificado</td>
            <td class="p-2 border">Deforma\xE7\xE3o pl\xE1stica (hastes empenadas) por colis\xE3o mec\xE2nica direta contra a cabe\xE7a dos pist\xF5es p\xF3s-rompimento da correia.</td>
          </tr>
          <tr>
            <td class="p-2 border text-center font-bold">03</td>
            <td class="p-2 border font-semibold">Cabe\xE7ote do Motor (Mancais e Sedes)</td>
            <td class="p-2 border text-center font-bold text-amber-700 bg-amber-50">Parcial</td>
            <td class="p-2 border">Guias de v\xE1lvulas com necessidade de substitui\xE7\xE3o e ret\xEDfica de sedes. Estrutura de fundi\xE7\xE3o sem trincas macrosc\xF3picas.</td>
          </tr>
          <tr>
            <td class="p-2 border text-center font-bold">04</td>
            <td class="p-2 border font-semibold">Pist\xF5es do Motor</td>
            <td class="p-2 border text-center font-bold text-amber-700 bg-amber-50">Parcial</td>
            <td class="p-2 border">Marcas superficiais de impacto no topo dos \xEAmbolos sem perfura\xE7\xE3o ou trinca de saia. Requer medi\xE7\xE3o de folga de cilindro.</td>
          </tr>
          <tr>
            <td class="p-2 border text-center font-bold">05</td>
            <td class="p-2 border font-semibold">Tensor da Correia e Rolamentos Guias</td>
            <td class="p-2 border text-center font-bold text-emerald-700 bg-emerald-50">\xCDntegro</td>
            <td class="p-2 border">Mancais de rolamento com rota\xE7\xE3o desobstru\xEDda, sem sinais de engripamento, folga excessiva ou superaquecimento pr\xE9vio.</td>
          </tr>
          <tr>
            <td class="p-2 border text-center font-bold">06</td>
            <td class="p-2 border font-semibold">Bloco do Motor e Bielas</td>
            <td class="p-2 border text-center font-bold text-emerald-700 bg-emerald-50">\xCDntegro</td>
            <td class="p-2 border">Sem empenamento percept\xEDvel de bielas ou deforma\xE7\xF5es nas camisas dos cilindros. Lubrifica\xE7\xE3o preservada.</td>
          </tr>
        </tbody>
      </table>`
    },
    {
      id: "sec-12",
      titulo: "Se\xE7\xE3o VIII - Conclus\xE3o Pericial e Respostas aos Quesitos",
      ordem: 12,
      conteudoHtml: `<p class="leading-relaxed font-semibold text-slate-900">\xC0 luz dos exames t\xE9cnicos, evid\xEAncias materiais e par\xE2metros temporais/operacionais investigados, este Perito conclui categoricamente:</p>
      <ol class="list-decimal pl-5 space-y-2.5 mt-3 text-xs leading-relaxed text-slate-800">
        <li><strong>Da Causa Raiz:</strong> A quebra do motor foi diretamente provocada pelo <em>dessincronismo mec\xE2nico resultante da ruptura por fadiga da correia dentada</em>, gerando interfer\xEAncia e empenamento imediato do trem de v\xE1lvulas.</li>
        <li><strong>Do Nexo de Causalidade:</strong> O nexo causal entre o evento danoso e servi\xE7os de manuten\xE7\xE3o pr\xE9vios restou <strong>descaracterizado</strong>, uma vez que o ve\xEDculo operou normalmente por expressivo ciclo de quilometragem (${kmIntervalo}), o que afasta v\xEDcio de instala\xE7\xE3o imediata.</li>
        <li><strong>Da Garantia Legal:</strong> Conforme preceitua o Art. 26, inciso II da Lei Federal n\xBA 8.078/1990 (C\xF3digo de Defesa do Consumidor), o prazo decadencial de 90 dias para responsabiliza\xE7\xE3o de servi\xE7o sobre produto dur\xE1vel encontrava-se <strong>integralmente expirado</strong> na data da pane mec\xE2nica.</li>
        <li><strong>Da Conduta do Operador:</strong> N\xE3o foram constatados elementos materiais que evidenciem imper\xEDcia, imprud\xEAncia ou neglig\xEAncia operacional imput\xE1vel ao condutor na condu\xE7\xE3o do ve\xEDculo.</li>
      </ol>`
    },
    {
      id: "sec-13",
      titulo: "Se\xE7\xE3o IX - Considera\xE7\xF5es Finais e Anexo da ART CREA-PE",
      ordem: 13,
      conteudoHtml: `<p class="leading-relaxed">Nada mais havendo a constatar ou a relatar sobre a mat\xE9ria submetida a exame, encerra-se o presente <strong>Laudo de Avalia\xE7\xE3o T\xE9cnica Pericial</strong>, composto por 13 se\xE7\xF5es t\xE9cnicas e anexos fotogr\xE1ficos/documentais.</p>
      <p class="leading-relaxed mt-3">O presente trabalho encontra-se formalmente acobertado pela <strong>Anota\xE7\xE3o de Responsabilidade T\xE9cnica (ART) n\xBA ${artNumero}</strong>, devidamente registrada junto ao CREA-PE, atestando a habilita\xE7\xE3o e autoria t\xE9cnica do respons\xE1vel.</p>
      <div class="mt-8 pt-4 border-t border-slate-400 text-center max-w-sm mx-auto">
        <p class="font-bold text-slate-900 text-sm">Eng. Vitor Leonardo</p>
        <p class="text-xs text-slate-600">Engenheiro Mec\xE2nico \u2022 Perito T\xE9cnico Especialista</p>
        <p class="text-xs text-slate-500 font-mono">CREA-PE 1822299490</p>
        <p class="text-xs text-blue-800 mt-1 font-semibold">VL ENGENHARIA</p>
      </div>`
    }
  ];
  return {
    resumoExecutivo: `Laudo pericial de causa raiz do ve\xEDculo ${veiculoDesc}. Constatada ruptura de correia dentada ap\xF3s ${kmIntervalo}. Nexo causal com servi\xE7os anteriores afastado e prazo de garantia do CDC expirado.`,
    conclusaoGeral: `Avaria provocada por dessincronismo decorrente de ruptura por fadiga da correia sincronizadora. Afastada responsabilidade da oficina por decurso de prazo legal do CDC (${garantiaCDC}).`,
    causaRaizIdentificada: causaRaiz,
    nexoCausalComManutencaoPrevia: nexoCausal,
    enquadramentoGarantiaCDC: garantiaCDC,
    indiciosMauUso: mauUso,
    secoes
  };
}

// server.ts
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = Number(process.env.PORT) || 3e3;
app.use(import_express.default.json({ limit: "25mb" }));
app.use(import_express.default.urlencoded({ extended: false, limit: "2kb" }));
var DATA_FILE = import_path.default.join(process.cwd(), "data", "app_storage.json");
var FICTITIOUS_IDS = {
  clientes: /* @__PURE__ */ new Set(["cli-01", "cli-02", "cli-03"]),
  ativos: /* @__PURE__ */ new Set(["atv-01", "atv-02", "atv-03", "atv-pgx7098"]),
  orcamentos: /* @__PURE__ */ new Set(["orc-01", "orc-02", "orc-03", "orc-2026-002", "orc-adf-pgx7098", "orc-1789155592909"]),
  laudos: /* @__PURE__ */ new Set(["lau-2025-045", "lau-2026-003", "lau-2026-001"]),
  checklistsCampo: /* @__PURE__ */ new Set(["chk-01", "chk-02"]),
  agenda: /* @__PURE__ */ new Set(["ag-01", "ag-02"]),
  usuarios: /* @__PURE__ */ new Set(["usr-colab-1", "usr-cli-1"])
};
function getItemTimestamp(item) {
  const raw = item?.atualizadoEm || item?.criadoEm || 0;
  const t = new Date(raw).getTime();
  return Number.isFinite(t) ? t : 0;
}
function mergeCollectionSafely(currentList, incomingList, removedSet, fictitiousSet, idField = "id") {
  const map = /* @__PURE__ */ new Map();
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
        map.set(id, tIncoming >= tExisting ? { ...existing, ...item } : existing);
      }
    }
  }
  return Array.from(map.values());
}
app.get("/api/app-data", (req, res) => {
  try {
    if (import_fs.default.existsSync(DATA_FILE)) {
      const content = import_fs.default.readFileSync(DATA_FILE, "utf-8");
      const data = JSON.parse(content);
      const cliRem = new Set(data.clientesRemovidosIds || []);
      const atvRem = new Set(data.ativosRemovidosIds || []);
      const orcRem = new Set(data.orcamentosRemovidosIds || []);
      const lauRem = new Set(data.laudosRemovidosIds || []);
      const chkRem = new Set(data.checklistsRemovidosIds || []);
      const agRem = new Set(data.agendaRemovidosIds || []);
      const usrRem = new Set(data.usuariosRemovidosIds || []);
      if (Array.isArray(data.clientes)) {
        data.clientes = data.clientes.filter((c) => !cliRem.has(c.id) && !FICTITIOUS_IDS.clientes.has(c.id));
      }
      if (Array.isArray(data.ativos)) {
        data.ativos = data.ativos.filter((a) => !atvRem.has(a.id) && !FICTITIOUS_IDS.ativos.has(a.id));
      }
      if (Array.isArray(data.orcamentos)) {
        data.orcamentos = data.orcamentos.filter((o) => !orcRem.has(o.id) && !FICTITIOUS_IDS.orcamentos.has(o.id));
      }
      if (Array.isArray(data.laudos)) {
        data.laudos = data.laudos.filter((l) => !lauRem.has(l.id) && !FICTITIOUS_IDS.laudos.has(l.id));
      }
      if (Array.isArray(data.checklistsCampo)) {
        data.checklistsCampo = data.checklistsCampo.filter((ck) => !chkRem.has(ck.id) && !FICTITIOUS_IDS.checklistsCampo.has(ck.id));
      }
      if (Array.isArray(data.agenda)) {
        data.agenda = data.agenda.filter((ag) => !agRem.has(ag.id) && !FICTITIOUS_IDS.agenda.has(ag.id));
      }
      if (Array.isArray(data.usuarios)) {
        data.usuarios = data.usuarios.filter((u) => !usrRem.has(u.uid) && !FICTITIOUS_IDS.usuarios.has(u.uid));
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
    const dir = import_path.default.dirname(DATA_FILE);
    if (!import_fs.default.existsSync(dir)) {
      import_fs.default.mkdirSync(dir, { recursive: true });
    }
    const currentData = import_fs.default.existsSync(DATA_FILE) ? JSON.parse(import_fs.default.readFileSync(DATA_FILE, "utf-8")) : {};
    const combineRemoved = (key) => Array.from(/* @__PURE__ */ new Set([...currentData[key] || [], ...req.body[key] || []]));
    const clientesRemovidosIds = combineRemoved("clientesRemovidosIds");
    const ativosRemovidosIds = combineRemoved("ativosRemovidosIds");
    const orcamentosRemovidosIds = combineRemoved("orcamentosRemovidosIds");
    const laudosRemovidosIds = combineRemoved("laudosRemovidosIds");
    const checklistsRemovidosIds = combineRemoved("checklistsRemovidosIds");
    const agendaRemovidosIds = combineRemoved("agendaRemovidosIds");
    const usuariosRemovidosIds = combineRemoved("usuariosRemovidosIds");
    const merged = {
      ...currentData,
      ...req.body,
      clientesRemovidosIds,
      ativosRemovidosIds,
      orcamentosRemovidosIds,
      laudosRemovidosIds,
      checklistsRemovidosIds,
      agendaRemovidosIds,
      usuariosRemovidosIds,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
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
    const baseTrabalhos = Array.isArray(req.body.trabalhosPublicados) ? req.body.trabalhosPublicados : Array.isArray(currentData.trabalhosPublicados) ? currentData.trabalhosPublicados : [];
    merged.trabalhosPublicados = baseTrabalhos.filter(
      (t) => !laudosRemovidosSet.has(t?.laudoId || t?.id)
    );
    import_fs.default.writeFileSync(DATA_FILE, JSON.stringify(merged, null, 2), "utf-8");
    return res.json({ success: true, savedAt: merged.updatedAt });
  } catch (err) {
    console.error("Erro ao salvar app_storage.json:", err);
    return res.status(500).json({ error: err.message });
  }
});
app.get("/api/proxy-image", async (req, res) => {
  try {
    const url = String(req.query.url || "");
    const permitido = /^https:\/\/(firebasestorage\.googleapis\.com|storage\.googleapis\.com)\//i.test(url);
    if (!permitido) {
      return res.status(400).json({ error: "URL de imagem n\xE3o permitida." });
    }
    const resposta = await fetch(url);
    if (!resposta.ok) {
      return res.status(502).json({ error: "N\xE3o foi poss\xEDvel obter a imagem." });
    }
    const contentType = resposta.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) {
      return res.status(415).json({ error: "Conte\xFAdo n\xE3o \xE9 uma imagem." });
    }
    const buffer = Buffer.from(await resposta.arrayBuffer());
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.send(buffer);
  } catch (err) {
    console.warn("Erro no proxy de imagem:", err);
    return res.status(502).json({ error: "Falha ao carregar a imagem." });
  }
});
app.delete("/api/orcamentos/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (!import_fs.default.existsSync(DATA_FILE)) {
      return res.json({ success: true });
    }
    const currentData = JSON.parse(import_fs.default.readFileSync(DATA_FILE, "utf-8"));
    const orcamentosRemovidosIds = Array.from(/* @__PURE__ */ new Set([
      ...currentData.orcamentosRemovidosIds || [],
      id
    ]));
    const orcRemovidos = new Set(orcamentosRemovidosIds);
    const orcamentos = Array.isArray(currentData.orcamentos) ? currentData.orcamentos.filter((o) => !orcRemovidos.has(o.id)) : [];
    const updated = {
      ...currentData,
      orcamentos,
      orcamentosRemovidosIds,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    import_fs.default.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2), "utf-8");
    return res.json({ success: true, removedId: id });
  } catch (err) {
    console.error("Erro ao deletar or\xE7amento em app_storage.json:", err);
    return res.status(500).json({ error: err.message });
  }
});
var LAUDOS_PDF_DIR = import_path.default.join(process.cwd(), "data", "uploads", "laudos");
function sanitizeSafeId(raw) {
  return String(raw || "").replace(/[^a-zA-Z0-9_-]/g, "");
}
function readAppStorageSafe() {
  try {
    if (import_fs.default.existsSync(DATA_FILE)) {
      return JSON.parse(import_fs.default.readFileSync(DATA_FILE, "utf-8")) || {};
    }
  } catch (err) {
    console.warn("Erro ao ler app_storage.json:", err);
  }
  return {};
}
function writeAppStorageSafe(data) {
  const dir = import_path.default.dirname(DATA_FILE);
  if (!import_fs.default.existsSync(dir)) {
    import_fs.default.mkdirSync(dir, { recursive: true });
  }
  import_fs.default.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}
app.get("/api/trabalhos-publicados", (req, res) => {
  try {
    const data = readAppStorageSafe();
    const laudosRemSet = new Set(data.laudosRemovidosIds || []);
    const lista = Array.isArray(data.trabalhosPublicados) ? data.trabalhosPublicados.filter((t) => t && !laudosRemSet.has(t.laudoId || t.id)) : [];
    return res.json({ trabalhos: lista });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.post("/api/trabalhos-publicados", (req, res) => {
  try {
    const data = readAppStorageSafe();
    const atual = Array.isArray(data.trabalhosPublicados) ? data.trabalhosPublicados : [];
    const { trabalho, trabalhos, removerId } = req.body || {};
    let proximaLista = [...atual];
    if (Array.isArray(trabalhos)) {
      proximaLista = trabalhos.filter((t) => t && t.id);
    } else if (removerId) {
      proximaLista = proximaLista.filter((t) => t.id !== removerId && t.laudoId !== removerId);
    } else if (trabalho && trabalho.id) {
      proximaLista = [
        trabalho,
        ...proximaLista.filter((t) => t.id !== trabalho.id && t.laudoId !== trabalho.id)
      ];
    } else {
      return res.status(400).json({ error: "Envie 'trabalho', 'trabalhos' ou 'removerId'." });
    }
    const updated = {
      ...data,
      trabalhosPublicados: proximaLista,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    writeAppStorageSafe(updated);
    return res.json({ success: true, trabalhos: proximaLista });
  } catch (err) {
    console.error("Erro ao salvar trabalhos publicados:", err);
    return res.status(500).json({ error: err.message });
  }
});
var TRABALHOS_IMG_DIR = import_path.default.join(process.cwd(), "data", "uploads", "trabalhos");
app.post("/api/trabalhos-publicados/imagem", (req, res) => {
  try {
    const { dataUrl, nomeArquivo, trabalhoId } = req.body || {};
    if (!dataUrl || typeof dataUrl !== "string") {
      return res.status(400).json({ error: "Imagem n\xE3o enviada." });
    }
    const match = dataUrl.match(/^data:image\/(png|jpeg|jpg|webp|gif);base64,(.+)$/i);
    if (!match) {
      return res.status(400).json({ error: "Formato de imagem inv\xE1lido. Utilize JPG, PNG ou WebP." });
    }
    const extRaw = match[1].toLowerCase();
    const ext = extRaw === "jpeg" ? "jpg" : extRaw;
    const buffer = Buffer.from(match[2], "base64");
    if (!buffer.length || buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ error: "A imagem deve ter no m\xE1ximo 10 MB." });
    }
    if (!import_fs.default.existsSync(TRABALHOS_IMG_DIR)) {
      import_fs.default.mkdirSync(TRABALHOS_IMG_DIR, { recursive: true });
    }
    const safeId = sanitizeSafeId(trabalhoId || `trab-${Date.now()}`) || `trab-${Date.now()}`;
    const filename = `${safeId}-${Date.now()}.${ext}`;
    import_fs.default.writeFileSync(import_path.default.join(TRABALHOS_IMG_DIR, filename), buffer);
    return res.json({
      success: true,
      url: `/api/trabalhos-publicados/imagem/${filename}`,
      nomeArquivo: String(nomeArquivo || filename)
    });
  } catch (err) {
    console.error("Erro ao salvar imagem de trabalho publicado:", err);
    return res.status(500).json({ error: err.message || "Falha ao salvar imagem." });
  }
});
app.get("/api/trabalhos-publicados/imagem/:filename", (req, res) => {
  try {
    const safeName = import_path.default.basename(String(req.params.filename || "")).replace(/[^a-zA-Z0-9_.-]/g, "");
    if (!safeName) {
      return res.status(400).json({ error: "Nome de arquivo inv\xE1lido." });
    }
    const filePath = import_path.default.join(TRABALHOS_IMG_DIR, safeName);
    if (!import_fs.default.existsSync(filePath)) {
      return res.status(404).json({ error: "Imagem n\xE3o encontrada." });
    }
    return res.sendFile(filePath);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
var handleUploadPdfAssinado = (req, res) => {
  try {
    const rawId = req.params.id || req.body?.laudoId || req.query?.id || "";
    const safeId = sanitizeSafeId(String(rawId));
    if (!safeId) {
      return res.status(400).json({ error: "Identificador do laudo inv\xE1lido." });
    }
    if (!import_fs.default.existsSync(LAUDOS_PDF_DIR)) {
      import_fs.default.mkdirSync(LAUDOS_PDF_DIR, { recursive: true });
    }
    const { dataUrl, nomeArquivo, chunkData, chunkIndex, totalChunks, uploadId } = req.body || {};
    const safeFileName = String(nomeArquivo || `${safeId}-assinado.pdf`).replace(/[^\w.\-() ]+/g, "_").slice(0, 140);
    if (chunkData !== void 0 && chunkIndex !== void 0 && totalChunks !== void 0) {
      const idx = Number(chunkIndex);
      const total = Number(totalChunks);
      if (!Number.isInteger(idx) || !Number.isInteger(total) || idx < 0 || total <= 0 || idx >= total) {
        return res.status(400).json({ error: "Par\xE2metros de envio em partes inv\xE1lidos." });
      }
      const safeUploadId = sanitizeSafeId(uploadId || "default") || "default";
      const partPath = import_path.default.join(LAUDOS_PDF_DIR, `${safeId}.${safeUploadId}.part`);
      const cleanB64 = String(chunkData).replace(/^data:[^;]+;base64,/, "");
      const chunkBuf = Buffer.from(cleanB64, "base64");
      if (idx === 0) {
        import_fs.default.writeFileSync(partPath, chunkBuf);
      } else {
        if (!import_fs.default.existsSync(partPath)) {
          return res.status(400).json({ error: "Sess\xE3o de upload interrompida. Tente enviar novamente." });
        }
        import_fs.default.appendFileSync(partPath, chunkBuf);
      }
      const stats = import_fs.default.statSync(partPath);
      if (stats.size > 30 * 1024 * 1024) {
        import_fs.default.unlinkSync(partPath);
        return res.status(413).json({ error: "O arquivo PDF excede o limite de 30 MB." });
      }
      if (idx < total - 1) {
        return res.json({ success: true, partial: true, chunkIndex: idx, bytesRecebidos: stats.size });
      }
      const finalBuffer = import_fs.default.readFileSync(partPath);
      const headerSample = finalBuffer.subarray(0, 1024).toString("latin1");
      if (!finalBuffer.length || !headerSample.includes("%PDF")) {
        import_fs.default.unlinkSync(partPath);
        return res.status(400).json({ error: "O arquivo enviado n\xE3o possui cabe\xE7alho PDF v\xE1lido." });
      }
      const finalPath = import_path.default.join(LAUDOS_PDF_DIR, `${safeId}.pdf`);
      import_fs.default.renameSync(partPath, finalPath);
      return res.json({
        success: true,
        url: `/api/laudos/${safeId}/pdf-assinado`,
        nomeArquivo: safeFileName,
        tamanhoBytes: finalBuffer.length
      });
    }
    if (!dataUrl || typeof dataUrl !== "string") {
      return res.status(400).json({ error: "Arquivo PDF n\xE3o enviado." });
    }
    const base64Match = dataUrl.match(/^data:[^;]+;base64,(.+)$/);
    const base64Body = base64Match ? base64Match[1] : dataUrl;
    const buffer = Buffer.from(base64Body, "base64");
    if (!buffer.length) {
      return res.status(400).json({ error: "Arquivo PDF vazio ou inv\xE1lido." });
    }
    if (buffer.length > 30 * 1024 * 1024) {
      return res.status(413).json({ error: "O arquivo PDF excede o limite de 30 MB." });
    }
    if (!buffer.subarray(0, 1024).toString("latin1").includes("%PDF")) {
      return res.status(400).json({ error: "O arquivo enviado n\xE3o possui cabe\xE7alho PDF v\xE1lido." });
    }
    const filePath = import_path.default.join(LAUDOS_PDF_DIR, `${safeId}.pdf`);
    import_fs.default.writeFileSync(filePath, buffer);
    return res.json({
      success: true,
      url: `/api/laudos/${safeId}/pdf-assinado`,
      nomeArquivo: safeFileName,
      tamanhoBytes: buffer.length
    });
  } catch (err) {
    console.error("Erro ao salvar PDF assinado do laudo:", err);
    return res.status(500).json({ error: err.message || "Falha ao salvar PDF assinado." });
  }
};
var handleGetPdfAssinado = (req, res) => {
  try {
    const rawId = req.params.id || req.query?.id || "";
    const safeId = sanitizeSafeId(String(rawId));
    if (!safeId) {
      return res.status(400).json({ error: "Identificador inv\xE1lido." });
    }
    const filePath = import_path.default.join(LAUDOS_PDF_DIR, `${safeId}.pdf`);
    if (!import_fs.default.existsSync(filePath)) {
      return res.status(404).json({ error: "PDF assinado n\xE3o encontrado." });
    }
    const download = req.query.download === "1";
    const fileName = String(req.query.nome || `laudo-${safeId}-assinado.pdf`).replace(/[^\w.\-() ]+/g, "_");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `${download ? "attachment" : "inline"}; filename="${fileName}"`);
    return res.sendFile(filePath);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
var handleDeletePdfAssinado = (req, res) => {
  try {
    const rawId = req.params.id || req.query?.id || req.body?.laudoId || "";
    const safeId = sanitizeSafeId(String(rawId));
    if (!safeId) {
      return res.status(400).json({ error: "Identificador inv\xE1lido." });
    }
    const filePath = import_path.default.join(LAUDOS_PDF_DIR, `${safeId}.pdf`);
    if (import_fs.default.existsSync(filePath)) {
      import_fs.default.unlinkSync(filePath);
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
app.post("/api/laudo-pdf-assinado", handleUploadPdfAssinado);
app.get("/api/laudo-pdf-assinado", handleGetPdfAssinado);
app.delete("/api/laudo-pdf-assinado", handleDeletePdfAssinado);
app.post("/api/laudos/:id/pdf-assinado", handleUploadPdfAssinado);
app.get("/api/laudos/:id/pdf-assinado", handleGetPdfAssinado);
app.delete("/api/laudos/:id/pdf-assinado", handleDeletePdfAssinado);
var monthlyAICalls = 0;
var currentMonth = (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
var MONTHLY_LIMIT = parseInt(process.env.GEMINI_MONTHLY_LIMIT || "500", 10);
function getMonthlyAICalls() {
  const monthNow = (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
  if (monthNow !== currentMonth) {
    currentMonth = monthNow;
    monthlyAICalls = 0;
  }
  return monthlyAICalls;
}
app.get("/health", (req, res) => {
  res.json({ status: "ok", company: "VL Engenharia", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", company: "VL Engenharia", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.get("/api/cnpj/:cnpj", async (req, res) => {
  const digits = String(req.params.cnpj || "").replace(/\D/g, "");
  if (digits.length !== 14) {
    return res.status(400).json({ error: "CNPJ inv\xE1lido. Informe 14 d\xEDgitos num\xE9ricos." });
  }
  try {
    const upstream = await fetch(`https://publica.cnpj.ws/cnpj/${digits}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "VL-Engenharia-App/1.0"
      }
    });
    const text = await upstream.text();
    let payload = {};
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { raw: text };
    }
    if (!upstream.ok) {
      return res.status(upstream.status).json(payload);
    }
    return res.json(payload);
  } catch (err) {
    return res.status(502).json({ error: err?.message || "Falha ao consultar CNPJ." });
  }
});
app.get("/api/ai/usage", (req, res) => {
  const calls = getMonthlyAICalls();
  res.json({
    currentMonth,
    used: calls,
    limit: MONTHLY_LIMIT,
    remaining: Math.max(0, MONTHLY_LIMIT - calls),
    exceeded: calls >= MONTHLY_LIMIT
  });
});
app.post("/api/ai/analyze-inspection", async (req, res) => {
  try {
    const calls = getMonthlyAICalls();
    if (calls >= MONTHLY_LIMIT) {
      return res.status(429).json({
        error: "Limite mensal de chamadas de IA atingido (" + MONTHLY_LIMIT + " chamadas). Entre em contato com o suporte ou aumente a cota no painel.",
        used: calls,
        limit: MONTHLY_LIMIT
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
    const moduloEfetivo = tipoLaudo || moduleType || "Inspe\xE7\xE3o Mec\xE2nica Geral";
    const equipamentoEfetivo = equipamento || assetData?.tipo || assetData?.identificacao || "Equipamento Industrial";
    const obsEfetivas = (naoConformidades && Array.isArray(naoConformidades) ? naoConformidades.join("; ") : "") || observations || "An\xE1lise preliminar de conformidade.";
    const scoreEfetivo = scoreHRN || currentHRN?.score || 10;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      monthlyAICalls++;
      return res.json({
        parecerTecnico: `Com base nas diretrizes normativas da ABNT e Minist\xE9rio do Trabalho (${normasRef || "NR-12 / NR-11 / NR-13"}), o ativo ${equipamentoEfetivo} apresenta pontos que requerem aten\xE7\xE3o de seguran\xE7a operacional e plano de manuten\xE7\xE3o preventiva. Constatou-se a necessidade de salvaguardas mec\xE2nicas e bloqueio de fontes de energia (LOTO).`,
        riscosIdentificados: [
          `Esmagamento e prensagem de extremidades nas transmiss\xF5es de for\xE7a desprovidas de prote\xE7\xE3o mec\xE2nica.`,
          `Ruptura ou fadiga de componentes sob press\xE3o/esfor\xE7o c\xEDclico sem prontu\xE1rio t\xE9cnico atualizado.`
        ],
        recomendacoesGerais: `Executar plano de a\xE7\xE3o corretivo em at\xE9 30 dias \xFAteis, instalando prote\xE7\xF5es fixas e m\xF3veis com intertravamento de seguran\xE7a Categoria 4, complementado com treinamento formal dos operadores e emiss\xE3o de ART CREA-PE.`,
        nivelRiscoSugerido: scoreEfetivo > 50 ? "Alto" : scoreEfetivo > 10 ? "M\xE9dio" : "Baixo",
        mock: true
      });
    }
    const ai = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
    const systemPrompt = `Voc\xEA \xE9 um engenheiro mec\xE2nico especialista em seguran\xE7a do trabalho, laudos periciais e aprecia\xE7\xE3o de riscos industriais (CREA, NR-12, NR-13, CONTRAN, ABNT NBR 16071, PMOC Lei 13.589/2018).
Seu papel \xE9 auxiliar o Engenheiro Mec\xE2nico Vitor Leonardo (CREA-PE 1822299490) na an\xE1lise t\xE9cnica preliminar para laudo pericial.
Responda SEMPRE em JSON rigoroso com a seguinte estrutura:
{
  "parecerTecnico": "Texto formal e t\xE9cnico para constar no laudo",
  "riscosIdentificados": ["item 1", "item 2"],
  "recomendacoesGerais": "Texto explicativo consolidado com as a\xE7\xF5es corretivas",
  "recomendacoesPlanoAcao": ["medida 1", "medida 2", "medida 3"],
  "nivelRiscoSugerido": "Baixo" | "M\xE9dio" | "Alto" | "Muito Alto" | "Cr\xEDtico",
  "sugestaoHRN": {
    "nivel": "Baixo" | "M\xE9dio" | "Alto" | "Muito Alto" | "Cr\xEDtico",
    "justificativa": "breve justificativa"
  }
}`;
    const userPrompt = `Analise a seguinte inspe\xE7\xE3o t\xE9cnica:
M\xF3dulo: ${moduloEfetivo}
Equipamento/Ativo: ${equipamentoEfetivo}
Observa\xE7\xF5es e Constata\xE7\xF5es de Campo: "${obsEfetivas}"
Score HRN Preliminar: ${scoreEfetivo}

Gere a an\xE1lise t\xE9cnica em formato JSON estruturado com parecerTecnico, riscosIdentificados (ou naoConformidadesProvaveis), recomendacoesGerais (ou recomendacoesPlanoAcao) e nivelRiscoSugerido.`;
    const modelsToTry = ["gemini-3.8-flash", "gemini-3.6-flash", "gemini-flash-latest"];
    let response = null;
    let lastError = null;
    for (const modelName of modelsToTry) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: [
            { role: "user", parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }
          ],
          config: {
            responseMimeType: "application/json"
          }
        });
        if (response?.text) {
          break;
        }
      } catch (err) {
        lastError = err;
        console.warn(`Tentativa com modelo ${modelName} falhou:`, err?.message || err);
      }
    }
    if (!response && lastError) {
      throw lastError;
    }
    monthlyAICalls++;
    const text = response?.text || "{}";
    let parsed = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        parecerTecnico: text,
        riscosIdentificados: [],
        recomendacoesGerais: "Manter manuten\xE7\xE3o preventiva e auditorias peri\xF3dicas.",
        recomendacoesPlanoAcao: []
      };
    }
    if (!parsed.riscosIdentificados && parsed.naoConformidadesProvaveis) {
      parsed.riscosIdentificados = parsed.naoConformidadesProvaveis;
    }
    if (!parsed.recomendacoesGerais && Array.isArray(parsed.recomendacoesPlanoAcao)) {
      parsed.recomendacoesGerais = parsed.recomendacoesPlanoAcao.join(". ");
    }
    if (!parsed.nivelRiscoSugerido && parsed.sugestaoHRN?.nivel) {
      parsed.nivelRiscoSugerido = parsed.sugestaoHRN.nivel;
    }
    return res.json({
      ...parsed,
      mock: false,
      currentUsage: monthlyAICalls,
      limit: MONTHLY_LIMIT
    });
  } catch (err) {
    console.error("Erro no processamento da IA:", err);
    return res.status(500).json({
      error: "Falha na comunica\xE7\xE3o com o servi\xE7o de IA: " + (err?.message || "Erro desconhecido")
    });
  }
});
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
      return res.json({
        conteudoHtml: `<div class="p-3 bg-blue-50/70 border-l-4 border-blue-600 rounded-r my-2 space-y-1">
          <p><strong>Fundamenta\xE7\xE3o Pericial (${tituloSecao || "Inspe\xE7\xE3o T\xE9cnica"}):</strong></p>
          <p>Com amparo nas diretrizes de ${normasRef || "ABNT NBR e Normas Regulamentadoras vigentes"}, procedeu-se \xE0 averigua\xE7\xE3o do ativo <em>${ativoIdentificacao || "especificado"}</em>. Conclui-se pelo atendimento aos padr\xF5es de seguran\xE7a mec\xE2nica e estabilidade operacional.</p>
        </div>`,
        mock: true
      });
    }
    const ai = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
    const promptSystem = `Voc\xEA \xE9 um Engenheiro Mec\xE2nico Perito e Consultor T\xE9cnico Especialista (CREA-PE 182229949-0).
Sua tarefa \xE9 redigir ou expandir tecnicamente o conte\xFAdo de uma SE\xC7\xC3O ESPEC\xCDFICA de um laudo pericial de engenharia mec\xE2nica.
Diretrizes mandat\xF3rias:
1. Retorne texto em HTML limpo, usando tags como <p>, <ul>, <li>, <strong>, <em> e, se conveniente para clareza t\xE9cnica, tabelas estruturadas (<table class="tiptap-table border-collapse border border-slate-300 w-full my-3">).
2. N\xE3o use marcadores de markdown como \`\`\`html ou blocos de c\xF3digo; retorne estritamente o HTML interno pronto para o editor de texto rico.
3. Use vocabul\xE1rio pericial formal, fundamentado nas normas ABNT e NRs cab\xEDveis, com termos de engenharia diagn\xF3stica (tens\xF5es, salvaguardas, integridade mec\xE2nica, ensaios).
4. O tom deve ser pericial conclusivo e assertivo.`;
    const promptInput = `Redija o conte\xFAdo t\xE9cnico para a seguinte se\xE7\xE3o:
- T\xEDtulo da Se\xE7\xE3o: "${tituloSecao}"
- Tipo de Laudo: "${tipoLaudo || "Laudo T\xE9cnico Pericial de Engenharia Mec\xE2nica"}"
- Normas de Refer\xEAncia: "${normasRef || "ABNT NBR e Normas Regulamentadoras vigentes"}"
- Ativo/Equipamento Periciado: "${ativoIdentificacao || "Equipamento periciado"}"
- Cliente/Empresa: "${clienteNome || "Contratante"}"
${conteudoAtual ? `- Conte\xFAdo T\xE9cnico j\xE1 existente na se\xE7\xE3o para expandir/aprimorar:
"""${conteudoAtual}"""` : ""}
${promptUsuario ? `- Instru\xE7\xE3o Espec\xEDfica do Engenheiro:
"""${promptUsuario}"""` : ""}

Elabore a reda\xE7\xE3o pericial completa, t\xE9cnica e aprofundada para esta se\xE7\xE3o.`;
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
          htmlGerado = htmlGerado.replace(/^```html\s*/i, "").replace(/\s*```$/i, "");
          break;
        }
      } catch (err) {
        console.warn(`Tentativa com modelo ${model} falhou:`, err?.message || err);
      }
    }
    if (!htmlGerado) {
      throw new Error("N\xE3o foi poss\xEDvel gerar reda\xE7\xE3o pelo servi\xE7o de IA.");
    }
    monthlyAICalls++;
    return res.json({
      conteudoHtml: htmlGerado,
      mock: false,
      currentUsage: monthlyAICalls,
      limit: MONTHLY_LIMIT
    });
  } catch (err) {
    console.error("Erro na reda\xE7\xE3o de se\xE7\xE3o por IA:", err);
    return res.status(500).json({
      error: "Falha na gera\xE7\xE3o de reda\xE7\xE3o: " + (err?.message || "Erro desconhecido")
    });
  }
});
app.post("/api/ai/gerar-laudo-causa-raiz", async (req, res) => {
  try {
    const dados = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const laudoOffline = gerarLaudoCausaRaizOffline(dados);
      return res.json({
        ...laudoOffline,
        mock: true,
        source: "motor_pericial_offline"
      });
    }
    const ai = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
    const promptSystem = construirPromptSistemaCausaRaiz();
    const promptUser = construirPromptUsuarioCausaRaiz(dados);
    const modelsToTry = ["gemini-3.8-flash", "gemini-3.6-flash", "gemini-flash-latest"];
    let resultadoJson = null;
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
            resultadoJson.secoes = resultadoJson.secoes.map((s) => {
              if (s.conteudoHtml && /propriet[aá]rio/i.test(s.conteudoHtml) && /adf/i.test(s.conteudoHtml)) {
                s.conteudoHtml = s.conteudoHtml.replace(
                  /(<td[^>]*>Propriet[aá]rio:?<\/td>\s*<td[^>]*>)([^<]*Adf[^<]*)(<\/td>)/gi,
                  "$1Minist\xE9rio P\xFAblico de Pernambuco (CNPJ: 24.417.065/0001-03)$3"
                );
              }
              return s;
            });
            break;
          }
        }
      } catch (err) {
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
  } catch (err) {
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
app.post("/api/ai/generate-proposal", async (req, res) => {
  try {
    const calls = getMonthlyAICalls();
    if (calls >= MONTHLY_LIMIT) {
      return res.status(429).json({
        error: "Limite mensal de chamadas de IA atingido (" + MONTHLY_LIMIT + " chamadas).",
        used: calls,
        limit: MONTHLY_LIMIT
      });
    }
    const {
      PROP_CODIGO = `PROP-${(/* @__PURE__ */ new Date()).getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      DATA_EMISSAO = (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR"),
      VALIDADE_DIAS = "15",
      NOME_CLIENTE_RAZAO_SOCIAL = "Cliente Corporativo S.A.",
      CNPJ_CLIENTE = "00.000.000/0001-00",
      REPRESENTANTE_NOME = "Diretoria de Opera\xE7\xF5es",
      EMAIL_CLIENTE = "contato@cliente.com.br",
      TELEFONE_CLIENTE = "(81) 99999-0000",
      LOCALIDADE_SERVICO = "Recife / Jaboat\xE3o dos Guararapes - PE",
      DESCRICAO_DEMANDA = "Laudo T\xE9cnico de Inspe\xE7\xE3o Mec\xE2nica e Adequa\xE7\xE3o",
      NORMAS_TECNICAS = "ABNT NBR, NR-12, NR-11, NR-13",
      QTD_EQUIPAMENTOS = "01 Ativo / M\xE1quina Principal",
      HORAS_ENGENHARIA = "16 horas t\xE9cnicas de engenharia",
      MOBILIZACAO = "Imediata / 48 horas \xFAteis ap\xF3s confirma\xE7\xE3o",
      PRAZO_ENTREGA = "3 Dias \xDAteis ap\xF3s vistoria presencial",
      CONDICOES_PAGAMENTO = "50% no aceite eletr\xF4nico e 50% ap\xF3s emiss\xE3o da ART e Laudo",
      VALOR_INVESTIMENTO = "R$ 2.450,00",
      FOTOS_DESCRICAO_OU_PATHS = "Levantamento fotogr\xE1fico preliminar do parque fabril",
      INCLUI_NOTA_FISCAL = true,
      CHAVE_PIX = "10287093409"
    } = req.body;
    const comNotaFiscal = INCLUI_NOTA_FISCAL !== false;
    const QR_CODE_PIX_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALMAAACzCAYAAAC3/90AAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAD20lEQVR4nO3c0W3rMBAEUc5qUkvqSS2pJxV0V+DBB75A9vPzTjN38PFFcQo/e/78+fPjU12vX88e4P/wB7+fP/j9/MHv5w9+v/nBz/8Cvx38wZ77wQf/n3zwd/IHu+AP9twPPvj/5IO/kz/YBX+w537wwf8nH/yd/MEu+IM994MP/j/54O/kD3bBH+y5H3zw/8kHfyd/sAv+YM/94IP/Tz74O/mDXfAHe+4HH/x/8sHfyR/sgj/Ycz/44P+TD/5O/mAX/MGe+8EH/5988HfyB7vgD/bcDz74/+SDv5M/2AV/sOd+8MH/Jx/8nfzBLviDPfeDD/4/+eDv5A92wR/suR988P/JB38nf7AL/mDP/eCD/08++Dv5g13wB3vuBx/8f/LB38kf7II/2HM/+OD/kw/+Tv5gF/zBnvvBB/+ffPB38ge74A/23A8++P/kg7+TP9gFf7Dn/vD/y/f39+zB/p+/+0d//eCD/08++Dv5g13wB3vuBx/8f/LB38kf7II/2HM/+OD/kw/+Tv5gF/zBnvvBB/+ffPB38ge74A/23A8++P/kg7+TP9gFf7Dn/vDBv/yDD/4/+eDv5A92wR/suR988P/JB38nf7AL/mDP/eCD/08++Dv5g13wB3vuBx/8f/LB38kf7II/2HM/+OD/kw/+Tv5gF/zBnvvBB/+ffPB38ge74A/23A8++P/kg7+TP9gFf7Dn/vDBv/yDD/4/+eDv5A92wR/suR988P/JB38nf7AL/mDP/eCD/08++Dv5g13wB3vuBx/8f/LB38kf7II/2HM/+OD/kw/+Tv5gF/zBnvvBB/+ffPB38ge74A/23A8++P/kg7+TP9gFf7Dn/vDBv/yDD/4/+eDv5A92wR/suR988P/JB38nf7AL/mDP/eCD/08++Dv5g13wB3vuBx/8f/LB38kf7II/2HM/+OD/kw/+Tv5gF/zBnvvBB/+ffPB38ge74A/23A8++P/kg7+TP9gFf7Dn/vDBv/yDD/4/+eDv5A92wR/suR988P/JB38nf7AL/mDP/eCD/08++Dv5g13wB3vuBx/8f/LB38kf7II/2HM/+OD/kw/+Tv5gF/zBnvvBB/+ffPB38ge74A/23A8++P/kg7+TP9gFf7DnfvDB/ycffPDXwQe74I/gD/46+GAX/BH8wV8HH+yCP4I/+Ovg7/X+8fsTfPD/yQd/J3+w6/9P/h/8wV8HH+yCP4I/+Ovg//EP/p38AfwBf/D7+YP7+fPnz69nd/878Affjx/8fv7g9/MHv58/+P3mD/4Ff/D7+QP+A9yQe6tqIe9gAAAAAElFTkSuQmCC";
    const apiKey = process.env.GEMINI_API_KEY;
    const servicoUpper = String(DESCRICAO_DEMANDA || "").toUpperCase();
    let TITULO_LAUDO_PROPOSTA = "LAUDO T\xC9CNICO DE CONFORMIDADE MEC\xC2NICA";
    if (servicoUpper.includes("PMOC") || servicoUpper.includes("CLIMATIZA\xC7\xC3O") || servicoUpper.includes("AR-CONDICIONADO")) {
      TITULO_LAUDO_PROPOSTA = "LAUDO T\xC9CNICO DE PMOC \u2022 PLANO DE MANUTEN\xC7\xC3O, OPERA\xC7\xC3O E CONTROLE";
    } else if (servicoUpper.includes("NR-12") || servicoUpper.includes("NR12") || servicoUpper.includes("M\xC1QUINA") || servicoUpper.includes("PRENSA")) {
      TITULO_LAUDO_PROPOSTA = "LAUDO T\xC9CNICO DE INSPE\xC7\xC3O NR-12 \u2022 SEGURAN\xC7A EM M\xC1QUINAS INDUSTRIAIS";
    } else if (servicoUpper.includes("NR-13") || servicoUpper.includes("NR13") || servicoUpper.includes("CALDEIRA") || servicoUpper.includes("COMPRESSOR") || servicoUpper.includes("VASO")) {
      TITULO_LAUDO_PROPOSTA = "LAUDO T\xC9CNICO DE INSPE\xC7\xC3O NR-13 \u2022 VASOS SOB PRESS\xC3O & CALDEIRAS";
    } else if (servicoUpper.includes("NR-11") || servicoUpper.includes("NR11") || servicoUpper.includes("PONTE ROLANTE") || servicoUpper.includes("EMPILHADEIRA") || servicoUpper.includes("I\xC7AMENTO")) {
      TITULO_LAUDO_PROPOSTA = "LAUDO T\xC9CNICO DE INSPE\xC7\xC3O NR-11 \u2022 TRANSPORTE & MOVIMENTA\xC7\xC3O DE CARGA";
    } else if (servicoUpper.includes("PLAYGROUND") || servicoUpper.includes("PARQUE") || servicoUpper.includes("BRINQUEDO")) {
      TITULO_LAUDO_PROPOSTA = "LAUDO T\xC9CNICO DE SEGURAN\xC7A DE PLAYGROUND \u2022 ABNT NBR 16071";
    } else if (servicoUpper.includes("PER\xCDCIA") || servicoUpper.includes("PERICIA") || servicoUpper.includes("ASSIST\xCANCIA")) {
      TITULO_LAUDO_PROPOSTA = "LAUDO PERICIAL DE ENGENHARIA MEC\xC2NICA DIAGN\xD3STICA";
    } else if (servicoUpper.includes("ESTRUTURAL") || servicoUpper.includes("MET\xC1LIC")) {
      TITULO_LAUDO_PROPOSTA = "LAUDO T\xC9CNICO ESTRUTURAL E MEMORIAL DE C\xC1LCULO";
    } else if (servicoUpper.startsWith("LAUDO")) {
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
          titulo: "PROPOSTA T\xC9CNICA COMERCIAL // OR\xC7AMENTO DE ENGENHARIA",
          subtitulo: TITULO_LAUDO_PROPOSTA,
          conteudoHtml: `<div class="space-y-4 text-xs">
            <p class="text-slate-700 text-xs sm:text-sm leading-relaxed">
              Presta\xE7\xE3o de servi\xE7os especializados em Engenharia Mec\xE2nica, diagn\xF3stico de integridade estrutural, verifica\xE7\xE3o de conformidade com as Normas Regulamentadoras federais (ABNT / Minist\xE9rio do Trabalho) e emiss\xE3o de Anota\xE7\xE3o de Responsabilidade T\xE9cnica (ART) oficial junto ao CREA-PE.
            </p>

            <div style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 1.5px solid #cbd5e1; border-radius: 14px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); overflow: hidden;" class="rounded-xl border border-slate-300 shadow-sm overflow-hidden">
              <div style="background: #0B1E3D; color: #ffffff; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #D4AF37;"></span>
                  <strong style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 800;">
                    DADOS DO CLIENTE CONTRATANTE & REFER\xCANCIA
                  </strong>
                </div>
                <span style="font-size: 10px; font-family: monospace; color: #93c5fd; font-weight: 700;">
                  ${PROP_CODIGO}
                </span>
              </div>

              <div style="padding: 14px 16px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px;" class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 10px;">
                  <span style="color: #64748b; font-size: 10px; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 2px;">Raz\xE3o Social / Cliente:</span>
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
                  <span style="color: #64748b; font-size: 10px; display: block;">C\xF3digo da Proposta</span>
                  <strong style="color: #0b1e3d; font-family: monospace;">${PROP_CODIGO}</strong>
                </div>
                <div>
                  <span style="color: #64748b; font-size: 10px; display: block;">Validade da Proposta</span>
                  <strong style="color: #1e3a8a;">${VALIDADE_DIAS} dias corridos</strong>
                </div>
                <div>
                  <span style="color: #64748b; font-size: 10px; display: block;">Prazo de Conclus\xE3o</span>
                  <strong style="color: #047857;">${PRAZO_ENTREGA}</strong>
                </div>
              </div>
            </div>
          </div>`
        },
        {
          numero: 2,
          titulo: "APRESENTA\xC7\xC3O INSTITUCIONAL E CREDENCIAIS T\xC9CNICAS",
          conteudoHtml: `<div class="space-y-4">
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 rounded-xl border border-slate-200 bg-slate-50/80">
              <div class="shrink-0 text-center">
                <img src="/vitor-leonardo.png" alt="Eng. Vitor Leonardo Cordeiro Linhares" class="w-32 h-36 object-cover rounded-lg shadow-sm border border-slate-300 mx-auto" />
                <span class="inline-block mt-2 px-2 py-0.5 rounded bg-[#0B1E3D] text-white text-[10px] font-bold tracking-wider uppercase">CREA-PE 182229949-0</span>
              </div>
              <div class="space-y-2 text-left">
                <h3 class="text-base font-black text-[#0B1E3D]">Eng. Vitor Leonardo Cordeiro Linhares</h3>
                <p class="text-xs font-bold text-[#1565D8] tracking-wide uppercase">Engenheiro Mec\xE2nico \u2022 Perito T\xE9cnico & Consultor</p>
                <p class="text-slate-700 text-xs leading-relaxed">
                  Profissional com registro ativo no Conselho Regional de Engenharia e Agronomia de Pernambuco (CREA-PE). Especialista em engenharia diagn\xF3stica, laudos periciais mec\xE2nicos, adequa\xE7\xE3o a Normas Regulamentadoras (NR-11, NR-12, NR-13), projetos de climatiza\xE7\xE3o (PMOC), combate a inc\xEAndio e ensaios n\xE3o destrutivos.
                </p>
                <div class="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600 font-medium">
                  <div class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>Emiss\xE3o Oficial de ART</div>
                  <div class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>Engenharia Diagn\xF3stica</div>
                  <div class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>Conformidade ABNT / NRs</div>
                  <div class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>Respaldo Jur\xEDdico-Pericial</div>
                </div>
              </div>
            </div>

            <blockquote class="p-3 border-l-4 border-[#0B1E3D] bg-slate-50 italic text-slate-800 text-xs font-medium">
              "Contribuir para um ambiente operacional mais seguro, eficiente e juridicamente protegido, combinando rigor t\xE9cnico com agilidade e \xE9tica profissional."
            </blockquote>
            <p class="text-slate-700 text-xs leading-relaxed">
              Sob a lideran\xE7a do Eng. Vitor Leonardo, aliamos s\xF3lida base t\xE9cnica \xE0s mais modernas metodologias de inspe\xE7\xE3o e auditoria diagn\xF3stica, garantindo aos nossos clientes total conformidade perante os \xF3rg\xE3os de fiscaliza\xE7\xE3o (Minist\xE9rio do Trabalho, CBMPE e CREA).
            </p>
          </div>`
        },
        {
          numero: 3,
          titulo: "NOSSOS PRINC\xCDPIOS FUNDAMENTAIS",
          conteudoHtml: `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-lg border border-slate-200 bg-white">
              <h4 class="font-bold text-[#0B1E3D] text-sm mb-1">1. CONFIAN\xC7A NA ENTREGA</h4>
              <p class="text-xs text-slate-600 leading-relaxed">Compromisso inabal\xE1vel com a precis\xE3o dos prazos acordados. Nossos laudos t\xE9cnicos s\xE3o entregues de forma \xE1gil para viabilizar as metas operacionais do cliente.</p>
            </div>
            <div class="p-4 rounded-lg border border-slate-200 bg-white">
              <h4 class="font-bold text-[#0B1E3D] text-sm mb-1">2. \xC9TICA NO SERVI\xC7O</h4>
              <p class="text-xs text-slate-600 leading-relaxed">Transpar\xEAncia total em nossas avalia\xE7\xF5es f\xEDsicas. Fornecemos pareceres periciais justos, respaldados estritamente na verdade t\xE9cnica e na legisla\xE7\xE3o federal.</p>
            </div>
            <div class="p-4 rounded-lg border border-slate-200 bg-white">
              <h4 class="font-bold text-[#0B1E3D] text-sm mb-1">3. SATISFA\xC7\xC3O DO CLIENTE</h4>
              <p class="text-xs text-slate-600 leading-relaxed">Entendemos o neg\xF3cio do cliente. Focamos em simplificar procedimentos complexos de adequa\xE7\xE3o, transformando as exig\xEAncias fiscais em melhorias operacionais reais.</p>
            </div>
            <div class="p-4 rounded-lg border border-slate-200 bg-white">
              <h4 class="font-bold text-[#0B1E3D] text-sm mb-1">4. RELACIONAMENTO DURADOURO</h4>
              <p class="text-xs text-slate-600 leading-relaxed">Mais do que um fornecedor, somos parceiros de engenharia do seu neg\xF3cio. Oferecemos suporte consultivo cont\xEDnuo p\xF3s-entrega de laudos e la\xE7o corporativo de longo prazo.</p>
            </div>
          </div>`
        },
        {
          numero: 4,
          titulo: "O QUE ENTREGAMOS",
          conteudoHtml: `<div class="space-y-3">
            <div class="p-3 bg-slate-50 rounded border border-slate-200">
              <strong class="text-[#0B1E3D] block text-sm">AMBIENTE MAIS SEGURO:</strong>
              <span class="text-xs text-slate-600">Garantia t\xE9cnica de seguran\xE7a contra acidentes operacionais, reduzindo drasticamente riscos \xE0 vida e \xE0 integridade dos funcion\xE1rios.</span>
            </div>
            <div class="p-3 bg-slate-50 rounded border border-slate-200">
              <strong class="text-[#0B1E3D] block text-sm">SOLU\xC7\xC3O CUSTO X BENEF\xCDCIO:</strong>
              <span class="text-xs text-slate-600">Otimiza\xE7\xE3o de custos de adequa\xE7\xE3o. Projetamos e indicamos solu\xE7\xF5es financeiramente vi\xE1veis que n\xE3o prejudicam a produtividade.</span>
            </div>
            <div class="p-3 bg-slate-50 rounded border border-slate-200">
              <strong class="text-[#0B1E3D] block text-sm">RESPALDO T\xC9CNICO DE EXCEL\xCANCIA:</strong>
              <span class="text-xs text-slate-600">Emiss\xE3o de Anota\xE7\xF5es de Responsabilidade T\xE9cnica (ART) registradas no CREA-PE para plena prote\xE7\xE3o jur\xEDdica perante \xF3rg\xE3os fiscalizadores.</span>
            </div>
            <div class="p-3 bg-slate-50 rounded border border-slate-200">
              <strong class="text-[#0B1E3D] block text-sm">QUALIDADE E CONFIAN\xC7A:</strong>
              <span class="text-xs text-slate-600">Relat\xF3rios anal\xEDticos fotogr\xE1ficos minuciosos, ensaios estruturais n\xE3o destrutivos avan\xE7ados e rastreabilidade total de dados t\xE9cnicos.</span>
            </div>
          </div>`
        },
        {
          numero: 5,
          titulo: "PROBLEMAS QUE AJUDAMOS A RESOLVER",
          conteudoHtml: `<div class="space-y-2.5">
            <div class="p-3 rounded border border-slate-200 bg-white">
              <span class="font-bold text-xs text-red-700 block">1. Acidentes Operacionais:</span>
              <p class="text-xs text-slate-600">Identifica\xE7\xE3o proativa de falhas de fadiga met\xE1lica ou dimensionamento antes de causar danos f\xEDsicos.</p>
            </div>
            <div class="p-3 rounded border border-slate-200 bg-white">
              <span class="font-bold text-xs text-amber-700 block">2. Retrabalho no Servi\xE7o:</span>
              <p class="text-xs text-slate-600">Orienta\xE7\xE3o t\xE9cnica clara, eliminando a contrata\xE7\xE3o de adequa\xE7\xF5es incorretas e retrabalhos caros.</p>
            </div>
            <div class="p-3 rounded border border-slate-200 bg-white">
              <span class="font-bold text-xs text-blue-700 block">3. Complexidade nas Adequa\xE7\xF5es:</span>
              <p class="text-xs text-slate-600">Traduzimos as exig\xEAncias regulat\xF3rias das NRs (NR-12, NR-13, NR-11) e normas ABNT/CONTRAN para um plano operacional simplificado.</p>
            </div>
            <div class="p-3 rounded border border-slate-200 bg-white">
              <span class="font-bold text-xs text-purple-700 block">4. N\xE3o Conformidade com as Normas:</span>
              <p class="text-xs text-slate-600">Prote\xE7\xE3o jur\xEDdica contra multas do Minist\xE9rio do Trabalho, interdi\xE7\xF5es de p\xE1tio industrial ou embargos prediais.</p>
            </div>
            <div class="p-3 rounded border border-slate-200 bg-white">
              <span class="font-bold text-xs text-emerald-700 block">5. Alto Custo:</span>
              <p class="text-xs text-slate-600">Evitamos multas, paralisa\xE7\xF5es, interdi\xE7\xF5es civis e perdas judiciais que poderiam custar fortunas \xE0s empresas.</p>
            </div>
          </div>`
        },
        {
          numero: 6,
          titulo: "RESUMO DE NOSSOS SERVI\xC7OS DE ENGENHARIA",
          subtitulo: "CAT\xC1LOGO DE LAUDOS E ADEQUA\xC7\xD5ES INDUSTRIAIS",
          conteudoHtml: `<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px;" class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 1.5px solid #bfdbfe; border-radius: 12px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); position: relative;" class="p-3 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-blue-200 shadow-xs relative">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background-color: #dbeafe; color: #1d4ed8; font-weight: 800; font-size: 11px; font-family: monospace;">12</span>
                <div>
                  <strong style="color: #0b1e3d; font-size: 12px; font-weight: 900; display: block;">NR-12 \u2022 M\xC1QUINAS INDUSTRIAIS</strong>
                  <span style="color: #2563eb; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Aprecia\xE7\xE3o de Risco & Laudo</span>
                </div>
              </div>
              <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0;">
                Aprecia\xE7\xE3o de riscos (HRN/SIL), invent\xE1rio t\xE9cnico, laudos periciais de conformidade mec\xE2nica de prensas, tornos, esteiras e c\xE9lulas robotizadas.
              </p>
            </div>

            <div style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 1.5px solid #fde68a; border-radius: 12px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); position: relative;" class="p-3 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-amber-200 shadow-xs relative">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background-color: #fef3c7; color: #92400e; font-weight: 800; font-size: 11px; font-family: monospace;">11</span>
                <div>
                  <strong style="color: #0b1e3d; font-size: 12px; font-weight: 900; display: block;">NR-11 \u2022 CARGAS E ELEVA\xC7\xC3O</strong>
                  <span style="color: #b45309; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Movimenta\xE7\xE3o & Ensaios</span>
                </div>
              </div>
              <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0;">
                Inspe\xE7\xE3o e laudos de pontes rolantes, guindastes, empilhadeiras, p\xF3rticos, ensaios n\xE3o destrutivos (END) e testes de tra\xE7\xE3o em cabos e olhais.
              </p>
            </div>

            <div style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 1.5px solid #c7d2fe; border-radius: 12px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); position: relative;" class="p-3 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-indigo-200 shadow-xs relative">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background-color: #e0e7ff; color: #4338ca; font-weight: 800; font-size: 11px; font-family: monospace;">13</span>
                <div>
                  <strong style="color: #0b1e3d; font-size: 12px; font-weight: 900; display: block;">NR-13 \u2022 VASOS & CALDEIRAS</strong>
                  <span style="color: #4f46e5; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Press\xE3o & Prontu\xE1rios</span>
                </div>
              </div>
              <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0;">
                Inspe\xE7\xE3o de compressores e vasos sob press\xE3o, teste hidrost\xE1tico, medi\xE7\xE3o de espessura por ultrassom, calibra\xE7\xE3o de PSV e reconstitui\xE7\xE3o de prontu\xE1rio.
              </p>
            </div>

            <div style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 1.5px solid #a7f3d0; border-radius: 12px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); position: relative;" class="p-3 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-emerald-200 shadow-xs relative">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background-color: #d1fae5; color: #065f46; font-weight: 800; font-size: 11px; font-family: monospace;">AC</span>
                <div>
                  <strong style="color: #0b1e3d; font-size: 12px; font-weight: 900; display: block;">PMOC \u2022 CLIMATIZA\xC7\xC3O</strong>
                  <span style="color: #047857; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Lei 13.589/2018 & ANVISA</span>
                </div>
              </div>
              <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0;">
                Plano de Manuten\xE7\xE3o Opera\xE7\xE3o e Controle para qualidade do ar interior, efici\xEAncia energ\xE9tica e total conformidade com a vigil\xE2ncia sanit\xE1ria.
              </p>
            </div>

            <div style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 1.5px solid #fecdd3; border-radius: 12px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); position: relative;" class="p-3 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-rose-200 shadow-xs relative">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background-color: #ffe4e6; color: #be123c; font-weight: 800; font-size: 11px; font-family: monospace;">PJ</span>
                <div>
                  <strong style="color: #0b1e3d; font-size: 12px; font-weight: 900; display: block;">PER\xCDCIAS & ASSIST\xCANCIA T\xC9CNICA</strong>
                  <span style="color: #e11d48; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Engenharia Diagn\xF3stica Legal</span>
                </div>
              </div>
              <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0;">
                Investiga\xE7\xE3o pericial de acidentes mec\xE2nicos, vistorias cautelares de vizinhan\xE7a industrial, elabora\xE7\xE3o de quesitos e laudos judiciais conclusivos.
              </p>
            </div>

            <div style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 1.5px solid #e9d5ff; border-radius: 12px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); position: relative;" class="p-3 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-purple-200 shadow-xs relative">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background-color: #f3e8ff; color: #6b21a8; font-weight: 800; font-size: 11px; font-family: monospace;">ART</span>
                <div>
                  <strong style="color: #0b1e3d; font-size: 12px; font-weight: 900; display: block;">PROJETOS & ADEQUA\xC7\xD5ES</strong>
                  <span style="color: #7e22ce; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Solu\xE7\xF5es Mec\xE2nicas Integradas</span>
                </div>
              </div>
              <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0;">
                Dimensionamento de prote\xE7\xF5es f\xEDsicas, c\xE1lculo de estruturas met\xE1licas, dispositivos mec\xE2nicos de seguran\xE7a, linhas de vida e esteiras industriais com ART.
              </p>
            </div>
          </div>`
        },
        {
          numero: 7,
          titulo: "IDENTIFICA\xC7\xC3O DAS PARTES & DEMANDA",
          conteudoHtml: `<div class="overflow-x-auto">
            <table class="w-full text-xs text-left border-collapse border border-slate-300">
              <thead>
                <tr class="bg-[#0B1E3D] text-white">
                  <th class="p-2.5 border border-slate-300">INFORMA\xC7\xD5ES DA PROVEDORA</th>
                  <th class="p-2.5 border border-slate-300">INFORMA\xC7\xD5ES DO CLIENTE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="p-2.5 border border-slate-300 align-top space-y-1">
                    <p><strong>Raz\xE3o Social:</strong> VL ENGENHARIA MEC\xC2NICA</p>
                    <p><strong>Eng. Respons\xE1vel:</strong> Vitor Leonardo C. Linhares</p>
                    <p><strong>CREA-PE:</strong> 182229949-0</p>
                    <p><strong>Sede:</strong> Recife / Paulista - PE</p>
                    <p><strong>E-mail:</strong> atendimento@vlengenhariamecanica.com.br</p>
                    <p><strong>Telefone / WhatsApp:</strong> (81) 98444-2592</p>
                  </td>
                  <td class="p-2.5 border border-slate-300 align-top space-y-1">
                    <p><strong>Raz\xE3o Social:</strong> ${NOME_CLIENTE_RAZAO_SOCIAL}</p>
                    <p><strong>CNPJ/CPF:</strong> ${CNPJ_CLIENTE}</p>
                    <p><strong>Contato:</strong> ${REPRESENTANTE_NOME}</p>
                    <p><strong>E-mail:</strong> ${EMAIL_CLIENTE}</p>
                    <p><strong>Telefone:</strong> ${TELEFONE_CLIENTE}</p>
                    <p><strong>Localidade:</strong> ${LOCALIDADE_SERVICO}</p>
                  </td>
                </tr>
                <tr class="bg-slate-50 font-medium">
                  <td colspan="2" class="p-2.5 border border-slate-300">
                    <strong>DETALHES DA PROPOSTA:</strong> Proposta n\xBA ${PROP_CODIGO} | Data: ${DATA_EMISSAO} | Demanda: ${DESCRICAO_DEMANDA}
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
              Nossos laudos, pareceres e vistorias s\xE3o elaborados, assinados e homologados exclusivamente por Engenheiros Mec\xE2nicos habilitados com registro regular ativo no CREA-PE. Garantimos a plena responsabilidade t\xE9cnica (ART) sobre cada equipamento avaliado.
            </p>
            <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 class="font-bold text-[#0B1E3D] text-sm mb-2">Estrutura da Proposta em 3 Etapas:</h4>
              <ul class="space-y-2 list-disc list-inside text-slate-700">
                <li><strong>Etapa 1: Rela\xE7\xE3o/Descri\xE7\xE3o dos Servi\xE7os</strong> \u2014 Normas t\xE9cnicas associadas e levantamento fotogr\xE1fico detalhado.</li>
                <li><strong>Etapa 2: Escopo dos Servi\xE7os / Metodologia</strong> \u2014 Rotinas t\xE9cnicas de inspe\xE7\xE3o, checklists in loco e elabora\xE7\xE3o de dossi\xEA conclusivo.</li>
                <li><strong>Etapa 3: Prazo, Forma de Pagamento e Valores</strong> \u2014 Condi\xE7\xF5es comerciais, cronograma financeiro e entrega homologada com ART.</li>
              </ul>
            </div>
          </div>`
        },
        {
          numero: 9,
          titulo: "ETAPA 1 - RELA\xC7\xC3O DOS SERVI\xC7OS & LEVANTAMENTO FOTOGR\xC1FICO",
          conteudoHtml: `<div class="space-y-4 text-xs">
            <div class="p-3 bg-slate-50 rounded border border-slate-200">
              <p><strong>Servi\xE7o Contratado:</strong> ${DESCRICAO_DEMANDA}</p>
              <p><strong>Normas T\xE9cnicas Associadas:</strong> ${NORMAS_TECNICAS}</p>
            </div>
            <div class="p-4 border-2 border-dashed border-slate-300 rounded-lg text-center bg-slate-50/50">
              <p class="font-semibold text-slate-700 mb-1">Bloco para Levantamento Fotogr\xE1fico Preliminar</p>
              <p class="text-slate-500 text-[11px]">${FOTOS_DESCRICAO_OU_PATHS}</p>
              <p class="text-slate-400 text-[10px] mt-2">(Imagens de campo coletadas durante a vistoria inicial e integradas ao laudo pericial final)</p>
            </div>
          </div>`
        },
        {
          numero: 10,
          titulo: "ETAPA 2 - ESCOPO T\xC9CNICO DAS ATIVIDADES (METODOLOGIA)",
          subtitulo: "FASES, CHECKLISTS E ENSAIOS EM 4 ETAPAS",
          conteudoHtml: `<div class="space-y-3.5 text-xs">
            <div style="background: #0B1E3D; color: #ffffff; padding: 10px 14px; border-radius: 10px; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 6px; background: #1565D8; font-weight: 900; font-size: 11px;">M</span>
                <div>
                  <strong style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; display: block;">Metodologia de Engenharia em 5 Fases Sequenciais</strong>
                  <span style="font-size: 9px; color: #93c5fd;">Inspe\xE7\xE3o in loco, checklists normativos, instrumenta\xE7\xE3o, laudo e homologa\xE7\xE3o legal CREA-PE</span>
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
                    <strong style="color: #0b1e3d; font-size: 12px; font-weight: 800;">Inspe\xE7\xE3o Visual In Loco & Diagn\xF3stico Preliminar</strong>
                  </div>
                  <span style="font-size: 10px; color: #1d4ed8; font-weight: 700; background: #eff6ff; padding: 2px 6px; border-radius: 4px;">Vistoria de Campo</span>
                </div>
                <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0 0 6px 0;">
                  Vistoria presencial minuciosa do ativo para mapeamento visual de n\xE3o-conformidades de seguran\xE7a, desgastes mec\xE2nicos, corros\xE3o, fixa\xE7\xF5es e an\xE1lise f\xEDsica do ambiente fabril/operacional.
                </p>
                <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: #0284c7; font-weight: 600;">
                  <span>\u2713 Entreg\xE1vel:</span> <span style="color: #334155;">Levantamento fotogr\xE1fico em alta resolu\xE7\xE3o e registro de evid\xEAncias f\xE1ticas.</span>
                </div>
              </div>

              <div style="background: #ffffff; border: 1.5px solid #fde68a; border-left: 5px solid #d97706; border-radius: 10px; padding: 10px 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="background: #fef3c7; color: #92400e; font-weight: 900; font-size: 10px; padding: 2px 8px; border-radius: 4px; font-family: monospace;">FASE 02</span>
                    <strong style="color: #0b1e3d; font-size: 12px; font-weight: 800;">Aplica\xE7\xE3o de Checklists Normativos T\xE9cnicos</strong>
                  </div>
                  <span style="font-size: 10px; color: #b45309; font-weight: 700; background: #fffbeb; padding: 2px 6px; border-radius: 4px;">Conformidade Legal</span>
                </div>
                <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0 0 6px 0;">
                  Auditoria item por item das exig\xEAncias regulamentadoras vigentes (${NORMAS_TECNICAS}), analisando prote\xE7\xF5es mec\xE2nicas, dist\xE2ncias de seguran\xE7a (ABNT NBR ISO 13857/13855), enclausuramentos e intertravamentos el\xE9tricos.
                </p>
                <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: #b45309; font-weight: 600;">
                  <span>\u2713 Entreg\xE1vel:</span> <span style="color: #334155;">Relat\xF3rio de conformidade item a item conforme normas ABNT e NRs federais.</span>
                </div>
              </div>

              <div style="background: #ffffff; border: 1.5px solid #c7d2fe; border-left: 5px solid #4f46e5; border-radius: 10px; padding: 10px 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="background: #e0e7ff; color: #4338ca; font-weight: 900; font-size: 10px; padding: 2px 8px; border-radius: 4px; font-family: monospace;">FASE 03</span>
                    <strong style="color: #0b1e3d; font-size: 12px; font-weight: 800;">Ensaios F\xEDsicos, Medi\xE7\xF5es e Testes Funcionais</strong>
                  </div>
                  <span style="font-size: 10px; color: #4f46e5; font-weight: 700; background: #eef2ff; padding: 2px 6px; border-radius: 4px;">Instrumentado</span>
                </div>
                <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0 0 6px 0;">
                  Ensaios n\xE3o destrutivos cab\xEDveis (ultrassom, l\xEDquidos penetrantes), testes funcionais de paradas de emerg\xEAncia, medi\xE7\xE3o de espessura de chapas, verifica\xE7\xE3o de folgas mec\xE2nicas e calibra\xE7\xE3o de salvaguardas.
                </p>
                <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: #4f46e5; font-weight: 600;">
                  <span>\u2713 Entreg\xE1vel:</span> <span style="color: #334155;">Planilha de grandezas medidas com instrumentos calibrados e rastre\xE1veis RBC/Inmetro.</span>
                </div>
              </div>

              <div style="background: #ffffff; border: 1.5px solid #a7f3d0; border-left: 5px solid #059669; border-radius: 10px; padding: 10px 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="background: #d1fae5; color: #065f46; font-weight: 900; font-size: 10px; padding: 2px 8px; border-radius: 4px; font-family: monospace;">FASE 04</span>
                    <strong style="color: #0b1e3d; font-size: 12px; font-weight: 800;">Dossi\xEA T\xE9cnico, Matriz de Risco & Parecer Conclusivo</strong>
                  </div>
                  <span style="font-size: 10px; color: #059669; font-weight: 700; background: #ecfdf5; padding: 2px 6px; border-radius: 4px;">Engenharia Diagn\xF3stica</span>
                </div>
                <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0 0 6px 0;">
                  Elabora\xE7\xE3o de laudo pericial detalhado contendo an\xE1lise de risco quantitativa (HRN/SIL), memorial t\xE9cnico descritivo, plano de a\xE7\xE3o corretivo claro e cronograma priorit\xE1rio de adequa\xE7\xF5es f\xEDsicas.
                </p>
                <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: #059669; font-weight: 600;">
                  <span>\u2713 Entreg\xE1vel:</span> <span style="color: #334155;">Laudo Pericial Conclusivo digital em PDF com assinatura eletr\xF4nica e certificado digital.</span>
                </div>
              </div>

              <div style="background: #ffffff; border: 1.5px solid #e9d5ff; border-left: 5px solid #7c3aed; border-radius: 10px; padding: 10px 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="background: #f3e8ff; color: #6b21a8; font-weight: 900; font-size: 10px; padding: 2px 8px; border-radius: 4px; font-family: monospace;">FASE 05</span>
                    <strong style="color: #0b1e3d; font-size: 12px; font-weight: 800;">Emiss\xE3o e Registro Oficial da ART CREA-PE</strong>
                  </div>
                  <span style="font-size: 10px; color: #7c3aed; font-weight: 700; background: #faf5ff; padding: 2px 6px; border-radius: 4px;">Homologa\xE7\xE3o Legal</span>
                </div>
                <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0 0 6px 0;">
                  Anota\xE7\xE3o de Responsabilidade T\xE9cnica emitida eletronicamente junto ao CREA-PE, conferindo f\xE9 p\xFAblica, respaldo institucional e plena validade jur\xEDdica perante fiscaliza\xE7\xF5es do Minist\xE9rio do Trabalho, CBMPE e seguradoras.
                </p>
                <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: #7c3aed; font-weight: 600;">
                  <span>\u2713 Entreg\xE1vel:</span> <span style="color: #334155;">Certid\xE3o oficial de ART quitada com chave de autenticidade e QR code do CREA-PE.</span>
                </div>
              </div>
            </div>
          </div>`
        },
        {
          numero: 11,
          titulo: "INFORMA\xC7\xD5ES T\xC9CNICAS OPERACIONAIS & DIRETRIZES",
          conteudoHtml: `<div class="space-y-4 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded border border-slate-200 font-medium">
              <div><strong>Ativos / M\xE1quinas:</strong> ${QTD_EQUIPAMENTOS}</div>
              <div><strong>Tempo de Engenharia:</strong> ${HORAS_ENGENHARIA}</div>
              <div><strong>Mobiliza\xE7\xE3o:</strong> ${MOBILIZACAO}</div>
            </div>
            <div>
              <h4 class="font-bold text-[#0B1E3D] text-xs mb-2">Diretrizes e Obriga\xE7\xF5es do Cliente:</h4>
              <ul class="space-y-1.5 list-disc list-inside text-slate-700">
                <li>Acesso livre e desimpedido \xE0s m\xE1quinas/ve\xEDculos e instala\xE7\xF5es objeto de vistoria t\xE9cnica.</li>
                <li>Presen\xE7a de operador qualificado ou t\xE9cnico de manuten\xE7\xE3o para acionamento mec\xE2nico teste.</li>
                <li>Envio de documenta\xE7\xE3o de hist\xF3rico pr\xE9vio, manuais de fabrica\xE7\xE3o ou plantas caso existentes.</li>
                <li>Libera\xE7\xE3o de seguran\xE7a interna do p\xE1tio operacional (EPIs especiais se exigido).</li>
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
                  INVESTIMENTO COMERCIAL L\xCDQUIDO
                </span>
                <div style="font-size: 32px; line-height: 1.1; font-weight: 900; font-family: monospace; letter-spacing: -0.5px; color: #ffffff; margin: 6px 0;">
                  ${VALOR_INVESTIMENTO}
                </div>
                <p style="color: #e2e8f0; font-size: 11px; max-width: 500px; margin: 0; line-height: 1.4;">
                  ${comNotaFiscal ? "Valor l\xEDquido para presta\xE7\xE3o de servi\xE7os de engenharia com emiss\xE3o de Nota Fiscal (NFS-e) e taxa de ART inclusa." : "Valor l\xEDquido para presta\xE7\xE3o de servi\xE7os t\xE9cnicos de engenharia com Recibo de Presta\xE7\xE3o Aut\xF4noma e taxa de ART inclusa."}
                </p>
                <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 10px;">
                  <span style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); padding: 3px 10px; border-radius: 6px; font-size: 10px; font-weight: 700;">
                    \u2713 Taxa ART CREA-PE Inclusa
                  </span>
                  <span style="background: ${comNotaFiscal ? "rgba(34, 197, 94, 0.25)" : "rgba(255, 255, 255, 0.15)"}; border: 1px solid ${comNotaFiscal ? "#86efac" : "rgba(255,255,255,0.2)"}; padding: 3px 10px; border-radius: 6px; font-size: 10px; font-weight: 700; color: ${comNotaFiscal ? "#f0fdf4" : "#ffffff"};">
                    ${comNotaFiscal ? "\u2713 Nota Fiscal de Servi\xE7os (NFS-e)" : "\u2022 Faturamento via Recibo (Sem NFS-e)"}
                  </span>
                  <span style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); padding: 3px 10px; border-radius: 6px; font-size: 10px; font-weight: 700;">
                    \u2713 Deslocamento e Laudo Completo
                  </span>
                </div>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px;">
              <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-top: 4px solid #1565D8; border-radius: 10px; padding: 10px 12px; text-align: center;">
                <span style="color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 3px;">
                  \u23F1\uFE0F PRAZO DE EXECU\xC7\xC3O
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
                  \u{1F4B3} CONDI\xC7\xD5ES DE PAGAMENTO
                </span>
                <strong style="color: #065f46; font-size: 12px; font-weight: 800; display: block; margin-bottom: 2px;">
                  ${CONDICOES_PAGAMENTO}
                </strong>
                <span style="color: #64748b; font-size: 10px; line-height: 1.3; display: block;">
                  PIX, transfer\xEAncia ou boleto banc\xE1rio.
                </span>
              </div>

              <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-top: 4px solid #d97706; border-radius: 10px; padding: 10px 12px; text-align: center;">
                <span style="color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 3px;">
                  \u{1F4C5} VALIDADE DA PROPOSTA
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
                    Aponte a c\xE2mera do aplicativo do seu banco para o QR Code acima para efetuar o pagamento imediato.
                  </p>
                </div>
              </div>

            </div>

            <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; padding-top: 8px; border-top: 1px solid #e2e8f0;">
              <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 12px; text-align: center;">
                <p style="color: #0b1e3d; font-weight: 800; font-size: 11px; margin: 0 0 2px 0;">VL ENGENHARIA MEC\xC2NICA</p>
                <p style="color: #1565d8; font-weight: 700; font-size: 10px; margin: 0 0 2px 0;">Eng. Vitor Leonardo Cordeiro Linhares</p>
                <p style="color: #64748b; font-size: 9px; font-family: monospace; margin: 0 0 8px 0;">CREA-PE: 182229949-0 \u2022 Respons\xE1vel T\xE9cnico</p>
                <span style="display: inline-block; background: #ecfdf5; border: 1px solid #a7f3d0; color: #059669; padding: 3px 10px; border-radius: 6px; font-size: 9px; font-weight: 800;">
                  \u2713 Assinado Digitalmente pelo Emissor
                </span>
              </div>

              <div style="background: #ffffff; border: 1.5px dashed #cbd5e1; border-radius: 10px; padding: 12px; text-align: center;">
                <p style="color: #0b1e3d; font-weight: 800; font-size: 11px; margin: 0 0 2px 0;">${NOME_CLIENTE_RAZAO_SOCIAL}</p>
                <p style="color: #475569; font-weight: 600; font-size: 10px; margin: 0 0 2px 0;">${REPRESENTANTE_NOME}</p>
                <p style="color: #64748b; font-size: 9px; margin: 0 0 8px 0;">De Acordo / Representante Autorizado do Contratante</p>
                <span style="display: inline-block; background: #fffbeb; border: 1px solid #fde68a; color: #b45309; padding: 3px 10px; border-radius: 6px; font-size: 9px; font-weight: 800;">
                  [Aceite Eletr\xF4nico / Assinatura Digital]
                </span>
              </div>
            </div>
          </div>`
        },
        {
          numero: 13,
          titulo: "AGRADECIMENTO & CONTATO",
          subtitulo: "INFORMA\xC7\xD5ES INSTITUCIONAIS E ATENDIMENTO DIRETO",
          conteudoHtml: `<div class="space-y-4 text-xs">
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 16px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.03);">
              <div style="display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; background: #0B1E3D; color: #ffffff; margin-bottom: 8px;">
                <span style="font-size: 16px;">\u{1F91D}</span>
              </div>
              <h3 style="color: #0B1E3D; font-size: 14px; font-weight: 900; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                Agradecimento & Parceria T\xE9cnica de Confian\xE7a
              </h3>
              <p style="color: #475569; font-size: 11px; line-height: 1.55; max-width: 520px; margin: 0 auto;">
                A <strong>VL Engenharia Mec\xE2nica</strong> agradece a oportunidade de apresentar esta Proposta T\xE9cnico-Comercial. Colocamo-nos \xE0 inteira disposi\xE7\xE3o para qualquer alinhamento t\xE9cnico, esclarecimento de d\xFAvidas e pronto in\xEDcio das atividades operacionais.
              </p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px;">
              <div style="background: #ffffff; border: 1.5px solid #86efac; border-left: 4px solid #16a34a; border-radius: 10px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                  <span style="background: #dcfce7; color: #15803d; font-size: 13px; width: 24px; height: 24px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center;">\u{1F4DE}</span>
                  <div>
                    <strong style="color: #0b1e3d; font-size: 11px; display: block;">Telefone & WhatsApp Direto</strong>
                    <span style="color: #15803d; font-size: 9px; font-weight: 700; text-transform: uppercase;">Atendimento R\xE1pido</span>
                  </div>
                </div>
                <p style="color: #15803d; font-size: 12px; font-weight: 800; font-family: monospace; margin: 4px 0 2px 0;">
                  (81) 98444-2592
                </p>
                <span style="color: #64748b; font-size: 10px;">Segunda a Sexta, das 08h \xE0s 18h. Plant\xE3o pericial.</span>
              </div>

              <div style="background: #ffffff; border: 1.5px solid #93c5fd; border-left: 4px solid #1565d8; border-radius: 10px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                  <span style="background: #dbeafe; color: #1e40af; font-size: 13px; width: 24px; height: 24px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center;">\u2709\uFE0F</span>
                  <div>
                    <strong style="color: #0b1e3d; font-size: 11px; display: block;">E-mail Comercial Oficial</strong>
                    <span style="color: #1565d8; font-size: 9px; font-weight: 700; text-transform: uppercase;">Envio de Documentos</span>
                  </div>
                </div>
                <p style="color: #1565d8; font-size: 11px; font-weight: 800; font-family: monospace; margin: 4px 0 2px 0; word-break: break-all;">
                  atendimento@vlengenhariamecanica.com.br
                </p>
                <span style="color: #64748b; font-size: 10px;">Canal direto com o Engenheiro Mec\xE2nico Respons\xE1vel.</span>
              </div>

              <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-left: 4px solid #0B1E3D; border-radius: 10px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                  <span style="background: #e2e8f0; color: #0b1e3d; font-size: 13px; width: 24px; height: 24px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center;">\u{1F3E2}</span>
                  <div>
                    <strong style="color: #0b1e3d; font-size: 11px; display: block;">Sede Operacional & Atendimento</strong>
                    <span style="color: #64748b; font-size: 9px; font-weight: 700; text-transform: uppercase;">Pernambuco / Nordeste</span>
                  </div>
                </div>
                <p style="color: #0B1E3D; font-size: 11px; font-weight: 700; margin: 4px 0 2px 0;">
                  Recife / Regi\xE3o Metropolitana - PE
                </p>
                <span style="color: #64748b; font-size: 10px;">Atendimento in loco em ind\xFAstrias, polos e condom\xEDnios.</span>
              </div>

              <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-left: 4px solid #0B1E3D; border-radius: 10px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                  <span style="background: #e2e8f0; color: #0b1e3d; font-size: 13px; width: 24px; height: 24px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center;">\u{1F6E1}\uFE0F</span>
                  <div>
                    <strong style="color: #0b1e3d; font-size: 11px; display: block;">Responsabilidade T\xE9cnica CREA-PE</strong>
                    <span style="color: #0b1e3d; font-size: 9px; font-weight: 700; text-transform: uppercase;">Registro Ativo Regular</span>
                  </div>
                </div>
                <p style="color: #0B1E3D; font-size: 12px; font-weight: 800; font-family: monospace; margin: 4px 0 2px 0;">
                  CREA-PE: 182229949-0
                </p>
                <span style="color: #64748b; font-size: 10px;">Eng. Mec\xE2nico Vitor Leonardo Cordeiro Linhares.</span>
              </div>
            </div>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px 12px; display: flex; align-items: center; justify-content: space-around; text-align: center; font-size: 10px; color: #475569;">
              <div><strong>\u{1F512} Sigilo e Confidencialidade</strong> (LGPD)</div>
              <div>\u2022</div>
              <div><strong>\u2696\uFE0F Emiss\xE3o de ART Oficial</strong> (CREA-PE)</div>
              <div>\u2022</div>
              <div><strong>\u{1F4D0} Conformidade ABNT / NRs</strong></div>
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
        limit: MONTHLY_LIMIT
      });
    }
    const ai = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
    const proposalSystemPrompt = `[SISTEMA: GERADOR OFICIAL DE PROPOSTAS T\xC9CNICO-COMERCIAIS DA VL ENGENHARIA]

Voc\xEA \xE9 um Engenheiro Mec\xE2nico Perito e Consultor T\xE9cnico Especialista. Sua fun\xE7\xE3o \xE9 gerar a estrutura e o conte\xFAdo textual completo para Propostas T\xE9cnico-Comerciais de Engenharia Mec\xE2nica no padr\xE3o corporativo da VL ENGENHARIA MEC\xC2NICA (CREA-PE: 182229949-0).

### 1. DADOS DE ENTRADA:
- C\xF3digo da Proposta: ${PROP_CODIGO}
- Data de Emiss\xE3o: ${DATA_EMISSAO}
- Validade Comercial: ${VALIDADE_DIAS} dias
- Cliente: ${NOME_CLIENTE_RAZAO_SOCIAL}
- CNPJ/CPF do Cliente: ${CNPJ_CLIENTE}
- Representante / Contato: ${REPRESENTANTE_NOME}
- E-mail do Cliente: ${EMAIL_CLIENTE}
- Telefone do Cliente: ${TELEFONE_CLIENTE}
- Cidade/UF de Atendimento: ${LOCALIDADE_SERVICO}
- Descri\xE7\xE3o da Demanda: ${DESCRICAO_DEMANDA}
- Normas T\xE9cnicas Aplic\xE1veis: ${NORMAS_TECNICAS}
- Total de Equipamentos/Ativos: ${QTD_EQUIPAMENTOS}
- Tempo de Engenharia Estimado: ${HORAS_ENGENHARIA}
- Janela de Mobiliza\xE7\xE3o: ${MOBILIZACAO}
- Prazo de Entrega do Laudo: ${PRAZO_ENTREGA}
- Condi\xE7\xF5es de Pagamento: ${CONDICOES_PAGAMENTO}
- Valor Total do Investimento: ${VALOR_INVESTIMENTO}
- Fotos Preliminares: ${FOTOS_DESCRICAO_OU_PATHS}

### 2. INFORMA\xC7\xD5ES FIXAS DA VL ENGENHARIA:
- Raz\xE3o Social/Fantasia: VL ENGENHARIA MEC\xC2NICA
- Respons\xE1vel T\xE9cnico: Vitor Leonardo Cordeiro Linhares
- Registro Profissional: CREA-PE 182229949-0
- Sede: Recife / Paulista - PE, Brasil
- E-mail: vitorleonardocl@gmail.com
- Telefone / WhatsApp: (81) 98444-2592

Retorne estritamente um objeto JSON com as 13 p\xE1ginas contendo o texto HTML rico com estilo inline/classes Tailwind limpas para cada p\xE1gina seguindo a estrutura mandat\xF3ria:
{
  "codigoProposta": "${PROP_CODIGO}",
  "paginas": [
    { "numero": 1, "titulo": "CAPA E IDENTIFICA\xC7\xC3O DO CLIENTE", "subtitulo": "LAUDOS, VISTORIAS & RESPONSABILIDADE T\xC9CNICA", "conteudoHtml": "..." },
    ... at\xE9 a p\xE1gina 13
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
          temperature: 0.2
        }
      });
      textResponse = response.text || "";
    } catch (primaryErr) {
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
          codigoProposta: parsedAi.codigoProposta || PROP_CODIGO
        };
      }
    } catch {
      console.warn("JSON retornado pela IA para proposta n\xE3o p\xF4de ser parseado perfeitamente; usando estrutura base enriquecida.");
    }
    return res.json({
      ...parsed,
      mock: false,
      currentUsage: monthlyAICalls,
      limit: MONTHLY_LIMIT
    });
  } catch (err) {
    console.error("Erro na gera\xE7\xE3o da proposta t\xE9cnico-comercial com IA:", err);
    return res.status(500).json({
      error: "Falha na gera\xE7\xE3o da proposta: " + (err?.message || "Erro desconhecido")
    });
  }
});
app.use((err, req, res, next) => {
  if (req.path.startsWith("/api/")) {
    const status = err?.status || err?.statusCode || (err?.type === "entity.too.large" ? 413 : 500);
    const msg = status === 413 ? "Arquivo muito grande para envio direto." : err?.message || "Erro interno no servidor.";
    return res.status(status).json({ error: msg });
  }
  return next(err);
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`VL Engenharia Server ativo na porta ${PORT}`);
  });
}
if (!process.env.VERCEL) {
  void startServer();
}

// api/[...path].ts
function handler(request, response) {
  return app(request, response);
}
