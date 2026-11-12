export interface SubtipoServico {
  id?: string;
  nome: string;
  normaRef: string;
  detalhe: string;
  checklistSugerido?: string[];
  secoesSugeridas?: string[];
}

export interface ServicoItem {
  id?: string;
  nome: string;
  norma: string;
  descricao: string;
  subtipos: SubtipoServico[];
}

export const SERVICOS_LISTA: ServicoItem[] = [
  {
    id: 'nr12-projetos',
    nome: 'Adequação à NR-12 e projetos mecânicos',
    norma: 'NR-12 · NBR ISO 12100',
    descricao: 'Apreciação de risco, projeto de proteções mecânicas, enclausuramento e documentação técnica oficial.',
    subtipos: [
      {
        id: 'nr12-hrn',
        nome: 'Laudo de Apreciação / Análise de Risco (HRN e NBR ISO 12100)',
        normaRef: 'NR-12 item 12.38 · ISO 12100',
        detalhe: 'Identificação de perigos mecânicos, estimativa de risco quantitativa (HRN) e definição de Categoria de Segurança requerida (PLr).',
        checklistSugerido: [
          'Identificação da máquina (placa, fabricante, número de série e ano)',
          'Delimitação da zona de perigo e pontos de esmagamento/agarramento',
          'Cálculo do Hazard Rating Number (HRN) para cada perigo identificado',
          'Determinação do Performance Level requerido (PLr) conforme ISO 13849',
          'Verificação de botões de emergência e relés de segurança certificados',
          'Plano de ação corretivo e medidas de proteção recomendadas'
        ],
        secoesSugeridas: [
          '1. Identificação da Máquina e Dados Operacionais',
          '2. Levantamento e Inventário de Perigos Mecânicos',
          '3. Apreciação Quantitativa de Risco (Método HRN)',
          '4. Avaliação dos Circuitos e Dispositivos de Emergência',
          '5. Recomendações Técnicas e Plano de Adequação'
        ]
      },
      {
        id: 'nr12-protecoes',
        nome: 'Laudo de Adequação de Proteções Físicas e Intertravamentos',
        normaRef: 'NR-12 Anexos e NBR ISO 13849',
        detalhe: 'Dimensionamento de proteções em policarbonato/chapa, distâncias de segurança e chaves de intertravamento codificadas com bloqueio.',
        checklistSugerido: [
          'Distância de segurança conforme NBR ISO 13857 atendida',
          'Proteções fixas fixadas por elementos que exigem uso de ferramentas',
          'Proteções móveis com chaves de segurança com ruptura positiva',
          'Bloqueio mecânico contra queda gravitacional em prensas/guilhotinas',
          'Sinalização de segurança indelével em português'
        ],
        secoesSugeridas: [
          '1. Diagnóstico das Proteções Existentes',
          '2. Dimensionamento e Distâncias de Segurança (ISO 13857)',
          '3. Especificação das Chaves de Intertravamento e Bloqueio',
          '4. Validação da Eficácia das Barreiras Físicas'
        ]
      },
      {
        id: 'nr12-retrofit',
        nome: 'Laudo de Validação / Retrofit de Segurança em Máquinas',
        normaRef: 'NR-12 · ABNT NBR 14153',
        detalhe: 'Atestação e validação técnica das alterações mecânicas e elétricas implementadas com liberação formal para operação segura.',
        checklistSugerido: [
          'Memorial descritivo da intervenção mecânica e elétrica',
          'Testes funcionais de parada de emergência e tempo de frenagem',
          'Recálculo do risco residual pós-adequação (faixa tolerável)',
          'Diagrama unifilar e pneumático atualizado afixado no painel',
          'Comprovação de capacitação técnica dos operadores'
        ],
        secoesSugeridas: [
          '1. Memorial Descritivo das Modificações Realizadas',
          '2. Ensaios Funcionais e Testes de Parada',
          '3. Verificação do Risco Residual Pós-Retrofit',
          '4. Parecer Conclusivo de Liberação para Produção'
        ]
      },
      {
        id: 'nr12-projetos-cad',
        nome: 'Projetos Mecânicos Executivos 2D/3D em CAD com ART',
        normaRef: 'CREA-PE · ABNT',
        detalhe: 'Modelagem 3D, detalhamento para caldeiraria e usinagem, memoriais descritivos de cálculo estrutural e ART de projeto e execução.',
        checklistSugerido: [
          'Modelagem 3D paramétrica e desenhos executivos 2D',
          'Memorial de cálculo estrutural e dimensionamento de soldas',
          'Especificação de materiais e tratamentos térmicos/anticorrosivos',
          'Lista de materiais (BOM) para manufatura e montagem',
          'Anotação de Responsabilidade Técnica (ART) de projeto'
        ],
        secoesSugeridas: [
          '1. Escopo e Premissas de Projeto',
          '2. Memória de Cálculo Mecânico e Esforços',
          '3. Especificações Técnicas de Materiais e Soldagem',
          '4. Pranchas de Detalhamento CAD e Tolerâncias'
        ]
      }
    ]
  },
  {
    id: 'maquinas-pesadas',
    nome: 'Laudo de máquinas pesadas',
    norma: 'NR-11 · NR-12 · NR-18',
    descricao: 'Inspeção de conformidade operacional, segurança de tráfego e estruturas de proteção (ROPS/FOPS).',
    subtipos: [
      {
        id: 'maq-integridade',
        nome: 'Laudo de Integridade Estrutural e Segurança Operacional (NR-12 / NR-18)',
        normaRef: 'NR-12 Anexo XI · NR-18',
        detalhe: 'Vistoria minuciosa de escavadeiras hidráulicas, retroescavadeiras e pás carregadeiras (chassi, freios, direção, pinos e cilindros).',
        checklistSugerido: [
          'Inspeção do chassi e integridade de soldas estruturais',
          'Ensaio funcional de freios de serviço, estacionamento e emergência',
          'Folgas em pinos, buchas e articulações da caçamba/lança',
          'Estanqueidade do circuito hidráulico e ausência de vazamentos',
          'Alarme sonoro de ré e iluminação de trabalho operacionais',
          'Cinto de segurança e condições ergonômicas do posto do operador'
        ],
        secoesSugeridas: [
          '1. Identificação do Equipamento e Horímetro',
          '2. Inspeção Estrutural de Chassi, Lança e Articulações',
          '3. Verificação do Sistema Hidráulico e Estanqueidade',
          '4. Ensaios dos Sistemas de Freio, Direção e Sinalização',
          '5. Parecer Técnico Conclusivo de Aptidão Operacional'
        ]
      },
      {
        id: 'maq-rops-fops',
        nome: 'Laudo de Conformidade de Estruturas de Proteção (ROPS / FOPS)',
        normaRef: 'ABNT NBR ISO 3471 (ROPS) e ISO 3449 (FOPS)',
        detalhe: 'Atestação da integridade estrutural das cabines de proteção contra capotamento (ROPS) e queda de materiais pesados (FOPS).',
        checklistSugerido: [
          'Presença e legibilidade da plaqueta original ROPS/FOPS do fabricante',
          'Ausência de soldas não homologadas, cortes ou perfurações na cabine',
          'Integridade dos coxins de fixação da cabine ao chassi da máquina',
          'Fixação e ancoragem do cinto de segurança de 3 ou 2 pontos',
          'Vidros de segurança laminados/temperados sem trincas ou obstruções'
        ],
        secoesSugeridas: [
          '1. Dados da Cabine e Plaqueta Normativa ROPS/FOPS',
          '2. Exame Visual e Estrutural das Colunas e Teto Protetor',
          '3. Verificação das Ancoragens e Fixações ao Chassi',
          '4. Enquadramento e Atestado de Conformidade'
        ]
      },
      {
        id: 'maq-periodica',
        nome: 'Laudo de Inspeção Periódica de Manutenção e Segurança',
        normaRef: 'NR-11 · NR-18',
        detalhe: 'Avaliação técnica de motoniveladoras, rolos compactadores e tratores de esteira com emissão de plano de ação corretivo e ART.',
        checklistSugerido: [
          'Verificação de esteiras, roletes, sapatas ou pneus de tração',
          'Níveis e condições de óleos lubrificantes e hidráulicos',
          'Extintor de incêndio pressurizado e dentro da validade',
          'Espelhos retrovisores e visibilidade direta/indireta do operador',
          'Cronograma de manutenção preventiva em dia'
        ],
        secoesSugeridas: [
          '1. Histórico de Manutenção e Operação',
          '2. Inspeção Mecânica de Material Rodante e Transmissão',
          '3. Sistemas Preventivos de Bordo e Combate a Princípio de Incêndio',
          '4. Cronograma de Ações e Recomendações'
        ]
      }
    ]
  },
  {
    id: 'munck-guindastes',
    nome: 'Caminhões munck e guindastes',
    norma: 'NR-11 · NBR 14768',
    descricao: 'Ensaio de carga com célula calibrada, estanqueidade hidráulica, tabela de carga e rigging.',
    subtipos: [
      {
        id: 'munck-load-test',
        nome: 'Laudo de Teste de Carga (Load Test) Estático e Dinâmico',
        normaRef: 'ABNT NBR 14768 · NR-11',
        detalhe: 'Ensaio de içamento com peso padrão aferido, medição de deflexão da lança telescópica e estanqueidade de válvulas de sustentação.',
        checklistSugerido: [
          'Ensaio de carga estático a 125% da capacidade nominal',
          'Ensaio dinâmico a 110% com movimentação e giro de 360°',
          'Medição de deflexão residual da lança após alívio de peso',
          'Teste de estanqueidade e descida involuntária dos cilindros hidráulicos',
          'Condição de pinos de articulação e travas mecânicas das lanças'
        ],
        secoesSugeridas: [
          '1. Características Técnicas do Guindauto / Munck',
          '2. Metodologia do Ensaio de Carga e Célula de Carga Utilizada',
          '3. Tabela de Esforços Medidos e Deflexões Observadas',
          '4. Comportamento das Válvulas Holding e Cilindros',
          '5. Conclusão Pericial e Homologação de Carga de Trabalho'
        ]
      },
      {
        id: 'munck-liberacao',
        nome: 'Laudo de Liberação e Conformidade NR-11 / NR-12',
        normaRef: 'NR-11 · NBR 8400',
        detalhe: 'Inspeção de sapatas estabilizadoras, grampos, cabos de aço, ganchos, moitões e comandos hidráulicos.',
        checklistSugerido: [
          'Abertura total das sapatas estabilizadoras e integridade dos pratos de apoio',
          'Trava de segurança do gancho de içamento e ausência de deformação/abertura',
          'Inspeção do cabo de aço (arames rompidos, dobras ou corrosão)',
          'Alavancas de comando com retorno automático à posição neutra',
          'Indicação clara dos comandos e sentidos de movimentação'
        ],
        secoesSugeridas: [
          '1. Verificação dos Estabilizadores e Chassi de Montagem',
          '2. Exame dos Acessórios de Içamento (Ganchos, Cabos, Moitões)',
          '3. Inspeção do Posto de Comando e Alavancas',
          '4. Parecer de Liberação para Obras e Indústrias'
        ]
      },
      {
        id: 'munck-lmi-rigging',
        nome: 'Laudo de Aferição do Limitador de Momento de Carga (LMI) e Rigging',
        normaRef: 'ABNT NBR 16463',
        detalhe: 'Calibração de sensores de ângulo e momento de carga, emissão de tabela de carga oficial e validação de plano de içamento.',
        checklistSugerido: [
          'Aferição do transdutor de pressão dos cilindros de elevação',
          'Conferência do sensor de ângulo da lança e comprimento telescópico',
          'Teste de corte de movimentos críticos ao atingir 100% da capacidade',
          'Tabela de carga afixada e legível na estação do operador',
          'Validação dos parâmetros para Plano de Rigging'
        ],
        secoesSugeridas: [
          '1. Avaliação do Sistema Eletrônico LMI / Indicador de Carga',
          '2. Procedimento de Calibração e Disparo de Alarme',
          '3. Verificação da Tabela de Carga Operacional',
          '4. Termo de Homologação de Calibração'
        ]
      }
    ]
  },
  {
    id: 'pericia-veicular',
    nome: 'Perícia veicular e reclassificação de monta',
    norma: 'DETRAN · CONTRAN',
    descricao: 'Parecer técnico para desbloqueio de veículo sinistrado, análise estrutural e perícia forense.',
    subtipos: [
      {
        id: 'veic-reclassificacao',
        nome: 'Laudo Pericial de Reclassificação de Monta Veicular',
        normaRef: 'Resolução CONTRAN 810/2020 · DETRAN-PE',
        detalhe: 'Inspeção e parecer técnico circunstanciado para reclassificação de Grande ou Média Monta para Pequena Monta junto ao DETRAN.',
        checklistSugerido: [
          'Identificação veicular (chassi, plaquetas, motor e numeração de vidros)',
          'Análise do Boletim de Acidente de Trânsito (BAT) e relatório de avarias',
          'Inspeção do monobloco e alinhamento tridimensional de longarinas',
          'Conferência de colunas estruturais (A, B e C), soleiras e painel de fogo',
          'Preenchimento detalhado do Anexo II da Resolução CONTRAN 810/2020',
          'Dossiê fotográfico de todas as peças e partes estruturais'
        ],
        secoesSugeridas: [
          '1. Qualificação do Veículo e Dados Cadastrais',
          '2. Histórico da Ocorrência e Enquadramento Inicial',
          '3. Perícia Estrutural Minuciosa (Longarinas, Caixas de Roda, Colunas)',
          '4. Aplicação dos Critérios da Resolução CONTRAN 810/2020',
          '5. Conclusão Pericial para Desbloqueio junto ao DETRAN'
        ]
      },
      {
        id: 'veic-sinistro-danos',
        nome: 'Laudo de Avaliação de Sinistro Veicular e Danos Estruturais',
        normaRef: 'ABNT NBR 14653-5',
        detalhe: 'Medição milimétrica de alinhamento de longarinas, monobloco, integridade de soldas de fábrica e colunas estruturais A/B/C.',
        checklistSugerido: [
          'Medição de pontos de fixação da suspensão no gabarito/mesa alinhadora',
          'Avaliação de descontinuidades e microtrincas nas soldas estruturais',
          'Inspeção dos sistemas de absorção de impacto (crash boxes)',
          'Conferência de acionamento e integridade do sistema de airbags',
          'Orçamento técnico discriminado para reparação estrutural'
        ],
        secoesSugeridas: [
          '1. Diagnóstico Tridimensional de Deformação Estrutural',
          '2. Exame dos Componentes de Suspensão, Trem de Força e Direção',
          '3. Avaliação de Viabilidade Econômica e Técnica de Reparo',
          '4. Parecer Técnico Circunstanciado'
        ]
      },
      {
        id: 'veic-causa-raiz',
        nome: 'Laudo Pericial de Análise de Falha Mecânica (Root Cause Analysis)',
        normaRef: 'Engenharia Forense · CREA-PE',
        detalhe: 'Investigação pericial de quebra de componentes mecânicos (fadiga, falha de freio, eixos ou direção) para processos judiciais e seguradoras.',
        checklistSugerido: [
          'Histórico de manutenção, ordens de serviço e intervenções prévias',
          'Análise metalográfica/fratográfica de componentes fraturados',
          'Investigação de sobrecarga mecânica, fadiga ou defeito de montagem',
          'Nexo causal entre intervenção prévia e sinistro ocorrido',
          'Enquadramento jurídico perante o Código de Defesa do Consumidor'
        ],
        secoesSugeridas: [
          '1. Histórico dos Fatos e Sintomas Apresentados',
          '2. Exame Físico Pericial das Peças Danificadas',
          '3. Análise da Causa Raiz da Ruptura Mecânica',
          '4. Avaliação do Nexo de Causalidade e Responsabilidade',
          '5. Respostas aos Quesitos Técnicos Periciais'
        ]
      }
    ]
  },
  {
    id: 'playgrounds',
    nome: 'Laudo de playgrounds',
    norma: 'NBR 16071',
    descricao: 'Inspeção de brinquedos, pisos amortecedores, riscos de aprisionamento e fixações.',
    subtipos: [
      {
        id: 'play-inspecao-geral',
        nome: 'Laudo Técnico de Inspeção de Playground (ABNT NBR 16071)',
        normaRef: 'ABNT NBR 16071 Partes 1 a 7',
        detalhe: 'Inspeção de balanços, escorregadores, gangorras, tirolesas e casinhas em condomínios, escolas e clubes.',
        checklistSugerido: [
          'Inspeção estrutural de mastros, madeiramento, parafusos e rebites',
          'Estado de conservação de correntes, ganchos e elos de ligação',
          'Superfície dos escorregadores livre de rebarbas, trincas ou lascas',
          'Estabilidade global de casinhas elevadas e guarda-corpos',
          'Manutenção preventiva e plano de inspeção do estabelecimento'
        ],
        secoesSugeridas: [
          '1. Inventário Detalhado dos Brinquedos e Fabricantes',
          '2. Inspeção Estrutural de Madeiramento, Aço e Polietileno',
          '3. Verificação de Correntes, Rolamentos e Fixações Móveis',
          '4. Recomendações e Prazos para Correção'
        ]
      },
      {
        id: 'play-aprisionamento',
        nome: 'Laudo de Análise de Risco de Aprisionamento e Queda',
        normaRef: 'NBR 16071-2 · NBR 16071-3',
        detalhe: 'Medição de aberturas com sondas normatizadas para prevenção de aprisionamento de cabeça, pescoço, dedos e roupas.',
        checklistSugerido: [
          'Teste com sonda de cabeça e pescoço em aberturas entre 89 mm e 230 mm',
          'Teste de aprisionamento de dedos em orifícios entre 8 mm e 25 mm',
          'Teste com gabarito de aprisionamento de roupas/cordões em escorregadores',
          'Altura livre de queda de cada equipamento dentro dos limites normativos',
          'Guarda-corpos e barreiras de proteção em plataformas elevadas'
        ],
        secoesSugeridas: [
          '1. Metodologia de Teste com Sondas Normatizadas NBR 16071',
          '2. Mapeamento de Vãos e Pontos com Risco de Aprisionamento',
          '3. Avaliação das Barreiras Antiqueda em Altura',
          '4. Parecer Conclusivo de Segurança Infantil'
        ]
      },
      {
        id: 'play-piso-amortecedor',
        nome: 'Laudo de Piso Amortecedor e Ancoragens Estruturais',
        normaRef: 'NBR 16071-3 · NBR 16071-4',
        detalhe: 'Verificação da área de circulação, espessura e atenuação de impacto do piso (areia, borracha ou grama sintética) e ancoragens.',
        checklistSugerido: [
          'Área de impacto livre de obstáculos ao redor de cada brinquedo',
          'Espessura mínima da camada de areia (mínimo 30 cm) ou piso emborrachado',
          'Condição sanitária e drenagem do piso amortecedor',
          'Inspeção dos chumbadores e sapatas de concreto no solo',
          'Ausência de fundações expostas na zona de impacto da criança'
        ],
        secoesSugeridas: [
          '1. Delimitação das Zonas de Impacto e Circulação Livre',
          '2. Ensaios de Altura Crítica de Queda e Amortecimento do Piso',
          '3. Exame das Fundações e Ancoragens Enterradas',
          '4. Atestado de Conformidade Estrutural e de Impacto'
        ]
      }
    ]
  },
  {
    id: 'pmoc-hvac',
    nome: 'PMOC e projetos de HVAC-R',
    norma: 'Lei 13.589 · NBR 16401',
    descricao: 'Elaboração de PMOC, projetos de climatização e refrigeração, laudos de qualidade do ar e acompanhamento de manutenção.',
    subtipos: [
      {
        id: 'pmoc-plano-operacao',
        nome: 'Laudo e Plano de PMOC (Lei 13.589/2018 e Portaria 3.523/MS)',
        normaRef: 'Lei 13.589/2018 · RE 09/ANVISA',
        detalhe: 'Inventário completo de condicionadores de ar e chillers, definição de periodicidades de limpeza e rotinas de manutenção preventiva.',
        checklistSugerido: [
          'Inventário completo dos aparelhos (Split, VRF, Chiller, Fancoil, ACJ)',
          'Capacidade térmica total em TR e BTUs discriminada por setor',
          'Cronograma de higienização de filtros, serpentinas e bandejas',
          'Registro de troca de filtros e uso de produtos biodegradáveis homologados',
          'ART de Responsabilidade Técnica de Engenheiro Mecânico registrada'
        ],
        secoesSugeridas: [
          '1. Identificação do Edifício e Responsável Legal',
          '2. Relação e Carga Térmica dos Equipamentos de Climatização',
          '3. Rotina de Manutenção Preventiva e Periodicidades de Limpeza',
          '4. Procedimentos Operacionais para Situações de Emergência',
          '5. Ficha de Registro de Atividades e Termo de Homologação'
        ]
      },
      {
        id: 'pmoc-qualidade-ar',
        nome: 'Laudo de Inspeção Técnico-Sanitária e Qualidade do Ar Interior',
        normaRef: 'Resolução RE 09 ANVISA · NBR 16401',
        detalhe: 'Inspeção de filtros, bandejas de condensado, serpentinas e atestação da taxa de renovação de ar exterior com ART técnica.',
        checklistSugerido: [
          'Aferição da renovação de ar externo conforme NBR 16401',
          'Inspeção visual de fungos, mofo e lodo em bandejas de condensado',
          'Integridade das linhas frigorígenas e isolamento térmico elastomérico',
          'Medição de temperatura e umidade relativa nos ambientes ocupados',
          'Laudo laboratorial microbiológico anexado (quando aplicável)'
        ],
        secoesSugeridas: [
          '1. Parâmetros Físicos e Químicos do Ar Climatizado',
          '2. Avaliação dos Filtros de Ar e Eficiência de Filtragem',
          '3. Inspeção das Bandejas, Drenos e Serpentinas',
          '4. Parecer Sanitário de Conformidade com a Resolução RE 09'
        ]
      },
      {
        id: 'pmoc-projeto-hvac',
        nome: 'Projetos de Climatização e Refrigeração (HVAC-R)',
        normaRef: 'ABNT NBR 16401 Partes 1, 2 e 3',
        detalhe: 'Cálculo de carga térmica psicrométrica, dimensionamento de dutos, grelhas e eficiência energética para indústrias e edifícios.',
        checklistSugerido: [
          'Cálculo de carga térmica detalhado por ambiente',
          'Dimensionamento de rede de dutos de insuflamento e retorno',
          'Seleção de difusores, grelhas e perda de carga nos ramais',
          'Diagrama de fluxo de ar e balanço térmico de equipamentos',
          'Memorial descritivo e especificação de equipamentos'
        ],
        secoesSugeridas: [
          '1. Premissas de Projeto e Cargas Térmicas Internas/Externas',
          '2. Memória de Cálculo Psicrométrico e Vazões de Ar',
          '3. Dimensionamento Dutos, Ventiladores e Tubulações de Gás',
          '4. Especificações dos Equipamentos Selecionados'
        ]
      }
    ]
  },
  {
    id: 'pcm-manutencao',
    nome: 'ART de manutenção e gestão PCM',
    norma: 'Lei 6.496 · CONFEA',
    descricao: 'Responsabilidade técnica formal, rotinas preditivas/preventivas e indicadores MTBF/MTTR.',
    subtipos: [
      {
        id: 'pcm-art-responsabilidade',
        nome: 'Laudo com ART de Manutenção e Liberação de Operação',
        normaRef: 'Lei 6.496/77 · Resolução CONFEA',
        detalhe: 'Emissão de ART formal de cargo e função para empresas, indústrias, construtoras e frotas perante órgãos e clientes.',
        checklistSugerido: [
          'Comprovação de vínculo e responsabilidade técnica pelo parque fabril',
          'Verificação de prontuários técnicos e livros de ocorrências',
          'Validação dos procedimentos operacionais padrão (POP) de manutenção',
          'Atestação de conformidade para auditorias de clientes e seguradoras',
          'Emissão e assinatura de ART no CREA-PE'
        ],
        secoesSugeridas: [
          '1. Termo de Responsabilidade Técnica de Engenharia Mecânica',
          '2. Escopo do Parque de Máquinas e Equipamentos Cobertos',
          '3. Auditoria dos Procedimentos de Manutenção Existentes',
          '4. Certidão de Regularidade e ART Homologada'
        ]
      },
      {
        id: 'pcm-iso-55001',
        nome: 'Laudo de Diagnóstico de Maturidade em Gestão de Ativos (PCM / ISO 55001)',
        normaRef: 'ABNT NBR ISO 55001',
        detalhe: 'Estruturação de cronogramas PCM, mapeamento de criticidade de máquinas e controle de indicadores de confiabilidade MTBF e MTTR.',
        checklistSugerido: [
          'Mapeamento de criticidade de ativos pela matriz ABC',
          'Controle de histórico de ordens de serviço corretivas e preventivas',
          'Monitoramento de indicadores: MTBF (tempo médio entre falhas)',
          'Monitoramento de indicadores: MTTR (tempo médio para reparo)',
          'Gestão de sobressalentes e peças críticas de reposição'
        ],
        secoesSugeridas: [
          '1. Metodologia de Avaliação e Matriz de Criticidade',
          '2. Diagnóstico dos Indicadores de Desempenho e Confiabilidade',
          '3. Plano Estratégico de Manutenção Preventiva e Preditiva',
          '4. Recomendações para Redução de Paradas Não Programadas'
        ]
      },
      {
        id: 'pcm-geradores-utilidades',
        nome: 'Laudo de Conformidade de Grupos Geradores e Utilidades Industriais',
        normaRef: 'NR-10 · NR-12 · ABNT',
        detalhe: 'Vistoria mecânica em geradores diesel de emergência, compressores de ar e sistemas de bombeamento industrial.',
        checklistSugerido: [
          'Inspeção do motor a combustão, bicos injetores e bomba de combustível',
          'Estanqueidade do tanque de óleo diesel e bacia de contenção',
          'Silenciador, tubulação de escapamento e isolamento térmico',
          'Funcionamento do quadro de transferência automática (QTA)',
          'Teste em carga simulada com medição de parâmetros de vibração'
        ],
        secoesSugeridas: [
          '1. Especificação do Grupo Gerador / Sistema de Utilidades',
          '2. Inspeção do Trem de Força e Sistema de Abastecimento',
          '3. Ensaio de Partida Automática e Comportamento em Carga',
          '4. Parecer Conclusivo de Segurança e Confiabilidade Operacional'
        ]
      }
    ]
  },
  {
    id: 'nr13-vasos-compressores',
    nome: 'Inspeção de Vasos de Pressão e Compressores (NR-13)',
    norma: 'NR-13 · Portaria MTP 1.846/2022 · ASME VIII',
    descricao: 'Foco em reservatórios de ar comprimido, autoclaves, vasos de processo e cilindros sob pressão.',
    subtipos: [
      {
        id: 'nr13-vp-enquadramento-pv',
        nome: 'Enquadramento Normativo (Cálculo P × V)',
        normaRef: 'NR-13 · Portaria MTP nº 1.846/2022',
        detalhe: 'Classificação do equipamento conforme a Portaria MTP nº 1.846/2022 (enquadrado ou não na NR-13).',
        checklistSugerido: [
          'Levantamento da Pressão Máxima de Operação / PMTA (kPa / kgf/cm² / bar)',
          'Levantamento ou medição geométrica do volume interno (m³ / litros)',
          'Cálculo do produto P × V e identificação da classe de fluido (A, B, C ou D)',
          'Enquadramento na categoria do vaso (I a V) conforme Portaria MTP nº 1.846/2022',
          'Definição dos prazos legais de inspeção externa, interna e calibração de dispositivos'
        ],
        secoesSugeridas: [
          '1. Identificação Técnica do Vaso de Pressão / Compressor',
          '2. Levantamento de Pressão, Volume e Classe de Fluido',
          '3. Cálculo P × V e Enquadramento pela Portaria MTP nº 1.846/2022',
          '4. Classificação de Categoria e Periodicidade Legal de Inspeções'
        ]
      },
      {
        id: 'nr13-vp-inspecao-seguranca',
        nome: 'Inspeção de Segurança Inicial, Periódica e Extraordinária',
        normaRef: 'NR-13 · Exame Externo e Interno',
        detalhe: 'Exame externo e exame interno detalhado (checklist visual de casco, soldas, bases, pintura, corrosão e componentes).',
        checklistSugerido: [
          'Exame externo completo: casco, tampos, cordões de solda, bocais e flanges',
          'Verificação de bases, suportes, chumbadores, pintura e corrosão externa',
          'Exame interno detalhado: sinais de corrosão alveolar, pites, trincas ou incrustações',
          'Avaliação dos acessórios, dreno de condensado, válvulas de bloqueio e conexões',
          'Conferência de acessos seguros e condições de instalação conforme NR-13'
        ],
        secoesSugeridas: [
          '1. Caracterização do Equipamento e Tipo de Inspeção (Inicial / Periódica / Extraordinária)',
          '2. Resultado do Exame Visual Externo (Casco, Soldas, Bases e Pintura)',
          '3. Resultado do Exame Visual Interno e Avaliação de Corrosão',
          '4. Verificação dos Componentes, Drenos e Dispositivos Auxiliares',
          '5. Parecer Técnico e Recomendações de Segurança'
        ]
      },
      {
        id: 'nr13-vp-ultrassom-espessura',
        nome: 'Ensaio Não Destrutivo (END) — Medição de Espessura por Ultrassom',
        normaRef: 'ASME Sec. VIII · NR-13',
        detalhe: 'Mapeamento de pontos no costado e tampos com comparação à espessura mínima calculada (ASME Sec. VIII).',
        checklistSugerido: [
          'Calibração do medidor de espessura por ultrassom com bloco padrão rastreado',
          'Mapeamento de pontos nos quadrantes do costado (superior, médio e inferior)',
          'Mapeamento de pontos nos tampos (torisférico / elíptico / semiesférico) e bocais',
          'Cálculo da espessura mínima admissível pelo código ASME Seção VIII Div. 1',
          'Cálculo de taxa de corrosão e vida residual estimada do casco e tampos'
        ],
        secoesSugeridas: [
          '1. Instrumentação Utilizada e Certificado de Calibração do Aparelho',
          '2. Croqui de Mapeamento de Pontos (Costado e Tampos)',
          '3. Tabela Comparativa: Espessura Medida × Espessura Mínima (ASME Sec. VIII)',
          '4. Análise de Taxa de Corrosão e Integridade Estrutural'
        ]
      },
      {
        id: 'nr13-vp-boroscopia',
        nome: 'Inspeção Boroscópica Interna',
        normaRef: 'NR-13 · Endoscopia Industrial',
        detalhe: 'Avaliação visual interna via câmera endoscópica para vasos/compressores sem boca de visita.',
        checklistSugerido: [
          'Acesso interno por bocais roscados ou conexões de inspeção sem abertura destrutiva',
          'Registro em alta definição da superfície interna inferior (acúmulo de condensado/óleo)',
          'Inspeção visual interna de soldas circunferenciais, longitudinais e tampos',
          'Verificação de oxidação, corrosão localizada, depósitos ou delaminações',
          'Justificativa técnica documentada da aplicabilidade da boroscopia conforme NR-13'
        ],
        secoesSugeridas: [
          '1. Justificativa Técnica e Condições de Acesso ao Interior do Vaso',
          '2. Equipamento Endoscópico Utilizado e Pontos de Inserção',
          '3. Registro Fotográfico Comentado das Superfícies e Soldas Internas',
          '4. Conclusão quanto à Integridade Interna e Necessidade de Limpeza/Drenagem'
        ]
      },
      {
        id: 'nr13-vp-teste-hidrostatico',
        nome: 'Teste Hidrostático / Teste de Estanqueidade',
        normaRef: 'NR-13 · ASME Sec. VIII (PMTA)',
        detalhe: 'Ensaio de resistência estrutural ou verificação de ausência de vazamentos sob PMTA (ou justificativa técnica de método alternativo).',
        checklistSugerido: [
          'Isolamento e bloqueio seguro do vaso com manômetros calibrados em escala adequada',
          'Pressurização controlada em patamares até pressão de teste / PMTA normatizada',
          'Monitoramento de estabilidade de pressão e ausência de deformações ou vazamentos',
          'Registro gráfico / tabela tempo × pressão durante o patamar de teste',
          'Emissão de justificativa técnica formal quando aplicado método alternativo ao hidrostático'
        ],
        secoesSugeridas: [
          '1. Parâmetros do Ensaio (PMTA, Pressão de Teste e Fluido Utilizado)',
          '2. Procedimento de Pressurização, Patamares e Tempo de Permanência',
          '3. Registro de Leituras de Manômetros Calibrados e Estanqueidade',
          '4. Parecer Conclusivo (ou Memorial de Método Alternativo NR-13)'
        ]
      },
      {
        id: 'nr13-vp-calibracao-psv-manometro',
        nome: 'Aferição e Calibração de Dispositivos de Segurança',
        normaRef: 'NR-13 · RBC / INMETRO',
        detalhe: 'Calibração rastreável RBC/INMETRO de Válvulas de Segurança (PSV) e Manômetros, com emissão de certificado e lacre numerado.',
        checklistSugerido: [
          'Inspeção visual, limpeza e desmonte/teste de bancada de Válvula de Segurança (PSV)',
          'Ajuste da pressão de abertura (set pressure) igual ou inferior à PMTA e verificação de vedação',
          'Calibração de manômetro em múltiplos pontos da escala com padrão rastreado RBC/INMETRO',
          'Instalação de lacre numerado inviolável e etiqueta/tag na PSV e no manômetro',
          'Emissão de Certificado de Calibração vinculado ao prontuário do vaso'
        ],
        secoesSugeridas: [
          '1. Identificação dos Dispositivos de Segurança (PSV e Manômetros)',
          '2. Padrões de Referência Rastreados (RBC / INMETRO)',
          '3. Resultados de Aferição, Pressão de Abertura e Classe de Exatidão',
          '4. Numeração dos Lacres Aplicados e Validade das Calibrações'
        ]
      },
      {
        id: 'nr13-vp-prontuario-nr13',
        nome: 'Reconstituição ou Elaboração de Prontuário NR-13',
        normaRef: 'NR-13 · Memorial de Cálculo PMTA',
        detalhe: 'Memorial de cálculo (PMTA), caracterização técnica, partes vitais, desenhos esquemáticos e registro fotográfico.',
        checklistSugerido: [
          'Levantamento dimensional completo em campo (diâmetro, comprimento, espessura de chapa e tampos)',
          'Memorial de cálculo da Pressão Máxima de Trabalho Admissível (PMTA)',
          'Especificação dos materiais, código de projeto e eficiência de junta adotada',
          'Desenhos esquemáticos / croquis cotados com identificação de bocais e partes vitais',
          'Dossiê fotográfico e consolidação do Prontuário NR-13 assinado por PH'
        ],
        secoesSugeridas: [
          '1. Dados Gerais, Fabricante e Caracterização do Vaso de Pressão',
          '2. Memorial de Cálculo Estrutural e Determinação da PMTA',
          '3. Relação de Partes Vitais e Dispositivos de Segurança',
          '4. Desenhos Esquemáticos Dimensionais e Registro Fotográfico'
        ]
      },
      {
        id: 'nr13-vp-plaqueta-identificacao',
        nome: 'Emissão e Atualização de Plaqueta de Identificação',
        normaRef: 'NR-13 · Identificação Metálica',
        detalhe: 'Confecção/fixação de placa metálica com categoria, PMTA, nº de série, fabricante e data de inspeção.',
        checklistSugerido: [
          'Gravação indelével em placa metálica resistente à corrosão (aço inox ou alumínio gravado)',
          'Inclusão obrigatória de: Fabricante, nº de identificação/série, ano de fabricação e PMTA',
          'Inclusão da pressão de teste hidrostático, ano/código de projeto e Categoria NR-13',
          'Fixação segura em local visível do costado e atualização de etiqueta de próxima inspeção',
          'Registro fotográfico da placa instalada no equipamento'
        ],
        secoesSugeridas: [
          '1. Dados Obrigatórios da Placa de Identificação NR-13',
          '2. Especificação da Plaqueta Metálica e Forma de Fixação',
          '3. Registro Fotográfico da Plaqueta e Sinalização de Categoria no Vaso'
        ]
      },
      {
        id: 'nr13-vp-livro-seguranca',
        nome: 'Abertura e Registro de Livro de Segurança (Físico ou Digital)',
        normaRef: 'NR-13 · Registro de Segurança',
        detalhe: 'Registro formal das ocorrências, inspeções e recomendações técnicas.',
        checklistSugerido: [
          'Abertura formal do Livro / Registro de Segurança vinculado ao nº de série do vaso',
          'Termo de abertura com dados do estabelecimento, equipamento e Profissional Habilitado',
          'Lançamento cronológico de inspeções, calibrações, reparos e ocorrências operacionais',
          'Anotação explícita das recomendações técnicas e prazos de atendimento',
          'Assinatura do Profissional Habilitado (PH) e disponibilização para fiscalização MTE'
        ],
        secoesSugeridas: [
          '1. Termo de Abertura do Registro de Segurança NR-13',
          '2. Histórico Cronológico de Inspeções e Intervenções',
          '3. Registro de Ocorrências e Recomendações Técnicas Vigentes'
        ]
      },
      {
        id: 'nr13-vp-relatorio-art',
        nome: 'Emissão de Relatório de Inspeção NR-13 + ART',
        normaRef: 'NR-13 · CREA-PE',
        detalhe: 'Parecer conclusivo (Aprovado, Aprovado com Ressalvas ou Reprovado) e Plano de Ação.',
        checklistSugerido: [
          'Consolidação dos exames externos, internos, END de ultrassom e calibração de PSV/manômetro',
          'Análise de conformidade documental (Prontuário, Registro de Segurança e Projeto de Instalação)',
          'Emissão de parecer técnico conclusivo: Aprovado, Aprovado com Ressalvas ou Reprovado',
          'Plano de Ação detalhado com criticidade, responsáveis e prazos de adequação',
          'Emissão da Anotação de Responsabilidade Técnica (ART) no CREA-PE'
        ],
        secoesSugeridas: [
          '1. Resumo Executivo e Identificação do Vaso / Compressor',
          '2. Resultados Consolidados das Inspeções e Ensaios (END / Calibração)',
          '3. Parecer Técnico Conclusivo de Aptidão Operacional',
          '4. Plano de Ação Corretiva e Cronograma de Próximas Inspeções',
          '5. Anexos: Certificados RBC/INMETRO e ART CREA-PE'
        ]
      }
    ]
  },
  {
    id: 'nr13-caldeiras',
    nome: 'Inspeção de Caldeiras a Vapor (NR-13)',
    norma: 'NR-13 · Caldeiras a Vapor · RBC/INMETRO',
    descricao: 'Foco em geradores de vapor aquatubulares, flamotubulares e elétricos.',
    subtipos: [
      {
        id: 'nr13-cald-periodica',
        nome: 'Inspeção de Segurança Periódica (Exame Interno e Externo)',
        normaRef: 'NR-13 · Caldeiras a Vapor',
        detalhe: 'Avaliação de fornalha, espelhos, feixe tubular, refratários, isolamento térmico e estrutura.',
        checklistSugerido: [
          'Exame interno da fornalha, tubulões, espelhos e feixe tubular (corrosão, incrustações e trincas)',
          'Avaliação de refratários, portas de visita, alívio de explosão e isolamento térmico',
          'Exame externo da carcaça, chaminé, dutos de gases, bases estruturais e escadas/plataformas',
          'Verificação das condições da casa de caldeiras (ventilação, rotas de fuga, iluminação de emergência)',
          'Acompanhamento de teste operacional em regime de produção de vapor'
        ],
        secoesSugeridas: [
          '1. Identificação da Caldeira (Categoria A ou B, PMTA, Capacidade de Vapor)',
          '2. Exame Interno Detalhado (Fornalha, Espelhos, Tubos e Refratários)',
          '3. Exame Externo, Isolamento Térmico e Casa de Caldeiras',
          '4. Conclusão Técnica e Prazos para Próximas Inspeções'
        ]
      },
      {
        id: 'nr13-cald-controle-intertravamento',
        nome: 'Verificação de Sistemas de Controle e Intertravamento',
        normaRef: 'NR-13 · Segurança Operacional',
        detalhe: "Testes funcionais de pressostatos, indicadores de nível d'água, válvulas de descarga de fundo e bloqueio de combustível.",
        checklistSugerido: [
          "Teste funcional de duplo indicador de nível d'água (visor e eletrodos/garrafa de nível)",
          'Teste de corte de combustível / aquecimento por baixo nível de água (segurança crítica)',
          'Aferição da atuação dos pressostatos de operação e de segurança (alta pressão)',
          'Teste de descarga de fundo, válvulas de alimentação de água e injetores/bombas',
          'Verificação do painel de comando, alarmes sonoros/visuais e bloqueio de chama (fotocélula)'
        ],
        secoesSugeridas: [
          '1. Arquitetura de Controle e Segurança da Caldeira',
          '2. Ensaios de Nível Mínimo, Pressostatos e Malha de Intertravamento',
          '3. Avaliação de Válvulas de Descarga, Alimentação e Bloqueio de Combustível',
          '4. Parecer de Confiabilidade dos Sistemas de Segurança'
        ]
      },
      {
        id: 'nr13-cald-end',
        nome: 'Ensaios Não Destrutivos (END) em Caldeiras',
        normaRef: 'NR-13 · ASME · Ultrassom / LP / PM',
        detalhe: 'Ultrassom de espessura, líquido penetrante (LP) ou partículas magnéticas em soldas críticas.',
        checklistSugerido: [
          'Medição de espessura por ultrassom no costado, espelhos, tubulão e tubos de fumaça/água',
          'Ensaio por Líquido Penetrante (LP) nas ligações tubo-espelho e bocais críticos',
          'Ensaio por Partículas Magnéticas (PM) em soldas estruturais e zonas termicamente afetadas',
          'Verificação de empolamentos, superaquecimento localizado ou perda de espessura',
          'Comparação dos resultados com a espessura mínima admissível de projeto'
        ],
        secoesSugeridas: [
          '1. Escopo e Técnicas END Aplicadas (US, LP e/ou PM)',
          '2. Mapeamento de Espessuras em Espelhos, Costado e Tubulões',
          '3. Relatório de Descontinuidades em Soldas Críticas',
          '4. Avaliação de Integridade Mecânica e Recomendações'
        ]
      },
      {
        id: 'nr13-cald-calibracao-psv',
        nome: 'Calibração de Manômetros e Válvulas de Segurança (PSV)',
        normaRef: 'NR-13 · RBC / INMETRO',
        detalhe: 'Ensaio de bancada ou em operação com lacre e certificado RBC/INMETRO.',
        checklistSugerido: [
          'Calibração da(s) válvula(s) de segurança em bancada ou com dispositivo hidráulico assistido',
          'Verificação da pressão de abertura, diferencial de alívio e estanqueidade de fechamento',
          'Calibração dos manômetros principal e auxiliares com faixa de leitura adequada à PMTA',
          'Aplicação de lacre numerado e emissão de certificados rastreáveis RBC/INMETRO',
          'Conferência de desobstrução da tubulação de descarga da PSV para local seguro'
        ],
        secoesSugeridas: [
          '1. Relação de Válvulas de Segurança (PSV) e Manômetros da Caldeira',
          '2. Metodologia de Calibração e Padrões RBC/INMETRO',
          '3. Laudo de Ensaio de Abertura, Fechamento e Lacração',
          '4. Certificados Vinculados e Datas de Recalibração'
        ]
      },
      {
        id: 'nr13-cald-auditoria-documental',
        nome: 'Auditoria Documental e Operacional NR-13',
        normaRef: 'NR-13 · Documentação & Operação',
        detalhe: 'Verificação de Prontuário, Registro de Segurança, Projeto de Instalação, Plano de Manutenção e Certificado de Qualificação do Operador.',
        checklistSugerido: [
          'Conferência do Prontuário completo fornecido pelo fabricante ou reconstituído por PH',
          'Verificação do Registro de Segurança atualizado e assinado em todas as ocorrências',
          'Análise do Projeto de Instalação da caldeira e conformidade da casa de caldeiras',
          'Checagem do Plano de Manutenção Preditiva/Preventiva e tratamento químico da água',
          'Validação dos Certificados de Treinamento de Segurança na Operação de Caldeiras e reciclagem'
        ],
        secoesSugeridas: [
          '1. Checklist Documental Obrigatório da NR-13',
          '2. Auditoria de Qualificação e Reciclagem dos Operadores',
          '3. Verificação do Projeto de Instalação e Tratamento de Água',
          '4. Matriz de Pendências Documentais e Prazos Legais'
        ]
      },
      {
        id: 'nr13-cald-laudo-integridade-art',
        nome: 'Emissão de Laudo Técnico de Integridade / Inspeção + ART',
        normaRef: 'NR-13 · CREA-PE',
        detalhe: 'Relatório completo com prazos para próximas inspeções e plano de adequação.',
        checklistSugerido: [
          'Integração dos resultados de exames interno/externo, END, testes de intertravamento e PSV',
          'Avaliação de vida útil remanescente (para caldeiras acima de 25 anos quando aplicável)',
          'Definição explícita dos prazos máximos para próximas inspeções periódicas (NR-13)',
          'Plano de adequação com medidas corretivas priorizadas por criticidade',
          'Emissão da ART registrada no CREA-PE e atualização do Registro de Segurança'
        ],
        secoesSugeridas: [
          '1. Sumário Técnico e Enquadramento Normativo NR-13',
          '2. Consolidação dos Exames, Ensaios END e Testes Funcionais',
          '3. Avaliação de Integridade e Vida Remanescente',
          '4. Parecer Conclusivo, Prazos de Reinspeção e Plano de Adequação',
          '5. ART CREA-PE e Evidências Fotográficas'
        ]
      }
    ]
  },
  {
    id: 'gas-combustivel-glp-gn',
    nome: 'Inspeção de Centrais e Redes de Gás Combustível (GLP / GN)',
    norma: 'NBR 15514 · NBR 13523 · NBR 15526 · NR-26',
    descricao: 'Foco em abrigos de cilindros (P-13, P-45, P-190), tanques estacionários, tubulações e pontos de consumo (cozinhas, laboratórios, aquecedores).',
    subtipos: [
      {
        id: 'gas-abrigos-centrais-glp',
        nome: 'Inspeção Técnica de Abrigos e Centrais de GLP',
        normaRef: 'ABNT NBR 15514 · NBR 13523',
        detalhe: 'Verificação estrutural, ventilação (venezianas), afastamentos mínimos de segurança, piso, cobertura e acessos (ABNT NBR 15514 e NBR 13523).',
        checklistSugerido: [
          'Condições estruturais de paredes resistentes ao fogo, piso incombustível e cobertura',
          'Áreas de ventilação natural permanente (venezianas superior e inferior conforme NBR 15514)',
          'Afastamentos mínimos de ralos, fontes de ignição, quadros elétricos e divisas',
          'Classificação de área elétrica à prova de explosão (Ex) dentro da zona de risco',
          'Acesso desobstruído, portão com abertura para fora, cadeado e extintor PQS adequado'
        ],
        secoesSugeridas: [
          '1. Identificação da Central / Abrigo de Cilindros (P-13, P-45, P-190 ou Tanque)',
          '2. Avaliação Construtiva, Ventilação e Afastamentos Normativos',
          '3. Verificação de Instalações Elétricas e Proteção Contra Incêndio',
          '4. Não Conformidades e Adequações Requeridas (NBR 15514 / NBR 13523)'
        ]
      },
      {
        id: 'gas-teste-estanqueidade',
        nome: 'Teste de Estanqueidade em Redes e Tubulações de Gás',
        normaRef: 'ABNT NBR 13419 · NBR 15526',
        detalhe: 'Ensaio pneumático com nitrogênio (N₂) seco ou ar comprimido a 1,5 × P_operação, monitoramento de ΔP = 0 por tempo normativo (ABNT NBR 13419 / NBR 15526) com manômetro calibrado.',
        checklistSugerido: [
          'Bloqueio e desconexão dos aparelhos de consumo e reguladores sensíveis à pressão de ensaio',
          'Pressurização com nitrogênio (N₂) seco ou ar comprimido a 1,5 × P_operação conforme norma',
          'Estabilização térmica e monitoramento contínuo com manômetro calibrado RBC (ΔP = 0)',
          'Registro fotográfico da pressão inicial (P1), cronômetro e pressão final (P2) após tempo normativo',
          'Avaliação de suportação, proteção mecânica, pintura amarela (NR-26) e válvulas de bloqueio'
        ],
        secoesSugeridas: [
          '1. Traçado da Rede, Trechos Ensaiados e Pressão de Operação',
          '2. Metodologia de Teste Pneumático (N₂ / Ar Comprimido) e Instrumento Calibrado',
          '3. Registro Cronológico P1 / P2 e Comprovação de ΔP = 0',
          '4. Termo Técnico de Estanqueidade da Rede de Gás'
        ]
      },
      {
        id: 'gas-rastreamento-lel',
        nome: 'Rastreamento de Vazamentos com Detector de Gases (LEL)',
        normaRef: 'Detector LEL · Segurança GLP/GN',
        detalhe: 'Medição pontual em conexões, válvulas, registros, reguladores, fogões, fornos e bicos de Bunsen.',
        checklistSugerido: [
          'Verificação prévia e teste de resposta (bump test) do detector portátil de gases inflamáveis (LEL)',
          'Varredura pontual nas conexões de cilindros, pig-tails, coletores e reguladores de 1º/2º estágio',
          'Varredura em válvulas de bloqueio, flanges, uniões roscadas e engates rápidos',
          'Rastreamento nos pontos de consumo: fogões, fornos, chapas, aquecedores e bicos de Bunsen',
          'Registro de leituras (% LEL / ppm) e bloqueio imediato caso detectado escape de gás'
        ],
        secoesSugeridas: [
          '1. Especificação e Calibração do Detector de Gases Combustíveis (LEL)',
          '2. Roteiro de Medição: Central de Gás, Ramais e Pontos de Consumo',
          '3. Tabela de Leituras Pontuais (% LEL) e Pontos Críticos Identificados',
          '4. Medidas Imediatas de Correção e Parecer de Segurança'
        ]
      },
      {
        id: 'gas-auditoria-componentes',
        nome: 'Auditoria de Validade e Conformidade de Componentes',
        normaRef: 'ABNT · INMETRO · Reteste',
        detalhe: 'Levantamento de datas de fabricação/vencimento de reguladores de pressão, mangueiras flexíveis homologadas e reteste hidrostático de cilindros.',
        checklistSugerido: [
          'Levantamento de data de fabricação e vencimento (5 anos) dos reguladores de pressão',
          'Inspeção de mangueiras flexíveis metálicas ou normatizadas (NBR 13419 / NBR 14177) e validade',
          'Conferência de selo de certificação INMETRO em válvulas, registros e mangueiras',
          'Verificação das datas de reteste hidrostático dos cilindros estacionários/transportáveis',
          'Elaboração de inventário de substituições preventivas programadas'
        ],
        secoesSugeridas: [
          '1. Inventário de Reguladores de Pressão, Mangueiras e Válvulas',
          '2. Conferência de Homologação INMETRO / Normas ABNT',
          '3. Controle de Datas de Fabricação, Vencimento e Reteste de Cilindros',
          '4. Cronograma de Troca de Componentes Vencidos ou Próximos ao Vencimento'
        ]
      },
      {
        id: 'gas-sinalizacao-seguranca',
        nome: 'Inspeção de Sinalização de Segurança',
        normaRef: 'NR-26 · NBR 15514',
        detalhe: 'Verificação de placas obrigatórias ("Perigo - Inflamável", "Proibido Chama/Faísca", identificação de capacidade e fornecedor conforme NR-26).',
        checklistSugerido: [
          'Presença de placa "PERIGO - INFLAMÁVEL" e "PROIBIDO FUMAR / CHAMA / FAÍSCA"',
          'Identificação da capacidade máxima de armazenamento (kg), classe de risco e fornecedor',
          'Identificação por cores na tubulação de gás combustível conforme ABNT NBR 6493 / NR-26 (Amarelo)',
          'Sinalização de válvula de corte geral de emergência em local visível e acessível',
          'Integridade, fixação e legibilidade das placas em materiais resistentes às intempéries'
        ],
        secoesSugeridas: [
          '1. Requisitos de Sinalização para Centrais de GLP/GN (NR-26 / NBR 15514)',
          '2. Verificação de Placas Obrigatórias e Identificação de Tubulações',
          '3. Evidências Fotográficas e Itens de Adequação Visual'
        ]
      },
      {
        id: 'gas-laudo-estanqueidade-art',
        nome: 'Emissão de Laudo de Estanqueidade + Relatório Preventivo + ART',
        normaRef: 'NBR 15526 · CREA-PE',
        detalhe: 'Documento técnico conclusivo por abrigo e ponto de consumo com registro fotográfico (P1/P2 e LEL) e Plano de Ação.',
        checklistSugerido: [
          'Consolidação do teste de estanqueidade (P1/P2 com ΔP = 0) e rastreamento LEL por ambiente',
          'Avaliação individual de cada abrigo/central e de todos os pontos de consumo atendidos',
          'Anexo fotográfico completo dos manômetros calibrados, leituras LEL e componentes',
          'Plano de Ação com classificação de risco e prazos de adequação de não conformidades',
          'Emissão da ART no CREA-PE com validade técnica para CBM / AVCB e auditorias'
        ],
        secoesSugeridas: [
          '1. Identificação do Empreendimento, Centrais de Gás e Pontos de Consumo',
          '2. Resultados do Ensaio de Estanqueidade (P1/P2) e Medições LEL',
          '3. Auditoria de Abrigos, Componentes e Sinalização (NBR 15514 / NR-26)',
          '4. Parecer Técnico Conclusivo e Plano de Ação Corretiva',
          '5. Registro Fotográfico, Certificados de Calibração e ART CREA-PE'
        ]
      }
    ]
  },
  {
    id: 'nr13-tubulacoes-tanques',
    nome: 'Inspeção de Tubulações e Tanques Metálicos (NR-13)',
    norma: 'NR-13 · ASME B31.3 · API 653',
    descricao: 'Foco em linhas industriais de vapor, ar comprimido, gases, fluidos térmicos e tanques de armazenamento não enterrados.',
    subtipos: [
      {
        id: 'nr13-tub-cadastramento',
        nome: 'Cadastramento e Enquadramento de Tubulações (NR-13)',
        normaRef: 'NR-13 · Fluido Classe A ou B',
        detalhe: 'Classificação por classe de fluido (A ou B), pressão e diâmetro.',
        checklistSugerido: [
          'Identificação de todas as linhas industriais (vapor, ar comprimido, gases e fluidos térmicos)',
          'Classificação rigorosa dos fluidos transportados (Classe A ou Classe B conforme NR-13)',
          'Levantamento de diâmetro nominal (DN), pressão de operação e temperatura de projeto',
          'Definição do enquadramento obrigatório na NR-13 para cada linha ou sistema interligado',
          'Estruturação do inventário codificado de tubulações com tags de campo'
        ],
        secoesSugeridas: [
          '1. Inventário Geral das Linhas de Tubulação Industrial',
          '2. Classificação de Fluidos (Classe A / B) e Parâmetros Operacionais',
          '3. Critérios de Enquadramento na NR-13 (Pressão, Diâmetro e Ligação a Vasos/Caldeiras)',
          '4. Cadastro Mestre de Tubulações Enquadradas'
        ]
      },
      {
        id: 'nr13-tub-fluxograma-isometrico',
        nome: 'Elaboração de Fluxograma de Engenharia e Isométricos',
        normaRef: 'NR-13 · Engenharia de Tubulações',
        detalhe: 'Levantamento em campo e desenho técnico da rede com identificação de válvulas e pontos de medição.',
        checklistSugerido: [
          'Levantamento dimensional as-built do traçado completo das tubulações em planta',
          'Identificação gráfica de válvulas de bloqueio, retenção, controle, purgadores e PSVs',
          'Demarcação numerada dos pontos críticos de medição de espessura (TMLs)',
          'Elaboração do Fluxograma de Engenharia (P&ID) e/ou Desenhos Isométricos',
          'Vinculação dos desenhos técnicos ao Prontuário de Tubulações NR-13'
        ],
        secoesSugeridas: [
          '1. Premissas do Levantamento As-Built em Campo',
          '2. Simbologia, Identificação de Válvulas e Acessórios de Linha',
          '3. Mapeamento dos Pontos de Medição de Espessura (TMLs)',
          '4. Pranchas de Fluxograma de Engenharia e Isométricos'
        ]
      },
      {
        id: 'nr13-tub-inspecao-espessura',
        nome: 'Inspeção Visual e Medição de Espessura em Linhas',
        normaRef: 'NR-13 · Ultrassom · CSI',
        detalhe: 'Avaliação de suportes, juntas de expansão, corrosão sob isolamento (CSI) e pontos críticos de desgaste.',
        checklistSugerido: [
          'Inspeção visual de suportes, guias, molas, abraçadeiras, vibrações anômalas e ancoragens',
          'Avaliação de juntas de expansão, purgadores de vapor, flanges e vazamentos em gaxetas',
          'Inspeção em janelas de verificação de Corrosão Sob Isolamento (CSI / CUI) em linhas isoladas',
          'Medição de espessura por ultrassom em curvas, tês, reduções e trechos de alta velocidade',
          'Comparação com espessura mínima admissível (ASME B31.1 / B31.3) e cálculo de taxa de desgaste'
        ],
        secoesSugeridas: [
          '1. Linhas Inspecionadas e Condições Operacionais',
          '2. Exame Visual de Suportes, Juntas de Expansão e Isolamento (CSI)',
          '3. Mapeamento Ultrassônico de Espessuras em Pontos Críticos (TMLs)',
          '4. Análise de Corrosão, Erosão e Recomendações de Reparo'
        ]
      },
      {
        id: 'nr13-tanques-metalicos',
        nome: 'Inspeção de Tanques Metálicos de Armazenamento',
        normaRef: 'NR-13 · API 653 · NBR 17505',
        detalhe: 'Avaliação de costado, teto, fundo, bacia de contenção, respiros e dispositivos de alívio.',
        checklistSugerido: [
          'Inspeção estrutural dos anéis do costado, soldas verticais/horizontais e deformações',
          'Avaliação do teto, guarda-corpos, escadas marinheiro/helicoidais e bocas de visita',
          'Inspeção da chapa de fundo, projeção da borda (chime), recalque de base e aterramento',
          'Avaliação da integridade e capacidade da bacia de contenção e válvulas de drenagem',
          'Verificação de respiros, corta-chamas, válvulas de alívio de pressão/vácuo e medição de espessura'
        ],
        secoesSugeridas: [
          '1. Dados Construtivos do Tanque Metálico e Produto Armazenado',
          '2. Inspeção de Costado, Teto, Fundo e Medição de Espessuras',
          '3. Avaliação de Bacia de Contenção, Respiros e Dispositivos de Alívio',
          '4. Parecer de Integridade Estrutural e Plano de Manutenção'
        ]
      },
      {
        id: 'nr13-tub-plano-inspecao-art',
        nome: 'Plano de Inspeção e Manutenção de Tubulações + ART',
        normaRef: 'NR-13 · CREA-PE',
        detalhe: 'Definição de periodicidade de monitoramento e emissão de laudo conclusivo.',
        checklistSugerido: [
          'Definição do Plano Formal de Inspeção e Manutenção baseado em criticidade e fluido',
          'Estabelecimento de intervalos máximos entre inspeções externas e medições END',
          'Rotina de inspeção de dispositivos de segurança, purgadores e suportação',
          'Emissão de Laudo Conclusivo de Conformidade de Tubulações e Tanques (NR-13)',
          'Registro da ART no CREA-PE sob responsabilidade de Profissional Habilitado'
        ],
        secoesSugeridas: [
          '1. Política e Critérios de Monitoramento de Tubulações (NR-13)',
          '2. Matriz de Criticidade e Periodicidade por Linha / Tanque',
          '3. Procedimentos de Inspeção Periódica e Acompanhamento de Espessura',
          '4. Parecer Conclusivo e ART CREA-PE'
        ]
      }
    ]
  },
  {
    id: 'engenharia-documental-auditoria',
    nome: 'Engenharia Documental, Auditoria e Gestão de Conformidade',
    norma: 'NR-13 · ABNT NBR · CBM · MTE',
    descricao: 'Foco em consultoria técnica, validação remota/presencial de terceiros e gestão de prazos.',
    subtipos: [
      {
        id: 'doc-auditoria-terceiros',
        nome: 'Auditoria Técnica de Laudos de Terceiros',
        normaRef: 'NR-13 · Auditoria Normativa',
        detalhe: 'Revisão normativa de relatórios, certificados de calibração e evidências fotográficas executadas por equipes parceiras.',
        checklistSugerido: [
          'Conferência de escopo mínimo exigido pela NR-13 e normas ABNT/ASME aplicáveis',
          'Validação da rastreabilidade RBC/INMETRO e validade dos certificados de calibração anexos',
          'Análise crítica das medições de espessura, memória de cálculo PMTA e coerência dos dados',
          'Auditoria de consistência das evidências fotográficas, datas, lacres e plaquetas',
          'Verificação de emissão e regularidade da ART junto ao CREA correspondente'
        ],
        secoesSugeridas: [
          '1. Identificação dos Documentos e Equipes Terceiras Auditadas',
          '2. Critérios de Revisão Normativa e Técnica Aplicados',
          '3. Lista de Inconsistências, Lacunas Documentais e Pontos Validados',
          '4. Parecer de Homologação ou Solicitação de Retificação Técnica'
        ]
      },
      {
        id: 'doc-plano-acao-adequacao',
        nome: 'Elaboração de Plano de Ação e Adequação (NR-13 / NBR)',
        normaRef: 'NR-13 · ABNT NBR · Matriz de Risco',
        detalhe: 'Matriz de risco com priorização (Alta/Crítica, Média, Baixa) e prazos legais para correção de Não Conformidades.',
        checklistSugerido: [
          'Consolidação de todas as Não Conformidades (NCs) levantadas nas inspeções de campo',
          'Classificação por Matriz de Risco: Alta/Crítica (risco grave e iminente), Média e Baixa',
          'Definição da ação corretiva recomendada, responsável técnico e recursos necessários',
          'Estabelecimento de prazos legais e metas escalonadas de atendimento normativo',
          'Planilha de acompanhamento de evidências de fechamento (Antes × Depois)'
        ],
        secoesSugeridas: [
          '1. Diagnóstico Consolidado das Não Conformidades',
          '2. Metodologia de Priorização (Criticidade Alta/Crítica, Média e Baixa)',
          '3. Matriz 5W2H de Adequações Técnicas e Prazos Legais',
          '4. Protocolo de Validação e Encerramento das Pendências'
        ]
      },
      {
        id: 'doc-consultoria-cbm-mte',
        nome: 'Consultoria para Adequação de Instalações (Pré-Vistoria CBM / MTE)',
        normaRef: 'CBM / AVCB · MTE',
        detalhe: 'Acompanhamento técnico para obtenção de AVCB (Corpo de Bombeiros) ou atendimento a notificações do Ministério do Trabalho.',
        checklistSugerido: [
          'Análise de autos de infração, termos de notificação do MTE ou exigências do Corpo de Bombeiros',
          'Pré-vistoria técnica in loco simulando os critérios rigorosos dos órgãos fiscalizadores',
          'Orientação executiva sobre centrais de GLP/GN, vasos sob pressão, máquinas e sinalização',
          'Organização do dossiê técnico completo (laudos, testes de estanqueidade, ARTs e certificados)',
          'Acompanhamento técnico de campo durante a vistoria oficial ou protocolo de defesa técnica'
        ],
        secoesSugeridas: [
          '1. Análise das Exigências / Notificações (CBMPE / MTE)',
          '2. Relatório de Pré-Vistoria Técnica e Gap Analysis das Instalações',
          '3. Dossiê de Documentos, Laudos e ARTs Exigidos para Protocolo',
          '4. Parecer de Prontidão para Vistoria Oficial / AVCB'
        ]
      },
      {
        id: 'doc-cronograma-vencimentos',
        nome: 'Gestão de Cronograma Anual de Vencimentos',
        normaRef: 'NR-13 · Controle Preventivo',
        detalhe: 'Controle preventivo de validade de exames externos/internos, calibrações de PSV/manômetros e testes de estanqueidade.',
        checklistSugerido: [
          'Inventário mestre de todos os ativos submetidos a inspeções periódicas obrigatórias',
          'Mapeamento das datas de vencimento de exames externos, internos e testes de estanqueidade',
          'Controle de periodicidade de calibração de PSVs, manômetros, pressostatos e detectores',
          'Programação anual escalonada para evitar paradas não planejadas e autuações',
          'Sistema de alertas preventivos (90, 60 e 30 dias antes do vencimento)'
        ],
        secoesSugeridas: [
          '1. Inventário Consolidado de Ativos e Obrigações Normativas',
          '2. Calendário Anual de Exames NR-13, Calibrações e Estanqueidade',
          '3. Matriz de Alertas Preventivos e Planejamento de Paradas',
          '4. Indicadores de Conformidade e Aderência ao Cronograma'
        ]
      }
    ]
  }
];
