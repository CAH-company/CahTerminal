"use client";

import { useState } from "react";
import { executeTrade } from "@/actions/trade";
import { useRouter } from "next/navigation";

export default function TradePanel() {
  const [ticker, setTicker] = useState("");
  const [type, setType] = useState<"BUY" | "SELL">("BUY");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await executeTrade({
      ticker,
      type,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
    });

    if (result.error) {
      setError(result.error);
    } else {
      setTicker("");
      setQuantity("");
      setPrice("");
      router.refresh();
    }

    setLoading(false);
  };

  return (
    <div className="border border-neutral-800 bg-black">
      <div className="border-b border-neutral-800 px-4 py-2">
        <span className="font-mono text-xs font-bold text-amber-500">
          TRADE
        </span>
      </div>

      <form onSubmit={handleSubmit} className="p-4">
        {error && (
          <div className="mb-3 border border-red-800 bg-red-950 p-2 font-mono text-xs text-red-400">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label className="mb-1 block font-mono text-xs text-neutral-500">
            TICKER
          </label>
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="AAPL"
            required
            className="w-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 font-mono text-sm text-white outline-none focus:border-amber-500"
          />
        </div>

        <div className="mb-3 flex gap-2">
          <button
            type="button"
            onClick={() => setType("BUY")}
            className={`flex-1 py-1.5 font-mono text-xs font-bold ${
              type === "BUY"
                ? "bg-green-700 text-white"
                : "border border-neutral-700 text-neutral-500"
            }`}
          >
            BUY
          </button>
          <button
            type="button"
            onClick={() => setType("SELL")}
            className={`flex-1 py-1.5 font-mono text-xs font-bold ${
              type === "SELL"
                ? "bg-red-700 text-white"
                : "border border-neutral-700 text-neutral-500"
            }`}
          >
            SELL
          </button>
        </div>

        <div className="mb-3 flex gap-2">
          <div className="flex-1">
            <label className="mb-1 block font-mono text-xs text-neutral-500">
              QTY
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              required
              min="0.01"
              step="any"
              className="w-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 font-mono text-sm text-white outline-none focus:border-amber-500"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block font-mono text-xs text-neutral-500">
              PRICE
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              required
              min="0.01"
              step="any"
              className="w-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 font-mono text-sm text-white outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 font-mono text-sm font-bold text-white disabled:opacity-50 ${
            type === "BUY"
              ? "bg-green-700 hover:bg-green-600"
              : "bg-red-700 hover:bg-red-600"
          }`}
        >
          {loading
            ? "EXECUTING..."
            : `${type} ${ticker.toUpperCase() || "..."}`}
        </button>
      </form>
    </div>
  );
}
