import { CategoriaMestreDef } from '../../types';

// ============================================================================
// CATEGORIA 5: CLIMATIZAÇÃO, QUALIDADE DO AR E MANUTENÇÃO
// ============================================================================
export const CATEGORIA_5_HVAC_MANUTENCAO: CategoriaMestreDef = {
  numero: 5,
  id: 'cat-mestre-5',
  nome: 'Climatização, Qualidade do Ar e Manutenção',
  icone: 'Wind',
  descricao: 'Planos PMOC (Lei Federal 13.589/2018), análise psicrométrica e microbiológica do ar climatizado, e auditoria de gestão de ativos/PCM.',
  subcategorias: [
    {
      id: 'sub-mestre-5-1',
      codigo: '5.1',
      nome: 'PMOC — Plano de Manutenção, Operação e Controle',
      tiposLaudo: [
        {
          id: 'tl-5-1-pmoc',
          codigo: 'L-PMOC-HVAC',
          nome: 'Laudo e Plano de PMOC para Sistemas de Climatização',
          normasRef: 'Lei 13.589/2018, Portaria MS 3.523/1998, RE 09/2003 ANVISA, ABNT NBR 13971',
          gruposInspecao: ['Unidades Evaporadoras e Serpentinas', 'Unidades Condensadoras e Compressores', 'Filtragem e Qualidade do Ar', 'Drenagem e Bandejas'],
          itens: [
            {
              codigo: 'HVAC-01-001',
              descricao: 'Higienização e Troca de Filtros de Ar (G3/G4 / F7/F8)',
              criterioInspecao: 'Ausência de colmatação, acúmulo de poeira e registros periódicos de troca de elementos filtrantes.',
              grupoInspecao: 'Filtragem e Qualidade do Ar',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Inspeção visual',
              criticidadePadrao: 'Alta',
              referenciaNormativa: { norma: 'Portaria MS 3.523/98 e NBR 16101', itemRequisito: 'Manutenção de filtros de ar' }
            },
            {
              codigo: 'HVAC-01-002',
              descricao: 'Bandejas de Condensado — Caimento, Drenagem e Ausência de Água Estagnada',
              criterioInspecao: 'Drenagem por gravidade desobstruída com sifão e pastilhas biocidas contra proliferação bacteriana.',
              grupoInspecao: 'Drenagem e Bandejas',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Inspeção visual',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'Portaria MS 3.523/98', itemRequisito: 'Prevenção de biofilme e Legionella' }
            },
            {
              codigo: 'HVAC-01-003',
              descricao: 'Temperatura Operacional de Bulbo Seco (°C)',
              criterioInspecao: 'Faixa regulamentar de conforto térmico: 23 °C a 26 °C no verão e 20 °C a 22 °C no inverno.',
              grupoInspecao: 'Filtragem e Qualidade do Ar',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: '°C', valorMinimo: 23, valorMaximo: 26, valorEncontrado: 24.2, instrumentoUtilizado: 'Termo-Higrômetro Calibrado' },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Media',
              referenciaNormativa: { norma: 'Resolução RE 09/2003 ANVISA', itemRequisito: 'Padrões referenciais de temperatura' }
            },
            {
              codigo: 'HVAC-01-004',
              descricao: 'Umidade Relativa do Ar Operacional (%)',
              criterioInspecao: 'Faixa recomendada de 40% a 65% de umidade relativa.',
              grupoInspecao: 'Filtragem e Qualidade do Ar',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: '%', valorMinimo: 40, valorMaximo: 65, valorEncontrado: 54, instrumentoUtilizado: 'Termo-Higrômetro' },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Media',
              referenciaNormativa: { norma: 'Resolução RE 09/2003 ANVISA', itemRequisito: 'Padrão referencial de umidade' }
            },
            {
              codigo: 'HVAC-01-005',
              descricao: 'Concentração de Dióxido de Carbono (CO₂) em Ambientes Climatizados',
              criterioInspecao: 'Concentração de CO₂ interior não superior a 1.000 ppm como indicador de renovação de ar.',
              grupoInspecao: 'Filtragem e Qualidade do Ar',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'ppm', valorMaximo: 1000, valorEncontrado: 680, instrumentoUtilizado: 'Analisador de CO₂ Calibrado' },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'Resolução RE 09/2003 ANVISA', itemRequisito: 'Limite máximo de dióxido de carbono' }
            }
          ]
        }
      ]
    },
    {
      id: 'sub-mestre-5-2',
      codigo: '5.2',
      nome: 'Gestão de Manutenção e Auditoria de Ativos',
      tiposLaudo: [
        {
          id: 'tl-5-2-pcm',
          codigo: 'L-AUD-PCM',
          nome: 'Laudo de Auditoria de PCM, Disponibilidade e Maturidade de Ativos',
          normasRef: 'ABNT NBR 5462 (Confiabilidade), NBR ISO 55001 (Gestão de Ativos)',
          gruposInspecao: ['Planejamento e Controle (PCM)', 'Indicadores (MTBF / MTTR / Backlog)', 'Matriz de Criticidade e RCM'],
          itens: [
            {
              codigo: 'PCM-02-001',
              descricao: 'Tempo Médio Entre Falhas (MTBF - Mean Time Between Failures)',
              criterioInspecao: 'Verificar se o MTBF atinge a meta estipulada no plano diretor da planta.',
              grupoInspecao: 'Indicadores (MTBF / MTTR / Backlog)',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'horas', valorMinimo: 350, valorEncontrado: 480 },
              evidenciaDocumental: 'Documento',
              criticidadePadrao: 'Media',
              referenciaNormativa: { norma: 'ABNT NBR 5462', itemRequisito: 'Cálculo de MTBF' }
            },
            {
              codigo: 'PCM-02-002',
              descricao: 'Backlog de Ordens de Serviço de Manutenção Mecânica',
              criterioInspecao: 'Volume de trabalho pendente mantido entre 2 e 4 semanas de homem-hora disponível.',
              grupoInspecao: 'Indicadores (MTBF / MTTR / Backlog)',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'semanas', valorMinimo: 2, valorMaximo: 4, valorEncontrado: 2.8 },
              evidenciaDocumental: 'Documento',
              criticidadePadrao: 'Media',
              referenciaNormativa: { norma: 'ABNT NBR 5462', itemRequisito: 'Indicadores de produtividade de manutenção' }
            }
          ]
        }
      ]
    }
  ]
};

