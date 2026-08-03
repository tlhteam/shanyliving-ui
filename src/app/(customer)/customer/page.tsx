import Link from "next/link";
import { ChevronRight, Heart, Mail, Package, Sofa } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppImage } from "@/components/app/AppImage";
import { conversations, customerOrders, savedDesigns, wishlistItems } from "@/lib/customer-panel";

const stats = [
  { label: "Active Orders", value: "1", text: "View your ongoing order", icon: Package, href: "/customer/orders" },
  { label: "Saved Designs", value: "3", text: "Continue customizing", icon: Sofa, href: "/customer/saved-designs" },
  { label: "Wishlist", value: "12", text: "View your favorites", icon: Heart, href: "/customer/wishlist" },
  { label: "Messages", value: "2", text: "Unread messages", icon: Mail, href: "/customer/messages" }
];

export default function CustomerDashboardPage() {
  const activeOrder = customerOrders[0];

  return (
    <>
      <div className="mb-7">
        <p className="text-sm font-semibold text-neutral-600">Welcome back,</p>
        <h1 className="font-serif text-4xl font-bold">David <span aria-hidden>👋</span></h1>
        <p className="mt-2 text-sm text-neutral-600">Here is what is happening with your account.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <AppCard className="p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-neutral-600">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                </div>
                <span className="grid size-10 place-items-center rounded-full bg-neutral-100"><stat.icon className="size-5" /></span>
              </div>
              <p className="mt-4 flex items-center justify-between text-xs text-neutral-700">{stat.text}<ChevronRight className="size-4" /></p>
            </AppCard>
          </Link>
        ))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <AppCard className="p-5">
          <h2 className="font-bold">Active Order</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-[180px_1fr]">
            <AppImage src={activeOrder.image} alt={activeOrder.title} className="aspect-[1.45/1] rounded-lg" sizes="180px" />
            <div>
              <h3 className="font-serif text-2xl font-bold">{activeOrder.title}</h3>
              <p className="mt-1 text-xs text-neutral-600">Order #{activeOrder.id} · {activeOrder.status}</p>
              <div className="mt-5 grid grid-cols-4 gap-2 text-center text-[11px]">
                {["Confirmed", "Production", "Quality", "Ship"].map((step, index) => (
                  <div key={step} className="relative">
                    <span className={`mx-auto grid size-7 place-items-center rounded-full ${index < 2 ? "bg-black text-white" : "border border-neutral-300 bg-white"}`}>{index < 2 ? "✓" : ""}</span>
                    <p className="mt-2 font-semibold">{step}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-xs font-bold">Estimated delivery<br /><span className="text-neutral-600">August 30, 2026</span></p>
                <Link href="/customer/orders"><AppButton size="sm">View Order Details</AppButton></Link>
              </div>
            </div>
          </div>
        </AppCard>
        <AppCard className="p-5">
          <h2 className="font-bold">Recent Messages</h2>
          <div className="mt-4 space-y-4">
            {conversations.slice(0, 2).map((message) => (
              <div key={message.id} className="flex items-center gap-3">
                <div className="size-11 rounded-full bg-neutral-200" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{message.name}</p>
                  <p className="truncate text-sm text-neutral-600">{message.message}</p>
                </div>
                <span className="text-xs text-neutral-500">{message.time}</span>
              </div>
            ))}
          </div>
          <Link href="/customer/messages"><AppButton className="mt-5 w-full" size="sm">Go to Messages</AppButton></Link>
        </AppCard>
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <AppCard className="p-5">
          <h2 className="font-bold">My Saved Designs</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {savedDesigns.slice(0, 3).map((design) => (
              <Link key={design.id} href="/customer/saved-designs" className="group">
                <AppImage src={design.image} alt={design.title} className="aspect-[1.5/1] rounded-lg" sizes="220px" imageClassName="transition duration-500 group-hover:scale-[1.04]" />
                <p className="mt-2 text-sm font-bold">{design.title}</p>
                <p className="text-xs text-neutral-600">{design.fabric}</p>
              </Link>
            ))}
          </div>
          <Link href="/customize-your-sofa"><AppButton className="mt-5">Continue Customizing</AppButton></Link>
        </AppCard>
        <AppCard className="p-5">
          <h2 className="font-bold">You Recently Viewed</h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {wishlistItems.slice(0, 3).map((item) => (
              <Link key={item.id} href="/customer/wishlist">
                <AppImage src={item.image} alt={item.title} className="aspect-square rounded-lg" sizes="130px" />
                <p className="mt-2 text-xs font-bold">{item.title}</p>
              </Link>
            ))}
          </div>
        </AppCard>
      </div>
      <div className="mt-6 flex flex-col gap-3 text-sm font-semibold text-neutral-700 sm:flex-row sm:items-center sm:justify-between">
        <span>Need help? Our team is here</span>
        <span>WhatsApp Us</span>
        <span>Call Us</span>
      </div>
    </>
  );
}
