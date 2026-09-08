import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  Cpu, 
  X, 
  Check, 
  AlertCircle 
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
  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [contatoNome, setContatoNome] = useState('');
  const [contatoCargo, setContatoCargo] = useState('');
  const [contatoTelefone, setContatoTelefone] = useState('');
  const [contatoEmail, setContatoEmail] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('PE');
  const [cep, setCep] = useState('');

  const isColaborador = currentUser?.role === 'master' || currentUser?.role === 'colaborador';

  const abrirNovo = () => {
    setClienteEditando(null);
    setRazaoSocial('');
    setNomeFantasia('');
    setCpfCnpj('');
    setContatoNome('');
    setContatoCargo('');
    setContatoTelefone('');
    setContatoEmail('');
    setLogradouro('');
    setNumero('');
    setBairro('');
    setCidade('Recife');
    setEstado('PE');
    setCep('');
    setModalAberto(true);
  };

  const abrirEditar = (c: Cliente) => {
    setClienteEditando(c);
    setRazaoSocial(c.razaoSocial);
    setNomeFantasia(c.nomeFantasia || '');
    setCpfCnpj(c.cpfCnpj);
    const primContato = c.contatos?.[0];
    setContatoNome(primContato?.nome || '');
    setContatoCargo(primContato?.cargo || '');
    setContatoTelefone(primContato?.telefone || '');
    setContatoEmail(primContato?.email || '');
    setLogradouro(c.endereco?.logradouro || '');
    setNumero(c.endereco?.numero || '');
    setBairro(c.endereco?.bairro || '');
    setCidade(c.endereco?.cidade || 'Recife');
    setEstado(c.endereco?.estado || 'PE');
    setCep(c.endereco?.cep || '');
    setModalAberto(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!razaoSocial.trim() || !cpfCnpj.trim()) return;

    const contatos = contatoNome ? [{
      nome: contatoNome,
      cargo: contatoCargo,
      telefone: contatoTelefone,
      email: contatoEmail,
    }] : [];

    const endereco = {
      logradouro,
      numero,
      bairro,
      cidade,
      estado,
      cep,
    };

    if (clienteEditando) {
      atualizarCliente(clienteEditando.id, {
        razaoSocial,
        nomeFantasia,
        cpfCnpj,
        contatos,
        endereco,
      });
    } else {
      adicionarCliente({
        razaoSocial,
        nomeFantasia,
        cpfCnpj,
        contatos,
        endereco,
      });
    }

    setModalAberto(false);
  };

  const filtrados = clientes.filter(c => 
    c.razaoSocial.toLowerCase().includes(busca.toLowerCase()) ||
    c.cpfCnpj.includes(busca) ||
    (c.nomeFantasia && c.nomeFantasia.toLowerCase().includes(busca.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0B1E3D] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#1565D8]" />
            <span>Gestão de Clientes e Empresas Contratantes</span>
          </h2>
          <p className="text-xs text-slate-500">
            Cadastre indústrias, construtoras e frotas para vinculação imediata em laudos e orçamentos com ART.
          </p>
        </div>

        {isColaborador && (
          <button
            onClick={abrirNovo}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1565D8] hover:bg-[#0b4fb8] text-white font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Novo Cliente</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por Razão Social, CNPJ ou Nome Fantasia..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1565D8]"
        />
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtrados.map((cliente) => {
          const ativosCliente = ativos.filter(a => a.clienteId === cliente.id);
          const laudosCliente = laudos.filter(l => l.clienteId === cliente.id);

          return (
            <div
              key={cliente.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">
                      CNPJ: {cliente.cpfCnpj}
                    </span>
                    <h3 className="text-base font-bold text-[#0B1E3D] leading-snug">
                      {cliente.razaoSocial}
                    </h3>
                    {cliente.nomeFantasia && (
                      <p className="text-xs text-[#1565D8] font-semibold">
                        {cliente.nomeFantasia}
                      </p>
                    )}
                  </div>
                  {isColaborador && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => abrirEditar(cliente)}
                        className="p-1.5 rounded text-slate-400 hover:text-[#1565D8] hover:bg-slate-50 cursor-pointer"
                        title="Editar"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Excluir o cliente ${cliente.razaoSocial}?`)) {
                            removerCliente(cliente.id);
                          }
                        }}
                        className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-slate-50 cursor-pointer"
                        title="Remover"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Address */}
                {cliente.endereco && (
                  <div className="flex items-start gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      {cliente.endereco.logradouro}, {cliente.endereco.numero} - {cliente.endereco.bairro}, {cliente.endereco.cidade}/{cliente.endereco.estado}
                    </span>
                  </div>
                )}

                {/* Primary Contact */}
                {cliente.contatos?.[0] && (
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <p className="font-semibold text-slate-700">
                      {cliente.contatos[0].nome} <span className="text-slate-400 font-normal">({cliente.contatos[0].cargo || 'Responsável'})</span>
                    </p>
                    <div className="flex flex-wrap gap-x-3 text-[11px] text-slate-500">
                      {cliente.contatos[0].telefone && <span>Tel: {cliente.contatos[0].telefone}</span>}
                      {cliente.contatos[0].email && <span>{cliente.contatos[0].email}</span>}
                    </div>
                  </div>
                )}
              </div>

              {/* Badges of linked assets & reports */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-semibold">
                  <Cpu className="w-3.5 h-3.5 text-slate-400" />
                  <span>{ativosCliente.length} Ativos</span>
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>{laudosCliente.length} Laudos</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Form */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-lg font-bold text-[#0B1E3D]">
                {clienteEditando ? 'Editar Dados do Cliente' : 'Cadastrar Novo Cliente'}
              </h3>
              <button
                onClick={() => setModalAberto(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Razão Social *</label>
                  <input
                    type="text"
                    required
                    value={razaoSocial}
                    onChange={(e) => setRazaoSocial(e.target.value)}
                    placeholder="Ex: Construtora Suape S.A."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:ring-2 focus:ring-[#1565D8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome Fantasia</label>
                  <input
                    type="text"
                    value={nomeFantasia}
                    onChange={(e) => setNomeFantasia(e.target.value)}
                    placeholder="Ex: Suape Engenharia"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:ring-2 focus:ring-[#1565D8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">CNPJ ou CPF *</label>
                  <input
                    type="text"
                    required
                    value={cpfCnpj}
                    onChange={(e) => setCpfCnpj(e.target.value)}
                    placeholder="00.000.000/0001-00"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:ring-2 focus:ring-[#1565D8]"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-700 uppercase tracking-wider block mb-2 text-[10px]">
                  Contato Principal
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Nome do Contato</label>
                    <input
                      type="text"
                      value={contatoNome}
                      onChange={(e) => setContatoNome(e.target.value)}
                      placeholder="Ex: Carlos Eduardo"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Cargo / Função</label>
                    <input
                      type="text"
                      value={contatoCargo}
                      onChange={(e) => setContatoCargo(e.target.value)}
                      placeholder="Ex: Gerente de Manutenção"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Telefone / WhatsApp</label>
                    <input
                      type="text"
                      value={contatoTelefone}
                      onChange={(e) => setContatoTelefone(e.target.value)}
                      placeholder="(81) 90000-0000"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">E-mail</label>
                    <input
                      type="email"
                      value={contatoEmail}
                      onChange={(e) => setContatoEmail(e.target.value)}
                      placeholder="carlos@empresa.com"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-700 uppercase tracking-wider block mb-2 text-[10px]">
                  Endereço da Empresa / Instalação
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-medium text-slate-600 mb-1">Logradouro / Rodovia</label>
                    <input
                      type="text"
                      value={logradouro}
                      onChange={(e) => setLogradouro(e.target.value)}
                      placeholder="Av. Portuária ou Rodovia BR-101"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Número / Km</label>
                    <input
                      type="text"
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      placeholder="1200 ou Km 78"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Bairro</label>
                    <input
                      type="text"
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                      placeholder="Bairro ou Distrito Industrial"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Cidade</label>
                    <input
                      type="text"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      placeholder="Recife, Ipojuca, etc."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Estado</label>
                    <input
                      type="text"
                      value={estado}
                      onChange={(e) => setEstado(e.target.value)}
                      placeholder="PE"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#1565D8] hover:bg-[#0b4fb8] text-white font-bold shadow-md"
                >
                  {clienteEditando ? 'Salvar Alterações' : 'Cadastrar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
