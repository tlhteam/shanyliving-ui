import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type SiteIconName =
  | "arrow-left"
  | "arrow-right"
  | "award"
  | "bag"
  | "bot"
  | "cart"
  | "check"
  | "chevron-down"
  | "chevron-left"
  | "chevron-right"
  | "clock"
  | "copy"
  | "fabric"
  | "gem"
  | "gift"
  | "globe"
  | "grid"
  | "heart"
  | "image"
  | "lock"
  | "mail"
  | "map-pin"
  | "menu"
  | "message"
  | "minus"
  | "move-3d"
  | "palette"
  | "phone"
  | "plus"
  | "ruler"
  | "save"
  | "search"
  | "shield"
  | "sofa"
  | "sparkle"
  | "star"
  | "trash"
  | "truck"
  | "upload"
  | "user"
  | "users"
  | "x"
  | "zoom-in"
  | "zoom-out";

type SiteIconProps = HTMLAttributes<HTMLSpanElement> & {
  name: SiteIconName;
};

const paths: Record<SiteIconName, string[]> = {
  "arrow-left": ["M19 12H5", "M12 5l-7 7 7 7"],
  "arrow-right": ["M5 12h14", "M12 5l7 7-7 7"],
  award: ["M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z", "M8.5 14.2 7 22l5-3 5 3-1.5-7.8"],
  bag: ["M6 8h12l1 12H5L6 8Z", "M9 8a3 3 0 0 1 6 0"],
  bot: ["M8 8h8a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-5a3 3 0 0 1 3-3Z", "M12 4v4", "M9 13h.01", "M15 13h.01", "M10 17h4"],
  cart: ["M4 5h2l2.2 10.5a2 2 0 0 0 2 1.5H17a2 2 0 0 0 1.9-1.4L21 9H7", "M10 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z", "M18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"],
  check: ["M5 12.5 10 17l9-10"],
  "chevron-down": ["M7 10l5 5 5-5"],
  "chevron-left": ["M15 6l-6 6 6 6"],
  "chevron-right": ["M9 6l6 6-6 6"],
  clock: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M12 7v5l3 2"],
  copy: ["M9 9h10v10H9Z", "M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"],
  fabric: ["M4 6c4-2 8 2 12 0 1.5-.7 3-.9 4-.6V18c-1-.3-2.5-.1-4 .6-4 2-8-2-12 0V6Z", "M8 7v11", "M14 7v11"],
  gem: ["M6.5 4h11L22 10l-10 11L2 10 6.5 4Z", "M2 10h20", "M8 4l4 17 4-17"],
  gift: ["M4 11h16v10H4Z", "M2.8 7h18.4v4H2.8Z", "M12 7v14", "M12 7c-2.5 0-4-1-4-2.4C8 3.5 9 3 10 3c1.2 0 2 1.4 2 4Z", "M12 7c2.5 0 4-1 4-2.4C16 3.5 15 3 14 3c-1.2 0-2 1.4-2 4Z"],
  globe: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M3 12h18", "M12 3c2.2 2.5 3.2 5.5 3.2 9s-1 6.5-3.2 9", "M12 3c-2.2 2.5-3.2 5.5-3.2 9s1 6.5 3.2 9"],
  grid: ["M4 4h6v6H4Z", "M14 4h6v6h-6Z", "M4 14h6v6H4Z", "M14 14h6v6h-6Z"],
  heart: ["M12 20s-7-4.4-9-8.6C1.8 8.8 3.5 6 6.4 6c1.7 0 3.2 1 4 2.3C11.2 7 12.7 6 14.4 6c2.9 0 4.6 2.8 3.4 5.4C16 15.6 12 20 12 20Z"],
  image: ["M4 5h16v14H4Z", "M8 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z", "M4 16l4.5-4 3.5 3 2.5-2.5L20 17"],
  lock: ["M6 10h12v10H6Z", "M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10"],
  mail: ["M4 6h16v12H4Z", "M4 7l8 6 8-6"],
  "map-pin": ["M12 21s7-5.2 7-11a7 7 0 0 0-14 0c0 5.8 7 11 7 11Z", "M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"],
  menu: ["M4 7h16", "M4 12h16", "M4 17h16"],
  message: ["M5 5h14v10H8l-4 4V6a1 1 0 0 1 1-1Z"],
  minus: ["M5 12h14"],
  "move-3d": ["M12 3v18", "M8 7l4-4 4 4", "M8 17l4 4 4-4", "M3 12h18", "M7 8 3 12l4 4", "M17 8l4 4-4 4"],
  palette: ["M12 21a9 9 0 1 1 8.9-10.4c.3 2-1.1 3.4-3.1 3.4h-1.3c-1.1 0-2 .9-2 2 0 .5.2.9.5 1.3.9 1.4-.1 3.7-3 3.7Z", "M7.5 10h.01", "M10 6.8h.01", "M14.5 7.2h.01", "M17 11h.01"],
  phone: ["M7 4h3l1 5-2 1c1.1 2.3 2.7 3.9 5 5l1-2 5 1v3c0 1.1-.9 2-2 2C10.3 19 5 13.7 5 6c0-1.1.9-2 2-2Z"],
  plus: ["M12 5v14", "M5 12h14"],
  ruler: ["M4 17 17 4l3 3L7 20Z", "M8 17l-1.5-1.5", "M11 14l-1.5-1.5", "M14 11l-1.5-1.5"],
  save: ["M5 4h12l2 2v14H5Z", "M8 4v6h8V4", "M8 16h8"],
  search: ["M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z", "M16 16l5 5"],
  shield: ["M12 21s7-3.4 7-9V5l-7-3-7 3v7c0 5.6 7 9 7 9Z", "M8.5 12l2.4 2.4 4.8-5"],
  sofa: ["M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3", "M4 12h16a2 2 0 0 1 2 2v4H2v-4a2 2 0 0 1 2-2Z", "M5 18v2", "M19 18v2"],
  sparkle: ["M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z", "M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"],
  star: ["M12 3.2 14.6 9l6.4.5-4.9 4.2 1.5 6.1L12 16.6 6.4 19.8 7.9 13.7 3 9.5 9.4 9 12 3.2Z"],
  trash: ["M4 7h16", "M9 7V5h6v2", "M7 7l1 13h8l1-13", "M10 11v5", "M14 11v5"],
  truck: ["M3 6h11v10H3Z", "M14 10h4l3 3v3h-7Z", "M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z", "M17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"],
  upload: ["M12 16V4", "M7 9l5-5 5 5", "M5 20h14"],
  user: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M4 21a8 8 0 0 1 16 0"],
  users: ["M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M3 21a6 6 0 0 1 12 0", "M17 11a3 3 0 1 0 0-6", "M16 16.5a5 5 0 0 1 5 4.5"],
  x: ["M6 6l12 12", "M18 6 6 18"],
  "zoom-in": ["M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z", "M16 16l5 5", "M10.5 7.5v6", "M7.5 10.5h6"],
  "zoom-out": ["M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z", "M16 16l5 5", "M7.5 10.5h6"]
};

export function SiteIcon({ name, className, ...props }: SiteIconProps) {
  return (
    <span aria-hidden="true" className={cn("inline-flex size-5 shrink-0 items-center justify-center", className)} {...props}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-full">
        {paths[name].map((path) => <path key={path} d={path} />)}
      </svg>
    </span>
  );
}
