import Link from "next/link";
import { cn } from "@/lib/utils";

export type AppMenuItem = { label: string; href: string };

export function AppMenu({
  items,
  className,
  itemClassName,
  onNavigate
}: {
  items: AppMenuItem[];
  className?: string;
  itemClassName?: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className={cn("flex items-center gap-6", className)}>
      {items.map((item) => (
        <Link
          key={`${item.label}-${item.href}`}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "text-sm font-bold text-neutral-800 transition hover:text-neutral-950 dark:text-neutral-200 dark:hover:text-white",
            itemClassName
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
