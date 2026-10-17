## Why

A user with a Moxfield deck wants to build a TCGplayer buylist, but TCGplayer's
free "Create a Buylist" tool requires pasting a plain card list and offers no way
to import a Moxfield deck directly. This change turns a Moxfield deck URL into a
curated, importable buylist by letting the user pick only the cards they actually
want — ideal for mobile, where the user swipes through each card.

## What Changes

- Add a web app (Next.js + TypeScript) where the user pastes a Moxfield deck URL
  and the backend fetches and parses the decklist, returning a structured
  card list (name, quantity, set/edition, and other identifying fields).
- Remove Moxfield decklists that are not reachable or that fail to parse, and
  surface a clear error to the user.
- Present the parsed cards one at a time with an explicit yes/no decision; on
  mobile the UI uses swipe gestures (swipe right = yes/keep, swipe left =
  no/skip). Desktop uses explicit Yes/No buttons.
- Build a running buylist of the "yes" cards, showing quantity and the parsed
  card metadata.
- Export the buylist as a copyable plain-text list formatted for TCGplayer and
  provide a deep link to TCGplayer's "Create a Buylist" tool so the user can
  paste the list in and create the buylist there.
- Persist the in-progress selection locally so a reload does not lose progress.

## Capabilities

### New Capabilities
- `deck-import`: Fetch a Moxfield deck URL via the backend proxy, parse the
  decklist into a structured list of card entries, and return a clear error when
  the deck cannot be fetched or parsed.
- `card-selection`: Present parsed cards one at a time with a yes/no decision
  (swipe on mobile, buttons on desktop) and maintain a running buylist of kept
  cards.
- `buylist-export`: Format the kept cards into a TCGplayer-compatible copyable
  list and link the user to TCGplayer's "Create a Buylist" tool.

### Modified Capabilities
<!-- No existing capabilities; greenfield project. -->

## Impact

- New Next.js + TypeScript web application (frontend + a server/proxy route that
  fetches Moxfield to avoid browser CORS).
- New backend endpoint that fetches and parses a Moxfield decklist.
- Client-side swipe UI and a copy-to-clipboard export, plus a link out to
  TCGplayer.
- No external TCGplayer API key required (free buylist tool + copyable list).
- No data persistence services required; in-progress selection is stored in the
  browser (e.g. localStorage).
