import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Particle ring hero background — a flat disc of points, tilted for an
 * oblique view and spinning slowly around its own axis, silver points
 * catching light from dim (left) to bright (right). Static per-particle
 * layout (built once) with the spin applied as a single transform on the
 * points object each frame, rather than rewriting every vertex position.
 * A small custom shader (not @react-three/fiber — three is already a
 * dependency via TrafficWave) drives per-particle size and a soft, lit-
 * sphere falloff instead of a flat PointsMaterial dot. The whole disc
 * parallax-tilts toward the cursor for a lightweight interactive feel.
 *
 * Background only: no text/logo/icons are drawn into the canvas.
 */

// Quieter-hero tuning knobs — fractions applied to the ring's original
// (pre-tuning) values, kept separate so each can be nudged independently.
const SPOT_DENSITY = 0.5; // fraction of the original particle count
const SPOT_SIZE = 0.7; // fraction of the original point size
const SPOT_OPACITY_LIGHT = 0.25; // ceiling for the bright/white core blend
const SPOT_OPACITY_DARK = 0.35; // ceiling for the overall layer opacity
const SPOT_SPEED = 0.6; // fraction of the original rotation speed
const MOBILE_DENSITY_FACTOR = 0.7; // extra density cut under MOBILE_BREAKPOINT, on top of SPOT_DENSITY

const DESKTOP_TOTAL = Math.round(2400 * SPOT_DENSITY);
const MOBILE_TOTAL = Math.round(900 * SPOT_DENSITY * MOBILE_DENSITY_FACTOR);
const MOBILE_BREAKPOINT = 768;

const MIN_RADIUS = 2.6;
const MAX_RADIUS = 5.4;
const HAZE_FRACTION = 0.22; // sparse outer particles so the ring doesn't end on a hard edge
const HAZE_MAX_RADIUS = 7.2;
const RING_DEPTH_JITTER = 0.45; // disc thickness, along its own normal
const HAZE_DEPTH_JITTER = 1.1;
// rad — tips a disc built face-on (in the XY plane) into an oblique view;
// cos(TILT_X) scales the vertical extent, so a large angle reads as a
// mostly-flattened ellipse rather than a face-on circle.
const TILT_X = -1.3;
const ROTATE_SPEED = 0.045 * SPOT_SPEED; // rad/sec — gentle self-rotation, never pauses
const RING_X_OFFSET = 2.6; // biases the ring right of center, clear of left-aligned text

const POINTER_DAMPING = 0.06; // per-frame lerp toward the cursor target
const POINTER_TILT = 0.16; // rad of extra tilt at the pointer's furthest reach
const POINTER_YAW = 0.22; // rad of extra yaw at the pointer's furthest reach

const EDGE = new THREE.Color('#7D848D'); // arva-silver-deep — dim side
const CORE = new THREE.Color('#E6EAEF'); // arva-silver-bright — lit side

const VERTEX_SHADER = /* glsl */ `
  attribute float aScale;
  attribute vec3 aColor;
  varying vec3 vColor;
  uniform float uSize;
  uniform float uPixelRatio;
  void main() {
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * aScale * uPixelRatio * (14.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;
  uniform float uOpacity;
  void main() {
    vec2 c = gl_PointCoord - vec2(0.5);
    float d = length(c);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.05, d);
    // A brighter core reads as a small lit sphere rather than a flat dot.
    float core = smoothstep(0.32, 0.0, d) * ${SPOT_OPACITY_LIGHT};
    vec3 shaded = mix(vColor, vec3(1.0), core);
    gl_FragColor = vec4(shaded, alpha * uOpacity);
  }
`;

