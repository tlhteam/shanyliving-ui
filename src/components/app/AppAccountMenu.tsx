"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut, Settings, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { mediaUrl } from "@/lib/media";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type AppAccountMenuProps = {
  name: string;
  email?: string | null;
  avatar?: string | null;
  profileHref: string;
  settingsHref: string;
  signOutUrl?: string;
  showName?: boolean;
  className?: string;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "SL";
}

export function AppAccountMenu({
  name,
  email,
  avatar,
  profileHref,
  settingsHref,
  signOutUrl = "/",
  showName = false,
  className
}: AppAccountMenuProps) {
  const avatarSrc = mediaUrl(avatar);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label="Account menu"
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full outline-none ring-offset-2 transition focus-visible:ring-2 focus-visible:ring-neutral-950 dark:focus-visible:ring-white",
              className
            )}
          />
        }
      >
        <span className="contents">
          <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-neutral-950 text-xs font-bold text-white dark:bg-white dark:text-neutral-950">
            {avatarSrc ? <Image src={avatarSrc} alt={name} fill sizes="40px" className="object-cover" /> : initials(name)}
          </span>
          {showName ? <span className="hidden max-w-32 truncate text-sm font-bold sm:block">{name}</span> : null}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 max-w-[92vw]">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <span className="block truncate text-sm font-bold">{name}</span>
            {email ? <span className="mt-0.5 block truncate text-xs font-normal text-neutral-500">{email}</span> : null}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href={profileHref} />}>
            <UserRound className="size-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href={settingsHref} />}>
            <Settings className="size-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => signOut({ callbackUrl: signOutUrl })}>
            <LogOut className="size-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
