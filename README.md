# SplitView

A minimal responsive preview tool. Load any URL into a phone-sized view (430&times;932 CSS px, auto-scaled to fit the window height) next to a desktop view that fills all remaining space — like Responsively App, but barebones.

## Features

- **URL bar** with a reload button
- Loads any URL into both frames at once (auto-prepends `http://` if missing)
- **Last URL persisted** in `localStorage` and restored on refresh
- **Mobile frame** scales down from 100% to fit the window height
- **Desktop frame** fills all remaining width/height

## Usage

### Web (development)

```bash
npm install
npm run dev
```

Open the printed local URL, paste a URL (e.g. `http://localhost:5173`), and press Enter. Both frames load the page.

### Desktop app (Tauri)

```bash
npm install
npm run tauri dev     # run in a desktop window during development
npm run tauri build   # produce the installer + standalone exe
```

Built artifacts land in `src-tauri/target/release/`:
- `split-view.exe` — standalone executable (no server, no browser needed — uses the system WebView2/Chromium runtime)
- `bundle/nsis/SplitView_<version>_x64-setup.exe` — Windows installer

> Note: sites that block [X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options) or CSP `frame-ancestors` won't render inside iframes.

## Scripts

| Command              | Description                     |
| -------------------- | ------------------------------- |
| `npm run dev`        | Start the Vite dev server       |
| `npm run build`      | Typecheck + production build    |
| `npm run preview`    | Preview the production build    |
| `npm run tauri dev`  | Run the desktop app in dev mode |
| `npm run tauri build`| Build the desktop app/installer |

The desktop app loads the same frontend as the web build. The URL bar accepts any live localhost URL, so you can point it at whatever dev server you're working on.

## Project structure

```
src/
  App.tsx                  — app state and orchestration
  constants.ts             — device dims, storage key, scale bounds
  lib/url.ts               — URL normalization helper
  hooks/useFitScale.ts     — ResizeObserver-based scale hook
  components/
    UrlBar.tsx             — brand, URL input, reload button
    MobileView.tsx         — self-scaling phone frame
    DesktopView.tsx        — desktop frame
    EmptyState.tsx         — shared placeholder
```

