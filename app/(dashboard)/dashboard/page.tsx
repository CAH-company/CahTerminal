import { getPortfolio } from "@/actions/portfolio";
import { getMarketData } from "@/actions/market";
import TickerTape from "@/components/TickerTape";
import DashboardTable from "@/components/DashboardTable";
import TradePanel from "@/components/TradePanel";

export default async function DashboardPage() {
  let portfolio;
  try {
    portfolio = await getPortfolio();
  } catch {
    portfolio = { positions: [], totalValue: 0, totalPnl: 0 };
  }

  let marketData: Awaited<ReturnType<typeof getMarketData>> = [];
  try {
    marketData = await getMarketData();
  } catch {
    marketData = [];
  }

  return (
    <>
      <TickerTape initialData={marketData} />

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
