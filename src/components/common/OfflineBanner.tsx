import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const OfflineBanner: React.FC = () => {
  const { isOnline } = useAuth();

  if (isOnline) return null;

  return (
    <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold shadow-md flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
        <WifiOff className="w-4 h-4 text-slate-950 shrink-0 animate-pulse" />
        <span>
          <strong>Modo Offline Ativo:</strong> As alterações e checklists estão sendo salvas localmente no dispositivo. A sincronização com a nuvem ocorrerá automaticamente assim que o sinal de internet for restabelecido.
        </span>
      </div>
    </div>
  );
};
