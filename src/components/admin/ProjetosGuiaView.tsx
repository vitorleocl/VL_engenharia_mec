import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { AlertCircle, BookOpen, Box, Calculator, ClipboardCheck, FileStack, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GuiaModeloServico, GuiaServicoId } from '../../types';
import { GUIA_TECNICO_CATALOGO, criarDocumentosGuiaPadrao } from '../../lib/guiaTecnicoCatalogo';
import { inicializarModelosGuiaAusentes } from '../../lib/guiaTecnicoFirestore';
import { db } from '../../lib/firebase';

const SERVICOS: { id: GuiaServicoId; nome: string; descricao: string }[] = [
  { id: 'hvac', nome: 'HVAC-R', descricao: 'Climatização, ventilação e refrigeração' },
  { id: 'ppci', nome: 'PPCI', descricao: 'Prevenção e combate a incêndio' },
  { id: 'nr12', nome: 'NR-12', descricao: 'Segurança em máquinas e equipamentos' },
  { id: 'nr13', nome: 'NR-13', descricao: 'Caldeiras, vasos de pressão e tubulações' },
];

const BLOCOS = [
  { titulo: 'Checklist inicial do cliente', icon: ClipboardCheck, texto: 'Documentos e informações necessários para iniciar o serviço.' },
  { titulo: 'Calculadora e exemplo calculado', icon: Calculator, texto: 'Exemplo identificado como ilustrativo, entradas editáveis e aviso de validação normativa.' },
  { titulo: 'Visualização 3D', icon: Box, texto: 'Modelo esquemático paramétrico e legenda técnica do serviço.' },
  { titulo: 'Arquivos finais', icon: FileStack, texto: 'Entregáveis, revisões, status de emissão e arquivos do projeto.' },
];

