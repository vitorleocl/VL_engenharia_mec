import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Printer, 
  ArrowLeft, 
  AlertTriangle,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { LaudoDocSheets } from './LaudoDocSheets';

export const LaudoPrintView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { laudos, clientes, ativos } = useData();

  const laudo = useMemo(() => {
    return laudos.find(l => l.id === id || l.numero === id);
  }, [laudos, id]);

  const cliente = useMemo(() => {
    return clientes.find(c => c.id === laudo?.clienteId || c.razaoSocial === laudo?.clienteNome);
  }, [clientes, laudo]);

  const ativo = useMemo(() => {
    return ativos.find(a => a.id === laudo?.ativoId || a.identificacao === laudo?.ativoIdentificacao);
  }, [ativos, laudo]);

  const clienteNome = laudo?.clienteNome || cliente?.razaoSocial || cliente?.nomeFantasia || 'Cliente';
  const numeroLaudo = (laudo?.numero || 'LAR-2026-001').replace('/', '-');
  const revisao = laudo?.revisao || '00';

  // Configurar título do documento para o nome do arquivo no download nativo
  useEffect(() => {
    if (laudo) {
      const clienteClean = clienteNome.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 25);
      document.title = `Laudo_${numeroLaudo}_${clienteClean}_Rev${revisao}`;
    }
  }, [laudo, clienteNome, numeroLaudo, revisao]);

  // Suporte a impressão automática via query parameter ?auto=1
  useEffect(() => {
    if (searchParams.get('auto') === '1' && laudo) {
      document.fonts?.ready?.then(() => {
        setTimeout(() => {
          window.print();
        }, 600);
      });
    }
  }, [searchParams, laudo]);

  const handlePrint = () => {
    window.print();
  };

  if (!laudo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-center text-white">
        <AlertTriangle className="w-12 h-12 text-amber-500 mb-3" />
        <h2 className="text-xl font-bold">Laudo técnico não encontrado</h2>
        <p className="text-slate-400 text-sm mt-1 mb-4">O código ou identificador informado não foi localizado no sistema.</p>
        <Link to="/admin/laudos" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition">
          Voltar para Central de Laudos
        </Link>
      </div>
    );
  }

  const isEmitido = laudo.status === 'finalizado';
  const temArt = Boolean(laudo.artNumero && laudo.artNumero !== 'Pendente' && laudo.artArquivoUrl);

  return (
    <div className="laudo-print-page bg-slate-800 min-h-screen text-slate-900">
      {/* Barra superior de controle na tela (Oculta na impressão @media print) */}
      <header className="no-print sticky top-0 z-50 bg-[#0B1E3D] text-white px-4 py-3 shadow-lg flex flex-wrap items-center justify-between gap-3 border-b border-blue-900/50">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(`/admin/laudos/${laudo.id}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Editor
          </button>
          <div className="hidden sm:block">
            <span className="text-xs text-blue-200 block">Laudo de Inspeção e Conformidade</span>
            <strong className="text-sm text-white font-mono">{laudo.numero} • {clienteNome}</strong>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <div className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 ${
            isEmitido && temArt 
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}>
            {isEmitido && temArt ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Emitido com ART ({laudo.artNumero})</span>
              </>
            ) : (
              <>
                <FileCheck className="w-3.5 h-3.5" />
                <span>Minuta {!temArt ? '(ART pendente)' : '(Rascunho)'}</span>
              </>
            )}
          </div>

          {/* Botão de impressão nativa vetorial (menos de 500 KB) */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-lg shadow-md transition transform active:scale-95"
            title="Gera PDF vetorial com texto selecionável e links ativos via motor Chromium"
          >
            <Printer className="w-4 h-4" />
            <span>Baixar PDF / Imprimir</span>
          </button>
        </div>
      </header>

      {/* Renderização das 6 folhas A4 do modelo aprovado */}
      <div className="laudo-preview-container py-6 flex flex-col items-center">
        <LaudoDocSheets 
          laudo={laudo} 
          cliente={cliente} 
          ativo={ativo} 
        />
      </div>
    </div>
  );
};
