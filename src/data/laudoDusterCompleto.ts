import { Laudo, EvidenciaFoto } from '../types';
import { LAUDO_FALHA_MECANICA_DEF } from './laudoFalhaMecanicaDef';

export const FOTOS_DUSTER_EVIDENCIAS: EvidenciaFoto[] = [
  {
    id: 'foto-duster-1',
    url: '/assets/laudos/duster/figura_1_cabecote_valvulas.jpg',
    titulo: 'Cabeçote Desmontado em Bancada',
    legenda: 'Vista superior do cabeçote do motor desmontado em bancada, evidenciando as sedes de válvulas e a câmara de combustão severamente avariadas pelo choque mecânico decorrente do dessincronismo do motor.',
    descricao: 'Vista superior do cabeçote do motor desmontado em bancada, evidenciando as sedes de válvulas e a câmara de combustão severamente avariadas pelo choque mecânico decorrente do dessincronismo do motor.',
    dataHora: '2026-08-20T10:15:00Z',
  },
  {
    id: 'foto-duster-2',
    url: '/assets/laudos/duster/figura_2_correia_rompida.jpg',
    titulo: 'Correia Dentada Rompida',
    legenda: 'Detalhe macroscópico da correia dentada de distribuição após a ruptura, exibindo o desfibramento total e a descontinuidade estrutural que provocaram a interrupção instantânea da transmissão de movimento do comando de válvulas.',
    descricao: 'Detalhe macroscópico da correia dentada de distribuição após a ruptura, exibindo o desfibramento total e a descontinuidade estrutural que provocaram a interrupção instantânea da transmissão de movimento do comando de válvulas.',
    dataHora: '2026-08-20T10:25:00Z',
  },
  {
    id: 'foto-duster-3',
    url: '/assets/laudos/duster/figura_3_odometro_152530km.jpg',
    titulo: 'Odômetro do Veículo',
    legenda: 'Registro visual do painel de instrumentos e odômetro do veículo, comprovando a quilometragem atual de 152.530 km no momento da constatação da avaria em agosto de 2026.',
    descricao: 'Registro visual do painel de instrumentos e odômetro do veículo, comprovando a quilometragem atual de 152.530 km no momento da constatação da avaria em agosto de 2026.',
    dataHora: '2026-08-20T09:45:00Z',
  },
  {
    id: 'foto-duster-4',
    url: '/assets/laudos/duster/figura_4_bloco_motor.jpg',
    titulo: 'Bloco do Motor e Junta do Cabeçote',
    legenda: 'Inspeção técnica do bloco do motor e da junta de vedação, constatando integridade das galerias de arrefecimento e lubrificação, sem indícios de superaquecimento prévio.',
    descricao: 'Inspeção técnica do bloco do motor e da junta de vedação, constatando integridade das galerias de arrefecimento e lubrificação, sem indícios de superaquecimento prévio.',
    dataHora: '2026-08-20T10:35:00Z',
  },
  {
    id: 'foto-duster-5',
    url: '/assets/laudos/duster/figura_5_gravacao_chassi.jpg',
    titulo: 'Gravação do Chassi (VIN)',
    legenda: 'Confronto físico da numeração de chassi gravada na estrutura do veículo (093YHSRAF500GJ3983670), confirmando autenticidade e rastreabilidade cadastral.',
    descricao: 'Confronto físico da numeração de chassi gravada na estrutura do veículo (093YHSRAF500GJ3983670), confirmando autenticidade e rastreabilidade cadastral.',
    dataHora: '2026-08-20T09:50:00Z',
  },
  {
    id: 'foto-duster-6',
    url: '/assets/laudos/duster/figura_6_dutos_admissao.jpg',
    titulo: 'Dutos e Componentes de Admissão',
    legenda: 'Inspeção periférica dos dutos de admissão e chicotes elétricos de injeção, apresentando conformidade de montagem e ausência de corpos estranhos.',
    descricao: 'Inspeção periférica dos dutos de admissão e chicotes elétricos de injeção, apresentando conformidade de montagem e ausência de corpos estranhos.',
    dataHora: '2026-08-20T10:05:00Z',
  },
  {
    id: 'foto-duster-7',
    url: '/assets/laudos/duster/figura_7_duster_frontal.jpg',
    titulo: 'Vista Frontal Geral da Renault Duster',
    legenda: 'Registro do veículo oficial do Ministério Público de Pernambuco (Placa PGX-9708) posicionado nas dependências da oficina ADF para execução da perícia mecânica.',
    descricao: 'Registro do veículo oficial do Ministério Público de Pernambuco (Placa PGX-9708) posicionado nas dependências da oficina ADF para execução da perícia mecânica.',
    dataHora: '2026-08-20T09:30:00Z',
  },
];

