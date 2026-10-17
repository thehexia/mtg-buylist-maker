import { chromium, type Browser } from "playwright";

const BROWSER_TIMEOUT_MS = 60_000;

let browserPromise: Promise<Browser> | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });
  }
  return browserPromise;
}

/**
 * Fetch a Moxfield deck page's server-rendered HTML via a headless browser.
 *
 * Moxfield is protected by Cloudflare: a plain server-side fetch returns HTTP
 * 403. A real browser solves the challenge and returns the rendered decklist.
 * The returned body is parsed by `parseMoxfieldDeck`.
 */
export async function fetchMoxfieldHtml(deckUrl: string): Promise<string> {
  const browser = await getBrowser();
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();
  try {
    await page.goto(deckUrl, { waitUntil: "networkidle", timeout: BROWSER_TIMEOUT_MS });
    return await page.content();
  } catch {
    throw new DeckFetchError("not_found");
  } finally {
    await context.close();
  }
}

export class DeckFetchError extends Error {
  code: "not_found" | "parse_failed" | "timeout";

  constructor(code: "not_found" | "parse_failed" | "timeout") {
    super(code === "timeout" ? "Moxfield timed out" : "Deck not found or unavailable");
    this.name = "DeckFetchError";
    this.code = code;
  }
}
