import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  CheckCircle2, 
  FileText, 
  Building, 
  Calendar, 
  UserCheck, 
  Hash, 
  ArrowLeft,
  ExternalLink,
  Lock,
  Printer
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { VlLogoVector } from '../admin/PropostaViewerModal';

export const VerificacaoPublicaView: React.FC = () => {
  const { codigo } = useParams<{ codigo?: string }>();
  const [searchParams] = useSearchParams();
  const { laudos, clientes, ativos } = useData();

  const [codigoInput, setCodigoInput] = useState<string>(codigo || searchParams.get('c') || '');

  useEffect(() => {
    if (codigo) {
      setCodigoInput(codigo);
    }
  }, [codigo]);

  const codigoNormalizado = codigoInput.trim().toUpperCase();

  // Busca o laudo pelo código de verificação ou pelo número do laudo
  const laudo = useMemo(() => {
    if (!codigoNormalizado) return null;
    const normalizar = (val?: string) =>
      (val || '')
        .toUpperCase()
        .replace(/^LAU-/, 'LAR-')
        .replace(/[^A-Z0-9]/g, '');
    const alvoNorm = normalizar(codigoNormalizado);

    return laudos.find(l => {
      const matchVerif = l.codigoVerificacao?.toUpperCase() === codigoNormalizado;
      const matchNum = l.numero?.toUpperCase() === codigoNormalizado;
      const matchId = l.id?.toUpperCase() === codigoNormalizado;
      const matchNormVerif = normalizar(l.codigoVerificacao) === alvoNorm;
      const matchNormNum = normalizar(l.numero) === alvoNorm;
      return matchVerif || matchNum || matchId || matchNormVerif || matchNormNum;
    });
  }, [laudos, codigoNormalizado]);

  const cliente = useMemo(() => {
    if (!laudo) return null;
    return clientes.find(c => c.id === laudo.clienteId || c.razaoSocial === laudo.clienteNome);
  }, [clientes, laudo]);

  const ativo = useMemo(() => {
    if (!laudo) return null;
    return ativos.find(a => a.id === laudo.ativoId || a.identificacao === laudo.ativoIdentificacao);
  }, [ativos, laudo]);

  const clienteNome = laudo?.clienteNome || cliente?.razaoSocial || 'Cliente Registrado';
  const cnpjCliente = laudo?.clienteCnpj || cliente?.cpfCnpj || cliente?.cnpj || 'Consulte documento';
  const ativoTag = laudo?.ativoIdentificacao || ativo?.identificacao || 'Ativo Avaliado';
  const fabricante = laudo?.ativoFabricante || ativo?.fabricante || 'Geral';
  const modelo = laudo?.ativoModelo || ativo?.modelo || 'Não especificado';

  const isEmitido = laudo?.status === 'finalizado';
  const temArt = Boolean(laudo?.artNumero && laudo?.artNumero !== 'Pendente' && laudo?.artArquivoUrl);
  const isAutentico = Boolean(laudo && isEmitido && temArt);

  const formatarParecer = (p?: string) => {
    switch (p) {
      case 'liberado':
        return { label: 'LIBERADO PARA OPERAÇÃO', color: 'emerald' };
      case 'liberado_restricoes':
        return { label: 'LIBERADO COM RESTRIÇÕES TÉCNICAS', color: 'amber' };
      case 'nao_liberado':
        return { label: 'NÃO LIBERADO / INTERDITADO', color: 'rose' };
      default:
        return { label: 'EM PROCESSO DE ANÁLISE / MINUTA', color: 'slate' };
    }
  };

  const parecerInfo = formatarParecer(laudo?.parecer);

  return (
    <div className="min-h-screen bg-[#0B1528] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-[#0E1A34]/80 backdrop-blur-md sticky top-0 z-20 px-4 py-3 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <VlLogoVector className="h-8 w-auto" style={{ width: '150px', height: '28px' }} />
            <div className="hidden sm:block border-l border-slate-700 pl-3">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
                Portal de Autenticidade Digital
              </span>
              <span className="text-[10px] text-slate-500">
                Resolução CONFEA / CREA-PE nº 1.025
              </span>
            </div>
          </div>

          <Link
            to="/admin/laudos"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Acessar Painel Técnico</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full p-4 sm:p-8 flex-1 flex flex-col justify-center">
        {/* Search Bar if needed */}
        <div className="mb-6 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Verificar Autenticidade de Laudo Técnico ou ART
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={codigoInput}
                onChange={(e) => setCodigoInput(e.target.value)}
                placeholder="Ex: LAR-2026-001-7K4Q ou LAR-2026-001"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-hidden font-mono uppercase"
              />
            </div>
          </div>
        </div>

        {/* Verification Result Card */}
        {codigoNormalizado && (
          <div className="bg-[#0f1d38] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden transition-all">
            {laudo ? (
              <div>
                {/* Result Status Banner */}
                <div className={`p-6 border-b ${
                  isAutentico 
                    ? 'bg-gradient-to-r from-emerald-950/80 to-teal-950/60 border-emerald-800/60' 
                    : 'bg-gradient-to-r from-amber-950/80 to-orange-950/60 border-amber-800/60'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl ${isAutentico ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {isAutentico ? <ShieldCheck className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isAutentico ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {isAutentico ? 'Registro Válido e Autenticado' : 'Documento em Revisão / Minuta'}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          Revisão {laudo.revisao || '00'}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-white tracking-tight">
                        {isAutentico 
                          ? 'Laudo Técnico Pericial Homologado' 
                          : 'Minuta Técnica Ilustrativa (Não Homologada)'}
                      </h2>
                      <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                        {isAutentico
                          ? 'Este documento pericial foi emitido com responsabilidade técnica formalizada e possui ART registrada perante o Conselho Regional de Engenharia e Agronomia (CREA-PE).'
                          : 'Este registro ainda não possui ART homologada ou status de emissão final. Não possui validade como laudo conclusivo.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/80">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span className="font-semibold uppercase tracking-wider text-[10px]">Identificação do Laudo</span>
                    </div>
                    <p className="text-sm font-bold text-white font-mono">{laudo.numero}</p>
                    <p className="text-slate-300 mt-0.5">{laudo.tipo || 'Laudo de Inspeção e Integridade Estrutural'}</p>
                    <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between text-slate-400">
                      <span>Data da Vistoria: <b>{laudo.dataInspecao}</b></span>
                      <span>Emissão: <b>{laudo.emitidoEm || 'Pendente'}</b></span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/80">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Building className="w-4 h-4 text-blue-400" />
                      <span className="font-semibold uppercase tracking-wider text-[10px]">Contratante / Proprietário</span>
                    </div>
                    <p className="text-sm font-bold text-white">{clienteNome}</p>
                    <p className="text-slate-300 mt-0.5">CNPJ: {cnpjCliente}</p>
                    <p className="text-slate-400 mt-0.5">Local: {laudo.localVistoria || 'Região Metropolitana de Recife, PE'}</p>
                  </div>

                  <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/80">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Lock className="w-4 h-4 text-blue-400" />
                      <span className="font-semibold uppercase tracking-wider text-[10px]">Equipamento Inspecionado</span>
                    </div>
                    <p className="text-sm font-bold text-white font-mono">{ativoTag}</p>
                    <p className="text-slate-300 mt-0.5">{fabricante} • {modelo}</p>
                    <p className="text-slate-400 mt-0.5">Série: {laudo.ativoNumeroSerie || 'Cadastrada em ficha'}</p>
                  </div>

                  <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/80">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <UserCheck className="w-4 h-4 text-blue-400" />
                      <span className="font-semibold uppercase tracking-wider text-[10px]">Responsabilidade Técnica</span>
                    </div>
                    <p className="text-sm font-bold text-white">Eng. Vitor Leonardo Cordeiro Leão</p>
                    <p className="text-slate-300 mt-0.5">CREA-PE: 062837 • Engenheiro Mecânico</p>
                    <p className="text-emerald-400 mt-0.5 font-semibold">
                      ART CREA-PE: {laudo.artNumero || 'Em tramitação'}
                    </p>
                  </div>
                </div>

                {/* Parecer Pericial Block */}
                <div className="px-6 pb-6">
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Conclusão e Parecer Pericial do Engenheiro
                      </span>
                      <span className={`text-sm font-bold px-3 py-1 rounded-md inline-block ${
                        parecerInfo.color === 'emerald' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        parecerInfo.color === 'amber' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {parecerInfo.label}
                      </span>
                      {laudo.justificativaParecer && (
                        <p className="text-xs text-slate-300 mt-2 italic max-w-xl">
                          "{laudo.justificativaParecer}"
                        </p>
                      )}
                    </div>

                    <div className="border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4 text-right">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                        Código de Verificação Pública
                      </span>
                      <span className="font-mono text-sm text-blue-300 font-bold block mt-0.5">
                        {laudo.codigoVerificacao || `${laudo.numero}-7K4Q`}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                        Hash SHA-256: {laudo.hashPdf || 'd4e5f6...a1b2'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white">Registro não localizado</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
                  Não encontramos nenhum laudo ou documento técnico correspondente ao código <b>{codigoNormalizado}</b>. Verifique se o código foi digitado corretamente ou consulte a empresa emissora.
                </p>
              </div>
            )}
          </div>
        )}

        {!codigoNormalizado && (
          <div className="text-center py-12 text-slate-400">
            <ShieldCheck className="w-16 h-16 text-blue-500/40 mx-auto mb-4" />
            <h3 className="text-base font-bold text-white">Insira o código de verificação acima</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              O código de verificação está impresso no rodapé e no bloco de autenticidade da última folha de cada laudo emitido pela VL Engenharia.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0B1528] py-4 px-6 text-center text-slate-500 text-xs">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>VL Engenharia Mecânica e Diagnósticos LTDA • CNPJ 53.840.402/0001-44</span>
          <span>Recife, Pernambuco • CREA-PE 062837</span>
        </div>
      </footer>
    </div>
  );
};
