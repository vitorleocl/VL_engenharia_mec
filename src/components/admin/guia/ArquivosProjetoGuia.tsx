import React, { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Check, Download, Eye, EyeOff, FileUp, Loader2, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { GuiaModeloExemploArquivo, GuiaModeloServico, ProjetoGuia, ProjetoGuiaArquivo, ProjetoGuiaArquivoStatus } from '../../../types';
import { db, storage } from '../../../lib/firebase';
import { PreviaDxfProjetoGuia } from './PreviaDxfProjetoGuia';

const EXTENSOES_ACEITAS = new Set(['dwg', 'dxf', 'pdf', 'rvt', 'ifc', 'sldprt', 'sldasm', 'step', 'stp', 'xlsx', 'docx', 'glb', 'gltf']);
const ROTULO_STATUS: Record<ProjetoGuiaArquivoStatus, string> = {
  em_elaboracao: 'Em elaboração',
  em_revisao: 'Em revisão',
  emitido: 'Emitido',
};

interface PreviaSelecionada {
  url: string;
  nome: string;
  formato: string;
}

interface ArquivosProjetoGuiaProps {
  modelo: GuiaModeloServico;
  projeto?: ProjetoGuia;
}

export const ArquivosProjetoGuia: React.FC<ArquivosProjetoGuiaProps> = ({ modelo, projeto }) => {
  const { currentUser } = useAuth();
  const [arquivos, setArquivos] = useState<ProjetoGuiaArquivo[]>([]);
  const [exemplos, setExemplos] = useState<GuiaModeloExemploArquivo[]>([]);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [previsualizacao, setPrevisualizacao] = useState<PreviaSelecionada | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);

  useEffect(() => {
    if (!projeto) {
      setArquivos([]);
      return;
    }
    return onSnapshot(collection(db, 'projetos_guia', projeto.id, 'arquivos'), (snapshot) => {
      setArquivos(snapshot.docs.map((item) => ({ ...item.data(), id: item.id } as ProjetoGuiaArquivo))
        .sort((a, b) => b.enviadoEm.localeCompare(a.enviadoEm)));
    }, (error) => {
      console.warn('[Guia Técnico] Falha ao carregar arquivos:', error);
      setMensagem('Não foi possível carregar os arquivos do projeto.');
    });
  }, [projeto?.id]);

  useEffect(() => onSnapshot(collection(db, 'guia_modelos', modelo.servico, 'exemplos'), (snapshot) => {
    setExemplos(snapshot.docs.map((item) => ({ ...item.data(), id: item.id } as GuiaModeloExemploArquivo)));
  }, (error) => {
    console.warn('[Guia Técnico] Falha ao carregar arquivos de exemplo:', error);
  }), [modelo.servico]);

  const salvarArquivoProjeto = async (entregaNome: string, arquivo?: File) => {
    if (!projeto || !currentUser || !arquivo) return;
    const extensao = arquivo.name.split('.').pop()?.toLowerCase() || '';
    if (!EXTENSOES_ACEITAS.has(extensao)) {
      setMensagem(`Formato .${extensao || '?'} não aceito. Use DWG, DXF, PDF, RVT, IFC, SLDPRT, SLDASM, STEP, XLSX, DOCX, GLB ou GLTF.`);
      return;
    }
    const id = `arq-${Date.now()}`;
    const revisoes = arquivos.filter((item) => item.entregaNome === entregaNome)
      .map((item) => Number(item.revisao.replace(/^R/i, '')))
      .filter(Number.isFinite);
    const revisao = `R${String(revisoes.length ? Math.max(...revisoes) + 1 : 0).padStart(2, '0')}`;
    setUploadId(entregaNome);
    setMensagem(null);
    try {
      const caminho = `projetos-guia/${projeto.clienteId}/${projeto.id}/arquivos/${entregaNome.replace(/[^a-zA-Z0-9_-]/g, '-')}/${revisao}-${id}-${arquivo.name}`;
      const destino = ref(storage, caminho);
      await uploadBytes(destino, arquivo, { contentType: arquivo.type || 'application/octet-stream' });
      const url = await getDownloadURL(destino);
      const metadados: ProjetoGuiaArquivo = {
        id,
        nome: arquivo.name,
        formato: extensao.toUpperCase(),
        revisao,
        url,
        status: 'em_elaboracao',
        visivelCliente: false,
        enviadoPor: currentUser.uid,
        enviadoEm: new Date().toISOString(),
        entregaNome,
      };
      await setDoc(doc(db, 'projetos_guia', projeto.id, 'arquivos', id), metadados);
      setMensagem(`${arquivo.name} enviado como revisão ${revisao}.`);
    } catch (error) {
      console.warn('[Guia Técnico] Falha ao enviar arquivo:', error);
      setMensagem('Não foi possível enviar o arquivo. Confira a permissão do Firebase Storage e tente novamente.');
    } finally {
      setUploadId(null);
    }
  };

  const salvarExemplo = async (arquivo?: File) => {
    if (!arquivo || !currentUser) return;
    if (!arquivo.name.toLowerCase().endsWith('.dxf')) {
      setMensagem('O arquivo de exemplo solicitado para esta aba deve ser DXF.');
      return;
    }
    const id = `exemplo-${Date.now()}`;
    setUploadId(`exemplo-${modelo.servico}`);
    setMensagem(null);
    try {
      const caminho = `guia-modelos/${modelo.servico}/exemplos/${id}/${arquivo.name}`;
      const destino = ref(storage, caminho);
      await uploadBytes(destino, arquivo, { contentType: 'application/dxf' });
      const url = await getDownloadURL(destino);
      const registro: GuiaModeloExemploArquivo = {
        id,
        servico: modelo.servico,
        nome: arquivo.name,
        formato: 'DXF',
        url,
        enviadoPor: currentUser.uid,
        enviadoEm: new Date().toISOString(),
        exemploIlustrativo: true,
      };
      await setDoc(doc(db, 'guia_modelos', modelo.servico, 'exemplos', id), registro);
      setMensagem('Arquivo adicionado como Exemplo ilustrativo, sem vínculo a cliente.');
    } catch (error) {
      console.warn('[Guia Técnico] Falha ao enviar arquivo de exemplo:', error);
      setMensagem('Não foi possível enviar o exemplo. Verifique a conexão e as regras do Storage.');
    } finally {
      setUploadId(null);
    }
  };

  const alterarMetadado = async (arquivo: ProjetoGuiaArquivo, patch: Partial<ProjetoGuiaArquivo>) => {
    if (!projeto) return;
    try {
      await setDoc(doc(db, 'projetos_guia', projeto.id, 'arquivos', arquivo.id), patch, { merge: true });
    } catch (error) {
      console.warn('[Guia Técnico] Falha ao atualizar metadados de arquivo:', error);
      setMensagem('Não foi possível atualizar os metadados do arquivo.');
    }
  };

  const aceitar = '.dwg,.dxf,.pdf,.rvt,.ifc,.sldprt,.sldasm,.step,.stp,.xlsx,.docx,.glb,.gltf';

  return (
    <div className="space-y-4">
      {!projeto && <p className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-400">Selecione ou crie um projeto para enviar arquivos finais. O arquivo DXF de exemplo é independente de clientes.</p>}
      {projeto && (
        <div className="overflow-x-auto rounded-xl border border-[var(--adm-line)]">
          <table className="w-full min-w-[850px] text-left text-xs">
            <thead className="bg-[var(--adm-bg)] text-[var(--adm-mut)]">
              <tr><th className="p-3">Entrega do serviço</th><th className="p-3">Formato</th><th className="p-3">Arquivos e revisão</th><th className="p-3">Status</th><th className="p-3">Cliente</th><th className="p-3">Upload</th></tr>
            </thead>
            <tbody className="divide-y divide-[var(--adm-line)]">
              {modelo.entregas.map((entrega) => {
                const entregaArquivos = arquivos.filter((arquivo) => arquivo.entregaNome === entrega.nome);
                return (
                  <tr key={entrega.nome} className="align-top">
                    <td className="p-3 font-semibold text-[var(--adm-text)]">{entrega.nome}<small className="block mt-1 font-normal text-[var(--adm-mut)]">{entrega.descricao}</small></td>
                    <td className="p-3 text-[var(--adm-mut)]">{entrega.formato}</td>
                    <td className="p-3 space-y-2">
                      {entregaArquivos.length ? entregaArquivos.map((arquivo) => (
                        <div key={arquivo.id} className="flex flex-wrap items-center gap-2">
                          <a href={arquivo.url} target="_blank" rel="noreferrer" className="text-blue-400 underline underline-offset-2">{arquivo.nome}</a>
                          <span className="text-[10px] text-[var(--adm-mut)]">{arquivo.revisao}</span>
                          <button type="button" onClick={() => setPrevisualizacao({ url: arquivo.url, nome: arquivo.nome, formato: arquivo.formato })} disabled={!['PDF', 'DXF'].includes(arquivo.formato)} title="Pré-visualizar PDF ou DXF" className="min-h-7 px-2 rounded border border-[var(--adm-line)] disabled:opacity-40">Prévia</button>
                        </div>
                      )) : <span className="text-[var(--adm-mut)]">Ainda não enviado</span>}
                    </td>
                    <td className="p-3 space-y-2">
                      {entregaArquivos.map((arquivo) => (
                        <select key={arquivo.id} aria-label={`Status de ${arquivo.nome}`} value={arquivo.status} onChange={(event) => void alterarMetadado(arquivo, { status: event.target.value as ProjetoGuiaArquivoStatus })} className="min-h-8 max-w-36 rounded bg-[var(--adm-bg)] border border-[var(--adm-line)] text-[10px]">
                          <option value="em_elaboracao">{ROTULO_STATUS.em_elaboracao}</option>
                          <option value="em_revisao">{ROTULO_STATUS.em_revisao}</option>
                          <option value="emitido">{ROTULO_STATUS.emitido}</option>
                        </select>
                      ))}
                    </td>
                    <td className="p-3 space-y-2">
                      {entregaArquivos.map((arquivo) => (
                        <label key={arquivo.id} className="flex items-center gap-1.5 text-[10px] text-[var(--adm-mut)]">
                          <input type="checkbox" checked={arquivo.visivelCliente} onChange={(event) => void alterarMetadado(arquivo, { visivelCliente: event.target.checked })} className="accent-blue-600" />
                          {arquivo.visivelCliente ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}Visível
                        </label>
                      ))}
                    </td>
                    <td className="p-3">
                      <label className="min-h-8 px-2 rounded border border-[var(--adm-line)] text-[10px] inline-flex items-center gap-1 cursor-pointer">
                        {uploadId === entrega.nome ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileUp className="w-3 h-3" />}Enviar
                        <input type="file" accept={aceitar} disabled={uploadId === entrega.nome} onChange={(event) => void salvarArquivoProjeto(entrega.nome, event.target.files?.[0])} className="sr-only" />
                      </label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <section className="rounded-xl border border-[var(--adm-line)] bg-[var(--adm-bg)] p-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold text-[var(--adm-text)]">Arquivo de exemplo · {modelo.servico.toUpperCase()}</h4>
            <p className="text-[11px] text-[var(--adm-mut)] mt-1">Envie posteriormente o DXF ilustrativo desta aba. Não é associado a cliente ou projeto real.</p>
          </div>
          <label className="min-h-10 px-3 rounded-lg border border-[var(--adm-line)] text-xs font-semibold text-[var(--adm-text)] inline-flex items-center justify-center gap-1.5 cursor-pointer">
            {uploadId === `exemplo-${modelo.servico}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}Enviar DXF de exemplo
            <input type="file" accept=".dxf,application/dxf" disabled={uploadId === `exemplo-${modelo.servico}`} onChange={(event) => void salvarExemplo(event.target.files?.[0])} className="sr-only" />
          </label>
        </div>
        {exemplos.length ? (
          <ul className="mt-3 space-y-2">
            {exemplos.map((exemplo) => (
              <li key={exemplo.id} className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded bg-amber-500/15 text-amber-400 px-2 py-1 font-bold">Exemplo ilustrativo</span>
                <a href={exemplo.url} target="_blank" rel="noreferrer" className="text-blue-400 underline underline-offset-2">{exemplo.nome}</a>
                <button type="button" onClick={() => setPrevisualizacao({ url: exemplo.url, nome: exemplo.nome, formato: 'DXF' })} className="min-h-8 px-2 rounded border border-[var(--adm-line)] text-[10px]">Pré-visualizar</button>
                <a href={exemplo.url} download className="min-h-8 px-2 rounded border border-[var(--adm-line)] text-[10px] inline-flex items-center gap-1"><Download className="w-3 h-3" />Baixar</a>
              </li>
            ))}
          </ul>
        ) : <p className="mt-3 text-[11px] text-[var(--adm-mut)]">Nenhum DXF de exemplo enviado ainda.</p>}
      </section>

      {mensagem && <p role="status" className="text-xs text-[var(--adm-mut)] inline-flex items-start gap-1.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" />{mensagem}</p>}
      {previsualizacao && (
        <div className="fixed inset-0 z-[70] bg-black/80 p-3 sm:p-8 flex items-center justify-center" role="dialog" aria-modal="true" aria-label={`Pré-visualização: ${previsualizacao.nome}`}>
          <div className="bg-[var(--adm-card)] border border-[var(--adm-line)] rounded-2xl w-full max-w-5xl max-h-full overflow-auto p-3 sm:p-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h4 className="text-sm font-bold text-[var(--adm-text)]">{previsualizacao.nome}</h4>
              <button type="button" onClick={() => setPrevisualizacao(null)} aria-label="Fechar prévia" className="w-10 h-10 rounded-lg border border-[var(--adm-line)]"><X className="w-4 h-4 mx-auto" /></button>
            </div>
            {previsualizacao.formato === 'DXF' ? (
              <PreviaDxfProjetoGuia url={previsualizacao.url} nome={previsualizacao.nome} />
            ) : (
              <iframe title={`Pré-visualização PDF: ${previsualizacao.nome}`} src={previsualizacao.url} className="w-full h-[75vh] rounded-lg bg-white" />
            )}
          </div>
        </div>
      )}
      <p className="text-[10px] text-[var(--adm-mut)]">A opção “Visível para cliente” registra a preferência nos metadados. Este sistema não possui portal do cliente conectado a essa marcação.</p>
    </div>
  );
};
