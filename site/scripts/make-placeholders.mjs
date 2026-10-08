// Writes the placeholder art for the public build into public/placeholder/.
// Abstract gradient "renders" and fictional client wordmarks, all generated here, so the
// deployed site carries no third-party images. Deterministic: same output on every run.
// Run: node scripts/make-placeholders.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "placeholder");

// Small seeded PRNG (mulberry32) so the art is stable between runs.
function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Palette pairs (background stops + accent) built from the site's tokens.
const PALETTES = [
  ["#1b1530", "#8060f5", "#ffd60a"],
  ["#2a1406", "#ff7415", "#fcfcfa"],
  ["#0b1a33", "#2878f0", "#ff7415"],
  ["#e9e6dc", "#62625c", "#8060f5"],
  ["#171715", "#4d4d49", "#ff7415"],
  ["#f3efe6", "#ffd60a", "#2878f0"],
  ["#10231d", "#3fae8c", "#fcfcfa"],
];

function render(i, w, h) {
  const r = rng(i * 7919 + w);
  const [bg, a, b] = PALETTES[i % PALETTES.length];
  const cx = w * (0.3 + r() * 0.4);
  const cy = h * (0.3 + r() * 0.4);
  const rad = Math.min(w, h) * (0.22 + r() * 0.18);
  const rings = Array.from({ length: 5 }, (_, k) => {
    const rr = rad * (1.25 + k * 0.32);
    return `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${rr.toFixed(1)}" ry="${(rr * (0.35 + r() * 0.3)).toFixed(1)}" transform="rotate(${(r() * 60 - 30).toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})" stroke="${b}" stroke-opacity="${(0.5 - k * 0.08).toFixed(2)}" stroke-width="${(w / 400).toFixed(2)}" fill="none"/>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="${a}" stop-opacity="0.55"/></linearGradient>
<radialGradient id="s" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="0.35" stop-color="${a}"/><stop offset="1" stop-color="${bg}"/></radialGradient>
</defs>
<rect width="${w}" height="${h}" fill="${bg}"/><rect width="${w}" height="${h}" fill="url(#g)"/>
${rings}
<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${rad.toFixed(1)}" fill="url(#s)"/>
</svg>
`;
}

// Fictional client names, each in a different system-font treatment.
const LOGOS = [
  ["Halden", "Georgia, serif", 700, "normal", 0],
  ["MERIDIO", "Arial, sans-serif", 900, "normal", 4],
  ["kova", "Verdana, sans-serif", 700, "normal", -1],
  ["Ostra&Co", "Georgia, serif", 400, "italic", 0],
  ["LUMEN LAB", "Arial, sans-serif", 400, "normal", 6],
  ["brisk", "Trebuchet MS, sans-serif", 700, "italic", -1],
  ["TALVO", "Impact, sans-serif", 400, "normal", 2],
  ["Pellica", "Georgia, serif", 700, "normal", 1],
  ["N/ORBIT", "Courier New, monospace", 700, "normal", 2],
  ["Vireo", "Verdana, sans-serif", 400, "normal", 3],
];

function logo([name, family, weight, style, spacing]) {
  const w = 220;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 60" width="${w}" height="60">
<text x="${w / 2}" y="40" text-anchor="middle" font-family="${family}" font-weight="${weight}" font-style="${style}" letter-spacing="${spacing}" font-size="30" fill="#131313">${name.replace("&", "&amp;")}</text>
</svg>
`;
}

const write = (rel, body) => {
  const file = join(out, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, body);
};

const pad = (n) => String(n).padStart(2, "0");
for (let i = 1; i <= 14; i++) write(`orbit/${pad(i)}.svg`, render(i, 400, 300));
for (let i = 1; i <= 6; i++) write(`featured/${pad(i)}.svg`, render(i + 20, 1320, 740));
LOGOS.forEach((l, i) => write(`logos/${pad(i + 1)}.svg`, logo(l)));
console.log(`placeholders written to ${out}`);
