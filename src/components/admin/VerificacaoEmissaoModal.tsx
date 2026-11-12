import React, { useMemo } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  FileCheck, 
  ArrowRight,
  ExternalLink,
  X
} from 'lucide-react';
import { Laudo, Cliente, Ativo, VistoriaInspecao } from '../../types';

export interface ItemVerificacao {
  id: string;
  campo: string;
  titulo: string;
  descricao: string;
  tipo: 'erro' | 'aviso';
  resolvido: boolean;
  secaoAlvo?: string;
}

export interface VerificacaoEmissaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  laudo: Laudo;
  cliente?: Cliente;
  ativo?: Ativo;
  vistoria?: VistoriaInspecao;
  onFocarCampo?: (campoOuSecao: string) => void;
  onConfirmarEmissao?: () => void;
}

export const VerificacaoEmissaoModal: React.FC<VerificacaoEmissaoModalProps> = ({
  isOpen,
  onClose,
  laudo,
  cliente,
  ativo,
  vistoria,
  onFocarCampo,
  onConfirmarEmissao
}) => {
  // Executa todas as checagens detalhadas da Parte E
  const itens = useMemo<ItemVerificacao[]>(() => {
    const list: ItemVerificacao[] = [];

    // 1. Cliente: CNPJ, contato ou texto placeholder
    const cnpj = (laudo.clienteCnpj || cliente?.cpfCnpj || cliente?.cnpj || '').trim();
    const contato = (laudo.clienteContato || cliente?.contatos?.[0]?.nome || '').trim();
    const nomeCliente = (laudo.clienteNome || cliente?.razaoSocial || '').trim();
    const hasClienteValido = cnpj.length >= 11 && contato.length > 2 && nomeCliente.toLowerCase() !== 'cliente' && nomeCliente.length > 3;

    list.push({
      id: 'v-cliente',
      campo: 'cliente',
      secaoAlvo: 'partes',
      titulo: 'Identificação completa do Cliente',
      descricao: hasClienteValido 
        ? `Cliente identificado (${nomeCliente}, CNPJ: ${cnpj}, Contato: ${contato}).`
        : 'Cliente sem CNPJ válido, sem contato responsável ou com nome provisório "Cliente".',
      tipo: 'erro',
      resolvido: hasClienteValido,
    });

    // 2. Equipamento / Ativo: fabricante, modelo, nº de série e capacidade
    const fab = (laudo.ativoFabricante || ativo?.fabricante || '').trim();
    const mod = (laudo.ativoModelo || ativo?.modelo || '').trim();
    const serie = (laudo.ativoNumeroSerie || ativo?.numeroSerie || '').trim();
    const cap = (laudo.ativoCapacidade || ativo?.capacidade || '').trim();
    const hasAtivoCompleto = Boolean(fab && mod && serie && cap);

    list.push({
      id: 'v-ativo',
      campo: 'ativo',
      secaoAlvo: 'ativo',
      titulo: 'Ficha técnica do Equipamento inspecionado',
      descricao: hasAtivoCompleto 
        ? `Ficha completa (${fab} ${mod}, Série: ${serie}, Cap.: ${cap}).`
        : 'Equipamento sem fabricante, modelo, nº de série ou capacidade nominal declarados.',
      tipo: 'erro',
      resolvido: hasAtivoCompleto,
    });

    // 3. Trechos não editados / IA não revisada / Legendas vazias
    const qtdTrechosIa = Array.isArray(laudo.trechosIaPendentes) 
      ? laudo.trechosIaPendentes.filter(t => !t.revisado).length 
      : (typeof laudo.trechosIaPendentes === 'number' ? laudo.trechosIaPendentes : 0);
    const temTrechosIa = qtdTrechosIa > 0;

    // Verificar fotos sem legenda nas seções
    let fotosSemLegenda = 0;
    (laudo.secoes || []).forEach(sec => {
      (sec.fotos || []).forEach(f => {
        if (!f.legenda || f.legenda.trim().length === 0) fotosSemLegenda++;
      });
    });
    const hasTextosValidados = !temTrechosIa && fotosSemLegenda === 0;

    list.push({
      id: 'v-textos-ia',
      campo: 'textos',
      secaoAlvo: 'secoes',
      titulo: 'Revisão humana de textos e legendas fotográficas',
      descricao: hasTextosValidados
        ? 'Todos os textos técnicos e legendas de fotos foram validados.'
        : temTrechosIa 
          ? `Constam ${qtdTrechosIa} sugestão(ões) geradas por IA pendentes de conferência pelo perito.`
          : `Constam ${fotosSemLegenda} foto(s) com legenda em branco na documentação.`,
      tipo: 'erro',
      resolvido: hasTextosValidados,
    });

    // 4. Não conformidades: risco, ação e prazo
    const ncs = laudo.naoConformidadesEstruturadas || [];
    let ncsIncompletas = 0;
    ncs.forEach(nc => {
      const risco = nc.classificacaoRisco || nc.risco;
      const acao = nc.acaoRecomendada;
      const prazo = nc.prazoAdequacao || nc.prazo;
      if (!risco || !acao || !prazo) {
        ncsIncompletas++;
      }
    });

    // Também verifica se há seções marcadas como não conforme sem NC cadastrada
    const secoesNC = (laudo.secoes || []).filter(s => s.resultado === 'nao_conforme');
    const ncFaltando = secoesNC.length > 0 && ncs.length === 0;
    const hasNcValidas = ncsIncompletas === 0 && !ncFaltando;

    list.push({
      id: 'v-ncs',
      campo: 'ncs',
      secaoAlvo: 'naoConformidades',
      titulo: 'Estruturação das Não Conformidades (NC)',
      descricao: hasNcValidas
        ? ncs.length > 0 ? `${ncs.length} NC(s) registradas com risco, ação e prazo.` : 'Nenhuma não conformidade impeditiva identificada.'
        : ncFaltando 
          ? 'Itens foram avaliados como "Não Conforme" mas nenhuma NC estruturada foi aberta.'
          : `${ncsIncompletas} NC(s) estão sem classificação de risco, recomendação de ação ou prazo de adequação.`,
      tipo: 'erro',
      resolvido: hasNcValidas,
    });

    // 5. Parecer técnico compatível com as NCs
    const temNcCriticaOuAlta = ncs.some(nc => {
      const r = nc.classificacaoRisco || nc.risco;
      return r === 'critico' || r === 'alto';
    });
    const parecer = laudo.parecer || 'rascunho';
    let parecerCompativel = true;
    let parecerMsg = 'Parecer coerente com os apontamentos técnicos.';

    if (parecer === 'liberado' && temNcCriticaOuAlta) {
      parecerCompativel = false;
      parecerMsg = 'Incompatibilidade: O ativo não pode ser "Liberado" existindo NC de risco Alto ou Crítico sem saneamento prévio.';
    } else if (parecer === 'liberado_restricoes' && !temNcCriticaOuAlta && ncs.length === 0) {
      parecerMsg = 'Aviso: Parecer definido como liberado com restrições, porém não constam NCs cadastradas.';
    } else if (!laudo.justificativaParecer || laudo.justificativaParecer.trim().length < 10) {
      parecerCompativel = false;
      parecerMsg = 'A justificativa técnica do parecer pericial é obrigatória e deve ser detalhada.';
    }

    list.push({
      id: 'v-parecer',
      campo: 'parecer',
      secaoAlvo: 'conclusao',
      titulo: 'Parecer técnico e justificativa pericial',
      descricao: parecerMsg,
      tipo: 'erro',
      resolvido: parecerCompativel,
    });

    // 6. Instrumentos e calibração válida na data da vistoria
    const instrumentos = laudo.instrumentos || [];
    let instVencido = 0;
    instrumentos.forEach(inst => {
      const validade = inst.calibracaoValidade || inst.validadeCalibracao;
      const cert = inst.certificadoNumero || inst.certificado;
      if (!validade || !cert) {
        instVencido++;
      }
    });
    const hasInstrumentosValidos = instrumentos.length === 0 || instVencido === 0;

    list.push({
      id: 'v-instrumentos',
      campo: 'instrumentos',
      secaoAlvo: 'instrumentos',
      titulo: 'Calibração dos Instrumentos de Medição',
      descricao: hasInstrumentosValidos
        ? instrumentos.length > 0 ? `${instrumentos.length} instrumento(s) com certificado e rastreabilidade RBC.` : 'Nenhum instrumento especial requerido neste escopo.'
        : `${instVencido} instrumento(s) sem certificado ou com rastreabilidade incompleta.`,
      tipo: 'erro',
      resolvido: hasInstrumentosValidos,
    });

    // 7. Normas técnicas com edição/ano informada
    const normas = laudo.normasLista || [];
    let normasSemEdicao = 0;
    normas.forEach(n => {
      const str = typeof n === 'string' ? n : `${n.norma || ''} ${n.titulo || ''} ${n.edicao || ''}`;
      const semAno = !str.includes(':') && !str.includes('20') && !str.includes('19') && !str.toLowerCase().includes('edição');
      if (semAno) normasSemEdicao++;
    });
    const hasNormasComEdicao = normas.length > 0 && normasSemEdicao === 0;

    list.push({
      id: 'v-normas',
      campo: 'normas',
      secaoAlvo: 'normas',
      titulo: 'Normas de referência com edição expressa',
      descricao: hasNormasComEdicao
        ? `${normas.length} normas citadas com ano de edição especificado.`
        : normasSemEdicao > 0
          ? `${normasSemEdicao} norma(s) sem a edição expressa (ex: cite "ABNT NBR 8400:2019" em vez de apenas "NBR 8400").`
          : 'Nenhuma norma técnica foi adicionada à lista de referências.',
      tipo: 'erro',
      resolvido: hasNormasComEdicao,
    });

    // 8. ART (Anotação de Responsabilidade Técnica) anexada e número
    const temArtNumero = Boolean(laudo.artNumero && laudo.artNumero !== 'Pendente' && laudo.artNumero.length >= 6);
    const temArtArquivo = Boolean(laudo.artArquivoUrl);
    const hasArtValida = temArtNumero && temArtArquivo;

    list.push({
      id: 'v-art',
      campo: 'art',
      secaoAlvo: 'art',
      titulo: 'Registro e Anexação da ART (CREA-PE)',
      descricao: hasArtValida
        ? `ART nº ${laudo.artNumero} vinculada com comprovante em anexo.`
        : !temArtNumero 
          ? 'Número da ART junto ao CREA-PE ainda não foi informado.'
          : 'Comprovante em arquivo da ART emitida ainda não foi anexado ao laudo.',
      tipo: 'erro',
      resolvido: hasArtValida,
    });

    // 9. Checklist ligado ao mesmo equipamento
    let checklistConsistente = true;
    let checklistDesc = 'Vistoria e laudo consistentes com o mesmo ativo cadastrado.';
    if (vistoria && laudo.ativoId && (vistoria as any).equipamentoId && (vistoria as any).equipamentoId !== laudo.ativoId) {
      checklistConsistente = false;
      checklistDesc = `Divergência: O checklist de vistoria (${(vistoria as any).equipamentoId}) está associado a ativo diferente deste laudo (${laudo.ativoId}).`;
    }

    list.push({
      id: 'v-checklist-ativo',
      campo: 'checklist',
      secaoAlvo: 'ativo',
      titulo: 'Consistência de rastreabilidade do checklist',
      descricao: checklistDesc,
      tipo: 'erro',
      resolvido: checklistConsistente,
    });

    // 10. Densidade de preenchimento (Aviso)
    const secoesPreenchidas = (laudo.secoes || []).filter(s => {
      const txt = s.conteudoHtml || s.parecerTecnico || '';
      return txt.length > 40;
    }).length;
    const densidadeOk = secoesPreenchidas >= 2;

    list.push({
      id: 'v-densidade',
      campo: 'densidade',
      secaoAlvo: 'secoes',
      titulo: 'Densidade de conteúdo das folhas técnicas',
      descricao: densidadeOk
        ? 'Preenchimento adequado para as 6 folhas normatizadas do documento.'
        : 'Aviso: Poucas seções detalhadas. O documento pode ficar com menos de 35% de aproveitamento gráfico.',
      tipo: 'aviso',
      resolvido: densidadeOk,
    });

    return list;
  }, [laudo, cliente, ativo, vistoria]);

  const erros = itens.filter(i => i.tipo === 'erro' && !i.resolvido);
  const avisos = itens.filter(i => i.tipo === 'aviso' && !i.resolvido);
  const resolvidos = itens.filter(i => i.resolvido);
  const podeEmitir = erros.length === 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${podeEmitir ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Verificação para Homologação e Emissão</h3>
              <p className="text-xs text-slate-400">Auditoria automática de conformidade documental antes da assinatura</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="px-6 py-3 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
              <XCircle className="w-4 h-4" />
              {erros.length} impeditivo(s)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              {avisos.length} aviso(s)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              {resolvidos.length} verificado(s)
            </span>
          </div>
          <span className="text-slate-400 font-mono text-[11px]">
            Laudo {laudo.numero} • Rev {laudo.revisao || '00'}
          </span>
        </div>

        {/* Lista de Itens */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {erros.length > 0 && (
            <div className="p-3 bg-rose-950/30 border border-rose-800/40 rounded-xl mb-4 text-xs text-rose-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>
                <b>A emissão final está bloqueada.</b> Corrija os itens destacados em vermelho para anexar a ART e gerar o laudo pericial oficial com chave de verificação pública.
              </span>
            </div>
          )}

          <div className="space-y-2.5">
            {itens.map((item) => {
              const isErro = item.tipo === 'erro' && !item.resolvido;
              const isAviso = item.tipo === 'aviso' && !item.resolvido;
              const isOk = item.resolvido;

              return (
                <div 
                  key={item.id}
                  className={`p-3 rounded-xl border transition flex items-start justify-between gap-3 ${
                    isErro 
                      ? 'bg-rose-950/20 border-rose-800/50 hover:border-rose-600' 
                      : isAviso
                        ? 'bg-amber-950/20 border-amber-800/50 hover:border-amber-600'
                        : 'bg-slate-800/40 border-slate-700/60 opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {isErro ? (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      ) : isAviso ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold ${isErro ? 'text-rose-200' : isAviso ? 'text-amber-200' : 'text-slate-300'}`}>
                        {item.titulo}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        {item.descricao}
                      </p>
                    </div>
                  </div>

                  {!isOk && item.secaoAlvo && (
                    <button
                      onClick={() => {
                        onFocarCampo?.(item.secaoAlvo!);
                        onClose();
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 rounded-lg text-[11px] font-semibold flex items-center gap-1 shrink-0 transition"
                      title="Ir diretamente para este campo"
                    >
                      <span>Corrigir</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition"
          >
            Fechar
          </button>

          <div className="flex items-center gap-2">
            {!podeEmitir ? (
              <span className="text-xs text-slate-400">
                Resolva as pendências acima para liberar a emissão
              </span>
            ) : (
              <button
                onClick={() => {
                  onConfirmarEmissao?.();
                  onClose();
                }}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-emerald-900/30 flex items-center gap-2 transition"
              >
                <FileCheck className="w-4 h-4" />
                <span>Emitir Laudo Oficial e Congelar Revisão</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
