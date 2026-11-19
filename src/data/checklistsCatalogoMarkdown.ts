/* Gerado de Checklists de Inspeção e Laudos Técnicos – Catálogo de Serviços.md */
export interface ChecklistCatalogoItem {
  number: string;
  item: string;
  criterion: string;
}

export interface ChecklistCatalogoSecao {
  number: string;
  title: string;
  items: ChecklistCatalogoItem[];
}

export const CHECKLISTS_CATALOGO_MARKDOWN: Record<string, ChecklistCatalogoSecao> = {
  "incendio-inspecao-sistemas": {
    "number": "1.1",
    "title": "Inspeção de Sistemas de Combate a Incêndio",
    "items": [
      {
        "number": "1.1.1",
        "item": "Projeto aprovado e documentação",
        "criterion": "Projeto e memorial disponíveis e compatíveis com o que está instalado"
      },
      {
        "number": "1.1.2",
        "item": "Extintores: tipo, quantidade e distribuição",
        "criterion": "Conforme projeto e risco da área, sem obstrução e com sinalização"
      },
      {
        "number": "1.1.3",
        "item": "Extintores: condição individual",
        "criterion": "Lacre, manômetro na faixa, mangueira e válvula íntegras, validade e recarga em dia"
      },
      {
        "number": "1.1.4",
        "item": "Hidrantes e caixas de abrigo",
        "criterion": "Abrigos desobstruídos, com chave, mangueira e esguicho, mangueiras dentro da validade de teste"
      },
      {
        "number": "1.1.5",
        "item": "Mangotinhos",
        "criterion": "Carretel livre, mangueira íntegra, esguicho funcional e registro operando"
      },
      {
        "number": "1.1.6",
        "item": "Bombas de incêndio e reserva de água",
        "criterion": "Partida automática e manual funcionando, pressostatos ajustados, reservatório com volume do projeto"
      },
      {
        "number": "1.1.7",
        "item": "Sprinklers",
        "criterion": "Cabeças sem pintura, corrosão ou obstrução, distância de obstáculos respeitada, válvulas abertas e lacradas"
      },
      {
        "number": "1.1.8",
        "item": "Tubulações, válvulas e registro de recalque",
        "criterion": "Sem corrosão ou vazamento, identificadas, registro de recalque acessível e com tampão"
      },
      {
        "number": "1.1.9",
        "item": "Sinalização de segurança e iluminação de emergência",
        "criterion": "Sinalização legível e posicionada, iluminação acende na falta de energia"
      }
    ]
  },
  "incendio-adequacao-avcb": {
    "number": "1.2",
    "title": "Diagnóstico de Adequação para AVCB / CLCB",
    "items": [
      {
        "number": "1.2.1",
        "item": "Dados da edificação",
        "criterion": "Área, altura, ocupação e lotação levantadas e coerentes com o processo no CBM"
      },
      {
        "number": "1.2.2",
        "item": "Documentos do processo",
        "criterion": "Projeto aprovado, AVCB/CLCB anterior, ARTs e memoriais disponíveis"
      },
      {
        "number": "1.2.3",
        "item": "Medidas exigidas x instaladas",
        "criterion": "Cada medida exigida para a ocupação está instalada e funcional"
      },
      {
        "number": "1.2.4",
        "item": "Saídas de emergência",
        "criterion": "Rotas desobstruídas, portas abrindo no sentido da fuga, escadas e corrimãos íntegros"
      },
      {
        "number": "1.2.5",
        "item": "Alarme e detecção",
        "criterion": "Central sem falhas, acionadores e sirenes testados"
      },
      {
        "number": "1.2.6",
        "item": "Brigada e plano de emergência",
        "criterion": "Brigada treinada e plano de emergência atualizado, se exigidos"
      },
      {
        "number": "1.2.7",
        "item": "Instalações elétricas e SPDA",
        "criterion": "Laudo ou documento vigente de instalações elétricas e SPDA, se exigidos"
      },
      {
        "number": "1.2.8",
        "item": "Gás combustível e riscos específicos",
        "criterion": "Central de gás e demais riscos conforme norma e sinalizados"
      },
      {
        "number": "1.2.9",
        "item": "Lista de pendências",
        "criterion": "Pendências classificadas por gravidade, com prazo e responsável"
      }
    ]
  },
  "elevador-inspecao-seguranca": {
    "number": "2.1",
    "title": "Inspeção de Segurança e Condição Operacional de Elevadores",
    "items": [
      {
        "number": "2.1.1",
        "item": "Identificação e documentos",
        "criterion": "Placa de capacidade e nº de passageiros, certificado ou laudo anterior e contrato de manutenção disponíveis"
      },
      {
        "number": "2.1.2",
        "item": "Casa de máquinas",
        "criterion": "Acesso seguro, trancada, limpa, ventilada e iluminada, sem materiais estranhos"
      },
      {
        "number": "2.1.3",
        "item": "Máquina, freio e quadro de comando",
        "criterion": "Sem ruído anormal, freio atuando, quadro organizado e identificado, sem emendas improvisadas"
      },
      {
        "number": "2.1.4",
        "item": "Cabos de tração e polias",
        "criterion": "Sem fios rompidos, corrosão, desgaste ou desalinhamento"
      },
      {
        "number": "2.1.5",
        "item": "Poço",
        "criterion": "Seco, limpo, com iluminação, parada de emergência, amortecedores íntegros e escada de acesso"
      },
      {
        "number": "2.1.6",
        "item": "Cabina",
        "criterion": "Piso, painéis, iluminação, ventilação, botoeira e sinalização de capacidade íntegros"
      },
      {
        "number": "2.1.7",
        "item": "Portas de pavimento e de cabina",
        "criterion": "Intertravamento funcionando, folgas uniformes, fechamento sem impacto"
      },
      {
        "number": "2.1.8",
        "item": "Dispositivos de segurança",
        "criterion": "Limitador de velocidade, freio de segurança, fins de curso e sensor de porta testados"
      },
      {
        "number": "2.1.9",
        "item": "Alarme e comunicação",
        "criterion": "Alarme de emergência e interfone funcionando"
      },
      {
        "number": "2.1.10",
        "item": "Nivelamento e desempenho",
        "criterion": "Parada nivelada com o pavimento, partida e frenagem suaves"
      }
    ]
  },
  "elevador-auditoria-manutencao": {
    "number": "2.2",
    "title": "Auditoria de Manutenção e Conformidade de Elevadores",
    "items": [
      {
        "number": "2.2.1",
        "item": "Contrato e responsável técnico da conservadora",
        "criterion": "Contrato vigente e ART de manutenção do responsável técnico"
      },
      {
        "number": "2.2.2",
        "item": "Plano de manutenção",
        "criterion": "Plano com tarefas e periodicidades definidas conforme a norma e o fabricante"
      },
      {
        "number": "2.2.3",
        "item": "Registros de visitas",
        "criterion": "Relatórios assinados, datados e na periodicidade do plano"
      },
      {
        "number": "2.2.4",
        "item": "Evidências dos serviços",
        "criterion": "Itens executados correspondem ao relatado, com fotos ou registros quando houver"
      },
      {
        "number": "2.2.5",
        "item": "Livro ou registro de ocorrências",
        "criterion": "Chamados, paradas e reparos registrados com data e solução"
      },
      {
        "number": "2.2.6",
        "item": "Peças substituídas",
        "criterion": "Substituições documentadas, com especificação compatível com o equipamento"
      },
      {
        "number": "2.2.7",
        "item": "Pendências anteriores",
        "criterion": "Recomendações antigas corrigidas ou com justificativa e prazo"
      },
      {
        "number": "2.2.8",
        "item": "Confronto com a inspeção de campo",
        "criterion": "Condição real do equipamento coerente com os relatórios de manutenção"
      }
    ]
  },
  "bombeamento-inspecao": {
    "number": "3.1",
    "title": "Inspeção de Conjuntos Motobomba e Estações Elevatórias",
    "items": [
      {
        "number": "3.1.1",
        "item": "Identificação do conjunto",
        "criterion": "Placas da bomba e do motor legíveis, dados conferem com o projeto ou cadastro"
      },
      {
        "number": "3.1.2",
        "item": "Bomba: carcaça e vedação",
        "criterion": "Sem vazamento excessivo na selagem ou gaxeta, sem corrosão ou trincas"
      },
      {
        "number": "3.1.3",
        "item": "Motor",
        "criterion": "Sem superaquecimento, ruído ou vibração anormal, ventilação desobstruída, aterramento presente"
      },
      {
        "number": "3.1.4",
        "item": "Acoplamento e proteções",
        "criterion": "Alinhado, sem folga e com proteção fixa cobrindo as partes móveis (NR-12)"
      },
      {
        "number": "3.1.5",
        "item": "Base e fixação",
        "criterion": "Chumbadores firmes, base sem trincas, sem afundamentos"
      },
      {
        "number": "3.1.6",
        "item": "Tubulações, válvulas e juntas",
        "criterion": "Suportadas, sem vazamento, válvulas de retenção e de bloqueio operando"
      },
      {
        "number": "3.1.7",
        "item": "Instrumentação e comando",
        "criterion": "Manômetros, medidor de vazão e chaves de nível funcionando, painel organizado e aterrado"
      },
      {
        "number": "3.1.8",
        "item": "Poço de sucção e reservatórios",
        "criterion": "Limpos, sem acúmulo de sedimentos, com grades e proteções"
      },
      {
        "number": "3.1.9",
        "item": "Condições de operação",
        "criterion": "Pressão e vazão compatíveis com a curva da bomba, sem cavitação aparente"
      },
      {
        "number": "3.1.10",
        "item": "Segurança da instalação",
        "criterion": "Sinalização, iluminação, acesso e drenagem do piso adequados"
      }
    ]
  },
  "bombeamento-desempenho": {
    "number": "3.2",
    "title": "Avaliação de Desempenho e Confiabilidade de Sistemas de Bombeamento",
    "items": [
      {
        "number": "3.2.1",
        "item": "Dados de projeto e de operação",
        "criterion": "Vazão, altura manométrica e regime de operação levantados"
      },
      {
        "number": "3.2.2",
        "item": "Medições em campo",
        "criterion": "Pressões, vazão, corrente e horas de operação medidas com instrumento adequado"
      },
      {
        "number": "3.2.3",
        "item": "Comparação com a curva da bomba",
        "criterion": "Ponto de operação dentro da faixa recomendada pelo fabricante"
      },
      {
        "number": "3.2.4",
        "item": "Histórico de falhas",
        "criterion": "Falhas recorrentes identificadas, com causa provável e frequência"
      },
      {
        "number": "3.2.5",
        "item": "Plano e registros de manutenção",
        "criterion": "Preventiva em dia, sem corretivas repetidas no mesmo componente"
      },
      {
        "number": "3.2.6",
        "item": "Perdas e ineficiências",
        "criterion": "Vazamentos, perdas de carga e consumo de energia anormais identificados"
      },
      {
        "number": "3.2.7",
        "item": "Redundância e reserva",
        "criterion": "Bomba reserva disponível e testada, com revezamento definido"
      },
      {
        "number": "3.2.8",
        "item": "Oportunidades de melhoria",
        "criterion": "Recomendações priorizadas por impacto e custo"
      }
    ]
  },
  "nr12-hrn": {
    "number": "4.1",
    "title": "Laudo de Apreciação / Análise de Risco (HRN e NBR ISO 12100)",
    "items": [
      {
        "number": "4.1.1",
        "item": "Identificação da máquina",
        "criterion": "Fabricante, modelo, nº de série, ano e manual disponíveis"
      },
      {
        "number": "4.1.2",
        "item": "Limites da máquina",
        "criterion": "Uso previsto, uso indevido razoavelmente previsível, ciclo de vida e ambiente definidos"
      },
      {
        "number": "4.1.3",
        "item": "Perigos mecânicos",
        "criterion": "Esmagamento, cisalhamento, corte, arrastamento, impacto e projeção identificados por zona"
      },
      {
        "number": "4.1.4",
        "item": "Perigos elétricos e outros",
        "criterion": "Choque, ruído, calor, poeira e ergonomia levantados"
      },
      {
        "number": "4.1.5",
        "item": "Fases de operação e intervenção",
        "criterion": "Operação, setup, manutenção e limpeza avaliados, inclusive acessos"
      },
      {
        "number": "4.1.6",
        "item": "Estimativa de risco (HRN)",
        "criterion": "Cada perigo com pontuação e classe de risco registradas com a justificativa dos fatores"
      },
      {
        "number": "4.1.7",
        "item": "Categoria de segurança requerida (PLr)",
        "criterion": "Definida por função de segurança, com critério explícito"
      },
      {
        "number": "4.1.8",
        "item": "Medidas existentes e recomendadas",
        "criterion": "Proteções e dispositivos atuais listados e medidas de redução priorizadas"
      },
      {
        "number": "4.1.9",
        "item": "Registro e rastreabilidade",
        "criterion": "Fotos, croqui da máquina e premissas anexados ao laudo"
      }
    ]
  },
  "nr12-protecoes": {
    "number": "4.2",
    "title": "Laudo de Adequação de Proteções Físicas e Intertravamentos",
    "items": [
      {
        "number": "4.2.1",
        "item": "Proteções fixas",
        "criterion": "Fixadas por ferramenta, sem frestas, material e resistência adequados"
      },
      {
        "number": "4.2.2",
        "item": "Proteções móveis",
        "criterion": "Intertravadas, abrindo somente com a máquina parada"
      },
      {
        "number": "4.2.3",
        "item": "Distâncias de segurança",
        "criterion": "Aberturas e distâncias às zonas de perigo atendem às tabelas da norma"
      },
      {
        "number": "4.2.4",
        "item": "Chaves de intertravamento",
        "criterion": "Codificadas, com bloqueio quando exigido, difíceis de burlar, sem ponte ou anulação"
      },
      {
        "number": "4.2.5",
        "item": "Dispositivos de parada de emergência",
        "criterion": "Vermelhos, acessíveis, com retenção, e parando a máquina de forma segura"
      },
      {
        "number": "4.2.6",
        "item": "Cortinas de luz e sensores",
        "criterion": "Posicionados conforme o tempo de parada, sem bypass"
      },
      {
        "number": "4.2.7",
        "item": "Circuito de segurança",
        "criterion": "Categoria e desempenho compatíveis com o PLr definido, com relé ou CLP de segurança"
      },
      {
        "number": "4.2.8",
        "item": "Teste funcional",
        "criterion": "Cada dispositivo testado e resultado registrado"
      },
      {
        "number": "4.2.9",
        "item": "Sinalização e manual",
        "criterion": "Avisos de risco visíveis e manual em português disponível"
      }
    ]
  },
  "nr12-retrofit": {
    "number": "4.3",
    "title": "Laudo de Validação / Retrofit de Segurança em Máquinas",
    "items": [
      {
        "number": "4.3.1",
        "item": "Escopo das alterações",
        "criterion": "Lista das mudanças mecânicas e elétricas, com antes e depois"
      },
      {
        "number": "4.3.2",
        "item": "Documentação do retrofit",
        "criterion": "Projeto, desenhos, lista de materiais e diagramas elétricos atualizados"
      },
      {
        "number": "4.3.3",
        "item": "Componentes instalados",
        "criterion": "Correspondem ao projeto, com certificado ou especificação de segurança"
      },
      {
        "number": "4.3.4",
        "item": "Montagem mecânica",
        "criterion": "Proteções, fixações e distâncias conforme projeto"
      },
      {
        "number": "4.3.5",
        "item": "Montagem elétrica",
        "criterion": "Cabos, terminais, aterramento e identificação conforme diagrama"
      },
      {
        "number": "4.3.6",
        "item": "Validação das funções de segurança",
        "criterion": "Cada função testada e registrada, com resultado esperado alcançado"
      },
      {
        "number": "4.3.7",
        "item": "Riscos residuais",
        "criterion": "Identificados e comunicados ao usuário"
      },
      {
        "number": "4.3.8",
        "item": "Liberação para operação",
        "criterion": "Parecer formal, com treinamento dos operadores e atualização do manual"
      }
    ]
  },
  "maq-integridade": {
    "number": "5.1",
    "title": "Laudo de Integridade Estrutural e Segurança Operacional (NR-12 / NR-18)",
    "items": [
      {
        "number": "5.1.1",
        "item": "Identificação",
        "criterion": "Placa, nº de série, horímetro e documentos conferem"
      },
      {
        "number": "5.1.2",
        "item": "Chassi e estrutura",
        "criterion": "Sem trincas, deformações, soldas improvisadas ou corrosão severa"
      },
      {
        "number": "5.1.3",
        "item": "Lança, braço e caçamba",
        "criterion": "Sem trincas em soldas, empenos ou desgaste excessivo de dentes e lâminas"
      },
      {
        "number": "5.1.4",
        "item": "Pinos, buchas e articulações",
        "criterion": "Folgas dentro do limite do fabricante, travas presentes"
      },
      {
        "number": "5.1.5",
        "item": "Cilindros e sistema hidráulico",
        "criterion": "Sem vazamentos, hastes sem riscos ou amassados, mangueiras e conexões íntegras"
      },
      {
        "number": "5.1.6",
        "item": "Freios e direção",
        "criterion": "Freio de serviço e de estacionamento atuando, direção sem folga"
      },
      {
        "number": "5.1.7",
        "item": "Trem de rolamento",
        "criterion": "Esteiras, rodas, roletes e pneus em condição segura"
      },
      {
        "number": "5.1.8",
        "item": "Cabine, bancos, cinto e acessos",
        "criterion": "Cinto funcional, vidros íntegros, degraus e corrimãos firmes"
      },
      {
        "number": "5.1.9",
        "item": "Dispositivos de segurança",
        "criterion": "Buzina, alarme de ré, faróis, extintor, espelhos ou câmera, parada de emergência"
      },
      {
        "number": "5.1.10",
        "item": "Proteções e sinalização",
        "criterion": "Proteções das partes móveis e quentes e adesivos de segurança legíveis"
      }
    ]
  },
  "maq-rops-fops": {
    "number": "5.2",
    "title": "Laudo de Conformidade de Estruturas de Proteção (ROPS / FOPS)",
    "items": [
      {
        "number": "5.2.1",
        "item": "Placa e certificação da estrutura",
        "criterion": "Placa legível com norma de ensaio, modelo e massa máxima compatíveis com a máquina"
      },
      {
        "number": "5.2.2",
        "item": "Compatibilidade com a máquina",
        "criterion": "Estrutura é a prevista pelo fabricante para o modelo e a massa operacional"
      },
      {
        "number": "5.2.3",
        "item": "Integridade estrutural",
        "criterion": "Sem trincas, amassados, deformações, cortes ou soldas de reparo não autorizadas"
      },
      {
        "number": "5.2.4",
        "item": "Fixação e parafusos",
        "criterion": "Torque, classe e quantidade corretos, sem corrosão ou folga"
      },
      {
        "number": "5.2.5",
        "item": "Modificações",
        "criterion": "Sem furos, cortes ou fixações adicionais não previstas"
      },
      {
        "number": "5.2.6",
        "item": "Proteção contra queda de objetos (FOPS)",
        "criterion": "Teto e telas presentes e íntegros, quando exigidos"
      },
      {
        "number": "5.2.7",
        "item": "Cinto de segurança",
        "criterion": "Presente, funcional e compatível com a estrutura de proteção"
      },
      {
        "number": "5.2.8",
        "item": "Parecer",
        "criterion": "Conclusão fundamentada, com recomendação de ensaio ou substituição se houver dúvida"
      }
    ]
  },
  "maq-periodica": {
    "number": "5.3",
    "title": "Laudo de Inspeção Periódica de Manutenção e Segurança",
    "items": [
      {
        "number": "5.3.1",
        "item": "Identificação e histórico",
        "criterion": "Registros de manutenção e horímetro atualizados"
      },
      {
        "number": "5.3.2",
        "item": "Motor e fluidos",
        "criterion": "Níveis, filtros e ausência de vazamentos de óleo, combustível e arrefecimento"
      },
      {
        "number": "5.3.3",
        "item": "Sistema de transmissão",
        "criterion": "Sem ruídos, folgas ou vazamentos em caixas e diferenciais"
      },
      {
        "number": "5.3.4",
        "item": "Sistema hidráulico",
        "criterion": "Pressão, mangueiras e cilindros conforme especificação"
      },
      {
        "number": "5.3.5",
        "item": "Freios, direção e lâmina ou rolo",
        "criterion": "Funcionais e sem desgaste excessivo"
      },
      {
        "number": "5.3.6",
        "item": "Sistema elétrico e baterias",
        "criterion": "Chicotes fixos, baterias sem sulfatação, desligador geral operando"
      },
      {
        "number": "5.3.7",
        "item": "Itens de segurança",
        "criterion": "Alarme de ré, luzes, cinto, extintor, buzina, ROPS e proteções"
      },
      {
        "number": "5.3.8",
        "item": "Plano de ação corretivo",
        "criterion": "NCs listadas com prioridade, responsável e prazo"
      }
    ]
  },
  "munck-load-test": {
    "number": "6.1",
    "title": "Laudo de Teste de Carga (Load Test) Estático e Dinâmico",
    "items": [
      {
        "number": "6.1.1",
        "item": "Identificação e tabela de carga",
        "criterion": "Placa, nº de série e tabela de carga do fabricante disponíveis e legíveis"
      },
      {
        "number": "6.1.2",
        "item": "Inspeção prévia ao ensaio",
        "criterion": "Estrutura, cabos, ganchos e estabilizadores sem defeitos visíveis"
      },
      {
        "number": "6.1.3",
        "item": "Pesos de ensaio",
        "criterion": "Peso padrão aferido, com certificado, e massa total registrada"
      },
      {
        "number": "6.1.4",
        "item": "Condições do local",
        "criterion": "Piso firme e nivelado, sem interferência de rede elétrica, área isolada"
      },
      {
        "number": "6.1.5",
        "item": "Montagem e estabilização",
        "criterion": "Estabilizadores estendidos e apoiados conforme o manual, nível verificado"
      },
      {
        "number": "6.1.6",
        "item": "Ensaio estático",
        "criterion": "Carga mantida pelo tempo previsto, sem queda de lança ou deslocamento anormal"
      },
      {
        "number": "6.1.7",
        "item": "Ensaio dinâmico",
        "criterion": "Movimentos de içar, girar e retrair suaves, sem ruído ou vibração anormal"
      },
      {
        "number": "6.1.8",
        "item": "Deflexão da lança",
        "criterion": "Medida e dentro do limite do fabricante"
      },
      {
        "number": "6.1.9",
        "item": "Válvulas de sustentação e cilindros",
        "criterion": "Sem queda de carga ou vazamento durante o ensaio"
      },
      {
        "number": "6.1.10",
        "item": "Inspeção pós-ensaio e registro",
        "criterion": "Sem deformação residual, resultados, cargas e condições anotados"
      }
    ]
  },
  "munck-liberacao": {
    "number": "6.2",
    "title": "Laudo de Liberação e Conformidade NR-11 / NR-12",
    "items": [
      {
        "number": "6.2.1",
        "item": "Sapatas e estabilizadores",
        "criterion": "Sem trincas, empenos ou vazamento, travas e indicadores funcionando"
      },
      {
        "number": "6.2.2",
        "item": "Cabos de aço",
        "criterion": "Sem fios rompidos, corrosão, esmagamento ou diâmetro reduzido, terminações corretas"
      },
      {
        "number": "6.2.3",
        "item": "Ganchos e trava de segurança",
        "criterion": "Sem deformação ou trincas, trava de gancho presente e atuando"
      },
      {
        "number": "6.2.4",
        "item": "Moitões e polias",
        "criterion": "Giram livremente, sem desgaste ou folga excessiva"
      },
      {
        "number": "6.2.5",
        "item": "Grampos, manilhas e acessórios",
        "criterion": "Identificados, com capacidade marcada e sem danos"
      },
      {
        "number": "6.2.6",
        "item": "Comandos hidráulicos",
        "criterion": "Alavancas e controle remoto respondendo, retorno ao neutro, sem vazamentos"
      },
      {
        "number": "6.2.7",
        "item": "Dispositivos de segurança",
        "criterion": "Válvulas, parada de emergência, alarmes e indicadores operando"
      },
      {
        "number": "6.2.8",
        "item": "Operador e documentação",
        "criterion": "Operador habilitado e treinado, manual e plano de manutenção disponíveis"
      }
    ]
  },
  "munck-lmi-rigging": {
    "number": "6.3",
    "title": "Laudo de Aferição do Limitador de Momento de Carga (LMI) e Rigging",
    "items": [
      {
        "number": "6.3.1",
        "item": "Instrumentos de aferição",
        "criterion": "Células de carga e inclinômetros calibrados, com certificado vigente"
      },
      {
        "number": "6.3.2",
        "item": "Sensores de ângulo, comprimento e pressão",
        "criterion": "Leituras coerentes com a medição de referência em vários pontos"
      },
      {
        "number": "6.3.3",
        "item": "Limitador de momento (LMI)",
        "criterion": "Alerta e bloqueio atuando nos limites previstos na tabela de carga"
      },
      {
        "number": "6.3.4",
        "item": "Fim de curso de içamento",
        "criterion": "Impede o contato do moitão com a ponta da lança"
      },
      {
        "number": "6.3.5",
        "item": "Indicadores de carga e raio",
        "criterion": "Valores no painel coincidem com o aferido, dentro da tolerância"
      },
      {
        "number": "6.3.6",
        "item": "Tabela de carga oficial",
        "criterion": "Emitida conforme a configuração real e disponível ao operador"
      },
      {
        "number": "6.3.7",
        "item": "Acessórios de rigging",
        "criterion": "Cintas, correntes, manilhas e balancins inspecionados, com capacidade e identificação"
      },
      {
        "number": "6.3.8",
        "item": "Plano de içamento",
        "criterion": "Cargas, raios e áreas validados e assinados pelo responsável"
      }
    ]
  },
  "veic-reclassificacao": {
    "number": "7.1",
    "title": "Laudo Pericial de Reclassificação de Monta Veicular",
    "items": [
      {
        "number": "7.1.1",
        "item": "Identificação do veículo",
        "criterion": "Placa, chassi, motor, RENAVAM e documentos conferem com o cadastro"
      },
      {
        "number": "7.1.2",
        "item": "Numerações (VIN, motor, vidros)",
        "criterion": "Gravações legíveis, sem sinais de adulteração, cobertas por registro fotográfico"
      },
      {
        "number": "7.1.3",
        "item": "Documentos do sinistro",
        "criterion": "Boletim, laudo anterior e decisão de classificação de monta anexados"
      },
      {
        "number": "7.1.4",
        "item": "Estrutura e longarinas",
        "criterion": "Alinhamento medido e dentro da tolerância, sem dobras ou reparos não conformes"
      },
      {
        "number": "7.1.5",
        "item": "Colunas, travessas e monobloco",
        "criterion": "Sem deformação, soldas ou cortes fora do padrão do fabricante"
      },
      {
        "number": "7.1.6",
        "item": "Sistemas de segurança",
        "criterion": "Airbags, cintos e pré-tensionadores originais e funcionando"
      },
      {
        "number": "7.1.7",
        "item": "Itens de segurança em geral",
        "criterion": "Freios, direção, suspensão, pneus, iluminação e para-brisa em condição regular"
      },
      {
        "number": "7.1.8",
        "item": "Peças substituídas",
        "criterion": "Procedência comprovada por nota fiscal e compatíveis com o modelo"
      },
      {
        "number": "7.1.9",
        "item": "Comparação com o dano original",
        "criterion": "Reparos executados correspondem ao dano e às recomendações do laudo"
      },
      {
        "number": "7.1.10",
        "item": "Parecer fundamentado",
        "criterion": "Conclusão sobre aptidão para circulação, com base técnica e normativa"
      }
    ]
  },
  "veic-sinistro-danos": {
    "number": "7.2",
    "title": "Laudo de Avaliação de Sinistro Veicular e Danos Estruturais",
    "items": [
      {
        "number": "7.2.1",
        "item": "Identificação e histórico",
        "criterion": "Dados do veículo, data e tipo do sinistro registrados"
      },
      {
        "number": "7.2.2",
        "item": "Inspeção visual geral",
        "criterion": "Todos os danos fotografados por face, com escala"
      },
      {
        "number": "7.2.3",
        "item": "Medição da carroceria",
        "criterion": "Cotas medidas com sistema calibrado e comparadas com o padrão do fabricante"
      },
      {
        "number": "7.2.4",
        "item": "Longarinas e monobloco",
        "criterion": "Desvios, dobras e esticamentos medidos e localizados"
      },
      {
        "number": "7.2.5",
        "item": "Soldas e pontos de fábrica",
        "criterion": "Integridade conferida, sem trincas ou descolamentos"
      },
      {
        "number": "7.2.6",
        "item": "Colunas A, B e C",
        "criterion": "Deformação e corrosão avaliadas"
      },
      {
        "number": "7.2.7",
        "item": "Suspensão, direção e rodas",
        "criterion": "Danos e desalinhamentos identificados"
      },
      {
        "number": "7.2.8",
        "item": "Classificação do dano",
        "criterion": "Grau do dano e viabilidade de reparo justificados"
      },
      {
        "number": "7.2.9",
        "item": "Memória de medições",
        "criterion": "Medidas, equipamento e data anexados ao laudo"
      }
    ]
  },
  "veic-causa-raiz": {
    "number": "7.3",
    "title": "Laudo Pericial de Análise de Falha Mecânica (Root Cause Analysis)",
    "items": [
      {
        "number": "7.3.1",
        "item": "Preservação das evidências",
        "criterion": "Componente falhado guardado, identificado e com cadeia de custódia registrada"
      },
      {
        "number": "7.3.2",
        "item": "Histórico do veículo",
        "criterion": "Manutenções, quilometragem e condições de uso levantadas"
      },
      {
        "number": "7.3.3",
        "item": "Descrição do evento",
        "criterion": "Relato das circunstâncias da falha, com fontes e data"
      },
      {
        "number": "7.3.4",
        "item": "Inspeção do componente",
        "criterion": "Fratura, desgaste, deformação e corrosão fotografados e descritos"
      },
      {
        "number": "7.3.5",
        "item": "Análise do modo de falha",
        "criterion": "Fadiga, sobrecarga, desgaste, defeito de material ou montagem diferenciados"
      },
      {
        "number": "7.3.6",
        "item": "Componentes associados",
        "criterion": "Freio, eixos, direção ou transmissão relacionados analisados"
      },
      {
        "number": "7.3.7",
        "item": "Ensaios complementares",
        "criterion": "Ensaios de materiais indicados quando necessários, com laboratório credenciado"
      },
      {
        "number": "7.3.8",
        "item": "Causa raiz e nexo causal",
        "criterion": "Causa apontada com evidência, descartando as hipóteses alternativas"
      },
      {
        "number": "7.3.9",
        "item": "Conclusão e limitações",
        "criterion": "Parecer claro, com o que não foi possível apurar"
      }
    ]
  },
  "play-inspecao-geral": {
    "number": "8.1",
    "title": "Laudo Técnico de Inspeção de Playground (ABNT NBR 16071)",
    "items": [
      {
        "number": "8.1.1",
        "item": "Identificação do local e dos equipamentos",
        "criterion": "Inventário de brinquedos com tipo, faixa etária e fabricante quando houver"
      },
      {
        "number": "8.1.2",
        "item": "Placa de informações e manual",
        "criterion": "Placa com faixa etária, regras e contato do responsável, manual de manutenção disponível"
      },
      {
        "number": "8.1.3",
        "item": "Estrutura e fundações",
        "criterion": "Sem corrosão, trincas, empenos ou apodrecimento, fixações firmes"
      },
      {
        "number": "8.1.4",
        "item": "Balanços",
        "criterion": "Correntes e assentos íntegros, sem desgaste nos pontos de articulação"
      },
      {
        "number": "8.1.5",
        "item": "Escorregadores",
        "criterion": "Superfície lisa, sem emendas cortantes, saída com altura e inclinação seguras"
      },
      {
        "number": "8.1.6",
        "item": "Gangorras, tirolesas e carrosséis",
        "criterion": "Mecanismos sem folga e amortecimento ou limitadores presentes"
      },
      {
        "number": "8.1.7",
        "item": "Parafusos, porcas e ferragens",
        "criterion": "Protegidos, sem pontas, arestas ou partes soltas"
      },
      {
        "number": "8.1.8",
        "item": "Guarda-corpos e plataformas",
        "criterion": "Altura e vãos adequados, sem degraus ou degraus soltos"
      },
      {
        "number": "8.1.9",
        "item": "Cercamento, portões e entorno",
        "criterion": "Cerca e portão íntegros, sem objetos perigosos ou plantas tóxicas"
      },
      {
        "number": "8.1.10",
        "item": "Manutenção e inspeção rotineira",
        "criterion": "Registros de inspeção rotineira e manutenções disponíveis"
      }
    ]
  },
  "play-aprisionamento": {
    "number": "8.2",
    "title": "Laudo de Análise de Risco de Aprisionamento e Queda",
    "items": [
      {
        "number": "8.2.1",
        "item": "Aberturas e vãos",
        "criterion": "Medidos com as sondas normatizadas, sem risco de prender cabeça ou tronco"
      },
      {
        "number": "8.2.2",
        "item": "Aprisionamento de dedos",
        "criterion": "Frestas e articulações com dimensões fora da faixa de risco"
      },
      {
        "number": "8.2.3",
        "item": "Aprisionamento de roupas e cordões",
        "criterion": "Sem arestas, ressaltos ou ângulos que enganchem roupas"
      },
      {
        "number": "8.2.4",
        "item": "Risco de queda",
        "criterion": "Alturas de queda livre compatíveis com a faixa etária e com o piso previsto"
      },
      {
        "number": "8.2.5",
        "item": "Proteções contra queda",
        "criterion": "Guarda-corpos, barreiras e acessos adequados à idade"
      },
      {
        "number": "8.2.6",
        "item": "Pontos de impacto e colisão",
        "criterion": "Espaços de uso livres de obstáculos fixos e afastados entre brinquedos"
      },
      {
        "number": "8.2.7",
        "item": "Superfícies quentes e cortantes",
        "criterion": "Sem aquecimento excessivo, lascas ou arestas"
      },
      {
        "number": "8.2.8",
        "item": "Classificação dos riscos",
        "criterion": "Cada risco com gravidade, probabilidade e medida corretiva"
      }
    ]
  },
  "play-piso-amortecedor": {
    "number": "8.3",
    "title": "Laudo de Piso Amortecedor e Ancoragens Estruturais",
    "items": [
      {
        "number": "8.3.1",
        "item": "Área de circulação",
        "criterion": "Dimensões da área de impacto conforme a norma para cada brinquedo"
      },
      {
        "number": "8.3.2",
        "item": "Tipo de piso",
        "criterion": "Material (areia, borracha, grama sintética etc.) adequado à altura de queda crítica"
      },
      {
        "number": "8.3.3",
        "item": "Espessura do piso",
        "criterion": "Medida em vários pontos e dentro do especificado"
      },
      {
        "number": "8.3.4",
        "item": "Atenuação de impacto",
        "criterion": "Ensaio ou certificado do piso compatível com a altura de queda"
      },
      {
        "number": "8.3.5",
        "item": "Estado e conservação do piso",
        "criterion": "Sem buracos, desgaste, compactação, descolamento ou objetos estranhos"
      },
      {
        "number": "8.3.6",
        "item": "Drenagem do piso",
        "criterion": "Sem poças ou acúmulo de água"
      },
      {
        "number": "8.3.7",
        "item": "Ancoragens e fundações",
        "criterion": "Chumbadores e sapatas sem exposição, corrosão ou movimento"
      },
      {
        "number": "8.3.8",
        "item": "Parecer",
        "criterion": "Conclusão sobre a segurança do piso e das ancoragens, com recomendações e prazos"
      }
    ]
  },
  "pmoc-plano-operacao": {
    "number": "9.1",
    "title": "Laudo e Plano de PMOC (Lei 13.589/2018 e Portaria 3.523/MS)",
    "items": [
      {
        "number": "9.1.1",
        "item": "Identificação do estabelecimento e do responsável técnico",
        "criterion": "Dados, ART e responsável técnico habilitado registrados"
      },
      {
        "number": "9.1.2",
        "item": "Inventário dos equipamentos",
        "criterion": "Todos os aparelhos listados com tipo, capacidade em TR ou BTU/h, local e ano"
      },
      {
        "number": "9.1.3",
        "item": "Enquadramento por capacidade",
        "criterion": "Capacidade total e por equipamento classificada conforme o PMOC"
      },
      {
        "number": "9.1.4",
        "item": "Ambientes atendidos",
        "criterion": "Áreas climatizadas, ocupação e uso levantados"
      },
      {
        "number": "9.1.5",
        "item": "Periodicidade de manutenção",
        "criterion": "Rotinas mensais, trimestrais e anuais definidas por equipamento"
      },
      {
        "number": "9.1.6",
        "item": "Limpeza de componentes",
        "criterion": "Filtros, bandejas, serpentinas e dutos com periodicidade e método"
      },
      {
        "number": "9.1.7",
        "item": "Controle de qualidade do ar",
        "criterion": "Parâmetros e frequência de medição definidos"
      },
      {
        "number": "9.1.8",
        "item": "Registros e contratos",
        "criterion": "Relatórios de manutenção arquivados e contrato de manutenção vigente"
      },
      {
        "number": "9.1.9",
        "item": "Plano de contingência",
        "criterion": "Procedimento para falhas e para riscos sanitários definido"
      }
    ]
  },
  "pmoc-qualidade-ar": {
    "number": "9.2",
    "title": "Laudo de Inspeção Técnico-Sanitária e Qualidade do Ar Interior",
    "items": [
      {
        "number": "9.2.1",
        "item": "Filtros de ar",
        "criterion": "Limpos, íntegros, bem assentados e com a classe adequada"
      },
      {
        "number": "9.2.2",
        "item": "Bandejas de condensado",
        "criterion": "Limpas, com caimento e dreno livre, sem água parada ou biofilme"
      },
      {
        "number": "9.2.3",
        "item": "Serpentinas e ventiladores",
        "criterion": "Sem sujeira, corrosão ou mofo"
      },
      {
        "number": "9.2.4",
        "item": "Dutos, grelhas e difusores",
        "criterion": "Sem acúmulo de sujeira, danos no isolamento ou mofo"
      },
      {
        "number": "9.2.5",
        "item": "Tomada de ar exterior",
        "criterion": "Posicionada longe de fontes de poluição, com tela e sem obstrução"
      },
      {
        "number": "9.2.6",
        "item": "Taxa de renovação de ar exterior",
        "criterion": "Medida ou calculada e compatível com o exigido pela norma"
      },
      {
        "number": "9.2.7",
        "item": "Parâmetros do ambiente",
        "criterion": "Temperatura, umidade e CO₂ medidos com instrumento calibrado"
      },
      {
        "number": "9.2.8",
        "item": "Coleta de amostras",
        "criterion": "Análise microbiológica do ar realizada por laboratório quando exigida"
      },
      {
        "number": "9.2.9",
        "item": "Parecer técnico",
        "criterion": "Conclusão com NCs, recomendações e prazo, com ART"
      }
    ]
  },
  "nr13-vp-enquadramento-pv": {
    "number": "10.1",
    "title": "Enquadramento Normativo (Cálculo P × V)",
    "items": [
      {
        "number": "10.1.1",
        "item": "Dados da placa e do prontuário",
        "criterion": "Pressão máxima de trabalho, volume, fluido e fabricante levantados"
      },
      {
        "number": "10.1.2",
        "item": "Fluido contido",
        "criterion": "Classe do fluido (A, B, C ou D) definida conforme a norma"
      },
      {
        "number": "10.1.3",
        "item": "Volume interno",
        "criterion": "Medido ou obtido do projeto, com unidade conferida"
      },
      {
        "number": "10.1.4",
        "item": "Cálculo do produto P × V",
        "criterion": "Cálculo registrado, com a fórmula e os valores usados"
      },
      {
        "number": "10.1.5",
        "item": "Categoria do vaso",
        "criterion": "Categoria determinada pelas tabelas vigentes da norma"
      },
      {
        "number": "10.1.6",
        "item": "Exceções e isenções",
        "criterion": "Situações de não enquadramento verificadas e justificadas"
      },
      {
        "number": "10.1.7",
        "item": "Conclusão do enquadramento",
        "criterion": "Enquadrado ou não, com categoria e fundamento"
      }
    ]
  },
  "nr13-vp-inspecao-seguranca": {
    "number": "10.2",
    "title": "Inspeção de Segurança Inicial, Periódica e Extraordinária",
    "items": [
      {
        "number": "10.2.1",
        "item": "Tipo e prazo da inspeção",
        "criterion": "Inicial, periódica ou extraordinária e prazo vigente conferidos"
      },
      {
        "number": "10.2.2",
        "item": "Documentação",
        "criterion": "Prontuário, registro de segurança, projeto de instalação e relatórios anteriores disponíveis"
      },
      {
        "number": "10.2.3",
        "item": "Exame externo: casco, tampos e soldas",
        "criterion": "Sem trincas, amassados, corrosão ou vazamentos"
      },
      {
        "number": "10.2.4",
        "item": "Exame externo: bases, suportes e pintura",
        "criterion": "Estrutura firme, pintura íntegra, sem corrosão sob isolamento visível"
      },
      {
        "number": "10.2.5",
        "item": "Exame interno",
        "criterion": "Casco, tampos, soldas e componentes sem trincas, corrosão ou depósitos"
      },
      {
        "number": "10.2.6",
        "item": "Bocais, conexões e boca de visita",
        "criterion": "Íntegros, sem vazamentos, vedação adequada"
      },
      {
        "number": "10.2.7",
        "item": "Dispositivos de segurança e instrumentos",
        "criterion": "Válvula de segurança, manômetro e drenos presentes e operando"
      },
      {
        "number": "10.2.8",
        "item": "Instalação",
        "criterion": "Local ventilado, sinalizado e com acesso seguro"
      },
      {
        "number": "10.2.9",
        "item": "Parecer e próxima inspeção",
        "criterion": "Condição de operação definida e data da próxima inspeção"
      }
    ]
  },
  "nr13-vp-ultrassom-espessura": {
    "number": "10.3",
    "title": "Ensaio Não Destrutivo (END) — Medição de Espessura por Ultrassom",
    "items": [
      {
        "number": "10.3.1",
        "item": "Medidor e calibração",
        "criterion": "Aparelho com certificado e bloco padrão, calibrado antes do uso"
      },
      {
        "number": "10.3.2",
        "item": "Espessura mínima calculada",
        "criterion": "Valor obtido do memorial ou calculado, e registrado"
      },
      {
        "number": "10.3.3",
        "item": "Plano de pontos",
        "criterion": "Malha de medição no costado e nos tampos, com croqui numerado"
      },
      {
        "number": "10.3.4",
        "item": "Preparação da superfície",
        "criterion": "Limpa, sem tinta solta ou ferrugem solta nos pontos de medida"
      },
      {
        "number": "10.3.5",
        "item": "Medições",
        "criterion": "Valores registrados por ponto, com repetição quando houver dúvida"
      },
      {
        "number": "10.3.6",
        "item": "Comparação com o mínimo",
        "criterion": "Todos os pontos acima da espessura mínima calculada"
      },
      {
        "number": "10.3.7",
        "item": "Taxa de corrosão e vida remanescente",
        "criterion": "Calculadas quando há medição anterior"
      },
      {
        "number": "10.3.8",
        "item": "Operador e relatório",
        "criterion": "Técnico qualificado, resultados anexados ao relatório"
      }
    ]
  },
  "nr13-vp-boroscopia": {
    "number": "10.4",
    "title": "Inspeção Boroscópica Interna",
    "items": [
      {
        "number": "10.4.1",
        "item": "Justificativa do método",
        "criterion": "Registrado que o vaso não tem boca de visita ou acesso interno"
      },
      {
        "number": "10.4.2",
        "item": "Preparação",
        "criterion": "Vaso despressurizado, drenado e limpo, com acessos de inserção definidos"
      },
      {
        "number": "10.4.3",
        "item": "Equipamento",
        "criterion": "Boroscópio com iluminação e resolução adequadas"
      },
      {
        "number": "10.4.4",
        "item": "Percurso de inspeção",
        "criterion": "Casco, tampos, soldas e bocais percorridos e documentados"
      },
      {
        "number": "10.4.5",
        "item": "Registro de imagens",
        "criterion": "Imagens e vídeos identificados por posição"
      },
      {
        "number": "10.4.6",
        "item": "Defeitos encontrados",
        "criterion": "Corrosão, trincas, pites e depósitos classificados e localizados"
      },
      {
        "number": "10.4.7",
        "item": "Limitações",
        "criterion": "Áreas não visualizadas declaradas no relatório"
      },
      {
        "number": "10.4.8",
        "item": "Conclusão",
        "criterion": "Parecer com recomendação de ensaio complementar quando necessário"
      }
    ]
  },
  "nr13-vp-teste-hidrostatico": {
    "number": "10.5",
    "title": "Teste Hidrostático / Teste de Estanqueidade",
    "items": [
      {
        "number": "10.5.1",
        "item": "Procedimento e justificativa",
        "criterion": "Método e pressão de ensaio definidos pelo responsável técnico, com justificativa se for alternativo"
      },
      {
        "number": "10.5.2",
        "item": "Pressão máxima de trabalho admissível (PMTA)",
        "criterion": "Valor confirmado no prontuário ou memorial"
      },
      {
        "number": "10.5.3",
        "item": "Instrumentos",
        "criterion": "Manômetros calibrados, escala adequada à pressão de teste"
      },
      {
        "number": "10.5.4",
        "item": "Preparação",
        "criterion": "Vaso limpo, purgado, com válvulas de segurança isoladas ou removidas e bloqueios"
      },
      {
        "number": "10.5.5",
        "item": "Segurança do ensaio",
        "criterion": "Área isolada, pessoal afastado, sem fonte de energia ligada"
      },
      {
        "number": "10.5.6",
        "item": "Pressurização",
        "criterion": "Pressão aumentada gradualmente, sem excesso"
      },
      {
        "number": "10.5.7",
        "item": "Tempo de manutenção e exame",
        "criterion": "Pressão mantida pelo tempo previsto, sem queda ou vazamento"
      },
      {
        "number": "10.5.8",
        "item": "Despressurização e restauração",
        "criterion": "Alívio controlado, válvulas recolocadas e componentes recompostos"
      },
      {
        "number": "10.5.9",
        "item": "Relatório",
        "criterion": "Pressões, tempos, resultado e responsáveis registrados"
      }
    ]
  },
  "nr13-vp-calibracao-psv-manometro": {
    "number": "10.6",
    "title": "Aferição e Calibração de Dispositivos de Segurança",
    "items": [
      {
        "number": "10.6.1",
        "item": "Identificação dos dispositivos",
        "criterion": "PSV e manômetros com tag, nº de série, pressão de ajuste e capacidade registrados"
      },
      {
        "number": "10.6.2",
        "item": "Laboratório e rastreabilidade",
        "criterion": "Calibração rastreável RBC/INMETRO, com padrões vigentes"
      },
      {
        "number": "10.6.3",
        "item": "Inspeção visual",
        "criterion": "Corpo, mola, sede e conexões sem danos, corrosão ou obstrução"
      },
      {
        "number": "10.6.4",
        "item": "PSV: pressão de abertura",
        "criterion": "Abre na pressão de ajuste dentro da tolerância e fecha com vedação"
      },
      {
        "number": "10.6.5",
        "item": "PSV: estanqueidade",
        "criterion": "Sem vazamento antes da abertura, na pressão especificada"
      },
      {
        "number": "10.6.6",
        "item": "Manômetros",
        "criterion": "Erro dentro da classe de exatidão em vários pontos da escala"
      },
      {
        "number": "10.6.7",
        "item": "Lacre e identificação",
        "criterion": "Lacre numerado aplicado e etiqueta com data e validade"
      },
      {
        "number": "10.6.8",
        "item": "Certificado",
        "criterion": "Certificado emitido com resultados e próxima calibração"
      }
    ]
  },
  "nr13-vp-prontuario-nr13": {
    "number": "10.7",
    "title": "Reconstituição ou Elaboração de Prontuário NR-13",
    "items": [
      {
        "number": "10.7.1",
        "item": "Caracterização do vaso",
        "criterion": "Fabricante, ano, nº de série, fluido, volume e categoria levantados"
      },
      {
        "number": "10.7.2",
        "item": "Projeto e desenhos",
        "criterion": "Desenho esquemático e dimensões do vaso e suas conexões"
      },
      {
        "number": "10.7.3",
        "item": "Materiais e partes vitais",
        "criterion": "Materiais e partes que sustentam pressão identificados"
      },
      {
        "number": "10.7.4",
        "item": "Memorial de cálculo da PMTA",
        "criterion": "Cálculo com espessuras, material e normas usados"
      },
      {
        "number": "10.7.5",
        "item": "Especificação dos dispositivos de segurança",
        "criterion": "Ajuste, capacidade e tipo documentados"
      },
      {
        "number": "10.7.6",
        "item": "Registro fotográfico",
        "criterion": "Fotos gerais, das partes vitais e da plaqueta"
      },
      {
        "number": "10.7.7",
        "item": "Documentos de fabricação disponíveis",
        "criterion": "Certificados e relatórios do fabricante anexados, ou ausência registrada"
      },
      {
        "number": "10.7.8",
        "item": "Assinaturas",
        "criterion": "Prontuário assinado pelo responsável técnico com ART"
      }
    ]
  },
  "nr13-vp-plaqueta-identificacao": {
    "number": "10.8",
    "title": "Emissão e Atualização de Plaqueta de Identificação",
    "items": [
      {
        "number": "10.8.1",
        "item": "Dados do vaso",
        "criterion": "Categoria, PMTA, nº de série, fabricante e ano conferidos com o prontuário"
      },
      {
        "number": "10.8.2",
        "item": "Material da plaqueta",
        "criterion": "Metálica, resistente ao ambiente e à temperatura"
      },
      {
        "number": "10.8.3",
        "item": "Informações gravadas",
        "criterion": "Todos os dados exigidos gravados de forma legível e permanente"
      },
      {
        "number": "10.8.4",
        "item": "Local de fixação",
        "criterion": "Visível, acessível, em ponto sem isolamento ou pintura que a oculte"
      },
      {
        "number": "10.8.5",
        "item": "Fixação",
        "criterion": "Firme, sem comprometer a integridade do vaso"
      },
      {
        "number": "10.8.6",
        "item": "Data da inspeção",
        "criterion": "Última inspeção e próxima registradas, quando aplicável"
      }
    ]
  },
  "nr13-vp-livro-seguranca": {
    "number": "10.9",
    "title": "Abertura e Registro de Livro de Segurança (Físico ou Digital)",
    "items": [
      {
        "number": "10.9.1",
        "item": "Livro ou sistema",
        "criterion": "Páginas numeradas, ou sistema digital com controle de acesso e histórico"
      },
      {
        "number": "10.9.2",
        "item": "Termo de abertura",
        "criterion": "Dados do equipamento, data, responsável e identificação"
      },
      {
        "number": "10.9.3",
        "item": "Histórico existente",
        "criterion": "Registros anteriores transcritos ou anexados"
      },
      {
        "number": "10.9.4",
        "item": "Registro de inspeções",
        "criterion": "Datas, resultados e responsáveis anotados"
      },
      {
        "number": "10.9.5",
        "item": "Registro de ocorrências",
        "criterion": "Anomalias, paradas e reparos anotados com data"
      },
      {
        "number": "10.9.6",
        "item": "Recomendações técnicas",
        "criterion": "Recomendações e respectivas providências registradas"
      },
      {
        "number": "10.9.7",
        "item": "Disponibilidade",
        "criterion": "Livro acessível à fiscalização e aos operadores"
      }
    ]
  },
  "nr13-vp-relatorio-art": {
    "number": "10.10",
    "title": "Emissão de Relatório de Inspeção NR-13 + ART",
    "items": [
      {
        "number": "10.10.1",
        "item": "Identificação e escopo",
        "criterion": "Equipamento, contratante, tipo de inspeção e limitações"
      },
      {
        "number": "10.10.2",
        "item": "Documentação analisada",
        "criterion": "Prontuário, registros e relatórios anteriores listados"
      },
      {
        "number": "10.10.3",
        "item": "Exames e ensaios realizados",
        "criterion": "Descritos com método, resultados e anexos"
      },
      {
        "number": "10.10.4",
        "item": "Não conformidades",
        "criterion": "Listadas com gravidade, localização e fotografias"
      },
      {
        "number": "10.10.5",
        "item": "Parecer conclusivo",
        "criterion": "Aprovado, Aprovado com Ressalvas ou Reprovado, com fundamento"
      },
      {
        "number": "10.10.6",
        "item": "Plano de ação",
        "criterion": "Ações corretivas com responsável e prazo"
      },
      {
        "number": "10.10.7",
        "item": "Próxima inspeção",
        "criterion": "Prazos definidos conforme a norma"
      },
      {
        "number": "10.10.8",
        "item": "Assinatura e ART",
        "criterion": "Responsável técnico, CREA e nº da ART"
      }
    ]
  },
  "nr13-cald-periodica": {
    "number": "11.1",
    "title": "Inspeção de Segurança Periódica (Exame Interno e Externo)",
    "items": [
      {
        "number": "11.1.1",
        "item": "Documentação",
        "criterion": "Prontuário, registro de segurança, projeto de instalação e relatórios anteriores disponíveis"
      },
      {
        "number": "11.1.2",
        "item": "Exame externo: casco, tubulações e isolamento",
        "criterion": "Sem vazamentos, deformações ou isolamento danificado"
      },
      {
        "number": "11.1.3",
        "item": "Fornalha",
        "criterion": "Sem trincas, deformações, acúmulo de fuligem ou queima irregular"
      },
      {
        "number": "11.1.4",
        "item": "Espelhos e feixe tubular",
        "criterion": "Sem corrosão, incrustação, trincas ou vazamentos nos tubos"
      },
      {
        "number": "11.1.5",
        "item": "Refratários",
        "criterion": "Íntegros, sem desprendimento ou áreas expostas"
      },
      {
        "number": "11.1.6",
        "item": "Câmaras de água e vapor",
        "criterion": "Sem corrosão, lama ou incrustação excessiva"
      },
      {
        "number": "11.1.7",
        "item": "Estrutura, suportes e base",
        "criterion": "Firmes, sem corrosão ou recalques"
      },
      {
        "number": "11.1.8",
        "item": "Chaminé, ventilação e casa de caldeira",
        "criterion": "Tiragem adequada, casa ventilada, sinalizada e sem materiais combustíveis"
      },
      {
        "number": "11.1.9",
        "item": "Parecer e próxima inspeção",
        "criterion": "Condição de operação e prazos conforme a norma"
      }
    ]
  },
  "nr13-cald-controle-intertravamento": {
    "number": "11.2",
    "title": "Verificação de Sistemas de Controle e Intertravamento",
    "items": [
      {
        "number": "11.2.1",
        "item": "Pressostatos",
        "criterion": "Atuam nas pressões de ajuste, com sequência de operação e segurança correta"
      },
      {
        "number": "11.2.2",
        "item": "Indicadores de nível d'água",
        "criterion": "Visores limpos e legíveis, com dispositivo de nível confiável"
      },
      {
        "number": "11.2.3",
        "item": "Controle e alarme de nível baixo",
        "criterion": "Alarme e bloqueio de queima atuam no nível mínimo"
      },
      {
        "number": "11.2.4",
        "item": "Válvulas de descarga de fundo",
        "criterion": "Abrem e fecham livremente, sem vazamento"
      },
      {
        "number": "11.2.5",
        "item": "Bloqueio de combustível",
        "criterion": "Corte automático de combustível em falha de chama e em emergência"
      },
      {
        "number": "11.2.6",
        "item": "Válvulas de segurança",
        "criterion": "Instaladas, lacradas, com descarga canalizada em local seguro"
      },
      {
        "number": "11.2.7",
        "item": "Manômetros e termômetros",
        "criterion": "Legíveis, calibrados e na faixa adequada"
      },
      {
        "number": "11.2.8",
        "item": "Painel de comando e parada de emergência",
        "criterion": "Funcionando, identificado e acessível"
      },
      {
        "number": "11.2.9",
        "item": "Registro dos testes funcionais",
        "criterion": "Resultados anotados, por dispositivo"
      }
    ]
  },
  "nr13-cald-end": {
    "number": "11.3",
    "title": "Ensaios Não Destrutivos (END) em Caldeiras",
    "items": [
      {
        "number": "11.3.1",
        "item": "Plano de ensaios",
        "criterion": "Locais, método e critério de aceitação definidos pelo responsável técnico"
      },
      {
        "number": "11.3.2",
        "item": "Qualificação do inspetor",
        "criterion": "Técnico com qualificação para o método usado"
      },
      {
        "number": "11.3.3",
        "item": "Ultrassom de espessura",
        "criterion": "Pontos medidos com equipamento calibrado e comparados à espessura mínima"
      },
      {
        "number": "11.3.4",
        "item": "Líquido penetrante (LP)",
        "criterion": "Superfície preparada, procedimento seguido e indicações registradas"
      },
      {
        "number": "11.3.5",
        "item": "Partículas magnéticas (PM)",
        "criterion": "Magnetização, partículas e leitura conforme procedimento"
      },
      {
        "number": "11.3.6",
        "item": "Soldas críticas",
        "criterion": "Soldas de tubos, espelhos e bocais ensaiadas"
      },
      {
        "number": "11.3.7",
        "item": "Avaliação das indicações",
        "criterion": "Indicações classificadas conforme o critério de aceitação"
      },
      {
        "number": "11.3.8",
        "item": "Relatório de ensaio",
        "criterion": "Croqui dos pontos, resultados e fotos anexados"
      }
    ]
  },
  "nr13-cald-calibracao-psv": {
    "number": "11.4",
    "title": "Calibração de Manômetros e Válvulas de Segurança (PSV)",
    "items": [
      {
        "number": "11.4.1",
        "item": "Identificação",
        "criterion": "Tag, série, pressão de ajuste e capacidade registrados"
      },
      {
        "number": "11.4.2",
        "item": "Laboratório e padrões",
        "criterion": "Rastreabilidade RBC/INMETRO e padrões com certificado vigente"
      },
      {
        "number": "11.4.3",
        "item": "Local do ensaio",
        "criterion": "Bancada ou em operação, conforme procedimento e segurança"
      },
      {
        "number": "11.4.4",
        "item": "PSV: pressão de abertura e fechamento",
        "criterion": "Dentro da tolerância e com vedação após fechar"
      },
      {
        "number": "11.4.5",
        "item": "Manômetros",
        "criterion": "Erro dentro da classe de exatidão em vários pontos"
      },
      {
        "number": "11.4.6",
        "item": "Lacre numerado",
        "criterion": "Lacre aplicado e registrado"
      },
      {
        "number": "11.4.7",
        "item": "Certificado",
        "criterion": "Resultados, validade e próxima calibração"
      }
    ]
  },
  "nr13-cald-auditoria-documental": {
    "number": "11.5",
    "title": "Auditoria Documental e Operacional NR-13",
    "items": [
      {
        "number": "11.5.1",
        "item": "Prontuário",
        "criterion": "Completo e atualizado, com projeto, dados e histórico"
      },
      {
        "number": "11.5.2",
        "item": "Registro de segurança",
        "criterion": "Ocorrências, inspeções e recomendações registradas"
      },
      {
        "number": "11.5.3",
        "item": "Projeto de instalação",
        "criterion": "Elaborado por profissional habilitado e compatível com o que existe"
      },
      {
        "number": "11.5.4",
        "item": "Plano de manutenção",
        "criterion": "Plano ativo com execução registrada"
      },
      {
        "number": "11.5.5",
        "item": "Operadores",
        "criterion": "Certificado de qualificação e treinamento em dia"
      },
      {
        "number": "11.5.6",
        "item": "Procedimentos operacionais",
        "criterion": "Partida, parada e emergência escritos e disponíveis"
      },
      {
        "number": "11.5.7",
        "item": "Qualidade da água de alimentação",
        "criterion": "Tratamento e análises registrados"
      },
      {
        "number": "11.5.8",
        "item": "Conformidade da operação real",
        "criterion": "Prática coerente com os documentos e procedimentos"
      }
    ]
  },
  "nr13-cald-laudo-integridade-art": {
    "number": "11.6",
    "title": "Emissão de Laudo Técnico de Integridade / Inspeção + ART",
    "items": [
      {
        "number": "11.6.1",
        "item": "Escopo e limitações",
        "criterion": "Exames, ensaios e partes não avaliadas declarados"
      },
      {
        "number": "11.6.2",
        "item": "Resultados consolidados",
        "criterion": "Exame interno, externo, ensaios e controles resumidos"
      },
      {
        "number": "11.6.3",
        "item": "Não conformidades",
        "criterion": "Listadas com gravidade, local e fotografia"
      },
      {
        "number": "11.6.4",
        "item": "Parecer de integridade",
        "criterion": "Conclusão fundamentada sobre a operação segura"
      },
      {
        "number": "11.6.5",
        "item": "Prazos de próximas inspeções",
        "criterion": "Datas definidas conforme a norma"
      },
      {
        "number": "11.6.6",
        "item": "Plano de adequação",
        "criterion": "Ações, responsável e prazo"
      },
      {
        "number": "11.6.7",
        "item": "Assinatura e ART",
        "criterion": "Responsável técnico, CREA e nº da ART"
      }
    ]
  },
  "gas-abrigos-centrais-glp": {
    "number": "12.1",
    "title": "Inspeção Técnica de Abrigos e Centrais de GLP",
    "items": [
      {
        "number": "12.1.1",
        "item": "Localização e afastamentos",
        "criterion": "Distâncias mínimas de edificações, divisas, ralos e fontes de ignição respeitadas"
      },
      {
        "number": "12.1.2",
        "item": "Estrutura do abrigo",
        "criterion": "Paredes, cobertura e piso em material incombustível, sem danos"
      },
      {
        "number": "12.1.3",
        "item": "Ventilação",
        "criterion": "Aberturas ou venezianas no topo e na base, desobstruídas"
      },
      {
        "number": "12.1.4",
        "item": "Acessos e portas",
        "criterion": "Acesso livre, porta com abertura para fora e trancada"
      },
      {
        "number": "12.1.5",
        "item": "Cilindros ou tanque",
        "criterion": "Posicionados em pé, protegidos do sol e da água, fixados e dentro do limite de quantidade"
      },
      {
        "number": "12.1.6",
        "item": "Reguladores e conexões",
        "criterion": "Sem vazamento, firmes e identificados"
      },
      {
        "number": "12.1.7",
        "item": "Extintores",
        "criterion": "Tipo e quantidade adequados, dentro da validade"
      },
      {
        "number": "12.1.8",
        "item": "Instalação elétrica",
        "criterion": "Sem pontos que gerem faísca, luminárias e tomadas com proteção adequada"
      },
      {
        "number": "12.1.9",
        "item": "Limpeza e organização",
        "criterion": "Sem material combustível, vegetação ou lixo"
      }
    ]
  },
  "gas-teste-estanqueidade": {
    "number": "12.2",
    "title": "Teste de Estanqueidade em Redes e Tubulações de Gás",
    "items": [
      {
        "number": "12.2.1",
        "item": "Escopo e trecho ensaiado",
        "criterion": "Rede, pontos e extensão definidos, com isométrico ou croqui"
      },
      {
        "number": "12.2.2",
        "item": "Procedimento e pressão de ensaio",
        "criterion": "Pressão e tempo definidos conforme a norma aplicável ao tipo de rede"
      },
      {
        "number": "12.2.3",
        "item": "Fluido de ensaio",
        "criterion": "Nitrogênio seco ou ar comprimido, nunca o gás combustível"
      },
      {
        "number": "12.2.4",
        "item": "Instrumentos",
        "criterion": "Manômetro calibrado, com escala e resolução adequadas"
      },
      {
        "number": "12.2.5",
        "item": "Preparação",
        "criterion": "Trecho isolado, aparelhos desconectados e extremidades tamponadas"
      },
      {
        "number": "12.2.6",
        "item": "Pressurização e estabilização",
        "criterion": "Pressão aplicada gradualmente e estabilizada antes da leitura"
      },
      {
        "number": "12.2.7",
        "item": "Monitoramento da pressão",
        "criterion": "Sem queda de pressão durante o tempo normativo, com correção por temperatura"
      },
      {
        "number": "12.2.8",
        "item": "Verificação de vazamento por solução",
        "criterion": "Teste com solução espumante nas conexões, quando aplicável"
      },
      {
        "number": "12.2.9",
        "item": "Resultado e despressurização",
        "criterion": "Aprovado ou reprovado, com despressurização segura"
      }
    ]
  },
  "gas-rastreamento-lel": {
    "number": "12.3",
    "title": "Rastreamento de Vazamentos com Detector de Gases (LEL)",
    "items": [
      {
        "number": "12.3.1",
        "item": "Detector",
        "criterion": "Equipamento calibrado e com bump test no dia"
      },
      {
        "number": "12.3.2",
        "item": "Ambiente",
        "criterion": "Leitura de fundo em ar limpo e ambiente ventilado"
      },
      {
        "number": "12.3.3",
        "item": "Conexões e registros",
        "criterion": "Leitura sem presença de gás em cada ponto"
      },
      {
        "number": "12.3.4",
        "item": "Válvulas e reguladores",
        "criterion": "Sem leitura acima do limite definido"
      },
      {
        "number": "12.3.5",
        "item": "Fogões, fornos e bicos de Bunsen",
        "criterion": "Conexões e mangueiras sem vazamento"
      },
      {
        "number": "12.3.6",
        "item": "Pontos baixos e espaços fechados",
        "criterion": "Verificados, sem acúmulo (GLP é mais pesado que o ar)"
      },
      {
        "number": "12.3.7",
        "item": "Registro das leituras",
        "criterion": "Ponto, valor e hora anotados, com croqui"
      },
      {
        "number": "12.3.8",
        "item": "Ação em caso de vazamento",
        "criterion": "Procedimento de isolamento e comunicação acionado se houver leitura"
      }
    ]
  },
  "gas-auditoria-componentes": {
    "number": "12.4",
    "title": "Auditoria de Validade e Conformidade de Componentes",
    "items": [
      {
        "number": "12.4.1",
        "item": "Reguladores de pressão",
        "criterion": "Data de fabricação e validade conferidas, com selo de conformidade"
      },
      {
        "number": "12.4.2",
        "item": "Mangueiras flexíveis",
        "criterion": "Homologadas, dentro da validade e sem ressecamento ou trincas"
      },
      {
        "number": "12.4.3",
        "item": "Cilindros: reteste",
        "criterion": "Data do reteste hidrostático dentro do prazo, sem corrosão ou amassados"
      },
      {
        "number": "12.4.4",
        "item": "Cilindros: identificação",
        "criterion": "Fabricante, nº de série e capacidade legíveis"
      },
      {
        "number": "12.4.5",
        "item": "Válvulas e conexões",
        "criterion": "Sem desgaste, com vedação íntegra"
      },
      {
        "number": "12.4.6",
        "item": "Registro dos componentes",
        "criterion": "Lista com datas de fabricação e vencimento"
      },
      {
        "number": "12.4.7",
        "item": "Substituições necessárias",
        "criterion": "Itens vencidos ou fora do padrão listados"
      }
    ]
  },
  "gas-sinalizacao-seguranca": {
    "number": "12.5",
    "title": "Inspeção de Sinalização de Segurança",
    "items": [
      {
        "number": "12.5.1",
        "item": "\"Perigo – Inflamável\"",
        "criterion": "Placa visível e legível na entrada e no abrigo"
      },
      {
        "number": "12.5.2",
        "item": "\"Proibido chama ou faísca\"",
        "criterion": "Placa visível no entorno da central"
      },
      {
        "number": "12.5.3",
        "item": "Identificação de capacidade",
        "criterion": "Capacidade ou quantidade de gás indicada"
      },
      {
        "number": "12.5.4",
        "item": "Identificação do fornecedor",
        "criterion": "Nome e telefone do fornecedor visíveis"
      },
      {
        "number": "12.5.5",
        "item": "Telefones de emergência",
        "criterion": "Bombeiros e responsável visíveis"
      },
      {
        "number": "12.5.6",
        "item": "Identificação das tubulações",
        "criterion": "Cor e sentido do fluxo conforme o padrão adotado"
      },
      {
        "number": "12.5.7",
        "item": "Conservação",
        "criterion": "Placas íntegras, fixadas e sem desbotamento"
      }
    ]
  },
  "gas-laudo-estanqueidade-art": {
    "number": "12.6",
    "title": "Emissão de Laudo de Estanqueidade + Relatório Preventivo + ART",
    "items": [
      {
        "number": "12.6.1",
        "item": "Identificação por abrigo e ponto",
        "criterion": "Cada abrigo e ponto de consumo identificado no laudo"
      },
      {
        "number": "12.6.2",
        "item": "Resultado do teste de estanqueidade",
        "criterion": "Pressão, tempo e resultado de cada rede"
      },
      {
        "number": "12.6.3",
        "item": "Resultado do rastreamento (LEL)",
        "criterion": "Leituras por ponto, com fotos"
      },
      {
        "number": "12.6.4",
        "item": "Registro fotográfico",
        "criterion": "Fotos antes e durante o ensaio, com legenda"
      },
      {
        "number": "12.6.5",
        "item": "Não conformidades",
        "criterion": "Listadas com gravidade e localização"
      },
      {
        "number": "12.6.6",
        "item": "Plano de ação",
        "criterion": "Correções com responsável e prazo"
      },
      {
        "number": "12.6.7",
        "item": "Parecer e validade",
        "criterion": "Conclusão e prazo para novo ensaio"
      },
      {
        "number": "12.6.8",
        "item": "Assinatura e ART",
        "criterion": "Responsável técnico, CREA e nº da ART"
      }
    ]
  },
  "nr13-tub-cadastramento": {
    "number": "13.1",
    "title": "Cadastramento e Enquadramento de Tubulações (NR-13)",
    "items": [
      {
        "number": "13.1.1",
        "item": "Linhas levantadas",
        "criterion": "Todas as linhas listadas com identificação, origem e destino"
      },
      {
        "number": "13.1.2",
        "item": "Fluido",
        "criterion": "Fluido e classe (A ou B) definidos conforme a norma"
      },
      {
        "number": "13.1.3",
        "item": "Pressão e temperatura de operação",
        "criterion": "Valores de projeto e de operação levantados"
      },
      {
        "number": "13.1.4",
        "item": "Diâmetro e especificação",
        "criterion": "Diâmetro nominal, material e classe de pressão conferidos"
      },
      {
        "number": "13.1.5",
        "item": "Critério de enquadramento",
        "criterion": "Aplicado conforme os limites da norma, com justificativa"
      },
      {
        "number": "13.1.6",
        "item": "Resultado",
        "criterion": "Linha enquadrada ou não, registrada em tabela de cadastro"
      },
      {
        "number": "13.1.7",
        "item": "Identificação em campo",
        "criterion": "Linhas com tag e sentido do fluxo"
      }
    ]
  },
  "nr13-tub-fluxograma-isometrico": {
    "number": "13.2",
    "title": "Elaboração de Fluxograma de Engenharia e Isométricos",
    "items": [
      {
        "number": "13.2.1",
        "item": "Levantamento em campo",
        "criterion": "Traçado real das linhas conferido no local"
      },
      {
        "number": "13.2.2",
        "item": "Equipamentos e conexões",
        "criterion": "Equipamentos, bocais e interligações representados"
      },
      {
        "number": "13.2.3",
        "item": "Válvulas e acessórios",
        "criterion": "Válvulas, filtros, purgadores e instrumentos identificados por tag"
      },
      {
        "number": "13.2.4",
        "item": "Pontos de medição",
        "criterion": "Manômetros, termômetros e transmissores indicados"
      },
      {
        "number": "13.2.5",
        "item": "Isométricos",
        "criterion": "Cotas, diâmetros, especificações e suportes representados"
      },
      {
        "number": "13.2.6",
        "item": "Dispositivos de segurança e alívio",
        "criterion": "Válvulas de segurança e descargas indicadas"
      },
      {
        "number": "13.2.7",
        "item": "Conferência",
        "criterion": "Desenho conferido no campo e assinado pelo responsável técnico"
      }
    ]
  },
  "nr13-tub-inspecao-espessura": {
    "number": "13.3",
    "title": "Inspeção Visual e Medição de Espessura em Linhas",
    "items": [
      {
        "number": "13.3.1",
        "item": "Suportes e apoios",
        "criterion": "Firmes, sem corrosão, deformação ou perda de contato"
      },
      {
        "number": "13.3.2",
        "item": "Juntas de expansão",
        "criterion": "Sem trincas, deformação ou fadiga, guias presentes"
      },
      {
        "number": "13.3.3",
        "item": "Corrosão externa",
        "criterion": "Sem perda de metal ou pites significativos"
      },
      {
        "number": "13.3.4",
        "item": "Corrosão sob isolamento (CSI)",
        "criterion": "Isolamento íntegro e sem sinais de umidade; pontos suspeitos abertos"
      },
      {
        "number": "13.3.5",
        "item": "Vazamentos e flanges",
        "criterion": "Sem vazamento, parafusos completos e apertados"
      },
      {
        "number": "13.3.6",
        "item": "Pontos críticos",
        "criterion": "Curvas, tês, reduções e pontos baixos avaliados"
      },
      {
        "number": "13.3.7",
        "item": "Medição de espessura",
        "criterion": "Pontos medidos com equipamento calibrado e comparados ao mínimo"
      },
      {
        "number": "13.3.8",
        "item": "Resultado",
        "criterion": "Taxa de corrosão estimada e recomendação"
      }
    ]
  },
  "nr13-tanques-metalicos": {
    "number": "13.4",
    "title": "Inspeção de Tanques Metálicos de Armazenamento",
    "items": [
      {
        "number": "13.4.1",
        "item": "Identificação e documentos",
        "criterion": "Placa, produto armazenado, projeto e relatórios anteriores disponíveis"
      },
      {
        "number": "13.4.2",
        "item": "Costado",
        "criterion": "Sem corrosão, trincas, abaulamentos ou deformações"
      },
      {
        "number": "13.4.3",
        "item": "Teto",
        "criterion": "Sem corrosão, acúmulo de água, furos ou deformações"
      },
      {
        "number": "13.4.4",
        "item": "Fundo e chapas de fundo",
        "criterion": "Sem pites, perfurações ou recalque, avaliado conforme API 653"
      },
      {
        "number": "13.4.5",
        "item": "Fundação e anel",
        "criterion": "Sem trincas, afundamentos ou infiltração de água"
      },
      {
        "number": "13.4.6",
        "item": "Bacia de contenção",
        "criterion": "Íntegra, estanque, sem vegetação ou produto acumulado"
      },
      {
        "number": "13.4.7",
        "item": "Respiros e dispositivos de alívio",
        "criterion": "Desobstruídos, operando e na capacidade prevista"
      },
      {
        "number": "13.4.8",
        "item": "Escadas, plataformas e guarda-corpos",
        "criterion": "Firmes, sem corrosão, com acesso seguro"
      },
      {
        "number": "13.4.9",
        "item": "Aterramento, tubulações e válvulas",
        "criterion": "Aterramento íntegro, bocais e válvulas sem vazamento"
      }
    ]
  },
  "nr13-tub-plano-inspecao-art": {
    "number": "13.5",
    "title": "Plano de Inspeção e Manutenção de Tubulações + ART",
    "items": [
      {
        "number": "13.5.1",
        "item": "Inventário e criticidade",
        "criterion": "Linhas classificadas por risco e consequência de falha"
      },
      {
        "number": "13.5.2",
        "item": "Mecanismos de dano",
        "criterion": "Corrosão, erosão e fadiga prováveis identificados por linha"
      },
      {
        "number": "13.5.3",
        "item": "Métodos de inspeção",
        "criterion": "Visual, espessura e ensaios definidos para cada linha"
      },
      {
        "number": "13.5.4",
        "item": "Periodicidade",
        "criterion": "Prazos definidos conforme a criticidade e a norma"
      },
      {
        "number": "13.5.5",
        "item": "Manutenção preventiva",
        "criterion": "Rotinas de manutenção listadas com responsável"
      },
      {
        "number": "13.5.6",
        "item": "Critérios de aceitação",
        "criterion": "Espessura mínima e critério de reparo definidos"
      },
      {
        "number": "13.5.7",
        "item": "Laudo conclusivo e assinatura",
        "criterion": "Parecer do estado atual, assinatura e ART"
      }
    ]
  }
};
