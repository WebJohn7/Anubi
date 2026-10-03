import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useT } from "@/lib/locale";
import { useReveal } from "@/lib/reveal";
import { ArrowUpRight } from "@/components/shared/Icons";
import s from "./style.module.css";

const Sculpture = dynamic(() => import("./Sculpture"), { ssr: false });

export default function Research() {
  const t = useT();
  const root = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  useReveal(root);

  return (
    <section ref={root} className={s.section} id="research">
      <p className={s.label}>
        <span className={s.labelLine} />
        {t.research.label}
      </p>

      <div className={s.grid}>
        <div className={s.studyCol}>
          <div className={s.canvas} aria-hidden="true">
            <Sculpture paused={paused} />
          </div>
          <div className={s.studyBar}>
            <span>{t.research.study}</span>
            <button
              className={s.pause}
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? t.research.play : t.research.pause}
              aria-pressed={paused}
            >
              {paused ? (
                <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true">
                  <path d="M1 1L9 6L1 11Z" fill="currentColor" />
                </svg>
              ) : (
                <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true">
                  <path d="M1 4V8M6 1V11M10 1V11M15 4V8" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              )}
            </button>
          </div>
          <div className={s.foot}>
            <p>{t.research.foot1}</p>
            <p>{t.research.foot2}</p>
          </div>
        </div>

        <div className={s.copyCol}>
          <h2 className={s.title} data-reveal>
            {t.research.title}
          </h2>
          <p className={s.lead} data-reveal data-reveal-delay="0.08">
            {t.research.lead}
          </p>
          <p className={s.body} data-reveal data-reveal-delay="0.14">
            {t.research.body}
          </p>
          <a href="#research" className={s.cta}>
            {t.research.cta}
            <ArrowUpRight size={22} />
          </a>
        </div>
      </div>
    </section>
  );
}
