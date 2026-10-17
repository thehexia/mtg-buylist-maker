import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { parseMoxfieldDeck, DeckParseError } from "@/lib/moxfield";
import { isMoxfieldDeckUrl } from "@/lib/validate-url";

const html = readFileSync(new URL("../test/fixtures/deck.html", import.meta.url), "utf8");
const unparseable = readFileSync(
  new URL("../test/fixtures/deck-unparseable.html", import.meta.url),
  "utf8"
);

describe("parseMoxfieldDeck", () => {
  it("parses a saved sample deck into card entries with name and quantity", () => {
    const cards = parseMoxfieldDeck(html);
    expect(cards.length).toBeGreaterThan(0);
    const commander = cards.find((c) => c.name === "Dack Fayden, Helping Hand");
    expect(commander).toBeDefined();
    expect(commander?.quantity).toBe(1);
    for (const c of cards) {
      expect(typeof c.name).toBe("string");
      expect(c.name.length).toBeGreaterThan(0);
      expect(c.quantity).toBeGreaterThan(0);
    }
  });

  it("collapses duplicate card names and sums quantities", () => {
    const cards = parseMoxfieldDeck(html);
    const moses = cards.filter((c) => c.name === "Chrome Mox");
    expect(moses).toHaveLength(1);
    expect(moses[0].quantity).toBe(2);
    const mosesOpal = cards.filter((c) => c.name === "Mox Opal");
    expect(mosesOpal[0].quantity).toBe(2);
  });

  it("throws a not_found error for a non-deck page", () => {
    expect(() => parseMoxfieldDeck(unparseable)).toThrow(DeckParseError);
    try {
      parseMoxfieldDeck(unparseable);
    } catch (e) {
      expect((e as DeckParseError).code).toBe("parse_failed");
    }
  });
});

describe("isMoxfieldDeckUrl", () => {
  it("accepts valid Moxfield deck URLs", () => {
    expect(isMoxfieldDeckUrl("https://moxfield.com/decks/ctqgAchoZ3abbts70uA0Gw")).toBe(true);
    expect(isMoxfieldDeckUrl("https://www.moxfield.com/decks/12345")).toBe(true);
  });

  it("rejects non-Moxfield and invalid input", () => {
    expect(isMoxfieldDeckUrl("https://tcgplayer.com/buylist")).toBe(false);
    expect(isMoxfieldDeckUrl("moxfield.com/decks/1")).toBe(false);
    expect(isMoxfieldDeckUrl("not a url")).toBe(false);
    expect(isMoxfieldDeckUrl("https://moxfield.com/users/foo")).toBe(false);
  });
});
