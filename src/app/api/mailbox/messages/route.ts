import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { listMessages, resolveFolder } from "@/lib/mailbox";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const url = new URL(request.url);
  const folder = resolveFolder(url.searchParams.get("folder"));
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 25), 1), 100);

  try {
    return NextResponse.json({ data: await listMessages(folder, limit) });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 502 });
  }
}
