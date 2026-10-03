import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/smooth";

type P = { hx: number; hy: number; x: number; y: number; vx: number; vy: number; s: number; a: number; ph: number };

/** The word "code" sampled into square particles that shimmer and scatter around the cursor. */
export default function Particles({ word = "code" }: { word?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio, 2);

    let w = 0;
    let h = 0;
    let particles: P[] = [];
    let specks: { x: number; y: number; v: number; a: number }[] = [];
    const mouse = { x: -9999, y: -9999 };

    const sample = () => {
      const rect = canvas.getBoundingClientRect();
      // Whole pixels: the offscreen canvas truncates, and the pixel index below must match it.
      w = Math.floor(rect.width);
      h = Math.floor(rect.height);
      if (!w || !h) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const o = off.getContext("2d")!;
      const size = Math.min(w * 0.12, 150);
      const family = getComputedStyle(document.body).fontFamily;
      o.font = `500 ${size}px ${family}`;
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.fillStyle = "#fff";
      o.fillText(word, w / 2, h / 2);

      const data = o.getImageData(0, 0, w, h).data;
      const step = Math.max(3, Math.round(size / 40));
      const solid = (x: number, y: number) =>
        x >= 0 && y >= 0 && x < w && y < h && data[(y * w + x) * 4 + 3] > 128;
      // Edges keep almost every sample, interiors only some, so the letter shapes read clearly.
      const edge = step * 2;
      particles = [];
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          if (!solid(x, y)) continue;
          const onEdge = !solid(x - edge, y) || !solid(x + edge, y) || !solid(x, y - edge) || !solid(x, y + edge);
          if (Math.random() < (onEdge ? 0.95 : 0.4)) {
            particles.push({
              hx: x, hy: y,
              x: x + (Math.random() - 0.5) * 300, y: y + (Math.random() - 0.5) * 200,
              vx: 0, vy: 0,
              s: Math.random() < 0.25 ? 3.4 : 2.4,
              a: 0.5 + Math.random() * 0.5,
              ph: Math.random() * Math.PI * 2,
            });
          }
        }
      }
      if (reduced) particles.forEach((p) => ((p.x = p.hx), (p.y = p.hy)));
      specks = Array.from({ length: 46 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        v: 0.05 + Math.random() * 0.15,
        a: 0.15 + Math.random() * 0.35,
      }));
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#fff";
      for (const s of specks) {
        if (!reduced) {
          s.y -= s.v;
          if (s.y < 0) s.y = h;
        }
        ctx.globalAlpha = s.a;
        ctx.fillRect(s.x, s.y, 2, 2);
      }
      for (const p of particles) {
        if (!reduced) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 9000) {
            const f = (9000 - d2) / 9000;
            p.vx += (dx / Math.sqrt(d2 + 1)) * f * 2.4;
            p.vy += (dy / Math.sqrt(d2 + 1)) * f * 2.4;
          }
          p.vx += (p.hx - p.x) * 0.045;
          p.vy += (p.hy - p.y) * 0.045;
          p.vx *= 0.82;
          p.vy *= 0.82;
          p.x += p.vx;
          p.y += p.vy;
        }
        ctx.globalAlpha = reduced ? p.a : p.a * (0.6 + 0.4 * Math.sin(time * 0.003 + p.ph));
        ctx.fillRect(p.x, p.y, p.s, p.s);
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    let visible = false;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (visible) draw(t);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    const ro = new ResizeObserver(sample);
    document.fonts.ready.then(() => {
      sample();
      io.observe(canvas);
      ro.observe(canvas);
      raf = requestAnimationFrame(loop);
    });
    canvas.parentElement?.addEventListener("pointermove", onMove);
    canvas.parentElement?.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.parentElement?.removeEventListener("pointermove", onMove);
      canvas.parentElement?.removeEventListener("pointerleave", onLeave);
    };
  }, [word]);

  return <canvas ref={ref} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}
