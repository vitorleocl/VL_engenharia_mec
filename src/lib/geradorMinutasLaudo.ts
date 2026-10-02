import { TipoLaudoDef } from '../types';

/**
 * Gera conteúdo técnico estruturado, normativo e formal para uma seção pericial
 * dispensando dependência de API externa ou atuando como motor pericial autônomo offline.
 */
export function gerarMinutaTecnicaSecao(
  tituloSecao: string,
  tipoLaudo?: TipoLaudoDef | { nome: string; codigo?: string; normasRef?: string; apresentacaoPadrao?: string; metodologiaPadrao?: string },
  contextoExtra?: { clienteNome?: string; ativoIdentificacao?: string; promptUsuario?: string }
): string {
  const tituloNorm = tituloSecao.toLowerCase();
  const nomeTipo = tipoLaudo?.nome || 'Laudo Técnico Pericial de Engenharia Mecânica';
  const normas = tipoLaudo?.normasRef || 'Normas ABNT NBR aplicáveis, Normas Regulamentadoras MTE e Resoluções CONFEA/CREA';
  const ativo = contextoExtra?.ativoIdentificacao || 'Ativo / Equipamento Mecânico Periciado';
  const prompt = contextoExtra?.promptUsuario?.toLowerCase() || '';

  // 1. Apresentação / Objetivo
  if (tituloNorm.includes('apresenta') || tituloNorm.includes('objetivo') || tituloNorm.includes('identifica')) {
    return `<p>O presente <strong>${nomeTipo}</strong> tem por finalidade realizar o levantamento minucioso, análise diagnóstica pericial e a validação das condições operacionais e estruturais do ativo <strong>${ativo}</strong>, assegurando conformidade estrita com as prescrições normativas da <strong>${normas}</strong>.</p>
<p>Os trabalhos foram conduzidos sob a responsabilidade técnica do Engenheiro Mecânico Vitor Leonardo Cordeiro Linhares (CREA-PE 182229949-0), englobando inspeção presencial, auditoria documental e conformidade regulamentar.</p>`;
  }

  // 2. Diretrizes Normativas / Legislação / Metodologia
  if (tituloNorm.includes('norma') || tituloNorm.includes('metodologia') || tituloNorm.includes('diretriz') || tituloNorm.includes('legisla')) {
    return `<p>A fundamentação técnica deste parecer pericial ampara-se no conjunto de normas e resoluções vigentes no ordenamento técnico e profissional:</p>
<ul>
  <li><strong>${normas}</strong>;</li>
  <li><strong>Resoluções do Sistema CONFEA/CREA:</strong> Atribuições privativas e Anotação de Responsabilidade Técnica (ART);</li>
  <li><strong>Metodologia Pericial:</strong> Vistoria física <em>in loco</em>, inspeção visual macrográfica, medições instrumentadas e análise sistemática dos modos de falha e mecanismos de risco operacional.</li>
</ul>
<p>Todos os parâmetros aferidos foram confrontados com as tabelas de referência e tolerâncias dimensional/funcional estipuladas pelo fabricante e pelas normas supracitadas.</p>`;
  }

  // 3. Vistoria / Inspeção / Levantamento / Diagnóstico / Exames
  if (tituloNorm.includes('inspe') || tituloNorm.includes('vistoria') || tituloNorm.includes('levantamento') || tituloNorm.includes('diagn') || tituloNorm.includes('exame')) {
    return `<p>Durante a vistoria pericial realizada nas dependências operacionais onde se localiza o ativo <strong>${ativo}</strong>, foram inspecionados os componentes vitais e estruturas de sustentação mecânica:</p>
<table class="tiptap-table border-collapse border border-slate-300 w-full my-3">
  <thead>
    <tr>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Elemento Inspecionado</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Critério Normativo Avaliado</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Condição Constatada</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Resultado Técnico</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-slate-300 p-2 text-xs">Chassi / Estrutura Resistente</td>
      <td class="border border-slate-300 p-2 text-xs">Ausência de deformações plásticas, trincas e fadiga</td>
      <td class="border border-slate-300 p-2 text-xs">Integridade estrutural preservada, fixações travadas</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#16A34A;font-weight:bold;">Conforme</span></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs">Dispositivos de Salvaguarda e Segurança</td>
      <td class="border border-slate-300 p-2 text-xs">Atuação instantânea e intertravamento eficaz</td>
      <td class="border border-slate-300 p-2 text-xs">Sensores e bloqueios testados com resposta imediata</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#16A34A;font-weight:bold;">Conforme</span></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs">Sinalização Técnica e Identificação</td>
      <td class="border border-slate-300 p-2 text-xs">Placas de advertência, capacidade e dados de placa</td>
      <td class="border border-slate-300 p-2 text-xs">Placas legíveis e afixadas em local visível ao operador</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#16A34A;font-weight:bold;">Conforme</span></td>
    </tr>
  </tbody>
</table>
<p class="text-xs text-slate-500 italic">Nota: As evidências fotográficas correspondentes encontram-se registradas no anexo fotográfico deste laudo.</p>`;
  }

  // 4. Teste / Medição / Ensaio / Cálculo / Carga / Pressão / Vazão / Dimensionamento
  if (tituloNorm.includes('teste') || tituloNorm.includes('medi') || tituloNorm.includes('ensaio') || tituloNorm.includes('cálculo') || tituloNorm.includes('calculo') || tituloNorm.includes('dimensionamento') || tituloNorm.includes('carga') || tituloNorm.includes('press') || tituloNorm.includes('vaz')) {
    return `<p>Para averiguação do desempenho operacional do ativo <strong>${ativo}</strong>, foram efetuados ensaios funcionais e checagens dinâmicas com registro paramétrico:</p>
<div class="p-3 bg-slate-50 border border-slate-200 rounded-lg my-3 space-y-2">
  <p><strong>Registro dos Ensaios e Medições Realizadas:</strong></p>
  <ul class="list-disc pl-5 space-y-1 text-xs">
    <li><strong>Instrumentação Empregada:</strong> Instrumentos com rastreabilidade metrológica e calibração periódica em dia;</li>
    <li><strong>Regime de Teste:</strong> Avaliação em condições normais de carregamento e simulação de parada forçada;</li>
    <li><strong>Estabilidade Operacional:</strong> Não foram constatadas vibrações anômalas, superaquecimento ou perda de pressão funcional durante o ciclo avaliado;</li>
    <li><strong>Tempo de Resposta:</strong> Atuação dentro das tolerâncias estipuladas pelas normas de segurança.</li>
  </ul>
</div>
<p>Os resultados obtidos ratificam que o conjunto opera dentro da margem de segurança de projeto.</p>`;
  }

  // 5. Risco / HRN / Apreciação / Não Conformidades
  if (tituloNorm.includes('risco') || tituloNorm.includes('hrn') || tituloNorm.includes('aprecia') || (tituloNorm.includes('conformidade') && !tituloNorm.includes('tabela'))) {
    return `<p>Foi realizada a apreciação sistemática dos perigos intrínsecos e operacionais associados ao ativo <strong>${ativo}</strong>, fundamentando-se nos métodos quantitativos e qualitativos da engenharia de segurança:</p>
<div class="p-3 bg-amber-50/80 border-l-4 border-amber-500 rounded-r-lg my-3">
  <p><strong>Avaliação de Riscos Operacionais:</strong></p>
  <p class="text-xs text-slate-700 mt-1">Os riscos identificados concentram-se primordialmente nas fases de manutenção e intervenção técnica, exigindo aplicação rigorosa de procedimentos de bloqueio e etiquetagem (LOTO - Lockout/Tagout). Em regime normal com proteções ativas, o risco residual classifica-se como <strong>BAIXO / TOLERÁVEL</strong>.</p>
</div>
<p>Recomenda-se a manutenção contínua das medidas preventivas implementadas para impedir o surgimento de novos pontos de perigo desprotegidos.</p>`;
  }

  // 5.1. Falha Mecânica / Mecanismos de Fratura
  if (tituloNorm.includes('falha mecânica') || tituloNorm.includes('falha mecanica') || tituloNorm.includes('modo de falha') || tituloNorm.includes('modos de falha')) {
    return `<div class="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
  <h3 class="text-xs font-bold text-slate-900 uppercase">Mecanismos Físicos e Metalúrgicos da Falha — ${ativo}</h3>
  <p class="text-xs text-slate-700 leading-relaxed">
    O exame pericial macrográfico da superfície de fratura do componente crítico revelou com nitidez incontestável as características universais da <strong>Fratura por Fadiga Mecânica de Alto Ciclo (High-Cycle Fatigue)</strong>:
  </p>
  <ul class="list-disc pl-5 space-y-1 text-xs text-slate-700">
    <li><strong>Zona de Iniciação (Origem da Trinca):</strong> Ponto focal localizado em microdescontinuidade interna de material, atuando como concentrador de tensões (stress raiser);</li>
    <li><strong>Zona de Propagação (Marcas de Praia / Beach Marks):</strong> Região polida apresentando estrias concêntricas progressivas decorrentes dos ciclos repetidos de solicitação alternada durante o funcionamento ordinário;</li>
    <li><strong>Zona de Ruptura Instantânea:</strong> Área de aspecto fibroso/cristalino, onde a seção remanescente não mais suportou o esforço de tração/cisalhamento nominal.</li>
  </ul>
</div>`;
  }

  // 5.2. Causa Raiz / RCA / Ishikawa / 5 Porquês
  if (tituloNorm.includes('causa raiz') || tituloNorm.includes('ishikawa') || tituloNorm.includes('5 porquês') || tituloNorm.includes('5 porques')) {
    return `<p>A apuração pericial empregou as ferramentas estruturadas de Análise de Causa Raiz (Root Cause Analysis - RCA):</p>
<div class="my-3 space-y-3">
  <div class="p-3 bg-slate-50 border border-slate-200 rounded text-xs">
    <p class="font-bold text-slate-900 mb-2">1. Diagrama de Ishikawa (Espinha de Peixe — 6M):</p>
    <div class="grid grid-cols-2 gap-2 text-slate-700">
      <div><strong>• Máquina:</strong> Dimensionamento de projeto nominalmente correto;</div>
      <div><strong>• Material:</strong> <span class="text-red-700 font-bold">Inclusão/defeito metalúrgico pontual (Fator Causal);</span></div>
      <div><strong>• Mão de Obra:</strong> Condução do motorista sem vícios operacionais;</div>
      <div><strong>• Método:</strong> Plano de manutenção preventiva cumprido à risca;</div>
      <div><strong>• Meio Ambiente:</strong> Pista plana, sem alagamentos ou sobrecarga térmica;</div>
      <div><strong>• Medição:</strong> Parâmetros eletrônicos regulares na central de bordo.</div>
    </div>
  </div>
  <div class="p-3 bg-amber-50/70 border-l-4 border-amber-500 rounded text-xs space-y-1 text-slate-800">
    <p class="font-bold text-amber-950">2. Árvore Lógica dos 5 Porquês (5-Whys):</p>
    <p><strong>1º Por quê ocorreu a paralisação súbita?</strong> Porque houve rompimento e colapso físico do conjunto mecânico interno;</p>
    <p><strong>2º Por quê o componente colapsou?</strong> Porque a haste sofreu fratura por fadiga mecânica progressiva;</p>
    <p><strong>3º Por quê fadigou precocemente com baixa quilometragem?</strong> Porque existia um concentrador de tensões e descontinuidade interna;</p>
    <p><strong>4º Por quê existia essa descontinuidade?</strong> <span class="font-bold text-red-800 underline">VÍCIO OCULTO DE FABRICAÇÃO / CONTROLE DE QUALIDADE NA ORIGEM.</span></p>
  </div>
</div>`;
  }

  // 5.3. Nexo Causal
  if (tituloNorm.includes('nexo causal') || tituloNorm.includes('nexo de causalidade')) {
    return `<div class="p-3 bg-emerald-50/60 border border-emerald-300 rounded-lg text-xs space-y-2 text-slate-800">
  <p class="font-bold text-emerald-950">Demonstração do Nexo de Causalidade Direta e Necessária:</p>
  <p class="leading-relaxed">
    O colapso mecânico decorreu estritamente da falha do elemento primário defeituoso. A sucessão cronológica dos danos comprova que o vício de fabricação deflagrou a quebra da peça, que por sua vez provocou em efeito cascata as perfurações e avarias colaterais constatadas.
  </p>
  <p class="font-semibold text-slate-900">
    Inexistiu qualquer conduta comissiva ou omissiva por parte do condutor/proprietário apta a romper o nexo causal.
  </p>
</div>`;
  }

  // 5.4. Tabelas de Componentes / Danos / Classificação Primários e Secundários
  if (tituloNorm.includes('tabela de constatação') || tituloNorm.includes('constatação de danos e integridade técnica')) {
    return `<table class="tiptap-table border-collapse border border-slate-300 w-full my-3">
  <thead>
    <tr>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-center text-xs text-slate-800 w-12">Item</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Nome da Peça / Componente</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-center text-xs text-slate-800 w-28">Condição: ÍNTEGRO</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-center text-xs text-slate-800 w-28">Condição: DANIFICADO</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Parecer Técnico Pericial</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-slate-300 p-2 text-center text-xs">01</td>
      <td class="border border-slate-300 p-2 text-xs font-semibold">Correia Dentada (Distribuição)</td>
      <td class="border border-slate-300 p-2 text-center text-xs text-slate-400">—</td>
      <td class="border border-slate-300 p-2 text-center text-xs font-bold text-red-600">X</td>
      <td class="border border-slate-300 p-2 text-xs"><strong>Causa Raiz:</strong> Componente totalmente rompido, apresentando fadiga e descontinuidade estrutural das fibras.</td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-center text-xs">02</td>
      <td class="border border-slate-300 p-2 text-xs font-semibold">Cabeçote do Motor</td>
      <td class="border border-slate-300 p-2 text-center text-xs text-slate-400">—</td>
      <td class="border border-slate-300 p-2 text-center text-xs font-bold text-red-600">X</td>
      <td class="border border-slate-300 p-2 text-xs"><strong>Dano Secundário:</strong> Válvulas empenadas e sedes comprometidas devido ao choque mecânico pós-ruptura.</td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-center text-xs">03</td>
      <td class="border border-slate-300 p-2 text-xs font-semibold">Rolamento Tensor</td>
      <td class="border border-slate-300 p-2 text-center text-xs font-bold text-amber-600">X (Parcial)</td>
      <td class="border border-slate-300 p-2 text-center text-xs text-slate-400">—</td>
      <td class="border border-slate-300 p-2 text-xs">Apresenta condições operacionais normais de giro, sem indícios de travamento prévio que provocasse o corte.</td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-center text-xs">04</td>
      <td class="border border-slate-300 p-2 text-xs font-semibold">Pistões (Bloco do Motor)</td>
      <td class="border border-slate-300 p-2 text-center text-xs font-bold text-emerald-600">X</td>
      <td class="border border-slate-300 p-2 text-center text-xs text-slate-400">—</td>
      <td class="border border-slate-300 p-2 text-xs">Superfícies superiores preservadas estruturalmente, viabilizando a recomposição por meio da retífica do cabeçote.</td>
    </tr>
  </tbody>
</table>`;
  }

  if (tituloNorm.includes('tabela de componentes') || tituloNorm.includes('componentes inspecionados')) {
    return `<table class="tiptap-table border-collapse border border-slate-300 w-full my-3">
  <thead>
    <tr>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Item</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Componente Inspecionado</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Subsistema</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Estado Físico Encontrado</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Parecer Técnico</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-slate-300 p-2 text-xs">01</td>
      <td class="border border-slate-300 p-2 text-xs font-semibold">Biela do Cilindro Crítico</td>
      <td class="border border-slate-300 p-2 text-xs">Conjunto Móvel</td>
      <td class="border border-slate-300 p-2 text-xs">Fratura transversal completa por fadiga</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#DC2626;font-weight:bold;">Falha Primária</span></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs">02</td>
      <td class="border border-slate-300 p-2 text-xs font-semibold">Carcaça do Bloco do Motor</td>
      <td class="border border-slate-300 p-2 text-xs">Estrutural</td>
      <td class="border border-slate-300 p-2 text-xs">Janela perfurada por impacto interno da biela</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#DC2626;font-weight:bold;">Dano Secundário Grave</span></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs">03</td>
      <td class="border border-slate-300 p-2 text-xs font-semibold">Eixo Virabrequim</td>
      <td class="border border-slate-300 p-2 text-xs">Conjunto Móvel</td>
      <td class="border border-slate-300 p-2 text-xs">Sulcos profundos e perda dimensional de têmpera</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#DC2626;font-weight:bold;">Dano Secundário</span></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs">04</td>
      <td class="border border-slate-300 p-2 text-xs font-semibold">Conjunto de Sincronismo</td>
      <td class="border border-slate-300 p-2 text-xs">Distribuição</td>
      <td class="border border-slate-300 p-2 text-xs">Íntegro e sincronizado no ponto de fábrica</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#16A34A;font-weight:bold;">Conforme</span></td>
    </tr>
  </tbody>
</table>`;
  }

  if (tituloNorm.includes('primários e secundários') || tituloNorm.includes('primarios e secundarios') || tituloNorm.includes('classificação dos danos') || tituloNorm.includes('classificacao dos danos')) {
    return `<div class="space-y-3 my-3 text-xs">
  <div class="p-3 bg-red-50/80 border-l-4 border-red-600 rounded-r">
    <p class="font-bold text-red-950 text-sm">DANO PRIMÁRIO (Gatilho Deflagrador Original):</p>
    <p class="text-slate-800 mt-1 leading-relaxed">
      <strong>Fratura por fadiga mecânica cíclica da haste da biela.</strong> Trata-se do evento iniciador exclusivo, originado por descontinuidade estrutural interna do material forjado, o qual gerou a ruptura física em funcionamento sob regime de carga normal.
    </p>
  </div>
  <div class="p-3 bg-amber-50/80 border-l-4 border-amber-600 rounded-r">
    <p class="font-bold text-amber-950 text-sm">DANOS SECUNDÁRIOS (Consequenciais em Efeito Cascata):</p>
    <ul class="list-disc pl-5 mt-1 space-y-1 text-slate-800 leading-relaxed">
      <li><strong>Perfuração do bloco do motor:</strong> Causada pelo impacto cinético da ponta da biela quebrada impulsionada pelo virabrequim;</li>
      <li><strong>Sulcos no moente do virabrequim:</strong> Decorrentes da perda do apoio correto da bronzina;</li>
      <li><strong>Empenamento de válvulas:</strong> Provocado pela colisão decorrente da perda de curso nominal do pistão;</li>
      <li><strong>Contaminação por limalha metálica:</strong> Dispersão de fragmentos metálicos na linha de lubrificação.</li>
    </ul>
  </div>
</div>`;
  }

  // 5.5. Mau Uso / Operação Inadequada
  if (tituloNorm.includes('mau uso') || tituloNorm.includes('operação inadequada') || tituloNorm.includes('operacao inadequada')) {
    return `<p>A apuração pericial averiguou pormenorizadamente a existência de qualquer indício de conduta imprópria:</p>
<ul class="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
  <li><strong>Inexistência de Sobregiro (Over-rev):</strong> A varredura de dados da ECU atestou que a rotação máxima histórica nunca ultrapassou o limite de corte de fábrica;</li>
  <li><strong>Inexistência de Calço Hidráulico:</strong> O filtro de ar estava seco e a haste não sofreu flambagem plástica característica de compressão incompressível;</li>
  <li><strong>Fluidos Conformes:</strong> O lubrificante encontrava-se no nível e com especificações recomendadas no manual do fabricante.</li>
</ul>`;
  }

  // 6. Recomendações / Plano de Ação / Medidas Corretivas
  if (tituloNorm.includes('recomenda') || tituloNorm.includes('plano') || tituloNorm.includes('medida') || tituloNorm.includes('cronograma')) {
    return `<p>Com vistas a manter as condições operacionais em nível ótimo de segurança e estender a vida útil do equipamento periciado, prescrevem-se as seguintes <strong>recomendações técnicas obrigatórias</strong>:</p>
<ol class="list-decimal pl-5 space-y-2 my-2">
  <li><strong>Manutenção Preventiva Periódica:</strong> Seguir rigorosamente o cronograma de lubrificação, inspeção e substituição de componentes conforme manual do fabricante;</li>
  <li><strong>Treinamento e Capacitação de Operadores:</strong> Assegurar que somente profissionais formalmente qualificados, capacitados e autorizados operem ou intervenham no ativo;</li>
  <li><strong>Inspeções de Rotina Diárias (Checklist de Pré-Uso):</strong> Realizar verificação visual dos dispositivos de parada de emergência e integridade das proteções antes do início de cada turno de trabalho;</li>
  <li><strong>Livro de Registro e Histórico Técnico:</strong> Manter atualizado o prontuário do equipamento, registrando todas as manutenções corretivas, preventivas e vistorias periciais realizadas.</li>
</ol>`;
  }

  // 7. Conclusão / Parecer Técnico / Encerramento
  if (tituloNorm.includes('conclus') || tituloNorm.includes('parecer') || tituloNorm.includes('encerramento') || tituloNorm.includes('atesto')) {
    return `<p>Face aos exames periciais, inspeções visuais, testes funcionais e auditoria normativa realizados no ativo <strong>${ativo}</strong>, o Engenheiro Mecânico Responsável Técnico conclui que:</p>
<div class="p-4 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-lg my-3 space-y-2">
  <p class="font-bold text-emerald-900 text-sm">PARECER CONCLUSIVO PERICIAL DE ENGENHARIA:</p>
  <p class="text-slate-800 text-xs leading-relaxed">
    O ativo periciado encontra-se em <strong>CONFORMIDADE com os preceitos de segurança mecânica, integridade funcional e diretrizes normativas da ${normas}</strong>, sendo considerado <strong>APTO PARA OPERAÇÃO REGULAR</strong> nas condições técnicas e operacionais constatadas durante a vistoria.
  </p>
</div>
<p>Este laudo técnico é emitido com respaldo na <strong>Anotação de Responsabilidade Técnica (ART)</strong> registrada perante o CREA-PE, possuindo validade técnica e jurídica.</p>`;
  }

  // 8. Seção Genérica / Especifica da Taxonomia
  let complementoPrompt = '';
  if (prompt) {
    complementoPrompt = `<div class="p-3 bg-purple-50/70 border-l-4 border-purple-600 rounded-r my-2"><p class="text-xs"><strong>Foco de Análise Solicitado:</strong> ${contextoExtra?.promptUsuario}</p></div>`;
  }

  return `<p>Com relação ao tópico de <strong>${tituloSecao}</strong>, a análise pericial procedeu ao levantamento dos dados de campo e conformidades normativas segundo as diretrizes de <strong>${normas}</strong> para o ativo <strong>${ativo}</strong>.</p>
${complementoPrompt}
<p>Constatou-se que as condições físicas, os arranjos de montagem e as sistemáticas de operação atendem satisfatoriamente aos requisitos de engenharia mecânica pertinentes, não sendo verificadas inconformidades críticas impeditivas de funcionamento.</p>
<p>Recomenda-se a preservação dos parâmetros de aferição e a guarda das evidências no prontuário técnico do cliente.</p>`;
}
