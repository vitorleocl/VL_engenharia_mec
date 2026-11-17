import React, { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, doc, setDoc, writeBatch } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Check, Clipboard, Download, Loader2, Paperclip, RotateCcw } from 'lucide-react';
import jsPDF from 'jspdf';
import { useAuth } from '../../../context/AuthContext';
import {
  GuiaModeloServico,
  ProjetoGuia,
  ProjetoGuiaChecklistEstado,
  ProjetoGuiaChecklistItem,
} from '../../../types';
import { db, storage } from '../../../lib/firebase';

interface ChecklistProjetoGuiaProps {
  projeto: ProjetoGuia;
  modelo: GuiaModeloServico;
  clienteNome: string;
}

const rotulosEstado: Record<ProjetoGuiaChecklistEstado, string> = {
  pendente: 'Pendente',
  recebido: 'Recebido',
  na: 'Não se aplica',
};

export const ChecklistProjetoGuia: React.FC<ChecklistProjetoGuiaProps> = ({ projeto, modelo, clienteNome }) => {
  const { currentUser } = useAuth();
  const [itens, setItens] = useState<ProjetoGuiaChecklistItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [ocupadoId, setOcupadoId] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'projetos_guia', projeto.id, 'checklist'),
      (snapshot) => {
        setItens(snapshot.docs.map((item) => item.data() as ProjetoGuiaChecklistItem)
          .sort((a, b) => {
            const grupoA = modelo.grupos.findIndex((grupo) => grupo.titulo === a.grupo);
            const grupoB = modelo.grupos.findIndex((grupo) => grupo.titulo === b.grupo);
            if (grupoA !== grupoB) return grupoA - grupoB;
            const ordemA = modelo.grupos[grupoA]?.itens.findIndex((entrada) => entrada.id === a.modeloItemId) ?? 0;
            const ordemB = modelo.grupos[grupoB]?.itens.findIndex((entrada) => entrada.id === b.modeloItemId) ?? 0;
            return ordemA - ordemB;
          }));
        setCarregando(false);
      },
      (error) => {
        console.warn('[Guia Técnico] Falha ao carregar checklist do projeto:', error);
        setMensagem('Não foi possível carregar o checklist. Confira a conexão e as regras de acesso.');
        setCarregando(false);
      },
    );
    return unsubscribe;
  }, [modelo, projeto.id]);

  const total = itens.length;
  const concluidos = itens.filter((item) => item.estado !== 'pendente').length;
  const progresso = total ? Math.round((concluidos / total) * 100) : 0;
  const itensPorGrupo = useMemo(
    () => modelo.grupos.map((grupo) => ({
      grupo,
      itens: itens.filter((item) => item.grupo === grupo.titulo),
    })),
    [itens, modelo.grupos],
  );

  const salvarItem = async (item: ProjetoGuiaChecklistItem, patch: Partial<ProjetoGuiaChecklistItem>) => {
    const atualizado = {
      ...item,
      ...patch,
      atualizadoEm: new Date().toISOString(),
      atualizadoPor: currentUser?.uid || '',
    };
    setItens((anteriores) => anteriores.map((entrada) => entrada.id === item.id ? atualizado : entrada));
    try {
      await setDoc(doc(db, 'projetos_guia', projeto.id, 'checklist', item.id), atualizado, { merge: true });
    } catch (error) {
      console.warn('[Guia Técnico] Erro ao salvar item do checklist:', error);
      setMensagem(`Não foi possível salvar “${item.texto}”. Tente novamente.`);
    }
  };

  const anexarArquivo = async (item: ProjetoGuiaChecklistItem, arquivo?: File) => {
    if (!arquivo || !currentUser) return;
    setOcupadoId(item.id);
    setMensagem(null);
    try {
      const caminho = `projetos-guia/${projeto.clienteId}/${projeto.id}/checklist/${item.id}/${Date.now()}-${arquivo.name}`;
      const destino = ref(storage, caminho);
      await uploadBytes(destino, arquivo, { contentType: arquivo.type || 'application/octet-stream' });
      const url = await getDownloadURL(destino);
      await salvarItem(item, {
        anexos: [...(item.anexos || []), {
          nome: arquivo.name,
          url,
          enviadoEm: new Date().toISOString(),
          enviadoPor: currentUser.uid,
        }],
      });
    } catch (error) {
      console.warn('[Guia Técnico] Erro ao anexar arquivo:', error);
      setMensagem('Falha no envio do anexo. Confira o acesso ao Firebase Storage e tente novamente.');
    } finally {
      setOcupadoId(null);
    }
  };

  const copiarLista = async () => {
    const texto = [
      `VL ENGENHARIA — CHECKLIST INICIAL`,
      `Serviço: ${modelo.servico.toUpperCase()}`,
      `Projeto: ${projeto.nome}`,
      `Cliente: ${clienteNome}`,
      '',
      ...itensPorGrupo.flatMap(({ grupo, itens: itensGrupo }) => [
        grupo.titulo,
        ...itensGrupo.map((item) => `${item.estado === 'recebido' ? '[x]' : item.estado === 'na' ? '[-]' : '[ ]'} ${item.texto}`),
        '',
      ]),
    ].join('\n');
    try {
      await navigator.clipboard.writeText(texto);
      setMensagem('Lista copiada para a área de transferência.');
    } catch {
      setMensagem(texto);
    }
  };

  const gerarPdf = async () => {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const margem = 15;
    const largura = pdf.internal.pageSize.getWidth();
    let y = 17;
    try {
      const respostaLogo = await fetch('/vl-logo-horizontal.svg');
      if (respostaLogo.ok) {
        const svg = await respostaLogo.text();
        const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
        const imagem = new Image();
        imagem.src = url;
        await new Promise<void>((resolve, reject) => {
          imagem.onload = () => resolve();
          imagem.onerror = () => reject(new Error('Logo não carregou'));
        });
        const canvas = document.createElement('canvas');
        canvas.width = imagem.naturalWidth || 600;
        canvas.height = imagem.naturalHeight || 160;
        canvas.getContext('2d')?.drawImage(imagem, 0, 0);
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margem, y, 62, 16);
        URL.revokeObjectURL(url);
      }
    } catch {
      pdf.setFontSize(16);
      pdf.setTextColor(25, 76, 145);
      pdf.text('VL ENGENHARIA', margem, y + 8);
    }
    y += 23;
    pdf.setTextColor(25, 35, 52);
    pdf.setFontSize(16);
    pdf.text('Checklist inicial do cliente', margem, y);
    y += 8;
    pdf.setFontSize(10);
    pdf.text(`Projeto: ${projeto.nome}`, margem, y);
    y += 5;
    pdf.text(`Cliente: ${clienteNome}`, margem, y);
    y += 5;
    pdf.text(`Serviço: ${modelo.servico.toUpperCase()} · Emissão: ${new Date().toLocaleDateString('pt-BR')}`, margem, y);
    y += 8;

    for (const { grupo, itens: itensGrupo } of itensPorGrupo) {
      if (y > 270) { pdf.addPage(); y = 18; }
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.text(grupo.titulo, margem, y);
      y += 6;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      for (const item of itensGrupo) {
        const estado = item.estado === 'recebido' ? 'Recebido' : item.estado === 'na' ? 'Não se aplica' : 'Pendente';
        const linha = pdf.splitTextToSize(`[${estado}] ${item.texto}${item.observacao ? ` — ${item.observacao}` : ''}`, largura - margem * 2 - 3) as string[];
        const altura = linha.length * 4.5;
        if (y + altura > 280) { pdf.addPage(); y = 18; }
        pdf.text(linha, margem + 2, y);
        y += altura + 1.5;
      }
      y += 2;
    }
    pdf.save(`Checklist_${modelo.servico}_${projeto.id}.pdf`);
  };

  const limparChecklist = async () => {
    if (!window.confirm('Limpar estados e observações deste checklist? Os anexos existentes serão mantidos.')) return;
    const batch = writeBatch(db);
    const agora = new Date().toISOString();
    itens.forEach((item) => batch.set(
      doc(db, 'projetos_guia', projeto.id, 'checklist', item.id),
      { estado: 'pendente', observacao: '', atualizadoEm: agora, atualizadoPor: currentUser?.uid || '' },
      { merge: true },
    ));
    try {
      await batch.commit();
      setMensagem('Estados e observações do checklist foram limpos.');
    } catch (error) {
      console.warn('[Guia Técnico] Falha ao limpar checklist:', error);
      setMensagem('Não foi possível limpar o checklist. Tente novamente.');
    }
  };

  if (carregando) {
    return <p role="status" className="text-sm text-[var(--adm-mut)] inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Carregando checklist do projeto…</p>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-[var(--adm-bg)] border border-[var(--adm-line)] p-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-sm font-semibold text-[var(--adm-text)]">{concluidos} de {total} recebidos ou não aplicáveis</p>
          <span className="text-xs font-mono text-[var(--adm-mut)]">{progresso}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-[var(--adm-line)] overflow-hidden">
          <div className="h-full bg-emerald-500 transition-all" style={{ width: `${progresso}%` }} />
        </div>
      </div>

      {itensPorGrupo.map(({ grupo, itens: itensGrupo }) => (
        <fieldset key={grupo.titulo} className="rounded-xl border border-[var(--adm-line)] p-3.5 min-w-0">
          <legend className="px-1 text-sm font-bold text-[var(--adm-text)]">{grupo.titulo}</legend>
          <div className="space-y-3">
            {itensGrupo.map((item) => (
              <article key={item.id} className="rounded-lg bg-[var(--adm-bg)] p-3">
                <p className="text-sm text-[var(--adm-text)]">{item.texto}</p>
                <div role="radiogroup" aria-label={`Estado: ${item.texto}`} className="flex flex-wrap gap-2 mt-2">
                  {(Object.keys(rotulosEstado) as ProjetoGuiaChecklistEstado[]).map((estado) => (
                    <label key={estado} className={`min-h-9 px-2.5 rounded-lg border text-[11px] inline-flex items-center gap-1.5 cursor-pointer ${
                      item.estado === estado ? 'border-blue-500 text-blue-400 bg-blue-500/10' : 'border-[var(--adm-line)] text-[var(--adm-mut)]'
                    }`}>
                      <input
                        type="radio"
                        name={`estado-${item.id}`}
                        checked={item.estado === estado}
                        onChange={() => void salvarItem(item, { estado })}
                        className="accent-blue-600"
                      />
                      {rotulosEstado[estado]}
                    </label>
                  ))}
                </div>
                <label className="block mt-2 text-[11px] text-[var(--adm-mut)]">
                  Observação
                  <textarea
                    rows={2}
                    value={item.observacao || ''}
                    onChange={(event) => setItens((anteriores) => anteriores.map((entrada) => entrada.id === item.id ? { ...entrada, observacao: event.target.value } : entrada))}
                    onBlur={(event) => void salvarItem(item, { observacao: event.target.value })}
                    className="mt-1 w-full rounded-lg px-3 py-2 bg-[var(--adm-card)] border border-[var(--adm-line)] text-xs text-[var(--adm-text)]"
                  />
                </label>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <label className="min-h-9 px-2.5 rounded-lg border border-[var(--adm-line)] text-[11px] text-[var(--adm-mut)] inline-flex items-center gap-1.5 cursor-pointer">
                    {ocupadoId === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Paperclip className="w-3.5 h-3.5" />}
                    Anexar arquivo ou foto
                    <input type="file" accept="image/*,.pdf,.dwg,.dxf,.ifc,.xlsx,.docx" disabled={ocupadoId === item.id} onChange={(event) => void anexarArquivo(item, event.target.files?.[0])} className="sr-only" />
                  </label>
                  {(item.anexos || []).map((anexo, index) => (
                    <a key={`${anexo.url}-${index}`} href={anexo.url} target="_blank" rel="noreferrer" className="text-[11px] text-blue-400 underline underline-offset-2">{anexo.nome}</a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </fieldset>
      ))}

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => void copiarLista()} className="min-h-10 px-3 rounded-lg border border-[var(--adm-line)] text-xs font-semibold text-[var(--adm-text)] inline-flex items-center gap-1.5"><Clipboard className="w-4 h-4" />Copiar lista</button>
        <button type="button" onClick={() => void gerarPdf()} className="min-h-10 px-3 rounded-lg border border-[var(--adm-line)] text-xs font-semibold text-[var(--adm-text)] inline-flex items-center gap-1.5"><Download className="w-4 h-4" />Gerar PDF para o cliente</button>
        <button type="button" onClick={() => void limparChecklist()} className="min-h-10 px-3 rounded-lg border border-rose-500/40 text-xs font-semibold text-rose-400 inline-flex items-center gap-1.5"><RotateCcw className="w-4 h-4" />Limpar</button>
      </div>
      {mensagem && <p role="status" className="text-xs text-[var(--adm-mut)] inline-flex items-start gap-1.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" />{mensagem}</p>}
    </div>
  );
};
