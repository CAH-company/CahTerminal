"use server";

import { createClient } from "@/lib/supabase/server";
import { getQuote, getCompanyProfile, getBasicFinancials } from "@/lib/finnhub";

const WATCHED_SYMBOLS = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "SPY"];

export interface MarketCacheEntry {
  ticker: string;
  price: number;
  change: number;
  change_percent: number;
  beta: number | null;
  market_cap: number | null;
  company_name: string | null;
  updated_at: string;
}

export async function refreshMarketCache(): Promise<{ updated: number; errors: string[] }> {
  const supabase = await createClient();
  let updated = 0;
  const errors: string[] = [];

  for (const symbol of WATCHED_SYMBOLS) {
    try {
      const quote = await getQuote(symbol);
      let beta: number | null = null;
      let marketCap: number | null = null;
      let companyName: string | null = null;

      try {
        const [profile, financials] = await Promise.all([
          getCompanyProfile(symbol),
          getBasicFinancials(symbol),
        ]);
        marketCap = profile.marketCapitalization ?? null;
        companyName = profile.name ?? null;
        beta = financials.metric?.beta ?? null;
      } catch {
        // Non-critical: continue with quote data only
      }

      const { error } = await supabase.from("market_cache").upsert(
        {
          ticker: symbol,
          price: quote.c,
          change: quote.d,
          change_percent: quote.dp,
          beta,
          market_cap: marketCap,
          company_name: companyName,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "ticker" }
      );

      if (error) {
        errors.push(`${symbol}: ${error.message}`);
      } else {
        updated++;
      }
    } catch (err) {
      errors.push(`${symbol}: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }

  return { updated, errors };
}

export async function getMarketData(): Promise<MarketCacheEntry[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("market_cache")
    .select("*")
    .order("ticker", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as MarketCacheEntry[]) ?? [];
}
