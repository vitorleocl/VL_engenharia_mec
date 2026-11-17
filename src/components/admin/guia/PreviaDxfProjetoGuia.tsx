import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { analisarDxfPreview, corDxfLayer, DxfPreviewDados } from '../../../lib/dxfPreview';

export const PreviaDxfProjetoGuia: React.FC<{ url: string; nome: string }> = ({ url, nome }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dados, setDados] = useState<DxfPreviewDados | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;
    setCarregando(true);
    setErro(null);
    fetch(url).then(async (resposta) => {
      if (!resposta.ok) throw new Error('Não foi possível baixar o arquivo DXF para a prévia.');
      return analisarDxfPreview(await resposta.text());
    }).then((resultado) => {
      if (cancelado) return;
      setDados(resultado);
      setCarregando(false);
    }).catch((falha: unknown) => {
      if (cancelado) return;
      setErro(falha instanceof Error ? falha.message : 'Falha ao interpretar o arquivo DXF.');
      setCarregando(false);
    });
    return () => { cancelado = true; };
  }, [url]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !dados) return;
    const desenhar = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const escalaDpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * escalaDpr);
      canvas.height = Math.round(rect.height * escalaDpr);
      const context = canvas.getContext('2d');
      if (!context) return;
      context.scale(escalaDpr, escalaDpr);
      context.fillStyle = '#0b1728';
      context.fillRect(0, 0, rect.width, rect.height);
      const pontos = dados.entidades.flatMap((entidade) => {
        const raio = entidade.raio || 0;
        return [
          { x: (entidade.x1 || 0) - raio, y: (entidade.y1 || 0) - raio },
          { x: (entidade.x1 || 0) + raio, y: (entidade.y1 || 0) + raio },
          ...(entidade.tipo === 'LINE' ? [
            { x: entidade.x2 || 0, y: entidade.y2 || 0 },
          ] : []),
        ];
      });
      const minX = Math.min(...pontos.map((ponto) => ponto.x));
      const maxX = Math.max(...pontos.map((ponto) => ponto.x));
      const minY = Math.min(...pontos.map((ponto) => ponto.y));
      const maxY = Math.max(...pontos.map((ponto) => ponto.y));
      const margem = 24;
      const largura = Math.max(maxX - minX, 0.001);
      const altura = Math.max(maxY - minY, 0.001);
      const fator = Math.min((rect.width - margem * 2) / largura, (rect.height - margem * 2) / altura);
      const mapear = (x: number, y: number) => ({
        x: margem + (x - minX) * fator,
        y: rect.height - margem - (y - minY) * fator,
      });
      for (const entidade of dados.entidades) {
        context.strokeStyle = corDxfLayer(entidade.layer);
        context.lineWidth = 1.6;
        context.beginPath();
        if (entidade.tipo === 'LINE') {
          const a = mapear(entidade.x1 || 0, entidade.y1 || 0);
          const b = mapear(entidade.x2 || 0, entidade.y2 || 0);
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
        } else {
          const centro = mapear(entidade.x1 || 0, entidade.y1 || 0);
          context.arc(centro.x, centro.y, (entidade.raio || 0) * fator, 0, Math.PI * 2);
        }
        context.stroke();
      }
    };
    desenhar();
    const observer = new ResizeObserver(desenhar);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [dados]);

  if (carregando) return <p role="status" className="min-h-48 flex items-center justify-center text-xs text-[var(--adm-mut)]"><Loader2 className="w-4 h-4 animate-spin mr-2" />Carregando prévia DXF…</p>;
  if (erro) return <p role="alert" className="min-h-32 p-4 text-xs text-amber-400">{erro}</p>;

  return (
    <div className="space-y-2">
      <p className="text-xs text-[var(--adm-mut)]">{nome} · {dados?.entidades.length} entidades LINE/CIRCLE</p>
      <canvas ref={canvasRef} className="w-full h-[55vh] min-h-72 rounded-lg border border-[var(--adm-line)]" aria-label={`Prévia 2D do DXF ${nome}`} />
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {dados?.layers.map((layer) => <span key={layer} className="inline-flex items-center gap-1.5 text-[10px] text-[var(--adm-mut)]"><i className="w-2.5 h-2.5 rounded-sm" style={{ background: corDxfLayer(layer) }} />{layer}</span>)}
      </div>
    </div>
  );
};
