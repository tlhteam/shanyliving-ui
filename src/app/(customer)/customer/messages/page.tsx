"use client";

import { FileText, Mail, Paperclip, Plus, Search, Send, X } from "lucide-react";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppDialog } from "@/components/app/AppDialog";
import { CustomerTopbar } from "@/components/customer/CustomerShell";
import { useCustomerMutation, useCustomerQuery } from "@/hooks/use-customer";
import type { CustomerConversation, CustomerConversationMessage } from "@/types/customer";

type ComposeForm = {
  subject: string;
  body: string;
  files: File[];
};

const emptyCompose: ComposeForm = { subject: "", body: "", files: [] };

function initials(name?: string | null) {
  return name?.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "SL";
}

function buildMessageFormData(values: { subject?: string; body?: string; files: File[] }) {
  const formData = new FormData();

  if (values.subject) {
    formData.append("subject", values.subject);
  }

  if (values.body) {
    formData.append("body", values.body);
  }

  values.files.forEach((file) => formData.append("attachments[]", file));

  return formData;
}

export default function MessagesPage() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [compose, setCompose] = useState<ComposeForm>(emptyCompose);
  const [reply, setReply] = useState("");
  const [replyFiles, setReplyFiles] = useState<File[]>([]);

  const conversationsQuery = useCustomerQuery<CustomerConversation[]>("messages", "/customer/messages");
  const conversations = useMemo(() => conversationsQuery.data ?? [], [conversationsQuery.data]);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return conversations.filter((item) => `${item.subject} ${item.last_message?.body ?? ""}`.toLowerCase().includes(term));
  }, [conversations, search]);
  const selected = filtered.find((item) => item.id === selectedId) ?? filtered[0];

  const createConversation = useCustomerMutation<ComposeForm, CustomerConversation>(
    "messages",
    (values) => ({ path: "/customer/messages", options: { method: "POST", formData: buildMessageFormData(values) } }),
    {
      successMessage: "Conversation created.",
      onSuccess: (conversation) => {
        setSelectedId(conversation.id);
        setComposeOpen(false);
        setCompose(emptyCompose);
      }
    }
  );

  const sendMessage = useCustomerMutation<{ conversation: CustomerConversation; body: string; files: File[] }, CustomerConversationMessage>(
    "messages",
    ({ conversation, body, files }) => ({
      path: `/customer/messages/${conversation.id}/messages`,
      options: { method: "POST", formData: buildMessageFormData({ body, files }) }
    }),
    {
      successMessage: "Message sent.",
      onSuccess: () => {
        setReply("");
        setReplyFiles([]);
      }
    }
  );

  const updateFiles = (files: FileList | null, next: (files: File[]) => void) => {
    next(Array.from(files ?? []).slice(0, 8));
  };

  return (
    <>
      <CustomerTopbar title="Messages" subtitle="Chat with our team and get updates about your orders and designs." />
      <div className="grid gap-5 xl:grid-cols-[320px_1fr_280px]">
        <AppCard className="p-4">
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search messages..." className="h-10 w-full rounded-md border border-neutral-300 bg-white px-9 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:focus:border-white" />
            </div>
            <AppButton variant="outline" className="h-10 w-10 p-0" onClick={() => setComposeOpen(true)}><Plus className="size-4" /></AppButton>
          </div>
          <div className="mt-4 space-y-1">
            {conversationsQuery.isLoading ? <div className="h-20 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" /> : null}
            {!conversationsQuery.isLoading && filtered.length === 0 ? (
              <div className="grid place-items-center gap-3 rounded-lg border border-neutral-200 p-8 text-center dark:border-white/10">
                <Mail className="size-7 text-neutral-400" />
                <p className="text-sm text-neutral-600 dark:text-neutral-400">No conversations yet.</p>
              </div>
            ) : null}
            {filtered.map((item) => (
              <button key={item.id} onClick={() => setSelectedId(item.id)} className={`flex w-full items-center gap-3 rounded-lg p-3 text-start transition ${selected?.id === item.id ? "bg-neutral-100 dark:bg-white/10" : "hover:bg-neutral-50 dark:hover:bg-white/5"}`}>
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-neutral-200 text-xs font-bold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">{initials(item.assigned_user?.name ?? item.customer?.name)}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{item.subject}</p>
                  <p className="truncate text-xs text-neutral-600 dark:text-neutral-400">{item.last_message?.body ?? "No messages yet"}</p>
                </div>
              </button>
            ))}
          </div>
          <AppButton variant="outline" className="mt-5 w-full gap-2" onClick={() => setComposeOpen(true)}><Plus className="size-4" /> New Conversation</AppButton>
        </AppCard>

        <AppCard className="flex min-h-120 flex-col p-4">
          <div className="flex items-center gap-3 border-b border-neutral-200 pb-4 dark:border-white/10">
            <div className="grid size-11 place-items-center rounded-full bg-neutral-200 text-sm font-bold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">{initials(selected?.assigned_user?.name ?? selected?.customer?.name)}</div>
            <div>
              <p className="font-bold">{selected?.subject ?? "Shany Living Team"}</p>
              <p className="text-xs text-green-700">{selected ? selected.status : "Ready to help"}</p>
            </div>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto py-5 text-sm">
            {selected?.messages?.length ? selected.messages.map((message) => (
              <div key={message.id} className="max-w-xl rounded-lg bg-neutral-100 p-3 dark:bg-neutral-800">
                <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400">{message.author_name ?? "Shany Living Team"}</p>
                {message.body ? <p className="mt-1">{message.body}</p> : null}
                {message.attachments?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.attachments.map((attachment) => (
                      <a key={attachment.id} href={attachment.url} target="_blank" className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs font-bold dark:border-white/10 dark:bg-neutral-950">
                        <FileText className="size-4" /> {attachment.name}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            )) : <p className="max-w-xs rounded-lg bg-neutral-100 p-3 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">Messages from the team will appear here.</p>}
          </div>
          <div className="border-t border-neutral-200 pt-4 dark:border-white/10">
            {replyFiles.length ? (
              <div className="mb-3 flex flex-wrap gap-2">
                {replyFiles.map((file) => <span key={`${file.name}-${file.size}`} className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold dark:bg-neutral-800">{file.name}</span>)}
              </div>
            ) : null}
            <div className="flex gap-2">
              <label className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-neutral-300 bg-white dark:border-white/15 dark:bg-neutral-950">
                <Paperclip className="size-4" />
                <input type="file" multiple className="sr-only" onChange={(event) => updateFiles(event.target.files, setReplyFiles)} />
              </label>
              <input value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Type your message..." disabled={!selected} className="h-10 min-w-0 flex-1 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none disabled:bg-neutral-50 dark:border-white/15 dark:bg-neutral-950 dark:disabled:bg-neutral-900" />
              <AppButton className="h-10 w-10 p-0" disabled={!selected || (!reply.trim() && replyFiles.length === 0)} loading={sendMessage.isPending} onClick={() => selected && sendMessage.mutate({ conversation: selected, body: reply, files: replyFiles })}><Send className="size-4" /></AppButton>
            </div>
          </div>
        </AppCard>

        <AppCard className="h-fit p-5">
          <h2 className="font-serif text-xl font-bold">Conversation Details</h2>
          <div className="mt-4 flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-full bg-neutral-200 text-sm font-bold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">{initials(selected?.customer?.name)}</div>
            <div><p className="font-bold">{selected?.customer?.name ?? "Shany Living Team"}</p><p className="text-xs text-neutral-600 dark:text-neutral-400">{selected?.customer?.email ?? "support@shanyliving.com"}</p></div>
          </div>
          <div className="mt-6 space-y-3 border-t border-neutral-200 pt-5 text-sm dark:border-white/10">
            {["View Order Details", "Track Delivery", "Request Consultation", "Help Center"].map((action) => <p key={action} className="flex justify-between font-semibold">{action}<span>{">"}</span></p>)}
          </div>
        </AppCard>
      </div>

      <AppDialog
        open={composeOpen}
        onOpenChange={setComposeOpen}
        title="New Conversation"
        description="Send a message to the Shany Living team. You can attach multiple files."
        footer={
          <>
            <AppButton variant="outline" onClick={() => setComposeOpen(false)}>Cancel</AppButton>
            <AppButton loading={createConversation.isPending} disabled={!compose.subject.trim() || (!compose.body.trim() && compose.files.length === 0)} onClick={() => createConversation.mutate(compose)}>Create Conversation</AppButton>
          </>
        }
      >
        <div className="space-y-4">
          <input value={compose.subject} onChange={(event) => setCompose((current) => ({ ...current, subject: event.target.value }))} placeholder="Subject" className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:focus:border-white" />
          <textarea value={compose.body} onChange={(event) => setCompose((current) => ({ ...current, body: event.target.value }))} placeholder="Message" className="min-h-32 w-full rounded-md border border-neutral-300 bg-white p-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:focus:border-white" />
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-neutral-300 p-5 text-sm font-bold dark:border-white/15">
            <Paperclip className="size-4" /> Attach files
            <input type="file" multiple className="sr-only" onChange={(event) => updateFiles(event.target.files, (files) => setCompose((current) => ({ ...current, files })))} />
          </label>
          {compose.files.length ? (
            <div className="flex flex-wrap gap-2">
              {compose.files.map((file) => (
                <span key={`${file.name}-${file.size}`} className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold dark:bg-neutral-800">
                  {file.name}
                  <button type="button" onClick={() => setCompose((current) => ({ ...current, files: current.files.filter((item) => item !== file) }))}><X className="size-3" /></button>
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </AppDialog>
    </>
  );
}
