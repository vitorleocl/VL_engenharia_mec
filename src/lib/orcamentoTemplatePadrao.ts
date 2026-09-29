import { Orcamento, OrcamentoSecao, Cliente, Ativo } from '../types';
import { QR_CODE_PIX_PADRAO_BASE64, CHAVE_PIX_FORMATADA_PADRAO, TITULAR_PIX_PADRAO } from './pixUtils';

export interface SecaoDefinicao {
  id: string;
  numero: number;
  titulo: string;
  subtitulo?: string;
}

export const HTML_CARDS_CATALOGO_SERVICOS = `<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px;" class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
  <div style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 1.5px solid #bfdbfe; border-radius: 12px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); position: relative;" class="p-3 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-blue-200 shadow-xs relative">
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
      <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background-color: #dbeafe; color: #1d4ed8; font-weight: 800; font-size: 11px; font-family: monospace;">12</span>
      <div>
        <strong style="color: #0b1e3d; font-size: 12px; font-weight: 900; display: block;">NR-12 • MÁQUINAS INDUSTRIAIS</strong>
        <span style="color: #2563eb; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Apreciação de Risco & Laudo</span>
      </div>
    </div>
    <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0;">
      Apreciação de riscos (HRN/SIL), inventário técnico, laudos periciais de conformidade mecânica de prensas, tornos, esteiras e células robotizadas.
    </p>
  </div>

  <div style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 1.5px solid #fde68a; border-radius: 12px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); position: relative;" class="p-3 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-amber-200 shadow-xs relative">
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
      <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background-color: #fef3c7; color: #92400e; font-weight: 800; font-size: 11px; font-family: monospace;">11</span>
      <div>
        <strong style="color: #0b1e3d; font-size: 12px; font-weight: 900; display: block;">NR-11 • CARGAS E ELEVAÇÃO</strong>
        <span style="color: #b45309; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Movimentação & Ensaios</span>
      </div>
    </div>
    <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0;">
      Inspeção e laudos de pontes rolantes, guindastes, empilhadeiras, pórticos, ensaios não destrutivos (END) e testes de tração em cabos e olhais.
    </p>
  </div>

  <div style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 1.5px solid #c7d2fe; border-radius: 12px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); position: relative;" class="p-3 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-indigo-200 shadow-xs relative">
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
      <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background-color: #e0e7ff; color: #4338ca; font-weight: 800; font-size: 11px; font-family: monospace;">13</span>
      <div>
        <strong style="color: #0b1e3d; font-size: 12px; font-weight: 900; display: block;">NR-13 • VASOS & CALDEIRAS</strong>
        <span style="color: #4f46e5; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Pressão & Prontuários</span>
      </div>
    </div>
    <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0;">
      Inspeção de compressores e vasos sob pressão, teste hidrostático, medição de espessura por ultrassom, calibração de PSV e reconstituição de prontuário.
    </p>
  </div>

  <div style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 1.5px solid #a7f3d0; border-radius: 12px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); position: relative;" class="p-3 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-emerald-200 shadow-xs relative">
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
      <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background-color: #d1fae5; color: #065f46; font-weight: 800; font-size: 11px; font-family: monospace;">AC</span>
      <div>
        <strong style="color: #0b1e3d; font-size: 12px; font-weight: 900; display: block;">PMOC • CLIMATIZAÇÃO</strong>
        <span style="color: #047857; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Lei 13.589/2018 & ANVISA</span>
      </div>
    </div>
    <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0;">
      Plano de Manutenção Operação e Controle para qualidade do ar interior, eficiência energética e total conformidade com a vigilância sanitária.
    </p>
  </div>

  <div style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 1.5px solid #fecdd3; border-radius: 12px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); position: relative;" class="p-3 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-rose-200 shadow-xs relative">
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
      <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background-color: #ffe4e6; color: #be123c; font-weight: 800; font-size: 11px; font-family: monospace;">PJ</span>
      <div>
        <strong style="color: #0b1e3d; font-size: 12px; font-weight: 900; display: block;">PERÍCIAS & ASSISTÊNCIA TÉCNICA</strong>
        <span style="color: #e11d48; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Engenharia Diagnóstica Legal</span>
      </div>
    </div>
    <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0;">
      Investigação pericial de acidentes mecânicos, vistorias cautelares de vizinhança industrial, elaboração de quesitos e laudos judiciais conclusivos.
    </p>
  </div>

  <div style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 1.5px solid #e9d5ff; border-radius: 12px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); position: relative;" class="p-3 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-purple-200 shadow-xs relative">
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
      <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background-color: #f3e8ff; color: #6b21a8; font-weight: 800; font-size: 11px; font-family: monospace;">ART</span>
      <div>
        <strong style="color: #0b1e3d; font-size: 12px; font-weight: 900; display: block;">PROJETOS & ADEQUAÇÕES</strong>
        <span style="color: #7e22ce; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Soluções Mecânicas Integradas</span>
      </div>
    </div>
    <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0;">
      Dimensionamento de proteções físicas, cálculo de estruturas metálicas, dispositivos mecânicos de segurança, linhas de vida e esteiras industriais com ART.
    </p>
  </div>
</div>`;

/**
 * Retorna o título em destaque do Laudo Proposto (ex: LAUDO DE PMOC, LAUDO DE NR-12, etc.)
 */
