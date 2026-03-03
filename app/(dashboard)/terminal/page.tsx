"use client";

import { useState } from "react";
import { Monitor, Search } from "lucide-react";

export default function TerminalPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="p-4">
      <div className="border border-neutral-800 bg-black">
        <div className="flex items-center gap-2 border-b border-neutral-800 px-4 py-2">
          <Monitor size={14} className="text-amber-500" />
          <span className="font-mono text-xs font-bold text-amber-500">
            TERMINAL
          </span>
        </div>
        <div className="p-4">
          <div className="mb-4 flex items-center gap-2 border border-neutral-700 bg-neutral-950 px-3 py-2">
            <Search size={14} className="text-neutral-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ticker (e.g. AAPL, MSFT)..."
              className="flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder:text-neutral-600"
            />
          </div>
          <p className="font-mono text-xs text-neutral-600">
            Enter a ticker symbol to view charts, financial indicators, and company data.
          </p>
        </div>
      </div>
    </div>
  );
}
