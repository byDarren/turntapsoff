# turnthetapsoff.com — local copy with Apple-design review fixes

A self-contained static copy of https://turnthetapsoff.com (originally a Next.js
app) with the changes from the Apple-design review applied.

## Run it

```bash
cd turnthetapsoff-local
python3 -m http.server 8777
# open http://localhost:8777/index.html
```

Any static file server works. Opening `index.html` directly via `file://` also
works, though the `<video>` and font preloads behave better over HTTP.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The page. Rebuilt from the server-rendered HTML — no React/Next runtime. My edits are marked with `<!-- FIX n -->` comments. |
| `assets/tailwind.css` | The site's original compiled Tailwind build, untouched except font URLs rewritten to `assets/media/…` for offline use. |
| `assets/overrides.css` | **All** new styling. Loaded after `tailwind.css`, scoped to `.tto-local`. Nothing in the original stylesheet is modified. |
| `assets/enhance.js` | Progressive enhancement (header materialise, stat count-up, focus handoff). The page is fully functional without it. |
| `assets/media/` | Inter `.woff2` files. |
| `images/`, `videos/`, `icon.svg` | Downloaded assets. |
| `original-ssr.html` | The untouched server response, for reference/diffing. |

## Changes applied

1. **Heading type ramp** — the large section headings (`Measurable impact.`,
   `A lot of businesses…`, `How I can help`) were `font-normal` (weight 400) with
   no tracking. Now weight 600 with `letter-spacing: -0.02em`, matching the other
   section headings. (HTML class swap + `overrides.css`.)
2. **Email tap target** — `paul@turnthetapsoff.com` was 168×**17px**. Now a
   44px-min-height target (`.tto-email`).
3. **Context-aware focus ring** — the dark CTAs used a near-black focus outline
   invisible on their own background. Now a white outline plus a dark halo
   (`box-shadow`) so it reads on green, white or black (`.tto-cta:focus-visible`).
4. **Motion** — added a `prefers-reduced-motion` block (gentle cross-fade
   equivalent, no smooth-scroll), a `prefers-reduced-transparency` fallback, a
   `prefers-contrast: more` fallback, and a stat **count-up** that runs once on
   scroll-in and is skipped entirely under reduced motion (`enhance.js`).
5. **WhatsApp affordance** — the "Talk to Paul" buttons link to `wa.me` but gave
   no sign of it. Added a WhatsApp glyph and
   `aria-label="Message Paul on WhatsApp (opens in a new tab)"`.
6. **Craft / wayfinding**
   - Split headings (`Stop mopping the floor.` / `Turn the taps off.`,
     `Outcome first.` / `Empowered by AI.`) given proper `aria-label`s — the
     `<span>`s have no whitespace between them, so the accessible name was
     `…floor.Turn…`.
   - Sticky translucent **header** with an `Impact / How I help / Contact` nav.
     Reads as part of the green hero band at rest; materialises into a blurred
     layer once scrolled past the hero (Apple "scroll edge effect"). Falls back
     to a solid bar under reduced-transparency / high-contrast. Sections get
     `id`s and `scroll-margin-top`; keyboard focus is moved to the target
     section after a jump.
   - Decorative video play-button overlay marked `aria-hidden`.
   - Evened out the vertical rhythm of the video section (`py-16 md:py-20` →
     `py-20 md:py-32`) to match the sections around it.

## Not changed

Copy, layout, colour palette, the green hero/footer, the client logos and the
video are all as-is. The point was to keep the original design and only correct
the craft issues from the review.
