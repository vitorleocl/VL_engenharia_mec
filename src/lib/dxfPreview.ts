export interface DxfEntidadePreview {
  tipo: 'LINE' | 'CIRCLE';
  layer: string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  raio?: number;
}

export interface DxfPreviewDados {
  entidades: DxfEntidadePreview[];
  layers: string[];
}

export function analisarDxfPreview(conteudo: string): DxfPreviewDados {
  if (conteudo.includes('\u0000')) throw new Error('DXF binário não suportado. Exporte o arquivo como DXF ASCII.');
  const linhas = conteudo.replace(/^\uFEFF/, '').split(/\r?\n/);
  const pares: { codigo: number; valor: string }[] = [];
  for (let indice = 0; indice + 1 < linhas.length; indice += 2) {
    const codigo = Number(linhas[indice].trim());
    if (!Number.isFinite(codigo)) continue;
    pares.push({ codigo, valor: linhas[indice + 1].trim() });
  }

  const entidades: DxfEntidadePreview[] = [];
  const layers = new Set<string>();
  for (let indice = 0; indice < pares.length; indice += 1) {
    const par = pares[indice];
    if (par.codigo !== 0 || (par.valor !== 'LINE' && par.valor !== 'CIRCLE')) continue;
    const tipo = par.valor;
    const dados: Record<number, string[]> = {};
    indice += 1;
    while (indice < pares.length && pares[indice].codigo !== 0) {
      const atual = pares[indice];
      (dados[atual.codigo] ||= []).push(atual.valor);
      indice += 1;
    }
    indice -= 1;
    const layer = dados[8]?.[0] || '0';
    layers.add(layer);
    const numero = (codigo: number): number | undefined => {
      const valor = Number(dados[codigo]?.[0]);
      return Number.isFinite(valor) ? valor : undefined;
    };
    if (tipo === 'LINE') {
      const [x1, y1, x2, y2] = [numero(10), numero(20), numero(11), numero(21)];
      if ([x1, y1, x2, y2].every((valor) => valor !== undefined)) {
        entidades.push({ tipo, layer, x1, y1, x2, y2 });
      }
    } else {
      const [x1, y1, raio] = [numero(10), numero(20), numero(40)];
      if ([x1, y1, raio].every((valor) => valor !== undefined) && Number(raio) > 0) {
        entidades.push({ tipo, layer, x1, y1, raio });
      }
    }
  }
  if (!entidades.length) throw new Error('Nenhuma entidade LINE ou CIRCLE compatível foi encontrada no DXF.');
  return { entidades, layers: [...layers].sort((a, b) => a.localeCompare(b)) };
}

export function corDxfLayer(layer: string): string {
  const chave = layer.toLocaleUpperCase('pt-BR');
  const cores: Record<string, string> = {
    PAREDE: '#94a3b8', PORTA: '#22c55e', JANELA: '#38bdf8', EQUIPAMENTO: '#f97316',
    DUTO: '#38bdf8', DIFUSOR: '#facc15', HIDRANTE: '#ef4444', EXTINTOR: '#f97316',
    ILUM_EMERG: '#fde047', ROTA: '#22c55e', PERIGO: '#ef4444', PROTECAO: '#facc15',
    CORTINA_LUZ: '#22c55e', ESTOP: '#ef4444', CASCO: '#94a3b8', BOCAL: '#38bdf8',
    PSV: '#ef4444', SUPORTE: '#64748b', COTA: '#a78bfa', TEXTO: '#e2e8f0',
  };
  let hash = 0;
  for (let i = 0; i < layer.length; i += 1) hash = (hash * 31 + layer.charCodeAt(i)) >>> 0;
  return cores[chave] || `hsl(${hash % 360} 72% 64%)`;
}
