import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  DraftingCompass,
  Truck,
  Tractor,
  Wind,
  ShieldCheck,
  Cog,
  Pause,
  Play,
  Phone,
  Layers
} from 'lucide-react';

// Service slides images
import imgNr12 from '../../assets/images/slide_nr12_projetos_1788998249591.jpg';
import imgMunck from '../../assets/images/slide_munck_guindaste_1788998260570.jpg';
import imgMaquinas from '../../assets/images/slide_maquinas_pesadas_1788998270208.jpg';
import imgPmoc from '../../assets/images/slide_pmoc_hvac_1788998279644.jpg';
import imgPlayground from '../../assets/images/slide_playground_laudo_1788998292265.jpg';

interface ServiceSlide {
  id: string;
  badge: string;
  norma: string;
  title: string;
  description: string;
  bullets: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
  whatsappMsg: string;
}

const slides: ServiceSlide[] = [
  {
    id: 'nr12',
    badge: 'Projetos & Execução',
    norma: 'NR-12 • NBR ISO 12100 • NBR ISO 13849',
    title: 'Projetos Mecânicos 2D/3D & NR-12',
    description:
      'Elaboração de projetos executivos em CAD, fabricação, montagem de proteções mecânicas e validação técnica completa com ART.',
    bullets: '● Vistorias em Todo PE • ART Registrada',
    image: imgNr12,
    icon: DraftingCompass,
    whatsappMsg:
      'Olá, Eng. Vitor Leonardo! Gostaria de um orçamento para Projetos Mecânicos 2D/3D e Adequação à NR-12 com fabricação e ART.'
  },
  {
    id: 'munck',
    badge: 'Içamento & Inspeção',
    norma: 'NR-11 • NBR 14768 • NBR 8400',
    title: 'Caminhões Munck & Guindastes',
    description:
      'Inspeção estrutural minuciosa, ensaio de estanqueidade e teste de carga estático/dinâmico com emissão de laudo técnico oficial.',
    bullets: '● Vistorias em Todo PE • ART Registrada',
    image: imgMunck,
    icon: Truck,
    whatsappMsg:
      'Olá, Eng. Vitor Leonardo! Preciso de um orçamento para Laudo Técnico e Inspeção de Caminhão Munck / Guindaste com ART.'
  },
  {
    id: 'maquinas',
    badge: 'Linha Amarela',
    norma: 'NR-12 • NR-18 • NR-11 • ABNT',
    title: 'Máquinas Pesadas & Terraplanagem',
    description:
      'Laudos de conformidade para escavadeiras, carregadeiras e tratores com inspeção de estruturas de proteção ROPS/FOPS e cálculo HRN.',
    bullets: '● Vistorias em Todo PE • ART Registrada',
    image: imgMaquinas,
    icon: Tractor,
    whatsappMsg:
      'Olá, Eng. Vitor Leonardo! Gostaria de solicitar laudo técnico para máquinas pesadas da linha amarela com ART.'
  },
  {
    id: 'pmoc',
    badge: 'Climatização Legal',
    norma: 'Lei Federal 13.589/2018 • RE 09/ANVISA',
    title: 'PMOC & Climatização Industrial',
    description:
      'Plano de Manutenção, Operação e Controle para sistemas de ar-condicionado e chillers, assegurando qualidade do ar e conformidade legal.',
    bullets: '● Vistorias em Todo PE • ART Registrada',
    image: imgPmoc,
    icon: Wind,
    whatsappMsg:
      'Olá, Eng. Vitor Leonardo! Preciso de orçamento para implantação de PMOC e laudo de climatização com ART.'
  },
  {
    id: 'playground',
    badge: 'Segurança Condominial',
    norma: 'NBR 16071-1 a 7 • ABNT',
    title: 'Laudos de Playground & Áreas de Lazer',
    description:
      'Inspeção mecânica de brinquedos em condomínios, escolas e clubes, avaliando ancoragens, soldas, correntes e amortecimento de impacto.',
    bullets: '● Vistorias em Todo PE • ART Registrada',
    image: imgPlayground,
    icon: ShieldCheck,
    whatsappMsg:
      'Olá, Eng. Vitor Leonardo! Gostaria de um orçamento para Laudo Técnico de Playground sob a NBR 16071 com ART.'
  }
];

