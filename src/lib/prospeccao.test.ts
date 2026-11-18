import assert from 'node:assert/strict';
import { test } from 'node:test';
import { deduplicarLeads, normalizarTelefoneProspeccao, parseCsv, sugerirServicos } from './prospeccao';
import { dentroJanelaComercial, estaSuprimido, limiteDiarioAtingido } from './prospeccaoPolicy';
import { LeadProspeccao, ServicoProspeccao } from '../types/prospeccao';

const service: ServicoProspeccao = {
  id: 'nr12',
  nome: 'Adequação NR-12',
  normas: ['NR-12'],
  dor_do_cliente: 'Máquinas',
  segmentos_alvo: [{
    nome: 'Metalurgia',
    cnaes: [{ codigo: '2511000', descricao: 'Fabricação de estruturas metálicas' }],
    palavras_chave: ['metalúrgica', 'serralheria'],
  }],
  argumento_principal: 'Avaliação técnica',
  cta: 'Podemos conversar?',
};

const lead = (id: string, patch: Partial<LeadProspeccao> = {}): LeadProspeccao => ({
  id,
  razaoSocial: 'Metalúrgica Recife Ltda',
  cnpj: '12345678000190',
  cnae: '2511000',
  segmento: 'metalúrgica',
  fonte: 'CSV',
  servicosSugeridos: [],
  score: 0,
  status: 'novo',
  historicoContatos: [],
  criadoEm: '2026-01-01T00:00:00.000Z',
  baseLegal: {
    fundamento: 'legitimo_interesse',
    finalidade: 'Prospecção B2B',
    fonte: 'CSV',
    registradoEm: '2026-01-01T00:00:00.000Z',
  },
  ...patch,
});

test('normaliza números brasileiros para E.164 e identifica celular/fixo', () => {
  assert.deepEqual(normalizarTelefoneProspeccao('(81) 98444-2592'), { e164: '+5581984442592', tipo: 'celular' });
  assert.deepEqual(normalizarTelefoneProspeccao('8133334444'), { e164: '+558133334444', tipo: 'fixo' });
  assert.equal(normalizarTelefoneProspeccao('123').e164, null);
});

test('deduplica por CNPJ, e-mail ou telefone', () => {
  const first = lead('a', { email: 'CONTATO@EMPRESA.COM.BR' });
  const duplicate = lead('b', { cnpj: '12.345.678/0001-90', email: 'outro@empresa.com.br' });
  const unique = lead('c', { cnpj: '98765432000100' });
  assert.deepEqual(deduplicarLeads([first, duplicate, unique]).map((item) => item.id), ['a', 'c']);
});

test('score aumenta quando o CNAE e as palavras-chave coincidem', () => {
  assert.equal(sugerirServicos(lead('a'), [service])[0].score, 77);
  assert.equal(sugerirServicos(lead('b', { razaoSocial: 'Empresa de serviços', cnae: '0000000', segmento: '' }), [service]).length, 0);
});

test('lê CSV com delimitadores e aspas escapadas', () => {
  assert.deepEqual(parseCsv('nome,email\r\n"Empresa, Ltda",contato@empresa.com.br\r\n"Loja ""A""",a@b.com'), [
    ['nome', 'email'],
    ['Empresa, Ltda', 'contato@empresa.com.br'],
    ['Loja "A"', 'a@b.com'],
  ]);
});

test('bloqueia contato presente na lista de supressão por hash do canal', async () => {
  const { hashContato } = await import('./prospeccaoPolicy');
  const emailHash = await hashContato('comercial@empresa.com.br');
  assert.equal(await estaSuprimido('COMERCIAL@EMPRESA.COM.BR', '', [
    { tipo: 'email', chaveHash: emailHash },
  ]), true);
  assert.equal(await estaSuprimido('outro@empresa.com.br', '', [
    { tipo: 'email', chaveHash: emailHash },
  ]), false);
});

test('permite somente dias úteis dentro da janela Recife', () => {
  assert.equal(dentroJanelaComercial(new Date('2026-11-17T13:00:00Z'), {
    diasSemana: [1, 2, 3, 4, 5], janelaInicio: '08:00', janelaFim: '17:00',
  }), true);
  assert.equal(dentroJanelaComercial(new Date('2026-11-17T23:00:00Z'), {
    diasSemana: [1, 2, 3, 4, 5], janelaInicio: '08:00', janelaFim: '17:00',
  }), false);
  assert.equal(dentroJanelaComercial(new Date('2026-11-22T15:00:00Z'), {
    diasSemana: [1, 2, 3, 4, 5], janelaInicio: '08:00', janelaFim: '17:00',
  }), false);
});

test('bloqueia envios que ultrapassam limite diário e conta simulados', () => {
  const sends = [
    { canal: 'email', status: 'enviado' },
    { canal: 'email', status: 'simulado' },
    { canal: 'whatsapp', status: 'enviado' },
  ];
  assert.equal(limiteDiarioAtingido(sends, 'email', 2), true);
  assert.equal(limiteDiarioAtingido(sends, 'email', 3), false);
  assert.equal(limiteDiarioAtingido(sends, 'whatsapp', 2), false);
});
