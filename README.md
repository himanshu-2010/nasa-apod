# Astronomy — NASA Picture of the Day

A single-page app that fetches NASA's Astronomy Picture of the Day (APOD) and displays the title, image or video, and explanation with a space-themed responsive layout.

**Live demo:** https://himanshu-2010.github.io/nasa-apod/
**Source:** https://github.com/himanshu-2010/nasa-apod

![Stack](https://img.shields.io/badge/Vite-8-646CFF)
![Deploy](https://img.shields.io/badge/GitHub%20Pages-auto%20deploy-2088FF)

---

## Features

- Fetches the daily image/video from the NASA APOD API
- Handles images, direct video files, and YouTube links with the correct embed
- Square shimmering placeholder while media loads, then snaps to the image's real aspect ratio
- Fully responsive (`vh` / `vw` sizing) so media always fits the viewport
- Zigzag side decorations built with `clip-path: polygon()`, hidden on small screens
- Auto-deployment to GitHub Pages on every push to `main`

## Tech Stack

- [Vite](https://vite.dev/) — build tool and dev server
- Vanilla JavaScript (ES modules)
- CSS custom properties, flexbox, `clip-path`, media queries
- [NASA APOD API](https://api.nasa.gov)
- GitHub Actions (deploy workflow)

## Getting Started

### Prerequisites

- Node.js 18+ (the deploy workflow uses Node 22)
- A free NASA API key from https://api.nasa.gov

### Setup

1. Clone the repo and install dependencies:

   ```sh
   git clone https://github.com/himanshu-2010/nasa-apod.git
   cd nasa-apod
   npm install
   ```

2. Create the environment file. Copy `.env.example` to `.env` and add your key:

   ```sh
   cp .env.example .env
   ```

   ```
   VITE_NASA_API_KEY=your_actual_key_here
   ```

   - The variable **must** start with `VITE_` — Vite only exposes prefixed variables to frontend code.
   - No spaces around `=`.
   - `.env` is gitignored and never pushed. `.env.example` is the tracked template.

3. Start the dev server:

   ```sh
   npm run dev
   ```

   > Vite reads `.env` only at startup. If you change the file, restart the server (`Ctrl+C`, then `npm run dev`).

### Build

```sh
npm run build
npm run preview
```

## How It Works

```
request to the API  ->  JSON response  ->  usable data  ->  rendered on the page
```

1. `src/main.js` shows a loading message and calls the APOD endpoint with the key:

   ```js
   fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`)
   ```

2. `.then(response => response.json())` converts the raw response into an object.
3. The object's fields are rendered into `#app`:

   | Field             | Used for                        |
   | ----------------- | ------------------------------- |
   | `data.title`      | Heading                         |
   | `data.url`        | Image / video / YouTube embed   |
   | `data.explanation`| Description paragraph           |
   | `data.media_type` | Picks the correct media element |

4. `.catch()` shows an error message instead of a silent blank page.

For images, the actual `<img>` is only inserted after `new Image().onload` fires — so a square placeholder is shown first, then the container snaps to the image's intrinsic aspect ratio (no layout jump or broken frame).

## Project Structure

```
.
├─ .github/workflows/deploy.yml   GitHub Pages auto-deploy
├─ public/                        Static files (favicon)
├─ src/
│  ├─ main.js                     App logic (fetch, render, media swap)
│  └─ style.css                   Theming and responsive layout
├─ index.html                     Single entry page
├─ vite.config.js                 Sets `base` for Pages
├─ .env.example                   Template for the API key (committed)
└─ .env                           Your real key (never committed)
```

## Deployment

The site auto-deploys to GitHub Pages on every push to `main`. No manual steps after initial setup.

### One-time setup (already done for this repo)

1. `vite.config.js` sets `base: '/nasa-apod/'` so assets resolve correctly under the Pages sub-path. Wrong or missing `base` causes blank/404 pages.
2. Store the key as a repository secret:
   - Repo → **Settings → Secrets and variables → Actions**
   - New repository secret: name `VITE_NASA_API_KEY`, value your real key.
3. Enable Pages:
   - Repo → **Settings → Pages → Source: GitHub Actions**.
4. The workflow `.github/workflows/deploy.yml`:
   - Triggers `on: push` to `main`
   - Installs deps and runs `npm run build`, injecting the key via `VITE_NASA_API_KEY: ${{ secrets.VITE_NASA_API_KEY }}`
   - Uploads `dist` and ships it with `actions/deploy-pages@v4`

To redeploy after changes:

```sh
git add .
git commit -m "describe your change"
git push
```

## Things That Went Wrong While Building This

Real issues hit during development, and what fixed them:

1. **Scaffold files weren't where expected.** The Vite template here kept demo images in `src/assets/` — deleting `src/javascript.svg` and `public/vite.svg` failed because those paths didn't exist. Fix: located the actual files (`src/assets/`, `public/icons.svg`) and removed the demo assets plus the boilerplate they were referenced from.

2. **API key kept showing `undefined`.** Two causes: forgetting the `VITE_` prefix (Vite hides all other env vars), and forgetting that Vite reads `.env` only at server startup. Fix: rename to `VITE_NASA_API_KEY`, restart `npm run dev` after any `.env` change.

3. **Huge unstyled image blowing up the layout.** The first render dumped the full-size image into the page. Fix: constrained the media box with `vh`/`vw` units (`min(92vw, 60vh)` width, `max-height: 62vh`).

4. **Forcing a fixed `aspect-ratio: 4/3` with `object-fit: cover`.** This cropped images and letterboxed videos. Fix: let the media keep its natural ratio and instead show a matching placeholder — a `1/1` square in the `loading` state that swaps to the image's true aspect ratio when `onload` fires.

5. **YouTube links blank in the `<video>` tag.** APOD sometimes returns YouTube URLs, which `<video>` can't play. Fix: added an `else if` branch that detects `data.url.includes('youtube')` and renders an `<iframe>` instead, converting `watch?v=` to `embed/` so it actually plays.

6. **Fully blank deployed page / 404 assets after first deploy.** The initial workflow hit a blank page. The `base` path in `vite.config.js` must equal the exact repo name (`/nasa-apod/`) and GitHub Pages must be set to the **GitHub Actions** source. Both fixed — after that the run went green and the site went live.

7. **Secret ignored by the build.** Setting the `VITE_NASA_API_KEY` secret alone isn't enough; the workflow has to pass it into the build step with `env:` (see `.github/workflows/deploy.yml`) or `import.meta.env` reads it as `undefined` in production.

## Acknowledgements

- [NASA APOD API](https://api.nasa.gov)
- [Vite](https://vite.dev)
- [Clippy — clip-path generator](https://bennettfeely.com/clippy/)
- Fonts: [Orbitron](https://fonts.google.com/specimen/Orbitron) / [Black Ops One](https://fonts.google.com/specimen/Black+Ops+One)