"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useBuylist } from "@/hooks/useBuylist";
import { useArtCache } from "@/hooks/useArtCache";
import { CardSwipe } from "@/components/CardSwipe";
import { isMoxfieldDeckUrl } from "@/lib/validate-url";
import { formatTcgplayerList, TCGPLAYER_BUYLIST_URL } from "@/lib/tcgplayer";
import type { Card, DeckErrorCode } from "@/lib/types";

type LoadError = DeckErrorCode;

function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return isTouch;
}

export default function Home() {
  const isTouch = useIsTouch();
  const { state, startDeck, decide, reset, buylist, done, current } = useBuylist();
  const { getArt, fetchArt } = useArtCache();

  useEffect(() => {
    if (current) {
      void fetchArt(current.name, current.set);
    }
  }, [current?.name, current?.set, fetchArt]);

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<LoadError | null>(null);
  const [urlErr, setUrlErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadDeck = useCallback(
    async (value: string) => {
      setError(null);
      setUrlErr(null);
      setCopied(false);

      if (!isMoxfieldDeckUrl(value)) {
        setUrlErr("Enter a valid Moxfield deck URL (moxfield.com/decks/...).");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/deck?url=${encodeURIComponent(value)}`);
        const data = await res.json();
        if (!res.ok || data.error) {
          const code: LoadError =
            data.error === "parse_failed" ? "parse_failed" : "not_found";
          setError(code);
          return;
        }
        const cards: Card[] = data.cards ?? [];
        if (cards.length === 0) {
          setError("parse_failed");
          return;
        }
        startDeck(cards);
      } catch {
        setError("not_found");
      } finally {
        setLoading(false);
      }
    },
    [startDeck]
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void loadDeck(url);
  };

  const onRetry = () => {
    void loadDeck(url);
  };

  const startOver = () => {
    reset();
    setUrl("");
    setError(null);
  };

  const copyText = useMemo(() => formatTcgplayerList(buylist), [buylist]);

  const copyList = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, [copyText]);

  const showReview = state.deck.length > 0 && !done;
  const showResults = state.deck.length > 0 && done;

  return (
    <main className="container">
      <h1>MTG Buylist Maker</h1>

      {/* URL entry */}
      {(state.deck.length === 0) && (
        <form onSubmit={onSubmit}>
          <label htmlFor="mfx-url">Moxfield deck URL</label>
          <input
            id="mfx-url"
            type="text"
            inputMode="url"
            placeholder="https://moxfield.com/decks/yourdeck"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />
          {urlErr && <p className="error">{urlErr}</p>}
          <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Loading…" : "Load deck"}
            </button>
          </div>
        </form>
      )}

      {/* Server error */}
      {error && (
        <div className="error">
          <p>
            {error === "parse_failed"
              ? "Could not parse this deck. Try a different URL."
              : "Deck not found or unavailable. Try a different URL."}
          </p>
          <div style={{ marginTop: 8, display: "flex", gap: 12 }}>
            <button onClick={onRetry}>Retry</button>
            <button onClick={() => setUrl("")}>New URL</button>
          </div>
        </div>
      )}

      {loading && (
        <>
          <div className="spinner" aria-label="loading" />
          <p className="muted">Fetching deck…</p>
        </>
      )}

      {/* Review flow */}
      {showReview && current && (
        <>
          <div className="progress" aria-hidden>
            <div
              style={{ width: `${(state.index / state.deck.length) * 100}%` }}
            />
          </div>
          <CardSwipe
            card={current}
            position={state.index}
            total={state.deck.length}
            onDecide={decide}
            isTouch={isTouch}
            artUrl={getArt(current.name, current.set)}
          />
          <button onClick={startOver}>Reset</button>
        </>
      )}

      {/* Results / export */}
      {showResults && (
        <section>
          <h2>
            {buylist.length} kept
          </h2>
          {buylist.length === 0 ? (
            <div className="error">
              <p>No cards kept. Go back and keep some cards to build a buylist.</p>
              <button className="btn-primary" onClick={startOver}>
                Start over
              </button>
            </div>
          ) : (
            <>
              <ul className="list">
                {buylist.map((c, i) => (
                  <li key={`${c.name}-${i}`}>
                    <span>
                      {c.name}
                      {c.set ? ` (${c.set})` : ""}
                    </span>
                    <span className="q">x {c.quantity}</span>
                  </li>
                ))}
              </ul>

              <label>TCGplayer list (copyable)</label>
              <textarea
                readOnly
                value={copyText}
                onFocus={(e) => e.currentTarget.select()}
              />

              <div className="btn-row" style={{ marginTop: 12 }}>
                <button className="btn-primary" onClick={copyList}>
                  {copied ? "Copied!" : "Copy list"}
                </button>
                <a
                  className="btn-primary"
                  style={{
                    display: "inline-block",
                    textAlign: "center",
                    textDecoration: "none",
                  }}
                  href={TCGPLAYER_BUYLIST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open TCGplayer
                </a>
              </div>
              {copied && <p className="muted">Copied. Paste it in TCGplayer.</p>}
              <button onClick={startOver} style={{ marginTop: 12 }}>
                Start over
              </button>
            </>
          )}
        </section>
      )}
    </main>
  );
}
