import { useEffect, useRef } from "react";
import projects from "@/content/projects.json";
import { useT } from "@/lib/locale";
import { gsap, prefersReducedMotion, scrollToTarget } from "@/lib/smooth";
import { ArrowDown, ArrowUpRight, Asterisk } from "@/components/shared/Icons";
import s from "./style.module.css";

/** Ring slots measured from the reference at 1536px: centre x/y in %, width in px. */
const SLOTS = [
  { x: 51.6, y: 24, w: 70 },
  { x: 69.4, y: 22, w: 84 },
  { x: 84.5, y: 27, w: 108 },
  { x: 89.2, y: 41, w: 146 },
  { x: 80.9, y: 60, w: 170 },
  { x: 48.1, y: 72.5, w: 154 },
  { x: 23.9, y: 73, w: 116 },
  { x: 12.2, y: 64, w: 86 },
  { x: 12.2, y: 53, w: 72 },
  { x: 18.3, y: 43, w: 66 },
  { x: 26.9, y: 35.4, w: 62 },
  { x: 37.6, y: 29, w: 66 },
  { x: 33.5, y: 85, w: 62 },
  { x: 66, y: 86, w: 70 },
];

export default function Hero() {
  const t = useT();
  const root = useRef<HTMLElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const scribbles = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const section = root.current;
    const ringEl = ring.current;
    const svg = scribbles.current;
    if (!section || !ringEl || !svg) return;

    const cards = gsap.utils.toArray<HTMLElement>("[data-card]", ringEl);
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("path"));
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      // Load: cards pop in from the centre, scribbles draw on top.
      if (!reduced) {
        gsap.from(cards, {
          opacity: 0,
          scale: 0.6,
          x: (i) => (50 - SLOTS[i].x) * 6,
          y: (i) => (50 - SLOTS[i].y) * 4,
          duration: 1.6,
          ease: "expo.out",
          stagger: { each: 0.04, from: "random" },
          delay: 0.25,
        });
        gsap.from("[data-wordmark]", { opacity: 0, y: 40, duration: 1.4, ease: "expo.out", delay: 0.15 });
        gsap.from("[data-hero-copy]", { opacity: 0, y: 24, duration: 1.2, ease: "expo.out", delay: 0.6, stagger: 0.08 });
        paths.forEach((p) => {
          const len = p.getTotalLength();
          gsap.fromTo(
            p,
            { strokeDasharray: len, strokeDashoffset: len },
            { strokeDashoffset: 0, duration: 1.3, ease: "power3.inOut", delay: 0.7 + Math.random() * 0.5 },
          );
        });
        gsap.from("[data-star]", { scale: 0, rotate: -90, duration: 1, ease: "back.out(2)", delay: 1.1, stagger: 0.15 });
        gsap.to("[data-star]", { rotate: "+=360", duration: 18, ease: "none", repeat: -1 });
      }
    }, section);

    if (reduced) return () => ctx.revert();

    // Idle drift + mouse parallax on one ticker.
    const seeds = cards.map(() => Math.random() * Math.PI * 2);
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth - 0.5;
      mouse.ty = e.clientY / window.innerHeight - 0.5;
    };
    const tick = (time: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      cards.forEach((card, i) => {
        const depth = 0.4 + SLOTS[i].w / 170;
        const bob = Math.sin(time * 0.6 + seeds[i]) * 6;
        card.style.setProperty("--dx", `${mouse.x * -28 * depth}px`);
        card.style.setProperty("--dy", `${mouse.y * -20 * depth + bob}px`);
        card.style.setProperty("--spin", `${Math.sin(time * 0.4 + seeds[i]) * 2}deg`);
      });
      ringEl.style.setProperty("--ry", `${mouse.x * 8}deg`);
      ringEl.style.setProperty("--rx", `${mouse.y * -6}deg`);
    };
    window.addEventListener("pointermove", onMove);
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.ticker.remove(tick);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className={s.hero} id="top">
      <div ref={ring} className={s.ring} aria-hidden="true">
        {projects.orbit.map((p, i) => {
          const slot = SLOTS[i % SLOTS.length];
          const tiltY = (slot.x - 50) * -0.7;
          const tiltX = (slot.y - 48) * 0.35;
          return (
            <div
              key={p.slug || i}
              data-card
              className={s.card}
              style={
                {
                  left: `${slot.x}%`,
                  top: `${slot.y}%`,
                  width: slot.w,
                  "--tilt-y": `${tiltY}deg`,
                  "--tilt-x": `${tiltX}deg`,
                  "--tilt-z": `${((i * 37) % 9) - 4}deg`,
                } as React.CSSProperties
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt="" loading="eager" draggable={false} />
              <span className={s.label}>
                {p.title}
                <ArrowUpRight size={10} />
              </span>
            </div>
          );
        })}
      </div>

      <div className={s.center}>
        <div className={s.wordmarkWrap}>
          <svg ref={scribbles} className={s.scribbles} viewBox="0 0 760 300" fill="none" aria-hidden="true">
            {/* blue loop around the A */}
            <path
              d="M196 236C150 196 168 98 222 58C262 30 290 52 270 104C246 168 168 250 140 220"
              stroke="var(--blue)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* yellow double stroke under the wordmark */}
            <path d="M26 238C200 206 420 188 590 186" stroke="var(--yellow)" strokeWidth="7" strokeLinecap="round" />
            <path d="M40 252C180 226 280 212 360 206" stroke="var(--yellow)" strokeWidth="5" strokeLinecap="round" />
            <path d="M560 192C640 188 700 188 742 186" stroke="var(--yellow)" strokeWidth="5" strokeLinecap="round" />
            {/* orange curl on the right */}
            <path
              d="M700 30C712 90 690 150 646 182C610 208 578 198 590 176C604 152 640 172 620 204C600 232 560 236 528 228"
              stroke="var(--orange)"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
          <span data-star className={`${s.star} ${s.starTop}`}>
            <Asterisk size={44} />
          </span>
          <span data-star className={`${s.star} ${s.starBottom}`}>
            <Asterisk size={30} />
          </span>
          <h1 className={s.wordmark} data-wordmark>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/anubi-footer.svg" alt="Anubi" width={597} height={92} />
          </h1>
        </div>
        <p className={s.caption} data-hero-copy>
          {t.hero.caption}
        </p>
      </div>

      <div className={s.bottom}>
        <p className={s.statement} data-hero-copy>
          {t.hero.statement1}
          <br />
          <span>{t.hero.statement2}</span>
        </p>
        <button className={s.discover} data-hero-copy onClick={() => scrollToTarget("#clients")}>
          {t.hero.discover}
          <ArrowDown size={20} />
        </button>
      </div>
    </section>
  );
}
