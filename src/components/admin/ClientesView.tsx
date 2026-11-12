import React, { useState, useRef } from 'react';
import {
  Users,
  Plus,
  Search,
  Building,
  Edit,
  X,
  UserCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Cliente } from '../../types';

function formatarCnpj(digits: string): string {
  const d = digits.replace(/\D/g, '').slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

function formatarCpf(digits: string): string {
  const d = digits.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function formatarTelefone(ddd?: string | null, tel?: string | null): string {
  const raw = `${ddd || ''}${tel || ''}`.replace(/\D/g, '');
  if (!raw) return '';
  if (raw.length === 11) {
    return `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
  }
  if (raw.length === 10) {
    return `(${raw.slice(0, 2)}) ${raw.slice(2, 6)}-${raw.slice(6)}`;
  }
  return raw;
}

function formatarCep(cep?: string | null): string {
  const d = (cep || '').replace(/\D/g, '').slice(0, 8);
  if (d.length === 8) return `${d.slice(0, 5)}-${d.slice(5)}`;
  return d;
}

function titleCasePtBr(texto?: string | null): string {
  if (!texto) return '';
  const minusculas = new Set(['de', 'da', 'do', 'dos', 'das', 'e', 'em', 'para', 'com']);
  const siglas = new Set(['ltda', 'me', 'epp', 'eireli', 's/a', 'sa', 'ss', 'pe', 'sp', 'rj', 'mg', 'ba']);
  return texto
    .trim()
    .split(/\s+/)
    .map((palavra, idx) => {
      const lower = palavra.toLowerCase();
      if (siglas.has(lower)) return lower.toUpperCase();
      if (idx > 0 && minusculas.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

export const ClientesView: React.FC = () => {
  const { clientes, ativos, laudos, adicionarCliente, atualizarCliente } = useData();

  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);

  // Tipo de Pessoa (CNPJ vs CPF)
  const [tipoPessoa, setTipoPessoa] = useState<'juridica' | 'fisica'>('juridica');

  // Form states
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [rg, setRg] = useState('');
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

  // Estados da consulta CNPJ
  const [consultandoCnpj, setConsultandoCnpj] = useState(false);
  const [cnpjFeedback, setCnpjFeedback] = useState<{
    tipo: 'ok' | 'erro';
    texto: string;
  } | null>(null);
  const ultimoCnpjConsultadoRef = useRef<string>('');

  const clientesFiltrados = clientes.filter((c) =>
    `${c.nomeFantasia || ''} ${c.razaoSocial || ''} ${c.cpfCnpj || ''} ${c.cnpj || ''} ${c.contatos?.[0]?.nome || ''} ${c.endereco?.cidade || ''}`
      .toLowerCase()
      .includes(busca.toLowerCase())
  );

  const limparFeedbackCnpj = () => {
    setCnpjFeedback(null);
  };

  const abrirNovo = () => {
    setClienteEditando(null);
    setTipoPessoa('juridica');
    setNomeFantasia('');
    setRazaoSocial('');
    setCpfCnpj('');
    setRg('');
    setContatoNome('');
    setContatoCargo('');
    setContatoTelefone('');
    setContatoEmail('');
    setEnderecoLogradouro('');
    setEnderecoNumero('');
    setEnderecoBairro('');
    setCidade('Recife');
    setEstado('PE');
    setCep('');
    ultimoCnpjConsultadoRef.current = '';
    limparFeedbackCnpj();
    setModalAberto(true);
  };

  const abrirEdicao = (c: Cliente) => {
    setClienteEditando(c);
    const docDigits = (c.cpfCnpj || c.cnpj || '').replace(/\D/g, '');
    const ehFisica =
      c.tipoPessoa === 'fisica' || (c.tipoPessoa !== 'juridica' && docDigits.length === 11);
    setTipoPessoa(ehFisica ? 'fisica' : 'juridica');
    setNomeFantasia(c.nomeFantasia || '');
    setRazaoSocial(c.razaoSocial || '');
    setCpfCnpj(c.cpfCnpj || c.cnpj || '');
    setRg(c.rg || '');
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
    ultimoCnpjConsultadoRef.current = docDigits.length === 14 ? docDigits : '';
    limparFeedbackCnpj();
    setModalAberto(true);
  };

  const consultarDadosCnpj = async (cnpjInput: string) => {
    const digits = cnpjInput.replace(/\D/g, '');
    if (digits.length !== 14) {
      setCnpjFeedback({
        tipo: 'erro',
        texto: 'Digite os 14 números do CNPJ para consultar.',
      });
      return;
    }

    setConsultandoCnpj(true);
    setCnpjFeedback(null);
    ultimoCnpjConsultadoRef.current = digits;

    try {
      let resp: Response | null = null;
      try {
        resp = await fetch(`https://publica.cnpj.ws/cnpj/${digits}`, {
          headers: { Accept: 'application/json' },
        });
      } catch {
        resp = null;
      }

      if (!resp || !resp.ok) {
        // Fallback pelo proxy do servidor local em caso de CORS ou bloqueio de rede do navegador
        const fallbackResp = await fetch(`/api/cnpj/${digits}`);
        if (!fallbackResp.ok) {
          let errMsg = `Não foi possível consultar este CNPJ (HTTP ${fallbackResp.status}).`;
          if (fallbackResp.status === 404) {
            errMsg = 'CNPJ não encontrado na base pública da Receita Federal.';
          } else if (fallbackResp.status === 429) {
            errMsg = 'Limite de consultas da API pública atingido momentaneamente. Aguarde alguns segundos ou preencha manualmente.';
          }
          setCnpjFeedback({ tipo: 'erro', texto: errMsg });
          return;
        }
        resp = fallbackResp;
      }

      const data = await resp.json();
      const est = data?.estabelecimento || {};
      const razao = titleCasePtBr(data?.razao_social || '');
      const fantasia = titleCasePtBr(est?.nome_fantasia || '') || razao;
      const logradouroCompleto = [
        titleCasePtBr(est?.tipo_logradouro),
        titleCasePtBr(est?.logradouro),
      ]
        .filter(Boolean)
        .join(' ');
      const telefoneApi = formatarTelefone(est?.ddd1, est?.telefone1) ||
        formatarTelefone(est?.ddd2, est?.telefone2);
      const socioPrincipal = Array.isArray(data?.socios) && data.socios.length > 0 ? data.socios[0] : null;

      setCpfCnpj(formatarCnpj(digits));
      if (fantasia) setNomeFantasia(fantasia);
      if (razao) setRazaoSocial(razao);
      if (logradouroCompleto) setEnderecoLogradouro(logradouroCompleto);
      if (est?.numero) setEnderecoNumero(String(est.numero));
      if (est?.bairro) setEnderecoBairro(titleCasePtBr(est.bairro));
      if (est?.cidade?.nome) setCidade(titleCasePtBr(est.cidade.nome));
      if (est?.estado?.sigla) setEstado(String(est.estado.sigla).toUpperCase());
      if (est?.cep) setCep(formatarCep(est.cep));
      if (telefoneApi) setContatoTelefone(telefoneApi);
      if (est?.email) setContatoEmail(String(est.email).toLowerCase());
      if (socioPrincipal?.nome && !contatoNome.trim()) {
        setContatoNome(titleCasePtBr(socioPrincipal.nome));
      }
      if (socioPrincipal?.qualificacao_socio?.descricao && !contatoCargo.trim()) {
        setContatoCargo(titleCasePtBr(socioPrincipal.qualificacao_socio.descricao));
      }

      setCnpjFeedback({
        tipo: 'ok',
        texto: `Dados carregados automaticamente de ${fantasia || razao || formatarCnpj(digits)}.`,
      });
    } catch {
      setCnpjFeedback({
        tipo: 'erro',
        texto: 'Falha de conexão ao consultar o CNPJ. Você pode preencher os dados manualmente.',
      });
    } finally {
      setConsultandoCnpj(false);
    }
  };

  const handleDocumentoChange = (valor: string) => {
    const digits = valor.replace(/\D/g, '');
    if (tipoPessoa === 'juridica') {
      const lim = digits.slice(0, 14);
      setCpfCnpj(valor.includes('.') || valor.includes('/') || valor.includes('-') ? formatarCnpj(lim) : lim);
      if (lim.length === 14 && lim !== ultimoCnpjConsultadoRef.current && !consultandoCnpj) {
        consultarDadosCnpj(lim);
      }
    } else {
      setCpfCnpj(formatarCpf(digits));
    }
  };

  const handleTrocarTipoPessoa = (novoTipo: 'juridica' | 'fisica') => {
    setTipoPessoa(novoTipo);
    limparFeedbackCnpj();
    const digits = cpfCnpj.replace(/\D/g, '');
    if (novoTipo === 'fisica' && digits.length > 11) {
      setCpfCnpj('');
    } else if (novoTipo === 'fisica' && digits.length === 11) {
      setCpfCnpj(formatarCpf(digits));
    } else if (novoTipo === 'juridica' && digits.length === 14) {
      setCpfCnpj(formatarCnpj(digits));
    }
  };

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (tipoPessoa === 'juridica' && !nomeFantasia.trim() && !razaoSocial.trim()) return;
    if (tipoPessoa === 'fisica' && !razaoSocial.trim() && !nomeFantasia.trim()) return;

    const nomePrincipalContato =
      tipoPessoa === 'fisica'
        ? (razaoSocial.trim() || nomeFantasia.trim())
        : (contatoNome.trim() || 'Diretoria / Responsável Técnico');

    const cargoTrim = contatoCargo.trim();
    const contatosLista = [
      {
        nome: nomePrincipalContato,
        ...(cargoTrim ? { cargo: cargoTrim } : {}),
        telefone: contatoTelefone.trim(),
        email: contatoEmail.trim(),
      },
    ];

    const enderecoObj = {
      logradouro: enderecoLogradouro.trim(),
      numero: enderecoNumero.trim(),
      bairro: enderecoBairro.trim(),
      cidade: cidade.trim() || 'Recife',
      estado: (estado.trim() || 'PE').toUpperCase(),
      cep: cep.trim(),
    };

    const docDigits = cpfCnpj.replace(/\D/g, '');
    const docFormatado =
      tipoPessoa === 'juridica'
        ? (docDigits.length === 14 ? formatarCnpj(docDigits) : cpfCnpj.trim())
        : (docDigits.length === 11 ? formatarCpf(docDigits) : cpfCnpj.trim());

    const nomeFinal =
      tipoPessoa === 'fisica'
        ? (razaoSocial.trim() || nomeFantasia.trim())
        : (nomeFantasia.trim() || razaoSocial.trim());

    const razaoFinal =
      tipoPessoa === 'fisica'
        ? (razaoSocial.trim() || nomeFantasia.trim())
        : (razaoSocial.trim() || nomeFantasia.trim());

    const payload = {
      tipoPessoa,
      nomeFantasia: nomeFinal,
      razaoSocial: razaoFinal,
      cpfCnpj: docFormatado,
      cnpj: docFormatado,
      ...(tipoPessoa === 'fisica' && rg.trim() ? { rg: rg.trim() } : {}),
      contatos: contatosLista,
      endereco: enderecoObj,
    };

    if (clienteEditando) {
      atualizarCliente(clienteEditando.id, payload);
    } else {
      adicionarCliente(payload);
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
            Empresas, indústrias, condomínios e pessoas físicas atendidas pela VL Engenharia.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={abrirNovo}
            className="btn-tech pri text-[14.5px] px-4 py-2 cursor-pointer"
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
          placeholder="Buscar por nome, CNPJ, CPF ou cidade"
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
                const equipamentosCount = ativos.filter((a) => a.clienteId === cliente.id).length;
                const laudosCliente = laudos.filter((l) => l.clienteId === cliente.id);
                const ultimoLaudo = laudosCliente[laudosCliente.length - 1];
                const contato = cliente.contatos?.[0];
                const docRaw = cliente.cpfCnpj || cliente.cnpj || '';
                const docDigits = docRaw.replace(/\D/g, '');
                const ehPf = cliente.tipoPessoa === 'fisica' || (cliente.tipoPessoa !== 'juridica' && docDigits.length === 11);

                return (
                  <tr key={cliente.id} className="hover:bg-[var(--paper)] transition-colors">
                    <td className="py-3.5 px-4 align-top">
                      <b className="block text-[var(--ink)] font-semibold">
                        {cliente.nomeFantasia || cliente.razaoSocial}
                      </b>
                      {cliente.nomeFantasia &&
                        cliente.razaoSocial &&
                        cliente.nomeFantasia !== cliente.razaoSocial && (
                          <small className="text-[var(--muted)] text-xs block truncate max-w-[260px]">
                            {cliente.razaoSocial}
                          </small>
                        )}
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] font-bold">
                          <span className="text-[var(--muted)] text-[10px] font-normal">
                            {ehPf ? 'CPF:' : 'CNPJ:'}
                          </span>
                          {docRaw || 'Não informado'}
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
                          {contato?.telefone || '—'}
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

      {/* Modal Cadastro/Edição de Cliente com Consulta Automática CNPJ e Opção Pessoa Física (CPF) */}
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
              {/* Seletor Pessoa Jurídica (CNPJ) vs Pessoa Física (CPF) */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[var(--paper)] border border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => handleTrocarTipoPessoa('juridica')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    tipoPessoa === 'juridica'
                      ? 'bg-[var(--blue)] text-white shadow-xs'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Pessoa Jurídica (CNPJ)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTrocarTipoPessoa('fisica')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    tipoPessoa === 'fisica'
                      ? 'bg-[var(--blue)] text-white shadow-xs'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Não usar CNPJ · Pessoa Física (CPF)</span>
                </button>
              </div>

              {tipoPessoa === 'juridica' ? (
                <>
                  {/* Bloco 1: Identificação da Empresa + Consulta CNPJ */}
                  <div className="p-3.5 rounded-xl bg-[var(--paper)] border border-[var(--line)] space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--blue)]">
                        <Building className="w-3.5 h-3.5" />
                        <span>Identificação da Empresa</span>
                      </div>
                      <span className="text-[10px] text-[var(--muted)]">
                        Consulta automática via cnpj.ws
                      </span>
                    </div>

                    {/* CNPJ com consulta automática */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[var(--ink)]">
                        <span className="mb-1 flex items-center justify-between">
                          <span>CNPJ / CPF do Cliente</span>
                          <span className="text-[10px] text-[var(--blue)] font-normal">
                            Preenchimento automático nos Laudos e Propostas
                          </span>
                        </span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={cpfCnpj}
                            onChange={(e) => handleDocumentoChange(e.target.value)}
                            placeholder="Digite os 14 números do CNPJ (ex: 24417065000103)"
                            className="flex-1 p-2.5 text-sm font-mono font-bold border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                          />
                          <button
                            type="button"
                            onClick={() => consultarDadosCnpj(cpfCnpj)}
                            disabled={consultandoCnpj}
                            className="px-3.5 py-2 rounded-lg bg-[var(--blue)] text-white text-xs font-bold inline-flex items-center gap-1.5 hover:brightness-110 disabled:opacity-60 cursor-pointer shrink-0"
                          >
                            {consultandoCnpj ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Buscando...</span>
                              </>
                            ) : (
                              <>
                                <Search className="w-3.5 h-3.5" />
                                <span>Consultar CNPJ</span>
                              </>
                            )}
                          </button>
                        </div>
                      </label>

                      {cnpjFeedback && (
                        <div
                          className={`text-xs px-3 py-2 rounded-lg border flex items-start gap-2 ${
                            cnpjFeedback.tipo === 'ok'
                              ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-600 dark:text-emerald-400'
                              : 'bg-rose-500/10 border-rose-500/35 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {cnpjFeedback.tipo === 'ok' ? (
                            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          )}
                          <span>{cnpjFeedback.texto}</span>
                        </div>
                      )}
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
                  </div>

                  {/* Bloco 2: Principal Contato / Representante */}
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
                </>
              ) : (
                <>
                  {/* Modo Pessoa Física (CPF) */}
                  <div className="p-3.5 rounded-xl bg-[var(--paper)] border border-[var(--line)] space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--blue)]">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Identificação da Pessoa Física</span>
                    </div>

                    <label className="block text-xs font-bold text-[var(--ink)]">
                      <span className="mb-1 block">Nome Completo *</span>
                      <input
                        type="text"
                        value={razaoSocial}
                        onChange={(e) => {
                          setRazaoSocial(e.target.value);
                          setNomeFantasia(e.target.value);
                          setContatoNome(e.target.value);
                        }}
                        required
                        placeholder="Ex: João Carlos da Silva"
                        className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                      />
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="block text-xs font-bold text-[var(--ink)]">
                        <span className="mb-1 block">CPF *</span>
                        <input
                          type="text"
                          value={cpfCnpj}
                          onChange={(e) => handleDocumentoChange(e.target.value)}
                          required
                          placeholder="000.000.000-00"
                          className="w-full p-2.5 text-sm font-mono font-bold border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                        />
                      </label>

                      <label className="block text-xs font-bold text-[var(--ink)]">
                        <span className="mb-1 block">RG / Documento (opcional)</span>
                        <input
                          type="text"
                          value={rg}
                          onChange={(e) => setRg(e.target.value)}
                          placeholder="Ex: 7.123.456 SDS/PE"
                          className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                        />
                      </label>
                    </div>

                    <label className="block text-xs font-bold text-[var(--ink)]">
                      <span className="mb-1 block">Profissão / Atividade (opcional)</span>
                      <input
                        type="text"
                        value={contatoCargo}
                        onChange={(e) => setContatoCargo(e.target.value)}
                        placeholder="Ex: Proprietário / Produtor Rural / Síndico"
                        className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                      />
                    </label>
                  </div>

                  {/* Contato Pessoa Física */}
                  <div className="p-3.5 rounded-xl bg-[var(--paper)] border border-[var(--line)] space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--blue)]">
                      <Users className="w-3.5 h-3.5" />
                      <span>Contato Pessoal</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="block text-xs font-bold text-[var(--ink)]">
                        <span className="mb-1 block">Telefone / WhatsApp *</span>
                        <input
                          type="text"
                          value={contatoTelefone}
                          onChange={(e) => setContatoTelefone(e.target.value)}
                          required
                          placeholder="Ex: (81) 99999-9999"
                          className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                        />
                      </label>

                      <label className="block text-xs font-bold text-[var(--ink)]">
                        <span className="mb-1 block">E-mail Pessoal</span>
                        <input
                          type="email"
                          value={contatoEmail}
                          onChange={(e) => setContatoEmail(e.target.value)}
                          placeholder="Ex: nome@email.com"
                          className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                        />
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* Bloco 3: Endereço & Localização Operacional */}
              <div className="p-3.5 rounded-xl bg-[var(--paper)] border border-[var(--line)] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--blue)]">
                  <Building className="w-3.5 h-3.5" />
                  <span>
                    {tipoPessoa === 'fisica'
                      ? 'Endereço Residencial / Local da Vistoria'
                      : 'Endereço Operacional do Cliente'}
                  </span>
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

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-1">
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

                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-[var(--ink)]">
                      <span className="mb-1 block">Cidade</span>
                      <input
                        type="text"
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                        placeholder="Recife"
                        className="w-full p-2.5 text-sm border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                      />
                    </label>
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-[var(--ink)]">
                      <span className="mb-1 block">Estado / UF</span>
                      <input
                        type="text"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        placeholder="PE"
                        maxLength={2}
                        className="w-full p-2.5 text-sm uppercase border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                      />
                    </label>
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-[var(--ink)]">
                      <span className="mb-1 block">CEP</span>
                      <input
                        type="text"
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        placeholder="50000-000"
                        className="w-full p-2.5 text-sm font-mono border border-[var(--line)] rounded-lg bg-[var(--card)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
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
