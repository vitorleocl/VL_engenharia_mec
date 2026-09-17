import { CategoriaMestreDef, ItemInspecaoMestre } from '../../types';

// ============================================================================
// CATEGORIA 1: SEGURANÇA CONTRA INCÊNDIO E PÂNICO
// ============================================================================
export const CATEGORIA_1_INCENDIO: CategoriaMestreDef = {
  numero: 1,
  id: 'cat-mestre-1',
  nome: 'Segurança Contra Incêndio e Pânico',
  icone: 'Flame',
  descricao: 'Projetos, vistorias para AVCB/CLCB, rotas de fuga, cálculo de carga térmica e testes hidrostáticos/comissionamento de sistemas preventivos.',
  subcategorias: [
    {
      id: 'sub-mestre-1-1',
      codigo: '1.1',
      nome: 'Projetos e Adequação Técnica — Pré-Execução',
      tiposLaudo: [
        {
          id: 'tl-1-1-ppci',
          codigo: 'L-PPCI-PRE',
          nome: 'Laudo de Análise/Levantamento Pré-Projeto PPCI',
          normasRef: 'ABNT NBR 9077, NBR 13434, Instruções Técnicas dos CBMs',
          gruposInspecao: ['Caracterização e Ocupação', 'Carga Térmica e Riscos', 'Saídas e Rotas de Fuga', 'Sistemas Preventivos Preliminares'],
          itens: [
            {
              codigo: 'INC-01-001',
              descricao: 'Identificação e Uso/Ocupação da Edificação',
              criterioInspecao: 'Verificar classificação da ocupação (grupo/divisão), atividade principal e secundária.',
              grupoInspecao: 'Caracterização e Ocupação',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Inspeção visual',
              criticidadePadrao: 'Alta',
              recomendacaoPadrao: 'Definir ocupação prioritária conforme Tabela de Ocupação da IT do Corpo de Bombeiros.',
              referenciaNormativa: { norma: 'IT-01 / IT-02 CBM', edicaoAno: '2023', itemRequisito: 'Tabela 1 - Classificação das Edificações' }
            },
            {
              codigo: 'INC-01-002',
              descricao: 'Área Construída Total e Área por Pavimento',
              criterioInspecao: 'Levantar e conferir área real construída e compartimentações existentes.',
              grupoInspecao: 'Caracterização e Ocupação',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'm²', instrumentoUtilizado: 'Trena a Laser', valorEncontrado: 1250, tolerancia: '±1%' },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Alta',
              referenciaNormativa: { norma: 'ABNT NBR 9077', edicaoAno: '2001', itemRequisito: 'Item 4.2' }
            },
            {
              codigo: 'INC-01-003',
              descricao: 'Altura da Edificação e Número de Pavimentos',
              criterioInspecao: 'Medição da soleira de entrada ao piso do último pavimento habitável (desconsiderando ático/barrilete).',
              grupoInspecao: 'Caracterização e Ocupação',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'm', valorEncontrado: 12.5, instrumentoUtilizado: 'Medidor Eletrônico' },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Alta',
              referenciaNormativa: { norma: 'IT-01 CBM', itemRequisito: 'Definição de Altura de Edificação' }
            },
            {
              codigo: 'INC-01-004',
              descricao: 'Densidade de Ocupação e População Máxima Teórica',
              criterioInspecao: 'Cálculo da lotação máxima teórica por m² por pavimento conforme destinação.',
              grupoInspecao: 'Caracterização e Ocupação',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Documento',
              criticidadePadrao: 'Media',
              referenciaNormativa: { norma: 'ABNT NBR 9077', itemRequisito: 'Tabela 1 - Coeficientes de Lotação' }
            },
            {
              codigo: 'INC-01-005',
              descricao: 'Levantamento da Carga de Incêndio Específica (MJ/m²)',
              criterioInspecao: 'Inventariar materiais combustíveis e determinar método de cálculo (probabilístico ou específico).',
              grupoInspecao: 'Carga Térmica e Riscos',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'MJ/m²', valorEncontrado: 450, valorMaximo: 800 },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Alta',
              referenciaNormativa: { norma: 'ABNT NBR 14432', edicaoAno: '2001', itemRequisito: 'Cálculo de Carga de Incêndio' }
            },
            {
              codigo: 'INC-01-006',
              descricao: 'Distância Máxima de Percurso até a Saída Mais Próxima',
              criterioInspecao: 'Medir percurso real até a área desobstruída ou escada protegida com ou sem sprinklers.',
              grupoInspecao: 'Saídas e Rotas de Fuga',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'm', valorEncontrado: 28.5, valorMaximo: 35.0, instrumentoUtilizado: 'Trena laser calibrada' },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Critica',
              recomendacaoPadrao: 'Criar nova saída de escape para reduzir o percurso para limites regulamentares.',
              referenciaNormativa: { norma: 'ABNT NBR 9077', itemRequisito: 'Item 4.4' }
            },
            {
              codigo: 'INC-01-007',
              descricao: 'Largura e Dimensionamento das Portas e Saídas (Unidades de Passagem)',
              criterioInspecao: 'Verificar largura útil livre dos vãos de escape (mínimo 0,80m ou múltiplos de 0,55m).',
              grupoInspecao: 'Saídas e Rotas de Fuga',
              resultado: 'CONFORME',
              campoMedicao: { unidade: 'm', valorMinimo: 1.10, valorEncontrado: 1.20 },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ABNT NBR 9077', itemRequisito: 'Dimensionamento de Unidades de Passagem' }
            },
            {
              codigo: 'INC-01-008',
              descricao: 'Portas Corta-Fogo e Barras Antipânico nas Rotas de Fuga',
              criterioInspecao: 'Presença de selo de conformidade ABNT NBR 11742/11785, fechamento automático sem emperramento.',
              grupoInspecao: 'Saídas e Rotas de Fuga',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Teste funcional',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ABNT NBR 11742 e NBR 11785', itemRequisito: 'Porta Corta-Fogo' }
            },
            {
              codigo: 'INC-01-009',
              descricao: 'Acesso para Viaturas do Corpo de Bombeiros (Largura e Altura Livre)',
              criterioInspecao: 'Via transitável desobstruída com largura $\\ge 6,0\\text{ m}$ e gabarito vertical livre $\\ge 4,5\\text{ m}$.',
              grupoInspecao: 'Sistemas Preventivos Preliminares',
              resultado: 'CONFORME',
              campoMedicao: { unidade: 'm', valorMinimo: 6.0, valorEncontrado: 6.8 },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Alta',
              referenciaNormativa: { norma: 'IT-06 CBM', itemRequisito: 'Acesso de Viaturas' }
            },
            {
              codigo: 'INC-01-010',
              descricao: 'Reserva Técnica de Incêndio (RTI) e Casa de Bombas',
              criterioInspecao: 'Capacidade efetiva exclusiva para combate a incêndio e autonomia das motobombas.',
              grupoInspecao: 'Sistemas Preventivos Preliminares',
              resultado: 'CONFORME',
              campoMedicao: { unidade: 'm³', valorMinimo: 25, valorEncontrado: 32 },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ABNT NBR 13714', itemRequisito: 'Reserva de Incêndio' }
            }
          ]
        },
        {
          id: 'tl-1-1-saidas',
          codigo: 'L-DIM-SAIDAS',
          nome: 'Laudo de Dimensionamento de Saídas de Emergência',
          normasRef: 'ABNT NBR 9077, ITs CBM',
          gruposInspecao: ['Capacidade de Escoamento', 'Escadas e Rampas', 'Guarda-Corpos e Corrimãos'],
          itens: [
            {
              codigo: 'INC-01-020',
              descricao: 'Escadas de Emergência e Proteção contra Fumaça',
              criterioInspecao: 'Enclausuramento, ventilação ou pressurização e vedação corta-fogo.',
              grupoInspecao: 'Escadas e Rampas',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Inspeção visual',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ABNT NBR 9077', itemRequisito: 'Escadas enclausuradas' }
            },
            {
              codigo: 'INC-01-021',
              descricao: 'Corrimãos Contínuos Bilaterais e Altura Regulamentar',
              criterioInspecao: 'Altura de 0,92 m a 1,00 m, continuidade nos patamares e extremidades embutidas.',
              grupoInspecao: 'Guarda-Corpos e Corrimãos',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'm', valorMinimo: 0.92, valorMaximo: 1.00, valorEncontrado: 0.95 },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Alta',
              referenciaNormativa: { norma: 'ABNT NBR 9077 / NBR 14718', itemRequisito: 'Corrimãos' }
            }
          ]
        }
      ]
    },
    {
      id: 'sub-mestre-1-2',
      codigo: '1.2',
      nome: 'Regularização e Licenciamento (AVCB / CLCB)',
      tiposLaudo: [
        {
          id: 'tl-1-2-avcb',
          codigo: 'L-CONF-AVCB',
          nome: 'Laudo de Vistoria e Conformidade para AVCB/CLCB',
          normasRef: 'Decreto Estadual de Prevenção e Legislação Vigente',
          gruposInspecao: ['Documentação Legal', 'Extintores de Incêndio', 'Hidrantes e Mangotinhos', 'Alarme e Iluminação'],
          itens: [
            {
              codigo: 'INC-02-001',
              descricao: 'Validade e Registro do AVCB/CLCB Anterior',
              criterioInspecao: 'Verificar vencimento, divergências na área construída e alterações de layout.',
              grupoInspecao: 'Documentação Legal',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Documento',
              criticidadePadrao: 'Media',
              referenciaNormativa: { norma: 'Legislação do Corpo de Bombeiros', itemRequisito: 'Processo de Renovação' }
            },
            {
              codigo: 'INC-02-002',
              descricao: 'Unidades Extintoras — Carga, Lacre, Validade e Selo INMETRO',
              criterioInspecao: 'Conferir pressão no manômetro (faixa verde), anel de identificação e validade da recarga.',
              grupoInspecao: 'Extintores de Incêndio',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Inspeção visual',
              criticidadePadrao: 'Alta',
              referenciaNormativa: { norma: 'ABNT NBR 12962 e NBR 15808', itemRequisito: 'Inspeção e Manutenção de Extintores' }
            },
            {
              codigo: 'INC-02-003',
              descricao: 'Hidrantes — Manobra, Esguicho, Mangueiras e Abrigos',
              criterioInspecao: 'Presença de chaves storz, mangueiras do Tipo correto conforme ocupação com teste hidrostático anual.',
              grupoInspecao: 'Hidrantes e Mangotinhos',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Inspeção visual',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ABNT NBR 11861 e NBR 12779', itemRequisito: 'Mangueiras e Abrigos' }
            },
            {
              codigo: 'INC-02-004',
              descricao: 'Sistema de Iluminação de Emergência e Autonomia Mínima',
              criterioInspecao: 'Autonomia mínima de 2 horas sob interrupção de energia e nível de aclaramento conforme NBR 10898.',
              grupoInspecao: 'Alarme e Iluminação',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'lux', valorMinimo: 3, valorEncontrado: 6, instrumentoUtilizado: 'Luxímetro Calibrado' },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Alta',
              referenciaNormativa: { norma: 'ABNT NBR 10898', itemRequisito: 'Iluminância de aclaramento' }
            }
          ]
        }
      ]
    },
    {
      id: 'sub-mestre-1-3',
      codigo: '1.3',
      nome: 'Inspeção de Sistemas Específicos e Testes',
      tiposLaudo: [
        {
          id: 'tl-1-3-hidrantes',
          codigo: 'L-TEST-HIDR',
          nome: 'Laudo de Teste de Hidrantes e Bombas de Incêndio',
          normasRef: 'ABNT NBR 13714',
          gruposInspecao: ['Pressão e Vazão', 'Bombas de Incêndio', 'Tubulações e Registros'],
          itens: [
            {
              codigo: 'INC-03-001',
              descricao: 'Medição de Pressão Estática no Hidrante Mais Desfavorável',
              criterioInspecao: 'Medição com manômetro glicerinado com válvula fechada.',
              grupoInspecao: 'Pressão e Vazão',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'mca', valorMinimo: 10, valorEncontrado: 14.2, instrumentoUtilizado: 'Manômetro Calibrado' },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ABNT NBR 13714', itemRequisito: 'Pressão no ponto desfavorável' }
            },
            {
              codigo: 'INC-03-002',
              descricao: 'Pressão Dinâmica e Vazão Efetiva de Descarga com Requinte',
              criterioInspecao: 'Medição dinâmica na ponta do esguicho simultâneo nos hidrantes mais desfavoráveis.',
              grupoInspecao: 'Pressão e Vazão',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'L/min', valorMinimo: 150, valorEncontrado: 210, instrumentoUtilizado: 'Tubo de Pitot' },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ABNT NBR 13714', itemRequisito: 'Vazão mínima de combate' }
            },
            {
              codigo: 'INC-03-003',
              descricao: 'Acionamento Automático por Pressostato e Partida das Bombas Principal e Jockey',
              criterioInspecao: 'Queda de pressão no barrilete deve acionar a bomba principal sem interrupções.',
              grupoInspecao: 'Bombas de Incêndio',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Teste funcional',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ABNT NBR 13714 / NFPA 20', itemRequisito: 'Automação de Casa de Bombas' }
            }
          ]
        },
        {
          id: 'tl-1-3-gas',
          codigo: 'L-ESTANQ-GAS',
          nome: 'Laudo de Estanqueidade de Rede de Gás Combustível (GLP / GN)',
          normasRef: 'ABNT NBR 15526, NBR 15358',
          gruposInspecao: ['Pressurização e Queda', 'Válvulas e Reguladores', 'Central de Gás'],
          itens: [
            {
              codigo: 'INC-03-020',
              descricao: 'Ensaio de Estanqueidade com Gás Inerte (Nitrogênio ou Ar Seco)',
              criterioInspecao: 'Pressurização na pressão de teste conforme diâmetro e pressão de operação por período regulamentar.',
              grupoInspecao: 'Pressurização e Queda',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'bar', valorMinimo: 1.5, valorEncontrado: 1.5, instrumentoUtilizado: 'Manômetro Diferencial Digital' },
              evidenciaDocumental: 'Ensaio',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ABNT NBR 15526', itemRequisito: 'Ensaio de estanqueidade' }
            },
            {
              codigo: 'INC-03-021',
              descricao: 'Queda de Pressão Registrada durante o Tempo de Ensaio',
              criterioInspecao: 'Queda de pressão nula (0,0 mbar) após estabilização de temperatura.',
              grupoInspecao: 'Pressurização e Queda',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'mbar', valorMaximo: 0, valorEncontrado: 0 },
              evidenciaDocumental: 'Ensaio',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ABNT NBR 15526', itemRequisito: 'Critério de aceitação de vazamento zero' }
            }
          ]
        }
      ]
    }
  ]
};

