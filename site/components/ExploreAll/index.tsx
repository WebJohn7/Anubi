import { useRef } from "react";
import { useT } from "@/lib/locale";
import { useReveal } from "@/lib/reveal";
import { ArrowUpRight } from "@/components/shared/Icons";
import s from "./style.module.css";

export default function ExploreAll() {
  const t = useT();
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section ref={root} className={s.explore} id="explore">
      <a href="#featured" className={s.row} data-reveal>
        <span className={s.label}>{t.explore.label}</span>
        <span className={s.title}>
          <h2>{t.explore.title}</h2>
          <ArrowUpRight size={22} className={s.arrow} />
        </span>
      </a>
    </section>
  );
}
