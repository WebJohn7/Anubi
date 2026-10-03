import { useRef } from "react";
import { useT } from "@/lib/locale";
import { useReveal } from "@/lib/reveal";
import Particles from "./Particles";
import s from "./style.module.css";

export default function CodeSection() {
  const t = useT();
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section ref={root} className={s.section} id="code">
      <div className={s.top}>
        <span>{t.code.label}</span>
        <span className={s.tag}>{t.code.tag}</span>
      </div>

      <div className={s.stage}>
        <div className={s.glow} />
        <Particles />
        <h2 className="srOnly">Code</h2>
      </div>

      <p className={s.body} data-reveal>
        {t.code.body}
      </p>

      <div className={s.bottom}>
        <ul className={s.tags}>
          {t.code.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <a href="#code" className={s.button}>
          <span className={s.buttonMain}>{t.code.cta}</span>
          <span className={s.buttonSub}>{t.code.ctaSub}</span>
        </a>
      </div>
    </section>
  );
}
