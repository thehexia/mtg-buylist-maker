---
description: Launch the MTG Buylist Maker locally - a Next.js web app that imports a Moxfield deck, lets the user pick cards, and builds a TCGplayer buylist. Use when the user wants to run, start, preview, or test the app locally.
allowed-tools: Bash(npm:*), Bash(npx:*), Bash(curl:*), Bash(echo:*), Bash(kill:*), Bash(pkill:*), Bash(tail:*), Read
---

Launch the MTG Buylist Maker app locally.

## What the app needs

- **Node.js + npm** dependencies installed (`node_modules`).
- **Playwright Chromium** is required: the backend (`app/api/deck/route.ts`)
  fetches Moxfield via a headless browser to bypass Cloudflare bot protection.
  Without it, deck loading fails.
- The dev server runs on **http://localhost:3000** by default (`next dev`).

## Steps

1. **Ensure dependencies are installed.**
   ```bash
   test -d node_modules || npm install
   ```
   `npm install` is idempotent; skip it if `node_modules` already exists.

2. **Ensure the Playwright browser is installed.**
   ```bash
   npx playwright install chromium
   ```
   This downloads Chromium into the Playwright cache. Safe to re-run; it is a no-op
   if the browser is already present.

3. **Start the dev server.**
   ```bash
   npm run dev
   ```
   Run this in the background (the server stays running) and give it a second or
   two to boot. Confirm it is up:
   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000
   ```
   A `200` means the app is ready. (If another process already holds port 3000,
   stop it with `pkill -f "next dev"` or start on another port with
   `npm run dev -- -p 3001`.)

4. **Open the app.** The app is a mobile-first single page at
   `http://localhost:3000`. The user pastes a Moxfield deck URL (e.g.
   `https://moxfield.com/decks/ctqgAchoZ3abbts70uA0Gw`), swipes/taps Yes/No
   through each card, and then copies the TCGplayer buylist.

5. **(Optional) Run the test suite.**
   ```bash
   npm run test
   ```

## Notes

- The Moxfield fetch is slow (a real headless-browser load, ~5-10s) and returns a
  `403`/error if the Chromium binary is missing - go back to step 2.
- Stop the server when done: `pkill -f "next dev"`.
- `npm run build && npm start` runs a production build instead of dev mode.
