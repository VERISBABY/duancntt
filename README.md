# Vietnamese Medical VQA — project website

A single-page, animation-light, dependency-free static site for the
**Advancing Vietnamese Visual Question Answering for Healthcare** project.

## Files

```
site/
├─ index.html         Single HTML file with all content
├─ styles.css         All styles — design system in :root variables
├─ app.js             Scroll reveals, count-up, chart animations, copy-to-clipboard
├─ assets/
│  ├─ architecture.jpg   model_archi.png from the report
│  ├─ predictions.jpg    6samples.png demo inference grid
│  ├─ comparison.jpg     __results___39_1.png metric chart (currently unused — chart is rebuilt in HTML/CSS)
│  ├─ iem.jpg            iem_model.png IEM detail (currently unused — keep for future expansion)
│  ├─ textproc.jpg       textprocessing.png text-pipeline detail (currently unused)
│  └─ xray.png           samplee.png sample input (currently unused)
└─ README.md
```

## How to host (free options)

### GitHub Pages
1. Create a public repo named `<your-username>.github.io` (or any repo with Pages enabled)
2. Push these files to the `main` branch
3. Settings → Pages → Source: `main` / `/` → Save
4. Wait ~1 min; the site is live at `https://<your-username>.github.io/<repo>/`

### Netlify / Cloudflare Pages / Vercel
Drag-and-drop the `site/` folder into the dashboard. Done in 30 seconds.

### A custom domain
Buy a domain (~$12/year), point its DNS to GitHub Pages / Netlify, and add it
in your platform's "custom domain" settings. SSL is automatic.

## Before you ship

Search-and-replace these placeholders in `index.html`:

| Find | Replace with |
| --- | --- |
| `nhan.tran@example.edu` | your real email |
| `dang.nguyen@example.edu` | co-author's real email |
| `https://vietnamese-medvqa.example.com` | your real site URL (in the BibTeX) |

You should also update Open Graph tags in `<head>` if you want LinkedIn/Twitter
unfurls to show the right title and description.

## Design system

All visual tokens are in `:root` at the top of `styles.css`:

```css
--paper:    #FBFAF7;   /* warm off-white background        */
--ink:      #0F2C44;   /* primary navy text/UI             */
--accent:   #C73E3E;   /* sparing clinical red             */
--teal:     #2C6E6B;   /* secondary accent (delta arrows)  */
--f-display: 'Fraunces';        /* serif headings */
--f-sans:    'IBM Plex Sans';   /* body text      */
--f-mono:    'IBM Plex Mono';   /* numbers, code  */
```

Edit those to change the whole site at once.

## Animation toggle

The site respects `prefers-reduced-motion: reduce`. Users with that OS setting
get a static, fade-free experience.

## What's intentionally not here

- **No JS framework** — vanilla HTML/CSS/JS so the site loads instantly,
  has zero supply-chain risk, and will work in any browser for the next decade.
- **No build step** — open `index.html` in a browser, it works.
- **No analytics, no cookies, no tracking** — accessibility-first.
- **No live demo** — code is held back until paper acceptance (see
  README discussion of publication strategy in our chat history).

## Updating numbers later

If you re-run training and your headline metrics change, update them in three
places:

1. The hero metric block (`<p class="metric__value" data-target="...">`)
2. The delta lines next to each metric
3. The chart bars: `data-value="..." style="--w: ...%"`
4. The ablation table (Table 2) and comparison table (Table 3)

All numbers are in `index.html` only — no compilation needed.
