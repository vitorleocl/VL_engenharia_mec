import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Wrench, 
  Truck, 
  Car, 
  Smile, 
  Wind, 
  FileCheck2, 
  Gauge, 
  Phone, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Send, 
  AlertTriangle, 
  X, 
  ChevronRight, 
  ArrowUpRight,
  ExternalLink,
  MapPin,
  Mail,
  Instagram,
  UserCheck,
  Cog,
  DraftingCompass,
  Tractor,
  Sparkles,
  Layers,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../../context/DataContext';
import engineerPhoto from '../../assets/images/image.png';
import engBlueprintBg from '../../assets/images/eng_blueprint_bg_1788996890188.jpg';
import { HeroServicesSlider } from './HeroServicesSlider';

interface ServicoItem {
  id: string;
  numero: string;
  categoria: 'projetos' | 'maquinas' | 'pericias' | 'pmoc' | 'gestao';
  tagEspecialidade: string;
  titulo: string;
  descricaoCurta: string;
  normas: string;
  destaquesVisuais: string[];
  detalhesCompletos: string[];
  entregaveis: string[];
  icon: React.ElementType;
  corTema: {
    iconBg: string;
    iconText: string;
    badgeBg: string;
    badgeText: string;
    borderHover: string;
    dotColor: string;
  };
}

const CATEGORIAS_SERVICOS = [
  { id: 'todos', label: 'Todas as Especialidades', count: 8 },
  { id: 'projetos', label: 'Projetos & NR-12', count: 1 },
  { id: 'maquinas', label: 'Máquinas & Içamento', count: 2 },
  { id: 'pericias', label: 'Laudos & Perícias', count: 2 },
  { id: 'pmoc', label: 'PMOC Climatização', count: 1 },
  { id: 'gestao', label: 'ART & Gestão PCM', count: 2 },
];