// ============================================================================
// CATEGORIA 2: SEGURANÇA DO TRABALHO E MÁQUINAS
// ============================================================================
export const CATEGORIA_2_NR12_NR13: CategoriaMestreDef = {
  numero: 2,
  id: 'cat-mestre-2',
  nome: 'Segurança do Trabalho e Máquinas (NR-12 e NR-13)',
  icone: 'ShieldAlert',
  descricao: 'Apreciação de risco NR-12, sistemas de segurança e paradas de emergência, e inspeções de integridade NR-13 em caldeiras e vasos de pressão.',
  subcategorias: [
    {
      id: 'sub-mestre-2-1',
      codigo: '2.1',
      nome: 'NR-12 — Segurança no Trabalho em Máquinas e Equipamentos',
      tiposLaudo: [
        {
          id: 'tl-2-1-aprec',
          codigo: 'L-NR12-APREC',
          nome: 'Laudo de Apreciação de Risco em Máquinas (NR-12 / ISO 12100)',
          normasRef: 'NR-12, ABNT NBR ISO 12100, NBR ISO 13849-1',
          gruposInspecao: ['Perigos Mecânicos e Zonas de Perigo', 'Proteções Físicas e Distâncias', 'Sistemas de Intertravamento e Parada', 'Dispositivos de Comando e Ergonomia'],
          itens: [
            {
              codigo: 'NR12-01-001',
              descricao: 'Identificação de Perigos Mecânicos (Esmagamento, Cisalhamento, Corte, Arraste)',
              criterioInspecao: 'Mapeamento perimetral em todos os modos operacionais (setup, operação, limpeza, manutenção).',
              grupoInspecao: 'Perigos Mecânicos e Zonas de Perigo',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Inspeção visual',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'NR-12.1.1 e ABNT NBR ISO 12100', itemRequisito: 'Identificação de perigos mecânicos' }
            },
            {
              codigo: 'NR12-01-002',
              descricao: 'Distâncias de Segurança de Proteções Fixas e Móveis (Membros Superiores/Inferiores)',
              criterioInspecao: 'Verificar conformidade das aberturas em telas e distâncias até as zonas perigosas.',
              grupoInspecao: 'Proteções Físicas e Distâncias',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'mm', valorMinimo: 850, valorEncontrado: 920, instrumentoUtilizado: 'Gabarito e Trena Digital' },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ABNT NBR ISO 13857', itemRequisito: 'Tabela 1 e 2 - Distâncias de segurança' }
            },
            {
              codigo: 'NR12-01-003',
              descricao: 'Intertravamento com Ruptura Positiva e Categoria de Segurança do Circuito',
              criterioInspecao: 'Chaves de segurança com ruptura mecânica positiva interligadas a relé/CLP de segurança com redundância.',
              grupoInspecao: 'Sistemas de Intertravamento e Parada',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Teste funcional',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ABNT NBR ISO 13849-1 e ISO 14119', itemRequisito: 'Intertravamentos com trava e ruptura positiva' }
            },
            {
              codigo: 'NR12-01-004',
              descricao: 'Botões de Parada de Emergência — Tipo Cogumelo, Retenção Mecânica e Categoria de Parada',
              criterioInspecao: 'Atuação imediata desenergizando atuadores (Categoria de parada 0 ou 1 conforme NBR ISO 13850).',
              grupoInspecao: 'Sistemas de Intertravamento e Parada',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Teste funcional',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ABNT NBR ISO 13850 e NR-12.56', itemRequisito: 'Dispositivos de parada de emergência' }
            },
            {
              codigo: 'NR12-01-005',
              descricao: 'Prevenção de Partida Inesperada e Circuito de Reset Manual',
              criterioInspecao: 'O rearme de emergência não pode reiniciar o ciclo automaticamente.',
              grupoInspecao: 'Dispositivos de Comando e Ergonomia',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Teste funcional',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ABNT NBR ISO 14118 e NR-12.37', itemRequisito: 'Rearme manual obrigatório' }
            }
          ]
        }
      ]
    },
    {
      id: 'sub-mestre-2-2',
      codigo: '2.2',
      nome: 'NR-13 — Caldeiras, Vasos de Pressão, Tubulações e Tanques Metálicos',
      tiposLaudo: [
        {
          id: 'tl-2-2-vaso',
          codigo: 'L-NR13-VASO',
          nome: 'Laudo de Inspeção de Integridade e Segurança de Vasos de Pressão',
          normasRef: 'NR-13, ASME Seção VIII Divisão 1, API 510',
          gruposInspecao: ['Prontuário e Documentação', 'Exame Visual Externo e Interno', 'Acessórios de Segurança e Alívio', 'Medição de Espessura e PMTA'],
          itens: [
            {
              codigo: 'NR13-01-001',
              descricao: 'Existência e Atualização do Prontuário, Registro de Segurança e Placa de Identificação',
              criterioInspecao: 'Verificar código de projeto, ano de fabricação, pressão máxima de trabalho admissível (PMTA) e volume.',
              grupoInspecao: 'Prontuário e Documentação',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Documento',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'NR-13.5.1', itemRequisito: 'Prontuário e Documentos Obrigatórios' }
            },
            {
              codigo: 'NR13-01-002',
              descricao: 'Válvula de Segurança (PSV) — Calibração, Lacre e Capacidade de Alívio',
              criterioInspecao: 'Certificado de calibração em bancada credenciada dentro do prazo de validade e lacre inviolado.',
              grupoInspecao: 'Acessórios de Segurança e Alívio',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Documento',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'NR-13.5.1.4 e ASME Seção VIII', itemRequisito: 'Dispositivos de Alívio de Pressão' }
            },
            {
              codigo: 'NR13-01-003',
              descricao: 'Medição de Espessura por Ultrassom no Costado e Tampos',
              criterioInspecao: 'Determinar menor espessura remanescente comparada à espessura mínima de projeto.',
              grupoInspecao: 'Medição de Espessura e PMTA',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'mm', valorMinimo: 4.8, valorEncontrado: 6.2, instrumentoUtilizado: 'Medidor de Espessura US Calibrado' },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ASME VIII Div 1 e API 510', itemRequisito: 'Cálculo de espessura mínima' }
            }
          ]
        }
      ]
    }
  ]
};

