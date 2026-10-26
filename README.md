# aliemrekoruk.com

Personal research portfolio of **Ali Emre Koruk**, Ph.D. researcher in Marine Science at the University of Southern Mississippi: coastal hydrodynamics (COAWST/ROMS), explainable machine-learning surrogates, Gulf of Mexico trend analysis and oyster habitat modeling.

Live site: https://aliemrekoruk.com

## Structure

```
index.html              page content
assets/css/style.css    all styles
assets/js/main.js       animations and interactive sections
assets/js/coast-data.js northern Gulf coastline (Natural Earth 10m, public domain)
CNAME                   custom domain for GitHub Pages
netlify.toml            optional Netlify settings (no build step)
tools/build_single.py   optional: bundles everything into dist/portfolio.html
```

No build step or dependencies. Open `index.html` in a browser to preview.

## Deploy

Hosted with **GitHub Pages** from the `main` branch (root folder). The `CNAME` file points the site to aliemrekoruk.com, and `.nojekyll` tells Pages to serve the files as they are. Every push to `main` publishes automatically.

`netlify.toml` is kept so the same repository can also be deployed on Netlify if needed.

## Editing content

- Text sections (research, experience, field work, education, honors) live in `index.html`.
- Publications, manuscripts and the year-by-year "threads" data are arrays near the end of `assets/js/main.js` (`PUBS`, `MS`, `THREADS`).

## Credits

Coastline data: [Natural Earth](https://www.naturalearthdata.com/). Fonts: Big Shoulders Display, Schibsted Grotesk and IBM Plex Mono via Google Fonts.
