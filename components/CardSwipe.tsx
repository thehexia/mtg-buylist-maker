"use client";

import { useRef, useState } from "react";
import type { Card as CardType } from "@/lib/types";
import type { Decision } from "@/hooks/useBuylist";

const SWIPE_THRESHOLD = 60;

export function CardSwipe({
  card,
  position,
  total,
  onDecide,
  isTouch,
}: {
  card: CardType;
  position: number;
  total: number;
  onDecide: (choice: Decision) => void;
  isTouch: boolean;
}) {
  const [dx, setDx] = useState(0);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
    startY.current = e.clientY;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    setDx(e.clientX - startX.current);
  };

  const onPointerUp = () => {
    if (dx >= SWIPE_THRESHOLD) onDecide("y");
    else if (dx <= -SWIPE_THRESHOLD) onDecide("n");
    setDx(0);
    startX.current = null;
    startY.current = null;
  };

  const keepTone = dx >= 0 ? "rgba(47,158,95,0.18)" : "rgba(192,57,43,0.18)";

  return (
    <div
      className="card"
      style={{
        transform: `translateX(${dx}px) rotate(${dx / 40}deg)`,
        transition: startX.current === null ? "transform 0.15s ease" : "none",
        background: keepTone,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="qty">
        Qty {card.quantity}
        {card.set ? ` · ${card.set}` : ""}
      </div>
      <div className="name">{card.name}</div>
      <div className="muted">
        Card {position + 1} of {total}
      </div>
      {isTouch ? (
        <div className="hint">Swipe right to keep, left to skip</div>
      ) : (
        <div className="btn-row" style={{ marginTop: 16 }}>
          <button className="btn-danger" onClick={() => onDecide("n")}>
            No
          </button>
          <button className="btn-primary" onClick={() => onDecide("y")}>
            Yes
          </button>
        </div>
      )}
    </div>
  );
}
