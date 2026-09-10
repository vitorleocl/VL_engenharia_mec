import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  HelpCircle, 
  Search, 
  ShieldCheck, 
  Phone, 
  ExternalLink,
  BookOpen,
  FileCheck2,
  Wind,
  Wrench,
  Car
} from 'lucide-react';

interface FaqItem {
  id: string;
  categoria: 'art' | 'pmoc' | 'maquinas' | 'detran' | 'geral';
  pergunta: string;
  resposta: string;
  destaques?: string[];
  referenciaNormativa: string;
}

const FAQ_DADOS: FaqItem[] = [
  {
    id: 'art-prazo',
    categoria: 'art',
    pergunta: 'Qual o prazo para emissão da ART registrada no CREA-PE?',
    resposta: 'O registro e emissão da ART (Anotação de Responsabilidade Técnica) ocorre em até 24 a 48 horas úteis após a conclusão da vistoria técnica presencial e coleta de dados em campo. Para situações emergenciais (como notificações com prazo fiscal do Ministério do Trabalho ou iminência de embargo de obras), disponibilizamos plantão prioritário com emissão expressa no mesmo dia útil.',
    destaques: [
      'Emissão padrão em 24h a 48h úteis após a vistoria',
      'Plantão de urgência para notificações e fiscalizações ativas',
      'Autenticação digital instantânea com QR Code e chave do CREA-PE'
    ],
    referenciaNormativa: 'Lei Federal nº 6.496/1977 • Resoluções CONFEA / CREA-PE'
  },
  {
    id: 'pmoc-penalidades',
    categoria: 'pmoc',
    pergunta: 'Quais as penalidades da ANVISA caso o condomínio ou empresa não tenha PMOC?',
    resposta: 'Pela Lei Federal nº 13.589/2018 e pela Lei nº 6.437/1977, a ausência de PMOC (Plano de Manutenção, Operação e Controle) e de responsável técnico habilitado é considerada infração sanitária gravíssima. As penalidades financeiras variam de R$ 2.000,00 a R$ 1.500.000,00, aplicadas pela Vigilância Sanitária Municipal ou Estadual, além da possibilidade de interdição do estabelecimento e responsabilização civil e penal do gestor ou síndico por problemas respiratórios de frequentadores.',
    destaques: [
      'Multas pecuniárias de R$ 2.000 a R$ 1.500.000 aplicadas pela Vigilância Sanitária',
      'Risco de interdição total do imóvel ou sistema de climatização',
      'Responsabilização civil e penal do síndico/diretor por Síndrome do Edifício Doente'
    ],
    referenciaNormativa: 'Lei Federal 13.589/2018 • Portaria MS 3.523/1998 • Resolução ANVISA RE nº 9'
  },
  {
    id: 'detran-reclassificacao',
    categoria: 'detran',
    pergunta: 'Como funciona o processo de reclassificação de monta para desbloqueio de veículo no DETRAN?',
    resposta: 'Quando um veículo se envolve em um acidente de trânsito e a autoridade policial emite boletim de ocorrência com enquadramento de "Média Monta", o registro do veículo é administrativamente bloqueado no DETRAN. O proprietário tem o direito legal de contestar esse enquadramento através de perícia de engenharia mecânica. Realizamos uma rigorosa vistoria técnica avaliando os 31 componentes estruturais previstos no CONTRAN. Se as estruturas vitais (como longarinas e colunas) não sofreram danos irreversíveis, emitimos o Laudo Pericial de Reclassificação para "Pequena Monta" com ART e relatório fotográfico de alta resolução, permitindo o desbloqueio documental e preservando o valor de mercado do veículo.',
    destaques: [
      'Avaliação minuciosa dos 31 itens obrigatórios do CONTRAN',
      'Relatório fotográfico comprobatório e memória de cálculo estrutural',
      'Protocolo formal no DETRAN para desbloqueio e regularização documental'
    ],
    referenciaNormativa: 'Resoluções CONTRAN nº 810/2020 e nº 811/2020 • Código de Trânsito Brasileiro'
  },
  {
    id: 'maquinas-periodicidade',
    categoria: 'maquinas',
    pergunta: 'Qual a periodicidade obrigatória para renovação dos laudos de pontes rolantes, munck e guindastes?',
    resposta: 'Conforme preceitua a Norma Regulamentadora NR-11 e as normas técnicas ABNT NBR 14768 (Guindastes Articulados) e NBR 8400 (Equipamentos de Levantamento e Movimentação), as inspeções técnicas com ensaios não destrutivos, verificação de cilindros, válvulas de retenção e emissão de ART devem ser renovadas periodicamente a cada 12 meses (anualmente) para equipamentos em regime operacional normal. Em regimes de trabalho severo (como portos, pedreiras e usinas) ou após qualquer reparo estrutural em lanças e sobrechassis, a recomendação é de inspeção semestral.',
    destaques: [
      'Validade padrão recomendada de 12 meses (renovação anual)',
      'Inspeção semestral recomendada para regimes severos de içamento',
      'Obrigatoriedade de nova vistoria após reformas estruturais ou soldas em sobrechassi'
    ],
    referenciaNormativa: 'NR-11 • NBR 14768 • NBR 8400 • Manual dos Fabricantes'
  },
  {
    id: 'playground-sindico',
    categoria: 'geral',
    pergunta: 'Qual a responsabilidade legal do síndico em relação aos playgrounds e áreas infantis?',
    resposta: 'Segundo o Art. 1.348 do Código Civil Brasileiro e a ABNT NBR 16071, o síndico responde pessoalmente (civil e criminalmente) por acidentes que ocorram dentro das dependências do condomínio decorrentes de negligência, falta de manutenção ou ausência de laudo técnico periódico. A realização do laudo de engenharia mecânica identifica riscos invisíveis (como aprisionamento de cabeça, pescoço e dedos com gabaritos normatizados) e transfere a responsabilidade técnica do estado de conservação para o Engenheiro Mecânico credenciado com ART.',
    destaques: [
      'Respaldo jurídico total para o síndico e conselho fiscal perante os condôminos',
      'Aplicação de gabaritos normatizados de aprisionamento de corpo e membros',
      'Cronograma prático de ações corretivas e preventivas'
    ],
    referenciaNormativa: 'ABNT NBR 16071 (Partes 1 a 7) • Art. 1.348 do Código Civil Brasileiro'
  },
  {
    id: 'validade-juridica',
    categoria: 'art',
    pergunta: 'Os laudos da VL Engenharia possuem validade jurídica plena para auditorias e seguradoras?',
    resposta: 'Sim, 100% de validade legal em todo o território nacional. Todos os laudos, vistorias e pareceres técnicos são elaborados e chancelados por Engenheiro Mecânico devidamente habilitado e ativo no CREA-PE. Cada serviço tem sua respectiva Anotação de Responsabilidade Técnica (ART) recolhida e registrada no sistema do CREA, contendo chave de validação pública e QR Code. São aceitos sem ressalvas por fiscais do Ministério do Trabalho, Vigilância Sanitária, Corpo de Bombeiros Militar, seguradoras e em processos periciais na Justiça do Trabalho e Cível.',
    destaques: [
      'Atestado oficial registrado no CREA-PE com chave de validação eletrônica',
      'Amplo respaldo para seguradoras, auditorias ISO e órgãos governamentais',
      'Suporte técnico contínuo para eventuais esclarecimentos a fiscais'
    ],
    referenciaNormativa: 'Lei nº 5.194/1966 • Lei nº 6.496/1977'
  },
  {
    id: 'nr12-escopo',
    categoria: 'maquinas',
    pergunta: 'O que está incluído na Adequação à NR-12 realizada pela VL Engenharia?',
    resposta: 'Atuamos no modelo Turnkey (solução completa ponta a ponta): 1) Inventário detalhado de máquinas; 2) Apreciação de Riscos quantitativa pela metodologia oficial HRN (Hazard Rating Number); 3) Elaboração de projetos mecânicos 2D/3D executivos em CAD; 4) Fabricação e montagem de proteções mecânicas físicas e barreiras intertravadas; 5) Emissão do laudo final de conformidade e ART registrada no CREA-PE.',
    destaques: [
      'Metodologia HRN oficial para cálculo do índice de risco',
      'Projetos mecânicos executivos em software CAD',
      'Fabricação física das proteções e entrega da máquina regularizada'
    ],
    referenciaNormativa: 'NR-12 • NBR ISO 12100 • NBR ISO 13849 • NBR 14153'
  },
  {
    id: 'orcamento-visita',
    categoria: 'geral',
    pergunta: 'Como solicitar um orçamento e como funciona a visita técnica da VL Engenharia?',
    resposta: 'O orçamento preliminar pode ser solicitado rapidamente via formulário do site ou diretamente pelo WhatsApp oficial (81 98444-2592). Para a grande maioria das demandas em Recife e Região Metropolitana, realizamos uma visita técnica inicial de alinhamento e levantamento de dados sem custos. Apresentamos uma proposta comercial transparente contendo escopo detalhado, cronograma de execução, entregáveis e condições de pagamento facilitadas para empresas e condomínios.',
    destaques: [
      'Atendimento e retorno de orçamento em até 2 horas úteis',
      'Visita técnica para levantamento sem compromisso na RMR',
      'Condições de pagamento adaptadas para condomínios e indústrias'
    ],
    referenciaNormativa: 'Atendimento Rápido em todo o Estado de Pernambuco'
  }
];

