import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { User, Mail, Calendar, Shield } from "lucide-react";

export default async function AccountPage() {
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
  const nickname = user.user_metadata?.nickname ?? "—";
  const birthDate = user.user_metadata?.birth_date ?? "—";
  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="p-4">
      <div className="border border-neutral-800 bg-black">
        <div className="flex items-center gap-2 border-b border-neutral-800 px-4 py-2">
          <User size={14} className="text-amber-500" />
          <span className="font-mono text-xs font-bold text-amber-500">
            ACCOUNT
          </span>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3 border border-neutral-800 p-3">
              <User size={16} className="text-neutral-500" />
              <div>
                <span className="block font-mono text-xs text-neutral-500">NICKNAME</span>
                <span className="font-mono text-sm text-white">{nickname}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 border border-neutral-800 p-3">
              <Mail size={16} className="text-neutral-500" />
              <div>
                <span className="block font-mono text-xs text-neutral-500">EMAIL</span>
                <span className="font-mono text-sm text-white">{user.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 border border-neutral-800 p-3">
              <Calendar size={16} className="text-neutral-500" />
              <div>
                <span className="block font-mono text-xs text-neutral-500">BIRTH DATE</span>
                <span className="font-mono text-sm text-white">{birthDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 border border-neutral-800 p-3">
              <Shield size={16} className="text-neutral-500" />
              <div>
                <span className="block font-mono text-xs text-neutral-500">PLAN</span>
                <span className={`font-mono text-sm ${role === "premium" ? "text-amber-500" : "text-white"}`}>
                  {role === "premium" ? "PREMIUM" : "FREE"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 border border-neutral-800 p-3">
              <Calendar size={16} className="text-neutral-500" />
              <div>
                <span className="block font-mono text-xs text-neutral-500">MEMBER SINCE</span>
                <span className="font-mono text-sm text-white">{createdAt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
