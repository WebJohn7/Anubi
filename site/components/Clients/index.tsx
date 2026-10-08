import projects from "@/content/projects.json";
import { useT } from "@/lib/locale";
import { asset } from "@/lib/brand";
import s from "./style.module.css";

export default function Clients() {
  const t = useT();
  return (
    <section className={s.clients} id="clients">
      <h2 className="srOnly">{t.clients.title}</h2>
      <ul className={s.row}>
        {projects.logos.map((logo, i) => (
          <li key={logo.name} className={s.item} style={{ "--i": i } as React.CSSProperties}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(logo.src)} alt={logo.name} loading="lazy" draggable={false} />
          </li>
        ))}
      </ul>
    </section>
  );
}
