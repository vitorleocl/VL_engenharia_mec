import { CategoriaLaudoDef } from '../types';

export const CATEGORIAS_LAUDOS_TAXONOMIA: CategoriaLaudoDef[] = [
  {
    id: 'cat-1',
    numero: 1,
    nome: 'Segurança Contra Incêndio e Pânico',
    icone: 'Flame',
    descricao: 'Projetos, regularização, AVCB/CLCB e comissionamento de sistemas preventivos contra incêndio e gases combustíveis.',
    subcategorias: [
      {
        id: 'sub-1-1',
        nome: 'Projetos e Adequação Técnica (Pré-Execução)',
        tipos: [
          {
            id: 'laudo-ppci-pre',
            codigo: 'PPCI-PRE',
            nome: 'Laudo de Análise/Levantamento Pré-Projeto PPCI',
            normasRef: 'ABNT NBR 9077, NBR 13434, Instruções Técnicas do CBMPE',
            apresentacaoPadrao: 'O presente laudo técnico tem por finalidade realizar o levantamento físico e cadastral das instalações prediais e industriais para subsidiar a elaboração do Projeto de Proteção e Combate a Incêndio e Pânico (PPCI).',
            metodologiaPadrao: 'Vistoria minuciosa in loco para identificação das características arquitetônicas, ocupação, carga de incêndio preliminar e definição dos sistemas de segurança obrigatórios.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Verificação da largura das rotas de fuga e saídas de emergência conforme cálculo populacional', status: 'conforme', observacao: 'Larguras compatíveis com a NBR 9077' },
              { id: 'ck-2', descricao: 'Avaliação de compartimentação horizontal e vertical e isolamento de riscos', status: 'nao_conforme', observacao: 'Ausência de selagem corta-fogo nas passagens de tubulação' },
              { id: 'ck-3', descricao: 'Disponibilidade de pontos de captação de água e reserva técnica de incêndio (RTI)', status: 'conforme', observacao: 'RTI com capacidade dimensionada' },
            ]
          },
          {
            id: 'laudo-dim-saidas',
            codigo: 'PPCI-SAIDAS',
            nome: 'Laudo de Dimensionamento de Saídas de Emergência e Carga de Incêndio',
            normasRef: 'ABNT NBR 9077, NBR 14432, ITs CBMPE',
            apresentacaoPadrao: 'Laudo técnico quantitativo para determinação da carga de incêndio específica em edificações comerciais/industriais e cálculo do dimensionamento das saídas de emergência e portas corta-fogo.',
            metodologiaPadrao: 'Inventário quantitativo e qualitativo dos materiais combustíveis presentes por compartimento, cálculo estequiométrico em MJ/m² e validação das portas de escape.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Cálculo da carga de incêndio específica consolidado por metro quadrado', status: 'conforme', observacao: 'Carga calculada em 450 MJ/m²' },
              { id: 'ck-2', descricao: 'Sentido de abertura das portas das rotas de fuga no sentido de escape', status: 'conforme', observacao: 'Portas com barras antipânico operacionais' },
            ]
          }
        ]
      },
      {
        id: 'sub-1-2',
        nome: 'Regularização e Licenciamento (Pós-Execução)',
        tipos: [
          {
            id: 'laudo-avcb',
            codigo: 'AVCB-CONF',
            nome: 'Laudo de Vistoria e Conformidade para AVCB',
            normasRef: 'Legislação do Corpo de Bombeiros Militar de Pernambuco (COBOM/CBMPE)',
            apresentacaoPadrao: 'Laudo conclusivo de atesto das condições de funcionamento e conformidade das medidas ativas e passivas de segurança contra incêndio para fins de obtenção/renovação do Auto de Vistoria do Corpo de Bombeiros (AVCB).',
            metodologiaPadrao: 'Inspeção física e ensaios práticos nos sistemas de hidrantes, alarmes, iluminação de emergência, sinalização e extintores.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Pressão estática e dinâmica nos hidrantes mais desfavoráveis', status: 'conforme', observacao: 'Pressão dentro dos limites da bomba' },
              { id: 'ck-2', descricao: 'Acionamento do alarme audiovisual e central de comando endereçável', status: 'conforme', observacao: 'Tempo de resposta inferior a 3 segundos' },
              { id: 'ck-3', descricao: 'Autonomia dos blocos autônomos de iluminação de emergência', status: 'conforme', observacao: 'Autonomia superior a 2 horas contínuas' },
            ]
          },
          {
            id: 'laudo-clcb',
            codigo: 'CLCB-SIMP',
            nome: 'Laudo Técnico Simplificado para CLCB',
            normasRef: 'Normas Técnicas CBMPE para Edificações de Baixo Risco',
            apresentacaoPadrao: 'Laudo de responsabilidade técnica para regularização simplificada de imóveis com Certificado de Licença do Corpo de Bombeiros (CLCB).',
            metodologiaPadrao: 'Checklist expedito de itens de segurança elementares (extintores, sinalização básica e iluminação).',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Distribuição e validade das cargas dos extintores portáteis', status: 'conforme', observacao: 'Extintores certificados pelo INMETRO' },
              { id: 'ck-2', descricao: 'Desobstrução total das rotas e saídas de evacuação', status: 'conforme', observacao: 'Rotas livres de materiais inflamáveis' },
            ]
          }
        ]
      },
      {
        id: 'sub-1-3',
        nome: 'Inspeção de Sistemas Específicos',
        tipos: [
          {
            id: 'laudo-comissionamento-incendio',
            codigo: 'COMIS-INC',
            nome: 'Laudo de Comissionamento de Sistemas de Incêndio',
            normasRef: 'ABNT NBR 10897 (Sprinklers), NBR 13714 (Hidrantes), NBR 17240 (Alarme)',
            apresentacaoPadrao: 'Auditoria técnica de entrega e recebimento de obra mecânica de sistemas de proteção contra incêndio.',
            metodologiaPadrao: 'Ensaios hidrostáticos em tubulações, testes de fluxo e vazão em bombas principais e jockey, e teste de disparo de bicos de sprinklers.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Teste hidrostático da tubulação principal a 1.5 vezes a pressão de trabalho', status: 'conforme', observacao: 'Sem queda de pressão durante 2 horas' },
              { id: 'ck-2', descricao: 'Partida automática da bomba de incêndio principal em caso de despressurização', status: 'conforme', observacao: 'Quadro elétrico com partida estrela-triângulo' },
            ]
          },
          {
            id: 'laudo-estanqueidade-gas',
            codigo: 'GAS-ESTANQ',
            nome: 'Laudo de Estanqueidade de Rede de Gás (GLP/GN)',
            normasRef: 'ABNT NBR 15526, NBR 15358 e IT CBMPE',
            apresentacaoPadrao: 'Laudo pericial e ensaio de estanqueidade pneumático para comprovação da integridade e ausência de vazamentos em tubulações de gás combustível.',
            metodologiaPadrao: 'Pressurização da linha com gás inerte (nitrogênio), aferição em manômetro calibrado e teste com solução formadora de bolhas nas conexões.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Pressurização com nitrogênio e monitoramento manométrico durante o tempo normativo', status: 'conforme', observacao: 'Pressão estabilizada sem vazamento perceptível' },
              { id: 'ck-2', descricao: 'Identificação e sinalização amarela da tubulação e válvulas de bloqueio rápido', status: 'conforme', observacao: 'Válvulas de esfera em perfeito estado' },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cat-2',
    numero: 2,
    nome: 'Segurança do Trabalho e Máquinas (Normas Regulamentadoras)',
    icone: 'ShieldCheck',
    descricao: 'Apreciação de riscos HRN, retrofits, laudos de conformidade à NR-12 e inspeções de vasos de pressão e caldeiras (NR-13).',
    subcategorias: [
      {
        id: 'sub-2-1',
        nome: 'Segurança em Máquinas e Equipamentos (NR-12)',
        tipos: [
          {
            id: 'laudo-nr12-hrn',
            codigo: 'NR12-HRN',
            nome: 'Laudo de Apreciação/Análise de Risco (HRN e NBR ISO 12100)',
            normasRef: 'NR-12 (Portaria MTP 4.219/2022), ABNT NBR ISO 12100, NBR ISO 13849-1',
            apresentacaoPadrao: 'Apreciação de riscos de máquinas e equipamentos industriais fundamentada no método HRN (Hazard Rating Number) e princípios da ABNT NBR ISO 12100, visando mitigar perigos à integridade dos operadores.',
            metodologiaPadrao: 'Levantamento geométrico, quantificação de perigos mecânicos e elétricos, cálculo de probabilidade e severidade, e indicação de categoria de segurança (PLr).',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Enclausuramento ou proteções mecânicas em transmissões de força e eixos rotativos', status: 'nao_conforme', observacao: 'Polias expostas requerem coifa metálica fixa com tela' },
              { id: 'ck-2', descricao: 'Dispositivos de parada de emergência monitorados por relé de segurança duplo canal', status: 'conforme', observacao: 'Botão tipo cogumelo com trava na botoeira frontal' },
              { id: 'ck-3', descricao: 'Sinalização e instruções de operação no idioma português em local visível', status: 'conforme', observacao: 'Placas de advertência afixadas na carcaça' }
            ]
          },
          {
            id: 'laudo-nr12-protecoes',
            codigo: 'NR12-PROT',
            nome: 'Laudo de Adequação e Proteção de Proteções Físicas e Intertravamentos',
            normasRef: 'ABNT NBR ISO 14119, NBR ISO 14120, NR-12 item 12.5',
            apresentacaoPadrao: 'Laudo de validação das proteções físicas (fixas e móveis) e chaves de intertravamento de segurança.',
            metodologiaPadrao: 'Medição de distâncias de segurança (NBR ISO 13857) e testes de ruptura positiva e tempo de parada dos movimentos perigosos.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Distância de segurança entre proteções perfuradas e pontos de agarramento', status: 'conforme', observacao: 'Em conformidade com a NBR ISO 13857' },
              { id: 'ck-2', descricao: 'Chaves de segurança com atuador codificado e ruptura positiva nas portas de acesso', status: 'conforme', observacao: 'Desarme instantâneo ao abrir a proteção' }
            ]
          },
          {
            id: 'laudo-nr12-retrofit',
            codigo: 'NR12-RETRO',
            nome: 'Laudo de Validação/Retrofit de Segurança em Máquinas',
            normasRef: 'NR-12, ABNT NBR ISO 13849-1 / 13849-2',
            apresentacaoPadrao: 'Atesto de comissionamento e adequação técnica após modernização (retrofit) mecânica e elétrica do parque fabril.',
            metodologiaPadrao: 'Inspeção pré e pós-instalação, validação funcional da categoria de comando de segurança e ART de projeto e instalação.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Instalação de painel elétrico em extrabaixa tensão de comando (24Vcc)', status: 'conforme', observacao: 'Proteção IP54 com seccionadora com travamento cadeado LOTO' },
              { id: 'ck-2', descricao: 'Reset manual obrigatório após desarme de emergência', status: 'conforme', observacao: 'Sistema não permite religamento automático' }
            ]
          }
        ]
      },
      {
        id: 'sub-2-2',
        nome: 'Equipamentos de Pressão, Caldeiras e Tubulações (NR-13)',
        tipos: [
          {
            id: 'laudo-nr13-vasos',
            codigo: 'NR13-VASO',
            nome: 'Laudo de Inspeção de Integridade de Vasos de Pressão',
            normasRef: 'NR-13 (Portaria MTP 1.846/2022), ASME Seção VIII Div. 1',
            apresentacaoPadrao: 'Inspeção de segurança periódica e extraordinária em vasos de pressão, reservatórios de ar comprimido e acumuladores hidropneumáticos.',
            metodologiaPadrao: 'Exame visual interno e externo, ensaio de medição de espessura por ultrassom, calibração da válvula de segurança (PSV) e manômetro com cálculo de PMTA.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Medição de espessura de costado e tampos através de ultrassom mapeado', status: 'conforme', observacao: 'Espessuras acima da mínima calculada' },
              { id: 'ck-2', descricao: 'Calibração e teste de abertura da Válvula de Segurança (PSV) com lacre', status: 'conforme', observacao: 'Disparo calibrado a 8,5 bar com certificado' },
              { id: 'ck-3', descricao: 'Livro de Registro de Segurança e Placa de Identificação legível', status: 'nao_conforme', observacao: 'Placa desgastada por intempéries; providenciar réplica' }
            ]
          },
          {
            id: 'laudo-nr13-caldeiras',
            codigo: 'NR13-CALD',
            nome: 'Laudo de Inspeção Periódica/Extraordinária de Caldeiras',
            normasRef: 'NR-13, ASME Seção I, ABNT NBR 12177',
            apresentacaoPadrao: 'Inspeção regulamentar de caldeiras a vapor (aquatubulares e flamotubulares) por Profissional Habilitado (PH).',
            metodologiaPadrao: 'Inspeção visual externa e interna com boroscopia, ensaio de partículas magnéticas ou ultrassom nos espelhos e tubos, teste de acumulação e acionamento manual de dispositivos.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Ensaio hidrostático e teste das válvulas de segurança duplas', status: 'conforme', observacao: 'Operação sem desvio' },
              { id: 'ck-2', descricao: 'Sistema de alimentação de água primário e secundário independente', status: 'conforme', observacao: 'Duas bombas em regime de revezamento' }
            ]
          },
          {
            id: 'laudo-nr13-tubulacoes',
            codigo: 'NR13-TUBO',
            nome: 'Laudo de Integridade Estrutural de Tubulações e Tanques de Armazenamento',
            normasRef: 'NR-13 anexo II, ASME B31.3, API 650 / API 653',
            apresentacaoPadrao: 'Inspeção técnica de integridade em linhas de tubulação industrial contendo fluidos perigosos de classes A e B e tanques metálicos de armazenamento.',
            metodologiaPadrao: 'Varredura de corrosão, medição de espessura de parede, análise de suportação mecânica e verificação de pontos críticos de dilatação térmica.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Integridade da suportação metálica e juntas de expansão das linhas', status: 'conforme', observacao: 'Ausência de flechas excessivas' },
              { id: 'ck-2', descricao: 'Medição residual de espessura em curvas e pontos baixos de acúmulo de condensado', status: 'conforme', observacao: 'Desgaste dentro da taxa anual admissível' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cat-3',
    numero: 3,
    nome: 'Máquinas Pesadas / Equipamentos Móveis',
    icone: 'Truck',
    descricao: 'Inspeções e atestados para pás carregadeiras, escavadeiras, guindastes, muncks, empilhadeiras e estruturas de proteção (ROPS/FOPS).',
    subcategorias: [
      {
        id: 'sub-3-1',
        nome: 'Equipamentos de Terraplenagem e Escavação',
        tipos: [
          {
            id: 'laudo-terraplenagem-nr12',
            codigo: 'PESAD-TERRA',
            nome: 'Laudo de Integridade Estrutural e Segurança Operacional (NR-12/NR-18)',
            normasRef: 'NR-12, NR-18, ABNT NBR ISO 6165, NBR ISO 10262',
            apresentacaoPadrao: 'Laudo de inspeção mecânica em escavadeiras hidráulicas, retroescavadeiras e pás-carregadeiras para liberação em canteiros de obras.',
            metodologiaPadrao: 'Inspeção de embuchamentos, pinos, cilindros hidráulicos, trincas estruturais em lanças e chassis e sistema de freio de serviço/estacionamento.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Folgas axiais e radiais em pinos e buchas da articulação de lança/braço', status: 'conforme', observacao: 'Folgas dentro das tolerâncias do fabricante' },
              { id: 'ck-2', descricao: 'Ausência de trincas nas soldas estruturais dos chassis e contrapesos', status: 'conforme', observacao: 'Inspecionado visualmente e sem deformações' },
              { id: 'ck-3', descricao: 'Sinal sonoro de marcha à ré e giroscópio de sinalização luminosa', status: 'conforme', observacao: 'Acionamento automático e audível a 15 metros' }
            ]
          },
          {
            id: 'laudo-rops-fops',
            codigo: 'PESAD-ROPS',
            nome: 'Laudo de Conformidade de Estruturas de Proteção (ROPS/FOPS)',
            normasRef: 'ISO 3471 (ROPS), ISO 3449 (FOPS), NR-12 item 12.15',
            apresentacaoPadrao: 'Atestação da integridade estrutural das cabines e proteções contra capotamento (ROPS) e queda de objetos (FOPS).',
            metodologiaPadrao: 'Verificação da placa original de homologação, ausência de soldas clandestinas, corrosão ou furações não autorizadas nas colunas estruturais.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Placa de identificação ROPS/FOPS preservada com número de série legível', status: 'conforme', observacao: 'Certificação OEM confirmada' },
              { id: 'ck-2', descricao: 'Ausência de pontos de solda caseira ou deformações plásticas nas colunas', status: 'conforme', observacao: 'Estrutura íntegra' }
            ]
          }
        ]
      },
      {
        id: 'sub-3-2',
        nome: 'Equipamentos de Movimentação de Carga e Elevação',
        tipos: [
          {
            id: 'laudo-carga-nr11',
            codigo: 'PESAD-NR11',
            nome: 'Laudo de Liberação e Conformidade NR-11/NR-12',
            normasRef: 'NR-11, NR-12, ABNT NBR 14768 (Muncks), NBR ISO 5053 (Empilhadeiras)',
            apresentacaoPadrao: 'Laudo pericial com emissão de ART para liberação técnica de empilhadeiras a combustão/elétricas e caminhões guindautos (munck).',
            metodologiaPadrao: 'Inspeção estática e dinâmica de mangueiras hidráulicas, garfos, torres de elevação, patolas de estabilização e dispositivos de alívio.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Desgaste do talão dos garfos de empilhadeira (inferior a 10% da espessura original)', status: 'conforme', observacao: 'Medição em 42mm (original 45mm, desgaste em 6.6%)' },
              { id: 'ck-2', descricao: 'Válvulas de retenção de segurança contra queda nos cilindros de elevação', status: 'conforme', observacao: 'Teste de estanqueidade sob pressão aprovado' },
              { id: 'ck-3', descricao: 'Condições do cinto de segurança de 3 pontas e sensor de presença no assento', status: 'conforme', observacao: 'Intertravamento corta tração sem operador' }
            ]
          },
          {
            id: 'laudo-teste-carga',
            codigo: 'LOAD-TEST',
            nome: 'Laudo de Teste de Carga (Load Test) e Estabilidade',
            normasRef: 'ABNT NBR 8400, NBR 14768, OSHA 1910.179',
            apresentacaoPadrao: 'Relatório de prova de carga estática e dinâmica com massa aferida e dinamômetro calibrado para certificar a capacidade nominal.',
            metodologiaPadrao: 'Aplicação progressiva de 100% e 125% da carga nominal, monitoramento de deflexão e registro de estanqueidade hidráulica.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Teste com carga estática a 125% da capacidade máxima por 10 minutos', status: 'conforme', observacao: 'Sem deslizamento de pistões ou empenamento' },
              { id: 'ck-2', descricao: 'Teste dinâmico a 110% com ciclos completos de elevação e giro', status: 'conforme', observacao: 'Operação suave sem ruídos ou trepidações' }
            ]
          }
        ]
      },
      {
        id: 'sub-3-3',
        nome: 'Equipamentos de Pavimentação e Compactação',
        tipos: [
          {
            id: 'laudo-pavimentacao',
            codigo: 'PESAD-PAV',
            nome: 'Laudo de Inspeção Periódica de Manutenção e Segurança',
            normasRef: 'NR-12, ABNT NBR ISO 6165',
            apresentacaoPadrao: 'Inspeção mecânica em rolos compactadores, vibroacabadoras e fresadoras de asfalto.',
            metodologiaPadrao: 'Avaliação dos sistemas de vibração excêntrica, raspadores de tambor, freios e isolamento térmico de motores.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Isolamento de amortecedores de borracha do tambor compactador', status: 'conforme', observacao: 'Coxins sem trincas ou delaminação' },
              { id: 'ck-2', descricao: 'Sistema de aspersão de água nos tambores e esteiras', status: 'conforme', observacao: 'Bicos desobstruídos e pressão adequada' }
            ]
          }
        ]
      },
      {
        id: 'sub-3-4',
        nome: 'Guindastes e Equipamentos de Guindagem',
        tipos: [
          {
            id: 'laudo-acessorios-icamento',
            codigo: 'GUIND-ACES',
            nome: 'Laudo de Integridade Operacional para Acessórios de Içamento',
            normasRef: 'ABNT NBR 13541-1 (Cabos), NBR 15516 (Cintas), NBR 15597 (Manilhas)',
            apresentacaoPadrao: 'Inspeção e descarte normativo de cabos de aço, cintas de poliéster, correntes grau 8/10, manilhas e ganchos forjados.',
            metodologiaPadrao: 'Inspeção dimensional de abertura de garganta de ganchos, contagem de arames rompidos em cabos e ensaio visual/dimensional.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Abertura da garganta do gancho (descarte se superior a 10% do nominal)', status: 'conforme', observacao: 'Garganta em 52mm (nominal 50mm, 4% de aumento - aprovado)' },
              { id: 'ck-2', descricao: 'Trava de segurança do gancho com mola ativa', status: 'conforme', observacao: 'Trava fechada e firme' },
              { id: 'ck-3', descricao: 'Etiqueta indelével de capacidade de carga e rastreabilidade nas cintas', status: 'conforme', observacao: 'Cintas com plaqueta de identificação e laudo do fabricante' }
            ]
          },
          {
            id: 'laudo-lmi-guindaste',
            codigo: 'GUIND-LMI',
            nome: 'Laudo de Aferição do Limitador de Momento de Carga (LMI)',
            normasRef: 'ISO 10245-1, ABNT NBR 16463, NR-12',
            apresentacaoPadrao: 'Aferição do sistema computadorizado indicador de momento de carga (LMI/PAT/Hirschmann) em guindastes rodoviários e telescópicos.',
            metodologiaPadrao: 'Calibração dos sensores de ângulo, comprimento de lança e transdutores de pressão de cilindro mestre.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Corte automático de movimentos perigosos ao atingir 100% da tabela de carga', status: 'conforme', observacao: 'Interrupção imediata dos comandos de descida e estiramento' },
              { id: 'ck-2', descricao: 'Precisão do anemômetro de ponta de lança e alarme de velocidade de vento', status: 'conforme', observacao: 'Aferido com anemômetro padrão' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cat-4',
    numero: 4,
    nome: 'Engenharia Veicular, Perícias e Inspeções de Frota',
    icone: 'Car',
    descricao: 'Inspeções de frotas, laudos para transporte escolar, reclassificação de monta e perícias de sinistro automotivo.',
    subcategorias: [
      {
        id: 'sub-4-1',
        nome: 'Inspeção de Frotas e Segurança Veicular',
        tipos: [
          {
            id: 'laudo-frota-operacional',
            codigo: 'VEIC-FROTA',
            nome: 'Laudo de Inspeção de Frota Operacional (Leves e Utilitários)',
            normasRef: 'Resoluções CONTRAN, Código de Trânsito Brasileiro (CTB), ABNT NBR 14040',
            apresentacaoPadrao: 'Auditoria técnica e mecânica preventiva de frotas corporativas, utilitários e vans para atendimento a requisitos de segurança viária.',
            metodologiaPadrao: 'Avaliação de suspensão, sistema de frenagem, direção, pneumáticos, emissões visíveis e integridade de chassi.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Profundidade dos sulcos dos pneus (TWI superior a 1,6 mm)', status: 'conforme', observacao: 'Pneus com sulco médio de 4,2mm' },
              { id: 'ck-2', descricao: 'Eficiência e equilíbrio do sistema de freios em pista ou frenômetro', status: 'conforme', observacao: 'Sem desvio de trajetória' },
              { id: 'ck-3', descricao: 'Integridade de luzes de freio, setas, faróis e iluminação de placa', status: 'conforme', observacao: 'Sistema elétrico 100% operacional' }
            ]
          },
          {
            id: 'laudo-transporte-escolar',
            codigo: 'VEIC-ESC',
            nome: 'Laudo Técnico para Transporte Escolar',
            normasRef: 'Art. 136 a 139 do CTB, Portarias DETRAN-PE, ABNT NBR 15320',
            apresentacaoPadrao: 'Laudo pericial de inspeção semestral obrigatória para veículos destinados à condução coletiva de escolares.',
            metodologiaPadrao: 'Verificação minuciosa dos cintos de segurança em todos os assentos, tacógrafo selado pelo INMETRO, faixas identificadoras e janelas com abertura limitada.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Tacógrafo aferido e lacrado com certificado INMETRO vigente', status: 'conforme', observacao: 'Certificado com validade até 2027' },
              { id: 'ck-2', descricao: 'Cintos de segurança individuais subabdominais ou de 3 pontos para todos os passageiros', status: 'conforme', observacao: 'Todos os fechos com engate rápido funcionando' },
              { id: 'ck-3', descricao: 'Dispositivo limitador de abertura de vidros laterais em no máximo 10 cm', status: 'conforme', observacao: 'Travas mecânicas instaladas' }
            ]
          }
        ]
      },
      {
        id: 'sub-4-2',
        nome: 'Perícias Veiculares e Modificações Tecnológicas',
        tipos: [
          {
            id: 'laudo-reclassificacao-monta',
            codigo: 'VEIC-MONTA',
            nome: 'Laudo Pericial de Reclassificação de Monta Veicular',
            normasRef: 'Resolução CONTRAN nº 810/2020 e Portarias SENATRAN',
            apresentacaoPadrao: 'Laudo pericial de engenharia mecânica para instrução de processo de reclassificação de dano veicular (Pequena, Média ou Grande Monta) perante o DETRAN.',
            metodologiaPadrao: 'Preenchimento do Relatório de Avarias oficial do CONTRAN, medição de alinhamento de longarinas com gabarito de chassi e documentação fotográfica detalhada.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Avaliação estrutural da longarina dianteira e pontos de ancoragem da suspensão', status: 'conforme', observacao: 'Ausência de fraturas ou torção no aço estrutural' },
              { id: 'ck-2', descricao: 'Análise de colunas A, B e C, soleiras e teto do habitáculo', status: 'conforme', observacao: 'Deformação restrita a componentes externos parafusados' },
              { id: 'ck-3', descricao: 'Enquadramento da pontuação total nos termos da Resolução CONTRAN 810/2020', status: 'conforme', observacao: 'Pontuação classificada conclusivamente como Pequena Monta' }
            ]
          },
          {
            id: 'laudo-sinistro-veicular',
            codigo: 'VEIC-SINISTRO',
            nome: 'Laudo de Avaliação de Sinistro Veicular e Danos Estruturais',
            normasRef: 'ABNT NBR 13771, Resoluções CONTRAN, Procedimentos de Engenharia Diagnóstica',
            apresentacaoPadrao: 'Perícia judicial/extrajudicial para determinação de causa de sinistro automotivo, falha mecânica pré-existente ou mensuração de danos para cobertura securitária.',
            metodologiaPadrao: 'Exame metalográfico preliminar de quebra de componentes (pivô, barra de direção, freio) e reconstrução cinemática de impacto.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Inspeção de peças de direção e suspensão para identificar fratura dúctil vs fadiga', status: 'conforme', observacao: 'Ruptura consequente ao impacto, e não causadora' },
              { id: 'ck-2', descricao: 'Estimativa orçamentária pericial e percentual de perda do valor venal', status: 'conforme', observacao: 'Danos compatíveis com o relato da colisão' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cat-5',
    numero: 5,
    nome: 'Climatização, Qualidade do Ar e Manutenção Predial/Industrial',
    icone: 'Wind',
    descricao: 'PMOC regulamentar (Lei 13.589/2018), auditoria de climatização, qualidade do ar e diagnóstico de manutenção predial/industrial.',
    subcategorias: [
      {
        id: 'sub-5-1',
        nome: 'Gestão de Climatização (PMOC)',
        tipos: [
          {
            id: 'laudo-pmoc-completo',
            codigo: 'PMOC-LEI',
            nome: 'Laudo e Plano de PMOC (Lei 13.589/2018)',
            normasRef: 'Lei Federal 13.589/2018, Portaria MS nº 3.523/1998, RE 09/2003 ANVISA, ABNT NBR 16401',
            apresentacaoPadrao: 'Plano de Manutenção, Operação e Controle (PMOC) e respectivo Laudo Técnico com ART para sistemas de climatização com capacidade térmica superior a 60.000 BTU/h (5 TR).',
            metodologiaPadrao: 'Inventário térmico dos aparelhos (Split, VRF, Chiller, Fancoil), definição do cronograma de rotinas de higienização de filtros, bandejas e verificação de renovação de ar externo.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Estado de limpeza e integridade das serpentinas e aletas dos evaporadores', status: 'conforme', observacao: 'Higienização química com bactericida neutro realizada' },
              { id: 'ck-2', descricao: 'Desobstrução e caimento correto das tubulações de drenagem de condensado', status: 'conforme', observacao: 'Bandejas sem água estagnada ou limo' },
              { id: 'ck-3', descricao: 'Existência de tomada e filtragem mecânica para ar de renovação externa (G4)', status: 'conforme', observacao: 'Taxa de renovação conforme NBR 16401-3' }
            ]
          },
          {
            id: 'laudo-qualidade-ar',
            codigo: 'PMOC-AR',
            nome: 'Laudo de Inspeção Técnico-Sanitária e Qualidade do Ar',
            normasRef: 'Resolução ANVISA RE nº 09/2003, ABNT NBR 16401',
            apresentacaoPadrao: 'Avaliação dos parâmetros físicos, químicos e biológicos do ar climatizado em ambientes de uso público e coletivo.',
            metodologiaPadrao: 'Aferição de temperatura de bulbo seco, umidade relativa, velocidade do ar, concentração de dióxido de carbono (CO₂) e coleta microbiológica por laboratório credenciado.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Concentração de CO₂ nos recintos (máximo 1.000 ppm recomendável)', status: 'conforme', observacao: 'Média medida em 680 ppm' },
              { id: 'ck-2', descricao: 'Faixa de umidade relativa do ar entre 40% e 65%', status: 'conforme', observacao: 'Umidade estabilizada em 54%' },
              { id: 'ck-3', descricao: 'Relação Fungos Ar Interno / Ar Externo (razão I/E menor ou igual a 1,5)', status: 'conforme', observacao: 'Laudo laboratorial em anexo atestando conformidade' }
            ]
          }
        ]
      },
      {
        id: 'sub-5-2',
        nome: 'Gestão de Manutenção e Auditorias de Engenharia',
        tipos: [
          {
            id: 'laudo-art-manutencao',
            codigo: 'MANUT-ART',
            nome: 'Laudo com ART de Manutenção e Liberação',
            normasRef: 'Resoluções CONFEA/CREA, ABNT NBR 5674',
            apresentacaoPadrao: 'Emissão de Laudo de Responsabilidade Técnica de Engenharia Mecânica para acompanhamento, liberação de reformas e serviços de manutenção predial e industrial.',
            metodologiaPadrao: 'Auditoria de procedimentos operacionais padrão (POP), verificação de ARTs de terceiros e liberação formal de equipamentos sob guarda.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Conformidade da equipe executante e qualificação técnica', status: 'conforme', observacao: 'Técnicos certificados com NR-10 e NR-35' },
              { id: 'ck-2', descricao: 'Emissão de Ordem de Serviço com plano de testes de funcionamento', status: 'conforme', observacao: 'Comprovantes arquivados no prontuário' }
            ]
          },
          {
            id: 'laudo-maturidade-pcm',
            codigo: 'MANUT-PCM',
            nome: 'Laudo de Diagnóstico de Maturidade em Gestão de Ativos (PCM/ISO 55001)',
            normasRef: 'ABNT NBR ISO 55001, Métricas de Confiabilidade (MTBF, MTTR)',
            apresentacaoPadrao: 'Consultoria diagnóstica de planejamento e controle de manutenção (PCM) para plantas industriais e edifícios corporativos.',
            metodologiaPadrao: 'Análise de criticidade de ativos (Matriz GUT), cálculo de indicadores de disponibilidade, backlog e custos operacionais (Opex).',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Aderência ao plano mestre de manutenção preventiva superior a 85%', status: 'conforme', observacao: 'Aderência média apurada em 89%' },
              { id: 'ck-2', descricao: 'Existência de controle sistematizado de sobressalentes críticos em almoxarifado', status: 'conforme', observacao: 'Itens classificados por curva ABC' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cat-6',
    numero: 6,
    nome: 'Playground e Lazer',
    icone: 'Smile',
    descricao: 'Inspeções normativas ABNT NBR 16071 para brinquedos de parques infantis, condomínios, clubes e escolas.',
    subcategorias: [
      {
        id: 'sub-6-1',
        nome: 'Segurança em Áreas de Recreação Infantis',
        tipos: [
          {
            id: 'laudo-playground-nbr16071',
            codigo: 'PLAY-NBR',
            nome: 'Laudo Técnico de Inspeção de Playground (ABNT NBR 16071)',
            normasRef: 'ABNT NBR 16071 partes 1 a 7 (Playgrounds), Lei Estadual / Municipal de Segurança em Brinquedos',
            apresentacaoPadrao: 'Laudo pericial com ART de inspeção física em áreas de recreação infantil em condomínios residenciais, escolas, shopping centers e parques públicos de Pernambuco.',
            metodologiaPadrao: 'Aplicação de gabaritos normativos para testes de aprisionamento de cabeça e pescoço, dedos e roupas, medição da área de impacto e ensaio do piso amortecedor.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Uso de sondas normalizadas para verificar riscos de aprisionamento de cabeça e pescoço', status: 'conforme', observacao: 'Todas as aberturas respeitam as dimensões da NBR 16071-2' },
              { id: 'ck-2', descricao: 'Piso absorvedor de impacto e espessura da camada amortecedora sob os brinquedos altos', status: 'conforme', observacao: 'Gramado sintético com manta emborrachada amortecedora adequada para altura crítica de queda' },
              { id: 'ck-3', descricao: 'Ausência de farpas em madeiras, corrosão perfurante em metais e quinas vivas', status: 'conforme', observacao: 'Bordas arredondadas com raio mínimo de 3mm' }
            ]
          },
          {
            id: 'laudo-playground-risco',
            codigo: 'PLAY-RISCO',
            nome: 'Laudo de Análise de Risco e Manutenção Corretiva',
            normasRef: 'ABNT NBR 16071-7 (Inspeção, Manutenção e Operação)',
            apresentacaoPadrao: 'Plano de ação corretivo e classificação de risco para brinquedos com desgaste mecânico severo, visando reforma estrutural ou interdição temporária.',
            metodologiaPadrao: 'Mapeamento de folgas em correntes de balanços, estabilidade de ancoragem das sapatas de concreto e substituição de ferragens oxidadas.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Estabilidade estrutural das fundações e ancoragens ao solo dos pórticos de balanço', status: 'conforme', observacao: 'Bases de concreto firmes sem tombamento' },
              { id: 'ck-2', descricao: 'Espessura e integridade dos elos de correntes de sustentação de balanços', status: 'nao_conforme', observacao: 'Elo desgastado com perda superior a 30% da bitola; substituir' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cat-7',
    numero: 7,
    nome: 'Estruturas Metálicas, Caldeiraria e Soldagem',
    icone: 'Hammer',
    descricao: 'Inspeção de galpões, coberturas industriais, mezaninos, qualificação de solda e ensaios não destrutivos (END).',
    subcategorias: [
      {
        id: 'sub-7-1',
        nome: 'Integridade de Estruturas e Galpões',
        tipos: [
          {
            id: 'laudo-galpao-metalico',
            codigo: 'ESTR-GALP',
            nome: 'Laudo de Integridade Estrutural de Galpões e Coberturas Metálicas',
            normasRef: 'ABNT NBR 8800 (Estruturas de Aço), NBR 6123 (Forças devidas ao vento), NBR 14762',
            apresentacaoPadrao: 'Inspeção técnica e pericial para verificação da estabilidade estrutural de tesouras, terças, contraventamentos e telhados de galpões industriais.',
            metodologiaPadrao: 'Varredura por drones/acesso por corda, análise de flechas de deformação, aperto de parafusos estruturais e mapeamento de corrosão galvânica.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Integridade dos contraventamentos horizontais e verticais de cobertura', status: 'conforme', observacao: 'Tirantes tensionados sem folgas' },
              { id: 'ck-2', descricao: 'Estado das ligações parafusadas e nós de emenda das tesouras principais', status: 'conforme', observacao: 'Parafusos ASTM A325 com torque inspecionado' }
            ]
          },
          {
            id: 'laudo-capacidade-piso',
            codigo: 'ESTR-PISO',
            nome: 'Laudo de Capacidade de Carga de Pisos Industriais e Mezaninos',
            normasRef: 'ABNT NBR 6120 (Cargas para o cálculo de edificações), NBR 8800',
            apresentacaoPadrao: 'Determinação pericial da capacidade máxima admissível de carga concentrada e distribuída (kgf/m²) em mezaninos metálicos e pavimentos industriais.',
            metodologiaPadrao: 'Modelagem de cálculo estrutural com base nos perfis metálicos I/W instalados, vão livre e verificação de flechas sob carregamento.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Capacidade de carga distribuída calculada em conformidade com o projeto', status: 'conforme', observacao: 'Carga máxima homologada em 500 kgf/m²' },
              { id: 'ck-2', descricao: 'Fixação e ancoragem das colunas de sustentação à laje base', status: 'conforme', observacao: 'Chumbadores químicos intactos' }
            ]
          }
        ]
      },
      {
        id: 'sub-7-2',
        nome: 'Qualificação de Soldagem e Ensaios Não Destrutivos (END)',
        tipos: [
          {
            id: 'laudo-inspecao-solda',
            codigo: 'SOLDA-VISUAL',
            nome: 'Laudo de Inspeção de Solda (Visual e Dimensional)',
            normasRef: 'AWS D1.1 (Structural Welding Code - Steel), ASME Seção IX',
            apresentacaoPadrao: 'Inspeção técnica de juntas soldadas em estruturas industriais, caldeiraria e tubulações.',
            metodologiaPadrao: 'Uso de gabaritos de solda tipo Cambridge para medição de perna, garganta, reforço de solda e identificação de mordeduras ou respingos.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Ausência de trincas, porosidades e mordeduras superficiais no cordão', status: 'conforme', observacao: 'Cordão contínuo e uniforme' },
              { id: 'ck-2', descricao: 'Dimensões da perna de solda compatíveis com o projeto mecânico', status: 'conforme', observacao: 'Garganta de solda com espessura especificada' }
            ]
          },
          {
            id: 'laudo-ensaios-end',
            codigo: 'SOLDA-END',
            nome: 'Laudo de Ensaios Não Destrutivos (LP/PM/US/RX)',
            normasRef: 'ABNT NBR NM 334 (LP), NBR NM 342 (PM), NBR ISO 9712',
            apresentacaoPadrao: 'Laudo de ensaio por Líquido Penetrante (LP), Partículas Magnéticas (PM) ou Ultrassom (US) para detecção de descontinuidades subsuperficiais.',
            metodologiaPadrao: 'Limpeza prévia, aplicação de penetrante/revelador ou campo magnético com partículas fluorescentes e inspeção sob luz branca/negra.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Ensaio por Líquido Penetrante executado em 100% das soldas críticas', status: 'conforme', observacao: 'Nenhuma indicação de trinca linear detectada' },
              { id: 'ck-2', descricao: 'Mapeamento das juntas inspecionadas e registro fotográfico sob luz calibrada', status: 'conforme', observacao: 'Evidências anexadas ao dossiê técnico' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cat-8',
    numero: 8,
    nome: 'Equipamentos de Elevação e Movimentação Industrial (Estáticos/Fixos)',
    icone: 'Layers',
    descricao: 'Pontes rolantes, pórticos, talhas elétricas, vida útil (SWP), elevadores de carga e dispositivos de içamento.',
    subcategorias: [
      {
        id: 'sub-8-1',
        nome: 'Pontes Rolantes e Pórticos (NR-11)',
        tipos: [
          {
            id: 'laudo-ponte-rolante',
            codigo: 'ELEV-PONTE',
            nome: 'Laudo de Integridade e Segurança de Pontes Rolantes e Pórticos Rolantes',
            normasRef: 'ABNT NBR 8400, NBR 16147, NR-11, NR-12',
            apresentacaoPadrao: 'Inspeção mecânica, estrutural e elétrica em pontes rolantes univiga e dupla viga, pórticos e semi-pórticos industriais.',
            metodologiaPadrao: 'Inspeção de vigas de rolamento, trilhos, batentes de fim de curso, freios de translação e elevação, cabo de aço e enrolador.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Chaves de fim de curso de elevação e translação duplamente monitoradas', status: 'conforme', observacao: 'Fim de curso por engrenagem e gravidade operacionais' },
              { id: 'ck-2', descricao: 'Desgaste e alinhamento dos trilhos de rolamento e batentes de extremidade', status: 'conforme', observacao: 'Batentes amortecedores com elastômero intacto' },
              { id: 'ck-3', descricao: 'Freio eletromagnético de elevação com retenção de 150% da carga nominal', status: 'conforme', observacao: 'Pastilhas de freio com desgaste regular' }
            ]
          },
          {
            id: 'laudo-vida-util-swp',
            codigo: 'ELEV-SWP',
            nome: 'Laudo de Análise de Vida Útil Remanescente (SWP)',
            normasRef: 'ISO 12482 (Crane - Condition monitoring), FEM 9.755',
            apresentacaoPadrao: 'Cálculo analítico do Período Seguro de Trabalho (Safe Working Period - SWP) para mecanismos de elevação e talhas de pontes rolantes.',
            metodologiaPadrao: 'Coleta de dados de horas de operação, espectro de carga médio, ciclos por hora e cálculo da classe FEM do mecanismo.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Percentual de vida útil de projeto consumida pela talha principal', status: 'conforme', observacao: 'Consumo atual estimado em 42% do ciclo de vida FEM 2m' },
              { id: 'ck-2', descricao: 'Previsão matemática de tempo para revisão geral (overhaul mecânico)', status: 'conforme', observacao: 'Próxima revisão maior recomendada em 36 meses' }
            ]
          }
        ]
      },
      {
        id: 'sub-8-2',
        nome: 'Elevadores e Dispositivos de Carga Industrial',
        tipos: [
          {
            id: 'laudo-elevador-carga',
            codigo: 'ELEV-MONTA',
            nome: 'Laudo de Inspeção de Elevadores de Cargas e Monta-Cargas',
            normasRef: 'ABNT NBR 14712 (Elevadores de carga e monta-cargas), NR-11',
            apresentacaoPadrao: 'Inspeção de segurança em elevadores de carga industriais e monta-cargas hidráulicos ou a cabo.',
            metodologiaPadrao: 'Verificação do freio de segurança (cunha de frenagem), portas de pavimento intertravadas, guias e limites.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Intertravamento das portas de pavimento impedindo abertura com cabine em movimento', status: 'conforme', observacao: 'Chaves elétricas de travamento funcionando' },
              { id: 'ck-2', descricao: 'Teste do aparelho de segurança (freio de segurança do carro por cabo frouxo)', status: 'conforme', observacao: 'Bloqueio mecânico instantâneo ativado no teste' }
            ]
          },
          {
            id: 'laudo-dispositivos-icamento',
            codigo: 'ELEV-DISP',
            nome: 'Laudo de Dispositivos de Içamento (Olhais, Balancins e Travessões)',
            normasRef: 'ABNT NBR 8400, ASME B30.20 (Below-the-Hook Lifting Devices)',
            apresentacaoPadrao: 'Projeto, cálculo estrutural e laudo de homologação com ART de balancins de içamento, travessões de carga e olhais soldados.',
            metodologiaPadrao: 'Análise de tensões de Von Mises por elementos finitos (FEA), teste de carga com dinamômetro e ensaio de LP nas soldas dos olhais.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Marcação permanente da Capacidade Máxima de Carga (CMT) em ambos os lados', status: 'conforme', observacao: 'Pintura visível indicando 10.000 kg' },
              { id: 'ck-2', descricao: 'Inspeção por Líquido Penetrante nos olhais de sustentação primários', status: 'conforme', observacao: 'Soldas aprovadas sem indicação de trincas' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cat-9',
    numero: 9,
    nome: 'Vasos, Tanques e Redes de Fluidos Especializados',
    icone: 'Database',
    descricao: 'Redes de amônia (NH3), tubulações de fluidos de processo, testes de pressão hidrostática e ultrassom de espessura.',
    subcategorias: [
      {
        id: 'sub-9-1',
        nome: 'Tubulações de Processo e Redes Industriais',
        tipos: [
          {
            id: 'laudo-pressao-hidrostatica',
            codigo: 'FLUID-TEST',
            nome: 'Laudo de Teste de Estanqueidade e Pressão Hidrostática/Pneumática',
            normasRef: 'ASME B31.3 (Process Piping), NR-13',
            apresentacaoPadrao: 'Execução e emissão de laudo pericial de teste hidrostático em linhas industriais recém-montadas ou sob manutenção.',
            metodologiaPadrao: 'Injeção de água desmineralizada com bomba de teste manual/elétrica, monitoramento de pressão por registrador gráfico ou digital calibrado.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Pressão de ensaio mantida durante o tempo de patamar estipulado em norma', status: 'conforme', observacao: 'Estabilidade de 15 bar por 60 minutos' },
              { id: 'ck-2', descricao: 'Inspeção de juntas flangeadas e conexões roscadas sob pressão', status: 'conforme', observacao: 'Sem gotejamento ou orvalhamento' }
            ]
          },
          {
            id: 'laudo-refrigeracao-amonia',
            codigo: 'FLUID-NH3',
            nome: 'Laudo de Vistoria de Sistemas de Refrigeração por Amônia (NH₃)',
            normasRef: 'NR-36, NR-13, ABNT NBR 16069 (Sistemas de refrigeração para amônia), IIAR',
            apresentacaoPadrao: 'Inspeção pericial de segurança mecânica em salas de compressores, condensadores evaporativos e tanques acumuladores de amônia.',
            metodologiaPadrao: 'Verificação de detectores de vazamento de NH₃, ventilação de emergência forçada, válvulas de alívio duplas e chuveiro lava-olhos.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Válvulas de segurança de duplo estágio conectadas à coluna de descarga atmosférica', status: 'conforme', observacao: 'Tubulação de alívio direcionada conforme norma' },
              { id: 'ck-2', descricao: 'Sensores eletroquímicos de gás amônia com alarme sonoro e intertravamento', status: 'conforme', observacao: 'Disparo da exaustão forçada confirmado em teste' }
            ]
          }
        ]
      },
      {
        id: 'sub-9-2',
        nome: 'Análise de Corrosão e Espessura',
        tipos: [
          {
            id: 'laudo-ultrassom-espessura',
            codigo: 'FLUID-US',
            nome: 'Laudo de Medição de Espessura por Ultrassom (Mapeamento de Corrosão)',
            normasRef: 'ABNT NBR NM 330, ASME Seção V Artigo 5, API 570',
            apresentacaoPadrao: 'Mapeamento de perda de espessura por corrosão interna/externa em tubulações, dutos e chapas metálicas industriais.',
            metodologiaPadrao: 'Ensaio pontual com medidor digital por ultrassom e cabeçote duplo cristal com acoplante, gerando mapa de isócoras de desgaste.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Calibração do medidor de ultrassom com bloco escalonado padrão antes do ensaio', status: 'conforme', observacao: 'Calibração aferida com precisão de 0,01 mm' },
              { id: 'ck-2', descricao: 'Espessura remanescente nos pontos críticos superior à espessura de descarte', status: 'conforme', observacao: 'Margem de segurança para mais 24 meses de operação' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cat-10',
    numero: 10,
    nome: 'Perícias Mecânicas Judicial e Extrajudicial (Análise de Falhas)',
    icone: 'Search',
    descricao: 'Análise de quebras mecânicas (RCA), investigação de incêndio/explosão mecânica e avaliação de ativos (NBR 14653-5).',
    subcategorias: [
      {
        id: 'sub-10-1',
        nome: 'Metalurgia e Análise de Quebras',
        tipos: [
          {
            id: 'laudo-analise-falha-rca',
            codigo: 'PER-RCA',
            nome: 'Laudo Pericial de Análise de Falha Mecânica (Root Cause Analysis)',
            normasRef: 'ASM Handbook Vol. 11 (Failure Analysis and Prevention), ABNT NBR ISO 9001',
            apresentacaoPadrao: 'Investigação pericial forense para determinação da causa-raiz de quebra catastrófica de eixos, engrenagens, rolamentos e motores industriais.',
            metodologiaPadrao: 'Análise fractográfica das marcas de praia (fadiga), cavidades de inclusão, sobrecarga mecânica e histórico operacional de lubrificação.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Caracterização da superfície de fratura (fadiga por flexão rotativa, torção ou impacto)', status: 'conforme', observacao: 'Marcas de progressão de trinca iniciadas em concentrador de tensão' },
              { id: 'ck-2', descricao: 'Análise das condições de lubrificação e temperatura operacional no momento da quebra', status: 'conforme', observacao: 'Identificada contaminação abrasiva no lubrificante' }
            ]
          },
          {
            id: 'laudo-incendio-mecanico',
            codigo: 'PER-INC',
            nome: 'Laudo de Incêndio/Explosão por Origem Mecânica ou Térmica',
            normasRef: 'NFPA 921 (Guide for Fire and Explosion Investigations), ABNT NBR 13771',
            apresentacaoPadrao: 'Perícia para identificação do ponto de ignição e causa mecânica de incêndio em máquinas, salas de máquinas ou veículos.',
            metodologiaPadrao: 'Exame de atrito metal-metal, superaquecimento de mancais, vazamento de fluido inflamável sob pressão sobre superfícies quentes.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Determinação da área de origem através do padrão de queima e queima diferencial', status: 'conforme', observacao: 'Origem localizada no mancal do ventilador primário' },
              { id: 'ck-2', descricao: 'Evidência física de travamento mecânico causador de atrito e faísca térmica', status: 'conforme', observacao: 'Soldagem a frio de rolamento fundido atestada' }
            ]
          }
        ]
      },
      {
        id: 'sub-10-2',
        nome: 'Avaliação de Bens e Engenharia de Avaliações',
        tipos: [
          {
            id: 'laudo-valoracao-ativos',
            codigo: 'PER-VALOR',
            nome: 'Laudo de Avaliação do Estado de Conservação e Valoração de Ativos (ABNT NBR 14653-5)',
            normasRef: 'ABNT NBR 14653-5 (Avaliação de bens - Máquinas, equipamentos, instalações e bens industriais)',
            apresentacaoPadrao: 'Avaliação patrimonial pericial com determinação do valor de mercado, valor de liquidação forçada e depreciação física de máquinas e frotas.',
            metodologiaPadrao: 'Método comparativo direto de dados de mercado conjugado ao método do custo de reposição depreciado (Critério de Heidecke).',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Inventário físico com conferência de placas, números de série e ano de fabricação', status: 'conforme', observacao: '100% dos ativos localizados e identificados' },
              { id: 'ck-2', descricao: 'Determinação do estado de conservação conforme tabela de Heidecke', status: 'conforme', observacao: 'Estado classificado como regular/bom com fator 0,81' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cat-11',
    numero: 11,
    nome: 'Grupos Geradores e Máquinas Térmicas',
    icone: 'Zap',
    descricao: 'Conformidade de geradores de energia de emergência, atenuação acústica, opacidade e poluentes de motores a combustão.',
    subcategorias: [
      {
        id: 'sub-11-1',
        nome: 'Automação e Utilidades',
        tipos: [
          {
            id: 'laudo-geradores-conformidade',
            codigo: 'TERM-GERAD',
            nome: 'Laudo de Conformidade de Grupos Geradores',
            normasRef: 'ABNT NBR ISO 8528 (Grupos geradores de corrente alternada acionados por motor térmico), NR-10, NR-12',
            apresentacaoPadrao: 'Laudo de inspeção e comissionamento de grupos geradores a diesel/gás instalados em hospitais, condomínios e indústrias.',
            metodologiaPadrao: 'Testes de transferência automática (QTA), tempo de partida a frio, estanqueidade do tanque de combustível diário e bacia de contenção.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Quadro de Transferência Automática (QTA) com intertravamento mecânico e elétrico', status: 'conforme', observacao: 'Tempo de comutação inferior a 8 segundos' },
              { id: 'ck-2', descricao: 'Bacia de contenção sob o tanque de óleo diesel com capacidade para 110% do volume', status: 'conforme', observacao: 'Bacia impermeável e com válvula de dreno fechada' }
            ]
          },
          {
            id: 'laudo-opacidade-motores',
            codigo: 'TERM-OPAC',
            nome: 'Laudo de Opacidade e Emissão de Poluentes de Motores Estacionários',
            normasRef: 'Resolução CONAMA nº 382/2006, ABNT NBR 13037, NBR 12897',
            apresentacaoPadrao: 'Medição de fumaça preta (opacidade) em escapamentos de geradores e motores industriais para licenciamento ambiental CPRH.',
            metodologiaPadrao: 'Ensaio com opacímetro de fluxo parcial ou escala Ringelmann sob carga constante.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Coeficiente de absorção de luz (k) dentro dos limites ambientais', status: 'conforme', observacao: 'Medição apurada em 0,42 m⁻¹ (limite 1,18 m⁻¹)' },
              { id: 'ck-2', descricao: 'Atenuação acústica da carenagem acústica nos limites perimetrais', status: 'conforme', observacao: 'Nível de ruído a 1,5m inferior a 75 dB(A)' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cat-12',
    numero: 12,
    nome: 'Acessibilidade e Engenharia Legal Aplicada',
    icone: 'CheckCircle2',
    descricao: 'Elevadores sociais, plataformas elevatórias acessíveis, escadas mecânicas e laudos acústicos industriais e ambientais.',
    subcategorias: [
      {
        id: 'sub-12-1',
        nome: 'Mobilidade Técnica e Acústica',
        tipos: [
          {
            id: 'laudo-elevadores-acessibilidade',
            codigo: 'ACES-ELEV',
            nome: 'Laudo de Inspeção Técnica de Elevadores Sociais, Plataformas Acessíveis e Escadas Mecânicas (ABNT NBR 207 / NBR NM 313)',
            normasRef: 'ABNT NBR NM 207, NBR NM 313 (Acessibilidade em elevadores), NBR 9050, Lei Brasileira de Inclusão',
            apresentacaoPadrao: 'Inspeção mecânica e atestado anual de segurança e acessibilidade para elevadores sociais, plataformas de translação vertical e esteiras rolantes.',
            metodologiaPadrao: 'Verificação de limites de nivelamento de piso, botão de emergência com intercomunicador funcional, sintetizador de voz e freio de segurança.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Precisão de parada e nivelamento da cabine em relação ao piso do pavimento (± 5 mm)', status: 'conforme', observacao: 'Nivelamento aferido com gabarito' },
              { id: 'ck-2', descricao: 'Iluminação de emergência e botão de socorro com chamada remota ativa', status: 'conforme', observacao: 'Interfone com portaria operacional' },
              { id: 'ck-3', descricao: 'Informações em Braille e relevo nos botões da botoeira de cabine e pavimentos', status: 'conforme', observacao: 'Conforme ABNT NBR 9050' }
            ]
          },
          {
            id: 'laudo-ruido-vibracao',
            codigo: 'ACES-RUIDO',
            nome: 'Laudo de Ruído Ambiental e Vibração Industrial (NBR 10151/NBR 10152)',
            normasRef: 'ABNT NBR 10151 (Avaliação do ruído em áreas habitadas), NBR 10152, NR-15',
            apresentacaoPadrao: 'Medição sonométrica e emissão de laudo pericial para atendimento a notificações ambientais, queixas de vizinhança ou conforto acústico corporativo.',
            metodologiaPadrao: 'Aferição com sonômetro (decibelímetro) integrador Tipo 1 com calibrador acústico acoplado, medição dos níveis LAeq diurno e noturno.',
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Nível sonoro equivalente corrigido (RLC) no limite perimetral da propriedade', status: 'conforme', observacao: 'Abaixo do limite de 55 dB(A) para zona mista' },
              { id: 'ck-2', descricao: 'Calibração de campo do sonômetro antes e após as medições registradas', status: 'conforme', observacao: 'Desvio menor que 0,2 dB' }
            ]
          }
        ]
      }
    ]
  }
];
