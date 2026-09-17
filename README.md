# Astronomy — NASA Picture of the Day

A single-page app that fetches NASA's Astronomy Picture of the Day (APOD) and displays the title, image or video, and explanation with a space-themed responsive layout.

**Live demo:** https://himanshu-2010.github.io/nasa-apod/
**Source:** https://github.com/himanshu-2010/nasa-apod

![Stack](https://img.shields.io/badge/Vite-8-646CFF)
![Deploy](https://img.shields.io/badge/GitHub%20Pages-auto%20deploy-2088FF)

---

## Features

- Fetches the daily image/video from the NASA APOD API
- Date picker to browse any day back to 1995-06-16 (future dates blocked)
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

## Build It From Scratch

Follow these steps to recreate this project from zero. Each step maps to something already covered above, so this also works as a review of the whole build.

### Step 1 — Scaffold and clean the Vite template

```sh
npm create vite@latest astronomy -- --template vanilla
cd astronomy
npm install
npm run dev
```

Vite ships demo files that just prove the server works. Remove them all:

```sh
rm src/counter.js src/assets/vite.svg src/assets/javascript.svg src/assets/hero.png public/icons.svg
```

> Paths differ between Vite versions. List `src` and `public` first (`ls -R src public`) and delete whatever demo assets actually exist. If a path errors with "No such file", the file lives elsewhere.

Then wipe the boilerplate. Replace `src/main.js` with just:

```js
import './style.css'

document.querySelector('#app').innerHTML = ''
```

And replace `src/style.css` with a nearly-empty shell:

```css
:root {
  font-family: system-ui, sans-serif;
  color-scheme: light dark;
}

body {
  margin: 0;
}
```

### Step 2 — Get and store the API key

1. Go to https://api.nasa.gov and submit the basic form — a free key is emailed instantly.
2. Create `.env` in the project root:

   ```sh
   VITE_NASA_API_KEY=your_actual_key_here
   ```

   - The name **must** start with `VITE_` — Vite only exposes prefixed variables to frontend code.
   - No spaces around `=`.
3. Create `.env.example` with the variable name but no real value — this one goes to GitHub.
4. Make sure `.gitignore` contains:

   ```gitignore
   .env
   node_modules
   dist
   ```

5. Restart the dev server after any `.env` change — Vite only reads it at startup (`Ctrl+C`, then `npm run dev`).

### Step 3 — Set up the page and fonts

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@900&family=Black+Ops+One&display=swap" rel="stylesheet" />
    <title>astronomy</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

`type="module"` is what makes `import.meta.env` and ES module `import` work.

### Step 4 — The JavaScript

The whole app lives in `src/main.js`:

```js
import './style.css'

const API_KEY = import.meta.env.VITE_NASA_API_KEY;
const app = document.querySelector('#app');

function fetchAPOD() {
  app.innerHTML = '<p>loading...</p>';

  fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      let media;

      if (data.media_type === 'image') {
        media = `<div id="media" class="loading"><div class="placeholder"></div></div>`;
      } else if (data.url.includes('youtube')) {
        media = `<div id="media" class="video"><iframe src="${data.url.replace('watch?v=', 'embed/')}" allowfullscreen></iframe></div>`;
      } else {
        media = `<div id="media" class="video"><video src="${data.url}" controls></video></div>`;
      }

      app.innerHTML = `
        <h1>${data.title}</h1>
        ${media}
        <p>${data.explanation}</p>
      `;

      if (data.media_type === 'image') {
        const mediaEl = document.querySelector('#media');
        const img = new Image();
        img.alt = data.title;
        img.onload = () => {
          mediaEl.classList.remove('loading');
          mediaEl.replaceChildren(img);
        };
        img.onerror = () => {
          mediaEl.classList.remove('loading');
          mediaEl.innerHTML = '<p>Image could not be loaded.</p>';
        };
        img.src = data.url;
      }
    })
    .catch(err => {
      app.innerHTML = `<p>Error: ${err.message}</p>`;
    });
}

fetchAPOD();
```

The four steps of fetching in action: **request** the URL → **convert** with `response.json()` → **use** the fields in the template → **display** via `innerHTML`. Media URLs that are YouTube links need an iframe (converting `watch?v=` to `embed/`), otherwise keep a `<video>` tag.

### Step 5 — The CSS

A space-themed shell with zigzag side strips:

```css
:root {
  --bg: #0a0520;
  --accent: #a855f7;
  --text: #f3f4f6;
  --text-dim: #c4b5fd;
  font-family: 'Black Ops One', system-ui, sans-serif;
  color-scheme: dark;
}

body {
  margin: 0;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--bg);
  color: var(--text);
}

body::before,
body::after {
  content: '';
  position: fixed;
  top: 0;
  bottom: 0;
  width: 60px;
  z-index: -1;
  background: var(--accent);
}

body::before {
  left: 0;
  clip-path: polygon(0 0, 100% 0, 92% 2%, 100% 4%, /* ...zigzag down... */ 0 100%);
}

body::after {
  right: 0;
}

#media {
  width: min(92vw, 60vh);
  border: 2px solid var(--accent);
  border-radius: 12px;
  overflow: hidden;
}

#media.loading {
  aspect-ratio: 1 / 1;
}

#media img {
  width: 100%;
  height: auto;
  max-height: 62vh;
  object-fit: contain;
}

#media.video iframe,
#media.video video {
  aspect-ratio: 16 / 9;
}

@media (max-width: 600px) {
  body::before,
  body::after {
    display: none;
  }
}
```

Key ideas:

- **`clip-path: polygon()`** cuts a rectangle into any shape — each `x% y%` pair is a point on the cut line. Zap the zigzag under Clippy (https://bennettfeely.com/clippy/) and paste the generated coordinates instead of hand-writing 60 points.
- **Responsive media** uses `vh`/`vw`: `min(92vw, 60vh)` width means the box never wider than the screen and never taller than ~60% of the viewport.
- **Placeholder → snap**: the `loading` state is a `1 / 1` square. When `img.onload` fires, the class is removed and the container follows the image's real aspect ratio (`height: auto`), so there's no layout jump.

### Step 6 — Deploy to GitHub Pages

1. Push the project (see the [Deployment](#deployment) section for the full details).
2. Add `vite.config.js` with the exact repo name — assets 404 without it:

   ```js
   import { defineConfig } from 'vite'

   export default defineConfig({
     base: '/your-repo-name/',
   })
   ```

3. Store the key as a repo secret (`Settings → Secrets and variables → Actions`): name `VITE_NASA_API_KEY`, value your real key.
4. Create `.github/workflows/deploy.yml` with the workflow from the [Deployment](#deployment) section. It runs on every push to `main`, installs deps, builds with the secret injected via `env:`, and ships `dist` with `actions/deploy-pages@v4`.
5. Enable Pages (`Settings → Pages → Source: GitHub Actions`), then push. Your site is live at `https://yourusername.github.io/your-repo-name/`.

### Step 7 (optional) — Add the date picker

Extend `fetchAPOD` to accept a date and append it to the URL:

```js
function fetchAPOD(date = '') {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}${date ? `&date=${date}` : ''}`;
  /* ...rest unchanged, using the url variable in fetch(url)... */
}

const dateInput = document.querySelector('#datepicker');
dateInput.max = new Date().toISOString().split('T')[0];
dateInput.min = '1995-06-16';
dateInput.addEventListener('change', () => fetchAPOD(dateInput.value));
```

Add the input right before `#app` in `index.html`:

```html
<input type="date" id="datepicker" />
<div id="app"></div>
```

APOD only goes back to 1995-06-16 and has no future images, so clamp the picker with `min`/`max`.

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