export function obterTituloLaudoProposta(orcamento: Partial<Orcamento>): string {
  const servico = (orcamento.servico || '').trim();
  const servicoUpper = servico.toUpperCase();
  
  if (servicoUpper.includes('PMOC')) {
    return 'LAUDO DE PMOC • PLANO DE MANUTENÇÃO, OPERAÇÃO E CONTROLE';
  }
  if (servicoUpper.includes('NR-12') || servicoUpper.includes('NR 12') || servicoUpper.includes('NR12')) {
    return 'LAUDO TÉCNICO DE CONFORMIDADE MECÂNICA • NR-12';
  }
  if (servicoUpper.includes('NR-13') || servicoUpper.includes('NR 13') || servicoUpper.includes('NR13') || servicoUpper.includes('VASO') || servicoUpper.includes('CALDEIRA')) {
    return 'LAUDO DE INSPEÇÃO DE SEGURANÇA E CONFORMIDADE • NR-13';
  }
  if (servicoUpper.includes('NR-11') || servicoUpper.includes('NR 11') || servicoUpper.includes('NR11') || servicoUpper.includes('MUNCK') || servicoUpper.includes('GUINDASTE') || servicoUpper.includes('EMPILHADEIRA')) {
    return 'LAUDO DE CONFORMIDADE E TESTE DE CARGA • NR-11';
  }
  if (servicoUpper.includes('PLAYGROUND') || servicoUpper.includes('BRINQUEDO')) {
    return 'LAUDO TÉCNICO DE SEGURANÇA DE PLAYGROUND • ABNT NBR 16071';
  }
  if (servicoUpper.includes('PERÍCIA') || servicoUpper.includes('PERICIA') || servicoUpper.includes('ASSISTÊNCIA') || servicoUpper.includes('ASSISTENCIA')) {
    return 'LAUDO PERICIAL DE ENGENHARIA MECÂNICA DIAGNÓSTICA';
  }
  if (servicoUpper.includes('ESTRUTURAL') || servicoUpper.includes('METÁLIC') || servicoUpper.includes('PROJETO')) {
    return 'LAUDO TÉCNICO ESTRUTURAL E MEMORIAL DE CÁLCULO';
  }
  if (servicoUpper.startsWith('LAUDO')) {
    return servicoUpper;
  }
  if (servico) {
    return `LAUDO TÉCNICO DE ENGENHARIA • ${servicoUpper}`;
  }
  return 'LAUDO TÉCNICO DE RESPONSABILIDADE & CONFORMIDADE MECÂNICA';
}

/**
 * Gera a caixinha/card executivo de identificação do cliente na Capa
 */
export function gerarCardClienteHtml(params: {
  clienteNome: string;
  cnpj: string;
  representante: string;
  localidade: string;
  codigo: string;
  validade: number | string;
  prazo: string;
}): string {
  return `<div class="space-y-4 text-xs">
    <p class="text-slate-700 text-xs sm:text-sm leading-relaxed">
      Prestação de serviços especializados em Engenharia Mecânica, diagnóstico de integridade estrutural, verificação de conformidade com as Normas Regulamentadoras federais (ABNT / Ministério do Trabalho) e emissão de Anotação de Responsabilidade Técnica (ART) oficial junto ao CREA-PE.
    </p>

    <div style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 1.5px solid #cbd5e1; border-radius: 14px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); overflow: hidden;" class="rounded-xl border border-slate-300 shadow-sm overflow-hidden">
      
      <div style="background: #0B1E3D; color: #ffffff; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #D4AF37;"></span>
          <strong style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 800;">
            DADOS DO CLIENTE CONTRATANTE & REFERÊNCIA
          </strong>
        </div>
        <span style="font-size: 10px; font-family: monospace; color: #93c5fd; font-weight: 700;">
          ${params.codigo}
        </span>
      </div>

      <div style="padding: 14px 16px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px;" class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 10px;">
          <span style="color: #64748b; font-size: 10px; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 2px;">Razão Social / Cliente:</span>
          <strong style="color: #0b1e3d; font-size: 12px; font-weight: 800; display: block; word-break: break-word;">${params.clienteNome}</strong>
        </div>

        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 10px;">
          <span style="color: #64748b; font-size: 10px; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 2px;">CNPJ / CPF:</span>
          <strong style="color: #0f172a; font-size: 12px; font-family: monospace; display: block;">${params.cnpj}</strong>
        </div>

        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 10px;">
          <span style="color: #64748b; font-size: 10px; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 2px;">Representante / Contato:</span>
          <strong style="color: #0f172a; font-size: 12px; display: block;">${params.representante}</strong>
        </div>

        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 10px;">
          <span style="color: #64748b; font-size: 10px; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 2px;">Localidade / Unidade:</span>
          <strong style="color: #0f172a; font-size: 12px; display: block;">${params.localidade}</strong>
        </div>
      </div>

      <div style="background: #f1f5f9; border-top: 1px solid #e2e8f0; padding: 10px 16px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; text-align: center; font-size: 11px;">
        <div>
          <span style="color: #64748b; font-size: 10px; display: block;">Código da Proposta</span>
          <strong style="color: #0b1e3d; font-family: monospace;">${params.codigo}</strong>
        </div>
        <div>
          <span style="color: #64748b; font-size: 10px; display: block;">Validade da Proposta</span>
          <strong style="color: #1e3a8a;">${params.validade} dias corridos</strong>
        </div>
        <div>
          <span style="color: #64748b; font-size: 10px; display: block;">Prazo de Conclusão</span>
          <strong style="color: #047857;">${params.prazo}</strong>
        </div>
      </div>

    </div>
  </div>`;
}

/**
 * Gera a visualização estilizada em cards para a Etapa 2 (Metodologia em 5 Fases)
 */
