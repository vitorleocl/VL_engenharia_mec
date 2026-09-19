import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  ShieldAlert, 
  Users, 
  Sparkles, 
  Building, 
  Download, 
  History, 
  Key, 
  Plus, 
  Save, 
  AlertTriangle, 
  CheckCircle2, 
  UserCheck,
  FileDown,
  Edit2,
  Trash2,
  X,
  Check,
  Shield,
  Briefcase,
  UserX,
  Mail
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Usuario } from '../../types';

export const GestaoView: React.FC = () => {
  const { 
    auditLogs, 
    usoIA, 
    atualizarLimiteIA, 
    clientes, 
    ativos, 
    laudos, 
    orcamentos,
    usuarios,
    atualizarUsuario,
    removerUsuario,
    adicionarUsuarioConvidado
  } = useData();
  const { currentUser } = useAuth();
  const location = useLocation();

  const [activeSubTab, setActiveSubTab] = useState<'usuarios' | 'auditoria' | 'ia' | 'empresa' | 'backup'>('usuarios');

  useEffect(() => {
    if (location.pathname.includes('/usuarios')) {
      setActiveSubTab('usuarios');
    } else if (location.pathname.includes('/auditoria')) {
      setActiveSubTab('auditoria');
    }
  }, [location.pathname]);

  // IA limits state
  const [limiteMensal, setLimiteMensal] = useState(usoIA.limiteMensal);

  // Enterprise Header Settings
  const [razaoEmpresa, setRazaoEmpresa] = useState('VL Engenharia Mecânica');
  const [creaEmpresa, setCreaEmpresa] = useState('CREA-PE 1822299490');
  const [responsavelNome, setResponsavelNome] = useState('Vitor Leonardo');
  const [artPadraoPrefixo, setArtPadraoPrefixo] = useState('PE2026-');

  // Form states for new user
  const [novoEmail, setNovoEmail] = useState('');
  const [novoNome, setNovoNome] = useState('');
  const [novoCargo, setNovoCargo] = useState('');
  const [novoCrea, setNovoCrea] = useState('');
  const [novoRole, setNovoRole] = useState<'master' | 'colaborador' | 'cliente'>('colaborador');
  const [novoClienteId, setNovoClienteId] = useState('');

  // Edit User Modal state
  const [usuarioParaEditar, setUsuarioParaEditar] = useState<Usuario | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCargo, setEditCargo] = useState('');
  const [editCrea, setEditCrea] = useState('');
  const [editRole, setEditRole] = useState<'master' | 'colaborador' | 'cliente'>('colaborador');
  const [editClienteId, setEditClienteId] = useState('');
  const [editAtivo, setEditAtivo] = useState(true);

  // Delete User Confirmation state
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState<Usuario | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  const showFeedback = (tipo: 'sucesso' | 'erro', texto: string) => {
    setFeedbackMsg({ tipo, texto });
    setTimeout(() => setFeedbackMsg(null), 4500);
  };

  const handleSalvarLimiteIA = () => {
    atualizarLimiteIA(Number(limiteMensal));
    showFeedback('sucesso', 'Limite mensal de chamadas IA atualizado com sucesso!');
  };

  const handleAdicionarUsuario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoEmail.trim() || !novoNome.trim()) {
      showFeedback('erro', 'Nome completo e e-mail são obrigatórios.');
      return;
    }

    const emailJaExiste = usuarios.some(u => u.email.toLowerCase() === novoEmail.trim().toLowerCase());
    if (emailJaExiste) {
      showFeedback('erro', `Já existe um usuário cadastrado com o e-mail: ${novoEmail.trim()}`);
      return;
    }

    adicionarUsuarioConvidado({
      nome: novoNome.trim(),
      email: novoEmail.trim().toLowerCase(),
      role: novoRole,
      cargo: novoCargo.trim() || undefined,
      crea: novoCrea.trim() || undefined,
      clienteId: novoRole === 'cliente' ? novoClienteId || undefined : undefined,
      ativo: true
    });

    setNovoEmail('');
    setNovoNome('');
    setNovoCargo('');
    setNovoCrea('');
    setNovoClienteId('');
    setNovoRole('colaborador');
    showFeedback('sucesso', `Usuário ${novoNome.trim()} cadastrado e autorizado com sucesso!`);
  };

  const handleAbrirEdicao = (u: Usuario) => {
    setUsuarioParaEditar(u);
    setEditNome(u.nome || '');
    setEditEmail(u.email || '');
    setEditCargo(u.cargo || '');
    setEditCrea(u.crea || '');
    setEditRole(u.role || 'colaborador');
    setEditClienteId(u.clienteId || '');
    setEditAtivo(u.ativo !== false);
  };

  const handleSalvarEdicao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioParaEditar) return;
    if (!editNome.trim() || !editEmail.trim()) {
      showFeedback('erro', 'Nome e e-mail são campos obrigatórios.');
      return;
    }

    // Não permitir alterar o papel do usuário logado se for o último master
    if (usuarioParaEditar.uid === 'master-vitor' && editRole !== 'master') {
      showFeedback('erro', 'A conta principal Master não pode ter seu nível de privilégio rebaixado.');
      return;
    }

    atualizarUsuario(usuarioParaEditar.uid, {
      nome: editNome.trim(),
      email: editEmail.trim().toLowerCase(),
      role: editRole,
      cargo: editCargo.trim() || undefined,
      crea: editCrea.trim() || undefined,
      clienteId: editRole === 'cliente' ? (editClienteId || undefined) : undefined,
      ativo: editAtivo,
    });

    setUsuarioParaEditar(null);
    showFeedback('sucesso', `Dados de ${editNome.trim()} atualizados com sucesso!`);
  };

  const handleConfirmarExclusao = () => {
    if (!usuarioParaExcluir) return;

    if (usuarioParaExcluir.uid === 'master-vitor' || usuarioParaExcluir.email.toLowerCase() === 'vitorleonardocl@gmail.com') {
      showFeedback('erro', 'A conta Master principal não pode ser excluída do sistema.');
      setUsuarioParaExcluir(null);
      return;
    }

    if (usuarioParaExcluir.uid === currentUser?.uid) {
      showFeedback('erro', 'Você não pode excluir sua própria conta enquanto estiver conectado.');
      setUsuarioParaExcluir(null);
      return;
    }

    const nome = usuarioParaExcluir.nome || usuarioParaExcluir.email;
    removerUsuario(usuarioParaExcluir.uid);
    setUsuarioParaExcluir(null);
    showFeedback('sucesso', `Usuário "${nome}" foi excluído com sucesso.`);
  };

  // JSON Export Backup
  const handleExportarBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      versao: '2.0',
      empresa: 'VL Engenharia',
      clientes,
      ativos,
      laudos,
      orcamentos,
      usuarios,
      auditLogs,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `backup-vl-engenharia-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const percentualIA = Math.round((usoIA.totalChamadas / usoIA.limiteMensal) * 100);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldAlert className="w-4 h-4 text-[#1565D8]" />
          <span>Área Restrita Master</span>
        </div>
        <h2 className="text-2xl font-black text-[#0B1E3D] tracking-tight">
          Gestão de Usuários, Auditoria e Governança
        </h2>
        <p className="text-xs text-slate-500 max-w-3xl mt-1">
          Painel central do Administrador Master para auditoria de eventos, controle orçamentário de consumo da IA Gemini, papéis de acesso e backup dos dados.
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { id: 'usuarios', label: 'Usuários & Permissões', icon: Users },
          { id: 'auditoria', label: 'Log de Auditoria', icon: History },
          { id: 'ia', label: 'Consumo & Cotas IA', icon: Sparkles },
          { id: 'empresa', label: 'Dados da Empresa & ART', icon: Building },
          { id: 'backup', label: 'Backup & Exportação', icon: Download },
        ].map((tab) => {
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                activeSubTab === tab.id
                  ? 'bg-[#0B1E3D] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Toast Feedback */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-bold border flex items-center justify-between shadow-md transition-all ${
            feedbackMsg.tipo === 'sucesso'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.tipo === 'sucesso' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedbackMsg.texto}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="p-1 hover:bg-black/5 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SUB-TAB 1: USUÁRIOS E PERMISSÕES */}
      {activeSubTab === 'usuarios' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#0B1E3D] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#1565D8]" />
                <span>Cadastrar Novo Usuário</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Convide engenheiros, inspetores técnicos de campo ou clientes para acesso com credenciais personalizadas.
              </p>
            </div>

            <form onSubmit={handleAdicionarUsuario} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Ex: Eng. Leonardo Albuquerque"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1565D8]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">E-mail de Acesso *</label>
                <input
                  type="email"
                  required
                  value={novoEmail}
                  onChange={(e) => setNovoEmail(e.target.value)}
                  placeholder="usuario@empresa.com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1565D8]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nível de Permissão (Role) *</label>
                <select
                  value={novoRole}
                  onChange={(e) => setNovoRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#1565D8]"
                >
                  <option value="colaborador">Colaborador Técnico (Vistorias, Laudos e Checklists)</option>
                  <option value="cliente">Cliente (Somente Leitura dos seus laudos e ARTs)</option>
                  <option value="master">Master (Acesso Completo e Governança)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cargo ou Especialidade</label>
                <input
                  type="text"
                  value={novoCargo}
                  onChange={(e) => setNovoCargo(e.target.value)}
                  placeholder="Ex: Inspetor Mecânico / Perito"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1565D8]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Registro CREA (se aplicável)</label>
                <input
                  type="text"
                  value={novoCrea}
                  onChange={(e) => setNovoCrea(e.target.value)}
                  placeholder="Ex: 1822299490 / CREA-PE"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1565D8]"
                />
              </div>

              {novoRole === 'cliente' ? (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cliente Vinculado</label>
                  <select
                    value={novoClienteId}
                    onChange={(e) => setNovoClienteId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#1565D8]"
                  >
                    <option value="">-- Selecione a Empresa do Cliente --</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.razaoSocial} {c.nomeFantasia ? `(${c.nomeFantasia})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-[#1565D8] hover:bg-[#0b4fb8] text-white font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Cadastrar Usuário</span>
                  </button>
                </div>
              )}

              {novoRole === 'cliente' && (
                <div className="sm:col-span-2 lg:col-span-3 flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-[#1565D8] hover:bg-[#0b4fb8] text-white font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Cadastrar Usuário</span>
                  </button>
                </div>
              )}
            </form>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-[#0B1E3D]">
                  Usuários Ativos e Autorizados ({usuarios.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Gerencie permissões de acesso, altere papéis ou remova colaboradores que não fazem mais parte da equipe.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Profissional / Usuário</th>
                    <th className="py-2.5 px-3">E-mail</th>
                    <th className="py-2.5 px-3">Papel (Role)</th>
                    <th className="py-2.5 px-3">Vínculo / Cargo</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Criado em</th>
                    <th className="py-2.5 px-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usuarios.map((u) => {
                    const isMasterPrincipal = u.uid === 'master-vitor' || u.email.toLowerCase() === 'vitorleonardocl@gmail.com';
                    const isCurrentUser = u.uid === currentUser?.uid;
                    const clienteVinculadoObj = u.clienteId ? clientes.find(c => c.id === u.clienteId) : null;
                    const ativo = u.ativo !== false;

                    return (
                      <tr key={u.uid} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-[#0B1E3D] flex items-center gap-1.5">
                            {isMasterPrincipal && <Shield className="w-3.5 h-3.5 text-purple-600 shrink-0" />}
                            <span>{u.nome}</span>
                          </div>
                          {u.crea && (
                            <div className="text-[10px] text-slate-400 font-mono">
                              CREA: {u.crea}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                          {u.email}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            u.role === 'master'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : u.role === 'colaborador'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          {u.cargo && <div className="font-semibold">{u.cargo}</div>}
                          {clienteVinculadoObj && (
                            <div className="text-[11px] text-[#1565D8] font-medium">
                              Empresa: {clienteVinculadoObj.nomeFantasia || clienteVinculadoObj.razaoSocial}
                            </div>
                          )}
                          {!u.cargo && !clienteVinculadoObj && (
                            <span className="text-slate-400 italic">--</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {ativo ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Ativo</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-400 font-bold text-[11px]">
                              <UserX className="w-3.5 h-3.5 text-slate-400" />
                              <span>Inativo</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                          {u.criadoEm ? (u.criadoEm.length > 10 ? u.criadoEm.slice(0, 10) : u.criadoEm) : '--'}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Botão Editar */}
                            <button
                              type="button"
                              onClick={() => handleAbrirEdicao(u)}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-[#1565D8] hover:bg-blue-50 text-slate-700 hover:text-[#1565D8] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                              title="Editar usuário"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Editar</span>
                            </button>

                            {/* Botão Excluir */}
                            {isMasterPrincipal || isCurrentUser ? (
                              <button
                                type="button"
                                disabled
                                className="px-2.5 py-1.5 rounded-lg border border-slate-100 bg-slate-50 text-slate-300 text-xs font-medium flex items-center gap-1 cursor-not-allowed"
                                title={isMasterPrincipal ? "Conta Master principal protegida" : "Sua própria conta não pode ser excluída"}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Protegido</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setUsuarioParaExcluir(u)}
                                className="px-2.5 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                                title="Excluir usuário"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Excluir</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: LOG DE AUDITORIA COMPLETO */}
      {activeSubTab === 'auditoria' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-[#0B1E3D]">
                Trilha de Auditoria e Segurança de Dados
              </h3>
              <p className="text-xs text-slate-500">
                Registro imutável de todas as criações, edições, assinaturas de ART e exclusões de registros.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {auditLogs.length} eventos gravados
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Data e Hora</th>
                  <th className="py-2.5 px-3">Usuário</th>
                  <th className="py-2.5 px-3">Ação</th>
                  <th className="py-2.5 px-3">Entidade</th>
                  <th className="py-2.5 px-3">Detalhes do Evento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800">
                      {log.usuarioNome}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        log.acao === 'criar'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.acao === 'editar'
                          ? 'bg-blue-100 text-blue-800'
                          : log.acao === 'finalizar'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {log.acao}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700 capitalize">
                      {log.colecaoAfetada}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                      {log.detalhes || `ID: ${log.documentoId}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: CONTROLE DE USO DA IA (GEMINI) */}
      {activeSubTab === 'ia' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Google Gemini API • Assistente de Diagnóstico</span>
            </span>
            <h3 className="text-xl font-black text-[#0B1E3D] mt-0.5">
              Governança e Cotas de Chamadas da IA
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Monitore o consumo das análises de fotos e laudos para manter previsibilidade de custos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 text-xs block">Chamadas Realizadas no Mês:</span>
              <span className="text-3xl font-black text-[#0B1E3D]">{usoIA.totalChamadas ?? 0}</span>
              <span className="text-[11px] text-slate-500 block mt-1">
                Mês de Referência: {usoIA.mesReferencia || usoIA.mesAno || 'Mês Vigente'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 text-xs block">Limite Configurado:</span>
              <span className="text-3xl font-black text-purple-700">{usoIA.limiteMensal ?? 500}</span>
              <span className="text-[11px] text-slate-500 block mt-1">Bloqueio automático ao atingir 100%</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 text-xs block">Custo Estimado (USD):</span>
              <span className="text-3xl font-black text-emerald-700">
                ${(typeof usoIA.custoEstimadoUSD === 'number' ? usoIA.custoEstimadoUSD : ((usoIA.totalChamadas || 0) * 0.0025)).toFixed(2)}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">Base: modelo Gemini 3.8 Flash</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700">Consumo da Cota Mensal:</span>
              <span className={percentualIA >= 80 ? 'text-amber-600' : 'text-slate-600'}>
                {percentualIA}% utilizado
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  percentualIA >= 80 ? 'bg-amber-500' : 'bg-[#1565D8]'
                }`}
                style={{ width: `${Math.min(percentualIA, 100)}%` }}
              ></div>
            </div>
          </div>

          {percentualIA >= 80 && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Atenção: A cota mensal de chamadas da IA ultrapassou 80%. Considere expandir o limite abaixo.</span>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-end gap-3 max-w-md">
            <div className="w-full">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ajustar Limite de Chamadas por Mês
              </label>
              <input
                type="number"
                value={limiteMensal}
                onChange={(e) => setLimiteMensal(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-xs font-bold"
              />
            </div>
            <button
              onClick={handleSalvarLimiteIA}
              className="px-4 py-2 rounded-lg bg-[#1565D8] hover:bg-[#0b4fb8] text-white text-xs font-bold shadow-md cursor-pointer whitespace-nowrap"
            >
              Salvar Novo Limite
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: CONFIGURAÇÕES DA EMPRESA & ART */}
      {activeSubTab === 'empresa' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-[#0B1E3D]">
              Identidade Corporativa e Dados Oficiais nos Laudos
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Informações fixadas no cabeçalho, rodapé e certificado de cada documento impresso.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Razão Social da Empresa</label>
              <input
                type="text"
                value={razaoEmpresa}
                onChange={(e) => setRazaoEmpresa(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Registro CREA-PE Oficial</label>
              <input
                type="text"
                value={creaEmpresa}
                onChange={(e) => setCreaEmpresa(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Engenheiro Mecânico Responsável Técnico</label>
              <input
                type="text"
                value={responsavelNome}
                onChange={(e) => setResponsavelNome(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Prefixo Numérico das ARTs</label>
              <input
                type="text"
                value={artPadraoPrefixo}
                onChange={(e) => setArtPadraoPrefixo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-right">
            <button
              onClick={() => alert('Configurações da empresa salvas com sucesso!')}
              className="px-5 py-2.5 rounded-xl bg-[#1565D8] hover:bg-[#0b4fb8] text-white font-bold text-xs shadow-md cursor-pointer"
            >
              Salvar Dados Institucionais
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: BACKUP E EXPORTAÇÃO */}
      {activeSubTab === 'backup' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-[#0B1E3D]">
              Segurança e Exportação de Base de Dados
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Gere uma cópia completa dos clientes, equipamentos, laudos e logs para custódia externa em conformidade com as diretrizes do CREA e LGPD.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-[#0B1E3D]">Download do Backup Integral (.json)</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-lg">
                Inclui {clientes.length} clientes, {ativos.length} ativos, {laudos.length} laudos com checklists e {auditLogs.length} eventos de auditoria.
              </p>
            </div>

            <button
              onClick={handleExportarBackup}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer shrink-0"
            >
              <FileDown className="w-4 h-4" />
              <span>Exportar Dados em JSON</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR USUÁRIO */}
      {usuarioParaEditar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1565D8] flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0B1E3D]">
                    Editar Usuário do Sistema
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    ID: {usuarioParaEditar.uid}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUsuarioParaEditar(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSalvarEdicao} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={editNome}
                    onChange={(e) => setEditNome(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#1565D8]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">E-mail de Acesso *</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 font-mono focus:outline-hidden focus:ring-2 focus:ring-[#1565D8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nível de Permissão (Role)</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as any)}
                    disabled={usuarioParaEditar.uid === 'master-vitor'}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#1565D8] disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    <option value="colaborador">Colaborador Técnico</option>
                    <option value="cliente">Cliente (Somente Leitura)</option>
                    <option value="master">Master (Total)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status da Conta</label>
                  <select
                    value={editAtivo ? 'ativo' : 'inativo'}
                    onChange={(e) => setEditAtivo(e.target.value === 'ativo')}
                    disabled={usuarioParaEditar.uid === 'master-vitor'}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#1565D8] disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    <option value="ativo">Ativo (Acesso Liberado)</option>
                    <option value="inativo">Inativo (Bloqueado)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cargo ou Especialidade</label>
                  <input
                    type="text"
                    value={editCargo}
                    onChange={(e) => setEditCargo(e.target.value)}
                    placeholder="Ex: Engenheiro de Vistoria"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1565D8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Registro CREA</label>
                  <input
                    type="text"
                    value={editCrea}
                    onChange={(e) => setEditCrea(e.target.value)}
                    placeholder="Ex: 1822299490"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1565D8]"
                  />
                </div>

                {editRole === 'cliente' && (
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Empresa Cliente Vinculada</label>
                    <select
                      value={editClienteId}
                      onChange={(e) => setEditClienteId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#1565D8]"
                    >
                      <option value="">-- Selecione a Empresa do Cliente --</option>
                      {clientes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.razaoSocial} {c.nomeFantasia ? `(${c.nomeFantasia})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUsuarioParaEditar(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#1565D8] hover:bg-[#0b4fb8] text-white font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRMAR EXCLUSÃO DE USUÁRIO */}
      {usuarioParaExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-red-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-red-100 flex items-center justify-between bg-red-50/70">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-red-950">
                  Confirmar Exclusão de Usuário
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setUsuarioParaExcluir(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <p className="text-slate-700 leading-relaxed">
                Você tem certeza que deseja excluir o usuário <strong className="text-slate-900">{usuarioParaExcluir.nome}</strong> (<span className="font-mono text-slate-600">{usuarioParaExcluir.email}</span>)?
              </p>

              <div className="p-3 bg-red-50/70 border border-red-100 rounded-xl text-red-900 text-[11px] leading-relaxed">
                <strong>Atenção:</strong> Esta ação revogará imediatamente as credenciais de autenticação deste usuário, impedindo o login no painel e nos módulos técnicos.
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUsuarioParaExcluir(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmarExclusao}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Sim, Excluir Usuário</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
