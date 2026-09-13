import React, { useRef, useState, useMemo } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  ChevronLeft, 
  ChevronRight, 
  FileSpreadsheet, 
  CheckCircle2, 
  Building2, 
  Phone, 
  Mail, 
  FileCheck2, 
  ShieldCheck, 
  Sparkles,
  Layers,
  ArrowRight,
  Loader2,
  Edit3
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { Orcamento, PropostaPagina } from '../../types';
import { EngineeringWatermark } from '../common/EngineeringWatermark';

interface PropostaViewerModalProps {
  orcamento: Orcamento;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (id: string, novoStatus: Orcamento['status']) => void;
  onGerarLaudo?: (orc: Orcamento) => void;
  onEditarProposta?: (orc: Orcamento) => void;
}

function gerarPaginasPadrao(orcamento: Orcamento): PropostaPagina[] {
  const clienteNome = orcamento.clienteNome || 'Cliente Corporativo';
  const cnpj = orcamento.cnpjCliente || 'Não informado';
  const servico = orcamento.servico || 'Laudo Técnico Pericial de Engenharia Mecânica';
  const valor = orcamento.valorFormatado || `R$ ${orcamento.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  const validade = orcamento.validadeDias || 15;
  const prazo = orcamento.prazoEntrega || `${orcamento.prazoDias || 7} dias úteis`;
  const condicoes = orcamento.condicoesPagamento || '50% de entrada na aprovação e 50% na emissão do laudo final e ART.';
  const normas = orcamento.normasTecnicas || 'ABNT NBR, NR-11, NR-12, NR-13 conforme aplicável';
  const escopo = orcamento.descricaoEscopo || 'Inspeção técnica presencial, ensaios não destrutivos, verificação de conformidade normativa e emissão de ART oficial.';

  return [
    {
      numero: 1,
      titulo: "CAPA E IDENTIFICAÇÃO DO CLIENTE",
      subtitulo: "LAUDOS, VISTORIAS & RESPONSABILIDADE TÉCNICA",
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
            <div><span class="text-slate-500 font-medium">Representante:</span> <strong class="text-slate-900 block">${orcamento.representanteNome || 'Coordenação Técnica'}</strong></div>
            <div><span class="text-slate-500 font-medium">Localidade:</span> <strong class="text-slate-900 block">${orcamento.localidadeServico || 'Recife e Região Metropolitana - PE'}</strong></div>
          </div>
          <div class="pt-2 border-t border-slate-200 grid grid-cols-3 gap-2 text-[11px]">
            <div><strong>Código:</strong> ${orcamento.codigoProposta || orcamento.id}</div>
            <div><strong>Validade:</strong> ${validade} dias</div>
            <div><strong>Prazo:</strong> ${prazo}</div>
          </div>
        </div>
      </div>`
    },
    {
      numero: 2,
      titulo: "APRESENTAÇÃO INSTITUCIONAL E CREDENCIAIS TÉCNICAS",
      subtitulo: "DIREÇÃO TÉCNICA, PERFIL PROFISSIONAL & HABILITAÇÃO CREA-PE",
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
      numero: 3,
      titulo: "NOSSOS PRINCÍPIOS FUNDAMENTAIS",
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
      numero: 4,
      titulo: "O QUE ENTREGAMOS (SOLUÇÕES TÉCNICAS)",
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
      </div>`
    },
    {
      numero: 5,
      titulo: "PROBLEMAS QUE AJUDAMOS A RESOLVER",
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
      </div>`
    },
    {
      numero: 6,
      titulo: "RESUMO DE NOSSOS SERVIÇOS DE ENGENHARIA",
      conteudoHtml: `<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div class="p-2.5 bg-slate-50 rounded border border-slate-200">
          <strong class="text-[#0B1E3D] block">NR-12 • MÁQUINAS INDUSTRIAIS</strong>
          <p class="text-slate-600 text-[11px]">Apreciação de risco, inventário e laudos de adequação mecânica.</p>
        </div>
        <div class="p-2.5 bg-slate-50 rounded border border-slate-200">
          <strong class="text-[#0B1E3D] block">NR-11 • MOVIMENTAÇÃO DE CARGAS</strong>
          <p class="text-slate-600 text-[11px]">Guindastes, pontes rolantes, empilhadeiras e ensaios de tração.</p>
        </div>
        <div class="p-2.5 bg-slate-50 rounded border border-slate-200">
          <strong class="text-[#0B1E3D] block">NR-13 • CALDEIRAS E VASOS DE PRESSÃO</strong>
          <p class="text-slate-600 text-[11px]">Teste hidrostático, medição de espessura por ultrassom e prontuários.</p>
        </div>
        <div class="p-2.5 bg-slate-50 rounded border border-slate-200">
          <strong class="text-[#0B1E3D] block">PMOC • CLIMATIZAÇÃO</strong>
          <p class="text-slate-600 text-[11px]">Plano de Manutenção Operação e Controle conforme Lei 13.589/2018.</p>
        </div>
      </div>`
    },
    {
      numero: 7,
      titulo: "ESCOPO TÉCNICO DETALHADO DA PROPOSTA",
      subtitulo: `SERVIÇO CONTRATADO: ${servico.toUpperCase()}`,
      conteudoHtml: `<div class="space-y-3 text-xs">
        <div class="p-3 bg-blue-50/60 rounded-lg border border-blue-200">
          <strong class="text-[#0B1E3D] block text-sm mb-1">${servico}</strong>
          <p class="text-slate-700 leading-relaxed">${escopo}</p>
        </div>
        <div class="space-y-1 text-slate-700">
          <p>• Inspeção visual, dimensional e funcional <em>in loco</em> pelo Engenheiro Mecânico Responsável;</p>
          <p>• Aplicação de checklist técnico específico para o tipo de ativo e condições operacionais;</p>
          <p>• Registro fotográfico de todas as evidências de conformidade e não conformidades apontadas;</p>
          <p>• Emissão de parecer conclusivo fundamentado e recomendações técnicas para mitigação de riscos;</p>
          <p>• Emissão, registro e entrega da respectiva Anotação de Responsabilidade Técnica (ART).</p>
        </div>
      </div>`
    },
    {
      numero: 8,
      titulo: "DIRETRIZES NORMATIVAS & METODOLOGIA",
      conteudoHtml: `<div class="space-y-3 text-xs">
        <p class="text-slate-700 leading-relaxed">
          Os trabalhos técnicos periciais serão conduzidos estritamente alinhados às normas técnicas nacionais da ABNT e às Normas Regulamentadoras federais:
        </p>
        <div class="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 font-mono text-[11px]">
          <p><strong>Normas de Referência:</strong> ${normas}</p>
          <p><strong>Metodologia:</strong> Vistoria direta, ensaios não destrutivos e matriz de apreciação quantitativa de risco.</p>
        </div>
      </div>`
    },
    {
      numero: 9,
      titulo: "MOBILIZAÇÃO, CRONOGRAMA & ENTREGA",
      conteudoHtml: `<div class="space-y-3 text-xs">
        <div class="grid grid-cols-2 gap-3">
          <div class="p-3 bg-slate-50 rounded border border-slate-200">
            <span class="text-slate-500 block text-[11px]">Início dos Trabalhos:</span>
            <strong class="text-slate-900 text-sm">Imediato após aprovação</strong>
          </div>
          <div class="p-3 bg-slate-50 rounded border border-slate-200">
            <span class="text-slate-500 block text-[11px]">Prazo de Emissão Final:</span>
            <strong class="text-[#1565D8] text-sm">${prazo}</strong>
          </div>
        </div>
        <p class="text-slate-700 leading-relaxed">
          A entrega contempla o Laudo Técnico Pericial impresso e digital em alta resolução, com certificado digital e a ART recolhida e homologada junto ao CREA-PE.
        </p>
      </div>`
    },
    {
      numero: 10,
      titulo: "PROPOSTA DE INVESTIMENTO & CONDIÇÕES COMERCIAIS",
      subtitulo: "VALORES, FORMAS DE PAGAMENTO E VALIDADE",
      conteudoHtml: `<div class="space-y-4 text-xs">
        <div class="p-4 bg-slate-50 rounded-xl border-2 border-[#1565D8] text-center">
          <span class="text-xs text-slate-500 uppercase tracking-wider font-bold">Investimento Total para Realização dos Serviços</span>
          <div class="text-2xl sm:text-3xl font-black text-[#0B1E3D] my-1 font-mono">${valor}</div>
          <span class="text-[11px] text-slate-500">Incluso responsabilidade técnica, honorários e taxa de registro da ART</span>
        </div>
        <div class="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
          <p><strong>Condições de Pagamento:</strong> ${condicoes}</p>
          <p><strong>Validade da Proposta:</strong> ${validade} dias a contar da data de emissão.</p>
          <p><strong>Dados Bancários:</strong> Chave PIX CNPJ: 45.123.890/0001-23 (VL Engenharia Mecânica Ltda)</p>
        </div>
      </div>`
    },
    {
      numero: 11,
      titulo: "CONDIÇÕES GERAIS DE FORNECIMENTO",
      conteudoHtml: `<div class="space-y-2 text-[11px] text-slate-700 leading-relaxed">
        <p>1. O cliente disponibilizará livre acesso aos equipamentos e instalações na data agendada para vistoria.</p>
        <p>2. Quaisquer alterações de escopo ou equipamentos adicionais serão objeto de aditivo técnico previamente acordado.</p>
        <p>3. A VL Engenharia se compromete com a mais estrita confidencialidade sobre todas as informações operacionais do contratante.</p>
      </div>`
    },
    {
      numero: 12,
      titulo: "TERMO DE CONFIDENCIALIDADE E PRIVACIDADE",
      conteudoHtml: `<div class="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-2 leading-relaxed">
        <p>Todas as informações industriais, plantas, projetos e dados comerciais compartilhados para elaboração deste laudo pericial são resguardados sob sigilo profissional estrito, de acordo com o Código de Ética Profissional do Sistema CONFEA/CREA e a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).</p>
      </div>`
    },
    {
      numero: 13,
      titulo: "VALIDAÇÃO OFICIAL & ACEITE DIGITAL DA PROPOSTA",
      subtitulo: "HOMOLOGAÇÃO DA CONTRATAÇÃO DE ENGENHARIA",
      conteudoHtml: `<div class="space-y-4 text-xs">
        <p class="text-slate-700 leading-relaxed">
          Estando de acordo com os termos técnicos, escopo e condições comerciais apresentadas nesta proposta, a aprovação poderá ser efetuada digitalmente no sistema ou mediante assinatura abaixo:
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
          <div class="text-center border-t border-slate-300 pt-3">
            <p class="font-bold text-slate-900">VL ENGENHARIA MECÂNICA</p>
            <p class="text-[11px] text-slate-600">Eng. Vitor Leonardo Cordeiro Linhares</p>
            <p class="text-[10px] text-slate-500 font-mono">CREA-PE: 182229949-0</p>
          </div>
          <div class="text-center border-t border-slate-300 pt-3">
            <p class="font-bold text-slate-900">${clienteNome.toUpperCase()}</p>
            <p class="text-[11px] text-slate-600">De Acordo / Representante Autorizado</p>
            <p class="text-[10px] text-slate-500 font-mono">Data: ____/____/________</p>
          </div>
        </div>
      </div>`
    }
  ];
}

