import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Vortex/funnel particle background for the hero — wide at top and bottom,
 * narrowing to a thin waist at vertical-center, slowly flowing upward with a
 * gentle whole-system rotation. Raw Three.js (no @react-three/fiber — three
 * is already a dependency via TrafficWave, this mirrors that component's
 * vanilla-class + ResizeObserver pattern rather than adding a new library).
 *
 * Background only: no text/logo/icons are drawn into the canvas.
 */

const DESKTOP_TOTAL = 1200; // within the 800–1500 spec range
const MOBILE_TOTAL = 400; // within the 300–500 spec range, hard cap (not CSS-hidden)
const GOLD_RATIO = 0.2;
const MOBILE_BREAKPOINT = 768;

const WAIST_RADIUS = 0.35;
const FLARE_RADIUS = 3.6;
const FLARE_POWER = 1.6;
const TOTAL_HEIGHT = 16; // world units; particles wrap smoothly past top/bottom
const FLOW_SPEED = 0.018; // t-units/sec — slow continuous upward cycle
const ROTATE_SPEED = 0.045; // rad/sec — gentle whole-system rotation
const VORTEX_X_OFFSET = 2.6; // biases the vortex right of center, clear of left-aligned text

function radiusAtHeight(t: number): number {
  const d = Math.abs(t - 0.5) * 2; // 0 at the waist, 1 at top/bottom
  return WAIST_RADIUS + (FLARE_RADIUS - WAIST_RADIUS) * Math.pow(d, FLARE_POWER);
}

function createGlowSprite(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.55)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

interface Group {
  points: THREE.Points;
  geometry: THREE.BufferGeometry;
  material: THREE.PointsMaterial;
  count: number;
  tOffset: Float32Array;
  angleOffset: Float32Array;
  radiusJitter: Float32Array;
  speed: Float32Array;
}

function createGroup(count: number, color: string, size: number, opacity: number, glow: THREE.Texture): Group {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const tOffset = new Float32Array(count);
  const angleOffset = new Float32Array(count);
  const radiusJitter = new Float32Array(count);
  const speed = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    tOffset[i] = Math.random();
    angleOffset[i] = Math.random() * Math.PI * 2;
    radiusJitter[i] = (Math.random() - 0.5) * 0.3;
    speed[i] = 0.85 + Math.random() * 0.3;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color,
    size,
    map: glow,
    transparent: true,
    opacity,
    depthWrite: false,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  return { points, geometry, material, count, tOffset, angleOffset, radiusJitter, speed };
}

function updateGroup(group: Group, elapsed: number): void {
  const positions = group.geometry.attributes.position as THREE.BufferAttribute;
  const arr = positions.array as Float32Array;
  for (let i = 0; i < group.count; i++) {
    const t = (group.tOffset[i] + elapsed * FLOW_SPEED * group.speed[i]) % 1;
    const angle = group.angleOffset[i] + elapsed * ROTATE_SPEED;
    const r = Math.max(0.05, radiusAtHeight(t) + group.radiusJitter[i]);
    const y = (t - 0.5) * TOTAL_HEIGHT;
    arr[i * 3] = VORTEX_X_OFFSET + r * Math.cos(angle);
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = r * Math.sin(angle);
  }
  positions.needsUpdate = true;
}

class VortexScene {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private glow: THREE.Texture;
  private white: Group;
  private gold: Group;
  private frameId = 0;
  private disposed = false;
  private paused = false;
  private startTime = performance.now();
  private width = 1;
  private height = 1;

  constructor(canvas: HTMLCanvasElement, total: number, maxPixelRatio: number) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPixelRatio));
    this.renderer.setClearColor(0x000000, 1);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    this.camera.position.set(0, 0, 12);
    this.camera.lookAt(0, 0, 0);

    this.glow = createGlowSprite();
    const goldCount = Math.round(total * GOLD_RATIO);
    const whiteCount = total - goldCount;
    this.white = createGroup(whiteCount, '#FFFFFF', 0.11, 0.85, this.glow);
    this.gold = createGroup(goldCount, '#C9A84C', 0.16, 1, this.glow);
    this.scene.add(this.white.points, this.gold.points);
  }

  setSize(width: number, height: number): void {
    this.width = Math.max(1, width);
    this.height = Math.max(1, height);
    this.renderer.setSize(this.width, this.height, false);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  pause(): void {
    this.paused = true;
  }

  resume(): void {
    if (this.paused && !this.disposed) {
      this.paused = false;
      this.startTime = performance.now() - this.lastElapsedMs;
      this.frameId = requestAnimationFrame(this.tick);
    }
  }

  private lastElapsedMs = 0;

  start(): void {
    this.frameId = requestAnimationFrame(this.tick);
  }

  private tick = (): void => {
    if (this.disposed || this.paused) return;
    const elapsed = (performance.now() - this.startTime) / 1000;
    this.lastElapsedMs = performance.now() - this.startTime;
    updateGroup(this.white, elapsed);
    updateGroup(this.gold, elapsed);
    this.renderer.render(this.scene, this.camera);
    this.frameId = requestAnimationFrame(this.tick);
  };

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.frameId);
    this.white.geometry.dispose();
    this.white.material.dispose();
    this.gold.geometry.dispose();
    this.gold.material.dispose();
    this.glow.dispose();
    this.renderer.dispose();
  }
}

export const HeroParticles = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<VortexScene | null>(null);
  const reduced = useReducedMotion();
  const [isMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    if (reduced) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let idleId: number | undefined;
    let cleanupInner: (() => void) | undefined;

    const init = () => {
      let scene: VortexScene;
      try {
        scene = new VortexScene(canvas, isMobile ? MOBILE_TOTAL : DESKTOP_TOTAL, isMobile ? 1.5 : 2);
      } catch {
        return;
      }
      sceneRef.current = scene;
      scene.setSize(container.clientWidth, container.clientHeight);
      scene.start();

      const ro = new ResizeObserver(() => {
        scene.setSize(container.clientWidth, container.clientHeight);
      });
      ro.observe(container);

      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) scene.resume();
          else scene.pause();
        },
        { threshold: 0 },
      );
      io.observe(container);

      cleanupInner = () => {
        ro.disconnect();
        io.disconnect();
        scene.dispose();
        sceneRef.current = null;
      };
    };

    // Lazy-init after first paint so it never competes with LCP.
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    if (ric) {
      idleId = ric(init);
    } else {
      idleId = window.setTimeout(init, 0) as unknown as number;
    }

    return () => {
      const cic = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (idleId !== undefined) {
        if (cic) cic(idleId);
        else window.clearTimeout(idleId);
      }
      cleanupInner?.();
    };
  }, [reduced, isMobile]);

  if (reduced) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(60% 60% at 68% 50%, rgba(201,168,76,0.16) 0%, rgba(201,168,76,0.05) 35%, transparent 65%), radial-gradient(50% 50% at 68% 50%, rgba(255,255,255,0.06) 0%, transparent 60%)',
        }}
      />
    );
  }

  return (
    <div ref={containerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
};

export default HeroParticles;
