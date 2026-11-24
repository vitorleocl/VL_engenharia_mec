import {
  ChecklistCriticidade,
  ChecklistModeloServico,
  TipoRespostaChecklist,
} from '../types';

type MetodoVerificacao = NonNullable<ChecklistModeloServico['itens'][number]['metodoVerificacao']>;

interface ItemSeed {
  texto: string;
  norma: string;
  criticidade?: ChecklistCriticidade;
  metodo?: MetodoVerificacao;
  impeditivo?: boolean;
  tipoResposta?: TipoRespostaChecklist;
  unidade?: string;
  foto?: boolean;
}

interface SecaoSeed {
  titulo: string;
  itens: ItemSeed[];
}

const item = (
  texto: string,
  norma: string,
  opcoes: Omit<ItemSeed, 'texto' | 'norma'> = {}
): ItemSeed => ({ texto, norma, ...opcoes });

const CRITICO: Omit<ItemSeed, 'texto' | 'norma'> = {
  criticidade: 'critica',
  impeditivo: true,
  foto: true,
};
const DOCUMENTAL: Omit<ItemSeed, 'texto' | 'norma'> = { metodo: 'documental' };
const MEDICAO = (unidade: string): Omit<ItemSeed, 'texto' | 'norma'> => ({
  criticidade: 'alta',
  metodo: 'instrumental',
  unidade,
});

/**
 * Roteiro comum a Van e Ônibus. Os itens criticamente obrigatórios reproduzem
 * o checklist de campo "Laudo de Vistoria Técnica e Condições Operacionais —
 * Transporte Escolar" (CTB, Resoluções CONTRAN, ABNT NBR e regras de ART).
 */
