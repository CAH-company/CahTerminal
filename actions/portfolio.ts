"use server";

import { createClient } from "@/lib/supabase/server";
import { getQuotes } from "@/lib/finnhub";

interface Transaction {
  id: string;
  ticker: string;
  type: "BUY" | "SELL";
  quantity: number;
  price: number;
  created_at: string;
}

export interface PortfolioPosition {
  ticker: string;
  quantity: number;
  avgPrice: number;
  livePrice: number;
  totalValue: number;
  unrealizedPnl: number;
  pnlPercent: number;
}

export interface PortfolioSummary {
  positions: PortfolioPosition[];
  totalValue: number;
  totalPnl: number;
}

export async function getPortfolio(): Promise<PortfolioSummary> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  // Aggregate positions per ticker
  const holdings: Record<
    string,
    { totalQty: number; totalCost: number }
  > = {};

  for (const tx of transactions as Transaction[]) {
    if (!holdings[tx.ticker]) {
      holdings[tx.ticker] = { totalQty: 0, totalCost: 0 };
    }
    if (tx.type === "BUY") {
      holdings[tx.ticker].totalCost += tx.quantity * tx.price;
      holdings[tx.ticker].totalQty += tx.quantity;
    } else {
      // SELL: reduce quantity, proportionally reduce cost basis
      const h = holdings[tx.ticker];
      if (h.totalQty > 0) {
        const avgCost = h.totalCost / h.totalQty;
        h.totalQty -= tx.quantity;
        h.totalCost = h.totalQty * avgCost;
      }
    }
  }

  // Filter out zero/negative positions
  const activeTickers = Object.entries(holdings)
    .filter(([, h]) => h.totalQty > 0)
    .map(([ticker]) => ticker);

  if (activeTickers.length === 0) {
    return { positions: [], totalValue: 0, totalPnl: 0 };
  }

  // Fetch live prices from Finnhub
  const quotes = await getQuotes(activeTickers);

  const positions: PortfolioPosition[] = activeTickers.map((ticker) => {
    const h = holdings[ticker];
    const avgPrice = h.totalCost / h.totalQty;
    const livePrice = quotes[ticker]?.c ?? avgPrice;
    const totalValue = h.totalQty * livePrice;
    const unrealizedPnl = (livePrice - avgPrice) * h.totalQty;
    const pnlPercent = avgPrice > 0 ? ((livePrice - avgPrice) / avgPrice) * 100 : 0;

    return {
      ticker,
      quantity: h.totalQty,
      avgPrice: Math.round(avgPrice * 100) / 100,
      livePrice: Math.round(livePrice * 100) / 100,
      totalValue: Math.round(totalValue * 100) / 100,
      unrealizedPnl: Math.round(unrealizedPnl * 100) / 100,
      pnlPercent: Math.round(pnlPercent * 100) / 100,
    };
  });

  const totalValue = positions.reduce((sum, p) => sum + p.totalValue, 0);
  const totalPnl = positions.reduce((sum, p) => sum + p.unrealizedPnl, 0);

  return {
    positions,
    totalValue: Math.round(totalValue * 100) / 100,
    totalPnl: Math.round(totalPnl * 100) / 100,
  };
}
