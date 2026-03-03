"use server";

import { createClient } from "@/lib/supabase/server";

interface TradeInput {
  ticker: string;
  type: "BUY" | "SELL";
  quantity: number;
  price: number;
}

export async function executeTrade(input: TradeInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const ticker = input.ticker.toUpperCase().trim();
  if (!ticker) return { error: "Ticker is required" };
  if (input.quantity <= 0) return { error: "Quantity must be positive" };
  if (input.price <= 0) return { error: "Price must be positive" };

  const { error } = await supabase.from("transactions").insert({
    user_id: user.id,
    ticker,
    type: input.type,
    quantity: input.quantity,
    price: input.price,
  });

  if (error) return { error: error.message };

  return { success: true };
}
