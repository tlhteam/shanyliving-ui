"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  time: string;
  unread?: boolean;
  href?: string;
};

type AppNotificationBellProps = {
  items: AppNotification[];
  viewAllHref?: string;
  className?: string;
};

export function AppNotificationBell({ items, viewAllHref, className }: AppNotificationBellProps) {
  const unread = items.filter((item) => item.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
            className={cn(
              "relative grid size-10 shrink-0 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-800 transition hover:bg-neutral-100 dark:border-white/15 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-white/10",
              className
            )}
          />
        }
      >
        <span className="contents">
          <Bell className="size-5" />
          {unread ? (
            <span className="absolute -top-0.5 -inset-e-0.5 grid min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unread}
            </span>
          ) : null}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-w-[92vw]">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-neutral-500">Notifications</span>
            {unread ? <span className="text-xs font-semibold text-neutral-500">{unread} unread</span> : null}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {items.length ? (
            items.map((item) => (
              <DropdownMenuItem key={item.id} render={item.href ? <Link href={item.href} /> : undefined} className="items-start gap-3 py-2.5">
                <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", item.unread ? "bg-red-500" : "bg-neutral-300")} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{item.title}</span>
                  <span className="mt-0.5 block truncate text-xs text-neutral-500">{item.message}</span>
                  <span className="mt-1 block text-[11px] text-neutral-400">{item.time}</span>
                </span>
              </DropdownMenuItem>
            ))
          ) : (
            <p className="px-2 py-6 text-center text-sm text-neutral-500">No notifications yet.</p>
          )}
          {viewAllHref ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href={viewAllHref} />} className="justify-center text-sm font-bold">
                View all
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