// ============================================================================
// CATEGORIA 3: MÁQUINAS PESADAS E EQUIPAMENTOS MÓVEIS
// ============================================================================
export const CATEGORIA_3_MAQUINAS_PESADAS: CategoriaMestreDef = {
  numero: 3,
  id: 'cat-mestre-3',
  nome: 'Máquinas Pesadas e Equipamentos Móveis',
  icone: 'Truck',
  descricao: 'Checklists mecânicos, estruturais, hidráulicos e de segurança para máquinas de terraplenagem, elevação, pavimentação e guindastes.',
  subcategorias: [
    {
      id: 'sub-mestre-3-1',
      codigo: '3.1',
      nome: 'Terraplenagem e Escavação',
      tiposAtivos: [
        'Escavadeira hidráulica',
        'Retroescavadeira',
        'Pá carregadeira',
        'Mini carregadeira',
        'Miniescavadeira',
        'Motoniveladora',
        'Trator de esteira',
        'Trator agrícola'
      ],
      tiposLaudo: [
        {
          id: 'tl-3-1-terra',
          codigo: 'L-TERRA-PESADA',
          nome: 'Laudo de Inspeção e Liberação Operacional de Máquinas de Terraplenagem',
          normasRef: 'NR-11, NR-12, NR-18, ABNT NBR ISO 3471 (ROPS), ISO 3449 (FOPS)',
          tiposAtivos: ['Escavadeira hidráulica', 'Retroescavadeira', 'Pá carregadeira', 'Motoniveladora', 'Trator de esteira'],
          gruposInspecao: ['Estrutura e Chassi', 'Cabine e Dispositivos de Proteção (ROPS/FOPS)', 'Sistema Motor e Trem de Força', 'Sistema Hidráulico e Cilindros', 'Conjunto de Escavação e Desgaste', 'Sinalização e Segurança'],
          itens: [
            {
              codigo: 'TER-01-001',
              descricao: 'Integridade Estrutural do Chassi, Longarinas e Soldas',
              criterioInspecao: 'Ausência de trincas nas soldas estruturais, deformações ou corrosão severa.',
              grupoInspecao: 'Estrutura e Chassi',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Inspeção visual',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'NR-11 e NR-12', itemRequisito: 'Integridade estrutural de chassis' }
            },
            {
              codigo: 'TER-01-002',
              descricao: 'Cabine de Operação com Certificação ROPS (Antitombamento) e FOPS (Antiqueda de Objetos)',
              criterioInspecao: 'Placa indelével do fabricante da estrutura de proteção com número de certificação intacto.',
              grupoInspecao: 'Cabine e Dispositivos de Proteção (ROPS/FOPS)',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Documento',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ISO 3471 (ROPS) e ISO 3449 (FOPS)', itemRequisito: 'Estrutura de proteção na cabine' }
            },
            {
              codigo: 'TER-01-003',
              descricao: 'Cinto de Segurança de Três Pontos / Abdominal e Assento com Amortecimento',
              criterioInspecao: 'Presença, fixação rígida e travamento mecânico eficaz do cinto de segurança.',
              grupoInspecao: 'Cabine e Dispositivos de Proteção (ROPS/FOPS)',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Teste funcional',
              criticidadePadrao: 'Alta',
              referenciaNormativa: { norma: 'NR-12 e NR-18', itemRequisito: 'Cinto de segurança obrigatório' }
            },
            {
              codigo: 'TER-01-004',
              descricao: 'Sistema Hidráulico — Vazamentos em Mangueiras, Válvulas e Cilindros',
              criterioInspecao: 'Sem gotejamento de fluido pressurizado, abrasão em tramas de aço ou danos nas hastes cromadas.',
              grupoInspecao: 'Sistema Hidráulico e Cilindros',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Inspeção visual',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'NR-12', itemRequisito: 'Sistemas hidráulicos sob pressão' }
            },
            {
              codigo: 'TER-01-005',
              descricao: 'Alarme Sonoro de Marcha à Ré e Giroflex Luminoso Sincronizados',
              criterioInspecao: 'Acionamento automático do sinal sonoro (> 90 dB(A) a 1 metro) ao engatar a ré.',
              grupoInspecao: 'Sinalização e Segurança',
              resultado: 'CONFORME',
              campoMedicao: { unidade: 'dB(A)', valorMinimo: 90, valorEncontrado: 94, instrumentoUtilizado: 'Decibelímetro Calibrado' },
              evidenciaDocumental: 'Teste funcional',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'NR-11 e NR-18', itemRequisito: 'Alarme sonoro de ré e sinalizador' }
            }
          ]
        }
      ]
    },
    {
      id: 'sub-mestre-3-2',
      codigo: '3.2',
      nome: 'Movimentação de Carga e Elevação',
      tiposAtivos: ['Empilhadeira', 'Manipulador telescópico', 'PEMT', 'PTA', 'Plataforma elevatória'],
      tiposLaudo: [
        {
          id: 'tl-3-2-empilhadeira',
          codigo: 'L-ELEV-MOVE',
          nome: 'Laudo de Inspeção e Conformidade de Empilhadeiras e Plataformas Elevatórias',
          normasRef: 'NR-11, NR-12, ABNT NBR 16858, NBR ISO 16368',
          tiposAtivos: ['Empilhadeira', 'Manipulador telescópico', 'Plataforma elevatória'],
          gruposInspecao: ['Torre e Garfos / Cesto Aéreo', 'Correntes de Elevação e Cabos', 'Freios e Direção', 'Dispositivos de Segurança e Parada'],
          itens: [
            {
              codigo: 'ELEV-02-001',
              descricao: 'Desgaste Dimensional dos Garfos da Empilhadeira (Espessura no Calcanhar)',
              criterioInspecao: 'Descarte imediato se o desgaste no calcanhar exceder 10% da espessura original.',
              grupoInspecao: 'Torre e Garfos / Cesto Aéreo',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'mm', valorMinimo: 45, valorEncontrado: 48.5, instrumentoUtilizado: 'Paquímetro Calibrado' },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ISO 5057 / ABNT NBR 11', itemRequisito: 'Critério de desgaste dos garfos' }
            },
            {
              codigo: 'ELEV-02-002',
              descricao: 'Correntes de Elevação — Alongamento Máximo Admissível',
              criterioInspecao: 'Alongamento medido no trecho mais desgastado não pode exceder 3% do passo nominal.',
              grupoInspecao: 'Correntes de Elevação e Cabos',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: '%', valorMaximo: 3.0, valorEncontrado: 1.2, instrumentoUtilizado: 'Cálibre de Corrente' },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ISO 4347', itemRequisito: 'Alongamento de correntes de içamento' }
            },
            {
              codigo: 'ELEV-02-003',
              descricao: 'Válvula de Segurança contra Ruptura de Mangueira nos Cilindros de Elevação',
              criterioInspecao: 'Válvula de contrabalanço/paraquedas hidráulico impedindo queda do mastro em caso de perda de pressão.',
              grupoInspecao: 'Dispositivos de Segurança e Parada',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Teste funcional',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'NR-11 e NR-12', itemRequisito: 'Prevenção de queda do conjunto elevatório' }
            }
          ]
        }
      ]
    },
    {
      id: 'sub-mestre-3-3',
      codigo: '3.3',
      nome: 'Pavimentação e Compactação',
      tiposAtivos: ['Rolo compactador', 'Vibroacabadora', 'Fresadora', 'Compactador'],
      tiposLaudo: [
        {
          id: 'tl-3-3-pav',
          codigo: 'L-PAV-COMPACT',
          nome: 'Laudo de Inspeção Mecânica de Equipamentos de Pavimentação',
          normasRef: 'NR-11, NR-12, ABNT NBR ISO 3471',
          gruposInspecao: ['Chassi e Tambor Vibratório', 'Sistema Motor e Transmissão', 'Freios e Direção Articulada'],
          itens: [
            {
              codigo: 'PAV-03-001',
              descricao: 'Mancais e Sistema Excitador Vibratório do Tambor Compactador',
              criterioInspecao: 'Ausência de ruídos metálicos anormais, vazamento de óleo ou trincas na carcaça.',
              grupoInspecao: 'Chassi e Tambor Vibratório',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Inspeção visual',
              criticidadePadrao: 'Alta',
              referenciaNormativa: { norma: 'NR-12', itemRequisito: 'Sistemas dinâmicos vibratórios' }
            }
          ]
        }
      ]
    },
    {
      id: 'sub-mestre-3-4',
      codigo: '3.4',
      nome: 'Guindastes e Equipamentos de Guindagem',
      tiposAtivos: ['Munck', 'Guindaste articulado', 'Guindaste telescópico', 'Guindaste autopropelido'],
      tiposLaudo: [
        {
          id: 'tl-3-4-guindaste',
          codigo: 'L-GUIND-CARGA',
          nome: 'Laudo de Inspeção Estrutural, LMI e Teste de Carga de Guindaste',
          normasRef: 'NR-11, NR-12, ABNT NBR 14768 (Munck), ASME B30.5',
          gruposInspecao: ['Sapatas Estabilizadoras e Subchassi', 'Lança e Seções Telescópicas', 'Cabo de Aço, Moitão e Gancho', 'Limitador de Momento de Carga (LMI) e Sensores'],
          itens: [
            {
              codigo: 'GUI-04-001',
              descricao: 'Válvula de Retenção Pilotada nas Sapatas Estabilizadoras (Patolas)',
              criterioInspecao: 'Impossibilidade de recolhimento acidental da sapata mesmo em caso de rompimento de mangueira.',
              grupoInspecao: 'Sapatas Estabilizadoras e Subchassi',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Teste funcional',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ABNT NBR 14768 / ASME B30.5', itemRequisito: 'Travamento de estabilizadores' }
            },
            {
              codigo: 'GUI-04-002',
              descricao: 'Limitador de Momento de Carga (LMI) — Corte Automático de Movimentos Agravantes',
              criterioInspecao: 'Corte elétrico/hidráulico ao atingir 100% da curva de carga do fabricante.',
              grupoInspecao: 'Limitador de Momento de Carga (LMI) e Sensores',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Teste funcional',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ASME B30.5 e NR-11', itemRequisito: 'Limitador de momento de carga' }
            },
            {
              codigo: 'GUI-04-003',
              descricao: 'Abertura da Garganta do Gancho e Trava de Segurança',
              criterioInspecao: 'Descarte se a abertura da garganta exceder 5% a 10% da cota original do fabricante.',
              grupoInspecao: 'Cabo de Aço, Moitão e Gancho',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'mm', valorMaximo: 72, valorEncontrado: 68.5, instrumentoUtilizado: 'Paquímetro Digital' },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'DIN 15401 / ASME B30.10', itemRequisito: 'Critério de descarte de gancho' }
            }
          ]
        }
      ]
    }
  ]
};