const SERVICOS_LISTA: ServicoItem[] = [
  {
    id: 'nr12',
    numero: '01',
    categoria: 'projetos',
    tagEspecialidade: 'Projetos & Turnkey CAD',
    titulo: 'Adequação à NR-12 & Projetos Mecânicos',
    descricaoCurta: 'Apreciação de riscos (HRN), elaboração de projetos executivos 2D/3D em CAD, fabricação, montagem de proteções e ART.',
    normas: 'NR-12 • NBR 14153 • NBR ISO 12100 • NBR ISO 13849',
    destaquesVisuais: [
      'Projetos Executivos 2D/3D em CAD',
      'Fabricação física e proteções mecânicas',
      'Apreciação HRN com ART no CREA-PE'
    ],
    detalhesCompletos: [
      'Inventário completo de máquinas e mapeamento minucioso de perigos mecânicos, elétricos e térmicos.',
      'Apreciação de Riscos quantitativa e qualitativa pela metodologia oficial HRN (Hazard Rating Number).',
      'Elaboração de projetos mecânicos executivos com detalhamento técnico 2D e modelagem 3D em CAD.',
      'Entrega e execução completa (turnkey): fabricação de proteções fixas e móveis, enclausuramentos e estruturas.',
      'Instalação in loco, montagem mecânica e integração de dispositivos de segurança com intertravamento.',
      'Validação funcional dos sistemas de segurança, emissão de memorial descritivo e ART de projeto e execução.'
    ],
    entregaveis: [
      'Laudo de Apreciação de Riscos (HRN)',
      'Projetos Mecânicos Executivos (2D / 3D CAD)',
      'Fabricação e Execução de Proteções Físicas',
      'Memorial Descritivo e Validação de Conformidade',
      'ART de Projeto e Execução Registrada no CREA-PE'
    ],
    icon: DraftingCompass,
    corTema: {
      iconBg: 'bg-blue-50',
      iconText: 'text-[#1565D8]',
      badgeBg: 'bg-blue-50',
      badgeText: 'text-[#1565D8]',
      borderHover: 'group-hover:border-[#1565D8]',
      dotColor: 'bg-[#1565D8]'
    }
  },
  {
    id: 'maquinas-pesadas',
    numero: '02',
    categoria: 'maquinas',
    tagEspecialidade: 'Linha Amarela & Frotas',
    titulo: 'Laudos para Máquinas Pesadas',
    descricaoCurta: 'Avaliação técnica qualificada, inspeção mecânica de frotas e emissão de laudos de estabilidade com ART.',
    normas: 'NR-11 • NR-12 • NR-18 • Normas ABNT de Máquinas Móveis',
    destaquesVisuais: [
      'Inspeção de estruturas ROPS/FOPS',
      'Teste de freios, direção e hidráulica',
      'Laudo técnico com ART para obras'
    ],
    detalhesCompletos: [
      'Inspeção em retroescavadeiras, pás carregadeiras, motoniveladoras e tratores de esteira.',
      'Avaliação das estruturas de proteção contra capotamento (ROPS) e queda de objetos (FOPS).',
      'Verificação de sistemas de freios de serviço, estacionamento e redundâncias de segurança.',
      'Teste de estabilidade operacional e estanqueidade de sistemas hidráulicos.'
    ],
    entregaveis: ['Relatório Fotográfico Pormenorizado', 'Laudo Técnico de Estabilidade', 'ART Registrada no CREA-PE'],
    icon: Tractor,
    corTema: {
      iconBg: 'bg-amber-50',
      iconText: 'text-amber-600',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-700',
      borderHover: 'group-hover:border-amber-500',
      dotColor: 'bg-amber-500'
    }
  },
  {
    id: 'munck-guindastes',
    numero: '03',
    categoria: 'maquinas',
    tagEspecialidade: 'Içamento & Rigging',
    titulo: 'Inspeções em Caminhões Munck e Guindastes',
    descricaoCurta: 'Inspeções periódicas preventivas, avaliação estrutural, testes de carga hidráulicos e laudos de içamento.',
    normas: 'NR-11 • NR-12 • NBR 14768 • NBR 8400',
    destaquesVisuais: [
      'Ensaio de estanqueidade e sobrechassi',
      'Teste de carga com calibração LMI',
      'Tabela de carga, rigging e ART'
    ],
    detalhesCompletos: [
      'Inspeção estrutural de sobrechassi, grampos de fixação na longarina e braços telescópicos.',
      'Ensaio de estanqueidade e integridade dos cilindros e válvulas de retenção das sapatas.',
      'Inspeção com líquido penetrante em pontos críticos de solda sujeitos à fadiga cíclica.',
      'Aferição das tabelas de carga e teste de funcionamento do limitador de momento (LMI).'
    ],
    entregaveis: ['Certificado de Inspeção Periódica', 'Plano de Rigging e Tabela de Capacidade', 'ART de Içamento'],
    icon: Truck,
    corTema: {
      iconBg: 'bg-indigo-50',
      iconText: 'text-indigo-600',
      badgeBg: 'bg-indigo-50',
      badgeText: 'text-indigo-700',
      borderHover: 'group-hover:border-indigo-500',
      dotColor: 'bg-indigo-500'
    }
  },
  {
    id: 'inspecao-veicular',
    numero: '04',
    categoria: 'pericias',
    tagEspecialidade: 'Perícia & DETRAN',
    titulo: 'Inspeção Veicular e Reclassificação de Monta',
    descricaoCurta: 'Avaliação pericial para regularização estrutural, reclassificação de sinistros no DETRAN e desbloqueios.',
    normas: 'Resoluções CONTRAN nº 810/2020 e 811/2020 • CTB',
    destaquesVisuais: [
      'Avaliação dos 31 itens do CONTRAN',
      'Reclassificação média para pequena monta',
      'Parecer técnico para desbloqueio'
    ],
    detalhesCompletos: [
      'Perícia técnica em veículos envolvidos em acidentes com danos estruturais ou mecânicos.',
      'Avaliação dos 31 itens obrigatórios estabelecidos pelo CONTRAN para enquadramento de monta.',
      'Elaboração de laudo de reclassificação de grande/média monta para pequena monta com ART.',
      'Emissão de parecer conclusivo para desbloqueio do registro do veículo junto ao DETRAN.'
    ],
    entregaveis: ['Termo de Constatação Técnica', 'Álbum Fotográfico Normativo', 'ART de Responsabilidade Pericial'],
    icon: Car,
    corTema: {
      iconBg: 'bg-slate-100',
      iconText: 'text-slate-700',
      badgeBg: 'bg-slate-100',
      badgeText: 'text-slate-700',
      borderHover: 'group-hover:border-slate-500',
      dotColor: 'bg-slate-600'
    }
  },
  {
    id: 'playgrounds',
    numero: '05',
    categoria: 'pericias',
    tagEspecialidade: 'Segurança Infantil',
    titulo: 'Laudos para Playgrounds & Áreas Infantis',
    descricaoCurta: 'Avaliação minuciosa de conformidade técnica com a ABNT NBR 16071 para condomínios, escolas e praças.',
    normas: 'ABNT NBR 16071 (Partes 1 a 7) • Lei da Recreação Segura',
    destaquesVisuais: [
      'Gabaritos contra aprisionamento de corpo',
      'Inspeção de soldas, mancais e balanços',
      'Teste de pisos amortecedores de impacto'
    ],
    detalhesCompletos: [
      'Inspeção de equipamentos de recreação infantil em condomínios, clubes, escolas e praças.',
      'Verificação de aprisionamento de cabeça, pescoço, dedos e roupas com gabaritos normatizados.',
      'Avaliação de desgaste mecânico em correntes, mancais, soldas e ancoragens ao solo.',
      'Análise do piso amortecedor de impacto (grama, borracha, areia) e alturas de queda livre.'
    ],
    entregaveis: ['Relatório de Não Conformidades por Prioridade', 'Checklist de Manutenção Preventiva', 'ART CREA-PE'],
    icon: Smile,
    corTema: {
      iconBg: 'bg-emerald-50',
      iconText: 'text-emerald-600',
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-700',
      borderHover: 'group-hover:border-emerald-500',
      dotColor: 'bg-emerald-500'
    }
  },
  {
    id: 'pmoc',
    numero: '06',
    categoria: 'pmoc',
    tagEspecialidade: 'Qualidade do Ar & HVAC',
    titulo: 'Plano de Manutenção, Operação e Controle (PMOC)',
    descricaoCurta: 'Elaboração e acompanhamento de PMOC para climatizadores industriais e corporativos sob a legislação sanitária.',
    normas: 'Lei Federal 13.589/2018 • Portaria MS 3.523/1998 • Resolução ANVISA RE nº 9',
    destaquesVisuais: [
      'Caderno oficial de rotinas em 52 semanas',
      'Adequação à ANVISA e prevenção de multas',
      'Cronograma técnico e ART de Manutenção'
    ],
    detalhesCompletos: [
      'Inventário completo de sistemas de ar condicionado central, split e VRF.',
      'Definição de rotinas mensais, trimestrais e semestrais de limpeza, higienização e troca de filtros.',
      'Acompanhamento técnico da qualidade do ar interior para proteção da saúde dos ocupantes.',
      'Cumprimento rigoroso das obrigações legais para evitar penalidades e multas sanitárias.'
    ],
    entregaveis: ['Caderno Oficial do PMOC', 'Cronograma Técnico de Execução', 'ART de Manutenção Climatização'],
    icon: Wind,
    corTema: {
      iconBg: 'bg-sky-50',
      iconText: 'text-sky-600',
      badgeBg: 'bg-sky-50',
      badgeText: 'text-sky-700',
      borderHover: 'group-hover:border-sky-500',
      dotColor: 'bg-sky-500'
    }
  },
  {
    id: 'art-manutencao',
    numero: '07',
    categoria: 'gestao',
    tagEspecialidade: 'Responsabilidade Legal',
    titulo: 'ART para Serviços de Manutenção',
    descricaoCurta: 'Assunção de Responsabilidade Técnica formal para manutenção mecânica predial, fabril e corporativa.',
    normas: 'Lei Federal 6.496/1977 • Resoluções CONFEA / CREA',
    destaquesVisuais: [
      'Emissão para licitações e contratos formais',
      'Supervisão técnica de geradores e bombas',
      'Respaldo jurídico para diretores e síndicos'
    ],
    detalhesCompletos: [
      'Assunção de responsabilidade técnica para empresas de manutenção mecânica e facilities.',
      'Emissão de ART para licitações públicas, contratos corporativos e auditorias industriais.',
      'Supervisão técnica de manutenções de geradores, bombas, pontes rolantes e compressores.',
      'Segurança jurídica e respaldo formal para gestores de condomínios e diretores industriais.'
    ],
    entregaveis: ['ART de Cargo/Função ou Obra/Serviço', 'Atestado de Capacidade Técnica', 'Termo de Vistoria'],
    icon: FileCheck2,
    corTema: {
      iconBg: 'bg-violet-50',
      iconText: 'text-violet-600',
      badgeBg: 'bg-violet-50',
      badgeText: 'text-violet-700',
      borderHover: 'group-hover:border-violet-500',
      dotColor: 'bg-violet-500'
    }
  },
  {
    id: 'consultoria-pcm',
    numero: '08',
    categoria: 'gestao',
    tagEspecialidade: 'PCM & Confiabilidade',
    titulo: 'Consultoria em Gestão da Manutenção (PCM)',
    descricaoCurta: 'Otimização com foco em Planejamento e Controle, KPIs (MTBF, MTTR), disponibilidade e confiabilidade de ativos.',
    normas: 'ISO 55001 • RCM (Manutenção Centrada em Confiabilidade) • FMEA',
    destaquesVisuais: [
      'Plano Mestre de Manutenção Preventiva (PMP)',
      'Gestão de indicadores MTBF, MTTR e custo',
      'Aumento da disponibilidade física de ativos'
    ],
    detalhesCompletos: [
      'Diagnóstico de maturidade dos processos de manutenção e gestão de ativos da empresa.',
      'Implantação de Plano Mestre de Manutenção Preventiva (PMP) estruturado em 52 semanas.',
      'Estruturação de indicadores chave de desempenho: MTBF (tempo médio entre falhas) e MTTR.',
      'Redução de paradas emergenciais de produção e aumento da disponibilidade física dos ativos.'
    ],
    entregaveis: ['Matriz de Criticidade e FMEA', 'Dashboard de KPIs Operacionais', 'Manual de Procedimentos PCM'],
    icon: Gauge,
    corTema: {
      iconBg: 'bg-teal-50',
      iconText: 'text-teal-600',
      badgeBg: 'bg-teal-50',
      badgeText: 'text-teal-700',
      borderHover: 'group-hover:border-teal-500',
      dotColor: 'bg-teal-500'
    }
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

  // Service Category Filter State
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos');

  const servicosFiltrados = filtroCategoria === 'todos'
    ? SERVICOS_LISTA
    : SERVICOS_LISTA.filter(s => s.categoria === filtroCategoria);

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
      <section id="inicio" className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
        {/* Subtle CAD Drafting Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0B1E3D06_1px,transparent_1px),linear-gradient(to_bottom,#0B1E3D06_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Column: Headlines, Value Proposition & CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 space-y-6"
            >
              
              {/* Tag normativo */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-[#1565D8] text-xs font-bold uppercase tracking-wider shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#1565D8]" />
                <span>Engenharia Mecânica & Segurança Legal com ART</span>
              </div>

              {/* Impact Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-[#0B1E3D] tracking-tight leading-[1.12]">
                Engenharia Mecânica com{' '}
                <span className="text-[#1565D8] underline decoration-[#B0B4BA]/40 decoration-wavy decoration-2">
                  Segurança, Conformidade
                </span>{' '}
                e Precisão.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                Soluções completas para Adequação à NR-12 com Projetos Mecânicos e Execução, PMOC, Laudos de Playground, Máquinas Pesadas, Caminhões Munck e Inspeções Veiculares em Recife, Região Metropolitana e todo o estado de Pernambuco.
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
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>CREA-PE 1822299490</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>ART em 100% dos Laudos</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Projetos & Execução NR-12</span>
                </div>
              </div>

            </motion.div>

            {/* Right Column: Hero Visual Services Slider */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 relative flex justify-center"
            >
              <HeroServicesSlider />
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. SOBRE MIM SECTION */}
      <section id="sobre" className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Photo / Visual Card */}
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 flex justify-center"
            >
              <div className="relative w-full max-w-md">
                {/* Decorative border box */}
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-[#0B1E3D] to-[#1565D8] opacity-10 blur-sm"></div>
                
                <div className="relative bg-white rounded-2xl p-3 shadow-xl border border-slate-200 overflow-hidden">
                  <div className="aspect-4/5 rounded-xl bg-slate-900 flex flex-col items-center justify-end relative overflow-hidden group">
                    {/* Engineering Blueprint / CAD Theme Background */}
                    <img
                      src={engBlueprintBg}
                      alt="Engineering CAD Schematic Blueprint"
                      className="absolute inset-0 w-full h-full object-cover opacity-45 transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                    />
                    
                    {/* Technical CAD Blueprint Grid & Measurement Lines */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#38bdf812_1px,transparent_1px),linear-gradient(to_bottom,#38bdf812_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                    
                    {/* Animated blueprint mechanical gear watermark */}
                    <div className="absolute top-4 right-4 w-20 h-20 text-sky-400/25 pointer-events-none animate-[spin_30s_linear_infinite]">
                      <Cog className="w-full h-full" />
                    </div>

                    {/* CAD Technical Annotation Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-slate-950/80 backdrop-blur-xs border border-sky-500/30 text-sky-300 text-[9px] font-mono tracking-wider pointer-events-none flex items-center gap-1.5 shadow-sm">
                      <DraftingCompass className="w-3 h-3 text-sky-400" />
                      <span>CAD SCHEMATIC • CREA-PE 1822299490</span>
                    </div>

                    {/* Gradient highlight from bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-slate-950/40 pointer-events-none z-10"></div>

                    {/* Engineer photo with high resolution */}
                    <img
                      src={engineerPhoto}
                      alt="Vitor Leonardo - Engenheiro Mecânico CREA-PE"
                      className="w-full h-full object-contain object-bottom pt-2 transition-transform duration-300 group-hover:scale-102 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] relative z-20"
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
                    <div id="photo-fallback" className="hidden absolute inset-0 flex-col items-center justify-center p-6 text-center bg-slate-100 z-20">
                      <div className="w-20 h-20 rounded-full bg-[#0B1E3D] text-white flex items-center justify-center mb-4 shadow-md">
                        <UserCheck className="w-10 h-10 text-white" />
                      </div>
                      <h4 className="font-bold text-[#0B1E3D] text-lg">Vitor Leonardo</h4>
                      <p className="text-xs text-slate-500 font-mono mt-1">CREA-PE 1822299490</p>
                      <p className="text-xs text-slate-600 mt-2">Engenheiro Mecânico & Perito Técnico</p>
                    </div>

                    {/* Bottom floating badge */}
                    <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700/80 shadow-xl z-30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">Vitor Leonardo</p>
                          <p className="text-[11px] text-slate-300">Fundador & Responsável Técnico</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-blue-600/30 border border-blue-400/40 text-blue-300 font-bold text-[10px]">
                          CREA-PE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Biography & Text Summary */}
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 space-y-6"
            >
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
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. NOSSOS SERVIÇOS DE ENGENHARIA SECTION */}
      <section id="servicos" className="py-20 bg-slate-50/80 relative">
        {/* Subtle CAD dot pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#0B1E3D08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-3xl mx-auto mb-10 space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#1565D8] text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#1565D8]" />
              <span>Especialidades & Conformidade Legal</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E3D] tracking-tight">
              Nossos Serviços de Engenharia
            </h2>

            <p className="text-slate-600 text-base leading-relaxed max-w-2xl mx-auto">
              Atuação técnica especializada orientada à segurança legal, aumento de disponibilidade, 
              conformidade normativa e alta confiabilidade mecânica.
            </p>
          </motion.div>

          {/* Interactive Category Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 sm:pb-0 mb-10 gap-2 no-scrollbar"
          >
            <div className="inline-flex items-center p-1.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
              {CATEGORIAS_SERVICOS.map((cat) => {
                const isActive = filtroCategoria === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFiltroCategoria(cat.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-[#1565D8] text-white shadow-xs'
                        : 'text-slate-600 hover:text-[#0B1E3D] hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-semibold ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Interactive Engineering Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {servicosFiltrados.map((servico, index) => {
                const IconComp = servico.icon;
                return (
                  <motion.div
                    key={servico.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
                    whileHover={{ y: -5 }}
                    className={`bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer relative overflow-hidden ${servico.corTema.borderHover}`}
                    onClick={() => setModalServico(servico)}
                  >
                    {/* Top color indicator line */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 ${servico.corTema.dotColor} opacity-90`} />

                    <div className="space-y-4">
                      {/* Card Header: Custom Icon + Specialty Tag + Module Number */}
                      <div className="flex items-start justify-between gap-2 pt-1">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${servico.corTema.iconBg} ${servico.corTema.iconText} transition-all duration-300 group-hover:scale-105 shadow-2xs border border-slate-100`}
                        >
                          <IconComp className="w-6 h-6" />
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[11px] font-mono font-bold text-slate-400">
                            #{servico.numero}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-tight uppercase ${servico.corTema.badgeBg} ${servico.corTema.badgeText}`}
                          >
                            {servico.tagEspecialidade}
                          </span>
                        </div>
                      </div>

                      {/* Title & Normative Standard */}
                      <div className="space-y-1.5">
                        <h3 className="text-base font-bold text-[#0B1E3D] group-hover:text-[#1565D8] transition-colors leading-snug line-clamp-2">
                          {servico.titulo}
                        </h3>
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100/90 border border-slate-200/70 text-[11px] font-mono font-semibold text-slate-600">
                          <ShieldCheck className="w-3 h-3 text-[#1565D8] shrink-0" />
                          <span className="truncate max-w-[210px]">{servico.normas.split('•')[0]}</span>
                        </div>
                      </div>

                      {/* Brief description */}
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {servico.descricaoCurta}
                      </p>

                      {/* Scannable Key Highlights Checklist */}
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Principais Entregáveis:
                        </p>
                        {servico.destaquesVisuais.map((destaque, dIdx) => (
                          <div
                            key={dIdx}
                            className="flex items-start gap-1.5 text-xs text-slate-700 font-medium"
                          >
                            <CheckCircle2
                              className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${servico.corTema.iconText}`}
                            />
                            <span className="line-clamp-1">{destaque}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card Footer: Interactive Actions */}
                    <div
                      className="pt-4 border-t border-slate-100 mt-5 flex items-center justify-between gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => setModalServico(servico)}
                        className="text-xs font-bold text-[#1565D8] hover:text-[#0b4fb8] flex items-center gap-1 group/btn cursor-pointer transition-colors"
                      >
                        <span>Especificação</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </button>

                      <a
                        href={`https://wa.me/5581984442592?text=Ol%C3%A1%2C%20Eng.%20Vitor%20Leonardo!%20Gostaria%20de%20um%20or%C3%A7amento%20para%20${encodeURIComponent(servico.titulo)}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200/80 hover:border-emerald-600 text-xs font-bold transition-all shadow-2xs"
                        title={`Orçar ${servico.titulo} no WhatsApp`}
                      >
                        <Phone className="w-3 h-3" />
                        <span>Orçar WhatsApp</span>
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="mt-12 text-center max-w-xl mx-auto p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
            <p className="text-xs text-slate-600">
              <strong className="text-[#0B1E3D]">Precisa de um laudo customizado ou de uma norma específica?</strong>
              <br />
              Elaboramos ensaios técnicos, vistorias e perícias de engenharia mecânica sob demanda para indústrias, condomínios e órgãos reguladores.
            </p>
          </div>

        </div>
      </section>

      {/* 4. CONTATO / MEUS DADOS SECTION */}
      <section id="contato" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Official Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 space-y-8"
            >
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
            </motion.div>

            {/* Right Column: Interactive Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7"
            >
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
            </motion.div>

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

            {/* Modal Header with Custom Service Icon */}
            <div className="flex items-start gap-4 mb-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${modalServico.corTema.iconBg} ${modalServico.corTema.iconText} border border-slate-200/80 shadow-xs`}
              >
                <modalServico.icon className="w-6 h-6" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    Módulo {modalServico.numero}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${modalServico.corTema.badgeBg} ${modalServico.corTema.badgeText}`}
                  >
                    {modalServico.tagEspecialidade}
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#1565D8]">
                  {modalServico.normas}
                </span>
              </div>
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
