import { useEffect, useState } from "react";
import { useT } from "@/lib/locale";
import { scrollToTarget } from "@/lib/smooth";
import { ArrowUpRight } from "@/components/shared/Icons";
import { BrandMark } from "@/components/shared/Wordmark";
import { BRAND } from "@/lib/brand";
import s from "./style.module.css";

/** Hides the bar while scrolling down past the hero and brings it back on any upward scroll. */
function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      setHidden(y > last && y > 400);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return hidden;
}

export default function Header() {
  const t = useT();
  const hidden = useHideOnScroll();
  const links = [
    { label: t.nav.home, href: "#top", active: true },
    { label: t.nav.code, href: "#code" },
    { label: t.nav.lab, href: "#research" },
    { label: t.nav.work, href: "#featured" },
  ];

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollToTarget(href === "#top" ? 0 : href);
  };

  return (
    <header className={`${s.header} ${hidden ? s.hidden : ""}`}>
      <div className={s.bar}>
        <a href="#top" className={s.brand} onClick={(e) => go(e, "#top")}>
          <BrandMark className={s.mark} />
          <span className={s.brandText}>
            <span className={s.name}>{BRAND}</span>
            <span className={s.tagline}>{t.nav.tagline}</span>
          </span>
        </a>
        <nav className={s.nav} aria-label="Principale">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => go(e, l.href)}
              className={`${s.link} ${l.active ? s.active : ""}`}
              aria-current={l.active ? "page" : undefined}
            >
              {l.label}
            </a>
          ))}
          <a href="#contact" onClick={(e) => go(e, "#contact")} className={`${s.link} ${s.cta}`}>
            {t.nav.contact}
            <span className={s.ctaIcon}>
              <ArrowUpRight size={14} />
            </span>
          </a>
        </nav>
      </div>
    </header>
  );
}
