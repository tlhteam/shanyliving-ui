import { NextResponse } from "next/server";
import { getStorefrontCategories } from "@/lib/storefront-categories";

export async function GET() {
  return NextResponse.json({ data: await getStorefrontCategories() });
}
