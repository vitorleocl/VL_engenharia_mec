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
  const [contatoNome, setContatoNome] = useState('');
  const [contatoCargo, setContatoCargo] = useState('');
  const [contatoTelefone, setContatoTelefone] = useState('');
  const [contatoEmail, setContatoEmail] = useState('');
  const [enderecoLogradouro, setEnderecoLogradouro] = useState('');
  const [enderecoNumero, setEnderecoNumero] = useState('');
  const [enderecoBairro, setEnderecoBairro] = useState('');
  const [cidade, setCidade] = useState('Recife');
  const [estado, setEstado] = useState('PE');
  const [cep, setCep] = useState('');

  const clientesFiltrados = clientes.filter(c => 
    `${c.nomeFantasia || ''} ${c.razaoSocial || ''} ${c.cpfCnpj || ''} ${c.cnpj || ''} ${c.contatos?.[0]?.nome || ''} ${c.endereco?.cidade || ''}`.toLowerCase().includes(busca.toLowerCase())
  );

  const abrirNovo = () => {
    setClienteEditando(null);
    setNomeFantasia('');
    setRazaoSocial('');
    setCpfCnpj('');
    setContatoNome('');
    setContatoCargo('');
    setContatoTelefone('(81) 98444-2592');
    setContatoEmail('');
    setEnderecoLogradouro('');
    setEnderecoNumero('');
    setEnderecoBairro('');
    setCidade('Recife');
    setEstado('PE');
    setCep('');
    setModalAberto(true);
  };

  const abrirEdicao = (c: Cliente) => {
    setClienteEditando(c);
    setNomeFantasia(c.nomeFantasia || '');
    setRazaoSocial(c.razaoSocial || '');
    setCpfCnpj(c.cpfCnpj || c.cnpj || '');
    const primContato = c.contatos?.[0];
    setContatoNome(primContato?.nome || '');
    setContatoCargo(primContato?.cargo || '');
    setContatoTelefone(primContato?.telefone || '');
    setContatoEmail(primContato?.email || '');
    setEnderecoLogradouro(c.endereco?.logradouro || '');
    setEnderecoNumero(c.endereco?.numero || '');
    setEnderecoBairro(c.endereco?.bairro || '');
    setCidade(c.endereco?.cidade || 'Recife');
    setEstado(c.endereco?.estado || 'PE');
    setCep(c.endereco?.cep || '');
    setModalAberto(true);
  };

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeFantasia.trim() && !razaoSocial.trim()) return;

    const nomePrincipal = contatoNome.trim() || 'Diretoria / Responsável Técnico';
    const contatosLista = [
      {
        nome: nomePrincipal,
        cargo: contatoCargo.trim() || undefined,
        telefone: contatoTelefone.trim() || '(81) 98444-2592',
        email: contatoEmail.trim()
      }
    ];

    const enderecoObj = {
      logradouro: enderecoLogradouro.trim(),
      numero: enderecoNumero.trim(),
      bairro: enderecoBairro.trim(),
      cidade: cidade.trim() || 'Recife',
      estado: estado.trim() || 'PE',
      cep: cep.trim()
    };

    if (clienteEditando) {
      atualizarCliente(clienteEditando.id, {
        nomeFantasia: nomeFantasia.trim() || razaoSocial.trim(),
        razaoSocial: razaoSocial.trim() || nomeFantasia.trim(),
        cpfCnpj: cpfCnpj.trim(),
        cnpj: cpfCnpj.trim(),
        contatos: contatosLista,
        endereco: enderecoObj
      });
    } else {
      adicionarCliente({
        nomeFantasia: nomeFantasia.trim() || razaoSocial.trim(),
        razaoSocial: razaoSocial.trim() || nomeFantasia.trim(),
        cpfCnpj: cpfCnpj.trim(),
        cnpj: cpfCnpj.trim(),
        contatos: contatosLista,
        endereco: enderecoObj
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
                <th className="py-2.5 px-4 font-semibold">Cliente & CNPJ/CPF</th>
                <th className="py-2.5 px-4 font-semibold">Principal Contato</th>
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
                      {cliente.nomeFantasia && cliente.razaoSocial && cliente.nomeFantasia !== cliente.razaoSocial && (
                        <small className="text-[var(--muted)] text-xs block truncate max-w-[260px]">
                          {cliente.razaoSocial}
                        </small>
                      )}
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] font-bold">
                          <span className="text-[var(--muted)] text-[10px] font-normal">CNPJ/CPF:</span>
                          {cliente.cpfCnpj || cliente.cnpj || 'Não informado'}
                        </span>
                        <span className="text-[var(--muted)] text-[11px]">
                          • {cliente.endereco?.cidade || 'Recife'}/{cliente.endereco?.estado || 'PE'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-top text-[var(--ink)]">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <b className="text-[var(--ink)] font-semibold text-[13.5px]">
                            {contato?.nome || 'Contato Principal'}
                          </b>
                          {contato?.cargo && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-[#1565D8] dark:bg-blue-900/30 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                              {contato.cargo}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[var(--ink)]">
                          {contato?.telefone || '(81) 98444-2592'}
                        </div>
                        {contato?.email && (
                          <small className="text-[var(--muted)] text-xs block truncate max-w-[220px]">
                            {contato.email}
                          </small>
                        )}
                      </div>
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
                        className="btn-tech sm text-xs py-1 px-2.5 inline-flex items-center gap-1 cursor-pointer"
                        title="Editar cliente"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Editar</span>
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

      {/* Modal Cadastro/Edição de Cliente com CNPJ/CPF e Principal Contato Automáticos */}
      {modalAberto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[rgba(5,14,28,0.75)] backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[var(--card)] text-[var(--ink)] border-[1.5px] border-[var(--line)] rounded-2xl w-full max-w-xl p-5 sm:p-6 space-y-4 shadow-2xl my-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h2 className="text-[19px] sm:text-[21px] font-bold text-[var(--ink)]">
                  {clienteEditando ? 'Editar Cliente & Dados Fiscais' : 'Novo Cliente Cadastrado'}
                </h2>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Estes dados serão preenchidos de forma automática na emissão de laudos e orçamentos.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvar} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              
              {/* Bloco 1: Identificação da Empresa */}
              <div className="p-3.5 rounded-xl bg-[var(--paper)] border border-[var(--line)] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--blue)]">
                  <Building className="w-3.5 h-3.5" />
                  <span>Identificação da Empresa</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block text-xs font-bold text-[var(--ink)]">
                    <span className="mb-1 block">Nome Fantasia *</span>
                    <input
                      type="text"
                      value={nomeFantasia}
                      onChange={(e) => setNomeFantasia(e.target.value)}
                      required
                      placeholder="Ex: ADF Caruaru"
                      className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                    />
                  </label>

                  <label className="block text-xs font-bold text-[var(--ink)]">
                    <span className="mb-1 block">Razão Social Completa</span>
                    <input
                      type="text"
                      value={razaoSocial}
                      onChange={(e) => setRazaoSocial(e.target.value)}
                      placeholder="Ex: ADF Centro Automotivo e Engenharia LTDA"
                      className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                    />
                  </label>
                </div>

                {/* CNPJ / CPF em destaque */}
                <label className="block text-xs font-bold text-[var(--ink)]">
                  <span className="mb-1 flex items-center justify-between">
                    <span>CNPJ / CPF do Cliente</span>
                    <span className="text-[10px] text-[var(--blue)] font-normal">Preenchimento automático nos Laudos e Propostas</span>
                  </span>
                  <input
                    type="text"
                    value={cpfCnpj}
                    onChange={(e) => setCpfCnpj(e.target.value)}
                    placeholder="Ex: 24.417.065/0001-03 ou 000.000.000-00"
                    className="w-full p-2.5 text-sm font-mono font-bold border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                  />
                </label>
              </div>

              {/* Bloco 2: Principal Contato */}
              <div className="p-3.5 rounded-xl bg-[var(--paper)] border border-[var(--line)] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--blue)]">
                  <Users className="w-3.5 h-3.5" />
                  <span>Principal Contato / Representante</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block text-xs font-bold text-[var(--ink)]">
                    <span className="mb-1 block">Nome do Contato Principal *</span>
                    <input
                      type="text"
                      value={contatoNome}
                      onChange={(e) => setContatoNome(e.target.value)}
                      placeholder="Ex: Thiago Cunha"
                      className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                    />
                  </label>

                  <label className="block text-xs font-bold text-[var(--ink)]">
                    <span className="mb-1 block">Cargo ou Função</span>
                    <input
                      type="text"
                      value={contatoCargo}
                      onChange={(e) => setContatoCargo(e.target.value)}
                      placeholder="Ex: Contato Técnico / Gerente Operacional"
                      className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block text-xs font-bold text-[var(--ink)]">
                    <span className="mb-1 block">Telefone / WhatsApp</span>
                    <input
                      type="text"
                      value={contatoTelefone}
                      onChange={(e) => setContatoTelefone(e.target.value)}
                      placeholder="Ex: (81) 98444-2592"
                      className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                    />
                  </label>

                  <label className="block text-xs font-bold text-[var(--ink)]">
                    <span className="mb-1 block">E-mail Corporativo</span>
                    <input
                      type="email"
                      value={contatoEmail}
                      onChange={(e) => setContatoEmail(e.target.value)}
                      placeholder="Ex: contato@empresa.com.br"
                      className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                    />
                  </label>
                </div>
              </div>

              {/* Bloco 3: Endereço & Localização Operacional */}
              <div className="p-3.5 rounded-xl bg-[var(--paper)] border border-[var(--line)] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--blue)]">
                  <Building className="w-3.5 h-3.5" />
                  <span>Endereço Operacional do Cliente</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[var(--ink)]">
                      <span className="mb-1 block">Logradouro (Rua, Av, Rodovia)</span>
                      <input
                        type="text"
                        value={enderecoLogradouro}
                        onChange={(e) => setEnderecoLogradouro(e.target.value)}
                        placeholder="Ex: Av. José Pinheiro dos Santos"
                        className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--ink)]">
                      <span className="mb-1 block">Número</span>
                      <input
                        type="text"
                        value={enderecoNumero}
                        onChange={(e) => setEnderecoNumero(e.target.value)}
                        placeholder="Ex: 20"
                        className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[var(--ink)]">
                      <span className="mb-1 block">Bairro</span>
                      <input
                        type="text"
                        value={enderecoBairro}
                        onChange={(e) => setEnderecoBairro(e.target.value)}
                        placeholder="Ex: Pinheirópolis"
                        className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--ink)]">
                      <span className="mb-1 block">Cidade</span>
                      <input
                        type="text"
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                        placeholder="Recife ou Caruaru"
                        className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--ink)]">
                      <span className="mb-1 block">Estado / UF</span>
                      <input
                        type="text"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        placeholder="PE"
                        className="w-full p-2.5 text-sm uppercase border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="btn-tech text-sm cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-tech pri text-sm px-6 font-bold cursor-pointer"
                >
                  Salvar cadastro do cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
