# anubi.io homepage — study rebuild

An unofficial, from-scratch rebuild of the [anubi.io](https://anubi.io) homepage, made as a
front-end practice exercise in layout, typography and motion. It is **not affiliated with,
endorsed by or a replacement for Anubi**. The original design belongs to Anubi.

This repo contains only my code. None of Anubi's images, client logos, wordmark or stylesheets
are included, and the longer body copy is my own text.

## Stack

- Next.js 15 (Pages Router) + TypeScript, CSS Modules
- GSAP + ScrollTrigger for scroll-driven motion, Lenis for smooth scrolling
- OGL (WebGL) for the wireframe sculpture; a 2D canvas for the particle text
- Fonts: Bricolage Grotesque, Epilogue and IBM Plex Mono via `next/font/google`
- Italian / English copy switch (`site/content/home.{it,en}.json`)

## What's in it

| Section | Technique |
|---|---|
| Hero | CSS 3D image ring with idle drift, mouse parallax and hover labels; SVG scribbles drawn in with `stroke-dashoffset` |
| Clients | Logo row with a staggered opacity-wave keyframe |
| Services | Scroll-driven active word, morphing SVG loop, drifting tags |
| Featured | Pinned, scrubbed ScrollTrigger gallery: cards skew out left while the next swings in |
| Research | OGL line sculpture (rings swept along a breathing torus knot), pausable |
| Code | Text sampled into edge-weighted particles that scatter around the cursor |
| Footer | Scrubbed wordmark reveal, IT/EN toggle |

Header hides on scroll down and returns on scroll up. Everything respects
`prefers-reduced-motion`.

## Run it

```bash
cd site
npm install
npm run dev     # http://localhost:3000
npm run build
```

Images are not included. The page expects files in `site/public/media/`
(`orbit/01–14.webp`, `featured/01–06.webp`, `logos/01–10`, `anubi.svg`, `anubi-footer.svg`).
Drop in your own placeholder images with those names, or the slots render empty.

`plan.txt` is the working plan; `refs/notes.md` logs the motion study and comparison rounds.
