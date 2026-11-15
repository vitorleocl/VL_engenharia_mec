import { ChecklistModeloServico } from '../types';

type ItemBase = {
  id: string;
  texto: string;
  norma: string;
  secao: string;
  metodo: NonNullable<ChecklistModeloServico['itens'][number]['metodoVerificacao']>;
  criticidade?: NonNullable<ChecklistModeloServico['itens'][number]['criticidade']>;
  impeditivo?: boolean;
  tipoResposta?: ChecklistModeloServico['itens'][number]['tipoResposta'];
  unidade?: string;
};

function modelo(
  id: string,
  nome: string,
  subtitulo: string,
  norma: string,
  itensBase: ItemBase[]
): ChecklistModeloServico {
  const secoes = [...new Set(itensBase.map((item) => item.secao))];
  return {
    id,
    nome,
    subtitulo,
    norma,
    secoesLaudoPadrao: secoes,
    itens: itensBase.map((item, index) => ({
      id: `${id}-${index + 1}`,
      numero: `${Math.floor(index / 3) + 1}.${(index % 3) + 1}`,
      texto: `${item.texto} (verificação: ${item.metodo}; aceitar conforme projeto aprovado, manual do fabricante e edição vigente da norma aplicável)`,
      norma: item.norma,
      secaoLaudo: item.secao,
      tipoResposta: item.tipoResposta || 'conformidade',
      unidade: item.unidade,
      metodoVerificacao: item.metodo,
      criticidade: item.criticidade || 'media',
      impeditivo: item.impeditivo || false,
    })),
  };
}