export const ProjetosGuiaView: React.FC = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const permitido = currentUser?.role === 'master'
    || (currentUser?.role === 'colaborador' && currentUser.permissoes?.projetosGuia === true);
  const [modelos, setModelos] = useState<GuiaModeloServico[]>(() => criarDocumentosGuiaPadrao(''));
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const servicoHash = location.hash.replace(/^#/, '') as GuiaServicoId;
  const servicoAtivo: GuiaServicoId = SERVICOS.some((servico) => servico.id === servicoHash) ? servicoHash : 'hvac';
  const modeloAtivo = modelos.find((modelo) => modelo.servico === servicoAtivo)
    || (GUIA_TECNICO_CATALOGO[servicoAtivo] as GuiaModeloServico);
  const nomeUsuario = currentUser?.nome || currentUser?.email || 'Usuário autorizado';

  useEffect(() => {
    if (!permitido || !currentUser || currentUser.role !== 'master') return;
    inicializarModelosGuiaAusentes(currentUser.email).catch((errorInicializacao) => {
      console.warn('[Guia Técnico] Falha ao inicializar modelos ausentes:', errorInicializacao);
      setErro('Não foi possível inicializar os modelos padrão. Verifique a conexão e as regras do Firestore.');
    });
  }, [permitido, currentUser]);

  useEffect(() => {
    if (!permitido) return;
    const unsubscribe = onSnapshot(collection(db, 'guia_modelos'), (snapshot) => {
      const padroes = criarDocumentosGuiaPadrao(currentUser?.email || '');
      const remotos = snapshot.docs.map((documento) => documento.data() as GuiaModeloServico);
      const porServico = new Map(remotos.map((modelo) => [modelo.servico, modelo]));
      setModelos(padroes.map((modelo) => porServico.get(modelo.servico) || modelo));
      setCarregando(false);
      setErro(null);
    }, (erroSnapshot) => {
      console.warn('[Guia Técnico] Falha ao carregar modelos:', erroSnapshot);
      setCarregando(false);
      setErro('Não foi possível carregar os modelos. Confira sua conexão e a permissão Projetos e Guia Técnico.');
    });
    return unsubscribe;
  }, [permitido, currentUser?.email]);

  useEffect(() => {
    if (!location.hash || !SERVICOS.some((servico) => `#${servico.id}` === location.hash)) {
      navigate({ pathname: location.pathname, search: location.search, hash: '#hvac' }, { replace: true });
    }
  }, [location.hash, location.pathname, location.search, navigate]);

  const itensChecklist = useMemo(
    () => modeloAtivo.grupos.reduce((total, grupo) => total + grupo.itens.length, 0),
    [modeloAtivo]
  );

  if (!currentUser) return <Navigate to="/login" replace />;
  if (!permitido) return <Navigate to="/admin" replace />;

  return (
    <div className="space-y-5 max-w-[1500px] min-w-0">
      <header>
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--adm-blue-soft)] font-bold">VL Engenharia</p>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 mt-1">
          <div>
            <h1 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight text-[var(--adm-text)]">Projetos e Guia Técnico</h1>
            <p className="text-sm text-[var(--adm-mut)] mt-1">{modeloAtivo.apresentacao}</p>
          </div>
          {currentUser.role === 'master' && (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-500 font-semibold">
              <ShieldCheck className="w-4 h-4" /> Administração dos modelos habilitada
            </span>
          )}
        </div>
      </header>

      <nav aria-label="Serviços do Guia Técnico" className="sticky top-0 z-30 -mx-2 px-2 py-2 bg-[var(--adm-bg)]/95 backdrop-blur border-y border-[var(--adm-line)]">
        <div className="flex gap-2 overflow-x-auto">
          {SERVICOS.map((servico) => (
            <button
              key={servico.id}
              type="button"
              aria-current={servicoAtivo === servico.id ? 'page' : undefined}
              onClick={() => navigate({ pathname: location.pathname, search: location.search, hash: `#${servico.id}` })}
              className={`min-h-11 px-4 rounded-xl border text-left shrink-0 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
                servicoAtivo === servico.id
                  ? 'bg-[var(--adm-blue,#2160db)] border-[var(--adm-blue,#2160db)] text-white'
                  : 'bg-[var(--adm-card)] border-[var(--adm-line)] text-[var(--adm-text)] hover:border-[var(--adm-blue-soft)]'
              }`}
            >
              <span className="block text-sm font-bold">{servico.nome}</span>
              <span className="block text-[10px] opacity-75">{servico.descricao}</span>
            </button>
          ))}
        </div>
      </nav>

      {erro && (
        <div role="alert" className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-400 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />{erro}
        </div>
      )}
      {carregando && (
        <p role="status" className="text-sm text-[var(--adm-mut)] flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Carregando modelos do serviço…
        </p>
      )}

      <section className="rounded-2xl border border-[var(--adm-line)] bg-[var(--adm-card)] p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[var(--adm-text)]">{SERVICOS.find((servico) => servico.id === servicoAtivo)?.nome}</h2>
            <div className="flex flex-wrap gap-1.5 mt-2" aria-label="Normas de referência">
              {modeloAtivo.normas.map((norma) => (
                <span key={norma} className="px-2.5 py-1 rounded-full border border-[var(--adm-line)] text-[11px] text-[var(--adm-mut)]">{norma}</span>
              ))}
            </div>
          </div>
          {currentUser.role === 'master' && (
            <span className="text-[11px] text-[var(--adm-mut)]">Modelo padrão · alterações futuras serão exclusivas para novos projetos</span>
          )}
        </div>
        {modeloAtivo.alertas?.map((alerta) => (
          <p key={alerta} className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-400">{alerta}</p>
        ))}
      </section>

      <div className="space-y-4">
        {BLOCOS.map(({ titulo, icon: Icon, texto }, indice) => (
          <section key={titulo} className="rounded-2xl border border-[var(--adm-line)] bg-[var(--adm-card)] p-4 sm:p-5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[var(--adm-blue,#2160db)]/15 text-[var(--adm-blue-soft)] flex items-center justify-center text-xs font-bold">{indice + 1}</span>
              <Icon className="w-4 h-4 text-[var(--adm-blue-soft)]" />
              <h3 className="text-base font-bold text-[var(--adm-text)]">{titulo}</h3>
            </div>
            {indice === 0 ? (
              <div className="mt-3">
                <p className="text-xs text-[var(--adm-mut)]">{itensChecklist} itens-modelo organizados em {modeloAtivo.grupos.length} grupos.</p>
                <p className="mt-2 text-sm text-[var(--adm-mut)]">Nenhum projeto ainda. Crie o primeiro.</p>
              </div>
            ) : indice === 1 ? (
              <div className="mt-3 rounded-xl border border-amber-500/35 bg-amber-500/10 p-3 text-xs text-amber-400 flex gap-2">
                <BookOpen className="w-4 h-4 shrink-0" />{texto}
              </div>
            ) : indice === 2 ? (
              <div className="mt-3 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3 items-start">
                <p className="text-sm text-[var(--adm-mut)]">{modeloAtivo.modelo3d.descricao}</p>
                <div className="flex flex-wrap gap-2">
                  {modeloAtivo.modelo3d.legenda.map((item) => (
                    <span key={item.nome} className="inline-flex items-center gap-1.5 text-xs text-[var(--adm-mut)]">
                      <i aria-hidden="true" className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.cor }} />{item.nome}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[580px] text-left text-xs">
                  <thead><tr className="border-b border-[var(--adm-line)] text-[var(--adm-mut)]">
                    <th className="py-2 pr-3">Entrega</th><th className="py-2 pr-3">Formato</th><th className="py-2">Descrição</th>
                  </tr></thead>
                  <tbody className="divide-y divide-[var(--adm-line)]">
                    {modeloAtivo.entregas.map((entrega) => (
                      <tr key={entrega.nome}>
                        <td className="py-2.5 pr-3 font-semibold text-[var(--adm-text)]">{entrega.nome}</td>
                        <td className="py-2.5 pr-3 text-[var(--adm-mut)]">{entrega.formato}</td>
                        <td className="py-2.5 text-[var(--adm-mut)]">{entrega.descricao}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </div>
      <p className="text-[10px] text-[var(--adm-mut)]">Sessão iniciada por {nomeUsuario}. Todo conteúdo de demonstração será identificado como “Exemplo ilustrativo”.</p>
    </div>
  );
};
