import { CategoriaMestreDef, ItemInspecaoMestre, TipoLaudoMestreDef } from '../../types';
import { CATEGORIA_1_INCENDIO, CATEGORIA_2_NR12_NR13, CATEGORIA_3_MAQUINAS_PESADAS, CATEGORIA_4_VEICULAR } from './categorias1a4';
import { CATEGORIA_5_HVAC_MANUTENCAO, CATEGORIA_6_PLAYGROUND, CATEGORIA_7_ESTRUTURAS_SOLDA, CATEGORIA_8_ELEVACAO_INDUSTRIAL } from './categorias5a8';
import { CATEGORIA_9_VASOS_TUBULACOES, CATEGORIA_10_PERICIAS_MECANICAS, CATEGORIA_11_GERADORES, CATEGORIA_12_ACESSIBILIDADE_ACUSTICA } from './categorias9a12';

export * from './utils';
export * from './categorias1a4';
export * from './categorias5a8';
export * from './categorias9a12';

export const BANCO_MESTRE_12_CATEGORIAS: CategoriaMestreDef[] = [
  CATEGORIA_1_INCENDIO,
  CATEGORIA_2_NR12_NR13,
  CATEGORIA_3_MAQUINAS_PESADAS,
  CATEGORIA_4_VEICULAR,
  CATEGORIA_5_HVAC_MANUTENCAO,
  CATEGORIA_6_PLAYGROUND,
  CATEGORIA_7_ESTRUTURAS_SOLDA,
  CATEGORIA_8_ELEVACAO_INDUSTRIAL,
  CATEGORIA_9_VASOS_TUBULACOES,
  CATEGORIA_10_PERICIAS_MECANICAS,
  CATEGORIA_11_GERADORES,
  CATEGORIA_12_ACESSIBILIDADE_ACUSTICA
];

export interface EstatisticasBancoMestre {
  totalCategorias: number;
  totalSubcategorias: number;
  totalTiposLaudo: number;
  totalTiposAtivos: number;
  totalItensInspecao: number;
  totalItensCriticos: number;
  totalItensMedicao: number;
}

export function obterEstatisticasBancoMestre(): EstatisticasBancoMestre {
  let totalSubcategorias = 0;
  let totalTiposLaudo = 0;
  let totalItensInspecao = 0;
  let totalItensCriticos = 0;
  let totalItensMedicao = 0;
  const ativosSet = new Set<string>();

  BANCO_MESTRE_12_CATEGORIAS.forEach(cat => {
    cat.subcategorias.forEach(sub => {
      totalSubcategorias++;
      sub.tiposAtivos?.forEach(a => ativosSet.add(a));
      sub.tiposLaudo.forEach(tl => {
        totalTiposLaudo++;
        tl.tiposAtivos?.forEach(a => ativosSet.add(a));
        tl.itens.forEach(it => {
          totalItensInspecao++;
          if (it.criticidadePadrao === 'Critica') totalItensCriticos++;
          if (it.resultado === 'MEDICAO' || it.campoMedicao) totalItensMedicao++;
        });
      });
    });
  });

  return {
    totalCategorias: BANCO_MESTRE_12_CATEGORIAS.length,
    totalSubcategorias,
    totalTiposLaudo,
    totalTiposAtivos: ativosSet.size,
    totalItensInspecao,
    totalItensCriticos,
    totalItensMedicao
  };
}

export function buscarItensNoBancoMestre(termo: string): {
  categoria: CategoriaMestreDef;
  subcategoriaNome: string;
  tipoLaudoNome: string;
  item: ItemInspecaoMestre;
}[] {
  if (!termo || termo.trim().length === 0) return [];
  const t = termo.toLowerCase().trim();
  const resultados: {
    categoria: CategoriaMestreDef;
    subcategoriaNome: string;
    tipoLaudoNome: string;
    item: ItemInspecaoMestre;
  }[] = [];

  BANCO_MESTRE_12_CATEGORIAS.forEach(cat => {
    cat.subcategorias.forEach(sub => {
      sub.tiposLaudo.forEach(tl => {
        tl.itens.forEach(it => {
          const matchCodigo = it.codigo.toLowerCase().includes(t);
          const matchDesc = it.descricao.toLowerCase().includes(t);
          const matchCrit = it.criterioInspecao.toLowerCase().includes(t);
          const matchNorma = it.referenciaNormativa?.norma.toLowerCase().includes(t);
          const matchGrupo = it.grupoInspecao?.toLowerCase().includes(t);
          const matchAtivo = it.tipoAtivo?.toLowerCase().includes(t);

          if (matchCodigo || matchDesc || matchCrit || matchNorma || matchGrupo || matchAtivo) {
            resultados.push({
              categoria: cat,
              subcategoriaNome: sub.nome,
              tipoLaudoNome: tl.nome,
              item: it
            });
          }
        });
      });
    });
  });

  return resultados;
}
