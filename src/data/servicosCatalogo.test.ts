import assert from 'node:assert/strict';
import { test } from 'node:test';
import { incluirChecklistCaminhaoPipa, SERVICOS_LISTA, ServicoItem } from './servicosCatalogo';
import { CHECKLISTS_CATALOGO_MARKDOWN } from './checklistsCatalogoMarkdown';

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

test('substitui os roteiros antigos pelos itens e critérios do catálogo Markdown', () => {
  const servicoIncendio = SERVICOS_LISTA.find((item) => item.id === 'combate-incendio-cbm');
  const inspecao = servicoIncendio?.subtipos.find((item) => item.id === 'incendio-inspecao-sistemas');
  const primeiroItem = inspecao?.checklistDetalhado?.[0];

  assert.equal(inspecao?.checklistSugerido?.length, 9);
  assert.equal(primeiroItem?.numero, '1.1.1');
  assert.equal(primeiroItem?.item, 'Projeto aprovado e documentação');
  assert.equal(primeiroItem?.criterio, 'Projeto e memorial disponíveis e compatíveis com o que está instalado');
});

test('todos os 50 roteiros do Markdown estão associados a um subtipo do catálogo', () => {
  const idsSubtipos = new Set(SERVICOS_LISTA.flatMap((servico) => servico.subtipos.map((subtipo) => subtipo.id)));
  const idsSemServico = Object.keys(CHECKLISTS_CATALOGO_MARKDOWN).filter((id) => !idsSubtipos.has(id));
  const totalItens = Object.values(CHECKLISTS_CATALOGO_MARKDOWN)
    .reduce((total, secao) => total + secao.items.length, 0);

  assert.equal(Object.keys(CHECKLISTS_CATALOGO_MARKDOWN).length, 50);
  assert.equal(totalItens, 416);
  assert.deepEqual(idsSemServico, []);
});

test('atualiza catálogo persistido antigo sem afetar serviços não correspondentes', () => {
  const antigo: ServicoItem[] = [{
    id: 'combate-incendio-cbm',
    nome: 'Sistemas de Combate a Incêndio e CBM',
    norma: 'CBMPE',
    descricao: 'Descrição customizada mantida',
    subtipos: [{
      id: 'incendio-inspecao-sistemas',
      nome: 'Inspeção de Sistemas de Combate a Incêndio',
      normaRef: 'norma antiga',
      detalhe: 'detalhe antigo',
      checklistSugerido: ['Item antigo'],
    }],
  }];
  const sincronizado = incluirChecklistCaminhaoPipa(antigo);
  const subtype = sincronizado[0].subtipos[0];

  assert.equal(subtype.checklistSugerido?.length, 9);
  assert.ok(subtype.checklistSugerido?.[0].startsWith('[1.1.1]'));
  assert.equal(subtype.checklistDetalhado?.[0].criterio, 'Projeto e memorial disponíveis e compatíveis com o que está instalado');
  assert.equal(sincronizado[0].descricao, 'Descrição customizada mantida');
});
