import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Globe,
  X,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Cliente, Laudo, TrabalhoPublicadoSite } from '../../types';

interface PublicarNoSiteModalProps {
  isOpen: boolean;
  laudo: Laudo | null;
  cliente?: Cliente;
  publicacaoExistente?: Partial<TrabalhoPublicadoSite> | null;
  onClose: () => void;
  onConfirm: (trabalho: TrabalhoPublicadoSite) => Promise<void>;
}

interface FotoOpcaoLaudo {
  id: string;
  url: string;
  titulo: string;
  origem: string;
}

const inferirCategoriaTrabalhoSite = (
  texto: string
): { categoriaFoto: TrabalhoPublicadoSite['categoriaFoto']; badge: string; normaPadrao: string } => {
  const t = texto.toLowerCase();
  if (t.includes('munck') || t.includes('guindaste') || t.includes('guindauto') || t.includes('ponte rolante') || t.includes('eleva')) {
    return { categoriaFoto: 'munck', badge: 'Içamento & Carga', normaPadrao: 'NR-11 · NBR 14768' };
  }
  if (t.includes('pmoc') || t.includes('climatiza') || t.includes('ar-condicionado') || t.includes('hvac') || t.includes('exaust')) {
    return { categoriaFoto: 'pmoc', badge: 'Climatização Legal', normaPadrao: 'Lei 13.589/2018 · NBR 16401' };
  }
  if (t.includes('playground') || t.includes('brinquedo') || t.includes('parque infantil') || t.includes('16071')) {
    return { categoriaFoto: 'playground', badge: 'Segurança Infantil', normaPadrao: 'ABNT NBR 16071' };
  }
  if (t.includes('perícia') || t.includes('pericia') || t.includes('veicular') || t.includes('automot') || t.includes('monta') || t.includes('causa raiz') || t.includes('sinistr')) {
    return { categoriaFoto: 'pericia', badge: 'Perícia Técnica', normaPadrao: 'CONTRAN · ABNT' };
  }
  if (t.includes('escavadeira') || t.includes('pá carregadeira') || t.includes('retroescavadeira') || t.includes('trator') || t.includes('pesad') || t.includes('linha amarela') || t.includes('empilhadeira')) {
    return { categoriaFoto: 'maquinas', badge: 'Linha Amarela', normaPadrao: 'NR-11 · NR-12' };
  }
  if (t.includes('manuten') || t.includes('pcm') || t.includes('caldeira') || t.includes('vaso de press') || t.includes('nr-13') || t.includes('gás') || t.includes('glp')) {
    return { categoriaFoto: 'manutencao', badge: 'Inspeção & PCM', normaPadrao: 'NR-13 · CONFEA' };
  }
  return { categoriaFoto: 'nr12', badge: 'Conformidade NR-12', normaPadrao: 'NR-12 · CREA-PE' };
};

function limparCodigoLaudoDoTitulo(texto: string): string {
  return texto
    .replace(/\s*[·•\-–]\s*(?:LAR|VL|NR\d+|VEIC(?:-[A-Z]+)?|LAU)-\d{4}-\d+\s*$/i, '')
    .trim();
}

function comprimirImagemParaDataUrl(file: File, maxLargura = 1400): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const src = typeof reader.result === 'string' ? reader.result : '';
      if (!src) {
        reject(new Error('Não foi possível ler a imagem selecionada.'));
        return;
      }
      const img = new Image();
      img.onload = () => {
        const scale = img.width > maxLargura ? maxLargura / img.width : 1;
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.86));
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = () => reject(new Error('Falha ao abrir arquivo de imagem.'));
    reader.readAsDataURL(file);
  });
}

