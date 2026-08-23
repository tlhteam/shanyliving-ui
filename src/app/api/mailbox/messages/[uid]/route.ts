import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { readMessage, resolveFolder } from "@/lib/mailbox";

export async function GET(request: Request, { params }: { params: Promise<{ uid: string }> }) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { uid } = await params;
  const folder = resolveFolder(new URL(request.url).searchParams.get("folder"));

  try {
    const parsedUid = Number(uid);

    if (!Number.isInteger(parsedUid) || parsedUid < 1) {
      return NextResponse.json({ message: "Invalid message id." }, { status: 422 });
    }

    const message = await readMessage(parsedUid, folder);

    if (!message) {
      return NextResponse.json({ message: "Message not found." }, { status: 404 });
    }

    return NextResponse.json({ data: message });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 502 });
  }
}
