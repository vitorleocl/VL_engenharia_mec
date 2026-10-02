import { TipoLaudoDef } from '../types';

export const LAUDO_FALHA_MECANICA_DEF: TipoLaudoDef = {
  id: 'laudo-falha-mecanica-causa-raiz',
  codigo: 'VEIC-FALHA-CR',
  nome: 'Laudo de Perícia Técnica Veicular – Análise de Falha Mecânica e Apuração de Causa Raiz',
  descricaoCurta: 'Perícia automotiva especializada para diagnóstico de quebras mecânicas catastróficas, investigação de causa raiz (RCA / 5 Porquês / Ishikawa / FMEA), nexo causal e classificação de danos.',
  normasRef: 'ABNT NBR 13771, ABNT NBR 5462, Resoluções CONFEA nº 218/1973 e 1.025/2009, Código de Processo Civil (Art. 464 e 473 - Prova Pericial), ASM Handbook Vol. 11 (Failure Analysis), Procedimentos SAE International',
  apresentacaoPadrao: 'O presente Laudo Técnico Pericial de Engenharia Mecânica tem por finalidade realizar o levantamento minucioso, desmontagem técnica e exames periciais in loco e laboratoriais em veículo automotor sinistrado/avariado, com vistas à elucidação da dinâmica do evento de falha mecânica, apuração rigorosa da Causa Raiz (Root Cause Analysis - RCA), delimitação do nexo causal e definição das responsabilidades técnicas e operacionais.',
  metodologiaPadrao: 'Aplicação da metodologia de Engenharia Forense e Diagnóstica Automotiva, compreendendo: (1) Anamnese técnica e histórico operacional; (2) Inspeção visual macrográfica e exames não destrutivos; (3) Desmontagem metódica e catalogação das peças avariadas; (4) Diagnóstico eletrônico de bordo (leitura de DTCs e parâmetros congelados via scanner OBD-II); (5) Análise metalográfica e tribológica dos modos de fratura e lubrificação; (6) Investigação de Causa Raiz através do Diagrama de Causa e Efeito (Ishikawa 6M) e Árvore Lógica dos 5 Porquês; (7) Elaboração de matriz de nexo causal e classificação discriminada de danos primários versus danos secundários em cascata.',
  temHrn: false,
  hrn: false,
  permitePreenchimentoIA: true,
  permitePreenchimentoPreliminar: true,
  secoesEspecificas: [
    '1. Cabeçalho Institucional',
    '2. Identificação do Laudo',
    '3. ART e Responsável Técnico',
    '4. Destinatário / Contratante',
    '5. Carta de Apresentação',
    '6. Sumário Executivo',
    '7. Histórico do Evento',
    '8. Histórico de Manutenção do Veículo',
    '9. Objetivo da Perícia',
    '10. Escopo da Inspeção',
    '11. Metodologia Pericial Aplicada',
    '12. Identificação e Caracterização do Veículo',
    '13. Dados de Quilometragem e Odômetro',
    '14. Registros Fotográficos',
    '15. Evidências Técnicas Encontradas',
    '16. Inspeção dos Componentes e Sistemas',
    '17. Constatação das Avarias',
    '18. Análise Técnica dos Danos',
    '19. Análise de Falha Mecânica',
    '20. Análise de Causa Raiz',
    '21. Análise de Nexo Causal entre Falha e Danos',
    '22. Avaliação de Possíveis Modos de Falha',
    '23. Verificação de Indícios de Mau Uso ou Operação Inadequada',
    '24. Análise do Histórico de Manutenção',
    '25. Avaliação da Integridade dos Componentes',
    '26. Legislação, Normas Técnicas e Referências Aplicáveis',
    '27. Tabela de Componentes Inspecionados',
    '28. Tabela de Danos e Integridade Técnica',
    '29. Classificação dos Danos: Primários e Secundários',
    '30. Parecer Técnico Pericial',
    '31. Conclusão Técnica',
    '32. Considerações Finais',
    '33. Recomendações Técnicas',
    '34. Anexos e Evidências Complementares',
    '35. ART / Documentação de Responsabilidade Técnica'
  ],
  checklistInicial: [
    { campo: "Identificação Cadastral — CRLV, Chassi (VIN), Número do Motor e Placas conferidos in loco", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Código de Trânsito Brasileiro e bases RENAVAM/SENATRAN" },
    { campo: "Odômetro — Leitura do painel e confronto com parâmetros na memória eletrônica da ECU", tipoResposta: "VALOR", unidade: "km", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Autenticidade e compatibilidade com manutenções anteriores" },
    { campo: "Óleo Lubrificante — Nível residual na vareta e presença de contaminação por combustível/água", tipoResposta: "SELECAO", opcoes: ["Nível Normal / Lubrificante Limpo", "Nível Abaixo do Mínimo", "Nível Acima (Diluição por Combustível)", "Emulsão / Presença de Água (Aspecto Café com Leite)", "Ausência Total de Óleo"], obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Especificação do fabricante SAE / API / ACEA" },
    { campo: "Filtro de Óleo do Motor — Integridade do elemento filtrante e presença de partículas metálicas retidas", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Inspeção de limalha de bronze ou ferro nas dobras do filtro" },
    { campo: "Líquido de Arrefecimento — Nível no reservatório de expansão e estanqueidade do circuito", tipoResposta: "SELECAO", opcoes: ["Nível Correto com Aditivo Homologado", "Nível Baixo / Vazamento Externo", "Contaminação com Óleo no Reservatório", "Circuito Vazio / Superaquecimento Severo"], obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Aditivação etilenoglicol / ABNT NBR 13705" },
    { campo: "Bloco do Motor e Cárter — Integridade física estrutural (ausência de perfurações, janelas ou trincas)", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Avaliação de rompimento por choque mecânico de biela" },
    { campo: "Fundo do Cárter e Pescador de Óleo — Verificação de borra mineral/asfáltica, lodo ou tela obstruída", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Desobstrução da tela do pescador para vazão da bomba" },
    { campo: "Bomba de Óleo — Funcionamento, engrenagens internas e válvula reguladora de pressão", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Pressão de trabalho nominal do fabricante" },
    { campo: "Mancais e Bronzinas de Biela — Estado de desgaste, riscos circulares e giro/travamento de bronzinas", tipoResposta: "SELECAO", opcoes: ["Íntegras / Desgaste Normal", "Riscos Superficiais por Contaminação", "Giro de Bronzina (Spinning Bearing)", "Fusão / Degradação Térmica Catastrófica"], obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Manutenção do filme hidrodinâmico de lubrificação" },
    { campo: "Mancais e Bronzinas de Fixo (Virabrequim) — Integridade e folgas radiais e axiais", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Tolerâncias de montagem do virabrequim (mm)" },
    { campo: "Colos do Virabrequim — Descoloração azulada por temperatura e microrranhuras de atrito", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Retífica necessária ou condenação do eixo" },
    { campo: "Bielas do Motor — Fratura de corpo de biela, empenamento plástico ou quebra de parafusos", tipoResposta: "SELECAO", opcoes: ["Íntegras / Alinhadas", "Fratura por Fadiga Mecânica", "Fratura por Sobrecarga Instantânea", "Deformação em 'S' Típica de Calço Hidráulico"], obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Inspeção visual e dimensional de paralelismo" },
    { campo: "Pistões e Pinos — Marcas de atrito/scuffing na saia, fusão de topo ou quebra de anéis", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Folga cilindro-pistão e ausência de detonação/pré-ignição" },
    { campo: "Camisas dos Cilindros — Riscos longitudinais, espelhamento ou fissuras", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Padrão de brunimento cruzado original" },
    { campo: "Cabeçote e Junta de Cabeçote — Queima de junta, empenamento de face ou trincas entre sedes", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Planicidade da face inferior conforme régua de precisão" },
    { campo: "Válvulas de Admissão e Escape — Integridade, empenamento por colisão ou quebra de haste", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Ausência de choque mecânico contra a cabeça do pistão" },
    { campo: "Sistema de Sincronismo (Correia / Corrente de Comando) — Integridade, tensão e sincronismo mecânico", tipoResposta: "SELECAO", opcoes: ["Sincronismo Conforme / Tensão Correta", "Dentes Raspados / Tensão Frouxa", "Corrente/Correia Rompida em Funcionamento", "Tensor Danificado ou Travado"], obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Ponto mecânico de sincronismo do motor" },
    { campo: "Turbocompressor (quando aplicável) — Folga axial/radial do eixo e estado dos rotores", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Ausência de contato entre palhetas e carcaça" },
    { campo: "Sistema de Injeção e Combustível — Estanqueidade dos bicos injetores e vazão uniforme", tipoResposta: "C_NC_NA", criterioReferencia: "Sem gotejamento ou diluição excessiva no óleo" },
    { campo: "Leitura de Falhas no Módulo Eletrônico (ECU) — Presença de códigos de erro gravados (DTCs)", tipoResposta: "VALOR", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Histórico de códigos de falha e Freeze Frame Data" },
    { campo: "Registros de Sobregiro do Motor (Over-rev) no Módulo — Rotação máxima atingida pelo motor", tipoResposta: "VALOR", unidade: "RPM", criterioReferencia: "Comparação com o limite de corte de rotação da fábrica" },
    { campo: "Histórico de Manutenção Preventiva — Comprovação por notas fiscais, ordens de serviço e carimbos", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Manual de garantia e plano de manutenção periódica" },
    { campo: "Análise Macroscópica da Superfície de Fratura — Caracterização do mecanismo de falha", tipoResposta: "SELECAO", opcoes: ["Fadiga Progressiva (com marcas de praia visíveis)", "Sobrecarga Frágil Catastrófica", "Sobrecarga Dúctil com Estricção", "Gripamento / Atrito a Seco por Falta de Lubrificação", "Calço Hidráulico"], obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Critérios de metalurgia física e engenharia forense" },
    { campo: "Determinação Técnica da Causa Raiz Primária — Enquadramento formal da origem da quebra", tipoResposta: "SELECAO", opcoes: ["Defeito de Fabricação ou Material", "Erro de Montagem / Manutenção Recente Inadequada", "Omissão de Manutenção Preventiva pelo Usuário", "Operação Inadequada / Mau Uso Severo", "Contaminação de Combustível ou Lubrificante"], obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Parecer pericial de causa raiz conclusivo" }
  ],
  checklistPadrao: [
    { id: 'ck-1', descricao: 'Documentação do veículo, CRLV e numeração identificadora de chassi e motor conferidos in loco', status: 'conforme', observacao: 'Identificação regular e dados confrontados com os sistemas oficiais' },
    { id: 'ck-2', descricao: 'Hodômetro e quilometragem conferidos no painel e na memória da central eletrônica (ECU)', status: 'conforme', observacao: 'Quilometragem compatível e sem divergência entre painel e módulo' },
    { id: 'ck-3', descricao: 'Exame do fluido lubrificante do motor quanto a nível, viscosidade e contaminações', status: 'nao_conforme', observacao: 'Presença de partículas metálicas microscópicas e limalha em suspensão' },
    { id: 'ck-4', descricao: 'Inspeção do elemento filtrante de óleo quanto à retenção de detritos metálicos', status: 'nao_conforme', observacao: 'Limalha ferrosa e fragmentos dourados (bronze de mancal) retidos no filtro' },
    { id: 'ck-5', descricao: 'Inspeção do sistema de arrefecimento (nível de fluido, estanqueidade e aditivação)', status: 'conforme', observacao: 'Nível adequado e circuito com aditivo etilenoglicol preservado' },
    { id: 'ck-6', descricao: 'Inspeção externa do bloco do motor, cabeçote e cárter quanto a trincas e furos', status: 'nao_conforme', observacao: 'Perfuração na parede lateral do bloco provocada pelo choque do corpo da biela' },
    { id: 'ck-7', descricao: 'Desmontagem do cárter e inspeção de resíduos metálicos e da tela do pescador de óleo', status: 'nao_conforme', observacao: 'Tela do pescador com obstrução parcial e depósito de fragmentos no cárter' },
    { id: 'ck-8', descricao: 'Avaliação da bomba de óleo, pressão nominal de trabalho e válvula de alívio', status: 'conforme', observacao: 'Rotores da bomba sem engripamento e válvula de alívio operacional' },
    { id: 'ck-9', descricao: 'Inspeção dos mancais de biela, bronzinas e colo do virabrequim quanto a desgaste e riscos', status: 'nao_conforme', observacao: 'Giro de bronzina no moente do cilindro crítico com coloração azulada por atrito' },
    { id: 'ck-10', descricao: 'Inspeção dos mancais fixos do virabrequim e folga axial', status: 'conforme', observacao: 'Mancais fixos íntegros e folga axial dentro da tolerância do projeto' },
    { id: 'ck-11', descricao: 'Inspeção das bielas do motor quanto a alinhamento, empenamento e modo de fratura', status: 'nao_conforme', observacao: 'Fratura catastrófica no terço médio da haste da biela do cilindro especificado' },
    { id: 'ck-12', descricao: 'Inspeção dos pistões, saias, canaletas de anéis e pinos de fixação', status: 'nao_conforme', observacao: 'Marcas de colisão contra o cabeçote após desprendimento da biela fraturada' },
    { id: 'ck-13', descricao: 'Inspeção das camisas de cilindro e padrão de brunimento', status: 'nao_conforme', observacao: 'Ranhuras profundas na camisa do cilindro afetado causadas pela biela solta' },
    { id: 'ck-14', descricao: 'Inspeção do cabeçote, válvulas de admissão/escape e planos de vedação', status: 'nao_conforme', observacao: 'Válvulas empenadas por colisão mecânica subsequente ao evento primário' },
    { id: 'ck-15', descricao: 'Inspeção do sistema de sincronismo do motor (correia/corrente e tensores)', status: 'conforme', observacao: 'Corrente de comando íntegra e sincronismo mecânico original preservado' },
    { id: 'ck-16', descricao: 'Leitura de códigos de diagnóstico e parâmetros gravados na central eletrônica (ECU)', status: 'conforme', observacao: 'Scanner OBD-II registrou código de queda de pressão de óleo antes da parada' },
    { id: 'ck-17', descricao: 'Verificação de dados de sobre-rotação histórica do motor (over-rev)', status: 'conforme', observacao: 'Ausência de registros de giro acima do limite máximo de corte do fabricante' },
    { id: 'ck-18', descricao: 'Auditoria do manual de revisões, notas fiscais e plano de manutenção do veículo', status: 'conforme', observacao: 'Revisões periódicas executadas rigorosamente nos prazos e quilometragens devidas' },
    { id: 'ck-19', descricao: 'Análise macroscópica da superfície de fratura do componente crítico', status: 'conforme', observacao: 'Presença evidente de marcas de praia (beach marks) típicas de fadiga mecânica cíclica' },
    { id: 'ck-20', descricao: 'Determinação categórica da Causa Raiz e emissão do Parecer Técnico Pericial', status: 'conforme', observacao: 'Causa Raiz primária elucidada sem margem de dúvida com fundamentação técnico-científica' }
  ],
  secoesPadrao: [
    {
      id: 'sec-1',
      titulo: '1. Cabeçalho Institucional',
      ordem: 1,
      conteudoHtml: `<div class="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
  <div class="flex items-center justify-between border-b border-slate-200 pb-3">
    <div>
      <h2 class="text-base font-bold text-slate-900 uppercase tracking-wide">VL ENGENHARIA DIAGNÓSTICA &amp; PERÍCIAS TÉCNICAS</h2>
      <p class="text-xs text-slate-600 font-medium">Departamento de Engenharia Mecânica Forense e Perícias Veiculares Especializadas</p>
    </div>
    <div class="text-right text-xs text-slate-500">
      <span class="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded border border-blue-200">CREA-PE 182229949-0</span>
    </div>
  </div>
  <div class="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
    <p><strong>Responsável Técnico:</strong> Eng. Vitor Leonardo Cordeiro Linhares</p>
    <p><strong>Especialidade:</strong> Engenharia Diagnóstica, Perícias Mecânicas &amp; RCA</p>
    <p><strong>Sede Operacional:</strong> Recife - PE (Atuação Nacional)</p>
    <p><strong>Contato Oficial:</strong> laudos@vlengenharia.com.br</p>
  </div>
</div>`
    },
    {
      id: 'sec-2',
      titulo: '2. Identificação do Laudo',
      ordem: 2,
      conteudoHtml: `<p>Este documento pericial constitui peça técnica formal, elaborada de acordo com as normas da ABNT e os preceitos do Código de Processo Civil:</p>
<table class="tiptap-table border-collapse border border-slate-300 w-full my-3">
  <tbody>
    <tr>
      <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-700 w-1/3">Número do Laudo Pericial:</td>
      <td class="border border-slate-300 p-2 text-xs text-slate-900 font-semibold">[NÚMERO-DO-LAUDO-VEIC-FALHA]</td>
    </tr>
    <tr>
      <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-700">Natureza da Perícia:</td>
      <td class="border border-slate-300 p-2 text-xs text-slate-900">Perícia Técnica Veicular Mecânica Forense – Apuração de Falha Catastrófica e Causa Raiz</td>
    </tr>
    <tr>
      <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-700">Data e Hora da Inspeção:</td>
      <td class="border border-slate-300 p-2 text-xs text-slate-900">[DATA-DA-INSPECAO]</td>
    </tr>
    <tr>
      <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-700">Local da Realização da Vistoria:</td>
      <td class="border border-slate-300 p-2 text-xs text-slate-900">Oficina Técnica Especializada / Concessionária Autorizada / Pátio Técnico</td>
    </tr>
    <tr>
      <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-700">Condições Ambientais na Diligência:</td>
      <td class="border border-slate-300 p-2 text-xs text-slate-900">Ambiente coberto, piso nivelado, iluminação artificial adequada de 600 lux e suporte de elevador automotivo hidráulico</td>
    </tr>
  </tbody>
</table>`
    },
    {
      id: 'sec-3',
      titulo: '3. ART e Responsável Técnico',
      ordem: 3,
      conteudoHtml: `<p>A presente perícia mecânica é de competência privativa de Engenheiro Mecânico, em estrito cumprimento às Leis Federais nº 5.194/1966 e 6.496/1977, e Resolução nº 218/1973 do CONFEA:</p>
<div class="p-3 bg-blue-50/70 border-l-4 border-blue-600 rounded-r my-3 text-xs space-y-1 text-slate-800">
  <p><strong>Engenheiro Responsável Técnico:</strong> Eng. Vitor Leonardo Cordeiro Linhares</p>
  <p><strong>Qualificação:</strong> Engenheiro Mecânico – Perito Especialista em Mecânica Forense e Análise de Falhas de Máquinas</p>
  <p><strong>Registro no Conselho Regional:</strong> CREA-PE nº 182229949-0 | RNP: 1822299490</p>
  <p><strong>Anotação de Responsabilidade Técnica (ART):</strong> [NÚMERO-DA-ART-CREA-PE]</p>
  <p class="text-slate-500 italic mt-1">A respectiva ART garante a validade legal e probatória deste laudo pericial perante órgãos reguladores, seguradoras, fabricantes e Poder Judiciário.</p>
</div>`
    },
    {
      id: 'sec-4',
      titulo: '4. Destinatário / Contratante',
      ordem: 4,
      conteudoHtml: `<p>Este laudo técnico é destinado ao contratante formal para fins de comprovação técnica, garantia ou instrução probatória:</p>
<table class="tiptap-table border-collapse border border-slate-300 w-full my-3">
  <tbody>
    <tr>
      <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-700 w-1/3">Contratante / Solicitante:</td>
      <td class="border border-slate-300 p-2 text-xs text-slate-900 font-semibold">[NOME-CLIENTE-OU-RAZAO-SOCIAL]</td>
    </tr>
    <tr>
      <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-700">CNPJ / CPF:</td>
      <td class="border border-slate-300 p-2 text-xs text-slate-900">[CNPJ-OU-CPF-CLIENTE]</td>
    </tr>
    <tr>
      <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-700">Endereço Completo:</td>
      <td class="border border-slate-300 p-2 text-xs text-slate-900">[ENDERECO-CLIENTE]</td>
    </tr>
    <tr>
      <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-700">Finalidade Específica do Laudo:</td>
      <td class="border border-slate-300 p-2 text-xs text-slate-900">Apuração técnica pericial da causa da quebra mecânica do veículo, instrução de pleito de garantia perante fabricante/concessionária e/ou respaldo em ação judicial</td>
    </tr>
  </tbody>
</table>`
    },
    {
      id: 'sec-5',
      titulo: '5. Carta de Apresentação',
      ordem: 5,
      conteudoHtml: `<p>Prezado(a) Contratante,</p>
<p>Em atendimento à solicitação formulada, encaminhamos o presente <strong>Laudo de Perícia Técnica Veicular – Análise de Falha Mecânica e Apuração de Causa Raiz</strong>, referente ao veículo identificado neste instrumento.</p>
<p>Os trabalhos foram executados com total isenção, imparcialidade e estrito rigor técnico-científico, baseando-se nos princípios consolidados da Engenharia Diagnóstica, Tribologia, Ciência dos Materiais e Metalurgia Física de Fraturas. Todas as conclusões aqui exaradas decorrem diretamente das evidências materiais, ensaios in loco, desmontagens controladas e confrontação com a literatura técnica internacional.</p>
<p>Permanecemos à inteira disposição para prestar esclarecimentos complementares que se façam necessários.</p>`
    },
    {
      id: 'sec-6',
      titulo: '6. Sumário Executivo',
      ordem: 6,
      conteudoHtml: `<div class="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
  <h3 class="text-xs font-bold text-slate-900 uppercase border-b border-slate-200 pb-2">Síntese Executiva do Diagnóstico Pericial</h3>
  <div class="space-y-2 text-xs text-slate-700 leading-relaxed">
    <p><strong>1. Objeto Periciado:</strong> Veículo automotor periciado em oficina técnica especializada após paralisação súbita com ruído metálico violento e descontinuidade funcional do conjunto motopropulsor.</p>
    <p><strong>2. Modo Primário de Falha:</strong> Constatou-se a fratura catastrófica do componente mecânico crítico (haste da biela do cilindro especificado / engripamento severo de bronzina com giro no colo / quebra de corrente de sincronismo), desencadeada por mecanismo de fadiga mecânica de alto ciclo.</p>
    <p><strong>3. Apuração da Causa Raiz (RCA):</strong> A análise sistemática descartou categoricamente mau uso do operador (inexistência de calço hidráulico e rotações dentro da faixa de projeto) e omissão de manutenção (revisões atestadas no prazo). A causa raiz fundamental foi tecnicamente enquadrada em <strong>vício de fabricação/fadiga prematura do material metálico</strong>, com microdescontinuidade interna que propagou fissura por fadiga.</p>
    <p><strong>4. Classificação dos Danos:</strong> A fratura do componente primário provocou imediatamente choque contra as camisas, perfuração do bloco motor e empenamento de válvulas, configurando danos secundários em cascata.</p>
    <p><strong>5. Veredito Técnico:</strong> O conjunto motopropulsor requer substituição integral do bloco/motor parcial, inexistindo viabilidade de reaproveitamento das partes estruturais danificadas.</p>
  </div>
</div>`
    },
    {
      id: 'sec-7',
      titulo: '7. Histórico do Evento',
      ordem: 7,
      conteudoHtml: `<p>A apuração pericial iniciou-se pela reconstituição fática dos eventos que antecederam a paralisação do veículo:</p>
<ul class="list-disc pl-5 space-y-2 text-xs text-slate-700">
  <li><strong>Condições de Tráfego e Clima:</strong> O veículo transitava em via pavimentada, em velocidade constante de cruzeiro compatível com a via (aprox. 80-100 km/h), sob pista seca e temperatura ambiente de 28°C;</li>
  <li><strong>Sintomas Preliminares:</strong> O condutor relatou o surgimento abrupto de ruído metálico cadenciado ('batida seca'), acompanhado de imediata perda de potência e acendimento instantâneo da luz de advertência de pressão de óleo no painel de instrumentos;</li>
  <li><strong>Comportamento Operacional do Condutor:</strong> O condutor desengrenou a marcha, acionou o acostamento de forma segura e desligou imediatamente a ignição, sem forçar novas tentativas de partida mecânica;</li>
  <li><strong>Remoção do Ativo:</strong> O veículo foi guinchado por reboque plataforma até o local de custódia e desmontagem, preservando o estado fático do conjunto motopropulsor sem contaminações externas.</li>
</ul>`
    },
    {
      id: 'sec-8',
      titulo: '8. Histórico de Manutenção do Veículo',
      ordem: 8,
      conteudoHtml: `<p>Foi realizada a auditoria analítica dos registros documentais e das revisões periódicas do veículo:</p>
<table class="tiptap-table border-collapse border border-slate-300 w-full my-3">
  <thead>
    <tr>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Revisão / Intervenção</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Quilometragem (km)</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Data</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Oficina / Concessionária</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Conformidade com o Manual</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-slate-300 p-2 text-xs">1ª Revisão Preventiva (10.000 km)</td>
      <td class="border border-slate-300 p-2 text-xs">9.840 km</td>
      <td class="border border-slate-300 p-2 text-xs">[DATA-REV-1]</td>
      <td class="border border-slate-300 p-2 text-xs">Concessionária Autorizada da Marca</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#16A34A;font-weight:bold;">Conforme (Plano Integral)</span></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs">2ª Revisão Preventiva (20.000 km)</td>
      <td class="border border-slate-300 p-2 text-xs">19.720 km</td>
      <td class="border border-slate-300 p-2 text-xs">[DATA-REV-2]</td>
      <td class="border border-slate-300 p-2 text-xs">Concessionária Autorizada da Marca</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#16A34A;font-weight:bold;">Conforme (Plano Integral)</span></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs">3ª Revisão Preventiva (30.000 km)</td>
      <td class="border border-slate-300 p-2 text-xs">29.610 km</td>
      <td class="border border-slate-300 p-2 text-xs">[DATA-REV-3]</td>
      <td class="border border-slate-300 p-2 text-xs">Concessionária Autorizada da Marca</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#16A34A;font-weight:bold;">Conforme (Plano Integral)</span></td>
    </tr>
  </tbody>
</table>
<p class="text-xs text-slate-600"><strong>Conclusão sobre o Histórico:</strong> Comprovou-se documentalmente que o proprietário cumpriu rigorosamente todas as manutenções preventivas, empregando fluidos genuínos e peças originais recomendadas pelo fabricante.</p>`
    },
    {
      id: 'sec-9',
      titulo: '9. Objetivo da Perícia',
      ordem: 9,
      conteudoHtml: `<p>A perícia de engenharia mecânica tem por escopo os seguintes objetivos técnicos específicos:</p>
<ol class="list-decimal pl-5 space-y-1.5 text-xs text-slate-700">
  <li>Identificar a localização física precisa do ponto inicial da quebra mecânica;</li>
  <li>Determinar o mecanismo físico/metalúrgico da fratura ou avaria dos componentes mecânicos;</li>
  <li>Investigar e estabelecer tecnicamente a <strong>Causa Raiz Primária</strong> da falha através de árvore lógica analítica;</li>
  <li>Elaborar o <strong>Nexo Causal</strong> relacionando o vício original aos danos consequenciais observados;</li>
  <li>Apurar a existência ou ausência de indícios de negligência, sobrecarga, calço hidráulico ou mau uso operacional;</li>
  <li>Emitir Parecer Técnico Pericial conclusivo de engenharia mecânica respaldado pela ART.</li>
</ol>`
    },
    {
      id: 'sec-10',
      titulo: '10. Escopo da Inspeção',
      ordem: 10,
      conteudoHtml: `<p>Os trabalhos periciais circunscreveram-se aos seguintes limites operacionais e técnicos:</p>
<div class="grid grid-cols-2 gap-3 my-2 text-xs text-slate-700">
  <div class="p-3 bg-slate-50 border border-slate-200 rounded">
    <p class="font-bold text-slate-800 mb-1">Inclusos no Escopo Pericial:</p>
    <ul class="list-disc pl-4 space-y-1">
      <li>Inspeção visual preliminar completa do vão do motor;</li>
      <li>Desmontagem técnica sequencial (cárter, cabeçote, conjunto móvel);</li>
      <li>Exame macrográfico das superfícies fraturadas;</li>
      <li>Leitura de memória de diagnóstico eletrônico via scanner OBD-II;</li>
      <li>Avaliação tribológica das bronzinas e óleo lubrificante.</li>
    </ul>
  </div>
  <div class="p-3 bg-slate-50 border border-slate-200 rounded">
    <p class="font-bold text-slate-800 mb-1">Delimitações e Ressalvas:</p>
    <ul class="list-disc pl-4 space-y-1">
      <li>Não foram realizados ensaios destrutivos químicos de tração ou dureza por desnecessidade frente às evidências macrográficas incontestáveis;</li>
      <li>Preservação das peças no estado em que foram desmontadas para eventual perícia judicial.</li>
    </ul>
  </div>
</div>`
    },
    {
      id: 'sec-11',
      titulo: '11. Metodologia Pericial Aplicada',
      ordem: 11,
      conteudoHtml: `<p>A metodologia científica aplicada fundamentou-se nos preceitos da <strong>Engenharia Diagnóstica e Forense Automotiva</strong>:</p>
<div class="space-y-2 text-xs text-slate-700 my-3">
  <div class="p-2.5 bg-blue-50/60 border-l-4 border-blue-500 rounded-r">
    <p class="font-bold text-blue-950">Etapa 1 — Anamnese e Coleta Documental:</p>
    <p>Levantamento dos relatórios do sinistro, depoimento do operador, ordens de serviço e histórico eletrônico.</p>
  </div>
  <div class="p-2.5 bg-blue-50/60 border-l-4 border-blue-500 rounded-r">
    <p class="font-bold text-blue-950">Etapa 2 — Vistoria Presencial & Desmontagem Controlada:</p>
    <p>Inspeção visual sistemática com registro fotográfico macro, desmonte acompanhado e medição de folgas residuais.</p>
  </div>
  <div class="p-2.5 bg-blue-50/60 border-l-4 border-blue-500 rounded-r">
    <p class="font-bold text-blue-950">Etapa 3 — Diagnóstico Eletrônico Computadorizado:</p>
    <p>Varredura da central de injeção eletrônica (ECU), resgatando DTCs (Diagnostic Trouble Codes), Freeze Frame Data e rotação máxima histórica.</p>
  </div>
  <div class="p-2.5 bg-blue-50/60 border-l-4 border-blue-500 rounded-r">
    <p class="font-bold text-blue-950">Etapa 4 — Engenharia de Análise de Causa Raiz (RCA):</p>
    <p>Construção do Diagrama de Causa e Efeito (Ishikawa 6M), aplicação da técnica dos 5 Porquês e matriz de confronto de hipóteses de falha.</p>
  </div>
</div>`
    },
    {
      id: 'sec-12',
      titulo: '12. Identificação e Caracterização do Veículo',
      ordem: 12,
      conteudoHtml: `<p>Dados cadastrais oficiais do veículo periciado, conferidos diretamente no CRLV e nas marcações físicas de fábrica:</p>
<table class="tiptap-table border-collapse border border-slate-300 w-full my-3">
  <tbody>
    <tr>
      <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-700 w-1/4">Placa / UF:</td>
      <td class="border border-slate-300 p-2 text-xs text-slate-900 font-bold">[PLACA-DO-VEICULO]</td>
      <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-700 w-1/4">Chassi (VIN):</td>
      <td class="border border-slate-300 p-2 text-xs text-slate-900 font-mono">[NUMERO-DO-CHASSI-VIN]</td>
    </tr>
    <tr>
      <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-700">Marca / Modelo:</td>
      <td class="border border-slate-300 p-2 text-xs text-slate-900">[MARCA-MODELO-VERSAO]</td>
      <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-700">Ano Fab. / Mod.:</td>
      <td class="border border-slate-300 p-2 text-xs text-slate-900">[ANO-FABRICACAO] / [ANO-MODELO]</td>
    </tr>
    <tr>
      <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-700">Motorização / Cilindrada:</td>
      <td class="border border-slate-300 p-2 text-xs text-slate-900">[TIPO-MOTOR-EX-TURBO-16V]</td>
      <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-700">Número do Motor:</td>
      <td class="border border-slate-300 p-2 text-xs text-slate-900 font-mono">[NUMERO-DO-MOTOR-GRAVADO]</td>
    </tr>
    <tr>
      <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-700">Combustível:</td>
      <td class="border border-slate-300 p-2 text-xs text-slate-900">[FLEX-GASOLINA-DIESEL]</td>
      <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-700">Cor / Câmbio:</td>
      <td class="border border-slate-300 p-2 text-xs text-slate-900">[COR-PREDOMINANTE] / [AUTOMATICO-MANUAL]</td>
    </tr>
  </tbody>
</table>`
    },
    {
      id: 'sec-13',
      titulo: '13. Dados de Quilometragem e Odômetro',
      ordem: 13,
      conteudoHtml: `<p>A conferência metrológica da quilometragem percorrida pelo veículo foi validada mediante inspeção visual do painel e extração telemática da ECU:</p>
<div class="p-3 bg-slate-50 border border-slate-200 rounded my-2 text-xs space-y-1.5 text-slate-800">
  <p><strong>Quilometragem Registrada no Odômetro Digital:</strong> <span class="font-bold text-slate-900 text-sm">[QUILOMETRAGEM-ATUAL] km</span></p>
  <p><strong>Quilometragem Gravada na Memória Não Volátil da ECU:</strong> <span class="font-bold text-slate-900">[QUILOMETRAGEM-ECU] km</span> (Convergência de 100%, sem indício de adulteração);</p>
  <p><strong>Quilometragem da Última Revisão Formal:</strong> [KM-ULTIMA-REVISAO] km (ocorrida há apenas [DIAS-MESES-APOS-REVISAO]);</p>
  <p><strong>Média de Rodagem Diária:</strong> Aproximadamente [MEDIA-KM-DIA] km/dia, compatível com uso normal urbano e rodoviário leve.</p>
</div>`
    },
    {
      id: 'sec-14',
      titulo: '14. Registros Fotográficos',
      ordem: 14,
      conteudoHtml: `<p>Dossiê fotográfico pericial com as evidências visuais colhidas durante a vistoria e desmontagem mecânica:</p>
<div class="grid grid-cols-2 gap-3 my-3">
  <div class="p-3 border border-slate-200 rounded-lg bg-slate-50/50 space-y-1 text-center">
    <div class="h-32 bg-slate-200 rounded flex items-center justify-center text-slate-400 text-xs italic">[Foto 1: Vista Geral do Veículo e Numeração de Chassi]</div>
    <p class="text-xs font-semibold text-slate-700">Foto 1 — Identificação Geral do Veículo</p>
    <p class="text-xs text-slate-500">Conferência dos caracteres alfanuméricos de gravação no painel de fogo e CRLV.</p>
  </div>
  <div class="p-3 border border-slate-200 rounded-lg bg-slate-50/50 space-y-1 text-center">
    <div class="h-32 bg-slate-200 rounded flex items-center justify-center text-slate-400 text-xs italic">[Foto 2: Odômetro e Painel de Instrumentos]</div>
    <p class="text-xs font-semibold text-slate-700">Foto 2 — Odômetro Digital e Indicadores</p>
    <p class="text-xs text-slate-500">Registro fiel da quilometragem aferida na data da perícia técnica.</p>
  </div>
  <div class="p-3 border border-slate-200 rounded-lg bg-slate-50/50 space-y-1 text-center">
    <div class="h-32 bg-slate-200 rounded flex items-center justify-center text-slate-400 text-xs italic">[Foto 3: Perfuração no Bloco do Motor]</div>
    <p class="text-xs font-semibold text-slate-700">Foto 3 — Dano Estrutural no Bloco do Motor</p>
    <p class="text-xs text-slate-500">Perfuração mecânica violenta provocada pela haste de biela rompida.</p>
  </div>
  <div class="p-3 border border-slate-200 rounded-lg bg-slate-50/50 space-y-1 text-center">
    <div class="h-32 bg-slate-200 rounded flex items-center justify-center text-slate-400 text-xs italic">[Foto 4: Superfície de Fratura com Marcas de Fadiga]</div>
    <p class="text-xs font-semibold text-slate-700">Foto 4 — Macrografia da Zona de Fratura</p>
    <p class="text-xs text-slate-500">Evidência nítida de estrias de praia e núcleo de nucleação de trinca por fadiga mecânica.</p>
  </div>
</div>
<p class="text-xs text-slate-500 italic">Nota: As fotografias originais em alta definição com carimbo de data/hora encontram-se arquivadas na íntegra no banco de evidências periciais da VL Engenharia.</p>`
    },
    {
      id: 'sec-15',
      titulo: '15. Evidências Técnicas Encontradas',
      ordem: 15,
      conteudoHtml: `<p>A desmontagem metódica e a análise dos componentes resultaram nas seguintes evidências materiais irrefutáveis:</p>
<ul class="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
  <li><strong>Evidência 01 — Limalhas e Partículas Metálicas no Cárter:</strong> Acúmulo de partículas ferrosas e bronze no fundo do cárter e retidas na tela de sucção do pescador;</li>
  <li><strong>Evidência 02 — Fratura Transversal de Biela:</strong> Ruptura completa da haste da biela com características típicas de fadiga mecânica de alto ciclo iniciada em concentração de tensões interna;</li>
  <li><strong>Evidência 03 — Integridade das Demais Bronzinas:</strong> As bronzinas dos cilindros adjacentes não apresentaram perda do filme hidrodinâmico ou riscos de falta de lubrificação, atestando que a pressão da linha de óleo era satisfatória;</li>
  <li><strong>Evidência 04 — Ausência de Calço Hidráulico:</strong> As bielas não apresentaram deformação plástica em forma de 'S' (flambagem lateral por compressão incompressível de água/combustível);</li>
  <li><strong>Evidência 05 — Lubrificante Dentro da Vida Útil:</strong> Amostra de óleo com coloração, transparência e viscosidade compatíveis com o tempo de uso pós-revisão.</li>
</ul>`
    },
    {
      id: 'sec-16',
      titulo: '16. Inspeção dos Componentes e Sistemas',
      ordem: 16,
      conteudoHtml: `<p>Avaliação detalhada dos principais subsistemas do conjunto motopropulsor durante a diligência técnica:</p>
<table class="tiptap-table border-collapse border border-slate-300 w-full my-3">
  <thead>
    <tr>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Subsistema Avaliado</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Componentes Específicos</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Condição Técnica Constatada</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Conclusão de Integridade</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-slate-300 p-2 text-xs font-semibold">Sistema de Lubrificação</td>
      <td class="border border-slate-300 p-2 text-xs">Bomba de óleo, galerias, válvula reguladora e filtro</td>
      <td class="border border-slate-300 p-2 text-xs">Válvula operante e galerias desobstruídas, sem borras minerais</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#16A34A;font-weight:bold;">Operacional / Regular</span></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs font-semibold">Sistema de Arrefecimento</td>
      <td class="border border-slate-300 p-2 text-xs">Radiador, bomba d'água, válvula termostática e líquido</td>
      <td class="border border-slate-300 p-2 text-xs">Estanqueidade preservada, aditivação química e sem superaquecimento</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#16A34A;font-weight:bold;">Operacional / Regular</span></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs font-semibold">Conjunto Bloco e Cárter</td>
      <td class="border border-slate-300 p-2 text-xs">Carcaça de ferro fundido/alumínio e cárter inferior</td>
      <td class="border border-slate-300 p-2 text-xs">Janela de ruptura lateral gerada pelo choque mecânico da biela solta</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#DC2626;font-weight:bold;">Perda Total Estrutural</span></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs font-semibold">Conjunto Móvel Rotativo</td>
      <td class="border border-slate-300 p-2 text-xs">Virabrequim, bielas, pinos, pistões e bronzinas</td>
      <td class="border border-slate-300 p-2 text-xs">Fratura mecânica da biela e danos colaterais a moente e pistão</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#DC2626;font-weight:bold;">Falha Crítica Primária</span></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs font-semibold">Cabeçote e Válvulas</td>
      <td class="border border-slate-300 p-2 text-xs">Árvore de comando, válvulas, molas e tuchos</td>
      <td class="border border-slate-300 p-2 text-xs">Válvulas do cilindro sinistrado sofreram impacto mecânico ascendente</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#DC2626;font-weight:bold;">Dano Secundário Grave</span></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs font-semibold">Sistema de Sincronismo</td>
      <td class="border border-slate-300 p-2 text-xs">Corrente/correia dentada, polias e guias tensores</td>
      <td class="border border-slate-300 p-2 text-xs">Sincronismo perfeitamente engrenado, sem dentes roçados ou rompimento</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#16A34A;font-weight:bold;">Integro / Aprovado</span></td>
    </tr>
  </tbody>
</table>`
    },
    {
      id: 'sec-17',
      titulo: '17. Constatação das Avarias',
      ordem: 17,
      conteudoHtml: `<p>A vistoria pericial in loco confirmou a existência das seguintes avarias mecânicas expressivas no veículo periciado:</p>
<ol class="list-decimal pl-5 space-y-1.5 text-xs text-slate-700">
  <li>Perfuração de aproximadamente 60 mm x 45 mm na saia do bloco do motor, adjacente ao cilindro afetado;</li>
  <li>Seccionamento total da haste da biela em duas partes separadas;</li>
  <li>Ranhuras circunferenciais profundas no moente correspondente do virabrequim;</li>
  <li>Desalinhamento e amassamento no fundo de chapa do cárter de óleo;</li>
  <li>Marcas de choque mecânico na face da câmara de combustão do cabeçote;</li>
  <li>Empenamento acentuado de 02 (duas) válvulas de admissão por contato com o pistão desarticulado.</li>
</ol>`
    },
    {
      id: 'sec-18',
      titulo: '18. Análise Técnica dos Danos',
      ordem: 18,
      conteudoHtml: `<p>A física do colapso mecânico observada no conjunto motopropulsor obedeceu a uma cadeia sequencial rigorosamente lógica:</p>
<p class="text-xs text-slate-700 leading-relaxed">
  O elemento deflagrador consistiu na perda de integridade mecânica de um componente submetido a esforços alternados de tração e compressão. Com o surgimento da trinca inicial e sua progressão sem aviso visual externo, a área resistente do elemento reduziu-se progressivamente até o ponto em que a tensão instantânea superou a resistência limite do material remanescente, ocorrendo o cisalhamento final instantâneo.
</p>
<p class="text-xs text-slate-700 leading-relaxed mt-2">
  Uma vez rompida em regime de rotação de trabalho (aproximadamente 2.500 RPM a 90 km/h), a parte desprendida da biela passou a atuar como um projétil rotativo impulsionado pelo virabrequim, colidindo contra a parede interna da carcaça do bloco do motor e golpeando violentamente o pistão em direção ao cabeçote.
</p>`
    },
    {
      id: 'sec-19',
      titulo: '19. Análise de Falha Mecânica',
      ordem: 19,
      conteudoHtml: `<div class="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
  <h3 class="text-xs font-bold text-slate-900 uppercase">Mecanismos Físicos e Metalúrgicos da Fratura</h3>
  <p class="text-xs text-slate-700 leading-relaxed">
    O exame macrográfico pericial da superfície de fratura do componente revelou com nitidez incontestável as características universais da <strong>Fratura por Fadiga Mecânica de Alto Ciclo (High-Cycle Fatigue)</strong>:
  </p>
  <ul class="list-disc pl-5 space-y-1 text-xs text-slate-700">
    <li><strong>Zona de Iniciação (Origem):</strong> Ponto focal localizado em microdescontinuidade interna de forjamento/fundição do material, atuando como concentrador de tensões (stress raiser);</li>
    <li><strong>Zona de Propagação (Marcas de Praia / Beach Marks):</strong> Região polida apresentando estrias concêntricas progressivas decorrentes dos ciclos repetidos de solicitação alternada durante o funcionamento ordinário do motor;</li>
    <li><strong>Zona de Ruptura Final Catastrófica (Fratura Rápida):</strong> Área de aspecto fibroso/cristalino, onde a seção remanescente não mais suportou o esforço nominal de combustão, rompendo-se bruscamente.</li>
  </ul>
  <p class="text-xs text-slate-600 italic">
    Descartou-se qualquer mecanismo de fratura frágil por impacto térmico imediato, bem como deformação por calço hidráulico (ausência de encurvamento plástico prévio).
  </p>
</div>`
    },
    {
      id: 'sec-20',
      titulo: '20. Análise de Causa Raiz',
      ordem: 20,
      conteudoHtml: `<p>A apuração pericial empregou as consagradas ferramentas de Engenharia da Qualidade e Análise de Falhas (Ishikawa e 5 Porquês):</p>
<div class="my-3 space-y-3">
  <div class="p-3 bg-slate-50 border border-slate-200 rounded text-xs">
    <p class="font-bold text-slate-900 mb-2">1. Diagrama de Ishikawa (Espinha de Peixe — Análise dos 6M):</p>
    <div class="grid grid-cols-2 gap-2 text-slate-700">
      <div><strong>• Máquina:</strong> Projeto do motor dimensionado adequadamente, porém tolerância geométrica vulnerável;</div>
      <div><strong>• Material:</strong> <span class="text-red-700 font-bold">Inclusão/defeito metalúrgico pontual no componente forjado (Fator Causal);</span></div>
      <div><strong>• Mão de Obra:</strong> Condução do motorista sem vícios operacionais;</div>
      <div><strong>• Método:</strong> Plano de manutenção preventiva do fabricante cumprido à risca;</div>
      <div><strong>• Meio Ambiente:</strong> Pista plana, sem alagamentos ou poeira excessiva;</div>
      <div><strong>• Medição:</strong> Parâmetros de calibração eletrônica normais na ECU.</div>
    </div>
  </div>
  <div class="p-3 bg-amber-50/70 border-l-4 border-amber-500 rounded text-xs space-y-1 text-slate-800">
    <p class="font-bold text-amber-950">2. Árvore Lógica dos 5 Porquês (5-Whys):</p>
    <p><strong>1º Por quê o motor parou bruscamente?</strong> Porque o bloco perfurou e houve travamento do pistão;</p>
    <p><strong>2º Por quê o bloco perfurou?</strong> Porque a haste da biela do cilindro rompeu-se e golpeou a parede;</p>
    <p><strong>3º Por quê a biela rompeu-se?</strong> Porque sofreu fratura por fadiga mecânica progressiva;</p>
    <p><strong>4º Por quê a biela fadigou precocemente com baixa quilometragem?</strong> Porque existia uma microinclusão/concentrador de tensões na matriz metálica;</p>
    <p><strong>5º Por quê existia essa microinclusão?</strong> <span class="font-bold text-red-800 underline">VÍCIO OCULTO DE FABRICAÇÃO / CONTROLE DE QUALIDADE DO FORNECEDOR DA PEÇA.</span></p>
  </div>
</div>`
    },
    {
      id: 'sec-21',
      titulo: '21. Análise de Nexo Causal entre Falha e Danos',
      ordem: 21,
      conteudoHtml: `<p>O Nexo de Causalidade direta e necessária entre o vício do componente e todos os danos constatados restou solidamente demonstrado:</p>
<div class="p-3 bg-emerald-50/60 border border-emerald-300 rounded-lg text-xs space-y-2 text-slate-800">
  <p class="font-bold text-emerald-950">Cadeia Causal Ininterrupta:</p>
  <div class="flex items-center space-x-2 font-semibold text-slate-900">
    <span class="px-2 py-1 bg-white border border-slate-300 rounded">Vício Oculto do Material</span>
    <span>&rarr;</span>
    <span class="px-2 py-1 bg-white border border-slate-300 rounded">Nucleação de Trinca por Fadiga</span>
    <span>&rarr;</span>
    <span class="px-2 py-1 bg-white border border-slate-300 rounded">Ruptura Transversal da Biela</span>
    <span>&rarr;</span>
    <span class="px-2 py-1 bg-white border border-slate-300 rounded">Perfuração do Bloco &amp; Danos Secundários</span>
  </div>
  <p class="text-slate-600 mt-2">
    Inexistiu qualquer evento concorrente, intervenção humana externa ou negligência do proprietário que pudesse romper ou mitigar o nexo causal. A quebra do motor decorreu estritamente da falha do componente defeituoso.
  </p>
</div>`
    },
    {
      id: 'sec-22',
      titulo: '22. Avaliação de Possíveis Modos de Falha',
      ordem: 22,
      conteudoHtml: `<p>Confronto técnico sistemático de todas as hipóteses periciais para validação e exclusão fundamentada:</p>
<table class="tiptap-table border-collapse border border-slate-300 w-full my-3">
  <thead>
    <tr>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Hipótese Avaliada</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Mecanismo Físico</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Evidências de Campo</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Status Pericial</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-slate-300 p-2 text-xs font-semibold">1. Falta de Óleo / Lubrificação</td>
      <td class="border border-slate-300 p-2 text-xs">Atrito a seco, fusão de bronzinas e engripamento geral</td>
      <td class="border border-slate-300 p-2 text-xs">Óleo no nível, bronzinas dos outros cilindros íntegras</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#DC2626;font-weight:bold;">DESCARTADA</span></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs font-semibold">2. Calço Hidráulico</td>
      <td class="border border-slate-300 p-2 text-xs">Aspiração de água com flambagem plástica em 'S' da biela</td>
      <td class="border border-slate-300 p-2 text-xs">Filtro de ar seco, sem água no coletor, fratura por fadiga e não compressão</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#DC2626;font-weight:bold;">DESCARTADA</span></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs font-semibold">3. Sobregiro (Over-rev)</td>
      <td class="border border-slate-300 p-2 text-xs">Erro de marcha com flutuação de válvulas e excesso de inércia</td>
      <td class="border border-slate-300 p-2 text-xs">ECU sem registros de rotação acima do corte nominal de fábrica</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#DC2626;font-weight:bold;">DESCARTADA</span></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs font-semibold">4. Quebra de Correia/Corrente</td>
      <td class="border border-slate-300 p-2 text-xs">Perda de sincronismo e colisão primária de válvulas</td>
      <td class="border border-slate-300 p-2 text-xs">Conjunto de sincronismo intacto e perfeitamente no ponto</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#DC2626;font-weight:bold;">DESCARTADA</span></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs font-semibold">5. Fadiga por Vício de Material</td>
      <td class="border border-slate-300 p-2 text-xs">Nucleação de trinca em defeito interno e fratura progressiva</td>
      <td class="border border-slate-300 p-2 text-xs">Marcas de praia visíveis, fratura em regime nominal de carga</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#16A34A;font-weight:bold;">CONFIRMADA</span></td>
    </tr>
  </tbody>
</table>`
    },
    {
      id: 'sec-23',
      titulo: '23. Verificação de Indícios de Mau Uso ou Operação Inadequada',
      ordem: 23,
      conteudoHtml: `<p>A apuração pericial averiguou pormenorizadamente a existência de qualquer elemento indicativo de condução imprópria:</p>
<ul class="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
  <li><strong>Ausência de Reprogramação Eletrônica (Remap / Chip de Potência):</strong> O software e o checksum da ECU foram verificados e atestados como originais de fábrica;</li>
  <li><strong>Ausência de Combustível Adulterado:</strong> Teste de estanqueidade e teor de álcool no combustível aprovados;</li>
  <li><strong>Ausência de Sinais de Condução em Regime de Competição / Tracionamento Abusivo:</strong> Embreagem, semieixos e coxins íntegros, sem marcas de choques torcionais severos;</li>
  <li><strong>Parada Imediata:</strong> Não foram constatados sinais de funcionamento forçado após a perda de pressão de óleo.</li>
</ul>`
    },
    {
      id: 'sec-24',
      titulo: '24. Análise do Histórico de Manutenção',
      ordem: 24,
      conteudoHtml: `<p>O cruzamento dos dados de manutenção com o sinistro atesta a completa regularidade preventiva:</p>
<div class="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 space-y-1">
  <p>• O proprietário observou rigorosamente os prazos temporais e quilométricos prescritos no plano de revisões do fabricante;</p>
  <p>• Todas as manutenções foram efetuadas em rede autorizada, comprovadas por registros em sistema e ordens de serviço chanceladas;</p>
  <p>• Não houve qualquer tipo de intervenção mecânica clandestina ou realizada por oficina desprovida de capacitação técnica.</p>
</div>`
    },
    {
      id: 'sec-25',
      titulo: '25. Avaliação da Integridade dos Componentes',
      ordem: 25,
      conteudoHtml: `<p>Diagnóstico da viabilidade de recuperação técnica versus necessidade de descarte dos componentes do motor:</p>
<table class="tiptap-table border-collapse border border-slate-300 w-full my-3">
  <thead>
    <tr>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Componente / Conjunto</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Estado Residual de Integridade</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Parecer de Engenharia</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-slate-300 p-2 text-xs">Bloco do Motor</td>
      <td class="border border-slate-300 p-2 text-xs">Parede lateral rompida com perda de rigidez torsional e furos</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#DC2626;font-weight:bold;">Condenado / Inviável Soldagem</span></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs">Virabrequim (Árvore de Manivelas)</td>
      <td class="border border-slate-300 p-2 text-xs">Moente danificado com sulcos profundos e perda de têmpera</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#DC2626;font-weight:bold;">Substituição Obrigatória</span></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs">Cabeçote Completo</td>
      <td class="border border-slate-300 p-2 text-xs">Câmara deformada por colisão e sedes/válvulas danificadas</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#DC2626;font-weight:bold;">Substituição / Inviável Retífica</span></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs">Cárter de Óleo</td>
      <td class="border border-slate-300 p-2 text-xs">Amassamento de chapa e acúmulo de fragmentos perfurantes</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#DC2626;font-weight:bold;">Substituição Necessária</span></td>
    </tr>
  </tbody>
</table>`
    },
    {
      id: 'sec-26',
      titulo: '26. Legislação, Normas Técnicas e Referências Aplicáveis',
      ordem: 26,
      conteudoHtml: `<p>A fundamentação teórica, metodológica e normativa deste laudo pericial apoia-se nos seguintes diplomas:</p>
<ul class="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
  <li><strong>ABNT NBR 13771:</strong> Procedimentos e Perícias de Engenharia Diagnóstica;</li>
  <li><strong>ABNT NBR 5462:</strong> Confiabilidade e Mantenabilidade — Terminologia e Metodologia;</li>
  <li><strong>Código de Processo Civil (Lei nº 13.105/2015, Art. 464 e 473):</strong> Requisitos formais da Prova Pericial;</li>
  <li><strong>Resoluções do CONFEA nº 218/1973 e 1.025/2009:</strong> Atribuições de Engenharia Mecânica e ART;</li>
  <li><strong>ASM Handbook, Volume 11:</strong> Failure Analysis and Prevention (American Society for Metals);</li>
  <li><strong>Normas e Publicações Técnicas da SAE International:</strong> Normas de fadiga e dimensionamento automotivo.</li>
</ul>`
    },
    {
      id: 'sec-27',
      titulo: '27. Tabela de Componentes Inspecionados',
      ordem: 27,
      conteudoHtml: `<p>Inventário minucioso de todos os componentes inspecionados durante a desmontagem pericial:</p>
<table class="tiptap-table border-collapse border border-slate-300 w-full my-3">
  <thead>
    <tr>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Item</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Componente Inspecionado</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Subsistema</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Part Number / Ref.</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Estado Físico Encontrado</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Parecer Técnico</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-slate-300 p-2 text-xs">01</td>
      <td class="border border-slate-300 p-2 text-xs font-semibold">Biela do Cilindro Afetado</td>
      <td class="border border-slate-300 p-2 text-xs">Conjunto Móvel</td>
      <td class="border border-slate-300 p-2 text-xs">Genuíno de Fábrica</td>
      <td class="border border-slate-300 p-2 text-xs">Fratura transversal completa por fadiga</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#DC2626;font-weight:bold;">Falha Primária</span></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs">02</td>
      <td class="border border-slate-300 p-2 text-xs font-semibold">Bloco do Motor (Carcaça)</td>
      <td class="border border-slate-300 p-2 text-xs">Estrutural</td>
      <td class="border border-slate-300 p-2 text-xs">Original Gravado</td>
      <td class="border border-slate-300 p-2 text-xs">Janela perfurada por impacto interno</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#DC2626;font-weight:bold;">Dano Secundário Grave</span></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs">03</td>
      <td class="border border-slate-300 p-2 text-xs font-semibold">Virabrequim (Colo Moente)</td>
      <td class="border border-slate-300 p-2 text-xs">Conjunto Móvel</td>
      <td class="border border-slate-300 p-2 text-xs">Genuíno de Fábrica</td>
      <td class="border border-slate-300 p-2 text-xs">Sulcos profundos e perda dimensional</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#DC2626;font-weight:bold;">Dano Secundário Grave</span></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs">04</td>
      <td class="border border-slate-300 p-2 text-xs font-semibold">Pistão do Cilindro Afetado</td>
      <td class="border border-slate-300 p-2 text-xs">Conjunto Móvel</td>
      <td class="border border-slate-300 p-2 text-xs">Genuíno de Fábrica</td>
      <td class="border border-slate-300 p-2 text-xs">Marcas de colisão mecânica no topo</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#DC2626;font-weight:bold;">Dano Secundário</span></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs">05</td>
      <td class="border border-slate-300 p-2 text-xs font-semibold">Cabeçote e Válvulas</td>
      <td class="border border-slate-300 p-2 text-xs">Trem de Válvulas</td>
      <td class="border border-slate-300 p-2 text-xs">Genuíno de Fábrica</td>
      <td class="border border-slate-300 p-2 text-xs">Válvulas empenadas e câmara marcada</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#DC2626;font-weight:bold;">Dano Secundário</span></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs">06</td>
      <td class="border border-slate-300 p-2 text-xs font-semibold">Bomba de Óleo e Pescador</td>
      <td class="border border-slate-300 p-2 text-xs">Lubrificação</td>
      <td class="border border-slate-300 p-2 text-xs">Genuíno de Fábrica</td>
      <td class="border border-slate-300 p-2 text-xs">Rotores íntegros com limalhas na tela</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#D97706;font-weight:bold;">Contaminação Secundária</span></td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs">07</td>
      <td class="border border-slate-300 p-2 text-xs font-semibold">Corrente e Tensores</td>
      <td class="border border-slate-300 p-2 text-xs">Sincronismo</td>
      <td class="border border-slate-300 p-2 text-xs">Genuíno de Fábrica</td>
      <td class="border border-slate-300 p-2 text-xs">Totalmente íntegros no ponto correto</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#16A34A;font-weight:bold;">Conforme / Preservado</span></td>
    </tr>
  </tbody>
</table>`
    },
    {
      id: 'sec-28',
      titulo: '28. Tabela de Danos e Integridade Técnica',
      ordem: 28,
      conteudoHtml: `<p>Mapeamento sistemático de integridade e severidade das avarias observadas no conjunto mecânico:</p>
<table class="tiptap-table border-collapse border border-slate-300 w-full my-3">
  <thead>
    <tr>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Componente Afetado</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Natureza da Avaria</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Grau de Severidade</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Integridade Residual</th>
      <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Destinação Técnica</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-slate-300 p-2 text-xs font-semibold">Biela do Cilindro</td>
      <td class="border border-slate-300 p-2 text-xs">Fratura transversal completa por fadiga</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#DC2626;font-weight:bold;">Catastrófica</span></td>
      <td class="border border-slate-300 p-2 text-xs">0% (Inutilizado)</td>
      <td class="border border-slate-300 p-2 text-xs">Guarda Probatória / Descarte</td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs font-semibold">Bloco do Motor</td>
      <td class="border border-slate-300 p-2 text-xs">Rompimento da parede com janela aberta</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#DC2626;font-weight:bold;">Catastrófica</span></td>
      <td class="border border-slate-300 p-2 text-xs">0% (Estrutura Comprometida)</td>
      <td class="border border-slate-300 p-2 text-xs">Substituição do Bloco / Motor Parcial</td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs font-semibold">Eixo Virabrequim</td>
      <td class="border border-slate-300 p-2 text-xs">Atrito severo com remoção de material</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#DC2626;font-weight:bold;">Grave</span></td>
      <td class="border border-slate-300 p-2 text-xs">15% (Abaixo da Última Medida)</td>
      <td class="border border-slate-300 p-2 text-xs">Substituição por Peça Nova Genuína</td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs font-semibold">Cabeçote de Válvulas</td>
      <td class="border border-slate-300 p-2 text-xs">Impacto mecânico na câmara e válvulas tortas</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#DC2626;font-weight:bold;">Grave</span></td>
      <td class="border border-slate-300 p-2 text-xs">20% (Inviável Retificação)</td>
      <td class="border border-slate-300 p-2 text-xs">Substituição do Cabeçote Completo</td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 text-xs font-semibold">Cárter Inferior</td>
      <td class="border border-slate-300 p-2 text-xs">Deformação plástica e furos</td>
      <td class="border border-slate-300 p-2 text-xs"><span style="color:#D97706;font-weight:bold;">Moderada</span></td>
      <td class="border border-slate-300 p-2 text-xs">10% (Perda de Estanqueidade)</td>
      <td class="border border-slate-300 p-2 text-xs">Substituição do Cárter</td>
    </tr>
  </tbody>
</table>`
    },
    {
      id: 'sec-29',
      titulo: '29. Classificação dos Danos: Primários e Secundários',
      ordem: 29,
      conteudoHtml: `<p>A distinção técnica e jurídica entre danos primários e secundários em cascata é basilar para a liquidação das responsabilidades:</p>
<div class="space-y-3 my-3 text-xs">
  <div class="p-3 bg-red-50/80 border-l-4 border-red-600 rounded-r">
    <p class="font-bold text-red-950 text-sm">DANO PRIMÁRIO (Gatilho Deflagrador Original):</p>
    <p class="text-slate-800 mt-1 leading-relaxed">
      <strong>Fratura por fadiga mecânica cíclica da haste da biela do cilindro especificado.</strong> Trata-se do evento iniciador exclusivo, originado por descontinuidade estrutural interna do material forjado, o qual gerou a ruptura física em funcionamento sob regime de carga normal.
    </p>
  </div>
  <div class="p-3 bg-amber-50/80 border-l-4 border-amber-600 rounded-r">
    <p class="font-bold text-amber-950 text-sm">DANOS SECUNDÁRIOS (Consequenciais em Efeito Cascata):</p>
    <ul class="list-disc pl-5 mt-1 space-y-1 text-slate-800 leading-relaxed">
      <li><strong>Perfuração da parede do bloco do motor:</strong> Causada pelo impacto cinético da ponta da biela quebrada impulsionada pelo virabrequim em rotação;</li>
      <li><strong>Sulcos e danos térmicos no moente do virabrequim:</strong> Decorrentes da perda do apoio correto da bronzina desarticulada;</li>
      <li><strong>Empenamento de válvulas e marcas no topo do pistão:</strong> Provocados pela colisão decorrente do desalinhamento instantâneo do curso;</li>
      <li><strong>Contaminação do cárter por limalha e perda de estanqueidade:</strong> Consequência direta do rompimento do cárter e fragmentação de ligas metálicas.</li>
    </ul>
  </div>
</div>`
    },
    {
      id: 'sec-30',
      titulo: '30. Parecer Técnico Pericial',
      ordem: 30,
      conteudoHtml: `<p>Com respaldo nos exames periciais realizados, nos registros fotográficos macrográficos e na correlação dos dados fáticos com a literatura técnica internacional da Engenharia Mecânica:</p>
<div class="p-4 bg-slate-50 border border-slate-300 rounded-lg text-xs leading-relaxed space-y-2 text-slate-800">
  <p><strong>1. Da Inexistência de Culpabilidade do Usuário:</strong> Ficou plenamente demonstrado que o veículo estava operando em velocidade compatível, com rotações dentro dos limites aceitáveis do fabricante, sem superaquecimento do arrefecimento e com todas as manutenções periódicas devidamente realizadas em concessionária autorizada nos prazos estipulados.</p>
  <p><strong>2. Da Origem Intrínseca da Falha:</strong> O modo de colapso observado caracteriza <em>vício oculto de fabricação (defeito de material/metalúrgico)</em>, insuscetível de detecção pelo usuário ou em revisões preventivas comuns sem ensaios não destrutivos avançados de ultrassom ou radiografia industrial.</p>
  <p><strong>3. Da Responsabilidade Técnica de Fabricação:</strong> O componente que colapsou prematuramente fadigou muito antes de sua vida útil projetada (tipicamente superior a 250.000 km), configurando falha prematura de confiabilidade mecânica imputável ao controle de qualidade da cadeia produtiva do fabricante.</p>
</div>`
    },
    {
      id: 'sec-31',
      titulo: '31. Conclusão Técnica',
      ordem: 31,
      conteudoHtml: `<div class="p-4 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-lg my-3 space-y-2">
  <h3 class="font-bold text-emerald-950 text-sm">CONCLUSÃO PERICIAL CATEGÓRICA</h3>
  <p class="text-slate-800 text-xs leading-relaxed">
    O Engenheiro Mecânico Perito conclui de forma categórica e inequívoca que a avaria catastrófica que vitimou o conjunto motopropulsor do veículo teve como <strong>CAUSA RAIZ PRIMÁRIA</strong> a <strong>FRATURA POR FADIGA MECÂNICA DE ALTO CICLO DA HASTE DA BIELA</strong>, decorrente de <strong>VÍCIO OCULTO DE FABRICAÇÃO E DESCONTINUIDADE METALÚRGICA INTERNA</strong>.
  </p>
  <p class="text-slate-800 text-xs leading-relaxed">
    Todos os demais danos constatados no bloco do motor, virabrequim, cárter e cabeçote configuram <strong>DANOS SECUNDÁRIOS DIRETOS E INEVITÁVEIS</strong> decorrentes da dinâmica inercial de desagregação da biela.
  </p>
  <p class="text-slate-800 text-xs leading-relaxed font-semibold">
    Restam integralmente AFASTADAS quaisquer hipóteses de mau uso, imperícia do condutor, sobregiro, calço hidráulico ou omissão de manutenção preventiva.
  </p>
</div>`
    },
    {
      id: 'sec-32',
      titulo: '32. Considerações Finais',
      ordem: 32,
      conteudoHtml: `<p>Ao encerrar o presente trabalho técnico-pericial, cumpre registrar:</p>
<ul class="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
  <li>As peças mecânicas periciadas (haste e capa da biela fraturada, bronzinas e amostra de óleo) foram devidamente acondicionadas e lacradas, permanecendo sob custódia para eventual exame por assistência técnica ou contraperícia judicial;</li>
  <li>O presente laudo técnico pericial é composto de 35 seções formais sequenciais e foi firmado com respaldo na respectiva Anotação de Responsabilidade Técnica (ART) do CREA-PE;</li>
  <li>Nada mais havendo a relatar, encerra-se o presente instrumento pericial com 35 seções conclusivas.</li>
</ul>`
    },
    {
      id: 'sec-33',
      titulo: '33. Recomendações Técnicas',
      ordem: 33,
      conteudoHtml: `<p>Com base no diagnóstico pericial exarado, formulam-se as seguintes recomendações de engenharia:</p>
<ol class="list-decimal pl-5 space-y-1.5 text-xs text-slate-700">
  <li><strong>Substituição Integral do Motor Parcial (Short Block):</strong> Não realizar tentativas de soldagem do bloco do motor, em virtude da perda irreversível de alinhamento dos mancais e integridade estrutural;</li>
  <li><strong>Substituição do Cabeçote Completo:</strong> Proceder à troca completa do cabeçote e das válvulas empenadas para garantir compressão e estanqueidade adequadas;</li>
  <li><strong>Limpeza Completa do Circuito de Arrefecimento e Óleo:</strong> Efetuar lavagem química pressurizada do radiador de óleo, mangueiras e galerias para eliminação de limalhas residuais que possam contaminar o novo motor;</li>
  <li><strong>Acionamento da Garantia do Fabricante:</strong> Apresentar este laudo pericial formal perante a montadora/concessionária para solicitação de reparo integral em cortesia de garantia técnica (warranty claim).</li>
</ol>`
    },
    {
      id: 'sec-34',
      titulo: '34. Anexos e Evidências Complementares',
      ordem: 34,
      conteudoHtml: `<p>Relação de documentos e ensaios complementares anexados a este laudo pericial:</p>
<ul class="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
  <li><strong>Anexo I:</strong> Relatório Completo de Diagnóstico do Scanner Automotivo (varredura OBD-II, DTCs e Freeze Frame);</li>
  <li><strong>Anexo II:</strong> Cópia das Notas Fiscais e Ordens de Serviço das Revisões Periódicas Realizadas;</li>
  <li><strong>Anexo III:</strong> Cópia do Certificado de Registro e Licenciamento do Veículo (CRLV);</li>
  <li><strong>Anexo IV:</strong> Álbum Fotográfico Pericial com Imagens em Resolução Nativa;</li>
  <li><strong>Anexo V:</strong> Cópia Autenticada da Anotação de Responsabilidade Técnica (ART) junto ao CREA-PE.</li>
</ul>`
    },
    {
      id: 'sec-35',
      titulo: '35. ART / Documentação de Responsabilidade Técnica',
      ordem: 35,
      conteudoHtml: `<div class="p-4 bg-slate-50 border border-slate-300 rounded-lg space-y-3">
  <div class="flex items-center justify-between border-b border-slate-200 pb-2">
    <div>
      <h4 class="font-bold text-slate-900 text-xs uppercase">Chancela de Responsabilidade Técnica Profissional</h4>
      <p class="text-xs text-slate-500">Conselho Regional de Engenharia e Agronomia de Pernambuco — CREA-PE</p>
    </div>
    <span class="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded border border-emerald-300">ART Homologada</span>
  </div>
  <div class="grid grid-cols-2 gap-3 text-xs text-slate-700">
    <p><strong>Engenheiro Mecânico Responsável:</strong> Eng. Vitor Leonardo Cordeiro Linhares</p>
    <p><strong>Registro no CREA-PE:</strong> 182229949-0 | RNP: 1822299490</p>
    <p><strong>Anotação de Responsabilidade Técnica:</strong> [NÚMERO-DA-ART-CREA-PE]</p>
    <p><strong>Código de Autenticidade Digital:</strong> AUT-VL-[HASH-AUTENTICIDADE]</p>
  </div>
  <p class="text-xs text-slate-500 italic border-t border-slate-200 pt-2">
    Documento assinado digitalmente com certificado ICP-Brasil em conformidade com a MP nº 2.200-2/2001 e Lei Federal nº 14.063/2020.
  </p>
</div>`
    }
  ]
};
