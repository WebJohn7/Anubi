import { useEffect, useRef } from "react";
import { useLocale } from "@/lib/locale";
import { gsap, prefersReducedMotion, scrollToTarget } from "@/lib/smooth";
import s from "./style.module.css";

export default function Footer() {
  const { t, locale, setLocale } = useLocale();
  const root = useRef<HTMLElement>(null);
  const mark = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current || !mark.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        mark.current,
        { yPercent: 60, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: mark.current, start: "top bottom", end: "bottom 85%", scrub: 0.8 },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const menu = [
    { label: t.nav.home, href: "#top" },
    { label: t.nav.code, href: "#code" },
    { label: t.nav.lab, href: "#research" },
    { label: t.nav.work, href: "#featured" },
    { label: t.nav.contact, href: "#contact" },
  ];

  return (
    <footer ref={root} className={s.footer}>
      <div className={s.cols}>
        <div>
          <p className={s.colLabel}>{t.footer.menu}</p>
          <ul className={s.menu}>
            {menu.map((m) => (
              <li key={m.href}>
                <a
                  href={m.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToTarget(m.href === "#top" ? 0 : m.href);
                  }}
                >
                  {m.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className={s.colLabel}>{t.footer.services}</p>
          <ul className={s.services}>
            {t.footerServices.map((sv) => (
              <li key={sv}>
                <a href="#top">{sv}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={s.info}>
        <p>
          {t.footer.vat}
          <br />
          <a href={`mailto:${t.cta.mail}`}>{t.cta.mail}</a>
        </p>
        <ul className={s.socials}>
          <li>
            <a href="#top">Instagram</a>
          </li>
          <li>
            <a href="#top">LinkedIn</a>
          </li>
        </ul>
      </div>

      <div className={s.markWrap}>
        <div ref={mark} className={s.mark}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/anubi-footer.svg" alt="Anubi" width={597} height={92} />
        </div>
      </div>

      <div className={s.lang} role="group" aria-label="Lingua">
        {(["it", "en"] as const).map((l) => (
          <button key={l} onClick={() => setLocale(l)} aria-pressed={locale === l} className={locale === l ? s.langActive : ""}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <p className={s.legal}>
        <a href="#top">{t.footer.privacy}</a> - <a href="#top">{t.footer.cookies}</a> -{" "}
        <a href="#top" className={s.underline}>
          {t.footer.cookiePrefs}
        </a>
      </p>
      <p className={s.signoff}>{t.footer.signoff}</p>
      <p className={s.study}>{t.footer.studyNote}</p>
    </footer>
  );
}
