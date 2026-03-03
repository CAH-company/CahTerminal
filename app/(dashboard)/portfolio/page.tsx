import { getPortfolio } from "@/actions/portfolio";
import { getMarketData } from "@/actions/market";
import TickerTape from "@/components/TickerTape";
import { Briefcase, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export default async function PortfolioPage() {
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

  const positionCount = portfolio.positions.length;
  const totalValue = portfolio.totalValue;
  const totalPnl = portfolio.totalPnl;
  const pnlPercent = totalValue > 0 ? (totalPnl / (totalValue - totalPnl)) * 100 : 0;

  return (
    <>
      <TickerTape initialData={marketData} />

      {(portfolioError || marketError) && (
        <div className="mx-4 mt-4 border border-amber-800 bg-amber-950/30 p-2 font-mono text-xs text-amber-400">
          {portfolioError && <p>⚠ Portfolio: {portfolioError}</p>}
          {marketError && <p>⚠ Market Data: {marketError}</p>}
        </div>
      )}

      <div className="p-4">
        <div className="mb-4 border border-neutral-800 bg-black">
          <div className="flex items-center gap-2 border-b border-neutral-800 px-4 py-2">
            <Briefcase size={14} className="text-amber-500" />
            <span className="font-mono text-xs font-bold text-amber-500">
              PORTFOLIO OVERVIEW
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border border-neutral-800 p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={14} className="text-neutral-500" />
                <span className="font-mono text-xs text-neutral-500">TOTAL VALUE</span>
              </div>
              <span className="font-mono text-lg font-bold text-white">
                ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="border border-neutral-800 p-4">
              <div className="flex items-center gap-2 mb-2">
                {totalPnl >= 0 ? (
                  <TrendingUp size={14} className="text-green-500" />
                ) : (
                  <TrendingDown size={14} className="text-red-500" />
                )}
                <span className="font-mono text-xs text-neutral-500">TOTAL PNL</span>
              </div>
              <span
                className={`font-mono text-lg font-bold ${
                  totalPnl >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {totalPnl >= 0 ? "+" : ""}
                ${totalPnl.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="border border-neutral-800 p-4">
              <div className="flex items-center gap-2 mb-2">
                {pnlPercent >= 0 ? (
                  <TrendingUp size={14} className="text-green-500" />
                ) : (
                  <TrendingDown size={14} className="text-red-500" />
                )}
                <span className="font-mono text-xs text-neutral-500">PNL %</span>
              </div>
              <span
                className={`font-mono text-lg font-bold ${
                  pnlPercent >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {pnlPercent >= 0 ? "+" : ""}
                {pnlPercent.toFixed(2)}%
              </span>
            </div>

            <div className="border border-neutral-800 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase size={14} className="text-neutral-500" />
                <span className="font-mono text-xs text-neutral-500">POSITIONS</span>
              </div>
              <span className="font-mono text-lg font-bold text-white">
                {positionCount}
              </span>
            </div>
          </div>
        </div>

        {portfolio.positions.length > 0 && (
          <div className="border border-neutral-800 bg-black">
            <div className="border-b border-neutral-800 px-4 py-2">
              <span className="font-mono text-xs font-bold text-amber-500">
                HOLDINGS
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-800 text-left">
                    <th className="px-4 py-2 font-mono text-xs font-normal text-neutral-500">TICKER</th>
                    <th className="px-4 py-2 font-mono text-xs font-normal text-neutral-500 text-right">QTY</th>
                    <th className="px-4 py-2 font-mono text-xs font-normal text-neutral-500 text-right">AVG PRICE</th>
                    <th className="px-4 py-2 font-mono text-xs font-normal text-neutral-500 text-right">LIVE PRICE</th>
                    <th className="px-4 py-2 font-mono text-xs font-normal text-neutral-500 text-right">VALUE</th>
                    <th className="px-4 py-2 font-mono text-xs font-normal text-neutral-500 text-right">PNL</th>
                    <th className="px-4 py-2 font-mono text-xs font-normal text-neutral-500 text-right">PNL %</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.positions.map((pos) => (
                    <tr key={pos.ticker} className="border-b border-neutral-900 hover:bg-neutral-950">
                      <td className="px-4 py-2 font-mono text-sm font-bold text-amber-500">{pos.ticker}</td>
                      <td className="px-4 py-2 font-mono text-sm text-white text-right">{pos.quantity}</td>
                      <td className="px-4 py-2 font-mono text-sm text-white text-right">${pos.avgPrice.toFixed(2)}</td>
                      <td className="px-4 py-2 font-mono text-sm text-white text-right">${pos.livePrice.toFixed(2)}</td>
                      <td className="px-4 py-2 font-mono text-sm text-white text-right">${pos.totalValue.toFixed(2)}</td>
                      <td className={`px-4 py-2 font-mono text-sm text-right ${pos.unrealizedPnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {pos.unrealizedPnl >= 0 ? "+" : ""}${pos.unrealizedPnl.toFixed(2)}
                      </td>
                      <td className={`px-4 py-2 font-mono text-sm text-right ${pos.pnlPercent >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {pos.pnlPercent >= 0 ? "+" : ""}{pos.pnlPercent.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
