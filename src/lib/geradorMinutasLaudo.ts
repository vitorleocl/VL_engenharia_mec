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
  if (tituloNorm.includes('risco') || tituloNorm.includes('hrn') || tituloNorm.includes('aprecia') || tituloNorm.includes('conformidade')) {
    return `<p>Foi realizada a apreciação sistemática dos perigos intrínsecos e operacionais associados ao ativo <strong>${ativo}</strong>, fundamentando-se nos métodos quantitativos e qualitativos da engenharia de segurança:</p>
<div class="p-3 bg-amber-50/80 border-l-4 border-amber-500 rounded-r-lg my-3">
  <p><strong>Avaliação de Riscos Operacionais:</strong></p>
  <p class="text-xs text-slate-700 mt-1">Os riscos identificados concentram-se primordialmente nas fases de manutenção e intervenção técnica, exigindo aplicação rigorosa de procedimentos de bloqueio e etiquetagem (LOTO - Lockout/Tagout). Em regime normal com proteções ativas, o risco residual classifica-se como <strong>BAIXO / TOLERÁVEL</strong>.</p>
</div>
<p>Recomenda-se a manutenção contínua das medidas preventivas implementadas para impedir o surgimento de novos pontos de perigo desprotegidos.</p>`;
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
