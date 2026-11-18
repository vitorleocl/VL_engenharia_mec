export interface CnaeAlvoProspeccao {
  codigo: string;
  descricao: string;
}

export interface SegmentoAlvoProspeccao {
  nome: string;
  cnaes: CnaeAlvoProspeccao[];
  palavras_chave: string[];
}

export interface ServicoProspeccao {
  id: string;
  nome: string;
  normas: string[];
  dor_do_cliente: string;
  segmentos_alvo: SegmentoAlvoProspeccao[];
  argumento_principal: string;
  cta: string;
}

export type LeadStatusProspeccao =
  | 'novo'
  | 'qualificado'
  | 'contatado'
  | 'respondeu'
  | 'reuniao'
  | 'proposta'
  | 'ganho'
  | 'perdido'
  | 'descartado';

export interface LeadServicoSugerido {
  servicoId: string;
  score: number;
  motivo: string;
}

export interface LeadHistoricoContato {
  id: string;
  canal: 'email' | 'whatsapp' | 'nota';
  data: string;
  resultado: 'rascunho' | 'enviado' | 'falhou' | 'respondeu' | 'optout' | 'nota';
  resumo: string;
  campanhaId?: string;
}

export interface LeadProspeccao {
  id: string;
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj?: string;
  cnae?: string;
  cnaesSecundarios?: string[];
  segmento?: string;
  porte?: string;
  municipio?: string;
  uf?: string;
  email?: string;
  telefone?: string;
  whatsapp?: string;
  telefoneE164?: string;
  telefoneTipo?: 'celular' | 'fixo' | 'desconhecido';
  site?: string;
  fonte: string;
  servicosSugeridos: LeadServicoSugerido[];
  score: number;
  status: LeadStatusProspeccao;
  historicoContatos: LeadHistoricoContato[];
  responsavel?: string;
  notas?: string;
  criadoEm: string;
  atualizadoEm?: string;
  baseLegal: {
    fundamento: 'legitimo_interesse';
    finalidade: string;
    fonte: string;
    registradoEm: string;
  };
  descartadoEm?: string;
}

export interface MensagemModeloProspeccao {
  id: string;
  servicoId: string;
  canal: 'email' | 'whatsapp';
  assunto?: string;
  corpoTexto: string;
  corpoHtml?: string;
  followUpTexto?: string;
  atualizadoEm: string;
}

export interface CampanhaProspeccao {
  id: string;
  nome: string;
  servicoIds: string[];
  canal: 'email' | 'whatsapp';
  modeloId?: string;
  leadIds: string[];
  status: 'rascunho' | 'aprovada' | 'ativa' | 'pausada' | 'encerrada';
  limiteDiario: number;
  janelaInicio: string;
  janelaFim: string;
  criadoEm: string;
  criadoPor: string;
  aprovadoEm?: string;
}

export interface EnvioProspeccao {
  id: string;
  leadId: string;
  campanhaId?: string;
  canal: 'email' | 'whatsapp';
  status: 'rascunho' | 'enviado' | 'falhou' | 'bounce' | 'simulado';
  assunto?: string;
  mensagem: string;
  criadoEm: string;
  enviadoEm?: string;
  erro?: string;
}

export interface SupressaoProspeccao {
  id: string;
  tipo: 'email' | 'telefone';
  chaveHash: string;
  motivo: string;
  origem: 'descadastro' | 'pedido_manual' | 'bounce';
  criadoEm: string;
}

export interface ConfigProspeccao {
  dryRun: boolean;
  limiteDiarioEmail: number;
  limiteDiarioWhatsApp: number;
  janelaInicio: string;
  janelaFim: string;
  diasSemana: number[];
  intervaloMinimoSegundos: number;
  intervaloMaximoSegundos: number;
  assinatura: string;
  cidadePadrao: string;
  providerWhatsapp: 'assistido' | 'cloud_api';
  atualizadoEm?: string;
}
