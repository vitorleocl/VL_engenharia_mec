import React, { useState } from 'react';
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
  FileDown
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { UsuarioPerfil } from '../../types';

export const GestaoView: React.FC = () => {
  const { auditLogs, usoIA, atualizarLimiteIA, clientes, ativos, laudos, orcamentos } = useData();
  const { currentUser } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState<'usuarios' | 'auditoria' | 'ia' | 'empresa' | 'backup'>('usuarios');

  // IA limits state
  const [limiteMensal, setLimiteMensal] = useState(usoIA.limiteMensal);

  // Enterprise Header Settings
  const [razaoEmpresa, setRazaoEmpresa] = useState('VL Engenharia Mecânica');
  const [creaEmpresa, setCreaEmpresa] = useState('CREA-PE 1822299490');
  const [responsavelNome, setResponsavelNome] = useState('Vitor Leonardo');
  const [artPadraoPrefixo, setArtPadraoPrefixo] = useState('PE2026-');

  // Mock users list
  const [usuarios, setUsuarios] = useState<UsuarioPerfil[]>([
    {
      uid: 'master-vitor',
      email: 'vitorleonardocl@gmail.com',
      nome: 'Vitor Leonardo',
      role: 'master',
      ativo: true,
      crea: '1822299490',
      criadoEm: '2025-01-01',
    },
    {
      uid: 'colab-1',
      email: 'engenharia.vistoria@vl.com.br',
      nome: 'Inspetor Técnico de Campo',
      role: 'colaborador',
      ativo: true,
      criadoEm: '2025-02-10',
    },
    {
      uid: 'cliente-1',
      email: 'contato@suape-eng.com.br',
      nome: 'Gestor Suape (Portal Cliente)',
      role: 'cliente',
      ativo: true,
      clienteIdVinculado: 'cli-suape-1',
      criadoEm: '2025-03-01',
    }
  ]);

  const [novoEmail, setNovoEmail] = useState('');
  const [novoNome, setNovoNome] = useState('');
  const [novoRole, setNovoRole] = useState<'master' | 'colaborador' | 'cliente'>('colaborador');

  const handleSalvarLimiteIA = () => {
    atualizarLimiteIA(Number(limiteMensal));
    alert('Limite mensal de chamadas IA atualizado com sucesso!');
  };

  const handleAdicionarUsuario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoEmail.trim() || !novoNome.trim()) return;

    setUsuarios(prev => [
      ...prev,
      {
        uid: `usr-${Date.now()}`,
        email: novoEmail.trim(),
        nome: novoNome.trim(),
        role: novoRole,
        ativo: true,
        criadoEm: new Date().toISOString().slice(0, 10),
      }
    ]);
    setNovoEmail('');
    setNovoNome('');
    alert('Usuário convidado com sucesso!');
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

      {/* SUB-TAB 1: USUÁRIOS E PERMISSÕES */}
      {activeSubTab === 'usuarios' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-[#0B1E3D]">
              Adicionar Novo Usuário ao Sistema
            </h3>

            <form onSubmit={handleAdicionarUsuario} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Eng. Fulano de Tal"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">E-mail Profissional</label>
                <input
                  type="email"
                  required
                  value={novoEmail}
                  onChange={(e) => setNovoEmail(e.target.value)}
                  placeholder="usuario@empresa.com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nível de Permissão (Role)</label>
                <select
                  value={novoRole}
                  onChange={(e) => setNovoRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 font-semibold"
                >
                  <option value="colaborador">Colaborador (Vistorias e Laudos)</option>
                  <option value="cliente">Cliente (Somente Leitura dos seus laudos)</option>
                  <option value="master">Master (Acesso Completo)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#1565D8] hover:bg-[#0b4fb8] text-white font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Convidar</span>
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-[#0B1E3D]">
              Usuários Registrados ({usuarios.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Nome / Usuário</th>
                    <th className="py-2.5 px-3">E-mail</th>
                    <th className="py-2.5 px-3">Papel (Role)</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Criado em</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usuarios.map((u) => (
                    <tr key={u.uid} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3 font-bold text-[#0B1E3D]">
                        {u.nome} {u.crea && <span className="text-[10px] text-slate-400">({u.crea})</span>}
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                        {u.email}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'master'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'colaborador'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Ativo</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                        {u.criadoEm}
                      </td>
                    </tr>
                  ))}
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
                          : log.acao === 'atualizar'
                          ? 'bg-blue-100 text-blue-800'
                          : log.acao === 'finalizar'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {log.acao}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700 capitalize">
                      {log.entidade}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                      {log.detalhes || `ID: ${log.entidadeId}`}
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

    </div>
  );
};
