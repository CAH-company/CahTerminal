import { getPortfolio } from "@/actions/portfolio";
import { getMarketData } from "@/actions/market";
import TickerTape from "@/components/TickerTape";
import DashboardTable from "@/components/DashboardTable";
import TradePanel from "@/components/TradePanel";

export default async function DashboardPage() {
  let portfolio;
  let portfolioError: string | null = null;
  try {
    portfolio = await getPortfolio();
  } catch (err) {
    portfolioError = err instanceof Error ? err.message : "Failed to load portfolio";
    portfolio = { positions: [], totalValue: 0, totalPnl: 0 };
  }

  let marketData: Awaited<ReturnType<typeof getMarketData>> = [];
  let marketError: string | null = null;
  try {
    marketData = await getMarketData();
  } catch (err) {
    marketError = err instanceof Error ? err.message : "Failed to load market data";
    marketData = [];
  }

  return (
    <>
      <TickerTape initialData={marketData} />

      {(portfolioError || marketError) && (
        <div className="mx-4 mt-4 border border-amber-800 bg-amber-950/30 p-2 font-mono text-xs text-amber-400">
          {portfolioError && <p>⚠ Portfolio: {portfolioError}</p>}
          {marketError && <p>⚠ Market Data: {marketError}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <DashboardTable
            positions={portfolio.positions}
            totalValue={portfolio.totalValue}
            totalPnl={portfolio.totalPnl}
          />
        </div>
        <div className="lg:col-span-1">
          <TradePanel />
        </div>
      </div>
    </>
  );
}
