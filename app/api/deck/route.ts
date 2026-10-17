import { NextResponse } from "next/server";
import { fetchMoxfieldHtml } from "@/lib/fetcher";
import { isMoxfieldDeckUrl } from "@/lib/validate-url";
import { parseMoxfieldDeck, DeckParseError } from "@/lib/moxfield";
import type { DeckResult, DeckError } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function toError(body: unknown, status: number): Promise<NextResponse> {
  const err = body as DeckError;
  return NextResponse.json({ error: err.error, message: err.message }, { status });
}

export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);
  const deckUrl = url.searchParams.get("url");

  if (!deckUrl || !isMoxfieldDeckUrl(deckUrl)) {
    const body: DeckError = { error: "not_found", message: "Enter a valid Moxfield deck URL." };
    return toError(body, 400);
  }

  let html: string;
  try {
    html = await fetchMoxfieldHtml(deckUrl);
  } catch (e) {
    const code = "not_found";
    const body: DeckError = { error: code, message: "Deck not found or unavailable." };
    return toError(body, 502);
  }

  let cards;
  try {
    cards = parseMoxfieldDeck(html);
  } catch (e) {
    const err = e as DeckParseError;
    const code = err.code === "not_found" ? "not_found" : "parse_failed";
    const body: DeckError = {
      error: code,
      message: code === "not_found" ? "Deck not found or unavailable." : "Could not parse this deck.",
    };
    return toError(body, code === "not_found" ? 502 : 422);
  }

  const body: DeckResult = { cards };
  return NextResponse.json(body);
}
