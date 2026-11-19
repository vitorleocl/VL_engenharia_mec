import assert from 'node:assert/strict';
import { test } from 'node:test';
import { incluirChecklistCaminhaoPipa, ServicoItem } from './servicosCatalogo';

test('inclui o checklist sanitário de caminhão-pipa em catálogo persistido antigo', () => {
  const catalogoAntigo: ServicoItem[] = [{
    id: 'outro-servico',
    nome: 'Outro serviço',
    norma: 'ABNT',
    descricao: 'Mantido sem alterações',
    subtipos: [],
  }];

  const atualizado = incluirChecklistCaminhaoPipa(catalogoAntigo);
  const servico = atualizado.find((item) => item.id === 'integridade-implementos-frota');
  const subtipo = servico?.subtipos.find((item) => item.id === 'laudo-conformidade-sanitaria-caminhao-pipa');

  assert.ok(servico);
  assert.equal(subtipo?.nome, 'Laudo Técnico de Conformidade Sanitária de Caminhão-Pipa');
  assert.equal(subtipo?.checklistSugerido?.length, 32);
  assert.ok(subtipo?.checklistSugerido?.some((item) => item.startsWith('[A1] Plaqueta do fabricante')));
  assert.ok(subtipo?.checklistSugerido?.some((item) => item.startsWith('[F4] Ponto de coleta de amostra')));
  assert.ok(!subtipo?.checklistSugerido?.some((item) => item.includes('cloro residual livre')));
  assert.equal(atualizado.find((item) => item.id === 'outro-servico')?.descricao, 'Mantido sem alterações');
});

test('não duplica o modelo ao sincronizar o catálogo mais de uma vez', () => {
  const umaVez = incluirChecklistCaminhaoPipa([]);
  const duasVezes = incluirChecklistCaminhaoPipa(umaVez);

  assert.equal(duasVezes.filter((item) => item.id === 'integridade-implementos-frota').length, 1);
  assert.equal(duasVezes[0].subtipos.filter((item) => item.id === 'laudo-conformidade-sanitaria-caminhao-pipa').length, 1);
});