// Catálogo de partida para vistorias. Limites/tolerâncias dependentes do projeto,
// fabricante ou legislação local devem ser registrados na evidência da inspeção.
export const CHECKLIST_MODELOS_COMPLEMENTARES: ChecklistModeloServico[] = [
  modelo('linha-amarela', 'Máquinas Pesadas / Linha Amarela', 'Escavadeiras, pás-carregadeiras, tratores e motoniveladoras', 'NR-11; NR-12; NR-18 quando aplicável; ABNT NBR ISO 3471; ISO 3449', [
    { id: 'id', texto: 'Identificação do equipamento, número de série, ano, capacidade e documentação de manutenção rastreáveis', norma: 'NR-12; NR-11', secao: 'Identificação e documentação', metodo: 'documental' },
    { id: 'estrutura', texto: 'Chassi, lança, braço, caçamba, articulações, pinos e soldas sem trincas, deformações ou reparos não rastreáveis; registrar folgas e dimensões críticas', norma: 'NR-12; manual do fabricante', secao: 'Estrutura e implementos', metodo: 'visual', criticidade: 'alta' },
    { id: 'hidraulico', texto: 'Cilindros, conexões e mangueiras sem vazamentos, abrasão, bolhas ou interferência; inspecionar sob procedimento seguro', norma: 'NR-12; manual do fabricante', secao: 'Sistema hidráulico', metodo: 'visual', criticidade: 'alta' },
    { id: 'rodagem', texto: 'Freios, direção, pneus/esteiras, roletes e comandos operacionais sem falhas; comparar ajustes e desgaste com limites do fabricante', norma: 'NR-12; manual do fabricante', secao: 'Rodagem, direção e freios', metodo: 'funcional', criticidade: 'critica', impeditivo: true },
    { id: 'rops', texto: 'Cabine/estrutura ROPS e proteção FOPS identificadas, sem alterações, trincas ou danos; conformidade e aplicação confirmadas por documentação do fabricante', norma: 'ABNT NBR ISO 3471; ISO 3449', secao: 'Cabine e proteções', metodo: 'documental', criticidade: 'critica', impeditivo: true },
    { id: 'seguranca', texto: 'Alarme de ré, buzina, iluminação, acesso, cintos e dispositivos de retenção presentes e funcionais', norma: 'NR-12; NR-18 quando aplicável', secao: 'Dispositivos de segurança', metodo: 'funcional', criticidade: 'alta' },
  ]),
  modelo('munck-guindaste', 'Caminhões Munck, Guindastes e Içamento', 'Inspeção mecânica, acessórios, estabilização e ensaios conforme procedimento aprovado', 'NR-11; NR-12; ABNT NBR 14768; ABNT NBR 8400; ABNT NBR 16463', [
    { id: 'identificacao', texto: 'Placa, identificação, capacidade e tabela de carga legíveis e coerentes com configuração e acessórios instalados', norma: 'NR-11; ABNT NBR 14768; manual do fabricante', secao: 'Identificação e tabela de carga', metodo: 'documental', criticidade: 'critica', impeditivo: true },
    { id: 'estrutura', texto: 'Base, subchassi, lança, extensões, pinos e soldas sem trincas ou deformações; registrar folgas e danos', norma: 'ABNT NBR 14768; ABNT NBR 8400', secao: 'Estrutura e lança', metodo: 'visual', criticidade: 'alta' },
    { id: 'estabilizadores', texto: 'Sapatas, vigas e travas operacionais, apoiadas conforme configuração de trabalho e instruções do fabricante', norma: 'NR-11; ABNT NBR 14768', secao: 'Estabilização', metodo: 'funcional', criticidade: 'critica', impeditivo: true },
    { id: 'cabos', texto: 'Cabos, terminais, polias, moitões e ganchos sem danos/rejeições segundo critérios do fabricante e norma aplicável; trava do gancho funcional', norma: 'ABNT NBR 8400; ISO 4309 quando aplicável; manual do fabricante', secao: 'Acessórios de içamento', metodo: 'visual', criticidade: 'critica', impeditivo: true },
    { id: 'hidraulica', texto: 'Cilindros, válvulas de retenção/sustentação e circuito sem vazamentos ou descida não comandada', norma: 'NR-12; ABNT NBR 14768; manual do fabricante', secao: 'Sistema hidráulico', metodo: 'funcional', criticidade: 'critica', impeditivo: true },
    { id: 'limitadores', texto: 'Limitadores, indicador de momento, fim de curso e emergência funcionais; capacidade/ajustes compatíveis com configuração', norma: 'NR-12; ABNT NBR 14768; manual do fabricante', secao: 'Comandos e limitadores', metodo: 'funcional', criticidade: 'critica', impeditivo: true },
    { id: 'teste', texto: 'Ensaio de carga somente com plano, massas rastreáveis, área isolada e procedimento aprovado; registrar carga, configuração, pressão e deflexão', norma: 'ABNT NBR 8400; ABNT NBR 14768; procedimento aprovado', secao: 'Ensaio de carga', metodo: 'instrumental', criticidade: 'alta' },
  ]),
  modelo('vasos-compressores', 'Vasos de Pressão e Compressores', 'Enquadramento, inspeção de integridade e documentação NR-13', 'NR-13 vigente; ASME Section VIII quando aplicável; requisitos de calibração RBC/INMETRO', [
    { id: 'enquadramento', texto: 'Confirmar fluido, pressão máxima de operação, volume, produto P×V, categoria e enquadramento conforme texto vigente da NR-13', norma: 'NR-13 — enquadramento e classificação aplicáveis', secao: 'Enquadramento e identificação', metodo: 'documental', criticidade: 'alta' },
    { id: 'prontuario', texto: 'Prontuário, registro de segurança, relatórios anteriores, projeto e placa disponíveis e coerentes; registrar ausência ou divergência', norma: 'NR-13 — documentação aplicável ao equipamento', secao: 'Documentação', metodo: 'documental', criticidade: 'alta' },
    { id: 'integridade', texto: 'Costado, tampos, bocais e suportes sem vazamentos, deformações ou corrosão relevante; medir espessuras e comparar com cálculo/projeto e histórico', norma: 'NR-13; código de construção aplicável', secao: 'Integridade e END', metodo: 'end', criticidade: 'alta' },
    { id: 'psv', texto: 'Dispositivo de segurança dimensionado/ajustado conforme PMTA, íntegro e com evidência de calibração rastreável; verificar descarga segura e lacre quando aplicável', norma: 'NR-13 — requisitos do dispositivo de segurança', secao: 'Dispositivos de segurança', metodo: 'documental', criticidade: 'critica', impeditivo: true },
    { id: 'instrumentos', texto: 'Manômetro legível, adequado à faixa e com calibração rastreável conforme procedimento da inspeção', norma: 'NR-13; procedimento metrológico aplicável', secao: 'Instrumentação', metodo: 'instrumental', criticidade: 'alta' },
    { id: 'exame', texto: 'Exames externo/interno, END e teste de pressão somente conforme plano e procedimento definidos pelo profissional habilitado; registrar limitações e resultados', norma: 'NR-13 — inspeção de segurança aplicável; código de construção', secao: 'Exames e testes', metodo: 'end', criticidade: 'alta' },
  ]),
  modelo('caldeiras', 'Caldeiras a Vapor', 'Inspeção de integridade, controles, proteções e prontuário', 'NR-13 vigente; ASME Boiler and Pressure Vessel Code quando aplicável', [
    { id: 'doc', texto: 'Prontuário, registro de segurança, relatórios, placa, categoria e documentação do operador aplicável disponíveis e consistentes', norma: 'NR-13 — documentação e operação aplicáveis', secao: 'Documentação e operação', metodo: 'documental', criticidade: 'alta' },
    { id: 'pressao', texto: 'Manômetros e dispositivos de segurança identificados, íntegros e com evidências de ensaio/calibração conforme procedimento e requisitos vigentes', norma: 'NR-13 — dispositivos de segurança aplicáveis', secao: 'Pressão e segurança', metodo: 'documental', criticidade: 'critica', impeditivo: true },
    { id: 'nivel', texto: 'Indicação/controle de nível, alarmes e intertravamentos testados conforme procedimento do fabricante sem expor operador a risco', norma: 'NR-13; manual do fabricante', secao: 'Nível e intertravamentos', metodo: 'funcional', criticidade: 'critica', impeditivo: true },
    { id: 'combustao', texto: 'Sistema de combustível, purga, chama e bloqueios sem vazamentos e com sequência segura de partida/parada', norma: 'NR-13; manual do fabricante; projeto aprovado', secao: 'Combustão e bloqueios', metodo: 'funcional', criticidade: 'critica', impeditivo: true },
    { id: 'integridade', texto: 'Fornalha, espelhos, tubos, coletores, refratário e suportes sem sinais de vazamento, superaquecimento, trincas ou deterioração; END conforme plano', norma: 'NR-13; código de construção aplicável', secao: 'Integridade e END', metodo: 'visual', criticidade: 'alta' },
    { id: 'purga', texto: 'Válvulas de descarga/purga, drenos e linhas sem obstrução ou vazamento; confirmar operação por procedimento', norma: 'NR-13; projeto e manual do fabricante', secao: 'Descargas e purgas', metodo: 'funcional', criticidade: 'alta' },
  ]),
  modelo('tubulacoes-tanques', 'Tubulações e Tanques Metálicos', 'Integridade, suportação, corrosão e contenção', 'NR-13 quando aplicável; ASME B31.3; API 653; ABNT NBR 17505', [
    { id: 'escopo', texto: 'Delimitar equipamentos, fluido, classe, pressão/temperatura de projeto, limites de inspeção e isométricos/fluxogramas disponíveis', norma: 'NR-13 quando aplicável; ASME B31.3; projeto aprovado', secao: 'Cadastro e classificação', metodo: 'documental', criticidade: 'alta' },
    { id: 'tubulacao', texto: 'Inspecionar corrosão, vazamentos, deformações, juntas, flanges e conexões; mapear espessuras por pontos representativos e comparar com critérios de engenharia', norma: 'NR-13 quando aplicável; ASME B31.3', secao: 'Tubulações e END', metodo: 'end', criticidade: 'alta' },
    { id: 'suportes', texto: 'Suportes, ancoragens, guias e juntas de expansão sem trincas, deslocamento, sobrecarga ou restrição indevida de movimento', norma: 'ASME B31.3; projeto aprovado', secao: 'Suportes e flexibilidade', metodo: 'visual', criticidade: 'alta' },
    { id: 'isolamento', texto: 'Inspecionar pontos de entrada de água sob isolamento, barreiras e revestimentos; registrar suspeita de corrosão sob isolamento para investigação', norma: 'ASME B31.3; plano de inspeção', secao: 'Isolamento e corrosão', metodo: 'visual', criticidade: 'media' },
    { id: 'tanque', texto: 'Costado, teto, fundo acessível, soldas, bocais e escadas sem vazamento/deformação; inspeções internas conforme plano e código aplicável', norma: 'API 653; ABNT NBR 17505 quando aplicável', secao: 'Tanque e acessórios', metodo: 'visual', criticidade: 'alta' },
    { id: 'contenção', texto: 'Bacia de contenção, drenagem controlada, respiros e acessos coerentes com projeto aprovado e requisitos locais', norma: 'ABNT NBR 17505; projeto aprovado; IT estadual vigente', secao: 'Contenção e respiros', metodo: 'visual', criticidade: 'alta' },
  ]),
  modelo('redes-gas', 'Centrais e Redes de Gás Combustível', 'GLP/GN: central, tubulação, regulagem, estanqueidade e sinalização', 'ABNT NBR 15514; ABNT NBR 13523; ABNT NBR 15526; ABNT NBR 13419; NR-26', [
    { id: 'central', texto: 'Central/abrigo, ventilação, proteção contra impacto, acesso e afastamentos conforme projeto aprovado, norma aplicável e regra estadual vigente', norma: 'ABNT NBR 15514; ABNT NBR 13523; IT estadual vigente', secao: 'Central e armazenamento', metodo: 'dimensional', criticidade: 'alta' },
    { id: 'recipientes', texto: 'Recipientes identificados, posicionados e protegidos; conferir validade/condição de requalificação e compatibilidade com instalação', norma: 'ABNT NBR 13523; regulamentação aplicável; fabricante', secao: 'Recipientes e acessórios', metodo: 'documental', criticidade: 'alta' },
    { id: 'reguladores', texto: 'Reguladores, válvulas e mangueiras compatíveis com gás/pressão, íntegros e dentro da validade indicada/requisito aplicável', norma: 'ABNT NBR 15526; ABNT NBR 13523; fabricante', secao: 'Regulação e válvulas', metodo: 'visual', criticidade: 'alta' },
    { id: 'tubulacao', texto: 'Material, identificação, suportação, proteção anticorrosiva, travessias e conexões compatíveis com projeto e classe de pressão', norma: 'ABNT NBR 15526; ABNT NBR 13419; projeto aprovado', secao: 'Rede de distribuição', metodo: 'visual', criticidade: 'alta' },
    { id: 'estanqueidade', texto: 'Ensaio de estanqueidade por procedimento apropriado, gás de teste e pressão definidos pela norma/projeto vigente; registrar pressão, duração, instrumento e resultado', norma: 'ABNT NBR 15526; ABNT NBR 13419; procedimento aprovado', secao: 'Ensaio de estanqueidade', metodo: 'instrumental', criticidade: 'critica', impeditivo: true },
    { id: 'leak', texto: 'Verificar vazamentos com método compatível (solução detectora/detector apropriado); qualquer vazamento confirmado exige interrupção segura e correção antes da liberação', norma: 'ABNT NBR 15526; NR-26; procedimento de emergência', secao: 'Detecção e sinalização', metodo: 'funcional', criticidade: 'critica', impeditivo: true },
  ]),
  modelo('incendio-hidromecanico', 'Sistemas Hidromecânicos de Combate a Incêndio', 'Hidrantes, bombas, sprinklers e pressurização', 'IT do Corpo de Bombeiros estadual; ABNT NBR aplicáveis ao sistema; projeto aprovado', [
    { id: 'projeto', texto: 'Identificar ocupação, projeto aprovado, RTI, pontos de teste e critérios de desempenho; validar a IT estadual vigente', norma: 'IT estadual vigente; projeto aprovado', secao: 'Projeto e documentação', metodo: 'documental', criticidade: 'alta' },
    { id: 'bombas', texto: 'Bombas principal e jockey, alimentação, válvulas, partida automática/manual e alarmes testados; comparar pressão/vazão com curva e projeto', norma: 'ABNT NBR aplicável; projeto aprovado; fabricante', secao: 'Casa de bombas', metodo: 'funcional', criticidade: 'critica', impeditivo: true },
    { id: 'hidrantes', texto: 'Abrigos, válvulas, mangueiras, esguichos e sinalização acessíveis e compatíveis; registrar condição, identificação e validade aplicável', norma: 'ABNT NBR 13714; IT estadual vigente', secao: 'Hidrantes e mangotinhos', metodo: 'visual', criticidade: 'alta' },
    { id: 'vazao', texto: 'Medir vazão e pressão nos pontos de referência com instrumentos adequados; aceitar conforme projeto aprovado e critérios da IT estadual', norma: 'ABNT NBR 13714; IT estadual vigente; projeto aprovado', secao: 'Vazão e pressão', metodo: 'instrumental', criticidade: 'alta' },
    { id: 'sprinklers', texto: 'Inspecionar sprinklers, válvulas de governo, alarmes, suportes, obstruções e danos; ensaio conforme plano e norma aplicável', norma: 'ABNT NBR 10897; projeto aprovado', secao: 'Sprinklers', metodo: 'visual', criticidade: 'alta' },
    { id: 'pressurizacao', texto: 'Ventiladores, dutos, alimentação, pressostatos, comandos e portas testados conforme sequência e parâmetros do projeto', norma: 'ABNT NBR 14880; IT estadual vigente; projeto aprovado', secao: 'Pressurização de escadas', metodo: 'funcional', criticidade: 'critica', impeditivo: true },
  ]),
  modelo('pcm-utilidades', 'PCM, Manutenção e Utilidades', 'Gestão de ativos, indicadores e sistemas auxiliares', 'Lei 6.496/1977; resoluções CONFEA aplicáveis; ABNT NBR ISO 55001; NR-10 quando aplicável', [
    { id: 'art', texto: 'Verificar ART compatível com atividade/atribuições e responsável técnico; conferir escopo, vigência e vínculo aplicável', norma: 'Lei 6.496/1977; resoluções CONFEA/CREA vigentes', secao: 'Responsabilidade técnica', metodo: 'documental', criticidade: 'alta' },
    { id: 'inventario', texto: 'Inventário de ativos com TAG, fabricante, modelo, série, criticidade, localização e documentação técnica rastreáveis', norma: 'ABNT NBR ISO 55001; procedimento interno', secao: 'Cadastro e criticidade', metodo: 'documental' },
    { id: 'planos', texto: 'Planos preventivos/preditivos com tarefa, frequência justificada, recurso, responsável e histórico; comparar execução e pendências críticas', norma: 'ABNT NBR ISO 55001; procedimento interno', secao: 'Planos de manutenção', metodo: 'documental', criticidade: 'media' },
    { id: 'indicadores', texto: 'Definições e dados-base de MTBF, MTTR, disponibilidade e backlog rastreáveis; validar período, fórmula e fonte antes da interpretação', norma: 'ABNT NBR ISO 55001; metodologia interna aprovada', secao: 'Indicadores e desempenho', metodo: 'documental' },
    { id: 'gerador', texto: 'Gerador: partida, transferência, proteções, vazamentos, bateria, combustível e testes sob carga conforme plano e fabricante', norma: 'NR-10 quando aplicável; manual do fabricante; projeto', secao: 'Geradores e utilidades', metodo: 'funcional', criticidade: 'alta' },
    { id: 'bloqueio', texto: 'Atividades de manutenção com fontes perigosas identificadas, isolamento, bloqueio e verificação de energia zero conforme procedimento seguro', norma: 'NR-10 quando aplicável; NR-12 quando aplicável; procedimento LOTO', secao: 'Segurança da manutenção', metodo: 'funcional', criticidade: 'critica', impeditivo: true },
  ]),
];
