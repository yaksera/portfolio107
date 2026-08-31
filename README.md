# Gorkha Strong — Scroll-Animated Landing Page

A concept redesign of a GSAP scroll-driven product page, rebuilt around
**Gorkha Strong**, the 6% ALC/VOL malt liquor lager brewed by Gorkha Brewery in
Mukundapur, Nawalparasi.

> Portfolio/concept work. Not affiliated with or endorsed by Gorkha Brewery
> Pvt. Ltd. Brand facts are sourced from public information; all artwork here is
> original except the product photograph.

Built on the scroll-animation structure from
[PixelPerfectLabs' GSAP bottle-scroll tutorial](https://www.youtube.com/@PixelPerfectLabs).
The brand direction, palette, copy, artwork and motion timing are my own.

## What it does

The bottle is pinned to the viewport and choreographed across five scroll
stages — it straightens out of the hero, drifts right through the brew section,
swings left and back through the heritage chapters, then centres and fades into
the closing panel before the footer arrives.

Everything else (section reveals, the outlined-to-filled headlines, the header
and sidebar hairlines) is driven off the same GSAP + ScrollTrigger setup in
`main.js`.

## Colour theme

Black label, gold ring, amber glass — the palette is defined once as CSS custom
properties at the top of `style.css`:

| Token | Value | Role |
| --- | --- | --- |
| `--ink` | `#0c0906` | page base |
| `--charcoal` | `#1c1611` | raised surfaces, footer |
| `--gold` | `#e8b74a` | primary accent, headlines |
| `--gold-deep` | `#b8860b` | secondary accent, labels |
| `--amber` | `#f0a93c` | product glow |
| `--crimson` | `#8a1c1c` | Gorkha crest maroon |
| `--bone` | `#f4ecd9` | body text |

`main.js` reads `--gold` from the stylesheet, so changing the palette in one
place also changes the animated colour tweens.

## Files

```
index.html            markup
style.css             palette + layout
main.js               GSAP load, reveal and scroll choreography
gorkha-strong.png     product shot (hero bottle)
stamp.svg             seal — crossed khukuris, "Est. 1989 · Nepal"
heritage-1989.svg     the brewery beneath the Himalaya
heritage-2007.svg     the Gorkha emblem
heritage-2013.svg     the Gorkha Strong bottle
Veneer.woff           display typeface
```

Type: **Veneer** for display, **Inter** for body, **Mukta** for Devanagari
(both loaded from Google Fonts).

## Running it

It is a static page — open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000
```

GSAP 3.13 and ScrollTrigger load from jsDelivr, so the first run needs a
network connection.

## Tuning the motion

Two knobs, both in `main.js`.

**Intro pace** — the load-in runs ~2.6s, but every tween overlaps its
neighbours (nothing waits for the previous step), so it reads as one
continuous move rather than a queue of separate pops. To change the pace
without touching the individual tweens:

```js
const HERO_SPEED = 1;   // 1.3 = quicker, 0.8 = more languid
```

**Scroll feel** — in `pinAndAnimate()`:

```js
scrub: 1.1,   // seconds the bottle takes to catch up to the scroll position
```

`scrub: true` glues motion to the wheel and feels jerky. A number lets the
bottle lag and settle. Raise for more float, drop toward 0 for a tighter follow.

The intro also short-circuits to its end state when the OS has "reduce motion"
enabled.

## Notes

- Two drop-shadow filters on the pinned bottle and the seal were measured as the
  single most expensive thing on the page; they were replaced with one shadow
  plus a radial-gradient halo. Worth remembering before adding more `filter`.
- On phones the whole hero restacks: the bottle becomes a block above the
  wordmark instead of floating over it, and the scroll choreography is skipped.
- The legacy assets (`image.png`, `image-2.png`, `first batch.png`,
  `stamp.png`, `screenshot.png`) are no longer referenced and can be deleted.
"# portfolio107" 
