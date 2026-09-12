import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

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
  secoesEspecificas: string[];
  checklistInicial: string[];
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
      'Placa de identificação da máquina localizada e legível',
      'Manual de instruções do fabricante disponível',
      'Todas as fases de vida da máquina mapeadas (operação, setup, limpeza, manutenção)',
      'Perigos mecânicos identificados por ponto de operação',
      'Perigos elétricos identificados (partes energizadas, aterramento)',
      'Perigos térmicos identificados (superfícies quentes/frias)',
      'Nível de ruído avaliado (dosimetria, se aplicável)',
      'Nível de vibração avaliado (se aplicável)',
      'Perigos ergonômicos identificados (posturas, movimentos repetitivos)',
      'LO (probabilidade de ocorrência) atribuído por perigo',
      'FE (frequência de exposição) atribuído por perigo',
      'DPH (grau de dano possível) atribuído por perigo',
      'NP (número de pessoas expostas) atribuído por perigo',
      'HRN calculado e classificado por perigo',
      'Medidas de controle existentes registradas',
      'Medidas de controle recomendadas priorizadas por hierarquia de controle',
      'Risco residual reavaliado após medidas propostas',
      'Cronograma de implementação definido com responsáveis e prazos',
      'PGR/PPRA da empresa correlacionado (referência cruzada, se aplicável)'
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
      'Todos os pontos de operação/perigo mapeados',
      'Proteções fixas existentes avaliadas (fixação, resistência, ausência de aberturas perigosas)',
      'Proteções móveis intertravadas avaliadas (tipo de chave de segurança, categoria)',
      'Cortinas de luz avaliadas (resolução, categoria, distância de instalação)',
      'Tapetes de segurança avaliados (se houver)',
      'HRN calculado por ponto de perigo desprotegido/inadequado',
      'Distância de segurança calculada conforme NBR ISO 13857',
      'Tempo de parada da máquina medido/estimado',
      'Categoria do sistema de comando de segurança definida (PL/Categoria)',
      'Especificação técnica das proteções recomendadas elaborada',
      'Compatibilidade elétrica das novas proteções com o painel existente avaliada',
      'Plano de adequação priorizado por nível de risco',
      'Prazo de implementação definido por item'
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
      'Alteração/modernização documentada tecnicamente (memorial descritivo)',
      'Novos perigos introduzidos pela alteração identificados',
      'HRN recalculado para perigos novos/alterados',
      'Novas proteções testadas funcionalmente (acionamento, parada, rearme)',
      'Intertravamentos pós-retrofit testados',
      'Esquema elétrico/pneumático atualizado conferido',
      'Manual de instruções da máquina atualizado',
      'PPRA/PGR da empresa atualizado com a nova configuração',
      'Operadores treinados na nova configuração (registro de treinamento)',
      'Sinalização de segurança atualizada na máquina'
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
      'Placa de identificação localizada, legível e compatível com o prontuário',
      'PMTA (Pressão Máxima de Trabalho Admissível) confirmada',
      'Volume do vaso confirmado',
      'Grupo do fluido (categoria) identificado conforme Anexo I',
      'Categoria do vaso calculada (P × V)',
      'Inspeção externa realizada (carcaça, isolamento, suportes)',
      'Inspeção interna realizada, quando acessível',
      'Medição de espessura por ultrassom realizada em pontos definidos',
      'Ensaio de líquido penetrante em soldas críticas (se aplicável)',
      'Válvula de segurança identificada e calibração conferida',
      'Válvula de segurança dentro do prazo de calibração',
      'Corrosão externa/interna mapeada e quantificada',
      'Taxa de corrosão calculada',
      'Vida útil remanescente estimada',
      'Periodicidade da próxima inspeção definida',
      'Prontuário do vaso disponível e atualizado',
      'ART de inspeção anterior verificada (se houver)'
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
      'Categoria da caldeira identificada (conforme potência/pressão)',
      'Inspeção externa da carcaça e estrutura realizada',
      'Isolamento térmico avaliado',
      'Inspeção interna da fornalha realizada',
      'Feixe tubular inspecionado (incrustações, corrosão)',
      'Teste hidrostático executado (quando aplicável) e resultado registrado',
      'Válvula(s) de segurança calibrada(s) e dentro do prazo',
      'Controles de nível de água testados',
      'Pressostatos e manômetros calibrados/aferidos',
      'Sistema de controle de queima verificado',
      'Livro de registro de segurança atualizado',
      'Operador de caldeira com certificação válida (NR-13, Anexo II) verificado'
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
      'Rede/tanque mapeado e identificado (TAG, isométrico ou desenho esquemático)',
      'Pontos críticos de inspeção definidos (soldas, curvas, derivações)',
      'Inspeção visual externa realizada',
      'Corrosão externa mapeada e quantificada',
      'Espessura medida por ultrassom em todos os pontos críticos definidos',
      'Suportes e ancoragens avaliados (fixação, corrosão, alinhamento)',
      'Isolamento térmico avaliado (integridade, presença de umidade)',
      'Proteção catódica avaliada, quando aplicável (tanques enterrados)',
      'Taxa de corrosão calculada',
      'Vida útil remanescente estimada',
      'Registro fotográfico completo por ponto de inspeção'
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
      'Pneus: profundidade dos sulcos, calibragem, estado de conservação (todos, incluindo estepe)',
      'Freios: eficiência de frenagem, freio de mão/estacionamento',
      'Sistema de direção: folga, alinhamento, ruídos anormais',
      'Suspensão: amortecedores, molas, buchas',
      'Sistema elétrico: bateria, alternador, chicote',
      'Iluminação: faróis, lanternas, luz de freio, pisca-alerta, luz de ré',
      'Buzina funcional',
      'Limpador e lavador de para-brisa funcionais',
      'Retrovisores (interno e externos) íntegros',
      'Para-brisa e vidros sem trincas que comprometam a visão',
      'Cintos de segurança em todos os assentos, funcionais',
      'Extintor de incêndio dentro da validade (quando exigido pela categoria)',
      'Triângulo de sinalização e macaco/chave de roda presentes',
      'Estado da lataria/estrutura (corrosão, amassados que comprometam segurança)',
      'Vazamentos de fluidos (óleo, freio, arrefecimento) verificados',
      'Nível de fluidos conferido (óleo do motor, freio, arrefecimento)',
      'Sistema de escapamento e emissão de gases avaliado',
      'Documentação do veículo (CRLV) conferida e regular',
      'Quilometragem e histórico de manutenção registrados',
      'Item(ns) não conforme(s) classificado(s) por severidade/urgência'
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
      'Cinto de segurança individual funcional em todos os assentos',
      'Lotação máxima respeitada e sinalizada',
      'Tacógrafo/registrador instantâneo instalado e funcional',
      'Porta de emergência sinalizada, desobstruída e com abertura testada',
      'Extintor de incêndio dentro da validade e de fácil acesso',
      'Pintura externa na cor amarela padronizada (Resolução CONTRAN aplicável)',
      'Faixa "ESCOLAR" frontal e traseira visível',
      'Identificação da empresa/órgão responsável afixada',
      'Idade do veículo dentro do limite legal aplicável',
      'Pneus, freios e direção avaliados (item técnico geral do veículo)',
      'Sistema de iluminação e sinalização (incluindo luz de parada obrigatória, quando exigida) conferido',
      'Piso/assoalho sem furos, corrosão ou riscos de tropeço',
      'Ausência de partes cortantes/pontiagudas no interior',
      'Monitor/condutor com credenciais e documentação exigida por lei verificados',
      'Sistema de comunicação de emergência (rádio/celular) disponível a bordo',
      'Conformidade item a item com a ABNT NBR 17075:2022 registrada'
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
      'Numeração de chassi conferida e sem indícios de adulteração',
      'Histórico do sinistro (natureza, data, extensão inicial) levantado',
      'Álbum fotográfico completo por categoria realizado',
      'Colunas (A, B, C) avaliadas estruturalmente',
      'Soleiras e assoalho avaliados',
      'Teto e estrutura superior avaliados',
      'Longarinas e travessas avaliadas',
      'Sistema de direção avaliado pós-sinistro',
      'Sistema de freios avaliado pós-sinistro',
      'Suspensão avaliada pós-sinistro',
      'Airbags e pré-tensionadores avaliados (acionados/não acionados, substituição)',
      'Sistema elétrico/eletrônico avaliado (módulos, chicotes)',
      'Componentes substituídos identificados e comparados à especificação original',
      'Classificação de monta (Pequena/Média/Grande) justificada tecnicamente',
      'Memorial descritivo da reclassificação elaborado',
      'Parecer conclusivo sobre viabilidade de regularização junto ao DETRAN'
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
      'Ponto de impacto identificado e extensão do dano delimitada',
      'Motor e componentes mecânicos avaliados quanto a danos',
      'Câmbio e transmissão avaliados quanto a danos',
      'Sistema de arrefecimento avaliado (radiador, mangueiras)',
      'Suspensão avaliada (danos por impacto)',
      'Estrutura do chassi/monobloco inspecionada visualmente',
      'Indícios de corte e solda emendada verificados',
      'Alinhamento do monobloco medido e comparado às cotas de fábrica',
      'Airbags avaliados (acionamento, substituição, integridade dos sensores)',
      'Pré-tensionadores de cinto avaliados',
      'Estruturas de absorção de impacto (para-choques, longarinas) avaliadas',
      'Sistema elétrico/eletrônico avaliado quanto a danos',
      'Histórico de sinistros anteriores do veículo consultado',
      'Álbum fotográfico categorizado (frontal, traseira, laterais, interior, estrutura) elaborado',
      'Comparação de custo de reparo x valor de mercado do veículo realizada',
      'Parecer conclusivo sobre viabilidade de reparo ou perda total emitido'
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
      'Planta baixa atualizada e compatível com a edificação real',
      'Área construída por pavimento medida/conferida',
      'Altura da edificação determinada',
      'Número de pavimentos e uso de cada um identificado',
      'Classificação de ocupação (Grupo/Divisão) definida conforme IT estadual',
      'Carga de incêndio de referência da ocupação identificada',
      'Isolamento de risco (afastamento entre edificações) avaliado',
      'Acesso de viaturas do Corpo de Bombeiros verificado (largura, raio de giro, resistência do piso)',
      'Reservatório de água para incêndio identificado (capacidade e exclusividade)',
      'Sistema de hidrantes existente avaliado (se houver)',
      'Sistema de alarme/detecção existente avaliado (se houver)',
      'Saídas de emergência mapeadas preliminarmente',
      'SPDA (sistema de proteção contra descargas atmosféricas) avaliado',
      'Compartimentação horizontal/vertical avaliada',
      'Registro fotográfico do estado atual da edificação'
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
      'População calculada por pavimento conforme uso/ocupação',
      'Largura das saídas calculada em unidades de passagem',
      'Número de saídas exigidas comparado ao número existente',
      'Distância máxima a percorrer verificada dentro do limite normativo',
      'Carga de incêndio calculada por ocupação (MJ/m²)',
      'Escadas de emergência dimensionadas (largura mínima, corrimãos)',
      'Portas corta-fogo dimensionadas e localizadas corretamente',
      'Sinalização de rota de fuga fotoluminescente especificada',
      'Tempo de escoamento estimado calculado',
      'Compatibilidade do dimensionamento com o uso real da edificação verificada'
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
      'Extintores com tipo/carga adequados ao risco, validade em dia e sinalizados',
      'Distância de caminhamento até o extintor dentro do limite normativo',
      'Hidrantes testados (pressão e vazão no ponto mais desfavorável)',
      'Mangueiras, esguicho e chave storz conferidos',
      'Reservatório de incêndio com nível adequado',
      'Bomba de incêndio testada (partida automática e pressão nominal)',
      'Sprinklers inspecionados visualmente (obstrução, corrosão, cobertura), quando exigidos',
      'Central de alarme testada (todos os laços)',
      'Acionadores manuais testados',
      'Detectores de fumaça/calor testados',
      'Sirenes/estrobos testados quanto a audibilidade e visibilidade',
      'Iluminação de emergência testada (autonomia mínima conforme norma)',
      'Sinalização de emergência fotoluminescente conferida',
      'SPDA inspecionado visualmente (continuidade elétrica, aterramento)',
      'Portas corta-fogo testadas (fechamento automático, barra antipânico)',
      'Saídas de emergência desobstruídas e sinalizadas',
      'Compartimentação horizontal/vertical verificada',
      'Escada de emergência pressurizada testada, quando exigida',
      'Brigada de incêndio treinada e com certificado válido',
      'Plano de emergência elaborado e disponível no local',
      'Relação de pendências elaborada com prazo de regularização'
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
      'Extintor adequado à classe de risco (A/B/C) presente',
      'Quantidade de extintores compatível com a área do estabelecimento',
      'Extintor dentro da validade e sinalizado',
      'Saída de emergência sinalizada e desobstruída',
      'Instalação elétrica aparentemente regular (sem fios expostos)',
      'Quadro elétrico identificado (disjuntores nomeados)',
      'Lotação do estabelecimento compatível com a área',
      'Iluminação de emergência básica presente, quando exigida',
      'Enquadramento em baixo risco/microempresa confirmado conforme IT aplicável'
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
      'Teste de vazão e pressão realizado no hidrante mais desfavorável',
      'Bomba de incêndio testada (partida automática e pressão nominal)',
      'Reservatório de incêndio com nível conferido antes do teste',
      'Sprinklers inspecionados visualmente (obstrução, corrosão, cobertura)',
      'Central de alarme testada em todos os laços',
      'Acionadores manuais testados individualmente',
      'Detectores de fumaça/calor testados',
      'Sirenes testadas quanto à audibilidade',
      'Sinalizadores visuais (estrobo) testados quanto à visibilidade',
      'Iluminação de emergência testada quanto à autonomia mínima',
      'Luminância da iluminação de emergência medida',
      'Ficha de comissionamento preenchida e assinada pelo responsável técnico'
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
      'Central de gás identificada e sinalizada ("Gás Inflamável")',
      'Pressão de teste aplicada conforme norma aplicável',
      'Tempo de estabilização respeitado',
      'Ausência de queda de pressão confirmada (estanqueidade aprovada)',
      'Conexões e válvulas inspecionadas visualmente (ausência de vazamento/corrosão)',
      'Regulador de pressão conferido e dentro do prazo de manutenção',
      'Ventilação do abrigo/central de gás avaliada como adequada',
      'Proteção contra impacto de veículos verificada, quando aplicável',
      'Certificado de calibração do manômetro utilizado no teste anexado'
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
      'Horímetro registrado no momento da inspeção',
      'Estrutura do chassi sem trincas ou deformações visíveis',
      'Lança/braço e caçamba/implemento sem deformações estruturais',
      'Sistema hidráulico sem vazamentos aparentes',
      'Mangueiras hidráulicas sem desgaste, ressecamento ou abrasão',
      'Cilindros hidráulicos sem vazamento nas hastes',
      'Esteiras ou pneus com desgaste dentro do limite aceitável',
      'Rodas motrizes e roletes avaliados quanto a desgaste',
      'Freio de serviço testado',
      'Freio de estacionamento testado',
      'Comandos de cabine funcionais (alavancas, pedais, joystick)',
      'Instrumentação do painel funcional (pressão, temperatura, combustível)',
      'Cinto de segurança do operador presente e funcional',
      'Buzina e alarme sonoro de ré funcionais',
      'Extintor de incêndio a bordo, quando exigido',
      'Pinos e buchas de articulação avaliados quanto a folga/desgaste',
      'HRN calculado para os perigos residuais identificados',
      'Estrutura ROPS/FOPS íntegra (referenciar laudo específico, se elaborado separadamente)'
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
      'Placa de certificação ROPS presente e legível',
      'Placa de certificação FOPS presente, quando aplicável',
      'Estrutura sem trincas ou deformações visíveis',
      'Solda da estrutura íntegra, sem fissuras',
      'Parafusos de fixação com torque conferido',
      'Compatibilidade da estrutura com o modelo/fabricante do equipamento confirmada',
      'Ausência de furação ou adaptação não certificada na estrutura',
      'Estrutura sem sinais de impacto anterior sem substituição/certificação'
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
      'Capacidade nominal identificada na placa de carga',
      'Freio de serviço testado',
      'Freio de estacionamento testado',
      'Direção sem folga excessiva',
      'Sistema hidráulico de elevação sem vazamentos',
      'Corrente/cilindro de elevação avaliado quanto a desgaste',
      'Garfos sem trincas ou deformação (empilhadeiras)',
      'Plataforma ou cesto sem deformação (PEMT/PTA)',
      'Guarda-corpo e trava do cesto conferidos (PEMT/PTA)',
      'Alarme sonoro de ré funcional',
      'Luz giroflex/sinalizadora funcional',
      'Cinto de segurança do operador/cesto presente',
      'Dispositivo de parada de emergência testado',
      'Estabilizadores testados, quando aplicável',
      'HRN calculado para os perigos identificados'
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
      'Carga de teste definida (percentual conforme norma/fabricante, ex.: 110% da capacidade nominal)',
      'Pesagem da carga de teste conferida',
      'Ensaio realizado sem deformação permanente do equipamento',
      'Estabilidade mantida sem indício de tombamento',
      'Tempo de sustentação da carga cumprido conforme metodologia',
      'Limitador de carga acionado corretamente durante o teste',
      'Alarme de sobrecarga testado e funcional',
      'Certificado de aferição do dinamômetro/célula de carga utilizado anexado',
      'Relatório fotográfico do ensaio elaborado'
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
      'Freio de emergência testado',
      'Freio de serviço testado',
      'Sinalização sonora de ré funcional',
      'Giroflex/luz de alerta funcional',
      'Vazamentos hidráulicos verificados (cilindros, mangueiras, bomba)',
      'Sistema de vibração/compactação testado',
      'Tambor/rolo sem danos estruturais',
      'Sistema de aquecimento de massa avaliado, quando aplicável (vibroacabadora)',
      'Cabine do operador com visibilidade adequada',
      'Extintor de incêndio a bordo conferido'
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
      'Cabo de aço sem fios rompidos acima do limite normativo',
      'Cabo de aço lubrificado e sem corrosão excessiva',
      'Gancho com trava de segurança (catraca) funcional',
      'Gancho sem deformação ou desgaste no colo',
      'Cintas/lingas dentro da validade e sem cortes ou desgaste',
      'Capacidade das cintas/lingas compatível com a carga de trabalho',
      'Patolas/estabilizadores testados quanto a acionamento e travamento',
      'Base de apoio das patolas avaliada (chapas de apoio, solo)',
      'Roldanas sem desgaste excessivo no canal',
      'Tambor de enrolamento sem danos ou deformações',
      'Sistema de freio do guincho testado'
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
      'Sensor de ângulo da lança calibrado',
      'Sensor de extensão/comprimento da lança calibrado',
      'Célula de carga/sensor de carga calibrado',
      'Teste realizado em ao menos três configurações de lança (curta, média, longa)',
      'Alarme visual de sobrecarga acionado corretamente',
      'Alarme sonoro de sobrecarga acionado corretamente',
      'Corte automático de movimento perigoso testado, quando existente',
      'Computador de bordo sem códigos de erro não resolvidos',
      'Certificado de calibração dos sensores anexado',
      'Teste registrado com data, resultado e responsável técnico'
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
      'Superfície de amortecimento de impacto adequada à altura de queda livre de cada equipamento',
      'Área de queda livre desobstruída',
      'Ausência de pontos de aprisionamento de cabeça/pescoço (aberturas entre 89 e 230 mm)',
      'Ausência de pontos de aprisionamento de dedos',
      'Ausência de pontos de prendimento de roupas ou cordões',
      'Ancoragens e fundações firmes, sem corrosão',
      'Ausência de arestas cortantes ou pontas expostas',
      'Ausência de ferrugem estrutural comprometedora',
      'Correntes/cabos de balanços sem desgaste excessivo',
      'Escorregador com ângulo e altura conformes à norma',
      'Gangorra com sistema de amortecimento no ponto de contato',
      'Carrossel com velocidade de rotação controlada',
      'Zona de segurança entre equipamentos respeitada (distância mínima)',
      'Sinalização de idade recomendada e normas de uso afixada',
      'Identificação de fabricante/certificação do equipamento, quando aplicável'
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
      'Partes lascadas/rachadas identificadas e mapeadas',
      'Ferrugem/corrosão estrutural mapeada',
      'Parafusos soltos ou faltantes identificados',
      'Tampas de proteção de parafusos presentes',
      'Folgas em articulações de balanços/gangorras medidas',
      'Desgaste de correntes/cabos avaliado',
      'Superfície de amortecimento com desgaste ou deslocamento verificado',
      'Vegetação ou obstáculos próximos ao playground avaliados',
      'Classificação de prioridade (crítica/moderada/baixa) atribuída a cada não conformidade',
      'Plano de ação corretivo elaborado com prazos por item'
    ],
    atualizadoEm: new Date().toISOString()
  }
};

