import "server-only";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import nodemailer from "nodemailer";

export type MailboxSummary = {
  uid: number;
  messageId: string | null;
  subject: string;
  from: string;
  fromAddress: string;
  to: string;
  date: string | null;
  seen: boolean;
};

export type MailboxMessage = MailboxSummary & {
  html: string | null;
  text: string;
  references: string[];
};

export const mailboxFolders = ["INBOX", "Sent", "Drafts", "Junk", "Trash"] as const;

export type MailboxFolder = (typeof mailboxFolders)[number];

export function resolveFolder(value?: string | null): MailboxFolder {
  return mailboxFolders.find((folder) => folder === value) ?? "INBOX";
}

const truthy = (value?: string) => value === undefined || value === "true" || value === "1";

function credentials() {
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASSWORD;

  if (!user || !pass) {
    throw new Error("Mailbox credentials are not configured. Set MAIL_USER and MAIL_PASSWORD.");
  }

  return { user, pass };
}

function imapClient() {
  const { user, pass } = credentials();

  return new ImapFlow({
    host: process.env.MAIL_IMAP_HOST ?? "imap.hostinger.com",
    port: Number(process.env.MAIL_IMAP_PORT ?? 993),
    secure: truthy(process.env.MAIL_IMAP_SECURE),
    auth: { user, pass },
    logger: false
  });
}

function smtpTransport() {
  const { user, pass } = credentials();

  return nodemailer.createTransport({
    host: process.env.MAIL_SMTP_HOST ?? "smtp.hostinger.com",
    port: Number(process.env.MAIL_SMTP_PORT ?? 465),
    secure: truthy(process.env.MAIL_SMTP_SECURE),
    auth: { user, pass }
  });
}

function addressText(value: unknown): string {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  const record = value as { text?: string; value?: Array<{ name?: string; address?: string }> };

  if (record.text) {
    return record.text;
  }

  return (record.value ?? [])
    .map((entry) => entry.name || entry.address || "")
    .filter(Boolean)
    .join(", ");
}

function firstAddress(value: unknown): string {
  const record = value as { value?: Array<{ address?: string }> } | undefined;

  return record?.value?.[0]?.address ?? "";
}

function htmlToText(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|tr|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function listMessages(folder: MailboxFolder = "INBOX", limit = 25): Promise<MailboxSummary[]> {
  const client = imapClient();
  await client.connect();

  try {
    const lock = await client.getMailboxLock(folder);

    try {
      const status = client.mailbox;
      const total = typeof status === "object" && status ? status.exists : 0;

      if (!total) {
        return [];
      }

      const start = Math.max(1, total - limit + 1);
      const summaries: MailboxSummary[] = [];

      for await (const message of client.fetch(`${start}:*`, { envelope: true, flags: true, uid: true })) {
        const envelope = message.envelope;

        summaries.push({
          uid: message.uid,
          messageId: envelope?.messageId ?? null,
          subject: envelope?.subject ?? "",
          from: addressText(envelope?.from ? { value: envelope.from } : null),
          fromAddress: firstAddress(envelope?.from ? { value: envelope.from } : null),
          to: addressText(envelope?.to ? { value: envelope.to } : null),
          date: envelope?.date ? new Date(envelope.date).toISOString() : null,
          seen: Boolean(message.flags?.has("\\Seen"))
        });
      }

      return summaries.reverse();
    } finally {
      lock.release();
    }
  } finally {
    await client.logout().catch(() => undefined);
  }
}

export async function readMessage(uid: number, folder: MailboxFolder = "INBOX"): Promise<MailboxMessage | null> {
  const client = imapClient();
  await client.connect();

  try {
    const lock = await client.getMailboxLock(folder);

    try {
      const downloaded = await client.download(String(uid), undefined, { uid: true });

      if (!downloaded?.content) {
        return null;
      }

      const parsed = await simpleParser(downloaded.content);
      await client.messageFlagsAdd(String(uid), ["\\Seen"], { uid: true }).catch(() => undefined);

      return {
        uid,
        messageId: parsed.messageId ?? null,
        subject: parsed.subject ?? "",
        from: addressText(parsed.from),
        fromAddress: firstAddress(parsed.from),
        to: addressText(parsed.to),
        date: parsed.date ? parsed.date.toISOString() : null,
        seen: true,
        html: typeof parsed.html === "string" ? parsed.html : null,
        text: parsed.text?.trim() || htmlToText(parsed.html),
        references: Array.isArray(parsed.references) ? parsed.references : parsed.references ? [parsed.references] : []
      };
    } finally {
      lock.release();
    }
  } finally {
    await client.logout().catch(() => undefined);
  }
}

export type SendPayload = {
  to: string;
  subject: string;
  text: string;
  inReplyTo?: string | null;
  references?: string[];
};

export async function sendMessage(payload: SendPayload) {
  const { user } = credentials();
  const transport = smtpTransport();

  const info = await transport.sendMail({
    from: process.env.MAIL_FROM ?? user,
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
    inReplyTo: payload.inReplyTo ?? undefined,
    references: payload.references?.length ? payload.references : undefined
  });

  return { messageId: info.messageId };
}
