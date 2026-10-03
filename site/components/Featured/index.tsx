import { useEffect, useRef, useState } from "react";
import projects from "@/content/projects.json";
import { useT } from "@/lib/locale";
import { gsap, ScrollTrigger, prefersReducedMotion, scrollToTarget } from "@/lib/smooth";
import { ArrowDown, ArrowDownRight, ArrowUpRight, Asterisk } from "@/components/shared/Icons";
import s from "./style.module.css";

const items = projects.featured;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Card transform for a signed offset from the active slot.
 * 0 = centre, +1 = peeking in from the right, -1 = leaving to the left.
 */
function pose(o: number) {
  const c = gsap.utils.clamp(-1.4, 1.4, o);
  const vw = window.innerWidth;
  if (c >= 0) {
    return {
      x: c * vw * 0.62,
      rotateY: c * -38,
      skewY: c * -6,
      scale: 1 - c * 0.22,
      opacity: c > 1.2 ? 0 : 1,
    };
  }
  return {
    x: c * vw * 0.72,
    rotateY: c * -34,
    skewY: c * 7,
    scale: 1 + c * 0.1,
    opacity: c < -1.1 ? 0 : 1,
  };
}

export default function Featured() {
  const t = useT();
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const progressPath = useRef<SVGPathElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = root.current;
    const stageEl = stage.current;
    if (!el || !stageEl) return;
    const cards = gsap.utils.toArray<HTMLElement>("[data-feature]", stageEl);
    const flourishes = gsap.utils.toArray<HTMLElement>("[data-flourish]", stageEl);
    const reduced = prefersReducedMotion();

    const render = (p: number) => {
      cards.forEach((card, i) => {
        gsap.set(card, { ...pose(i - p), zIndex: 10 - Math.abs(Math.round(i - p)) });
      });
      // A flourish shows briefly mid-transition, between two cards.
      const frac = p - Math.floor(p);
      const bump = Math.sin(Math.PI * frac);
      flourishes.forEach((f, i) => gsap.set(f, { opacity: i === Math.floor(p) % flourishes.length ? bump : 0, scale: 0.7 + bump * 0.3 }));
      setIndex(Math.min(items.length - 1, Math.round(p)));
      const path = progressPath.current;
      if (path) {
        const len = path.getTotalLength();
        path.style.strokeDasharray = `${len}`;
        path.style.strokeDashoffset = `${len * (1 - p / (items.length - 1))}`;
      }
    };

    render(0);
    if (reduced) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: () => `+=${window.innerHeight * (items.length - 1) * 0.9}`,
      pin: true,
      scrub: 0.6,
      snap: { snapTo: 1 / (items.length - 1), duration: { min: 0.2, max: 0.6 }, ease: "power2.inOut", delay: 0.1 },
      onUpdate: (self) => render(self.progress * (items.length - 1)),
      invalidateOnRefresh: true,
    });
    return () => st.kill();
  }, []);

  const current = items[index];

  return (
    <section ref={root} className={s.featured} id="featured">
      <header className={s.header}>
        <h2 className={s.heading}>{t.featured.title}</h2>
        <button className={s.beyond} onClick={() => scrollToTarget("#explore")}>
          {t.featured.beyond}
          <ArrowDownRight size={18} />
        </button>
      </header>

      <div ref={stage} className={s.stage}>
        {items.map((item, i) => (
          <article key={item.slug} data-feature className={s.card} aria-hidden={i !== index}>
            <div className={s.media}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.title} draggable={false} />
            </div>
          </article>
        ))}
        <span data-flourish className={s.flourish}>
          <svg viewBox="0 0 60 90" width="60" fill="none" aria-hidden="true">
            <path d="M52 12C40 0 14 8 8 40C2 72 26 88 40 78" stroke="var(--blue)" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </span>
        <span data-flourish className={s.flourish}>
          <Asterisk size={56} color="var(--violet)" />
        </span>
        <span data-flourish className={s.flourish}>
          <svg viewBox="0 0 90 50" width="80" fill="none" aria-hidden="true">
            <path d="M4 30C14 44 30 40 36 26C40 16 52 14 52 24C52 34 40 34 46 22C52 12 70 10 86 6" stroke="var(--orange)" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </span>

        <div className={s.caption} key={current.slug}>
          <div className={s.titleRow}>
            <h3 className={s.title}>{current.title}</h3>
            <ArrowUpRight size={26} />
          </div>
          <p className={s.meta}>
            <span>{current.type}</span>
            <span className={s.metaDivider} />
            <span>{current.client}</span>
          </p>
        </div>
      </div>

      <footer className={s.controls}>
        <div className={s.counter}>
          <span className={s.count}>{pad(index + 1)}</span>
          <svg className={s.progress} viewBox="0 0 190 12" fill="none" aria-hidden="true">
            <path d="M2 8C40 10 80 4 120 6C150 7 170 3 188 2" stroke="#d9d9d3" strokeWidth="2" strokeLinecap="round" />
            <path ref={progressPath} d="M2 8C40 10 80 4 120 6C150 7 170 3 188 2" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className={s.total}>{pad(items.length)}</span>
        </div>
        <p className={s.scrollHint}>
          {t.featured.scroll}
          <ArrowDown size={18} />
        </p>
      </footer>
    </section>
  );
}
