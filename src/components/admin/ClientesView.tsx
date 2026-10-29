import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Building, 
  Phone, 
  Mail, 
  FileText, 
  Cpu, 
  Edit, 
  Trash2, 
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Cliente } from '../../types';

export const ClientesView: React.FC = () => {
  const { clientes, ativos, laudos, adicionarCliente, atualizarCliente, removerCliente } = useData();
  const { currentUser } = useAuth();

  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);

  // Form states
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [contatoTelefone, setContatoTelefone] = useState('');
  const [contatoEmail, setContatoEmail] = useState('');
  const [cidade, setCidade] = useState('Recife');

  const clientesFiltrados = clientes.filter(c => 
    `${c.nomeFantasia || ''} ${c.razaoSocial || ''} ${c.cpfCnpj || ''} ${c.endereco?.cidade || ''}`.toLowerCase().includes(busca.toLowerCase())
  );

  const abrirNovo = () => {
    setClienteEditando(null);
    setNomeFantasia('');
    setRazaoSocial('');
    setCpfCnpj('');
    setContatoTelefone('(81) 98444-2592');
    setContatoEmail('');
    setCidade('Recife');
    setModalAberto(true);
  };

  const abrirEdicao = (c: Cliente) => {
    setClienteEditando(c);
    setNomeFantasia(c.nomeFantasia || '');
    setRazaoSocial(c.razaoSocial || '');
    setCpfCnpj(c.cpfCnpj || '');
    setContatoTelefone(c.contatos?.[0]?.telefone || '');
    setContatoEmail(c.contatos?.[0]?.email || '');
    setCidade(c.endereco?.cidade || 'Recife');
    setModalAberto(true);
  };

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeFantasia.trim()) return;

    if (clienteEditando) {
      atualizarCliente(clienteEditando.id, {
        nomeFantasia,
        razaoSocial: razaoSocial || nomeFantasia,
        cpfCnpj,
        contatos: [
          {
            nome: 'Contato Principal',
            telefone: contatoTelefone,
            email: contatoEmail
          }
        ],
        endereco: {
          ...clienteEditando.endereco,
          cidade,
          estado: 'PE'
        }
      });
    } else {
      adicionarCliente({
        nomeFantasia,
        razaoSocial: razaoSocial || nomeFantasia,
        cpfCnpj,
        contatos: [
          {
            nome: 'Contato Principal',
            telefone: contatoTelefone,
            email: contatoEmail
          }
        ],
        endereco: {
          logradouro: '',
          numero: '',
          bairro: '',
          cidade,
          estado: 'PE',
          cep: ''
        }
      });
    }

    setModalAberto(false);
  };

  return (
    <div className="space-y-6 max-w-[1200px]">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight">
            Clientes
          </h1>
          <p className="text-[var(--muted)] text-[15px] sm:text-[16px] mt-0.5">
            Empresas, indústrias e condomínios atendidos pela VL Engenharia.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={abrirNovo}
            className="btn-tech pri text-[14.5px] px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Novo cliente</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome, CNPJ ou cidade"
          className="w-full pl-9 pr-3 py-2 font-[family-name:var(--b)] text-[14.5px] border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
        />
      </div>

      {/* Technical Table */}
      <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14.5px] min-w-[620px]">
            <thead>
              <tr className="border-b-[1.5px] border-[var(--ink)] text-[var(--muted)] text-[13.5px] bg-[var(--paper)]">
                <th className="py-2.5 px-4 font-semibold">Cliente</th>
                <th className="py-2.5 px-4 font-semibold">Contato</th>
                <th className="py-2.5 px-4 font-semibold">Equipamentos</th>
                <th className="py-2.5 px-4 font-semibold">Último laudo</th>
                <th className="py-2.5 px-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {clientesFiltrados.map((cliente) => {
                const equipamentosCount = ativos.filter(a => a.clienteId === cliente.id).length;
                const laudosCliente = laudos.filter(l => l.clienteId === cliente.id);
                const ultimoLaudo = laudosCliente[laudosCliente.length - 1];
                const contato = cliente.contatos?.[0];

                return (
                  <tr key={cliente.id} className="hover:bg-[var(--paper)] transition-colors">
                    <td className="py-3.5 px-4 align-top">
                      <b className="block text-[var(--ink)] font-semibold">{cliente.nomeFantasia || cliente.razaoSocial}</b>
                      <small className="text-[var(--muted)] text-xs block">
                        {cliente.razaoSocial} · {cliente.endereco?.cidade || 'PE'}
                      </small>
                    </td>

                    <td className="py-3.5 px-4 align-top text-[var(--ink)]">
                      <span>{contato?.telefone || '(81) 98444-2592'}</span>
                      {contato?.email && (
                        <small className="text-[var(--muted)] text-xs block truncate max-w-[200px]">
                          {contato.email}
                        </small>
                      )}
                    </td>

                    <td className="py-3.5 px-4 align-top text-[var(--ink)] font-semibold">
                      {equipamentosCount}
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      {ultimoLaudo ? (
                        <div>
                          <b className="text-[var(--ink)] font-semibold">{ultimoLaudo.numero}</b>
                          <small className="text-[var(--muted)] text-xs block">
                            {new Date(ultimoLaudo.criadoEm || Date.now()).toLocaleDateString('pt-BR')}
                          </small>
                        </div>
                      ) : (
                        <span className="text-[var(--muted)] text-xs">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 align-top text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => abrirEdicao(cliente)}
                        className="btn-tech sm text-xs py-1 px-2"
                        title="Editar cliente"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {clientesFiltrados.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-[var(--muted)]">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Cadastro/Edição de Cliente */}
      {modalAberto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(5,14,28,0.7)] backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[var(--card)] text-[var(--ink)] border-[1.5px] border-[var(--line)] rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <h2 className="text-[20px] font-bold">
                {clienteEditando ? 'Editar cliente' : 'Novo cliente'}
              </h2>
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="p-1 rounded text-[var(--muted)] hover:text-[var(--ink)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvar} className="space-y-3.5">
              <label className="block text-sm font-semibold">
                <span className="mb-1 block">Nome Fantasia</span>
                <input
                  type="text"
                  value={nomeFantasia}
                  onChange={(e) => setNomeFantasia(e.target.value)}
                  required
                  placeholder="Ex: ADF Caruaru"
                  className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
                />
              </label>

              <label className="block text-sm font-semibold">
                <span className="mb-1 block">Razão Social</span>
                <input
                  type="text"
                  value={razaoSocial}
                  onChange={(e) => setRazaoSocial(e.target.value)}
                  placeholder="Ex: ADF Serviços e Engenharia LTDA"
                  className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block text-sm font-semibold">
                  <span className="mb-1 block">Telefone / WhatsApp</span>
                  <input
                    type="text"
                    value={contatoTelefone}
                    onChange={(e) => setContatoTelefone(e.target.value)}
                    placeholder="(81) 98444-2592"
                    className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
                  />
                </label>

                <label className="block text-sm font-semibold">
                  <span className="mb-1 block">Cidade (PE)</span>
                  <input
                    type="text"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Recife"
                    className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
                  />
                </label>
              </div>

              <label className="block text-sm font-semibold">
                <span className="mb-1 block">E-mail</span>
                <input
                  type="email"
                  value={contatoEmail}
                  onChange={(e) => setContatoEmail(e.target.value)}
                  placeholder="contato@empresa.com.br"
                  className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
                />
              </label>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="btn-tech text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-tech pri text-sm px-5"
                >
                  Salvar cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
