import { GuiaServicoId } from '../types';

export interface EntradasHvac {
  area: number;
  peDireito: number;
  pessoas: number;
  wSensivelPessoa: number;
  wLatentePessoa: number;
  equipamentosW: number;
  iluminacaoWm2: number;
  areaVidro: number;
  fatorSolar: number;
  uVidro: number;
  radiacaoSolar: number;
  temperaturaExterna: number;
  urExterna: number;
  temperaturaInterna: number;
  urInterna: number;
  areaParede: number;
  uParede: number;
  deltaTParede: number;
  areaCobertura: number;
  uCobertura: number;
  deltaTCobertura: number;
  arExternoPessoaLs: number;
  arExternoAreaLsM2: number;
  deltaTInsuflacao: number;
  margemPercentual: number;
  quantidadeDifusores: number;
}

export interface EntradasPpci {
  area: number;
  densidadeM2Pessoa: number;
  capacidadePassagem: number;
  numeroHidrantes: number;
  vazaoHidranteLMin: number;
  autonomiaMin: number;
  diametroInternoMm: number;
  coeficienteHazenWilliams: number;
  comprimentoEquivalenteM: number;
  desNivelM: number;
  pressaoResidualMca: number;
  massaCombustivelKg: number;
  poderCalorificoMjKg: number;
}

export interface EntradasNr12 {
  tempoParadaMs: number;
  tempoRespostaMs: number;
  capacidadeDeteccaoMm: number;
}

export interface EntradasNr13 {
  pressaoProjetoMpa: number;
  raioInternoMm: number;
  diametroInternoMm: number;
  tensaoAdmissivelMpa: number;
  eficienciaJunta: number;
  sobreEspessuraCorrosaoMm: number;
  espessuraMedidaMm: number;
  espessuraNominalMm: number;
  taxaCorrosaoMmAno: number;
  volumeM3: number;
  classeFluido: 'A' | 'B' | 'C' | 'D';
  razaoTensoesTeste: number;
}

export type EntradasGuia = EntradasHvac | EntradasPpci | EntradasNr12 | EntradasNr13;
export interface ResultadoGuia {
  tipo: GuiaServicoId;
  entradas: EntradasGuia;
  resultados: Record<string, string | number>;
  passos: string[];
}

export const EXEMPLOS_CALCULADORAS: Record<GuiaServicoId, EntradasGuia> = {
  hvac: {
    area: 60, peDireito: 2.7, pessoas: 12, wSensivelPessoa: 75, wLatentePessoa: 55,
    equipamentosW: 1440, iluminacaoWm2: 12, areaVidro: 8, fatorSolar: 0.55,
    uVidro: 5.7, radiacaoSolar: 500, temperaturaExterna: 33, urExterna: 60,
    temperaturaInterna: 24, urInterna: 50, areaParede: 12, uParede: 2,
    deltaTParede: 12, areaCobertura: 60, uCobertura: 1.5, deltaTCobertura: 10,
    arExternoPessoaLs: 2.5, arExternoAreaLsM2: 0.3, deltaTInsuflacao: 9,
    margemPercentual: 10, quantidadeDifusores: 8,
  },
  ppci: {
    area: 400, densidadeM2Pessoa: 3, capacidadePassagem: 100, numeroHidrantes: 2,
    vazaoHidranteLMin: 125, autonomiaMin: 60, diametroInternoMm: 62.7,
    coeficienteHazenWilliams: 120, comprimentoEquivalenteM: 85,
    desNivelM: 8, pressaoResidualMca: 20, massaCombustivelKg: 0, poderCalorificoMjKg: 0,
  },
  nr12: { tempoParadaMs: 120, tempoRespostaMs: 20, capacidadeDeteccaoMm: 30 },
  nr13: {
    pressaoProjetoMpa: 1.2, raioInternoMm: 400, diametroInternoMm: 800,
    tensaoAdmissivelMpa: 138, eficienciaJunta: 0.85, sobreEspessuraCorrosaoMm: 1.5,
    espessuraMedidaMm: 5.4, espessuraNominalMm: 6.35, taxaCorrosaoMmAno: 0.1, volumeM3: 1,
    classeFluido: 'D', razaoTensoesTeste: 1,
  },
};

