import { NextResponse } from "next/server";
import { getCatalogProducts } from "@/lib/storefront-products";

export async function GET(request: Request) {
  const limit = Math.min(Math.max(Number(new URL(request.url).searchParams.get("limit") ?? 48), 1), 96);

  return NextResponse.json({ data: await getCatalogProducts(limit) });
}