export const PublicarNoSiteModal: React.FC<PublicarNoSiteModalProps> = ({
  isOpen,
  laudo,
  cliente,
  publicacaoExistente,
  onClose,
  onConfirm,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [titulo, setTitulo] = useState('');
  const [badge, setBadge] = useState('');
  const [norma, setNorma] = useState('');
  const [escopo, setEscopo] = useState('');
  const [resumo, setResumo] = useState('');
  const [fotoSelecionada, setFotoSelecionada] = useState<string>('');
  const [usarImagemPadrao, setUsarImagemPadrao] = useState<boolean>(false);
  const [fotosUploadLocal, setFotosUploadLocal] = useState<FotoOpcaoLaudo[]>([]);
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [publicando, setPublicando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const fotosDoLaudo = useMemo<FotoOpcaoLaudo[]>(() => {
    if (!laudo) return [];
    const seen = new Set<string>();
    const lista: FotoOpcaoLaudo[] = [];

    const addFoto = (url: string | undefined, tituloFoto: string, origem: string, prefixId: string) => {
      const cleanUrl = (url || '').trim();
      if (!cleanUrl || seen.has(cleanUrl)) return;
      seen.add(cleanUrl);
      lista.push({
        id: `${prefixId}-${lista.length}`,
        url: cleanUrl,
        titulo: tituloFoto,
        origem,
      });
    };

    // 1. Priorizar seção "Registros Fotográficos Principais" e demais seções com fotos
    const secoesOrdenadas = [...(laudo.secoes || [])].sort((a, b) => {
      const aReg = /registros?\s+fotogr/i.test(a.titulo || '') ? -1 : 0;
      const bReg = /registros?\s+fotogr/i.test(b.titulo || '') ? -1 : 0;
      return aReg - bReg;
    });

    secoesOrdenadas.forEach((sec, sIdx) => {
      (sec.fotos || []).forEach((f, fIdx) => {
        addFoto(
          f.url,
          f.titulo || f.legenda || `Foto ${fIdx + 1}`,
          sec.titulo || 'Seção do laudo',
          `sec-${sIdx}-${fIdx}`
        );
      });
    });

    // 2. Anexos fotográficos principais
    (laudo.anexosFotos || []).forEach((f, idx) => {
      addFoto(
        f.url,
        f.titulo || f.legenda || `Registro fotográfico ${idx + 1}`,
        'Registros Fotográficos Principais',
        `anexo-${idx}`
      );
    });

    // 3. Foto de capa do laudo
    if (laudo.capaFotoUrl) {
      addFoto(
        laudo.capaFotoUrl,
        laudo.capaFotoLegenda || 'Foto de Capa do Laudo',
        'Capa do laudo',
        'capa'
      );
    }

    return lista;
  }, [laudo]);

  const todasOpcoesFoto = useMemo(
    () => [...fotosUploadLocal, ...fotosDoLaudo],
    [fotosUploadLocal, fotosDoLaudo]
  );

  useEffect(() => {
    if (!isOpen || !laudo) return;
    setErro(null);
    setPublicando(false);
    setEnviandoImagem(false);
    setFotosUploadLocal([]);

    const cidade = cliente?.endereco?.cidade || 'Recife';
    const estado = cliente?.endereco?.estado || 'PE';
    const nomeCliente =
      cliente?.nomeFantasia ||
      cliente?.razaoSocial ||
      (laudo.clienteNome && !/^cliente$/i.test(laudo.clienteNome.trim()) ? laudo.clienteNome : 'Cliente corporativo');
    const infoCat = inferirCategoriaTrabalhoSite(`${laudo.tipo || ''} ${laudo.normasReferencia || ''}`);

    const tituloInicial = publicacaoExistente?.titulo
      ? limparCodigoLaudoDoTitulo(publicacaoExistente.titulo)
      : limparCodigoLaudoDoTitulo(laudo.tipo || 'Laudo Técnico Mecânico');

    setTitulo(tituloInicial);
    setBadge(publicacaoExistente?.badge || infoCat.badge);
    setNorma(publicacaoExistente?.norma || laudo.normasReferencia || infoCat.normaPadrao);
    setEscopo(
      publicacaoExistente?.escopo
        ? publicacaoExistente.escopo.replace(/^Laudo\s+[A-Z0-9-]+\s*·\s*/i, '').trim()
        : `${laudo.ativoIdentificacao && laudo.ativoIdentificacao !== laudo.tipo ? `${laudo.ativoIdentificacao} · ` : ''}${nomeCliente} (${cidade}/${estado})`
    );
    setResumo(
      publicacaoExistente?.resumo ||
        laudo.resumoExecutivo ||
        `Laudo técnico com ART registrada no CREA-PE para ${nomeCliente} (${cidade}/${estado}). Conformidade e segurança operacional validadas.`
    );

    const fotoInicial =
      publicacaoExistente?.foto ||
      fotosDoLaudo[0]?.url ||
      '';

    if (fotoInicial && !fotosDoLaudo.some((f) => f.url === fotoInicial)) {
      setFotosUploadLocal([
        {
          id: 'pub-atual',
          url: fotoInicial,
          titulo: 'Foto atual da publicação',
          origem: 'Publicação anterior',
        },
      ]);
    }

    setFotoSelecionada(fotoInicial);
    setUsarImagemPadrao(!fotoInicial);
  }, [isOpen, laudo, cliente, publicacaoExistente, fotosDoLaudo]);

  if (!isOpen || !laudo) return null;

  const infoCat = inferirCategoriaTrabalhoSite(`${laudo.tipo || ''} ${norma}`);

  const handleUploadNovaFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErro(null);

    if (!file.type.startsWith('image/')) {
      setErro('Selecione um arquivo de imagem válido (JPG, PNG ou WebP).');
      e.target.value = '';
      return;
    }

    setEnviandoImagem(true);
    try {
      const dataUrl = await comprimirImagemParaDataUrl(file);
      let finalUrl = dataUrl;

      try {
        const resp = await fetch('/api/trabalhos-publicados/imagem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dataUrl,
            nomeArquivo: file.name,
            trabalhoId: laudo.id,
          }),
        });
        if (resp.ok) {
          const json = await resp.json();
          if (json?.url) {
            finalUrl = json.url;
          }
        }
      } catch {
        // Fallback para dataUrl comprimida
      }

      const novaOpcao: FotoOpcaoLaudo = {
        id: `upload-${Date.now()}`,
        url: finalUrl,
        titulo: file.name,
        origem: 'Enviada do dispositivo',
      };
      setFotosUploadLocal((prev) => [novaOpcao, ...prev]);
      setFotoSelecionada(finalUrl);
      setUsarImagemPadrao(false);
    } catch (err: any) {
      setErro(err?.message || 'Erro ao carregar a imagem selecionada.');
    } finally {
      setEnviandoImagem(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!titulo.trim()) {
      setErro('Informe o título que será exibido no site público.');
      return;
    }

    setPublicando(true);
    try {
      const cidade = cliente?.endereco?.cidade || 'Recife';
      const estado = cliente?.endereco?.estado || 'PE';
      const agora = new Date().toISOString();

      const trabalho: TrabalhoPublicadoSite = {
        id: laudo.id,
        laudoId: laudo.id,
        titulo: titulo.trim(),
        badge: badge.trim() || infoCat.badge,
        norma: norma.trim() || infoCat.normaPadrao,
        escopo: escopo.trim() || `${cidade}/${estado}`,
        prazo: laudo.artNumero ? `ART ${laudo.artNumero}` : 'ART emitida · CREA-PE',
        resumo: resumo.trim() || 'Inspeção técnica com emissão de laudo e ART registrada no CREA-PE.',
        local: `${cidade} · ${estado}`,
        ...( !usarImagemPadrao && fotoSelecionada ? { foto: fotoSelecionada } : {}),
        categoriaFoto: infoCat.categoriaFoto,
        whatsappMsg: `Olá, Eng. Vitor Leonardo! Vi o trabalho "${titulo.trim()}" no site e gostaria de um orçamento similar.`,
        publicadoEm: agora,
      };

      await onConfirm(trabalho);
      onClose();
    } catch (err: any) {
      setErro(err?.message || 'Não foi possível publicar no site.');
    } finally {
      setPublicando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(5,14,28,0.74)] backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-publicar-site-titulo"
      onClick={(e) => {
        if (e.target === e.currentTarget && !publicando) onClose();
      }}
    >
      <div className="bg-[var(--card)] text-[var(--ink)] border-[1.5px] border-[var(--line)] rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 sm:p-7 space-y-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--line)]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--blue)]/10 text-[var(--blue)]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-publicar-site-titulo" className="text-[20px] font-bold leading-snug">
                Publicar em "Trabalhos realizados"
              </h2>
              <p className="text-xs sm:text-sm text-[var(--muted)] mt-0.5">
                Escolha a imagem e personalize o título que aparecerá na página inicial pública (sem códigos internos).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={publicando}
            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Título e Metadados Públicos */}
          <div className="space-y-3.5">
            <label className="block text-sm font-semibold">
              <span className="mb-1 block">Título exibido no site público *</span>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Laudo de Perícia Técnica Veicular – Análise de Falha Mecânica e Apuração de Causa Raiz"
                className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] font-semibold"
                required
              />
              <span className="text-[11px] text-[var(--muted)] mt-1 block">
                O código interno ({laudo.numero}) é omitido automaticamente do título público.
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <label className="block text-sm font-semibold">
                <span className="mb-1 block">Selo / Categoria</span>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="Ex: Perícia Técnica"
                  className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
                />
              </label>

              <label className="block text-sm font-semibold">
                <span className="mb-1 block">Normas aplicáveis</span>
                <input
                  type="text"
                  value={norma}
                  onChange={(e) => setNorma(e.target.value)}
                  placeholder="Ex: CONTRAN · ABNT"
                  className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
                />
              </label>
            </div>

            <label className="block text-sm font-semibold">
              <span className="mb-1 block">Escopo / Local exibido no detalhe</span>
              <input
                type="text"
                value={escopo}
                onChange={(e) => setEscopo(e.target.value)}
                className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
              />
            </label>

            <label className="block text-sm font-semibold">
              <span className="mb-1 block">Resumo do trabalho</span>
              <textarea
                rows={2}
                value={resumo}
                onChange={(e) => setResumo(e.target.value)}
                className="w-full p-2.5 border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] text-sm"
              />
            </label>
          </div>

          {/* Seletor de Imagem */}
          <div className="space-y-3 pt-3 border-t border-[var(--line)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[var(--blue)]" />
                  <span>Selecione a foto para o card do site público</span>
                </h3>
                <p className="text-xs text-[var(--muted)]">
                  Escolha entre os Registros Fotográficos Principais do laudo ou envie uma foto do computador.
                </p>
              </div>

              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUploadNovaFoto}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={enviandoImagem || publicando}
                  className="btn-tech sm text-xs py-1.5 px-3 inline-flex items-center gap-1.5 border-[var(--blue)]/40 text-[var(--blue)] hover:bg-[var(--blue)]/10"
                >
                  {enviandoImagem ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>{enviandoImagem ? 'Carregando...' : 'Selecionar do computador / pasta'}</span>
                </button>
              </div>
            </div>

            {todasOpcoesFoto.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[260px] overflow-y-auto pr-1">
                {todasOpcoesFoto.map((foto) => {
                  const selecionada = !usarImagemPadrao && fotoSelecionada === foto.url;
                  return (
                    <button
                      key={foto.id}
                      type="button"
                      onClick={() => {
                        setFotoSelecionada(foto.url);
                        setUsarImagemPadrao(false);
                      }}
                      className={`group relative rounded-xl overflow-hidden border-2 text-left transition-all cursor-pointer bg-[var(--paper)] ${
                        selecionada
                          ? 'border-[var(--blue)] ring-2 ring-[var(--blue)]/30'
                          : 'border-[var(--line)] hover:border-[var(--blue)]/60'
                      }`}
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden bg-slate-900/10">
                        <img
                          src={foto.url}
                          alt={foto.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-[11px] font-bold text-[var(--ink)] truncate">
                          {foto.titulo}
                        </p>
                        <p className="text-[10px] text-[var(--muted)] truncate">
                          {foto.origem}
                        </p>
                      </div>
                      {selecionada && (
                        <span className="absolute top-2 right-2 bg-[var(--blue)] text-white rounded-full p-1 shadow-md">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-[var(--line)] bg-[var(--paper)] text-xs text-[var(--muted)] text-center">
                Este laudo ainda não possui fotos nos registros fotográficos. Envie uma imagem acima ou use a imagem padrão da especialidade.
              </div>
            )}

            <label className="flex items-center gap-2 text-xs text-[var(--muted)] cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                checked={usarImagemPadrao}
                onChange={(e) => setUsarImagemPadrao(e.target.checked)}
                className="w-3.5 h-3.5 accent-[var(--blue)]"
              />
              <Sparkles className="w-3.5 h-3.5 text-[var(--blue)]" />
              <span>Usar imagem padrão da categoria ({infoCat.badge}) em vez de foto do laudo</span>
            </label>
          </div>

          {erro && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs sm:text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          <div className="pt-3 border-t border-[var(--line)] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={publicando}
              className="btn-tech text-sm px-4 py-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={publicando || enviandoImagem}
              className="btn-tech pri text-sm px-5 py-2 inline-flex items-center gap-2"
            >
              {publicando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
              <span>{publicando ? 'Publicando...' : 'Confirmar e publicar no site'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