function validarPositivo(nome: string, valor: number, podeSerZero = true): void {
  if (!Number.isFinite(valor) || (podeSerZero ? valor < 0 : valor <= 0)) {
    throw new Error(`${nome} deve ser ${podeSerZero ? 'maior ou igual a zero' : 'maior que zero'}.`);
  }
}

function razaoUmidade(temperaturaC: number, urPercentual: number): number {
  const pressaoSaturacaoKpa = 0.61078 * Math.exp((17.27 * temperaturaC) / (temperaturaC + 237.3));
  const pressaoVaporKpa = (urPercentual / 100) * pressaoSaturacaoKpa;
  const denominador = 101.325 - pressaoVaporKpa;
  if (denominador <= 0) throw new Error('Condições psicrométricas inválidas.');
  return (622 * pressaoVaporKpa) / denominador;
}

export function calcularHvac(entrada: EntradasHvac): ResultadoGuia {
  validarPositivo('Área', entrada.area, false);
  validarPositivo('Pé-direito', entrada.peDireito, false);
  validarPositivo('ΔT de insuflação', entrada.deltaTInsuflacao, false);
  validarPositivo('Quantidade de difusores', entrada.quantidadeDifusores, false);
  if (entrada.urExterna < 0 || entrada.urExterna > 100 || entrada.urInterna < 0 || entrada.urInterna > 100) throw new Error('Umidade relativa deve estar entre 0 e 100%.');

  const pessoasSensivel = entrada.pessoas * entrada.wSensivelPessoa;
  const pessoasLatente = entrada.pessoas * entrada.wLatentePessoa;
  const iluminacao = entrada.area * entrada.iluminacaoWm2;
  const vidroRadiacao = entrada.areaVidro * entrada.fatorSolar * entrada.radiacaoSolar;
  const deltaTVidro = Math.max(0, entrada.temperaturaExterna - entrada.temperaturaInterna);
  const vidroConducao = entrada.uVidro * entrada.areaVidro * deltaTVidro;
  const parede = entrada.uParede * entrada.areaParede * entrada.deltaTParede;
  const cobertura = entrada.uCobertura * entrada.areaCobertura * entrada.deltaTCobertura;
  const vazaoArExterno = (entrada.pessoas * entrada.arExternoPessoaLs + entrada.area * entrada.arExternoAreaLsM2) * 3.6;
  const arSensivel = 0.34 * vazaoArExterno * Math.max(0, entrada.temperaturaExterna - entrada.temperaturaInterna);
  const diferencaW = Math.max(0, razaoUmidade(entrada.temperaturaExterna, entrada.urExterna) - razaoUmidade(entrada.temperaturaInterna, entrada.urInterna));
  const arLatente = 0.83 * vazaoArExterno * diferencaW;
  const sensivelSala = pessoasSensivel + iluminacao + entrada.equipamentosW + vidroRadiacao + vidroConducao + parede + cobertura + arSensivel;
  const latenteSala = pessoasLatente + arLatente;
  const totalComMargemW = (sensivelSala + latenteSala) * (1 + entrada.margemPercentual / 100);
  // A vazão de insuflação refere-se à carga sensível da sala, sem somar
  // novamente a carga sensível do ar externo que já é tratado como renovação.
  const sensivelParaInsuflacao = sensivelSala - arSensivel;
  const vazaoInsuflacao = (sensivelParaInsuflacao * (1 + entrada.margemPercentual / 100)) / (0.34 * entrada.deltaTInsuflacao);
  const btuh = totalComMargemW * 3.412;
  const tr = totalComMargemW / 3517;

  return {
    tipo: 'hvac',
    entradas: entrada,
    resultados: {
      pessoasSensivelW: pessoasSensivel,
      pessoasLatenteW: pessoasLatente,
      iluminacaoW: iluminacao,
      equipamentosW: entrada.equipamentosW,
      vidroRadiacaoW: vidroRadiacao,
      vidroConducaoW: vidroConducao,
      paredeECoberturaW: parede + cobertura,
      vazaoArExternoM3h: vazaoArExterno,
      arExternoSensivelW: arSensivel,
      arExternoLatenteW: arLatente,
      cargaSensivelSalaW: sensivelSala,
      cargaLatenteSalaW: latenteSala,
      cargaTotalComMargemW: totalComMargemW,
      cargaTotalComMargemKw: totalComMargemW / 1000,
      capacidadeBtuh: btuh,
      capacidadeTr: tr,
      vazaoInsuflacaoM3h: vazaoInsuflacao,
      vazaoPorDifusorM3h: vazaoInsuflacao / entrada.quantidadeDifusores,
      difusoresExemplo: entrada.quantidadeDifusores,
      capacidadeComercialBtuh: Math.ceil(btuh / 12000) * 12000,
    },
    passos: [
      `Pessoas: ${entrada.pessoas} × ${entrada.wSensivelPessoa} W sensível e ${entrada.pessoas} × ${entrada.wLatentePessoa} W latente.`,
      `Vidro: radiação A × FS × I = ${vidroRadiacao.toFixed(0)} W; condução U × A × ΔT = ${vidroConducao.toFixed(0)} W.`,
      `Ar externo: ${vazaoArExterno.toFixed(1)} m³/h; ${arSensivel.toFixed(0)} W sensível e ${arLatente.toFixed(0)} W latente por psicrometria.`,
      `Total com margem: ${(totalComMargemW / 1000).toFixed(2)} kW; insuflação calculada sem somar novamente a carga sensível de renovação.`,
    ],
  };
}

