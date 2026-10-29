import React, { useState, useEffect, useRef, useCallback } from 'react';
import reviewsDataJson from '../../data/googleReviews.json';
import { DraftingCompass, Cog } from 'lucide-react';

// Service slides images & AI generated engineering assets
import imgNr12 from '../../assets/images/slide_nr12_projetos_1788998249591.jpg';
import imgMunck from '../../assets/images/slide_munck_guindaste_1788998260570.jpg';
import imgMaquinas from '../../assets/images/slide_maquinas_pesadas_1788998270208.jpg';
import imgPmoc from '../../assets/images/slide_pmoc_hvac_1788998279644.jpg';
import imgPlayground from '../../assets/images/slide_playground_laudo_1788998292265.jpg';
import imgPericia from '../../assets/images/pericia_veicular_detran_male_1793129813207.jpg';
import imgManutencao from '../../assets/images/art_manutencao_pcm_male_1793129813030.jpg';
import imgBlueprintBg from '../../assets/images/eng_blueprint_bg_1788996890188.jpg';
import imgVitorFallback from '../../assets/images/image.png';

import { BackgroundRotatingGears } from '../common/BackgroundRotatingGears';

interface ReviewItem {
  id?: string;
  text: string;
  author_name?: string;
  author?: string;
  relative_time_description?: string;
  relativeTime?: string;
  rating?: number;
}

interface GoogleReviewsData {
  rating: string;
  user_ratings_total?: number;
  totalReviews?: string;
  google_maps_url?: string;
  googleMapsUrl?: string;
  reviews?: ReviewItem[];
}

const reviewsData = reviewsDataJson as unknown as GoogleReviewsData;

interface TrabalhoRealizado {
  id: string;
  titulo: string;
  badge: string;
  norma: string;
  escopo: string;
  prazo: string;
  resumo: string;
  foto: string;
  whatsappMsg?: string;
}

const TRABALHOS_INICIAIS: TrabalhoRealizado[] = [
  {
    id: 'w1',
    titulo: 'Máquinas Pesadas & Terraplanagem',
    badge: 'Linha Amarela',
    norma: 'NR-11 · NR-12 · NR-18',
    escopo: 'Laudos de conformidade e segurança para frotas pesadas',
    prazo: '2 a 3 dias úteis',
    resumo: 'Inspeção técnica em escavadeiras, pás carregadeiras e tratores com atestação de proteções ROPS/FOPS e cálculo de risco HRN.',
    foto: imgMaquinas,
    whatsappMsg: 'Olá, Eng. Vitor Leonardo! Gostaria de um orçamento para laudo técnico de Máquinas Pesadas & Terraplanagem.'
  },
  {
    id: 'w2',
    titulo: 'Caminhões Munck & Guindastes',
    badge: 'Içamento & Carga',
    norma: 'NR-11 · NBR 14768 · NBR 8400',
    escopo: 'Ensaio de carga, teste hidrostático e calibração',
    prazo: '2 dias úteis',
    resumo: 'Inspeção estrutural minuciosa, ensaio de estanqueidade e teste de carga estático/dinâmico com tabela de carga atualizada.',
    foto: imgMunck,
    whatsappMsg: 'Olá, Eng. Vitor Leonardo! Preciso de um orçamento para laudo técnico e inspeção de Caminhão Munck ou Guindaste.'
  },
  {
    id: 'w3',
    titulo: 'Projetos Mecânicos 2D/3D & NR-12',
    badge: 'Projetos & NR-12',
    norma: 'NR-12 · NBR ISO 12100 · NBR ISO 13849',
    escopo: 'Apreciação de risco HRN e proteções mecânicas em CAD',
    prazo: 'Conforme escopo do projeto',
    resumo: 'Elaboração de projetos executivos em CAD, especificação de enclausuramento e intertravamento de máquinas, cálculo de risco e validação técnica.',
    foto: imgNr12,
    whatsappMsg: 'Olá, Eng. Vitor Leonardo! Gostaria de um orçamento para Projetos Mecânicos 2D/3D e Adequação à NR-12.'
  },
  {
    id: 'w4',
    titulo: 'PMOC & Climatização Industrial (HVAC-R)',
    badge: 'Climatização Legal',
    norma: 'Lei Federal 13.589/2018 · NBR 16401 · ANVISA',
    escopo: 'Elaboração e acompanhamento contínuo de PMOC',
    prazo: '3 dias úteis',
    resumo: 'Plano de Manutenção, Operação e Controle para sistemas de ar-condicionado e chillers, assegurando qualidade do ar interior e conformidade sanitária.',
    foto: imgPmoc,
    whatsappMsg: 'Olá, Eng. Vitor Leonardo! Preciso de orçamento para elaboração de PMOC e laudo de climatização.'
  },
  {
    id: 'w5',
    titulo: 'Laudos de Playground & Áreas de Lazer',
    badge: 'Segurança Infantil',
    norma: 'NBR 16071 (Partes 1 a 7)',
    escopo: 'Vistoria mecânica e avaliação de impacto em brinquedos',
    prazo: '1 a 2 dias úteis',
    resumo: 'Inspeção mecânica detalhada em brinquedos, ancoragens, correntes, escorregadores e pisos amortecedores para condomínios, escolas e clubes.',
    foto: imgPlayground,
    whatsappMsg: 'Olá, Eng. Vitor Leonardo! Gostaria de um orçamento para Laudo Técnico de Playground sob a NBR 16071.'
  },
  {
    id: 'w6',
    titulo: 'Perícia Veicular & Reclassificação de Monta',
    badge: 'Perícia Automotiva',
    norma: 'Resoluções CONTRAN · Normas DETRAN',
    escopo: 'Perícia técnica forense e desbloqueio de veículo sinistrado',
    prazo: '3 dias úteis',
    resumo: 'Avaliação de danos estruturais, componentes mecânicos e sistemas de segurança com laudo pericial conclusivo para regularização junto ao DETRAN.',
    foto: imgPericia,
    whatsappMsg: 'Olá, Eng. Vitor Leonardo! Preciso de parecer técnico e perícia veicular para regularização junto ao DETRAN.'
  },
  {
    id: 'w7',
    titulo: 'ART de Manutenção & Gestão PCM',
    badge: 'Gestão PCM',
    norma: 'Lei Federal 6.496 · Resoluções CONFEA',
    escopo: 'Responsabilidade técnica formal e rotinas preventivas/preditivas',
    prazo: 'Contrato técnico contínuo',
    resumo: 'Acompanhamento de rotinas de manutenção industrial e predial, controle de indicadores MTBF/MTTR e emissão de ART de responsabilidade técnica.',
    foto: imgManutencao,
    whatsappMsg: 'Olá, Eng. Vitor Leonardo! Gostaria de conversar sobre ART de Manutenção e Gestão PCM para nossa empresa.'
  }
];

