"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Mail, MailOpen, RefreshCcw, Send, X } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type MailboxSummary = {
  uid: number;
  messageId: string | null;
  subject: string;
  from: string;
  fromAddress: string;
  to: string;
  date: string | null;
  seen: boolean;
};

type MailboxMessage = MailboxSummary & {
  html: string | null;
  text: string;
  references: string[];
};

const folders = ["INBOX", "Sent", "Drafts", "Junk", "Trash"] as const;

type Folder = (typeof folders)[number];

const fieldClass =
  "h-11 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none transition focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:focus:border-white";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) } });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message ?? "The request failed.");
  }

  return payload?.data as T;
}

export function AdminMailbox() {
  const t = useTranslations("adminPanel.mailbox");
  const locale = useLocale();
  const queryClient = useQueryClient();
  const [folder, setFolder] = useState<Folder>("INBOX");
  const [selected, setSelected] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [composing, setComposing] = useState(false);
  const [compose, setCompose] = useState({ to: "", subject: "", text: "" });

  const listQuery = useQuery({
    queryKey: ["admin-mailbox", folder],
    queryFn: () => fetchJson<MailboxSummary[]>(`/api/mailbox/messages?folder=${folder}&limit=40`)
  });

  const messageQuery = useQuery({
    queryKey: ["admin-mailbox-message", folder, selected],
    enabled: selected !== null,
    queryFn: () => fetchJson<MailboxMessage>(`/api/mailbox/messages/${selected}?folder=${folder}`)
  });

  const sendMutation = useMutation({
    mutationFn: (body: { to: string; subject: string; text: string; inReplyTo?: string | null; references?: string[] }) =>
      fetchJson<{ messageId: string }>("/api/mailbox/send", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: () => {
      toast.success(t("sent"));
      setReplyBody("");
      setComposing(false);
      setCompose({ to: "", subject: "", text: "" });
      queryClient.invalidateQueries({ queryKey: ["admin-mailbox"] });
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const messages = useMemo(() => {
    const rows = listQuery.data ?? [];
    const needle = search.trim().toLowerCase();

    if (!needle) {
      return rows;
    }

    return rows.filter((row) => `${row.subject} ${row.from} ${row.to}`.toLowerCase().includes(needle));
  }, [listQuery.data, search]);

  const message = messageQuery.data;
  const listError = listQuery.error as Error | null;

  return (
    <>
      <AdminPageHeader eyebrow={t("eyebrow")} title={t("title")} description={t("subtitle")} action={t("compose")} onAction={() => setComposing(true)} />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {folders.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setFolder(item);
              setSelected(null);
            }}
            className={cn(
              "h-9 rounded-full border px-4 text-xs font-bold transition",
              folder === item
                ? "border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950"
                : "border-neutral-300 hover:border-neutral-950 dark:border-white/15"
            )}
          >
            {t(`folders.${item}`)}
          </button>
        ))}
        <div className="ms-auto flex items-center gap-2">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("search")} className={cn(fieldClass, "h-9 w-full sm:w-64")} />
          <AppButton type="button" size="sm" variant="outline" className="gap-2" onClick={() => listQuery.refetch()}>
            <RefreshCcw className="size-4" /> {t("refresh")}
          </AppButton>
        </div>
      </div>

      {listError ? (
        <AppCard className="mb-4 border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100">
          {listError.message.includes("MAIL_USER") ? t("notConfigured") : listError.message}
        </AppCard>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[380px_1fr]">
        <AppCard className="overflow-hidden p-0">
          {listQuery.isLoading ? (
            <p className="p-6 text-sm text-neutral-500 dark:text-neutral-400">{t("loading")}</p>
          ) : messages.length === 0 ? (
            <p className="p-6 text-sm text-neutral-500 dark:text-neutral-400">{t("empty")}</p>
          ) : (
            <ul className="divide-y divide-neutral-200 dark:divide-white/10">
              {messages.map((row) => (
                <li key={row.uid}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(row.uid);
                      setReplyBody("");
                    }}
                    className={cn(
                      "flex w-full items-start gap-3 p-4 text-start transition hover:bg-neutral-50 dark:hover:bg-white/5",
                      selected === row.uid && "bg-neutral-100 dark:bg-white/10"
                    )}
                  >
                    {row.seen ? <MailOpen className="mt-0.5 size-4 shrink-0 text-neutral-400" /> : <Mail className="mt-0.5 size-4 shrink-0 text-neutral-900 dark:text-white" />}
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className={cn("truncate text-sm", row.seen ? "font-medium" : "font-bold")}>{row.from || row.fromAddress}</span>
                        <span className="shrink-0 text-[11px] text-neutral-500 dark:text-neutral-400">{formatDate(row.date, locale)}</span>
                      </span>
                      <span className={cn("mt-0.5 block truncate text-sm", row.seen ? "text-neutral-600 dark:text-neutral-400" : "font-semibold")}>
                        {row.subject || t("subject")}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </AppCard>

        <AppCard className="p-5">
          {selected === null ? (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{t("selectPrompt")}</p>
          ) : messageQuery.isLoading ? (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{t("loading")}</p>
          ) : message ? (
            <>
              <h2 className="font-serif text-xl font-bold sm:text-2xl">{message.subject || t("subject")}</h2>
              <dl className="mt-3 grid gap-1 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex gap-2">
                  <dt className="font-bold">{t("from")}:</dt>
                  <dd className="min-w-0 truncate">{message.from}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-bold">{t("to")}:</dt>
                  <dd className="min-w-0 truncate">{message.to}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-bold">{t("date")}:</dt>
                  <dd>{formatDate(message.date, locale)}</dd>
                </div>
              </dl>

              <div className="mt-5 max-h-96 overflow-y-auto whitespace-pre-wrap rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm leading-6 dark:border-white/10 dark:bg-white/5">
                {message.text || "-"}
              </div>

              <div className="mt-5">
                <label htmlFor="mailbox-reply" className="mb-2 block text-sm font-semibold">{t("reply")}</label>
                <textarea
                  id="mailbox-reply"
                  value={replyBody}
                  onChange={(event) => setReplyBody(event.target.value)}
                  placeholder={t("replyPlaceholder")}
                  rows={5}
                  className="w-full rounded-md border border-neutral-300 p-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:focus:border-white"
                />
                <AppButton
                  type="button"
                  className="mt-3 gap-2"
                  loading={sendMutation.isPending}
                  disabled={!replyBody.trim() || !message.fromAddress}
                  onClick={() =>
                    sendMutation.mutate({
                      to: message.fromAddress,
                      subject: /^re:/i.test(message.subject) ? message.subject : `Re: ${message.subject}`,
                      text: replyBody,
                      inReplyTo: message.messageId,
                      references: [...message.references, message.messageId].filter((value): value is string => Boolean(value))
                    })
                  }
                >
                  <Send className="size-4" /> {sendMutation.isPending ? t("sending") : t("send")}
                </AppButton>
              </div>
            </>
          ) : (
            <p className="text-sm text-red-600">{(messageQuery.error as Error)?.message ?? t("failed")}</p>
          )}
        </AppCard>
      </div>

      {composing ? (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-black/50 p-4" role="dialog" aria-modal>
          <AppCard className="w-full max-w-xl p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-serif text-xl font-bold">{t("compose")}</h2>
              <button type="button" aria-label={t("cancel")} onClick={() => setComposing(false)} className="grid size-8 place-items-center rounded-md text-neutral-500 transition hover:bg-neutral-100 dark:hover:bg-white/10">
                <X className="size-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <input value={compose.to} onChange={(event) => setCompose((current) => ({ ...current, to: event.target.value }))} placeholder={t("composeTo")} className={fieldClass} />
              <input value={compose.subject} onChange={(event) => setCompose((current) => ({ ...current, subject: event.target.value }))} placeholder={t("composeSubject")} className={fieldClass} />
              <textarea
                value={compose.text}
                onChange={(event) => setCompose((current) => ({ ...current, text: event.target.value }))}
                placeholder={t("composeBody")}
                rows={6}
                className="w-full rounded-md border border-neutral-300 p-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:focus:border-white"
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <AppButton type="button" variant="outline" onClick={() => setComposing(false)}>{t("cancel")}</AppButton>
              <AppButton
                type="button"
                className="gap-2"
                loading={sendMutation.isPending}
                disabled={!compose.to.trim() || !compose.subject.trim() || !compose.text.trim()}
                onClick={() => sendMutation.mutate(compose)}
              >
                <Send className="size-4" /> {t("send")}
              </AppButton>
            </div>
          </AppCard>
        </div>
      ) : null}
    </>
  );
}