export function calcularPpci(entrada: EntradasPpci): ResultadoGuia {
  validarPositivo('Área', entrada.area, false);
  validarPositivo('Densidade', entrada.densidadeM2Pessoa, false);
  validarPositivo('Capacidade de passagem', entrada.capacidadePassagem, false);
  validarPositivo('Diâmetro interno', entrada.diametroInternoMm, false);
  validarPositivo('Coeficiente Hazen-Williams', entrada.coeficienteHazenWilliams, false);
  const populacaoExata = entrada.area / entrada.densidadeM2Pessoa;
  const populacao = Math.ceil(populacaoExata);
  const unidadesPassagemExatas = populacao / entrada.capacidadePassagem;
  const unidadesPassagem = Math.ceil(unidadesPassagemExatas);
  const larguraCalculada = Math.max(1.1, unidadesPassagemExatas * 0.55);
  const larguraAdotada = Math.max(1.2, Math.ceil(larguraCalculada / 0.6) * 0.6);
  const vazaoLMin = entrada.numeroHidrantes * entrada.vazaoHidranteLMin;
  const vazaoM3s = vazaoLMin / 60000;
  const volumeReservaM3 = vazaoLMin * entrada.autonomiaMin / 1000;
  const diametroM = entrada.diametroInternoMm / 1000;
  const velocidade = vazaoM3s / (Math.PI * diametroM ** 2 / 4);
  const perdaUnitária = 10.65 * vazaoM3s ** 1.85
    / (entrada.coeficienteHazenWilliams ** 1.85 * diametroM ** 4.87);
  const perdaTrecho = perdaUnitária * entrada.comprimentoEquivalenteM;
  const alturaManometrica = entrada.desNivelM + perdaTrecho + entrada.pressaoResidualMca;
  const cargaIncendioEspecifica = entrada.area > 0
    ? entrada.massaCombustivelKg * entrada.poderCalorificoMjKg / entrada.area
    : 0;

  return {
    tipo: 'ppci',
    entradas: entrada,
    resultados: {
      populacao,
      unidadesPassagemExatas,
      unidadesPassagem,
      larguraCalculadaM: larguraCalculada,
      larguraAdotadaM: larguraAdotada,
      vazaoLMin,
      vazaoM3h: vazaoLMin * 0.06,
      volumeReservaM3,
      velocidadeMs: velocidade,
      perdaUnitáriaMPorM: perdaUnitária,
      perdaTrechoMca: perdaTrecho,
      alturaManometricaMca: alturaManometrica,
      cargaIncendioEspecificaMjM2: cargaIncendioEspecifica,
    },
    passos: [
      `População: ${entrada.area} / ${entrada.densidadeM2Pessoa} = ${populacaoExata.toFixed(1)}; adotada ${populacao} pessoas.`,
      `Passagens: ${populacao} / ${entrada.capacidadePassagem} = ${unidadesPassagemExatas.toFixed(2)}; adotar ${unidadesPassagem} unidade(s).`,
      `Reserva técnica: ${vazaoLMin} L/min × ${entrada.autonomiaMin} min = ${volumeReservaM3.toFixed(2)} m³.`,
      `Hazen-Williams: J = ${perdaUnitária.toFixed(4)} m/m; perda de trecho ${perdaTrecho.toFixed(2)} mca.`,
      'A ocupação, as larguras finais, a reserva e a pressão devem ser conferidas nas exigências vigentes do CBMPE e normas aplicáveis.',
    ],
  };
}

