import { useEffect, type RefObject } from "react";
import { gsap, prefersReducedMotion } from "@/lib/smooth";

/** Fades and lifts every [data-reveal] inside `scope` as it scrolls into view. */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);
    if (prefersReducedMotion()) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      items.forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          delay: Number(el.dataset.revealDelay ?? 0),
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, [scope]);
}

/** Draws an SVG path in with stroke-dashoffset when it enters the viewport. */
export function drawIn(paths: SVGPathElement[], opts: { delay?: number; duration?: number; trigger?: Element } = {}) {
  paths.forEach((p) => {
    const len = p.getTotalLength();
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
  });
  return gsap.to(paths, {
    strokeDashoffset: 0,
    duration: opts.duration ?? 1.4,
    delay: opts.delay ?? 0,
    stagger: 0.15,
    ease: "power3.inOut",
    scrollTrigger: opts.trigger ? { trigger: opts.trigger, start: "top 80%", once: true } : undefined,
  });
}
