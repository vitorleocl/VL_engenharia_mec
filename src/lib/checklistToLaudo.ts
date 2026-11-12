import {
  Ativo,
  ChecklistCampo,
  ChecklistCampoItem,
  ChecklistModeloServico,
  Cliente,
  EvidenciaFoto,
  Laudo,
  LaudoSecao,
  Orcamento,
  TipoLaudoItemChecklist,
} from '../types';

function normalizarRiscoNC(crit?: string): 'baixo' | 'medio' | 'alto' | 'critico' {
  switch ((crit || '').toLowerCase()) {
    case 'critica':
    case 'critico':
      return 'critico';
    case 'alta':
    case 'alto':
      return 'alto';
    case 'baixa':
    case 'baixo':
      return 'baixo';
    case 'media':
    case 'medio':
    default:
      return 'medio';
  }
}

function prazoPorRisco(risco: 'baixo' | 'medio' | 'alto' | 'critico'): string {
  switch (risco) {
    case 'critico':
      return 'Imediato (bloqueio antes de operar)';
    case 'alto':
      return 'Até 7 dias';
    case 'medio':
      return 'Até 30 dias';
    case 'baixo':
    default:
      return 'Até 60 dias';
  }
}

export function montarDadosLaudoDeChecklist(params: {
  checklist: ChecklistCampo;
  cliente?: Cliente;
  ativo?: Ativo;
  orcamento?: Orcamento;
  modelo?: ChecklistModeloServico;
}): Partial<Laudo> & { tipo: string; clienteId: string; ativoId: string } {
  const { checklist, cliente, ativo, orcamento, modelo } = params;

  const todosItens: ChecklistCampoItem[] = [
    ...(checklist.itens || []),
    ...(checklist.itensExtras || []),
  ];

  const ncsItens = todosItens.filter((i) => i.status === 'nao_conforme');

  let parecerSugerido: 'liberado' | 'liberado_restricoes' | 'nao_liberado' = 'liberado';
  if (ncsItens.length > 0) {
    const temAltoOuCritico = ncsItens.some((i) => {
      const r = normalizarRiscoNC(i.criticidade || i.naoConformidade?.criticidade);
      return r === 'alto' || r === 'critico';
    });
    parecerSugerido = temAltoOuCritico ? 'nao_liberado' : 'liberado_restricoes';
  }

  const totalVerificados = todosItens.length;
  const conformes = todosItens.filter((i) => i.status === 'conforme').length;
  const naoConformes = ncsItens.length;

  let justificativaParecer = '';
  if (parecerSugerido === 'liberado') {
    justificativaParecer = `${conformes} de ${totalVerificados} itens verificados em conformidade na vistoria ${checklist.numero}. Sem não conformidades registradas.`;
  } else if (parecerSugerido === 'liberado_restricoes') {
    justificativaParecer = `${naoConformes} não conformidade(s) de risco baixo/médio em ${totalVerificados} itens verificados (${checklist.numero}). Operação condicionada ao cumprimento do plano de ação.`;
  } else {
    justificativaParecer = `${naoConformes} não conformidade(s) incluindo risco alto/crítico em ${totalVerificados} itens verificados (${checklist.numero}). Equipamento não liberado até correção e reinspeção.`;
  }

  // Normas extraídas do modelo + itens
  const normasSet = new Set<string>();
  if (modelo?.norma) {
    modelo.norma.split('/').map((n) => n.trim()).filter(Boolean).forEach((n) => normasSet.add(n));
  }
  todosItens.forEach((it) => {
    if (it.criterioReferencia) {
      normasSet.add(it.criterioReferencia.trim());
    }
  });
  const normasLista = Array.from(normasSet).map((normaStr) => ({
    norma: normaStr,
    titulo: `Critério técnico normativo (${normaStr})`,
    edicao: 'Vigente',
  }));

  // Mapear não conformidades estruturadas (C4)
  let fotoGlobalCounter = 0;
  const fotoIdParaNumero = new Map<string, number>();

  todosItens.forEach((it) => {
    const fotosItem = (it.fotos && it.fotos.length > 0)
      ? it.fotos
      : (it.fotosUrls || []).map((url, idx) => ({ id: `${it.id}-f-${idx}`, url, legenda: `Foto do item` }));
    fotosItem.forEach((f) => {
      fotoGlobalCounter += 1;
      fotoIdParaNumero.set(f.id, fotoGlobalCounter);
    });
  });

  const naoConformidadesEstruturadas = ncsItens.map((nc, idx) => {
    const codigo = `NC-${String(idx + 1).padStart(2, '0')}`;
    const risco = normalizarRiscoNC(nc.criticidade || nc.naoConformidade?.criticidade);
    const primeiraFoto = nc.fotos?.[0];
    const fotoNum = primeiraFoto ? fotoIdParaNumero.get(primeiraFoto.id) : undefined;
    const itemNum = nc.numero || String(todosItens.findIndex((t) => t.id === nc.id) + 1);

    return {
      id: codigo,
      codigo,
      titulo: nc.descricao,
      item: nc.descricao,
      descricao: nc.observacao || nc.naoConformidade?.descricao || 'Não conformidade constatada em vistoria in loco.',
      risco,
      classificacaoRisco: risco,
      acaoRecomendada:
        nc.acaoRecomendada ||
        nc.naoConformidade?.recomendacao ||
        'Executar adequação técnica conforme norma de referência e enviar evidência ao responsável técnico.',
      prazo: nc.naoConformidade?.prazoRecomendado || prazoPorRisco(risco),
      prazoAdequacao: nc.naoConformidade?.prazoRecomendado || prazoPorRisco(risco),
      responsavel: 'Contratante / Manutenção',
      itemRef: `Checklist item ${itemNum}`,
      fotoRef: fotoNum ? `Foto ${fotoNum}` : 'Sem foto anexada',
    };
  });

  // Mapear checklist normativo plano para o laudo
  const checklistLaudo: TipoLaudoItemChecklist[] = todosItens.map((it) => ({
    id: it.id,
    descricao: it.numero ? `${it.numero} · ${it.descricao}` : it.descricao,
    criterioReferencia: it.criterioReferencia || it.referenciaNormativa || modelo?.norma || 'Norma aplicável',
    status:
      it.status === 'conforme' || it.status === 'nao_conforme' || it.status === 'nao_aplicavel'
        ? it.status
        : 'pendente',
    observacao: it.observacao || (it.medicao?.valorEncontrado !== undefined && it.medicao?.valorEncontrado !== '' ? `Medição: ${it.medicao.valorEncontrado} ${it.medicao.unidade || ''}`.trim() : '—'),
    valor: it.medicao?.valorEncontrado ?? it.valor ?? null,
    unidade: it.medicao?.unidade || it.unidade,
    fotosUrls: it.fotos?.map((f) => f.url) || it.fotosUrls,
  }));

  // Agrupar itens por secaoLaudo para gerar seções de constatações (B4 + C3)
  const gruposMap = new Map<string, ChecklistCampoItem[]>();
  todosItens.forEach((it) => {
    const nomeSecao = it.secaoLaudo?.trim() || 'Verificações Técnicas em Campo';
    const arr = gruposMap.get(nomeSecao) || [];
    arr.push(it);
    gruposMap.set(nomeSecao, arr);
  });

  const secoesLaudo: LaudoSecao[] = [];
  let ordemSecao = 1;
  gruposMap.forEach((itensGrupo, tituloGrupo) => {
    const temNC = itensGrupo.some((i) => i.status === 'nao_conforme');
    const todosNA = itensGrupo.every((i) => i.status === 'nao_aplicavel');
    const resultadoGrupo: LaudoSecao['resultado'] = temNC
      ? 'nao_conforme'
      : todosNA
      ? 'nao_aplicavel'
      : 'conforme';

    const normasGrupo = Array.from(
      new Set(itensGrupo.map((i) => i.criterioReferencia).filter(Boolean))
    ).join(' · ');

    const fotosGrupo: EvidenciaFoto[] = [];
    itensGrupo.forEach((it) => {
      if (it.fotos && it.fotos.length > 0) {
        it.fotos.forEach((f) => {
          fotosGrupo.push({
            id: f.id,
            url: f.url,
            legenda: f.legenda || f.titulo || it.descricao,
            titulo: f.titulo || f.legenda,
            timestamp: f.timestamp,
          });
        });
      } else if (it.fotosUrls && it.fotosUrls.length > 0) {
        it.fotosUrls.forEach((url, idx) => {
          fotosGrupo.push({
            id: `${it.id}-f-${idx}`,
            url,
            legenda: `${it.descricao} — Foto ${idx + 1}`,
          });
        });
      }
    });

    const medicoesGrupo = itensGrupo
      .filter((it) => it.medicao && it.medicao.valorEncontrado !== undefined && it.medicao.valorEncontrado !== '')
      .map((it) => ({
        componente: it.descricao,
        condicao: `${it.medicao?.valorEncontrado} ${it.medicao?.unidade || ''} (Ref.: ${it.medicao?.tolerancia || it.criterioReferencia || 'Norma'})`.trim(),
        parecer: it.status === 'nao_conforme' ? 'Não Conforme' : 'Conforme',
      }));

    // NC ligada caso haja
    const primeiroNCGrupo = itensGrupo.find((i) => i.status === 'nao_conforme');
    const ncCorrespondente = primeiroNCGrupo
      ? naoConformidadesEstruturadas.find((n) => n.titulo === primeiroNCGrupo.descricao)
      : undefined;

    // Monta HTML neutro com o que foi efetivamente registrado em campo (C5: sem afirmar conformidade indevida)
    const paragrafos = itensGrupo.map((it) => {
      const rotuloStatus =
        it.status === 'conforme'
          ? 'Conforme'
          : it.status === 'nao_conforme'
          ? 'Não conforme'
          : it.status === 'nao_aplicavel'
          ? 'Não aplicável'
          : 'Pendente';
      const obsHtml = it.observacao?.trim()
        ? ` — <em>${it.observacao.trim()}</em>`
        : it.status === 'conforme'
        ? ' — Verificação realizada em campo sem registro de anomalia.'
        : ' — <span class="pend">[a preencher]</span>';
      return `<li><strong>${it.numero ? `${it.numero} ` : ''}${it.descricao}</strong> (${rotuloStatus})${obsHtml}</li>`;
    });

    secoesLaudo.push({
      id: `sec-chk-${checklist.id}-${ordemSecao}`,
      titulo: tituloGrupo,
      ordem: ordemSecao,
      tipo: 'corpo_tecnico',
      resultado: resultadoGrupo,
      criterioReferencia: normasGrupo || modelo?.norma || 'Normas técnicas vigentes',
      ncCodigo: ncCorrespondente?.id,
      origemChecklistItem: itensGrupo.map((i) => i.numero || i.id).join(', '),
      conteudoHtml: `<p>Constatações técnicas registradas na vistoria ${checklist.numero} para o ativo <strong>${ativo?.identificacao || checklist.ativoIdentificacao || 'Equipamento'}</strong>:</p><ul>${paragrafos.join('')}</ul>`,
      itens: itensGrupo.map((it) => ({
        id: it.id,
        requisito: it.descricao,
        normaRef: it.criterioReferencia,
        status: it.status as any,
        gravidade: it.criticidade as any,
        observacao: it.observacao,
        fotos: it.fotos,
      })),
      fotos: fotosGrupo,
      medicoes: medicoesGrupo,
      isObrigatoria: true,
    });

    ordemSecao += 1;
  });

  const dataVistoriaIso = (checklist.dataPreenchimento || checklist.criadoEm || new Date().toISOString()).slice(0, 10);
  const proxAnoDate = new Date(dataVistoriaIso);
  proxAnoDate.setFullYear(proxAnoDate.getFullYear() + 1);
  const proximaInspecaoData = !isNaN(proxAnoDate.getTime())
    ? proxAnoDate.toLocaleDateString('pt-BR')
    : '';

  const enderecoCliente = cliente?.endereco?.cidade
    ? `${cliente.endereco.logradouro ? cliente.endereco.logradouro + ', ' : ''}${cliente.endereco.numero ? cliente.endereco.numero + ' - ' : ''}${cliente.endereco.cidade}/${cliente.endereco.estado || 'PE'}`
    : '';

  return {
    tipo: checklist.tipoLaudoNome || modelo?.nome || 'Laudo Técnico de Engenharia Mecânica',
    tipoLaudoId: checklist.tipoLaudoId,
    categoriaId: checklist.categoriaLaudo,
    clienteId: checklist.clienteId,
    clienteNome: cliente?.razaoSocial || cliente?.nomeFantasia || checklist.clienteNome || 'Cliente Contratante',
    clienteCnpj: cliente?.cpfCnpj || cliente?.cnpj || checklist.clienteCnpj || '',
    clienteContato: cliente?.contatos?.[0]?.nome || '',
    clienteContatoCargo: cliente?.contatos?.[0]?.cargo || '',
    clienteContatoTelefone: cliente?.contatos?.[0]?.telefone || '',
    clienteContatoEmail: cliente?.contatos?.[0]?.email || '',
    clienteEndereco: enderecoCliente,
    ativoId: checklist.ativoId,
    ativoIdentificacao: ativo?.identificacao || checklist.ativoIdentificacao || 'Ativo',
    ativoFabricante: ativo?.fabricante || '',
    ativoModelo: ativo?.modelo || '',
    ativoNumeroSerie: ativo?.numeroSerie || ativo?.chassi || '',
    ativoCapacidade: ativo?.capacidade || '',
    ativoAno: typeof ativo?.ano === 'number' ? ativo.ano : undefined,
    orcamentoOrigemId: checklist.vinculadoAOrcamentoId || undefined,
    orcamentoNumero: orcamento?.codigoProposta || undefined,
    checklistCampoOrigemId: checklist.id,
    layoutVersao: 'novo-2026',
    revisao: '00',
    dataInspecao: dataVistoriaIso,
    localVistoria: checklist.geolocalizacao?.enderecoAproximado || enderecoCliente,
    acompanhanteVistoria: cliente?.contatos?.[0]?.nome || '',
    acompanhanteCargo: cliente?.contatos?.[0]?.cargo || '',
    responsavelNome: checklist.responsavelNome || 'Eng. Vitor Leonardo Cordeiro Linhares',
    responsavelCrea: checklist.responsavelCrea || 'CREA-PE 182229949-0',
    metodo: `Vistoria técnica presencial (${checklist.numero}), verificação normativa de campo, registros fotográficos e análise dimensional/funcional.`,
    normasReferencia: modelo?.norma || 'Normas Regulamentadoras MTE / ABNT NBR',
    normasLista,
    parecer: parecerSugerido,
    justificativaParecer,
    proximaInspecaoData,
    premissasLimitacoes:
      'Avaliação restrita às partes visíveis e acessíveis durante a inspeção técnica em campo. Não foram realizados ensaios destrutivos além dos registrados neste documento.',
    checklist: checklistLaudo,
    naoConformidadesEstruturadas,
    secoes: secoesLaudo,
    resumoExecutivo: `Vistoria técnica (${checklist.numero}) em ${ativo?.identificacao || checklist.ativoIdentificacao || 'ativo'} realizada em ${new Date(dataVistoriaIso).toLocaleDateString('pt-BR')}. Conformes: ${conformes} / Não conformes: ${naoConformes}.`,
    status: 'rascunho',
    artNumero: '',
  };
}
