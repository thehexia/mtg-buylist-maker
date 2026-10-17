## 1. Setup

- [x] 1.1 Initialize the Next.js + TypeScript project (app router) and confirm the dev server runs
- [x] 1.2 Establish a mobile-first responsive layout and a shared `Card` type (`{ name, quantity, set? }`)
- [x] 1.3 Add unit/integration test tooling used by the backend route tests

## 2. Deck import (backend proxy + parse)

- [x] 2.1 Implement the server route that validates a Moxfield deck URL (reject non-Moxfield URLs client-side first)
- [x] 2.2 Fetch the Moxfield deck page server-side with a request timeout, bypassing browser CORS
- [x] 2.3 Parse the fetched HTML into normalized `Card` entries (name + quantity, set/edition when present)
- [x] 2.4 Deduplicate by card name and sum quantities
- [x] 2.5 Return structured JSON on success and a distinct error on not-found vs. parse-failure
- [x] 2.6 Add tests for parse success, duplicate collapse, not-found, and parse-failure using a saved sample deck

## 3. Card selection flow

- [x] 3.1 Build the one-card-at-a-time view showing name, quantity, and set/edition
- [x] 3.2 Implement a shared `decide(card, 'yes'|'no')` action used by both input modes
- [x] 3.3 Add mobile swipe gestures (swipe right = keep, swipe left = skip) with advance-on-decision
- [x] 3.4 Add desktop Yes/No buttons with advance-on-decision
- [x] 3.5 Stop the flow when every card has a decision and present the buylist
- [x] 3.6 Derive the running buylist of kept cards (name, quantity, set/edition)
- [x] 3.7 Persist card position, decisions, and buylist to `localStorage`; restore on reload
- [x] 3.8 Add a reset action that clears position, decisions, and buylist

## 4. Buylist export

- [x] 4.1 Render the kept cards as a TCGplayer-compatible plain-text list (`Name x Qty`)
- [x] 4.2 Copy-to-clipboard action with confirmation
- [x] 4.3 Clipboard fallback to a selectable text area when unavailable/denied
- [x] 4.4 Guard export when the buylist is empty; prompt the user to keep cards
- [x] 4.5 Add a CTA that opens the TCGplayer "Create a Buylist" tool in a new tab

## 5. Error handling & polish

- [x] 5.1 Show distinct user-facing errors for "deck not found/unavailable" and "could not parse this deck", each with retry
- [x] 5.2 Handle loading, empty-deck, and network-timeout states in the UI
- [x] 5.3 Verify mobile swipe + desktop buttons end-to-end on a real sample Moxfield URL