const CATEGORIAS = [
  { id: 'todas', label: 'Todas as Dúvidas', icon: HelpCircle },
  { id: 'art', label: 'ART & Legislação', icon: FileCheck2 },
  { id: 'pmoc', label: 'PMOC Sanitário', icon: Wind },
  { id: 'maquinas', label: 'NR-12 & Máquinas', icon: Wrench },
  { id: 'detran', label: 'Perícia & DETRAN', icon: Car },
];

export const FaqNormativo: React.FC = () => {
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('todas');
  const [itemAberto, setItemAberto] = useState<string | null>('art-prazo');

  const itensFiltrados = useMemo(() => {
    return FAQ_DADOS.filter(item => {
      const matchCategoria = categoriaAtiva === 'todas' || item.categoria === categoriaAtiva;
      const termo = busca.toLowerCase().trim();
      const matchBusca = !termo || 
        item.pergunta.toLowerCase().includes(termo) ||
        item.resposta.toLowerCase().includes(termo) ||
        item.referenciaNormativa.toLowerCase().includes(termo);
      return matchCategoria && matchBusca;
    });
  }, [busca, categoriaAtiva]);

  const toggleItem = (id: string) => {
    setItemAberto(prev => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 bg-slate-50/70 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1565D8] text-xs font-bold uppercase tracking-wider shadow-2xs">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Transparência & Conformidade Legal</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E3D] tracking-tight">
            Perguntas Frequentes (FAQ Normativo & Jurídico)
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Esclareça suas principais dúvidas sobre prazos de emissão de ART no CREA-PE, obrigações 
            sanitárias do PMOC, adequações à NR-12 e perícias veiculares.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Pesquisar dúvida por palavra-chave (ex.: prazo, multa, PMOC, DETRAN, NR-12)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1565D8]/20 focus:border-[#1565D8] transition-all"
            />
            {busca && (
              <button
                type="button"
                onClick={() => setBusca('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 sm:pb-0 mb-8 gap-2 no-scrollbar">
          <div className="inline-flex items-center p-1.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
            {CATEGORIAS.map(cat => {
              const IconComp = cat.icon;
              const isActive = categoriaAtiva === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoriaAtiva(cat.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-[#1565D8] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#0B1E3D] hover:bg-slate-100'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {itensFiltrados.length > 0 ? (
            itensFiltrados.map((faq, index) => {
              const isOpen = itemAberto === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen 
                      ? 'bg-white border-[#1565D8]/40 shadow-sm' 
                      : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none select-none group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-[#1565D8] border border-blue-100 uppercase tracking-tight">
                          {faq.referenciaNormativa.split('•')[0]}
                        </span>
                      </div>
                      <h3 className={`text-base sm:text-lg font-bold transition-colors leading-snug ${
                        isOpen ? 'text-[#1565D8]' : 'text-[#0B1E3D] group-hover:text-[#1565D8]'
                      }`}>
                        {faq.pergunta}
                      </h3>
                    </div>

                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'bg-[#1565D8] text-white rotate-180' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="px-5 pb-6 sm:px-6 pt-0 border-t border-slate-100/80 mt-1 space-y-4">
                          <p className="text-sm text-slate-600 leading-relaxed pt-3">
                            {faq.resposta}
                          </p>

                          {faq.destaques && faq.destaques.length > 0 && (
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Principais Pontos Normativos:
                              </span>
                              <div className="space-y-1.5">
                                {faq.destaques.map((item, dIdx) => (
                                  <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                                    <ShieldCheck className="w-3.5 h-3.5 text-[#1565D8] shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 border-t border-slate-100">
                            <span className="font-mono text-[11px] text-slate-400">
                              Base Legal: <strong>{faq.referenciaNormativa}</strong>
                            </span>

                            <a
                              href={`https://wa.me/5581984442592?text=Ol%C3%A1%2C%20gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%3A%20${encodeURIComponent(faq.pergunta)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 font-bold text-[#1565D8] hover:text-[#0b4fb8] transition-colors"
                            >
                              <span>Esclarecer com Engenheiro</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-12 p-6 rounded-2xl bg-white border border-slate-200 text-slate-500 space-y-3">
              <HelpCircle className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-[#0B1E3D]">Nenhuma pergunta encontrada com o termo pesquisado.</p>
              <p className="text-xs text-slate-400">Tente buscar por palavras mais gerais ou entre em contato diretamente com nossa equipe técnica.</p>
              <button
                type="button"
                onClick={() => { setBusca(''); setCategoriaAtiva('todas'); }}
                className="px-4 py-2 rounded-lg bg-blue-50 text-[#1565D8] text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
              >
                Ver todas as dúvidas
              </button>
            </div>
          )}
        </div>

        {/* Bottom CTA for unlisted questions */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#0B1E3D]">
              Não encontrou a resposta para a sua dúvida técnica?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Nosso Engenheiro Mecânico está à disposição para analisar o seu caso e emitir orientações normativas.
            </p>
          </div>

          <a
            href="https://wa.me/5581984442592?text=Ol%C3%A1%2C%20Eng.%20Vitor%20Leonardo!%20Tenho%20uma%20d%C3%BAvida%20espec%C3%ADfica%20e%20gostaria%20de%20orienta%C3%A7%C3%A3o%20t%C3%A9cnica."
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-[#1565D8] hover:bg-[#0b4fb8] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>Falar no WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