export const ALIASES_TIPOS_PLAYGROUND: Record<string, string> = {
  'laudo-playground-nbr16071': 'laudo-tecnico-de-inspecao-de-playground-abnt-nbr-16071',
  'play-nbr': 'laudo-tecnico-de-inspecao-de-playground-abnt-nbr-16071',
  'laudo-playground-risco': 'laudo-de-analise-de-risco-e-manutencao-corretiva',
  'play-risco': 'laudo-de-analise-de-risco-e-manutencao-corretiva'
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
      'Tipologia estrutural identificada (tesoura, pórtico ou treliça)',
      'Vão livre e área coberta conferidos',
      'Deformações visíveis em elementos estruturais mapeadas',
      'Indícios de flambagem em barras comprimidas verificados',
      'Corrosão mapeada por elemento (localização e severidade)',
      'Perda de seção por corrosão estimada',
      'Flechas medidas em tesouras/treliças/pilares',
      'Flechas comparadas ao limite normativo aplicável',
      'Ligações parafusadas conferidas (torque, ausência de folga)',
      'Ligações soldadas inspecionadas visualmente',
      'Fixação da cobertura (telhas) verificada',
      'Calhas e sistema de drenagem pluvial avaliados',
      'Contraventamentos verificados quanto à integridade',
      'Pintura anticorrosiva avaliada'
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
      'Estrutura do piso/mezanino identificada (tipo, vigas, pilares)',
      'Capacidade de projeto original levantada, quando existente',
      'Carga atual/pretendida comparada à capacidade calculada',
      'Sobrecarga de utilização verificada conforme ABNT NBR 6120',
      'Avaliação de tráfego de empilhadeiras (carga dinâmica e concentrada) realizada',
      'Deformações ou fissuras na estrutura do piso/mezanino verificadas',
      'Guarda-corpo do mezanino conferido (altura, resistência)',
      'Sinalização de carga máxima admissível afixada',
      'Parecer sobre adequação ou necessidade de reforço estrutural emitido'
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
      'Juntas soldadas identificadas e numeradas',
      'Inspeção visual realizada em todas as juntas listadas',
      'Porosidade superficial verificada',
      'Mordedura (undercut) verificada',
      'Respingos de solda verificados',
      'Trincas superficiais verificadas',
      'Dimensão da perna de solda (perna do filete) medida',
      'Comprimento do cordão conferido',
      'Reforço da solda de topo verificado',
      'Sobreposição/desalinhamento de chapas verificado',
      'Critério de aceitação/rejeição aplicado por junta',
      'Registro fotográfico por junta inspecionada'
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
      'Método de ensaio definido por junta/ponto (LP/PM/US/RX)',
      'Superfície preparada conforme exigência do método',
      'Ensaio executado conforme procedimento aplicável',
      'Resultados registrados por junta/ponto',
      'Descontinuidades classificadas (tipo, dimensão, localização)',
      'Critério de aceitação aplicado, com norma de referência informada',
      'Certificado de qualificação do inspetor (nível 1/2, conforme SNQC/ABENDI) anexado',
      'Equipamento de ensaio calibrado e com certificado válido',
      'Parecer de aprovação/reprovação emitido por junta/ponto',
      'Registro fotográfico/radiográfico anexado'
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
      'Capacidade nominal identificada na placa do equipamento',
      'Vão da ponte/pórtico conferido',
      'Trilhos de rolamento avaliados quanto a desgaste e alinhamento',
      'Rodas do carrinho/ponte avaliadas',
      'Barramento elétrico isolado e sem danos aparentes',
      'Coletores de energia avaliados',
      'Cabo de aço/corrente da talha sem desgaste ou corrosão',
      'Freio de elevação testado',
      'Freio de translação testado',
      'Redutor sem vazamento de óleo ou ruído anormal',
      'Fins de curso (superior, inferior, lateral) testados',
      'Limitador de carga testado',
      'Botão de emergência testado',
      'Controle pendente (botoeira) sem danos',
      'Estrutura da viga principal sem deformação ou trinca',
      'Estrutura do carrinho sem deformação',
      'Sinalização de capacidade nominal afixada na ponte/pórtico'
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
      'Histórico de operação levantado (horas, ciclos), quando disponível',
      'Classe de utilização (U0–U9, conforme ISO 4301) definida',
      'Estado de carga (Q1–Q4) definido',
      'Grupo de classificação (FEM) calculado a partir de utilização x estado de carga',
      'SWP calculado a partir do grupo de classificação',
      'Vida útil já consumida comparada ao SWP total',
      'Vida útil remanescente estimada',
      'Recomendação de periodicidade de reinspeção definida',
      'Componentes críticos para fadiga identificados (gancho, tambor, estrutura)'
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
      'Capacidade nominal identificada',
      'Percurso e número de paradas conferidos',
      'Cabos de tração sem fios rompidos ou corrosão',
      'Limitador de velocidade testado',
      'Freio de emergência (pára-quedas) testado',
      'Portas de pavimento com intertravamento funcional',
      'Porta de cabina com intertravamento funcional',
      'Casa de máquinas com acesso seguro e iluminação adequada',
      'Quadro de comando identificado, sem exposição de partes energizadas',
      'Ventilação da casa de máquinas avaliada',
      'Fundo de poço limpo e com para-choques íntegros',
      'Iluminação do poço funcional',
      'Sinalização de capacidade máxima afixada na cabina',
      'Dispositivo de alarme/comunicação de emergência testado'
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
      'Dispositivo identificado (tipo, dimensões, material)',
      'Memória de cálculo apresentada (dimensionamento e fator de segurança)',
      'Fator de segurança conforme norma aplicável (NBR 8400 ou equivalente)',
      'Teste de carga realizado (percentual da capacidade nominal)',
      'Ausência de deformação permanente após o teste',
      'Solda inspecionada visualmente (fissuras, porosidade)',
      'Fixação/parafusos conferidos com torque adequado',
      'Marcação de capacidade nominal gravada de forma permanente na peça',
      'Data de fabricação/teste registrada',
      'Certificado do teste de carga anexado'
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

  'laudo-vida-util-swp': 'laudo-de-analise-de-vida-util-remanescente-swp-safe-working-period',
  'laudo-de-analise-de-vida-util-remanescente-swp': 'laudo-de-analise-de-vida-util-remanescente-swp-safe-working-period',
  'laudo-analise-vida-util-remanescente-swp': 'laudo-de-analise-de-vida-util-remanescente-swp-safe-working-period',
  'swp': 'laudo-de-analise-de-vida-util-remanescente-swp-safe-working-period',

  'laudo-elevador-carga': 'laudo-de-inspecao-de-elevadores-de-cargas-e-monta-cargas',
  'laudo-inspecao-elevadores-cargas-monta-cargas': 'laudo-de-inspecao-de-elevadores-de-cargas-e-monta-cargas',
  'elevadores-de-cargas-e-monta-cargas': 'laudo-de-inspecao-de-elevadores-de-cargas-e-monta-cargas',
  'elevadores-e-dispositivos-de-carga-industrial': 'laudo-de-inspecao-de-elevadores-de-cargas-e-monta-cargas',

  'laudo-dispositivos-icamento': 'laudo-de-dispositivos-de-icamento-olhais-balancins-e-travessoes',
  'laudo-dispositivos-icamento-olhais-balancins-travessoes': 'laudo-de-dispositivos-de-icamento-olhais-balancins-e-travessoes',
  'dispositivos-de-icamento': 'laudo-de-dispositivos-de-icamento-olhais-balancins-e-travessoes'
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