const SECOES_COMUNS: SecaoSeed[] = [
  {
    titulo: '1. Identificação do laudo, do veículo e dos responsáveis',
    itens: [
      item('Número do laudo/revisão, data, hora e local da vistoria registrados', 'Boa prática; NBR 17075', { tipoResposta: 'informacao' }),
      item('Contratante/órgão (Prefeitura, Secretaria de Educação, escola) e número do edital/contrato/processo identificados', 'Edital; lei municipal', { tipoResposta: 'informacao', metodo: 'documental' }),
      item('Proprietário/permissionário (nome, CPF/CNPJ) e condutor (nome, CNH, categoria) identificados', 'CTB art. 139; edital', DOCUMENTAL),
      item('Marca, modelo, versão, ano de fabricação/modelo, placa, RENAVAM e chassi/VIN conferidos com o CRLV-e', 'CTB arts. 114 e 115', { ...DOCUMENTAL, foto: true }),
      item('Carroceria (encarroçadora e número de série), combustível e tipo de câmbio registrados', 'Boa prática; NBR 17075', { metodo: 'documental' }),
      item('Hodômetro (km) registrado com foto', 'Boa prática; NBR 17075', { metodo: 'documental', foto: true }),
      item('Lotação registrada no CRLV-e e lotação proposta/autorizada compatíveis', 'CTB art. 137', { ...DOCUMENTAL, criticidade: 'critica', impeditivo: true }),
      item('Veículo acessível declarado e nível de acessibilidade indicado no CRLV-e conferido', 'Res. CONTRAN 961/2022', DOCUMENTAL),
      item('Responsável técnico identificado (nome, título e CREA) e número da ART informado', 'Lei 5.194/1966; Lei 6.496/1977; Res. CONFEA 1.137/2023', { ...DOCUMENTAL, criticidade: 'critica', impeditivo: true }),
    ],
  },
  {
    titulo: '2. Documentação do veículo e do condutor',
    itens: [
      item('CRLV-e do exercício, licenciamento quitado e sem restrição impeditiva', 'CTB arts. 120, 130 e 133', { ...CRITICO, metodo: 'documental' }),
      item('Veículo registrado como de passageiros, com espécie/categoria compatível (aluguel/escolar)', 'CTB art. 136, I', { ...CRITICO, metodo: 'documental' }),
      item('Autorização do DETRAN/órgão delegado para transporte escolar vigente', 'CTB arts. 136 e 137', { ...CRITICO, metodo: 'documental' }),
      item('Autorização afixada na parte interna, em local visível, com a lotação inscrita', 'CTB art. 137', { ...DOCUMENTAL, criticidade: 'alta', foto: true }),
      item('Laudo de inspeção semestral anterior e correções apontadas devidamente atendidas', 'CTB art. 136, II; NBR 17075', DOCUMENTAL),
      item('Certificado de verificação metrológica do cronotacógrafo (INMETRO/RBMLQ) dentro da validade', 'Res. CONTRAN 938/2022', { ...CRITICO, metodo: 'documental' }),
      item('Alvará, permissão ou cadastro municipal do transporte escolar vigente', 'CTB art. 139; lei municipal', { ...CRITICO, metodo: 'documental' }),
      item('Seguro de responsabilidade civil e/ou APP de passageiros no valor mínimo exigido', 'Edital; lei municipal', { ...DOCUMENTAL, criticidade: 'alta' }),
      item('Veículo com GNV ou modificado: CSV e inspeção específica regularizados', 'Res. CONTRAN de modificações; INMETRO', { ...CRITICO, metodo: 'documental' }),
      item('Recall pendente do fabricante consultado e atendido', 'CDC; consulta SENATRAN', DOCUMENTAL),
      item('Manual do proprietário e plano de manutenção do fabricante disponíveis', 'Boa prática; NBR 17075', DOCUMENTAL),
      item('Condutor com idade mínima de 21 anos', 'CTB art. 138, I', { ...CRITICO, metodo: 'documental' }),
      item('CNH categoria D válida, com EAR (exerce atividade remunerada)', 'CTB art. 138, II; art. 147, § 5º', { ...CRITICO, metodo: 'documental' }),
      item('Histórico de infrações dos últimos 12 meses compatível com o CTB art. 138, IV', 'CTB art. 138, IV', { ...CRITICO, metodo: 'documental' }),
      item('Curso especializado de condutor de veículo de transporte de escolares, registrado na CNH e atualizado', 'CTB art. 138, V; Res. CONTRAN 789/2020', { ...CRITICO, metodo: 'documental' }),
      item('Exame toxicológico do condutor dentro do prazo', 'CTB art. 148-A', { ...CRITICO, metodo: 'documental' }),
      item('Certidão negativa do registro de distribuição criminal (homicídio, roubo, estupro e corrupção de menores)', 'CTB art. 329', { ...CRITICO, metodo: 'documental' }),
      item('Cadastro do condutor no órgão municipal/contratante e monitor(a) quando exigido, com curso e cadastro', 'CTB art. 139; edital; lei municipal', DOCUMENTAL),
    ],
  },
  {
    titulo: '3. Identificação externa e características obrigatórias',
    itens: [
      item('Faixa horizontal amarela de 40 cm de largura, à meia altura, em toda a extensão das laterais e da traseira', 'CTB art. 136, III', { ...CRITICO, foto: true }),
      item('Dístico ESCOLAR em preto sobre a faixa (cores invertidas se a carroceria for amarela), legível e sem desgaste', 'CTB art. 136, III', { ...CRITICO, foto: true }),
      item('Lanternas brancas, foscas ou amarelas nas extremidades superiores dianteiras e vermelhas nas traseiras, funcionando', 'CTB art. 136, V', { ...CRITICO, metodo: 'funcional', foto: true }),
      item('Placas de identificação íntegras, legíveis, padrão vigente e com lacre/QR code', 'CTB art. 115', { criticidade: 'alta', foto: true }),
      item('Gravação do chassi/VIN e dos vidros confere com o CRLV-e', 'CTB art. 114', { ...CRITICO, metodo: 'documental', foto: true }),
      item('Plaqueta do fabricante/encarroçadora com tara, lotação e PBT legíveis', 'Res. CONTRAN de identificação veicular', DOCUMENTAL),
      item('Inscrição externa de lotação, telefone de reclamações e número de permissão, quando exigidos', 'Lei municipal; edital', DOCUMENTAL),
      item('Idade da frota dentro do limite do edital/município (ano de fabricação registrado)', 'Edital; lei municipal', { ...CRITICO, metodo: 'documental' }),
      item('Pintura e carroceria sem corrosão perfurante, arestas cortantes ou partes soltas', 'NBR 17075; NBR 14040', { criticidade: 'alta', foto: true }),
      item('Película nos vidros dentro dos limites de transmitância e para-brisa sem trincas no campo de visão', 'CTB art. 111; Res. CONTRAN 960/2022', { criticidade: 'alta' }),
      item('Ausência de publicidade ou adesivos que prejudiquem a faixa, a visibilidade ou a iluminação', 'CTB art. 111', { criticidade: 'baixa' }),
    ],
  },
  {
    titulo: '4. Equipamentos obrigatórios e de segurança',
    itens: [
      item('Cintos de segurança em número igual à lotação, todos funcionando (trava, retrator, fivela e cadarço sem desfiado)', 'CTB arts. 105, I e 136, VI', { ...CRITICO, metodo: 'funcional', foto: true }),
      item('Ancoragens dos cintos firmes, sem trincas ou corrosão, conforme projeto', 'NBR 6091; NBR 7337', { ...CRITICO, metodo: 'funcional' }),
      item('Cinto de três pontos do condutor funcionando', 'CTB art. 105, I', { ...CRITICO, metodo: 'funcional' }),
      item('Cronotacógrafo instalado, lacrado, com disco/fita do dia, reserva e registros das últimas 24 h', 'CTB arts. 105, II e 136, IV; Res. 912/2022; Res. 938/2022', { ...CRITICO, metodo: 'documental', foto: true }),
      item('Extintor do tipo e capacidade exigidos para a categoria, com selo INMETRO, validade e manômetro na faixa verde, em suporte fixo e acessível', 'Res. CONTRAN 919/2022', { ...CRITICO, foto: true }),
      item('Retrovisores internos e externos (ou câmera-monitor) com os campos de visão exigidos, fixos e sem trincas', 'Res. CONTRAN 924/2022; Res. 966/2022', { ...CRITICO, metodo: 'funcional' }),
      item('Triângulo de sinalização, macaco, chave de roda e estepe em condições de uso', 'Res. CONTRAN 912/2022', { criticidade: 'alta' }),
      item('Encostos de cabeça onde exigidos por projeto/fabricação', 'CTB art. 105; Res. CONTRAN 912/2022', { criticidade: 'alta' }),
      item('Limpador e lavador de para-brisa, buzina e pala interna de proteção contra o sol funcionando', 'Res. CONTRAN 912/2022', { criticidade: 'alta', metodo: 'funcional' }),
      item('Velocímetro funcionando', 'Res. CONTRAN 912/2022', { ...CRITICO, metodo: 'funcional' }),
      item('Para-choques dianteiro e traseiro íntegros e protetores laterais/traseiros quando exigidos', 'Res. CONTRAN 912/2022', { criticidade: 'alta' }),
      item('Dispositivos refletivos (faixas retrorrefletivas) quando exigidos para a categoria', 'Res. CONTRAN 912/2022', { criticidade: 'alta' }),
      item('Martelo quebra-vidros ou dispositivo de abertura junto às janelas de emergência, com sinalização', 'Res. CONTRAN 959/2022; NBR 17075', { ...CRITICO, foto: true }),
      item('Kit de primeiros socorros, quando exigido pelo edital', 'Edital; lei municipal', { criticidade: 'baixa' }),
      item('Dispositivo de retenção infantil (cadeirinha/assento de elevação) para crianças pequenas, se exigido', 'Res. CONTRAN 819/2021; edital', { criticidade: 'alta' }),
      item('GPS/rastreador e câmeras internas, se exigidos', 'Edital; lei municipal', { criticidade: 'baixa', metodo: 'funcional' }),
    ],
  },
  {
    titulo: '5. Freios',
    itens: [
      item('Eficiência do freio de serviço (frenômetro ou teste em pista)', 'NBR 14040-6', { ...CRITICO, metodo: 'instrumental', unidade: '%' }),
      item('Desequilíbrio de frenagem por eixo dentro do limite', 'NBR 14040-6', { ...CRITICO, metodo: 'instrumental', unidade: '%' }),
      item('Freio de estacionamento segura o veículo em rampa/eficiência medida', 'NBR 14040-6', { ...CRITICO, metodo: 'funcional' }),
      item('Curso e firmeza do pedal; ausência de pedal esponjoso', 'NBR 14040-6', { ...CRITICO, metodo: 'funcional' }),
      item('Pastilhas, lonas, discos e tambores dentro da espessura mínima do fabricante', 'NBR 14040-6', { ...CRITICO, metodo: 'instrumental', unidade: 'mm' }),
      item('Flexíveis, tubulações, cilindros e conexões sem vazamento, trinca ou atrito', 'NBR 14040-6', { ...CRITICO }),
      item('Nível e estado do fluido de freio', 'Manual do fabricante', MEDICAO('nível')),
      item('Freio a ar: compressor, reservatórios, válvulas, tempo de recarga, alarme de baixa pressão e dreno (se equipado)', 'NBR 14040-6', { ...CRITICO, metodo: 'funcional' }),
      item('ABS: luz-espia apaga após a partida (quando equipado)', 'Res. CONTRAN 959/2022; fabricante', { criticidade: 'alta', metodo: 'funcional' }),
      item('Freio-motor/retarder funcionando (quando equipado)', 'Fabricante', { criticidade: 'baixa', metodo: 'funcional' }),
    ],
  },
  {
    titulo: '6. Direção',
    itens: [
      item('Folga angular no volante dentro do limite', 'NBR 14040-7', { ...CRITICO, metodo: 'instrumental', unidade: '°' }),
      item('Terminais, barras, braço Pitman e pivôs sem folga', 'NBR 14040-7', { ...CRITICO }),
      item('Caixa de direção e direção hidráulica/elétrica sem vazamento e com assistência normal', 'NBR 14040-7', { ...CRITICO, metodo: 'funcional' }),
      item('Coluna e volante fixos, sem trincas', 'NBR 14040-7', { ...CRITICO }),
      item('Alinhamento/convergência (desgaste irregular de pneus como indício)', 'NBR 14040', { criticidade: 'alta' }),
    ],
  },
  {
    titulo: '7. Suspensão, rodas e pneus',
    itens: [
      item('Molas, feixes, grampos, bolsas de ar e batentes sem quebra ou vazamento', 'NBR 14040', { ...CRITICO }),
      item('Amortecedores sem vazamento e com eficiência adequada', 'NBR 14040', { criticidade: 'alta' }),
      item('Buchas, bandejas, barras estabilizadoras e tensoras sem folga', 'NBR 14040', { criticidade: 'alta' }),
      item('Rolamentos de roda sem folga ou ruído', 'NBR 14040', { ...CRITICO, metodo: 'funcional' }),
      item('Rodas sem trincas ou empenamento; porcas e prisioneiros completos e torqueados', 'NBR 14040', { ...CRITICO }),
      item('Profundidade dos sulcos dos pneus ≥ 1,6 mm (medir e registrar por posição)', 'Res. CONTRAN de pneus; NBR 14040', { ...CRITICO, metodo: 'instrumental', unidade: 'mm', foto: true }),
      item('Pneus sem bolhas, cortes ou deformações; mesma medida e tipo por eixo; índice de carga compatível', 'NBR 14040; fabricante', { ...CRITICO }),
      item('Pneus recapados/remoldados fora do eixo dianteiro de ônibus e micro-ônibus', 'Res. CONTRAN de pneus', { ...CRITICO }),
      item('Calibragem conforme fabricante', 'Manual do fabricante', MEDICAO('psi')),
    ],
  },
  {
    titulo: '8. Motor, transmissão e emissões',
    itens: [
      item('Ausência de vazamentos de óleo, combustível e arrefecimento', 'NBR 14040', { ...CRITICO }),
      item('Sistema de combustível: tanque, tampa, linhas e fixações íntegros', 'NBR 14040', { ...CRITICO }),
      item('Coxins de motor e câmbio íntegros', 'NBR 14040', { criticidade: 'alta' }),
      item('Embreagem, câmbio e cardan/semiárvores sem folga, ruído ou vazamento', 'NBR 14040', { criticidade: 'alta', metodo: 'funcional' }),
      item('Escapamento sem furos ou vazamento para o salão; saída fora da área de embarque', 'NBR 14040; Res. CONTRAN 959/2022', { ...CRITICO }),
      item('Opacidade (diesel) ou emissões dentro dos limites', 'Res. CONAMA 418/2009; PROCONVE', { criticidade: 'alta', metodo: 'instrumental', unidade: 'm⁻¹' }),
      item('Ruído externo dentro do limite', 'Res. CONAMA/CONTRAN', { criticidade: 'baixa', metodo: 'instrumental', unidade: 'dB(A)' }),
      item('Indicadores do painel (temperatura, pressão de óleo e carga) funcionando sem alerta ativo', 'Fabricante', { criticidade: 'alta', metodo: 'funcional' }),
    ],
  },
  {
    titulo: '9. Sistema elétrico e iluminação',
    itens: [
      item('Faróis baixo e alto funcionando e regulados (regloscopia)', 'NBR 14040; Res. CONTRAN de iluminação', { ...CRITICO, metodo: 'instrumental' }),
      item('Lanternas, luz de freio (incluindo brake light), ré e placa funcionando', 'NBR 14040; Res. CONTRAN 912/2022', { ...CRITICO, metodo: 'funcional' }),
      item('Indicadores de direção e pisca-alerta funcionando', 'NBR 14040', { ...CRITICO, metodo: 'funcional' }),
      item('Lanternas delimitadoras e laterais, quando exigidas', 'Res. CONTRAN 912/2022', { criticidade: 'alta' }),
      item('Iluminação interna do salão e dos degraus funcionando', 'Res. CONTRAN 959/2022; NBR 17075', { criticidade: 'alta', metodo: 'funcional' }),
      item('Bateria fixa, terminais protegidos e chave geral, quando exigida', 'NBR 14040', { criticidade: 'alta' }),
      item('Chicotes sem emendas improvisadas, fios expostos ou sinais de superaquecimento', 'NBR 14040', { ...CRITICO }),
      item('Alarme sonoro de ré e sinal sonoro de porta aberta, quando exigidos', 'Edital; fabricante', { criticidade: 'baixa', metodo: 'funcional' }),
    ],
  },
  {
    titulo: '10. Chassi e estrutura',
    itens: [
      item('Longarinas e travessas sem trincas, corrosão severa ou solda irregular', 'NBR 14040', { ...CRITICO, foto: true }),
      item('Fixação carroceria-chassi íntegra', 'NBR 14040', { ...CRITICO }),
      item('Assoalho estrutural sem perfuração por corrosão', 'NBR 14040; NBR 17075', { ...CRITICO }),
      item('Ausência de modificações não regularizadas (alongamento, rebaixamento ou troca de motor)', 'CTB art. 98', { ...CRITICO, metodo: 'documental' }),
    ],
  },
  {
    titulo: '11. Salão de passageiros, portas e saídas de emergência',
    itens: [
      item('Número de assentos igual à lotação autorizada; nenhum passageiro em pé ou assento improvisado', 'CTB art. 137', { ...CRITICO }),
      item('Bancos firmemente fixados ao piso, estrutura sem trincas e estofamento íntegro', 'NBR 17075; Res. CONTRAN 959/2022', { ...CRITICO }),
      item('Espaçamento entre bancos e largura de corredor compatíveis com a categoria', 'Res. CONTRAN 416/2012; Res. 959/2022; NBR 16558', { criticidade: 'alta' }),
      item('Encostos sem partes metálicas expostas; balaustres e pega-mãos acolchoados ou sem arestas', 'NBR 17075; NBR 16558', { criticidade: 'alta' }),
      item('Porta de serviço: abertura e fechamento normais, comando pelo condutor e borrachas antiesmagamento', 'Res. CONTRAN 959/2022; NBR 16558', { ...CRITICO, metodo: 'funcional' }),
      item('Intertravamento porta/acelerador ou alarme de porta aberta, quando equipado ou exigido', 'Res. CONTRAN 959/2022; edital', { criticidade: 'alta', metodo: 'funcional' }),
      item('Degraus antiderrapantes, altura dentro do limite e iluminação de degrau', 'Res. CONTRAN 959/2022; NBR 16558', { criticidade: 'alta' }),
      item('Saídas de emergência em quantidade, posição e dimensão exigidas, sem obstrução', 'Res. CONTRAN 959/2022; Res. 416/2012', { ...CRITICO, foto: true }),
      item('Saídas de emergência operam com facilidade e têm instruções de uso visíveis', 'Res. CONTRAN 959/2022', { ...CRITICO, metodo: 'funcional' }),
      item('Janelas com vidros de segurança, sem trincas e abertura limitada que impeça a saída de braços/cabeça', 'NBR 17075; edital', { criticidade: 'alta' }),
      item('Piso antiderrapante, sem furos, desníveis ou peças soltas', 'NBR 17075; NBR 16558', { criticidade: 'alta' }),
      item('Revestimentos internos sem arestas cortantes, parafusos salientes ou fiação exposta', 'NBR 17075', { criticidade: 'alta' }),
      item('Ventilação/ar-condicionado funcionando (conforme edital) e ausência de entrada de gases no salão', 'Edital; NBR 17075', { criticidade: 'alta', metodo: 'funcional' }),
      item('Posto do condutor: banco regulável e fixo, pedais com borracha e campo de visão livre', 'NBR 14040; Res. CONTRAN 959/2022', { criticidade: 'alta' }),
      item('Bagageiro/porta-mochila fixo, sem risco de queda de objetos', 'NBR 16558', { criticidade: 'baixa' }),
      item('Limpeza e higiene geral do salão', 'Edital; vigilância sanitária', { criticidade: 'baixa' }),
      item('Autorização e lotação afixadas internamente e adesivos de proibição de fumar e uso obrigatório de cinto', 'CTB art. 137; edital', { criticidade: 'baixa', foto: true }),
    ],
  },
  {
    titulo: '12. Acessibilidade',
    itens: [
      item('Nível de acessibilidade indicado no CRLV-e compatível com o veículo', 'Res. CONTRAN 961/2022', { criticidade: 'alta', metodo: 'documental' }),
      item('Plataforma elevatória ou rampa: funcionamento completo (subida, descida, travas e comando de emergência manual)', 'NBR 15646; NBR 16558', { ...CRITICO, metodo: 'funcional' }),
      item('Plataforma: capacidade de carga marcada, abas antirrolamento, superfície antiderrapante e sinal sonoro/luminoso', 'NBR 15646', { ...CRITICO }),
      item('Box para cadeira de rodas com dimensões mínimas e sistema de fixação em 4 pontos', 'NBR 16558; NBR 14022', { ...CRITICO }),
      item('Cinto de segurança próprio para o usuário de cadeira de rodas', 'NBR 16558; NBR 14022', { ...CRITICO }),
      item('Assentos preferenciais identificados e com apoio adequado', 'NBR 14022; NBR 16558', { criticidade: 'alta' }),
      item('Corrimãos e pega-mãos em cor contrastante nas áreas de embarque', 'NBR 14022; NBR 15570', { criticidade: 'alta' }),
      item('Pictograma internacional de acesso e sinalização externa/interna do box', 'NBR 14022', { criticidade: 'baixa' }),
      item('Dispositivo de solicitação de parada ao alcance do usuário, quando aplicável', 'NBR 14022', { criticidade: 'baixa' }),
      item('Registro de manutenção periódica da plataforma elevatória', 'NBR 15646; fabricante', { criticidade: 'alta', metodo: 'documental' }),
    ],
  },
  {
    titulo: '13. Condições operacionais e de manutenção',
    itens: [
      item('Plano de manutenção preventiva documentado (periodicidade por km/tempo)', 'NBR 17075; fabricante', { criticidade: 'alta', metodo: 'documental' }),
      item('Registros das últimas manutenções (notas, ordens de serviço, óleo, filtros, freios e pneus)', 'Boa prática; edital', { criticidade: 'alta', metodo: 'documental' }),
      item('Revisões do fabricante em dia (veículos em garantia)', 'Manual do fabricante', DOCUMENTAL),
      item('Discos/fitas do cronotacógrafo arquivados, sem excesso de velocidade ou jornada irregular', 'Res. CONTRAN 938/2022; CTB art. 67-C', { criticidade: 'alta', metodo: 'documental' }),
      item('Teste dinâmico em pista: partida, aceleração, troca de marchas, frenagem e direção sem anomalias', 'NBR 14040', { ...CRITICO, metodo: 'funcional' }),
      item('Rota/itinerário compatível com o porte do veículo (estradas rurais, rampas, pontes e raio de giro)', 'Edital; análise técnica', { criticidade: 'alta' }),
      item('Pontos de embarque/desembarque do lado da calçada e sem manobra de ré perto de alunos', 'Boa prática; edital', { criticidade: 'baixa' }),
      item('Lotação operacional (alunos por viagem) igual ou menor que a lotação autorizada', 'CTB art. 137', { ...CRITICO }),
      item('Jornada e descanso do condutor compatíveis com o tempo de direção previsto', 'CTB art. 67-C', { criticidade: 'alta', metodo: 'documental' }),
      item('Procedimento de emergência e lista de alunos/telefones a bordo', 'Edital; boa prática', { criticidade: 'baixa' }),
      item('Próxima inspeção semestral agendada (data)', 'CTB art. 136, II', DOCUMENTAL),
    ],
  },
  {
    titulo: '14. Exigências do edital e normas municipais',
    itens: [
      item('Idade máxima da frota exigida pelo edital/município', 'Edital; lei municipal', { ...CRITICO, metodo: 'documental', tipoResposta: 'VALOR', unidade: 'anos' }),
      item('Lotação mínima por veículo/rota', 'Edital; lei municipal', { ...CRITICO, metodo: 'documental' }),
      item('Ar-condicionado exigido e funcionando', 'Edital; lei municipal', { criticidade: 'alta', metodo: 'funcional' }),
      item('Monitor(a) a bordo, quando exigido', 'Edital; lei municipal', { criticidade: 'alta' }),
      item('GPS/rastreamento e câmeras exigidos', 'Edital; lei municipal', { criticidade: 'baixa', metodo: 'funcional' }),
      item('Seguro APP e RC nos valores mínimos exigidos', 'Edital; lei municipal', { criticidade: 'alta', metodo: 'documental' }),
      item('Vistoria municipal/selo de vistoria vigente', 'CTB art. 139; lei municipal', { ...CRITICO, metodo: 'documental' }),
      item('Padrão visual e identificação do município', 'Edital; lei municipal', { criticidade: 'baixa' }),
      item('Veículo reserva disponível quando exigido', 'Edital; lei municipal', { criticidade: 'alta' }),
      item('Outras exigências específicas do edital/termo de referência citadas e verificadas', 'Edital; termo de referência', { criticidade: 'alta', metodo: 'documental' }),
    ],
  },
  {
    titulo: '15. Registros, parecer final e responsabilidade técnica',
    itens: [
      item('Registro fotográfico mínimo: vistas frontal, traseira e laterais com faixa e dístico visíveis', 'Boa prática; NBR 17075', { criticidade: 'alta', foto: true }),
      item('Fotos de placa, chassi/VIN, plaqueta, hodômetro, cronotacógrafo e extintor', 'Boa prática; NBR 17075', { criticidade: 'alta', foto: true }),
      item('Foto do salão (geral, bancos, cintos, saídas e autorização afixada) e de cada não conformidade, com nº do item', 'Boa prática; NBR 17075', { criticidade: 'alta', foto: true }),
      item('Medições registradas: frenagem, desequilíbrio, freio de estacionamento, folga da direção, sulco dos pneus, regulagem de faróis e opacidade', 'NBR 14040-6; NBR 14040-7; Res. CONAMA 418/2009', { criticidade: 'alta', metodo: 'instrumental' }),
      item('Resumo das não conformidades com descrição, gravidade, ação corretiva e prazo', 'Boa prática; NBR 17075', { criticidade: 'alta' }),
      item('Parecer técnico emitido (APTO, APTO COM RESTRIÇÕES ou INAPTO) e validade do laudo indicada', 'CTB art. 136, II; edital', { ...CRITICO }),
      item('ART registrada no CREA antes/do início do serviço, com atividade e obra/serviço compatíveis, nº citado no laudo e comprovante anexado', 'Lei 6.496/1977; Res. CONFEA 1.137/2023', { ...CRITICO, metodo: 'documental' }),
    ],
  },
];

