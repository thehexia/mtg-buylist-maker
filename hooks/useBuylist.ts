"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Card } from "@/lib/types";

export type Decision = "y" | "n";

export interface BuylistState {
  deck: Card[];
  index: number;
  decisions: (Decision | undefined)[];
}

const STORAGE_KEY = "mtg-buylist-state";

function emptyState(): BuylistState {
  return { deck: [], index: 0, decisions: [] };
}

function load(): BuylistState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as BuylistState;
    if (!parsed.deck || !Array.isArray(parsed.decisions)) return emptyState();
    return parsed;
  } catch {
    return emptyState();
  }
}

export function useBuylist() {
  const [state, setState] = useState<BuylistState>(emptyState);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable: ignore */
    }
  }, [state, hydrated]);

  const startDeck = useCallback((cards: Card[]) => {
    setState({ deck: cards, index: 0, decisions: Array(cards.length).fill(undefined) });
  }, []);

  const decide = useCallback(
    (choice: Decision) => {
      setState((prev) => {
        if (prev.index >= prev.deck.length) return prev;
        const decisions = prev.decisions.slice();
        decisions[prev.index] = choice;
        return { ...prev, decisions, index: prev.index + 1 };
      });
    },
    []
  );

  const reset = useCallback(() => {
    setState(emptyState());
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const buylist = useMemo(
    () =>
      state.deck
        .map((c, i) => (state.decisions[i] === "y" ? c : null))
        .filter((c): c is Card => c !== null),
    [state.deck, state.decisions]
  );

  const done = state.deck.length > 0 && state.index >= state.deck.length;
  const current =
    state.index < state.deck.length ? state.deck[state.index] : null;

  return { state, startDeck, decide, reset, buylist, done, current };
}
