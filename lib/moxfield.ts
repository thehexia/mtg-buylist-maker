import { JSDOM } from "jsdom";
import type { Card } from "./types";

function cleanName(raw: string): string {
  return raw
    .replace(/Foil(?=\s|$)/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Parse a rendered Moxfield deck page into a deduplicated, quantity-summed
 * list of cards. Moxfield server-renders the decklist as a table whose rows are
 * `li[data-testid="deck-view-table-row"]`. A row with no `/cards/` anchor is a
 * section header (e.g. "Main", "Sideboard"); a row with one is a card.
 */
export function parseMoxfieldDeck(html: string): Card[] {
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const rows = Array.from(
    doc.querySelectorAll('li[data-testid="deck-view-table-row"]')
  );

  if (rows.length === 0) {
    // No decklist rows found: distinguish "not a deck page" from "empty deck".
    const looksLikeError =
      /404|does not exist|page not found|attention required|cloudflare/i.test(
        doc.body?.textContent ?? ""
      );
    throw new DeckParseError(
      looksLikeError ? "not_found" : "parse_failed"
    );
  }

  const byName = new Map<string, Card>();

  for (const row of rows) {
    const link = row.querySelector('a.table-deck-row-link[href*="/cards/"]');
    if (!link) continue; // section header row

    const rawName = link.textContent ?? "";
    const name = cleanName(rawName);
    if (!name) continue;

    const qtyCell = row.querySelector("div");
    const quantity = qtyCell ? parseInt(qtyCell.textContent?.trim() ?? "0", 10) : 0;
    if (!Number.isFinite(quantity) || quantity <= 0) continue;

    const existing = byName.get(name);
    if (existing) {
      existing.quantity += quantity;
    } else {
      byName.set(name, { name, quantity });
    }
  }

  if (byName.size === 0) {
    throw new DeckParseError("parse_failed");
  }

  return Array.from(byName.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

export class DeckParseError extends Error {
  code: "not_found" | "parse_failed";

  constructor(code: "not_found" | "parse_failed") {
    super(code === "not_found" ? "Deck not found or unavailable" : "Could not parse this deck");
    this.name = "DeckParseError";
    this.code = code;
  }
}
