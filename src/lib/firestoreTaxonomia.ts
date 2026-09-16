import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface SecaoEspecificaFirestore {
  titulo: string;
  conteudoSugeridoIA?: string;
}

export type TipoRespostaChecklist = 'C_NC_NA' | 'VALOR' | 'SELECAO' | 'FOTO';

export interface ItemChecklistInicialFirestore {
  campo?: string;
  item?: string;
  tipoResposta?: TipoRespostaChecklist;
  unidade?: string;
  opcoes?: string[];
  criterioReferencia?: string;
  obrigatorioFoto?: boolean;
  exigeFotoSeNaoConforme?: boolean;
  statusSugeridoIA?: 'Conforme' | 'Não Conforme' | 'Não Aplicável' | 'Pendente de Verificação em Campo';
  observacaoSugeridaIA?: string;
  valorSugeridoIA?: string | number;
}

export interface DocumentoTipoLaudoFirestore {
  id: string;
  codigo?: string;
  nome: string;
  hrn: boolean;
  temHrn: boolean;
  normasRef: string;
  textoBaseApresentacao: string;
  apresentacaoPadrao: string;
  metodologiaPadrao: string;
  permitePreenchimentoIA?: boolean;
  secoesEspecificas: (string | SecaoEspecificaFirestore)[];
  checklistInicial: (string | ItemChecklistInicialFirestore)[];
  atualizadoEm: string;
}

