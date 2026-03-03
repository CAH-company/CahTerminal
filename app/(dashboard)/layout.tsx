import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import PremiumBadge from "@/components/PremiumBadge";
import Sidebar from "@/components/Sidebar";

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
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="flex items-center justify-between border-b border-neutral-800 px-4 py-2">
        <div className="flex items-center gap-3">
          <Link href="/portfolio" className="font-mono text-sm font-bold text-amber-500 hover:text-amber-400">
            CAH TERMINAL
          </Link>
          <PremiumBadge role={role} />
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/account"
            className="font-mono text-xs text-neutral-500 hover:text-amber-500"
          >
            {user.email}
          </Link>
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
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