export const HeroServicesSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto slide transition every 5 seconds
  useEffect(() => {
    if (!isPlaying) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlide = slides[currentIndex];
  const IconComponent = currentSlide.icon;

  return (
    <div
      id="hero-services-slider-container"
      className="relative w-full max-w-sm sm:max-w-md mx-auto"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Decorative Rotating Engineering Gears */}
      <div className="absolute -top-6 -right-6 w-28 h-28 pointer-events-none opacity-25 z-0 animate-[spin_24s_linear_infinite]">
        <Cog className="w-full h-full text-[#1565D8]" />
      </div>
      <div className="absolute top-24 -right-8 w-16 h-16 pointer-events-none opacity-20 z-0 animate-[spin_16s_linear_infinite_reverse]">
        <Cog className="w-full h-full text-slate-400" />
      </div>

      {/* Soft glow behind card */}
      <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[#0B1E3D]/15 via-[#1565D8]/20 to-transparent blur-xl"></div>

      {/* Main Card Container */}
      <div className="relative bg-slate-900 rounded-3xl p-3 shadow-2xl border border-slate-700/60 overflow-hidden">
        
        {/* Aspect Ratio Container for Slider */}
        <div className="relative aspect-4/5 rounded-2xl overflow-hidden bg-slate-950">
          
          {/* Images Stack with Smooth Opacity Cross-Fade */}
          {slides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-102 pointer-events-none'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center transform transition-transform duration-700"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                
                {/* Dynamic Gradient Overlay for contrast and readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/30"></div>
              </div>
            );
          })}

          {/* TOP FLOATING BAR: Service Tag + Slide Counter + Play/Pause */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
            {/* Service Category Badge */}
            <div className="px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-white text-[11px] font-bold flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-blue-300 font-semibold">{currentSlide.badge}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-mono text-[10px]">
                {currentIndex + 1}/{slides.length}
              </span>
            </div>

            {/* Controls: Prev / PlayPause / Next */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-white shadow-lg">
              <button
                id="btn-slider-prev"
                onClick={handlePrev}
                aria-label="Serviço anterior"
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-700/80 text-slate-300 hover:text-white transition-colors"
                title="Serviço anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                id="btn-slider-playpause"
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pausar slide' : 'Reproduzir slide'}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-700/80 text-blue-400 hover:text-blue-300 transition-colors"
                title={isPlaying ? 'Pausar transição automática' : 'Continuar transição automática'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              </button>

              <button
                id="btn-slider-next"
                onClick={handleNext}
                aria-label="Próximo serviço"
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-700/80 text-slate-300 hover:text-white transition-colors"
                title="Próximo serviço"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* BOTTOM TECHNICAL INFO PANEL (Matches user requested formatting) */}
          <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-xl bg-slate-900/92 backdrop-blur-md border border-slate-700/90 text-white space-y-2 shadow-2xl z-20 transition-all duration-300">
            
            {/* Header with Service Icon & Title */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 shrink-0">
                  <IconComponent className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                    {currentSlide.title}
                  </h4>
                  <p className="text-[10px] text-blue-300 font-mono">
                    {currentSlide.norma}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-[11px] text-slate-300 leading-snug">
              {currentSlide.description}
            </p>

            {/* Bottom Status & Quick Quote Link */}
            <div className="flex items-center justify-between pt-1.5 text-[10px] text-slate-400 border-t border-slate-800">
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-emerald-400 font-bold">● Vistorias em Todo PE</span>
                <span>• ART Registrada</span>
              </div>

              <a
                id={`btn-slider-quote-${currentSlide.id}`}
                href={`https://wa.me/5581984442592?text=${encodeURIComponent(currentSlide.whatsappMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 font-bold bg-emerald-950/60 hover:bg-emerald-900/80 px-2 py-1 rounded border border-emerald-600/40 transition-colors"
                title="Cotar este serviço no WhatsApp"
              >
                <Phone className="w-2.5 h-2.5" />
                <span>Cotar</span>
              </a>
            </div>

            {/* Slide Progress Dots */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {slides.map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  id={`btn-slider-dot-${dotIndex}`}
                  onClick={() => setCurrentIndex(dotIndex)}
                  aria-label={`Ir para o slide ${dotIndex + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    dotIndex === currentIndex
                      ? 'w-6 bg-blue-500'
                      : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
