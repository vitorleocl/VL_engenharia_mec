import fs from 'node:fs';
import path from 'node:path';

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath) {
  throw new Error('Uso: node scripts/generateChecklistCatalogo.mjs <catalogo.md> <saida.ts>');
}

const mapping = {
  '1.1': 'incendio-inspecao-sistemas',
  '1.2': 'incendio-adequacao-avcb',
  '2.1': 'elevador-inspecao-seguranca',
  '2.2': 'elevador-auditoria-manutencao',
  '3.1': 'bombeamento-inspecao',
  '3.2': 'bombeamento-desempenho',
  '4.1': 'nr12-hrn',
  '4.2': 'nr12-protecoes',
  '4.3': 'nr12-retrofit',
  '5.1': 'maq-integridade',
  '5.2': 'maq-rops-fops',
  '5.3': 'maq-periodica',
  '6.1': 'munck-load-test',
  '6.2': 'munck-liberacao',
  '6.3': 'munck-lmi-rigging',
  '7.1': 'veic-reclassificacao',
  '7.2': 'veic-sinistro-danos',
  '7.3': 'veic-causa-raiz',
  '8.1': 'play-inspecao-geral',
  '8.2': 'play-aprisionamento',
  '8.3': 'play-piso-amortecedor',
  '9.1': 'pmoc-plano-operacao',
  '9.2': 'pmoc-qualidade-ar',
  '10.1': 'nr13-vp-enquadramento-pv',
  '10.2': 'nr13-vp-inspecao-seguranca',
  '10.3': 'nr13-vp-ultrassom-espessura',
  '10.4': 'nr13-vp-boroscopia',
  '10.5': 'nr13-vp-teste-hidrostatico',
  '10.6': 'nr13-vp-calibracao-psv-manometro',
  '10.7': 'nr13-vp-prontuario-nr13',
  '10.8': 'nr13-vp-plaqueta-identificacao',
  '10.9': 'nr13-vp-livro-seguranca',
  '10.10': 'nr13-vp-relatorio-art',
  '11.1': 'nr13-cald-periodica',
  '11.2': 'nr13-cald-controle-intertravamento',
  '11.3': 'nr13-cald-end',
  '11.4': 'nr13-cald-calibracao-psv',
  '11.5': 'nr13-cald-auditoria-documental',
  '11.6': 'nr13-cald-laudo-integridade-art',
  '12.1': 'gas-abrigos-centrais-glp',
  '12.2': 'gas-teste-estanqueidade',
  '12.3': 'gas-rastreamento-lel',
  '12.4': 'gas-auditoria-componentes',
  '12.5': 'gas-sinalizacao-seguranca',
  '12.6': 'gas-laudo-estanqueidade-art',
  '13.1': 'nr13-tub-cadastramento',
  '13.2': 'nr13-tub-fluxograma-isometrico',
  '13.3': 'nr13-tub-inspecao-espessura',
  '13.4': 'nr13-tanques-metalicos',
  '13.5': 'nr13-tub-plano-inspecao-art',
};

const markdown = fs.readFileSync(inputPath, 'utf8').replace(/^\uFEFF/, '');
const sections = new Map();
let current;

for (const line of markdown.split(/\r?\n/)) {
  const heading = line.match(/^###\s+(\d+\.\d+)\s+(.+?)\s*$/);
  if (heading) {
    const [, number, title] = heading;
    const subtypeId = mapping[number];
    current = subtypeId ? { number, title, items: [] } : undefined;
    if (current) sections.set(subtypeId, current);
    continue;
  }
  if (!current) continue;

  const row = line.match(/^\|\s*(\d+\.\d+\.\d+)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|/);
  if (!row) continue;
  const [, number, item, criterion] = row;
  current.items.push({ number, item, criterion });
}

const missing = Object.entries(mapping)
  .filter(([, id]) => !sections.has(id) || sections.get(id).items.length === 0)
  .map(([number, id]) => `${number} (${id})`);
if (missing.length) {
  throw new Error(`Seções sem itens encontradas no Markdown: ${missing.join(', ')}`);
}

const output = `/* Gerado de Checklists de Inspeção e Laudos Técnicos – Catálogo de Serviços.md */\n`
  + `export interface ChecklistCatalogoItem {\n`
  + `  number: string;\n  item: string;\n  criterion: string;\n}\n\n`
  + `export interface ChecklistCatalogoSecao {\n`
  + `  number: string;\n  title: string;\n  items: ChecklistCatalogoItem[];\n}\n\n`
  + `export const CHECKLISTS_CATALOGO_MARKDOWN: Record<string, ChecklistCatalogoSecao> = `
  + `${JSON.stringify(Object.fromEntries(sections), null, 2)};\n`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, output, 'utf8');
console.log(`Geradas ${sections.size} seções e ${[...sections.values()].reduce((n, s) => n + s.items.length, 0)} itens em ${outputPath}`);
