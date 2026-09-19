export type UserRole = 'master' | 'colaborador' | 'cliente';

export interface Usuario {
  uid: string;
  nome: string;
  email: string;
  role: UserRole;
  clienteId?: string;
  cargo?: string;
  crea?: string;
  ativo?: boolean;
  criadoEm: string;
}

export interface ClienteContato {
  nome: string;
  cargo?: string;
  telefone: string;
  email: string;
}

export interface ClienteEndereco {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface Cliente {
  id: string;
  razaoSocial: string;
  nomeFantasia?: string;
  cpfCnpj: string;
  cnpj?: string;
  contatos: ClienteContato[];
  endereco: ClienteEndereco;
  criadoEm: string;
}

export interface AtivoHistoricoItem {
  laudoId: string;
  numeroLaudo: string;
  data: string;
  tipo: string;
  status: 'rascunho' | 'em_revisao' | 'finalizado';
  resultado: 'Aprovado' | 'Aprovado com Restrições' | 'Reprovado';
  hrnNivel?: string;
  totalNaoConformidades: number;
}

export interface Ativo {
  id: string;
  clienteId: string;
  clienteNome?: string;
  tipo: string;
  identificacao: string; // Ex: Placa, Chassi, Tag, Prefixo
  fabricante: string;
  modelo?: string;
  ano: number | string;
  numeroSerie?: string;
  capacidade?: string;
  localizacao?: string;
  historico: AtivoHistoricoItem[];
  criadoEm: string;
}

export type OrcamentoStatus = 'rascunho' | 'enviado' | 'aprovado' | 'recusado';

export interface PropostaPagina {
  numero: number;
  titulo: string;
  subtitulo?: string;
  conteudoHtml: string;
}

export interface OrcamentoSecao {
  id: string; // ex: 'capa', 'missao', 'principios', 'entregamos', 'problemas', 'catalogo', 'identificacao', 'equipe', 'etapa1', 'etapa2', 'operacional', 'etapa3', 'contato'
  numero: number;
  titulo: string;
  subtitulo?: string;
  conteudoHtml: string;
}

export interface OrcamentoHistorico {
  editadoEm: string;
  editadoPorUid: string;
  editadoPorNome?: string;
  resumoAlteracao: string;
  versaoAnterior?: {
    secoes?: OrcamentoSecao[];
    imagemCapaUrl?: string;
  };
}

export interface Orcamento {
  id: string;
  codigoProposta?: string; // ex: PROP-2026-001
  clienteId: string;
  clienteNome?: string;
  cnpjCliente?: string;
  representanteNome?: string;
  emailCliente?: string;
  telefoneCliente?: string;
  localidadeServico?: string;
  servico: string;
  descricaoEscopo?: string;
  normasTecnicas?: string;
  qtdEquipamentos?: string;
  horasEngenharia?: string;
  mobilizacao?: string;
  ativoId?: string;
  ativoIdentificacao?: string;
  valor: number;
  valorFormatado?: string;
  prazoDias?: number;
  prazoEntrega?: string;
  validadeDias?: number;
  condicoesPagamento?: string;
  status: OrcamentoStatus;
  laudoGeradoId?: string;
  tipoLaudoVinculadoId?: string;
  fotosDescricao?: string;
  propostaGeradaEm?: string;
  imagemCapaUrl?: string;
  imagemCapaLegenda?: string;
  secoes?: OrcamentoSecao[];
  historico?: OrcamentoHistorico[];
  paginas?: PropostaPagina[];
  paginasProposta?: PropostaPagina[];
  aceiteDigital?: {
    aprovado: boolean;
    dataHora: string;
    responsavelCliente: string;
    ipOuHash?: string;
  };
  checklistCampoOrigemId?: string;
  criadoEm: string;
}

export type VistoriaStatus = 'agendada' | 'em_andamento' | 'concluida' | 'remarcada';

export interface AgendaVistoria {
  id: string;
  clienteId: string;
  clienteNome: string;
  ativoId?: string;
  ativoIdentificacao?: string;
  laudoId?: string;
  dataHora: string;
  responsavelUid: string;
  responsavelNome: string;
  status: VistoriaStatus;
  observacoes?: string;
  criadoEm: string;
}

export interface ContatoFormulario {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  servicoInteresse: string;
  mensagem: string;
  criadoEm: string;
  respondido: boolean;
}

export interface LogAuditoria {
  id: string;
  colecaoAfetada: string;
  documentoId: string;
  acao: 'criar' | 'editar' | 'finalizar' | 'excluir';
  usuarioUid: string;
  usuarioNome: string;
  usuarioEmail: string;
  timestamp: string;
  detalhes?: string;
}

export interface UsoIAMetricas {
  totalChamadas: number;
  limiteMensal: number;
  mesAno: string;
  mesReferencia?: string;
  custoEstimadoUSD?: number;
}

export interface HRNValues {
  lo: number; // Probabilidade (0.033 a 15)
  fe: number; // Frequência (0.1 a 5)
  dph: number; // Dano Máximo (0.1 a 15)
  np: number; // Pessoas em Risco (1 a 12)
}

export interface HRNResult {
  score: number;
  nivel: 'Insignificante' | 'Baixo' | 'Médio' | 'Alto' | 'Muito Alto' | 'Crítico';
  cor: string;
  recomendacao: string;
}

export interface EvidenciaFoto {
  id: string;
  url: string;
  legenda?: string;
  descricao?: string;
  timestamp?: string;
  dataHora?: string;
  autorUid?: string;
}

export type TipoRespostaChecklist = 
  | 'conformidade' 
  | 'medida' 
  | 'informacao' 
  | 'sim_nao' 
  | 'multipla_escolha' 
  | 'data'
  | 'C_NC_NA' 
  | 'VALOR' 
  | 'SELECAO' 
  | 'FOTO';

export interface TipoLaudoItemChecklist {
  id: string;
  descricao: string;
  campo?: string;
  tipoResposta?: TipoRespostaChecklist;
  unidade?: string;
  opcoes?: string[];
  valorMinimo?: number;
  valorMaximo?: number;
  fotoObrigatoria?: boolean;
  valor?: string | number | null;
  status: 'conforme' | 'nao_conforme' | 'nao_aplicavel' | 'pendente';
  observacao?: string;
  fotoUrl?: string;
  fotosUrls?: string[];
  criterioReferencia?: string;
  obrigatorioFoto?: boolean;
  exigeFotoSeNaoConforme?: boolean;
  valorResposta?: string;
}

export interface TipoLaudoSecaoPadrao {
  id: string;
  titulo: string;
  ordem: number;
  conteudoHtml?: string;
}

export type StatusSugeridoIA = 'Conforme' | 'Não Conforme' | 'Não Aplicável' | 'Pendente de Verificação em Campo';

export interface SecaoEspecificaDef {
  titulo: string;
  conteudoSugeridoIA?: string;
}

export interface ItemChecklistDef {
  id?: string;
  campo?: string;
  item?: string;
  descricao?: string;
  tipoResposta?: TipoRespostaChecklist;
  unidade?: string;
  opcoes?: string[];
  valorMinimo?: number;
  valorMaximo?: number;
  fotoObrigatoria?: boolean;
  valor?: string | number | null;
  criterioReferencia?: string;
  obrigatorioFoto?: boolean;
  exigeFotoSeNaoConforme?: boolean;
  statusSugeridoIA?: StatusSugeridoIA;
  observacaoSugeridaIA?: string;
  valorSugeridoIA?: string | number;
}

export interface TipoLaudoDef {
  id: string;
  codigo: string;
  nome: string;
  descricaoCurta?: string;
  normasRef: string;
  apresentacaoPadrao: string;
  metodologiaPadrao: string;
  checklistPadrao: TipoLaudoItemChecklist[];
  secoesPadrao?: TipoLaudoSecaoPadrao[];
  temHrn?: boolean;
  hrn?: boolean;
  textoBaseApresentacao?: string;
  permitePreenchimentoIA?: boolean;
  permitePreenchimentoPreliminar?: boolean;
  secoesEspecificas?: (string | SecaoEspecificaDef)[];
  checklistInicial?: (string | ItemChecklistDef)[];
}

export interface SubcategoriaLaudoDef {
  id: string;
  nome: string;
  tipos: TipoLaudoDef[];
}

export interface CategoriaLaudoDef {
  id: string;
  numero: number;
  nome: string;
  icone?: string;
  descricao?: string;
  subcategorias: SubcategoriaLaudoDef[];
}

export type CategoriaLaudoTaxonomia = CategoriaLaudoDef;
export type SubcategoriaLaudoTaxonomia = SubcategoriaLaudoDef;
export type TipoLaudoTaxonomia = TipoLaudoDef;

export interface TabelaNaoConformidadeItem {
  id: string;
  item: string;
  descricao: string;
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  recomendacao: string;
  prazo: string;
}

export interface AssinaturaDigitalLaudo {
  responsavelNome: string;
  responsavelCrea: string;
  dataHora: string;
  hashAutenticidade: string;
  assinaturaUrl?: string;
  representanteCliente?: string;
  dataHoraCliente?: string;
}

export interface LaudoItemChecklist {
  id: string;
  requisito: string;
  normaRef?: string;
  status: 'conforme' | 'nao_conforme' | 'nao_aplicavel' | 'pendente';
  gravidade?: 'baixa' | 'media' | 'alta' | 'critica';
  observacao?: string;
  hrn?: HRNValues;
  hrnScore?: number;
  hrnNivel?: string;
  fotos?: EvidenciaFoto[];
}

export interface LaudoSecao {
  id: string;
  titulo: string;
  ordem: number;
  tipo?: 'capa' | 'apresentacao' | 'diretrizes' | 'corpo_tecnico' | 'checklist' | 'conclusao' | 'art_assinatura' | 'custom' | string;
  conteudoHtml?: string;
  conteudoJson?: any;
  parecerTecnico?: string;
  recomendacoes?: string[];
  itens?: LaudoItemChecklist[];
  fotos?: EvidenciaFoto[];
  isFixa?: boolean;
  isObrigatoria?: boolean;
}

export interface LaudoTemplate {
  id: string;
  tipoBase: string;
  nome: string;
  secoes: LaudoSecao[];
  criadoPorUid: string;
  criadoEm: string;
}

export interface LaudoRevisao {
  id: string;
  dataHora: string;
  usuarioUid: string;
  usuarioNome: string;
  descricao: string;
}

export type LaudoStatus = 'rascunho' | 'em_andamento' | 'em_revisao' | 'finalizado';

export interface Laudo {
  id: string;
  numero: string; // ex: NR12-2026-001
  tipo: string;
  tipoLaudoId?: string;
  categoriaId?: string;
  subcategoriaId?: string;
  clienteId: string;
  clienteNome: string;
  clienteCnpj?: string;
  ativoId: string;
  ativoIdentificacao: string;
  status: LaudoStatus;
  artNumero: string;
  dataInspecao: string;
  responsavelNome: string;
  responsavelCrea: string;
  capaFotoUrl?: string;
  capaFotoLegenda?: string;
  apresentacao?: string;
  metodologia?: string;
  normasReferencia?: string;
  conclusao?: string;
  checklist?: TipoLaudoItemChecklist[];
  tabelaNaoConformidades?: TabelaNaoConformidadeItem[];
  artArquivoUrl?: string;
  artNomeArquivo?: string;
  artTipoArquivo?: 'imagem' | 'pdf';
  artDataHomologacao?: string;
  assinaturaDigital?: AssinaturaDigitalLaudo;
  assinaturaUrl?: string;
  resumoExecutivo?: string;
  secoes: LaudoSecao[];
  anexosFotos?: EvidenciaFoto[];
  hrnCalculoGeral?: HRNResult;
  revisoes?: LaudoRevisao[];
  usoIA: { chamadas: number };
  iniciadoComIA?: boolean;
  modoCriacao?: 'em_branco' | 'sugestao_ia';
  checklistCampoOrigemId?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export type ChecklistCampoItemStatus = 'conforme' | 'nao_conforme' | 'nao_aplicavel' | 'nao_evidenciado' | 'medicao';

export type ChecklistCriticidade = 'critica' | 'alta' | 'media' | 'baixa' | 'observacao';

export type ChecklistTipoEvidencia = 
  | 'inspecao_visual' 
  | 'medicao' 
  | 'teste_funcional' 
  | 'ensaio' 
  | 'documento' 
  | 'fotografia' 
  | 'video' 
  | 'entrevista' 
  | 'historico_manutencao';

export interface ChecklistMedicaoDetalhada {
  valorEncontrado?: string | number;
  unidade?: string;
  valorMinimo?: number;
  valorMaximo?: number;
  tolerancia?: string;
  instrumentoUtilizado?: string;
  instrumentoNumSerie?: string;
  certificadoCalibracao?: string;
  dataCalibracao?: string;
}

export interface ChecklistNaoConformidadeDetalhada {
  descricao?: string;
  evidencia?: string;
  riscoAssociado?: string;
  recomendacao?: string;
  prazoRecomendado?: string;
  referenciaNormativa?: string;
  criticidade?: ChecklistCriticidade;
  impeditivo?: boolean;
}

export interface ChecklistFotoVinculada {
  id: string;
  url: string;
  numeroFoto?: number;
  dataHora?: string;
  local?: string;
  descricao?: string;
  coordenada?: string;
  vinculoNaoConformidade?: boolean;
}

export interface ChecklistCampoItem {
  id: string;
  codigoItem?: string;
  descricao: string;
  tipoResposta?: TipoRespostaChecklist;
  unidade?: string;            // apenas para tipo 'medida' (ex.: 'mm', 'bar', 'dB(A)', 'HRN', 'h', 'm/s²')
  opcoes?: string[];           // apenas para tipo 'multipla_escolha'
  valorMinimo?: number;        // apenas para 'medida' — dispara alerta visual se fora da faixa
  valorMaximo?: number;
  fotoObrigatoria?: boolean;   // se true, bloqueia salvamento do item sem foto anexada
  valor?: string | number | null; // resposta preenchida (status, número, texto, opção ou data)
  observacao?: string;
  fotosUrls?: string[];
  // Campos de compatibilidade e legado
  campo?: string;
  grupoInspecao?: string;
  criterioInspecao?: string;
  status: ChecklistCampoItemStatus;
  fotoUrl?: string;
  fotoNome?: string;
  criterioReferencia?: string;
  referenciaNormativa?: string;
  obrigatorioFoto?: boolean;
  exigeFotoSeNaoConforme?: boolean;
  valorResposta?: string;
  // Campos detalhados do Prompt Mestre
  criticidade?: ChecklistCriticidade;
  tipoEvidencia?: ChecklistTipoEvidencia;
  medicao?: ChecklistMedicaoDetalhada;
  naoConformidade?: ChecklistNaoConformidadeDetalhada;
  fotosVinculadas?: ChecklistFotoVinculada[];
}

export interface PerigoApreciacaoRiscoNR12 {
  id: string;
  pontoOperacao: string; // Zona/ponto de operação (informacao)
  faseVida: string; // Operação Normal / Setup / Limpeza / Manutenção / Falha Previsível (multipla_escolha)
  tipoPerigo: string; // Mecânico-Esmagamento, Corte, Perfuração, etc. (multipla_escolha)
  lo: number; // Probabilidade de Ocorrência (1-15)
  fe: number; // Frequência de Exposição (1-5)
  dph: number; // Grau de Dano Possível (1-15)
  np: number; // Número de Pessoas Expostas (1-8)
  hrn: number; // HRN Calculado (LO × FE × DPH × NP)
  classificacaoRisco: 'Trivial' | 'Tolerável' | 'Moderado' | 'Substancial' | 'Intolerável' | string;
  medidaExistente: string; // Medida de controle existente (informacao)
  nivelControleRecomendado: 'Eliminação' | 'Substituição' | 'Controle de Engenharia' | 'Controle Administrativo' | 'EPI' | string;
  medidaRecomendadaDetalhada: string; // Medida de controle recomendada (detalhamento) (informacao)
  hrnResidual?: number; // HRN residual após medida proposta (medida)
  prazoImplementacao?: string; // Prazo de implementação (data)
  responsavelImplementacao?: string; // Responsável pela implementação (informacao)
  fotoUrl?: string; // Foto do ponto de perigo (fotoObrigatoria: true)
  fotosUrls?: string[];
  observacao?: string;
}

export interface ChecklistConclusaoAutomatica {
  totalAvaliados: number;
  totalConforme: number;
  totalNaoConforme: number;
  totalNaoAplicavel: number;
  totalNaoEvidenciado: number;
  totalMedicoes: number;
  totalCriticas: number;
  totalAltas: number;
  totalMedias: number;
  totalBaixas: number;
  totalObservacoes: number;
  percentualConformidade: number;
  temItemImpeditivo: boolean;
  itensImpeditivos: string[];
  necessidadeReinspecao: boolean;
  parecerSeguranca: 'Liberado' | 'Liberado com Restrições' | 'Interdição / Bloqueio Imediato';
  recomendacoesGerais?: string[];
}

export interface ChecklistCampo {
  id: string;
  numero: string; // Ex: CHK-2026-001
  clienteId: string;
  clienteNome?: string;
  clienteCnpj?: string;
  ativoId: string;
  ativoIdentificacao?: string;
  categoriaLaudo: string;
  subcategoriaLaudo?: string;
  tipoLaudoId: string;
  tipoLaudoNome?: string;
  tipoAtivo?: string;
  itens: ChecklistCampoItem[];
  itensExtras: ChecklistCampoItem[];
  perigosApreciacaoRisco?: PerigoApreciacaoRiscoNR12[];
  rubricaUrl?: string;
  rubricaTimestamp?: string;
  responsavelUid: string;
  responsavelNome?: string;
  responsavelCrea?: string;
  dataPreenchimento: string;
  geolocalizacao?: {
    lat: number;
    lng: number;
    precisao?: number;
    enderecoAproximado?: string;
  } | null;
  conclusaoAutomatica?: ChecklistConclusaoAutomatica;
  pdfUrl?: string;
  disponibilizadoParaCliente: boolean;
  status: 'rascunho' | 'finalizado';
  vinculadoALaudoId?: string | null;
  vinculadoAOrcamentoId?: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ModuloLaudoCatalogo {
  id: string;
  nome: string;
  status: 'Ativo' | 'NOVO' | 'NOVO IA';
  descricao: string;
  botao: string;
  escopo: string;
  iconName: string;
}

// -------------------------------------------------------------
// BANCO MESTRE DE CHECKLISTS TÉCNICOS DE ENGENHARIA MECÂNICA
// -------------------------------------------------------------

export type ResultadoInspecaoMestre = 
  | 'CONFORME' 
  | 'NAO_CONFORME' 
  | 'NA' 
  | 'NAO_EVIDENCIADO' 
  | 'MEDICAO';

export type CriticidadeInspecao = 
  | 'Critica' 
  | 'Alta' 
  | 'Media' 
  | 'Baixa' 
  | 'Observacao';

export type TipoEvidenciaMestre = 
  | 'Inspeção visual' 
  | 'Medição' 
  | 'Teste funcional' 
  | 'Ensaio' 
  | 'Documento' 
  | 'Fotografia' 
  | 'Vídeo' 
  | 'Entrevista' 
  | 'Histórico de manutenção';

export interface ReferenciaNormativaMestre {
  norma: string;
  edicaoAno?: string;
  itemRequisito?: string;
  observacaoTecnica?: string;
}

export interface CampoMedicaoMestre {
  valorEncontrado?: number | string;
  unidade?: string;
  valorMinimo?: number | string;
  valorMaximo?: number | string;
  tolerancia?: string;
  instrumentoUtilizado?: string;
  numeroSerieInstrumento?: string;
  certificadoCalibracao?: string;
  dataCalibracao?: string;
}

export interface RegistroFotograficoMestre {
  id: string;
  numeroFoto: number;
  dataHora: string;
  local?: string;
  itemRelacionadoCodigo?: string;
  descricao: string;
  coordenada?: string;
  fotoUrl: string;
  vinculadaNC: boolean;
}

export interface DetalhesNaoConformidadeMestre {
  descricaoNC: string;
  evidencia: TipoEvidenciaMestre | string;
  fotografiaUrl?: string;
  fotografiaNome?: string;
  criticidade: CriticidadeInspecao;
  riscoAssociado: string;
  recomendacao: string;
  prazoRecomendado: string;
  referenciaNormativa: ReferenciaNormativaMestre;
  bloqueioImediato?: boolean;
}

export interface ItemInspecaoMestre {
  codigo: string; // Ex: INC-01-001, NR12-01-003, TER-01-005
  descricao: string;
  criterioInspecao: string;
  grupoInspecao?: string;
  tipoAtivo?: string;
  resultado: ResultadoInspecaoMestre;
  campoMedicao?: CampoMedicaoMestre;
  observacao?: string;
  fotos?: RegistroFotograficoMestre[];
  evidenciaDocumental?: TipoEvidenciaMestre;
  criticidadePadrao?: CriticidadeInspecao;
  recomendacaoPadrao?: string;
  referenciaNormativa: ReferenciaNormativaMestre;
  statusInspecao?: 'Pendente' | 'Inspecionado' | 'Impedido';
  detalhesNC?: DetalhesNaoConformidadeMestre;
}

export interface TipoLaudoMestreDef {
  id: string;
  codigo: string;
  nome: string;
  normasRef: string;
  tiposAtivos?: string[];
  gruposInspecao?: string[];
  itens: ItemInspecaoMestre[];
}

export interface SubcategoriaMestreDef {
  id: string;
  codigo: string; // Ex: 1.1, 1.2, 2.1, 3.1
  nome: string;
  tiposAtivos?: string[];
  tiposLaudo: TipoLaudoMestreDef[];
}

export interface CategoriaMestreDef {
  numero: number;
  id: string;
  nome: string;
  icone: string;
  descricao?: string;
  subcategorias: SubcategoriaMestreDef[];
}

export interface ConclusaoAutomaticaChecklist {
  totalItensAvaliados: number;
  totalConforme: number;
  totalNaoConforme: number;
  totalNA: number;
  totalNaoEvidenciado: number;
  totalMedicoes: number;
  ncCriticas: number;
  ncAltas: number;
  ncMedias: number;
  ncBaixas: number;
  ncObservacoes: number;
  percentualConformidade: number; // % (base: Conformes / (Conformes + NCs))
  itensImpeditivos: {
    codigo: string;
    descricao: string;
    risco: string;
    recomendacao: string;
  }[];
  recomendacoesConsolidadas: string[];
  necessidadeReinspecao: boolean;
  parecerSeguranca: 'LIBERADO' | 'LIBERADO_COM_RESTRICOES' | 'INTERDICAO_IMEDIATA';
  justificativaRegraSeguranca: string;
}

// Aliases for component convenience
export type UsuarioPerfil = Usuario & {
  ativo?: boolean;
  crea?: string;
  clienteIdVinculado?: string;
};
export type SecaoLaudo = LaudoSecao;
export type ItemChecklist = LaudoItemChecklist;