// ============================================================================
// CATEGORIA 4: ENGENHARIA VEICULAR
// ============================================================================
export const CATEGORIA_4_VEICULAR: CategoriaMestreDef = {
  numero: 4,
  id: 'cat-mestre-4',
  nome: 'Engenharia Veicular',
  icone: 'Car',
  descricao: 'Inspeções de frotas operacionais, segurança veicular (CONTRAN), perícias de acidentes e laudos de reclassificação de monta.',
  subcategorias: [
    {
      id: 'sub-mestre-4-1',
      codigo: '4.1',
      nome: 'Inspeção de Frota e Segurança Veicular',
      tiposLaudo: [
        {
          id: 'tl-4-1-frota',
          codigo: 'L-FROTA-SEG',
          nome: 'Laudo de Inspeção de Frota Operacional e Segurança Veicular',
          normasRef: 'Resoluções do CONTRAN, ABNT NBR 14040',
          gruposInspecao: ['Pneus e Rodas', 'Sistema de Freios e ABS', 'Direção e Suspensão', 'Iluminação e Sinalização', 'Itens Obrigatórios de Segurança'],
          itens: [
            {
              codigo: 'VEI-01-001',
              descricao: 'Profundidade dos Sulcos dos Pneus (Indicador TWI)',
              criterioInspecao: 'Profundidade mínima do sulco não inferior a 1,6 mm na área de banda de rodagem.',
              grupoInspecao: 'Pneus e Rodas',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'mm', valorMinimo: 1.6, valorEncontrado: 4.2, instrumentoUtilizado: 'Profundímetro de Pneus Calibrado' },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'Resolução CONTRAN 558/80', itemRequisito: 'Profundidade mínima de sulco' }
            },
            {
              codigo: 'VEI-01-002',
              descricao: 'Eficiência de Frenagem e Desequilíbrio por Eixo (Frenômetro de Rolos)',
              criterioInspecao: 'Eficiência total $\\ge 50\\%$ e desequilíbrio entre rodas do mesmo eixo $\\le 20\\%$.',
              grupoInspecao: 'Sistema de Freios e ABS',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: '%', valorMinimo: 50, valorEncontrado: 68, instrumentoUtilizado: 'Frenômetro Dinâmico Homologado' },
              evidenciaDocumental: 'Ensaio',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ABNT NBR 14040', itemRequisito: 'Ensaio de frenagem veicular' }
            }
          ]
        }
      ]
    },
    {
      id: 'sub-mestre-4-2',
      codigo: '4.2',
      nome: 'Perícias Veiculares e Modificações',
      tiposLaudo: [
        {
          id: 'tl-4-2-monta',
          codigo: 'L-PERIC-MONTA',
          nome: 'Laudo Pericial de Reclassificação de Monta (Pequena / Média / Grande)',
          normasRef: 'Resolução CONTRAN 810/2020',
          gruposInspecao: ['Alinhamento Estrutural e Longarinas', 'Habitáculo e Colunas', 'Airbags e Pretensionadores'],
          itens: [
            {
              codigo: 'VEI-02-001',
              descricao: 'Inspeção de Longarinas Dianteiras e Traseiras — Trincas, Cortes e Deformações Plásticas',
              criterioInspecao: 'Avaliar zonas de deformação programada e integridade das soldas estruturais de fábrica.',
              grupoInspecao: 'Alinhamento Estrutural e Longarinas',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Inspeção visual',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'Resolução CONTRAN 810/2020', itemRequisito: 'Anexo I - Classificação de Danos' }
            }
          ]
        }
      ]
    }
  ]
};
