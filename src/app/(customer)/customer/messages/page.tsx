"use client";

import { Mail, Paperclip, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { CustomerTopbar } from "@/components/customer/CustomerShell";
import { useCustomerQuery } from "@/hooks/use-customer";
import type { CustomerMessage } from "@/types/customer";

export default function MessagesPage() {
  const [search, setSearch] = useState("");
  const messagesQuery = useCustomerQuery<CustomerMessage[]>("messages", "/customer/messages");
  const filtered = useMemo(
    () => (messagesQuery.data ?? []).filter((item) => `${item.name ?? item.title ?? ""} ${item.message ?? ""}`.toLowerCase().includes(search.trim().toLowerCase())),
    [messagesQuery.data, search]
  );
  const selected = filtered[0];

  return (
    <>
      <CustomerTopbar title="Messages" subtitle="Chat with our team and get updates about your orders and designs." />
      <div className="grid gap-5 xl:grid-cols-[300px_1fr_280px]">
        <AppCard className="p-4">
          <div className="flex gap-2">
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search messages..." className="h-10 min-w-0 flex-1 rounded-md border border-neutral-300 px-3 text-sm" />
            <AppButton variant="outline" className="h-10 w-10 p-0">Filter</AppButton>
          </div>
          <div className="mt-4 space-y-1">
            {messagesQuery.isLoading ? <div className="h-20 animate-pulse rounded-lg bg-neutral-200" /> : null}
            {!messagesQuery.isLoading && filtered.length === 0 ? (
              <div className="grid place-items-center gap-3 rounded-lg border border-neutral-200 p-8 text-center">
                <Mail className="size-7 text-neutral-400" />
                <p className="text-sm text-neutral-600">No conversations yet.</p>
              </div>
            ) : null}
            {filtered.map((item, index) => (
              <button key={item.id} className={`flex w-full items-center gap-3 rounded-lg p-3 text-start transition ${index === 0 ? "bg-neutral-100" : "hover:bg-neutral-50"}`}>
                <div className="size-10 rounded-full bg-neutral-200" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{item.name ?? item.title ?? "Shany Living Team"}</p>
                  <p className="truncate text-xs text-neutral-600">{item.message ?? "No message preview"}</p>
                </div>
                <span className="text-[11px] text-neutral-500">{item.time ?? ""}</span>
              </button>
            ))}
          </div>
          <AppButton variant="outline" className="mt-5 w-full" disabled>Start a New Conversation</AppButton>
        </AppCard>
        <AppCard className="flex min-h-120 flex-col p-4">
          <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
            <div className="size-11 rounded-full bg-neutral-200" />
            <div>
              <p className="font-bold">{selected?.name ?? selected?.title ?? "Shany Living Team"}</p>
              <p className="text-xs text-green-700">{selected ? "Online" : "Ready to help"}</p>
            </div>
          </div>
          <div className="flex-1 space-y-4 py-5 text-sm">
            {selected ? (
              <p className="max-w-xs rounded-lg bg-neutral-100 p-3">{selected.message}</p>
            ) : (
              <p className="max-w-xs rounded-lg bg-neutral-100 p-3">Messages from the team will appear here.</p>
            )}
          </div>
          <div className="flex gap-2 border-t border-neutral-200 pt-4">
            <AppButton variant="outline" className="h-10 w-10 p-0" disabled><Paperclip className="size-4" /></AppButton>
            <input placeholder="Type your message..." disabled className="h-10 min-w-0 flex-1 rounded-md border border-neutral-300 px-3 text-sm disabled:bg-neutral-50" />
            <AppButton className="h-10 w-10 p-0" disabled><Send className="size-4" /></AppButton>
          </div>
        </AppCard>
        <AppCard className="h-fit p-5">
          <h2 className="font-serif text-xl font-bold">Conversation Details</h2>
          <div className="mt-4 flex items-center gap-3">
            <div className="size-12 rounded-full bg-neutral-200" />
            <div><p className="font-bold">{selected?.name ?? "Shany Living Team"}</p><p className="text-xs text-neutral-600">support@shanyliving.com</p></div>
          </div>
          <div className="mt-6 space-y-3 border-t border-neutral-200 pt-5 text-sm">
            {["View Order Details", "Track Delivery", "Request Consultation", "Help Center"].map((action) => <p key={action} className="flex justify-between font-semibold">{action}<span>{">"}</span></p>)}
          </div>
        </AppCard>
      </div>
    </>
  );
}
