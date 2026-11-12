import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, Sliders } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ChecklistModelosEditor } from './ChecklistModelosEditor';

export const GestaoView: React.FC = () => {
  const { auditLogs, usuarios } = useData();
  const [searchParams] = useSearchParams();
  const [abaAtiva, setAbaAtiva] = useState<'auditoria' | 'configuracoes'>(
    searchParams.get('tab') === 'modelos' ? 'configuracoes' : 'auditoria'
  );

  return (
    <div className="space-y-6 max-w-[1200px]">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight text-[var(--adm-text)]">
            Auditoria, acessos & configurações
          </h1>
          <p className="text-[var(--adm-mut)] text-[14px] sm:text-[15px] mt-0.5">
            Rastreabilidade de ações, perfis autorizados e modelos configuráveis de checklists de campo.
          </p>
        </div>

        <div className="inline-flex rounded-xl p-1 bg-[var(--adm-card)] border border-[var(--adm-line)] self-start">
          <button
            type="button"
            onClick={() => setAbaAtiva('auditoria')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer ${
              abaAtiva === 'auditoria'
                ? 'bg-[var(--adm-blue,#2160db)] text-white'
                : 'text-[var(--adm-mut)] hover:text-[var(--adm-text)]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Auditoria & Acessos</span>
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva('configuracoes')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer ${
              abaAtiva === 'configuracoes'
                ? 'bg-[var(--adm-blue,#2160db)] text-white'
                : 'text-[var(--adm-mut)] hover:text-[var(--adm-text)]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Configurações · Modelos de Checklist</span>
          </button>
        </div>
      </div>

      {abaAtiva === 'configuracoes' ? (
        <ChecklistModelosEditor />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 items-start">
          
          {/* Panel 1: Últimas ações (Audit Logs) */}
          <div className="bg-[var(--adm-card)] border border-[var(--adm-line)] rounded-2xl p-5 sm:p-6 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-bold text-[var(--adm-text)]">Últimas ações</h2>
              <span className="text-xs text-[var(--adm-mut)]">{auditLogs.length} registros</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px] min-w-[420px]">
                <thead>
                  <tr className="border-b border-[var(--adm-line)] text-[var(--adm-mut)] text-[12.5px]">
                    <th className="py-2.5 px-3 font-semibold">Hora</th>
                    <th className="py-2.5 px-3 font-semibold">Usuário</th>
                    <th className="py-2.5 px-3 font-semibold">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--adm-line)]">
                  {auditLogs.slice(0, 12).map((log) => {
                    const hora = new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    return (
                      <tr key={log.id}>
                        <td className="py-2.5 px-3 font-mono text-xs text-[var(--adm-mut)] align-top">
                          {hora}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-[var(--adm-text)] align-top">
                          {log.usuarioNome}
                        </td>
                        <td className="py-2.5 px-3 text-[var(--adm-mut)] align-top">
                          {log.detalhes || log.acao}
                        </td>
                      </tr>
                    );
                  })}

                  {auditLogs.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center py-8 text-[var(--adm-mut)]">
                        Nenhum registro de auditoria recente.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Panel 2: Acessos e Perfis */}
          <div className="bg-[var(--adm-card)] border border-[var(--adm-line)] rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-bold text-[var(--adm-text)]">Acessos</h2>
              <span className="text-xs text-[var(--adm-mut)]">{usuarios.length} usuários</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px]">
                <thead>
                  <tr className="border-b border-[var(--adm-line)] text-[var(--adm-mut)] text-[12.5px]">
                    <th className="py-2.5 px-3 font-semibold">Pessoa</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Perfil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--adm-line)]">
                  {usuarios.map((u) => (
                    <tr key={u.uid}>
                      <td className="py-3 px-3 align-top">
                        <b className="block text-[var(--adm-text)] font-semibold">{u.nome}</b>
                        <small className="text-[var(--adm-mut)] text-xs block">{u.email}</small>
                      </td>
                      <td className="py-3 px-3 text-right align-top">
                        {u.role === 'master' ? (
                          <span className="tag-tech bl">Master</span>
                        ) : u.role === 'colaborador' ? (
                          <span className="tag-tech w">Campo</span>
                        ) : (
                          <span className="tag-tech ok">Cliente</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
