import { useRef } from "react";
import { useT } from "@/lib/locale";
import { useReveal } from "@/lib/reveal";
import s from "./style.module.css";

export default function ContactCta() {
  const t = useT();
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section ref={root} className={s.cta} id="contact">
      <h2 className={s.title} data-reveal>
        {t.cta.title1}
        <br />
        {t.cta.title2}
      </h2>
      <a href={`mailto:${t.cta.mail}`} className={s.button} data-reveal data-reveal-delay="0.1">
        {t.cta.button}
      </a>
      <p className={s.lead} data-reveal data-reveal-delay="0.16">
        {t.cta.mailLead}
      </p>
      <a href={`mailto:${t.cta.mail}`} className={s.mail} data-reveal data-reveal-delay="0.2">
        {t.cta.mail}
      </a>
    </section>
  );
}
