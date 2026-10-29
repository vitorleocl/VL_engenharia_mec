import React from 'react';
import { ShieldCheck, UserCheck, Key, History, Plus } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export const GestaoView: React.FC = () => {
  const { auditLogs, usuarios } = useData();
  const { currentUser } = useAuth();

  return (
    <div className="space-y-6 max-w-[1200px]">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight">
            Auditoria e acessos
          </h1>
          <p className="text-[var(--muted)] text-[15px] sm:text-[16px] mt-0.5">
            Quem fez o quê, e quem pode entrar. Visível exclusivamente para perfil Master.
          </p>
        </div>
      </div>

      {/* 2-column layout: Últimas ações & Acessos */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 items-start">
        
        {/* Panel 1: Últimas ações (Audit Logs) */}
        <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-5 sm:p-6 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-bold">Últimas ações</h2>
            <span className="text-xs text-[var(--muted)]">{auditLogs.length} registros</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14.5px] min-w-[420px]">
              <thead>
                <tr className="border-b-[1.5px] border-[var(--ink)] text-[var(--muted)] text-[13.5px] bg-[var(--paper)]">
                  <th className="py-2.5 px-3 font-semibold">Hora</th>
                  <th className="py-2.5 px-3 font-semibold">Usuário</th>
                  <th className="py-2.5 px-3 font-semibold">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {auditLogs.slice(0, 10).map((log) => {
                  const hora = new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                  return (
                    <tr key={log.id} className="hover:bg-[var(--paper)]">
                      <td className="py-2.5 px-3 font-mono text-xs text-[var(--muted)] align-top">
                        {hora}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-[var(--ink)] align-top">
                        {log.usuarioNome}
                      </td>
                      <td className="py-2.5 px-3 text-[var(--muted)] align-top">
                        {log.detalhes || log.acao}
                      </td>
                    </tr>
                  );
                })}

                {auditLogs.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-[var(--muted)]">
                      Nenhum registro de auditoria recente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel 2: Acessos e Perfis */}
        <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-bold">Acessos</h2>
            <span className="text-xs text-[var(--muted)]">{usuarios.length} usuários</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14.5px]">
              <thead>
                <tr className="border-b-[1.5px] border-[var(--ink)] text-[var(--muted)] text-[13.5px] bg-[var(--paper)]">
                  <th className="py-2.5 px-3 font-semibold">Pessoa</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Perfil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {usuarios.map((u) => (
                  <tr key={u.uid} className="hover:bg-[var(--paper)]">
                    <td className="py-3 px-3 align-top">
                      <b className="block text-[var(--ink)] font-semibold">{u.nome}</b>
                      <small className="text-[var(--muted)] text-xs block">{u.email}</small>
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

    </div>
  );
};
