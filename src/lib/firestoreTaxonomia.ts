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
