import { CategoriaMestreDef } from '../../types';

// ============================================================================
// CATEGORIA 9: VASOS, TANQUES E REDES DE FLUIDOS
// ============================================================================
export const CATEGORIA_9_VASOS_TUBULACOES: CategoriaMestreDef = {
  numero: 9,
  id: 'cat-mestre-9',
  nome: 'Vasos, Tanques e Redes de Fluidos',
  icone: 'Boxes',
  descricao: 'Tubulações industriais (ar comprimido, vapor, amônia, água gelada), testes hidrostáticos e medição de espessura para mapeamento de corrosão.',
  subcategorias: [
    {
      id: 'sub-mestre-9-1',
      codigo: '9.1',
      nome: 'Tubulações e Redes Industriais de Fluidos',
      tiposLaudo: [
        {
          id: 'tl-9-1-tubo',
          codigo: 'L-TUB-ESTANQ',
          nome: 'Laudo de Estanqueidade e Pressão Hidrostática em Tubulações Industriais',
          normasRef: 'ASME B31.3, ASME B31.1, NR-13',
          gruposInspecao: ['Identificação e Sentido de Fluxo', 'Juntas Flangeadas e Suportação', 'Ensaio de Pressão Hidrostática'],
          itens: [
            {
              codigo: 'TUB-01-001',
              descricao: 'Identificação de Fluido e Sentido de Fluxo nas Tubulações',
              criterioInspecao: 'Pintura padrão conforme cor de segurança e setas de fluxo a cada 15 metros.',
              grupoInspecao: 'Identificação e Sentido de Fluxo',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Inspeção visual',
              criticidadePadrao: 'Alta',
              referenciaNormativa: { norma: 'ABNT NBR 6493 e NR-26', itemRequisito: 'Cores para identificação de tubulações' }
            },
            {
              codigo: 'TUB-01-002',
              descricao: 'Pressão de Teste Hidrostático (1,5 × Pressão de Projeto)',
              criterioInspecao: 'Manutenção da pressão estática sem queda durante o tempo de patamar mínimo.',
              grupoInspecao: 'Ensaio de Pressão Hidrostática',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'bar', valorMinimo: 15, valorEncontrado: 15.2, instrumentoUtilizado: 'Bomba de Teste e Manômetro Calibrado' },
              evidenciaDocumental: 'Ensaio',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ASME B31.3', itemRequisito: 'Requisitos de ensaio hidrostático' }
            },
            {
              codigo: 'TUB-01-003',
              descricao: 'Queda de Pressão Durante o Tempo de Patamar',
              criterioInspecao: 'Queda de pressão zero (0,0 bar) após 30 a 60 minutos de estabilização térmica.',
              grupoInspecao: 'Ensaio de Pressão Hidrostática',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'bar', valorMaximo: 0, valorEncontrado: 0 },
              evidenciaDocumental: 'Ensaio',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ASME B31.3', itemRequisito: 'Critério de aceitação de vazamento nulo' }
            }
          ]
        }
      ]
    },
    {
      id: 'sub-mestre-9-2',
      codigo: '9.2',
      nome: 'Corrosão e Medição de Espessura',
      tiposLaudo: [
        {
          id: 'tl-9-2-espessura',
          codigo: 'L-MAP-CORROSAO',
          nome: 'Laudo de Medição de Espessura e Mapeamento de Corrosão em Tanques e Tubulações',
          normasRef: 'API 653, API 570, ASME Seção V',
          gruposInspecao: ['Costado de Tanques', 'Fundo e Chapas Anulares', 'Tubulações Críticas'],
          itens: [
            {
              codigo: 'COR-02-001',
              descricao: 'Espessura Mínima Encontrada no Costado (mm)',
              criterioInspecao: 'Comparar com a espessura mínima admissível calculada por anel conforme API 653.',
              grupoInspecao: 'Costado de Tanques',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'mm', valorMinimo: 6.35, valorEncontrado: 7.8, instrumentoUtilizado: 'Medidor de Espessura US com Calibração RBC' },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'API 653', itemRequisito: 'Espessura mínima de costado' }
            },
            {
              codigo: 'COR-02-002',
              descricao: 'Taxa de Corrosão Anual Estimada (mm/ano) e Vida Útil Remanescente',
              criterioInspecao: 'Cálculo analítico entre espessura nominal de projeto e a menor medida atual.',
              grupoInspecao: 'Costado de Tanques',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'mm/ano', valorMaximo: 0.15, valorEncontrado: 0.08 },
              evidenciaDocumental: 'Documento',
              criticidadePadrao: 'Alta',
              referenciaNormativa: { norma: 'API 570 / API 653', itemRequisito: 'Determinação de vida remanescente' }
            }
          ]
        }
      ]
    }
  ]
};