export function gerarHtmlEtapa2Metodologia(normas: string = 'ABNT NBR, NR-11, NR-12, NR-13'): string {
  return `<div class="space-y-3.5 text-xs">
    
    <div style="background: #0B1E3D; color: #ffffff; padding: 10px 14px; border-radius: 10px; display: flex; align-items: center; justify-content: space-between;" class="shadow-xs">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 6px; background: #1565D8; font-weight: 900; font-size: 11px;">M</span>
        <div>
          <strong style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; display: block;">Metodologia de Engenharia em 5 Fases Sequenciais</strong>
          <span style="font-size: 9px; color: #93c5fd;">Inspeção in loco, checklists normativos, instrumentação, laudo e homologação legal CREA-PE</span>
        </div>
      </div>
      <span style="background: rgba(212, 175, 55, 0.2); border: 1px solid #D4AF37; color: #fde047; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 800;">
        CREA-PE HABILITADO
      </span>
    </div>

    <div style="display: flex; flex-direction: column; gap: 9px;">
      
      <!-- Fase 1 -->
      <div style="background: #ffffff; border: 1.5px solid #bfdbfe; border-left: 5px solid #1d4ed8; border-radius: 10px; padding: 10px 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="background: #dbeafe; color: #1e40af; font-weight: 900; font-size: 10px; padding: 2px 8px; border-radius: 4px; font-family: monospace;">FASE 01</span>
            <strong style="color: #0b1e3d; font-size: 12px; font-weight: 800;">Inspeção Visual In Loco & Diagnóstico Preliminar</strong>
          </div>
          <span style="font-size: 10px; color: #1d4ed8; font-weight: 700; background: #eff6ff; padding: 2px 6px; border-radius: 4px;">Vistoria de Campo</span>
        </div>
        <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0 0 6px 0;">
          Vistoria presencial minuciosa do ativo para mapeamento visual de não-conformidades de segurança, desgastes mecânicos, corrosão, fixações e análise física do ambiente fabril/operacional.
        </p>
        <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: #0284c7; font-weight: 600;">
          <span>✓ Entregável:</span> <span style="color: #334155;">Levantamento fotográfico em alta resolução e registro de evidências fáticas.</span>
        </div>
      </div>

      <!-- Fase 2 -->
      <div style="background: #ffffff; border: 1.5px solid #fde68a; border-left: 5px solid #d97706; border-radius: 10px; padding: 10px 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="background: #fef3c7; color: #92400e; font-weight: 900; font-size: 10px; padding: 2px 8px; border-radius: 4px; font-family: monospace;">FASE 02</span>
            <strong style="color: #0b1e3d; font-size: 12px; font-weight: 800;">Aplicação de Checklists Normativos Técnicos</strong>
          </div>
          <span style="font-size: 10px; color: #b45309; font-weight: 700; background: #fffbeb; padding: 2px 6px; border-radius: 4px;">Conformidade Legal</span>
        </div>
        <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0 0 6px 0;">
          Auditoria item por item das exigências regulamentadoras vigentes (${normas}), analisando proteções mecânicas, distâncias de segurança (ABNT NBR ISO 13857/13855), enclausuramentos e intertravamentos elétricos.
        </p>
        <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: #b45309; font-weight: 600;">
          <span>✓ Entregável:</span> <span style="color: #334155;">Relatório de conformidade item a item conforme normas ABNT e NRs federais.</span>
        </div>
      </div>

      <!-- Fase 3 -->
      <div style="background: #ffffff; border: 1.5px solid #c7d2fe; border-left: 5px solid #4f46e5; border-radius: 10px; padding: 10px 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="background: #e0e7ff; color: #4338ca; font-weight: 900; font-size: 10px; padding: 2px 8px; border-radius: 4px; font-family: monospace;">FASE 03</span>
            <strong style="color: #0b1e3d; font-size: 12px; font-weight: 800;">Ensaios Físicos, Medições e Testes Funcionais</strong>
          </div>
          <span style="font-size: 10px; color: #4f46e5; font-weight: 700; background: #eef2ff; padding: 2px 6px; border-radius: 4px;">Instrumentado</span>
        </div>
        <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0 0 6px 0;">
          Ensaios não destrutivos cabíveis (ultrassom, líquidos penetrantes), testes funcionais de paradas de emergência, medição de espessura de chapas, verificação de folgas mecânicas e calibração de salvaguardas.
        </p>
        <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: #4f46e5; font-weight: 600;">
          <span>✓ Entregável:</span> <span style="color: #334155;">Planilha de grandezas medidas com instrumentos calibrados e rastreáveis RBC/Inmetro.</span>
        </div>
      </div>

      <!-- Fase 4 -->
      <div style="background: #ffffff; border: 1.5px solid #a7f3d0; border-left: 5px solid #059669; border-radius: 10px; padding: 10px 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="background: #d1fae5; color: #065f46; font-weight: 900; font-size: 10px; padding: 2px 8px; border-radius: 4px; font-family: monospace;">FASE 04</span>
            <strong style="color: #0b1e3d; font-size: 12px; font-weight: 800;">Dossiê Técnico, Matriz de Risco & Parecer Conclusivo</strong>
          </div>
          <span style="font-size: 10px; color: #059669; font-weight: 700; background: #ecfdf5; padding: 2px 6px; border-radius: 4px;">Engenharia Diagnóstica</span>
        </div>
        <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0 0 6px 0;">
          Elaboração de laudo pericial detalhado contendo análise de risco quantitativa (HRN/SIL), memorial técnico descritivo, plano de ação corretivo claro e cronograma prioritário de adequações físicas.
        </p>
        <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: #059669; font-weight: 600;">
          <span>✓ Entregável:</span> <span style="color: #334155;">Laudo Pericial Conclusivo digital em PDF com assinatura eletrônica e certificado digital.</span>
        </div>
      </div>

      <!-- Fase 5 -->
      <div style="background: #ffffff; border: 1.5px solid #e9d5ff; border-left: 5px solid #7c3aed; border-radius: 10px; padding: 10px 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="background: #f3e8ff; color: #6b21a8; font-weight: 900; font-size: 10px; padding: 2px 8px; border-radius: 4px; font-family: monospace;">FASE 05</span>
            <strong style="color: #0b1e3d; font-size: 12px; font-weight: 800;">Emissão e Registro Oficial da ART CREA-PE</strong>
          </div>
          <span style="font-size: 10px; color: #7c3aed; font-weight: 700; background: #faf5ff; padding: 2px 6px; border-radius: 4px;">Homologação Legal</span>
        </div>
        <p style="color: #475569; font-size: 11px; line-height: 1.45; margin: 0 0 6px 0;">
          Anotação de Responsabilidade Técnica emitida eletronicamente junto ao CREA-PE, conferindo fé pública, respaldo institucional e plena validade jurídica perante fiscalizações do Ministério do Trabalho, CBMPE e seguradoras.
        </p>
        <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: #7c3aed; font-weight: 600;">
          <span>✓ Entregável:</span> <span style="color: #334155;">Certidão oficial de ART quitada com chave de autenticidade e QR code do CREA-PE.</span>
        </div>
      </div>

    </div>

  </div>`;
}

