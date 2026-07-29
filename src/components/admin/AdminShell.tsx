"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, UserRound } from "lucide-react";
import { signOut } from "next-auth/react";
import { adminSections } from "@/lib/admin-data";
import { AppLogo } from "@/components/layout/AppLogo";
import { AppThemeToggle } from "@/components/app/AppThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function AdminNav() {
  const pathname = usePathname();
  const groups = [...new Set(adminSections.map((item) => item.group))];

  return (
    <nav className="space-y-6">
      {groups.map((group) => (
        <div key={group}>
          <p className="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">{group}</p>
          <div className="mt-2 space-y-1">
            {adminSections.filter((item) => item.group === group).map(({ href, label, icon: Icon }) => {
              const active = pathname === href;

              return (
                <Link key={href} href={href} className={cn("flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition", active ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950" : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-white/10")}>
                  <Icon className="size-4" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50 lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-900 lg:block">
        <AppLogo imageClassName="w-40" />
        <div className="mt-8">
          <AdminNav />
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-neutral-200 bg-white/90 px-4 backdrop-blur dark:border-white/10 dark:bg-neutral-900/90 sm:px-6">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger render={<Button variant="outline" size="icon" className="lg:hidden" />}>
                <Menu className="size-4" />
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SheetHeader>
                  <SheetTitle>SHANY Admin</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-6">
                  <AdminNav />
                </div>
              </SheetContent>
            </Sheet>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">Admin Panel</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Catalog, leads and showroom operations</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AppThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger render={<button className="rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-neutral-950 dark:focus-visible:ring-white" />}>
                <Avatar>
                  <AvatarFallback className="bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">SL</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-2">
                    <UserRound className="size-4" />
                    Shany Admin
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
                  <LogOut className="size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
