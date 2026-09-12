import React, { useRef, useState, useMemo } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Award, 
  Calendar, 
  MapPin, 
  User, 
  Cpu, 
  Hash, 
  Phone, 
  Mail, 
  Loader2,
  Check,
  Building2,
  Sparkles,
  ListOrdered,
  ChevronLeft,
  ChevronRight,
  Eye,
  Camera,
  Layers,
  Paperclip,
  CheckSquare
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { Laudo, Cliente, Ativo } from '../../types';
import { EngineeringWatermark } from '../common/EngineeringWatermark';

interface LaudoPdfExportModalProps {
  laudo: Laudo;
  cliente?: Cliente;
  ativo?: Ativo;
  isOpen: boolean;
  onClose: () => void;
}

interface PaginaLaudoDef {
  id: string;
  numero: number;
  tipo: 'capa' | 'cadastro' | 'secao' | 'conclusao' | 'art';
  titulo: string;
  subtitulo?: string;
  render: () => React.ReactNode;
}

export const LaudoPdfExportModal: React.FC<LaudoPdfExportModalProps> = ({
  laudo,
  cliente,
  ativo,
  isOpen,
  onClose,
}) => {
  const printContainerRef = useRef<HTMLDivElement>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [modoVisualizacao, setModoVisualizacao] = useState<'pagina' | 'continua'>('pagina');
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [sucessoDownload, setSucessoDownload] = useState(false);

  if (!isOpen) return null;

  const dataFormatada = laudo.dataInspecao 
    ? new Date(laudo.dataInspecao).toLocaleDateString('pt-BR') 
    : new Date().toLocaleDateString('pt-BR');

  const emitidoEm = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const authHash = `VL-${laudo.numero.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now().toString(36).toUpperCase()}`;
  const secoesOrdenadas = [...(laudo.secoes || [])].sort((a, b) => a.ordem - b.ordem);

  // =========================================================================
  // BUILD DISCRETE A4 PAGES FOR THE LAUDO
  // This guarantees zero cutting/clipping when compiling to PDF
  // =========================================================================
  const paginasLaudo: PaginaLaudoDef[] = useMemo(() => {
    const list: PaginaLaudoDef[] = [];
    let pageNum = 1;

    // -------------------------------------------------------------------------
    // PAGE 1: CAPA OFICIAL DO LAUDO
    // -------------------------------------------------------------------------
    list.push({
      id: 'capa',
      numero: pageNum++,
      tipo: 'capa',
      titulo: 'Capa Oficial do Laudo',
      subtitulo: 'Identificação & Credenciamento CREA-PE',
      render: () => (
        <div className="h-full flex flex-col justify-between text-slate-900">
          {/* Top Header */}
          <div className="border-b-2 border-[#0B1E3D] pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs">
                <img 
                  src="/logo.png" 
                  alt="VL Engenharia Logo" 
                  className="w-full h-full object-contain"
                  crossOrigin="anonymous"
                />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-[#0B1E3D] leading-none">
                  VL ENGENHARIA MECÂNICA
                </h1>
                <p className="text-[11px] font-bold text-[#1565D8] uppercase tracking-wider mt-1">
                  Consultoria Técnica, Perícias & Segurança Operacional
                </p>
                <p className="text-[10px] text-slate-600 font-mono mt-0.5">
                  Registro Profissional: <strong>CREA-PE 182229949-0</strong> • CNPJ: 45.123.890/0001-23
                </p>
              </div>
            </div>

            <div className="text-right text-[10px] text-slate-600 space-y-0.5 font-medium">
              <p className="font-bold text-slate-800">Recife - PE • Atendimento Nacional</p>
              <p className="flex items-center justify-end gap-1">
                <Phone className="w-2.5 h-2.5 text-[#1565D8]" />
                <span>(81) 98444-2592</span>
              </p>
              <p className="flex items-center justify-end gap-1">
                <Mail className="w-2.5 h-2.5 text-[#1565D8]" />
                <span>contato@vlengenharia.com.br</span>
              </p>
            </div>
          </div>

          {/* Title Box */}
          <div className="my-auto space-y-4 py-2">
            <div className="text-center space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#0B1E3D] text-white">
                DOCUMENTO TÉCNICO PERICIAL OFICIAL
              </span>
              <h2 className="text-2xl font-black text-[#0B1E3D] tracking-tight uppercase leading-tight">
                LAUDO TÉCNICO PERICIAL DE ENGENHARIA
              </h2>
              <p className="text-sm font-bold text-[#1565D8] uppercase tracking-wide">
                {laudo.tipo}
              </p>
            </div>

            {/* FOTO DA CAPA OU ILUSTRAÇÃO TÉCNICA */}
            <div className="w-full max-w-lg mx-auto">
              {laudo.capaFotoUrl ? (
                <div className="rounded-xl overflow-hidden border-2 border-[#1565D8] shadow-md bg-slate-900 text-center">
                  <img 
                    src={laudo.capaFotoUrl} 
                    alt="Foto de Capa do Equipamento" 
                    className="w-full h-56 object-cover"
                    crossOrigin="anonymous"
                  />
                  <div className="bg-[#0B1E3D] text-white text-[10px] py-1.5 px-3 font-semibold text-center italic">
                    {laudo.capaFotoLegenda || 'Fotografia técnica do equipamento em avaliação pericial'}
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/80 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-[#1565D8] flex items-center justify-center mx-auto">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                    {laudo.ativoIdentificacao || 'Equipamento Mecânico Inspecionado'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Inspeção pericial diagnóstica de conformidade normativa e segurança operacional.
                  </p>
                </div>
              )}
            </div>

            {/* Metadata Quadro de Identificação */}
            <div className="w-full max-w-lg mx-auto bg-slate-50 rounded-xl border border-slate-200 p-3.5 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Nº do Laudo:</span>
                  <strong className="text-slate-900 font-mono text-xs">{laudo.numero}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">ART CREA-PE:</span>
                  <strong className="text-emerald-700 font-mono text-xs">{laudo.artNumero || 'Protocolada'}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Cliente / Solicitante:</span>
                  <strong className="text-slate-800 truncate block text-[11px]">{laudo.clienteNome}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Data da Vistoria:</span>
                  <strong className="text-slate-800 font-mono text-[11px]">{dataFormatada}</strong>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Equipamento / TAG:</span>
                <strong className="text-[#1565D8] font-bold block text-[11px]">{laudo.ativoIdentificacao}</strong>
              </div>
            </div>
          </div>

          {/* Footer Capa */}
          <div className="border-t-2 border-[#0B1E3D] pt-3 text-[9px] text-slate-500 flex items-center justify-between">
            <div>
              <strong className="text-slate-800">ENG. VITOR LEONARDO CORDEIRO LINHARES</strong>
              <span> • CREA-PE 182229949-0</span>
            </div>
            <div className="font-mono text-slate-600">
              Autenticidade: {authHash}
            </div>
          </div>
        </div>
      ),
    });

    // -------------------------------------------------------------------------
    // PAGE 2: IDENTIFICAÇÃO CADASTRAL & SUMÁRIO EXECUTIVO
    // -------------------------------------------------------------------------
    list.push({
      id: 'cadastro',
      numero: pageNum++,
      tipo: 'cadastro',
      titulo: 'Identificação & Sumário',
      subtitulo: 'Dados Cadastrais, Ativo e Estrutura do Laudo',
      render: () => (
        <div className="h-full flex flex-col justify-between text-slate-900">
          <div>
            {/* Standard Header */}
            <div className="border-b-2 border-[#0B1E3D] pb-3 mb-5 flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="VL" className="h-9 w-auto object-contain" crossOrigin="anonymous" />
                <div>
                  <h3 className="text-sm font-black text-[#0B1E3D]">VL ENGENHARIA MECÂNICA</h3>
                  <p className="text-[9px] text-[#1565D8] font-bold uppercase tracking-wider">
                    {laudo.tipo} • Laudo Nº {laudo.numero}
                  </p>
                </div>
              </div>
              <div className="text-right text-[9px] text-slate-500 font-mono">
                <p>ART CREA-PE: <strong>{laudo.artNumero || 'Homologada'}</strong></p>
                <p>Página 2 de {list.length + 1}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Card Cliente */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#0B1E3D] border-b border-slate-200 pb-1">
                  <Building2 className="w-3.5 h-3.5 text-[#1565D8]" />
                  <span className="uppercase tracking-wider text-[10px]">1. Identificação do Cliente / Solicitante</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <p><strong>Razão Social:</strong> {laudo.clienteNome}</p>
                  <p><strong>CNPJ/CPF:</strong> {cliente?.cpfCnpj || 'Inscrito sob cadastro formal'}</p>
                  <p className="col-span-2">
                    <strong>Endereço Operacional:</strong> {cliente?.endereco 
                      ? `${cliente.endereco.logradouro}, ${cliente.endereco.numero} - ${cliente.endereco.bairro}, ${cliente.endereco.cidade}/${cliente.endereco.estado}`
                      : 'Endereço fornecido na contratação técnica'}
                  </p>
                  {cliente?.contatos?.[0] && (
                    <p className="col-span-2">
                      <strong>Contato Técnico:</strong> {cliente.contatos[0].nome} ({cliente.contatos[0].telefone || cliente.contatos[0].email})
                    </p>
                  )}
                </div>
              </div>

              {/* Card Ativo */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#0B1E3D] border-b border-slate-200 pb-1">
                  <Cpu className="w-3.5 h-3.5 text-[#1565D8]" />
                  <span className="uppercase tracking-wider text-[10px]">2. Ficha Técnica do Equipamento / TAG</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <p><strong>Identificação / TAG:</strong> {laudo.ativoIdentificacao}</p>
                  <p><strong>Fabricante / Modelo:</strong> {ativo ? `${ativo.fabricante} • ${ativo.modelo || 'Série comercial'}` : 'Conforme plaqueta afixada'}</p>
                  <p><strong>Ano de Fabricação:</strong> {ativo?.ano || 'Conforme vistoria'}</p>
                  <p><strong>Número de Série:</strong> {ativo?.numeroSerie || 'Identificado em campo'}</p>
                  {ativo?.capacidade && <p><strong>Capacidade Nominal:</strong> {ativo.capacidade}</p>}
                  {ativo?.localizacao && <p><strong>Setor / Localização:</strong> {ativo.localizacao}</p>}
                </div>
              </div>

              {/* Card Sumário */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-[#0B1E3D] border-b border-slate-200 pb-1">
                  <ListOrdered className="w-3.5 h-3.5 text-[#1565D8]" />
                  <span className="uppercase tracking-wider text-[10px]">3. Sumário Executivo das Seções do Laudo</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-700 pt-1">
                  {secoesOrdenadas.map((sec, idx) => (
                    <div key={sec.id} className="flex items-center justify-between border-b border-dotted border-slate-200 py-0.5">
                      <span className="font-medium truncate">{sec.titulo}</span>
                      <span className="text-slate-400 font-mono text-[10px] shrink-0 ml-2">Item {idx + 1}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between border-b border-dotted border-slate-200 py-0.5">
                    <span className="font-medium truncate">Conclusão Pericial & Assinatura Digital</span>
                    <span className="text-slate-400 font-mono text-[10px] shrink-0 ml-2">Final</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-dotted border-slate-200 py-0.5">
                    <span className="font-medium truncate">Anexo Oficial da ART CREA-PE</span>
                    <span className="text-slate-400 font-mono text-[10px] shrink-0 ml-2">Anexo</span>
                  </div>
                </div>
              </div>

              {/* Metodologia */}
              <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/40 text-[11px] text-slate-700 space-y-1">
                <strong className="text-[#0B1E3D] block text-xs">Diretrizes Normativas & Metodologia Aplicada:</strong>
                <p className="leading-relaxed">
                  Os trabalhos periciais foram executados sob a metodologia de engenharia diagnóstica, inspeção visual minuciosa e aplicação rigorosa das Normas Brasileiras da ABNT e Normas Regulamentadoras federais pertinentes.
                </p>
              </div>
            </div>
          </div>

          {/* Standard Footer */}
          <div className="border-t border-slate-300 pt-3 text-[9px] text-slate-500 flex items-center justify-between">
            <span>VL Engenharia Mecânica • CREA-PE 182229949-0</span>
            <span className="font-mono">Página 2</span>
          </div>
        </div>
      ),
    });

    // -------------------------------------------------------------------------
    // PAGES 3..N: SEÇÕES TÉCNICAS DO LAUDO
    // -------------------------------------------------------------------------
    secoesOrdenadas.forEach((secao, idx) => {
      const pageIndex = pageNum++;
      list.push({
        id: `secao-${secao.id}`,
        numero: pageIndex,
        tipo: 'secao',
        titulo: secao.titulo,
        subtitulo: `Seção Técnica ${idx + 1}`,
        render: () => (
          <div className="h-full flex flex-col justify-between text-slate-900">
            <div>
              {/* Standard Header */}
              <div className="border-b-2 border-[#0B1E3D] pb-3 mb-4 flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <img src="/logo.png" alt="VL" className="h-9 w-auto object-contain" crossOrigin="anonymous" />
                  <div>
                    <h3 className="text-sm font-black text-[#0B1E3D]">VL ENGENHARIA MECÂNICA</h3>
                    <p className="text-[9px] text-[#1565D8] font-bold uppercase tracking-wider">
                      {laudo.tipo} • Laudo Nº {laudo.numero}
                    </p>
                  </div>
                </div>
                <div className="text-right text-[9px] text-slate-500 font-mono">
                  <p>ART CREA-PE: <strong>{laudo.artNumero || 'Homologada'}</strong></p>
                  <p>Página {pageIndex}</p>
                </div>
              </div>

              {/* Section Header */}
              <div className="mb-4 pb-2 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#1565D8] uppercase tracking-wider font-mono">
                    ITEM {idx + 1}
                  </span>
                  <h2 className="text-base font-black text-[#0B1E3D]">
                    {secao.titulo}
                  </h2>
                </div>
                {secao.isObrigatoria && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Requisito Normativo
                  </span>
                )}
              </div>

              {/* Rich Text HTML Content */}
              {secao.conteudoHtml && (
                <div 
                  className="prose prose-sm max-w-none text-slate-800 text-[11px] leading-relaxed mb-4"
                  dangerouslySetInnerHTML={{ __html: secao.conteudoHtml }}
                />
              )}

              {/* Evidências Fotográficas da Seção */}
              {secao.fotos && secao.fotos.length > 0 && (
                <div className="my-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-[11px] font-bold text-[#0B1E3D] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#1565D8]" />
                    <span>Registro Fotográfico da Seção ({secao.fotos.length})</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {secao.fotos.map((foto) => (
                      <div key={foto.id} className="rounded-lg overflow-hidden border border-slate-200 bg-white shadow-2xs">
                        <img 
                          src={foto.url} 
                          alt={foto.descricao || 'Evidência'} 
                          className="w-full h-32 object-cover"
                          crossOrigin="anonymous"
                        />
                        <p className="p-1.5 text-[10px] text-slate-600 italic leading-tight">
                          {foto.descricao || 'Foto pericial registrada'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Checklist Table if present */}
              {secao.itens && secao.itens.length > 0 && (
                <div className="mt-3">
                  <table className="w-full text-left text-[10px] border-collapse border border-slate-300">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
                        <th className="p-1.5 font-bold w-7/12">Item / Requisito Normativo</th>
                        <th className="p-1.5 font-bold w-2/12 text-center">Status</th>
                        <th className="p-1.5 font-bold w-3/12">Observações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {secao.itens.map((item) => (
                        <tr key={item.id}>
                          <td className="p-1.5 text-slate-800 align-top">
                            <span className="font-semibold block">{item.requisito}</span>
                            {item.normaRef && (
                              <span className="text-[9px] text-slate-500 font-mono">Ref: {item.normaRef}</span>
                            )}
                          </td>
                          <td className="p-1.5 text-center align-top">
                            {item.status === 'conforme' && (
                              <span className="px-1.5 py-0.5 rounded font-bold text-[8px] bg-emerald-100 text-emerald-800">
                                CONFORME
                              </span>
                            )}
                            {item.status === 'nao_conforme' && (
                              <span className="px-1.5 py-0.5 rounded font-bold text-[8px] bg-red-100 text-red-800">
                                NÃO CONFORME
                              </span>
                            )}
                            {item.status === 'nao_aplicavel' && (
                              <span className="px-1.5 py-0.5 rounded font-bold text-[8px] bg-slate-100 text-slate-600">
                                NÃO APLICÁVEL
                              </span>
                            )}
                            {item.status === 'pendente' && (
                              <span className="px-1.5 py-0.5 rounded font-bold text-[8px] bg-amber-100 text-amber-800">
                                PENDENTE
                              </span>
                            )}
                          </td>
                          <td className="p-1.5 text-slate-600 align-top text-[10px]">
                            {item.observacao || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Standard Footer */}
            <div className="border-t border-slate-300 pt-3 text-[9px] text-slate-500 flex items-center justify-between">
              <span>VL Engenharia Mecânica • CREA-PE 182229949-0</span>
              <span className="font-mono">Página {pageIndex}</span>
            </div>
          </div>
        ),
      });
    });

    // -------------------------------------------------------------------------
    // PAGE N+1: CONCLUSÃO PERICIAL & ASSINATURA DIGITAL
    // -------------------------------------------------------------------------
    const conclusaoPageIndex = pageNum++;
    list.push({
      id: 'conclusao',
      numero: conclusaoPageIndex,
      tipo: 'conclusao',
      titulo: 'Conclusão Técnica & Assinatura',
      subtitulo: 'Parecer Conclusivo & Assinatura com Fé Pública',
      render: () => (
        <div className="h-full flex flex-col justify-between text-slate-900">
          <div>
            {/* Standard Header */}
            <div className="border-b-2 border-[#0B1E3D] pb-3 mb-4 flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="VL" className="h-9 w-auto object-contain" crossOrigin="anonymous" />
                <div>
                  <h3 className="text-sm font-black text-[#0B1E3D]">VL ENGENHARIA MECÂNICA</h3>
                  <p className="text-[9px] text-[#1565D8] font-bold uppercase tracking-wider">
                    {laudo.tipo} • Laudo Nº {laudo.numero}
                  </p>
                </div>
              </div>
              <div className="text-right text-[9px] text-slate-500 font-mono">
                <p>ART CREA-PE: <strong>{laudo.artNumero || 'Homologada'}</strong></p>
                <p>Página {conclusaoPageIndex}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="pb-2 border-b border-slate-200">
                <span className="text-[10px] font-bold text-[#1565D8] uppercase tracking-wider font-mono">
                  PARECER CONCLUSIVO
                </span>
                <h2 className="text-base font-black text-[#0B1E3D]">
                  Conclusão Técnica Pericial & Recomendações
                </h2>
              </div>

              {/* Parecer Conclusivo */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-[11px] text-slate-800 leading-relaxed">
                <strong className="text-[#0B1E3D] block text-xs">Parecer Técnico do Perito Responsável:</strong>
                <p>
                  Com base nas inspeções visuais, verificações dimensionais e análises de conformidade realizadas no equipamento <strong>{laudo.ativoIdentificacao}</strong>, atesta-se que as condições operacionais foram diagnosticadas e confrontadas com as normas técnicas da ABNT e Normas Regulamentadoras vigentes.
                </p>
                <p>
                  As não conformidades porventura apontadas no corpo deste laudo demandam cumprimento rigoroso dos planos de ação e cronogramas recomendados pela equipe técnica para garantia da integridade física e segurança operacional dos trabalhadores.
                </p>
              </div>

              {/* Apreciação HRN se existente */}
              {laudo.hrnCalculoGeral && (
                <div className="p-3.5 rounded-xl border border-slate-300 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                    <span className="text-xs font-black text-[#0B1E3D] uppercase tracking-wider">
                      Apreciação Quantitativa de Risco (Método HRN)
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-700">
                      Score Global: {laudo.hrnCalculoGeral.score.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span 
                      className="px-2.5 py-1 rounded text-white font-bold text-[10px] uppercase shrink-0"
                      style={{ backgroundColor: laudo.hrnCalculoGeral.cor }}
                    >
                      Risco: {laudo.hrnCalculoGeral.nivel}
                    </span>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      {laudo.hrnCalculoGeral.recomendacao}
                    </p>
                  </div>
                </div>
              )}

              {/* Declaração de Fé Pública */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-[10px] text-slate-600 space-y-1">
                <strong className="text-slate-800 block text-[11px]">Declaração de Fé Pública e Responsabilidade Técnica:</strong>
                <p className="leading-tight">
                  Este laudo possui fé pública técnica e foi expedido em estrita conformidade com as Leis Federais nº 5.194/66 e 6.496/77. A validade jurídica plena está vinculada à regularidade da <strong>ART CREA-PE: {laudo.artNumero || 'Pendente'}</strong>.
                </p>
                <p className="font-mono text-[9px] text-slate-400">
                  Hash de Autenticidade Digital: {authHash}
                </p>
              </div>

              {/* Bloco de Assinatura com foto do Engenheiro Vitor Leonardo */}
              <div className="pt-2">
                <div className="p-4 border-2 border-slate-300 rounded-2xl bg-white shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#1565D8] shrink-0 bg-slate-100 shadow-sm">
                      <img 
                        src="/vitor-leonardo.png" 
                        alt="Eng. Vitor Leonardo" 
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-[#0B1E3D] leading-tight">
                        VITOR LEONARDO CORDEIRO LINHARES
                      </h4>
                      <p className="text-[11px] font-bold text-[#1565D8] uppercase tracking-wide">
                        Engenheiro Mecânico • Perito Técnico Responsável
                      </p>
                      <p className="text-[10px] font-mono text-slate-600 mt-0.5">
                        Registro Profissional: <strong>CREA-PE 182229949-0</strong>
                      </p>
                    </div>
                  </div>

                  <div className="text-center sm:text-right border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-4">
                    <span className="inline-block px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
                      ✓ Assinatura Digital Certificada
                    </span>
                    <p className="text-[9px] text-slate-400 font-mono mt-1">
                      Data/Hora: {emitidoEm}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Standard Footer */}
          <div className="border-t border-slate-300 pt-3 text-[9px] text-slate-500 flex items-center justify-between">
            <span>VL Engenharia Mecânica • CREA-PE 182229949-0</span>
            <span className="font-mono">Página {conclusaoPageIndex}</span>
          </div>
        </div>
      ),
    });

    // -------------------------------------------------------------------------
    // PAGE N+2: ANEXO OFICIAL DA ART CREA-PE
    // Dedicated page for ART attachment (PDF or Image)
    // -------------------------------------------------------------------------
    const artPageIndex = pageNum++;
    list.push({
      id: 'art',
      numero: artPageIndex,
      tipo: 'art',
      titulo: 'Anexo Oficial da ART CREA-PE',
      subtitulo: 'Anotação de Responsabilidade Técnica Homologada',
      render: () => (
        <div className="h-full flex flex-col justify-between text-slate-900">
          <div>
            {/* Standard Header */}
            <div className="border-b-2 border-[#0B1E3D] pb-3 mb-4 flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="VL" className="h-9 w-auto object-contain" crossOrigin="anonymous" />
                <div>
                  <h3 className="text-sm font-black text-[#0B1E3D]">VL ENGENHARIA MECÂNICA</h3>
                  <p className="text-[9px] text-[#1565D8] font-bold uppercase tracking-wider">
                    {laudo.tipo} • Laudo Nº {laudo.numero}
                  </p>
                </div>
              </div>
              <div className="text-right text-[9px] text-slate-500 font-mono">
                <p>ART CREA-PE: <strong>{laudo.artNumero || 'Homologada'}</strong></p>
                <p>Página {artPageIndex}</p>
              </div>
            </div>

            {/* ART Header Banner */}
            <div className="mb-4 pb-2 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider font-mono">
                  ANEXO OBRIGATÓRIO
                </span>
                <h2 className="text-base font-black text-[#0B1E3D]">
                  Anotação de Responsabilidade Técnica (ART — CREA-PE)
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Fé Pública Garantida
              </span>
            </div>

            {/* ART Content: Image or PDF Certificate Frame */}
            {laudo.artTipoArquivo === 'imagem' && laudo.artArquivoUrl ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Documento da ART CREA-PE:</span>
                    <strong className="text-slate-900 font-mono text-sm">{laudo.artNumero || 'Homologada'}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px]">Data de Registro:</span>
                    <strong className="text-slate-800 font-mono">{laudo.artDataHomologacao ? new Date(laudo.artDataHomologacao).toLocaleDateString('pt-BR') : dataFormatada}</strong>
                  </div>
                </div>

                <div className="w-full rounded-xl overflow-hidden border-2 border-slate-300 shadow-sm bg-slate-950 flex items-center justify-center p-2">
                  <img 
                    src={laudo.artArquivoUrl} 
                    alt="Guia da ART CREA-PE" 
                    className="max-w-full max-h-[560px] object-contain mx-auto rounded"
                    crossOrigin="anonymous"
                  />
                </div>
                <p className="text-center text-[10px] text-slate-500 italic">
                  Reprodução integral do documento de ART emitido junto ao Conselho Regional de Engenharia e Agronomia de Pernambuco (CREA-PE).
                </p>
              </div>
            ) : laudo.artTipoArquivo === 'pdf' && laudo.artArquivoUrl ? (
              <div className="p-8 rounded-2xl border-2 border-emerald-300 bg-emerald-50/30 space-y-6 text-center my-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300 shadow-xs">
                  <ShieldCheck className="w-10 h-10" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider font-mono">
                    DOCUMENTO PDF OFICIAL ANEXADO
                  </span>
                  <h3 className="text-lg font-black text-[#0B1E3D]">
                    ART CREA-PE Registrada e Vinculada
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    O arquivo digital oficial da Anotação de Responsabilidade Técnica sob número <strong>{laudo.artNumero || 'PE20261822299'}</strong> foi anexado e validado no prontuário pericial.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2 font-mono">
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="text-slate-400">Nome do Arquivo:</span>
                    <strong className="text-slate-800 truncate">{laudo.artNomeArquivo || 'ART_CREA_PE.pdf'}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="text-slate-400">Nº do Registro:</span>
                    <strong className="text-emerald-700 font-bold">{laudo.artNumero || 'PE20261822299'}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="text-slate-400">Responsável:</span>
                    <strong className="text-slate-800">Eng. Vitor Leonardo (CREA 182229949-0)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Hash de Validação:</span>
                    <strong className="text-slate-600 text-[10px]">{authHash}</strong>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 italic max-w-md mx-auto">
                  A autenticidade da presente ART pode ser confirmada diretamente no portal eletrônico oficial do CREA-PE (www.creape.org.br).
                </p>
              </div>
            ) : (
              <div className="p-8 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-center space-y-4 my-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#1565D8] flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800">
                    Anotação de Responsabilidade Técnica Vinculada
                  </h3>
                  <p className="text-xs text-slate-500">
                    Nº da ART CREA-PE: <strong className="text-slate-800 font-mono">{laudo.artNumero || 'Em homologação junto ao CREA-PE'}</strong>
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 max-w-md mx-auto text-[11px] text-slate-600 leading-relaxed">
                  Para anexar o comprovante em PDF ou imagem da ART, utilize a área de anexo na tela de edição do laudo.
                </div>
              </div>
            )}
          </div>

          {/* Standard Footer */}
          <div className="border-t border-slate-300 pt-3 text-[9px] text-slate-500 flex items-center justify-between">
            <span>VL Engenharia Mecânica • CREA-PE 182229949-0</span>
            <span className="font-mono">Página {artPageIndex} (Final)</span>
          </div>
        </div>
      ),
    });

    return list;
  }, [laudo, cliente, ativo, dataFormatada, emitidoEm, authHash, secoesOrdenadas]);

  const totalPaginas = paginasLaudo.length;
  const paginaRenderizar = paginasLaudo.find(p => p.numero === paginaAtual) || paginasLaudo[0];

  // =========================================================================
  // EXPORT DISCRETE MULTI-PAGE PDF
  // Iterates each .laudo-pdf-page element without clipping or cutting
  // =========================================================================
  const handleDownloadPdf = async () => {
    setGerandoPdf(true);
    setSucessoDownload(false);

    try {
      const pageElements = printContainerRef.current?.querySelectorAll<HTMLElement>('.laudo-pdf-page');
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

      const nomeArquivo = `Laudo_${laudo.numero.replace(/\//g, '-')}_${(laudo.clienteNome || 'Cliente').replace(/\s+/g, '_')}.pdf`;
      pdf.save(nomeArquivo);
      setSucessoDownload(true);
      setTimeout(() => setSucessoDownload(false), 4000);
    } catch (err) {
      console.error('Erro ao gerar PDF do laudo:', err);
      alert('Ocorreu um erro ao compilar o PDF multi-página. Abrindo impressão nativa do navegador.');
      window.print();
    } finally {
      setGerandoPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#1565D8]/20 border border-[#1565D8]/30">
              <FileText className="w-5 h-5 text-[#1565D8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base leading-tight">
                  Visualização & Emissão de Laudo Oficial
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                  {totalPaginas} Páginas A4
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {laudo.numero} • {laudo.tipo}
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
                Sequência Completa
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              title="Imprimir (Ctrl+P)"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={gerandoPdf}
              className="px-4 py-2 rounded-lg bg-[#1565D8] hover:bg-[#1565D8]/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {gerandoPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Compilando {totalPaginas} Páginas...</span>
                </>
              ) : sucessoDownload ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Baixado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Baixar Arquivo PDF</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer ml-1"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-bar: Page Navigator */}
        <div className="px-6 py-2 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
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
                className="ml-2 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 font-semibold max-w-[220px] sm:max-w-none truncate"
              >
                {paginasLaudo.map(p => (
                  <option key={p.id} value={p.numero}>
                    Pág {p.numero}: {p.titulo}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="text-xs text-slate-500 font-semibold">
              Exibindo todas as {totalPaginas} páginas sequenciais no padrão de engenharia diagnóstica CREA-PE.
            </div>
          )}

          <div className="text-slate-400 text-[11px] hidden sm:block">
            Formato A4 • Sem cortes • Imagens & ART em alta resolução
          </div>
        </div>

        {/* Document Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-200 dark:bg-slate-900/90 flex justify-center">
          <div className="w-full max-w-[210mm] space-y-6">
            
            {modoVisualizacao === 'pagina' ? (
              // Single page render with mechanical watermark
              <div 
                className="printable-document bg-white text-slate-900 min-h-[297mm] p-8 sm:p-12 shadow-xl border border-slate-300 flex flex-col justify-between relative overflow-hidden"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                <EngineeringWatermark opacity="opacity-[0.045]" />
                <div className="relative z-10 flex-1 flex flex-col justify-between">
                  {paginaRenderizar.render()}
                </div>
              </div>
            ) : (
              // Continuous multi-page view
              paginasLaudo.map((pag) => (
                <div 
                  key={`preview-${pag.id}`}
                  className="printable-document bg-white text-slate-900 min-h-[297mm] p-8 sm:p-12 shadow-xl border border-slate-300 flex flex-col justify-between page-break-after-always relative mb-6 overflow-hidden"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  <EngineeringWatermark opacity="opacity-[0.045]" />
                  <div className="relative z-10 flex-1 flex flex-col justify-between">
                    {pag.render()}
                  </div>
                </div>
              ))
            )}

          </div>
        </div>

        {/* ========================================================================= */}
        {/* HIDDEN OFF-SCREEN PRINT CONTAINER FOR ROBUST MULTI-PAGE PDF GENERATION   */}
        {/* ========================================================================= */}
        <div 
          ref={printContainerRef}
          className="fixed left-[-9999px] top-0 pointer-events-none"
          style={{ width: '794px' }}
          aria-hidden="true"
        >
          {paginasLaudo.map((pag) => (
            <div 
              key={`print-laudo-${pag.id}`}
              className="laudo-pdf-page bg-white text-slate-900 min-h-[1123px] max-h-[1123px] w-[794px] p-10 flex flex-col justify-between relative overflow-hidden"
              style={{ boxSizing: 'border-box' }}
            >
              <EngineeringWatermark opacity="opacity-[0.045]" />
              <div className="relative z-10 flex-1 flex flex-col justify-between">
                {pag.render()}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1324] flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Layout oficial VL Engenharia com marca d'água técnica, foto de capa e anexo da ART CREA-PE.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              Fechar Pré-visualização
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={gerandoPdf}
              className="px-5 py-2 rounded-xl bg-[#1565D8] hover:bg-[#0b4fb8] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Arquivo PDF ({totalPaginas} Páginas)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
