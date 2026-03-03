"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Monitor, Search, Star, Loader2, TrendingUp, TrendingDown, X } from "lucide-react";
import { searchTickers, getTickerDetail } from "@/actions/market";
import type { SymbolSearchResult, TickerDetail } from "@/actions/market";

const FAVORITES_KEY = "cah-terminal-favorites";

function loadFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites: string[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export default function TerminalPage() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SymbolSearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedTicker, setSelectedTicker] = useState<TickerDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchTickers(value);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  }, []);

  const selectTicker = async (symbol: string) => {
    setQuery(symbol);
    setShowSuggestions(false);
    setSuggestions([]);
    setLoadingDetail(true);
    try {
      const detail = await getTickerDetail(symbol);
      setSelectedTicker(detail);
    } catch {
      setSelectedTicker(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  const toggleFavorite = (symbol: string) => {
    setFavorites((prev) => {
      const next = prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol];
      saveFavorites(next);
      return next;
    });
  };

  const isFavorite = (symbol: string) => favorites.includes(symbol);

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
          {/* Search Bar */}
          <div ref={wrapperRef} className="relative mb-4">
            <div className="flex items-center gap-2 border border-neutral-700 bg-neutral-950 px-3 py-2">
              {searching ? (
                <Loader2 size={14} className="animate-spin text-amber-500" />
              ) : (
                <Search size={14} className="text-neutral-500" />
              )}
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Search ticker (e.g. AAPL, MSFT)..."
                className="flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder:text-neutral-600"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setSuggestions([]);
                    setShowSuggestions(false);
                    setSelectedTicker(null);
                  }}
                  className="text-neutral-500 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 mt-1 w-full border border-neutral-700 bg-neutral-950">
                {suggestions.map((item) => (
                  <button
                    key={item.symbol}
                    onClick={() => selectTicker(item.symbol)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-neutral-800"
                  >
                    <div>
                      <span className="font-mono text-sm font-bold text-amber-500">
                        {item.displaySymbol}
                      </span>
                      <span className="ml-2 font-mono text-xs text-neutral-400">
                        {item.description}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-neutral-600">
                      {item.type}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Favorites */}
          {favorites.length > 0 && (
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-1">
                <Star size={12} className="text-amber-500" />
                <span className="font-mono text-xs text-neutral-500">FAVORITES</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {favorites.map((symbol) => (
                  <button
                    key={symbol}
                    onClick={() => selectTicker(symbol)}
                    className="flex items-center gap-1 border border-neutral-700 bg-neutral-900 px-2 py-1 font-mono text-xs text-amber-500 hover:border-amber-500 hover:bg-neutral-800"
                  >
                    {symbol}
                    <X
                      size={10}
                      className="text-neutral-600 hover:text-red-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(symbol);
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ticker Detail */}
          {loadingDetail && (
            <div className="flex items-center gap-2 py-8">
              <Loader2 size={16} className="animate-spin text-amber-500" />
              <span className="font-mono text-xs text-neutral-500">Loading data...</span>
            </div>
          )}

          {selectedTicker && !loadingDetail && (
            <div className="border border-neutral-800 bg-neutral-950 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg font-bold text-amber-500">
                    {selectedTicker.symbol}
                  </span>
                  {selectedTicker.companyName && (
                    <span className="font-mono text-sm text-neutral-400">
                      {selectedTicker.companyName}
                    </span>
                  )}
                  {selectedTicker.industry && (
                    <span className="font-mono text-xs text-neutral-600">
                      ({selectedTicker.industry})
                    </span>
                  )}
                </div>
                <button
                  onClick={() => toggleFavorite(selectedTicker.symbol)}
                  className="flex items-center gap-1 font-mono text-xs"
                  title={isFavorite(selectedTicker.symbol) ? "Remove from favorites" : "Add to favorites"}
                >
                  <Star
                    size={14}
                    className={
                      isFavorite(selectedTicker.symbol)
                        ? "fill-amber-500 text-amber-500"
                        : "text-neutral-600 hover:text-amber-500"
                    }
                  />
                </button>
              </div>

              <div className="mb-4 flex items-baseline gap-3">
                <span className="font-mono text-2xl font-bold text-white">
                  ${selectedTicker.price.toFixed(2)}
                </span>
                <span
                  className={`flex items-center gap-1 font-mono text-sm font-bold ${
                    selectedTicker.change >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {selectedTicker.change >= 0 ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  {selectedTicker.change >= 0 ? "+" : ""}
                  {selectedTicker.change.toFixed(2)} ({selectedTicker.changePercent.toFixed(2)}%)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <span className="block font-mono text-xs text-neutral-600">OPEN</span>
                  <span className="font-mono text-sm text-white">
                    ${selectedTicker.open.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-xs text-neutral-600">HIGH</span>
                  <span className="font-mono text-sm text-white">
                    ${selectedTicker.high.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-xs text-neutral-600">LOW</span>
                  <span className="font-mono text-sm text-white">
                    ${selectedTicker.low.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-xs text-neutral-600">PREV CLOSE</span>
                  <span className="font-mono text-sm text-white">
                    ${selectedTicker.prevClose.toFixed(2)}
                  </span>
                </div>
                {selectedTicker.marketCap && (
                  <div>
                    <span className="block font-mono text-xs text-neutral-600">MKT CAP</span>
                    <span className="font-mono text-sm text-white">
                      ${(selectedTicker.marketCap / 1000).toFixed(1)}B
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {!selectedTicker && !loadingDetail && (
            <p className="font-mono text-xs text-neutral-600">
              Enter a ticker symbol to view live price data, financial indicators, and company info.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