/** Itens aplicáveis apenas quando o veículo selecionado for Van/utilitário. */
const SECOES_VAN: SecaoSeed[] = [
  {
    titulo: '16. Particularidades da Van / utilitário',
    itens: [
      item('Categoria proposta selecionada como Van/utilitário M1-M2 e compatível com a espécie registrada no CRLV-e', 'CTB art. 136; edital', { ...CRITICO, metodo: 'documental' }),
      item('Adaptação para transporte escolar homologada/regularizada, com CSV e ART da transformação quando aplicável', 'CTB arts. 98 e 137', { ...CRITICO, metodo: 'documental' }),
      item('Bancos originais ou adaptação homologada; ausência de banco extra não registrado', 'CTB arts. 98 e 137', { ...CRITICO, foto: true }),
      item('Portas laterais/traseiras operando por dentro e por fora, sem obstrução como saída de emergência', 'Boa prática; edital; NBR 17075', { ...CRITICO, metodo: 'funcional' }),
      item('Porta corrediça com trava e batente sem folga, comando do condutor e borracha antiesmagamento', 'Boa prática; edital', { criticidade: 'alta', metodo: 'funcional' }),
      item('Banco basculante e corredor de acesso funcionando livremente até a saída traseira', 'Res. CONTRAN 416/2012; edital', { ...CRITICO, metodo: 'funcional' }),
      item('Estribo fixo e antiderrapante, quando instalado, sem folga ou arestas', 'Boa prática; edital', { criticidade: 'alta' }),
      item('Cintos de três pontos ou subabdominais conforme projeto, inclusive no banco traseiro e nos basculantes', 'CTB art. 136, VI; NBR 6091', { ...CRITICO, metodo: 'funcional' }),
      item('Carga por eixo e PBT não excedidos na lotação máxima (sobrecarga comum em vans)', 'Plaqueta do fabricante; CRLV-e', { ...CRITICO, metodo: 'instrumental', unidade: 'kg' }),
      item('Acessibilidade por plataforma/box, quando declarada: conferir adaptação homologada', 'Res. CONTRAN 961/2022; NBR 16558', { criticidade: 'alta', metodo: 'documental' }),
    ],
  },
];

