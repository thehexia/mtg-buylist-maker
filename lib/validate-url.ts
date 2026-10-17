/**
 * Accept only Moxfield deck URLs on the client before calling the backend, so
 * obviously invalid input never hits the network.
 */
export function isMoxfieldDeckUrl(value: string): boolean {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return false;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return false;

  const host = url.hostname.toLowerCase();
  const isMoxfieldHost =
    host === "moxfield.com" || host === "www.moxfield.com" || host.endsWith(".moxfield.com");
  if (!isMoxfieldHost) return false;

  const segments = url.pathname.split("/").filter(Boolean);
  // Accept both legacy `/decks/123` and modern `/decks/<id>` forms.
  return segments[0] === "decks" && segments[1] !== undefined;
}
