## Context

Greenfield web app. See proposal.md for motivation. Key external constraint:
Moxfield exposes no public decklist API and the site blocks cross-origin browser
requests, so the deck must be fetched server-side. TCGplayer has a free, keyless
"Create a Buylist" tool that accepts a pasted plain-text card list (see
proposal.md and the `buylist-export` spec).

## Goals / Non-Goals

**Goals:**
- A small, mobile-first Next.js app with a backend proxy that fetches and parses
  a Moxfield deck into normalized card entries.
- A one-card-at-a-time selection flow: swipe on mobile, buttons on desktop.
- A live buylist and a TCGplayer-compatible copyable list plus a link out to the
  TCGplayer buylist tool.
- Resilient error handling for unreachable/unparseable decks.

**Non-Goals:**
- No authenticated user accounts or server-side persistence of buylists (state
  is client-side only).
- No TCGplayer API integration or server-side creation of the buylist (the user
  pastes the list into TCGplayer's free tool).
- No auto-detection of exact edition/set beyond what Moxfield provides.

## Decisions

### Backend proxy for Moxfield fetching
**Decision:** Implement a Next.js server route (e.g. `app/api/deck/route.ts`)
that validates the incoming URL, fetches the Moxfield deck page, and returns a
normalized JSON list of card entries.

**Rationale:** Moxfield blocks cross-origin browser requests (CORS) and has no
public API. A server-side fetch bypasses CORS and centralizes parsing.
**Alternatives considered:**
- *Client-side fetch via a public CORS proxy* — rejected: adds an unreliable
  third-party dependency and leaks user data to a third party.
- *Scraping a third-party Moxfield dataset/JSON endpoint* — deferred; the public
  HTML route is the source of truth. If Moxfield exposes a stable JSON embed,
  this becomes a swap inside the proxy without touching the frontend.

### Deck source & parsing strategy
Parses the public Moxfield HTML deck page server-side. The parser extracts
repeated card rows (name + quantity) and, when present, set/edition. It
deduplicates by card name and sums quantities.
**Risk noted:** Moxfield markup can change; the parser is isolated so it can be
updated independently of the frontend.

### Card entity
A `Card` = `{ name: string; quantity: number; set?: string; }`. This is the unit
flowed through selection and export.

### Swipe vs. buttons
**Decision:** Detect touch/coarse pointer (e.g. `matchMedia` or pointer
capabilities). On mobile use a swipeable card (drag right = keep, left = skip);
on desktop use explicit Yes/No buttons. Both paths call the same
`decide(card, 'yes'|'no')` action so logic is shared.
**Alternatives considered:** Always showing buttons — less mobile-native; always
swiping — inaccessible/non-obvious on desktop.

### State persistence
**Decision:** Store the parsed deck, the current index, decisions, and the
derived buylist in `localStorage`. The live buylist is derived from decisions so
there is a single source of truth.
**Alternatives considered:** React state only — lost on reload (reject, breaks
the persistence requirement); server session — unnecessary complexity.

### TCGplayer hand-off
**Decision:** Format kept cards to a plain-text list compatible with TCGplayer's
free "Create a Buylist" tool (`name x quantity` lines), offer copy-to-clipboard
with a selectable-text fallback, and link/ CTA to the TCGplayer buylist creation
page.
**Alternatives considered:** TCGplayer API (requires a key and server-side
account) — out of scope for the free, keyless flow.

## Risks / Trade-offs

- [Moxfield HTML structure changes] → Isolate the parser behind a single route
  with tests against a saved sample; failures fall back to the "could not parse
  this deck" error.
- [Ambiguous set/edition from Moxfield] → Treat set/edition as best-effort and
  optional; the copyable list and TCGplayer link still work without it.
- [Clipboard API unavailable/denied] → Fall back to a selectable `<textarea>` for
  manual copy.
- [Rate/rate-limiting or blocking by Moxfield] → Keep fetches server-side, add a
  sensible per-request timeout, and surface a "deck unavailable" error.
- [No persistence means no sharing] → Explicitly out of scope; user re-runs the
  flow or copies the list.

## Migration Plan

New app — no migration. Deploy the Next.js app (frontend + server route). No
state to migrate; in-progress reviews live in the browser only.

## Open Questions

- Precise column/format TCGplayer's free "Create a Buylist" tool expects today;
  default to `Name x Qty` lines and adjust during implementation.
- Swipe library vs. a hand-rolled handler; decided at implementation time.

## Resolved During Implementation

- **Cloudflare blocks plain server-side fetch.** Moxfield's pages and its
  `api.moxfield.com/api/decks/{id}` JSON endpoint return HTTP 403 from a server-
  side `fetch` (Cloudflare bot protection / "Attention Required"), even with
  browser-like headers. A plain `fetch` inside the Next.js route therefore cannot
  retrieve a deck.
  **Decision:** fetch the deck with a headless browser (Playwright/Chromium) in
  the server route so Cloudflare's JS challenge is solved by a real browser.
  The browser navigates to `https://www.moxfield.com/decks/{id}`, intercepts the
  SPA's own `api.moxfield.com/api/decks` JSON response, and falls back to scraping
  the rendered decklist DOM. The network layer is isolated behind one function;
  the JSON/HTML parser is unit-tested against a saved fixture so it does not
  depend on live network access.
