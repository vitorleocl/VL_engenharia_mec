import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardCheck, 
  Plus, 
  Search, 
  Camera, 
  CheckCircle2, 
  Wifi, 
  WifiOff, 
  Download, 
  Share2, 
  FileText,
  Upload,
  ArrowRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ChecklistCampoFormModal } from './ChecklistCampoFormModal';
import { ChecklistCampoPdfModal } from './ChecklistCampoPdfModal';
import { ChecklistCampo } from '../../types';

const ITENS_PADRAO_VISTORIA = [
  'Plaqueta de identificação do fabricante e número de série legíveis',
  'Proteções fixas e móveis instaladas e devidamente parafusadas',
  'Intertravamento de segurança com bloqueio e chave de ruptura positiva funcionando',
  'Botões de parada de emergência acessíveis e desarmando o comando de força',
  'Sinalização de segurança, advertências de riscos residuais e diagramas visíveis',
  'Fotos de todas as faces do equipamento e registro do aterramento elétrico'
];

export const ChecklistCampoView: React.FC = () => {
  const { checklistsCampo, clientes, ativos } = useData();
  const { currentUser, isOnline } = useAuth();
  const navigate = useNavigate();

  const [itensMarcados, setItensMarcados] = useState<Record<number, boolean>>({});
  const [fotosAnexadas, setFotosAnexadas] = useState<string[]>([]);
  const [toastMensagem, setToastMensagem] = useState<string | null>(null);
  const [modalFormAberto, setModalFormAberto] = useState(false);
  const [checklistVisualizandoPdf, setChecklistVisualizandoPdf] = useState<ChecklistCampo | null>(null);

  const showToast = (msg: string) => {
    setToastMensagem(msg);
    setTimeout(() => setToastMensagem(null), 2500);
  };

  const totalItens = ITENS_PADRAO_VISTORIA.length;
  const concluidos = Object.values(itensMarcados).filter(Boolean).length;
  const porcentagem = Math.round((concluidos / totalItens) * 100);

  const toggleItem = (idx: number) => {
    setItensMarcados(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleAnexarFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFotosAnexadas(prev => [...prev, reader.result as string]);
      showToast('Foto do equipamento anexada com sucesso!');
    };
    reader.readAsDataURL(file);
  };

  const handleEnviarAoLaudo = () => {
    showToast('Checklist e fotos sincronizados e enviados para elaboração do laudo!');
  };

  return (
    <div className="space-y-6 max-w-[1200px]">
      
      {/* Toast Notification */}
      {toastMensagem && (
        <div 
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--ink)] text-[var(--paper)] px-5 py-2.5 rounded-lg font-semibold text-sm shadow-xl flex items-center gap-2"
          role="status"
        >
          <CheckCircle2 className="w-4 h-4 text-[var(--green)]" />
          <span>{toastMensagem}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight">
              Checklist de campo
            </h1>
            <span className="tag-tech bl">
              Prensa hidráulica · Metalúrgica Recife
            </span>
          </div>
          <p className="text-[var(--muted)] text-[15px] sm:text-[16px]">
            Marque cada item durante a vistoria. Funciona sem internet e sincroniza automaticamente.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isOnline ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--green)] bg-[var(--card)] px-2.5 py-1 rounded-md border border-[var(--line)]">
              <Wifi className="w-3.5 h-3.5" />
              <span>Online sincronizado</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--warn)] bg-[var(--card)] px-2.5 py-1 rounded-md border border-[var(--line)]">
              <WifiOff className="w-3.5 h-3.5" />
              <span>Modo offline ativo</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => setModalFormAberto(true)}
            className="btn-tech pri text-[14.5px] px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Novo checklist</span>
          </button>
        </div>
      </div>

      {/* Active Field Inspection Panel */}
      <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-5 sm:p-7 max-w-3xl space-y-5">
        
        {/* Progress Bar & Counter */}
        <div>
          <div className="flex items-center justify-between text-sm font-bold mb-2">
            <span className="text-[var(--ink)]">
              {concluidos} de {totalItens} itens verificados
            </span>
            <span className="text-[var(--blue)] font-[family-name:var(--d)]">
              {porcentagem}% concluído
            </span>
          </div>
          <div className="h-2.5 bg-[var(--line)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[var(--blue)] transition-all duration-300 rounded-full"
              style={{ width: `${porcentagem}%` }}
            />
          </div>
        </div>

        {/* Checkable Inspection Items */}
        <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {ITENS_PADRAO_VISTORIA.map((texto, idx) => (
            <label 
              key={idx}
              className="flex items-start gap-3.5 py-3.5 cursor-pointer hover:bg-[var(--paper)] px-2 rounded-md transition-colors select-none"
            >
              <input
                type="checkbox"
                checked={!!itensMarcados[idx]}
                onChange={() => toggleItem(idx)}
                className="w-5 h-5 mt-0.5 rounded border-[var(--line)] text-[var(--blue)] focus:ring-[var(--blue)] cursor-pointer"
              />
              <span className={`text-[15px] font-[family-name:var(--b)] leading-snug ${
                itensMarcados[idx] ? 'line-through text-[var(--muted)] opacity-75' : 'text-[var(--ink)]'
              }`}>
                {texto}
              </span>
            </label>
          ))}
        </div>

        {/* Attached Photos Preview */}
        {fotosAnexadas.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider block">
              Fotos anexadas ({fotosAnexadas.length})
            </span>
            <div className="flex flex-wrap gap-2.5">
              {fotosAnexadas.map((foto, fIdx) => (
                <div 
                  key={fIdx}
                  className="w-20 h-20 rounded-lg border border-[var(--line)] bg-cover bg-center overflow-hidden shadow-xs"
                  style={{ backgroundImage: `url(${foto})` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-3">
          <label className="btn-tech text-[14.5px] cursor-pointer inline-flex items-center">
            <Camera className="w-4 h-4 mr-1.5 opacity-70" />
            <span>Anexar foto</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleAnexarFoto}
              className="sr-only"
            />
          </label>

          <button
            type="button"
            onClick={handleEnviarAoLaudo}
            className="btn-tech pri text-[14.5px] px-5"
          >
            <span>Enviar ao laudo</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </div>

      </div>

      {/* Historical Checklists List */}
      <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-5 max-w-3xl">
        <h2 className="text-[18px] font-bold mb-3">Histórico de vistorias em campo</h2>
        <div className="space-y-2">
          {checklistsCampo.map((chk) => {
            const cliente = clientes.find(c => c.id === chk.clienteId);
            return (
              <div 
                key={chk.id}
                className="flex items-center justify-between p-3 rounded-lg border border-[var(--line)] hover:bg-[var(--paper)] transition-colors text-sm"
              >
                <div>
                  <b className="block text-[var(--ink)] font-semibold">{chk.numero} · {chk.tipoLaudoNome || chk.categoriaLaudo}</b>
                  <span className="text-[var(--muted)] text-xs">
                    {cliente?.nomeFantasia || 'Cliente'} · {new Date(chk.dataPreenchimento || chk.criadoEm || Date.now()).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`tag-tech ${chk.status === 'finalizado' ? 'ok' : 'bl'}`}>
                    {chk.status === 'finalizado' ? 'Concluído' : 'Em andamento'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setChecklistVisualizandoPdf(chk)}
                    className="btn-tech sm text-xs"
                  >
                    Ver
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PDF and Form Modals */}
      {modalFormAberto && (
        <ChecklistCampoFormModal
          onSaved={() => setModalFormAberto(false)}
          onClose={() => setModalFormAberto(false)}
        />
      )}

      {checklistVisualizandoPdf && (
        <ChecklistCampoPdfModal
          checklist={checklistVisualizandoPdf}
          onClose={() => setChecklistVisualizandoPdf(null)}
        />
      )}

    </div>
  );
};