/**
 * Gera a visualização estilizada da Etapa 3 (Prazo, Pagamento & Investimento)
 */
export function gerarHtmlEtapa3Investimento(params: {
  valor: string;
  prazo: string;
  condicoes: string;
  validade: number | string;
  clienteNome: string;
  representante: string;
  incluiNotaFiscal?: boolean;
  chavePix?: string;
}): string {
  const comNotaFiscal = params.incluiNotaFiscal !== false;
  const chavePixDisplay = params.chavePix || CHAVE_PIX_FORMATADA_PADRAO;

  return `<div class="space-y-4 text-xs">
    
    <!-- HERO CARD DO INVESTIMENTO COMERCIAL -->
    <div style="background: linear-gradient(135deg, #0B1E3D 0%, #1565D8 100%); color: #ffffff; border-radius: 14px; padding: 18px 20px; box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.15); position: relative; overflow: hidden;" class="text-white">
      <div style="position: absolute; right: -20px; bottom: -20px; width: 140px; height: 140px; border-radius: 50%; background: rgba(255, 255, 255, 0.05); pointer-events: none;"></div>

      <div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
        <span style="background: rgba(212, 175, 55, 0.25); border: 1.5px solid #D4AF37; color: #fef08a; padding: 3px 12px; border-radius: 20px; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 6px;">
          INVESTIMENTO COMERCIAL LÍQUIDO
        </span>
        
        <div style="font-size: 32px; line-height: 1.1; font-weight: 900; font-family: monospace; letter-spacing: -0.5px; color: #ffffff; margin: 6px 0;">
          ${params.valor}
        </div>

        <p style="color: #e2e8f0; font-size: 11px; max-width: 500px; margin: 0; line-height: 1.4;">
          ${comNotaFiscal 
            ? 'Valor líquido para prestação de serviços de engenharia com emissão de Nota Fiscal (NFS-e) e taxa de ART inclusa.'
            : 'Valor líquido para prestação de serviços técnicos de engenharia com Recibo de Prestação Autônoma e taxa de ART inclusa.'
          }
        </p>

        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 10px;">
          <span style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); padding: 3px 10px; border-radius: 6px; font-size: 10px; font-weight: 700;">
            ✓ Taxa ART CREA-PE Inclusa
          </span>
          <span style="background: ${comNotaFiscal ? 'rgba(34, 197, 94, 0.25)' : 'rgba(255, 255, 255, 0.15)'}; border: 1px solid ${comNotaFiscal ? '#86efac' : 'rgba(255,255,255,0.2)'}; padding: 3px 10px; border-radius: 6px; font-size: 10px; font-weight: 700; color: ${comNotaFiscal ? '#f0fdf4' : '#ffffff'};">
            ${comNotaFiscal ? '✓ Nota Fiscal de Serviços (NFS-e)' : '• Faturamento via Recibo (Sem NFS-e)'}
          </span>
          <span style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); padding: 3px 10px; border-radius: 6px; font-size: 10px; font-weight: 700;">
            ✓ Deslocamento e Relatório Colorido
          </span>
        </div>
      </div>
    </div>

    <!-- GRID COM 3 CARDS DE CONDIÇÕES (PRAZO, PAGAMENTO, VALIDADE) -->
    <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px;">
      
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-top: 4px solid #1565D8; border-radius: 10px; padding: 10px 12px; text-align: center;">
        <span style="color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 3px;">
          ⏱️ PRAZO DE EXECUÇÃO
        </span>
        <strong style="color: #0b1e3d; font-size: 13px; font-weight: 800; display: block; margin-bottom: 2px;">
          ${params.prazo}
        </strong>
        <span style="color: #64748b; font-size: 10px; line-height: 1.3; display: block;">
          Contados a partir da vistoria in loco.
        </span>
      </div>

      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-top: 4px solid #059669; border-radius: 10px; padding: 10px 12px; text-align: center;">
        <span style="color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 3px;">
          💳 CONDIÇÕES DE PAGAMENTO
        </span>
        <strong style="color: #065f46; font-size: 12px; font-weight: 800; display: block; margin-bottom: 2px;">
          ${params.condicoes}
        </strong>
        <span style="color: #64748b; font-size: 10px; line-height: 1.3; display: block;">
          PIX, transferência ou boleto bancário.
        </span>
      </div>

      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-top: 4px solid #d97706; border-radius: 10px; padding: 10px 12px; text-align: center;">
        <span style="color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 3px;">
          📅 VALIDADE DA PROPOSTA
        </span>
        <strong style="color: #92400e; font-size: 13px; font-weight: 800; display: block; margin-bottom: 2px;">
          ${params.validade} dias corridos
        </strong>
        <span style="color: #64748b; font-size: 10px; line-height: 1.3; display: block;">
          Garantia de valores e disponibilidade.
        </span>
      </div>

    </div>

    <!-- CAIXINHA DE FATURAMENTO & PIX COM QR CODE EMBEDDED -->
    <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; gap: 14px;">
      <div style="display: flex; align-items: center; gap: 14px; flex: 1;">
        <!-- QR CODE PIX -->
        <div style="background: #ffffff; padding: 4px; border: 1.5px solid #86efac; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.06); text-align: center; flex-shrink: 0;">
          <img src="${QR_CODE_PIX_PADRAO_BASE64}" alt="QR Code PIX CPF" style="width: 76px; height: 76px; display: block;" />
          <span style="font-size: 8px; color: #166534; font-weight: 800; display: block; margin-top: 2px; font-family: monospace;">QR CODE PIX</span>
        </div>

        <div style="font-size: 11px; line-height: 1.45;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
            <span style="background: #22c55e; color: #ffffff; width: 20px; height: 20px; border-radius: 5px; display: inline-flex; align-items: center; justify-content: center; font-weight: 900; font-size: 11px;">$</span>
            <strong style="color: #14532d; font-size: 11px; text-transform: uppercase;">DADOS PARA PAGAMENTO VIA PIX (QR CODE & CHAVE)</strong>
          </div>
          <p style="margin: 2px 0; color: #166534;">
            Chave PIX (CPF): <strong style="color: #0b1e3d; font-family: monospace; font-size: 12px; background: #dcfce7; padding: 1px 6px; border-radius: 4px; border: 1px solid #86efac;">${chavePixDisplay}</strong>
          </p>
          <p style="margin: 2px 0; color: #334155; font-size: 10px;">
            Titular: <strong>${TITULAR_PIX_PADRAO}</strong> • CREA-PE 182229949-0
          </p>
          <p style="margin: 2px 0; color: #64748b; font-size: 9.5px;">
            Aponte a câmera do aplicativo do seu banco para o QR Code acima para efetuar o pagamento.
          </p>
        </div>
      </div>

      <div style="text-align: right; flex-shrink: 0;">
        <span style="background: #dcfce7; color: #15803d; border: 1px solid #86efac; padding: 4px 10px; border-radius: 8px; font-size: 10px; font-weight: 800; display: inline-block;">
          PIX IMEDIATO
        </span>
      </div>
    </div>

    <!-- BLOCO DE HOMOLOGAÇÃO & ASSINATURAS -->
    <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; padding-top: 12px; border-top: 1px solid #cbd5e1;">
      
      <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 14px 12px; text-align: center;">
        <div style="border-bottom: 1.5px solid #94a3b8; width: 75%; margin: 16px auto 10px auto;"></div>
        <p style="color: #0b1e3d; font-weight: 800; font-size: 11px; margin: 0 0 3px 0; text-transform: uppercase;">VL ENGENHARIA MECÂNICA</p>
        <p style="color: #1565d8; font-weight: 700; font-size: 10.5px; margin: 0 0 2px 0;">Eng. Vitor Leonardo Cordeiro Linhares</p>
        <p style="color: #64748b; font-size: 9px; font-family: monospace; margin: 0;">CREA-PE: 182229949-0 • Responsável Técnico</p>
      </div>

      <div style="background: #ffffff; border: 1.5px dashed #cbd5e1; border-radius: 10px; padding: 14px 12px; text-align: center;">
        <div style="border-bottom: 1.5px dashed #94a3b8; width: 75%; margin: 16px auto 10px auto;"></div>
        <p style="color: #0b1e3d; font-weight: 800; font-size: 11px; margin: 0 0 3px 0; text-transform: uppercase;">${params.clienteNome.toUpperCase()}</p>
        <p style="color: #475569; font-weight: 600; font-size: 10.5px; margin: 0 0 2px 0;">${params.representante}</p>
        <p style="color: #64748b; font-size: 9px; margin: 0;">De Acordo / Representante Autorizado do Contratante</p>
      </div>

    </div>

  </div>`;
}

