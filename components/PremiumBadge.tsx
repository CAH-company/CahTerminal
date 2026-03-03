interface PremiumBadgeProps {
  role: string | null;
}

export default function PremiumBadge({ role }: PremiumBadgeProps) {
  if (role !== "premium") return null;

  return (
    <span className="inline-flex items-center border border-amber-600 bg-amber-900/30 px-2 py-0.5 font-mono text-xs font-bold text-amber-400">
      PREMIUM
    </span>
  );
}
