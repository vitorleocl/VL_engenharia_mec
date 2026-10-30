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
  }
];
