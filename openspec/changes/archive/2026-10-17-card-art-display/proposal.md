## Why

The card review experience shows only text (name, set, quantity), making it
harder for users to recognize cards at a glance. Showing the card's art image
during review lets users decide faster and with more confidence.

## What Changes

- The card-by-card review displays the card's art image prominently above the
  name and metadata.
- Art is fetched from the Scryfall API by card name (and set code when
  available).
- Art is fetched lazily per card on the client; the client calls Scryfall
  directly (Scryfall's API allows browser CORS requests).
- The `Card` type gains an optional `imageUrl` field populated after art is
  resolved.
- When art cannot be loaded (network error, card not found in Scryfall), the
  card panel degrades gracefully to the text-only layout with no broken image.

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `card-selection`: The "Cards are presented one at a time" requirement changes
  to include card art in what is displayed per card.

## Impact

- `lib/types.ts`: add optional `imageUrl` to `Card`
- `components/CardSwipe.tsx`: render art image when present
- New client-side hook or utility for Scryfall art lookup (lazy, per-card)
- No backend changes required; Scryfall API is called from the browser
