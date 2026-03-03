import { Newspaper } from "lucide-react";

export default function NewsPage() {
  return (
    <div className="p-4">
      <div className="border border-neutral-800 bg-black">
        <div className="flex items-center gap-2 border-b border-neutral-800 px-4 py-2">
          <Newspaper size={14} className="text-amber-500" />
          <span className="font-mono text-xs font-bold text-amber-500">
            MARKET NEWS
          </span>
        </div>
        <div className="p-6">
          <p className="font-mono text-sm text-neutral-500">
            NEWS FEED — Financial news will appear here.
          </p>
          <p className="mt-2 font-mono text-xs text-neutral-600">
            Connect a news API to display real-time market headlines.
          </p>
        </div>
      </div>
    </div>
  );
}