// ============================================================================
// CATEGORIA 10: PERÍCIAS MECÂNICAS E ANÁLISE DE FALHAS
// ============================================================================
export const CATEGORIA_10_PERICIAS_MECANICAS: CategoriaMestreDef = {
  numero: 10,
  id: 'cat-mestre-10',
  nome: 'Perícias Mecânicas e Análise de Falhas',
  icone: 'SearchCheck',
  descricao: 'Perícias judiciais e extrajudiciais, metalurgia forense, análise de causa raiz (RCA) e engenharia de avaliações patrimoniais (NBR 14653).',
  subcategorias: [
    {
      id: 'sub-mestre-10-1',
      codigo: '10.1',
      nome: 'Metalurgia Forense e Análise de Quebras Mecânicas',
      tiposLaudo: [
        {
          id: 'tl-10-1-falha',
          codigo: 'L-RCA-FALHA',
          nome: 'Laudo Pericial de Análise de Falha Mecânica e Fratografia (RCA)',
          normasRef: 'ASM Handbook Vol. 11 (Failure Analysis), ASTM E3',
          gruposInspecao: ['Identificação e Histórico de Carga', 'Morfologia da Superfície de Fratura', 'Ensaios Metalográficos e Dureza'],
          itens: [
            {
              codigo: 'FAL-01-001',
              descricao: 'Identificação do Mecanismo Primário de Falha (Fadiga, Sobrecarga Frágil/Dúctil, Corrosão)',
              criterioInspecao: 'Inspeção macroscópica e microscópica com caracterização de marcas de catraca e estrias de praia.',
              grupoInspecao: 'Morfologia da Superfície de Fratura',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Inspeção visual',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ASM Handbook Vol. 11', itemRequisito: 'Mecanismos de falha por fadiga mecânica' }
            },
            {
              codigo: 'FAL-01-002',
              descricao: 'Ensaio de Dureza Rockwell / Brinell no Núcleo e Superfície',
              criterioInspecao: 'Verificar conformidade com a especificação do aço e tratamento térmico (têmpera/revenimento).',
              grupoInspecao: 'Ensaios Metalográficos e Dureza',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'HRC', valorMinimo: 42, valorMaximo: 48, valorEncontrado: 45, instrumentoUtilizado: 'Durômetro Portátil Calibrado' },
              evidenciaDocumental: 'Ensaio',
              criticidadePadrao: 'Alta',
              referenciaNormativa: { norma: 'ASTM E18 / ABNT NBR NM ISO 6508', itemRequisito: 'Dureza Rockwell' }
            }
          ]
        }
      ]
    },
    {
      id: 'sub-mestre-10-2',
      codigo: '10.2',
      nome: 'Engenharia de Avaliações de Máquinas e Ativos',
      tiposLaudo: [
        {
          id: 'tl-10-2-aval',
          codigo: 'L-AVAL-PATRIM',
          nome: 'Laudo de Avaliação de Máquinas, Equipamentos e Vida Útil (NBR 14653-5)',
          normasRef: 'ABNT NBR 14653-5',
          gruposInspecao: ['Identificação e Cadastro', 'Estado de Conservação e Depreciação (Causa-Ross)', 'Determinação do Valor de Mercado'],
          itens: [
            {
              codigo: 'AVA-02-001',
              descricao: 'Estado de Conservação e Fator de Depreciação Física (Tabela de Heidecke / Ross)',
              criterioInspecao: 'Avaliação da idade cronológica ponderada versus idade aparente e conservação.',
              grupoInspecao: 'Estado de Conservação e Depreciação (Causa-Ross)',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: '%', valorMinimo: 0, valorMaximo: 100, valorEncontrado: 35 },
              evidenciaDocumental: 'Documento',
              criticidadePadrao: 'Media',
              referenciaNormativa: { norma: 'ABNT NBR 14653-5', itemRequisito: 'Critérios de depreciação' }
            }
          ]
        }
      ]
    }
  ]
};