// ============================================================================
// CATEGORIA 6: PLAYGROUND E LAZER
// ============================================================================
export const CATEGORIA_6_PLAYGROUND: CategoriaMestreDef = {
  numero: 6,
  id: 'cat-mestre-6',
  nome: 'Playground e Lazer',
  icone: 'Smile',
  descricao: 'Inspeção de conformidade técnica e pericial para áreas recreativas infantis conforme as normas ABNT NBR 16071 (Partes 1 a 7).',
  subcategorias: [
    {
      id: 'sub-mestre-6-1',
      codigo: '6.1',
      nome: 'Segurança em Áreas de Recreação Infantil',
      tiposLaudo: [
        {
          id: 'tl-6-1-play',
          codigo: 'L-PLAY-16071',
          nome: 'Laudo Técnico de Inspeção e Segurança de Playground (ABNT NBR 16071)',
          normasRef: 'ABNT NBR 16071 (Partes 1 a 7)',
          gruposInspecao: ['Piso e Superfície de Absorção de Impacto', 'Prevenção de Aprisionamento e Queda', 'Integridade Estrutural e Materiais', 'Sinalização e Faixa Etária'],
          itens: [
            {
              codigo: 'PLY-01-001',
              descricao: 'Piso Absorvedor de Impacto e Altura Livre de Queda (HIC)',
              criterioInspecao: 'Piso emborrachado ou caixa de areia/areia lavada com espessura compatível com a altura do brinquedo mais alto.',
              grupoInspecao: 'Piso e Superfície de Absorção de Impacto',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'mm', valorMinimo: 300, valorEncontrado: 320, instrumentoUtilizado: 'Trena e Medidor de Camada' },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ABNT NBR 16071-3', itemRequisito: 'Superfícies de amortecimento de impacto' }
            },
            {
              codigo: 'PLY-01-002',
              descricao: 'Ensaio de Sondas de Aprisionamento de Cabeça e Pescoço',
              criterioInspecao: 'Gabarito normativo: aberturas entre 130 mm e 225 mm são estritamente proibidas a partir de 600 mm de altura.',
              grupoInspecao: 'Prevenção de Aprisionamento e Queda',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Ensaio',
              criticidadePadrao: 'Critica',
              recomendacaoPadrao: 'Adequar ou fechar imediatamente aberturas que permitam passagem do tronco com retenção da cabeça.',
              referenciaNormativa: { norma: 'ABNT NBR 16071-2', itemRequisito: 'Sondas de torso e cabeça' }
            },
            {
              codigo: 'PLY-01-003',
              descricao: 'Aprisionamento de Dedos em Aberturas e Frestas Circulares',
              criterioInspecao: 'Aberturas entre 8 mm e 25 mm a mais de 1 metro do solo são proibidas.',
              grupoInspecao: 'Prevenção de Aprisionamento e Queda',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Ensaio',
              criticidadePadrao: 'Alta',
              referenciaNormativa: { norma: 'ABNT NBR 16071-2', itemRequisito: 'Gabarito de dedos de 8 a 25 mm' }
            },
            {
              codigo: 'PLY-01-004',
              descricao: 'Balanços — Espaçamento Mínimo Entre Assentos e Elos das Correntes',
              criterioInspecao: 'Elos com diâmetro interno $\\le 8{,}6\\text{ mm}$ para evitar aprisionamento de pontas dos dedos.',
              grupoInspecao: 'Integridade Estrutural e Materiais',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Alta',
              referenciaNormativa: { norma: 'ABNT NBR 16071-2', itemRequisito: 'Especificação de correntes de balanços' }
            },
            {
              codigo: 'PLY-01-005',
              descricao: 'Placa de Sinalização Visível com Faixa Etária, Capacidade e Telefone de Emergência',
              criterioInspecao: 'Presença de sinalização indelével contendo indicação de idade dos usuários e contatos de socorro.',
              grupoInspecao: 'Sinalização e Faixa Etária',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Inspeção visual',
              criticidadePadrao: 'Media',
              referenciaNormativa: { norma: 'ABNT NBR 16071-7', itemRequisito: 'Informações ao usuário' }
            }
          ]
        }
      ]
    }
  ]
};

