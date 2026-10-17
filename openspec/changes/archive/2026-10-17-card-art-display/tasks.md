## 1. Art Cache Hook

- [x] 1.1 Create `hooks/useArtCache.ts` exporting a `useArtCache()` hook that holds a `Map<string, string | null>` ref keyed on `"name:set"` (set defaults to `""` when absent)
- [x] 1.2 Expose a `getArt(name: string, set?: string): string | null | undefined` function — `undefined` = not yet fetched, `null` = fetch attempted and failed, `string` = resolved URL
- [x] 1.3 Implement `fetchArt(name, set?)` that calls `https://api.scryfall.com/cards/named?fuzzy=<name>[&set=<code>]`, extracts `image_uris.normal`, and stores the URL (or `null` on any error/404) in the cache map
- [x] 1.4 Return `fetchArt` from the hook so callers can trigger a fetch for the current card

## 2. CardSwipe Component

- [x] 2.1 Add an `artUrl: string | null | undefined` prop to `CardSwipe` (`undefined` = loading, `null` = unavailable, `string` = ready)
- [x] 2.2 Render a fixed-size placeholder div above the card name using CSS `aspect-ratio: 63 / 88` when `artUrl` is `undefined` (loading state)
- [x] 2.3 Render an `<img>` from `artUrl` when it is a non-null string; attach `onError` handler that hides the image (prevents broken-image icon)
- [x] 2.4 Render nothing in the art area when `artUrl` is `null` (unavailable — show text-only layout)

## 3. Page Integration

- [x] 3.1 Instantiate `useArtCache()` in the page component (`app/page.tsx`)
- [x] 3.2 Call `fetchArt` whenever the current card changes (use a `useEffect` keyed on the current card's `name` + `set`)
- [x] 3.3 Pass `getArt(card.name, card.set)` to `CardSwipe` as the `artUrl` prop

## 4. Styling

- [x] 4.1 Add CSS in `app/globals.css` for the art image area: `border-radius`, `overflow: hidden`, `background` placeholder colour, `width: 100%`, and `max-width` capped to avoid the image overwhelming the card panel on large screens
