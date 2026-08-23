import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/auth";
import { sendMessage } from "@/lib/mailbox";

const schema = z.object({
  to: z.string().min(3).email(),
  subject: z.string().min(1).max(255),
  text: z.string().min(1),
  inReplyTo: z.string().nullish(),
  references: z.array(z.string()).optional()
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload.", errors: parsed.error.issues }, { status: 422 });
  }

  try {
    return NextResponse.json({ data: await sendMessage(parsed.data) });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 502 });
  }
}
