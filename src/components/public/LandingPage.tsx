import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Wrench, 
  Truck, 
  Car, 
  Smile, 
  Fan, 
  Award, 
  BarChart2, 
  Phone, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Send, 
  AlertTriangle, 
  X, 
  ChevronRight, 
  ExternalLink,
  MapPin,
  Mail,
  Instagram,
  UserCheck
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import engineerPhoto from '../../assets/images/image.png';

interface ServicoItem {
  id: string;
  numero: string;
  titulo: string;
  descricaoCurta: string;
  normas: string;
  detalhesCompletos: string[];
  entregaveis: string[];
  icon: React.ElementType;
}

const SERVICOS_LISTA: ServicoItem[] = [
  {
    id: 'nr12',
    numero: '01',
    titulo: 'Adequação à NR-12',
    descricaoCurta: 'Análise de conformidade de máquinas e equipamentos, relatórios técnicos e plano completo de adequação.',
    normas: 'NR-12 • NBR 14153 • NBR ISO 12100 • NBR ISO 13849',
    detalhesCompletos: [
      'Inventário completo de máquinas e mapeamento de riscos mecânicos, elétricos e térmicos.',
      'Apreciação de Riscos quantitativa e qualitativa pela metodologia HRN (Hazard Rating Number).',
      'Categorização dos circuitos de segurança e enclausuramento de zonas perigosas.',
      'Elaboração de memorial descritivo de adequação com prazos e prioridades de intervenção.'
    ],
    entregaveis: ['Laudo de Apreciação de Riscos', 'Plano de Ação Corretivo', 'Anotação de Responsabilidade Técnica (ART)'],
    icon: ShieldCheck,
  },
  {
    id: 'maquinas-pesadas',
    numero: '02',
    titulo: 'Laudos para Máquinas Pesadas',
    descricaoCurta: 'Avaliação técnica qualificada, inspeção mecânica de frota e emissão de laudos de estabilidade com ART.',
    normas: 'NR-11 • NR-12 • NR-18 • Normas ABNT de Máquinas Móveis',
    detalhesCompletos: [
      'Inspeção em retroescavadeiras, pás carregadeiras, motoniveladoras e tratores de esteira.',
      'Avaliação das estruturas de proteção contra capotamento (ROPS) e queda de objetos (FOPS).',
      'Verificação de sistemas de freios de serviço, estacionamento e redundâncias de segurança.',
      'Teste de estabilidade operacional e estanqueidade de sistemas hidráulicos.'
    ],
    entregaveis: ['Relatório Fotográfico Pormenorizado', 'Laudo Técnico de Estabilidade', 'ART Registrada no CREA-PE'],
    icon: Wrench,
  },
  {
    id: 'munck-guindastes',
    numero: '03',
    titulo: 'Inspeções em Caminhões Munck e Guindastes',
    descricaoCurta: 'Inspeções periódicas preventivas, avaliação estrutural, testes de carga hidráulicos e laudos de içamento.',
    normas: 'NR-11 • NR-12 • NBR 14768 • NBR 8400',
    detalhesCompletos: [
      'Inspeção estrutural de sobrechassi, grampos de fixação na longarina e braços telescópicos.',
      'Ensaio de estanqueidade e integridade dos cilindros e válvulas de retenção das sapatas.',
      'Inspeção com líquido penetrante em pontos críticos de solda sujeitos à fadiga cíclica.',
      'Aferição das tabelas de carga e teste de funcionamento do limitador de momento (LMI).'
    ],
    entregaveis: ['Certificado de Inspeção Periódica', 'Plano de Rigging e Tabela de Capacidade', 'ART de Içamento'],
    icon: Truck,
  },
  {
    id: 'inspecao-veicular',
    numero: '04',
    titulo: 'Inspeção Veicular e Reclassificação de Monta',
    descricaoCurta: 'Avaliação técnica profunda para regularização estrutural, reclassificação de sinistros no DETRAN.',
    normas: 'Resoluções CONTRAN nº 810/2020 e 811/2020 • CTB',
    detalhesCompletos: [
      'Perícia técnica em veículos envolvidos em acidentes com danos estruturais ou mecânicos.',
      'Avaliação dos 31 itens obrigatórios estabelecidos pelo CONTRAN para enquadramento de monta.',
      'Elaboração de laudo de reclassificação de grande/média monta para pequena monta com ART.',
      'Emissão de parecer conclusivo para desbloqueio do registro do veículo junto ao DETRAN.'
    ],
    entregaveis: ['Termo de Constatação Técnica', 'Álbum Fotográfico Normativo', 'ART de Responsabilidade Pericial'],
    icon: Car,
  },
  {
    id: 'playgrounds',
    numero: '05',
    titulo: 'Laudos para Playgrounds',
    descricaoCurta: 'Avaliação detalhada de segurança infantil, conformidade com a ABNT NBR 16071 e recomendações práticas.',
    normas: 'ABNT NBR 16071 (Partes 1 a 7) • Lei da Recreação Segura',
    detalhesCompletos: [
      'Inspeção de equipamentos de recreação infantil em condomínios, clubes, escolas e praças.',
      'Verificação de aprisionamento de cabeça, pescoço, dedos e roupas com gabaritos normatizados.',
      'Avaliação de desgaste mecânico em correntes, mancais, soldas e ancoragens ao solo.',
      'Análise do piso amortecedor de impacto (grama, borracha, areia) e alturas de queda livre.'
    ],
    entregaveis: ['Relatório de Não Conformidades por Prioridade', 'Checklist de Manutenção Preventiva', 'ART CREA-PE'],
    icon: Smile,
  },
  {
    id: 'pmoc',
    numero: '06',
    titulo: 'Plano de Manutenção, Operação e Controle (PMOC)',
    descricaoCurta: 'Elaboração e acompanhamento de PMOC para climatizadores industriais e corporativos sob as leis vigentes.',
    normas: 'Lei Federal 13.589/2018 • Portaria MS 3.523/1998 • Resolução ANVISA RE nº 9',
    detalhesCompletos: [
      'Inventário completo de sistemas de ar condicionado central, split e VRF.',
      'Definição de rotinas mensais, trimestrais e semestrais de limpeza, higienização e troca de filtros.',
      'Acompanhamento técnico da qualidade do ar interior para proteção da saúde dos ocupantes.',
      'Cumprimento rigoroso das obrigações legais para evitar penalidades e multas sanitárias.'
    ],
    entregaveis: ['Caderno Oficial do PMOC', 'Cronograma Técnico de Execução', 'ART de Manutenção Climatização'],
    icon: Fan,
  },
  {
    id: 'art-manutencao',
    numero: '07',
    titulo: 'ART para Serviços de Manutenção',
    descricaoCurta: 'Articulação de Anotação de Responsabilidade Técnica para manutenção predial, fabril e mecânica corporativa.',
    normas: 'Lei Federal 6.496/1977 • Resoluções CONFEA / CREA',
    detalhesCompletos: [
      'Assunção de responsabilidade técnica para empresas de manutenção mecânica e facilities.',
      'Emissão de ART para licitações públicas, contratos corporativos e auditorias industriais.',
      'Supervisão técnica de manutenções de geradores, bombas, pontes rolantes e compressores.',
      'Segurança jurídica e respaldo formal para gestores de condomínios e diretores industriais.'
    ],
    entregaveis: ['ART de Cargo/Função ou Obra/Serviço', 'Atestado de Capacidade Técnica', 'Termo de Vistoria'],
    icon: Award,
  },
  {
    id: 'consultoria-pcm',
    numero: '08',
    titulo: 'Consultoria em Gestão da Manutenção (PCM)',
    descricaoCurta: 'Otimização com foco em PCM, KPIs (MTBF, MTTR), disponibilidade e alta confiabilidade de ativos corporativos.',
    normas: 'ISO 55001 • RCM (Manutenção Centrada em Confiabilidade) • FMEA',
    detalhesCompletos: [
      'Diagnóstico de maturidade dos processos de manutenção e gestão de ativos da empresa.',
      'Implantação de Plano Mestre de Manutenção Preventiva (PMP) estruturado em 52 semanas.',
      'Estruturação de indicadores chave de desempenho: MTBF (tempo médio entre falhas) e MTTR.',
      'Redução de paradas emergenciais de produção e aumento da disponibilidade física dos ativos.'
    ],
    entregaveis: ['Matriz de Criticidade e FMEA', 'Dashboard de KPIs Operacionais', 'Manual de Procedimentos PCM'],
    icon: BarChart2,
  },
];