export interface SubtipoServico {
  nome: string;
  normaRef: string;
  detalhe: string;
}

export interface ServicoItem {
  nome: string;
  norma: string;
  descricao: string;
  subtipos: SubtipoServico[];
}

export const SERVICOS_LISTA: ServicoItem[] = [
  {
    nome: 'Adequação à NR-12 e projetos mecânicos',
    norma: 'NR-12 · NBR ISO 12100',
    descricao: 'Apreciação de risco, projeto de proteções mecânicas, enclausuramento e documentação técnica oficial.',
    subtipos: [
      {
        nome: 'Laudo de Apreciação / Análise de Risco (HRN e NBR ISO 12100)',
        normaRef: 'NR-12 item 12.38 · ISO 12100',
        detalhe: 'Identificação de perigos mecânicos, estimativa de risco quantitativa (HRN) e definição de Categoria de Segurança requerida (PLr).'
      },
      {
        nome: 'Laudo de Adequação de Proteções Físicas e Intertravamentos',
        normaRef: 'NR-12 Anexos e NBR ISO 13849',
        detalhe: 'Dimensionamento de proteções em policarbonato/chapa, distâncias de segurança e chaves de intertravamento codificadas com bloqueio.'
      },
      {
        nome: 'Laudo de Validação / Retrofit de Segurança em Máquinas',
        normaRef: 'NR-12 · ABNT NBR 14153',
        detalhe: 'Atestação e validação técnica das alterações mecânicas e elétricas implementadas com liberação formal para operação segura.'
      },
      {
        nome: 'Projetos Mecânicos Executivos 2D/3D em CAD com ART',
        normaRef: 'CREA-PE · ABNT',
        detalhe: 'Modelagem 3D, detalhamento para caldeiraria e usinagem, memoriais descritivos de cálculo estrutural e ART de projeto e execução.'
      }
    ]
  },
  {
    nome: 'Laudo de máquinas pesadas',
    norma: 'NR-11 · NR-12 · NR-18',
    descricao: 'Inspeção de conformidade operacional, segurança de tráfego e estruturas de proteção (ROPS/FOPS).',
    subtipos: [
      {
        nome: 'Laudo de Integridade Estrutural e Segurança Operacional (NR-12 / NR-18)',
        normaRef: 'NR-12 Anexo XI · NR-18',
        detalhe: 'Vistoria minuciosa de escavadeiras hidráulicas, retroescavadeiras e pás carregadeiras (chassi, freios, direção, pinos e cilindros).'
      },
      {
        nome: 'Laudo de Conformidade de Estruturas de Proteção (ROPS / FOPS)',
        normaRef: 'ABNT NBR ISO 3471 (ROPS) e ISO 3449 (FOPS)',
        detalhe: 'Atestação da integridade estrutural das cabines de proteção contra capotamento (ROPS) e queda de materiais pesados (FOPS).'
      },
      {
        nome: 'Laudo de Inspeção Periódica de Manutenção e Segurança',
        normaRef: 'NR-11 · NR-18',
        detalhe: 'Avaliação técnica de motoniveladoras, rolos compactadores e tratores de esteira com emissão de plano de ação corretivo e ART.'
      }
    ]
  },
  {
    nome: 'Caminhões munck e guindastes',
    norma: 'NR-11 · NBR 14768',
    descricao: 'Ensaio de carga com célula calibrada, estanqueidade hidráulica, tabela de carga e rigging.',
    subtipos: [
      {
        nome: 'Laudo de Teste de Carga (Load Test) Estático e Dinâmico',
        normaRef: 'ABNT NBR 14768 · NR-11',
        detalhe: 'Ensaio de içamento com peso padrão aferido, medição de deflexão da lança telescópica e estanqueidade de válvulas de sustentação.'
      },
      {
        nome: 'Laudo de Liberação e Conformidade NR-11 / NR-12',
        normaRef: 'NR-11 · NBR 8400',
        detalhe: 'Inspeção de sapatas estabilizadoras, grampos, cabos de aço, ganchos, moitões e comandos hidráulicos.'
      },
      {
        nome: 'Laudo de Aferição do Limitador de Momento de Carga (LMI) e Rigging',
        normaRef: 'ABNT NBR 16463',
        detalhe: 'Calibração de sensores de ângulo e momento de carga, emissão de tabela de carga oficial e validação de plano de içamento.'
      }
    ]
  },
  {
    nome: 'Perícia veicular e reclassificação de monta',
    norma: 'DETRAN · CONTRAN',
    descricao: 'Parecer técnico para desbloqueio de veículo sinistrado, análise estrutural e perícia forense.',
    subtipos: [
      {
        nome: 'Laudo Pericial de Reclassificação de Monta Veicular',
        normaRef: 'Resolução CONTRAN 810/2020 · DETRAN-PE',
        detalhe: 'Inspeção e parecer técnico circunstanciado para reclassificação de Grande ou Média Monta para Pequena Monta junto ao DETRAN.'
      },
      {
        nome: 'Laudo de Avaliação de Sinistro Veicular e Danos Estruturais',
        normaRef: 'ABNT NBR 14653-5',
        detalhe: 'Medição milimétrica de alinhamento de longarinas, monobloco, integridade de soldas de fábrica e colunas estruturais A/B/C.'
      },
      {
        nome: 'Laudo Pericial de Análise de Falha Mecânica (Root Cause Analysis)',
        normaRef: 'Engenharia Forense · CREA-PE',
        detalhe: 'Investigação pericial de quebra de componentes mecânicos (fadiga, falha de freio, eixos ou direção) para processos judiciais e seguradoras.'
      }
    ]
  },
  {
    nome: 'Laudo de playgrounds',
    norma: 'NBR 16071',
    descricao: 'Inspeção de brinquedos, pisos amortecedores, riscos de aprisionamento e fixações.',
    subtipos: [
      {
        nome: 'Laudo Técnico de Inspeção de Playground (ABNT NBR 16071)',
        normaRef: 'ABNT NBR 16071 Partes 1 a 7',
        detalhe: 'Inspeção de balanços, escorregadores, gangorras, tirolesas e casinhas em condomínios, escolas e clubes.'
      },
      {
        nome: 'Laudo de Análise de Risco de Aprisionamento e Queda',
        normaRef: 'NBR 16071-2 · NBR 16071-3',
        detalhe: 'Medição de aberturas com sondas normatizadas para prevenção de aprisionamento de cabeça, pescoço, dedos e roupas.'
      },
      {
        nome: 'Laudo de Piso Amortecedor e Ancoragens Estruturais',
        normaRef: 'NBR 16071-3 · NBR 16071-4',
        detalhe: 'Verificação da área de circulação, espessura e atenuação de impacto do piso (areia, borracha ou grama sintética) e ancoragens.'
      }
    ]
  },
  {
    nome: 'PMOC e projetos de HVAC-R',
    norma: 'Lei 13.589 · NBR 16401',
    descricao: 'Elaboração de PMOC, projetos de climatização e refrigeração, laudos de qualidade do ar e acompanhamento de manutenção.',
    subtipos: [
      {
        nome: 'Laudo e Plano de PMOC (Lei 13.589/2018 e Portaria 3.523/MS)',
        normaRef: 'Lei 13.589/2018 · RE 09/ANVISA',
        detalhe: 'Inventário completo de condicionadores de ar e chillers, definição de periodicidades de limpeza e rotinas de manutenção preventiva.'
      },
      {
        nome: 'Laudo de Inspeção Técnico-Sanitária e Qualidade do Ar Interior',
        normaRef: 'Resolução RE 09 ANVISA · NBR 16401',
        detalhe: 'Inspeção de filtros, bandejas de condensado, serpentinas e atestação da taxa de renovação de ar exterior com ART técnica.'
      },
      {
        nome: 'Projetos de Climatização e Refrigeração (HVAC-R)',
        normaRef: 'ABNT NBR 16401 Partes 1, 2 e 3',
        detalhe: 'Cálculo de carga térmica psicrométrica, dimensionamento de dutos, grelhas e eficiência energética para indústrias e edifícios.'
      }
    ]
  },
  {
    nome: 'ART de manutenção e gestão PCM',
    norma: 'Lei 6.496 · CONFEA',
    descricao: 'Responsabilidade técnica formal, rotinas preditivas/preventivas e indicadores MTBF/MTTR.',
    subtipos: [
      {
        nome: 'Laudo com ART de Manutenção e Liberação de Operação',
        normaRef: 'Lei 6.496/77 · Resolução CONFEA',
        detalhe: 'Emissão de ART formal de cargo e função para empresas, indústrias, construtoras e frotas perante órgãos e clientes.'
      },
      {
        nome: 'Laudo de Diagnóstico de Maturidade em Gestão de Ativos (PCM / ISO 55001)',
        normaRef: 'ABNT NBR ISO 55001',
        detalhe: 'Estruturação de cronogramas PCM, mapeamento de criticidade de máquinas e controle de indicadores de confiabilidade MTBF e MTTR.'
      },
      {
        nome: 'Laudo de Conformidade de Grupos Geradores e Utilidades Industriais',
        normaRef: 'NR-10 · NR-12 · ABNT',
        detalhe: 'Vistoria mecânica em geradores diesel de emergência, compressores de ar e sistemas de bombeamento industrial.'
      }
    ]
  }
];

