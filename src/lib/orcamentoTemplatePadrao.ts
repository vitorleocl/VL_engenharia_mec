import { Orcamento, OrcamentoSecao, Cliente, Ativo } from '../types';

export interface SecaoDefinicao {
  id: string;
  numero: number;
  titulo: string;
  subtitulo?: string;
}

export const SECOES_PROPOSTA_DEFINICAO: SecaoDefinicao[] = [
  { id: 'capa', numero: 1, titulo: 'Capa e Identificação do Cliente', subtitulo: 'LAUDOS, VISTORIAS & RESPONSABILIDADE TÉCNICA' },
  { id: 'missao', numero: 2, titulo: 'Nossa Missão, Propósito & Credenciais Técnicas', subtitulo: 'DIREÇÃO TÉCNICA & HABILITAÇÃO CREA-PE' },
  { id: 'principios', numero: 3, titulo: 'Nossos Princípios Fundamentais', subtitulo: 'VALORES INEGOCIÁVEIS EM CADA AVALIAÇÃO' },
  { id: 'entregamos', numero: 4, titulo: 'O Que Entregamos (Soluções Técnicas)', subtitulo: 'SEGURANÇA, CUSTO-BENEFÍCIO & RESPALDO COM ART' },
  { id: 'problemas', numero: 5, titulo: 'Problemas que Ajudamos a Resolver', subtitulo: 'DIAGNÓSTICO PREVENTIVO & MITIGAÇÃO DE RISCOS' },
  { id: 'catalogo', numero: 6, titulo: 'Resumo de Nossos Serviços de Engenharia', subtitulo: 'CATÁLOGO DE LAUDOS E ADEQUAÇÕES INDUSTRIAIS' },
  { id: 'identificacao', numero: 7, titulo: 'Identificação das Partes & Demanda', subtitulo: 'QUADRO TÉCNICO COMPARATIVO DAS ENTIDADES' },
  { id: 'equipe', numero: 8, titulo: 'Nossa Equipe & Estrutura da Proposta', subtitulo: 'RESPONSABILIDADE TÉCNICA EM 3 ETAPAS' },
  { id: 'etapa1', numero: 9, titulo: 'Etapa 1 - Relação dos Serviços & Levantamento Fotográfico', subtitulo: 'DIRETRIZES DE CAMPO E EVIDÊNCIAS INICIAIS' },
  { id: 'etapa2', numero: 10, titulo: 'Etapa 2 - Escopo Técnico das Atividades (Metodologia)', subtitulo: 'FASES, CHECKLISTS E ENSAIOS EM 5 ETAPAS' },
  { id: 'operacional', numero: 11, titulo: 'Informações Técnicas Operacionais & Diretrizes', subtitulo: 'OBRIGAÇÕES E CONDIÇÕES OPERACIONAIS' },
  { id: 'etapa3', numero: 12, titulo: 'Etapa 3 - Prazo, Pagamento & Investimento', subtitulo: 'INVESTIMENTO COMERCIAL E TERMOS FINANCEIROS' },
  { id: 'contato', numero: 13, titulo: 'Agradecimento & Contato', subtitulo: 'INFORMAÇÕES INSTITUCIONAIS E ATENDIMENTO DIRETO' },
];

/**
 * Retorna as 13 seções padrão preenchidas com dados da proposta individual.
 * Regra Crítica: Esta função é o molde gerador que cria a CÓPIA INDIVIDUAL editável.
 * O modelo padrão nunca é sobrescrito pelas edições de um orçamento.
 */
