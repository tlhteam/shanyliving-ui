"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, FileText, Mail, Paperclip, Plus, Search, Send, UserRound, X } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppDialog } from "@/components/app/AppDialog";
import { useApi } from "@/hooks/use-api";
import { useCustomerMutation, useCustomerQuery } from "@/hooks/use-customer";
import { cn } from "@/lib/utils";
import type { AdminUserAccount, CustomerConversation, CustomerConversationMessage } from "@/types/customer";

type ComposeForm = {
  user_id: number | null;
  subject: string;
  body: string;
  files: File[];
};

const emptyCompose: ComposeForm = { user_id: null, subject: "", body: "", files: [] };

function buildMessageFormData(values: { user_id?: number | null; subject?: string; body?: string; files: File[] }) {
  const formData = new FormData();

  if (values.user_id) {
    formData.append("user_id", String(values.user_id));
  }

  if (values.subject?.trim()) {
    formData.append("subject", values.subject.trim());
  }

  if (values.body?.trim()) {
    formData.append("body", values.body.trim());
  }

  values.files.forEach((file) => formData.append("attachments[]", file));

  return formData;
}

function initials(name?: string | null) {
  return name?.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "SL";
}

export default function AdminMessagesPage() {
  const { request, token } = useApi();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [reply, setReply] = useState("");
  const [replyFiles, setReplyFiles] = useState<File[]>([]);
  const [composeOpen, setComposeOpen] = useState(false);
  const [compose, setCompose] = useState<ComposeForm>(emptyCompose);
  const [detailsOpen, setDetailsOpen] = useState(true);

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

  const usersQuery = useQuery({
    queryKey: ["admin", "users", userSearch],
    enabled: Boolean(token) && userSearch.trim().length >= 2,
    queryFn: () => request<AdminUserAccount[]>("/admin/users/search", { query: { search: userSearch, role: "customer" } })
  });

  const createConversation = useCustomerMutation<ComposeForm, CustomerConversation>(
    "messages",
    (values) => ({ path: "/customer/messages", options: { method: "POST", formData: buildMessageFormData(values) } }),
    {
      successMessage: "Conversation created.",
      onSuccess: (conversation) => {
        setSelectedId(conversation.id);
        setCompose(emptyCompose);
        setUserSearch("");
        setComposeOpen(false);
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
      successMessage: "Reply sent.",
      onSuccess: () => {
        setReply("");
        setReplyFiles([]);
        queryClient.invalidateQueries({ queryKey: ["customer", "messages"] });
      }
    }
  );

  const closeCompose = () => {
    setComposeOpen(false);
    setCompose(emptyCompose);
    setUserSearch("");
  };

  const canCreate = Boolean(compose.user_id && compose.subject.trim() && (compose.body.trim() || compose.files.length));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Messages</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Search accounts, start customer conversations, reply, and review attached files.</p>
        </div>
        <AppButton className="gap-2" onClick={() => setComposeOpen(true)}><Plus className="size-4" /> New Conversation</AppButton>
      </div>

      <div className={cn("grid gap-4", detailsOpen ? "xl:grid-cols-[340px_1fr_320px]" : "xl:grid-cols-[340px_1fr]")}>
        <aside className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search conversations..." className="h-10 w-full rounded-md border border-neutral-300 bg-white px-9 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white" />
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
              <div className="flex items-start justify-between gap-3 border-b border-neutral-200 pb-4 dark:border-white/10">
                <div>
                  <p className="font-bold">{selected.subject}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{selected.customer?.name ?? "Customer"} {selected.customer?.email ? `- ${selected.customer.email}` : ""}</p>
                </div>
                <AppButton variant="outline" size="sm" className="gap-2" onClick={() => setDetailsOpen((current) => !current)}>
                  {detailsOpen ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  Details
                </AppButton>
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
                    {replyFiles.map((file) => (
                      <span key={`${file.name}-${file.size}`} className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-950 dark:bg-white/15 dark:text-white">
                        {file.name}
                        <button type="button" onClick={() => setReplyFiles((current) => current.filter((item) => item !== file))}><X className="size-3" /></button>
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="flex gap-2">
                  <label className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-neutral-300 bg-white hover:bg-neutral-100 dark:border-white/15 dark:bg-neutral-950 dark:hover:bg-white/10">
                    <Paperclip className="size-4" />
                    <input type="file" multiple className="sr-only" onChange={(event) => setReplyFiles(Array.from(event.target.files ?? []).slice(0, 8))} />
                  </label>
                  <input value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write a reply..." className="h-10 flex-1 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white" />
                  <AppButton className="h-10 w-10 p-0" disabled={!reply.trim() && replyFiles.length === 0} loading={sendMessage.isPending} onClick={() => sendMessage.mutate({ conversation: selected, body: reply, files: replyFiles })}><Send className="size-4" /></AppButton>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">Select or create a conversation to reply.</div>
          )}
        </section>

        {detailsOpen ? (
          <aside className="h-fit rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900">
            <h2 className="font-serif text-xl font-bold">Conversation Details</h2>
            {selected ? (
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-full bg-neutral-200 text-sm font-bold text-neutral-800 dark:bg-neutral-800 dark:text-white">{initials(selected.customer?.name)}</span>
                  <div className="min-w-0">
                    <p className="truncate font-bold">{selected.customer?.name ?? "Customer"}</p>
                    <p className="truncate text-xs text-neutral-600 dark:text-neutral-400">{selected.customer?.email ?? "No email"}</p>
                  </div>
                </div>
                <div className="border-t border-neutral-200 pt-4 text-sm dark:border-white/10">
                  <p className="flex justify-between gap-3"><span className="font-bold">Status</span><span className="text-neutral-700 dark:text-white">{selected.status}</span></p>
                  <p className="mt-2 flex justify-between gap-3"><span className="font-bold">Messages</span><span>{selected.messages?.length ?? 0}</span></p>
                  <p className="mt-2 flex justify-between gap-3"><span className="font-bold">Last Activity</span><span>{selected.last_message_at ? new Date(selected.last_message_at).toLocaleString() : "None"}</span></p>
                </div>
              </div>
            ) : <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">No conversation selected.</p>}
          </aside>
        ) : null}
      </div>

      <AppDialog
        open={composeOpen}
        onOpenChange={(open) => (open ? setComposeOpen(true) : closeCompose())}
        title="New Customer Conversation"
        description="Search an account by name or email, then send the first message."
        footer={
          <>
            <AppButton variant="outline" onClick={closeCompose}>Cancel</AppButton>
            <AppButton loading={createConversation.isPending} disabled={!canCreate} onClick={() => createConversation.mutate(compose)}>Create Conversation</AppButton>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold">Customer</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
              <input value={userSearch} onChange={(event) => setUserSearch(event.target.value)} placeholder="Search name or email..." className="h-11 w-full rounded-md border border-neutral-300 bg-white px-9 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white" />
            </div>
            <div className="mt-2 max-h-44 space-y-2 overflow-y-auto">
              {(usersQuery.data ?? []).map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    setCompose((current) => ({ ...current, user_id: user.id }));
                    setUserSearch(`${user.name} - ${user.email}`);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md border p-3 text-left text-sm",
                    compose.user_id === user.id ? "border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950" : "border-neutral-200 hover:bg-neutral-50 dark:border-white/10 dark:hover:bg-white/10"
                  )}
                >
                  <UserRound className="size-4" />
                  <span className="min-w-0"><span className="block truncate font-bold">{user.name}</span><span className="block truncate text-xs opacity-70">{user.email}</span></span>
                </button>
              ))}
              {userSearch.trim().length >= 2 && !usersQuery.isLoading && (usersQuery.data ?? []).length === 0 ? <p className="rounded-md border border-dashed border-neutral-300 p-3 text-sm text-neutral-500 dark:border-white/15">No customer found.</p> : null}
            </div>
          </div>
          <input value={compose.subject} onChange={(event) => setCompose((current) => ({ ...current, subject: event.target.value }))} placeholder="Subject" className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white" />
          <textarea value={compose.body} onChange={(event) => setCompose((current) => ({ ...current, body: event.target.value }))} placeholder="Message" className="min-h-32 w-full rounded-md border border-neutral-300 bg-white p-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white" />
          <label className="flex min-h-16 cursor-pointer items-center justify-center rounded-md border border-dashed border-neutral-300 p-3 text-sm font-bold dark:border-white/15">
            <Paperclip className="mr-2 size-4" />
            {compose.files.length ? `${compose.files.length} file(s) selected` : "Attach files"}
            <input type="file" multiple className="sr-only" onChange={(event) => setCompose((current) => ({ ...current, files: Array.from(event.target.files ?? []).slice(0, 8) }))} />
          </label>
          {compose.files.length ? <button type="button" className="text-sm font-bold underline" onClick={() => setCompose((current) => ({ ...current, files: [] }))}>Clear attachments</button> : null}
        </div>
      </AppDialog>
    </div>
  );
}