export function calcularNr12(entrada: EntradasNr12): ResultadoGuia {
  validarPositivo('Tempo de parada', entrada.tempoParadaMs);
  validarPositivo('Tempo de resposta', entrada.tempoRespostaMs);
  validarPositivo('Capacidade de detecção', entrada.capacidadeDeteccaoMm);
  const tempoTotalS = (entrada.tempoParadaMs + entrada.tempoRespostaMs) / 1000;
  const c = entrada.capacidadeDeteccaoMm <= 40
    ? Math.max(0, 8 * (entrada.capacidadeDeteccaoMm - 14))
    : 850;
  const distanciaComK2000 = 2000 * tempoTotalS + c;
  const k = distanciaComK2000 > 500 ? 1600 : 2000;
  const distancia = k * tempoTotalS + c;
  const distanciaComMinimoNormativo = Math.max(500, distancia);
  return {
    tipo: 'nr12',
    entradas: entrada,
    resultados: {
      tempoTotalS: tempoTotalS,
      compensacaoCmm: c,
      constanteKmmS: k,
      distanciaSegurancaMm: distancia,
      distanciaComMinimo500Mm: distanciaComMinimoNormativo,
    },
    passos: [
      `T = (${entrada.tempoParadaMs} + ${entrada.tempoRespostaMs}) / 1000 = ${tempoTotalS.toFixed(3)} s.`,
      `C = ${entrada.capacidadeDeteccaoMm} mm: ${c.toFixed(0)} mm.`,
      `K = ${k.toLocaleString('pt-BR')} mm/s; S calculada = K × T + C = ${distancia.toFixed(0)} mm. A referência também cita mínimo de 500 mm; valor mínimo considerado separadamente = ${distanciaComMinimoNormativo.toFixed(0)} mm. Confirme qual critério se aplica antes do projeto.`,
      'Válido como estimativa para aproximação perpendicular; confirme condições, limites e edição vigente da ISO 13855.',
    ],
  };
}

export function classificarGrupoRiscoNr13(produtoPressaoVolume: number): number {
  if (produtoPressaoVolume >= 100) return 1;
  if (produtoPressaoVolume >= 30) return 2;
  if (produtoPressaoVolume >= 2.5) return 3;
  if (produtoPressaoVolume >= 1) return 4;
  return 5;
}

