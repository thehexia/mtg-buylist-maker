## Context

The `CardSwipe` component renders one card at a time with name, quantity, and
set. The `Card` type (`lib/types.ts`) carries no image data. The Moxfield
parser returns card names and quantities; it does not return art. See
`proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Display the official card art image on the current card panel during review
- Load art lazily (only the card being shown) to avoid blocking deck load
- Degrade gracefully (text-only layout) when art is unavailable

**Non-Goals:**
- Pre-fetching art for future cards in the queue
- Showing art anywhere other than the card-by-card review (buylist, export)
- Persisting art URLs to localStorage

## Decisions

### Art source: Scryfall named-card API

Use `https://api.scryfall.com/cards/named?fuzzy=<name>` (adding
`&set=<code>` when a set code is available). Scryfall is the canonical MTG
card database, allows browser CORS, and is free for non-commercial use. The
response includes `image_uris.normal` (480 × 680 px), which is the right size
for a card panel.

**Alternative considered**: Construct image URLs from Moxfield's CDN. Rejected
because Moxfield's image URLs are not publicly documented and could break
without notice.

### Fetch strategy: per-card lazy client fetch with in-memory cache

Fetch art when the current card changes. Cache results in a `Map<name, url>`
(or a `Map<name+set, url>` key) held in a React ref so re-renders don't
trigger re-fetches. On component mount for a new card, check the cache first;
only hit Scryfall on a cache miss.

**Alternative considered**: Fetch all cards at deck-load time. Rejected because
a 60-card deck would fire 60 sequential or parallel API calls before the user
sees the first card, adding significant latency and hammering the Scryfall API.

**Alternative considered**: Prefetch the next N cards. Rejected as premature
optimisation; lazy-per-card is sufficient for a one-at-a-time UX and simpler
to implement and test.

### Art state kept outside the `Card` type

A `useArtCache` hook manages a `Map<string, string | null>` keyed on
`name:set`. `null` means "tried, failed". This keeps `Card` as a plain data
record (backend contract) and avoids mutating parsed deck state.

**Alternative considered**: Add `imageUrl?: string` to `Card` and populate it
during the review. Rejected because it mixes view-layer concerns into the
shared data model; the `Card` type is also written by the API route, so adding
an optional view-only field leaks UI state into the backend boundary.

### Placeholder during loading

Show a fixed-size grey placeholder box in the art area while the fetch is
in-flight so the card panel does not shift when art loads. Use CSS aspect-ratio
(63:88 ≈ standard card ratio) to size it without hardcoding pixels.

## Risks / Trade-offs

- **Scryfall availability**: If Scryfall is unreachable the card panel degrades
  to text-only, which is acceptable. → Mitigation: graceful fallback per spec.
- **Card name mismatches**: Fuzzy search handles most variants, but some
  tokens/emblems may not be found. → Mitigation: `null` in cache → no image,
  review still functional.
- **Rate limit**: Scryfall asks for ≤ 10 req/s. One card at a time means one
  request per card advance, well under the limit. → No mitigation needed.