// ============================================================================
// CATEGORIA 7: ESTRUTURAS METÁLICAS, CALDEIRARIA E SOLDAGEM
// ============================================================================
export const CATEGORIA_7_ESTRUTURAS_SOLDA: CategoriaMestreDef = {
  numero: 7,
  id: 'cat-mestre-7',
  nome: 'Estruturas Metálicas, Caldeiraria e Soldagem',
  icone: 'Hammer',
  descricao: 'Laudos de integridade de galpões, coberturas, mezaninos e qualificação pericial de juntas soldadas e Ensaios Não Destrutivos (END).',
  subcategorias: [
    {
      id: 'sub-mestre-7-1',
      codigo: '7.1',
      nome: 'Estruturas e Galpões Metálicos',
      tiposLaudo: [
        {
          id: 'tl-7-1-galpao',
          codigo: 'L-ESTRUT-GALPAO',
          nome: 'Laudo de Integridade Estrutural de Galpão e Coberturas Metálicas',
          normasRef: 'ABNT NBR 8800, NBR 14762, NBR 6123 (Vento)',
          gruposInspecao: ['Pilares e Placas de Base', 'Vigas, Terças e Treliças', 'Contraventamentos e Travamentos', 'Ligações Parafusadas e Soldadas'],
          itens: [
            {
              codigo: 'EST-01-001',
              descricao: 'Placas de Base e Chumbadores dos Pilares Metálicos',
              criterioInspecao: 'Presença de porca e contraporca com aperto nominal, ausência de corrosão e integridade do graute.',
              grupoInspecao: 'Pilares e Placas de Base',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Inspeção visual',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ABNT NBR 8800', itemRequisito: 'Fixação de bases de pilares' }
            },
            {
              codigo: 'EST-01-002',
              descricao: 'Medição de Flecha Vertical no Vão Central de Vigas e Treliças',
              criterioInspecao: 'Flecha máxima em serviço limitada a L/350 para vigas com piso ou sobrecarga.',
              grupoInspecao: 'Vigas, Terças e Treliças',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'mm', valorMaximo: 45, valorEncontrado: 22, instrumentoUtilizado: 'Nível Óptico Laser' },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ABNT NBR 8800 / NBR 14762', itemRequisito: 'Deslocamentos limites de flecha' }
            },
            {
              codigo: 'EST-01-003',
              descricao: 'Contraventamentos Horizontais e Verticais (Tirantes X)',
              criterioInspecao: 'Esticamento adequado sem folga ou empenamento das barras redondas/cantoneiras.',
              grupoInspecao: 'Contraventamentos e Travamentos',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Inspeção visual',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ABNT NBR 8800', itemRequisito: 'Estabilidade global de galpões' }
            }
          ]
        },
        {
          id: 'tl-7-1-mezanino',
          codigo: 'L-MEZAN-PISO',
          nome: 'Laudo de Capacidade de Carga de Mezanino e Piso Industrial',
          normasRef: 'ABNT NBR 8800, NBR 6120, NBR 14718',
          gruposInspecao: ['Sobrecarga Homologada', 'Guarda-Corpo e Rodapés', 'Sinalização de Carga Máxima'],
          itens: [
            {
              codigo: 'EST-01-020',
              descricao: 'Carga Acidental Admissível Homologada em Projeto (kgf/m²)',
              criterioInspecao: 'Conferência analítica do limite de resistência das vigas secundárias e laje.',
              grupoInspecao: 'Sobrecarga Homologada',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'kgf/m²', valorMinimo: 300, valorEncontrado: 500 },
              evidenciaDocumental: 'Documento',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ABNT NBR 6120', itemRequisito: 'Tabela de sobrecargas de utilização' }
            }
          ]
        }
      ]
    },
    {
      id: 'sub-mestre-7-2',
      codigo: '7.2',
      nome: 'Soldagem e Ensaios Não Destrutivos (END)',
      tiposLaudo: [
        {
          id: 'tl-7-2-solda-vt',
          codigo: 'L-SOLDA-VT-END',
          nome: 'Laudo de Inspeção Visual e Ensaios Não Destrutivos de Juntas Soldadas',
          normasRef: 'AWS D1.1, ASME Seção V, ABNT NBR ISO 9712',
          gruposInspecao: ['Inspeção Visual e Dimensional (VT)', 'Líquido Penetrante (LP)', 'Partículas Magnéticas (PM)', 'Ultrassom Convencional e Phased Array'],
          itens: [
            {
              codigo: 'SOL-02-001',
              descricao: 'Medição da Perna de Filete (z) e Garganta Efetiva com Gabarito Cambridge',
              criterioInspecao: 'Dimensões mínimas conforme projeto sem concavidade ou convexidade excessiva.',
              grupoInspecao: 'Inspeção Visual e Dimensional (VT)',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'mm', valorMinimo: 6.0, valorEncontrado: 6.5, instrumentoUtilizado: 'Gabarito de Solda Cambridge' },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Alta',
              referenciaNormativa: { norma: 'AWS D1.1', itemRequisito: 'Critérios de perfil de solda em filete' }
            },
            {
              codigo: 'SOL-02-002',
              descricao: 'Detecção de Trincas e Mordeduras (Undercut) nas Juntas Soldadas',
              criterioInspecao: 'Rejeição imediata em caso de trinca de qualquer dimensão; mordedura limitada a 1,0 mm.',
              grupoInspecao: 'Inspeção Visual e Dimensional (VT)',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Ensaio',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'AWS D1.1 / ASME Seção IX', itemRequisito: 'Critério de aceitação de descontinuidades' }
            },
            {
              codigo: 'SOL-02-003',
              descricao: 'Ensaio por Líquido Penetrante (LP) — Revelação de Descontinuidades Superficiais',
              criterioInspecao: 'Ausência de indicações lineares relevantes (trincas, dobras de laminação).',
              grupoInspecao: 'Líquido Penetrante (LP)',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Ensaio',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ABNT NBR NM 334 / ASME V Artigo 6', itemRequisito: 'Ensaio por líquido penetrante' }
            }
          ]
        }
      ]
    }
  ]
};