export function gerarSecoesPadraoOrcamento(
  orcamento: Orcamento,
  dadosExtras?: { cliente?: Cliente; ativo?: Ativo }
): OrcamentoSecao[] {
  const clienteNome = orcamento.clienteNome || dadosExtras?.cliente?.razaoSocial || 'Cliente Corporativo';
  const cnpj = orcamento.cnpjCliente || dadosExtras?.cliente?.cpfCnpj || 'Consulte o contrato';
  const primeiroContato = dadosExtras?.cliente?.contatos?.[0];
  const representante = orcamento.representanteNome || primeiroContato?.nome || 'Diretoria / Coordenação Técnica';
  const email = orcamento.emailCliente || primeiroContato?.email || 'contato@cliente.com.br';
  const telefone = orcamento.telefoneCliente || primeiroContato?.telefone || '(81) 98444-2592';
  const localidade = orcamento.localidadeServico || (dadosExtras?.cliente?.endereco?.cidade ? `${dadosExtras.cliente.endereco.cidade}/${dadosExtras.cliente.endereco.estado}` : 'Recife e Região Metropolitana - PE');
  const servico = orcamento.servico || 'Laudo Técnico Pericial de Engenharia Mecânica';
  const valor = orcamento.valorFormatado || (orcamento.valor ? orcamento.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 3.500,00');
  const validade = orcamento.validadeDias || 15;
  const prazo = orcamento.prazoEntrega || `${orcamento.prazoDias || 7} dias úteis`;
  const condicoes = orcamento.condicoesPagamento || '50% de entrada na aprovação e 50% após emissão do laudo final e ART.';
  const normas = orcamento.normasTecnicas || 'ABNT NBR, NR-11, NR-12, NR-13 conforme aplicável';
  const escopo = orcamento.descricaoEscopo || 'Inspeção técnica presencial, ensaios não destrutivos, verificação de conformidade normativa e emissão de ART oficial.';
  const ativoIden = orcamento.ativoIdentificacao || dadosExtras?.ativo?.identificacao || 'Ativo conforme especificação do cliente';
  const codigo = orcamento.codigoProposta || orcamento.id;

  return [
    {
      id: 'capa',
      numero: 1,
      titulo: 'Capa e Identificação do Cliente',
      subtitulo: 'LAUDOS, VISTORIAS & RESPONSABILIDADE TÉCNICA',
      conteudoHtml: `<div class="space-y-4">
        <div class="border-b border-slate-200 pb-3">
          <h2 class="text-xl sm:text-2xl font-black text-[#0B1E3D] tracking-tight">PROPOSTA TÉCNICA COMERCIAL // ORÇAMENTO DE ENGENHARIA</h2>
          <p class="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mt-1">LAUDOS, VISTORIAS & RESPONSABILIDADE TÉCNICA</p>
        </div>
        <p class="text-slate-700 text-xs sm:text-sm leading-relaxed">
          Prestação de serviços especializados em Engenharia Mecânica, diagnóstico de integridade estrutural, conformidade legal com as Normas Regulamentadoras do Ministério do Trabalho e emissão de Anotação de Responsabilidade Técnica (ART) oficial.
        </p>
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4 text-xs space-y-2">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div><span class="text-slate-500 font-medium">Cliente / Razão Social:</span> <strong class="text-slate-900 block">${clienteNome}</strong></div>
            <div><span class="text-slate-500 font-medium">CNPJ / CPF:</span> <strong class="text-slate-900 block">${cnpj}</strong></div>
            <div><span class="text-slate-500 font-medium">Representante:</span> <strong class="text-slate-900 block">${representante}</strong></div>
            <div><span class="text-slate-500 font-medium">Localidade:</span> <strong class="text-slate-900 block">${localidade}</strong></div>
          </div>
          <div class="pt-2 border-t border-slate-200 grid grid-cols-3 gap-2 text-[11px]">
            <div><strong>Código:</strong> ${codigo}</div>
            <div><strong>Validade:</strong> ${validade} dias</div>
            <div><strong>Prazo de Entrega:</strong> ${prazo}</div>
          </div>
        </div>
      </div>`
    },
    {
      id: 'missao',
      numero: 2,
      titulo: 'Nossa Missão, Propósito & Credenciais Técnicas',
      subtitulo: 'DIREÇÃO TÉCNICA, PERFIL PROFISSIONAL & HABILITAÇÃO CREA-PE',
      conteudoHtml: `<div class="space-y-4">
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 rounded-xl border border-slate-200 bg-slate-50/80">
          <div class="shrink-0 text-center">
            <img src="/vitor-leonardo.png" alt="Eng. Vitor Leonardo Cordeiro Linhares" class="w-32 h-38 object-cover rounded-lg shadow-sm border-2 border-[#1565D8] mx-auto bg-slate-200" />
            <span class="inline-block mt-2 px-2.5 py-0.5 rounded bg-[#0B1E3D] text-white text-[10px] font-bold tracking-wider uppercase font-mono">CREA-PE 182229949-0</span>
          </div>
          <div class="space-y-2 text-left">
            <h3 class="text-base font-black text-[#0B1E3D]">Eng. Vitor Leonardo Cordeiro Linhares</h3>
            <p class="text-xs font-bold text-[#1565D8] tracking-wide uppercase">Engenheiro Mecânico Responsável Técnico & Perito Especialista</p>
            <p class="text-slate-700 text-xs leading-relaxed">
              Graduado em Engenharia Mecânica com registro ativo no Conselho Regional de Engenharia e Agronomia de Pernambuco (CREA-PE). Especialista em engenharia diagnóstica, laudos periciais mecânicos, adequação a Normas Regulamentadoras federais (NR-11, NR-12, NR-13), projetos de climatização (PMOC), prevenção contra incêndio e ensaios não destrutivos.
            </p>
            <div class="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600 font-medium">
              <div class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>Emissão Oficial de ART</div>
              <div class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>Engenharia Diagnóstica</div>
              <div class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>Conformidade ABNT / NRs</div>
              <div class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>Respaldo Jurídico-Pericial</div>
            </div>
          </div>
        </div>

        <blockquote class="p-3 border-l-4 border-[#0B1E3D] bg-slate-50 italic text-slate-800 text-xs font-medium">
          "Contribuir para um ambiente operacional mais seguro, eficiente e juridicamente protegido, combinando rigor técnico pericial com agilidade e ética profissional inegociável."
        </blockquote>
        <p class="text-slate-700 text-xs leading-relaxed">
          Sob a liderança do Eng. Vitor Leonardo, aliamos sólida base analítica às mais modernas metodologias de inspeção de máquinas, equipamentos e sistemas mecânicos, assegurando aos nossos clientes total conformidade perante os órgãos fiscalizadores (Ministério do Trabalho, CBMPE e CREA).
        </p>
      </div>`
    },
    {
      id: 'principios',
      numero: 3,
      titulo: 'Nossos Princípios Fundamentais',
      subtitulo: 'VALORES INEGOCIÁVEIS EM CADA AVALIAÇÃO',
      conteudoHtml: `<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div class="p-3 rounded-lg border border-slate-200 bg-white">
          <h4 class="font-bold text-[#0B1E3D] text-sm mb-1">1. CONFIANÇA NA ENTREGA</h4>
          <p class="text-slate-600 leading-relaxed">Rigor absoluto nos prazos assumidos. Nossos laudos periciais são emitidos com celeridade para manter suas operações ativas e sem atrasos.</p>
        </div>
        <div class="p-3 rounded-lg border border-slate-200 bg-white">
          <h4 class="font-bold text-[#0B1E3D] text-sm mb-1">2. ÉTICA & IMPARCIALIDADE</h4>
          <p class="text-slate-600 leading-relaxed">Transparência em cada avaliação física. Pareceres técnicos fundamentados estritamente na verdade fática e nas diretrizes normativas da ABNT.</p>
        </div>
        <div class="p-3 rounded-lg border border-slate-200 bg-white">
          <h4 class="font-bold text-[#0B1E3D] text-sm mb-1">3. FOCO NO CLIENTE</h4>
          <p class="text-slate-600 leading-relaxed">Simplificamos procedimentos técnicos complexos, transformando exigências regulatórias em melhorias de produtividade e segurança do trabalho.</p>
        </div>
        <div class="p-3 rounded-lg border border-slate-200 bg-white">
          <h4 class="font-bold text-[#0B1E3D] text-sm mb-1">4. PARCERIA DE LONGO PRAZO</h4>
          <p class="text-slate-600 leading-relaxed">Mais que uma prestação de serviço pontual, oferecemos suporte consultivo contínuo pós-entrega de laudos e laço corporativo de excelência.</p>
        </div>
      </div>`
    },
    {
      id: 'entregamos',
      numero: 4,
      titulo: 'O Que Entregamos (Soluções Técnicas)',
      subtitulo: 'SEGURANÇA, CUSTO-BENEFÍCIO & RESPALDO COM ART',
      conteudoHtml: `<div class="space-y-2.5 text-xs">
        <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <strong class="text-[#0B1E3D] block text-sm mb-0.5">AMBIENTE OPERACIONAL SEGURO:</strong>
          <span class="text-slate-600">Garantia técnica de conformidade, mitigando substancialmente riscos de acidentes de trabalho e preservando a vida dos operadores.</span>
        </div>
        <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <strong class="text-[#0B1E3D] block text-sm mb-0.5">OTIMIZAÇÃO CUSTO X BENEFÍCIO:</strong>
          <span class="text-slate-600">Recomendações assertivas e viáveis de engenharia mecânica que eliminam gastos supérfluos e retrabalhos caros.</span>
        </div>
        <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <strong class="text-[#0B1E3D] block text-sm mb-0.5">RESPALDO JURÍDICO COM ART REGISTRADA:</strong>
          <span class="text-slate-600">Emissão de Anotação de Responsabilidade Técnica registrada no CREA-PE para atendimento formal a auditorias fiscais e judiciais.</span>
        </div>
        <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <strong class="text-[#0B1E3D] block text-sm mb-0.5">QUALIDADE E CONFIABILIDADE DE LAUDO:</strong>
          <span class="text-slate-600">Dossiês completos com fotos de alta resolução, medições quantitativas e embasamento em perícia técnica.</span>
        </div>
      </div>`
    },
    {
      id: 'problemas',
      numero: 5,
      titulo: 'Problemas que Ajudamos a Resolver',
      subtitulo: 'DIAGNÓSTICO PREVENTIVO & MITIGAÇÃO DE RISCOS',
      conteudoHtml: `<div class="space-y-2 text-xs">
        <div class="p-2.5 rounded border border-slate-200 bg-white">
          <span class="font-bold text-red-700 block">1. Risco Iminente de Acidentes:</span>
          <p class="text-slate-600">Diagnóstico proativo de falhas de fadiga de materiais, folgas mecânicas ou ausência de dispositivos de proteção.</p>
        </div>
        <div class="p-2.5 rounded border border-slate-200 bg-white">
          <span class="font-bold text-amber-700 block">2. Notificações e Autuações Fiscais:</span>
          <p class="text-slate-600">Adequação técnica completa contra multas do Ministério do Trabalho e autos de infração do Corpo de Bombeiros.</p>
        </div>
        <div class="p-2.5 rounded border border-slate-200 bg-white">
          <span class="font-bold text-blue-700 block">3. Interdição e Paradas Não Programadas:</span>
          <p class="text-slate-600">Elaboração de planos corretivos para reativação imediata de linhas e equipamentos embargados.</p>
        </div>
        <div class="p-2.5 rounded border border-slate-200 bg-white">
          <span class="font-bold text-purple-700 block">4. Incerteza e Retrabalho Técnico:</span>
          <p class="text-slate-600">Projetos assertivos de engenharia mecânica para reformas e adequações que solucionam na primeira intervenção.</p>
        </div>
      </div>`
    },
    {
      id: 'catalogo',
      numero: 6,
      titulo: 'Resumo de Nossos Serviços de Engenharia',
      subtitulo: 'CATÁLOGO DE LAUDOS E ADEQUAÇÕES INDUSTRIAIS',
      conteudoHtml: `<div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
        <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <strong class="text-[#0B1E3D] block text-sm mb-1">NR-12 • MÁQUINAS INDUSTRIAIS</strong>
          <p class="text-slate-600 text-[11px]">Apreciação de risco, inventário e laudos de adequação mecânica de prensas, tornos, esteiras e células robotizadas.</p>
        </div>
        <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <strong class="text-[#0B1E3D] block text-sm mb-1">NR-11 • MOVIMENTAÇÃO DE CARGAS</strong>
          <p class="text-slate-600 text-[11px]">Guindastes, pontes rolantes, empilhadeiras, pórticos e ensaios de tração em olhais e cabos de aço.</p>
        </div>
        <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <strong class="text-[#0B1E3D] block text-sm mb-1">NR-13 • CALDEIRAS E VASOS DE PRESSÃO</strong>
          <p class="text-slate-600 text-[11px]">Teste hidrostático, medição de espessura por ultrassom, reconstituição de prontuário e calibração de PSV.</p>
        </div>
        <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <strong class="text-[#0B1E3D] block text-sm mb-1">PMOC • CLIMATIZAÇÃO</strong>
          <p class="text-slate-600 text-[11px]">Plano de Manutenção Operação e Controle conforme Lei Federal 13.589/2018 para qualidade do ar e eficiência energética.</p>
        </div>
      </div>`
    },
    {
      id: 'identificacao',
      numero: 7,
      titulo: 'Identificação das Partes & Demanda',
      subtitulo: 'QUADRO TÉCNICO COMPARATIVO DAS ENTIDADES',
      conteudoHtml: `<div class="overflow-x-auto">
        <table class="tiptap-table w-full text-xs text-left border-collapse border border-slate-300">
          <thead>
            <tr class="bg-[#0B1E3D] text-white">
              <th class="p-2.5 border border-slate-300 font-bold w-1/2">INFORMAÇÕES DA CONTRATADA (VL ENGENHARIA)</th>
              <th class="p-2.5 border border-slate-300 font-bold w-1/2">INFORMAÇÕES DA CONTRATANTE (CLIENTE)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-2.5 border border-slate-300 align-top space-y-1">
                <p><strong>Razão Social:</strong> VL ENGENHARIA MECÂNICA LTDA</p>
                <p><strong>Responsável Técnico:</strong> Eng. Vitor Leonardo C. Linhares</p>
                <p><strong>CREA-PE:</strong> 182229949-0</p>
                <p><strong>Sede Operacional:</strong> Recife / Paulista - PE</p>
                <p><strong>E-mail:</strong> vitorleonardocl@gmail.com</p>
                <p><strong>Telefone / WhatsApp:</strong> (81) 98444-2592</p>
              </td>
              <td class="p-2.5 border border-slate-300 align-top space-y-1">
                <p><strong>Razão Social:</strong> ${clienteNome}</p>
                <p><strong>CNPJ/CPF:</strong> ${cnpj}</p>
                <p><strong>Representante:</strong> ${representante}</p>
                <p><strong>E-mail:</strong> ${email}</p>
                <p><strong>Telefone:</strong> ${telefone}</p>
                <p><strong>Localidade:</strong> ${localidade}</p>
              </td>
            </tr>
            <tr class="bg-slate-50 font-medium">
              <td colspan="2" class="p-2.5 border border-slate-300 text-slate-800">
                <strong>OBJETO DA PROPOSTA:</strong> ${servico} | <strong>Ativo Principal:</strong> ${ativoIden} | <strong>Ref:</strong> ${codigo}
              </td>
            </tr>
          </tbody>
        </table>
      </div>`
    },
    {
      id: 'equipe',
      numero: 8,
      titulo: 'Nossa Equipe & Estrutura da Proposta',
      subtitulo: 'RESPONSABILIDADE TÉCNICA EM 3 ETAPAS',
      conteudoHtml: `<div class="space-y-4 text-xs leading-relaxed">
        <p class="text-slate-700">
          Nossos laudos, pareceres e vistorias são elaborados, assinados e homologados exclusivamente por Engenheiros Mecânicos habilitados com registro regular ativo no CREA-PE. Garantimos a plena responsabilidade técnica (ART) sobre cada equipamento avaliado.
        </p>
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <h4 class="font-bold text-[#0B1E3D] text-sm mb-2">Estrutura da Proposta Técnica em 3 Etapas Fundamentais:</h4>
          <ul class="space-y-2 list-disc list-inside text-slate-700">
            <li><strong>Etapa 1: Relação e Descrição dos Serviços</strong> — Normas técnicas associadas, escopo preliminar e levantamento fotográfico de campo.</li>
            <li><strong>Etapa 2: Escopo Técnico das Atividades (Metodologia)</strong> — 5 fases sequenciais de inspeção, checklists normativos e ensaios instrumentados.</li>
            <li><strong>Etapa 3: Prazo, Pagamento & Investimento Comercial</strong> — Cronograma executivo, condições facilitadas de parcelamento e homologação com ART.</li>
          </ul>
        </div>
      </div>`
    },
    {
      id: 'etapa1',
      numero: 9,
      titulo: 'Etapa 1 - Relação dos Serviços & Levantamento Fotográfico',
      subtitulo: 'DIRETRIZES DE CAMPO E EVIDÊNCIAS INICIAIS',
      conteudoHtml: `<div class="space-y-4 text-xs">
        <div class="p-3 bg-blue-50/60 rounded-lg border border-blue-200 space-y-1">
          <p><strong>Serviço Contratado:</strong> ${servico}</p>
          <p><strong>Ativo Avaliado:</strong> ${ativoIden}</p>
          <p><strong>Normas de Referência:</strong> ${normas}</p>
          <p class="text-slate-600 mt-1">${escopo}</p>
        </div>
        <div class="p-4 border-2 border-dashed border-slate-300 rounded-xl text-center bg-slate-50/70">
          <p class="font-bold text-slate-700 mb-1">Levantamento Fotográfico Preliminar do Ativo / Instalação</p>
          <p class="text-slate-500 text-[11px]">As evidências fotográficas coletadas em campo durante a inspeção visual são integradas com alta resolução no laudo definitivo.</p>
          <p class="text-slate-400 text-[10px] mt-2 italic">(Você pode inserir fotos adicionais ou diagramas diretamente nesta seção pelo editor rico)</p>
        </div>
      </div>`
    },
    {
      id: 'etapa2',
      numero: 10,
      titulo: 'Etapa 2 - Escopo Técnico das Atividades (Metodologia)',
      subtitulo: 'FASES, CHECKLISTS E ENSAIOS EM 5 ETAPAS',
      conteudoHtml: `<div class="overflow-x-auto">
        <table class="tiptap-table w-full text-xs text-left border-collapse border border-slate-300">
          <thead>
            <tr class="bg-[#0B1E3D] text-white">
              <th class="p-2.5 border border-slate-300 w-16 text-center">FASE</th>
              <th class="p-2.5 border border-slate-300 w-44">ATIVIDADE TÉCNICA</th>
              <th class="p-2.5 border border-slate-300">DESCRIÇÃO OPERACIONAL E NORMATIVA</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr>
              <td class="p-2.5 font-bold text-center border border-slate-300 text-[#1565D8]">Item 01</td>
              <td class="p-2.5 font-semibold border border-slate-300">Inspeção Visual In Loco</td>
              <td class="p-2.5 border border-slate-300">Vistoria presencial minuciosa do ativo para mapeamento de não-conformidades de segurança, desgastes mecânicos e análise física do ambiente fabril.</td>
            </tr>
            <tr class="bg-slate-50">
              <td class="p-2.5 font-bold text-center border border-slate-300 text-[#1565D8]">Item 02</td>
              <td class="p-2.5 font-semibold border border-slate-300">Aplicação de Checklists Normativos</td>
              <td class="p-2.5 border border-slate-300">Verificação item por item das exigências regulamentadoras vigentes (${normas}), avaliando conformidade estrutural, elétrica e de proteções físicas.</td>
            </tr>
            <tr>
              <td class="p-2.5 font-bold text-center border border-slate-300 text-[#1565D8]">Item 03</td>
              <td class="p-2.5 font-semibold border border-slate-300">Ensaios e Medições Físicas</td>
              <td class="p-2.5 border border-slate-300">Ensaios não destrutivos cabíveis, testes funcionais de paradas de emergência, verificação de folgas axiais, espessuras e aferição de salvaguardas.</td>
            </tr>
            <tr class="bg-slate-50">
              <td class="p-2.5 font-bold text-center border border-slate-300 text-[#1565D8]">Item 04</td>
              <td class="p-2.5 font-semibold border border-slate-300">Dossiê Técnico e Parecer Conclusivo</td>
              <td class="p-2.5 border border-slate-300">Elaboração de laudo pericial detalhado contendo relatório fotográfico colorido, matriz de risco quantitativa (HRN/SIL) e plano de ação corretivo claro.</td>
            </tr>
            <tr>
              <td class="p-2.5 font-bold text-center border border-slate-300 text-[#1565D8]">Item 05</td>
              <td class="p-2.5 font-semibold border border-slate-300">Emissão e Registro da ART CREA-PE</td>
              <td class="p-2.5 border border-slate-300">Anotação de Responsabilidade Técnica emitida eletronicamente junto ao CREA-PE, outorgando fé pública e proteção jurídica irrestrita ao contratante.</td>
            </tr>
          </tbody>
        </table>
      </div>`
    },
    {
      id: 'operacional',
      numero: 11,
      titulo: 'Informações Técnicas Operacionais & Diretrizes',
      subtitulo: 'OBRIGAÇÕES E CONDIÇÕES OPERACIONAIS',
      conteudoHtml: `<div class="space-y-4 text-xs">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 font-medium">
          <div><span class="text-slate-500 block text-[11px]">Ativos Inspecionados:</span> <strong>${orcamento.qtdEquipamentos || '01 Ativo Principal'}</strong></div>
          <div><span class="text-slate-500 block text-[11px]">Horas Técnicas:</span> <strong>${orcamento.horasEngenharia || '16 horas de engenharia'}</strong></div>
          <div><span class="text-slate-500 block text-[11px]">Mobilização:</span> <strong>${orcamento.mobilizacao || 'Imediata / até 48h úteis'}</strong></div>
        </div>
        <div class="space-y-2">
          <h4 class="font-bold text-[#0B1E3D] text-xs">Diretrizes Operacionais e Condições de Acesso:</h4>
          <ul class="space-y-1.5 list-disc list-inside text-slate-700 leading-relaxed">
            <li>Livre acesso às instalações e máquinas objeto do laudo no dia e horário previamente agendados;</li>
            <li>Acompanhamento por responsável técnico, encarregado de manutenção ou operador da máquina;</li>
            <li>Disponibilização de manuais de operação, prontuários anteriores ou diagramas caso existentes;</li>
            <li>Observância de protocolos de segurança do trabalho do pátio industrial (EPIs aplicáveis).</li>
          </ul>
        </div>
      </div>`
    },
    {
      id: 'etapa3',
      numero: 12,
      titulo: 'Etapa 3 - Prazo, Pagamento & Investimento',
      subtitulo: 'INVESTIMENTO COMERCIAL E TERMOS FINANCEIROS',
      conteudoHtml: `<div class="space-y-4 text-xs">
        <div class="p-4 bg-slate-50 rounded-xl border-2 border-[#1565D8] text-center space-y-1.5">
          <span class="text-xs text-slate-500 uppercase tracking-wider font-bold">Investimento Comercial Líquido</span>
          <div class="text-2xl sm:text-3xl font-black text-[#0B1E3D] font-mono my-1">${valor}</div>
          <p class="text-[11px] text-emerald-800 font-semibold">
            ✓ Inclusos: Taxas de Registro da ART junto ao CREA-PE, deslocamentos e emissão de Nota Fiscal de Serviços (NFS-e).
          </p>
        </div>
        <div class="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2 text-slate-700">
          <p><strong>Prazo de Execução e Emissão Final:</strong> ${prazo}</p>
          <p><strong>Formas e Condições de Pagamento:</strong> ${condicoes}</p>
          <p><strong>Validade da Proposta:</strong> ${validade} dias a contar da data de emissão.</p>
          <p><strong>Dados para Faturamento / PIX:</strong> Chave CNPJ: 45.123.890/0001-23 (VL Engenharia Mecânica Ltda)</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-center">
          <div class="p-3 border rounded-lg bg-white">
            <p class="font-bold text-slate-800">Eng. Vitor Leonardo C. Linhares</p>
            <p class="text-slate-500 text-[10px]">Responsável Técnico CREA-PE 182229949-0</p>
            <span class="inline-block mt-1 text-[10px] text-emerald-600 font-bold">Assinado Digitalmente pelo Emissor</span>
          </div>
          <div class="p-3 border rounded-lg bg-white border-dashed">
            <p class="font-bold text-slate-800">${representante}</p>
            <p class="text-slate-500 text-[10px]">${clienteNome}</p>
            <span class="inline-block mt-1 text-[10px] text-amber-600 font-bold">[Aceite Eletrônico / Assinatura Digital]</span>
          </div>
        </div>
      </div>`
    },
    {
      id: 'contato',
      numero: 13,
      titulo: 'Agradecimento & Contato',
      subtitulo: 'INFORMAÇÕES INSTITUCIONAIS E ATENDIMENTO DIRETO',
      conteudoHtml: `<div class="space-y-4 text-xs text-center py-2">
        <p class="text-slate-700 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          A <strong>VL Engenharia Mecânica</strong> agradece a oportunidade de apresentar esta Proposta Técnico-Comercial. Colocamo-nos à disposição para qualquer esclarecimento técnico ou alinhamento de cronograma operacional.
        </p>
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 inline-block text-left max-w-md w-full space-y-1.5 text-xs text-slate-700">
          <p class="font-black text-[#0B1E3D] text-sm">VL Engenharia Mecânica & Consultoria Pericial</p>
          <p>Recife / Região Metropolitana - Pernambuco, Brasil</p>
          <p><strong>Telefone / WhatsApp:</strong> (81) 98444-2592</p>
          <p><strong>E-mail Direto:</strong> vitorleonardocl@gmail.com</p>
          <p><strong>Instagram Oficial:</strong> @vlengenharia</p>
        </div>
      </div>`
    }
  ];
}

/**
 * Converte paginasProposta para o formato de seções ricas caso ainda não existam.
 */
export function converterPaginasParaSecoes(paginas: { numero: number; titulo: string; subtitulo?: string; conteudoHtml: string }[]): OrcamentoSecao[] {
  return paginas.map((pag, idx) => {
    const def = SECOES_PROPOSTA_DEFINICAO.find(d => d.numero === pag.numero) || SECOES_PROPOSTA_DEFINICAO[idx];
    return {
      id: def ? def.id : `secao-${pag.numero}`,
      numero: pag.numero,
      titulo: pag.titulo || def?.titulo || `Seção ${pag.numero}`,
      subtitulo: pag.subtitulo || def?.subtitulo,
      conteudoHtml: pag.conteudoHtml || '<p></p>',
    };
  });
}
