import type { Card } from "./types";

/**
 * Format kept cards as a plain-text list compatible with TCGplayer's Mass Entry
 * tool: one card per line as `Qty CardName`.
 */
export function formatTcgplayerList(cards: Card[]): string {
  return cards
    .map((c) => `${c.quantity} ${c.name}`)
    .join("\n");
}

/**
 * The TCGplayer "Create a Buylist" tool is a free, keyless web form. There is no
 * deep-link parameter that carries the paste content, so we hand off to the tool
 * and let the user paste the copyable list.
 */
export const TCGPLAYER_BUYLIST_URL =
  "https://www.tcgplayer.com/buylist/new";
