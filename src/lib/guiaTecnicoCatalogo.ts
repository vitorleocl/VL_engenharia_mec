import {
  GuiaChecklistGrupoModelo,
  GuiaEntregaModelo,
  GuiaModeloServico,
  GuiaServicoId,
} from '../types';

type ModeloGuiaBase = Omit<GuiaModeloServico, 'atualizadoEm' | 'atualizadoPor'>;

function gruposDoTexto(grupos: [string, string[]][]): GuiaChecklistGrupoModelo[] {
  return grupos.map(([titulo, textos]) => ({
    titulo,
    itens: textos.map((texto, indice) => ({
      id: `${titulo.toLocaleLowerCase('pt-BR').replace(/[^a-z0-9]+/g, '-')}-${indice + 1}`,
      texto,
      ordem: indice + 1,
    })),
  }));
}

function entregas(lista: [string, string, string][]): GuiaEntregaModelo[] {
  return lista.map(([nome, formato, descricao]) => ({ nome, formato, descricao }));
}

export const GUIA_TECNICO_CATALOGO: Record<GuiaServicoId, ModeloGuiaBase> = {
  hvac: {
    servico: 'hvac',
    normas: ['NBR 16401-1/-2/-3', 'NBR 16655 (PMOC)', 'NBR 10152', 'ASHRAE'],
    apresentacao: 'Levantamento de dados para projeto de climatização, ventilação e refrigeração.',
    grupos: gruposDoTexto([
      ['Documentos do imóvel', [
        'Plantas de arquitetura (DWG, PDF ou IFC): planta, cortes e fachadas',
        'Layout de mobiliário e divisórias',
        'Projetos elétrico e estrutural, se existirem',
        'As-built de instalações antigas de ar-condicionado',
      ]],
      ['Local e uso', [
        'Endereço e orientação solar das fachadas',
        'Número de pessoas por ambiente e horário de funcionamento',
        'Equipamentos que geram calor (computadores, servidores, cozinha) e potência',
        'Iluminação instalada (tipo e W/m²)',
      ]],
      ['Requisitos do cliente', [
        'Temperatura e umidade desejadas',
        'Nível máximo de ruído aceito',
        'Necessidade de renovação de ar e filtragem',
        'Sistema preferido (split, VRF, chiller) e marca',
        'Orçamento de referência e prazo',
      ]],
      ['Condições existentes', [
        'Fotos do forro, laje, telhado e fachada',
        'Pé-direito e altura livre acima do forro',
        'Tipo de vidro e película',
        'Carga disponível no quadro elétrico',
        'Local das condensadoras e caminho do dreno',
      ]],
      ['Administrativo', [
        'CNPJ e responsável pela obra',
        'Se o ambiente é de uso público ou coletivo (exige PMOC)',
        'Quem emite a ART e o escopo contratado',
      ]],
    ]),
    entregas: entregas([
      ['Memorial descritivo', 'PDF', 'Descrição das premissas e soluções do sistema.'],
      ['Memória de cálculo de carga térmica', 'XLSX/PDF', 'Cálculo indicativo por ambiente.'],
      ['HVAC-001 Planta de dutos e equipamentos, escala 1:50', 'DWG + PDF', 'Planta de distribuição e equipamentos.'],
      ['HVAC-002 Cortes e detalhes', 'DWG + PDF', 'Cortes e detalhes de instalação.'],
      ['Modelo BIM do sistema', 'RVT + IFC', 'Modelo de coordenação do sistema.'],
      ['Lista de materiais e quantitativos', 'XLSX', 'Materiais e quantitativos previstos.'],
      ['ART e plano PMOC, quando aplicável', 'PDF', 'Documentos técnicos aplicáveis ao escopo.'],
    ]),
    modelo3d: {
      descricao: 'Sala de 10 × 6 × 2,7 m com janela oeste, mesas, cassete no teto, dutos tronco e ramais, oito difusores 600 × 600, retorno, condensadora e linha frigorífica.',
      legenda: [
        { nome: 'Cassete', cor: '#22c55e' },
        { nome: 'Dutos', cor: '#38bdf8' },
        { nome: 'Difusores', cor: '#facc15' },
        { nome: 'Linha frigorífica', cor: '#f97316' },
        { nome: 'Vidro', cor: '#38bdf8' },
      ],
    },
    layersDxf: ['PAREDE', 'JANELA', 'EQUIPAMENTO', 'DUTO', 'DIFUSOR', 'COTA', 'TEXTO'],
  },
  ppci: {
    servico: 'ppci',
    normas: ['CBMPE (NTs)', 'NBR 9077', 'NBR 13714', 'NBR 10898', 'NBR 12693'],
    apresentacao: 'Levantamento de dados para projeto de prevenção e combate a incêndio.',
    alertas: ['A exigência final vem da tabela do CBMPE para a ocupação, área e altura; confirme a versão vigente das NTs.'],
    grupos: gruposDoTexto([
      ['Documentos do imóvel', [
        'Matrícula, escritura ou contrato de locação',
        'Projeto de arquitetura aprovado na prefeitura e habite-se',
        'PPCI ou AVCB anterior e validade',
        'Alvará de funcionamento',
      ]],
      ['Edificação', [
        'Uso e ocupação de cada pavimento',
        'Área construída total e por pavimento',
        'Altura da edificação, número de pavimentos e subsolos',
        'Mezaninos, galerias e áreas externas cobertas',
      ]],
      ['Ocupação e risco', [
        'Lotação máxima real por ambiente',
        'Materiais armazenados e quantidades aproximadas',
        'GLP, inflamáveis, caldeira, gerador, transformador',
        'Processos com chama, solda ou calor',
      ]],
      ['Instalações existentes', [
        'Extintores, hidrantes, reservatório e bomba de incêndio',
        'Alarme, detecção e iluminação de emergência',
        'Sinalização e portas corta-fogo',
        'Saídas de emergência, escadas e corredores',
      ]],
      ['Acesso e entorno', [
        'Largura da via e recuos para viatura',
        'Hidrante público próximo',
        'Fotos de fachada, cobertura e acessos',
      ]],
      ['Administrativo', [
        'CNPJ e responsável legal',
        'Notificação ou auto do CBMPE, se houver',
        'Laudos de SPDA e de instalações elétricas',
        'Prazo desejado para a vistoria',
      ]],
    ]),
    entregas: entregas([
      ['Memorial descritivo do PPCI', 'PDF', 'Descrição das medidas de segurança previstas.'],
      ['PPCI-01 Planta de situação e implantação', 'DWG + PDF', 'Planta de situação e implantação.'],
      ['PPCI-02 Planta do pavimento: rotas, extintores, hidrantes, alarme, iluminação', 'DWG + PDF', 'Medidas de proteção e rotas de fuga.'],
      ['PPCI-03 Cortes e detalhes', 'DWG + PDF', 'Cortes e detalhes do projeto.'],
      ['Memória de cálculo: saídas, reserva técnica, hidráulica', 'PDF/XLSX', 'Memórias indicativas sujeitas à validação normativa.'],
      ['Requerimento, taxas e ART para protocolo no CBMPE', 'PDF', 'Documentos de protocolo aplicáveis.'],
      ['Laudos de execução para a vistoria', 'PDF', 'Registros de execução para vistoria.'],
    ]),
    modelo3d: {
      descricao: 'Loja térrea de 20 × 20 m, pé-direito 3 m, duas saídas de 1,20 m, oito estantes, quatro extintores, dois hidrantes, cinco pontos de iluminação e rotas de fuga.',
      legenda: [
        { nome: 'Hidrantes', cor: '#ef4444' },
        { nome: 'Extintores', cor: '#f97316' },
        { nome: 'Iluminação', cor: '#facc15' },
        { nome: 'Rota de fuga', cor: '#22c55e' },
        { nome: 'Estantes', cor: '#94a3b8' },
      ],
    },
    layersDxf: ['PAREDE', 'PORTA', 'HIDRANTE', 'EXTINTOR', 'ILUM_EMERG', 'ROTA', 'EQUIPAMENTO', 'COTA', 'TEXTO'],
  },
  nr12: {
    servico: 'nr12',
    normas: ['NR-12', 'ISO 12100', 'ISO 13849-1', 'ISO 13855', 'ISO 13857', 'ISO 14120'],
    apresentacao: 'Levantamento de dados para apreciação de riscos e adequação de máquinas e equipamentos.',
    grupos: gruposDoTexto([
      ['Inventário', [
        'Lista de máquinas com TAG, setor e ano',
        'Fotos gerais e da placa de cada máquina',
        'Quais máquinas operam com risco de lesão grave',
      ]],
      ['Dados por máquina', [
        'Fabricante, modelo, número de série e manual',
        'Diagramas elétrico, hidráulico e pneumático',
        'Dimensões, curso, velocidades e forças',
        'Tempo de parada medido, ou autorização para medir',
      ]],
      ['Operação', [
        'Número de operadores e turnos',
        'Tarefas de operação, setup, limpeza e manutenção',
        'Frequência com que as mãos entram na zona de perigo',
        'Ferramentas e dispositivos de alimentação usados',
      ]],
      ['Segurança existente', [
        'Proteções, intertravamentos, botões de emergência e relés',
        'Histórico de acidentes e quase acidentes',
        'Laudos e planos de ação anteriores',
        'PGR, APR e procedimentos de trabalho',
      ]],
      ['Acesso para o trabalho', [
        'Janela de parada para medições e testes',
        'Autorização, EPI e integração de segurança',
        'Local para montagem das proteções e energia disponível',
      ]],
      ['Administrativo', [
        'CNPJ e responsável',
        'Registros de treinamento dos operadores',
        'Notificação fiscal e prazo, se houver',
      ]],
    ]),
    entregas: entregas([
      ['Inventário e apreciação de risco', 'XLSX/PDF', 'Inventário de máquinas e riscos identificados.'],
      ['Relatório de apreciação de risco: método, PLr e resultado antes e depois', 'PDF', 'Método, PLr e resultados da apreciação.'],
      ['NR12-001 Projeto das proteções: vistas, cotas, fixação e lista de materiais', 'DWG + PDF', 'Projeto de proteções da máquina.'],
      ['Modelo 3D das proteções', 'SLDPRT/SLDASM + STEP', 'Modelo para detalhamento e fabricação.'],
      ['DXF para corte e dobra', 'DXF', 'Geometrias para fabricação das proteções.'],
      ['Diagrama de comando de segurança', 'DWG + PDF', 'Diagrama do sistema de segurança.'],
      ['Relatório de validação e laudo', 'PDF', 'Validação das medidas implementadas.'],
      ['Plano de ação, procedimentos e ART', 'PDF', 'Documentos e plano de ação do escopo.'],
    ]),
    modelo3d: {
      descricao: 'Prensa com zona de perigo, proteção fixa translúcida em três lados, cortina de luz a 408 mm, parada de emergência em pedestal, faixa de piso e figura esquemática de operador.',
      legenda: [
        { nome: 'Proteção fixa', cor: '#facc15' },
        { nome: 'Cortina de luz', cor: '#22c55e' },
        { nome: 'Emergência', cor: '#ef4444' },
      ],
    },
    layersDxf: ['EQUIPAMENTO', 'PERIGO', 'PROTECAO', 'CORTINA_LUZ', 'ESTOP', 'COTA', 'TEXTO'],
  },
  nr13: {
    servico: 'nr13',
    normas: ['NR-13', 'ASME VIII Div. 1', 'API 510', 'ASME B31.3'],
    apresentacao: 'Levantamento de dados para inspeção de vasos de pressão, caldeiras e tubulações.',
    alertas: ['Classe do fluido, categoria e prazos de inspeção devem ser confirmados nas tabelas da NR-13 vigente.'],
    grupos: gruposDoTexto([
      ['Equipamentos', [
        'Lista com TAG, tipo e ano de fabricação',
        'Fotos gerais e do local de instalação',
      ]],
      ['Dados da placa', [
        'Fabricante, número de série e ano',
        'PMTA, temperatura máxima e volume',
        'Código de projeto (ex.: ASME VIII Div. 1)',
        'Foto legível da placa de identificação',
      ]],
      ['Fluido e operação', [
        'Fluido contido e sua classe',
        'Pressão e temperatura de operação',
        'Regime de carga e número de ciclos',
      ]],
      ['Documentação existente', [
        'Prontuário ou registro de segurança',
        'Projeto de instalação',
        'Relatórios de inspeção anteriores',
        'Data book, certificados de material e teste hidrostático',
        'Plano de inspeção',
      ]],
      ['Dispositivos de segurança', [
        'Válvula de segurança com certificado e data de calibração',
        'Manômetros calibrados',
        'Drenos, pressostatos e discos de ruptura',
      ]],
      ['Acesso para inspeção', [
        'Isolamento, despressurização e drenagem do vaso',
        'Abertura da boca de visita e andaimes',
        'Janela de parada programada',
      ]],
      ['Administrativo', [
        'Operadores treinados e responsável pela operação',
        'Histórico de reparos, alterações e acidentes',
        'CNPJ e contato do responsável',
      ]],
    ]),
    entregas: entregas([
      ['Relatório de inspeção: dados, ensaios, medições, conclusão e próximo prazo', 'PDF', 'Relatório técnico de inspeção.'],
      ['Memória de cálculo: espessura, PMTA, alívio e vida remanescente', 'PDF/XLSX', 'Cálculos indicativos sujeitos à validação.'],
      ['Prontuário e registro de segurança', 'PDF', 'Documentos de segurança do equipamento.'],
      ['Projeto de instalação: layout, dispositivos, acessos e sinalização', 'DWG + PDF', 'Projeto de instalação e acessos.'],
      ['Plano de inspeção', 'PDF', 'Plano de inspeções aplicável.'],
      ['Desenho do equipamento com bocais, suportes e dispositivos', 'DWG + PDF', 'Desenho técnico do equipamento.'],
      ['Laudo, plano de ação e ART, assinados pelo Profissional Habilitado', 'PDF', 'Documentos assinados pelo profissional responsável.'],
    ]),
    modelo3d: {
      descricao: 'Vaso horizontal esquemático de 800 × 2000 mm, tampos elípticos, duas selas, válvula de segurança superior, manômetro, boca de visita e dreno de fundo.',
      legenda: [
        { nome: 'Casco', cor: '#94a3b8' },
        { nome: 'Válvula de segurança', cor: '#ef4444' },
        { nome: 'Bocais', cor: '#38bdf8' },
      ],
    },
    layersDxf: ['CASCO', 'BOCAL', 'PSV', 'SUPORTE', 'COTA', 'TEXTO'],
    tabelaCategoriasNr13: { 'D-4': 'V' },
  },
};

export function criarDocumentosGuiaPadrao(autorEmail: string, atualizadoEm = new Date().toISOString()): GuiaModeloServico[] {
  return (Object.keys(GUIA_TECNICO_CATALOGO) as GuiaServicoId[]).map((servico) => ({
    ...GUIA_TECNICO_CATALOGO[servico],
    atualizadoEm,
    atualizadoPor: autorEmail,
  }));
}
