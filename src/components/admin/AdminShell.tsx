"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { adminNotifications, adminSections } from "@/lib/admin-data";
import { AppAccountMenu } from "@/components/app/AppAccountMenu";
import { AppNotificationBell } from "@/components/app/AppNotificationBell";
import { AppLogo } from "@/components/layout/AppLogo";
import { AppThemeToggle } from "@/components/app/AppThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { persistSidebarPreference, sidebarCookies } from "@/lib/sidebar-preference";
import { useNotifications } from "@/hooks/use-notifications";

const groupKeys = new Map(adminSections.map((item) => [item.group, item.groupKey]));

function AdminNav({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const t = useTranslations("adminPanel");
  const navLabel = (key: string, fallback: string) => (t.has(key) ? t(key) : fallback);
  const groups = [...new Set(adminSections.map((item) => item.group))];

  return (
    <nav className="space-y-6">
      {groups.map((group) => (
        <div key={group}>
          {collapsed ? null : (
            <p className="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">{navLabel("nav." + (groupKeys.get(group) ?? ""), group)}</p>
          )}
          <div className={cn("space-y-1", collapsed ? "mt-0" : "mt-2")}>
            {adminSections.filter((item) => item.group === group).map(({ href, label, labelKey, icon: Icon }) => {
              const active = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  title={collapsed ? navLabel("nav." + labelKey, label) : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition",
                    collapsed && "justify-center px-0",
                    active
                      ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950"
                      : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-white/10"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {collapsed ? <span className="sr-only">{navLabel("nav." + labelKey, label)}</span> : navLabel("nav." + labelKey, label)}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function AdminShell({ children, defaultCollapsed = false }: { children: React.ReactNode; defaultCollapsed?: boolean }) {
  const ts = useTranslations("adminPanel.shell");
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const notificationsQuery = useNotifications("admin");
  const name = session?.user?.name ?? "Shany Admin";
  const email = session?.user?.email;
  const avatar = session?.user?.image;

  const toggleCollapsed = () => {
    setCollapsed((previous) => {
      const next = !previous;
      persistSidebarPreference(sidebarCookies.admin, next);

      return next;
    });
  };

  return (
    <div className="admin-theme flex min-h-screen w-full bg-neutral-100 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-e border-neutral-200 bg-white p-4 transition-[width] duration-200 dark:border-white/10 dark:bg-neutral-900 lg:flex",
          collapsed ? "w-20" : "w-72"
        )}
      >
        <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between")}>
          {collapsed ? null : (
            <>
              <AppLogo className="dark:hidden" imageClassName="w-32" />
              <AppLogo variant="light" className="hidden dark:inline-flex" imageClassName="w-32" />
            </>
          )}
          <Button variant="ghost" size="icon" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={toggleCollapsed}>
            {collapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />}
          </Button>
        </div>
        <div className="mt-8 min-h-0 flex-1 overflow-y-auto">
          <AdminNav collapsed={collapsed} />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-neutral-200 bg-white/90 px-4 backdrop-blur dark:border-white/10 dark:bg-neutral-900/90 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger render={<Button variant="outline" size="icon" aria-label={ts("openMenu")} className="lg:hidden" />}>
                <Menu className="size-4" />
              </SheetTrigger>
              <SheetContent side="left" className="w-80 max-w-[86vw] p-0">
                <SheetHeader>
                  <SheetTitle>{ts("adminMenu")}</SheetTitle>
                </SheetHeader>
                <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
                  <AdminNav onNavigate={() => setMobileOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
            <div className="min-w-0">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">{ts("adminPanelTitle")}</p>
              <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">{ts("adminPanelHint")}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <AppThemeToggle />
            <AppNotificationBell items={notificationsQuery.data ?? adminNotifications} viewAllHref="/admin/messages" />
            <AppAccountMenu
              name={name}
              email={email}
              avatar={avatar}
              profileHref="/admin/profile"
              settingsHref="/admin/settings"
              signOutUrl="/admin/login"
            />
          </div>
        </header>
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
