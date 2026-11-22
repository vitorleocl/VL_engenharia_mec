import { CategoriaAtivoDef } from '../types';

/**
 * Taxonomia inicial de ativos. Categoria -> Subcategorias.
 * Tudo pode ser editado ou excluído pelo usuário na tela de Ativos.
 */
export const CATEGORIAS_ATIVOS_PADRAO: CategoriaAtivoDef[] = [
  {
    id: 'cat-frota',
    nome: 'Frota',
    subcategorias: [
      'Caminhão-pipa',
      'Caminhão Munck',
      'Caminhão Guindaste Munck',
      'Guindaste Rodoviário',
      'Carreta / Semirreboque',
      'Veículo Oficial / Utilitário',
      'Veículo Sinistrado',
      'Ônibus / Micro-ônibus',
      'Trator',
      'Escavadeira Hidráulica',
      'Carregadeira',
      'Retroescavadeira',
      'Rolo Compressor',
      'Motoniveladora',
      'Mini-escavadeira',
      'Empilhadeira',
    ],
  },
  {
    id: 'cat-maquinas-industriais',
    nome: 'Máquinas e Equipamentos Industriais',
    subcategorias: [
      'Prensa Hidráulica',
      'Prensa Mecânica',
      'Injetora de Plástico',
      'Torno / Fresadora',
      'Robô Industrial',
      'Esteira Transportadora',
      'Misturador Industrial',
      'Extrusora',
      'Granulador',
      'Caldeira / Vaso de Pressão',
      'Compressor de Ar',
      'Gerador de Energia',
      'Bomba Industrial',
      'Ventilador Industrial',
    ],
  },
  {
    id: 'cat-elevacao',
    nome: 'Elevação e Movimentação',
    subcategorias: [
      'Ponte Rolante / Talha',
      'Talha Elétrica',
      'Guindaste de Pórtico',
      'Plataforma Elevatória / Cesta',
      'Elevador',
      'Monta-cargas',
      'Passadiço / Esteira Rolante',
    ],
  },
  {
    id: 'cat-seguranca-incendio',
    nome: 'Segurança Contra Incêndio',
    subcategorias: [
      'Sistema de Combate a Incêndio',
      'Hidrante',
      'Extintor',
      'Alarme de Incêndio',
      'Saída de Emergência',
      'PPCI',
    ],
  },
  {
    id: 'cat-climatizacao',
    nome: 'Climatização e Ventilação',
    subcategorias: [
      'Sistema de Climatização',
      'Chiller',
      'Torre de Resfriamento',
      'Ar-condicionado Industrial',
      'Exaustor Industrial',
    ],
  },
  {
    id: 'cat-infraestrutura',
    nome: 'Infraestrutura e Instalações',
    subcategorias: [
      'Painel Elétrico',
      'Subestação',
      'Transformador',
      'Rede de Aterramento',
      'Tubulações',
      'Tanque de Armazenamento',
      'Estrutura Metálica',
    ],
  },
  {
    id: 'cat-areas-coletivas',
    nome: 'Áreas de Lazer e Coletivas',
    subcategorias: [
      'Playground Infantil',
      'Academia ao Ar Livre',
      'Piscina',
      'Quadra Poliesportiva',
      'Elevador de Acessibilidade',
    ],
  },
  {
    id: 'cat-outros',
    nome: 'Outro ativo',
    subcategorias: ['Outro ativo'],
  },
];

/** Lista plana usada pelos selects legados e pelo texto dos documentos. */
export function achatarCategoriasAtivos(categorias: CategoriaAtivoDef[]): string[] {
  const valores: string[] = [];
  categorias.forEach(categoria => {
    if (categoria.nome) valores.push(categoria.nome);
    (categoria.subcategorias || []).forEach(sub => {
      if (sub) valores.push(sub);
    });
  });
  return Array.from(new Set(valores.map(v => v.trim()).filter(Boolean)));
}
