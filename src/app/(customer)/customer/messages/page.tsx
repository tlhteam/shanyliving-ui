import { Paperclip, Send } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppImage } from "@/components/app/AppImage";
import { CustomerTopbar } from "@/components/customer/CustomerShell";
import { conversations, customerOrders } from "@/lib/customer-panel";

export default function MessagesPage() {
  return (
    <>
      <CustomerTopbar title="Messages" subtitle="Chat with our team and get updates about your orders and designs." />
      <div className="grid gap-5 xl:grid-cols-[300px_1fr_280px]">
        <AppCard className="p-4">
          <div className="flex gap-2">
            <input placeholder="Search messages..." className="h-10 min-w-0 flex-1 rounded-md border border-neutral-300 px-3 text-sm" />
            <AppButton variant="outline" className="h-10 w-10 p-0">☰</AppButton>
          </div>
          <div className="mt-4 space-y-1">
            {conversations.map((item, index) => (
              <button key={item.id} className={`flex w-full items-center gap-3 rounded-lg p-3 text-start transition ${index === 0 ? "bg-neutral-100" : "hover:bg-neutral-50"}`}>
                <div className="size-10 rounded-full bg-neutral-200" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{item.name}</p>
                  <p className="truncate text-xs text-neutral-600">{item.message}</p>
                </div>
                <span className="text-[11px] text-neutral-500">{item.time}</span>
              </button>
            ))}
          </div>
          <AppButton variant="outline" className="mt-5 w-full">Start a New Conversation</AppButton>
        </AppCard>
        <AppCard className="flex min-h-120 flex-col p-4">
          <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
            <div className="size-11 rounded-full bg-neutral-200" />
            <div>
              <p className="font-bold">Shany Living Team</p>
              <p className="text-xs text-green-700">Online</p>
            </div>
          </div>
          <div className="flex-1 space-y-4 py-5 text-sm">
            <p className="max-w-xs rounded-lg bg-neutral-100 p-3">Hi David! Your order #SL12345 is now in production.</p>
            <p className="ms-auto max-w-xs rounded-lg bg-black p-3 text-white">Great! Can you share the estimated delivery date?</p>
            <p className="max-w-xs rounded-lg bg-neutral-100 p-3">Sure! The estimated delivery date is August 30, 2026.</p>
            <p className="ms-auto max-w-xs rounded-lg bg-black p-3 text-white">Perfect, thank you!</p>
            <p className="max-w-xs rounded-lg bg-neutral-100 p-3">You are welcome. We will keep you updated along the way.</p>
          </div>
          <div className="flex gap-2 border-t border-neutral-200 pt-4">
            <AppButton variant="outline" className="h-10 w-10 p-0"><Paperclip className="size-4" /></AppButton>
            <input placeholder="Type your message..." className="h-10 min-w-0 flex-1 rounded-md border border-neutral-300 px-3 text-sm" />
            <AppButton className="h-10 w-10 p-0"><Send className="size-4" /></AppButton>
          </div>
        </AppCard>
        <AppCard className="h-fit p-5">
          <h2 className="font-serif text-xl font-bold">Conversation Details</h2>
          <div className="mt-4 flex items-center gap-3">
            <div className="size-12 rounded-full bg-neutral-200" />
            <div><p className="font-bold">Shany Living Team</p><p className="text-xs text-neutral-600">support@shanyliving.com</p></div>
          </div>
          <AppButton variant="outline" className="mt-5 w-full">View Team Profile</AppButton>
          <div className="mt-6 border-t border-neutral-200 pt-5">
            <h3 className="font-bold">Related Order</h3>
            <div className="mt-3 flex gap-3">
              <AppImage src={customerOrders[0].image} alt={customerOrders[0].title} className="size-16 rounded-lg" sizes="64px" />
              <div><p className="font-bold">{customerOrders[0].title}</p><p className="text-xs text-neutral-600">Order #{customerOrders[0].id}</p></div>
            </div>
          </div>
          <div className="mt-6 space-y-3 border-t border-neutral-200 pt-5 text-sm">
            {["View Order Details", "Track Delivery", "Request Consultation", "Return / Exchange", "Help Center"].map((action) => <p key={action} className="flex justify-between font-semibold">{action}<span>›</span></p>)}
          </div>
        </AppCard>
      </div>
    </>
  );
}
