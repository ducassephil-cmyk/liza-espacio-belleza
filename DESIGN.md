# Design Brief

## Direction

Luz Prisma — premium beauty editorial showcase for Liza Espacio Belleza (Providencia, desde 2019), light nude-cream base with black glass CTAs and iridescent accents on small details.

## Tone

Refined editorial elegance: warm nude/lavender palette, generous whitespace, Fraunces serif display, soft scroll-reveal rhythm. Iridescent accents never dominate — they shimmer only on borders, icons, separators, hover.

## Differentiation

Hero is pure typography + iridescent gradient (no photo of the studio); team rendered as prism-styled silhouettes; black glass cards on every main CTA — a beauty studio that feels like a magazine spread, not a salon listing.

## Color Palette

| Token      | OKLCH (light)      | Role                              |
| ---------- | ------------------ | --------------------------------- |
| background | 0.97 0.012 60      | nude cream canvas                 |
| foreground | 0.18 0.025 350      | deep plum text                    |
| card       | 0.99 0.006 60      | warm white surface                |
| primary    | 0.62 0.18 0        | rosado vibrante — CTA accents     |
| accent     | 0.65 0.13 305      | lavanda suave — highlights        |
| secondary  | 0.93 0.02 30       | nude rosado pálido                |
| muted      | 0.94 0.018 300     | lavanda muy pálido                |
| border     | 0.88 0.018 50      | nude claro separators             |
| destructive| 0.58 0.2 18        | coral — error states              |
| success    | 0.7 0.13 160       | menta suave                        |
| warning    | 0.78 0.14 75       | ámbar                              |
| glass-bg   | 0.14 0.012 350     | black glass — main CTA cards      |
| prism-rose | 0.72 0.18 5        | iridescent detail                  |
| prism-violet | 0.7 0.16 300     | iridescent detail                  |
| prism-cyan | 0.78 0.13 200      | iridescent detail                  |

## Typography

- Display: Fraunces — hero headlines, section titles, logo "Liza"
- Body: General Sans — paragraphs, UI labels, nav, footer
- Mono: Geist Mono — scarcity counters, micro-labels
- Scale: hero `text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-5xl font-bold tracking-tight`, label `text-xs font-semibold tracking-[0.2em] uppercase`, body `text-base md:text-lg`

## Elevation & Depth

Soft warm-tinted shadows (`shadow-soft`, `shadow-elevated`) on cards; `shadow-glass` (inset highlight + outer blur) on black glass CTAs; ambient blurred rose/lavender orbs in hero only.

## Structural Zones

| Zone    | Background         | Border            | Notes                                  |
| ------- | ------------------ | ----------------- | -------------------------------------- |
| Header  | transparent → bg-background/80 backdrop-blur on scroll | border-b on scroll | prism sparkle beside logo, iridescent hover underline |
| Hero    | bg-background + ambient gradient orbs | — | typography + iridescent gradient text, no photo |
| Content | alternate bg-card and bg-muted/40 | — | section rhythm every other block |
| Combos  | bg-muted/40 + rose gradient ambient | — | black glass CTA cards |
| Equipo  | bg-background | prism border on hover | prism-styled silhouettes (no real photos) |
| Únete   | bg-muted/40 | — | informational black glass card, no form |
| Footer  | bg-foreground/95 text-background | border-t | address, email, phone, horario |

## Spacing & Rhythm

Section gaps `py-20 md:py-28`; content max-width `container` with `px-6 md:px-8`; micro-spacing `gap-3` labels, `gap-6` card grids; reveal animations staggered 80ms per element.

## Component Patterns

- Buttons: black glass (`bg-glass text-glass shadow-glass`) on main CTAs (Agenda tu Hora, Únete, Ver combos); secondary buttons `bg-secondary text-secondary-foreground` with prism hover border
- Cards: `bg-card rounded-2xl shadow-soft`, prism accent on icon border only
- Badges: `bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs tracking-widest uppercase`
- Silhouettes: iridescent gradient blobs with prism border, abstract profile shape

## Motion

- Entrance: `animate-reveal-up` 0.7s cubic-bezier, staggered via motion `whileInView` 80ms
- Hover: iridescent border shimmer (`animate-prism-shimmer` on hover), `transition-smooth` 0.4s on all interactive
- Decorative: `animate-float-soft` on hero orbs, `animate-prism-pulse` on scarcity counter dot, navbar sparkle

## Constraints

- Site 100% Spanish (Chile), `lang="es-CL"`
- Prism/iridescent accents ONLY on borders, icons, separators, hover — never on large surfaces
- Hero has no photo of the physical place — typography + gradients only
- Team shown as prism-styled silhouettes, never real photos or generated portraits
- Black glass cards reserved for main CTAs only
- Únete page is informational only — no login, profile, commission, or checkout
- Agendar links open AgendaPro (https://agendapro.com) in new tab
- Buy-in cupos are front-end scarcity counters only — no real checkout

## Signature Detail

Navbar "Liza" wordmark in Fraunces with a tiny iridescent prism sparkle beside it that pulses softly — the brand's quiet promise of light refracted through beauty.