/**
 * Gera a visualização estilizada da seção 13 (Agradecimento & Contato)
 */
export function gerarHtmlContatoAgradecimento(): string {
  return `<div class="space-y-4 text-xs font-sans">
    
    <!-- HEADER HERO EXECUTIVO -->
    <div style="background: linear-gradient(135deg, #0B1E3D 0%, #15325B 60%, #1E4273 100%); border: 1px solid #1e3a8a; border-radius: 14px; padding: 22px 20px; text-align: center; color: #ffffff; box-shadow: 0 4px 14px rgba(11, 30, 61, 0.15); position: relative; overflow: hidden;">
      <div style="display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 12px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); margin-bottom: 10px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      <h3 style="color: #ffffff; font-size: 15px; font-weight: 900; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.8px;">
        Agradecimento & Parceria Técnica de Confiança
      </h3>
      <p style="color: #93c5fd; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">
        VL ENGENHARIA MECÂNICA & PERÍCIAS TÉCNICAS INDUSTRIAIS
      </p>
      <p style="color: #e2e8f0; font-size: 11px; line-height: 1.6; max-width: 540px; margin: 0 auto;">
        Agradecemos sinceramente pela oportunidade e confiança na condução de suas demandas de engenharia mecânica. Reafirmamos nosso compromisso inegociável com a excelência técnica, agilidade operacional, conformidade legal e salvaguarda irrestrita de suas operações industriais e prediais.
      </p>
    </div>

    <!-- GRID DE BENTO CARDS DE ATENDIMENTO E CREDENCIAMENTO -->
    <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px;">
      
      <!-- Card 1: Responsável Técnico -->
      <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-top: 4px solid #0B1E3D; border-radius: 12px; padding: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-size: 10px; font-weight: 800; color: #0B1E3D; text-transform: uppercase; letter-spacing: 0.5px;">DIREÇÃO TÉCNICA</span>
          <span style="background: #eff6ff; color: #1d4ed8; font-size: 9px; font-weight: 800; padding: 2px 8px; border-radius: 6px; border: 1px solid #bfdbfe;">CREA ATIVO</span>
        </div>
        <p style="color: #0B1E3D; font-size: 13px; font-weight: 900; margin: 0 0 2px 0;">
          Eng. Vitor Leonardo C. Linhares
        </p>
        <p style="color: #1565d8; font-size: 10.5px; font-weight: 700; margin: 0 0 6px 0;">
          Engenheiro Mecânico • Perito Técnico Especialista
        </p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px 8px; font-family: monospace; font-size: 10.5px; color: #334155; font-weight: 700;">
          CREA-PE: 182229949-0
        </div>
      </div>

      <!-- Card 2: WhatsApp e Telefone -->
      <div style="background: #ffffff; border: 1.5px solid #86efac; border-top: 4px solid #16a34a; border-radius: 12px; padding: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-size: 10px; font-weight: 800; color: #166534; text-transform: uppercase; letter-spacing: 0.5px;">CANAL DIRETO</span>
          <span style="background: #f0fdf4; color: #15803d; font-size: 9px; font-weight: 800; padding: 2px 8px; border-radius: 6px; border: 1px solid #bbf7d0;">PLANTÃO</span>
        </div>
        <p style="color: #166534; font-size: 14px; font-weight: 900; font-family: monospace; margin: 0 0 2px 0;">
          (81) 98444-2592
        </p>
        <p style="color: #0f172a; font-size: 10.5px; font-weight: 700; margin: 0 0 6px 0;">
          Telefone & WhatsApp Corporativo Oficial
        </p>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 6px 8px; font-size: 10px; color: #15803d; line-height: 1.4;">
          Agilidade direta para início imediato, agendamento de vistorias e alinhamentos.
        </div>
      </div>

      <!-- Card 3: E-mail Corporativo -->
      <div style="background: #ffffff; border: 1.5px solid #bfdbfe; border-top: 4px solid #2563eb; border-radius: 12px; padding: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-size: 10px; font-weight: 800; color: #1e40af; text-transform: uppercase; letter-spacing: 0.5px;">EXPEDIENTE FORMAL</span>
          <span style="background: #eff6ff; color: #1d4ed8; font-size: 9px; font-weight: 800; padding: 2px 8px; border-radius: 6px; border: 1px solid #bfdbfe;">E-MAIL</span>
        </div>
        <p style="color: #1d4ed8; font-size: 12.5px; font-weight: 900; font-family: monospace; margin: 0 0 2px 0;">
          vlengenhariamec@gmail.com
        </p>
        <p style="color: #0f172a; font-size: 10.5px; font-weight: 700; margin: 0 0 6px 0;">
          Envio de Documentações, Contratos e Prontuários
        </p>
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 6px 8px; font-size: 10px; color: #1e40af; line-height: 1.4;">
          Canal dedicado ao envio de Ordens de Serviço, ARTs, notas fiscais e relatórios técnicos.
        </div>
      </div>

      <!-- Card 4: Base Operacional -->
      <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-top: 4px solid #d97706; border-radius: 12px; padding: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-size: 10px; font-weight: 800; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px;">COBERTURA TÉCNICA</span>
          <span style="background: #fffbeb; color: #b45309; font-size: 9px; font-weight: 800; padding: 2px 8px; border-radius: 6px; border: 1px solid #fde68a;">NORDESTE</span>
        </div>
        <p style="color: #0f172a; font-size: 12.5px; font-weight: 900; margin: 0 0 2px 0;">
          Recife & Polo Industrial de Suape - PE
        </p>
        <p style="color: #475569; font-size: 10.5px; font-weight: 600; margin: 0 0 6px 0;">
          Atendimento In Loco em Indústrias, Obras e Frotas
        </p>
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 6px 8px; font-size: 10px; color: #92400e; line-height: 1.4;">
          Mobilização técnica imediata para Região Metropolitana, Agreste e Sertão de Pernambuco.
        </div>
      </div>

    </div>

    <!-- FAIXA DE SEGURANÇA JURÍDICA E COMPLIANCE TÉCNICO -->
    <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 12px 16px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; text-align: center;">
      <div style="border-right: 1px solid #e2e8f0; padding-right: 8px;">
        <span style="display: block; font-weight: 800; color: #0b1e3d; font-size: 10.5px; text-transform: uppercase;">ART REGISTRADA</span>
        <span style="color: #64748b; font-size: 9.5px; line-height: 1.3; display: block; margin-top: 2px;">Emissão e homologação oficial perante o CREA-PE</span>
      </div>
      <div style="border-right: 1px solid #e2e8f0; padding: 0 8px;">
        <span style="display: block; font-weight: 800; color: #0b1e3d; font-size: 10.5px; text-transform: uppercase;">NORMAS ABNT & NRs</span>
        <span style="color: #64748b; font-size: 9.5px; line-height: 1.3; display: block; margin-top: 2px;">Conformidade irrestrita com NR-11, NR-12, NR-13 e NBRs</span>
      </div>
      <div style="padding-left: 8px;">
        <span style="display: block; font-weight: 800; color: #0b1e3d; font-size: 10.5px; text-transform: uppercase;">SIGILO & LGPD</span>
        <span style="color: #64748b; font-size: 9.5px; line-height: 1.3; display: block; margin-top: 2px;">Custódia segura e sigilo de dados industriais</span>
      </div>
    </div>

  </div>`;
}

