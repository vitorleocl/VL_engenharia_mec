import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calcularHvac,
  calcularNr12,
  calcularNr13,
  calcularPpci,
  EXEMPLOS_CALCULADORAS,
} from './calculadorasGuia';

test('HVAC-R: reproduz a sala de escritório ilustrativa', () => {
  const resultado = calcularHvac(EXEMPLOS_CALCULADORAS.hvac as Parameters<typeof calcularHvac>[0]);
  assert.equal(resultado.resultados.pessoasSensivelW, 900);
  assert.equal(resultado.resultados.pessoasLatenteW, 660);
  assert.equal(resultado.resultados.iluminacaoW, 720);
  assert.equal(resultado.resultados.equipamentosW, 1440);
  assert.equal(resultado.resultados.vidroRadiacaoW, 2200);
  assert.ok(Math.abs(Number(resultado.resultados.vidroConducaoW) - 410.4) < 0.1);
  assert.ok(Math.abs(Number(resultado.resultados.vazaoArExternoM3h) - 172.8) < 0.01);
  assert.ok(Math.abs(Number(resultado.resultados.arExternoSensivelW) - 529) < 1);
  assert.ok(Math.abs(Number(resultado.resultados.arExternoLatenteW) - 1406) < 1);
  assert.ok(Math.abs(Number(resultado.resultados.cargaTotalComMargemKw) - 10.4) < 0.1);
  assert.ok(Math.abs(Number(resultado.resultados.capacidadeBtuh) - 35500) < 100);
  assert.ok(Math.abs(Number(resultado.resultados.capacidadeTr) - 3) < 0.1);
  assert.ok(Math.abs(Number(resultado.resultados.vazaoInsuflacaoM3h) - 2465) < 1);
});

test('PPCI: reproduz a loja térrea ilustrativa', () => {
  const resultado = calcularPpci(EXEMPLOS_CALCULADORAS.ppci as Parameters<typeof calcularPpci>[0]);
  assert.equal(resultado.resultados.populacao, 134);
  assert.ok(Math.abs(Number(resultado.resultados.unidadesPassagemExatas) - 1.34) < 0.001);
  assert.equal(resultado.resultados.unidadesPassagem, 2);
  assert.equal(resultado.resultados.larguraCalculadaM, 1.1);
  assert.equal(resultado.resultados.larguraAdotadaM, 1.2);
  assert.equal(resultado.resultados.vazaoLMin, 250);
  assert.equal(resultado.resultados.volumeReservaM3, 15);
  assert.ok(Math.abs(Number(resultado.resultados.velocidadeMs) - 1.35) < 0.01);
  assert.ok(Math.abs(Number(resultado.resultados.perdaUnitáriaMPorM) - 0.043) < 0.001);
  assert.ok(Math.abs(Number(resultado.resultados.perdaTrechoMca) - 3.7) < 0.1);
  assert.ok(Math.abs(Number(resultado.resultados.alturaManometricaMca) - 32) < 0.5);
  assert.equal(resultado.resultados.cargaIncendioEspecificaMjM2, 0);
});

test('NR-12: reproduz distância de segurança ilustrativa', () => {
  const resultado = calcularNr12(EXEMPLOS_CALCULADORAS.nr12 as Parameters<typeof calcularNr12>[0]);
  assert.equal(resultado.resultados.tempoTotalS, 0.14);
  assert.equal(resultado.resultados.compensacaoCmm, 128);
  assert.equal(resultado.resultados.constanteKmmS, 2000);
  assert.equal(resultado.resultados.distanciaSegurancaMm, 408);
  assert.equal(resultado.resultados.distanciaComMinimo500Mm, 500);
});

test('NR-13: reproduz espessuras, PMTA, grupo e teste ilustrativos', () => {
  const resultado = calcularNr13(EXEMPLOS_CALCULADORAS.nr13 as Parameters<typeof calcularNr13>[0], { 'D-4': 'V' });
  assert.ok(Math.abs(Number(resultado.resultados.produtoPressaoVolume) - 1.2) < 0.001);
  assert.equal(resultado.resultados.grupoPotencialRisco, 4);
  assert.equal(resultado.resultados.categoriaNr13, 'V');
  assert.ok(Math.abs(Number(resultado.resultados.espessuraMinimaCascoMm) - 4.12) < 0.01);
  assert.ok(Math.abs(Number(resultado.resultados.espessuraMinimaTampoMm) - 4.10) < 0.01);
  assert.ok(Math.abs(Number(resultado.resultados.espessuraProjetoComCorrosaoMm) - 5.62) < 0.02);
  assert.equal(resultado.resultados.espessuraNominalAdotadaMm, 6.35);
  assert.ok(Math.abs(Number(resultado.resultados.pmtaRecalculadaMpa) - 1.57) < 0.02);
  assert.ok(Math.abs(Number(resultado.resultados.vidaRemanescenteAnos) - 12.8) < 0.1);
  assert.ok(Math.abs(Number(resultado.resultados.testeHidrostatico1_3xPressaoProjetoMpa) - 1.56) < 0.001);
});