// ============================================================================
// CATEGORIA 11: GRUPOS GERADORES E MÁQUINAS TÉRMICAS
// ============================================================================
export const CATEGORIA_11_GERADORES: CategoriaMestreDef = {
  numero: 11,
  id: 'cat-mestre-11',
  nome: 'Grupos Geradores e Máquinas Térmicas',
  icone: 'Zap',
  descricao: 'Conformidade de grupos moto-geradores a diesel/gás, testes com banco de carga resistiva e sistemas de transferência automática (QTA).',
  subcategorias: [
    {
      id: 'sub-mestre-11-1',
      codigo: '11.1',
      nome: 'Grupos Geradores Estacionários',
      tiposLaudo: [
        {
          id: 'tl-11-1-gerador',
          codigo: 'L-GERADOR-TEST',
          nome: 'Laudo de Inspeção e Teste de Carga em Grupo Gerador e QTA',
          normasRef: 'ABNT NBR ISO 8528, NBR 5410, NR-10, NR-20',
          gruposInspecao: ['Motor Diesel e Arrefecimento', 'Alternador e Painel de Controle', 'Quadro de Transferência Automática (QTA)', 'Teste com Banco de Carga Resistivo'],
          itens: [
            {
              codigo: 'GER-01-001',
              descricao: 'Bacia de Contenção de Combustível e Abastecimento Seguro',
              criterioInspecao: 'Contenção estanque com capacidade mínima para 110% do volume do tanque diário.',
              grupoInspecao: 'Motor Diesel e Arrefecimento',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Inspeção visual',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'NR-20 e ABNT NBR 17505', itemRequisito: 'Bacia de contenção de inflamáveis' }
            },
            {
              codigo: 'GER-01-002',
              descricao: 'Frequência Elétrica Estável sob Carga Nominal (Hz)',
              criterioInspecao: 'Manter 60 Hz com variação máxima de ±0,5 Hz do vazio a 100% de carga.',
              grupoInspecao: 'Teste com Banco de Carga Resistivo',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'Hz', valorMinimo: 59.5, valorMaximo: 60.5, valorEncontrado: 60.1, instrumentoUtilizado: 'Analisador de Energia Calibrado' },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ABNT NBR ISO 8528-5', itemRequisito: 'Estabilidade de frequência' }
            },
            {
              codigo: 'GER-01-003',
              descricao: 'Tempo de Partida, Comutação e Assunção de Carga pelo QTA (segundos)',
              criterioInspecao: 'Comutação completa em menos de 10 a 15 segundos após a queda da rede da concessionária.',
              grupoInspecao: 'Quadro de Transferência Automática (QTA)',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 's', valorMaximo: 15, valorEncontrado: 8.5, instrumentoUtilizado: 'Cronômetro Digital' },
              evidenciaDocumental: 'Teste funcional',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'NBR 5410 / NBR 14039', itemRequisito: 'Tempo de transferência de emergência' }
            }
          ]
        }
      ]
    }
  ]
};