function buildRingGeometry(total: number): THREE.BufferGeometry {
  const hazeCount = Math.round(total * HAZE_FRACTION);
  const bandCount = total - hazeCount;
  const positions = new Float32Array(total * 3);
  const colors = new Float32Array(total * 3);
  const scales = new Float32Array(total);
  const c = new THREE.Color();

  const write = (i: number, radius: number, depthJitter: number, dim: number, scaleMin: number, scaleMax: number) => {
    // Disc built face-on in the local XY plane — the group-level TILT_X
    // rotation is what turns this into an oblique ellipse.
    const angle = Math.random() * Math.PI * 2;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    const z = (Math.random() * 2 - 1) * depthJitter;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Local x (pre-tilt, pre-offset) drives the silver ramp — dim on the
    // left, catching the light toward the right.
    const t = THREE.MathUtils.clamp((x / MAX_RADIUS + 1) / 2, 0, 1);
    c.copy(EDGE).lerp(CORE, t);
    if (dim > 0) c.multiplyScalar(1 - dim); // haze particles recede toward black
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    scales[i] = scaleMin + Math.random() * (scaleMax - scaleMin);
  };

  for (let i = 0; i < bandCount; i++) {
    const radius = MIN_RADIUS + Math.random() * (MAX_RADIUS - MIN_RADIUS);
    write(i, radius, RING_DEPTH_JITTER, 0, 0.6, 1.7);
  }
  for (let i = bandCount; i < total; i++) {
    const radius = MIN_RADIUS * 0.5 + Math.random() * (HAZE_MAX_RADIUS - MIN_RADIUS * 0.5);
    write(i, radius, HAZE_DEPTH_JITTER, 0.45, 0.35, 0.9);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
  return geometry;
}

class RingScene {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private tilt: THREE.Group;
  private points: THREE.Points;
  private geometry: THREE.BufferGeometry;
  private material: THREE.ShaderMaterial;
  private frameId = 0;
  private disposed = false;
  private paused = false;
  private startTime = performance.now();
  private lastElapsedMs = 0;
  private width = 1;
  private height = 1;
  private pointerTargetX = 0;
  private pointerTargetY = 0;
  private pointerX = 0;
  private pointerY = 0;

  constructor(canvas: HTMLCanvasElement, total: number, maxPixelRatio: number, isMobile: boolean) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    const pixelRatio = Math.min(window.devicePixelRatio || 1, maxPixelRatio);
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setClearColor(0x000000, 1);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    this.camera.position.set(0, 0, 12);
    this.camera.lookAt(0, 0, 0);

    this.geometry = buildRingGeometry(total);
    this.material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        uSize: { value: (isMobile ? 8.0 : 10.5) * SPOT_SIZE },
        uPixelRatio: { value: pixelRatio },
        uOpacity: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    this.points = new THREE.Points(this.geometry, this.material);
    this.points.position.x = RING_X_OFFSET;

    // Static oblique tilt lives on the parent; the spin below is the
    // points object's own local rotation so it turns in its own plane.
    this.tilt = new THREE.Group();
    this.tilt.rotation.x = TILT_X;
    this.tilt.add(this.points);
    this.scene.add(this.tilt);
  }

  setSize(width: number, height: number): void {
    this.width = Math.max(1, width);
    this.height = Math.max(1, height);
    this.renderer.setSize(this.width, this.height, false);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  /** nx/ny in [-1, 1], normalized pointer position across the viewport. */
  setPointer(nx: number, ny: number): void {
    this.pointerTargetX = nx;
    this.pointerTargetY = ny;
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

  start(): void {
    this.frameId = requestAnimationFrame(this.tick);
  }

  private tick = (): void => {
    if (this.disposed || this.paused) return;
    const elapsed = (performance.now() - this.startTime) / 1000;
    this.lastElapsedMs = performance.now() - this.startTime;

    const opacity = this.material.uniforms.uOpacity;
    if (opacity.value < SPOT_OPACITY_DARK) opacity.value = Math.min(SPOT_OPACITY_DARK, opacity.value + 0.016);

    this.pointerX += (this.pointerTargetX - this.pointerX) * POINTER_DAMPING;
    this.pointerY += (this.pointerTargetY - this.pointerY) * POINTER_DAMPING;
    this.tilt.rotation.x = TILT_X + this.pointerY * POINTER_TILT;
    this.tilt.rotation.y = this.pointerX * POINTER_YAW;

    this.points.rotation.z = elapsed * ROTATE_SPEED;
    this.renderer.render(this.scene, this.camera);
    this.frameId = requestAnimationFrame(this.tick);
  };

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.frameId);
    this.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
  }
}

export const HeroParticles = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<RingScene | null>(null);
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
      let scene: RingScene;
      try {
        scene = new RingScene(canvas, isMobile ? MOBILE_TOTAL : DESKTOP_TOTAL, isMobile ? 1.5 : 2, isMobile);
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

      // Global listener (not on the canvas — it stays pointer-events:none
      // so it never blocks scroll) driving a subtle parallax tilt.
      const onPointerMove = (e: PointerEvent) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        scene.setPointer(nx, ny);
      };
      window.addEventListener('pointermove', onPointerMove, { passive: true });

      cleanupInner = () => {
        ro.disconnect();
        io.disconnect();
        window.removeEventListener('pointermove', onPointerMove);
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
            'radial-gradient(60% 60% at 68% 50%, rgba(180,186,194,0.16) 0%, rgba(180,186,194,0.05) 35%, transparent 65%), radial-gradient(50% 50% at 68% 50%, rgba(255,255,255,0.06) 0%, transparent 60%)',
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