export const LandingPage: React.FC = () => {
  const { enviarContatoPublico } = useData();

  // Contact Form State
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [servicoInteresse, setServicoInteresse] = useState(SERVICOS_LISTA[0].titulo);
  const [mensagem, setMensagem] = useState('');
  const [statusEnvio, setStatusEnvio] = useState<'idle' | 'enviando' | 'sucesso' | 'erro'>('idle');
  const [mensagemErro, setMensagemErro] = useState('');

  // Service Detail Modal
  const [modalServico, setModalServico] = useState<ServicoItem | null>(null);

  const handleSubmitContato = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim() || !mensagem.trim()) {
      setStatusEnvio('erro');
      setMensagemErro('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setStatusEnvio('enviando');
    setMensagemErro('');

    try {
      await enviarContatoPublico({
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
        servicoInteresse,
        mensagem: mensagem.trim(),
      });
      setStatusEnvio('sucesso');
      setNome('');
      setEmail('');
      setTelefone('');
      setMensagem('');
    } catch (err: any) {
      console.error(err);
      setStatusEnvio('erro');
      setMensagemErro('Não foi possível registrar o contato no momento. Entre em contato direto pelo nosso WhatsApp.');
    }
  };

  return (
    <div className="bg-white">
      {/* 1. HERO SECTION */}
      <section id="inicio" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            
            {/* Tag normativo */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-[#1565D8] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#1565D8]" />
              <span>Engenharia Mecânica & Segurança Legal com ART</span>
            </div>

            {/* Impact Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0B1E3D] tracking-tight leading-[1.15]">
              Engenharia Mecânica com{' '}
              <span className="text-[#1565D8] underline decoration-[#B0B4BA]/40 decoration-wavy decoration-2">
                Segurança, Conformidade
              </span>{' '}
              e Precisão.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Soluções completas para Adequação à NR-12, PMOC, Laudos de Playground, Máquinas e Equipamentos Pesados, Inspeções Veiculares em Recife, Região Metropolitana e todo o estado de Pernambuco. Proteja seus ativos e garanta conformidade legal.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="https://wa.me/5581984442592?text=Ol%C3%A1%20Engenheiro%20Vitor%2C%20gostaria%20de%20solicitar%20uma%20avalia%C3%A7%C3%A3o%20t%C3%A9cnica%20para%20minha%20empresa."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-[#1565D8] hover:bg-[#0b4fb8] text-white font-bold text-base shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all active:scale-98"
              >
                <Phone className="w-5 h-5" />
                <span>Solicitar Orçamento via WhatsApp</span>
              </a>

              <a
                href="#servicos"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white border-2 border-slate-200 hover:border-[#1565D8] text-slate-800 hover:text-[#1565D8] font-bold text-base transition-colors"
              >
                <span>Ver Nossos Serviços</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Trust highlights */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-200">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>CREA-PE 1822299490</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ART em 100% dos Laudos</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Atendimento Ágil em 24h</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SOBRE MIM SECTION */}
      <section id="sobre" className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Photo / Visual Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Decorative border box */}
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-[#0B1E3D] to-[#1565D8] opacity-10 blur-sm"></div>
                
                <div className="relative bg-white rounded-2xl p-3 shadow-xl border border-slate-200 overflow-hidden">
                  <div className="aspect-4/5 rounded-xl bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 flex flex-col items-center justify-end relative overflow-hidden group">
                    {/* Engineer photo with high resolution */}
                    <img
                      src={engineerPhoto}
                      alt="Vitor Leonardo - Engenheiro Mecânico CREA-PE"
                      className="w-full h-full object-contain object-bottom pt-2 transition-transform duration-300 group-hover:scale-102 filter drop-shadow-sm"
                      loading="eager"
                      decoding="async"
                      onError={(e) => {
                        // Fallback to /image.png then placeholder badge
                        if (e.currentTarget.src !== window.location.origin + '/image.png') {
                          e.currentTarget.src = '/image.png';
                          return;
                        }
                        e.currentTarget.style.display = 'none';
                        const fallbackEl = document.getElementById('photo-fallback');
                        if (fallbackEl) fallbackEl.style.display = 'flex';
                      }}
                    />

                    {/* Placeholder fallback if image missing */}
                    <div id="photo-fallback" className="hidden absolute inset-0 flex-col items-center justify-center p-6 text-center bg-slate-100">
                      <div className="w-20 h-20 rounded-full bg-[#0B1E3D] text-white flex items-center justify-center mb-4 shadow-md">
                        <UserCheck className="w-10 h-10 text-white" />
                      </div>
                      <h4 className="font-bold text-[#0B1E3D] text-lg">Vitor Leonardo</h4>
                      <p className="text-xs text-slate-500 font-mono mt-1">CREA-PE 1822299490</p>
                      <p className="text-xs text-slate-600 mt-2">Engenheiro Mecânico & Perito Técnico</p>
                    </div>

                    {/* Bottom floating badge */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg border border-slate-200 shadow-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-[#0B1E3D]">Vitor Leonardo</p>
                          <p className="text-[11px] text-slate-500">Fundador & Responsável Técnico</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-[#1565D8] font-bold text-[10px]">
                          CREA-PE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Biography & Text Summary */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold text-[#1565D8] uppercase tracking-wider">
                  Responsabilidade Técnica e Credibilidade
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E3D] mt-1 tracking-tight">
                  Sobre o Responsável Técnico
                </h2>
              </div>

              {/* Exact Text provided in user prompt specification */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200/80">
                <blockquote className="text-base sm:text-lg text-slate-700 leading-relaxed italic">
                  "Sou <strong className="text-[#0B1E3D] not-italic font-bold">Vitor</strong>, Engenheiro Mecânico (<strong className="text-[#1565D8] not-italic font-mono">CREA-PE 1822299490</strong>) e fundador da <strong className="text-[#0B1E3D] not-italic font-bold">VL Engenharia</strong>. Atuo com inspeção técnica, engenharia de segurança e projetos mecânicos, oferecendo laudos, análises de risco e soluções de manutenção com foco em conformidade normativa, confiabilidade de ativos e segurança legal para empresas de Pernambuco e região."
                </blockquote>
              </div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Nosso compromisso é desmistificar as exigências de órgãos fiscalizadores (Ministério do Trabalho, Corpo de Bombeiros e DETRAN), transformando normas técnicas em planos de ação claros, viáveis e economicamente equilibrados para indústrias, construtoras, frotistas e condomínios.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-white border border-slate-200">
                  <div className="font-bold text-[#0B1E3D] text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#1565D8]" />
                    <span>Segurança Jurídica</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Laudos minuciosos que resguardam administradores e empresas contra passivos e autos de infração.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white border border-slate-200">
                  <div className="font-bold text-[#0B1E3D] text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#1565D8]" />
                    <span>Agilidade em Campo</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Vistorias in loco com emissão célere de relatórios preliminares e protocolo imediato de ART.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#contato"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#1565D8] hover:text-[#0b4fb8] transition-colors"
                >
                  <span>Entre em contato diretamente comigo</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. NOSSOS SERVIÇOS DE ENGENHARIA SECTION */}
      <section id="servicos" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-[#1565D8] uppercase tracking-wider">
              Soluções Especializadas
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E3D] tracking-tight">
              Nossos Serviços de Engenharia
            </h2>
            {/* Exact intro text from Section 4 item 4 */}
            <p className="text-slate-600 text-base leading-relaxed">
              Atuação técnica especializada orientada à segurança legal, aumento de disponibilidade, 
              conformidade normativa e alta confiabilidade mecânica.
            </p>
          </div>

          {/* Cards Grid (Responsive 2 to 3 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICOS_LISTA.map((servico) => {
              const IconComp = servico.icon;
              return (
                <div
                  key={servico.id}
                  className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-[#1565D8]/40"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#1565D8] flex items-center justify-center group-hover:bg-[#1565D8] group-hover:text-white transition-colors">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-[#B0B4BA]">
                        {servico.numero}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[#0B1E3D] group-hover:text-[#1565D8] transition-colors">
                        {servico.titulo}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {servico.normas}
                      </p>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {servico.descricaoCurta}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                    <button
                      onClick={() => setModalServico(servico)}
                      className="text-xs font-bold text-[#1565D8] hover:text-[#0b4fb8] flex items-center gap-1 cursor-pointer focus:outline-none"
                    >
                      <span>Saber mais</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={`https://wa.me/5581984442592?text=Ol%C3%A1%2C%20tenho%20interesse%20no%20servi%C3%A7o%20de%20${encodeURIComponent(servico.titulo)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-slate-400 hover:text-emerald-600 transition-colors"
                      title="Orçamento Rápido"
                    >
                      Orçar WhatsApp
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-xs text-slate-500">
              Precisa de um laudo customizado ou de uma norma específica? 
              Realizamos ensaios e perícias personalizadas sob demanda.
            </p>
          </div>

        </div>
      </section>

      {/* 4. CONTATO / MEUS DADOS SECTION */}
      <section id="contato" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Official Contact Info */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-xs font-bold text-[#1565D8] uppercase tracking-wider">
                  Atendimento & Plantão Técnico
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E3D] tracking-tight mt-1">
                  Fale com a VL Engenharia
                </h2>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                  Solicite um orçamento formal, tire dúvidas técnicas ou acione nosso plantão para vistorias de urgência regulatória.
                </p>
              </div>

              {/* Direct Info List */}
              <div className="space-y-4 text-sm">
                
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-blue-100/60 text-[#1565D8] shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                      Plantão Técnico / WhatsApp
                    </span>
                    <p className="text-base font-bold text-[#0B1E3D] mt-0.5">
                      (81) 98444-2592
                    </p>
                    <a
                      href="https://wa.me/5581984442592"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#1565D8] hover:underline mt-1"
                    >
                      <span>Abrir conversa no WhatsApp</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-blue-100/60 text-[#1565D8] shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                      E-mail Profissional
                    </span>
                    <p className="text-base font-bold text-[#0B1E3D] mt-0.5 break-all">
                      vitorleonardocl@gmail.com
                    </p>
                    <a
                      href="mailto:vitorleonardocl@gmail.com"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#1565D8] hover:underline mt-1"
                    >
                      <span>Enviar mensagem de e-mail</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-blue-100/60 text-[#1565D8] shrink-0 mt-0.5">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                      Instagram Profissional
                    </span>
                    <p className="text-base font-bold text-[#0B1E3D] mt-0.5">
                      @vlengenharia.mec
                    </p>
                    <a
                      href="https://www.instagram.com/vlengenharia.mec"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#1565D8] hover:underline mt-1"
                    >
                      <span>Acessar perfil no Instagram</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-blue-100/60 text-[#1565D8] shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                      Sede Operacional & Área de Atuação
                    </span>
                    <p className="text-sm font-semibold text-[#0B1E3D] mt-0.5">
                      Recife, Região Metropolitana (RMR) e interior de Pernambuco.
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Deslocamento técnico para atendimento in loco em canteiros, indústrias e galpões.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Interactive Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                
                <h3 className="text-xl font-bold text-[#0B1E3D]">
                  Envie sua Solicitação de Orçamento
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">
                  Preencha os dados abaixo. Retornaremos em horário comercial com uma proposta técnica detalhada.
                </p>

                {statusEnvio === 'sucesso' ? (
                  <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold">Solicitação Recebida com Sucesso!</h4>
                    <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                      Obrigado pelo contato. Os dados foram salvos no nosso sistema e o Eng. Vitor Leonardo entrará em contato em breve através do e-mail ou WhatsApp informado.
                    </p>
                    <button
                      onClick={() => setStatusEnvio('idle')}
                      className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors mt-2"
                    >
                      Enviar Outra Mensagem
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitContato} className="space-y-4">
                    {statusEnvio === 'erro' && mensagemErro && (
                      <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{mensagemErro}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          required
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          placeholder="Ex: João da Silva"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1565D8] focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          E-mail Profissional *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="nome@empresa.com.br"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1565D8] focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Telefone / WhatsApp
                        </label>
                        <input
                          type="tel"
                          value={telefone}
                          onChange={(e) => setTelefone(e.target.value)}
                          placeholder="(81) 90000-0000"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1565D8] focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Serviço de Interesse *
                        </label>
                        <select
                          value={servicoInteresse}
                          onChange={(e) => setServicoInteresse(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1565D8] focus:border-transparent transition-all"
                        >
                          {SERVICOS_LISTA.map((s) => (
                            <option key={s.id} value={s.titulo}>
                              {s.titulo}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Descrição da Demanda / Mensagem *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={mensagem}
                        onChange={(e) => setMensagem(e.target.value)}
                        placeholder="Informe detalhes sobre o equipamento, localização em PE, prazos ou exigências normativas..."
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1565D8] focus:border-transparent transition-all"
                      />
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Ao enviar, você concorda com o tratamento dos dados conforme nossa Política de Privacidade & LGPD.
                    </p>

                    <button
                      type="submit"
                      disabled={statusEnvio === 'enviando'}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#1565D8] hover:bg-[#0b4fb8] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {statusEnvio === 'enviando' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Enviando mensagem...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Enviar Solicitação de Orçamento</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. SERVICE MODAL DETAILS */}
      {modalServico && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setModalServico(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-slate-100 text-slate-600">
                Módulo {modalServico.numero}
              </span>
              <span className="text-xs font-semibold text-[#1565D8]">
                {modalServico.normas}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-[#0B1E3D] mb-3">
              {modalServico.titulo}
            </h3>

            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              {modalServico.descricaoCurta}
            </p>

            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-[#0B1E3D] uppercase tracking-wider mb-2">
                  Escopo e Atividades Técnicas Inclusas:
                </h4>
                <ul className="space-y-2">
                  {modalServico.detalhesCompletos.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#1565D8] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#0B1E3D] uppercase tracking-wider mb-2">
                  Entregáveis Oficiais do Laudo:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {modalServico.entregaveis.map((ent, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 text-[#0B1E3D] text-xs font-semibold border border-slate-200"
                    >
                      {ent}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/5581984442592?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento%20para%20${encodeURIComponent(modalServico.titulo)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-3 rounded-xl bg-[#1565D8] hover:bg-[#0b4fb8] text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Solicitar Proposta no WhatsApp</span>
                </a>
                <button
                  onClick={() => {
                    setServicoInteresse(modalServico.titulo);
                    setModalServico(null);
                    const el = document.getElementById('contato');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  Preencher Formulário
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
