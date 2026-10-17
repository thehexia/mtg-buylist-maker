export interface Card {
  name: string;
  quantity: number;
  set?: string;
}

export type DeckErrorCode = "not_found" | "parse_failed";

export interface DeckResult {
  cards: Card[];
}

export interface DeckError {
  error: DeckErrorCode;
  message: string;
}