// ============================================================================
// CATEGORIA 8: EQUIPAMENTOS DE ELEVAÇÃO E MOVIMENTAÇÃO INDUSTRIAL
// ============================================================================
export const CATEGORIA_8_ELEVACAO_INDUSTRIAL: CategoriaMestreDef = {
  numero: 8,
  id: 'cat-mestre-8',
  nome: 'Equipamentos de Elevação e Movimentação Industrial',
  icone: 'Anchor',
  descricao: 'Pontes rolantes, pórticos, talhas elétricas, elevadores de carga, dispositivos de içamento (balancins) e cálculo de SWP.',
  subcategorias: [
    {
      id: 'sub-mestre-8-1',
      codigo: '8.1',
      nome: 'Pontes Rolantes e Pórticos Rolantes',
      tiposLaudo: [
        {
          id: 'tl-8-1-ponte',
          codigo: 'L-PONTE-ROL',
          nome: 'Laudo de Inspeção e Segurança de Ponte Rolante e Pórticos (NR-11 / NBR 8400)',
          normasRef: 'NR-11, ABNT NBR 8400, NBR 16147, ISO 4309',
          gruposInspecao: ['Caminho de Rolamento e Trilhos', 'Cabos de Aço e Moitão', 'Freios de Elevação e Translação', 'Dispositivos Eletromecânicos de Segurança'],
          itens: [
            {
              codigo: 'PNT-01-001',
              descricao: 'Desgaste e Redução do Diâmetro Nominal do Cabo de Aço de Elevação',
              criterioInspecao: 'Descarte imediato do cabo se a redução do diâmetro exceder 7% a 10% do nominal.',
              grupoInspecao: 'Cabos de Aço e Moitão',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'mm', valorMinimo: 14.8, valorEncontrado: 15.6, instrumentoUtilizado: 'Paquímetro com abas largas' },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ISO 4309 / ABNT NBR 16147', itemRequisito: 'Critérios de descarte de cabos de aço' }
            },
            {
              codigo: 'PNT-01-002',
              descricao: 'Chave Fim de Curso Superior de Elevação (Corte Duplo)',
              criterioInspecao: 'Atuação mecânica e elétrica antes que o moitão atinja a estrutura do tambor ou polias.',
              grupoInspecao: 'Dispositivos Eletromecânicos de Segurança',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Teste funcional',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'NR-11 e ABNT NBR 8400', itemRequisito: 'Dispositivo limitador de fim de curso' }
            },
            {
              codigo: 'PNT-01-003',
              descricao: 'Freio do Mecanismo de Elevação — Teste de Sustentação de Carga Nominal',
              criterioInspecao: 'Sustentação estática de 100% a 125% da carga nominal sem deslizamento do freio.',
              grupoInspecao: 'Freios de Elevação e Translação',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Teste funcional',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ABNT NBR 8400', itemRequisito: 'Eficiência de frenagem de elevação' }
            },
            {
              codigo: 'PNT-01-004',
              descricao: 'Cálculo do Período de Trabalho Seguro Consumido (SWP %)',
              criterioInspecao: 'Estimativa baseada no espectro de carga Km e horas acumuladas no horímetro conforme ISO 12482.',
              grupoInspecao: 'Dispositivos Eletromecânicos de Segurança',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: '%', valorMaximo: 100, valorEncontrado: 48 },
              evidenciaDocumental: 'Documento',
              criticidadePadrao: 'Alta',
              referenciaNormativa: { norma: 'ISO 12482 / FEM 9.755', itemRequisito: 'Safe Working Period (SWP)' }
            }
          ]
        }
      ]
    },
    {
      id: 'sub-mestre-8-2',
      codigo: '8.2',
      nome: 'Elevadores de Carga e Dispositivos de Içamento',
      tiposLaudo: [
        {
          id: 'tl-8-2-balancim',
          codigo: 'L-BALANCIM-OLHAL',
          nome: 'Laudo de Dispositivos de Içamento, Balancins e Olhais de Carga',
          normasRef: 'ASME B30.20, ABNT NBR 8400',
          gruposInspecao: ['Identificação e WLL/CMT', 'Dimensional de Olhais e Pinos', 'Soldas e Teste de Sobrecarga'],
          itens: [
            {
              codigo: 'BAL-02-001',
              descricao: 'Placa de Identificação com Carga Máxima de Trabalho (CMT/WLL) e Peso Próprio',
              criterioInspecao: 'Gravação mecânica indelével com capacidade nominal, data de fabricação e número de série.',
              grupoInspecao: 'Identificação e WLL/CMT',
              resultado: 'CONFORME',
              evidenciaDocumental: 'Inspeção visual',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ASME B30.20', itemRequisito: 'Marcação obrigatória' }
            },
            {
              codigo: 'BAL-02-002',
              descricao: 'Ovalização e Desgaste de Furos de Olhais de Içamento',
              criterioInspecao: 'Descarte se o desgaste no ponto de apoio da manilha exceder 5% a 10% do diâmetro nominal.',
              grupoInspecao: 'Dimensional de Olhais e Pinos',
              resultado: 'MEDICAO',
              campoMedicao: { unidade: 'mm', valorMaximo: 36.5, valorEncontrado: 35.4, instrumentoUtilizado: 'Paquímetro Digital' },
              evidenciaDocumental: 'Medição',
              criticidadePadrao: 'Critica',
              referenciaNormativa: { norma: 'ASME B30.20', itemRequisito: 'Tolerâncias de desgaste de furos' }
            }
          ]
        }
      ]
    }
  ]
};