export const TIPOS_NR12_NR13_FIRESTORE: Record<string, DocumentoTipoLaudoFirestore> = {
  // 1. Laudo de Apreciação / Análise de Risco (HRN e NBR ISO 12100)
  'laudo-de-apreciacao-analise-de-risco-hrn-e-nbr-iso-12100': {
    id: 'laudo-de-apreciacao-analise-de-risco-hrn-e-nbr-iso-12100',
    codigo: 'NR12-HRN',
    nome: 'Laudo de Apreciação / Análise de Risco (HRN e NBR ISO 12100)',
    hrn: true,
    temHrn: true,
    normasRef: 'NR-12 (Portaria MTP 4.219/2022), ABNT NBR ISO 12100, NBR ISO 13849-1',
    textoBaseApresentacao: 'Apreciação de riscos de máquinas e equipamentos industriais fundamentada no método HRN (Hazard Rating Number) e princípios da ABNT NBR ISO 12100, visando mitigar perigos à integridade dos operadores.',
    apresentacaoPadrao: 'Apreciação de riscos de máquinas e equipamentos industriais fundamentada no método HRN (Hazard Rating Number) e princípios da ABNT NBR ISO 12100, visando mitigar perigos à integridade dos operadores.',
    metodologiaPadrao: 'Levantamento geométrico, quantificação de perigos mecânicos e elétricos, cálculo de probabilidade e severidade, e indicação de categoria de segurança (PLr).',
    secoesEspecificas: [
      'Identificação da Máquina (fabricante, modelo, nº de série, ano de fabricação, dados de placa)',
      'Descrição Funcional e Fases de Vida Consideradas (operação normal, preparação/setup, limpeza, manutenção, falha previsível)',
      'Identificação de Perigos por Zona/Ponto de Operação (mecânicos: esmagamento, corte, perfuração, arrasto, cisalhamento, impacto; elétricos; térmicos; ruído; vibração; radiação; ergonômicos; substâncias/emissões)',
      'Apreciação de Risco — Cálculo do HRN por Perigo (fórmula: HRN = LO × FE × DPH × NP, onde LO = Probabilidade de Ocorrência, FE = Frequência de Exposição, DPH = Grau de Dano Possível, NP = Número de Pessoas Expostas)',
      'Classificação do Risco por Faixa de HRN (Trivial, Tolerável, Moderado, Substancial, Intolerável) e priorização',
      'Medidas de Controle Recomendadas, seguindo a Hierarquia de Controle (eliminação → substituição → controles de engenharia → controles administrativos → EPI)',
      'Reavaliação do Risco Residual após Medidas Propostas',
      'Cronograma de Implementação das Medidas'
    ],
    checklistInicial: [
      { campo: "Plaqueta de Identificação — Presença de placa visível com Razão Social, CNPJ, modelo, número de série, ano de fabricação e massa (kg)", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NR-12 item 12.1.7 (Indelével e legível)" },
      { campo: "Avaliação HRN — Probability of Occurrence (LO)", tipoResposta: "SELECAO", opcoes: ["0,03 - Quase impossível", "0,1 - Altamente improvável", "0,5 - Improvável", "1 - Possível", "2 - Provável", "5 - Quase certo", "10 - Certo", "15 - Inevitável"], criterioReferencia: "Metodologia HRN / ISO 12100 (0,03 a 15)" },
      { campo: "Avaliação HRN — Frequency of Exposure (FE)", tipoResposta: "SELECAO", opcoes: ["0,5 - Anual", "1 - Mensal", "1,5 - Semanal", "2,5 - Diária", "4 - Contínua / Horária", "5 - Constante"], criterioReferencia: "Metodologia HRN / ISO 12100 (0,5 a 5)" },
      { campo: "Avaliação HRN — Degree of Possible Harm (DPH)", tipoResposta: "SELECAO", opcoes: ["0,25 - Arranhão / escoriação leve", "0,5 - Laceração / corte leve", "1 - Fratura pequena / reversível", "2 - Fratura grave / perda de falange", "4 - Perda de membro ou olho", "8 - Amputações múltiplas / sequela permanente", "15 - Fatalidade"], criterioReferencia: "Metodologia HRN / ISO 12100 (0,25 a 15)" },
      { campo: "Avaliação HRN — Number of Persons at Risk (NP)", tipoResposta: "SELECAO", opcoes: ["1 - Uma pessoa exposta", "2 - Duas pessoas expostas", "4 - Três a sete pessoas", "8 - Oito a doze pessoas", "12 - Mais de doze pessoas"], criterioReferencia: "Metodologia HRN / ISO 12100 (1 a 12)" },
      { campo: "Score HRN Calculado (LO × FE × DPH × NP)", tipoResposta: "VALOR", unidade: "pontos", criterioReferencia: "Trivial (<1), Tolerável (1-5), Moderado (6-50), Substancial (51-500), Intolerável (>500)" },
      { campo: "Categoria de Segurança (NBR ISO 13849-1 / NBR 14153) — Categoria requerida versus instalada", tipoResposta: "SELECAO", opcoes: ["Cat B / PL a", "Cat 1 / PL b", "Cat 2 / PL c", "Cat 3 / PL d", "Cat 4 / PL e"], criterioReferencia: "ABNT NBR ISO 13849-1 e NBR 14153" },
      { campo: "Proteções Físicas Fixas — Proteções enclausurantes resistentes, fixadas com parafusos ou elementos que exijam ferramentas para remoção", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true, criterioReferencia: "NR-12 item 12.5.2 e NBR ISO 14120" },
      { campo: "Proteções Físicas Móveis Intertravadas — Presença de chaves de segurança com ruptura positiva e sinal codificado ligadas à CLP de segurança/relé", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true, criterioReferencia: "NBR ISO 14119 e NR-12 item 12.5.3" },
      { campo: "Distância de Segurança das Proteções (NBR ISO 13857) — Medição da distância entre a barreira/proteção e a zona de perigo (mm)", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "Tabelas 1 a 4 da ABNT NBR ISO 13857" },
      { campo: "Dispositivos Optoeletrônicos (Cortinas de Luz / Laser) — Muting/blanking configurados, altura do facho e teste de parada ao interromper o feixe", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true, criterioReferencia: "NBR IEC 61496-1/-2" },
      { campo: "Botões de Parada de Emergência — Formato cogumelo, retenção mecânica, ação de desengate giratório/chave, na cor vermelha sobre fundo amarelo", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NBR ISO 13850 e NR-12 item 12.6" },
      { campo: "Reset Manual — Rearme manual obrigatório após parada de emergência ou atuação de proteção móvel (impossibilidade de partida automática)", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true, criterioReferencia: "NR-12 item 12.6.8" },
      { campo: "Comandos Bimanuais (se aplicável) — Atuação síncrona (< 0,5 s), proteção contra acionamento involuntário (antiburla) e posição fora da zona de perigo", tipoResposta: "C_NC_NA", criterioReferencia: "ABNT NBR 14152 / tempo síncrono < 0,5 s" },
      { campo: "Sistemas Hidráulicos e Pneumáticos — Presença de válvulas de alívio, retenção pilotada, manômetros e proteção contra chicoteamento de mangueiras", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true, criterioReferencia: "NR-12 item 12.8 / ISO 4413 / ISO 4414" },
      { campo: "Ergonomia e Posto de Trabalho — Iluminação adequada, comandos ao alcance do operador, ausência de cantos vivos ou posições forçadas", tipoResposta: "C_NC_NA", criterioReferencia: "NR-12 item 12.9 e NR-17" },
      { campo: "Manual e Sinalização de Segurança — Manual em português (BR) disponível no local, pictogramas de alerta de risco colados na máquina", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NR-12 itens 12.11 e 12.12" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 2. Laudo de Adequação e Proteção de Proteções Físicas e Intertravamentos
  'laudo-de-adequacao-e-protecao-de-protecoes-fisicas-e-intertravamentos': {
    id: 'laudo-de-adequacao-e-protecao-de-protecoes-fisicas-e-intertravamentos',
    codigo: 'NR12-PROT',
    nome: 'Laudo de Adequação e Proteção de Proteções Físicas e Intertravamentos',
    hrn: true,
    temHrn: true,
    normasRef: 'ABNT NBR ISO 14119, NBR ISO 14120, NR-12 item 12.5',
    textoBaseApresentacao: 'Laudo de validação das proteções físicas (fixas e móveis) e chaves de intertravamento de segurança.',
    apresentacaoPadrao: 'Laudo de validação das proteções físicas (fixas e móveis) e chaves de intertravamento de segurança.',
    metodologiaPadrao: 'Medição de distâncias de segurança (NBR ISO 13857) e testes de ruptura positiva e tempo de parada dos movimentos perigosos.',
    secoesEspecificas: [
      'Levantamento de Pontos de Operação e Proteções Existentes',
      'Apreciação de Risco (HRN) por Ponto de Perigo Desprotegido ou Inadequadamente Protegido',
      'Cálculo da Distância de Segurança (ABNT NBR ISO 13857 — membros superiores e inferiores)',
      'Definição da Categoria de Segurança do Sistema de Comando (ABNT NBR ISO 13849-1 — Performance Level "PL" e Categoria B/1/2/3/4)',
      'Especificação Técnica das Proteções/Intertravamentos Recomendados (proteção fixa, móvel intertravada, sensível — cortina de luz, tapete de segurança, scanner de área)',
      'Cálculo do Tempo de Parada da Máquina x Posicionamento do Dispositivo de Segurança',
      'Plano de Adequação com Priorização por Nível de Risco'
    ],
    checklistInicial: [
      { campo: "Proteções Físicas Fixas — Fixações enclausurantes resistentes que exijam ferramentas específicas para remoção", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true, criterioReferencia: "NR-12 item 12.5.2 e NBR ISO 14120" },
      { campo: "Proteções Móveis com Intertravamento — Chaves com ruptura positiva, trava mecânica e sinal codificado ligado ao relé de segurança", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true, criterioReferencia: "NBR ISO 14119" },
      { campo: "Distância de Segurança das Proteções (NBR ISO 13857) — Medição exata da barreira à zona perigosa (mm)", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "Conforme tabelas da ABNT NBR ISO 13857" },
      { campo: "Tempo de Parada do Movimento Perigoso (NBR ISO 13855)", tipoResposta: "VALOR", unidade: "ms", criterioReferencia: "Tempo de parada suficiente antes do alcance do membro" },
      { campo: "Dispositivos Optoeletrônicos de Proteção — Cortinas de luz / feixes fotoelétricos com alinhamento e resolução aferidos", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true, criterioReferencia: "NBR IEC 61496-1/-2" },
      { campo: "Categoria de Segurança do Comando (NBR ISO 13849-1)", tipoResposta: "SELECAO", opcoes: ["Cat B / PL a", "Cat 1 / PL b", "Cat 2 / PL c", "Cat 3 / PL d", "Cat 4 / PL e"], criterioReferencia: "Categoria requerida atendida pelo circuito elétrico" },
      { campo: "Botões de Parada de Emergência — Ação positiva, cogumelo vermelho com fundo amarelo e desengate giratório", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NBR ISO 13850 e NR-12 item 12.6" },
      { campo: "Reset Manual — Circuito de rearme manual obrigatório após desarme (sem partida intempestiva)", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true, criterioReferencia: "NR-12 item 12.6.8" },
      { campo: "Comandos Bimanuais — Atuação simultânea (< 0,5 s) e proteção mecânica contra acionamento involuntário", tipoResposta: "C_NC_NA", criterioReferencia: "ABNT NBR 14152" },
      { campo: "Proteção contra Chicoteamento de Mangueiras e Falhas Pneumáticas/Hidráulicas", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true, criterioReferencia: "NR-12 item 12.8 / ISO 4413 / ISO 4414" },
      { campo: "Sinalização de Segurança e Pictogramas nos Pontos de Risco Residual", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NR-12 item 12.11" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 3. Laudo de Validação / Retrofit de Segurança em Máquinas
  'laudo-de-validacao-retrofit-de-seguranca-em-maquinas': {
    id: 'laudo-de-validacao-retrofit-de-seguranca-em-maquinas',
    codigo: 'NR12-RETRO',
    nome: 'Laudo de Validação / Retrofit de Segurança em Máquinas',
    hrn: true,
    temHrn: true,
    normasRef: 'NR-12, ABNT NBR ISO 13849-1 / 13849-2',
    textoBaseApresentacao: 'Atesto de comissionamento e adequação técnica após modernização (retrofit) mecânica e elétrica do parque fabril.',
    apresentacaoPadrao: 'Atesto de comissionamento e adequação técnica após modernização (retrofit) mecânica e elétrica do parque fabril.',
    metodologiaPadrao: 'Inspeção pré e pós-instalação, validação funcional da categoria de comando de segurança e ART de projeto e instalação.',
    secoesEspecificas: [
      'Descrição Técnica da Alteração/Modernização Realizada',
      'Levantamento de Novos Perigos Introduzidos pela Alteração',
      'Reapreciação de Risco Pós-Intervenção (HRN recalculado por perigo novo/alterado)',
      'Validação Funcional das Novas Proteções e Intertravamentos Instalados',
      'Verificação de Conformidade Documental (manual atualizado, esquema elétrico revisado, PPRA/PGR atualizado)',
      'Registro de Treinamento dos Operadores na Nova Configuração'
    ],
    checklistInicial: [
      { campo: "Plaqueta de Identificação e Memorial Descritivo do Retrofit Executado", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NR-12 item 12.1.7 e ART de instalação" },
      { campo: "Validação Funcional das Proteções Fixas e Enclausuramentos Instalados", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true, criterioReferencia: "NBR ISO 14120" },
      { campo: "Validação Funcional das Chaves de Intertravamento e Travamento de Portas", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true, criterioReferencia: "NBR ISO 14119" },
      { campo: "Distância de Segurança Pós-Retrofit (NBR ISO 13857)", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "Conforme norma ABNT NBR ISO 13857" },
      { campo: "Dispositivos Optoeletrônicos / Muting / Blanking com Teste de Parada e Interrupção", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true, criterioReferencia: "NBR IEC 61496-1/-2" },
      { campo: "Categoria de Segurança Requerida vs Instalada Pós-Retrofit", tipoResposta: "SELECAO", opcoes: ["Cat B / PL a", "Cat 1 / PL b", "Cat 2 / PL c", "Cat 3 / PL d", "Cat 4 / PL e"], criterioReferencia: "ABNT NBR ISO 13849-1/-2" },
      { campo: "Sistema de Parada de Emergência e Reset Manual pós-retrofit", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NBR ISO 13850 e NR-12 item 12.6" },
      { campo: "Circuitos Pneumáticos e Hidráulicos de Parada Segura (Válvulas redundantes de alívio)", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true, criterioReferencia: "ISO 4413 / ISO 4414" },
      { campo: "Esquema Elétrico e Diagrama Unifilar Atualizado pós-adequação", tipoResposta: "C_NC_NA", criterioReferencia: "NR-12 item 12.3 e NR-10" },
      { campo: "Manual e Procedimentos de Trabalho Atualizados em Português-BR", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NR-12 itens 12.11 e 12.13" },
      { campo: "Registro de Capacitação e Treinamento dos Operadores na Nova Configuração", tipoResposta: "C_NC_NA", criterioReferencia: "NR-12 item 12.16 e Anexo II" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 4. Laudo de Inspeção de Integridade de Vasos de Pressão
  'laudo-de-inspecao-de-integridade-de-vasos-de-pressao': {
    id: 'laudo-de-inspecao-de-integridade-de-vasos-de-pressao',
    codigo: 'NR13-VASO',
    nome: 'Laudo de Inspeção de Integridade de Vasos de Pressão',
    hrn: false,
    temHrn: false,
    normasRef: 'NR-13 (Portaria MTP 1.846/2022), ASME Seção VIII Div. 1',
    textoBaseApresentacao: 'Inspeção de segurança periódica e extraordinária em vasos de pressão, reservatórios de ar comprimido e acumuladores hidropneumáticos.',
    apresentacaoPadrao: 'Inspeção de segurança periódica e extraordinária em vasos de pressão, reservatórios de ar comprimido e acumuladores hidropneumáticos.',
    metodologiaPadrao: 'Exame visual interno e externo, ensaio de medição de espessura por ultrassom, calibração da válvula de segurança (PSV) e manômetro com cálculo de PMTA.',
    secoesEspecificas: [
      'Dados de Projeto e Placa de Identificação (PMTA, volume, fluido, categoria do fluido)',
      'Enquadramento de Categoria (Cálculo P × V conforme Anexo I da NR-13)',
      'Inspeção de Segurança Externa (estado da carcaça, isolamento, suportes, pintura anticorrosiva)',
      'Inspeção de Segurança Interna (quando acessível: corrosão interna, incrustações, trincas)',
      'Ensaios Não Destrutivos Realizados (ultrassom para medição de espessura, líquido penetrante em soldas, quando aplicável)',
      'Verificação do Dispositivo de Alívio de Pressão (válvula de segurança — calibração, prazo, capacidade de alívio)',
      'Cálculo da Vida Útil Remanescente com Base na Taxa de Corrosão',
      'Definição da Periodicidade da Próxima Inspeção (conforme categoria e resultado)'
    ],
    checklistInicial: [
      { campo: "Prontuário do Fabricante — Presença do código de projeto (ASME Seção VIII, NR-13), folha de dados, desenho geral e PMTA", tipoResposta: "C_NC_NA", criterioReferencia: "NR-13 item 13.5.1.6" },
      { campo: "Registro de Segurança (Livro de RNC/Ocorrências) — Atualizado, assinado e sob responsabilidade do PH", tipoResposta: "C_NC_NA", criterioReferencia: "NR-13 item 13.5.1.8" },
      { campo: "Placa de Identificação Indestrutível — Fixada no corpo, contendo PMTA, pressão de teste hidrostático, número do vaso, código e ano", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NR-13 item 13.5.1.4 (Indelével)" },
      { campo: "Categoria do Equipamento — Categoria do vaso (I a V) calculada pelo produto P × V (MPa · m³)", tipoResposta: "SELECAO", opcoes: ["Categoria I (P×V >= 8 ou Fluido Grupo 1)", "Categoria II (P×V >= 2 e < 8)", "Categoria III (P×V >= 1 e < 2)", "Categoria IV (P×V >= 0,25 e < 1)", "Categoria V (P×V < 0,25)"], criterioReferencia: "NR-13 Anexo I (Classificação de Vasos)" },
      { campo: "Pressão Máxima de Trabalho Admissível (PMTA) — Valor nominal indicado no prontuário ou recalculado", tipoResposta: "VALOR", unidade: "kgf/cm²", criterioReferencia: "Conforme placa e memória de cálculo" },
      { campo: "Válvula de Segurança (PSV) — Presença de lacre intacto e plaqueta da última calibração", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NR-13 item 13.5.1.2" },
      { campo: "Válvula de Segurança (PSV) — Pressão de abertura/disparo aferida", tipoResposta: "VALOR", unidade: "kgf/cm²", criterioReferencia: "<= PMTA do vaso de pressão" },
      { campo: "Válvula de Segurança (PSV) — Data da última calibração em bancada/campo", tipoResposta: "VALOR", unidade: "data", criterioReferencia: "Dentro do prazo normativo (máximo 12 a 36 meses conforme categoria)" },
      { campo: "Manômetro de Operação — Escala com marcação visível da PMTA (faixa no terço médio) e precisão operacional", tipoResposta: "C_NC_NA", criterioReferencia: "NR-13 item 13.5.1.3" },
      { campo: "Dispositivo de Drenagem — Presença e operatividade de dreno manual ou purgador automático no ponto mais baixo", tipoResposta: "C_NC_NA", criterioReferencia: "NR-13 item 13.5.1.2 alínea d" },
      { campo: "Inspeção Externa (Corpo, Tampos e Suportes) — Ausência de deformações, trincas, mossa, corrosão acentuada ou avarias em chumbadores", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NR-13 item 13.5.4" },
      { campo: "Medição de Espessura por Ultrassom (MEUS) — Espessura do Costado (mínima encontrada em mm)", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "> Espessura mínima calculada de projeto" },
      { campo: "Medição de Espessura por Ultrassom (MEUS) — Espessura do Tampo Superior/Inferior (mínima encontrada em mm)", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "> Espessura mínima calculada de projeto" },
      { campo: "Medição de Espessura por Ultrassom (MEUS) — Espessura Mínima Admissível Calculada (mm)", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "Calculada pela fórmula ASME Sec VIII Div 1" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 5. Laudo de Inspeção Periódica / Extraordinária de Caldeiras
  'laudo-de-inspecao-periodica-extraordinaria-de-caldeiras': {
    id: 'laudo-de-inspecao-periodica-extraordinaria-de-caldeiras',
    codigo: 'NR13-CALD',
    nome: 'Laudo de Inspeção Periódica / Extraordinária de Caldeiras',
    hrn: false,
    temHrn: false,
    normasRef: 'NR-13, ASME Seção I, ABNT NBR 12177',
    textoBaseApresentacao: 'Inspeção regulamentar de caldeiras a vapor (aquatubulares e flamotubulares) por Profissional Habilitado (PH).',
    apresentacaoPadrao: 'Inspeção regulamentar de caldeiras a vapor (aquatubulares e flamotubulares) por Profissional Habilitado (PH).',
    metodologiaPadrao: 'Inspeção visual externa e interna com boroscopia, ensaio de partículas magnéticas ou ultrassom nos espelhos e tubos, teste de acumulação e acionamento manual de dispositivos.',
    secoesEspecificas: [
      'Dados de Projeto e Categoria da Caldeira (potência, pressão de trabalho, tipo de combustível)',
      'Inspeção Externa (casco, estrutura de sustentação, isolamento térmico, tubulações de vapor/água)',
      'Inspeção Interna (fornalha, feixe tubular, incrustações, corrosão, trincas)',
      'Teste Hidrostático (pressão de teste aplicada, tempo de estabilização, resultado)',
      'Verificação e Calibração de Válvulas de Segurança e Controles de Nível',
      'Verificação de Instrumentação de Controle (pressostatos, manômetros, controles de queima)',
      'Atualização do Livro de Registro de Segurança de Caldeiras'
    ],
    checklistInicial: [
      { campo: "Prontuário do Fabricante — Presença do código de projeto (ASME Seção I, NR-13), folha de dados, desenho e PMTA", tipoResposta: "C_NC_NA", criterioReferencia: "NR-13 item 13.4.1.5" },
      { campo: "Registro de Segurança (Livro de Caldeira) — Atualizado, assinado e sob responsabilidade do Profissional Habilitado (PH)", tipoResposta: "C_NC_NA", criterioReferencia: "NR-13 item 13.4.1.7" },
      { campo: "Placa de Identificação Indestrutível — Fixada na carcaça, contendo PMTA, capacidade de produção de vapor, código e ano", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NR-13 item 13.4.1.3" },
      { campo: "Categoria do Equipamento — Enquadramento conforme NR-13 (Categoria A ou B)", tipoResposta: "SELECAO", opcoes: ["Categoria A (Pressão de operação >= 1960 kPa / 19,98 kgf/cm²)", "Categoria B (Demais caldeiras não enquadradas na Cat A)"], criterioReferencia: "NR-13 item 13.4.1.2" },
      { campo: "Pressão Máxima de Trabalho Admissível (PMTA)", tipoResposta: "VALOR", unidade: "kgf/cm²", criterioReferencia: "Valor nominal de prontuário" },
      { campo: "Injetores e Alimentação de Água — Existência de no mínimo 2 sistemas independentes de alimentação sob pressão", tipoResposta: "C_NC_NA", criterioReferencia: "NR-13 item 13.4.1.3 alínea c" },
      { campo: "Indicadores de Nível de Água — Mínimo de 2 indicadores diretos de nível funcionais e purga dos visores operável", tipoResposta: "C_NC_NA", criterioReferencia: "NR-13 item 13.4.1.3 alínea d" },
      { campo: "Intertravamento de Queimador/Combustão — Bloqueio automático de combustível por baixo nível de água ou falha de chama", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true, criterioReferencia: "NR-13 item 13.4.1.4" },
      { campo: "Calibração de Instrumentos e PSVs — Mínimo de 2 válvulas de segurança acopladas para caldeiras Cat A/B com lacre e plaqueta", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NR-13 item 13.4.1.3 alínea b" },
      { campo: "Válvula de Segurança (PSV) 1 — Pressão de abertura/disparo aferida (kgf/cm²)", tipoResposta: "VALOR", unidade: "kgf/cm²", criterioReferencia: "<= PMTA" },
      { campo: "Válvula de Segurança (PSV) 2 — Pressão de abertura/disparo aferida (kgf/cm²)", tipoResposta: "VALOR", unidade: "kgf/cm²", criterioReferencia: "<= 1,03 × PMTA" },
      { campo: "Data da Última Calibração das Válvulas de Segurança", tipoResposta: "VALOR", unidade: "data", criterioReferencia: "Conforme prazo máximo normativo da NR-13" },
      { campo: "Manômetro de Operação — Escala com indicação visível da PMTA e aferição vigente", tipoResposta: "C_NC_NA", criterioReferencia: "NR-13 item 13.4.1.3 alínea a" },
      { campo: "Inspeção Interna e Externa — Ausência de superaquecimento, incrustações, trincas nos espelhos ou vazamento nos tubos", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NR-13 item 13.4.4" },
      { campo: "Medição de Espessura por Ultrassom do Tubo/Casco (mínima encontrada em mm)", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "> Espessura mínima admissível de cálculo" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 6. Laudo de Integridade Estrutural de Tubulações e Tanques de Armazenamento
  'laudo-de-integridade-estrutural-de-tubulacoes-e-tanques-de-armazenamento': {
    id: 'laudo-de-integridade-estrutural-de-tubulacoes-e-tanques-de-armazenamento',
    codigo: 'NR13-TUBO',
    nome: 'Laudo de Integridade Estrutural de Tubulações e Tanques de Armazenamento',
    hrn: false,
    temHrn: false,
    normasRef: 'NR-13 anexo II, ASME B31.3, API 650 / API 653',
    textoBaseApresentacao: 'Inspeção técnica de integridade em linhas de tubulação industrial contendo fluidos perigosos de classes A e B e tanques metálicos de armazenamento.',
    apresentacaoPadrao: 'Inspeção técnica de integridade em linhas de tubulação industrial contendo fluidos perigosos de classes A e B e tanques metálicos de armazenamento.',
    metodologiaPadrao: 'Varredura de corrosão, medição de espessura de parede, análise de suportação mecânica e verificação de pontos críticos de dilatação térmica.',
    secoesEspecificas: [
      'Mapeamento Isométrico/Esquemático da Rede ou Identificação do Tanque',
      'Definição dos Pontos Críticos de Inspeção (soldas, curvas, derivações, suportes)',
      'Inspeção Visual Externa (corrosão, deformações, vazamentos aparentes)',
      'Ensaios de Espessura por Ultrassom nos Pontos Críticos',
      'Avaliação do Estado de Suportes, Ancoragens e Isolamento Térmico',
      'Avaliação de Proteção Catódica (para tanques enterrados, quando aplicável)',
      'Cálculo da Taxa de Corrosão e Estimativa de Vida Útil Remanescente'
    ],
    checklistInicial: [
      { campo: "Plano de Inspeção de Tubulações — Mapeamento de linhas (padrão de cores NBR 6493), identificação de fluido e sentido do fluxo", tipoResposta: "C_NC_NA", criterioReferencia: "NR-13 item 13.6.1 e NBR 6493" },
      { campo: "Registro de Segurança e Histórico de Manutenção de Linhas e Tanques", tipoResposta: "C_NC_NA", criterioReferencia: "NR-13 item 13.6.2" },
      { campo: "Fluido e Classe de Risco da Tubulação / Tanque", tipoResposta: "SELECAO", opcoes: ["Classe A (Fluidos inflamáveis, tóxicos com limite tolerância <= 20 ppm, hidrogênio)", "Classe B (Fluidos combustíveis temp fulgor < 93ºC, gases tóxicos)", "Classe C (Vapor de água, gases asfixiantes simples, ar comprimido)", "Classe D (Água e outros fluidos não classificados)"], criterioReferencia: "NR-13 Anexo II item 1.1" },
      { campo: "Pressão de Operação e Projeto da Linha (kgf/cm² ou bar)", tipoResposta: "VALOR", unidade: "kgf/cm²", criterioReferencia: "Conforme folha de dados da linha" },
      { campo: "Pontos de Inspeção de Corrosão (PIC) — Mapeamento e medição ultrassônica de curvas e derivações críticas", tipoResposta: "C_NC_NA", criterioReferencia: "ASME B31.3 / API 570" },
      { campo: "Espessura Mínima Medida nos Pontos Críticos (PICs)", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "Medição de campo por ultrassom" },
      { campo: "Espessura Mínima Admissível Calculada para a Linha (mm)", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "Espessura de aposentadoria conforme ASME B31.3" },
      { campo: "Suportação e Guias Mecânicas — Integridade de molas pendulares, berços e tirantes sem flambagem ou restrição", tipoResposta: "C_NC_NA", criterioReferencia: "ASME B31.3" },
      { campo: "Válvulas de Alívio (PSVs) e Bloqueio de Linha — Estanqueidade, identificação de manobra e calibração de PSVs", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NR-13 item 13.6.1.2" },
      { campo: "Juntas de Expansão e Flanges — Ausência de gotejamentos, desvios angulares ou parafusos com torque inadequado", tipoResposta: "C_NC_NA", criterioReferencia: "ASME B31.3" },
      { campo: "Inspeção Visual Externa (Corrosão sob Isolamento - CSI e atmosférica)", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "API 570 / NBR 15217" }
    ],
    atualizadoEm: new Date().toISOString()
  }
};

// Aliases mapping (short IDs to full IDs)
export const ALIASES_TIPOS_LAUDO: Record<string, string> = {
  'laudo-nr12-hrn': 'laudo-de-apreciacao-analise-de-risco-hrn-e-nbr-iso-12100',
  'laudo-nr12-protecoes': 'laudo-de-adequacao-e-protecao-de-protecoes-fisicas-e-intertravamentos',
  'laudo-nr12-retrofit': 'laudo-de-validacao-retrofit-de-seguranca-em-maquinas',
  'laudo-nr13-vasos': 'laudo-de-inspecao-de-integridade-de-vasos-de-pressao',
  'laudo-nr13-caldeiras': 'laudo-de-inspecao-periodica-extraordinaria-de-caldeiras',
  'laudo-nr13-tubulacoes': 'laudo-de-integridade-estrutural-de-tubulacoes-e-tanques-de-armazenamento'
};

export const TIPOS_VEICULAR_FIRESTORE: Record<string, DocumentoTipoLaudoFirestore> = {
  // 1. Laudo de Inspeção de Frota Operacional (Leves e Utilitários)
  'laudo-de-inspecao-de-frota-operacional-leves-e-utilitarios': {
    id: 'laudo-de-inspecao-de-frota-operacional-leves-e-utilitarios',
    codigo: 'VEIC-FROTA',
    nome: 'Laudo de Inspeção de Frota Operacional (Leves e Utilitários)',
    hrn: false,
    temHrn: false,
    normasRef: 'Resoluções CONTRAN, Código de Trânsito Brasileiro (CTB), ABNT NBR 14040',
    textoBaseApresentacao: 'Auditoria técnica e mecânica preventiva de frotas corporativas, utilitários e vans para atendimento a requisitos de segurança viária.',
    apresentacaoPadrao: 'Auditoria técnica e mecânica preventiva de frotas corporativas, utilitários e vans para atendimento a requisitos de segurança viária.',
    metodologiaPadrao: 'Avaliação de suspensão, sistema de frenagem, direção, pneumáticos, emissões visíveis e integridade de chassi.',
    secoesEspecificas: [
      'Identificação do Veículo (placa, chassi, renavam, marca/modelo, ano de fabricação/modelo, quilometragem)',
      'Checklist Técnico de Itens Obrigatórios (CONTRAN) por Sistema (freios, direção, suspensão, elétrico, estrutural)',
      'Avaliação de Documentação e Regularidade (CRLV, licenciamento, IPVA quando aplicável)',
      'Estimativa de Risco Operacional por Item Não Conforme (severidade e urgência de correção)',
      'Plano Corretivo por Veículo, com Priorização e Prazo'
    ],
    checklistInicial: [
      { campo: "Chassi gravado (sem sinais de remarcação), número do motor, placa, CRLV e Hodômetro", tipoResposta: "VALOR", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Conferência física dos caracteres de identificação e CRLV" },
      { campo: "Faróis principais (alto/baixo), luzes de posição (lanterna), faróis de neblina e DRL", tipoResposta: "C_NC_NA", criterioReferencia: "Resolução CONTRAN nº 970/2022" },
      { campo: "Luzes de freio, indicação de direção (pisca), luz de ré e luz de placa", tipoResposta: "C_NC_NA", criterioReferencia: "Resolução CONTRAN nº 970/2022" },
      { campo: "Alinhamento do facho luminoso dos faróis e integridade das lentes", tipoResposta: "C_NC_NA", criterioReferencia: "Resolução CONTRAN nº 970/2022" },
      { campo: "Faixas retrorrefletivas (quando aplicável a veículos de carga/utilitários)", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Resolução CONTRAN nº 948/2022" },
      { campo: "Profundidade dos sulcos da banda de rodagem (TWI) de todos os pneus em serviço", tipoResposta: "VALOR", unidade: "mm", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Resolução CONTRAN nº 913/2022 (mínimo 1,6 mm)" },
      { campo: "Pneu sobressalente (estepe) — Calibragem, profundidade de sulco (≥ 1,6 mm) e fixação", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "Resolução CONTRAN nº 913/2022" },
      { campo: "Estado geral das rodas (ausência de trincas, empenamentos ou soldas) e aperto dos parafusos", tipoResposta: "C_NC_NA", criterioReferencia: "Integridade estrutural das rodas" },
      { campo: "Freio de serviço — Eficiência de frenagem em teste dinâmico e resposta do pedal", tipoResposta: "C_NC_NA", criterioReferencia: "Resolução CONTRAN nº 960/2022" },
      { campo: "Freio de estacionamento — Retenção estática eficaz do veículo carregado", tipoResposta: "C_NC_NA", criterioReferencia: "Alavanca/mecanismo elétrico de freio" },
      { campo: "Nível, estado e ponto de ebulição do fluido de freio", tipoResposta: "VALOR", unidade: "°C", criterioReferencia: "DOT 3 / DOT 4 / DOT 5.1 (norma ABNT NBR 9292)" },
      { campo: "Espessura das pastilhas e lonas de freio / estado dos discos e tambores", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "Espessura mínima conforme especificação do fabricante" },
      { campo: "Sistema pneumático de freio (caminhões/ônibus) — Pressão de trabalho, válvulas e tempo de recarga", tipoResposta: "VALOR", unidade: "bar", criterioReferencia: "Estanqueidade e pressão de operação" },
      { campo: "Folga no volante de direção e alinhamento do trem dianteiro", tipoResposta: "C_NC_NA", criterioReferencia: "Folga máxima admissível conforme manual" },
      { campo: "Articulações, terminais de direção, barras de ligação e coifas", tipoResposta: "C_NC_NA", criterioReferencia: "Inspeção visual e tátil sob esforço" },
      { campo: "Estado dos amortecedores (ausência de vazamentos hidráulicos e eficácia no teste de oscilação)", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Sem vazamento de óleo ou folga nas buchas" },
      { campo: "Molas helicoidais, feixes de molas, lâminas e bolsas de ar (sem trincas ou arqueamento incorreto)", tipoResposta: "C_NC_NA", criterioReferencia: "Resolução CONTRAN nº 960/2022" },
      { campo: "Buchas de bandeja, pivôs de suspensão e barra estabilizadora", tipoResposta: "C_NC_NA", criterioReferencia: "Ausência de folgas axiais e radiais" },
      { campo: "Longarinas, travessas e subchassi (ausência de trincas, soldas irregulares, corrosão severa)", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Integridade estrutural do chassi/monobloco" },
      { campo: "Assoalho, caixas de roda e para-lamas (fixação e ausência de deformações graves)", tipoResposta: "C_NC_NA", criterioReferencia: "Segurança de carroceria" },
      { campo: "Nível de emissão de fumaça preta em aceleração livre (veículos diesel) — Escala Ringelmann", tipoResposta: "VALOR", unidade: "padrão Ringelmann", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Resolução CONAMA nº 418/2009 e Portaria IBAMA" },
      { campo: "Sistema de escapamento (integridade do catalisador, silencioso e ausência de ruído excessivo)", tipoResposta: "C_NC_NA", criterioReferencia: "Resolução CONAMA nº 418/2009" },
      { campo: "Tensão da bateria em repouso e sob carga do alternador", tipoResposta: "VALOR", unidade: "V", criterioReferencia: "Faixa 12,4V - 14,5V (sistemas 12V) ou 24V - 28,5V" },
      { campo: "Integridade de chicotes elétricos, caixa de fusíveis e aterramentos", tipoResposta: "C_NC_NA", criterioReferencia: "Sem fios desencapados ou emendas sem isolamento" },
      { campo: "Cintos de segurança de 3 pontos em todos os assentos com retenção inercial funcional", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Resolução CONTRAN nº 960/2022" },
      { campo: "Airbags frontais e laterais (luz espia no painel apaga após teste de partida)", tipoResposta: "C_NC_NA", criterioReferencia: "Sem avarias no sistema SRS" },
      { campo: "Triângulo de sinalização, macaco compatível com a carga e chave de roda", tipoResposta: "C_NC_NA", criterioReferencia: "Equipamentos obrigatórios CTB Art. 105" },
      { campo: "Extintor de incêndio tipo ABC (quando aplicável ou exigido) com manômetro na faixa verde e lacre", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Resolução CONTRAN nº 919/2022" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 2. Laudo Técnico para Transporte Escolar
  'laudo-tecnico-para-transporte-escolar': {
    id: 'laudo-tecnico-para-transporte-escolar',
    codigo: 'VEIC-ESC',
    nome: 'Laudo Técnico para Transporte Escolar',
    hrn: false,
    temHrn: false,
    normasRef: 'Art. 136 a 139 do CTB, Portarias DETRAN-PE, ABNT NBR 15320, ABNT NBR 17075:2022',
    textoBaseApresentacao: 'Laudo pericial de inspeção semestral obrigatória para veículos destinados à condução coletiva de escolares.',
    apresentacaoPadrao: 'Laudo pericial de inspeção semestral obrigatória para veículos destinados à condução coletiva de escolares.',
    metodologiaPadrao: 'Verificação minuciosa dos cintos de segurança em todos os assentos, tacógrafo selado pelo INMETRO, faixas identificadoras e janelas com abertura limitada.',
    secoesEspecificas: [
      'Identificação do Veículo e Documentação Específica de Transporte Escolar',
      'Verificação de Cintos de Segurança (individuais, por assento, incluindo lotação máxima)',
      'Verificação do Registrador Instantâneo de Velocidade e Tempo (Tacógrafo)',
      'Verificação de Portas de Emergência, Saídas e Sinalização de Embarque/Desembarque',
      'Verificação da Caracterização Externa Regulamentar (pintura amarela padronizada, faixa "ESCOLAR", identificação da empresa/órgão)',
      'Verificação de Idade Máxima do Veículo (conforme legislação municipal/estadual aplicável)',
      'Conformidade com ABNT NBR 17075:2022 (item a item da norma)'
    ],
    checklistInicial: [
      { campo: "Autorização do DETRAN / Município para transporte escolar e regularidade do CRLV", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "CTB Art. 136, inciso II e normas municipais" },
      { campo: "Idade do veículo dentro do limite legal/regulamentar aplicável", tipoResposta: "VALOR", unidade: "anos", criterioReferencia: "Limite regulamentar municipal/estadual (ex: máx. 10 a 15 anos)" },
      { campo: "Lotação máxima e capacidade nominal de passageiros escolares afixada e respeitada", tipoResposta: "VALOR", unidade: "passageiros", criterioReferencia: "CTB Art. 136 e certificado de registro do veículo" },
      { campo: "Tacógrafo — Registrador instantâneo e inalterável de velocidade e tempo instalado, operante e selado", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "CTB Art. 136, inciso IV" },
      { campo: "Tacógrafo — Certificado de Verificação Metrológica do INMETRO vigente", tipoResposta: "VALOR", unidade: "data/nº", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Portarias INMETRO / validade bianual" },
      { campo: "Tacógrafo — Discos, fita ou registros eletrônicos de bordo em conformidade técnica", tipoResposta: "C_NC_NA", criterioReferencia: "Resoluções CONTRAN aplicáveis ao registrador" },
      { campo: "Pintura e Caracterização Externa — Faixa horizontal amarela de 40 cm com a inscrição 'ESCOLAR' em preto", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "CTB Art. 136, inciso III (meia altura da carroceria)" },
      { campo: "Pintura e Caracterização Externa — Sinalização refletiva e dísticos com dimensões e legibilidade regulamentares", tipoResposta: "C_NC_NA", criterioReferencia: "Faixas retrorrefletivas laterais e traseiras" },
      { campo: "Identificação da empresa/prestador autônomo e número de registro municipal afixados", tipoResposta: "C_NC_NA", criterioReferencia: "Normas da secretaria municipal de transportes" },
      { campo: "Cintos de Segurança — Cintos individuais para todos os assentos (quantidade e retenção inercial)", tipoResposta: "VALOR", unidade: "unidades", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "CTB Art. 136, inciso V (igual à lotação)" },
      { campo: "Janelas e Vidros — Janelas corrediças com abertura máxima limitada a 10 cm na parte superior", tipoResposta: "VALOR", unidade: "cm", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "CTB Art. 136, item limitador de abertura (≤ 10 cm)" },
      { campo: "Saídas de Emergência — Portas e janelas de emergência e alçapão de teto sinalizados e desobstruídos", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Mecanismo de abertura rápida testado / ABNT NBR 15320" },
      { campo: "Dispositivo de Visão Indireta — Espelhos retrovisores convexos adicionais ou câmera/sensor de ré", tipoResposta: "C_NC_NA", criterioReferencia: "Visibilidade completa dos pontos cegos ao redor do veículo" },
      { campo: "Luzes de Advertência — Luzes intermitentes de advertência (pisca-alerta / lanternas de parada)", tipoResposta: "C_NC_NA", criterioReferencia: "CTB Art. 136, inciso VI" },
      { campo: "Piso/assoalho com revestimento antiderrapante e ausência de cantos vivos ou pontas cortantes", tipoResposta: "C_NC_NA", criterioReferencia: "Segurança física dos alunos e acessibilidade" },
      { campo: "Extintor de Incêndio — Extintor tipo ABC com manômetro no verde e lacre, ao alcance do condutor", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Resolução CONTRAN nº 919/2022" },
      { campo: "Condutor — CNH categoria D ou E com credencial e curso específico de condutor escolar vigente", tipoResposta: "C_NC_NA", criterioReferencia: "CTB Art. 138 (maior de 21 anos, sem infrações graves/gravíssimas)" },
      { campo: "Conformidade item a item com a ABNT NBR 17075:2022 (transporte escolar)", tipoResposta: "C_NC_NA", criterioReferencia: "Requisitos de segurança construtiva da norma brasileira" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 3. Laudo Pericial de Reclassificação de Monta Veicular
  'laudo-pericial-de-reclassificacao-de-monta-veicular': {
    id: 'laudo-pericial-de-reclassificacao-de-monta-veicular',
    codigo: 'VEIC-MONTA',
    nome: 'Laudo Pericial de Reclassificação de Monta Veicular',
    hrn: false,
    temHrn: false,
    normasRef: 'Resolução CONTRAN nº 810/2020 e Portarias SENATRAN',
    textoBaseApresentacao: 'Laudo pericial de engenharia mecânica para instrução de processo de reclassificação de dano veicular (Pequena, Média ou Grande Monta) perante o DETRAN.',
    apresentacaoPadrao: 'Laudo pericial de engenharia mecânica para instrução de processo de reclassificação de dano veicular (Pequena, Média ou Grande Monta) perante o DETRAN.',
    metodologiaPadrao: 'Preenchimento do Relatório de Avarias oficial do CONTRAN, medição de alinhamento de longarinas com gabarito de chassi e documentação fotográfica detalhada.',
    secoesEspecificas: [
      'Identificação do Veículo e Histórico do Sinistro (data, natureza do sinistro, monta anterior registrada)',
      'Álbum Fotográfico Categorizado (frente, traseira, laterais, teto, assoalho, motor, interior, numeração de chassi)',
      'Verificação da Numeração de Chassi e Gravação (autenticidade, ausência de indícios de adulteração)',
      'Avaliação Estrutural por Componente (colunas, soleiras, teto, assoalho, longarinas, travessas)',
      'Avaliação de Sistemas Críticos (direção, freios, suspensão, airbags, sistema elétrico)',
      'Enquadramento de Monta (Pequena, Média ou Grande) conforme Resolução CONTRAN nº 810/2020, com memorial descritivo da classificação',
      'Parecer Técnico Conclusivo sobre Viabilidade de Regularização'
    ],
    checklistInicial: [
      { campo: "Boletim de Ocorrência Policial e Relatório de Avarias do DETRAN/Polícia Rodoviária", tipoResposta: "VALOR", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Resolução CONTRAN nº 810/2020 e Portarias SENATRAN" },
      { campo: "Classificação Inicial de Dano atribuída pela autoridade de trânsito no ato do sinistro", tipoResposta: "SELECAO", opcoes: ["Pequena Monta", "Média Monta", "Grande Monta"], criterioReferencia: "Relatório de avarias inicial a ser reclassificado" },
      { campo: "Gravação do Chassi e Motor — Autenticidade, integridade dos caracteres e ausência de adulteração", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Conferência ótica/metalográfica das gravações originais" },
      { campo: "Região Dianteira — Painel frontal, travessas dianteiras, para-choque e alma metálica", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Resolução CONTRAN 810/2020 - Anexo I (Item 1)" },
      { campo: "Longarinas Dianteiras (Esquerda e Direita) — Avaliação de vincos, amassamento, trincas ou corte", tipoResposta: "SELECAO", opcoes: ["Sem Danos", "Dano Leve Recuperável", "Deformação Estrutural Grave", "Perda Total"], obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Resolução CONTRAN 810/2020 - Anexo I (Item 2)" },
      { campo: "Torres dos Amortecedores e Caixas de Roda Dianteiras", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Resolução CONTRAN 810/2020 - Anexo I (Item 3)" },
      { campo: "Colunas A (Dianteiras / Moldura do Para-brisa) Esquerda e Direita", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Resolução CONTRAN 810/2020 - Anexo I (Item 4)" },
      { campo: "Colunas B (Centrais / Batentes das Portas) Esquerda e Direita", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Resolução CONTRAN 810/2020 - Anexo I (Item 5)" },
      { campo: "Colunas C/D (Traseiras) Esquerda e Direita", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Resolução CONTRAN 810/2020 - Anexo I (Item 6)" },
      { campo: "Soleiras e Caixas de Ar Inferiores (ausência de torção, amassamento ou esmagamento)", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Resolução CONTRAN 810/2020 - Anexo I (Item 7)" },
      { campo: "Assoalho e Túnel Central da Carroceria / Monobloco", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Resolução CONTRAN 810/2020 - Anexo I (Item 8)" },
      { campo: "Armação do Teto e Travessas Superiores da Carroceria", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Resolução CONTRAN 810/2020 - Anexo I (Item 9)" },
      { campo: "Longarinas Traseiras e Painel Traseiro", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Resolução CONTRAN 810/2020 - Anexo I (Item 10)" },
      { campo: "Módulos de Airbag (Frontais, Laterais, Cortina) — Estado e integridade dos atuadores", tipoResposta: "SELECAO", opcoes: ["Não Acionados / Íntegros", "Acionados Parcialmente", "Todos Acionados"], obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Sistemas de retenção suplementar suplementares" },
      { campo: "Pré-tensionadores dos cintos de segurança (disparo pirotécnico e travamento)", tipoResposta: "C_NC_NA", criterioReferencia: "Substituição obrigatória se detonados" },
      { campo: "Desvio Dimensional nas Diagonais do Chassi / Monobloco (comparadas às cotas de fábrica)", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "Tolerância milimétrica em mesa de estiramento / gabarito" },
      { campo: "Mecanismo de Direção e Geometria da Suspensão quanto a empenamento estrutural", tipoResposta: "C_NC_NA", criterioReferencia: "Alinhamento e tolerâncias dinâmicas de direção" },
      { campo: "Enquadramento Técnico Final de Monta (Critérios Formais da Resolução CONTRAN nº 810/2020)", tipoResposta: "SELECAO", opcoes: ["Pequena Monta (Dano Leve - Sem Afetação Estrutural)", "Média Monta (Recuperável com Emissão de CSV)", "Grande Monta (Perda Total / Irrecuperável)"], obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Pontuação oficial do Relatório de Avarias do CONTRAN" },
      { campo: "Parecer Conclusivo sobre Viabilidade Técnica de Recuperação e Segurança Viária", tipoResposta: "C_NC_NA", criterioReferencia: "Aptidão técnica para desclassificação de monta junto ao DETRAN" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 4. Laudo de Avaliação de Sinistro Veicular e Danos Estruturais
  'laudo-de-avaliacao-de-sinistro-veicular-e-danos-estruturais': {
    id: 'laudo-de-avaliacao-de-sinistro-veicular-e-danos-estruturais',
    codigo: 'VEIC-SINISTRO',
    nome: 'Laudo de Avaliação de Sinistro Veicular e Danos Estruturais',
    hrn: false,
    temHrn: false,
    normasRef: 'ABNT NBR 13771, Resoluções CONTRAN, Procedimentos de Engenharia Diagnóstica',
    textoBaseApresentacao: 'Perícia judicial/extrajudicial para determinação de causa de sinistro automotivo, falha mecânica pré-existente ou mensuração de danos para cobertura securitária.',
    apresentacaoPadrao: 'Perícia judicial/extrajudicial para determinação de causa de sinistro automotivo, falha mecânica pré-existente ou mensuração de danos para cobertura securitária.',
    metodologiaPadrao: 'Exame metalográfico preliminar de quebra de componentes (pivô, barra de direção, freio) e reconstrução cinemática de impacto.',
    secoesEspecificas: [
      'Identificação do Veículo e Contextualização do Sinistro',
      'Perícia de Avarias Mecânicas (motor, câmbio, sistema de arrefecimento, suspensão)',
      'Avaliação Estrutural de Chassi/Monobloco (deformações, cortes, emendas soldadas)',
      'Medição de Alinhamento de Monobloco (banco de medição tridimensional ou trena de precisão, com comparação às cotas de fábrica)',
      'Avaliação de Componentes de Segurança (airbags, pré-tensionadores de cinto, estrutura de impacto lateral)',
      'Análise de Historicidade do Veículo (sinistros anteriores, registros de reparo)',
      'Álbum Fotográfico Categorizado das Avarias',
      'Parecer Conclusivo (viabilidade técnico-econômica de reparo ou indicativo de perda total)'
    ],
    checklistInicial: [
      { campo: "Data, Local, Condições Climáticas e Pista no Momento do Sinistro", tipoResposta: "VALOR", criterioReferencia: "ABNT NBR 13771 e boletins oficiais de trânsito" },
      { campo: "Ponto Inicial de Contato e Dinâmica Cinemática da Colisão", tipoResposta: "SELECAO", opcoes: ["Colisão Frontal", "Colisão Fronto-Lateral", "Colisão Traseira", "Colisão Lateral", "Capotamento", "Abalroamento Múltiplo"], obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Vetor resultante da energia cinética de deformação" },
      { campo: "Conjunto Motopropulsor — Avarias no bloco do motor, cárter, cabeçote, coletores e suportes", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Inspeção de trincas mecânicas no bloco e periféricos" },
      { campo: "Conjunto de Transmissão — Câmbio, carcaça, semi-eixos, homocinéticas e eixo cardan", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Integridade das carcaças fundidas e eixos rotativos" },
      { campo: "Sistema de Arrefecimento — Radiador, eletroventilador, condensador e mangueiras", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Perda de estanqueidade e deformação por esmagamento" },
      { campo: "Suspensão e Direção — Braços oscilantes, amortecedores, manga de eixo, pivôs e caixa", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Fraturas dúcteis vs frágeis e empenamentos" },
      { campo: "Exame Metalográfico / Macroscópico de Componentes Rompidos (falha prévia vs choque)", tipoResposta: "C_NC_NA", criterioReferencia: "Caracterização da superfície de fratura (fadiga vs impacto instantâneo)" },
      { campo: "Estrutura do Monobloco / Chassi — Deformação plástica e flambagem de longarinas e caixas", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Inspeção visual e dimensional de alinhamento" },
      { campo: "Verificação de Intervenções Anteriores — Soldas clandestinas, cortes ou emendas pré-existentes", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Identificação de reparos anômalos anteriores ao sinistro" },
      { campo: "Desvio do Alinhamento Tridimensional em relação às cotas do fabricante", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "Desvio diagonal e cota longitudinal de entre-eixos" },
      { campo: "Alinhamento de Vãos de Carroceria — Portas, tampas, capô e colunas", tipoResposta: "C_NC_NA", criterioReferencia: "Fechamento suave e folgas perimetrais uniformes" },
      { campo: "Dispositivos de Retenção Passiva — Airbags deflagrados e cintos pré-tensionados acionados", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Módulos de segurança acionados na dinâmica" },
      { campo: "Valor de Referência de Mercado do Veículo Sinistrado (Tabela FIPE)", tipoResposta: "VALOR", unidade: "R$", criterioReferencia: "Valor venal médio de mercado na data do sinistro" },
      { campo: "Orçamento Global Estimado para Reparação Integral (Peças Originais + Mão de Obra)", tipoResposta: "VALOR", unidade: "R$", criterioReferencia: "Orçamentação técnica analítica de recuperação" },
      { campo: "Relação Percentual entre Custo de Reparação e Valor de Mercado (FIPE)", tipoResposta: "VALOR", unidade: "%", criterioReferencia: "Critério de Perda Total econômica (geralmente > 75%)" },
      { campo: "Classificação Econômica e Técnica do Sinistro", tipoResposta: "SELECAO", opcoes: ["Dano Parcial Recuperável", "Perda Total Econômica (> 75% FIPE)", "Irrecuperável / Perda Total Estrutural"], obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Parecer pericial conclusivo de liquidação de sinistro" }
    ],
    atualizadoEm: new Date().toISOString()
  }
};

export const ALIASES_TIPOS_VEICULAR: Record<string, string> = {
  'laudo-frota-operacional': 'laudo-de-inspecao-de-frota-operacional-leves-e-utilitarios',
  'laudo-transporte-escolar': 'laudo-tecnico-para-transporte-escolar',
  'laudo-reclassificacao-monta': 'laudo-pericial-de-reclassificacao-de-monta-veicular',
  'laudo-sinistro-veicular': 'laudo-de-avaliacao-de-sinistro-veicular-e-danos-estruturais'
};

/**
 * Persiste ou atualiza os 4 documentos de Engenharia Veicular no Firestore na rota:
 * `categoriasLaudo/engenharia-veicular-pericias-e-inspecoes-de-frota/tipos/{tipo}`
 */
export async function sincronizarFirestoreVeicular(): Promise<{
  sucesso: boolean;
  totalAtualizados: number;
  mensagem: string;
}> {
  if (!db) {
    return {
      sucesso: false,
      totalAtualizados: 0,
      mensagem: 'Instância do Firestore não disponível no momento. Os dados estão preservados no catálogo local e taxonomia.'
    };
  }

  let gravados = 0;
  const categoriasAlvo = [
    'engenharia-veicular-pericias-e-inspecoes-de-frota',
    'engenharia-veicular-perícias-e-inspeções-de-frota'
  ];

  try {
    for (const catId of categoriasAlvo) {
      // Documento da categoria
      const catDocRef = doc(db, 'categoriasLaudo', catId);
      await setDoc(catDocRef, {
        id: catId,
        nome: 'Engenharia Veicular, Perícias e Inspeções de Frota',
        icone: 'Car',
        atualizadoEm: new Date().toISOString()
      }, { merge: true });

      // Documentos de cada tipo
      for (const [tipoKey, dados] of Object.entries(TIPOS_VEICULAR_FIRESTORE)) {
        // Grava no ID canônico por extenso
        const tipoDocRef = doc(db, 'categoriasLaudo', catId, 'tipos', tipoKey);
        await setDoc(tipoDocRef, dados, { merge: true });
        gravados++;

        // Grava também no ID curto / alias se existir correspondência
        const shortAlias = Object.keys(ALIASES_TIPOS_VEICULAR).find(k => ALIASES_TIPOS_VEICULAR[k] === tipoKey);
        if (shortAlias) {
          const shortDocRef = doc(db, 'categoriasLaudo', catId, 'tipos', shortAlias);
          await setDoc(shortDocRef, {
            ...dados,
            id: shortAlias,
            aliasDe: tipoKey
          }, { merge: true });
          gravados++;
        }
      }
    }

    return {
      sucesso: true,
      totalAtualizados: gravados,
      mensagem: `Sucesso: ${gravados} documentos veiculares sincronizados nas coleções Firestore categoriasLaudo/engenharia-veicular-pericias-e-inspecoes-de-frota/tipos/{tipo}.`
    };
  } catch (error: any) {
    console.error('Erro ao sincronizar tipos veiculares com Firestore:', error);
    return {
      sucesso: false,
      totalAtualizados: gravados,
      mensagem: `Erro na gravação Firestore: ${error?.message || String(error)}`
    };
  }
}

/**
 * Persiste ou atualiza os 6 documentos no Firestore nas rotas:
 * `categoriasLaudo/segurança-do-trabalho-e-maquinas/tipos/{tipo}`
 * e também `categoriasLaudo/seguranca-do-trabalho-e-maquinas/tipos/{tipo}`
 */
export async function sincronizarFirestoreNR12eNR13(): Promise<{
  sucesso: boolean;
  totalAtualizados: number;
  mensagem: string;
}> {
  if (!db) {
    return {
      sucesso: false,
      totalAtualizados: 0,
      mensagem: 'Instância do Firestore não disponível no momento. Os dados estão preservados no catálogo local e taxonomia.'
    };
  }

  let gravados = 0;
  const categoriasAlvo = ['segurança-do-trabalho-e-maquinas', 'seguranca-do-trabalho-e-maquinas'];

  try {
    for (const catId of categoriasAlvo) {
      // Documento da categoria
      const catDocRef = doc(db, 'categoriasLaudo', catId);
      await setDoc(catDocRef, {
        id: catId,
        nome: 'Segurança do Trabalho e Máquinas (NR-12 e NR-13)',
        icone: 'ShieldCheck',
        atualizadoEm: new Date().toISOString()
      }, { merge: true });

      // Documentos de cada tipo
      for (const [tipoKey, dados] of Object.entries(TIPOS_NR12_NR13_FIRESTORE)) {
        // Grava no ID canônico por extenso
        const tipoDocRef = doc(db, 'categoriasLaudo', catId, 'tipos', tipoKey);
        await setDoc(tipoDocRef, dados, { merge: true });
        gravados++;

        // Grava também no ID curto / alias se existir correspondência
        const shortAlias = Object.keys(ALIASES_TIPOS_LAUDO).find(k => ALIASES_TIPOS_LAUDO[k] === tipoKey);
        if (shortAlias) {
          const shortDocRef = doc(db, 'categoriasLaudo', catId, 'tipos', shortAlias);
          await setDoc(shortDocRef, {
            ...dados,
            id: shortAlias,
            aliasDe: tipoKey
          }, { merge: true });
          gravados++;
        }
      }
    }

    return {
      sucesso: true,
      totalAtualizados: gravados,
      mensagem: `Sucesso: ${gravados} documentos sincronizados nas coleções Firestore categoriasLaudo/{categoria}/tipos/{tipo}.`
    };
  } catch (error: any) {
    console.error('Erro ao sincronizar tipos com Firestore:', error);
    return {
      sucesso: false,
      totalAtualizados: gravados,
      mensagem: `Erro na gravação Firestore: ${error?.message || String(error)}`
    };
  }
}

/**
 * Definições completas dos 6 tipos de laudo da categoria
 * Segurança Contra Incêndio e Pânico
 */
export const TIPOS_INCENDIO_FIRESTORE: Record<string, DocumentoTipoLaudoFirestore> = {
  // 1. Laudo de Análise/Levantamento Pré-Projeto PPCI
  'laudo-de-analise-levantamento-pre-projeto-ppci': {
    id: 'laudo-de-analise-levantamento-pre-projeto-ppci',
    codigo: 'PPCI-PRE',
    nome: 'Laudo de Análise/Levantamento Pré-Projeto PPCI',
    hrn: false,
    temHrn: false,
    normasRef: 'ABNT NBR 9077, NBR 13434, Instruções Técnicas do CBMPE',
    textoBaseApresentacao: 'O presente laudo técnico tem por finalidade realizar o levantamento físico e cadastral das instalações prediais e industriais para subsidiar a elaboração do Projeto de Proteção e Combate a Incêndio e Pânico (PPCI).',
    apresentacaoPadrao: 'O presente laudo técnico tem por finalidade realizar o levantamento físico e cadastral das instalações prediais e industriais para subsidiar a elaboração do Projeto de Proteção e Combate a Incêndio e Pânico (PPCI).',
    metodologiaPadrao: 'Vistoria minuciosa in loco para identificação das características arquitetônicas, ocupação, carga de incêndio preliminar e definição dos sistemas de segurança obrigatórios.',
    secoesEspecificas: [
      'Levantamento Arquitetônico (plantas, áreas por pavimento, pé-direito, número de pavimentos, altura da edificação)',
      'Classificação da Edificação (ocupação, grupo/divisão, carga de incêndio de referência) conforme a Instrução Técnica do Corpo de Bombeiros do estado',
      'Verificação de Isolamento de Risco e Acesso de Viaturas (afastamento entre edificações, dimensões da via de acesso)',
      'Diagnóstico de Sistemas Preventivos Existentes (hidrantes, extintores, alarme, iluminação de emergência, SPDA, compartimentação)',
      'Levantamento do Reservatório de Água para Incêndio (existência, capacidade, exclusividade)',
      'Recomendações Preliminares e Memorial Descritivo para Elaboração do Projeto de PPCI'
    ],
    checklistInicial: [
      { campo: "Ocupação e Uso — Classificação da edificação conforme tabela de ocupação (Tabela 1 do Decreto Estadual/ITs)", tipoResposta: "SELECAO", opcoes: ["Grupo A", "Grupo B", "Grupo C", "Grupo D", "Grupo E", "Grupo F", "Grupo G", "Grupo H", "Grupo I", "Grupo J", "Grupo L", "Grupo M"] },
      { campo: "Carga de Incêndio — Levantamento dos materiais predominantes e cálculo da carga térmica", tipoResposta: "VALOR", unidade: "MJ/m²" },
      { campo: "Área Construída Total", tipoResposta: "VALOR", unidade: "m²" },
      { campo: "Altura da Edificação (ascendente/descendente)", tipoResposta: "VALOR", unidade: "m" },
      { campo: "Separação entre Edificações — Distância de isolamento de risco entre blocos conforme IT", tipoResposta: "VALOR", unidade: "m", criterioReferencia: "Conforme IT aplicável ao estado/UF" },
      { campo: "Acesso de Viaturas — Largura livre da via", tipoResposta: "VALOR", unidade: "m", criterioReferencia: "> 6,0 m" },
      { campo: "Acesso de Viaturas — Altura livre da via", tipoResposta: "VALOR", unidade: "m", criterioReferencia: "> 4,5 m" },
      { campo: "Acesso de Viaturas — Condição geral de acesso do Corpo de Bombeiros", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true },
      { campo: "Resistência ao Fogo da Estrutura — TRRF de pilares e vigas (metálica/concreto)", tipoResposta: "VALOR", unidade: "min" },
      { campo: "Controle de Materiais de Acabamento (CMAR) — Classe dos materiais de piso, parede e teto", tipoResposta: "SELECAO", opcoes: ["Classe A", "Classe B", "Classe C", "Classe D", "Classe E", "Classe F"] }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 2. Laudo de Dimensionamento de Saídas de Emergência e Carga de Incêndio
  'laudo-de-dimensionamento-de-saidas-de-emergencia-e-carga-de-incendio': {
    id: 'laudo-de-dimensionamento-de-saidas-de-emergencia-e-carga-de-incendio',
    codigo: 'PPCI-SAIDAS',
    nome: 'Laudo de Dimensionamento de Saídas de Emergência e Carga de Incêndio',
    hrn: false,
    temHrn: false,
    normasRef: 'ABNT NBR 9077, NBR 14432, ITs CBMPE',
    textoBaseApresentacao: 'Laudo técnico quantitativo para determinação da carga de incêndio específica em edificações comerciais/industriais e cálculo do dimensionamento das saídas de emergência e portas corta-fogo.',
    apresentacaoPadrao: 'Laudo técnico quantitativo para determinação da carga de incêndio específica em edificações comerciais/industriais e cálculo do dimensionamento das saídas de emergência e portas corta-fogo.',
    metodologiaPadrao: 'Inventário quantitativo e qualitativo dos materiais combustíveis presentes por compartimento, cálculo estequiométrico em MJ/m² e validação das portas de escape.',
    secoesEspecificas: [
      'Cálculo de População (Lotação) por Pavimento e Uso, conforme IT estadual e ABNT NBR 9077',
      'Dimensionamento da Largura das Saídas (Unidades de Passagem) e Número de Saídas Exigidas',
      'Verificação da Distância Máxima a Percorrer até a Saída',
      'Cálculo da Carga de Incêndio por Ocupação (MJ/m²)',
      'Dimensionamento de Escadas de Emergência (largura, corrimãos, sinalização, portas corta-fogo)',
      'Estimativa do Tempo de Escoamento da População'
    ],
    checklistInicial: [
      { campo: "População Calculada (lotação) por pavimento", tipoResposta: "VALOR", unidade: "texto" },
      { campo: "Largura das Saídas de Emergência", tipoResposta: "VALOR", unidade: "m" },
      { campo: "Distância Máxima a Percorrer até a Saída", tipoResposta: "VALOR", unidade: "m", criterioReferencia: "Conforme IT/NBR 9077 aplicável à ocupação" },
      { campo: "Carga de Incêndio Calculada por Ocupação", tipoResposta: "VALOR", unidade: "MJ/m²" },
      { campo: "Tempo de Escoamento Estimado", tipoResposta: "VALOR", unidade: "min" },
      { campo: "Sinalização de Rota de Fuga", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true },
      { campo: "Dimensionamento das Escadas (largura/capacidade de escoamento)", tipoResposta: "VALOR", unidade: "m" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 3. Laudo de Vistoria e Conformidade para AVCB
  'laudo-de-vistoria-e-conformidade-para-avcb': {
    id: 'laudo-de-vistoria-e-conformidade-para-avcb',
    codigo: 'AVCB-CONF',
    nome: 'Laudo de Vistoria e Conformidade para AVCB',
    hrn: false,
    temHrn: false,
    normasRef: 'Legislação do Corpo de Bombeiros Militar de Pernambuco (COBOM/CBMPE)',
    textoBaseApresentacao: 'Laudo conclusivo de atesto das condições de funcionamento e conformidade das medidas ativas e passivas de segurança contra incêndio para fins de obtenção/renovação do Auto de Vistoria do Corpo de Bombeiros (AVCB).',
    apresentacaoPadrao: 'Laudo conclusivo de atesto das condições de funcionamento e conformidade das medidas ativas e passivas de segurança contra incêndio para fins de obtenção/renovação do Auto de Vistoria do Corpo de Bombeiros (AVCB).',
    metodologiaPadrao: 'Inspeção física e ensaios práticos nos sistemas de hidrantes, alarmes, iluminação de emergência, sinalização e extintores.',
    secoesEspecificas: [
      'Vistoria do Sistema de Extintores (tipo, carga, validade, distância de caminhamento, sinalização)',
      'Vistoria do Sistema de Hidrantes (pressão, vazão, mangueiras, chave storz, esguicho, reservatório e bomba de incêndio)',
      'Vistoria do Sistema de Chuveiros Automáticos/Sprinklers (quando exigido — bombas, reservatório, válvulas de governo)',
      'Vistoria do Sistema de Detecção e Alarme de Incêndio (central, acionadores manuais, sirenes, detectores)',
      'Vistoria de Iluminação de Emergência e Sinalização de Segurança',
      'Vistoria do SPDA (Sistema de Proteção Contra Descargas Atmosféricas)',
      'Vistoria de Saídas de Emergência, Portas Corta-Fogo e Compartimentação',
      'Verificação da Brigada de Incêndio e Plano de Emergência',
      'Relação de Pendências e Prazo de Regularização para Protocolo Junto ao Corpo de Bombeiros'
    ],
    checklistInicial: [
      { campo: "Validade das ARTs/RRTs de execução/manutenção (instalações elétricas, gás, SPDA)", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true },
      { campo: "Certificado de Licença Anterior — existência e ausência de alterações estruturais/uso não autorizadas", tipoResposta: "C_NC_NA" },
      { campo: "Sinalização de Emergência — placas fotoluminescentes em rotas, saídas, extintores e botoeiras", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true },
      { campo: "Iluminação de Emergência — funcionamento contínuo dos pontos", tipoResposta: "C_NC_NA" },
      { campo: "Iluminação de Emergência — autonomia em teste de corte de energia", tipoResposta: "VALOR", unidade: "h", criterioReferencia: "> 1,5 h" },
      { campo: "Desobstrução de Rotas de Fuga — corredores e escadas", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true },
      { campo: "Extintores — Adequação da carga à classe de risco do local", tipoResposta: "SELECAO", opcoes: ["Classe A", "Classe B", "Classe C", "Classe D", "Classe K"] },
      { campo: "Extintores — Sinalização de solo e parede", tipoResposta: "C_NC_NA" },
      { campo: "Extintores — Altura de fixação do suporte", tipoResposta: "VALOR", unidade: "m", criterioReferencia: "entre 0,20 m (piso) e 1,60 m (topo)" },
      { campo: "Extintores — Pressão do manômetro na faixa verde", tipoResposta: "C_NC_NA" },
      { campo: "Extintores — Lacre e pino de segurança íntegros", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true },
      { campo: "Extintores — Validade da carga", tipoResposta: "VALOR", unidade: "texto" },
      { campo: "Extintores — Validade do ensaio hidrostático", tipoResposta: "VALOR", unidade: "texto" },
      { campo: "Extintores — Estado geral do casco e mangueira", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true },
      { campo: "Central de Alarme — modo de operação, falhas de laço e bateria de backup", tipoResposta: "C_NC_NA" },
      { campo: "Botoeiras/Acionadores Manuais — instalação entre 0,90 m e 1,20 m do piso", tipoResposta: "C_NC_NA" },
      { campo: "Avisadores Sonoros — pressão sonora acima do ruído de fundo", tipoResposta: "VALOR", unidade: "dBA", criterioReferencia: "> 15 dBA acima do ruído de fundo" },
      { campo: "Detectores de Fumaça/Temperatura — LED de supervisão e ausência de contaminação no sensor", tipoResposta: "C_NC_NA" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 4. Laudo Técnico Simplificado para CLCB
  'laudo-tecnico-simplificado-para-clcb': {
    id: 'laudo-tecnico-simplificado-para-clcb',
    codigo: 'CLCB-SIMP',
    nome: 'Laudo Técnico Simplificado para CLCB',
    hrn: false,
    temHrn: false,
    normasRef: 'Normas Técnicas CBMPE para Edificações de Baixo Risco',
    textoBaseApresentacao: 'Laudo de responsabilidade técnica para regularização simplificada de imóveis com Certificado de Licença do Corpo de Bombeiros (CLCB).',
    apresentacaoPadrao: 'Laudo de responsabilidade técnica para regularização simplificada de imóveis com Certificado de Licença do Corpo de Bombeiros (CLCB).',
    metodologiaPadrao: 'Checklist expedito de itens de segurança elementares (extintores, sinalização básica e iluminação).',
    secoesEspecificas: [
      'Verificação Simplificada de Extintores (tipo, quantidade, validade)',
      'Verificação de Saída de Emergência Única (sinalização e desobstrução)',
      'Verificação Visual da Instalação Elétrica',
      'Verificação de Lotação/Área Compatível com o Uso',
      'Enquadramento como Baixo Risco ou Microempresa conforme IT estadual'
    ],
    checklistInicial: [
      { campo: "Extintores adequados ao tipo de risco do estabelecimento", tipoResposta: "SELECAO", opcoes: ["Classe A", "Classe B", "Classe C", "Classe D", "Classe K"] },
      { campo: "Saída de emergência sinalizada", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true },
      { campo: "Instalação elétrica aparentemente regular (inspeção visual)", tipoResposta: "C_NC_NA" },
      { campo: "Quadro de área/lotação compatível com o enquadramento de baixo risco", tipoResposta: "C_NC_NA" },
      { campo: "Enquadramento como Baixo Risco/Microempresa confirmado", tipoResposta: "C_NC_NA" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 5. Laudo de Comissionamento de Sistemas de Incêndio
  'laudo-de-comissionamento-de-sistemas-de-incendio': {
    id: 'laudo-de-comissionamento-de-sistemas-de-incendio',
    codigo: 'COMIS-INC',
    nome: 'Laudo de Comissionamento de Sistemas de Incêndio',
    hrn: false,
    temHrn: false,
    normasRef: 'ABNT NBR 10897 (Sprinklers), NBR 13714 (Hidrantes), NBR 17240 (Alarme)',
    textoBaseApresentacao: 'Auditoria técnica de entrega e recebimento de obra mecânica de sistemas de proteção contra incêndio.',
    apresentacaoPadrao: 'Auditoria técnica de entrega e recebimento de obra mecânica de sistemas de proteção contra incêndio.',
    metodologiaPadrao: 'Ensaios hidrostáticos em tubulações, testes de fluxo e vazão em bombas principais e jockey, e teste de disparo de bicos de sprinklers.',
    secoesEspecificas: [
      'Teste de Vazão e Pressão dos Hidrantes no Ponto Mais Desfavorável',
      'Teste da Bomba de Incêndio (partida automática, pressão nominal, tempo de resposta)',
      'Inspeção e Teste dos Sprinklers (cobertura, obstrução, corrosão)',
      'Teste da Central de Alarme (todos os laços, acionadores manuais, detectores automáticos)',
      'Teste de Sirenes e Sinalizadores Visuais (audibilidade e visibilidade)',
      'Teste de Autonomia e Luminância da Iluminação de Emergência',
      'Ficha de Comissionamento com Resultados Registrados e Assinatura do Responsável Técnico'
    ],
    checklistInicial: [
      { campo: "Acesso ao Abrigo do Hidrante — visível, desobstruído e sinalizado", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true },
      { campo: "Mangueiras de Incêndio — tipo correto (Tipo 1 a 5) e quantidade exigida por ponto", tipoResposta: "SELECAO", opcoes: ["Tipo 1", "Tipo 2", "Tipo 3", "Tipo 4", "Tipo 5"] },
      { campo: "Mangueiras de Incêndio — ausência de mofo/desgaste", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true },
      { campo: "Chave de Mangueira (Storz) e esguicho funcionais", tipoResposta: "C_NC_NA" },
      { campo: "Teste de Pressão Estática no ponto mais desfavorável", tipoResposta: "VALOR", unidade: "kgf/cm²" },
      { campo: "Teste de Pressão Dinâmica no ponto mais desfavorável", tipoResposta: "VALOR", unidade: "kgf/cm²" },
      { campo: "Válvula Angular (Registro) — ausência de vazamentos e facilidade de abertura", tipoResposta: "C_NC_NA" },
      { campo: "Automação da Bomba de Incêndio — acionamento automático por queda de pressão (pressostato)", tipoResposta: "C_NC_NA" },
      { campo: "Sprinklers — inspeção visual (bulbos, obstruções, pintura)", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true },
      { campo: "Detectores de fumaça — teste de acionamento", tipoResposta: "C_NC_NA" },
      { campo: "Bateria da Central — autonomia após desconexão da rede CA", tipoResposta: "VALOR", unidade: "h", criterioReferencia: "mínimo 24h + 15min de alarme" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 6. Laudo de Estanqueidade de Rede de Gás (GLP/GN)
  'laudo-de-estanqueidade-de-rede-de-gas-glp-gn': {
    id: 'laudo-de-estanqueidade-de-rede-de-gas-glp-gn',
    codigo: 'GAS-ESTANQ',
    nome: 'Laudo de Estanqueidade de Rede de Gás (GLP/GN)',
    hrn: false,
    temHrn: false,
    normasRef: 'ABNT NBR 15526, NBR 15358 e IT CBMPE',
    textoBaseApresentacao: 'Laudo pericial e ensaio de estanqueidade pneumático para comprovação da integridade e ausência de vazamentos em tubulações de gás combustível.',
    apresentacaoPadrao: 'Laudo pericial e ensaio de estanqueidade pneumático para comprovação da integridade e ausência de vazamentos em tubulações de gás combustível.',
    metodologiaPadrao: 'Pressurização da linha com gás inerte (nitrogênio), aferição em manômetro calibrado e teste com solução formadora de bolhas nas conexões.',
    secoesEspecificas: [
      'Identificação da Instalação (tipo de gás, capacidade da central, layout da rede)',
      'Metodologia do Teste de Estanqueidade (pressurização com ar/nitrogênio, pressão de teste, tempo de estabilização)',
      'Verificação de Conexões, Válvulas e Regulador de Pressão',
      'Verificação da Ventilação do Abrigo/Central de Gás',
      'Verificação de Sinalização e Proteção Contra Impacto de Veículos'
    ],
    checklistInicial: [
      { campo: "Central de Gás (Abrigo) — localização ventilada, afastada de ralos/fontes de ignição, sinalizada", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true },
      { campo: "Válvula de Bloqueio Rápido — presença e operacionalidade (manual e solenoide de emergência)", tipoResposta: "C_NC_NA" },
      { campo: "Teste de Estanqueidade — queda de pressão durante ensaio pneumático", tipoResposta: "VALOR", unidade: "kPa" },
      { campo: "Tubulação — pintura na cor amarela (NBR 6493) e fixação por braçadeiras", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true },
      { campo: "Exaustão e Ventilação dos Equipamentos — duto de exaustão de gases e aberturas inferiores/superiores na central", tipoResposta: "C_NC_NA" },
      { campo: "Conexões e Válvulas — estado de conservação geral", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true }
    ],
    atualizadoEm: new Date().toISOString()
  }
};

export const ALIASES_TIPOS_INCENDIO: Record<string, string> = {
  'laudo-ppci-pre': 'laudo-de-analise-levantamento-pre-projeto-ppci',
  'laudo-dim-saidas': 'laudo-de-dimensionamento-de-saidas-de-emergencia-e-carga-de-incendio',
  'laudo-avcb': 'laudo-de-vistoria-e-conformidade-para-avcb',
  'laudo-clcb': 'laudo-tecnico-simplificado-para-clcb',
  'laudo-comissionamento-incendio': 'laudo-de-comissionamento-de-sistemas-de-incendio',
  'laudo-estanqueidade-gas': 'laudo-de-estanqueidade-de-rede-de-gas-glp-gn'
};

/**
 * Persiste ou atualiza os 6 documentos no Firestore nas rotas:
 * `categoriasLaudo/seguranca-contra-incendio-e-panico/tipos/{tipo}`
 * e também `categoriasLaudo/segurança-contra-incêndio-e-pânico/tipos/{tipo}`
 */
export async function sincronizarFirestoreIncendio(): Promise<{
  sucesso: boolean;
  totalAtualizados: number;
  mensagem: string;
}> {
  if (!db) {
    return {
      sucesso: false,
      totalAtualizados: 0,
      mensagem: 'Instância do Firestore não disponível no momento. Os dados estão preservados no catálogo local e taxonomia.'
    };
  }

  let gravados = 0;
  const categoriasAlvo = [
    'seguranca-contra-incendio-e-panico',
    'segurança-contra-incêndio-e-pânico'
  ];

  try {
    for (const catId of categoriasAlvo) {
      // Documento da categoria
      const catDocRef = doc(db, 'categoriasLaudo', catId);
      await setDoc(catDocRef, {
        id: catId,
        nome: 'Segurança Contra Incêndio e Pânico',
        icone: 'Flame',
        atualizadoEm: new Date().toISOString()
      }, { merge: true });

      // Documentos de cada tipo
      for (const [tipoKey, dados] of Object.entries(TIPOS_INCENDIO_FIRESTORE)) {
        // Grava no ID canônico por extenso
        const tipoDocRef = doc(db, 'categoriasLaudo', catId, 'tipos', tipoKey);
        await setDoc(tipoDocRef, dados, { merge: true });
        gravados++;

        // Grava também no ID curto / alias se existir correspondência
        const shortAlias = Object.keys(ALIASES_TIPOS_INCENDIO).find(k => ALIASES_TIPOS_INCENDIO[k] === tipoKey);
        if (shortAlias) {
          const shortDocRef = doc(db, 'categoriasLaudo', catId, 'tipos', shortAlias);
          await setDoc(shortDocRef, {
            ...dados,
            id: shortAlias,
            aliasDe: tipoKey
          }, { merge: true });
          gravados++;
        }
      }
    }

    return {
      sucesso: true,
      totalAtualizados: gravados,
      mensagem: `Sucesso: ${gravados} documentos de incêndio sincronizados nas coleções Firestore categoriasLaudo/seguranca-contra-incendio-e-panico/tipos/{tipo}.`
    };
  } catch (error: any) {
    console.error('Erro ao sincronizar tipos de incêndio com Firestore:', error);
    return {
      sucesso: false,
      totalAtualizados: gravados,
      mensagem: `Erro na gravação Firestore: ${error?.message || String(error)}`
    };
  }
}

export const TIPOS_MAQUINAS_PESADAS_FIRESTORE: Record<string, DocumentoTipoLaudoFirestore> = {
  // 1. Laudo de Integridade Estrutural e Segurança Operacional (NR-12 / NR-18)
  'laudo-de-integridade-estrutural-e-seguranca-operacional-nr-12-nr-18': {
    id: 'laudo-de-integridade-estrutural-e-seguranca-operacional-nr-12-nr-18',
    codigo: 'PESAD-TERRA',
    nome: 'Laudo de Integridade Estrutural e Segurança Operacional (NR-12 / NR-18)',
    hrn: true,
    temHrn: true,
    normasRef: 'NR-12, NR-18, ABNT NBR ISO 6165, NBR ISO 10262',
    textoBaseApresentacao: 'Laudo de inspeção mecânica em escavadeiras hidráulicas, retroescavadeiras e pás-carregadeiras para liberação em canteiros de obras.',
    apresentacaoPadrao: 'Laudo de inspeção mecânica em escavadeiras hidráulicas, retroescavadeiras e pás-carregadeiras para liberação em canteiros de obras.',
    metodologiaPadrao: 'Inspeção de embuchamentos, pinos, cilindros hidráulicos, trincas estruturais em lanças e chassis e sistema de freio de serviço/estacionamento.',
    secoesEspecificas: [
      'Identificação do Equipamento (fabricante, modelo, nº de série, horímetro atual)',
      'Apreciação de Risco (HRN) dos Perigos Residuais de Operação',
      'Avaliação Estrutural (chassi, lança/braço, caçamba/implemento, estrutura de sustentação)',
      'Avaliação do Sistema Hidráulico (mangueiras, cilindros, bomba, vazamentos)',
      'Avaliação do Sistema de Translação (esteiras/pneus, rodas motrizes, roletes)',
      'Avaliação de Comandos e Instrumentação de Cabine',
      'Avaliação de Desgaste de Componentes Mecânicos de Articulação (pinos, buchas, mancais)'
    ],
    checklistInicial: [
      { campo: "Estruturas de Proteção na Cabine — ROPS (Proteção contra Capotamento - NBR ISO 3471)", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NBR ISO 3471 / NR-12 Anexo XI" },
      { campo: "Estruturas de Proteção na Cabine — FOPS (Proteção contra Queda de Objetos - NBR ISO 3449)", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NBR ISO 3449 Nível I ou II" },
      { campo: "Cinto de Segurança — Cinto de 2 ou 3 pontos com fecho rápido, sem desfiamentos e mecanismo de retração operável", tipoResposta: "C_NC_NA", criterioReferencia: "NR-12 item 12.15 e NBR ISO 6683" },
      { campo: "Sistema de Visibilidade — Retrovisores externos, espelhos convexos internos e câmera de ré em pleno funcionamento", tipoResposta: "C_NC_NA", criterioReferencia: "NBR ISO 5006" },
      { campo: "Alarmes Sonoros e Luminosos — Alarme sonoro de marcha à ré acoplado, buzina e giroflex/beacon de teto", tipoResposta: "C_NC_NA", criterioReferencia: "NR-12 item 12.12 e NR-18" },
      { campo: "Freio de Estacionamento e Emergência — Teste dinâmico de retenção da máquina em rampa com carga nominal", tipoResposta: "C_NC_NA", criterioReferencia: "NBR ISO 3450 / 100% de retenção estática" },
      { campo: "Sistema Hidráulico (Cilindros, Mangueiras e Comandos) — Ausência de vazamentos em retentores, trincas em hastes e válvulas de bloqueio anti-queda", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ISO 4413 e NR-12 item 12.8" },
      { campo: "Material de Desgaste — Desgaste de Esteiras/Pneus (profundidade de sulco em mm)", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "Profundidade mínima do sulco conforme especificação do fabricante" },
      { campo: "Material de Desgaste — Folga em Pinos e Buchas da Concha/Caçamba (mm)", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "Folga radial/axial máxima admissível < 2,5 mm" },
      { campo: "Extintor de Incêndio Veicular — Carga válida, manômetro no verde, suporte resistente com trava rápida", tipoResposta: "C_NC_NA", criterioReferencia: "NR-18 e Resoluções CONTRAN" },
      { campo: "Chave Geral (Chave Geral de Bateria) — Presença de chave seccionadora master acessível externa/internamente", tipoResposta: "C_NC_NA", criterioReferencia: "NR-12 e NBR IEC 60204-1" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 2. Laudo de Conformidade de Estruturas de Proteção (ROPS / FOPS)
  'laudo-de-conformidade-de-estruturas-de-protecao-rops-fops': {
    id: 'laudo-de-conformidade-de-estruturas-de-protecao-rops-fops',
    codigo: 'PESAD-ROPS',
    nome: 'Laudo de Conformidade de Estruturas de Proteção (ROPS / FOPS)',
    hrn: false,
    temHrn: false,
    normasRef: 'ISO 3471 (ROPS), ISO 3449 (FOPS), NR-12 item 12.15',
    textoBaseApresentacao: 'Atestação da integridade estrutural das cabines e proteções contra capotamento (ROPS) e queda de objetos (FOPS).',
    apresentacaoPadrao: 'Atestação da integridade estrutural das cabines e proteções contra capotamento (ROPS) e queda de objetos (FOPS).',
    metodologiaPadrao: 'Verificação da placa original de homologação, ausência de soldas clandestinas, corrosão ou furações não autorizadas nas colunas estruturais.',
    secoesEspecificas: [
      'Identificação e Certificação de Origem da Estrutura (placa de certificação ISO 3471/ISO 3449)',
      'Inspeção Visual da Estrutura ROPS (trincas, deformação, corrosão)',
      'Inspeção Visual da Estrutura FOPS, quando aplicável',
      'Verificação de Fixação e Torque dos Parafusos de Fixação',
      'Verificação de Compatibilidade da Estrutura com o Modelo do Equipamento'
    ],
    checklistInicial: [
      { campo: "Placa de Certificação ROPS (NBR ISO 3471) — Indicação legível de massa máxima e homologação do fabricante", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NBR ISO 3471 (Indelével)" },
      { campo: "Placa de Certificação FOPS (NBR ISO 3449) — Nível de proteção contra impactos Nível I ou Nível II", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NBR ISO 3449 (Indelével)" },
      { campo: "Integridade das Colunas e Arcos ROPS — Ausência de trincas, soldas clandestinas, cortes ou furações não autorizadas", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Proibida qualquer modificação estrutural (ISO 3471)" },
      { campo: "Integridade da Grelha/Teto Protetor FOPS — Ausência de deformação plástica permanente pós-impacto", tipoResposta: "C_NC_NA", exigeFotoSeNaoConforme: true, criterioReferencia: "ISO 3449" },
      { campo: "Parafusos e Fixações ao Chassi — Elementos de fixação originais com torque de aperto conferido", tipoResposta: "C_NC_NA", criterioReferencia: "Torque conforme especificação do manual técnico" },
      { campo: "Cinto de Segurança do Operador — Fixação de ancoragem resistente garantindo zona de sobrevivência (DLV)", tipoResposta: "C_NC_NA", criterioReferencia: "NBR ISO 6683 e ISO 3164" },
      { campo: "Compatibilidade da Estrutura com o Modelo e Massa do Equipamento", tipoResposta: "C_NC_NA", criterioReferencia: "Massa do equipamento <= Massa máxima ensaiada da estrutura" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 3. Laudo de Liberação e Conformidade NR-11 / NR-12
  'laudo-de-liberacao-e-conformidade-nr-11-nr-12': {
    id: 'laudo-de-liberacao-e-conformidade-nr-11-nr-12',
    codigo: 'PESAD-NR11',
    nome: 'Laudo de Liberação e Conformidade NR-11 / NR-12',
    hrn: true,
    temHrn: true,
    normasRef: 'NR-11, NR-12, ABNT NBR 14768 (Muncks), NBR ISO 5053 (Empilhadeiras)',
    textoBaseApresentacao: 'Laudo pericial com emissão de ART para liberação técnica de empilhadeiras a combustão/elétricas e caminhões guindautos (munck).',
    apresentacaoPadrao: 'Laudo pericial com emissão de ART para liberação técnica de empilhadeiras a combustão/elétricas e caminhões guindautos (munck).',
    metodologiaPadrao: 'Inspeção estática e dinâmica de mangueiras hidráulicas, garfos, torres de elevação, patolas de estabilização e dispositivos de alívio.',
    secoesEspecificas: [
      'Identificação do Equipamento e Capacidade Nominal (placa de carga)',
      'Apreciação de Risco (HRN) dos Perigos Operacionais',
      'Checklist Técnico de Freios, Direção e Sistema Hidráulico',
      'Verificação de Dispositivos de Segurança e Alarme',
      'Verificação de Garfos, Plataforma ou Cesto, conforme o tipo de equipamento'
    ],
    checklistInicial: [
      { campo: "Gaiola de Proteção do Operador (FOPS/Cabine) — Integridade da grelha de proteção superior e do protetor de carga (encosto)", tipoResposta: "C_NC_NA", criterioReferencia: "NR-11 item 11.1.6 e NBR ISO 6055" },
      { campo: "Garfos de Carga — Medição de desgaste de calcanhar do garfo (máximo 10% do nominal) (mm)", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "Desgaste máximo admissível <= 10% da espessura nominal (NBR ISO 5057)" },
      { campo: "Garfos de Carga — Teste de trincas e alinhamento entre pontas de garfos (mm)", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "Diferença de altura entre pontas <= 0,5% do comprimento do garfo" },
      { campo: "Correntes e Cabos de Elevação — Ausência de elos travados, corrosão, desgaste de pinos e alongamento", tipoResposta: "C_NC_NA", criterioReferencia: "Alongamento máximo admissível <= 2% a 3% do passo" },
      { campo: "Gráfico de Carga e Placa de Capacidade — Tabela legível com centro de gravidade (CG) em mm e capacidade em kg", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NR-11 e NR-12 item 12.1.7" },
      { campo: "Sensor de Presença no Banco (Dead-Man Switch) — Neutralização imediata da tração/mastro quando o operador se levanta", tipoResposta: "C_NC_NA", criterioReferencia: "NR-12 e NBR ISO 3691-1" },
      { campo: "Plataformas Elevatórias (PTA/PEMT) — Ancoragem para Cinto Paraquedista identificada e ensaiada", tipoResposta: "C_NC_NA", criterioReferencia: "NBR 16776 e NR-18" },
      { campo: "Plataformas Elevatórias (PTA/PEMT) — Botão de Emergência e Válvula de Descida Manual da base funcionais", tipoResposta: "C_NC_NA", criterioReferencia: "NBR 16776" },
      { campo: "Plataformas Elevatórias (PTA/PEMT) — Inclinômetro e Sensor de Sobreposição (Alarme e travamento)", tipoResposta: "C_NC_NA", criterioReferencia: "NBR 16776" },
      { campo: "Plataformas Elevatórias (PTA/PEMT) — Porta de Acesso ao Cesto (Fechamento automático e trava interna)", tipoResposta: "C_NC_NA", criterioReferencia: "NR-18 e NBR 16776" },
      { campo: "Sistema de Freios e Alarmes (Alarme de ré sonoro e giroflex de sinalização)", tipoResposta: "C_NC_NA", criterioReferencia: "NR-11 e NR-12" },
      { campo: "Extintor de Incêndio Veicular e Chave Seccionadora Geral", tipoResposta: "C_NC_NA", criterioReferencia: "NR-11 e NR-12" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 4. Laudo de Teste de Carga (Load Test) e Estabilidade
  'laudo-de-teste-de-carga-load-test-e-estabilidade': {
    id: 'laudo-de-teste-de-carga-load-test-e-estabilidade',
    codigo: 'LOAD-TEST',
    nome: 'Laudo de Teste de Carga (Load Test) e Estabilidade',
    hrn: false,
    temHrn: false,
    normasRef: 'ABNT NBR 8400, NBR 14768, OSHA 1910.179',
    textoBaseApresentacao: 'Relatório de prova de carga estática e dinâmica com massa aferida e dinamômetro calibrado para certificar a capacidade nominal.',
    apresentacaoPadrao: 'Relatório de prova de carga estática e dinâmica com massa aferida e dinamômetro calibrado para certificar a capacidade nominal.',
    metodologiaPadrao: 'Aplicação progressiva de 100% e 125% da carga nominal, monitoramento de deflexão e registro de estanqueidade hidráulica.',
    secoesEspecificas: [
      'Metodologia do Teste (percentual da carga nominal aplicado, tempo de sustentação)',
      'Execução do Ensaio de Içamento/Elevação',
      'Avaliação de Estabilidade sob Carga (ausência de tombamento/deformação)',
      'Verificação de Sistemas de Segurança Durante o Teste (limitador de carga, alarme de sobrecarga)'
    ],
    checklistInicial: [
      { campo: "Capacidade Nominal Registrada na Placa/Tabela de Carga (kg)", tipoResposta: "VALOR", unidade: "kg", criterioReferencia: "Capacidade de trabalho nominal de projeto" },
      { campo: "Carga de Prova Estática Aplicada (125% da nominal) (kg)", tipoResposta: "VALOR", unidade: "kg", criterioReferencia: "1,25 × Capacidade Nominal (NBR 8400)" },
      { campo: "Carga de Prova Dinâmica Aplicada (110% da nominal) (kg)", tipoResposta: "VALOR", unidade: "kg", criterioReferencia: "1,10 × Capacidade Nominal (NBR 8400)" },
      { campo: "Tempo de Sustentação da Carga sem Arreio ou Queda (min)", tipoResposta: "VALOR", unidade: "min", criterioReferencia: "Mínimo de 10 minutos de sustentação estática contínua" },
      { campo: "Deflexão / Deformação Residual da Estrutura após Alívio da Carga (mm)", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "Deformação permanente residual = 0 mm" },
      { campo: "Estabilidade Mantida e Ausência de Tombamento ou Deslocamento das Sapatas", tipoResposta: "C_NC_NA", criterioReferencia: "Sem perda de contato de sapatas ou alívio crítico" },
      { campo: "Célula de Carga / Dinamômetro Digital com Certificado de Calibração RBC Válido", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Calibração acreditada RBC/INMETRO vigente" },
      { campo: "Atuação do Limitador de Momento de Carga (LMI) / Alarme aos 100% da Capacidade", tipoResposta: "C_NC_NA", criterioReferencia: "Corte automático de movimentos agravantes aos 100%" },
      { campo: "Relatório Fotográfico da Prova de Carga nos Diferentes Raios e Ângulos", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Registro fotográfico comprobatório obrigatório" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 5. Laudo de Inspeção Periódica de Manutenção e Segurança
  'laudo-de-inspecao-periodica-de-manutencao-e-seguranca': {
    id: 'laudo-de-inspecao-periodica-de-manutencao-e-seguranca',
    codigo: 'PESAD-PAV',
    nome: 'Laudo de Inspeção Periódica de Manutenção e Segurança',
    hrn: false,
    temHrn: false,
    normasRef: 'NR-12, ABNT NBR ISO 6165',
    textoBaseApresentacao: 'Inspeção mecânica em rolos compactadores, vibroacabadoras e fresadoras de asfalto.',
    apresentacaoPadrao: 'Inspeção mecânica em rolos compactadores, vibroacabadoras e fresadoras de asfalto.',
    metodologiaPadrao: 'Avaliação dos sistemas de vibração excêntrica, raspadores de tambor, freios e isolamento térmico de motores.',
    secoesEspecificas: [
      'Avaliação de Freio de Emergência e Freio de Serviço',
      'Avaliação de Sinalização Sonora e Visual',
      'Verificação de Vazamentos Hidráulicos',
      'Avaliação do Sistema de Vibração/Compactação (rolo compactador)',
      'Avaliação do Sistema de Aquecimento de Massa Asfáltica (vibroacabadora, quando aplicável)'
    ],
    checklistInicial: [
      { campo: "Freio de Serviço e Freio de Estacionamento — Teste com retenção estática plena", tipoResposta: "C_NC_NA", criterioReferencia: "NBR ISO 3450" },
      { campo: "Sinalização Sonora de Marcha à Ré e Giroflex de Advertência 360 Graus", tipoResposta: "C_NC_NA", criterioReferencia: "NR-12 e NR-18" },
      { campo: "Sistema Hidráulico sem Vazamentos em Cilindros, Bombas e Motores Hidrostáticos", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ISO 4413" },
      { campo: "Sistema de Vibração / Compactação Excêntrica Testado e Funcional", tipoResposta: "C_NC_NA", criterioReferencia: "Conforme manual de operação do fabricante" },
      { campo: "Raspadores de Tambor e Bicos de Aspersão de Água íntegros", tipoResposta: "C_NC_NA", criterioReferencia: "Manutenção e integridade de raspagem" },
      { campo: "Profundidade de Sulco de Pneus ou Tambor de Aço sem Deformação Plástica (mm)", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "Conforme limite de desgaste do fabricante" },
      { campo: "Extintor de Incêndio Veicular e Chave Geral de Seccionamento", tipoResposta: "C_NC_NA", criterioReferencia: "NR-12 e NR-18" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 6. Laudo de Integridade Operacional para Acessórios de Içamento
  'laudo-de-integridade-operacional-para-acessorios-de-icamento': {
    id: 'laudo-de-integridade-operacional-para-acessorios-de-icamento',
    codigo: 'GUIND-ACES',
    nome: 'Laudo de Integridade Operacional para Acessórios de Içamento',
    hrn: false,
    temHrn: false,
    normasRef: 'ABNT NBR 13541-1 (Cabos), NBR 15516 (Cintas), NBR 15597 (Manilhas)',
    textoBaseApresentacao: 'Inspeção e descarte normativo de cabos de aço, cintas de poliéster, correntes grau 8/10, manilhas e ganchos forjados.',
    apresentacaoPadrao: 'Inspeção e descarte normativo de cabos de aço, cintas de poliéster, correntes grau 8/10, manilhas e ganchos forjados.',
    metodologiaPadrao: 'Inspeção dimensional de abertura de garganta de ganchos, contagem de arames rompidos em cabos e ensaio visual/dimensional.',
    secoesEspecificas: [
      'Inspeção de Cabos de Aço (fios rompidos, corrosão, lubrificação)',
      'Inspeção de Ganchos e Travas de Segurança (catraca de segurança)',
      'Inspeção de Cintas e Lingas (validade, integridade, capacidade)',
      'Inspeção de Patolas e Estabilizadores',
      'Inspeção de Roldanas e Tambor de Enrolamento'
    ],
    checklistInicial: [
      { campo: "Gancho de Carga (NBR ISO 16877) — Presença e ação da trava de segurança do gancho", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NBR ISO 16877 / Trava obrigatória sem folgas" },
      { campo: "Gancho de Carga — Medição de abertura da garganta do gancho em relação ao valor original (mm)", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "Aumento máximo admissível <= 10% ou 5 mm (descarte imediato se excedido)" },
      { campo: "Gancho de Carga — Teste de torção do gancho e giro livre no moitão", tipoResposta: "C_NC_NA", criterioReferencia: "Descarte imediato com torção > 0 graus" },
      { campo: "Cabo de Aço — Diâmetro nominal medido do cabo de aço (mm)", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "Redução máxima do diâmetro <= 7% do diâmetro nominal (NBR ISO 4309)" },
      { campo: "Cabo de Aço — Contagem de fios rompidos e deformações (gaiola de passarinho, nó, amassamento)", tipoResposta: "C_NC_NA", criterioReferencia: "Conforme limites de descarte da NBR ISO 4309" },
      { campo: "Tambor de Guincho — Mínimo de 3 voltas mortas de cabo no tambor na descida máxima", tipoResposta: "C_NC_NA", criterioReferencia: "NR-11 e NBR 8400 (Mínimo de 3 voltas de segurança)" },
      { campo: "Cintas de Poliéster e Lingas de Elevação — Etiqueta de identificação legível, validade e ausência de cortes", tipoResposta: "C_NC_NA", criterioReferencia: "NBR 15516-1/-2" },
      { campo: "Manilhas e Pinos Roscados — Ausência de deformações no corpo, desgaste nos pinos e indicação de carga", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NBR 15597" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 7. Laudo de Aferição do Limitador de Momento de Carga (LMI)
  'laudo-de-afericao-do-limitador-de-momento-de-carga-lmi': {
    id: 'laudo-de-afericao-do-limitador-de-momento-de-carga-lmi',
    codigo: 'GUIND-LMI',
    nome: 'Laudo de Aferição do Limitador de Momento de Carga (LMI)',
    hrn: false,
    temHrn: false,
    normasRef: 'ISO 10245-1, ABNT NBR 16463, NR-12',
    textoBaseApresentacao: 'Aferição do sistema computadorizado indicador de momento de carga (LMI/PAT/Hirschmann) em guindastes rodoviários e telescópicos.',
    apresentacaoPadrao: 'Aferição do sistema computadorizado indicador de momento de carga (LMI/PAT/Hirschmann) em guindastes rodoviários e telescópicos.',
    metodologiaPadrao: 'Calibração dos sensores de ângulo, comprimento de lança e transdutores de pressão de cilindro mestre.',
    secoesEspecificas: [
      'Verificação do Sistema Eletrônico de Sensores (ângulo, extensão da lança, carga)',
      'Teste de Aferição com Carga Conhecida em Diferentes Configurações de Lança',
      'Verificação de Alarmes Visuais e Sonoros de Sobrecarga',
      'Validação do Computador de Bordo (histórico de erros, calibração)'
    ],
    checklistInicial: [
      { campo: "Sapatas e Patolas Extensíveis — Funcionamento dos cilindros de patolamento e travas mecânicas de transporte", tipoResposta: "C_NC_NA", criterioReferencia: "NBR 14768 / NR-11" },
      { campo: "Presença e Integridade de Pranchotas de Apoio para distribuição de carga no solo", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Dimensionamento conforme pressão admissível do solo" },
      { campo: "Indicador de Nível (Inclinômetro / Bolha) instalado junto ao comando de patolamento operacional", tipoResposta: "C_NC_NA", criterioReferencia: "Nivelamento obrigatório <= 1% de inclinação" },
      { campo: "Subchassi e Talas de Fixação — Ausência de trincas na solda de união ao chassi e parafusos torqueados", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Inspeção visual e aperto de grampos" },
      { campo: "Lança Telescópica / Articulada — Ausência de empenamento, trincas em soldas de secção e desgaste em patins", tipoResposta: "C_NC_NA", criterioReferencia: "NBR 14768 / NBR 8400" },
      { campo: "Gancho de Carga (NBR ISO 16877) — Presença e ação da trava de segurança do gancho", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NBR ISO 16877" },
      { campo: "Gancho de Carga — Medição de abertura da garganta do gancho em relação ao valor original (mm)", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "<= 10% ou 5 mm do valor nominal" },
      { campo: "Gancho de Carga — Teste de torção do gancho e giro livre no moitão", tipoResposta: "C_NC_NA", criterioReferencia: "Sem torção no colo do gancho" },
      { campo: "Cabo de Aço e Tambor de Guincho — Diâmetro nominal medido do cabo de aço (mm)", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "Redução <= 7% do diâmetro original" },
      { campo: "Cabo de Aço — Contagem de fios rompidos e deformações (gaiola de passarinho, nó, amassamento)", tipoResposta: "C_NC_NA", criterioReferencia: "NBR ISO 4309" },
      { campo: "Tambor de Guincho — Mínimo de 3 voltas mortas de cabo no tambor na descida máxima", tipoResposta: "C_NC_NA", criterioReferencia: "NR-11 e NBR 8400" },
      { campo: "Limitador de Momento de Carga (LMI) — Corte de movimento quando o torque atinge 100% do limite nominal", tipoResposta: "C_NC_NA", criterioReferencia: "Corte mandatório de movimentos agravantes (ISO 10245)" },
      { campo: "Limitador de Momento de Carga (LMI) — Leitura de raio, ângulo e peso da carga calibrados no painel digital", tipoResposta: "C_NC_NA", criterioReferencia: "Desvio máximo admissível <= 2%" },
      { campo: "Chave Fim de Curso do Moitão (Anti-Two-Block) — Interruptor de parada imediata de elevação", tipoResposta: "C_NC_NA", criterioReferencia: "Operação obrigatória com corte de guincho" },
      { campo: "Anemômetro — Sensor de velocidade do vento operacional e alarme ajustado (> 9,8 m/s ou 35 km/h)", tipoResposta: "VALOR", unidade: "m/s", criterioReferencia: "< 9,8 m/s (35 km/h) ou limite da tabela do fabricante" },
      { campo: "Tabela de Carga Operacional — Tabela legível colada no posto do operador expressando raio, lança e carga", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NR-11 e NR-12 item 12.1.7" }
    ],
    atualizadoEm: new Date().toISOString()
  }
};

export const ALIASES_TIPOS_MAQUINAS_PESADAS: Record<string, string> = {
  'laudo-terraplenagem-nr12': 'laudo-de-integridade-estrutural-e-seguranca-operacional-nr-12-nr-18',
  'pesad-terra': 'laudo-de-integridade-estrutural-e-seguranca-operacional-nr-12-nr-18',
  'laudo-rops-fops': 'laudo-de-conformidade-de-estruturas-de-protecao-rops-fops',
  'pesad-rops': 'laudo-de-conformidade-de-estruturas-de-protecao-rops-fops',
  'laudo-carga-nr11': 'laudo-de-liberacao-e-conformidade-nr-11-nr-12',
  'pesad-nr11': 'laudo-de-liberacao-e-conformidade-nr-11-nr-12',
  'laudo-teste-carga': 'laudo-de-teste-de-carga-load-test-e-estabilidade',
  'load-test': 'laudo-de-teste-de-carga-load-test-e-estabilidade',
  'laudo-pavimentacao': 'laudo-de-inspecao-periodica-de-manutencao-e-seguranca',
  'pesad-pav': 'laudo-de-inspecao-periodica-de-manutencao-e-seguranca',
  'laudo-acessorios-icamento': 'laudo-de-integridade-operacional-para-acessorios-de-icamento',
  'guind-aces': 'laudo-de-integridade-operacional-para-acessorios-de-icamento',
  'laudo-lmi-guindaste': 'laudo-de-afericao-do-limitador-de-momento-de-carga-lmi',
  'guind-lmi': 'laudo-de-afericao-do-limitador-de-momento-de-carga-lmi'
};

export async function sincronizarFirestoreMaquinasPesadas(): Promise<{
  sucesso: boolean;
  totalAtualizados: number;
  mensagem: string;
}> {
  if (!db) {
    return {
      sucesso: false,
      totalAtualizados: 0,
      mensagem: 'Instância do Firestore não disponível no momento. Os dados estão preservados no catálogo local e taxonomia.'
    };
  }

  let gravados = 0;
  const categoriasAlvo = [
    'maquinas-pesadas-equipamentos-moveis',
    'máquinas-pesadas-equipamentos-móveis'
  ];

  try {
    for (const catId of categoriasAlvo) {
      // Documento da categoria
      const catDocRef = doc(db, 'categoriasLaudo', catId);
      await setDoc(catDocRef, {
        id: catId,
        nome: 'Máquinas Pesadas / Equipamentos Móveis',
        icone: 'Truck',
        atualizadoEm: new Date().toISOString()
      }, { merge: true });

      // Documentos de cada tipo
      for (const [tipoKey, dados] of Object.entries(TIPOS_MAQUINAS_PESADAS_FIRESTORE)) {
        // Grava no ID canônico por extenso
        const tipoDocRef = doc(db, 'categoriasLaudo', catId, 'tipos', tipoKey);
        await setDoc(tipoDocRef, dados, { merge: true });
        gravados++;

        // Grava também nos IDs curtos / aliases
        const aliases = Object.keys(ALIASES_TIPOS_MAQUINAS_PESADAS).filter(k => ALIASES_TIPOS_MAQUINAS_PESADAS[k] === tipoKey);
        for (const shortAlias of aliases) {
          const shortDocRef = doc(db, 'categoriasLaudo', catId, 'tipos', shortAlias);
          await setDoc(shortDocRef, {
            ...dados,
            id: shortAlias,
            aliasDe: tipoKey
          }, { merge: true });
          gravados++;
        }
      }
    }

    return {
      sucesso: true,
      totalAtualizados: gravados,
      mensagem: `Sucesso: ${gravados} documentos de máquinas pesadas sincronizados nas coleções Firestore categoriasLaudo/maquinas-pesadas-equipamentos-moveis/tipos/{tipo}.`
    };
  } catch (error: any) {
    console.error('Erro ao sincronizar tipos de máquinas pesadas com Firestore:', error);
    return {
      sucesso: false,
      totalAtualizados: gravados,
      mensagem: `Erro na gravação Firestore: ${error?.message || String(error)}`
    };
  }
}

export const TIPOS_PLAYGROUND_FIRESTORE: Record<string, DocumentoTipoLaudoFirestore> = {
  // 1. Laudo Técnico de Inspeção de Playground (ABNT NBR 16071)
  'laudo-tecnico-de-inspecao-de-playground-abnt-nbr-16071': {
    id: 'laudo-tecnico-de-inspecao-de-playground-abnt-nbr-16071',
    codigo: 'PLAY-NBR',
    nome: 'Laudo Técnico de Inspeção de Playground (ABNT NBR 16071)',
    hrn: false,
    temHrn: false,
    normasRef: 'ABNT NBR 16071 partes 1 a 7, Lei Estadual / Municipal de Segurança em Brinquedos',
    textoBaseApresentacao: 'Laudo pericial com ART de inspeção física em áreas de recreação infantil em condomínios residenciais, escolas, shopping centers e parques públicos de Pernambuco.',
    apresentacaoPadrao: 'Laudo pericial com ART de inspeção física em áreas de recreação infantil em condomínios residenciais, escolas, shopping centers e parques públicos de Pernambuco.',
    metodologiaPadrao: 'Aplicação de gabaritos normativos para testes de aprisionamento de cabeça e pescoço, dedos e roupas, medição da área de impacto e ensaio do piso amortecedor.',
    secoesEspecificas: [
      'Identificação do Playground (localização, área total, equipamentos existentes)',
      'Verificação de Superfícies de Impacto e Área de Queda Livre (conforme altura de queda de cada equipamento)',
      'Verificação de Rotas de Aprisionamento (cabeça/pescoço, dedos, roupas/cordões)',
      'Verificação de Ancoragens, Fundações e Fixação dos Equipamentos',
      'Verificação de Materiais e Acabamento (arestas, pontas, ferrugem)',
      'Verificação Específica por Tipo de Equipamento (balanços, escorregadores, gangorras, carrossel)',
      'Verificação de Zona de Segurança e Distância Mínima Entre Equipamentos',
      'Verificação de Sinalização de Idade Recomendada e Normas de Uso'
    ],
    checklistInicial: [
      { campo: "Piso Absorvedor de Impacto — Tipo de piso instalado na área de recreação", tipoResposta: "SELECAO", opcoes: ["Emborrachado moldado in loco", "Placa de borracha", "Areia", "Grama sintética/natural", "Maravalha"], criterioReferencia: "ABNT NBR 16071-3" },
      { campo: "Medição de Espessura do Piso Emborrachado em relação à Altura Livre de Queda (HIC)", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "ABNT NBR 16071-3 (Altura Crítica de Queda)" },
      { campo: "Profundidade da Camada Solta (Areia/Cascalho) — Espessura mínima mantida", tipoResposta: "VALOR", unidade: "mm", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 16071-3 (mínimo de 200 mm a 300 mm)" },
      { campo: "Zona de Queda e Espaço Livre — Ausência de obstáculos fixos (bancos, muretas, árvores) no raio mínimo", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 16071-3 (raio mínimo de 1,50 m ao redor do brinquedo)" },
      { campo: "Drenagem e Conservação do Solo — Ausência de poças d'água, raízes expostas, pedras soltas ou contaminação", tipoResposta: "C_NC_NA", criterioReferencia: "ABNT NBR 16071-3 (Condições sanitárias e de drenagem)" },
      { campo: "Ancoragem das Sapatas no Solo — Fundações e blocos de concreto totalmente cobertos pelo piso (sem risco de tropeços)", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 16071-1 e 16071-2" },
      { campo: "Integridade de Madeiras e Plásticos — Ausência de lascas, farpas, podridão, trincas por UV ou rachaduras estruturais", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 16071-1 e 16071-2" },
      { campo: "Integridade de Componentes Metálicos — Ausência de corrosão/ferrugem acentuada, pontos de solda trincados ou pontas afiadas", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 16071-1 e 16071-2" },
      { campo: "Parafusos e Elementos de Fixação — Presença de tampas protetoras plásticas/emborrachadas (sem roscas sobrando)", tipoResposta: "C_NC_NA", criterioReferencia: "ABNT NBR 16071-2" },
      { campo: "Gabarito de Aprisionamento de Cabeça e Pescoço — Teste com sondas rígidas em aberturas entre 130 mm e 230 mm acima de 600 mm", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 16071-2 (Gabaritos de cabeça e pescoço)" },
      { campo: "Gabarito de Aprisionamento de Dedos — Verificação de orifícios e fendas abertas entre 8 mm e 25 mm", tipoResposta: "C_NC_NA", criterioReferencia: "ABNT NBR 16071-2 (Gabarito cilíndrico de dedos)" },
      { campo: "Aprisionamento de Roupas e Cordões (V-Gabarito) — Ausência de cantos em 'V' que possam enganchar cordões ou capuzes", tipoResposta: "C_NC_NA", criterioReferencia: "ABNT NBR 16071-2 (Gabarito em V)" },
      { campo: "Assentos de Balanço — Material flexível/de impacto, distância entre assentos (> 450 mm) e afastamento da estrutura", tipoResposta: "C_NC_NA", criterioReferencia: "ABNT NBR 16071-2" },
      { campo: "Correntes e Elos de Balanço — Abertura máxima dos elos de corrente menor que 8,6 mm", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "ABNT NBR 16071-2 (Abertura < 8,6 mm para evitar aprisionamento de dedos)" },
      { campo: "Escorregadores — Altura da seção de saída em relação ao piso", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "ABNT NBR 16071-2 (Seção de desaceleração e saída)" },
      { campo: "Escorregadores — Presença de barra de apoio/transição no topo e guarda-corpos laterais funcionais", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 16071-2" },
      { campo: "Guarda-Corpos e Corrimãos — Altura das proteções contra queda (mín. 600 mm pré-escolar / 700 mm escolar)", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "ABNT NBR 16071-2" },
      { campo: "Placa informativa no local com faixa etária recomendada, lotação e contatos de emergência", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 16071-7 e Legislação Municipal/Estadual" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 2. Laudo de Análise de Risco e Manutenção Corretiva
  'laudo-de-analise-de-risco-e-manutencao-corretiva': {
    id: 'laudo-de-analise-de-risco-e-manutencao-corretiva',
    codigo: 'PLAY-RISCO',
    nome: 'Laudo de Análise de Risco e Manutenção Corretiva',
    hrn: false,
    temHrn: false,
    normasRef: 'ABNT NBR 16071-7 (Inspeção, Manutenção e Operação)',
    textoBaseApresentacao: 'Plano de ação corretivo e classificação de risco para brinquedos com desgaste mecânico severo, visando reforma estrutural ou interdição temporária.',
    apresentacaoPadrao: 'Plano de ação corretivo e classificação de risco para brinquedos com desgaste mecânico severo, visando reforma estrutural ou interdição temporária.',
    metodologiaPadrao: 'Mapeamento de folgas em correntes de balanços, estabilidade de ancoragem das sapatas de concreto e substituição de ferragens oxidadas.',
    secoesEspecificas: [
      'Mapeamento de Partes Lascadas e Degradação de Madeira/Plástico',
      'Mapeamento de Ferrugem e Corrosão Estrutural',
      'Verificação de Parafusos Expostos, Soltos ou Faltantes',
      'Verificação de Folgas Estruturais e Desgaste de Articulações (balanços, gangorras)',
      'Classificação de Prioridade das Não Conformidades (Crítica, Moderada, Baixa)',
      'Plano de Ação Corretivo com Prazos'
    ],
    checklistInicial: [
      { campo: "Classificação de Risco e Severidade de Desgaste Mecânico Global do Playground", tipoResposta: "SELECAO", opcoes: ["Risco Baixo (Manutenção Preventiva Simples)", "Risco Moderado (Correção Programada)", "Risco Crítico / Iminente (Interdição Imediata)"], obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 16071-7" },
      { campo: "Mapeamento de Partes Lascadas, Farpas e Degradação Estrutural de Madeiras e Plásticos", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 16071-7" },
      { campo: "Mapeamento de Ferrugem, Corrosão e Pontos de Solda Fraturados em Componentes Metálicos", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 16071-7" },
      { campo: "Parafusos e Fixadores Expostos, Soltos, Faltantes ou com Roscas Sobrando", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 16071-2 e 16071-7" },
      { campo: "Tampas Protetoras de Polietileno/Borracha Ausentes sobre Parafusos", tipoResposta: "VALOR", unidade: "unidades faltantes", criterioReferencia: "ABNT NBR 16071-2" },
      { campo: "Folgas Excessivas em Articulações, Mancais e Rolamentos (Balanços, Gangorras e Carrosséis)", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 16071-7" },
      { campo: "Desgaste Acentuado em Elos de Corrente, Cabos de Aço e Ganchos de Sustentação", tipoResposta: "VALOR", unidade: "% de desgaste da seção", criterioReferencia: "ABNT NBR 16071-2 e 16071-7 (Descarte se perda > 10%)" },
      { campo: "Superfície Amortecedora de Impacto Desgastada, Compactada ou com Espessura Insuficiente", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 16071-3" },
      { campo: "Estabilidade de Ancoragem das Sapatas de Concreto (ausência de oscilação ou tombamento)", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 16071-1" },
      { campo: "Interdição Cautelar Parcial ou Total de Brinquedos com Risco Crítico de Acidente", tipoResposta: "SELECAO", opcoes: ["Não Aplicável (Equipamentos Seguros)", "Interdição Parcial (Equipamento Específico Isolado)", "Interdição Total do Playground"], obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Código de Defesa do Consumidor e NBR 16071-7" },
      { campo: "Cronograma e Prazos do Plano de Ação Corretivo com ART de Engenharia Mecânica", tipoResposta: "VALOR", criterioReferencia: "ABNT NBR 16071-7 (Gestão da Manutenção)" }
    ],
    atualizadoEm: new Date().toISOString()
  }
};

export const ALIASES_TIPOS_PLAYGROUND: Record<string, string> = {
  'laudo-playground-nbr16071': 'laudo-tecnico-de-inspecao-de-playground-abnt-nbr-16071',
  'play-nbr': 'laudo-tecnico-de-inspecao-de-playground-abnt-nbr-16071',
  'laudo-playground-risco': 'laudo-de-analise-de-risco-e-manutencao-corretiva',
  'play-risco': 'laudo-de-analise-de-risco-e-manutencao-corretiva',
  'laudo-playground': 'laudo-tecnico-de-inspecao-de-playground-abnt-nbr-16071',
  'playground': 'laudo-tecnico-de-inspecao-de-playground-abnt-nbr-16071'
};

export const TIPOS_ESTRUTURAS_METALICAS_FIRESTORE: Record<string, DocumentoTipoLaudoFirestore> = {
  // 1. Laudo de Integridade Estrutural de Galpões e Coberturas Metálicas (ABNT NBR 8800)
  'laudo-de-integridade-estrutural-de-galpoes-e-coberturas-metalicas-abnt-nbr-8800': {
    id: 'laudo-de-integridade-estrutural-de-galpoes-e-coberturas-metalicas-abnt-nbr-8800',
    codigo: 'ESTR-GALP',
    nome: 'Laudo de Integridade Estrutural de Galpões e Coberturas Metálicas (ABNT NBR 8800)',
    hrn: false,
    temHrn: false,
    normasRef: 'ABNT NBR 8800, NBR 6123, NBR 14762',
    textoBaseApresentacao: 'Inspeção técnica e pericial para verificação da estabilidade estrutural de tesouras, terças, contraventamentos e telhados de galpões industriais.',
    apresentacaoPadrao: 'Inspeção técnica e pericial para verificação da estabilidade estrutural de tesouras, terças, contraventamentos e telhados de galpões industriais.',
    metodologiaPadrao: 'Varredura por drones/acesso por corda, análise de flechas de deformação, aperto de parafusos estruturais e mapeamento de corrosão galvânica.',
    secoesEspecificas: [
      'Identificação da Estrutura (tipologia: tesoura, pórtico ou treliça; vão livre; área coberta)',
      'Avaliação de Deformações e Indícios de Flambagem em Elementos Estruturais',
      'Avaliação de Corrosão (localização, severidade, estimativa de perda de seção)',
      'Medição de Flechas em Tesouras/Treliças/Pilares e Comparação ao Limite Normativo',
      'Avaliação de Ligações Parafusadas e Soldadas',
      'Avaliação da Fixação da Cobertura, Calhas e Sistema de Drenagem Pluvial',
      'Avaliação de Contraventamentos'
    ],
    checklistInicial: [
      { campo: "Vistorias nos Pilares Metálicos — Ausência de deformações por impacto de veículos/empilhadeiras, corrosão na base ou flambagem local", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 8800" },
      { campo: "Chumbadores e Placas de Base — Integridade das porcas, contraporcas, arruelas e nível de preenchimento do graute sob a placa de base", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 8800" },
      { campo: "Vigas, Treliças e Tesouras de Cobertura — Ausência de flechas/deformações excessivas visíveis, corrosão em nós e flambagem lateral", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 8800 e NBR 6123" },
      { campo: "Sistemas de Contraventamento — Presença, tensionamento e fixação de tirantes de travamento de cobertura e paredes", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 8800" },
      { campo: "Terças e Ligações de Cobertura — Integridade de mão-francesa, presilhas e estado de conservação de telhas (ausência de infiltrações/gotejamentos)", tipoResposta: "C_NC_NA", criterioReferencia: "ABNT NBR 8800 e NBR 14762" },
      { campo: "Medição de Flechas em Tesouras e Vigas de Cobertura em relação ao limite admissível (L/350 a L/250)", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "ABNT NBR 8800 - Anexo C" },
      { campo: "Estado de Conservação da Pintura Anticorrosiva e Galvanização dos Perfis Estruturais", tipoResposta: "SELECAO", opcoes: ["Excelente / Sem Corrosão", "Corrosão Superficial Leve (Grau B)", "Corrosão com Perda de Seção (Grau C/D)"], obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ISO 8501-1 e ABNT NBR 8800" },
      { campo: "Sistema de Calhas, Rufos e Drenagem Pluvial da Cobertura", tipoResposta: "C_NC_NA", criterioReferencia: "ABNT NBR 10844" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 2. Laudo de Capacidade de Carga de Pisos Industriais e Mezaninos (NBR 8800 / NBR 6120)
  'laudo-de-capacidade-de-carga-de-pisos-industriais-e-mezaninos-nbr-8800-nbr-6120': {
    id: 'laudo-de-capacidade-de-carga-de-pisos-industriais-e-mezaninos-nbr-8800-nbr-6120',
    codigo: 'ESTR-PISO',
    nome: 'Laudo de Capacidade de Carga de Pisos Industriais e Mezaninos (NBR 8800 / NBR 6120)',
    hrn: false,
    temHrn: false,
    normasRef: 'ABNT NBR 8800, ABNT NBR 6120',
    textoBaseApresentacao: 'Determinação pericial da capacidade máxima admissível de carga concentrada e distribuída (kgf/m²) em mezaninos metálicos e pavimentos industriais.',
    apresentacaoPadrao: 'Determinação pericial da capacidade máxima admissível de carga concentrada e distribuída (kgf/m²) em mezaninos metálicos e pavimentos industriais.',
    metodologiaPadrao: 'Modelagem de cálculo estrutural com base nos perfis metálicos I/W instalados, vão livre e verificação de flechas sob carregamento.',
    secoesEspecificas: [
      'Identificação da Estrutura do Piso/Mezanino (tipo de laje/piso, vigas, pilares)',
      'Levantamento da Capacidade de Projeto Original, quando disponível (memorial de cálculo)',
      'Verificação da Capacidade de Suporte por m² Conforme Uso Pretendido (ABNT NBR 6120)',
      'Avaliação para Armazenagem (empilhamento de materiais)',
      'Avaliação para Tráfego de Empilhadeiras e Equipamentos Móveis (carga dinâmica/concentrada)',
      'Parecer sobre Adequação ou Necessidade de Reforço Estrutural'
    ],
    checklistInicial: [
      { campo: "Estrutura Suporte do Mezanino — Verificação das vigas secundárias/principais e estabilidade sob carga", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 8800 e ABNT NBR 6120" },
      { campo: "Piso do Mezanino (Chapa Xadrez / Painel Wall / Grid) — Fixação dos painéis, ausência de afundamento, fissuras ou vibração excessiva", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 8800" },
      { campo: "Placa de Identificação de Carga do Mezanino — Indicação clara e visível da Carga Máxima Admissível em kgf/m²", tipoResposta: "VALOR", unidade: "kgf/m²", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NR-11 e ABNT NBR 6120" },
      { campo: "Guarda-Corpo e Rodapé do Mezanino — Guarda-corpo de 1,10 m com travessão intermediário e rodapé inferior de no mínimo 120 mm", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NR-12 e NBR 14718 (altura 1,10 m e rodapé ≥ 120 mm)" },
      { campo: "Carga atuante concentrada e distribuída verificada versus capacidade de cálculo original", tipoResposta: "VALOR", unidade: "kgf/m²", criterioReferencia: "ABNT NBR 6120 (Cargas para o cálculo de estruturas de edificações)" },
      { campo: "Tráfego de Empilhadeiras e Transpaleteiras — Avaliação de impacto dinâmico e carga concentrada nos eixos", tipoResposta: "SELECAO", opcoes: ["Não Permitido (Apenas pedestres/armazenagem estática)", "Permitido apenas transpaleteira manual", "Permitido empilhadeiras elétricas/patoladas até capacidade homologada"], criterioReferencia: "NBR 8800 e NBR 6120" },
      { campo: "Parecer Conclusivo sobre Estabilidade Estrutural e Necessidade de Reforço ou Limitação de Carga", tipoResposta: "C_NC_NA", criterioReferencia: "Responsabilidade Técnica do Engenheiro Mecânico / Estrutural" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 3. Laudo de Inspeção de Solda (Visual e Dimensional)
  'laudo-de-inspecao-de-solda-visual-e-dimensional': {
    id: 'laudo-de-inspecao-de-solda-visual-e-dimensional',
    codigo: 'SOLDA-VISUAL',
    nome: 'Laudo de Inspeção de Solda (Visual e Dimensional)',
    hrn: false,
    temHrn: false,
    normasRef: 'AWS D1.1, ASME Seção IX',
    textoBaseApresentacao: 'Inspeção técnica de juntas soldadas em estruturas industriais, caldeiraria e tubulações.',
    apresentacaoPadrao: 'Inspeção técnica de juntas soldadas em estruturas industriais, caldeiraria e tubulações.',
    metodologiaPadrao: 'Uso de gabaritos de solda tipo Cambridge para medição de perna, garganta, reforço de solda e identificação de mordeduras ou respingos.',
    secoesEspecificas: [
      'Identificação das Juntas Soldadas Inspecionadas (localização, tipo de junta)',
      'Inspeção Visual (porosidade, mordedura, respingos, trincas superficiais)',
      'Verificação Dimensional (perna de solda, comprimento do cordão, reforço)',
      'Verificação de Indícios de Falta de Penetração/Fusão',
      'Classificação de Aceitação/Rejeição por Junta Conforme Critério Normativo (AWS D1.1 ou equivalente)'
    ],
    checklistInicial: [
      { campo: "Inspeção Visual de Soldas (VT) — Ausência de trincas superficiais, mordeduras na raiz, porosidades expostas ou falta de penetração", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "AWS D1.1 / ISO 5817" },
      { campo: "Inspeção Dimensional de Soldas — Perfil da garganta da solda de filete e medição da perna da solda com calibre (z em mm)", tipoResposta: "VALOR", unidade: "mm", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "AWS D1.1 (Calibre de solda tipo Cambridge / medição de perna z)" },
      { campo: "Reforço da Solda de Topo — Altura do reforço dentro dos limites normativos (1,5 mm a 3,0 mm)", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "AWS D1.1 Tabela de critérios de aceitação" },
      { campo: "Mordedura (Undercut) — Profundidade medida inferior ao limite admissível (≤ 0,5 mm a 1,0 mm)", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "AWS D1.1" },
      { campo: "Respingos de Solda e Achatamento de Cordão — Superfícies limpas e isentas de respingos aderidos", tipoResposta: "C_NC_NA", criterioReferencia: "Acabamento superficial conforme EPS" },
      { campo: "Alinhamento e Deslocamento Angular/Linear entre Chapas Soldadas (High-Low)", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "Tolerância de montagem conforme código de fabricação" },
      { campo: "Critério de Aceitação / Rejeição por Junta Soldada Inspecionada conforme AWS D1.1", tipoResposta: "SELECAO", opcoes: ["Junta Aprovada", "Junta Reprovada com Necessidade de Goivagem e Retrabalho", "Junta Aprovada com Ressalvas Menores"], obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "AWS D1.1 / ISO 5817 Nível B ou C" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 4. Laudo de Ensaios Não Destrutivos (LP / PM / US / RX)
  'laudo-de-ensaios-nao-destrutivos-lp-pm-us-rx': {
    id: 'laudo-de-ensaios-nao-destrutivos-lp-pm-us-rx',
    codigo: 'SOLDA-END',
    nome: 'Laudo de Ensaios Não Destrutivos (LP / PM / US / RX)',
    hrn: false,
    temHrn: false,
    normasRef: 'ABNT NBR NM 334 (LP), NBR NM 342 (PM), NBR ISO 9712, ASME V',
    textoBaseApresentacao: 'Laudo de ensaio por Líquido Penetrante (LP), Partículas Magnéticas (PM) ou Ultrassom (US) para detecção de descontinuidades subsuperficiais.',
    apresentacaoPadrao: 'Laudo de ensaio por Líquido Penetrante (LP), Partículas Magnéticas (PM) ou Ultrassom (US) para detecção de descontinuidades subsuperficiais.',
    metodologiaPadrao: 'Limpeza prévia, aplicação de penetrante/revelador ou campo magnético com partículas fluorescentes e inspeção sob luz branca/negra.',
    secoesEspecificas: [
      'Definição do Método de Ensaio Aplicado por Junta/Ponto (Líquido Penetrante, Partícula Magnética, Ultrassom, Radiografia)',
      'Metodologia de Execução do Ensaio (preparação de superfície, aplicação, tempo de revelação/exposição)',
      'Resultados por Junta/Ponto Inspecionado',
      'Classificação de Descontinuidades Encontradas (tipo, dimensão, localização)',
      'Parecer de Aprovação/Reprovação Conforme Critério de Aceitação Aplicável'
    ],
    checklistInicial: [
      { campo: "Ensaio por Líquido Penetrante (LP) — Revelação de descontinuidades superficiais (trincas, poros, dobras)", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR NM 334 / NBR 16440 / AWS D1.1" },
      { campo: "Tempo de penetração e revelação respeitado conforme norma técnica e procedimento qualificado", tipoResposta: "C_NC_NA", criterioReferencia: "Procedimento qualificado de ensaio LP (tempo mín. 10-20 min)" },
      { campo: "Ensaio por Partícula Magnética (PM / US) — Rastreabilidade de defeitos subsuperficiais em ligações sujeitas a fadiga", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR NM 342 (PM) / ASME V Artigo 7" },
      { campo: "Método de ensaio não destrutivo aplicado na junta ou componente", tipoResposta: "SELECAO", opcoes: ["Líquido Penetrante (LP)", "Partículas Magnéticas (PM)", "Ultrassom (US)", "Radiografia Industrial (RX)", "Misto (LP + PM/US)"], criterioReferencia: "Norma ABNT NBR ISO 9712" },
      { campo: "Certificação e Registro do Inspetor de END (SNQC / ABENDI Nível II)", tipoResposta: "VALOR", criterioReferencia: "Certificação profissional obrigatória para ensaios não destrutivos" },
      { campo: "Laudo Conclusivo de Aceitação / Rejeição de Descontinuidades por END", tipoResposta: "SELECAO", opcoes: ["Aprovado sem Descontinuidades Relevantes", "Reprovado — Descontinuidade Linear Inadmissível", "Aprovado sob Condição de Monitoramento"], obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Critério de aceitação ASME Seção VIII / AWS D1.1" }
    ],
    atualizadoEm: new Date().toISOString()
  }
};

export const ALIASES_TIPOS_ESTRUTURAS_METALICAS: Record<string, string> = {
  'laudo-galpao-metalico': 'laudo-de-integridade-estrutural-de-galpoes-e-coberturas-metalicas-abnt-nbr-8800',
  'estr-galp': 'laudo-de-integridade-estrutural-de-galpoes-e-coberturas-metalicas-abnt-nbr-8800',
  'laudo-capacidade-piso': 'laudo-de-capacidade-de-carga-de-pisos-industriais-e-mezaninos-nbr-8800-nbr-6120',
  'estr-piso': 'laudo-de-capacidade-de-carga-de-pisos-industriais-e-mezaninos-nbr-8800-nbr-6120',
  'laudo-inspecao-solda': 'laudo-de-inspecao-de-solda-visual-e-dimensional',
  'solda-visual': 'laudo-de-inspecao-de-solda-visual-e-dimensional',
  'laudo-ensaios-end': 'laudo-de-ensaios-nao-destrutivos-lp-pm-us-rx',
  'solda-end': 'laudo-de-ensaios-nao-destrutivos-lp-pm-us-rx'
};

export async function sincronizarFirestorePlayground(): Promise<{
  sucesso: boolean;
  totalAtualizados: number;
  mensagem: string;
}> {
  if (!db) {
    return {
      sucesso: false,
      totalAtualizados: 0,
      mensagem: 'Instância do Firestore não disponível no momento. Os dados estão preservados no catálogo local e taxonomia.'
    };
  }

  let gravados = 0;
  const categoriasAlvo = ['playground-e-lazer'];

  try {
    for (const catId of categoriasAlvo) {
      // Documento da categoria
      const catDocRef = doc(db, 'categoriasLaudo', catId);
      await setDoc(catDocRef, {
        id: catId,
        nome: 'Playground e Lazer',
        icone: 'Smile',
        atualizadoEm: new Date().toISOString()
      }, { merge: true });

      // Documentos de cada tipo
      for (const [tipoKey, dados] of Object.entries(TIPOS_PLAYGROUND_FIRESTORE)) {
        // Grava no ID canônico por extenso
        const tipoDocRef = doc(db, 'categoriasLaudo', catId, 'tipos', tipoKey);
        await setDoc(tipoDocRef, dados, { merge: true });
        gravados++;

        // Grava também nos IDs curtos / aliases
        const aliases = Object.keys(ALIASES_TIPOS_PLAYGROUND).filter(k => ALIASES_TIPOS_PLAYGROUND[k] === tipoKey);
        for (const shortAlias of aliases) {
          const shortDocRef = doc(db, 'categoriasLaudo', catId, 'tipos', shortAlias);
          await setDoc(shortDocRef, {
            ...dados,
            id: shortAlias,
            aliasDe: tipoKey
          }, { merge: true });
          gravados++;
        }
      }
    }

    return {
      sucesso: true,
      totalAtualizados: gravados,
      mensagem: `Sucesso: ${gravados} documentos de playground sincronizados nas coleções Firestore categoriasLaudo/playground-e-lazer/tipos/{tipo}.`
    };
  } catch (error: any) {
    console.error('Erro ao sincronizar tipos de playground com Firestore:', error);
    return {
      sucesso: false,
      totalAtualizados: gravados,
      mensagem: `Erro na gravação Firestore: ${error?.message || String(error)}`
    };
  }
}

export async function sincronizarFirestoreEstruturasMetalicas(): Promise<{
  sucesso: boolean;
  totalAtualizados: number;
  mensagem: string;
}> {
  if (!db) {
    return {
      sucesso: false,
      totalAtualizados: 0,
      mensagem: 'Instância do Firestore não disponível no momento. Os dados estão preservados no catálogo local e taxonomia.'
    };
  }

  let gravados = 0;
  const categoriasAlvo = [
    'estruturas-metalicas-caldeiraria-e-soldagem',
    'estruturas-metálicas-caldeiraria-e-soldagem'
  ];

  try {
    for (const catId of categoriasAlvo) {
      // Documento da categoria
      const catDocRef = doc(db, 'categoriasLaudo', catId);
      await setDoc(catDocRef, {
        id: catId,
        nome: 'Estruturas Metálicas, Caldeiraria e Soldagem',
        icone: 'Hammer',
        atualizadoEm: new Date().toISOString()
      }, { merge: true });

      // Documentos de cada tipo
      for (const [tipoKey, dados] of Object.entries(TIPOS_ESTRUTURAS_METALICAS_FIRESTORE)) {
        // Grava no ID canônico por extenso
        const tipoDocRef = doc(db, 'categoriasLaudo', catId, 'tipos', tipoKey);
        await setDoc(tipoDocRef, dados, { merge: true });
        gravados++;

        // Grava também nos IDs curtos / aliases
        const aliases = Object.keys(ALIASES_TIPOS_ESTRUTURAS_METALICAS).filter(k => ALIASES_TIPOS_ESTRUTURAS_METALICAS[k] === tipoKey);
        for (const shortAlias of aliases) {
          const shortDocRef = doc(db, 'categoriasLaudo', catId, 'tipos', shortAlias);
          await setDoc(shortDocRef, {
            ...dados,
            id: shortAlias,
            aliasDe: tipoKey
          }, { merge: true });
          gravados++;
        }
      }
    }

    return {
      sucesso: true,
      totalAtualizados: gravados,
      mensagem: `Sucesso: ${gravados} documentos de estruturas metálicas sincronizados nas coleções Firestore categoriasLaudo/estruturas-metalicas-caldeiraria-e-soldagem/tipos/{tipo}.`
    };
  } catch (error: any) {
    console.error('Erro ao sincronizar tipos de estruturas metálicas com Firestore:', error);
    return {
      sucesso: false,
      totalAtualizados: gravados,
      mensagem: `Erro na gravação Firestore: ${error?.message || String(error)}`
    };
  }
}

/**
 * Definições completas dos 4 tipos de laudo da categoria
 * Equipamentos de Elevação e Movimentação Industrial (Estáticos/Fixos)
 */
export const TIPOS_ELEVACAO_INDUSTRIAL_FIRESTORE: Record<string, DocumentoTipoLaudoFirestore> = {
  // 1. Laudo de Integridade e Segurança de Pontes Rolantes e Pórticos Rolantes
  'laudo-de-integridade-e-seguranca-de-pontes-rolantes-e-porticos-rolantes': {
    id: 'laudo-de-integridade-e-seguranca-de-pontes-rolantes-e-porticos-rolantes',
    codigo: 'ELEV-PONTE',
    nome: 'Laudo de Integridade e Segurança de Pontes Rolantes e Pórticos Rolantes',
    hrn: false,
    temHrn: false,
    normasRef: 'ABNT NBR 8400, NBR 16147, NR-11, NR-12',
    textoBaseApresentacao: 'Inspeção mecânica, estrutural e elétrica em pontes rolantes univiga e dupla viga, pórticos e semi-pórticos industriais.',
    apresentacaoPadrao: 'Inspeção mecânica, estrutural e elétrica em pontes rolantes univiga e dupla viga, pórticos e semi-pórticos industriais.',
    metodologiaPadrao: 'Inspeção de vigas de rolamento, trilhos, batentes de fim de curso, freios de translação e elevação, cabo de aço e enrolador.',
    secoesEspecificas: [
      'Identificação do Equipamento (capacidade nominal, vão, fabricante, TAG)',
      'Vistoria Estrutural das Vigas de Rolamento (trilhos, alinhamento, desgaste)',
      'Verificação de Barramentos Elétricos (cabos, coletores de energia, isolamento)',
      'Verificação da Talha (cabo/corrente, freio, redutor)',
      'Verificação do Sistema de Freios (freio de translação e freio de elevação)',
      'Verificação de Fins de Curso e Dispositivos de Segurança (limitador de carga, botão de emergência)',
      'Verificação da Estrutura da Ponte/Pórtico (viga principal e carrinho)'
    ],
    checklistInicial: [
      { campo: "Trilhos de Rolamento e Vigas de Sustentação — Desgaste do boleto do trilho, alinhamento, nivelamento e ausência de trincas nas soldas de emenda", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 8400 / NBR 16147" },
      { campo: "Batentes de Fim de Curso Mecânicos — Presença e integridade dos amortecedores (borracha ou hidráulicos) nas extremidades do caminho de rolamento", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NR-11 e ABNT NBR 8400" },
      { campo: "Viga Principal e Cabeceiras — Integridade estrutural, ausência de deformações plásticas permanentes, corrosão e aperto dos parafusos estruturais", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 8400" },
      { campo: "Desgaste de Rodas de Translação — Medição do desgaste do friso e da banda de rodagem das rodas da ponte e do trole", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "ABNT NBR 8400 (Desgaste máximo do friso e diâmetro)" },
      { campo: "Freio do Mecanismo de Elevação — Eficiência de frenagem sob carga nominal, desgaste das pastilhas/lonas e ausência de vazamento de óleo no atuador", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 8400 / NR-11" },
      { campo: "Freio de Translação (Ponte e Trole) — Suavidade de frenagem, sem travamento brusco das rodas ou escorregamento excessivo", tipoResposta: "C_NC_NA", criterioReferencia: "ABNT NBR 8400" },
      { campo: "Guia de Cabo de Aço da Talha — Integridade da guia móvel de assentamento do cabo nas ranhuras do tambor", tipoResposta: "C_NC_NA", criterioReferencia: "ABNT NBR 8400" },
      { campo: "Cabo de Aço de Içamento — Contagem de arames rompidos por passo, redução do diâmetro nominal, corrosão ou nós/deformações (gaiola de passarinho)", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ISO 4309 / ABNT NBR 16147" },
      { campo: "Medição do Diâmetro Efetivo do Cabo de Aço", tipoResposta: "VALOR", unidade: "mm", criterioReferencia: "ISO 4309 (Descarte se redução > 7% a 10% do nominal)" },
      { campo: "Gancho de Carga e Trava de Segurança — Presença e ação de mola da trava, ausência de trincas na raiz da rosca e rotação livre em 360°", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "DIN 15401 / ABNT NBR 8400" },
      { campo: "Abertura da Garganta do Gancho — Variação em relação à medida original 'y'", tipoResposta: "VALOR", unidade: "mm", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "DIN 15401 (Descarte se abertura exceder 10% da original)" },
      { campo: "Chave Fim de Curso Superior de Elevação — Teste de desarme mecânico/elétrico antes do moitão atingir o tambor", tipoResposta: "C_NC_NA", criterioReferencia: "NR-12 e ABNT NBR 8400 (Dispositivo de corte de segurança)" },
      { campo: "Limitador de Carga Eletromecânico/Eletrônico — Ajustado para cortar a elevação quando a carga exceder a capacidade nominal", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NR-11 e ABNT NBR 8400 (Corte em 100% a 110% da capacidade nominal)" },
      { campo: "Botoeira Pendente / Controle Remoto — Identificação clara das funções, cabo de alívio de tração de aço intacto e botão de emergência tipo cogumelo", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NR-12" },
      { campo: "Sinalização Sonora e Visual (Giroflex / Sirene) — Ativação automática e sincronizada com o movimento de translação da ponte", tipoResposta: "C_NC_NA", criterioReferencia: "NR-11 e NR-12" },
      { campo: "Sinalização de Capacidade Máxima de Carga — Pintura visível a partir do piso operacional em ambos os lados da viga principal", tipoResposta: "VALOR", unidade: "t", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NR-11 (Capacidade em toneladas em destaque legível)" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 2. Laudo de Análise de Vida Útil Remanescente (SWP - Safe Working Period)
  'laudo-de-analise-de-vida-util-remanescente-swp-safe-working-period': {
    id: 'laudo-de-analise-de-vida-util-remanescente-swp-safe-working-period',
    codigo: 'ELEV-SWP',
    nome: 'Laudo de Análise de Vida Útil Remanescente (SWP - Safe Working Period)',
    hrn: false,
    temHrn: false,
    normasRef: 'ISO 12482, ISO 4301, FEM 1.001, FEM 9.755',
    textoBaseApresentacao: 'Cálculo analítico do Período Seguro de Trabalho (Safe Working Period - SWP) para mecanismos de elevação e talhas de pontes rolantes.',
    apresentacaoPadrao: 'Cálculo analítico do Período Seguro de Trabalho (Safe Working Period - SWP) para mecanismos de elevação e talhas de pontes rolantes.',
    metodologiaPadrao: 'Coleta de dados de horas de operação, espectro de carga médio, ciclos por hora e cálculo da classe FEM do mecanismo.',
    secoesEspecificas: [
      'Levantamento do Histórico de Ciclos de Operação (horas trabalhadas, número de ciclos de içamento)',
      'Classificação do Grupo de Utilização e Estado de Carga (conforme ISO 4301 / FEM 1.001)',
      'Cálculo do SWP (Período de Trabalho Seguro) com Base na Classificação',
      'Estimativa da Vida Útil Remanescente',
      'Recomendação de Periodicidade de Reinspeção'
    ],
    checklistInicial: [
      { campo: "Horas Efetivas de Operação Acumuladas no Horímetro / Registrador de Carga", tipoResposta: "VALOR", unidade: "horas", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ISO 12482 / FEM 9.755" },
      { campo: "Espectro de Carga Médio de Utilização do Equipamento (Km)", tipoResposta: "SELECAO", opcoes: ["Leve (L1: Km = 0,53 - Raramente atinge carga máxima)", "Médio (L2: Km = 0,67 - Frequente carga média, ocasional nominal)", "Pesado (L3: Km = 0,85 - Frequentemente em carga nominal)", "Muito Pesado (L4: Km = 1,00 - Constantemente em carga nominal)"], criterioReferencia: "ISO 4301 / FEM 1.001" },
      { campo: "Classe de Funcionamento do Mecanismo de Elevação Conforme Placa de Identificação", tipoResposta: "SELECAO", opcoes: ["FEM 1Bm / ISO M3 (400 h)", "FEM 1Am / ISO M4 (800 h)", "FEM 2m / ISO M5 (1.600 h)", "FEM 3m / ISO M6 (3.200 h)", "FEM 4m / ISO M7 (6.300 h)"], criterioReferencia: "FEM 9.755 / ISO 12482" },
      { campo: "Percentual do Período de Trabalho Seguro Consumido (SWP %)", tipoResposta: "VALOR", unidade: "%", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ISO 12482 (Se consumo atingir 100%, revisão geral obrigatória)" },
      { campo: "Estimativa Teórica da Vida Útil Remanescente sob o Regime Atual", tipoResposta: "VALOR", unidade: "anos / meses", criterioReferencia: "Modelagem analítica ISO 12482" },
      { campo: "Inspeção Especial de Desmontagem Geral (Overhaul) Exigida ou Programada", tipoResposta: "SELECAO", opcoes: ["Não Necessária (SWP < 80%)", "Programar Revisão Preventiva (80% ≤ SWP < 100%)", "Parada Imediata para Overhaul Obrigatório (SWP ≥ 100%)"], obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ISO 12482 Artigo 6" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 3. Laudo de Inspeção de Elevadores de Cargas e Monta-Cargas
  'laudo-de-inspecao-de-elevadores-de-cargas-e-monta-cargas': {
    id: 'laudo-de-inspecao-de-elevadores-de-cargas-e-monta-cargas',
    codigo: 'ELEV-MONTA',
    nome: 'Laudo de Inspeção de Elevadores de Cargas e Monta-Cargas',
    hrn: false,
    temHrn: false,
    normasRef: 'ABNT NBR 14712, NR-11, NR-12',
    textoBaseApresentacao: 'Inspeção de segurança em elevadores de carga industriais e monta-cargas hidráulicos ou a cabo.',
    apresentacaoPadrao: 'Inspeção de segurança em elevadores de carga industriais e monta-cargas hidráulicos ou a cabo.',
    metodologiaPadrao: 'Verificação do freio de segurança (cunha de frenagem), portas de pavimento intertravadas, guias e limites.',
    secoesEspecificas: [
      'Identificação do Equipamento (capacidade nominal, percurso, número de paradas)',
      'Verificação de Cabos de Aço (tração e limitador de velocidade)',
      'Verificação do Freio de Emergência (pára-quedas)',
      'Verificação de Intertravamento de Portas (pavimento e cabina)',
      'Verificação da Casa de Máquinas (motor, quadro de comando, iluminação, ventilação)',
      'Verificação do Poço (fundo de poço, para-choques, iluminação)'
    ],
    checklistInicial: [
      { campo: "Torre / Caixa de Corrida e Poço — Guias verticais sem deformações, fixações rígidas e poço limpo e isento de infiltrações de água ou óleo", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 14712" },
      { campo: "Intertravamento Elétrico e Mecânico das Portas de Pavimento — Impossibilidade de movimentação do elevador com portas abertas e bloqueio de abertura sem presença de cabina", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 14712 / NR-12" },
      { campo: "Freio de Segurança Instantâneo / Progressivo (Pára-quedas) — Teste funcional das cunhas de travamento nas guias em caso de sobrevelocidade ou quebra de cabo", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 14712" },
      { campo: "Sinalização de Capacidade Máxima e Proibição Expressa de Transporte de Pessoas", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NR-11 e ABNT NBR 14712 (Placa indelével em todos os pavimentos)" },
      { campo: "Cabos de Tração e Limitador de Velocidade — Diâmetro uniforme, ausência de arames partidos agrupados e lubrificação", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 14712 e ISO 4309" },
      { campo: "Chaves Limite de Fim de Curso Superior e Inferior — Corte de força automático antes de atingir os para-choques", tipoResposta: "C_NC_NA", criterioReferencia: "ABNT NBR 14712" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 4. Laudo de Dispositivos de Içamento (Olhais, Balancins e Travessões)
  'laudo-de-dispositivos-de-icamento-olhais-balancins-e-travessoes': {
    id: 'laudo-de-dispositivos-de-icamento-olhais-balancins-e-travessoes',
    codigo: 'ELEV-DISP',
    nome: 'Laudo de Dispositivos de Içamento (Olhais, Balancins e Travessões)',
    hrn: false,
    temHrn: false,
    normasRef: 'ABNT NBR 8400, ASME B30.20',
    textoBaseApresentacao: 'Projeto, cálculo estrutural e laudo de homologação com ART de balancins de içamento, travessões de carga e olhais soldados.',
    apresentacaoPadrao: 'Projeto, cálculo estrutural e laudo de homologação com ART de balancins de içamento, travessões de carga e olhais soldados.',
    metodologiaPadrao: 'Análise de tensões de Von Mises por elementos finitos (FEA), teste de carga com dinamômetro e ensaio de LP nas soldas dos olhais.',
    secoesEspecificas: [
      'Identificação do Dispositivo (tipo, dimensões, capacidade nominal)',
      'Memória de Cálculo do Dispositivo (dimensionamento estrutural e fator de segurança)',
      'Teste de Carga do Acessório (percentual da capacidade nominal)',
      'Inspeção de Solda e Fixação',
      'Marcação e Identificação Permanente da Capacidade'
    ],
    checklistInicial: [
      { campo: "Identificação e Rastreabilidade — Placa de identificação com capacidade nominal (WLL/CMT), peso próprio (tara), fabricante, número de série e TAG", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ASME B30.20 e ABNT NBR 8400" },
      { campo: "Inspeção Dimensional de Furos de Olhais e Pinos — Medição de ovalização de furos de olhais e desgaste em pontos de contato de manilhas", tipoResposta: "VALOR", unidade: "mm", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ASME B30.20 (Descarte se desgaste ou ovalização > 5% a 10%)" },
      { campo: "Ensaios Não Destrutivos (LP / PM) nas Soldas dos Olhais de Carga — Ausência de trincas de fadiga na zona termicamente afetada (ZTA)", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR NM 334 / ASME B30.20" },
      { campo: "Memória de Cálculo e Verificação de Fator de Segurança Estrutural (Fator de segurança mínimo de 3:1 a 5:1)", tipoResposta: "VALOR", unidade: "FS", criterioReferencia: "ASME B30.20 / NBR 8400" },
      { campo: "Teste de Carga Estático / Dinâmico Realizado — Aplicação de sobrecarga de ensaio (125% a 150% da WLL) com célula de carga calibrada", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ASME B30.20 e ABNT NBR 8400" },
      { campo: "Ausência de Deformações Permanentes Residuais após o Teste de Sobrecarga", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ASME B30.20" }
    ],
    atualizadoEm: new Date().toISOString()
  }
};

/**
 * Mapeamento de identificadores curtos para os tipos de elevação industrial
 */
export const ALIASES_TIPOS_ELEVACAO_INDUSTRIAL: Record<string, string> = {
  'laudo-ponte-rolante': 'laudo-de-integridade-e-seguranca-de-pontes-rolantes-e-porticos-rolantes',
  'laudo-integridade-seguranca-pontes-rolantes-porticos-rolantes': 'laudo-de-integridade-e-seguranca-de-pontes-rolantes-e-porticos-rolantes',
  'pontes-rolantes-e-porticos': 'laudo-de-integridade-e-seguranca-de-pontes-rolantes-e-porticos-rolantes',
  'laudo-pontes-rolantes': 'laudo-de-integridade-e-seguranca-de-pontes-rolantes-e-porticos-rolantes',
  'elev-ponte': 'laudo-de-integridade-e-seguranca-de-pontes-rolantes-e-porticos-rolantes',

  'laudo-vida-util-swp': 'laudo-de-analise-de-vida-util-remanescente-swp-safe-working-period',
  'laudo-de-analise-de-vida-util-remanescente-swp': 'laudo-de-analise-de-vida-util-remanescente-swp-safe-working-period',
  'laudo-analise-vida-util-remanescente-swp': 'laudo-de-analise-de-vida-util-remanescente-swp-safe-working-period',
  'swp': 'laudo-de-analise-de-vida-util-remanescente-swp-safe-working-period',
  'elev-swp': 'laudo-de-analise-de-vida-util-remanescente-swp-safe-working-period',

  'laudo-elevador-carga': 'laudo-de-inspecao-de-elevadores-de-cargas-e-monta-cargas',
  'laudo-inspecao-elevadores-cargas-monta-cargas': 'laudo-de-inspecao-de-elevadores-de-cargas-e-monta-cargas',
  'elevadores-de-cargas-e-monta-cargas': 'laudo-de-inspecao-de-elevadores-de-cargas-e-monta-cargas',
  'elevadores-e-dispositivos-de-carga-industrial': 'laudo-de-inspecao-de-elevadores-de-cargas-e-monta-cargas',
  'elev-monta': 'laudo-de-inspecao-de-elevadores-de-cargas-e-monta-cargas',

  'laudo-dispositivos-icamento': 'laudo-de-dispositivos-de-icamento-olhais-balancins-e-travessoes',
  'laudo-dispositivos-icamento-olhais-balancins-travessoes': 'laudo-de-dispositivos-de-icamento-olhais-balancins-e-travessoes',
  'dispositivos-de-icamento': 'laudo-de-dispositivos-de-icamento-olhais-balancins-e-travessoes',
  'elev-disp': 'laudo-de-dispositivos-de-icamento-olhais-balancins-e-travessoes'
};

/**
 * Função de sincronização Firestore para os tipos da categoria
 * "Equipamentos de Elevação e Movimentação Industrial (Estáticos/Fixos)"
 */
export async function sincronizarFirestoreElevacaoIndustrial(): Promise<{
  sucesso: boolean;
  totalAtualizados: number;
  mensagem: string;
}> {
  if (!db) {
    return {
      sucesso: false,
      totalAtualizados: 0,
      mensagem: 'Instância do Firestore não disponível no momento. Os dados estão preservados no catálogo local e taxonomia.'
    };
  }

  let gravados = 0;
  const categoriasAlvo = [
    'equipamentos-de-elevacao-e-movimentacao-industrial',
    'equipamentos-de-elevação-e-movimentação-industrial',
    'equipamentos-de-elevacao-e-movimentacao-industrial-estaticos-fixos'
  ];

  try {
    for (const catId of categoriasAlvo) {
      // Documento da categoria
      const catDocRef = doc(db, 'categoriasLaudo', catId);
      await setDoc(catDocRef, {
        id: catId,
        nome: 'Equipamentos de Elevação e Movimentação Industrial (Estáticos/Fixos)',
        icone: 'Layers',
        atualizadoEm: new Date().toISOString()
      }, { merge: true });

      // Documentos de cada tipo
      for (const [tipoKey, dados] of Object.entries(TIPOS_ELEVACAO_INDUSTRIAL_FIRESTORE)) {
        // Grava no ID canônico por extenso
        const tipoDocRef = doc(db, 'categoriasLaudo', catId, 'tipos', tipoKey);
        await setDoc(tipoDocRef, dados, { merge: true });
        gravados++;

        // Grava também nos IDs curtos / aliases
        const aliases = Object.keys(ALIASES_TIPOS_ELEVACAO_INDUSTRIAL).filter(k => ALIASES_TIPOS_ELEVACAO_INDUSTRIAL[k] === tipoKey);
        for (const shortAlias of aliases) {
          const shortDocRef = doc(db, 'categoriasLaudo', catId, 'tipos', shortAlias);
          await setDoc(shortDocRef, {
            ...dados,
            id: shortAlias,
            aliasDe: tipoKey
          }, { merge: true });
          gravados++;
        }
      }
    }

    return {
      sucesso: true,
      totalAtualizados: gravados,
      mensagem: `Sucesso: ${gravados} documentos de elevação industrial sincronizados nas coleções Firestore categoriasLaudo/equipamentos-de-elevacao-e-movimentacao-industrial/tipos/{tipo}.`
    };
  } catch (error: any) {
    console.error('Erro ao sincronizar tipos de elevação industrial com Firestore:', error);
    return {
      sucesso: false,
      totalAtualizados: gravados,
      mensagem: `Erro na gravação Firestore: ${error?.message || String(error)}`
    };
  }
}

/**
 * Definições completas dos 3 tipos de laudo da categoria
 * Tubulações de Processo e Redes Industriais (Vasos, Tanques e Redes de Fluidos)
 */
export const TIPOS_TUBULACOES_PROCESSOS_FIRESTORE: Record<string, DocumentoTipoLaudoFirestore> = {
  // 1. Laudo de Teste de Estanqueidade e Pressão Hidrostática/Pneumática
  'laudo-de-teste-de-estanqueidade-e-pressao-hidrostatica-pneumatica': {
    id: 'laudo-de-teste-de-estanqueidade-e-pressao-hidrostatica-pneumatica',
    codigo: 'FLUID-TEST',
    nome: 'Laudo de Teste de Estanqueidade e Pressão Hidrostática/Pneumática',
    hrn: false,
    temHrn: false,
    normasRef: 'ASME B31.3, NR-13',
    textoBaseApresentacao: 'Execução e emissão de laudo pericial de teste hidrostático em linhas industriais recém-montadas ou sob manutenção.',
    apresentacaoPadrao: 'Execução e emissão de laudo pericial de teste hidrostático em linhas industriais recém-montadas ou sob manutenção.',
    metodologiaPadrao: 'Injeção de água desmineralizada com bomba de teste manual/elétrica, monitoramento de pressão por registrador gráfico ou digital calibrado.',
    secoesEspecificas: [
      'Identificação da Linha/Sistema (tag, diâmetro, material, classe de pressão, código de projeto)',
      'Verificação Preliminar (isolamento da linha, suportação, dispositivos de segurança removidos/bloqueados)',
      'Critérios do Teste (pressão de teste, tempo de estabilização, meio de teste — água, ar, gás inerte)',
      'Execução do Teste Hidrostático/Pneumático (procedimento, instrumentação utilizada, curva pressão x tempo)',
      'Verificação de Vazamentos e Deformações Durante o Teste',
      'Liberação da Linha (despressurização, drenagem, secagem, remoção de bloqueios)'
    ],
    checklistInicial: [
      'Linha/sistema identificado (tag, diâmetro, material, classe)',
      'Código de projeto aplicável definido (ASME B31.3 ou equivalente)',
      'Pressão de teste calculada conforme código (múltiplo da pressão de projeto)',
      'Isolamento da linha conferido (flanges cegos, bloqueios)',
      'Suportação provisória/definitiva adequada para o peso do fluido de teste',
      'Instrumentos de medição (manômetros) calibrados e com certificado válido',
      'Meio de teste definido (água, ar comprimido, gás inerte) e justificado',
      'Pressurização realizada de forma gradual e controlada',
      'Tempo de estabilização/permanência na pressão de teste respeitado',
      'Inspeção visual de juntas, soldas e conexões durante o teste',
      'Ausência de vazamentos registrada',
      'Ausência de deformações permanentes registrada',
      'Queda de pressão durante o teste dentro da tolerância aceitável',
      'Despressurização controlada realizada ao final do teste',
      'Drenagem e secagem da linha (quando aplicável) realizadas',
      'Bloqueios e dispositivos de segurança reinstalados após o teste',
      'Certificado/registro do teste emitido com resultado (aprovado/reprovado)'
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 2. Laudo de Vistoria de Sistemas de Refrigeração por Amônia (NH₃)
  'laudo-de-vistoria-de-sistemas-de-refrigeracao-por-amonia-nh3': {
    id: 'laudo-de-vistoria-de-sistemas-de-refrigeracao-por-amonia-nh3',
    codigo: 'FLUID-NH3',
    nome: 'Laudo de Vistoria de Sistemas de Refrigeração por Amônia (NH₃)',
    hrn: false,
    temHrn: false,
    normasRef: 'NR-36, NR-13, ABNT NBR 16069, IIAR',
    textoBaseApresentacao: 'Inspeção pericial de segurança mecânica em salas de compressores, condensadores evaporativos e tanques acumuladores de amônia.',
    apresentacaoPadrao: 'Inspeção pericial de segurança mecânica em salas de compressores, condensadores evaporativos e tanques acumuladores de amônia.',
    metodologiaPadrao: 'Verificação de detectores de vazamento de NH₃, ventilação de emergência forçada, válvulas de alívio duplas e chuveiro lava-olhos.',
    secoesEspecificas: [
      'Identificação do Sistema (capacidade frigorífica, carga de amônia, arranjo — sala de máquinas, condensadores, reservatórios)',
      'Verificação da Sala de Máquinas (ventilação, detecção de gás, iluminação antiexplosão, rotas de fuga)',
      'Verificação de Compressores e Componentes Mecânicos (vibração, vedações, lubrificação, dispositivos de segurança)',
      'Verificação de Condensadores Evaporativos e Torres (estado estrutural, corrosão, tratamento de água)',
      'Verificação de Tanques Acumuladores/Reservatórios de Amônia (integridade, dispositivos de alívio, nível)',
      'Verificação de Tubulações e Válvulas do Sistema (isolamento térmico, identificação por cor, vazamentos)',
      'Verificação de Equipamentos de Proteção e Emergência (chuveiro/lava-olhos, EPI para amônia, plano de emergência)'
    ],
    checklistInicial: [
      'Capacidade frigorífica e carga total de amônia identificadas',
      'Sala de máquinas com ventilação mecânica adequada (conforme NBR 16069/IIAR)',
      'Sistema de detecção de vazamento de amônia instalado e testado',
      'Alarmes visuais e sonoros de detecção funcionais',
      'Iluminação e instalações elétricas da sala de máquinas adequadas à classificação de área',
      'Rotas de fuga sinalizadas e desobstruídas',
      'Compressores sem vazamentos aparentes e com vibração dentro do esperado',
      'Vedações e selos mecânicos dos compressores íntegros',
      'Dispositivos de segurança (pressostatos, válvulas de alívio) testados',
      'Condensadores evaporativos sem corrosão estrutural significativa',
      'Tratamento de água dos condensadores/torres verificado',
      'Tanques acumuladores identificados, sem sinais de corrosão ou vazamento',
      'Válvulas de alívio de pressão dos reservatórios calibradas e com selo válido',
      'Nível de amônia nos reservatórios dentro dos limites operacionais',
      'Tubulações identificadas por cor/código conforme norma aplicável',
      'Isolamento térmico das tubulações íntegro',
      'Válvulas de bloqueio e controle sem vazamentos',
      'Chuveiro de emergência e lava-olhos disponíveis, funcionais e sinalizados',
      'EPIs específicos para amônia disponíveis (máscara autônoma, luvas, óculos)',
      'Plano de emergência para vazamento de amônia disponível e atualizado',
      'Treinamento da equipe para resposta a emergências verificado (documental)'
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 3. Laudo de Medição de Espessura por Ultrassom (Mapeamento de Corrosão)
  'laudo-de-medicao-de-espessura-por-ultrassom-mapeamento-de-corrosao': {
    id: 'laudo-de-medicao-de-espessura-por-ultrassom-mapeamento-de-corrosao',
    codigo: 'FLUID-US',
    nome: 'Laudo de Medição de Espessura por Ultrassom (Mapeamento de Corrosão)',
    hrn: false,
    temHrn: false,
    normasRef: 'ABNT NBR NM 330, ASME Seção V Artigo 5, API 570',
    textoBaseApresentacao: 'Mapeamento de perda de espessura por corrosão interna/externa em tubulações, dutos e chapas metálicas industriais.',
    apresentacaoPadrao: 'Mapeamento de perda de espessura por corrosão interna/externa em tubulações, dutos e chapas metálicas industriais.',
    metodologiaPadrao: 'Ensaio pontual com medidor digital por ultrassom e cabeçote duplo cristal com acoplante, gerando mapa de isócoras de desgaste.',
    secoesEspecificas: [
      'Identificação do Componente Inspecionado (tubulação, duto, chapa — material, diâmetro/dimensões, espessura nominal)',
      'Metodologia e Equipamento Utilizado (medidor de espessura por ultrassom, calibração, acoplante)',
      'Definição dos Pontos de Medição (malha de pontos, CMLs — Corrosion Monitoring Locations)',
      'Execução das Medições e Registro de Espessuras',
      'Mapeamento de Perda de Espessura (comparação com espessura nominal/original)',
      'Cálculo da Taxa de Corrosão e Vida Útil Remanescente',
      'Identificação de Áreas Críticas (corrosão localizada, afunilamento, erosão)'
    ],
    checklistInicial: [
      'Componente identificado (tipo, material, diâmetro/dimensões)',
      'Espessura nominal/original do componente levantada (catálogo ou projeto)',
      'Equipamento de ultrassom calibrado, com certificado válido',
      'Bloco padrão de calibração utilizado antes das medições',
      'Acoplante adequado ao acabamento superficial utilizado',
      'Malha de pontos de medição (CMLs) definida e mapeada',
      'Preparação da superfície (remoção de pintura/incrustação) realizada quando necessário',
      'Espessuras medidas e registradas em cada ponto',
      'Menor espessura encontrada identificada e localizada',
      'Perda de espessura calculada (percentual em relação à nominal)',
      'Espessura mínima admissível calculada conforme código aplicável (ASME B31.3, API 570)',
      'Taxa de corrosão calculada (quando houver histórico de medições anteriores)',
      'Vida útil remanescente estimada para o componente/ponto crítico',
      'Áreas de corrosão localizada (pites) identificadas e mapeadas',
      'Pontos de afunilamento ou erosão preferencial identificados (curvas, reduções, solda)',
      'Registro fotográfico das áreas críticas anexado',
      'Recomendações técnicas (reparo, substituição, reinspeção) registradas',
      'Intervalo de reinspeção recomendado definido'
    ],
    atualizadoEm: new Date().toISOString()
  }
};

/**
 * Mapeamento de identificadores curtos e slugs alternativos para Tubulações de Processo e Redes Industriais
 */
export const ALIASES_TIPOS_TUBULACOES_PROCESSO: Record<string, string> = {
  // FLUID-TEST
  'laudo-pressao-hidrostatica': 'laudo-de-teste-de-estanqueidade-e-pressao-hidrostatica-pneumatica',
  'laudo-teste-estanqueidade-pressao-hidrostatica-pneumatica': 'laudo-de-teste-de-estanqueidade-e-pressao-hidrostatica-pneumatica',
  'teste-de-estanqueidade-e-pressao-hidrostatica-pneumatica': 'laudo-de-teste-de-estanqueidade-e-pressao-hidrostatica-pneumatica',
  'teste-estanqueidade-pressao-hidrostatica': 'laudo-de-teste-de-estanqueidade-e-pressao-hidrostatica-pneumatica',
  'teste-hidrostatico': 'laudo-de-teste-de-estanqueidade-e-pressao-hidrostatica-pneumatica',
  'FLUID-TEST': 'laudo-de-teste-de-estanqueidade-e-pressao-hidrostatica-pneumatica',

  // FLUID-NH3
  'laudo-refrigeracao-amonia': 'laudo-de-vistoria-de-sistemas-de-refrigeracao-por-amonia-nh3',
  'laudo-vistoria-sistemas-refrigeracao-amonia-nh3': 'laudo-de-vistoria-de-sistemas-de-refrigeracao-por-amonia-nh3',
  'sistemas-de-refrigeracao-por-amonia-nh3': 'laudo-de-vistoria-de-sistemas-de-refrigeracao-por-amonia-nh3',
  'refrigeracao-amonia': 'laudo-de-vistoria-de-sistemas-de-refrigeracao-por-amonia-nh3',
  'refrigeracao-por-amonia': 'laudo-de-vistoria-de-sistemas-de-refrigeracao-por-amonia-nh3',
  'amonia-nh3': 'laudo-de-vistoria-de-sistemas-de-refrigeracao-por-amonia-nh3',
  'FLUID-NH3': 'laudo-de-vistoria-de-sistemas-de-refrigeracao-por-amonia-nh3',

  // FLUID-US
  'laudo-ultrassom-espessura': 'laudo-de-medicao-de-espessura-por-ultrassom-mapeamento-de-corrosao',
  'laudo-medicao-espessura-ultrassom-mapeamento-corrosao': 'laudo-de-medicao-de-espessura-por-ultrassom-mapeamento-de-corrosao',
  'medicao-de-espessura-por-ultrassom-mapeamento-de-corrosao': 'laudo-de-medicao-de-espessura-por-ultrassom-mapeamento-de-corrosao',
  'medicao-espessura-ultrassom': 'laudo-de-medicao-de-espessura-por-ultrassom-mapeamento-de-corrosao',
  'ultrassom-espessura': 'laudo-de-medicao-de-espessura-por-ultrassom-mapeamento-de-corrosao',
  'mapeamento-corrosao': 'laudo-de-medicao-de-espessura-por-ultrassom-mapeamento-de-corrosao',
  'FLUID-US': 'laudo-de-medicao-de-espessura-por-ultrassom-mapeamento-de-corrosao'
};

/**
 * Função de sincronização Firestore para os tipos da categoria
 * "Tubulações de Processo e Redes Industriais" (Vasos, Tanques e Redes de Fluidos Especializados)
 */
export async function sincronizarFirestoreTubulacoesProcesso(): Promise<{
  sucesso: boolean;
  totalAtualizados: number;
  mensagem: string;
}> {
  if (!db) {
    return {
      sucesso: false,
      totalAtualizados: 0,
      mensagem: 'Instância do Firestore não disponível no momento. Os dados estão preservados no catálogo local e taxonomia.'
    };
  }

  let gravados = 0;
  const categoriasAlvo = [
    'tubulacoes-de-processo-e-redes-industriais',
    'tubulações-de-processo-e-redes-industriais',
    'vasos-tanques-e-redes-de-fluidos-especializados'
  ];

  try {
    for (const catId of categoriasAlvo) {
      // Documento da categoria
      const catDocRef = doc(db, 'categoriasLaudo', catId);
      await setDoc(catDocRef, {
        id: catId,
        nome: 'Tubulações de Processo e Redes Industriais',
        icone: 'Database',
        atualizadoEm: new Date().toISOString()
      }, { merge: true });

      // Documentos de cada tipo
      for (const [tipoKey, dados] of Object.entries(TIPOS_TUBULACOES_PROCESSOS_FIRESTORE)) {
        // Grava no ID canônico por extenso
        const tipoDocRef = doc(db, 'categoriasLaudo', catId, 'tipos', tipoKey);
        await setDoc(tipoDocRef, dados, { merge: true });
        gravados++;

        // Grava também nos IDs curtos / aliases
        const aliases = Object.keys(ALIASES_TIPOS_TUBULACOES_PROCESSO).filter(k => ALIASES_TIPOS_TUBULACOES_PROCESSO[k] === tipoKey);
        for (const shortAlias of aliases) {
          const shortDocRef = doc(db, 'categoriasLaudo', catId, 'tipos', shortAlias);
          await setDoc(shortDocRef, {
            ...dados,
            id: shortAlias,
            aliasDe: tipoKey
          }, { merge: true });
          gravados++;
        }
      }
    }

    return {
      sucesso: true,
      totalAtualizados: gravados,
      mensagem: `Sucesso: ${gravados} documentos de tubulações de processo e redes industriais sincronizados nas coleções Firestore categoriasLaudo/tubulacoes-de-processo-e-redes-industriais/tipos/{tipo}.`
    };
  } catch (error: any) {
    console.error('Erro ao sincronizar tipos de tubulações de processo com Firestore:', error);
    return {
      sucesso: false,
      totalAtualizados: gravados,
      mensagem: `Erro na gravação Firestore: ${error?.message || String(error)}`
    };
  }
}

/**
 * Definições completas dos 3 tipos de laudo da categoria
 * "Perícias Judiciais/Avaliação de Bens" (Perícias Mecânicas Judicial e Extrajudicial)
 */
export const TIPOS_PERICIAS_AVALIACAO_BENS_FIRESTORE: Record<string, DocumentoTipoLaudoFirestore> = {
  // 1. Laudo Pericial de Análise de Falha Mecânica (Root Cause Analysis)
  'laudo-pericial-de-analise-de-falha-mecanica-root-cause-analysis': {
    id: 'laudo-pericial-de-analise-de-falha-mecanica-root-cause-analysis',
    codigo: 'PER-RCA',
    nome: 'Laudo Pericial de Análise de Falha Mecânica (Root Cause Analysis)',
    hrn: false,
    temHrn: false,
    normasRef: 'ASM Handbook Vol. 11 (Failure Analysis and Prevention), ABNT NBR ISO 9001',
    textoBaseApresentacao: 'Investigação pericial forense para determinação da causa-raiz de quebra catastrófica de eixos, engrenagens, rolamentos e motores industriais.',
    apresentacaoPadrao: 'Investigação pericial forense para determinação da causa-raiz de quebra catastrófica de eixos, engrenagens, rolamentos e motores industriais.',
    metodologiaPadrao: 'Análise fractográfica das marcas de praia (fadiga), cavidades de inclusão, sobrecarga mecânica e histórico operacional de lubrificação.',
    secoesEspecificas: [
      'Identificação do Componente Falhado (tipo, material, fabricante, função no conjunto, histórico operacional)',
      'Levantamento de Dados e Contexto do Evento (condições operacionais no momento da falha, histórico de manutenção, tempo de uso)',
      'Exame Macroscópico da Superfície de Fratura (aspecto visual, origem da fratura, direção de propagação)',
      'Exame Microscópico e Ensaios Complementares (fractografia, metalografia, dureza, composição química, quando aplicável)',
      'Análise de Mecanismo de Falha (fadiga, fratura frágil/dúctil, corrosão sob tensão, sobrecarga, desgaste, fluência)',
      'Análise de Condições de Projeto e Operação (dimensionamento, especificação de material, condições de uso vs. projeto)',
      'Determinação da Causa-Raiz (técnica de árvore de causas / Ishikawa, correlação entre evidências e mecanismo identificado)',
      'Conclusão Pericial e Recomendações (medidas corretivas e preventivas)'
    ],
    checklistInicial: [
      'Componente falhado identificado (tipo, material, fabricante/especificação)',
      'Função do componente no conjunto/sistema descrita',
      'Histórico operacional e de manutenção levantado',
      'Condições operacionais no momento do evento levantadas (carga, velocidade, temperatura)',
      'Registro fotográfico da peça fraturada realizado antes de qualquer manuseio',
      'Superfície de fratura preservada sem limpeza que comprometa a análise',
      'Ponto de origem da fratura identificado macroscopicamente',
      'Direção de propagação da trinca/fratura determinada',
      'Aspecto da superfície de fratura classificado (dúctil, frágil, fadiga — marcas de praia, etc.)',
      'Exame microscópico/fractográfico realizado, quando necessário',
      'Ensaio de dureza realizado, quando aplicável',
      'Análise de composição química realizada, quando aplicável (conformidade com material especificado)',
      'Presença de descontinuidades prévias (inclusões, porosidade, defeitos de fabricação) avaliada',
      'Mecanismo de falha identificado e fundamentado nas evidências',
      'Comparação entre condição de projeto e condição real de operação realizada',
      'Sobrecarga, uso indevido ou desvio de manutenção avaliados como fatores contribuintes',
      'Causa-raiz determinada e correlacionada com as evidências técnicas',
      'Concausas (quando existentes) identificadas e hierarquizadas',
      'Recomendações técnicas corretivas e preventivas apresentadas',
      'Registro fotográfico completo (macro e micro) anexado ao laudo'
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 2. Laudo de Incêndio/Explosão por Origem Mecânica ou Térmica
  'laudo-de-incendio-explosao-por-origem-mecanica-ou-termica': {
    id: 'laudo-de-incendio-explosao-por-origem-mecanica-ou-termica',
    codigo: 'PER-INC',
    nome: 'Laudo de Incêndio/Explosão por Origem Mecânica ou Térmica',
    hrn: false,
    temHrn: false,
    normasRef: 'NFPA 921 (Guide for Fire and Explosion Investigations), ABNT NBR 13771',
    textoBaseApresentacao: 'Perícia para identificação do ponto de ignição e causa mecânica de incêndio em máquinas, salas de máquinas ou veículos.',
    apresentacaoPadrao: 'Perícia para identificação do ponto de ignição e causa mecânica de incêndio em máquinas, salas de máquinas ou veículos.',
    metodologiaPadrao: 'Exame de atrito metal-metal, superaquecimento de mancais, vazamento de fluido inflamável sob pressão sobre superfícies quentes.',
    secoesEspecificas: [
      'Identificação do Local e Contexto do Sinistro (edificação/equipamento, data/hora, extensão do dano)',
      'Preservação e Documentação da Cena (registro fotográfico, croqui, cadeia de custódia de evidências)',
      'Determinação da Área de Origem (padrões de queima, direção de propagação, V-patterns)',
      'Determinação do Ponto de Ignição (análise de calcinação, carbonização, fusão de materiais)',
      'Identificação da Fonte de Ignição (elétrica, mecânica — atrito/superaquecimento, térmica)',
      'Identificação do Primeiro Material Ignizado e Sequência de Propagação',
      'Exclusão de Causas Alternativas (metodologia de eliminação conforme NFPA 921)',
      'Conclusão Pericial sobre a Causa e Origem do Incêndio/Explosão'
    ],
    checklistInicial: [
      'Local do sinistro identificado e delimitado',
      'Data, hora e extensão do dano registradas',
      'Cena preservada e cadeia de custódia das evidências documentada',
      'Registro fotográfico sistemático realizado (visão geral e detalhes)',
      'Croqui/planta do local com indicação de pontos relevantes elaborado',
      'Padrões de queima (V-patterns, calcinação de madeira, deformação de materiais) mapeados',
      'Direção de propagação do fogo determinada',
      'Área de origem delimitada com base nos padrões físicos',
      'Ponto de ignição especificado dentro da área de origem',
      'Materiais na área de origem identificados e examinados',
      'Fonte de ignição classificada (elétrica, mecânica por atrito/superaquecimento, térmica, outra)',
      'Evidências de falha elétrica (curto-circuito, arco) avaliadas, quando aplicável',
      'Evidências de falha mecânica (superaquecimento por atrito, rolamento, lubrificação deficiente) avaliadas, quando aplicável',
      'Primeiro material ignizado identificado',
      'Sequência de propagação reconstituída',
      'Hipóteses alternativas de causa levantadas e sistematicamente excluídas',
      'Metodologia de investigação referenciada (NFPA 921 ou equivalente)',
      'Conclusão pericial fundamentada sobre origem e causa apresentada',
      'Recomendações de prevenção registradas, quando aplicável'
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 3. Laudo de Avaliação do Estado de Conservação e Valoração de Ativos (ABNT NBR 14653-5)
  'laudo-de-avaliacao-do-estado-de-conservacao-e-valoracao-de-ativos-abnt-nbr-14653-5': {
    id: 'laudo-de-avaliacao-do-estado-de-conservacao-e-valoracao-de-ativos-abnt-nbr-14653-5',
    codigo: 'PER-VALOR',
    nome: 'Laudo de Avaliação do Estado de Conservação e Valoração de Ativos (ABNT NBR 14653-5)',
    hrn: false,
    temHrn: false,
    normasRef: 'ABNT NBR 14653-5 (Avaliação de bens - Máquinas, equipamentos, instalações e bens industriais)',
    textoBaseApresentacao: 'Avaliação patrimonial pericial com determinação do valor de mercado, valor de liquidação forçada e depreciação física de máquinas e frotas.',
    apresentacaoPadrao: 'Avaliação patrimonial pericial com determinação do valor de mercado, valor de liquidação forçada e depreciação física de máquinas e frotas.',
    metodologiaPadrao: 'Método comparativo direto de dados de mercado conjugado ao método do custo de reposição depreciado (Critério de Heidecke).',
    secoesEspecificas: [
      'Identificação do Bem Avaliando (tipo, fabricante, modelo, ano de fabricação, número de série, capacidade)',
      'Finalidade e Pressupostos da Avaliação (objetivo do laudo, data de referência, base de valor solicitada)',
      'Vistoria Técnica e Levantamento do Estado de Conservação (funcionalidade, desgaste, obsolescência)',
      'Metodologia de Avaliação Aplicada (comparativo direto de mercado, custo de reprodução/reposição, capitalização de renda)',
      'Pesquisa de Mercado e Dados Comparativos (fontes, tratamento estatístico, homogeneização)',
      'Cálculo da Depreciação Física (métodos — linear, Ross-Heidecke, etc.) e Obsolescência Funcional/Econômica',
      'Determinação do Valor de Mercado',
      'Determinação do Valor de Liquidação Forçada',
      'Grau de Fundamentação e Enquadramento na NBR 14653'
    ],
    checklistInicial: [
      'Bem avaliando identificado (tipo, fabricante, modelo, número de série)',
      'Ano de fabricação e idade cronológica determinados',
      'Capacidade/especificações técnicas registradas',
      'Finalidade da avaliação definida (judicial, garantia, seguro, compra/venda, etc.)',
      'Data de referência da avaliação estabelecida',
      'Vistoria técnica realizada com registro fotográfico',
      'Estado de conservação classificado (novo, ótimo, bom, regular, ruim)',
      'Funcionalidade operacional do bem verificada',
      'Idade aparente e vida útil remanescente estimadas',
      'Metodologia avaliatória escolhida e justificada (comparativo, custo, renda)',
      'Pesquisa de mercado realizada com número mínimo de dados conforme norma',
      'Dados de mercado homogeneizados (tratamento por fatores)',
      'Tratamento estatístico aplicado, quando pertinente',
      'Valor de reprodução/reposição a novo calculado (quando aplicável o método de custo)',
      'Depreciação física calculada (método utilizado explicitado)',
      'Obsolescência funcional e econômica avaliadas',
      'Valor de mercado do bem determinado',
      'Valor de liquidação forçada calculado (percentual sobre o valor de mercado, justificado)',
      'Grau de fundamentação da avaliação enquadrado conforme NBR 14653-1/14653-5',
      'Campo de arbítrio observado (variação admissível em relação à média)',
      'Parecer técnico conclusivo sobre o valor apresentado'
    ],
    atualizadoEm: new Date().toISOString()
  }
};

/**
 * Mapeamento de identificadores curtos e aliases para Perícias Judiciais e Avaliação de Bens
 */
export const ALIASES_TIPOS_PERICIAS_AVALIACAO_BENS: Record<string, string> = {
  // PER-RCA
  'laudo-analise-falha-rca': 'laudo-pericial-de-analise-de-falha-mecanica-root-cause-analysis',
  'laudo-pericial-analise-falha-mecanica': 'laudo-pericial-de-analise-de-falha-mecanica-root-cause-analysis',
  'analise-de-falha-mecanica': 'laudo-pericial-de-analise-de-falha-mecanica-root-cause-analysis',
  'root-cause-analysis': 'laudo-pericial-de-analise-de-falha-mecanica-root-cause-analysis',
  'analise-de-quebras': 'laudo-pericial-de-analise-de-falha-mecanica-root-cause-analysis',
  'falha-mecanica': 'laudo-pericial-de-analise-de-falha-mecanica-root-cause-analysis',
  'PER-RCA': 'laudo-pericial-de-analise-de-falha-mecanica-root-cause-analysis',

  // PER-INC
  'laudo-incendio-mecanico': 'laudo-de-incendio-explosao-por-origem-mecanica-ou-termica',
  'laudo-de-incendio-mecanico': 'laudo-de-incendio-explosao-por-origem-mecanica-ou-termica',
  'incendio-explosao-origem-mecanica-ou-termica': 'laudo-de-incendio-explosao-por-origem-mecanica-ou-termica',
  'incendio-origem-mecanica': 'laudo-de-incendio-explosao-por-origem-mecanica-ou-termica',
  'incendio-mecanico': 'laudo-de-incendio-explosao-por-origem-mecanica-ou-termica',
  'PER-INC': 'laudo-de-incendio-explosao-por-origem-mecanica-ou-termica',

  // PER-VALOR
  'laudo-valoracao-ativos': 'laudo-de-avaliacao-do-estado-de-conservacao-e-valoracao-de-ativos-abnt-nbr-14653-5',
  'laudo-de-valoracao-de-ativos': 'laudo-de-avaliacao-do-estado-de-conservacao-e-valoracao-de-ativos-abnt-nbr-14653-5',
  'avaliacao-estado-conservacao-valoracao-ativos': 'laudo-de-avaliacao-do-estado-de-conservacao-e-valoracao-de-ativos-abnt-nbr-14653-5',
  'valoracao-ativos-nbr-14653': 'laudo-de-avaliacao-do-estado-de-conservacao-e-valoracao-de-ativos-abnt-nbr-14653-5',
  'valoracao-de-ativos': 'laudo-de-avaliacao-do-estado-de-conservacao-e-valoracao-de-ativos-abnt-nbr-14653-5',
  'nbr-14653-5': 'laudo-de-avaliacao-do-estado-de-conservacao-e-valoracao-de-ativos-abnt-nbr-14653-5',
  'PER-VALOR': 'laudo-de-avaliacao-do-estado-de-conservacao-e-valoracao-de-ativos-abnt-nbr-14653-5'
};

/**
 * Função de sincronização Firestore para os tipos da categoria
 * "Perícias Judiciais/Avaliação de Bens"
 */
export async function sincronizarFirestorePericiasAvaliacaoBens(): Promise<{
  sucesso: boolean;
  totalAtualizados: number;
  mensagem: string;
}> {
  if (!db) {
    return {
      sucesso: false,
      totalAtualizados: 0,
      mensagem: 'Instância do Firestore não disponível no momento. Os dados estão preservados no catálogo local e taxonomia.'
    };
  }

  let gravados = 0;
  const categoriasAlvo = [
    'pericias-judiciais-avaliacao-de-bens',
    'pericias-judiciais-e-avaliacao-de-bens',
    'perícias-judiciais-avaliação-de-bens',
    'pericias-mecanicas-judicial-e-extrajudicial-analise-de-falhas'
  ];

  try {
    for (const catId of categoriasAlvo) {
      // Documento da categoria
      const catDocRef = doc(db, 'categoriasLaudo', catId);
      await setDoc(catDocRef, {
        id: catId,
        nome: 'Perícias Judiciais / Avaliação de Bens',
        icone: 'Search',
        atualizadoEm: new Date().toISOString()
      }, { merge: true });

      // Documentos de cada tipo
      for (const [tipoKey, dados] of Object.entries(TIPOS_PERICIAS_AVALIACAO_BENS_FIRESTORE)) {
        // Grava no ID canônico por extenso
        const tipoDocRef = doc(db, 'categoriasLaudo', catId, 'tipos', tipoKey);
        await setDoc(tipoDocRef, dados, { merge: true });
        gravados++;

        // Grava também nos IDs curtos / aliases
        const aliases = Object.keys(ALIASES_TIPOS_PERICIAS_AVALIACAO_BENS).filter(k => ALIASES_TIPOS_PERICIAS_AVALIACAO_BENS[k] === tipoKey);
        for (const shortAlias of aliases) {
          const shortDocRef = doc(db, 'categoriasLaudo', catId, 'tipos', shortAlias);
          await setDoc(shortDocRef, {
            ...dados,
            id: shortAlias,
            aliasDe: tipoKey
          }, { merge: true });
          gravados++;
        }
      }
    }

    return {
      sucesso: true,
      totalAtualizados: gravados,
      mensagem: `Sucesso: ${gravados} documentos de perícias e avaliação de bens sincronizados nas coleções Firestore categoriasLaudo/pericias-judiciais-avaliacao-de-bens/tipos/{tipo}.`
    };
  } catch (error: any) {
    console.error('Erro ao sincronizar tipos de perícias e avaliação de bens com Firestore:', error);
    return {
      sucesso: false,
      totalAtualizados: gravados,
      mensagem: `Erro na gravação Firestore: ${error?.message || String(error)}`
    };
  }
}

/**
 * Definições completas dos 4 tipos de laudo da categoria
 * "Geradores e Acessibilidade/Ruído"
 * (Subcategorias: "Automação e Utilidades" e "Mobilidade Técnica e Acústica")
 */
export const TIPOS_GERADORES_ACESSIBILIDADE_RUIDO_FIRESTORE: Record<string, DocumentoTipoLaudoFirestore> = {
  // 13.1 Automação e Utilidades - Laudo de Conformidade de Grupos Geradores
  'laudo-de-conformidade-de-grupos-geradores': {
    id: 'laudo-de-conformidade-de-grupos-geradores',
    codigo: 'TERM-GERAD',
    nome: 'Laudo de Conformidade de Grupos Geradores',
    hrn: false,
    temHrn: false,
    normasRef: 'ABNT NBR ISO 8528 (Grupos geradores de corrente alternada acionados por motor térmico), NR-10, NR-12',
    textoBaseApresentacao: 'Laudo de inspeção e comissionamento de grupos geradores a diesel/gás instalados em hospitais, condomínios e indústrias.',
    apresentacaoPadrao: 'Laudo de inspeção e comissionamento de grupos geradores a diesel/gás instalados em hospitais, condomínios e indústrias.',
    metodologiaPadrao: 'Testes de transferência automática (QTA), tempo de partida a frio, estanqueidade do tanque de combustível diário e bacia de contenção.',
    secoesEspecificas: [
      'Identificação do Grupo Gerador (fabricante, potência nominal, tipo de acionamento — diesel/gás, tensão/frequência)',
      'Verificação da Instalação Física (casa de máquinas, ventilação, base antivibratória, sistema de exaustão)',
      'Verificação do Sistema Elétrico e de Comando (quadro de transferência automática — QTA, aterramento, proteções, NR-10)',
      'Verificação do Sistema de Combustível (tanque diário, tanque de reserva, tubulações, bacia de contenção)',
      'Verificação de Dispositivos de Segurança Mecânica (proteções de partes móveis, correias, escapamento — NR-12)',
      'Teste de Comissionamento/Funcionamento (partida automática, transferência de carga, tempo de resposta, parada)',
      'Verificação Ambiental e Acústica Associada (nível de ruído, emissão de gases — quando aplicável)'
    ],
    checklistInicial: [
      'Potência nominal e de emergência identificadas na placa do equipamento',
      'Tipo de acionamento (diesel/gás) e capacidade do motor conferidos',
      'Casa de máquinas com ventilação adequada para dissipação de calor',
      'Base antivibratória e fixação do conjunto avaliadas',
      'Sistema de exaustão (escapamento) direcionado adequadamente, sem risco de intoxicação',
      'Silenciador de escape presente e íntegro',
      'Quadro de Transferência Automática (QTA) identificado e funcional',
      'Aterramento do sistema elétrico conferido',
      'Proteções elétricas (disjuntores, relés) dimensionadas e funcionais',
      'Instalações elétricas em conformidade com NR-10 (bloqueio/etiquetagem, sinalização)',
      'Tanque de combustível diário com nível e vedação adequados',
      'Tanque de reserva (quando houver) com bacia de contenção conforme norma ambiental',
      'Tubulações de combustível sem vazamentos',
      'Proteções mecânicas de partes móveis (correias, ventoinha) presentes conforme NR-12',
      'Dispositivos de parada de emergência testados',
      'Teste de partida automática (falta de energia) realizado com sucesso',
      'Tempo de transferência de carga registrado e dentro do esperado',
      'Teste de retransferência à rede normal realizado',
      'Parada do gerador (manual e automática) testada',
      'Alarmes de baixo nível de óleo/combustível e superaquecimento testados',
      'Nível de ruído do conjunto avaliado (referência para enquadramento ambiental)'
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 13.1 Automação e Utilidades - Laudo de Opacidade e Emissão de Poluentes de Motores Estacionários
  'laudo-de-opacidade-e-emissao-de-poluentes-de-motores-estacionarios': {
    id: 'laudo-de-opacidade-e-emissao-de-poluentes-de-motores-estacionarios',
    codigo: 'TERM-OPAC',
    nome: 'Laudo de Opacidade e Emissão de Poluentes de Motores Estacionários',
    hrn: false,
    temHrn: false,
    normasRef: 'Resolução CONAMA nº 382/2006, ABNT NBR 13037, NBR 12897',
    textoBaseApresentacao: 'Medição de fumaça preta (opacidade) em escapamentos de geradores e motores industriais para licenciamento ambiental CPRH.',
    apresentacaoPadrao: 'Medição de fumaça preta (opacidade) em escapamentos de geradores e motores industriais para licenciamento ambiental CPRH.',
    metodologiaPadrao: 'Ensaio com opacímetro de fluxo parcial ou escala Ringelmann sob carga constante.',
    secoesEspecificas: [
      'Identificação da Fonte Emissora (motor/gerador, potência, combustível utilizado, finalidade de uso)',
      'Condições de Ensaio (regime de carga do motor no momento da medição, condições ambientais)',
      'Metodologia de Medição de Opacidade (escala de Ringelmann ou opacímetro, conforme norma aplicável)',
      'Execução da Medição (pontos de amostragem, número de leituras, tempo de aceleração livre)',
      'Resultado e Comparação com Limites Legais (CONAMA 382/2006 e legislação estadual/CPRH aplicável)',
      'Conclusão sobre Conformidade e Recomendações (ajustes de motor, manutenção do sistema de escape)'
    ],
    checklistInicial: [
      'Fonte emissora identificada (motor, potência, combustível)',
      'Finalidade de uso do motor/gerador registrada (emergência, geração contínua, etc.)',
      'Enquadramento na Resolução CONAMA 382/2006 (categoria da fonte) definido',
      'Condições ambientais no momento do ensaio registradas',
      'Regime de carga do motor durante a medição registrado',
      'Equipamento de medição (opacímetro) calibrado e com certificado válido',
      'Ponto de amostragem no escapamento definido corretamente',
      'Número mínimo de leituras/acelerações realizado conforme metodologia',
      'Resultado de opacidade expresso na unidade aplicável (% ou escala Ringelmann) ',
      'Limite legal aplicável identificado (conforme fonte/potência)',
      'Resultado comparado ao limite legal com conclusão de conformidade/não conformidade',
      'Condição de manutenção do motor (filtros, injeção) observada como fator de influência',
      'Recomendações técnicas em caso de não conformidade registradas',
      'Data e validade do laudo para fins de licenciamento ambiental (CPRH) definidas'
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 13.2 Mobilidade Técnica e Acústica - Laudo de Inspeção Técnica de Elevadores Sociais, Plataformas Acessíveis e Escadas Mecânicas
  'laudo-de-inspecao-tecnica-de-elevadores-sociais-plataformas-acessiveis-e-escadas-mecanicas': {
    id: 'laudo-de-inspecao-tecnica-de-elevadores-sociais-plataformas-acessiveis-e-escadas-mecanicas',
    codigo: 'ACES-ELEV',
    nome: 'Laudo de Inspeção Técnica de Elevadores Sociais, Plataformas Acessíveis e Escadas Mecânicas',
    hrn: false,
    temHrn: false,
    normasRef: 'ABNT NBR NM 207, NBR NM 313 (Acessibilidade em elevadores), NBR 9050, Lei Brasileira de Inclusão',
    textoBaseApresentacao: 'Inspeção mecânica e atestado anual de segurança e acessibilidade para elevadores sociais, plataformas de translação vertical e esteiras rolantes.',
    apresentacaoPadrao: 'Inspeção mecânica e atestado anual de segurança e acessibilidade para elevadores sociais, plataformas de translação vertical e esteiras rolantes.',
    metodologiaPadrao: 'Verificação de limites de nivelamento de piso, botão de emergência com intercomunicador funcional, sintetizador de voz e freio de segurança.',
    secoesEspecificas: [
      'Identificação do Equipamento (tipo — elevador social/plataforma/escada rolante, fabricante, capacidade, ano de instalação)',
      'Verificação de Requisitos de Acessibilidade (dimensões de cabina, sinalização tátil/sonora, botoeiras em Braille, conforme NBR 9050/NBR NM 313)',
      'Verificação Mecânica do Sistema de Tração/Movimentação (cabos, motor, redutor, freios)',
      'Verificação de Dispositivos de Segurança (paraquedas, limitador de velocidade, sensores de porta, parada de emergência)',
      'Verificação da Casa de Máquinas e Poço (quando aplicável)',
      'Verificação de Plataformas de Translação Vertical/Inclinada (guias, sistema de segurança contra esmagamento)',
      'Emissão do Atestado Anual de Inspeção e Prazo de Validade'
    ],
    checklistInicial: [
      'Tipo de equipamento identificado (elevador social, plataforma acessível, escada/esteira rolante)',
      'Capacidade nominal e ano de instalação conferidos',
      'Dimensões internas da cabina/plataforma conforme NBR 9050',
      'Sinalização tátil e visual (Braille, alto-relevo) presente nas botoeiras',
      'Sinalização sonora de chegada de pavimento funcional',
      'Corrimãos e barras de apoio conforme norma de acessibilidade',
      'Cabos de tração sem desgaste ou fios rompidos',
      'Motor e redutor sem ruído ou vibração anormal',
      'Freio de segurança testado',
      'Dispositivo paraquedas testado (quando aplicável)',
      'Limitador de velocidade testado',
      'Sensores de porta (fotocélula/borda de segurança) funcionais',
      'Botão de parada de emergência testado',
      'Intertravamento de portas de pavimento e cabina funcional',
      'Casa de máquinas com acesso seguro e sinalização adequada (quando aplicável)',
      'Poço com iluminação e para-choques íntegros (quando aplicável)',
      'Guias de deslizamento de plataformas sem desgaste excessivo',
      'Sistema de proteção contra esmagamento/aprisionamento em plataformas testado',
      'Velocidade de deslocamento conforme especificação de projeto',
      'Atestado anual de inspeção emitido com data de validade definida'
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 13.2 Mobilidade Técnica e Acústica - Laudo de Ruído Ambiental e Vibração Industrial
  'laudo-de-ruido-ambiental-e-vibracao-industrial': {
    id: 'laudo-de-ruido-ambiental-e-vibracao-industrial',
    codigo: 'ACES-RUIDO',
    nome: 'Laudo de Ruído Ambiental e Vibração Industrial',
    hrn: false,
    temHrn: false,
    normasRef: 'ABNT NBR 10151 (Avaliação do ruído em áreas habitadas), NBR 10152, NR-15',
    textoBaseApresentacao: 'Medição sonométrica e emissão de laudo pericial para atendimento a notificações ambientais, queixas de vizinhança ou conforto acústico corporativo.',
    apresentacaoPadrao: 'Medição sonométrica e emissão de laudo pericial para atendimento a notificações ambientais, queixas de vizinhança ou conforto acústico corporativo.',
    metodologiaPadrao: 'Aferição com sonômetro (decibelímetro) integrador Tipo 1 com calibrador acústico acoplado, medição dos níveis LAeq diurno e noturno.',
    secoesEspecificas: [
      'Identificação do Local e Objeto da Medição (fonte de ruído, área receptora, uso do solo/zoneamento)',
      'Condições de Ensaio (horário — diurno/noturno, condições climáticas, ruído de fundo)',
      'Metodologia de Medição Sonométrica (equipamento, calibração, pontos de medição, altura do microfone)',
      'Execução das Medições (nível de pressão sonora equivalente — Leq, nível de critério de avaliação — NCA)',
      'Medição de Vibração Industrial (quando aplicável — pontos, eixos de medição, norma de referência)',
      'Comparação com Limites Normativos (NBR 10151, NBR 10152, NR-15 — conforme finalidade)',
      'Conclusão sobre Conformidade e Recomendações de Mitigação'
    ],
    checklistInicial: [
      'Fonte de ruído identificada e caracterizada',
      'Área receptora e uso do solo/zoneamento classificados',
      'Finalidade da avaliação definida (queixa de vizinhança, licenciamento, conforto corporativo, insalubridade)',
      'Horário da medição registrado (período diurno/noturno conforme norma)',
      'Condições climáticas no momento da medição registradas (vento, chuva)',
      'Equipamento (decibelímetro/dosímetro) calibrado e com certificado válido',
      'Calibração de campo realizada antes e após as medições',
      'Pontos de medição definidos e mapeados (interno/externo, limite de propriedade)',
      'Altura e distância do microfone conforme norma aplicável',
      'Ruído de fundo (background) medido separadamente',
      'Nível de pressão sonora equivalente (Leq) determinado para cada ponto',
      'Nível de Critério de Avaliação (NCA) calculado conforme NBR 10151',
      'Correções aplicadas (tonal, impulsivo), quando identificadas',
      'Medição de vibração realizada nos eixos aplicáveis, quando pertinente',
      'Resultados comparados aos limites da NBR 10151/10152 ou NR-15 (conforme finalidade)',
      'Conclusão de conformidade ou não conformidade apresentada',
      'Recomendações de mitigação (barreiras acústicas, enclausuramento, horário de operação) registradas, quando aplicável'
    ],
    atualizadoEm: new Date().toISOString()
  }
};

/**
 * Mapeamento de identificadores curtos e aliases para Geradores e Acessibilidade/Ruído
 */
export const ALIASES_TIPOS_GERADORES_ACESSIBILIDADE_RUIDO: Record<string, string> = {
  // TERM-GERAD
  'laudo-geradores-conformidade': 'laudo-de-conformidade-de-grupos-geradores',
  'conformidade-grupos-geradores': 'laudo-de-conformidade-de-grupos-geradores',
  'grupos-geradores': 'laudo-de-conformidade-de-grupos-geradores',
  'geradores-conformidade': 'laudo-de-conformidade-de-grupos-geradores',
  'geradores': 'laudo-de-conformidade-de-grupos-geradores',
  'TERM-GERAD': 'laudo-de-conformidade-de-grupos-geradores',

  // TERM-OPAC
  'laudo-opacidade-motores': 'laudo-de-opacidade-e-emissao-de-poluentes-de-motores-estacionarios',
  'opacidade-emissao-poluentes-motores': 'laudo-de-opacidade-e-emissao-de-poluentes-de-motores-estacionarios',
  'opacidade-motores': 'laudo-de-opacidade-e-emissao-de-poluentes-de-motores-estacionarios',
  'poluentes-motores-estacionarios': 'laudo-de-opacidade-e-emissao-de-poluentes-de-motores-estacionarios',
  'opacidade-geradores': 'laudo-de-opacidade-e-emissao-de-poluentes-de-motores-estacionarios',
  'TERM-OPAC': 'laudo-de-opacidade-e-emissao-de-poluentes-de-motores-estacionarios',

  // ACES-ELEV
  'laudo-elevadores-acessibilidade': 'laudo-de-inspecao-tecnica-de-elevadores-sociais-plataformas-acessiveis-e-escadas-mecanicas',
  'inspecao-elevadores-sociais-plataformas-escadas': 'laudo-de-inspecao-tecnica-de-elevadores-sociais-plataformas-acessiveis-e-escadas-mecanicas',
  'elevadores-sociais-plataformas-acessiveis': 'laudo-de-inspecao-tecnica-de-elevadores-sociais-plataformas-acessiveis-e-escadas-mecanicas',
  'elevadores-acessibilidade': 'laudo-de-inspecao-tecnica-de-elevadores-sociais-plataformas-acessiveis-e-escadas-mecanicas',
  'elevadores-plataformas-escadas': 'laudo-de-inspecao-tecnica-de-elevadores-sociais-plataformas-acessiveis-e-escadas-mecanicas',
  'ACES-ELEV': 'laudo-de-inspecao-tecnica-de-elevadores-sociais-plataformas-acessiveis-e-escadas-mecanicas',

  // ACES-RUIDO
  'laudo-ruido-vibracao': 'laudo-de-ruido-ambiental-e-vibracao-industrial',
  'ruido-ambiental-e-vibracao-industrial': 'laudo-de-ruido-ambiental-e-vibracao-industrial',
  'ruido-ambiental': 'laudo-de-ruido-ambiental-e-vibracao-industrial',
  'ruido-vibracao': 'laudo-de-ruido-ambiental-e-vibracao-industrial',
  'ruido-nbr-10151': 'laudo-de-ruido-ambiental-e-vibracao-industrial',
  'ACES-RUIDO': 'laudo-de-ruido-ambiental-e-vibracao-industrial'
};

/**
 * Função de sincronização Firestore para os tipos da categoria
 * "Geradores e Acessibilidade/Ruído"
 */
export async function sincronizarFirestoreGeradoresAcessibilidadeRuido(): Promise<{
  sucesso: boolean;
  totalAtualizados: number;
  mensagem: string;
}> {
  if (!db) {
    return {
      sucesso: false,
      totalAtualizados: 0,
      mensagem: 'Instância do Firestore não disponível no momento. Os dados estão preservados no catálogo local e taxonomia.'
    };
  }

  let gravados = 0;
  // Inclui o path explícito do entregável "geradores-e-acessibilidade-ruido"
  // e as categorias canônicas correspondentes
  const categoriasAlvo = [
    'geradores-e-acessibilidade-ruido',
    'geradores-e-acessibilidade-ruído',
    'grupos-geradores-e-maquinas-termicas',
    'acessibilidade-e-engenharia-legal-aplicada',
    'geradores-e-maquinas-termicas',
    'acessibilidade-e-ruido'
  ];

  try {
    for (const catId of categoriasAlvo) {
      // Documento da categoria
      const catDocRef = doc(db, 'categoriasLaudo', catId);
      await setDoc(catDocRef, {
        id: catId,
        nome: catId.includes('gerador') ? 'Geradores e Máquinas Térmicas' : 'Acessibilidade e Ruído Industrial',
        icone: catId.includes('gerador') ? 'Zap' : 'CheckCircle2',
        atualizadoEm: new Date().toISOString()
      }, { merge: true });

      // Documentos de cada tipo
      for (const [tipoKey, dados] of Object.entries(TIPOS_GERADORES_ACESSIBILIDADE_RUIDO_FIRESTORE)) {
        // Grava no ID canônico por extenso
        const tipoDocRef = doc(db, 'categoriasLaudo', catId, 'tipos', tipoKey);
        await setDoc(tipoDocRef, dados, { merge: true });
        gravados++;

        // Grava também nos IDs curtos / aliases
        const aliases = Object.keys(ALIASES_TIPOS_GERADORES_ACESSIBILIDADE_RUIDO).filter(k => ALIASES_TIPOS_GERADORES_ACESSIBILIDADE_RUIDO[k] === tipoKey);
        for (const shortAlias of aliases) {
          const shortDocRef = doc(db, 'categoriasLaudo', catId, 'tipos', shortAlias);
          await setDoc(shortDocRef, {
            ...dados,
            id: shortAlias,
            aliasDe: tipoKey
          }, { merge: true });
          gravados++;
        }
      }
    }

    return {
      sucesso: true,
      totalAtualizados: gravados,
      mensagem: `Sucesso: ${gravados} documentos de geradores, acessibilidade e ruído sincronizados nas coleções Firestore categoriasLaudo/geradores-e-acessibilidade-ruido/tipos/{tipo}.`
    };
  } catch (error: any) {
    console.error('Erro ao sincronizar tipos de geradores e acessibilidade/ruído com Firestore:', error);
    return {
      sucesso: false,
      totalAtualizados: gravados,
      mensagem: `Erro na gravação Firestore: ${error?.message || String(error)}`
    };
  }
}

/**
 * =====================================================================
 * CATEGORIA 5: Climatização, Qualidade do Ar e Manutenção Predial/Industrial
 * Tipos de Laudo no Firestore (Coleções / Documentos)
 * =====================================================================
 */
export const TIPOS_CLIMATIZACAO_FIRESTORE: Record<string, DocumentoTipoLaudoFirestore> = {
  // 1. Laudo e Plano de PMOC (Lei 13.589/2018)
  'laudo-e-plano-de-pmoc-lei-13589-2018': {
    id: 'laudo-e-plano-de-pmoc-lei-13589-2018',
    codigo: 'PMOC-LEI',
    nome: 'Laudo e Plano de PMOC (Lei 13.589/2018)',
    hrn: false,
    temHrn: false,
    normasRef: 'Lei Federal 13.589/2018, Portaria MS nº 3.523/1998, RE 09/2003 ANVISA, ABNT NBR 16401',
    textoBaseApresentacao: 'Plano de Manutenção, Operação e Controle (PMOC) e respectivo Laudo Técnico com ART para sistemas de climatização com capacidade térmica superior a 60.000 BTU/h (5 TR).',
    apresentacaoPadrao: 'Plano de Manutenção, Operação e Controle (PMOC) e respectivo Laudo Técnico com ART para sistemas de climatização com capacidade térmica superior a 60.000 BTU/h (5 TR).',
    metodologiaPadrao: 'Inventário térmico dos aparelhos (Split, VRF, Chiller, Fancoil), definição do cronograma de rotinas de higienização de filtros, bandejas e verificação de renovação de ar externo.',
    secoesEspecificas: [
      'Identificação do Edifício e Dados Cadastrais do Empreendimento Climatizado',
      'Inventário de Equipamentos de Climatização e Capacidade Térmica Acumulada',
      'Inspeção Sanitária e Física de Evaporadores, Fancoils e Filtros de Ar',
      'Avaliação da Tomada de Ar Externo e Taxa de Renovação Forçada (NBR 16401-3)',
      'Avaliação de Unidades Condensadoras e Linhas Frigorígenas',
      'Cronograma Físico de Rotinas Periódicas de Manutenção Preventiva (Mensal, Trimestral, Semestral)',
      'Responsabilidade Técnica e Conclusão Sanitária'
    ],
    checklistInicial: [
      { campo: "Área útil climatizada total e tipo de atividade do edifício", tipoResposta: "VALOR", unidade: "m²", criterioReferencia: "Lei 13.589/2018 Art. 1º" },
      { campo: "Capacidade térmica instalada acumulada do sistema", tipoResposta: "VALOR", unidade: "BTU/h ou TR", criterioReferencia: "Obrigatoriedade de PMOC se > 60.000 BTU/h (5 TR)" },
      { campo: "Tipologia dos sistemas condicionadores de ar instalados", tipoResposta: "SELECAO", opcoes: ["Expansão Direta - Split / Cassete", "Sistema VRF / VRV", "Expansão Indireta - Chillers / Fancoils", "Roof-top / Centrais"], criterioReferencia: "Inventário técnico do sistema de climatização" },
      { campo: "Anotação de Responsabilidade Técnica (ART) do Engenheiro Mecânico registrada no CREA", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Resolução CONFEA nº 218/1973 e Lei 13.589/2018" },
      { campo: "Plano de Manutenção, Operação e Controle (PMOC) disponível in loco para fiscalização sanitária", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Portaria MS nº 3.523/1998 Art. 6º" },
      { campo: "Higienização mecânica e química das serpentinas e aletas dos evaporadores (sem biofilme)", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Portaria MS 3.523/1998 e RE 09/2003 ANVISA" },
      { campo: "Filtros de Ar — Limpeza, integridade e classe de filtragem adequada (G4 / M5)", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ABNT NBR 16401-3 (Troca/lavagem periódica)" },
      { campo: "Bandejas de condensado — Ausência de água estagnada, limo, lodo e corrosão", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Prevenção microbiológica e Legionella" },
      { campo: "Rede de Drenagem — Caimento correto, desobstrução e ausência de vazamentos/refluxo", tipoResposta: "C_NC_NA", criterioReferencia: "Dreno contínuo com sifão nas descargas" },
      { campo: "Turbinas, rotores e ventiladores dos evaporadores limpos e balanceados", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Operação silenciosa e sem acúmulo de fuligem" },
      { campo: "Tomada de Ar Externo (TAE) para renovação forçada de ar instalada e operante", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Obrigatória pela Lei 13.589/2018 e Portaria MS 3.523" },
      { campo: "Filtros da Tomada de Renovação de Ar limpos e íntegros", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Filtragem mínima classe G4 na captação" },
      { campo: "Vazão de Renovação de Ar Externo conforme taxa mínima da ABNT NBR 16401-3", tipoResposta: "VALOR", unidade: "m³/h/pessoa", criterioReferencia: "Mínimo 27 m³/h/pessoa (ou 7,5 l/s/pessoa) conforme ocupação" },
      { campo: "Afastamento da captação de ar externo em relação a fontes poluentes (chaminés, lixeiras)", tipoResposta: "C_NC_NA", criterioReferencia: "Distância regulamentar conforme NBR 16401" },
      { campo: "Serpentinas condensadoras limpas e desobstruídas para troca térmica eficiente", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Rendimento térmico e consumo energético" },
      { campo: "Isolamento térmico das linhas frigorígenas (ausência de condensação ou ressecamento)", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Tubos de cobre isolados com elastomérico íntegro" },
      { campo: "Pressões operacionais de sucção e descarga / Superaquecimento e sub-resfriamento", tipoResposta: "VALOR", unidade: "psig", criterioReferencia: "Parâmetros dentro das faixas do refrigerante utilizado" },
      { campo: "Ausência de vazamentos de fluido frigorígeno halogenado (teste de estanqueidade)", tipoResposta: "C_NC_NA", criterioReferencia: "Protocolo de Montreal e normas ambientais" },
      { campo: "Fixação das condensadoras, coxins antivibratórios e ausência de ruído anormal", tipoResposta: "C_NC_NA", criterioReferencia: "Suportação resistente e amortecimento de vibração" },
      { campo: "Registro sistemático das rotinas periódicas de manutenção no cronograma do PMOC", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Fichas de execução com data e assinatura técnica" },
      { campo: "Produtos químicos sanitizantes utilizados devidamente registrados e homologados na ANVISA", tipoResposta: "C_NC_NA", criterioReferencia: "Biodegradáveis com registro sanitário para HVAC" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 2. Laudo de Inspeção Técnico-Sanitária e Qualidade do Ar
  'laudo-de-inspecao-tecnico-sanitaria-e-qualidade-do-ar': {
    id: 'laudo-de-inspecao-tecnico-sanitaria-e-qualidade-do-ar',
    codigo: 'PMOC-AR',
    nome: 'Laudo de Inspeção Técnico-Sanitária e Qualidade do Ar',
    hrn: false,
    temHrn: false,
    normasRef: 'Resolução ANVISA RE nº 09/2003, ABNT NBR 16401',
    textoBaseApresentacao: 'Avaliação dos parâmetros físicos, químicos e biológicos do ar climatizado em ambientes de uso público e coletivo.',
    apresentacaoPadrao: 'Avaliação dos parâmetros físicos, químicos e biológicos do ar climatizado em ambientes de uso público e coletivo.',
    metodologiaPadrao: 'Aferição de temperatura de bulbo seco, umidade relativa, velocidade do ar, concentração de dióxido de carbono (CO₂) e coleta microbiológica por laboratório credenciado.',
    secoesEspecificas: [
      'Identificação dos Ambientes Amostrados e Pontos de Coleta',
      'Aferição dos Parâmetros Físicos de Conforto Térmico (Temperatura, Umidade e Velocidade do Ar)',
      'Concentração de Dióxido de Carbono (CO₂) e Taxa de Renovação de Ar',
      'Concentração de Monóxido de Carbono (CO) e Particulado Inalável em Suspensão',
      'Ensaio Microbiológico — Relação I/E de Fungos e Espécies Patogênicas',
      'Parecer Técnico-Sanitário e Certificado de Conformidade da Qualidade do Ar'
    ],
    checklistInicial: [
      { campo: "Temperatura operativa do ar em recintos climatizados (faixa recomendada)", tipoResposta: "VALOR", unidade: "°C", criterioReferencia: "RE 09/2003 ANVISA (23°C a 26°C no verão / 20°C a 22°C no inverno)" },
      { campo: "Umidade relativa do ar (UR%) em recintos fechados", tipoResposta: "VALOR", unidade: "%", criterioReferencia: "RE 09/2003 ANVISA (40% a 65% UR)" },
      { campo: "Velocidade do ar na zona de permanência humana (limite máximo de conforto)", tipoResposta: "VALOR", unidade: "m/s", criterioReferencia: "RE 09/2003 ANVISA (≤ 0,25 m/s)" },
      { campo: "Concentração de Dióxido de Carbono (CO₂) em recintos ocupados", tipoResposta: "VALOR", unidade: "ppm", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "RE 09/2003 ANVISA (máximo recomendável 1.000 ppm)" },
      { campo: "Concentração de Monóxido de Carbono (CO) no ar interior", tipoResposta: "VALOR", unidade: "ppm", criterioReferencia: "RE 09/2003 ANVISA (máximo 9 ppm)" },
      { campo: "Concentração de Poeira Total / Material Particulado inalável em suspensão", tipoResposta: "VALOR", unidade: "µg/m³", criterioReferencia: "RE 09/2003 ANVISA (máximo 80 µg/m³)" },
      { campo: "Razão de Fungos no Ar Interno versus Ar Externo (relação I/E)", tipoResposta: "VALOR", unidade: "razão I/E", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "RE 09/2003 ANVISA (relação I/E ≤ 1,5)" },
      { campo: "Ausência de fungos patogênicos e toxigênicos (Stachybotrys, Aspergillus flavus, etc.)", tipoResposta: "C_NC_NA", criterioReferencia: "Ausência comprovada em análise laboratorial" },
      { campo: "Laudo analítico microbiológico emitido por laboratório habilitado anexado ao dossiê", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Laboratório de controle ambiental credenciado" },
      { campo: "Ambientes climatizados em conformidade com os padrões referenciais de vigilância sanitária", tipoResposta: "C_NC_NA", criterioReferencia: "Vigilância Sanitária Municipal/Estadual" },
      { campo: "Parecer técnico sanitário atestando salubridade das instalações de ar condicionado", tipoResposta: "C_NC_NA", criterioReferencia: "Responsabilidade técnica do laudo" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 3. Laudo com ART de Manutenção e Liberação
  'laudo-com-art-de-manutencao-e-liberacao': {
    id: 'laudo-com-art-de-manutencao-e-liberacao',
    codigo: 'MANUT-ART',
    nome: 'Laudo com ART de Manutenção e Liberação',
    hrn: false,
    temHrn: false,
    normasRef: 'Resoluções CONFEA/CREA, ABNT NBR 5674',
    textoBaseApresentacao: 'Emissão de Laudo de Responsabilidade Técnica de Engenharia Mecânica para acompanhamento, liberação de reformas e serviços de manutenção predial e industrial.',
    apresentacaoPadrao: 'Emissão de Laudo de Responsabilidade Técnica de Engenharia Mecânica para acompanhamento, liberação de reformas e serviços de manutenção predial e industrial.',
    metodologiaPadrao: 'Auditoria de procedimentos operacionais padrão (POP), verificação de ARTs de terceiros e liberação formal de equipamentos sob guarda.',
    secoesEspecificas: [
      'Identificação do Ativo e Descrição dos Serviços de Manutenção Executados',
      'Anotação de Responsabilidade Técnica (ART) do Engenheiro Mecânico',
      'Verificação de Requisitos Técnicos, POP e Qualificação da Equipe Executante',
      'Ensaios Pós-Manutenção, Testes de Desempenho e Comissionamento',
      'Condições Ambientais, Recolhimento de Resíduos e Descarte Ecológico',
      'Parecer Técnico de Liberação Operacional e Termo de Entrega'
    ],
    checklistInicial: [
      { campo: "Descrição minuciosa dos serviços mecânicos, prediais ou industriais executados", tipoResposta: "VALOR", criterioReferencia: "Memorial descritivo da intervenção / NBR 5674" },
      { campo: "Localização, identificação e tag do ativo/equipamento inspecionado", tipoResposta: "VALOR", criterioReferencia: "Cadastro patrimonial ou CMMS" },
      { campo: "Anotação de Responsabilidade Técnica (ART) de Engenharia Mecânica registrada no CREA", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Lei Federal nº 6.496/1977" },
      { campo: "Equipe executante com qualificação técnica comprovada (certificados, NR-10, NR-12, NR-35)", tipoResposta: "C_NC_NA", criterioReferencia: "Normas Regulamentadoras MTE aplicáveis" },
      { campo: "Procedimentos de Trabalho Seguro (APR - Análise Preliminar de Risco e PT - Permissão de Trabalho)", tipoResposta: "C_NC_NA", criterioReferencia: "Procedimento Operacional Padrão (POP) e PGR" },
      { campo: "Utilização integral de EPIs e EPCs adequados ao serviço durante toda a intervenção", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "NR-06 (Equipamentos de Proteção Individual)" },
      { campo: "Testes funcionais e operacionais pós-manutenção realizados com sucesso sob carga", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Comissionamento técnico do ativo" },
      { campo: "Testes de estanqueidade, calibração ou ensaios não destrutivos realizados (se aplicável)", tipoResposta: "C_NC_NA", criterioReferencia: "Normas de fabricação do equipamento" },
      { campo: "Níveis de ruído, vibração mecânica e alinhamento dentro dos parâmetros aceitáveis", tipoResposta: "C_NC_NA", criterioReferencia: "ISO 10816 e NBR 10151" },
      { campo: "Limpeza da área, recolhimento de sucatas e descarte ambientalmente adequado de óleos/peças", tipoResposta: "C_NC_NA", criterioReferencia: "Normas ambientais de destinação de resíduos" },
      { campo: "Ativo tecnicamente apto e seguro para retorno à operação produtiva", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Parecer conclusivo do Engenheiro Mecânico" },
      { campo: "Termo formal de entrega técnica com garantias e recomendações assinado pelas partes", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Termo de encerramento do serviço" }
    ],
    atualizadoEm: new Date().toISOString()
  },

  // 4. Laudo de Diagnóstico de Maturidade em Gestão de Ativos (PCM/ISO 55001)
  'laudo-de-diagnostico-de-maturidade-em-gestao-de-ativos-pcm-iso-55001': {
    id: 'laudo-de-diagnostico-de-maturidade-em-gestao-de-ativos-pcm-iso-55001',
    codigo: 'MANUT-PCM',
    nome: 'Laudo de Diagnóstico de Maturidade em Gestão de Ativos (PCM/ISO 55001)',
    hrn: false,
    temHrn: false,
    permitePreenchimentoIA: false,
    normasRef: 'ABNT NBR ISO 55001, Métricas de Confiabilidade (MTBF, MTTR)',
    textoBaseApresentacao: 'Consultoria diagnóstica de planejamento e controle de manutenção (PCM) para plantas industriais e edifícios corporativos.',
    apresentacaoPadrao: 'Consultoria diagnóstica de planejamento e controle de manutenção (PCM) para plantas industriais e edifícios corporativos.',
    metodologiaPadrao: 'Análise de criticidade de ativos (Matriz GUT), cálculo de indicadores de disponibilidade, backlog e custos operacionais (Opex).',
    secoesEspecificas: [
      'Contextualização da Planta e Estrutura Organizacional de Manutenção',
      'Inventário Hierárquico de Ativos e Metodologia de Criticidade (GUT/RCM)',
      'Avaliação dos Indicadores Chave de Desempenho (MTBF, MTTR, Disponibilidade, Aderência)',
      'Diagnóstico do Planejamento, Programação e Backlog da Manutenção',
      'Gestão de Almoxarifado Técnico, Sobressalentes Críticos e Curva ABC',
      'Enquadramento do Nível de Maturidade Global em Gestão de Ativos (ISO 55001)',
      'Roadmap Estratégico e Plano de Ação para Evolução do PCM'
    ],
    checklistInicial: [
      { campo: "Árvore hierárquica e cadastramento de ativos no software de gestão (CMMS/ERP)", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "ISO 55001 Requisito 6.2 (Cadastro de Ativos)" },
      { campo: "Matriz de Criticidade de Ativos (Método GUT ou RCM - Confiabilidade Centrada na Manutenção)", tipoResposta: "SELECAO", opcoes: ["Inexistente", "Em Implantação", "Implantada Parcialmente", "Implantada com Revisão Sistemática"], obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Classificação A/B/C ou pontuação GUT" },
      { campo: "Planos preventivos padronizados e cronogramas de lubrificação/inspeção cadastrados", tipoResposta: "C_NC_NA", criterioReferencia: "Procedimentos operacionais por família de ativo" },
      { campo: "Tempo Médio Entre Falhas - MTBF calculado e monitorado para ativos críticos", tipoResposta: "VALOR", unidade: "horas", criterioReferencia: "Indicador de confiabilidade (NBR 5462)" },
      { campo: "Tempo Médio Para Reparo - MTTR calculado e acompanhado", tipoResposta: "VALOR", unidade: "horas", criterioReferencia: "Indicador de manutenibilidade (NBR 5462)" },
      { campo: "Disponibilidade operacional média apurada dos ativos produtivos críticos", tipoResposta: "VALOR", unidade: "%", criterioReferencia: "Fórmula: MTBF / (MTBF + MTTR) × 100%" },
      { campo: "Aderência ao Cronograma de Manutenção Preventiva (meta ≥ 85%)", tipoResposta: "VALOR", unidade: "%", criterioReferencia: "Cumprimento das Ordens de Serviço Preventivas" },
      { campo: "Backlog de Manutenção da Equipe (semanas de trabalho acumuladas)", tipoResposta: "VALOR", unidade: "semanas", criterioReferencia: "Faixa ideal: 2 a 4 semanas de carga de trabalho" },
      { campo: "Almoxarifado técnico com controle de estoque e peças classificadas por Curva ABC", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Gestão de sobressalentes críticos" },
      { campo: "Acuracidade de inventário físico do almoxarifado de peças de reposição", tipoResposta: "VALOR", unidade: "%", criterioReferencia: "Conformidade física vs sistema (meta ≥ 95%)" },
      { campo: "Nível Global de Maturidade do PCM e Gestão de Ativos (ABNT NBR ISO 55001)", tipoResposta: "SELECAO", opcoes: ["Nível 1 - Reativo / Apaga-Fogo", "Nível 2 - Preventivo Básico", "Nível 3 - Preditivo / Sistemático", "Nível 4 - Confiabilidade Integrada / RCM", "Nível 5 - Excelência Operacional / ISO 55001"], criterioReferencia: "Matriz de maturidade em gestão de ativos" },
      { campo: "Plano Estratégico com Roadmap de Evolução e Metas de Curto/Médio Prazo formalizado", tipoResposta: "C_NC_NA", obrigatorioFoto: true, exigeFotoSeNaoConforme: true, criterioReferencia: "Melhoria contínua e governança de manutenção" }
    ],
    atualizadoEm: new Date().toISOString()
  }
};

export const ALIASES_TIPOS_CLIMATIZACAO: Record<string, string> = {
  // PMOC-LEI
  'laudo-pmoc-completo': 'laudo-e-plano-de-pmoc-lei-13589-2018',
  'pmoc-completo': 'laudo-e-plano-de-pmoc-lei-13589-2018',
  'laudo-pmoc': 'laudo-e-plano-de-pmoc-lei-13589-2018',
  'pmoc': 'laudo-e-plano-de-pmoc-lei-13589-2018',
  'plano-pmoc': 'laudo-e-plano-de-pmoc-lei-13589-2018',
  'PMOC-LEI': 'laudo-e-plano-de-pmoc-lei-13589-2018',

  // PMOC-AR
  'laudo-qualidade-ar': 'laudo-de-inspecao-tecnico-sanitaria-e-qualidade-do-ar',
  'qualidade-do-ar': 'laudo-de-inspecao-tecnico-sanitaria-e-qualidade-do-ar',
  'qualidade-ar': 'laudo-de-inspecao-tecnico-sanitaria-e-qualidade-do-ar',
  'inspecao-qualidade-ar': 'laudo-de-inspecao-tecnico-sanitaria-e-qualidade-do-ar',
  'PMOC-AR': 'laudo-de-inspecao-tecnico-sanitaria-e-qualidade-do-ar',

  // MANUT-ART
  'laudo-art-manutencao': 'laudo-com-art-de-manutencao-e-liberacao',
  'art-manutencao': 'laudo-com-art-de-manutencao-e-liberacao',
  'manutencao-liberacao': 'laudo-com-art-de-manutencao-e-liberacao',
  'art-liberacao': 'laudo-com-art-de-manutencao-e-liberacao',
  'MANUT-ART': 'laudo-com-art-de-manutencao-e-liberacao',

  // MANUT-PCM
  'laudo-maturidade-pcm': 'laudo-de-diagnostico-de-maturidade-em-gestao-de-ativos-pcm-iso-55001',
  'maturidade-pcm': 'laudo-de-diagnostico-de-maturidade-em-gestao-de-ativos-pcm-iso-55001',
  'gestao-ativos-pcm': 'laudo-de-diagnostico-de-maturidade-em-gestao-de-ativos-pcm-iso-55001',
  'pcm-iso-55001': 'laudo-de-diagnostico-de-maturidade-em-gestao-de-ativos-pcm-iso-55001',
  'MANUT-PCM': 'laudo-de-diagnostico-de-maturidade-em-gestao-de-ativos-pcm-iso-55001'
};

/**
 * Função de sincronização Firestore para os tipos da categoria 5:
 * "Climatização, Qualidade do Ar e Manutenção Predial/Industrial"
 */
export async function sincronizarFirestoreClimatizacao(): Promise<{
  sucesso: boolean;
  totalAtualizados: number;
  mensagem: string;
}> {
  if (!db) {
    return {
      sucesso: false,
      totalAtualizados: 0,
      mensagem: 'Instância do Firestore não disponível no momento. Os dados estão preservados no catálogo local e taxonomia.'
    };
  }

  let gravados = 0;
  const categoriasAlvo = [
    'climatizacao-qualidade-do-ar-e-manutencao-predial-industrial',
    'climatização-qualidade-do-ar-e-manutenção-predial-industrial',
    'climatizacao-qualidade-do-ar-e-manutencao-predialindustrial',
    'climatizacao-e-pmoc',
    'pmoc-e-climatizacao',
    'cat-5'
  ];

  try {
    for (const catId of categoriasAlvo) {
      // Documento da categoria
      const catDocRef = doc(db, 'categoriasLaudo', catId);
      await setDoc(catDocRef, {
        id: catId,
        nome: 'Climatização, Qualidade do Ar e Manutenção Predial/Industrial',
        icone: 'Wind',
        atualizadoEm: new Date().toISOString()
      }, { merge: true });

      // Documentos de cada tipo
      for (const [tipoKey, dados] of Object.entries(TIPOS_CLIMATIZACAO_FIRESTORE)) {
        // Grava no ID canônico por extenso
        const tipoDocRef = doc(db, 'categoriasLaudo', catId, 'tipos', tipoKey);
        await setDoc(tipoDocRef, dados, { merge: true });
        gravados++;

        // Grava também nos IDs curtos / aliases
        const aliases = Object.keys(ALIASES_TIPOS_CLIMATIZACAO).filter(k => ALIASES_TIPOS_CLIMATIZACAO[k] === tipoKey);
        for (const shortAlias of aliases) {
          const shortDocRef = doc(db, 'categoriasLaudo', catId, 'tipos', shortAlias);
          await setDoc(shortDocRef, {
            ...dados,
            id: shortAlias,
            aliasDe: tipoKey
          }, { merge: true });
          gravados++;
        }
      }
    }

    return {
      sucesso: true,
      totalAtualizados: gravados,
      mensagem: `Sucesso: ${gravados} documentos de climatização, qualidade do ar e manutenção predial/industrial sincronizados nas coleções Firestore categoriasLaudo/climatizacao-qualidade-do-ar-e-manutencao-predial-industrial/tipos/{tipo}.`
    };
  } catch (error: any) {
    console.error('Erro ao sincronizar tipos de climatização e qualidade do ar com Firestore:', error);
    return {
      sucesso: false,
      totalAtualizados: gravados,
      mensagem: `Erro na gravação Firestore: ${error?.message || String(error)}`
    };
  }
}






