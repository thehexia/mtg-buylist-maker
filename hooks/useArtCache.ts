"use client";

import { useCallback, useRef, useState } from "react";

function cacheKey(name: string, set?: string) {
  return `${name}:${set ?? ""}`;
}

export function useArtCache() {
  const cache = useRef<Map<string, string | null>>(new Map());
  const [, setTick] = useState(0);

  const getArt = useCallback(
    (name: string, set?: string): string | null | undefined => {
      const k = cacheKey(name, set);
      if (!cache.current.has(k)) return undefined;
      return cache.current.get(k) as string | null;
    },
    []
  );

  const fetchArt = useCallback(async (name: string, set?: string) => {
    const k = cacheKey(name, set);
    if (cache.current.has(k)) return;

    try {
      const params = new URLSearchParams({ fuzzy: name });
      if (set) params.set("set", set);
      const res = await fetch(
        `https://api.scryfall.com/cards/named?${params.toString()}`
      );
      if (!res.ok) {
        cache.current.set(k, null);
        setTick((t) => t + 1);
        return;
      }
      const data = await res.json();
      const url: string | null = data?.image_uris?.normal ?? null;
      cache.current.set(k, url);
      setTick((t) => t + 1);
    } catch {
      cache.current.set(k, null);
      setTick((t) => t + 1);
    }
  }, []);

  return { getArt, fetchArt };
}
