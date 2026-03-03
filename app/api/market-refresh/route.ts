import { NextResponse } from "next/server";
import { refreshMarketCache } from "@/actions/market";

export async function POST() {
  try {
    const result = await refreshMarketCache();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