/** Itens aplicáveis apenas quando o veículo selecionado for Ônibus/micro-ônibus. */
const SECOES_ONIBUS: SecaoSeed[] = [
  {
    titulo: '16. Particularidades do Ônibus / micro-ônibus',
    itens: [
      item('Categoria proposta selecionada como Ônibus M3 ou Micro-ônibus M2/M3 e compatível com a espécie registrada', 'CTB art. 136; Res. CONTRAN 959/2022; Res. 416/2012', { ...CRITICO, metodo: 'documental' }),
      item('Freio a ar: tempo de recarga, alarme de baixa pressão e drenagem dos reservatórios', 'NBR 14040-6; Res. CONTRAN 959/2022', { ...CRITICO, metodo: 'funcional' }),
      item('Extintor 2-A:20-B:C em ônibus M3 e 2-A:10-B:C em micro-ônibus, com selo e validade', 'Res. CONTRAN 919/2022', { ...CRITICO, foto: true }),
      item('Saídas de emergência em quantidade e posição conforme lotação (janelas, alçapão de teto e porta traseira)', 'Res. CONTRAN 959/2022; Res. 416/2012', { ...CRITICO, foto: true }),
      item('Corredor livre até a saída traseira e largura compatível com a categoria M2/M3', 'Res. CONTRAN 416/2012; NBR 16558', { ...CRITICO }),
      item('Porta de serviço com comando exclusivo do condutor e intertravamento/alarme', 'Res. CONTRAN 959/2022', { ...CRITICO, metodo: 'funcional' }),
      item('Degraus e estribo com altura e superfície antiderrapante conforme a categoria', 'NBR 16558; Res. CONTRAN 959/2022', { criticidade: 'alta' }),
      item('Cintos em todos os assentos, subabdominal ou 3 pontos conforme projeto construtivo', 'CTB art. 136, VI; Res. CONTRAN 959/2022', { ...CRITICO, metodo: 'funcional' }),
      item('Carga por eixo e PBT não excedidos na lotação máxima autorizada', 'Plaqueta do fabricante; CRLV-e', { ...CRITICO, metodo: 'instrumental', unidade: 'kg' }),
      item('Acessibilidade (plataforma elevatória e box PcD) quando exigida pelo edital ou declarada no CRLV-e', 'Res. CONTRAN 961/2022; NBR 16558', { criticidade: 'alta', metodo: 'funcional' }),
    ],
  },
];