export const SECOES_PROPOSTA_DEFINICAO: SecaoDefinicao[] = [
  { id: 'capa', numero: 1, titulo: 'PROPOSTA TÉCNICA COMERCIAL // ORÇAMENTO DE ENGENHARIA', subtitulo: 'DIREÇÃO TÉCNICA E RESPONSABILIDADE LEGAL' },
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
  const clienteNome = dadosExtras?.cliente?.razaoSocial || orcamento.clienteNome || 'Cliente Corporativo';
  const cnpj = dadosExtras?.cliente?.cpfCnpj || dadosExtras?.cliente?.cnpj || orcamento.cnpjCliente || 'Consulte o contrato';
  const primeiroContato = dadosExtras?.cliente?.contatos?.[0];
  const representante = (primeiroContato?.nome && primeiroContato.nome.trim()) || (orcamento.representanteNome && orcamento.representanteNome.trim()) || 'Responsável Autorizado';
  const email = primeiroContato?.email || orcamento.emailCliente || 'contato@cliente.com.br';
  const telefone = primeiroContato?.telefone || orcamento.telefoneCliente || '(81) 98444-2592';
  const localidade = (dadosExtras?.cliente?.endereco?.cidade && dadosExtras.cliente.endereco.cidade.trim()) 
    ? `${dadosExtras.cliente.endereco.cidade}${dadosExtras.cliente.endereco.estado ? ` - ${dadosExtras.cliente.endereco.estado}` : ''}` 
    : (orcamento.localidadeServico || 'Recife - PE');
  const servico = orcamento.servico || 'Laudo Técnico Pericial de Engenharia Mecânica';
  const valor = orcamento.valorFormatado || (orcamento.valor ? orcamento.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 3.500,00');
  const validade = orcamento.validadeDias || 15;
  const prazo = orcamento.prazoEntrega || `${orcamento.prazoDias || 7} dias úteis`;
  const condicoes = orcamento.condicoesPagamento || '50% de entrada na aprovação e 50% após emissão do laudo final e ART.';
  const normas = orcamento.normasTecnicas || 'ABNT NBR, NR-11, NR-12, NR-13 conforme aplicável';
  const escopo = orcamento.descricaoEscopo || 'Inspeção técnica presencial, ensaios não destrutivos, verificação de conformidade normativa e emissão de ART oficial.';
  const ativoIden = orcamento.ativoIdentificacao || dadosExtras?.ativo?.identificacao || 'Ativo conforme especificação do cliente';
  const codigo = orcamento.codigoProposta || orcamento.id;
  const tituloLaudoDestaque = obterTituloLaudoProposta(orcamento);

  return [
    {
      id: 'capa',
      numero: 1,
      titulo: 'PROPOSTA TÉCNICA COMERCIAL // ORÇAMENTO DE ENGENHARIA',
      subtitulo: tituloLaudoDestaque,
      conteudoHtml: gerarCardClienteHtml({
        clienteNome,
        cnpj,
        representante,
        localidade,
        codigo,
        validade,
        prazo,
      }),
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
      conteudoHtml: HTML_CARDS_CATALOGO_SERVICOS
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
                <p><strong>Razão Social:</strong> VL ENGENHARIA MECÂNICA</p>
                <p><strong>Responsável Técnico:</strong> Eng. Vitor Leonardo C. Linhares</p>
                <p><strong>CREA-PE:</strong> 182229949-0</p>
                <p><strong>Sede Operacional:</strong> Recife / Paulista - PE</p>
                <p><strong>E-mail:</strong> vlengenhariamec@gmail.com</p>
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
      conteudoHtml: gerarHtmlEtapa2Metodologia(normas)
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
      conteudoHtml: gerarHtmlEtapa3Investimento({
        valor,
        prazo,
        condicoes,
        validade,
        clienteNome,
        representante,
        incluiNotaFiscal: orcamento.incluiNotaFiscal,
        chavePix: orcamento.chavePix,
      })
    },
    {
      id: 'contato',
      numero: 13,
      titulo: 'Agradecimento & Contato',
      subtitulo: 'INFORMAÇÕES INSTITUCIONAIS E ATENDIMENTO DIRETO',
      conteudoHtml: gerarHtmlContatoAgradecimento()
    }
  ];
}

/**
 * Converte paginasProposta para o formato de seções ricas caso ainda não existam.
 */
export function converterPaginasParaSecoes(
  paginas: { numero: number; titulo: string; subtitulo?: string; conteudoHtml: string; ocultarNoPdf?: boolean }[],
  orcamento?: Orcamento
): OrcamentoSecao[] {
  const clienteNome = orcamento?.clienteNome || 'Cliente Contratante';
  const cnpj = orcamento?.cnpjCliente || 'Consulte o contrato';
  const representante = orcamento?.representanteNome || 'Diretoria / Coordenação Técnica';
  const localidade = orcamento?.localidadeServico || 'Recife e Região Metropolitana - PE';
  const codigo = orcamento?.codigoProposta || orcamento?.id || 'PROP-VL';
  const validade = orcamento?.validadeDias || 15;
  const prazo = orcamento?.prazoEntrega || `${orcamento?.prazoDias || 7} dias úteis`;
  const valor = orcamento?.valorFormatado || (orcamento?.valor ? orcamento.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 3.500,00');
  const condicoes = orcamento?.condicoesPagamento || '50% de entrada na aprovação e 50% após emissão do laudo final e ART.';
  const normas = orcamento?.normasTecnicas || 'ABNT NBR, NR-11, NR-12, NR-13 conforme aplicável';
  const tituloLaudoDinamico = orcamento ? obterTituloLaudoProposta(orcamento) : 'LAUDO TÉCNICO DE ENGENHARIA';

  return paginas.map((pag, idx) => {
    const def = SECOES_PROPOSTA_DEFINICAO.find(d => d.numero === pag.numero) || SECOES_PROPOSTA_DEFINICAO[idx];
    const isCapa = (def && def.id === 'capa') || pag.numero === 1 ||
      (pag.titulo && pag.titulo.toLowerCase().includes('capa'));
    const isCatalogo = (def && def.id === 'catalogo') || pag.numero === 6 ||
      (pag.titulo && pag.titulo.toLowerCase().includes('resumo de nossos serviços'));
    const isEtapa2 = (def && def.id === 'etapa2') || pag.numero === 10 ||
      (pag.titulo && (pag.titulo.toLowerCase().includes('etapa 2') || pag.titulo.toLowerCase().includes('metodologia')));
    const isEtapa3 = (def && def.id === 'etapa3') || pag.numero === 12 ||
      (pag.titulo && (pag.titulo.toLowerCase().includes('etapa 3') || pag.titulo.toLowerCase().includes('investimento')));
    const isContato = (def && def.id === 'contato') || pag.numero === 13 ||
      (pag.titulo && (pag.titulo.toLowerCase().includes('contato') || pag.titulo.toLowerCase().includes('agradecimento')));

    let titulo = pag.titulo || def?.titulo || `Seção ${pag.numero}`;
    let subtitulo = pag.subtitulo || def?.subtitulo;
    let conteudo = pag.conteudoHtml || '<p></p>';

    if (isCapa) {
      titulo = 'PROPOSTA TÉCNICA COMERCIAL // ORÇAMENTO DE ENGENHARIA';
      subtitulo = tituloLaudoDinamico;
      if (!conteudo || !conteudo.includes('DADOS DO CLIENTE CONTRATANTE') || conteudo.includes('PROPOSTA TÉCNICA COMERCIAL // ORÇAMENTO DE ENGENHARIA')) {
        conteudo = gerarCardClienteHtml({
          clienteNome,
          cnpj,
          representante,
          localidade,
          codigo,
          validade,
          prazo
        });
      }
    } else if (isCatalogo && (conteudo.includes('PLAYGROUNDS:') || !conteudo.includes('NR-12 • MÁQUINAS INDUSTRIAIS') || !conteudo.includes('grid-template-columns'))) {
      conteudo = HTML_CARDS_CATALOGO_SERVICOS;
      titulo = 'Resumo de Nossos Serviços de Engenharia';
      subtitulo = 'CATÁLOGO DE LAUDOS E ADEQUAÇÕES INDUSTRIAIS';
    } else if (isEtapa2 && (!conteudo.includes('FASE 01') || !conteudo.includes('Metodologia de Engenharia em 5 Fases'))) {
      conteudo = gerarHtmlEtapa2Metodologia(normas);
      titulo = 'Etapa 2 - Escopo Técnico das Atividades (Metodologia)';
      subtitulo = 'FASES, CHECKLISTS E ENSAIOS EM 5 ETAPAS';
    } else if (isEtapa3 && !conteudo.includes('INVESTIMENTO COMERCIAL LÍQUIDO')) {
      conteudo = gerarHtmlEtapa3Investimento({
        valor,
        prazo,
        condicoes,
        validade,
        clienteNome,
        representante,
        incluiNotaFiscal: orcamento?.incluiNotaFiscal,
        chavePix: orcamento?.chavePix,
      });
      titulo = 'Etapa 3 - Prazo, Pagamento & Investimento';
      subtitulo = 'INVESTIMENTO COMERCIAL E TERMOS FINANCEIROS';
    } else if (isContato && (!conteudo.includes('Agradecimento & Parceria') || conteudo.includes('vitorleonardocl@gmail.com'))) {
      conteudo = gerarHtmlContatoAgradecimento();
      titulo = 'Agradecimento & Contato';
      subtitulo = 'INFORMAÇÕES INSTITUCIONAIS E ATENDIMENTO DIRETO';
    }

    return {
      id: def ? def.id : `secao-${pag.numero}`,
      numero: pag.numero,
      titulo,
      subtitulo,
      conteudoHtml: conteudo,
      ocultarNoPdf: pag.ocultarNoPdf ?? false,
    };
  });
}
