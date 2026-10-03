import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/locale";
import { useReveal } from "@/lib/reveal";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/smooth";
import { Asterisk } from "@/components/shared/Icons";
import s from "./style.module.css";

/** Two loop shapes the violet line morphs between (same command structure so they interpolate). */
const LOOP_A =
  "M200 40C120 40 30 200 40 260C48 300 120 290 200 230C280 170 330 140 360 160C400 186 392 290 360 300C330 310 300 250 268 180C236 110 236 40 200 40Z";
const LOOP_B =
  "M150 70C90 90 40 230 70 280C96 322 170 300 230 240C290 180 340 110 380 130C420 150 400 270 350 290C310 306 280 240 250 170C220 100 210 50 150 70Z";

const OFFSETS = ["0%", "18%", "6%"];

export default function Services() {
  const t = useT();
  const root = useRef<HTMLElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const underline = useRef<SVGPathElement>(null);
  const loop = useRef<SVGPathElement>(null);
  const [active, setActive] = useState(0);
  useReveal(root);

  useEffect(() => {
    const el = root.current;
    if (!el || !list.current || !underline.current || !loop.current) return;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: list.current,
        start: "top 70%",
        end: "bottom 35%",
        onUpdate: (self) => setActive(Math.min(2, Math.floor(self.progress * 3))),
      });

      if (reduced) return st;

      const u = underline.current!;
      const len = u.getTotalLength();
      gsap.fromTo(
        u,
        { strokeDasharray: len, strokeDashoffset: len },
        {
          strokeDashoffset: 0,
          duration: 1.1,
          ease: "power3.inOut",
          scrollTrigger: { trigger: u, start: "top 85%", once: true },
          delay: 0.5,
        },
      );

      const l = loop.current!;
      const loopLen = l.getTotalLength();
      gsap.fromTo(
        l,
        { strokeDasharray: loopLen, strokeDashoffset: loopLen },
        {
          strokeDashoffset: 0,
          duration: 2.2,
          ease: "power2.inOut",
          scrollTrigger: { trigger: l, start: "top 80%", once: true },
        },
      );
      gsap.to(l, {
        attr: { d: LOOP_B },
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 2.2,
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className={s.services}>
      <h2 className="srOnly">{t.services.title}</h2>
      <div className={s.intro}>
        <h3 className={s.headline} data-reveal>
          {t.services.headline1}
          <br />
          <span className={s.lastLine}>
            {t.services.headline2}
            <svg className={s.underline} viewBox="0 0 90 24" fill="none" aria-hidden="true">
              <path ref={underline} d="M4 14C30 8 60 5 86 3M12 20C30 16 44 14 56 13" stroke="var(--yellow)" strokeWidth="5" strokeLinecap="round" />
            </svg>
          </span>
        </h3>
        <p className={s.introCopy} data-reveal data-reveal-delay="0.1">
          {t.services.intro}
        </p>
      </div>

      <div className={s.block}>
        <span className={s.star}>
          <Asterisk size={36} />
        </span>
        <svg className={s.loop} viewBox="0 0 420 340" fill="none" aria-hidden="true">
          <path d={LOOP_A} stroke="var(--violet)" strokeWidth="9" strokeOpacity="0.12" />
          <path ref={loop} d={LOOP_A} stroke="var(--violet)" strokeWidth="2.2" strokeLinejoin="round" />
        </svg>

        <div ref={list} className={s.list}>
          {t.services.items.map((item, i) => (
            <div
              key={item.name}
              className={`${s.item} ${i === active ? s.active : ""}`}
              style={{ marginLeft: OFFSETS[i] }}
            >
              <span className={s.name}>{item.name}</span>
              <ul className={s.tags} aria-label={item.name}>
                {item.tags.map((tag, j) => (
                  <li key={tag} className={s.tag} style={{ "--j": j } as React.CSSProperties}>
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className={s.note}>
        <svg className={s.noteScribble} viewBox="0 0 40 20" fill="none" aria-hidden="true">
          <path d="M3 12C8 18 14 16 18 10C21 5 26 6 26 10C26 15 20 16 22 11C25 6 32 6 37 4" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <p data-reveal>{t.services.note}</p>
      </div>
    </section>
  );
}
