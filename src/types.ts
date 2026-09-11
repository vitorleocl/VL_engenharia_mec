export type UserRole = 'master' | 'colaborador' | 'cliente';

export interface Usuario {
  uid: string;
  nome: string;
  email: string;
  role: UserRole;
  clienteId?: string;
  cargo?: string;
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
  paginas?: PropostaPagina[];
  aceiteDigital?: {
    aprovado: boolean;
    dataHora: string;
    responsavelCliente: string;
    ipOuHash?: string;
  };
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
  legenda: string;
  timestamp: string;
}

export interface TipoLaudoItemChecklist {
  id: string;
  descricao: string;
  status: 'conforme' | 'nao_conforme' | 'nao_aplicavel';
  observacao?: string;
  fotoUrl?: string;
}

export interface TipoLaudoSecaoPadrao {
  id: string;
  titulo: string;
  ordem: number;
  conteudoHtml?: string;
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
  conteudoHtml?: string;
  parecerTecnico?: string;
  recomendacoes?: string[];
  itens?: LaudoItemChecklist[];
  fotos?: EvidenciaFoto[];
  isFixa?: boolean;
}

export interface LaudoTemplate {
  id: string;
  tipoBase: string;
  nome: string;
  secoes: LaudoSecao[];
  criadoPorUid: string;
  criadoEm: string;
}

export type LaudoStatus = 'rascunho' | 'em_revisao' | 'finalizado';

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
  apresentacao?: string;
  metodologia?: string;
  normasReferencia?: string;
  conclusao?: string;
  checklist?: TipoLaudoItemChecklist[];
  tabelaNaoConformidades?: TabelaNaoConformidadeItem[];
  artArquivoUrl?: string;
  artNomeArquivo?: string;
  artDataHomologacao?: string;
  assinaturaDigital?: AssinaturaDigitalLaudo;
  assinaturaUrl?: string;
  resumoExecutivo?: string;
  secoes: LaudoSecao[];
  anexosFotos?: EvidenciaFoto[];
  hrnCalculoGeral?: HRNResult;
  usoIA: { chamadas: number };
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

// Aliases for component convenience
export type UsuarioPerfil = Usuario & {
  ativo?: boolean;
  crea?: string;
  clienteIdVinculado?: string;
};
export type SecaoLaudo = LaudoSecao;
export type ItemChecklist = LaudoItemChecklist;

