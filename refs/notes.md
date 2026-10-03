# anubi.io — motion notes (from refs/*.mp4, frames in refs/frames/)

Ground truth: `website screenshots/anubi1–8.png` at 1536 CSS px (125% DPR).

## Motions
1. **Hero idle.** About 14 tilted image planes on an ellipse around the wordmark. They bob and
   rotate slowly, and the whole ring parallaxes with the mouse. Hovering a plane shows a small
   floating label (project title in mono plus ↗) next to it.
2. **Hero scribbles.** Blue loop, yellow double stroke and orange curl wrap the wordmark, with
   violet 6-arm asterisks. Strokes draw in on load and asterisks spin slowly. Extra small
   scribbles follow the cursor briefly (decorative trail).
3. **Clients wave.** Logos are grey (opacity ~.55); an opacity/lightness wave travels left→right
   on a loop (`logoOpacityWave`).
4. **Services headline.** Fades/translates up on enter. The yellow underline draws under "Creativa".
5. **Services list.** Visual / Animation / Web are offset diagonally. The active word turns
   blue/violet as you scroll, and the mono tags around the active item drift (`nodeDrift`). The
   violet loop line on the left morphs between shapes.
6. **Featured gallery** (pinned): card N skews and warps off to the left (plane bend + rotateY).
   A blue scribble or violet asterisk briefly appears in the gap. Card N+1 slides in from the
   right edge (skewed, then flattens to center). The title and meta fade/type in. The counter
   `0N` and a hand-drawn progress line update. 6 cards.
7. **Explore strip.** Mono micro-label, "Esplora tutti i lavori" about 33px, ↗ at the right, rule.
8. **Research sculpture.** A wireframe torus-knot/ring stack (orange + white lines) rotates and
   morphs continuously. The pause button toggles it.
9. **Code particles.** "code" is drawn by about 1500 small square particles that shimmer. Near the
   cursor they scatter, then ease back. Specks drift in the background over a radial glow.
10. **CTA.** The pill button darkens and lifts slightly on hover.
11. **Footer.** The giant wordmark rises in (`wordmark-arrive`) as the footer enters.

## Diff rounds
(round entries are added below as the build is compared)

### Round 1 — 2026-10-03, Chrome at 1536 CSS px vs anubi1–8
Fixed:
1. All type rendered in serif: the next/font variables sat on a wrapper div and `:root` couldn't
   resolve them. They now live on `<html>`.
2. The hero wordmark block was about 60px too high; moved to 52%. The two extra ring slots collided with the nav.
3. The Lavazza logo was never downloaded (the loop skipped the last line), so it was fetched again.
4. The Services list was too far left: padding-left changed from 12% to 24%.
5. Header: the original hides it on scroll-down and shows it on scroll-up (missing in anubi4–7,
   back in anubi8). Implemented.
6. The Featured card sat too high; moved to 50%.
7. Research sculpture too faint and sprawling: denser rings, a tighter knot, brighter lines.
8. Code particles: fractional canvas width broke the pixel indexing. The word was too wide and
   filled evenly; it's now 150px, edge-weighted, and legible.

Open for round 2:
- Hero blue loop smaller than the reference, which wraps the whole "A". Hero ring doesn't slowly orbit yet.
- Hero cursor-trail scribbles (motion 2) not built.
- Featured title "type-in" is a fade/blur, not per-letter.
- Services tag positions need checking against anubi3 with the active item settled.
- Mobile pass (390px) not done; no phone reference yet.