export const PropostaViewerModal: React.FC<PropostaViewerModalProps> = ({
  orcamento,
  isOpen,
  onClose,
  onStatusChange,
  onGerarLaudo,
  onEditarProposta,
}) => {
  const documentRef = useRef<HTMLDivElement>(null);
  const printContainerRef = useRef<HTMLDivElement>(null);
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const [modoVisualizacao, setModoVisualizacao] = useState<'pagina' | 'continua'>('pagina');
  const [gerandoPdf, setGerandoPdf] = useState(false);

  // Compute pages: prioritize editable secoes, then paginasProposta, or generate standard 13 pages
  const paginas: PropostaPagina[] = useMemo(() => {
    let originais: PropostaPagina[] | null = null;

    if (orcamento.secoes && orcamento.secoes.length > 0) {
      originais = orcamento.secoes.map(s => ({
        numero: s.numero,
        titulo: s.titulo,
        subtitulo: s.subtitulo,
        conteudoHtml: s.conteudoHtml,
      }));
    } else if (orcamento.paginasProposta && orcamento.paginasProposta.length > 0) {
      originais = orcamento.paginasProposta;
    } else if (orcamento.paginas && orcamento.paginas.length > 0) {
      originais = orcamento.paginas;
    }

    const listaBase = originais || gerarPaginasPadrao(orcamento);

    return listaBase.map(p => {
      // In Page 1, render cover photo if provided and not already included
      if (p.numero === 1 && orcamento.imagemCapaUrl && !p.conteudoHtml.includes(orcamento.imagemCapaUrl)) {
        const fotoHtml = `
          <div class="mb-4 rounded-xl overflow-hidden border border-slate-200 shadow-sm max-h-60 bg-slate-50 text-center flex flex-col items-center justify-center">
            <img src="${orcamento.imagemCapaUrl}" alt="Ativo / Local da Proposta" class="w-full max-h-52 object-cover" />
            ${orcamento.imagemCapaLegenda ? `<p class="text-[10px] text-slate-500 font-mono py-1 px-3 bg-slate-100 w-full text-center border-t border-slate-200">${orcamento.imagemCapaLegenda}</p>` : ''}
          </div>
        `;
        return {
          ...p,
          conteudoHtml: `${fotoHtml}${p.conteudoHtml}`,
        };
      }

      // Ensure Page 2 has the photo and credentials if it was missing
      if (p.numero === 2 && !p.conteudoHtml.includes('vitor-leonardo.png')) {
        return {
          ...p,
          titulo: "APRESENTAÇÃO INSTITUCIONAL E CREDENCIAIS TÉCNICAS",
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
                  Graduado em Engenharia Mecânica com registro ativo no Conselho Regional de Engenharia e Agronomia de Pernambuco (CREA-PE). Especialista em engenharia diagnóstica, laudos periciais mecânicos, adequação a Normas Regulamentadoras (NR-11, NR-12, NR-13), projetos de climatização (PMOC), prevenção contra incêndio e ensaios não destrutivos.
                </p>
                <div class="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600 font-medium">
                  <div class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>Emissão Oficial de ART</div>
                  <div class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>Engenharia Diagnóstica</div>
                  <div class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>Conformidade ABNT / NRs</div>
                  <div class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>Respaldo Jurídico-Pericial</div>
                </div>
              </div>
            </div>
            ${p.conteudoHtml}
          </div>`
        };
      }
      return p;
    });
  }, [orcamento]);

  if (!isOpen) return null;

  const totalPaginas = paginas.length;
  const paginaRenderizar = paginas.find(p => p.numero === paginaAtual) || paginas[0];

  const handlePrintNative = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setGerandoPdf(true);

    try {
      const pageElements = printContainerRef.current?.querySelectorAll<HTMLElement>('.proposta-pdf-page');
      if (!pageElements || pageElements.length === 0) {
        throw new Error('Páginas de impressão não encontradas.');
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const total = pageElements.length;
      for (let i = 0; i < total; i++) {
        if (i > 0) {
          pdf.addPage('a4', 'p');
        }

        const pageEl = pageElements[i];
        const canvas = await html2canvas(pageEl, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 794,
          onclone: (clonedDoc) => {
            clonedDoc.documentElement.classList.remove('dark');
            clonedDoc.body.classList.remove('dark');
          },
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }

      const nomeArquivo = `Proposta_${orcamento.codigoProposta || orcamento.id}_${(orcamento.clienteNome || 'Cliente').replace(/\s+/g, '_')}.pdf`;
      pdf.save(nomeArquivo);
    } catch (err) {
      console.error('Erro ao gerar PDF da proposta:', err);
      alert('Ocorreu um erro ao compilar o PDF multi-página. Abrindo impressão nativa do navegador.');
      window.print();
    } finally {
      setGerandoPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden">
        
        {/* Top Header Controls */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#1565D8]/20 border border-[#1565D8]/30">
              <FileSpreadsheet className="w-5 h-5 text-[#1565D8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base leading-tight">
                  Proposta Oficial • {orcamento.codigoProposta || orcamento.id}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                  {totalPaginas} Páginas Oficiais
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {orcamento.clienteNome} • {orcamento.servico}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setModoVisualizacao('pagina')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  modoVisualizacao === 'pagina' ? 'bg-[#1565D8] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Página a Página
              </button>
              <button
                onClick={() => setModoVisualizacao('continua')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  modoVisualizacao === 'continua' ? 'bg-[#1565D8] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Visualização Contínua
              </button>
            </div>

            {/* Editar Proposta button */}
            {onEditarProposta && (
              <button
                onClick={() => onEditarProposta(orcamento)}
                className="p-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 border border-amber-500 cursor-pointer"
                title="Editar seções e capa no editor rico"
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden md:inline">Editar Seções</span>
              </button>
            )}

            {/* Print button */}
            <button
              onClick={handlePrintNative}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              title="Imprimir (Ctrl+P)"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden md:inline">Imprimir</span>
            </button>

            {/* PDF Download Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={gerandoPdf}
              className="px-3.5 py-2 rounded-lg bg-[#1565D8] hover:bg-[#1565D8]/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {gerandoPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gerando PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Baixar PDF</span>
                </>
              )}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer ml-1"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Secondary Sub-Bar: Page Navigator & Quick Status */}
        <div className="px-4 sm:px-6 py-2 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs shrink-0">
          {modoVisualizacao === 'pagina' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPaginaAtual(prev => Math.max(1, prev - 1))}
                disabled={paginaAtual <= 1}
                className="p-1 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                title="Página Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-bold text-slate-700 dark:text-slate-300">
                Página <span className="text-[#1565D8] font-mono font-black">{paginaAtual}</span> de {totalPaginas}
              </span>

              <button
                onClick={() => setPaginaAtual(prev => Math.min(totalPaginas, prev + 1))}
                disabled={paginaAtual >= totalPaginas}
                className="p-1 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                title="Próxima Página"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <select
                value={paginaAtual}
                onChange={(e) => setPaginaAtual(Number(e.target.value))}
                className="ml-2 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 font-semibold max-w-[200px] sm:max-w-none truncate"
              >
                {paginas.map(p => (
                  <option key={p.numero} value={p.numero}>
                    Pág {p.numero}: {p.titulo}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="text-xs text-slate-500 font-semibold">
              Exibindo todas as {totalPaginas} páginas sequenciais no padrão de engenharia mecânica.
            </div>
          )}

          {/* Quick status change */}
          {onStatusChange && (
            <div className="flex items-center gap-2">
              <span className="text-slate-500 hidden sm:inline">Status:</span>
              <button
                onClick={() => onStatusChange(orcamento.id, 'enviado')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                  orcamento.status === 'enviado' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Enviada
              </button>
              <button
                onClick={() => onStatusChange(orcamento.id, 'aprovado')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                  orcamento.status === 'aprovado' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Aprovada
              </button>
              {orcamento.status === 'aprovado' && onGerarLaudo && (
                <button
                  onClick={() => onGerarLaudo(orcamento)}
                  className="px-2.5 py-0.5 rounded bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs cursor-pointer ml-1"
                >
                  <ArrowRight className="w-3 h-3" />
                  <span>Gerar Laudo</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Document Scroll Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-200 dark:bg-slate-900 flex justify-center">
          <div ref={documentRef} className="w-full max-w-[210mm] space-y-6">
            
            {modoVisualizacao === 'pagina' ? (
              // Single page render with mechanical engineering background watermark
              <div className="printable-document bg-white text-slate-900 min-h-[297mm] p-8 sm:p-12 shadow-xl border border-slate-300 flex flex-col justify-between relative overflow-hidden">
                
                {/* Engineering Watermark with gears, machines, and blueprints */}
                <EngineeringWatermark opacity="opacity-[0.045]" />

                {/* Official Page Header */}
                <header className="relative z-10 border-b-2 border-[#0B1E3D] pb-4 mb-6 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="VL" className="h-10 w-auto object-contain" />
                    <div>
                      <h4 className="text-base font-black text-[#0B1E3D] leading-tight">VL ENGENHARIA MECÂNICA</h4>
                      <p className="text-[10px] text-[#1565D8] font-bold uppercase tracking-wider">
                        Proposta Técnico-Comercial • CREA-PE 182229949-0
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-slate-600 font-mono">
                    <p>Ref: <strong>{orcamento.codigoProposta || orcamento.id}</strong></p>
                    <p>Página {paginaRenderizar?.numero || 1} de {totalPaginas}</p>
                  </div>
                </header>

                {/* Page Content Body */}
                <div className="relative z-10 flex-1">
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-[#1565D8] uppercase tracking-wider font-mono">
                      PÁGINA {paginaRenderizar?.numero}
                    </span>
                    <h2 className="text-xl font-black text-[#0B1E3D]">
                      {paginaRenderizar?.titulo}
                    </h2>
                    {paginaRenderizar?.subtitulo && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {paginaRenderizar.subtitulo}
                      </p>
                    )}
                  </div>

                  <div 
                    className="prose prose-sm max-w-none text-slate-800 text-xs leading-relaxed space-y-3"
                    dangerouslySetInnerHTML={{ __html: paginaRenderizar?.conteudoHtml || '<p>Conteúdo da proposta técnica.</p>' }}
                  />
                </div>

                {/* Official Page Footer */}
                <footer className="relative z-10 border-t border-slate-300 pt-3 mt-8 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                  <span>VL Engenharia Mecânica • CNPJ: 45.123.890/0001-23 • CREA-PE 182229949-0</span>
                  <span>Recife - PE • (81) 98444-2592</span>
                </footer>
              </div>
            ) : (
              // Continuous 13-page view with mechanical engineering background watermark
              paginas.map((pag) => (
                <div 
                  key={pag.numero}
                  className="printable-document bg-white text-slate-900 min-h-[297mm] p-8 sm:p-12 shadow-xl border border-slate-300 flex flex-col justify-between page-break-after-always relative mb-6 overflow-hidden"
                >
                  {/* Engineering Watermark with gears, machines, and blueprints */}
                  <EngineeringWatermark opacity="opacity-[0.045]" />

                  <header className="relative z-10 border-b-2 border-[#0B1E3D] pb-4 mb-6 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img src="/logo.png" alt="VL" className="h-10 w-auto object-contain" />
                      <div>
                        <h4 className="text-base font-black text-[#0B1E3D] leading-tight">VL ENGENHARIA MECÂNICA</h4>
                        <p className="text-[10px] text-[#1565D8] font-bold uppercase tracking-wider">
                          Proposta Técnico-Comercial • CREA-PE 182229949-0
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-slate-600 font-mono">
                      <p>Ref: <strong>{orcamento.codigoProposta || orcamento.id}</strong></p>
                      <p>Página {pag.numero} de {totalPaginas}</p>
                    </div>
                  </header>

                  <div className="relative z-10 flex-1">
                    <div className="mb-4">
                      <span className="text-[10px] font-bold text-[#1565D8] uppercase tracking-wider font-mono">
                        PÁGINA {pag.numero}
                      </span>
                      <h2 className="text-xl font-black text-[#0B1E3D]">
                        {pag.titulo}
                      </h2>
                      {pag.subtitulo && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {pag.subtitulo}
                        </p>
                      )}
                    </div>

                    <div 
                      className="prose prose-sm max-w-none text-slate-800 text-xs leading-relaxed space-y-3"
                      dangerouslySetInnerHTML={{ __html: pag.conteudoHtml }}
                    />
                  </div>

                  <footer className="relative z-10 border-t border-slate-300 pt-3 mt-8 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                    <span>VL Engenharia Mecânica • CNPJ: 45.123.890/0001-23 • CREA-PE 182229949-0</span>
                    <span>Recife - PE • (81) 98444-2592</span>
                  </footer>
                </div>
              ))
            )}

          </div>
        </div>

        {/* Hidden Dedicated Print Container: renders all pages with strict A4 dimensions for PDF export */}
        <div 
          ref={printContainerRef}
          className="fixed left-[-9999px] top-0 pointer-events-none"
          style={{ width: '794px' }}
          aria-hidden="true"
        >
          {paginas.map((pag) => (
            <div 
              key={`print-page-${pag.numero}`}
              className="proposta-pdf-page bg-white text-slate-900 min-h-[1123px] max-h-[1123px] w-[794px] p-10 flex flex-col justify-between relative overflow-hidden"
              style={{ boxSizing: 'border-box' }}
            >
              <EngineeringWatermark opacity="opacity-[0.045]" />

              <header className="relative z-10 border-b-2 border-[#0B1E3D] pb-4 mb-6 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="VL" className="h-10 w-auto object-contain" />
                  <div>
                    <h4 className="text-base font-black text-[#0B1E3D] leading-tight">VL ENGENHARIA MECÂNICA</h4>
                    <p className="text-[10px] text-[#1565D8] font-bold uppercase tracking-wider">
                      Proposta Técnico-Comercial • CREA-PE 182229949-0
                    </p>
                  </div>
                </div>
                <div className="text-right text-[10px] text-slate-600 font-mono">
                  <p>Ref: <strong>{orcamento.codigoProposta || orcamento.id}</strong></p>
                  <p>Página {pag.numero} de {totalPaginas}</p>
                </div>
              </header>

              <div className="relative z-10 flex-1">
                <div className="mb-4">
                  <span className="text-[10px] font-bold text-[#1565D8] uppercase tracking-wider font-mono">
                    PÁGINA {pag.numero}
                  </span>
                  <h2 className="text-xl font-black text-[#0B1E3D]">
                    {pag.titulo}
                  </h2>
                  {pag.subtitulo && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {pag.subtitulo}
                    </p>
                  )}
                </div>

                <div 
                  className="prose prose-sm max-w-none text-slate-800 text-xs leading-relaxed space-y-3"
                  dangerouslySetInnerHTML={{ __html: pag.conteudoHtml }}
                />
              </div>

              <footer className="relative z-10 border-t border-slate-300 pt-3 mt-8 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                <span>VL Engenharia Mecânica • CNPJ: 45.123.890/0001-23 • CREA-PE 182229949-0</span>
                <span>Recife - PE • (81) 98444-2592</span>
              </footer>
            </div>
          ))}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-[#0B1324] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Proposta comercial válida por {orcamento.validadeDias || 15} dias. Todos os direitos reservados.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
