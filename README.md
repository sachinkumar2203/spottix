# Spottix Website

Landing page for **Spottix** — *Spot it. Report it. Fix it.* (civic-reporting app, Bengaluru).
Plain HTML + CSS + JavaScript (ES modules), bundled with [Vite](https://vitejs.dev).

## Run

```bash
npm install        # install dependencies (Vite, Prettier)
npm run dev        # dev server at http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # preview the production build
npm run format     # auto-format HTML/CSS/JS with Prettier
```

Requires Node.js 20.19+ (or 22.12+).

## Folder structure

```
spottix-website/
├── index.html                 # page markup (HTML)
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── assets/images/         # hero images (were base64 inside index.html)
    ├── css/                   # CSS
    │   ├── main.css           # entry: imports everything below IN ORDER (cascade matters)
    │   ├── base/              # variables, reset, responsive layout, reduced-motion
    │   ├── components/        # navbar, badges, button effects
    │   └── sections/          # one file per page section (hero, story, plans, faq, ...)
    └── js/                    # JavaScript
        ├── main.js            # entry: calls every module's init function
        ├── modules/           # one file per feature (hero-slider, story-canvas, plans, faq, ...)
        ├── data/              # images.js, plans.js (content/data)
        └── utils/             # dom.js, math.js
```

## Notes

- Fonts (Jost) still load from Google Fonts via the `<link>` in `index.html`.
- App-screenshot images in the "Explore the app" section still load from `spottixlandingpage.vercel.app`.
  Download them into `src/assets/images/` and update the `<img src>` paths if you want the site fully self-contained.
- Keep the `@import` order in `src/css/main.css` — it is the same order as the original single stylesheet.