// ============================================================================
// CATEGORIA 12: ACESSIBILIDADE, ELEVADORES E ACÚSTICA
// ============================================================================
export const CATEGORIA_12_ACESSIBILIDADE_ACUSTICA: CategoriaMestreDef = {
  numero: 12,
  id: 'cat-mestre-12',
  nome: 'Acessibilidade, Elevadores e Acústica',
  icone: 'Accessibility',
  descricao: 'Elevadores de passageiros (NBR NM 207), acessibilidade arquitetônica (NBR 9050) e ensaios de ruído ambiental e industrial (NBR 10151 / 10152).',
  subcategorias: [
    {
      id: 'sub-mestre-12-1',
      codigo: '12.1',
      nome: 'Elevadores e Transporte Vertical',
      tiposLaudo: [
        {
          id: 'tl-12-1-elevador',
          codigo: 'L-ELEV-PASSAGEIRO',
          nome: 'Laudo de Inspeção e Segurança de Elevador de Passageiros e Plataformas Acessíveis',
          normasRef: 'ABNT NBR NM 207, NBR 16858, NBR 9050',
          gruposInspecao: ['Cabina e Portas de Pavimento', 'Cordoalhas e Sistema de Tração', 'Freio de Segurança e Limitador de Velocidade', 'Casa de Máquinas e Poço'],
          itens: [
            {
              codigo: 'ELV-01-001',
              descricao: 'Intertravamento Elétrico e Mecânico dos Trincos das Portas de Pavimento',
              criterioInspecao: 'Impossibilidade de partida do elevador com qualquer porta entreaberta e bloqueio de abertura sem a cabina no pavimento.',
              grupoInspecao: 'Cabina e Portas de Pavimento',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Teste funcional',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ABNT NBR NM 207', itemRequisito: 'Dispositivos de travamento de portas' }
            },
            {
              codigo: 'ELV-01-002',
              descricao: 'Freio de Segurança (Pára-quedas Mecânico) e Limitador de Velocidade',
              criterioInspecao: 'Travamento imediato das cunhas nas guias em caso de sobrevelocidade descendente.',
              grupoInspecao: 'Freio de Segurança e Limitador de Velocidade',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Teste funcional',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ABNT NBR NM 207', itemRequisito: 'Dispositivo de segurança mecânico' }
            }
          ]
        }
      ]
    },
    {
      id: 'sub-mestre-12-2',
      codigo: '12.2',
      nome: 'Acessibilidade Arquitetônica e Urbanística',
      tiposLaudo: [
        {
          id: 'tl-12-2-acessib',
          codigo: 'L-ACESSIB-9050',
          nome: 'Laudo de Acessibilidade em Edificações Públicas e Coletivas (ABNT NBR 9050)',
          normasRef: 'ABNT NBR 9050, Lei Brasileira de Inclusão (Lei 13.146/2015)',
          gruposInspecao: ['Rotas Acessíveis e Rampas', 'Sanitários Acessíveis', 'Sinalização Tátil e Visual'],
          itens: [
            {
              codigo: 'ACS-02-001',
              descricao: 'Inclinação Longitudinal Máxima das Rampas de Acesso (%)',
              criterioInspecao: 'Inclinação máxima de 8,33% para rampas com desnível superior a 0,80m conforme NBR 9050.',
              grupoInspecao: 'Rotas Acessíveis e Rampas',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: '%', valorMaximo: 8.33, valorEncontrado: 6.8, instrumentoUtilizado: 'Inclinômetro Digital Calibrado' },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ABNT NBR 9050', itemRequisito: 'Tabela 6 - Dimensionamento de rampas' }
            },
            {
              codigo: 'ACS-02-002',
              descricao: 'Sanitário Acessível — Barras de Apoio e Raio de Giro Livre para Cadeira de Rodas (1,50 m)',
              criterioInspecao: 'Raio de rotação de 360° livre de obstáculos com diâmetro $\\ge 1{,}50\\text{ m}$.',
              grupoInspecao: 'Sanitários Acessíveis',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'm', valorMinimo: 1.5, valorEncontrado: 1.55 },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Alta',
              referenciaNormativa: { norma: 'ABNT NBR 9050', itemRequisito: 'Sanitários e vestiários acessíveis' }
            }
          ]
        }
      ]
    },
    {
      id: 'sub-mestre-12-3',
      codigo: '12.3',
      nome: 'Ruído e Vibração Ambiental e Industrial',
      tiposLaudo: [
        {
          id: 'tl-12-3-ruido',
          codigo: 'L-RUIDO-VIB',
          nome: 'Laudo de Avaliação de Ruído em Áreas Habitadas e Vibração de Máquinas',
          normasRef: 'ABNT NBR 10151, NBR 10152, ISO 20816',
          gruposInspecao: ['Nível de Pressão Sonora Equivalente (LAeq)', 'Ruído Residual de Fundo', 'Vibração Global RMS em Mancais'],
          itens: [
            {
              codigo: 'RUI-03-001',
              descricao: 'Nível de Pressão Sonora Equivalente Ponderado em A (LAeq)',
              criterioInspecao: 'Comparar com o limite de emissão de ruído (RLAeq) para a zona de uso (diurno/noturno).',
              grupoInspecao: 'Nível de Pressão Sonora Equivalente (LAeq)',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'dB(A)', valorMaximo: 55, valorEncontrado: 51.4, instrumentoUtilizado: 'Medidor de Nível de Pressão Sonora Tipo 1 com Filtro 1/3 Oitava' },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Alta',
              referenciaNormativa: { norma: 'ABNT NBR 10151', edicaoAno: '2019/2020', itemRequisito: 'Limites de níveis de pressão sonora' }
            },
            {
              codigo: 'RUI-03-002',
              descricao: 'Vibração Global Severidade RMS em Mancais de Motores e Bombas',
              criterioInspecao: 'Velocidade de vibração eficaz (mm/s RMS) conforme Classe da máquina (ISO 20816).',
              grupoInspecao: 'Vibração Global RMS em Mancais',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'mm/s', valorMaximo: 4.5, valorEncontrado: 2.3, instrumentoUtilizado: 'Acelerômetro Piezoelétrico Calibrado' },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Alta',
              referenciaNormativa: { norma: 'ISO 20816-1 / ISO 10816', itemRequisito: 'Limites de severidade de vibração' }
            }
          ]
        }
      ]
    }
  ]
};
