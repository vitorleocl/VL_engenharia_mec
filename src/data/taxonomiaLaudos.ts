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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Levantamento Arquitetônico (plantas, áreas por pavimento, pé-direito, número de pavimentos, altura da edificação)', ordem: 1 },
              { id: 'sec-2', titulo: '2. Classificação da Edificação (ocupação, grupo/divisão, carga de incêndio de referência) conforme IT CBMPE', ordem: 2 },
              { id: 'sec-3', titulo: '3. Verificação de Isolamento de Risco e Acesso de Viaturas', ordem: 3 },
              { id: 'sec-4', titulo: '4. Diagnóstico de Sistemas Preventivos Existentes', ordem: 4 },
              { id: 'sec-5', titulo: '5. Levantamento do Reservatório de Água para Incêndio (RTI)', ordem: 5 },
              { id: 'sec-6', titulo: '6. Recomendações Preliminares e Memorial Descritivo para Elaboração do Projeto de PPCI', ordem: 6 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Planta baixa atualizada e compatível com a edificação real', status: 'conforme', observacao: 'Documentação gráfica conferida in loco' },
              { id: 'ck-2', descricao: 'Área construída por pavimento medida/conferida', status: 'conforme', observacao: 'Conferência métrica realizada' },
              { id: 'ck-3', descricao: 'Altura da edificação determinada', status: 'conforme', observacao: 'Altura da soleira ao piso do último pavimento habitável aferida' },
              { id: 'ck-4', descricao: 'Número de pavimentos e uso de cada um identificado', status: 'conforme', observacao: 'Usos e acessos documentados' },
              { id: 'ck-5', descricao: 'Classificação de ocupação (Grupo/Divisão) definida conforme IT estadual', status: 'conforme', observacao: 'Grupo e divisão definidos pela IT 01/CBMPE' },
              { id: 'ck-6', descricao: 'Carga de incêndio de referência da ocupação identificada', status: 'conforme', observacao: 'Carga levantada em MJ/m²' },
              { id: 'ck-7', descricao: 'Isolamento de risco (afastamento entre edificações) avaliado', status: 'conforme', observacao: 'Afastamentos entre blocos verificados' },
              { id: 'ck-8', descricao: 'Acesso de viaturas do Corpo de Bombeiros verificado (largura, raio de giro, resistência do piso)', status: 'conforme', observacao: 'Portões e vias de acesso comportam viaturas' },
              { id: 'ck-9', descricao: 'Reservatório de água para incêndio identificado (capacidade e exclusividade)', status: 'conforme', observacao: 'Capacidade técnica de RTI confirmada' },
              { id: 'ck-10', descricao: 'Sistema de hidrantes existente avaliado (se houver)', status: 'conforme', observacao: 'Estado das caixas e tubulações periciado' },
              { id: 'ck-11', descricao: 'Sistema de alarme/detecção existente avaliado (se houver)', status: 'conforme', observacao: 'Pontos existentes inventariados' },
              { id: 'ck-12', descricao: 'Saídas de emergência mapeadas preliminarmente', status: 'conforme', observacao: 'Rotas de fuga e distâncias máximas preliminares conferidas' },
              { id: 'ck-13', descricao: 'SPDA (sistema de proteção contra descargas atmosféricas) avaliado', status: 'conforme', observacao: 'Existência e descidas de SPDA verificadas' },
              { id: 'ck-14', descricao: 'Compartimentação horizontal/vertical avaliada', status: 'conforme', observacao: 'Paredes e vedação entre pavimentos inspecionados' },
              { id: 'ck-15', descricao: 'Registro fotográfico do estado atual da edificação', status: 'conforme', observacao: 'Dossiê fotográfico preliminar registrado' }
            ]
          },
          {
            id: 'laudo-dim-saidas',
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Cálculo de População (Lotação) por Pavimento e Uso (NBR 9077 / IT CBMPE)', ordem: 1 },
              { id: 'sec-2', titulo: '2. Dimensionamento da Largura das Saídas (Unidades de Passagem) e Número Exigido', ordem: 2 },
              { id: 'sec-3', titulo: '3. Verificação da Distância Máxima a Percorrer até a Saída', ordem: 3 },
              { id: 'sec-4', titulo: '4. Cálculo da Carga de Incêndio por Ocupação (MJ/m²)', ordem: 4 },
              { id: 'sec-5', titulo: '5. Dimensionamento de Escadas de Emergência, Corrimãos e Portas Corta-Fogo', ordem: 5 },
              { id: 'sec-6', titulo: '6. Estimativa do Tempo de Escoamento da População e Parecer Técnico', ordem: 6 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'População calculada por pavimento conforme uso/ocupação', status: 'conforme', observacao: 'Densidade populacional aplicada conforme tabela da NBR 9077' },
              { id: 'ck-2', descricao: 'Largura das saídas calculada em unidades de passagem', status: 'conforme', observacao: 'Unidades de passagem (N) calculadas e arredondadas' },
              { id: 'ck-3', descricao: 'Número de saídas exigidas comparado ao número existente', status: 'conforme', observacao: 'Quantidade de saídas em conformidade com o cálculo' },
              { id: 'ck-4', descricao: 'Distância máxima a percorrer verificada dentro do limite normativo', status: 'conforme', observacao: 'Distâncias medidas em rota real de fuga' },
              { id: 'ck-5', descricao: 'Carga de incêndio calculada por ocupação (MJ/m²)', status: 'conforme', observacao: 'Método probabilístico ou tabela de referência aplicados' },
              { id: 'ck-6', descricao: 'Escadas de emergência dimensionadas (largura mínima, corrimãos)', status: 'conforme', observacao: 'Largura livre, degraus e corrimãos contínuos validados' },
              { id: 'ck-7', descricao: 'Portas corta-fogo dimensionadas e localizadas corretamente', status: 'conforme', observacao: 'Portas P-90 / P-120 e barras antipânico especificadas' },
              { id: 'ck-8', descricao: 'Sinalização de rota de fuga fotoluminescente especificada', status: 'conforme', observacao: 'Placas de orientação e salvamento distribuídas' },
              { id: 'ck-9', descricao: 'Tempo de escoamento estimado calculado', status: 'conforme', observacao: 'Velocidade média de fluxo conferida para evacuação segura' },
              { id: 'ck-10', descricao: 'Compatibilidade do dimensionamento com o uso real da edificação verificada', status: 'conforme', observacao: 'Rotas desimpedidas e aptas ao uso operacional' }
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Vistoria do Sistema de Extintores (tipo, carga, validade, distância de caminhamento, sinalização)', ordem: 1 },
              { id: 'sec-2', titulo: '2. Vistoria do Sistema de Hidrantes (pressão, vazão, mangueiras, chave storz, esguicho, reservatório e bomba)', ordem: 2 },
              { id: 'sec-3', titulo: '3. Vistoria do Sistema de Chuveiros Automáticos/Sprinklers (quando aplicável)', ordem: 3 },
              { id: 'sec-4', titulo: '4. Vistoria do Sistema de Detecção e Alarme de Incêndio', ordem: 4 },
              { id: 'sec-5', titulo: '5. Vistoria de Iluminação de Emergência e Sinalização Fotoluminescente', ordem: 5 },
              { id: 'sec-6', titulo: '6. Vistoria do SPDA (Sistema de Proteção Contra Descargas Atmosféricas)', ordem: 6 },
              { id: 'sec-7', titulo: '7. Vistoria de Saídas de Emergência, Portas Corta-Fogo e Compartimentação', ordem: 7 },
              { id: 'sec-8', titulo: '8. Verificação da Brigada de Incêndio e Plano de Emergência', ordem: 8 },
              { id: 'sec-9', titulo: '9. Relação de Pendências e Prazo de Regularização para Protocolo no CBMPE', ordem: 9 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Extintores com tipo/carga adequados ao risco, validade em dia e sinalizados', status: 'conforme', observacao: 'Selo INMETRO e lacres conferidos' },
              { id: 'ck-2', descricao: 'Distância de caminhamento até o extintor dentro do limite normativo', status: 'conforme', observacao: 'Caminhamento inferior ao raio máximo de proteção' },
              { id: 'ck-3', descricao: 'Hidrantes testados (pressão e vazão no ponto mais desfavorável)', status: 'conforme', observacao: 'Pressão dinâmica conferida no esguicho do hidrante mais alto' },
              { id: 'ck-4', descricao: 'Mangueiras, esguicho e chave storz conferidos', status: 'conforme', observacao: 'Abrigos completos e mangueiras com ensaio hidrostático em dia' },
              { id: 'ck-5', descricao: 'Reservatório de incêndio com nível adequado', status: 'conforme', observacao: 'RTI preservada sem desvio de uso' },
              { id: 'ck-6', descricao: 'Bomba de incêndio testada (partida automática e pressão nominal)', status: 'conforme', observacao: 'Pressostato comutado e partida sem retardo' },
              { id: 'ck-7', descricao: 'Sprinklers inspecionados visualmente (obstrução, corrosão, cobertura), quando exigidos', status: 'conforme', observacao: 'Bicos limpos e válvulas de governo abertas' },
              { id: 'ck-8', descricao: 'Central de alarme testada (todos os laços)', status: 'conforme', observacao: 'Comunicação e supervisão de laços sem falhas' },
              { id: 'ck-9', descricao: 'Acionadores manuais testados', status: 'conforme', observacao: 'Disparo manual testado por amostragem' },
              { id: 'ck-10', descricao: 'Detectores de fumaça/calor testados', status: 'conforme', observacao: 'Gás de teste aplicado nos sensores' },
              { id: 'ck-11', descricao: 'Sirenes/estrobos testados quanto a audibilidade e visibilidade', status: 'conforme', observacao: 'Nível sonoro perceptível em todas as áreas ocupadas' },
              { id: 'ck-12', descricao: 'Iluminação de emergência testada (autonomia mínima conforme norma)', status: 'conforme', observacao: 'Autonomia validada após corte de energia' },
              { id: 'ck-13', descricao: 'Sinalização de emergência fotoluminescente conferida', status: 'conforme', observacao: 'Placas padronizadas em todas as rotas e equipamentos' },
              { id: 'ck-14', descricao: 'SPDA inspecionado visualmente (continuidade elétrica, aterramento)', status: 'conforme', observacao: 'Malha e descidas íntegras' },
              { id: 'ck-15', descricao: 'Portas corta-fogo testadas (fechamento automático, barra antipânico)', status: 'conforme', observacao: 'Fechamento hermético e molas calibradas' },
              { id: 'ck-16', descricao: 'Saídas de emergência desobstruídas e sinalizadas', status: 'conforme', observacao: 'Rotas livres sem entulhos ou bloqueios' },
              { id: 'ck-17', descricao: 'Compartimentação horizontal/vertical verificada', status: 'conforme', observacao: 'Selagem corta-fogo em shaft e canaletas conferida' },
              { id: 'ck-18', descricao: 'Escada de emergência pressurizada testada, quando exigida', status: 'conforme', observacao: 'Pressurizador com vazão e diferencial de pressão conforme norma' },
              { id: 'ck-19', descricao: 'Brigada de incêndio treinada e com certificado válido', status: 'conforme', observacao: 'Certificados emitidos e dentro da vigência anual' },
              { id: 'ck-20', descricao: 'Plano de emergência elaborado e disponível no local', status: 'conforme', observacao: 'Plano aprovado e acessível na portaria/central' },
              { id: 'ck-21', descricao: 'Relação de pendências elaborada com prazo de regularização', status: 'conforme', observacao: 'Plano de ação formalizado' }
            ]
          },
          {
            id: 'laudo-clcb',
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Verificação Simplificada de Extintores (tipo, quantidade, validade)', ordem: 1 },
              { id: 'sec-2', titulo: '2. Verificação de Saída de Emergência Única (sinalização e desobstrução)', ordem: 2 },
              { id: 'sec-3', titulo: '3. Verificação Visual da Instalação Elétrica e Quadros de Distribuição', ordem: 3 },
              { id: 'sec-4', titulo: '4. Verificação de Lotação e Área Compatível com o Uso Comercial/Serviços', ordem: 4 },
              { id: 'sec-5', titulo: '5. Enquadramento de Baixo Risco / Microempresa conforme IT CBMPE', ordem: 5 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Extintor adequado à classe de risco (A/B/C) presente', status: 'conforme', observacao: 'Aparelho portátil adequado à atividade' },
              { id: 'ck-2', descricao: 'Quantidade de extintores compatível com a área do estabelecimento', status: 'conforme', observacao: 'Área coberta pelas unidades extintoras' },
              { id: 'ck-3', descricao: 'Extintor dentro da validade e sinalizado', status: 'conforme', observacao: 'Carga anual e teste hidrostático vigentes' },
              { id: 'ck-4', descricao: 'Saída de emergência sinalizada e desobstruída', status: 'conforme', observacao: 'Abertura livre sem trancamentos inadequados' },
              { id: 'ck-5', descricao: 'Instalação elétrica aparentemente regular (sem fios expostos)', status: 'conforme', observacao: 'Chicotes protegidos por conduítes e canaletas' },
              { id: 'ck-6', descricao: 'Quadro elétrico identificado (disjuntores nomeados)', status: 'conforme', observacao: 'Barramento isolado e circuitos identificados' },
              { id: 'ck-7', descricao: 'Lotação do estabelecimento compatível com a área', status: 'conforme', observacao: 'Sem aglomeração incompatível com as rotas de fuga' },
              { id: 'ck-8', descricao: 'Iluminação de emergência básica presente, quando exigida', status: 'conforme', observacao: 'Blocos de emergência operantes' },
              { id: 'ck-9', descricao: 'Enquadramento em baixo risco/microempresa confirmado conforme IT aplicável', status: 'conforme', observacao: 'Parâmetros de área até 750m² e carga de incêndio atendidos' }
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Teste de Vazão e Pressão dos Hidrantes no Ponto Mais Desfavorável', ordem: 1 },
              { id: 'sec-2', titulo: '2. Teste da Bomba de Incêndio (partida automática, pressão nominal, tempo de resposta)', ordem: 2 },
              { id: 'sec-3', titulo: '3. Inspeção e Teste dos Sprinklers (cobertura, obstrução, corrosão)', ordem: 3 },
              { id: 'sec-4', titulo: '4. Teste da Central de Alarme (todos os laços, acionadores e detectores)', ordem: 4 },
              { id: 'sec-5', titulo: '5. Teste de Sirenes e Sinalizadores Visuais (audibilidade e visibilidade)', ordem: 5 },
              { id: 'sec-6', titulo: '6. Teste de Autonomia e Luminância da Iluminação de Emergência', ordem: 6 },
              { id: 'sec-7', titulo: '7. Ficha de Comissionamento com Resultados Registrados e Assinatura do RT', ordem: 7 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Teste de vazão e pressão realizado no hidrante mais desfavorável', status: 'conforme', observacao: 'Manômetro de tubo de Pitot aferiu pressão nominal conforme projeto' },
              { id: 'ck-2', descricao: 'Bomba de incêndio testada (partida automática e pressão nominal)', status: 'conforme', observacao: 'Partida em menos de 10s após abertura de válvula' },
              { id: 'ck-3', descricao: 'Reservatório de incêndio com nível conferido antes do teste', status: 'conforme', observacao: 'Capacidade plena de RTI confirmada' },
              { id: 'ck-4', descricao: 'Sprinklers inspecionados visualmente (obstrução, corrosão, cobertura)', status: 'conforme', observacao: 'Ampolas de vidro intactas e sem incrustações' },
              { id: 'ck-5', descricao: 'Central de alarme testada em todos os laços', status: 'conforme', observacao: 'Painel supervisionado sem avarias de terra ou laço aberto' },
              { id: 'ck-6', descricao: 'Acionadores manuais testados individualmente', status: 'conforme', observacao: '100% dos acionadores comutaram evento na central' },
              { id: 'ck-7', descricao: 'Detectores de fumaça/calor testados', status: 'conforme', observacao: 'Sensibilidade aferida com spray/aerossol normatizado' },
              { id: 'ck-8', descricao: 'Sirenes testadas quanto à audibilidade', status: 'conforme', observacao: 'Audibilidade superior a 75 dBA em todos os pontos' },
              { id: 'ck-9', descricao: 'Sinalizadores visuais (estrobo) testados quanto à visibilidade', status: 'conforme', observacao: 'Flashes sincronizados com visibilidade periférica' },
              { id: 'ck-10', descricao: 'Iluminação de emergência testada quanto à autonomia mínima', status: 'conforme', observacao: 'Baterias sustentaram carga por 2 horas' },
              { id: 'ck-11', descricao: 'Luminância da iluminação de emergência medida', status: 'conforme', observacao: 'Luxímetro registrou iluminância mínima de 3 a 5 lux no piso' },
              { id: 'ck-12', descricao: 'Ficha de comissionamento preenchida e assinada pelo responsável técnico', status: 'conforme', observacao: 'Documento homologado e anexado ao prontuário' }
            ]
          },
          {
            id: 'laudo-estanqueidade-gas',
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Identificação da Instalação (tipo de gás, capacidade da central, layout da rede)', ordem: 1 },
              { id: 'sec-2', titulo: '2. Metodologia do Teste de Estanqueidade (pressurização com ar/N2, pressão e tempo)', ordem: 2 },
              { id: 'sec-3', titulo: '3. Verificação de Conexões, Válvulas de Bloqueio e Regulador de Pressão', ordem: 3 },
              { id: 'sec-4', titulo: '4. Verificação da Ventilação e Distanciamentos do Abrigo / Central de Gás', ordem: 4 },
              { id: 'sec-5', titulo: '5. Verificação de Sinalização de Segurança e Proteção Mecânica Contra Impactos', ordem: 5 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Central de gás identificada e sinalizada ("Gás Inflamável")', status: 'conforme', observacao: 'Avisos de perigo e proibição de chamas afixados' },
              { id: 'ck-2', descricao: 'Pressão de teste aplicada conforme norma aplicável', status: 'conforme', observacao: 'Pressão aplicada conforme classe de pressão da tubulação' },
              { id: 'ck-3', descricao: 'Tempo de estabilização respeitado', status: 'conforme', observacao: 'Período de acomodação térmica e manométrica cumprido' },
              { id: 'ck-4', descricao: 'Ausência de queda de pressão confirmada (estanqueidade aprovada)', status: 'conforme', observacao: 'Variação nula registrada no registrador de pressão' },
              { id: 'ck-5', descricao: 'Conexões e válvulas inspecionadas visualmente (ausência de vazamento/corrosão)', status: 'conforme', observacao: 'Teste com solução geradora de espuma sem formação de bolhas' },
              { id: 'ck-6', descricao: 'Regulador de pressão conferido e dentro do prazo de manutenção', status: 'conforme', observacao: 'Estágios de primeiro e segundo corte calibrados' },
              { id: 'ck-7', descricao: 'Ventilação do abrigo/central de gás avaliada como adequada', status: 'conforme', observacao: 'Ventilação natural superior e inferior contínua' },
              { id: 'ck-8', descricao: 'Proteção contra impacto de veículos verificada, quando aplicável', status: 'conforme', observacao: 'Frades/guard-rails de proteção mecânica instalados' },
              { id: 'ck-9', descricao: 'Certificado de calibração do manômetro utilizado no teste anexado', status: 'conforme', observacao: 'Manômetro aferido por laboratório acreditado RBC' }
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
            nome: 'Laudo de Apreciação / Análise de Risco (HRN e NBR ISO 12100)',
            temHrn: true,
            hrn: true,
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Identificação da Máquina (fabricante, modelo, série, ano, placa)', ordem: 1 },
              { id: 'sec-2', titulo: '2. Descrição Funcional e Fases de Vida Consideradas', ordem: 2 },
              { id: 'sec-3', titulo: '3. Identificação de Perigos por Zona/Ponto de Operação', ordem: 3 },
              { id: 'sec-4', titulo: '4. Apreciação de Risco — Cálculo do HRN por Perigo (HRN = LO × FE × DPH × NP)', ordem: 4 },
              { id: 'sec-5', titulo: '5. Classificação do Risco por Faixa de HRN e Priorização', ordem: 5 },
              { id: 'sec-6', titulo: '6. Medidas de Controle Recomendadas (Hierarquia de Controle)', ordem: 6 },
              { id: 'sec-7', titulo: '7. Reavaliação do Risco Residual após Medidas Propostas', ordem: 7 },
              { id: 'sec-8', titulo: '8. Cronograma de Implementação das Medidas Corretivas', ordem: 8 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Placa de identificação da máquina localizada e legível', status: 'conforme', observacao: 'Placa original legível com dados de fabricante e série' },
              { id: 'ck-2', descricao: 'Manual de instruções do fabricante disponível', status: 'conforme', observacao: 'Manual técnico completo no idioma português' },
              { id: 'ck-3', descricao: 'Todas as fases de vida da máquina mapeadas (operação, setup, limpeza, manutenção)', status: 'conforme', observacao: 'Fases descritas e avaliadas' },
              { id: 'ck-4', descricao: 'Perigos mecânicos identificados por ponto de operação', status: 'nao_conforme', observacao: 'Zona de prensagem sem proteção física adequada' },
              { id: 'ck-5', descricao: 'Perigos elétricos identificados (partes energizadas, aterramento)', status: 'conforme', observacao: 'Quadro em extrabaixa tensão e aterramento contínuo' },
              { id: 'ck-6', descricao: 'Perigos térmicos identificados (superfícies quentes/frias)', status: 'conforme', observacao: 'Isolamento térmico nos cilindros aquecidos' },
              { id: 'ck-7', descricao: 'Nível de ruído avaliado (dosimetria, se aplicável)', status: 'conforme', observacao: 'Avaliação quantitativa de ruído dentro dos limites de tolerância' },
              { id: 'ck-8', descricao: 'Nível de vibração avaliado (se aplicável)', status: 'nao_aplicavel', observacao: 'Máquina fixada em base amortecedora sem transmissão' },
              { id: 'ck-9', descricao: 'Perigos ergonômicos identificados (posturas, movimentos repetitivos)', status: 'conforme', observacao: 'Bancada e acionamento ajustados à altura do operador' },
              { id: 'ck-10', descricao: 'LO (probabilidade de ocorrência) atribuído por perigo', status: 'conforme', observacao: 'Parâmetro LO atribuído conforme NBR ISO 12100' },
              { id: 'ck-11', descricao: 'FE (frequência de exposição) atribuído por perigo', status: 'conforme', observacao: 'Exposição contínua diária durante o turno de trabalho' },
              { id: 'ck-12', descricao: 'DPH (grau de dano possível) atribuído por perigo', status: 'conforme', observacao: 'Risco de amputação avaliado na zona de prensagem' },
              { id: 'ck-13', descricao: 'NP (número de pessoas expostas) atribuído por perigo', status: 'conforme', observacao: 'NP = 1 a 2 operadores' },
              { id: 'ck-14', descricao: 'HRN calculado e classificado por perigo', status: 'conforme', observacao: 'HRN consolidado nas planilhas do laudo' },
              { id: 'ck-15', descricao: 'Medidas de controle existentes registradas', status: 'conforme', observacao: 'Registradas no relatório de inspeção' },
              { id: 'ck-16', descricao: 'Medidas de controle recomendadas priorizadas por hierarquia de controle', status: 'conforme', observacao: 'Eliminação > Engenharia > Administrativo > EPI' },
              { id: 'ck-17', descricao: 'Risco residual reavaliado após medidas propostas', status: 'conforme', observacao: 'Redução do risco para faixa Tolerável/Trivial' },
              { id: 'ck-18', descricao: 'Cronograma de implementação definido com responsáveis e prazos', status: 'conforme', observacao: 'Cronograma de 30 a 90 dias' },
              { id: 'ck-19', descricao: 'PGR/PPRA da empresa correlacionado (referência cruzada, se aplicável)', status: 'conforme', observacao: 'Integração direta com o inventário de riscos do PGR' }
            ]
          },
          {
            id: 'laudo-nr12-protecoes',
            codigo: 'NR12-PROT',
            nome: 'Laudo de Adequação e Proteção de Proteções Físicas e Intertravamentos',
            temHrn: true,
            hrn: true,
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Levantamento de Pontos de Operação e Proteções Existentes', ordem: 1 },
              { id: 'sec-2', titulo: '2. Apreciação de Risco (HRN) por Ponto de Perigo Desprotegido ou Inadequado', ordem: 2 },
              { id: 'sec-3', titulo: '3. Cálculo da Distância de Segurança (ABNT NBR ISO 13857)', ordem: 3 },
              { id: 'sec-4', titulo: '4. Categoria de Segurança do Sistema de Comando (ABNT NBR ISO 13849-1)', ordem: 4 },
              { id: 'sec-5', titulo: '5. Especificação Técnica das Proteções/Intertravamentos Recomendados', ordem: 5 },
              { id: 'sec-6', titulo: '6. Cálculo do Tempo de Parada da Máquina vs Posicionamento do Dispositivo', ordem: 6 },
              { id: 'sec-7', titulo: '7. Plano de Adequação com Priorização por Nível de Risco', ordem: 7 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Todos os pontos de operação/perigo mapeados', status: 'conforme', observacao: 'Mapeamento completo realizado in loco' },
              { id: 'ck-2', descricao: 'Proteções fixas existentes avaliadas (fixação, resistência, ausência de aberturas perigosas)', status: 'conforme', observacao: 'Telas e chapas fixadas com parafusos invioláveis' },
              { id: 'ck-3', descricao: 'Proteções móveis intertravadas avaliadas (tipo de chave de segurança, categoria)', status: 'conforme', observacao: 'Chaves magnéticas codificadas com ruptura positiva' },
              { id: 'ck-4', descricao: 'Cortinas de luz avaliadas (resolução, categoria, distância de instalação)', status: 'conforme', observacao: 'Tipo 4 instalada respeitando tempo de parada total' },
              { id: 'ck-5', descricao: 'Tapetes de segurança avaliados (se houver)', status: 'nao_aplicavel', observacao: 'Sem utilização de tapetes de segurança nesta máquina' },
              { id: 'ck-6', descricao: 'HRN calculado por ponto de perigo desprotegido/inadequado', status: 'conforme', observacao: 'Cálculos anexados ao memorial' },
              { id: 'ck-7', descricao: 'Distância de segurança calculada conforme NBR ISO 13857', status: 'conforme', observacao: 'Distância de segurança conforme tabela de membros superiores' },
              { id: 'ck-8', descricao: 'Tempo de parada da máquina medido/estimado', status: 'conforme', observacao: 'Tempo de inércia medido em 0,18 segundos' },
              { id: 'ck-9', descricao: 'Categoria do sistema de comando de segurança definida (PL/Categoria)', status: 'conforme', observacao: 'Categoria 4 / PLe exigida e validada' },
              { id: 'ck-10', descricao: 'Especificação técnica das proteções recomendadas elaborada', status: 'conforme', observacao: 'Especificações no anexo técnico' },
              { id: 'ck-11', descricao: 'Compatibilidade elétrica das novas proteções com o painel existente avaliada', status: 'conforme', observacao: 'Painel suporta relés de segurança de duplo canal 24Vcc' },
              { id: 'ck-12', descricao: 'Plano de adequação priorizado por nível de risco', status: 'conforme', observacao: 'Matriz de prioridade estabelecida' },
              { id: 'ck-13', descricao: 'Prazo de implementação definido por item', status: 'conforme', observacao: 'Prazos definidos entre 15 e 45 dias' }
            ]
          },
          {
            id: 'laudo-nr12-retrofit',
            codigo: 'NR12-RETRO',
            nome: 'Laudo de Validação / Retrofit de Segurança em Máquinas',
            temHrn: true,
            hrn: true,
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Descrição Técnica da Alteração/Modernização Realizada', ordem: 1 },
              { id: 'sec-2', titulo: '2. Levantamento de Novos Perigos Introduzidos pela Alteração', ordem: 2 },
              { id: 'sec-3', titulo: '3. Reapreciação de Risco Pós-Intervenção (HRN Recalculado)', ordem: 3 },
              { id: 'sec-4', titulo: '4. Validação Funcional das Novas Proteções e Intertravamentos', ordem: 4 },
              { id: 'sec-5', titulo: '5. Verificação de Conformidade Documental (Manuais e Esquemas)', ordem: 5 },
              { id: 'sec-6', titulo: '6. Registro de Treinamento dos Operadores na Nova Configuração', ordem: 6 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Alteração/modernização documentada tecnicamente (memorial descritivo)', status: 'conforme', observacao: 'Memorial de retrofit anexado ao laudo' },
              { id: 'ck-2', descricao: 'Novos perigos introduzidos pela alteração identificados', status: 'conforme', observacao: 'Nenhum novo perigo crítico identificado após blindagem' },
              { id: 'ck-3', descricao: 'HRN recalculado para perigos novos/alterados', status: 'conforme', observacao: 'HRN pós-retrofit reduzido para faixa Tolerável' },
              { id: 'ck-4', descricao: 'Novas proteções testadas funcionalmente (acionamento, parada, rearme)', status: 'conforme', observacao: 'Testes dinâmicos e estáticos aprovados' },
              { id: 'ck-5', descricao: 'Intertravamentos pós-retrofit testados', status: 'conforme', observacao: 'Corte imediato de força verificado' },
              { id: 'ck-6', descricao: 'Esquema elétrico/pneumático atualizado conferido', status: 'conforme', observacao: 'Diagramas atualizados fixados no interior do painel' },
              { id: 'ck-7', descricao: 'Manual de instruções da máquina atualizado', status: 'conforme', observacao: 'Adendo de procedimentos operacionais e limpeza adicionado' },
              { id: 'ck-8', descricao: 'PPRA/PGR da empresa atualizado com a nova configuração', status: 'conforme', observacao: 'Documentação do SESMT atualizada' },
              { id: 'ck-9', descricao: 'Operadores treinados na nova configuração (registro de treinamento)', status: 'conforme', observacao: 'Lista de presença e certificado de capacitação anexados' },
              { id: 'ck-10', descricao: 'Sinalização de segurança atualizada na máquina', status: 'conforme', observacao: 'Placas de advertência e botões de emergência devidamente sinalizados' }
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
            temHrn: false,
            hrn: false,
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Dados de Projeto e Placa de Identificação (PMTA, volume, fluido)', ordem: 1 },
              { id: 'sec-2', titulo: '2. Enquadramento de Categoria (Cálculo P × V conforme Anexo I NR-13)', ordem: 2 },
              { id: 'sec-3', titulo: '3. Inspeção de Segurança Externa (carcaça, isolamento, suportação)', ordem: 3 },
              { id: 'sec-4', titulo: '4. Inspeção de Segurança Interna (corrosão, incrustações, trincas)', ordem: 4 },
              { id: 'sec-5', titulo: '5. Ensaios Não Destrutivos (Ultrassom para Medição de Espessura e LP)', ordem: 5 },
              { id: 'sec-6', titulo: '6. Verificação do Dispositivo de Alívio de Pressão (PSV e Manômetro)', ordem: 6 },
              { id: 'sec-7', titulo: '7. Cálculo da Vida Útil Remanescente com Base na Taxa de Corrosão', ordem: 7 },
              { id: 'sec-8', titulo: '8. Definição da Periodicidade da Próxima Inspeção', ordem: 8 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Placa de identificação localizada, legível e compatível com o prontuário', status: 'conforme', observacao: 'Placa original legível' },
              { id: 'ck-2', descricao: 'PMTA (Pressão Máxima de Trabalho Admissível) confirmada', status: 'conforme', observacao: 'PMTA de 10 bar / 145 psi verificada' },
              { id: 'ck-3', descricao: 'Volume do vaso confirmado', status: 'conforme', observacao: 'Volume geométrico de 500 litros' },
              { id: 'ck-4', descricao: 'Grupo do fluido (categoria) identificado conforme Anexo I', status: 'conforme', observacao: 'Fluido Grupo C (Ar comprimido)' },
              { id: 'ck-5', descricao: 'Categoria do vaso calculada (P × V)', status: 'conforme', observacao: 'Categoria V conforme tabela do Anexo I' },
              { id: 'ck-6', descricao: 'Inspeção externa realizada (carcaça, isolamento, suportes)', status: 'conforme', observacao: 'Sem pontos de deformação mecânica' },
              { id: 'ck-7', descricao: 'Inspeção interna realizada, quando acessível', status: 'conforme', observacao: 'Acesso via boca de visita/bujão com endoscopia' },
              { id: 'ck-8', descricao: 'Medição de espessura por ultrassom realizada em pontos definidos', status: 'conforme', observacao: 'Costado e tampos com espessura acima do mínimo de projeto' },
              { id: 'ck-9', descricao: 'Ensaio de líquido penetrante em soldas críticas (se aplicável)', status: 'conforme', observacao: 'Soldas circunferenciais sem descontinuidades' },
              { id: 'ck-10', descricao: 'Válvula de segurança identificada e calibração conferida', status: 'conforme', observacao: 'PSV identificada e aferida' },
              { id: 'ck-11', descricao: 'Válvula de segurança dentro do prazo de calibração', status: 'conforme', observacao: 'Calibração em bancada realizada com laudo válido' },
              { id: 'ck-12', descricao: 'Corrosão externa/interna mapeada e quantificada', status: 'conforme', observacao: 'Corrosão uniforme desprezível (< 0,05 mm/ano)' },
              { id: 'ck-13', descricao: 'Taxa de corrosão calculada', status: 'conforme', observacao: 'Taxa anual de 0,03 mm/ano calculada' },
              { id: 'ck-14', descricao: 'Vida útil remanescente estimada', status: 'conforme', observacao: 'Estimativa de vida útil superior a 15 anos' },
              { id: 'ck-15', descricao: 'Periodicidade da próxima inspeção definida', status: 'conforme', observacao: 'Próxima inspeção externa em 1 ano e interna em 5 anos' },
              { id: 'ck-16', descricao: 'Prontuário do vaso disponível e atualizado', status: 'conforme', observacao: 'Prontuário técnico reconstituído e assinado por PH' },
              { id: 'ck-17', descricao: 'ART de inspeção anterior verificada (se houver)', status: 'conforme', observacao: 'ART anterior arquivada no prontuário' }
            ]
          },
          {
            id: 'laudo-nr13-caldeiras',
            codigo: 'NR13-CALD',
            nome: 'Laudo de Inspeção Periódica / Extraordinária de Caldeiras',
            temHrn: false,
            hrn: false,
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Dados de Projeto e Categoria da Caldeira (potência, pressão, combustível)', ordem: 1 },
              { id: 'sec-2', titulo: '2. Inspeção Externa (casco, estrutura de sustentação, isolamento térmico)', ordem: 2 },
              { id: 'sec-3', titulo: '3. Inspeção Interna (fornalha, feixe tubular, incrustações, corrosão)', ordem: 3 },
              { id: 'sec-4', titulo: '4. Teste Hidrostático (pressão de teste, tempo e resultado)', ordem: 4 },
              { id: 'sec-5', titulo: '5. Verificação e Calibração de Válvulas de Segurança e Controles de Nível', ordem: 5 },
              { id: 'sec-6', titulo: '6. Verificação de Instrumentação de Controle (pressostatos, manômetros)', ordem: 6 },
              { id: 'sec-7', titulo: '7. Atualização do Livro de Registro de Segurança de Caldeiras', ordem: 7 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Categoria da caldeira identificada (conforme potência/pressão)', status: 'conforme', observacao: 'Caldeira Categoria B identificada' },
              { id: 'ck-2', descricao: 'Inspeção externa da carcaça e estrutura realizada', status: 'conforme', observacao: 'Estrutura de suporte sem recalques diferenciais' },
              { id: 'ck-3', descricao: 'Isolamento térmico avaliado', status: 'conforme', observacao: 'Lã de rocha com revestimento em alumínio íntegro' },
              { id: 'ck-4', descricao: 'Inspeção interna da fornalha realizada', status: 'conforme', observacao: 'Refratários em bom estado sem desprendimentos' },
              { id: 'ck-5', descricao: 'Feixe tubular inspecionado (incrustações, corrosão)', status: 'conforme', observacao: 'Tubos limpos sem incrustações de carbonato' },
              { id: 'ck-6', descricao: 'Teste hidrostático executado (quando aplicável) e resultado registrado', status: 'conforme', observacao: 'Pressão de 1,5 x PMTA mantida por 30 min sem queda' },
              { id: 'ck-7', descricao: 'Válvula(s) de segurança calibrada(s) e dentro do prazo', status: 'conforme', observacao: 'Duas PSVs calibradas com lacre inviolado' },
              { id: 'ck-8', descricao: 'Controles de nível de água testados', status: 'conforme', observacao: 'Automático de nível e eletrodos cortando alimentação por nível baixo' },
              { id: 'ck-9', descricao: 'Pressostatos e manômetros calibrados/aferidos', status: 'conforme', observacao: 'Manômetro com selo RBC de aferição' },
              { id: 'ck-10', descricao: 'Sistema de controle de queima verificado', status: 'conforme', observacao: 'Fotocélula de chama e válvulas solenoides atuando' },
              { id: 'ck-11', descricao: 'Livro de registro de segurança atualizado', status: 'conforme', observacao: 'Termo de inspeção lavrado no livro oficial' },
              { id: 'ck-12', descricao: 'Operador de caldeira com certificação válida (NR-13, Anexo II) verificado', status: 'conforme', observacao: 'Certificado de capacitação e estágio prático válidos' }
            ]
          },
          {
            id: 'laudo-nr13-tubulacoes',
            codigo: 'NR13-TUBO',
            nome: 'Laudo de Integridade Estrutural de Tubulações e Tanques de Armazenamento',
            temHrn: false,
            hrn: false,
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Mapeamento Isométrico/Esquemático da Rede ou Identificação do Tanque', ordem: 1 },
              { id: 'sec-2', titulo: '2. Definição dos Pontos Críticos de Inspeção (soldas, curvas, derivações)', ordem: 2 },
              { id: 'sec-3', titulo: '3. Inspeção Visual Externa (corrosão, deformações, vazamentos)', ordem: 3 },
              { id: 'sec-4', titulo: '4. Ensaios de Espessura por Ultrassom nos Pontos Críticos Mapeados', ordem: 4 },
              { id: 'sec-5', titulo: '5. Avaliação de Suportes, Ancoragens e Isolamento Térmico', ordem: 5 },
              { id: 'sec-6', titulo: '6. Avaliação de Proteção Catódica (tanques e tubulações enterradas)', ordem: 6 },
              { id: 'sec-7', titulo: '7. Cálculo da Taxa de Corrosão e Estimativa de Vida Útil Remanescente', ordem: 7 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Rede/tanque mapeado e identificado (TAG, isométrico ou desenho esquemático)', status: 'conforme', observacao: 'TAGs e fluxogramas atualizados' },
              { id: 'ck-2', descricao: 'Pontos críticos de inspeção definidos (soldas, curvas, derivações)', status: 'conforme', observacao: 'Mapeamento de 24 pontos críticos de espessura' },
              { id: 'ck-3', descricao: 'Inspeção visual externa realizada', status: 'conforme', observacao: 'Sem pontos de vazamento ou vibração anormal' },
              { id: 'ck-4', descricao: 'Corrosão externa mapeada e quantificada', status: 'conforme', observacao: 'Pintura de proteção íntegra com pontos isolados de retoque' },
              { id: 'ck-5', descricao: 'Espessura medida por ultrassom em todos os pontos críticos definidos', status: 'conforme', observacao: 'Todas as espessuras acima do limite de descarte' },
              { id: 'ck-6', descricao: 'Suportes e ancoragens avaliados (fixação, corrosão, alinhamento)', status: 'conforme', observacao: 'Suportes de mola e roletes com alinhamento adequado' },
              { id: 'ck-7', descricao: 'Isolamento térmico avaliado (integridade, presença de umidade)', status: 'conforme', observacao: 'Sem sinais de corrosão sob isolamento (CUI)' },
              { id: 'ck-8', descricao: 'Proteção catódica avaliada, quando aplicável (tanques enterrados)', status: 'nao_aplicavel', observacao: 'Tubulação aérea com pintura industrial de acabamento' },
              { id: 'ck-9', descricao: 'Taxa de corrosão calculada', status: 'conforme', observacao: 'Taxa de desgaste de 0,02 mm/ano calculada' },
              { id: 'ck-10', descricao: 'Vida útil remanescente estimada', status: 'conforme', observacao: 'Vida remanescente superior a 20 anos' },
              { id: 'ck-11', descricao: 'Registro fotográfico completo por ponto de inspeção', status: 'conforme', observacao: 'Relatório fotográfico anexado com identificação de cada ponto' }
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Identificação do Equipamento (fabricante, modelo, nº de série, horímetro atual)', ordem: 1 },
              { id: 'sec-2', titulo: '2. Apreciação de Risco (HRN) dos Perigos Residuais de Operação', ordem: 2 },
              { id: 'sec-3', titulo: '3. Avaliação Estrutural (chassi, lança/braço, caçamba/implemento, estrutura de sustentação)', ordem: 3 },
              { id: 'sec-4', titulo: '4. Avaliação do Sistema Hidráulico (mangueiras, cilindros, bomba, vazamentos)', ordem: 4 },
              { id: 'sec-5', titulo: '5. Avaliação do Sistema de Translação (esteiras/pneus, rodas motrizes, roletes)', ordem: 5 },
              { id: 'sec-6', titulo: '6. Avaliação de Comandos e Instrumentação de Cabine', ordem: 6 },
              { id: 'sec-7', titulo: '7. Avaliação de Desgaste de Componentes Mecânicos de Articulação (pinos, buchas, mancais)', ordem: 7 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Horímetro registrado no momento da inspeção', status: 'conforme', observacao: 'Horímetro operacional registrado' },
              { id: 'ck-2', descricao: 'Estrutura do chassi sem trincas ou deformações visíveis', status: 'conforme', observacao: 'Chassi inspecionado visualmente e sem trincas' },
              { id: 'ck-3', descricao: 'Lança/braço e caçamba/implemento sem deformações estruturais', status: 'conforme', observacao: 'Geometria preservada e sem empenamentos' },
              { id: 'ck-4', descricao: 'Sistema hidráulico sem vazamentos aparentes', status: 'conforme', observacao: 'Linhas pressurizadas sem gotejamentos' },
              { id: 'ck-5', descricao: 'Mangueiras hidráulicas sem desgaste, ressecamento ou abrasão', status: 'conforme', observacao: 'Mangueiras íntegras e com malha protegida' },
              { id: 'ck-6', descricao: 'Cilindros hidráulicos sem vazamento nas hastes', status: 'conforme', observacao: 'Hastes cromadas sem riscos e retentores estanques' },
              { id: 'ck-7', descricao: 'Esteiras ou pneus com desgaste dentro do limite aceitável', status: 'conforme', observacao: 'Tensão de esteiras e garras dentro da tolerância' },
              { id: 'ck-8', descricao: 'Rodas motrizes e roletes avaliados quanto a desgaste', status: 'conforme', observacao: 'Guias e roletes lubrificados e sem folgas anormais' },
              { id: 'ck-9', descricao: 'Freio de serviço testado', status: 'conforme', observacao: 'Resposta de frenagem em rampa testada' },
              { id: 'ck-10', descricao: 'Freio de estacionamento testado', status: 'conforme', observacao: 'Imobilização total com máquina desengatada' },
              { id: 'ck-11', descricao: 'Comandos de cabine funcionais (alavancas, pedais, joystick)', status: 'conforme', observacao: 'Joysticks operando sem pontos mortos ou travamentos' },
              { id: 'ck-12', descricao: 'Instrumentação do painel funcional (pressão, temperatura, combustível)', status: 'conforme', observacao: 'Indicadores e lâmpadas-piloto funcionais' },
              { id: 'ck-13', descricao: 'Cinto de segurança do operador presente e funcional', status: 'conforme', observacao: 'Cinto abdominal/subabdominal com fecho íntegro' },
              { id: 'ck-14', descricao: 'Buzina e alarme sonoro de ré funcionais', status: 'conforme', observacao: 'Alarme sonoro interligado à ré audível a 15m' },
              { id: 'ck-15', descricao: 'Extintor de incêndio a bordo, quando exigido', status: 'conforme', observacao: 'Extintor com manômetro regular e fixação firme' },
              { id: 'ck-16', descricao: 'Pinos e buchas de articulação avaliados quanto a folga/desgaste', status: 'conforme', observacao: 'Folgas radiais e axiais dentro dos limites do fabricante' },
              { id: 'ck-17', descricao: 'HRN calculado para os perigos residuais identificados', status: 'conforme', observacao: 'Matriz HRN consolidada para riscos mecânicos e operacionais' },
              { id: 'ck-18', descricao: 'Estrutura ROPS/FOPS íntegra (referenciar laudo específico, se elaborado separadamente)', status: 'conforme', observacao: 'Cabine de proteção íntegra e sem soldas clandestinas' }
            ]
          },
          {
            id: 'laudo-rops-fops',
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Identificação e Certificação de Origem da Estrutura (placa de certificação ISO 3471/ISO 3449)', ordem: 1 },
              { id: 'sec-2', titulo: '2. Inspeção Visual da Estrutura ROPS (trincas, deformação, corrosão)', ordem: 2 },
              { id: 'sec-3', titulo: '3. Inspeção Visual da Estrutura FOPS, quando aplicável', ordem: 3 },
              { id: 'sec-4', titulo: '4. Verificação de Fixação e Torque dos Parafusos de Fixação', ordem: 4 },
              { id: 'sec-5', titulo: '5. Verificação de Compatibilidade da Estrutura com o Modelo do Equipamento', ordem: 5 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Placa de certificação ROPS presente e legível', status: 'conforme', observacao: 'Placa metálica OEM preservada com norma e dados do fabricante' },
              { id: 'ck-2', descricao: 'Placa de certificação FOPS presente, quando aplicável', status: 'conforme', observacao: 'Certificação Nível I/II FOPS identificada' },
              { id: 'ck-3', descricao: 'Estrutura sem trincas ou deformações visíveis', status: 'conforme', observacao: 'Colunas e arcos sem deformação plástica' },
              { id: 'ck-4', descricao: 'Solda da estrutura íntegra, sem fissuras', status: 'conforme', observacao: 'Cordões de solda originais inspecionados sem descontinuidades' },
              { id: 'ck-5', descricao: 'Parafusos de fixação com torque conferido', status: 'conforme', observacao: 'Torquímetro aferiu torque nominal nos parafusos de sustentação' },
              { id: 'ck-6', descricao: 'Compatibilidade da estrutura com o modelo/fabricante do equipamento confirmada', status: 'conforme', observacao: 'Aplicação aprovada pelo manual de montagem do fabricante' },
              { id: 'ck-7', descricao: 'Ausência de furação ou adaptação não certificada na estrutura', status: 'conforme', observacao: 'Sem furações adicionais, cortes ou enxertos não homologados' },
              { id: 'ck-8', descricao: 'Estrutura sem sinais de impacto anterior sem substituição/certificação', status: 'conforme', observacao: 'Ausência de vestígios de capotamento ou abalroamento' }
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Identificação do Equipamento e Capacidade Nominal (placa de carga)', ordem: 1 },
              { id: 'sec-2', titulo: '2. Apreciação de Risco (HRN) dos Perigos Operacionais', ordem: 2 },
              { id: 'sec-3', titulo: '3. Checklist Técnico de Freios, Direção e Sistema Hidráulico', ordem: 3 },
              { id: 'sec-4', titulo: '4. Verificação de Dispositivos de Segurança e Alarme', ordem: 4 },
              { id: 'sec-5', titulo: '5. Verificação de Garfos, Plataforma ou Cesto, conforme o tipo de equipamento', ordem: 5 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Capacidade nominal identificada na placa de carga', status: 'conforme', observacao: 'Placa de diagrama de cargas e centro de gravidade perfeitamente legíveis' },
              { id: 'ck-2', descricao: 'Freio de serviço testado', status: 'conforme', observacao: 'Eficiência de frenagem dinâmica aprovada sob carga' },
              { id: 'ck-3', descricao: 'Freio de estacionamento testado', status: 'conforme', observacao: 'Freio mecânico imobilizou o equipamento na rampa' },
              { id: 'ck-4', descricao: 'Direção sem folga excessiva', status: 'conforme', observacao: 'Direção hidrostática sem folgas axiais ou trancos' },
              { id: 'ck-5', descricao: 'Sistema hidráulico de elevação sem vazamentos', status: 'conforme', observacao: 'Válvula de retenção e mangueiras sem perda de carga' },
              { id: 'ck-6', descricao: 'Corrente/cilindro de elevação avaliado quanto a desgaste', status: 'conforme', observacao: 'Alongamento da corrente inferior a 2% do limite normativo' },
              { id: 'ck-7', descricao: 'Garfos sem trincas ou deformação (empilhadeiras)', status: 'conforme', observacao: 'Talão dos garfos medido com paquímetro dentro de 94% da espessura original' },
              { id: 'ck-8', descricao: 'Plataforma ou cesto sem deformação (PEMT/PTA)', status: 'conforme', observacao: 'Piso antiderrapante e estrutura do cesto íntegros' },
              { id: 'ck-9', descricao: 'Guarda-corpo e trava do cesto conferidos (PEMT/PTA)', status: 'conforme', observacao: 'Guarda-corpo com altura de 1,10m e rodapé de 15cm conformes' },
              { id: 'ck-10', descricao: 'Alarme sonoro de ré funcional', status: 'conforme', observacao: 'Sirene de ré sincronizada com a marcha à ré' },
              { id: 'ck-11', descricao: 'Luz giroflex/sinalizadora funcional', status: 'conforme', observacao: 'Giroflex âmbar visível a 360 graus' },
              { id: 'ck-12', descricao: 'Cinto de segurança do operador/cesto presente', status: 'conforme', observacao: 'Cinto e pontos de ancoragem para cinto tipo paraquedista conformes' },
              { id: 'ck-13', descricao: 'Dispositivo de parada de emergência testado', status: 'conforme', observacao: 'Botão tipo cogumelo corta potência dos motores e elevação' },
              { id: 'ck-14', descricao: 'Estabilizadores testados, quando aplicável', status: 'conforme', observacao: 'Válvulas de retenção das patolas e sapatas operacionais' },
              { id: 'ck-15', descricao: 'HRN calculado para os perigos identificados', status: 'conforme', observacao: 'Matriz HRN aplicada para os riscos de tombamento e esmagamento' }
            ]
          },
          {
            id: 'laudo-teste-carga',
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Metodologia do Teste (percentual da carga nominal aplicado, tempo de sustentação)', ordem: 1 },
              { id: 'sec-2', titulo: '2. Execução do Ensaio de Içamento/Elevação', ordem: 2 },
              { id: 'sec-3', titulo: '3. Avaliação de Estabilidade sob Carga (ausência de tombamento/deformação)', ordem: 3 },
              { id: 'sec-4', titulo: '4. Verificação de Sistemas de Segurança Durante o Teste (limitador de carga, alarme de sobrecarga)', ordem: 4 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Carga de teste definida (percentual conforme norma/fabricante, ex.: 110% da capacidade nominal)', status: 'conforme', observacao: 'Carga estática de 125% e dinâmica de 110% calculadas' },
              { id: 'ck-2', descricao: 'Pesagem da carga de teste conferida', status: 'conforme', observacao: 'Pesagem conferida via célula de carga calibrada' },
              { id: 'ck-3', descricao: 'Ensaio realizado sem deformação permanente do equipamento', status: 'conforme', observacao: 'Deflexão elástica reversível sem empenamento' },
              { id: 'ck-4', descricao: 'Estabilidade mantida sem indício de tombamento', status: 'conforme', observacao: 'Apoios e pneus mantiveram contato e estabilidade contínua' },
              { id: 'ck-5', descricao: 'Tempo de sustentação da carga cumprido conforme metodologia', status: 'conforme', observacao: 'Carga sustentada por 10 minutos sem queda de altura dos cilindros' },
              { id: 'ck-6', descricao: 'Limitador de carga acionado corretamente durante o teste', status: 'conforme', observacao: 'Dispositivo bloqueou movimentos que aumentam o momento' },
              { id: 'ck-7', descricao: 'Alarme de sobrecarga testado e funcional', status: 'conforme', observacao: 'Sinal sonoro e luminoso disparou no limiar de sobrecarga' },
              { id: 'ck-8', descricao: 'Certificado de aferição do dinamômetro/célula de carga utilizado anexado', status: 'conforme', observacao: 'Certificado RBC anexado ao prontuário do laudo' },
              { id: 'ck-9', descricao: 'Relatório fotográfico do ensaio elaborado', status: 'conforme', observacao: 'Registro fotográfico das fases de içamento e sustentação registrado' }
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Avaliação de Freio de Emergência e Freio de Serviço', ordem: 1 },
              { id: 'sec-2', titulo: '2. Avaliação de Sinalização Sonora e Visual', ordem: 2 },
              { id: 'sec-3', titulo: '3. Verificação de Vazamentos Hidráulicos', ordem: 3 },
              { id: 'sec-4', titulo: '4. Avaliação do Sistema de Vibração/Compactação (rolo compactador)', ordem: 4 },
              { id: 'sec-5', titulo: '5. Avaliação do Sistema de Aquecimento de Massa Asfáltica (vibroacabadora, quando aplicável)', ordem: 5 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Freio de emergência testado', status: 'conforme', observacao: 'Parada abrupta acionada com sucesso' },
              { id: 'ck-2', descricao: 'Freio de serviço testado', status: 'conforme', observacao: 'Frenagem hidrostática suave e sem atrasos' },
              { id: 'ck-3', descricao: 'Sinalização sonora de ré funcional', status: 'conforme', observacao: 'Buzina e alarme sonoro operacionais' },
              { id: 'ck-4', descricao: 'Giroflex/luz de alerta funcional', status: 'conforme', observacao: 'Sinalizador rotativo amarelo funcional' },
              { id: 'ck-5', descricao: 'Vazamentos hidráulicos verificados (cilindros, mangueiras, bomba)', status: 'conforme', observacao: 'Circuito hidráulico fechado sem pontos de vazamento' },
              { id: 'ck-6', descricao: 'Sistema de vibração/compactação testado', status: 'conforme', observacao: 'Amplitudes alta e baixa de vibração operando normalmente' },
              { id: 'ck-7', descricao: 'Tambor/rolo sem danos estruturais', status: 'conforme', observacao: 'Casca do tambor cilíndrica sem amassamentos ou desgastes profundos' },
              { id: 'ck-8', descricao: 'Sistema de aquecimento de massa avaliado, quando aplicável (vibroacabadora)', status: 'conforme', observacao: 'Queimadores/resistências elétricas da mesa compactadora operando' },
              { id: 'ck-9', descricao: 'Cabine do operador com visibilidade adequada', status: 'conforme', observacao: 'Espelhos e campo visual periférico desimpedidos' },
              { id: 'ck-10', descricao: 'Extintor de incêndio a bordo conferido', status: 'conforme', observacao: 'Extintor pressurizado fixado ao alcance do operador' }
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Inspeção de Cabos de Aço (fios rompidos, corrosão, lubrificação)', ordem: 1 },
              { id: 'sec-2', titulo: '2. Inspeção de Ganchos e Travas de Segurança (catraca de segurança)', ordem: 2 },
              { id: 'sec-3', titulo: '3. Inspeção de Cintas e Lingas (validade, integridade, capacidade)', ordem: 3 },
              { id: 'sec-4', titulo: '4. Inspeção de Patolas e Estabilizadores', ordem: 4 },
              { id: 'sec-5', titulo: '5. Inspeção de Roldanas e Tambor de Enrolamento', ordem: 5 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Cabo de aço sem fios rompidos acima do limite normativo', status: 'conforme', observacao: 'Critério de descarte NBR ISO 4309 respeitado' },
              { id: 'ck-2', descricao: 'Cabo de aço lubrificado e sem corrosão excessiva', status: 'conforme', observacao: 'Lubrificação asfáltica protetiva adequada' },
              { id: 'ck-3', descricao: 'Gancho com trava de segurança (catraca) funcional', status: 'conforme', observacao: 'Lingueta da catraca fecha com mola íntegra' },
              { id: 'ck-4', descricao: 'Gancho sem deformação ou desgaste no colo', status: 'conforme', observacao: 'Abertura da garganta dentro de 4% da dimensão nominal' },
              { id: 'ck-5', descricao: 'Cintas/lingas dentro da validade e sem cortes ou desgaste', status: 'conforme', observacao: 'Cintas tubulares e planas sem desfiamento ou contaminação química' },
              { id: 'ck-6', descricao: 'Capacidade das cintas/lingas compatível com a carga de trabalho', status: 'conforme', observacao: 'Carga máxima de trabalho (CMT) identificada na etiqueta azul' },
              { id: 'ck-7', descricao: 'Patolas/estabilizadores testados quanto a acionamento e travamento', status: 'conforme', observacao: 'Extensão horizontal e cilindros verticais com trava hidráulica' },
              { id: 'ck-8', descricao: 'Base de apoio das patolas avaliada (chapas de apoio, solo)', status: 'conforme', observacao: 'Sapatas com pranchas de madeira/poliuretano de distribuição de pressão' },
              { id: 'ck-9', descricao: 'Roldanas sem desgaste excessivo no canal', status: 'conforme', observacao: 'Garganta das polias sem desgaste assimétrico ou trincas' },
              { id: 'ck-10', descricao: 'Tambor de enrolamento sem danos ou deformações', status: 'conforme', observacao: 'Ranhoamento regular e no mínimo 3 voltas mortas de segurança' },
              { id: 'ck-11', descricao: 'Sistema de freio do guincho testado', status: 'conforme', observacao: 'Freio automático multidisco segurou carga suspensa' }
            ]
          },
          {
            id: 'laudo-lmi-guindaste',
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Verificação do Sistema Eletrônico de Sensores (ângulo, extensão da lança, carga)', ordem: 1 },
              { id: 'sec-2', titulo: '2. Teste de Aferição com Carga Conhecida em Diferentes Configurações de Lança', ordem: 2 },
              { id: 'sec-3', titulo: '3. Verificação de Alarmes Visuais e Sonoros de Sobrecarga', ordem: 3 },
              { id: 'sec-4', titulo: '4. Validação do Computador de Bordo (histórico de erros, calibração)', ordem: 4 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Sensor de ângulo da lança calibrado', status: 'conforme', observacao: 'Inclinômetro digital aferido com nível eletrônico padrão' },
              { id: 'ck-2', descricao: 'Sensor de extensão/comprimento da lança calibrado', status: 'conforme', observacao: 'Carretel de cabo de extensão com contagem métrica exata' },
              { id: 'ck-3', descricao: 'Célula de carga/sensor de carga calibrado', status: 'conforme', observacao: 'Pressostatos dos cilindros de elevação calibrados' },
              { id: 'ck-4', descricao: 'Teste realizado em ao menos três configurações de lança (curta, média, longa)', status: 'conforme', observacao: 'Ensaios em raio mínimo, intermediário e raio máximo executados' },
              { id: 'ck-5', descricao: 'Alarme visual de sobrecarga acionado corretamente', status: 'conforme', observacao: 'Luz amarela (90%) e luz vermelha (100%) acenderam no display' },
              { id: 'ck-6', descricao: 'Alarme sonoro de sobrecarga acionado corretamente', status: 'conforme', observacao: 'Buzzer contínuo disparou ao atingir 100% da tabela' },
              { id: 'ck-7', descricao: 'Corte automático de movimento perigoso testado, quando existente', status: 'conforme', observacao: 'Válvula solenoide bloqueou descida e telescópio' },
              { id: 'ck-8', descricao: 'Computador de bordo sem códigos de erro não resolvidos', status: 'conforme', observacao: 'Log de falhas limpo e parâmetros gravados na memória EEPROM' },
              { id: 'ck-9', descricao: 'Certificado de calibração dos sensores anexado', status: 'conforme', observacao: 'Certificado de ensaio rastreável anexado' },
              { id: 'ck-10', descricao: 'Teste registrado com data, resultado e responsável técnico', status: 'conforme', observacao: 'Ficha de calibração assinada pelo RT com ART' }
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
            temHrn: false,
            hrn: false,
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Identificação do Veículo (placa, chassi, renavam, marca/modelo, ano, km)', ordem: 1 },
              { id: 'sec-2', titulo: '2. Checklist Técnico de Itens Obrigatórios (CONTRAN) por Sistema', ordem: 2 },
              { id: 'sec-3', titulo: '3. Avaliação de Documentação e Regularidade (CRLV, licenciamento)', ordem: 3 },
              { id: 'sec-4', titulo: '4. Estimativa de Risco Operacional por Item Não Conforme', ordem: 4 },
              { id: 'sec-5', titulo: '5. Plano Corretivo por Veículo, com Priorização e Prazo', ordem: 5 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Pneus: profundidade dos sulcos, calibragem, estado de conservação (todos, incluindo estepe)', status: 'conforme', observacao: 'Sulcos acima do limite TWI de 1,6mm e calibrados' },
              { id: 'ck-2', descricao: 'Freios: eficiência de frenagem, freio de mão/estacionamento', status: 'conforme', observacao: 'Frenagem uniforme sem desvios laterais' },
              { id: 'ck-3', descricao: 'Sistema de direção: folga, alinhamento, ruídos anormais', status: 'conforme', observacao: 'Alinhamento em conformidade e sem folgas na caixa' },
              { id: 'ck-4', descricao: 'Suspensão: amortecedores, molas, buchas', status: 'conforme', observacao: 'Amortecedores sem vazamento e buchas íntegras' },
              { id: 'ck-5', descricao: 'Sistema elétrico: bateria, alternador, chicote', status: 'conforme', observacao: 'Tensão de carga de 14.2V e chicotes preservados' },
              { id: 'ck-6', descricao: 'Iluminação: faróis, lanternas, luz de freio, pisca-alerta, luz de ré', status: 'conforme', observacao: 'Todos os fachos e lâmpadas operacionais' },
              { id: 'ck-7', descricao: 'Buzina funcional', status: 'conforme', observacao: 'Acionamento acústico imediato' },
              { id: 'ck-8', descricao: 'Limpador e lavador de para-brisa funcionais', status: 'conforme', observacao: 'Palhetas de borracha sem ressecamento' },
              { id: 'ck-9', descricao: 'Retrovisores (interno e externos) íntegros', status: 'conforme', observacao: 'Espelhos com ajuste e sem trincas' },
              { id: 'ck-10', descricao: 'Para-brisa e vidros sem trincas que comprometam a visão', status: 'conforme', observacao: 'Área de varredura do condutor totalmente livre' },
              { id: 'ck-11', descricao: 'Cintos de segurança em todos os assentos, funcionais', status: 'conforme', observacao: 'Retração automática e travamento inercial testados' },
              { id: 'ck-12', descricao: 'Extintor de incêndio dentro da validade (quando exigido pela categoria)', status: 'conforme', observacao: 'Manômetro no verde e lacre inviolado' },
              { id: 'ck-13', descricao: 'Triângulo de sinalização e macaco/chave de roda presentes', status: 'conforme', observacao: 'Kit de emergência completo no porta-malas' },
              { id: 'ck-14', descricao: 'Estado da lataria/estrutura (corrosão, amassados que comprometam segurança)', status: 'conforme', observacao: 'Estrutura sem pontos críticos de oxidação' },
              { id: 'ck-15', descricao: 'Vazamentos de fluidos (óleo, freio, arrefecimento) verificados', status: 'conforme', observacao: 'Ausência de gotejamentos no cárter ou reservatórios' },
              { id: 'ck-16', descricao: 'Nível de fluidos conferido (óleo do motor, freio, arrefecimento)', status: 'conforme', observacao: 'Fluidos no nível entre marcas min/máx' },
              { id: 'ck-17', descricao: 'Sistema de escapamento e emissão de gases avaliado', status: 'conforme', observacao: 'Sem ruído excessivo de perfuração ou fumaça anormal' },
              { id: 'ck-18', descricao: 'Documentação do veículo (CRLV) conferida e regular', status: 'conforme', observacao: 'Exercício anual quitado e sem restrições impeditivas' },
              { id: 'ck-19', descricao: 'Quilometragem e histórico de manutenção registrados', status: 'conforme', observacao: 'Odômetro conferido e plano preventivo em dia' },
              { id: 'ck-20', descricao: 'Item(ns) não conforme(s) classificado(s) por severidade/urgência', status: 'conforme', observacao: 'Matriz de criticidade operacional atualizada' }
            ]
          },
          {
            id: 'laudo-transporte-escolar',
            codigo: 'VEIC-ESC',
            nome: 'Laudo Técnico para Transporte Escolar',
            temHrn: false,
            hrn: false,
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Identificação do Veículo e Documentação Específica de Transporte Escolar', ordem: 1 },
              { id: 'sec-2', titulo: '2. Verificação de Cintos de Segurança (individuais, por assento, lotação)', ordem: 2 },
              { id: 'sec-3', titulo: '3. Verificação do Registrador Instantâneo de Velocidade e Tempo (Tacógrafo)', ordem: 3 },
              { id: 'sec-4', titulo: '4. Verificação de Portas de Emergência, Saídas e Sinalização', ordem: 4 },
              { id: 'sec-5', titulo: '5. Verificação da Caracterização Externa Regulamentar (Faixa ESCOLAR)', ordem: 5 },
              { id: 'sec-6', titulo: '6. Verificação de Idade Máxima do Veículo (Legislação Local)', ordem: 6 },
              { id: 'sec-7', titulo: '7. Conformidade com ABNT NBR 17075:2022 (Item a Item da Norma)', ordem: 7 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Cinto de segurança individual funcional em todos os assentos', status: 'conforme', observacao: 'Cintos de 3 pontos para condutor/monitor e 2/3 pontos para passageiros' },
              { id: 'ck-2', descricao: 'Lotação máxima respeitada e sinalizada', status: 'conforme', observacao: 'Inscrição de capacidade de passageiros legível' },
              { id: 'ck-3', descricao: 'Tacógrafo/registrador instantâneo instalado e funcional', status: 'conforme', observacao: 'Aferido com certificado INMETRO vigente e disco/fita operante' },
              { id: 'ck-4', descricao: 'Porta de emergência sinalizada, desobstruída e com abertura testada', status: 'conforme', observacao: 'Mecanismo de abertura rápida testado com sucesso' },
              { id: 'ck-5', descricao: 'Extintor de incêndio dentro da validade e de fácil acesso', status: 'conforme', observacao: 'Tipo ABC instalado ao alcance do condutor' },
              { id: 'ck-6', descricao: 'Pintura externa na cor amarela padronizada (Resolução CONTRAN aplicável)', status: 'conforme', observacao: 'Faixa horizontal amarela de 40cm com dísticos em preto' },
              { id: 'ck-7', descricao: 'Faixa "ESCOLAR" frontal e traseira visível', status: 'conforme', observacao: 'Identificação frontal e posterior em perfeitas condições' },
              { id: 'ck-8', descricao: 'Identificação da empresa/órgão responsável afixada', status: 'conforme', observacao: 'Dados de contato e registro municipal fixados' },
              { id: 'ck-9', descricao: 'Idade do veículo dentro do limite legal aplicável', status: 'conforme', observacao: 'Ano de fabricação dentro do limite municipal de operação' },
              { id: 'ck-10', descricao: 'Pneus, freios e direção avaliados (item técnico geral do veículo)', status: 'conforme', observacao: 'Inspeção veicular mecânica aprovada' },
              { id: 'ck-11', descricao: 'Sistema de iluminação e sinalização (incluindo luz de parada obrigatória, quando exigida) conferido', status: 'conforme', observacao: 'Luzes de advertência intermitente operacionais' },
              { id: 'ck-12', descricao: 'Piso/assoalho sem furos, corrosão ou riscos de tropeço', status: 'conforme', observacao: 'Revestimento antiderrapante íntegro' },
              { id: 'ck-13', descricao: 'Ausência de partes cortantes/pontiagudas no interior', status: 'conforme', observacao: 'Proteções e forrações sem arestas perigosas' },
              { id: 'ck-14', descricao: 'Monitor/condutor com credenciais e documentação exigida por lei verificados', status: 'conforme', observacao: 'CNH categoria D/E com curso de transporte escolar válido' },
              { id: 'ck-15', descricao: 'Sistema de comunicação de emergência (rádio/celular) disponível a bordo', status: 'conforme', observacao: 'Dispositivo móvel com suporte operacional' },
              { id: 'ck-16', descricao: 'Conformidade item a item com a ABNT NBR 17075:2022 registrada', status: 'conforme', observacao: 'Planilha de atendimento aos requisitos da NBR 17075 concluída' }
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
            temHrn: false,
            hrn: false,
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Identificação do Veículo e Histórico do Sinistro', ordem: 1 },
              { id: 'sec-2', titulo: '2. Álbum Fotográfico Categorizado (Frente, Traseira, Laterais, Teto, Chassi)', ordem: 2 },
              { id: 'sec-3', titulo: '3. Verificação da Numeração de Chassi e Gravação', ordem: 3 },
              { id: 'sec-4', titulo: '4. Avaliação Estrutural por Componente (Colunas, Soleiras, Longarinas)', ordem: 4 },
              { id: 'sec-5', titulo: '5. Avaliação de Sistemas Críticos (Direção, Freios, Suspensão, Airbags)', ordem: 5 },
              { id: 'sec-6', titulo: '6. Enquadramento de Monta Conforme Resolução CONTRAN nº 810/2020', ordem: 6 },
              { id: 'sec-7', titulo: '7. Parecer Técnico Conclusivo sobre Viabilidade de Regularização', ordem: 7 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Numeração de chassi conferida e sem indícios de adulteração', status: 'conforme', observacao: 'Gravação original de fábrica sem marcas de abrasão ou implante' },
              { id: 'ck-2', descricao: 'Histórico do sinistro (natureza, data, extensão inicial) levantado', status: 'conforme', observacao: 'Boletim de ocorrência e relatório inicial analisados' },
              { id: 'ck-3', descricao: 'Álbum fotográfico completo por categoria realizado', status: 'conforme', observacao: 'Registro fotográfico em 360 graus com alta definição' },
              { id: 'ck-4', descricao: 'Colunas (A, B, C) avaliadas estruturalmente', status: 'conforme', observacao: 'Alinhamento preservado sem torção nas colunas' },
              { id: 'ck-5', descricao: 'Soleiras e assoalho avaliados', status: 'conforme', observacao: 'Estrutura inferior sem vincos estruturais' },
              { id: 'ck-6', descricao: 'Teto e estrutura superior avaliados', status: 'conforme', observacao: 'Sem deformação plástica na armação do teto' },
              { id: 'ck-7', descricao: 'Longarinas e travessas avaliadas', status: 'conforme', observacao: 'Medições em gabarito confirmam integridade das cotas originais' },
              { id: 'ck-8', descricao: 'Sistema de direção avaliado pós-sinistro', status: 'conforme', observacao: 'Mecanismo e terminais sem empenamento' },
              { id: 'ck-9', descricao: 'Sistema de freios avaliado pós-sinistro', status: 'conforme', observacao: 'Tubulações e pinças íntegras' },
              { id: 'ck-10', descricao: 'Suspensão avaliada pós-sinistro', status: 'conforme', observacao: 'Bandejas e amortecedores alinhados' },
              { id: 'ck-11', descricao: 'Airbags e pré-tensionadores avaliados (acionados/não acionados, substituição)', status: 'conforme', observacao: 'Dispositivos de segurança suplementar em conformidade' },
              { id: 'ck-12', descricao: 'Sistema elétrico/eletrônico avaliado (módulos, chicotes)', status: 'conforme', observacao: 'Scanner veicular sem códigos de falha de segurança' },
              { id: 'ck-13', descricao: 'Componentes substituídos identificados e comparados à especificação original', status: 'conforme', observacao: 'Peças genuínas ou equivalentes homologadas' },
              { id: 'ck-14', descricao: 'Classificação de monta (Pequena/Média/Grande) justificada tecnicamente', status: 'conforme', observacao: 'Pontuação total enquadrada com precisão matemática' },
              { id: 'ck-15', descricao: 'Memorial descritivo da reclassificação elaborado', status: 'conforme', observacao: 'Memorial formal anexado nos moldes do SENATRAN' },
              { id: 'ck-16', descricao: 'Parecer conclusivo sobre viabilidade de regularização junto ao DETRAN', status: 'conforme', observacao: 'Aptidão técnica para desclassificação de dano veicular' }
            ]
          },
          {
            id: 'laudo-sinistro-veicular',
            codigo: 'VEIC-SINISTRO',
            nome: 'Laudo de Avaliação de Sinistro Veicular e Danos Estruturais',
            temHrn: false,
            hrn: false,
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Identificação do Veículo e Contextualização do Sinistro', ordem: 1 },
              { id: 'sec-2', titulo: '2. Perícia de Avarias Mecânicas (Motor, Câmbio, Arrefecimento, Suspensão)', ordem: 2 },
              { id: 'sec-3', titulo: '3. Avaliação Estrutural de Chassi/Monobloco (Deformações, Cortes)', ordem: 3 },
              { id: 'sec-4', titulo: '4. Medição de Alinhamento de Monobloco (Comparação às Cotas de Fábrica)', ordem: 4 },
              { id: 'sec-5', titulo: '5. Avaliação de Componentes de Segurança (Airbags, Cintos, Travessas)', ordem: 5 },
              { id: 'sec-6', titulo: '6. Análise de Historicidade do Veículo (Sinistros Anteriores)', ordem: 6 },
              { id: 'sec-7', titulo: '7. Álbum Fotográfico Categorizado das Avarias', ordem: 7 },
              { id: 'sec-8', titulo: '8. Parecer Conclusivo (Viabilidade Econômica vs Perda Total)', ordem: 8 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Ponto de impacto identificado e extensão do dano delimitada', status: 'conforme', observacao: 'Vetor de colisão dianteiro esquerdo determinado' },
              { id: 'ck-2', descricao: 'Motor e componentes mecânicos avaliados quanto a danos', status: 'conforme', observacao: 'Bloco íntegro com danos restritos a suportes e correias' },
              { id: 'ck-3', descricao: 'Câmbio e transmissão avaliados quanto a danos', status: 'conforme', observacao: 'Carcaça de transmissão sem trincas' },
              { id: 'ck-4', descricao: 'Sistema de arrefecimento avaliado (radiador, mangueiras)', status: 'nao_conforme', observacao: 'Radiador e condensador avariados com perda de fluido' },
              { id: 'ck-5', descricao: 'Suspensão avaliada (danos por impacto)', status: 'nao_conforme', observacao: 'Amortecedor e manga de eixo dianteira esquerda comprometidos' },
              { id: 'ck-6', descricao: 'Estrutura do chassi/monobloco inspecionada visualmente', status: 'conforme', observacao: 'Inspeção minuciosa com registro fotográfico macro' },
              { id: 'ck-7', descricao: 'Indícios de corte e solda emendada verificados', status: 'conforme', observacao: 'Sem indícios de intervenções clandestinas ou cortes preexistentes' },
              { id: 'ck-8', descricao: 'Alinhamento do monobloco medido e comparado às cotas de fábrica', status: 'conforme', observacao: 'Desvio dimensional dentro dos limites aceitáveis para repuxo' },
              { id: 'ck-9', descricao: 'Airbags avaliados (acionamento, substituição, integridade dos sensores)', status: 'conforme', observacao: 'Bolsas dianteiras acionadas de forma compatível com a desaceleração' },
              { id: 'ck-10', descricao: 'Pré-tensionadores de cinto avaliados', status: 'conforme', observacao: 'Disparados no impacto e necessitam de substituição' },
              { id: 'ck-11', descricao: 'Estruturas de absorção de impacto (para-choques, longarinas) avaliadas', status: 'conforme', observacao: 'Alma do para-choque absorveu a energia cinética inicial' },
              { id: 'ck-12', descricao: 'Sistema elétrico/eletrônico avaliado quanto a danos', status: 'conforme', observacao: 'Chicote dianteiro intacto na sua maioria' },
              { id: 'ck-13', descricao: 'Histórico de sinistros anteriores do veículo consultado', status: 'conforme', observacao: 'Consulta a bases de dados veiculares sem apontamentos prévios' },
              { id: 'ck-14', descricao: 'Álbum fotográfico categorizado (frontal, traseira, laterais, interior, estrutura) elaborado', status: 'conforme', observacao: 'Dossiê fotográfico de alta resolução montado' },
              { id: 'ck-15', descricao: 'Comparação de custo de reparo x valor de mercado do veículo realizada', status: 'conforme', observacao: 'Orçamento de recuperação estimado em 38% do valor FIPE' },
              { id: 'ck-16', descricao: 'Parecer conclusivo sobre viabilidade de reparo ou perda total emitido', status: 'conforme', observacao: 'Sinistro classificado tecnicamente como passível de recuperação (Média Monta)' }
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
        nome: 'Segurança em Áreas de Recreação Infantis (Playground)',
        tipos: [
          {
            id: 'laudo-playground-nbr16071',
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Identificação do Playground (localização, área total, equipamentos existentes)', ordem: 1 },
              { id: 'sec-2', titulo: '2. Verificação de Superfícies de Impacto e Área de Queda Livre (conforme altura de queda)', ordem: 2 },
              { id: 'sec-3', titulo: '3. Verificação de Rotas de Aprisionamento (cabeça/pescoço, dedos, roupas/cordões)', ordem: 3 },
              { id: 'sec-4', titulo: '4. Verificação de Ancoragens, Fundações e Fixação dos Equipamentos', ordem: 4 },
              { id: 'sec-5', titulo: '5. Verificação de Materiais e Acabamento (arestas, pontas, ferrugem)', ordem: 5 },
              { id: 'sec-6', titulo: '6. Verificação Específica por Tipo de Equipamento (balanços, escorregadores, gangorras, carrossel)', ordem: 6 },
              { id: 'sec-7', titulo: '7. Verificação de Zona de Segurança e Distância Mínima Entre Equipamentos', ordem: 7 },
              { id: 'sec-8', titulo: '8. Verificação de Sinalização de Idade Recomendada e Normas de Uso', ordem: 8 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Superfície de amortecimento de impacto adequada à altura de queda livre de cada equipamento', status: 'conforme', observacao: 'Piso emborrachado contínuo com absorção de impacto certificada' },
              { id: 'ck-2', descricao: 'Área de queda livre desobstruída', status: 'conforme', observacao: 'Raio de segurança livre de obstáculos fixos ou vegetação agressiva' },
              { id: 'ck-3', descricao: 'Ausência de pontos de aprisionamento de cabeça/pescoço (aberturas entre 89 e 230 mm)', status: 'conforme', observacao: 'Testado com gabarito normativo de cabeça' },
              { id: 'ck-4', descricao: 'Ausência de pontos de aprisionamento de dedos', status: 'conforme', observacao: 'Aberturas menores que 8mm ou maiores que 25mm' },
              { id: 'ck-5', descricao: 'Ausência de pontos de prendimento de roupas ou cordões', status: 'conforme', observacao: 'Sem saliências ou parafusos salientes em áreas de deslizamento' },
              { id: 'ck-6', descricao: 'Ancoragens e fundações firmes, sem corrosão', status: 'conforme', observacao: 'Sapatas enterradas e protegidas contra intempéries' },
              { id: 'ck-7', descricao: 'Ausência de arestas cortantes ou pontas expostas', status: 'conforme', observacao: 'Cantos chanfrados e arredondados com raio mínimo normativo' },
              { id: 'ck-8', descricao: 'Ausência de ferrugem estrutural comprometedora', status: 'conforme', observacao: 'Pintura eletrostática em bom estado' },
              { id: 'ck-9', descricao: 'Correntes/cabos de balanços sem desgaste excessivo', status: 'conforme', observacao: 'Elos calibrados com espessura dentro da tolerância' },
              { id: 'ck-10', descricao: 'Escorregador com ângulo e altura conformes à norma', status: 'conforme', observacao: 'Seção de desaceleração e altura terminal adequadas' },
              { id: 'ck-11', descricao: 'Gangorra com sistema de amortecimento no ponto de contato', status: 'conforme', observacao: 'Batentes de borracha intactos sob os assentos' },
              { id: 'ck-12', descricao: 'Carrossel com velocidade de rotação controlada', status: 'conforme', observacao: 'Regulador de velocidade operacional e piso nivelado' },
              { id: 'ck-13', descricao: 'Zona de segurança entre equipamentos respeitada (distância mínima)', status: 'conforme', observacao: 'Afastamentos mínimos entre áreas de impacto atendidos' },
              { id: 'ck-14', descricao: 'Sinalização de idade recomendada e normas de uso afixada', status: 'conforme', observacao: 'Placa visível na entrada com faixas etárias indicadas' },
              { id: 'ck-15', descricao: 'Identificação de fabricante/certificação do equipamento, quando aplicável', status: 'conforme', observacao: 'Plaqueta do fabricante com rastreabilidade afixada' }
            ]
          },
          {
            id: 'laudo-playground-risco',
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Mapeamento de Partes Lascadas e Degradação de Madeira/Plástico', ordem: 1 },
              { id: 'sec-2', titulo: '2. Mapeamento de Ferrugem e Corrosão Estrutural', ordem: 2 },
              { id: 'sec-3', titulo: '3. Verificação de Parafusos Expostos, Soltos ou Faltantes', ordem: 3 },
              { id: 'sec-4', titulo: '4. Verificação de Folgas Estruturais e Desgaste de Articulações (balanços, gangorras)', ordem: 4 },
              { id: 'sec-5', titulo: '5. Classificação de Prioridade das Não Conformidades (Crítica, Moderada, Baixa)', ordem: 5 },
              { id: 'sec-6', titulo: '6. Plano de Ação Corretivo com Prazos', ordem: 6 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Partes lascadas/rachadas identificadas e mapeadas', status: 'conforme', observacao: 'Madeiramento lixado e sem lascas perfurantes' },
              { id: 'ck-2', descricao: 'Ferrugem/corrosão estrutural mapeada', status: 'conforme', observacao: 'Mapeamento efetuado nas colunas e flanges metálicas' },
              { id: 'ck-3', descricao: 'Parafusos soltos ou faltantes identificados', status: 'conforme', observacao: 'Fixações reapertadas e conferidas' },
              { id: 'ck-4', descricao: 'Tampas de proteção de parafusos presentes', status: 'conforme', observacao: 'Capas de polímero instaladas em todas as porcas salientes' },
              { id: 'ck-5', descricao: 'Folgas em articulações de balanços/gangorras medidas', status: 'conforme', observacao: 'Mancais e buchas com folga dentro do limite seguro' },
              { id: 'ck-6', descricao: 'Desgaste de correntes/cabos avaliado', status: 'conforme', observacao: 'Elos com perda de seção inferior ao limite de descarte' },
              { id: 'ck-7', descricao: 'Superfície de amortecimento com desgaste ou deslocamento verificado', status: 'conforme', observacao: 'Manta amortecedora nivelada e sem buracos' },
              { id: 'ck-8', descricao: 'Vegetação ou obstáculos próximos ao playground avaliados', status: 'conforme', observacao: 'Podas de segurança realizadas' },
              { id: 'ck-9', descricao: 'Classificação de prioridade (crítica/moderada/baixa) atribuída a cada não conformidade', status: 'conforme', observacao: 'Matriz de criticidade documentada' },
              { id: 'ck-10', descricao: 'Plano de ação corretivo elaborado com prazos por item', status: 'conforme', observacao: 'Cronograma executivo com responsáveis definido' }
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Identificação da Estrutura (tipologia: tesoura, pórtico ou treliça; vão livre; área coberta)', ordem: 1 },
              { id: 'sec-2', titulo: '2. Avaliação de Deformações e Indícios de Flambagem em Elementos Estruturais', ordem: 2 },
              { id: 'sec-3', titulo: '3. Avaliação de Corrosão (localização, severidade, estimativa de perda de seção)', ordem: 3 },
              { id: 'sec-4', titulo: '4. Medição de Flechas em Tesouras/Treliças/Pilares e Comparação ao Limite Normativo', ordem: 4 },
              { id: 'sec-5', titulo: '5. Avaliação de Ligações Parafusadas e Soldadas', ordem: 5 },
              { id: 'sec-6', titulo: '6. Avaliação da Fixação da Cobertura, Calhas e Sistema de Drenagem Pluvial', ordem: 6 },
              { id: 'sec-7', titulo: '7. Avaliação de Contraventamentos', ordem: 7 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Tipologia estrutural identificada (tesoura, pórtico ou treliça)', status: 'conforme', observacao: 'Galpão em pórticos de alma cheia em perfis W laminados' },
              { id: 'ck-2', descricao: 'Vão livre e área coberta conferidos', status: 'conforme', observacao: 'Vão livre de 25 metros sem pilares intermediários' },
              { id: 'ck-3', descricao: 'Deformações visíveis em elementos estruturais mapeadas', status: 'conforme', observacao: 'Alinhamento longitudinal e transversal preservados' },
              { id: 'ck-4', descricao: 'Indícios de flambagem em barras comprimidas verificados', status: 'conforme', observacao: 'Sem indícios de flambagem local ou global' },
              { id: 'ck-5', descricao: 'Corrosão mapeada por elemento (localização e severidade)', status: 'conforme', observacao: 'Focos superficiais localizados em bases de pilares' },
              { id: 'ck-6', descricao: 'Perda de seção por corrosão estimada', status: 'conforme', observacao: 'Perda inferior a 2%, não comprometedora' },
              { id: 'ck-7', descricao: 'Flechas medidas em tesouras/treliças/pilares', status: 'conforme', observacao: 'Flecha máxima em vão central de L/480' },
              { id: 'ck-8', descricao: 'Flechas comparadas ao limite normativo aplicável', status: 'conforme', observacao: 'Atende ao limite normativo L/350 da NBR 8800' },
              { id: 'ck-9', descricao: 'Ligações parafusadas conferidas (torque, ausência de folga)', status: 'conforme', observacao: 'Parafusos estruturais ASTM A325 conferidos' },
              { id: 'ck-10', descricao: 'Ligações soldadas inspecionadas visualmente', status: 'conforme', observacao: 'Soldas de nós de emenda íntegras' },
              { id: 'ck-11', descricao: 'Fixação da cobertura (telhas) verificada', status: 'conforme', observacao: 'Parafusos autobrocantes com arruelas de vedação preservadas' },
              { id: 'ck-12', descricao: 'Calhas e sistema de drenagem pluvial avaliados', status: 'conforme', observacao: 'Calhas metálicas desobstruídas e sem vazamentos' },
              { id: 'ck-13', descricao: 'Contraventamentos verificados quanto à integridade', status: 'conforme', observacao: 'Tirantes de cobertura e laterais devidamente tracionados' },
              { id: 'ck-14', descricao: 'Pintura anticorrosiva avaliada', status: 'conforme', observacao: 'Primer epóxi e acabamento poliuretano em bom estado' }
            ]
          },
          {
            id: 'laudo-capacidade-piso',
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Identificação da Estrutura do Piso/Mezanino (tipo de laje/piso, vigas, pilares)', ordem: 1 },
              { id: 'sec-2', titulo: '2. Levantamento da Capacidade de Projeto Original, quando disponível', ordem: 2 },
              { id: 'sec-3', titulo: '3. Verificação da Capacidade de Suporte por m² Conforme Uso Pretendido (NBR 6120)', ordem: 3 },
              { id: 'sec-4', titulo: '4. Avaliação para Armazenagem (empilhamento de materiais)', ordem: 4 },
              { id: 'sec-5', titulo: '5. Avaliação para Tráfego de Empilhadeiras e Equipamentos Móveis', ordem: 5 },
              { id: 'sec-6', titulo: '6. Parecer sobre Adequação ou Necessidade de Reforço Estrutural', ordem: 6 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Estrutura do piso/mezanino identificada (tipo, vigas, pilares)', status: 'conforme', observacao: 'Mezanino com vigas principais W 310x38.7 e laje tipo steel deck' },
              { id: 'ck-2', descricao: 'Capacidade de projeto original levantada, quando existente', status: 'conforme', observacao: 'Memorial de cálculo original previa 500 kgf/m²' },
              { id: 'ck-3', descricao: 'Carga atual/pretendida comparada à capacidade calculada', status: 'conforme', observacao: 'Carregamento atuante verificado dentro dos limites admissíveis' },
              { id: 'ck-4', descricao: 'Sobrecarga de utilização verificada conforme ABNT NBR 6120', status: 'conforme', observacao: 'Classificação de uso como depósito leve atendida' },
              { id: 'ck-5', descricao: 'Avaliação de tráfego de empilhadeiras (carga dinâmica e concentrada) realizada', status: 'conforme', observacao: 'Tráfego restrito a transpaleteiras manuais homologado' },
              { id: 'ck-6', descricao: 'Deformações ou fissuras na estrutura do piso/mezanino verificadas', status: 'conforme', observacao: 'Sem flechas residuais ou fissuras no concreto de capa' },
              { id: 'ck-7', descricao: 'Guarda-corpo do mezanino conferido (altura, resistência)', status: 'conforme', observacao: 'Guarda-corpo com 1,20m e rodapé de 20cm conforme NR-12' },
              { id: 'ck-8', descricao: 'Sinalização de carga máxima admissível afixada', status: 'conforme', observacao: 'Placas indicativas de 500 kgf/m² instaladas em pontos visíveis' },
              { id: 'ck-9', descricao: 'Parecer sobre adequação ou necessidade de reforço estrutural emitido', status: 'conforme', observacao: 'Estrutura aprovada sem necessidade de reforço' }
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Identificação das Juntas Soldadas Inspecionadas (localização, tipo de junta)', ordem: 1 },
              { id: 'sec-2', titulo: '2. Inspeção Visual (porosidade, mordedura, respingos, trincas superficiais)', ordem: 2 },
              { id: 'sec-3', titulo: '3. Verificação Dimensional (perna de solda, comprimento do cordão, reforço)', ordem: 3 },
              { id: 'sec-4', titulo: '4. Verificação de Indícios de Falta de Penetração/Fusão', ordem: 4 },
              { id: 'sec-5', titulo: '5. Classificação de Aceitação/Rejeição por Junta Conforme Critério AWS D1.1', ordem: 5 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Juntas soldadas identificadas e numeradas', status: 'conforme', observacao: 'Mapeamento efetuado no desenho isométrico/estrutural' },
              { id: 'ck-2', descricao: 'Inspeção visual realizada em todas as juntas listadas', status: 'conforme', observacao: '100% dos cordões vistoriados sob iluminação adequada' },
              { id: 'ck-3', descricao: 'Porosidade superficial verificada', status: 'conforme', observacao: 'Sem presença de porosidades agrupadas ou vermiformes' },
              { id: 'ck-4', descricao: 'Mordedura (undercut) verificada', status: 'conforme', observacao: 'Profundidade inferior a 0,5 mm, conforme tabela AWS D1.1' },
              { id: 'ck-5', descricao: 'Respingos de solda verificados', status: 'conforme', observacao: 'Superfícies limpas e isentas de respingos aderidos' },
              { id: 'ck-6', descricao: 'Trincas superficiais verificadas', status: 'conforme', observacao: 'Ausência total de trincas longitudinais ou de cratera' },
              { id: 'ck-7', descricao: 'Dimensão da perna de solda (perna do filete) medida', status: 'conforme', observacao: 'Perna medida com gabarito tipo Cambridge de acordo com o EPS' },
              { id: 'ck-8', descricao: 'Comprimento do cordão conferido', status: 'conforme', observacao: 'Extensão contínua sem interrupções não conformes' },
              { id: 'ck-9', descricao: 'Reforço da solda de topo verificado', status: 'conforme', observacao: 'Reforço dentro do limite normativo de 1,5 a 3,0 mm' },
              { id: 'ck-10', descricao: 'Sobreposição/desalinhamento de chapas verificado', status: 'conforme', observacao: 'Alinhamento com desalinhamento inferior a 10% da espessura' },
              { id: 'ck-11', descricao: 'Critério de aceitação/rejeição aplicado por junta', status: 'conforme', observacao: 'Juntas aprovadas segundo critérios da norma AWS D1.1' },
              { id: 'ck-12', descricao: 'Registro fotográfico por junta inspecionada', status: 'conforme', observacao: 'Fotografias em alta resolução arquivadas no relatório' }
            ]
          },
          {
            id: 'laudo-ensaios-end',
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Definição do Método de Ensaio Aplicado por Junta/Ponto (LP, PM, US, RX)', ordem: 1 },
              { id: 'sec-2', titulo: '2. Metodologia de Execução do Ensaio (preparação, aplicação, tempos)', ordem: 2 },
              { id: 'sec-3', titulo: '3. Resultados por Junta/Ponto Inspecionado', ordem: 3 },
              { id: 'sec-4', titulo: '4. Classificação de Descontinuidades Encontradas (tipo, dimensão, localização)', ordem: 4 },
              { id: 'sec-5', titulo: '5. Parecer de Aprovação/Reprovação Conforme Critério de Aceitação', ordem: 5 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Método de ensaio definido por junta/ponto (LP/PM/US/RX)', status: 'conforme', observacao: 'Ensaio por Líquido Penetrante Visível e Ultrassom Phased Array selecionados' },
              { id: 'ck-2', descricao: 'Superfície preparada conforme exigência do método', status: 'conforme', observacao: 'Desengraxe e escovação mecânica efetuados' },
              { id: 'ck-3', descricao: 'Ensaio executado conforme procedimento aplicável', status: 'conforme', observacao: 'Procedimento qualificado conforme ASME V Artigo 6' },
              { id: 'ck-4', descricao: 'Resultados registrados por junta/ponto', status: 'conforme', observacao: 'Mapeamento completo das indicações detectadas' },
              { id: 'ck-5', descricao: 'Descontinuidades classificadas (tipo, dimensão, localização)', status: 'conforme', observacao: 'Sem indicações lineares relevantes detectadas' },
              { id: 'ck-6', descricao: 'Critério de aceitação aplicado, com norma de referência informada', status: 'conforme', observacao: 'Critério de aceitação ASME VIII Div 1 Apêndice 8' },
              { id: 'ck-7', descricao: 'Certificado de qualificação do inspetor (nível 1/2, conforme SNQC/ABENDI) anexado', status: 'conforme', observacao: 'Inspetor END Nível 2 LP/US certificado ABENDI' },
              { id: 'ck-8', descricao: 'Equipamento de ensaio calibrado e com certificado válido', status: 'conforme', observacao: 'Aparelho de ultrassom e blocos padrão calibrados com rastreabilidade RBC' },
              { id: 'ck-9', descricao: 'Parecer de aprovação/reprovação emitido por junta/ponto', status: 'conforme', observacao: 'Juntas avaliadas aprovadas sem restrições' },
              { id: 'ck-10', descricao: 'Registro fotográfico/radiográfico anexado', status: 'conforme', observacao: 'Relatório fotográfico sob luz branca > 1000 lux anexado' }
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Identificação do Equipamento (capacidade nominal, vão, fabricante, TAG)', ordem: 1 },
              { id: 'sec-2', titulo: '2. Vistoria Estrutural das Vigas de Rolamento (trilhos, alinhamento, desgaste)', ordem: 2 },
              { id: 'sec-3', titulo: '3. Verificação de Barramentos Elétricos (cabos, coletores, isolamento)', ordem: 3 },
              { id: 'sec-4', titulo: '4. Verificação da Talha (cabo/corrente, freio, redutor)', ordem: 4 },
              { id: 'sec-5', titulo: '5. Verificação do Sistema de Freios (translação e elevação)', ordem: 5 },
              { id: 'sec-6', titulo: '6. Verificação de Fins de Curso e Dispositivos de Segurança', ordem: 6 },
              { id: 'sec-7', titulo: '7. Verificação da Estrutura da Ponte/Pórtico (viga principal e carrinho)', ordem: 7 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Capacidade nominal identificada na placa do equipamento', status: 'conforme', observacao: 'Placa indelével afixada com capacidade de 10 toneladas' },
              { id: 'ck-2', descricao: 'Vão da ponte/pórtico conferido', status: 'conforme', observacao: 'Vão livre de 18,50 m aferido com trena a laser' },
              { id: 'ck-3', descricao: 'Trilhos de rolamento avaliados quanto a desgaste e alinhamento', status: 'conforme', observacao: 'Trilhos alinhados e sem deformações ou degraus nas juntas' },
              { id: 'ck-4', descricao: 'Rodas do carrinho/ponte avaliadas', status: 'conforme', observacao: 'Frisos das rodas íntegros e sem desgastes acentuados' },
              { id: 'ck-5', descricao: 'Barramento elétrico isolado e sem danos aparentes', status: 'conforme', observacao: 'Barramento blindado protegido e devidamente aterrado' },
              { id: 'ck-6', descricao: 'Coletores de energia avaliados', status: 'conforme', observacao: 'Sapatas coletoras com pressão de mola e espessura adequadas' },
              { id: 'ck-7', descricao: 'Cabo de aço/corrente da talha sem desgaste ou corrosão', status: 'conforme', observacao: 'Cabo lubrificado sem arames rompidos ou dobras' },
              { id: 'ck-8', descricao: 'Freio de elevação testado', status: 'conforme', observacao: 'Retenção imediata sob carga de ensaio sem deslizamento' },
              { id: 'ck-9', descricao: 'Freio de translação testado', status: 'conforme', observacao: 'Frenagem suave com desaceleração conforme norma' },
              { id: 'ck-10', descricao: 'Redutor sem vazamento de óleo ou ruído anormal', status: 'conforme', observacao: 'Nível de óleo adequado e vedação intacta' },
              { id: 'ck-11', descricao: 'Fins de curso (superior, inferior, lateral) testados', status: 'conforme', observacao: 'Sensores de fim de curso acionados com precisão' },
              { id: 'ck-12', descricao: 'Limitador de carga testado', status: 'conforme', observacao: 'Célula de carga atuando e cortando içamento em 105% da nominal' },
              { id: 'ck-13', descricao: 'Botão de emergência testado', status: 'conforme', observacao: 'Desarme instantâneo do contator geral verificado' },
              { id: 'ck-14', descricao: 'Controle pendente (botoeira) sem danos', status: 'conforme', observacao: 'Cabo de aço de sustentação aliviando tração dos condutores elétricos' },
              { id: 'ck-15', descricao: 'Estrutura da viga principal sem deformação ou trinca', status: 'conforme', observacao: 'Flecha estática inferior a L/800 conforme NBR 8400' },
              { id: 'ck-16', descricao: 'Estrutura do carrinho sem deformação', status: 'conforme', observacao: 'Chassi do trole alinhado e sem trincas nas soldas' },
              { id: 'ck-17', descricao: 'Sinalização de capacidade nominal afixada na ponte/pórtico', status: 'conforme', observacao: 'Inscrições visíveis do piso em ambos os lados da viga' }
            ]
          },
          {
            id: 'laudo-vida-util-swp',
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Levantamento do Histórico de Ciclos de Operação (horas, ciclos)', ordem: 1 },
              { id: 'sec-2', titulo: '2. Classificação do Grupo de Utilização e Estado de Carga (ISO 4301 / FEM 1.001)', ordem: 2 },
              { id: 'sec-3', titulo: '3. Cálculo do SWP (Período de Trabalho Seguro) com Base na Classificação', ordem: 3 },
              { id: 'sec-4', titulo: '4. Estimativa da Vida Útil Remanescente', ordem: 4 },
              { id: 'sec-5', titulo: '5. Recomendação de Periodicidade de Reinspeção', ordem: 5 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Histórico de operação levantado (horas, ciclos), quando disponível', status: 'conforme', observacao: 'Horímetro e relatórios de turnos de produção coletados' },
              { id: 'ck-2', descricao: 'Classe de utilização (U0–U9, conforme ISO 4301) definida', status: 'conforme', observacao: 'Classificado como classe U4 (operação moderada)' },
              { id: 'ck-3', descricao: 'Estado de carga (Q1–Q4) definido', status: 'conforme', observacao: 'Estado de carga Q2 (médio) determinado' },
              { id: 'ck-4', descricao: 'Grupo de classificação (FEM) calculado a partir de utilização x estado de carga', status: 'conforme', observacao: 'Grupo mecânico FEM 2m / ISO M5 determinado' },
              { id: 'ck-5', descricao: 'SWP calculado a partir do grupo de classificação', status: 'conforme', observacao: 'Período total de trabalho seguro de projeto: 1.600 horas em plena carga' },
              { id: 'ck-6', descricao: 'Vida útil já consumida comparada ao SWP total', status: 'conforme', observacao: 'Consumo atual acumulado calculado em 38% do SWP total' },
              { id: 'ck-7', descricao: 'Vida útil remanescente estimada', status: 'conforme', observacao: 'Vida útil teórica remanescente estimada em 62% (~4,5 anos operacionais)' },
              { id: 'ck-8', descricao: 'Recomendação de periodicidade de reinspeção definida', status: 'conforme', observacao: 'Reinspeção periódica anual recomendada' },
              { id: 'ck-9', descricao: 'Componentes críticos para fadiga identificados (gancho, tambor, estrutura)', status: 'conforme', observacao: 'Eixo do tambor de enrolamento e gancho forjado submetidos a ensaios' }
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Identificação do Equipamento (capacidade, percurso, paradas)', ordem: 1 },
              { id: 'sec-2', titulo: '2. Verificação de Cabos de Aço (tração e limitador)', ordem: 2 },
              { id: 'sec-3', titulo: '3. Verificação do Freio de Emergência (pára-quedas)', ordem: 3 },
              { id: 'sec-4', titulo: '4. Verificação de Intertravamento de Portas (pavimento e cabina)', ordem: 4 },
              { id: 'sec-5', titulo: '5. Verificação da Casa de Máquinas (motor, comando, ventilação)', ordem: 5 },
              { id: 'sec-6', titulo: '6. Verificação do Poço (fundo de poço, para-choques, iluminação)', ordem: 6 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Capacidade nominal identificada', status: 'conforme', observacao: 'Capacidade nominal de 2.000 kg indicada' },
              { id: 'ck-2', descricao: 'Percurso e número de paradas conferidos', status: 'conforme', observacao: 'Percurso total de 12 metros atendendo 4 pavimentos' },
              { id: 'ck-3', descricao: 'Cabos de tração sem fios rompidos ou corrosão', status: 'conforme', observacao: 'Conjunto de 4 cabos de aço com diâmetro uniforme e lubrificados' },
              { id: 'ck-4', descricao: 'Limitador de velocidade testado', status: 'conforme', observacao: 'Disparo mecânico em velocidade de calibração aferido' },
              { id: 'ck-5', descricao: 'Freio de emergência (pára-quedas) testado', status: 'conforme', observacao: 'Atuação das cunhas travando o carro nas guias com precisão' },
              { id: 'ck-6', descricao: 'Portas de pavimento com intertravamento funcional', status: 'conforme', observacao: 'Trincos mecânicos e contatos elétricos de segurança operantes' },
              { id: 'ck-7', descricao: 'Porta de cabina com intertravamento funcional', status: 'conforme', observacao: 'Impossibilidade de movimento com folha aberta' },
              { id: 'ck-8', descricao: 'Casa de máquinas com acesso seguro e iluminação adequada', status: 'conforme', observacao: 'Porta corta-fogo com fechadura e iluminação > 200 lux' },
              { id: 'ck-9', descricao: 'Quadro de comando identificado, sem exposição de partes energizadas', status: 'conforme', observacao: 'Painel metálico fechado e com diagrama elétrico interno' },
              { id: 'ck-10', descricao: 'Ventilação da casa de máquinas avaliada', status: 'conforme', observacao: 'Venezianas permanentes com tela antipássaros' },
              { id: 'ck-11', descricao: 'Fundo de poço limpo e com para-choques íntegros', status: 'conforme', observacao: 'Sem acúmulo de água ou óleo, amortecedores de mola intactos' },
              { id: 'ck-12', descricao: 'Iluminação do poço funcional', status: 'conforme', observacao: 'Lâmpadas protegidas com interruptores no poço e casa de máquinas' },
              { id: 'ck-13', descricao: 'Sinalização de capacidade máxima afixada na cabina', status: 'conforme', observacao: 'Placa indelével proibindo transporte de pessoas' },
              { id: 'ck-14', descricao: 'Dispositivo de alarme/comunicação de emergência testado', status: 'conforme', observacao: 'Interfone e sirene de alarme operantes' }
            ]
          },
          {
            id: 'laudo-dispositivos-icamento',
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
            secoesPadrao: [
              { id: 'sec-1', titulo: '1. Identificação do Dispositivo (tipo, dimensões, capacidade nominal)', ordem: 1 },
              { id: 'sec-2', titulo: '2. Memória de Cálculo do Dispositivo (dimensionamento, fator de segurança)', ordem: 2 },
              { id: 'sec-3', titulo: '3. Teste de Carga do Acessório (percentual da capacidade nominal)', ordem: 3 },
              { id: 'sec-4', titulo: '4. Inspeção de Solda e Fixação', ordem: 4 },
              { id: 'sec-5', titulo: '5. Marcação e Identificação Permanente da Capacidade', ordem: 5 }
            ],
            checklistPadrao: [
              { id: 'ck-1', descricao: 'Dispositivo identificado (tipo, dimensões, material)', status: 'conforme', observacao: 'Balancim monotrave em perfil W 250x38.5 em aço ASTM A36' },
              { id: 'ck-2', descricao: 'Memória de cálculo apresentada (dimensionamento e fator de segurança)', status: 'conforme', observacao: 'Memorial analítico com simulação de tensões anexado' },
              { id: 'ck-3', descricao: 'Fator de segurança conforme norma aplicável (NBR 8400 ou equivalente)', status: 'conforme', observacao: 'Fator de segurança adotado FS = 3.0 para içamento de cargas' },
              { id: 'ck-4', descricao: 'Teste de carga realizado (percentual da capacidade nominal)', status: 'conforme', observacao: 'Teste estático com 125% da carga nominal (12,5 toneladas)' },
              { id: 'ck-5', descricao: 'Ausência de deformação permanente após o teste', status: 'conforme', observacao: 'Medição dimensional antes e pós-teste sem flecha residual' },
              { id: 'ck-6', descricao: 'Solda inspecionada visualmente (fissuras, porosidade)', status: 'conforme', observacao: 'Soldas de chanfro e filete dos olhais aprovadas por LP' },
              { id: 'ck-7', descricao: 'Fixação/parafusos conferidos com torque adequado', status: 'conforme', observacao: 'Manilhas e pinos de fixação conferidos com contrapino' },
              { id: 'ck-8', descricao: 'Marcação de capacidade nominal gravada de forma permanente na peça', status: 'conforme', observacao: 'Plaqueta soldada em baixo-relevo com CMT 10.000 kg' },
              { id: 'ck-9', descricao: 'Data de fabricação/teste registrada', status: 'conforme', observacao: 'Data do ensaio e número da ART gravados' },
              { id: 'ck-10', descricao: 'Certificado do teste de carga anexado', status: 'conforme', observacao: 'Certificado de calibração da célula de carga anexado' }
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
