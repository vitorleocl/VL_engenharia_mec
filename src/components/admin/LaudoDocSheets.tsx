import React, { useMemo, useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Laudo, Cliente, Ativo } from '../../types';
import { VlLogoVector } from './PropostaViewerModal';

export interface LaudoDocSheetsProps {
  laudo: Laudo;
  cliente?: Cliente;
  ativo?: Ativo;
  folhaEspecifica?: number; // 1 a 6 ou undefined para todas
  embutidoNoModal?: boolean;
}

export const LaudoDocSheets: React.FC<LaudoDocSheetsProps> = ({
  laudo,
  cliente,
  ativo,
  folhaEspecifica,
  embutidoNoModal = false,
}) => {
  const [qrCodeSvg, setQrCodeSvg] = useState<string>('');

  // Identificação e controle
  const numero = laudo.numero || 'LAR-2026-001';
  const revisao = laudo.revisao || '00';
  const dataVistoria = laudo.dataInspecao || '30/10/2026';
  const emitidoEm = laudo.emitidoEm || '11/11/2026';
  const artNumero = laudo.artNumero || 'Pendente';
  const temArtHomologada = Boolean(laudo.artNumero && laudo.artNumero !== 'Pendente' && laudo.artArquivoUrl);
  const estaEmitido = laudo.status === 'finalizado';
  const isMinuta = !temArtHomologada || !estaEmitido;

  const codigoVerificacao = laudo.codigoVerificacao || `${numero}-7K4Q`;
  const urlVerificacao = `${typeof window !== 'undefined' ? window.location.origin : 'https://vlengenhariamecanica.com.br'}/verificar/${codigoVerificacao}`;

  // Gera QR Code SVG real para a autenticidade
  useEffect(() => {
    QRCode.toString(urlVerificacao, {
      type: 'svg',
      margin: 1,
      color: {
        dark: '#15264B',
        light: '#FFFFFF'
      }
    })
      .then(svg => setQrCodeSvg(svg))
      .catch(() => setQrCodeSvg(''));
  }, [urlVerificacao]);

  // Cliente e Ativo (fonte única com fallback)
  const clienteNome = laudo.clienteNome || cliente?.razaoSocial || cliente?.nomeFantasia || 'Adf Auto Pecas LTDA';
  const cnpjCliente = laudo.clienteCnpj || cliente?.cpfCnpj || cliente?.cnpj || '';
  const primeiroContato = cliente?.contatos?.[0];
  const contatoCliente = laudo.clienteContato || primeiroContato?.nome || '';
  const localVistoria = laudo.localVistoria || (cliente?.endereco?.cidade ? `${cliente.endereco.logradouro || ''}, ${cliente.endereco.cidade} - ${cliente.endereco.estado || 'PE'}` : '');
  const acompanhante = laudo.acompanhanteVistoria || primeiroContato?.nome || '';

  const ativoTag = laudo.ativoIdentificacao || ativo?.identificacao || ativo?.placa || 'PGX-9708';
  const ativoFabricante = laudo.ativoFabricante || ativo?.fabricante || 'Renault / Randon Munck';
  const ativoModelo = laudo.ativoModelo || ativo?.modelo || 'Guindaste Articulado 12t';
  const ativoSerie = laudo.ativoNumeroSerie || ativo?.numeroSerie || ativo?.chassi || '093YHSRAF500GJ3983670';
  const ativoCapacidade = laudo.ativoCapacidade || ativo?.capacidade || '12 toneladas / 45.000 kgm';
  const ativoDetalhes = `${ativoFabricante} · ${ativoModelo} · Série: ${ativoSerie} · Cap: ${ativoCapacidade}`;

  const tipoLaudoTitulo = laudo.tipo || 'Laudo de liberação e conformidade NR-11 / NR-12';
  const parecer = laudo.parecer || 'liberado_restricoes';
  const justificativaParecer = laudo.justificativaParecer || '1 não conformidade de risco médio em 6 itens verificados. A liberação para operação em obras e indústrias fica condicionada ao plano de ação da folha 6.';
  const proximaInspecao = laudo.proximaInspecaoData || '30/10/2027';

  // Itens do checklist e contadores
  const itensChecklist = useMemo(() => {
    if (laudo.checklist && laudo.checklist.length > 0) {
      return laudo.checklist;
    }
    return [
      { id: '1', descricao: 'Plaqueta de identificação do fabricante e número de série legíveis', status: 'conforme' as const, observacao: '—', criterioReferencia: 'NR-11 · NBR 8400' },
      { id: '2', descricao: 'Proteções fixas e móveis instaladas e devidamente parafusadas', status: 'conforme' as const, observacao: '—', criterioReferencia: 'NR-11 · NBR 8400' },
      { id: '3', descricao: 'Intertravamento de segurança com bloqueio e chave de ruptura positiva funcionando', status: 'conforme' as const, observacao: '—', criterioReferencia: 'NR-12' },
      { id: '4', descricao: 'Botões de parada de emergência acessíveis e desarmando o comando de força', status: 'conforme' as const, observacao: '—', criterioReferencia: 'NR-12' },
      { id: '5', descricao: 'Sinalização de segurança, advertências de riscos residuais e diagramas visíveis', status: 'nao_conforme' as const, observacao: 'Ver NC-01, folha 6.', criterioReferencia: 'NR-12.11 / NR-26' },
      { id: '6', descricao: 'Fotos de todas as faces do equipamento e registro do aterramento elétrico', status: 'conforme' as const, observacao: '—', criterioReferencia: 'NR-10 / NR-12' }
    ];
  }, [laudo.checklist]);

  const totalVerificados = itensChecklist.length;
  const totalConformes = itensChecklist.filter(i => i.status === 'conforme').length;
  const totalNaoConformes = itensChecklist.filter(i => i.status === 'nao_conforme').length;
  const totalNaoAplicaveis = itensChecklist.filter(i => i.status === 'nao_aplicavel').length;
  const percConformes = totalVerificados > 0 ? (totalConformes / totalVerificados) * 100 : 100;
  const percNaoConformes = totalVerificados > 0 ? (totalNaoConformes / totalVerificados) * 100 : 0;

  // Não conformidades estruturadas
  const naoConformidades = useMemo(() => {
    if (laudo.naoConformidadesEstruturadas && laudo.naoConformidadesEstruturadas.length > 0) {
      return laudo.naoConformidadesEstruturadas;
    }
    return [
      {
        id: 'NC-01',
        titulo: 'Sinalização de segurança e advertências de risco residual sem a visibilidade exigida.',
        risco: 'medio' as const,
        acaoRecomendada: 'Substituir ou recompor a sinalização no ativo e confirmar a correção ao responsável técnico.',
        prazo: '30 dias',
        itemRef: 'Item 3 (Checklist item 5)',
        fotoRef: 'Foto 3'
      }
    ];
  }, [laudo.naoConformidadesEstruturadas]);

  // Seções de constatações
  const secoesConstatacoes = useMemo(() => {
    if (laudo.secoes && laudo.secoes.length > 0) {
      return laudo.secoes;
    }
    return [
      {
        id: 'sec-1',
        ordem: 1,
        titulo: 'Verificação dos estabilizadores e chassi de montagem',
        resultado: 'conforme' as const,
        criterioReferencia: 'NR-11 · NBR 8400',
        conteudoHtml: '<p>Verificação técnica pericial realizada em conformidade com as diretrizes da norma NR-11 · NBR 8400, no ativo PGX-9708 do cliente Adf Auto Pecas LTDA. Foi realizada a checagem das sapatas estabilizadoras hidráulicas dianteiras e traseiras, cilindros de extensão e fixação ao sobrechassi por grampos reforçados. Estrutura sem trincas, vazamentos ou deformações permanentes.</p>',
        fotos: [
          { id: 'f-1', url: '', legenda: 'Foto 1. Estabilizadores estendidos com travas operacionais e cilindros estanques.' },
          { id: 'f-2', url: '', legenda: 'Foto 2. Detalhe da fixação do chassi de montagem às longarinas do veículo.' }
        ]
      },
      {
        id: 'sec-2',
        ordem: 2,
        titulo: 'Exame dos acessórios de içamento (ganchos, cabos, moitões)',
        resultado: 'conforme' as const,
        criterioReferencia: 'NR-11 · NBR 8400',
        conteudoHtml: '<p>Verificação técnica pericial realizada em conformidade com as diretrizes da norma NR-11 · NBR 8400, no ativo PGX-9708 do cliente Adf Auto Pecas LTDA. Gancho principal com trava de segurança em perfeito estado, sem abertura excessiva de garganta. Cabos de aço e terminais sem arames rompidos ou desgastes corrosivos.</p>',
        fotos: [
          { id: 'f-3', url: '', legenda: 'Foto 3. Gancho forjado com trava de segurança tipo mola operante e gravação de capacidade legível.' },
          { id: 'f-4', url: '', legenda: 'Foto 4. Moitão e polias de direcionamento de cabo sem folgas axiais.' }
        ]
      },
      {
        id: 'sec-3',
        ordem: 3,
        titulo: 'Inspeção do posto de comando e alavancas',
        resultado: 'nao_conforme' as const,
        ncCodigo: 'NC-01',
        criterioReferencia: 'NR-11 · NBR 8400 · Origem: checklist, item 5',
        conteudoHtml: '<p>Verificação técnica pericial realizada em conformidade com as diretrizes da norma NR-11 · NBR 8400, no ativo PGX-9708. Foi registrada a não conformidade NC-01 (sinalização de segurança e advertência de risco residual sem visibilidade adequada). As alavancas possuem funcionamento mecânico regular com retorno automático ao centro neutro, porém as placas adesivas indicativas de movimentos e diagramas de carga encontram-se desgastadas pela ação solar e intempéries.</p>',
        fotos: [
          { id: 'f-5', url: '', legenda: 'Foto 5. Posto de comando bilateral com desgaste nas etiquetas indicativas de comando.' },
          { id: 'f-6', url: '', legenda: 'Foto 6. Detalhe da placa de advertência com desgaste superficial a ser reposta.' }
        ]
      },
      {
        id: 'sec-4',
        ordem: 4,
        titulo: 'Parecer de liberação para obras e indústrias',
        resultado: 'liberado_restricoes' as const,
        criterioReferencia: 'NR-11 · NR-12 · CONFEA/CREA',
        conteudoHtml: '<p>O ativo PGX-9708 é considerado liberado com restrições para operação em obras e indústrias, nos termos do parecer conclusivo da folha 6. O uso normal fica condicionado ao cumprimento do plano de ação da NC-01 dentro do prazo indicado (até 30 dias a partir da data da vistoria).</p>',
        fotos: [
          { id: 'f-7', url: '', legenda: 'Foto 7. Vista geral do ativo em teste de operação.' },
          { id: 'f-8', url: '', legenda: 'Foto 8. Placa de identificação e chassi verificados.' },
          { id: 'f-9', url: '', legenda: 'Foto 9. Registro do ponto de aterramento elétrico de proteção.' }
        ]
      }
    ];
  }, [laudo.secoes]);

  // Normas e Instrumentos
  const normasLista = laudo.normasLista && laudo.normasLista.length > 0 ? laudo.normasLista : [
    { norma: 'NR-11', titulo: 'Transporte, movimentação, armazenagem e manuseio de materiais', edicao: 'Vigente (Portaria MTP)' },
    { norma: 'NR-12', titulo: 'Segurança no trabalho em máquinas e equipamentos', edicao: 'Vigente (Portaria MTP)' },
    { norma: 'ABNT NBR 8400', titulo: 'Cálculo de equipamento para levantamento e movimentação de cargas', edicao: 'Edição 2019' }
  ];

  const instrumentos = laudo.instrumentos && laudo.instrumentos.length > 0 ? laudo.instrumentos : [
    { nome: 'Paquímetro Digital Mitutoyo 150mm', serie: 'MIT-449102', certificado: 'CAL-2026/8841-RBC', validadeCalibracao: '15/04/2027' },
    { nome: 'Trena Laser Bosch GLM 50C', serie: 'BOS-99120', certificado: 'CAL-2025/1102-RBC', validadeCalibracao: '10/12/2026' }
  ];

  const premissas = laudo.premissasLimitacoes || 'Este laudo refere-se exclusivamente às condições observadas no ativo e no local na data da vistoria. Itens não acessíveis, não energizados ou não disponibilizados pelo cliente não foram avaliados e estão indicados como não aplicáveis. Alterações, reparos ou mudanças de uso posteriores à vistoria exigem nova avaliação.';

  // Estilos A4 com tipografia idêntica ao modelo aprovado
  const stylesA4 = `
    @page {
      size: 210mm 297mm;
      margin: 0;
    }
    .laudo-a4-root {
      --ink: #15264B;
      --blue: #2459C8;
      --amber: #F2A900;
      --green: #167A52;
      --red: #B3322A;
      --text: #1F2B45;
      --muted: #56637F;
      --rule: #C5CEDD;
      --tint: #F1F4F9;
      --w1: 0.3pt;
      --w2: 0.7pt;
      --w3: 1.4pt;
      --sans: 'Barlow Semi Condensed', 'Arial Narrow', Arial, sans-serif;
      --serif: 'Source Serif 4', Georgia, serif;
      font-family: var(--serif);
      color: var(--text);
      line-height: 1.46;
      font-size: 9.3pt;
    }
    .laudo-sheet {
      width: 210mm;
      height: 297mm;
      position: relative;
      overflow: hidden;
      background: #ffffff;
      break-after: page;
      page-break-after: always;
      box-sizing: border-box;
      margin: ${embutidoNoModal ? '0 auto 24px auto' : '0 auto'};
      box-shadow: ${embutidoNoModal ? '0 4px 20px rgba(0,0,0,0.15)' : 'none'};
    }
    .laudo-sheet:last-child {
      break-after: auto;
      page-break-after: auto;
    }
    .minuta-banner {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: 5.4mm;
      background: #F2A900;
      color: #15264B;
      font-family: var(--sans);
      font-weight: 700;
      font-size: 7pt;
      line-height: 5.4mm;
      text-align: center;
      letter-spacing: 0.04em;
      z-index: 50;
    }
    .laudo-rh {
      position: absolute;
      left: 14mm;
      right: 14mm;
      top: 10mm;
      height: 13mm;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      border-bottom: 1.4pt solid #15264B;
      padding-bottom: 2.2mm;
    }
    .laudo-body {
      position: absolute;
      left: 14mm;
      right: 14mm;
      top: 28mm;
      bottom: 31mm;
    }
    .laudo-lg {
      position: absolute;
      left: 14mm;
      right: 14mm;
      bottom: 12mm;
      display: grid;
      grid-template-columns: 1fr 31mm 11mm 22mm 28mm 14mm;
      gap: 0.3pt;
      background: #15264B;
      border: 1.4pt solid #15264B;
    }
    .laudo-lg > div {
      background: #fff;
      padding: 1.3mm 2mm 1.5mm;
      min-width: 0;
    }
    .laudo-lg .k {
      display: block;
      font-family: var(--sans);
      font-weight: 500;
      font-size: 6.5pt;
      line-height: 1;
      color: #56637F;
      margin-bottom: 0.8mm;
    }
    .laudo-lg .v {
      display: block;
      font-family: var(--sans);
      font-weight: 600;
      font-size: 8.4pt;
      line-height: 1.1;
      color: #15264B;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .laudo-ft {
      position: absolute;
      left: 14mm;
      right: 14mm;
      bottom: 6.4mm;
      display: flex;
      justify-content: space-between;
      gap: 6mm;
      font-family: var(--sans);
      font-weight: 500;
      font-size: 7.2pt;
      color: #56637F;
    }
    .chip-item {
      display: inline-flex;
      align-items: center;
      gap: 1.2mm;
      font-family: var(--sans);
      font-weight: 700;
      font-size: 8pt;
      line-height: 1;
      padding: 1mm 2mm;
      border-width: 0.7pt;
      border-style: solid;
      white-space: nowrap;
    }
    .chip-item.ok {
      color: #167A52;
      border-color: #167A52;
      background: #EAF6F0;
    }
    .chip-item.nc {
      color: #FFFFFF;
      background: #B3322A;
      border-color: #B3322A;
    }
    .chip-item.rs {
      color: #15264B;
      background: #F2A900;
      border-color: #F2A900;
    }
    .chip-item.na {
      color: #56637F;
      border-color: #C5CEDD;
      background: #F1F4F9;
    }
    .risk-badge {
      display: inline-block;
      font-family: var(--sans);
      font-weight: 700;
      font-size: 8pt;
      line-height: 1;
      padding: 1mm 2mm;
      border-width: 0.7pt;
      border-style: solid;
      white-space: nowrap;
    }
    .risk-badge.b {
      color: #167A52;
      border-color: #167A52;
      background: #EAF6F0;
    }
    .risk-badge.m {
      background: #F2A900;
      border-color: #F2A900;
      color: #15264B;
    }
    .risk-badge.a {
      color: #B3322A;
      border-color: #B3322A;
      background: #FDE8E8;
    }
    .risk-badge.c {
      background: #B3322A;
      border-color: #B3322A;
      color: #ffffff;
    }
    .todo-highlight {
      background: repeating-linear-gradient(135deg, #FFF1C2 0 1.6mm, #FFE59A 1.6mm 3.2mm);
      color: #6B4A00;
      padding: 0 1.5mm;
      font-family: var(--sans);
      font-weight: 600;
      font-size: 8.5pt;
    }
    @media print {
      body {
        margin: 0 !important;
        padding: 0 !important;
        background: #fff !important;
      }
      .laudo-sheet {
        margin: 0 !important;
        box-shadow: none !important;
        page-break-after: always !important;
        break-after: page !important;
      }
      .no-print {
        display: none !important;
      }
    }
  `;

  // Renderiza a folha de controle padrão
  const renderControlFooter = (folhaNum: number) => (
    <>
      <div className="laudo-lg">
        <div>
          <span className="k">Cliente</span>
          <span className="v">{clienteNome}</span>
        </div>
        <div>
          <span className="k">Laudo</span>
          <span className="v">{numero}</span>
        </div>
        <div>
          <span className="k">Rev.</span>
          <span className="v">{revisao}</span>
        </div>
        <div>
          <span className="k">Vistoria</span>
          <span className="v">{dataVistoria}</span>
        </div>
        <div>
          <span className="k">ART CREA-PE</span>
          <span className="v">{artNumero}</span>
        </div>
        <div>
          <span className="k">Folha</span>
          <span className="v">{folhaNum} / 6</span>
        </div>
      </div>
      <div className="laudo-ft">
        <span>
          VL Engenharia Mecânica · <em style={{ fontStyle: 'normal' }}>Recife / Paulista, PE</em>
        </span>
        <span style={{ display: 'flex', gap: '5mm' }}>
          <a href="https://wa.me/5581984442592">(81) 98444-2592</a>
          <a href="mailto:atendimento@vlengenhariamecanica.com.br">atendimento@vlengenhariamecanica.com.br</a>
        </span>
      </div>
    </>
  );

  return (
    <div className="laudo-a4-root">
      <style>{stylesA4}</style>

      {/* ==================== FOLHA 1: CAPA ==================== */}
      {(!folhaEspecifica || folhaEspecifica === 1) && (
        <section className="laudo-sheet" id="p1">
          {isMinuta && (
            <div className="minuta-banner">
              MINUTA ILUSTRATIVA · dados de exemplo, sem validade até a anexação da ART e a emissão
            </div>
          )}

          {/* Cabeçalho da capa */}
          <div style={{
            position: 'absolute',
            left: '14mm',
            right: '14mm',
            top: '12mm',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            paddingBottom: '4mm',
            borderBottom: '1.4pt solid #15264B'
          }}>
            <VlLogoVector style={{ width: '175px', height: '34px' }} />
            <div style={{
              textAlign: 'right',
              fontFamily: 'var(--sans)',
              fontWeight: 500,
              fontSize: '8.8pt',
              lineHeight: 1.45,
              color: '#56637F'
            }}>
              <div>Laudo <b style={{ color: '#15264B', fontWeight: 700 }}>{numero}</b>, revisão {revisao}</div>
              <div>Emitido em <b style={{ color: '#15264B', fontWeight: 700 }}>{emitidoEm}</b></div>
            </div>
          </div>

          {/* Título principal */}
          <div style={{ position: 'absolute', left: '14mm', right: '14mm', top: '38mm' }}>
            <div style={{
              fontSize: '8.6pt',
              color: '#2459C8',
              fontWeight: 700,
              letterSpacing: '0.04em',
              marginBottom: '2.4mm',
              fontFamily: 'var(--sans)'
            }}>
              LAUDO TÉCNICO PERICIAL DE ENGENHARIA
            </div>
            <h1 style={{
              fontFamily: 'var(--sans)',
              fontWeight: 700,
              fontSize: '32pt',
              lineHeight: 1.05,
              letterSpacing: '-0.012em',
              color: '#15264B'
            }}>
              {tipoLaudoTitulo}
            </h1>
            <p style={{
              fontFamily: 'var(--sans)',
              fontWeight: 600,
              fontSize: '12pt',
              color: '#2459C8',
              marginTop: '3.6mm'
            }}>
              Ativo {ativoTag} · {clienteNome}
            </p>
          </div>

          {/* Parecer do perito em destaque */}
          <div style={{ position: 'absolute', left: '14mm', right: '14mm', top: '92mm' }}>
            <span style={{
              fontFamily: 'var(--sans)',
              fontWeight: 600,
              fontSize: '7.6pt',
              color: '#56637F'
            }}>
              Parecer do perito
            </span>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.5fr 1fr',
              border: '1.4pt solid #15264B',
              marginTop: '1.4mm'
            }}>
              <div style={{
                padding: '3.4mm 3mm',
                textAlign: 'center',
                fontFamily: 'var(--sans)',
                fontWeight: 700,
                fontSize: parecer === 'liberado' ? '13pt' : '11pt',
                color: parecer === 'liberado' ? '#15264B' : '#56637F',
                background: parecer === 'liberado' ? '#167A52' : '#ffffff',
                borderRight: '0.3pt solid #C5CEDD'
              }}>
                Liberado
              </div>
              <div style={{
                padding: '3.4mm 3mm',
                textAlign: 'center',
                fontFamily: 'var(--sans)',
                fontWeight: 700,
                fontSize: parecer === 'liberado_restricoes' ? '13pt' : '11pt',
                color: '#15264B',
                background: parecer === 'liberado_restricoes' ? '#F2A900' : '#ffffff',
                borderRight: '0.3pt solid #C5CEDD',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.6mm'
              }}>
                <svg width="16" height="16" viewBox="0 0 12 12" style={{ display: 'inline-block' }}>
                  <path d="M6 1.6L11 10.4H1z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M6 5v2.4M6 8.6v.1" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                Liberado com restrições
              </div>
              <div style={{
                padding: '3.4mm 3mm',
                textAlign: 'center',
                fontFamily: 'var(--sans)',
                fontWeight: 700,
                fontSize: parecer === 'nao_liberado' ? '13pt' : '11pt',
                color: parecer === 'nao_liberado' ? '#ffffff' : '#56637F',
                background: parecer === 'nao_liberado' ? '#B3322A' : '#ffffff'
              }}>
                Não liberado
              </div>
            </div>
            <p style={{
              marginTop: '2.6mm',
              fontFamily: 'var(--serif)',
              fontSize: '9.6pt',
              lineHeight: 1.5,
              maxWidth: '165mm',
              color: '#1F2B45'
            }}>
              {justificativaParecer}
            </p>
          </div>

          {/* Seção intermediária: índice e sumário de resultados */}
          <div style={{
            position: 'absolute',
            left: '14mm',
            right: '14mm',
            top: '132mm',
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '9mm'
          }}>
            <div>
              <h3 style={{
                fontFamily: 'var(--sans)',
                fontWeight: 700,
                fontSize: '11.5pt',
                color: '#15264B',
                paddingBottom: '1.1mm',
                borderBottom: '0.7pt solid #15264B',
                marginBottom: '2.4mm'
              }}>
                Neste laudo
              </h3>
              <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { num: 'p. 2', t: 'Resumo da vistoria e escopo', d: 'Objeto, normas de referência, instrumentos e limitações.' },
                  { num: 'p. 3', t: 'Checklist normativo', d: 'Resultado item a item e classificação de risco.' },
                  { num: 'p. 4–5', t: 'Constatações técnicas por item', d: 'Verificações, evidências fotográficas e parecer de liberação.' },
                  { num: 'p. 6', t: 'Não conformidades, parecer e assinatura', d: 'Plano de ação, validade, responsável técnico e autenticidade.' },
                ].map((idxItem, i) => (
                  <li key={i} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 12mm',
                    gap: '2.5mm',
                    padding: '2mm 0',
                    borderBottom: i < 3 ? '0.3pt solid #C5CEDD' : 'none',
                    alignItems: 'baseline'
                  }}>
                    <div>
                      <span style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '10pt', color: '#15264B' }}>{idxItem.t}</span>
                      <span style={{ display: 'block', fontFamily: 'var(--serif)', fontSize: '8.2pt', color: '#56637F', marginTop: '0.5mm' }}>{idxItem.d}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '9.4pt', color: '#15264B', textAlign: 'right' }}>{idxItem.num}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div style={{
              background: '#F1F4F9',
              padding: '3.6mm 4.2mm',
              border: '0.3pt solid #C5CEDD',
              alignSelf: 'start'
            }}>
              <h3 style={{
                fontFamily: 'var(--sans)',
                fontWeight: 700,
                fontSize: '11.5pt',
                color: '#15264B',
                borderBottom: '0.7pt solid #C5CEDD',
                paddingBottom: '1mm',
                marginBottom: '1.6mm'
              }}>
                Resultado da vistoria
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2mm', marginTop: '1mm' }}>
                <div>
                  <span style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '7pt', color: '#56637F' }}>Verificados</span>
                  <b style={{ display: 'block', fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '22pt', color: '#15264B', lineHeight: 1 }}>{totalVerificados}</b>
                </div>
                <div>
                  <span style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '7pt', color: '#56637F' }}>Conformes</span>
                  <b style={{ display: 'block', fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '22pt', color: '#167A52', lineHeight: 1 }}>{totalConformes}</b>
                </div>
                <div>
                  <span style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '7pt', color: '#56637F' }}>Não conformes</span>
                  <b style={{ display: 'block', fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '22pt', color: '#B3322A', lineHeight: 1 }}>{totalNaoConformes}</b>
                </div>
              </div>
              <div style={{
                display: 'flex',
                height: '3.2mm',
                marginTop: '2.4mm',
                border: '0.7pt solid #15264B'
              }}>
                <i style={{ display: 'block', width: `${percConformes}%`, background: '#167A52' }} />
                <i style={{ display: 'block', width: `${percNaoConformes}%`, background: '#B3322A' }} />
              </div>
              <p style={{
                fontFamily: 'var(--serif)',
                fontSize: '8.6pt',
                color: '#1F2B45',
                marginTop: '2.2mm',
                lineHeight: 1.4
              }}>
                Vistoria presencial em {dataVistoria}, com checklist registrado em campo e evidências fotográficas anexadas.
              </p>
            </div>
          </div>

          {/* Tabela de metadados de 12 colunas */}
          <div style={{
            position: 'absolute',
            left: '14mm',
            right: '14mm',
            bottom: '21mm',
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '0.3pt',
            background: '#15264B',
            border: '1.4pt solid #15264B'
          }}>
            <div style={{ gridColumn: 'span 8', background: '#fff', padding: '1.7mm 2.4mm' }}>
              <span style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '6.8pt', color: '#56637F', marginBottom: '0.8mm' }}>Cliente / solicitante</span>
              <span style={{ display: 'block', fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '10.2pt', color: '#15264B' }}>{clienteNome}</span>
            </div>
            <div style={{ gridColumn: 'span 4', background: '#fff', padding: '1.7mm 2.4mm' }}>
              <span style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '6.8pt', color: '#56637F', marginBottom: '0.8mm' }}>CNPJ / CPF</span>
              <span style={{ display: 'block', fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '9.8pt', color: '#15264B' }}>
                {cnpjCliente || <span className="todo-highlight">preencher no cadastro do cliente</span>}
              </span>
            </div>

            <div style={{ gridColumn: 'span 4', background: '#fff', padding: '1.7mm 2.4mm' }}>
              <span style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '6.8pt', color: '#56637F', marginBottom: '0.8mm' }}>Contato</span>
              <span style={{ display: 'block', fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '9.5pt', color: '#15264B' }}>
                {contatoCliente || <span className="todo-highlight">preencher</span>}
              </span>
            </div>
            <div style={{ gridColumn: 'span 4', background: '#fff', padding: '1.7mm 2.4mm' }}>
              <span style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '6.8pt', color: '#56637F', marginBottom: '0.8mm' }}>Local da vistoria</span>
              <span style={{ display: 'block', fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '9.5pt', color: '#15264B' }}>
                {localVistoria || <span className="todo-highlight">preencher</span>}
              </span>
            </div>
            <div style={{ gridColumn: 'span 4', background: '#fff', padding: '1.7mm 2.4mm' }}>
              <span style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '6.8pt', color: '#56637F', marginBottom: '0.8mm' }}>Data da vistoria</span>
              <span style={{ display: 'block', fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '9.8pt', color: '#15264B' }}>{dataVistoria}</span>
            </div>

            <div style={{ gridColumn: 'span 3', background: '#fff', padding: '1.7mm 2.4mm' }}>
              <span style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '6.8pt', color: '#56637F', marginBottom: '0.8mm' }}>Ativo / TAG</span>
              <span style={{ display: 'block', fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '10.2pt', color: '#15264B' }}>{ativoTag}</span>
            </div>
            <div style={{ gridColumn: 'span 9', background: '#fff', padding: '1.7mm 2.4mm' }}>
              <span style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '6.8pt', color: '#56637F', marginBottom: '0.8mm' }}>Fabricante / modelo / nº de série / capacidade</span>
              <span style={{ display: 'block', fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '9.2pt', color: '#15264B' }}>
                {ativoDetalhes}
              </span>
            </div>

            <div style={{ gridColumn: 'span 3', background: '#fff', padding: '1.7mm 2.4mm' }}>
              <span style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '6.8pt', color: '#56637F', marginBottom: '0.8mm' }}>Nº do laudo</span>
              <span style={{ display: 'block', fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '10.2pt', color: '#15264B' }}>{numero}</span>
            </div>
            <div style={{ gridColumn: 'span 2', background: '#fff', padding: '1.7mm 2.4mm' }}>
              <span style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '6.8pt', color: '#56637F', marginBottom: '0.8mm' }}>Revisão</span>
              <span style={{ display: 'block', fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '10.2pt', color: '#15264B' }}>{revisao}</span>
            </div>
            <div style={{ gridColumn: 'span 3', background: '#fff', padding: '1.7mm 2.4mm' }}>
              <span style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '6.8pt', color: '#56637F', marginBottom: '0.8mm' }}>ART CREA-PE</span>
              <span style={{ display: 'block', fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '10.2pt', color: '#15264B' }}>
                {artNumero !== 'Pendente' ? artNumero : <span className="todo-highlight">anexar ART</span>}
              </span>
            </div>
            <div style={{ gridColumn: 'span 4', background: '#fff', padding: '1.7mm 2.4mm' }}>
              <span style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '6.8pt', color: '#56637F', marginBottom: '0.8mm' }}>Responsável técnico</span>
              <span style={{ display: 'block', fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '9pt', color: '#15264B', lineHeight: 1.2 }}>
                Eng. Vitor Leonardo C. Linhares<br />
                <span style={{ color: '#2459C8' }}>CREA-PE 182229949-0</span>
              </span>
            </div>
          </div>

          <div className="laudo-ft">
            <span>
              VL Engenharia Mecânica · <em style={{ fontStyle: 'normal' }}>Recife / Paulista, PE</em>
            </span>
            <span style={{ display: 'flex', gap: '5mm' }}>
              <a href="https://wa.me/5581984442592">(81) 98444-2592</a>
              <a href="mailto:atendimento@vlengenhariamecanica.com.br">atendimento@vlengenhariamecanica.com.br</a>
            </span>
          </div>
        </section>
      )}

      {/* ==================== FOLHA 2: RESUMO E ESCOPO ==================== */}
      {(!folhaEspecifica || folhaEspecifica === 2) && (
        <section className="laudo-sheet" id="p2">
          {isMinuta && (
            <div className="minuta-banner">
              MINUTA ILUSTRATIVA · dados de exemplo, sem validade até a anexação da ART e a emissão
            </div>
          )}

          <div className="laudo-rh">
            <VlLogoVector style={{ width: '135px', height: '26px' }} />
            <div style={{ fontFamily: 'var(--sans)', fontWeight: 500, fontSize: '9pt', color: '#56637F' }}>
              <b>Laudo {numero}</b> &nbsp;Resumo da vistoria e escopo
            </div>
          </div>

          <div className="laudo-body">
            <h2 style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '20pt', color: '#15264B', margin: '0 0 4mm 0' }}>
              Resumo da vistoria e escopo
            </h2>

            {/* Fatos em 4 quadros */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.3pt',
              background: '#C5CEDD',
              borderTop: '0.7pt solid #15264B',
              borderBottom: '0.3pt solid #C5CEDD'
            }}>
              <div style={{ background: '#fff', padding: '2mm 2.6mm' }}>
                <span style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '7.5pt', color: '#56637F' }}>Itens verificados</span>
                <b style={{ display: 'block', fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '20pt', color: '#15264B' }}>{totalVerificados}</b>
              </div>
              <div style={{ background: '#fff', padding: '2mm 2.6mm' }}>
                <span style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '7.5pt', color: '#56637F' }}>Conformes</span>
                <b style={{ display: 'block', fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '20pt', color: '#167A52' }}>{totalConformes}</b>
              </div>
              <div style={{ background: '#fff', padding: '2mm 2.6mm' }}>
                <span style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '7.5pt', color: '#56637F' }}>Não conformes</span>
                <b style={{ display: 'block', fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '20pt', color: '#B3322A' }}>{totalNaoConformes}</b>
              </div>
              <div style={{ background: '#fff', padding: '2mm 2.6mm' }}>
                <span style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '7.5pt', color: '#56637F' }}>Não aplicáveis</span>
                <b style={{ display: 'block', fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '20pt', color: '#56637F' }}>{totalNaoAplicaveis}</b>
              </div>
            </div>

            <div style={{
              background: '#F1F4F9',
              padding: '2.4mm 3mm',
              fontFamily: 'var(--sans)',
              fontWeight: 500,
              fontSize: '9.6pt',
              lineHeight: 1.4,
              color: '#15264B',
              marginTop: '3mm'
            }}>
              <b>Liberado com restrições.</b> Há {totalNaoConformes} não conformidade registrada, com ação recomendada e prazo definidos na folha 6.
            </div>

            {/* Objeto e dados da vistoria */}
            <div style={{ marginTop: '4.5mm' }}>
              <h3 style={{
                fontFamily: 'var(--sans)',
                fontWeight: 700,
                fontSize: '11.5pt',
                color: '#15264B',
                borderBottom: '0.7pt solid #15264B',
                paddingBottom: '1mm',
                marginBottom: '2mm'
              }}>
                Objeto e dados da vistoria
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {[
                    { k: 'Objeto', v: `Inspeção pericial diagnóstica de conformidade normativa e segurança operacional do ativo ${ativoTag}.` },
                    { k: 'Cliente / solicitante', v: clienteNome },
                    { k: 'Data da vistoria', v: dataVistoria },
                    { k: 'Local da vistoria', v: localVistoria || <span className="todo-highlight">preencher</span> },
                    { k: 'Acompanhante do cliente', v: acompanhante || <span className="todo-highlight">nome e função</span> },
                    { k: 'Método', v: laudo.metodo || 'Inspeções visuais, verificações dimensionais e análise de conformidade frente às normas técnicas da ABNT e às Normas Regulamentadoras vigentes.' },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '0.3pt solid #C5CEDD' }}>
                      <th style={{ width: '38mm', padding: '1.2mm 2mm 1.2mm 0', textAlign: 'left', fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '8.4pt', color: '#56637F' }}>
                        {row.k}
                      </th>
                      <td style={{ padding: '1.2mm 0', fontFamily: i === 0 || i === 5 ? 'var(--serif)' : 'var(--sans)', fontWeight: i === 0 || i === 5 ? 400 : 600, fontSize: '9.2pt', color: '#15264B' }}>
                        {row.v}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Normas de referência */}
            <div style={{ marginTop: '4mm' }}>
              <h3 style={{
                fontFamily: 'var(--sans)',
                fontWeight: 700,
                fontSize: '11.5pt',
                color: '#15264B',
                borderBottom: '0.7pt solid #15264B',
                paddingBottom: '1mm',
                marginBottom: '2mm'
              }}>
                Normas de referência
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {normasLista.map((n, i) => {
                    const normaNome = typeof n === 'string' ? (n.split('—')[0]?.trim() || n.split('-')[0]?.trim() || n) : n.norma;
                    const normaTitulo = typeof n === 'string' ? (n.includes('—') ? n.split('—').slice(1).join('—').trim() : (n.includes('-') ? n.split('-').slice(1).join('-').trim() : '')) : n.titulo;
                    const normaEdicao = typeof n === 'object' ? n.edicao : undefined;

                    return (
                      <tr key={i} style={{ borderBottom: '0.3pt solid #C5CEDD' }}>
                        <th style={{ width: '38mm', padding: '1.2mm 2mm 1.2mm 0', textAlign: 'left', fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '8.4pt', color: '#56637F' }}>
                          {normaNome}
                        </th>
                        <td style={{ padding: '1.2mm 0', fontFamily: 'var(--sans)', fontWeight: 500, fontSize: '9pt', color: '#15264B' }}>
                          {normaTitulo} &nbsp;{normaEdicao && <span style={{ color: '#2459C8', fontWeight: 600 }}>({normaEdicao})</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Instrumentos e rastreabilidade */}
            <div style={{ marginTop: '4mm' }}>
              <h3 style={{
                fontFamily: 'var(--sans)',
                fontWeight: 700,
                fontSize: '11.5pt',
                color: '#15264B',
                borderBottom: '0.7pt solid #15264B',
                paddingBottom: '1mm',
                marginBottom: '2mm'
              }}>
                Instrumentos e rastreabilidade
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '0.7pt solid #15264B' }}>
                    <th style={{ textAlign: 'left', padding: '1mm 2mm 1mm 0', fontFamily: 'var(--sans)', fontSize: '7.8pt', color: '#56637F' }}>Instrumento</th>
                    <th style={{ width: '34mm', textAlign: 'left', padding: '1mm 2mm', fontFamily: 'var(--sans)', fontSize: '7.8pt', color: '#56637F' }}>Nº de série</th>
                    <th style={{ width: '44mm', textAlign: 'left', padding: '1mm 2mm', fontFamily: 'var(--sans)', fontSize: '7.8pt', color: '#56637F' }}>Certificado de calibração</th>
                    <th style={{ width: '24mm', textAlign: 'left', padding: '1mm 0', fontFamily: 'var(--sans)', fontSize: '7.8pt', color: '#56637F' }}>Validade</th>
                  </tr>
                </thead>
                <tbody>
                  {instrumentos.map((inst, i) => (
                    <tr key={i} style={{ borderBottom: '0.3pt solid #C5CEDD' }}>
                      <td style={{ padding: '1.6mm 2mm 1.6mm 0', fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '8.8pt', color: '#15264B' }}>{inst.nome}</td>
                      <td style={{ padding: '1.6mm 2mm', fontFamily: 'var(--sans)', fontSize: '8.6pt', color: '#15264B' }}>{inst.serie || '—'}</td>
                      <td style={{ padding: '1.6mm 2mm', fontFamily: 'var(--sans)', fontSize: '8.6pt', color: '#2459C8', fontWeight: 600 }}>{inst.certificado || '—'}</td>
                      <td style={{ padding: '1.6mm 0', fontFamily: 'var(--sans)', fontSize: '8.6pt', color: '#15264B' }}>{inst.validadeCalibracao || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Limitações e premissas */}
            <div style={{ marginTop: '4mm' }}>
              <h3 style={{
                fontFamily: 'var(--sans)',
                fontWeight: 700,
                fontSize: '11.5pt',
                color: '#15264B',
                borderBottom: '0.7pt solid #15264B',
                paddingBottom: '1mm',
                marginBottom: '1.5mm'
              }}>
                Limitações e premissas
              </h3>
              <p style={{ fontFamily: 'var(--serif)', fontSize: '8.8pt', lineHeight: 1.45, color: '#1F2B45', margin: 0 }}>
                {premissas}
              </p>
            </div>

            {/* Histórico de revisões */}
            <div style={{ marginTop: '4mm' }}>
              <h3 style={{
                fontFamily: 'var(--sans)',
                fontWeight: 700,
                fontSize: '11.5pt',
                color: '#15264B',
                borderBottom: '0.7pt solid #15264B',
                paddingBottom: '1mm',
                marginBottom: '1.5mm'
              }}>
                Histórico de revisões
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '0.7pt solid #15264B' }}>
                    <th style={{ width: '14mm', textAlign: 'left', padding: '1mm 0', fontFamily: 'var(--sans)', fontSize: '7.8pt', color: '#56637F' }}>Rev.</th>
                    <th style={{ width: '26mm', textAlign: 'left', padding: '1mm', fontFamily: 'var(--sans)', fontSize: '7.8pt', color: '#56637F' }}>Data</th>
                    <th style={{ textAlign: 'left', padding: '1mm', fontFamily: 'var(--sans)', fontSize: '7.8pt', color: '#56637F' }}>Descrição</th>
                    <th style={{ width: '44mm', textAlign: 'left', padding: '1mm 0', fontFamily: 'var(--sans)', fontSize: '7.8pt', color: '#56637F' }}>Responsável</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '0.3pt solid #C5CEDD' }}>
                    <td style={{ padding: '1.5mm 0', fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '9pt', color: '#2459C8' }}>{revisao}</td>
                    <td style={{ padding: '1.5mm', fontFamily: 'var(--sans)', fontSize: '8.8pt', color: '#15264B' }}>{emitidoEm}</td>
                    <td style={{ padding: '1.5mm', fontFamily: 'var(--serif)', fontSize: '8.8pt', color: '#1F2B45' }}>Emissão inicial do laudo pericial</td>
                    <td style={{ padding: '1.5mm 0', fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '8.6pt', color: '#15264B' }}>Eng. Vitor Leonardo C. Linhares</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {renderControlFooter(2)}
        </section>
      )}

      {/* ==================== FOLHA 3: CHECKLIST NORMATIVO ==================== */}
      {(!folhaEspecifica || folhaEspecifica === 3) && (
        <section className="laudo-sheet" id="p3">
          {isMinuta && (
            <div className="minuta-banner">
              MINUTA ILUSTRATIVA · dados de exemplo, sem validade até a anexação da ART e a emissão
            </div>
          )}

          <div className="laudo-rh">
            <VlLogoVector style={{ width: '135px', height: '26px' }} />
            <div style={{ fontFamily: 'var(--sans)', fontWeight: 500, fontSize: '9pt', color: '#56637F' }}>
              <b>Laudo {numero}</b> &nbsp;Checklist normativo
            </div>
          </div>

          <div className="laudo-body">
            <h2 style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '20pt', color: '#15264B', margin: '0 0 2mm 0' }}>
              Checklist normativo
            </h2>
            <p style={{ fontFamily: 'var(--serif)', fontSize: '9.4pt', lineHeight: 1.45, color: '#1F2B45', margin: '0 0 4mm 0' }}>
              Resultados registrados em campo durante a vistoria de {dataVistoria} e vinculados ao equipamento {ativoTag}. Cada item verificado contém a respectiva referência normativa, observação pericial e registro fotográfico.
            </p>

            {/* Tabela do checklist */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '0.7pt solid #15264B' }}>
                  <th style={{ width: '9mm', textAlign: 'left', padding: '1.5mm 0', fontFamily: 'var(--sans)', fontSize: '7.8pt', color: '#56637F' }}>Nº</th>
                  <th style={{ textAlign: 'left', padding: '1.5mm 2mm', fontFamily: 'var(--sans)', fontSize: '7.8pt', color: '#56637F' }}>Requisito verificado</th>
                  <th style={{ width: '31mm', textAlign: 'left', padding: '1.5mm 2mm', fontFamily: 'var(--sans)', fontSize: '7.8pt', color: '#56637F' }}>Resultado</th>
                  <th style={{ width: '52mm', textAlign: 'left', padding: '1.5mm 2mm', fontFamily: 'var(--sans)', fontSize: '7.8pt', color: '#56637F' }}>Observação</th>
                  <th style={{ width: '13mm', textAlign: 'left', padding: '1.5mm 0', fontFamily: 'var(--sans)', fontSize: '7.8pt', color: '#56637F' }}>Foto</th>
                </tr>
              </thead>
              <tbody>
                {itensChecklist.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '0.3pt solid #C5CEDD' }}>
                    <td style={{ padding: '2.2mm 0', fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '9.6pt', color: '#2459C8' }}>{idx + 1}</td>
                    <td style={{ padding: '2.2mm 2mm', fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '9pt', color: '#15264B', lineHeight: 1.3 }}>
                      {item.descricao}
                      {item.criterioReferencia && (
                        <span style={{ display: 'block', fontSize: '7.6pt', color: '#56637F', fontWeight: 500, marginTop: '0.5mm' }}>
                          Norma: {item.criterioReferencia}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '2.2mm 2mm' }}>
                      {item.status === 'conforme' && (
                        <span className="chip-item ok">
                          <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
                          Conforme
                        </span>
                      )}
                      {item.status === 'nao_conforme' && (
                        <span className="chip-item nc">
                          <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2.6 2.6l6.8 6.8M9.4 2.6L2.6 9.4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
                          Não conforme
                        </span>
                      )}
                      {item.status === 'nao_aplicavel' && (
                        <span className="chip-item na">N.A.</span>
                      )}
                    </td>
                    <td style={{ padding: '2.2mm 2mm', fontFamily: 'var(--serif)', fontSize: '8.8pt', color: '#1F2B45' }}>
                      {item.observacao || '—'}
                    </td>
                    <td style={{ padding: '2.2mm 0', fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '8.4pt', color: '#2459C8' }}>
                      {item.status === 'nao_conforme' ? 'Foto 3' : (idx === 5 ? 'Fotos 4-6' : '—')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Barra de conformidade */}
            <div style={{
              display: 'flex',
              height: '3.2mm',
              marginTop: '3.5mm',
              border: '0.7pt solid #15264B'
            }}>
              <i style={{ display: 'block', width: `${percConformes}%`, background: '#167A52' }} />
              <i style={{ display: 'block', width: `${percNaoConformes}%`, background: '#B3322A' }} />
            </div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '8.5pt', color: '#56637F', marginTop: '1.5mm' }}>
              {totalConformes} de {totalVerificados} itens conformes ({Math.round(percConformes)}%). Resultados possíveis: <b>Conforme</b>, <b>Não conforme</b> e <b>Não aplicável</b>.
            </p>

            {/* Critérios de classificação de risco */}
            <div style={{ marginTop: '6mm' }}>
              <h3 style={{
                fontFamily: 'var(--sans)',
                fontWeight: 700,
                fontSize: '11.5pt',
                color: '#15264B',
                borderBottom: '0.7pt solid #15264B',
                paddingBottom: '1mm',
                marginBottom: '2mm'
              }}>
                Classificação de risco das não conformidades
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {[
                    { r: 'b', label: 'Baixo', desc: 'Não compromete a segurança imediata. Corrigir na próxima manutenção programada.' },
                    { r: 'm', label: 'Médio', desc: 'Reduz a margem de segurança. Corrigir dentro do prazo definido no plano de ação, mantendo o uso com restrição.' },
                    { r: 'a', label: 'Alto', desc: 'Risco relevante de acidente. Corrigir antes de retomar o uso normal do equipamento.' },
                    { r: 'c', label: 'Crítico', desc: 'Risco grave e iminente de acidente ou colapso. Interdição imediata do ativo até a correção.' },
                  ].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '0.3pt solid #C5CEDD' }}>
                      <th style={{ width: '28mm', padding: '1.8mm 2mm 1.8mm 0', textAlign: 'left' }}>
                        <span className={`risk-badge ${row.r}`}>{row.label}</span>
                      </th>
                      <td style={{ padding: '1.8mm 0', fontFamily: 'var(--serif)', fontSize: '9pt', color: '#1F2B45' }}>
                        {row.desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '8.2pt', color: '#56637F', marginTop: '1.8mm' }}>
                Critérios de classificação padrão da VL Engenharia, calibrados para normas ABNT e Normas Regulamentadoras.
              </p>
            </div>
          </div>

          {renderControlFooter(3)}
        </section>
      )}

      {/* ==================== FOLHA 4: CONSTATAÇÕES TÉCNICAS (ITENS 1 E 2) ==================== */}
      {(!folhaEspecifica || folhaEspecifica === 4) && (
        <section className="laudo-sheet" id="p4">
          {isMinuta && (
            <div className="minuta-banner">
              MINUTA ILUSTRATIVA · dados de exemplo, sem validade até a anexação da ART e a emissão
            </div>
          )}

          <div className="laudo-rh">
            <VlLogoVector style={{ width: '135px', height: '26px' }} />
            <div style={{ fontFamily: 'var(--sans)', fontWeight: 500, fontSize: '9pt', color: '#56637F' }}>
              <b>Laudo {numero}</b> &nbsp;Constatações técnicas por item
            </div>
          </div>

          <div className="laudo-body">
            {/* Item 1 */}
            <div style={{ paddingBottom: '4mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '5mm' }}>
                <div>
                  <span style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '7.6pt', color: '#56637F', fontWeight: 600 }}>
                    Item 1 de 4
                  </span>
                  <h4 style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '13.5pt', color: '#15264B', margin: '0.8mm 0 0 0' }}>
                    {secoesConstatacoes[0]?.titulo || 'Verificação dos estabilizadores e chassi de montagem'}
                  </h4>
                </div>
                <span className="chip-item ok">
                  <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
                  Conforme
                </span>
              </div>
              <div
                style={{ fontFamily: 'var(--serif)', fontSize: '9.2pt', lineHeight: 1.45, color: '#1F2B45', marginTop: '2mm' }}
                dangerouslySetInnerHTML={{ __html: secoesConstatacoes[0]?.conteudoHtml || '' }}
              />
              <div style={{ fontFamily: 'var(--sans)', fontSize: '8.4pt', color: '#56637F', marginTop: '1.6mm' }}>
                <b>Critério de referência:</b> {secoesConstatacoes[0]?.criterioReferencia || 'NR-11 · NBR 8400'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4mm', marginTop: '3mm' }}>
                <div style={{ border: '0.3pt solid #C5CEDD', background: '#F1F4F9', padding: '1mm' }}>
                  <div style={{ height: '56mm', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {secoesConstatacoes[0]?.fotos?.[0]?.url ? (
                      <img src={secoesConstatacoes[0].fotos[0].url} alt="Foto 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '8.5pt', color: '#56637F', background: '#fff', padding: '1mm 3mm' }}>FOTO 1</span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '8pt', color: '#56637F', marginTop: '1.2mm' }}>
                    <b>Foto 1.</b> {secoesConstatacoes[0]?.fotos?.[0]?.legenda || 'Estabilizadores estendidos com travas operacionais e cilindros estanques.'}
                  </div>
                </div>
                <div style={{ border: '0.3pt solid #C5CEDD', background: '#F1F4F9', padding: '1mm' }}>
                  <div style={{ height: '56mm', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {secoesConstatacoes[0]?.fotos?.[1]?.url ? (
                      <img src={secoesConstatacoes[0].fotos[1].url} alt="Foto 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '8.5pt', color: '#56637F', background: '#fff', padding: '1mm 3mm' }}>FOTO 2</span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '8pt', color: '#56637F', marginTop: '1.2mm' }}>
                    <b>Foto 2.</b> {secoesConstatacoes[0]?.fotos?.[1]?.legenda || 'Fixação do chassi de montagem às longarinas do caminhão.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Separador */}
            <div style={{ borderTop: '1.4pt solid #15264B', margin: '2mm 0 4mm 0' }} />

            {/* Item 2 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '5mm' }}>
                <div>
                  <span style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '7.6pt', color: '#56637F', fontWeight: 600 }}>
                    Item 2 de 4
                  </span>
                  <h4 style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '13.5pt', color: '#15264B', margin: '0.8mm 0 0 0' }}>
                    {secoesConstatacoes[1]?.titulo || 'Exame dos acessórios de içamento (ganchos, cabos, moitões)'}
                  </h4>
                </div>
                <span className="chip-item ok">
                  <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
                  Conforme
                </span>
              </div>
              <div
                style={{ fontFamily: 'var(--serif)', fontSize: '9.2pt', lineHeight: 1.45, color: '#1F2B45', marginTop: '2mm' }}
                dangerouslySetInnerHTML={{ __html: secoesConstatacoes[1]?.conteudoHtml || '' }}
              />
              <div style={{ fontFamily: 'var(--sans)', fontSize: '8.4pt', color: '#56637F', marginTop: '1.6mm' }}>
                <b>Critério de referência:</b> {secoesConstatacoes[1]?.criterioReferencia || 'NR-11 · NBR 8400'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4mm', marginTop: '3mm' }}>
                <div style={{ border: '0.3pt solid #C5CEDD', background: '#F1F4F9', padding: '1mm' }}>
                  <div style={{ height: '56mm', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {secoesConstatacoes[1]?.fotos?.[0]?.url ? (
                      <img src={secoesConstatacoes[1].fotos[0].url} alt="Foto 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '8.5pt', color: '#56637F', background: '#fff', padding: '1mm 3mm' }}>FOTO</span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '8pt', color: '#56637F', marginTop: '1.2mm' }}>
                    <b>Foto.</b> {secoesConstatacoes[1]?.fotos?.[0]?.legenda || 'Gancho forjado com trava de segurança tipo mola operante.'}
                  </div>
                </div>
                <div style={{ border: '0.3pt solid #C5CEDD', background: '#F1F4F9', padding: '1mm' }}>
                  <div style={{ height: '56mm', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {secoesConstatacoes[1]?.fotos?.[1]?.url ? (
                      <img src={secoesConstatacoes[1].fotos[1].url} alt="Foto 4" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '8.5pt', color: '#56637F', background: '#fff', padding: '1mm 3mm' }}>FOTO</span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '8pt', color: '#56637F', marginTop: '1.2mm' }}>
                    <b>Foto.</b> {secoesConstatacoes[1]?.fotos?.[1]?.legenda || 'Moitão e polias de direcionamento de cabo sem folgas.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {renderControlFooter(4)}
        </section>
      )}

      {/* ==================== FOLHA 5: CONSTATAÇÕES TÉCNICAS (ITENS 3 E 4) + COMPLEMENTAR ==================== */}
      {(!folhaEspecifica || folhaEspecifica === 5) && (
        <section className="laudo-sheet" id="p5">
          {isMinuta && (
            <div className="minuta-banner">
              MINUTA ILUSTRATIVA · dados de exemplo, sem validade até a anexação da ART e a emissão
            </div>
          )}

          <div className="laudo-rh">
            <VlLogoVector style={{ width: '135px', height: '26px' }} />
            <div style={{ fontFamily: 'var(--sans)', fontWeight: 500, fontSize: '9pt', color: '#56637F' }}>
              <b>Laudo {numero}</b> &nbsp;Constatações técnicas por item
            </div>
          </div>

          <div className="laudo-body">
            {/* Item 3 com NC */}
            <div style={{ paddingBottom: '3.5mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '5mm' }}>
                <div>
                  <span style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '7.6pt', color: '#56637F', fontWeight: 600 }}>
                    Item 3 de 4
                  </span>
                  <h4 style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '13.5pt', color: '#15264B', margin: '0.8mm 0 0 0' }}>
                    {secoesConstatacoes[2]?.titulo || 'Inspeção do posto de comando e alavancas'}
                  </h4>
                </div>
                <span className="chip-item nc">
                  <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2.6 2.6l6.8 6.8M9.4 2.6L2.6 9.4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
                  Não conforme · NC-01
                </span>
              </div>
              <div
                style={{ fontFamily: 'var(--serif)', fontSize: '9.2pt', lineHeight: 1.45, color: '#1F2B45', marginTop: '2mm' }}
                dangerouslySetInnerHTML={{ __html: secoesConstatacoes[2]?.conteudoHtml || '' }}
              />
              <div style={{ fontFamily: 'var(--sans)', fontSize: '8.4pt', color: '#56637F', marginTop: '1.6mm' }}>
                <b>Critério de referência:</b> {secoesConstatacoes[2]?.criterioReferencia || 'NR-11 · NBR 8400 · Origem: checklist, item 5'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4mm', marginTop: '2.5mm' }}>
                <div style={{ border: '0.3pt solid #C5CEDD', background: '#F1F4F9', padding: '1mm' }}>
                  <div style={{ height: '48mm', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {secoesConstatacoes[2]?.fotos?.[0]?.url ? (
                      <img src={secoesConstatacoes[2].fotos[0].url} alt="Foto 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '8.5pt', color: '#56637F', background: '#fff', padding: '1mm 3mm' }}>FOTO 3</span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '8pt', color: '#56637F', marginTop: '1mm' }}>
                    <b>Foto 3.</b> {secoesConstatacoes[2]?.fotos?.[0]?.legenda || 'Posto de comando com desgaste nas etiquetas indicativas de comando.'}
                  </div>
                </div>
                <div style={{ border: '0.3pt solid #C5CEDD', background: '#F1F4F9', padding: '1mm' }}>
                  <div style={{ height: '48mm', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {secoesConstatacoes[2]?.fotos?.[1]?.url ? (
                      <img src={secoesConstatacoes[2].fotos[1].url} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '8.5pt', color: '#56637F', background: '#fff', padding: '1mm 3mm' }}>FOTO</span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '8pt', color: '#56637F', marginTop: '1mm' }}>
                    <b>Foto.</b> {secoesConstatacoes[2]?.fotos?.[1]?.legenda || 'Detalhe da placa de advertência com desgaste superficial a ser reposta.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Separador */}
            <div style={{ borderTop: '1.4pt solid #15264B', margin: '2mm 0 3.5mm 0' }} />

            {/* Item 4 */}
            <div style={{ paddingBottom: '3.5mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '5mm' }}>
                <div>
                  <span style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '7.6pt', color: '#56637F', fontWeight: 600 }}>
                    Item 4 de 4
                  </span>
                  <h4 style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '13.5pt', color: '#15264B', margin: '0.8mm 0 0 0' }}>
                    {secoesConstatacoes[3]?.titulo || 'Parecer de liberação para obras e indústrias'}
                  </h4>
                </div>
                <span className="chip-item rs">
                  <svg width="10" height="10" viewBox="0 0 12 12"><path d="M6 1.6L11 10.4H1z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M6 5v2.4M6 8.6v.1" stroke="currentColor" strokeWidth="1.5"/></svg>
                  Liberado com restrições
                </span>
              </div>
              <div
                style={{ fontFamily: 'var(--serif)', fontSize: '9.2pt', lineHeight: 1.45, color: '#1F2B45', marginTop: '2mm' }}
                dangerouslySetInnerHTML={{ __html: secoesConstatacoes[3]?.conteudoHtml || '' }}
              />
            </div>

            {/* Registro fotográfico complementar em grid de 3 */}
            <div style={{ marginTop: '2mm' }}>
              <h3 style={{
                fontFamily: 'var(--sans)',
                fontWeight: 700,
                fontSize: '11.5pt',
                color: '#15264B',
                borderBottom: '0.7pt solid #15264B',
                paddingBottom: '1mm',
                marginBottom: '2mm'
              }}>
                Registro fotográfico complementar
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3.5mm' }}>
                <div style={{ border: '0.3pt solid #C5CEDD', background: '#F1F4F9', padding: '1mm' }}>
                  <div style={{ height: '34mm', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {secoesConstatacoes[3]?.fotos?.[0]?.url ? (
                      <img src={secoesConstatacoes[3].fotos[0].url} alt="Foto 4" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '8pt', color: '#56637F', background: '#fff', padding: '0.8mm 2mm' }}>FOTO 4</span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '7.8pt', color: '#56637F', marginTop: '1mm' }}>
                    <b>Foto 4.</b> Vista geral do ativo.
                  </div>
                </div>
                <div style={{ border: '0.3pt solid #C5CEDD', background: '#F1F4F9', padding: '1mm' }}>
                  <div style={{ height: '34mm', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {secoesConstatacoes[3]?.fotos?.[1]?.url ? (
                      <img src={secoesConstatacoes[3].fotos[1].url} alt="Foto 5" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '8pt', color: '#56637F', background: '#fff', padding: '0.8mm 2mm' }}>FOTO 5</span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '7.8pt', color: '#56637F', marginTop: '1mm' }}>
                    <b>Foto 5.</b> Placa de identificação.
                  </div>
                </div>
                <div style={{ border: '0.3pt solid #C5CEDD', background: '#F1F4F9', padding: '1mm' }}>
                  <div style={{ height: '34mm', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {secoesConstatacoes[3]?.fotos?.[2]?.url ? (
                      <img src={secoesConstatacoes[3].fotos[2].url} alt="Foto 6" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '8pt', color: '#56637F', background: '#fff', padding: '0.8mm 2mm' }}>FOTO 6</span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '7.8pt', color: '#56637F', marginTop: '1mm' }}>
                    <b>Foto 6.</b> Ponto de aterramento.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {renderControlFooter(5)}
        </section>
      )}

      {/* ==================== FOLHA 6: NÃO CONFORMIDADES, PARECER, ASSINATURA & AUTENTICIDADE ==================== */}
      {(!folhaEspecifica || folhaEspecifica === 6) && (
        <section className="laudo-sheet" id="p6">
          {isMinuta && (
            <div className="minuta-banner">
              MINUTA ILUSTRATIVA · dados de exemplo, sem validade até a anexação da ART e a emissão
            </div>
          )}

          <div className="laudo-rh">
            <VlLogoVector style={{ width: '135px', height: '26px' }} />
            <div style={{ fontFamily: 'var(--sans)', fontWeight: 500, fontSize: '9pt', color: '#56637F' }}>
              <b>Laudo {numero}</b> &nbsp;Não conformidades, parecer e assinatura
            </div>
          </div>

          <div className="laudo-body">
            <h2 style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '20pt', color: '#15264B', margin: '0 0 3mm 0' }}>
              Não conformidades e plano de ação
            </h2>

            {/* Tabela de Não Conformidades */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '0.7pt solid #15264B' }}>
                  <th style={{ width: '14mm', textAlign: 'left', padding: '1.2mm 0', fontFamily: 'var(--sans)', fontSize: '7.8pt', color: '#56637F' }}>ID</th>
                  <th style={{ textAlign: 'left', padding: '1.2mm 2mm', fontFamily: 'var(--sans)', fontSize: '7.8pt', color: '#56637F' }}>Não conformidade</th>
                  <th style={{ width: '19mm', textAlign: 'left', padding: '1.2mm 2mm', fontFamily: 'var(--sans)', fontSize: '7.8pt', color: '#56637F' }}>Risco</th>
                  <th style={{ width: '48mm', textAlign: 'left', padding: '1.2mm 2mm', fontFamily: 'var(--sans)', fontSize: '7.8pt', color: '#56637F' }}>Ação recomendada</th>
                  <th style={{ width: '20mm', textAlign: 'left', padding: '1.2mm 2mm', fontFamily: 'var(--sans)', fontSize: '7.8pt', color: '#56637F' }}>Prazo</th>
                  <th style={{ width: '15mm', textAlign: 'left', padding: '1.2mm 0', fontFamily: 'var(--sans)', fontSize: '7.8pt', color: '#56637F' }}>Ref.</th>
                </tr>
              </thead>
              <tbody>
                {naoConformidades.map((nc, idx) => (
                  <tr key={idx} style={{ borderBottom: '0.3pt solid #C5CEDD' }}>
                    <td style={{ padding: '2mm 0', fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '9.6pt', color: '#2459C8' }}>{nc.id}</td>
                    <td style={{ padding: '2mm 2mm', fontFamily: 'var(--serif)', fontSize: '8.9pt', color: '#1F2B45', lineHeight: 1.35 }}>{nc.titulo}</td>
                    <td style={{ padding: '2mm 2mm' }}>
                      <span className={`risk-badge ${nc.risco === 'baixo' ? 'b' : nc.risco === 'medio' ? 'm' : nc.risco === 'alto' ? 'a' : 'c'}`}>
                        {nc.risco === 'baixo' ? 'Baixo' : nc.risco === 'medio' ? 'Médio' : nc.risco === 'alto' ? 'Alto' : 'Crítico'}
                      </span>
                    </td>
                    <td style={{ padding: '2mm 2mm', fontFamily: 'var(--serif)', fontSize: '8.8pt', color: '#1F2B45', lineHeight: 1.35 }}>{nc.acaoRecomendada}</td>
                    <td style={{ padding: '2mm 2mm', fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '9pt', color: '#15264B' }}>{nc.prazo}</td>
                    <td style={{ padding: '2mm 0', fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '8.4pt', color: '#56637F', lineHeight: 1.2 }}>{nc.itemRef}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Parecer Conclusivo */}
            <div style={{ marginTop: '5.5mm' }}>
              <h3 style={{
                fontFamily: 'var(--sans)',
                fontWeight: 700,
                fontSize: '11.5pt',
                color: '#15264B',
                borderBottom: '0.7pt solid #15264B',
                paddingBottom: '1mm',
                marginBottom: '2mm'
              }}>
                Parecer conclusivo
              </h3>
              <div style={{
                borderLeft: '1.4pt solid #F2A900',
                padding: '0.6mm 0 0.6mm 4mm'
              }}>
                <p style={{ fontFamily: 'var(--serif)', fontSize: '9.3pt', lineHeight: 1.48, color: '#1F2B45', margin: 0 }}>
                  <b>Liberado com restrições.</b> Com base nas inspeções visuais, verificações dimensionais e análises de conformidade realizadas no equipamento {ativoTag}, atesta-se que as condições operacionais foram diagnosticadas e confrontadas com as normas técnicas da ABNT e Normas Regulamentadoras vigentes.
                </p>
                <p style={{ fontFamily: 'var(--serif)', fontSize: '9.3pt', lineHeight: 1.48, color: '#1F2B45', marginTop: '1.6mm' }}>
                  As não conformidades apontadas neste laudo demandam cumprimento rigoroso do plano de ação e dos prazos recomendados pela equipe técnica, para garantia da integridade física e da segurança operacional dos trabalhadores.
                </p>
              </div>

              {/* Quadro de datas e validade */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.3pt',
                background: '#C5CEDD',
                borderTop: '0.7pt solid #15264B',
                borderBottom: '0.3pt solid #C5CEDD',
                marginTop: '3.4mm'
              }}>
                <div style={{ background: '#fff', padding: '2mm 3mm' }}>
                  <span style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '7.5pt', color: '#56637F' }}>Vistoria realizada em</span>
                  <b style={{ display: 'block', fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '12pt', color: '#15264B', marginTop: '0.5mm' }}>{dataVistoria}</b>
                </div>
                <div style={{ background: '#fff', padding: '2mm 3mm' }}>
                  <span style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '7.5pt', color: '#56637F' }}>Prazo da NC-01</span>
                  <b style={{ display: 'block', fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '12pt', color: '#15264B', marginTop: '0.5mm' }}>até 30 dias</b>
                </div>
                <div style={{ background: '#fff', padding: '2mm 3mm' }}>
                  <span style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '7.5pt', color: '#56637F' }}>Próxima inspeção recomendada</span>
                  <b style={{ display: 'block', fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '12pt', color: '#15264B', marginTop: '0.5mm' }}>{proximaInspecao}</b>
                </div>
              </div>
            </div>

            {/* Responsável Técnico */}
            <div style={{ marginTop: '5mm' }}>
              <h3 style={{
                fontFamily: 'var(--sans)',
                fontWeight: 700,
                fontSize: '11.5pt',
                color: '#15264B',
                borderBottom: '0.7pt solid #15264B',
                paddingBottom: '1mm',
                marginBottom: '2mm'
              }}>
                Responsável técnico
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '6mm', alignItems: 'end' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '18mm 1fr', gap: '3.4mm', alignItems: 'center' }}>
                  <div style={{ width: '18mm', height: '22mm', background: '#E2E8F0', borderBottom: '1.4pt solid #15264B', overflow: 'hidden' }}>
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80"
                      alt="Engenheiro"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <b style={{ display: 'block', fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '11pt', color: '#15264B' }}>
                      Eng. Vitor Leonardo C. Linhares
                    </b>
                    <span style={{ display: 'block', fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '8.6pt', color: '#2459C8' }}>
                      CREA-PE 182229949-0
                    </span>
                    <span style={{ display: 'block', fontFamily: 'var(--serif)', fontSize: '8.2pt', color: '#56637F' }}>
                      Engenheiro Mecânico e de Segurança do Trabalho
                    </span>
                  </div>
                </div>
                <div>
                  <div style={{ height: '13mm', borderBottom: '0.7pt solid #15264B', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'var(--sans)', fontStyle: 'italic', fontSize: '9pt', color: '#2459C8' }}>
                      Vitor Leonardo C. Linhares
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '8.2pt', color: '#56637F', marginTop: '1.2mm', textAlign: 'center' }}>
                    Assinatura do responsável técnico<br />
                    Recife/PE, {emitidoEm}
                  </div>
                </div>
              </div>
            </div>

            {/* Bloco de Autenticidade com QR Code SVG */}
            <div style={{ marginTop: '5mm' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '27mm 1fr',
                gap: '4mm',
                alignItems: 'center',
                background: '#F1F4F9',
                padding: '3mm 3.6mm',
                border: '0.3pt solid #C5CEDD'
              }}>
                <div style={{ width: '27mm', height: '27mm', background: '#fff', padding: '1.8mm', border: '0.3pt solid #C5CEDD' }}>
                  {qrCodeSvg ? (
                    <div dangerouslySetInnerHTML={{ __html: qrCodeSvg }} style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6pt', color: '#56637F' }}>QR CODE</div>
                  )}
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '10.4pt', color: '#15264B', margin: '0 0 1mm 0' }}>
                    Autenticidade deste laudo
                  </h4>
                  <div style={{ display: 'flex', gap: '3mm', fontFamily: 'var(--sans)', fontSize: '8.8pt', color: '#15264B', marginTop: '0.8mm' }}>
                    <span style={{ color: '#56637F', minWidth: '27mm' }}>Código de verificação:</span>
                    <b style={{ letterSpacing: '0.02em', color: '#2459C8' }}>{codigoVerificacao}</b>
                  </div>
                  <div style={{ display: 'flex', gap: '3mm', fontFamily: 'var(--sans)', fontSize: '8.8pt', color: '#15264B', marginTop: '0.8mm' }}>
                    <span style={{ color: '#56637F', minWidth: '27mm' }}>ART CREA-PE:</span>
                    <b>{artNumero}</b>
                  </div>
                  <div style={{ display: 'flex', gap: '3mm', fontFamily: 'var(--sans)', fontSize: '8.8pt', color: '#15264B', marginTop: '0.8mm' }}>
                    <span style={{ color: '#56637F', minWidth: '27mm' }}>Endereço público:</span>
                    <b style={{ fontSize: '8.2pt', color: '#15264B' }}>vlengenhariamecanica.com.br/verificar</b>
                  </div>
                  <p style={{ fontFamily: 'var(--serif)', fontSize: '8.2pt', lineHeight: 1.4, color: '#56637F', margin: '1.4mm 0 0 0' }}>
                    Leia o QR Code ou informe o código no endereço acima para confirmar que este laudo foi emitido pela VL Engenharia, a revisão vigente e a situação da ART.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {renderControlFooter(6)}
        </section>
      )}
    </div>
  );
};
