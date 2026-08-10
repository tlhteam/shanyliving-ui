"use client";

import { useMemo, useState } from "react";
import { FileText, Mail, Paperclip, Search, Send } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { useCustomerMutation, useCustomerQuery } from "@/hooks/use-customer";
import { cn } from "@/lib/utils";
import type { CustomerConversation, CustomerConversationMessage } from "@/types/customer";

function buildMessageFormData(values: { body: string; files: File[] }) {
  const formData = new FormData();

  if (values.body.trim()) {
    formData.append("body", values.body.trim());
  }

  values.files.forEach((file) => formData.append("attachments[]", file));

  return formData;
}

export default function AdminMessagesPage() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [reply, setReply] = useState("");
  const [replyFiles, setReplyFiles] = useState<File[]>([]);
  const conversationsQuery = useCustomerQuery<CustomerConversation[]>("messages", "/customer/messages");
  const conversations = useMemo(() => conversationsQuery.data ?? [], [conversationsQuery.data]);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return conversations;
    }

    return conversations.filter((conversation) => [
      conversation.subject,
      conversation.customer?.name,
      conversation.customer?.email,
      conversation.last_message?.body
    ].some((value) => value?.toLowerCase().includes(term)));
  }, [conversations, search]);
  const selected = conversations.find((conversation) => conversation.id === (selectedId ?? filtered[0]?.id)) ?? filtered[0];
  const sendMessage = useCustomerMutation<{ conversation: CustomerConversation; body: string; files: File[] }, CustomerConversationMessage>(
    "messages",
    ({ conversation, body, files }) => ({
      path: `/customer/messages/${conversation.id}/messages`,
      options: { method: "POST", formData: buildMessageFormData({ body, files }) }
    }),
    {
      successMessage: "Reply sent.",
      onSuccess: () => {
        setReply("");
        setReplyFiles([]);
      }
    }
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Messages</h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Reply to customer conversations and review attached files.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[340px_1fr]">
        <aside className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customers..." className="h-10 w-full rounded-md border border-neutral-300 bg-white px-9 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white" />
          </div>
          <div className="mt-4 space-y-2">
            {filtered.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => setSelectedId(conversation.id)}
                className={cn(
                  "w-full rounded-md border p-3 text-left transition",
                  selected?.id === conversation.id
                    ? "border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950"
                    : "border-neutral-200 bg-white text-neutral-950 hover:bg-neutral-50 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-50 dark:hover:bg-white/10"
                )}
              >
                <p className="truncate text-sm font-bold">{conversation.customer?.name ?? "Customer"}</p>
                <p className="truncate text-xs opacity-70">{conversation.subject}</p>
                <p className="mt-1 truncate text-xs opacity-60">{conversation.last_message?.body ?? "No messages yet"}</p>
              </button>
            ))}
            {!conversationsQuery.isLoading && filtered.length === 0 ? (
              <div className="rounded-md border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500 dark:border-white/15 dark:text-neutral-400">
                <Mail className="mx-auto mb-2 size-5" />
                No conversations found.
              </div>
            ) : null}
          </div>
        </aside>

        <section className="flex min-h-[620px] flex-col rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900">
          {selected ? (
            <>
              <div className="border-b border-neutral-200 pb-4 dark:border-white/10">
                <p className="font-bold">{selected.subject}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{selected.customer?.name ?? "Customer"} {selected.customer?.email ? `- ${selected.customer.email}` : ""}</p>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto py-4">
                {(selected.messages ?? []).map((message) => {
                  const mine = message.user_id !== selected.customer?.id;

                  return (
                    <div key={message.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                      <div className={cn("max-w-[78%] rounded-lg p-3 text-sm", mine ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950" : "bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-neutral-50")}>
                        <p className="text-xs font-bold opacity-70">{mine ? "Team" : (message.author_name ?? "Customer")}</p>
                        {message.body ? <p className="mt-1 whitespace-pre-wrap">{message.body}</p> : null}
                        {message.attachments?.length ? (
                          <div className="mt-3 space-y-2">
                            {message.attachments.map((attachment) => (
                              <a key={attachment.id} href={attachment.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-md border border-current/20 px-2 py-1 text-xs underline-offset-2 hover:underline">
                                <FileText className="size-3" />
                                <span className="truncate">{attachment.name}</span>
                              </a>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-neutral-200 pt-3 dark:border-white/10">
                {replyFiles.length ? (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {replyFiles.map((file) => <span key={`${file.name}-${file.size}`} className="rounded-full bg-neutral-100 px-3 py-1 text-xs dark:bg-neutral-800">{file.name}</span>)}
                  </div>
                ) : null}
                <div className="flex gap-2">
                  <label className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-neutral-300 bg-white hover:bg-neutral-100 dark:border-white/15 dark:bg-neutral-950 dark:hover:bg-white/10">
                    <Paperclip className="size-4" />
                    <input type="file" multiple className="sr-only" onChange={(event) => setReplyFiles(Array.from(event.target.files ?? []))} />
                  </label>
                  <input value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write a reply..." className="h-10 flex-1 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white" />
                  <AppButton className="h-10 w-10 p-0" disabled={!reply.trim() && replyFiles.length === 0} loading={sendMessage.isPending} onClick={() => sendMessage.mutate({ conversation: selected, body: reply, files: replyFiles })}><Send className="size-4" /></AppButton>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">Select a conversation to reply.</div>
          )}
        </section>
      </div>
    </div>
  );
}
