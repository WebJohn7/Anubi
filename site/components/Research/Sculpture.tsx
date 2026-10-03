import { useEffect, useRef } from "react";
import { Renderer, Camera, Transform, Geometry, Program, Mesh } from "ogl";
import { prefersReducedMotion } from "@/lib/smooth";

const RINGS = 64;
const SEG = 48;

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec3 color;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  varying vec3 vColor;
  varying float vDepth;
  void main() {
    vColor = color;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDepth = clamp((-mv.z - 5.4) / 1.8, 0.0, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec3 vColor;
  varying float vDepth;
  void main() {
    gl_FragColor = vec4(vColor, mix(1.0, 0.55, vDepth));
  }
`;

/** Centre-line of the sculpture: a (2,3) torus knot that breathes over time. */
function knot(t: number, time: number, out: number[]) {
  const p = 2;
  const q = 3;
  const r = 0.55 + 0.12 * Math.sin(time * 0.6 + t * 2.0);
  const R = 0.95;
  out[0] = (R + r * Math.cos(q * t)) * Math.cos(p * t) * 0.42;
  out[1] = (R + r * Math.cos(q * t)) * Math.sin(p * t) * 0.92;
  out[2] = r * Math.sin(q * t) * 0.8;
}

export default function Sculpture({ paused }: { paused: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), alpha: true, antialias: true });
    } catch {
      el.dataset.fallback = "true";
      return;
    }
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    el.appendChild(gl.canvas);

    const camera = new Camera(gl, { fov: 30 });
    camera.position.z = 6.2;
    const scene = new Transform();

    const vertsPerRing = SEG * 2; // gl.LINES pairs
    const positions = new Float32Array(RINGS * vertsPerRing * 3);
    const colors = new Float32Array(RINGS * vertsPerRing * 3);
    for (let r = 0; r < RINGS; r++) {
      const orange = r % 3 === 0 || r % 7 === 2;
      const c = orange ? [1.0, 0.45, 0.08] : [0.93, 0.93, 0.91];
      for (let v = 0; v < vertsPerRing; v++) colors.set(c, (r * vertsPerRing + v) * 3);
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      color: { size: 3, data: colors },
    });
    const program = new Program(gl, { vertex, fragment, transparent: true, depthTest: false });
    const mesh = new Mesh(gl, { mode: gl.LINES, geometry, program });
    mesh.setParent(scene);

    const a: number[] = [0, 0, 0];
    const b: number[] = [0, 0, 0];

    const build = (time: number) => {
      let k = 0;
      for (let r = 0; r < RINGS; r++) {
        const t = (r / RINGS) * Math.PI * 2;
        knot(t, time, a);
        knot(t + 0.01, time, b);
        // tangent + a stable normal frame
        let tx = b[0] - a[0], ty = b[1] - a[1], tz = b[2] - a[2];
        const tl = Math.hypot(tx, ty, tz) || 1;
        tx /= tl; ty /= tl; tz /= tl;
        let nx = -ty, ny = tx, nz = 0;
        const nl = Math.hypot(nx, ny, nz) || 1;
        nx /= nl; ny /= nl; nz /= nl;
        const bx = ty * nz - tz * ny, by = tz * nx - tx * nz, bz = tx * ny - ty * nx;
        const radius = 0.26 + 0.08 * Math.sin(time * 0.9 + r * 0.45);
        const wobble = 0.25 * Math.sin(time * 0.7 + r);
        for (let s = 0; s < SEG; s++) {
          for (let e = 0; e < 2; e++) {
            const ang = ((s + e) / SEG) * Math.PI * 2;
            const ca = Math.cos(ang) * radius, sa = Math.sin(ang) * radius * (1 + wobble);
            positions[k++] = a[0] + nx * ca + bx * sa;
            positions[k++] = a[1] + ny * ca + by * sa;
            positions[k++] = a[2] + nz * ca + bz * sa;
          }
        }
      }
      geometry.attributes.position.needsUpdate = true;
    };

    const resize = () => {
      const { width, height } = el.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.perspective({ aspect: width / Math.max(height, 1) });
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const reduced = prefersReducedMotion();
    let time = 0;
    let last = performance.now();
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(el);

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible) return;
      if (!pausedRef.current && !reduced) time += dt;
      build(time);
      mesh.rotation.y = time * 0.35;
      mesh.rotation.x = Math.sin(time * 0.2) * 0.25;
      renderer.render({ scene, camera });
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      gl.canvas.remove();
    };
  }, []);

  return <div ref={host} style={{ width: "100%", height: "100%" }} />;
}
