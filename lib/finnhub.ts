const FINNHUB_BASE = "https://finnhub.io/api/v1";

function getApiKey(): string {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) throw new Error("FINNHUB_API_KEY is not set in environment variables");
  return key;
}

export interface FinnhubQuote {
  c: number;  // Current price
  d: number;  // Change
  dp: number; // Percent change
  h: number;  // High price of the day
  l: number;  // Low price of the day
  o: number;  // Open price of the day
  pc: number; // Previous close price
  t: number;  // Timestamp
}

export interface FinnhubProfile {
  marketCapitalization: number;
  name: string;
  ticker: string;
  finnhubIndustry: string;
}

export interface FinnhubMetric {
  beta: number;
  "52WeekHigh": number;
  "52WeekLow": number;
}

export async function getQuote(symbol: string): Promise<FinnhubQuote> {
  const res = await fetch(
    `${FINNHUB_BASE}/quote?symbol=${encodeURIComponent(symbol)}&token=${getApiKey()}`,
    { next: { revalidate: 30 } }
  );
  if (!res.ok) throw new Error(`Finnhub quote error for ${symbol}: ${res.status}`);
  return res.json();
}

export async function getCompanyProfile(symbol: string): Promise<FinnhubProfile> {
  const res = await fetch(
    `${FINNHUB_BASE}/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${getApiKey()}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error(`Finnhub profile error for ${symbol}: ${res.status}`);
  return res.json();
}

export async function getBasicFinancials(symbol: string): Promise<{ metric: FinnhubMetric }> {
  const res = await fetch(
    `${FINNHUB_BASE}/stock/metric?symbol=${encodeURIComponent(symbol)}&metric=all&token=${getApiKey()}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error(`Finnhub financials error for ${symbol}: ${res.status}`);
  return res.json();
}

export interface FinnhubSymbolMatch {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

export async function searchSymbols(query: string): Promise<FinnhubSymbolMatch[]> {
  if (!query.trim()) return [];
  const res = await fetch(
    `${FINNHUB_BASE}/search?q=${encodeURIComponent(query)}&token=${getApiKey()}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  // Filter to common stock types and limit results
  return (data.result ?? [])
    .filter((item: FinnhubSymbolMatch) => !item.symbol.includes("."))
    .slice(0, 8);
}

export async function getQuotes(symbols: string[]): Promise<Record<string, FinnhubQuote>> {
  const results: Record<string, FinnhubQuote> = {};
  // Limit concurrent requests to avoid Finnhub API rate limits
  const CONCURRENT_LIMIT = 5;

  for (let i = 0; i < symbols.length; i += CONCURRENT_LIMIT) {
    const batch = symbols.slice(i, i + CONCURRENT_LIMIT);
    const quotes = await Promise.all(batch.map((s) => getQuote(s)));
    batch.forEach((s, idx) => {
      results[s] = quotes[idx];
    });
  }

  return results;
}