export function calcularNr13(
  entrada: EntradasNr13,
  tabelaCategorias: Record<string, string> = {},
): ResultadoGuia {
  validarPositivo('Pressão de projeto', entrada.pressaoProjetoMpa, false);
  validarPositivo('Raio interno', entrada.raioInternoMm, false);
  validarPositivo('Diâmetro interno', entrada.diametroInternoMm, false);
  validarPositivo('Tensão admissível', entrada.tensaoAdmissivelMpa, false);
  validarPositivo('Eficiência da junta', entrada.eficienciaJunta, false);
  validarPositivo('Espessura medida', entrada.espessuraMedidaMm, false);
  validarPositivo('Espessura nominal', entrada.espessuraNominalMm, false);
  if (entrada.eficienciaJunta > 1) throw new Error('Eficiência da junta deve ser informada entre 0 e 1.');
  const p = entrada.pressaoProjetoMpa;
  const r = entrada.raioInternoMm;
  const d = entrada.diametroInternoMm;
  const se = entrada.tensaoAdmissivelMpa * entrada.eficienciaJunta;
  const denominadorCasco = se - 0.6 * p;
  const denominadorTampo = 2 * se - 0.2 * p;
  if (denominadorCasco <= 0 || denominadorTampo <= 0) throw new Error('Pressão e tensão admissível não produzem denominador válido.');
  const tCasco = p * r / denominadorCasco;
  const tTampo = p * d / denominadorTampo;
  const espessuraProjeto = tCasco + entrada.sobreEspessuraCorrosaoMm;
  const pmtaRecalculada = se * entrada.espessuraMedidaMm / (r + 0.6 * entrada.espessuraMedidaMm);
  const vidaRemanescente = entrada.taxaCorrosaoMmAno > 0
    ? (entrada.espessuraMedidaMm - tCasco) / entrada.taxaCorrosaoMmAno
    : Number.POSITIVE_INFINITY;
  const produtoPv = p * entrada.volumeM3;
  const grupoRisco = classificarGrupoRiscoNr13(produtoPv);
  const chaveCategoria = `${entrada.classeFluido}-${grupoRisco}`;
  const categoria = tabelaCategorias[chaveCategoria] || 'Não configurada';
  // Mantém explícitas as duas bases, pois o exemplo fornecido usa 1,3 × P
  // enquanto a instrução também cita PMTA. A escolha normativa é do PH.
  const testeSobrePressaoProjeto = 1.3 * p * entrada.razaoTensoesTeste;
  const testeSobrePmta = 1.3 * pmtaRecalculada * entrada.razaoTensoesTeste;

  return {
    tipo: 'nr13',
    entradas: entrada,
    resultados: {
      espessuraMinimaCascoMm: tCasco,
      espessuraMinimaTampoMm: tTampo,
      espessuraProjetoComCorrosaoMm: espessuraProjeto,
      espessuraNominalAdotadaMm: entrada.espessuraNominalMm,
      pmtaRecalculadaMpa: pmtaRecalculada,
      vidaRemanescenteAnos: vidaRemanescente,
      produtoPressaoVolume: produtoPv,
      grupoPotencialRisco: grupoRisco,
      categoriaNr13: categoria,
      testeHidrostatico1_3xPressaoProjetoMpa: testeSobrePressaoProjeto,
      testeHidrostatico1_3xPmtaMpa: testeSobrePmta,
      setpointValvulaSegurancaMpa: p,
    },
    passos: [
      `Casco: t = P × R / (S × E − 0,6 × P) = ${tCasco.toFixed(2)} mm.`,
      `Tampo 2:1: t = P × D / (2 × S × E − 0,2 × P) = ${tTampo.toFixed(2)} mm.`,
      `Com sobreespessura de corrosão: ${espessuraProjeto.toFixed(2)} mm.`,
      `Produto P × V = ${produtoPv.toFixed(2)} MPa·m³; grupo ${grupoRisco}; categoria pela tabela editável: ${categoria}.`,
      `Teste ilustrativo: 1,3 × P = ${testeSobrePressaoProjeto.toFixed(2)} MPa; 1,3 × PMTA recalculada = ${testeSobrePmta.toFixed(2)} MPa antes de eventual correção.`,
      'Confirme fórmulas, tensões, corrosão, teste, classe/categoria e limites na NR-13 e código de projeto vigentes, com avaliação do Profissional Habilitado.',
    ],
  };
}

export function calcularGuia(servico: GuiaServicoId, entradas: EntradasGuia, tabelaCategorias: Record<string, string> = {}): ResultadoGuia {
  if (servico === 'hvac') return calcularHvac(entradas as EntradasHvac);
  if (servico === 'ppci') return calcularPpci(entradas as EntradasPpci);
  if (servico === 'nr12') return calcularNr12(entradas as EntradasNr12);
  return calcularNr13(entradas as EntradasNr13, tabelaCategorias);
}
