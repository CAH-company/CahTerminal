import type { PortfolioPosition } from "@/actions/portfolio";

interface DashboardTableProps {
  positions: PortfolioPosition[];
  totalValue: number;
  totalPnl: number;
}

export default function DashboardTable({
  positions,
  totalValue,
  totalPnl,
}: DashboardTableProps) {
  if (positions.length === 0) {
    return (
      <div className="border border-neutral-800 bg-black p-6">
        <p className="font-mono text-sm text-neutral-500">
          NO POSITIONS — Use the trade panel to add transactions.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-neutral-800 bg-black">
      <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-2">
        <span className="font-mono text-xs font-bold text-amber-500">
          PORTFOLIO
        </span>
        <div className="flex gap-6 font-mono text-xs">
          <span className="text-neutral-400">
            TOTAL VALUE:{" "}
            <span className="text-white">
              ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </span>
          <span className="text-neutral-400">
            TOTAL PNL:{" "}
            <span className={totalPnl >= 0 ? "text-green-500" : "text-red-500"}>
              {totalPnl >= 0 ? "+" : ""}
              ${totalPnl.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-800 text-left">
              <th className="px-4 py-2 font-mono text-xs font-normal text-neutral-500">
                TICKER
              </th>
              <th className="px-4 py-2 font-mono text-xs font-normal text-neutral-500 text-right">
                QTY
              </th>
              <th className="px-4 py-2 font-mono text-xs font-normal text-neutral-500 text-right">
                AVG PRICE
              </th>
              <th className="px-4 py-2 font-mono text-xs font-normal text-neutral-500 text-right">
                LIVE PRICE
              </th>
              <th className="px-4 py-2 font-mono text-xs font-normal text-neutral-500 text-right">
                PNL
              </th>
              <th className="px-4 py-2 font-mono text-xs font-normal text-neutral-500 text-right">
                PNL %
              </th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos) => (
              <tr
                key={pos.ticker}
                className="border-b border-neutral-900 hover:bg-neutral-950"
              >
                <td className="px-4 py-2 font-mono text-sm font-bold text-amber-500">
                  {pos.ticker}
                </td>
                <td className="px-4 py-2 font-mono text-sm text-white text-right">
                  {pos.quantity}
                </td>
                <td className="px-4 py-2 font-mono text-sm text-white text-right">
                  ${pos.avgPrice.toFixed(2)}
                </td>
                <td className="px-4 py-2 font-mono text-sm text-white text-right">
                  ${pos.livePrice.toFixed(2)}
                </td>
                <td
                  className={`px-4 py-2 font-mono text-sm text-right ${
                    pos.unrealizedPnl >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {pos.unrealizedPnl >= 0 ? "+" : ""}
                  ${pos.unrealizedPnl.toFixed(2)}
                </td>
                <td
                  className={`px-4 py-2 font-mono text-sm text-right ${
                    pos.pnlPercent >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {pos.pnlPercent >= 0 ? "+" : ""}
                  {pos.pnlPercent.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
