import React from 'react';
import { NormalizedProposta } from '../../lib/propostaNovoLayout';
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, X, Printer, ShieldCheck } from 'lucide-react';

export interface ValidacaoItem {
  id: string;
  categoria: 'obrigatorio' | 'consistencia' | 'qualidade';
  titulo: string;
  descricao: string;
  status: 'pass' | 'warning' | 'error';
  detalhes?: string;
}

interface PropostaValidacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposta: NormalizedProposta | null;
  onConfirmarImpressao: () => void;
}

export const PropostaValidacaoModal: React.FC<PropostaValidacaoModalProps> = ({
  isOpen,
  onClose,
  proposta,
  onConfirmarImpressao,
}) => {
  if (!isOpen || !proposta) return null;

  // Realizar auditoria completa dos dados
  const itensValidacao: ValidacaoItem[] = [];

  // 1. Campos obrigatórios
  const cnpjVlVazio = !proposta.contratada.cnpj || proposta.contratada.cnpj.includes('incluir CNPJ');
  itensValidacao.push({
    id: 'cnpj-vl',
    categoria: 'obrigatorio',
    titulo: 'CNPJ da Contratada (VL Engenharia)',
    descricao: cnpjVlVazio ? 'CNPJ da VL está pendente ou não preenchido' : `CNPJ da VL configurado: ${proposta.contratada.cnpj}`,
    status: cnpjVlVazio ? 'error' : 'pass',
    detalhes: cnpjVlVazio ? 'O campo contratada.cnpj é obrigatório em todas as folhas da proposta.' : undefined,
  });

  const emailClienteVazio = !proposta.contratante.email || proposta.contratante.email === 'Não informado';
  itensValidacao.push({
    id: 'email-cliente',
    categoria: 'obrigatorio',
    titulo: 'E-mail do Cliente (Contratante)',
    descricao: emailClienteVazio ? 'E-mail do cliente não informado no cadastro' : `E-mail: ${proposta.contratante.email}`,
    status: emailClienteVazio ? 'warning' : 'pass',
    detalhes: emailClienteVazio ? 'Recomendado para envio do laudo conclusivo e homologação digital da ART.' : undefined,
  });

  // 2. Textos de interface ou placeholders não substituídos
  const placeholdersDetectados: string[] = [];
  const textosParaVerificar = [
    proposta.servico,
    proposta.escopoResumo,
    proposta.ativosResumoTexto,
    ...proposta.incluso,
    ...proposta.foraDoEscopo,
  ];

  const padroesPlaceholder = [
    'você pode inserir fotos',
    '[Nome]',
    'conforme especificação do cliente',
    'todo',
    'exemplo',
    'lorem ipsum',
  ];

  for (const texto of textosParaVerificar) {
    if (!texto) continue;
    for (const padrao of padroesPlaceholder) {
      if (texto.toLowerCase().includes(padrao.toLowerCase()) && !placeholdersDetectados.includes(padrao)) {
        placeholdersDetectados.push(padrao);
      }
    }
  }

  itensValidacao.push({
    id: 'placeholders',
    categoria: 'qualidade',
    titulo: 'Textos de Editor / Placeholders',
    descricao: placeholdersDetectados.length > 0 
      ? `Detectados termos padrão que devem ser revisados: "${placeholdersDetectados.join('", "')}"`
      : 'Nenhum texto de interface do editor encontrado no escopo',
    status: placeholdersDetectados.length > 0 ? 'warning' : 'pass',
  });

  // 3. Soma do Memorial vs Valor Total
  itensValidacao.push({
    id: 'soma-memorial',
    categoria: 'consistencia',
    titulo: 'Memorial de Cálculo vs Investimento Total',
    descricao: proposta.somaBateComTotal
      ? `Soma dos itens R$ ${proposta.subtotalCalculado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} coincide exatamente com o valor total.`
      : `Divergência matemática: soma dos itens do memorial (R$ ${proposta.subtotalCalculado.toFixed(2)}) difere do total global (R$ ${proposta.valorTotal.toFixed(2)}).`,
    status: proposta.somaBateComTotal ? 'pass' : 'error',
    detalhes: !proposta.somaBateComTotal ? 'Ajuste os valores unitários ou a quantidade no memorial de cálculo.' : undefined,
  });

  // 4. Soma das Parcelas
  itensValidacao.push({
    id: 'soma-parcelas',
    categoria: 'consistencia',
    titulo: 'Distribuição das Parcelas de Pagamento',
    descricao: proposta.somaParcelasBate
      ? `As ${proposta.parcelas.length} parcelas somam exatamente 100% do valor total.`
      : 'A soma das parcelas difere do investimento global da proposta.',
    status: proposta.somaParcelasBate ? 'pass' : 'error',
  });

  // 5. Validação do PIX EMV e CRC16
  itensValidacao.push({
    id: 'pix-crc',
    categoria: 'obrigatorio',
    titulo: 'Padrão Oficial PIX BR Code & Checksum CRC16',
    descricao: proposta.pix.crcValido
      ? `Código Copia e Cola gerado com sucesso no padrão EMV com CRC16-CCITT-FALSE verificado.`
      : 'Código PIX com checksum CRC16 ou formato EMV inválido.',
    status: proposta.pix.crcValido ? 'pass' : 'error',
  });

  // 6. Validade da Proposta
  itensValidacao.push({
    id: 'validade',
    categoria: 'consistencia',
    titulo: 'Prazo de Validade Comercial',
    descricao: proposta.estaVencida
      ? `Proposta com validade vencida em ${proposta.validaAte}. Recomenda-se atualizar a data de emissão.`
      : `Proposta válida até ${proposta.validaAte} (${proposta.validadeDias} dias corridos a partir da emissão).`,
    status: proposta.estaVencida ? 'warning' : 'pass',
  });

  // 7. Densidade e preenchimento da proposta
  const temAtivosDefinidos = proposta.ativos.length > 0;
  itensValidacao.push({
    id: 'preenchimento',
    categoria: 'qualidade',
    titulo: 'Preenchimento e Relação de Ativos',
    descricao: temAtivosDefinidos
      ? `${proposta.totalAtivosQtd} ativo(s) devidamente mapeado(s) com memorial correspondente.`
      : 'Nenhum ativo associado à proposta. Folha 2 pode apresentar baixa densidade.',
    status: temAtivosDefinidos ? 'pass' : 'warning',
  });

  const erros = itensValidacao.filter(i => i.status === 'error');
  const avisos = itensValidacao.filter(i => i.status === 'warning');
  const sucessos = itensValidacao.filter(i => i.status === 'pass');

  const podeExportar = erros.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Checklist de Validação Pré-Impressão
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {proposta.codigo} • Rev. {proposta.revisao} • Modo {proposta.modo === 'executiva' ? 'Executiva (4 folhas)' : 'Completo (6 folhas)'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resumo dos status */}
        <div className="grid grid-cols-3 gap-3 p-6 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900">
          <div className="p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-medium text-emerald-800 dark:text-emerald-300">Conformes</div>
              <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{sucessos.length} itens</div>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-amber-100 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-medium text-amber-800 dark:text-amber-300">Avisos</div>
              <div className="text-lg font-bold text-amber-700 dark:text-amber-400">{avisos.length} alertas</div>
            </div>
          </div>

          <div className={`p-3 rounded-xl border ${erros.length > 0 ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'} flex items-center gap-3`}>
            <XCircle className={`w-5 h-5 ${erros.length > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'} shrink-0`} />
            <div>
              <div className={`text-xs font-medium ${erros.length > 0 ? 'text-rose-800 dark:text-rose-300' : 'text-slate-600 dark:text-slate-400'}`}>Erros Bloqueantes</div>
              <div className={`text-lg font-bold ${erros.length > 0 ? 'text-rose-700 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>{erros.length} erros</div>
            </div>
          </div>
        </div>

        {/* Lista de itens verificados */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {itensValidacao.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border transition-all ${
                item.status === 'error'
                  ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20'
                  : item.status === 'warning'
                  ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/15'
                  : 'border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-800/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {item.status === 'error' && <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
                  {item.status === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                  {item.status === 'pass' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {item.titulo}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      item.status === 'error'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                        : item.status === 'warning'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                    }`}>
                      {item.status === 'error' ? 'Bloqueante' : item.status === 'warning' ? 'Atenção' : 'Aprovado'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.descricao}
                  </p>
                  {item.detalhes && (
                    <div className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
                      → {item.detalhes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer com ações */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition"
          >
            Fechar e Editar Dados
          </button>

          <button
            onClick={() => {
              onClose();
              onConfirmarImpressao();
            }}
            disabled={!podeExportar}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-sm transition ${
              podeExportar
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-95'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>{podeExportar ? 'Prosseguir para Impressão / PDF' : 'Corrija os erros para imprimir'}</span>
            {podeExportar && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
