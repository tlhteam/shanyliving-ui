import { Heart, ShoppingBag } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppImage } from "@/components/app/AppImage";
import { CustomerTopbar } from "@/components/customer/CustomerShell";
import { wishlistItems } from "@/lib/customer-panel";

export default function WishlistPage() {
  return (
    <>
      <CustomerTopbar title="Wishlist" subtitle="Your favorite pieces, all in one place. Add items to your wishlist and save them for later." />
      <div className="mb-5 flex justify-end gap-3">
        <AppButton variant="outline">Share Wishlist</AppButton>
        <AppButton className="gap-2"><ShoppingBag className="size-4" /> Add All to Cart</AppButton>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wishlistItems.map((item) => (
          <AppCard key={item.id} className="overflow-hidden p-0">
            <div className="relative">
              <AppImage src={item.image} alt={item.title} className="aspect-[1.15/1]" sizes="25vw" />
              <span className="absolute end-3 top-3 grid size-8 place-items-center rounded-full bg-white/80"><Heart className="size-4" /></span>
            </div>
            <div className="p-4">
              <p className="font-bold">{item.title}</p>
              <p className="mt-1 text-xs text-neutral-600">Linen Weave · Beige</p>
              <p className="mt-2 font-bold">₪ {new Intl.NumberFormat("en").format(item.price)}</p>
              <AppButton variant="outline" className="mt-4 w-full" size="sm">View Details</AppButton>
            </div>
          </AppCard>
        ))}
      </div>
    </>
  );
}