export const LAUDO_DUSTER_COMPLETO: Laudo = {
  id: 'lau-2026-002-duster',
  numero: 'LAU-2026/002',
  tipo: 'Laudo de Perícia Técnica Veicular – Análise de Falha Mecânica e Apuração de Causa Raiz',
  tipoLaudoId: 'laudo-falha-mecanica-causa-raiz',
  categoriaId: 'cat-4',
  subcategoriaId: 'sub-4-2',
  clienteId: 'cli-adf',
  clienteNome: 'ADF Caruaru / Ministério Público de Pernambuco',
  clienteCnpj: '24.417.065/0001-03',
  ativoId: 'atv-pgx7098',
  ativoIdentificacao: 'PGX-9708 (Renault Duster 2016/2016)',
  status: 'finalizado',
  artNumero: 'PE20261621255',
  dataInspecao: '2026-08-20',
  orcamentoOrigemId: 'orc-1790444416499',
  orcamentoNumero: 'PROP-1790444416499',
  responsavelNome: 'Vitor Leonardo Cordeiro Linhares',
  responsavelCrea: 'CREA-PE 1822299490',
  capaFotoUrl: '/assets/laudos/duster/capa_duster_cabecote.jpg',
  capaFotoLegenda: 'Cabeçote do Motor em Análise Pericial Forense',
  artArquivoUrl: '/assets/laudos/duster/art_crea_pe_20261621255.jpg',
  artNomeArquivo: 'ART_CREA-PE_PE20261621255_Adf_Auto_Pecas.pdf',
  artTipoArquivo: 'imagem',
  artDataHomologacao: '2026-09-08',
  anexosFotos: FOTOS_DUSTER_EVIDENCIAS,
  resumoExecutivo: 'Avaliação técnica pericial das avarias constatadas no conjunto propulsor do Renault Duster PGX-9708 pertencente ao Ministério Público de Pernambuco. Apuração de Causa Raiz: ruptura da correia dentada do sistema de distribuição por fadiga mecânica cíclica, gerando colapso de sincronismo e empenamento severo de válvulas. Análise temporal atesta que o prazo legal de garantia de 90 dias (CDC Art. 26, II) expirou (> 8 meses decorridos desde a revisão de dez/2025). Inexistem indícios de mau uso pelo condutor.',
  conclusao: 'Conclui-se de forma peremptória que a pane no motor do veículo decorreu da ruptura da correia dentada, gerando danos severos ao cabeçote e válvulas que demandam retífica. O evento ocorreu ultrapassando o prazo legal de garantia de 90 dias da intervenção passada. Inexistem indícios materiais de mau uso pelo condutor.',
  checklist: (LAUDO_FALHA_MECANICA_DEF.checklistPadrao || []).map(item => ({ ...item })),
  secoes: [
    {
      id: 'sec-1',
      titulo: 'Cabeçalho Institucional',
      ordem: 1,
      conteudoHtml: `<div class="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
  <div class="flex items-center justify-between border-b border-slate-200 pb-3">
    <div>
      <h2 class="text-base font-bold text-slate-900 uppercase tracking-wide">VL ENGENHARIA</h2>
      <p class="text-xs text-slate-600 font-medium">Laudo Técnico Pericial de Engenharia Mecânica Forense</p>
    </div>
    <div class="text-right text-xs text-slate-600">
      <span class="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded border border-blue-200">CREA-PE 1822299490</span>
    </div>
  </div>
  <div class="grid grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
    <p><strong>Empresa Emitente:</strong> VL ENGENHARIA MECÂNICA</p>
    <p><strong>Número do Laudo:</strong> LAU-2026/002</p>
    <p><strong>ART Vinculada:</strong> PE20261621255 (Registrada no CREA-PE)</p>
    <p><strong>Data de Emissão:</strong> Outubro de 2026</p>
    <p class="col-span-2"><strong>Engenheiro Responsável:</strong> Vitor Leonardo Cordeiro Linhares — CREA-PE 1822299490</p>
  </div>
</div>`,
      itens: [],
      fotos: []
    },
    {
      id: 'sec-2',
      titulo: 'Carta de Apresentação',
      ordem: 2,
      conteudoHtml: `<p><strong>Ao(à) ADF Caruaru</strong></p>
<p>Prezado(a) Senhor(a),</p>
<p>Apresentamos o presente Laudo de Avaliação Técnica Pericial referente ao veículo oficial de propriedade do <strong>Ministério Público de Pernambuco</strong> (CNPJ: 24.417.065/0001-03), marca <strong>Renault</strong>, modelo <strong>Duster</strong>, ano/modelo <strong>2016/2016</strong>, Placa <strong>PGX-9708</strong>, Chassi <strong>093YHSRAF500GJ3983670</strong>.</p>
<p>O presente trabalho técnico teve como finalidade realizar a avaliação pericial das avarias constatadas no conjunto propulsor, identificar a extensão dos danos internos, analisar tecnicamente a dinâmica da falha mecânica e apurar a causa raiz do evento, fundamentando-se em vistoria física detalhada, registros fotográficos e análise do escopo temporal de utilização do ativo.</p>
<p>Ressalta-se que o presente laudo possui caráter exclusivamente técnico-pericial, destinando-se à documentação das condições observadas e à análise fundamentada das causas da pane mecânica, não constituindo, por si só, reconhecimento ou atribuição de responsabilidade civil, administrativa ou penal a quaisquer das partes envolvidas.</p>
<p>Colocamo-nos à inteira disposição para quaisquer esclarecimentos técnicos que se façam necessários.</p>`,
      itens: [],
      fotos: []
    },
    {
      id: 'sec-3',
      titulo: 'Sumário Executivo',
      ordem: 3,
      conteudoHtml: `<div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
  <div class="border-b border-slate-200 pb-2">
    <h3 class="text-xs font-black text-[#0B1E3D] uppercase tracking-wider">Sumário Executivo & Estrutura do Laudo</h3>
    <p class="text-[10px] text-slate-500">Relação sequencial das seções técnicas que compõem este laudo pericial:</p>
  </div>
  <div class="space-y-1.5 text-xs text-slate-700">
    <div class="flex items-center justify-between py-1 border-b border-dotted border-slate-200"><span class="font-medium">1. Cabeçalho Institucional & Credenciamento CREA-PE</span><span class="font-mono text-slate-500 font-bold">Pág. 02</span></div>
    <div class="flex items-center justify-between py-1 border-b border-dotted border-slate-200"><span class="font-medium">2. Carta de Apresentação Técnica</span><span class="font-mono text-slate-500 font-bold">Pág. 03</span></div>
    <div class="flex items-center justify-between py-1 border-b border-dotted border-slate-200"><span class="font-medium">3. Sumário Executivo</span><span class="font-mono text-slate-500 font-bold">Pág. 04</span></div>
    <div class="flex items-center justify-between py-1 border-b border-dotted border-slate-200"><span class="font-medium">4. Destinatário e Qualificação do Responsável Técnico</span><span class="font-mono text-slate-500 font-bold">Pág. 05</span></div>
    <div class="flex items-center justify-between py-1 border-b border-dotted border-slate-200"><span class="font-medium">5. Histórico do Evento e Intervenções Anteriores</span><span class="font-mono text-slate-500 font-bold">Pág. 06</span></div>
    <div class="flex items-center justify-between py-1 border-b border-dotted border-slate-200"><span class="font-medium">6. Objetivo do Trabalho e Metodologia Pericial</span><span class="font-mono text-slate-500 font-bold">Pág. 07</span></div>
    <div class="flex items-center justify-between py-1 border-b border-dotted border-slate-200"><span class="font-medium">7. Dados do Veículo e Especificações Oficiais</span><span class="font-mono text-slate-500 font-bold">Pág. 08</span></div>
    <div class="flex items-center justify-between py-1 border-b border-dotted border-slate-200"><span class="font-medium">8. Registros Fotográficos Principais</span><span class="font-mono text-slate-500 font-bold">Pág. 09–10</span></div>
    <div class="flex items-center justify-between py-1 border-b border-dotted border-slate-200"><span class="font-medium">9. Legislação Aplicada e Normas Técnicas ABNT</span><span class="font-mono text-slate-500 font-bold">Pág. 11</span></div>
    <div class="flex items-center justify-between py-1 border-b border-dotted border-slate-200"><span class="font-medium">10. Constatação de Danos e Análise de Causa Raiz</span><span class="font-mono text-slate-500 font-bold">Pág. 12–13</span></div>
    <div class="flex items-center justify-between py-1 border-b border-dotted border-slate-200"><span class="font-medium">11. Tabela de Constatação de Danos e Integridade Técnica</span><span class="font-mono text-slate-500 font-bold">Pág. 14</span></div>
    <div class="flex items-center justify-between py-1 border-b border-dotted border-slate-200"><span class="font-medium">12. Conclusão Técnica Pericial & Assinatura</span><span class="font-mono text-slate-500 font-bold">Pág. 15</span></div>
    <div class="flex items-center justify-between py-1 border-b border-dotted border-slate-200 text-emerald-800 font-semibold"><span class="font-medium">Anexo: Anotação de Responsabilidade Técnica (ART — CREA-PE PE20261621255)</span><span class="font-mono font-bold">Pág. 16</span></div>
  </div>
</div>`,
      itens: [],
      fotos: []
    },
    {
      id: 'sec-4',
      titulo: 'Destinatário e Qualificação do Responsável Técnico',
      ordem: 4,
      conteudoHtml: `<table class="tiptap-table border-collapse border border-slate-300 w-full my-3">
  <tbody>
    <tr>
      <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-700 w-1/3">Contratante:</td>
      <td class="border border-slate-300 p-2 text-xs text-slate-900 font-semibold">ADF Caruaru / Ministério Público de Pernambuco (CNPJ: 24.417.065/0001-03)</td>
    </tr>
    <tr>
      <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-700">Endereço Operacional:</td>
      <td class="border border-slate-300 p-2 text-xs text-slate-900">Avenida Jose Pinheiro dos Santos, 20, - Pinheiropolis, Caruaru/PE</td>
    </tr>
    <tr>
      <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-700">Contato Técnico:</td>
      <td class="border border-slate-300 p-2 text-xs text-slate-900 font-semibold">Thiago Cunha (adfcentroautomotivo@gmail.com)</td>
    </tr>
    <tr>
      <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-700">Perito Responsável:</td>
      <td class="border border-slate-300 p-2 text-xs text-slate-900 font-semibold">Vitor Leonardo Cordeiro Linhares</td>
    </tr>
    <tr>
      <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-700">Titulação:</td>
      <td class="border border-slate-300 p-2 text-xs text-slate-900">Engenheiro Mecânico</td>
    </tr>
    <tr>
      <td class="border border-slate-300 bg-slate-50 p-2 font-bold text-xs text-slate-700">Registro Profissional:</td>
      <td class="border border-slate-300 p-2 text-xs text-slate-900 font-mono font-bold">CREA-PE 1822299490</td>
    </tr>
  </tbody>
</table>`,
      itens: [],
      fotos: []
    },
    {
      id: 'sec-5',
      titulo: 'Histórico do Evento',
      ordem: 5,
      conteudoHtml: `<div class="space-y-3 text-xs text-slate-700 leading-relaxed">
  <p class="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">SEÇÃO I - HISTÓRICO DO EVENTO</p>
  <p>O presente documento tem por objetivo registrar a análise técnica referente a uma falha mecânica severa ocorrida no sistema de propulsão de um veículo pertencente à frota do <strong>Ministério Público de Pernambuco</strong> (CNPJ: 24.417.065/0001-03), modelo <strong>Renault Duster</strong> (Placa <strong>PGX-9708</strong>, Chassi <strong>093YHSRAF500GJ3983670</strong>).</p>
  <p>Historicamente, o veículo havia sido submetido a uma ampla intervenção técnica no sistema de distribuição e motor em <strong>dezembro de 2025</strong>, ocasião em que registrava <strong>149.908 km</strong>, tendo sido executados os seguintes serviços e substituições de componentes: retífica de cabeçote, jogo de junta do motor, bomba d'água, jogo de vela, jogo de cabo de vela, correia dentada, tensor da correia dentada, filtro de óleo, troca de óleo de motor, filtro de ar, filtro de combustível, filtro de ar de cabine, além de válvulas e retentores do cabeçote. Cumpre registrar que a oficina responsável pela execução daquele serviço prévio optou por não compartilhar a respectiva nota fiscal, pautando-se em diretrizes internas de confidencialidade e questões comerciais de seu escopo corporativo.</p>
  <p>Posteriormente, em <strong>agosto de 2026</strong>, o veículo deu entrada nas dependências da <strong>ADF Caruaru</strong> apresentando uma pane mecânica súbita, constatando-se no odômetro a marcação de <strong>152.530 km</strong>. Evidencia-se, portanto, que o veículo percorreu um intervalo de <strong>apenas 2.622 km</strong> entre a manutenção prévia e a ocorrência da pane atual. Diante do quadro de parada funcional, procedeu-se à abertura e inspeção técnica do motor para constatação das avarias e investigação da origem do dano.</p>
</div>`,
      itens: [],
      fotos: []
    },
    {
      id: 'sec-6',
      titulo: 'Objetivo do Trabalho e Metodologia Pericial',
      ordem: 6,
      conteudoHtml: `<div class="space-y-3 text-xs text-slate-700 leading-relaxed">
  <p class="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">SEÇÃO II - OBJETIVO DO TRABALHO E METODOLOGIA PERICIAL</p>
  <p>O presente trabalho técnico-pericial tem por objetivo realizar a inspeção física detalhada do conjunto propulsor do veículo, promovendo a avaliação técnica dos danos decorrentes da pane mecânica, a verificação da integridade dos componentes internos e de sincronismo, bem como a análise das evidências materiais relacionadas à falha.</p>
  <p>Pretende-se, por meio deste exame, identificar a extensão das avarias no cabeçote, investigar a provável causa raiz do colapso mecânico (ruptura da correia dentada), avaliar a consistência dos prazos legais de garantia aplicáveis (estipulados em 90 dias conforme o Código de Defesa do Consumidor) e atestar a ausência de indícios de mau uso operacional por parte do condutor, fornecendo subsídios técnicos definitivos para a gestão da frota.</p>
  <div class="p-3 bg-blue-50/70 border-l-4 border-blue-600 rounded my-2">
    <p><strong>Metodologia Aplicada:</strong> Os trabalhos periciais foram conduzidos por meio de exame visual direto e macroscópico dos componentes desmontados (método visual com auxílio de instrumentos de medição), análise de compatibilidade cinemática do sistema de distribuição (sincronismo de válvulas), levantamento documental do histórico de manutenção e verificação do odômetro, em conformidade com os princípios da engenharia de falhas mecânicas e análise de materiais.</p>
  </div>
</div>`,
      itens: [],
      fotos: []
    },
    {
      id: 'sec-7',
      titulo: 'Dados do Veículo',
      ordem: 7,
      conteudoHtml: `<div class="space-y-3">
  <table class="tiptap-table border-collapse border border-slate-300 w-full my-2 text-xs">
    <tbody>
      <tr>
        <td class="border border-slate-300 bg-slate-50 p-2.5 font-bold text-slate-700 w-1/4">Proprietário:</td>
        <td class="border border-slate-300 p-2.5 text-slate-900 font-semibold" colspan="3">Ministério Público de Pernambuco (CNPJ: 24.417.065/0001-03)</td>
      </tr>
      <tr>
        <td class="border border-slate-300 bg-slate-50 p-2.5 font-bold text-slate-700 w-1/4">Marca:</td>
        <td class="border border-slate-300 p-2.5 text-slate-900 w-1/4 font-semibold">Renault</td>
        <td class="border border-slate-300 bg-slate-50 p-2.5 font-bold text-slate-700 w-1/4">Modelo:</td>
        <td class="border border-slate-300 p-2.5 text-slate-900 w-1/4 font-semibold">Duster</td>
      </tr>
      <tr>
        <td class="border border-slate-300 bg-slate-50 p-2.5 font-bold text-slate-700">Espécie / Tipo:</td>
        <td class="border border-slate-300 p-2.5 text-slate-900">Passageiro / Utilitário</td>
        <td class="border border-slate-300 bg-slate-50 p-2.5 font-bold text-slate-700">Placa:</td>
        <td class="border border-slate-300 p-2.5 text-slate-900 font-bold font-mono text-xs text-[#0B1E3D]">PGX-9708</td>
      </tr>
      <tr>
        <td class="border border-slate-300 bg-slate-50 p-2.5 font-bold text-slate-700">Chassi N.º:</td>
        <td class="border border-slate-300 p-2.5 text-slate-900 font-mono font-medium tracking-wider" colspan="3">093YHSRAF500GJ3983670</td>
      </tr>
      <tr>
        <td class="border border-slate-300 bg-slate-50 p-2.5 font-bold text-slate-700">Ano Fab. / Modelo:</td>
        <td class="border border-slate-300 p-2.5 text-slate-900 font-semibold">2016 / 2016</td>
        <td class="border border-slate-300 bg-slate-50 p-2.5 font-bold text-slate-700">Quilometragem Aferida:</td>
        <td class="border border-slate-300 p-2.5 text-slate-900 font-bold">152.530 km (Atual - Agosto de 2026)</td>
      </tr>
      <tr>
        <td class="border border-slate-300 bg-slate-50 p-2.5 font-bold text-slate-700">Quilometragem Anterior:</td>
        <td class="border border-slate-300 p-2.5 text-slate-900 font-semibold" colspan="3">149.908 km (Registrada em Dezembro de 2025) — Intervalo percorrido: 2.622 km</td>
      </tr>
    </tbody>
  </table>
</div>`,
      itens: [],
      fotos: []
    },
    {
      id: 'sec-8',
      titulo: 'Registros Fotográficos Principais',
      ordem: 8,
      conteudoHtml: `<div class="space-y-3">
  <p class="text-xs text-slate-500 italic mb-2">(Registros fotográficos periciais da vistoria técnica numerados sequencialmente com legendas analíticas)</p>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
    
    <div class="p-3 border border-slate-200 rounded-lg bg-slate-50/70 space-y-2 text-center">
      <div class="h-44 bg-slate-100 rounded-lg flex items-center justify-center p-1 overflow-hidden border border-slate-200">
        <img src="/assets/laudos/duster/figura_1_cabecote_valvulas.jpg" alt="Figura 1: Cabeçote Desmontado em Bancada" class="w-full h-full object-cover rounded" />
      </div>
      <p class="text-xs font-bold text-slate-800 text-left flex items-center gap-1.5">
        <span class="px-1.5 py-0.5 rounded bg-blue-100 text-[#0B1E3D] text-[10px] font-bold">Figura 1</span>
        <span>Cabeçote Desmontado em Bancada</span>
      </p>
      <p class="text-xs text-slate-600 text-left">Vista superior do cabeçote do motor desmontado em bancada, evidenciando as sedes de válvulas e a câmara de combustão severamente avariadas pelo choque mecânico decorrente do dessincronismo do motor.</p>
    </div>

    <div class="p-3 border border-slate-200 rounded-lg bg-slate-50/70 space-y-2 text-center">
      <div class="h-44 bg-slate-100 rounded-lg flex items-center justify-center p-1 overflow-hidden border border-slate-200">
        <img src="/assets/laudos/duster/figura_2_correia_rompida.jpg" alt="Figura 2: Correia Dentada Rompida" class="w-full h-full object-cover rounded" />
      </div>
      <p class="text-xs font-bold text-slate-800 text-left flex items-center gap-1.5">
        <span class="px-1.5 py-0.5 rounded bg-blue-100 text-[#0B1E3D] text-[10px] font-bold">Figura 2</span>
        <span>Correia Dentada Rompida</span>
      </p>
      <p class="text-xs text-slate-600 text-left">Detalhe macroscópico da correia dentada de distribuição após a ruptura, exibindo o desfibramento total e a descontinuidade estrutural que provocaram a interrupção instantânea da transmissão de movimento do comando de válvulas.</p>
    </div>

    <div class="p-3 border border-slate-200 rounded-lg bg-slate-50/70 space-y-2 text-center">
      <div class="h-44 bg-slate-100 rounded-lg flex items-center justify-center p-1 overflow-hidden border border-slate-200">
        <img src="/assets/laudos/duster/figura_3_odometro_152530km.jpg" alt="Figura 3: Odômetro do Veículo" class="w-full h-full object-cover rounded" />
      </div>
      <p class="text-xs font-bold text-slate-800 text-left flex items-center gap-1.5">
        <span class="px-1.5 py-0.5 rounded bg-blue-100 text-[#0B1E3D] text-[10px] font-bold">Figura 3</span>
        <span>Odômetro do Veículo</span>
      </p>
      <p class="text-xs text-slate-600 text-left">Registro visual do painel de instrumentos e odômetro do veículo, comprovando a quilometragem atual de 152.530 km no momento da constatação da avaria em agosto de 2026.</p>
    </div>

    <div class="p-3 border border-slate-200 rounded-lg bg-slate-50/70 space-y-2 text-center">
      <div class="h-44 bg-slate-100 rounded-lg flex items-center justify-center p-1 overflow-hidden border border-slate-200">
        <img src="/assets/laudos/duster/figura_4_bloco_motor.jpg" alt="Figura 4: Bloco do Motor e Junta do Cabeçote" class="w-full h-full object-cover rounded" />
      </div>
      <p class="text-xs font-bold text-slate-800 text-left flex items-center gap-1.5">
        <span class="px-1.5 py-0.5 rounded bg-blue-100 text-[#0B1E3D] text-[10px] font-bold">Figura 4</span>
        <span>Bloco do Motor e Junta do Cabeçote</span>
      </p>
      <p class="text-xs text-slate-600 text-left">Inspeção técnica do bloco do motor e da junta de vedação, constatando integridade das galerias de arrefecimento e lubrificação, sem indícios de superaquecimento prévio.</p>
    </div>

    <div class="p-3 border border-slate-200 rounded-lg bg-slate-50/70 space-y-2 text-center">
      <div class="h-44 bg-slate-100 rounded-lg flex items-center justify-center p-1 overflow-hidden border border-slate-200">
        <img src="/assets/laudos/duster/figura_5_gravacao_chassi.jpg" alt="Figura 5: Gravação do Chassi (VIN)" class="w-full h-full object-cover rounded" />
      </div>
      <p class="text-xs font-bold text-slate-800 text-left flex items-center gap-1.5">
        <span class="px-1.5 py-0.5 rounded bg-blue-100 text-[#0B1E3D] text-[10px] font-bold">Figura 5</span>
        <span>Gravação do Chassi (VIN)</span>
      </p>
      <p class="text-xs text-slate-600 text-left">Confronto físico da numeração de chassi gravada na estrutura do veículo (093YHSRAF500GJ3983670), confirmando autenticidade e rastreabilidade cadastral.</p>
    </div>

    <div class="p-3 border border-slate-200 rounded-lg bg-slate-50/70 space-y-2 text-center">
      <div class="h-44 bg-slate-100 rounded-lg flex items-center justify-center p-1 overflow-hidden border border-slate-200">
        <img src="/assets/laudos/duster/figura_6_dutos_admissao.jpg" alt="Figura 6: Dutos e Componentes de Admissão" class="w-full h-full object-cover rounded" />
      </div>
      <p class="text-xs font-bold text-slate-800 text-left flex items-center gap-1.5">
        <span class="px-1.5 py-0.5 rounded bg-blue-100 text-[#0B1E3D] text-[10px] font-bold">Figura 6</span>
        <span>Dutos e Componentes de Admissão</span>
      </p>
      <p class="text-xs text-slate-600 text-left">Inspeção periférica dos dutos de admissão e chicotes elétricos de injeção, apresentando conformidade de montagem e ausência de corpos estranhos.</p>
    </div>

    <div class="p-3 border border-slate-200 rounded-lg bg-slate-50/70 space-y-2 text-center col-span-1 md:col-span-2 max-w-md mx-auto">
      <div class="h-48 bg-slate-100 rounded-lg flex items-center justify-center p-1 overflow-hidden border border-slate-200">
        <img src="/assets/laudos/duster/figura_7_duster_frontal.jpg" alt="Figura 7: Vista Frontal Geral da Renault Duster" class="w-full h-full object-cover rounded" />
      </div>
      <p class="text-xs font-bold text-slate-800 text-left flex items-center gap-1.5">
        <span class="px-1.5 py-0.5 rounded bg-blue-100 text-[#0B1E3D] text-[10px] font-bold">Figura 7</span>
        <span>Vista Frontal Geral da Renault Duster</span>
      </p>
      <p class="text-xs text-slate-600 text-left">Registro do veículo oficial do Ministério Público de Pernambuco (Placa PGX-9708) posicionado nas dependências da oficina ADF para execução da perícia mecânica.</p>
    </div>

  </div>
</div>`,
      itens: [],
      fotos: FOTOS_DUSTER_EVIDENCIAS
    },
    {
      id: 'sec-9',
      titulo: 'Legislação e Normas Técnicas',
      ordem: 9,
      conteudoHtml: `<div class="space-y-3 text-xs text-slate-700 leading-relaxed">
  <p class="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">SEÇÃO V - LEGISLAÇÃO E NORMAS TÉCNICAS</p>
  <p>A presente avaliação pericial pauta-se nos preceitos do <strong>Código de Defesa do Consumidor (Lei n.º 8.078/1990, em especial o seu art. 26, inciso II)</strong> no que tange ao prazo decadencial e de garantia legal de <strong>90 (noventa) dias</strong> para a prestação de serviços e fornecimento de produtos duráveis, bem como nas normas técnicas da <strong>ABNT</strong> aplicáveis à inspeção veicular e análise de falhas em materiais metálicos.</p>
  <p>Ademais, a metodologia aplicada para a apuração da causa raiz fundamenta-se nos princípios da <strong>Engenharia de Materiais e Mecânica dos Sólidos</strong>, observando os critérios de exame macroscópico, análise de fadiga e rastreabilidade de histórico de manutenção.</p>
</div>`,
      itens: [],
      fotos: []
    },
    {
      id: 'sec-10',
      titulo: 'Constatação de Danos e Análise de Causa Raiz',
      ordem: 10,
      conteudoHtml: `<div class="space-y-3 text-xs text-slate-700 leading-relaxed">
  <p class="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">SEÇÃO VI - CONSTATAÇÃO DE DANOS E ANÁLISE DE CAUSA RAIZ</p>
  <p>A inspeção técnica pautada nas evidências físicas evidencia que a pane mecânica foi deflagrada pela <strong>ruptura total da correia dentada do sistema de distribuição</strong>. O rompimento do componente causou a perda imediata da sincronização mecânica entre o virabrequim e o comando de válvulas, gerando o choque de interferência física entre as válvulas e as coroas dos pistões (<em>"atropelamento de válvulas"</em>), o que danificou o cabeçote e tornou obrigatória a execução de novos serviços de retífica e substituição de componentes internos.</p>
  
  <div class="my-3 p-3 bg-white border border-slate-200 rounded-xl shadow-xs text-center">
    <img src="/assets/laudos/duster/diagrama_motor_interferencia.jpg" alt="Diagrama: Motor de Interferência — Quando a Distribuição Falha" class="max-h-72 w-auto mx-auto object-contain rounded-lg border border-slate-100" />
    <p class="text-[10.5px] text-slate-600 font-semibold mt-2">Diagrama Técnico: Cinemática do Motor de Interferência — O dessincronismo provocado pelo colapso da correia causa a invasão mútua do espaço volumétrico da câmara de combustão, acarretando colisão catastrófica entre pistão e válvulas.</p>
  </div>

  <p>Adicionalmente, a análise macroscópica das bordas da correia dentada rompida revelou o aspecto típico de <strong>fadiga mecânica progressiva com estilhaçamento por tração cíclica em ponto de torção</strong>, sem evidências de marcas de atrito lateral crônico causadas por desalinhamento de polias ou travamento do tensionador, o que corrobora o desgaste natural do componente ao longo do tempo de operação. Cumpre destacar que, embora a intervenção preventiva realizada em dezembro de 2025 tenha sido abrangente — contemplando a substituição da retífica de cabeçote, jogo de junta do motor, bomba d'água, velas, cabos, correia dentada, tensor, filtros e a troca de óleo do motor —, a vida útil operacional dos polímeros elastoméricos (HNBR e cordões de tração em fibra de vidro) que compõem a correia dentada é regida por ciclos térmicos e intempéries temporais, os quais se esgotam independentemente da intensidade de uso da frota após transcorrido o prazo legal de garantia.</p>
  
  <div class="p-3 bg-amber-50/80 border-l-4 border-amber-500 rounded my-2">
    <p class="font-bold text-amber-950">Análise Temporal e Jurídica de Garantia:</p>
    <p class="mt-1">Sob a ótica da análise temporal, constata-se que a intervenção prévia ocorreu em dezembro de 2025 e o evento danoso manifestou-se em agosto de 2026. Destaca-se que, apesar de o veículo ter percorrido uma quilometragem reduzida no período (apenas 2.622 km), o transcurso temporal superior a 8 meses excede largamente o prazo legal de 90 dias de garantia aplicável aos serviços executados. Portanto, a ocorrência encontra-se juridicamente fora do prazo de garantia legal da manutenção passada.</p>
  </div>
  
  <p>Ademais, a análise macroscópica dos componentes não revela quaisquer indícios de mau uso, sobregiro intencional ou negligência operacional por parte do condutor, tratando-se de um evento associado à descontinuidade mecânica do componente sob regime de operação após o encerramento da janela de responsabilidade do fornecedor anterior.</p>
</div>`,
      itens: [],
      fotos: []
    },
    {
      id: 'sec-11',
      titulo: 'Tabela de Constatação de Danos e Integridade Técnica',
      ordem: 11,
      conteudoHtml: `<div class="space-y-2">
  <p class="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">SEÇÃO VII - TABELA DE CONSTATAÇÃO DE DANOS E INTEGRIDADE TÉCNICA</p>
  <table class="tiptap-table border-collapse border border-slate-300 w-full my-3">
    <thead>
      <tr>
        <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-center text-xs text-slate-800 w-12">Item</th>
        <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Nome da Peça / Componente</th>
        <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-center text-xs text-slate-800 w-28">Condição: ÍNTEGRO</th>
        <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-center text-xs text-slate-800 w-28">Condição: DANIFICADO</th>
        <th class="border border-slate-300 bg-slate-100 p-2 font-bold text-left text-xs text-slate-800">Parecer Técnico Pericial</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="border border-slate-300 p-2 text-center text-xs">01</td>
        <td class="border border-slate-300 p-2 text-xs font-semibold">Correia Dentada (Distribuição)</td>
        <td class="border border-slate-300 p-2 text-center text-xs text-slate-400">—</td>
        <td class="border border-slate-300 p-2 text-center text-xs font-bold text-red-600">X</td>
        <td class="border border-slate-300 p-2 text-xs"><strong>Causa Raiz:</strong> Componente totalmente rompido, apresentando fadiga e descontinuidade estrutural das fibras.</td>
      </tr>
      <tr>
        <td class="border border-slate-300 p-2 text-center text-xs">02</td>
        <td class="border border-slate-300 p-2 text-xs font-semibold">Cabeçote do Motor</td>
        <td class="border border-slate-300 p-2 text-center text-xs text-slate-400">—</td>
        <td class="border border-slate-300 p-2 text-center text-xs font-bold text-red-600">X</td>
        <td class="border border-slate-300 p-2 text-xs"><strong>Dano Secundário:</strong> Válvulas empenadas e sedes comprometidas devido ao choque mecânico pós-ruptura.</td>
      </tr>
      <tr>
        <td class="border border-slate-300 p-2 text-center text-xs">03</td>
        <td class="border border-slate-300 p-2 text-xs font-semibold">Rolamento Tensor</td>
        <td class="border border-slate-300 p-2 text-center text-xs font-bold text-amber-600">X (Parcial)</td>
        <td class="border border-slate-300 p-2 text-center text-xs text-slate-400">—</td>
        <td class="border border-slate-300 p-2 text-xs">Apresenta condições operacionais normais de giro, sem indícios de travamento prévio que provocasse o corte.</td>
      </tr>
      <tr>
        <td class="border border-slate-300 p-2 text-center text-xs">04</td>
        <td class="border border-slate-300 p-2 text-xs font-semibold">Pistões (Bloco do Motor)</td>
        <td class="border border-slate-300 p-2 text-center text-xs font-bold text-emerald-600">X</td>
        <td class="border border-slate-300 p-2 text-center text-xs text-slate-400">—</td>
        <td class="border border-slate-300 p-2 text-xs">Superfícies superiores preservadas estruturalmente, viabilizando a recomposição por meio da retífica do cabeçote.</td>
      </tr>
    </tbody>
  </table>
</div>`,
      itens: [],
      fotos: []
    },
    {
      id: 'sec-12',
      titulo: 'Conclusão Técnica Pericial & Assinatura',
      ordem: 12,
      conteudoHtml: `<div class="space-y-3 text-xs text-slate-700 leading-relaxed">
  <p class="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">SEÇÃO VIII - CONCLUSÃO</p>
  <div class="p-4 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-lg space-y-2">
    <p>
      Ante o exposto e fundamentado nos princípios da engenharia mecânica e da análise de falhas, conclui-se de forma peremptória que a pane no motor do veículo pertencente ao <strong>Ministério Público de Pernambuco</strong> decorreu da <strong>ruptura da correia dentada</strong>, gerando danos severos ao cabeçote e às válvulas que demandam a execução de serviços corretivos de retífica.
    </p>
    <p>
      Verifica-se, tecnicamente e juridicamente, que o evento danoso ocorreu em <strong>agosto de 2026</strong>, ultrapassando o prazo legal de garantia de <strong>90 dias</strong> referente à intervenção realizada em <strong>dezembro de 2025</strong>. Destaca-se que, embora a quilometragem percorrida no intervalo tenha sido exígua (<strong>2.622 km</strong>), o fator temporal determina o esgotamento da garantia legal.
    </p>
    <p class="font-semibold text-slate-900">
      Inexistem indícios materiais de mau uso ou operação inadequada pelo condutor, recaindo sobre a gestão a necessidade de adoção das providências para a nova intervenção corretiva no ativo.
    </p>
  </div>
  <div class="mt-4 pt-2 border-t border-slate-200">
    <p>Acompanha o presente Laudo de Avaliação Técnica Pericial a devida <strong>Anotação de Responsabilidade Técnica (ART PE20261621255)</strong> emitida e registrada junto ao Conselho Regional de Engenharia e Agronomia (CREA-PE).</p>
    <p class="font-medium text-slate-800 mt-1">E, para que produza os seus efeitos legais e técnicos, lavrei o presente documento.</p>
  </div>
</div>`,
      itens: [],
      fotos: []
    }
  ],
  assinaturaDigital: {
    responsavelNome: 'Eng. Vitor Leonardo Cordeiro Linhares',
    responsavelCrea: 'CREA-PE 1822299490',
    dataHora: '2026-10-02T10:00:00Z',
    hashAutenticidade: 'AUT-VL-FALHA-DUSTER-2026-9708',
    assinaturaUrl: '/vitor-leonardo.png'
  },
  usoIA: { chamadas: 1 },
  modoCriacao: 'sugestao_ia',
  iniciadoComIA: true,
  criadoEm: '2026-10-01T10:00:00Z',
  atualizadoEm: '2026-10-02T14:30:00Z'
};
