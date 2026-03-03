"use client";

import { useEffect, useState } from "react";
import type { MarketCacheEntry } from "@/actions/market";

interface TickerTapeProps {
  initialData: MarketCacheEntry[];
}

export default function TickerTape({ initialData }: TickerTapeProps) {
  const [items, setItems] = useState<MarketCacheEntry[]>(initialData);

  useEffect(() => {
    setItems(initialData);
  }, [initialData]);

  if (items.length === 0) {
    return (
      <div className="border-b border-neutral-800 bg-black px-4 py-2">
        <span className="font-mono text-xs text-neutral-600">
          NO MARKET DATA — Run market refresh to populate
        </span>
      </div>
    );
  }

  // Duplicate items for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden border-b border-neutral-800 bg-black">
      <div className="flex animate-ticker whitespace-nowrap py-2">
        {doubled.map((item, idx) => (
          <span key={`${item.ticker}-${idx}`} className="mx-4 inline-flex items-center gap-2 font-mono text-xs">
            <span className="font-bold text-amber-500">{item.ticker}</span>
            <span className="text-white">${item.price?.toFixed(2) ?? "—"}</span>
            <span
              className={
                (item.change_percent ?? 0) >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {(item.change_percent ?? 0) >= 0 ? "▲" : "▼"}{" "}
              {Math.abs(item.change_percent ?? 0).toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
