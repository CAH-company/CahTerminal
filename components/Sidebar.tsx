"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Newspaper,
  Monitor,
  BarChart3,
  Briefcase,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/news", label: "NEWS", icon: Newspaper },
  { href: "/terminal", label: "TERMINAL", icon: Monitor },
  { href: "/positions", label: "POSITIONS", icon: BarChart3 },
  { href: "/portfolio", label: "PORTFOLIO", icon: Briefcase },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-48 shrink-0 flex-col border-r border-neutral-800 bg-black">
      <nav className="flex flex-col gap-1 p-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-3 py-2 font-mono text-xs transition-colors ${
                isActive
                  ? "bg-neutral-900 text-amber-500"
                  : "text-neutral-500 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              <Icon size={14} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