function montarModelo(
  id: string,
  nome: string,
  subtitulo: string,
  secoes: SecaoSeed[]
): ChecklistModeloServico {
  return {
    id,
    nome,
    subtitulo,
    norma:
      'CTB arts. 105, 136 a 139 e 148-A; Res. CONTRAN 912/2022, 919/2022, 924/2022, 938/2022, 959/2022 e 961/2022; ABNT NBR 17075, NBR 14040 e NBR 16558; Res. CONFEA 1.137/2023',
    secoesLaudoPadrao: secoes.map((secao) => secao.titulo),
    itens: secoes.flatMap((secao, indiceSecao) =>
      secao.itens.map((seed, indiceItem) => ({
        id: `${id}-${indiceSecao + 1}-${indiceItem + 1}`,
        numero: `${indiceSecao + 1}.${indiceItem + 1}`,
        texto: seed.texto,
        norma: seed.norma,
        secaoLaudo: secao.titulo,
        tipoResposta: seed.tipoResposta || 'C_NC_NA',
        unidade: seed.unidade,
        metodoVerificacao: seed.metodo || 'visual',
        criticidade: seed.criticidade || 'media',
        impeditivo: seed.impeditivo || false,
        fotoObrigatoria: seed.foto || false,
        exigeFotoSeNaoConforme: seed.foto || false,
      }))
    ),
  };
}

const NOME_BASE = 'Laudo de Vistoria Técnica e Condições Operacionais — Transporte Escolar';
const SUBTITULO_GRUPO = 'Transporte Escolar (selecione Van ou Ônibus)';

/**
 * Dois modelos distintos para que o usuário selecione a opção correta no
 * combobox de modelos: Van ou Ônibus. Itens comuns + particularidades da categoria.
 */
export const CHECKLIST_MODELOS_TRANSPORTE_ESCOLAR: ChecklistModeloServico[] = [
  montarModelo(
    'vistoria-transporte-escolar-van',
    `${NOME_BASE} — Van`,
    SUBTITULO_GRUPO,
    [...SECOES_COMUNS, ...SECOES_VAN]
  ),
  montarModelo(
    'vistoria-transporte-escolar-onibus',
    `${NOME_BASE} — Ônibus`,
    SUBTITULO_GRUPO,
    [...SECOES_COMUNS, ...SECOES_ONIBUS]
  ),
];
