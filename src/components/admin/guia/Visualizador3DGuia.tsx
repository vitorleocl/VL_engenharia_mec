import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Loader2, RotateCcw, RotateCw } from 'lucide-react';
import { GuiaModeloServico, GuiaServicoId } from '../../../types';

interface Visualizador3DGuiaProps {
  servico: GuiaServicoId;
  modelo: GuiaModeloServico;
}

function material(cor: string, opacidade = 1): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: cor,
    roughness: 0.7,
    metalness: 0.08,
    transparent: opacidade < 1,
    opacity: opacidade,
    depthWrite: opacidade >= 1,
  });
}

export const Visualizador3DGuia: React.FC<Visualizador3DGuiaProps> = ({ servico, modelo }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const girarRef = useRef(false);
  const [girar, setGirar] = useState(false);
  const [erro, setErro] = useState(false);
  const [pronto, setPronto] = useState(false);
  const [movimentoReduzido, setMovimentoReduzido] = useState(false);
  const [versaoEnquadramento, setVersaoEnquadramento] = useState(0);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const atualizarPreferencia = () => setMovimentoReduzido(media.matches);
    atualizarPreferencia();
    media.addEventListener?.('change', atualizarPreferencia);
    return () => media.removeEventListener?.('change', atualizarPreferencia);
  }, []);

  useEffect(() => {
    girarRef.current = girar && !movimentoReduzido;
  }, [girar, movimentoReduzido]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    let animationId = 0;
    let resizeObserver: ResizeObserver | undefined;

    try {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#0b1728');
      scene.fog = new THREE.Fog('#0b1728', 18, 55);
      const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
      const escala = servico === 'ppci' ? 1.1 : 1;
      camera.position.set(11 * escala, 9 * escala, 13 * escala);
      camera.lookAt(0, 1, 0);
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.domElement.className = 'block w-full h-full';
      renderer.domElement.setAttribute('aria-label', `Modelo 3D esquemático ilustrativo de ${servico.toUpperCase()}`);
      container.replaceChildren(renderer.domElement);

      scene.add(new THREE.HemisphereLight('#dcecff', '#28374d', 2.1));
      const luzPrincipal = new THREE.DirectionalLight('#ffffff', 2.4);
      luzPrincipal.position.set(9, 14, 8);
      scene.add(luzPrincipal);
      const luzPreenchimento = new THREE.DirectionalLight('#60a5fa', 1.2);
      luzPreenchimento.position.set(-8, 5, -9);
      scene.add(luzPreenchimento);

      const grupo = new THREE.Group();
      scene.add(grupo);
      const chao = new THREE.Mesh(new THREE.PlaneGeometry(35, 35), material('#16243a'));
      chao.rotation.x = -Math.PI / 2;
      chao.position.y = -0.025;
      grupo.add(chao);

      const caixa = (x: number, y: number, z: number, sx: number, sy: number, sz: number, cor: string, alpha = 1) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), material(cor, alpha));
        mesh.position.set(x, y, z);
        grupo.add(mesh);
        return mesh;
      };
      const cilindro = (x: number, y: number, z: number, raio: number, altura: number, cor: string, rotacaoZ = 0) => {
        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(raio, raio, altura, 18), material(cor));
        mesh.position.set(x, y, z);
        mesh.rotation.z = rotacaoZ;
        grupo.add(mesh);
        return mesh;
      };
      const esfera = (x: number, y: number, z: number, raio: number, cor: string) => {
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(raio, 16, 12), material(cor));
        mesh.position.set(x, y, z);
        grupo.add(mesh);
        return mesh;
      };
      const segmento = (a: THREE.Vector3, b: THREE.Vector3, cor: string, grossura = 0.045) => {
        const direcao = new THREE.Vector3().subVectors(b, a);
        const malha = new THREE.Mesh(new THREE.CylinderGeometry(grossura, grossura, direcao.length(), 10), material(cor));
        malha.position.copy(a).add(b).multiplyScalar(0.5);
        malha.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direcao.normalize());
        grupo.add(malha);
      };
      const contornoSala = (largura: number, profundidade: number, altura: number, alpha = 0.08) => {
        caixa(0, altura / 2, 0, largura, altura, profundidade, '#64748b', alpha);
        const wire = new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.BoxGeometry(largura, altura, profundidade)),
          new THREE.LineBasicMaterial({ color: '#94a3b8', transparent: true, opacity: 0.8 }),
        );
        wire.position.y = altura / 2;
        grupo.add(wire);
      };

      if (servico === 'hvac') {
        contornoSala(10, 6, 2.7);
        caixa(-4.96, 1.25, 0, 0.05, 1.55, 3.1, '#38bdf8', 0.48);
        for (let i = 0; i < 4; i += 1) {
          const x = -3.6 + i * 2.2;
          caixa(x, 0.72, -1.15, 1.15, 0.12, 0.72, '#64748b');
          caixa(x, 1.12, -1.15, 0.035, 0.68, 0.035, '#94a3b8');
          caixa(x, 0.72, 1.15, 1.15, 0.12, 0.72, '#64748b');
          caixa(x, 1.12, 1.15, 0.035, 0.68, 0.035, '#94a3b8');
        }
        caixa(0, 2.42, 0, 1.15, 0.32, 1.15, '#22c55e');
        caixa(0, 2.61, 0, 0.38, 0.08, 0.38, '#bbf7d0');
        caixa(0, 2.28, -0.75, 3.6, 0.2, 0.22, '#38bdf8');
        caixa(-1.1, 2.14, -1.9, 0.22, 0.18, 2.2, '#38bdf8');
        caixa(1.1, 2.14, -1.9, 0.22, 0.18, 2.2, '#38bdf8');
        for (const x of [-3, -1, 1, 3]) for (const z of [-2, 2]) caixa(x, 2.62, z, 0.6, 0.05, 0.6, '#facc15');
        caixa(6, 0.85, 0, 1.1, 1.3, 0.9, '#64748b');
        for (let i = -1; i <= 1; i += 1) segmento(new THREE.Vector3(0.55, 2.35, i * 0.08), new THREE.Vector3(5.45, 1.1, i * 0.08), '#f97316', 0.035);
      } else if (servico === 'ppci') {
        contornoSala(20, 20, 3, 0.06);
        for (const z of [-5.5, -1.8, 1.8, 5.5]) {
          caixa(-2.7, 0.75, z, 1.1, 1.5, 3.1, '#64748b');
          caixa(1.2, 0.75, z, 1.1, 1.5, 3.1, '#64748b');
        }
        for (const [x, z] of [[-8, -8], [8, -8], [-8, 8], [8, 8]] as [number, number][]) cilindro(x, 1.1, z, 0.18, 0.6, '#f97316');
        for (const [x, z] of [[-8, -7], [8, -7]] as [number, number][]) cilindro(x, 1.15, z, 0.22, 0.45, '#ef4444');
        for (const [x, z] of [[-6, 0], [-3, 0], [0, 0], [3, 0], [6, 0]] as [number, number][]) esfera(x, 2.5, z, 0.16, '#facc15');
        segmento(new THREE.Vector3(0, 0.05, 6), new THREE.Vector3(-7.7, 0.05, -8.5), '#22c55e', 0.08);
        segmento(new THREE.Vector3(0, 0.05, 6), new THREE.Vector3(7.7, 0.05, -8.5), '#22c55e', 0.08);
      } else if (servico === 'nr12') {
        caixa(0, 0.18, 0, 5.3, 0.35, 3.4, '#475569');
        caixa(0, 1.05, -0.25, 2.6, 1.4, 2.2, '#64748b');
        caixa(0, 2.35, -0.25, 1.55, 1.15, 1.2, '#94a3b8');
        caixa(0, 3.08, -0.25, 2.4, 0.18, 2.1, '#64748b');
        esfera(0, 1.75, 0.75, 0.25, '#ef4444');
        for (const x of [-1.9, 1.9]) for (const z of [-1.35, 1.35]) caixa(x, 1.1, z, 0.08, 2.05, 0.08, '#facc15');
        for (const z of [-1.35, 1.35]) caixa(0, 2.1, z, 3.8, 0.08, 0.08, '#facc15');
        caixa(0, 1.15, 1.38, 3.6, 1.65, 0.035, '#22c55e', 0.35);
        for (let x = -1.65; x <= 1.65; x += 0.22) segmento(new THREE.Vector3(x, 0.35, 1.4), new THREE.Vector3(x, 1.95, 1.4), '#86efac', 0.012);
        caixa(2.7, 0.6, 1.2, 0.35, 1.2, 0.35, '#ef4444');
        cilindro(2.7, 1.3, 1.2, 0.14, 0.12, '#fca5a5');
        esfera(-3.2, 1.15, 1.1, 0.28, '#f1c7a5');
        caixa(-3.2, 0.65, 1.1, 0.38, 0.95, 0.3, '#60a5fa');
      } else {
        const casco = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 2, 40, 1), material('#94a3b8', 0.92));
        casco.rotation.z = Math.PI / 2;
        casco.position.set(0, 1.1, 0);
        grupo.add(casco);
        for (const x of [-0.76, 0.76]) {
          const tampo = new THREE.Mesh(new THREE.SphereGeometry(0.4, 24, 16, 0, Math.PI * 2, 0, Math.PI), material('#94a3b8'));
          tampo.rotation.z = Math.PI / 2;
          tampo.position.x = x;
          tampo.position.y = 1.1;
          grupo.add(tampo);
          caixa(x, 0.42, 0, 0.2, 0.55, 1.2, '#64748b');
        }
        caixa(0, 0.08, 0, 2.3, 0.15, 1.6, '#475569');
        cilindro(0.05, 1.57, 0, 0.07, 0.55, '#38bdf8');
        cilindro(0.28, 1.53, 0, 0.08, 0.45, '#ef4444');
        esfera(-0.28, 1.62, 0, 0.12, '#facc15');
        cilindro(0, 0.55, 0.4, 0.09, 0.32, '#38bdf8');
        cilindro(0.78, 0.55, -0.25, 0.07, 0.32, '#38bdf8');
      }

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.075;
      controls.enablePan = true;
      controls.minDistance = 3.5;
      controls.maxDistance = 45;
      controls.target.set(0, 1, 0);
      const ajustar = () => {
        const largura = Math.max(1, container.clientWidth);
        const altura = Math.max(1, container.clientHeight);
        camera.aspect = largura / altura;
        camera.updateProjectionMatrix();
        renderer.setSize(largura, altura, false);
      };
      resizeObserver = new ResizeObserver(ajustar);
      resizeObserver.observe(container);
      ajustar();

      const animar = () => {
        controls.autoRotate = girarRef.current;
        controls.autoRotateSpeed = 0.7;
        controls.update();
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animar);
      };
      animar();
      setErro(false);
      setPronto(true);
    } catch (error) {
      console.warn('[Guia Técnico] WebGL indisponível:', error);
      setErro(true);
      setPronto(false);
      renderer?.dispose();
      container.replaceChildren();
    }

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver?.disconnect();
      controls?.dispose();
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, [servico, versaoEnquadramento]);

  const reiniciarVista = () => {
    setGirar(false);
    // Remonta a cena para restaurar câmera e alvo iniciais.
    setPronto(false);
    setVersaoEnquadramento((versao) => versao + 1);
  };

  return (
    <div className="space-y-2">
      <div ref={containerRef} className="relative h-[300px] sm:h-[420px] overflow-hidden rounded-xl border border-[var(--adm-line)] bg-[#0b1728]">
        {!pronto && !erro && <div role="status" className="absolute inset-0 z-10 flex items-center justify-center text-xs text-slate-300"><Loader2 className="w-4 h-4 animate-spin mr-2" />Iniciando visualização 3D…</div>}
        {erro && <div role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-5 text-center text-sm text-slate-200">A visualização 3D não pôde ser iniciada neste dispositivo. Os demais recursos do módulo continuam disponíveis.</div>}
        {pronto && (
          <div className="absolute right-3 top-3 z-10 flex gap-2">
            <button type="button" onClick={() => setGirar((atual) => !atual)} aria-pressed={girar} className="min-h-9 px-2.5 rounded-lg bg-slate-900/85 border border-slate-500 text-xs font-semibold text-white inline-flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5" />{girar ? 'Parar giro' : 'Girar'}
            </button>
            <button type="button" onClick={reiniciarVista} className="min-h-9 px-2.5 rounded-lg bg-slate-900/85 border border-slate-500 text-xs font-semibold text-white inline-flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />Reiniciar vista
            </button>
          </div>
        )}
        {movimentoReduzido && <span className="absolute left-3 bottom-3 z-10 rounded-md bg-slate-900/85 px-2 py-1 text-[10px] text-slate-200">Movimento automático reduzido conforme sua preferência do sistema.</span>}
      </div>
      <p className="text-xs text-[var(--adm-mut)]">{modelo.modelo3d.descricao}</p>
      <p className="text-[10px] text-[var(--adm-mut)]">Esquema paramétrico ilustrativo — não representa projeto executivo ou dimensionamento normativo.</p>
    </div>
  );
};
