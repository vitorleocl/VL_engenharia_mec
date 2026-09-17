import { 
  ItemInspecaoMestre, 
  ConclusaoAutomaticaChecklist, 
  CriticidadeInspecao,
  ResultadoInspecaoMestre
} from '../../types';

export function calcularConclusaoAutomatica(itens: ItemInspecaoMestre[]): ConclusaoAutomaticaChecklist {
  let totalConforme = 0;
  let totalNaoConforme = 0;
  let totalNA = 0;
  let totalNaoEvidenciado = 0;
  let totalMedicoes = 0;

  let ncCriticas = 0;
  let ncAltas = 0;
  let ncMedias = 0;
  let ncBaixas = 0;
  let ncObservacoes = 0;

  const itensImpeditivos: {
    codigo: string;
    descricao: string;
    risco: string;
    recomendacao: string;
  }[] = [];

  const recomendacoesSet = new Set<string>();

  itens.forEach((it) => {
    if (it.resultado === 'CONFORME') {
      totalConforme++;
    } else if (it.resultado === 'NAO_CONFORME') {
      totalNaoConforme++;
      const crit: CriticidadeInspecao = it.detalhesNC?.criticidade || it.criticidadePadrao || 'Media';
      
      if (crit === 'Critica') {
        ncCriticas++;
        itensImpeditivos.push({
          codigo: it.codigo,
          descricao: it.descricao,
          risco: it.detalhesNC?.riscoAssociado || 'Risco grave e iminente de acidente ou colapso.',
          recomendacao: it.detalhesNC?.recomendacao || it.recomendacaoPadrao || 'Interrupção imediata da operação para adequação.'
        });
      } else if (crit === 'Alta') {
        ncAltas++;
      } else if (crit === 'Media') {
        ncMedias++;
      } else if (crit === 'Baixa') {
        ncBaixas++;
      } else {
        ncObservacoes++;
      }

      const rec = it.detalhesNC?.recomendacao || it.recomendacaoPadrao;
      if (rec) recomendacoesSet.add(rec);
    } else if (it.resultado === 'NA') {
      totalNA++;
    } else if (it.resultado === 'NAO_EVIDENCIADO') {
      totalNaoEvidenciado++;
    } else if (it.resultado === 'MEDICAO') {
      totalMedicoes++;
      // If there's a min/max defined and value is out of bounds, count as NC
      const med = it.campoMedicao;
      if (med && med.valorEncontrado !== undefined && med.valorEncontrado !== '') {
        const val = Number(med.valorEncontrado);
        const min = med.valorMinimo !== undefined ? Number(med.valorMinimo) : null;
        const max = med.valorMaximo !== undefined ? Number(med.valorMaximo) : null;
        if (!isNaN(val)) {
          if ((min !== null && val < min) || (max !== null && val > max)) {
            totalNaoConforme++;
            ncAltas++;
            if (it.recomendacaoPadrao) recomendacoesSet.add(it.recomendacaoPadrao);
          } else {
            totalConforme++;
          }
        } else {
          totalConforme++;
        }
      } else {
        totalConforme++;
      }
    }
  });

  const totalAvaliados = totalConforme + totalNaoConforme;
  const percentualConformidade = totalAvaliados > 0 
    ? Math.round((totalConforme / totalAvaliados) * 100) 
    : 100;

  // REGRA DE SEGURANÇA EXPRESSA:
  // "O percentual de conformidade não deve substituir a análise de risco.
  // Uma única não conformidade crítica poderá exigir recomendação de interdição, não liberação ou correção imediata, independentemente do percentual geral."
  let parecerSeguranca: 'LIBERADO' | 'LIBERADO_COM_RESTRICOES' | 'INTERDICAO_IMEDIATA' = 'LIBERADO';
  let justificativaRegraSeguranca = 'Todos os itens avaliados encontram-se em conformidade com as normas vigentes.';

  if (ncCriticas > 0) {
    parecerSeguranca = 'INTERDICAO_IMEDIATA';
    justificativaRegraSeguranca = `ATENÇÃO: Constatada(s) ${ncCriticas} Não Conformidade(s) de CRITICIDADE CRÍTICA. Pela Regra Normativa de Segurança, o percentual quantitativo de conformidade (${percentualConformidade}%) NÃO substitui a análise de risco qualitativa. Exige-se RECOMENDAÇÃO DE INTERDIÇÃO / NÃO LIBERAÇÃO IMEDIATA até a eliminação dos riscos impeditivos.`;
  } else if (ncAltas > 0 || totalNaoConforme > 0) {
    parecerSeguranca = 'LIBERADO_COM_RESTRICOES';
    justificativaRegraSeguranca = `Identificada(s) ${totalNaoConforme} Não Conformidade(s) de criticidade alta/média/baixa. Operação liberada sob condição de implementação do plano de ação corretiva nos prazos recomendados.`;
  }

  const necessidadeReinspecao = ncCriticas > 0 || ncAltas > 0;

  return {
    totalItensAvaliados: totalAvaliados + totalNA + totalNaoEvidenciado,
    totalConforme,
    totalNaoConforme,
    totalNA,
    totalNaoEvidenciado,
    totalMedicoes,
    ncCriticas,
    ncAltas,
    ncMedias,
    ncBaixas,
    ncObservacoes,
    percentualConformidade,
    itensImpeditivos,
    recomendacoesConsolidadas: Array.from(recomendacoesSet),
    necessidadeReinspecao,
    parecerSeguranca,
    justificativaRegraSeguranca
  };
}
