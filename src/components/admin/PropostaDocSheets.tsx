import React, { useMemo, useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Orcamento, Cliente, Ativo, OrcamentoItemCalculo } from '../../types';
import { 
  DADOS_VL_PADRAO, 
  formatarDataBrasileira, 
  calcularValidadeAte, 
  obterDescricaoAtivosUnificada,
  obterTituloLaudoProposta,
  FASES_METODOLOGIA_PADRAO
} from '../../lib/orcamentoTemplatePadrao';
import { gerarPixCopiaECola } from '../../lib/pixEmv';
import { VlLogoVector } from './PropostaViewerModal';

export interface PropostaDocSheetsProps {
  orcamento: Orcamento;
  cliente?: Cliente;
  ativo?: Ativo;
  modo?: 'executiva' | 'completa';
  folhaEspecifica?: number; // 1, 2, 3, 4, 5, 6 ou undefined para todas
  embutidoNoModal?: boolean;
}

export const PropostaDocSheets: React.FC<PropostaDocSheetsProps> = ({
  orcamento,
  cliente,
  ativo,
  modo = 'executiva',
  folhaEspecifica,
  embutidoNoModal = false,
}) => {
  const [qrCodeSvg, setQrCodeSvg] = useState<string>('');
  const [pixPayload, setPixPayload] = useState<string>('');
  const [copiadoPix, setCopiadoPix] = useState(false);

  // Informações do Contratante e da Proposta
  const codigo = orcamento.codigoProposta || orcamento.id || 'PROP-2026/001';
  const revisao = orcamento.revisao || '00';
  const emitidaEm = orcamento.emitidaEm || formatarDataBrasileira(orcamento.criadoEm);
  const validadeDias = orcamento.validadeDias || 15;
  const validaAte = orcamento.validaAte || calcularValidadeAte(emitidaEm, validadeDias);

  const clienteNome = orcamento.clienteNome || cliente?.nomeFantasia || cliente?.razaoSocial || 'Cliente Contratante';
  const cnpjCliente = orcamento.cnpjCliente || cliente?.cpfCnpj || cliente?.cnpj || 'A preencher';
  const primeiroContato = cliente?.contatos?.[0];
  const representanteNome = orcamento.representanteNome || primeiroContato?.nome || 'Diretoria / Coordenação Técnica';
  const localidadeServico = orcamento.localidadeServico || (cliente?.endereco?.cidade ? `${cliente.endereco.cidade}, ${cliente.endereco.estado || 'PE'}` : 'Recife / Região Metropolitana, PE');
  const emailCliente = orcamento.emailCliente || primeiroContato?.email || 'comercial@cliente.com.br';
  const telefoneCliente = orcamento.telefoneCliente || primeiroContato?.telefone || '(81) 98444-2592';

  const servicoTitulo = orcamento.servico || 'Laudo de Análise e Conformidade de Engenharia Mecânica';
  const tituloLaudoDestaque = obterTituloLaudoProposta(orcamento);
  const ativosDescricao = obterDescricaoAtivosUnificada(orcamento, { ativo });
  const prazoEntrega = orcamento.prazoEntrega || `${orcamento.prazoDias || 7} dias úteis`;
  const valorTotalNum = orcamento.valor || 2280;
  const valorTotalFormatado = orcamento.valorFormatado || valorTotalNum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const condicoesPagamento = orcamento.condicoesPagamento || '50% na aprovação da proposta e 50% após emissão do laudo e ART.';
  const normasTecnicas = orcamento.normasTecnicas || 'ABNT NBR, NR-10, NR-11, NR-12 e NR-13 conforme aplicável';
  const descricaoEscopo = orcamento.descricaoEscopo || 'Prestação de serviços especializados em Engenharia Mecânica, diagnóstico de integridade estrutural, verificação de conformidade com as Normas Regulamentadoras federais (ABNT / Ministério do Trabalho) e emissão de Anotação de Responsabilidade Técnica (ART) oficial junto ao CREA-PE.';

  // Memorial de Cálculo dinâmico
  const itensCalculo = useMemo(() => {
    if (orcamento.itensCalculo && orcamento.itensCalculo.length > 0) {
      return orcamento.itensCalculo;
    }
    return [
      {
        id: 'item-1',
        descricao: servicoTitulo,
        quantidade: 1,
        valorUnitario: valorTotalNum,
        valorTotal: valorTotalNum,
      }
    ];
  }, [orcamento.itensCalculo, servicoTitulo, valorTotalNum]);

  // Metodologia em etapas dinâmica
  const fasesMetodologia = useMemo(() => {
    const fasesBase = (orcamento.metodologiaFases && orcamento.metodologiaFases.length > 0)
      ? orcamento.metodologiaFases
      : FASES_METODOLOGIA_PADRAO;
    const ativas = fasesBase.filter(f => f.ativa !== false);
    return ativas.length > 0 ? ativas : fasesBase;
  }, [orcamento.metodologiaFases]);

  const tituloMetodologia = orcamento.tituloMetodologia || 'Metodologia de engenharia em etapas';

  // Parcelas (50% / 50%)
  const parcelas = useMemo(() => {
    if (orcamento.parcelas && orcamento.parcelas.length > 0) {
      return orcamento.parcelas;
    }
    const metade = valorTotalNum / 2;
    return [
      { parcela: '1ª', quando: 'Na aprovação da proposta comercial', percentual: 50, valor: metade },
      { parcela: '2ª', quando: 'Após emissão do laudo técnico pericial e registro da ART no CREA-PE', percentual: 50, valor: metade }
    ];
  }, [orcamento.parcelas, valorTotalNum]);

  // Total de folhas conforme modo
  const totalFolhas = modo === 'completa' ? 6 : 4;

  // Geração do QR Code e Copia e Cola do PIX (EMV rigoroso padrão Bacen)
  useEffect(() => {
    const chavePix = orcamento.chavePix || DADOS_VL_PADRAO.pixChave;
    const titular = DADOS_VL_PADRAO.pixTitular;
    const cidade = DADOS_VL_PADRAO.pixCidade;
    const primeiraParcelaValor = parcelas[0]?.valor || (valorTotalNum / 2);

    const pixCode = gerarPixCopiaECola({
      chavePix,
      valor: primeiraParcelaValor,
      titular,
      cidade,
      identificador: codigo.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20) || 'PROP2026',
    });

    setPixPayload(pixCode);

    QRCode.toString(pixCode, {
      type: 'svg',
      margin: 4,
      color: {
        dark: '#15264B',
        light: '#FFFFFF'
      }
    })
      .then(svg => setQrCodeSvg(svg))
      .catch(err => console.error('Erro ao gerar QR Code SVG no modal:', err));
  }, [orcamento.chavePix, parcelas, valorTotalNum, codigo]);

  const handleCopiarPix = () => {
    if (!pixPayload) return;
    navigator.clipboard.writeText(pixPayload);
    setCopiadoPix(true);
    setTimeout(() => setCopiadoPix(false), 2500);
  };

  const renderFolha1 = (
    <section className="sheet cover" id="p1" key="folha-1">
      <div className="ch">
        <VlLogoVector className="h-9 w-auto" style={{ width: '180px', height: '36px' }} />
        <div className="meta">
          Proposta <b>{codigo}</b> · Rev. <b>{revisao}</b><br />
          Emissão: {emitidaEm} · Validade: {validaAte}
        </div>
      </div>

      <div className="top">
        <h1>{servicoTitulo}</h1>
        <div className="sub">{tituloLaudoDestaque}</div>
        <p className="lead">{descricaoEscopo}</p>
      </div>

      <div className="mid">
        <div>
          <h3>Nesta proposta</h3>
          <ol className="idx">
            <li>
              <span className="e">Etapa 1</span>
              <a href="#p2">
                <span className="t">Relação dos serviços</span>
                <span className="d">Partes, normas técnicas associadas, escopo preliminar, levantamento fotográfico e o que está incluído.</span>
              </a>
              <span className="p">p. 2</span>
            </li>
            <li>
              <span className="e">Etapa 2</span>
              <a href="#p3">
                <span className="t">Escopo técnico das atividades</span>
                <span className="d">Metodologia em etapas sequenciais, checklists normativos, ensaios instrumentados e condições de acesso.</span>
              </a>
              <span className="p">p. 3</span>
            </li>
            <li>
              <span className="e">Etapa 3</span>
              <a href="#p4">
                <span className="t">Prazo, pagamento e investimento</span>
                <span className="d">Cronograma executivo, pagamento em 2 parcelas, PIX, homologação com ART e aceite.</span>
              </a>
              <span className="p">p. 4</span>
            </li>
            {modo === 'completa' && (
              <li>
                <span className="e">Anexo</span>
                <a href="#p5">
                  <span className="t">Sobre a VL Engenharia</span>
                  <span className="d">Responsável técnico, princípios, soluções, serviços e contatos.</span>
                </a>
                <span className="p">p. 5–6</span>
              </li>
            )}
          </ol>
        </div>
        <div className="approve">
          <h3>Como aprovar</h3>
          <ol>
            <li>
              <span className="n">1</span>
              <p><b>Confirme o aceite.</b> Responda “de acordo” por e-mail ou WhatsApp, ou assine na página 4.</p>
            </li>
            <li>
              <span className="n">2</span>
              <p><b>Pague a 1ª parcela (50%).</b> PIX com QR Code e “copia e cola” na página 4.</p>
            </li>
            <li>
              <span className="n">3</span>
              <p><b>Agendamos a vistoria.</b> Mobilização em até 48 h úteis; laudo com ART em {prazoEntrega} após a vistoria.</p>
            </li>
          </ol>
        </div>
      </div>

      <div className="tb">
        <div className="c8">
          <span className="k">Contratante</span>
          <span className="v">{clienteNome}</span>
        </div>
        <div className="c4">
          <span className="k">CNPJ / CPF</span>
          <span className="v">{cnpjCliente}</span>
        </div>

        <div className="c4">
          <span className="k">Representante / contato</span>
          <span className="v">{representanteNome}</span>
        </div>
        <div className="c4">
          <span className="k">Localidade / unidade</span>
          <span className="v">{localidadeServico}</span>
        </div>
        <div className="c2">
          <span className="k">Código</span>
          <span className="v font-mono">{codigo}</span>
        </div>
        <div className="c2">
          <span className="k">Validade até</span>
          <span className="v font-mono">{validaAte}</span>
        </div>

        <div className="c6">
          <span className="k">Serviço</span>
          <span className="v">{servicoTitulo}</span>
        </div>
        <div className="c3">
          <span className="k">Ativos</span>
          <span className="v">{ativosDescricao}</span>
        </div>
        <div className="c3">
          <span className="k">Responsável técnico</span>
          <span className="v sm2">{DADOS_VL_PADRAO.responsavelTecnico}<br />CREA-PE {DADOS_VL_PADRAO.crea}</span>
        </div>

        <div className="c3">
          <span className="k">Prazo de conclusão</span>
          <span className="big">{prazoEntrega}</span>
          <span className="cap">a partir da vistoria in loco</span>
        </div>
        <div className="c4">
          <span className="k">Pagamento</span>
          <span className="big">50% + 50%</span>
          <span className="cap">na aprovação e após laudo e ART</span>
        </div>
        <div className="c5 price">
          <span className="k">Investimento total</span>
          <span className="n">{valorTotalFormatado}</span>
          <div className="dim">
            <svg viewBox="0 0 8 8"><path d="M0 4L7 .8V7.2Z"/></svg>
            <i></i>
            <svg viewBox="0 0 8 8"><path d="M8 4L1 .8V7.2Z"/></svg>
          </div>
          <span className="cap">
            {orcamento.incluiNotaFiscal !== false ? 'NFS-e e taxa de ART inclusas' : 'Recibo de autônomo e ART inclusa'}
          </span>
        </div>
      </div>

      <div className="ft">
        <span>{DADOS_VL_PADRAO.razaoSocial}<em style={{ fontStyle: 'normal' }}>{DADOS_VL_PADRAO.sede}</em></span>
        <span>
          <a href={`https://wa.me/${DADOS_VL_PADRAO.telefoneLink}`}>{DADOS_VL_PADRAO.telefone}</a>
          <a href={`mailto:${DADOS_VL_PADRAO.email}`}>{DADOS_VL_PADRAO.email}</a>
        </span>
      </div>
    </section>
  );

  const renderFolha2 = (
    <section className="sheet" id="p2" key="folha-2">
      <div className="rh">
        <VlLogoVector className="h-7 w-auto" style={{ width: '135px', height: '26px' }} />
        <div className="where"><b>Etapa 1 de 3</b> Relação dos serviços e levantamento fotográfico</div>
      </div>
      <div className="body">
        <h2>Partes, serviço e normas de referência</h2>

        <div className="blk tight">
          <h3>Identificação das partes</h3>
          <div className="cols2">
            <div>
              <h4 className="font-bold text-xs text-[#0B1E3D] mb-1">Contratada</h4>
              <table className="kv">
                <tbody>
                  <tr><th>Razão social</th><td>{DADOS_VL_PADRAO.razaoSocial}</td></tr>
                  <tr><th>CNPJ</th><td>{DADOS_VL_PADRAO.cnpj}</td></tr>
                  <tr><th>Responsável técnico</th><td>{DADOS_VL_PADRAO.responsavelTecnico}</td></tr>
                  <tr><th>CREA-PE</th><td>{DADOS_VL_PADRAO.crea}</td></tr>
                  <tr><th>Sede operacional</th><td>{DADOS_VL_PADRAO.sede}</td></tr>
                  <tr><th>E-mail</th><td><a href={`mailto:${DADOS_VL_PADRAO.email}`}>{DADOS_VL_PADRAO.email}</a></td></tr>
                  <tr><th>Telefone / WhatsApp</th><td><a href={`https://wa.me/${DADOS_VL_PADRAO.telefoneLink}`}>{DADOS_VL_PADRAO.telefone}</a></td></tr>
                </tbody>
              </table>
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#0B1E3D] mb-1">Contratante</h4>
              <table className="kv">
                <tbody>
                  <tr><th>Razão social</th><td>{clienteNome}</td></tr>
                  <tr><th>CNPJ / CPF</th><td>{cnpjCliente}</td></tr>
                  <tr><th>Representante</th><td>{representanteNome}</td></tr>
                  <tr><th>Localidade</th><td>{localidadeServico}</td></tr>
                  <tr><th>E-mail</th><td><a href={`mailto:${emailCliente}`}>{emailCliente}</a></td></tr>
                  <tr><th>Telefone</th><td>{telefoneCliente}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="obj">
            <span>Objeto da proposta:</span> {servicoTitulo} &nbsp;|&nbsp; <span>Ativo principal:</span> {ativosDescricao} &nbsp;|&nbsp; <span>Ref.:</span> {codigo}
          </div>
        </div>

        <div className="blk tight">
          <h3>Serviço contratado e ativos</h3>
          <table className="kv wide">
            <tbody>
              <tr><th>Serviço contratado</th><td>{servicoTitulo}</td></tr>
              <tr><th>Ativo avaliado</th><td>{ativosDescricao}</td></tr>
              <tr><th>Medições e análise</th><td className="t">Inspeção técnica in loco, ensaios funcionais e não destrutivos cabíveis, mapeamento fotográfico de campo e análise de conformidade mecânica segundo resoluções vigentes.</td></tr>
              <tr><th>Levantamento fotográfico</th><td className="t">As evidências fotográficas coletadas em campo durante a inspeção visual são integradas, em alta resolução, ao laudo definitivo.</td></tr>
            </tbody>
          </table>
        </div>

        <div className="blk tight">
          <h3>Normas de referência</h3>
          <table className="kv wide">
            <tbody>
              <tr><th>Normas Técnicas</th><td>{normasTecnicas}</td></tr>
              <tr><th>CREA-PE / CONFEA</th><td>Lei Federal 5.194/1966 e Resolução 1.025/2009 (ART)</td></tr>
              <tr><th>Segurança do Trabalho</th><td>NRs regulamentadoras vigentes aplicáveis ao segmento operacional</td></tr>
            </tbody>
          </table>
        </div>

        <div className="blk tight cols2">
          <div>
            <h3>Está incluído</h3>
            <ul className="chk ok">
              {(orcamento.incluso && orcamento.incluso.length > 0) ? (
                orcamento.incluso.map((inc, i) => (
                  <li key={i}>
                    <svg viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>
                    <span>{inc}</span>
                  </li>
                ))
              ) : (
                <>
                  <li><svg viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>Laudo técnico pericial de conformidade mecânica completo</li>
                  <li><svg viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>Deslocamento e vistoria in loco</li>
                  <li><svg viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>Laudo conclusivo em PDF com assinatura eletrônica e certificado digital</li>
                  <li><svg viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>ART registrada no CREA-PE, taxa inclusa</li>
                  <li><svg viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>{orcamento.incluiNotaFiscal !== false ? 'Nota fiscal de serviços (NFS-e)' : 'Recibo de prestação autônoma de serviços'}</li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h3>Fora do escopo</h3>
            <ul className="chk no">
              {(orcamento.foraDoEscopo && orcamento.foraDoEscopo.length > 0) ? (
                orcamento.foraDoEscopo.map((f, i) => (
                  <li key={i}>
                    <svg viewBox="0 0 12 12"><path d="M2.6 2.6l6.8 6.8M9.4 2.6L2.6 9.4" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>
                    <span>{f}</span>
                  </li>
                ))
              ) : (
                <>
                  <li><svg viewBox="0 0 12 12"><path d="M2.6 2.6l6.8 6.8M9.4 2.6L2.6 9.4" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>Reparos, troca de peças e intervenções corretivas nos equipamentos</li>
                  <li><svg viewBox="0 0 12 12"><path d="M2.6 2.6l6.8 6.8M9.4 2.6L2.6 9.4" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>Paradas, bloqueios e estruturas de acesso (andaimes, escadas), a cargo do contratante</li>
                  <li><svg viewBox="0 0 12 12"><path d="M2.6 2.6l6.8 6.8M9.4 2.6L2.6 9.4" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>Novas medições após as correções, sob nova proposta</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="lg">
        <div><span className="k">Contratante</span><span className="v">{clienteNome}</span></div>
        <div><span className="k">Proposta</span><span className="v">{codigo}</span></div>
        <div><span className="k">Rev.</span><span className="v">{revisao}</span></div>
        <div><span className="k">Emissão</span><span className="v">{emitidaEm}</span></div>
        <div><span className="k">Válida até</span><span className="v">{validaAte}</span></div>
        <div><span className="k">Folha</span><span className="v">2 / {totalFolhas}</span></div>
      </div>
      <div className="ft">
        <span>{DADOS_VL_PADRAO.razaoSocial}<em style={{ fontStyle: 'normal' }}>{DADOS_VL_PADRAO.sede}</em></span>
        <span>
          <a href={`https://wa.me/${DADOS_VL_PADRAO.telefoneLink}`}>{DADOS_VL_PADRAO.telefone}</a>
          <a href={`mailto:${DADOS_VL_PADRAO.email}`}>{DADOS_VL_PADRAO.email}</a>
        </span>
      </div>
    </section>
  );

  const renderFolha3 = (
    <section className="sheet" id="p3" key="folha-3">
      <div className="rh">
        <VlLogoVector className="h-7 w-auto" style={{ width: '135px', height: '26px' }} />
        <div className="where"><b>Etapa 2 de 3</b> Escopo técnico das atividades (metodologia)</div>
      </div>
      <div className="body">
        <h2>{tituloMetodologia}</h2>

        <div className="band">
          <div>
            <b>{fasesMetodologia.length} etapa{fasesMetodologia.length > 1 ? 's' : ''} sequenciais, da vistoria à ART</b>
            <span>Inspeção in loco, checklists normativos, instrumentação, laudo e homologação técnica.</span>
          </div>
          <em>Engenharia diagnóstica</em>
        </div>

        <div style={{ marginTop: '2mm' }}>
          {fasesMetodologia.map((fase, idx) => {
            const num = String(idx + 1).padStart(2, '0');
            const desc = (fase.descricao || '').replace(/\{normasTecnicas\}/g, normasTecnicas);
            return (
              <div className="ph" key={fase.id || `fase-${idx}`}>
                <div className="no"><small>Fase</small>{num}</div>
                <div>
                  <div className="hd">
                    <h4>{fase.titulo}</h4>
                    {fase.subtituloBadge && <span className="tag">{fase.subtituloBadge}</span>}
                  </div>
                  <p>{desc}</p>
                  {fase.entregavel && (
                    <div className="dl">
                      <svg viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>
                      <span><b>Entregável:</b> {fase.entregavel}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="blk">
          <h3>Informações técnicas operacionais e diretrizes</h3>
          <div className="facts">
            <div><span className="k">Ativos inspecionados</span><b>{ativosDescricao}</b></div>
            <div><span className="k">Horas técnicas</span><b>{orcamento.horasEngenharia || '16 horas de engenharia'}</b></div>
            <div><span className="k">Mobilização</span><b>{orcamento.mobilizacao || 'Imediata / até 48 h úteis'}</b></div>
          </div>
          <h4 style={{ marginTop: '2.5mm' }} className="font-bold text-xs text-[#0B1E3D]">Diretrizes operacionais e condições de acesso</h4>
          <ul className="sq">
            <li>Livre acesso às instalações e máquinas objeto do laudo no dia e horário previamente agendados;</li>
            <li>Acompanhamento por responsável técnico, encarregado de manutenção ou operador da máquina;</li>
            <li>Disponibilização de manuais de operação, prontuários anteriores ou diagramas, caso existentes;</li>
            <li>Observância de protocolos de segurança do trabalho do pátio industrial (EPIs aplicáveis).</li>
          </ul>
        </div>
      </div>

      <div className="lg">
        <div><span className="k">Contratante</span><span className="v">{clienteNome}</span></div>
        <div><span className="k">Proposta</span><span className="v">{codigo}</span></div>
        <div><span className="k">Rev.</span><span className="v">{revisao}</span></div>
        <div><span className="k">Emissão</span><span className="v">{emitidaEm}</span></div>
        <div><span className="k">Válida até</span><span className="v">{validaAte}</span></div>
        <div><span className="k">Folha</span><span className="v">3 / {totalFolhas}</span></div>
      </div>
      <div className="ft">
        <span>{DADOS_VL_PADRAO.razaoSocial}<em style={{ fontStyle: 'normal' }}>{DADOS_VL_PADRAO.sede}</em></span>
        <span>
          <a href={`https://wa.me/${DADOS_VL_PADRAO.telefoneLink}`}>{DADOS_VL_PADRAO.telefone}</a>
          <a href={`mailto:${DADOS_VL_PADRAO.email}`}>{DADOS_VL_PADRAO.email}</a>
        </span>
      </div>
    </section>
  );

  const renderFolha4 = (
    <section className="sheet" id="p4" key="folha-4">
      <div className="rh">
        <VlLogoVector className="h-7 w-auto" style={{ width: '135px', height: '26px' }} />
        <div className="where"><b>Etapa 3 de 3</b> Prazo, pagamento e investimento</div>
      </div>
      <div className="body">
        <h2>Investimento, cronograma, condições e PIX</h2>

        {/* Memorial de Cálculo da Proposta Comercial */}
        <div className="blk tight">
          <h3>Memorial de cálculo da proposta comercial</h3>
          <table className="memo">
            <thead>
              <tr>
                <th>Descrição do ativo / serviço de engenharia</th>
                <th className="r">Qtd.</th>
                <th className="r">Unitário</th>
                <th className="r">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {itensCalculo.map((it) => {
                const qtd = Number(it.quantidade) || 1;
                const subtotal = Number(it.valorTotal) || (qtd * (Number(it.valorUnitario) || 0));
                const unitNum = (Number(it.valorUnitario) > 0) ? Number(it.valorUnitario) : (subtotal / qtd);
                const isDizima = Math.abs(Math.round(unitNum * 100) * qtd - Math.round(subtotal * 100)) > 1;

                return (
                  <tr key={it.id}>
                    <td>
                      <b>{it.descricao}</b>
                      {isDizima && (
                        <span className="block text-[8.5px] text-slate-500 font-normal">
                          * Valor unitário médio rateado sobre o total contratado do escopo
                        </span>
                      )}
                    </td>
                    <td className="r font-mono">{qtd}</td>
                    <td className="r font-mono">
                      {it.exibirComoGlobal ? 'Lote / Global' : (
                        `${unitNum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}${isDizima ? '*' : ''}`
                      )}
                    </td>
                    <td className="r font-mono"><b>{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b></td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="lab">
                  Investimento total contratado
                  <span>Valor líquido para prestação técnica de serviços de engenharia mecânica.</span>
                </td>
                <td colSpan={2} className="r">
                  <span className="tot font-mono">{valorTotalFormatado}</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Condições Comerciais em Bento Grid */}
        <div className="cond">
          <div>
            <span className="k">Tributos & Emissão</span>
            <b>{orcamento.incluiNotaFiscal !== false ? 'Nota Fiscal (NFS-e)' : 'Faturamento via Recibo'}</b>
            <p>
              {orcamento.incluiNotaFiscal !== false 
                ? 'Emissão eletrônica de NFS-e municipal com todas as retenções aplicáveis inclusas.'
                : 'Recibo profissional de prestação de serviços técnicos autônomos com taxa de ART inclusa.'}
            </p>
          </div>
          <div>
            <span className="k">Deslocamento & Laudo</span>
            <b>Deslocamento e Laudo Completo</b>
            <p>Inclusos traslados técnicos in loco, instrumentos calibrados e entrega do laudo pericial em PDF de alta resolução assinado digitalmente.</p>
          </div>
          <div>
            <span className="k">Re-inspeção Técnica</span>
            <b>Suporte Consultivo</b>
            <p>Orientação direta de engenharia durante o período de adequação das não conformidades apontadas.</p>
          </div>
        </div>

        {/* Parcelas e Cronograma */}
        <div className="cols2" style={{ marginTop: '1.5mm' }}>
          <div className="blk tight">
            <h3>Condições de pagamento</h3>
            <table className="inst">
              <thead>
                <tr>
                  <th>Parcela</th>
                  <th>Quando</th>
                  <th className="r">%</th>
                  <th className="r">Valor</th>
                </tr>
              </thead>
              <tbody>
                {parcelas.map((p, idx) => (
                  <tr key={idx}>
                    <td><b>{p.parcela} parcela</b></td>
                    <td className="t">{p.quando}</td>
                    <td className="r">{p.percentual}%</td>
                    <td className="r font-mono">{p.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="blk tight">
            <h3>Cronograma executivo de entrega</h3>
            <div className="tl">
              <div className="rail"></div>
              <ol>
                <li><i></i><b>D+0</b><span>Aceite & PIX</span></li>
                <li><i></i><b>D+1</b><span>Alinhamento</span></li>
                <li><i></i><b>D+3 a D+4</b><span>Vistoria</span></li>
                <li><i></i><b>D+7</b><span>Laudo PDF</span></li>
                <li><i></i><b>D+7</b><span>ART CREA</span></li>
              </ol>
            </div>
          </div>
        </div>

        {/* PIX EMV com QR Code e Copia e Cola */}
        <div className="pix" style={{ marginTop: '1.5mm' }}>
          <div className="qr" dangerouslySetInnerHTML={{ __html: qrCodeSvg || '<svg></svg>' }} />
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[#15264B]">Pagamento facilitado via PIX (QR Code & Chave)</h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Aprovação Imediata
              </span>
            </div>
            <div className="row">
              <span>Chave PIX (CPF):</span>
              <b className="font-mono text-emerald-800">{orcamento.chavePix || DADOS_VL_PADRAO.pixChave}</b>
            </div>
            <div className="row">
              <span>Titular:</span>
              <b>{DADOS_VL_PADRAO.pixTitular}</b>
            </div>
            <div className="row">
              <span>1ª Parcela (50%):</span>
              <b className="font-mono text-[#2459C8]">{(valorTotalNum / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b>
            </div>
            <p className="how">
              Aponte a câmera do aplicativo do seu banco para o QR Code ao lado ou use o código PIX Copia e Cola abaixo.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="code font-mono truncate flex-1">
                {pixPayload || '00020126...'}
              </div>
              <button
                type="button"
                onClick={handleCopiarPix}
                className="px-2.5 py-1 rounded bg-[#15264B] hover:bg-[#2459C8] text-white text-[10.5px] font-bold shrink-0 cursor-pointer transition-colors"
              >
                {copiadoPix ? '✓ Copiado!' : 'Copiar PIX'}
              </button>
            </div>
          </div>
        </div>

        {/* Aceite e Linhas de Assinatura */}
        <div className="blk tight" style={{ marginTop: '1.5mm' }}>
          <h3>Termos de homologação, aceite e assinaturas</h3>
          <div className="sign">
            <div>
              <div className="line"></div>
              <b>{DADOS_VL_PADRAO.razaoSocial}</b>
              <span className="n">{DADOS_VL_PADRAO.responsavelTecnico}</span>
              <span className="m">Engenheiro Mecânico • CREA-PE {DADOS_VL_PADRAO.crea}</span>
              <div className="dt">Data: {emitidaEm}</div>
            </div>
            <div>
              <div className="line" style={{ borderBottomStyle: 'dashed' }}></div>
              <b>{clienteNome}</b>
              <span className="n">{representanteNome}</span>
              <span className="m">De Acordo / Representante Autorizado do Contratante</span>
              <div className="dt">Data: _____ / _____ / 2026</div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg">
        <div><span className="k">Contratante</span><span className="v">{clienteNome}</span></div>
        <div><span className="k">Proposta</span><span className="v">{codigo}</span></div>
        <div><span className="k">Rev.</span><span className="v">{revisao}</span></div>
        <div><span className="k">Emissão</span><span className="v">{emitidaEm}</span></div>
        <div><span className="k">Válida até</span><span className="v">{validaAte}</span></div>
        <div><span className="k">Folha</span><span className="v">4 / {totalFolhas}</span></div>
      </div>
      <div className="ft">
        <span>{DADOS_VL_PADRAO.razaoSocial}<em style={{ fontStyle: 'normal' }}>{DADOS_VL_PADRAO.sede}</em></span>
        <span>
          <a href={`https://wa.me/${DADOS_VL_PADRAO.telefoneLink}`}>{DADOS_VL_PADRAO.telefone}</a>
          <a href={`mailto:${DADOS_VL_PADRAO.email}`}>{DADOS_VL_PADRAO.email}</a>
        </span>
      </div>
    </section>
  );

  const renderFolha5 = (
    <section className="sheet" id="p5" key="folha-5">
      <div className="rh">
        <VlLogoVector className="h-7 w-auto" style={{ width: '135px', height: '26px' }} />
        <div className="where"><b>Anexo institucional • Folha 1 de 2</b> Sobre a VL Engenharia</div>
      </div>
      <div className="body">
        <h2>Direção técnica, credenciais, princípios e soluções</h2>

        <div className="bio">
          <img src="/vitor-leonardo.png" alt="Eng. Vitor Leonardo Cordeiro Linhares" />
          <div>
            <h4 className="text-[#15264B] font-bold">{DADOS_VL_PADRAO.responsavelTecnico}</h4>
            <div className="role">Engenheiro Mecânico Responsável Técnico • CREA-PE {DADOS_VL_PADRAO.crea}</div>
            <p>
              Graduado em Engenharia Mecânica com registro ativo no Conselho Regional de Engenharia e Agronomia de Pernambuco (CREA-PE). Especialista em engenharia diagnóstica, laudos periciais mecânicos, adequação a Normas Regulamentadoras federais (NR-11, NR-12, NR-13), projetos de climatização (PMOC), prevenção contra incêndio e ensaios instrumentados.
            </p>
            <div className="chk">
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                <svg className="w-3.5 h-3.5 text-[#2459C8]" viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>
                <span>Emissão Oficial de ART CREA-PE</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                <svg className="w-3.5 h-3.5 text-[#2459C8]" viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>
                <span>Engenharia Diagnóstica Avançada</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                <svg className="w-3.5 h-3.5 text-[#2459C8]" viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>
                <span>Conformidade com ABNT e NRs Federais</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                <svg className="w-3.5 h-3.5 text-[#2459C8]" viewBox="0 0 12 12"><path d="M2 6.4l2.7 2.7L10.2 3.3" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>
                <span>Respaldo Jurídico-Pericial Conclusivo</span>
              </div>
            </div>
          </div>
        </div>

        <div className="quote">
          “Contribuir para um ambiente operacional mais seguro, eficiente e juridicamente protegido, combinando rigor técnico pericial com agilidade e ética profissional inegociável.”
        </div>

        <div className="blk">
          <h3>Nossos princípios fundamentais</h3>
          <div className="g2">
            <div className="it">
              <h4 className="font-bold text-[#15264B] text-xs">1. Confiança na entrega</h4>
              <p>Rigor absoluto nos prazos assumidos. Nossos laudos periciais são emitidos com celeridade para manter suas operações ativas e sem atrasos.</p>
            </div>
            <div className="it">
              <h4 className="font-bold text-[#15264B] text-xs">2. Ética & imparcialidade</h4>
              <p>Transparência em cada avaliação física. Pareceres técnicos fundamentados estritamente na verdade fática e nas diretrizes normativas da ABNT.</p>
            </div>
            <div className="it">
              <h4 className="font-bold text-[#15264B] text-xs">3. Foco no cliente</h4>
              <p>Simplificamos procedimentos técnicos complexos, transformando exigências regulatórias em melhorias de produtividade e segurança do trabalho.</p>
            </div>
            <div className="it">
              <h4 className="font-bold text-[#15264B] text-xs">4. Parceria de longo prazo</h4>
              <p>Mais que uma prestação de serviço pontual, oferecemos suporte consultivo contínuo pós-entrega de laudos e laço corporativo de excelência.</p>
            </div>
          </div>
        </div>

        <div className="blk">
          <h3>O que entregamos (soluções técnicas)</h3>
          <div className="g2">
            <div className="it">
              <h4 className="font-bold text-[#15264B] text-xs">Ambiente operacional seguro</h4>
              <p>Garantia técnica de conformidade, mitigando substancialmente riscos de acidentes de trabalho e preservando a integridade dos operadores.</p>
            </div>
            <div className="it">
              <h4 className="font-bold text-[#15264B] text-xs">Otimização custo x benefício</h4>
              <p>Recomendações assertivas e viáveis de engenharia mecânica que eliminam gastos supérfluos e retrabalhos caros em adequações.</p>
            </div>
            <div className="it">
              <h4 className="font-bold text-[#15264B] text-xs">Respaldo jurídico com ART</h4>
              <p>Emissão de Anotação de Responsabilidade Técnica registrada no CREA-PE para atendimento formal a auditorias fiscais e judiciais.</p>
            </div>
            <div className="it">
              <h4 className="font-bold text-[#15264B] text-xs">Qualidade e confiabilidade</h4>
              <p>Dossiês completos com fotos de alta resolução, medições quantitativas e embasamento em perícia técnica especializada.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg">
        <div><span className="k">Contratante</span><span className="v">{clienteNome}</span></div>
        <div><span className="k">Proposta</span><span className="v">{codigo}</span></div>
        <div><span className="k">Rev.</span><span className="v">{revisao}</span></div>
        <div><span className="k">Emissão</span><span className="v">{emitidaEm}</span></div>
        <div><span className="k">Válida até</span><span className="v">{validaAte}</span></div>
        <div><span className="k">Folha</span><span className="v">5 / {totalFolhas}</span></div>
      </div>
      <div className="ft">
        <span>{DADOS_VL_PADRAO.razaoSocial}<em style={{ fontStyle: 'normal' }}>{DADOS_VL_PADRAO.sede}</em></span>
        <span>
          <a href={`https://wa.me/${DADOS_VL_PADRAO.telefoneLink}`}>{DADOS_VL_PADRAO.telefone}</a>
          <a href={`mailto:${DADOS_VL_PADRAO.email}`}>{DADOS_VL_PADRAO.email}</a>
        </span>
      </div>
    </section>
  );

  const renderFolha6 = (
    <section className="sheet" id="p6" key="folha-6">
      <div className="rh">
        <VlLogoVector className="h-7 w-auto" style={{ width: '135px', height: '26px' }} />
        <div className="where"><b>Anexo institucional • Folha 2 de 2</b> Sobre a VL Engenharia</div>
      </div>
      <div className="body">
        <h2>Problemas que resolvemos, serviços e contatos</h2>

        <div className="blk">
          <h3>Problemas que ajudamos a resolver</h3>
          <div className="g2">
            <div className="pb">
              <h4 className="font-bold text-rose-700">1. Risco de Acidentes</h4>
              <p>Diagnóstico proativo de falhas de fadiga de materiais, folgas mecânicas ou ausência de dispositivos de proteção.</p>
            </div>
            <div className="pb">
              <h4 className="font-bold text-amber-700">2. Notificações Fiscais</h4>
              <p>Adequação técnica completa contra multas do Ministério do Trabalho e autos de infração do Corpo de Bombeiros.</p>
            </div>
            <div className="pb">
              <h4 className="font-bold text-blue-700">3. Interdição e Paradas</h4>
              <p>Elaboração de planos corretivos para reativação imediata de linhas e equipamentos industriais embargados.</p>
            </div>
            <div className="pb">
              <h4 className="font-bold text-indigo-700">4. Retrabalho Técnico</h4>
              <p>Projetos assertivos de engenharia mecânica para reformas e adequações que solucionam na primeira intervenção.</p>
            </div>
          </div>
        </div>

        <div className="blk">
          <h3>Resumo de nossos serviços de engenharia</h3>
          <div className="sv3">
            <div className="sv">
              <div className="cd">12</div>
              <h4 className="font-bold text-[#15264B]">NR-12 • Máquinas</h4>
              <div className="tg">Apreciação de risco & laudos</div>
              <p>Inventário técnico, HRN, laudos periciais de conformidade mecânica de prensas, tornos e esteiras.</p>
            </div>
            <div className="sv">
              <div className="cd">11</div>
              <h4 className="font-bold text-[#15264B]">NR-11 • Cargas</h4>
              <div className="tg">Elevação & movimentação</div>
              <p>Inspeção e laudos de pontes rolantes, guindastes, pórticos, ensaios não destrutivos e cabos.</p>
            </div>
            <div className="sv">
              <div className="cd">13</div>
              <h4 className="font-bold text-[#15264B]">NR-13 • Caldeiras</h4>
              <div className="tg">Pressão & tubulações</div>
              <p>Vasos sob pressão, compressores, teste hidrostático, medição de espessura por ultrassom e prontuários.</p>
            </div>
            <div className="sv">
              <div className="cd">AC</div>
              <h4 className="font-bold text-[#15264B]">PMOC Climatização</h4>
              <div className="tg">Lei 13.589/2018 & ANVISA</div>
              <p>Plano de manutenção, operação e controle para qualidade do ar e conformidade sanitária.</p>
            </div>
            <div className="sv">
              <div className="cd">PJ</div>
              <h4 className="font-bold text-[#15264B]">Perícias Judiciais</h4>
              <div className="tg">Assistência técnica</div>
              <p>Quesitos periciais, laudos de impugnação, avaliação de nexo causal e suporte jurídico.</p>
            </div>
            <div className="sv">
              <div className="cd">35</div>
              <h4 className="font-bold text-[#15264B]">NR-35 Linhas de Vida</h4>
              <div className="tg">Pontos de ancoragem</div>
              <p>Cálculo estrutural, teste de arrancamento estático e certificação anual de sistemas antiqueda.</p>
            </div>
          </div>
        </div>

        <div className="thanks">
          <div className="th">
            <b>Agradecimento & Parceria Técnica de Confiança</b>
            <span className="tg">VL Engenharia Mecânica</span>
          </div>
          <p>
            Agradecemos a oportunidade e a confiança depositada. Reafirmamos nosso compromisso inegociável com a excelência técnica, agilidade operacional, conformidade legal e salvaguarda irrestrita de suas operações.
          </p>
        </div>

        <div className="blk">
          <h3>Canais diretos de atendimento</h3>
          <div className="ct">
            <div>
              <span className="k">Direção Técnica</span>
              <b>Eng. Vitor Leonardo</b>
              <span className="sub">CREA-PE {DADOS_VL_PADRAO.crea}</span>
              <p>Responsável Técnico e Perito Especialista</p>
            </div>
            <div>
              <span className="k">Plantão & WhatsApp</span>
              <b>{DADOS_VL_PADRAO.telefone}</b>
              <span className="sub">Atendimento Direto</span>
              <p>Agendamento de vistorias e alinhamentos urgentes</p>
            </div>
            <div>
              <span className="k">Expediente Formal</span>
              <b className="truncate">{DADOS_VL_PADRAO.email}</b>
              <span className="sub">E-mail Corporativo</span>
              <p>Envio de documentações, editais e formalizações</p>
            </div>
            <div>
              <span className="k">Sede Operacional</span>
              <b>{DADOS_VL_PADRAO.sede}</b>
              <span className="sub">Pernambuco</span>
              <p>Atuação em todo o estado de PE e Nordeste</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg">
        <div><span className="k">Contratante</span><span className="v">{clienteNome}</span></div>
        <div><span className="k">Proposta</span><span className="v">{codigo}</span></div>
        <div><span className="k">Rev.</span><span className="v">{revisao}</span></div>
        <div><span className="k">Emissão</span><span className="v">{emitidaEm}</span></div>
        <div><span className="k">Válida até</span><span className="v">{validaAte}</span></div>
        <div><span className="k">Folha</span><span className="v">6 / {totalFolhas}</span></div>
      </div>
      <div className="ft">
        <span>{DADOS_VL_PADRAO.razaoSocial}<em style={{ fontStyle: 'normal' }}>{DADOS_VL_PADRAO.sede}</em></span>
        <span>
          <a href={`https://wa.me/${DADOS_VL_PADRAO.telefoneLink}`}>{DADOS_VL_PADRAO.telefone}</a>
          <a href={`mailto:${DADOS_VL_PADRAO.email}`}>{DADOS_VL_PADRAO.email}</a>
        </span>
      </div>
    </section>
  );

  const sheetStyles = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&display=swap');

      .proposta-print-page {
        --ink: #0B1E3D;
        --blue: #1565D8;
        --amber: #D4AF37;
        --text: #1F2937;
        --muted: #4B5563;
        --rule: #D1D5DB;
        --tint: #F3F4F6;
        --tint2: #F8FAFC;
        --sans: 'Barlow Semi Condensed', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        --serif: 'Source Serif 4', Georgia, Cambria, 'Times New Roman', serif;
        --w1: .3pt;
        --w2: .7pt;
        --w3: 1.4pt;
        color: var(--text);
        font-family: var(--serif);
        line-height: 1.45;
        background: transparent;
      }

      .proposta-print-page .proposta-container {
        padding: 16px 0 32px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
      }

      .proposta-print-page .sheet {
        width: 210mm;
        min-height: 297mm;
        max-height: 297mm;
        height: 297mm;
        background: #fff;
        box-sizing: border-box;
        position: relative;
        color: var(--text);
        font-family: var(--serif);
        font-size: 9.2pt;
        line-height: 1.45;
        page-break-after: always;
        break-after: page;
        box-shadow: 0 4px 24px rgba(0,0,0,0.18);
        border: 1px solid #CBD5E1;
      }

      .proposta-print-page .sheet.cover {
        padding: 8.5mm 14mm 6mm;
        display: flex;
        flex-direction: column;
      }

      .proposta-print-page .sheet:not(.cover) {
        padding: 0 14mm 6mm;
        display: flex;
        flex-direction: column;
      }

      .proposta-print-page .sheet:not(.cover) .body {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-top: 2.5mm;
      }

      .proposta-print-page .rh {
        height: 12.5mm;
        border-bottom: var(--w2) solid var(--ink);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 1.5mm;
        margin-bottom: 2mm;
        overflow: visible;
      }
      .proposta-print-page .rh .where {
        font: 500 8pt var(--sans);
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: .06em;
      }
      .proposta-print-page .rh .where b { color: var(--ink); font-weight: 700; margin-right: 4mm; }

      .proposta-print-page .lg {
        display: grid;
        grid-template-columns: 2fr 1fr .6fr 1fr 1fr .8fr;
        gap: 0 3mm;
        border-top: var(--w1) solid var(--rule);
        padding: 1.4mm 0 1.2mm;
        font: 500 7pt/1.2 var(--sans);
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: .05em;
        margin-top: auto;
      }
      .proposta-print-page .lg .k { color: #9CA3AF; display: block; font-size: 6.2pt; }
      .proposta-print-page .lg .v { color: var(--ink); font-weight: 600; display: block; }

      .proposta-print-page .ft {
        border-top: var(--w2) solid var(--ink);
        padding-top: 1.4mm;
        display: flex;
        justify-content: space-between;
        font: 500 7.5pt/1.2 var(--sans);
        color: var(--muted);
      }
      .proposta-print-page .ft span { display: inline-flex; gap: 4mm; }
      .proposta-print-page .ft a { color: var(--blue); text-decoration: none; }

      .proposta-print-page .cover .ch {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border-bottom: var(--w3) solid var(--ink);
        padding-bottom: 2.6mm;
        overflow: visible;
      }
      .proposta-print-page .cover .ch .meta {
        text-align: right;
        font: 500 8pt/1.3 var(--sans);
        color: var(--muted);
      }
      .proposta-print-page .cover .ch .meta b { color: var(--ink); font-weight: 700; }

      .proposta-print-page .cover .top { padding: 4mm 0 2.8mm; border-bottom: var(--w1) solid var(--rule); }
      .proposta-print-page .cover h1 {
        font: 700 20pt/1.1 var(--sans);
        color: var(--ink);
        letter-spacing: -.01em;
        margin: 0;
      }
      .proposta-print-page .cover .sub {
        font: 600 10.2pt/1.3 var(--sans);
        color: var(--blue);
        margin-top: 1mm;
        text-transform: uppercase;
        letter-spacing: .04em;
      }
      .proposta-print-page .cover .lead {
        font: 400 9pt/1.42 var(--serif);
        color: var(--muted);
        margin-top: 1.8mm;
      }

      .proposta-print-page .cover .mid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6mm;
        padding: 3mm 0 3mm;
        border-bottom: var(--w1) solid var(--rule);
      }
      .proposta-print-page .cover h3, .proposta-print-page .blk h3 {
        font: 700 8pt/1 var(--sans);
        color: var(--ink);
        text-transform: uppercase;
        letter-spacing: .08em;
        margin-bottom: 2mm;
      }

      .proposta-print-page .cover .idx { list-style: none; padding: 0; margin: 0; }
      .proposta-print-page .cover .idx li {
        display: grid;
        grid-template-columns: 14mm 1fr auto;
        gap: 2mm;
        padding: 1.4mm 0;
        border-top: var(--w1) solid var(--rule);
        align-items: baseline;
        font-family: var(--sans);
      }
      .proposta-print-page .cover .idx li:first-child { border-top: none; }
      .proposta-print-page .cover .idx .e { font: 700 8pt var(--sans); color: var(--ink); text-transform: uppercase; }
      .proposta-print-page .cover .idx .t { font: 600 8.8pt var(--sans); color: var(--ink); display: block; }
      .proposta-print-page .cover .idx .d { font: 400 7.4pt/1.25 var(--serif); color: var(--muted); display: block; }
      .proposta-print-page .cover .idx .p { font: 700 8pt var(--sans); color: var(--blue); }
      .proposta-print-page .cover .idx a { text-decoration: none; color: inherit; }

      .proposta-print-page .cover .approve ol { list-style: none; padding: 0; margin: 0; }
      .proposta-print-page .cover .approve li {
        display: grid;
        grid-template-columns: 6mm 1fr;
        gap: 2.5mm;
        padding: 1.5mm 0;
        align-items: flex-start;
        border-top: var(--w1) solid var(--rule);
      }
      .proposta-print-page .cover .approve li:first-child { border-top: none; }
      .proposta-print-page .cover .approve .n {
        width: 5.5mm;
        height: 5.5mm;
        background: var(--ink);
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font: 700 7.5pt var(--sans);
      }
      .proposta-print-page .cover .approve p { font-size: 8.4pt; line-height: 1.35; margin: 0; }
      .proposta-print-page .cover .approve b { font-family: var(--sans); font-weight: 700; color: var(--ink); }

      .proposta-print-page .cover .tb {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: 0;
        border-top: var(--w2) solid var(--ink);
        border-left: var(--w1) solid var(--rule);
        margin: 3mm 0;
        background: #fff;
      }
      .proposta-print-page .cover .tb > div {
        border-right: var(--w1) solid var(--rule);
        border-bottom: var(--w1) solid var(--rule);
        padding: 2mm 2.5mm;
        box-sizing: border-box;
      }
      .proposta-print-page .cover .tb .c8 { grid-column: span 8; }
      .proposta-print-page .cover .tb .c6 { grid-column: span 6; }
      .proposta-print-page .cover .tb .c5 { grid-column: span 5; }
      .proposta-print-page .cover .tb .c4 { grid-column: span 4; }
      .proposta-print-page .cover .tb .c3 { grid-column: span 3; }
      .proposta-print-page .cover .tb .c2 { grid-column: span 2; }

      .proposta-print-page .cover .tb .k {
        font: 600 6.8pt/1 var(--sans);
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: .08em;
        display: block;
        margin-bottom: .8mm;
      }
      .proposta-print-page .cover .tb .v {
        font: 600 9.8pt/1.2 var(--sans);
        color: var(--ink);
        display: block;
      }
      .proposta-print-page .cover .tb .v.sm2 { font-size: 8.5pt; font-weight: 500; }
      .proposta-print-page .cover .tb .big {
        font: 700 13pt/1.05 var(--sans);
        color: var(--ink);
        display: block;
      }
      .proposta-print-page .cover .tb .cap {
        font: 400 7pt/1.2 var(--serif);
        color: var(--muted);
        display: block;
        margin-top: .6mm;
      }
      .proposta-print-page .cover .tb .price { background: var(--tint2); }
      .proposta-print-page .cover .tb .price .n {
        font: 700 19pt/1 var(--sans);
        color: var(--blue);
        display: block;
        letter-spacing: -.02em;
      }
      .proposta-print-page .cover .tb .price .dim {
        display: flex;
        align-items: center;
        gap: 1.5mm;
        margin: .6mm 0 .2mm;
      }
      .proposta-print-page .cover .tb .price .dim svg { width: 5px; height: 5px; fill: var(--amber); }
      .proposta-print-page .cover .tb .price .dim i { flex: 1; height: var(--w1); background: var(--amber); }

      .proposta-print-page h2 {
        font: 700 14.5pt/1.1 var(--sans);
        color: var(--ink);
        letter-spacing: -.01em;
        margin: 0 0 2mm 0;
        padding-bottom: 1.2mm;
        border-bottom: var(--w2) solid var(--ink);
        display: flex;
        justify-content: space-between;
        align-items: baseline;
      }
      .proposta-print-page .blk {
        border: var(--w1) solid var(--rule);
        background: #fff;
        padding: 2.4mm 3mm;
        margin-bottom: 2mm;
      }
      .proposta-print-page .blk.tight { padding: 2mm 2.8mm; margin-bottom: 2mm; }
      .proposta-print-page .cols2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; }

      .proposta-print-page table.kv { width: 100%; border-collapse: collapse; font-family: var(--sans); font-size: 8.3pt; }
      .proposta-print-page table.kv th {
        text-align: left;
        width: 32mm;
        color: var(--muted);
        font-weight: 500;
        padding: .8mm 0;
        border-bottom: var(--w1) solid var(--tint);
        vertical-align: top;
      }
      .proposta-print-page table.kv td {
        padding: .8mm 0;
        color: var(--ink);
        font-weight: 600;
        border-bottom: var(--w1) solid var(--tint);
      }
      .proposta-print-page table.kv td.t { font-family: var(--serif); font-weight: 400; font-size: 8.5pt; color: var(--text); line-height: 1.35; }
      .proposta-print-page table.kv.wide th { width: 36mm; }
      .proposta-print-page table.kv a { color: var(--blue); text-decoration: none; }

      .proposta-print-page .obj {
        margin-top: 1.4mm;
        padding: 1.2mm 2mm;
        background: var(--tint);
        font: 500 8pt/1.3 var(--sans);
        color: var(--ink);
      }
      .proposta-print-page .obj span { color: var(--muted); }

      .proposta-print-page .chk { list-style: none; padding: 0; margin: 0; font-size: 8.4pt; }
      .proposta-print-page .chk li {
        display: grid;
        grid-template-columns: 4mm 1fr;
        gap: 1.8mm;
        padding: .9mm 0;
        border-bottom: var(--w1) solid var(--tint);
        align-items: baseline;
      }
      .proposta-print-page .chk li:last-child { border-bottom: none; }
      .proposta-print-page .chk.ok svg { color: var(--blue); width: 3.2mm; height: 3.2mm; }
      .proposta-print-page .chk.no svg { color: #9CA3AF; width: 3.2mm; height: 3.2mm; }

      .proposta-print-page .band {
        background: var(--ink);
        color: #fff;
        padding: 1.8mm 3mm;
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        font-family: var(--sans);
      }
      .proposta-print-page .band b { font-weight: 700; font-size: 9.6pt; }
      .proposta-print-page .band span { font-weight: 400; font-size: 8pt; color: #BFCBE8; margin-left: 2mm; }
      .proposta-print-page .band em { font-style: normal; font-weight: 600; font-size: 7.6pt; color: var(--amber); text-transform: uppercase; letter-spacing: .06em; }

      .proposta-print-page .ph {
        display: grid;
        grid-template-columns: 11mm 1fr;
        gap: 2.6mm;
        border: var(--w1) solid var(--rule);
        border-top: none;
        padding: 1.8mm 2.6mm;
        background: #fff;
      }
      .proposta-print-page .ph:nth-child(even) { background: var(--tint2); }
      .proposta-print-page .ph .no {
        font: 700 15pt/1 var(--sans);
        color: var(--blue);
        border-right: var(--w1) solid var(--rule);
        padding-right: 2mm;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .proposta-print-page .ph .no small { font: 500 6pt/1 var(--sans); color: var(--muted); text-transform: uppercase; }
      .proposta-print-page .ph .hd { display: flex; justify-content: space-between; align-items: baseline; }
      .proposta-print-page .ph h4 { font: 600 9.4pt/1.2 var(--sans); color: var(--ink); margin: 0; }
      .proposta-print-page .ph .tag { font: 500 7pt var(--sans); color: var(--muted); text-transform: uppercase; }
      .proposta-print-page .ph p { font-size: 8.4pt; line-height: 1.35; margin: .8mm 0; color: var(--text); }
      .proposta-print-page .ph .dl { display: flex; align-items: center; gap: 1.5mm; font-size: 7.9pt; color: var(--muted); }
      .proposta-print-page .ph .dl svg { width: 3.2mm; height: 3.2mm; color: var(--blue); shrink: 0; }
      .proposta-print-page .ph .dl b { font-family: var(--sans); color: var(--ink); }

      .proposta-print-page .facts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5mm; margin: 1mm 0 2mm; }
      .proposta-print-page .facts div { background: var(--tint2); border: var(--w1) solid var(--rule); padding: 1.6mm 2.2mm; }
      .proposta-print-page .facts .k { font: 600 6.5pt var(--sans); color: var(--muted); text-transform: uppercase; display: block; margin-bottom: .4mm; }
      .proposta-print-page .facts b { font: 600 9pt/1.2 var(--sans); color: var(--ink); display: block; }
      .proposta-print-page ul.sq { list-style: square; padding-left: 4.5mm; margin: 1mm 0; font-size: 8.3pt; line-height: 1.4; color: var(--text); }

      .proposta-print-page table.memo { width: 100%; border-collapse: collapse; font-family: var(--sans); font-size: 8.5pt; }
      .proposta-print-page table.memo th {
        background: var(--tint);
        color: var(--ink);
        font-weight: 700;
        text-transform: uppercase;
        font-size: 7.2pt;
        letter-spacing: .06em;
        padding: 1.4mm 2mm;
        border-bottom: var(--w2) solid var(--ink);
      }
      .proposta-print-page table.memo td {
        padding: 1.6mm 2mm;
        border-bottom: var(--w1) solid var(--rule);
        vertical-align: middle;
      }
      .proposta-print-page table.memo td.r, .proposta-print-page table.memo th.r { text-align: right; }
      .proposta-print-page table.memo tfoot td {
        background: var(--tint2);
        border-top: var(--w2) solid var(--ink);
        border-bottom: none;
        padding: 2mm;
      }
      .proposta-print-page table.memo .tot { font-size: 13pt; font-weight: 700; color: var(--blue); }
      .proposta-print-page table.memo .lab { font-weight: 700; color: var(--ink); text-transform: uppercase; font-size: 8.5pt; }
      .proposta-print-page table.memo .lab span { display: block; font-weight: 400; font-size: 7pt; color: var(--muted); text-transform: none; margin-top: .4mm; }

      .proposta-print-page .cond { display: grid; grid-template-columns: 1fr 1.6fr 1fr; gap: 3mm; padding-bottom: 1.6mm; }
      .proposta-print-page .cond .k { font: 600 6.8pt/1 var(--sans); color: var(--muted); text-transform: uppercase; display: block; }
      .proposta-print-page .cond b { font: 600 9.4pt/1.2 var(--sans); color: var(--ink); display: block; margin: .6mm 0; }
      .proposta-print-page .cond p { font-size: 7.8pt; line-height: 1.3; color: var(--muted); margin: 0; }

      .proposta-print-page table.inst { width: 100%; border-collapse: collapse; font-family: var(--sans); font-size: 8.3pt; margin-top: 1.4mm; }
      .proposta-print-page table.inst th {
        background: var(--tint);
        color: var(--ink);
        font-weight: 600;
        font-size: 6.8pt;
        text-transform: uppercase;
        padding: 1mm 1.8mm;
        text-align: left;
      }
      .proposta-print-page table.inst td { padding: 1.2mm 1.8mm; border-bottom: var(--w1) solid var(--tint); }
      .proposta-print-page table.inst td.r, .proposta-print-page table.inst th.r { text-align: right; font-weight: 700; }
      .proposta-print-page table.inst td.t { font-family: var(--serif); }

      .proposta-print-page .tl { position: relative; padding: 1.8mm 0; }
      .proposta-print-page .tl .rail { position: absolute; left: 0; right: 0; top: 3.4mm; height: var(--w2); background: var(--ink); z-index: 1; }
      .proposta-print-page .tl ol {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 2mm;
        position: relative;
        z-index: 2;
      }
      .proposta-print-page .tl li { font-family: var(--sans); }
      .proposta-print-page .tl li i {
        width: 3.4mm;
        height: 3.4mm;
        background: #fff;
        border: var(--w2) solid var(--blue);
        border-radius: 50%;
        display: block;
        margin-bottom: 1.4mm;
      }
      .proposta-print-page .tl li b { font: 700 8.5pt/1 var(--sans); color: var(--ink); display: block; }
      .proposta-print-page .tl li span { font: 400 7pt/1.2 var(--serif); color: var(--muted); display: block; margin-top: .4mm; }

      .proposta-print-page .pix {
        display: grid;
        grid-template-columns: 28mm 1fr;
        gap: 3.5mm;
        background: var(--tint2);
        border: var(--w1) solid #86EFAC;
        padding: 2.2mm 2.8mm;
        align-items: center;
      }
      .proposta-print-page .pix .qr { width: 28mm; height: 28mm; background: #fff; padding: 1mm; border: var(--w1) solid #CBD5E1; }
      .proposta-print-page .pix .qr svg { width: 100%; height: 100%; display: block; }
      .proposta-print-page .pix .row { font: 500 8.2pt/1.3 var(--sans); margin-top: .6mm; color: var(--text); }
      .proposta-print-page .pix .row span { color: var(--muted); margin-right: 2mm; }
      .proposta-print-page .pix .how { font-size: 7.5pt; color: var(--muted); margin: 1mm 0 0; line-height: 1.25; }
      .proposta-print-page .pix .code {
        background: #fff;
        border: var(--w1) solid var(--rule);
        padding: .8mm 1.5mm;
        font: 500 6.8pt/1.2 monospace;
        color: var(--muted);
      }

      .proposta-print-page .sign { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; margin-top: 1mm; }
      .proposta-print-page .sign .line { height: 9mm; border-bottom: var(--w2) solid var(--ink); }
      .proposta-print-page .sign b { font: 700 9pt/1.1 var(--sans); color: var(--ink); display: block; margin-top: 1mm; }
      .proposta-print-page .sign .n { font: 600 8.2pt/1.2 var(--sans); color: var(--blue); display: block; }
      .proposta-print-page .sign .m { font: 400 7.4pt/1.2 var(--serif); color: var(--muted); display: block; }
      .proposta-print-page .sign .dt { font: 500 7.5pt var(--sans); color: var(--muted); margin-top: 1mm; }

      .proposta-print-page .bio { display: grid; grid-template-columns: 28mm 1fr; gap: 4mm; align-items: start; margin-bottom: 2mm; }
      .proposta-print-page .bio img { width: 28mm; height: 35mm; object-fit: cover; border: var(--w1) solid var(--rule); }
      .proposta-print-page .bio .role { font: 600 8.8pt/1.2 var(--sans); color: var(--blue); margin-top: .4mm; }
      .proposta-print-page .bio p { font-size: 8.2pt; line-height: 1.35; color: var(--text); margin: 1mm 0 1.5mm; }
      .proposta-print-page .bio .chk { display: grid; grid-template-columns: 1fr 1fr; gap: 1mm; }

      .proposta-print-page .quote {
        border-left: var(--w3) solid var(--amber);
        padding: .8mm 0 .8mm 3mm;
        font: italic 400 9.2pt/1.4 var(--serif);
        color: var(--ink);
        background: var(--tint2);
        margin-bottom: 2mm;
      }
      .proposta-print-page .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 2mm 4mm; }
      .proposta-print-page .it { padding: 1mm 0; border-bottom: var(--w1) solid var(--tint); }
      .proposta-print-page .it h4 { margin: 0 0 .4mm; font-size: 8.8pt; }
      .proposta-print-page .it p { margin: 0; font-size: 8pt; line-height: 1.3; color: var(--muted); }

      .proposta-print-page .pb { padding: 1mm 0; border-bottom: var(--w1) solid var(--tint); }
      .proposta-print-page .pb h4 { margin: 0 0 .4mm; font-size: 8.8pt; }
      .proposta-print-page .pb p { margin: 0; font-size: 8pt; line-height: 1.3; color: var(--muted); }

      .proposta-print-page .sv3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5mm; margin-top: 1mm; }
      .proposta-print-page .sv { border: var(--w1) solid var(--rule); padding: 1.6mm 2mm; background: #fff; }
      .proposta-print-page .sv .cd { font: 700 12pt/1 var(--sans); color: var(--blue); }
      .proposta-print-page .sv h4 { font-size: 8.6pt; margin: .6mm 0 .2mm; }
      .proposta-print-page .sv .tg { font: 600 6.8pt var(--sans); color: var(--amber); text-transform: uppercase; margin-bottom: .6mm; }
      .proposta-print-page .sv p { margin: 0; font-size: 7.6pt; line-height: 1.3; color: var(--muted); }

      .proposta-print-page .thanks {
        background: var(--ink);
        color: #fff;
        padding: 2.4mm 3.2mm;
        margin-bottom: 2mm;
      }
      .proposta-print-page .thanks .th { display: flex; justify-content: space-between; align-items: baseline; }
      .proposta-print-page .thanks b { font: 700 10.5pt/1.2 var(--sans); color: #fff; }
      .proposta-print-page .thanks .tg { font: 600 7.5pt var(--sans); color: var(--amber); text-transform: uppercase; }
      .proposta-print-page .thanks p { margin: .8mm 0 0; font-size: 8.2pt; line-height: 1.35; color: #E7ECF7; }

      .proposta-print-page .ct { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2.5mm; }
      .proposta-print-page .ct > div { border: var(--w1) solid var(--rule); padding: 1.6mm 2mm; background: var(--tint2); }
      .proposta-print-page .ct .k { font: 600 6.5pt var(--sans); color: var(--muted); text-transform: uppercase; display: block; margin-bottom: .4mm; }
      .proposta-print-page .ct b { font: 600 8.8pt/1.2 var(--sans); color: var(--ink); display: block; }
      .proposta-print-page .ct .sub { font: 500 7.2pt var(--sans); color: var(--blue); display: block; margin-top: .4mm; }
      .proposta-print-page .ct p { font-size: 7.2pt; line-height: 1.25; color: var(--muted); margin: .6mm 0 0; }

      @media print {
        @page {
          size: 210mm 297mm;
          margin: 0;
        }
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: #fff !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .proposta-print-page .proposta-container {
          padding: 0 !important;
          gap: 0 !important;
        }
        .proposta-print-page .sheet {
          box-shadow: none !important;
          border: none !important;
          margin: 0 !important;
          page-break-after: always !important;
          break-after: page !important;
        }
        .proposta-print-page .sheet:last-of-type {
          page-break-after: avoid !important;
          break-after: avoid !important;
        }
      }
    `}</style>
  );

  // Seleção de páginas a renderizar
  const todasFolhas = [
    { num: 1, element: renderFolha1 },
    { num: 2, element: renderFolha2 },
    { num: 3, element: renderFolha3 },
    { num: 4, element: renderFolha4 },
    ...(modo === 'completa' ? [
      { num: 5, element: renderFolha5 },
      { num: 6, element: renderFolha6 }
    ] : [])
  ];

  if (folhaEspecifica && folhaEspecifica >= 1) {
    const folhaEncontrada = todasFolhas.find(f => f.num === folhaEspecifica);
    return (
      <div className={`proposta-print-page ${embutidoNoModal ? 'modal-scale' : ''}`}>
        {sheetStyles}
        {folhaEncontrada ? folhaEncontrada.element : todasFolhas[0].element}
      </div>
    );
  }

  return (
    <div className={`proposta-print-page ${embutidoNoModal ? 'modal-scale' : ''}`}>
      {sheetStyles}
      <div className="proposta-container">
        {todasFolhas.map(f => f.element)}
      </div>
    </div>
  );
};