const FAQ_ITENS = [
  {
    pergunta: 'Qual o prazo para emitir a ART no CREA-PE?',
    resposta: 'Até 48 horas úteis após a vistoria técnica. Em casos de notificação fiscalizatória ou embargo de obra, emitimos em regime de urgência prioritária.'
  },
  {
    pergunta: 'Qual a validade do laudo de munck ou guindaste?',
    resposta: 'Em regra a validade é anual, ou após qualquer reparo estrutural relevante, substituição de cabo de aço ou intervenção no sistema hidráulico.'
  },
  {
    pergunta: 'Todo condomínio ou empresa precisa de PMOC?',
    resposta: 'Sim, a Lei Federal 13.589/2018 exige o Plano de Manutenção, Operação e Controle em edifícios de uso público e coletivo climatizados, sob pena de autuação sanitária.'
  },
  {
    pergunta: 'O laudo vale para seguradoras, auditorias e fiscalização?',
    resposta: 'Sim, com validade jurídica plena. Todo laudo acompanha ART registrada no CREA-PE e QR Code oficial para validação instantânea por auditores e fiscais.'
  }
];

export const LandingPage: React.FC = () => {
  // Official Vitor Photo URL from user request
  const VITOR_PHOTO_URL = 'https://www.vlengenhariamecanica.com.br/assets/image-Ca17hHDt.png';

  // Works state
  const [trabalhos] = useState<TrabalhoRealizado[]>(TRABALHOS_INICIAIS);
  const [modalTrabalho, setModalTrabalho] = useState<{ item: TrabalhoRealizado; index: number } | null>(null);

  // Expandable services sub-panels state
  const [expandedServicos, setExpandedServicos] = useState<Record<number, boolean>>({});

  const toggleExpandServico = (index: number) => {
    setExpandedServicos(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Expandable FAQ state with smooth slide
  const [faqAberto, setFaqAberto] = useState<Record<number, boolean>>({ 0: true });

  const toggleFaq = (idx: number) => {
    setFaqAberto(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Carousel continuous animation states
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const posRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const manualUntilRef = useRef<number>(0);
  const touchHoldTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Contact form state
  const [formNome, setFormNome] = useState('');
  const [formServico, setFormServico] = useState(SERVICOS_LISTA[0].nome);
  const [formMensagem, setFormMensagem] = useState('');

  // Continuous infinite lateral carousel loop (~44 px/s)
  useEffect(() => {
    let rafId: number;

    const loop = (t: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = t;
      const dt = Math.min(0.1, (t - lastTimeRef.current) / 1000);
      lastTimeRef.current = t;

      const trk = trackRef.current;
      if (trk) {
        const half = trk.scrollWidth / 2;
        const isModalOpen = modalTrabalho !== null;
        if (!paused && !isHovered && !isModalOpen && t > manualUntilRef.current && half > 0) {
          posRef.current += 44 * dt;
          if (posRef.current >= half) {
            posRef.current -= half;
          }
          trk.scrollLeft = posRef.current;
        } else {
          if (half > 0 && trk.scrollLeft >= half) {
            trk.scrollLeft -= half;
          }
          posRef.current = trk.scrollLeft;
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      if (touchHoldTimerRef.current) clearTimeout(touchHoldTimerRef.current);
    };
  }, [paused, isHovered, modalTrabalho]);

  const manualStep = useCallback((direction: number) => {
    manualUntilRef.current = performance.now() + 3500;
    if (trackRef.current) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      trackRef.current.scrollBy({
        left: direction * 320,
        behavior: prefersReduced ? 'auto' : 'smooth'
      });
    }
  }, []);

  const handleTouchStart = () => {
    setIsHovered(true);
    if (touchHoldTimerRef.current) clearTimeout(touchHoldTimerRef.current);
  };

  const handleTouchEnd = () => {
    if (touchHoldTimerRef.current) clearTimeout(touchHoldTimerRef.current);
    touchHoldTimerRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 2500);
  };

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Olá, sou ${formNome || 'Cliente'}. Quero orçar: ${formServico}. ${formMensagem}`;
    const url = `https://wa.me/5581984442592?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalTrabalho) {
        setModalTrabalho(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalTrabalho]);

  return (
    <div className="bg-[var(--paper)] text-[var(--ink)] relative">
      {/* Engineering Rotating Gears in Background (Low Visibility) */}
      <BackgroundRotatingGears />
      
      {/* 2. Hero Section */}
      <section className="py-12 md:py-20 relative z-10">
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-10 md:gap-14 items-center">
            
            {/* Vitor Portrait 4:5 with Engineering Blueprint Background */}
            <div className="relative group max-w-[340px] md:max-w-none mx-auto w-full">
              <div 
                className="relative block aspect-[4/5] rounded-[16px] border-[1.5px] border-[var(--line)] bg-[#0d2242] overflow-hidden text-[#C9D8EE] shadow-[10px_10px_0_var(--blue)] select-none"
                aria-label="Vitor Leonardo, Engenheiro Mecânico CREA-PE 1822299490"
              >
                {/* Engineering Blueprint CAD Background (Lighter technical background as requested) */}
                <img 
                  src={imgBlueprintBg} 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover opacity-85 brightness-110 contrast-110"
                  aria-hidden="true"
                />
                
                {/* Technical Blueprint Gradient Overlay */}
                <div className="absolute inset-0 bg-[#0B2447]/30 mix-blend-multiply pointer-events-none" />

                {/* Top Left Badge: CAD SCHEMATIC • CREA-PE 1822299490 */}
                <div className="absolute top-3.5 left-3.5 z-20 bg-[rgba(5,14,28,0.88)] text-[#6BA2FA] backdrop-blur-xs text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#1E5BD8]/40 flex items-center gap-1.5 shadow-sm">
                  <DraftingCompass className="w-3.5 h-3.5 text-[#1E5BD8]" />
                  <span>CAD SCHEMATIC · CREA-PE 1822299490</span>
                </div>

                {/* Top Right Rotating Blue Gear Accent */}
                <div className="absolute top-2 right-2 w-16 h-16 pointer-events-none opacity-50 z-20 animate-gear-slow text-[#1E5BD8]">
                  <Cog className="w-full h-full" />
                </div>

                {/* Vitor portrait */}
                <img 
                  src={VITOR_PHOTO_URL} 
                  alt="Vitor Leonardo, Engenheiro Mecânico CREA-PE 1822299490" 
                  onError={(e) => {
                    e.currentTarget.src = imgVitorFallback;
                  }}
                  className="absolute inset-0 w-full h-full object-cover z-10 drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)]"
                />

                {/* Caption overlay with CREA-PE badge */}
                <div className="absolute left-0 right-0 bottom-0 p-3.5 sm:p-4 bg-gradient-to-t from-[rgba(5,14,28,0.96)] via-[rgba(5,14,28,0.75)] to-transparent text-white text-[13.5px] z-20 flex items-end justify-between gap-2 border-t border-white/10">
                  <div>
                    <b className="block font-[family-name:var(--d)] text-[18px] text-white leading-tight">Vitor Leonardo</b>
                    <span className="text-[#C9D8EE] text-[13px] block">Fundador & Responsável Técnico</span>
                  </div>
                  <span className="bg-[#1E5BD8]/35 text-[#93C5FD] border border-[#1E5BD8]/55 text-[11px] font-bold px-2.5 py-1 rounded tracking-wide shadow-xs">
                    CREA-PE
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Copy */}
            <div>
              <h1 className="text-[34px] sm:text-[44px] lg:text-[54px] font-extrabold leading-[1.08] tracking-tight">
                Engenharia mecânica com <em className="not-italic text-[var(--blue)]">segurança</em>, conformidade e precisão.
              </h1>
              
              <p className="text-[18px] sm:text-[19px] text-[var(--muted)] max-w-[52ch] my-5 sm:my-7 leading-relaxed font-[family-name:var(--b)]">
                Laudos, ART e adequação à NR-12 para máquinas pesadas, caminhões munck, guindastes e playgrounds em Pernambuco. Quem vistoria é quem assina.
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://wa.me/5581984442592?text=Ol%C3%A1%2C%20quero%20um%20or%C3%A7amento."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-tech wa text-[16px] px-6 py-3"
                >
                  Solicitar orçamento via WhatsApp
                </a>
                <a
                  href="#servicos"
                  className="btn-tech text-[16px] px-6 py-3"
                >
                  Ver serviços
                </a>
              </div>

              {/* 3 Proof items */}
              <div className="flex flex-wrap gap-7 sm:gap-10 mt-8 pt-6 border-t border-[var(--line)] text-[15px] text-[var(--muted)] font-[family-name:var(--b)]">
                <div>
                  <b className="block text-[var(--ink)] font-bold text-[16px]">ART em até 48 h úteis</b>
                  <span>após a vistoria técnica</span>
                </div>
                <div>
                  <b className="block text-[var(--ink)] font-bold text-[16px]">Recife e todo o estado</b>
                  <span>visita técnica no local</span>
                </div>
                <a href="#avaliacoes" className="hover:text-[var(--blue)] transition-colors block">
                  <b className="block text-[var(--ink)] font-bold text-[16px]">★ 5,0 no Google</b>
                  <span>ver avaliações</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Trabalhos e Especialidades - Continuous Lateral Carousel */}
      <section id="trabalhos" className="pt-0 pb-12 border-t border-[var(--line)] bg-[var(--paper)] relative z-10">
        <div className="max-w-[1120px] mx-auto px-6 mb-6 pt-10">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-[28px] sm:text-[38px] font-extrabold tracking-tight">
                Trabalhos realizados
              </h2>
              <p className="text-[var(--muted)] text-[15.5px] mt-1 max-w-[54ch]">
                Conheça os serviços técnicos, normas de engenharia aplicáveis e laudos de conformidade.
              </p>
            </div>
            <div className="nv">
              <button
                type="button"
                onClick={() => setPaused(!paused)}
                aria-pressed={paused}
                aria-label={paused ? 'Continuar carrossel' : 'Pausar carrossel'}
                className="btn-tech sm text-[14px]"
              >
                {paused ? 'Continuar' : 'Pausar'}
              </button>
              <button
                type="button"
                onClick={() => manualStep(-1)}
                className="btn-tech sm w-10 h-10 p-0 text-lg flex items-center justify-center cursor-pointer"
                aria-label="Trabalhos anteriores"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => manualStep(1)}
                className="btn-tech sm w-10 h-10 p-0 text-lg flex items-center justify-center cursor-pointer"
                aria-label="Próximos trabalhos"
              >
                ›
              </button>
            </div>
          </div>
        </div>

        {/* Continuous Track with duplicated cards for seamless infinite cycle */}
        <div 
          ref={trackRef}
          tabIndex={0}
          aria-label="Trabalhos e especialidades, role para o lado"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="track focus:outline-none"
        >
          {/* First original set */}
          {trabalhos.map((work, idx) => (
            <button
              key={`orig-${work.id || idx}`}
              type="button"
              onClick={() => setModalTrabalho({ item: work, index: idx })}
              className="wk group"
            >
              <div className="wph relative overflow-hidden">
                <img 
                  src={work.foto} 
                  alt={work.titulo} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {work.badge && (
                  <span className="absolute top-2.5 left-2.5 bg-[rgba(5,14,28,0.85)] text-[#3DD27A] backdrop-blur-xs text-[11.5px] font-bold px-2.5 py-0.5 rounded-full border border-white/10 flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] inline-block"></span>
                    {work.badge}
                  </span>
                )}
              </div>
              <div className="tx flex flex-col justify-between">
                <div>
                  <h3>{work.titulo}</h3>
                  <p className="text-[var(--blue)] font-semibold text-[13.5px] mb-2">{work.norma}</p>
                  <p className="text-[var(--muted)] text-[14px] line-clamp-2 leading-snug">{work.resumo}</p>
                </div>
                <div className="pt-3 mt-2 border-t border-[var(--line)] flex items-center justify-between text-[13px] text-[var(--muted)] font-medium">
                  <span>Ver escopo detalhado</span>
                  <span className="text-[var(--blue)] font-bold">→</span>
                </div>
              </div>
            </button>
          ))}

          {/* Second duplicate set for infinite seamless loop (accessible hiding) */}
          {trabalhos.map((work, idx) => (
            <button
              key={`dup-${work.id || idx}`}
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              onClick={() => setModalTrabalho({ item: work, index: idx })}
              className="wk group"
            >
              <div className="wph relative overflow-hidden">
                <img 
                  src={work.foto} 
                  alt={work.titulo} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {work.badge && (
                  <span className="absolute top-2.5 left-2.5 bg-[rgba(5,14,28,0.85)] text-[#3DD27A] backdrop-blur-xs text-[11.5px] font-bold px-2.5 py-0.5 rounded-full border border-white/10 flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] inline-block"></span>
                    {work.badge}
                  </span>
                )}
              </div>
              <div className="tx flex flex-col justify-between">
                <div>
                  <h3>{work.titulo}</h3>
                  <p className="text-[var(--blue)] font-semibold text-[13.5px] mb-2">{work.norma}</p>
                  <p className="text-[var(--muted)] text-[14px] line-clamp-2 leading-snug">{work.resumo}</p>
                </div>
                <div className="pt-3 mt-2 border-t border-[var(--line)] flex items-center justify-between text-[13px] text-[var(--muted)] font-medium">
                  <span>Ver escopo detalhado</span>
                  <span className="text-[var(--blue)] font-bold">→</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Accessible Modal Dialog for Work Detail */}
      {modalTrabalho && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(5,14,28,0.65)] backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalTrabalho(null);
          }}
        >
          <div className="wk-dialog bg-[var(--card)] text-[var(--ink)] border-[1.5px] border-[var(--line)] rounded-2xl w-full max-w-[580px] max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Photo */}
            <div className="wph aspect-video relative overflow-hidden">
              <img 
                src={modalTrabalho.item.foto} 
                alt={modalTrabalho.item.titulo} 
                className="w-full h-full object-cover"
              />
              {modalTrabalho.item.badge && (
                <span className="absolute top-3.5 left-3.5 bg-[rgba(5,14,28,0.85)] text-[#3DD27A] backdrop-blur-xs text-[12px] font-bold px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] inline-block"></span>
                  {modalTrabalho.item.badge}
                </span>
              )}
            </div>

            <div className="tx p-6">
              <div className="flex items-start justify-between gap-4">
                <h3 id="dialog-title" className="text-[22px] font-extrabold leading-snug">
                  {modalTrabalho.item.titulo}
                </h3>
              </div>

              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 text-[14.5px] my-5 border-y border-[var(--line)] py-4">
                <dt className="text-[var(--muted)] font-medium">Normas aplicáveis</dt>
                <dd className="font-semibold text-[var(--ink)]">{modalTrabalho.item.norma}</dd>
                <dt className="text-[var(--muted)] font-medium">Escopo técnico</dt>
                <dd className="font-semibold text-[var(--ink)]">{modalTrabalho.item.escopo}</dd>
                <dt className="text-[var(--muted)] font-medium">Prazo estimado</dt>
                <dd className="font-semibold text-[var(--ink)]">{modalTrabalho.item.prazo}</dd>
              </dl>

              <div className="mb-6">
                <h4 className="text-xs uppercase tracking-wider font-bold text-[var(--muted)] mb-2">Resumo do serviço</h4>
                <p className="text-[var(--muted)] text-[15px] leading-relaxed">
                  {modalTrabalho.item.resumo}
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-2">
                <a
                  href={`https://wa.me/5581984442592?text=${encodeURIComponent(
                    modalTrabalho.item.whatsappMsg || 'Quero orçar o serviço de: ' + modalTrabalho.item.titulo
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-tech wa text-[14.5px]"
                >
                  Orçar este serviço via WhatsApp
                </a>

                <button
                  type="button"
                  onClick={() => setModalTrabalho(null)}
                  className="btn-tech text-[14.5px] ml-auto"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Avaliações no Google (#avaliacoes) */}
      <section id="avaliacoes" className="pt-2 pb-14 border-t border-[var(--line)] bg-[var(--paper)] relative z-10">
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="gg">
            <div>
              <div className="big">{reviewsData.rating}</div>
              <div className="stars" role="img" aria-label={`Nota ${reviewsData.rating} de 5 no Google`}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2.5l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.4 6.1 20.7l1.3-6.6L2.5 9.5l6.6-.8z" />
                  </svg>
                ))}
              </div>
              <p className="text-[var(--muted)] text-[16px] font-[family-name:var(--b)]">
                <b className="text-[var(--ink)] font-bold">{reviewsData.user_ratings_total || reviewsData.totalReviews || '12'} avaliações</b> no Google
              </p>

              <div className="cta flex gap-3 flex-wrap mt-5">
                <a 
                  className="btn-tech text-[15px]" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  href={reviewsData.google_maps_url || reviewsData.googleMapsUrl || 'https://www.google.com/maps/search/?api=1&query=VL+Engenharia+Mec%C3%A2nica+Recife'}
                >
                  Ver no Google
                </a>
                <a 
                  className="btn-tech pri text-[15px]" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  href={reviewsData.google_maps_url || reviewsData.googleMapsUrl || 'https://www.google.com/maps/search/?api=1&query=VL+Engenharia+Mec%C3%A2nica+Recife'}
                >
                  Avaliar a VL
                </a>
              </div>

              <span className="ex mt-4 inline-block">
                Dados de exemplo: trocar pela nota e avaliações reais
              </span>
            </div>

            {/* Reviews Quotes */}
            <div className="rv">
              {reviewsData.reviews && reviewsData.reviews.length > 0 ? (
                reviewsData.reviews.slice(0, 3).map((rev, i) => (
                  <blockquote key={rev.id || i} className="py-4 border-b border-[var(--line)]">
                    <q className="text-[17px] font-[family-name:var(--b)] leading-relaxed">
                      “{rev.text}”
                    </q>
                    <small className="block text-[var(--muted)] text-[13.5px] mt-2">
                      {rev.author_name || rev.author || 'Cliente Google'} · {rev.relative_time_description || rev.relativeTime || 'recente'}
                    </small>
                  </blockquote>
                ))
              ) : (
                <div className="py-8 text-[var(--muted)] text-[15px]">
                  Nenhum comentário público no momento.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Serviços (O que a VL inspeciona e certifica) com subtipos expansíveis */}
      <section id="servicos" className="pt-2 pb-14 border-t border-[var(--line)] bg-[var(--paper)] relative z-10">
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-[28px] sm:text-[38px] font-extrabold tracking-tight">
                O que a VL inspeciona e certifica
              </h2>
              <p className="text-[var(--muted)] text-[16px] mt-1 max-w-[54ch]">
                Clique no botão de cada especialidade para ver detalhadamente os laudos, escopos e normas atendidas.
              </p>
            </div>
          </div>

          <div className="border-t-2 border-[var(--ink)]">
            {SERVICOS_LISTA.map((serv, index) => {
              const isExpanded = !!expandedServicos[index];
              return (
                <div 
                  key={index}
                  className="border-b border-[var(--line)] py-5 px-2 hover:bg-[var(--card)]/40 transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.5fr_1.5fr_auto] gap-3 md:gap-5 items-center">
                    <h3 className="font-[family-name:var(--d)] text-[18.5px] font-bold text-[var(--ink)]">
                      {serv.nome}
                    </h3>
                    
                    <div>
                      <span className="font-[family-name:var(--b)] font-semibold text-[13px] bg-[var(--card)] border border-[var(--line)] rounded px-2.5 py-0.5 inline-block text-[var(--muted)]">
                        {serv.norma}
                      </span>
                    </div>

                    <p className="text-[var(--muted)] text-[15px] m-0 leading-relaxed">
                      {serv.descricao}
                    </p>

                    <div className="flex items-center gap-2.5 md:justify-self-end mt-2 md:mt-0">
                      <button
                        type="button"
                        onClick={() => toggleExpandServico(index)}
                        aria-expanded={isExpanded}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--blue)] hover:bg-[var(--card)] transition-colors cursor-pointer select-none"
                        title={isExpanded ? 'Ocultar subtipos' : 'Expandir subtipos'}
                        aria-label={isExpanded ? 'Ocultar subtipos' : 'Expandir subtipos'}
                      >
                        <span 
                          className={`text-[24px] font-semibold leading-none transition-transform duration-300 inline-block select-none ${
                            isExpanded ? 'rotate-45' : 'rotate-0'
                          }`}
                        >
                          +
                        </span>
                      </button>

                      <a
                        href={`https://wa.me/5581984442592?text=${encodeURIComponent('Quero orçar: ' + serv.nome)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-tech wa sm text-[13.5px]"
                      >
                        Orçar
                      </a>
                    </div>
                  </div>

                  {/* Smooth Minimalist Expandable Subtypes */}
                  <div 
                    className="grid transition-all duration-300 ease-in-out"
                    style={{
                      gridTemplateRows: isExpanded ? '1fr' : '0fr',
                      opacity: isExpanded ? 1 : 0
                    }}
                  >
                    <div className="overflow-hidden">
                      <div className="pt-3 pb-1 pl-3 sm:pl-5 border-l-2 border-[var(--blue)]/35 my-2 space-y-3">
                        {serv.subtipos.map((sub, sIdx) => (
                          <div 
                            key={sIdx}
                            className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-4 py-1.5 border-b border-[var(--line)]/40 last:border-0"
                          >
                            <div className="space-y-0.5 max-w-[76ch]">
                              <div className="flex flex-wrap items-baseline gap-2">
                                <span className="font-semibold text-[14.5px] text-[var(--ink)]">
                                  {sub.nome}
                                </span>
                                <span className="text-[12px] text-[var(--muted)] font-mono">
                                  · {sub.normaRef}
                                </span>
                              </div>
                              <p className="text-[13.5px] text-[var(--muted)] m-0 leading-relaxed font-[family-name:var(--b)]">
                                {sub.detalhe}
                              </p>
                            </div>

                            <a
                              href={`https://wa.me/5581984442592?text=${encodeURIComponent(
                                'Olá, Eng. Vitor Leonardo! Gostaria de um orçamento para: ' + sub.nome + ' (' + sub.normaRef + ')'
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[13px] font-semibold text-[var(--blue)] hover:underline whitespace-nowrap self-start sm:self-auto flex items-center gap-1 transition-colors"
                            >
                              <span>Orçar</span>
                              <span aria-hidden="true">→</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Como Funciona (3 Passos) */}
      <section id="processo" className="py-16 border-t border-[var(--line)] bg-[var(--card)] relative z-10">
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="mb-10">
            <h2 className="text-[28px] sm:text-[38px] font-extrabold tracking-tight">
              Da primeira mensagem ao laudo em mãos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-[34px] h-[34px] rounded-full bg-[var(--blue)] text-[var(--onblue)] font-[family-name:var(--d)] font-bold text-[16px] flex items-center justify-center">
                1
              </div>
              <h3 className="text-[20px] font-bold">Você descreve o equipamento</h3>
              <p className="text-[var(--muted)] text-[15.5px] leading-relaxed">
                Pelo WhatsApp ou formulário. Respondemos com escopo e valor no mesmo dia útil.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-[34px] h-[34px] rounded-full bg-[var(--blue)] text-[var(--onblue)] font-[family-name:var(--d)] font-bold text-[16px] flex items-center justify-center">
                2
              </div>
              <h3 className="text-[20px] font-bold">Vistoria no local</h3>
              <p className="text-[var(--muted)] text-[15.5px] leading-relaxed">
                O engenheiro vai até a obra, fábrica ou condomínio, mede, testa e fotografa.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-[34px] h-[34px] rounded-full bg-[var(--blue)] text-[var(--onblue)] font-[family-name:var(--d)] font-bold text-[16px] flex items-center justify-center">
                3
              </div>
              <h3 className="text-[20px] font-bold">Laudo e ART digitais</h3>
              <p className="text-[var(--muted)] text-[15.5px] leading-relaxed">
                Documento assinado, com QR Code de autenticação, em até 48 horas úteis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Dúvidas Frequentes */}
      <section id="faq" className="py-14 border-t border-[var(--line)] bg-[var(--paper)] relative z-10">
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="mb-8">
            <h2 className="text-[28px] sm:text-[38px] font-extrabold tracking-tight">
              Dúvidas frequentes
            </h2>
          </div>

          <div className="space-y-0">
            {FAQ_ITENS.map((item, idx) => {
              const isOpen = !!faqAberto[idx];
              return (
                <div 
                  key={idx}
                  className="border-b border-[var(--line)] first:border-t-2 first:border-[var(--ink)] py-4 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    className="w-full text-left font-[family-name:var(--d)] font-bold text-[17px] sm:text-[18px] flex items-center justify-between gap-4 select-none cursor-pointer group"
                  >
                    <span className="text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors leading-snug">
                      {item.pergunta}
                    </span>
                    <span 
                      className={`text-[var(--blue)] text-[24px] font-semibold leading-none transition-transform duration-300 inline-block select-none flex-none ${
                        isOpen ? 'rotate-45' : 'rotate-0'
                      }`}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>

                  <div 
                    className="grid transition-all duration-300 ease-in-out"
                    style={{
                      gridTemplateRows: isOpen ? '1fr' : '0fr',
                      opacity: isOpen ? 1 : 0
                    }}
                  >
                    <div className="overflow-hidden">
                      <p className="mt-3 text-[var(--muted)] text-[15px] sm:text-[15.5px] max-w-[68ch] leading-relaxed">
                        {item.resposta}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Contato & Formulário */}
      <section id="contato" className="py-14 border-t border-[var(--line)] bg-[var(--paper)] relative z-10">
        <div className="max-w-[1120px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          <div>
            <h2 className="text-[28px] sm:text-[38px] font-extrabold tracking-tight mb-3">
              Conte o que precisa inspecionar
            </h2>
            <p className="text-[var(--muted)] text-[16.5px] max-w-[42ch] leading-relaxed">
              Informe o equipamento e a cidade. A proposta volta em horário comercial.
            </p>

            <div className="mt-7 space-y-3 font-semibold text-[15.5px]">
              <div>
                <a
                  href="https://wa.me/5581984442592"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--blue)] flex items-center gap-2"
                >
                  WhatsApp: (81) 98444-2592
                </a>
              </div>
              <div>
                <a
                  href="mailto:atendimento@vlengenhariamecanica.com.br"
                  className="hover:text-[var(--blue)] flex items-center gap-2"
                >
                  atendimento@vlengenhariamecanica.com.br
                </a>
              </div>
              <div>
                <a
                  href="https://instagram.com/vlengenhariamec"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--blue)] flex items-center gap-2"
                >
                  @vlengenhariamec
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <form 
            onSubmit={handleSendContact}
            className="bg-[var(--card)] border-[1.5px] border-[var(--line)] rounded-xl p-6 sm:p-7 space-y-4"
          >
            <label className="block text-[14.5px] font-semibold">
              <span className="mb-1 block">Seu nome</span>
              <input
                type="text"
                value={formNome}
                onChange={(e) => setFormNome(e.target.value)}
                required
                placeholder="João da Silva"
                className="w-full font-[family-name:var(--b)] text-[15.5px] p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
              />
            </label>

            <label className="block text-[14.5px] font-semibold">
              <span className="mb-1 block">Serviço</span>
              <select
                value={formServico}
                onChange={(e) => setFormServico(e.target.value)}
                className="w-full font-[family-name:var(--b)] text-[15.5px] p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
              >
                {SERVICOS_LISTA.map((s, idx) => (
                  <option key={idx} value={s.nome}>{s.nome}</option>
                ))}
              </select>
            </label>

            <label className="block text-[14.5px] font-semibold">
              <span className="mb-1 block">Equipamento e cidade</span>
              <textarea
                value={formMensagem}
                onChange={(e) => setFormMensagem(e.target.value)}
                rows={3}
                required
                placeholder="Ex: Munck 12 t, Jaboatão dos Guararapes"
                className="w-full font-[family-name:var(--b)] text-[15.5px] p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
              />
            </label>

            <button
              type="submit"
              className="btn-tech wa w-full justify-center text-[15.5px] py-3 mt-2"
            >
              Enviar pelo WhatsApp
            </button>
          </form>

        </div>
      </section>

    </div>
  );
};
