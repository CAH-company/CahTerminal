import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PremiumBadge from "@/components/PremiumBadge";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "normal";

  const handleSignOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex items-center justify-between border-b border-neutral-800 px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-bold text-amber-500">
            CAH TERMINAL
          </span>
          <PremiumBadge role={role} />
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-neutral-500">
            {user.email}
          </span>
          <form action={handleSignOut}>
            <button
              type="submit"
              className="font-mono text-xs text-neutral-500 hover:text-white"
            >
              SIGN OUT
            </button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}
